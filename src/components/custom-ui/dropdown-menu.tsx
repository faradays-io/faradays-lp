'use client'

import {
	type ComponentProps,
	type ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState
} from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ *
 * DropdownMenu — menu suspenso de uso geral. O trigger alterna `open`; o
 * painel fecha em qualquer pointerdown fora ou no Escape (não há backdrop)
 * e revela por opacidade+escala: entrada com um leve overshoot, saída na
 * ease do projeto (`ease-fluid`).
 *
 * O painel é PORTALADO e posicionado `fixed` contra o rect do trigger, em
 * vez de absoluto dentro do fluxo: qualquer ancestral com `overflow` (uma
 * `SmoothScrollArea`, uma coluna sticky com rolagem própria) cortaria um
 * painel absoluto. Como consequência, a posição é recalculada em
 * scroll/resize para o painel seguir colado ao trigger.
 *
 * O trigger é render-prop: quem usa é dono do elemento (Button, ícone, o
 * que for) e liga `toggle` + o estado ARIA por conta própria.
 *
 *   <DropdownMenu
 *     trigger={({ open, toggle }) => (
 *       <Button aria-haspopup="menu" aria-expanded={open} onClick={toggle}>
 *         Menu
 *       </Button>
 *     )}
 *   >
 *     <DropdownItem icon={Gear}>Configurações</DropdownItem>
 *   </DropdownMenu>
 * ------------------------------------------------------------------ */

type TriggerState = { open: boolean; toggle: () => void; close: () => void }

type Pos = { top: number; left: number; width: number }

/** Respiro entre o trigger e o painel, em px. */
const GAP = 8

/* Classes que abrem escopo de tema no projeto (ver globals.css). O <html>
   roda com o tema forçado dark e as páginas claras se embrulham em `.light`;
   como o painel é portalado para fora desse embrulho, ele precisa levar o
   escopo do trecho onde o trigger vive — senão um dropdown numa seção clara
   abre com a paleta escura da raiz. */
const THEME_SCOPES = ['light', 'light-home', 'dark']

export function DropdownMenu({
	trigger,
	children,
	side = 'bottom',
	align = 'start',
	className,
	panelClassName
}: {
	trigger: (state: TriggerState) => ReactNode
	/** Render-prop opcional: o painel que precisa saber se está aberto (para
	 *  focar um campo) ou fechar por conta própria (Enter numa busca) recebe
	 *  o MESMO estado do trigger. ReactNode continua valendo. */
	children: ReactNode | ((state: TriggerState) => ReactNode)
	side?: 'bottom' | 'top'
	align?: 'start' | 'end'
	className?: string
	panelClassName?: string
}) {
	const [open, setOpen] = useState(false)
	const [pos, setPos] = useState<Pos | null>(null)
	const anchorRef = useRef<HTMLDivElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	/* Alvo do portal — só existe no cliente, então ele também é o sinal de
	   "já montou". Dentro de um Dialog o painel NÃO pode ir para o <body>: o
	   Dialog é modal e prende o foco no próprio conteúdo, então um campo
	   fora dele recebe o clique mas nunca a digitação. Hospedado dentro do
	   dialog, ele entra no focus scope e funciona. */
	const [host, setHost] = useState<HTMLElement | null>(null)
	/** Escopo de tema herdado do trigger, repassado ao painel portalado. */
	const [themeScope, setThemeScope] = useState('')

	useEffect(() => {
		const anchor = anchorRef.current
		setHost(
			(anchor?.closest(
				'[data-slot="dialog-content"]'
			) as HTMLElement | null) ?? document.body
		)

		const scope = anchor?.closest('.light, .dark')
		setThemeScope(
			scope
				? THEME_SCOPES.filter((name) =>
						scope.classList.contains(name)
					).join(' ')
				: ''
		)
	}, [])

	/* Mede o trigger e encosta o painel nele. `side` é o lado PREFERIDO: se
	   não couber ali (trigger perto da borda), ele FLIPA para o oposto, e um
	   clamp final garante que nunca abre fora da viewport. */
	const place = useCallback(() => {
		const anchor = anchorRef.current
		const panel = panelRef.current
		if (!anchor) return
		const a = anchor.getBoundingClientRect()
		const ph = panel?.offsetHeight ?? 0
		const pw = panel?.offsetWidth ?? a.width

		/* Limites do flip/clamp: a viewport no caso normal, o RETÂNGULO DO
		   DIALOG quando o painel está hospedado nele — o dialog rola, e
		   vazar dele significaria lista cortada em vez de rolável. */
		const inDialog = host !== null && host !== document.body
		const h = inDialog ? host.getBoundingClientRect() : null
		const limTop = h ? h.top : 0
		const limBottom = h ? h.bottom : window.innerHeight
		const limLeft = h ? h.left : 0
		const limRight = h ? h.right : window.innerWidth

		let top = side === 'bottom' ? a.bottom + GAP : a.top - GAP - ph
		if (side === 'bottom' && top + ph > limBottom - GAP) {
			const above = a.top - GAP - ph
			if (above >= limTop + GAP) top = above
		} else if (side === 'top' && top < limTop + GAP) {
			const below = a.bottom + GAP
			if (below + ph <= limBottom - GAP) top = below
		}
		top = Math.max(limTop + GAP, Math.min(top, limBottom - GAP - ph))

		let left = align === 'start' ? a.left : a.right - pw
		left = Math.max(limLeft + GAP, Math.min(left, limRight - GAP - pw))

		/* O dialog tem `transform`, o que o torna o bloco CONTINENTE de um
		   filho `fixed`: lá dentro, top/left contam a partir da padding box
		   dele — e o conteúdo ROLA. Sem somar a rolagem, o painel abre
		   deslocado exatamente `scrollTop`. A borda entra na conta porque o
		   rect a inclui e a padding box não. */
		if (h && host) {
			const style = getComputedStyle(host)
			top -= h.top + parseFloat(style.borderTopWidth || '0')
			top += host.scrollTop
			left -= h.left + parseFloat(style.borderLeftWidth || '0')
			left += host.scrollLeft
		}
		setPos({ top, left, width: a.width })
	}, [side, align, host])

	// Posiciona antes da pintura ao abrir, e mantém colado em scroll/resize.
	useLayoutEffect(() => {
		if (!open) return
		place()
		// Scroll na fase de captura pega todo scroller (incl. SmoothScrollArea).
		window.addEventListener('scroll', place, true)
		window.addEventListener('resize', place)
		return () => {
			window.removeEventListener('scroll', place, true)
			window.removeEventListener('resize', place)
		}
	}, [open, place])

	/* Fecha em clique fora ou Escape — o menu não tem backdrop. Como o painel
	   é portalado, "fora" é nem a âncora nem o painel. */
	useEffect(() => {
		if (!open) return
		function onPointer(e: PointerEvent) {
			const t = e.target as Node
			if (
				!anchorRef.current?.contains(t) &&
				!panelRef.current?.contains(t)
			) {
				setOpen(false)
			}
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') setOpen(false)
		}
		document.addEventListener('pointerdown', onPointer)
		document.addEventListener('keydown', onKey)
		return () => {
			document.removeEventListener('pointerdown', onPointer)
			document.removeEventListener('keydown', onKey)
		}
	}, [open])

	/* Deixa o painel rolar nativamente sob o Lenis global: ele escuta o wheel
	   na janela e rola a página; parando a propagação no painel, o evento não
	   chega nele e o `overflow-y` do painel rola normal (mais confiável que
	   só `data-lenis-prevent` para conteúdo portalado). */
	useEffect(() => {
		const panel = panelRef.current
		if (!open || !panel) return
		const stop = (e: WheelEvent) => e.stopPropagation()
		panel.addEventListener('wheel', stop, { passive: true })
		return () => panel.removeEventListener('wheel', stop)
	}, [open])

	const toggle = () => setOpen((o) => !o)
	const close = () => setOpen(false)

	return (
		<div ref={anchorRef} className={cn('inline-block', className)}>
			{trigger({ open, toggle, close })}

			{host &&
				createPortal(
					<div
						className={cn(
							'pointer-events-none fixed z-50',
							themeScope
						)}
						style={{
							top: pos?.top ?? -9999,
							left: pos?.left ?? -9999,
							minWidth: pos?.width
						}}
					>
						{/* Reveal por opacidade+escala (não anima altura): assim o
						    max-height/scroll do painel valem para listas longas —
						    animar altura expandiria até o max-content dos itens e
						    furaria o max-height. */}
						<div
							ref={panelRef}
							role="menu"
							/* Rola dentro do painel; data-lenis-prevent evita o
							   smooth-scroll global engolir o wheel. maxHeight
							   inline porque o arbitrary com vírgula no min() nem
							   sempre é gerado pelo Tailwind. */
							data-lenis-prevent
							style={{ maxHeight: 'min(20rem, 60vh)' }}
							onClick={(e) => {
								// Semântica de menu: escolher um item fecha.
								if (
									(e.target as HTMLElement).closest(
										'[role=menuitem]'
									)
								)
									setOpen(false)
							}}
							className={cn(
								/* `text-card-foreground` explícito: `color` é herdado como valor JÁ
								   resolvido do <body> (que é escuro, tema forçado), então
								   reabrir `--foreground` no escopo do portal não repinta o
								   texto — só uma declaração no próprio painel faz isso. */
								'bg-card text-card-foreground flex w-max min-w-full origin-top flex-col overflow-y-auto overscroll-contain rounded-lg border p-1.5 shadow-lg transition motion-reduce:transition-none',
								/* A entrada passa de 1 e assenta (back-out); a
								   saída fica na ease fluida, para fechar sem
								   quicar. */
								open
									? 'pointer-events-auto scale-100 opacity-100 duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]'
									: 'ease-fluid pointer-events-none scale-95 opacity-0 duration-150',
								panelClassName
							)}
						>
							{typeof children === 'function'
								? children({ open, toggle, close })
								: children}
						</div>
					</div>,
					host
				)}
		</div>
	)
}

/** Item — uma linha do menu. */
export function DropdownItem({
	icon: Icon,
	trailing,
	destructive = false,
	children,
	...props
}: ComponentProps<'button'> & {
	icon?: React.ComponentType<{ weight?: 'bold'; className?: string }>
	/** Adorno à direita — marcador de seleção, atalho, contador. */
	trailing?: ReactNode
	destructive?: boolean
}) {
	return (
		<button
			type="button"
			role="menuitem"
			className={cn(
				'ease-fluid flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors outline-none',
				destructive
					? 'text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10'
					: 'hover:bg-muted focus-visible:bg-muted'
			)}
			{...props}
		>
			{Icon && (
				<Icon
					weight="bold"
					className={cn(
						'size-4 shrink-0',
						destructive
							? 'text-destructive'
							: 'text-muted-foreground'
					)}
				/>
			)}
			<span className="truncate">{children}</span>
			{trailing ? (
				<span className="ml-auto flex shrink-0 items-center pl-2">
					{trailing}
				</span>
			) : null}
		</button>
	)
}

/** Divider — fio entre grupos de itens. */
export function DropdownDivider() {
	return <div className="bg-border/60 mx-1 my-1 h-px" />
}

/** Label — título não interativo de um grupo. */
export function DropdownLabel({ children }: { children: ReactNode }) {
	return (
		<div className="text-muted-foreground px-2.5 pt-2 pb-1 text-xs font-medium tracking-wide uppercase">
			{children}
		</div>
	)
}
