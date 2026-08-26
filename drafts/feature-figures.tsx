/**
 * Subseção das features: grade técnica clara. As três figuras (FIG 01 pilha,
 * FIG 02 nós, FIG 03 momentum) moram em
 * `src/components/landing/feature-figures-art.tsx` — foram promovidas para lá
 * quando a `MoreFeatures` passou a usá-las.
 */

'use client'

import {
	FigMomentum,
	FigNodes,
	FigStack
} from '@/components/landing/feature-figures-art'
import { useCopy } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'

const COPY = {
	pt: {
		title: 'Uma nova espécie de software operacional.',
		titleSub:
			'Sob medida para times modernos, com IA no núcleo, a Faradays define um novo padrão para operar e decidir.',
		dataTitle: 'IA com os seus dados',
		dataSub: 'Agentes respondem com o que está no banco — nunca inventam.',
		speedTitle: 'Feito para velocidade',
		speedSub: 'Menos planilha e retrabalho: alertas e decisões na hora.'
	},
	en: {
		title: 'A new species of operational software.',
		titleSub:
			'Purpose-built for modern teams, with AI at the core, Faradays sets a new standard for operating and deciding.',
		dataTitle: 'AI with your data',
		dataSub:
			'Agents answer with what is in the database — they never make things up.',
		speedTitle: 'Built for speed',
		speedSub:
			'Less spreadsheet work and rework: alerts and decisions on the spot.'
	}
} satisfies Localized<Record<string, string>>

/* Fundo pontilhado sutil atrás das células que têm figura. */
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
		<span className="text-foreground/40 absolute top-4 left-5 font-mono text-[10px] tracking-[0.2em] uppercase">
			{children}
		</span>
	)
}

function TitleBlock() {
	const t = useCopy(COPY)
	return (
		<>
			<h3 className="font-heading text-h3 text-balance">{t.title}</h3>
			<p className="text-body-sm text-foreground/60">{t.titleSub}</p>
		</>
	)
}

function TextBlocks() {
	const t = useCopy(COPY)
	return (
		<>
			<div className="flex flex-col gap-1.5">
				<h4 className="text-body font-medium">{t.dataTitle}</h4>
				<p className="text-body-sm text-foreground/60">{t.dataSub}</p>
			</div>
			<div className="flex flex-col gap-1.5">
				<h4 className="text-body font-medium">{t.speedTitle}</h4>
				<p className="text-body-sm text-foreground/60">{t.speedSub}</p>
			</div>
		</>
	)
}

/**
 * Grade técnica de 5 colunas com exatamente DOIS pesos de linha (referência:
 * docs/image copy 12.png, Raycast): célula grande (15rem) e pequena (2.5rem).
 * Estrutura (lg+):
 *   1. cinco células vazias, grandes;
 *   2. cinco células vazias, pequenas;
 *   3-4. duas linhas grandes — laterais divididas em duas células · título
 *        mesclando as duas linhas na col 2 · imagem 1 numa mescla 2×2
 *        (cols 3-4);
 *   5. cinco células vazias normais (sem mescla), pequenas;
 *   6. UMA linha grande — extremidades (cols 1 e 5) vazias · img / texto /
 *      img nas colunas centrais;
 *   7. cinco células vazias, pequenas;
 *   8. cinco células vazias, grandes (fecha a grade).
 * Vinheta de esmaecimento nas laterais por cima da grade.
 */
export function FeatureFigures() {
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

	return (
		<div className="bg-background text-foreground">
			<div className="max-w-section mx-auto px-7 py-32">
				<div className="relative">
					{/* lg+: a grade completa (abaixo disso as células de 1/5
					   ficam estreitas demais para o texto). */}
					<div className="border-border hidden border lg:grid lg:grid-cols-5 lg:grid-rows-[15rem_2.5rem_15rem_15rem_2.5rem_15rem_2.5rem_15rem]">
						{/* Linha 1 — vazia, grande. */}
						{row(5, 'r1')}
						{/* Linha 2 — vazia, pequena. */}
						{row(5, 'r2')}

						{/* Linhas 3-4: laterais divididas em duas células;
						   centro (título e imagem 2×2) mesclando as duas
						   alturas normais — posicionamento explícito para
						   garantir a geometria. */}
						<div className="border-border col-start-1 row-start-3 border-r border-b" />
						<div className="border-border col-start-1 row-start-4 border-r border-b" />
						<div className="border-border col-start-2 row-span-2 row-start-3 flex flex-col justify-center gap-4 border-r border-b p-7">
							<TitleBlock />
						</div>
						<div className="border-border relative col-span-2 col-start-3 row-span-2 row-start-3 overflow-hidden border-r border-b p-8">
							<DottedBackdrop />
							<FigLabel>FIG_01</FigLabel>
							{/* Altura explícita (não percentual): svg dentro de
							   grid item com h-full pode cair no tamanho
							   intrínseco do viewBox e estourar a célula. */}
							<div className="relative flex h-full items-center justify-center">
								<FigStack className="h-72 w-auto" />
							</div>
						</div>
						<div className="border-border col-start-5 row-start-3 border-b" />
						<div className="border-border col-start-5 row-start-4 border-b" />

						{/* Linha 5 — vazia, pequena, todas as colunas normais. */}
						{row(5, 'r5')}

						{/* Linha 6 — UMA célula grande por coluna: extremidades
						   vazias · img / texto / img. */}
						<div className="border-border border-r border-b" />
						<div className="border-border relative overflow-hidden border-r border-b p-6">
							<DottedBackdrop />
							<FigLabel>FIG_02</FigLabel>
							<div className="relative flex h-full items-center justify-center">
								<FigNodes className="h-full w-full" />
							</div>
						</div>
						<div className="border-border flex flex-col justify-center gap-6 border-r border-b p-6">
							<TextBlocks />
						</div>
						<div className="border-border relative overflow-hidden border-r border-b p-6">
							<DottedBackdrop />
							<FigLabel>FIG_03</FigLabel>
							<div className="relative flex h-full items-center justify-center">
								<FigMomentum className="h-full w-full" />
							</div>
						</div>
						<div className="border-border border-b" />

						{/* Linha 7 — vazia, pequena. */}
						{row(5, 'r7')}
						{/* Linha 8 — vazia, grande (fecha a grade). */}
						{row(5, 'r8', true)}
					</div>

					{/* Abaixo de lg: pilha simples com as mesmas células. */}
					<div className="border-border flex flex-col border lg:hidden">
						<div className="border-border flex flex-col gap-4 border-b p-6">
							<TitleBlock />
						</div>
						<div className="border-border relative overflow-hidden border-b p-6">
							<DottedBackdrop />
							<FigLabel>FIG_01</FigLabel>
							<div className="relative mx-auto w-full max-w-72 pt-6">
								<FigStack className="h-auto w-full" />
							</div>
						</div>
						<div className="border-border relative overflow-hidden border-b p-6">
							<DottedBackdrop />
							<FigLabel>FIG_02</FigLabel>
							<div className="relative mx-auto w-full max-w-52 pt-6">
								<FigNodes className="h-auto w-full" />
							</div>
						</div>
						<div className="border-border flex flex-col gap-8 border-b p-6">
							<TextBlocks />
						</div>
						<div className="relative overflow-hidden p-6">
							<DottedBackdrop />
							<FigLabel>FIG_03</FigLabel>
							<div className="relative mx-auto w-full max-w-52 pt-6">
								<FigMomentum className="h-auto w-full" />
							</div>
						</div>
					</div>

					{/* Vinheta — esmaecimento nas quatro bordas da grade. */}
					<div
						aria-hidden
						className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent md:w-44"
					/>
					<div
						aria-hidden
						className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l to-transparent md:w-44"
					/>
					<div
						aria-hidden
						className="from-background pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b to-transparent md:h-24"
					/>
					<div
						aria-hidden
						className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t to-transparent md:h-24"
					/>
				</div>
			</div>
		</div>
	)
}
