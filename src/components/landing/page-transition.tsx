'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useState } from 'react'

import { claimPageReady, markPageReady } from '@/lib/page-ready'

gsap.registerPlugin(ScrollTrigger)

/* Se algum recurso travar, libera assim mesmo: nada justifica manter as
   animações da página congeladas indefinidamente. */
const LOAD_TIMEOUT_MS = 8000

/**
 * Transição de página — usada nas navegações e no reload de todas as rotas
 * exceto a raiz (que tem o `HomeLoader`). Por enquanto é vazia: nenhum
 * overlay, só o ciclo do page-ready — reivindica o sinal no render (para as
 * animações de entrada re-armarem a cada navegação) e o levanta quando
 * `load` + fontes terminam. O visual da transição entra aqui depois.
 *
 * O loader antigo (faixa em gradiente) está em `page-transition-backup.tsx`.
 */
export function PageTransition() {
	/* Em tempo de render, antes de qualquer efeito: avisa a store que este
	   componente é quem vai dar o sinal, senão ela se resolveria sozinha no
	   `load`. No inicializador do useState para rodar só no mount. */
	const [warm] = useState(
		() => typeof window !== 'undefined' && claimPageReady()
	)

	useEffect(() => {
		// Reload sempre começa do topo, independente de hash ou posição
		// restaurada pelo navegador.
		window.history.scrollRestoration = 'manual'
		window.scrollTo(0, 0)

		const finish = () => {
			markPageReady()
			// As fontes chegaram depois do primeiro layout e vários triggers
			// acabaram de ser criados: remede tudo.
			ScrollTrigger.refresh()
		}

		/* Navegação client-side: recursos quentes, libera no próximo frame
		   (o rAF garante que os filhos da página nova já montaram e estão
		   inscritos no sinal). */
		if (warm) {
			const raf = requestAnimationFrame(finish)
			return () => cancelAnimationFrame(raf)
		}

		let pending = 2
		let done = false
		const settle = () => {
			pending--
			if (done || pending > 0) return
			done = true
			finish()
		}

		const onLoad = () => settle()
		if (document.readyState === 'complete') onLoad()
		else window.addEventListener('load', onLoad, { once: true })

		let cancelled = false
		document.fonts.ready.then(() => {
			if (cancelled) return
			settle()
		})

		// Rede de segurança: um recurso preso não congela a página.
		const failsafe = window.setTimeout(() => {
			if (done) return
			done = true
			finish()
		}, LOAD_TIMEOUT_MS)

		return () => {
			cancelled = true
			window.removeEventListener('load', onLoad)
			window.clearTimeout(failsafe)
		}
	}, [warm])

	return null
}
