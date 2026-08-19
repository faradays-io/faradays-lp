'use client'

import 'lenis/dist/lenis.css'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type LenisRef, ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'

import { DEFAULT_LENIS_OPTIONS } from '@/lib/lenis-config'

gsap.registerPlugin(ScrollTrigger)

/* Altura da nav fixa (`p-7` + `h-9` = 92px, o mesmo `pt-23` que as páginas
   usam para escapar dela). Sem esse recuo o anchor para exatamente no topo
   da seção e a nav — que volta a aparecer quando o scroll sobe — cobre o
   cabeçalho dela. */
const NAV_OFFSET = 92

// Global smooth scroll. Lenis is driven by GSAP's ticker (autoRaf: false) so
// Lenis and ScrollTrigger stay in sync on a single RAF loop.
// `anchors` intercepta clique em link de âncora (mesmo host + mesmo pathname
// + hash) e faz o scroll pelo Lenis. Sem isso o browser resolve o fragmento
// nativamente, o que teleporta — os links de seção do rodapé caíam nisso.
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
			options={{
				...DEFAULT_LENIS_OPTIONS,
				autoRaf: false,
				anchors: { offset: -NAV_OFFSET }
			}}
			ref={lenisRef}
		>
			{children}
		</ReactLenis>
	)
}
