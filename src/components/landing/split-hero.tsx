'use client'

import gsap from 'gsap'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { HeroToolIcons } from '@/components/landing/hero-tool-icons'
import { HERO_COPY } from '@/components/landing/home-hero'
import { MonfizaAppDemo } from '@/components/landing/monfiza-app-demo'
import { useCopy } from '@/components/language-provider'
import { AiGradientButton } from '@/components/ui/ai-gradient-button'
import { ptSerif } from '@/lib/fonts'
import type { Localized } from '@/lib/i18n'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

const COPY = {
	pt: { scroll: 'Role para ver a IA trabalhando' },
	en: { scroll: 'Scroll to see the AI at work' }
} satisfies Localized<Record<string, string>>

/**
 * Hero da v2 (referência de postura: ollama.com) — duas colunas e ponto:
 * a coluna da esquerda empilha headline, sub e CTA alinhados pela vertical,
 * a da direita leva a apresentação em vídeo.
 *
 * A estilização é a do `HomeHero` da v1, item a item — PT Serif na
 * headline (a 4rem, um degrau abaixo dos 5rem de lá: aqui ela mora em 4
 * colunas), ícones das ferramentas na última palavra, sub a 70%, o
 * AiGradientButton e a entrada em stagger disparada pelo fim do loader
 * (`data-hero-item`, opacity-0 no markup até lá). O que muda é a
 * composição: lá a sub e o CTA moram numa segunda coluna alinhada pela BASE
 * da headline e a demo só entra depois, na camada sticky do
 * `HeroFeatureFlow`; aqui o CTA é um bloco só e a demo sobe para dentro do
 * hero, parada. Sem o `useRecedeOut` da v1: ele recua a copy no primeiro
 * scroll porque a demo atravessa a tela em seguida — aqui nada atravessa, e
 * a copy sumindo deixaria o hero em branco enquanto ainda está à vista.
 *
 * O slot da direita é provisório: enquanto o vídeo de apresentação não
 * existe, ele mostra a `MonfizaAppDemo` em `fill` (o chat roda em autoplay
 * sozinho, o quadro certo para uma vitrine parada) sobre a mesma banda de
 * fundo da v1 (`bg.png`). Trocar por `<video>` é substituir o miolo do slot
 * — banda e proporção ficam de pé.
 *
 * Copy: a mesma `HERO_COPY` da v1, importada e não duplicada, para as duas
 * versões dizerem a mesma coisa enquanto convivem.
 *
 * No palco escuro (o fundo do vídeo do showcase) o hero ocupa a dobra
 * inteira e ganha profundidade em três camadas na demo, de fora para
 * dentro: o scroll a faz recuar (inclina para trás e encolhe enquanto o
 * hero sai), o ponteiro a inclina alguns graus na direção do mouse, e a
 * entrada a traz deitada (rotateX 18°) até pousar de frente — o recorte
 * inclinado em 3D do vídeo, endireitando. A banda `bg.png` virou um painel
 * de vidro com a fita de IA no contorno e o horizonte acendendo por baixo.
 * Um aviso de scroll no pé da dobra diz o que vem a seguir.
 */
export function SplitHero() {
	const t = useCopy(HERO_COPY)
	const c = useCopy(COPY)
	const rootRef = useRef<HTMLElement>(null)
	const ready = usePageReady()

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const items = root.querySelectorAll('[data-hero-item]')
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(items, { autoAlpha: 1 })
			return
		}
		// Só depois do loader: até lá os itens ficam em opacity-0 no markup.
		if (!ready) return
		const ctx = gsap.context(() => {
			gsap.fromTo(
				'[data-hero-item]',
				{ autoAlpha: 0, y: 40 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 1.1,
					ease: 'power3.out',
					stagger: 0.1,
					delay: 0.05
				}
			)
			// Entrada da demo: deitada, pousa de frente. Junto do stagger.
			gsap.fromTo(
				'[data-hero-rise]',
				{
					rotationX: 18,
					y: 60,
					scale: 0.94,
					transformPerspective: 1600
				},
				{
					rotationX: 0,
					y: 0,
					scale: 1,
					duration: 1.8,
					ease: 'power3.out',
					delay: 0.25
				}
			)
			// Saída com scrub: a demo recua enquanto o hero deixa a tela.
			// `fromTo` com o início explícito: num `to` o GSAP gravava
			// opacidade 0 como ponto de partida e a demo nascia apagada.
			// Só em lg+: empilhado, a demo fica abaixo da copy e ainda
			// está sendo lida quando o hero começa a sair.
			if (!window.matchMedia('(min-width: 64rem)').matches) return
			gsap.fromTo(
				'[data-hero-recede]',
				{
					autoAlpha: 1,
					rotationX: 0,
					scale: 1,
					transformPerspective: 1600
				},
				{
					autoAlpha: 0.35,
					rotationX: -10,
					scale: 0.92,
					ease: 'none',
					scrollTrigger: {
						trigger: root,
						start: 'top top',
						end: 'bottom top',
						scrub: 0.5
					}
				}
			)
		}, root)

		// Inclinação pelo ponteiro — só com mouse de verdade.
		const tilt = root.querySelector<HTMLElement>('[data-hero-tilt]')
		const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
		if (!tilt || !fine.matches) return () => ctx.revert()
		gsap.set(tilt, { transformPerspective: 1600 })
		const rx = gsap.quickTo(tilt, 'rotationX', {
			duration: 0.9,
			ease: 'power3.out'
		})
		const ry = gsap.quickTo(tilt, 'rotationY', {
			duration: 0.9,
			ease: 'power3.out'
		})
		const onMove = (e: PointerEvent) => {
			const box = root.getBoundingClientRect()
			const nx = (e.clientX - box.left) / box.width - 0.5
			const ny = (e.clientY - box.top) / box.height - 0.5
			ry(nx * 8)
			rx(-ny * 6)
		}
		const onLeave = () => {
			rx(0)
			ry(0)
		}
		root.addEventListener('pointermove', onMove)
		root.addEventListener('pointerleave', onLeave)
		return () => {
			root.removeEventListener('pointermove', onMove)
			root.removeEventListener('pointerleave', onLeave)
			ctx.revert()
		}
	}, [ready])

	return (
		<section
			id="hero"
			ref={rootRef}
			className="relative flex w-full flex-col pt-8 pb-10 lg:min-h-[calc(100svh-5.75rem)] lg:pt-10"
		>
			{/* `my-auto` centra a dobra na altura que sobra abaixo da nav;
			   o aviso de scroll fica no pé. */}
			<div className="max-w-page mx-auto w-full px-[var(--gutter)] lg:my-auto">
				{/* Grade de 12 com as laterais vazias, o padrão do canvas:
				   copy nas colunas 2-5, vídeo nas 6-11 — 4 + 6 fecham o
				   miolo de 10, com o vídeo levando a parte maior. Copy e
				   demo centradas uma na outra (`items-center`). Abaixo de lg
				   empilha — em coluna estreita não há medida para os dois
				   lado a lado. */}
				<div className="grid grid-cols-1 items-center gap-x-[var(--grid-gap)] gap-y-12 lg:grid-cols-12">
					{/* CTA: título, descrição e botão num eixo vertical só. */}
					<div className="lg:col-span-4 lg:col-start-2">
						{/* TESTE de tipografia (como na v1): PT Serif só nesta
						   headline — a fonte não está no par ativo do
						   registry, então vem pela className do next/font.
						   `font-medium` cai no Regular 400, a família não tem
						   500. */}
						<h1
							data-hero-item
							className={cn(
								ptSerif.className,
								'text-glow text-[4rem]/[1.05] font-medium text-balance opacity-0'
							)}
						>
							{t.headlineLead}{' '}
							{/* Última palavra + ícones num nowrap: o slot
							   nunca cai sozinho na linha de baixo. */}
							<span className="whitespace-nowrap">
								{t.headlineTail}{' '}
								<HeroToolIcons
									label={t.toolsLabel}
									className="ml-[0.05em]"
								/>
							</span>
						</h1>

						<p
							data-hero-item
							className="text-body-lg text-foreground/70 mt-8 max-w-xl text-pretty opacity-0"
						>
							{t.sub}
						</p>

						<div
							data-hero-item
							className="mt-8 flex items-center gap-3 opacity-0"
						>
							<AiGradientButton asChild>
								<Link href="#cta">
									<SplitHoverText as="span">
										{t.bookDemo}
									</SplitHoverText>
								</Link>
							</AiGradientButton>
						</div>
					</div>

					{/* Vídeo de apresentação num painel de vidro. Três
					   camadas de transform (recuo no scroll › ponteiro ›
					   entrada), cada uma com a própria perspectiva
					   (`transformPerspective` do GSAP), para os
					   tweens não se sobrescreverem. O padding proporcional é
					   o da banda da v1 (8,5% × 3,95%), e a proporção 13/9 é a
					   da demo pinada de lá — mais achatada, o chat corta o
					   topo em cima de um balão; segurando a proporção o
					   bloco também não pula quando o vídeo real entrar. */}
					<div
						data-hero-item
						className="opacity-0 lg:col-span-6 lg:col-start-6"
					>
						<div data-hero-recede className="origin-top">
							<div data-hero-tilt>
								<div
									data-hero-rise
									className="relative isolate origin-bottom"
								>
									{/* Halo sob o painel: a luz que o
									   horizonte joga nele. */}
									<div
										aria-hidden
										className="absolute inset-x-[4%] top-[35%] -bottom-[10%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(40,110,255,0.6),rgba(29,106,229,0.18)_60%,transparent)] blur-2xl"
									/>
									{/* Contorno: 1px de padding sobre a fita
									   de IA, esmaecida — borda em gradiente
									   sem o vazamento do background-clip. */}
									<div className="rounded-2xl bg-[linear-gradient(150deg,rgba(255,255,255,0.22),rgba(255,255,255,0.05)_35%,rgba(56,189,248,0.4)_75%,rgba(124,140,248,0.6))] p-px shadow-[0_40px_120px_-40px_rgba(29,106,229,0.7)]">
										<div className="rounded-[calc(1rem-1px)] bg-[radial-gradient(120%_80%_at_50%_120%,rgba(40,110,255,0.55),rgba(29,106,229,0.14)_45%,transparent_70%),linear-gradient(#07080c,#07080c)] px-[8.5%] py-[3.95%]">
											<div className="relative aspect-[13/9] w-full">
												<MonfizaAppDemo fill />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Aviso de scroll: âncora para as features, com um traço
			   descendo em loop. Só na dobra cheia (lg+) — empilhado, o
			   conteúdo já passa da tela e o convite é o próprio corte. */}
			<a
				href="#features"
				data-hero-item
				className="text-foreground/50 hover:text-foreground/80 mx-auto mt-10 hidden flex-col items-center gap-3 font-mono text-xs tracking-widest uppercase opacity-0 transition-colors lg:flex"
			>
				{c.scroll}
				<span
					aria-hidden
					className="bg-foreground/15 relative block h-10 w-px overflow-hidden"
				>
					<span className="absolute inset-x-0 top-0 block h-1/2 animate-[scroll-cue_1.8s_var(--ease-fluid)_infinite] bg-[linear-gradient(to_bottom,transparent,#4aa8ff)] motion-reduce:animate-none" />
				</span>
			</a>
		</section>
	)
}
