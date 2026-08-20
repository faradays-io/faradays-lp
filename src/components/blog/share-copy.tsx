'use client'

import { Check, ShareNetwork } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'

import {
	type SplitSwapHandle,
	SplitSwapText
} from '@/components/custom-ui/split-swap-text'
import { cn } from '@/lib/utils'

const LABEL = 'Compartilhar'
const COPIED = 'Copiado!'

/** Tempo que "Copiado!" fica parado na tela antes do roll de volta. */
const HOLD_MS = 500

/**
 * Label "Compartilhar" que copia o link do post para a área de transferência.
 * A confirmação é a mesma do e-mail de contato: o rótulo rola para cima
 * caractere a caractere e "Copiado!" entra por baixo (`SplitSwapText`).
 */
export function ShareCopy({ className }: { className?: string }) {
	const [copied, setCopied] = useState(false)
	const swapRef = useRef<SplitSwapHandle>(null)
	const holdTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => {
		return () => clearTimeout(holdTimeout.current)
	}, [])

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(window.location.href)
		} catch {
			// Sem Clipboard API (contexto inseguro ou permissão negada):
			// nada a confirmar.
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
			<button
				type="button"
				onClick={copyLink}
				className={cn('cursor-pointer', className)}
			>
				{/* Os dois ícones ocupam a mesma caixa e se cruzam no lugar —
				   trocar por render condicional daria um corte seco. */}
				<span
					aria-hidden
					className="relative inline-block size-4 shrink-0"
				>
					<ShareNetwork
						className={cn(
							'absolute inset-0 size-4 transition duration-300 ease-out',
							copied
								? 'scale-50 rotate-45 opacity-0'
								: 'scale-100 rotate-0 opacity-100'
						)}
					/>
					<Check
						className={cn(
							'text-brand absolute inset-0 size-4 transition duration-300 ease-out',
							copied
								? 'scale-100 rotate-0 opacity-100'
								: 'scale-50 -rotate-45 opacity-0'
						)}
					/>
				</span>
				<SplitSwapText
					ref={swapRef}
					from={LABEL}
					to={COPIED}
					swapped={copied}
					toClassName="text-brand"
				/>
			</button>
			{/* Fora do <button> para não entrar no nome acessível. */}
			<span role="status" className="sr-only">
				{copied ? COPIED : ''}
			</span>
		</>
	)
}
