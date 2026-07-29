'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useLayoutEffect, useRef } from 'react'

import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

/* useLayoutEffect avisa quando roda no servidor; no cliente ele é o único que
   esconde o bloco antes da pintura. */
const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** Fade-up on first scroll into view. */
export function Reveal({
	children,
	className,
	delay = 0,
	y = 36,
	start = 'top 85%',
	trigger
}: {
	children: React.ReactNode
	className?: string
	delay?: number
	y?: number
	/** ScrollTrigger start — pass earlier values for transformed sections. */
	start?: string
	/** Selector to watch instead of the element itself (e.g. the section). */
	trigger?: string
}) {
	const ref = useRef<HTMLDivElement>(null)
	const ready = usePageReady()

	/* Esconde antes da primeira pintura pós-hidratação: sem isso o conteúdo
	   aparece e só depois some para o fade-up (e, com o loader, ficaria
	   visível durante toda a espera). */
	useIsomorphicLayoutEffect(() => {
		const el = ref.current
		if (!el || ready) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
			return
		gsap.set(el, { autoAlpha: 0 })
	}, [ready])

	useEffect(() => {
		const el = ref.current
		if (!el) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(el, { autoAlpha: 1 })
			return
		}
		// ScrollTrigger avalia o gatilho na criação: criar antes do fim do
		// loader dispararia o fade em tudo que já está em viewport.
		if (!ready) return
		const ctx = gsap.context(() => {
			gsap.fromTo(
				el,
				{ autoAlpha: 0, y },
				{
					autoAlpha: 1,
					y: 0,
					duration: 1.1,
					delay,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: trigger ?? el,
						start,
						once: true
					}
				}
			)
		})
		return () => ctx.revert()
	}, [delay, y, start, trigger, ready])

	return (
		<div ref={ref} className={cn('will-change-transform', className)}>
			{children}
		</div>
	)
}
