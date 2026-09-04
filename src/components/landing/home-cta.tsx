'use client'

import Link from 'next/link'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { Reveal } from '@/components/landing/reveal'
import { SECTION_TITLE } from '@/components/landing/type'
import { useCopy } from '@/components/language-provider'
import { AiGradientButton } from '@/components/ui/ai-gradient-button'
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

	/* Sem o recuo na saída (o gesto do hero): o CTA é o último bloco antes do
	   rodapé e sumir no scroll tirava a chamada da vista bem na hora de
	   clicar. Ele fica onde está. */
	return (
		<section id="cta" className="bg-background relative overflow-hidden">
			<div className="relative flex min-h-svh flex-col items-center justify-center px-7 py-28 text-center">
				<Reveal>
					<span className="text-foreground/50 font-mono text-sm tracking-widest uppercase">
						{t.eyebrow}
					</span>
					<h2 className={cn(SECTION_TITLE, 'mx-auto mt-4 max-w-4xl')}>
						{t.heading}
					</h2>
					<p className="text-body-lg text-foreground/70 mx-auto mt-6 max-w-xl text-balance">
						{t.sub}
					</p>
					<div className="mt-9 flex justify-center">
						<AiGradientButton asChild>
							<Link
								href={BOOKING_URL}
								target="_blank"
								rel="noopener noreferrer"
							>
								<SplitHoverText as="span">
									{t.bookDemo}
								</SplitHoverText>
							</Link>
						</AiGradientButton>
					</div>
				</Reveal>
			</div>
		</section>
	)
}
