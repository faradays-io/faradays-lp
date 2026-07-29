import type { Metadata } from 'next'
import Link from 'next/link'

import { FaradaysLockup } from '@/components/landing/faradays-lockup'
import { LEGAL_PAGES } from '@/components/landing/legal-data'
import { PageTransition } from '@/components/landing/page-transition'
import { Reveal } from '@/components/landing/reveal'
import { SOLUTIONS } from '@/components/landing/solutions-data'
import { BOOKING_URL } from '@/lib/links'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
	title: 'Faradays',
	description:
		'Inteligência artificial aplicada à operação. Cada frente da operação em um produto próprio.'
}

/**
 * Home institucional em uma tela só (referência de postura:
 * berkshirehathaway.com) — sem hero, sem seções, sem scroll: marca, uma
 * frase do que a empresa faz, o índice de rotas para as subpáginas e o
 * rodapé legal. Tudo o que é produto vive nas subpáginas; esta página só
 * direciona. A estilização é a mesma do resto do site (Aspekta/Fixel, rota
 * em mono como dispositivo estrutural, fundo `.light-home`).
 */
export default function HomePage() {
	return (
		<div className="light light-home bg-background text-foreground flex min-h-svh flex-col">
			<PageTransition />

			<main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-7 py-16">
				<Reveal y={20}>
					<FaradaysLockup className="text-foreground mx-auto block h-8 w-auto md:h-10" />
					<p className="text-body-lg text-foreground/70 mx-auto mt-8 max-w-xl text-center text-balance">
						Inteligência artificial aplicada à operação: motores de
						decisão, portais e agentes que trabalham com os dados
						que a sua empresa já tem.
					</p>
				</Reveal>

				<Reveal y={20} delay={0.1}>
					<nav
						aria-label="Soluções"
						className="border-border mt-14 border-t md:mt-20"
					>
						{SOLUTIONS.map((solution) => {
							const inner = (
								<>
									<span
										className={cn(
											'font-mono text-sm',
											solution.available
												? 'text-brand'
												: 'text-foreground/35'
										)}
									>
										{solution.slug}
									</span>
									<span
										className={cn(
											'font-heading text-h5',
											!solution.available &&
												'text-foreground/50'
										)}
									>
										{solution.name}
									</span>
									{!solution.available && (
										<span className="text-foreground/40 font-mono text-xs sm:justify-self-end">
											(em breve)
										</span>
									)}
								</>
							)
							const row =
								'border-border grid gap-1 border-b px-2 py-5 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline sm:gap-6'
							return solution.available ? (
								<Link
									key={solution.slug}
									href={solution.slug}
									className={cn(
										row,
										'hover:bg-foreground/[0.03] transition-colors'
									)}
								>
									{inner}
								</Link>
							) : (
								<div key={solution.slug} className={row}>
									{inner}
								</div>
							)
						})}
					</nav>
				</Reveal>

				<Reveal y={20} delay={0.2}>
					<div className="text-body-sm mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
						<a
							href={BOOKING_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="link-underline hover:text-brand transition-colors"
						>
							Agende uma conversa
						</a>
						<a
							href="mailto:contato@faradays.io"
							className="link-underline text-foreground/70 hover:text-foreground transition-colors"
						>
							contato@faradays.io
						</a>
					</div>
				</Reveal>
			</main>

			<footer className="border-border border-t">
				<div className="text-foreground/50 mx-auto flex w-full max-w-5xl flex-col gap-4 px-7 py-8 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
					<span>
						© {new Date().getFullYear()} Faradays. Todos os direitos
						reservados.
					</span>
					<nav
						aria-label="Políticas"
						className="flex flex-wrap gap-4"
					>
						{LEGAL_PAGES.map((page) => (
							<Link
								key={page.slug}
								href={page.slug}
								className="link-underline hover:text-foreground transition-colors"
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
