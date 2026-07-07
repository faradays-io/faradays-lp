'use client'

import 'lenis/dist/lenis.css'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type LenisRef, ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'

import { DEFAULT_LENIS_OPTIONS } from '@/lib/lenis-config'

gsap.registerPlugin(ScrollTrigger)

// Global smooth scroll. Lenis is driven by GSAP's ticker (autoRaf: false) so
// Lenis and ScrollTrigger stay in sync on a single RAF loop.
export function LenisProvider({ children }: { children: React.ReactNode }) {
	const lenisRef = useRef<LenisRef>(null)

	useEffect(() => {
		function update(time: number) {
			lenisRef.current?.lenis?.raf(time * 1000)
		}
		gsap.ticker.add(update)
		gsap.ticker.lagSmoothing(0)
		return () => gsap.ticker.remove(update)
	}, [])

	return (
		<ReactLenis
			root
			options={{ ...DEFAULT_LENIS_OPTIONS, autoRaf: false }}
			ref={lenisRef}
		>
			{children}
		</ReactLenis>
	)
}
