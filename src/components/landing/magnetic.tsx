'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'

/**
 * Magnetic hover: while the pointer is inside the (stationary) area, the
 * inner element is pulled toward the cursor — the pull ramps up on entry so
 * the grab feels gradual instead of teleporting. On leave it springs back
 * to its resting position with a bit of bounce.
 */
export function Magnetic({
	children,
	className,
	strength = 0.5
}: {
	children: React.ReactNode
	className?: string
	/** 0–1 — how hard the element sticks to the cursor. */
	strength?: number
}) {
	const areaRef = useRef<HTMLDivElement>(null)
	const itemRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const area = areaRef.current
		const item = itemRef.current
		if (!area || !item) return

		const xTo = gsap.quickTo(item, 'x', {
			duration: 0.35,
			ease: 'power3.out'
		})
		const yTo = gsap.quickTo(item, 'y', {
			duration: 0.35,
			ease: 'power3.out'
		})

		// Attraction ramps 0 → 1 on entry so the first frames don't snap.
		const pull = { value: 0 }
		let pullTween: gsap.core.Tween | null = null
		let returnTween: gsap.core.Tween | null = null
		let lastX = 0
		let lastY = 0

		const apply = () => {
			xTo(lastX * strength * pull.value)
			yTo(lastY * strength * pull.value)
		}

		const track = (e: PointerEvent) => {
			const rect = area.getBoundingClientRect()
			lastX = e.clientX - (rect.left + rect.width / 2)
			lastY = e.clientY - (rect.top + rect.height / 2)
		}

		const onEnter = (e: PointerEvent) => {
			returnTween?.kill()
			returnTween = null
			track(e)
			pullTween?.kill()
			pullTween = gsap.to(pull, {
				value: 1,
				duration: 0.5,
				ease: 'power2.out',
				onUpdate: apply
			})
		}

		const onMove = (e: PointerEvent) => {
			track(e)
			apply()
		}

		const onLeave = () => {
			pullTween?.kill()
			pull.value = 0
			returnTween = gsap.to(item, {
				x: 0,
				y: 0,
				duration: 0.9,
				ease: 'elastic.out(1, 0.4)'
			})
		}

		area.addEventListener('pointerenter', onEnter)
		area.addEventListener('pointermove', onMove)
		area.addEventListener('pointerleave', onLeave)
		return () => {
			area.removeEventListener('pointerenter', onEnter)
			area.removeEventListener('pointermove', onMove)
			area.removeEventListener('pointerleave', onLeave)
			pullTween?.kill()
			gsap.killTweensOf(item)
		}
	}, [strength])

	return (
		<div ref={areaRef} className={className}>
			<div ref={itemRef} className="h-full w-full">
				{children}
			</div>
		</div>
	)
}
