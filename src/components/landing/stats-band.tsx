import { AnimatedCounter } from '@/components/landing/animated-counter'
import { Reveal } from '@/components/landing/reveal'

const STATS = [
	{ label: 'Deflection rate', value: 90, suffix: '%' },
	{ label: 'Supported languages', value: 90, suffix: '' }
]

export function StatsBand() {
	return (
		<section className="text-foreground mb-16">
			<div className="max-w-section mx-auto grid w-full gap-12 px-5 py-24 min-[810px]:grid-cols-2 min-[810px]:px-8">
				<Reveal>
					<p className="font-heading text-h2 max-w-xl text-balance">
						Untangle your hardest support workflows with AI — live
						in production within weeks.
					</p>
				</Reveal>
				<div className="flex items-start gap-16">
					{STATS.map((stat, i) => (
						<Reveal key={stat.label} delay={i * 0.15}>
							<div className="flex flex-col gap-2">
								<span className="text-muted-foreground text-sm">
									{stat.label}
								</span>
								<AnimatedCounter
									value={stat.value}
									suffix={stat.suffix}
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
