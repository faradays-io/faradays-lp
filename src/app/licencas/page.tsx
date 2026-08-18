import type { Metadata } from 'next'

import type { LegalContent } from '@/components/landing/legal-page'
import { LegalPage } from '@/components/landing/legal-page'
import type { Localized } from '@/lib/i18n'

export const metadata: Metadata = {
	title: 'Licenças — Faradays',
	description:
		'Software de terceiros, tipografia e demais licenças usadas no site da Faradays.'
}

/* A versão EN é rascunho gerado por IA a partir do PT — precisa de revisão
   jurídica antes de valer como texto oficial. */
const CONTENT: Localized<LegalContent> = {
	pt: {
		title: 'Licenças',
		updatedAt: '27 de julho de 2026',
		intro: 'O que este site usa de terceiros e sob quais licenças. A lista é mantida junto com as dependências do projeto.',
		sections: [
			{
				heading: 'Software de código aberto',
				body: [
					'O site é construído sobre Next.js e React (licença MIT) e estilizado com Tailwind CSS (MIT). A lista completa de dependências e respectivas licenças acompanha o código-fonte do projeto.'
				]
			},
			{
				heading: 'Animação',
				body: [
					'Animações usam GSAP e plugins associados, sob licença comercial da Webflow/GreenSock, e Lenis (MIT) para o scroll.'
				]
			},
			{
				heading: 'Tipografia',
				body: [
					'As fontes empregadas são licenciadas para uso em web pela Faradays. Os arquivos servidos por este site não podem ser extraídos e reutilizados em outros projetos.'
				]
			},
			{
				heading: 'Ícones',
				body: ['Conjunto de ícones Phosphor, sob licença MIT.']
			},
			{
				heading: 'Marcas de terceiros',
				body: [
					'Nomes e logotipos de outras empresas eventualmente citados pertencem aos seus respectivos titulares e aparecem apenas para fins de identificação.'
				]
			}
		]
	},
	en: {
		title: 'Licenses',
		updatedAt: 'July 27, 2026',
		intro: 'What this site uses from third parties and under which licenses. The list is maintained alongside the project dependencies.',
		sections: [
			{
				heading: 'Open-source software',
				body: [
					'The site is built on Next.js and React (MIT license) and styled with Tailwind CSS (MIT). The full list of dependencies and their licenses ships with the project source code.'
				]
			},
			{
				heading: 'Animation',
				body: [
					'Animations use GSAP and associated plugins, under a commercial license from Webflow/GreenSock, and Lenis (MIT) for scrolling.'
				]
			},
			{
				heading: 'Typography',
				body: [
					'The fonts used are licensed for web use by Faradays. The files served by this site may not be extracted and reused in other projects.'
				]
			},
			{
				heading: 'Icons',
				body: ['Phosphor icon set, under the MIT license.']
			},
			{
				heading: 'Third-party trademarks',
				body: [
					'Names and logos of other companies mentioned here belong to their respective owners and appear for identification purposes only.'
				]
			}
		]
	}
}

export default function LicencasPage() {
	return <LegalPage slug="/licencas" content={CONTENT} />
}
