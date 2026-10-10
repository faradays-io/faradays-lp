import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

const VARIANTS = {
	/* O CTA da página — a única cor de acento, como o âmbar da referência. */
	brand: 'h-14 gap-8 px-6 bg-brand text-brand-foreground hover:bg-brand/90',
	/* Secundário claro: contorno fino sobre o fundo. */
	outline:
		'h-12 gap-6 px-5 border border-border bg-background text-foreground hover:bg-muted',
	/* Sobre foto escura (billboard de case). */
	glass: 'h-14 gap-8 px-6 bg-black/35 text-white backdrop-blur-md hover:bg-black/50'
} as const

/**
 * Botão-link da home institucional: rótulo em caixa alta pequena e a seta
 * que anda no hover. Destino externo (http) abre em nova aba.
 */
export function CtaLink({
	href,
	variant = 'brand',
	className,
	children
}: {
	href: string
	variant?: keyof typeof VARIANTS
	className?: string
	children: ReactNode
}) {
	const external = href.startsWith('http')
	const classes = cn(
		'group/cta font-heading inline-flex shrink-0 items-center justify-between rounded-lg text-sm tracking-[0.02em] uppercase transition-colors',
		VARIANTS[variant],
		className
	)
	const content = (
		<>
			<span>{children}</span>
			<ArrowRight
				aria-hidden
				weight="bold"
				className={cn(
					'size-4 transition-transform duration-300 group-hover/cta:translate-x-1',
					variant === 'glass' && 'text-[#5aa2ff]'
				)}
			/>
		</>
	)
	if (external)
		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={classes}
			>
				{content}
			</a>
		)
	return (
		<Link href={href} className={classes}>
			{content}
		</Link>
	)
}
