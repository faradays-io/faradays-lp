'use client'

import { Reveal } from '@/components/landing/reveal'
import { useCopy } from '@/components/language-provider'
import { BOOKING_URL } from '@/lib/links'

import { CLOSING_COPY, SHELL_COPY } from './copy'
import { CtaLink } from './cta-link'
import { MediaSlot } from './media-slot'

/**
 * Fecho da referência ("Just press Enter"): foto de ponta a ponta, a frase-
 * assinatura em serif branca e o CTA na mesma linha. `id="cta"` é o alvo
 * dos links de demo do resto do site.
 */
export function ClosingBillboard() {
	const t = useCopy(CLOSING_COPY)
	const shell = useCopy(SHELL_COPY)
	return (
		<section id="cta" className="px-2 pb-2">
			<div className="max-w-page relative mx-auto h-[min(40rem,75svh)] min-h-[28rem] overflow-hidden rounded-xl text-white">
				<MediaSlot
					label={t.photo}
					tone="dark"
					className="absolute inset-0 items-start justify-end [&>div:last-child]:p-10"
				/>
				<div
					aria-hidden
					className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
				/>
				<Reveal className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-8 p-8 md:p-16">
					<h2 className="text-serif-xl font-serif font-light">
						{t.title}
					</h2>
					<CtaLink href={BOOKING_URL}>{shell.talk}</CtaLink>
				</Reveal>
			</div>
		</section>
	)
}
