'use client'

import gsap from 'gsap'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

/* Ferramentas onde o time já trabalha — arquivos em public/icons. Para
   entrar mais uma no ciclo (ex.: Corp), basta um item aqui. `next/image`
   serve .svg sem passar pelo otimizador (unoptimized automático). */
const TOOLS = [
	{ name: 'WhatsApp', src: '/icons/Digital_Glyph_Green_RGB_2026.svg' },
	{ name: 'SharePoint', src: '/icons/icons8-sharepoint.svg' },
	{ name: 'OneDrive', src: '/icons/icons8-onedrive.svg' },
	{ name: 'Excel', src: '/icons/icons8-excel.svg' }
]

const HOLD = 1.2 // s que cada ícone fica parado
const SWAP = 0.5 // s da troca

/**
 * Slot inline (1em) no h1 do hero que alterna os ícones das ferramentas:
 * o atual sai subindo, esmaecendo e desfocando enquanto o próximo entra
 * de baixo, do desfoque para o foco. Um passo por vez (timeline curta +
 * delayedCall), sem timeline repetida — evita o estado duplo do primeiro
 * ícone no wrap-around. Com reduced motion o primeiro ícone fica estático.
 */
export function HeroToolIcons({
	label,
	className
}: {
	/** Nome das ferramentas para leitores de tela (o ciclo é visual). */
	label: string
	className?: string
}) {
	const rootRef = useRef<HTMLSpanElement>(null)
	const ready = usePageReady()

	useEffect(() => {
		const root = rootRef.current
		if (!root || !ready) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
			return
		const icons = gsap.utils.toArray<HTMLElement>('[data-tool]', root)
		if (icons.length < 2) return

		let index = 0
		let tl: gsap.core.Timeline | null = null
		let call: gsap.core.Tween | null = null
		const step = () => {
			const cur = icons[index]
			index = (index + 1) % icons.length
			const next = icons[index]
			tl = gsap
				.timeline({
					onComplete: () => {
						call = gsap.delayedCall(HOLD, step)
					}
				})
				.to(
					cur,
					{
						yPercent: -70,
						autoAlpha: 0,
						filter: 'blur(10px)',
						duration: SWAP,
						ease: 'power2.in'
					},
					0
				)
				.fromTo(
					next,
					{ yPercent: 70, autoAlpha: 0, filter: 'blur(10px)' },
					{
						yPercent: 0,
						autoAlpha: 1,
						filter: 'blur(0px)',
						duration: SWAP,
						ease: 'power3.out'
					},
					SWAP * 0.35
				)
		}
		// Começa depois do stagger de entrada do hero.
		call = gsap.delayedCall(HOLD + 1.2, step)

		return () => {
			call?.kill()
			tl?.kill()
			gsap.set(icons, { clearProps: 'all' })
		}
	}, [ready])

	return (
		<span
			ref={rootRef}
			role="img"
			aria-label={label}
			className={cn(
				'relative inline-block size-[0.85em] align-[-0.1em]',
				className
			)}
		>
			{TOOLS.map((tool, i) => (
				<span
					key={tool.name}
					data-tool
					className={cn(
						'absolute inset-0 will-change-transform',
						i > 0 && 'opacity-0'
					)}
				>
					<Image
						src={tool.src}
						alt=""
						fill
						sizes="64px"
						className="object-contain"
					/>
				</span>
			))}
		</span>
	)
}
