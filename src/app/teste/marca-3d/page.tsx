import type { Metadata } from 'next'

import { HomeFooter } from '@/components/landing/home-footer'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { Mark3dLab } from '@/components/teste/mark-3d-lab'

export const metadata: Metadata = {
	title: 'Marca 3D — protótipo — Faradays',
	description: 'Protótipo da marca Faradays em 3D isométrico.',
	robots: { index: false }
}

/**
 * Sandbox do hero 3D (referência: techspeed.com): a marca extrudada
 * flutuando, hover muda a tampa de cor, ponteiro inclina a marca e move a
 * câmera (parallax das figuras). Controles abaixo para calibrar antes de
 * decidir onde entra no hero de verdade.
 */
export default function Marca3dPage() {
	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar />
			<main className="pt-23">
				<div className="max-w-section mx-auto w-full px-7 py-12 md:py-16">
					<p className="text-foreground/40 font-mono text-xs tracking-widest uppercase">
						/teste/marca-3d
					</p>
					<h1 className="font-heading mt-4 max-w-3xl text-6xl text-balance">
						A operação da sua empresa, onde o seu time já trabalha
					</h1>
					<p className="text-body-lg text-foreground/60 mt-5 max-w-2xl">
						Passe o mouse pela página: a marca inclina, as figuras
						se deslocam em profundidade e a tampa muda de cor no
						hover.
					</p>
					<Mark3dLab className="mt-10" />
				</div>
			</main>
			<HomeFooter />
		</div>
	)
}
