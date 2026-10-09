'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

import { SplitHoverText } from '@/components/custom-ui/split-hover-text'
import { AsciiMarkGl } from '@/components/landing/ascii-mark-gl'
import { CopyEmail } from '@/components/landing/copy-email'
import { FaradaysWordmark } from '@/components/landing/faradays-wordmark'
import { FOOTER_LEGAL_LINKS } from '@/components/landing/legal-data'
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
		ctaHeading: 'Veja a IA da Faradays trabalhando pelo seu time',
		ctaSub: 'Uma demo de 30 minutos, sem compromisso: você traz um fluxo real do dia a dia e a gente mostra o que a IA resolve.',
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
		ctaHeading: 'See Faradays AI working for your team',
		ctaSub: 'A 30-minute demo, no strings attached: you bring a real everyday workflow and we show what the AI takes care of.',
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
			   relativa só funcionaria na página que tem as seções.
			   "Parceiros" e "Relatos" saem da lista enquanto as seções estão
			   ocultas em /distribuicao (as âncoras não existiriam), e "Preços"
			   enquanto a rota está privada (`_precos/`); as labels ficam em
			   COPY para o retorno. */
			links: [
				{ label: t.product, href: '/distribuicao#features' },
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
			{/* CTA de fechamento + navegação, numa grade só. `id="cta"` mora
			   aqui: é o alvo dos links "Veja uma demo" da nav e do hero.

			   Duas colunas alinhadas pelo topo: o CTA (até 48rem, a largura do
			   título) e a coluna da direita, que nunca fica mais estreita que
			   os links (`max-content`) e absorve a sobra em telas largas — por
			   isso os links vão para o fim dela (`self-end`). Ela é um
			   flex-col: um espaçador reserva a altura da marca e as colunas de
			   links vêm embaixo, alinhadas pelo topo como num rodapé comum.

			   A marca em ASCII isométrico (`AsciiMarkGl`) é um canvas absoluto
			   que vai do fim da coluna do CTA (recuo igual ao `gap` da grade,
			   por breakpoint) até o fim da coluna da direita — o fim do
			   conteúdo do rodapé, não da tela. Centralizada nesse trecho e
			   pendurada pelo topo, o pé dela invade a área dos links; o
			   `mask-image` esmaece o canvas a partir de um pouco acima deles,
			   e é essa parte que fica mais transparente. A largura é explícita
			   (`calc`): canvas é elemento substituído, e com `w-auto` +
			   `left`/`right` ele usaria o tamanho intrínseco do bitmap. */}
			<div
				id="cta"
				className="max-w-page mx-auto grid w-full gap-16 px-[var(--gutter)] pt-24 pb-24 md:grid-cols-[minmax(0,48rem)_minmax(max-content,1fr)] md:items-start md:gap-20 lg:gap-28"
			>
				<div className="flex flex-col items-start">
					<h2
						className={cn(
							ptSerif.className,
							'max-w-3xl text-[4rem]/[1.05] font-normal text-balance'
						)}
					>
						{t.ctaHeading}
					</h2>
					<p className="text-foreground/70 mt-6 max-w-2xl text-xl/[1.35] text-pretty">
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
				<div className="relative flex flex-col">
					<AsciiMarkGl
						className="absolute inset-y-0 [mask-image:linear-gradient(to_bottom,#000_28rem,transparent_40rem)] md:-left-20 md:w-[calc(100%+5rem)] lg:-left-28 lg:w-[calc(100%+7rem)]"
						fit={{ w: 0.95, h: 0.95 }}
						anchor={{ x: 0.5, y: 0.47 }}
					/>
					<div className="min-h-[34rem] flex-1" />
					<div className="relative grid gap-12 sm:grid-cols-3 md:gap-20 md:self-end lg:gap-28">
						{footerColumns(lang).map((column) => (
							<div
								key={column.title}
								className="flex flex-col gap-4"
							>
								<span className="text-foreground/50 font-mono text-xs tracking-widest uppercase">
									{column.title}
								</span>
								<ul className="flex flex-col gap-2.5">
									{column.links.map((link) => {
										const linkClass =
											'link-underline text-body-sm text-foreground/70 hover:text-foreground inline-block transition-colors'
										return (
											<li key={link.label}>
												{link.href ===
												CONTACT_MAILTO ? (
													<CopyEmail
														className={linkClass}
													/>
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
				</div>
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
					{FOOTER_LEGAL_LINKS.map((page) => (
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
