'use client'

import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useEffect, useRef, useState } from 'react'

import { useCopy } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'
import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/lib/links'
import { cn } from '@/lib/utils'

gsap.registerPlugin(SplitText)

const COPY = {
	pt: { copied: 'Copiado!' },
	en: { copied: 'Copied!' }
} satisfies Localized<Record<string, string>>

/** Tempo que "Copiado!" fica parado na tela antes do roll de volta. */
const HOLD_MS = 500
const ROLL_DURATION = 0.4
const ROLL_STAGGER = 0.025

/**
 * Link do e-mail de contato que, no clique, copia o endereço em vez de abrir
 * o cliente de e-mail. A confirmação é o próprio texto: o e-mail rola para
 * cima caractere a caractere (SplitText, mesmo roll do `SplitHoverText`) e
 * "Copiado!" entra por baixo; passado meio segundo a animação volta.
 *
 * O `href` mailto continua lá: ctrl/cmd-clique, "abrir em nova aba" e o menu
 * de contexto seguem o comportamento nativo, e sem JS o link ainda funciona.
 */
export function CopyEmail({
	className,
	children
}: {
	className?: string
	/** Rótulo visível — o padrão é o próprio endereço. */
	children?: string
}) {
	const t = useCopy(COPY)
	const label = children ?? CONTACT_EMAIL

	const [copied, setCopied] = useState(false)
	const rollRef = useRef<HTMLSpanElement>(null)
	const timelineRef = useRef<gsap.core.Timeline | null>(null)
	const holdTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => {
		const wrap = rollRef.current
		if (!wrap) return
		const from = wrap.querySelector<HTMLElement>('[data-roll="from"]')
		const to = wrap.querySelector<HTMLElement>('[data-roll="to"]')
		if (!from || !to) return

		let cancelled = false
		let mm: gsap.MatchMedia | undefined

		// Espera as fontes para o SplitText medir os glifos certos.
		document.fonts.ready.then(() => {
			if (cancelled) return
			mm = gsap.matchMedia()
			mm.add(
				{ motion: '(prefers-reduced-motion: no-preference)' },
				(ctx) => {
					// Com reduced-motion o roll vira uma troca seca.
					const duration = ctx.conditions?.motion ? ROLL_DURATION : 0
					const stagger = ctx.conditions?.motion ? ROLL_STAGGER : 0

					const fromSplit = SplitText.create(from, {
						type: 'chars',
						aria: 'none'
					})
					const toSplit = SplitText.create(to, {
						type: 'chars',
						aria: 'none'
					})

					// O link acompanha a largura do rótulo que está à frente,
					// para o sublinhado ficar justo nos dois. Quem segura o
					// espaço é o shell lá embaixo, então nada ao redor mexe.
					const fromWidth = from.getBoundingClientRect().width
					const toWidth = to.getBoundingClientRect().width

					// Revela a camada de baixo (oculta por CSS) e desce seus
					// caracteres uma linha, prontos para subir.
					gsap.set(to, { autoAlpha: 1 })
					gsap.set(toSplit.chars, { yPercent: 100 })

					const tl = gsap
						.timeline({ paused: true })
						.to(
							fromSplit.chars,
							{
								yPercent: -100,
								duration,
								ease: 'power3.inOut',
								stagger
							},
							0
						)
						.to(
							toSplit.chars,
							{
								yPercent: 0,
								duration,
								ease: 'power3.inOut',
								stagger
							},
							0
						)
						.fromTo(
							wrap,
							{ width: fromWidth },
							{
								width: toWidth,
								duration,
								ease: 'power3.inOut',
								// Só fixa a largura enquanto anima; em repouso
								// o wrapper volta a ser fluido.
								immediateRender: false
							},
							0
						)
					tl.eventCallback('onReverseComplete', () =>
						gsap.set(wrap, { clearProps: 'width' })
					)

					timelineRef.current = tl
					return () => {
						timelineRef.current = null
						tl.kill()
						fromSplit.revert()
						toSplit.revert()
						gsap.set(wrap, { clearProps: 'width' })
					}
				}
			)
		})

		return () => {
			cancelled = true
			mm?.revert()
		}
	}, [label, t.copied])

	useEffect(() => {
		return () => clearTimeout(holdTimeout.current)
	}, [])

	async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
		// Modificadores continuam sendo do navegador (nova aba, download…).
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
		e.preventDefault()

		try {
			await navigator.clipboard.writeText(CONTACT_EMAIL)
		} catch {
			// Sem Clipboard API (contexto inseguro ou permissão negada):
			// cai no comportamento nativo do mailto.
			window.location.href = CONTACT_MAILTO
			return
		}

		setCopied(true)
		const tl = timelineRef.current
		tl?.play()
		// Conta o hold a partir do fim do roll (a duração já inclui o
		// stagger), para "Copiado!" ficar legível o tempo cheio.
		clearTimeout(holdTimeout.current)
		holdTimeout.current = setTimeout(
			() => {
				setCopied(false)
				timelineRef.current?.reverse()
			},
			(tl?.duration() ?? 0) * 1000 + HOLD_MS
		)
	}

	return (
		<>
			{/* Shell: grade de uma célula só onde os dois rótulos entram como
			   espaçadores invisíveis, então a célula nasce com a largura do
			   mais largo e nunca muda. O link flutua por cima, alinhado à
			   esquerda e livre para encolher/crescer com o texto — o que
			   sobra é espaço morto dentro do shell, e nada em volta se
			   desloca. */}
			<span className="inline-grid">
				<span
					aria-hidden
					className={cn(
						'invisible col-start-1 row-start-1',
						className
					)}
				>
					{label}
				</span>
				<span
					aria-hidden
					className={cn(
						'invisible col-start-1 row-start-1',
						className
					)}
				>
					{t.copied}
				</span>
				<a
					href={CONTACT_MAILTO}
					onClick={handleClick}
					className={cn(
						'col-start-1 row-start-1 inline-block justify-self-start',
						className
					)}
				>
					{/* key: o SplitText muta o DOM por fora do React (o revert
					   restaura clones), então troca de texto via React cairia
					   em nós órfãos. Remontar recria o DOM e o efeito
					   re-splita. */}
					<span
						key={`${label}|${t.copied}`}
						ref={rollRef}
						className="relative inline-block overflow-hidden align-bottom"
					>
						<span
							data-roll="from"
							aria-hidden
							className="block w-max"
						>
							{label}
						</span>
						<span
							data-roll="to"
							aria-hidden
							className="text-brand invisible absolute top-0 left-0 block w-max"
						>
							{t.copied}
						</span>
					</span>
					{/* As camadas são aria-hidden; o nome acessível sai daqui. */}
					<span className="sr-only">{label}</span>
				</a>
			</span>
			{/* Fora do <a> para não entrar no nome acessível do link. */}
			<span role="status" className="sr-only">
				{copied ? t.copied : ''}
			</span>
		</>
	)
}
