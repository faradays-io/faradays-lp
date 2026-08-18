'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

import { FaradaysWordmark } from '@/components/landing/faradays-wordmark'
import { LEGAL_PAGES } from '@/components/landing/legal-data'
import { SOLUTIONS } from '@/components/landing/solutions-data'
import { useCopy, useLang } from '@/components/language-provider'
import type { Lang, Localized } from '@/lib/i18n'
import { BOOKING_URL } from '@/lib/links'
import { usePageReady } from '@/lib/page-ready'

gsap.registerPlugin(ScrollTrigger)

/* Abertura do arco em radianos — 1.5 ≈ 86°: arco bem raso, já perto do
   alinhado; as pontas partem ~9% da largura da palavra abaixo da linha e
   desenrolam até a reta conforme o wordmark sobe na tela. */
const ARC = 1.5

const COPY = {
	pt: {
		tagline: 'Inteligência artificial aplicada à sua operação.',
		location: 'São Paulo · Brasil',
		browse: 'Navegue',
		product: 'Produto',
		partners: 'Parceiros',
		testimonials: 'Relatos',
		bookDemo: 'Agende uma demo',
		solutions: 'Soluções',
		contact: 'Contato',
		email: 'E-mail'
	},
	en: {
		tagline: 'Artificial intelligence applied to your operation.',
		location: 'São Paulo · Brazil',
		browse: 'Browse',
		product: 'Product',
		partners: 'Partners',
		testimonials: 'Testimonials',
		bookDemo: 'Book a demo',
		solutions: 'Solutions',
		contact: 'Contact',
		email: 'Email'
	}
} satisfies Localized<Record<string, string>>

/* Colunas de navegação acima do wordmark — função do idioma porque toda
   label troca com o toggle. */
const footerColumns = (lang: Lang) => {
	const t = COPY[lang]
	return [
		{
			title: t.browse,
			/* Absolutos: o rodapé aparece em mais de uma rota, e âncora
			   relativa só funcionaria na página que tem as seções. */
			links: [
				{ label: t.product, href: '/distribuicao#features' },
				{ label: t.partners, href: '/distribuicao#partners' },
				{ label: t.testimonials, href: '/distribuicao#testimonials' },
				{ label: t.bookDemo, href: BOOKING_URL }
			]
		},
		{
			title: t.solutions,
			/* Só as soluções com landing publicada — as demais não têm rota. */
			links: SOLUTIONS.filter((solution) => solution.available).map(
				(solution) => ({
					label: solution.name[lang],
					href: solution.slug
				})
			)
		},
		{
			title: t.contact,
			links: [
				{
					label: 'contato@faradays.io',
					href: 'mailto:contato@faradays.io'
				},
				{ label: 'LinkedIn', href: '#' }
			]
		}
	]
}

export function HomeFooter() {
	const { lang } = useLang()
	const t = useCopy(COPY)
	const rootRef = useRef<HTMLElement>(null)
	const wordRef = useRef<HTMLDivElement>(null)
	const ready = usePageReady()

	useEffect(() => {
		const root = rootRef.current
		const word = wordRef.current
		if (!root || !word || !ready) return
		const svg = word.querySelector('svg')
		// Cada letra é um <g.wm-letter> isolado no wordmark SVG.
		const letters = gsap.utils.toArray<SVGGElement>('.wm-letter', word)
		if (!svg || letters.length === 0) return
		const count = letters.length
		// Amplitude do arco em unidades do viewBox (o y do gsap em SVG é
		// aplicado no espaço de usuário), então escala junto com o desenho.
		const vbWidth = svg.viewBox.baseVal.width || 500.5

		const mm = gsap.matchMedia(root)
		// Só em telas md+ — no mobile fica o wordmark único, estático.
		mm.add('(min-width: 768px)', () => {
			// Pivô no rodapé de cada glifo (canto inferior da sua bbox).
			gsap.set(letters, { transformOrigin: '50% 100%' })
			// Dispara pela fita: o arco fica visível assim que ela desponta
			// na base da viewport e termina alinhado quando ela assenta no
			// fim da página.
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: word,
					start: 'top bottom',
					end: 'bottom bottom',
					scrub: true,
					invalidateOnRefresh: true
				}
			})
			letters.forEach((letter, i) => {
				// Posição da letra no arco: θ = 0 no centro da fita.
				const t = count > 1 ? i / (count - 1) : 0.5
				const theta = (t - 0.5) * ARC
				tl.fromTo(
					letter,
					{
						// Círculo com centro abaixo da fita (arco para baixo):
						// as pontas descem R(1 − cos θ) e giram tangentes ao
						// arco.
						y: (vbWidth / ARC) * (1 - Math.cos(theta)),
						rotation: (theta * 180) / Math.PI
					},
					{ y: 0, rotation: 0, ease: 'none' },
					0
				)
			})
			return () => {
				tl.scrollTrigger?.kill()
				tl.kill()
				gsap.set(letters, { clearProps: 'all' })
			}
		})
		return () => mm.revert()
	}, [ready])

	return (
		<footer
			id="footer"
			ref={rootRef}
			className="relative flex min-h-svh flex-col justify-end overflow-hidden pb-9"
		>
			{/* Colunas de navegação: tagline à esquerda, links à direita. */}
			<div className="grid gap-12 px-7 pb-24 md:grid-cols-[1fr_repeat(3,auto)] md:gap-20 lg:gap-28">
				<div className="flex max-w-sm flex-col gap-4">
					<p className="font-heading text-h4 text-balance">
						{t.tagline}
					</p>
					<p className="text-foreground/60 font-mono text-xs tracking-wide uppercase">
						{t.location}
					</p>
				</div>
				{footerColumns(lang).map((column) => (
					<div key={column.title} className="flex flex-col gap-4">
						<span className="text-foreground/50 font-mono text-xs tracking-widest uppercase">
							{column.title}
						</span>
						<ul className="flex flex-col gap-2.5">
							{column.links.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className="link-underline text-body-sm text-foreground/70 hover:text-foreground inline-block transition-colors"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			{/* Wordmark SVG único, de ponta a ponta da tela; animado só em
			   md+ (no mobile fica estático). Cada glifo é um <g.wm-letter>
			   que o arco no scroll gira/desce individualmente. */}
			<div ref={wordRef} className="w-full px-4 select-none md:px-7">
				<FaradaysWordmark className="block w-full" />
			</div>

			<div className="flex flex-col items-center gap-3 px-7 font-mono text-sm tracking-widest uppercase lg:flex-row lg:justify-between">
				<ul className="flex items-center gap-4">
					{LEGAL_PAGES.map((page) => (
						<li key={page.slug}>
							<a
								href={page.slug}
								className="link-underline text-foreground/70 hover:text-foreground inline-block transition-colors"
							>
								{page.label[lang]}
							</a>
						</li>
					))}
				</ul>
				<p className="text-foreground/70 order-first lg:order-none">
					© 2026 Faradays Consulting LTDA
				</p>
				<div className="flex items-center gap-4">
					<span className="text-foreground/70">{t.contact}</span>
					<a
						href="mailto:contato@faradays.io"
						className="link-underline text-brand inline-block transition-opacity hover:opacity-85"
					>
						{t.email}
					</a>
					<a
						href="#"
						className="link-underline text-brand inline-block transition-opacity hover:opacity-85"
					>
						LinkedIn
					</a>
				</div>
			</div>
		</footer>
	)
}
