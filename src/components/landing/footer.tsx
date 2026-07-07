import { LinkedinLogo, SealCheck, XLogo } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

const BADGES = [
	{
		name: 'SOC 2 Type II (AICPA)',
		description:
			'Independent audit of security, availability, and confidentiality controls.'
	},
	{
		name: 'ISO 42001',
		description:
			'Management-system standard for responsible AI development and governance.'
	},
	{
		name: 'ISO 27001',
		description:
			'Global benchmark for information security and data protection.'
	}
]

const COLUMNS = [
	{
		title: 'Product',
		links: [
			'Scout',
			'Omnichannel',
			'Agent Canvas',
			'Insights',
			'Voice Experience',
			'Browser Agent'
		]
	},
	{
		title: 'Company',
		links: ['Careers', 'Contact', 'Trust Center']
	},
	{
		title: 'Resources',
		links: ['News', 'Privacy Policy', 'Cookie Policy', 'Terms of Service']
	}
]

export function Footer() {
	return (
		<footer className="bg-background text-foreground border-t">
			<div className="max-w-section mx-auto flex w-full flex-col gap-16 px-5 py-16 min-[810px]:px-8">
				<div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
					<div className="flex flex-col gap-6">
						<Link
							href="/"
							className="font-heading text-lg font-semibold tracking-[0.35em] uppercase"
						>
							Giga
						</Link>
						<span className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
							Compliant
						</span>
						<div className="flex flex-col gap-4">
							{BADGES.map((badge) => (
								<div
									key={badge.name}
									className="flex items-start gap-3"
								>
									<SealCheck
										className="text-muted-foreground mt-0.5 size-5 shrink-0"
										weight="duotone"
									/>
									<div>
										<p className="text-sm font-medium">
											{badge.name}
										</p>
										<p className="text-muted-foreground text-sm">
											{badge.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-8 min-[810px]:grid-cols-3">
						{COLUMNS.map((column) => (
							<div key={column.title}>
								<p className="text-sm font-medium">
									{column.title}
								</p>
								<ul className="mt-4 flex flex-col gap-2.5">
									{column.links.map((label) => (
										<li key={label}>
											<Link
												href="#"
												className="text-muted-foreground hover:text-foreground text-sm transition-colors"
											>
												{label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-4 border-t pt-8 min-[810px]:flex-row min-[810px]:items-center min-[810px]:justify-between">
					<p className="text-muted-foreground text-sm">
						© 2026 — estudo de layout inspirado em giga.ai; conteúdo
						placeholder.
					</p>
					<div className="flex items-center gap-4">
						<Link
							href="#"
							aria-label="X"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							<XLogo className="size-5" />
						</Link>
						<Link
							href="#"
							aria-label="LinkedIn"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							<LinkedinLogo className="size-5" />
						</Link>
					</div>
				</div>

				<p
					aria-hidden
					className="font-heading text-foreground/5 pointer-events-none -mb-6 text-center text-[22vw] leading-[0.8] font-semibold tracking-tight select-none"
				>
					Giga
				</p>
			</div>
		</footer>
	)
}
