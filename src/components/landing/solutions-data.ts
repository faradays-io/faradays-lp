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
			'Análise de crédito com parecer pronto: dados do cliente, mercado e histórico num único fluxo.',
		available: false
	},
	{
		slug: '/portais',
		name: 'Portais operacionais',
		description:
			'Cotações, documentos e atendimento no mesmo lugar, direto do ERP.',
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
