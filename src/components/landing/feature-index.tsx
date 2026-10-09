'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

import {
	HOME_FEATURES,
	MORE_FEATURES
} from '@/components/landing/home-features-data'
import {
	DemoFragment,
	type FragmentScreen
} from '@/components/landing/monfiza-app-demo'
import { Reveal } from '@/components/landing/reveal'
import { useCopy, useLang } from '@/components/language-provider'
import { ptSerif } from '@/lib/fonts'
import type { Localized } from '@/lib/i18n'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const COPY = {
	pt: { indexLabel: 'Índice das features' },
	en: { indexLabel: 'Feature index' }
} satisfies Localized<Record<string, string>>

/* A quinta feature vem da grade "e mais": o quadro do gestor. As quatro de
   destaque são o representante operando (chat, cotação, RFQ, laudos); sem
   esta, a página promete "o gestor acompanhando tudo no portal" (metadata) e
   nunca mostra. A posição é guardada pelo `satisfies`: reordenar a grade
   quebra o tsc aqui, não a página. */
const PORTAL = MORE_FEATURES[6] satisfies { id: 'portal' }

const FEATURES: readonly {
	id: FragmentScreen
	label: Localized<string>
	title: Localized<string>
	description: Localized<string>
}[] = [
	...HOME_FEATURES.map((feature) => ({
		id: feature.id,
		label: feature.eyebrow,
		title: feature.title,
		description: feature.description
	})),
	{
		id: 'portal',
		label: { pt: 'Portal', en: 'Portal' },
		title: PORTAL.title,
		description: PORTAL.description
	}
]

/**
 * Features da v2 em duas colunas: um índice sticky à esquerda e, à direita,
 * cada frente com título, descrição e um recorte da demo — só a tela
 * daquela feature, com o card dela entrando no fim (`DemoFragment`).
 *
 * É a versão simples do que o `HeroFeatureFlow` faz na v1 — lá as quatro
 * features vivem em holds de 300svh com a demo pinada, cursor fake e uma
 * tour por bloco; o scroll inteiro da seção é coreografia. Aqui o scroll é
 * scroll: os blocos passam e o que reage é o índice.
 *
 * O índice lê como um carregamento, mas só do item atual: a linha do bloco
 * que ocupa a faixa de leitura (45% da viewport, do topo à base dele) enche
 * da esquerda para a direita conforme o scroll avança — um tween com
 * `scrub`, então ela segue o scroll e não o tempo, e volta junto quando se
 * rola para cima. Os outros itens mostram só o trilho: o preenchimento dos
 * blocos já lidos continua em 1 (para reaparecer no lugar certo ao voltar),
 * mas fica invisível — o destaque é da seção atual, e nada mais. O mesmo
 * trigger cuida da cor pelo `onToggle`.
 *
 * Os itens são âncoras de verdade: o Lenis global intercepta o clique e
 * desce suave, já descontando a altura da nav (`anchors.offset` no
 * LenisProvider).
 */
export function FeatureIndex() {
	const { lang } = useLang()
	const t = useCopy(COPY)
	const rootRef = useRef<HTMLElement>(null)
	const ready = usePageReady()
	const [active, setActive] = useState(0)

	useEffect(() => {
		const root = rootRef.current
		if (!root || !ready) return
		const ctx = gsap.context(() => {
			const blocks = gsap.utils.toArray<HTMLElement>(
				'[data-feature-block]',
				root
			)
			const fills = gsap.utils.toArray<HTMLElement>(
				'[data-index-fill]',
				root
			)
			blocks.forEach((block, i) => {
				const fill = fills[i]
				if (!fill) return
				gsap.fromTo(
					fill,
					{ scaleX: 0 },
					{
						scaleX: 1,
						ease: 'none',
						scrollTrigger: {
							trigger: block,
							start: 'top 45%',
							end: 'bottom 45%',
							// Um pouco de lag: a linha desliza atrás do
							// scroll em vez de tremer com ele.
							scrub: 0.4,
							onToggle: (self) => {
								if (self.isActive) setActive(i)
							}
						}
					}
				)
			})
		}, root)
		return () => ctx.revert()
	}, [ready])

	return (
		<section
			id="features"
			ref={rootRef}
			className="bg-background text-foreground py-24 lg:py-32"
		>
			<div className="max-w-page mx-auto w-full px-[var(--gutter)]">
				{/* Índice nas colunas 2-3, blocos nas 5-11: a coluna 4 fica
				   de respiro entre as duas e as laterais seguem vazias, como
				   no resto do canvas. Abaixo de lg o índice some — numa
				   coluna só ele viraria uma lista repetida antes do conteúdo,
				   sem o sticky que lhe dá sentido. */}
				<div className="grid grid-cols-1 gap-x-[var(--grid-gap)] lg:grid-cols-12">
					<nav
						aria-label={t.indexLabel}
						className="hidden lg:col-span-2 lg:col-start-2 lg:block"
					>
						{/* `self-start` + `top` abaixo da nav fixa: o índice
						   acompanha a leitura sem encostar nela. */}
						<ol className="sticky top-32 flex flex-col gap-7 self-start">
							{FEATURES.map((feature, i) => (
								<li key={feature.id}>
									<a
										href={`#feature-${feature.id}`}
										aria-current={
											i === active ? 'true' : undefined
										}
										className={cn(
											'block transition-colors duration-300',
											i === active
												? 'text-foreground'
												: 'text-foreground/40 hover:text-foreground/70'
										)}
									>
										<span className="font-mono text-xs tracking-widest">
											{String(i + 1).padStart(2, '0')}
										</span>
										<span className="font-heading text-h6 mt-1 block text-balance">
											{feature.label[lang]}
										</span>
										{/* Trilho + preenchimento. O GSAP
										   escala o preenchimento pela origem
										   esquerda (a barra "carrega"); a
										   opacidade é da classe — só o item
										   ativo mostra a barra, os demais
										   ficam no trilho. */}
										<span
											aria-hidden
											className="bg-border mt-3 block h-0.5 w-full overflow-hidden"
										>
											<span
												data-index-fill
												className={cn(
													'bg-foreground block h-full w-full origin-left scale-x-0 transition-opacity duration-300',
													i === active
														? 'opacity-100'
														: 'opacity-0'
												)}
											/>
										</span>
									</a>
								</li>
							))}
						</ol>
					</nav>

					<div className="lg:col-span-7 lg:col-start-5">
						{FEATURES.map((feature) => (
							<article
								key={feature.id}
								id={`feature-${feature.id}`}
								data-feature-block
								className="border-border border-t py-20 first:border-t-0 first:pt-0 lg:py-28 lg:first:pt-0"
							>
								<Reveal y={24}>
									{/* A mesma voz do hero (`SplitHero`): PT Serif
									   pela className do next/font, `font-medium`
									   caindo no Regular. 3rem é o degrau abaixo
									   dos 4rem de lá na escala de quarta (÷1.333)
									   — o título da feature responde à headline
									   sem disputar com ela. */}
									<h3
										className={cn(
											ptSerif.className,
											'text-[3rem]/[1.05] font-medium'
										)}
									>
										{feature.title[lang]}
									</h3>
									<p className="text-body-lg text-foreground/70 mt-5 text-pretty">
										{feature.description[lang]}
									</p>
									{/* Título e descrição na largura da coluna, sem medida
									   própria nem balanceamento de linhas: o texto ocupa o
									   mesmo campo que a ilustração abaixo. */}
									<DemoFragment
										screen={feature.id}
										className="mt-16 lg:mt-20"
									/>
								</Reveal>
							</article>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
