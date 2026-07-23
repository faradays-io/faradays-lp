'use client'

import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import {
	type ComponentType,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'

import { BlindSpotCanvas } from '@/components/landing/blind-spot-canvas'
import { CursorDuo } from '@/components/landing/cursor-duo'
import { Reveal } from '@/components/landing/reveal'
import { ScenarioCanvas } from '@/components/landing/scenario-canvas'

gsap.registerPlugin(SplitText)

const HOLD_MS = 9000

const FEATURES: Array<{
	eyebrow: string
	title: string
	description: string
	caption: string
	Anim: ComponentType<{ className?: string }>
}> = [
	{
		eyebrow: 'Aprendizado ativo',
		title: 'Aprenda com quem você recusa',
		description:
			'Cada negação esconde um segmento inteiro que o seu modelo nunca vai conhecer. A plataforma explora esse ponto cego com sondas de exploração calculadas — e converte perfis invisíveis ao birô em nichos rentáveis que a concorrência não enxerga.',
		caption: 'Simulação — varredura ativa além do corte estático',
		Anim: BlindSpotCanvas
	},
	{
		eyebrow: 'Simulação de cenários',
		title: 'Erre no simulador, não na carteira',
		description:
			'Um ambiente de simulação reproduz a dinâmica da sua carteira e submete cada política a choques macroeconômicos e mudanças de comportamento. Você compara a degradação do modelo estático com a adaptação da política dinâmica — antes de expor um único real.',
		caption: 'Simulação — futuros da mesma carteira sob choque',
		Anim: ScenarioCanvas
	},
	{
		eyebrow: 'Decisão assistida',
		title: 'A IA monta a evidência. O seu time decide.',
		description:
			'Para cada pedido, o motor varre os sinais, contrasta o score estático com a intervenção recomendada e audita fairness e retorno. A palavra final continua com o seu comitê de risco — evidência auditável, não caixa-preta. Passe o mouse no painel ao lado e veja a análise acontecer.',
		caption: 'Interativo — entre com o mouse no painel',
		Anim: CursorDuo
	}
]

export function CreditShowcase() {
	const [index, setIndex] = useState(0)
	const textRef = useRef<HTMLDivElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const barRef = useRef<HTMLDivElement>(null)
	const tweenRef = useRef<gsap.core.Tween | null>(null)
	const hoveredRef = useRef(false)
	const transitioningRef = useRef(false)

	// Every transition (manual or auto) first snaps the bar to 100% quickly,
	// then swaps the feature.
	const go = useCallback((direction: number) => {
		if (transitioningRef.current) return
		const advance = () =>
			setIndex((i) => (i + direction + FEATURES.length) % FEATURES.length)

		const bar = barRef.current
		if (!bar) {
			advance()
			return
		}
		transitioningRef.current = true
		gsap.to(bar, {
			width: '100%',
			duration: 0.25,
			ease: 'power1.in',
			onComplete: () => {
				transitioningRef.current = false
				advance()
			}
		})
	}, [])

	// Progress bar drives the auto-advance: fills over HOLD_MS, then moves on.
	// Hovering the animation panel pauses it, so interaction is never cut off.
	useEffect(() => {
		const bar = barRef.current
		if (!bar) return
		const tween = gsap.fromTo(
			bar,
			{ width: '0%' },
			{
				width: '100%',
				duration: HOLD_MS / 1000,
				ease: 'none',
				onComplete: () => go(1)
			}
		)
		if (hoveredRef.current) tween.pause()
		tweenRef.current = tween
		return () => {
			tween.kill()
			tweenRef.current = null
		}
	}, [index, go])

	// Line-by-line masked entrance of the active feature's text + a soft
	// cross-fade on the animation panel.
	useEffect(() => {
		const text = textRef.current
		if (!text) return

		const split = new SplitText(text, { type: 'lines', mask: 'lines' })
		const lines = gsap.from(split.lines, {
			yPercent: 110,
			duration: 0.8,
			ease: 'power3.out',
			stagger: 0.09
		})

		const panel = panelRef.current
		const panelTween = panel
			? gsap.fromTo(
					panel,
					{ autoAlpha: 0, scale: 1.03 },
					{
						autoAlpha: 1,
						scale: 1,
						duration: 0.7,
						ease: 'power2.out'
					}
				)
			: null

		return () => {
			lines.kill()
			panelTween?.kill()
			split.revert()
		}
	}, [index])

	const onPanelEnter = () => {
		hoveredRef.current = true
		tweenRef.current?.pause()
	}

	const onPanelLeave = () => {
		hoveredRef.current = false
		tweenRef.current?.play()
	}

	const feature = FEATURES[index]
	const counter = `${String(index + 1).padStart(2, '0')}/${String(FEATURES.length).padStart(2, '0')}`

	return (
		<section
			id="plataforma"
			className="bg-background text-foreground py-40"
		>
			<Reveal className="px-7">
				<span className="text-muted-foreground font-mono text-sm tracking-wide uppercase">
					(a plataforma em ação)
				</span>
				<h2 className="font-heading text-h1 mt-3 max-w-3xl text-balance">
					O que um score estático nunca vai fazer
				</h2>
			</Reveal>

			<div className="mt-16 flex w-full flex-col items-start gap-10 px-7 lg:flex-row lg:gap-14">
				<div className="flex w-full flex-col lg:max-w-xl lg:shrink-0">
					<div className="bg-foreground/15 relative h-px w-full max-w-xl">
						<div
							ref={barRef}
							aria-hidden
							className="bg-foreground absolute top-0 left-0 h-px"
							style={{ width: '0%' }}
						/>
					</div>

					<div className="mt-5 flex max-w-xl items-center justify-between">
						<div className="flex items-center gap-5">
							<button
								aria-label="Item anterior"
								onClick={() => go(-1)}
								className="text-foreground/60 hover:text-foreground transition-colors"
							>
								<ArrowLeft className="size-5" />
							</button>
							<button
								aria-label="Próximo item"
								onClick={() => go(1)}
								className="text-foreground/60 hover:text-foreground transition-colors"
							>
								<ArrowRight className="size-5" />
							</button>
						</div>
						<span className="text-muted-foreground font-mono text-sm">
							{counter}
						</span>
					</div>

					<div ref={textRef} className="mt-12 flex flex-col gap-6">
						<span className="text-muted-foreground font-mono text-sm tracking-wide uppercase">
							({feature.eyebrow})
						</span>
						<h3 className="font-heading text-h2 max-w-xl">
							{feature.title}
						</h3>
						<p className="text-body-lg text-foreground/70 max-w-xl">
							{feature.description}
						</p>
					</div>
				</div>

				<div
					ref={panelRef}
					onMouseEnter={onPanelEnter}
					onMouseLeave={onPanelLeave}
					className="w-full flex-1"
				>
					<div className="dark bg-background text-foreground relative h-[26rem] w-full overflow-hidden rounded-3xl border min-[810px]:h-[72svh]">
						<feature.Anim className="absolute inset-0" />
						<span className="text-foreground/60 pointer-events-none absolute bottom-5 left-6 z-10 font-mono text-xs tracking-wide uppercase">
							{feature.caption}
						</span>
					</div>
				</div>
			</div>
		</section>
	)
}
