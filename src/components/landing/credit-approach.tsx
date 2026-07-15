import { Reveal } from '@/components/landing/reveal'

const CONTRAST = [
	{
		before: 'Score de default calculado num retrato fixo do passado',
		after: 'Política que recomenda a intervenção ótima: aprovar, ajustar limite, ofertar produto'
	},
	{
		before: 'Retreino oneroso a cada mudança de cenário econômico',
		after: 'Adaptação em contexto, em tempo de inferência — sem atualizar pesos'
	},
	{
		before: 'Aprende apenas com quem já foi aprovado',
		after: 'Explora ativamente os perfis que o mercado inteiro ignora'
	},
	{
		before: 'Fairness tratada como restrição periférica',
		after: 'Fairness dentro da função objetivo, auditada a cada política'
	}
]

export function CreditApproach() {
	return (
		<section id="abordagem" className="bg-background text-foreground py-40">
			<Reveal className="px-7">
				<span className="text-muted-foreground font-mono text-sm tracking-wide uppercase">
					(a abordagem)
				</span>
				<h2 className="font-heading text-h1 mt-3 max-w-3xl text-balance">
					De score estático a política de decisão
				</h2>
				<p className="text-body-lg text-foreground/70 mt-5 max-w-2xl">
					Uma decisão de crédito não é uma previsão: é uma intervenção
					que muda o comportamento de quem a recebe. Tratamos o
					crédito como o problema sequencial que ele sempre foi.
				</p>
			</Reveal>

			<Reveal className="mt-16 px-7">
				<div className="hidden grid-cols-2 gap-14 border-b pb-4 min-[810px]:grid">
					<span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
						De — previsão estática
					</span>
					<span className="text-brand font-mono text-xs tracking-widest uppercase">
						Para — decisão dinâmica
					</span>
				</div>
				<div className="flex flex-col">
					{CONTRAST.map((row) => (
						<div
							key={row.after}
							className="grid gap-3 border-b py-7 min-[810px]:grid-cols-2 min-[810px]:gap-14"
						>
							<p className="text-foreground/45 max-w-lg">
								<span className="text-muted-foreground mr-3 font-mono text-xs tracking-widest uppercase min-[810px]:hidden">
									De
								</span>
								{row.before}
							</p>
							<p className="text-foreground/90 max-w-lg">
								<span className="text-brand mr-3 font-mono text-xs tracking-widest uppercase min-[810px]:hidden">
									Para
								</span>
								{row.after}
							</p>
						</div>
					))}
				</div>
			</Reveal>
		</section>
	)
}
