import { cn } from '@/lib/utils'

/* Espiral de Fibonacci: quadrados de lado 1,1,2,3,5,8,13,21,34,55 encostados
   em espiral, com um quarto de círculo em cada um — a construção clássica,
   não uma logarítmica aproximada. O viewBox é o bbox exato dos quadrados,
   89×55: os dois termos seguintes da série, daí a caixa já sair na proporção
   áurea. Geometria gerada por construção; se for mexer, gere de novo em vez
   de editar número a número.

   Só os arcos entram no desenho. Os quadrados são andaime: como retas, eles
   leem como linhas soltas atrás do conteúdo, não como espiral. */

const VIEW_BOX = '-24 -39 89 55'

const SPIRAL =
	'M 0 1 A 1 1 0 0 1 1 0 A 1 1 0 0 1 2 1 A 2 2 0 0 1 0 3 A 3 3 0 0 1 -3 0 ' +
	'A 5 5 0 0 1 2 -5 A 8 8 0 0 1 10 3 A 13 13 0 0 1 -3 16 A 21 21 0 0 1 -24 -5 ' +
	'A 34 34 0 0 1 10 -39 A 55 55 0 0 1 65 16'

/**
 * Espiral de Fibonacci como textura de fundo. Traço em hairline de verdade
 * (`non-scaling-stroke`), então a linha não engorda junto com a escala, e
 * máscara radial para a espiral morrer antes das bordas em vez de aparecer
 * cortada.
 *
 * As cores saem do `currentColor` de quem monta — quem decide a discrição é
 * a opacidade que o pai define.
 */
export function FibonacciSpiral({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden
			viewBox={VIEW_BOX}
			fill="none"
			preserveAspectRatio="xMidYMid meet"
			className={cn('pointer-events-none', className)}
		>
			<path
				d={SPIRAL}
				stroke="currentColor"
				strokeWidth={4}
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
