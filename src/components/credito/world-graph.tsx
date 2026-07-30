'use client'

import { useEffect, useRef } from 'react'

import {
	BRAND,
	clamp01,
	easeOutCubic,
	HALO,
	INK
} from '@/components/credito/chart-canvas'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

/* Grafo do world model — estados e decisões de crédito como nós ligados
   por transições. Interativo de verdade: cada nó pode ser arrastado; as
   arestas são molas, então a vizinhança é puxada junto e tudo volta ao
   lugar quando solta. Hover destaca o nó e suas transições. */

type GraphNode = {
	label: string
	/** Posição de repouso, em frações do canvas. */
	hx: number
	hy: number
	/** Nó de destaque permanente (azul da marca). */
	accent?: boolean
}

const NODES: GraphNode[] = [
	{ label: 'estado atual', hx: 0.13, hy: 0.5 },
	{ label: 'aprovar', hx: 0.37, hy: 0.24 },
	{ label: 'ajustar limite', hx: 0.37, hy: 0.52 },
	{ label: 'negar', hx: 0.37, hy: 0.8 },
	{ label: 'em dia', hx: 0.6, hy: 0.16 },
	{ label: 'atraso', hx: 0.6, hy: 0.4 },
	{ label: 'novo limite', hx: 0.6, hy: 0.62 },
	{ label: 'novos dados', hx: 0.6, hy: 0.88 },
	{ label: 'valor no horizonte', hx: 0.86, hy: 0.34, accent: true }
]

/* Transições dirigidas [de, para]. */
const EDGES: Array<[number, number]> = [
	[0, 1],
	[0, 2],
	[0, 3],
	[1, 4],
	[1, 5],
	[2, 6],
	[4, 8],
	[6, 8],
	[5, 7],
	[3, 7],
	[7, 0]
]

const NODE_R = 5
const HIT_R = 20

export function WorldGraph({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const ready = usePageReady()

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		const mono = getComputedStyle(canvas).fontFamily
		let width = 0
		let height = 0

		/* Estado físico dos nós (px). Rehoma no resize. */
		const bodies = NODES.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }))
		const home = (i: number) => ({
			x: NODES[i].hx * width,
			y: NODES[i].hy * height
		})

		const resize = () => {
			width = canvas.clientWidth
			height = canvas.clientHeight
			canvas.width = Math.round(width * dpr)
			canvas.height = Math.round(height * dpr)
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
			bodies.forEach((body, i) => {
				const h = home(i)
				body.x = h.x
				body.y = h.y
				body.vx = 0
				body.vy = 0
			})
		}

		const reduced = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		/* Relógio de entrada — começa quando o grafo entra na tela. */
		let clock = reduced ? -Infinity : NaN
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					if (Number.isNaN(clock)) clock = performance.now()
					io.disconnect()
				}
			},
			{ threshold: 0.35 }
		)
		io.observe(canvas)

		/* Interação. */
		let drag = -1
		let hover = -1
		const pointer = { x: 0, y: 0 }

		const pick = (x: number, y: number) => {
			let found = -1
			let bestD = HIT_R ** 2
			bodies.forEach((body, i) => {
				const d = (body.x - x) ** 2 + (body.y - y) ** 2
				if (d < bestD) {
					bestD = d
					found = i
				}
			})
			return found
		}

		const toLocal = (event: PointerEvent) => {
			const rect = canvas.getBoundingClientRect()
			return { x: event.clientX - rect.left, y: event.clientY - rect.top }
		}

		const onDown = (event: PointerEvent) => {
			const p = toLocal(event)
			drag = pick(p.x, p.y)
			if (drag >= 0) {
				pointer.x = p.x
				pointer.y = p.y
				canvas.setPointerCapture(event.pointerId)
				event.preventDefault()
			}
		}
		const onMove = (event: PointerEvent) => {
			const p = toLocal(event)
			pointer.x = p.x
			pointer.y = p.y
			if (drag < 0) hover = pick(p.x, p.y)
		}
		const onUp = (event: PointerEvent) => {
			if (drag >= 0) canvas.releasePointerCapture(event.pointerId)
			drag = -1
		}
		const onLeave = () => {
			hover = -1
		}
		canvas.addEventListener('pointerdown', onDown)
		canvas.addEventListener('pointermove', onMove)
		canvas.addEventListener('pointerup', onUp)
		canvas.addEventListener('pointercancel', onUp)
		canvas.addEventListener('pointerleave', onLeave)

		const label = (
			text: string,
			x: number,
			y: number,
			color: string,
			alpha: number,
			align: CanvasTextAlign = 'center'
		) => {
			if (alpha <= 0) return
			ctx.font = `500 10px ${mono}`
			ctx.textAlign = align
			ctx.globalAlpha = alpha
			ctx.lineWidth = 3
			ctx.strokeStyle = HALO
			const content = text.toUpperCase()
			ctx.strokeText(content, x, y)
			ctx.fillStyle = color
			ctx.fillText(content, x, y)
			ctx.textAlign = 'left'
			ctx.globalAlpha = 1
			ctx.lineWidth = 1
		}

		const step = () => {
			/* Molas: cada nó volta para casa; cada aresta puxa os vizinhos
			   com comprimento de repouso igual ao das posições de casa. */
			EDGES.forEach(([a, b]) => {
				const ha = home(a)
				const hb = home(b)
				const rest = Math.hypot(hb.x - ha.x, hb.y - ha.y)
				const dx = bodies[b].x - bodies[a].x
				const dy = bodies[b].y - bodies[a].y
				const dist = Math.hypot(dx, dy) || 1
				const force = (dist - rest) * 0.02
				const fx = (dx / dist) * force
				const fy = (dy / dist) * force
				bodies[a].vx += fx
				bodies[a].vy += fy
				bodies[b].vx -= fx
				bodies[b].vy -= fy
			})
			bodies.forEach((body, i) => {
				if (i === drag) {
					body.x = pointer.x
					body.y = pointer.y
					body.vx = 0
					body.vy = 0
					return
				}
				const h = home(i)
				body.vx += (h.x - body.x) * 0.03
				body.vy += (h.y - body.y) * 0.03
				body.vx *= 0.86
				body.vy *= 0.86
				body.x += body.vx
				body.y += body.vy
			})
		}

		const frame = (now: number) => {
			ctx.clearRect(0, 0, width, height)
			const t = Number.isNaN(clock) ? 0 : (now - clock) / 1000
			step()

			const active = drag >= 0 ? drag : hover

			/* Arestas com seta na ponta. */
			EDGES.forEach(([a, b], e) => {
				const edgeIn = easeOutCubic(clamp01((t - 0.5 - e * 0.06) / 0.5))
				if (edgeIn <= 0) return
				const na = bodies[a]
				const nb = bodies[b]
				const dx = nb.x - na.x
				const dy = nb.y - na.y
				const dist = Math.hypot(dx, dy) || 1
				const ux = dx / dist
				const uy = dy / dist
				const x0 = na.x + ux * (NODE_R + 3)
				const y0 = na.y + uy * (NODE_R + 3)
				const x1 = na.x + ux * (dist - NODE_R - 5) * edgeIn
				const y1 = na.y + uy * (dist - NODE_R - 5) * edgeIn
				const hot = active >= 0 && (a === active || b === active)
				ctx.strokeStyle = hot ? BRAND : INK
				ctx.globalAlpha = (hot ? 0.85 : 0.22) * edgeIn
				ctx.lineWidth = hot ? 1.5 : 1
				ctx.beginPath()
				ctx.moveTo(x0, y0)
				ctx.lineTo(x1, y1)
				ctx.stroke()
				if (edgeIn >= 1) {
					ctx.beginPath()
					ctx.moveTo(x1, y1)
					ctx.lineTo(x1 - ux * 6 - uy * 3, y1 - uy * 6 + ux * 3)
					ctx.moveTo(x1, y1)
					ctx.lineTo(x1 - ux * 6 + uy * 3, y1 - uy * 6 - ux * 3)
					ctx.stroke()
				}
				ctx.lineWidth = 1
			})

			/* Nós. */
			NODES.forEach((node, i) => {
				const nodeIn = easeOutCubic(clamp01((t - i * 0.07) / 0.5))
				if (nodeIn <= 0) return
				const body = bodies[i]
				const hot = i === active
				const brandNode = node.accent || i === 0
				const r = (hot ? NODE_R + 2.5 : NODE_R) * nodeIn

				/* Halo do nó em interação. */
				if (hot) {
					ctx.strokeStyle = BRAND
					ctx.globalAlpha = 0.35
					ctx.beginPath()
					ctx.arc(body.x, body.y, r + 6, 0, Math.PI * 2)
					ctx.stroke()
				}

				ctx.fillStyle = hot || brandNode ? BRAND : HALO
				ctx.strokeStyle = hot || brandNode ? BRAND : INK
				ctx.globalAlpha = nodeIn * (brandNode || hot ? 0.95 : 0.75)
				ctx.beginPath()
				ctx.arc(body.x, body.y, r, 0, Math.PI * 2)
				ctx.fill()
				ctx.stroke()

				label(
					node.label,
					body.x,
					body.y + r + 14,
					hot || brandNode ? BRAND : 'rgba(27,26,21,0.6)',
					nodeIn * (hot ? 1 : 0.85)
				)
			})

			label(
				'arraste os nós — o ambiente reage',
				width / 2,
				height * 0.97,
				'rgba(27,26,21,0.45)',
				easeOutCubic(clamp01((t - 1.4) / 0.5))
			)

			canvas.style.cursor =
				drag >= 0 ? 'grabbing' : hover >= 0 ? 'grab' : 'default'
		}

		let raf = 0
		const loop = (now: number) => {
			frame(now)
			raf = requestAnimationFrame(loop)
		}

		const ro = new ResizeObserver(resize)
		ro.observe(canvas)
		resize()
		// Antes do fim do loader: um frame estático, sem loop.
		if (ready) raf = requestAnimationFrame(loop)
		else frame(performance.now())

		return () => {
			cancelAnimationFrame(raf)
			ro.disconnect()
			io.disconnect()
			canvas.removeEventListener('pointerdown', onDown)
			canvas.removeEventListener('pointermove', onMove)
			canvas.removeEventListener('pointerup', onUp)
			canvas.removeEventListener('pointercancel', onUp)
			canvas.removeEventListener('pointerleave', onLeave)
		}
	}, [ready])

	return (
		<div className={cn('relative w-full', className)}>
			<canvas
				ref={canvasRef}
				aria-hidden
				className="absolute inset-0 block h-full w-full touch-pan-y font-mono select-none"
			/>
		</div>
	)
}
