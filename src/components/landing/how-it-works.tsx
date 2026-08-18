'use client'

import {
	ArrowLeft,
	ArrowRight,
	Database,
	EnvelopeSimple,
	FileText,
	type Icon,
	PuzzlePiece,
	Table,
	UsersThree,
	WhatsappLogo
} from '@phosphor-icons/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
	AtendimentoDemo,
	CotacoesDemo,
	DocumentosDemo,
	VendaDemo
} from '@/components/landing/feature-demos'
import { AsciiField } from '@/components/landing/hero-demo'
import { HOME_FEATURES } from '@/components/landing/home-features-data'
import { SECTION_TITLE } from '@/components/landing/type'
import { useCopy, useLang } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

gsap.registerPlugin(SplitText)

const COPY = {
	pt: {
		eyebrow: '01 · How it works',
		heading: 'Connect Your Systems. Command Your Outcomes.',
		sub: 'Cada sistema da sua operação vira entrada de um motor único — que conecta, aprende e devolve a decisão pronta, feature a feature.',
		prevFeature: 'Feature anterior',
		nextFeature: 'Próxima feature'
	},
	en: {
		eyebrow: '01 · How it works',
		heading: 'Connect Your Systems. Command Your Outcomes.',
		sub: 'Every system in your operation becomes an input to a single engine — one that connects, learns and returns decisions ready to use, feature by feature.',
		prevFeature: 'Previous feature',
		nextFeature: 'Next feature'
	}
} satisfies Localized<Record<string, string>>

/* ------------------------------------------------------------------ *
 * Grafo de sistemas (referências: docs/image copy 11.png + o grafo do
 * /credito): nós DOM quadrados (ícone + label) sobre um canvas que desenha
 * as arestas convergindo para a peça de quebra-cabeça central; a saída
 * desce para o showcase logo abaixo. Física de mola, arraste e hover
 * herdados do PolicyGraph — sem parallax, em fundo claro.
 * ------------------------------------------------------------------ */

const INK = '#1b1a15'
const BRAND = '#0065e0'

const INPUT_S = 84
const CORE_S = 96
/* Quanto os controles da curva se afastam das pontas, em fração da distância
   vertical nó→núcleo. Perto de 0.5 o "S" fica bem pronunciado (saída e
   chegada quase verticais); perto de 0 vira reta. */
const ROOT_BOW = 0.55
/* Raio das bolinhas que percorrem as arestas. */
const PULSE_R = 3.5

type NodeDef = {
	id: string
	label: Localized<string>
	desc: string
	x: number
	y: number
	IconCmp: Icon
	core?: boolean
	delay: number
}

const NODES: NodeDef[] = [
	{
		id: 'erp',
		label: { pt: 'ERP', en: 'ERP' },
		desc: 'Pedidos, faturamento e crédito — a fonte da verdade da operação.',
		x: 0.08,
		y: 0.16,
		IconCmp: Database,
		delay: 0
	},
	{
		id: 'crm',
		label: { pt: 'CRM', en: 'CRM' },
		desc: 'Clientes e representantes com histórico unificado.',
		x: 0.245,
		y: 0.16,
		IconCmp: UsersThree,
		delay: 0.1
	},
	{
		id: 'email',
		label: { pt: 'E-mail', en: 'Email' },
		desc: 'RFQs disparadas e respostas capturadas automaticamente.',
		x: 0.41,
		y: 0.16,
		IconCmp: EnvelopeSimple,
		delay: 0.2
	},
	{
		id: 'whatsapp',
		label: { pt: 'WhatsApp', en: 'WhatsApp' },
		desc: 'O canal onde as cotações chegam e os preços circulam.',
		x: 0.575,
		y: 0.16,
		IconCmp: WhatsappLogo,
		delay: 0.3
	},
	{
		id: 'docs',
		label: { pt: 'Docs', en: 'Docs' },
		desc: 'Laudos, certificados e COA com validade viva.',
		x: 0.74,
		y: 0.16,
		IconCmp: FileText,
		delay: 0.4
	},
	{
		id: 'planilhas',
		label: { pt: 'Planilhas', en: 'Spreadsheets' },
		desc: 'As tabelas que hoje seguram o processo — absorvidas.',
		x: 0.9,
		y: 0.16,
		IconCmp: Table,
		delay: 0.5
	},
	{
		id: 'core',
		label: { pt: 'Faradays', en: 'Faradays' },
		desc: 'O motor que conecta tudo e devolve a decisão pronta.',
		x: 0.5,
		y: 0.62,
		IconCmp: PuzzlePiece,
		core: true,
		delay: 0.9
	}
]

const CORE_INDEX = NODES.findIndex((n) => n.core)

const easeOutBack = (v: number) => {
	const c1 = 1.70158
	const c3 = c1 + 1
	return 1 + c3 * Math.pow(v - 1, 3) + c1 * Math.pow(v - 1, 2)
}
const easeInOutCubic = (v: number) =>
	v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/* Cúbica: dois controles, um em cada ponta, é o que permite sair e chegar
   na vertical com a barriga horizontal no meio — o "S" da raiz. */
const bezier = (
	u: number,
	x0: number,
	y0: number,
	c1x: number,
	c1y: number,
	c2x: number,
	c2y: number,
	x1: number,
	y1: number
) => {
	const k = 1 - u
	const a = k * k * k
	const b = 3 * k * k * u
	const c = 3 * k * u * u
	const d = u * u * u
	return {
		x: a * x0 + b * c1x + c * c2x + d * x1,
		y: a * y0 + b * c1y + c * c2y + d * y1
	}
}

function SystemsGraph({ className }: { className?: string }) {
	const { lang } = useLang()
	const rootRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const ready = usePageReady()

	useEffect(() => {
		const root = rootRef.current
		const canvas = canvasRef.current
		if (!root || !canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const els: HTMLElement[] = []
		root.querySelectorAll<HTMLElement>('[data-node]').forEach((el) => {
			els[Number(el.dataset.node)] = el
		})

		const nodes = NODES.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }))
		let dragging = -1
		let hovered = -1
		const pointer = { x: 0, y: 0 }

		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		let width = 0
		let height = 0

		const resize = () => {
			width = canvas.clientWidth
			height = canvas.clientHeight
			canvas.width = Math.round(width * dpr)
			canvas.height = Math.round(height * dpr)
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
			NODES.forEach((def, i) => {
				nodes[i].x = def.x * width
				nodes[i].y = def.y * height
				nodes[i].vx = 0
				nodes[i].vy = 0
			})
		}

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		/* Relógio de entrada começa quando o grafo aparece na tela. */
		let visibleAt = reducedMotion ? -Infinity : NaN
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					if (Number.isNaN(visibleAt)) visibleAt = performance.now()
					io.disconnect()
				}
			},
			{ threshold: 0.35 }
		)
		io.observe(root)

		const draw = (now: number) => {
			ctx.clearRect(0, 0, width, height)
			const t = Number.isNaN(visibleAt) ? 0 : (now - visibleAt) / 1000
			const wave = now / 1000

			/* Física: nó arrastado segue o ponteiro; os demais voltam por
			   mola a uma posição que flutua de leve. */
			NODES.forEach((def, i) => {
				const node = nodes[i]
				if (i === dragging) {
					node.x += (pointer.x - node.x) * 0.5
					node.y += (pointer.y - node.y) * 0.5
					node.vx = 0
					node.vy = 0
					return
				}
				const hx =
					def.x * width +
					(reducedMotion ? 0 : Math.sin(wave * 0.6 + i * 1.7) * 3)
				const hy =
					def.y * height +
					(reducedMotion ? 0 : Math.cos(wave * 0.5 + i * 2.3) * 3)
				node.vx = (node.vx + (hx - node.x) * 0.025) * 0.88
				node.vy = (node.vy + (hy - node.y) * 0.025) * 0.88
				node.x += node.vx
				node.y += node.vy
			})

			const activeIdx = hovered >= 0 ? hovered : dragging
			const core = nodes[CORE_INDEX]

			/* Arestas: cada nó de entrada → núcleo, em "S" + pulsos. */
			NODES.forEach((def, i) => {
				if (def.core) return
				const progress = easeInOutCubic(
					clamp01((t - (0.6 + def.delay)) / 0.7)
				)
				if (progress <= 0) return
				const a = nodes[i]
				const ax = a.x
				const ay = a.y + INPUT_S / 2
				const bx = core.x
				const by = core.y - CORE_S / 2
				/* Um controle logo abaixo do nó e outro logo acima do núcleo,
				   ambos no eixo vertical das pontas: a curva sai íngreme, deita
				   no meio e volta a mergulhar na chegada — o "S" que faz as
				   linhas parecerem raízes descendo para o mesmo ponto. */
				const span = by - ay
				const c1x = ax
				const c1y = ay + span * ROOT_BOW
				const c2x = bx
				const c2y = by - span * ROOT_BOW

				const touched =
					activeIdx < 0 || i === activeIdx || activeIdx === CORE_INDEX
				const emphasis = touched ? 1 : 0.25

				ctx.strokeStyle = INK
				ctx.globalAlpha = 0.28 * progress * emphasis
				ctx.beginPath()
				ctx.moveTo(ax, ay)
				const steps = 32
				for (let s = 1; s <= steps * progress; s++) {
					const p = bezier(
						s / steps,
						ax,
						ay,
						c1x,
						c1y,
						c2x,
						c2y,
						bx,
						by
					)
					ctx.lineTo(p.x, p.y)
				}
				ctx.stroke()

				if (progress >= 1 && !reducedMotion) {
					const u = (wave * 0.16 + i * 0.31) % 1
					const p = bezier(u, ax, ay, c1x, c1y, c2x, c2y, bx, by)
					ctx.globalAlpha = 0.8 * emphasis
					ctx.fillStyle = BRAND
					ctx.beginPath()
					ctx.arc(p.x, p.y, PULSE_R, 0, Math.PI * 2)
					ctx.fill()
				}
				ctx.globalAlpha = 1
			})

			/* Saída: núcleo → base do painel (liga ao showcase abaixo). */
			const outProgress = easeInOutCubic(clamp01((t - 1.7) / 0.6))
			if (outProgress > 0) {
				const from = core.y + CORE_S / 2
				ctx.strokeStyle = BRAND
				ctx.globalAlpha = 0.5 * outProgress
				ctx.setLineDash([3, 6])
				ctx.beginPath()
				ctx.moveTo(core.x, from)
				ctx.lineTo(core.x, from + (height - from) * outProgress)
				ctx.stroke()
				ctx.setLineDash([])
				if (outProgress >= 1 && !reducedMotion) {
					const u = (wave * 0.4) % 1
					ctx.globalAlpha = 0.9
					ctx.fillStyle = BRAND
					ctx.beginPath()
					ctx.arc(
						core.x,
						from + (height - from) * u,
						PULSE_R,
						0,
						Math.PI * 2
					)
					ctx.fill()
				}
				ctx.globalAlpha = 1
			}

			/* Nós DOM: posição, entrada com overshoot e ênfase de hover. */
			NODES.forEach((def, i) => {
				const el = els[i]
				if (!el) return
				const node = nodes[i]
				const appear = clamp01((t - def.delay) / 0.5)
				const scale = appear <= 0 ? 0 : easeOutBack(appear)
				const size = def.core ? CORE_S : INPUT_S
				const emphasis =
					activeIdx < 0 || i === activeIdx || def.core ? 1 : 0.35
				el.style.opacity = String(appear * emphasis)
				el.style.transform = `translate(${node.x - size / 2}px, ${node.y - size / 2}px) scale(${scale})`
			})
		}

		const toLocal = (e: PointerEvent) => {
			const rect = root.getBoundingClientRect()
			return { x: e.clientX - rect.left, y: e.clientY - rect.top }
		}

		const onRootPointerMove = (e: PointerEvent) => {
			const p = toLocal(e)
			pointer.x = p.x
			pointer.y = p.y
		}

		const cleanups: Array<() => void> = []
		els.forEach((el, i) => {
			const onDown = (e: PointerEvent) => {
				dragging = i
				const p = toLocal(e)
				pointer.x = p.x
				pointer.y = p.y
				el.setPointerCapture(e.pointerId)
				el.style.cursor = 'grabbing'
				e.preventDefault()
			}
			const onUp = (e: PointerEvent) => {
				if (dragging === i) {
					el.releasePointerCapture(e.pointerId)
					el.style.cursor = 'grab'
					dragging = -1
				}
			}
			const onEnter = () => {
				hovered = i
			}
			const onLeave = () => {
				hovered = -1
			}
			el.addEventListener('pointerdown', onDown)
			el.addEventListener('pointerup', onUp)
			el.addEventListener('pointercancel', onUp)
			el.addEventListener('pointerenter', onEnter)
			el.addEventListener('pointerleave', onLeave)
			cleanups.push(() => {
				el.removeEventListener('pointerdown', onDown)
				el.removeEventListener('pointerup', onUp)
				el.removeEventListener('pointercancel', onUp)
				el.removeEventListener('pointerenter', onEnter)
				el.removeEventListener('pointerleave', onLeave)
			})
		})
		root.addEventListener('pointermove', onRootPointerMove)

		let raf = 0
		let running = false
		const loop = (now: number) => {
			if (!running) return
			draw(now)
			raf = requestAnimationFrame(loop)
		}
		const start = () => {
			if (running || !ready) return
			running = true
			raf = requestAnimationFrame(loop)
		}
		const stop = () => {
			running = false
			cancelAnimationFrame(raf)
		}

		// O loop (física + pintura a 60fps) só roda com o grafo em tela.
		const visibility = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) start()
				else stop()
			},
			{ rootMargin: '100px' }
		)
		visibility.observe(root)

		const ro = new ResizeObserver(resize)
		ro.observe(canvas)
		resize()
		// Frame estático de partida (pré-loader ou fora da viewport).
		draw(performance.now())

		return () => {
			stop()
			visibility.disconnect()
			ro.disconnect()
			io.disconnect()
			root.removeEventListener('pointermove', onRootPointerMove)
			cleanups.forEach((fn) => fn())
		}
	}, [ready])

	return (
		<div ref={rootRef} className={cn('relative h-full w-full', className)}>
			<canvas
				ref={canvasRef}
				aria-hidden
				className="pointer-events-none absolute inset-0 block h-full w-full"
			/>
			{NODES.map((def, i) =>
				def.core ? (
					<div
						key={def.id}
						data-node={i}
						className="bg-brand text-brand-foreground absolute top-0 left-0 flex size-24 cursor-grab touch-none flex-col items-center justify-center gap-1 rounded-2xl opacity-0 will-change-transform"
					>
						<def.IconCmp weight="fill" className="size-8" />
						<span className="font-mono text-[10px] tracking-wide uppercase opacity-80">
							{def.label[lang]}
						</span>
					</div>
				) : (
					<div
						key={def.id}
						data-node={i}
						className="bg-background border-foreground/30 absolute top-0 left-0 flex size-21 cursor-grab touch-none flex-col items-center justify-center gap-1.5 rounded-xl border-4 opacity-0 will-change-transform"
					>
						<def.IconCmp
							weight="fill"
							className="text-foreground/80 size-5"
						/>
						<span className="text-foreground/60 font-mono text-[10px] tracking-wide uppercase">
							{def.label[lang]}
						</span>
					</div>
				)
			)}
		</div>
	)
}

/* ------------------------------------------------------------------ *
 * Showcase com barra de progresso (padrão do CreditShowcase do /credito):
 * auto-avança entre as features, setas manuais, texto com entrada por
 * linhas e a demo interativa correspondente ao lado.
 * ------------------------------------------------------------------ */

const HOLD_MS = 8000

/* Ordem espelha HOME_FEATURES: WhatsApp · venda · RFQ de compra · docs. */
const DEMOS = [AtendimentoDemo, VendaDemo, CotacoesDemo, DocumentosDemo]

function FeatureShowcase() {
	const { lang } = useLang()
	const t = COPY[lang]
	const [index, setIndex] = useState(0)
	const rootRef = useRef<HTMLDivElement>(null)
	const textRef = useRef<HTMLDivElement>(null)
	const barRef = useRef<HTMLDivElement>(null)
	const tweenRef = useRef<gsap.core.Tween | null>(null)
	const hoveredRef = useRef(false)
	const offscreenRef = useRef(false)
	const transitioningRef = useRef(false)
	const ready = usePageReady()

	const go = useCallback((direction: number) => {
		if (transitioningRef.current) return
		const advance = () =>
			setIndex(
				(i) =>
					(i + direction + HOME_FEATURES.length) %
					HOME_FEATURES.length
			)
		const bar = barRef.current
		if (!bar) {
			advance()
			return
		}
		transitioningRef.current = true
		gsap.to(bar, {
			width: '100%',
			duration: 0.25,
			ease: 'power1.in',
			onComplete: () => {
				transitioningRef.current = false
				advance()
			}
		})
	}, [])

	useEffect(() => {
		const bar = barRef.current
		// O autoplay não pode consumir slides enquanto a página carrega.
		if (!bar || !ready) return
		const tween = gsap.fromTo(
			bar,
			{ width: '0%' },
			{
				width: '100%',
				duration: HOLD_MS / 1000,
				ease: 'none',
				onComplete: () => go(1)
			}
		)
		if (hoveredRef.current || offscreenRef.current) tween.pause()
		tweenRef.current = tween
		return () => {
			tween.kill()
			tweenRef.current = null
		}
	}, [index, go, ready])

	/* Fora da viewport o autoplay pausa — senão o showcase consome slides e
	   re-splita texto sem ninguém vendo. */
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

	/* `lang` nas deps: a troca de idioma re-renderiza o texto, então o
	   SplitText precisa re-splitar sobre o conteúdo novo. */
	useEffect(() => {
		const text = textRef.current
		if (!text || !ready) return
		const split = new SplitText(text, { type: 'lines', mask: 'lines' })
		const lines = gsap.from(split.lines, {
			yPercent: 110,
			duration: 0.8,
			ease: 'power3.out',
			stagger: 0.09
		})
		return () => {
			lines.kill()
			split.revert()
		}
	}, [index, lang, ready])

	const feature = HOME_FEATURES[index]
	const Demo = DEMOS[index]
	const counter = `${String(index + 1).padStart(2, '0')}/${String(HOME_FEATURES.length).padStart(2, '0')}`

	return (
		<div
			ref={rootRef}
			className="flex w-full flex-col items-start gap-10 lg:flex-row lg:gap-14"
		>
			<div className="flex w-full flex-col lg:max-w-xl lg:shrink-0">
				{/* Barra de progresso — fio em tom escuro único. */}
				<div className="bg-foreground/15 relative h-px w-full max-w-xl">
					<div
						ref={barRef}
						aria-hidden
						className="bg-foreground absolute top-0 left-0 h-px"
						style={{ width: '0%' }}
					/>
				</div>

				<div className="mt-5 flex max-w-xl items-center justify-between">
					<div className="flex items-center gap-5">
						<button
							aria-label={t.prevFeature}
							onClick={() => go(-1)}
							className="text-foreground/60 hover:text-foreground transition-colors"
						>
							<ArrowLeft className="size-5" />
						</button>
						<button
							aria-label={t.nextFeature}
							onClick={() => go(1)}
							className="text-foreground/60 hover:text-foreground transition-colors"
						>
							<ArrowRight className="size-5" />
						</button>
					</div>
					<span className="text-muted-foreground font-mono text-sm">
						{counter}
					</span>
				</div>

				{/* key por index+idioma: o SplitText desliga estes nós do React
			   (revert restaura clones), então trocar feature ou idioma só
			   aparece se o bloco remontar com DOM novo antes do re-split. */}
				<div
					key={`${index}-${lang}`}
					ref={textRef}
					className="mt-10 flex flex-col gap-5"
				>
					<span className="text-foreground/50 font-mono text-sm tracking-wide uppercase">
						({feature.eyebrow[lang]})
					</span>
					<h4 className="font-heading text-h3 max-w-xl">
						{feature.title[lang]}
					</h4>
					<p className="text-body-lg text-foreground/70 max-w-xl">
						{feature.description[lang]}
					</p>
				</div>
			</div>

			<div
				className="w-full flex-1"
				onMouseEnter={() => {
					hoveredRef.current = true
					tweenRef.current?.pause()
				}}
				onMouseLeave={() => {
					hoveredRef.current = false
					tweenRef.current?.play()
				}}
			>
				{/* Palco da demo: branco com grid pontilhado. */}
				<div className="bg-card h-[30rem] w-full overflow-hidden rounded-2xl border bg-[radial-gradient(circle,rgba(27,26,21,0.05)_1px,transparent_1px)] bg-[size:28px_28px] md:h-[34rem]">
					<Demo />
				</div>
			</div>
		</div>
	)
}

export function HowItWorks() {
	const t = useCopy(COPY)
	return (
		<div className="px-7 py-32">
			<div className="max-w-section mx-auto">
				<div className="flex flex-col items-center gap-6 text-center">
					<span className="text-foreground/50 font-mono text-base tracking-widest uppercase">
						{t.eyebrow}
					</span>
					<h3 className={cn(SECTION_TITLE, 'max-w-5xl')}>
						{t.heading}
					</h3>
					<p className="text-body-lg text-foreground/70 max-w-2xl text-balance">
						{t.sub}
					</p>
				</div>

				<div className="mt-16 h-[26rem] w-full md:h-[30rem]">
					<SystemsGraph />
				</div>

				{/* Container do showcase: light blue com textura ASCII (igual
				   ao painel de demo do hero), colado no grafo — a linha de
				   saída do núcleo termina exatamente na borda superior. */}
				<div className="relative overflow-hidden rounded-3xl border border-[#b3d2ff] bg-[#e0edff] p-6 md:p-12">
					<AsciiField className="absolute inset-0" />
					<div className="relative z-10">
						<FeatureShowcase />
					</div>
				</div>
			</div>
		</div>
	)
}
