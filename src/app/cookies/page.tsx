import type { Metadata } from 'next'

import { LegalPage } from '@/components/landing/legal-page'

export const metadata: Metadata = {
	title: 'Cookies — Faradays',
	description:
		'Quais cookies e tecnologias semelhantes o site da Faradays usa e como controlá-los.'
}

export default function CookiesPage() {
	return (
		<LegalPage
			title="Cookies"
			updatedAt="27 de julho de 2026"
			intro="Cookies são arquivos pequenos que um site guarda no seu navegador. Esta página explica quais usamos, para quê, e como você pode desligá-los."
			sections={[
				{
					heading: 'Essenciais',
					body: [
						'Mantêm o site funcionando: preferências básicas de exibição e proteção contra abuso. Sem eles a navegação quebra, então não dependem de consentimento.'
					]
				},
				{
					heading: 'Analíticos',
					body: [
						'Medem, de forma agregada, quais páginas são acessadas e por onde as pessoas chegam. Servem para decidir o que melhorar no site — nunca para identificar você individualmente.'
					]
				},
				{
					heading: 'De terceiros',
					body: [
						'Algumas funções são prestadas por serviços externos — por exemplo, o agendamento de conversas. Esses serviços podem definir cookies próprios, sujeitos às políticas deles.'
					]
				},
				{
					heading: 'Como controlar',
					body: [
						'Todo navegador permite bloquear ou apagar cookies nas configurações de privacidade. Bloquear os essenciais pode impedir partes do site de funcionar.'
					]
				},
				{
					heading: 'Relação com a privacidade',
					body: [
						'Dados coletados por cookies seguem a nossa Política de Privacidade, inclusive quanto aos seus direitos como titular.'
					]
				}
			]}
		/>
	)
}
