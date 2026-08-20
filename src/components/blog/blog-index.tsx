'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'

import { BlogCard, BlogRow } from '@/components/blog/blog-card'
import type {
	BlogCategory,
	BlogPost,
	BlogProduct
} from '@/components/blog/blog-data'
import { BlogFilters, type SortState } from '@/components/blog/blog-filters'
import { BlogToolbar, type ViewMode } from '@/components/blog/blog-toolbar'
import { Reveal } from '@/components/landing/reveal'
import { Button } from '@/components/ui/button'
import { usePageReady } from '@/lib/page-ready'

const PAGE_SIZE = 3
const STAGGER = 0.09
const READY_DELAY = 0.35

export function BlogIndex({
	posts,
	views
}: {
	posts: readonly BlogPost[]
	views: Record<string, number>
}) {
	const ready = usePageReady()
	const [category, setCategory] = useState<BlogCategory | null>(null)
	const [product, setProduct] = useState<BlogProduct | null>(null)
	const [featuredOnly, setFeaturedOnly] = useState(false)
	const [sort, setSort] = useState<SortState>({ key: 'date', dir: 'desc' })
	const [query, setQuery] = useState('')
	const [view, setView] = useState<ViewMode>('grid')
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

	/* Toda mudança de filtro/busca/sort reseta a paginação — feito nos
	   handlers (não em effect) para render único. */
	function resetPaging() {
		setVisibleCount(PAGE_SIZE)
	}

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase()
		const result = posts.filter(
			(post) =>
				(category === null || post.category === category) &&
				(product === null || post.product === product) &&
				(!featuredOnly || post.featured) &&
				(q === '' ||
					post.title.toLowerCase().includes(q) ||
					post.excerpt.toLowerCase().includes(q))
		)
		const dir = sort.dir === 'asc' ? 1 : -1
		return result.toSorted((a, b) => {
			switch (sort.key) {
				case 'date':
					return a.publishedAt.localeCompare(b.publishedAt) * dir
				case 'title':
					return a.title.localeCompare(b.title, 'pt-BR') * dir
				case 'views':
					return ((views[a.slug] ?? 0) - (views[b.slug] ?? 0)) * dir
			}
		})
	}, [posts, views, category, product, featuredOnly, query, sort])

	const visible = filtered.slice(0, visibleCount)
	const remaining = filtered.length - visible.length

	/* Entrada dos cards: gate no page-ready (como o Reveal) + stagger por
	   índice. READY_DELAY dá respiro após o overlay do loader sair — sem
	   ele a animação corre escondida atrás do fade do loader e parece que
	   os cards já nasceram prontos. O respiro vale só para a intro: depois
	   dela o delay zera e trocas de filtro animam de imediato. */
	const [introDone, setIntroDone] = useState(false)
	useEffect(() => {
		if (!ready) return
		const t = setTimeout(() => setIntroDone(true), 1200)
		return () => clearTimeout(t)
	}, [ready])
	const introDelay = introDone ? 0 : READY_DELAY

	const cardMotion = (index: number) => ({
		layout: true,
		initial: { opacity: 0, y: 24 },
		animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
		exit: { opacity: 0, y: -8 },
		transition: {
			duration: 0.6,
			delay: introDelay + Math.min(index * STAGGER, 0.6),
			ease: [0.22, 1, 0.36, 1] as const
		}
	})

	return (
		<div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
			{/* O `aside` é que precisa ser o item da grade: como item ele
			   ganha a altura da linha inteira como área de sticky, e o
			   `self-start` o impede de esticar junto — é o que dá margem
			   para ele grudar enquanto a lista rola ao lado. O Reveal fica
			   por dentro, para o transform da entrada não brigar com isso. */}
			<aside
				aria-label="Filtros"
				className="lg:sticky lg:top-20 lg:max-h-[calc(100svh-7rem)] lg:self-start lg:overflow-y-auto"
			>
				<Reveal delay={0.1}>
					<BlogFilters
						category={category}
						onCategoryChange={(v) => {
							setCategory(v)
							resetPaging()
						}}
						product={product}
						onProductChange={(v) => {
							setProduct(v)
							resetPaging()
						}}
						featuredOnly={featuredOnly}
						onFeaturedChange={(v) => {
							setFeaturedOnly(v)
							resetPaging()
						}}
						sort={sort}
						onSortChange={(v) => {
							setSort(v)
							resetPaging()
						}}
					/>
				</Reveal>
			</aside>

			<div className="min-w-0">
				<Reveal delay={0.2}>
					<BlogToolbar
						query={query}
						onQueryChange={(v) => {
							setQuery(v)
							resetPaging()
						}}
						view={view}
						onViewChange={setView}
					/>
				</Reveal>

				<div className="mt-8">
					{visible.length === 0 ? (
						<p className="text-foreground/50 text-body py-16 text-center">
							Nenhum post encontrado com esses filtros.
						</p>
					) : view === 'grid' ? (
						<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
							<AnimatePresence mode="popLayout">
								{visible.map((post, i) => (
									<motion.div
										key={post.slug}
										{...cardMotion(i)}
									>
										<BlogCard
											post={post}
											views={views[post.slug] ?? 0}
										/>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full border-collapse text-left">
								<thead>
									<tr className="border-border border-b">
										{[
											'Título',
											'Categoria',
											'Data',
											'Views'
										].map((col) => (
											<th
												key={col}
												scope="col"
												className="text-foreground/40 py-3 pr-6 font-mono text-xs font-normal tracking-widest uppercase first:pl-4 last:pr-0"
											>
												{col}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{visible.map((post, i) => (
										<motion.tr
											key={post.slug}
											initial={{ opacity: 0 }}
											animate={{
												opacity: ready ? 1 : 0
											}}
											transition={{
												duration: 0.45,
												delay:
													introDelay +
													Math.min(i * STAGGER, 0.6)
											}}
											className="group/row border-border hover:bg-muted/50 border-b transition-colors"
										>
											<BlogRow
												post={post}
												views={views[post.slug] ?? 0}
											/>
										</motion.tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{remaining > 0 ? (
						<div className="mt-10 flex justify-center">
							<Button
								variant="outline"
								onClick={() =>
									setVisibleCount((c) => c + PAGE_SIZE)
								}
							>
								Carregar mais ({remaining})
							</Button>
						</div>
					) : visible.length > 0 ? (
						<div
							aria-hidden
							className="text-foreground/35 mt-14 flex items-center gap-4 font-mono text-xs tracking-widest uppercase"
						>
							<span className="bg-border h-px flex-1" />
							Você chegou ao fim
							<span className="bg-border h-px flex-1" />
						</div>
					) : null}
				</div>
			</div>
		</div>
	)
}
