'use client'

import type Lenis from 'lenis'
import { useLenis } from 'lenis/react'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState
} from 'react'

import { cn } from '@/lib/utils'

const TRACK_MARGIN_Y = 16
const MIN_THUMB = 20
const SCROLL_IDLE_MS = 150
const HIDE_DELAY_MS = 1500

interface CustomScrollbarProps {
	autoHide?: boolean
	containerRef?: React.RefObject<HTMLElement | null>
	contentRef?: React.RefObject<HTMLElement | null>
	/** Pass when the target uses its own (local) Lenis instance. */
	localLenis?: Lenis | null
}

interface Metrics {
	availableHeight: number
	thumbHeight: number
	maxScrollTop: number
	maxThumbTop: number
}

export function CustomScrollbar({
	autoHide = false,
	containerRef,
	contentRef,
	localLenis
}: CustomScrollbarProps) {
	const globalLenis = useLenis()
	const lenis = localLenis ?? globalLenis
	const isLocal = !!containerRef

	// State only for things that change on interaction (not per scroll frame).
	const [isVisible, setIsVisible] = useState(!autoHide)
	const [isHovering, setIsHovering] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [isScrolling, setIsScrolling] = useState(false)
	const [thumbHeight, setThumbHeight] = useState(0)

	const trackRef = useRef<HTMLDivElement>(null)
	const thumbRef = useRef<HTMLDivElement>(null)
	const metricsRef = useRef<Metrics | null>(null)
	const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const startDragY = useRef(0)
	const startScrollTop = useRef(0)
	// Mirror interaction state into refs so the hide timer reads fresh values
	// without re-subscribing.
	const hoveringRef = useRef(false)
	const draggingRef = useRef(false)

	const getScrollY = useCallback((): number => {
		if (lenis) return lenis.scroll
		if (isLocal && containerRef?.current)
			return containerRef.current.scrollTop
		return window.scrollY
	}, [lenis, isLocal, containerRef])

	// Per-frame: write the thumb position straight to the DOM — no re-render.
	const positionThumb = useCallback((scrollY: number) => {
		const thumb = thumbRef.current
		const m = metricsRef.current
		if (!thumb || !m) return
		const top =
			m.maxScrollTop <= 0
				? TRACK_MARGIN_Y
				: TRACK_MARGIN_Y + (scrollY / m.maxScrollTop) * m.maxThumbTop
		thumb.style.transform = `translateY(${top}px)`
	}, [])

	// Reads layout — runs only on mount, resize and content-size changes.
	const measure = useCallback(() => {
		const innerHeight =
			isLocal && containerRef?.current
				? containerRef.current.clientHeight
				: window.innerHeight
		const scrollHeight =
			isLocal && contentRef?.current
				? contentRef.current.scrollHeight
				: document.documentElement.scrollHeight

		if (scrollHeight <= innerHeight) {
			metricsRef.current = null
			setThumbHeight(0)
			return
		}

		const availableHeight = innerHeight - TRACK_MARGIN_Y * 2
		const height = Math.max(
			(innerHeight / scrollHeight) * availableHeight,
			MIN_THUMB
		)

		metricsRef.current = {
			availableHeight,
			thumbHeight: height,
			maxScrollTop: scrollHeight - innerHeight,
			maxThumbTop: availableHeight - height
		}
		setThumbHeight((prev) => (prev === height ? prev : height))
		positionThumb(getScrollY())
	}, [isLocal, containerRef, contentRef, positionThumb, getScrollY])

	const showScrollbar = useCallback(() => {
		setIsVisible(true)
		if (!autoHide) return
		if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
		hideTimeoutRef.current = setTimeout(() => {
			if (!hoveringRef.current && !draggingRef.current)
				setIsVisible(false)
		}, HIDE_DELAY_MS)
	}, [autoHide])

	const onScroll = useCallback(
		(scrollY?: number) => {
			positionThumb(scrollY ?? getScrollY())
			showScrollbar()
			setIsScrolling(true)
			if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
			scrollTimeoutRef.current = setTimeout(
				() => setIsScrolling(false),
				SCROLL_IDLE_MS
			)
		},
		[positionThumb, getScrollY, showScrollbar]
	)

	// Subscribe to the scroll source (Lenis event when present, else native
	// passive scroll) + observe size changes.
	useEffect(() => {
		// Initial measure comes from ResizeObserver's first callback below
		// (kept out of the effect body to avoid a synchronous setState).
		let detach: () => void
		if (lenis) {
			const cb = (l: Lenis) => onScroll(l.scroll)
			lenis.on('scroll', cb)
			detach = () => lenis.off('scroll', cb)
		} else {
			const target: HTMLElement | Window =
				isLocal && containerRef?.current ? containerRef.current : window
			const handler = () => onScroll()
			target.addEventListener('scroll', handler, { passive: true })
			detach = () => target.removeEventListener('scroll', handler)
		}

		const ro = new ResizeObserver(() => measure())
		if (isLocal) {
			if (containerRef?.current) ro.observe(containerRef.current)
			if (contentRef?.current) ro.observe(contentRef.current)
		} else {
			ro.observe(document.documentElement)
		}

		return () => {
			detach()
			ro.disconnect()
			if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
			if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
		}
	}, [lenis, isLocal, containerRef, contentRef, measure, onScroll])

	// Position once the thumb is actually mounted (thumbHeight flips 0 → n).
	useLayoutEffect(() => {
		if (thumbHeight > 0) positionThumb(getScrollY())
	}, [thumbHeight, positionThumb, getScrollY])

	// Drag.
	useEffect(() => {
		if (!isDragging) return

		const handleMouseMove = (e: MouseEvent) => {
			e.preventDefault()
			const m = metricsRef.current
			if (!m || m.maxThumbTop <= 0) return
			const deltaY = e.clientY - startDragY.current
			const newScrollTop =
				startScrollTop.current +
				deltaY * (m.maxScrollTop / m.maxThumbTop)

			if (lenis) {
				lenis.scrollTo(newScrollTop, { immediate: true })
			} else if (isLocal && containerRef?.current) {
				containerRef.current.scrollTo({
					top: newScrollTop,
					behavior: 'auto'
				})
			} else {
				window.scrollTo({ top: newScrollTop, behavior: 'auto' })
			}
		}

		const handleMouseUp = () => {
			draggingRef.current = false
			setIsDragging(false)
			document.body.style.userSelect = ''
			showScrollbar()
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
		document.body.style.userSelect = 'none'

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isDragging, lenis, isLocal, containerRef, showScrollbar])

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		draggingRef.current = true
		setIsDragging(true)
		startDragY.current = e.clientY
		startScrollTop.current = getScrollY()
	}

	const handleTrackClick = (e: React.MouseEvent) => {
		if (e.target === thumbRef.current) return
		const trackBounds = trackRef.current?.getBoundingClientRect()
		const m = metricsRef.current
		if (!trackBounds || !m) return

		const relativeY = e.clientY - trackBounds.top - TRACK_MARGIN_Y
		const clampedY = Math.max(0, Math.min(relativeY, m.availableHeight))
		const targetScroll = (clampedY / m.availableHeight) * m.maxScrollTop

		if (lenis) {
			lenis.scrollTo(targetScroll)
		} else if (isLocal && containerRef?.current) {
			containerRef.current.scrollTo({
				top: targetScroll,
				behavior: 'smooth'
			})
		} else {
			window.scrollTo({ top: targetScroll, behavior: 'smooth' })
		}
	}

	const handleMouseEnter = () => {
		hoveringRef.current = true
		setIsHovering(true)
		showScrollbar()
	}

	const handleMouseLeave = () => {
		hoveringRef.current = false
		setIsHovering(false)
		showScrollbar()
	}

	if (thumbHeight === 0) return null

	const active = isDragging || isScrolling || isHovering || !autoHide

	return (
		<div
			ref={trackRef}
			className={cn(
				'top-0 right-0.5 z-50 h-full w-2 transition-opacity duration-300',
				isLocal ? 'absolute' : 'fixed',
				active || isVisible ? 'opacity-100' : 'opacity-0'
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleTrackClick}
		>
			<div className="absolute inset-0 cursor-pointer bg-transparent" />
			<div
				ref={thumbRef}
				className={cn(
					'absolute right-0 cursor-pointer rounded-full transition-[width,background-color] duration-300',
					isHovering || isDragging ? 'w-2' : 'w-1',
					active ? 'bg-scrollbar-thumb' : 'bg-transparent'
				)}
				style={{ height: `${thumbHeight}px` }}
				onMouseDown={handleMouseDown}
			/>
		</div>
	)
}
