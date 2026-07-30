import {
	ChartBlindSpot,
	ChartLoop,
	ChartSparse
} from '@/components/credito/credito-charts'
import { Reveal } from '@/components/landing/reveal'
import { SECTION_TITLE } from '@/components/landing/type'
import { cn } from '@/lib/utils'

const PROBLEMS = [
	{
		fig: 'FIG_01',
		title: 'Inferência de rejeitados',
		description:
			'Ao negar crédito, a instituição deixa de aprender sobre um vasto segmento de potenciais clientes. O ponto cego perpetua vieses e esconde nichos de mercado lucrativos.',
		Chart: ChartBlindSpot
	},
	{
		fig: 'FIG_02',
		title: 'Ciclos de retroalimentação',
		description:
			'Decisões tomadas sobre dados incompletos se reforçam: grupos que recebem menos crédito passam a parecer mais arriscados, consolidando perdas e expondo a riscos regulatórios.',
		Chart: ChartLoop
	},
	{
		fig: 'FIG_03',
		title: 'Dependência de dados restritos',
		description:
			'Modelos presos a variáveis de birô negligenciam a riqueza de dados heterogêneos — e a capacidade de generalização dos modelos de fundação — agravando a esparsidade e o viés de seleção.',
		Chart: ChartSparse
	}
]

/* Fundo pontilhado sutil atrás das células que têm figura (padrão da
   grade técnica da home/importações). */
function DottedBackdrop() {
	return (
		<div
			aria-hidden
			className="bg-dotted pointer-events-none absolute inset-0"
		/>
	)
}

function FigLabel({ children }: { children: string }) {
	return (
		<span className="text-foreground/40 absolute top-4 left-5 z-10 font-mono text-[10px] tracking-[0.2em] uppercase">
			{children}
		</span>
	)
}

function ProblemText({ problem }: { problem: (typeof PROBLEMS)[number] }) {
	return (
		<>
			<h3 className="font-heading text-h5 text-balance">
				{problem.title}
			</h3>
			<p className="text-body-sm text-foreground/60">
				{problem.description}
			</p>
		</>
	)
}

/**
 * O problema — grade técnica no padrão de FeatureFigures (/importacoes):
 * 5 colunas, laterais e linhas de respiro vazias, vinheta nas bordas.
 * Cada problema ocupa duas linhas: descrição numa célula 1×2 e figura
 * numa mescla 2×2, alternando os lados a cada problema (desc/figura,
 * figura/desc, desc/figura). As laterais dividem-se em duas células.
 */
export function CreditoProblem() {
	const row = (count: number, prefix: string, last = false) =>
		Array.from({ length: count }, (_, i) => (
			<div
				key={`${prefix}-${i}`}
				className={[
					'border-border',
					last ? '' : 'border-b',
					i < count - 1 ? 'border-r' : ''
				].join(' ')}
			/>
		))

	/* Um bloco de problema: grade própria de 2 linhas — as bordas por
	   célula emendam com os blocos vizinhos como se fosse uma grade só. */
	const problemBlock = (index: number) => {
		const problem = PROBLEMS[index]
		const flipped = index % 2 === 1
		const textCell = (
			<div
				key="text"
				className="border-border row-span-2 flex flex-col justify-center gap-4 border-r border-b p-7"
			>
				<ProblemText problem={problem} />
			</div>
		)
		const figureCell = (
			<div
				key="figure"
				className="border-border relative col-span-2 row-span-2 overflow-hidden border-r border-b"
			>
				<DottedBackdrop />
				<FigLabel>{problem.fig}</FigLabel>
				<problem.Chart className="absolute inset-0 h-full" />
			</div>
		)
		return (
			<div
				key={problem.fig}
				className="grid grid-cols-5 grid-rows-[13rem_13rem]"
			>
				{/* Lateral esquerda dividida em duas células. */}
				<div className="border-border border-r border-b" />
				{flipped ? [figureCell, textCell] : [textCell, figureCell]}
				{/* Lateral direita dividida em duas células. */}
				<div className="border-border border-b" />
				<div className="border-border border-r border-b" />
				<div className="border-border border-b" />
			</div>
		)
	}

	return (
		<section id="problema" className="bg-background text-foreground">
			<div className="max-w-section mx-auto px-7 py-28 lg:py-36">
				<Reveal className="max-w-3xl">
					<span className="text-foreground/50 font-mono text-sm tracking-widest uppercase">
						(o problema)
					</span>
					<h2 className={cn(SECTION_TITLE, 'mt-4')}>
						O mercado de crédito decide olhando para trás
					</h2>
					<p className="text-body-lg text-foreground/70 mt-6 max-w-2xl">
						Modelos estáticos, treinados em históricos fixos, perdem
						eficácia diante da volatilidade econômica e de mudanças
						no comportamento dos agentes. A visão reativa de
						previsão de default gera três gargalos que comprometem
						rentabilidade e gestão de risco.
					</p>
				</Reveal>

				<Reveal className="relative mt-16" y={0}>
					{/* lg+: grade completa — abaixo disso as células de 1/5
					   ficam estreitas demais. */}
					<div className="border-border hidden border lg:block">
						{/* Respiro de abertura. */}
						<div className="grid grid-cols-5 grid-rows-[8rem_2.5rem]">
							{row(5, 'r1')}
							{row(5, 'r2')}
						</div>

						{problemBlock(0)}
						<div className="grid grid-cols-5 grid-rows-[2.5rem]">
							{row(5, 's1')}
						</div>
						{problemBlock(1)}
						<div className="grid grid-cols-5 grid-rows-[2.5rem]">
							{row(5, 's2')}
						</div>
						{problemBlock(2)}

						{/* Respiro de fechamento. */}
						<div className="grid grid-cols-5 grid-rows-[2.5rem_8rem]">
							{row(5, 'r-b')}
							{row(5, 'r-end', true)}
						</div>
					</div>

					{/* Abaixo de lg: pilha simples com as mesmas células. */}
					<div className="border-border flex flex-col border lg:hidden">
						{PROBLEMS.map((problem, i) => (
							<div
								key={problem.fig}
								className={cn(
									'flex flex-col',
									i < PROBLEMS.length - 1 &&
										'border-border border-b'
								)}
							>
								<div className="border-border relative h-64 overflow-hidden border-b">
									<DottedBackdrop />
									<FigLabel>{problem.fig}</FigLabel>
									<problem.Chart className="absolute inset-0 h-full" />
								</div>
								<div className="flex flex-col gap-3 p-6">
									<ProblemText problem={problem} />
								</div>
							</div>
						))}
					</div>

					{/* Vinheta — esmaecimento nas quatro bordas da grade
					   (só em lg+, onde as laterais são vazias). */}
					<div
						aria-hidden
						className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-gradient-to-r to-transparent md:w-44 lg:block"
					/>
					<div
						aria-hidden
						className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l to-transparent md:w-44 lg:block"
					/>
					<div
						aria-hidden
						className="from-background pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-14 bg-gradient-to-b to-transparent md:h-24 lg:block"
					/>
					<div
						aria-hidden
						className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-14 bg-gradient-to-t to-transparent md:h-24 lg:block"
					/>
				</Reveal>
			</div>
		</section>
	)
}
