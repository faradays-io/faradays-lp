'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

const VERTEX_SRC = `
attribute vec2 a_pos;
void main() {
	gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

/**
 * Animated ordered dithering: an fbm noise field forms a drifting organic
 * blob, quantized to the two page colors through an 8x8 Bayer matrix — the
 * halftone dots live only in the transition band.
 */
const FRAGMENT_SRC = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_cell;

const vec3 DARK = vec3(0.0588, 0.0588, 0.0549);  /* #0f0f0e */
const vec3 LIGHT = vec3(0.9569, 0.9569, 0.9569); /* #f4f4f4 */

float hash(vec2 p) {
	p = fract(p * vec2(123.34, 456.21));
	p += dot(p, p + 45.32);
	return fract(p.x * p.y);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(
		mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
		mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
		u.y
	);
}

float fbm(vec2 p) {
	float value = 0.0;
	float amplitude = 0.5;
	for (int i = 0; i < 4; i++) {
		value += amplitude * noise(p);
		p *= 2.0;
		amplitude *= 0.5;
	}
	return value;
}

float bayer2(vec2 a) {
	a = floor(a);
	return fract(a.x / 2.0 + a.y * a.y * 0.75);
}

#define BAYER4(a) (bayer2(0.5 * (a)) * 0.25 + bayer2(a))
#define BAYER8(a) (BAYER4(0.5 * (a)) * 0.25 + bayer2(a))

void main() {
	vec2 cell = floor(gl_FragCoord.xy / u_cell);
	vec2 p = cell * u_cell / u_resolution;
	float aspect = u_resolution.x / u_resolution.y;

	vec2 q = vec2(p.x * aspect, p.y);
	float n = fbm(q * vec2(0.55, 1.3) + vec2(u_time * 0.05, u_time * 0.015));

	/* Light near the top, dark blob below, wavy animated boundary. */
	float v = p.y + (n - 0.5) * 1.1;
	float luminance = smoothstep(0.4, 0.85, v);

	float threshold = BAYER8(cell);
	float lit = step(threshold, luminance - 0.001);
	gl_FragColor = vec4(mix(DARK, LIGHT, lit), 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
	const shader = gl.createShader(type)
	if (!shader) return null
	gl.shaderSource(shader, src)
	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(shader))
		gl.deleteShader(shader)
		return null
	}
	return shader
}

export function DitherCanvas({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const gl = canvas.getContext('webgl', {
			antialias: false,
			depth: false,
			stencil: false
		})
		if (!gl) return

		const vert = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC)
		const frag = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC)
		if (!vert || !frag) return
		const program = gl.createProgram()
		if (!program) return
		gl.attachShader(program, vert)
		gl.attachShader(program, frag)
		gl.linkProgram(program)
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error(gl.getProgramInfoLog(program))
			return
		}
		gl.useProgram(program)

		// Fullscreen triangle.
		const buffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 3, -1, -1, 3]),
			gl.STATIC_DRAW
		)
		const aPos = gl.getAttribLocation(program, 'a_pos')
		gl.enableVertexAttribArray(aPos)
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

		const uResolution = gl.getUniformLocation(program, 'u_resolution')
		const uTime = gl.getUniformLocation(program, 'u_time')
		const uCell = gl.getUniformLocation(program, 'u_cell')

		const dpr = Math.min(window.devicePixelRatio || 1, 2)

		const resize = () => {
			const width = Math.round(canvas.clientWidth * dpr)
			const height = Math.round(canvas.clientHeight * dpr)
			if (canvas.width !== width || canvas.height !== height) {
				canvas.width = width
				canvas.height = height
			}
			gl.viewport(0, 0, width, height)
			gl.uniform2f(uResolution, width, height)
			gl.uniform1f(uCell, 2 * dpr)
		}

		const render = (now: number) => {
			gl.uniform1f(uTime, now * 0.001)
			gl.drawArrays(gl.TRIANGLES, 0, 3)
		}

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		let raf = 0
		const loop = (now: number) => {
			render(now)
			raf = requestAnimationFrame(loop)
		}

		const ro = new ResizeObserver(() => {
			resize()
			if (reducedMotion) render(0)
		})
		ro.observe(canvas)
		resize()

		if (reducedMotion) render(0)
		else raf = requestAnimationFrame(loop)

		return () => {
			cancelAnimationFrame(raf)
			ro.disconnect()
			gl.getExtension('WEBGL_lose_context')?.loseContext()
		}
	}, [])

	return (
		<canvas
			ref={canvasRef}
			aria-hidden
			className={cn('block h-full w-full', className)}
		/>
	)
}
