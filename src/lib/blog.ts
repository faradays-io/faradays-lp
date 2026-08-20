import type { PostBlock } from '@/components/blog/blog-data'

/** Id determinístico para headings — usado no corpo e no TOC. */
export function slugify(text: string): string {
	return text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
}

export type PostHeading = {
	id: string
	text: string
	level: 2 | 3
}

/** Extrai headings dos blocos com ids únicos (sufixo incremental em colisão). */
export function extractHeadings(blocks: readonly PostBlock[]): PostHeading[] {
	const seen = new Map<string, number>()
	const headings: PostHeading[] = []
	for (const block of blocks) {
		if (block.type !== 'heading') continue
		const base = slugify(block.text)
		const count = seen.get(base) ?? 0
		seen.set(base, count + 1)
		headings.push({
			id: count === 0 ? base : `${base}-${count}`,
			text: block.text,
			level: block.level
		})
	}
	return headings
}

const WORDS_PER_MINUTE = 200

/** Minutos de leitura estimados (~200 wpm), mínimo 1. */
export function readingTime(blocks: readonly PostBlock[]): number {
	let words = 0
	for (const block of blocks) {
		if (block.type === 'list') {
			for (const item of block.items) words += countWords(item)
		} else {
			words += countWords(block.text)
		}
	}
	return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

function countWords(text: string): number {
	return text.split(/\s+/).filter(Boolean).length
}

const DATE_FORMAT = new Intl.DateTimeFormat('pt-BR', {
	day: '2-digit',
	month: 'short',
	year: 'numeric'
})

/**
 * '2026-07-21' → '21 jul 2026'.
 *
 * Montado a partir das partes em vez do `format()` inteiro: em pt-BR ele
 * costura os literais ('21 de jul. de 2026'), que pesam demais numa linha de
 * metadados. Ficam só os números, o mês abreviado sem ponto e o espaço.
 */
export function formatPostDate(iso: string): string {
	return DATE_FORMAT.formatToParts(new Date(`${iso}T12:00:00`))
		.filter((part) => part.type !== 'literal')
		.map((part) =>
			part.type === 'month' ? part.value.replace('.', '') : part.value
		)
		.join(' ')
}

const VIEWS_FORMAT = new Intl.NumberFormat('pt-BR', {
	notation: 'compact',
	maximumFractionDigits: 1
})

/** 1842 → '1,8 mil'. */
export function formatViews(views: number): string {
	return VIEWS_FORMAT.format(views)
}
