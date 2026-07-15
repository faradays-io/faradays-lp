'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

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

	useEffect(() => {
		const el = ref.current
		if (!el) return
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
	}, [delay, y, start, trigger])

	return (
		<div ref={ref} className={cn('will-change-transform', className)}>
			{children}
		</div>
	)
}
