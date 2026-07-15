import { AnimatedCounter } from '@/components/landing/animated-counter'
import { Reveal } from '@/components/landing/reveal'

const STATS = [
	{ label: 'Deflection rate', value: 90, suffix: '%' },
	{ label: 'Supported languages', value: 90, suffix: '' }
]

export function StatsBand() {
	return (
		<section
			id="stats"
			className="bg-background text-foreground mb-8 pt-64"
		>
			<div className="max-w-section mx-auto flex w-full flex-col items-center gap-12 px-4 py-24 text-center min-[810px]:px-6">
				<Reveal trigger="#stats" start="top bottom">
					<p className="font-heading text-h2 max-w-xl text-balance">
						Untangle your hardest support workflows with AI — live
						in production within weeks.
					</p>
				</Reveal>
				<div className="flex items-center justify-center gap-16">
					{STATS.map((stat, i) => (
						<Reveal
							key={stat.label}
							delay={i * 0.15}
							trigger="#stats"
							start="top bottom"
						>
							<div className="flex flex-col items-center gap-2">
								<span className="text-muted-foreground text-sm">
									{stat.label}
								</span>
								<AnimatedCounter
									value={stat.value}
									suffix={stat.suffix}
									start="top bottom"
									trigger="#stats"
									className="font-heading text-7xl tracking-tight"
								/>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	)
}
