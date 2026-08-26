'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import {
	DEFAULT_SETTINGS,
	type Mark3dSettings
} from '@/components/teste/hero-mark-3d'
import { cn } from '@/lib/utils'

// Só no cliente: three/R3F não têm o que fazer no SSR.
const HeroMark3d = dynamic(
	() => import('@/components/teste/hero-mark-3d').then((m) => m.HeroMark3d),
	{ ssr: false }
)

type NumKey = {
	[K in keyof Mark3dSettings]: Mark3dSettings[K] extends number ? K : never
}[keyof Mark3dSettings]
type ColorKey = 'inkColor' | 'sideColor' | 'hoverColor'

const SLIDERS: {
	key: NumKey
	label: string
	min: number
	max: number
	step: number
}[] = [
	{ key: 'depth', label: 'espessura', min: 4, max: 60, step: 1 },
	{ key: 'bevel', label: 'chanfro', min: 0, max: 4, step: 0.1 },
	{ key: 'azimuth', label: 'azimute', min: -60, max: 60, step: 1 },
	{ key: 'elevation', label: 'elevação', min: -20, max: 60, step: 1 },
	{ key: 'fov', label: 'fov', min: 8, max: 50, step: 1 },
	{ key: 'tilt', label: 'inclinação (mouse)', min: 0, max: 0.6, step: 0.01 },
	{ key: 'parallax', label: 'parallax (mouse)', min: 0, max: 3, step: 0.05 }
]
const COLORS: { key: ColorKey; label: string }[] = [
	{ key: 'inkColor', label: 'tampa' },
	{ key: 'sideColor', label: 'lateral' },
	{ key: 'hoverColor', label: 'tampa no hover' }
]

/** Laboratório do protótipo: a cena + controles para calibrar ao vivo. */
export function Mark3dLab({ className }: { className?: string }) {
	const [settings, setSettings] = useState<Mark3dSettings>(DEFAULT_SETTINGS)
	const set = <K extends keyof Mark3dSettings>(
		key: K,
		value: Mark3dSettings[K]
	) => setSettings((s) => ({ ...s, [key]: value }))

	return (
		<div className={cn('flex flex-col gap-10', className)}>
			<HeroMark3d
				settings={settings}
				className="h-[70svh] min-h-[28rem] w-full"
			/>

			<div className="border-border/60 grid gap-6 border-t pt-8 md:grid-cols-2 lg:grid-cols-4">
				{SLIDERS.map((s) => (
					<label key={s.key} className="flex flex-col gap-2">
						<span className="text-foreground/60 flex justify-between font-mono text-xs tracking-widest uppercase">
							{s.label}
							<span className="text-foreground tabular-nums">
								{settings[s.key]}
							</span>
						</span>
						<input
							type="range"
							min={s.min}
							max={s.max}
							step={s.step}
							value={settings[s.key]}
							onChange={(e) => set(s.key, Number(e.target.value))}
							className="accent-brand"
						/>
					</label>
				))}
				{COLORS.map((c) => (
					<label key={c.key} className="flex items-center gap-3">
						<input
							type="color"
							value={settings[c.key]}
							onChange={(e) => set(c.key, e.target.value)}
							className="size-8 cursor-pointer rounded border bg-transparent"
						/>
						<span className="text-foreground/60 font-mono text-xs tracking-widest uppercase">
							{c.label}{' '}
							<span className="text-foreground">
								{settings[c.key]}
							</span>
						</span>
					</label>
				))}
				<label className="flex items-center gap-3">
					<input
						type="checkbox"
						checked={settings.figures}
						onChange={(e) => set('figures', e.target.checked)}
						className="accent-brand size-4"
					/>
					<span className="text-foreground/60 font-mono text-xs tracking-widest uppercase">
						figuras ao redor
					</span>
				</label>
				<button
					type="button"
					onClick={() => setSettings(DEFAULT_SETTINGS)}
					className="text-foreground/60 hover:text-foreground w-fit font-mono text-xs tracking-widest uppercase underline-offset-4 hover:underline"
				>
					resetar
				</button>
			</div>
		</div>
	)
}
