'use client'

import { Check } from '@phosphor-icons/react'
import Link from 'next/link'
import { useState } from 'react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { Reveal } from '@/components/landing/reveal'
import { SECTION_TITLE } from '@/components/landing/type'
import { useCopy, useLang } from '@/components/language-provider'
import { formatBrl, PriceTicker } from '@/components/pricing/price-ticker'
import {
	type Billing,
	type Plan,
	PLANS,
	YEARLY_DISCOUNT
} from '@/components/pricing/pricing-data'
import { Button } from '@/components/ui/button'
import type { Localized } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const COPY = {
	pt: {
		heading: 'Um plano para cada tamanho de operação',
		sub: 'Comece pelo que a sua equipe usa hoje e cresça quando a operação pedir — sem trocar de ferramenta no meio do caminho.',
		monthly: 'Mensal',
		yearly: 'Anual',
		billingLabel: 'Periodicidade da cobrança',
		mostChosen: 'Mais escolhido',
		custom: 'Sob consulta',
		customNote: 'escopo e valor definidos com o time',
		perMonth: '/mês',
		billedMonthly: 'cobrado mensalmente',
		billedYearly: 'cobrado anualmente',
		perYear: '/ano',
		includes: 'Inclui',
		footnote:
			'Valores em reais (BRL), impostos não incluídos. O anual é cobrado de uma vez, no início do ciclo.'
	},
	en: {
		heading: 'A plan for every size of operation',
		sub: 'Start with what your team uses today and grow when the operation asks for it — without switching tools halfway.',
		monthly: 'Monthly',
		yearly: 'Yearly',
		billingLabel: 'Billing period',
		mostChosen: 'Most chosen',
		custom: 'Custom',
		customNote: 'scope and price set with the team',
		perMonth: '/mo',
		billedMonthly: 'billed monthly',
		billedYearly: 'billed yearly',
		perYear: '/yr',
		includes: 'Includes',
		footnote:
			'Prices in Brazilian reais (BRL), taxes not included. Yearly plans are billed once, at the start of the cycle.'
	}
} satisfies Localized<Record<string, string>>

/* Controle segmentado mensal/anual: o indicador escuro desliza por baixo do
   rótulo ativo (translateX, não troca de fundo), e o anual carrega a badge
   com o desconto derivado de YEARLY_DISCOUNT. Semântica de radio group. */
function BillingToggle({
	value,
	onChange
}: {
	value: Billing
	onChange: (next: Billing) => void
}) {
	const t = useCopy(COPY)
	const options: { id: Billing; label: string }[] = [
		{ id: 'monthly', label: t.monthly },
		{ id: 'yearly', label: t.yearly }
	]
	return (
		<div
			role="radiogroup"
			aria-label={t.billingLabel}
			className="border-border bg-background relative inline-grid grid-cols-2 rounded-md border p-1"
		>
			<span
				aria-hidden
				className={cn(
					'bg-foreground pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-[0.3rem] transition-transform duration-300',
					value === 'yearly' && 'translate-x-full'
				)}
			/>
			{options.map((option) => {
				const active = option.id === value
				return (
					<button
						key={option.id}
						type="button"
						role="radio"
						aria-checked={active}
						onClick={() => onChange(option.id)}
						className={cn(
							'relative z-10 flex h-8 items-center justify-center gap-2 px-5 font-mono text-sm tracking-wide uppercase transition-colors duration-300',
							active
								? 'text-background'
								: 'text-foreground/60 hover:text-foreground'
						)}
					>
						{option.label}
						{option.id === 'yearly' && (
							<span
								className={cn(
									'rounded-[0.2rem] px-1.5 py-0.5 text-[0.65rem] leading-none transition-colors duration-300',
									active
										? 'bg-background/15 text-background'
										: 'bg-brand/10 text-brand'
								)}
							>
								−{Math.round(YEARLY_DISCOUNT * 100)}%
							</span>
						)}
					</button>
				)
			})}
		</div>
	)
}

/* Card de plano. O destaque (Pro) é a mesma marcação com o escopo `.dark`:
   os tokens invertem para a subárvore (fundo escuro, texto claro, botão
   claro) sem duplicar classe por classe — o mesmo truque do `.light` que a
   página inteira usa. */
function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
	const { lang } = useLang()
	const t = useCopy(COPY)
	const pricing = plan.pricing

	return (
		<article
			className={cn(
				'bg-background text-foreground border-border relative flex flex-col rounded-xl border p-8',
				plan.highlight && 'dark lg:-mt-6'
			)}
		>
			<header className="flex items-start justify-between gap-4">
				<span className="font-mono text-base tracking-widest uppercase">
					{plan.name}
				</span>
				{plan.highlight && (
					<span className="bg-brand text-brand-foreground rounded-[0.3rem] px-2 py-1 font-mono text-[0.65rem] leading-none tracking-wider uppercase">
						{t.mostChosen}
					</span>
				)}
			</header>
			<p className="text-body-sm text-foreground/60 mt-3 min-h-[2.9em] text-pretty">
				{plan.tagline[lang]}
			</p>

			{/* O bloco do preço tem a mesma altura nos três cards: o "Sob
			   consulta" do Enterprise ocupa a linha do número, e a nota
			   abaixo ocupa a linha do "cobrado …". */}
			<div className="mt-8">
				{pricing === 'custom' ? (
					<>
						<p className="font-heading text-[2.75rem] leading-none tracking-tight">
							{t.custom}
						</p>
						<p className="text-foreground/50 mt-3 font-mono text-xs tracking-wide">
							{t.customNote}
						</p>
					</>
				) : (
					<>
						<div className="flex items-baseline gap-2">
							<PriceTicker
								value={
									billing === 'yearly'
										? pricing.yearly
										: pricing.monthly
								}
								lang={lang}
								className="font-heading text-[2.75rem] leading-none tracking-tight"
							/>
							<span className="text-foreground/60 text-body-sm">
								{t.perMonth}
							</span>
						</div>
						<p className="text-foreground/50 mt-3 font-mono text-xs tracking-wide">
							{billing === 'yearly'
								? `${t.billedYearly} · ${formatBrl(pricing.yearly * 12, lang)}${t.perYear}`
								: t.billedMonthly}
						</p>
					</>
				)}
			</div>

			<Button asChild size="lg" className="mt-8 w-full">
				<Link
					href={plan.ctaHref}
					target="_blank"
					rel="noopener noreferrer"
				>
					<SplitHoverText as="span">{plan.cta[lang]}</SplitHoverText>
				</Link>
			</Button>

			<div className="border-border mt-8 border-t pt-6">
				<p className="text-foreground/50 font-mono text-xs tracking-widest uppercase">
					{plan.inherits ? plan.inherits[lang] : t.includes}
				</p>
				<ul className="mt-4 flex flex-col gap-3">
					{plan.features[lang].map((feature) => (
						<li
							key={feature}
							className="text-body-sm flex gap-3 text-pretty"
						>
							<Check
								weight="bold"
								aria-hidden
								className="mt-0.5 size-4 shrink-0"
							/>
							<span>{feature}</span>
						</li>
					))}
				</ul>
			</div>

			<p className="text-foreground/50 mt-auto pt-8 font-mono text-xs tracking-wide uppercase">
				{plan.seats[lang]}
			</p>
		</article>
	)
}

/**
 * Abertura da página de preços: título, o toggle mensal/anual e os três
 * cards lado a lado (empilhados abaixo de lg). O estado de cobrança vive
 * aqui — só os cards dependem dele; o comparativo abaixo não.
 */
export function PricingPlans() {
	const t = useCopy(COPY)
	const [billing, setBilling] = useState<Billing>('yearly')

	return (
		<section id="planos" className="px-7 pt-16 pb-24 md:pt-24 md:pb-32">
			<div className="mx-auto max-w-7xl">
				<Reveal className="flex flex-col items-center text-center">
					<h1 className={cn(SECTION_TITLE, 'max-w-4xl')}>
						{t.heading}
					</h1>
					<p className="text-body-lg text-foreground/70 mt-6 max-w-xl text-balance">
						{t.sub}
					</p>
					<div className="mt-10">
						<BillingToggle value={billing} onChange={setBilling} />
					</div>
				</Reveal>

				{/* `items-stretch` iguala as alturas; o `-mt-6` do Pro cresce
				   para cima a partir da base comum. `pt-6` reserva o espaço. */}
				<div className="mt-16 grid gap-4 lg:grid-cols-3 lg:items-stretch lg:pt-6">
					{PLANS.map((plan, i) => (
						<Reveal key={plan.id} delay={i * 0.1} className="flex">
							<PlanCard plan={plan} billing={billing} />
						</Reveal>
					))}
				</div>

				<p className="text-foreground/50 mt-8 text-center font-mono text-xs tracking-wide text-balance">
					{t.footnote}
				</p>
			</div>
		</section>
	)
}
