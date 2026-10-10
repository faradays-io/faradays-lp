'use client'

import { CaretDown } from '@phosphor-icons/react'
import Link from 'next/link'

import { FaradaysLockup } from '@/components/landing/faradays-lockup'
import { SOLUTIONS } from '@/components/landing/solutions-data'
import { useCopy, useLang } from '@/components/language-provider'
import { BOOKING_URL } from '@/lib/links'

import { ANNOUNCEMENT_HREF, SHELL_COPY } from './copy'

/**
 * Cabeçalho fixo da referência: faixa preta de anúncio por cima e a barra
 * branca com fio embaixo. Não some no scroll (ao contrário da `NavBar` das
 * páginas de produto) — a referência mantém a marca sempre à vista.
 *
 * Altura total 6.5rem (2.5 + 4), compensada pelo `pt-26` do main.
 */
export function SiteHeader() {
	const { lang } = useLang()
	const t = useCopy(SHELL_COPY)

	return (
		<header className="fixed inset-x-0 top-0 z-50">
			{/* `.dark` no subtree: fundo quase preto e o azul da marca na versão
			   clara, que é a que contrasta sobre preto. */}
			<div className="dark bg-background text-foreground flex h-10 items-center justify-center gap-4 px-[var(--gutter)] text-sm">
				<p className="truncate">{t.announcement}</p>
				<Link
					href={ANNOUNCEMENT_HREF}
					className="text-brand shrink-0 font-mono text-xs tracking-wide uppercase hover:underline"
				>
					{t.announcementLink}
				</Link>
			</div>

			<div className="bg-background border-border border-b">
				<nav className="max-w-page mx-auto flex h-16 w-full items-center justify-between px-[var(--gutter)]">
					<Link href="/" aria-label="Faradays">
						<FaradaysLockup className="h-6 w-auto" />
					</Link>

					<div className="flex items-center gap-8">
						<div className="group relative hidden md:block">
							<button
								type="button"
								aria-haspopup="menu"
								className="text-foreground/70 hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
							>
								{t.solutions}
								<CaretDown className="size-3 transition-transform duration-200 group-hover:rotate-180" />
							</button>
							{/* pt-3 faz a ponte de hover entre gatilho e painel. */}
							<div className="pointer-events-none absolute top-full right-0 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
								<div className="bg-background border-border w-96 rounded-xl border p-2 shadow-lg">
									{SOLUTIONS.map((solution) =>
										solution.available ? (
											<Link
												key={solution.slug}
												href={solution.slug}
												className="hover:bg-muted block rounded-lg p-4 transition-colors"
											>
												<span className="font-serif text-lg font-light">
													{solution.name[lang]}
												</span>
												<span className="text-muted-foreground mt-1 block text-sm">
													{solution.description[lang]}
												</span>
											</Link>
										) : (
											<div
												key={solution.slug}
												aria-disabled
												className="flex items-baseline justify-between gap-4 rounded-lg px-4 py-3 select-none"
											>
												<span className="text-foreground/45 font-serif font-light">
													{solution.name[lang]}
												</span>
												<span className="text-foreground/35 font-mono text-xs">
													{t.soon}
												</span>
											</div>
										)
									)}
								</div>
							</div>
						</div>
						<Link
							href="/blog"
							className="text-foreground/70 hover:text-foreground hidden text-sm transition-colors md:block"
						>
							{t.blog}
						</Link>
						<a
							href={BOOKING_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="bg-brand text-brand-foreground hover:bg-brand/90 font-heading inline-flex h-10 items-center rounded-lg px-4 text-xs tracking-[0.02em] whitespace-nowrap uppercase transition-colors"
						>
							<span className="sm:hidden">{t.talkShort}</span>
							<span className="hidden sm:inline">{t.talk}</span>
						</a>
					</div>
				</nav>
			</div>
		</header>
	)
}
