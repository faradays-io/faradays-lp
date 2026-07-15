import Link from 'next/link'

import { Reveal } from '@/components/landing/reveal'
import { Button } from '@/components/ui/button'

const LEVELS = [
	{
		level: 'Nível 1',
		title: 'Benchmarking estático',
		description:
			'O TFM iguala ou supera os modelos da casa — XGBoost, LightGBM — em janelas estacionárias dos seus dados históricos.'
	},
	{
		level: 'Nível 2',
		title: 'Resiliência ao deslocamento',
		description:
			'Testado em janelas futuras, o modelo degrada visivelmente menos que os baselines quando a distribuição muda.'
	},
	{
		level: 'Nível 3',
		title: 'Adaptação de contexto',
		description:
			'Com um pequeno lote de dados novos, as inferências se ajustam em tempo de execução — sem retreinar, sem atualizar pesos.'
	}
]

const GUARDRAILS = [
	{
		tag: 'Vazamento temporal',
		text: 'Tolerância zero: separação estrita entre passado (contexto) e futuro (teste), simulando o cenário real de decisão.'
	},
	{
		tag: 'Autonomia',
		text: 'Nesta fase o sistema não decide sozinho — entrega evidências e métricas para o seu time de risco validar.'
	},
	{
		tag: 'Privacidade',
		text: 'Ambiente isolado com dados públicos ou anonimizados, desenhado para migrar depois à sua infraestrutura.'
	}
]

export function CreditPoc() {
	return (
		<section id="poc" className="bg-[#d1d1c4] text-neutral-950">
			<div className="max-w-section mx-auto w-full px-4 py-40 min-[810px]:px-6">
				<Reveal>
					<span className="font-mono text-sm tracking-wide text-neutral-500 uppercase">
						(comece em 6 meses)
					</span>
					<h2 className="font-heading text-h1 mt-3 max-w-3xl text-balance">
						Uma prova de conceito com régua explícita
					</h2>
					<p className="text-body-lg mt-5 max-w-2xl text-neutral-600">
						Antes de qualquer compromisso longo: 6 meses medindo
						modelos fundacionais contra os baselines da casa, em
						dados históricos reais — com três níveis de sucesso
						definidos de antemão.
					</p>
				</Reveal>

				<div className="mt-14 grid gap-6 min-[810px]:grid-cols-3">
					{LEVELS.map((level, i) => (
						<Reveal key={level.level} delay={i * 0.12}>
							<div className="flex h-full flex-col gap-3 rounded-3xl border border-neutral-950/15 p-7">
								<span className="font-mono text-xs font-bold tracking-widest text-neutral-500 uppercase">
									{level.level}
								</span>
								<h3 className="font-heading text-h4">
									{level.title}
								</h3>
								<p className="text-neutral-700">
									{level.description}
								</p>
							</div>
						</Reveal>
					))}
				</div>

				<Reveal className="mt-16">
					<div className="grid gap-8 border-t border-neutral-950/15 pt-10 min-[810px]:grid-cols-3">
						{GUARDRAILS.map((rail) => (
							<div key={rail.tag} className="flex flex-col gap-2">
								<span className="font-mono text-xs font-bold tracking-wide uppercase">
									{rail.tag}
								</span>
								<p className="text-body-sm text-neutral-600">
									{rail.text}
								</p>
							</div>
						))}
					</div>
				</Reveal>

				<Reveal className="mx-auto mt-32 max-w-2xl text-center">
					<span className="font-mono text-sm tracking-wide text-neutral-500 uppercase">
						Faradays × Unicamp
					</span>
					<h3 className="font-heading text-h2 mt-3 text-balance">
						Vamos medir contra o seu baseline?
					</h3>
					<p className="mt-5 text-neutral-600">
						Pesquisa conduzida em cooperação com a Universidade
						Estadual de Campinas (Unicamp), com interveniência da
						Funcamp.
					</p>
					<Button asChild size="lg" className="mt-8">
						<Link href="mailto:contato@faradays.io">
							Falar com a equipe
						</Link>
					</Button>
				</Reveal>
			</div>
		</section>
	)
}
