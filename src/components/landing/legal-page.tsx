import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { LEGAL_PAGES } from '@/components/landing/legal-data'
import { cn } from '@/lib/utils'

export type LegalSection = { heading: string; body: string[] }

/**
 * Casca das páginas legais: mesma tipografia e mesmo fundo da home, coluna
 * única de leitura, volta para a raiz e rodapé cruzando as demais políticas.
 * O conteúdo entra por `sections` — cada rota traz o seu.
 */
export function LegalPage({
	title,
	updatedAt,
	intro,
	sections
}: {
	title: string
	/** Data da última revisão, já formatada (ex.: "27 de julho de 2026"). */
	updatedAt: string
	intro: string
	sections: LegalSection[]
}) {
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

				<h1 className="font-heading text-h2 mt-8">{title}</h1>
				<p className="text-foreground/50 mt-3 font-mono text-xs">
					Atualizado em {updatedAt}
				</p>


				<p className="text-body-lg text-foreground/70 mt-8">{intro}</p>

				<div className="mt-12 flex flex-col gap-10">
					{sections.map((section) => (
						<section key={section.heading}>
							<h2 className="font-heading text-h5">
								{section.heading}
							</h2>
							{section.body.map((paragraph, i) => (
								<p
									key={i}
									className="text-foreground/70 mt-3 leading-relaxed"
								>
									{paragraph}
								</p>
							))}
						</section>
					))}
				</div>

				<p className="text-foreground/60 text-body-sm mt-14">
					Dúvidas sobre esta política?{' '}
					<a
						href="mailto:contato@faradays.io"
						className="link-underline hover:text-brand transition-colors"
					>
						contato@faradays.io
					</a>
				</p>
			</main>

			<footer className="border-border border-t">
				<div className="text-foreground/50 mx-auto flex w-full max-w-5xl flex-col gap-4 px-7 py-8 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
					<span>© {new Date().getFullYear()} Faradays</span>
					<nav
						aria-label="Políticas"
						className="flex flex-wrap gap-4"
					>
						{LEGAL_PAGES.map((page) => (
							<Link
								key={page.slug}
								href={page.slug}
								className={cn(
									'link-underline transition-colors',
									page.label === title
										? 'text-foreground'
										: 'hover:text-foreground'
								)}
							>
								{page.label}
							</Link>
						))}
					</nav>
				</div>
			</footer>
		</div>
	)
}
