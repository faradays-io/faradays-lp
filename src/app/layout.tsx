import './globals.css'

import type { Metadata } from 'next'
import type { CSSProperties } from 'react'

import { CustomScrollbar } from '@/components/custom-ui/custom-scrollbar'
import { LenisProvider } from '@/components/lenis-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { activeFontVariables, TYPE } from '@/lib/fonts'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
	title: 'Faradays — AI agents for enterprise support',
	description:
		'Landing page study inspired by giga.ai — structure and motion, with original placeholder content.'
}

// Map the active pair to role vars consumed by globals.css (@theme inline).
const fontRoles = {
	'--ff-heading': TYPE.heading.style.fontFamily,
	'--ff-body': TYPE.body.style.fontFamily,
	'--ff-mono': TYPE.mono.style.fontFamily,
	'--ff-serif': TYPE.serif.style.fontFamily
} as CSSProperties

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
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
					<LenisProvider>
						{children}
						<CustomScrollbar />
					</LenisProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
