import { cn } from '@/lib/utils'

/* Espiral de Fibonacci: quadrados de lado 1,1,2,3,5,8,13,21,34,55… encostados
   em espiral, com um quarto de círculo em cada um — a construção clássica,
   não uma logarítmica aproximada. Gerada por construção a partir do número
   de termos: cada arco é um quarto de volta de raio F(i) entre cantos
   opostos do quadrado, e a direção gira 90° a cada passo. O viewBox é o
   bbox exato dos quadrados (= dos pontos de chegada, já que o arco fica
   dentro do próprio quadrado), então com 10 termos sai '-24 -39 89 55' —
   89×55, os dois termos seguintes da série, daí a caixa já vir na proporção
   áurea. O olho da espiral é o centro do primeiro arco, em (1, 1).

   Só os arcos entram no desenho. Os quadrados são andaime: como retas, eles
   leem como linhas soltas atrás do conteúdo, não como espiral. */

const DIRS = [
	[1, -1],
	[1, 1],
	[-1, 1],
	[-1, -1]
] as const

const cache = new Map<number, { d: string; viewBox: string }>()

function buildSpiral(terms: number) {
	const hit = cache.get(terms)
	if (hit) return hit
	let a = 1
	let b = 1
	let x = 0
	let y = 1
	let d = `M ${x} ${y}`
	let minX = x
	let maxX = x
	let minY = y
	let maxY = y
	for (let i = 0; i < terms; i++) {
		const r = a
		const [ux, uy] = DIRS[i % 4]
		x += r * ux
		y += r * uy
		d += ` A ${r} ${r} 0 0 1 ${x} ${y}`
		minX = Math.min(minX, x)
		maxX = Math.max(maxX, x)
		minY = Math.min(minY, y)
		maxY = Math.max(maxY, y)
		;[a, b] = [b, a + b]
	}
	const built = {
		d,
		viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
	}
	cache.set(terms, built)
	return built
}

/**
 * Espiral de Fibonacci como textura de fundo. Traço em hairline de verdade
 * (`non-scaling-stroke`), então a linha não engorda junto com a escala, e
 * máscara radial para a espiral morrer antes das bordas em vez de aparecer
 * cortada.
 *
 * As cores saem do `currentColor` de quem monta — quem decide a discrição é
 * a opacidade que o pai define. `strokeWidth` é em px de tela (por causa do
 * `non-scaling-stroke`): 4 é o hairline padrão; valores grandes viram uma
 * faixa larga e difusa para texturas mais discretas. `terms` é o número de
 * quartos de volta (10 é o desenho original; mais termos = mais voltas, com
 * o miolo proporcionalmente menor).
 *
 * `capEye`: com traço largo, os arcos do miolo têm raio menor que meio traço
 * e a curva de offset interna do stroke dobra sobre si mesma — o
 * rasterizador deixa essa dobra vazia (o winding cancela) e o centro sai
 * "roído". O remendo é um ponto redondo no olho: um subpath de comprimento
 * zero com `linecap round` vira um disco em px (também non-scaling). A dobra
 * chega a ~0.6× o traço de distância do olho, então o disco tem 1.6× o traço
 * de diâmetro (raio 0.8×) — fecha o buraco e ainda fica dentro da faixa que
 * os arcos vizinhos cobrem, sem estufar o contorno.
 */
export function FibonacciSpiral({
	className,
	strokeWidth = 4,
	terms = 10,
	capEye = false
}: {
	className?: string
	strokeWidth?: number
	terms?: number
	capEye?: boolean
}) {
	const { d, viewBox } = buildSpiral(terms)
	return (
		<svg
			aria-hidden
			viewBox={viewBox}
			fill="none"
			preserveAspectRatio="xMidYMid meet"
			className={cn('pointer-events-none', className)}
		>
			<path
				d={d}
				stroke="currentColor"
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			{capEye && (
				<path
					d="M 1 1 h 0"
					stroke="currentColor"
					strokeWidth={strokeWidth * 1.6}
					strokeLinecap="round"
					vectorEffect="non-scaling-stroke"
				/>
			)}
		</svg>
	)
}
