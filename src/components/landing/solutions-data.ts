import type { Localized } from '@/lib/i18n'

/* Soluções da Faradays — cada frente vive numa subpágina própria.
   Compartilhado entre o dropdown do header e o índice da nova home.
   Copy localizada campo a campo; slug e disponibilidade são um só. */
export const SOLUTIONS = [
	{
		slug: '/distribuicao',
		name: {
			pt: 'Operação de distribuição',
			en: 'Distribution operations'
		},
		description: {
			pt: 'Sua operação inteira no WhatsApp — cotações, documentos e respostas na hora, com o gestor vendo tudo no portal.',
			en: 'Your entire operation on WhatsApp — quotes, documents and instant answers, with managers seeing everything on the portal.'
		},
		available: true
	},
	{
		slug: '/credito',
		name: {
			pt: 'IA de crédito',
			en: 'Credit AI'
		},
		description: {
			pt: 'Otimização dinâmica de crédito com modelos fundacionais e aprendizagem por reforço — PD&I com a Unicamp.',
			en: 'Dynamic credit optimization with foundation models and reinforcement learning — R&D with Unicamp.'
		},
		available: false
	},
	{
		slug: '/cobranca',
		name: {
			pt: 'IA completa de cobrança',
			en: 'End-to-end collections AI'
		},
		description: {
			pt: 'Régua, negociação e acordos conduzidos por agentes — do vencido ao pago.',
			en: 'Dunning, negotiation and settlements run by agents — from overdue to paid.'
		},
		available: false
	},
	{
		slug: '/agentes',
		name: {
			pt: 'Agentes com seus dados',
			en: 'Agents on your data'
		},
		description: {
			pt: 'Assistentes que respondem com o que está no banco — nunca inventam.',
			en: 'Assistants that answer with what is in the database — they never make things up.'
		},
		available: false
	}
] as const satisfies readonly {
	slug: string
	name: Localized<string>
	description: Localized<string>
	available: boolean
}[]
