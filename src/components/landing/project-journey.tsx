import { MockImage, type MockImageTone } from '@/components/landing/mock-image'
import { Reveal } from '@/components/landing/reveal'

const STEPS: Array<{
	title: string
	description: string
	tone: MockImageTone
}> = [
	{
		title: 'We map your operation',
		description:
			'We dig deep into your workflows, transcripts, and KPIs, surface what should be automated first, and shape it into a clear agent strategy that connects in seconds.',
		tone: 'slate'
	},
	{
		title: 'We shape your agent',
		description:
			'With the strategy locked, we design policies, guardrails, and a brand voice in one visual workspace — grounded in your real conversations, on-policy from day one.',
		tone: 'violet'
	},
	{
		title: 'We ship and refine',
		description:
			'Live in production within weeks. Every conversation feeds insights that keep tightening policies and moving the metrics you own.',
		tone: 'ember'
	}
]

export function ProjectJourney() {
	return (
		<section id="journey" className="bg-background text-foreground py-40">
			<Reveal>
				<h2 className="font-heading px-7 text-center text-[11vw] leading-[0.85] tracking-tight text-nowrap uppercase">
					Project Journey
				</h2>
			</Reveal>

			<div className="mt-20 flex flex-col">
				{STEPS.map((step, i) => (
					<Reveal key={step.title}>
						<div className="grid gap-10 border-t px-7 py-16 lg:grid-cols-2 lg:gap-14">
							<div className="flex flex-col gap-8 min-[810px]:flex-row min-[810px]:gap-28">
								<span className="text-foreground/90 font-mono text-xs font-bold tracking-wide uppercase min-[810px]:shrink-0">
									Step • {String(i + 1).padStart(2, '0')}
								</span>
								<div>
									<h3 className="font-heading text-h2">
										{step.title}
									</h3>
									<p className="text-foreground/70 mt-5 max-w-md">
										{step.description}
									</p>
								</div>
							</div>

							<MockImage
								label={step.title}
								tone={step.tone}
								className="aspect-video w-full rounded-3xl"
							/>
						</div>
					</Reveal>
				))}
			</div>
		</section>
	)
}
