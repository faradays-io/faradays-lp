import type { Metadata } from 'next'

import { HomeFooter } from '@/components/landing/home-footer'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { PricingFaq } from '@/components/pricing/pricing-faq'
import { PricingPlans } from '@/components/pricing/pricing-plans'
import { PricingTable } from '@/components/pricing/pricing-table'

export const metadata: Metadata = {
	title: 'Preços — Distribuição — Faradays',
	description:
		'Basic, Pro e Enterprise: a IA para distribuidoras e indústrias em três planos, mensal ou anual — do assistente de WhatsApp aos agentes especialistas sob medida.'
}

/* Subpágina de preços da solução de distribuição — mesma casca da
   /distribuicao (light, nav, CTA final e rodapé). */
export default function PrecosPage() {
	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar pricing />
			<main className="pt-23">
				<PricingPlans />
				<PricingTable />
				<PricingFaq />
			</main>
			<HomeFooter />
		</div>
	)
}
