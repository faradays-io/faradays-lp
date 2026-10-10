import { notFound } from 'next/navigation'

import NewHomePage from '../_new/page'

export { metadata } from '../_new/page'

/* Preview local de `_new/` (pasta privada, fora do roteamento): em dev a
   página abre em /new; em produção a rota segue fora do ar, como decidido
   em docs/politicas-pendencias.md. Some quando `_new` virar a raiz. */
export default function NewHomePreview() {
	if (process.env.NODE_ENV === 'production') notFound()
	return <NewHomePage />
}
