'use client'

import { Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ *
 * ThemeToggle — collapsed it shows only the ACTIVE theme's icon. On
 * hover (or keyboard focus) the pill expands horizontally and reveals
 * both Light + Dark options to pick from. Hovering the Light option
 * spins the sun 180° on the project ease (`ease-fluid`).
 *
 * Width / opacity transitions inherit the default timing function, which
 * globals.css points at `--ease-fluid` — so the whole thing moves on the
 * project ease without spelling it out everywhere.
 * ------------------------------------------------------------------ */

const OPTIONS = [
	{ key: 'light' as const, Icon: Sun, label: 'Light' },
	{ key: 'dark' as const, Icon: Moon, label: 'Dark' }
]

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	// next-themes only knows the theme after hydration — render a stable,
	// same-sized placeholder until then to avoid a mismatch + layout shift.
	// (Sanctioned mount-guard; the sync setState is the whole point here.)
	// eslint-disable-next-line react-hooks/set-state-in-effect
	useEffect(() => setMounted(true), [])
	if (!mounted) {
		return (
			<div
				className="bg-card/80 size-11 rounded-full border shadow-sm backdrop-blur-sm"
				aria-hidden
			/>
		)
	}

	const active = resolvedTheme === 'dark' ? 'dark' : 'light'
	// Active first → it's the one visible while the pill is collapsed.
	const ordered = active === 'dark' ? [OPTIONS[1], OPTIONS[0]] : OPTIONS

	return (
		<div
			role="group"
			aria-label="Theme"
			className="group bg-card/80 ease-fluid relative inline-flex w-11 items-center gap-1 overflow-hidden rounded-full border p-1 shadow-sm backdrop-blur-sm transition-[width] duration-500 focus-within:w-[5.25rem] hover:w-[5.25rem]"
		>
			{ordered.map(({ key, Icon, label }) => {
				const isActive = key === active
				const isLight = key === 'light'
				return (
					<button
						key={key}
						type="button"
						onClick={() => setTheme(key)}
						aria-label={`${label} theme`}
						aria-pressed={isActive}
						className={cn(
							'group/opt grid size-9 shrink-0 cursor-pointer place-items-center rounded-full transition-[color,background-color,opacity] duration-300',
							isActive
								? 'text-foreground group-hover:bg-accent group-focus-within:bg-accent'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground opacity-0 group-focus-within:opacity-100 group-hover:opacity-100'
						)}
					>
						<Icon
							weight="bold"
							className={cn(
								'size-5',
								isLight &&
									'ease-fluid transition-transform duration-500 group-hover/opt:rotate-180'
							)}
						/>
					</button>
				)
			})}
		</div>
	)
}
