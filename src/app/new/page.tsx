import type { Metadata } from 'next'

import { HomeFooter } from '@/components/landing/home-footer'
import { NavBar } from '@/components/landing/nav-bar'
import { NewHomeHero } from '@/components/landing/new-home-hero'
import { PageTransition } from '@/components/landing/page-transition'
import { SolutionsIndex } from '@/components/landing/solutions-index'

/* Rota de staging da próxima home (institucional: hero + soluções +
   footer; produtos vivem nas subpáginas). noindex até substituir a raiz. */
export const metadata: Metadata = {
	title: 'Faradays',
	description: 'Inteligência artificial aplicada à sua operação.',
	robots: { index: false, follow: false }
}

export default function NewHomePage() {
	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar solutions />
			<main>
				<NewHomeHero />
				<SolutionsIndex />
			</main>
			<HomeFooter />
		</div>
	)
}
