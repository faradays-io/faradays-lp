import type { Metadata } from 'next'

import type { LegalContent } from '@/components/landing/legal-page'
import { LegalPage } from '@/components/landing/legal-page'
import type { Localized } from '@/lib/i18n'

export const metadata: Metadata = {
	title: 'Subprocessadores — Faradays',
	description:
		'A lista nominal dos fornecedores que tratam dados em nome da Faradays, o que cada um recebe e em que país opera.'
}

/* Espelha o que a Plataforma de fato usa (integrações e provedores em
   docs/politicas-pendencias.md). Toda troca de fornecedor de mesma natureza
   exige atualizar esta página e avisar os clientes ativos com 30 dias —
   é o que o Aviso de Privacidade promete. */
const CONTENT: Localized<LegalContent> = {
	pt: {
		title: 'Subprocessadores e transferência internacional',
		originalAt: '9 de setembro de 2026',
		updatedAt: '9 de setembro de 2026',
		intro: [
			'Subprocessadores são os fornecedores que tratam dados pessoais em nome da Faradays para que o Site e a Plataforma funcionem. Esta página é a lista nominal a que o [Aviso de Privacidade](/privacidade) se refere: quem é cada um, o que recebe, para quê, e em que país opera.',
			'Clientes ativos são avisados com antecedência mínima de 30 dias antes de um novo subprocessador começar a tratar Dados do Cliente, e podem se opor por motivo razoável. Fornecedores de mesma natureza podem ser substituídos com o mesmo aviso.'
		],
		sections: [
			{
				heading: 'Plataforma — infraestrutura e operação',
				body: [
					{
						type: 'table',
						head: [
							'Fornecedor',
							'Função',
							'Dados tratados',
							'País'
						],
						rows: [
							[
								'Vultr Holdings, LLC ([política](https://www.vultr.com/legal/privacy/))',
								'Hospedagem dos servidores da Plataforma e do banco de dados',
								'Todos os dados armazenados pela Plataforma, em repouso',
								'Estados Unidos (empresa); datacenters em São Paulo, Brasil, e nos Estados Unidos — a região de cada Cliente consta do contrato'
							],
							[
								'Cloudflare, Inc. ([política](https://www.cloudflare.com/privacypolicy/))',
								'Rede de entrega, túnel de acesso, DNS e proteção do tráfego',
								'Tráfego HTTPS da Plataforma em trânsito; endereços IP',
								'Estados Unidos (rede global)'
							],
							[
								'GitHub, Inc. (Microsoft) ([política](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement))',
								'Repositório de código e automação de implantação',
								'Código da Plataforma; registros técnicos de implantação',
								'Estados Unidos'
							],
							[
								'Keycloak (software autogerido pela Faradays)',
								'Provedor de identidade: login, papéis e sessões',
								'Nome, e-mail, nome de usuário e grupos dos Usuários',
								'Mesma hospedagem da Plataforma'
							]
						]
					}
				]
			},
			{
				heading: 'Plataforma — canais e inteligência artificial',
				body: [
					{
						type: 'table',
						head: [
							'Fornecedor',
							'Função',
							'Dados tratados',
							'País'
						],
						rows: [
							[
								'Meta Platforms, Inc. / WhatsApp LLC ([política](https://www.whatsapp.com/legal/business-terms))',
								'WhatsApp Business Platform (Cloud API): recepção e envio das mensagens do assistente, download de mídias',
								'Número de WhatsApp dos Representantes, texto das mensagens, áudios e imagens enviados ao assistente, documentos enviados por ele',
								'Estados Unidos'
							],
							[
								'OpenRouter, Inc. ([política](https://openrouter.ai/privacy))',
								'Roteador de modelos de IA: encaminha cada pedido ao provedor de modelo configurado',
								'Texto das mensagens, transcrições, imagens e o contexto necessário à resposta (produtos, preços, clientes da carteira)',
								'Estados Unidos'
							],
							[
								'OpenAI, L.L.C. ([política](https://openai.com/policies/privacy-policy))',
								'Modelos de linguagem e de transcrição de áudio, via OpenRouter',
								'O mesmo conteúdo roteado pelo OpenRouter, apenas durante a geração da resposta',
								'Estados Unidos'
							],
							[
								'Google LLC ([política](https://policies.google.com/privacy))',
								'Modelo de leitura de imagens e documentos, via OpenRouter',
								'Imagens e documentos enviados para leitura, apenas durante a geração da resposta',
								'Estados Unidos'
							],
							[
								'Anthropic, PBC ([política](https://www.anthropic.com/legal/privacy))',
								'Modelo de linguagem alternativo, via OpenRouter, quando selecionado pelo Cliente ou pela Faradays',
								'O mesmo conteúdo roteado pelo OpenRouter, apenas durante a geração da resposta',
								'Estados Unidos'
							]
						]
					},
					'Os provedores de modelos são contratados sob termos que vedam o uso do conteúdo para treinamento dos seus modelos. Qual modelo atende cada função (conversa, transcrição, leitura de imagens) é configuração da Plataforma; Clientes Enterprise podem restringir a lista.'
				]
			},
			{
				heading: 'Plataformas conectadas pelo Cliente',
				body: [
					'Não são subprocessadores da Faradays, e sim serviços que o próprio Cliente contrata e autoriza a Plataforma a acessar. Constam aqui para dar visão completa dos fluxos de dados.',
					{
						type: 'table',
						head: [
							'Serviço',
							'O que a Plataforma faz',
							'Dados envolvidos'
						],
						rows: [
							[
								'Microsoft 365 (Exchange Online, SharePoint, OneDrive, Entra ID) ([política](https://privacy.microsoft.com/privacystatement))',
								'Lê e envia e-mails pelas caixas conectadas; espelha as pastas vinculadas do drive; opcionalmente, login corporativo',
								'Assunto, remetente, destinatários, corpo e anexos dos e-mails; nomes, caminhos e conteúdo dos arquivos vinculados; identidade dos Usuários'
							],
							[
								'Conta WhatsApp Business do Cliente',
								'Usa o número e a conta do Cliente na Cloud API da Meta',
								'Os mesmos da linha Meta acima'
							],
							[
								'ERP do Cliente',
								'Importa os relatórios que o Cliente exporta (clientes, pedidos, notas, boletos, estoque)',
								'Cadastros, limites de crédito, pedidos, faturamento e títulos'
							],
							[
								'Google / Microsoft (login social)',
								'Autentica Usuários pela conta corporativa, quando o Cliente habilita',
								'Nome, e-mail e identificador da conta'
							]
						]
					}
				]
			},
			{
				heading: 'Site',
				body: [
					{
						type: 'table',
						head: [
							'Fornecedor',
							'Função',
							'Dados tratados',
							'País'
						],
						rows: [
							[
								'Vercel Inc. ([política](https://vercel.com/legal/privacy-policy))',
								'Hospedagem e entrega das páginas de faradays.io',
								'Registros de acesso: endereço IP, data e hora, páginas, navegador',
								'Estados Unidos (rede global)'
							],
							[
								'Cal.com, Inc. ([política](https://cal.com/privacy))',
								'Agendamento de conversas e demonstrações (link externo)',
								'Nome, e-mail e horário escolhido por quem agenda',
								'Estados Unidos'
							],
							[
								'Microsoft Corporation — Microsoft 365 / Outlook ([política](https://privacy.microsoft.com/privacystatement))',
								'Caixa contato@faradays.io e demais caixas da equipe',
								'Mensagens trocadas com quem nos escreve',
								'Estados Unidos (dados guardados na região do tenant Microsoft 365 da Faradays)'
							]
						]
					},
					'O Site não usa ferramentas de análise de tráfego nem publicidade. O único cookie gravado é o de preferência de idioma — ver a [Política de Cookies](/cookies).'
				]
			},
			{
				heading: 'Transferência internacional',
				body: [
					'Os fornecedores acima com sede nos Estados Unidos recebem dados a partir do Brasil. Essas transferências se fundamentam no art. 33 da LGPD e na regulamentação da ANPD: cláusulas contratuais padrão incorporadas aos contratos ou termos de cada fornecedor, ou outra salvaguarda reconhecida. A Plataforma é hospedada em São Paulo ou nos Estados Unidos, conforme a região definida no contrato de cada Cliente; quando a região for os Estados Unidos, os Dados do Cliente em repouso ficam fora do Brasil e a transferência se apoia nas mesmas salvaguardas. Os dados de e-mail e drive do Cliente permanecem na região do próprio tenant Microsoft 365 do Cliente; a Plataforma os acessa de onde está hospedada.',
					'Dúvidas sobre um fornecedor específico, ou pedido de cópia das salvaguardas aplicáveis, podem ser dirigidos ao Encarregado pelos canais do [Aviso de Privacidade](/privacidade).'
				]
			}
		]
	},
	en: {
		title: 'Subprocessors and international transfers',
		originalAt: 'September 9, 2026',
		updatedAt: 'September 9, 2026',
		intro: [
			'Subprocessors are the vendors that process personal data on behalf of Faradays so the Website and the Platform can work. This page is the named list the [Privacy Notice](/privacidade) refers to: who each one is, what it receives, why, and in which country it operates.',
			'Active customers are notified at least 30 days before a new subprocessor starts processing Customer Data, and may object on reasonable grounds. Vendors of the same nature may be replaced with the same notice.'
		],
		sections: [
			{
				heading: 'Platform — infrastructure and operations',
				body: [
					{
						type: 'table',
						head: ['Vendor', 'Role', 'Data processed', 'Country'],
						rows: [
							[
								'Vultr Holdings, LLC ([policy](https://www.vultr.com/legal/privacy/))',
								'Hosting of the Platform servers and database',
								'All data stored by the Platform, at rest',
								"United States (company); data centers in São Paulo, Brazil, and in the United States — each Customer's region is set in the contract"
							],
							[
								'Cloudflare, Inc. ([policy](https://www.cloudflare.com/privacypolicy/))',
								'Delivery network, access tunnel, DNS and traffic protection',
								'Platform HTTPS traffic in transit; IP addresses',
								'United States (global network)'
							],
							[
								'GitHub, Inc. (Microsoft) ([policy](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement))',
								'Code repository and deployment automation',
								'Platform code; technical deployment logs',
								'United States'
							],
							[
								'Keycloak (software self-managed by Faradays)',
								'Identity provider: login, roles and sessions',
								"Users' name, e-mail, username and groups",
								'Same hosting as the Platform'
							]
						]
					}
				]
			},
			{
				heading: 'Platform — channels and artificial intelligence',
				body: [
					{
						type: 'table',
						head: ['Vendor', 'Role', 'Data processed', 'Country'],
						rows: [
							[
								'Meta Platforms, Inc. / WhatsApp LLC ([policy](https://www.whatsapp.com/legal/business-terms))',
								"WhatsApp Business Platform (Cloud API): receiving and sending the assistant's messages, media download",
								"Representatives' WhatsApp numbers, message text, audio and images sent to the assistant, documents it sends",
								'United States'
							],
							[
								'OpenRouter, Inc. ([policy](https://openrouter.ai/privacy))',
								'AI model router: forwards each request to the configured model provider',
								'Message text, transcripts, images and the context needed for the reply (products, prices, portfolio clients)',
								'United States'
							],
							[
								'OpenAI, L.L.C. ([policy](https://openai.com/policies/privacy-policy))',
								'Language and audio transcription models, via OpenRouter',
								'The same content routed by OpenRouter, only while generating the reply',
								'United States'
							],
							[
								'Google LLC ([policy](https://policies.google.com/privacy))',
								'Image and document reading model, via OpenRouter',
								'Images and documents sent for reading, only while generating the reply',
								'United States'
							],
							[
								'Anthropic, PBC ([policy](https://www.anthropic.com/legal/privacy))',
								'Alternative language model, via OpenRouter, when selected by the Customer or by Faradays',
								'The same content routed by OpenRouter, only while generating the reply',
								'United States'
							]
						]
					},
					'Model providers are engaged under terms that prohibit using the content to train their models. Which model serves each function (chat, transcription, image reading) is a Platform setting; Enterprise customers may restrict the list.'
				]
			},
			{
				heading: 'Platforms connected by the Customer',
				body: [
					"These are not Faradays' subprocessors, but services the Customer itself contracts and authorizes the Platform to access. They are listed here to give a complete view of the data flows.",
					{
						type: 'table',
						head: [
							'Service',
							'What the Platform does',
							'Data involved'
						],
						rows: [
							[
								'Microsoft 365 (Exchange Online, SharePoint, OneDrive, Entra ID) ([policy](https://privacy.microsoft.com/privacystatement))',
								'Reads and sends e-mail through the connected mailboxes; mirrors the linked drive folders; optionally, corporate login',
								"Subject, sender, recipients, body and attachments of e-mails; names, paths and content of linked files; Users' identity"
							],
							[
								"Customer's WhatsApp Business account",
								"Uses the Customer's number and account on Meta's Cloud API",
								'The same as the Meta row above'
							],
							[
								"Customer's ERP",
								'Imports the reports the Customer exports (clients, orders, invoices, payment slips, stock)',
								'Records, credit limits, orders, invoicing and receivables'
							],
							[
								'Google / Microsoft (social login)',
								'Authenticates Users through their corporate account, when the Customer enables it',
								'Name, e-mail and account identifier'
							]
						]
					}
				]
			},
			{
				heading: 'Website',
				body: [
					{
						type: 'table',
						head: ['Vendor', 'Role', 'Data processed', 'Country'],
						rows: [
							[
								'Vercel Inc. ([policy](https://vercel.com/legal/privacy-policy))',
								'Hosting and delivery of the faradays.io pages',
								'Access logs: IP address, date and time, pages, browser',
								'United States (global network)'
							],
							[
								'Cal.com, Inc. ([policy](https://cal.com/privacy))',
								'Booking of conversations and demos (external link)',
								'Name, e-mail and time slot chosen by the person booking',
								'United States'
							],
							[
								'Microsoft Corporation — Microsoft 365 / Outlook ([policy](https://privacy.microsoft.com/privacystatement))',
								'The contato@faradays.io mailbox and the other team mailboxes',
								'Messages exchanged with people who write to us',
								"United States (data stored in the region of Faradays' Microsoft 365 tenant)"
							]
						]
					},
					'The Website uses no traffic analytics or advertising tools. The only cookie set is the language preference — see the [Cookie Policy](/cookies).'
				]
			},
			{
				heading: 'International transfers',
				body: [
					"The vendors above headquartered in the United States receive data from Brazil. These transfers rely on art. 33 of the LGPD and ANPD regulations: standard contractual clauses incorporated into each vendor's contracts or terms, or another recognized safeguard. The Platform is hosted in São Paulo or in the United States, according to the region set in each Customer's contract; when the region is the United States, Customer Data at rest sits outside Brazil and the transfer relies on the same safeguards. The Customer's e-mail and drive data remain in the region of the Customer's own Microsoft 365 tenant; the Platform accesses them from where it is hosted.",
					'Questions about a specific vendor, or a request for a copy of the applicable safeguards, may be addressed to the Data Protection Officer through the channels in the [Privacy Notice](/privacidade).'
				]
			}
		]
	}
}

export default function SubprocessadoresPage() {
	return <LegalPage slug="/subprocessadores" content={CONTENT} />
}
