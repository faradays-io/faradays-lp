'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

import { FeatureFigures } from '@/components/landing/feature-figures'
import { FeatureGraphic } from '@/components/landing/feature-graphic'
import { HOME_FEATURES } from '@/components/landing/home-features-data'
import { HowItWorks } from '@/components/landing/how-it-works'
import { MoreFeatures } from '@/components/landing/more-features'
import { useLang } from '@/components/language-provider'
import { usePageReady } from '@/lib/page-ready'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = HOME_FEATURES

export function FeaturesSection() {
	const { lang } = useLang()
	const [active, setActive] = useState(0)
	const rootRef = useRef<HTMLElement>(null)
	const ready = usePageReady()

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		if (!ready) return
		const ctx = gsap.context(() => {
			const blocks = root.querySelectorAll<HTMLElement>('[data-feature]')
			blocks.forEach((block) => {
				const i = Number(block.dataset.feature)
				// Ativa a feature enquanto o bloco cruza o centro da tela.
				ScrollTrigger.create({
					trigger: block,
					start: 'top center',
					end: 'bottom center',
					onToggle: (self) => {
						if (self.isActive) setActive(i)
					}
				})
			})
		}, root)
		return () => ctx.revert()
	}, [ready])

	return (
		<section
			id="features"
			ref={rootRef}
			className="bg-background text-foreground"
		>
			{/* Subseção 1: manifesto + figuras lo-fi. */}
			<FeatureFigures />

			{/* Subseção 2: how it works — grafo de sistemas + showcase. */}
			<HowItWorks />

			<div className="max-w-section mx-auto grid grid-cols-1 gap-x-16 px-7 lg:grid-cols-2">
				{/* Esquerda: features que rolam. Bloco centralizado na coluna,
				   texto alinhado à esquerda. */}
				<div className="flex flex-col">
					{FEATURES.map((feature, i) => (
						<div
							key={feature.id}
							data-feature={i}
							className="flex min-h-svh flex-col items-center justify-center gap-6 py-24 text-left"
						>
							<FeatureGraphic
								index={feature.graphic}
								className="mb-2 w-full max-w-sm lg:hidden"
							/>
							<span className="text-foreground/50 w-full max-w-md font-mono text-sm tracking-widest uppercase">
								({feature.eyebrow[lang]})
							</span>
							<h3 className="font-heading text-h2 w-full max-w-md text-balance">
								{feature.title[lang]}
							</h3>
							<p className="text-body-lg text-foreground/70 w-full max-w-md">
								{feature.description[lang]}
							</p>
							{/* Linha técnica (briefing 3.3-b): prova de domínio
							   em mono, separada da copy de negócio. */}
							<p className="text-foreground/45 w-full max-w-md font-mono text-xs leading-relaxed">
								{feature.tech[lang]}
							</p>
						</div>
					))}
				</div>

				{/* Direita: gráfico fixo ao centro que só se transforma. */}
				<div className="hidden lg:block">
					<div className="sticky top-0 flex h-svh items-center">
						<FeatureGraphic
							index={FEATURES[active]?.graphic ?? 0}
						/>
					</div>
				</div>
			</div>

			{/* Grade "e mais" fecha a seção: o produto inteiro em resumo. */}
			<MoreFeatures />
		</section>
	)
}
