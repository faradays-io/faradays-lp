'use client'

import gsap from 'gsap'
import { type MouseEvent, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

/* Where each cursor rests (fractions of the panel) when the mouse is away. */
const AI_REST = { x: 0.8, y: 0.12 }
const HUMAN_REST = { x: 0.12, y: 0.88 }

/* The AI cursor's tour: which [data-poi] to visit and what it says there. */
const TOUR = [
	{ poi: 'sinais', status: 'lendo sinais alternativos' },
	{ poi: 'contraste', status: 'contrastando com o score' },
	{ poi: 'metricas', status: 'auditando fairness e retorno' },
	{ poi: 'decisao', status: 'evidência pronta — decida' }
] as const

function CursorArrow({ className }: { className?: string }) {
	return (
		<svg
			width="19"
			height="19"
			viewBox="0 0 20 20"
			aria-hidden
			className={className}
		>
			<path
				d="M2.5 1.5 L17.5 8 L10.6 10.3 L7.2 16.8 Z"
				stroke="rgba(255,255,255,0.9)"
				strokeWidth="1"
			/>
		</svg>
	)
}

/**
 * Assisted decisioning, staged live: the panel is a mini credit dossier with
 * two custom cursors. On hover the native cursor disappears and you become
 * the human analyst, while the AI cursor tours the dossier — signals,
 * score contrast, fairness audit — and leaves the final call to you.
 */
export function CursorDuo({ className }: { className?: string }) {
	const rootRef = useRef<HTMLDivElement>(null)
	const aiRef = useRef<HTMLDivElement>(null)
	const humanRef = useRef<HTMLDivElement>(null)
	const followRef = useRef<{
		x: gsap.QuickToFunc
		y: gsap.QuickToFunc
	} | null>(null)
	const hoveredRef = useRef(false)
	const [hovered, setHovered] = useState(false)
	const [aiStep, setAiStep] = useState(-1)

	/* Park both cursors at their rest corners; used on mount and resize. */
	useEffect(() => {
		const root = rootRef.current
		const ai = aiRef.current
		const human = humanRef.current
		if (!root || !ai || !human) return

		followRef.current = {
			x: gsap.quickTo(human, 'x', { duration: 0.3, ease: 'power3' }),
			y: gsap.quickTo(human, 'y', { duration: 0.3, ease: 'power3' })
		}

		const park = () => {
			gsap.set(ai, {
				x: AI_REST.x * root.clientWidth,
				y: AI_REST.y * root.clientHeight
			})
			gsap.set(human, {
				x: HUMAN_REST.x * root.clientWidth,
				y: HUMAN_REST.y * root.clientHeight
			})
		}
		park()

		const ro = new ResizeObserver(() => {
			if (!hoveredRef.current) park()
		})
		ro.observe(root)
		return () => ro.disconnect()
	}, [])

	/* While hovered, the AI cursor loops through the dossier's points of
	   interest, highlighting each one as it arrives. */
	useEffect(() => {
		if (!hovered) return
		const root = rootRef.current
		const ai = aiRef.current
		if (!root || !ai) return

		const rootRect = root.getBoundingClientRect()
		const tl = gsap.timeline({ repeat: -1, delay: 0.2 })
		TOUR.forEach((stop, i) => {
			const el = root.querySelector<HTMLElement>(
				`[data-poi="${stop.poi}"]`
			)
			if (!el) return
			const rect = el.getBoundingClientRect()
			tl.to(
				ai,
				{
					x: rect.left - rootRect.left + rect.width * 0.85,
					y: rect.top - rootRect.top + rect.height * 0.6,
					duration: 0.85,
					ease: 'power3.inOut'
				},
				i === 0 ? undefined : '+=0.9'
			)
			tl.call(() => setAiStep(i))
		})
		/* Dwell on the hand-off before looping back to the first stop. */
		tl.to({}, { duration: 1.4 })
		tl.call(() => setAiStep(-1))

		return () => {
			tl.kill()
			setAiStep(-1)
			gsap.to(ai, {
				x: AI_REST.x * root.clientWidth,
				y: AI_REST.y * root.clientHeight,
				duration: 0.7,
				ease: 'power3.inOut',
				overwrite: 'auto'
			})
		}
	}, [hovered])

	const reducedMotion = () =>
		window.matchMedia('(prefers-reduced-motion: reduce)').matches

	const onMouseEnter = () => {
		if (reducedMotion()) return
		hoveredRef.current = true
		setHovered(true)
	}

	const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
		if (!hoveredRef.current) return
		const root = rootRef.current
		const follow = followRef.current
		if (!root || !follow) return
		const rect = root.getBoundingClientRect()
		follow.x(e.clientX - rect.left)
		follow.y(e.clientY - rect.top)
	}

	const onMouseLeave = () => {
		hoveredRef.current = false
		setHovered(false)
		const root = rootRef.current
		const follow = followRef.current
		if (!root || !follow) return
		follow.x(HUMAN_REST.x * root.clientWidth)
		follow.y(HUMAN_REST.y * root.clientHeight)
	}

	/* Conditional ring around the dossier block the AI is inspecting. */
	const poi = (i: number) =>
		cn(
			'-m-2 rounded-xl border border-transparent p-2 transition-colors duration-300',
			aiStep === i && 'border-brand/60 bg-brand/10'
		)

	return (
		<div
			ref={rootRef}
			onMouseEnter={onMouseEnter}
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
			className={cn(
				'relative h-full w-full overflow-hidden',
				hovered && 'cursor-none',
				className
			)}
		>
			<div className="pointer-events-none flex h-full items-center justify-center p-6 select-none min-[810px]:p-10">
				<div className="bg-card/60 w-full max-w-md rounded-2xl border p-6 backdrop-blur-sm">
					<span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
						Pedido #2841 — análise assistida
					</span>
					<h3 className="font-heading text-h5 mt-2">
						Autônoma, sem histórico de birô
					</h3>

					<div data-poi="sinais" className={cn(poi(0), 'mt-6')}>
						<div className="flex flex-wrap gap-2">
							{[
								'Recebíveis estáveis',
								'Sem birô',
								'Setor em expansão'
							].map((signal) => (
								<span
									key={signal}
									className="text-foreground/70 rounded-full border px-3 py-1 font-mono text-[10px] tracking-wide uppercase"
								>
									{signal}
								</span>
							))}
						</div>
					</div>

					<div data-poi="contraste" className={cn(poi(1), 'mt-6')}>
						<div className="grid gap-2">
							<div className="rounded-xl border p-3 opacity-60">
								<span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
									Score estático
								</span>
								<p className="text-body-sm mt-0.5">
									Recusar — score insuficiente
								</p>
							</div>
							<div className="border-brand/40 bg-brand/10 rounded-xl border p-3">
								<span className="text-brand font-mono text-[10px] tracking-widest uppercase">
									Política Faradays
								</span>
								<p className="text-body-sm mt-0.5 font-medium">
									Aprovar com limite de entrada
								</p>
							</div>
						</div>
					</div>

					<div data-poi="metricas" className={cn(poi(2), 'mt-6')}>
						<dl className="flex flex-wrap gap-x-6 gap-y-2">
							{[
								['Fairness', 'Dentro da meta'],
								['Retorno esperado', 'Positivo'],
								['Incerteza', 'Reduzida']
							].map(([term, value]) => (
								<div key={term} className="flex flex-col">
									<dt className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
										{term}
									</dt>
									<dd className="text-body-sm">{value}</dd>
								</div>
							))}
						</dl>
					</div>

					<div data-poi="decisao" className={cn(poi(3), 'mt-6')}>
						<div className="bg-primary text-primary-foreground rounded-md px-4 py-2.5 text-center text-sm font-medium">
							Aprovar com limite de entrada
						</div>
						<p className="text-muted-foreground mt-2 text-center font-mono text-[10px] tracking-widest uppercase">
							A palavra final é do seu time
						</p>
					</div>
				</div>
			</div>

			<div
				ref={aiRef}
				aria-hidden
				className="pointer-events-none absolute top-0 left-0 z-20 will-change-transform"
			>
				<CursorArrow className="fill-brand" />
				<span className="bg-brand text-brand-foreground ml-4 inline-block rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wide whitespace-nowrap uppercase">
					{hovered
						? aiStep >= 0
							? TOUR[aiStep].status
							: 'varrendo o pedido…'
						: 'IA Faradays'}
				</span>
			</div>

			<div
				ref={humanRef}
				aria-hidden
				className="pointer-events-none absolute top-0 left-0 z-20 will-change-transform"
			>
				<CursorArrow className="fill-foreground" />
				<span className="bg-foreground text-background ml-4 inline-block rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wide whitespace-nowrap uppercase">
					{hovered ? 'você' : 'seu analista'}
				</span>
			</div>
		</div>
	)
}
