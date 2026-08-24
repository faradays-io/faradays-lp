import { MoreFeatures } from '@/components/landing/more-features'

/* A lista de features em destaque virou a primeira subseção e mora no
   HeroFeatureFlow (demo pinada + textos); aqui fica o fecho. O manifesto
   FeatureFigures saiu de cena e aguarda em drafts/feature-figures.tsx. */
export function FeaturesSection() {
	return (
		<section className="bg-background text-foreground">
			{/* Grade "e mais" fecha a seção: o produto inteiro em resumo. */}
			<MoreFeatures />
		</section>
	)
}
