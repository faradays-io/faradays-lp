import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { Reveal } from '@/components/landing/reveal'
import { SOLUTIONS } from '@/components/landing/solutions-data'
import { SECTION_TITLE } from '@/components/landing/type'
import { cn } from '@/lib/utils'

/**
 * Índice de soluções da nova home: cada frente da operação vive numa
 * subpágina própria, então o dispositivo estrutural das linhas é a rota em
 * mono (/credito, /portais…) — o índice diz literalmente para onde cada
 * linha leva. Disponível navega; "em breve" fica apagado e não clica.
 */
export function SolutionsIndex() {
	return (
		<section id="solucoes" className="px-7 py-24 md:py-36">
			<div className="max-w-section mx-auto">
				<Reveal>
					<span className="text-foreground/50 font-mono text-sm tracking-widest uppercase">
						(soluções)
					</span>
					<h2 className={cn(SECTION_TITLE, 'mt-4 max-w-3xl')}>
						Cada frente da operação, um produto próprio
					</h2>
					<p className="text-body-lg text-foreground/70 mt-6 max-w-xl text-balance">
						Cada solução tem página própria, com o produto em
						detalhe — escolha por onde começar.
					</p>
				</Reveal>

				<div className="border-border mt-16 border-t md:mt-24">
					{SOLUTIONS.map((solution, i) => {
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
								<div>
									<h3
										className={cn(
											'font-heading text-h4',
											!solution.available &&
												'text-foreground/50'
										)}
									>
										{solution.name}
									</h3>
									<p
										className={cn(
											'text-body-sm mt-1.5 max-w-xl',
											solution.available
												? 'text-foreground/60'
												: 'text-foreground/40'
										)}
									>
										{solution.description}
									</p>
								</div>
								{solution.available ? (
									<span className="flex items-center gap-2 text-sm md:justify-self-end">
										Conhecer
										<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
									</span>
								) : (
									<span className="text-foreground/40 font-mono text-xs md:justify-self-end">
										(em breve)
									</span>
								)}
							</>
						)
						const rowClass =
							'border-border grid gap-3 border-b px-2 py-8 md:grid-cols-[9rem_1fr_auto] md:items-center md:gap-8 md:py-10'
						return (
							<Reveal key={solution.slug} delay={i * 0.08}>
								{solution.available ? (
									<Link
										href={solution.slug}
										className={cn(
											rowClass,
											'group hover:bg-foreground/[0.03] transition-colors'
										)}
									>
										{inner}
									</Link>
								) : (
									<div className={rowClass}>{inner}</div>
								)}
							</Reveal>
						)
					})}
				</div>
			</div>
		</section>
	)
}
