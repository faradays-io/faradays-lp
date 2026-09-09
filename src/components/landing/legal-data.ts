import type { Localized } from '@/lib/i18n'

/* Páginas legais — fonte única para os links de rodapé, para o índice em
   `/politicas` e para as rotas `src/app/<slug>`. `label` é o nome curto
   (rodapé); `title` e `description` são o que o índice mostra. As datas
   vivem em cada página (LegalContent.updatedAt) — o índice não as repete
   para não desandar. */
export const LEGAL_INDEX = {
	slug: '/politicas',
	label: { pt: 'Políticas', en: 'Policies' }
} as const satisfies { slug: string; label: Localized<string> }

export const LEGAL_PAGES = [
	{
		slug: '/termos',
		label: { pt: 'Termos', en: 'Terms' },
		title: {
			pt: 'Termos e Condições de Uso',
			en: 'Terms and Conditions of Use'
		},
		description: {
			pt: 'As regras para usar o site e a plataforma da Faradays: licença, planos, pagamento, responsabilidades, uso da IA e do WhatsApp, suporte e encerramento.',
			en: "The rules for using Faradays' website and platform: license, plans, payment, responsibilities, AI and WhatsApp use, support and termination."
		}
	},
	{
		slug: '/privacidade',
		label: { pt: 'Privacidade', en: 'Privacy' },
		title: { pt: 'Aviso de Privacidade', en: 'Privacy Notice' },
		description: {
			pt: 'Quais dados pessoais tratamos no site e na plataforma, com que finalidade e base legal, com quem compartilhamos, por quanto tempo guardamos e como exercer seus direitos pela LGPD.',
			en: 'Which personal data we process on the website and the platform, for what purpose and legal basis, who we share it with, how long we keep it and how to exercise your rights under the LGPD.'
		}
	},
	{
		slug: '/exclusao-de-dados',
		label: { pt: 'Exclusão de dados', en: 'Data deletion' },
		title: {
			pt: 'Como pedir a exclusão dos seus dados',
			en: 'How to request deletion of your data'
		},
		description: {
			pt: 'O passo a passo para pedir a eliminação de dados pessoais tratados pela Faradays, inclusive os obtidos pelo WhatsApp, o prazo de atendimento e o que a lei nos obriga a manter.',
			en: 'The step-by-step to request deletion of personal data processed by Faradays, including data obtained through WhatsApp, the response time and what the law requires us to keep.'
		}
	},
	{
		slug: '/subprocessadores',
		label: { pt: 'Subprocessadores', en: 'Subprocessors' },
		title: {
			pt: 'Subprocessadores e transferência internacional',
			en: 'Subprocessors and international transfers'
		},
		description: {
			pt: 'A lista nominal dos fornecedores que tratam dados em nome da Faradays, o que cada um recebe e em que país opera.',
			en: 'The named list of vendors that process data on behalf of Faradays, what each one receives and the country it operates in.'
		}
	},
	{
		slug: '/suporte',
		label: { pt: 'Suporte', en: 'Support' },
		title: {
			pt: 'Política de Suporte e Disponibilidade',
			en: 'Support and Availability Policy'
		},
		description: {
			pt: 'Canais, horários, prazos de resposta por plano, o que está e o que não está coberto, janelas de manutenção e como comunicamos incidentes.',
			en: "Channels, hours, response times per plan, what is and isn't covered, maintenance windows and how we communicate incidents."
		}
	},
	{
		slug: '/cookies',
		label: { pt: 'Cookies', en: 'Cookies' },
		title: { pt: 'Política de Cookies', en: 'Cookie Policy' },
		description: {
			pt: 'Quais cookies e tecnologias semelhantes o site usa, para quê, e como controlá-los.',
			en: 'Which cookies and similar technologies the website uses, why, and how to control them.'
		}
	},
	{
		slug: '/licencas',
		label: { pt: 'Licenças', en: 'Licenses' },
		title: { pt: 'Licenças de terceiros', en: 'Third-party licenses' },
		description: {
			pt: 'Software de código aberto, tipografia e demais licenças usadas no site.',
			en: 'Open-source software, typography and other licenses used on the website.'
		}
	}
] as const satisfies readonly {
	slug: string
	label: Localized<string>
	title: Localized<string>
	description: Localized<string>
}[]

/* Rodapés das páginas de produto e da home: o índice mais os três documentos
   que todo visitante espera achar no pé — os demais ficam em /politicas. */
export const FOOTER_LEGAL_LINKS = [
	LEGAL_INDEX,
	...LEGAL_PAGES.filter((page) =>
		(['/termos', '/privacidade', '/cookies'] as const).some(
			(slug) => slug === page.slug
		)
	)
] as const satisfies readonly { slug: string; label: Localized<string> }[]
