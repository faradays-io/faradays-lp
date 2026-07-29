'use client'

import { useEffect, useRef, useState } from 'react'

import { Reveal } from '@/components/landing/reveal'
import { cn } from '@/lib/utils'

const BONE = '#f4f4f4'
const BRAND = '#3b8eff'
const PANEL = '#0f0f0e'

type LabelPos = 'left' | 'right' | 'top' | 'bottom'

type NodeDef = {
	id: string
	label: string
	desc: string
	/* Home position as fractions of the panel. */
	x: number
	y: number
	r: number
	labelPos: LabelPos
	brand?: boolean
	/* Entrance delay in seconds — sources first, interventions last. */
	delay: number
}

const NODES: NodeDef[] = [
	{
		id: 'biro',
		label: 'Birô',
		desc: 'Cadastro e transações — o ponto de partida, não o teto.',
		x: 0.09,
		y: 0.12,
		r: 5,
		labelPos: 'right',
		delay: 0
	},
	{
		id: 'recebiveis',
		label: 'Recebíveis',
		desc: 'Fluxo real de receita de quem não tem histórico formal.',
		x: 0.11,
		y: 0.31,
		r: 5,
		labelPos: 'right',
		delay: 0.12
	},
	{
		id: 'consumo',
		label: 'Consumo',
		desc: 'Padrões de comportamento que antecipam o risco.',
		x: 0.12,
		y: 0.5,
		r: 5,
		labelPos: 'right',
		delay: 0.24
	},
	{
		id: 'registros',
		label: 'Registros públicos',
		desc: 'Fontes abertas integradas sem engenharia manual de atributos.',
		x: 0.11,
		y: 0.69,
		r: 5,
		labelPos: 'right',
		delay: 0.36
	},
	{
		id: 'macro',
		label: 'Macro',
		desc: 'Indicadores setoriais que deslocam a distribuição.',
		x: 0.09,
		y: 0.88,
		r: 5,
		labelPos: 'right',
		delay: 0.48
	},
	{
		id: 'tfm',
		label: 'Modelos fundacionais',
		desc: 'TFMs convertem dados heterogêneos em representações robustas.',
		x: 0.38,
		y: 0.5,
		r: 9,
		labelPos: 'bottom',
		delay: 0.85
	},
	{
		id: 'fairness',
		label: 'Fairness',
		desc: 'Equidade dentro da função objetivo, não como restrição periférica.',
		x: 0.56,
		y: 0.13,
		r: 6,
		labelPos: 'top',
		delay: 1.45
	},
	{
		id: 'simulador',
		label: 'Simulador',
		desc: 'World model: cada política é estressada antes da produção.',
		x: 0.56,
		y: 0.87,
		r: 6,
		labelPos: 'bottom',
		delay: 1.55
	},
	{
		id: 'politica',
		label: 'Política dinâmica',
		desc: 'Recomenda a intervenção que maximiza o valor a longo prazo.',
		x: 0.67,
		y: 0.5,
		r: 11,
		labelPos: 'bottom',
		brand: true,
		delay: 1.7
	},
	{
		id: 'aprovar',
		label: 'Aprovar',
		desc: 'Inclusive quem o score recusaria, quando aprender compensa.',
		x: 0.9,
		y: 0.16,
		r: 5,
		labelPos: 'left',
		delay: 2.3
	},
	{
		id: 'limite',
		label: 'Ajustar limite',
		desc: 'Expande ou contrai conforme o comportamento observado.',
		x: 0.92,
		y: 0.39,
		r: 5,
		labelPos: 'left',
		delay: 2.42
	},
	{
		id: 'ofertar',
		label: 'Ofertar produto',
		desc: 'O próximo produto na hora certa do ciclo de vida.',
		x: 0.92,
		y: 0.61,
		r: 5,
		labelPos: 'left',
		delay: 2.54
	},
	{
		id: 'reprecificar',
		label: 'Reprecificar',
		desc: 'Condições que acompanham a realidade de cada segmento.',
		x: 0.9,
		y: 0.84,
		r: 5,
		labelPos: 'left',
		delay: 2.66
	}
]

type EdgeDef = {
	a: string
	b: string
	/* Bow of the quadratic curve, as a fraction of the edge length. */
	curve: number
	delay: number
	feedback?: boolean
}

const EDGES: EdgeDef[] = [
	{ a: 'biro', b: 'tfm', curve: 0.12, delay: 0.9 },
	{ a: 'recebiveis', b: 'tfm', curve: 0.08, delay: 1.0 },
	{ a: 'consumo', b: 'tfm', curve: 0, delay: 1.1 },
	{ a: 'registros', b: 'tfm', curve: -0.08, delay: 1.2 },
	{ a: 'macro', b: 'tfm', curve: -0.12, delay: 1.3 },
	{ a: 'tfm', b: 'politica', curve: 0, delay: 1.95 },
	{ a: 'fairness', b: 'politica', curve: -0.1, delay: 2.0 },
	{ a: 'simulador', b: 'politica', curve: 0.1, delay: 2.1 },
	{ a: 'politica', b: 'aprovar', curve: -0.12, delay: 2.45 },
	{ a: 'politica', b: 'limite', curve: -0.06, delay: 2.57 },
	{ a: 'politica', b: 'ofertar', curve: 0.06, delay: 2.69 },
	{ a: 'politica', b: 'reprecificar', curve: 0.12, delay: 2.81 },
	/* Performative prediction: every decision comes back as new data. */
	{ a: 'aprovar', b: 'biro', curve: 0.3, delay: 3.3, feedback: true },
	{ a: 'reprecificar', b: 'consumo', curve: -0.3, delay: 3.5, feedback: true }
]

const NODE_INDEX = new Map(NODES.map((n, i) => [n.id, i]))

/* Node indices touched by each edge, for hover highlighting. */
const EDGE_ENDS = EDGES.map((e) => [
	NODE_INDEX.get(e.a) as number,
	NODE_INDEX.get(e.b) as number
])

const easeOutBack = (v: number) => {
	const c1 = 1.70158
	const c3 = c1 + 1
	return 1 + c3 * Math.pow(v - 1, 3) + c1 * Math.pow(v - 1, 2)
}

const easeInOutCubic = (v: number) =>
	v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/* Point on the quadratic bézier used to draw an edge. */
const bezier = (
	u: number,
	x0: number,
	y0: number,
	cx: number,
	cy: number,
	x1: number,
	y1: number
) => {
	const k = 1 - u
	return {
		x: k * k * x0 + 2 * k * u * cx + u * u * x1,
		y: k * k * y0 + 2 * k * u * cy + u * u * y1
	}
}

/**
 * The platform as a living graph: heterogeneous sources feed the foundation
 * models, the dynamic policy decides under fairness and simulator guardrails,
 * and every intervention loops back in as fresh data. Nodes pop in staggered,
 * edges draw themselves, and the whole thing can be dragged around.
 */
function PolicyGraph({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const activeRef = useRef(-1)
	const [active, setActive] = useState<NodeDef | null>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const nodes = NODES.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }))
		let dragging = -1
		let hovered = -1
		const pointer = { x: 0, y: 0 }

		/* Parallax shift: the whole graph drifts away from the pointer —
		   mouse in the top-right corner shifts the graph toward the bottom
		   left — up to SHIFT of the panel size, easing back on leave. */
		const SHIFT = 0.07
		const view = { x: 0, y: 0 }
		const viewTarget = { x: 0, y: 0 }

		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		/* font-mono is set on the canvas, so this resolves to the project mono. */
		const mono = getComputedStyle(canvas).fontFamily
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

		/* Mono label with a panel-colored halo so it stays legible on edges. */
		const label = (
			text: string,
			x: number,
			y: number,
			pos: LabelPos,
			r: number,
			alpha: number
		) => {
			ctx.font = `500 10px ${mono}`
			const content = text.toUpperCase()
			const w = ctx.measureText(content).width
			let tx = x
			let ty = y + 3
			ctx.textAlign = 'left'
			if (pos === 'right') tx = x + r + 8
			if (pos === 'left') tx = x - r - 8 - w
			if (pos === 'top') {
				tx = x - w / 2
				ty = y - r - 9
			}
			if (pos === 'bottom') {
				tx = x - w / 2
				ty = y + r + 15
			}
			tx = Math.min(width - w - 8, Math.max(8, tx))
			ctx.globalAlpha = alpha
			ctx.lineWidth = 3
			ctx.strokeStyle = PANEL
			ctx.strokeText(content, tx, ty)
			ctx.fillText(content, tx, ty)
			ctx.globalAlpha = 1
			ctx.lineWidth = 1
		}

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		/* Entrance clock starts when the panel scrolls into view. */
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
		io.observe(canvas)

		const draw = (now: number) => {
			ctx.clearRect(0, 0, width, height)
			const t = Number.isNaN(visibleAt) ? 0 : (now - visibleAt) / 1000
			const wave = now / 1000

			view.x += (viewTarget.x - view.x) * 0.06
			view.y += (viewTarget.y - view.y) * 0.06

			/* Physics: dragged node follows the pointer, everyone else is on
			   a soft spring back to a gently floating home position. */
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
					view.x +
					(reducedMotion ? 0 : Math.sin(wave * 0.6 + i * 1.7) * 4)
				const hy =
					def.y * height +
					view.y +
					(reducedMotion ? 0 : Math.cos(wave * 0.5 + i * 2.3) * 4)
				node.vx = (node.vx + (hx - node.x) * 0.025) * 0.88
				node.vy = (node.vy + (hy - node.y) * 0.025) * 0.88
				node.x += node.vx
				node.y += node.vy
			})

			const activeIdx = hovered >= 0 ? hovered : dragging
			activeRef.current = activeIdx
			const neighbors = new Set<number>()
			if (activeIdx >= 0) {
				neighbors.add(activeIdx)
				EDGE_ENDS.forEach(([a, b]) => {
					if (a === activeIdx) neighbors.add(b)
					if (b === activeIdx) neighbors.add(a)
				})
			}

			/* Edges draw themselves in, then carry pulses of data. */
			EDGES.forEach((edge, ei) => {
				const [ai, bi] = EDGE_ENDS[ei]
				const progress = easeInOutCubic(clamp01((t - edge.delay) / 0.7))
				if (progress <= 0) return

				const a = nodes[ai]
				const b = nodes[bi]
				const dx = b.x - a.x
				const dy = b.y - a.y
				const len = Math.hypot(dx, dy) || 1
				const cx = (a.x + b.x) / 2 - (dy / len) * edge.curve * len
				const cy = (a.y + b.y) / 2 + (dx / len) * edge.curve * len

				const touched =
					activeIdx < 0 || ai === activeIdx || bi === activeIdx
				const emphasis = touched ? 1 : 0.2
				const alpha = (edge.feedback ? 0.55 : 0.3) * progress * emphasis

				ctx.strokeStyle = edge.feedback ? BRAND : BONE
				ctx.globalAlpha = alpha
				if (edge.feedback) ctx.setLineDash([3, 6])
				ctx.beginPath()
				ctx.moveTo(a.x, a.y)
				const steps = 24
				for (let s = 1; s <= steps * progress; s++) {
					const p = bezier(s / steps, a.x, a.y, cx, cy, b.x, b.y)
					ctx.lineTo(p.x, p.y)
				}
				ctx.stroke()
				ctx.setLineDash([])

				/* Data pulse riding the finished edge. */
				if (progress >= 1 && !reducedMotion) {
					const u = (wave * 0.14 + ei * 0.37) % 1
					const p = bezier(u, a.x, a.y, cx, cy, b.x, b.y)
					ctx.globalAlpha = 0.7 * emphasis
					ctx.fillStyle = edge.feedback ? BRAND : BONE
					ctx.beginPath()
					ctx.arc(p.x, p.y, edge.feedback ? 2.2 : 1.6, 0, Math.PI * 2)
					ctx.fill()
				}
				ctx.globalAlpha = 1
			})

			/* Nodes pop in with a slight overshoot. */
			NODES.forEach((def, i) => {
				const node = nodes[i]
				const appear = clamp01((t - def.delay) / 0.5)
				if (appear <= 0) return
				const scale = easeOutBack(appear)
				const r = def.r * scale
				const emphasis = activeIdx < 0 || neighbors.has(i) ? 1 : 0.3
				const isActive = i === activeIdx

				ctx.globalAlpha = appear * emphasis
				ctx.fillStyle = def.brand ? BRAND : BONE
				ctx.beginPath()
				ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
				ctx.fill()

				/* Orbit ring on the hubs + a wider one when active. */
				if (def.r >= 6 || isActive) {
					ctx.strokeStyle = def.brand ? BRAND : BONE
					ctx.globalAlpha =
						appear * emphasis * (isActive ? 0.9 : 0.35)
					ctx.beginPath()
					ctx.arc(
						node.x,
						node.y,
						r + (isActive ? 7 : 4),
						0,
						Math.PI * 2
					)
					ctx.stroke()
				}

				ctx.fillStyle = def.brand
					? BRAND
					: `rgba(209, 209, 196, ${0.55 + 0.45 * (isActive ? 1 : 0)})`
				label(
					def.label,
					node.x,
					node.y,
					def.labelPos,
					r,
					appear * emphasis
				)
				ctx.globalAlpha = 1
			})

			canvas.style.cursor =
				dragging >= 0 ? 'grabbing' : hovered >= 0 ? 'grab' : 'default'
		}

		const hit = (x: number, y: number) => {
			for (let i = NODES.length - 1; i >= 0; i--) {
				const d = Math.hypot(nodes[i].x - x, nodes[i].y - y)
				if (d <= Math.max(14, NODES[i].r + 8)) return i
			}
			return -1
		}

		const toLocal = (e: globalThis.PointerEvent) => {
			const rect = canvas.getBoundingClientRect()
			return { x: e.clientX - rect.left, y: e.clientY - rect.top }
		}

		const onPointerDown = (e: globalThis.PointerEvent) => {
			const p = toLocal(e)
			const i = hit(p.x, p.y)
			if (i < 0) return
			dragging = i
			pointer.x = p.x
			pointer.y = p.y
			canvas.setPointerCapture(e.pointerId)
			setActive(NODES[i])
			e.preventDefault()
		}

		const onPointerMove = (e: globalThis.PointerEvent) => {
			const p = toLocal(e)
			pointer.x = p.x
			pointer.y = p.y
			if (!reducedMotion) {
				const fx = Math.max(-1, Math.min(1, (p.x / width) * 2 - 1))
				const fy = Math.max(-1, Math.min(1, (p.y / height) * 2 - 1))
				viewTarget.x = -fx * width * SHIFT
				viewTarget.y = -fy * height * SHIFT
			}
			if (dragging >= 0) return
			const i = hit(p.x, p.y)
			if (i !== hovered) {
				hovered = i
				setActive(i >= 0 ? NODES[i] : null)
			}
		}

		const onPointerUp = (e: globalThis.PointerEvent) => {
			if (dragging >= 0) canvas.releasePointerCapture(e.pointerId)
			dragging = -1
		}

		const onPointerLeave = () => {
			hovered = -1
			viewTarget.x = 0
			viewTarget.y = 0
			if (dragging < 0) setActive(null)
		}

		canvas.addEventListener('pointerdown', onPointerDown)
		canvas.addEventListener('pointermove', onPointerMove)
		canvas.addEventListener('pointerup', onPointerUp)
		canvas.addEventListener('pointercancel', onPointerUp)
		canvas.addEventListener('pointerleave', onPointerLeave)

		let raf = 0
		const loop = (now: number) => {
			draw(now)
			raf = requestAnimationFrame(loop)
		}

		const ro = new ResizeObserver(resize)
		ro.observe(canvas)
		resize()
		raf = requestAnimationFrame(loop)

		return () => {
			cancelAnimationFrame(raf)
			ro.disconnect()
			io.disconnect()
			canvas.removeEventListener('pointerdown', onPointerDown)
			canvas.removeEventListener('pointermove', onPointerMove)
			canvas.removeEventListener('pointerup', onPointerUp)
			canvas.removeEventListener('pointercancel', onPointerUp)
			canvas.removeEventListener('pointerleave', onPointerLeave)
		}
	}, [])

	return (
		<div className={cn('relative h-full w-full', className)}>
			<canvas
				ref={canvasRef}
				aria-hidden
				className="block h-full w-full touch-pan-y font-mono select-none"
			/>
			<div className="text-foreground/60 pointer-events-none absolute right-6 bottom-5 left-6 font-mono text-xs tracking-wide uppercase">
				{active ? (
					<>
						<span className={cn(active.brand && 'text-brand')}>
							{active.label}
						</span>
						<span className="text-foreground/45">
							{' — '}
							{active.desc}
						</span>
					</>
				) : (
					'Interativo — arraste os nós, passe o mouse sobre cada camada'
				)}
			</div>
		</div>
	)
}

export function CreditGraph() {
	return (
		<section
			id="arquitetura"
			className="bg-background text-foreground py-40"
		>
			<Reveal className="px-7">
				<span className="text-muted-foreground font-mono text-sm tracking-wide uppercase">
					(a arquitetura)
				</span>
				<h2 className="font-heading text-h1 mt-3 max-w-3xl text-balance">
					Um sistema que aprende em ciclo
				</h2>
				<p className="text-body-lg text-foreground/70 mt-5 max-w-2xl">
					Fontes heterogêneas viram representações via modelos
					fundacionais; a política decide com fairness na função
					objetivo e validação em simulador — e cada intervenção volta
					ao sistema como dado novo.
				</p>
			</Reveal>

			<Reveal className="mt-16 px-7" delay={0.1}>
				<div className="dark bg-background text-foreground relative h-[30rem] w-full overflow-hidden rounded-3xl border min-[810px]:h-[76svh]">
					<PolicyGraph className="absolute inset-0" />
				</div>
			</Reveal>
		</section>
	)
}
