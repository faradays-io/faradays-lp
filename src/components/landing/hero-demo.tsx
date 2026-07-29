'use client'

import {
	ChartBar,
	CheckCircle,
	CircleNotch,
	FilePdf,
	FileText,
	Folder,
	MagnifyingGlass,
	MicrosoftExcelLogo,
	Plus,
	PuzzlePiece,
	Table,
	WhatsappLogo
} from '@phosphor-icons/react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ *
 * Fundo ASCII: grade de caracteres mono em tons de azul, animada por um
 * campo de ondas — a textura do painel de demo do hero.
 * ------------------------------------------------------------------ */

const CELL = 16
const CHARS = ' .:-=+*#'

export function AsciiField({
	className,
	rgb = '0, 101, 224'
}: {
	className?: string
	/** Cor dos glifos como "r, g, b" — default azul brand. */
	rgb?: string
}) {
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

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		const paint = (t: number) => {
			ctx.clearRect(0, 0, width, height)
			ctx.font = `10px ${mono}`
			for (let y = CELL / 2; y < height; y += CELL) {
				for (let x = CELL / 2; x < width; x += CELL) {
					const v =
						0.5 +
						0.25 * Math.sin(x * 0.045 + t * 0.9) +
						0.25 * Math.cos(y * 0.05 - t * 0.6 + x * 0.01)
					const idx = Math.min(
						CHARS.length - 1,
						Math.max(0, Math.floor(v * CHARS.length))
					)
					if (idx === 0) continue
					ctx.fillStyle = `rgba(${rgb}, ${0.07 + v * 0.16})`
					ctx.fillText(CHARS[idx], x, y)
				}
			}
		}

		let raf = 0
		let last = 0
		const loop = (now: number) => {
			raf = requestAnimationFrame(loop)
			// ~11fps é suficiente para textura e barato para a página.
			if (now - last < 90) return
			last = now
			paint(now / 1000)
		}

		// Congelado até o fim do loader: a textura fica pintada, mas parada.
		const frozen = reducedMotion || !ready

		const ro = new ResizeObserver(() => {
			resize()
			if (frozen) paint(0)
		})
		ro.observe(canvas)
		resize()
		if (frozen) paint(0)
		else raf = requestAnimationFrame(loop)

		return () => {
			cancelAnimationFrame(raf)
			ro.disconnect()
		}
	}, [rgb, ready])

	return (
		<canvas
			ref={canvasRef}
			aria-hidden
			className={cn(
				'pointer-events-none block h-full w-full font-mono',
				className
			)}
		/>
	)
}

/* ------------------------------------------------------------------ *
 * Demo interativa: uma planilha Excel flutua ao lado do sistema; o
 * usuário arrasta e solta na zona central, o sistema processa e devolve
 * um PDF de output. Depois de alguns segundos o ciclo reinicia.
 * ------------------------------------------------------------------ */

type Phase = 'idle' | 'processing' | 'done'

const fileCard =
	'flex size-20 flex-col items-center justify-center gap-1 border bg-card shadow-sm will-change-transform'
const fileLabel =
	'font-mono text-[9px] tracking-wide uppercase text-foreground/60'

/* Sessões da sidebar do app mock. */
const SESSIONS = [
	{
		IconCmp: PuzzlePiece,
		title: 'Comparativo RFQ',
		sub: 'rfq-1042',
		active: true
	},
	{ IconCmp: FileText, title: 'Docs a vencer', sub: 'plano pronto' },
	{ IconCmp: WhatsappLogo, title: 'Rep. Sudeste', sub: '3 conversas' },
	{ IconCmp: ChartBar, title: 'KPIs do mês', sub: 'atualizado 07:00' }
]

export function HeroDemo() {
	const fileRef = useRef<HTMLDivElement>(null)
	const zoneRef = useRef<HTMLDivElement>(null)
	const pdfRef = useRef<HTMLDivElement>(null)
	const [phase, setPhase] = useState<Phase>('idle')
	const [dragging, setDragging] = useState(false)
	const [overZone, setOverZone] = useState(false)
	const phaseRef = useRef(phase)
	const ready = usePageReady()
	useEffect(() => {
		phaseRef.current = phase
	}, [phase])

	/* Flutuação da planilha enquanto espera interação. */
	useEffect(() => {
		if (phase !== 'idle' || dragging || !ready) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
			return
		const file = fileRef.current
		if (!file) return
		const bob = gsap.to(file, {
			y: '+=12',
			duration: 1.7,
			yoyo: true,
			repeat: -1,
			ease: 'sine.inOut',
			delay: 0.7
		})
		return () => {
			bob.kill()
		}
	}, [phase, dragging, ready])

	/* Arraste + soltura na zona do sistema. */
	useEffect(() => {
		const file = fileRef.current
		const zone = zoneRef.current
		if (!file || !zone) return

		let isDragging = false
		const start = { x: 0, y: 0 }
		const base = { x: 0, y: 0 }

		const intersects = () => {
			const fr = file.getBoundingClientRect()
			const zr = zone.getBoundingClientRect()
			return (
				fr.left < zr.right &&
				fr.right > zr.left &&
				fr.top < zr.bottom &&
				fr.bottom > zr.top
			)
		}

		const submit = () => {
			setOverZone(false)
			setPhase('processing')
			const fr = file.getBoundingClientRect()
			const zr = zone.getBoundingClientRect()
			gsap.to(file, {
				x: `+=${zr.left + zr.width / 2 - (fr.left + fr.width / 2)}`,
				y: `+=${zr.top + zr.height / 2 - (fr.top + fr.height / 2)}`,
				scale: 0.2,
				autoAlpha: 0,
				duration: 0.45,
				ease: 'power3.in'
			})
			window.setTimeout(() => setPhase('done'), 1600)
		}

		const onDown = (e: PointerEvent) => {
			if (phaseRef.current !== 'idle') return
			isDragging = true
			setDragging(true)
			gsap.killTweensOf(file)
			start.x = e.clientX
			start.y = e.clientY
			base.x = Number(gsap.getProperty(file, 'x'))
			base.y = Number(gsap.getProperty(file, 'y'))
			file.setPointerCapture(e.pointerId)
			e.preventDefault()
		}
		const onMove = (e: PointerEvent) => {
			if (!isDragging) return
			gsap.set(file, {
				x: base.x + e.clientX - start.x,
				y: base.y + e.clientY - start.y
			})
			setOverZone(intersects())
		}
		const onUp = (e: PointerEvent) => {
			if (!isDragging) return
			isDragging = false
			setDragging(false)
			file.releasePointerCapture(e.pointerId)
			if (intersects()) {
				submit()
			} else {
				setOverZone(false)
				gsap.to(file, {
					x: 0,
					y: 0,
					duration: 0.8,
					ease: 'elastic.out(1, 0.55)'
				})
			}
		}

		file.addEventListener('pointerdown', onDown)
		file.addEventListener('pointermove', onMove)
		file.addEventListener('pointerup', onUp)
		file.addEventListener('pointercancel', onUp)
		return () => {
			file.removeEventListener('pointerdown', onDown)
			file.removeEventListener('pointermove', onMove)
			file.removeEventListener('pointerup', onUp)
			file.removeEventListener('pointercancel', onUp)
		}
	}, [])

	/* Output: o PDF pipoca; alguns segundos depois o ciclo reinicia. */
	useEffect(() => {
		if (phase !== 'done') return
		const pdf = pdfRef.current
		const file = fileRef.current
		if (!pdf || !file) return
		const pop = gsap.fromTo(
			pdf,
			{ autoAlpha: 0, scale: 0.3, x: -48 },
			{ autoAlpha: 1, scale: 1, x: 0, duration: 0.6, ease: 'back.out(2)' }
		)
		const timer = window.setTimeout(() => {
			gsap.to(pdf, { autoAlpha: 0, scale: 0.7, duration: 0.3 })
			gsap.fromTo(
				file,
				{ x: 0, y: 0, scale: 0.5, autoAlpha: 0 },
				{
					scale: 1,
					autoAlpha: 1,
					duration: 0.5,
					ease: 'back.out(2)',
					delay: 0.2
				}
			)
			setPhase('idle')
		}, 3000)
		return () => {
			pop.kill()
			window.clearTimeout(timer)
		}
	}, [phase])

	return (
		<div className="relative z-10 flex h-full items-center justify-center p-5 md:p-8">
			{/* Janela do app (referência: docs/image copy 13.png). */}
			<div className="bg-card/95 flex h-full max-h-[36rem] w-[min(60rem,100%)] flex-col overflow-hidden rounded-xl border shadow-2xl backdrop-blur-[2px]">
				{/* Barra de título. */}
				<div className="relative flex items-center border-b px-4 py-2.5">
					<div className="flex gap-1.5" aria-hidden>
						<span className="bg-foreground/15 size-2.5 rounded-full" />
						<span className="bg-foreground/15 size-2.5 rounded-full" />
						<span className="bg-foreground/15 size-2.5 rounded-full" />
					</div>
					<span className="text-foreground/70 pointer-events-none absolute inset-x-0 text-center text-xs font-medium">
						Faradays Desktop
					</span>
				</div>

				<div className="flex min-h-0 flex-1">
					{/* Sidebar de sessões. */}
					<aside className="hidden w-56 shrink-0 flex-col border-r md:flex">
						<div className="flex items-center gap-2 p-3">
							<div className="bg-muted text-muted-foreground flex flex-1 items-center gap-2 rounded-md px-2.5 py-1.5 text-xs">
								<MagnifyingGlass className="size-3.5" />
								Buscar sessões…
							</div>
							<Plus className="text-foreground/50 size-4" />
						</div>
						<div className="flex flex-col gap-0.5 px-2">
							{SESSIONS.map((session) => (
								<div
									key={session.title}
									className={cn(
										'flex items-center gap-2.5 rounded-md px-2 py-2',
										session.active && 'bg-muted'
									)}
								>
									<span
										className={cn(
											'flex size-7 shrink-0 items-center justify-center rounded-md border',
											session.active &&
												'bg-brand text-brand-foreground border-transparent'
										)}
									>
										<session.IconCmp
											weight="fill"
											className="size-3.5"
										/>
									</span>
									<div className="min-w-0">
										<p className="truncate text-xs font-medium">
											{session.title}
										</p>
										<p className="text-muted-foreground truncate font-mono text-[10px]">
											✓ {session.sub}
										</p>
									</div>
								</div>
							))}
						</div>
					</aside>

					{/* Painel principal. */}
					<div className="flex min-w-0 flex-1 flex-col">
						<div className="flex items-center gap-2 border-b px-4 py-2.5">
							<span className="bg-brand text-brand-foreground flex size-5 items-center justify-center rounded-md">
								<PuzzlePiece weight="fill" className="size-3" />
							</span>
							<span className="text-xs font-medium">
								Gerar comparativo da RFQ #1042
							</span>
							<CheckCircle
								weight="fill"
								className="text-brand size-3.5"
							/>
						</div>

						<div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
							{/* Mensagem do usuário. */}
							<div className="flex items-start gap-2.5">
								<span className="bg-muted text-foreground/70 flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold">
									MZ
								</span>
								<p className="text-body-sm rounded-lg border px-3 py-2">
									Compare as respostas da RFQ #1042 e gere o
									comparativo em PDF.
								</p>
							</div>
							<p className="text-foreground/60 font-mono text-xs">
								Analisei as 3 respostas. Arraste a planilha para
								o sistema gerar o comparativo.
							</p>

							{/* Área interativa: arquivo → sistema → output. */}
							<div className="flex min-h-0 flex-1 items-center justify-center gap-6 sm:gap-10">
								<div className="flex w-20 flex-col items-center gap-2">
									<div
										ref={fileRef}
										role="button"
										aria-label="Arraste a planilha até o sistema"
										className={cn(
											fileCard,
											'z-20 touch-none',
											dragging
												? 'cursor-grabbing'
												: 'cursor-grab'
										)}
									>
										<MicrosoftExcelLogo
											weight="fill"
											className="size-7 text-[#107c41]"
										/>
										<span className={fileLabel}>
											rfq.xlsx
										</span>
									</div>
									<span
										className={cn(
											'text-foreground/50 font-mono text-[9px] tracking-widest uppercase transition-opacity',
											phase !== 'idle' && 'opacity-0'
										)}
									>
										arraste →
									</span>
								</div>

								<div
									ref={zoneRef}
									className={cn(
										'bg-card/60 flex size-32 shrink-0 flex-col items-center justify-center gap-2 border border-dashed transition-colors duration-300',
										overZone
											? 'border-brand bg-brand/10'
											: 'border-foreground/30'
									)}
								>
									{phase === 'processing' ? (
										<>
											<CircleNotch className="text-brand size-7 animate-spin" />
											<span className={fileLabel}>
												Processando…
											</span>
										</>
									) : phase === 'done' ? (
										<>
											<CheckCircle
												weight="fill"
												className="text-brand size-7"
											/>
											<span className={fileLabel}>
												PDF gerado
											</span>
										</>
									) : (
										<>
											<PuzzlePiece
												weight="fill"
												className="text-foreground/70 size-7"
											/>
											<span className={fileLabel}>
												Solte aqui
											</span>
										</>
									)}
								</div>

								<div className="flex w-20 flex-col items-center">
									<div
										ref={pdfRef}
										className={cn(fileCard, 'opacity-0')}
									>
										<FilePdf
											weight="fill"
											className="size-7 text-[#d93025]"
										/>
										<span className={fileLabel}>
											output.pdf
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Input + contexto. */}
						<div className="border-t px-4 py-3">
							<p className="text-muted-foreground font-mono text-xs">
								Peça ao Faradays para orquestrar uma tarefa
							</p>
							<div className="mt-3 flex flex-wrap items-center gap-1.5">
								{[
									{
										IconCmp: Folder,
										text: '~/operacao/monfiza'
									},
									{ IconCmp: Table, text: 'tabela jul/26' },
									{ IconCmp: PuzzlePiece, text: 'Faradays' }
								].map(({ IconCmp, text }) => (
									<span
										key={text}
										className="text-foreground/60 flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10px]"
									>
										<IconCmp className="size-3" />
										{text}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
