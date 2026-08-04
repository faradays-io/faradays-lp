'use client'

import { List, MagnifyingGlass, SquaresFour } from '@phosphor-icons/react'
import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type ViewMode = 'grid' | 'list'

const MODES: readonly { value: ViewMode; label: string; icon: typeof List }[] =
	[
		{ value: 'grid', label: 'Grade', icon: SquaresFour },
		{ value: 'list', label: 'Lista', icon: List }
	]

/**
 * Toggle grid/list sem divisão interna: um "balão" único desliza para o
 * item ativo — e, no hover do outro item, se desloca até ele como preview.
 */
function ViewToggle({
	view,
	onViewChange
}: {
	view: ViewMode
	onViewChange: (value: ViewMode) => void
}) {
	const [hovered, setHovered] = useState<ViewMode | null>(null)
	const target = hovered ?? view

	return (
		<div
			role="radiogroup"
			aria-label="Modo de exibição"
			className="border-border relative flex h-11 shrink-0 items-center gap-1 rounded-md border p-1"
			onMouseLeave={() => setHovered(null)}
		>
			<span
				aria-hidden
				className={cn(
					'absolute top-1 bottom-1 left-1 w-9 rounded-[calc(var(--radius)-2px)] bg-neutral-700 transition-transform duration-300',
					target === 'list' && 'translate-x-[2.5rem]'
				)}
			/>
			{MODES.map(({ value, label, icon: Icon }) => (
				<button
					key={value}
					type="button"
					role="radio"
					aria-checked={view === value}
					aria-label={label}
					onClick={() => onViewChange(value)}
					onMouseEnter={() => setHovered(value)}
					onFocus={() => setHovered(value)}
					onBlur={() => setHovered(null)}
					className={cn(
						'relative z-10 flex size-9 cursor-pointer items-center justify-center transition-colors duration-300 outline-none',
						target === value ? 'text-white' : 'text-foreground/50'
					)}
				>
					<Icon className="size-4" />
				</button>
			))}
		</div>
	)
}

export function BlogToolbar({
	query,
	onQueryChange,
	view,
	onViewChange
}: {
	query: string
	onQueryChange: (value: string) => void
	view: ViewMode
	onViewChange: (value: ViewMode) => void
}) {
	return (
		<div className="flex items-center gap-3">
			<div className="relative flex-1">
				<MagnifyingGlass className="text-foreground/40 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
				<Input
					type="search"
					value={query}
					onChange={(e) => onQueryChange(e.target.value)}
					placeholder="Buscar posts…"
					aria-label="Buscar posts"
					className="h-11 pl-10 shadow-none"
				/>
			</div>
			<ViewToggle view={view} onViewChange={onViewChange} />
		</div>
	)
}
