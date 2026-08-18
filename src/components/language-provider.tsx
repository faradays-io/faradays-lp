'use client'

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState
} from 'react'

import { HTML_LANG, type Lang, LANG_COOKIE, type Localized } from '@/lib/i18n'

/* Estado de idioma do cliente. Nasce do cookie lido pelo root layout
   (initialLang) — assim o SSR e a hidratação sempre concordam. O toggle
   troca o estado (swap imediato), persiste no cookie e atualiza o atributo
   lang do <html> para leitores de tela. */

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
	const [lang, setLangState] = useState<Lang>(initialLang)

	const setLang = useCallback((next: Lang) => {
		setLangState(next)
		document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
		document.documentElement.lang = HTML_LANG[next]
	}, [])

	return (
		<LanguageContext.Provider value={{ lang, setLang }}>
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
