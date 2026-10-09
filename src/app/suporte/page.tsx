import type { Metadata } from 'next'

import type { LegalContent } from '@/components/landing/legal-page'
import { LegalPage } from '@/components/landing/legal-page'
import type { Localized } from '@/lib/i18n'

export const metadata: Metadata = {
	title: 'Política de Suporte e Disponibilidade — Faradays',
	description:
		'Canais, horários, prazos de resposta por plano, o que está e o que não está coberto, janelas de manutenção e como a Faradays comunica incidentes.'
}

/* Os níveis seguem a página de preços (Basic: e-mail em horário comercial;
   Pro: prioritário com onboarding; Enterprise: gerente de conta e SLA).
   Prazos e meta de disponibilidade são decisões comerciais registradas em
   docs/politicas-pendencias.md. */
const CONTENT: Localized<LegalContent> = {
	pt: {
		title: 'Política de Suporte e Disponibilidade',
		originalAt: '9 de setembro de 2026',
		updatedAt: '9 de setembro de 2026',
		intro: [
			'Esta política descreve como a Faradays presta suporte à Plataforma, com que prazos, o que está coberto, como as manutenções são feitas e como comunicamos incidentes. Ela integra os [Termos e Condições de Uso](/termos). Clientes com contrato Enterprise seguem o SLA do próprio contrato; esta página vale no que ele não regular.'
		],
		sections: [
			{
				heading: 'Canais e horário',
				body: [
					'O canal de suporte é o e-mail contato@faradays.io, aberto a administradores e gestores do Cliente. Representantes devem acionar o administrador da própria empresa, que centraliza os pedidos. Clientes Pro e Enterprise recebem, no onboarding, um canal direto adicional (grupo ou contato dedicado).',
					'O atendimento funciona em **dias úteis, das 9h às 18h, horário de Brasília**. Pedidos fora desse horário entram na fila e são tratados no próximo dia útil. Incidentes que tornem a Plataforma indisponível são monitorados e tratados fora do horário comercial, ainda que a resposta ao Cliente saia no dia útil seguinte.'
				]
			},
			{
				heading: 'Prazos de resposta por plano',
				body: [
					'Contamos o prazo de **primeira resposta** — quando uma pessoa do time confirma o recebimento, classifica a severidade e diz o próximo passo — em horas úteis, a partir da abertura do pedido.',
					{
						type: 'table',
						head: ['Severidade', 'Basic', 'Pro', 'Enterprise'],
						rows: [
							[
								'**Crítica** — Plataforma ou assistente indisponível para todos os Usuários',
								'8 horas úteis',
								'4 horas úteis',
								'Conforme contrato'
							],
							[
								'**Alta** — funcionalidade principal com falha sem contorno (cotação não emite, integração parada)',
								'1 dia útil',
								'8 horas úteis',
								'Conforme contrato'
							],
							[
								'**Média** — falha com contorno, comportamento incorreto isolado',
								'2 dias úteis',
								'1 dia útil',
								'Conforme contrato'
							],
							[
								'**Baixa** — dúvida de uso, pedido de melhoria, ajuste de cadastro',
								'3 dias úteis',
								'2 dias úteis',
								'Conforme contrato'
							]
						]
					},
					'Prazo de resposta não é prazo de solução. A solução depende da causa; informamos a estimativa na primeira resposta e mantemos o Cliente atualizado até o fechamento.'
				]
			},
			{
				heading: 'O que o suporte cobre',
				body: [
					{
						type: 'list',
						items: [
							'Falhas e comportamento incorreto da Plataforma — portal, assistente, integrações e imports;',
							'Dúvidas sobre o uso das funcionalidades do Plano contratado;',
							'Ajuda na conexão de integrações (Microsoft 365, WhatsApp, imports do ERP) dentro do que a Plataforma suporta;',
							'Atualizações de segurança e correções, aplicadas pela Faradays sem custo;',
							'Onboarding assistido, para Clientes Pro e Enterprise, nas primeiras semanas de uso;',
							'Pedidos relacionados a dados pessoais e à LGPD, encaminhados ao Encarregado.'
						]
					}
				]
			},
			{
				heading: 'O que não está coberto',
				body: [
					{
						type: 'list',
						items: [
							'Operação e configuração dos sistemas do próprio Cliente — ERP, tenant Microsoft 365, conta WhatsApp Business na Meta, rede e dispositivos;',
							'Problemas causados por indisponibilidade ou mudança de regras dos Serviços de Terceiros (Meta, Microsoft, provedores de IA), além de adaptar a Plataforma quando couber;',
							'Conteúdo e exatidão dos dados inseridos ou importados pelo Cliente — tabelas de preço, cadastros, relatórios do ERP;',
							'Desenvolvimento de funcionalidades, integrações ou modelos de documento sob medida — escopados à parte, no Plano Enterprise;',
							'Treinamento presencial ou recorrente das equipes, além do onboarding do Plano;',
							'Consultoria tributária, jurídica ou contábil sobre as regras que o Cliente configura.'
						]
					}
				]
			},
			{
				heading: 'Disponibilidade e manutenção',
				body: [
					'Para os Planos Basic e Pro, a meta de disponibilidade mensal da Plataforma é de **99,5%**, medida pela verificação de saúde do serviço. Ficam fora da conta as manutenções programadas, as indisponibilidades causadas por Serviços de Terceiros ou pelo Cliente, e os casos de força maior. A meta é um compromisso de esforço; garantias com crédito existem apenas em contrato Enterprise.',
					'**Manutenções programadas** acontecem preferencialmente fora do horário comercial e são avisadas aos administradores com antecedência mínima de 48 horas quando implicarem indisponibilidade. Atualizações sem interrupção são implantadas continuamente, sem aviso.',
					'**Manutenções emergenciais** — correção de segurança ou de falha grave — podem ser feitas a qualquer hora, com comunicação assim que possível.',
					'O banco de dados é copiado **diariamente**, com retenção de **14 dias**. Restauração a pedido do Cliente por erro operacional próprio é avaliada caso a caso e pode ter custo.'
				]
			},
			{
				heading: 'Comunicação de incidentes',
				body: [
					'Em indisponibilidade ou degradação relevante, avisamos por e-mail os administradores dos Clientes afetados assim que o incidente é confirmado, e mantemos atualizações até a normalização. Em incidentes críticos, enviamos em até 5 dias úteis um resumo do ocorrido e das medidas tomadas.',
					'Em incidente de segurança que possa acarretar risco ou dano relevante a Titulares de dados pessoais, comunicamos o Cliente, Controlador desses dados, **em até 3 dias úteis** a partir da confirmação. O comunicado descreve o ocorrido, os dados envolvidos, os Titulares afetados e as medidas adotadas. Apoiamos o Cliente na comunicação à ANPD e aos Titulares, conforme o [Aviso de Privacidade](/privacidade).'
				]
			},
			{
				heading: 'Como abrir um pedido',
				body: [
					'Escreva para contato@faradays.io com: a empresa, o Usuário afetado, o que aconteceu e o que era esperado, quando ocorreu, e, se possível, capturas de tela ou o identificador da cotação, conversa ou documento envolvido. Quanto mais preciso o relato, mais rápida a solução. Não envie senhas, tokens ou dados pessoais além do necessário.'
				]
			}
		]
	},
	en: {
		title: 'Support and Availability Policy',
		originalAt: 'September 9, 2026',
		updatedAt: 'September 9, 2026',
		intro: [
			"This policy describes how Faradays supports the Platform, within what timeframes, what is covered, how maintenance is carried out and how we communicate incidents. It is part of the [Terms and Conditions of Use](/termos). Customers with an Enterprise agreement follow that agreement's SLA; this page applies to whatever it does not regulate."
		],
		sections: [
			{
				heading: 'Channels and hours',
				body: [
					"The support channel is the e-mail contato@faradays.io, open to the Customer's administrators and managers. Representatives should contact their own company's administrator, who centralizes requests. Pro and Enterprise customers receive an additional direct channel (dedicated group or contact) during onboarding.",
					'Support operates on **business days, 9am to 6pm, Brasília time**. Requests outside those hours enter the queue and are handled on the next business day. Incidents that make the Platform unavailable are monitored and handled outside business hours, even if the reply to the Customer goes out on the next business day.'
				]
			},
			{
				heading: 'Response times per plan',
				body: [
					'We count the **first response** time — when a team member confirms receipt, classifies severity and states the next step — in business hours, from the opening of the request.',
					{
						type: 'table',
						head: ['Severity', 'Basic', 'Pro', 'Enterprise'],
						rows: [
							[
								'**Critical** — Platform or assistant unavailable for all Users',
								'8 business hours',
								'4 business hours',
								'As per agreement'
							],
							[
								'**High** — core feature failing with no workaround (quote not issuing, integration stopped)',
								'1 business day',
								'8 business hours',
								'As per agreement'
							],
							[
								'**Medium** — failure with workaround, isolated incorrect behavior',
								'2 business days',
								'1 business day',
								'As per agreement'
							],
							[
								'**Low** — usage question, improvement request, record adjustment',
								'3 business days',
								'2 business days',
								'As per agreement'
							]
						]
					},
					'Response time is not resolution time. Resolution depends on the cause; we give an estimate in the first response and keep the Customer updated until closure.'
				]
			},
			{
				heading: 'What support covers',
				body: [
					{
						type: 'list',
						items: [
							'Failures and incorrect behavior of the Platform — portal, assistant, integrations and imports;',
							'Questions about using the features of the contracted Plan;',
							'Help connecting integrations (Microsoft 365, WhatsApp, ERP imports) within what the Platform supports;',
							'Security updates and fixes, applied by Faradays at no cost;',
							'Assisted onboarding, for Pro and Enterprise customers, in the first weeks of use;',
							'Requests related to personal data and the LGPD, forwarded to the Data Protection Officer.'
						]
					}
				]
			},
			{
				heading: 'What is not covered',
				body: [
					{
						type: 'list',
						items: [
							"Operating and configuring the Customer's own systems — ERP, Microsoft 365 tenant, WhatsApp Business account at Meta, network and devices;",
							'Problems caused by unavailability or rule changes of Third-Party Services (Meta, Microsoft, AI providers), beyond adapting the Platform where applicable;',
							'Content and accuracy of data entered or imported by the Customer — price lists, records, ERP reports;',
							'Development of custom features, integrations or document templates — scoped separately, in the Enterprise Plan;',
							"On-site or recurring team training, beyond the Plan's onboarding;",
							'Tax, legal or accounting advice on the rules the Customer configures.'
						]
					}
				]
			},
			{
				heading: 'Availability and maintenance',
				body: [
					"For the Basic and Pro Plans, the Platform's monthly availability target is **99.5%**, measured by the service health check. Scheduled maintenance, unavailability caused by Third-Party Services or by the Customer, and force majeure are left out of the count. The target is a best-effort commitment; guarantees with credits exist only in Enterprise agreements.",
					'**Scheduled maintenance** takes place preferably outside business hours and is announced to administrators at least 48 hours in advance when it implies unavailability. Zero-downtime updates are deployed continuously, without notice.',
					'**Emergency maintenance** — a security fix or a fix for a serious failure — may be carried out at any time, with communication as soon as possible.',
					"The database is backed up **daily**, with **14-day** retention. Restoration at the Customer's request due to its own operational error is assessed case by case and may have a cost."
				]
			},
			{
				heading: 'Incident communication',
				body: [
					'In case of unavailability or relevant degradation, we notify the administrators of affected Customers by e-mail as soon as the incident is confirmed, and keep them updated until normalization. For critical incidents, we send a summary of what happened and the measures taken within 5 business days.',
					'In a security incident that may cause relevant risk or harm to personal Data Subjects, we notify the Customer, as Controller of that data, **within 3 business days** of confirmation. The notice describes what happened, the data involved, the affected Data Subjects and the measures taken. We support the Customer in communicating with the ANPD and the Data Subjects, as set out in the [Privacy Notice](/privacidade).'
				]
			},
			{
				heading: 'How to open a request',
				body: [
					'Write to contato@faradays.io with: the company, the affected User, what happened and what was expected, when it occurred and, if possible, screenshots or the identifier of the quote, conversation or document involved. The more precise the report, the faster the resolution. Do not send passwords, tokens or personal data beyond what is necessary.'
				]
			}
		]
	}
}

export default function SuportePage() {
	return <LegalPage slug="/suporte" content={CONTENT} />
}
