/* ------------------------------------------------------------------ *
 * loading.tsx — Suspense fallback shown during navigation / streaming.
 * Server Component on purpose: pure CSS motion, zero client JS, so it
 * paints instantly. Same monochrome / theme-token language as the 404
 * and error screens. (CSS animations ignore reduced-motion here; they're
 * slow + non-flashing, the spinner is the universal exception.)
 * ------------------------------------------------------------------ */

export default function Loading() {
	return (
		<main className="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
			{/* Blueprint grid. */}
			<div
				className="pointer-events-none absolute inset-[-10%] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_55%_55%_at_50%_50%,black,transparent)] [background-size:64px_64px] opacity-[0.5]"
				aria-hidden
			/>

			<div
				className="flex flex-col items-center"
				role="status"
				aria-label="Loading"
			>
				{/* Wireframe globe, slowly spinning. */}
				<svg
					viewBox="0 0 256 256"
					className="text-foreground/70 size-20 animate-[spin_8s_linear_infinite]"
					fill="none"
					stroke="currentColor"
					strokeWidth={4}
					aria-hidden
				>
					<circle cx="128" cy="128" r="104" />
					<ellipse cx="128" cy="128" rx="48" ry="104" />
					<ellipse cx="128" cy="128" rx="96" ry="104" />
					<line x1="24" y1="128" x2="232" y2="128" />
					<ellipse cx="128" cy="128" rx="104" ry="44" />
				</svg>

				{/* Label + staggered pulsing dots. */}
				<div className="text-muted-foreground mt-8 flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
					Establishing signal
					<span className="flex gap-1">
						{[0, 1, 2].map((i) => (
							<span
								key={i}
								className="bg-muted-foreground inline-block size-1 animate-pulse rounded-full"
								style={{ animationDelay: `${i * 0.2}s` }}
							/>
						))}
					</span>
				</div>
			</div>
		</main>
	)
}
