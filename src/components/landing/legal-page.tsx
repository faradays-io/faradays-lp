'use client'

import { ArrowLeft } from '@phosphor-icons/react'
import Link from 'next/link'
import { Fragment, type ReactNode } from 'react'

import { CopyEmail } from '@/components/landing/copy-email'
import { LEGAL_INDEX, LEGAL_PAGES } from '@/components/landing/legal-data'
import { useCopy, useLang } from '@/components/language-provider'
import { slugify } from '@/lib/blog'
import type { Localized } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/* Blocos de conteúdo de uma seção legal. String pura é parágrafo; os demais
   cobrem o que um aviso de privacidade ou um termo de uso precisa além de
   prosa: listas, tabela (bases legais, subprocessadores) e subseções
   numeradas (3.1, 3.2…). Texto inline aceita `[rótulo](href)` para links e
   `**negrito**` — o suficiente para cruzar políticas sem JSX no conteúdo. */
export type LegalBlock =
	| string
	| { type: 'list'; ordered?: boolean; items: readonly string[] }
	| {
			type: 'table'
			head: readonly string[]
			rows: readonly (readonly string[])[]
	  }
	| { type: 'sub'; heading: string; body: readonly LegalBlock[] }

export type LegalSection = { heading: string; body: readonly LegalBlock[] }

export type LegalContent = {
	title: string
	/** Data da última revisão, já formatada (ex.: "27 de julho de 2026"). */
	updatedAt: string
	/** Data da primeira publicação, quando diferente da revisão. */
	originalAt?: string
	intro: string | readonly string[]
	sections: readonly LegalSection[]
	/** Numera as seções (1., 2.… e 3.1 nas subseções) e mostra o sumário. */
	numbered?: boolean
}

const COPY = {
	pt: {
		updatedAt: 'Atualizado em',
		originalAt: 'Versão original',
		toc: 'Sumário',
		questions: 'Dúvidas sobre esta política?',
		ariaPolicies: 'Políticas',
		ariaToc: 'Sumário do documento'
	},
	en: {
		updatedAt: 'Last updated',
		originalAt: 'Original version',
		toc: 'Contents',
		questions: 'Questions about this policy?',
		ariaPolicies: 'Policies',
		ariaToc: 'Document contents'
	}
} satisfies Localized<Record<string, string>>

/* `[rótulo](href)` e `**negrito**` → Link/strong. Um regex só, alternado,
   para manter a ordem original dos trechos. Hrefs internos usam <Link>;
   externos abrem em nova aba. */
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g

function renderInline(text: string): ReactNode {
	const out: ReactNode[] = []
	let last = 0
	for (const match of text.matchAll(INLINE)) {
		const index = match.index ?? 0
		if (index > last) out.push(text.slice(last, index))
		const [, label, href, bold] = match
		if (href) {
			const external = /^https?:\/\//.test(href)
			out.push(
				external ? (
					<a
						key={index}
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						className="link-underline text-foreground hover:text-brand transition-colors"
					>
						{label}
					</a>
				) : (
					<Link
						key={index}
						href={href}
						className="link-underline text-foreground hover:text-brand transition-colors"
					>
						{label}
					</Link>
				)
			)
		} else {
			out.push(
				<strong key={index} className="text-foreground font-medium">
					{bold}
				</strong>
			)
		}
		last = index + match[0].length
	}
	if (last < text.length) out.push(text.slice(last))
	return out.length === 1 ? out[0] : out
}

const PARAGRAPH = 'text-foreground/70 leading-relaxed'

function LegalBlocks({
	blocks,
	prefix
}: {
	blocks: readonly LegalBlock[]
	/** Prefixo de numeração das subseções ("3." → "3.1", "3.2"…). */
	prefix?: string
}) {
	/* Numeração das subseções calculada antes do render (sem reatribuir
	   dentro do map — o compilador do React não aceita). */
	const subNumbers: number[] = []
	let subCount = 0
	for (const block of blocks) {
		if (typeof block !== 'string' && block.type === 'sub') subCount += 1
		subNumbers.push(subCount)
	}
	return (
		<>
			{blocks.map((block, i) => {
				if (typeof block === 'string') {
					return (
						<p key={i} className={cn(PARAGRAPH, 'mt-3')}>
							{renderInline(block)}
						</p>
					)
				}
				switch (block.type) {
					case 'list': {
						const ListTag = block.ordered ? 'ol' : 'ul'
						return (
							<ListTag
								key={i}
								className={cn(
									PARAGRAPH,
									'mt-3 space-y-2 pl-5',
									block.ordered
										? 'list-decimal marker:font-mono marker:text-xs'
										: 'marker:text-foreground/40 list-disc'
								)}
							>
								{block.items.map((item, j) => (
									<li key={j}>{renderInline(item)}</li>
								))}
							</ListTag>
						)
					}
					case 'table':
						return (
							<div key={i} className="mt-4 overflow-x-auto">
								<table className="border-border w-full min-w-[36rem] border-collapse text-left text-sm">
									<thead>
										<tr className="border-border border-b">
											{block.head.map((cell, j) => (
												<th
													key={j}
													scope="col"
													className="text-foreground/50 py-2 pr-4 font-mono text-xs font-normal tracking-wide uppercase"
												>
													{cell}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{block.rows.map((row, r) => (
											<tr
												key={r}
												className="border-border border-b align-top"
											>
												{row.map((cell, c) => (
													<td
														key={c}
														className={cn(
															'py-3 pr-4 leading-relaxed',
															c === 0
																? 'text-foreground'
																: 'text-foreground/70'
														)}
													>
														{renderInline(cell)}
													</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)
					case 'sub': {
						const number = prefix
							? `${prefix}${subNumbers[i]}.`
							: null
						return (
							<Fragment key={i}>
								<h3 className="font-heading text-body-lg mt-7 font-medium">
									{number ? (
										<span className="text-foreground/40 mr-2 font-mono text-sm">
											{number}
										</span>
									) : null}
									{block.heading}
								</h3>
								<LegalBlocks blocks={block.body} />
							</Fragment>
						)
					}
				}
			})}
		</>
	)
}

/**
 * Casca das páginas legais: mesma tipografia e mesmo fundo da home, coluna
 * única de leitura, volta para o índice de políticas e rodapé cruzando as
 * demais. O conteúdo entra por `content` (variante por idioma) — cada rota
 * traz o seu; `slug` identifica a página ativa no rodapé. Documentos longos
 * (`numbered`) ganham sumário com âncoras e numeração de seções.
 */
export function LegalPage({
	slug,
	content
}: {
	slug: string
	content: Localized<LegalContent>
}) {
	const { lang } = useLang()
	const t = useCopy(COPY)
	const { title, updatedAt, originalAt, intro, sections, numbered } =
		content[lang]
	const intros = typeof intro === 'string' ? [intro] : intro
	const ids = sections.map((section) => slugify(section.heading))

	return (
		<div className="light light-home bg-background text-foreground flex min-h-svh flex-col">
			<main className="mx-auto w-full max-w-5xl flex-1 px-7 py-16 md:py-24">
				<nav
					aria-label="Breadcrumb"
					className="text-foreground/60 flex flex-wrap items-center gap-2 font-mono text-xs tracking-wide uppercase"
				>
					<Link
						href="/"
						className="hover:text-foreground inline-flex items-center gap-2 transition-colors"
					>
						<ArrowLeft className="size-3.5" />
						Faradays
					</Link>
					<span aria-hidden>/</span>
					<Link
						href={LEGAL_INDEX.slug}
						className={cn(
							'transition-colors',
							slug === LEGAL_INDEX.slug
								? 'text-foreground'
								: 'hover:text-foreground'
						)}
					>
						{LEGAL_INDEX.label[lang]}
					</Link>
				</nav>

				<h1 className="font-heading text-h2 mt-8">{title}</h1>
				<p className="text-foreground/50 mt-3 font-mono text-xs">
					{originalAt ? (
						<>
							{t.originalAt} {originalAt}
							<span aria-hidden className="mx-2">
								·
							</span>
						</>
					) : null}
					{t.updatedAt} {updatedAt}
				</p>

				<div className="mt-8 flex flex-col gap-4">
					{intros.map((paragraph, i) => (
						<p
							key={i}
							className={cn(
								i === 0 ? 'text-body-lg' : 'text-body',
								'text-foreground/70 leading-relaxed'
							)}
						>
							{renderInline(paragraph)}
						</p>
					))}
				</div>

				{numbered ? (
					<nav
						aria-label={t.ariaToc}
						className="border-border mt-12 border-y py-6"
					>
						<p className="text-foreground/50 font-mono text-xs tracking-wide uppercase">
							{t.toc}
						</p>
						<ol className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
							{sections.map((section, i) => (
								<li key={ids[i]} className="flex gap-3">
									<span className="text-foreground/40 w-6 shrink-0 font-mono text-xs leading-6">
										{i + 1}.
									</span>
									<a
										href={`#${ids[i]}`}
										className="link-underline text-foreground/80 hover:text-foreground text-sm leading-6 transition-colors"
									>
										{section.heading}
									</a>
								</li>
							))}
						</ol>
					</nav>
				) : null}

				<div className="mt-12 flex flex-col gap-10">
					{sections.map((section, i) => (
						<section
							key={ids[i]}
							id={ids[i]}
							className="scroll-mt-24"
						>
							<h2 className="font-heading text-h5">
								{numbered ? (
									<span className="text-foreground/40 mr-3 font-mono text-sm">
										{i + 1}.
									</span>
								) : null}
								{section.heading}
							</h2>
							<LegalBlocks
								blocks={section.body}
								prefix={numbered ? `${i + 1}.` : undefined}
							/>
						</section>
					))}
				</div>

				<p className="text-foreground/60 text-body-sm mt-14">
					{t.questions}{' '}
					<CopyEmail className="link-underline hover:text-brand transition-colors" />
				</p>
			</main>

			<footer className="border-border border-t">
				<div className="text-foreground/50 mx-auto flex w-full max-w-5xl flex-col gap-4 px-7 py-8 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
					<span>© {new Date().getFullYear()} Faradays</span>
					<nav
						aria-label={t.ariaPolicies}
						className="flex flex-wrap gap-4"
					>
						{LEGAL_PAGES.map((page) => (
							<Link
								key={page.slug}
								href={page.slug}
								className={cn(
									'link-underline transition-colors',
									page.slug === slug
										? 'text-foreground'
										: 'hover:text-foreground'
								)}
							>
								{page.label[lang]}
							</Link>
						))}
					</nav>
				</div>
			</footer>
		</div>
	)
}
