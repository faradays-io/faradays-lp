import type { Metadata } from 'next'

import { FeatureIndex } from '@/components/landing/feature-index'
import { HomeFooter } from '@/components/landing/home-footer'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { SplitHero } from '@/components/landing/split-hero'

/* /distribuicao — layout simples (referência: ollama.com): hero em duas
   colunas com o vídeo ao lado do CTA e as features em índice sticky, no
   lugar da coreografia pinada da versão anterior (preservada em `_v1/`,
   pasta privada fora do roteamento). A grade "e mais" (FeaturesSection) não
   entra: as quatro de destaque são a lista.

   PartnersSection e TestimonialsSection estão ocultas por enquanto — os
   componentes continuam no repositório; para voltar, basta renderizá-las
   entre o FeatureIndex e o HomeFooter e reabrir os links "Parceiros" e
   "Relatos" no rodapé. A página de preços também está fora do ar
   (`_precos/`, pasta privada): para voltar, renomear a pasta, devolver o
   `pricing` da NavBar e o link "Preços" do rodapé. */
export const metadata: Metadata = {
	title: 'Distribuição — Faradays',
	description:
		'IA para distribuidoras e indústrias que trabalha onde o time já está — WhatsApp, SharePoint, OneDrive e Corp: cotações, compras e documentos resolvidos na rotina, com o gestor acompanhando tudo no portal.'
}

export default function DistribuicaoPage() {
	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar />
			<main className="pt-23">
				<SplitHero />
				<FeatureIndex />
			</main>
			<HomeFooter />
		</div>
	)
}
