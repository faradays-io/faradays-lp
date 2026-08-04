import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'

import { cn } from '@/lib/utils'

/**
 * Seta dupla para CTAs: mira o canto superior direito e, no hover do grupo
 * pai (`group/button`, presente no Button; adicione a classe em links soltos),
 * a seta sai pela diagonal e uma nova entra por baixo.
 */
export function ArrowSwapIcon({ className }: { className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				'relative inline-flex size-4 shrink-0 overflow-hidden',
				className
			)}
		>
			<ArrowUpRight
				weight="bold"
				className="size-4 transition-transform duration-300 group-hover/button:translate-x-[150%] group-hover/button:-translate-y-[150%]"
			/>
			<ArrowUpRight
				weight="bold"
				className="absolute inset-0 size-4 -translate-x-[150%] translate-y-[150%] transition-transform duration-300 group-hover/button:translate-x-0 group-hover/button:translate-y-0"
			/>
		</span>
	)
}
