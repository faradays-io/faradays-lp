'use client'

import { Eye } from '@phosphor-icons/react'
import Link from 'next/link'

import type { BlogPost } from '@/components/blog/blog-data'
import { CategoryBadge } from '@/components/blog/category-badge'
import { MockImage } from '@/components/landing/mock-image'
import { formatPostDate, formatViews } from '@/lib/blog'
import { cn } from '@/lib/utils'

/**
 * Card da grade. O container dos cards precisa da classe `group/cards`:
 * com a grade em hover, os cards NÃO hovered esmaecem (título cinza, thumb
 * em p&b); o card em hover mantém tudo e pinta a tag de azul.
 */
export function BlogCard({ post, views }: { post: BlogPost; views: number }) {
	return (
		<Link
			href={`/blog/${post.slug}`}
			className={cn(
				'group/card border-border block rounded-2xl border p-4',
				'group-hover/cards:not-hover:[&_[data-dim=title]]:text-foreground/35',
				'group-hover/cards:not-hover:[&_[data-dim=thumb]]:grayscale'
			)}
		>
			<div data-dim="thumb" className="transition-[filter] duration-300">
				<MockImage
					label={post.category}
					tone={post.thumbTone}
					className="aspect-[16/9] w-full"
				/>
			</div>
			<div className="mt-4 space-y-3">
				<div className="text-foreground/50 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs tracking-widest uppercase">
					<CategoryBadge className="group-hover/card:border-brand group-hover/card:bg-brand group-hover/card:text-brand-foreground transition-colors duration-300">
						{post.category}
					</CategoryBadge>
					<time dateTime={post.publishedAt}>
						{formatPostDate(post.publishedAt)}
					</time>
					<span className="inline-flex items-center gap-1">
						<Eye className="size-3.5" />
						{formatViews(views)}
					</span>
				</div>
				<h2
					data-dim="title"
					className="font-heading text-h5 text-balance transition-colors duration-300"
				>
					{post.title}
				</h2>
			</div>
		</Link>
	)
}

/** Linha da visualização em lista (tabela). */
export function BlogRow({ post, views }: { post: BlogPost; views: number }) {
	return (
		<>
			<td className="py-4 pr-6">
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
