'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState
} from 'react'

import type { PostHeading } from '@/lib/blog'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

/* useLayoutEffect avisa quando roda no servidor; no cliente ele é o único que
   posiciona/esconde o índice antes da pintura. */
const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect

/* Offset do scrollTo: NavBar fixo + respiro. Também define a linha de
   leitura — onde o topo do corpo encontra o NavBar. */
const SCROLL_OFFSET = -110

/** Id do corpo do post; é o gatilho de "a leitura começou" do índice fixo. */
export const POST_BODY_ID = 'post-body'

/* O índice só existe onde sobra coluna de borda para ele sem espremer a
   leitura (o corte é o `xl` do Tailwind); abaixo disso a página não tem
   índice, e nada é medido. */
const RAIL_MEDIA = '(min-width: 80rem)'
const REDUCE_MEDIA = '(prefers-reduced-motion: reduce)'

/* Entrada: a linha guia desce com o thumb acendendo junto, e os itens
   aparecem atrás dela um a um. Saída: o bloco inteiro esmaece e escorrega
   para a esquerda, de uma vez só. */
const LINE_DURATION = 0.6
const ITEM_DURATION = 0.45
const ITEM_STAGGER = 0.07
const ITEM_DELAY = 0.12
const EXIT_DURATION = 0.5
/** Deslocamento da saída, em px — o mesmo `-translate-x-1` de antes. */
const EXIT_SHIFT = -4
/** Deslize do thumb entre seções. */
const THUMB_DURATION = 0.4

function prefersReducedMotion() {
	return window.matchMedia(REDUCE_MEDIA).matches
}

/**
 * Índice do heading que abre o trecho ativo: o próprio, ou a seção pai
 * quando o ativo é uma subseção — é o que faz o thumb esticar da seção até a
 * subseção em que a leitura está.
 */
function spanStart(headings: readonly PostHeading[], activeIndex: number) {
	if (headings[activeIndex]?.level !== 3) return activeIndex
	for (let i = activeIndex - 1; i >= 0; i--) {
		if (headings[i].level === 2) return i
	}
	return activeIndex
}

function useScrollSpy(ids: readonly string[]) {
	const [active, setActive] = useState<string | null>(ids[0] ?? null)
	const ready = usePageReady()

	useEffect(() => {
		// ScrollTrigger avalia posições na criação — esperar o loader fechar,
		// como o Reveal faz, evita medir sob o overlay.
		if (!ready || ids.length === 0) return
		const mm = gsap.matchMedia()
		mm.add(RAIL_MEDIA, () => {
			const triggers = ids.map((id, i) =>
				ScrollTrigger.create({
					trigger: `#${CSS.escape(id)}`,
					start: 'top 35%',
					onEnter: () => setActive(id),
					onEnterBack: () => setActive(ids[i - 1] ?? ids[0])
				})
			)
			return () => triggers.forEach((t) => t.kill())
		})
		return () => mm.revert()
	}, [ids, ready])

	return active
}

/**
 * `true` a partir do momento em que o topo do corpo do post cruza a linha de
 * leitura — ou seja, quando o conteúdo chega ao topo da tela e a leitura
 * começa. É o que dá entrada e saída ao índice fixo: durante o header ele
 * não existe.
 */
function useReadingStarted() {
	const [started, setStarted] = useState(false)
	const ready = usePageReady()

	useEffect(() => {
		if (!ready) return
		const body = document.getElementById(POST_BODY_ID)
		if (!body) return
		const mm = gsap.matchMedia()
		mm.add(RAIL_MEDIA, () => {
			const trigger = ScrollTrigger.create({
				trigger: body,
				start: `top ${-SCROLL_OFFSET}px`,
				// `max`: uma vez lendo, o índice acompanha até o fim.
				end: 'max',
				onToggle: (self) => setStarted(self.isActive)
			})
			// Chegar já rolado (âncora, reload no meio) não dispara toggle.
			setStarted(trigger.isActive)
			return () => {
				trigger.kill()
				setStarted(false)
			}
		})
		return () => mm.revert()
	}, [ready])

	return started
}

function useTocNavigate() {
	const lenis = useLenis()

	return useCallback(
		(id: string) => {
			const el = document.getElementById(id)
			if (!el) return
			if (lenis) lenis.scrollTo(el, { offset: SCROLL_OFFSET })
			else el.scrollIntoView()
			history.replaceState(null, '', `#${id}`)
		},
		[lenis]
	)
}

function TocLink({
	heading,
	active,
	onNavigate
}: {
	heading: PostHeading
	active: boolean
	onNavigate: (id: string) => void
}) {
	return (
		<a
			data-toc="item"
			data-toc-id={heading.id}
			href={`#${heading.id}`}
			aria-current={active ? 'true' : undefined}
			onClick={(e) => {
				e.preventDefault()
				onNavigate(heading.id)
			}}
			className={cn(
				'block py-1.5 text-sm leading-snug transition-colors',
				heading.level === 2 ? 'pl-4' : 'pl-8',
				active
					? 'text-foreground'
					: 'text-foreground/50 hover:text-foreground/80'
			)}
		>
			{heading.text}
		</a>
	)
}

/**
 * Índice por extenso: linha guia contínua e um thumb que desliza até o
 * trecho ativo. O thumb é um elemento só — em vez de acender a borda de cada
 * item, ele viaja entre eles, e estica da seção até a subseção quando a
 * leitura está numa delas.
 */
function TocList({
	headings,
	active,
	onNavigate
}: {
	headings: readonly PostHeading[]
	active: string | null
	onNavigate: (id: string) => void
}) {
	const listRef = useRef<HTMLDivElement>(null)
	const thumbRef = useRef<HTMLSpanElement>(null)
	/* A primeira colocação é seca (o thumb já nasce no lugar); daí em diante
	   ele desliza. */
	const placedRef = useRef(false)
	/* O observer de resize é montado uma vez só e chama sempre a colocação
	   mais recente daqui — recriá-lo a cada seção ativa faria seu callback
	   inicial cortar o deslize que acabou de começar. */
	const placeRef = useRef<(animate: boolean) => void>(() => {})

	useIsomorphicLayoutEffect(() => {
		const list = listRef.current
		const thumb = thumbRef.current
		if (!list || !thumb) return

		const place = (animate: boolean) => {
			const activeId = active
			if (!activeId) return
			const activeIndex = headings.findIndex((h) => h.id === activeId)
			if (activeIndex < 0) return
			const startId = headings[spanStart(headings, activeIndex)].id
			const from = list.querySelector<HTMLElement>(
				`[data-toc-id="${CSS.escape(startId)}"]`
			)
			const to = list.querySelector<HTMLElement>(
				`[data-toc-id="${CSS.escape(activeId)}"]`
			)
			if (!from || !to) return

			const vars = {
				y: from.offsetTop,
				height: to.offsetTop + to.offsetHeight - from.offsetTop
			}
			/* Sempre restrito a `y`/`height`: um overwrite amplo aqui mataria
			   também o fade de entrada do thumb (que é da timeline do rail e
			   roda no mesmo alvo), deixando-o preso em `autoAlpha: 0`. */
			if (animate && !prefersReducedMotion()) {
				gsap.to(thumb, {
					...vars,
					duration: THUMB_DURATION,
					ease: 'power3.out',
					overwrite: 'auto'
				})
				return
			}
			gsap.killTweensOf(thumb, 'y,height')
			gsap.set(thumb, vars)
		}

		placeRef.current = place
		place(placedRef.current)
		placedRef.current = true
	}, [active, headings])

	/* Remedida sem animação quando a coluna muda de forma: troca de
	   breakpoint, fonte carregando, zoom. O primeiro callback é o que todo
	   observer emite ao começar a observar — esse não interessa, a colocação
	   inicial já rodou acima. */
	useEffect(() => {
		const list = listRef.current
		if (!list) return
		let initial = true
		const observer = new ResizeObserver(() => {
			if (initial) {
				initial = false
				return
			}
			placeRef.current(false)
		})
		observer.observe(list)
		return () => observer.disconnect()
	}, [])

	return (
		<div ref={listRef} className="relative">
			<span
				data-toc="line"
				aria-hidden
				className="bg-border absolute inset-y-0 left-0 w-px origin-top"
			/>
			<span
				ref={thumbRef}
				data-toc="thumb"
				aria-hidden
				className="bg-brand absolute top-0 left-0 w-px"
			/>
			{headings.map((h) => (
				<TocLink
					key={h.id}
					heading={h}
					active={h.id === active}
					onNavigate={onNavigate}
				/>
			))}
		</div>
	)
}

/** Índice fixo na coluna da borda (lg+), visível só durante a leitura. */
export function PostTocRail({
	headings
}: {
	headings: readonly PostHeading[]
}) {
	const navigate = useTocNavigate()
	const ids = useMemo(() => headings.map((h) => h.id), [headings])
	const active = useScrollSpy(ids)
	const started = useReadingStarted()
	const navRef = useRef<HTMLElement>(null)
	const enterRef = useRef<gsap.core.Timeline | null>(null)

	/* A timeline nasce pausada no frame 0, e um `fromTo` pausado já aplica o
	   estado inicial — é isso que esconde o índice antes da primeira pintura,
	   sem classe escondendo (sem JS, ele fica visível). */
	useIsomorphicLayoutEffect(() => {
		const nav = navRef.current
		if (!nav) return
		const line = nav.querySelector<HTMLElement>('[data-toc="line"]')
		const thumb = nav.querySelector<HTMLElement>('[data-toc="thumb"]')
		const items = nav.querySelectorAll<HTMLElement>('[data-toc="item"]')
		if (!line || !thumb) return
		const reduce = prefersReducedMotion()

		const ctx = gsap.context(() => {
			enterRef.current = gsap
				.timeline({ paused: true })
				.fromTo(
					line,
					{ scaleY: 0 },
					{
						scaleY: 1,
						duration: reduce ? 0 : LINE_DURATION,
						ease: 'power2.out'
					},
					0
				)
				// Os itens descem atrás da linha guia, acompanhando o traço.
				.fromTo(
					items,
					{ autoAlpha: 0, y: -6 },
					{
						autoAlpha: 1,
						y: 0,
						duration: reduce ? 0 : ITEM_DURATION,
						ease: 'power2.out',
						stagger: reduce ? 0 : ITEM_STAGGER
					},
					reduce ? 0 : ITEM_DELAY
				)
				// Entra no mesmo compasso da linha guia: os dois são o mesmo
				// traço, então o thumb não espera os itens para acender.
				.fromTo(
					thumb,
					{ autoAlpha: 0 },
					{
						autoAlpha: 1,
						duration: reduce ? 0 : LINE_DURATION,
						ease: 'power2.out'
					},
					0
				)
		}, nav)

		return () => {
			enterRef.current = null
			// A saída é tweenada fora do contexto (ela sobrevive a
			// re-renders), então some daqui.
			gsap.killTweensOf(nav)
			ctx.revert()
		}
	}, [ids])

	useEffect(() => {
		const nav = navRef.current
		const enter = enterRef.current
		if (!nav || !enter) return

		if (started) {
			// Corta uma saída em curso e retoma a entrada de onde ela parou.
			gsap.killTweensOf(nav)
			gsap.set(nav, { autoAlpha: 1, x: 0 })
			enter.play()
			return
		}
		// Nada a desfazer antes da primeira entrada.
		if (enter.progress() === 0) return
		gsap.to(nav, {
			autoAlpha: 0,
			x: EXIT_SHIFT,
			duration: prefersReducedMotion() ? 0 : EXIT_DURATION,
			ease: 'power2.out',
			// Só rebobina depois de sumir, para a próxima entrada rodar
			// inteira outra vez.
			onComplete: () => enter.pause(0)
		})
	}, [started])

	if (headings.length === 0) return null

	return (
		<nav
			ref={navRef}
			aria-label="Índice do artigo"
			inert={!started}
			className="sticky top-28 max-h-[calc(100svh-9rem)] overflow-y-auto"
		>
			<p
				data-toc="item"
				className="text-foreground/40 mb-4 font-mono text-xs tracking-widest uppercase"
			>
				Neste artigo
			</p>
			<TocList
				headings={headings}
				active={active}
				onNavigate={navigate}
			/>
		</nav>
	)
}
