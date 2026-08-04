import { cn } from '@/lib/utils'

export function CategoryBadge({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<span
			className={cn(
				'border-border text-foreground/70 inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-xs tracking-widest uppercase',
				className
			)}
		>
			{children}
		</span>
	)
}
