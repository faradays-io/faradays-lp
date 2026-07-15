'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Parallax cover: as each child scrolls into view it shifts up over the
 * previous one, which stays in flow and fades while being covered.
 * Transform-based only — no pinning / position fixed. Children must have an
 * opaque background to actually cover what's behind.
 */
export function StackedSections({ children }: { children: React.ReactNode }) {
	const rootRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const root = rootRef.current
		if (!root) return

		const panels = Array.from(root.children) as HTMLElement[]

		const ctx = gsap.context(() => {
			panels.forEach((panel, i) => {
				// Later panels paint above the ones drifting behind them.
				gsap.set(panel, { position: 'relative', zIndex: i + 1 })

				const next = panels[i + 1]
				if (!next) return

				gsap.timeline({
					defaults: { ease: 'none' },
					scrollTrigger: {
						trigger: next,
						start: 'top 100%',
						end: 'top 35%',
						scrub: true
					}
				})
					// Fade hits hardest at the start and settles toward the end.
					.to(panel, { opacity: 0.2, ease: 'power2.out' }, 0)
					.to(next, { yPercent: -100 }, 0)
			})
		}, root)

		return () => ctx.revert()
	}, [])

	return <div ref={rootRef}>{children}</div>
}
