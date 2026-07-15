'use client'

import {
	ArrowLeft,
	ArrowRight,
	ChartLineUp,
	Scales,
	Sliders,
	Stack
} from '@phosphor-icons/react'
import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'

import { GlowCard } from '@/components/landing/glow-card'
import { Reveal } from '@/components/landing/reveal'

const HOLD_MS = 6000

const PROFILES = [
	{
		id: 'Perfil 01',
		name: 'Autônoma, sem histórico de crédito',
		signals: ['Sem birô', 'Recebíveis estáveis', 'Setor em expansão'],
		staticVerdict: 'Recusar — score insuficiente',
		policyVerdict: 'Aprovar com limite de entrada',
		policyDetail: 'Limite inicial reduzido · revisão automática em 90 dias',
		rationale:
			'O valor de aprender sobre um nicho novo supera o risco da exposição inicial.'
	},
	{
		id: 'Perfil 02',
		name: 'Cliente antiga com limite subutilizado',
		signals: ['Boa pagadora', 'Renda cresceu', 'Uso do limite < 15%'],
		staticVerdict: 'Manter — sem alerta de default',
		policyVerdict: 'Aumentar limite e ofertar produto',
		policyDetail: 'Elevação de limite · oferta do próximo produto',
		rationale:
			'O score não enxerga receita perdida; a política otimiza o valor vitalício.'
	},
	{
		id: 'Perfil 03',
		name: 'Segmento atingido por choque macroeconômico',
		signals: [
			'Score defasado',
			'Setor em recuperação',
			'Consumo recente saudável'
		],
		staticVerdict: 'Aprovar — retrato antigo do risco',
		policyVerdict: 'Ajustar condições à nova realidade',
		policyDetail: 'Reprecificação dinâmica · monitoramento reforçado',
		rationale:
			'A adaptação em contexto reage ao choque antes de qualquer retreino.'
	}
]

const CAPABILITIES = [
	{
		icon: Sliders,
		title: 'Intervenções, não notas',
		description:
			'Aprovar, ajustar limite, reprecificar ou ofertar o próximo produto — cada recomendação otimiza o valor do cliente a longo prazo.'
	},
	{
		icon: Stack,
		title: 'Dados prontos para decidir',
		description:
			'Modelos de fundação transformam birô, registros públicos e consumo em sinais robustos, sem engenharia manual de atributos.'
	},
	{
		icon: ChartLineUp,
		title: 'Cenários antes da produção',
		description:
			'Simule choques macro e mudanças de comportamento e veja como cada política reage — antes de expor a carteira.'
	},
	{
		icon: Scales,
		title: 'Auditável por padrão',
		description:
			'Fairness e ROI medidos por política e por segmento, prontos para o comitê de risco e para o regulador.'
	}
]

/** Interactive ticket: static score verdict vs. the policy's intervention. */
function DecisionDemo() {
	const [index, setIndex] = useState(0)
	const contentRef = useRef<HTMLDivElement>(null)
	const barRef = useRef<HTMLDivElement>(null)
	const transitioningRef = useRef(false)

	const go = useCallback((direction: number) => {
		if (transitioningRef.current) return
		const advance = () =>
			setIndex((i) => (i + direction + PROFILES.length) % PROFILES.length)

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
		return () => {
			tween.kill()
		}
	}, [index, go])

	useEffect(() => {
		const el = contentRef.current
		if (!el) return
		const tween = gsap.fromTo(
			el,
			{ autoAlpha: 0, y: 18 },
			{ autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }
		)
		return () => {
			tween.kill()
		}
	}, [index])

	const profile = PROFILES[index]
	const counter = `${String(index + 1).padStart(2, '0')}/${String(PROFILES.length).padStart(2, '0')}`

	return (
		<GlowCard className="h-full">
			<div className="flex h-full flex-col p-7">
				<div className="bg-foreground/15 relative h-px w-full">
					<div
						ref={barRef}
						aria-hidden
						className="bg-foreground absolute top-0 left-0 h-px"
						style={{ width: '0%' }}
					/>
				</div>

				<div className="mt-5 flex items-center justify-between">
					<div className="flex items-center gap-5">
						<button
							aria-label="Perfil anterior"
							onClick={() => go(-1)}
							className="text-foreground/60 hover:text-foreground transition-colors"
						>
							<ArrowLeft className="size-5" />
						</button>
						<button
							aria-label="Próximo perfil"
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

				<div
					ref={contentRef}
					className="mt-8 flex flex-1 flex-col gap-6"
				>
					<div>
						<span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
							{profile.id} — pedido em análise
						</span>
						<h3 className="font-heading text-h3 mt-2">
							{profile.name}
						</h3>
					</div>

					<div className="flex flex-wrap gap-2">
						{profile.signals.map((signal) => (
							<span
								key={signal}
								className="text-foreground/70 rounded-full border px-3 py-1 font-mono text-xs tracking-wide uppercase"
							>
								{signal}
							</span>
						))}
					</div>

					<div className="mt-auto flex flex-col gap-3">
						<div className="rounded-2xl border p-5 opacity-60">
							<span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
								Score estático
							</span>
							<p className="mt-1">{profile.staticVerdict}</p>
						</div>
						<div className="border-brand/40 bg-brand/10 rounded-2xl border p-5">
							<span className="text-brand font-mono text-xs tracking-widest uppercase">
								Política Faradays
							</span>
							<p className="mt-1 font-medium">
								{profile.policyVerdict}
							</p>
							<p className="text-foreground/70 text-body-sm mt-1">
								{profile.policyDetail}
							</p>
						</div>
						<p className="text-muted-foreground text-body-sm">
							{profile.rationale}
						</p>
						<span className="text-muted-foreground/70 font-mono text-[10px] tracking-widest uppercase">
							Cenários ilustrativos
						</span>
					</div>
				</div>
			</div>
		</GlowCard>
	)
}

export function CreditProduct() {
	return (
		<section id="produto" className="bg-background text-foreground py-40">
			<Reveal className="px-7">
				<span className="text-muted-foreground font-mono text-sm tracking-wide uppercase">
					(o produto)
				</span>
				<h2 className="font-heading text-h1 mt-3 max-w-3xl text-balance">
					Um motor de decisão, não um score
				</h2>
				<p className="text-body-lg text-foreground/70 mt-5 max-w-2xl">
					Para cada pedido, a plataforma compara o que o score
					estático faria com a intervenção que maximiza o valor da
					carteira — e mostra o porquê.
				</p>
			</Reveal>

			<div className="mt-16 grid gap-6 px-7 lg:grid-cols-[5fr_4fr] lg:items-stretch">
				<Reveal className="h-full">
					<DecisionDemo />
				</Reveal>

				<div className="grid gap-6 sm:grid-cols-2">
					{CAPABILITIES.map((capability, i) => (
						<Reveal
							key={capability.title}
							delay={i * 0.08}
							className="h-full"
						>
							<GlowCard className="h-full">
								<div className="flex h-full flex-col gap-3 p-7">
									<capability.icon
										className="text-brand size-6"
										weight="duotone"
									/>
									<h3 className="font-heading text-h5 mt-2">
										{capability.title}
									</h3>
									<p className="text-foreground/70 text-body-sm">
										{capability.description}
									</p>
								</div>
							</GlowCard>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	)
}
