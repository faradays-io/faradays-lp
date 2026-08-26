'use client'

import { ContactShadows, Float, useCursor } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import {
	useEffect,
	useMemo,
	useRef,
	useState,
	useSyncExternalStore
} from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'

import { cn } from '@/lib/utils'

/* A marca (FaradaysMark, 139×87) como string SVG: a geometria 3D nasce
   dos mesmos dois paths do lockup — nenhum asset .glb. */
const MARK_W = 139
const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 139 87"><path d="M138.995 34.5807V1.14441e-05L39.7128 0H0V6.17513L46.1661 6.17512C46.1661 6.17512 47.2762 6.16503 47.9036 6.42212C48.5374 6.68183 49.1446 7.41015 49.1446 7.41015L74.9579 33.0986C74.9579 33.0986 75.9317 34.0297 76.6954 34.3336C77.4154 34.6202 78.4328 34.5806 78.4328 34.5806L138.995 34.5807Z"/><path d="M0.00195312 24.5825V59.165H84.3448C84.3448 59.165 85.6114 59.3702 86.3305 59.6591C87.0898 59.964 87.8064 60.6471 87.8064 60.6471L112.404 85.3475C112.404 85.3475 112.996 86.0952 113.634 86.3355C114.178 86.5403 115.123 86.5825 115.123 86.5825H139.002V52.9899H77.8912C77.8912 52.9899 76.7812 53 76.1537 52.7429C75.5199 52.4832 74.9127 51.7549 74.9127 51.7549L49.0984 26.0665C49.0984 26.0665 48.1246 25.1354 47.3609 24.8314C46.6409 24.5448 45.6234 24.5844 45.6234 24.5844L0.00195312 24.5825Z"/></svg>`

/** Largura da marca em unidades de cena; tudo o mais é relativo a isso. */
const MARK_SIZE = 3.2
const CAM_DIST = 14

export type Mark3dSettings = {
	/** Espessura da extrusão em unidades do SVG (139 = largura da marca). */
	depth: number
	/** Chanfro das arestas (unidades do SVG); 0 desliga. */
	bevel: number
	/** Ângulo horizontal da câmera, em graus (0 = de frente). */
	azimuth: number
	/** Ângulo vertical da câmera, em graus (0 = na altura da marca). */
	elevation: number
	/** Campo de visão — baixo = mais "isométrico". */
	fov: number
	/** Inclinação máxima da marca seguindo o ponteiro (rad). */
	tilt: number
	/** Deslocamento máximo da câmera com o ponteiro (unidades) — parallax. */
	parallax: number
	inkColor: string
	sideColor: string
	hoverColor: string
	/** Mostra as figuras ao redor. */
	figures: boolean
}

export const DEFAULT_SETTINGS: Mark3dSettings = {
	depth: 22,
	bevel: 1.2,
	azimuth: 32,
	elevation: 26,
	fov: 22,
	tilt: 0.22,
	parallax: 0.9,
	inkColor: '#161616',
	sideColor: '#2e2e2e',
	hoverColor: '#0065e0',
	figures: true
}

type Pointer = { x: number; y: number }

/** Uma marca na cena: posição/escala relativas à marca-base (3.2 u). */
export type MarkPlacement = {
	position: [number, number, number]
	scale?: number
	/** Velocidade do Float (1 = padrão). */
	floatSpeed?: number
	/** Rotação Y de repouso (rad) — "para onde a marca olha". */
	yaw?: number
	/** Rotação X de repouso (rad): positivo inclina a face para baixo. */
	pitch?: number
	/** Multiplica a inclinação com o ponteiro (1 = settings.tilt). */
	tiltScale?: number
	/** Espelha o eixo X do ponteiro (inclinação e parallax) — para marcas
	   de lados opostos se moverem como reflexo uma da outra. */
	mirror?: boolean
	/** Deslocamento máximo da própria marca com o ponteiro (unidades),
	   somado ao parallax da câmera. */
	parallax?: number
}

export const DEFAULT_MARKS: MarkPlacement[] = [{ position: [0, 0, 0] }]

const REDUCED_MQ = '(prefers-reduced-motion: reduce)'
const subscribeReduced = (cb: () => void) => {
	const mq = window.matchMedia(REDUCED_MQ)
	mq.addEventListener('change', cb)
	return () => mq.removeEventListener('change', cb)
}
const getReduced = () => window.matchMedia(REDUCED_MQ).matches

/* ------------------------------------------------------------------ *
 * Câmera: posição isométrica (azimute/elevação) + parallax pelo ponteiro
 * ------------------------------------------------------------------ */

function Rig({
	settings,
	pointer
}: {
	settings: Mark3dSettings
	pointer: React.RefObject<Pointer>
}) {
	const scratch = useMemo(
		() => ({
			base: new THREE.Vector3(),
			right: new THREE.Vector3(),
			up: new THREE.Vector3(),
			target: new THREE.Vector3(),
			origin: new THREE.Vector3()
		}),
		[]
	)

	/* Tudo dentro do useFrame (a câmera vem do state do frame, não de um
	   hook): a mutação por frame é o modelo do R3F. */
	useFrame((state, dt) => {
		const camera = state.camera as THREE.PerspectiveCamera
		if (camera.fov !== settings.fov) {
			camera.fov = settings.fov
			camera.updateProjectionMatrix()
		}
		const az = THREE.MathUtils.degToRad(settings.azimuth)
		const el = THREE.MathUtils.degToRad(settings.elevation)
		const { base, right, up, target, origin } = scratch
		base.set(
			Math.sin(az) * Math.cos(el) * CAM_DIST,
			Math.sin(el) * CAM_DIST,
			Math.cos(az) * Math.cos(el) * CAM_DIST
		)
		// Eixos da câmera na posição-base → o parallax desliza "na tela".
		camera.position.copy(base)
		camera.lookAt(origin)
		camera.matrixWorld.extractBasis(right, up, scratch.target)
		target
			.copy(base)
			.addScaledVector(right, pointer.current.x * settings.parallax)
			.addScaledVector(up, pointer.current.y * settings.parallax)
		// Damping em vez de lerp fixo: independe do frame rate.
		camera.position.x = THREE.MathUtils.damp(
			camera.position.x,
			target.x,
			5,
			dt
		)
		camera.position.y = THREE.MathUtils.damp(
			camera.position.y,
			target.y,
			5,
			dt
		)
		camera.position.z = THREE.MathUtils.damp(
			camera.position.z,
			target.z,
			5,
			dt
		)
		camera.lookAt(origin)
	})
	return null
}

/* ------------------------------------------------------------------ *
 * A marca extrudada
 * ------------------------------------------------------------------ */

/* Geometria compartilhada por todas as marcas da cena (só depende de
   espessura e chanfro). Three puro — não precisa estar dentro do Canvas. */
function useMarkGeometry(settings: Mark3dSettings) {
	const geometry = useMemo(() => {
		const data = new SVGLoader().parse(MARK_SVG)
		const shapes = data.paths.flatMap((path) => path.toShapes())
		const geo = new THREE.ExtrudeGeometry(shapes, {
			depth: settings.depth,
			bevelEnabled: settings.bevel > 0,
			bevelThickness: settings.bevel,
			bevelSize: settings.bevel,
			bevelSegments: 3,
			curveSegments: 6
		})
		geo.center()
		return geo
	}, [settings.depth, settings.bevel])
	useEffect(() => () => geometry.dispose(), [geometry])
	return geometry
}

function Mark({
	settings,
	pointer,
	reduced,
	geometry,
	placement
}: {
	settings: Mark3dSettings
	pointer: React.RefObject<Pointer>
	reduced: boolean
	geometry: THREE.BufferGeometry
	placement: MarkPlacement
}) {
	const group = useRef<THREE.Group>(null)
	const [hovered, setHovered] = useState(false)
	useCursor(hovered)

	/* ExtrudeGeometry separa em dois grupos de material: 0 = tampas
	   (frente/verso), 1 = laterais. O hover muda só a tampa. */
	const capMat = useMemo(
		() =>
			new THREE.MeshStandardMaterial({
				color: settings.inkColor,
				roughness: 0.85,
				metalness: 0.05
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps -- cor vive em efeito próprio
		[]
	)
	const sideMat = useMemo(
		() =>
			new THREE.MeshStandardMaterial({
				color: settings.sideColor,
				roughness: 0.9,
				metalness: 0.05
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps -- cor vive em efeito próprio
		[]
	)
	/* Hover colore o sólido inteiro: tampa e laterais vão para hoverColor
	   (a iluminação continua diferenciando as faces). */
	useEffect(() => {
		const cap = new THREE.Color(
			hovered ? settings.hoverColor : settings.inkColor
		)
		const side = new THREE.Color(
			hovered ? settings.hoverColor : settings.sideColor
		)
		const opts = { duration: 0.35, ease: 'power2.out' }
		const tweens = [
			gsap.to(capMat.color, { r: cap.r, g: cap.g, b: cap.b, ...opts }),
			gsap.to(sideMat.color, {
				r: side.r,
				g: side.g,
				b: side.b,
				...opts
			})
		]
		return () => {
			tweens.forEach((tween) => tween.kill())
		}
	}, [
		capMat,
		sideMat,
		hovered,
		settings.hoverColor,
		settings.inkColor,
		settings.sideColor
	])
	useEffect(
		() => () => {
			capMat.dispose()
			sideMat.dispose()
		},
		[capMat, sideMat]
	)

	/* Inclinação + parallax próprio seguindo o ponteiro (com damping);
	   `mirror` inverte o eixo X, `yaw` é a rotação de repouso. Zero em
	   reduced motion. */
	useFrame((_, dt) => {
		const g = group.current
		if (!g) return
		const sx = placement.mirror ? -1 : 1
		const px = reduced ? 0 : pointer.current.x
		const py = reduced ? 0 : pointer.current.y
		const tilt = settings.tilt * (placement.tiltScale ?? 1)
		const tx = (placement.pitch ?? 0) - py * tilt
		const ty = (placement.yaw ?? 0) + sx * px * tilt
		g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, 4, dt)
		g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty, 4, dt)
		const amount = placement.parallax ?? 0
		const [bx, by] = placement.position
		g.position.x = THREE.MathUtils.damp(
			g.position.x,
			bx + sx * px * amount,
			4,
			dt
		)
		g.position.y = THREE.MathUtils.damp(
			g.position.y,
			by + py * amount,
			4,
			dt
		)
	})

	const materials = useMemo(() => [capMat, sideMat], [capMat, sideMat])

	return (
		<group
			ref={group}
			position={placement.position}
			scale={placement.scale ?? 1}
		>
			<Float
				speed={reduced ? 0 : 1.3 * (placement.floatSpeed ?? 1)}
				rotationIntensity={0.18}
				floatIntensity={0.5}
				floatingRange={[-0.12, 0.12]}
			>
				{/* rotation.x = π desfaz o y-para-baixo do SVG (e manda a
				   extrusão para -z; as duas tampas são iguais). */}
				<mesh
					geometry={geometry}
					material={materials}
					scale={MARK_SIZE / MARK_W}
					rotation={[Math.PI, 0, 0]}
					onPointerOver={(e) => {
						e.stopPropagation()
						setHovered(true)
					}}
					onPointerOut={() => setHovered(false)}
				/>
			</Float>
		</group>
	)
}

/* ------------------------------------------------------------------ *
 * Figuras ao redor — sólidos simples em profundidades diferentes: o
 * parallax da câmera desloca cada um na medida da sua distância.
 * ------------------------------------------------------------------ */

type Figure = {
	kind: 'slab' | 'sphere' | 'ring'
	position: [number, number, number]
	rotation?: [number, number, number]
	size: number
	color: string
	speed: number
}

const FIGURES: Figure[] = [
	{
		kind: 'slab',
		position: [-2.7, 1.4, -1.8],
		rotation: [0.5, 0.6, 0.1],
		size: 1.1,
		color: '#dcdcd2',
		speed: 1.1
	},
	{
		kind: 'slab',
		position: [2.9, -1.3, -2.6],
		rotation: [-0.3, -0.5, 0.2],
		size: 1.3,
		color: '#cfcfc8',
		speed: 0.9
	},
	{
		kind: 'sphere',
		position: [2.5, 1.7, 0.9],
		size: 0.22,
		color: '#0065e0',
		speed: 1.6
	},
	{
		kind: 'ring',
		position: [-2.3, -1.5, 1.3],
		rotation: [0.9, 0.3, 0],
		size: 0.34,
		color: '#c4c4bd',
		speed: 1.2
	},
	{
		kind: 'sphere',
		position: [-3.3, -0.2, -3.4],
		size: 0.36,
		color: '#e6e6e0',
		speed: 0.8
	},
	{
		kind: 'slab',
		position: [0.8, 2.3, -3.6],
		rotation: [0.2, -0.8, -0.3],
		size: 0.9,
		color: '#dcdcd2',
		speed: 1.0
	}
]

function Figures({ reduced }: { reduced: boolean }) {
	return (
		<>
			{FIGURES.map((f, i) => (
				<Float
					key={i}
					speed={reduced ? 0 : f.speed}
					rotationIntensity={0.4}
					floatIntensity={0.8}
				>
					<mesh position={f.position} rotation={f.rotation}>
						{f.kind === 'slab' ? (
							<boxGeometry
								args={[f.size, f.size * 0.14, f.size * 0.62]}
							/>
						) : f.kind === 'sphere' ? (
							<sphereGeometry args={[f.size, 32, 32]} />
						) : (
							<torusGeometry
								args={[f.size, f.size * 0.26, 24, 48]}
							/>
						)}
						<meshStandardMaterial
							color={f.color}
							roughness={0.7}
							metalness={0.05}
						/>
					</mesh>
				</Float>
			))}
		</>
	)
}

/* ------------------------------------------------------------------ */

/**
 * Protótipo: a marca Faradays extrudada em 3D, isométrica, flutuando; a
 * tampa muda de cor no hover e o ponteiro inclina a marca e desloca a
 * câmera (parallax real das figuras em profundidade). O ponteiro é lido
 * na janela inteira e normalizado pelo retângulo do container, então o
 * efeito responde mesmo com o mouse fora do canvas. O loop pausa fora da
 * viewport e o movimento desliga em prefers-reduced-motion.
 */
export function HeroMark3d({
	settings = DEFAULT_SETTINGS,
	marks = DEFAULT_MARKS,
	shadow = true,
	eventSource,
	className
}: {
	settings?: Mark3dSettings
	/** Marcas na cena (posição/escala); padrão: uma, no centro. */
	marks?: MarkPlacement[]
	/** Sombra de contato no "chão" (y = -2.1). */
	shadow?: boolean
	/** Elemento que recebe os eventos de ponteiro no lugar do canvas —
	   para vários canvases empilhados (ex.: fundo desfocado + frente)
	   fazerem hover ao mesmo tempo, todos apontam para o mesmo wrapper. */
	eventSource?: React.RefObject<HTMLElement | null>
	className?: string
}) {
	const rootRef = useRef<HTMLDivElement>(null)
	const geometry = useMarkGeometry(settings)
	const pointer = useRef<Pointer>({ x: 0, y: 0 })
	const [inView, setInView] = useState(true)
	const reduced = useSyncExternalStore(
		subscribeReduced,
		getReduced,
		() => false
	)

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const io = new IntersectionObserver(
			(entries) => setInView(entries.some((e) => e.isIntersecting)),
			{ rootMargin: '100px' }
		)
		io.observe(root)
		return () => io.disconnect()
	}, [])

	useEffect(() => {
		const root = rootRef.current
		if (!root || reduced) return
		const onMove = (e: PointerEvent) => {
			const r = root.getBoundingClientRect()
			const cx = r.left + r.width / 2
			const cy = r.top + r.height / 2
			// Normaliza pela meia-largura/altura do container; além das
			// bordas satura em ±1.
			pointer.current.x = THREE.MathUtils.clamp(
				(e.clientX - cx) / (r.width / 2),
				-1,
				1
			)
			pointer.current.y = THREE.MathUtils.clamp(
				-(e.clientY - cy) / (r.height / 2),
				-1,
				1
			)
		}
		const onLeave = () => {
			pointer.current.x = 0
			pointer.current.y = 0
		}
		window.addEventListener('pointermove', onMove, { passive: true })
		document.addEventListener('pointerleave', onLeave)
		return () => {
			window.removeEventListener('pointermove', onMove)
			document.removeEventListener('pointerleave', onLeave)
		}
	}, [reduced])

	return (
		<div ref={rootRef} className={cn('relative', className)}>
			<Canvas
				className="absolute inset-0"
				dpr={[1, 1.5]}
				frameloop={inView ? 'always' : 'never'}
				gl={{
					antialias: true,
					alpha: true,
					powerPreference: 'high-performance'
				}}
				camera={{
					fov: settings.fov,
					near: 0.1,
					far: 100,
					position: [0, 0, CAM_DIST]
				}}
				// O tipo do R3F não aceita `| null` no ref; em runtime é o
				// mesmo objeto.
				eventSource={
					eventSource
						? (eventSource as React.RefObject<HTMLElement>)
						: undefined
				}
				eventPrefix={eventSource ? 'client' : undefined}
			>
				<Rig settings={settings} pointer={pointer} />
				<ambientLight intensity={0.9} />
				<directionalLight position={[4, 6, 6]} intensity={2.2} />
				<directionalLight position={[-5, -2, 3]} intensity={0.5} />
				{marks.map((placement, i) => (
					<Mark
						key={i}
						settings={settings}
						pointer={pointer}
						reduced={reduced}
						geometry={geometry}
						placement={placement}
					/>
				))}
				{settings.figures ? <Figures reduced={reduced} /> : null}
				{shadow ? (
					<ContactShadows
						position={[0, -2.1, 0]}
						opacity={0.3}
						scale={9}
						blur={2.6}
						far={3.2}
					/>
				) : null}
			</Canvas>
		</div>
	)
}

/* ------------------------------------------------------------------ *
 * SpinMark3d — uma marca só, azul, girando sozinha em todos os eixos;
 * o usuário arrasta para girar (trackball: rotação em eixos do MUNDO,
 * então o gesto é sempre "puxar a face para onde o dedo vai").
 * ------------------------------------------------------------------ */

const SPIN_COLOR = '#0065e0'
const SPIN_SIDE = '#0a56c2'
const SPIN_HOVER = '#1f7cff'
/** Velocidade do giro automático por eixo (rad/s). */
const AUTO_SPIN = new THREE.Vector3(0.22, 0.42, 0.12)
/** Sensibilidade do arrasto (rad por px). */
const DRAG_SENS = 0.007

/* Estado do arrasto, escrito só pelos listeners do wrapper (pai) e lido
   pela cena (filho) — a inércia vive num ref local do filho. */
type Drag = {
	active: boolean
	x: number
	y: number
	/** Totais acumulados de deslocamento do ponteiro (px). */
	tx: number
	ty: number
}

const AXIS_X = new THREE.Vector3(1, 0, 0)
const AXIS_Y = new THREE.Vector3(0, 1, 0)
const AXIS_Z = new THREE.Vector3(0, 0, 1)

function SpinningMark({
	geometry,
	drag,
	reduced
}: {
	geometry: THREE.BufferGeometry
	drag: React.RefObject<Drag>
	reduced: boolean
}) {
	const group = useRef<THREE.Group>(null)
	const [hovered, setHovered] = useState(false)
	const capMat = useMemo(
		() =>
			new THREE.MeshStandardMaterial({
				color: SPIN_COLOR,
				roughness: 0.6,
				metalness: 0.1
			}),
		[]
	)
	const sideMat = useMemo(
		() =>
			new THREE.MeshStandardMaterial({
				color: SPIN_SIDE,
				roughness: 0.7,
				metalness: 0.1
			}),
		[]
	)
	const materials = useMemo(() => [capMat, sideMat], [capMat, sideMat])
	useEffect(
		() => () => {
			capMat.dispose()
			sideMat.dispose()
		},
		[capMat, sideMat]
	)
	useEffect(() => {
		const to = new THREE.Color(hovered ? SPIN_HOVER : SPIN_COLOR)
		const tween = gsap.to(capMat.color, {
			r: to.r,
			g: to.g,
			b: to.b,
			duration: 0.3,
			ease: 'power2.out'
		})
		return () => {
			tween.kill()
		}
	}, [capMat, hovered])

	/* Pesos: 0 = só o giro automático, 1 = só a inércia do arrasto. Sobe
	   na hora ao arrastar e volta com damping depois de soltar — o giro
	   automático "retoma" sem salto. */
	const blend = useRef(0)
	// Último total consumido + velocidade residual (px/frame) da inércia.
	const local = useRef({ tx: 0, ty: 0, vx: 0, vy: 0 })

	useFrame((_, dt) => {
		const g = group.current
		if (!g) return
		const d = drag.current
		const l = local.current
		const dx = d.tx - l.tx
		const dy = d.ty - l.ty
		l.tx = d.tx
		l.ty = d.ty
		if (d.active) {
			blend.current = 1
			// Arrasto: gira em eixos do mundo pela distância percorrida.
			g.rotateOnWorldAxis(AXIS_Y, dx * DRAG_SENS)
			g.rotateOnWorldAxis(AXIS_X, dy * DRAG_SENS)
			// Velocidade suavizada para a inércia ao soltar.
			l.vx = THREE.MathUtils.lerp(l.vx, dx, 0.5)
			l.vy = THREE.MathUtils.lerp(l.vy, dy, 0.5)
			return
		}
		// Inércia do arrasto decaindo…
		l.vx = THREE.MathUtils.damp(l.vx, 0, 2.5, dt)
		l.vy = THREE.MathUtils.damp(l.vy, 0, 2.5, dt)
		g.rotateOnWorldAxis(AXIS_Y, l.vx * DRAG_SENS)
		g.rotateOnWorldAxis(AXIS_X, l.vy * DRAG_SENS)
		// …enquanto o giro automático volta.
		blend.current = THREE.MathUtils.damp(blend.current, 0, 1.5, dt)
		if (!reduced) {
			const k = (1 - blend.current) * dt
			g.rotateOnWorldAxis(AXIS_X, AUTO_SPIN.x * k)
			g.rotateOnWorldAxis(AXIS_Y, AUTO_SPIN.y * k)
			g.rotateOnWorldAxis(AXIS_Z, AUTO_SPIN.z * k)
		}
	})

	return (
		<group ref={group}>
			{/* rotation.x = π desfaz o y-para-baixo do SVG; a extrusão fica
			   centrada em z (geo.center()), então o giro é em torno do
			   centro do sólido. */}
			<mesh
				geometry={geometry}
				material={materials}
				scale={MARK_SIZE / MARK_W}
				rotation={[Math.PI, 0, 0]}
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
			/>
		</group>
	)
}

/**
 * Uma marca 3D azul girando sozinha em todos os eixos; arrastar (mouse
 * ou toque) gira no modo trackball com inércia, e o giro automático
 * retoma sozinho ao soltar. Câmera de frente. Para o hero "lado".
 */
export function SpinMark3d({
	depth = 26,
	bevel = 1.2,
	className
}: {
	/** Espessura da extrusão (unidades do SVG; 139 = largura). */
	depth?: number
	bevel?: number
	className?: string
}) {
	const rootRef = useRef<HTMLDivElement>(null)
	const settings = useMemo(
		() => ({ ...DEFAULT_SETTINGS, depth, bevel }),
		[depth, bevel]
	)
	const geometry = useMarkGeometry(settings)
	const drag = useRef<Drag>({ active: false, x: 0, y: 0, tx: 0, ty: 0 })
	const [inView, setInView] = useState(true)
	const [grabbing, setGrabbing] = useState(false)
	const reduced = useSyncExternalStore(
		subscribeReduced,
		getReduced,
		() => false
	)

	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const io = new IntersectionObserver(
			(entries) => setInView(entries.some((e) => e.isIntersecting)),
			{ rootMargin: '100px' }
		)
		io.observe(root)
		return () => io.disconnect()
	}, [])

	/* Arrasto no wrapper inteiro (não só no sólido): pointerdown arma,
	   move acumula o delta que o useFrame consome, up/cancel solta. */
	useEffect(() => {
		const root = rootRef.current
		if (!root) return
		const d = drag.current
		const onDown = (e: PointerEvent) => {
			if (e.button !== 0 && e.pointerType === 'mouse') return
			d.active = true
			d.x = e.clientX
			d.y = e.clientY
			root.setPointerCapture(e.pointerId)
			setGrabbing(true)
		}
		const onMove = (e: PointerEvent) => {
			if (!d.active) return
			d.tx += e.clientX - d.x
			d.ty += e.clientY - d.y
			d.x = e.clientX
			d.y = e.clientY
		}
		const onUp = (e: PointerEvent) => {
			if (!d.active) return
			d.active = false
			if (root.hasPointerCapture(e.pointerId))
				root.releasePointerCapture(e.pointerId)
			setGrabbing(false)
		}
		root.addEventListener('pointerdown', onDown)
		root.addEventListener('pointermove', onMove)
		root.addEventListener('pointerup', onUp)
		root.addEventListener('pointercancel', onUp)
		return () => {
			root.removeEventListener('pointerdown', onDown)
			root.removeEventListener('pointermove', onMove)
			root.removeEventListener('pointerup', onUp)
			root.removeEventListener('pointercancel', onUp)
		}
	}, [])

	return (
		<div
			ref={rootRef}
			className={cn(
				'relative touch-none select-none',
				grabbing ? 'cursor-grabbing' : 'cursor-grab',
				className
			)}
		>
			<Canvas
				className="absolute inset-0"
				dpr={[1, 1.5]}
				frameloop={inView ? 'always' : 'never'}
				gl={{
					antialias: true,
					alpha: true,
					powerPreference: 'high-performance'
				}}
				camera={{ fov: 24, near: 0.1, far: 100, position: [0, 0, 14] }}
			>
				<ambientLight intensity={0.8} />
				<directionalLight position={[4, 6, 6]} intensity={2.4} />
				<directionalLight position={[-5, -3, 4]} intensity={0.8} />
				<SpinningMark
					geometry={geometry}
					drag={drag}
					reduced={reduced}
				/>
			</Canvas>
		</div>
	)
}
