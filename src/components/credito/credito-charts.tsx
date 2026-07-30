'use client'

import {
	BRAND,
	ChartCanvas,
	clamp01,
	DrawArgs,
	easeOutCubic,
	INK,
	RED
} from '@/components/credito/chart-canvas'

/* Gráficos ilustrativos de /credito — cada um conta um conceito do plano
   de trabalho em desenho técnico: tinta para o mundo estático, azul da
   marca para a política dinâmica. Nada aqui é dado real. */

/* PRNG determinístico — pontos estáveis entre frames e renders. */
function mulberry(seed: number) {
	let a = seed
	return () => {
		a |= 0
		a = (a + 0x6d2b79f5) | 0
		let x = Math.imul(a ^ (a >>> 15), 1 | a)
		x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
		return ((x ^ (x >>> 14)) >>> 0) / 4294967296
	}
}

/* 1 — Ponto cego: quem passa do corte vira dado; os rejeitados somem.
   O aprendizado ativo varre a região invisível e revela bons perfis. */
function drawBlindSpot({ ctx, w, h, t, wave, reduced, label }: DrawArgs) {
	const rand = mulberry(7)
	const cutX = w * 0.44
	const dots: Array<{ x: number; y: number; good: boolean }> = []
	for (let i = 0; i < 64; i++) {
		dots.push({
			x: w * (0.08 + rand() * 0.84),
			y: h * (0.16 + rand() * 0.62),
			good: rand() > 0.45
		})
	}

	/* Linha do corte. */
	const cutIn = easeOutCubic(clamp01(t / 0.6))
	ctx.strokeStyle = INK
	ctx.globalAlpha = 0.4 * cutIn
	ctx.setLineDash([3, 6])
	ctx.beginPath()
	ctx.moveTo(cutX, h * 0.08)
	ctx.lineTo(cutX, h * 0.84)
	ctx.stroke()
	ctx.setLineDash([])

	/* Varredura circular do aprendizado ativo, no lado rejeitado. */
	const scanIn = easeOutCubic(clamp01((t - 1.1) / 0.6))
	const scanX = w * 0.7 + (reduced ? 0 : Math.sin(wave * 0.5) * w * 0.16)
	const scanY = h * 0.46 + (reduced ? 0 : Math.cos(wave * 0.4) * h * 0.16)
	const scanR = Math.min(w, h) * 0.2

	const dotIn = easeOutCubic(clamp01((t - 0.4) / 0.9))
	dots.forEach((dot, i) => {
		const appear = clamp01(dotIn * 64 - i * 0.6)
		if (appear <= 0) return
		const rejected = dot.x > cutX
		const inScan =
			rejected &&
			scanIn > 0 &&
			(dot.x - scanX) ** 2 + (dot.y - scanY) ** 2 < scanR ** 2
		if (inScan && dot.good) {
			ctx.fillStyle = BRAND
			ctx.globalAlpha = 0.9 * appear
		} else {
			ctx.fillStyle = INK
			ctx.globalAlpha = (rejected ? 0.12 : 0.45) * appear
		}
		ctx.beginPath()
		ctx.arc(dot.x, dot.y, 2.5, 0, Math.PI * 2)
		ctx.fill()
	})

	if (scanIn > 0) {
		ctx.strokeStyle = BRAND
		ctx.globalAlpha = 0.5 * scanIn
		ctx.beginPath()
		ctx.arc(scanX, scanY, scanR, 0, Math.PI * 2)
		ctx.stroke()
	}

	label('aprovados', cutX - 12, h * 0.93, 'right', INK, 0.6 * cutIn)
	label(
		'rejeitados — sem dados',
		cutX + 12,
		h * 0.93,
		'left',
		INK,
		0.45 * cutIn
	)
	if (scanIn > 0.6)
		label('exploração', scanX, scanY - scanR - 8, 'center', BRAND, scanIn)
	ctx.globalAlpha = 1
}

/* 3 — Retroalimentação: decisão → carteira → dados → modelo → decisão.
   O ciclo gira e aperta: cada volta reforça o viés da anterior. */
function drawLoop({ ctx, w, h, t, wave, reduced, label }: DrawArgs) {
	const cx = w / 2
	const cy = h * 0.47
	const R = Math.min(w, h) * 0.3
	const names = ['decisão', 'carteira', 'dados', 'modelo']
	const start = -Math.PI / 2

	/* Espiral que aperta — o viés se reforçando. */
	const spiralIn = easeOutCubic(clamp01((t - 0.9) / 1.1))
	if (spiralIn > 0) {
		ctx.strokeStyle = INK
		ctx.globalAlpha = 0.18 * spiralIn
		ctx.beginPath()
		const turns = 2.6
		const steps = 140
		for (let i = 0; i <= steps * spiralIn; i++) {
			const u = i / steps
			const ang = start + u * turns * Math.PI * 2
			const r = R * 0.82 * (1 - u * 0.82)
			const x = cx + Math.cos(ang) * r
			const y = cy + Math.sin(ang) * r
			if (i === 0) ctx.moveTo(x, y)
			else ctx.lineTo(x, y)
		}
		ctx.stroke()
	}

	/* Nós do ciclo. */
	names.forEach((name, i) => {
		const nodeIn = easeOutCubic(clamp01((t - i * 0.18) / 0.6))
		if (nodeIn <= 0) return
		const ang = start + (i / names.length) * Math.PI * 2
		const x = cx + Math.cos(ang) * R
		const y = cy + Math.sin(ang) * R
		ctx.fillStyle = INK
		ctx.globalAlpha = 0.7 * nodeIn
		ctx.beginPath()
		ctx.arc(x, y, 3, 0, Math.PI * 2)
		ctx.fill()
		label(
			name,
			x,
			y + (Math.sin(ang) > 0.3 ? 18 : -10),
			'center',
			INK,
			0.65 * nodeIn
		)

		/* Arco até o próximo nó. */
		const arcIn = easeOutCubic(clamp01((t - 0.3 - i * 0.18) / 0.6))
		if (arcIn > 0) {
			const a0 = ang + 0.28
			const a1 = ang + (Math.PI * 2) / names.length - 0.28
			ctx.strokeStyle = INK
			ctx.globalAlpha = 0.35 * arcIn
			ctx.beginPath()
			ctx.arc(cx, cy, R, a0, a0 + (a1 - a0) * arcIn)
			ctx.stroke()
			/* Ponta da seta. */
			if (arcIn > 0.95) {
				const tip = a1
				const tx = cx + Math.cos(tip) * R
				const ty = cy + Math.sin(tip) * R
				const dir = tip + Math.PI / 2
				ctx.beginPath()
				ctx.moveTo(tx, ty)
				ctx.lineTo(
					tx - Math.cos(dir - 0.5) * 7,
					ty - Math.sin(dir - 0.5) * 7
				)
				ctx.moveTo(tx, ty)
				ctx.lineTo(
					tx - Math.cos(dir + 0.5) * 7,
					ty - Math.sin(dir + 0.5) * 7
				)
				ctx.stroke()
			}
		}
	})

	/* Pulso girando no ciclo. */
	const pulseIn = easeOutCubic(clamp01((t - 1.2) / 0.5))
	if (pulseIn > 0) {
		const ang = start + (reduced ? 0.8 : wave * 0.9)
		ctx.fillStyle = RED
		ctx.globalAlpha = 0.8 * pulseIn
		ctx.beginPath()
		ctx.arc(
			cx + Math.cos(ang) * R,
			cy + Math.sin(ang) * R,
			3.5,
			0,
			Math.PI * 2
		)
		ctx.fill()
	}

	label(
		'o viés de cada volta alimenta a próxima',
		cx,
		h * 0.95,
		'center',
		INK,
		0.5 * easeOutCubic(clamp01((t - 1.5) / 0.5))
	)
	ctx.globalAlpha = 1
}

/* 4 — Dados restritos: a matriz de atributos do birô é esparsa; as
   colunas além dela ficam em aberto. */
function drawSparse({ ctx, w, h, t, wave, reduced, label }: DrawArgs) {
	const rand = mulberry(23)
	const cols = 12
	const rows = 7
	const x0 = w * 0.1
	const y0 = h * 0.14
	const cw = (w * 0.8) / cols
	const ch = (h * 0.6) / rows
	const known = 5 /* colunas cobertas pelo birô */

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const i = r * cols + c
			const cellIn = easeOutCubic(clamp01(t * 2.4 - i * 0.02))
			if (cellIn <= 0) continue
			const x = x0 + c * cw
			const y = y0 + r * ch
			const filled = c < known ? rand() > 0.25 : rand() > 0.88
			ctx.strokeStyle = INK
			ctx.globalAlpha = 0.14 * cellIn
			ctx.strokeRect(x + 1.5, y + 1.5, cw - 3, ch - 3)
			if (filled) {
				const beyond = c >= known
				const blink = reduced
					? 1
					: 0.75 + Math.sin(wave * 1.4 + i) * 0.25
				ctx.fillStyle = beyond ? BRAND : INK
				ctx.globalAlpha = (beyond ? 0.8 * blink : 0.4) * cellIn
				ctx.fillRect(x + 4, y + 4, cw - 8, ch - 8)
			}
		}
	}

	/* Fronteira do birô. */
	const lineIn = easeOutCubic(clamp01((t - 0.7) / 0.5))
	if (lineIn > 0) {
		const x = x0 + known * cw
		ctx.strokeStyle = INK
		ctx.globalAlpha = 0.45 * lineIn
		ctx.setLineDash([3, 6])
		ctx.beginPath()
		ctx.moveTo(x, y0 - h * 0.04)
		ctx.lineTo(x, y0 + rows * ch + h * 0.04)
		ctx.stroke()
		ctx.setLineDash([])
		label(
			'birô',
			x0 + (known * cw) / 2,
			h * 0.88,
			'center',
			INK,
			lineIn * 0.6
		)
		label(
			'fontes não estruturadas',
			x0 + (known + (cols - known) / 2) * cw,
			h * 0.88,
			'center',
			BRAND,
			lineIn * 0.8
		)
	}
	ctx.globalAlpha = 1
}

/* 5 — Enriquecimento: fontes heterogêneas e ruidosas atravessam o TFM e
   saem como uma representação densa. Interativo: a fonte mais próxima do
   ponteiro acende e engrossa o sinal. */
function drawEnrichment({
	ctx,
	w,
	h,
	t,
	wave,
	reduced,
	pointer,
	label
}: DrawArgs) {
	const midY = h * 0.5
	const xIn = w * 0.06
	const xCore = w * 0.5
	const xOut = w * 0.94
	const lanes = [-h * 0.24, 0, h * 0.24]
	const names = ['cadastro', 'transações', 'fontes externas']

	/* Fonte em foco: a mais próxima do ponteiro (só no lado das entradas). */
	const focus =
		pointer.active && pointer.x < xCore + 26
			? lanes.reduce(
					(best, offset, i) =>
						Math.abs(midY + offset - pointer.y) <
						Math.abs(midY + lanes[best] - pointer.y)
							? i
							: best,
					0
				)
			: -1

	/* Sinais ruidosos convergindo para o núcleo. */
	lanes.forEach((offset, i) => {
		const laneIn = easeOutCubic(clamp01((t - i * 0.15) / 0.9))
		if (laneIn <= 0) return
		const focused = i === focus
		ctx.strokeStyle = focused ? BRAND : INK
		ctx.globalAlpha = focused ? 0.85 : 0.3
		ctx.lineWidth = focused ? 2 : 1
		ctx.beginPath()
		const spanX = (xCore - 18 - xIn) * laneIn
		for (let x = xIn; x <= xIn + spanX; x += 2) {
			const u = (x - xIn) / (xCore - xIn)
			const y0 = midY + offset * (1 - u * u)
			const amp = (focused ? 10 : 7) * Math.sin(u * Math.PI)
			const y =
				y0 +
				Math.sin(
					x * 0.13 + (reduced ? 0 : wave * (focused ? 3 : 2)) + i * 9
				) *
					amp
			if (x === xIn) ctx.moveTo(x, y)
			else ctx.lineTo(x, y)
		}
		ctx.stroke()
		ctx.lineWidth = 1
		label(
			names[i],
			xIn + 2,
			midY + offset * 0.98 + (offset >= 0 ? 24 : -16),
			'left',
			focused ? BRAND : 'rgba(27,26,21,0.55)',
			focused ? 1 : laneIn * 0.8
		)
	})

	/* Núcleo TFM: losango girando. */
	const core = easeOutCubic(clamp01((t - 0.7) / 0.5))
	if (core > 0) {
		const s = 15 * core
		ctx.save()
		ctx.translate(xCore, midY)
		ctx.rotate(reduced ? Math.PI / 4 : wave * 0.4)
		ctx.fillStyle = BRAND
		ctx.globalAlpha = 0.9 * core
		ctx.fillRect(-s / 2, -s / 2, s, s)
		ctx.restore()
		ctx.strokeStyle = BRAND
		ctx.globalAlpha = 0.3 * core
		ctx.beginPath()
		ctx.arc(xCore, midY, 26, 0, Math.PI * 2)
		ctx.stroke()
		label('tfm', xCore, midY + 44, 'center', BRAND, core)
	}

	/* Saída: barra de embedding em segmentos. */
	const outIn = easeOutCubic(clamp01((t - 1.1) / 0.8))
	if (outIn > 0) {
		const segs = 10
		const segW = (xOut - xCore - 40) / segs
		for (let i = 0; i < segs; i++) {
			const segIn = clamp01(outIn * segs - i)
			if (segIn <= 0) continue
			const x = xCore + 40 + i * segW
			const glow = reduced ? 0.7 : 0.55 + Math.sin(wave * 1.6 + i) * 0.3
			ctx.fillStyle = BRAND
			ctx.globalAlpha = glow * segIn
			ctx.fillRect(x, midY - 5, segW * 0.7, 10)
		}
		label(
			'representação densa',
			xOut,
			midY - 18,
			'right',
			BRAND,
			clamp01((outIn - 0.6) / 0.4)
		)
	}
	ctx.globalAlpha = 1
}

/* 7 — Horizonte: retorno acumulado — o score estático colhe cedo e
   estagna; a política dinâmica compõe valor ao longo do tempo.
   Interativo: o ponteiro percorre o tempo e mede a diferença. */
function drawHorizon({ ctx, w, h, t, pointer, label }: DrawArgs) {
	const x0 = w * 0.1
	const y0 = h * 0.82
	const x1 = w * 0.92
	const span = x1 - x0

	const axis = easeOutCubic(clamp01(t / 0.5))
	ctx.strokeStyle = INK
	ctx.globalAlpha = 0.25 * axis
	ctx.beginPath()
	ctx.moveTo(x0, h * 0.12)
	ctx.lineTo(x0, y0)
	ctx.lineTo(x1, y0)
	ctx.stroke()

	const staticY = (u: number) => y0 - h * 0.34 * (1 - Math.exp(-u * 4))
	const dynY = (u: number) => y0 - h * 0.62 * u ** 1.6

	/* Com o ponteiro sobre o gráfico, ele passa a controlar o tempo. */
	const enterIn = easeOutCubic(clamp01((t - 0.3) / 1.4))
	const lineIn = pointer.active
		? clamp01((pointer.x - x0) / span) * enterIn
		: enterIn

	/* Área entre as curvas: valor deixado na mesa. */
	if (lineIn > 0.35) {
		const fillIn = clamp01((lineIn - 0.35) / 0.65)
		ctx.fillStyle = BRAND
		ctx.globalAlpha = 0.07 * fillIn
		ctx.beginPath()
		const steps = 60
		for (let i = 0; i <= steps * lineIn; i++) {
			const u = i / steps
			const x = x0 + span * u
			if (i === 0) ctx.moveTo(x, dynY(u))
			else ctx.lineTo(x, dynY(u))
		}
		for (let i = Math.floor(steps * lineIn); i >= 0; i--) {
			const u = i / steps
			ctx.lineTo(x0 + span * u, staticY(u))
		}
		ctx.closePath()
		ctx.fill()
	}

	/* Curvas. */
	const curve = (fn: (u: number) => number, color: string, alpha: number) => {
		ctx.strokeStyle = color
		ctx.globalAlpha = alpha
		ctx.beginPath()
		const steps = 60
		for (let i = 0; i <= steps * lineIn; i++) {
			const u = i / steps
			const x = x0 + span * u
			if (i === 0) ctx.moveTo(x, fn(u))
			else ctx.lineTo(x, fn(u))
		}
		ctx.stroke()
	}
	if (lineIn > 0) {
		curve(staticY, INK, 0.4)
		ctx.lineWidth = 2
		curve(dynY, BRAND, 0.9)
		ctx.lineWidth = 1
	}

	/* Cursor do tempo: guia vertical + pontas das curvas + diferença. */
	if (pointer.active && lineIn > 0.02) {
		const u = lineIn
		const x = x0 + span * u
		ctx.strokeStyle = INK
		ctx.globalAlpha = 0.2
		ctx.setLineDash([3, 6])
		ctx.beginPath()
		ctx.moveTo(x, h * 0.12)
		ctx.lineTo(x, y0)
		ctx.stroke()
		ctx.setLineDash([])

		ctx.fillStyle = INK
		ctx.globalAlpha = 0.5
		ctx.beginPath()
		ctx.arc(x, staticY(u), 3, 0, Math.PI * 2)
		ctx.fill()
		ctx.fillStyle = BRAND
		ctx.globalAlpha = 1
		ctx.beginPath()
		ctx.arc(x, dynY(u), 3.5, 0, Math.PI * 2)
		ctx.fill()

		/* Diferença entre as políticas naquele ponto do tempo. */
		if (staticY(u) - dynY(u) > 14) {
			ctx.strokeStyle = BRAND
			ctx.globalAlpha = 0.5
			ctx.beginPath()
			ctx.moveTo(x, dynY(u) + 7)
			ctx.lineTo(x, staticY(u) - 7)
			ctx.stroke()
			label(
				'valor deixado na mesa',
				x - 8,
				(staticY(u) + dynY(u)) / 2 + 3,
				'right',
				BRAND,
				0.9
			)
		}
	}

	if (lineIn >= 1) {
		label('score estático', x1 - 4, staticY(1) + 16, 'right', INK, 0.6)
		label('política dinâmica', x1 - 4, dynY(1) - 10, 'right', BRAND, 1)
	}
	label('tempo', x1, y0 + 16, 'right', 'rgba(27,26,21,0.45)', axis * 0.8)
	label(
		'retorno acumulado',
		x0,
		h * 0.08,
		'left',
		'rgba(27,26,21,0.45)',
		axis * 0.8
	)
	ctx.globalAlpha = 1
}

type ChartProps = { className?: string }

export function ChartBlindSpot({ className }: ChartProps) {
	return <ChartCanvas draw={drawBlindSpot} className={className} />
}
export function ChartLoop({ className }: ChartProps) {
	return <ChartCanvas draw={drawLoop} className={className} />
}
export function ChartSparse({ className }: ChartProps) {
	return <ChartCanvas draw={drawSparse} className={className} />
}
export function ChartEnrichment({ className }: ChartProps) {
	return <ChartCanvas draw={drawEnrichment} className={className} />
}
export function ChartHorizon({ className }: ChartProps) {
	return <ChartCanvas draw={drawHorizon} className={className} />
}
