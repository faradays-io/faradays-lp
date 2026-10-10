'use client'

import { Reveal } from '@/components/landing/reveal'
import { useCopy } from '@/components/language-provider'

import { LOGOS_COPY } from './copy'
import { SectionShell } from './section-shell'

/* Logos reais com alpha (a máscara pinta a forma em cinza, como na
   `PartnersSection`). O resto da grade é PLACEHOLDER até chegarem os
   arquivos dos clientes — 9 células fecham as 3 linhas. */
const LOGOS: readonly ({ name: string; src: string } | null)[] = [
	{ name: 'Monfiza', src: '/company/monfiza.png' },
	{ name: 'Aventis', src: '/company/aventis.png' },
	null,
	null,
	null,
	null,
	null,
	null,
	null
]

/**
 * Grade de logos da referência: título serif centralizado e três colunas
 * separadas por fios, uma marca apagada por célula.
 */
export function LogoWall() {
	const t = useCopy(LOGOS_COPY)
	return (
		<SectionShell id="clientes">
			<Reveal>
				<h2 className="text-serif-lg mx-auto max-w-[24ch] text-center font-serif font-light">
					{t.title}
				</h2>
			</Reveal>
			<Reveal delay={0.1} className="mx-auto mt-20 max-w-[72rem]">
				<ul className="border-border grid grid-cols-2 border-t border-l md:grid-cols-3">
					{LOGOS.map((logo, i) => (
						<li
							key={logo?.name ?? i}
							className="border-border flex h-36 items-center justify-center border-r border-b md:h-52"
						>
							{logo ? (
								<span
									role="img"
									aria-label={logo.name}
									className="bg-foreground/45 block h-10 w-36"
									style={{
										maskImage: `url(${logo.src})`,
										WebkitMaskImage: `url(${logo.src})`,
										maskSize: 'contain',
										WebkitMaskSize: 'contain',
										maskRepeat: 'no-repeat',
										WebkitMaskRepeat: 'no-repeat',
										maskPosition: 'center',
										WebkitMaskPosition: 'center'
									}}
								/>
							) : (
								<span className="text-foreground/25 font-mono text-sm tracking-widest uppercase">
									{t.logo}
								</span>
							)}
						</li>
					))}
				</ul>
			</Reveal>
		</SectionShell>
	)
}
