'use client'

import gsap from 'gsap'
import { useLayoutEffect, useMemo, useRef } from 'react'

import type { Lang } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/* BRL nos dois idiomas — a empresa cobra em reais; só a pontuação troca
   (pt: "R$ 1.490", en: "R$1,490"). Sem centavos: os planos são redondos. */
const LOCALE: Record<Lang, string> = { pt: 'pt-BR', en: 'en-US' }

export function formatBrl(value: number, lang: Lang) {
	return new Intl.NumberFormat(LOCALE[lang], {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(value)
}

/**
 * Preço que "rola" entre dois valores quando o toggle mensal/anual troca —
 * em vez de piscar, o número conta até o novo. O primeiro render sai já
 * formatado (SSR), então sem JS o preço está lá.
 *
 * O tween mexe no `textContent` por fora do React; o layout effect recoloca
 * o valor antigo antes da pintura, senão o commit mostraria o valor final
 * por um frame e voltaria para contar.
 */
export function PriceTicker({
	value,
	lang,
	className
}: {
	value: number
	lang: Lang
	className?: string
}) {
	const ref = useRef<HTMLSpanElement>(null)
	/* O último valor que chegou a ser exibido — de onde a próxima contagem
	   parte, mesmo que o toggle troque no meio de um tween. */
	const shown = useRef(value)
	const format = useMemo(() => (n: number) => formatBrl(n, lang), [lang])

	useLayoutEffect(() => {
		const el = ref.current
		if (!el) return
		const from = shown.current
		if (from === value) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			shown.current = value
			return
		}
		el.textContent = format(from)
		const state = { n: from }
		const tween = gsap.to(state, {
			n: value,
			duration: 0.6,
			ease: 'power2.out',
			snap: { n: 1 },
			onUpdate: () => {
				shown.current = state.n
				el.textContent = format(state.n)
			}
		})
		return () => {
			tween.kill()
		}
	}, [value, format])

	return (
		<span ref={ref} className={cn('tabular-nums', className)}>
			{format(value)}
		</span>
	)
}
