'use client'

import { createContext, type ReactNode, useCallback, useContext } from 'react'

import { type Lang, LANG_COOKIE, type Localized } from '@/lib/i18n'

/* Estado de idioma. Nasce do cookie lido pelo root layout (initialLang) —
   SSR e hidratação sempre concordam. Trocar de idioma persiste o cookie e
   NAVEGA para a raiz com reload completo (location.assign, não router):
   o documento volta já no idioma novo e o HomeLoader roda de novo — mesmo
   quando já se está na /, pois assign para a própria URL também recarrega.
   Decisão: em vez de swap in-place (que deixava a troca "seca", sem a
   entrada coreografada), a troca de idioma re-apresenta o site. */

type LanguageContextValue = {
	lang: Lang
	setLang: (next: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
	initialLang,
	children
}: {
	initialLang: Lang
	children: ReactNode
}) {
	const setLang = useCallback((next: Lang) => {
		document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
		window.location.assign('/')
	}, [])

	return (
		<LanguageContext.Provider value={{ lang: initialLang, setLang }}>
			{children}
		</LanguageContext.Provider>
	)
}

export function useLang(): LanguageContextValue {
	const ctx = useContext(LanguageContext)
	if (!ctx)
		throw new Error('useLang precisa estar dentro de <LanguageProvider>')
	return ctx
}

/** Açúcar para o padrão dominante: `const t = useCopy(COPY)`. */
export function useCopy<T>(copy: Localized<T>): T {
	return copy[useLang().lang]
}
