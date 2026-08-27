'use client'

import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { useCallback, useEffect, useRef } from 'react'

import { FibonacciSpiral } from '@/components/landing/fibonacci-spiral'
import { Reveal } from '@/components/landing/reveal'
import { useCopy } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'
import { usePageReady } from '@/lib/page-ready'

gsap.registerPlugin(Draggable)

/**
 * Social proof — título centralizado e o leque de cards, sem moldura e sem
 * barra de autoplay (o componente da barra espera em `drafts/`).
 *
 * Engenharia reversa do "made with Osmo" (osmo.supply, `initFlickCards`):
 *  - 7 cards em arco, slots simétricos medidos do original (SLOTS abaixo);
 *    o próprio script deles exige o mínimo de 7 (5 visíveis + 2 escondidos
 *    esperando a vez atrás das pontas).
 *  - o card da frente fica limpo e com outline azul; todos os outros levam
 *    o mesmo tratamento — véu escuro a 0.40 e conteúdo a 0.60.
 *  - o drag NÃO troca o card da frente: o gesto interpola os cards entre o
 *    arranjo atual e o próximo (fator = |x| / largura, com bounds de meia
 *    largura, então o preview chega no máximo à metade do caminho) e o
 *    status/véu/z-index ficam parados. Quem decide é o release: passou de
 *    10% da largura, avança/volta um; senão acomoda de volta.
 *  - a acomodação usa `elastic.out(1.2, 1)` em 0.6s, o overshoot que dá o
 *    "flick" do original.
 */
type Testimonial = {
	quote: string
	name: string
	role: string
	company: string
}

const COPY = {
	pt: {
		heading: 'Usado por times que levam velocidade e rigor a sério',
		deckLabel:
			'Relatos de clientes — arraste os cards ou use as setas do teclado',
		testimonials: [
			{
				quote: 'A gente saiu de planilhas espalhadas em três times para um lugar só. O que antes levava uma tarde de conferência hoje resolve em minutos.',
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
				quote: 'Implantação sem drama: conectaram no que já usávamos — e-mail, Excel — e o time adotou porque parou de fazer trabalho repetido.',
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
			},
			{
				quote: 'Meu time responde no WhatsApp e o pedido já entra no sistema com o histórico do cliente. Ninguém mais digita duas vezes a mesma coisa.',
				name: 'Nome Sobrenome',
				role: 'Supervisor de vendas',
				company: 'Atacadista'
			},
			{
				quote: 'Fecho o mês olhando um painel, não catorze arquivos. A margem por pedido aparece no dia em que ela acontece — não trinta dias depois.',
				name: 'Nome Sobrenome',
				role: 'Controller',
				company: 'Indústria'
			}
		] as Testimonial[]
	},
	en: {
		heading: 'Trusted by teams that care about speed and rigor',
		deckLabel: 'Customer stories — drag the cards or use the arrow keys',
		testimonials: [
			{
				quote: 'We went from spreadsheets scattered across three teams to a single place. What used to take an afternoon of cross-checking now resolves in minutes.',
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
				quote: 'Rollout without drama: they plugged into what we already used — e-mail, Excel — and the team adopted it because the repeated work stopped.',
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
			},
			{
				quote: 'My team replies on WhatsApp and the order lands in the system with the customer history attached. Nobody types the same thing twice anymore.',
				name: 'Full Name',
				role: 'Sales supervisor',
				company: 'Wholesaler'
			},
			{
				quote: 'I close the month looking at one dashboard, not fourteen files. Margin per order shows up the day it happens — not thirty days later.',
				name: 'Full Name',
				role: 'Controller',
				company: 'Manufacturer'
			}
		] as Testimonial[]
	}
} satisfies Localized<unknown>

const TOTAL = COPY.pt.testimonials.length

/* Slots do leque, medidos no osmo.supply (índice = distância até a frente).
   x/y em % do próprio card, rotação em graus. O slot 3 é o esconderijo:
   opacidade 0, esperando a vez atrás da ponta. */
const SLOTS = [
	{ x: 0, y: 0, r: 0, s: 1, o: 1, z: 5, status: 'active' },
	{ x: 25, y: 5, r: 5, s: 0.9, o: 1, z: 4, status: 'near' },
	{ x: 45, y: 7, r: 10, s: 0.75, o: 1, z: 3, status: 'far' },
	{ x: 55, y: 5, r: 15, s: 0.6, o: 0, z: 2, status: 'hidden' }
] as const

const LAST_SLOT = SLOTS.length - 1

/* Slot do card i quando a frente é `head`, com o lado mais curto do
   círculo (o card do fundo cruza por trás, não dá a volta pela frente). */
function slotOf(i: number, head: number) {
	let d = i - head
	if (d > TOTAL / 2) d -= TOTAL
	else if (d < -TOTAL / 2) d += TOTAL
	const slot = SLOTS[Math.min(Math.abs(d), LAST_SLOT)]
	const sign = d < 0 ? -1 : 1
	return {
		xPercent: sign * slot.x,
		yPercent: slot.y,
		rotation: sign * slot.r,
		scale: slot.s,
		opacity: slot.o,
		z: slot.z,
		status: slot.status
	}
}

/* Avatar de quem falou — monograma enquanto os relatos são placeholder;
   troca por <img> quando tivermos as fotos. */
function Avatar({ name }: { name: string }) {
	const initials = name
		.split(' ')
		.map((part) => part.charAt(0))
		.slice(0, 2)
		.join('')
		.toUpperCase()
	return (
		<span
			aria-hidden
			className="bg-muted text-foreground/70 border-border flex size-12 shrink-0 items-center justify-center rounded-full border font-mono text-xs tracking-widest"
		>
			{initials}
		</span>
	)
}

export function TestimonialsSection() {
	const t = useCopy(COPY)
	const wrapRef = useRef<HTMLDivElement>(null)
	const draggerRef = useRef<HTMLDivElement>(null)
	const cardRefs = useRef<(HTMLElement | null)[]>([])
	const headRef = useRef(0)
	const goRef = useRef<((direction: number) => void) | null>(null)
	const ready = usePageReady()

	const go = useCallback((direction: number) => {
		goRef.current?.(direction)
	}, [])

	useEffect(() => {
		const wrap = wrapRef.current
		const dragger = draggerRef.current
		if (!wrap || !dragger || !ready) return
		const reduce = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches
		const cards = cardRefs.current
		let width = wrap.offsetWidth

		/* Acomoda o leque nos slots inteiros de `head` — é aqui (e só aqui)
		   que status, véu e z-index trocam de card. */
		const settle = (instant = false) => {
			cards.forEach((card, i) => {
				if (!card) return
				const slot = slotOf(i, headRef.current)
				card.dataset.status = slot.status
				card.style.zIndex = String(slot.z)
				gsap.to(card, {
					xPercent: slot.xPercent,
					yPercent: slot.yPercent,
					rotation: slot.rotation,
					scale: slot.scale,
					opacity: slot.opacity,
					duration: instant || reduce ? 0 : 0.6,
					ease: 'elastic.out(1.2, 1)',
					overwrite: 'auto'
				})
			})
		}

		settle(true)

		goRef.current = (direction: number) => {
			headRef.current = (headRef.current + direction + TOTAL) % TOTAL
			settle()
		}

		const [drag] = Draggable.create(dragger, {
			type: 'x',
			edgeResistance: 0.8,
			bounds: { minX: -width / 2, maxX: width / 2 },
			inertia: false,
			allowNativeTouchScrolling: true,
			onDrag() {
				/* Preview do gesto: cada card caminha do arranjo atual para o
				   do vizinho na direção arrastada. O status não muda — o card
				   da frente segue em destaque até o release. */
				const ratio = this.x / width
				const f = Math.min(1, Math.abs(ratio))
				const next =
					(headRef.current + (ratio > 0 ? -1 : 1) + TOTAL) % TOTAL
				cards.forEach((card, i) => {
					if (!card) return
					const a = slotOf(i, headRef.current)
					const b = slotOf(i, next)
					const lerp = (u: number, v: number) => u + (v - u) * f
					gsap.set(card, {
						xPercent: lerp(a.xPercent, b.xPercent),
						yPercent: lerp(a.yPercent, b.yPercent),
						rotation: lerp(a.rotation, b.rotation),
						scale: lerp(a.scale, b.scale),
						opacity: lerp(a.opacity, b.opacity)
					})
				})
			},
			onRelease() {
				const ratio = this.x / width
				// Limiar do osmo: 10% da largura decide se o leque anda.
				if (ratio > 0.1)
					headRef.current = (headRef.current - 1 + TOTAL) % TOTAL
				else if (ratio < -0.1)
					headRef.current = (headRef.current + 1) % TOTAL
				settle()
				gsap.to(this.target, {
					x: 0,
					duration: reduce ? 0 : 0.3,
					ease: 'power1.out'
				})
			}
		})

		const onResize = () => {
			width = wrap.offsetWidth
			drag.applyBounds({ minX: -width / 2, maxX: width / 2 })
		}
		window.addEventListener('resize', onResize)

		return () => {
			window.removeEventListener('resize', onResize)
			drag.kill()
			goRef.current = null
			const staged = cards.filter((card): card is HTMLElement =>
				Boolean(card)
			)
			if (staged.length) gsap.set(staged, { clearProps: 'all' })
		}
	}, [ready])

	return (
		<section
			id="testimonials"
			/* Painel escuro (o mesmo #0f0f0e do véu dos cards): o deck de
			   cards claros vira o único ponto de luz da seção. Ocupa uma tela
			   cheia (no mínimo 68rem, o mesmo painel do FAQ de preços), com o
			   conteúdo centrado — em viewport baixa a seção passa do mínimo e
			   cresce com o conteúdo, sem comprimir o deck. */
			className="relative flex min-h-[max(100svh,68rem)] flex-col justify-center overflow-hidden bg-[#0f0f0e] px-7 py-32 md:py-44"
		>
			{/* Textura de fundo — a mesma do FAQ de preços: 12 voltas, traço
			   muito largo e quase na cor do fundo, com o olho tapado
			   (`capEye`, ver o comentário no componente). Entra inteira: a
			   caixa ocupa 88% da largura (bbox 233×144, proporção áurea →
			   ~78% da altura) e é centrada por translate (-1/2, -1/2); o svg
			   é `overflow-visible` para o traço grosso não ser cortado reto
			   nas bordas do viewBox. A discrição vem de `opacity` no svg, não
			   do alfa da cor: espiral e disco se sobrepõem e, com alfa na
			   cor, a sobreposição somaria e apareceria mais clara. */}
			<FibonacciSpiral
				terms={12}
				strokeWidth={120}
				capEye
				className="absolute top-1/2 left-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 -scale-x-100 -scale-y-100 overflow-visible text-white opacity-[0.025]"
			/>

			<Reveal className="relative mb-12 text-center md:mb-16">
				{/* O clamp mantém uma linha só de ~560px para cima; abaixo
				   disso a copy quebra em duas, com balance. */}
				<h2 className="font-heading text-background mx-auto text-[clamp(1.2rem,3.8vw,4rem)] leading-[1.15] tracking-tight text-balance">
					{t.heading}
				</h2>
			</Reveal>

			<Reveal className="relative">
				{/* O deck: cards absolutos centrados, espalhados nos slots
				   pelo settle/onDrag. O dragger é a camada invisível que o
				   Draggable move — o x dele é o único input do gesto. */}
				<div
					ref={wrapRef}
					className="relative mx-auto h-[26rem] w-full max-w-[64rem] md:h-[30rem]"
				>
					{t.testimonials.map((item, i) => (
						<article
							key={`${item.company}-${i}`}
							ref={(el) => {
								cardRefs.current[i] = el
							}}
							data-status="hidden"
							className="group bg-card border-border absolute inset-0 m-auto flex h-[23rem] w-[min(42rem,86vw)] flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-lg will-change-transform select-none data-[status=active]:shadow-2xl md:h-[27rem] md:p-12"
						>
							{/* Conteúdo: a opacidade vive aqui, não no card —
							   se a plate ficasse translúcida o texto dos
							   cards de trás vazaria. */}
							<div className="flex flex-col items-center gap-8 opacity-60 transition-opacity duration-500 group-data-[status=active]:opacity-100 md:gap-10">
								{/* Aspa gigante de fundo (Aspekta, a sans ativa),
							   centrada na citação. -z-10 fica acima do
							   `bg-card` e abaixo do texto — o card já é um
							   contexto de empilhamento por causa do
							   will-change. O -translate-y compensa a tinta
							   da aspa morar no topo da caixa da linha: o que
							   fica centrado é o glifo, não o box. */}
								<div className="relative flex items-center justify-center">
									<span
										aria-hidden
										className="text-foreground/[0.07] pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-[34%] font-sans text-[14rem] leading-none font-semibold select-none md:text-[20rem]"
									>
										&ldquo;
									</span>
									<blockquote className="text-body-lg md:text-h4 lg:text-h3 font-serif leading-[1.4] font-semibold text-pretty md:leading-[1.35]">
										{item.quote}
									</blockquote>
								</div>
								<footer className="flex items-center justify-center gap-3">
									<Avatar name={item.name} />
									<div className="flex flex-col text-left">
										<span className="text-body font-medium">
											{item.name}
										</span>
										<span className="text-foreground/60 font-mono text-xs tracking-wide uppercase">
											{item.role} · {item.company}
										</span>
									</div>
								</footer>
							</div>
							{/* Véu: some no card da frente e escurece todo o
							   resto por igual. */}
							<div
								aria-hidden
								className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[#0f0f0e] opacity-40 transition-opacity duration-500 group-data-[status=active]:opacity-0"
							/>
							{/* Outline azul — só no card em destaque. */}
							<div
								aria-hidden
								className="border-brand pointer-events-none absolute inset-0 rounded-[inherit] border-2 opacity-0 transition-opacity duration-500 group-data-[status=active]:opacity-100"
							/>
						</article>
					))}

					<div
						ref={draggerRef}
						role="group"
						tabIndex={0}
						aria-label={t.deckLabel}
						onKeyDown={(event) => {
							if (event.key === 'ArrowLeft') go(-1)
							else if (event.key === 'ArrowRight') go(1)
							else return
							event.preventDefault()
						}}
						className="absolute inset-0 z-10 cursor-grab touch-pan-y select-none active:cursor-grabbing"
					/>
				</div>
			</Reveal>
		</section>
	)
}
