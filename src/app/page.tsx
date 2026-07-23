import type { Metadata } from 'next'

import { FeaturesSection } from '@/components/landing/features-section'
import { HomeCta } from '@/components/landing/home-cta'
import { HomeFooter } from '@/components/landing/home-footer'
import { HomeHero } from '@/components/landing/home-hero'
import { NavBar } from '@/components/landing/nav-bar'
import { PageTransition } from '@/components/landing/page-transition'
import { PartnersSection } from '@/components/landing/partners-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'

export const metadata: Metadata = {
	title: 'Faradays',
	description: 'Inteligência artificial aplicada à sua operação.'
}

export default function HomePage() {
	return (
		<div className="light light-home bg-background text-foreground min-h-svh">
			<PageTransition />
			<NavBar />
			<main className="pt-23">
				<HomeHero />
				<FeaturesSection />
				<PartnersSection />
				<TestimonialsSection />
				<HomeCta />
			</main>
			<HomeFooter />
		</div>
	)
}
