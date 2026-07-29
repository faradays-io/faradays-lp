'use client'

import gsap from 'gsap'
import {
	type MouseEvent,
	type ReactNode,
	useEffect,
	useRef,
	useState
} from 'react'

import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

/* Demos do showcase (padrão do CursorDuo do /credito): mini-UIs claras com
   dois cursores — a IA percorre os pontos de interesse ([data-poi]) em
   loop e o cursor "você" segue o mouse real quando o painel está em hover.
   Paradas com `click: true` fazem o elemento encolher e voltar (squash de
   clique). Todo conteúdo marcado com [data-demo-item] entra com pop. */

type TourStop = { poi: string; status: string; click?: boolean }

const AI_REST = { x: 0.72, y: 0.08 }
const HUMAN_REST = { x: 0.1, y: 0.86 }

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

function DemoStage({
	tour,
	children,
	className
}: {
	tour: readonly TourStop[]
	children: (activePoi: string | null, step: number) => ReactNode
	className?: string
}) {
	const rootRef = useRef<HTMLDivElement>(null)
	const aiRef = useRef<HTMLDivElement>(null)
	const humanRef = useRef<HTMLDivElement>(null)
	const followRef = useRef<{
		x: gsap.QuickToFunc
		y: gsap.QuickToFunc
	} | null>(null)
	const hoveredRef = useRef(false)
	const [hovered, setHovered] = useState(false)
	const [step, setStep] = useState(-1)
	const ready = usePageReady()

	useEffect(() => {
		const root = rootRef.current
		const ai = aiRef.current
		const human = humanRef.current
		if (!root || !ai || !human) return
		// O tour mede posições em tela: só depois do loader, com o layout já
		// assentado (e sem rodar escondido atrás dele).
		if (!ready) return
		const rootRect = root.getBoundingClientRect()
		gsap.set(ai, {
			x: rootRect.width * AI_REST.x,
			y: rootRect.height * AI_REST.y
		})
		gsap.set(human, {
			x: rootRect.width * HUMAN_REST.x,
			y: rootRect.height * HUMAN_REST.y
		})
		followRef.current = {
			x: gsap.quickTo(human, 'x', { duration: 0.3, ease: 'power3' }),
			y: gsap.quickTo(human, 'y', { duration: 0.3, ease: 'power3' })
		}
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
			return

		/* Mede os alvos ANTES da entrada animada deslocar os elementos. */
		const targets = tour.map((stop) => {
			const el = root.querySelector<HTMLElement>(
				`[data-poi="${stop.poi}"]`
			)
			if (!el) return null
			const rect = el.getBoundingClientRect()
			return {
				el,
				x: rect.left - rootRect.left + rect.width * 0.82,
				y: rect.top - rootRect.top + rect.height * 0.58
			}
		})

		/* Entrada: conteúdo pipoca em stagger. */
		const entrance = gsap.fromTo(
			root.querySelectorAll('[data-demo-item]'),
			{ autoAlpha: 0, scale: 0.9, y: 12 },
			{
				autoAlpha: 1,
				scale: 1,
				y: 0,
				duration: 0.5,
				ease: 'back.out(1.7)',
				stagger: 0.09
			}
		)

		const tl = gsap.timeline({ repeat: -1, delay: 1.1 })
		tour.forEach((stop, i) => {
			const target = targets[i]
			if (!target) return
			tl.to(
				ai,
				{
					x: target.x,
					y: target.y,
					duration: 0.8,
					ease: 'power3.inOut'
				},
				i === 0 ? undefined : '+=1.05'
			)
			tl.call(() => setStep(i))
			if (stop.click) {
				/* Squash de clique: encolhe e volta. */
				tl.to(target.el, {
					scale: 0.92,
					duration: 0.12,
					ease: 'power2.in'
				})
				tl.to(target.el, {
					scale: 1,
					duration: 0.3,
					ease: 'back.out(3)'
				})
			}
		})
		tl.to({}, { duration: 1.5 })
		tl.call(() => setStep(-1))
		return () => {
			entrance.kill()
			tl.kill()
			setStep(-1)
		}
	}, [tour, ready])

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

	return (
		<div
			ref={rootRef}
			onMouseEnter={onMouseEnter}
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
			className={cn(
				'relative h-full w-full overflow-hidden select-none',
				hovered && 'cursor-none',
				className
			)}
		>
			{children(step >= 0 ? tour[step].poi : null, step)}

			<div
				ref={aiRef}
				aria-hidden
				className="pointer-events-none absolute top-0 left-0 z-20 will-change-transform"
			>
				<CursorArrow className="fill-brand" />
				<span className="bg-brand text-brand-foreground ml-4 inline-block rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wide whitespace-nowrap uppercase">
					{step >= 0 ? tour[step].status : 'IA Faradays'}
				</span>
			</div>

			<div
				ref={humanRef}
				aria-hidden
				className="pointer-events-none absolute top-0 left-0 z-20 will-change-transform"
			>
				<CursorArrow className="fill-foreground" />
				<span className="bg-foreground text-background ml-4 inline-block rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wide whitespace-nowrap uppercase">
					você
				</span>
			</div>
		</div>
	)
}

/* Anel azul de destaque — usado só na primeira demo; nas demais o tooltip
   do cursor é o único sinal. */
const poiHighlight = (active: string | null, id: string) =>
	cn(
		'rounded-xl border border-transparent p-2 transition-colors duration-300',
		active === id && 'border-brand/60 bg-brand/10'
	)

const poiWrap = 'rounded-xl p-2'

const label =
	'text-muted-foreground font-mono text-[10px] tracking-widest uppercase'

/* ---- 01 · Cotações -------------------------------------------------- */

const COTACOES_TOUR = [
	{ poi: 'forn-a', status: 'lendo resposta' },
	{ poi: 'forn-c', status: 'melhor custo total' },
	{ poi: 'escolher', status: 'cotação escolhida', click: true }
] as const

export function CotacoesDemo() {
	const rows = [
		{
			id: 'forn-a',
			name: 'Fornecedor A',
			price: '$ 1.240 · FOB',
			eta: '32d'
		},
		{
			id: 'forn-b',
			name: 'Fornecedor B',
			price: '$ 1.198 · CIF',
			eta: '40d'
		},
		{
			id: 'forn-c',
			name: 'Fornecedor C',
			price: '$ 1.150 · FOB',
			eta: '28d',
			best: true
		}
	]
	return (
		<DemoStage tour={COTACOES_TOUR}>
			{(active) => (
				<div className="flex h-full items-center justify-center p-6">
					<div className="w-full max-w-sm">
						<span data-demo-item className={cn(label, 'block')}>
							RFQ #1042 · Ácido cítrico · 25t
						</span>
						<div className="mt-4 flex flex-col gap-2">
							{rows.map((row) => (
								<div
									key={row.id}
									data-poi={row.id}
									data-demo-item
									className={poiHighlight(active, row.id)}
								>
									<div
										className={cn(
											'flex items-center justify-between rounded-lg border px-3 py-2.5',
											row.best && 'border-brand/40'
										)}
									>
										<span className="text-body-sm font-medium">
											{row.name}
										</span>
										<span className="text-foreground/70 font-mono text-xs">
											{row.price} · {row.eta}
										</span>
									</div>
								</div>
							))}
						</div>
						<div
							data-poi="escolher"
							data-demo-item
							className={cn(
								poiHighlight(active, 'escolher'),
								'mt-3'
							)}
						>
							<div className="bg-primary text-primary-foreground rounded-md px-4 py-2.5 text-center text-sm font-medium">
								Escolher vencedora
							</div>
						</div>
					</div>
				</div>
			)}
		</DemoStage>
	)
}

/* ---- 02 · Documentos ------------------------------------------------- */

const DOCS_TOUR = [
	{ poi: 'doc-halal', status: 'validade ok' },
	{ poi: 'doc-coa', status: 'vence em 12 dias' },
	{ poi: 'alerta', status: 'alerta disparado' }
] as const

export function DocumentosDemo() {
	const docs = [
		{
			id: 'doc-halal',
			name: 'Certificado Halal',
			status: 'Vigente',
			tone: 'text-foreground/60'
		},
		{
			id: 'doc-coa',
			name: 'COA · Lote 8841',
			status: 'A vencer · 12d',
			tone: 'text-brand'
		},
		{
			id: 'doc-kosher',
			name: 'Certificado Kosher',
			status: 'Vencido',
			tone: 'text-destructive'
		}
	]
	return (
		<DemoStage tour={DOCS_TOUR}>
			{() => (
				<div className="flex h-full items-center justify-center p-6">
					<div className="w-full max-w-sm">
						<span data-demo-item className={cn(label, 'block')}>
							Gestão de documentos · por produto
						</span>
						<div className="mt-4 flex flex-col gap-2">
							{docs.map((doc) => (
								<div
									key={doc.id}
									data-poi={doc.id}
									data-demo-item
									className={poiWrap}
								>
									<div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
										<span className="text-body-sm font-medium">
											{doc.name}
										</span>
										<span
											className={cn(
												'font-mono text-[10px] tracking-widest uppercase',
												doc.tone
											)}
										>
											{doc.status}
										</span>
									</div>
								</div>
							))}
						</div>
						<div
							data-poi="alerta"
							data-demo-item
							className={cn(poiWrap, 'mt-3')}
						>
							<div className="border-brand/40 bg-brand/10 rounded-lg border px-3 py-2.5">
								<span className="text-brand font-mono text-[10px] tracking-widest uppercase">
									Alerta diário · 07:00
								</span>
								<p className="text-body-sm mt-0.5">
									COA do lote 8841 vence antes do embarque
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</DemoStage>
	)
}

/* ---- 03 · Atendimento ------------------------------------------------ */

const CHAT_TOUR = [
	{ poi: 'mensagem', status: 'lendo sua mensagem' },
	{ poi: 'enviar', status: 'enviando resposta', click: true },
	{ poi: 'resposta', status: 'preço da tabela vigente' }
] as const

export function AtendimentoDemo() {
	return (
		<DemoStage tour={CHAT_TOUR}>
			{(_, step) => (
				<div className="flex h-full items-center justify-center p-6">
					<div className="w-full max-w-sm">
						<span data-demo-item className={cn(label, 'block')}>
							WhatsApp · Rep. Sudeste
						</span>

						{/* Minha mensagem — cinza, à direita. */}
						<div
							data-poi="mensagem"
							data-demo-item
							className={cn(poiWrap, 'mt-4')}
						>
							<div className="bg-muted text-foreground ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md px-3 py-2.5">
								<p className="text-body-sm">
									Qual o preço do ácido cítrico hoje para SP?
								</p>
							</div>
						</div>

						{/* Resposta do sistema — pipoca depois do clique,
						   acima do botão (que já fica embaixo de antemão). */}
						<div
							data-poi="resposta"
							className={cn(
								poiWrap,
								'mt-3 origin-bottom-left transition-all duration-300 ease-out',
								step >= 1
									? 'scale-100 opacity-100'
									: 'scale-75 opacity-0'
							)}
						>
							<div className="bg-brand text-brand-foreground w-fit max-w-[85%] rounded-2xl rounded-bl-md px-3 py-2.5">
								<span className="font-mono text-[10px] tracking-widest uppercase opacity-80">
									Faradays · tabela jul/26
								</span>
								<p className="text-body-sm mt-0.5">
									R$ 8,90/kg + ICMS SP · CIF até 3t
								</p>
							</div>
						</div>

						<div
							data-poi="enviar"
							data-demo-item
							className={cn(poiWrap, 'mt-3')}
						>
							<div className="bg-primary text-primary-foreground rounded-md px-4 py-2.5 text-center text-sm font-medium">
								Enviar
							</div>
						</div>
					</div>
				</div>
			)}
		</DemoStage>
	)
}

/* ---- 04 · Visão ------------------------------------------------------ */

const VISAO_TOUR = [
	{ poi: 'kpi-fat', status: 'faturamento do mês' },
	{ poi: 'kpi-docs', status: '5 docs a vencer' },
	{ poi: 'kpi-conv', status: 'conversão subindo' }
] as const

export function VisaoDemo() {
	const kpis = [
		{ id: 'kpi-fat', term: 'Faturamento', value: 'R$ 4,2M' },
		{ id: 'kpi-ped', term: 'Pedidos em aberto', value: '38' },
		{ id: 'kpi-docs', term: 'Docs a vencer', value: '5' },
		{ id: 'kpi-conv', term: 'Conversão', value: '31%' }
	]
	return (
		<DemoStage tour={VISAO_TOUR}>
			{() => (
				<div className="flex h-full items-center justify-center p-6">
					<div className="w-full max-w-sm">
						<span data-demo-item className={cn(label, 'block')}>
							Home · KPIs consolidados
						</span>
						<div className="mt-4 grid grid-cols-2 gap-2">
							{kpis.map((kpi) => (
								<div
									key={kpi.id}
									data-poi={kpi.id}
									data-demo-item
									className={poiWrap}
								>
									<div className="rounded-lg border px-3 py-3">
										<span className={label}>
											{kpi.term}
										</span>
										<p className="font-heading text-h4 mt-1">
											{kpi.value}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</DemoStage>
	)
}
