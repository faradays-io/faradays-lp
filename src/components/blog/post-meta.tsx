import {
	CalendarBlank,
	Clock,
	Cube,
	Eye,
	Tag
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { type BlogPost, PRODUCT_ROUTES } from '@/components/blog/blog-data'
import { ShareCopy } from '@/components/blog/share-copy'
import { formatPostDate, formatViews, readingTime } from '@/lib/blog'
import { cn } from '@/lib/utils'

/* Todas as labels compartilham a mesma estilização; produto e compartilhar
   ganham o underline animado por serem acionáveis. */
const META_ITEM =
	'text-foreground/70 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-widest uppercase'

export function PostMeta({ post, views }: { post: BlogPost; views: number }) {
	return (
		<div className="border-border flex flex-wrap items-center gap-x-8 gap-y-4 border-b pb-6">
			<span className={META_ITEM}>
				<Tag className="size-4" />
				{post.category}
			</span>
			{post.product ? (
				<Link
					href={PRODUCT_ROUTES[post.product]}
					className={cn(
						META_ITEM,
						'link-underline hover:text-foreground transition-colors'
					)}
				>
					<Cube className="size-4" />
					{post.product}
				</Link>
			) : null}
			<span className={META_ITEM}>
				<CalendarBlank className="size-4" />
				<time dateTime={post.publishedAt}>
					{formatPostDate(post.publishedAt)}
				</time>
			</span>
			<span className={META_ITEM}>
				<Clock className="size-4" />
				{readingTime(post.blocks)} min
			</span>
			<span className={META_ITEM}>
				<Eye className="size-4" />
				{formatViews(views)}
			</span>
			<ShareCopy
				className={cn(
					META_ITEM,
					'hover:text-foreground transition-colors'
				)}
			/>
		</div>
	)
}
