import type { Metadata } from 'next'

import { LegalPage } from '@/components/landing/legal-page'

export const metadata: Metadata = {
	title: 'Licenças — Faradays',
	description:
		'Software de terceiros, tipografia e demais licenças usadas no site da Faradays.'
}

export default function LicencasPage() {
	return (
		<LegalPage
			title="Licenças"
			updatedAt="27 de julho de 2026"
			intro="O que este site usa de terceiros e sob quais licenças. A lista é mantida junto com as dependências do projeto."
			sections={[
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
			]}
		/>
	)
}
