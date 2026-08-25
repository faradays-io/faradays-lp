/**
 * Barra de carregamento + autoplay dos relatos. Saiu da
 * `TestimonialsSection` em 2026-08-25, quando a seção virou só o leque de
 * cards (drag-only, como o osmo.supply). O fio de 1px enche em `holdMs` e
 * chama `onComplete` para avançar; pausa enquanto está fora da viewport ou
 * enquanto `paused` for true (era o hover do deck), e re-arma sempre que
 * `cycle` muda (passe o índice do card da frente).
 *
 * Para voltar: mover para `src/components/landing/`, renderizar acima do
 * deck e passar `cycle={index}`, `paused={hovered}` e
 * `onComplete={() => go(1)}`.
 */

'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'

import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

export function TestimonialsProgressBar({
	cycle,
	onComplete,
	holdMs = 8000,
	paused = false,
	className
}: {
	/** Muda → a barra re-arma do zero (normalmente o índice do card da frente). */
	cycle: number
	/** Chamado quando o fio enche. */
	onComplete: () => void
	holdMs?: number
	/** Hover no deck, drag em curso — qualquer motivo para segurar o relato. */
	paused?: boolean
	className?: string
}) {
	const rootRef = useRef<HTMLDivElement>(null)
	const barRef = useRef<HTMLDivElement>(null)
	const tweenRef = useRef<gsap.core.Tween | null>(null)
	const offscreenRef = useRef(false)

	const ready = usePageReady()

	useEffect(() => {
		const bar = barRef.current
		// O autoplay não pode consumir relatos enquanto a página carrega.
		if (!bar || !ready) return
		const tween = gsap.fromTo(
			bar,
			{ width: '0%' },
			{
				width: '100%',
				duration: holdMs / 1000,
				ease: 'none',
				onComplete
			}
		)
		tweenRef.current = tween
		return () => {
			tween.kill()
			tweenRef.current = null
		}
	}, [cycle, holdMs, onComplete, ready])

	/* Fora da viewport (ou com o deck sob o mouse) o autoplay pausa — senão
	   a seção consome relatos e gira o leque sem ninguém vendo. */
	useEffect(() => {
		const tween = tweenRef.current
		if (!tween) return
		if (paused || offscreenRef.current) tween.pause()
		else tween.play()
	}, [paused, cycle, ready])

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const io = new IntersectionObserver((entries) => {
			const visible = entries.some((entry) => entry.isIntersecting)
			offscreenRef.current = !visible
			if (!visible) tweenRef.current?.pause()
			else if (!paused) tweenRef.current?.play()
		})
		io.observe(root)
		return () => io.disconnect()
	}, [paused])

	return (
		<div
			ref={rootRef}
			className={cn('bg-foreground/15 relative h-px w-full', className)}
		>
			<div
				ref={barRef}
				aria-hidden
				className="bg-foreground absolute top-0 left-0 h-px"
				style={{ width: '0%' }}
			/>
		</div>
	)
}
