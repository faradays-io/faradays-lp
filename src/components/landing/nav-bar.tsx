'use client'

import gsap from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

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

	return (
		<header ref={headerRef} className="fixed inset-x-0 top-0 z-50 p-7">
			<nav className="flex h-9 w-full items-center justify-between">
				<Link
					href="/"
					data-nav-item
					className="flex items-center opacity-0"
				>
					<Image
						src="/logo.png"
						alt="Faradays"
						width={1420}
						height={334}
						priority
						className="h-9 w-auto invert"
					/>
				</Link>

				<div className="flex items-center gap-3">
					<button
						data-nav-item
						aria-label="Switch language"
						onClick={() =>
							setLanguage((l) => (l === 'en' ? 'pt' : 'en'))
						}
						className="bg-background text-foreground/80 hover:text-foreground flex size-9 items-center justify-center rounded-md border font-mono text-sm font-semibold uppercase opacity-0 transition-colors"
					>
						{language}
					</button>
					<Button
						asChild
						data-nav-item
						className="h-9 px-5 font-sans text-base normal-case opacity-0"
					>
						<Link href="#cta">See a demo</Link>
					</Button>
				</div>
			</nav>
		</header>
	)
}
