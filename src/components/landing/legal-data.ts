import type { Localized } from '@/lib/i18n'

/* Páginas legais — fonte única para os links de rodapé e para as rotas em
   `src/app/(legal)`. O texto de cada uma é placeholder estrutural: precisa
   de redação jurídica antes de ir ao ar. */
export const LEGAL_PAGES = [
	{ slug: '/privacidade', label: { pt: 'Privacidade', en: 'Privacy' } },
	{ slug: '/cookies', label: { pt: 'Cookies', en: 'Cookies' } },
	{ slug: '/termos', label: { pt: 'Termos', en: 'Terms' } },
	{ slug: '/licencas', label: { pt: 'Licenças', en: 'Licenses' } }
] as const satisfies readonly { slug: string; label: Localized<string> }[]
