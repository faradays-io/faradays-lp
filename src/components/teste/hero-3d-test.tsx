'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { HeroToolIcons } from '@/components/landing/hero-tool-icons'
import { HERO_COPY } from '@/components/landing/home-hero'
import { useCopy } from '@/components/language-provider'
import {
	DEFAULT_SETTINGS,
	type Mark3dSettings,
	type MarkPlacement
} from '@/components/teste/hero-mark-3d'
import { Button } from '@/components/ui/button'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

// Só no cliente: three/R3F não têm o que fazer no SSR.
const HeroMark3d = dynamic(
	() => import('@/components/teste/hero-mark-3d').then((m) => m.HeroMark3d),
	{ ssr: false }
)
const SpinMark3d = dynamic(
	() => import('@/components/teste/hero-mark-3d').then((m) => m.SpinMark3d),
	{ ssr: false }
)

export type Hero3dVariant = 'center' | 'split'

/* Marcas na cor da página: só a iluminação revela as faces (relevo
   discreto); o hover colore o sólido inteiro. Sem figuras. */
const SCENE: Mark3dSettings = {
	...DEFAULT_SETTINGS,
	azimuth: 18,
	elevation: 16,
	figures: false,
	inkColor: '#f0f0ee',
	sideColor: '#d6d6d0',
	hoverColor: '#0065e0'
}

/* centro: parallax da câmera desligado — cada marca tem o seu (pequeno e
   diferente por marca), espelhado entre os lados (o esquerdo é reflexo do
   direito) e com yaw/pitch de repouso "olhando" para o centro. */
const CENTER_SCENE: Mark3dSettings = { ...SCENE, parallax: 0, tilt: 0.18 }

/* Unidades da cena: a marca-base tem 3.2 de largura; a 1440×~800 o canvas
   full-bleed enxerga ~9.8 u de largura e ~5.4 u de altura no plano z = 0.
   Marcas bem nos cantos, fora da copy centralizada (~±2.6 u). */
const CENTER_MARKS: MarkPlacement[] = [
	// esquerda, meio-alto, espelhada; yaw de 60° vira a face para o outro
	// lado (extrusão quase de frente), pitch positivo mira o centro
	{
		position: [-3.9, 0.9, 0],
		scale: 0.58,
		floatSpeed: 0.9,
		yaw: Math.PI / 3,
		pitch: 0.22,
		mirror: true,
		parallax: 0.22,
		tiltScale: 0.8
	},
	// direita, canto inferior, grande — a menos reativa das da frente
	{
		position: [3.35, -1.45, 0],
		scale: 0.6,
		floatSpeed: 1.1,
		yaw: -0.35,
		parallax: 0.16,
		tiltScale: 0.65
	}
]

/* A pequena do fundo vai num canvas próprio, atrás, com blur leve em CSS
   (não há como desfocar um mesh isolado sem pós-processamento). Reage
   bem menos: está longe. */
const CENTER_BACK_MARKS: MarkPlacement[] = [
	{
		position: [2.9, 1.65, -4],
		scale: 0.42,
		floatSpeed: 1.4,
		yaw: -0.25,
		parallax: 0.07,
		tiltScale: 0.35
	}
]

/**
 * Página de teste do hero com a marca 3D (duas variantes):
 * - `center`: CTA centralizado como no hero atual; três marcas ao redor
 *   (esquerda, direita grande, direita pequena no fundo), no canvas
 *   full-bleed atrás da copy.
 * - `split`: copy completa à esquerda (h1 com os ícones das ferramentas,
 *   sub, CTAs); à direita uma marca só, azul, girando em todos os eixos
 *   e arrastável (SpinMark3d).
 * Entrada: mesmo stagger do HomeHero, o 3D entra por último. Saída no
 * primeiro scroll (gatilho, não scrub): a copy encolhe, desfoca e sobe;
 * o 3D faz o mesmo efeito, mas DESCENDO. Voltar ao topo reverte.
 */
export function Hero3dTest({ variant }: { variant: Hero3dVariant }) {
	const t = useCopy(HERO_COPY)
	const rootRef = useRef<HTMLElement>(null)
	// Fonte de eventos compartilhada pelos dois canvases da variante centro.
	const sceneRef = useRef<HTMLDivElement>(null)
	const ready = usePageReady()

	// Entrada em stagger (copy) + 3D por último.
	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const items = root.querySelectorAll('[data-hero-item], [data-hero-3d]')
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(items, { autoAlpha: 1 })
			return
		}
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
			gsap.fromTo(
				'[data-hero-3d]',
				{ autoAlpha: 0, y: 40 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 1.2,
					ease: 'power3.out',
					delay: 0.35
				}
			)
		}, root)
		return () => ctx.revert()
	}, [ready])

	/* Saída por gatilho no primeiro scroll: copy sobe, 3D desce — mesma
	   duração/ease, mesma timeline. */
	useEffect(() => {
		const root = rootRef.current
		if (!root || !ready) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
			return
		const copy = root.querySelector('[data-hero-copy]')
		const scene = root.querySelector('[data-hero-3d]')
		if (!copy || !scene) return

		const out = gsap
			.timeline({ paused: true })
			.to(
				copy,
				{
					autoAlpha: 0,
					scale: 0.92,
					y: -64,
					filter: 'blur(14px)',
					duration: 0.9,
					ease: 'power3.out'
				},
				0
			)
			.to(
				scene,
				{
					autoAlpha: 0,
					scale: 0.92,
					y: 64,
					filter: 'blur(14px)',
					duration: 0.9,
					ease: 'power3.out'
				},
				0
			)

		let initial = true
		const trigger = ScrollTrigger.create({
			start: 8,
			end: 'max',
			onEnter: () => {
				if (initial) out.progress(1)
				else out.play()
			},
			onLeaveBack: () => out.reverse()
		})
		initial = false

		return () => {
			trigger.kill()
			out.kill()
			gsap.set([copy, scene], { clearProps: 'all' })
		}
	}, [ready])

	const headline = (
		<>
			{t.headlineLead}{' '}
			<span className="whitespace-nowrap">
				{t.headlineTail}{' '}
				<HeroToolIcons label={t.toolsLabel} className="ml-[0.05em]" />
			</span>
		</>
	)

	const ctas = (
		<div
			data-hero-item
			className="pointer-events-auto mt-8 flex items-center gap-3 opacity-0"
		>
			<Button asChild size="lg" className="px-6">
				<Link href="#cta">
					<SplitHoverText as="span">{t.bookDemo}</SplitHoverText>
				</Link>
			</Button>
			<Button asChild size="lg" variant="ghost" className="px-6">
				<Link href="#features">
					<SplitHoverText as="span">
						{t.exploreProduct}
					</SplitHoverText>
				</Link>
			</Button>
		</div>
	)

	return (
		<>
			<section
				ref={rootRef}
				className="bg-background relative h-[calc(100svh-5.75rem)] overflow-hidden"
			>
				{variant === 'center' ? (
					<>
						{/* Canvas full-bleed atrás da copy; a copy é
						   pointer-events-none (só os botões recebem) para o
						   hover chegar nas marcas. */}
						<div
							ref={sceneRef}
							data-hero-3d
							className="absolute inset-0 opacity-0 will-change-transform"
						>
							{/* Fundo desfocado (só a marca pequena) + frente nítida.
							   Os dois ouvem o ponteiro no wrapper (eventSource),
							   senão o canvas de cima engole o hover do de baixo. */}
							<HeroMark3d
								settings={CENTER_SCENE}
								marks={CENTER_BACK_MARKS}
								shadow={false}
								eventSource={sceneRef}
								className="absolute inset-0 blur-[1.5px]"
							/>
							<HeroMark3d
								settings={CENTER_SCENE}
								marks={CENTER_MARKS}
								shadow={false}
								eventSource={sceneRef}
								className="absolute inset-0"
							/>
						</div>
						<div
							data-hero-copy
							className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-7 pb-10 text-center"
						>
							<h1
								data-hero-item
								className="font-heading max-w-3xl text-6xl text-balance opacity-0"
							>
								{headline}
							</h1>
							<p
								data-hero-item
								className="text-body-lg text-foreground/70 mt-6 max-w-xl text-balance opacity-0"
							>
								{t.sub}
							</p>
							{ctas}
						</div>
					</>
				) : (
					<div className="max-w-section mx-auto grid h-full grid-cols-1 gap-x-4 px-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
						{/* pl no lg+ empurra a copy para perto do objeto. */}
						<div
							data-hero-copy
							className="flex h-full flex-col justify-center text-left lg:pl-28"
						>
							<h1
								data-hero-item
								className="font-heading max-w-2xl text-6xl text-balance opacity-0"
							>
								{headline}
							</h1>
							<p
								data-hero-item
								className="text-body-lg text-foreground/70 mt-6 max-w-xl opacity-0"
							>
								{t.sub}
							</p>
							{ctas}
						</div>
						{/* Uma marca só, azul, girando; arrastar gira. */}
						{/* Margem negativa puxa o objeto para perto da copy (a
						   coluna da copy tem folga à direita do max-w-2xl). */}
						<div
							data-hero-3d
							className="relative hidden h-full opacity-0 will-change-transform lg:-ml-24 lg:block"
						>
							<SpinMark3d className="h-full w-full" />
						</div>
					</div>
				)}

				{/* Troca de variante (só nesta página de teste). */}
				<nav className="bg-background/80 absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-full border p-1 font-mono text-[11px] tracking-widest uppercase backdrop-blur">
					{(
						[
							['center', 'centro', '/teste/hero-3d/centro'],
							['split', 'lado', '/teste/hero-3d/lado']
						] as const
					).map(([id, label, href]) => (
						<Link
							key={id}
							href={href}
							className={cn(
								'rounded-full px-3 py-1.5 transition-colors',
								variant === id
									? 'bg-foreground text-background'
									: 'text-foreground/60 hover:text-foreground'
							)}
						>
							{label}
						</Link>
					))}
				</nav>
			</section>

			{/* Conteúdo abaixo só para haver scroll — dispara a saída. */}
			<section className="max-w-section mx-auto flex h-[120svh] items-start px-7 pt-24">
				<p className="text-foreground/40 font-mono text-xs tracking-widest uppercase">
					↑ rolar para cima reverte a saída
				</p>
			</section>
		</>
	)
}
