'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

const BONE = '#f4f4f4'
const BRAND = '#3b8eff'
const PANEL = '#0f0f0e'
const KNOWN_COUNT = 42
const BLIND_COUNT = 115
/* Static cutoff radius — the frozen model only knows what is inside. */
const STATIC_R = 0.4
/* How far the dynamic frontier expands over a cycle (fraction of max R). */
const FRONTIER_MAX = 0.97
const CYCLE_S = 18
/* Seconds per full radar sweep. */
const SWEEP_S = 4.5
/* Share of swept profiles that turn out to be good payers. */
const LEARN_RATE = 0.8
const PING_S = 1.1
const TAU = Math.PI * 2

type Dot = {
	angle: number
	/* Distance from the portfolio center, as a fraction of max radius. */
	radius: number
	phase: number
	known: boolean
}

/**
 * Reject inference as a radar: the portfolio the static model knows lives
 * inside the dashed cutoff circle; everything beyond is the blind spot. A
 * sweeping arm probes outward as the dynamic frontier expands, revealing
 * good payers (brand blue) the frozen model would never see.
 */
export function BlindSpotCanvas({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const dots: Dot[] = [
			...Array.from({ length: KNOWN_COUNT }, () => ({
				angle: Math.random() * TAU,
				radius: STATIC_R * (0.12 + Math.random() * 0.78),
				phase: Math.random() * TAU,
				known: true
			})),
			...Array.from({ length: BLIND_COUNT }, () => ({
				angle: Math.random() * TAU,
				radius:
					STATIC_R * 1.1 +
					Math.random() * (FRONTIER_MAX - STATIC_R * 1.1),
				phase: Math.random() * TAU,
				known: false
			}))
		]

		/* Per-cycle discovery state, driven by the sweep crossing each dot. */
		let good: boolean[] = []
		let discoveredAt: number[] = []
		const resetCycle = () => {
			good = dots.map(() => Math.random() < LEARN_RATE)
			discoveredAt = dots.map(() => NaN)
		}
		resetCycle()

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

		/* Mono label with a panel-colored halo so it reads over the rings. */
		const label = (
			text: string,
			x: number,
			y: number,
			color: string,
			align: CanvasTextAlign
		) => {
			ctx.font = `500 10px ${mono}`
			ctx.textAlign = align
			const w = ctx.measureText(text.toUpperCase()).width
			const tx = Math.min(
				width - 8 - (align === 'left' ? w : 0),
				Math.max(8 + (align === 'right' ? w : 0), x)
			)
			const ty = Math.min(height - 10, Math.max(16, y))
			ctx.lineWidth = 3
			ctx.strokeStyle = PANEL
			ctx.strokeText(text.toUpperCase(), tx, ty)
			ctx.fillStyle = color
			ctx.fillText(text.toUpperCase(), tx, ty)
			ctx.textAlign = 'left'
			ctx.lineWidth = 1
		}

		const smooth = (v: number) => v * v * (3 - 2 * v)
		const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

		const frontierAt = (t: number) =>
			STATIC_R +
			(FRONTIER_MAX - STATIC_R) * smooth(clamp01((t - 2) / (CYCLE_S - 6)))

		let prevSweep = 0

		const draw = (t: number, sweeping: boolean) => {
			ctx.clearRect(0, 0, width, height)

			const cx = width * 0.5
			const cy = height * 0.52
			const maxR = Math.min(width, height) * 0.46
			const base = Math.min(1, t / 0.6, (CYCLE_S - t) / 0.8)
			const frontier = frontierAt(t) * maxR
			const staticR = STATIC_R * maxR
			const sweep = ((t / SWEEP_S) % 1) * TAU

			/* Sweep crossing: reveal blind dots the frontier already reaches. */
			if (sweeping) {
				const step = (sweep - prevSweep + TAU) % TAU
				if (step > 0 && step < Math.PI) {
					dots.forEach((dot, i) => {
						if (dot.known || !Number.isNaN(discoveredAt[i])) return
						if (dot.radius * maxR > frontier) return
						const sincePass = (sweep - dot.angle + TAU) % TAU
						if (sincePass <= step) discoveredAt[i] = t
					})
				}
				prevSweep = sweep
			}

			/* Radial grid. */
			ctx.strokeStyle = BONE
			for (const g of [0.25, 0.5, 0.75, 1]) {
				ctx.globalAlpha = base * 0.07
				ctx.beginPath()
				ctx.arc(cx, cy, maxR * g, 0, TAU)
				ctx.stroke()
			}
			ctx.globalAlpha = base * 0.05
			ctx.beginPath()
			ctx.moveTo(cx - maxR, cy)
			ctx.lineTo(cx + maxR, cy)
			ctx.moveTo(cx, cy - maxR)
			ctx.lineTo(cx, cy + maxR)
			ctx.stroke()

			/* Radar wedge trailing the arm, clipped to the frontier. */
			if (sweeping) {
				const segments = 26
				const span = (70 / 360) * TAU
				for (let s = 0; s < segments; s++) {
					const a1 = sweep - (span * (s + 1)) / segments
					const a2 = sweep - (span * s) / segments
					ctx.globalAlpha = base * 0.05 * (1 - s / segments)
					ctx.fillStyle = BONE
					ctx.beginPath()
					ctx.moveTo(cx, cy)
					ctx.arc(cx, cy, frontier, a1, a2)
					ctx.closePath()
					ctx.fill()
				}
				ctx.globalAlpha = base * 0.45
				ctx.strokeStyle = BONE
				ctx.beginPath()
				ctx.moveTo(cx, cy)
				ctx.lineTo(
					cx + Math.cos(sweep) * frontier,
					cy + Math.sin(sweep) * frontier
				)
				ctx.stroke()
			}

			/* Profiles. */
			let blind = 0
			let discovered = 0
			dots.forEach((dot, i) => {
				const wobble = Math.sin(t * 0.8 + dot.phase) * 2.5
				const r = dot.radius * maxR + wobble
				const x = cx + Math.cos(dot.angle) * r
				const y = cy + Math.sin(dot.angle) * r

				if (dot.known) {
					ctx.globalAlpha = base * 0.7
					ctx.fillStyle = BONE
					ctx.beginPath()
					ctx.arc(x, y, 2, 0, TAU)
					ctx.fill()
					return
				}

				const at = discoveredAt[i]
				if (Number.isNaN(at)) {
					/* Blind spot: rejected, therefore never observed. */
					blind++
					ctx.globalAlpha = base * 0.2
					ctx.strokeStyle = BONE
					ctx.beginPath()
					ctx.arc(x, y, 2, 0, TAU)
					ctx.stroke()
					return
				}

				if (good[i]) {
					discovered++
					ctx.globalAlpha = base
					ctx.fillStyle = BRAND
					ctx.beginPath()
					ctx.arc(x, y, 2.6, 0, TAU)
					ctx.fill()
				} else {
					/* Probed and declined — knowledge instead of a gap. */
					ctx.globalAlpha = base * 0.35
					ctx.fillStyle = BONE
					ctx.beginPath()
					ctx.arc(x, y, 1.8, 0, TAU)
					ctx.fill()
				}

				const age = t - at
				if (age >= 0 && age < PING_S) {
					ctx.globalAlpha = base * (1 - age / PING_S) * 0.8
					ctx.strokeStyle = BRAND
					ctx.beginPath()
					ctx.arc(x, y, 4 + age * 22, 0, TAU)
					ctx.stroke()
				}
				ctx.globalAlpha = base
			})

			/* Static cutoff — the circle the frozen model never leaves. */
			ctx.globalAlpha = base * 0.4
			ctx.strokeStyle = BONE
			ctx.setLineDash([4, 7])
			ctx.beginPath()
			ctx.arc(cx, cy, staticR, 0, TAU)
			ctx.stroke()
			ctx.setLineDash([])

			/* Dynamic frontier — expands as the sweeps come back. */
			ctx.globalAlpha = base
			ctx.strokeStyle = BRAND
			ctx.lineWidth = 1.5
			ctx.beginPath()
			ctx.arc(cx, cy, frontier, 0, TAU)
			ctx.stroke()
			ctx.lineWidth = 1

			ctx.globalAlpha = base
			label(
				'corte estático',
				cx - staticR * 0.72,
				cy - staticR * 0.72 - 8,
				'rgba(209, 209, 196, 0.55)',
				'right'
			)
			label(
				'fronteira dinâmica',
				cx + frontier * 0.74,
				cy - frontier * 0.74 - 8,
				BRAND,
				'left'
			)

			ctx.font = `500 10px ${mono}`
			ctx.textAlign = 'right'
			ctx.fillStyle = 'rgba(209, 209, 196, 0.4)'
			ctx.fillText(
				`PONTO CEGO: ${String(blind).padStart(3, '0')} PERFIS`,
				width - 16,
				height - 34
			)
			ctx.fillStyle = discovered > 0 ? BRAND : 'rgba(209, 209, 196, 0.4)'
			ctx.fillText(
				`BONS PAGADORES DESCOBERTOS: ${String(discovered).padStart(3, '0')}`,
				width - 16,
				height - 18
			)
			ctx.textAlign = 'left'
			ctx.globalAlpha = 1
		}

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		/* Static frame: mid-cycle, with everything in reach already found. */
		const drawStatic = () => {
			const t = CYCLE_S * 0.55
			const frontier = frontierAt(t)
			dots.forEach((dot, i) => {
				discoveredAt[i] =
					!dot.known && dot.radius <= frontier ? t - PING_S : NaN
			})
			draw(t, false)
		}

		let raf = 0
		let start = 0
		let cycle = 0
		const loop = (now: number) => {
			if (!start) start = now
			const elapsed = (now - start) * 0.001
			const currentCycle = Math.floor(elapsed / CYCLE_S)
			if (currentCycle !== cycle) {
				cycle = currentCycle
				prevSweep = 0
				resetCycle()
			}
			draw(elapsed % CYCLE_S, true)
			raf = requestAnimationFrame(loop)
		}

		const ro = new ResizeObserver(() => {
			resize()
			if (reducedMotion) drawStatic()
		})
		ro.observe(canvas)
		resize()

		if (reducedMotion) drawStatic()
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
