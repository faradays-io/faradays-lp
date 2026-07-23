import { Reveal } from '@/components/landing/reveal'

/**
 * Social proof — relatos em grade técnica (mesmo vocabulário da seção de
 * partners: moldura fechada, linhas-fio via `gap-px` sobre fundo `border`).
 * Conteúdo placeholder até termos depoimentos reais aprovados.
 */
const METRICS = [
	{ value: '-70%', label: 'tempo por análise de proposta' },
	{ value: '3×', label: 'mais cotações comparadas por dia' },
	{ value: '100%', label: 'das decisões com trilha rastreável' }
]

const TESTIMONIALS = [
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
]

export function TestimonialsSection() {
	return (
		<section id="testimonials" className="px-7 py-24 md:py-36">
			<div className="w-full">
				<Reveal>
					<div className="border-border border">
						<div className="border-border flex flex-wrap items-baseline justify-between gap-2 border-b px-5 py-4">
							<h2 className="text-body-lg font-medium uppercase">
								O que os times dizem
							</h2>
							<span className="text-foreground/40 font-mono text-[10px] tracking-[0.2em] uppercase">
								(social proof)
							</span>
						</div>

						{/* Faixa de métricas — números placeholder. */}
						<div className="bg-border border-border grid grid-cols-1 gap-px border-b md:grid-cols-3">
							{METRICS.map((metric) => (
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
							{TESTIMONIALS.map((testimonial, i) => (
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
