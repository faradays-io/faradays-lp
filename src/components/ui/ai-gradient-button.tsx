import { Slot } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * CTA com a fita de IA girando na borda (receita do RainbowButton do
 * magic-ui, com o gradiente da identidade daqui em vez do arco-íris).
 *
 * Duas camadas de background: o miolo na tinta do tema, recortado no
 * padding-box, e a fita (`--ai-ribbon`, a mesma do `.ai-shimmer`) recortada
 * no border-box. Como a borda de 1,5px é transparente, é a fita que aparece
 * nela — um contorno inteiro em gradiente, girando. Mais um brilho no
 * `::before`: a mesma fita, desfocada, escapando por baixo.
 *
 * As camadas de miolo usam `var(--primary)`, não hex fixo — assim o botão
 * acompanha o tema (claro e escuro) sem variante `dark:`. Tipografia, raio,
 * altura e o `group/button` são os do `Button` do site (mono maiúsculo,
 * `rounded-md`, h-10): o CTA continua o mesmo, aceso.
 *
 * `--speed` afina a volta da fita por instância (padrão 2s, no `@theme`).
 * `asChild` porque os CTAs da LP são links — o Slot passa as classes para o
 * `<Link>`, que segue sendo o elemento navegável.
 */
function AiGradientButton({
	className,
	asChild = false,
	...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
	const Comp = asChild ? Slot.Root : 'button'

	return (
		<Comp
			data-slot="ai-gradient-button"
			className={cn(
				'group/button animate-ai-sweep text-primary-foreground focus-visible:ring-ring/50 relative inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[length:200%] [background-clip:padding-box,border-box] [background-origin:border-box] px-6 font-mono text-sm font-medium tracking-wide whitespace-nowrap uppercase transition-all outline-none select-none [border:1.5px_solid_transparent] focus-visible:ring-3 active:translate-y-px disabled:pointer-events-none disabled:opacity-50',
				// miolo (recortado no padding-box) + fita de IA no anel da
				// borda, que fica transparente só para revelá-la
				'bg-[image:linear-gradient(var(--primary),var(--primary)),var(--ai-ribbon)]',
				// sem movimento: a fita fica parada, o degradê continua lá
				'motion-reduce:animate-none motion-reduce:before:animate-none',
				// brilho desfocado por baixo, na mesma fita e no mesmo giro
				'before:animate-ai-sweep before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:bg-[image:var(--ai-ribbon)] before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]',
				className
			)}
			{...props}
		/>
	)
}

export { AiGradientButton }
