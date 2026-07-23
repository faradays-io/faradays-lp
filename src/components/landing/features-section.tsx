'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

import { FeatureFigures } from '@/components/landing/feature-figures'
import { FeatureGraphic } from '@/components/landing/feature-graphic'
import { HOME_FEATURES } from '@/components/landing/home-features-data'
import { HowItWorks } from '@/components/landing/how-it-works'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = HOME_FEATURES

export function FeaturesSection() {
	const [active, setActive] = useState(0)
	const rootRef = useRef<HTMLElement>(null)

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
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
	}, [])

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
				{/* Esquerda: features que rolam. */}
				<div className="flex flex-col">
					{FEATURES.map((feature, i) => (
						<div
							key={feature.eyebrow}
							data-feature={i}
							className="flex min-h-svh flex-col justify-center gap-6 py-24"
						>
							<FeatureGraphic
								index={i}
								className="mb-2 max-w-sm lg:hidden"
							/>
							<span className="text-foreground/50 font-mono text-sm tracking-widest uppercase">
								({feature.eyebrow})
							</span>
							<h3 className="font-heading text-h2 max-w-md text-balance">
								{feature.title}
							</h3>
							<p className="text-body-lg text-foreground/70 max-w-md">
								{feature.description}
							</p>
						</div>
					))}
				</div>

				{/* Direita: gráfico fixo ao centro que só se transforma. */}
				<div className="hidden lg:block">
					<div className="sticky top-0 flex h-svh items-center">
						<FeatureGraphic index={active} />
					</div>
				</div>
			</div>
		</section>
	)
}
