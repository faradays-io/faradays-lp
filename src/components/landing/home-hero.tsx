'use client'

import { ArrowRight } from '@phosphor-icons/react'
import gsap from 'gsap'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { AsciiField, HeroDemo } from '@/components/landing/hero-demo'
import { Button } from '@/components/ui/button'
import { usePageReady } from '@/lib/page-ready'

/**
 * Hero claro (copy no padrão do hero da rota raiz): pill de anúncio,
 * headline display, sub e CTAs com entrada em stagger disparada pelo fim da
 * page transition. Abaixo, o painel escuro de demo em fluxo normal — na
 * carga aparece só a metade de cima (o resto fica além da dobra), o que
 * convida o scroll para a visualização geral.
 */
export function HomeHero() {
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
			className="bg-background relative -mt-23 flex flex-col pt-23"
		>
			{/* Copy + CTA — min-h calculado para deixar exatamente metade do
			   painel (40svh) visível na dobra. */}
			<div className="flex min-h-[calc(60svh-5.75rem)] w-full flex-col items-center justify-center px-7 pt-12 pb-16 text-center">
				<Link
					href="#cta"
					data-hero-item
					className="bg-foreground/5 hover:bg-foreground/10 mb-7 flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm opacity-0 transition-colors"
				>
					<SplitHoverText as="span">
						Conheça a IA de crédito
					</SplitHoverText>
					<ArrowRight className="size-3.5" />
				</Link>

				<h1
					data-hero-item
					className="font-heading max-w-4xl text-5xl leading-[0.95] tracking-tight text-balance opacity-0 min-[810px]:text-[4.75rem]"
				>
					Inteligência artificial aplicada à sua operação
				</h1>

				<p
					data-hero-item
					className="text-body-lg text-foreground/70 mt-6 max-w-xl text-balance opacity-0"
				>
					Motores de decisão e portais operacionais que transformam
					dados dispersos em ação — de crédito a atendimento.
				</p>

				<div
					data-hero-item
					className="mt-8 flex items-center gap-3 opacity-0"
				>
					<Button asChild size="lg" className="px-6">
						<Link href="#cta">
							<SplitHoverText as="span">
								Agende uma demo
							</SplitHoverText>
						</Link>
					</Button>
					<Button asChild size="lg" variant="ghost" className="px-6">
						<Link href="#features">
							<SplitHoverText as="span">
								Conhecer o produto
							</SplitHoverText>
						</Link>
					</Button>
				</div>
			</div>

			{/* Painel de demo em fluxo normal: h-[80svh], metade acima da
			   dobra na carga; o scroll revela o restante. Bordas retas,
			   light blue, textura ASCII e a demo interativa (arraste a
			   planilha → o sistema gera o PDF). */}
			<div
				data-hero-item
				className="relative h-[80svh] w-full overflow-hidden border-y border-[#b3d2ff] bg-[#e0edff] opacity-0"
			>
				<AsciiField className="absolute inset-0" />
				<HeroDemo />
			</div>
		</section>
	)
}
