'use client'

import { ArrowDown } from '@phosphor-icons/react'
import gsap from 'gsap'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { Button } from '@/components/ui/button'
import { usePageReady } from '@/lib/page-ready'

const FACTS: Array<[string, string]> = [
	['Empresa', 'Faradays'],
	['ICT', 'Unicamp'],
	['Interveniente', 'Funcamp'],
	['Natureza', 'PD&I']
]

/**
 * Hero de /credito — apresenta o projeto de pesquisa em cooperação com a
 * Unicamp: eyebrow, título do projeto, subtítulo e a ficha das partes.
 */
export function CreditoHero() {
	const rootRef = useRef<HTMLElement>(null)
	const ready = usePageReady()

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const items = root.querySelectorAll('[data-hero-item]')
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(items, { autoAlpha: 1 })
			return
		}
		if (!ready) return
		const ctx = gsap.context(() => {
			gsap.fromTo(
				'[data-hero-item]',
				{ autoAlpha: 0, y: 40 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 1.1,
					ease: 'power3.out',
					stagger: 0.1,
					delay: 0.05
				}
			)
		}, root)
		return () => ctx.revert()
	}, [ready])

	return (
		<section
			id="hero"
			ref={rootRef}
			className="bg-background relative -mt-23 flex flex-col pt-23"
		>
			<div className="flex min-h-[calc(100svh-5.75rem)] w-full flex-col items-center justify-center px-7 pt-14 pb-16 text-center">
				<span
					data-hero-item
					className="text-foreground/50 mb-7 font-mono text-sm tracking-widest uppercase opacity-0"
				>
					(pesquisa &amp; desenvolvimento — crédito)
				</span>

				<h1
					data-hero-item
					className="font-heading max-w-5xl text-5xl leading-[0.95] tracking-tight text-balance opacity-0 min-[810px]:text-[4.5rem]"
				>
					Otimização dinâmica de crédito
				</h1>

				<p
					data-hero-item
					className="text-body-lg text-foreground/70 mt-6 max-w-2xl text-balance opacity-0"
				>
					Superando a previsão estática com aprendizagem por reforço:
					um projeto de PD&amp;I da Faradays em cooperação com a
					Unicamp para transformar a análise de crédito de inferência
					passiva em política de decisão que aprende — com cada
					aprovação e com cada recusa.
				</p>

				<div
					data-hero-item
					className="mt-8 flex items-center gap-3 opacity-0"
				>
					<Button asChild size="lg" className="px-6">
						<Link href="#projeto">
							<SplitHoverText as="span">
								Conheça o projeto
							</SplitHoverText>
						</Link>
					</Button>
					<Button asChild size="lg" variant="ghost" className="px-6">
						<Link href="#escopo">
							<SplitHoverText as="span">
								Ver o escopo
							</SplitHoverText>
							<ArrowDown className="size-4" />
						</Link>
					</Button>
				</div>

				<dl
					data-hero-item
					className="mt-14 flex flex-wrap items-start justify-center gap-x-12 gap-y-6 opacity-0"
				>
					{FACTS.map(([term, value]) => (
						<div key={term} className="flex flex-col gap-1">
							<dt className="text-foreground/50 font-mono text-xs tracking-widest uppercase">
								{term}
							</dt>
							<dd className="font-heading text-xl">{value}</dd>
						</div>
					))}
				</dl>
			</div>
		</section>
	)
}
