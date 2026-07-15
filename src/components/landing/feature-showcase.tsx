'use client'

import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useCallback, useEffect, useRef, useState } from 'react'

import { MockImage, type MockImageTone } from '@/components/landing/mock-image'

gsap.registerPlugin(SplitText)

const HOLD_MS = 5000

const FEATURES: Array<{
	eyebrow: string
	title: string
	description: string
	tone: MockImageTone
}> = [
	{
		eyebrow: 'Custom agents',
		title: 'Made for complex operations',
		description:
			'Deeply configurable agents tuned to the way your business actually runs. Bootstrap working policies from a single conversation log, with an AI copilot assisting at every step.',
		tone: 'slate'
	},
	{
		eyebrow: 'Smart suggestions',
		title: 'Gets better every week',
		description:
			'KPI-driven recommendations grounded in how your operation really works — not generic playbooks. Ready-to-apply policy updates land with one click, no rebuild required.',
		tone: 'moss'
	},
	{
		eyebrow: 'Natural voice',
		title: 'Conversation with empathy',
		description:
			'A voice matched to your brand that keeps up with fast, messy, real-world conversations — graceful interruptions included, at sub-second latency.',
		tone: 'violet'
	}
]

export function FeatureShowcase() {
	const [index, setIndex] = useState(0)
	const textRef = useRef<HTMLDivElement>(null)
	const imageRef = useRef<HTMLDivElement>(null)
	const barRef = useRef<HTMLDivElement>(null)
	const transitioningRef = useRef(false)

	// Every transition (manual or auto) first snaps the bar to 100% quickly,
	// then swaps the feature.
	const go = useCallback((direction: number) => {
		if (transitioningRef.current) return
		const advance = () =>
			setIndex((i) => (i + direction + FEATURES.length) % FEATURES.length)

		const bar = barRef.current
		if (!bar) {
			advance()
			return
		}
		transitioningRef.current = true
		gsap.to(bar, {
			width: '100%',
			duration: 0.25,
			ease: 'power1.in',
			onComplete: () => {
				transitioningRef.current = false
				advance()
			}
		})
	}, [])

	// Progress bar drives the auto-advance: fills over HOLD_MS, then moves on.
	useEffect(() => {
		const bar = barRef.current
		if (!bar) return
		const tween = gsap.fromTo(
			bar,
			{ width: '0%' },
			{
				width: '100%',
				duration: HOLD_MS / 1000,
				ease: 'none',
				onComplete: () => go(1)
			}
		)
		return () => {
			tween.kill()
		}
	}, [index, go])

	// Line-by-line masked entrance of the active feature's text + a soft
	// cross-fade on the image.
	useEffect(() => {
		const text = textRef.current
		if (!text) return

		const split = new SplitText(text, { type: 'lines', mask: 'lines' })
		const lines = gsap.from(split.lines, {
			yPercent: 110,
			duration: 0.8,
			ease: 'power3.out',
			stagger: 0.09
		})

		const image = imageRef.current
		const imageTween = image
			? gsap.fromTo(
					image,
					{ autoAlpha: 0, scale: 1.03 },
					{
						autoAlpha: 1,
						scale: 1,
						duration: 0.7,
						ease: 'power2.out'
					}
				)
			: null

		return () => {
			lines.kill()
			imageTween?.kill()
			split.revert()
		}
	}, [index])

	const feature = FEATURES[index]
	const counter = `${String(index + 1).padStart(2, '0')}/${String(FEATURES.length).padStart(2, '0')}`

	return (
		<section id="features" className="bg-background text-foreground">
			<div className="flex w-full flex-col items-start gap-10 px-7 pb-40 lg:flex-row lg:gap-14">
				<div className="flex w-full flex-col lg:max-w-xl lg:shrink-0">
					<div className="bg-foreground/15 relative h-px w-full max-w-xl">
						<div
							ref={barRef}
							aria-hidden
							className="bg-foreground absolute top-0 left-0 h-px"
							style={{ width: '0%' }}
						/>
					</div>

					<div className="mt-5 flex max-w-xl items-center justify-between">
						<div className="flex items-center gap-5">
							<button
								aria-label="Previous feature"
								onClick={() => go(-1)}
								className="text-foreground/60 hover:text-foreground transition-colors"
							>
								<ArrowLeft className="size-5" />
							</button>
							<button
								aria-label="Next feature"
								onClick={() => go(1)}
								className="text-foreground/60 hover:text-foreground transition-colors"
							>
								<ArrowRight className="size-5" />
							</button>
						</div>
						<span className="text-muted-foreground font-mono text-sm">
							{counter}
						</span>
					</div>

					<div ref={textRef} className="mt-12 flex flex-col gap-6">
						<span className="text-muted-foreground font-mono text-sm tracking-wide uppercase">
							({feature.eyebrow})
						</span>
						<h2 className="font-heading text-h2 max-w-xl">
							{feature.title}
						</h2>
						<p className="text-body-lg text-foreground/70 max-w-xl">
							{feature.description}
						</p>
					</div>
				</div>

				<div ref={imageRef} className="w-full flex-1 px-10 lg:px-32">
					<MockImage
						label={feature.title}
						tone={feature.tone}
						className="min-h-96 w-full rounded-3xl min-[810px]:min-h-[85svh]"
					/>
				</div>
			</div>
		</section>
	)
}
