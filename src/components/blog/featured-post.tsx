'use client'

import { Eye } from '@phosphor-icons/react'
import Link from 'next/link'

import type { BlogPost } from '@/components/blog/blog-data'
import { ArrowSwapIcon } from '@/components/landing/arrow-swap-icon'
import { MockImage } from '@/components/landing/mock-image'
import { formatPostDate, formatViews } from '@/lib/blog'
import { cn } from '@/lib/utils'

/**
 * Destaque ao lado do cabeçalho da capa. Fala a mesma língua do `BlogCard`
 * — sem borda, bloco de cor, imagem que cresce no hover e seta no rodapé —
 * mas deitado, para ocupar a faixa ao lado do título sem virar mais um card
 * da grade.
 */
export function FeaturedPost({
	post,
	views,
	className
}: {
	post: BlogPost
	views: number
	className?: string
}) {
	return (
		<Link
			href={`/blog/${post.slug}`}
			className={cn(
				'group/card group/button bg-muted flex gap-4 rounded-2xl p-4 sm:gap-5',
				className
			)}
		>
			<div className="w-2/5 shrink-0 overflow-hidden rounded-xl">
				<MockImage
					label={post.category}
					tone={post.thumbTone}
					className="aspect-[4/3] h-full w-full rounded-none border-0 transition-transform duration-500 ease-out group-hover/card:scale-105"
				/>
			</div>

			<div className="flex min-w-0 flex-col">
				<p className="text-brand font-mono text-xs tracking-widest uppercase">
					Destaque
				</p>
				<h2 className="font-heading text-h5 mt-2 text-balance">
					{post.title}
				</h2>

				<div className="mt-auto flex items-center justify-between gap-4 pt-4">
					<span className="text-foreground/50 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-widest uppercase">
						<time dateTime={post.publishedAt}>
							{formatPostDate(post.publishedAt)}
						</time>
						<span className="inline-flex items-center gap-1.5">
							<Eye className="size-3.5" />
							{formatViews(views)}
						</span>
					</span>
					<ArrowSwapIcon className="text-foreground/40 group-hover/card:text-foreground transition-colors duration-300" />
				</div>
			</div>
		</Link>
	)
}
