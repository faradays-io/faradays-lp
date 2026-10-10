'use client'

import { Reveal } from '@/components/landing/reveal'
import { useCopy, useLang } from '@/components/language-provider'
import { cn } from '@/lib/utils'

import { TESTIMONIALS, TESTIMONIALS_COPY } from './copy'
import { CtaLink } from './cta-link'
import { MediaSlot } from './media-slot'

/**
 * Depoimentos da referência: título fixo à esquerda e os cards em duas
 * fileiras à direita (foto quadrada + aspas + nome e cargo), a de baixo
 * deslocada.
 *
 * Próximo passo (o pin): prender a seção e, com scrub, andar as fileiras
 * na horizontal em sentidos opostos (docs/referencia-getenter.md, §2.7).
 */
export function Testimonials() {
	const t = useCopy(TESTIMONIALS_COPY)
	const { lang } = useLang()
	const rows = [TESTIMONIALS.slice(0, 2), TESTIMONIALS.slice(2, 4)]

	return (
		<section id="relatos" className="overflow-hidden py-31">
			<div className="max-w-page mx-auto grid w-full gap-16 px-[var(--gutter)] lg:grid-cols-12 lg:gap-8">
				<Reveal className="lg:col-span-4">
					<div className="lg:sticky lg:top-40">
						<h2 className="text-serif-lg max-w-[14ch] font-serif font-light">
							{t.title}
						</h2>
						<CtaLink
							href="#case"
							variant="outline"
							className="mt-10"
						>
							{t.cta}
						</CtaLink>
					</div>
				</Reveal>

				<div className="flex flex-col gap-16 lg:col-span-8">
					{rows.map((row, r) => (
						<div
							key={r}
							className={cn(
								'grid gap-12 md:grid-cols-2',
								r === 1 && 'lg:pl-[14%]'
							)}
						>
							{row.map((item, i) => (
								<Reveal key={i} delay={i * 0.08}>
									<figure className="flex flex-col gap-6 sm:flex-row sm:items-start">
										<div className="aspect-square w-40 shrink-0 overflow-hidden rounded-lg">
											<MediaSlot
												label={t.photo}
												className="[&>div:last-child]:p-2"
											/>
										</div>
										<div>
											<blockquote className="text-lg/[1.4] text-pretty">
												“{item.quote[lang]}”
											</blockquote>
											<figcaption className="mt-6">
												<span className="block text-sm font-medium">
													{item.name}
												</span>
												<span className="text-foreground/55 mt-1 block text-xs">
													{item.role[lang]}
												</span>
											</figcaption>
										</div>
									</figure>
								</Reveal>
							))}
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
