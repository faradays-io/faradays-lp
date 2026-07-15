'use client'

import { ArrowRight, Play } from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { MockImage } from '@/components/landing/mock-image'
import { Button } from '@/components/ui/button'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
	const rootRef = useRef<HTMLElement>(null)

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const ctx = gsap.context(() => {
			// Intro: bg fades in while settling from a slight zoom.
			gsap.fromTo(
				'[data-hero-bg]',
				{ autoAlpha: 0, scale: 1.08 },
				{ autoAlpha: 1, scale: 1, duration: 1.8, ease: 'power2.out' }
			)

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

			// Parallax: bg lags behind the scroll while the hero leaves.
			gsap.to('[data-hero-bg]', {
				yPercent: 50,
				ease: 'none',
				scrollTrigger: {
					trigger: root,
					start: 'top top',
					end: 'bottom top',
					scrub: true
				}
			})

			// The video card exits as soon as scrolling starts and re-enters
			// when the user returns to the top. immediateRender:false keeps
			// this tween from stomping the intro stagger's final state.
			gsap.fromTo(
				'[data-hero-video]',
				{ autoAlpha: 1, y: 0 },
				{
					autoAlpha: 0,
					y: 24,
					duration: 0.45,
					ease: 'power2.in',
					immediateRender: false,
					scrollTrigger: {
						trigger: root,
						start: 'top+=60 top',
						toggleActions: 'play none none reverse'
					}
				}
			)
		}, root)
		return () => ctx.revert()
	}, [])

	return (
		<section
			ref={rootRef}
			className="relative -mt-23 flex min-h-svh flex-col overflow-hidden"
		>
			<div
				data-hero-bg
				className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-top opacity-0 brightness-90"
				aria-hidden
			/>
			<div
				className="to-background absolute inset-x-0 bottom-0 h-[55vh] bg-gradient-to-b from-transparent"
				aria-hidden
			/>

			<div className="relative flex w-full flex-1 flex-col items-center justify-center px-2 pt-40 pb-16 text-center min-[810px]:px-3">
				<Link
					href="#features"
					data-hero-item
					className="bg-background/30 hover:bg-background/50 mb-6 flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm opacity-0 backdrop-blur-md transition-colors"
				>
					Introducing Scout
					<ArrowRight className="size-3.5" />
				</Link>

				<h1
					data-hero-item
					className="max-w-4xl font-serif text-5xl leading-[0.95] tracking-tight text-balance text-white opacity-0 min-[810px]:text-[5.5rem]"
				>
					Support that sounds human. At the scale of millions.
				</h1>

				<p
					data-hero-item
					className="text-body-lg text-foreground/70 mt-6 opacity-0"
				>
					Enterprise-grade AI agents for customer support
				</p>

				<div
					data-hero-item
					className="mt-8 flex items-center gap-3 opacity-0"
				>
					<Button asChild size="lg">
						<Link href="#cta">Talk to us</Link>
					</Button>
				</div>

				<div
					data-hero-item
					data-hero-video
					className="bg-background/30 absolute right-7 bottom-7 flex w-full max-w-xs flex-col gap-4 rounded-2xl border p-3 text-left opacity-0 backdrop-blur-md"
				>
					<MockImage
						label="Scout preview"
						tone="ember"
						className="aspect-video w-full rounded-xl"
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
		</section>
	)
}
