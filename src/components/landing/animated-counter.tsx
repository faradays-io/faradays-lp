'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

/** Counts from 0 to `value` when scrolled into view. */
export function AnimatedCounter({
	value,
	suffix = '',
	duration = 2,
	className
}: {
	value: number
	suffix?: string
	duration?: number
	className?: string
}) {
	const ref = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const state = { n: 0 }
		const ctx = gsap.context(() => {
			gsap.to(state, {
				n: value,
				duration,
				ease: 'power2.out',
				snap: { n: 1 },
				scrollTrigger: { trigger: el, start: 'top 85%', once: true },
				onUpdate: () => {
					el.textContent = `${state.n}${suffix}`
				}
			})
		})
		return () => ctx.revert()
	}, [value, suffix, duration])

	return (
		<span ref={ref} className={cn('tabular-nums', className)}>
			0{suffix}
		</span>
	)
}
