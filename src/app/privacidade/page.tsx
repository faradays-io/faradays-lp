import type { Metadata } from 'next'

import { LegalPage } from '@/components/landing/legal-page'

export const metadata: Metadata = {
	title: 'Privacidade — Faradays',
	description:
		'Como a Faradays trata dados pessoais coletados no site e na operação dos seus produtos.'
}

export default function PrivacidadePage() {
	return (
		<LegalPage
			title="Privacidade"
			updatedAt="27 de julho de 2026"
			intro="Esta política descreve quais dados pessoais a Faradays coleta, por que os coleta e o que você pode exigir a respeito deles, nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018)."
			sections={[
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
			]}
		/>
	)
}
