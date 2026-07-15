'use client'

import { ArrowRight, Play } from '@phosphor-icons/react'
import Link from 'next/link'

import { Reveal } from '@/components/landing/reveal'

export function VoiceSection() {
	return (
		<section id="voice" className="bg-background text-foreground">
			<div className="max-w-section mx-auto w-full px-4 py-40 min-[810px]:px-6">
				<Reveal className="max-w-2xl">
					<h2 className="font-heading text-h1">Voice Experience</h2>
					<p className="text-body-lg text-muted-foreground mt-4">
						Agents that read tone, intent, and context — keeping up
						with accents, interruptions, and quick conversational
						turns without ever losing the thread.
					</p>
					<Link
						href="#cta"
						className="hover:text-foreground/70 mt-5 inline-flex items-center gap-2 text-sm font-medium transition-colors"
					>
						Explore Voice Experience
						<ArrowRight className="size-4" />
					</Link>
				</Reveal>

				<Reveal className="mt-14">
					<div className="relative aspect-video overflow-hidden rounded-3xl border">
						<div className="hero-sky animate-slow-pan absolute inset-0" />
						<div className="absolute inset-0 flex items-center justify-center">
							<button
								className="bg-background/40 flex size-20 items-center justify-center rounded-full border backdrop-blur-md transition-transform duration-500 hover:scale-110"
								aria-label="Play voice demo"
							>
								<Play className="size-7" weight="fill" />
							</button>
						</div>
						<span className="text-foreground/70 absolute bottom-5 left-6 font-mono text-xs tracking-wide uppercase">
							Voice demo — placeholder video
						</span>
					</div>
				</Reveal>
			</div>
		</section>
	)
}
