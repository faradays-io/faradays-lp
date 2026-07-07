import { MockImage, type MockImageTone } from '@/components/landing/mock-image'
import { Reveal } from '@/components/landing/reveal'

export type TrioItem = {
	title: string
	description: string
}

/** Eyebrow + heading + three feature cards — the recurring intro pattern. */
export function FeatureTrio({
	eyebrow,
	title,
	items,
	tone = 'slate'
}: {
	eyebrow: string
	title: string
	items: TrioItem[]
	tone?: MockImageTone
}) {
	return (
		<section className="bg-background text-foreground">
			<div className="max-w-section mx-auto w-full px-5 py-24 min-[810px]:px-8">
				<Reveal>
					<span className="text-muted-foreground font-mono text-sm tracking-wide uppercase">
						{eyebrow}
					</span>
					<h2 className="font-heading text-h1 mt-3 text-balance">
						{title}
					</h2>
				</Reveal>
				<div className="mt-14 grid gap-6 min-[810px]:grid-cols-3">
					{items.map((item, i) => (
						<Reveal key={item.title} delay={i * 0.12}>
							<div className="bg-card/40 flex h-full flex-col gap-5 rounded-3xl border p-6">
								<MockImage
									label={item.title}
									tone={tone}
									className="aspect-[4/3]"
								/>
								<div>
									<h3 className="font-heading text-h4">
										{item.title}
									</h3>
									<p className="text-body-sm text-muted-foreground mt-2">
										{item.description}
									</p>
								</div>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	)
}
