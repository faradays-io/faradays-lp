import Link from 'next/link'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { ArrowSwapIcon } from '@/components/landing/arrow-swap-icon'
import { AsciiField } from '@/components/landing/hero-demo'
import { Reveal } from '@/components/landing/reveal'
import { SECTION_TITLE } from '@/components/landing/type'
import { Button } from '@/components/ui/button'
import { BOOKING_URL } from '@/lib/links'
import { cn } from '@/lib/utils'

/**
 * CTA final de /credito — o mesmo painel light blue com textura ASCII da
 * home, apontando a conversa para a frente de crédito.
 */
export function CreditoCta() {
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
						Crédito que aprende com a sua carteira
					</h2>
					<p className="text-body-lg text-foreground/70 mx-auto mt-6 max-w-xl text-balance">
						Uma conversa de 30 minutos, sem compromisso: você traz o
						seu fluxo de crédito e a gente mostra onde a decisão
						dinâmica muda o resultado.
					</p>
					<div className="mt-9 flex flex-wrap items-center justify-center gap-3">
						<Button asChild size="lg" className="px-6">
							<Link
								href={BOOKING_URL}
								target="_blank"
								rel="noopener noreferrer"
							>
								<SplitHoverText as="span">
									Agende uma conversa
								</SplitHoverText>
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="ghost"
							className="gap-6 px-6 hover:bg-transparent dark:hover:bg-transparent"
						>
							<Link href="/importacoes">
								<span className="transition-transform duration-300 group-hover/button:translate-x-2">
									Conheça as outras soluções
								</span>
								<ArrowSwapIcon />
							</Link>
						</Button>
					</div>
				</Reveal>
			</div>
		</section>
	)
}
