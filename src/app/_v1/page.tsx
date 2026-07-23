import { BrandsSection } from '@/components/landing/brands-section'
import { CreditTeaser } from '@/components/landing/credit-teaser'
import { CtaSection } from '@/components/landing/cta-section'
import { FeatureShowcase } from '@/components/landing/feature-showcase'
import { Footer } from '@/components/landing/footer'
import { Hero } from '@/components/landing/hero'
import { NavBar } from '@/components/landing/nav-bar'
import { ProjectJourney } from '@/components/landing/project-journey'
import { Spotlight } from '@/components/landing/spotlight'
import { StackedSections } from '@/components/landing/stacked-sections'
import { StatsBand } from '@/components/landing/stats-band'
import { VoiceSection } from '@/components/landing/voice-section'

export default function Home() {
	return (
		<>
			<NavBar />
			<main className="pt-23">
				<Hero />
				<StackedSections>
					<BrandsSection />
					<StatsBand />
				</StackedSections>

				<FeatureShowcase />
				<CreditTeaser />
				<ProjectJourney />

				<VoiceSection />
				<Spotlight />
				<CtaSection />
			</main>
			<Footer />
		</>
	)
}
