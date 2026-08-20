'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

import { FeatureGraphic } from '@/components/landing/feature-graphic'
import { AsciiField } from '@/components/landing/hero-demo'
import { HOME_FEATURES } from '@/components/landing/home-features-data'
import { WhatsAppHeroDemo } from '@/components/landing/whatsapp-hero-demo'
import { useLang } from '@/components/language-provider'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

/**
 * Continuação do hero + primeira subseção de features em um fluxo só.
 *
 * O painel ASCII (1 tela, transparente, glifos esmaecendo no topo e na
 * base) rola embora enquanto a demo de WhatsApp — instância única, numa
 * camada sticky que cobre a seção inteira no desktop — trava no centro da
 * viewport. O primeiro scroll down dispara (por gatilho, não scrub) a
 * diagonal da demo até a metade direita, em sincronia com a saída do CTA
 * no HomeHero; o cruzamento para a esquerda, enquanto os textos 2–4 sobem
 * pela direita, segue preso ao scroll. No fim da seção o sticky solta
 * sozinho e a página segue para as demais subseções.
 *
 * No mobile a camada da demo cobre só o painel ASCII (rola junto) e cada
 * bloco de texto mostra o seu FeatureGraphic, como antes.
 */
export function HeroFeatureFlow() {
	const { lang } = useLang()
	const rootRef = useRef<HTMLElement>(null)
	const ready = usePageReady()

	// Entrada: painel e demo continuam o stagger do hero (beats 4-5).
	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const items = root.querySelectorAll('[data-flow-intro]')
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(items, { autoAlpha: 1 })
			return
		}
		// Só depois do loader: até lá os itens ficam em opacity-0 no markup.
		if (!ready) return
		const ctx = gsap.context(() => {
			gsap.fromTo(
				'[data-flow-intro]',
				{ autoAlpha: 0, y: 40 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 1.1,
					ease: 'power3.out',
					stagger: 0.1,
					// 0.05 + 3 × 0.1: entra depois dos 3 itens do HomeHero.
					delay: 0.35
				}
			)
		}, root)
		return () => ctx.revert()
	}, [ready])

	/* Movimentos da demo (só desktop). A entrada anima [data-flow-intro]
	   (autoAlpha/y) e estes efeitos animam [data-demo-stage] — elementos
	   separados, os tweens nunca disputam o transform.

	   1. Gatilho (não scrub): o primeiro scroll down toca a diagonal
	      inteira — x anima até +25vw enquanto um compensador de pin sobe a
	      demo até onde o sticky vai prendê-la (y = -p × distância da seção
	      ao topo, recalculada a cada frame: converge a 0 quando o sticky
	      assume, então nunca há salto). Voltar ao topo reverte.
	   2. Scrub: o cruzamento direita → esquerda continua preso ao scroll,
	      disparado pela entrada do texto 2. */
	useEffect(() => {
		const root = rootRef.current
		if (!root || !ready) return
		const mm = gsap.matchMedia(root)
		mm.add('(min-width: 1024px)', () => {
			const stage = root.querySelector<HTMLElement>('[data-demo-stage]')
			const blocks = gsap.utils.toArray<HTMLElement>(
				'[data-feature]',
				root
			)
			if (!stage || blocks.length < 2) return
			const reduce = window.matchMedia(
				'(prefers-reduced-motion: reduce)'
			).matches
			// +/- 25vw centraliza o card em cada metade da viewport.
			const shift = () => window.innerWidth / 4

			// Compensador de pin: aplica o y da diagonal a cada frame.
			const proxy = { p: 0 }
			let lastY = 0
			const applyY = () => {
				const top = Math.max(0, root.getBoundingClientRect().top)
				const y = -proxy.p * top
				if (y !== lastY) {
					lastY = y
					gsap.set(stage, { y })
				}
			}
			gsap.ticker.add(applyY)

			// Diagonal centro → direita/cima, disparada no gatilho.
			const out = gsap
				.timeline({ paused: true })
				.to(stage, { x: shift, duration: 1.1, ease: 'power3.inOut' }, 0)
				.to(proxy, { p: 1, duration: 1.1, ease: 'power3.inOut' }, 0)

			/* Recarga com scroll restaurado (ou reduced motion): estado
			   final direto, sem animar à vista. */
			let initial = true
			const trigger = ScrollTrigger.create({
				start: 8,
				end: 'max',
				onEnter: () => {
					if (initial || reduce) out.progress(1)
					else out.play()
				},
				onLeaveBack: () => {
					if (reduce) out.progress(0)
					else out.reverse()
				}
			})
			initial = false

			// Direita → esquerda, enquanto o texto 2 sobe pela direita.
			// immediateRender: false — senão o fromTo aplicaria x=+25vw na
			// criação e quebraria o estado inicial centrado.
			const toLeft = gsap.fromTo(
				stage,
				{ x: shift },
				{
					x: () => -shift(),
					ease: 'none',
					immediateRender: false,
					scrollTrigger: {
						trigger: blocks[1],
						start: 'top bottom',
						end: 'top center',
						scrub: true,
						invalidateOnRefresh: true,
						// Scroll rápido demais: fecha a diagonal antes de o
						// scrub assumir o x, para os dois não disputarem.
						onEnter: () => {
							if (out.progress() < 1) out.progress(1)
						}
					}
				}
			)

			return () => {
				gsap.ticker.remove(applyY)
				trigger.kill()
				toLeft.scrollTrigger?.kill()
				out.kill()
				toLeft.kill()
				gsap.set(stage, { clearProps: 'transform' })
			}
		})
		return () => mm.revert()
	}, [ready])

	return (
		<section ref={rootRef} className="bg-background relative">
			{/* Painel ASCII: transparente, 1 tela cheia, fade no topo e na
			   base via mask — a demo NÃO mora mais aqui (está na camada
			   sticky abaixo). */}
			<div
				data-flow-intro
				className="relative h-svh w-full overflow-hidden opacity-0"
			>
				<AsciiField className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]" />
			</div>

			{/* Textos das features: bloco 1 na coluna esquerda, blocos 2-4 na
			   direita — a demo sticky ocupa a metade oposta. */}
			<div id="features" className="max-w-section mx-auto px-7">
				{HOME_FEATURES.map((feature, i) => (
					<div
						key={feature.id}
						data-feature={i}
						className="grid grid-cols-1 gap-x-16 lg:grid-cols-2"
					>
						<div
							className={cn(
								'flex min-h-svh flex-col items-center justify-center gap-6 py-24 text-left',
								i > 0 && 'lg:col-start-2'
							)}
						>
							<FeatureGraphic
								index={feature.graphic}
								className="mb-2 w-full max-w-sm lg:hidden"
							/>
							<span className="text-foreground/50 w-full max-w-md font-mono text-sm tracking-widest uppercase">
								({feature.eyebrow[lang]})
							</span>
							<h3 className="font-heading text-h2 w-full max-w-md text-balance">
								{feature.title[lang]}
							</h3>
							<p className="text-body-lg text-foreground/70 w-full max-w-md">
								{feature.description[lang]}
							</p>
							{/* Linha técnica (briefing 3.3-b): prova de domínio
							   em mono, separada da copy de negócio. */}
							<p className="text-foreground/45 w-full max-w-md font-mono text-xs leading-relaxed">
								{feature.tech[lang]}
							</p>
						</div>
					</div>
				))}
			</div>

			{/* Camada da demo: no mobile cobre só o painel ASCII (h-svh) e
			   rola embora com ele; no lg+ cobre a seção inteira e o filho
			   sticky viaja do painel até a última feature, soltando sozinho
			   no fim. Nenhum ancestral pode ganhar overflow-hidden. */}
			<div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-svh lg:bottom-0 lg:h-auto">
				<div className="sticky top-0 h-svh">
					<div data-flow-intro className="h-full opacity-0">
						<div
							data-demo-stage
							className="h-full will-change-transform"
						>
							<WhatsAppHeroDemo />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
