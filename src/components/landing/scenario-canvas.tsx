'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

const BONE = '#d1d1c4'
const BRAND = '#3b8eff'
const GHOSTS = 46
const POINTS = 110
/* Simulated macro shock window (fractions of width). */
const SHOCK_START = 0.54
const SHOCK_END = 0.67
const REVEAL_S = 7
const HOLD_S = 2.4
const FADE_S = 0.8
const CYCLE_S = REVEAL_S + HOLD_S + FADE_S

/* One portfolio trajectory as y fractions (lower y = higher value). */
function makePath(kind: 'ghost' | 'static' | 'dynamic') {
	const path: number[] = []
	let y = 0.52 + (kind === 'ghost' ? (Math.random() - 0.5) * 0.1 : 0)
	const drift = kind === 'ghost' ? -0.0012 - Math.random() * 0.001 : -0.0016
	const shock =
		kind === 'ghost'
			? 0.004 + Math.random() * 0.009
			: kind === 'static'
				? 0.011
				: 0.005
	const recovery =
		kind === 'ghost'
			? -0.004 * Math.random()
			: kind === 'static'
				? 0.0012
				: -0.006

	for (let i = 0; i < POINTS; i++) {
		const p = i / (POINTS - 1)
		const noise = (Math.random() - 0.5) * (kind === 'ghost' ? 0.011 : 0.005)
		if (p < SHOCK_START) y += drift + noise
		else if (p < SHOCK_END) y += shock + noise
		else y += recovery + noise
		y = Math.min(0.92, Math.max(0.08, y))
		path.push(y)
	}
	return path
}

/**
 * The world model at work: dozens of simulated futures of the same portfolio
 * fan out and cross a macro-shock window. The static policy keeps bleeding
 * after the shock; the dynamic policy adapts in context and recovers —
 * all before a single real is at risk.
 */
export function ScenarioCanvas({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		let ghosts: number[][] = []
		let staticPath: number[] = []
		let dynamicPath: number[] = []
		const generate = () => {
			ghosts = Array.from({ length: GHOSTS }, () => makePath('ghost'))
			staticPath = makePath('static')
			dynamicPath = makePath('dynamic')
		}
		generate()

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
		}

		const trace = (path: number[], upto: number) => {
			ctx.beginPath()
			for (let i = 0; i <= upto; i++) {
				const x = (i / (POINTS - 1)) * width
				const y = path[i] * height
				if (i === 0) ctx.moveTo(x, y)
				else ctx.lineTo(x, y)
			}
			ctx.stroke()
		}

		const draw = (t: number) => {
			ctx.clearRect(0, 0, width, height)

			/* Fade in at the start, fade out at the end of each cycle. */
			const base = Math.min(
				1,
				t / 0.5,
				Math.max(0, (CYCLE_S - t) / FADE_S)
			)
			const progress = Math.min(1, t / REVEAL_S)
			const head = Math.max(1, Math.floor(progress * (POINTS - 1)))

			/* Macro-shock window. */
			ctx.globalAlpha = base * 0.05
			ctx.fillStyle = BONE
			ctx.fillRect(
				SHOCK_START * width,
				0,
				(SHOCK_END - SHOCK_START) * width,
				height
			)
			ctx.globalAlpha = base * 0.5
			ctx.font = `500 10px ${mono}`
			ctx.fillStyle = BONE
			ctx.textAlign = 'center'
			ctx.fillText(
				'CHOQUE SIMULADO',
				((SHOCK_START + SHOCK_END) / 2) * width,
				24
			)
			ctx.textAlign = 'left'

			/* The fan of simulated futures. */
			ctx.globalAlpha = base * 0.08
			ctx.strokeStyle = BONE
			ctx.lineWidth = 1
			for (const ghost of ghosts) trace(ghost, head)

			/* Static policy — keeps bleeding after the shock. */
			ctx.globalAlpha = base * 0.75
			ctx.strokeStyle = BONE
			ctx.lineWidth = 1.5
			trace(staticPath, head)

			/* Dynamic policy — adapts in context and recovers. */
			ctx.globalAlpha = base
			ctx.strokeStyle = BRAND
			ctx.lineWidth = 2
			trace(dynamicPath, head)
			ctx.lineWidth = 1

			/* Heads + labels ride the reveal. */
			if (progress > 0.12) {
				const hx = (head / (POINTS - 1)) * width
				const flip = hx > width * 0.7
				ctx.font = `500 10px ${mono}`
				ctx.textAlign = flip ? 'right' : 'left'

				ctx.globalAlpha = base * 0.75
				ctx.fillStyle = BONE
				ctx.beginPath()
				ctx.arc(hx, staticPath[head] * height, 2.5, 0, Math.PI * 2)
				ctx.fill()
				ctx.fillStyle = 'rgba(209, 209, 196, 0.55)'
				ctx.fillText(
					'POLÍTICA ESTÁTICA',
					flip ? hx - 10 : hx + 10,
					staticPath[head] * height + 14
				)

				ctx.globalAlpha = base
				ctx.fillStyle = BRAND
				ctx.beginPath()
				ctx.arc(hx, dynamicPath[head] * height, 3, 0, Math.PI * 2)
				ctx.fill()
				ctx.fillText(
					'POLÍTICA DINÂMICA',
					flip ? hx - 10 : hx + 10,
					dynamicPath[head] * height - 8
				)
				ctx.textAlign = 'left'
			}

			ctx.globalAlpha = base
			ctx.font = `500 10px ${mono}`
			ctx.textAlign = 'right'
			ctx.fillStyle = 'rgba(209, 209, 196, 0.4)'
			ctx.fillText(
				`FUTUROS SIMULADOS: ${String(GHOSTS + 2).padStart(3, '0')}`,
				width - 16,
				height - 18
			)
			ctx.textAlign = 'left'
			ctx.globalAlpha = 1
		}

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		let raf = 0
		let start = 0
		let cycle = 0
		const loop = (now: number) => {
			if (!start) start = now
			const elapsed = (now - start) * 0.001
			const currentCycle = Math.floor(elapsed / CYCLE_S)
			if (currentCycle !== cycle) {
				cycle = currentCycle
				generate()
			}
			draw(elapsed % CYCLE_S)
			raf = requestAnimationFrame(loop)
		}

		const ro = new ResizeObserver(() => {
			resize()
			if (reducedMotion) draw(REVEAL_S)
		})
		ro.observe(canvas)
		resize()

		if (reducedMotion) draw(REVEAL_S)
		else raf = requestAnimationFrame(loop)

		return () => {
			cancelAnimationFrame(raf)
			ro.disconnect()
		}
	}, [])

	return (
		<canvas
			ref={canvasRef}
			aria-hidden
			className={cn('block h-full w-full font-mono', className)}
		/>
	)
}
