'use client'

/* BACKUP do loader antigo (faixa em gradiente com percentual na ponta).
   Mantido fora de uso enquanto o novo par HomeLoader/PageTransition assenta —
   para restaurar, troque o import nas pages de volta para este componente. */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { useEffect, useRef, useState } from 'react'

import { claimPageReady, markPageReady, usePageReady } from '@/lib/page-ready'

gsap.registerPlugin(ScrollTrigger)

/* A barra corre solta de 0 a HOLD_AT num tempo confortável — é a parte que
   precisa parecer animação, não medição. Daí em diante quem manda é o
   carregamento: ela espera em HOLD_AT e só fecha quando a página está pronta. */
const HOLD_AT = 0.99
const RAMP_DURATION = 1.2
/* Navegação client-side (módulo quente, rota em cache): a espera real é
   quase nula, então a rampa encurta para o loader ser um respiro, não um
   pedágio. */
const RAMP_DURATION_WARM = 0.95
/* Fecho: fecha o último ponto percentual, respira em 100% e só então some. */
const CLOSE_DURATION = 0.35
const HOLD_AT_FULL = 0.3
/* Se algum recurso travar, libera assim mesmo: nada justifica manter a página
   congelada indefinidamente. */
const LOAD_TIMEOUT_MS = 8000

/**
 * Transição de página: só o loader (referências: docs/image copy 8.png e
 * 9.png) — uma faixa em gradiente que viaja da esquerda para a direita
 * acompanhando o progresso, pequena no início, esticada no meio e encolhendo
 * no fim, com o percentual ancorado na ponta por uma linha tracejada e um
 * marcador azul, sobre um fundo cheio no `--background` da página, que sai em
 * fade no fim (a versão que saía em colunas está em `PageTransitionCurtain`).
 *
 * A barra corre de 0 a 99% em ritmo próprio (contínuo, sem degraus) e espera
 * ali: o ponto final só fecha quando `load` + fontes terminam, então ela
 * segura 0,3s em 100% e sai. Só aí `markPageReady()` solta as animações do
 * site inteiro (nav, hero, ScrollTriggers, canvas); até lá o scroll fica
 * travado. Com `prefers-reduced-motion`, libera imediatamente.
 */
export function PageTransitionLegacy() {
	const overlayRef = useRef<HTMLDivElement>(null)
	const anchorRef = useRef<HTMLDivElement>(null)
	const barRef = useRef<HTMLDivElement>(null)
	const labelRef = useRef<HTMLSpanElement>(null)
	const lenis = useLenis()
	const ready = usePageReady()

	/* Em tempo de render, antes de qualquer efeito: avisa a store que este
	   loader é quem vai dar o sinal, senão ela se resolveria sozinha no
	   `load` (e em cache quente isso acontece antes do nosso fecho). No
	   inicializador do useState para rodar só no mount — o claim rebaixa
	   `ready`, e re-renders posteriores (o próprio flip do `usePageReady`)
	   não podem desfazer o sinal que o loader acabou de dar. */
	const [warm] = useState(
		() => typeof window !== 'undefined' && claimPageReady()
	)

	useEffect(() => {
		// Reload sempre começa do topo, independente de hash ou posição
		// restaurada pelo navegador.
		window.history.scrollRestoration = 'manual'
		window.scrollTo(0, 0)

		const overlay = overlayRef.current
		const anchor = anchorRef.current
		const bar = barRef.current
		const label = labelRef.current
		if (!overlay || !anchor || !bar || !label) return

		const finish = () => {
			overlay.style.display = 'none'
			markPageReady()
			// As fontes chegaram depois do primeiro layout e vários triggers
			// acabaram de ser criados: remede tudo.
			ScrollTrigger.refresh()
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			finish()
			return
		}

		const state = { p: 0 }
		const draw = () => {
			const p = state.p
			// Ponta direita da faixa viaja de 8vw a 92vw…
			anchor.style.left = `${8 + 84 * p}vw`
			// …enquanto a largura cresce e encolhe (senóide).
			bar.style.width = `${2 + 20 * Math.sin(Math.PI * p)}vw`
			label.textContent = `${Math.round(p * 100)}%`
		}
		draw()

		let outro: gsap.core.Timeline | undefined
		let done = false
		let rampDone = false
		let pending = 2

		const release = () => {
			// O ponto final só fecha com a rampa terminada e a página pronta.
			if (done || !rampDone || pending > 0) return
			done = true
			outro = gsap
				.timeline({ onComplete: finish })
				.to(state, {
					p: 1,
					duration: CLOSE_DURATION,
					ease: 'power2.out',
					onUpdate: draw
				})
				// Respiro em 100% antes de sair.
				.to({}, { duration: HOLD_AT_FULL })
				.to(anchor, { autoAlpha: 0, duration: 0.2, ease: 'power2.out' })
				// O fundo sai por último, revelando a página já montada.
				.to(overlay, {
					autoAlpha: 0,
					duration: 0.45,
					ease: 'power2.inOut'
				})
		}

		/* 0 → 99% em tempo próprio: contínuo, sem degraus. */
		const ramp = gsap.to(state, {
			p: HOLD_AT,
			duration: warm ? RAMP_DURATION_WARM : RAMP_DURATION,
			ease: 'power1.inOut',
			onUpdate: draw,
			onComplete: () => {
				rampDone = true
				release()
			}
		})

		/* Espera o `load` (que já cobre imagens e subrecursos) e as fontes. */
		const settle = () => {
			pending--
			release()
		}

		const onLoad = () => settle()
		if (document.readyState === 'complete') onLoad()
		else window.addEventListener('load', onLoad, { once: true })

		let cancelled = false
		document.fonts.ready.then(() => {
			if (cancelled) return
			settle()
		})

		/* Destrava o fecho de vez: usado só pela rede de segurança. */
		const forceRelease = () => {
			rampDone = true
			pending = 0
			ramp.kill()
			release()
		}

		// Rede de segurança: um recurso preso (imagem/iframe lento) não pode
		// deixar a página congelada para sempre.
		const failsafe = window.setTimeout(forceRelease, LOAD_TIMEOUT_MS)

		return () => {
			cancelled = true
			window.removeEventListener('load', onLoad)
			window.clearTimeout(failsafe)
			ramp.kill()
			outro?.kill()
		}
	}, [warm])

	/* Nada de rolar por baixo do loader: as seções abaixo animam na entrada em
	   viewport e o usuário passaria por elas antes de terem permissão para
	   animar. */
	useEffect(() => {
		if (!lenis) return
		if (ready) {
			lenis.start()
			return
		}
		lenis.stop()
		// Se o componente sair antes do fecho, o scroll não pode ir junto.
		return () => lenis.start()
	}, [lenis, ready])

	return (
		<div
			ref={overlayRef}
			aria-hidden
			className="bg-background pointer-events-none fixed inset-0 z-100"
		>
			{/* Âncora = ponta direita da faixa de progresso. */}
			<div
				ref={anchorRef}
				className="absolute top-1/2"
				style={{ left: '8vw' }}
			>
				<div
					ref={barRef}
					className="absolute right-0 bottom-0 h-3"
					style={{
						width: '2vw',
						background:
							'linear-gradient(90deg, rgba(47, 125, 255, 0) 0%, #2f7dff 45%, var(--foreground) 100%)'
					}}
				/>
				<div className="border-foreground/40 absolute bottom-3 left-0 h-12 border-l border-dashed" />
				<div className="absolute bottom-[4.6rem] left-0 flex items-center gap-2">
					<span className="size-2.5 bg-[#2f7dff]" />
					<span
						ref={labelRef}
						className="text-foreground font-mono text-sm"
					>
						0%
					</span>
				</div>
			</div>
		</div>
	)
}
