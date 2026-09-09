import type { Metadata } from 'next'

import { HomeFooter } from '@/components/landing/home-footer'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { Hero3dTest } from '@/components/teste/hero-3d-test'

export const metadata: Metadata = {
	title: 'Hero 3D (centro) — teste — Faradays',
	description: 'Teste do hero com a marca 3D — variante centro.',
	robots: { index: false }
}

/** Sandbox: hero com marca 3D, variante "centro". */
export default function Hero3dCentroPage() {
	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar />
			<main className="pt-23">
				<Hero3dTest variant="center" />
			</main>
			<HomeFooter />
		</div>
	)
}
