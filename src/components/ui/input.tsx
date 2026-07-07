import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				'border-border bg-background flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-sm shadow-xs transition-colors outline-none',
				'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
				'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
				'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
				'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
				'dark:bg-input/30',
				className
			)}
			{...props}
		/>
	)
}

export { Input }
