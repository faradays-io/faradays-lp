import { CtaSection } from '@/components/landing/cta-section'
import { FeatureTrio } from '@/components/landing/feature-trio'
import { Footer } from '@/components/landing/footer'
import { Hero } from '@/components/landing/hero'
import { NavBar } from '@/components/landing/nav-bar'
import { Spotlight } from '@/components/landing/spotlight'
import { StatsBand } from '@/components/landing/stats-band'
import { SteppedShowcase } from '@/components/landing/stepped-showcase'
import { VoiceSection } from '@/components/landing/voice-section'

export default function Home() {
	return (
		<>
			<NavBar />
			<main className="pt-[74px]">
				<Hero />
				<StatsBand />

				<FeatureTrio
					eyebrow="Custom agents"
					title="Made for complex operations"
					tone="slate"
					items={[
						{
							title: 'Deeply configurable',
							description:
								'Tune every detail to fit the way your business actually runs.'
						},
						{
							title: 'Policies from transcripts',
							description:
								'Bootstrap a working agent starting from a single conversation log.'
						},
						{
							title: 'Copilot included',
							description:
								'AI assists you while you shape your ideal support agent.'
						}
					]}
				/>

				<SteppedShowcase
					id="agent-canvas"
					title="Agent Canvas"
					description="Design, test, and operate agents in one visual workspace. It turns conversations into clarity — surfacing patterns, quantifying impact, and recommending actions that move KPIs and revenue."
					ctaLabel="Explore Agent Canvas"
					tone="violet"
					steps={[
						{
							title: 'Spin up the agent',
							description:
								'Anchor it in your brand voice, compliance rules, and existing workflows so every interaction stays on-policy.'
						},
						{
							title: 'Write the policies',
							description:
								'Describe guardrails in plain language: what gets automated, what escalates, and how sensitive cases are handled.'
						},
						{
							title: 'Shape the logic',
							description:
								'Sketch conversation flows and escalation paths, wiring in the tools and systems that ground each answer in context.'
						},
						{
							title: 'Test, then ship',
							description:
								'Run simulated edge cases and quality checks, then deploy with confidence once compliance gates pass.'
						},
						{
							title: 'Watch and refine',
							description:
								'Follow live outcomes in production and keep tightening policies with data from real conversations.'
						}
					]}
				/>

				<FeatureTrio
					eyebrow="Smart suggestions"
					title="Gets better every week"
					tone="moss"
					items={[
						{
							title: 'KPI-driven tuning',
							description:
								'Recommendations aimed straight at the metrics you own.'
						},
						{
							title: 'Context-aware ideas',
							description:
								'Grounded in how your operation really works, not generic playbooks.'
						},
						{
							title: 'One-click improvements',
							description:
								'Ready-to-apply policy updates, no rebuild required.'
						}
					]}
				/>

				<SteppedShowcase
					id="insights"
					title="Smart Insights"
					description="The agent surfaces patterns and digs into root causes, then proposes policy changes ranked by the success metrics you choose."
					ctaLabel="Explore Smart Insights"
					tone="ember"
					steps={[
						{
							title: 'Pick a target metric',
							description:
								'Resolution rate, escalation rate, customer satisfaction — decide what success means first.'
						},
						{
							title: 'Get ranked insights',
							description:
								'AI proposes prioritized changes with the projected impact attached to each one.'
						},
						{
							title: 'Prove it at scale',
							description:
								'Replay hypotheses across thousands of transcripts and calls to confirm the root cause.'
						}
					]}
				/>

				<FeatureTrio
					eyebrow="Natural voice"
					title="Conversation with empathy"
					tone="violet"
					items={[
						{
							title: 'A voice of your own',
							description:
								'Match tone and personality to your brand, per market.'
						},
						{
							title: 'Graceful interruptions',
							description:
								'Keeps up with fast, messy, real-world conversations.'
						},
						{
							title: 'Sub-second latency',
							description:
								'Responses fast enough to feel genuinely human.'
						}
					]}
				/>

				<VoiceSection />
				<Spotlight />
				<CtaSection />
			</main>
			<Footer />
		</>
	)
}
