'use client'

import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Reveal } from '@/components/landing/reveal'
import { useCopy } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'
import { usePageReady } from '@/lib/page-ready'

gsap.registerPlugin(Draggable, InertiaPlugin)

/**
 * Social proof — moldura técnica (mesmo vocabulário da seção de partners)
 * com um LEQUE DE CARDS arrastável, engenharia reversa da seção "Made with
 * Osmo" do osmo.supply: os relatos formam um carrossel circular em arco
 * (slots simétricos de translate/rotate/scale, z-index discreto). O drag
 * escrubba a rotação do leque inteiro — 1 largura de deck ≈ 1 card — e o
 * release faz snap ao slot mais próximo com inércia (Draggable +
 * InertiaPlugin). O card do fundo cruza POR TRÁS do leque no seam (lerp
 * direto entre os slots extremos), sem teleporte. Barra de progresso
 * auto-avança (pausa no hover, fora da viewport e durante o drag), setas
 * manuais e contador. Conteúdo placeholder até termos depoimentos reais.
 */
type Testimonial = {
	quote: string
	name: string
	role: string
	company: string
}

const HOLD_MS = 8000

const COPY = {
	pt: {
		heading: 'O que os times dizem',
		eyebrow: '(prova social)',
		dragHint: '( arraste os cards )',
		prevTestimonial: 'Relato anterior',
		nextTestimonial: 'Próximo relato',
		metrics: [
			{ value: '-70%', label: 'tempo por análise de proposta' },
			{ value: '3×', label: 'mais cotações comparadas por dia' },
			{ value: '100%', label: 'das decisões com trilha rastreável' }
		],
		testimonials: [
			{
				quote: 'A gente saiu de planilhas espalhadas em três times para um lugar só. O que antes levava uma tarde de conferência hoje resolve em minutos, com histórico de tudo.',
				name: 'Nome Sobrenome',
				role: 'Gerente de operações',
				company: 'Monfiza'
			},
			{
				quote: 'O que mais me convenceu foi a IA responder com os nossos números, não com texto genérico. Quando ela aponta um preço fora da curva, dá para clicar e ver a origem.',
				name: 'Nome Sobrenome',
				role: 'Diretor comercial',
				company: 'Aventis'
			},
			{
				quote: 'Implantação sem drama: conectaram no que já usávamos — e-mail, Excel — e o time adotou porque parou de fazer trabalho repetido, não porque alguém mandou.',
				name: 'Nome Sobrenome',
				role: 'Head de crédito',
				company: 'Empresa'
			},
			{
				quote: 'O comparativo do BID chega pronto: respostas interpretadas, frete e prazo normalizados e a vencedora sugerida item a item. A reunião de compras virou meia hora.',
				name: 'Nome Sobrenome',
				role: 'Gerente de compras',
				company: 'Importadora'
			},
			{
				quote: 'Laudo não vence mais em silêncio: o radar cobra o fornecedor antes e o arquivo chega carimbado na pasta certa. Auditoria virou rotina, não mutirão.',
				name: 'Nome Sobrenome',
				role: 'Coordenadora de qualidade',
				company: 'Distribuidora'
			}
		] as Testimonial[]
	},
	en: {
		heading: 'What teams say',
		eyebrow: '(social proof)',
		dragHint: '( drag the cards )',
		prevTestimonial: 'Previous testimonial',
		nextTestimonial: 'Next testimonial',
		metrics: [
			{ value: '-70%', label: 'time per proposal analysis' },
			{ value: '3×', label: 'more quotes compared per day' },
			{ value: '100%', label: 'of decisions with a traceable trail' }
		],
		testimonials: [
			{
				quote: 'We went from spreadsheets scattered across three teams to a single place. What used to take an afternoon of cross-checking now resolves in minutes, with a history of everything.',
				name: 'Full Name',
				role: 'Operations manager',
				company: 'Monfiza'
			},
			{
				quote: 'What convinced me most was the AI answering with our numbers, not generic text. When it flags a price off the curve, you can click and see where it came from.',
				name: 'Full Name',
				role: 'Sales director',
				company: 'Aventis'
			},
			{
				quote: 'Rollout without drama: they plugged into what we already used — e-mail, Excel — and the team adopted it because the repeated work stopped, not because someone ordered it.',
				name: 'Full Name',
				role: 'Head of credit',
				company: 'Company'
			},
			{
				quote: 'The BID comparison arrives ready: replies parsed, freight and terms normalized, and the winner suggested item by item. The purchasing meeting became half an hour.',
				name: 'Full Name',
				role: 'Purchasing manager',
				company: 'Importer'
			},
			{
				quote: 'Certificates no longer expire in silence: the radar chases the supplier early and the file lands stamped in the right folder. Audits became routine, not a scramble.',
				name: 'Full Name',
				role: 'Quality coordinator',
				company: 'Distributor'
			}
		] as Testimonial[]
	}
} satisfies Localized<unknown>

const TOTAL = COPY.pt.testimonials.length

/* Slots do leque (medidos no osmo.supply): índice 0 = frente, 1 = vizinho,
   2 = ponta. x/y em % do próprio card, rotação em graus. */
const MAX_SLOT = 2
const SLOT_X = [0, 25, 45]
const SLOT_Y = [0, 5, 7]
const SLOT_R = [0, 5, 10]
const SLOT_S = [1, 0.9, 0.75]
const SLOT_Z = [5, 4, 3]

/* Posição assinada do card i em relação à frente, em [-TOTAL/2, TOTAL/2).
   O intervalo aberto é o seam: é ali que o card do fundo troca de lado. */
const wrapPos = (v: number) =>
	((((v + TOTAL / 2) % TOTAL) + TOTAL) % TOTAL) - TOTAL / 2

/* Parâmetros de um slot INTEIRO k (com wrap circular: k=3 ≡ k=-2). */
const slotOf = (k: number) => {
	const w = wrapPos(k)
	const m = Math.abs(w)
	const sign = w < 0 ? -1 : 1
	return {
		x: sign * SLOT_X[m],
		y: SLOT_Y[m],
		r: sign * SLOT_R[m],
		s: SLOT_S[m]
	}
}

/* Posiciona o leque inteiro para uma "cabeça" contínua (fração = card em
   trânsito entre slots; no seam o lerp cruza direto de +ponta a -ponta,
   fazendo o card do fundo deslizar por trás do leque, como no osmo). */
function renderDeck(cards: (HTMLElement | null)[], head: number) {
	cards.forEach((card, i) => {
		if (!card) return
		const pos = wrapPos(i - head)
		const k0 = Math.floor(pos)
		const f = pos - k0
		const a = slotOf(k0)
		const b = slotOf(k0 + 1)
		const lerp = (u: number, v: number) => u + (v - u) * f
		gsap.set(card, {
			xPercent: lerp(a.x, b.x),
			yPercent: lerp(a.y, b.y),
			rotation: lerp(a.r, b.r),
			scale: lerp(a.s, b.s),
			zIndex: SLOT_Z[Math.min(Math.abs(Math.round(pos)), MAX_SLOT)]
		})
	})
}

export function TestimonialsSection() {
	const t = useCopy(COPY)
	const [index, setIndex] = useState(0)
	const rootRef = useRef<HTMLDivElement>(null)
	const deckRef = useRef<HTMLDivElement>(null)
	const cardRefs = useRef<(HTMLElement | null)[]>([])
	const barRef = useRef<HTMLDivElement>(null)
	const headRef = useRef({ v: 0 })
	const tweenRef = useRef<gsap.core.Tween | null>(null)
	const spinTweenRef = useRef<gsap.core.Tween | null>(null)
	const spinRef = useRef<((direction: number) => void) | null>(null)
	const hoveredRef = useRef(false)
	const offscreenRef = useRef(false)
	const transitioningRef = useRef(false)
	const ready = usePageReady()

	const go = useCallback((direction: number) => {
		if (transitioningRef.current) return
		spinRef.current?.(direction)
	}, [])

	/* Leque + drag (Draggable com proxy fora do DOM, padrão GSAP): o x do
	   proxy escrubba a cabeça do leque — 1 largura de deck = 1 slot — e o
	   snap da inércia projeta o release para o slot inteiro mais próximo. */
	useEffect(() => {
		const deck = deckRef.current
		if (!deck || !ready) return
		const reduce = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches
		const cards = cardRefs.current
		renderDeck(cards, headRef.current.v)

		const slotPx = () => Math.max(deck.offsetWidth, 480)
		let startX = 0
		let startHead = 0

		const settle = () => {
			transitioningRef.current = false
			const next =
				((Math.round(headRef.current.v) % TOTAL) + TOTAL) % TOTAL
			setIndex((prev) => {
				if (prev === next) {
					// Mesmo card da frente: o efeito da barra não re-roda,
					// então ela re-arma aqui.
					if (!hoveredRef.current && !offscreenRef.current)
						tweenRef.current?.restart()
					return prev
				}
				return next
			})
		}

		const spin = (direction: number) => {
			transitioningRef.current = true
			spinTweenRef.current?.kill()
			drag.tween?.kill()
			spinTweenRef.current = gsap.to(headRef.current, {
				v: Math.round(headRef.current.v) + direction,
				duration: reduce ? 0 : 0.9,
				ease: 'power3.inOut',
				onUpdate: () => renderDeck(cards, headRef.current.v),
				onComplete: settle
			})
		}
		spinRef.current = spin

		const proxy = document.createElement('div')
		const [drag] = Draggable.create(proxy, {
			trigger: deck,
			type: 'x',
			inertia: true,
			maxDuration: 1,
			cursor: 'grab',
			activeCursor: 'grabbing',
			allowNativeTouchScrolling: true,
			onPress() {
				transitioningRef.current = true
				spinTweenRef.current?.kill()
				tweenRef.current?.pause()
				startX = this.x
				startHead = headRef.current.v
			},
			onDrag() {
				headRef.current.v = startHead - (this.x - startX) / slotPx()
				renderDeck(cards, headRef.current.v)
			},
			snap: {
				x: (value: number) => {
					const target = Math.round(
						startHead - (value - startX) / slotPx()
					)
					return startX + (startHead - target) * slotPx()
				}
			},
			onThrowUpdate() {
				headRef.current.v = startHead - (this.x - startX) / slotPx()
				renderDeck(cards, headRef.current.v)
			},
			// Com inertia + snap o release SEMPRE vira um tween de
			// acomodação (mesmo parado), então o settle é garantido aqui.
			onThrowComplete: settle
		})

		return () => {
			drag.kill()
			spinTweenRef.current?.kill()
			spinRef.current = null
			const staged = cards.filter((card): card is HTMLElement =>
				Boolean(card)
			)
			if (staged.length) gsap.set(staged, { clearProps: 'all' })
		}
	}, [ready])

	useEffect(() => {
		const bar = barRef.current
		// O autoplay não pode consumir relatos enquanto a página carrega.
		if (!bar || !ready) return
		const tween = gsap.fromTo(
			bar,
			{ width: '0%' },
			{
				width: '100%',
				duration: HOLD_MS / 1000,
				ease: 'none',
				onComplete: () => spinRef.current?.(1)
			}
		)
		if (hoveredRef.current || offscreenRef.current) tween.pause()
		tweenRef.current = tween
		return () => {
			tween.kill()
			tweenRef.current = null
		}
	}, [index, ready])

	/* Fora da viewport o autoplay pausa — senão a seção consome relatos e
	   gira o leque sem ninguém vendo. */
	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const io = new IntersectionObserver((entries) => {
			const visible = entries.some((entry) => entry.isIntersecting)
			offscreenRef.current = !visible
			if (!visible) tweenRef.current?.pause()
			else if (!hoveredRef.current) tweenRef.current?.play()
		})
		io.observe(root)
		return () => io.disconnect()
	}, [])

	const counter = `${String(index + 1).padStart(2, '0')}/${String(TOTAL).padStart(2, '0')}`

	return (
		<section id="testimonials" className="px-7 py-24 md:py-36">
			<div className="w-full">
				<Reveal>
					<div className="border-border border">
						<div className="border-border flex flex-wrap items-baseline justify-between gap-2 border-b px-5 py-4">
							<h2 className="text-body-lg font-medium uppercase">
								{t.heading}
							</h2>
							<span className="text-foreground/40 font-mono text-[10px] tracking-[0.2em] uppercase">
								{t.eyebrow}
							</span>
						</div>

						{/* Faixa de métricas — números placeholder. */}
						<div className="bg-border border-border grid grid-cols-1 gap-px border-b md:grid-cols-3">
							{t.metrics.map((metric) => (
								<div
									key={metric.value}
									className="bg-background flex flex-col gap-1 px-5 py-6"
								>
									<span className="font-heading text-h3">
										{metric.value}
									</span>
									<span className="text-body-sm text-foreground/60">
										{metric.label}
									</span>
								</div>
							))}
						</div>

						{/* Leque de relatos arrastável — barra auto-avança
						   (pausa no hover, fora da viewport e no drag),
						   setas manuais, contador. */}
						<div
							ref={rootRef}
							className="bg-background"
							onMouseEnter={() => {
								hoveredRef.current = true
								tweenRef.current?.pause()
							}}
							onMouseLeave={() => {
								hoveredRef.current = false
								tweenRef.current?.play()
							}}
						>
							<div className="px-5 pt-7 md:px-7 md:pt-9">
								{/* Barra de progresso — fio em tom escuro único. */}
								<div className="bg-foreground/15 relative h-px w-full">
									<div
										ref={barRef}
										aria-hidden
										className="bg-foreground absolute top-0 left-0 h-px"
										style={{ width: '0%' }}
									/>
								</div>

								<div className="mt-5 flex items-center justify-between gap-4">
									<div className="flex items-center gap-5">
										<button
											aria-label={t.prevTestimonial}
											onClick={() => go(-1)}
											className="text-foreground/60 hover:text-foreground transition-colors"
										>
											<ArrowLeft className="size-5" />
										</button>
										<button
											aria-label={t.nextTestimonial}
											onClick={() => go(1)}
											className="text-foreground/60 hover:text-foreground transition-colors"
										>
											<ArrowRight className="size-5" />
										</button>
									</div>
									<span className="text-foreground/40 font-mono text-[10px] tracking-[0.2em] uppercase">
										{t.dragHint}
									</span>
									<span className="text-muted-foreground font-mono text-sm">
										{counter}
									</span>
								</div>
							</div>

							{/* O deck: cards absolutos centrados; quem os
							   espalha nos slots é o renderDeck. overflow
							   escondido — as pontas do leque cortam na
							   moldura, não criam scroll horizontal. */}
							<div className="relative overflow-hidden pt-10 pb-12">
								<div
									ref={deckRef}
									className="relative mx-auto h-[23rem] w-full max-w-5xl cursor-grab touch-pan-y select-none"
								>
									{t.testimonials.map((item, i) => (
										<article
											key={`${item.company}-${i}`}
											ref={(el) => {
												cardRefs.current[i] = el
											}}
											className="bg-card absolute inset-0 m-auto flex h-[21rem] w-[min(32rem,84vw)] flex-col justify-between gap-4 rounded-xl border p-6 shadow-xl will-change-transform md:p-7"
										>
											<div className="flex flex-col gap-4">
												<span className="text-foreground/40 font-mono text-[10px] tracking-[0.2em] uppercase">
													{`REL_${String(i + 1).padStart(2, '0')}`}
												</span>
												<blockquote className="text-body-sm md:text-body text-foreground/80 text-pretty">
													“{item.quote}”
												</blockquote>
											</div>
											<footer className="flex flex-col gap-0.5">
												<span className="text-body-sm font-medium">
													{item.name}
												</span>
												<span className="text-foreground/60 font-mono text-xs tracking-wide uppercase">
													{item.role} · {item.company}
												</span>
											</footer>
										</article>
									))}
								</div>
							</div>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	)
}
