'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'

import { claimPageReady, markPageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

/* Colunas da cortina — sempre 12 no DOM, mas a quantidade visível depende
   da largura da tela (as demais ficam display:none e as visíveis dividem a
   largura via flex-1): 4 no mobile, 8 em md+, 12 em xl+. Classes literais
   para o Tailwind. */
const COLUMN_VISIBILITY = (i: number) => {
	if (i < 4) return 'block'
	if (i < 8) return 'hidden md:block'
	return 'hidden xl:block'
}
const COLUMN_COUNT = 12

/**
 * Versão anterior (backup) da transição de página: cortina preta cobrindo a
 * tela com o loader por cima (referências: docs/image copy 8.png e 9.png) —
 * uma faixa em gradiente que viaja da esquerda para a direita acompanhando o
 * progresso, pequena no início, esticada no meio e encolhendo no fim, com o
 * percentual ancorado na ponta por uma linha tracejada e um marcador azul. Ao
 * completar, a cortina sai em colunas que caem em cascata para baixo, e o
 * evento PAGE_TRANSITION_COMPLETE avisa quem quiser encadear animações. Com
 * `prefers-reduced-motion`, revela imediatamente.
 *
 * Mantida fora de uso — a transição ativa é `PageTransition` (só a faixa de
 * progresso, sem cortina). Compartilha o mesmo evento, então dá para trocar
 * uma pela outra sem mexer em quem escuta.
 */
export function PageTransitionCurtain() {
	const overlayRef = useRef<HTMLDivElement>(null)
	const anchorRef = useRef<HTMLDivElement>(null)
	const barRef = useRef<HTMLDivElement>(null)
	const labelRef = useRef<HTMLSpanElement>(null)

	if (typeof window !== 'undefined') claimPageReady()

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
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			finish()
			return
		}

		const columns = overlay.querySelectorAll('[data-column]')
		const state = { p: 0 }
		const tl = gsap.timeline({
			onComplete: () => {
				finish()
			}
		})
		tl.to(state, {
			p: 1,
			duration: 1.8,
			ease: 'power1.inOut',
			onUpdate: () => {
				const p = state.p
				// Ponta direita da faixa viaja de 8vw a 92vw…
				anchor.style.left = `${8 + 84 * p}vw`
				// …enquanto a largura cresce e encolhe (senóide).
				bar.style.width = `${2 + 20 * Math.sin(Math.PI * p)}vw`
				label.textContent = `${Math.round(p * 100)}%`
			}
		})
			// Some o loader e derruba as colunas em cascata (esq → dir).
			.to(anchor, { autoAlpha: 0, duration: 0.25, ease: 'power2.out' })
			.to(
				columns,
				{
					yPercent: 100,
					duration: 0.8,
					ease: 'power3.inOut',
					stagger: 0.07
				},
				'-=0.05'
			)
		return () => {
			tl.kill()
		}
	}, [])

	return (
		<div ref={overlayRef} aria-hidden className="fixed inset-0 z-100">
			<div className="absolute inset-0 flex">
				{Array.from({ length: COLUMN_COUNT }, (_, i) => (
					<div
						key={i}
						data-column
						className={cn(
							// -mr-px cobre frestas de subpixel entre colunas.
							'-mr-px h-full flex-1 bg-black last:mr-0',
							COLUMN_VISIBILITY(i)
						)}
					/>
				))}
			</div>

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
							'linear-gradient(90deg, rgba(47, 125, 255, 0) 0%, #2f7dff 45%, #ffffff 100%)'
					}}
				/>
				<div className="absolute bottom-3 left-0 h-12 border-l border-dashed border-white/40" />
				<div className="absolute bottom-[4.6rem] left-0 flex items-center gap-2">
					<span className="size-2.5 bg-[#2f7dff]" />
					<span
						ref={labelRef}
						className="font-mono text-sm text-white"
					>
						0%
					</span>
				</div>
			</div>
		</div>
	)
}
