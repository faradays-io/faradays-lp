'use client'

import { useEffect, useState } from 'react'

import {
	HOME_FEATURES,
	MORE_FEATURES
} from '@/components/landing/home-features-data'
import { Reveal } from '@/components/landing/reveal'
import { useCopy, useLang } from '@/components/language-provider'
import { cn } from '@/lib/utils'

import { HOW_COPY } from './copy'
import { MediaSlot } from './media-slot'

/* Os quatro passos de destaque e o quadro do gestor — a mesma seleção do
   `FeatureIndex` de /distribuicao. */
const portal = MORE_FEATURES.find((f) => f.id === 'portal')!
const STEPS = [
	...HOME_FEATURES.map((f) => ({
		id: f.id,
		label: f.eyebrow,
		title: f.title,
		description: f.description
	})),
	{
		id: portal.id,
		label: portal.title,
		title: portal.title,
		description: portal.description
	}
]

const HOLD_MS = 6000

/**
 * "Como funciona" da referência: lista de passos à esquerda (o ativo em
 * preto, os outros apagados), a animação no centro sobre um card cinza e
 * o texto do passo à direita. Avança sozinho a cada 6 s; clicar num passo
 * escolhe e reinicia o relógio.
 */
export function HowItWorks() {
	const t = useCopy(HOW_COPY)
	const { lang } = useLang()
	const [active, setActive] = useState(0)

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
			return
		const id = window.setTimeout(
			() => setActive((i) => (i + 1) % STEPS.length),
			HOLD_MS
		)
		return () => window.clearTimeout(id)
	}, [active])

	const step = STEPS[active]

	return (
		<section id="como-funciona" className="py-31">
			<div className="max-w-page mx-auto w-full px-[var(--gutter)]">
				<Reveal>
					<h2 className="text-serif-lg mx-auto max-w-[22ch] text-center font-serif font-light">
						{t.title}
					</h2>
				</Reveal>
				<Reveal
					delay={0.1}
					className="mt-20 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8"
				>
					<ol className="flex flex-col gap-1 lg:col-span-3">
						{STEPS.map((s, i) => (
							<li key={s.id}>
								<button
									type="button"
									onClick={() => setActive(i)}
									aria-current={
										i === active ? 'step' : undefined
									}
									className={cn(
										'flex w-full items-start gap-3 py-3 text-left transition-colors',
										i === active
											? 'text-foreground'
											: 'text-foreground/45 hover:text-foreground/80'
									)}
								>
									<span
										aria-hidden
										className="mt-2 size-1.5 shrink-0 bg-current"
									/>
									<span className="text-base">
										{s.label[lang]}
									</span>
								</button>
							</li>
						))}
					</ol>

					<div className="bg-muted aspect-[4/3] overflow-hidden rounded-2xl lg:col-span-6">
						<MediaSlot
							key={step.id}
							label={`${t.visual}: ${step.label[lang]}`}
							kind="animation"
							className="animate-in fade-in bg-transparent duration-700"
						/>
					</div>

					<div
						key={step.id}
						className="animate-in fade-in slide-in-from-bottom-2 duration-500 lg:col-span-3 lg:pl-4"
					>
						<h3 className="text-serif-sm font-serif font-light text-balance">
							{step.title[lang]}
						</h3>
						<p className="text-body-sm text-foreground/65 mt-4">
							{step.description[lang]}
						</p>
					</div>
				</Reveal>
			</div>
		</section>
	)
}
