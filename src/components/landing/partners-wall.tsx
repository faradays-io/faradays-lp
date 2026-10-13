'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { PARTNERS } from '@/components/landing/partners-section'
import { useCopy } from '@/components/language-provider'
import { ptSerif } from '@/lib/fonts'
import type { Localized } from '@/lib/i18n'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const COPY = {
	pt: { title: 'Empresas que confiam na Faradays' },
	en: { title: 'Companies that trust Faradays' }
} satisfies Localized<Record<string, string>>

/* Células da parede: 3 linhas × 6 no desktop. */
const CELLS = 18

/* Mais marcas FICTÍCIAS (placeholder, `public/company/dummy/`) só da parede,
   para o segundo conjunto do ciclo. A conta fecha em 36 = 2 × 18. */
const EXTRA = [
	['Corvus', 'corvus'],
	['Delta Agro', 'delta'],
	['Ember', 'ember'],
	['Fjord', 'fjord'],
	['Granite', 'granite'],
	['Halo', 'halo'],
	['Ionic', 'ionic'],
	['Jade', 'jade'],
	['Kestrel', 'kestrel'],
	['Lynx', 'lynx'],
	['Mosaic', 'mosaic'],
	['Onyx', 'onyx'],
	['Pinnacle', 'pinnacle'],
	['Quartz', 'quartz'],
	['Radian', 'radian'],
	['Voltix', 'voltix']
].map(([name, slug]) => ({ name, src: `/company/dummy/${slug}.svg` }))

/* PLACEHOLDER: o link de cada marca (case, site do cliente) entra aqui
   quando as marcas forem reais; por ora todas apontam para a própria seção. */
const LOGOS = [...PARTNERS, ...EXTRA].map((partner) => ({
	...partner,
	href: '#partners'
}))

/* Conjuntos de 18 que se revezam nas células. */
const SETS = Array.from({ length: Math.ceil(LOGOS.length / CELLS) }, (_, k) =>
	LOGOS.slice(k * CELLS, (k + 1) * CELLS)
)

/* Passo entre uma diagonal e a seguinte (s). */
const DIAGONAL_STEP = 0.07
/* Quanto cada conjunto fica de pé antes da troca (s). */
const HOLD = 4.5

/**
 * Parede de logos (referência: harvey.ai). Título centrado e 18 marcas em
 * grade — 6 colunas no desktop, sem filetes nem moldura: só o espaço separa.
 * Repouso em cinza apagado; o hover devolve a cor da marca, e cada marca é
 * um link.
 *
 * Entrada e saída são o mesmo fade leve, em cascata diagonal: do canto
 * superior esquerdo ao inferior direito. A diagonal de cada célula (linha +
 * coluna) é medida na tela, então a cascata segue certa em 2 ou 3 colunas.
 *
 * Com a seção na tela, a cascata se repete a cada `HOLD`: o conjunto atual
 * sai e o próximo entra, célula a célula na mesma onda — é o que diz que
 * há mais empresas do que cabem na grade. Cada célula empilha um logo por
 * conjunto; `autoAlpha` esconde (e tira do clique) os que não estão na vez.
 * O ciclo pausa com o cursor sobre a grade e para quando a seção sai.
 */
export function PartnersWall() {
	const t = useCopy(COPY)
	const rootRef = useRef<HTMLElement>(null)
	const ready = usePageReady()

	useEffect(() => {
		const root = rootRef.current
		if (!root || !ready) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
			return

		let timer: gsap.core.Tween | undefined
		const grid = root.querySelector<HTMLElement>('[data-wall-grid]')
		if (!grid) return

		let current = 0
		let inView = false
		let hovering = false
		const onPointerEnter = () => (hovering = true)
		const onPointerLeave = () => (hovering = false)

		const ctx = gsap.context(() => {
			const cells = gsap.utils.toArray<HTMLElement>('[data-wall-cell]')
			const layer = (k: number) =>
				cells
					.map((cell) =>
						cell.querySelector<HTMLElement>(
							`[data-wall-set="${k}"]`
						)
					)
					.filter((el): el is HTMLElement => el !== null)

			gsap.set('[data-wall-set]', { autoAlpha: 0 })

			/* Índice da diagonal de cada célula, pela posição renderizada. */
			const diagonals = () => {
				const tops = [...new Set(cells.map((el) => el.offsetTop))]
				const lefts = [...new Set(cells.map((el) => el.offsetLeft))]
				tops.sort((a, b) => a - b)
				lefts.sort((a, b) => a - b)
				return cells.map(
					(el) =>
						tops.indexOf(el.offsetTop) +
						lefts.indexOf(el.offsetLeft)
				)
			}

			const fade = (k: number, autoAlpha: number, delay = 0) => {
				const order = diagonals()
				gsap.to(layer(k), {
					autoAlpha,
					duration: 0.6,
					ease: 'power1.out',
					overwrite: true,
					delay,
					stagger: (i) => order[i] * DIAGONAL_STEP
				})
			}

			const schedule = () => {
				timer?.kill()
				if (SETS.length < 2) return
				timer = gsap.delayedCall(HOLD, swap)
			}

			function swap() {
				if (!inView) return
				if (hovering) return schedule()
				const next = (current + 1) % SETS.length
				fade(current, 0)
				// Cada célula troca logo depois de apagar: a onda que leva
				// um conjunto é a mesma que traz o outro.
				fade(next, 1, 0.35)
				current = next
				schedule()
			}

			const enter = () => {
				inView = true
				fade(current, 1)
				schedule()
			}

			const leave = () => {
				inView = false
				timer?.kill()
				SETS.forEach((_, k) => fade(k, 0))
			}

			ScrollTrigger.create({
				trigger: grid,
				start: 'top 85%',
				end: 'bottom 15%',
				onEnter: enter,
				onEnterBack: enter,
				onLeave: leave,
				onLeaveBack: leave
			})
		}, root)

		grid.addEventListener('pointerenter', onPointerEnter)
		grid.addEventListener('pointerleave', onPointerLeave)
		return () => {
			timer?.kill()
			grid.removeEventListener('pointerenter', onPointerEnter)
			grid.removeEventListener('pointerleave', onPointerLeave)
			ctx.revert()
		}
	}, [ready])

	return (
		<section id="partners" ref={rootRef} className="py-28 lg:py-40">
			<div className="max-w-page mx-auto w-full px-[var(--gutter)]">
				<h2
					className={cn(
						ptSerif.className,
						'text-center text-[2.5rem]/[1.1] font-medium text-balance lg:text-[3rem]/[1.05]'
					)}
				>
					{t.title}
				</h2>

				<ul
					data-wall-grid
					className="mx-auto mt-16 grid max-w-[var(--grid-10)] grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:mt-24 lg:grid-cols-6"
				>
					{Array.from({ length: CELLS }, (_, cell) => (
						<li
							key={cell}
							data-wall-cell
							className="relative h-24 lg:h-28"
						>
							{SETS.map((set, k) => {
								const partner = set[cell]
								if (!partner) return null
								return (
									<a
										key={partner.name}
										href={partner.href}
										data-wall-set={k}
										aria-label={partner.name}
										/* Sem JS (ou sem movimento) só o
										   primeiro conjunto aparece. */
										className={cn(
											'group absolute inset-0 flex cursor-pointer items-center justify-center',
											k > 0 && 'invisible'
										)}
									>
										<span className="relative h-8 w-36 opacity-45 grayscale transition-[opacity,filter] duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0">
											<Image
												src={partner.src}
												alt=""
												fill
												sizes="144px"
												className="object-contain"
											/>
										</span>
									</a>
								)
							})}
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
