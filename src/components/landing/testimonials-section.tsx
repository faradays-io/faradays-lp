'use client'

import { Reveal } from '@/components/landing/reveal'
import { useCopy } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'

/**
 * Social proof — relatos em grade técnica (mesmo vocabulário da seção de
 * partners: moldura fechada, linhas-fio via `gap-px` sobre fundo `border`).
 * Conteúdo placeholder até termos depoimentos reais aprovados.
 */
type Testimonial = {
	quote: string
	name: string
	role: string
	company: string
}

const COPY = {
	pt: {
		heading: 'O que os times dizem',
		eyebrow: '(prova social)',
		metrics: [
			{ value: '-70%', label: 'tempo por análise de proposta' },
			{ value: '3×', label: 'mais cotações comparadas por dia' },
			{ value: '100%', label: 'das decisões com trilha rastreável' }
		],
		testimonials: [
			{
				quote: 'A gente saiu de planilhas espalhadas em três times para um lugar só. O que antes levava uma tarde de conferência hoje resolve em minutos, com histórico de tudo.',
				name: 'Nome Sobrenome',
				role: 'Gerente de operações',
				company: 'Monfiza'
			},
			{
				quote: 'O que mais me convenceu foi a IA responder com os nossos números, não com texto genérico. Quando ela aponta um preço fora da curva, dá para clicar e ver a origem.',
				name: 'Nome Sobrenome',
				role: 'Diretor comercial',
				company: 'Aventis'
			},
			{
				quote: 'Implantação sem drama: conectaram no que já usávamos — e-mail, Excel — e o time adotou porque parou de fazer trabalho repetido, não porque alguém mandou.',
				name: 'Nome Sobrenome',
				role: 'Head de crédito',
				company: 'Empresa'
			}
		] as Testimonial[]
	},
	en: {
		heading: 'What teams say',
		eyebrow: '(social proof)',
		metrics: [
			{ value: '-70%', label: 'time per proposal analysis' },
			{ value: '3×', label: 'more quotes compared per day' },
			{ value: '100%', label: 'of decisions with a traceable trail' }
		],
		testimonials: [
			{
				quote: 'We went from spreadsheets scattered across three teams to a single place. What used to take an afternoon of cross-checking now resolves in minutes, with a history of everything.',
				name: 'Full Name',
				role: 'Operations manager',
				company: 'Monfiza'
			},
			{
				quote: 'What convinced me most was the AI answering with our numbers, not generic text. When it flags a price off the curve, you can click and see where it came from.',
				name: 'Full Name',
				role: 'Sales director',
				company: 'Aventis'
			},
			{
				quote: 'Rollout without drama: they plugged into what we already used — e-mail, Excel — and the team adopted it because the repeated work stopped, not because someone ordered it.',
				name: 'Full Name',
				role: 'Head of credit',
				company: 'Company'
			}
		] as Testimonial[]
	}
} satisfies Localized<unknown>

export function TestimonialsSection() {
	const t = useCopy(COPY)
	return (
		<section id="testimonials" className="px-7 py-24 md:py-36">
			<div className="w-full">
				<Reveal>
					<div className="border-border border">
						<div className="border-border flex flex-wrap items-baseline justify-between gap-2 border-b px-5 py-4">
							<h2 className="text-body-lg font-medium uppercase">
								{t.heading}
							</h2>
							<span className="text-foreground/40 font-mono text-[10px] tracking-[0.2em] uppercase">
								{t.eyebrow}
							</span>
						</div>

						{/* Faixa de métricas — números placeholder. */}
						<div className="bg-border border-border grid grid-cols-1 gap-px border-b md:grid-cols-3">
							{t.metrics.map((metric) => (
								<div
									key={metric.value}
									className="bg-background flex flex-col gap-1 px-5 py-6"
								>
									<span className="font-heading text-h3">
										{metric.value}
									</span>
									<span className="text-body-sm text-foreground/60">
										{metric.label}
									</span>
								</div>
							))}
						</div>

						{/* Relatos. */}
						<div className="bg-border grid grid-cols-1 gap-px md:grid-cols-3">
							{t.testimonials.map((testimonial, i) => (
								<figure
									key={testimonial.company}
									className="bg-background flex flex-col justify-between gap-10 p-7"
								>
									<div className="flex flex-col gap-5">
										<span className="text-foreground/40 font-mono text-[10px] tracking-[0.2em] uppercase">
											{`REL_0${i + 1}`}
										</span>
										<blockquote className="text-body text-foreground/80 text-pretty">
											“{testimonial.quote}”
										</blockquote>
									</div>
									<figcaption className="flex flex-col gap-0.5">
										<span className="text-body-sm font-medium">
											{testimonial.name}
										</span>
										<span className="text-foreground/60 font-mono text-xs tracking-wide uppercase">
											{testimonial.role} ·{' '}
											{testimonial.company}
										</span>
									</figcaption>
								</figure>
							))}
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	)
}
