'use client'

import { Check, ShareNetwork } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

/** Label "Compartilhar" que copia o link do post para a área de transferência. */
export function ShareCopy({ className }: { className?: string }) {
	const [copied, setCopied] = useState(false)
	const copyTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => {
		return () => clearTimeout(copyTimeout.current)
	}, [])

	async function copyLink() {
		await navigator.clipboard.writeText(window.location.href)
		setCopied(true)
		clearTimeout(copyTimeout.current)
		copyTimeout.current = setTimeout(() => setCopied(false), 2000)
	}

	return (
		<button
			type="button"
			onClick={copyLink}
			className={cn('link-underline cursor-pointer', className)}
		>
			{copied ? (
				<Check className="text-brand size-4" />
			) : (
				<ShareNetwork className="size-4" />
			)}
			{copied ? 'Copiado' : 'Compartilhar'}
		</button>
	)
}
