'use client'

import { type MouseEvent, useRef } from 'react'

import { cn } from '@/lib/utils'

/**
 * Interactive card: a brand-tinted spotlight follows the cursor and the card
 * tilts subtly toward it. Content stays fully visible without hover — the
 * interaction is flavor, never a gate.
 */
export function GlowCard({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
}) {
	const ref = useRef<HTMLDivElement>(null)

	const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
		const el = ref.current
		if (!el) return
		const rect = el.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		el.style.setProperty('--mx', `${x}px`)
		el.style.setProperty('--my', `${y}px`)
		const rx = (y / rect.height - 0.5) * -4
		const ry = (x / rect.width - 0.5) * 4
		el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
	}

	const onMouseLeave = () => {
		const el = ref.current
		if (el) el.style.transform = ''
	}

	return (
		<div
			ref={ref}
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
			className={cn(
				'group relative overflow-hidden rounded-3xl border transition-transform duration-300',
				className
			)}
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
				style={{
					background:
						'radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--brand) 14%, transparent), transparent 65%)'
				}}
			/>
			<div className="relative h-full">{children}</div>
		</div>
	)
}
