import type { Metadata } from 'next'

import { LegalIndex } from '@/components/landing/legal-index'

export const metadata: Metadata = {
	title: 'Políticas — Faradays',
	description:
		'Termos de uso, aviso de privacidade, subprocessadores, suporte, cookies e licenças da Faradays em um lugar só.'
}

export default function PoliticasPage() {
	return <LegalIndex />
}
