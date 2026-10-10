'use client'

import { Globe } from '@phosphor-icons/react'

import { useCopy, useLang } from '@/components/language-provider'

import { SHELL_COPY } from './copy'

/** O globo flutuante da referência: troca PT/EN de qualquer ponto da página. */
export function LanguageGlobe() {
	const { lang, setLang } = useLang()
	const t = useCopy(SHELL_COPY)
	return (
		<button
			type="button"
			aria-label={t.switchLang}
			title={t.switchLang}
			onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
			className="fixed right-6 bottom-6 z-40 flex size-12 items-center justify-center rounded-full bg-black text-white shadow-lg ring-2 ring-white/80 transition-transform hover:scale-105"
		>
			<Globe className="size-6" weight="light" />
		</button>
	)
}
