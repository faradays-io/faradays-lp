'use client'

import { ArrowLeft, ArrowUpRight, Compass } from '@phosphor-icons/react'
import { gsap } from 'gsap'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ *
 * 404 — "SIGNAL LOST". Renders inside the root layout, so the active
 * font pair + Lenis are already mounted. Pure theme tokens → it tracks
 * light/dark automatically. GSAP drives a staggered reveal, a slow
 * pointer parallax on the depth layers, and an occasional glyph flicker.
 * All motion is gated behind prefers-reduced-motion.
 * ------------------------------------------------------------------ */

export default function NotFound() {
	const pathname = usePathname()
	const router = useRouter()
	const root = useRef<HTMLElement>(null)

	useEffect(() => {
		const el = root.current
		if (!el) return

		const ctx = gsap.context(() => {
			const mm = gsap.matchMedia()

			// Full experience — only when the user hasn't asked for less motion.
			mm.add('(prefers-reduced-motion: no-preference)', () => {
				gsap.set('[data-reveal]', { opacity: 0, y: 24 })
				gsap.set('[data-glyph]', { opacity: 0, scale: 0.92 })

				const tl = gsap.timeline({
					defaults: { ease: 'expo.out', duration: 1.1 }
				})
				tl.to('[data-glyph]', {
					opacity: 1,
					scale: 1,
					stagger: 0.06,
					duration: 1.4
				}).to(
					'[data-reveal]',
					{ opacity: 1, y: 0, stagger: 0.08 },
					'-=1'
				)

				// Slow ambient drift on the wireframe.
				gsap.to('[data-globe]', {
					rotation: 360,
					duration: 90,
					repeat: -1,
					ease: 'none',
					transformOrigin: '50% 50%'
				})

				// Rare flicker on the big numerals — feels like a dying signal.
				const flicker = () => {
					gsap.to('[data-glyph]', {
						opacity: 0.55,
						duration: 0.05,
						yoyo: true,
						repeat: 3,
						ease: 'rough({ strength: 2, points: 12 })',
						onComplete: () =>
							gsap.set('[data-glyph]', { opacity: 1 })
					})
					gsap.delayedCall(gsap.utils.random(3, 7), flicker)
				}
				gsap.delayedCall(2.4, flicker)

				// Pointer parallax — each layer drifts by its data-depth factor.
				const layers = gsap.utils.toArray<HTMLElement>('[data-depth]')
				const movers = layers.map((layer) => ({
					layer,
					depth: Number(layer.dataset.depth) || 0,
					x: gsap.quickTo(layer, 'x', {
						duration: 0.9,
						ease: 'power3'
					}),
					y: gsap.quickTo(layer, 'y', {
						duration: 0.9,
						ease: 'power3'
					})
				}))
				const onMove = (e: PointerEvent) => {
					const rx = e.clientX / window.innerWidth - 0.5
					const ry = e.clientY / window.innerHeight - 0.5
					movers.forEach(({ depth, x, y }) => {
						x(-rx * depth * 60)
						y(-ry * depth * 60)
					})
				}
				window.addEventListener('pointermove', onMove)
				return () => window.removeEventListener('pointermove', onMove)
			})

			// Reduced motion — show everything, no animation.
			mm.add('(prefers-reduced-motion: reduce)', () => {
				gsap.set('[data-reveal], [data-glyph]', {
					opacity: 1,
					y: 0,
					scale: 1
				})
			})
		}, el)

		return () => ctx.revert()
	}, [])

	return (
		<main
			ref={root}
			className="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
		>
			{/* Layer: blueprint grid, masked to a soft radial so edges fade out. */}
			<div
				data-depth="0.4"
				className="pointer-events-none absolute inset-[-10%] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_45%,black,transparent)] [background-size:64px_64px] opacity-[0.5]"
				aria-hidden
			/>

			{/* Layer: slowly rotating wireframe globe — echoes the brand icon. */}
			<div
				data-depth="0.8"
				className="pointer-events-none absolute inset-0 flex items-center justify-center"
				aria-hidden
			>
				<svg
					data-globe
					viewBox="0 0 256 256"
					className="text-foreground/[0.05] h-[120vmin] w-[120vmin]"
					fill="none"
					stroke="currentColor"
					strokeWidth={1}
				>
					<circle cx="128" cy="128" r="104" />
					<ellipse cx="128" cy="128" rx="48" ry="104" />
					<ellipse cx="128" cy="128" rx="96" ry="104" />
					<line x1="24" y1="128" x2="232" y2="128" />
					<ellipse cx="128" cy="128" rx="104" ry="40" />
					<ellipse cx="128" cy="128" rx="104" ry="80" />
				</svg>
			</div>

			{/* Layer: film grain. */}
			<div
				className="[background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')] pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-difference"
				aria-hidden
			/>

			{/* Corner registration marks. */}
			{(
				[
					'left-6 top-6 border-l border-t',
					'right-6 top-6 border-r border-t',
					'bottom-6 left-6 border-b border-l',
					'bottom-6 right-6 border-b border-r'
				] as const
			).map((pos) => (
				<span
					key={pos}
					data-reveal
					className={cn(
						'border-foreground/25 pointer-events-none absolute size-6',
						pos
					)}
					aria-hidden
				/>
			))}

			{/* Top status bar. */}
			<div
				data-reveal
				className="text-muted-foreground absolute top-6 left-1/2 flex -translate-x-1/2 items-center gap-3 font-mono text-xs tracking-widest uppercase"
			>
				<span className="bg-foreground inline-block size-1.5 animate-pulse rounded-full" />
				Signal lost
			</div>

			{/* Content stack. */}
			<div
				data-depth="1.2"
				className="relative z-10 flex flex-col items-center text-center"
			>
				{/* Giant numerals — ghost copy sits behind for a displaced echo. */}
				<div className="relative">
					<h1
						className="text-foreground/[0.06] font-heading pointer-events-none absolute inset-0 translate-x-2 translate-y-2 [font-size:clamp(8rem,28vw,20rem)] leading-[0.8] font-semibold tracking-[-0.04em] select-none"
						aria-hidden
					>
						404
					</h1>
					<h1 className="font-heading flex [font-size:clamp(8rem,28vw,20rem)] leading-[0.8] font-semibold tracking-[-0.04em]">
						<span data-glyph>4</span>
						<span data-glyph>0</span>
						<span data-glyph>4</span>
					</h1>
				</div>

				<p
					data-reveal
					className="text-h5 text-foreground sm:text-h4 mt-2 max-w-md text-balance"
				>
					You wandered off the grid.
				</p>
				<p
					data-reveal
					className="text-body-sm text-muted-foreground mt-3 max-w-sm text-balance"
				>
					The coordinates you requested don&apos;t resolve to any
					route in this build.
				</p>

				{/* Diagnostic readout. */}
				<div
					data-reveal
					className="bg-card/40 text-muted-foreground mt-8 w-full max-w-md rounded-lg border p-4 text-left font-mono text-xs backdrop-blur-sm"
				>
					<div className="flex items-center justify-between border-b pb-2">
						<span className="tracking-widest uppercase">
							diagnostic
						</span>
						<span className="text-foreground">ERR_NO_ROUTE</span>
					</div>
					<dl className="mt-3 space-y-1.5">
						<div className="flex justify-between gap-4">
							<dt className="shrink-0">status</dt>
							<dd className="text-foreground">404 · not_found</dd>
						</div>
						<div className="flex justify-between gap-4">
							<dt className="shrink-0">path</dt>
							<dd className="text-foreground truncate">
								{pathname || '/'}
							</dd>
						</div>
						<div className="flex justify-between gap-4">
							<dt className="shrink-0">match</dt>
							<dd>
								none{' '}
								<span className="bg-foreground ml-0.5 inline-block h-3 w-1.5 animate-pulse align-middle" />
							</dd>
						</div>
					</dl>
				</div>

				{/* Actions. */}
				<div
					data-reveal
					className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
				>
					<Button asChild size="lg" className="group/home">
						<Link href="/">
							<Compass
								weight="bold"
								className="transition-transform duration-300 group-hover/home:rotate-45"
							/>
							Return to base
						</Link>
					</Button>
					<Button
						variant="outline"
						size="lg"
						onClick={() => router.back()}
						className="group/back"
					>
						<ArrowLeft
							weight="bold"
							className="transition-transform duration-300 group-hover/back:-translate-x-0.5"
						/>
						Go back
					</Button>
				</div>

				<Link
					data-reveal
					href="/fonts"
					className="text-muted-foreground hover:text-foreground group/link mt-6 inline-flex items-center gap-1 font-mono text-xs tracking-widest uppercase transition-colors"
				>
					Or explore the specimen sheet
					<ArrowUpRight
						weight="bold"
						className="size-3 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
					/>
				</Link>
			</div>
		</main>
	)
}
