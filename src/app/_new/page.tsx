import type { Metadata } from 'next'

import { CaseBillboard } from '@/components/institucional/case-billboard'
import { ClosingBillboard } from '@/components/institucional/closing-billboard'
import { InstitutionalHero } from '@/components/institucional/hero'
import { HowItWorks } from '@/components/institucional/how-it-works'
import { LanguageGlobe } from '@/components/institucional/language-globe'
import { LogoWall } from '@/components/institucional/logo-wall'
import { NewsGrid } from '@/components/institucional/news-grid'
import { Security } from '@/components/institucional/security'
import { SiteFooter } from '@/components/institucional/site-footer'
import { SiteHeader } from '@/components/institucional/site-header'
import { SolutionsStaggered } from '@/components/institucional/solutions-staggered'
import { Testimonials } from '@/components/institucional/testimonials'
import { PageTransition } from '@/components/landing/page-transition'
import { notoSerif } from '@/lib/fonts'
import { cn } from '@/lib/utils'

/* Próxima home institucional, na estrutura da referência getenter.ai
   (docs/referencia-getenter.md): casca completa com placeholders, seções
   na ordem do original. Pasta privada — fora do roteamento; o preview
   local mora em `src/app/new/` (só em dev). noindex até substituir a raiz.

   `light institucional`: tokens claros com fundo branco puro e a serif
   trocada para Noto Serif (a variável vem do `notoSerif.variable`). */
export const metadata: Metadata = {
	title: 'Faradays',
	description: 'Inteligência artificial aplicada à sua operação.',
	robots: { index: false, follow: false }
}

export default function NewHomePage() {
	return (
		<div
			className={cn(
				notoSerif.variable,
				'light institucional bg-background text-foreground min-h-svh'
			)}
		>
			<PageTransition />
			<SiteHeader />
			<main className="pt-26">
				<InstitutionalHero />
				<LogoWall />
				<CaseBillboard />
				<HowItWorks />
				<Testimonials />
				<Security />
				<SolutionsStaggered />
				<NewsGrid />
				<ClosingBillboard />
			</main>
			<SiteFooter />
			<LanguageGlobe />
		</div>
	)
}
