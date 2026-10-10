import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Padrão de seção do canvas (AGENTS.md): fundo e respiro vertical na
 * `<section>`, conteúdo no wrapper `max-w-page` com a goteira. O respiro
 * padrão (7.75rem) é o `spacing-section-medium` da referência, 124px.
 */
export function SectionShell({
	id,
	className,
	innerClassName,
	children
}: {
	id?: string
	className?: string
	innerClassName?: string
	children: ReactNode
}) {
	return (
		<section id={id} className={cn('py-31', className)}>
			<div
				className={cn(
					'max-w-page mx-auto w-full px-[var(--gutter)]',
					innerClassName
				)}
			>
				{children}
			</div>
		</section>
	)
}
