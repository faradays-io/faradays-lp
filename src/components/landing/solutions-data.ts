/* Soluções da Faradays — cada frente vive numa subpágina própria.
   Compartilhado entre o dropdown do header e o índice da nova home. */
export const SOLUTIONS = [
	{
		slug: '/importacoes',
		name: 'Operação de importação',
		description:
			'Cotações, documentos e atendimento em um fluxo só — do ERP à decisão.',
		available: true
	},
	{
		slug: '/credito',
		name: 'IA de crédito',
		description:
			'Otimização dinâmica de crédito com modelos fundacionais e aprendizagem por reforço — PD&I com a Unicamp.',
		available: true
	},
	{
		slug: '/cobranca',
		name: 'IA completa de cobrança',
		description:
			'Régua, negociação e acordos conduzidos por agentes — do vencido ao pago.',
		available: false
	},
	{
		slug: '/agentes',
		name: 'Agentes com seus dados',
		description:
			'Assistentes que respondem com o que está no banco — nunca inventam.',
		available: false
	}
] as const
