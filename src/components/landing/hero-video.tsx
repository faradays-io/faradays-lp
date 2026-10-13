'use client'

import {
	CornersIn,
	CornersOut,
	Pause,
	Play,
	SpeakerHigh,
	SpeakerSlash
} from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useCopy } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const COPY = {
	pt: {
		watch: 'Assistir com som',
		play: 'Reproduzir',
		pause: 'Pausar',
		mute: 'Silenciar',
		unmute: 'Ativar som',
		fullscreen: 'Tela cheia',
		exitFullscreen: 'Sair da tela cheia',
		seek: 'Posição do vídeo'
	},
	en: {
		watch: 'Watch with sound',
		play: 'Play',
		pause: 'Pause',
		mute: 'Mute',
		unmute: 'Unmute',
		fullscreen: 'Full screen',
		exitFullscreen: 'Exit full screen',
		seek: 'Video position'
	}
} satisfies Localized<Record<string, string>>

/* Botão quadrado de vidro da barra (play/pause, som, tela cheia). */
const CONTROL =
	'flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none [&_svg]:size-4'

/* Some a barra depois de tanto tempo sem o cursor mexer (ms), com o vídeo
   rodando. Pausado, ela fica. */
const IDLE_MS = 2200

/**
 * Vídeo de apresentação do hero, direto na página (sem banda de fundo).
 *
 * Dois estados:
 * - VITRINE: toca MUDO, em loop (autoplay só é permitido sem som), com o
 *   play redondo de vidro no centro. Com `prefers-reduced-motion` fica
 *   parada no pôster.
 * - ASSISTINDO: o play recomeça do começo, com som, e troca o botão central
 *   pela barra própria (referência: harvey.ai) — numa linha só, à esquerda o
 *   play/pause quadrado e a timeline (sem tempo escrito), à direita som e
 *   tela cheia. A barra some com o cursor parado e volta ao mexer; ao fim
 *   do vídeo, tudo volta à vitrine.
 *
 * A timeline anda por rAF direto no `style` (sem re-render a cada quadro)
 * e aceita clique, arrasto (pointer capture) e setas (±5 s).
 */
export function HeroVideo() {
	const t = useCopy(COPY)
	const frameRef = useRef<HTMLDivElement>(null)
	const videoRef = useRef<HTMLVideoElement>(null)
	const fillRef = useRef<HTMLDivElement>(null)
	const trackRef = useRef<HTMLDivElement>(null)
	const idleRef = useRef<number | undefined>(undefined)

	const [watching, setWatching] = useState(false)
	const [paused, setPaused] = useState(true)
	const [muted, setMuted] = useState(true)
	const [fullscreen, setFullscreen] = useState(false)
	const [idle, setIdle] = useState(false)

	// Vitrine: mudo, em loop, desde a montagem.
	useEffect(() => {
		const video = videoRef.current
		if (!video) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
			return
		// `muted` como propriedade antes do play: o atributo do React nem
		// sempre chega a tempo para o autoplay.
		video.muted = true
		void video.play().catch(() => {})
	}, [])

	// Timeline por rAF enquanto assiste.
	useEffect(() => {
		if (!watching) return
		let raf = 0
		const tick = () => {
			const video = videoRef.current
			const fill = fillRef.current
			if (video && fill && video.duration) {
				const p = video.currentTime / video.duration
				fill.style.transform = `scaleX(${p})`
				trackRef.current?.setAttribute(
					'aria-valuenow',
					String(Math.round(p * 100))
				)
			}
			raf = requestAnimationFrame(tick)
		}
		raf = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf)
	}, [watching])

	useEffect(() => {
		const onChange = () =>
			setFullscreen(document.fullscreenElement === frameRef.current)
		document.addEventListener('fullscreenchange', onChange)
		return () => {
			document.removeEventListener('fullscreenchange', onChange)
			window.clearTimeout(idleRef.current)
		}
	}, [])

	const wake = useCallback(() => {
		setIdle(false)
		window.clearTimeout(idleRef.current)
		idleRef.current = window.setTimeout(() => setIdle(true), IDLE_MS)
	}, [])

	const watch = () => {
		const video = videoRef.current
		if (!video) return
		video.currentTime = 0
		video.loop = false
		video.muted = false
		setMuted(false)
		// Se o navegador recusar o som, segue do começo mudo — o botão de
		// som da barra liga na mão.
		video.play().catch(() => {
			video.muted = true
			setMuted(true)
			void video.play().catch(() => {})
		})
		setWatching(true)
		wake()
	}

	const backToShowcase = () => {
		const video = videoRef.current
		if (!video) return
		if (document.fullscreenElement) void document.exitFullscreen()
		video.loop = true
		video.muted = true
		setMuted(true)
		video.currentTime = 0
		void video.play().catch(() => {})
		setWatching(false)
	}

	const togglePlay = () => {
		const video = videoRef.current
		if (!video) return
		if (video.paused) void video.play().catch(() => {})
		else video.pause()
		wake()
	}

	const toggleMute = () => {
		const video = videoRef.current
		if (!video) return
		video.muted = !video.muted
		setMuted(video.muted)
		wake()
	}

	const toggleFullscreen = () => {
		const frame = frameRef.current
		const video = videoRef.current as
			| (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
			| null
		if (!frame || !video) return
		if (document.fullscreenElement) void document.exitFullscreen()
		else if (frame.requestFullscreen) void frame.requestFullscreen()
		// iOS Safari só põe o próprio <video> em tela cheia.
		else video.webkitEnterFullscreen?.()
		wake()
	}

	const seekTo = (clientX: number) => {
		const video = videoRef.current
		const track = trackRef.current
		if (!video || !track || !video.duration) return
		const rect = track.getBoundingClientRect()
		const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
		video.currentTime = p * video.duration
		if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`
	}

	const onTrackKey = (event: React.KeyboardEvent) => {
		const video = videoRef.current
		if (!video) return
		const step =
			event.key === 'ArrowRight' ? 5 : event.key === 'ArrowLeft' ? -5 : 0
		if (!step) return
		event.preventDefault()
		video.currentTime = Math.min(
			video.duration || 0,
			Math.max(0, video.currentTime + step)
		)
		wake()
	}

	const barHidden = watching && idle && !paused

	return (
		<div
			ref={frameRef}
			onPointerMove={watching ? wake : undefined}
			className={cn(
				'group/video relative aspect-video overflow-hidden rounded-2xl bg-black',
				fullscreen && 'rounded-none',
				barHidden && 'cursor-none'
			)}
		>
			<video
				ref={videoRef}
				src="/videos/fs1-hero.mp4"
				poster="/videos/fs1-hero-poster.jpg"
				muted
				loop
				playsInline
				preload="metadata"
				onPlay={() => setPaused(false)}
				onPause={() => setPaused(true)}
				onEnded={backToShowcase}
				onClick={watching ? togglePlay : watch}
				className={cn(
					'size-full cursor-pointer',
					fullscreen ? 'object-contain' : 'object-cover'
				)}
			/>

			{!watching && (
				<button
					type="button"
					onClick={watch}
					aria-label={t.watch}
					className="absolute inset-0 m-auto flex size-20 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md transition hover:scale-105 hover:bg-white/25 focus-visible:ring-3 focus-visible:ring-white/50 focus-visible:outline-none lg:size-24"
				>
					<Play
						weight="fill"
						className="size-7 translate-x-0.5 lg:size-8"
					/>
				</button>
			)}

			{watching && (
				/* Barra numa linha só, sobre um degradê para ler em
					   qualquer quadro do vídeo. */
				<div
					className={cn(
						'absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10 transition-opacity duration-300 lg:gap-4 lg:p-5 lg:pt-14',
						barHidden ? 'opacity-0' : 'opacity-100'
					)}
				>
					<button
						type="button"
						onClick={togglePlay}
						aria-label={paused ? t.play : t.pause}
						className={CONTROL}
					>
						{paused ? (
							<Play weight="fill" />
						) : (
							<Pause weight="fill" />
						)}
					</button>

					<div
						ref={trackRef}
						role="slider"
						tabIndex={0}
						aria-label={t.seek}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={0}
						onKeyDown={onTrackKey}
						onPointerDown={(event) => {
							event.currentTarget.setPointerCapture(
								event.pointerId
							)
							seekTo(event.clientX)
							wake()
						}}
						onPointerMove={(event) => {
							if (
								event.currentTarget.hasPointerCapture(
									event.pointerId
								)
							)
								seekTo(event.clientX)
						}}
						className="group/track flex h-10 flex-1 cursor-pointer touch-none items-center focus-visible:outline-none"
					>
						<div className="relative h-1 w-full overflow-hidden rounded-full bg-white/25 transition-[height] group-hover/track:h-1.5 group-focus-visible/track:h-1.5">
							<div
								ref={fillRef}
								className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white"
							/>
						</div>
					</div>

					<button
						type="button"
						onClick={toggleMute}
						aria-label={muted ? t.unmute : t.mute}
						className={CONTROL}
					>
						{muted ? (
							<SpeakerSlash weight="fill" />
						) : (
							<SpeakerHigh weight="fill" />
						)}
					</button>
					<button
						type="button"
						onClick={toggleFullscreen}
						aria-label={
							fullscreen ? t.exitFullscreen : t.fullscreen
						}
						className={CONTROL}
					>
						{fullscreen ? (
							<CornersIn weight="bold" />
						) : (
							<CornersOut weight="bold" />
						)}
					</button>
				</div>
			)}
		</div>
	)
}
