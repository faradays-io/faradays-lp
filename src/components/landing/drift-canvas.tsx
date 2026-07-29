'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

const BONE = '#f4f4f4'
const BRAND = '#3b8eff'
const DOT_COUNT = 130
/* Approval cutoff the "static model" was trained on (fraction of width). */
const STATIC_CUT = 0.6
/* The dynamic policy tracks the population mean at this offset. */
const POLICY_OFFSET = 0.1
/* Start deep into the drift cycle so the gap is visible on first paint. */
const T_START = 34

type Dot = {
	score: number
	y: number
	phase: number
	amp: number
}

/** Roughly normal in [-1, 1] — sum of three uniforms, cheap and good enough. */
function gaussish() {
	return (Math.random() + Math.random() + Math.random()) / 1.5 - 1
}

/**
 * The product's argument, rendered live: a population of borrowers (dots)
 * whose score distribution drifts over time. The static model's cutoff stays
 * frozen while the dynamic policy tracks the drift — dots the policy approves
 * but the static model can no longer see light up in brand blue.
 */
export function DriftCanvas({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const dots: Dot[] = Array.from({ length: DOT_COUNT }, () => ({
			score: gaussish(),
			y: Math.random(),
			phase: Math.random() * Math.PI * 2,
			amp: 0.004 + Math.random() * 0.014
		}))

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

		const label = (text: string, x: number, y: number, color: string) => {
			ctx.font = `500 10px ${mono}`
			ctx.fillStyle = color
			const flip = x > width * 0.62
			ctx.textAlign = flip ? 'right' : 'left'
			ctx.fillText(text.toUpperCase(), flip ? x - 10 : x + 10, y)
		}

		const draw = (t: number) => {
			ctx.clearRect(0, 0, width, height)

			const mean =
				0.5 +
				0.17 * Math.sin(t * 0.14) +
				0.05 * Math.sin(t * 0.041 + 1.7)
			const staticX = STATIC_CUT * width
			const policyX = (mean + POLICY_OFFSET) * width

			/* Blind-spot band — approved by the policy, invisible to the
			   static model. */
			if (policyX < staticX) {
				ctx.fillStyle = BRAND
				ctx.globalAlpha = 0.05
				ctx.fillRect(policyX, 0, staticX - policyX, height)
				ctx.globalAlpha = 1
			}

			let blind = 0
			for (const dot of dots) {
				const x =
					(mean + dot.score * 0.17) * width +
					Math.sin(t * 0.9 + dot.phase) * dot.amp * width
				const y =
					(0.08 + dot.y * 0.84) * height +
					Math.cos(t * 0.7 + dot.phase) * dot.amp * height

				const policyApproved = x > policyX
				const staticApproved = x > staticX

				if (policyApproved && !staticApproved) {
					blind++
					ctx.globalAlpha = 1
					ctx.fillStyle = BRAND
					ctx.beginPath()
					ctx.arc(x, y, 2.6, 0, Math.PI * 2)
					ctx.fill()
				} else if (staticApproved && !policyApproved) {
					/* Risk the frozen model still approves — hollow dot. */
					ctx.globalAlpha = 0.55
					ctx.strokeStyle = BONE
					ctx.lineWidth = 1
					ctx.beginPath()
					ctx.arc(x, y, 2.2, 0, Math.PI * 2)
					ctx.stroke()
				} else {
					ctx.globalAlpha = policyApproved ? 0.85 : 0.25
					ctx.fillStyle = BONE
					ctx.beginPath()
					ctx.arc(x, y, policyApproved ? 2 : 1.7, 0, Math.PI * 2)
					ctx.fill()
				}
			}
			ctx.globalAlpha = 1

			/* Static cutoff — frozen where the training data left it. */
			ctx.strokeStyle = BONE
			ctx.globalAlpha = 0.4
			ctx.setLineDash([4, 7])
			ctx.beginPath()
			ctx.moveTo(staticX, 0)
			ctx.lineTo(staticX, height)
			ctx.stroke()
			ctx.setLineDash([])
			ctx.globalAlpha = 1

			/* Policy cutoff — tracks the distribution. */
			ctx.strokeStyle = BRAND
			ctx.lineWidth = 1.5
			ctx.beginPath()
			ctx.moveTo(policyX, 0)
			ctx.lineTo(policyX, height)
			ctx.stroke()
			ctx.lineWidth = 1

			label('modelo estático', staticX, 22, 'rgba(209, 209, 196, 0.55)')
			label('política dinâmica', policyX, 40, BRAND)

			ctx.font = `500 10px ${mono}`
			ctx.textAlign = 'right'
			ctx.fillStyle = blind > 0 ? BRAND : 'rgba(209, 209, 196, 0.4)'
			ctx.fillText(
				`INVISÍVEIS AO MODELO ESTÁTICO: ${String(blind).padStart(2, '0')}`,
				width - 16,
				height - 18
			)
			ctx.textAlign = 'left'
		}

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		let raf = 0
		let start = 0
		const loop = (now: number) => {
			if (!start) start = now
			draw(T_START + (now - start) * 0.001)
			raf = requestAnimationFrame(loop)
		}

		const ro = new ResizeObserver(() => {
			resize()
			if (reducedMotion) draw(T_START)
		})
		ro.observe(canvas)
		resize()

		if (reducedMotion) draw(T_START)
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
