'use client'

import { Eye } from '@phosphor-icons/react'
import Link from 'next/link'

import type { BlogPost } from '@/components/blog/blog-data'
import { CategoryBadge } from '@/components/blog/category-badge'
import { ArrowSwapIcon } from '@/components/landing/arrow-swap-icon'
import { MockImage } from '@/components/landing/mock-image'
import { formatPostDate, formatViews } from '@/lib/blog'

/**
 * Card da grade. Sem borda: o que separa o card do fundo é o próprio bloco de
 * cor (`bg-muted` sobre o cinza da página). No hover só a imagem cresce, presa
 * pelo `overflow-hidden` da moldura — os cards vizinhos ficam intocados.
 *
 * `group/button` é o gancho que o `ArrowSwapIcon` escuta para trocar a seta.
 */
export function BlogCard({ post, views }: { post: BlogPost; views: number }) {
	return (
		<Link
			href={`/blog/${post.slug}`}
			className="group/card group/button bg-muted flex h-full flex-col rounded-2xl p-4"
		>
			<div className="overflow-hidden rounded-xl">
				<MockImage
					label={post.category}
					tone={post.thumbTone}
					className="aspect-[16/9] w-full rounded-none border-0 transition-transform duration-500 ease-out group-hover/card:scale-105"
				/>
			</div>

			<h2 className="font-heading text-h5 mt-5 text-balance">
				{post.title}
			</h2>

			<div className="text-foreground/50 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs tracking-widest uppercase">
				<time dateTime={post.publishedAt}>
					{formatPostDate(post.publishedAt)}
				</time>
				<span className="inline-flex items-center gap-1.5">
					<Eye className="size-3.5" />
					{formatViews(views)}
				</span>
			</div>

			<div className="mt-auto flex items-center justify-between gap-4 pt-6">
				<CategoryBadge className="group-hover/card:border-brand group-hover/card:bg-brand group-hover/card:text-brand-foreground transition-colors duration-300">
					{post.category}
				</CategoryBadge>
				<ArrowSwapIcon className="text-foreground/40 group-hover/card:text-foreground transition-colors duration-300" />
			</div>
		</Link>
	)
}

/** Linha da visualização em lista (tabela). */
export function BlogRow({ post, views }: { post: BlogPost; views: number }) {
	return (
		<>
			{/* pl-4 casa com o `first:pl-4` do cabeçalho e dá um respiro à
			   faixa de hover da linha. */}
			<td className="py-4 pr-6 pl-4">
				<Link
					href={`/blog/${post.slug}`}
					className="font-heading text-h6 group-hover/row:text-brand block transition-colors"
				>
					{post.title}
				</Link>
			</td>
			<td className="py-4 pr-6">
				<CategoryBadge>{post.category}</CategoryBadge>
			</td>
			<td className="text-foreground/60 py-4 pr-6 font-mono text-xs tracking-widest whitespace-nowrap uppercase">
				<time dateTime={post.publishedAt}>
					{formatPostDate(post.publishedAt)}
				</time>
			</td>
			<td className="text-foreground/60 py-4 font-mono text-xs tracking-widest uppercase">
				<span className="inline-flex items-center gap-1.5">
					<Eye className="size-3.5" />
					{formatViews(views)}
				</span>
			</td>
		</>
	)
}
