import { Magnetic } from '@/components/landing/magnetic'
import { Reveal } from '@/components/landing/reveal'

/**
 * Partner/customer logos — each PNG's alpha channel is used as a CSS mask,
 * so the shape renders in the light page color regardless of the asset's
 * original colors.
 */
const BRANDS = [
	{ name: 'Gmail', src: '/company/gmail.png' },
	{ name: 'Microsoft', src: '/company/microsoft.png' },
	{ name: 'Outlook', src: '/company/outlook.png' },
	{ name: 'Excel', src: '/company/excel.png' },
	{ name: 'Monfiza', src: '/company/monfiza.png' },
	{ name: 'Aventis', src: '/company/aventis.png' }
]

export function BrandsSection() {
	return (
		<section id="brands" className="bg-background text-foreground mt-32">
			<div className="grid w-full gap-14 px-7 pt-64 pb-64 lg:grid-cols-[2fr_3fr] lg:gap-10">
				<Reveal>
					<h2 className="font-heading text-h4 text-balance">
						Brands we&apos;ve helped
					</h2>
				</Reveal>

				<Reveal>
					<div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
						{BRANDS.map((brand) => (
							<div
								key={brand.name}
								className="flex flex-col items-center gap-8"
							>
								<Magnetic className="h-20 w-full">
									<div
										role="img"
										aria-label={brand.name}
										className="h-full w-full bg-[#f4f4f4]"
										style={{
											maskImage: `url(${brand.src})`,
											maskPosition: 'center',
											maskRepeat: 'no-repeat',
											maskSize: 'contain'
										}}
									/>
								</Magnetic>
								<span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
									{brand.name}
								</span>
							</div>
						))}
					</div>
				</Reveal>
			</div>
		</section>
	)
}
