'use client'

import { CaretDown, List, X } from '@phosphor-icons/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MENUS = [
	{
		label: 'Product',
		items: [
			{ label: 'Scout', href: '#agent-canvas' },
			{ label: 'Omnichannel', href: '#voice' },
			{ label: 'Agent Canvas', href: '#agent-canvas' },
			{ label: 'Insights', href: '#insights' },
			{ label: 'Voice Experience', href: '#voice' },
			{ label: 'Browser Agent', href: '#agent-canvas' }
		]
	},
	{
		label: 'Company',
		items: [
			{ label: 'Careers', href: '#cta' },
			{ label: 'Contact', href: '#cta' },
			{ label: 'Trust Center', href: '#cta' }
		]
	}
]

export function NavBar() {
	const [scrolled, setScrolled] = useState(false)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24)
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	return (
		<header
			className={cn(
				'fixed inset-x-0 top-0 z-50 transition-all duration-500',
				scrolled
					? 'bg-background/80 border-b backdrop-blur-md'
					: 'border-b border-transparent bg-transparent'
			)}
		>
			<nav className="max-w-section mx-auto flex h-[74px] w-full items-center justify-between px-5 min-[810px]:px-8">
				<Link
					href="/"
					className="font-heading text-lg font-semibold tracking-[0.35em] uppercase"
				>
					Giga
				</Link>

				<div className="hidden items-center gap-1 md:flex">
					{MENUS.map((menu) => (
						<div key={menu.label} className="group relative">
							<button className="text-foreground/80 hover:text-foreground flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors">
								{menu.label}
								<CaretDown className="size-3 transition-transform duration-300 group-hover:rotate-180" />
							</button>
							<div className="bg-popover/95 invisible absolute top-full left-0 min-w-48 translate-y-2 rounded-xl border p-2 opacity-0 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
								{menu.items.map((item) => (
									<Link
										key={item.label}
										href={item.href}
										className="text-foreground/80 hover:bg-muted hover:text-foreground block rounded-lg px-3 py-2 text-sm transition-colors"
									>
										{item.label}
									</Link>
								))}
							</div>
						</div>
					))}
				</div>

				<div className="hidden items-center gap-3 md:flex">
					<Link
						href="#cta"
						className="text-foreground/80 hover:text-foreground text-sm transition-colors"
					>
						Sign in
					</Link>
					<Button asChild size="sm">
						<Link href="#cta">See a demo</Link>
					</Button>
				</div>

				<button
					className="rounded-md p-2 md:hidden"
					aria-label="Toggle menu"
					onClick={() => setOpen((v) => !v)}
				>
					{open ? <List className="hidden" /> : null}
					{open ? (
						<X className="size-5" />
					) : (
						<List className="size-5" />
					)}
				</button>
			</nav>

			{open ? (
				<div className="bg-background/95 border-t px-5 py-4 backdrop-blur-md md:hidden">
					{MENUS.flatMap((m) => m.items).map((item) => (
						<Link
							key={item.label}
							href={item.href}
							onClick={() => setOpen(false)}
							className="text-foreground/80 block py-2 text-sm"
						>
							{item.label}
						</Link>
					))}
					<Button asChild className="mt-3 w-full">
						<Link href="#cta" onClick={() => setOpen(false)}>
							See a demo
						</Link>
					</Button>
				</div>
			) : null}
		</header>
	)
}
