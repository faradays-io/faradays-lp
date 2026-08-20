'use client'

import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import type { ElementType, HTMLAttributes, Ref } from 'react'
import { useEffect, useImperativeHandle, useRef } from 'react'

import { cn } from '@/lib/utils'

gsap.registerPlugin(SplitText)

const ROLL_DURATION = 0.4
const ROLL_STAGGER = 0.025

export type SplitSwapHandle = {
	/** Duração total do roll, em segundos (0 antes do setup / reduced-motion). */
	duration: () => number
}

type SplitSwapTextProps = {
	/** Rótulo em repouso. */
	from: string
	/** Rótulo que entra na troca. */
	to: string
	/** `true` → o rótulo `to` está à frente. */
	swapped: boolean
	/** Elemento do rótulo — 'span' (default), 'a', 'button'… */
	as?: ElementType
	ref?: Ref<SplitSwapHandle>
	className?: string
	/** Classes só do rótulo de troca — normalmente a cor. */
	toClassName?: string
	/** Nome acessível estável; o padrão é `from`. */
	srLabel?: string
	href?: string
	type?: 'button' | 'submit' | 'reset'
} & HTMLAttributes<HTMLElement>

/**
 * Dois rótulos na mesma linha, trocados por um roll vertical caractere a
 * caractere (SplitText, o mesmo roll do `SplitHoverText`): o de cima sobe e
 * o de baixo entra por trás, com stagger. Quem manda é a prop `swapped` —
 * o componente só toca/reverte a timeline.
 *
 * A raiz é um shell de grade de uma célula só, onde os dois rótulos entram
 * como espaçadores invisíveis: a célula nasce com a largura do mais largo e
 * nunca muda. O rótulo visível flutua por cima, alinhado à esquerda e livre
 * para encolher/crescer com o texto (a largura é animada junto, para o
 * sublinhado ficar justo nos dois) — o que sobra é espaço morto dentro do
 * shell, e nada em volta se desloca.
 *
 * Sem JS ou com `prefers-reduced-motion`, a camada de baixo fica oculta e o
 * rótulo é estático.
 */
export function SplitSwapText({
	from,
	to,
	swapped,
	as,
	ref,
	className,
	toClassName,
	srLabel,
	...rest
}: SplitSwapTextProps) {
	const Comp = (as ?? 'span') as ElementType
	const rollRef = useRef<HTMLSpanElement>(null)
	const timelineRef = useRef<gsap.core.Timeline | null>(null)
	// A timeline nasce depois de `document.fonts.ready`; se a troca chegar
	// antes disso, o estado é aplicado já no setup.
	const swappedRef = useRef(swapped)

	useImperativeHandle(
		ref,
		() => ({ duration: () => timelineRef.current?.duration() ?? 0 }),
		[]
	)

	useEffect(() => {
		const wrap = rollRef.current
		if (!wrap) return
		const fromEl = wrap.querySelector<HTMLElement>('[data-roll="from"]')
		const toEl = wrap.querySelector<HTMLElement>('[data-roll="to"]')
		if (!fromEl || !toEl) return

		let cancelled = false
		let mm: gsap.MatchMedia | undefined

		// Espera as fontes para o SplitText medir os glifos certos.
		document.fonts.ready.then(() => {
			if (cancelled) return
			mm = gsap.matchMedia()
			mm.add(
				{ motion: '(prefers-reduced-motion: no-preference)' },
				(ctx) => {
					// Com reduced-motion o roll vira uma troca seca.
					const duration = ctx.conditions?.motion ? ROLL_DURATION : 0
					const stagger = ctx.conditions?.motion ? ROLL_STAGGER : 0

					const fromSplit = SplitText.create(fromEl, {
						type: 'chars',
						aria: 'none'
					})
					const toSplit = SplitText.create(toEl, {
						type: 'chars',
						aria: 'none'
					})

					const fromWidth = fromEl.getBoundingClientRect().width
					const toWidth = toEl.getBoundingClientRect().width

					// Revela a camada de baixo (oculta por CSS) e desce seus
					// caracteres uma linha, prontos para subir.
					gsap.set(toEl, { autoAlpha: 1 })
					gsap.set(toSplit.chars, { yPercent: 100 })

					const tl = gsap
						.timeline({ paused: true })
						.to(
							fromSplit.chars,
							{
								yPercent: -100,
								duration,
								ease: 'power3.inOut',
								stagger
							},
							0
						)
						.to(
							toSplit.chars,
							{
								yPercent: 0,
								duration,
								ease: 'power3.inOut',
								stagger
							},
							0
						)
						.fromTo(
							wrap,
							{ width: fromWidth },
							{
								width: toWidth,
								duration,
								ease: 'power3.inOut',
								// Só fixa a largura enquanto anima; em repouso
								// o wrapper volta a ser fluido.
								immediateRender: false
							},
							0
						)
					tl.eventCallback('onReverseComplete', () =>
						gsap.set(wrap, { clearProps: 'width' })
					)
					if (swappedRef.current) tl.progress(1)

					timelineRef.current = tl
					return () => {
						timelineRef.current = null
						tl.kill()
						fromSplit.revert()
						toSplit.revert()
						gsap.set(wrap, { clearProps: 'width' })
					}
				}
			)
		})

		return () => {
			cancelled = true
			mm?.revert()
		}
	}, [from, to])

	useEffect(() => {
		swappedRef.current = swapped
		const tl = timelineRef.current
		if (!tl) return
		if (swapped) tl.play()
		else tl.reverse()
	}, [swapped])

	return (
		<span className="inline-grid">
			<span
				aria-hidden
				className={cn('invisible col-start-1 row-start-1', className)}
			>
				{from}
			</span>
			<span
				aria-hidden
				className={cn('invisible col-start-1 row-start-1', className)}
			>
				{to}
			</span>
			<Comp
				className={cn(
					'col-start-1 row-start-1 inline-block justify-self-start',
					className
				)}
				{...rest}
			>
				{/* key: o SplitText muta o DOM por fora do React (o revert
				   restaura clones), então troca de texto via React cairia em
				   nós órfãos. Remontar recria o DOM e o efeito re-splita. */}
				<span
					key={`${from}|${to}`}
					ref={rollRef}
					className="relative inline-block overflow-hidden align-bottom"
				>
					<span data-roll="from" aria-hidden className="block w-max">
						{from}
					</span>
					<span
						data-roll="to"
						aria-hidden
						className={cn(
							'invisible absolute top-0 left-0 block w-max',
							toClassName
						)}
					>
						{to}
					</span>
				</span>
				{/* As camadas são aria-hidden; o nome acessível sai daqui e
				   fica estável — anunciar a cópia é papel de quem usa o
				   componente (role="status"). */}
				<span className="sr-only">{srLabel ?? from}</span>
			</Comp>
		</span>
	)
}
