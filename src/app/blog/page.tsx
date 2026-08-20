import type { Metadata } from 'next'

import { BLOG_POSTS, getFeaturedPost } from '@/components/blog/blog-data'
import { BlogIndex } from '@/components/blog/blog-index'
import { FeaturedPost } from '@/components/blog/featured-post'
import { HomeFooter } from '@/components/landing/home-footer'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { Reveal } from '@/components/landing/reveal'
import { viewsStore } from '@/lib/views'

export const metadata: Metadata = {
	title: 'Blog — Faradays',
	description:
		'Pesquisa, engenharia e produto na Faradays: IA aplicada a importações e crédito, modelos fundacionais tabulares e automação de ponta a ponta.'
}

export default async function BlogPage() {
	const views = await viewsStore.getMany(BLOG_POSTS.map((p) => p.slug))
	const featured = getFeaturedPost()

	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar />
			<main className="pt-23">
				<div className="max-w-section mx-auto w-full px-10 py-16 md:px-14 md:py-24">
					<div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
						<Reveal>
							<p className="text-foreground/40 font-mono text-xs tracking-widest uppercase">
								Blog
							</p>
							<h1 className="font-heading text-h1 mt-4 text-balance">
								Ideias em produção
							</h1>
							<p className="text-body-lg text-foreground/60 mt-5 max-w-3xl">
								Pesquisa, engenharia e produto — o que estamos
								aprendendo construindo IA aplicada a importações
								e crédito.
							</p>
						</Reveal>

						{featured ? (
							<Reveal delay={0.15}>
								<FeaturedPost
									post={featured}
									views={views[featured.slug] ?? 0}
								/>
							</Reveal>
						) : null}
					</div>
					<div className="mt-20 md:mt-28">
						<BlogIndex posts={BLOG_POSTS} views={views} />
					</div>
				</div>
			</main>
			<HomeFooter />
		</div>
	)
}
