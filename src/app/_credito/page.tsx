import type { Metadata } from 'next'

import { CreditoCta } from '@/components/credito/credito-cta'
import { CreditoHero } from '@/components/credito/credito-hero'
import { CreditoMethod } from '@/components/credito/credito-method'
import { CreditoObjectives } from '@/components/credito/credito-objectives'
import { CreditoPhases } from '@/components/credito/credito-phases'
import { CreditoProblem } from '@/components/credito/credito-problem'
import { CreditoProposal } from '@/components/credito/credito-proposal'
import { HomeFooter } from '@/components/landing/home-footer'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'

export const metadata: Metadata = {
	title: 'Crédito — Faradays',
	description:
		'Otimização dinâmica de crédito: projeto de PD&I da Faradays em cooperação com a Unicamp — modelos fundacionais tabulares e aprendizagem por reforço para políticas de decisão robustas, com fairness na função objetivo.'
}

export default function CreditoPage() {
	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar />
			<main className="pt-23">
				<CreditoHero />
				<CreditoProblem />
				<CreditoProposal />
				<CreditoObjectives />
				<CreditoMethod />
				<CreditoPhases />
				<CreditoCta />
			</main>
			<HomeFooter />
		</div>
	)
}
