import {
	Geist,
	Geist_Mono,
	JetBrains_Mono,
	Libre_Baskerville,
	Manrope,
	Merriweather,
	PT_Serif,
	Space_Grotesk
} from 'next/font/google'
import localFont from 'next/font/local'

/* ------------------------------------------------------------------ *
 * Font registry — single source of truth.
 * Add/remove fonts here. layout.tsx applies the active pair (TYPE),
 * globals.css maps the role vars (--ff-*) to Tailwind utilities,
 * /fonts renders SPECIMENS to compare them all.
 * ------------------------------------------------------------------ */

// ---- Google (all variable → no `weight` needed) -------------------
export const geist = Geist({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-geist'
})
export const manrope = Manrope({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-manrope'
})
export const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-space-grotesk'
})
export const geistMono = Geist_Mono({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-geist-mono'
})
export const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-jetbrains-mono'
})
export const merriweather = Merriweather({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-merriweather'
})
/* Exceção à regra do bloco: Libre Baskerville NÃO é variável — só existem
   Regular 400, Italic 400 e Bold 700 —, então as instâncias vêm listadas.
   Sem 600: pedir `font-semibold` cai no 700 pelo casamento do browser
   (para peso > 500 ele procura primeiro os pesos acima), sem falso negrito. */
export const libreBaskerville = Libre_Baskerville({
	subsets: ['latin'],
	weight: ['400', '700'],
	display: 'swap',
	variable: '--font-libre-baskerville'
})
// Mesma história da anterior: PT Serif também não é variável (400/700).
export const ptSerif = PT_Serif({
	subsets: ['latin'],
	weight: ['400', '700'],
	display: 'swap',
	variable: '--font-pt-serif'
})

// ---- Local (src relative to this file) ----------------------------
export const alliance = localFont({
	src: '../fonts/alliance/Degarism Studio - Alliance No.1 Light.woff2',
	weight: '300',
	display: 'swap',
	variable: '--font-alliance'
})
export const allianceNo2 = localFont({
	src: '../fonts/alliance/Degarism Studio - Alliance No.2 Light.woff2',
	weight: '300',
	display: 'swap',
	variable: '--font-alliance-no2'
})
export const fixel = localFont({
	src: [
		{
			path: '../fonts/fixel/FixelVariable.woff2',
			weight: '100 900',
			style: 'normal'
		},
		{
			path: '../fonts/fixel/FixelVariableItalic.woff2',
			weight: '100 900',
			style: 'italic'
		}
	],
	display: 'swap',
	variable: '--font-fixel'
})
export const aspekta = localFont({
	src: '../fonts/aspekta/AspektaVF.woff2',
	weight: '100 900',
	display: 'swap',
	variable: '--font-aspekta'
})

/* ------------------------------------------------------------------ *
 * ACTIVE PAIR — the project swap point. Change these to re-theme.
 * ------------------------------------------------------------------ */
export const TYPE = {
	heading: geist,
	body: aspekta,
	mono: jetbrainsMono,
	serif: merriweather
}

// Variables to mount on <html> so the active fonts self-host globally.
export const activeFontVariables = [
	TYPE.heading,
	TYPE.body,
	TYPE.mono,
	TYPE.serif
]
	.map((f) => f.variable)
	.join(' ')

/* ------------------------------------------------------------------ *
 * SPECIMENS — consumed only by /fonts (loads every font on that route).
 * ------------------------------------------------------------------ */
export type FontCategory = 'sans' | 'grotesk' | 'mono' | 'serif'

export interface FontSpecimen {
	name: string
	category: FontCategory
	source: 'google' | 'local'
	className: string
}

export const SPECIMENS: FontSpecimen[] = [
	{
		name: 'Alliance No.1',
		category: 'sans',
		source: 'local',
		className: alliance.className
	},
	{
		name: 'Alliance No.2',
		category: 'sans',
		source: 'local',
		className: allianceNo2.className
	},
	{
		name: 'Manrope',
		category: 'sans',
		source: 'google',
		className: manrope.className
	},
	{
		name: 'Geist',
		category: 'sans',
		source: 'google',
		className: geist.className
	},
	{
		name: 'Fixel',
		category: 'grotesk',
		source: 'local',
		className: fixel.className
	},
	{
		name: 'Aspekta',
		category: 'grotesk',
		source: 'local',
		className: aspekta.className
	},
	{
		name: 'Space Grotesk',
		category: 'grotesk',
		source: 'google',
		className: spaceGrotesk.className
	},
	{
		name: 'Geist Mono',
		category: 'mono',
		source: 'google',
		className: geistMono.className
	},
	{
		name: 'JetBrains Mono',
		category: 'mono',
		source: 'google',
		className: jetbrainsMono.className
	},
	{
		name: 'Merriweather',
		category: 'serif',
		source: 'google',
		className: merriweather.className
	},
	{
		name: 'Libre Baskerville',
		category: 'serif',
		source: 'google',
		className: libreBaskerville.className
	},
	{
		name: 'PT Serif',
		category: 'serif',
		source: 'google',
		className: ptSerif.className
	}
]

export const CATEGORY_LABELS: Record<FontCategory, string> = {
	sans: 'Sans',
	grotesk: 'Sans (Grotesk)',
	mono: 'Mono',
	serif: 'Serif'
}
