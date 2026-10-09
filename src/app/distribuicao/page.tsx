import type { Metadata } from 'next'

import { FeatureIndex } from '@/components/landing/feature-index'
import { HomeFooter } from '@/components/landing/home-footer'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { SplitHero } from '@/components/landing/split-hero'
import { StageGlow, type StageScene } from '@/components/landing/stage-glow'

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
   `pricing` da NavBar e o link "Preços" do rodapé.

   Palco escuro: a página saiu do `.light` e roda nos tokens do `.dark`
   global, com o fundo do vídeo do showcase (`.stage`) e a luz dele por trás
   (`StageGlow`). O `isolate` do wrapper é o que segura a camada de luz
   (-z-10) entre o fundo e o conteúdo. */
export const metadata: Metadata = {
	title: 'Distribuição — Faradays',
	description:
		'IA para distribuidoras e indústrias que trabalha onde o time já está — WhatsApp, SharePoint, OneDrive e Corp: cotações, compras e documentos resolvidos na rotina, com o gestor acompanhando tudo no portal.'
}

/* Cenários da luz por seção — a ordem do vídeo (g1 → g2 → g3 → g1 → g2 e o
   CTA), uma troca de canto a cada feature. */
const SCENES: readonly (readonly [string, StageScene])[] = [
	['#hero', 'hero'],
	['#feature-whatsapp', 'g1'],
	['#feature-venda', 'g2'],
	['#feature-rfq', 'g3'],
	['#feature-docs', 'g1'],
	['#feature-portal', 'g2'],
	['#footer', 'cta']
]

export default function DistribuicaoPage() {
	return (
		<div className="stage bg-background text-foreground relative isolate min-h-svh">
			<PageTransition />
			<StageGlow scenes={SCENES} />
			<NavBar />
			<main className="pt-23">
				<SplitHero />
				<FeatureIndex />
			</main>
			<HomeFooter />
		</div>
	)
}
