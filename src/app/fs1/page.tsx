import type { Metadata } from 'next'

import { FeatureIndex } from '@/components/landing/feature-index'
import { HomeFooter } from '@/components/landing/home-footer'
import { MetricsSection } from '@/components/landing/metrics-section'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { PartnersWall } from '@/components/landing/partners-wall'
import { SplitHero } from '@/components/landing/split-hero'
import { TestimonialsSection } from '@/components/landing/testimonials-section'

/* /fs1 (antes /distribuicao) — layout simples (referência: ollama.com): hero em duas
   colunas com o vídeo ao lado do CTA e as features em índice sticky, no
   lugar da coreografia pinada da versão anterior (preservada em `_v1/`,
   pasta privada fora do roteamento). A grade "e mais" (FeaturesSection) não
   entra: as quatro de destaque são a lista.

   Logo depois do hero: a parede de parceiros (`PartnersWall`, ainda no
   claro; a grade antiga segue em `PartnersSection`). Depois das features,
   o FIM ESCURO — métricas, relatos e rodapé num bloco `.dark` (#0f0f0e, o mesmo painel
   dos relatos). Os relatos foram desenhados para os tokens claros (cards
   claros sobre o painel escuro próprio), então reabrem o `.light` em volta
   deles. O bloco leva `data-nav-theme="dark"`: a NavBar escurece ao
   passar por cima dele. A página de preços continua fora do ar
   (`_precos/`, pasta privada): para voltar, renomear a pasta, devolver o
   `pricing` da NavBar e o link "Preços" do rodapé. */
export const metadata: Metadata = {
	title: 'FS1 | Faradays',
	description:
		'IA para distribuidoras e indústrias que trabalha onde o time já está — WhatsApp, SharePoint, OneDrive e Corp: cotações, compras e documentos resolvidos na rotina, com o gestor acompanhando tudo no portal.'
}

export default function DistribuicaoPage() {
	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar sections />
			<main className="pt-26">
				<SplitHero />
				<PartnersWall />
				<FeatureIndex />
			</main>
			<div
				data-nav-theme="dark"
				className="dark bg-background text-foreground"
			>
				<MetricsSection />
				{/* `text-foreground` de novo: a cor que desce do bloco escuro já
				   vem resolvida (clara) e o `.light` só troca as variáveis. */}
				<div className="light text-foreground">
					<TestimonialsSection />
				</div>
				<HomeFooter />
			</div>
		</div>
	)
}
