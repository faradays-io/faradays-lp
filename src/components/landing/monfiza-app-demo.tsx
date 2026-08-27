'use client'

import {
	BellRinging,
	ChatsCircle,
	Check,
	CheckCircle,
	Checks,
	ClipboardText,
	CurrencyCircleDollar,
	Cursor,
	FilePdf,
	Files,
	FileText,
	House,
	Medal,
	Microphone,
	Package,
	Paperclip,
	Pulse,
	ShieldCheck,
	Table,
	TrendUp,
	WhatsappLogo
} from '@phosphor-icons/react'
import gsap from 'gsap'
import type { ComponentType, ReactNode, Ref } from 'react'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'

import {
	FaradaysLockup,
	FaradaysMark
} from '@/components/landing/faradays-lockup'
import { useCopy } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

const COPY = {
	pt: {
		// Chat (feature 0) — a cena da cotação da Nestlé.
		contact: 'Rep. Sudeste · Carlos',
		typing: 'Faradays digitando…',
		channel: 'WhatsApp · carteira própria',
		chatAction: 'Cotações',
		ask: 'Faz uma cotação de 2 ton de creatina pra Nestlé, entrega SP',
		brandsBefore: 'Encontrei ',
		brandsStrong: '2 marcas',
		brandsAfter:
			' de creatina na tabela vigente: Creapure® e Hansong. Qual delas?',
		pick: 'Creapure',
		issued: 'Cotação COT-V-0187 emitida — ICMS SP e câmbio do dia já calculados.',
		pdfMeta: '2.000 kg · Creapure® · 1 pág.',
		inputPlaceholder: 'Mensagem',
		contact2: 'Rep. Sul · Ana',
		contact2Preview: 'Você: tabela de setembro?',
		contact3: 'Rep. Nordeste · João',
		contact3Preview: 'Pedido PD-0453 faturado',
		// Card de preview do PDF (estágio 2 do hold).
		pdfName: 'COT-V-0187 · Nestlé SP.pdf',
		preview: 'pré-visualização',
		// Shell do app.
		navHome: 'Início',
		navOverview: 'Visão Geral',
		navWhatsapp: 'WhatsApp',
		navConversas: 'Conversas',
		navCompras: 'Compras',
		navBid: 'BID (Cotação de Compra)',
		navVendas: 'Vendas',
		navVenda: 'Cotação de Venda',
		navPrecos: 'Tabela de Preços',
		navQualidade: 'Qualidade',
		navDocs: 'Documentos',
		account: 'Representante',
		// Breadcrumbs do header — um par (grupo / folha) por tela.
		crumbWhatsapp: 'whatsapp',
		crumbConversas: 'conversas',
		crumbVendas: 'vendas',
		crumbVenda: 'cotacao-venda',
		crumbCompras: 'compras',
		crumbRfq: 'cotacao-compra',
		crumbQualidade: 'qualidade',
		crumbDocs: 'documentos',
		cardVendaTitle: 'R$ 5,4321 / USD',
		cardVendaMeta: 'PTAX congelada · 12/08/2026',
		cardVendaLabel: 'câmbio da emissão',
		cardRfqTitle: 'ANHUI JINHE — 4,8500',
		cardRfqMeta: 'vencedora · T/T 90 days',
		cardRfqLabel: 'melhor oferta',
		cardDocsTitle: 'Kosher · CREATINA 200 MESH',
		cardDocsMeta: 'venceu 30/06/2026 · cobrada',
		cardDocsLabel: 'alerta de vencimento',
		// Tela Cotação de Venda.
		vendaBadge: 'emitida via WhatsApp',
		vendaGerar: 'Gerar PDF',
		colProduto: 'Produto',
		colQtd: 'Qtd',
		colPreco: 'Preço unit.',
		colSubtotal: 'Subtotal',
		vendaItem1: 'CREATINA 200 MESH — Creapure®',
		vendaItem2: 'ÁCIDO ASCÓRBICO (VIT. C) — LUWEI',
		tileNet: 'Total NET (USD)',
		tileImpostos: 'Total c/ impostos (R$)',
		tileDolar: 'Dólar da emissão',
		vendaFoot: 'ICMS SP 18% · PIS/COFINS conforme regime do cliente',
		// Tela BID / comparativo.
		rfqStatus: 'respondida',
		rfqMeta: '3 de 5 respostas',
		colExportador: 'Exportador',
		colFob: 'FOB USD/kg',
		colPrazo: 'Prazo',
		colVenc: 'Venc.',
		sugerida: 'sugerida',
		rfqBadgeIa: 'Planilha + IA',
		rfqBase: 'Base FOB ≈ 11,59/KG · normalizada a 90 dias',
		rfqFechar: 'Fechar cotação',
		rfqToast: 'Cotação fechada — CC-2026-0011 · contra-ofertas disparadas',
		// Tela Documentos.
		docsTitle: 'Documentos por produto',
		docsMeta: '1 pendência',
		colTipo: 'Tipo',
		colValidade: 'Validade',
		colStatus: 'Status',
		vigente: 'Vigente',
		aVencer: 'A vencer',
		vencido: 'Vencido',
		cobrado: 'Cobrado hoje',
		docsCobrar: 'Cobrar agora'
	},
	en: {
		contact: 'Southeast rep · Carlos',
		typing: 'Faradays typing…',
		channel: 'WhatsApp · own portfolio',
		chatAction: 'Quotes',
		ask: 'Put together a quote for 2 tons of creatine for Nestlé, delivery in SP',
		brandsBefore: 'I found ',
		brandsStrong: '2 brands',
		brandsAfter:
			' of creatine in the current price list: Creapure® and Hansong. Which one?',
		pick: 'Creapure',
		issued: "Quote COT-V-0187 issued — SP ICMS and today's exchange rate already computed.",
		pdfMeta: '2,000 kg · Creapure® · 1 page',
		inputPlaceholder: 'Message',
		contact2: 'South rep · Ana',
		contact2Preview: 'You: September price list?',
		contact3: 'Northeast rep · João',
		contact3Preview: 'Order PD-0453 invoiced',
		pdfName: 'COT-V-0187 · Nestlé SP.pdf',
		preview: 'preview',
		navHome: 'Home',
		navOverview: 'Overview',
		navWhatsapp: 'WhatsApp',
		navConversas: 'Conversations',
		navCompras: 'Purchasing',
		navBid: 'BID (Purchase RFQ)',
		navVendas: 'Sales',
		navVenda: 'Sales Quote',
		navPrecos: 'Price List',
		navQualidade: 'Quality',
		navDocs: 'Documents',
		account: 'Sales rep',
		crumbWhatsapp: 'whatsapp',
		crumbConversas: 'conversations',
		crumbVendas: 'sales',
		crumbVenda: 'sales-quote',
		crumbCompras: 'purchasing',
		crumbRfq: 'purchase-rfq',
		crumbQualidade: 'quality',
		crumbDocs: 'documents',
		cardVendaTitle: 'R$ 5.4321 / USD',
		cardVendaMeta: 'PTAX frozen · 12/08/2026',
		cardVendaLabel: 'issue-date rate',
		cardRfqTitle: 'ANHUI JINHE — 4.8500',
		cardRfqMeta: 'winner · T/T 90 days',
		cardRfqLabel: 'best offer',
		cardDocsTitle: 'Kosher · CREATINE 200 MESH',
		cardDocsMeta: 'expired 06/30/2026 · chased',
		cardDocsLabel: 'expiry alert',
		vendaBadge: 'issued via WhatsApp',
		vendaGerar: 'Generate PDF',
		colProduto: 'Product',
		colQtd: 'Qty',
		colPreco: 'Unit price',
		colSubtotal: 'Subtotal',
		vendaItem1: 'CREATINE 200 MESH — Creapure®',
		vendaItem2: 'ASCORBIC ACID (VIT. C) — LUWEI',
		tileNet: 'NET total (USD)',
		tileImpostos: 'Total w/ taxes (R$)',
		tileDolar: 'Issue-date dollar',
		vendaFoot: "SP ICMS 18% · PIS/COFINS per the client's tax regime",
		rfqStatus: 'answered',
		rfqMeta: '3 of 5 replies',
		colExportador: 'Exporter',
		colFob: 'FOB USD/kg',
		colPrazo: 'Terms',
		colVenc: 'Winner',
		sugerida: 'suggested',
		rfqBadgeIa: 'Sheet + AI',
		rfqBase: 'FOB base ≈ 11.59/KG · normalized to 90 days',
		rfqFechar: 'Close RFQ',
		rfqToast: 'RFQ closed — CC-2026-0011 · counter-offers sent',
		docsTitle: 'Documents by product',
		docsMeta: '1 pending',
		colTipo: 'Type',
		colValidade: 'Valid until',
		colStatus: 'Status',
		vigente: 'Valid',
		aVencer: 'Expiring',
		vencido: 'Expired',
		cobrado: 'Chased today',
		docsCobrar: 'Chase now'
	}
} satisfies Localized<Record<string, string>>

type Copy = (typeof COPY)['pt']

/**
 * Demo da seção de features: réplica em miniatura do app Monfiza (o portal
 * que o gestor usa de verdade) — sidebar, header com breadcrumb e quatro
 * telas empilhadas, uma por feature: Conversas (com o chat da Nestlé em
 * autoplay), Cotação de Venda, BID/comparativo e Documentos.
 *
 * O componente é o palco; quem anima é o HeroFeatureFlow, via GSAP sobre os
 * data-attrs abaixo (contrato):
 * - [data-demo-box]                     origem das coordenadas do cursor
 * - [data-screen="id"]                  telas (crossfade por autoAlpha)
 * - [data-nav-active="id"]              camada ativa do item de nav
 * - [data-crumb="id"]                   breadcrumb da tela
 * - [data-poi="…"]                      alvos do cursor (nav, botões, PDF)
 * - [data-overlay="…"]                  toasts
 * - [data-check-on] / [data-docs-badge-before|after]  mutações de tela
 * - [data-demo-card] / [data-demo-cursor] / [data-demo-cursor-ring]
 * - [data-feature-card="id"]            cards-eco das features 2–4
 * - --demo-w (custom property no box)   fator de largura: 1.15 em repouso
 *                                        (fold), 1 depois da diagonal
 *
 * Todas as camadas ocultas usam opacity (nunca display:none): os alvos
 * precisam ser mensuráveis por getBoundingClientRect antes de aparecer.
 * Único estado React: o passo do chat, confinado no ConversasScreen — o
 * flow o congela no quadro final via holdChat() antes do clique no PDF.
 */
export type MonfizaAppDemoHandle = {
	holdChat: (hold: boolean) => void
}

const BTN_PRIMARY =
	'bg-primary text-primary-foreground flex h-6 shrink-0 items-center gap-1.5 rounded-md px-2 font-mono text-[9px] font-medium tracking-wide uppercase'
const BTN_OUTLINE =
	'bg-background flex h-6 shrink-0 items-center gap-1.5 rounded-md border px-2 font-mono text-[9px] font-medium tracking-wide uppercase'

const TAG_TONES = {
	neutral: 'bg-muted text-muted-foreground',
	info: 'bg-blue-600/10 text-blue-700',
	success: 'bg-green-600/10 text-green-700',
	warning: 'bg-amber-500/10 text-amber-700',
	error: 'bg-destructive/10 text-destructive'
} as const

function Tag({
	tone,
	className,
	children
}: {
	tone: keyof typeof TAG_TONES
	className?: string
	children: ReactNode
}) {
	return (
		<span
			className={cn(
				'inline-flex shrink-0 items-center rounded-md px-1.5 py-px text-[9px] font-medium whitespace-nowrap',
				TAG_TONES[tone],
				className
			)}
		>
			{children}
		</span>
	)
}

/* ------------------------------------------------------------------ *
 * Sidebar
 * ------------------------------------------------------------------ */

type NavIcon = ComponentType<{ className?: string; weight?: 'fill' }>

function NavGroupLabel({
	icon: Icon,
	label
}: {
	icon: NavIcon
	label: string
}) {
	return (
		<p className="text-muted-foreground/70 flex h-6 items-center gap-2 px-2 text-[10px] font-medium">
			<Icon className="size-3.5 shrink-0" />
			<span className="hidden truncate xl:inline">{label}</span>
		</p>
	)
}

/* Linha de nav com camada ativa sobreposta: o flow faz o crossfade entre a
   base (muted) e a camada [data-nav-active] quando o cursor "clica". */
function NavRow({
	icon: Icon,
	label,
	screen,
	initialActive = false
}: {
	icon: NavIcon
	label: string
	screen?: string
	initialActive?: boolean
}) {
	return (
		<li
			data-poi={screen ? `nav-${screen}` : undefined}
			className="text-muted-foreground relative flex h-7 items-center gap-2 rounded-sm px-2"
		>
			<Icon className="size-3.5 shrink-0 opacity-80" />
			<span className="hidden truncate text-[11px] xl:inline">
				{label}
			</span>
			{screen ? (
				<span
					data-nav-active={screen}
					className={cn(
						'bg-brand/10 text-brand absolute inset-0 flex items-center gap-2 rounded-sm px-2 font-medium',
						!initialActive && 'opacity-0'
					)}
				>
					<Icon weight="fill" className="size-3.5 shrink-0" />
					<span className="hidden truncate text-[11px] xl:inline">
						{label}
					</span>
				</span>
			) : null}
		</li>
	)
}

function AppSidebar({ t }: { t: Copy }) {
	return (
		/* Rail de ícones até xl: abaixo disso a largura do frame não
		   comporta labels sem esmagar as tabelas das telas. */
		<aside className="bg-sidebar flex w-11 shrink-0 flex-col overflow-hidden border-r xl:w-36">
			<div className="flex h-10 shrink-0 items-center border-b px-3">
				<FaradaysMark className="h-3 w-auto xl:hidden" />
				<FaradaysLockup className="hidden h-3 w-auto xl:block" />
			</div>
			<nav className="flex flex-col gap-1.5 px-1.5 py-2">
				<div>
					<NavGroupLabel icon={House} label={t.navHome} />
					<ul className="flex flex-col gap-0.5 xl:pl-2">
						<NavRow icon={Pulse} label={t.navOverview} />
					</ul>
				</div>
				<div>
					<NavGroupLabel icon={WhatsappLogo} label={t.navWhatsapp} />
					<ul className="flex flex-col gap-0.5 xl:pl-2">
						<NavRow
							icon={ChatsCircle}
							label={t.navConversas}
							screen="whatsapp"
							initialActive
						/>
					</ul>
				</div>
				<div>
					<NavGroupLabel icon={TrendUp} label={t.navVendas} />
					<ul className="flex flex-col gap-0.5 xl:pl-2">
						<NavRow
							icon={FileText}
							label={t.navVenda}
							screen="venda"
						/>
						<NavRow icon={Table} label={t.navPrecos} />
					</ul>
				</div>
				<div>
					<NavGroupLabel icon={Package} label={t.navCompras} />
					<ul className="flex flex-col gap-0.5 xl:pl-2">
						<NavRow
							icon={ClipboardText}
							label={t.navBid}
							screen="rfq"
						/>
					</ul>
				</div>
				<div>
					<NavGroupLabel icon={ShieldCheck} label={t.navQualidade} />
					<ul className="flex flex-col gap-0.5 xl:pl-2">
						<NavRow icon={Files} label={t.navDocs} screen="docs" />
					</ul>
				</div>
			</nav>
		</aside>
	)
}

/* ------------------------------------------------------------------ *
 * Header (breadcrumbs empilhados, um por tela)
 * ------------------------------------------------------------------ */

const CRUMBS: { id: string; group: keyof Copy; leaf: keyof Copy }[] = [
	{ id: 'whatsapp', group: 'crumbWhatsapp', leaf: 'crumbConversas' },
	{ id: 'venda', group: 'crumbVendas', leaf: 'crumbVenda' },
	{ id: 'rfq', group: 'crumbCompras', leaf: 'crumbRfq' },
	{ id: 'docs', group: 'crumbQualidade', leaf: 'crumbDocs' }
]

function AppHeader({ t }: { t: Copy }) {
	return (
		<div className="flex h-10 shrink-0 items-center gap-2 border-b px-3">
			<div className="relative min-w-0 flex-1 self-stretch">
				{CRUMBS.map((crumb) => (
					<span
						key={crumb.id}
						data-crumb={crumb.id}
						className={cn(
							'text-muted-foreground absolute inset-0 flex items-center truncate font-mono text-[10px]',
							crumb.id !== 'whatsapp' && 'opacity-0'
						)}
					>
						<span className="truncate">
							{t[crumb.group]}{' '}
							<span className="text-muted-foreground/40">/</span>{' '}
							<span className="text-foreground font-medium">
								{t[crumb.leaf]}
							</span>
						</span>
					</span>
				))}
			</div>
			<span className="bg-muted text-muted-foreground flex size-5 shrink-0 items-center justify-center rounded-md text-[8px] font-semibold">
				R
			</span>
			<span className="hidden text-[10px] font-medium lg:inline">
				{t.account}
			</span>
		</div>
	)
}

/* ------------------------------------------------------------------ *
 * Tela 0 — Conversas (chat da Nestlé em autoplay, portado do antigo
 * WhatsAppHeroDemo)
 * ------------------------------------------------------------------ */

/* Passos do roteiro — cada um libera um bloco da conversa. O typing usa o
   passo seguinte como gatilho (mostra os pontinhos do autor que vem aí). */
const STEPS: readonly { at: number; typing?: 'bot' }[] = [
	{ at: 0.9 }, // 1 · rep pede a cotação
	{ at: 2.2, typing: 'bot' }, // 2 · bot digitando
	{ at: 3.6 }, // 3 · bot pergunta a marca (guarda)
	{ at: 5.2 }, // 4 · rep responde
	{ at: 6.2, typing: 'bot' }, // 5 · bot digitando
	{ at: 7.8 }, // 6 · cotação emitida + PDF
	{ at: 12.3 } // reset (fim do hold)
]

const FINAL_STEP = 6

function TypingDots() {
	return (
		<span className="flex items-center gap-1 px-1 py-1.5" aria-hidden>
			{[0, 1, 2].map((i) => (
				<span
					key={i}
					className="bg-foreground/40 size-1.5 animate-bounce rounded-full"
					style={{ animationDelay: `${i * 0.15}s` }}
				/>
			))}
		</span>
	)
}

/* Bolha da conversa — `side` decide autor (rep à direita, sistema à
   esquerda), visível a partir do passo `from`. */
function Bubble({
	from,
	step,
	side,
	children
}: {
	from: number
	step: number
	side: 'rep' | 'bot'
	children: ReactNode
}) {
	const visible = step >= from
	return (
		<div
			className={cn(
				'flex transition-all duration-300 ease-out',
				side === 'rep'
					? 'origin-bottom-right justify-end'
					: 'origin-bottom-left justify-start',
				visible
					? 'scale-100 opacity-100'
					: 'pointer-events-none scale-75 opacity-0'
			)}
		>
			<div
				className={cn(
					'w-fit max-w-[85%] px-3 py-2 shadow-sm',
					side === 'rep'
						? 'bg-brand text-brand-foreground rounded-2xl rounded-br-md'
						: 'bg-card text-foreground rounded-2xl rounded-bl-md border'
				)}
			>
				{children}
			</div>
		</div>
	)
}

function ConversasScreen({
	t,
	handleRef
}: {
	t: Copy
	handleRef?: Ref<MonfizaAppDemoHandle>
}) {
	const rootRef = useRef<HTMLDivElement>(null)
	const [step, setStep] = useState(0)
	const ready = usePageReady()
	const tlRef = useRef<gsap.core.Timeline | null>(null)
	const heldRef = useRef(false)

	/* O flow congela o chat no quadro final (PDF em cena) quando o hold da
	   feature 0 começa — garante o alvo do clique do cursor. */
	useImperativeHandle(
		handleRef,
		() => ({
			holdChat(hold: boolean) {
				heldRef.current = hold
				if (hold) {
					tlRef.current?.pause()
					setStep(FINAL_STEP)
				} else {
					setStep(0)
					tlRef.current?.play(0)
				}
			}
		}),
		[]
	)

	useEffect(() => {
		const root = rootRef.current
		if (!root || !ready) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			// Quadro final estático, sem loop.
			const still = gsap.delayedCall(0, () => setStep(FINAL_STEP))
			return () => {
				still.kill()
			}
		}

		const tl = gsap.timeline({ repeat: -1 })
		STEPS.forEach((s, i) => {
			tl.call(
				() => setStep(i === STEPS.length - 1 ? 0 : i + 1),
				undefined,
				s.at
			)
		})
		tlRef.current = tl

		/* Fora da viewport a conversa congela — mesma regra dos canvases.
		   Com o hold ativo o observer não religa o loop. */
		const io = new IntersectionObserver(
			(entries) => {
				if (heldRef.current) return
				if (entries.some((entry) => entry.isIntersecting)) tl.play()
				else tl.pause()
			},
			{ rootMargin: '100px' }
		)
		io.observe(root)

		return () => {
			io.disconnect()
			tl.kill()
			tlRef.current = null
			setStep(0)
		}
	}, [ready])

	const typing = STEPS[step]?.typing === 'bot' && step < FINAL_STEP

	return (
		<div
			ref={rootRef}
			data-screen="whatsapp"
			className="absolute inset-0 flex"
		>
			{/* Lista de conversas (só em telas largas — o quadro vivo). */}
			<div className="hidden w-40 shrink-0 flex-col border-r xl:flex">
				<div className="bg-brand/[0.06] border-b px-2.5 py-2">
					<p className="truncate text-[11px] font-medium">
						{t.contact}
					</p>
					<p className="text-muted-foreground truncate text-[10px]">
						{t.issued}
					</p>
				</div>
				<div className="border-b px-2.5 py-2">
					<p className="truncate text-[11px] font-medium">
						{t.contact2}
					</p>
					<p className="text-muted-foreground truncate text-[10px]">
						{t.contact2Preview}
					</p>
				</div>
				<div className="border-b px-2.5 py-2">
					<p className="truncate text-[11px] font-medium">
						{t.contact3}
					</p>
					<p className="text-muted-foreground truncate text-[10px]">
						{t.contact3Preview}
					</p>
				</div>
			</div>

			{/* Painel da conversa. */}
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="flex items-center gap-2.5 border-b px-3 py-2">
					<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#25d366]/15 text-[#128c4b]">
						<WhatsappLogo weight="fill" className="size-4" />
					</span>
					<div className="min-w-0 flex-1">
						<p className="truncate text-xs font-medium">
							{t.contact}
						</p>
						<p className="text-muted-foreground truncate font-mono text-[9px]">
							{typing ? t.typing : t.channel}
						</p>
					</div>
					<span className={BTN_OUTLINE}>
						<FileText className="size-3" />
						{t.chatAction}
					</span>
				</div>

				{/* `overflow-hidden`: a coluna é `justify-end`, então quando as
				   mensagens não cabem o excedente sai POR CIMA (e pintava sobre
				   o header do contato). Cortando na borda, o que sobra sai de
				   cena como o scrollback de um chat de verdade. */}
				<div className="bg-muted/40 flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden p-3">
					<Bubble from={1} step={step} side="rep">
						<p className="text-body-sm">{t.ask}</p>
						<span className="mt-0.5 flex items-center justify-end gap-1 font-mono text-[9px] opacity-70">
							09:41 <Checks className="size-3" />
						</span>
					</Bubble>

					{/* A guarda em cena: duas marcas no catálogo → a IA
					   pergunta em vez de escolher. */}
					<Bubble from={3} step={step} side="bot">
						<span className="text-foreground/50 font-mono text-[9px] tracking-widest uppercase">
							Faradays
						</span>
						<p className="text-body-sm mt-0.5">
							{t.brandsBefore}
							<strong>{t.brandsStrong}</strong>
							{t.brandsAfter}
						</p>
					</Bubble>

					<Bubble from={4} step={step} side="rep">
						<p className="text-body-sm">{t.pick}</p>
						<span className="mt-0.5 flex items-center justify-end gap-1 font-mono text-[9px] opacity-70">
							09:42 <Checks className="size-3" />
						</span>
					</Bubble>

					<Bubble from={6} step={step} side="bot">
						<span className="text-foreground/50 font-mono text-[9px] tracking-widest uppercase">
							Faradays
						</span>
						<p className="text-body-sm mt-0.5 flex items-center gap-1.5">
							<CheckCircle
								weight="fill"
								className="text-brand size-4 shrink-0"
							/>
							{t.issued}
						</p>
						{/* Documento na conversa, como o bot envia de verdade —
						   é o alvo do clique do cursor no hold. */}
						<div
							data-poi="chat-pdf"
							className="bg-muted/60 mt-2 flex items-center gap-2.5 rounded-lg border px-2.5 py-2"
						>
							<FilePdf
								weight="fill"
								className="size-7 shrink-0 text-[#d93025]"
							/>
							<div className="min-w-0">
								<p className="truncate text-xs font-medium">
									{t.pdfName}
								</p>
								<p className="text-muted-foreground font-mono text-[10px]">
									{t.pdfMeta}
								</p>
							</div>
						</div>
					</Bubble>

					{typing && (
						<div className="bg-card w-fit rounded-2xl rounded-bl-md border px-2 shadow-sm">
							<TypingDots />
						</div>
					)}
				</div>

				{/* Barra de input decorativa. */}
				<div className="flex items-center gap-2.5 border-t px-3 py-2">
					<Paperclip className="text-foreground/40 size-4 shrink-0" />
					<span className="bg-muted text-muted-foreground flex-1 rounded-full px-3 py-1.5 text-xs">
						{t.inputPlaceholder}
					</span>
					<Microphone className="text-foreground/40 size-4 shrink-0" />
				</div>
			</div>
		</div>
	)
}

/* ------------------------------------------------------------------ *
 * Tela 1 — Cotação de Venda
 * ------------------------------------------------------------------ */

const VENDA_GRID =
	'grid grid-cols-[minmax(0,1fr)_3.4rem_4rem_4.6rem] items-center gap-x-2'

function VendaScreen({ t }: { t: Copy }) {
	return (
		<div
			data-screen="venda"
			className="absolute inset-0 flex flex-col gap-2.5 p-3 opacity-0"
		>
			<div className="flex items-center gap-2">
				<p className="truncate font-mono text-[11px] font-semibold">
					COT-V-0187 · Nestlé SP
				</p>
				<Tag tone="info">{t.vendaBadge}</Tag>
				<span className="flex-1" />
				<span data-poi="venda-gerar" className={BTN_PRIMARY}>
					<FilePdf className="size-3" />
					{t.vendaGerar}
				</span>
			</div>

			<div className="rounded-lg border">
				<div
					className={cn(
						VENDA_GRID,
						'text-muted-foreground border-b px-2.5 py-1.5 font-mono text-[8px] tracking-wide uppercase'
					)}
				>
					<span>{t.colProduto}</span>
					<span className="text-right">{t.colQtd}</span>
					<span className="text-right">{t.colPreco}</span>
					<span className="text-right">{t.colSubtotal}</span>
				</div>
				<div className={cn(VENDA_GRID, 'border-b px-2.5 py-2')}>
					<span className="truncate text-[10px] font-medium">
						{t.vendaItem1}
					</span>
					<span className="text-right font-mono text-[10px] tabular-nums">
						2.000 KG
					</span>
					<span className="text-right font-mono text-[10px] tabular-nums">
						USD 4,25
					</span>
					<span className="text-right font-mono text-[10px] tabular-nums">
						USD 8.500,00
					</span>
				</div>
				<div className={cn(VENDA_GRID, 'px-2.5 py-2')}>
					<span className="truncate text-[10px] font-medium">
						{t.vendaItem2}
					</span>
					<span className="text-right font-mono text-[10px] tabular-nums">
						500 KG
					</span>
					<span className="text-right font-mono text-[10px] tabular-nums">
						USD 2,75
					</span>
					<span className="text-right font-mono text-[10px] tabular-nums">
						USD 1.375,00
					</span>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-2">
				<div className="bg-muted/50 rounded-lg p-2 text-center">
					<p className="text-muted-foreground font-mono text-[8px] tracking-wide uppercase">
						{t.tileNet}
					</p>
					<p className="mt-0.5 text-[11px] font-semibold tabular-nums">
						USD 9.875,00
					</p>
				</div>
				<div className="bg-muted/50 rounded-lg p-2 text-center">
					<p className="text-muted-foreground font-mono text-[8px] tracking-wide uppercase">
						{t.tileImpostos}
					</p>
					<p className="mt-0.5 text-[11px] font-semibold tabular-nums">
						R$ 64.907,32
					</p>
				</div>
				<div className="bg-muted/50 rounded-lg p-2 text-center">
					<p className="text-muted-foreground font-mono text-[8px] tracking-wide uppercase">
						{t.tileDolar}
					</p>
					<p className="mt-0.5 text-[11px] font-semibold tabular-nums">
						R$ 5,4321 · 12/08/2026
					</p>
				</div>
			</div>

			<p className="text-muted-foreground/70 font-mono text-[9px]">
				{t.vendaFoot}
			</p>
		</div>
	)
}

/* ------------------------------------------------------------------ *
 * Tela 2 — BID / comparativo de respostas
 * ------------------------------------------------------------------ */

const RFQ_GRID =
	'grid grid-cols-[minmax(0,1fr)_3.6rem_5rem_2.2rem] items-center gap-x-2'

function FakeCheckbox({ poi }: { poi?: string }) {
	return (
		<span
			data-poi={poi}
			className="border-foreground/25 relative mx-auto flex size-3 items-center justify-center rounded-[3px] border"
		>
			{poi ? (
				<span
					data-check-on
					className="absolute -inset-px flex items-center justify-center rounded-[3px] bg-green-600 opacity-0"
				>
					<Check weight="bold" className="size-2 text-white" />
				</span>
			) : null}
		</span>
	)
}

function RfqScreen({ t }: { t: Copy }) {
	return (
		<div
			data-screen="rfq"
			className="absolute inset-0 flex flex-col gap-2.5 p-3 opacity-0"
		>
			<div className="flex items-center gap-2">
				<p className="truncate font-mono text-[11px] font-semibold">
					CC-2026-0011
				</p>
				<Tag tone="warning">{t.rfqStatus}</Tag>
				<span className="text-muted-foreground truncate font-mono text-[9px]">
					{t.rfqMeta}
				</span>
			</div>

			<div className="min-h-0 flex-1 overflow-hidden rounded-lg border">
				<div className="bg-muted/30 flex items-center gap-2 border-b px-2.5 py-1.5">
					<span className="truncate text-[10px] font-medium">
						CREATINA 200 MESH
					</span>
					<span className="flex-1" />
					<span className="text-muted-foreground font-mono text-[9px] tabular-nums">
						1 FCL 40&apos; · 27.000 KG
					</span>
				</div>
				<div
					className={cn(
						RFQ_GRID,
						'text-muted-foreground border-b px-2.5 py-1.5 font-mono text-[8px] tracking-wide uppercase'
					)}
				>
					<span>{t.colExportador}</span>
					<span className="text-right">{t.colFob}</span>
					<span className="text-right">{t.colPrazo}</span>
					<span className="text-center">{t.colVenc}</span>
				</div>
				<div
					className={cn(
						RFQ_GRID,
						'border-b bg-green-500/5 px-2.5 py-2'
					)}
				>
					<span className="flex min-w-0 items-center gap-1.5">
						<span className="truncate text-[10px] font-medium">
							ANHUI JINHE
						</span>
						<span className="shrink-0 text-[8px] font-semibold tracking-wide text-green-700 uppercase">
							{t.sugerida}
						</span>
					</span>
					<span className="text-right font-mono text-[10px] tabular-nums">
						4,8500
					</span>
					<span className="text-right font-mono text-[10px] whitespace-nowrap">
						T/T 90 days
					</span>
					<FakeCheckbox poi="rfq-check" />
				</div>
				<div className={cn(RFQ_GRID, 'border-b px-2.5 py-2')}>
					<span className="truncate text-[10px] font-medium">
						VITASWEET
					</span>
					<span className="text-right font-mono text-[10px] tabular-nums">
						5,0200
					</span>
					<span className="text-right font-mono text-[10px] whitespace-nowrap">
						T/T 30 days
					</span>
					<FakeCheckbox />
				</div>
				<div className={cn(RFQ_GRID, 'px-2.5 py-2')}>
					<span className="flex min-w-0 items-center gap-1.5">
						<span className="truncate text-[10px] font-medium">
							ENSIGN
						</span>
						<Tag tone="warning">{t.rfqBadgeIa}</Tag>
					</span>
					<span className="text-right font-mono text-[10px] tabular-nums">
						5,1100
					</span>
					<span className="text-right font-mono text-[10px] whitespace-nowrap">
						L/C at sight
					</span>
					<FakeCheckbox />
				</div>
			</div>

			<div className="flex items-center gap-2">
				<p className="text-muted-foreground/70 min-w-0 truncate font-mono text-[9px]">
					{t.rfqBase}
				</p>
				<span className="flex-1" />
				<span data-poi="rfq-fechar" className={BTN_PRIMARY}>
					<CheckCircle className="size-3" />
					{t.rfqFechar}
				</span>
			</div>
		</div>
	)
}

/* ------------------------------------------------------------------ *
 * Tela 3 — Documentos (matriz de vigência)
 * ------------------------------------------------------------------ */

/* Última coluna fixa (não `auto`): cada linha é um grid próprio, e um
   `auto` resolveria largura por linha, desalinhando as colunas. */
const DOCS_GRID =
	'grid grid-cols-[minmax(0,1fr)_2.6rem_3.9rem_4.6rem_4.6rem] items-center gap-x-2'

function DocsScreen({ t }: { t: Copy }) {
	return (
		<div
			data-screen="docs"
			className="absolute inset-0 flex flex-col gap-2.5 p-3 opacity-0"
		>
			<div className="flex items-center gap-2">
				<p className="truncate text-[11px] font-medium">
					{t.docsTitle}
				</p>
				<span className="flex-1" />
				<span className="text-muted-foreground font-mono text-[9px]">
					{t.docsMeta}
				</span>
			</div>

			<div className="rounded-lg border">
				<div
					className={cn(
						DOCS_GRID,
						'text-muted-foreground border-b px-2.5 py-1.5 font-mono text-[8px] tracking-wide uppercase'
					)}
				>
					<span>{t.colProduto}</span>
					<span>{t.colTipo}</span>
					<span className="text-right">{t.colValidade}</span>
					<span>{t.colStatus}</span>
					<span />
				</div>
				<div className={cn(DOCS_GRID, 'border-b px-2.5 py-2')}>
					<span className="truncate text-[10px] font-medium">
						CREATINA 200 MESH
					</span>
					<span className="font-mono text-[10px]">COA</span>
					<span className="text-right font-mono text-[10px] tabular-nums">
						12/03/2027
					</span>
					<Tag tone="success">{t.vigente}</Tag>
					<span />
				</div>
				<div className={cn(DOCS_GRID, 'border-b px-2.5 py-2')}>
					<span className="truncate text-[10px] font-medium">
						ÁCIDO ASCÓRBICO
					</span>
					<span className="font-mono text-[10px]">Halal</span>
					<span className="text-right font-mono text-[10px] tabular-nums">
						15/09/2026
					</span>
					<Tag tone="warning">{t.aVencer}</Tag>
					<span />
				</div>
				<div className={cn(DOCS_GRID, 'px-2.5 py-2')}>
					<span className="truncate text-[10px] font-medium">
						CREATINA 200 MESH
					</span>
					<span className="font-mono text-[10px]">Kosher</span>
					<span className="text-right font-mono text-[10px] tabular-nums">
						30/06/2026
					</span>
					{/* Badge em duas camadas: o flow troca Vencido → Cobrado
					   hoje quando o cursor clica em "Cobrar agora". */}
					<span className="inline-grid justify-items-start">
						<span
							data-docs-badge-before
							className="col-start-1 row-start-1 inline-flex"
						>
							<Tag tone="error">{t.vencido}</Tag>
						</span>
						<span
							data-docs-badge-after
							className="col-start-1 row-start-1 inline-flex opacity-0"
						>
							<Tag tone="info">{t.cobrado}</Tag>
						</span>
					</span>
					<span
						data-poi="docs-cobrar"
						className={cn(
							BTN_OUTLINE,
							'h-5 justify-center px-1.5 text-[8px] whitespace-nowrap'
						)}
					>
						{t.docsCobrar}
					</span>
				</div>
			</div>
		</div>
	)
}

/* ------------------------------------------------------------------ *
 * Overlays (toasts), pré-renderizados ocultos
 * ------------------------------------------------------------------ */

/* Só o toast do BID: a tela de venda não tem overlay — o clique em
   "Gerar PDF" responde com o card-eco fora do frame (câmbio congelado),
   no mesmo padrão do card de PDF do bloco 1. */
function Overlays({ t }: { t: Copy }) {
	return (
		<>
			<div
				data-overlay="rfq-toast"
				className="bg-card absolute right-2.5 bottom-2.5 z-40 flex items-center gap-2 rounded-lg border px-2.5 py-2 opacity-0 shadow-lg"
			>
				<CheckCircle
					weight="fill"
					className="size-3.5 shrink-0 text-green-600"
				/>
				<p className="text-[10px]">{t.rfqToast}</p>
			</div>
		</>
	)
}

/* ------------------------------------------------------------------ *
 * Cards-eco das features 2–4 — mesma anatomia do card de PDF do bloco
 * 1, com overhang à direita do frame (a demo fica na metade esquerda
 * nessas features). O flow os anima via [data-feature-card].
 * ------------------------------------------------------------------ */

function EchoCard({
	name,
	icon,
	title,
	meta,
	label
}: {
	name: string
	icon: ReactNode
	title: string
	meta: string
	label: string
}) {
	return (
		<div
			data-feature-card={name}
			/* Beiral de 4rem (não 10): nos blocos 2-4 a demo fica na metade
			   ESQUERDA e o card é o que chega mais perto da copy da direita.
			   Com a caixa em 52vw, um beiral maior põe o card por cima do
			   parágrafo — a soma "margem + caixa + beiral" tem de caber antes
			   do texto da coluna da direita. */
			className="absolute -right-16 bottom-[16%] hidden w-64 opacity-0 lg:block"
		>
			{/* Wrapper de fade separado do pop: a entrada (echoTl) anima o
			   card externo e a saída (byeTl) anima este wrapper —
			   propriedades independentes, toggles nunca disputam o mesmo
			   autoAlpha. Todo o paint fica aqui: o externo invisível não
			   pode deixar casca (bg/borda/sombra) para trás. */}
			<div
				data-feature-card-fade
				className="bg-card rounded-xl border p-4 shadow-2xl"
			>
				<div className="flex items-center gap-2.5">
					{icon}
					<div className="min-w-0">
						<p className="truncate text-xs font-medium">{title}</p>
						<p className="text-muted-foreground truncate font-mono text-[10px]">
							{meta}
						</p>
					</div>
				</div>
				<div aria-hidden className="mt-3 flex flex-col gap-1.5">
					<div className="bg-foreground/10 h-1.5 w-full rounded-full" />
					<div className="bg-foreground/10 h-1.5 w-4/5 rounded-full" />
					<div className="bg-foreground/10 h-1.5 w-3/5 rounded-full" />
				</div>
				<span className="text-foreground/40 mt-3 block font-mono text-[9px] tracking-widest uppercase">
					{label}
				</span>
			</div>
		</div>
	)
}

/* ------------------------------------------------------------------ */

export function MonfizaAppDemo({ ref }: { ref?: Ref<MonfizaAppDemoHandle> }) {
	const t = useCopy(COPY)

	return (
		<div className="relative z-10 flex h-full items-center justify-center p-5 md:p-8">
			{/* aria-hidden: a demo é ilustração das features — a copy real
			   está nos blocos de texto ao lado. */}
			{/* Largura no lg+ multiplicada por --demo-w: 1.15 em repouso (a
			   demo aparece mais larga na dobra) e o flow tweena para 1
			   junto com a diagonal — a fórmula fica no CSS (rem/vw), então
			   resize não descalibra nada. */}
			<div
				data-demo-box
				aria-hidden
				className="relative h-full max-h-[36rem] w-[min(34rem,100%)] [--demo-w:1.15] lg:w-[min(52rem*var(--demo-w),52vw*var(--demo-w))]"
			>
				{/* Frame do app — único elemento com overflow-hidden (leaf:
				   nunca um ancestral do sticky). */}
				<div className="bg-card/95 flex h-full overflow-hidden rounded-lg border shadow-2xl">
					<AppSidebar t={t} />
					<div className="flex min-w-0 flex-1 flex-col">
						<AppHeader t={t} />
						<div className="relative min-h-0 flex-1">
							<ConversasScreen t={t} handleRef={ref} />
							<VendaScreen t={t} />
							<RfqScreen t={t} />
							<DocsScreen t={t} />
							<Overlays t={t} />
						</div>
					</div>
				</div>

				{/* Card de preview do PDF — surge logo depois do clique do
				   cursor no PDF (bloco 1), fora do frame (overhang à
				   esquerda). */}
				<div
					data-demo-card
					className="absolute bottom-[16%] -left-40 hidden w-64 opacity-0 lg:block"
				>
					{/* Mesmo desacoplamento dos cards-eco: pop no card
					   (cardTl), saída no wrapper (exitTl), paint todo no
					   wrapper para o externo não deixar casca. */}
					<div
						data-demo-card-fade
						className="bg-card rounded-xl border p-4 shadow-2xl"
					>
						<div className="flex items-center gap-2.5">
							<FilePdf
								weight="fill"
								className="size-7 shrink-0 text-[#d93025]"
							/>
							<div className="min-w-0">
								<p className="truncate text-xs font-medium">
									{t.pdfName}
								</p>
								<p className="text-muted-foreground font-mono text-[10px]">
									{t.pdfMeta}
								</p>
							</div>
						</div>
						<div aria-hidden className="mt-3 flex flex-col gap-1.5">
							<div className="bg-foreground/10 h-1.5 w-full rounded-full" />
							<div className="bg-foreground/10 h-1.5 w-4/5 rounded-full" />
							<div className="bg-foreground/10 h-1.5 w-3/5 rounded-full" />
						</div>
						<span className="text-foreground/40 mt-3 block font-mono text-[9px] tracking-widest uppercase">
							{t.preview}
						</span>
					</div>
				</div>

				{/* Cards-eco das features 2–4: cada um surge no fim da tour da
				   sua tela (logo depois do clique, independente do scroll)
				   e o flow apaga o wrapper no fim do hold. */}
				<EchoCard
					name="venda"
					icon={
						<CurrencyCircleDollar
							weight="fill"
							className="text-brand size-7 shrink-0"
						/>
					}
					title={t.cardVendaTitle}
					meta={t.cardVendaMeta}
					label={t.cardVendaLabel}
				/>
				<EchoCard
					name="rfq"
					icon={
						<Medal
							weight="fill"
							className="size-7 shrink-0 text-amber-500"
						/>
					}
					title={t.cardRfqTitle}
					meta={t.cardRfqMeta}
					label={t.cardRfqLabel}
				/>
				<EchoCard
					name="docs"
					icon={
						<BellRinging
							weight="fill"
							className="text-destructive size-7 shrink-0"
						/>
					}
					title={t.cardDocsTitle}
					meta={t.cardDocsMeta}
					label={t.cardDocsLabel}
				/>

				{/* Cursor fake — posicionado 100% por GSAP (x/y relativos ao
				   box), viaja aos [data-poi] e clica (anel de ripple). */}
				<div className="pointer-events-none absolute inset-0 z-50 hidden lg:block">
					<div
						data-demo-cursor
						className="absolute top-0 left-0 opacity-0 will-change-transform"
					>
						<span
							data-demo-cursor-ring
							className="border-foreground/50 absolute -top-1.5 -left-1.5 size-8 rounded-full border opacity-0"
						/>
						<Cursor
							weight="fill"
							className="text-foreground size-5 drop-shadow-md"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
