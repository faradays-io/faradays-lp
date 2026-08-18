'use client'

import { useEffect, useRef } from 'react'

import { useLang } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

/* Gráfico das features — quatro figuras distintas, desenhadas em canvas
   sem fundo (direto sobre a página):
   0. Cotações — corrida de barras de preço, a menor vence em azul;
   1. Documentos — anéis concêntricos de validade, o crítico em azul;
   2. Atendimento — ruído que atravessa o motor e sai resposta limpa;
   3. Visão — radar da operação varrendo os blips dos módulos. */

const INK = '#1b1a15'
const BRAND = '#0065e0'
const CROSS = '#d93025'
const HALO = '#f4f4f4'

const easeOutCubic = (v: number) => 1 - Math.pow(1 - v, 3)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/* Rótulos desenhados no canvas — chegam às cenas via DrawArgs.t9n (o loop
   de RAF lê o idioma corrente por ref, sem recriar o efeito). */
const GRAPHIC_COPY = {
	pt: {
		suppA: 'Forn A',
		suppB: 'Forn B',
		suppC: 'Forn C',
		valueA: '$ 1.240',
		valueB: '$ 1.198',
		valueC: '$ 1.150',
		bestPrice: 'Melhor preço',
		coaExpires: 'COA · vence em 12d',
		validityCaption: 'validade por documento',
		question: 'pergunta',
		price: 'R$ 8,90/kg',
		radarOrders: 'Pedidos',
		radarDocs: 'Docs',
		radarInvoices: 'Boletos',
		radarPrices: 'Preços',
		radarCaption: 'radar da operação'
	},
	en: {
		suppA: 'Supp A',
		suppB: 'Supp B',
		suppC: 'Supp C',
		valueA: '$ 1,240',
		valueB: '$ 1,198',
		valueC: '$ 1,150',
		bestPrice: 'Best price',
		coaExpires: 'COA · expires in 12d',
		validityCaption: 'validity per document',
		question: 'question',
		price: 'R$ 8.90/kg',
		radarOrders: 'Orders',
		radarDocs: 'Docs',
		radarInvoices: 'Invoices',
		radarPrices: 'Prices',
		radarCaption: 'operation radar'
	}
} satisfies Localized<Record<string, string>>

type GraphicCopy = (typeof GRAPHIC_COPY)['pt']

type DrawArgs = {
	ctx: CanvasRenderingContext2D
	w: number
	h: number
	t: number
	wave: number
	mono: string
	reduced: boolean
	t9n: GraphicCopy
	label: (
		text: string,
		x: number,
		y: number,
		align: CanvasTextAlign,
		color: string,
		alpha: number
	) => void
}

/* 0 — Cotações: três barras de preço crescem; a mais barata é a menor,
   ganha o azul e a linha do melhor preço. */
function drawQuotes({ ctx, w, h, t, wave, label, reduced, t9n }: DrawArgs) {
	const bars = [
		{ name: t9n.suppA, value: t9n.valueA, frac: 0.92 },
		{ name: t9n.suppB, value: t9n.valueB, frac: 0.82 },
		{ name: t9n.suppC, value: t9n.valueC, frac: 0.62, accent: true }
	]
	const x0 = w * 0.24
	const maxLen = w * 0.6
	const ys = [h * 0.32, h * 0.5, h * 0.68]

	/* Eixo. */
	const axis = easeOutCubic(clamp01(t / 0.5))
	ctx.strokeStyle = INK
	ctx.globalAlpha = 0.25 * axis
	ctx.beginPath()
	ctx.moveTo(x0, h * 0.24)
	ctx.lineTo(x0, h * 0.76)
	ctx.stroke()

	bars.forEach((bar, i) => {
		const progress = easeOutCubic(clamp01((t - 0.25 - i * 0.18) / 0.8))
		if (progress <= 0) return
		const bob = reduced ? 0 : Math.sin(wave * 0.8 + i * 2) * 1.5
		const y = ys[i] + bob
		const len = bar.frac * maxLen * progress

		ctx.lineWidth = 7
		ctx.lineCap = 'round'
		ctx.strokeStyle = bar.accent ? BRAND : INK
		ctx.globalAlpha = bar.accent ? 0.9 : 0.25
		ctx.beginPath()
		ctx.moveTo(x0, y)
		ctx.lineTo(x0 + len, y)
		ctx.stroke()
		ctx.lineWidth = 1
		ctx.lineCap = 'butt'

		label(bar.name, x0 - 10, y + 3, 'right', 'rgba(27,26,21,0.6)', progress)
		if (progress > 0.85) {
			const alpha = clamp01((progress - 0.85) / 0.15)
			label(
				bar.value,
				x0 + len + 10,
				y + 3,
				'left',
				bar.accent ? BRAND : 'rgba(27,26,21,0.6)',
				alpha
			)
		}
	})

	/* Linha do melhor preço. */
	const best = easeOutCubic(clamp01((t - 1.4) / 0.5))
	if (best > 0) {
		const x = x0 + 0.62 * maxLen
		ctx.strokeStyle = BRAND
		ctx.globalAlpha = 0.45 * best
		ctx.setLineDash([3, 6])
		ctx.beginPath()
		ctx.moveTo(x, h * 0.2)
		ctx.lineTo(x, h * 0.78)
		ctx.stroke()
		ctx.setLineDash([])
		label(t9n.bestPrice, x, h * 0.16, 'center', BRAND, best)
	}
	ctx.globalAlpha = 1
}

/* 1 — Documentos: anéis concêntricos de validade — quanto falta de arco,
   quanto falta de prazo. O crítico é azul; o vencido, um X vermelho. */
function drawRings({ ctx, w, h, t, wave, label, reduced, t9n }: DrawArgs) {
	const cx = w / 2
	const cy = h * 0.46
	const rings = [
		{ r: h * 0.3, frac: 0.88, color: INK, alpha: 0.3, name: 'Halal' },
		{ r: h * 0.22, frac: 0.34, color: BRAND, alpha: 0.9, name: 'COA' },
		{ r: h * 0.14, frac: 0.04, color: CROSS, alpha: 0.7, name: 'Kosher' }
	]
	const start = -Math.PI / 2

	rings.forEach((ring, i) => {
		const progress = easeOutCubic(clamp01((t - i * 0.2) / 0.9))
		if (progress <= 0) return
		const breathe = reduced ? 0 : Math.sin(wave * 0.9 + i) * 1
		const r = ring.r + breathe

		/* Trilho. */
		ctx.strokeStyle = INK
		ctx.globalAlpha = 0.1 * progress
		ctx.beginPath()
		ctx.arc(cx, cy, r, 0, Math.PI * 2)
		ctx.stroke()

		/* Arco restante. */
		ctx.strokeStyle = ring.color
		ctx.globalAlpha = ring.alpha * progress
		ctx.lineWidth = 4
		ctx.lineCap = 'round'
		ctx.beginPath()
		ctx.arc(cx, cy, r, start, start + Math.PI * 2 * ring.frac * progress)
		ctx.stroke()
		ctx.lineWidth = 1
		ctx.lineCap = 'butt'
	})

	/* X do vencido, no miolo. */
	const cross = easeOutCubic(clamp01((t - 0.75) / 0.5))
	if (cross > 0) {
		const s = 5 * cross
		ctx.strokeStyle = CROSS
		ctx.lineWidth = 2
		ctx.globalAlpha = 0.9 * cross
		ctx.beginPath()
		ctx.moveTo(cx - s, cy - s)
		ctx.lineTo(cx + s, cy + s)
		ctx.moveTo(cx + s, cy - s)
		ctx.lineTo(cx - s, cy + s)
		ctx.stroke()
		ctx.lineWidth = 1
	}

	const caption = easeOutCubic(clamp01((t - 1.1) / 0.5))
	if (caption > 0) {
		label(t9n.coaExpires, cx, h * 0.88, 'center', BRAND, caption)
		label(
			t9n.validityCaption,
			cx,
			h * 0.94,
			'center',
			'rgba(27,26,21,0.45)',
			caption * 0.8
		)
	}
	ctx.globalAlpha = 1
}

/* 2 — Atendimento: um sinal ruidoso entra, atravessa o losango do motor
   e sai como resposta limpa, com o preço na ponta. */
function drawSignal({ ctx, w, h, t, wave, label, reduced, t9n }: DrawArgs) {
	const midY = h * 0.5
	const xIn = w * 0.08
	const xCore = w * 0.5
	const xOut = w * 0.92

	/* Sinal ruidoso (entrada). */
	const inProgress = easeOutCubic(clamp01(t / 0.9))
	if (inProgress > 0) {
		ctx.strokeStyle = INK
		ctx.globalAlpha = 0.35
		ctx.beginPath()
		const span = (xCore - 14 - xIn) * inProgress
		for (let x = xIn; x <= xIn + span; x += 2) {
			const u = (x - xIn) / (xCore - xIn)
			const amp = 16 * Math.sin(u * Math.PI)
			const y =
				midY +
				Math.sin(x * 0.11 + (reduced ? 0 : wave * 2.4)) * amp +
				Math.sin(x * 0.031 + (reduced ? 0 : wave * 1.1)) * amp * 0.5
			if (x === xIn) ctx.moveTo(x, y)
			else ctx.lineTo(x, y)
		}
		ctx.stroke()
	}

	/* Motor: losango azul girando devagar. */
	const core = easeOutCubic(clamp01((t - 0.6) / 0.5))
	if (core > 0) {
		const s = 13 * core
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
		ctx.arc(xCore, midY, 22, 0, Math.PI * 2)
		ctx.stroke()
	}

	/* Resposta limpa (saída). */
	const outProgress = easeOutCubic(clamp01((t - 0.9) / 0.9))
	if (outProgress > 0) {
		ctx.strokeStyle = BRAND
		ctx.globalAlpha = 0.85
		ctx.lineWidth = 2
		ctx.beginPath()
		const span = (xOut - (xCore + 14)) * outProgress
		for (let x = xCore + 14; x <= xCore + 14 + span; x += 2) {
			const y = midY + (reduced ? 0 : Math.sin(x * 0.02 + wave * 0.8) * 2)
			if (x === xCore + 14) ctx.moveTo(x, y)
			else ctx.lineTo(x, y)
		}
		ctx.stroke()
		ctx.lineWidth = 1
		if (outProgress >= 1) {
			ctx.fillStyle = BRAND
			ctx.beginPath()
			ctx.arc(xOut, midY, 4, 0, Math.PI * 2)
			ctx.fill()
		}
	}

	label(
		t9n.question,
		xIn + 4,
		midY + 34,
		'left',
		'rgba(27,26,21,0.6)',
		inProgress
	)
	if (outProgress > 0.7)
		label(
			t9n.price,
			xOut,
			midY - 16,
			'right',
			BRAND,
			clamp01((outProgress - 0.7) / 0.3)
		)
	ctx.globalAlpha = 1
}

/* 3 — Visão: radar da operação — a varredura gira e acende os blips dos
   módulos conforme passa por eles. */
function drawRadar({ ctx, w, h, t, wave, label, reduced, t9n }: DrawArgs) {
	const cx = w / 2
	const cy = h * 0.47
	const R = Math.min(w, h) * 0.34
	const intro = easeOutCubic(clamp01(t / 0.8))

	/* Anéis desenham-se em arco. */
	;[0.35, 0.65, 1].forEach((f, i) => {
		const p = easeOutCubic(clamp01((t - i * 0.15) / 0.7))
		if (p <= 0) return
		ctx.strokeStyle = INK
		ctx.globalAlpha = 0.18 * p
		ctx.beginPath()
		ctx.arc(cx, cy, R * f, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p)
		ctx.stroke()
	})

	/* Eixos. */
	ctx.strokeStyle = INK
	ctx.globalAlpha = 0.08 * intro
	ctx.beginPath()
	ctx.moveTo(cx - R, cy)
	ctx.lineTo(cx + R, cy)
	ctx.moveTo(cx, cy - R)
	ctx.lineTo(cx, cy + R)
	ctx.stroke()

	/* Varredura com rastro. */
	const sweep = reduced ? Math.PI * 0.35 : wave * 1.1
	const sweepIn = easeOutCubic(clamp01((t - 0.8) / 0.4))
	if (sweepIn > 0) {
		ctx.fillStyle = BRAND
		ctx.globalAlpha = 0.06 * sweepIn
		ctx.beginPath()
		ctx.moveTo(cx, cy)
		ctx.arc(cx, cy, R, sweep - 0.8, sweep)
		ctx.closePath()
		ctx.fill()
		ctx.strokeStyle = BRAND
		ctx.globalAlpha = 0.7 * sweepIn
		ctx.beginPath()
		ctx.moveTo(cx, cy)
		ctx.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R)
		ctx.stroke()
	}

	/* Blips dos módulos: brilham quando a varredura acabou de passar. */
	const blips = [
		{ ang: 0.7, rf: 0.55, name: t9n.radarOrders },
		{ ang: 2.3, rf: 0.82, name: t9n.radarDocs },
		{ ang: 3.9, rf: 0.42, name: t9n.radarInvoices },
		{ ang: 5.4, rf: 0.7, name: t9n.radarPrices }
	]
	const blipIn = easeOutCubic(clamp01((t - 1.1) / 0.5))
	if (blipIn > 0) {
		blips.forEach((blip) => {
			let diff = (sweep - blip.ang) % (Math.PI * 2)
			if (diff < 0) diff += Math.PI * 2
			const glow = reduced ? 0.8 : Math.max(0.25, 1 - diff / 2.4)
			const x = cx + Math.cos(blip.ang) * R * blip.rf
			const y = cy + Math.sin(blip.ang) * R * blip.rf
			ctx.fillStyle = BRAND
			ctx.globalAlpha = glow * blipIn
			ctx.beginPath()
			ctx.arc(x, y, 3.5, 0, Math.PI * 2)
			ctx.fill()
			ctx.strokeStyle = BRAND
			ctx.globalAlpha = 0.35 * glow * blipIn
			ctx.beginPath()
			ctx.arc(x, y, 7.5, 0, Math.PI * 2)
			ctx.stroke()
			label(
				blip.name,
				x,
				y - 12,
				'center',
				'rgba(27,26,21,0.6)',
				glow * blipIn
			)
		})
	}

	/* Centro. */
	ctx.fillStyle = INK
	ctx.globalAlpha = 0.7 * intro
	ctx.beginPath()
	ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
	ctx.fill()

	label(
		t9n.radarCaption,
		cx,
		h * 0.93,
		'center',
		'rgba(27,26,21,0.45)',
		easeOutCubic(clamp01((t - 1.4) / 0.5))
	)
	ctx.globalAlpha = 1
}

const SCENES = [drawQuotes, drawRings, drawSignal, drawRadar]

export function FeatureGraphic({
	index,
	className
}: {
	index: number
	className?: string
}) {
	const { lang } = useLang()
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const sceneRef = useRef(index)
	const clockRef = useRef<number>(NaN)
	/* O loop de RAF lê o idioma por ref — trocar de idioma não recria o
	   efeito nem reinicia a cena. */
	const langRef = useRef(lang)
	const ready = usePageReady()

	useEffect(() => {
		langRef.current = lang
	}, [lang])

	/* Troca de cena reinicia o relógio de entrada. */
	useEffect(() => {
		sceneRef.current = index
		if (!Number.isNaN(clockRef.current))
			clockRef.current = performance.now()
	}, [index])

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
		if (reduced) clockRef.current = -Infinity
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					if (Number.isNaN(clockRef.current))
						clockRef.current = performance.now()
					io.disconnect()
				}
			},
			{ threshold: 0.35 }
		)
		io.observe(canvas)

		const label = (
			text: string,
			x: number,
			y: number,
			align: CanvasTextAlign,
			color: string,
			alpha: number
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

		const draw = (now: number) => {
			ctx.clearRect(0, 0, width, height)
			const t = Number.isNaN(clockRef.current)
				? 0
				: (now - clockRef.current) / 1000
			const scene = SCENES[sceneRef.current] ?? SCENES[0]
			scene({
				ctx,
				w: width,
				h: height,
				t,
				wave: now / 1000,
				mono,
				reduced,
				t9n: GRAPHIC_COPY[langRef.current],
				label
			})
		}

		let raf = 0
		let running = false
		const loop = (now: number) => {
			if (!running) return
			draw(now)
			raf = requestAnimationFrame(loop)
		}
		const start = () => {
			if (running || !ready) return
			running = true
			raf = requestAnimationFrame(loop)
		}
		const stop = () => {
			running = false
			cancelAnimationFrame(raf)
		}

		// Só o gráfico em tela roda o loop — a página monta 5 instâncias
		// (sticky no desktop + uma por feature no mobile) e as escondidas
		// por display:none nunca intersectam.
		const visibility = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) start()
				else stop()
			},
			{ rootMargin: '100px' }
		)
		visibility.observe(canvas)

		const ro = new ResizeObserver(resize)
		ro.observe(canvas)
		resize()
		// Frame estático de partida (pré-loader ou fora da viewport).
		draw(performance.now())

		return () => {
			stop()
			visibility.disconnect()
			ro.disconnect()
			io.disconnect()
		}
	}, [ready])

	return (
		<div className={cn('relative aspect-square w-full', className)}>
			<canvas
				ref={canvasRef}
				aria-hidden
				className="absolute inset-0 block h-full w-full font-mono"
			/>
		</div>
	)
}
