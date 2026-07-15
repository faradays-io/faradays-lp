import Link from 'next/link'

import { Reveal } from '@/components/landing/reveal'
import { Button } from '@/components/ui/button'

export function CtaSection() {
	return (
		<section id="cta" className="bg-[#d1d1c4] text-neutral-950">
			<div className="max-w-section mx-auto w-full px-4 py-40 min-[810px]:px-6">
				<Reveal className="mx-auto max-w-2xl py-16 text-center">
					<span className="font-mono text-sm tracking-wide text-neutral-500 uppercase">
						Get a personalized demo
					</span>
					<h2 className="font-heading text-h1 mt-3 text-balance">
						Ready to see the agent in action?
					</h2>
					<p className="text-body-lg mt-5 text-neutral-600">
						From live delivery hiccups to compliance calls, Faradays
						agents run complex workflows at scale — holding
						resolution accuracy above 90% in production.
					</p>
					<Button asChild size="lg" className="mt-8">
						<Link href="#">Talk to us</Link>
					</Button>
				</Reveal>

				<Reveal>
					<div className="relative h-[40vh] overflow-hidden rounded-3xl border">
						<div className="hero-sky animate-slow-pan absolute inset-0" />
						<span className="absolute bottom-5 left-6 font-mono text-xs tracking-wide text-white/70 uppercase">
							Ambient loop — placeholder video
						</span>
					</div>
				</Reveal>
			</div>
		</section>
	)
}
