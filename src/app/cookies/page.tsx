import type { Metadata } from 'next'

import type { LegalContent } from '@/components/landing/legal-page'
import { LegalPage } from '@/components/landing/legal-page'
import type { Localized } from '@/lib/i18n'

export const metadata: Metadata = {
	title: 'Cookies — Faradays',
	description:
		'Quais cookies e tecnologias semelhantes o site da Faradays usa e como controlá-los.'
}

/* A versão EN é rascunho gerado por IA a partir do PT — precisa de revisão
   jurídica antes de valer como texto oficial. */
const CONTENT: Localized<LegalContent> = {
	pt: {
		title: 'Cookies',
		updatedAt: '27 de julho de 2026',
		intro: 'Cookies são arquivos pequenos que um site guarda no seu navegador. Esta página explica quais usamos, para quê, e como você pode desligá-los.',
		sections: [
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
		]
	},
	en: {
		title: 'Cookies',
		updatedAt: 'July 27, 2026',
		intro: 'Cookies are small files a website stores in your browser. This page explains which ones we use, what for, and how you can turn them off.',
		sections: [
			{
				heading: 'Essential',
				body: [
					'They keep the site working: basic display preferences and abuse protection. Without them navigation breaks, so they do not depend on consent.'
				]
			},
			{
				heading: 'Analytics',
				body: [
					'They measure, in aggregate, which pages are visited and how people arrive. They help us decide what to improve on the site — never to identify you individually.'
				]
			},
			{
				heading: 'Third-party',
				body: [
					'Some features are provided by external services — for example, conversation scheduling. Those services may set their own cookies, subject to their own policies.'
				]
			},
			{
				heading: 'How to control them',
				body: [
					'Every browser lets you block or delete cookies in its privacy settings. Blocking the essential ones may stop parts of the site from working.'
				]
			},
			{
				heading: 'Relation to privacy',
				body: [
					'Data collected through cookies follows our Privacy Policy, including your rights as a data subject.'
				]
			}
		]
	}
}

export default function CookiesPage() {
	return <LegalPage slug="/cookies" content={CONTENT} />
}
