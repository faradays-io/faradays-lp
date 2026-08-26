'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type RefObject, useEffect } from 'react'

import { usePageReady } from '@/lib/page-ready'

gsap.registerPlugin(ScrollTrigger)

/**
 * O recuo — saída padrão dos blocos de copy da landing: encolhe, desfoca,
 * some e sobe, como se recuasse para trás da tela. Nasceu na saída do CTA do
 * hero e virou o gesto da casa (o HeroFeatureFlow chama de "o efeito do
 * CTA").
 *
 * Fonte única do hero e do CTA final. O HeroFeatureFlow ainda carrega os
 * mesmos vars inline, dentro de timelines que coreografam vários elementos
 * na posição 0 — se forem migrar para cá, é lá que precisa reteste.
 */
export const RECEDE_OUT: gsap.TweenVars = {
	autoAlpha: 0,
	scale: 0.92,
	y: -64,
	filter: 'blur(14px)',
	duration: 0.9,
	ease: 'power3.out'
}

/**
 * Toca o recuo inteiro num gatilho de scroll — não é scrub: cruzou o ponto,
 * a animação roda até o fim sem esperar o bloco cruzar o topo da viewport.
 * Voltar reverte.
 *
 * `start`/`end` seguem o ScrollTrigger: sem `triggerRef` são posições
 * absolutas de scroll (o hero usa `start: 8` — o primeiro scroll dispara);
 * com `triggerRef` são relativas ao elemento.
 *
 * `back` dá à volta um ponto próprio, medido em outro elemento — útil quando
 * o bloco deve voltar a partir da posição da seção que o contém, e não da
 * dele mesmo.
 *
 * Recarga com a página já rolada pula direto ao estado final, em vez de
 * animar à vista de quem chegou depois.
 */
export function useRecedeOut(
	targetRef: RefObject<HTMLElement | null>,
	{
		start,
		end = 'max',
		triggerRef,
		back
	}: {
		start: string | number
		end?: string | number
		triggerRef?: RefObject<HTMLElement | null>
		back?: { ref: RefObject<HTMLElement | null>; start: string | number }
	}
) {
	const ready = usePageReady()
	const backRef = back?.ref
	const backStart = back?.start

	useEffect(() => {
		const el = targetRef.current
		if (!el || !ready) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
			return

		const out = gsap.timeline({ paused: true }).to(el, RECEDE_OUT)

		let initial = true
		const trigger = ScrollTrigger.create({
			trigger: triggerRef?.current ?? undefined,
			start,
			end,
			onEnter: () => {
				if (initial) out.progress(1)
				else out.play()
			},
			onLeaveBack: () => out.reverse()
		})
		initial = false

		/* Ponto de volta próprio. As duas pontas fecham a máquina de estados:
		   descer por qualquer um dos dois pontos toca o recuo, subir por
		   qualquer um reverte — inclusive descer de novo no meio do caminho,
		   que sem isso deixava o bloco visível fora de hora. Repetir
		   play/reverse no mesmo sentido é no-op. */
		const backEl = backRef?.current
		const backTrigger =
			backEl && backStart != null
				? ScrollTrigger.create({
						trigger: backEl,
						start: backStart,
						onEnter: () => out.play(),
						onLeaveBack: () => out.reverse()
					})
				: null

		return () => {
			backTrigger?.kill()
			trigger.kill()
			out.kill()
			gsap.set(el, { clearProps: 'all' })
		}
	}, [ready, start, end, targetRef, triggerRef, backRef, backStart])
}
