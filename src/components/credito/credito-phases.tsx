import { Reveal } from '@/components/landing/reveal'
import { SECTION_TITLE } from '@/components/landing/type'
import { cn } from '@/lib/utils'

const PHASES = [
	{
		n: 'Fase 01',
		title: 'Experimentação e adaptação de TFMs',
		description:
			'Testes rigorosos de modelos fundacionais tabulares em cenários de crédito: resiliência a distribution shifts e estratégias de adaptação de contexto — quais amostras devem compor o suporte da inferência em tempo de execução.'
	},
	{
		n: 'Fase 02',
		title: 'Modelagem de ambientes de simulação',
		description:
			'Construção de world models para validação de políticas, explorando premissas dos TFMs e bases com alta granularidade temporal. O foco: capturar a natureza performativa e a evolução dos perfis.'
	},
	{
		n: 'Fase 03',
		title: 'Plataforma temporal (PoC)',
		description:
			'Implementação e validação do protótipo funcional do motor de decisão, consolidando os módulos de enriquecimento e as políticas induzidas num ambiente que suporta a dimensão sequencial do crédito.'
	},
	{
		n: 'Fase 04',
		title: 'Análise de impacto e robustez',
		description:
			'Métricas e protocolos de teste que quantificam a estabilidade da plataforma frente a mudanças estruturais no mercado, com auditoria de impacto financeiro (ROI) e de equidade (fairness).'
	}
]

/**
 * Escopo — as quatro fases do projeto empilhadas na vertical: fase e
 * título à esquerda, descrição à direita, sem datas nem cronograma.
 */
export function CreditoPhases() {
	return (
		<section id="escopo" className="bg-background text-foreground">
			<div className="max-w-section mx-auto px-7 py-28 lg:py-36">
				<Reveal className="max-w-3xl">
					<span className="text-foreground/50 font-mono text-sm tracking-widest uppercase">
						(escopo)
					</span>
					<h2 className={cn(SECTION_TITLE, 'mt-4')}>
						Da investigação fundamental ao protótipo validado
					</h2>
				</Reveal>

				<div className="mt-16 flex flex-col">
					{PHASES.map((phase, i) => (
						<Reveal
							key={phase.n}
							delay={i * 0.06}
							className="border-border grid grid-cols-1 gap-4 border-t py-9 md:grid-cols-[minmax(0,24rem)_1fr] md:gap-24 lg:gap-32"
						>
							<div className="flex flex-col gap-3">
								<span className="text-brand font-mono text-xs tracking-[0.2em] uppercase">
									{phase.n}
								</span>
								<h3 className="font-heading text-h4 text-balance">
									{phase.title}
								</h3>
							</div>
							<p className="text-body text-foreground/60 max-w-2xl self-center">
								{phase.description}
							</p>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	)
}
