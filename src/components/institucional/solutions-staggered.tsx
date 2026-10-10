'use client'

import { ArrowRight } from '@phosphor-icons/react'
import Link from 'next/link'

import { Reveal } from '@/components/landing/reveal'
import { SOLUTIONS } from '@/components/landing/solutions-data'
import { useCopy, useLang } from '@/components/language-provider'
import { cn } from '@/lib/utils'

import { SHELL_COPY, SOLUTIONS_COPY } from './copy'
import { MediaSlot } from './media-slot'

/**
 * "Duas frentes" da referência, com as quatro soluções: título preso à
 * esquerda e, à direita, blocos foto + texto em zigue-zague — o texto
 * troca de lado e cada bloco desce um pouco em relação ao anterior.
 */
export function SolutionsStaggered() {
	const t = useCopy(SOLUTIONS_COPY)
	const shell = useCopy(SHELL_COPY)
	const { lang } = useLang()

	return (
		<section id="solucoes" className="py-31">
			<div className="max-w-page mx-auto grid w-full gap-16 px-[var(--gutter)] lg:grid-cols-12 lg:gap-8">
				<Reveal className="lg:col-span-4">
					<h2 className="text-serif-lg max-w-[14ch] font-serif font-light lg:sticky lg:top-40">
						{t.title}
					</h2>
				</Reveal>

				<div className="flex flex-col gap-24 lg:col-span-8">
					{SOLUTIONS.map((solution, i) => {
						const flip = i % 2 === 1
						return (
							<Reveal key={solution.slug}>
								<article
									className={cn(
										'grid items-center gap-8 md:grid-cols-2 md:gap-12',
										flip && 'md:ml-[12%]'
									)}
								>
									<div
										className={cn(
											'aspect-[4/5] overflow-hidden rounded-xl',
											flip && 'md:order-2'
										)}
									>
										<MediaSlot label={t.photo} />
									</div>
									<div>
										<h3 className="text-serif-md font-serif font-light">
											{solution.name[lang]}
										</h3>
										<p className="text-body-sm text-foreground/65 mt-4 max-w-[40ch]">
											{solution.description[lang]}
										</p>
										{solution.available ? (
											<Link
												href={solution.slug}
												className="group mt-6 inline-flex items-center gap-2 text-sm font-medium"
											>
												{t.explore}
												<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
											</Link>
										) : (
											<span className="text-foreground/40 mt-6 inline-block font-mono text-xs">
												{shell.soon}
											</span>
										)}
									</div>
								</article>
							</Reveal>
						)
					})}
				</div>
			</div>
		</section>
	)
}
