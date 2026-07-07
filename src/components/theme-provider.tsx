'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

/**
 * Thin wrapper over next-themes. Mounted once in the root layout.
 * `attribute="class"` toggles the `.dark` class on <html> — the same hook
 * `globals.css` uses for its `:root` / `.dark` token sets.
 */
export function ThemeProvider({
	children,
	...props
}: ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
