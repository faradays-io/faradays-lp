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

/* 5 — Tabelas → representação: fontes tabulares heterogêneas e esparsas
   atravessam o TFM e saem como uma representação densa — as lacunas são
   preenchidas por priors (azul pulsante). As arestas chegam ao nó TFM em
   "S" (cúbica com controles no eixo horizontal das pontas, o mesmo desenho
   do grafo de sistemas da home, deitado). Interativo: hover numa fonte
   acende as posições que ela informa; o nó TFM pode ser arrastado — as
   arestas o seguem e ele volta por mola. */

/* Fontes: grade (cols×rows) + máscara de células preenchidas. */
const TABLES = [
	{ name: 'birô', cols: 3, rows: 4, seed: 3, density: 0.55 },
	{ name: 'transações', cols: 4, rows: 4, seed: 11, density: 0.6 },
	{ name: 'fontes externas', cols: 2, rows: 4, seed: 19, density: 0.4 }
]
/* Representação de saída: 12 posições — cada uma vem de uma fonte (0-2)
   ou é inferida por prior (-1). */
const REPR: number[] = [0, 1, -1, 2, 0, -1, 1, 1, -1, 0, 2, -1]

/* O "S" horizontal: controles no eixo x das pontas — a curva sai reta,
   deita no meio e entra reta no nó (ROOT_BOW do grafo da home). */
const BOW = 0.55
const cubic = (
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

/* Estado persistente do nó TFM (px) — arrasto + mola de retorno. */
const TFM_HOME = { x: 0.5, y: 0.42 }
const tfm = { x: NaN, y: NaN, vx: 0, vy: 0, dragging: false, w: 0, h: 0 }

function drawTables({ ctx, w, h, t, wave, reduced, pointer, label }: DrawArgs) {
	/* Rehoma no primeiro frame e em resize. */
	if (Number.isNaN(tfm.x) || tfm.w !== w || tfm.h !== h) {
		tfm.x = TFM_HOME.x * w
		tfm.y = TFM_HOME.y * h
		tfm.vx = 0
		tfm.vy = 0
		tfm.w = w
		tfm.h = h
	}

	/* Interação com o nó: hover engorda, down arrasta, soltar volta. */
	const overTfm =
		pointer.active && Math.hypot(pointer.x - tfm.x, pointer.y - tfm.y) < 28
	if (pointer.down && (tfm.dragging || overTfm)) tfm.dragging = true
	if (!pointer.down) tfm.dragging = false

	if (tfm.dragging) {
		tfm.x += (pointer.x - tfm.x) * 0.5
		tfm.y += (pointer.y - tfm.y) * 0.5
		tfm.vx = 0
		tfm.vy = 0
	} else {
		/* Mola para casa, com flutuação leve (como o grafo da home). */
		const hx = TFM_HOME.x * w + (reduced ? 0 : Math.sin(wave * 0.6) * 3)
		const hy = TFM_HOME.y * h + (reduced ? 0 : Math.cos(wave * 0.5) * 3)
		tfm.vx = (tfm.vx + (hx - tfm.x) * 0.025) * 0.88
		tfm.vy = (tfm.vy + (hy - tfm.y) * 0.025) * 0.88
		tfm.x += tfm.vx
		tfm.y += tfm.vy
	}
	const coreX = tfm.x
	const coreY = tfm.y
	const tfmActive = tfm.dragging || overTfm

	/* Layout das três tabelas à esquerda, empilhadas. */
	const cell = Math.min(w, h) * 0.055
	const tableX = w * 0.07
	const tops = [h * 0.06, h * 0.38, h * 0.7]

	/* Fonte em foco: tabela sob o ponteiro (não durante o arrasto). */
	let focus = -1
	if (pointer.active && !tfm.dragging) {
		TABLES.forEach((table, i) => {
			const tw = table.cols * cell
			const th = table.rows * cell
			if (
				pointer.x >= tableX - 8 &&
				pointer.x <= tableX + tw + 8 &&
				pointer.y >= tops[i] - 8 &&
				pointer.y <= tops[i] + th + 8
			)
				focus = i
		})
	}

	TABLES.forEach((table, i) => {
		const rand = mulberry(table.seed)
		const tableIn = easeOutCubic(clamp01((t - i * 0.15) / 0.7))
		if (tableIn <= 0) return
		const focused = i === focus
		const top = tops[i]
		for (let r = 0; r < table.rows; r++) {
			for (let c = 0; c < table.cols; c++) {
				const k = r * table.cols + c
				const cellIn = clamp01(tableIn * (table.rows * table.cols) - k)
				if (cellIn <= 0) continue
				const x = tableX + c * cell
				const y = top + r * cell
				const filled = rand() < table.density
				ctx.strokeStyle = focused ? BRAND : INK
				ctx.globalAlpha = (focused ? 0.5 : 0.25) * cellIn
				ctx.strokeRect(x + 1, y + 1, cell - 2, cell - 2)
				if (filled) {
					ctx.fillStyle = focused ? BRAND : INK
					ctx.globalAlpha = (focused ? 0.75 : 0.4) * cellIn
					ctx.fillRect(x + 3, y + 3, cell - 6, cell - 6)
				}
			}
		}
		label(
			table.name,
			tableX,
			top + table.rows * cell + 14,
			'left',
			focused ? BRAND : 'rgba(27,26,21,0.55)',
			tableIn * (focused ? 1 : 0.8)
		)

		/* Aresta em "S" da tabela até o nó TFM. */
		const flowIn = easeOutCubic(clamp01((t - 0.5 - i * 0.15) / 0.6))
		if (flowIn > 0) {
			const sx = tableX + table.cols * cell + 6
			const sy = top + (table.rows * cell) / 2
			const bx = coreX - 24
			const by = coreY
			const span = bx - sx
			const c1x = sx + span * BOW
			const c1y = sy
			const c2x = bx - span * BOW
			const c2y = by

			const touched = focus < 0 || i === focus || tfmActive
			const emphasis = touched ? 1 : 0.25
			ctx.strokeStyle = i === focus || tfmActive ? BRAND : INK
			ctx.globalAlpha =
				(i === focus || tfmActive ? 0.6 : 0.28) * flowIn * emphasis
			ctx.beginPath()
			ctx.moveTo(sx, sy)
			const steps = 32
			for (let sStep = 1; sStep <= steps * flowIn; sStep++) {
				const p = cubic(
					sStep / steps,
					sx,
					sy,
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

			/* Pulso percorrendo a aresta. */
			if (flowIn >= 1 && !reduced) {
				const u = (wave * 0.16 + i * 0.31) % 1
				const p = cubic(u, sx, sy, c1x, c1y, c2x, c2y, bx, by)
				ctx.fillStyle = BRAND
				ctx.globalAlpha = 0.8 * emphasis
				ctx.beginPath()
				ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
				ctx.fill()
			}
		}
	})

	/* Núcleo TFM: losango girando, arrastável. */
	const core = easeOutCubic(clamp01((t - 0.8) / 0.5))
	if (core > 0) {
		if (tfmActive) {
			ctx.strokeStyle = BRAND
			ctx.globalAlpha = 0.35
			ctx.beginPath()
			ctx.arc(coreX, coreY, 34, 0, Math.PI * 2)
			ctx.stroke()
		}
		const s = (tfmActive ? 18 : 15) * core
		ctx.save()
		ctx.translate(coreX, coreY)
		ctx.rotate(reduced ? Math.PI / 4 : wave * 0.4)
		ctx.fillStyle = BRAND
		ctx.globalAlpha = 0.9 * core
		ctx.fillRect(-s / 2, -s / 2, s, s)
		ctx.restore()
		ctx.strokeStyle = BRAND
		ctx.globalAlpha = 0.3 * core
		ctx.beginPath()
		ctx.arc(coreX, coreY, 26, 0, Math.PI * 2)
		ctx.stroke()
		label('tfm', coreX, coreY + 44, 'center', BRAND, core)
	}

	/* Representação densa à direita: uma linha de células fixa; a aresta
	   de saída em "S" segue o nó. */
	const outIn = easeOutCubic(clamp01((t - 1.1) / 0.8))
	if (outIn > 0) {
		const segW = cell * 0.9
		const outX = w * 0.62
		const reprY = TFM_HOME.y * h
		const outY = reprY - segW / 2

		/* Aresta núcleo → representação, também em "S". */
		const sx = coreX + 24
		const bx = outX - 6
		const span = bx - sx
		ctx.strokeStyle = BRAND
		ctx.globalAlpha = 0.4 * outIn
		ctx.beginPath()
		ctx.moveTo(sx, coreY)
		const steps = 24
		for (let sStep = 1; sStep <= steps * outIn; sStep++) {
			const p = cubic(
				sStep / steps,
				sx,
				coreY,
				sx + span * BOW,
				coreY,
				bx - span * BOW,
				reprY,
				bx,
				reprY
			)
			ctx.lineTo(p.x, p.y)
		}
		ctx.stroke()

		REPR.forEach((source, i) => {
			const segIn = clamp01(outIn * REPR.length - i)
			if (segIn <= 0) return
			const x = outX + i * (segW + 2)
			if (x + segW > w * 0.97) return
			const isPrior = source === -1
			const fromFocus = focus >= 0 && source === focus
			const blink = reduced ? 0.75 : 0.6 + Math.sin(wave * 1.6 + i) * 0.25
			if (isPrior) {
				/* Inferida por prior: azul pulsante, contorno tracejado. */
				ctx.fillStyle = BRAND
				ctx.globalAlpha = 0.45 * blink * segIn
				ctx.fillRect(x, outY, segW, segW)
				ctx.setLineDash([2, 3])
				ctx.strokeStyle = BRAND
				ctx.globalAlpha = 0.7 * segIn
				ctx.strokeRect(x + 0.5, outY + 0.5, segW - 1, segW - 1)
				ctx.setLineDash([])
			} else {
				/* Com o TFM ativo, tudo acende; com uma fonte em foco, só a
				   contribuição dela. */
				ctx.fillStyle = fromFocus || tfmActive ? BRAND : INK
				ctx.globalAlpha =
					(fromFocus || tfmActive ? 0.9 : focus >= 0 ? 0.18 : 0.55) *
					segIn
				ctx.fillRect(x, outY, segW, segW)
			}
		})

		label(
			'representação densa',
			outX,
			outY - 12,
			'left',
			BRAND,
			clamp01((outIn - 0.6) / 0.4)
		)
		label(
			'tracejado = preenchido por prior',
			outX,
			outY + segW + 16,
			'left',
			'rgba(27,26,21,0.5)',
			clamp01((outIn - 0.8) / 0.2) * 0.9
		)
	}

	ctx.canvas.style.cursor = tfm.dragging
		? 'grabbing'
		: overTfm
			? 'grab'
			: 'default'
	ctx.globalAlpha = 1
}

/* 6 — Balanço da carteira (visão do cliente): o que a política dinâmica
   muda nos três números que importam — aprova mais (bons pagadores que o
   score rejeitava), perde menos (ação antes do atraso) e retorno maior no
   horizonte (LTV). Interativo: hover numa linha revela o porquê. */

const BALANCE_ROWS = [
	{
		name: 'aprovação',
		stat: 0.5,
		dyn: 0.78,
		delta: 'mais',
		note: 'bons pagadores que o score rejeitava'
	},
	{
		name: 'perdas',
		stat: 0.62,
		dyn: 0.3,
		delta: 'menos',
		note: 'deterioração antecipada, ação antes do atraso'
	},
	{
		name: 'retorno · ltv',
		stat: 0.42,
		dyn: 0.92,
		delta: 'maior',
		note: 'valor da relação no horizonte, não da parcela'
	}
]

function drawBalance({
	ctx,
	w,
	h,
	t,
	wave,
	reduced,
	pointer,
	label
}: DrawArgs) {
	const x0 = w * 0.26
	const maxLen = w * 0.56
	const rowYs = [h * 0.3, h * 0.55, h * 0.8]
	const gap = 9

	/* Legenda. */
	const legendIn = easeOutCubic(clamp01(t / 0.5))
	if (legendIn > 0) {
		ctx.strokeStyle = INK
		ctx.globalAlpha = 0.45 * legendIn
		ctx.lineWidth = 3
		ctx.beginPath()
		ctx.moveTo(x0, h * 0.08)
		ctx.lineTo(x0 + 18, h * 0.08)
		ctx.stroke()
		label(
			'score estático',
			x0 + 26,
			h * 0.08 + 3,
			'left',
			'rgba(27,26,21,0.6)',
			legendIn * 0.9
		)
		ctx.strokeStyle = BRAND
		ctx.globalAlpha = 0.9 * legendIn
		ctx.beginPath()
		ctx.moveTo(x0 + 140, h * 0.08)
		ctx.lineTo(x0 + 158, h * 0.08)
		ctx.stroke()
		ctx.lineWidth = 1
		label(
			'política dinâmica',
			x0 + 166,
			h * 0.08 + 3,
			'left',
			BRAND,
			legendIn
		)
	}

	/* Eixo. */
	ctx.strokeStyle = INK
	ctx.globalAlpha = 0.25 * legendIn
	ctx.beginPath()
	ctx.moveTo(x0, h * 0.18)
	ctx.lineTo(x0, h * 0.9)
	ctx.stroke()

	/* Linha em foco: a mais próxima do ponteiro. */
	let hot = -1
	if (pointer.active) {
		let best = h * 0.14
		rowYs.forEach((y, i) => {
			const d = Math.abs(y - pointer.y)
			if (d < best) {
				best = d
				hot = i
			}
		})
	}

	BALANCE_ROWS.forEach((row, i) => {
		const rowIn = easeOutCubic(clamp01((t - 0.25 - i * 0.18) / 0.8))
		if (rowIn <= 0) return
		const y = rowYs[i]
		const isHot = i === hot
		const dim = hot >= 0 && !isHot ? 0.45 : 1
		const bob = reduced || isHot ? 0 : Math.sin(wave * 0.8 + i * 2) * 1.2

		label(
			row.name,
			x0 - 12,
			y + 3,
			'right',
			isHot ? BRAND : 'rgba(27,26,21,0.6)',
			rowIn * dim
		)

		/* Barra do score estático (fina, tinta). */
		ctx.strokeStyle = INK
		ctx.globalAlpha = 0.3 * rowIn * dim
		ctx.lineWidth = 5
		ctx.lineCap = 'round'
		ctx.beginPath()
		ctx.moveTo(x0, y - gap + bob)
		ctx.lineTo(x0 + row.stat * maxLen * rowIn, y - gap + bob)
		ctx.stroke()

		/* Barra da política dinâmica (grossa, azul) — entra depois. */
		const dynIn = easeOutCubic(clamp01((t - 0.55 - i * 0.18) / 0.8))
		if (dynIn > 0) {
			const len = row.dyn * maxLen * dynIn
			ctx.strokeStyle = BRAND
			ctx.globalAlpha = (isHot ? 1 : 0.85) * dynIn * dim
			ctx.lineWidth = 7
			ctx.beginPath()
			ctx.moveTo(x0, y + gap + bob)
			ctx.lineTo(x0 + len, y + gap + bob)
			ctx.stroke()

			/* Marca da referência estática sobre a barra dinâmica: a
			   distância entre as duas é o ganho (ou a perda evitada). */
			if (dynIn >= 1) {
				const refX = x0 + row.stat * maxLen
				ctx.lineWidth = 1
				ctx.strokeStyle = INK
				ctx.globalAlpha = 0.45 * dim
				ctx.setLineDash([2, 4])
				ctx.beginPath()
				ctx.moveTo(refX, y - gap - 7 + bob)
				ctx.lineTo(refX, y + gap + 7 + bob)
				ctx.stroke()
				ctx.setLineDash([])
				label(
					row.delta,
					x0 + len + 10,
					y + gap + 3 + bob,
					'left',
					BRAND,
					dynIn * dim
				)
			}
		}
		ctx.lineWidth = 1
		ctx.lineCap = 'butt'

		/* O porquê, no hover. */
		if (isHot && rowIn >= 1)
			label(row.note, x0, y + gap + 22, 'left', 'rgba(27,26,21,0.55)', 1)
	})
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
export function ChartTables({ className }: ChartProps) {
	return <ChartCanvas draw={drawTables} className={className} />
}
export function ChartBalance({ className }: ChartProps) {
	return <ChartCanvas draw={drawBalance} className={className} />
}
