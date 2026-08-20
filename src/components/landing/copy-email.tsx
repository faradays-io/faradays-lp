'use client'

import { useEffect, useRef, useState } from 'react'

import {
	type SplitSwapHandle,
	SplitSwapText
} from '@/components/custom-ui/split-swap-text'
import { useCopy } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'
import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/lib/links'

const COPY = {
	pt: { copied: 'Copiado!' },
	en: { copied: 'Copied!' }
} satisfies Localized<Record<string, string>>

/** Tempo que "Copiado!" fica parado na tela antes do roll de volta. */
const HOLD_MS = 500

/**
 * Link do e-mail de contato que, no clique, copia o endereço em vez de abrir
 * o cliente de e-mail. A confirmação é o próprio texto: o e-mail rola para
 * cima caractere a caractere e "Copiado!" entra por baixo (`SplitSwapText`);
 * passado meio segundo a animação volta.
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
	const swapRef = useRef<SplitSwapHandle>(null)
	const holdTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => {
		return () => clearTimeout(holdTimeout.current)
	}, [])

	async function handleClick(e: React.MouseEvent<HTMLElement>) {
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
		// Conta o hold a partir do fim do roll (a duração já inclui o
		// stagger), para "Copiado!" ficar legível o tempo cheio.
		clearTimeout(holdTimeout.current)
		holdTimeout.current = setTimeout(
			() => setCopied(false),
			(swapRef.current?.duration() ?? 0) * 1000 + HOLD_MS
		)
	}

	return (
		<>
			<SplitSwapText
				as="a"
				ref={swapRef}
				href={CONTACT_MAILTO}
				onClick={handleClick}
				from={label}
				to={t.copied}
				swapped={copied}
				className={className}
				toClassName="text-brand"
			/>
			{/* Fora do <a> para não entrar no nome acessível do link. */}
			<span role="status" className="sr-only">
				{copied ? t.copied : ''}
			</span>
		</>
	)
}
