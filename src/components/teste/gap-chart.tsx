'use client'

import {
	BRAND,
	ChartCanvas,
	clamp01,
	type DrawArgs,
	easeOutCubic,
	HALO,
	INK
} from '@/components/credito/chart-canvas'
import { cn } from '@/lib/utils'

/* Curvas normalizadas (x, y ∈ 0..1): a exponencial dispara enquanto a
   linear rasteja — o gap entre elas é o assunto do gráfico. */
const K = 3.4
const yExp = (x: number) => (Math.exp(K * x) - 1) / (Math.exp(K) - 1)
const yLin = (x: number) => 0.22 * x

/**
 * Gráfico ilustrativo (referência: docs/image copy 2.png): complexidade ×
 * tempo. As duas curvas nascem juntas e se desenham progressivamente; no
 * fim, uma seta de duas pontas marca o gap entre elas. Hover: crosshair
 * com o multiplicador entre as curvas naquele ponto do tempo.
 */
function drawGap({ ctx, w, h, t, reduced, pointer, label }: DrawArgs) {
	const m = { l: 56, r: 128, t: 32, b: 48 }
	const x0 = m.l
	const x1 = w - m.r
	const yBase = h - m.b
	const yTop = m.t
	const plotH = yBase - yTop

	const toX = (x: number) => x0 + (x1 - x0) * x
	const toY = (y: number) => yBase - plotH * (0.04 + 0.88 * y)

	/* Relógio da entrada: eixos → curvas → seta. */
	const axisP = reduced ? 1 : easeOutCubic(clamp01(t / 0.7))
	const curveP = reduced ? 1 : easeOutCubic(clamp01((t - 0.35) / 1.9))
	const arrowP = reduced ? 1 : easeOutCubic(clamp01((t - 2.4) / 0.7))

	/* Eixos + ticks tracejados, recessivos. */
	ctx.strokeStyle = INK
	ctx.globalAlpha = 0.3 * axisP
	ctx.lineWidth = 1
	ctx.beginPath()
	ctx.moveTo(x0, yBase)
	ctx.lineTo(x0 + (x1 + 24 - x0) * axisP, yBase)
	ctx.stroke()
	ctx.beginPath()
	ctx.moveTo(x0, yBase)
	ctx.lineTo(x0, yBase - (yBase - yTop + 8) * axisP)
	ctx.stroke()

	ctx.setLineDash([2, 4])
	for (let i = 1; i <= 8; i++) {
		const tickX = toX(i / 8)
		ctx.beginPath()
		ctx.moveTo(tickX, yBase)
		ctx.lineTo(tickX, yBase + 6)
		ctx.stroke()
	}
	for (let i = 1; i <= 6; i++) {
		const tickY = yBase - (plotH / 6) * i
		ctx.beginPath()
		ctx.moveTo(x0 - 6, tickY)
		ctx.lineTo(x0, tickY)
		ctx.stroke()
	}
	ctx.setLineDash([])
	ctx.globalAlpha = 1

	label('Tempo', (x0 + x1) / 2, h - 16, 'center', INK, 0.55 * axisP)
	ctx.save()
	ctx.translate(24, (yTop + yBase) / 2)
	ctx.rotate(-Math.PI / 2)
	label('Complexidade', 0, 0, 'center', INK, 0.55 * axisP)
	ctx.restore()

	/* Curvas em desenho progressivo. */
	const drawCurve = (fn: (x: number) => number, color: string) => {
		if (curveP <= 0) return
		ctx.strokeStyle = color
		ctx.lineWidth = 2
		ctx.beginPath()
		const steps = 90
		for (let i = 0; i <= steps * curveP; i++) {
			const x = i / steps
			const px = toX(x)
			const py = toY(fn(x))
			if (i === 0) ctx.moveTo(px, py)
			else ctx.lineTo(px, py)
		}
		ctx.stroke()
		/* Ponto na cabeça da curva enquanto desenha; fixa no fim. */
		const headX = curveP
		ctx.fillStyle = color
		ctx.beginPath()
		ctx.arc(toX(headX), toY(fn(headX)), 3.5, 0, Math.PI * 2)
		ctx.fill()
	}
	drawCurve(yExp, BRAND)
	drawCurve(yLin, INK)

	/* Labels diretas das séries (identidade nunca só pela cor). */
	const labelAlpha = clamp01((curveP - 0.85) / 0.15)
	label(
		'Complexidade da decisão',
		toX(1) - 8,
		toY(yExp(1)) - 12,
		'right',
		BRAND,
		labelAlpha
	)
	label(
		'Capacidade dos modelos estáticos',
		toX(1) - 8,
		toY(yLin(1)) + 18,
		'right',
		INK,
		0.7 * labelAlpha
	)

	/* Seta de duas pontas: o gap. Cresce a partir do centro. */
	if (arrowP > 0) {
		const ax = x1 + 40
		const topY = toY(yExp(1))
		const botY = toY(yLin(1))
		const midY = (topY + botY) / 2
		const halfSpan = ((botY - topY) / 2 - 6) * arrowP

		ctx.strokeStyle = INK
		ctx.fillStyle = INK
		ctx.globalAlpha = arrowP
		ctx.lineWidth = 1.5
		ctx.beginPath()
		ctx.moveTo(ax, midY - halfSpan)
		ctx.lineTo(ax, midY + halfSpan)
		ctx.stroke()
		const head = (dir: 1 | -1) => {
			const tipY = midY + halfSpan * dir
			ctx.beginPath()
			ctx.moveTo(ax, tipY + 7 * dir)
			ctx.lineTo(ax - 4.5, tipY)
			ctx.lineTo(ax + 4.5, tipY)
			ctx.closePath()
			ctx.fill()
		}
		head(-1)
		head(1)

		/* Chip "gap" como na referência: retângulo tinta, texto no halo. */
		const mono = ctx.font
		ctx.font = mono
		const chipW = 46
		const chipH = 18
		ctx.fillRect(ax + 12, midY - chipH / 2, chipW, chipH)
		label('gap', ax + 12 + chipW / 2, midY + 3.5, 'center', HALO, arrowP)
		ctx.globalAlpha = 1
	}

	/* Hover: crosshair + multiplicador entre as curvas no ponto. */
	if (pointer.active && curveP >= 1) {
		const hx = clamp01((pointer.x - x0) / (x1 - x0))
		if (pointer.x >= x0 - 8 && pointer.x <= x1 + 8 && hx > 0.02) {
			const px = toX(hx)
			ctx.strokeStyle = INK
			ctx.globalAlpha = 0.25
			ctx.setLineDash([3, 4])
			ctx.beginPath()
			ctx.moveTo(px, yBase)
			ctx.lineTo(px, yTop)
			ctx.stroke()
			ctx.setLineDash([])
			ctx.globalAlpha = 1

			const pts: Array<[number, string]> = [
				[yExp(hx), BRAND],
				[yLin(hx), INK]
			]
			for (const [v, color] of pts) {
				ctx.fillStyle = color
				ctx.beginPath()
				ctx.arc(px, toY(v), 4, 0, Math.PI * 2)
				ctx.fill()
				/* Anel da cor do fundo separa o marcador da curva. */
				ctx.strokeStyle = HALO
				ctx.lineWidth = 2
				ctx.stroke()
			}

			const ratio = yExp(hx) / Math.max(yLin(hx), 0.001)
			label(
				`${ratio.toFixed(1)}× o gap`,
				px,
				toY(yExp(hx)) - 14,
				'center',
				INK,
				0.9
			)
		}
	}
}

export function GapChart({ className }: { className?: string }) {
	return <ChartCanvas draw={drawGap} className={cn('h-full', className)} />
}
