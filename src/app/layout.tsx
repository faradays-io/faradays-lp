import './globals.css'

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import type { CSSProperties } from 'react'

import { CustomScrollbar } from '@/components/custom-ui/custom-scrollbar'
import { LanguageProvider } from '@/components/language-provider'
import { LenisProvider } from '@/components/lenis-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { activeFontVariables, TYPE } from '@/lib/fonts'
import { DEFAULT_LANG, HTML_LANG, isLang, LANG_COOKIE } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
	title: 'Faradays — AI agents for enterprise support',
	description:
		'Landing page study inspired by giga.ai — structure and motion, with original placeholder content.',
	verification: {
		other: {
			'facebook-domain-verification': 'bvn3zc4rndhujiy2yzs7or5ooluoqy'
		}
	}
}

// Map the active pair to role vars consumed by globals.css (@theme inline).
const fontRoles = {
	'--ff-heading': TYPE.heading.style.fontFamily,
	'--ff-body': TYPE.body.style.fontFamily,
	'--ff-mono': TYPE.mono.style.fontFamily,
	'--ff-serif': TYPE.serif.style.fontFamily
} as CSSProperties

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	/* Idioma do request: cookie do toggle ou PT. Ler cookie aqui torna as
	   rotas dinâmicas — custo aceito para o primeiro paint já sair no
	   idioma certo (sem flash nem hydration mismatch). */
	const cookieLang = (await cookies()).get(LANG_COOKIE)?.value
	const lang = isLang(cookieLang) ? cookieLang : DEFAULT_LANG

	return (
		<html
			lang={HTML_LANG[lang]}
			className={cn(activeFontVariables, 'font-sans')}
			style={fontRoles}
			suppressHydrationWarning
		>
			<body className="bg-background antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					forcedTheme="dark"
					disableTransitionOnChange
				>
					<LanguageProvider initialLang={lang}>
						<LenisProvider>
							{children}
							<CustomScrollbar />
						</LenisProvider>
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
