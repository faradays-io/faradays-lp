'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

gsap.registerPlugin(ScrollTrigger)

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { FaradaysLockup } from '@/components/landing/faradays-lockup'
import { Button } from '@/components/ui/button'

type Language = 'en' | 'pt'

export function NavBar() {
	const [language, setLanguage] = useState<Language>('en')
	const headerRef = useRef<HTMLElement>(null)

	useEffect(() => {
		const root = headerRef.current
		if (!root) return
		const ctx = gsap.context(() => {
			gsap.fromTo(
				'[data-nav-item]',
				{ autoAlpha: 0, y: -16 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 0.9,
					ease: 'power3.out',
					stagger: 0.08,
					delay: 0.3
				}
			)
		}, root)
		return () => ctx.revert()
	}, [])

	// Scroll down esconde a nav (depois de 120px); scroll up devolve.
	useEffect(() => {
		const header = headerRef.current
		if (!header) return
		let hidden = false
		const slide = (yPercent: number) =>
			gsap.to(header, { yPercent, duration: 0.45, ease: 'power3.out' })
		const st = ScrollTrigger.create({
			start: 0,
			end: 'max',
			onUpdate: (self) => {
				const shouldHide = self.direction === 1 && self.scroll() > 120
				if (shouldHide === hidden) return
				hidden = shouldHide
				slide(shouldHide ? -110 : 0)
			}
		})
		return () => st.kill()
	}, [])

	return (
		<header ref={headerRef} className="fixed inset-x-0 top-0 z-50 p-7">
			<nav className="flex h-9 w-full items-center justify-between">
				<Link
					href="/"
					data-nav-item
					aria-label="Faradays"
					className="flex items-center opacity-0"
				>
					<FaradaysLockup className="h-6 w-auto" />
				</Link>

				<div className="flex items-center gap-3">
					<SplitHoverText
						as="button"
						data-nav-item
						aria-label="Switch language"
						onClick={() =>
							setLanguage((l) => (l === 'en' ? 'pt' : 'en'))
						}
						className="bg-background text-foreground/80 hover:text-foreground flex size-9 items-center justify-center rounded-md border font-mono text-sm font-semibold uppercase opacity-0 transition-colors"
					>
						{language}
					</SplitHoverText>
					<Button
						asChild
						data-nav-item
						className="h-9 px-5 font-sans text-base normal-case opacity-0"
					>
						<Link href="#cta">
							<SplitHoverText as="span">
								See a demo
							</SplitHoverText>
						</Link>
					</Button>
				</div>
			</nav>
		</header>
	)
}
