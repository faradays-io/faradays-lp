'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

gsap.registerPlugin(ScrollTrigger)

import { CaretDown } from '@phosphor-icons/react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { FaradaysLockup } from '@/components/landing/faradays-lockup'
import { SOLUTIONS } from '@/components/landing/solutions-data'
import { Button } from '@/components/ui/button'
import { usePageReady } from '@/lib/page-ready'

type Language = 'en' | 'pt'

/* Dropdown "Soluções" — abre por hover/focus (CSS puro via group), painel
   com o nome da solução e a rota em mono; itens "em breve" não clicam. */
function SolutionsMenu() {
	return (
		<div data-nav-item className="group relative hidden opacity-0 md:block">
			<button
				type="button"
				aria-haspopup="menu"
				className="text-foreground/80 hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
			>
				Soluções
				<CaretDown className="size-3 transition-transform duration-200 group-hover:rotate-180" />
			</button>
			{/* pt-3 faz ponte de hover entre o gatilho e o painel. */}
			<div className="pointer-events-none absolute top-full left-0 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
				<div className="bg-background border-border min-w-72 rounded-md border p-1.5 shadow-lg">
					{SOLUTIONS.map((solution) =>
						solution.available ? (
							<Link
								key={solution.slug}
								href={solution.slug}
								className="hover:bg-foreground/5 flex items-center justify-between gap-8 rounded-[0.3rem] px-3 py-2.5 transition-colors"
							>
								<span className="text-sm">{solution.name}</span>
								<span className="text-foreground/40 font-mono text-xs">
									{solution.slug}
								</span>
							</Link>
						) : (
							<div
								key={solution.slug}
								aria-disabled
								className="flex items-center justify-between gap-8 rounded-[0.3rem] px-3 py-2.5"
							>
								<span className="text-foreground/40 text-sm">
									{solution.name}
								</span>
								<span className="text-foreground/30 font-mono text-xs">
									(em breve)
								</span>
							</div>
						)
					)}
				</div>
			</div>
		</div>
	)
}

export function NavBar({ solutions = false }: { solutions?: boolean } = {}) {
	const [language, setLanguage] = useState<Language>('en')
	const headerRef = useRef<HTMLElement>(null)
	const ready = usePageReady()

	useEffect(() => {
		const root = headerRef.current
		if (!root) return
		// Só depois do loader — antes disso a nav entrava por baixo dele.
		if (!ready) return
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
	}, [ready])

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
				<div className="flex items-center gap-10">
					<Link
						href="/"
						data-nav-item
						aria-label="Faradays"
						className="flex items-center opacity-0"
					>
						<FaradaysLockup className="h-6 w-auto" />
					</Link>
					{solutions && <SolutionsMenu />}
				</div>

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
