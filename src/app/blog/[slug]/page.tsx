import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BLOG_POSTS, getPostBySlug } from '@/components/blog/blog-data'
import { PostBody } from '@/components/blog/post-body'
import { PostMeta } from '@/components/blog/post-meta'
import { PostToc } from '@/components/blog/post-toc'
import { ViewCounter } from '@/components/blog/view-counter'
import { HomeFooter } from '@/components/landing/home-footer'
import { MockImage } from '@/components/landing/mock-image'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { Reveal } from '@/components/landing/reveal'
import { extractHeadings } from '@/lib/blog'
import { viewsStore } from '@/lib/views'

export function generateStaticParams() {
	return BLOG_POSTS.map(({ slug }) => ({ slug }))
}

/* Todo slug válido é conhecido em build (conteúdo local) — slugs fora da
   lista respondem 404 de verdade, sem passar pelo Suspense do loading.tsx
   raiz (que faria o notFound() chegar depois do status 200). */
export const dynamicParams = false

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

	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar />
			<ViewCounter slug={post.slug} />
			<main className="pt-23">
				<article className="max-w-section mx-auto w-full px-10 py-16 md:px-14 md:py-24">
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
						<h1 className="font-heading text-h1 md:text-display mt-10 max-w-4xl text-balance">
							{post.title}
						</h1>
						<p className="text-body-lg text-foreground/60 mt-5 max-w-3xl">
							{post.excerpt}
						</p>
						<div className="mt-10">
							<PostMeta post={post} views={views} />
						</div>
					</Reveal>

					{/* TOC na primeira coluna, encostado na borda (só o px-7
					   do article); a coluna espelhada à direita mantém o
					   corpo opticamente centralizado na tela. */}
					<div className="mt-12 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)_16rem] lg:gap-16">
						<div>
							<PostToc headings={headings} />
						</div>
						<div className="mx-auto w-full max-w-[70ch]">
							<PostBody blocks={post.blocks} />
						</div>
					</div>
				</article>
			</main>
			<HomeFooter />
		</div>
	)
}
