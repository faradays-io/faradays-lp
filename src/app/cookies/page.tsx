import type { Metadata } from 'next'

import type { LegalContent } from '@/components/landing/legal-page'
import { LegalPage } from '@/components/landing/legal-page'
import type { Localized } from '@/lib/i18n'

export const metadata: Metadata = {
	title: 'Política de Cookies — Faradays',
	description:
		'Quais cookies e tecnologias semelhantes o Site da Faradays usa, para quê, e como controlá-los.'
}

/* Reflete o que o Site de fato grava: só o cookie de idioma (LANG_COOKIE em
   src/lib/i18n.ts). Se entrar analytics ou pixel, esta página, o Aviso de
   Privacidade e um banner de consentimento precisam mudar ANTES do deploy. */
const CONTENT: Localized<LegalContent> = {
	pt: {
		title: 'Política de Cookies',
		originalAt: '27 de julho de 2026',
		updatedAt: '9 de setembro de 2026',
		intro: 'Cookies são arquivos pequenos que um Site guarda no seu navegador. Esta página diz exatamente quais usamos, para quê, e como você pode controlá-los. Ela complementa o [Aviso de Privacidade](/privacidade).',
		sections: [
			{
				heading: 'O que o Site usa hoje',
				body: [
					'O Site grava **um único cookie**, estritamente necessário:',
					{
						type: 'table',
						head: [
							'Cookie',
							'Finalidade',
							'Duração',
							'Quem define'
						],
						rows: [
							[
								'faradays-lang',
								'Guardar o idioma escolhido no seletor (português ou inglês), para que a próxima página já abra nele',
								'12 meses',
								'Faradays (primeira parte)'
							]
						]
					},
					'Não usamos cookies de análise de tráfego, de publicidade ou de redes sociais, e não há pixels de rastreamento instalados. As fontes tipográficas são servidas pelo próprio Site — nenhuma requisição vai a terceiros para carregá-las.'
				]
			},
			{
				heading: 'Cookies da Plataforma',
				body: [
					'A Plataforma contratada pelos nossos clientes usa cookies de **sessão** para manter o Usuário autenticado depois do login. São estritamente necessários: sem eles não há como saber quem está acessando. Expiram ao fim da sessão ou do prazo configurado pelo provedor de identidade.'
				]
			},
			{
				heading: 'Serviços de terceiros por link',
				body: [
					'Alguns caminhos do Site levam a serviços externos — por exemplo, o agendamento de conversas abre a página do Cal.com em nova aba. Ao sair do nosso domínio, valem os cookies e as políticas do serviço de destino, sobre os quais a Faradays não tem controle.'
				]
			},
			{
				heading: 'Se isso mudar',
				body: [
					'Se passarmos a usar cookies opcionais — de medição de audiência, por exemplo —, eles só serão ativados depois do seu consentimento, dado num aviso exibido ao entrar no Site, e você poderá recusá-los sem perder nenhuma função. Esta página e o Aviso de Privacidade serão atualizados antes da mudança entrar no ar.'
				]
			},
			{
				heading: 'Como controlar',
				body: [
					'Todo navegador permite ver, bloquear ou apagar cookies nas configurações de privacidade. Apagar o cookie de idioma só faz o Site voltar ao português na próxima visita. Bloquear os cookies de sessão da Plataforma impede o login.'
				]
			},
			{
				heading: 'Base legal e seus direitos',
				body: [
					'O cookie de idioma e os cookies de sessão se apoiam no legítimo interesse (art. 7º, IX, da LGPD), por serem indispensáveis ao funcionamento do que você pediu. Os dados eventualmente coletados por cookies seguem o [Aviso de Privacidade](/privacidade), inclusive quanto aos seus direitos como Titular e aos canais para exercê-los.'
				]
			}
		]
	},
	en: {
		title: 'Cookie Policy',
		originalAt: 'July 27, 2026',
		updatedAt: 'September 9, 2026',
		intro: 'Cookies are small files a Website stores in your browser. This page says exactly which ones we use, why, and how you can control them. It complements the [Privacy Notice](/privacidade).',
		sections: [
			{
				heading: 'What the Website uses today',
				body: [
					'The Website sets **a single cookie**, strictly necessary:',
					{
						type: 'table',
						head: ['Cookie', 'Purpose', 'Duration', 'Set by'],
						rows: [
							[
								'faradays-lang',
								'Store the language chosen in the toggle (Portuguese or English), so the next page opens in it',
								'12 months',
								'Faradays (first party)'
							]
						]
					},
					'We do not use traffic analytics, advertising or social media cookies, and there are no tracking pixels installed. Fonts are served by the Website itself — no request goes to third parties to load them.'
				]
			},
			{
				heading: 'Platform cookies',
				body: [
					'The Platform contracted by our customers uses **session** cookies to keep the User signed in after login. They are strictly necessary: without them there is no way to know who is accessing. They expire at the end of the session or of the period configured by the identity provider.'
				]
			},
			{
				heading: 'Third-party services via links',
				body: [
					'Some paths on the Website lead to external services — for example, booking a conversation opens the Cal.com page in a new tab. Once you leave our domain, the cookies and policies of the destination service apply, over which Faradays has no control.'
				]
			},
			{
				heading: 'If this changes',
				body: [
					'If we start using optional cookies — audience measurement, for example — they will only be activated after your consent, given in a notice shown when you enter the Website, and you will be able to refuse them without losing any feature. This page and the Privacy Notice will be updated before the change goes live.'
				]
			},
			{
				heading: 'How to control',
				body: [
					'Every browser lets you view, block or delete cookies in its privacy settings. Deleting the language cookie only makes the Website revert to Portuguese on your next visit. Blocking the Platform session cookies prevents login.'
				]
			},
			{
				heading: 'Legal basis and your rights',
				body: [
					'The language cookie and the session cookies rely on legitimate interest (art. 7, IX, of the LGPD), as they are indispensable to what you asked for. Any data collected through cookies follows the [Privacy Notice](/privacidade), including your rights as a Data Subject and the channels to exercise them.'
				]
			}
		]
	}
}

export default function CookiesPage() {
	return <LegalPage slug="/cookies" content={CONTENT} />
}
