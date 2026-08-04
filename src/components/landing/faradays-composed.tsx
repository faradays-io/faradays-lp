import { FaradaysMark } from '@/components/landing/faradays-lockup'
import { FaradaysWordmark } from '@/components/landing/faradays-wordmark'
import { cn } from '@/lib/utils'

/**
 * Lockup composto: marca (setas) + wordmark de letras individuais
 * (`g.wm-letter`), nas proporções do FaradaysLockup original (viewBox 124 de
 * altura, marca com 87, ~13 de gap). O caller PRECISA dar altura explícita
 * ao container (ex. `h-8 md:h-10`) — a marca e o espaçador escalam por
 * porcentagem/aspect-ratio a partir dela. Usado pelo HomeLoader para animar
 * letra a letra sem tocar nos transforms posicionais do SVG.
 */
export function FaradaysComposed({ className }: { className?: string }) {
	return (
		<div
			data-faradays-logo
			className={cn('flex w-fit items-center', className)}
		>
			{/* No lockup original a marca começa em y=12 de 124 — centralizada
			   ela cairia em y=18.5, por isso o ajuste de -7.35% (da própria
			   altura) para alinhar com o topo do 'f'. A utility translate do
			   v4 usa a propriedade `translate`, então não briga com o
			   transform que o HomeLoader anima. */}
			<FaradaysMark className="h-[70.2%] w-auto -translate-y-[7.35%]" />
			<div aria-hidden className="aspect-[13/124] h-full" />
			<FaradaysWordmark className="h-full w-auto" tracking="normal" />
		</div>
	)
}
