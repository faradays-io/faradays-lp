/* Camada de idioma do site — PT é o padrão; EN entra pelo toggle da nav.
   Decisão de arquitetura: URL única (sem /en) — o idioma vive num cookie
   lido pelo root layout no request (SSR já sai no idioma certo, sem flash)
   e trocado no cliente pelo LanguageProvider. Custo assumido: ler cookie
   no layout torna todas as rotas dinâmicas. */

export const LANGS = ['pt', 'en'] as const
export type Lang = (typeof LANGS)[number]

export const DEFAULT_LANG: Lang = 'pt'
export const LANG_COOKIE = 'faradays-lang'

/** Valor do atributo `lang` do <html> para cada idioma. */
export const HTML_LANG: Record<Lang, string> = {
	pt: 'pt-BR',
	en: 'en'
}

export function isLang(value: unknown): value is Lang {
	return (
		typeof value === 'string' &&
		(LANGS as readonly string[]).includes(value)
	)
}

/** Um valor com variante por idioma — o formato de toda copy localizada. */
export type Localized<T> = Record<Lang, T>
