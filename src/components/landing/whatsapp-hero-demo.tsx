'use client'

import {
	CheckCircle,
	Checks,
	FilePdf,
	Microphone,
	Paperclip,
	WhatsappLogo
} from '@phosphor-icons/react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

import { useCopy } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

const COPY = {
	pt: {
		contact: 'Rep. Sudeste · Carlos',
		typing: 'Faradays digitando…',
		channel: 'WhatsApp · carteira própria',
		livePortal: 'ao vivo no portal',
		ask: 'Faz uma cotação de 2 ton de creatina pra Nestlé, entrega SP',
		brandsBefore: 'Encontrei ',
		brandsStrong: '2 marcas',
		brandsAfter:
			' de creatina na tabela vigente: Creapure® e Hansong. Qual delas?',
		pick: 'Creapure',
		issued: 'Cotação COT-V-0187 emitida — ICMS SP e câmbio do dia já calculados.',
		pdfMeta: '2.000 kg · Creapure® · 1 pág.',
		inputPlaceholder: 'Mensagem'
	},
	en: {
		contact: 'Southeast rep · Carlos',
		typing: 'Faradays typing…',
		channel: 'WhatsApp · own portfolio',
		livePortal: 'live on the portal',
		ask: 'Put together a quote for 2 tons of creatine for Nestlé, delivery in SP',
		brandsBefore: 'I found ',
		brandsStrong: '2 brands',
		brandsAfter:
			' of creatine in the current price list: Creapure® and Hansong. Which one?',
		pick: 'Creapure',
		issued: "Quote COT-V-0187 issued — SP ICMS and today's exchange rate already computed.",
		pdfMeta: '2,000 kg · Creapure® · 1 page',
		inputPlaceholder: 'Message'
	}
} satisfies Localized<Record<string, string>>

/**
 * Demo do hero: a conversa de WhatsApp em que o representante pede uma
 * cotação e o sistema devolve o PDF formalizado — a cena central do produto
 * (e da headline). Autoplay em loop com indicador de digitação; a etapa 2
 * mostra a guarda real ("2+ candidatos viram pergunta": a IA não escolhe
 * marca sozinha). Pausa fora da viewport e vira quadro estático com
 * prefers-reduced-motion.
 */

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
	children: React.ReactNode
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

export function WhatsAppHeroDemo() {
	const t = useCopy(COPY)
	const rootRef = useRef<HTMLDivElement>(null)
	const [step, setStep] = useState(0)
	const ready = usePageReady()

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

		/* Fora da viewport a conversa congela — mesma regra dos canvases. */
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
			setStep(0)
		}
	}, [ready])

	const typing = STEPS[step]?.typing === 'bot' && step < FINAL_STEP

	return (
		<div
			ref={rootRef}
			className="relative z-10 flex h-full items-center justify-center p-5 md:p-8"
		>
			{/* Janela da conversa — o painel que o gestor vê no portal. */}
			<div className="bg-card/95 flex h-full max-h-[36rem] w-[min(30rem,100%)] flex-col overflow-hidden rounded-xl border shadow-2xl">
				{/* Cabeçalho do chat. */}
				<div className="flex items-center gap-3 border-b px-4 py-3">
					<span className="flex size-9 items-center justify-center rounded-full bg-[#25d366]/15 text-[#128c4b]">
						<WhatsappLogo weight="fill" className="size-5" />
					</span>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium">
							{t.contact}
						</p>
						<p className="text-muted-foreground truncate font-mono text-[10px]">
							{typing ? t.typing : t.channel}
						</p>
					</div>
					<span className="text-foreground/40 font-mono text-[9px] tracking-widest uppercase">
						{t.livePortal}
					</span>
				</div>

				{/* Conversa. */}
				<div className="flex min-h-0 flex-1 flex-col justify-end gap-2.5 p-4">
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
						{/* Documento na conversa, como o bot envia de verdade. */}
						<div className="bg-muted/60 mt-2 flex items-center gap-2.5 rounded-lg border px-2.5 py-2">
							<FilePdf
								weight="fill"
								className="size-7 shrink-0 text-[#d93025]"
							/>
							<div className="min-w-0">
								<p className="truncate text-xs font-medium">
									COT-V-0187 · Nestlé SP.pdf
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
				<div className="flex items-center gap-2.5 border-t px-4 py-3">
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
