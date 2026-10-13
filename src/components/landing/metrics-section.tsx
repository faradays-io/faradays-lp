'use client'

import { AnimatedCounter } from '@/components/landing/animated-counter'
import { Reveal } from '@/components/landing/reveal'
import { useCopy } from '@/components/language-provider'
import { ptSerif } from '@/lib/fonts'
import type { Localized } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/* Números PLACEHOLDER — ordem de grandeza plausível para a demo, não medição
   de cliente. Trocar pelos números reais (com a fonte) antes de ir ao ar. */
const COPY = {
	pt: {
		heading: 'O que muda quando a rotina sai da planilha',
		metrics: [
			{
				value: 3,
				suffix: ' min',
				label: 'da mensagem no WhatsApp à cotação em PDF'
			},
			{
				value: 90,
				suffix: '%',
				label: 'dos pedidos entram no sistema sem ninguém digitar'
			},
			{
				value: 5,
				suffix: 'x',
				label: 'mais cotações respondidas por representante no dia'
			},
			{
				value: 24,
				suffix: 'h',
				label: 'por dia o time tem resposta, inclusive fora do expediente'
			}
		]
	},
	en: {
		heading: 'What changes when the routine leaves the spreadsheet',
		metrics: [
			{
				value: 3,
				suffix: ' min',
				label: 'from a WhatsApp message to a PDF quote'
			},
			{
				value: 90,
				suffix: '%',
				label: 'of orders reach the system without anyone typing'
			},
			{
				value: 5,
				suffix: 'x',
				label: 'more quotes answered per sales rep each day'
			},
			{
				value: 24,
				suffix: 'h',
				label: 'a day the team gets answers, after hours included'
			}
		]
	}
} satisfies Localized<{
	heading: string
	metrics: { value: number; suffix: string; label: string }[]
}>

/**
 * Faixa de métricas antes dos relatos — abre o trecho escuro do fim da
 * página (métricas → relatos → rodapé). Título nas colunas 2-5 e, ao lado,
 * a lista nas 7-11: uma métrica por linha, descrição à esquerda e o número
 * à direita, na fonte dos títulos (PT Serif). Cada número conta de zero
 * quando a faixa entra (`AnimatedCounter`, disparado pela seção para os
 * quatro andarem juntos).
 */
export function MetricsSection() {
	const t = useCopy(COPY)
	return (
		<section id="metrics" className="text-foreground py-28 lg:py-40">
			<div className="max-w-page mx-auto w-full px-[var(--gutter)]">
				<div className="grid grid-cols-1 gap-x-[var(--grid-gap)] lg:grid-cols-12">
					<Reveal
						y={24}
						className="lg:col-span-4 lg:col-start-2"
						trigger="#metrics"
					>
						<h2
							className={cn(
								ptSerif.className,
								'text-[3rem]/[1.05] font-medium text-balance'
							)}
						>
							{t.heading}
						</h2>
					</Reveal>

					<dl className="mt-16 flex flex-col lg:col-span-5 lg:col-start-7 lg:mt-0">
						{t.metrics.map((metric, i) => (
							<Reveal
								key={metric.label}
								y={24}
								delay={i * 0.1}
								trigger="#metrics"
								className="border-border flex items-center justify-between gap-8 border-t py-8 last:border-b"
							>
								<dt className="text-body-lg text-foreground/60 max-w-[20rem] text-pretty">
									{metric.label}
								</dt>
								<dd className="shrink-0 text-right">
									<AnimatedCounter
										value={metric.value}
										suffix={metric.suffix}
										trigger="#metrics"
										className={cn(
											ptSerif.className,
											'text-[3.5rem] leading-none font-medium tabular-nums lg:text-[4.5rem]'
										)}
									/>
								</dd>
							</Reveal>
						))}
					</dl>
				</div>
			</div>
		</section>
	)
}
