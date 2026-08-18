import type { Metadata } from 'next'

import type { LegalContent } from '@/components/landing/legal-page'
import { LegalPage } from '@/components/landing/legal-page'
import type { Localized } from '@/lib/i18n'

export const metadata: Metadata = {
	title: 'Termos — Faradays',
	description:
		'Condições de uso do site da Faradays e relação com os contratos dos produtos.'
}

/* A versão EN é rascunho gerado por IA a partir do PT — precisa de revisão
   jurídica antes de valer como texto oficial. */
const CONTENT: Localized<LegalContent> = {
	pt: {
		title: 'Termos',
		updatedAt: '27 de julho de 2026',
		intro: 'Estes termos regem o uso deste site. O fornecimento dos produtos da Faradays é regido por contrato próprio, firmado com cada cliente.',
		sections: [
			{
				heading: 'Uso do site',
				body: [
					'O conteúdo aqui publicado é informativo. Você pode navegar, ler e compartilhar os links livremente; não pode raspar o site em escala, tentar burlar controles de acesso ou usá-lo para atividade ilícita.'
				]
			},
			{
				heading: 'Propriedade intelectual',
				body: [
					'Marca, identidade visual, textos, código e materiais deste site pertencem à Faradays. Reprodução comercial depende de autorização por escrito.'
				]
			},
			{
				heading: 'Sem promessa de resultado',
				body: [
					'Números, demonstrações e exemplos apresentados no site são ilustrativos e não constituem garantia de desempenho. Compromissos de resultado, quando existirem, vivem no contrato.'
				]
			},
			{
				heading: 'Disponibilidade',
				body: [
					'Podemos alterar, suspender ou descontinuar partes do site a qualquer momento, inclusive para manutenção. Não há garantia de disponibilidade ininterrupta.'
				]
			},
			{
				heading: 'Alterações destes termos',
				body: [
					'Podemos atualizar este texto. A versão vigente é sempre a publicada nesta página, com a data de revisão no topo.'
				]
			},
			{
				heading: 'Lei aplicável',
				body: [
					'Aplica-se a legislação brasileira, com foro na comarca da sede da Faradays, salvo disposição contratual em contrário.'
				]
			}
		]
	},
	en: {
		title: 'Terms',
		updatedAt: 'July 27, 2026',
		intro: 'These terms govern the use of this website. The supply of Faradays products is governed by a separate agreement signed with each client.',
		sections: [
			{
				heading: 'Use of the site',
				body: [
					'The content published here is informational. You may browse, read and share the links freely; you may not scrape the site at scale, attempt to bypass access controls or use it for unlawful activity.'
				]
			},
			{
				heading: 'Intellectual property',
				body: [
					'The brand, visual identity, texts, code and materials on this site belong to Faradays. Commercial reproduction requires written authorization.'
				]
			},
			{
				heading: 'No promise of results',
				body: [
					'Figures, demonstrations and examples presented on the site are illustrative and do not constitute a performance guarantee. Commitments to results, where they exist, live in the contract.'
				]
			},
			{
				heading: 'Availability',
				body: [
					'We may change, suspend or discontinue parts of the site at any time, including for maintenance. There is no guarantee of uninterrupted availability.'
				]
			},
			{
				heading: 'Changes to these terms',
				body: [
					'We may update this text. The version in force is always the one published on this page, with the revision date at the top.'
				]
			},
			{
				heading: 'Governing law',
				body: [
					"Brazilian law applies, with venue in the judicial district of Faradays' headquarters, unless the contract provides otherwise."
				]
			}
		]
	}
}

export default function TermosPage() {
	return <LegalPage slug="/termos" content={CONTENT} />
}
