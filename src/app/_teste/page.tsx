import type { Metadata } from 'next'

import { HomeFooter } from '@/components/landing/home-footer'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { Reveal } from '@/components/landing/reveal'
import { GapChart } from '@/components/teste/gap-chart'

export const metadata: Metadata = {
	title: 'Teste — Faradays',
	description: 'Página de teste.',
	robots: { index: false }
}

/** Sandbox: página para experimentos, fora do índice de buscadores. */
export default function TestePage() {
	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar />
			<main className="pt-23">
				<div className="max-w-section mx-auto w-full px-7 py-16 md:py-24">
					<Reveal>
						<p className="text-foreground/40 font-mono text-xs tracking-widest uppercase">
							/teste
						</p>
						<h1 className="font-heading text-h1 mt-4">
							Página de teste
						</h1>
						<p className="text-body-lg text-foreground/60 mt-5 max-w-2xl">
							Espaço para experimentos — conteúdo entra aqui.
						</p>
					</Reveal>

					<Reveal delay={0.15}>
						<div className="relative mx-auto mt-16 aspect-[4/3] w-full max-w-4xl">
							<GapChart className="absolute inset-0" />
						</div>
					</Reveal>
				</div>
			</main>
			<HomeFooter />
		</div>
	)
}
