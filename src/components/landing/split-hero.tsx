'use client'

import gsap from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { HeroVideo } from '@/components/landing/hero-video'
import { HERO_COPY } from '@/components/landing/home-hero'
import { useCopy } from '@/components/language-provider'
import { Button } from '@/components/ui/button'
import { ptSerif } from '@/lib/fonts'
import type { Localized } from '@/lib/i18n'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

const COPY = {
	pt: {
		/* Três linhas fixas: as duas primeiras aqui, a terceira é o
		   `lastLead` + "WhatsApp" com o ícone. */
		lines: ['Sua empresa na', 'palma da mão, direto'],
		lastLead: 'no',
		sub: 'Cotações, pedidos, compras e documentos se resolvem numa conversa, e o gestor acompanha tudo no portal.'
	},
	en: {
		lines: ['Your company in', 'the palm of your hand,'],
		lastLead: 'right on',
		sub: 'Quotes, orders, purchases and documents get done in a conversation, and the manager follows everything in the portal.'
	}
} satisfies Localized<{
	lines: [string, string]
	lastLead: string
	sub: string
}>

/**
 * Hero da v2 — texto em cima, em duas colunas: a headline à esquerda e,
 * alinhados pela base dela, a sub e o CTA à direita. A demo vem embaixo,
 * centrada no miolo.
 *
 * A estilização é a do `HomeHero` da v1, item a item — PT Serif na
 * headline, sub a 70%, o Button (sem a fita de IA na borda) e a entrada em
 * stagger disparada pelo fim do loader (`data-hero-item`, opacity-0 no
 * markup até lá). Sem o `useRecedeOut` da v1: a copy sumindo no primeiro
 * scroll deixaria o hero em branco enquanto a demo ainda está à vista.
 *
 * Embaixo, o vídeo de apresentação (`HeroVideo`, arquivo próprio): mudo
 * em loop como vitrine; o play recomeça do início, com som e barra própria.
 *
 * Copy: headline e sub PRÓPRIAS desde 09/10: a página é a da distribuição,
 * e o canal que ela vende é o WhatsApp, em destaque na última palavra, em
 * azul e com o ícone. O CTA continua vindo da `HERO_COPY` da home, que segue
 * com a headline das quatro ferramentas.
 */
export function SplitHero() {
	const t = useCopy(HERO_COPY)
	const c = useCopy(COPY)
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
			className="w-full pt-16 pb-24 lg:pt-28 lg:pb-32"
		>
			<div className="max-w-page mx-auto w-full px-[var(--gutter)]">
				{/* Grade de 12 com as laterais vazias, o padrão do canvas.
				   Linha de cima: headline nas colunas 2-7 e, alinhados pela
				   BASE dela, sub + CTA nas 8-11. Embaixo, a demo recuada até
				   o meio do caminho entre a borda do header e o início do
				   texto (meia coluna + meia goteira de cada lado). Abaixo de lg tudo empilha. */}
				<div className="grid grid-cols-1 items-end gap-x-[var(--grid-gap)] gap-y-8 lg:grid-cols-12">
					{/* TESTE de tipografia (como na v1): PT Serif só nesta
					   headline — a fonte não está no par ativo do registry,
					   então vem pela className do next/font. `font-medium`
					   cai no Regular 400, a família não tem 500.

					   Sempre em TRÊS linhas: cada uma é um bloco `nowrap` e o
					   corpo acompanha a largura da coluna (`cqi` do
					   container), teto de 4,5rem — a linha mais longa (a
					   segunda do EN, ~10em) cabe em qualquer largura. */}
					<div className="@container lg:col-span-6 lg:col-start-2">
						<h1
							data-hero-item
							className={cn(
								ptSerif.className,
								'text-[min(9cqi,4.5rem)] leading-[1.05] font-medium opacity-0'
							)}
						>
							{c.lines.map((line) => (
								<span
									key={line}
									className="block whitespace-nowrap"
								>
									{line}
								</span>
							))}
							<span className="block whitespace-nowrap">
								{c.lastLead}{' '}
								<span className="text-brand">WhatsApp</span>{' '}
								<Image
									src="/icons/whatsapp.svg"
									alt=""
									width={64}
									height={64}
									className="ml-[0.05em] inline-block size-[0.9em] align-[-0.1em]"
								/>
							</span>
						</h1>
					</div>

					<div className="lg:col-span-4 lg:col-start-8 lg:pb-2">
						<p
							data-hero-item
							className="text-body-lg text-foreground/70 max-w-xl text-pretty opacity-0"
						>
							{c.sub}
						</p>

						<div
							data-hero-item
							className="mt-8 flex items-center gap-3 opacity-0"
						>
							<Button
								asChild
								size="lg"
								className="bg-brand text-brand-foreground hover:bg-brand/90 px-6"
							>
								<Link href="#cta">
									<SplitHoverText as="span">
										{t.bookDemo}
									</SplitHoverText>
								</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Vídeo de apresentação, recuado (ver acima). */}
				<div
					data-hero-item
					className="mt-20 opacity-0 lg:mx-[calc((100%-11*var(--grid-gap))/24+var(--grid-gap)/2)] lg:mt-32"
				>
					<HeroVideo />
				</div>
			</div>
		</section>
	)
}
