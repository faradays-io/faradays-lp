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
	Sparkle,
	Table,
	TrendUp,
	WhatsappLogo
} from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ComponentProps, ComponentType, ReactNode, Ref } from 'react'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'

import {
	FaradaysLockup,
	FaradaysMark
} from '@/components/landing/faradays-lockup'
import { useCopy } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

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
		// Itens 3–6: só no quadro da v2 (seis linhas para o recorte).
		vendaItem3: 'TAURINA — YONGAN',
		vendaItem4: 'CAFEÍNA ANIDRA — CSPC',
		vendaItem5: 'BETA-ALANINA — HUAYANG',
		vendaItem6: 'GLUTAMINA — MEIHUA',
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
		/* Quadro RFQ do recorte da v2: seis respostas. `dec` é o separador
		   decimal dos preços — os números vivem na tabela, não na copy. */
		rfqBoardMeta: '6 de 8 respostas',
		dec: ',',
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
		docsCobrar: 'Cobrar agora',
		// Tipos de documento (quadro da v2).
		docCoa: 'COA',
		docHalal: 'Halal',
		docKosher: 'Kosher',
		docAlergenos: 'Alérgenos',
		/* Tela 4 (só no recorte da v2) — o quadro do gestor: reps, última
		   mensagem, pendências e falhas, ao vivo. */
		portalTitle: 'Representantes',
		portalLive: 'ao vivo',
		colRep: 'Rep',
		colUltima: 'Última mensagem',
		colPend: 'Pend.',
		portalRep2: 'Rep. Sul · Ana',
		portalRep3: 'Rep. Nordeste · Rafael',
		portalMsg1: 'Cotação COT-V-0187 emitida',
		portalMsg2: 'Preço do ácido ascórbico?',
		portalMsg3: 'Boleto da NF 8812',
		portalRep4: 'Rep. Centro-Oeste · Bruno',
		portalRep5: 'Rep. Norte · Júlia',
		portalRep6: 'Rep. Minas · Paulo',
		portalMsg4: 'Status do pedido 4471',
		portalMsg5: 'Laudo Kosher da creatina',
		portalMsg6: 'Estoque de taurina, lote 22',
		portalOk: 'em dia',
		portalPend: '2 pendências',
		portalPend1: '1 pendência',
		portalFail: 'falha de envio',
		cardPortalTitle: '6 reps · 3 pendências · 1 falha',
		cardPortalMeta: 'atualizado agora · sem refresh',
		cardPortalLabel: 'quadro ao vivo'
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
		vendaItem3: 'TAURINE — YONGAN',
		vendaItem4: 'ANHYDROUS CAFFEINE — CSPC',
		vendaItem5: 'BETA-ALANINE — HUAYANG',
		vendaItem6: 'GLUTAMINE — MEIHUA',
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
		rfqBoardMeta: '6 of 8 replies',
		dec: '.',
		docsTitle: 'Documents by product',
		docsMeta: '1 pending',
		colTipo: 'Type',
		colValidade: 'Valid until',
		colStatus: 'Status',
		vigente: 'Valid',
		aVencer: 'Expiring',
		vencido: 'Expired',
		cobrado: 'Chased today',
		docsCobrar: 'Chase now',
		docCoa: 'COA',
		docHalal: 'Halal',
		docKosher: 'Kosher',
		docAlergenos: 'Allergens',
		portalTitle: 'Reps',
		portalLive: 'live',
		colRep: 'Rep',
		colUltima: 'Last message',
		colPend: 'Pending',
		portalRep2: 'Rep. South · Ana',
		portalRep3: 'Rep. Northeast · Rafael',
		portalMsg1: 'Quote COT-V-0187 issued',
		portalMsg2: 'Ascorbic acid price?',
		portalMsg3: 'Invoice 8812 slip',
		portalRep4: 'Rep. Midwest · Bruno',
		portalRep5: 'Rep. North · Júlia',
		portalRep6: 'Rep. Minas · Paulo',
		portalMsg4: 'Order 4471 status',
		portalMsg5: 'Creatine Kosher certificate',
		portalMsg6: 'Taurine stock, batch 22',
		portalOk: 'up to date',
		portalPend: '2 pending',
		portalPend1: '1 pending',
		portalFail: 'send failure',
		cardPortalTitle: '6 reps · 3 pending · 1 failure',
		cardPortalMeta: 'updated just now · no refresh',
		cardPortalLabel: 'live board'
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
 *
 * Modo estático (`screen`): a demo vira um quadro parado de UMA tela — nav
 * ativa, breadcrumb, tela e o card daquela feature já em cena, sem cursor
 * nem tour. É a ilustração de cada feature na v2 (`FeatureIndex`), que não
 * tem coreografia. Os cards das outras features nem renderizam; o chat fica
 * congelado no quadro final (PDF em cena), que é o que o card ao lado
 * comenta. Sem `screen` nada muda: a v1 continua recebendo as quatro telas
 * empilhadas e os cards apagados para o GSAP.
 */
export type MonfizaAppDemoHandle = {
	holdChat: (hold: boolean) => void
}

/** As quatro telas da demo — uma por feature de destaque (HOME_FEATURES). */
export type DemoScreen = 'whatsapp' | 'venda' | 'rfq' | 'docs'

const BTN_PRIMARY =
	'bg-primary text-primary-foreground flex h-6 shrink-0 items-center gap-1.5 rounded-md px-2 font-mono text-[9px] font-medium tracking-wide uppercase'
const BTN_OUTLINE =
	'bg-background flex h-6 shrink-0 items-center gap-1.5 rounded-md border px-2 font-mono text-[9px] font-medium tracking-wide uppercase'

const TAG_TONES = {
	/* Identidade de IA: pill com borda em gradiente frio (globals.css). */
	ai: 'ai-badge',
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

function AppSidebar({ t, active }: { t: Copy; active: DemoScreen }) {
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
							initialActive={active === 'whatsapp'}
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
							initialActive={active === 'venda'}
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
							initialActive={active === 'rfq'}
						/>
					</ul>
				</div>
				<div>
					<NavGroupLabel icon={ShieldCheck} label={t.navQualidade} />
					<ul className="flex flex-col gap-0.5 xl:pl-2">
						<NavRow
							icon={Files}
							label={t.navDocs}
							screen="docs"
							initialActive={active === 'docs'}
						/>
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

function AppHeader({ t, active }: { t: Copy; active: DemoScreen }) {
	return (
		<div className="flex h-10 shrink-0 items-center gap-2 border-b px-3">
			<div className="relative min-w-0 flex-1 self-stretch">
				{CRUMBS.map((crumb) => (
					<span
						key={crumb.id}
						data-crumb={crumb.id}
						className={cn(
							'text-muted-foreground absolute inset-0 flex items-center truncate font-mono text-[10px]',
							crumb.id !== active && 'opacity-0'
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
	/* Pontinhos na paleta fria da IA — é ela quem está digitando. */
	return (
		<span className="flex items-center gap-1 px-1 py-1.5" aria-hidden>
			{['#1d6ae5', '#38bdf8', '#7c8cf8'].map((color, i) => (
				<span
					key={color}
					className="size-1.5 animate-bounce rounded-full"
					style={{
						backgroundColor: color,
						animationDelay: `${i * 0.15}s`
					}}
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
	handleRef,
	active = true,
	still = false
}: {
	t: Copy
	handleRef?: Ref<MonfizaAppDemoHandle>
	/** Tela visível de saída (a v1 sempre abre nela). */
	active?: boolean
	/** Quadro final parado (PDF em cena), sem loop — modo estático. */
	still?: boolean
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
		// Escondida atrás de outra tela não há o que animar.
		if (!root || !ready || !active) return
		if (
			still ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			// Quadro final estático, sem loop.
			const freeze = gsap.delayedCall(0, () => setStep(FINAL_STEP))
			return () => {
				freeze.kill()
			}
		}

		const tl = gsap.timeline({ repeat: -1 })
		STEPS.forEach((s, i) => {
			const last = i === STEPS.length - 1
			tl.call(() => setStep(last ? 0 : i + 1), undefined, s.at)
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
	}, [ready, active, still])

	const typing = STEPS[step]?.typing === 'bot' && step < FINAL_STEP

	return (
		<div
			ref={rootRef}
			data-screen="whatsapp"
			className={cn('absolute inset-0 flex', !active && 'opacity-0')}
		>
			{/* Só o painel da conversa: a lista de contatos saiu, e a
			   conversa ativa ocupa a tela inteira. */}
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="flex items-center gap-2.5 border-b px-3 py-2">
					<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#25d366]/15 text-[#128c4b]">
						<WhatsappLogo weight="fill" className="size-4" />
					</span>
					<div className="min-w-0 flex-1">
						<p className="truncate text-xs font-medium">
							{t.contact}
						</p>
						<p className="truncate font-mono text-[9px]">
							{/* Shimmer frio = IA agindo agora (digitando). */}
							{typing ? (
								<span className="ai-shimmer">{t.typing}</span>
							) : (
								<span className="text-muted-foreground">
									{t.channel}
								</span>
							)}
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
						<span className="text-foreground/50 flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase">
							<Sparkle
								weight="fill"
								className="size-2.5 shrink-0 text-[#4aa8ff]"
							/>
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
						<span className="text-foreground/50 flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase">
							<Sparkle
								weight="fill"
								className="size-2.5 shrink-0 text-[#4aa8ff]"
							/>
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

					<div
						className={cn(
							'bg-card w-fit rounded-2xl rounded-bl-md border px-2 shadow-sm',
							!typing && 'hidden'
						)}
					>
						<TypingDots />
					</div>
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

function VendaScreen({ t, active = false }: { t: Copy; active?: boolean }) {
	return (
		<div
			data-screen="venda"
			className={cn(
				'absolute inset-0 flex flex-col gap-2.5 p-3',
				!active && 'opacity-0'
			)}
		>
			<div className="flex items-center gap-2">
				<p className="truncate font-mono text-[11px] font-semibold">
					COT-V-0187 · Nestlé SP
				</p>
				{/* Cotação montada pela IA na conversa → badge de IA. */}
				<Tag tone="ai" className="gap-1">
					<Sparkle
						weight="fill"
						className="size-2 shrink-0 text-[#4aa8ff]"
					/>
					{t.vendaBadge}
				</Tag>
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

function RfqScreen({ t, active = false }: { t: Copy; active?: boolean }) {
	return (
		<div
			data-screen="rfq"
			className={cn(
				'absolute inset-0 flex flex-col gap-2.5 p-3',
				!active && 'opacity-0'
			)}
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
				{/* Linha vencedora: sugestão da IA (varredura fria + ponto
				   piscante + shimmer) — quem confirma é o humano, no check. */}
				<div className={cn(RFQ_GRID, 'row-ai border-b px-2.5 py-2')}>
					<span className="flex min-w-0 items-center gap-1.5">
						<span className="truncate text-[10px] font-medium">
							ANHUI JINHE
						</span>
						<span className="flex shrink-0 items-center gap-1.5">
							<span aria-hidden className="pulse-ai scale-75" />
							<span className="ai-shimmer text-[8px] font-semibold tracking-wide uppercase">
								{t.sugerida}
							</span>
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
						{/* Resposta extraída de planilha pela IA. */}
						<Tag tone="ai" className="gap-1">
							<Sparkle
								weight="fill"
								className="size-2 shrink-0 text-[#4aa8ff]"
							/>
							{t.rfqBadgeIa}
						</Tag>
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
 * Quadros do recorte da v2 — as telas 1–4 em escala de leitura
 * ------------------------------------------------------------------ */

/* Tudo em `em`: cada quadro escala pela fonte da raiz, que o DemoFragment
   amarra à largura do frame (cqw) — a composição é a mesma em qualquer
   coluna. O padding direito largo (6em) cobre a faixa do fade do frame
   (10% da largura): o que dissolve é a superfície e as linhas, não o texto.
   Sem moldura própria nas tabelas: as linhas correm até a borda do quadro,
   e é por elas que o fade entra. */
const BOARD_ROOT =
	'bg-card flex flex-col gap-[1em] rounded-[0.75em] border py-[1.5em] pr-[6em] pl-[1.5em]'
/* Célula de cabeçalho. A fonte vai nos spans, não no grid: as colunas são
   em `em` e um font-size no container encolheria a grade do cabeçalho em
   relação às linhas. */
const BOARD_TH =
	'text-muted-foreground font-mono text-[0.72em] tracking-wide uppercase'
/* Recuo de célula (`pl`): a primeira coluna não nasce colada na margem do
   quadro — as linhas correm desde a borda, o texto começa 1em depois, como
   numa tabela de verdade. O cabeçalho do quadro (id, título) fica na
   margem; só a tabela recua. */
const BOARD_HEAD = 'border-b py-[0.7em] pl-[1em]'
const BOARD_ROW = 'border-b py-[0.85em] pl-[1em]'
/* Tag e botão na escala do quadro (nascem em 9px). */
const TAG_EM = 'rounded-[0.4em] px-[0.6em] py-[0.15em] text-[0.75em]'
const BTN_EM = 'h-[2.2em] gap-[0.5em] rounded-[0.4em] px-[0.9em] text-[0.8em]'

/* Check estático da coluna "Venc.": marcado na sugerida — a IA sugere, o
   humano já confirmou (é a "vencedora" do card). Sem POI: não há flow aqui. */
function BoardCheck({ checked = false }: { checked?: boolean }) {
	return (
		<span
			className={cn(
				'mx-auto flex size-[1.15em] items-center justify-center rounded-[0.25em] border',
				checked
					? 'border-green-600 bg-green-600 text-white'
					: 'border-foreground/25'
			)}
		>
			{checked ? <Check weight="bold" className="size-[0.8em]" /> : null}
		</span>
	)
}

function BoardTile({ label, value }: { label: string; value: string }) {
	return (
		<div className="bg-muted/50 rounded-[0.6em] p-[0.9em] text-center">
			<p className={BOARD_TH}>{label}</p>
			<p className="mt-[0.25em] text-[1.05em] font-semibold tabular-nums">
				{value}
			</p>
		</div>
	)
}

/* ---- Tela 0 em escala: o chat, num painel de celular -------------- */

/* Balão do painel. Diferente do `Bubble` do flow, que fica no DOM apagado
   (os POIs do cursor precisam ser mensuráveis antes de aparecer), este só
   MONTA quando o passo chega: a mensagem nova entra embaixo e empurra as
   anteriores para cima, como num chat — nada reserva lugar, não sobra vão. */
function BoardBubble({
	side,
	wide = false,
	children
}: {
	side: 'rep' | 'bot'
	/** Balão de documento: mais largo, como no WhatsApp, para o anexo
	 *  caber numa linha. */
	wide?: boolean
	children: ReactNode
}) {
	return (
		<div
			className={cn(
				'animate-bubble-in flex',
				side === 'rep'
					? 'origin-bottom-right justify-end'
					: 'origin-bottom-left justify-start'
			)}
		>
			<div
				className={cn(
					'w-fit rounded-[1em] px-[0.9em] py-[0.6em] shadow-sm',
					wide ? 'max-w-[92%]' : 'max-w-[78%]',
					side === 'rep'
						? 'bg-brand text-brand-foreground rounded-br-[0.35em]'
						: 'bg-card text-foreground rounded-bl-[0.35em] border'
				)}
			>
				{children}
			</div>
		</div>
	)
}

/* Rótulo do autor nos balões do sistema. */
function BotLabel() {
	return (
		<span className="text-foreground/50 flex items-center gap-[0.35em] font-mono text-[0.7em] tracking-widest uppercase">
			<Sparkle
				weight="fill"
				className="size-[0.85em] shrink-0 text-[#4aa8ff]"
			/>
			Faradays
		</span>
	)
}

const BUBBLE_TIME =
	'mt-[0.2em] flex items-center justify-end gap-[0.3em] font-mono text-[0.7em] opacity-70'

/**
 * O chat da Nestlé num painel com proporção de celular: cabeçalho do
 * contato, mensagens e barra de mensagem — o mesmo roteiro (`STEPS`) da
 * tela 0, em `em`. As mensagens ficam ancoradas embaixo numa altura fixa;
 * o que não cabe sai por cima e dissolve na máscara do topo, como o
 * scrollback de um chat de verdade. A conversa roda em LOOP: chega ao PDF,
 * segura 4,5s (o último passo de `STEPS`), apaga junto com o card e
 * recomeça do zero. `onFinal`/`onReset` avisam o DemoFragment para o card
 * de PDF pousar e sair no mesmo compasso. Fora da viewport a conversa
 * congela. Reduced motion: quadro final parado.
 *
 * Enquanto a IA ENVIA a mensagem branca — digitando (passos 2 e 5 de
 * `STEPS`) e por mais 0,7s depois de o balão chegar — o sinal é a BORDA DA
 * CONVERSA: o painel ganha um anel com a fita de IA, em crossfade. A borda
 * do balão em si fica normal. Sem pontinhos nem texto de status no
 * cabeçalho.
 */
function ChatBoard({
	t,
	onFinal,
	onReset
}: {
	t: Copy
	onFinal?: () => void
	onReset?: () => void
}) {
	const rootRef = useRef<HTMLDivElement>(null)
	const msgsRef = useRef<HTMLDivElement>(null)
	const [step, setStep] = useState(0)
	/* "Enviando": a IA está digitando ou acabou de mandar o balão branco.
	   Vem da timeline (abaixo), não do passo — o envio dura 0,7s além da
	   chegada do balão, e derivar isso do passo pediria um setState em
	   efeito. */
	const [sending, setSending] = useState(false)
	const ready = usePageReady()
	/* Por ref: os callbacks mudam a cada render do pai e não podem
	   reiniciar a conversa. */
	const onFinalRef = useRef(onFinal)
	const onResetRef = useRef(onReset)
	useEffect(() => {
		onFinalRef.current = onFinal
		onResetRef.current = onReset
	}, [onFinal, onReset])

	useEffect(() => {
		const root = rootRef.current
		const msgs = msgsRef.current
		if (!root || !msgs || !ready) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			const freeze = gsap.delayedCall(0, () => {
				setStep(FINAL_STEP)
				onFinalRef.current?.()
			})
			return () => {
				freeze.kill()
			}
		}
		const reset = STEPS[STEPS.length - 1].at
		const tl = gsap.timeline({ repeat: -1, paused: true })
		STEPS.forEach((s, i) => {
			if (i < STEPS.length - 1)
				tl.call(() => setStep(i + 1), undefined, s.at)
			/* Passo de digitação: acende a borda; apaga 0,7s depois de o
			   balão branco (passo seguinte) chegar. */
			if (s.typing) {
				tl.call(() => setSending(true), undefined, s.at)
				tl.call(
					() => setSending(false),
					undefined,
					STEPS[i + 1].at + 0.7
				)
			}
		})
		// O card pousa meio segundo depois do PDF, com o balão já assentado.
		tl.call(
			() => onFinalRef.current?.(),
			undefined,
			STEPS[FINAL_STEP - 1].at + 0.5
		)
		/* Fim do ciclo: as mensagens apagam junto com o card, o passo volta
		   a zero com a área invisível e ela reaparece vazia. */
		tl.call(() => onResetRef.current?.(), undefined, reset)
		tl.to(msgs, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, reset)
		tl.call(
			() => {
				setStep(0)
				setSending(false)
			},
			undefined,
			reset + 0.35
		)
		tl.to(msgs, { autoAlpha: 1, duration: 0.2 }, reset + 0.4)
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) tl.play()
				else tl.pause()
			},
			{ rootMargin: '100px' }
		)
		io.observe(root)
		return () => {
			io.disconnect()
			tl.kill()
			gsap.set(msgs, { clearProps: 'all' })
			setStep(0)
			setSending(false)
		}
	}, [ready])

	return (
		/* A borda do painel é o padding de 1px do wrapper (`bg-border`), não
		   um `border` do painel: com `border-color` transparente o Chrome
		   ainda estende o fundo do painel sob a borda (bleed avoidance, mesmo
		   com `background-clip: padding-box`) e um anel atrás não aparecia.
		   Aqui o painel não tem borda; o que se vê no anel de 1px é o fundo
		   do wrapper — cinza em repouso e, enquanto a IA envia, a fita de IA
		   (camada absoluta que avança 1px além do wrapper, para um anel de
		   2px), em crossfade de opacidade. */
		<div className="bg-border relative isolate w-[26em] max-w-full rounded-[calc(0.75em+1px)] p-px">
			<span
				aria-hidden
				className={cn(
					'ai-ribbon-fill absolute -inset-px rounded-[calc(0.75em+2px)] transition-opacity duration-500',
					sending ? 'opacity-100' : 'opacity-0'
				)}
			/>
			<div
				ref={rootRef}
				data-screen="whatsapp"
				className="bg-card relative flex h-[34em] flex-col overflow-hidden rounded-[0.75em]"
			>
				<div className="flex items-center gap-[0.75em] border-b px-[1em] py-[0.75em]">
					<span className="flex size-[2.4em] shrink-0 items-center justify-center rounded-full bg-[#25d366]/15 text-[#128c4b]">
						<WhatsappLogo weight="fill" className="size-[1.4em]" />
					</span>
					<div className="min-w-0 flex-1">
						<p className="truncate text-[0.95em] font-medium">
							{t.contact}
						</p>
						<p className="text-muted-foreground truncate font-mono text-[0.72em]">
							{t.channel}
						</p>
					</div>
					<span className={cn(BTN_OUTLINE, BTN_EM)}>
						<FileText className="size-[1.1em]" />
						{t.chatAction}
					</span>
				</div>

				{/* `justify-end` + `overflow-hidden`: o excedente sai por cima; a
			   máscara do topo o dissolve em vez de cortar seco. */}
				<div
					ref={msgsRef}
					className="bg-muted/40 flex min-h-0 flex-1 flex-col justify-end gap-[0.6em] overflow-hidden mask-t-from-85% p-[1em]"
				>
					{step >= 1 && (
						<BoardBubble side="rep">
							<p className="text-[0.95em]/[1.35]">{t.ask}</p>
							<span className={BUBBLE_TIME}>
								09:41 <Checks className="size-[1.1em]" />
							</span>
						</BoardBubble>
					)}
					{/* A guarda em cena: duas marcas no catálogo → a IA pergunta
				   em vez de escolher. */}
					{step >= 3 && (
						<BoardBubble side="bot">
							<BotLabel />
							<p className="mt-[0.2em] text-[0.95em]/[1.35]">
								{t.brandsBefore}
								<strong>{t.brandsStrong}</strong>
								{t.brandsAfter}
							</p>
						</BoardBubble>
					)}
					{step >= 4 && (
						<BoardBubble side="rep">
							<p className="text-[0.95em]/[1.35]">{t.pick}</p>
							<span className={BUBBLE_TIME}>
								09:42 <Checks className="size-[1.1em]" />
							</span>
						</BoardBubble>
					)}
					{step >= 6 && (
						<BoardBubble side="bot" wide>
							<BotLabel />
							<p className="mt-[0.2em] flex items-center gap-[0.5em] text-[0.95em]/[1.35]">
								<CheckCircle
									weight="fill"
									className="text-brand size-[1.2em] shrink-0"
								/>
								{t.issued}
							</p>
							{/* Documento na conversa, como o bot envia de verdade. */}
							<div className="bg-muted/60 mt-[0.6em] flex items-center gap-[0.75em] rounded-[0.6em] border px-[0.75em] py-[0.6em]">
								<FilePdf
									weight="fill"
									className="size-[2em] shrink-0 text-[#d93025]"
								/>
								<div className="min-w-0">
									<p className="truncate text-[0.9em] font-medium">
										{t.pdfName}
									</p>
									<p className="text-muted-foreground font-mono text-[0.72em]">
										{t.pdfMeta}
									</p>
								</div>
							</div>
						</BoardBubble>
					)}
				</div>

				<div className="flex items-center gap-[0.75em] border-t px-[1em] py-[0.7em]">
					<Paperclip className="text-foreground/40 size-[1.2em] shrink-0" />
					<span className="bg-muted text-muted-foreground flex-1 rounded-full px-[0.9em] py-[0.45em] text-[0.85em]">
						{t.inputPlaceholder}
					</span>
					<Microphone className="text-foreground/40 size-[1.2em] shrink-0" />
				</div>
			</div>
		</div>
	)
}

/* ---- Tela 1 em escala: cotação de venda ---------------------------- */

const VENDA_BOARD_GRID =
	'grid grid-cols-[minmax(0,1fr)_7em_8em_9em] items-center gap-x-[1.25em]'

/* Seis itens; os totais somam estes (NET 18.425 USD; R$ pela PTAX do card
   × o mesmo fator de impostos da tela 1). Números com a formatação pt,
   como na tela 1. */
const VENDA_BOARD_ITEMS = [
	{
		name: 'vendaItem1',
		qty: '2.000 KG',
		unit: 'USD 4,25',
		sub: 'USD 8.500,00'
	},
	{
		name: 'vendaItem2',
		qty: '500 KG',
		unit: 'USD 2,75',
		sub: 'USD 1.375,00'
	},
	{
		name: 'vendaItem3',
		qty: '1.000 KG',
		unit: 'USD 1,90',
		sub: 'USD 1.900,00'
	},
	{
		name: 'vendaItem4',
		qty: '250 KG',
		unit: 'USD 9,80',
		sub: 'USD 2.450,00'
	},
	{
		name: 'vendaItem5',
		qty: '500 KG',
		unit: 'USD 3,60',
		sub: 'USD 1.800,00'
	},
	{ name: 'vendaItem6', qty: '750 KG', unit: 'USD 3,20', sub: 'USD 2.400,00' }
] as const satisfies readonly {
	name: keyof Copy
	qty: string
	unit: string
	sub: string
}[]

/* Os totais vêm ANTES dos itens (na tela 1 ficam depois): o fade de baixo
   come o fim do quadro, e o que esta feature promete — imposto e câmbio
   certos — está nos totais, não na sexta linha. */
function VendaBoard({ t }: { t: Copy }) {
	return (
		<div data-screen="venda" className={BOARD_ROOT}>
			<div className="flex items-center gap-[0.75em]">
				<p className="font-mono text-[1.1em] font-semibold">
					COT-V-0187 · Nestlé SP
				</p>
				<Tag tone="ai" className={cn(TAG_EM, 'gap-[0.35em]')}>
					<Sparkle
						weight="fill"
						className="size-[0.9em] shrink-0 text-[#4aa8ff]"
					/>
					{t.vendaBadge}
				</Tag>
				<span className="flex-1" />
				<span className={cn(BTN_PRIMARY, BTN_EM)}>
					<FilePdf className="size-[1.3em]" />
					{t.vendaGerar}
				</span>
			</div>

			<div className="grid grid-cols-3 gap-[0.75em]">
				<BoardTile label={t.tileNet} value="USD 18.425,00" />
				<BoardTile label={t.tileImpostos} value="R$ 121.104,60" />
				<BoardTile label={t.tileDolar} value="R$ 5,4321 · 12/08/2026" />
			</div>

			<div className="flex flex-col">
				<div className={cn(VENDA_BOARD_GRID, BOARD_HEAD)}>
					<span className={BOARD_TH}>{t.colProduto}</span>
					<span className={cn(BOARD_TH, 'text-right')}>
						{t.colQtd}
					</span>
					<span className={cn(BOARD_TH, 'text-right')}>
						{t.colPreco}
					</span>
					<span className={cn(BOARD_TH, 'text-right')}>
						{t.colSubtotal}
					</span>
				</div>
				{VENDA_BOARD_ITEMS.map((item) => (
					<div
						key={item.name}
						className={cn(VENDA_BOARD_GRID, BOARD_ROW)}
					>
						<span className="truncate font-medium">
							{t[item.name]}
						</span>
						<span className="text-right font-mono text-[0.95em] tabular-nums">
							{item.qty}
						</span>
						<span className="text-right font-mono text-[0.95em] tabular-nums">
							{item.unit}
						</span>
						<span className="text-right font-mono tabular-nums">
							{item.sub}
						</span>
					</div>
				))}
			</div>

			<p className="text-muted-foreground/70 font-mono text-[0.85em]">
				{t.vendaFoot}
			</p>
		</div>
	)
}

/* ---- Tela 2 em escala: comparativo de respostas do RFQ ------------ */

/* Quatro colunas, até o check da vencedora. */
const RFQ_BOARD_GRID =
	'grid grid-cols-[minmax(0,1fr)_8em_9.5em_4.5em] items-center gap-x-[1.25em]'

/* Seis respostas; a vencedora (a mais barata, a do card-eco) é a SEGUNDA
   linha — a sugestão da IA não gruda no cabeçalho. Preços com ponto, o
   separador do idioma entra na renderização (`t.dec`). */
const RFQ_BOARD_ROWS = [
	{ name: 'VITASWEET', fob: '5.0200', term: 'T/T 30 days' },
	{ name: 'ANHUI JINHE', fob: '4.8500', term: 'T/T 90 days', ai: true },
	{ name: 'ENSIGN', fob: '5.1100', term: 'L/C at sight' },
	{ name: 'TAIHE', fob: '4.9700', term: 'T/T 60 days' },
	{ name: 'GOLDENSEA', fob: '5.2400', term: 'T/T 90 days' },
	{ name: 'HUAYANG', fob: '5.0800', term: 'D/P at sight' }
] as const

/* Mesma anatomia da tela 2 — id da cotação e status, produto, cabeçalho
   de colunas, linhas, base normalizada e o botão de fechar —, sem a tag
   "Planilha + IA". */
function RfqBoard({ t }: { t: Copy }) {
	return (
		<div data-screen="rfq" className={BOARD_ROOT}>
			<div className="flex items-center gap-[0.75em]">
				<p className="font-mono text-[1.1em] font-semibold">
					CC-2026-0011
				</p>
				<Tag tone="warning" className={TAG_EM}>
					{t.rfqStatus}
				</Tag>
				<span className="text-muted-foreground font-mono text-[0.85em]">
					{t.rfqBoardMeta}
				</span>
			</div>

			<div className="flex flex-col">
				<div className="flex items-center gap-[0.75em] border-b py-[0.75em] pl-[1em]">
					<span className="text-[0.95em] font-medium">
						CREATINA 200 MESH
					</span>
					<span className="flex-1" />
					<span className="text-muted-foreground font-mono text-[0.85em] tabular-nums">
						1 FCL 40&apos; · 27.000 KG
					</span>
				</div>
				<div className={cn(RFQ_BOARD_GRID, BOARD_HEAD)}>
					<span className={BOARD_TH}>{t.colExportador}</span>
					<span className={cn(BOARD_TH, 'text-right')}>
						{t.colFob}
					</span>
					<span className={cn(BOARD_TH, 'text-right')}>
						{t.colPrazo}
					</span>
					<span className={cn(BOARD_TH, 'text-center')}>
						{t.colVenc}
					</span>
				</div>
				{RFQ_BOARD_ROWS.map((row) => (
					<div
						key={row.name}
						className={cn(
							RFQ_BOARD_GRID,
							BOARD_ROW,
							'ai' in row && 'row-ai'
						)}
					>
						<span className="flex min-w-0 items-center gap-[0.75em]">
							<span className="truncate font-medium">
								{row.name}
							</span>
							{'ai' in row ? (
								<span className="flex shrink-0 items-center gap-[0.5em]">
									<span aria-hidden className="pulse-ai" />
									<span className="ai-shimmer text-[0.72em] font-semibold tracking-wide uppercase">
										{t.sugerida}
									</span>
								</span>
							) : null}
						</span>
						<span className="text-right font-mono tabular-nums">
							{row.fob.replace('.', t.dec)}
						</span>
						<span className="text-right font-mono text-[0.95em] whitespace-nowrap">
							{row.term}
						</span>
						<BoardCheck checked={'ai' in row} />
					</div>
				))}
			</div>

			<div className="flex items-center gap-[0.75em]">
				<p className="text-muted-foreground/70 font-mono text-[0.85em]">
					{t.rfqBase}
				</p>
				<span className="flex-1" />
				<span className={cn(BTN_PRIMARY, BTN_EM)}>
					<CheckCircle className="size-[1.3em]" />
					{t.rfqFechar}
				</span>
			</div>
		</div>
	)
}

/* ---- Tela 3 em escala: documentos por produto ---------------------- */

const DOCS_BOARD_GRID =
	'grid grid-cols-[minmax(0,1fr)_7em_8em_9em] items-center gap-x-[1.25em]'

const DOC_TONES = {
	vigente: 'success',
	aVencer: 'warning',
	vencido: 'error'
} as const

/* Seis laudos; o vencido (o do card-eco) é a segunda linha, com um tinte
   de alerta — o equivalente aqui da linha sugerida do RFQ. */
const DOCS_BOARD_ROWS = [
	{
		product: 'CREATINA 200 MESH',
		type: 'docCoa',
		date: '12/03/2027',
		status: 'vigente'
	},
	{
		product: 'CREATINA 200 MESH',
		type: 'docKosher',
		date: '30/06/2026',
		status: 'vencido'
	},
	{
		product: 'ÁCIDO ASCÓRBICO',
		type: 'docHalal',
		date: '15/09/2026',
		status: 'aVencer'
	},
	{
		product: 'TAURINA',
		type: 'docAlergenos',
		date: '02/11/2026',
		status: 'vigente'
	},
	{
		product: 'CAFEÍNA ANIDRA',
		type: 'docCoa',
		date: '20/01/2027',
		status: 'vigente'
	},
	{
		product: 'GLUTAMINA',
		type: 'docHalal',
		date: '08/10/2026',
		status: 'aVencer'
	}
] as const satisfies readonly {
	product: string
	type: keyof Copy
	date: string
	status: keyof typeof DOC_TONES
}[]

function DocsBoard({ t }: { t: Copy }) {
	return (
		<div data-screen="docs" className={BOARD_ROOT}>
			<div className="flex items-center gap-[0.75em]">
				<p className="text-[1.05em] font-medium">{t.docsTitle}</p>
				<span className="text-muted-foreground font-mono text-[0.85em]">
					{t.docsMeta}
				</span>
				<span className="flex-1" />
				<span className={cn(BTN_OUTLINE, BTN_EM)}>{t.docsCobrar}</span>
			</div>

			<div className="flex flex-col">
				<div className={cn(DOCS_BOARD_GRID, BOARD_HEAD)}>
					<span className={BOARD_TH}>{t.colProduto}</span>
					<span className={BOARD_TH}>{t.colTipo}</span>
					<span className={cn(BOARD_TH, 'text-right')}>
						{t.colValidade}
					</span>
					<span className={BOARD_TH}>{t.colStatus}</span>
				</div>
				{DOCS_BOARD_ROWS.map((row) => (
					<div
						key={`${row.product}-${row.type}`}
						className={cn(
							DOCS_BOARD_GRID,
							BOARD_ROW,
							row.status === 'vencido' && 'bg-destructive/5'
						)}
					>
						<span className="truncate font-medium">
							{row.product}
						</span>
						<span className="font-mono text-[0.95em]">
							{t[row.type]}
						</span>
						<span className="text-right font-mono text-[0.95em] tabular-nums">
							{row.date}
						</span>
						<span className="flex">
							<Tag
								tone={DOC_TONES[row.status]}
								className={TAG_EM}
							>
								{t[row.status]}
							</Tag>
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

/* ---- Tela 4 em escala: portal ao vivo (só na v2; o flow não a tem) --- */

const PORTAL_BOARD_GRID =
	'grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.7fr)_4em_9em] items-center gap-x-[1.25em]'

/* O quadro do gestor: um rep por linha, última mensagem, pendências e
   status — a home do portal que MORE_FEATURES descreve ("atualizada por
   WebSocket, sem refresh"). Estático; o "ao vivo" é o pulso do ponto. */
const PORTAL_BOARD_ROWS = [
	{
		rep: 'contact',
		msg: 'portalMsg1',
		time: '09:42',
		pend: '0',
		tone: 'success',
		status: 'portalOk'
	},
	{
		rep: 'portalRep2',
		msg: 'portalMsg2',
		time: '09:58',
		pend: '2',
		tone: 'warning',
		status: 'portalPend'
	},
	{
		rep: 'portalRep3',
		msg: 'portalMsg3',
		time: '10:03',
		pend: '1',
		tone: 'error',
		status: 'portalFail'
	},
	{
		rep: 'portalRep4',
		msg: 'portalMsg4',
		time: '10:11',
		pend: '0',
		tone: 'success',
		status: 'portalOk'
	},
	{
		rep: 'portalRep5',
		msg: 'portalMsg5',
		time: '10:17',
		pend: '1',
		tone: 'warning',
		status: 'portalPend1'
	},
	{
		rep: 'portalRep6',
		msg: 'portalMsg6',
		time: '10:24',
		pend: '0',
		tone: 'success',
		status: 'portalOk'
	}
] as const satisfies readonly {
	rep: keyof Copy
	msg: keyof Copy
	time: string
	pend: string
	tone: keyof typeof TAG_TONES
	status: keyof Copy
}[]

function PortalBoard({ t }: { t: Copy }) {
	return (
		<div data-screen="portal" className={BOARD_ROOT}>
			<div className="flex items-center gap-[0.75em]">
				<p className="text-[1.05em] font-medium">{t.portalTitle}</p>
				<Tag tone="success" className={cn(TAG_EM, 'gap-[0.5em]')}>
					<span className="size-[0.5em] animate-pulse rounded-full bg-green-600" />
					{t.portalLive}
				</Tag>
				<span className="flex-1" />
				<span className="text-muted-foreground truncate font-mono text-[0.85em]">
					{t.cardPortalMeta}
				</span>
			</div>

			<div className="flex flex-col">
				<div className={cn(PORTAL_BOARD_GRID, BOARD_HEAD)}>
					<span className={BOARD_TH}>{t.colRep}</span>
					<span className={BOARD_TH}>{t.colUltima}</span>
					<span className={BOARD_TH}>{t.colPend}</span>
					<span className={BOARD_TH}>{t.colStatus}</span>
				</div>
				{PORTAL_BOARD_ROWS.map((row) => (
					<div
						key={row.rep}
						className={cn(PORTAL_BOARD_GRID, BOARD_ROW)}
					>
						<span className="truncate font-medium">
							{t[row.rep]}
						</span>
						<span className="text-muted-foreground truncate text-[0.95em]">
							{t[row.msg]}{' '}
							<span className="font-mono text-[0.75em]">
								{row.time}
							</span>
						</span>
						<span className="font-mono tabular-nums">
							{row.pend}
						</span>
						<span className="flex">
							<Tag tone={row.tone} className={TAG_EM}>
								{t[row.status]}
							</Tag>
						</span>
					</div>
				))}
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

function DocsScreen({ t, active = false }: { t: Copy; active?: boolean }) {
	return (
		<div
			data-screen="docs"
			className={cn(
				'absolute inset-0 flex flex-col gap-2.5 p-3',
				!active && 'opacity-0'
			)}
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

/* Miolo do card-eco — o mesmo nos cards do flow (PDF e features 2–4) e no
   recorte da v2. `className`/props extras caem no div de fora: é nele que o
   flow põe os data-attrs de fade. */
function EchoCardBody({
	icon,
	title,
	meta,
	label,
	large = false,
	className,
	...props
}: {
	icon: ReactNode
	title: string
	meta: string
	label: string
	/** Escala de leitura, para os recortes grandes (o quadro RFQ da v2):
	 *  tudo em `em`, então o card mede pela fonte que o pai lhe der — o
	 *  DemoFragment amarra essa fonte à largura do frame (cqw), e o card
	 *  encolhe com ele em vez de tapar o quadro em coluna estreita. */
	large?: boolean
} & ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'bg-card border shadow-2xl',
				large ? 'rounded-[0.75em] p-[1.25em]' : 'rounded-xl p-4',
				className
			)}
			{...props}
		>
			<div
				className={cn(
					'flex items-center',
					large ? 'gap-[0.75em]' : 'gap-2.5'
				)}
			>
				{/* O ícone chega em size-7; no grande cresce por cascata. */}
				<span
					className={cn(
						'flex shrink-0',
						large && '[&>svg]:size-[2.25em]'
					)}
				>
					{icon}
				</span>
				<div className="min-w-0">
					{/* No grande o título quebra (duas linhas cabem num card
					   de leitura); no pequeno trunca, como no flow. */}
					<p
						className={cn(
							'font-medium',
							large
								? 'text-[0.95em] leading-tight text-pretty'
								: 'truncate text-xs'
						)}
					>
						{title}
					</p>
					<p
						className={cn(
							'text-muted-foreground truncate font-mono',
							large ? 'text-[0.75em]' : 'text-[10px]'
						)}
					>
						{meta}
					</p>
				</div>
			</div>
			<div
				aria-hidden
				className={cn(
					'flex flex-col',
					large ? 'mt-[1em] gap-[0.5em]' : 'mt-3 gap-1.5'
				)}
			>
				<div
					className={cn(
						'bg-foreground/10 w-full rounded-full',
						large ? 'h-[0.5em]' : 'h-1.5'
					)}
				/>
				<div
					className={cn(
						'bg-foreground/10 w-4/5 rounded-full',
						large ? 'h-[0.5em]' : 'h-1.5'
					)}
				/>
				<div
					className={cn(
						'bg-foreground/10 w-3/5 rounded-full',
						large ? 'h-[0.5em]' : 'h-1.5'
					)}
				/>
			</div>
			<span
				className={cn(
					'text-foreground/40 block font-mono tracking-widest uppercase',
					large ? 'mt-[1em] text-[0.625em]' : 'mt-3 text-[9px]'
				)}
			>
				{label}
			</span>
		</div>
	)
}

function EchoCard({
	name,
	icon,
	title,
	meta,
	label,
	visible
}: {
	name: string
	icon: ReactNode
	title: string
	meta: string
	label: string
	/** undefined = apagado para o flow animar; true = já em cena (modo
	 *  estático); false = a feature não é esta, nem renderiza. */
	visible?: boolean
}) {
	if (visible === false) return null
	return (
		<div
			data-feature-card={name}
			/* Beiral de 4rem (não 10): nos blocos 2-4 a demo fica na metade
			   ESQUERDA e o card é o que chega mais perto da copy da direita.
			   Com a caixa em 52vw, um beiral maior põe o card por cima do
			   parágrafo — a soma "margem + caixa + beiral" tem de caber antes
			   do texto da coluna da direita. */
			className={cn(
				'absolute -right-16 bottom-[16%] hidden w-64 lg:block',
				visible !== true && 'opacity-0'
			)}
		>
			{/* Wrapper de fade separado do pop: a entrada (echoTl) anima o
			   card externo e a saída (byeTl) anima este wrapper —
			   propriedades independentes, toggles nunca disputam o mesmo
			   autoAlpha. Todo o paint fica aqui: o externo invisível não
			   pode deixar casca (bg/borda/sombra) para trás. */}
			<EchoCardBody
				data-feature-card-fade
				icon={icon}
				title={title}
				meta={meta}
				label={label}
			/>
		</div>
	)
}

/* ------------------------------------------------------------------ *
 * Recorte para a v2 — uma tela sem o app em volta, com o card no fim
 * ------------------------------------------------------------------ */

/** As telas que o recorte sabe mostrar: as quatro do flow + o portal. */
export type FragmentScreen = DemoScreen | 'portal'

/* Conteúdo de cada card-eco (ícone + copy), partilhado entre o flow da v1
   (EchoCard e card de PDF) e o recorte da v2. */
function echoCardProps(screen: FragmentScreen, t: Copy) {
	switch (screen) {
		case 'whatsapp':
			return {
				icon: (
					<FilePdf
						weight="fill"
						className="size-7 shrink-0 text-[#d93025]"
					/>
				),
				title: t.pdfName,
				meta: t.pdfMeta,
				label: t.preview
			}
		case 'venda':
			return {
				icon: (
					<CurrencyCircleDollar
						weight="fill"
						className="text-brand size-7 shrink-0"
					/>
				),
				title: t.cardVendaTitle,
				meta: t.cardVendaMeta,
				label: t.cardVendaLabel
			}
		case 'rfq':
			return {
				icon: (
					<Medal
						weight="fill"
						className="size-7 shrink-0 text-amber-500"
					/>
				),
				title: t.cardRfqTitle,
				meta: t.cardRfqMeta,
				label: t.cardRfqLabel
			}
		case 'docs':
			return {
				icon: (
					<BellRinging
						weight="fill"
						className="text-destructive size-7 shrink-0"
					/>
				),
				title: t.cardDocsTitle,
				meta: t.cardDocsMeta,
				label: t.cardDocsLabel
			}
		case 'portal':
			return {
				icon: (
					<Pulse
						weight="fill"
						className="text-brand size-7 shrink-0"
					/>
				),
				title: t.cardPortalTitle,
				meta: t.cardPortalMeta,
				label: t.cardPortalLabel
			}
	}
}

/**
 * Recorte de uma tela da demo para ilustrar uma feature na v2 — só o miolo
 * da tela, sem sidebar, header nem o frame do app — com o card da feature
 * entrando NO FIM, como fecho da ilustração.
 *
 * Duas formas, as duas na escala do frame: o quadro mede em `em` e a fonte
 * da raiz vem em `cqw` (a raiz do recorte é `@container`; o card escala
 * junto) — o mesmo enquadramento em qualquer largura de coluna, com um piso
 * de 11px para a fonte.
 * - Chat (`whatsapp`): o `ChatBoard`, um painel com proporção de celular
 *   encostado à direita da coluna junto com o card (os dois formam um
 *   conjunto de 42,5em), com a conversa em loop. O card de PDF
 *   pousa À DIREITA do painel, meio sobre a borda dele, na altura do balão
 *   do PDF — a leitura é "o PDF saiu da conversa". Quem dispara é o roteiro
 *   (`onFinal` pousa, `onReset` apaga), então o card acompanha o ciclo. Em
 *   coluna estreita (frame abaixo de 48rem) o card desce para baixo do
 *   painel, para não estourar a coluna.
 * - Quadros (as demais): um `*Board` — a tela em escala de leitura — num
 *   frame que o RECORTA. O frame tem a altura do quadro com um teto de 2/1
 *   e uma máscara que dissolve a direita (10%) e o terço de baixo: a tabela
 *   some antes de acabar. Entrada quando o recorte aparece, uma vez: os
 *   blocos do quadro em stagger, os filhos deles em cascata, e o card pousa
 *   DENTRO do canto inferior direito, sobre as linhas já apagadas. Depois
 *   disso o card fica REAPARECENDO: a cada ~6s ele sai e pousa de novo (loop
 *   pausado fora da viewport) — o quadro é parado, e é esse pulso que diz
 *   que a ilustração está viva.
 * Reduced motion: tudo em cena desde o início, sem loops.
 */
export function DemoFragment({
	screen,
	className
}: {
	screen: FragmentScreen
	className?: string
}) {
	const t = useCopy(COPY)
	const rootRef = useRef<HTMLDivElement>(null)
	const popRef = useRef<gsap.core.Timeline | null>(null)
	const byeRef = useRef<(() => void) | null>(null)
	const ready = usePageReady()
	const frameless = screen === 'whatsapp'

	useEffect(() => {
		const root = rootRef.current
		if (!root || !ready) return
		const card = root.querySelector<HTMLElement>('[data-fragment-card]')
		if (!card) return
		/* Alvos da entrada (só nos quadros — o chat anima os próprios
		   balões): cada bloco do quadro some inteiro antes do gatilho (senão
		   a moldura ficaria à mostra, vazia) e volta num stagger curto; os
		   filhos dos blocos (itens do cabeçalho, linhas, tiles) entram em
		   cascata logo atrás. Não depende do markup de cada tela. */
		const blocks = frameless
			? []
			: gsap.utils.toArray<HTMLElement>('[data-screen] > *', root)
		const leaves = blocks.flatMap(
			(block) => Array.from(block.children) as HTMLElement[]
		)
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set([card, ...blocks, ...leaves], { autoAlpha: 1 })
			return
		}
		const ctx = gsap.context(() => {
			const HIDDEN = { autoAlpha: 0, y: 24, scale: 0.9 }
			const POP = {
				autoAlpha: 1,
				y: 0,
				scale: 1,
				duration: 0.6,
				ease: 'back.out(1.6)'
			}
			const BYE = {
				autoAlpha: 0,
				y: 16,
				scale: 0.94,
				duration: 0.3,
				ease: 'power2.in'
			}
			const tl = gsap.timeline({ paused: true })
			if (blocks.length) {
				tl.fromTo(
					blocks,
					{ autoAlpha: 0 },
					{
						autoAlpha: 1,
						duration: 0.35,
						stagger: 0.12,
						ease: 'power2.out'
					}
				)
			}
			if (leaves.length) {
				tl.fromTo(
					leaves,
					{ autoAlpha: 0, y: 10 },
					{
						autoAlpha: 1,
						y: 0,
						duration: 0.45,
						stagger: 0.06,
						ease: 'power2.out'
					},
					0.1
				)
			}
			tl.fromTo(card, HIDDEN, POP, blocks.length ? '>-0.1' : 0)
			popRef.current = tl
			if (frameless) {
				/* No chat quem dispara é o roteiro: `onFinal` → restart do
				   pop (o fromTo reaplica o estado escondido), `onReset` →
				   esta saída. */
				byeRef.current = () => {
					tl.pause()
					gsap.to(card, BYE)
				}
				return
			}
			ScrollTrigger.create({
				trigger: root,
				start: 'top 75%',
				once: true,
				onEnter: () => tl.play()
			})
			/* Pulso do card: 5s parado, sai rápido e pousa de novo. Com
			   `repeat: -1` o hold inicial (posição 5) vale para toda volta.
			   `immediateRender: false` no fromTo: a timeline nasce pausada e
			   o card já está em cena pela entrada — sem isso ele apagaria
			   na criação. Só roda com o recorte à vista e depois da
			   entrada; fora da viewport pausa onde estiver. */
			const loop = gsap.timeline({ paused: true, repeat: -1 })
			loop.to(card, BYE, 5).fromTo(
				card,
				HIDDEN,
				{ ...POP, immediateRender: false },
				'+=0.2'
			)
			let inView = false
			tl.eventCallback('onComplete', () => {
				if (inView) loop.play()
			})
			ScrollTrigger.create({
				trigger: root,
				start: 'top bottom',
				end: 'bottom top',
				onToggle: (self) => {
					inView = self.isActive
					if (!inView) loop.pause()
					else if (tl.progress() === 1) loop.play()
				}
			})
		}, root)
		return () => {
			popRef.current = null
			byeRef.current = null
			ctx.revert()
		}
	}, [ready, frameless])

	const card = <EchoCardBody {...echoCardProps(screen, t)} large />

	return (
		<div
			ref={rootRef}
			/* Container do recorte: quadro e card medem em cqw dele. */
			className={cn('@container relative w-full', className)}
		>
			{frameless ? (
				/* Painel e card no mesmo `em`: a posição do card é em em do
				   painel, então os dois escalam juntos. Em frame estreito o
				   card fica no fluxo, abaixo do painel e à direita. */
				<div className="text-[clamp(11px,1.55cqw,18px)]">
					{/* Conjunto encostado à direita da coluna: 26em de painel +
					   o card além dele (left 23em + 19,5em de largura = 42,5em). */}
					<div className="relative ml-auto w-[42.5em] max-w-full">
						<ChatBoard
							t={t}
							onFinal={() => popRef.current?.restart()}
							onReset={() => byeRef.current?.()}
						/>
						<div
							data-fragment-card
							className="mt-[1em] ml-auto w-[19.5em] text-[0.95em] opacity-0 @3xl:absolute @3xl:bottom-[5em] @3xl:left-[23em] @3xl:mt-0 @3xl:ml-0"
						>
							{card}
						</div>
					</div>
				</div>
			) : (
				<>
					{/* Sem borda nem sombra no frame: a máscara apagaria a
					   sombra (mask-clip é border-box) e uma borda contornaria
					   um fade. O que tem borda é o quadro; do lado de fora só
					   o clip. A altura é a do quadro com um teto de 2/1
					   (50cqw) — e não 2/1 fixo: quando a fonte bate no piso
					   (coluna estreita) o quadro cresce além da proporção e o
					   teto o corta; quando não bate, o quadro acaba antes e o
					   frame acaba junto, sem sobrar um vão com a borda de
					   baixo à mostra. Abaixo de md o teto é 4/3, para caberem
					   mais linhas na coluna única. */}
					<div className="relative max-h-[75cqw] overflow-hidden rounded-xl mask-r-from-90% mask-b-from-65% md:max-h-[50cqw]">
						<div className="text-[clamp(11px,1.55cqw,18px)]">
							{screen === 'venda' && <VendaBoard t={t} />}
							{screen === 'rfq' && <RfqBoard t={t} />}
							{screen === 'docs' && <DocsBoard t={t} />}
							{screen === 'portal' && <PortalBoard t={t} />}
						</div>
					</div>
					{/* Card na escala do frame: ~28% da largura dele, fonte
					   ~1,5% — com pisos e tetos para não sumir na coluna
					   estreita nem crescer demais. Dentro do canto só com
					   frame de 48rem para cima (@3xl): abaixo disso o quadro
					   está no piso da fonte e o card taparia os números, então
					   ele desce para o beiral. */}
					<div
						data-fragment-card
						className="absolute right-[2.5cqw] -bottom-8 w-[clamp(12rem,28cqw,19rem)] text-[clamp(10px,1.5cqw,16px)] opacity-0 @3xl:bottom-[2.5cqw]"
					>
						{card}
					</div>
				</>
			)}
		</div>
	)
}

/* ------------------------------------------------------------------ */

export function MonfizaAppDemo({
	ref,
	fill = false,
	screen
}: {
	ref?: Ref<MonfizaAppDemoHandle>
	/** Preenche o container em vez de se medir pela coreografia do
	 *  HeroFeatureFlow. Use quando a demo for ilustração parada dentro de
	 *  um bloco de layout (o hero da v2), e não a peça pinada que viaja
	 *  com o scroll — `.demo-box` traz consigo a largura da grade e o
	 *  translateY de repouso, que só fazem sentido dentro daquele fluxo. */
	fill?: boolean
	/** Modo estático: quadro parado desta tela, com o card da feature em
	 *  cena (ver docblock). Sem ela, a demo é o palco do flow. */
	screen?: DemoScreen
}) {
	const t = useCopy(COPY)
	const active: DemoScreen = screen ?? 'whatsapp'
	/* Estado de cada card: no flow (sem `screen`) todos existem apagados;
	   no modo estático só o da tela fica, já visível. */
	const card = (name: DemoScreen) => (screen ? screen === name : undefined)

	return (
		<div
			className={cn(
				'relative z-10 flex h-full items-center justify-center',
				fill ? 'p-0' : 'p-5 md:p-8'
			)}
		>
			{/* aria-hidden: a demo é ilustração das features — a copy real
			   está nos blocos de texto ao lado. */}
			{/* No lg+ o tamanho vem da classe `.demo-box` (globals.css):
			   ela interpola entre a medida pinada (52rem) e a da grade do
			   CTA pelo fator --demo-w, que o flow tweena de 1 (repouso) a 0
			   (pinada). A altura acompanha pela proporção, então a demo
			   cresce sem esticar. */}
			<div
				data-demo-box
				aria-hidden
				className={cn(
					'relative',
					fill
						? 'h-full w-full'
						: 'demo-box h-full max-h-[36rem] w-[min(34rem,100%)] [--demo-w:1]'
				)}
			>
				{/* Banda de fundo. As margens são proporcionais (% do próprio
				   box), não fixas: assim ela acompanha a demo o tempo todo —
				   viaja na diagonal e encolhe junto quando --demo-w cai para
				   a medida pinada, mantendo sempre a mesma moldura. Em
				   repouso os números dão a largura útil da seção (158px de
				   sobra de cada lado sobre as 10 colunas = 10,207%) e os
				   64px em cima e embaixo (6,867% da altura de repouso). Só
				   no desktop; no mobile a demo já toma a largura toda. */}
				{/* No modo `fill` a banda sai de cena: os insets negativos
				   são a moldura calculada para a demo de repouso do flow e,
				   dentro de uma coluna de layout, ela sangraria para fora
				   por cima do texto vizinho. */}
				<div
					data-demo-bg
					className={cn(
						'pointer-events-none absolute inset-x-[-10.207%] inset-y-[-6.867%] -z-10 rounded-2xl bg-[url(/bg.png)] bg-cover bg-center',
						fill ? 'hidden' : 'hidden lg:block'
					)}
				/>
				{/* Frame do app — único elemento com overflow-hidden (leaf:
				   nunca um ancestral do sticky). Opaco (e não bg-card/95):
				   com a banda atrás, translúcido sujaria a UI do app. */}
				<div className="bg-card flex h-full overflow-hidden rounded-lg border shadow-2xl">
					<AppSidebar t={t} active={active} />
					<div className="flex min-w-0 flex-1 flex-col">
						<AppHeader t={t} active={active} />
						<div className="relative min-h-0 flex-1">
							<ConversasScreen
								t={t}
								handleRef={ref}
								active={active === 'whatsapp'}
								still={Boolean(screen)}
							/>
							<VendaScreen t={t} active={active === 'venda'} />
							<RfqScreen t={t} active={active === 'rfq'} />
							<DocsScreen t={t} active={active === 'docs'} />
							<Overlays t={t} />
						</div>
					</div>
				</div>

				{/* Card de preview do PDF — surge logo depois do clique do
				   cursor no PDF (bloco 1), fora do frame (overhang à
				   esquerda). No modo estático ele muda de lado: o beiral de
				   10rem à esquerda foi medido para a demo pinada na metade
				   direita da tela e, numa coluna de layout, invadiria o que
				   estiver ao lado — à direita ele usa o mesmo beiral de 4rem
				   dos eco-cards. */}
				{card('whatsapp') !== false && (
					<div
						data-demo-card
						className={cn(
							'absolute bottom-[16%] hidden w-64 lg:block',
							screen ? '-right-16' : '-left-40 opacity-0'
						)}
					>
						{/* Mesmo desacoplamento dos cards-eco: pop no card
					   (cardTl), saída no wrapper (exitTl), paint todo no
					   wrapper para o externo não deixar casca. */}
						<EchoCardBody
							data-demo-card-fade
							{...echoCardProps('whatsapp', t)}
						/>
					</div>
				)}

				{/* Cards-eco das features 2–4: cada um surge no fim da tour da
				   sua tela (logo depois do clique, independente do scroll)
				   e o flow apaga o wrapper no fim do hold. */}
				{(['venda', 'rfq', 'docs'] as const).map((name) => (
					<EchoCard
						key={name}
						name={name}
						visible={card(name)}
						{...echoCardProps(name, t)}
					/>
				))}

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
