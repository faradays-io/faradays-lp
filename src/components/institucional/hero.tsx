'use client'

import { Play } from '@phosphor-icons/react'

import { HERO_COPY } from '@/components/landing/home-hero'
import { Reveal } from '@/components/landing/reveal'
import { useCopy, useLang } from '@/components/language-provider'
import { BOOKING_URL } from '@/lib/links'

import { HERO_MEDIA_COPY, SHELL_COPY, VIDEO_CARDS } from './copy'
import { CtaLink } from './cta-link'
import { MediaSlot } from './media-slot'

/**
 * Hero da referência, ainda parado: headline serif + CTA à esquerda, o
 * retrato em vídeo à direita com duas lâminas cinza escalonadas atrás, e
 * a fileira dos três cards de vídeo logo abaixo.
 *
 * Próximo passo (o pin): prender a dobra por ~3 alturas de tela e, com
 * scrub, empurrar o retrato para a direita enquanto os cards sobem por
 * baixo da headline (docs/referencia-getenter.md, §2.3).
 */
export function InstitutionalHero() {
	const hero = useCopy(HERO_COPY)
	const shell = useCopy(SHELL_COPY)
	const media = useCopy(HERO_MEDIA_COPY)
	const { lang } = useLang()

	return (
		<section id="hero" className="pt-10 pb-31">
			<div className="max-w-page mx-auto grid w-full gap-12 px-[var(--gutter)] lg:min-h-[calc(100svh-6.5rem-2.5rem)] lg:grid-cols-12 lg:items-center lg:gap-8">
				<Reveal className="lg:col-span-6 lg:pl-[4%]">
					<h1 className="text-serif-xl max-w-[18ch] font-serif font-light">
						{hero.headlineLead} {hero.headlineTail}
					</h1>
					<CtaLink href={BOOKING_URL} className="mt-12">
						{shell.talk}
					</CtaLink>
				</Reveal>

				<Reveal delay={0.15} className="lg:col-span-6">
					{/* Lâminas: duas cópias do quadro, mais baixas e deslocadas
					   para a esquerda — a "pilha" que a referência desmonta no
					   scroll. */}
					<div className="relative ml-auto aspect-[685/732] w-[calc(100%-3rem)] max-w-[44rem]">
						<div
							aria-hidden
							className="absolute inset-y-[8%] -left-12 w-full rounded-xl bg-[#f3f3f3]"
						/>
						<div
							aria-hidden
							className="absolute inset-y-[4%] -left-6 w-full rounded-xl bg-[#e6e6e6]"
						/>
						<div className="relative size-full overflow-hidden rounded-xl">
							<MediaSlot label={media.portrait} kind="video" />
						</div>
					</div>
				</Reveal>
			</div>

			<div className="max-w-page mx-auto mt-24 w-full px-[var(--gutter)]">
				<div className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
					{VIDEO_CARDS.map((card, i) => (
						<Reveal
							key={i}
							delay={i * 0.08}
							className="w-[min(85vw,35rem)] shrink-0 snap-start lg:w-auto"
						>
							<article className="relative aspect-[7/8] overflow-hidden rounded-xl text-white">
								<MediaSlot
									label={media.portrait}
									kind="video"
									tone="dark"
									className="absolute inset-0"
								/>
								<div
									aria-hidden
									className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
								/>
								<span className="absolute top-8 left-8 font-mono text-sm tracking-widest text-white/80 uppercase">
									Logo
								</span>
								<div className="absolute inset-x-0 bottom-0 flex items-end gap-6 p-8">
									<div className="flex-1">
										<p className="text-lg/[1.45] text-pretty">
											“{card.quote[lang]}”
										</p>
										<p className="mt-6 text-sm text-white/75">
											{card.name}, {card.role[lang]}
										</p>
									</div>
									<span
										aria-hidden
										className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/40"
									>
										<Play
											className="size-4"
											weight="fill"
										/>
									</span>
								</div>
							</article>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	)
}
