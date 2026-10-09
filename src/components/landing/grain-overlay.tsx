import { cn } from '@/lib/utils'

/* Textura feTurbulence em data-URI (zero asset) — mesma família do grain
   do 404/error, em frequência menor (0.25 = grão graúdo). Frequência e
   opacidade calibradas contra o film grain do bymonolog.com numa página
   /grain temporária, já removida. */
const NOISE_URI = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.25" numOctaves="2"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>')`

/**
 * Film grain dinâmico sobre a página inteira (engenharia reversa do
 * bymonolog.com): layer fixo 2× o viewport com o tile de ruído, saltando
 * de posição via `grain-jump` em steps(6) — 12 trocas/s parecem estática
 * viva. `pointer-events-none` + aria-hidden: puramente decorativo.
 * Fica abaixo do loader/curtain (z-100+) para a entrada não ganhar grão.
 * Com prefers-reduced-motion o grão fica parado (textura estática).
 *
 * Intensidade: o knob é o `opacity-*` — 0.06 é sutil no tema claro;
 * o monolog usa 0.5, mas o PNG deles é bem mais esparso que o nosso ruído.
 */
export function GrainOverlay({ className }: { className?: string }) {
	return (
		<div
			aria-hidden
			className={cn(
				'pointer-events-none fixed top-[-50%] left-[-50%] z-90 h-[200vh] w-[200vw] animate-[grain-jump_0.5s_steps(6)_infinite] opacity-[0.12] will-change-transform motion-reduce:animate-none',
				className
			)}
			style={{ backgroundImage: NOISE_URI }}
		/>
	)
}
