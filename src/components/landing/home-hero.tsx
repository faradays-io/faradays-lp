'use client'

import gsap from 'gsap'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { HeroToolIcons } from '@/components/landing/hero-tool-icons'
import { useRecedeOut } from '@/components/landing/recede-out'
import { useCopy } from '@/components/language-provider'
import { AiGradientButton } from '@/components/ui/ai-gradient-button'
import { ptSerif } from '@/lib/fonts'
import type { Localized } from '@/lib/i18n'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

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
 * Hero claro: headline à esquerda, sub e CTA à direita, com entrada em
 * stagger disparada pelo fim da page transition. O painel ASCII + demo vive
 * logo abaixo, no HeroFeatureFlow — o min-h de 60svh deixa ~40svh dele
 * visível na dobra, o que convida o scroll.
 *
 * Layout na grade de 12 com as colunas laterais vazias (headline nas 2-6,
 * sub + botão nas 7-11): esse miolo é a medida `--grid-10` do globals.css,
 * a mesma em que a demo abre logo abaixo — o hero e a demo compartilham as
 * duas bordas.
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
	   bg-background): mantém a copy acima das camadas de fundo do
	   HeroFeatureFlow, que começam logo abaixo da dobra. */
	return (
		<section
			id="hero"
			ref={rootRef}
			className="relative z-10 -mt-23 flex flex-col pt-23"
		>
			{/* Copy + CTA — altura pelo conteúdo, sem nenhuma medida em
			   svh: o bloco mede padding + copy e ponto, então o respiro
			   abaixo do texto é sempre o mesmo, seja qual for a altura da
			   tela. O `pb` é o `--hero-gap`, o mesmo respiro que a demo usa
			   para pousar logo abaixo daqui — mexer nele move os dois. */}
			<div
				ref={copyRef}
				data-hero-copy
				className="my-24 w-full pt-16 pb-[var(--hero-gap)]"
			>
				<div className="max-w-page mx-auto w-full px-[var(--gutter)]">
					{/* Das 10 colunas do miolo: 5 para a headline, a 7 fica
					   vazia como respiro e as 4 últimas levam sub + botão.
					   Abaixo de lg a grade some e os dois blocos empilham —
					   em coluna estreita não sobra medida para os dois lado
					   a lado. As bases alinham: a sub encosta na última
					   linha da headline, não no topo dela. */}
					<div className="grid grid-cols-1 gap-x-[var(--grid-gap)] gap-y-8 lg:grid-cols-12 lg:items-end">
						{/* TESTE de tipografia: PT Serif só nesta headline
						   (a fonte não está no par ativo do registry, então
						   vem pela className do next/font). `font-medium`
						   cai no Regular 400 — a família não tem 500. */}
						<h1
							data-hero-item
							className={cn(
								ptSerif.className,
								'text-[5rem]/[1.05] font-medium text-balance opacity-0 lg:col-span-5 lg:col-start-2'
							)}
						>
							{t.headlineLead}{' '}
							{/* Última palavra + ícones num nowrap: o slot
							   nunca cai sozinho na linha de baixo. */}
							<span className="whitespace-nowrap">
								{t.headlineTail}{' '}
								<HeroToolIcons
									label={t.toolsLabel}
									className="ml-[0.05em]"
								/>
							</span>
						</h1>

						<div className="lg:col-span-4 lg:col-start-8">
							<p
								data-hero-item
								className="text-body-lg text-foreground/70 max-w-xl text-pretty opacity-0"
							>
								{t.sub}
							</p>

							<div
								data-hero-item
								className="mt-8 flex items-center gap-3 opacity-0"
							>
								<AiGradientButton asChild>
									<Link href="#cta">
										<SplitHoverText as="span">
											{t.bookDemo}
										</SplitHoverText>
									</Link>
								</AiGradientButton>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
