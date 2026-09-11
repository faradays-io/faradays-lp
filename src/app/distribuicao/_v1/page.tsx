import type { Metadata } from 'next'

import { FeaturesSection } from '@/components/landing/features-section'
import { HeroFeatureFlow } from '@/components/landing/hero-feature-flow'
import { HomeFooter } from '@/components/landing/home-footer'
import { HomeHero } from '@/components/landing/home-hero'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { PartnersSection } from '@/components/landing/partners-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'

/* Versão anterior da /distribuicao (hero geralista + coreografia pinada do
   HeroFeatureFlow + grade "e mais"). Pasta privada do App Router: o código
   fica preservado, fora do roteamento, enquanto a versão em duas colunas
   ocupa a rota. */
export const metadata: Metadata = {
	title: 'Distribuição — Faradays',
	description:
		'IA para distribuidoras e indústrias que trabalha onde o time já está — WhatsApp, SharePoint, OneDrive e Corp: cotações, compras e documentos resolvidos na rotina, com o gestor acompanhando tudo no portal.'
}

export default function DistribuicaoV1Page() {
	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar pricing />
			<main className="pt-23">
				<HomeHero />
				<HeroFeatureFlow />
				<FeaturesSection />
				<PartnersSection />
				<TestimonialsSection />
			</main>
			<HomeFooter />
		</div>
	)
}
