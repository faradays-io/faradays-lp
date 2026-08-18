import type { Metadata } from 'next'

import { HomeContent } from '@/components/landing/home-content'

export const metadata: Metadata = {
	title: 'Faradays',
	description:
		'Inteligência artificial aplicada à operação. Cada frente da operação em um produto próprio.'
}

/**
 * Home institucional em uma tela só (referência de postura:
 * berkshirehathaway.com) — sem hero, sem seções, sem scroll: marca, uma
 * frase do que a empresa faz, o índice de rotas para as subpáginas e o
 * rodapé legal. Tudo o que é produto vive nas subpáginas; esta página só
 * direciona.
 *
 * O corpo vive em HomeContent (client): toda a copy troca com o toggle de
 * idioma, então o texto precisa renderizar sob o LanguageProvider.
 */
export default function HomePage() {
	return <HomeContent />
}
