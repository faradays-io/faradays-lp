/* ------------------------------------------------------------------ *
 * Raster da marca Faradays em 3D isométrico para ASCII — uma passada só.
 *
 * A mesma receita do donut.c e do lab de marca 3D (`hero-mark-3d.tsx`):
 * o sólido é a marca (os dois paths do favicon, 139×87) extrudada em
 * `MARK_DEPTH`, vista pela câmera do lab (azimute 32°, elevação 26°) em
 * projeção ortográfica — "isométrica" de fato, sem perspectiva. Por célula
 * do grid de caracteres, lançamos SS×SS raios paralelos à câmera:
 *
 *   - bate na tampa (z = 0) se o ponto cair dentro da máscara do SVG;
 *   - senão marcha pela espessura (z de 0 a −D) até entrar na máscara —
 *     é uma lateral, cuja normal sai do gradiente da máscara no ponto.
 *
 * A "luminância" vira TINTA (0–1): tampa cheia, lateral direita média,
 * lateral de cima rala — as três tonalidades clássicas do isométrico, que
 * no shader escolhem o degrau da rampa (`RAMP_BUCKETS`). Nas células da
 * silhueta (cobertura parcial), em vez de um caractere ralo da rampa, entra
 * um glifo direcional (`- | / \`) alinhado à borda: é o que faz o desenho
 * ASCII isométrico ler como traço, não como ruído ordenado por brilho
 * (versão leve do "shape-aware" do renderer da Codrops, 2026-09).
 *
 * Tudo aqui roda uma vez por (re)dimensionamento, na CPU, em ~10–20 ms:
 * só a máscara do SVG usa um canvas 2D. A saída é um grid `cols×rows`
 * do tamanho do canvas inteiro — fora da marca a tinta é 0 e o shader
 * descarta — para o brilho e os blobs do shader usarem a mesma célula.
 * ------------------------------------------------------------------ */

export const MARK_W = 139
export const MARK_H = 87
/** Espessura da extrusão em unidades do SVG — a do lab (`depth: 22`). */
export const MARK_DEPTH = 22
const AZIMUTH = 32
const ELEVATION = 26

/* Os dois paths do favicon (`public/logo/fav.svg` / `src/app/icon.svg`). */
const MARK_PATHS = [
	'M138.995 34.5807V1.14441e-05L39.7128 0H0V6.17513L46.1661 6.17512C46.1661 6.17512 47.2762 6.16503 47.9036 6.42212C48.5374 6.68183 49.1446 7.41015 49.1446 7.41015L74.9579 33.0986C74.9579 33.0986 75.9317 34.0297 76.6954 34.3336C77.4154 34.6202 78.4328 34.5806 78.4328 34.5806L138.995 34.5807Z',
	'M0.00195312 24.5825V59.165H84.3448C84.3448 59.165 85.6114 59.3702 86.3305 59.6591C87.0898 59.964 87.8064 60.6471 87.8064 60.6471L112.404 85.3475C112.404 85.3475 112.996 86.0952 113.634 86.3355C114.178 86.5403 115.123 86.5825 115.123 86.5825H139.002V52.9899H77.8912C77.8912 52.9899 76.7812 53 76.1537 52.7429C75.5199 52.4832 74.9127 51.7549 74.9127 51.7549L49.0984 26.0665C49.0984 26.0665 48.1246 25.1354 47.3609 24.8314C46.6409 24.5448 45.6234 24.5844 45.6234 24.5844L0.00195312 24.5825Z'
]

/* Rampa de densidade em 8 degraus (o 0 é o vazio, nunca desenhado), cada
   um com 4 caracteres de peso parecido: o shader escolhe o degrau pela tinta
   e o caractere por um hash da célula que se re-sorteia de tempo em tempo —
   o preenchimento varia sem perder o tom. Sem `- | / \`, que são as bordas. */
export const RAMP_BUCKETS = [
	'    ',
	".,'`",
	':;^"',
	'~=+*',
	'xzcv',
	'nuvo',
	'kbdq',
	'#%&8',
	'@$BW'
]
export const RAMP_VARIANTS = 4
/** Bits do canal de código: célula da tampa (frontal) e da lateral. */
export const FACE_BIT = 8
export const SIDE_BIT = 16
/** Glifos de borda — o código na textura é 1-based (0 = usa a rampa). */
export const EDGE_GLYPHS = '-|/\\'

/* Máscara em 6 px por unidade do SVG: 834×522, nítida o bastante para o
   gradiente das laterais sem pesar. */
const MASK_SCALE = 6
/* Raios por célula, por eixo (3×3 = 9): cobertura em 10 níveis. */
const SS = 3

/* Tinta por face. Segue o lab: tampa em tinta escura (#161616) e laterais
   mais claras (#2e2e2e), com a luz-chave vindo de cima/direita — logo a
   lateral de cima é a mais clara. Em ASCII, mais tinta = mais denso. */
const INK_FRONT = 0.82
const INK_SIDE = 0.58
const INK_TOP = 0.34
/* A tampa clareia rumo ao canto de cima/direita (de onde vem a luz): um
   degrau ou dois da rampa, para não virar um campo chapado de `#`. */
const CAP_SHADE = 0.16
/* As laterais clareiam ~20% até o fundo: sem isso cada face vira um tom
   único e o sólido lê como mancha chapada. */
const DEPTH_FADE = 0.2

const DEG = Math.PI / 180

export interface MarkGrid {
	cols: number
	rows: number
	cellW: number
	cellH: number
	/** Tinta por célula, 0–255. */
	ink: Uint8Array
	/** Bits 0–2: glifo de borda (0 = rampa, 1–4 = índice+1 em EDGE_GLYPHS).
	 *  Bit 3 (`FACE_BIT`): célula da tampa (face frontal). Bit 4
	 *  (`SIDE_BIT`): célula da lateral direita. O topo não tem bit. O
	 *  shader usa isso para o realce do ponteiro tingir só tampa e lateral. */
	code: Uint8Array
}

export interface MarkMask {
	data: Uint8Array
	width: number
	height: number
}

/** Rasteriza os paths do SVG numa máscara binária (precisa de DOM). */
export function buildMarkMask(): MarkMask | null {
	const canvas = document.createElement('canvas')
	canvas.width = MARK_W * MASK_SCALE
	canvas.height = MARK_H * MASK_SCALE
	const ctx = canvas.getContext('2d', { willReadFrequently: true })
	if (!ctx) return null
	ctx.scale(MASK_SCALE, MASK_SCALE)
	ctx.fillStyle = '#fff'
	for (const d of MARK_PATHS) ctx.fill(new Path2D(d))
	const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
	const mask = new Uint8Array(canvas.width * canvas.height)
	for (let i = 0; i < mask.length; i++)
		mask[i] = data[i * 4 + 3] > 127 ? 1 : 0
	return { data: mask, width: canvas.width, height: canvas.height }
}

/* Câmera ortográfica do lab. `c` aponta da origem para a câmera; `right`
   e `up` são os eixos da tela no mundo (x direita, y cima, z para o
   espectador). A marca vive no plano z = 0 e extruda para −z. */
function camera() {
	const az = AZIMUTH * DEG
	const el = ELEVATION * DEG
	const c = [
		Math.sin(az) * Math.cos(el),
		Math.sin(el),
		Math.cos(az) * Math.cos(el)
	]
	const right = [Math.cos(az), 0, -Math.sin(az)]
	const up = [
		-Math.sin(el) * Math.sin(az),
		Math.cos(el),
		-Math.sin(el) * Math.cos(az)
	]
	return { c, right, up }
}

/** Caixa da marca projetada na tela, em unidades do SVG. */
export function projectedBounds() {
	const { right, up } = camera()
	let x0 = Infinity
	let y0 = Infinity
	let x1 = -Infinity
	let y1 = -Infinity
	for (const x of [-MARK_W / 2, MARK_W / 2])
		for (const y of [-MARK_H / 2, MARK_H / 2])
			for (const z of [-MARK_DEPTH, 0]) {
				const sx = x * right[0] + y * right[1] + z * right[2]
				const sy = x * up[0] + y * up[1] + z * up[2]
				if (sx < x0) x0 = sx
				if (sx > x1) x1 = sx
				if (sy < y0) y0 = sy
				if (sy > y1) y1 = sy
			}
	return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 }
}

export interface RasterOptions {
	/** Tamanho do canvas em px CSS. */
	width: number
	height: number
	cellW: number
	cellH: number
	/** Fração máxima do canvas que a marca ocupa, por eixo. */
	fitW: number
	fitH: number
	/** Onde fica o centro da marca, em fração do canvas (0,5 = centro). */
	anchorX: number
	anchorY: number
}

/**
 * Lança os raios e devolve o grid de tinta + glifos de borda para o canvas
 * inteiro; a marca cabe em `fitW`×`fitH` do canvas, com o centro na âncora.
 */
export function rasterMark(mask: MarkMask, o: RasterOptions): MarkGrid {
	const cols = Math.max(1, Math.ceil(o.width / o.cellW))
	const rows = Math.max(1, Math.ceil(o.height / o.cellH))
	const ink = new Uint8Array(cols * rows)
	const code = new Uint8Array(cols * rows)
	const cov = new Float32Array(cols * rows)
	const inkAvg = new Float32Array(cols * rows)

	const { c, right, up } = camera()
	const bounds = projectedBounds()
	// px por unidade do SVG, centrada no canvas.
	const scale = Math.min(
		(o.width * o.fitW) / bounds.w,
		(o.height * o.fitH) / bounds.h
	)
	const cx = o.width * o.anchorX
	const cy = o.height * o.anchorY
	const bcx = (bounds.x0 + bounds.x1) / 2
	const bcy = (bounds.y0 + bounds.y1) / 2

	const mw = mask.width
	const mh = mask.height
	const inside = (u: number, v: number) => {
		const iu = (u * MASK_SCALE) | 0
		const iv = (v * MASK_SCALE) | 0
		if (iu < 0 || iv < 0 || iu >= mw || iv >= mh) return 0
		return mask.data[iv * mw + iu]
	}
	// Gradiente da máscara em três raios: mais direções que um só 3×3.
	const normalAt = (u: number, v: number) => {
		let gu = 0
		let gv = 0
		for (const e of [0.5, 1, 1.75]) {
			gu += inside(u + e, v) - inside(u - e, v)
			gv += inside(u, v + e) - inside(u, v - e)
		}
		const len = Math.hypot(gu, gv)
		// Sem gradiente (ponto interno): normal voltada para a câmera.
		if (len === 0) return { nx: c[0], ny: c[1] }
		// O gradiente aponta para dentro; a normal externa é o oposto.
		// v cresce para baixo no SVG, y do mundo cresce para cima.
		return { nx: -gu / len, ny: gv / len }
	}

	// Alcance do raio dentro da espessura (parâmetro s, por unidade de c).
	const sMax = MARK_DEPTH / c[2]
	const dsCoarse = 1.2
	const coarseSteps = Math.ceil(sMax / dsCoarse)

	/* Tinta do raio que passa pelo ponto de tela (sx, sy), em unidades do
	   SVG, ou -1 se não toca o sólido. `hitFace` diz que face foi atingida
	   (0 tampa, 1 lateral, 2 topo), lido logo depois da chamada. */
	let hitFace = 0
	const trace = (sx: number, sy: number): number => {
		// Ponto onde o raio cruza o plano da tampa (z = 0).
		const t0 = (sx * right[2] + sy * up[2]) / c[2]
		const x0 = sx * right[0] + sy * up[0] - t0 * c[0]
		const y0 = sx * right[1] + sy * up[1] - t0 * c[1]
		const u0 = x0 + MARK_W / 2
		const v0 = MARK_H / 2 - y0
		if (inside(u0, v0)) {
			hitFace = 0
			return (
				INK_FRONT -
				CAP_SHADE * (0.5 * (u0 / MARK_W) + 0.5 * (1 - v0 / MARK_H))
			)
		}

		// Marcha grossa pela espessura; ao entrar, refina por bissecção.
		let sPrev = 0
		for (let i = 1; i <= coarseSteps; i++) {
			const s = Math.min(sMax, i * dsCoarse)
			if (inside(u0 - s * c[0], v0 + s * c[1])) {
				let a = sPrev
				let b = s
				for (let k = 0; k < 4; k++) {
					const m = (a + b) / 2
					if (inside(u0 - m * c[0], v0 + m * c[1])) b = m
					else a = m
				}
				const u = u0 - b * c[0]
				const v = v0 + b * c[1]
				const { nx, ny } = normalAt(u, v)
				// Lateral se a normal aponta mais para o lado que para cima.
				hitFace = nx * nx >= ny * ny ? 1 : 2
				const side = INK_SIDE * nx * nx + INK_TOP * ny * ny
				return side * (1 - DEPTH_FADE * (b / sMax))
			}
			sPrev = s
		}
		return -1
	}

	// Só as células que a caixa projetada toca (com 1 de folga).
	const px0 = cx + (bounds.x0 - bcx) * scale
	const px1 = cx + (bounds.x1 - bcx) * scale
	const py0 = cy - (bounds.y1 - bcy) * scale
	const py1 = cy - (bounds.y0 - bcy) * scale
	const c0 = Math.max(0, Math.floor(px0 / o.cellW) - 1)
	const c1 = Math.min(cols - 1, Math.ceil(px1 / o.cellW) + 1)
	const r0 = Math.max(0, Math.floor(py0 / o.cellH) - 1)
	const r1 = Math.min(rows - 1, Math.ceil(py1 / o.cellH) + 1)

	const inv = SS * SS
	for (let r = r0; r <= r1; r++) {
		for (let col = c0; col <= c1; col++) {
			let hits = 0
			const faceHits = [0, 0, 0]
			let sum = 0
			for (let a = 0; a < SS; a++) {
				const px = (col + (a + 0.5) / SS) * o.cellW
				const sx = (px - cx) / scale + bcx
				for (let b = 0; b < SS; b++) {
					const py = (r + (b + 0.5) / SS) * o.cellH
					const sy = -(py - cy) / scale + bcy
					const t = trace(sx, sy)
					if (t < 0) continue
					hits++
					sum += t
					faceHits[hitFace]++
				}
			}
			if (hits === 0) continue
			const i = r * cols + col
			cov[i] = hits / inv
			inkAvg[i] = sum / hits
			ink[i] = Math.round(Math.min(1, sum / inv) * 255)
			// A face da célula é a que mais raios acertaram; topo fica sem bit.
			if (faceHits[0] >= faceHits[1] && faceHits[0] >= faceHits[2])
				code[i] = FACE_BIT
			else if (faceHits[1] >= faceHits[2]) code[i] = SIDE_BIT
		}
	}

	/* Silhueta: célula parcialmente coberta com cobertura variando nos
	   vizinhos. O glifo segue a direção da borda (perpendicular ao
	   gradiente da cobertura); a tinta é a média dos raios que bateram,
	   atenuada quando quase nada da célula está coberto. */
	for (let r = r0 + 1; r < r1; r++) {
		for (let col = c0 + 1; col < c1; col++) {
			const i = r * cols + col
			const cv = cov[i]
			if (cv < 0.1 || cv > 0.9) continue
			const gx = cov[i + 1] - cov[i - 1]
			const gy = cov[i + cols] - cov[i - cols]
			if (Math.hypot(gx, gy) < 0.25) continue
			// Direção da borda em y-para-cima, dobrada para [0, 180).
			let deg = (Math.atan2(gx, gy) / DEG + 360) % 180
			if (deg >= 157.5) deg -= 180
			const glyph = deg < 22.5 ? 0 : deg < 67.5 ? 2 : deg < 112.5 ? 1 : 3
			code[i] = (code[i] & (FACE_BIT | SIDE_BIT)) | (glyph + 1)
			const fade = Math.min(1, Math.max(0, (cv - 0.1) / 0.4))
			ink[i] = Math.round(Math.min(1, inkAvg[i] * fade) * 255)
		}
	}

	return { cols, rows, cellW: o.cellW, cellH: o.cellH, ink, code }
}
