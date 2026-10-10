import {
	ImageSquare,
	Sparkle,
	VideoCamera
} from '@phosphor-icons/react/dist/ssr'

import { cn } from '@/lib/utils'

const ICONS = { photo: ImageSquare, video: VideoCamera, animation: Sparkle }

/**
 * Espaço reservado para foto, vídeo ou animação que ainda não existe —
 * guarda o enquadramento e diz o que vai ali. `tone="dark"` para os
 * billboards (o texto branco por cima precisa de fundo escuro).
 *
 * O slot preenche o pai: quem decide proporção e raio é quem o usa.
 */
export function MediaSlot({
	label,
	kind = 'photo',
	tone = 'light',
	className
}: {
	label: string
	kind?: keyof typeof ICONS
	tone?: 'light' | 'dark'
	className?: string
}) {
	const Icon = ICONS[kind]
	return (
		<div
			className={cn(
				'relative flex size-full items-center justify-center overflow-hidden',
				tone === 'light'
					? 'bg-[#e8e8e6] text-black/40'
					: 'bg-neutral-800 text-white/40',
				className
			)}
		>
			<div
				aria-hidden
				className="absolute inset-0"
				style={{
					backgroundImage:
						'repeating-linear-gradient(135deg, transparent 0 14px, color-mix(in oklch, currentColor 14%, transparent) 14px 15px)'
				}}
			/>
			<div className="relative flex flex-col items-center gap-2 p-6 text-center">
				<Icon className="size-6" weight="duotone" />
				<span className="font-mono text-xs tracking-wide uppercase">
					{label}
				</span>
			</div>
		</div>
	)
}
