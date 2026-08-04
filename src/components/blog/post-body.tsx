import type { PostBlock } from '@/components/blog/blog-data'
import { extractHeadings } from '@/lib/blog'

/**
 * Render dos blocos do post. Os ids dos headings vêm de extractHeadings —
 * a mesma fonte que o TOC usa, então âncoras e índice sempre batem.
 */
export function PostBody({ blocks }: { blocks: readonly PostBlock[] }) {
	const headings = extractHeadings(blocks)
	let headingIndex = 0

	return (
		<div className="space-y-7">
			{blocks.map((block, i) => {
				switch (block.type) {
					case 'heading': {
						const { id } = headings[headingIndex++]
						const Tag = block.level === 2 ? 'h2' : 'h3'
						return (
							<Tag
								key={i}
								id={id}
								className={
									block.level === 2
										? 'font-heading text-h2 scroll-mt-28 pt-8 font-semibold'
										: 'font-heading text-h4 scroll-mt-28 pt-2 font-semibold'
								}
							>
								{block.text}
							</Tag>
						)
					}
					case 'paragraph':
						return (
							<p
								key={i}
								className="text-body text-foreground/70 leading-relaxed"
							>
								{block.text}
							</p>
						)
					case 'list': {
						const ListTag = block.ordered ? 'ol' : 'ul'
						return (
							<ListTag
								key={i}
								className={
									block.ordered
										? 'text-body text-foreground/70 list-decimal space-y-2 pl-5 leading-relaxed marker:font-mono marker:text-xs'
										: 'text-body text-foreground/70 marker:text-foreground/40 list-disc space-y-2 pl-5 leading-relaxed'
								}
							>
								{block.items.map((item, j) => (
									<li key={j}>{item}</li>
								))}
							</ListTag>
						)
					}
					case 'quote':
						return (
							<blockquote
								key={i}
								className="border-brand border-l-2 pl-5"
							>
								<p className="text-body-lg text-foreground/85 font-serif leading-relaxed italic">
									{block.text}
								</p>
								{block.cite ? (
									<cite className="text-foreground/50 mt-3 block font-mono text-xs tracking-widest uppercase not-italic">
										{block.cite}
									</cite>
								) : null}
							</blockquote>
						)
				}
			})}
		</div>
	)
}
