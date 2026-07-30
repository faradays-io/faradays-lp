import { Reveal } from '@/components/landing/reveal'
import { SECTION_TITLE } from '@/components/landing/type'
import { cn } from '@/lib/utils'

const OBJECTIVES = [
	{
		n: '01',
		title: 'Políticas de decisão dinâmicas',
		description:
			'Do simples score de risco para um sistema que recomenda intervenções otimizadas no tempo — aprovação, ajuste de limites, oferta de produtos — visando o valor vitalício do cliente.'
	},
	{
		n: '02',
		title: 'Mitigar o viés de seleção',
		description:
			'Aprendizado Ativo e Aprendizagem por Reforço Offline reduzem a incerteza sobre perfis negligenciados, transformando o hiato informacional dos rejeitados em vantagem de aprendizado.'
	},
	{
		n: '03',
		title: 'Enriquecimento via modelos fundacionais',
		description:
			'Arquiteturas baseadas em Tabular Foundation Models extraem representações latentes de fontes heterogêneas, integrando priors que compensam a esparsidade dos atributos tradicionais.'
	},
	{
		n: '04',
		title: 'Robustez a mudanças de distribuição',
		description:
			'Algoritmos adaptativos fundamentados em Predição Performativa ajustam a política diante de variações macroeconômicas e do efeito retroalimentador das próprias decisões.'
	},
	{
		n: '05',
		title: 'Fairness como objetivo intrínseco',
		description:
			'A justiça entra na função objetivo do modelo — não como restrição periférica — assegurando expansão de carteira ética e alinhada às diretrizes de governança social (ESG).'
	}
]

/**
 * Objetivos — o objetivo principal como statement e os cinco específicos
 * em grade numerada.
 */
export function CreditoObjectives() {
	return (
		<section id="objetivos" className="bg-background text-foreground">
			<div className="max-w-section mx-auto px-7 py-28 lg:py-36">
				<Reveal className="max-w-3xl">
					<span className="text-foreground/50 font-mono text-sm tracking-widest uppercase">
						(objetivos)
					</span>
					<h2 className={cn(SECTION_TITLE, 'mt-4')}>
						Retorno de longo prazo, risco sob controle
					</h2>
					<p className="text-body-lg text-foreground/70 mt-6 max-w-2xl">
						Desenvolver e validar uma plataforma de inteligência de
						crédito fundamentada em enriquecimento informacional e
						decisão dinâmica — maximizando retorno financeiro no
						longo prazo, mitigando riscos e garantindo conformidade
						regulatória.
					</p>
				</Reveal>

				{/* Grade 3×2 (lg) / 2×3 (md) — bordas explícitas por célula,
				   como na grade técnica de /importacoes: border-r exceto na
				   última coluna, border-b exceto na última linha. */}
				<div className="border-border mt-16 grid grid-cols-1 border md:grid-cols-2 lg:grid-cols-3">
					{OBJECTIVES.map((objective, i) => (
						<Reveal
							key={objective.n}
							delay={(i % 3) * 0.1}
							className={cn(
								'border-border flex flex-col gap-4 p-7',
								/* base (1 coluna): última célula sem border-b. */
								i < 4 && 'border-b',
								/* md (2 colunas × 3 linhas). */
								i % 2 === 0 && i !== 4 && 'md:border-r',
								/* lg (3 colunas × 2 linhas). */
								i % 3 !== 2 ? 'lg:border-r' : 'lg:border-r-0',
								i >= 3 ? 'lg:border-b-0' : 'lg:border-b'
							)}
						>
							<span className="text-foreground/40 font-mono text-xs tracking-[0.2em]">
								{objective.n}
							</span>
							<h3 className="font-heading text-h5 text-balance">
								{objective.title}
							</h3>
							<p className="text-body-sm text-foreground/60">
								{objective.description}
							</p>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	)
}
