import type { Metadata } from 'next'

import { FeatureIndex } from '@/components/landing/feature-index'
import { HomeFooter } from '@/components/landing/home-footer'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { PartnersSection } from '@/components/landing/partners-section'
import { SplitHero } from '@/components/landing/split-hero'
import { TestimonialsSection } from '@/components/landing/testimonials-section'

/* Rota de staging da próxima /distribuicao — layout simples (referência:
   ollama.com): hero em duas colunas com o vídeo ao lado do CTA e as features
   em índice sticky, no lugar da coreografia pinada da v1. A grade "e mais"
   (FeaturesSection) não entra: as quatro de destaque são a lista. Do
   PartnersSection para baixo a página é a mesma. noindex até substituir a
   rota de produção, como a /new fez com a home. */
export const metadata: Metadata = {
	title: 'Distribuição — Faradays',
	description:
		'IA para distribuidoras e indústrias que trabalha onde o time já está — WhatsApp, SharePoint, OneDrive e Corp: cotações, compras e documentos resolvidos na rotina, com o gestor acompanhando tudo no portal.',
	robots: { index: false, follow: false }
}

export default function DistribuicaoV2Page() {
	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar pricing />
			<main className="pt-23">
				<SplitHero />
				<FeatureIndex />
				<PartnersSection />
				<TestimonialsSection />
			</main>
			<HomeFooter />
		</div>
	)
}
