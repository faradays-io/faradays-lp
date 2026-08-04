'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { useEffect, useMemo, useState } from 'react'

import type { PostHeading } from '@/lib/blog'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

/* Offset do scrollTo: NavBar fixo + respiro. Também usado para decidir a
   linha de leitura do scroll-spy (start do ScrollTrigger). */
const SCROLL_OFFSET = -110

function useScrollSpy(ids: readonly string[]) {
	const [active, setActive] = useState<string | null>(ids[0] ?? null)
	const ready = usePageReady()

	useEffect(() => {
		// ScrollTrigger avalia posições na criação — esperar o loader fechar,
		// como o Reveal faz, evita medir sob o overlay.
		if (!ready || ids.length === 0) return
		const triggers = ids.map((id, i) =>
			ScrollTrigger.create({
				trigger: `#${CSS.escape(id)}`,
				start: 'top 35%',
				onEnter: () => setActive(id),
				onEnterBack: () => setActive(ids[i - 1] ?? ids[0])
			})
		)
		return () => triggers.forEach((t) => t.kill())
	}, [ids, ready])

	return active
}

function TocLink({
	heading,
	active,
	onNavigate
}: {
	heading: PostHeading
	active: boolean
	onNavigate: (id: string) => void
}) {
	return (
		<a
			href={`#${heading.id}`}
			aria-current={active ? 'true' : undefined}
			onClick={(e) => {
				e.preventDefault()
				onNavigate(heading.id)
			}}
			className={cn(
				'relative block border-l py-1.5 text-sm leading-snug transition-colors',
				heading.level === 2 ? 'pl-4' : 'pl-8',
				active
					? 'border-brand text-foreground'
					: 'border-border text-foreground/50 hover:text-foreground/80'
			)}
		>
			{heading.text}
		</a>
	)
}

export function PostToc({ headings }: { headings: readonly PostHeading[] }) {
	const lenis = useLenis()
	const ids = useMemo(() => headings.map((h) => h.id), [headings])
	const active = useScrollSpy(ids)

	function navigate(id: string) {
		const el = document.getElementById(id)
		if (!el) return
		if (lenis) lenis.scrollTo(el, { offset: SCROLL_OFFSET })
		else el.scrollIntoView()
		history.replaceState(null, '', `#${id}`)
	}

	if (headings.length === 0) return null

	return (
		<>
			{/* < lg: índice colapsável acima do corpo */}
			<details className="border-border mb-10 rounded-md border p-4 lg:hidden">
				<summary className="text-foreground/60 cursor-pointer font-mono text-xs tracking-widest uppercase select-none">
					Índice
				</summary>
				<nav aria-label="Índice do artigo" className="mt-3">
					{headings.map((h) => (
						<TocLink
							key={h.id}
							heading={h}
							active={h.id === active}
							onNavigate={navigate}
						/>
					))}
				</nav>
			</details>

			{/* lg+: sticky na coluna esquerda */}
			<nav
				aria-label="Índice do artigo"
				className="sticky top-28 hidden max-h-[calc(100svh-9rem)] overflow-y-auto lg:block"
			>
				<p className="text-foreground/40 mb-4 font-mono text-xs tracking-widest uppercase">
					Neste artigo
				</p>
				{headings.map((h) => (
					<TocLink
						key={h.id}
						heading={h}
						active={h.id === active}
						onNavigate={navigate}
					/>
				))}
			</nav>
		</>
	)
}
