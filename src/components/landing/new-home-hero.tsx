'use client'

import { ArrowDown } from '@phosphor-icons/react'
import gsap from 'gsap'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { FaradaysMark } from '@/components/landing/faradays-lockup'
import { AsciiField } from '@/components/landing/hero-demo'
import { Button } from '@/components/ui/button'
import { BOOKING_URL } from '@/lib/links'
import { usePageReady } from '@/lib/page-ready'

/**
 * Hero da nova home (institucional): o painel azul com textura ASCII — o
 * material de assinatura do site — promovido a palco único, com a marca
 * (setas) como brasão sobre a declaração geral. Sem demo de produto: os
 * produtos vivem nas subpáginas, e o hero só direciona (demo ou soluções).
 * Entrada em stagger disparada pelo fim da page transition.
 */
export function NewHomeHero() {
	const rootRef = useRef<HTMLElement>(null)
	const ready = usePageReady()

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const items = root.querySelectorAll('[data-hero-item]')
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(items, { autoAlpha: 1 })
			return
		}
		// Só depois do loader: até lá os itens ficam em opacity-0 no markup.
		if (!ready) return
		const ctx = gsap.context(() => {
			gsap.fromTo(
				'[data-hero-item]',
				{ autoAlpha: 0, y: 40 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 1.1,
					ease: 'power3.out',
					stagger: 0.1,
					delay: 0.05
				}
			)
		}, root)
		return () => ctx.revert()
	}, [ready])

	return (
		<section
			id="hero"
			ref={rootRef}
			className="bg-background relative overflow-hidden pt-23"
		>
			{/* Textura ASCII em cinza neutro + vinheta esmaecendo só a base,
			   para o hero assentar suave sobre a seção seguinte. */}
			<AsciiField
				className="absolute inset-0 opacity-60"
				rgb="15, 15, 14"
			/>
			<div
				aria-hidden
				className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t to-transparent md:h-64"
			/>

			<div className="relative flex min-h-[calc(100svh-5.75rem)] w-full flex-col items-center justify-center px-7 py-16 text-center">
				<div data-hero-item className="mb-8 opacity-0">
					<FaradaysMark className="text-brand h-12 w-auto md:h-14" />
				</div>

				<span
					data-hero-item
					className="text-foreground/50 font-mono text-sm tracking-widest uppercase opacity-0"
				>
					(software com IA no núcleo)
				</span>

				<h1
					data-hero-item
					className="font-heading mt-5 max-w-4xl text-5xl leading-[0.95] tracking-tight text-balance opacity-0 min-[810px]:text-[4.75rem]"
				>
					Inteligência artificial aplicada à sua operação
				</h1>

				<p
					data-hero-item
					className="text-body-lg text-foreground/70 mt-6 max-w-xl text-balance opacity-0"
				>
					Motores de decisão, portais operacionais e agentes que
					trabalham com os seus dados — cada frente da operação em um
					produto próprio.
				</p>

				<div
					data-hero-item
					className="mt-8 flex items-center gap-3 opacity-0"
				>
					<Button asChild size="lg" className="px-6">
						<Link
							href={BOOKING_URL}
							target="_blank"
							rel="noopener noreferrer"
						>
							<SplitHoverText as="span">
								Agende uma demo
							</SplitHoverText>
						</Link>
					</Button>
					<Button asChild size="lg" variant="ghost" className="px-6">
						<Link href="#solucoes">
							<SplitHoverText as="span">
								Ver as soluções
							</SplitHoverText>
							<ArrowDown className="size-4" />
						</Link>
					</Button>
				</div>
			</div>
		</section>
	)
}
