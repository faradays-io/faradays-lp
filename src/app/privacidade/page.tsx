import type { Metadata } from 'next'

import type { LegalContent } from '@/components/landing/legal-page'
import { LegalPage } from '@/components/landing/legal-page'
import type { Localized } from '@/lib/i18n'

export const metadata: Metadata = {
	title: 'Privacidade — Faradays',
	description:
		'Como a Faradays trata dados pessoais coletados no site e na operação dos seus produtos.'
}

/* A versão EN é rascunho gerado por IA a partir do PT — precisa de revisão
   jurídica antes de valer como texto oficial. */
const CONTENT: Localized<LegalContent> = {
	pt: {
		title: 'Privacidade',
		updatedAt: '27 de julho de 2026',
		intro: 'Esta política descreve quais dados pessoais a Faradays coleta, por que os coleta e o que você pode exigir a respeito deles, nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018).',
		sections: [
			{
				heading: 'Dados que coletamos',
				body: [
					'No site: dados de navegação (páginas visitadas, origem do acesso, tipo de dispositivo) e, quando você nos procura, os dados que você mesmo informa — nome, e-mail corporativo, empresa e o conteúdo da mensagem.',
					'Nos produtos contratados: os dados operacionais que o cliente conecta às nossas ferramentas, sempre sob instrução dele. Nesse caso, a Faradays atua como operadora e o cliente como controladora.'
				]
			},
			{
				heading: 'Para que usamos',
				body: [
					'Para responder ao seu contato, agendar conversas, entender o uso do site e melhorar o produto. Não vendemos dados pessoais e não os usamos para publicidade de terceiros.'
				]
			},
			{
				heading: 'Com quem compartilhamos',
				body: [
					'Com fornecedores de infraestrutura e ferramentas necessárias para operar o site e os produtos (hospedagem, e-mail, agendamento, análise de uso), sempre limitados ao mínimo necessário e vinculados por contrato.',
					'Com autoridades, quando houver obrigação legal ou ordem judicial.'
				]
			},
			{
				heading: 'Por quanto tempo guardamos',
				body: [
					'Pelo tempo necessário à finalidade que motivou a coleta ou pelo prazo exigido por lei — o que for maior. Encerrada a finalidade, os dados são eliminados ou anonimizados.'
				]
			},
			{
				heading: 'Seus direitos',
				body: [
					'Você pode pedir confirmação de tratamento, acesso, correção, anonimização, portabilidade ou eliminação dos seus dados, além de revogar consentimento. Basta escrever para contato@faradays.io — respondemos dentro dos prazos legais.'
				]
			},
			{
				heading: 'Segurança',
				body: [
					'Adotamos controles técnicos e administrativos para proteger os dados contra acesso não autorizado, perda ou alteração. Nenhum sistema é infalível: se ocorrer incidente relevante, comunicamos os titulares e a ANPD conforme a lei.'
				]
			}
		]
	},
	en: {
		title: 'Privacy',
		updatedAt: 'July 27, 2026',
		intro: 'This policy describes which personal data Faradays collects, why it collects it, and what you may demand regarding it, under the Brazilian General Data Protection Law (Law 13.709/2018 — LGPD).',
		sections: [
			{
				heading: 'Data we collect',
				body: [
					'On the website: browsing data (pages visited, referral source, device type) and, when you reach out to us, the data you provide yourself — name, corporate e-mail, company and the content of your message.',
					"In contracted products: the operational data the client connects to our tools, always under the client's instructions. In that case, Faradays acts as processor and the client as controller."
				]
			},
			{
				heading: 'What we use it for',
				body: [
					'To answer your contact, schedule conversations, understand how the site is used and improve the product. We do not sell personal data and do not use it for third-party advertising.'
				]
			},
			{
				heading: 'Who we share it with',
				body: [
					'With infrastructure providers and tools needed to run the site and the products (hosting, e-mail, scheduling, usage analytics), always limited to the minimum necessary and bound by contract.',
					'With authorities, when there is a legal obligation or court order.'
				]
			},
			{
				heading: 'How long we keep it',
				body: [
					'For as long as needed for the purpose that motivated the collection, or for the period required by law — whichever is longer. Once the purpose ends, the data is deleted or anonymized.'
				]
			},
			{
				heading: 'Your rights',
				body: [
					'You may request confirmation of processing, access, correction, anonymization, portability or deletion of your data, as well as withdraw consent. Just write to contato@faradays.io — we respond within the legal deadlines.'
				]
			},
			{
				heading: 'Security',
				body: [
					'We adopt technical and administrative controls to protect data against unauthorized access, loss or alteration. No system is infallible: if a relevant incident occurs, we notify the data subjects and the ANPD as required by law.'
				]
			}
		]
	}
}

export default function PrivacidadePage() {
	return <LegalPage slug="/privacidade" content={CONTENT} />
}
