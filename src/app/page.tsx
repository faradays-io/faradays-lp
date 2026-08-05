import type { Metadata } from 'next'
import Link from 'next/link'

import { FaradaysComposed } from '@/components/landing/faradays-composed'
import { HomeLoader } from '@/components/landing/home-loader'
import { LEGAL_PAGES } from '@/components/landing/legal-data'
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
const NAV_ROW =
	'border-border grid gap-1 border-b px-2 py-4 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline sm:gap-6'

export default function HomePage() {
	return (
		<div className="light light-home bg-background text-foreground flex min-h-svh flex-col md:h-svh md:overflow-hidden">
			<HomeLoader />

			<main className="mx-auto flex w-full max-w-5xl min-h-0 flex-1 flex-col justify-center px-7 py-8">
				{/* Fora do Reveal: a logo do HomeLoader pousa aqui no fim do
				   morph — o loader controla a visibilidade deste bloco. */}
				<div data-home-lockup className="flex justify-center">
					<FaradaysComposed className="text-foreground h-8 md:h-10" />
				</div>
				<Reveal y={20}>
					<p className="text-body-lg text-foreground/70 mx-auto mt-8 max-w-xl text-center text-balance">
						Inteligência artificial aplicada à operação: motores de
						decisão, portais e agentes que trabalham com os dados
						que a sua empresa já tem.
					</p>
				</Reveal>

				{/* Cada linha entra em sequência: um Reveal por item com delay
				   incremental (o Blog fecha a fila). O border-t vive na
				   primeira linha (não no nav) para animar junto com ela. */}
				<nav aria-label="Soluções" className="mt-10 md:mt-12">
					{SOLUTIONS.map((solution, index) => {
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
						return (
							<Reveal
								key={solution.slug}
								y={16}
								delay={0.15 + index * 0.05}
							>
								{solution.available ? (
									<Link
										href={solution.slug}
										className={cn(
											NAV_ROW,
											index === 0 && 'border-t',
											'hover:bg-foreground/[0.03] transition-colors'
										)}
									>
										{inner}
									</Link>
								) : (
									<div
										className={cn(
											NAV_ROW,
											index === 0 && 'border-t'
										)}
									>
										{inner}
									</div>
								)}
							</Reveal>
						)
					})}
					<Reveal y={16} delay={0.15 + SOLUTIONS.length * 0.05}>
						<Link
							href="/blog"
							className={cn(
								NAV_ROW,
								'hover:bg-foreground/[0.03] transition-colors'
							)}
						>
							<span className="text-brand font-mono text-sm">
								/blog
							</span>
							<span className="font-heading text-h5">Blog</span>
						</Link>
					</Reveal>
				</nav>

				<Reveal y={20} delay={0.2 + (SOLUTIONS.length + 1) * 0.05}>
					<div className="text-body-sm mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
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
				<div className="text-foreground/50 mx-auto flex w-full max-w-5xl flex-col gap-4 px-7 py-5 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
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
