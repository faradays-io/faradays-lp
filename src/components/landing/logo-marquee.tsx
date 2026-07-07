/** Fictional customer wordmarks — placeholders for the real logo strip. */
const BRANDS = [
	'Acme',
	'Borealis',
	'Cadence',
	'DeltaPay',
	'Everline',
	'Fluxon',
	'Meridian',
	'Northwind'
]

export function LogoMarquee() {
	const row = [...BRANDS, ...BRANDS]
	return (
		<div
			className="overflow-hidden"
			style={{
				maskImage:
					'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
			}}
		>
			<div className="animate-marquee flex w-max items-center gap-16 px-8">
				{row.map((brand, i) => (
					<span
						key={`${brand}-${i}`}
						className="font-heading text-foreground/50 text-lg font-semibold tracking-widest uppercase"
					>
						{brand}
					</span>
				))}
			</div>
		</div>
	)
}
