import type { Metadata } from 'next'

import type { LegalContent } from '@/components/landing/legal-page'
import { LegalPage } from '@/components/landing/legal-page'
import type { Localized } from '@/lib/i18n'

export const metadata: Metadata = {
	title: 'Exclusão de dados — Faradays',
	description:
		'Como pedir a eliminação de dados pessoais tratados pela Faradays, inclusive os obtidos pelo WhatsApp, o prazo de atendimento e o que a lei nos obriga a manter.'
}

/* Página de instruções de exclusão — é a URL que vai no campo "Data Deletion
   Instructions" do app na Meta e a forma concreta de exercer o art. 18 da
   LGPD. Deve continuar acessível sem login e sem depender do idioma. */
const CONTENT: Localized<LegalContent> = {
	pt: {
		title: 'Como pedir a exclusão dos seus dados',
		originalAt: '9 de setembro de 2026',
		updatedAt: '9 de setembro de 2026',
		intro: [
			'Esta página explica, passo a passo, como pedir a eliminação de dados pessoais que a Faradays trata — no site, na Plataforma ou por meio do assistente no WhatsApp —, em quanto tempo atendemos e o que a lei nos obriga a manter. Ela detalha o direito de eliminação descrito no [Aviso de Privacidade](/privacidade).'
		],
		sections: [
			{
				heading: 'Quem pode pedir',
				body: [
					'Qualquer pessoa cujos dados pessoais a Faradays trate. O caminho depende de como os seus dados chegaram até nós:',
					{
						type: 'table',
						head: [
							'Você é',
							'Quem responde pelos seus dados',
							'Para onde pedir'
						],
						rows: [
							[
								'Visitante do Site ou pessoa que falou conosco comercialmente',
								'Faradays, como Controladora',
								'Diretamente à Faradays, pelos passos abaixo'
							],
							[
								'Usuário da Plataforma (administrador, gestor ou Representante) indicado por um Cliente',
								'A Faradays, para conta e identidade; o Cliente, para o conteúdo da operação',
								'Ao administrador da sua empresa ou diretamente à Faradays, que aciona o Cliente quando preciso'
							],
							[
								'Pessoa cujos dados constam nos cadastros de um Cliente (contato em cliente final ou fornecedor)',
								'O Cliente, como Controlador; a Faradays atua como Operadora',
								'Ao Cliente. Se o pedido chegar à Faradays, encaminhamos a ele e informamos você'
							]
						]
					}
				]
			},
			{
				heading: 'Passo a passo',
				body: [
					{
						type: 'list',
						ordered: true,
						items: [
							'Escreva para **contato@faradays.io** com o assunto **"Exclusão de dados"**.',
							'Informe o seu nome e o e-mail ou número de WhatsApp que você usou conosco — é por eles que localizamos os seus dados.',
							'Diga a sua relação com a Faradays (visitante, Usuário de qual empresa, contato de qual Cliente) e, se quiser, quais dados deseja eliminar. Sem essa indicação, tratamos o pedido como eliminação de tudo o que for possível.',
							'Aguarde a nossa confirmação. Podemos pedir uma comprovação simples de identidade — por exemplo, responder a partir do mesmo e-mail ou número —, para não apagar dados a pedido de outra pessoa.'
						]
					},
					'Não é preciso ter conta, senha ou acesso à Plataforma para pedir. O pedido é gratuito.'
				]
			},
			{
				heading: 'Prazos',
				body: [
					{
						type: 'list',
						items: [
							'**Confirmação de recebimento:** em até 5 dias úteis.',
							'**Conclusão:** em até 15 dias a partir da confirmação da identidade, com uma resposta dizendo o que foi eliminado e o que ficou retido, e por quê.',
							'**Cópias de segurança:** os dados eliminados dos sistemas ativos desaparecem das cópias de segurança no ciclo normal de rotação, de 14 dias.'
						]
					}
				]
			},
			{
				heading: 'Dados obtidos pelo WhatsApp',
				body: [
					'Se você é Representante e conversou com o assistente, os dados que temos por meio da WhatsApp Business Platform são o seu número, o texto das mensagens nas duas direções, transcrições de áudios e texto extraído de fotos, e identificadores técnicos das mensagens. Os arquivos de áudio e imagem em si não são guardados pela Plataforma.',
					'Você pode pedir a eliminação desse histórico pelos passos acima. Como o conteúdo das conversas pertence à operação do Cliente que você representa, a Faradays confirma o pedido com o administrador desse Cliente antes de apagar; cotações e documentos já emitidos a partir das conversas seguem as regras de retenção do Cliente.',
					'Para apagar o que está no seu próprio aparelho ou na conta do WhatsApp, use as ferramentas do aplicativo — isso é gerido pela Meta, não pela Faradays.'
				]
			},
			{
				heading: 'O que a lei nos obriga a manter',
				body: [
					'Alguns dados não podem ser eliminados de imediato, e nesses casos dizemos exatamente o quê e até quando:',
					{
						type: 'list',
						items: [
							'**Registros de acesso**, por no mínimo 6 meses, pelo art. 15 do Marco Civil da Internet;',
							'**Trilha de auditoria** das ações relevantes na Plataforma, pela duração do contrato do Cliente e até 5 anos depois, para responsabilização e defesa em processos;',
							'**Dados fiscais e contratuais**, pelos prazos da legislação fiscal e civil, em geral 5 anos;',
							'**Dados anonimizados**, que deixam de ser pessoais e podem ser mantidos para métricas agregadas.'
						]
					},
					'Terminados esses prazos, os dados são eliminados ou anonimizados.'
				]
			},
			{
				heading: 'Se não ficar satisfeito',
				body: [
					'Se a resposta não resolver, escreva de novo para o mesmo endereço pedindo revisão pelo Encarregado. Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD), em gov.br/anpd.'
				]
			}
		]
	},
	en: {
		title: 'How to request deletion of your data',
		originalAt: 'September 9, 2026',
		updatedAt: 'September 9, 2026',
		intro: [
			'This page explains, step by step, how to request deletion of personal data that Faradays processes — on the website, on the Platform or through the WhatsApp assistant —, how long we take and what the law requires us to keep. It details the right to deletion described in the [Privacy Notice](/privacidade).'
		],
		sections: [
			{
				heading: 'Who can request',
				body: [
					'Anyone whose personal data Faradays processes. The path depends on how your data reached us:',
					{
						type: 'table',
						head: [
							'You are',
							'Who is responsible for your data',
							'Where to send the request'
						],
						rows: [
							[
								'A Website visitor or someone who talked to us commercially',
								'Faradays, as Controller',
								'Directly to Faradays, following the steps below'
							],
							[
								'A Platform User (administrator, manager or Representative) designated by a Customer',
								'Faradays, for account and identity; the Customer, for the content of the operation',
								"To your company's administrator or directly to Faradays, which involves the Customer when needed"
							],
							[
								"A person whose data appears in a Customer's records (a contact at an end client or supplier)",
								'The Customer, as Controller; Faradays acts as Processor',
								'To the Customer. If the request reaches Faradays, we forward it and let you know'
							]
						]
					}
				]
			},
			{
				heading: 'Step by step',
				body: [
					{
						type: 'list',
						ordered: true,
						items: [
							'Write to **contato@faradays.io** with the subject **"Exclusão de dados"** (data deletion).',
							'Provide your name and the e-mail or WhatsApp number you used with us — that is how we locate your data.',
							'State your relationship with Faradays (visitor, User of which company, contact of which Customer) and, if you wish, which data you want deleted. Without that indication, we treat the request as deletion of everything that can be deleted.',
							'Wait for our confirmation. We may ask for simple proof of identity — for example, replying from the same e-mail or number — so we do not delete data at the request of someone else.'
						]
					},
					'You do not need an account, password or access to the Platform to request. The request is free of charge.'
				]
			},
			{
				heading: 'Timeframes',
				body: [
					{
						type: 'list',
						items: [
							'**Acknowledgement:** within 5 business days.',
							'**Completion:** within 15 days of identity confirmation, with a reply stating what was deleted and what was retained, and why.',
							'**Backups:** data deleted from active systems disappears from backups in the normal rotation cycle of 14 days.'
						]
					}
				]
			},
			{
				heading: 'Data obtained through WhatsApp',
				body: [
					'If you are a Representative and talked to the assistant, the data we hold through the WhatsApp Business Platform is your number, the message text in both directions, transcripts of voice notes and text extracted from photos, and technical message identifiers. The audio and image files themselves are not stored by the Platform.',
					"You can request deletion of that history through the steps above. Since the content of the conversations belongs to the operation of the Customer you represent, Faradays confirms the request with that Customer's administrator before deleting; quotes and documents already issued from the conversations follow the Customer's retention rules.",
					'To delete what is on your own device or in your WhatsApp account, use the tools in the app — that is managed by Meta, not by Faradays.'
				]
			},
			{
				heading: 'What the law requires us to keep',
				body: [
					'Some data cannot be deleted immediately, and in those cases we say exactly what and until when:',
					{
						type: 'list',
						items: [
							'**Access logs**, for at least 6 months, under art. 15 of the Brazilian Internet Act;',
							"**Audit trail** of relevant actions on the Platform, for the duration of the Customer's contract and up to 5 years afterwards, for accountability and defense in proceedings;",
							'**Tax and contract data**, for the periods set by tax and civil law, generally 5 years;',
							'**Anonymized data**, which is no longer personal and may be kept for aggregated metrics.'
						]
					},
					'Once those periods end, the data is deleted or anonymized.'
				]
			},
			{
				heading: 'If you are not satisfied',
				body: [
					'If the reply does not resolve the matter, write again to the same address asking for review by the Data Protection Officer. You may also file a complaint with the Brazilian National Data Protection Authority (ANPD), at gov.br/anpd.'
				]
			}
		]
	}
}

export default function ExclusaoDeDadosPage() {
	return <LegalPage slug="/exclusao-de-dados" content={CONTENT} />
}
