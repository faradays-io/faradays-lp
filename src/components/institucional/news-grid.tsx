'use client'

import Link from 'next/link'

import { BLOG_POSTS } from '@/components/blog/blog-data'
import { Reveal } from '@/components/landing/reveal'
import { useCopy, useLang } from '@/components/language-provider'
import type { Lang } from '@/lib/i18n'

import { NEWS_COPY } from './copy'
import { CtaLink } from './cta-link'
import { MediaSlot } from './media-slot'

const MONTHS: Record<Lang, readonly string[]> = {
	pt: [
		'janeiro',
		'fevereiro',
		'março',
		'abril',
		'maio',
		'junho',
		'julho',
		'agosto',
		'setembro',
		'outubro',
		'novembro',
		'dezembro'
	],
	en: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	]
}

/* Formatação manual (sem Intl) para servidor e cliente sempre concordarem. */
function formatDate(iso: string, lang: Lang) {
	const [y, m, d] = iso.split('-').map(Number)
	const month = MONTHS[lang][m - 1]
	return lang === 'pt' ? `${d} de ${month} de ${y}` : `${month} ${d}, ${y}`
}

const LATEST = [...BLOG_POSTS]
	.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
	.slice(0, 3)

/**
 * Notícias da referência: título serif grande e CTA na mesma linha, três
 * colunas separadas por fio (data em caixa alta, título, capa quadrada).
 */
export function NewsGrid() {
	const t = useCopy(NEWS_COPY)
	const { lang } = useLang()
	return (
		<section id="noticias" className="py-31">
			<div className="max-w-page mx-auto w-full px-[var(--gutter)]">
				<Reveal className="flex flex-wrap items-end justify-between gap-8">
					<h2 className="text-serif-xl font-serif font-light">
						{t.title}
					</h2>
					<CtaLink href="/blog">{t.cta}</CtaLink>
				</Reveal>
				<div className="mt-20 grid md:grid-cols-3">
					{LATEST.map((post, i) => (
						<Reveal key={post.slug} delay={i * 0.08}>
							<Link
								href={`/blog/${post.slug}`}
								className="border-border group flex h-full flex-col gap-6 border-l px-6 pb-2"
							>
								<span className="text-foreground/60 text-xs tracking-[0.02em] uppercase">
									{formatDate(post.publishedAt, lang)}
								</span>
								<span className="text-foreground/85 group-hover:text-foreground min-h-[4.2em] text-base/[1.4] transition-colors">
									{post.title}
								</span>
								<div className="mt-auto aspect-square overflow-hidden rounded-lg">
									<MediaSlot
										label={t.cover}
										className="transition-transform duration-700 group-hover:scale-[1.03]"
									/>
								</div>
							</Link>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	)
}
