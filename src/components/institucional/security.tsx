'use client'

import { Plus } from '@phosphor-icons/react'

import { Reveal } from '@/components/landing/reveal'
import { useCopy, useLang } from '@/components/language-provider'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion'

import { SECURITY_COPY, SECURITY_ITEMS } from './copy'
import { CtaLink } from './cta-link'
import { SectionShell } from './section-shell'

/**
 * Segurança da referência: título e CTA à esquerda, quatro cards cinza à
 * direita que abrem como acordeão. O "+" gira para "×" quando abre — os
 * carets do trigger do shadcn ficam escondidos.
 */
export function Security() {
	const t = useCopy(SECURITY_COPY)
	const { lang } = useLang()
	return (
		<SectionShell
			id="seguranca"
			innerClassName="grid gap-16 lg:grid-cols-12 lg:gap-8"
		>
			<Reveal className="lg:col-span-5">
				<h2 className="text-serif-lg max-w-[16ch] font-serif font-light">
					{t.title}
				</h2>
				<CtaLink
					href="/privacidade"
					variant="outline"
					className="mt-10"
				>
					{t.cta}
				</CtaLink>
			</Reveal>

			<Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
				<Accordion type="single" collapsible className="gap-4">
					{SECURITY_ITEMS.map((item) => (
						<AccordionItem
							key={item.id}
							value={item.id}
							className="bg-muted rounded-xl px-8 not-last:border-b-0"
						>
							<AccordionTrigger className="text-serif-sm items-center rounded-none py-8 font-serif font-light hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
								{item.title[lang]}
								<Plus
									aria-hidden
									className="ml-6 size-4 shrink-0 transition-transform duration-300 group-aria-expanded/accordion-trigger:rotate-45"
								/>
							</AccordionTrigger>
							<AccordionContent className="text-body-sm text-foreground/65 max-w-[52ch] pb-8">
								{item.body[lang]}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</Reveal>
		</SectionShell>
	)
}
