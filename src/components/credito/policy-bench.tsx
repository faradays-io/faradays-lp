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

/* Banco de provas de políticas (visão do cliente): antes de tocar a
   carteira real, cada política roda no simulador sob cenários. O usuário
   arrasta o controle de cenário (estável ↔ crise) e vê o retorno simulado
   das duas políticas: a régua estática degrada com o estresse; a política
   dinâmica se adapta — a área entre elas é a perda evitada. Sem interação,
   o cenário varre sozinho num vaivém lento. */

export function PolicyBench({ className }: { className?: string }) {
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

		/* Relógio de entrada — começa quando o painel entra na tela. */
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

		/* Estresse do cenário em [0..1]: 0 = estável, 1 = crise. `shown`
		   persegue `stress` com inércia para o morph ficar suave. */
		let stress = 0.25
		let shown = 0.25
		let dragging = false
		let hoverKnob = false
		let touched = false /* depois do 1º arrasto o vaivém para */

		const track = () => ({
			x0: width * 0.16,
			x1: width * 0.84,
			y: height * 0.14
		})
		const knobX = () => {
			const { x0, x1 } = track()
			return x0 + (x1 - x0) * shown
		}

		const toLocal = (event: PointerEvent) => {
			const rect = canvas.getBoundingClientRect()
			return { x: event.clientX - rect.left, y: event.clientY - rect.top }
		}
		const overKnob = (x: number, y: number) => {
			const { y: ty } = track()
			return Math.hypot(x - knobX(), y - ty) < 18
		}

		const onDown = (event: PointerEvent) => {
			const p = toLocal(event)
			const { x0, x1, y } = track()
			/* Pega no knob ou em qualquer ponto do trilho. */
			if (overKnob(p.x, p.y) || Math.abs(p.y - y) < 14) {
				dragging = true
				touched = true
				stress = clamp01((p.x - x0) / (x1 - x0))
				canvas.setPointerCapture(event.pointerId)
				event.preventDefault()
			}
		}
		const onMove = (event: PointerEvent) => {
			const p = toLocal(event)
			if (dragging) {
				const { x0, x1 } = track()
				stress = clamp01((p.x - x0) / (x1 - x0))
			} else {
				hoverKnob = overKnob(p.x, p.y)
			}
		}
		const onUp = (event: PointerEvent) => {
			if (dragging) canvas.releasePointerCapture(event.pointerId)
			dragging = false
		}
		canvas.addEventListener('pointerdown', onDown)
		canvas.addEventListener('pointermove', onMove)
		canvas.addEventListener('pointerup', onUp)
		canvas.addEventListener('pointercancel', onUp)

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

		const frame = (now: number) => {
			ctx.clearRect(0, 0, width, height)
			const t = Number.isNaN(clock) ? 0 : (now - clock) / 1000
			const wave = now / 1000

			/* Vaivém autônomo até o primeiro arrasto. */
			if (!touched && !reduced && t > 1.8)
				stress = 0.5 + Math.sin(wave * 0.3) * 0.42
			shown += (stress - shown) * (reduced ? 1 : 0.12)

			const { x0: tx0, x1: tx1, y: trackY } = track()

			/* Controle de cenário. */
			const ctrlIn = easeOutCubic(clamp01((t - 1.2) / 0.6))
			if (ctrlIn > 0) {
				ctx.strokeStyle = INK
				ctx.globalAlpha = 0.25 * ctrlIn
				ctx.beginPath()
				ctx.moveTo(tx0, trackY)
				ctx.lineTo(tx1, trackY)
				ctx.stroke()
				/* Trecho percorrido, em azul. */
				ctx.strokeStyle = BRAND
				ctx.globalAlpha = 0.5 * ctrlIn
				ctx.lineWidth = 2
				ctx.beginPath()
				ctx.moveTo(tx0, trackY)
				ctx.lineTo(knobX(), trackY)
				ctx.stroke()
				ctx.lineWidth = 1

				const active = dragging || hoverKnob
				if (active) {
					ctx.strokeStyle = BRAND
					ctx.globalAlpha = 0.35
					ctx.beginPath()
					ctx.arc(knobX(), trackY, 12, 0, Math.PI * 2)
					ctx.stroke()
				}
				ctx.fillStyle = BRAND
				ctx.globalAlpha = ctrlIn
				ctx.beginPath()
				ctx.arc(knobX(), trackY, active ? 7 : 5.5, 0, Math.PI * 2)
				ctx.fill()

				label(
					'estável',
					tx0,
					trackY - 14,
					'rgba(27,26,21,0.55)',
					ctrlIn * 0.9,
					'left'
				)
				label(
					'crise',
					tx1,
					trackY - 14,
					'rgba(27,26,21,0.55)',
					ctrlIn * 0.9,
					'right'
				)
				label(
					'cenário simulado',
					(tx0 + tx1) / 2,
					trackY - 14,
					BRAND,
					ctrlIn,
					'center'
				)
			}

			/* Retorno simulado sob o cenário: a régua estática degrada com o
			   estresse; a política dinâmica mergulha pouco e se recupera. */
			const px0 = width * 0.1
			const py0 = height * 0.86
			const px1 = width * 0.93
			const span = px1 - px0
			const rise = height * 0.5

			const shock = (u: number) => clamp01((u - 0.3) / 0.35)
			const bump = (u: number) =>
				Math.sin(Math.PI * clamp01((u - 0.3) / 0.5))
			const statV = (u: number) =>
				0.58 * u ** 0.95 - shown * 0.42 * shock(u) * u
			const dynV = (u: number) =>
				0.88 * u ** 0.95 - shown * 0.14 * bump(u)
			const statY = (u: number) => py0 - statV(u) * rise
			const dynY = (u: number) => py0 - dynV(u) * rise

			/* Eixos. */
			const axis = easeOutCubic(clamp01((t - 0.2) / 0.5))
			ctx.strokeStyle = INK
			ctx.globalAlpha = 0.25 * axis
			ctx.beginPath()
			ctx.moveTo(px0, height * 0.28)
			ctx.lineTo(px0, py0)
			ctx.lineTo(px1, py0)
			ctx.stroke()
			label(
				'tempo',
				px1,
				py0 + 16,
				'rgba(27,26,21,0.45)',
				axis * 0.8,
				'right'
			)
			label(
				'retorno da carteira',
				px0,
				height * 0.25,
				'rgba(27,26,21,0.45)',
				axis * 0.8,
				'left'
			)

			const lineIn = easeOutCubic(clamp01((t - 0.5) / 1.2))
			const steps = 64

			/* Perda evitada: área entre as curvas, cresce com o estresse. */
			if (lineIn > 0.3 && shown > 0.12) {
				ctx.fillStyle = BRAND
				ctx.globalAlpha = 0.07 * clamp01((lineIn - 0.3) / 0.7)
				ctx.beginPath()
				for (let i = 0; i <= steps * lineIn; i++) {
					const u = i / steps
					const x = px0 + span * u
					if (i === 0) ctx.moveTo(x, dynY(u))
					else ctx.lineTo(x, dynY(u))
				}
				for (let i = Math.floor(steps * lineIn); i >= 0; i--) {
					const u = i / steps
					ctx.lineTo(px0 + span * u, statY(u))
				}
				ctx.closePath()
				ctx.fill()
			}

			/* Curvas. */
			const curve = (
				fn: (u: number) => number,
				color: string,
				alpha: number
			) => {
				ctx.strokeStyle = color
				ctx.globalAlpha = alpha
				ctx.beginPath()
				for (let i = 0; i <= steps * lineIn; i++) {
					const u = i / steps
					const x = px0 + span * u
					if (i === 0) ctx.moveTo(x, fn(u))
					else ctx.lineTo(x, fn(u))
				}
				ctx.stroke()
			}
			if (lineIn > 0) {
				curve(statY, INK, 0.4)
				ctx.lineWidth = 2
				curve(dynY, BRAND, 0.9)
				ctx.lineWidth = 1
			}

			if (lineIn >= 1) {
				label(
					'régua estática',
					px1 - 4,
					statY(1) + 16,
					INK,
					0.6,
					'right'
				)
				label(
					'política dinâmica',
					px1 - 4,
					dynY(1) - 10,
					BRAND,
					1,
					'right'
				)
				/* A distância entre as curvas é a perda evitada — só vale a
				   pena nomear quando o estresse abre o vão. */
				if (shown > 0.45) {
					const u = 0.78
					const x = px0 + span * u
					label(
						'perda evitada',
						x,
						(statY(u) + dynY(u)) / 2 + 3,
						BRAND,
						clamp01((shown - 0.45) / 0.25) * 0.95
					)
				}
			}

			canvas.style.cursor = dragging
				? 'grabbing'
				: hoverKnob
					? 'grab'
					: 'default'
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
