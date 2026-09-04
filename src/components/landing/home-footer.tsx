'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { CopyEmail } from '@/components/landing/copy-email'
import { FaradaysWordmark } from '@/components/landing/faradays-wordmark'
import { LEGAL_PAGES } from '@/components/landing/legal-data'
import { SOLUTIONS } from '@/components/landing/solutions-data'
import { useCopy, useLang } from '@/components/language-provider'
import { AiGradientButton } from '@/components/ui/ai-gradient-button'
import { ptSerif } from '@/lib/fonts'
import type { Lang, Localized } from '@/lib/i18n'
import { BOOKING_URL, CONTACT_EMAIL, CONTACT_MAILTO } from '@/lib/links'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

/* Abertura do arco em radianos — 1.5 ≈ 86°: arco bem raso, já perto do
   alinhado; as pontas partem ~9% da largura da palavra abaixo da linha e
   desenrolam até a reta conforme o wordmark sobe na tela. */
const ARC = 1.5

const COPY = {
	pt: {
		tagline: 'Inteligência artificial aplicada à sua operação.',
		location: 'São Paulo · Brasil',
		ctaHeading: 'Veja a Faradays operando com os seus dados',
		ctaSub: 'Uma demo de 30 minutos, sem compromisso: você traz um fluxo real da operação e a gente mostra o que muda.',
		browse: 'Navegue',
		product: 'Produto',
		partners: 'Parceiros',
		testimonials: 'Relatos',
		pricing: 'Preços',
		bookDemo: 'Agende uma demo',
		solutions: 'Soluções',
		contact: 'Contato',
		email: 'E-mail'
	},
	en: {
		tagline: 'Artificial intelligence applied to your operation.',
		location: 'São Paulo · Brazil',
		ctaHeading: 'See Faradays running on your data',
		ctaSub: 'A 30-minute demo, no strings attached: you bring a real workflow from your operation and we show what changes.',
		browse: 'Browse',
		product: 'Product',
		partners: 'Partners',
		testimonials: 'Testimonials',
		pricing: 'Pricing',
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
				{ label: t.pricing, href: '/distribuicao/precos' },
				{ label: 'Blog', href: '/blog' }
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
				{ label: CONTACT_EMAIL, href: CONTACT_MAILTO },
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
			{/* CTA de fechamento — mora aqui em vez de numa seção própria.
			   `id="cta"` mudou de casa junto: é o alvo dos links "Veja uma
			   demo" da nav e do hero.

			   Só a imagem sangra de ponta a ponta da tela; o conteúdo fica
			   no canvas, como no resto da página — daí os dois elementos:
			   o de fora carrega o fundo e o corte, o de dentro é o canvas
			   com a goteira. Sem `pb`: o card encosta na borda de baixo da
			   banda, como na referência — é o `min-h` que dá a altura da
			   faixa e o `items-end` que joga a sobra de imagem toda para
			   cima dele. Encostado embaixo, o card perde o raio nos cantos
			   de baixo e a sombra sai só para a direita (a luz da foto vem
			   da esquerda). O `overflow-hidden` corta o que dela passaria
			   da borda inferior da banda. */}
			<div
				id="cta"
				className="mb-20 w-full overflow-hidden bg-[url(/bg.png)] bg-cover bg-center"
			>
				<div className="max-w-page mx-auto flex min-h-[56rem] w-full items-end px-[var(--gutter)] pt-24">
					<div className="bg-card/50 mx-auto flex min-h-[32rem] w-full max-w-3xl flex-col items-center justify-center rounded-t-2xl px-10 py-14 text-center shadow-[2rem_0_4rem_-1rem_rgba(0,0,0,0.35)] backdrop-blur-xl md:px-14 md:py-20">
						<h2
							className={cn(
								ptSerif.className,
								'w-full text-[5rem]/[1.02] font-normal text-balance'
							)}
						>
							{t.ctaHeading}
						</h2>
						<p className="text-foreground/70 mt-6 w-full text-xl/[1.35] text-pretty">
							{t.ctaSub}
						</p>
						<AiGradientButton asChild className="mt-10">
							<a
								href={BOOKING_URL}
								target="_blank"
								rel="noopener noreferrer"
							>
								<SplitHoverText as="span">
									{t.bookDemo}
								</SplitHoverText>
							</a>
						</AiGradientButton>
					</div>
				</div>
			</div>

			{/* Colunas de navegação: tagline à esquerda, links à direita. */}
			<div className="max-w-page mx-auto grid w-full gap-12 px-[var(--gutter)] pt-16 pb-24 md:grid-cols-[1fr_repeat(3,auto)] md:gap-20 lg:gap-28">
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
							{column.links.map((link) => {
								const linkClass =
									'link-underline text-body-sm text-foreground/70 hover:text-foreground inline-block transition-colors'
								return (
									<li key={link.label}>
										{link.href === CONTACT_MAILTO ? (
											<CopyEmail className={linkClass} />
										) : (
											<a
												href={link.href}
												className={linkClass}
											>
												{link.label}
											</a>
										)}
									</li>
								)
							})}
						</ul>
					</div>
				))}
			</div>

			{/* Wordmark SVG único, de ponta a ponta da tela; animado só em
			   md+ (no mobile fica estático). Cada glifo é um <g.wm-letter>
			   que o arco no scroll gira/desce individualmente. */}
			<div
				ref={wordRef}
				className="max-w-page mx-auto w-full px-4 select-none md:px-[var(--gutter)]"
			>
				<FaradaysWordmark className="block w-full" />
			</div>

			<div className="max-w-page mx-auto flex w-full flex-col items-center gap-3 px-[var(--gutter)] font-mono text-sm tracking-widest uppercase lg:flex-row lg:justify-between">
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
					<CopyEmail className="link-underline text-brand inline-block transition-opacity hover:opacity-85">
						{t.email}
					</CopyEmail>
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
