import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { AnimatedCounter } from '@/components/landing/animated-counter'
import { MockImage } from '@/components/landing/mock-image'
import { Reveal } from '@/components/landing/reveal'

/** Light case-study section — fictional customer + placeholder assets. */
export function Spotlight() {
	return (
		<section id="spotlight" className="bg-white text-neutral-950">
			<div className="max-w-section mx-auto w-full px-5 py-24 min-[810px]:px-8">
				<Reveal>
					<span className="font-mono text-sm tracking-wide text-neutral-500 uppercase">
						Customer spotlight
					</span>
					<h2 className="font-heading text-h1 mt-3 max-w-2xl text-balance">
						How enterprise teams scale support with Giga
					</h2>
				</Reveal>

				<div className="mt-14 grid gap-10 lg:grid-cols-2">
					<Reveal>
						<div className="relative h-full min-h-96 overflow-hidden rounded-3xl">
							<MockImage
								label="Case study photo"
								tone="light"
								className="absolute inset-0 rounded-3xl"
							/>
							<div className="absolute bottom-6 left-6 rounded-2xl bg-white/80 px-5 py-4 backdrop-blur-md">
								<span className="block text-sm text-neutral-500">
									Fewer escalations
								</span>
								<AnimatedCounter
									value={43}
									suffix="%"
									className="font-heading text-5xl tracking-tight"
								/>
							</div>
						</div>
					</Reveal>

					<Reveal delay={0.15}>
						<div className="flex h-full flex-col justify-center gap-6 lg:pl-6">
							<span className="font-heading text-xl font-semibold tracking-widest uppercase">
								Northwind
							</span>
							<h3 className="font-heading text-h3 text-balance">
								How Northwind grew customer engagement without
								growing headcount
							</h3>
							<Link
								href="#cta"
								className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-neutral-600"
							>
								Learn more
								<ArrowRight className="size-4" />
							</Link>
							<blockquote className="text-body-lg border-l-2 border-neutral-300 pl-5 text-neutral-700">
								&ldquo;We operate across dozens of markets and
								languages. Giga turned our conversation data
								into fewer escalations, faster resolutions, and
								calmer queues — quarter after quarter.&rdquo;
							</blockquote>
							<div className="flex items-center gap-3">
								<div className="flex size-10 items-center justify-center rounded-full bg-neutral-200 font-mono text-xs">
									JR
								</div>
								<span className="text-sm text-neutral-600">
									Jordan Reyes, Co-Founder at Northwind
								</span>
							</div>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	)
}
