import type { Metadata } from 'next'

import { FeaturesSection } from '@/components/landing/features-section'
import { HeroFeatureFlow } from '@/components/landing/hero-feature-flow'
import { HomeCta } from '@/components/landing/home-cta'
import { HomeFooter } from '@/components/landing/home-footer'
import { HomeHero } from '@/components/landing/home-hero'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { PartnersSection } from '@/components/landing/partners-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'

export const metadata: Metadata = {
	title: 'Distribuição — Faradays',
	description:
		'A operação da sua distribuidora no WhatsApp: cotação formalizada em PDF na conversa, RFQ de compra automática, laudos com validade viva — e uma IA que nunca inventa número.'
}

export default function DistribuicaoPage() {
	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar />
			<main className="pt-23">
				<HomeHero />
				<HeroFeatureFlow />
				<FeaturesSection />
				<PartnersSection />
				<TestimonialsSection />
				<HomeCta />
			</main>
			<HomeFooter />
		</div>
	)
}
