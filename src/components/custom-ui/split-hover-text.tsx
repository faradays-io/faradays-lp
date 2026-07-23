'use client'

import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import type { ElementType, HTMLAttributes } from 'react'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

gsap.registerPlugin(SplitText)

type SplitHoverTextProps = {
	/** Elemento raiz — normalmente 'a', 'button' ou 'span' (default). */
	as?: ElementType
	/** Texto a animar (uma string; o roll precisa de conteúdo estável). */
	children: string
	className?: string
	/** Classes no wrapper de texto interno (ex.: cor, leading). */
	textClassName?: string
	href?: string
	type?: 'button' | 'submit' | 'reset'
} & HTMLAttributes<HTMLElement> & {
		[dataAttr: `data-${string}`]: string | undefined
	}

/**
 * Texto com roll vertical por caractere no hover (SplitText). Ao passar o
 * mouse, cada letra sobe e uma cópia idêntica entra por baixo, com stagger.
 *
 * O hover é escutado no ancestral clicável mais próximo (`a`/`button`),
 * então funciona mesmo quando o texto está dentro de um botão com padding —
 * ou quando o próprio componente é o `<a>`/`<button>`. Sem JS ou com
 * `prefers-reduced-motion`, a camada de baixo fica oculta e o texto é
 * estático.
 */
export function SplitHoverText({
	as,
	children,
	className,
	textClassName,
	...rest
}: SplitHoverTextProps) {
	const Comp = (as ?? 'span') as ElementType
	const rootRef = useRef<HTMLElement>(null)

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const top = root.querySelector<HTMLElement>('[data-sht="top"]')
		const bottom = root.querySelector<HTMLElement>('[data-sht="bottom"]')
		if (!top || !bottom) return
		// Dispara pelo elemento clicável (self quando as='a'/'button').
		const hoverTarget =
			(root.closest('a, button') as HTMLElement | null) ?? root

		let mm: gsap.MatchMedia | undefined
		let cancelled = false
		// Espera as fontes para o SplitText medir os glifos certos.
		document.fonts.ready.then(() => {
			if (cancelled) return
			mm = gsap.matchMedia()
			mm.add('(prefers-reduced-motion: no-preference)', () => {
				const topSplit = SplitText.create(top, {
					type: 'chars',
					aria: 'none'
				})
				const bottomSplit = SplitText.create(bottom, {
					type: 'chars',
					aria: 'none'
				})
				// Revela a camada de baixo (oculta por CSS) e posiciona seus
				// caracteres uma linha abaixo, prontos para subir.
				gsap.set(bottom, { autoAlpha: 1 })
				gsap.set(bottomSplit.chars, { yPercent: 100 })

				const tl = gsap
					.timeline({ paused: true })
					.to(
						topSplit.chars,
						{
							yPercent: -100,
							duration: 0.4,
							ease: 'power3.inOut',
							stagger: 0.025
						},
						0
					)
					.to(
						bottomSplit.chars,
						{
							yPercent: 0,
							duration: 0.4,
							ease: 'power3.inOut',
							stagger: 0.025
						},
						0
					)

				const play = () => tl.play()
				const reverse = () => tl.reverse()
				hoverTarget.addEventListener('mouseenter', play)
				hoverTarget.addEventListener('mouseleave', reverse)
				hoverTarget.addEventListener('focus', play)
				hoverTarget.addEventListener('blur', reverse)

				return () => {
					hoverTarget.removeEventListener('mouseenter', play)
					hoverTarget.removeEventListener('mouseleave', reverse)
					hoverTarget.removeEventListener('focus', play)
					hoverTarget.removeEventListener('blur', reverse)
					tl.kill()
					topSplit.revert()
					bottomSplit.revert()
				}
			})
		})
		return () => {
			cancelled = true
			mm?.revert()
		}
	}, [children])

	return (
		<Comp ref={rootRef} className={className} {...rest}>
			<span
				className={cn(
					'relative inline-block overflow-hidden align-bottom',
					textClassName
				)}
			>
				<span data-sht="top" aria-hidden className="block">
					{children}
				</span>
				<span
					data-sht="bottom"
					aria-hidden
					className="invisible absolute inset-0 block"
				>
					{children}
				</span>
				<span className="sr-only">{children}</span>
			</span>
		</Comp>
	)
}
