import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { AsciiField } from '@/components/landing/hero-demo'
import { Reveal } from '@/components/landing/reveal'
import { SECTION_TITLE } from '@/components/landing/type'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * CTA final — bookend do hero: o mesmo painel light blue com textura ASCII,
 * agora com a conversa como único foco. Alvo do link "Agende uma demo" do
 * hero (#cta).
 */
export function HomeCta() {
	return (
		<section
			id="cta"
			className="relative overflow-hidden border-y border-[#b3d2ff] bg-[#e0edff]"
		>
			<AsciiField className="absolute inset-0" />

			<div className="relative flex min-h-svh flex-col items-center justify-center px-7 py-28 text-center">
				<Reveal>
					<span className="text-foreground/50 font-mono text-sm tracking-widest uppercase">
						(vamos conversar)
					</span>
					<h2 className={cn(SECTION_TITLE, 'mx-auto mt-4 max-w-4xl')}>
						Veja a Faradays operando com os seus dados
					</h2>
					<p className="text-body-lg text-foreground/70 mx-auto mt-6 max-w-xl text-balance">
						Uma demo de 30 minutos, sem compromisso: você traz um
						fluxo real da operação e a gente mostra o que muda.
					</p>
					<div className="mt-9 flex flex-wrap items-center justify-center gap-3">
						<Button asChild size="lg" className="px-6">
							<Link href="mailto:contato@faradays.io">
								<SplitHoverText as="span">
									Agende uma demo
								</SplitHoverText>
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="ghost"
							className="px-6"
						>
							<Link href="#cta">
								<SplitHoverText as="span">
									Conheça a IA de crédito
								</SplitHoverText>
								<ArrowRight className="size-4" />
							</Link>
						</Button>
					</div>
				</Reveal>
			</div>
		</section>
	)
}
