'use client'

import { useEffect, useRef, useState } from 'react'

import { AsciiField } from '@/components/landing/hero-demo'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ *
 * Fundo ASCII interativo em WebGL: o campo de ondas do AsciiField 2D,
 * renderizado num quad com atlas de glifos em textura — mas INVISÍVEL em
 * repouso. O mouse deposita "calor" numa grade por célula (textura
 * LUMINANCE) e só as células quentes aparecem: o rastro revela o campo
 * escondido (a onda escolhe o caractere) e esfria num decay exponencial
 * (~2s) até a transparência total. Sem calor, o loop nem desenha —
 * custo idle zero.
 *
 * Guards: congelado até o page-ready, loop pausado fora da viewport,
 * rastro só com ponteiro fino (touch não tem hover), frame estático com
 * prefers-reduced-motion, re-init em webglcontextrestored e fallback
 * para o AsciiField 2D se o contexto GL não existir.
 * ------------------------------------------------------------------ */

const CELL = 16
const CHARS = ' .:-=+*#'
const ATLAS_GLYPH = 32 // px por glifo no atlas — nítido até DPR 2
const HEAT_RADIUS = 110 // raio do depósito de calor, em px CSS
const HEAT_TAU = 0.55 // e-folding do decay em s (~2s até apagar)

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

/* O offset ancora o campo no documento (parallax com a demo pinada):
   docY = pixelY + scrollY + rect.top entra na fase da onda. */
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_size;
uniform float u_dpr;
uniform float u_time;
uniform float u_offset;
uniform vec3 u_rgb;
uniform vec2 u_cells;
uniform sampler2D u_atlas;
uniform sampler2D u_heat;

void main() {
	vec2 p = vec2(gl_FragCoord.x, u_size.y * u_dpr - gl_FragCoord.y) / u_dpr;
	vec2 cell = floor(p / ${CELL}.0);
	vec2 center = (cell + 0.5) * ${CELL}.0;
	float wy = center.y + u_offset;
	float v = 0.5 + 0.25 * sin(center.x * 0.045 + u_time * 0.9) +
		0.25 * cos(wy * 0.05 - u_time * 0.6 + center.x * 0.01);
	float heat = texture2D(u_heat, (cell + 0.5) / u_cells).r;
	if (heat < 0.01) discard;
	float ev = clamp(v + heat * 0.35, 0.0, 0.999);
	float idx = floor(ev * 8.0);
	if (idx < 0.5) discard;
	vec2 f = fract(p / ${CELL}.0);
	float g = texture2D(u_atlas, vec2((idx + f.x) / 8.0, f.y)).a;
	float a = clamp(heat * 1.1, 0.0, 0.85) * g;
	gl_FragColor = vec4(u_rgb, a);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
	const shader = gl.createShader(type)
	if (!shader) return null
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null
	return shader
}

/* Atlas: os 8 caracteres lado a lado, brancos, coverage no canal alpha. */
function buildAtlas(mono: string) {
	const atlas = document.createElement('canvas')
	atlas.width = ATLAS_GLYPH * CHARS.length
	atlas.height = ATLAS_GLYPH
	const ctx = atlas.getContext('2d')
	if (!ctx) return null
	ctx.fillStyle = '#fff'
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	// 10px no cell de 16 → escala 2 no tile de 32.
	ctx.font = `${10 * (ATLAS_GLYPH / CELL)}px ${mono}`
	for (let i = 1; i < CHARS.length; i++) {
		ctx.fillText(
			CHARS[i],
			i * ATLAS_GLYPH + ATLAS_GLYPH / 2,
			ATLAS_GLYPH / 2
		)
	}
	return atlas
}

export function AsciiFieldGl({
	className,
	rgb = '0, 101, 224'
}: {
	className?: string
	/** Cor dos glifos como "r, g, b" — default azul brand. */
	rgb?: string
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const ready = usePageReady()
	const [failed, setFailed] = useState(false)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches
		const finePointer = window.matchMedia('(pointer: fine)').matches
		const color = rgb.split(',').map((c) => Number(c.trim()) / 255)
		const mono = getComputedStyle(canvas).fontFamily
		const dpr = Math.min(window.devicePixelRatio || 1, 2)

		let gl: WebGLRenderingContext | null = null
		let uni: Record<string, WebGLUniformLocation | null> = {}
		let heatTex: WebGLTexture | null = null

		// Grade de calor (uma célula por glifo) + estado do ponteiro.
		let cols = 0
		let rows = 0
		let heat = new Float32Array(0)
		let heatU8 = new Uint8Array(0)
		let heatMax = 0
		let heatDirty = false
		const pointer = { x: 0, y: 0, px: 0, py: 0, moved: false, has: false }

		const initGL = () => {
			gl = canvas.getContext('webgl', {
				alpha: true,
				premultipliedAlpha: false,
				antialias: false,
				depth: false,
				stencil: false,
				powerPreference: 'low-power'
			})
			if (!gl) return false
			const vs = compile(gl, gl.VERTEX_SHADER, VERT)
			const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
			const program = gl.createProgram()
			if (!vs || !fs || !program) return false
			gl.attachShader(program, vs)
			gl.attachShader(program, fs)
			gl.linkProgram(program)
			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false
			gl.useProgram(program)

			// Triângulo que cobre a tela.
			const buf = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buf)
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([-1, -1, 3, -1, -1, 3]),
				gl.STATIC_DRAW
			)
			const aPos = gl.getAttribLocation(program, 'a_pos')
			gl.enableVertexAttribArray(aPos)
			gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

			for (const name of [
				'u_size',
				'u_dpr',
				'u_time',
				'u_offset',
				'u_rgb',
				'u_cells',
				'u_atlas',
				'u_heat'
			]) {
				uni[name] = gl.getUniformLocation(program, name)
			}
			gl.uniform1f(uni.u_dpr, dpr)
			gl.uniform3f(uni.u_rgb, color[0], color[1], color[2])
			gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)

			// Atlas de glifos na unidade 0.
			const atlas = buildAtlas(mono)
			if (!atlas) return false
			const atlasTex = gl.createTexture()
			gl.activeTexture(gl.TEXTURE0)
			gl.bindTexture(gl.TEXTURE_2D, atlasTex)
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				gl.RGBA,
				gl.RGBA,
				gl.UNSIGNED_BYTE,
				atlas
			)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
			gl.uniform1i(uni.u_atlas, 0)

			// Calor na unidade 1 — (re)dimensionada no resize.
			heatTex = gl.createTexture()
			gl.activeTexture(gl.TEXTURE1)
			gl.bindTexture(gl.TEXTURE_2D, heatTex)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
			gl.uniform1i(uni.u_heat, 1)
			return true
		}

		const resize = () => {
			if (!gl) return
			const width = canvas.clientWidth
			const height = canvas.clientHeight
			canvas.width = Math.round(width * dpr)
			canvas.height = Math.round(height * dpr)
			gl.viewport(0, 0, canvas.width, canvas.height)
			gl.uniform2f(uni.u_size, width, height)
			cols = Math.max(1, Math.ceil(width / CELL))
			rows = Math.max(1, Math.ceil(height / CELL))
			heat = new Float32Array(cols * rows)
			heatU8 = new Uint8Array(cols * rows)
			heatMax = 0
			gl.activeTexture(gl.TEXTURE1)
			gl.bindTexture(gl.TEXTURE_2D, heatTex)
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				gl.LUMINANCE,
				cols,
				rows,
				0,
				gl.LUMINANCE,
				gl.UNSIGNED_BYTE,
				heatU8
			)
			gl.uniform2f(uni.u_cells, cols, rows)
		}

		const uploadHeat = () => {
			if (!gl) return
			for (let i = 0; i < heat.length; i++) heatU8[i] = heat[i] * 255
			gl.activeTexture(gl.TEXTURE1)
			gl.bindTexture(gl.TEXTURE_2D, heatTex)
			gl.texSubImage2D(
				gl.TEXTURE_2D,
				0,
				0,
				0,
				cols,
				rows,
				gl.LUMINANCE,
				gl.UNSIGNED_BYTE,
				heatU8
			)
			heatDirty = false
		}

		/* Deposita calor num raio ao redor do ponto (coords CSS do canvas),
		   com falloff quadrático — só toca as células do bounding box. */
		const stamp = (x: number, y: number) => {
			const r = HEAT_RADIUS
			const minC = Math.max(0, Math.floor((x - r) / CELL))
			const maxC = Math.min(cols - 1, Math.floor((x + r) / CELL))
			const minR = Math.max(0, Math.floor((y - r) / CELL))
			const maxR = Math.min(rows - 1, Math.floor((y + r) / CELL))
			for (let cy = minR; cy <= maxR; cy++) {
				for (let cx = minC; cx <= maxC; cx++) {
					const dx = (cx + 0.5) * CELL - x
					const dy = (cy + 0.5) * CELL - y
					const d = Math.sqrt(dx * dx + dy * dy)
					if (d > r) continue
					const w = (1 - d / r) * (1 - d / r)
					const i = cy * cols + cx
					if (w > heat[i]) {
						heat[i] = w
						if (w > heatMax) heatMax = w
						heatDirty = true
					}
				}
			}
		}

		const draw = (t: number, offset: number) => {
			if (!gl) return
			gl.uniform1f(uni.u_time, t)
			gl.uniform1f(uni.u_offset, offset)
			gl.clearColor(0, 0, 0, 0)
			gl.clear(gl.COLOR_BUFFER_BIT)
			gl.drawArrays(gl.TRIANGLES, 0, 3)
		}

		const drawStatic = () => {
			const rect = canvas.getBoundingClientRect()
			draw(0, window.scrollY + rect.top)
		}

		if (!initGL()) {
			setFailed(true)
			return
		}
		resize()
		drawStatic()

		let raf = 0
		let last = 0
		let running = false
		let idleCleared = false
		const loop = (now: number) => {
			if (!running || !gl) return
			raf = requestAnimationFrame(loop)
			const dt = Math.min(0.1, (now - last) / 1000)
			last = now
			const rect = canvas.getBoundingClientRect()

			// Rastro: carimba o segmento percorrido desde o último frame.
			if (pointer.moved) {
				pointer.moved = false
				const x0 = pointer.px - rect.left
				const y0 = pointer.py - rect.top
				const x1 = pointer.x - rect.left
				const y1 = pointer.y - rect.top
				pointer.px = pointer.x
				pointer.py = pointer.y
				const steps =
					1 + Math.floor(Math.hypot(x1 - x0, y1 - y0) / (CELL * 0.75))
				for (let s = 0; s <= steps; s++) {
					stamp(
						x0 + ((x1 - x0) * s) / steps,
						y0 + ((y1 - y0) * s) / steps
					)
				}
			}

			// Decay exponencial; abaixo do limiar, zera e para de subir textura.
			if (heatMax > 0.004) {
				const k = Math.exp(-dt / HEAT_TAU)
				for (let i = 0; i < heat.length; i++) heat[i] *= k
				heatMax *= k
				heatDirty = true
			} else if (heatMax > 0) {
				heat.fill(0)
				heatMax = 0
				heatDirty = true
			}
			if (heatDirty) uploadHeat()

			/* Frio e já limpo = nada a desenhar: o campo só existe onde há
			   calor, então o loop vira no-op até o próximo mousemove. */
			if (heatMax === 0) {
				if (!idleCleared) {
					gl.clearColor(0, 0, 0, 0)
					gl.clear(gl.COLOR_BUFFER_BIT)
					idleCleared = true
				}
				return
			}
			idleCleared = false

			draw((now / 1000) % 3600, window.scrollY + rect.top)
		}
		const start = () => {
			if (running) return
			running = true
			last = performance.now()
			raf = requestAnimationFrame(loop)
		}
		const stop = () => {
			running = false
			cancelAnimationFrame(raf)
		}

		// Congelado até o fim do loader: pintado, mas parado.
		const frozen = reducedMotion || !ready

		const onMove = (event: MouseEvent) => {
			if (!pointer.has) {
				pointer.px = event.clientX
				pointer.py = event.clientY
				pointer.has = true
			}
			pointer.x = event.clientX
			pointer.y = event.clientY
			pointer.moved = true
		}
		if (!frozen && finePointer) {
			window.addEventListener('mousemove', onMove, { passive: true })
		}

		// Fora da viewport o loop para — só o visível gasta frame.
		const io = new IntersectionObserver(
			(entries) => {
				if (frozen) return
				if (entries.some((entry) => entry.isIntersecting)) start()
				else stop()
			},
			{ rootMargin: '100px' }
		)
		io.observe(canvas)

		const ro = new ResizeObserver(() => {
			resize()
			if (!running) drawStatic()
		})
		ro.observe(canvas)

		// GPU pode descartar o contexto (comum no mobile): re-inicializa.
		const onLost = (event: Event) => {
			event.preventDefault()
			stop()
		}
		const onRestored = () => {
			uni = {}
			if (!initGL()) {
				setFailed(true)
				return
			}
			resize()
			drawStatic()
			if (!frozen) start()
		}
		canvas.addEventListener('webglcontextlost', onLost)
		canvas.addEventListener('webglcontextrestored', onRestored)

		return () => {
			stop()
			io.disconnect()
			ro.disconnect()
			window.removeEventListener('mousemove', onMove)
			canvas.removeEventListener('webglcontextlost', onLost)
			canvas.removeEventListener('webglcontextrestored', onRestored)
			/* NÃO usar WEBGL_lose_context aqui: o effect re-executa no flip
			   do page-ready (e no StrictMode) sobre o MESMO canvas, e
			   getContext devolveria o contexto morto — a re-init falharia e
			   cairia no fallback 2D. O contexto vive com o canvas e é
			   reaproveitado pelas próximas execuções. */
		}
	}, [rgb, ready])

	// Sem WebGL (ou shader que não compilou): volta ao campo 2D.
	if (failed) return <AsciiField className={className} rgb={rgb} />

	return (
		<canvas
			ref={canvasRef}
			aria-hidden
			className={cn(
				'pointer-events-none block h-full w-full font-mono',
				className
			)}
		/>
	)
}
