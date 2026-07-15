import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { DriftCanvas } from '@/components/landing/drift-canvas'
import { Reveal } from '@/components/landing/reveal'

/** Home teaser for the credit-intelligence product — links to /credito. */
export function CreditTeaser() {
	return (
		<section id="credito" className="bg-background text-foreground">
			<div className="grid w-full items-center gap-12 px-7 py-40 lg:grid-cols-2 lg:gap-14">
				<Reveal className="max-w-xl">
					<span className="text-muted-foreground font-mono text-sm tracking-wide uppercase">
						(novo — inteligência de crédito)
					</span>
					<h2 className="font-heading text-h1 mt-4 text-balance">
						Crédito que aprende com cada decisão — inclusive as
						recusas
					</h2>
					<p className="text-body-lg text-foreground/70 mt-5">
						Políticas de crédito dinâmicas com modelos fundacionais
						tabulares e aprendizagem por reforço, em pesquisa
						conjunta com a Unicamp. Robustas quando o mercado muda;
						auditáveis em fairness e ROI.
					</p>
					<Link
						href="/credito"
						className="hover:text-foreground/70 mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
					>
						Conhecer a plataforma de crédito
						<ArrowRight className="size-4" />
					</Link>
				</Reveal>

				<Reveal delay={0.15}>
					<div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border">
						<DriftCanvas className="absolute inset-0" />
						<span className="text-foreground/60 absolute bottom-5 left-6 font-mono text-xs tracking-wide uppercase">
							Política dinâmica vs. modelo estático
						</span>
					</div>
				</Reveal>
			</div>
		</section>
	)
}
