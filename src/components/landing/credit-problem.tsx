import { GlowCard } from '@/components/landing/glow-card'
import { Reveal } from '@/components/landing/reveal'

const BLIND_SPOTS = [
	{
		tag: 'Inferência de rejeitados',
		title: 'Quem você recusa, você deixa de conhecer',
		description:
			'Cada negação elimina a chance de aprender sobre um segmento inteiro de potenciais clientes. O ponto cego perpetua vieses — e esconde nichos lucrativos que a concorrência também não enxerga.'
	},
	{
		tag: 'Ciclos de retroalimentação',
		title: 'A decisão de hoje contamina o dado de amanhã',
		description:
			'Grupos que recebem menos crédito passam a parecer mais arriscados nos dados, o que reforça a exclusão — e aumenta a exposição regulatória e de imagem a cada ciclo.'
	},
	{
		tag: 'Dados restritos',
		title: 'Birô e cadastro não contam a história toda',
		description:
			'Modelos presos a variáveis transacionais ignoram fontes heterogêneas e o conhecimento prévio dos modelos de fundação — e ficam frágeis quando a distribuição do mercado muda.'
	}
]

export function CreditProblem() {
	return (
		<section id="problema" className="bg-background text-foreground py-40">
			<Reveal className="px-7">
				<span className="text-muted-foreground font-mono text-sm tracking-wide uppercase">
					(o problema)
				</span>
				<h2 className="font-heading text-h1 mt-3 max-w-3xl text-balance">
					A previsão estática nasce com três pontos cegos
				</h2>
			</Reveal>

			<div className="mt-16 grid gap-6 px-7 min-[810px]:grid-cols-3">
				{BLIND_SPOTS.map((spot, i) => (
					<Reveal key={spot.tag} delay={i * 0.1} className="h-full">
						<GlowCard className="h-full">
							<div className="flex h-full flex-col gap-4 p-7">
								<span className="text-muted-foreground font-mono text-xs font-bold tracking-wide uppercase">
									{spot.tag}
								</span>
								<h3 className="font-heading text-h4">
									{spot.title}
								</h3>
								<p className="text-foreground/70 text-body-sm">
									{spot.description}
								</p>
							</div>
						</GlowCard>
					</Reveal>
				))}
			</div>
		</section>
	)
}
