'use client'

import gsap from 'gsap'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { HeroToolIcons } from '@/components/landing/hero-tool-icons'
import { useRecedeOut } from '@/components/landing/recede-out'
import { useCopy } from '@/components/language-provider'
import { Button } from '@/components/ui/button'
import type { Localized } from '@/lib/i18n'
import { usePageReady } from '@/lib/page-ready'

export const HERO_COPY = {
	pt: {
		// "empresa" cobre distribuidora e indústria numa palavra só. O h1
		// termina em `headlineTail` + ícones das ferramentas (sem ponto).
		headlineLead: 'A operação da sua empresa, onde o seu time já',
		headlineTail: 'trabalha',
		toolsLabel: 'WhatsApp, SharePoint, OneDrive e Excel',
		sub: 'Uma IA que conhece o seu negócio e trabalha onde o time já está, tirando da rotina o que hoje depende de alguém lembrar, conferir e digitar.',
		bookDemo: 'Agende uma demo',
		exploreProduct: 'Conhecer o produto'
	},
	en: {
		headlineLead: "Your company's operation, where your team already",
		headlineTail: 'works',
		toolsLabel: 'WhatsApp, SharePoint, OneDrive and Excel',
		sub: 'An AI that knows your business and works where your team already is, taking off your plate whatever still depends on someone remembering, checking and retyping.',
		bookDemo: 'Book a demo',
		exploreProduct: 'Explore the product'
	}
} satisfies Localized<Record<string, string>>

/**
 * Hero claro (copy no padrão do hero da rota raiz): pill de anúncio,
 * headline display, sub e CTAs com entrada em stagger disparada pelo fim da
 * page transition. O painel ASCII + demo vive logo abaixo, no
 * HeroFeatureFlow — o min-h de 60svh deixa ~40svh dele visível na dobra,
 * o que convida o scroll.
 */
export function HomeHero() {
	const t = useCopy(HERO_COPY)
	const rootRef = useRef<HTMLElement>(null)
	const copyRef = useRef<HTMLDivElement>(null)
	const ready = usePageReady()

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const items = root.querySelectorAll('[data-hero-item]')
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(items, { autoAlpha: 1 })
			return
		}
		// Só depois do loader: até lá os itens ficam em opacity-0 no markup.
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

	/* Saída: o primeiro scroll down recua o bloco inteiro. */
	useRecedeOut(copyRef, { start: 8 })

	/* z-10 na section (sem fundo próprio — o wrapper da página já pinta o
	   bg-background): a camada do traço do HeroFeatureFlow sobe até o topo
	   da página; a copy fica acima dela e o traço aparece por baixo. */
	return (
		<section
			id="hero"
			ref={rootRef}
			className="relative z-10 -mt-23 flex flex-col pt-23"
		>
			{/* Copy + CTA — min-h calculado para deixar ~40svh do painel do
			   HeroFeatureFlow visível na dobra. O padding assimétrico
			   (pt > pb) empurra o bloco ~40px abaixo do centro, mais perto
			   da demo. */}
			<div
				ref={copyRef}
				data-hero-copy
				className="flex min-h-[calc(60svh-5.75rem)] w-full flex-col items-center justify-center px-7 pt-24 pb-8 text-center"
			>
				<h1
					data-hero-item
					className="font-heading max-w-3xl text-6xl font-medium text-balance opacity-0"
				>
					{t.headlineLead}{' '}
					{/* Última palavra + ícones num nowrap: o slot nunca cai
					   sozinho na linha de baixo. */}
					<span className="whitespace-nowrap">
						{t.headlineTail}{' '}
						<HeroToolIcons
							label={t.toolsLabel}
							className="ml-[0.05em]"
						/>
					</span>
				</h1>

				<p
					data-hero-item
					className="text-body-lg text-foreground/70 mt-6 max-w-xl text-balance opacity-0"
				>
					{t.sub}
				</p>

				<div
					data-hero-item
					className="mt-8 flex items-center gap-3 opacity-0"
				>
					<Button asChild size="lg" className="px-6">
						<Link href="#cta">
							<SplitHoverText as="span">
								{t.bookDemo}
							</SplitHoverText>
						</Link>
					</Button>
				</div>
			</div>
		</section>
	)
}
