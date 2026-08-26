import Link from 'next/link'
import type { ComponentProps } from 'react'

import { ArrowSwapIcon } from '@/components/landing/arrow-swap-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * CTA secundário — o botão que anda ao lado do primário ("Agende uma demo"):
 * ghost sem fundo no hover, rótulo que desliza para a direita e a seta dupla
 * do `ArrowSwapIcon` trocando pela diagonal. O `group/button` que a seta
 * escuta vem do próprio `Button`.
 *
 * `className` cai no botão (que repassa ao `Link` via `asChild`); o resto das
 * props vai para o `Link` — inclusive `target`/`rel` quando o destino é
 * externo.
 */
export function ArrowCtaButton({
	className,
	children,
	...props
}: ComponentProps<typeof Link>) {
	return (
		<Button
			asChild
			size="lg"
			variant="ghost"
			className={cn(
				'gap-6 px-6 hover:bg-transparent dark:hover:bg-transparent',
				className
			)}
		>
			<Link {...props}>
				<span className="transition-transform duration-300 group-hover/button:translate-x-2">
					{children}
				</span>
				<ArrowSwapIcon />
			</Link>
		</Button>
	)
}
