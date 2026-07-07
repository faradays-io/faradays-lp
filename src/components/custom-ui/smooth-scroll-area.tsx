'use client'

import gsap from 'gsap'
import Lenis, { type LenisOptions } from 'lenis'
import { useEffect, useRef, useState } from 'react'

import { DEFAULT_LENIS_OPTIONS } from '@/lib/lenis-config'
import { cn } from '@/lib/utils'

import { CustomScrollbar } from './custom-scrollbar'

interface SmoothScrollAreaProps {
	children: React.ReactNode
	/** Outer box — set the height here (e.g. `h-96`, `max-h-[60vh]`). */
	className?: string
	/** Inner content wrapper. */
	contentClassName?: string
	autoHide?: boolean
	/**
	 * `true` (default): the bar floats over the content (overlay).
	 * `false`: a gutter is reserved so the bar sits beside the content
	 * and never covers it.
	 */
	scrollbarOverflow?: boolean
	/** Lenis options for THIS area (applied at mount). */
	options?: Omit<LenisOptions, 'wrapper' | 'content' | 'autoRaf'>
}

/**
 * Scrollable area with its own smooth scroll, usable while the page-level
 * Lenis is active. `data-lenis-prevent` on the scroller stops the root Lenis
 * from hijacking the wheel here; the local Lenis (driven by the shared GSAP
 * ticker) smooths it, and CustomScrollbar draws the bar.
 */
export function SmoothScrollArea({
	children,
	className,
	contentClassName,
	autoHide = true,
	scrollbarOverflow = true,
	options
}: SmoothScrollAreaProps) {
	const wrapperRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	// Captured once at mount (options are applied when the Lenis instance is
	// created; later changes are intentionally ignored).
	const optionsRef = useRef(options)

	const [lenis, setLenis] = useState<Lenis | null>(null)

	useEffect(() => {
		const wrapper = wrapperRef.current
		const content = contentRef.current
		if (!wrapper || !content) return

		const instance = new Lenis({
			wrapper,
			content,
			autoRaf: false,
			...DEFAULT_LENIS_OPTIONS,
			...optionsRef.current
		})
		const update = (time: number) => instance.raf(time * 1000)
		gsap.ticker.add(update)
		setLenis(instance)

		return () => {
			gsap.ticker.remove(update)
			instance.destroy()
			setLenis(null)
		}
	}, [])

	return (
		<div className={cn('relative overflow-hidden', className)}>
			<div
				ref={wrapperRef}
				data-lenis-prevent
				className={cn(
					'h-full overflow-y-auto overscroll-contain',
					// Reserve a gutter so the bar sits beside the content.
					!scrollbarOverflow && 'pr-4'
				)}
			>
				<div ref={contentRef} className={contentClassName}>
					{children}
				</div>
			</div>

			<CustomScrollbar
				containerRef={wrapperRef}
				contentRef={contentRef}
				localLenis={lenis}
				autoHide={autoHide}
			/>
		</div>
	)
}
