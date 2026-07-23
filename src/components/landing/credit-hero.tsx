'use client'

import { ArrowDown } from '@phosphor-icons/react'
import gsap from 'gsap'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { DriftCanvas } from '@/components/landing/drift-canvas'
import { Button } from '@/components/ui/button'

const FACTS: Array<[string, string]> = [
	['Decisão', 'Política, não score'],
	['Adaptação', 'Sem retreino'],
	['Fairness', 'Na função objetivo']
]

export function CreditHero() {
	const rootRef = useRef<HTMLElement>(null)

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const ctx = gsap.context(() => {
			gsap.fromTo(
				'[data-hero-item]',
				{ autoAlpha: 0, y: 40 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 1.2,
					ease: 'power3.out',
					stagger: 0.12,
					delay: 0.15
				}
			)
		}, root)
		return () => ctx.revert()
	}, [])

	return (
		<section
			ref={rootRef}
			className="relative -mt-23 flex min-h-svh flex-col overflow-hidden"
		>
			<div className="grid w-full flex-1 items-center gap-10 px-7 pt-36 pb-14 lg:grid-cols-2 lg:gap-14">
				<div className="flex max-w-2xl flex-col items-start">
					<span
						data-hero-item
						className="text-muted-foreground font-mono text-sm tracking-wide uppercase opacity-0"
					>
						(inteligência de crédito)
					</span>

					<h1
						data-hero-item
						className="mt-6 font-serif text-5xl leading-[0.95] tracking-tight text-balance opacity-0 min-[810px]:text-[4.25rem]"
					>
						O mercado muda. O seu modelo de crédito fica parado.
					</h1>

					<p
						data-hero-item
						className="text-body-lg text-foreground/70 mt-6 max-w-xl opacity-0"
					>
						A Faradays constrói um motor de decisão dinâmico:
						políticas de crédito que aprendem com cada aprovação — e
						com cada recusa — para maximizar retorno a longo prazo,
						não apenas prever o default de amanhã.
					</p>

					<div
						data-hero-item
						className="mt-8 flex flex-wrap items-center gap-3 opacity-0"
					>
						<Button asChild size="lg">
							<Link href="#poc">Começar por uma PoC</Link>
						</Button>
						<Link
							href="#produto"
							className="text-foreground/70 hover:text-foreground inline-flex items-center gap-2 px-2 text-sm font-medium transition-colors"
						>
							Ver o produto
							<ArrowDown className="size-4" />
						</Link>
					</div>

					<dl
						data-hero-item
						className="mt-14 flex flex-wrap gap-x-12 gap-y-6 opacity-0"
					>
						{FACTS.map(([term, value]) => (
							<div key={term} className="flex flex-col gap-1">
								<dt className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
									{term}
								</dt>
								<dd className="font-heading text-xl">
									{value}
								</dd>
							</div>
						))}
					</dl>
				</div>

				<div
					data-hero-item
					className="dark bg-background relative h-[52svh] w-full overflow-hidden rounded-3xl border opacity-0 lg:h-[72svh]"
				>
					<DriftCanvas className="absolute inset-0" />
					<span className="text-foreground/60 absolute bottom-5 left-6 font-mono text-xs tracking-wide uppercase">
						Simulação — a distribuição desliza, o corte estático não
					</span>
				</div>
			</div>
		</section>
	)
}
