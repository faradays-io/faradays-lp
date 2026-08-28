// Mascote Faradays — estrela pixelada com carinha (estilo pet de terminal).
// A estrela é RASTERIZADA (polígono de 5 pontas → grade 24×24), não desenhada
// à mão: pontas simétricas em qualquer paleta, contorno = pixels de borda.
// Rode: node mascote.mjs  → Mascote.dc.html
import fs from 'node:fs'

const N = 28
const CX = 14, CY = 14.7, R = 13.6, r = 7.2
const HEAD = "Geist, 'Helvetica Neue', Arial, system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

function starPoly() {
	const pts = []
	for (let k = 0; k < 10; k++) {
		const ang = -Math.PI / 2 + (k * Math.PI) / 5
		const rad = k % 2 === 0 ? R : r
		pts.push([CX + rad * Math.cos(ang), CY + rad * Math.sin(ang)])
	}
	return pts
}
function inside(px, py, poly) {
	let c = false
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		const [xi, yi] = poly[i], [xj, yj] = poly[j]
		if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c
	}
	return c
}
// grade: 0 vazio · 1 corpo · 2 contorno
function raster() {
	const poly = starPoly()
	const g = Array.from({ length: N }, () => Array(N).fill(0))
	for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (inside(x + 0.5, y + 0.5, poly)) g[y][x] = 1
	for (let y = 0; y < N; y++)
		for (let x = 0; x < N; x++)
			if (g[y][x] === 1) {
				const nb = [[0, -1], [0, 1], [-1, 0], [1, 0]].some(([dx, dy]) => !(g[y + dy]?.[x + dx]))
				if (nb) g[y][x] = 2
			}
	return g
}
const GRID = raster()

// Rosto (coordenadas de pixel). Olhos 2×3 com brilho; boca em "u"; bochechas.
const FACE = {
	eyesOpen: [[11, 13], [12, 13], [11, 14], [12, 14], [11, 15], [12, 15], [15, 13], [16, 13], [15, 14], [16, 14], [15, 15], [16, 15]],
	shine: [[11, 13], [15, 13]],
	eyesClosed: [[11, 15], [12, 15], [15, 15], [16, 15]],
	eyesHappy: [[10, 14], [11, 13], [12, 14], [15, 14], [16, 13], [17, 14]],
	mouth: [[12, 18], [13, 19], [14, 19], [15, 18]],
	mouthO: [[13, 18], [14, 18], [13, 19], [14, 19]],
	cheeks: [[9, 17], [18, 17]]
}
const PALETTES = {
	azul: { body: '#0065e0', edge: '#003a85', eye: '#0f0f0e', shine: '#ffffff', cheek: '#4f95ff', mouth: '#0f0f0e', spark: '#9cc6ff' },
	marfim: { body: '#f4f4f4', edge: '#bdbdbd', eye: '#0f0f0e', shine: '#ffffff', cheek: '#9cc6ff', mouth: '#0f0f0e', spark: '#0065e0' },
	eletrico: { body: '#ffc933', edge: '#b8780a', eye: '#0f0f0e', shine: '#ffffff', cheek: '#ff9a4d', mouth: '#0f0f0e', spark: '#0065e0' }
}

const rect = (x, y, fill, cls = '') => `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"${cls ? ` class="${cls}"` : ''}></rect>`
const key = (p) => p[0] + ',' + p[1]

/** SVG do mascote. `expr`: normal | piscar | feliz | surpreso. `anim`: liga o
 *  balanço, a piscada automática e as faíscas. */
function mascot(paletteName, size, { expr = 'normal', anim = false } = {}) {
	const P = PALETTES[paletteName]
	const faceKeys = new Set([...FACE.eyesOpen, ...FACE.eyesClosed, ...FACE.eyesHappy, ...FACE.mouth, ...FACE.mouthO, ...FACE.cheeks].map(key))
	let body = ''
	for (let y = 0; y < N; y++)
		for (let x = 0; x < N; x++) {
			const v = GRID[y][x]
			if (!v) continue
			body += rect(x, y, v === 2 ? P.edge : P.body)
		}
	// rosto por cima do corpo
	let face = FACE.cheeks.map(([x, y]) => rect(x, y, P.cheek)).join('')
	const eyes = (list, cls) => list.map(([x, y]) => rect(x, y, P.eye, cls)).join('')
	if (anim) {
		face += `<g class="eo">${eyes(FACE.eyesOpen)}</g><g class="ec">${eyes(FACE.eyesClosed)}</g>`
	} else if (expr === 'piscar') face += eyes(FACE.eyesClosed)
	else if (expr === 'feliz') face += eyes(FACE.eyesHappy)
	else face += eyes(FACE.eyesOpen)
	// faíscas (o lado Faraday): três pixels soltos que piscam fora da estrela
	const sparks = anim ? `${rect(24, 3, P.spark, 'sp s1')}${rect(1, 13, P.spark, 'sp s2')}${rect(26, 18, P.spark, 'sp s3')}${rect(3, 25, P.spark, 'sp s1')}` : ''
	void faceKeys
	return `<svg viewBox="0 0 ${N} ${N}" width="${size}" height="${size}" shape-rendering="crispEdges" class="${anim ? 'mascot bob' : 'mascot'}" aria-label="Mascote Faradays" role="img">${sparks}<g class="body">${body}${face}</g></svg>`
}

const label = (t) => `<span style="font-family:${MONO};font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#797a7e">${t}</span>`
const col = (inner, cap, extra = '') => `<div style="display:flex;flex-direction:column;align-items:center;gap:18px;${extra}">${inner}${label(cap)}</div>`

const css = `
body{margin:0;background:#0f0f0e}
a{color:#3b8eff}a:hover{color:#9cc6ff}
.mascot{display:block;image-rendering:pixelated}
.bob{animation:bob 1.4s steps(2,jump-none) infinite alternate}
@keyframes bob{from{transform:translateY(0)}to{transform:translateY(-8px)}}
.eo{animation:eo 3.6s steps(1) infinite}
.ec{animation:ec 3.6s steps(1) infinite}
@keyframes eo{0%,91%{opacity:1}92%,100%{opacity:0}}
@keyframes ec{0%,91%{opacity:0}92%,100%{opacity:1}}
.sp{animation:sp 2.4s steps(1) infinite;opacity:0}
.s2{animation-delay:.8s}.s3{animation-delay:1.6s}
@keyframes sp{0%,60%{opacity:0}61%,85%{opacity:1}86%,100%{opacity:0}}
`

const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap">
  <style>${css}</style>
</helmet>
<div style="position:relative;width:1920px;height:900px;overflow:hidden;background:#0f0f0e;color:#f4f4f4;font-family:${HEAD};display:grid;grid-template-columns:760px minmax(0,1fr);gap:80px;padding:80px 120px;box-sizing:border-box">
	<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px">
		${mascot('azul', 560, { anim: true })}
		${label('A · Azul Faradays · idle')}
	</div>
	<div style="display:flex;flex-direction:column;justify-content:center;gap:56px">
		<div style="display:flex;flex-direction:column;gap:20px">
			${label('Direções de cor')}
			<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:40px">
				${col(mascot('azul', 196), 'A · Azul Faradays')}
				${col(mascot('marfim', 196), 'B · Marfim')}
				${col(mascot('eletrico', 196), 'C · Elétrico')}
			</div>
		</div>
		<div style="display:flex;flex-direction:column;gap:20px">
			${label('Expressões')}
			<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:40px">
				${col(mascot('azul', 112), 'normal')}
				${col(mascot('azul', 112, { expr: 'piscar' }), 'piscando')}
				${col(mascot('azul', 112, { expr: 'feliz' }), 'feliz')}
			</div>
		</div>
		<div style="display:flex;flex-direction:column;gap:20px">
			${label('Escala · 28 · 56 · 112 px')}
			<div style="display:flex;align-items:flex-end;gap:40px">${mascot('azul', 28)}${mascot('azul', 56)}${mascot('azul', 112)}</div>
		</div>
	</div>
</div>
</x-dc>
</body>
</html>
`
fs.writeFileSync('Mascote.dc.html', html)
console.log('ok mascote', GRID.flat().filter(Boolean).length, 'pixels')

/* ---------------- standalone: mascote.html ------------------------------ */
const bodyInner = html.slice(html.indexOf('</helmet>') + '</helmet>'.length, html.indexOf('</x-dc>')).trim()
fs.writeFileSync('mascote.html', `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mascote Faradays</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
html,body{margin:0;height:100%;overflow:hidden;background:#0f0f0e}
.fit{position:absolute;left:0;top:0;width:1920px;height:900px;transform-origin:0 0}
${css}
html,body{background:#0f0f0e}
</style>
</head>
<body>
<div class="fit">${bodyInner}</div>
<script>
const fitEl = document.querySelector('.fit')
function fit() { const s = Math.min(innerWidth / 1920, innerHeight / 900); fitEl.style.transform = 'translate(' + (innerWidth - 1920 * s) / 2 + 'px,' + (innerHeight - 900 * s) / 2 + 'px) scale(' + s + ')' }
addEventListener('resize', fit); fit()
</script>
</body>
</html>
`)
console.log('ok mascote.html')
