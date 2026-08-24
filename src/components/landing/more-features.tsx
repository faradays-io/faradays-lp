'use client'

import { MORE_FEATURES } from '@/components/landing/home-features-data'
import { Reveal } from '@/components/landing/reveal'
import { useCopy, useLang } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'

const COPY = {
	pt: {
		eyebrow: '(e mais)',
		heading: 'O resto da operação também mora aqui.'
	},
	en: {
		eyebrow: '(and more)',
		heading: 'The rest of the operation lives here too.'
	}
} satisfies Localized<Record<string, string>>

/**
 * Grade "e mais" (briefing 3.1): as frentes do produto que não viraram
 * feature de destaque, uma linha cada — responde ao comprador que procura um
 * item específico e sairia da página achando que o produto não tem.
 */
export function MoreFeatures() {
	const { lang } = useLang()
	const t = useCopy(COPY)
	return (
		<div className="px-7 py-32">
			<div className="max-w-section mx-auto">
				<Reveal>
					<span className="text-foreground/50 font-mono text-sm tracking-widest uppercase">
						{t.eyebrow}
					</span>
					<h3 className="font-heading text-h3 mt-4 max-w-2xl text-balance">
						{t.heading}
					</h3>
				</Reveal>

				<div className="border-border mt-12 grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-4">
					{MORE_FEATURES.map((item, i) => (
						<Reveal key={item.title.pt} delay={(i % 4) * 0.06}>
							<div className="border-border flex h-full flex-col gap-2.5 border-b px-1 py-7 sm:pr-8">
								<h4 className="text-body font-medium">
									{item.title[lang]}
								</h4>
								<p className="text-body-sm text-foreground/60">
									{item.description[lang]}
								</p>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</div>
	)
}
