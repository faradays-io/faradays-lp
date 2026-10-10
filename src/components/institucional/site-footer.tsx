'use client'

import { LinkedinLogo } from '@phosphor-icons/react'
import Link from 'next/link'

import { CopyEmail } from '@/components/landing/copy-email'
import { FaradaysWordmark } from '@/components/landing/faradays-wordmark'
import { FOOTER_LEGAL_LINKS } from '@/components/landing/legal-data'
import { SOLUTIONS } from '@/components/landing/solutions-data'
import { useCopy, useLang } from '@/components/language-provider'
import { LANGS } from '@/lib/i18n'
import { BOOKING_URL } from '@/lib/links'
import { cn } from '@/lib/utils'

import { FOOTER_COPY, SHELL_COPY } from './copy'

const LINK =
	'text-foreground/75 hover:text-foreground text-sm transition-colors'

/**
 * Rodapé da referência: um card cinza com margem curta, quatro colunas de
 * links, a linha de sociais/idioma/copyright entre fios e o wordmark
 * gigante ocupando a largura toda no pé.
 */
export function SiteFooter() {
	const t = useCopy(FOOTER_COPY)
	const shell = useCopy(SHELL_COPY)
	const { lang, setLang } = useLang()

	const columns = [
		{
			title: t.solutions,
			items: SOLUTIONS.map((s) =>
				s.available ? (
					<Link key={s.slug} href={s.slug} className={LINK}>
						{s.name[lang]}
					</Link>
				) : (
					<span key={s.slug} className="text-foreground/40 text-sm">
						{s.name[lang]} {shell.soon}
					</span>
				)
			)
		},
		{
			title: t.resources,
			items: [
				<Link key="blog" href="/blog" className={LINK}>
					{shell.blog}
				</Link>,
				<Link key="pol" href="/politicas" className={LINK}>
					{t.policies}
				</Link>
			]
		},
		{
			title: t.contact,
			items: [
				<CopyEmail key="mail" className={LINK} />,
				<a
					key="demo"
					href={BOOKING_URL}
					target="_blank"
					rel="noopener noreferrer"
					className={LINK}
				>
					{t.bookDemo}
				</a>
			]
		},
		{
			title: t.legal,
			items: FOOTER_LEGAL_LINKS.map((page) => (
				<Link key={page.slug} href={page.slug} className={LINK}>
					{page.label[lang]}
				</Link>
			))
		}
	]

	return (
		<footer id="footer" className="px-2 pb-2">
			<div className="max-w-page mx-auto overflow-hidden rounded-xl bg-[#e4e4e2]">
				<div className="grid gap-12 px-8 pt-12 pb-16 sm:grid-cols-2 md:px-12 lg:grid-cols-4">
					{columns.map((column) => (
						<div key={column.title} className="flex flex-col gap-4">
							<span className="text-foreground/45 text-xs tracking-[0.02em] uppercase">
								{column.title}
							</span>
							<ul className="flex flex-col gap-2.5">
								{column.items.map((item, i) => (
									<li key={i}>{item}</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="border-border flex flex-wrap items-center justify-between gap-6 border-y px-8 py-6 text-xs tracking-[0.02em] uppercase md:px-12">
					<a
						href="#"
						aria-label="LinkedIn"
						className="text-foreground/75 hover:text-foreground transition-colors"
					>
						<LinkedinLogo className="size-5" weight="fill" />
					</a>
					<div className="flex items-center gap-3">
						{LANGS.map((l) => (
							<button
								key={l}
								type="button"
								onClick={() => l !== lang && setLang(l)}
								aria-current={l === lang ? 'true' : undefined}
								className={cn(
									'uppercase transition-colors',
									l === lang
										? 'text-foreground'
										: 'text-foreground/45 hover:text-foreground'
								)}
							>
								{l}
							</button>
						))}
					</div>
					<p className="text-foreground/75">
						© 2026 Faradays Consulting LTDA. {t.rights}
					</p>
				</div>

				<div className="px-8 pt-10 pb-8 md:px-12">
					<FaradaysWordmark className="block w-full" />
				</div>
			</div>
		</footer>
	)
}
