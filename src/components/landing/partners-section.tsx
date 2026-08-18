'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, SplitText)

/**
 * Partners — grade técnica de logos (referência: docs/image copy 4.png).
 * Moldura fechada; linhas-fio entre células via `gap-px` sobre fundo
 * `border`; pontos de registro nos cantos de cada célula formam o cluster
 * nas interseções.
 * Repouso: logo monocromática (máscara no alpha do PNG, cor do foreground).
 * Hover: célula em cinza claro e o PNG original por cima devolve a cor da
 * marca.
 */
const PARTNERS = [
	{ name: 'Monfiza', src: '/company/monfiza.png' },
	{ name: 'Aventis', src: '/company/aventis.png' }
]

/* Colunas responsivas: 2 (base) → 3 (md) → 4 (xl) → 5 (2xl) — breakpoints
   um passo acima do usual para garantir uma largura mínima de célula maior.
   Células vazias (sem hover) completam a última linha; cada filler só
   aparece nos breakpoints em que é necessário — classes literais para o
   Tailwind. */
const neededFillers = (cols: number) => (cols - (PARTNERS.length % cols)) % cols

const fillerClass = (i: number) =>
	cn(
		i < neededFillers(2) ? 'block' : 'hidden',
		i < neededFillers(3) ? 'md:block' : 'md:hidden',
		i < neededFillers(4) ? 'xl:block' : 'xl:hidden',
		i < neededFillers(5) ? '2xl:block' : '2xl:hidden'
	)

const MAX_FILLERS = Math.max(
	neededFillers(2),
	neededFillers(3),
	neededFillers(4),
	neededFillers(5)
)

function CornerDots() {
	return (
		<>
			<span
				aria-hidden
				className="bg-foreground/30 absolute top-1.5 left-1.5 z-10 size-[3px] rounded-full"
			/>
			<span
				aria-hidden
				className="bg-foreground/30 absolute top-1.5 right-1.5 z-10 size-[3px] rounded-full"
			/>
			<span
				aria-hidden
				className="bg-foreground/30 absolute bottom-1.5 left-1.5 z-10 size-[3px] rounded-full"
			/>
			<span
				aria-hidden
				className="bg-foreground/30 absolute right-1.5 bottom-1.5 z-10 size-[3px] rounded-full"
			/>
		</>
	)
}

export function PartnersSection() {
	const rootRef = useRef<HTMLElement>(null)
	const ready = usePageReady()

	const containerRef = useRef<HTMLDivElement>(null)
	const highlightRef = useRef<HTMLDivElement>(null)

	/* Highlight deslizante — segue o cursor célula a célula. Invisível até o
	   primeiro hover; a entrada faz snap (sem transição) para a célula sob o
	   cursor e só o fade anima; depois disso o transform transiciona e o
	   bloco "viaja" entre células na direção do movimento. */
	useEffect(() => {
		const container = containerRef.current
		const highlight = highlightRef.current
		if (!container || !highlight) return

		let visible = false

		const moveToCell = (cell: HTMLElement) => {
			const rect = cell.getBoundingClientRect()
			const containerRect = container.getBoundingClientRect()
			const snap = !visible

			if (snap) highlight.style.transition = 'none'
			highlight.style.transform = `translate(${rect.left - containerRect.left}px, ${rect.top - containerRect.top}px)`
			highlight.style.width = `${rect.width}px`
			highlight.style.height = `${rect.height}px`
			if (snap) {
				// Aplica a posição antes de reativar a transição, senão o
				// snap de entrada anima desde a posição anterior.
				void highlight.offsetWidth
				highlight.style.transition = ''
			}
			highlight.style.opacity = '1'
			visible = true
		}

		const onMouseMove = (event: MouseEvent) => {
			const cell = (event.target as HTMLElement | null)?.closest(
				'[data-partners-cell]'
			)
			if (cell instanceof HTMLElement) moveToCell(cell)
		}

		const onMouseLeave = () => {
			highlight.style.opacity = '0'
			visible = false
		}

		container.addEventListener('mousemove', onMouseMove)
		container.addEventListener('mouseleave', onMouseLeave)
		return () => {
			container.removeEventListener('mousemove', onMouseMove)
			container.removeEventListener('mouseleave', onMouseLeave)
		}
	}, [])

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		// ScrollTrigger avalia o gatilho na criação — antes do fim do loader
		// a seção poderia já estar em viewport e animar sob ele.
		if (!ready) return
		let ctx: gsap.Context | undefined
		let split: SplitText | undefined
		let cancelled = false
		// Espera as fontes carregarem para o SplitText medir os glifos certos.
		document.fonts.ready.then(() => {
			if (cancelled) return
			ctx = gsap.context(() => {
				split = SplitText.create('[data-partners-title]', {
					type: 'chars',
					mask: 'chars'
				})
				gsap.timeline({
					scrollTrigger: {
						trigger: root,
						start: 'top 85%',
						once: true
					}
				})
					.from(split.chars, {
						yPercent: 110,
						duration: 0.7,
						ease: 'power3.out',
						stagger: 0.035
					})
					.from(
						'[data-partners-logo]',
						{
							autoAlpha: 0,
							y: 24,
							duration: 0.9,
							ease: 'power3.out',
							stagger: 0.06
						},
						'-=0.35'
					)
			}, root)
		})
		return () => {
			cancelled = true
			ctx?.revert()
			split?.revert()
		}
	}, [ready])

	return (
		<section id="partners" ref={rootRef} className="px-7 py-24 md:py-36">
			<div className="w-full">
				<div className="border-border border">
					<div className="border-border border-b px-5 py-4">
						<h2
							data-partners-title
							className="text-body-lg font-medium uppercase"
						>
							Our partners
						</h2>
					</div>

					<div
						ref={containerRef}
						className="bg-border relative grid grid-cols-2 gap-px md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
					>
						{PARTNERS.map((partner) => (
							<div
								key={partner.name}
								data-partners-cell
								className="group bg-background relative flex h-52 items-center justify-center md:h-64"
							>
								<CornerDots />
								<div
									data-partners-logo
									className="relative z-10 h-10 w-44 will-change-transform"
								>
									<div
										role="img"
										aria-label={partner.name}
										className="bg-foreground absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
										style={{
											maskImage: `url(${partner.src})`,
											maskPosition: 'center',
											maskRepeat: 'no-repeat',
											maskSize: 'contain'
										}}
									/>
									<Image
										src={partner.src}
										alt=""
										fill
										sizes="176px"
										className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
									/>
								</div>
							</div>
						))}

						{/* Células vazias (sem hover) completam a última linha; cada filler só
						   aparece nos breakpoints em que é necessário — classes literais para o
						   Tailwind. */}
						{Array.from({ length: MAX_FILLERS }, (_, i) => (
							<div
								key={`filler-${i}`}
								aria-hidden
								className={cn(
									'bg-background relative h-52 md:h-64',
									fillerClass(i)
								)}
							>
								<CornerDots />
							</div>
						))}

						{/* Highlight deslizante — fica acima do fundo das células
						   (vem depois no DOM) e abaixo dos logos (z-10). */}
						<div
							ref={highlightRef}
							aria-hidden
							className="bg-muted pointer-events-none absolute top-0 left-0 opacity-0 transition-all duration-200"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
