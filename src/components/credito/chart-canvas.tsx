'use client'

import { useEffect, useRef } from 'react'

import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

/* Infra compartilhada dos gráficos ilustrativos de /credito — mesmo
   desenho técnico dos gráficos da home/importações: canvas sem fundo,
   traço tinta + azul da marca, labels em mono com halo da cor do fundo.
   O relógio de entrada (t) começa quando o canvas entra na viewport. */

export const INK = '#1b1a15'
export const BRAND = '#0065e0'
export const RED = '#d93025'
export const HALO = '#f4f4f4'

export const easeOutCubic = (v: number) => 1 - Math.pow(1 - v, 3)
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** Posição do ponteiro em px do canvas; active só enquanto está em cima. */
export type Pointer = { x: number; y: number; active: boolean }

export type DrawArgs = {
	ctx: CanvasRenderingContext2D
	w: number
	h: number
	/** Segundos desde a entrada na viewport (easing de entrada). */
	t: number
	/** Relógio contínuo para oscilações ambientes. */
	wave: number
	reduced: boolean
	pointer: Pointer
	label: (
		text: string,
		x: number,
		y: number,
		align: CanvasTextAlign,
		color: string,
		alpha: number
	) => void
}

export function ChartCanvas({
	draw,
	className
}: {
	draw: (args: DrawArgs) => void
	className?: string
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const pointerRef = useRef<Pointer>({ x: 0, y: 0, active: false })
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

		const resize = () => {
			width = canvas.clientWidth
			height = canvas.clientHeight
			canvas.width = Math.round(width * dpr)
			canvas.height = Math.round(height * dpr)
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		}

		const reduced = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		/* Relógio começa quando o gráfico entra na tela. */
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

		const label: DrawArgs['label'] = (text, x, y, align, color, alpha) => {
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

		const frame = (now: number) => {
			ctx.clearRect(0, 0, width, height)
			const t = Number.isNaN(clock) ? 0 : (now - clock) / 1000
			draw({
				ctx,
				w: width,
				h: height,
				t,
				wave: now / 1000,
				reduced,
				pointer: pointerRef.current,
				label
			})
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
		}
	}, [ready, draw])

	return (
		<div
			className={cn('relative w-full', className)}
			onPointerMove={(event) => {
				const rect = event.currentTarget.getBoundingClientRect()
				pointerRef.current = {
					x: event.clientX - rect.left,
					y: event.clientY - rect.top,
					active: true
				}
			}}
			onPointerLeave={() => {
				pointerRef.current = { ...pointerRef.current, active: false }
			}}
		>
			<canvas
				ref={canvasRef}
				aria-hidden
				className="absolute inset-0 block h-full w-full font-mono"
			/>
		</div>
	)
}
