'use client'

import gsap from 'gsap'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { HeroToolIcons } from '@/components/landing/hero-tool-icons'
import { HERO_COPY } from '@/components/landing/home-hero'
import { MonfizaAppDemo } from '@/components/landing/monfiza-app-demo'
import { useCopy } from '@/components/language-provider'
import { AiGradientButton } from '@/components/ui/ai-gradient-button'
import { ptSerif } from '@/lib/fonts'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

/**
 * Hero da v2 (referência de postura: ollama.com) — duas colunas e ponto:
 * a coluna da esquerda empilha headline, sub e CTA alinhados pela vertical,
 * a da direita leva a apresentação em vídeo.
 *
 * A estilização é a do `HomeHero` da v1, item a item — PT Serif na
 * headline (a 4rem, um degrau abaixo dos 5rem de lá: aqui ela mora em 4
 * colunas), ícones das ferramentas na última palavra, sub a 70%, o
 * AiGradientButton e a entrada em stagger disparada pelo fim do loader
 * (`data-hero-item`, opacity-0 no markup até lá). O que muda é a
 * composição: lá a sub e o CTA moram numa segunda coluna alinhada pela BASE
 * da headline e a demo só entra depois, na camada sticky do
 * `HeroFeatureFlow`; aqui o CTA é um bloco só e a demo sobe para dentro do
 * hero, parada. Sem o `useRecedeOut` da v1: ele recua a copy no primeiro
 * scroll porque a demo atravessa a tela em seguida — aqui nada atravessa, e
 * a copy sumindo deixaria o hero em branco enquanto ainda está à vista.
 *
 * O slot da direita é provisório: enquanto o vídeo de apresentação não
 * existe, ele mostra a `MonfizaAppDemo` em `fill` (o chat roda em autoplay
 * sozinho, o quadro certo para uma vitrine parada) sobre a mesma banda de
 * fundo da v1 (`bg.png`). Trocar por `<video>` é substituir o miolo do slot
 * — banda e proporção ficam de pé.
 *
 * Copy: a mesma `HERO_COPY` da v1, importada e não duplicada, para as duas
 * versões dizerem a mesma coisa enquanto convivem.
 */
export function SplitHero() {
	const t = useCopy(HERO_COPY)
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

	return (
		<section
			id="hero"
			ref={rootRef}
			className="w-full pt-8 pb-24 lg:pt-10 lg:pb-32"
		>
			<div className="max-w-page mx-auto w-full px-[var(--gutter)]">
				{/* Grade de 12 com as laterais vazias, o padrão do canvas:
				   copy nas colunas 2-5, vídeo nas 6-11 — 4 + 6 fecham o
				   miolo de 10, com o vídeo levando a parte maior. Tudo
				   alinhado pelo topo (`items-start`), colado na nav: o hero
				   começa onde a página começa. Abaixo de lg empilha — em
				   coluna estreita não há medida para os dois lado a lado. */}
				<div className="grid grid-cols-1 items-start gap-x-[var(--grid-gap)] gap-y-12 lg:grid-cols-12">
					{/* CTA: título, descrição e botão num eixo vertical só. */}
					<div className="lg:col-span-4 lg:col-start-2">
						{/* TESTE de tipografia (como na v1): PT Serif só nesta
						   headline — a fonte não está no par ativo do
						   registry, então vem pela className do next/font.
						   `font-medium` cai no Regular 400, a família não tem
						   500. */}
						<h1
							data-hero-item
							className={cn(
								ptSerif.className,
								'text-[4rem]/[1.05] font-medium text-balance opacity-0'
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

						<p
							data-hero-item
							className="text-body-lg text-foreground/70 mt-8 max-w-xl text-pretty opacity-0"
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

					{/* Vídeo de apresentação, sobre a banda da v1. O padding é
					   proporcional para reproduzir a moldura de lá (10,2% da
					   largura da demo de cada lado, 6,9% da altura em cima e
					   embaixo), recalculada a partir da largura da banda:
					   8,5% × 3,95% — a demo mede 83% da banda e, em 13/9,
					   3,95% da largura é o que 6,9% da altura dela dá. A
					   proporção 13/9 é a da demo pinada da v1 (52 × 36rem);
					   mais achatada, o chat corta o topo em cima de um balão
					   (`overflow-hidden` + `justify-end`, scrollback por
					   design). Segurando a proporção o bloco também não pula
					   quando o vídeo real entrar no lugar. */}
					<div className="lg:col-span-6 lg:col-start-6">
						<div
							data-hero-item
							className="rounded-2xl bg-[url(/bg.png)] bg-cover bg-center px-[8.5%] py-[3.95%] opacity-0"
						>
							<div className="relative aspect-[13/9] w-full">
								<MonfizaAppDemo fill />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
