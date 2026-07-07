import { ImageSquare } from '@phosphor-icons/react/dist/ssr'

import { cn } from '@/lib/utils'

const TONES = {
	slate: 'from-neutral-800/80 to-neutral-900',
	ember: 'from-orange-950/70 to-neutral-900',
	violet: 'from-violet-950/60 to-neutral-900',
	moss: 'from-emerald-950/60 to-neutral-900',
	light: 'from-neutral-200 to-neutral-100 text-neutral-500'
} as const

export type MockImageTone = keyof typeof TONES

/**
 * Placeholder for images that could not be sourced — keeps the exact slot,
 * aspect ratio and framing of the original asset.
 */
export function MockImage({
	label,
	tone = 'slate',
	className
}: {
	label: string
	tone?: MockImageTone
	className?: string
}) {
	return (
		<div
			className={cn(
				'text-muted-foreground relative flex items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br',
				TONES[tone],
				className
			)}
		>
			<div
				aria-hidden
				className="absolute inset-0 opacity-40"
				style={{
					backgroundImage:
						'repeating-linear-gradient(135deg, transparent 0 14px, color-mix(in oklch, currentColor 12%, transparent) 14px 15px)'
				}}
			/>
			<div className="relative flex flex-col items-center gap-2 p-6 text-center">
				<ImageSquare className="size-7 opacity-70" weight="duotone" />
				<span className="font-mono text-xs tracking-wide uppercase opacity-80">
					{label}
				</span>
			</div>
		</div>
	)
}
