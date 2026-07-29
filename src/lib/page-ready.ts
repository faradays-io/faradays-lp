'use client'

import { useSyncExternalStore } from 'react'

/* ------------------------------------------------------------------ *
 * Store de "a página está pronta".
 *
 * Um único sinal para todas as animações de entrada do site: enquanto ele
 * for false, nada anima — nem stagger de nav/hero, nem ScrollTrigger, nem
 * loop de canvas. Quem levanta o sinal é o `PageTransition`, no fim do
 * loader; sem ele na página, a store se resolve sozinha no `load`, para que
 * rotas sem transição (not-found, error, páginas futuras) não fiquem
 * congeladas para sempre.
 * ------------------------------------------------------------------ */

let ready = false
/* Alguém (o PageTransition) assumiu a responsabilidade de sinalizar? Se sim,
   a auto-resolução no `load` não entra — o loader é que decide a hora. */
let claimed = false
let autoWired = false
const listeners = new Set<() => void>()

export function isPageReady() {
	return ready
}

/** Idempotente: o segundo mount (StrictMode) não re-notifica ninguém. */
export function markPageReady() {
	if (ready) return
	ready = true
	for (const listener of listeners) listener()
}

/**
 * Declara que esta página tem um loader e que ele é quem chama
 * `markPageReady()`. Desarma a auto-resolução no `load`.
 */
export function claimPageReady() {
	claimed = true
}

/* Rede de segurança das páginas sem loader: só arma quando alguém começa a
   escutar, e nunca sobrescreve um `claim`. */
function wireAutoResolve() {
	if (autoWired || claimed || ready) return
	autoWired = true
	const resolve = () => {
		if (!claimed) markPageReady()
	}
	if (document.readyState === 'complete') resolve()
	else window.addEventListener('load', resolve, { once: true })
}

export function subscribePageReady(listener: () => void) {
	listeners.add(listener)
	wireAutoResolve()
	return () => {
		listeners.delete(listener)
	}
}

/**
 * `false` até o loader terminar (e no servidor). Use como dependência de
 * efeito: `useEffect(() => { if (!ready) return … }, [ready])`.
 */
export function usePageReady() {
	return useSyncExternalStore(subscribePageReady, isPageReady, () => false)
}
