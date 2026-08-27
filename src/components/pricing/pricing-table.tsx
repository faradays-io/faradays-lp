'use client'

import { Check, Minus } from '@phosphor-icons/react'

import { Reveal } from '@/components/landing/reveal'
import { useCopy, useLang } from '@/components/language-provider'
import {
	FEATURE_MATRIX,
	type MatrixValue,
	PLANS
} from '@/components/pricing/pricing-data'
import type { Lang, Localized } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const COPY = {
	pt: {
		heading: 'Tudo o que cada plano inclui',
		sub: 'A lista completa, frente a frente — para quem procura um item específico.',
		included: 'Incluído',
		notIncluded: 'Não incluído',
		featureCol: 'Recurso'
	},
	en: {
		heading: 'Everything each plan includes',
		sub: 'The full list, side by side — for those looking for a specific item.',
		included: 'Included',
		notIncluded: 'Not included',
		featureCol: 'Feature'
	}
} satisfies Localized<Record<string, string>>

function Cell({ value, lang }: { value: MatrixValue; lang: Lang }) {
	const t = useCopy(COPY)
	if (typeof value === 'object')
		return <span className="text-body-sm sm:text-body">{value[lang]}</span>
	return value ? (
		<Check weight="bold" aria-label={t.included} className="size-4" />
	) : (
		<Minus
			aria-label={t.notIncluded}
			className="text-foreground/25 size-4"
		/>
	)
}

/**
 * Matriz completa de recursos × planos, agrupada por frente do produto.
 * Título em cima, tabela embaixo; só a linha de cabeçalho da tabela gruda
 * enquanto ela rola — com uma folga do topo (`top-16`), não colada nele.
 * A tampa do `before:` tem a mesma altura da folga.
 *
 * `border-separate` porque com `border-collapse` a borda do `th` não
 * acompanha a célula grudada — as linhas levam a borda nas células, não no
 * `tr`. A coluna Pro do cabeçalho precisa de fundo opaco (o conteúdo passa
 * por baixo), então o véu vira um color-mix sobre o background. E como o
 * cabeçalho gruda abaixo do topo, as linhas passariam à vista na faixa
 * acima dele — o `before:` de cada `th` tampa essa faixa com o fundo.
 *
 * Cabe inteira em qualquer largura: no mobile as colunas de valor encolhem
 * (texto menor, menos padding) e o rótulo do recurso quebra linha.
 */
export function PricingTable() {
	const { lang } = useLang()
	const t = useCopy(COPY)

	return (
		<section id="comparativo" className="px-7 py-24 md:py-32">
			<div className="mx-auto max-w-7xl">
				<Reveal>
					<h2 className="font-heading text-h2 max-w-2xl text-balance">
						{t.heading}
					</h2>
					<p className="text-body text-foreground/70 mt-4 max-w-xl text-pretty">
						{t.sub}
					</p>
				</Reveal>

				<Reveal className="mt-14" y={24}>
					<table className="w-full border-separate border-spacing-0 text-left">
						<thead>
							<tr>
								<th
									scope="col"
									className="bg-background text-foreground/50 border-border before:bg-background sticky top-16 z-10 w-[40%] border-b py-4 pr-3 font-mono text-xs font-normal tracking-widest uppercase before:absolute before:inset-x-0 before:bottom-full before:h-16 before:content-[''] sm:pr-6"
								>
									{t.featureCol}
								</th>
								{PLANS.map((plan) => (
									<th
										key={plan.id}
										scope="col"
										className={cn(
											"border-border before:bg-background sticky top-16 z-10 border-b px-2 py-4 text-center font-mono text-sm font-normal tracking-widest uppercase before:absolute before:inset-x-0 before:bottom-full before:h-16 before:content-[''] sm:px-4 sm:text-base",
											plan.highlight
												? 'rounded-t-md bg-[color-mix(in_oklch,var(--foreground)_3.5%,var(--background))]'
												: 'bg-background'
										)}
									>
										{plan.name}
									</th>
								))}
							</tr>
						</thead>
						{FEATURE_MATRIX.map((group) => (
							<tbody key={group.title.pt}>
								<tr>
									<th
										scope="colgroup"
										colSpan={PLANS.length + 1}
										className="text-foreground/50 pt-10 pb-3 text-left font-mono text-xs font-normal tracking-widest uppercase"
									>
										{group.title[lang]}
									</th>
								</tr>
								{group.rows.map((row) => (
									<tr key={row.label.pt}>
										<th
											scope="row"
											className="text-body-sm sm:text-body border-border border-t py-4 pr-3 font-normal text-pretty sm:pr-6"
										>
											{row.label[lang]}
										</th>
										{PLANS.map((plan) => (
											<td
												key={plan.id}
												className={cn(
													'border-border border-t px-2 py-4 text-center sm:px-4',
													plan.highlight &&
														'bg-foreground/[0.035]'
												)}
											>
												<span className="inline-flex items-center justify-center">
													<Cell
														value={
															row.values[plan.id]
														}
														lang={lang}
													/>
												</span>
											</td>
										))}
									</tr>
								))}
							</tbody>
						))}
					</table>
				</Reveal>
			</div>
		</section>
	)
}
