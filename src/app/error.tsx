'use client'

import { ArrowClockwise, House, Warning } from '@phosphor-icons/react'
import { gsap } from 'gsap'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { useCopy } from '@/components/language-provider'
import { Button } from '@/components/ui/button'
import type { Localized } from '@/lib/i18n'

/* digest/message e o rótulo RUNTIME_EXCEPTION ficam como estão — leitura
   de terminal, igual nos dois idiomas. */
const COPY = {
	pt: {
		systemFault: 'Falha no sistema',
		headline: 'Algo quebrou do nosso lado.',
		body: 'Um erro inesperado interrompeu este trecho. Você pode tentar de novo — se persistir, o diagnóstico abaixo é a trilha.',
		tryAgain: 'Tentar de novo',
		returnBase: 'Voltar à base'
	},
	en: {
		systemFault: 'System fault',
		headline: 'Something broke on our end.',
		body: 'An unexpected error interrupted this segment. You can retry — if it persists, the diagnostic below is the trail.',
		tryAgain: 'Try again',
		returnBase: 'Return to base'
	}
} satisfies Localized<Record<string, string>>

/* ------------------------------------------------------------------ *
 * error.tsx — segment error boundary. "SYSTEM FAULT", sibling to the
 * 404 "SIGNAL LOST" screen: monochrome, theme tokens, GSAP reveal +
 * glyph flicker, all gated behind prefers-reduced-motion.
 *
 * Must be a Client Component (React error boundary). `reset()` clears the
 * boundary and re-renders the segment's children — the recovery path.
 * ------------------------------------------------------------------ */

export default function Error({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	const t = useCopy(COPY)
	const root = useRef<HTMLElement>(null)

	// Report to your error service here (Sentry, etc.).
	useEffect(() => {
		console.error(error)
	}, [error])

	useEffect(() => {
		const el = root.current
		if (!el) return

		const ctx = gsap.context(() => {
			const mm = gsap.matchMedia()

			mm.add('(prefers-reduced-motion: no-preference)', () => {
				gsap.set('[data-reveal]', { opacity: 0, y: 24 })
				gsap.set('[data-glyph]', { opacity: 0, scale: 0.92 })

				gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.1 } })
					.to('[data-glyph]', {
						opacity: 1,
						scale: 1,
						stagger: 0.07,
						duration: 1.3
					})
					.to(
						'[data-reveal]',
						{ opacity: 1, y: 0, stagger: 0.08 },
						'-=0.9'
					)

				gsap.to('[data-globe]', {
					rotation: 360,
					duration: 90,
					repeat: -1,
					ease: 'none',
					transformOrigin: '50% 50%'
				})

				// Unstable flicker — a system that can't hold a signal.
				const flicker = () => {
					gsap.to('[data-glyph]', {
						opacity: 0.5,
						duration: 0.05,
						yoyo: true,
						repeat: 5,
						ease: 'rough({ strength: 3, points: 16 })',
						onComplete: () =>
							gsap.set('[data-glyph]', { opacity: 1 })
					})
					gsap.delayedCall(gsap.utils.random(2, 5), flicker)
				}
				gsap.delayedCall(1.8, flicker)
			})

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
			{/* Blueprint grid. */}
			<div
				className="pointer-events-none absolute inset-[-10%] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_45%,black,transparent)] [background-size:64px_64px] opacity-[0.5]"
				aria-hidden
			/>

			{/* Rotating wireframe globe. */}
			<div
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

			{/* Film grain. */}
			<div
				className="[background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')] pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-difference"
				aria-hidden
			/>

			{/* Top status bar. */}
			<div
				data-reveal
				className="text-muted-foreground absolute top-6 left-1/2 flex -translate-x-1/2 items-center gap-3 font-mono text-xs tracking-widest uppercase"
			>
				<Warning weight="bold" className="size-4" />
				{t.systemFault}
			</div>

			<div className="relative z-10 flex flex-col items-center text-center">
				{/* Giant glyphs — ghost echo behind. */}
				<div className="relative">
					<h1
						className="text-foreground/[0.06] font-heading pointer-events-none absolute inset-0 translate-x-2 translate-y-2 [font-size:clamp(7rem,24vw,18rem)] leading-[0.8] font-semibold tracking-[-0.04em] select-none"
						aria-hidden
					>
						ERR
					</h1>
					<h1 className="font-heading flex [font-size:clamp(7rem,24vw,18rem)] leading-[0.8] font-semibold tracking-[-0.04em]">
						<span data-glyph>E</span>
						<span data-glyph>R</span>
						<span data-glyph>R</span>
					</h1>
				</div>

				<p
					data-reveal
					className="text-h5 text-foreground sm:text-h4 mt-2 max-w-md text-balance"
				>
					{t.headline}
				</p>
				<p
					data-reveal
					className="text-body-sm text-muted-foreground mt-3 max-w-sm text-balance"
				>
					{t.body}
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
						<span className="text-foreground">
							RUNTIME_EXCEPTION
						</span>
					</div>
					<dl className="mt-3 space-y-1.5">
						<div className="flex justify-between gap-4">
							<dt className="shrink-0">digest</dt>
							<dd className="text-foreground truncate">
								{error.digest ?? 'n/a'}
							</dd>
						</div>
						{error.message && (
							<div className="flex justify-between gap-4">
								<dt className="shrink-0">message</dt>
								<dd className="text-foreground line-clamp-2 text-right">
									{error.message}
								</dd>
							</div>
						)}
					</dl>
				</div>

				{/* Actions. */}
				<div
					data-reveal
					className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
				>
					<Button
						size="lg"
						onClick={() => reset()}
						className="group/retry"
					>
						<ArrowClockwise
							weight="bold"
							className="transition-transform duration-500 group-hover/retry:rotate-180"
						/>
						{t.tryAgain}
					</Button>
					<Button
						asChild
						variant="outline"
						size="lg"
						className="group/home"
					>
						<Link href="/">
							<House
								weight="bold"
								className="transition-transform duration-300 group-hover/home:-translate-y-0.5"
							/>
							{t.returnBase}
						</Link>
					</Button>
				</div>
			</div>
		</main>
	)
}
