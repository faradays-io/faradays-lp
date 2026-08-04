import { BLOG_POSTS } from '@/components/blog/blog-data'

/**
 * Contrato do storage de views. O driver atual é mock (Map em memória,
 * semeado por `seedViews`, zera a cada restart). Para plugar um storage real
 * (ex. Upstash Redis), implemente esta interface e troque a atribuição de
 * `viewsStore` — UI e route handler não mudam.
 */
export interface ViewsStore {
	get(slug: string): Promise<number>
	getMany(slugs: readonly string[]): Promise<Record<string, number>>
	increment(slug: string): Promise<number>
}

function createMockViewsStore(): ViewsStore {
	const counts = new Map<string, number>(
		BLOG_POSTS.map((post) => [post.slug, post.seedViews])
	)
	return {
		async get(slug) {
			return counts.get(slug) ?? 0
		},
		async getMany(slugs) {
			return Object.fromEntries(
				slugs.map((slug) => [slug, counts.get(slug) ?? 0])
			)
		},
		async increment(slug) {
			const next = (counts.get(slug) ?? 0) + 1
			counts.set(slug, next)
			return next
		}
	}
}

export const viewsStore: ViewsStore = createMockViewsStore()
