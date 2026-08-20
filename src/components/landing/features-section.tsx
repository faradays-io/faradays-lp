import { FeatureFigures } from '@/components/landing/feature-figures'
import { HowItWorks } from '@/components/landing/how-it-works'
import { MoreFeatures } from '@/components/landing/more-features'

/* A lista de features em destaque virou a primeira subseção e mora no
   HeroFeatureFlow (demo pinada + textos); aqui ficam as demais. */
export function FeaturesSection() {
	return (
		<section className="bg-background text-foreground">
			{/* Subseção 1: manifesto + figuras lo-fi. */}
			<FeatureFigures />

			{/* Subseção 2: how it works — grafo de sistemas + showcase. */}
			<HowItWorks />

			{/* Grade "e mais" fecha a seção: o produto inteiro em resumo. */}
			<MoreFeatures />
		</section>
	)
}
