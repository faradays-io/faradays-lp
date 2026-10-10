'use client'

import { Reveal } from '@/components/landing/reveal'
import { useCopy, useLang } from '@/components/language-provider'

import { CASE_COPY, CASE_STATS } from './copy'
import { CtaLink } from './cta-link'
import { MediaSlot } from './media-slot'

/**
 * Billboard de case: foto de ponta a ponta (só 0.5rem de margem, cantos
 * arredondados), véu escuro à direita e, por cima dele, a headline, duas
 * linhas de número separadas por fio e o CTA translúcido.
 */
export function CaseBillboard() {
	const t = useCopy(CASE_COPY)
	const { lang } = useLang()
	return (
		<section id="case" className="px-2">
			<div className="max-w-page relative mx-auto min-h-[40rem] overflow-hidden rounded-xl text-white lg:h-[min(48rem,85svh)]">
				<MediaSlot
					label={t.photo}
					tone="dark"
					className="absolute inset-0 items-start justify-start [&>div:last-child]:p-10"
				/>
				<div
					aria-hidden
					className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent"
				/>
				<div className="relative ml-auto flex h-full min-h-[40rem] w-full flex-col justify-center p-8 md:p-12 lg:w-[46%] lg:pr-[6%]">
					<Reveal>
						<h2 className="text-serif-md max-w-[22ch] font-serif font-light">
							{t.title}
						</h2>
						<dl className="mt-12">
							{CASE_STATS.map((stat) => (
								<div
									key={stat.label.pt}
									className="flex items-baseline justify-between gap-6 border-t border-white/20 py-5"
								>
									<dt className="text-sm text-white/70">
										{stat.label[lang]}
									</dt>
									<dd className="font-serif text-3xl font-light">
										{stat.value}
									</dd>
								</div>
							))}
						</dl>
						<CtaLink href="#case" variant="glass" className="mt-8">
							{t.cta}
						</CtaLink>
					</Reveal>
				</div>
			</div>
		</section>
	)
}
