'use client'

import { useEffect, useRef } from 'react'

/** Registra o acesso ao post (fire-and-forget). Não renderiza nada. */
export function ViewCounter({ slug }: { slug: string }) {
	const sent = useRef(false)

	useEffect(() => {
		// Guard contra o double-invoke do StrictMode em dev.
		if (sent.current) return
		sent.current = true
		fetch(`/api/views/${slug}`, { method: 'POST' }).catch(() => {})
	}, [slug])

	return null
}
