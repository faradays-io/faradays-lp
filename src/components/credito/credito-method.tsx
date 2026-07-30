import { ChartEnrichment } from '@/components/credito/credito-charts'
import { WorldGraph } from '@/components/credito/world-graph'
import { Reveal } from '@/components/landing/reveal'
import { SECTION_TITLE } from '@/components/landing/type'
import { cn } from '@/lib/utils'

const PILLARS = [
	{
		n: 'Pilar 01',
		title: 'Enriquecimento via modelos fundacionais',
		paragraphs: [
			'O núcleo técnico usa Tabular Foundation Models como extratores de informação robusta: em vez de engenharia de atributos manual, o conhecimento estrutural pré-adquirido mapeia dados heterogêneos em representações que capturam invariantes de crédito.',
			'A base do Lending Club — com datas de concessão, pagamentos e status — ancora a validação, modelando a trajetória financeira do devedor. Fontes adicionais (registros públicos, consumo, indicadores setoriais) são prospectadas avaliando ganho informacional contra risco de viés.'
		],
		Chart: ChartEnrichment
	},
	{
		n: 'Pilar 02',
		title: 'Indução de políticas e modelagem do ambiente',
		paragraphs: [
			'Um ambiente de simulação estratégica (World Model) incorpora a dinâmica de Predição Performativa: as decisões de crédito alteram a distribuição futura dos perfis, e a política precisa contar com isso.',
			'A otimização explora o equilíbrio entre aproveitar perfis conhecidos e explorar novos nichos — combinando Aprendizagem por Reforço Offline, Aprendizado Ativo e Predição Performativa para reduzir a incerteza sobre o segmento rejeitado.'
		],
		Chart: WorldGraph
	},
	{
		n: 'Pilar 03',
		title: 'Validação e análise de impacto',
		paragraphs: [
			'Comparação rigorosa entre as políticas dinâmicas induzidas e os baselines estáticos usados na indústria — XGBoost, LightGBM e afins.',
			'A avaliação não se limita à acurácia preditiva: mede a robustez da política sob cenários de estresse e a capacidade de manter equidade e rentabilidade de longo prazo no ambiente de simulação.'
		],
		Chart: null
	}
]

/**
 * Metodologia — os três pilares do plano de trabalho, alternando texto e
 * gráfico; o terceiro pilar (validação) fecha em largura total.
 */
export function CreditoMethod() {
	return (
		<section id="metodologia" className="bg-background text-foreground">
			<div className="max-w-section mx-auto px-7 py-28 lg:py-36">
				<Reveal className="max-w-3xl">
					<span className="text-foreground/50 font-mono text-sm tracking-widest uppercase">
						(metodologia)
					</span>
					<h2 className={cn(SECTION_TITLE, 'mt-4')}>
						Três pilares, um sistema de decisão
					</h2>
					<p className="text-body-lg text-foreground/70 mt-6 max-w-2xl">
						Representação profunda integrada a sistemas de decisão
						sob incerteza — do tratamento de distribution shift e
						aprendizagem por reforço offline aos paradigmas de
						predição performativa e aprendizado ativo.
					</p>
				</Reveal>

				<div className="mt-16 flex flex-col gap-20 lg:gap-28">
					{PILLARS.map((pillar, i) =>
						pillar.Chart ? (
							<div
								key={pillar.n}
								className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
							>
								<Reveal
									className={cn(
										i % 2 === 1 && 'lg:order-last'
									)}
								>
									<span className="text-foreground/50 font-mono text-sm tracking-widest uppercase">
										({pillar.n})
									</span>
									<h3 className="font-heading text-h3 mt-4 text-balance">
										{pillar.title}
									</h3>
									{/* Descrição com respiro horizontal maior
									   que o título. */}
									<div className="mt-4 flex flex-col gap-4 md:px-10">
										{pillar.paragraphs.map((paragraph) => (
											<p
												key={paragraph.slice(0, 24)}
												className="text-body text-foreground/60"
											>
												{paragraph}
											</p>
										))}
									</div>
								</Reveal>
								<Reveal delay={0.15}>
									{/* Interativo: no pilar 01 o ponteiro
									   escolhe a fonte; no pilar 02 os nós do
									   grafo podem ser arrastados. */}
									<div className="relative aspect-[4/3] w-full overflow-hidden">
										<pillar.Chart className="absolute inset-0 h-full" />
									</div>
								</Reveal>
							</div>
						) : (
							<Reveal key={pillar.n}>
								<div className="border-border grid grid-cols-1 gap-8 border-t pt-10 lg:grid-cols-[1fr_2fr]">
									<div>
										<span className="text-foreground/50 font-mono text-sm tracking-widest uppercase">
											({pillar.n})
										</span>
										<h3 className="font-heading text-h4 mt-4 text-balance">
											{pillar.title}
										</h3>
									</div>
									<div className="flex max-w-3xl flex-col gap-6">
										{pillar.paragraphs.map((paragraph) => (
											<p
												key={paragraph.slice(0, 24)}
												className="text-body text-foreground/60"
											>
												{paragraph}
											</p>
										))}
									</div>
								</div>
							</Reveal>
						)
					)}
				</div>
			</div>
		</section>
	)
}
