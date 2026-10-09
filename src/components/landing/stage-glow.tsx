'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

import { usePageReady } from '@/lib/page-ready'

gsap.registerPlugin(ScrollTrigger)

export type StageScene = 'hero' | 'g1' | 'g2' | 'g3' | 'cta'

/**
 * A luz do vídeo do showcase atrás da página: uma camada fixa, sob o
 * conteúdo, com o horizonte azul e as duas manchas (desenho e cenários no
 * bloco "Palco escuro" do globals.css).
 *
 * Coreografia, traduzida do tempo do vídeo para o scroll:
 * - **Abertura** — o horizonte de baixo nasce depois do loader (altura 10% →
 *   100% em 1,4 s, power3.out: o "Cotação de compra" do vídeo) e apaga
 *   conforme o hero sai de cena, com scrub.
 * - **Seções** — cada seletor de `scenes` vira um cenário enquanto ocupa a
 *   faixa de leitura (55% da viewport); as manchas deslizam para os cantos
 *   dele em 2 s, como na troca de legenda.
 * - **Fecho** — um segundo horizonte cresce atrás do rodapé até passar da
 *   altura cheia quando a página acaba (o "embora." do vídeo, 75% → 130%).
 *
 * Dois horizontes em vez de um: entrada, saída e fecho são triggers
 * independentes, e animar o mesmo elemento por três lados faria um
 * sobrescrever o outro no meio do caminho.
 *
 * A camada é `-z-10`: precisa de um pai com `isolate` (o wrapper da página)
 * para ficar sobre o fundo dele e sob o conteúdo — e de seções sem fundo
 * próprio no caminho.
 */
export function StageGlow({
	scenes,
	heroSelector = '#hero',
	endSelector = '#footer'
}: {
	scenes: readonly (readonly [selector: string, scene: StageScene])[]
	heroSelector?: string
	endSelector?: string
}) {
	const rootRef = useRef<HTMLDivElement>(null)
	const ready = usePageReady()
	const [scene, setScene] = useState<StageScene>('hero')

	useEffect(() => {
		const root = rootRef.current
		if (!root || !ready) return
		const reduce = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches
		const ctx = gsap.context(() => {
			for (const [selector, value] of scenes) {
				const trigger = document.querySelector(selector)
				if (!trigger) continue
				ScrollTrigger.create({
					trigger,
					start: 'top 55%',
					end: 'bottom 55%',
					onToggle: (self) => {
						if (self.isActive) setScene(value)
					}
				})
			}

			const hero = document.querySelector(heroSelector)
			if (reduce) gsap.set('[data-horizon-rise]', { autoAlpha: 1 })
			else
				gsap.fromTo(
					'[data-horizon-rise]',
					{ autoAlpha: 0, scaleY: 0.1 },
					{
						autoAlpha: 1,
						scaleY: 1,
						duration: 1.4,
						ease: 'power3.out',
						delay: 0.15
					}
				)
			if (hero)
				gsap.to('[data-horizon-hero]', {
					autoAlpha: 0,
					scaleY: 0.3,
					ease: 'power2.in',
					scrollTrigger: {
						trigger: hero,
						start: 'top top',
						end: 'bottom 35%',
						scrub: 0.5
					}
				})

			const end = document.querySelector(endSelector)
			if (end)
				gsap.fromTo(
					'[data-horizon-end]',
					{ autoAlpha: 0, scaleY: 0.1 },
					{
						autoAlpha: 1,
						scaleY: 1.3,
						ease: 'power2.out',
						scrollTrigger: {
							trigger: end,
							start: 'top 70%',
							end: 'bottom bottom',
							scrub: 0.6
						}
					}
				)
		}, root)
		return () => ctx.revert()
	}, [ready, scenes, heroSelector, endSelector])

	return (
		<div
			ref={rootRef}
			aria-hidden
			data-scene={scene}
			className="stage-glow pointer-events-none fixed inset-0 -z-10 overflow-hidden"
		>
			<div className="stage-blob stage-blob-a">
				<div />
			</div>
			<div className="stage-blob stage-blob-b">
				<div />
			</div>
			{/* Horizontes: 99% da largura e 48% da altura da tela (o
			   1900 × 520 do vídeo), colados na borda de baixo. Camada de
			   fora = scroll, do meio = entrada, de dentro = desenho +
			   respiração (CSS). */}
			<div
				data-horizon-hero
				className="absolute inset-x-[0.5%] bottom-0 h-[48vh] origin-bottom"
			>
				<div
					data-horizon-rise
					className="invisible size-full origin-bottom"
				>
					<div className="stage-horizon size-full" />
				</div>
			</div>
			<div
				data-horizon-end
				className="invisible absolute inset-x-[0.5%] bottom-0 h-[48vh] origin-bottom"
			>
				<div className="stage-horizon size-full" />
			</div>
		</div>
	)
}
