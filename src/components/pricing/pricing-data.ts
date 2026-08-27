import type { Localized } from '@/lib/i18n'
import { BOOKING_URL } from '@/lib/links'

/* Planos da solução de distribuição. A divisão segue docs/features.md:
   Basic é o núcleo de venda (rep no WhatsApp, cotação em PDF, catálogo,
   carteira, estoque); Pro fecha a operação (RFQ de compra, ERP/crédito,
   laudos, SharePoint/M365, home ao vivo, auditoria); Enterprise é o que se
   molda ao cliente (agentes especialistas, workflows, modelo de IA à escolha,
   integrações sob medida, SSO, SLA).

   PREÇOS FICTÍCIOS (placeholder até a tabela comercial existir) — em BRL,
   por mês; `yearly` é o valor/mês quando cobrado anualmente. Enterprise é
   sob consulta. */

export type Billing = 'monthly' | 'yearly'
export type PlanId = 'basic' | 'pro' | 'enterprise'

/** Desconto do anual sobre o mensal — a badge do toggle deriva daqui. */
export const YEARLY_DISCOUNT = 0.2

export type Plan = {
	id: PlanId
	/** Nome do plano — igual nos dois idiomas, é marca. */
	name: string
	tagline: Localized<string>
	/** Preço/mês nas duas periodicidades — ou `'custom'` (sob consulta). */
	pricing: { monthly: number; yearly: number } | 'custom'
	/** O plano em destaque (um só). */
	highlight?: boolean
	seats: Localized<string>
	cta: Localized<string>
	ctaHref: string
	/** Cabeçalho da lista — "Tudo do Basic, e mais:"; sem ele, "Inclui". */
	inherits?: Localized<string>
	features: Localized<string[]>
}

export const PLANS: readonly Plan[] = [
	{
		id: 'basic',
		name: 'Basic',
		tagline: {
			pt: 'Para times que querem tirar a cotação do improviso.',
			en: 'For teams that want to take the guesswork out of quoting.'
		},
		pricing: { monthly: 1490, yearly: 1190 },
		seats: {
			pt: 'Até 5 representantes',
			en: 'Up to 5 reps'
		},
		cta: { pt: 'Começar', en: 'Get started' },
		ctaHref: BOOKING_URL,
		features: {
			pt: [
				'Assistente de WhatsApp para os representantes — texto, áudio e foto',
				'Cotação de venda em PDF no seu modelo Excel, com ICMS por UF e PTAX do dia',
				'Catálogo-mestre e tabela de preços mensal por upload (preview → aplicar)',
				'Clientes por CNPJ e carteira por representante',
				'Consulta de estoque lote a lote, por vencimento',
				'Painel de conversas com histórico por representante',
				'Login social com papéis: admin, gestor e rep',
				'Suporte por e-mail em horário comercial'
			],
			en: [
				'WhatsApp assistant for your reps — text, voice and photo',
				'Sales quotes as PDF in your Excel template, with per-state ICMS and the daily PTAX',
				'Master catalog and monthly price list by upload (preview → apply)',
				'Clients by CNPJ and one portfolio per rep',
				'Batch-by-batch stock lookup, ordered by expiry',
				'Conversations panel with history per rep',
				'Social login with roles: admin, manager and rep',
				'E-mail support during business hours'
			]
		}
	},
	{
		id: 'pro',
		name: 'Pro',
		tagline: {
			pt: 'Para operações que compram, vendem e prestam contas todo dia.',
			en: 'For operations that buy, sell and report every single day.'
		},
		pricing: { monthly: 3490, yearly: 2790 },
		highlight: true,
		seats: {
			pt: 'Até 20 representantes',
			en: 'Up to 20 reps'
		},
		cta: { pt: 'Começar', en: 'Get started' },
		ctaHref: BOOKING_URL,
		inherits: {
			pt: 'Tudo do Basic, e mais',
			en: 'Everything in Basic, plus'
		},
		features: {
			pt: [
				'RFQ de compra automatizada por e-mail e WhatsApp, com contra-oferta aos perdedores',
				'Pedidos, faturamento e posição de crédito importados do ERP',
				'Documentos e laudos (COA) com validade lida por IA e radar diário de vencimentos',
				'Espelho do SharePoint/OneDrive e caixas compartilhadas do Microsoft 365',
				'Home ao vivo e notificações em tempo real, sem refresh',
				'Consultas de vendas e "a receber em Excel" direto no chat',
				'Trilha de auditoria completa',
				'Suporte prioritário com onboarding assistido'
			],
			en: [
				'Automated purchase RFQ by e-mail and WhatsApp, with counter-offers to the losers',
				'Orders, invoicing and credit position imported from the ERP',
				'Documents and certificates (COA) with AI-read expiry and a daily radar',
				'SharePoint/OneDrive mirror and Microsoft 365 shared mailboxes',
				'Live home and real-time notifications, no refresh',
				'Sales queries and "receivables as Excel" right in the chat',
				'Full audit trail',
				'Priority support with assisted onboarding'
			]
		}
	},
	{
		id: 'enterprise',
		name: 'Enterprise',
		tagline: {
			pt: 'Para quem quer a IA moldada ao próprio processo.',
			en: 'For those who want the AI shaped to their own process.'
		},
		pricing: 'custom',
		seats: {
			pt: 'Representantes ilimitados',
			en: 'Unlimited reps'
		},
		cta: { pt: 'Falar com o time', en: 'Talk to the team' },
		ctaHref: BOOKING_URL,
		inherits: {
			pt: 'Tudo do Pro, e mais',
			en: 'Everything in Pro, plus'
		},
		features: {
			pt: [
				'Agentes especialistas de IA — personas com papel, prompt, ferramentas e conhecimento sob medida',
				'Motor de workflows com canvas visual, agendados ou manuais',
				'Escolha e troca do modelo de IA, com orçamento dedicado',
				'Integrações sob medida com o seu ERP e sistemas legados',
				'Modelos de documento e regras tributárias customizadas',
				'SSO corporativo e RBAC personalizado',
				'Ambiente dedicado, SLA contratual e gerente de conta'
			],
			en: [
				'Specialist AI agents — personas with their own role, prompt, tools and knowledge',
				'Workflow engine with a visual canvas, scheduled or manual',
				'Choose and swap the AI model, with a dedicated budget',
				'Custom integrations with your ERP and legacy systems',
				'Custom document templates and tax rules',
				'Corporate SSO and custom RBAC',
				'Dedicated environment, contractual SLA and an account manager'
			]
		}
	}
]

/* ---- Comparativo -------------------------------------------------- */

/** Célula da matriz: incluído / não incluído / um valor textual. */
export type MatrixValue = boolean | Localized<string>

export type MatrixRow = {
	label: Localized<string>
	values: Record<PlanId, MatrixValue>
}

export type MatrixGroup = {
	title: Localized<string>
	rows: MatrixRow[]
}

const all = { basic: true, pro: true, enterprise: true } as const
const proUp = { basic: false, pro: true, enterprise: true } as const
const entOnly = { basic: false, pro: false, enterprise: true } as const

export const FEATURE_MATRIX: readonly MatrixGroup[] = [
	{
		title: { pt: 'Canais e representantes', en: 'Channels and reps' },
		rows: [
			{
				label: {
					pt: 'Representantes incluídos',
					en: 'Reps included'
				},
				values: {
					basic: { pt: 'até 5', en: 'up to 5' },
					pro: { pt: 'até 20', en: 'up to 20' },
					enterprise: { pt: 'ilimitados', en: 'unlimited' }
				}
			},
			{
				label: {
					pt: 'Assistente de WhatsApp (texto, áudio e foto)',
					en: 'WhatsApp assistant (text, voice and photo)'
				},
				values: all
			},
			{
				label: {
					pt: 'Painel de conversas por representante',
					en: 'Conversations panel per rep'
				},
				values: all
			},
			{
				label: {
					pt: 'Home ao vivo e notificações em tempo real',
					en: 'Live home and real-time notifications'
				},
				values: proUp
			}
		]
	},
	{
		title: { pt: 'Cotação de venda', en: 'Sales quotes' },
		rows: [
			{
				label: {
					pt: 'Cotação multi-item em PDF no seu modelo Excel',
					en: 'Multi-item quote as PDF in your Excel template'
				},
				values: all
			},
			{
				label: {
					pt: 'Motor tributário: ICMS por UF, PIS/COFINS, IPI e PTAX congelada',
					en: 'Tax engine: per-state ICMS, PIS/COFINS, IPI and frozen PTAX'
				},
				values: all
			},
			{
				label: {
					pt: 'Histórico de preços por produto',
					en: 'Price history per product'
				},
				values: all
			},
			{
				label: {
					pt: 'Modelos de documento e regras tributárias customizadas',
					en: 'Custom document templates and tax rules'
				},
				values: entOnly
			}
		]
	},
	{
		title: { pt: 'Compras (RFQ)', en: 'Purchasing (RFQ)' },
		rows: [
			{
				label: {
					pt: 'Disparo automático por e-mail e WhatsApp',
					en: 'Automatic dispatch by e-mail and WhatsApp'
				},
				values: proUp
			},
			{
				label: {
					pt: 'Interpretação automática das respostas dos fornecedores',
					en: 'Automatic parsing of supplier replies'
				},
				values: proUp
			},
			{
				label: {
					pt: 'Vencedora por item e contra-oferta automática',
					en: 'Winner per item and automatic counter-offer'
				},
				values: proUp
			}
		]
	},
	{
		title: {
			pt: 'Catálogo, clientes e estoque',
			en: 'Catalog, clients and stock'
		},
		rows: [
			{
				label: {
					pt: 'Catálogo-mestre e tabela de preços mensal',
					en: 'Master catalog and monthly price list'
				},
				values: all
			},
			{
				label: {
					pt: 'Clientes por CNPJ e carteira por representante',
					en: 'Clients by CNPJ and one portfolio per rep'
				},
				values: all
			},
			{
				label: { pt: 'Estoque por lote', en: 'Stock by batch' },
				values: all
			},
			{
				label: {
					pt: 'Import diário de clientes do ERP (limite de crédito, bloqueio)',
					en: 'Daily client import from the ERP (credit limit, blocks)'
				},
				values: proUp
			}
		]
	},
	{
		title: {
			pt: 'Pedidos, faturamento e crédito',
			en: 'Orders, invoicing and credit'
		},
		rows: [
			{
				label: {
					pt: 'Imports de pedidos e vendas do ERP no grão de item',
					en: 'Order and sales imports from the ERP at item level'
				},
				values: proUp
			},
			{
				label: {
					pt: 'Posição de crédito e "a receber" em Excel no chat',
					en: 'Credit position and receivables as Excel in the chat'
				},
				values: proUp
			},
			{
				label: {
					pt: 'Consultas de vendas para o representante',
					en: 'Sales queries for the rep'
				},
				values: proUp
			}
		]
	},
	{
		title: { pt: 'Documentos e laudos', en: 'Documents and certificates' },
		rows: [
			{
				label: {
					pt: 'Matriz de pendências e radar diário de vencimentos',
					en: 'Pending-documents matrix and daily expiry radar'
				},
				values: proUp
			},
			{
				label: {
					pt: 'Validade lida por IA e carimbo do arquivo no drive',
					en: 'AI-read expiry and file stamping in the drive'
				},
				values: proUp
			}
		]
	},
	{
		title: { pt: 'Integrações', en: 'Integrations' },
		rows: [
			{
				label: {
					pt: 'Espelho do SharePoint / OneDrive',
					en: 'SharePoint / OneDrive mirror'
				},
				values: proUp
			},
			{
				label: {
					pt: 'Caixas compartilhadas do Microsoft 365',
					en: 'Microsoft 365 shared mailboxes'
				},
				values: proUp
			},
			{
				label: {
					pt: 'Integrações sob medida (ERP, sistemas legados)',
					en: 'Custom integrations (ERP, legacy systems)'
				},
				values: entOnly
			}
		]
	},
	{
		title: { pt: 'Inteligência artificial', en: 'Artificial intelligence' },
		rows: [
			{
				label: {
					pt: 'Guardas determinísticas — preço só de ferramenta, nunca de palpite',
					en: 'Deterministic guards — prices only from tools, never guessed'
				},
				values: all
			},
			{
				label: { pt: 'Modelo de IA', en: 'AI model' },
				values: {
					basic: { pt: 'padrão', en: 'standard' },
					pro: { pt: 'padrão', en: 'standard' },
					enterprise: { pt: 'à escolha', en: 'your choice' }
				}
			},
			{
				label: {
					pt: 'Agentes especialistas (personas, prompts, ferramentas)',
					en: 'Specialist agents (personas, prompts, tools)'
				},
				values: entOnly
			},
			{
				label: {
					pt: 'Motor de workflows com canvas visual',
					en: 'Workflow engine with a visual canvas'
				},
				values: entOnly
			}
		]
	},
	{
		title: { pt: 'Segurança e suporte', en: 'Security and support' },
		rows: [
			{
				label: {
					pt: 'Login social (Google/Microsoft) e papéis',
					en: 'Social login (Google/Microsoft) and roles'
				},
				values: all
			},
			{
				label: { pt: 'Trilha de auditoria', en: 'Audit trail' },
				values: proUp
			},
			{
				label: {
					pt: 'SSO corporativo e RBAC personalizado',
					en: 'Corporate SSO and custom RBAC'
				},
				values: entOnly
			},
			{
				label: {
					pt: 'Ambiente dedicado e SLA contratual',
					en: 'Dedicated environment and contractual SLA'
				},
				values: entOnly
			},
			{
				label: { pt: 'Suporte', en: 'Support' },
				values: {
					basic: { pt: 'e-mail', en: 'e-mail' },
					pro: { pt: 'prioritário', en: 'priority' },
					enterprise: {
						pt: 'gerente de conta',
						en: 'account manager'
					}
				}
			}
		]
	}
]
