import { BlogCard } from '@/components/blog/blog-card'
import type { BlogPost } from '@/components/blog/blog-data'
import { Reveal } from '@/components/landing/reveal'
import { cn } from '@/lib/utils'

/**
 * Fecho do artigo: dois posts vizinhos, nos mesmos cards da grade do índice.
 */
export function RelatedPosts({
	posts,
	views,
	className
}: {
	posts: readonly BlogPost[]
	views: Record<string, number>
	className?: string
}) {
	if (posts.length === 0) return null

	return (
		<Reveal className={cn('border-border border-t pt-10', className)}>
			<p className="text-foreground/40 font-mono text-xs tracking-widest uppercase">
				Leia também
			</p>
			<div className="mt-6 grid gap-6 sm:grid-cols-2 lg:gap-10">
				{posts.map((post) => (
					<BlogCard
						key={post.slug}
						post={post}
						views={views[post.slug] ?? 0}
					/>
				))}
			</div>
		</Reveal>
	)
}
