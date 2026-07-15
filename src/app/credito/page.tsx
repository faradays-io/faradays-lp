import type { Metadata } from 'next'

import { CreditApproach } from '@/components/landing/credit-approach'
import { CreditHero } from '@/components/landing/credit-hero'
import { CreditPoc } from '@/components/landing/credit-poc'
import { CreditProblem } from '@/components/landing/credit-problem'
import { CreditProduct } from '@/components/landing/credit-product'
import { Footer } from '@/components/landing/footer'
import { NavBar } from '@/components/landing/nav-bar'

export const metadata: Metadata = {
	title: 'Faradays — Inteligência de crédito dinâmica',
	description:
		'Motor de decisão de crédito com modelos fundacionais tabulares e aprendizagem por reforço: políticas dinâmicas, robustas a mudanças de distribuição, com fairness na função objetivo. Pesquisa em cooperação com a Unicamp.'
}

export default function CreditoPage() {
	return (
		<>
			<NavBar />
			<main className="pt-23">
				<CreditHero />
				<CreditProduct />
				<CreditProblem />
				<CreditApproach />
				<CreditPoc />
			</main>
			<Footer />
		</>
	)
}
