'use client'

import { ArrowRight, Play } from '@phosphor-icons/react'
import gsap from 'gsap'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { LogoMarquee } from '@/components/landing/logo-marquee'
import { MockImage } from '@/components/landing/mock-image'
import { Button } from '@/components/ui/button'

/** Decorative mountain silhouettes — stand-in for the hero photograph. */
function Ridges() {
	return (
		<svg
			aria-hidden
			className="absolute inset-x-0 bottom-0 h-[38vh] w-full"
			viewBox="0 0 1440 400"
			preserveAspectRatio="none"
		>
			<path
				d="M0 400V260l180-90 140 60 160-110 200 90 170-70 190 100 160-60 240 120v100Z"
				fill="#1a1720"
				opacity="0.85"
			/>
			<path
				d="M0 400V320l220-70 180 50 200-90 240 80 210-50 190 70 200-40v130Z"
				fill="#121016"
			/>
		</svg>
	)
}

export function Hero() {
	const rootRef = useRef<HTMLElement>(null)

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const ctx = gsap.context(() => {
			gsap.fromTo(
				'[data-hero-item]',
				{ autoAlpha: 0, y: 40 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 1.2,
					ease: 'power3.out',
					stagger: 0.12,
					delay: 0.15
				}
			)
		}, root)
		return () => ctx.revert()
	}, [])

	return (
		<section
			ref={rootRef}
			className="relative mt-[-74px] flex min-h-screen flex-col overflow-hidden lg:min-h-[640px]"
		>
			<div className="hero-sky absolute inset-0" aria-hidden />
			<Ridges />
			<div
				className="to-background absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent"
				aria-hidden
			/>

			<div className="max-w-section relative mx-auto flex w-full flex-1 flex-col items-center justify-center px-5 pt-40 pb-16 text-center min-[810px]:px-8">
				<Link
					href="#agent-canvas"
					data-hero-item
					className="bg-background/30 hover:bg-background/50 mb-6 flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm backdrop-blur-md transition-colors"
				>
					Introducing Scout
					<ArrowRight className="size-3.5" />
				</Link>

				<h1
					data-hero-item
					className="font-heading max-w-4xl text-5xl leading-[0.95] tracking-tight text-balance min-[810px]:text-[5.5rem]"
				>
					Support that sounds human. At the scale of millions.
				</h1>

				<p
					data-hero-item
					className="text-body-lg text-foreground/70 mt-6"
				>
					Enterprise-grade AI agents for customer support
				</p>

				<div data-hero-item className="mt-8 flex items-center gap-3">
					<Button asChild size="lg">
						<Link href="#cta">Talk to us</Link>
					</Button>
					<Button asChild size="lg" variant="outline">
						<Link href="#spotlight">See a demo</Link>
					</Button>
				</div>

				<div
					data-hero-item
					className="bg-background/30 mt-16 flex w-full max-w-md items-center gap-4 rounded-2xl border p-3 text-left backdrop-blur-md min-[810px]:absolute min-[810px]:right-8 min-[810px]:bottom-40 min-[810px]:mt-0"
				>
					<MockImage
						label="Scout preview"
						tone="ember"
						className="aspect-video w-32 shrink-0 rounded-xl"
					/>
					<div className="flex flex-col gap-1">
						<p className="text-foreground/90 text-sm">
							Meet Scout — it moves your KPIs on autopilot.
						</p>
						<button className="text-foreground/60 hover:text-foreground flex items-center gap-1.5 text-sm transition-colors">
							<Play className="size-3.5" weight="fill" />
							Watch (2:37)
						</button>
					</div>
				</div>
			</div>

			<div data-hero-item className="relative pb-10">
				<LogoMarquee />
			</div>
		</section>
	)
}
