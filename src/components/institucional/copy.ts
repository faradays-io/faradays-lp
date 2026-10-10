import type { Localized } from '@/lib/i18n'

/* Copy da home institucional (/_new), seção a seção. Estrutura e ritmo
   seguem a referência getenter.ai (docs/referencia-getenter.md).

   PLACEHOLDER marca o que ainda não existe de verdade: depoimentos, nomes,
   números de case e a frase-assinatura do fecho. Nada disso pode ir ao ar
   como está — trocar pelo material real antes de a página substituir a
   raiz. */

export const ANNOUNCEMENT_HREF = '/distribuicao#feature-docs'

export const SHELL_COPY = {
	pt: {
		announcement:
			'Novo: a validade de laudos e certificados lida por IA direto do PDF',
		announcementLink: 'Saiba mais',
		solutions: 'Soluções',
		blog: 'Blog',
		soon: '(em breve)',
		talk: 'Fale com a Faradays',
		talkShort: 'Fale conosco',
		switchLang: 'Switch to English'
	},
	en: {
		announcement:
			'New: certificate and report expiry dates read by AI straight from the PDF',
		announcementLink: 'Learn more',
		solutions: 'Solutions',
		blog: 'Blog',
		soon: '(soon)',
		talk: 'Talk to Faradays',
		talkShort: 'Contact us',
		switchLang: 'Ver em português'
	}
} satisfies Localized<Record<string, string>>

export const HERO_MEDIA_COPY = {
	pt: { portrait: 'Vídeo: retrato do cliente, loop de 10 s' },
	en: { portrait: 'Video: client portrait, 10 s loop' }
} satisfies Localized<Record<string, string>>

/* PLACEHOLDER — os três cards de vídeo abaixo do hero. */
export const VIDEO_CARDS = [
	{
		quote: {
			pt: 'Frase curta do cliente sobre o que mudou na operação depois da Faradays.',
			en: 'A short line from the client on what changed in the operation with Faradays.'
		},
		name: 'Nome Sobrenome',
		role: { pt: 'Diretor de Operações, Empresa', en: 'COO, Company' }
	},
	{
		quote: {
			pt: 'O ganho que o time sentiu no dia a dia, em uma ou duas frases, na voz de quem usa.',
			en: 'The gain the team felt day to day, in one or two sentences, in the voice of someone who uses it.'
		},
		name: 'Nome Sobrenome',
		role: { pt: 'Gerente Comercial, Empresa', en: 'Sales Manager, Company' }
	},
	{
		quote: {
			pt: 'Um resultado concreto: tempo, volume ou erro que deixou de acontecer.',
			en: 'A concrete result: time, volume or an error that stopped happening.'
		},
		name: 'Nome Sobrenome',
		role: { pt: 'CEO, Empresa', en: 'CEO, Company' }
	}
] as const

export const LOGOS_COPY = {
	pt: { title: 'Empresas que operam com a Faradays', logo: 'Logo' },
	en: { title: 'Companies that run on Faradays', logo: 'Logo' }
} satisfies Localized<Record<string, string>>

/* PLACEHOLDER — empresa, números e foto do case. */
export const CASE_COPY = {
	pt: {
		title: 'Como a Empresa Cliente tira cotações em minutos, direto do WhatsApp',
		cta: 'Confira os resultados',
		photo: 'Foto: time do cliente'
	},
	en: {
		title: 'How Client Company turns quotes around in minutes, straight from WhatsApp',
		cta: 'See the results',
		photo: 'Photo: client team'
	}
} satisfies Localized<Record<string, string>>

export const CASE_STATS = [
	{
		label: { pt: 'Tempo médio de cotação', en: 'Average quote time' },
		value: '−00%'
	},
	{
		label: { pt: 'Cotações por mês', en: 'Quotes per month' },
		value: '0.000'
	}
] as const

export const HOW_COPY = {
	pt: {
		title: 'Como a Faradays trabalha pela sua operação',
		visual: 'Animação'
	},
	en: {
		title: 'How Faradays works for your operation',
		visual: 'Animation'
	}
} satisfies Localized<Record<string, string>>

export const TESTIMONIALS_COPY = {
	pt: {
		title: 'Quem opera com a Faradays conta melhor',
		cta: 'Ver os cases',
		photo: 'Foto'
	},
	en: {
		title: 'Our clients tell it better',
		cta: 'See the cases',
		photo: 'Photo'
	}
} satisfies Localized<Record<string, string>>

/* PLACEHOLDER — quatro depoimentos com foto, nome e cargo. */
export const TESTIMONIALS = [
	{
		quote: {
			pt: 'Depoimento de duas ou três linhas sobre a confiança no resultado e a decisão de ampliar o uso.',
			en: 'A two or three line testimonial about trusting the results and deciding to expand usage.'
		},
		name: 'Nome Sobrenome',
		role: {
			pt: 'Diretor Comercial, Empresa',
			en: 'Sales Director, Company'
		}
	},
	{
		quote: {
			pt: 'Um número que o cliente acompanha e quanto ele mudou desde a implantação.',
			en: 'A number the client tracks and how much it moved since rollout.'
		},
		name: 'Nome Sobrenome',
		role: {
			pt: 'Head de Operações, Empresa',
			en: 'Head of Operations, Company'
		}
	},
	{
		quote: {
			pt: 'O que o time deixou de fazer à mão e para onde foi esse tempo.',
			en: 'What the team stopped doing by hand and where that time went.'
		},
		name: 'Nome Sobrenome',
		role: {
			pt: 'Gerente de Compras, Empresa',
			en: 'Purchasing Manager, Company'
		}
	},
	{
		quote: {
			pt: 'Uma frase sobre o mercado do cliente e por que a operação precisava mudar.',
			en: "A line about the client's market and why the operation had to change."
		},
		name: 'Nome Sobrenome',
		role: { pt: 'CEO, Empresa', en: 'CEO, Company' }
	}
] as const

export const SECURITY_COPY = {
	pt: {
		title: 'IA com segurança e privacidade desde o primeiro dia',
		cta: 'Saiba mais'
	},
	en: {
		title: 'AI with security and privacy from day one',
		cta: 'Learn more'
	}
} satisfies Localized<Record<string, string>>

/* Fatos conferidos no Aviso de Privacidade (/privacidade) — mudar aqui
   exige mudar lá primeiro (ver AGENTS.md, "Verdade antes de promessa"). */
export const SECURITY_ITEMS = [
	{
		id: 'treino',
		title: {
			pt: 'Sem treinamento com seus dados',
			en: 'No training on your data'
		},
		body: {
			pt: 'A Faradays não usa os dados dos clientes para treinar modelos próprios. Os provedores de modelos são contratados sob termos que vedam o uso do conteúdo para treinamento.',
			en: 'Faradays does not use client data to train its own models. Model providers are contracted under terms that forbid using the content for training.'
		}
	},
	{
		id: 'auditoria',
		title: { pt: 'Trilha de auditoria', en: 'Audit trail' },
		body: {
			pt: 'Cada ação na plataforma fica registrada com módulo, ação, registro afetado, data e hora. A trilha é guardada durante o contrato e por até 5 anos depois.',
			en: 'Every action on the platform is logged with module, action, affected record, date and time. The trail is kept for the contract term and up to 5 years after.'
		}
	},
	{
		id: 'acesso',
		title: { pt: 'Acesso e permissões', en: 'Access and permissions' },
		body: {
			pt: 'O login é delegado ao provedor de identidade, inclusive Google ou Microsoft, e a Faradays não guarda senhas. As permissões seguem os grupos de administrador, gestor e representante.',
			en: 'Sign-in is delegated to the identity provider, including Google or Microsoft, and Faradays stores no passwords. Permissions follow the admin, manager and sales rep groups.'
		}
	},
	{
		id: 'lgpd',
		title: { pt: 'LGPD e retenção', en: 'LGPD and retention' },
		body: {
			pt: 'Todo acesso trafega com TLS e o banco tem cópia diária mantida por 14 dias. No fim do contrato, o Cliente tem 30 dias para exportar os dados.',
			en: 'All access runs over TLS and the database is backed up daily, each copy kept for 14 days. When the contract ends, the Client has 30 days to export the data.'
		}
	}
] as const

export const SOLUTIONS_COPY = {
	pt: {
		title: 'Cada frente da operação em um produto próprio',
		explore: 'Conhecer',
		photo: 'Foto: a operação'
	},
	en: {
		title: 'Every front of the operation in its own product',
		explore: 'Explore',
		photo: 'Photo: the operation'
	}
} satisfies Localized<Record<string, string>>

export const NEWS_COPY = {
	pt: { title: 'Notícias', cta: 'Ver o blog', cover: 'Capa do post' },
	en: { title: 'News', cta: 'See the blog', cover: 'Post cover' }
} satisfies Localized<Record<string, string>>

/* PLACEHOLDER — a frase-assinatura (o "Just press Enter" da Faradays). */
export const CLOSING_COPY = {
	pt: { title: 'A operação, resolvida.', photo: 'Foto: a operação rodando' },
	en: { title: 'Operations, handled.', photo: 'Photo: the operation running' }
} satisfies Localized<Record<string, string>>

export const FOOTER_COPY = {
	pt: {
		solutions: 'Soluções',
		resources: 'Recursos',
		contact: 'Contato',
		legal: 'Legal',
		policies: 'Políticas',
		bookDemo: 'Agende uma demo',
		rights: 'Todos os direitos reservados.'
	},
	en: {
		solutions: 'Solutions',
		resources: 'Resources',
		contact: 'Contact',
		legal: 'Legal',
		policies: 'Policies',
		bookDemo: 'Book a demo',
		rights: 'All rights reserved.'
	}
} satisfies Localized<Record<string, string>>
