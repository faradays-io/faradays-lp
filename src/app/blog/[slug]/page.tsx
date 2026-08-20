import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
	BLOG_POSTS,
	getPostBySlug,
	getRelatedPosts
} from '@/components/blog/blog-data'
import { PostBody } from '@/components/blog/post-body'
import { PostMeta } from '@/components/blog/post-meta'
import { POST_BODY_ID, PostTocRail } from '@/components/blog/post-toc'
import { RelatedPosts } from '@/components/blog/related-posts'
import { ViewCounter } from '@/components/blog/view-counter'
import { HomeFooter } from '@/components/landing/home-footer'
import { MockImage } from '@/components/landing/mock-image'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { Reveal } from '@/components/landing/reveal'
import { extractHeadings } from '@/lib/blog'
import { cn } from '@/lib/utils'
import { viewsStore } from '@/lib/views'

export function generateStaticParams() {
	return BLOG_POSTS.map(({ slug }) => ({ slug }))
}

/* Todo slug válido é conhecido em build (conteúdo local) — slugs fora da
   lista respondem 404 de verdade, sem passar pelo Suspense do loading.tsx
   raiz (que faria o notFound() chegar depois do status 200). */
export const dynamicParams = false

/* A capa é o gatilho de entrada do título, que fica na coluna estreita logo
   abaixo — os dois revelam juntos. */
const HEADER_ID = 'post-header'

/* Grade de leitura: índice na coluna da borda, texto no meio e a coluna
   espelhada à direita mantendo tudo opticamente centralizado.

   As colunas da borda só entram em `xl`, onde há largura para o índice fixo
   sem espremer o texto; abaixo disso não há índice e a leitura ocupa o
   artigo centrada. */
const READING_GRID =
	'xl:grid xl:grid-cols-[14rem_minmax(0,1fr)_14rem] xl:gap-10 2xl:grid-cols-[16rem_minmax(0,1fr)_16rem] 2xl:gap-16'

export async function generateMetadata(
	props: PageProps<'/blog/[slug]'>
): Promise<Metadata> {
	const { slug } = await props.params
	const post = getPostBySlug(slug)
	if (!post) notFound()
	return {
		title: `${post.title} — Faradays`,
		description: post.excerpt,
		openGraph: {
			type: 'article',
			title: post.title,
			description: post.excerpt,
			publishedTime: post.publishedAt
		}
	}
}

export default async function BlogPostPage(props: PageProps<'/blog/[slug]'>) {
	const { slug } = await props.params
	const post = getPostBySlug(slug)
	if (!post) notFound()

	const headings = extractHeadings(post.blocks)
	const views = await viewsStore.get(slug)
	const related = getRelatedPosts(post)
	const relatedViews = await viewsStore.getMany(related.map((p) => p.slug))

	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar />
			<ViewCounter slug={post.slug} />
			<main className="pt-23">
				<article className="max-w-section mx-auto w-full px-10 py-16 md:px-14 md:py-24">
					{/* Abertura em largura cheia: volta e capa ocupam o artigo
					   inteiro. */}
					<div id={HEADER_ID}>
						<Reveal>
							<Link
								href="/blog"
								className="link-underline text-foreground/50 hover:text-foreground font-mono text-xs tracking-widest uppercase transition-colors"
							>
								← Blog
							</Link>
							<MockImage
								label={post.title}
								tone={post.thumbTone}
								className="mt-8 aspect-[21/9] w-full"
							/>
						</Reveal>
					</div>

					{/* Do título em diante tudo divide a mesma coluna de leitura —
					   título e tags nascem no mesmo eixo do texto, alinhados à
					   esquerda. O índice mora na coluna da borda e a coluna
					   espelhada à direita mantém a leitura opticamente
					   centralizada na tela. */}
					<div className={cn(READING_GRID, 'mt-10')}>
						<div className="hidden xl:block">
							<PostTocRail headings={headings} />
						</div>
						<div className="mx-auto w-full max-w-[70ch]">
							{/* Mesmo gatilho da capa: o título entra junto com ela,
							   como um bloco só, ainda que fique abaixo da dobra. */}
							<Reveal trigger={`#${HEADER_ID}`}>
								<h1 className="font-heading text-h1 text-balance">
									{post.title}
								</h1>
								<p className="text-body-lg text-foreground/60 mt-5">
									{post.excerpt}
								</p>
								<div className="mt-10">
									<PostMeta post={post} views={views} />
								</div>
							</Reveal>

							<div id={POST_BODY_ID} className="mt-12">
								<PostBody blocks={post.blocks} />
							</div>
						</div>
					</div>

					{/* Fora da grade de leitura: o fecho ocupa o artigo inteiro,
					   como a capa, e o índice para no fim do corpo em vez de
					   acompanhar as sugestões. */}
					<RelatedPosts
						posts={related}
						views={relatedViews}
						className="mt-20"
					/>
				</article>
			</main>
			<HomeFooter />
		</div>
	)
}
