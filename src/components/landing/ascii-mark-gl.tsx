'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

import {
	buildMarkMask,
	EDGE_GLYPHS,
	FACE_BIT,
	type MarkGrid,
	RAMP_BUCKETS,
	RAMP_VARIANTS,
	rasterMark,
	SIDE_BIT
} from '@/components/landing/ascii-mark-raster'
import { usePageReady } from '@/lib/page-ready'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ *
 * A marca Faradays em ASCII isométrico, como fundo discreto do CTA.
 *
 * Duas camadas de custo bem separadas:
 *
 *   1. O 3D é resolvido UMA vez, na CPU (`ascii-mark-raster.ts`): raios
 *      ortográficos na câmera do lab dão, por célula, a tinta (0–1) e um
 *      glifo de borda. Isso vira uma textura LUMINANCE_ALPHA de cols×rows
 *      texels — não muda até o próximo resize.
 *   2. Por frame, um triângulo cobre o canvas e o fragment shader faz o
 *      resto: lê a célula, escolhe o degrau da rampa pela tinta e, dentro
 *      dele, o caractere por um hash da célula que se re-sorteia a cada
 *      ~8 s em fase própria (a textura "ferve" devagar, sem mudar de tom).
 *      Por cima, dois realces sutis — o brilho aleatório (hash da célula +
 *      época do tempo, zero CPU) e o rastro do ponteiro. O rastro são "blobs"
 *      metaball: até 32 discos gaussianos que nascem ao longo do caminho
 *      do mouse, herdam a velocidade, crescem e dissipam em ~1,8 s. A soma
 *      dos campos passa por um smoothstep, então blobs vizinhos se fundem
 *      como fluido, e um leve wobble senoidal desmancha o contorno redondo.
 *      É o efeito de "fluid cursor" sem simulação de fluido: a resolução
 *      útil é a célula (~10×16 px), e um Navier-Stokes de 4–6 passes por
 *      frame não compraria nada visível a esse tamanho.
 *
 * Idle: sem blobs o loop cai para ~30 fps (o brilho é lento), pausa fora
 * da viewport e congela até o page-ready; ponteiro só se for fino;
 * prefers-reduced-motion desenha um frame estático. Sem WebGL, o mesmo
 * grid é pintado uma vez em canvas 2D, sem realces.
 * ------------------------------------------------------------------ */

const MAX_BLOBS = 32
const BLOB_LIFE = 1.8 // s
const BLOB_GROW = 2.6 // raio final / raio inicial
const BLOB_INHERIT = 0.18 // fração da velocidade do ponteiro
const BLOB_DAMP = 0.6 // e-folding do amortecimento, em s
/* Atlas: tiles retangulares na proporção da célula (0,625), como o
   avanço de uma mono — sem esticar o glifo. */
const ATLAS_W = 20
const ATLAS_H = 32
const RAMP_TILES = RAMP_BUCKETS.length * RAMP_VARIANTS
const TILES = RAMP_TILES + EDGE_GLYPHS.length
const CELL_ASPECT = 0.625
/* Cada célula re-sorteia o seu caractere (dentro do degrau) uma vez por
   período, em fase própria — a cada segundo ~1/8 das células muda. */
const VARIANT_PERIOD = 8 // s
/* Fração do canvas que a marca ocupa e onde fica o centro dela; quem usa
   pode passar as suas para encaixar a marca num vão específico. */
const DEFAULT_FIT = { w: 0.9, h: 0.9 }
const DEFAULT_ANCHOR = { x: 0.5, y: 0.5 }

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_size;
uniform float u_dpr;
uniform float u_time;
uniform vec2 u_cell;
uniform vec2 u_cells;
uniform sampler2D u_atlas;
uniform sampler2D u_grid;
uniform vec3 u_rgb;
uniform vec3 u_hi;
uniform float u_alpha;
uniform vec4 u_blobs[${MAX_BLOBS}];
uniform int u_nblobs;

float hash(vec2 p) {
	p = fract(p * vec2(123.34, 456.21));
	p += dot(p, p + 45.32);
	return fract(p.x * p.y);
}

void main() {
	vec2 p = vec2(gl_FragCoord.x, u_size.y * u_dpr - gl_FragCoord.y) / u_dpr;
	vec2 cell = floor(p / u_cell);
	vec4 g = texture2D(u_grid, (cell + 0.5) / u_cells);
	float ink = g.r;
	float raw = floor(g.a * 255.0 + 0.5);
	/* Bits das faces (lateral, depois tampa) e, nos bits baixos, o glifo
	   de borda. 'tint' = 1 nas faces que o rastro tinge; o topo fica de fora. */
	float side = step(${SIDE_BIT}.0, raw);
	raw -= side * ${SIDE_BIT}.0;
	float face = step(${FACE_BIT}.0, raw);
	float code = raw - face * ${FACE_BIT}.0;
	float tint = max(face, side);
	vec2 center = (cell + 0.5) * u_cell;
	vec2 f = fract(p / u_cell);

	if (ink < 0.02) discard;

	/* Blobs: soma de gaussianas, com um wobble no centro para o contorno
	   não sair redondo; o smoothstep funde os vizinhos (metaball). */
	float field = 0.0;
	for (int i = 0; i < ${MAX_BLOBS}; i++) {
		if (i >= u_nblobs) break;
		vec4 b = u_blobs[i];
		vec2 q = center - b.xy;
		q += 0.12 * b.z * vec2(
			sin(center.y * 0.045 + u_time * 1.7),
			cos(center.x * 0.05 - u_time * 1.3));
		float d = length(q) / b.z;
		field += b.w * exp(-2.5 * d * d);
	}
	float heat = smoothstep(0.06, 0.6, field);

	/* Brilho: a cada época (~3 s, defasada por célula) ~7% das células
	   são sorteadas e fazem um pulso seno² de entrada e saída. */
	float h1 = hash(cell);
	float tt = u_time * 0.33 + h1;
	float ep = floor(tt);
	float sel = hash(cell + vec2(ep * 7.13, ep * 3.71) + 11.0);
	float pulse = sin(3.14159 * fract(tt));
	float tw = step(0.93, sel) * pulse * pulse;

	/* Caractere: o degrau vem da tinta (o calor engrossa um degrau); a
	   variante dentro do degrau é um hash da célula re-sorteado a cada
	   período, em fase própria. Nas bordas, o glifo direcional do raster. */
	float ev = clamp(ink + heat * 0.18, 0.0, 0.999);
	float bucket = clamp(1.0 + floor(ev * 8.0), 1.0, 8.0);
	float epV = floor(u_time / ${VARIANT_PERIOD}.0 + hash(cell + 3.7));
	float variant = min(${RAMP_VARIANTS - 1}.0,
		floor(hash(cell + vec2(epV * 5.31, epV * 2.17) + 29.0) * ${RAMP_VARIANTS}.0));
	float idx = bucket * ${RAMP_VARIANTS}.0 + variant;
	if (code > 0.5) idx = ${RAMP_TILES - 1}.0 + code;
	float glyph = texture2D(u_atlas, vec2((idx + f.x) / ${TILES}.0, f.y)).a;

	/* Profundidade no hover: o tinte azul entra na tampa e na lateral; o
	   topo recebe o mesmo engrossamento de caractere e um alpha menor, mas
	   fica na cor base — a face de cima continua se distinguindo. */
	float a = u_alpha * (0.5 + 0.5 * ink) + tw * 0.1 +
		heat * (0.1 + 0.12 * tint);
	vec3 col = mix(u_rgb, u_hi, clamp(tw * 0.7 + heat * 0.85 * tint, 0.0, 1.0));
	gl_FragColor = vec4(col, clamp(a, 0.0, 1.0) * glyph);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
	const shader = gl.createShader(type)
	if (!shader) return null
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		// Sem isso a falha é muda: o fallback 2D nem consegue contexto num
		// canvas que já tem WebGL, e a marca simplesmente não aparece.
		console.warn('AsciiMarkGl: shader', gl.getShaderInfoLog(shader))
		return null
	}
	return shader
}

/* Atlas: rampa + glifos de borda lado a lado, brancos, coverage no alpha. */
function buildAtlas(mono: string) {
	const atlas = document.createElement('canvas')
	atlas.width = ATLAS_W * TILES
	atlas.height = ATLAS_H
	const ctx = atlas.getContext('2d')
	if (!ctx) return null
	ctx.fillStyle = '#fff'
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.font = `${ATLAS_H * 0.75}px ${mono}`
	// Tile i = caractere i: degrau*variantes + variante; bordas no fim.
	const chars = RAMP_BUCKETS.join('') + EDGE_GLYPHS
	for (let i = 0; i < chars.length; i++) {
		if (chars[i] === ' ') continue
		ctx.fillText(chars[i], i * ATLAS_W + ATLAS_W / 2, ATLAS_H / 2)
	}
	return atlas
}

/* Cor CSS → [r, g, b] em 0–1, passando por um canvas 2D: os tokens do
   tema são oklch e o computed style devolve a string oklch, não rgb. */
function toRgb(css: string): [number, number, number] {
	const c = document.createElement('canvas')
	c.width = c.height = 1
	const ctx = c.getContext('2d')
	if (!ctx) return [0, 0, 0]
	ctx.fillStyle = css
	ctx.fillRect(0, 0, 1, 1)
	const d = ctx.getImageData(0, 0, 1, 1).data
	return [d[0] / 255, d[1] / 255, d[2] / 255]
}

/* Célula pela largura: ~16 px de altura no canvas de 1920, nunca menos de
   12 nem mais de 18; a largura segue a proporção da mono. */
function cellFor(width: number) {
	const cellH = Math.min(18, Math.max(12, Math.round(width / 120)))
	return { cellW: Math.round(cellH * CELL_ASPECT), cellH }
}

/* Fallback sem WebGL: o grid pintado uma vez, sem brilho nem rastro. */
function drawStatic2d(
	canvas: HTMLCanvasElement,
	grid: MarkGrid,
	rgb: [number, number, number],
	alpha: number,
	mono: string
) {
	const ctx = canvas.getContext('2d')
	if (!ctx) return
	const dpr = Math.min(window.devicePixelRatio || 1, 2)
	canvas.width = Math.round(canvas.clientWidth * dpr)
	canvas.height = Math.round(canvas.clientHeight * dpr)
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
	ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.font = `${grid.cellH * 0.75}px ${mono}`
	const [r, g, b] = rgb.map((v) => Math.round(v * 255))
	for (let row = 0; row < grid.rows; row++) {
		for (let col = 0; col < grid.cols; col++) {
			const i = row * grid.cols + col
			const ink = grid.ink[i] / 255
			const x = (col + 0.5) * grid.cellW
			const y = (row + 0.5) * grid.cellH
			if (ink < 0.02) continue
			const code = grid.code[i] & ~(FACE_BIT | SIDE_BIT)
			const bucket = Math.min(8, 1 + Math.floor(ink * 8))
			const variant = (col * 7 + row * 13) % RAMP_VARIANTS
			const ch =
				code > 0 ? EDGE_GLYPHS[code - 1] : RAMP_BUCKETS[bucket][variant]
			ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * (0.5 + 0.5 * ink)})`
			ctx.fillText(ch, x, y)
		}
	}
}

export function AsciiMarkGl({
	className,
	fit = DEFAULT_FIT,
	anchor = DEFAULT_ANCHOR
}: {
	className?: string
	/** Fração do canvas que a marca pode ocupar, por eixo. */
	fit?: { w: number; h: number }
	/** Centro da marca, em fração do canvas (0,5 = centro). */
	anchor?: { x: number; y: number }
}) {
	const { w: fitW, h: fitH } = fit
	const { x: anchorX, y: anchorY } = anchor
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const ready = usePageReady()
	const { resolvedTheme } = useTheme()

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches
		const finePointer = window.matchMedia('(pointer: fine)').matches
		const style = getComputedStyle(canvas)
		const mono = style.fontFamily
		const rgb = toRgb(style.color)
		const hi = toRgb(style.getPropertyValue('--brand').trim() || '#0065e0')
		/* Tema pela cor de texto, não pela classe no <html>: algumas rotas
		   forçam `.light` num wrapper e a classe global mentiria. */
		const dark = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] > 0.5
		const baseAlpha = dark ? 0.15 : 0.18
		const dpr = Math.min(window.devicePixelRatio || 1, 2)

		const mask = buildMarkMask()
		if (!mask) return

		let gl: WebGLRenderingContext | null = null
		let program: WebGLProgram | null = null
		let uni: Record<string, WebGLUniformLocation | null> = {}
		let gridTex: WebGLTexture | null = null
		let grid: MarkGrid | null = null

		// Blobs em arrays paralelos — nada aloca no loop.
		const bx = new Float32Array(MAX_BLOBS)
		const by = new Float32Array(MAX_BLOBS)
		const bvx = new Float32Array(MAX_BLOBS)
		const bvy = new Float32Array(MAX_BLOBS)
		const br = new Float32Array(MAX_BLOBS)
		const bage = new Float32Array(MAX_BLOBS)
		const blobsU = new Float32Array(MAX_BLOBS * 4)
		let nBlobs = 0
		let spawnAcc = 0
		const pointer = {
			x: 0,
			y: 0,
			px: 0,
			py: 0,
			t: 0,
			pt: 0,
			moved: false,
			has: false
		}

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
			program = gl.createProgram()
			if (!vs || !fs || !program) return false
			gl.attachShader(program, vs)
			gl.attachShader(program, fs)
			gl.linkProgram(program)
			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false
			gl.useProgram(program)

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
				'u_cell',
				'u_cells',
				'u_atlas',
				'u_grid',
				'u_rgb',
				'u_hi',
				'u_alpha',
				'u_blobs',
				'u_nblobs'
			]) {
				uni[name] = gl.getUniformLocation(program, name)
			}
			gl.uniform1f(uni.u_dpr, dpr)
			gl.uniform3f(uni.u_rgb, rgb[0], rgb[1], rgb[2])
			gl.uniform3f(uni.u_hi, hi[0], hi[1], hi[2])
			gl.uniform1f(uni.u_alpha, baseAlpha)
			gl.uniform1i(uni.u_nblobs, 0)
			gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)

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

			// Grid da marca na unidade 1 — preenchida no resize.
			gridTex = gl.createTexture()
			gl.activeTexture(gl.TEXTURE1)
			gl.bindTexture(gl.TEXTURE_2D, gridTex)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
			gl.uniform1i(uni.u_grid, 1)
			return true
		}

		/* Resize = re-raster: o 3D é resolvido de novo para o novo grid e
		   sobe inteiro como textura de dois canais (tinta, código). */
		const resize = () => {
			const width = canvas.clientWidth
			const height = canvas.clientHeight
			if (width === 0 || height === 0) return
			const { cellW, cellH } = cellFor(width)
			grid = rasterMark(mask, {
				width,
				height,
				cellW,
				cellH,
				fitW,
				fitH,
				anchorX,
				anchorY
			})
			if (!gl) return
			canvas.width = Math.round(width * dpr)
			canvas.height = Math.round(height * dpr)
			gl.viewport(0, 0, canvas.width, canvas.height)
			gl.uniform2f(uni.u_size, width, height)
			gl.uniform2f(uni.u_cell, cellW, cellH)
			gl.uniform2f(uni.u_cells, grid.cols, grid.rows)
			const texels = new Uint8Array(grid.cols * grid.rows * 2)
			for (let i = 0; i < grid.ink.length; i++) {
				texels[i * 2] = grid.ink[i]
				texels[i * 2 + 1] = grid.code[i]
			}
			gl.activeTexture(gl.TEXTURE1)
			gl.bindTexture(gl.TEXTURE_2D, gridTex)
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				gl.LUMINANCE_ALPHA,
				grid.cols,
				grid.rows,
				0,
				gl.LUMINANCE_ALPHA,
				gl.UNSIGNED_BYTE,
				texels
			)
		}

		const spawn = (x: number, y: number, vx: number, vy: number) => {
			// Cheio: recicla o mais velho.
			let i = nBlobs
			if (i >= MAX_BLOBS) {
				i = 0
				for (let k = 1; k < MAX_BLOBS; k++) if (bage[k] > bage[i]) i = k
			} else nBlobs++
			bx[i] = x
			by[i] = y
			bvx[i] = vx * BLOB_INHERIT
			bvy[i] = vy * BLOB_INHERIT
			br[i] = (grid?.cellH ?? 16) * 2.8
			bage[i] = 0
		}

		const stepBlobs = (dt: number) => {
			const k = Math.exp(-dt / BLOB_DAMP)
			for (let i = 0; i < nBlobs; ) {
				bage[i] += dt
				if (bage[i] >= BLOB_LIFE) {
					// Remove trocando pelo último.
					nBlobs--
					bx[i] = bx[nBlobs]
					by[i] = by[nBlobs]
					bvx[i] = bvx[nBlobs]
					bvy[i] = bvy[nBlobs]
					br[i] = br[nBlobs]
					bage[i] = bage[nBlobs]
					continue
				}
				bx[i] += bvx[i] * dt
				by[i] += bvy[i] * dt
				bvx[i] *= k
				bvy[i] *= k
				const life = bage[i] / BLOB_LIFE
				// Entra rápido, sai devagar; o raio cresce enquanto dissipa.
				const strength =
					Math.min(1, life / 0.1) * Math.pow(1 - life, 1.2)
				blobsU[i * 4] = bx[i]
				blobsU[i * 4 + 1] = by[i]
				blobsU[i * 4 + 2] = br[i] * (1 + (BLOB_GROW - 1) * life)
				blobsU[i * 4 + 3] = strength
				i++
			}
		}

		const draw = (t: number) => {
			if (!gl) return
			gl.uniform1f(uni.u_time, t)
			gl.uniform1i(uni.u_nblobs, nBlobs)
			if (nBlobs > 0) gl.uniform4fv(uni.u_blobs, blobsU)
			gl.clearColor(0, 0, 0, 0)
			gl.clear(gl.COLOR_BUFFER_BIT)
			gl.drawArrays(gl.TRIANGLES, 0, 3)
		}

		/* Sem WebGL: o mesmo grid, pintado uma vez em 2D e repintado no
		   resize — sem brilho nem rastro. */
		const fallback2d = () => {
			const paint = () => {
				const width = canvas.clientWidth
				const height = canvas.clientHeight
				if (width === 0 || height === 0) return
				const { cellW, cellH } = cellFor(width)
				const g = rasterMark(mask, {
					width,
					height,
					cellW,
					cellH,
					fitW,
					fitH,
					anchorX,
					anchorY
				})
				drawStatic2d(canvas, g, rgb, baseAlpha, mono)
			}
			const ro = new ResizeObserver(paint)
			ro.observe(canvas)
			return () => ro.disconnect()
		}

		if (!initGL()) return fallback2d()
		resize()
		draw(0)

		let raf = 0
		let last = 0
		let frame = 0
		let running = false
		const loop = (now: number) => {
			if (!running || !gl || !grid) return
			raf = requestAnimationFrame(loop)
			frame++
			const dt = Math.min(0.1, (now - last) / 1000)
			last = now

			// Rastro: semeia blobs ao longo do trecho percorrido no frame.
			if (pointer.moved) {
				pointer.moved = false
				const rect = canvas.getBoundingClientRect()
				const x0 = pointer.px - rect.left
				const y0 = pointer.py - rect.top
				const x1 = pointer.x - rect.left
				const y1 = pointer.y - rect.top
				const pdt = Math.max(0.008, (pointer.t - pointer.pt) / 1000)
				pointer.px = pointer.x
				pointer.py = pointer.y
				pointer.pt = pointer.t
				const margin = grid.cellH * 4
				if (
					x1 > -margin &&
					y1 > -margin &&
					x1 < rect.width + margin &&
					y1 < rect.height + margin
				) {
					const dist = Math.hypot(x1 - x0, y1 - y0)
					const vx = (x1 - x0) / pdt
					const vy = (y1 - y0) / pdt
					const gap = grid.cellH * 2.2
					spawnAcc += dist
					while (spawnAcc >= gap) {
						spawnAcc -= gap
						const s = dist > 0 ? 1 - spawnAcc / dist : 1
						spawn(x0 + (x1 - x0) * s, y0 + (y1 - y0) * s, vx, vy)
					}
				}
			}
			stepBlobs(dt)

			// Sem rastro, o brilho lento não precisa de 60 fps.
			if (nBlobs === 0 && frame % 2 === 1) return
			draw((now / 1000) % 3600)
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
				pointer.pt = event.timeStamp
				pointer.has = true
			}
			pointer.x = event.clientX
			pointer.y = event.clientY
			pointer.t = event.timeStamp
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
			if (!running) draw(0)
		})
		ro.observe(canvas)

		// GPU pode descartar o contexto: re-inicializa.
		const onLost = (event: Event) => {
			event.preventDefault()
			stop()
		}
		const onRestored = () => {
			uni = {}
			if (!initGL()) return
			resize()
			draw(0)
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
			/* O contexto fica com o canvas (o effect re-executa no page-ready
			   e na troca de tema sobre o MESMO elemento); só o programa é
			   descartado para não acumular a cada execução. */
			if (gl && program) gl.deleteProgram(program)
		}
	}, [ready, resolvedTheme, fitW, fitH, anchorX, anchorY])

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
