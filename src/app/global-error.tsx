'use client'

import './globals.css'

import { useEffect } from 'react'

/* ------------------------------------------------------------------ *
 * global-error.tsx — catches errors thrown in the ROOT layout itself.
 * It REPLACES the root layout, so there's no font registry, no Lenis,
 * no ThemeProvider here — it must ship its own <html>/<body> and styles.
 *
 * Kept deliberately self-contained and dependency-free (it's the
 * last-resort screen): theme tokens come from the imported globals.css,
 * fonts fall back to a system stack since the `--ff-*` role vars the
 * layout normally sets are absent. No metadata export is allowed in a
 * Client Component — use React's <title> instead.
 * ------------------------------------------------------------------ */

export default function GlobalError({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<html lang="en">
			<body
				className="bg-background text-foreground antialiased"
				style={{
					fontFamily:
						'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
				}}
			>
				<title>Fatal error</title>
				<main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
					<div
						className="pointer-events-none absolute inset-[-10%] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_55%_55%_at_50%_45%,black,transparent)] [background-size:64px_64px] opacity-50"
						aria-hidden
					/>

					<div className="relative z-10 flex flex-col items-center">
						<p className="text-muted-foreground mb-6 text-xs tracking-[0.3em] uppercase">
							Fatal · root layout
						</p>
						<h1 className="text-[clamp(4rem,16vw,11rem)] leading-none font-bold tracking-tighter">
							500
						</h1>
						<p className="mt-4 max-w-sm text-sm text-balance opacity-80">
							The application shell itself failed to render. This
							is as low-level as it gets.
						</p>

						<div className="border-border bg-card/40 text-muted-foreground mt-8 w-full max-w-md rounded-lg border p-4 text-left text-xs">
							<div className="flex justify-between gap-4">
								<span>digest</span>
								<span className="text-foreground truncate">
									{error.digest ?? 'n/a'}
								</span>
							</div>
						</div>

						<button
							type="button"
							onClick={() => reset()}
							className="bg-primary text-primary-foreground mt-8 inline-flex h-10 cursor-pointer items-center rounded-md px-5 text-sm font-medium transition-opacity hover:opacity-80"
						>
							Reload application
						</button>
					</div>
				</main>
			</body>
		</html>
	)
}
