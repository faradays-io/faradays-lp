import type { Metadata } from 'next'

import { LegalPage } from '@/components/landing/legal-page'

export const metadata: Metadata = {
	title: 'Termos — Faradays',
	description:
		'Condições de uso do site da Faradays e relação com os contratos dos produtos.'
}

export default function TermosPage() {
	return (
		<LegalPage
			title="Termos"
			updatedAt="27 de julho de 2026"
			intro="Estes termos regem o uso deste site. O fornecimento dos produtos da Faradays é regido por contrato próprio, firmado com cada cliente."
			sections={[
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
			]}
		/>
	)
}
