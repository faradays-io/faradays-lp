'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

import { AsciiFieldGl } from '@/components/landing/ascii-field-gl'
import { FeatureGraphic } from '@/components/landing/feature-graphic'
import { HOME_FEATURES } from '@/components/landing/home-features-data'
import type { MonfizaAppDemoHandle } from '@/components/landing/monfiza-app-demo'
import { MonfizaAppDemo } from '@/components/landing/monfiza-app-demo'
import { useLang } from '@/components/language-provider'
import { usePageReady } from '@/lib/page-ready'

gsap.registerPlugin(ScrollTrigger)

/**
 * Continuação do hero + primeira subseção de features em um fluxo só.
 *
 * O fundo ASCII (WebGL) é invisível em repouso: o mouse acende um rastro
 * que revela o campo escondido e esfria sozinho. Ele vive numa camada
 * sticky atrás da seção inteira, com o padrão ancorado ao documento.
 * A demo — o app Monfiza em miniatura (sidebar + header + 4 telas), uma
 * instância única noutra camada sticky que cobre a seção no desktop —
 * trava no centro da viewport.
 *
 * Coreografia (desktop, tudo por gatilho — nada de scrub):
 * 1. Em repouso a demo está um pouco mais larga (--demo-w 1.15) e mais
 *    alta que a posição pinada. O primeiro scroll down toca a diagonal
 *    até a metade direita — e, junto, a largura volta a 1 e o lift some —
 *    em sincronia com a saída do CTA no HomeHero.
 * 2. O texto 1 sobe pela esquerda e SEGURA no centro (container de 300svh
 *    com conteúdo sticky). No início do hold um cursor animado clica no
 *    PDF da conversa e o card de preview surge logo em seguida (mesma
 *    timeline — independe do scroll); o scroll extra dispara a saída do
 *    texto 1 com o mesmo efeito do CTA (encolhe, desfoca, sobe) enquanto,
 *    em sincronia, a travessia direita → esquerda roda inteira.
 * 3. Os textos 2–4 sobem pela direita com a demo parada à esquerda, cada
 *    um no mesmo hold do bloco 1 (300svh com conteúdo sticky; texto sai
 *    em +1.3vh, card em +1.65vh) — a "trava" que impede atravessar as
 *    features numa tacada só. Quando cada bloco cruza o gatilho, uma
 *    "tour" roda na demo: o cursor viaja até o item da sidebar, clica, a
 *    tela troca e a micro-interação da feature acontece (Gerar PDF →
 *    card; marcar vencedora → fechar cotação → toast + card; cobrar
 *    documento vencido → badge muda + card). O card-eco (câmbio congelado
 *    / melhor oferta / alerta de vencimento) faz parte da tour: surge logo
 *    depois do clique, nunca por posição de scroll. Dentro do hold o texto
 *    sai com o efeito do CTA e o card segura sozinho até o fim. O card de
 *    PDF segue exclusivo do hold do bloco 1. No fim da seção o sticky
 *    solta sozinho.
 *
 * Os alvos do cursor são medidos por getBoundingClientRect relativos ao
 * [data-demo-box] (valores function-based + invalidate no refresh), então
 * o transform da travessia e o compensador de pin não descalibram nada.
 *
 * No mobile a camada da demo cobre só o painel ASCII (rola junto), o hold
 * e as tours não existem e cada bloco mostra o seu FeatureGraphic.
 */
export function HeroFeatureFlow() {
	const { lang } = useLang()
	const rootRef = useRef<HTMLElement>(null)
	const demoRef = useRef<MonfizaAppDemoHandle>(null)
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
	   (autoAlpha/y) e estes efeitos animam [data-demo-stage] e filhos —
	   elementos separados, os tweens nunca disputam o transform.

	   Todos os movimentos são por GATILHO (toggles de ScrollTrigger que
	   tocam timelines completas), nunca scrub: a posição do scroll decide
	   QUANDO cada estágio dispara, não o progresso da animação. */
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
			const q = (sel: string) => root.querySelector<HTMLElement>(sel)
			const box = q('[data-demo-box]')
			const copy1 = q('[data-feature1-copy]')
			const cursor = q('[data-demo-cursor]')
			const ring = q('[data-demo-cursor-ring]')
			const card = q('[data-demo-card]')
			const reduce = window.matchMedia(
				'(prefers-reduced-motion: reduce)'
			).matches
			// +/- 25vw centraliza a demo em cada metade da viewport.
			const shift = () => window.innerWidth / 4
			const vh = () => window.innerHeight
			// Lift de repouso: na dobra a demo fica ~5svh acima do centro
			// da sua camada (mais perto do CTA); some conforme a diagonal
			// avança, então a posição pinada continua a de sempre.
			const lift = () => Math.round(vh() * 0.05)

			// Compensador de pin: aplica o y da diagonal a cada frame,
			// misturado com o lift de repouso pelo mesmo progresso.
			const proxy = { p: 0 }
			let lastY = 0
			const applyY = () => {
				const top = Math.max(0, root.getBoundingClientRect().top)
				const y = -proxy.p * top - (1 - proxy.p) * lift()
				if (y !== lastY) {
					lastY = y
					gsap.set(stage, { y })
				}
			}
			gsap.ticker.add(applyY)

			// Diagonal centro → direita/cima, disparada no gatilho. No mesmo
			// movimento a demo volta à largura pinada (--demo-w 1.15 → 1;
			// a fórmula da largura vive no CSS do box).
			const out = gsap
				.timeline({ paused: true })
				.to(stage, { x: shift, duration: 1.1, ease: 'power3.inOut' }, 0)
				.to(proxy, { p: 1, duration: 1.1, ease: 'power3.inOut' }, 0)
			if (box) {
				out.to(
					box,
					{ '--demo-w': 1, duration: 1.1, ease: 'power3.inOut' },
					0
				)
			}

			/* Alvo do cursor: ponto do [data-poi] medido na hora (function-
			   based), em coordenadas relativas ao [data-demo-box] — ambos os
			   rects carregam o transform do stage, então a conta é imune à
			   travessia e ao compensador. */
			const poi =
				(name: string, ax = 0.5, ay = 0.5) =>
				() => {
					const el = box?.querySelector<HTMLElement>(
						`[data-poi="${name}"]`
					)
					if (!box || !el) return { x: 0, y: 0 }
					const b = box.getBoundingClientRect()
					const r = el.getBoundingClientRect()
					return {
						x: r.left - b.left + r.width * ax,
						y: r.top - b.top + r.height * ay
					}
				}

			// Clique do cursor: squash na ponta da seta + anel de ripple.
			const addClick = (
				tl: gsap.core.Timeline,
				position?: gsap.Position
			) => {
				if (!cursor || !ring) return
				tl.to(
					cursor,
					{
						scale: 0.82,
						duration: 0.12,
						ease: 'power2.in',
						transformOrigin: '15% 10%'
					},
					position
				)
					.to(cursor, {
						scale: 1,
						duration: 0.3,
						ease: 'back.out(3)'
					})
					.fromTo(
						ring,
						{ autoAlpha: 0.6, scale: 0 },
						{
							autoAlpha: 0,
							scale: 2.6,
							duration: 0.5,
							ease: 'power1.out',
							immediateRender: false
						},
						'<'
					)
			}

			const travel = (
				tl: gsap.core.Timeline,
				target: () => { x: number; y: number },
				duration: number,
				position?: gsap.Position
			) => {
				if (!cursor) return
				tl.to(
					cursor,
					{
						x: () => target().x,
						y: () => target().y,
						duration,
						ease: 'power3.inOut'
					},
					position
				)
			}

			/* Pop de um card fora do frame (preview do PDF ou card-eco):
			   entrada pelo elemento externo — a saída é sempre pelo wrapper
			   de fade, propriedade separada, então toggles revertidos num
			   salto único nunca disputam o mesmo autoAlpha. */
			const addPop = (
				tl: gsap.core.Timeline,
				el: HTMLElement | null,
				rotate: number,
				position?: gsap.Position
			) => {
				if (!el) return
				tl.fromTo(
					el,
					{ autoAlpha: 0, y: 28, scale: 0.9, rotate: -rotate / 2 },
					{
						autoAlpha: 1,
						y: 0,
						scale: 1,
						rotate,
						duration: 0.6,
						ease: 'back.out(1.6)',
						immediateRender: false
					},
					position
				)
			}

			/* Estágio 1 do hold: o cursor entra de baixo, desliza até o PDF
			   na conversa, "clica" (pulso + anel) e o card de preview surge
			   ao lado da demo — na mesma timeline, logo depois do clique,
			   sem depender de quanto o usuário rolou. */
			const cursorTl = gsap.timeline({ paused: true })
			if (cursor && ring && box) {
				const pdf = poi('chat-pdf', 0.55, 0.6)
				cursorTl.fromTo(
					cursor,
					{
						x: () => pdf().x - 150,
						y: () => pdf().y + 120,
						autoAlpha: 0
					},
					{
						x: () => pdf().x,
						y: () => pdf().y,
						autoAlpha: 1,
						duration: 1.2,
						ease: 'power3.out',
						immediateRender: false
					}
				)
				addClick(cursorTl)
				addPop(cursorTl, card, -4, '+=0.15')
			}

			/* Estágio 2: o texto 1 sai com o efeito do CTA e, JUNTO com ele
			   (mesma timeline, ambos na posição 0), a demo atravessa para a
			   esquerda — a animação roda inteira, sem seguir o scroll. */
			const exitTl = gsap.timeline({ paused: true })
			if (copy1) {
				exitTl.to(
					copy1,
					{
						autoAlpha: 0,
						scale: 0.92,
						y: -64,
						filter: 'blur(14px)',
						duration: 0.9,
						ease: 'power3.out'
					},
					0
				)
			}
			exitTl.to(
				stage,
				{
					x: () => -shift(),
					duration: 1.1,
					ease: 'power3.inOut'
				},
				0
			)
			/* Cursor e card eram adereços do hold: somem junto com a
			   travessia (e voltam no reverse). O card sai pelo wrapper de
			   fade — o pop (cardTl) fica dono do autoAlpha do card em si,
			   e toggles revertidos num salto único nunca disputam a mesma
			   propriedade. */
			const cardFade = q('[data-demo-card-fade]')
			const props = [cursor, cardFade].filter((el): el is HTMLElement =>
				Boolean(el)
			)
			if (props.length) {
				exitTl.to(
					props,
					{ autoAlpha: 0, duration: 0.35, ease: 'power2.out' },
					'<'
				)
			}

			/* Tours das features 2–4: o cursor clica no item da sidebar, a
			   tela troca, a micro-interação roda e o card-eco da feature
			   surge fora do frame logo depois do clique — o card faz parte
			   da tour, não de um gatilho de scroll. Cada tour é HERMÉTICA —
			   começa e termina com o cursor invisível e overlays fechados
			   (o card fica; quem o apaga é o fadeTl do hold) — então
			   progress(0)/progress(1) são estados canônicos e a cadeia pode
			   ser forçada em qualquer ordem de scroll. */
			const screenIds = HOME_FEATURES.map((feature) => feature.id)
			const buildTour = (index: number) => {
				const tl = gsap.timeline({ paused: true })
				const id = screenIds[index]
				const prevId = screenIds[index - 1]
				const cur = q(`[data-screen="${id}"]`)
				const prev = q(`[data-screen="${prevId}"]`)
				const navCur = q(`[data-nav-active="${id}"]`)
				const navPrev = q(`[data-nav-active="${prevId}"]`)
				const crumbCur = q(`[data-crumb="${id}"]`)
				const crumbPrev = q(`[data-crumb="${prevId}"]`)
				const echo = q(`[data-feature-card="${id}"]`)
				if (!box || !cursor || !ring || !cur || !prev) return tl

				// 1 · o cursor entra e clica no item do menu.
				const nav = poi(`nav-${id}`)
				tl.fromTo(
					cursor,
					{
						x: () => nav().x - 90,
						y: () => nav().y + 120,
						autoAlpha: 0
					},
					{
						x: () => nav().x,
						y: () => nav().y,
						autoAlpha: 1,
						duration: 0.9,
						ease: 'power3.out',
						immediateRender: false
					},
					0
				)
				addClick(tl, 0.9)

				// 2 · nav ativa, breadcrumb e tela trocam juntos.
				const swap = 1.1
				if (navPrev) {
					tl.fromTo(
						navPrev,
						{ autoAlpha: 1 },
						{
							autoAlpha: 0,
							duration: 0.25,
							ease: 'power2.out',
							immediateRender: false
						},
						swap
					)
				}
				if (navCur) {
					tl.fromTo(
						navCur,
						{ autoAlpha: 0 },
						{
							autoAlpha: 1,
							duration: 0.25,
							ease: 'power2.out',
							immediateRender: false
						},
						swap
					)
				}
				if (crumbPrev) {
					tl.fromTo(
						crumbPrev,
						{ autoAlpha: 1 },
						{
							autoAlpha: 0,
							duration: 0.25,
							ease: 'power2.out',
							immediateRender: false
						},
						swap
					)
				}
				if (crumbCur) {
					tl.fromTo(
						crumbCur,
						{ autoAlpha: 0 },
						{
							autoAlpha: 1,
							duration: 0.25,
							ease: 'power2.out',
							immediateRender: false
						},
						swap
					)
				}
				tl.fromTo(
					prev,
					{ autoAlpha: 1 },
					{
						autoAlpha: 0,
						duration: 0.35,
						ease: 'power2.inOut',
						immediateRender: false
					},
					swap
				)
				tl.fromTo(
					cur,
					{ autoAlpha: 0, y: 10 },
					{
						autoAlpha: 1,
						y: 0,
						duration: 0.35,
						ease: 'power2.inOut',
						immediateRender: false
					},
					swap
				)

				// 3 · micro-interação da tela (+ card-eco logo após o clique).
				if (id === 'venda') {
					// Gerar PDF → o card do câmbio congelado responde direto,
					// sem dialog de confirmação nem toast.
					travel(tl, poi('venda-gerar'), 0.8, 1.8)
					addClick(tl, 2.6)
					addPop(tl, echo, 4, 3.0)
				} else if (id === 'rfq') {
					const checkOn = q('[data-check-on]')
					const toast = q('[data-overlay="rfq-toast"]')
					travel(tl, poi('rfq-check'), 0.8, 1.8)
					addClick(tl, 2.6)
					if (checkOn) {
						tl.fromTo(
							checkOn,
							{ autoAlpha: 0, scale: 0.5 },
							{
								autoAlpha: 1,
								scale: 1,
								duration: 0.3,
								ease: 'back.out(2)',
								immediateRender: false
							},
							3.0
						)
					}
					travel(tl, poi('rfq-fechar'), 0.7, 3.2)
					addClick(tl, 3.9)
					if (toast) {
						tl.fromTo(
							toast,
							{ autoAlpha: 0, y: 16 },
							{
								autoAlpha: 1,
								y: 0,
								duration: 0.4,
								ease: 'back.out(1.4)',
								immediateRender: false
							},
							4.35
						)
						tl.to(
							toast,
							{
								autoAlpha: 0,
								duration: 0.35,
								ease: 'power2.out'
							},
							5.8
						)
					}
					addPop(tl, echo, 4, 4.5)
				} else if (id === 'docs') {
					const before = q('[data-docs-badge-before]')
					const after = q('[data-docs-badge-after]')
					travel(tl, poi('docs-cobrar'), 0.8, 1.8)
					addClick(tl, 2.6)
					if (before && after) {
						tl.to(
							before,
							{
								autoAlpha: 0,
								duration: 0.3,
								ease: 'power2.out'
							},
							3.0
						)
						tl.fromTo(
							after,
							{ autoAlpha: 0, scale: 0.8 },
							{
								autoAlpha: 1,
								scale: 1,
								duration: 0.3,
								ease: 'back.out(2)',
								immediateRender: false
							},
							3.0
						)
					}
					addPop(tl, echo, 4, 3.3)
				}

				// 4 · o cursor sai de cena — a tour termina "limpa".
				tl.to(
					cursor,
					{ autoAlpha: 0, duration: 0.3, ease: 'power2.out' },
					'+=0.4'
				)
				return tl
			}
			const tours = blocks.slice(1).map((_, i) => buildTour(i + 1))

			/* Estágios dos holds 2–4: o card-eco já entrou pela tour; aqui
			   ficam só as saídas — o texto sai primeiro (mesmo ponto do
			   bloco 1) e o card segura sozinho até perto do fim, quando o
			   fade dele dispara. */
			const stages = blocks.slice(1).map((block, i) => {
				const id = screenIds[i + 1]
				const copyEl = block.querySelector<HTMLElement>(
					'[data-feature-copy]'
				)
				// Saída pelo wrapper de fade (a entrada, na tour, anima o
				// card externo) — mesma separação de propriedades do card
				// de PDF do bloco 1.
				const echoFade = q(
					`[data-feature-card="${id}"] [data-feature-card-fade]`
				)
				const byeTl = gsap.timeline({ paused: true })
				if (copyEl) {
					byeTl.to(
						copyEl,
						{
							autoAlpha: 0,
							scale: 0.92,
							y: -64,
							filter: 'blur(14px)',
							duration: 0.9,
							ease: 'power3.out'
						},
						0
					)
				}
				const fadeTl = gsap.timeline({ paused: true })
				if (echoFade) {
					fadeTl.to(
						echoFade,
						{ autoAlpha: 0, duration: 0.35, ease: 'power2.out' },
						0
					)
				}
				return { byeTl, fadeTl }
			})

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

			/* Gatilhos do hold, medidos no container de 300svh do bloco 1:
			   o sticky engaja em 'top top' (texto seguro no centro) e toca
			   cursor + clique + card de uma vez; a saída dispara conforme o
			   scroll avança dentro do hold. O primeiro também congela o
			   chat no quadro final — o PDF precisa estar em cena quando o
			   cursor clicar. */
			const holdTriggers = [
				ScrollTrigger.create({
					trigger: blocks[0],
					start: 'top top',
					onEnter: () => {
						demoRef.current?.holdChat(true)
						if (reduce) return
						if (initial) cursorTl.progress(1)
						else cursorTl.play()
					},
					onLeaveBack: () => {
						demoRef.current?.holdChat(false)
						if (!reduce) cursorTl.reverse()
					}
				}),
				ScrollTrigger.create({
					trigger: blocks[0],
					start: () => `top+=${vh() * 1.3} top`,
					onEnter: () => {
						if (initial || reduce) exitTl.progress(1)
						else exitTl.play()
					},
					onLeaveBack: () => {
						if (reduce) exitTl.progress(0)
						else exitTl.reverse()
					}
				})
			]

			/* Gatilhos das tours (blocos 2–4). O forcing colapsa as tours
			   anteriores no estado final e zera as posteriores — scroll
			   rápido em qualquer direção nunca deixa estado órfão. */
			const tourTriggers = blocks.slice(1).map((block, i) =>
				ScrollTrigger.create({
					trigger: block,
					start: 'top 55%',
					onEnter: () => {
						tours.slice(0, i).forEach((tour) => tour.progress(1))
						tours.slice(i + 1).forEach((tour) => tour.progress(0))
						if (initial || reduce) tours[i].progress(1)
						else tours[i].timeScale(1).play()
					},
					onLeaveBack: () => {
						tours.slice(i + 1).forEach((tour) => tour.progress(0))
						if (reduce) tours[i].progress(0)
						// Acelerado: rebobinar a tour inteira (~6s) na
						// velocidade normal seguraria a tela errada em cena
						// durante o scroll para cima.
						else tours[i].timeScale(2.5).reverse()
					}
				})
			)

			/* Gatilhos dos estágios dos holds 2–4: saída do texto em +1.3vh
			   (como no bloco 1) e fade do card só em +1.65vh — a trava
			   própria do card. */
			const stageTriggers = blocks.slice(1).flatMap((block, i) => [
				ScrollTrigger.create({
					trigger: block,
					start: () => `top+=${vh() * 1.3} top`,
					onEnter: () => {
						if (initial || reduce) stages[i].byeTl.progress(1)
						else stages[i].byeTl.play()
					},
					onLeaveBack: () => {
						if (reduce) stages[i].byeTl.progress(0)
						else stages[i].byeTl.reverse()
					}
				}),
				ScrollTrigger.create({
					trigger: block,
					start: () => `top+=${vh() * 1.65} top`,
					onEnter: () => {
						if (initial || reduce) stages[i].fadeTl.progress(1)
						else stages[i].fadeTl.play()
					},
					onLeaveBack: () => {
						if (reduce) stages[i].fadeTl.progress(0)
						else stages[i].fadeTl.reverse()
					}
				})
			])
			initial = false

			/* Traço do b.svg — ÚNICO efeito com scrub da seção: o
			   stroke-dashoffset segue o scroll de 1050 (nada desenhado) a 0
			   (completo), da travessia da demo para a esquerda (bloco 1,
			   +1.3vh) até o hold da última feature. pathLength="1000" no
			   path normaliza as unidades (mil passos: o CSSPlugin do GSAP
			   arredonda px para inteiro — autoRound — e com pathLength=1 o
			   traço pulava de 1 a 0); o gap 1100 > 1000 garante que o
			   próximo dash nunca entra; os 50 extras escondem o cap redondo
			   antes do início. */
			const stroke = q('[data-flow-stroke]')
			const strokeTween = stroke
				? reduce
					? gsap.set(stroke, { strokeDashoffset: 0 })
					: gsap.fromTo(
							stroke,
							{ strokeDashoffset: 1050 },
							{
								strokeDashoffset: 0,
								ease: 'none',
								autoRound: false,
								scrollTrigger: {
									trigger: blocks[0],
									start: () => `top+=${vh() * 1.3} top`,
									endTrigger: blocks[blocks.length - 1],
									end: () => `top+=${vh() * 0.5} top`,
									scrub: 0.8
								}
							}
						)
				: null

			// Resize/reflow: re-mede os alvos das timelines paradas.
			const timelines = [cursorTl, ...tours]
			const onRefresh = () => {
				timelines.forEach((tl) => {
					if (!tl.isActive()) tl.invalidate()
				})
			}
			ScrollTrigger.addEventListener('refresh', onRefresh)

			return () => {
				gsap.ticker.remove(applyY)
				ScrollTrigger.removeEventListener('refresh', onRefresh)
				strokeTween?.scrollTrigger?.kill()
				strokeTween?.kill()
				if (stroke) gsap.set(stroke, { clearProps: 'strokeDashoffset' })
				trigger.kill()
				holdTriggers.forEach((holdTrigger) => holdTrigger.kill())
				tourTriggers.forEach((tourTrigger) => tourTrigger.kill())
				stageTriggers.forEach((stageTrigger) => stageTrigger.kill())
				out.kill()
				cursorTl.kill()
				exitTl.kill()
				tours.forEach((tour) => tour.kill())
				stages.forEach((stage2) => {
					stage2.byeTl.kill()
					stage2.fadeTl.kill()
				})
				demoRef.current?.holdChat(false)
				gsap.set(stage, { clearProps: 'transform' })
				if (box) gsap.set(box, { clearProps: '--demo-w' })
				const staged = [copy1, cursor, ring, card].filter(
					(el): el is HTMLElement => Boolean(el)
				)
				if (staged.length) gsap.set(staged, { clearProps: 'all' })
				const layers = root.querySelectorAll<HTMLElement>(
					'[data-screen], [data-nav-active], [data-crumb], [data-overlay], [data-check-on], [data-docs-badge-before], [data-docs-badge-after], [data-feature-copy], [data-feature-card], [data-feature-card-fade], [data-demo-card-fade]'
				)
				if (layers.length) gsap.set(layers, { clearProps: 'all' })
			}
		})
		return () => mm.revert()
	}, [ready])

	const renderCopy = (feature: (typeof HOME_FEATURES)[number]) => (
		<>
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
		</>
	)

	return (
		<section ref={rootRef} className="bg-background relative">
			{/* Fundo ASCII interativo: sticky atrás da seção inteira,
			   invisível em repouso — só o rastro do mouse aparece, com fade
			   no topo e na base da viewport via mask. O padrão é ancorado
			   ao documento (uniform de offset no shader). */}
			<div className="pointer-events-none absolute inset-0 z-0">
				<div className="sticky top-0 h-svh">
					<div data-flow-intro className="h-full opacity-0">
						<AsciiFieldGl className="[mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]" />
					</div>
				</div>
			</div>

			{/* Traço decorativo (public/b.svg inline): camada sticky atrás
			   dos textos e da demo, centrada, um pouco maior que a viewport
			   (a cauda do path sai por baixo). Só desktop — é o flow que o
			   desenha com scrub. O layer clipa a própria svg, não é
			   ancestral do sticky da demo. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
			>
				<div className="sticky top-0 h-svh overflow-hidden">
					<svg
						viewBox="0 0 1660 3160"
						fill="none"
						className="text-foreground/10 absolute top-[-12svh] left-1/2 h-[124svh] w-auto -translate-x-1/2"
					>
						<path
							data-flow-stroke
							pathLength={1000}
							strokeDasharray="1000 1100"
							d="M1452.05 76.002C1452.05 76.002 571.55 120.044 571.55 826.886C571.55 1640.23 1683.54 1555.39 1576.66 2338.76C1488.31 2986.22 -224.502 3491.8 122.147 2338.76C468.796 1185.72 967.215 3938 967.215 3938"
							stroke="currentColor"
							strokeWidth={152}
							strokeLinecap="round"
						/>
					</svg>
				</div>
			</div>

			{/* Espaçador antes dos textos. No desktop é curto (50svh): o
			   texto 1 fica armado logo abaixo da dobra e desponta assim que
			   o gatilho dispara, sem viagem morta. No mobile mantém 1 tela —
			   é a área que a camada da demo (h-svh) cobre; encurtar faria o
			   card sobrepor o bloco 1. */}
			<div aria-hidden className="h-svh w-full lg:h-[50svh]" />

			{/* Textos das features: bloco 1 na coluna esquerda (com hold),
			   blocos 2-4 na direita — a demo sticky ocupa a metade oposta.
			   `relative` para pintarem acima do fundo ASCII. */}
			<div id="features" className="max-w-section relative mx-auto px-7">
				{/* Bloco 1 com hold: no desktop o container tem 300svh e o
				   conteúdo fica sticky centrado — o scroll extra alimenta os
				   estágios (cursor → card → saída do texto → travessia). No
				   mobile é um bloco normal. */}
				<div
					key={HOME_FEATURES[0].id}
					data-feature={0}
					className="lg:h-[300svh]"
				>
					<div className="grid grid-cols-1 gap-x-16 lg:sticky lg:top-0 lg:h-svh lg:grid-cols-2">
						<div
							data-feature1-copy
							className="flex min-h-svh flex-col items-center justify-center gap-6 py-24 text-left lg:min-h-0"
						>
							{renderCopy(HOME_FEATURES[0])}
						</div>
					</div>
				</div>

				{/* Blocos 2-4 com o MESMO hold do bloco 1 (300svh com
				   conteúdo sticky) — a "trava" impede atravessar as features
				   numa tacada só. O scroll extra alimenta dois estágios por
				   bloco (card-eco → saída do texto), nos mesmos pontos do
				   bloco 1. No mobile são blocos normais. */}
				{HOME_FEATURES.slice(1).map((feature, i) => (
					<div
						key={feature.id}
						data-feature={i + 1}
						className="lg:h-[300svh]"
					>
						<div className="grid grid-cols-1 gap-x-16 lg:sticky lg:top-0 lg:h-svh lg:grid-cols-2">
							<div
								data-feature-copy
								className="flex min-h-svh flex-col items-center justify-center gap-6 py-24 text-left lg:col-start-2 lg:min-h-0"
							>
								{renderCopy(feature)}
							</div>
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
							<MonfizaAppDemo ref={demoRef} />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
