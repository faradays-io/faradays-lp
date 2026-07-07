'use client'

import { ArrowRight } from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { MockImage, type MockImageTone } from '@/components/landing/mock-image'
import { Reveal } from '@/components/landing/reveal'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

export type ShowcaseStep = {
	title: string
	description: string
}

/**
 * Two-column scroll narrative: steps on the left drive a sticky media panel
 * on the right (crossfading one mock screenshot per step).
 */
export function SteppedShowcase({
	id,
	title,
	description,
	ctaLabel,
	steps,
	tone = 'slate'
}: {
	id?: string
	title: string
	description: string
	ctaLabel: string
	steps: ShowcaseStep[]
	tone?: MockImageTone
}) {
	const listRef = useRef<HTMLDivElement>(null)
	const [active, setActive] = useState(0)

	useEffect(() => {
		const list = listRef.current
		if (!list) return
		const ctx = gsap.context(() => {
			gsap.utils.toArray<HTMLElement>('[data-step]').forEach((el, i) => {
				ScrollTrigger.create({
					trigger: el,
					start: 'top center',
					end: 'bottom center',
					onEnter: () => setActive(i),
					onEnterBack: () => setActive(i)
				})
			})
		}, list)
		return () => ctx.revert()
	}, [steps.length])

	return (
		<section id={id} className="bg-background text-foreground">
			<div className="max-w-section mx-auto w-full px-5 py-24 min-[810px]:px-8">
				<Reveal className="max-w-2xl">
					<h2 className="font-heading text-h1">{title}</h2>
					<p className="text-body-lg text-muted-foreground mt-4">
						{description}
					</p>
					<Link
						href="#cta"
						className="hover:text-foreground/70 mt-5 inline-flex items-center gap-2 text-sm font-medium transition-colors"
					>
						{ctaLabel}
						<ArrowRight className="size-4" />
					</Link>
				</Reveal>

				<div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
					<div ref={listRef} className="flex flex-col">
						{steps.map((step, i) => (
							<div
								key={step.title}
								data-step
								className={cn(
									'border-t py-10 transition-opacity duration-500 lg:py-14',
									active === i
										? 'opacity-100'
										: 'lg:opacity-40'
								)}
							>
								<span className="text-muted-foreground font-mono text-xs">
									{String(i + 1).padStart(2, '0')}
								</span>
								<h3 className="font-heading text-h3 mt-2">
									{step.title}
								</h3>
								<p className="text-body text-muted-foreground mt-3 max-w-md">
									{step.description}
								</p>
								<MockImage
									label={step.title}
									tone={tone}
									className="mt-6 aspect-video lg:hidden"
								/>
							</div>
						))}
					</div>

					<div className="hidden lg:block">
						<div className="sticky top-24 h-[70vh]">
							<div className="relative h-full">
								{steps.map((step, i) => (
									<MockImage
										key={step.title}
										label={step.title}
										tone={tone}
										className={cn(
											'absolute inset-0 transition-opacity duration-700',
											active === i
												? 'opacity-100'
												: 'opacity-0'
										)}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
