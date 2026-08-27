'use client'

import {
	FigLedger,
	FigMomentum,
	FigNodes
} from '@/components/landing/feature-figures-art'
import { MORE_FEATURES } from '@/components/landing/home-features-data'
import { Reveal } from '@/components/landing/reveal'
import { useCopy, useLang } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const COPY = {
	pt: {
		heading: 'O resto da operação também mora aqui.'
	},
	en: {
		heading: 'The rest of the operation lives here too.'
	}
} satisfies Localized<Record<string, string>>

function TitleBlock() {
	const t = useCopy(COPY)
	return <h2 className="font-heading text-h2 text-balance">{t.heading}</h2>
}

/* Célula de feature — o tipo é o mesmo em toda a grade (os oito itens têm o
   mesmo peso editorial); quem varia é só a área que a célula ocupa e o
   alinhamento vertical. O `max-w-sm` segura a medida do parágrafo nas células
   de duas colunas. */
function FeatureCell({
	index,
	align = 'center',
	className
}: {
	index: number
	align?: 'center' | 'bottom'
	className?: string
}) {
	const { lang } = useLang()
	const item = MORE_FEATURES[index]
	return (
		<div
			className={cn(
				'border-border flex flex-col gap-2.5 p-6',
				align === 'bottom' ? 'justify-end' : 'justify-center',
				className
			)}
		>
			<h3 className="text-h4 font-medium">{item.title[lang]}</h3>
			<p className="text-body-sm text-foreground/60 max-w-sm">
				{item.description[lang]}
			</p>
		</div>
	)
}

/* Célula de ilustração — mesma caixa da FeatureCell, mas com a figura centrada
   e recortada na borda. A altura do svg é explícita (não `h-full`): dentro de
   um grid item o svg cai no tamanho intrínseco do viewBox e estoura a célula.
   Figuras na mesma área usam a mesma altura para pesarem igual — daí o
   `figureClassName` (célula 1×1 fica em h-40, mescla 2×2 em h-80). */
function FigureCell({
	figure: Figure,
	figureClassName = 'h-40',
	className
}: {
	figure: (props: { className?: string }) => React.JSX.Element
	figureClassName?: string
	className?: string
}) {
	return (
		<div
			className={cn(
				'border-border relative flex items-center justify-center overflow-hidden p-6',
				className
			)}
		>
			{/* Trama pontilhada atrás da figura — a mesma das células de figura
			   do manifesto em drafts/. `pointer-events-none` porque a FIG 03 lê
			   o cursor por cima dela. */}
			<div
				aria-hidden
				className="bg-dotted pointer-events-none absolute inset-0"
			/>
			{/* `relative` para a figura ficar acima da trama: elemento
			   posicionado pinta depois de irmão estático, então sem isso o
			   fundo cobriria o desenho. */}
			<Figure className={cn('relative w-auto', figureClassName)} />
		</div>
	)
}

/**
 * Grade "e mais": as frentes do produto que não viraram feature de destaque —
 * responde ao comprador que procura um item específico e sairia da página
 * achando que o produto não tem.
 *
 * Cinco colunas e dois pesos de linha (14rem cheia · 2.5rem fina), na herança
 * da folha técnica de drafts/feature-figures.tsx. Três bandas de altura DUPLA
 * (linhas 3-4, 8-9 e 11-12): uma mescla 2×2 só existe visualmente se medir o
 * dobro de uma célula normal. As laterais (cols 1 e 5) ficam vazias e, nas
 * bandas duplas, divididas em duas células.
 * Estrutura (lg+):
 *   1. cinco células vazias, grandes;
 *   2. finas;
 *   3-4. BANDA DUPLA — título num 1×2 na col 2 · quatro células 1×1 nas
 *        cols 3-4 (features 2 e 4 em cima, 5 e 6 embaixo);
 *   5. finas;
 *   6-7. BANDA DUPLA — feature 0 num 1×2 na col 2, alinhada ao rodapé da
 *        célula · FIG 04 numa mescla 2×2 (cols 3-4);
 *   8. finas;
 *   9. UMA linha — feature 1 na col 2 · FIG 03 na col 3 · feature 3 na col 4;
 *  10. finas;
 *  11-12. BANDA DUPLA — o espelho da banda 6-7: FIG 02 numa mescla 2×2
 *         (cols 2-3) · feature 7 num 1×2 na col 4 (também ao rodapé);
 *  13. finas;
 *  14. cinco células vazias, grandes (fecha a grade).
 * As oito entradas de MORE_FEATURES são posicionadas à mão — mexer no dado
 * pede rever a distribuição aqui.
 *
 * As linhas vazias entram por auto-placement e as bandas duplas por
 * `col-start`/`row-start` explícitos. Isso só fecha porque cada banda ocupa as
 * CINCO colunas das suas duas linhas: o cursor do auto-placement só anda para
 * frente, então ele pula a banda inteira e cai na linha fina seguinte. Deixar
 * um buraco numa banda faz a linha fina de baixo subir para dentro dela.
 *
 * Vinheta de esmaecimento nas quatro bordas por cima da grade.
 */
export function MoreFeatures() {
	const { lang } = useLang()
	const t = useCopy(COPY)

	const row = (count: number, prefix: string, last = false) =>
		Array.from({ length: count }, (_, i) => (
			<div
				key={`${prefix}-${i}`}
				className={cn(
					'border-border',
					!last && 'border-b',
					i < count - 1 && 'border-r'
				)}
			/>
		))

	return (
		<div className="px-7 py-32">
			{/* Estreita de propósito em relação ao `max-w-section` das outras
			   seções: com 5 colunas na medida cheia as células ficam largas
			   demais para o par título/parágrafo curto. */}
			<div className="mx-auto max-w-[106rem]">
				<Reveal>
					<div className="relative">
						{/* lg+: a grade completa (abaixo disso as células de
						   1/5 ficam estreitas demais para o texto). */}
						<div className="border-border hidden border lg:grid lg:grid-cols-5 lg:grid-rows-[8rem_2.5rem_14rem_14rem_2.5rem_14rem_14rem_2.5rem_14rem_2.5rem_14rem_14rem_2.5rem_8rem]">
							{/* Linha 1 — vazia, grande. */}
							{row(5, 'r1')}
							{/* Linha 2 — vazia, fina. */}
							{row(5, 'r2')}

							{/* Banda 3-4 — laterais divididas em duas células ·
							   título num 1×2 · quatro 1×1 no miolo. */}
							<div className="border-border col-start-1 row-start-3 border-r border-b" />
							<div className="border-border col-start-1 row-start-4 border-r border-b" />
							<div className="border-border col-start-2 row-span-2 row-start-3 flex flex-col justify-center border-r border-b p-7">
								<TitleBlock />
							</div>
							<FeatureCell
								index={2}
								className="col-start-3 row-start-3 border-r border-b"
							/>
							<FeatureCell
								index={4}
								className="col-start-4 row-start-3 border-r border-b"
							/>
							<FeatureCell
								index={5}
								className="col-start-3 row-start-4 border-r border-b"
							/>
							<FeatureCell
								index={6}
								className="col-start-4 row-start-4 border-r border-b"
							/>
							<div className="border-border col-start-5 row-start-3 border-b" />
							<div className="border-border col-start-5 row-start-4 border-b" />

							{/* Linha 5 — vazia, fina. */}
							{row(5, 'r5')}

							{/* Banda 6-7 — feature num 1×2 ao rodapé · FIG 04
							   numa mescla 2×2. */}
							<div className="border-border col-start-1 row-start-6 border-r border-b" />
							<div className="border-border col-start-1 row-start-7 border-r border-b" />
							<FeatureCell
								index={0}
								align="bottom"
								className="col-start-2 row-span-2 row-start-6 border-r border-b"
							/>
							<FigureCell
								figure={FigLedger}
								figureClassName="h-80"
								className="col-span-2 col-start-3 row-span-2 row-start-6 border-r border-b"
							/>
							<div className="border-border col-start-5 row-start-6 border-b" />
							<div className="border-border col-start-5 row-start-7 border-b" />

							{/* Linha 8 — vazia, fina. */}
							{row(5, 'r8')}

							{/* Linha 9 — vazia · feature · FIG 03 · feature ·
							   vazia. */}
							<div className="border-border border-r border-b" />
							<FeatureCell
								index={1}
								className="border-r border-b"
							/>
							<FigureCell
								figure={FigMomentum}
								className="border-r border-b"
							/>
							<FeatureCell
								index={3}
								className="border-r border-b"
							/>
							<div className="border-border border-b" />

							{/* Linha 10 — vazia, fina. */}
							{row(5, 'r10')}

							{/* Banda 11-12 — o espelho da banda 6-7: FIG 02 em
							   2×2 · feature num 1×2 ao rodapé. */}
							<div className="border-border col-start-1 row-start-11 border-r border-b" />
							<div className="border-border col-start-1 row-start-12 border-r border-b" />
							{/* `group/figs`: a célula inteira é o gatilho de hover
							   da figura — o cursor em qualquer ponto dela (não
							   só sobre o desenho) acende os traços e levita o
							   nó. Quem lê o grupo é a FigNodes. */}
							<FigureCell
								figure={FigNodes}
								figureClassName="h-80"
								className="group/figs col-span-2 col-start-2 row-span-2 row-start-11 border-r border-b"
							/>
							<FeatureCell
								index={7}
								align="bottom"
								className="col-start-4 row-span-2 row-start-11 border-r border-b"
							/>
							<div className="border-border col-start-5 row-start-11 border-b" />
							<div className="border-border col-start-5 row-start-12 border-b" />

							{/* Linha 13 — vazia, fina. */}
							{row(5, 'r13')}
							{/* Linha 14 — vazia, grande (fecha a grade). */}
							{row(5, 'r14', true)}
						</div>

						{/* Abaixo de lg: pilha simples com as mesmas células. */}
						<div className="border-border border lg:hidden">
							<div className="border-border border-b p-6">
								<h2 className="font-heading text-h2 max-w-2xl text-balance">
									{t.heading}
								</h2>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2">
								{MORE_FEATURES.map((item) => (
									<div
										key={item.title.pt}
										className={cn(
											'border-border flex flex-col gap-2.5 border-b p-6 last:border-b-0',
											'sm:[&:nth-child(odd)]:border-r sm:[&:nth-last-child(-n+2)]:border-b-0'
										)}
									>
										<h3 className="text-h4 font-medium">
											{item.title[lang]}
										</h3>
										<p className="text-body-sm text-foreground/60">
											{item.description[lang]}
										</p>
									</div>
								))}
							</div>
						</div>

						{/* Vinheta — esmaecimento nas quatro bordas da grade.
						   Só no lg+: na pilha do mobile ela lavaria o texto,
						   que ali encosta na borda. */}
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
					</div>
				</Reveal>
			</div>
		</div>
	)
}
