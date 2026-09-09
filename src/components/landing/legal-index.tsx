'use client'

import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import Link from 'next/link'

import { CopyEmail } from '@/components/landing/copy-email'
import { LEGAL_INDEX, LEGAL_PAGES } from '@/components/landing/legal-data'
import { useCopy, useLang } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'

const COPY = {
	pt: {
		title: 'Diretrizes e políticas',
		intro: 'Os documentos que regem a relação entre a Faradays, quem visita este site e quem contrata a plataforma. Os Termos e o Aviso de Privacidade formam um conjunto: um remete ao outro e valem juntos. Os demais detalham pontos específicos.',
		company:
			'Faradays Consulting LTDA · CNPJ 65.590.441/0001-36 · São Paulo, SP',
		questions: 'Dúvidas sobre qualquer política?',
		ariaPolicies: 'Políticas'
	},
	en: {
		title: 'Guidelines and policies',
		intro: 'The documents that govern the relationship between Faradays, visitors of this website and customers of the platform. The Terms and the Privacy Notice work as a set: each refers to the other and they apply together. The others cover specific points in detail.',
		company:
			'Faradays Consulting LTDA · CNPJ 65.590.441/0001-36 · São Paulo, Brazil',
		questions: 'Questions about any policy?',
		ariaPolicies: 'Policies'
	}
} satisfies Localized<Record<string, string>>

/**
 * Índice das páginas legais (`/politicas`) — a porta de entrada da seção,
 * no molde de uma central de "diretrizes e políticas": uma linha por
 * documento com título, resumo e a rota em mono, como o índice da home.
 */
export function LegalIndex() {
	const { lang } = useLang()
	const t = useCopy(COPY)

	return (
		<div className="light light-home bg-background text-foreground flex min-h-svh flex-col">
			<main className="mx-auto w-full max-w-5xl flex-1 px-7 py-16 md:py-24">
				<Link
					href="/"
					className="text-foreground/60 hover:text-foreground inline-flex items-center gap-2 font-mono text-xs tracking-wide uppercase transition-colors"
				>
					<ArrowLeft className="size-3.5" />
					Faradays
				</Link>

				<h1 className="font-heading text-h2 mt-8">{t.title}</h1>
				<p className="text-body-lg text-foreground/70 mt-8 max-w-3xl leading-relaxed">
					{t.intro}
				</p>
				<p className="text-foreground/50 mt-4 font-mono text-xs">
					{t.company}
				</p>

				<nav aria-label={t.ariaPolicies} className="mt-12">
					{LEGAL_PAGES.map((page, index) => (
						<Link
							key={page.slug}
							href={page.slug}
							className={
								index === 0
									? 'border-border group hover:bg-foreground/[0.03] grid gap-2 border-y px-2 py-5 transition-colors sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-6'
									: 'border-border group hover:bg-foreground/[0.03] grid gap-2 border-b px-2 py-5 transition-colors sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-6'
							}
						>
							<span className="text-brand font-mono text-sm">
								{page.slug}
							</span>
							<span>
								<span className="font-heading text-h5 block">
									{page.title[lang]}
								</span>
								<span className="text-foreground/60 mt-2 block text-sm leading-relaxed">
									{page.description[lang]}
								</span>
							</span>
							<ArrowRight
								aria-hidden
								className="text-foreground/40 group-hover:text-foreground hidden size-4 self-center transition-colors sm:block"
							/>
						</Link>
					))}
				</nav>

				<p className="text-foreground/60 text-body-sm mt-14">
					{t.questions}{' '}
					<CopyEmail className="link-underline hover:text-brand transition-colors" />
				</p>
			</main>

			<footer className="border-border border-t">
				<div className="text-foreground/50 mx-auto flex w-full max-w-5xl flex-col gap-4 px-7 py-8 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
					<span>© {new Date().getFullYear()} Faradays</span>
					<span className="text-foreground">
						{LEGAL_INDEX.label[lang]}
					</span>
				</div>
			</footer>
		</div>
	)
}
