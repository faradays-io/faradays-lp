'use client'

import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { useEffect, useRef, useState } from 'react'

import { FaradaysComposed } from '@/components/landing/faradays-composed'
import { claimPageReady, markPageReady, usePageReady } from '@/lib/page-ready'

gsap.registerPlugin(ScrollTrigger, CustomEase)

/* A mesma curva do --ease-fluid do CSS, registrada para os tweens da saída. */
const EASE_FLUID = CustomEase.create('fluid', '0.625, 0.05, 0, 1')

/* Rampa estática: corre solta de 0 a 67% — daí em diante quem manda é o
   carregamento real (load + fontes + intro da logo). */
const HOLD_AT = 0.67
const RAMP_DURATION = 1.4
const RAMP_DURATION_WARM = 0.9
/* Fecho: 67 → 100% quando tudo está pronto, com um respiro em 100%. */
const CLOSE_DURATION = 0.45
const HOLD_AT_FULL = 0.25
const LOAD_TIMEOUT_MS = 8000

/**
 * Loader da rota raiz (as demais usam o `PageTransition`). Tela escura com:
 * barra de progresso grudada no topo (preenchimento, não rastro), percentual
 * no canto inferior direito e a logo ao centro — o wordmark entra em split
 * (letra a letra, direto nos paths do SVG) e depois o ícone desliza pela
 * esquerda. Na saída: a barra sai da esquerda para a direita (ease fluid), o
 * painel escuro revela a página de baixo para cima e, ao mesmo tempo, a logo
 * viaja e encolhe até a posição/tamanho do lockup da home
 * (`[data-home-lockup]`).
 */
export function HomeLoader() {
	const overlayRef = useRef<HTMLDivElement>(null)
	const barRef = useRef<HTMLDivElement>(null)
	const labelRef = useRef<HTMLSpanElement>(null)
	const logoLayerRef = useRef<HTMLDivElement>(null)
	const logoRef = useRef<HTMLDivElement>(null)
	const lenis = useLenis()
	const ready = usePageReady()

	/* Claim em tempo de render — ver comentário em page-transition.tsx. */
	const [warm] = useState(
		() => typeof window !== 'undefined' && claimPageReady()
	)

	useEffect(() => {
		window.history.scrollRestoration = 'manual'
		window.scrollTo(0, 0)

		const overlay = overlayRef.current
		const bar = barRef.current
		const label = labelRef.current
		const logoLayer = logoLayerRef.current
		const logo = logoRef.current
		if (!overlay || !bar || !label || !logoLayer || !logo) return

		const target = document.querySelector<HTMLElement>('[data-home-lockup]')

		const finish = () => {
			overlay.style.display = 'none'
			logoLayer.style.display = 'none'
			if (target) gsap.set(target, { autoAlpha: 1 })
			markPageReady()
			ScrollTrigger.refresh()
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			finish()
			return
		}

		/* O lockup real fica invisível (mas com layout) até a logo do loader
		   pousar em cima dele. */
		if (target) gsap.set(target, { autoAlpha: 0 })

		const state = { p: 0 }
		const draw = () => {
			bar.style.transform = `scaleX(${state.p})`
			label.textContent = `${Math.round(state.p * 100)}%`
		}
		draw()

		/* Split da logo: como no footer, cada letra é um <g.wm-letter> — o
		   grupo interno não carrega o translate posicional, então animar
		   x/y aqui nunca desalinha os glifos (o 'y' que o diga). O ícone é
		   o primeiro <svg> do lockup composto. */
		const mark = logo.querySelector('svg')
		const letters = gsap.utils.toArray<SVGGElement>('.wm-letter', logo)
		gsap.set(mark, { opacity: 0, x: -28 })
		gsap.set(letters, { opacity: 0, y: 30 })

		let outro: gsap.core.Timeline | undefined
		let done = false
		let rampDone = false
		/* load + fontes + intro da logo: o fecho espera os três. */
		let pending = 3

		/* power2.out com duração curta: o rabo longo do power3 deixava as
		   letras assentando em subpixels por tempo demais — era isso o
		   "tremor" vertical no fim. O clearProps zera os transforms ao
		   terminar (como o footer faz), garantindo rasterização estável. */
		const intro = gsap
			.timeline({
				delay: 0.15,
				onComplete: () => {
					gsap.set(letters, { clearProps: 'transform' })
					if (mark) gsap.set(mark, { clearProps: 'transform' })
					settle()
				}
			})
			.to(letters, {
				opacity: 1,
				y: 0,
				duration: 0.45,
				/* power1: o fim quase linear atravessa a zona de subpixel
				   depressa em vez de rastejar por ela (o resto do tremor). */
				ease: 'power1.out',
				stagger: 0.055
			})
			.to(
				mark,
				{
					opacity: 1,
					x: 0,
					duration: 0.5,
					ease: 'power2.out'
				},
				'>-0.2'
			)

		const release = () => {
			if (done || !rampDone || pending > 0) return
			done = true

			outro = gsap
				.timeline({ onComplete: finish })
				/* Fecha o progresso e respira em 100%. */
				.to(state, {
					p: 1,
					duration: CLOSE_DURATION,
					ease: 'power2.out',
					onUpdate: draw
				})
				.to({}, { duration: HOLD_AT_FULL })
				/* 1) A barra sai da esquerda para a direita. */
				.set(bar, { transformOrigin: 'right center' })
				.to(bar, { scaleX: 0, duration: 0.55, ease: EASE_FLUID })
				.to(label, { autoAlpha: 0, duration: 0.3 }, '<')
				/* 2) O painel revela a página de baixo para cima — DENTRO da
				   timeline: o finish() do onComplete só pode rodar depois
				   disto terminar (numa timeline separada ele cortava o
				   reveal no meio: a página "teleportava"). */
				.to(
					overlay,
					{
						clipPath: 'inset(0% 0% 100% 0%)',
						duration: 0.8,
						ease: 'power4.out'
					},
					'>-0.1'
				)

			/* Logo viaja/encolhe até o lockup da home junto do reveal. Os
			   valores são funções: o GSAP as avalia quando o tween começa,
			   já com a página em layout final por baixo do overlay. */
			const targetLogo = target?.querySelector<HTMLElement>(
				'[data-faradays-logo]'
			)
			if (targetLogo) {
				let morph: { x: number; y: number; scale: number } | null = null
				const measure = () => {
					if (!morph) {
						const from = logo.getBoundingClientRect()
						const to = targetLogo.getBoundingClientRect()
						morph = {
							x:
								to.left +
								to.width / 2 -
								(from.left + from.width / 2),
							y:
								to.top +
								to.height / 2 -
								(from.top + from.height / 2),
							scale: to.width / from.width
						}
					}
					return morph
				}
				outro.to(
					logo,
					{
						x: () => measure().x,
						y: () => measure().y,
						scale: () => measure().scale,
						color: getComputedStyle(targetLogo).color,
						duration: 0.8,
						ease: 'power4.out',
						transformOrigin: 'center center'
					},
					'<'
				)
			} else {
				outro.to(logo, { autoAlpha: 0, duration: 0.5 }, '<')
			}
		}

		gsap.set(overlay, { clipPath: 'inset(0% 0% 0% 0%)' })

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

		const forceRelease = () => {
			rampDone = true
			pending = 0
			ramp.kill()
			intro.progress(1)
			release()
		}

		const failsafe = window.setTimeout(forceRelease, LOAD_TIMEOUT_MS)

		return () => {
			cancelled = true
			window.removeEventListener('load', onLoad)
			window.clearTimeout(failsafe)
			ramp.kill()
			intro.kill()
			outro?.kill()
		}
	}, [warm])

	/* Scroll travado enquanto o loader está na tela. */
	useEffect(() => {
		if (!lenis) return
		if (ready) {
			lenis.start()
			return
		}
		lenis.stop()
		return () => lenis.start()
	}, [lenis, ready])

	return (
		<>
			<div
				ref={overlayRef}
				aria-hidden
				className="dark pointer-events-none fixed inset-0 z-100 bg-[#0f0f0e]"
			>
				{/* Progress bar grudada no topo, preenchida da esquerda, sem
				   trilho atrás. transform inline (não `scale-x-0`): a utility
				   do Tailwind v4 usa a propriedade `scale`, que multiplicaria
				   com o scaleX que o draw() escreve em `transform`. */}
				<div
					ref={barRef}
					className="absolute inset-x-0 top-0 h-1 bg-neutral-100"
					style={{
						transform: 'scaleX(0)',
						transformOrigin: 'left center'
					}}
				/>
				{/* Percentual no canto inferior direito. */}
				<span
					ref={labelRef}
					className="absolute right-7 bottom-6 font-mono text-lg text-neutral-100"
				>
					0%
				</span>
			</div>
			{/* A logo vive numa camada própria acima do overlay: o reveal
			   (clip de baixo para cima) não pode cortá-la enquanto ela viaja
			   até o lockup da home. */}
			<div
				ref={logoLayerRef}
				aria-hidden
				className="pointer-events-none fixed inset-0 z-101 flex items-center justify-center"
			>
				<div ref={logoRef} className="text-neutral-100">
					<FaradaysComposed className="h-10 md:h-14" />
				</div>
			</div>
		</>
	)
}
