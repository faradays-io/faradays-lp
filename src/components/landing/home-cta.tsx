'use client'

import Link from 'next/link'
import { useRef } from 'react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { useRecedeOut } from '@/components/landing/recede-out'
import { Reveal } from '@/components/landing/reveal'
import { SECTION_TITLE } from '@/components/landing/type'
import { useCopy } from '@/components/language-provider'
import { Button } from '@/components/ui/button'
import type { Localized } from '@/lib/i18n'
import { BOOKING_URL } from '@/lib/links'
import { cn } from '@/lib/utils'

const COPY = {
	pt: {
		eyebrow: '(vamos conversar)',
		heading: 'Veja a Faradays operando com os seus dados',
		sub: 'Uma demo de 30 minutos, sem compromisso: você traz um fluxo real da operação e a gente mostra o que muda.',
		bookDemo: 'Agende uma demo'
	},
	en: {
		eyebrow: "(let's talk)",
		heading: 'See Faradays running on your data',
		sub: 'A 30-minute demo, no strings attached: you bring a real workflow from your operation and we show what changes.',
		bookDemo: 'Book a demo'
	}
} satisfies Localized<Record<string, string>>

/**
 * CTA final — a conversa como único foco, sobre o fundo da própria página.
 * Alvo do link "Agende uma demo" do hero (#cta).
 */
export function HomeCta() {
	const t = useCopy(COPY)
	const sectionRef = useRef<HTMLElement>(null)
	const copyRef = useRef<HTMLDivElement>(null)

	/* Mesma saída do hero. A ida é medida no próprio bloco: ele recua quando
	   o topo passa do quarto superior da tela — depois de ter sido lido
	   inteiro, no scroll que já vai para o rodapé.
	   A volta é medida na seção, não no bloco: dispara quando o rodapé da
	   seção desce de volta para 40% da tela, ou seja, com o CTA ainda bem
	   fora de vista — assim ele chega restaurado em vez de se montar à
	   vista de quem sobe. */
	useRecedeOut(copyRef, {
		start: 'top 25%',
		triggerRef: copyRef,
		back: { ref: sectionRef, start: 'bottom 40%' }
	})

	return (
		<section
			id="cta"
			ref={sectionRef}
			className="bg-background relative overflow-hidden"
		>
			<div className="relative flex min-h-svh flex-col items-center justify-center px-7 py-28 text-center">
				<div ref={copyRef} data-cta-copy>
					<Reveal>
						<span className="text-foreground/50 font-mono text-sm tracking-widest uppercase">
							{t.eyebrow}
						</span>
						<h2
							className={cn(
								SECTION_TITLE,
								'mx-auto mt-4 max-w-4xl'
							)}
						>
							{t.heading}
						</h2>
						<p className="text-body-lg text-foreground/70 mx-auto mt-6 max-w-xl text-balance">
							{t.sub}
						</p>
						<div className="mt-9 flex justify-center">
							<Button asChild size="lg" className="px-6">
								<Link
									href={BOOKING_URL}
									target="_blank"
									rel="noopener noreferrer"
								>
									<SplitHoverText as="span">
										{t.bookDemo}
									</SplitHoverText>
								</Link>
							</Button>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	)
}
