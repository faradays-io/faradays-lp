'use client'

import { CaretDown, Check, SortAscending } from '@phosphor-icons/react'
import { Select } from 'radix-ui'

import {
	BLOG_CATEGORIES,
	BLOG_PRODUCTS,
	type BlogCategory,
	type BlogProduct
} from '@/components/blog/blog-data'
import { cn } from '@/lib/utils'

export type SortKey = 'date' | 'title' | 'views'
export type SortDir = 'asc' | 'desc'
export type SortState = { key: SortKey; dir: SortDir }

/* Cada opção do select carrega chave+direção — 'date-desc' etc. — para o
   usuário escolher sort e direção num gesto só. */
const SORT_OPTIONS: readonly {
	value: `${SortKey}-${SortDir}`
	label: string
}[] = [
	{ value: 'date-desc', label: 'Mais recentes' },
	{ value: 'date-asc', label: 'Mais antigos' },
	{ value: 'views-desc', label: 'Mais vistos' },
	{ value: 'title-asc', label: 'Título A–Z' },
	{ value: 'title-desc', label: 'Título Z–A' }
]

/* Controles do painel: menor que a base, weight medium. */
const CONTROL_TEXT = 'text-sm font-medium'

function FilterGroup({
	label,
	children
}: {
	label: string
	children: React.ReactNode
}) {
	return (
		<div className="space-y-3">
			<p className="text-foreground/40 font-mono text-xs tracking-widest uppercase">
				{label}
			</p>
			<div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
				{children}
			</div>
		</div>
	)
}

function FilterChip({
	active,
	onClick,
	children
}: {
	active: boolean
	onClick: () => void
	children: React.ReactNode
}) {
	return (
		<button
			type="button"
			aria-pressed={active}
			onClick={onClick}
			className={cn(
				CONTROL_TEXT,
				'cursor-pointer rounded-md border px-2.5 py-1.5 transition-colors',
				active
					? 'border-neutral-700 bg-neutral-700 text-white'
					: 'border-border text-foreground/60 hover:border-foreground/40 hover:text-foreground'
			)}
		>
			{children}
		</button>
	)
}

export function BlogFilters({
	category,
	onCategoryChange,
	product,
	onProductChange,
	featuredOnly,
	onFeaturedChange,
	sort,
	onSortChange
}: {
	category: BlogCategory | null
	onCategoryChange: (value: BlogCategory | null) => void
	product: BlogProduct | null
	onProductChange: (value: BlogProduct | null) => void
	featuredOnly: boolean
	onFeaturedChange: (value: boolean) => void
	sort: SortState
	onSortChange: (value: SortState) => void
}) {
	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<p className="text-foreground/40 font-mono text-xs tracking-widest uppercase">
					Ordenar por
				</p>
				<Select.Root
					value={`${sort.key}-${sort.dir}`}
					onValueChange={(value) => {
						const [key, dir] = value.split('-') as [
							SortKey,
							SortDir
						]
						onSortChange({ key, dir })
					}}
				>
					<Select.Trigger
						aria-label="Ordenar por"
						className={cn(
							CONTROL_TEXT,
							'border-border bg-background hover:bg-muted flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-2 transition-colors outline-none',
							'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3'
						)}
					>
						<span className="inline-flex items-center gap-2">
							<SortAscending className="size-4" />
							<Select.Value />
						</span>
						<Select.Icon>
							<CaretDown className="size-3.5" />
						</Select.Icon>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content
							position="popper"
							sideOffset={6}
							className="border-border bg-card z-50 w-[var(--radix-select-trigger-width)] rounded-xl border p-1.5 shadow-lg"
						>
							<Select.Viewport>
								{SORT_OPTIONS.map((option) => (
									<Select.Item
										key={option.value}
										value={option.value}
										className={cn(
											CONTROL_TEXT,
											'data-highlighted:bg-muted flex cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-2 outline-none'
										)}
									>
										<Select.ItemText>
											{option.label}
										</Select.ItemText>
										<Select.ItemIndicator>
											<Check className="text-brand size-3.5" />
										</Select.ItemIndicator>
									</Select.Item>
								))}
							</Select.Viewport>
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			</div>

			<FilterGroup label="Categoria">
				<FilterChip
					active={category === null}
					onClick={() => onCategoryChange(null)}
				>
					Todas
				</FilterChip>
				{BLOG_CATEGORIES.map((c) => (
					<FilterChip
						key={c}
						active={category === c}
						onClick={() =>
							onCategoryChange(category === c ? null : c)
						}
					>
						{c}
					</FilterChip>
				))}
			</FilterGroup>

			<FilterGroup label="Produto">
				<FilterChip
					active={product === null}
					onClick={() => onProductChange(null)}
				>
					Todos
				</FilterChip>
				{BLOG_PRODUCTS.map((p) => (
					<FilterChip
						key={p}
						active={product === p}
						onClick={() =>
							onProductChange(product === p ? null : p)
						}
					>
						{p}
					</FilterChip>
				))}
			</FilterGroup>

			<FilterGroup label="Destaques">
				<FilterChip
					active={featuredOnly}
					onClick={() => onFeaturedChange(!featuredOnly)}
				>
					Só destaques
				</FilterChip>
			</FilterGroup>
		</div>
	)
}
