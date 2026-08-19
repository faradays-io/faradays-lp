import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/* Tamanhos semânticos do @theme (globals.css). O tailwind-merge só conhece
   os nomes nativos (text-xs…text-5xl); sem registrar estes, ele lê
   `text-body-sm` como se fosse uma cor e um `text-foreground` seguinte apaga
   o tamanho. */
const FONT_SIZES = [
	'display',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'body-lg',
	'body',
	'body-sm'
]

const twMerge = extendTailwindMerge({
	extend: { classGroups: { 'font-size': [{ text: FONT_SIZES }] } }
})

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
