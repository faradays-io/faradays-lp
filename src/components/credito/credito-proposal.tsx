import { Reveal } from '@/components/landing/reveal'
import { SECTION_TITLE } from '@/components/landing/type'
import { cn } from '@/lib/utils'

const SHIFTS: Array<[string, string]> = [
	['De previsão de default', 'para política de decisão'],
	['De inferência passiva', 'para exploração ativa'],
	['De dados de birô', 'para fontes heterogêneas'],
	['De retorno imediato', 'para valor de longo prazo']
]

/**
 * A proposta — a transição de paradigma que o plano de trabalho descreve:
 * da classificação estática para a tomada de decisão dinâmica, com o
 * gráfico de horizonte (retorno acumulado) como âncora visual.
 */
export function CreditoProposal() {
	return (
		<section id="projeto" className="bg-background text-foreground">
			<div className="max-w-section mx-auto px-7 py-28 lg:py-36">
				<div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
					<Reveal>
						<span className="text-foreground/50 font-mono text-sm tracking-widest uppercase">
							(a proposta)
						</span>
						<h2 className={cn(SECTION_TITLE, 'mt-4')}>
							Decidir é intervir — não apenas prever
						</h2>
						<p className="text-body-lg text-foreground/70 mt-6">
							Cada decisão de crédito altera o estado e o
							comportamento dos agentes ao longo do tempo. O
							projeto reconhece essa dinâmica e converte a análise
							de crédito em um sistema de indução de políticas
							otimizadas — que melhoram o crédito no futuro, não
							apenas agora.
						</p>
						<p className="text-body text-foreground/60 mt-4">
							O enriquecimento informacional por modelos
							fundacionais tabulares e o processamento de dados
							heterogêneos mitigam a esparsidade de atributos e o
							viés de seleção herdado dos modelos tradicionais,
							avessos ao risco de curto prazo.
						</p>

						<dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
							{SHIFTS.map(([from, to]) => (
								<div key={from} className="flex flex-col gap-1">
									<dt className="text-foreground/50 font-mono text-xs tracking-widest uppercase">
										{from}
									</dt>
									<dd className="font-heading text-xl">
										{to}
									</dd>
								</div>
							))}
						</dl>
					</Reveal>

					<Reveal delay={0.15}>
						{/* Placeholder: o gráfico desta seção foi removido e
						   será substituído. */}
						<div className="border-border text-foreground/30 flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed lg:translate-y-12">
							<span className="font-heading text-7xl">!</span>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	)
}
