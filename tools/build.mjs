// Gera Main.dc.html (o showcase animado) a partir de peças do app real:
// tokens do globals.css, ícones Phosphor (icons.json), fonte Aspekta (b64),
// SVG do SharePoint da LP. Rode: node build.mjs
import fs from 'node:fs'

const ICONS = JSON.parse(fs.readFileSync('icons.json', 'utf8'))
// Corte de 1 minuto (`node build.mjs --1min` → index-1min.html), desde 2026-09-30 no ritmo de um vídeo de
// apresentação SaaS: Problema (tipografia cinética) → Solução (abertura) → Demo → Recursos (RECORTES do roteiro
// de 3 min, FRAGS_1MIN, separados por legendas cinéticas) → CTA. A barra de progresso dentro do vídeo saiu em 2026-09-30.
// Fica de fora o que não existe no produto (resposta do fornecedor pelo WhatsApp, NF/boleto pelo bot).
const CURTO = process.argv.includes('--1min')
const ASPEKTA = fs.readFileSync('aspekta.b64', 'utf8').trim()
// GSAP (cópia de node_modules/gsap/dist, 3.15) embutido só no corte de 1 min, para o arquivo seguir abrindo offline
const GSAP = CURTO ? fs.readFileSync('gsap.min.js', 'utf8') : ''

/* ---------------- tokens (resolvidos do globals.css, tema claro) -------- */
const T_CLARO = {
	bg: '#fafafa',
	fg: '#0a0a0a',
	card: '#ffffff',
	primary: '#4d4d4d',
	primaryFg: '#fafafa',
	muted: '#ebebeb',
	mutedFg: '#8a8a8a',
	border: '#e5e5e5',
	border60: 'rgba(229,229,229,.6)',
	brand: '#0065e0',
	sidebar: '#f5f5f5',
	destructive: '#e7000b',
	green600: '#00a63e',
	green700: '#008236',
	green500: '#00c950',
	amber500: '#fe9a00',
	amber700: '#bb4d00',
	amber800: '#973c00',
	blue600: '#155dfc',
	blue700: '#1447e6'
}
// Corte de 1 min em tema ESCURO (2026-09-30, como a referência): neutros do shadcn dark e tons de status claros.
// O que não vem dos tokens (cores fixas no HTML/CSS) é trocado no fim por ESCURO_1MIN.
const T = CURTO
	? { ...T_CLARO, bg: '#0a0a0a', fg: '#fafafa', card: '#171717', primary: '#e5e5e5', primaryFg: '#171717', muted: '#262626', mutedFg: '#a1a1a1', border: '#2a2a2a', border60: 'rgba(255,255,255,.08)', brand: '#3b82f6', sidebar: '#121212', destructive: '#ff6467', green600: '#00c950', green700: '#05df72', green500: '#00c950', amber700: '#ffb86a', amber800: '#ffd230', blue600: '#51a2ff', blue700: '#8ec5ff' }
	: T_CLARO
// Fundo da prancha = ground da LP (`.light-home`: #f8f8f8, que com o film grain a .12 lê como #f4f4f4).
const STAGE = CURTO ? '#000000' : '#f8f8f8'
// Film grain da LP (grain-overlay.tsx): tile feTurbulence 0.25 saltando em steps(6).
const NOISE_URI = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.25' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`
const R = { sm: '4.32px', md: '5.76px', lg: '7.2px', xl: '10.08px', '2xl': '12.96px' }
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
const HEAD = "Geist, 'Helvetica Neue', Arial, system-ui, sans-serif"
const BODY = "Aspekta, 'Helvetica Neue', Arial, system-ui, sans-serif"

/* ---------------- helpers ---------------------------------------------- */
const ico = (name, size = 16, weight = 'regular', style = '', cls = '') => {
	const ds = ICONS[name]?.[weight] ?? ICONS[name]?.regular
	if (!ds) throw new Error('icon ' + name)
	return `<svg viewBox="0 0 256 256" width="${size}" height="${size}" fill="currentColor"${cls ? ` class="${cls}"` : ''} style="flex-shrink:0;${style}" aria-hidden="true">${ds.map((d) => `<path d="${d}"></path>`).join('')}</svg>`
}
const rgba = (hex, a) => `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${a})`
const sharepointSvg = (size) =>
	`<svg viewBox="0 0 48 48" width="${size}" height="${size}" style="flex-shrink:0" aria-hidden="true"><path fill="#26c6da" d="M20.858,28.467c7.006,0,12.686-5.671,12.686-12.667S27.863,3.133,20.858,3.133 S8.172,8.805,8.172,15.8S13.851,28.467,20.858,28.467z"></path><path fill="#00acc1" d="M32.328,36.911c5.783,0,10.471-4.681,10.471-10.456S38.111,16,32.328,16s-10.471,4.681-10.471,10.456 S26.545,36.911,32.328,36.911z"></path><path fill="#0097a7" d="M22.443,44.972c4.963,0,8.986-4.017,8.986-8.972s-4.023-8.972-8.986-8.972S13.457,31.045,13.457,36 S17.48,44.972,22.443,44.972z"></path><path fill="#00838f" d="M8.5,23h10c1.933,0,3.5,1.567,3.5,3.5v10c0,1.933-1.567,3.5-3.5,3.5h-10C6.567,40,5,38.433,5,36.5 v-10C5,24.567,6.567,23,8.5,23z"></path><path fill="#fff" d="M9.832,34.445l1.846-0.962c0.208,0.42,0.479,0.729,0.814,0.928c0.339,0.199,0.711,0.298,1.113,0.298 c0.448,0,0.79-0.09,1.024-0.271c0.235-0.185,0.353-0.463,0.353-0.833c0-0.289-0.113-0.533-0.339-0.732 c-0.226-0.203-0.626-0.357-1.201-0.461c-1.095-0.199-1.891-0.547-2.389-1.044c-0.493-0.497-0.74-1.116-0.74-1.856 c0-0.921,0.326-1.658,0.978-2.209c0.651-0.551,1.511-0.826,2.579-0.826c0.719,0,1.352,0.147,1.9,0.44 c0.547,0.293,0.982,0.714,1.303,1.261l-1.805,0.928c-0.199-0.307-0.414-0.529-0.644-0.664c-0.231-0.14-0.52-0.21-0.869-0.21 c-0.417,0-0.733,0.09-0.95,0.271c-0.213,0.181-0.319,0.416-0.319,0.705c0,0.248,0.102,0.468,0.305,0.657 c0.208,0.185,0.624,0.337,1.249,0.454c1.05,0.199,1.833,0.56,2.348,1.085c0.52,0.519,0.78,1.176,0.78,1.972 c0,0.966-0.31,1.732-0.93,2.297c-0.62,0.564-1.504,0.847-2.653,0.847c-0.832,0-1.584-0.181-2.253-0.542 c-0.665-0.366-1.165-0.876-1.499-1.532L9.832,34.445z"></path></svg>`
// Símbolo do infinito da Meta: o ARQUIVO OFICIAL, que o usuário mandou em 2026-09-17 (`meta-logo.png`
// ao lado deste build). Vai embutido em base64 como os outros assets — `meta.b64` é o PNG aparado no
// transparente e reduzido para 200px de largura (6× o tamanho em cena, nítido até em tela cheia 4K).
// Para regerar: convert meta-logo.png -trim +repage -resize 200x -strip - | base64 -w0 > meta.b64
// Antes daqui havia um traçado à mão do infinito; saiu quando o arquivo oficial chegou.
const META_B64 = fs.readFileSync('meta.b64', 'utf8').trim()
const META_AR = 334 / 502 // proporção da tinta depois de aparado
const metaSvg = (w) =>
	`<img src="data:image/png;base64,${META_B64}" width="${w}" height="${(w * META_AR).toFixed(1)}" alt="" style="flex-shrink:0;display:block">`
const waGreenSvg = (size) =>
	`<svg viewBox="0 0 720 720" width="${size}" height="${size}" style="flex-shrink:0" aria-hidden="true"><path fill="#25d366" d="M360,0C161.18,0,0,161.18,0,360c0,65.41,17.45,126.75,47.94,179.61L0,720l187.02-44.21c51.34,28.18,110.28,44.21,172.98,44.21,198.82,0,360-161.18,360-360S558.82,0,360,0ZM360,655.52c-60.17,0-116.13-17.98-162.82-48.87l-110.49,28.14,30.99-105.61c-33.53-47.93-53.2-106.26-53.2-169.19,0-163.21,132.31-295.52,295.52-295.52s295.52,132.31,295.52,295.52-132.31,295.52-295.52,295.52Z"></path><path fill="#25d366" d="M444.35,407.52l87.1,41.06c4,1.88,6.56,5.94,6.2,10.34-.94,11.46-5.54,34.43-26.13,55.02-58.12,58.12-162.49-7.64-166.74-10.18-25.67-13.79-50.06-32.24-73.19-55.36-23.12-23.12-41.58-47.52-55.37-73.19-2.55-4.24-68.31-108.61-10.18-166.74,20.59-20.59,43.56-25.19,55.02-26.13,4.41-.36,8.46,2.2,10.34,6.2l41.07,87.1c1.94,4.12,1.09,9.02-2.13,12.24l-30.61,30.61c-6.62,6.62-8.56,16.93-4,25.11,11.17,20.03,26.19,39.32,43.59,57.07,17.75,17.4,37.04,32.43,57.07,43.59,8.18,4.56,18.48,2.62,25.11-4l30.61-30.61c3.22-3.22,8.12-4.08,12.24-2.13Z"></path></svg>`

// Paleta fria de IA (mesma do .ai-shimmer no CSS).
const AI_STOPS = ['#1d6ae5', '#38bdf8', '#7c8cf8', '#38bdf8', '#1d6ae5']
// Wordmark Faradays — cópia do faradays-logo.tsx (currentColor).
// flagGrad: id de um gradiente de IA animado (SMIL) só na bandeira — os dois primeiros paths; as letras ficam na cor.
const wordmark = (width, color = T.fg, flagGrad = '') => {
	const h = (width * 124) / 715.5
	const ff = flagGrad ? ` fill="url(#${flagGrad})"` : ''
	const defs = flagGrad
		? `<defs><linearGradient id="${flagGrad}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="139" y2="0" spreadMethod="repeat">${AI_STOPS.map((c, k) => `<stop offset="${k / (AI_STOPS.length - 1)}" stop-color="${c}"></stop>`).join('')}<animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="139 0" dur="1.8s" repeatCount="indefinite"></animateTransform></linearGradient></defs>`
		: ''
	return `<svg viewBox="0 0 715.50 124.00" width="${width}" height="${h.toFixed(1)}" fill="${color}" aria-hidden="true">${defs}<path d="M138.995 34.5807V1.14441e-05L39.7128 0H0V6.17513L46.1661 6.17512C46.1661 6.17512 47.2762 6.16503 47.9036 6.42212C48.5374 6.68183 49.1446 7.41015 49.1446 7.41015L74.9579 33.0986C74.9579 33.0986 75.9317 34.0297 76.6954 34.3336C77.4154 34.6202 78.4328 34.5806 78.4328 34.5806L138.995 34.5807Z"${ff} transform="translate(6.000 12.098)"></path><path d="M0.00195312 24.5825V59.165H84.3448C84.3448 59.165 85.6114 59.3702 86.3305 59.6591C87.0898 59.964 87.8064 60.6471 87.8064 60.6471L112.404 85.3475C112.404 85.3475 112.996 86.0952 113.634 86.3355C114.178 86.5403 115.123 86.5825 115.123 86.5825H139.002V52.9899H77.8912C77.8912 52.9899 76.7812 53 76.1537 52.7429C75.5199 52.4832 74.9127 51.7549 74.9127 51.7549L49.0984 26.0665C49.0984 26.0665 48.1246 25.1354 47.3609 24.8314C46.6409 24.5448 45.6234 24.5844 45.6234 24.5844L0.00195312 24.5825Z"${ff} transform="translate(6.000 12.098)"></path><path d="M168.002 108.32H152.002V69.5L168.002 69.408V57.12H152.002V20H214.21V32.8H168.002V57.12H203.842V69.408H168.002V108.32Z" transform="translate(6.000 -8.320)"></path><path d="M22.016 90.912C15.1893 90.912 9.81334 89.2054 5.888 85.792C1.96267 82.2934 0 77.5147 0 71.456C0 65.312 2.09067 60.4907 6.272 56.992C10.5387 53.4934 16.6827 51.36 24.704 50.592L43.648 48.672V58.784L29.312 60.192C24.6187 60.6187 21.2053 61.5574 19.072 63.008C17.024 64.4587 16 66.592 16 69.408V70.432C16 73.1627 17.1093 75.296 19.328 76.832C21.5467 78.368 24.6613 79.136 28.672 79.136C38.656 79.136 43.648 74.9974 43.648 66.72V57.12V55.328V46.368C43.648 41.4187 42.5813 37.8347 40.448 35.616C38.4 33.312 35.1147 32.16 30.592 32.16C27.6053 32.16 25.1733 32.5867 23.296 33.44C21.4187 34.2934 20.0533 35.3174 19.2 36.512C18.3467 37.7067 17.92 38.8587 17.92 39.968V40.352H2.048C5.20534 26.784 14.848 20 30.976 20C40.192 20 47.1893 22.2187 51.968 26.656C56.7467 31.008 59.136 37.4507 59.136 45.984V89.632H44.928V78.496H42.752C41.0453 82.5067 38.4853 85.5787 35.072 87.712C31.744 89.8454 27.392 90.912 22.016 90.912Z" transform="translate(230.500 9.000)"></path><path d="M0 89.12V20.768H14.208V32.672H16.3841C18.1761 28.4907 20.608 25.3333 23.68 23.2C26.8373 21.0667 30.848 20 35.712 20H46.848V32.928H29.184C24.4906 32.928 21.0346 34.1653 18.816 36.64C16.5973 39.1147 15.488 43.1253 15.488 48.672V89.12H0Z" transform="translate(300.000 9.000)"></path><path d="M22.016 90.912C15.1893 90.912 9.81334 89.2054 5.888 85.792C1.96267 82.2934 0 77.5147 0 71.456C0 65.312 2.09067 60.4907 6.272 56.992C10.5387 53.4934 16.6827 51.36 24.704 50.592L43.648 48.672V58.784L29.312 60.192C24.6187 60.6187 21.2053 61.5574 19.072 63.008C17.024 64.4587 16 66.592 16 69.408V70.432C16 73.1627 17.1093 75.296 19.328 76.832C21.5467 78.368 24.6613 79.136 28.672 79.136C38.656 79.136 43.648 74.9974 43.648 66.72V57.12V55.328V46.368C43.648 41.4187 42.5813 37.8347 40.448 35.616C38.4 33.312 35.1147 32.16 30.592 32.16C27.6053 32.16 25.1733 32.5867 23.296 33.44C21.4187 34.2934 20.0533 35.3174 19.2 36.512C18.3467 37.7067 17.92 38.8587 17.92 39.968V40.352H2.048C5.20534 26.784 14.848 20 30.976 20C40.192 20 47.1893 22.2187 51.968 26.656C56.7467 31.008 59.136 37.4507 59.136 45.984V89.632H44.928V78.496H42.752C41.0453 82.5067 38.4853 85.5787 35.072 87.712C31.744 89.8454 27.392 90.912 22.016 90.912Z" transform="translate(357.000 9.000)"></path><path d="M27.136 93.696C21.6747 93.696 16.896 92.288 12.8 89.472C8.704 86.5707 5.54667 82.4747 3.328 77.184C1.10934 71.8933 0 65.5787 0 58.24C0 47.1467 2.432 38.4853 7.296 32.256C12.16 25.9413 18.7733 22.784 27.136 22.784C32.0853 22.784 36.2667 23.8507 39.68 25.984C43.0933 28.1173 45.6107 31.1893 47.232 35.2H49.536C49.3653 31.7867 49.2373 28.9707 49.152 26.752C49.0667 24.448 49.024 22.3147 49.024 20.352V0H64.64V92.416H50.432V80.256H48.256C46.3787 84.4373 43.648 87.7227 40.064 90.112C36.5653 92.5013 32.256 93.696 27.136 93.696ZM32.768 81.536C38.3147 81.536 42.4107 79.9573 45.056 76.8C47.7013 73.5573 49.024 68.5227 49.024 61.696V54.784C49.024 47.9573 47.7013 42.9653 45.056 39.808C42.4107 36.5653 38.3147 34.944 32.768 34.944C27.136 34.944 22.9973 36.5653 20.352 39.808C17.7067 42.9653 16.384 47.9573 16.384 54.784V61.696C16.384 68.5227 17.7067 73.5573 20.352 76.8C22.9973 79.9573 27.136 81.536 32.768 81.536Z" transform="translate(426.500 6.000)"></path><path d="M22.016 90.912C15.1893 90.912 9.81334 89.2054 5.888 85.792C1.96267 82.2934 0 77.5147 0 71.456C0 65.312 2.09067 60.4907 6.272 56.992C10.5387 53.4934 16.6827 51.36 24.704 50.592L43.648 48.672V58.784L29.312 60.192C24.6187 60.6187 21.2053 61.5574 19.072 63.008C17.024 64.4587 16 66.592 16 69.408V70.432C16 73.1627 17.1093 75.296 19.328 76.832C21.5467 78.368 24.6613 79.136 28.672 79.136C38.656 79.136 43.648 74.9974 43.648 66.72V57.12V55.328V46.368C43.648 41.4187 42.5813 37.8347 40.448 35.616C38.4 33.312 35.1147 32.16 30.592 32.16C27.6053 32.16 25.1733 32.5867 23.296 33.44C21.4187 34.2934 20.0533 35.3174 19.2 36.512C18.3467 37.7067 17.92 38.8587 17.92 39.968V40.352H2.048C5.20534 26.784 14.848 20 30.976 20C40.192 20 47.1893 22.2187 51.968 26.656C56.7467 31.008 59.136 37.4507 59.136 45.984V89.632H44.928V78.496H42.752C41.0453 82.5067 38.4853 85.5787 35.072 87.712C31.744 89.8454 27.392 90.912 22.016 90.912Z" transform="translate(501.500 9.000)"></path><path d="M16.512 90.3441L27.136 65.1281L27.648 70.1201L0 1H15.872L33.28 47.5921H35.584L53.12 1H68.352L32.384 90.3441H16.512Z" transform="translate(571.000 28.000)"></path><path d="M30.08 90.912C21.376 90.912 14.592 89.2907 9.728 86.048C4.864 82.8054 1.62133 77.6427 0 70.56H15.616V70.944C15.616 72.0534 16.0427 73.248 16.896 74.528C17.7494 75.7227 19.2 76.7894 21.248 77.728C23.3814 78.6667 26.3254 79.136 30.08 79.136C34.6027 79.136 38.1014 78.4534 40.5761 77.088C43.1361 75.6374 44.4161 73.504 44.4161 70.688C44.4161 68.64 43.6481 67.0614 42.112 65.952C40.6614 64.8427 38.144 63.904 34.56 63.136L19.84 60.192C13.0134 58.7414 8.02133 56.5654 4.864 53.664C1.70666 50.6774 0.128 46.624 0.128 41.504C0.128 34.592 2.688 29.3013 7.808 25.632C12.928 21.8773 20.224 20 29.696 20C38.3147 20 45.0134 21.6213 49.792 24.864C54.6561 28.1067 57.8987 33.2694 59.5201 40.352H43.776V39.968C43.776 38.8587 43.3494 37.7067 42.496 36.512C41.728 35.232 40.32 34.1227 38.272 33.184C36.224 32.2454 33.3654 31.776 29.696 31.776C25.2587 31.776 21.8027 32.5014 19.328 33.952C16.9387 35.3174 15.744 37.408 15.744 40.224C15.744 42.272 16.4694 43.8507 17.92 44.96C19.456 46.0694 21.9734 47.008 25.472 47.776L40.192 50.72C47.0187 52.0854 52.0107 54.2614 55.168 57.248C58.4107 60.1494 60.0321 64.2027 60.0321 69.408C60.0321 76.2347 57.4294 81.5254 52.224 85.28C47.104 89.0347 39.7227 90.912 30.08 90.912Z" transform="translate(649.500 9.000)"></path></svg>`
}

/* ---------------- átomos do app ----------------------------------------- */
const TONES = {
	neutral: [T.muted, T.mutedFg],
	primary: ['rgba(77,77,77,.1)', T.primary],
	success: ['rgba(0,166,62,.1)', T.green700],
	warning: ['rgba(254,154,0,.1)', T.amber700],
	error: ['rgba(231,0,11,.1)', T.destructive],
	info: ['rgba(21,93,252,.1)', T.blue700]
}
const badge = (tone, text, extra = '') => {
	const [bg, fg] = TONES[tone]
	return `<span style="display:inline-flex;align-items:center;gap:4px;border-radius:${R.md};background:${bg};color:${fg};padding:2px 8px;font-size:11.1px;line-height:1.5;letter-spacing:.03em;font-weight:500;white-space:nowrap;border:1px solid transparent;${extra}">${text}</span>`
}
const btn = (label, { variant = 'default', icon, size = 'default', extra = '' } = {}) => {
	const h = size === 'sm' ? 32 : size === 'xs' ? 24 : 36
	const fs = size === 'xs' ? 11.1 : 13.33
	const pad = size === 'xs' ? '0 8px' : '0 10px'
	const look =
		variant === 'outline'
			? `background:${T.bg};border:1px solid ${T.border};color:${T.fg};box-shadow:0 1px 2px rgba(0,0,0,.05)`
			: variant === 'ghost'
				? `background:transparent;border:1px solid transparent;color:${T.fg}`
				: `background:${T.primary};border:1px solid transparent;color:${T.primaryFg}`
	return `<span style="display:inline-flex;align-items:center;justify-content:center;gap:6px;height:${h}px;padding:${pad};border-radius:${R.md};font-family:${MONO};font-size:${fs}px;font-weight:500;letter-spacing:.025em;text-transform:uppercase;white-space:nowrap;${look};${extra}">${icon ? ico(icon, size === 'xs' ? 12 : 16) : ''}${label}</span>`
}
const pill = (label, active, count) =>
	`<span style="display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:9999px;font-family:${MONO};font-size:13.33px;font-weight:500;letter-spacing:.025em;text-transform:uppercase;white-space:nowrap;background:${active ? T.brand : T.muted};color:${active ? '#fff' : T.mutedFg}">${label}${count != null ? `<span style="opacity:${active ? '.6' : '.5'};font-variant-numeric:tabular-nums">${count}</span>` : ''}</span>`
// PillFilter com item ativo trocável por classe (hole no wrapper).
const pillSwap = (label, cls) =>
	`<span class="pl ${cls}" style="display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:9999px;font-family:${MONO};font-size:13.33px;font-weight:500;letter-spacing:.025em;text-transform:uppercase;white-space:nowrap">${label}</span>`
const search = (placeholder, width = 320) =>
	`<div style="display:flex;align-items:center;gap:8px;height:36px;max-width:${width}px;width:100%;padding:0 12px;border-radius:${R.md};background:${T.muted};color:${T.mutedFg}">${ico('MagnifyingGlass', 16, 'bold')}<span style="font-size:13.33px;letter-spacing:.025em;opacity:.7">${placeholder}</span></div>`
const checkbox = (checked, cls = '') =>
	`<span class="cb ${cls}" style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:4px;border:1px solid ${checked ? T.primary : T.border};background:${checked ? T.primary : 'transparent'};color:${T.primaryFg};box-shadow:0 1px 2px rgba(0,0,0,.05)">${checked ? ico('Check', 12, 'bold') : ''}</span>`
const th = (label, align = 'left', width) =>
	`<th style="padding:0 12px 12px;border-bottom:1px solid ${T.border};text-align:${align};vertical-align:bottom;font-family:${MONO};font-size:13.33px;font-weight:500;letter-spacing:.025em;text-transform:uppercase;color:${T.mutedFg};${width ? `width:${width}px;` : ''}">${label}</th>`
const td = (html, align = 'left', extra = '') =>
	`<td style="padding:14px 12px;border-bottom:1px solid ${T.border60};text-align:${align};vertical-align:middle;font-size:13.33px;letter-spacing:.025em;line-height:1.5;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;${extra}">${html}</td>`
const mono = (t, extra = '') => `<span style="font-family:${MONO};font-variant-numeric:tabular-nums;${extra}">${t}</span>`
const muted = (t, extra = '') => `<span style="color:${T.mutedFg};${extra}">${t}</span>`

/* ---------------- sidebar (colapsada: trilho de ícones de 64px) -------- */
// Só a bandeira do logo (os dois primeiros paths do wordmark) e um ícone por grupo; o grupo do
// capítulo acende (.nr.on). Colapsada desde 2026-09-11 para a demo respirar e a câmera fechar
// mais nos componentes (legibilidade no celular). CW = largura útil da área de conteúdo.
const SB_W = 64
const CW = 1600 - SB_W
const flagMark = (h) =>
	`<svg viewBox="6 12 139 87" width="${((h * 139) / 87).toFixed(1)}" height="${h}" fill="${T.fg}" aria-hidden="true"><path d="M138.995 34.5807V1.14441e-05L39.7128 0H0V6.17513L46.1661 6.17512C46.1661 6.17512 47.2762 6.16503 47.9036 6.42212C48.5374 6.68183 49.1446 7.41015 49.1446 7.41015L74.9579 33.0986C74.9579 33.0986 75.9317 34.0297 76.6954 34.3336C77.4154 34.6202 78.4328 34.5806 78.4328 34.5806L138.995 34.5807Z" transform="translate(6.000 12.098)"></path><path d="M0.00195312 24.5825V59.165H84.3448C84.3448 59.165 85.6114 59.3702 86.3305 59.6591C87.0898 59.964 87.8064 60.6471 87.8064 60.6471L112.404 85.3475C112.404 85.3475 112.996 86.0952 113.634 86.3355C114.178 86.5403 115.123 86.5825 115.123 86.5825H139.002V52.9899H77.8912C77.8912 52.9899 76.7812 53 76.1537 52.7429C75.5199 52.4832 74.9127 51.7549 74.9127 51.7549L49.0984 26.0665C49.0984 26.0665 48.1246 25.1354 47.3609 24.8314C46.6409 24.5448 45.6234 24.5844 45.6234 24.5844L0.00195312 24.5825Z" transform="translate(6.000 12.098)"></path></svg>`
const railItem = (icon, cls = '') =>
	`<li class="nr ${cls}" style="display:grid;place-items:center;width:40px;height:40px;border-radius:${R.md};color:${T.mutedFg}"><span class="ico-reg" style="display:flex;opacity:.8">${ico(icon, 20)}</span><span class="ico-fill" style="display:none">${ico(icon, 20, 'fill')}</span></li>`
const sidebar = `<aside style="width:${SB_W}px;flex-shrink:0;height:100%;background:${T.sidebar};border-right:1px solid ${T.border};display:flex;flex-direction:column;align-items:center;overflow:hidden">
	<div style="height:56px;width:100%;flex-shrink:0;display:grid;place-items:center;border-bottom:1px solid ${T.border60}">${flagMark(18)}</div>
	<ul style="list-style:none;margin:0;padding:12px 0;display:flex;flex-direction:column;gap:6px">
		${railItem('House', '{{c.navHome}}')}${railItem('WhatsappLogo', '{{c.navWa}}')}${railItem('Package', '{{c.navBid}}')}${railItem('TrendUp')}${railItem('ShieldCheck', '{{c.navDocs}}')}${railItem('Database')}${railItem('HardDrives')}
	</ul>
	<span style="margin-top:auto;margin-bottom:14px;display:grid;place-items:center;width:28px;height:28px;color:${T.mutedFg}">${ico('SidebarSimple', 16, 'fill')}</span>
</aside>`
// Diálogos centrados na área de conteúdo (à direita do trilho).
const dlgLeft = (w) => SB_W + (CW - w) / 2
const DLG_SHADOW = '0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)'
// Toggle Internacional | Local — o tipo da cotação, como no produto (nova-cotacao-dialog.tsx, 28/08).
const segmented = (label, opts, ativo) =>
	`<div style="display:flex;flex-direction:column;gap:4px"><span style="font-family:${MONO};font-size:11.1px;letter-spacing:.03em;text-transform:uppercase;color:${T.mutedFg}">${label}</span><span style="display:inline-flex;height:36px;padding:3px;border:1px solid ${T.border};border-radius:${R.md};background:${T.muted}">${opts.map((o, i) => `<span style="display:inline-flex;align-items:center;justify-content:center;flex:1;padding:0 14px;border-radius:6px;font-family:${MONO};font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;${i === ativo ? `background:${T.card};color:${T.fg};box-shadow:0 1px 2px rgba(0,0,0,.08)` : `color:${T.mutedFg}`}">${o}</span>`).join('')}</span></div>`
const field = (label, value) =>
	`<div style="display:flex;flex-direction:column;gap:4px"><span style="font-family:${MONO};font-size:11.1px;letter-spacing:.03em;text-transform:uppercase;color:${T.mutedFg}">${label}</span><span style="display:flex;align-items:center;height:36px;padding:0 12px;border:1px solid ${T.border};border-radius:${R.md};background:${T.bg};font-size:13.33px;letter-spacing:.025em">${value}</span></div>`

/* ---------------- header + breadcrumb ---------------------------------- */
const crumb = (root, leaf, cls) =>
	`<span class="vf ${cls}" style="position:absolute;inset:0;display:flex;align-items:center;gap:8px;font-family:${MONO};font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg};white-space:nowrap"><span>${root}</span><span style="opacity:.4">/</span><span style="color:${T.fg};font-weight:500">${leaf}</span></span>`
const header = `<header class="hdr {{c.hdr}}" style="height:56px;flex-shrink:0;display:flex;align-items:center;gap:16px;padding:0 24px;border-bottom:1px solid ${T.border60};background:rgba(250,250,250,.8)">
	<div style="position:relative;flex:1;height:100%">
		${crumb('Qualidade', 'Documentos', '{{c.crDocs}}')}
		${crumb('Compras', 'BID (Cotação de Compra)', '{{c.crBid}}')}
		${crumb('WhatsApp', 'Conversas', '{{c.crWa}}')}
		${crumb('Início', 'Visão Geral', '{{c.crHome}}')}
	</div>
	<div style="display:flex;align-items:center;gap:8px;padding:6px 8px 6px 6px;border-radius:${R.lg}">
		<span style="display:grid;place-items:center;width:24px;height:24px;border-radius:${R.md};background:${T.muted};color:${T.mutedFg};font-size:11.1px;font-weight:500">G</span>
		<span style="font-size:13.33px;font-weight:500;letter-spacing:.025em">Gestor</span>
		<span style="display:flex;color:${T.mutedFg}">${ico('CaretDown', 14, 'bold')}</span>
	</div>
</header>`

/* ---------------- página: Documentos ------------------------------------ */
// Nomes genéricos (PRODUTO n, MARCA x, EXPORTADOR n) desde 2026-09-11 — pedido do feedback externo.
const DOC_COLS = [230, 300, 150, 130, 140, 150]
const docRow = (tipo, produto, marca, mand, validade, status, opts = {}) => {
	const STS = { vigente: ['success', 'Vigente'], a_vencer: ['warning', 'A vencer'], vencido: ['error', 'Vencido'], na: ['neutral', 'N/A'] }
	const st = STS[status]
	const cls = opts.cls ? `class="row vf ${opts.cls}"` : ''
	const val = opts.lendo
		? `<span style="position:relative;display:inline-block;min-width:96px;height:20px"><span class="vf {{c.lendo}}" style="position:absolute;left:0;top:0;display:inline-flex;align-items:center;gap:6px">${ico('Sparkle', 14, 'fill', 'color:#4aa8ff', 'ai-spark')}<span class="ai-shimmer" style="font-family:${MONO};font-variant-numeric:tabular-nums">lendo…</span></span><span class="vf {{c.lido}}" style="position:absolute;left:0;top:0">${mono(validade)}<span class="aiburst"></span></span></span>`
		: opts.rx // resposta do exportador (2026-09-21): a validade e o status trocam quando o documento novo entra
			? `<span style="position:relative;display:inline-block;min-width:96px;height:20px"><span class="vf {{c.rxV0}}" style="position:absolute;left:0;top:0">${mono(validade)}</span><span class="vf {{c.rxV1}}" style="position:absolute;left:0;top:0">${mono(opts.rx[0])}<span class="aiburst"></span></span></span>`
			: mono(validade)
	const badgeHtml = opts.lendo
		? `<span style="position:relative;display:inline-block;min-width:80px;height:21px"><span class="vf {{c.lendo}}" style="position:absolute;left:0;top:0">${badge('warning', 'SEM DATA')}</span><span class="vf {{c.lido}}" style="position:absolute;left:0;top:0">${badge(st[0], st[1])}</span></span>`
		: opts.rx
			? `<span style="position:relative;display:inline-block;min-width:80px;height:21px"><span class="vf {{c.rxS0}}" style="position:absolute;left:0;top:0">${badge(st[0], st[1])}</span><span class="vf {{c.rxS1}}" style="position:absolute;left:0;top:0">${badge(STS[opts.rx[1]][0], STS[opts.rx[1]][1])}</span></span>`
			: badge(st[0], st[1])
	return `<tr ${cls}>
		${td(tipo)}${td(`<span style="font-weight:500">${produto}</span>`)}${td(marca)}${td(mand ? badge('success', 'Sim') : badge('neutral', 'Não'))}${td(val)}${td(badgeHtml)}${td(`<span style="display:inline-flex;align-items:center;gap:6px;color:${T.mutedFg}">${ico('FilePdf', 16)}${mono('PDF')}</span>`)}
	</tr>`
}
const docsTable = `<table style="width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;text-align:left">
	<thead><tr>${th('Tipo de documento', 'left', DOC_COLS[0])}${th('Produto / Fornecedor', 'left', DOC_COLS[1])}${th('Marca', 'left', DOC_COLS[2])}${th('Mandatório', 'left', DOC_COLS[3])}${th('Validade', 'left', DOC_COLS[4])}${th('Status', 'left', DOC_COLS[5])}${th('Arquivo')}</tr></thead>
	<tbody>
		${docRow('ISO 9001', 'PRODUTO 4', 'MARCA C', true, '02/11/2027', 'vigente')}
		${docRow('Halal', 'PRODUTO 2', 'MARCA A', true, '15/09/2026', 'a_vencer', { cls: '{{c.w1}}', rx: ['15/09/2027', 'vigente'] })}
		${docRow('Kosher', 'PRODUTO 1', 'MARCA A', true, '30/06/2026', 'vencido', { cls: '{{c.w2}}' })}
		${docRow('FDA', 'EXPORTADOR 3', '—', true, '20/01/2027', 'vigente')}
		${docRow('MSDS', 'PRODUTO 5', 'MARCA B', false, '—', 'na')}
		${docRow('Free-sale', 'PRODUTO 3', 'MARCA B', true, '08/05/2027', 'vigente')}
		${docRow('GMP', 'EXPORTADOR 1', '—', true, '14/02/2028', 'vigente')}
		${docRow('ISO 9001', 'PRODUTO 1', 'MARCA A', true, '02/11/2027', 'vigente', { cls: '{{c.r1}}', lendo: true })}
		${docRow('Licença de fabricação', 'EXPORTADOR 2', '—', true, '15/03/2028', 'vigente', { cls: '{{c.r2}}', lendo: true })}
		${docRow('COA', 'PRODUTO 3', 'MARCA B', true, '05/08/2027', 'vigente', { cls: '{{c.r3}}', lendo: true })}
	</tbody>
</table>`

const docsPage = `<div class="vf {{c.pgDocs}}" style="position:absolute;inset:0;display:flex;flex-direction:column;gap:32px;padding:24px">
	<div style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap">
		${btn('Tipos de Documento', { variant: 'outline', icon: 'Files' })}${btn('Classificar e organizar', { variant: 'outline', icon: 'Sparkle' })}${btn('Procurar no drive', { variant: 'outline', icon: 'FolderOpen' })}${btn('Configurar drive', { variant: 'outline', icon: 'Gear' })}${btn('Cobrança', { variant: 'outline', icon: 'Envelope' })}${btn('Novo Documento', { icon: 'Plus' })}
	</div>
	<div style="display:flex;flex-direction:column;gap:16px;flex:1;min-height:0">
		<div style="display:flex;align-items:center;gap:8px">${pill('Documentos', true)}${pill('Pendências', false, 2)}${pill('Por exportador', false)}${pill('Pastas', false)}</div>
		<div style="display:flex;align-items:center;gap:12px">${search('Buscar por produto, tipo ou marca…')}${btn('Status: todos', { variant: 'outline', icon: 'Funnel' })}</div>
		${docsTable}
	</div>
</div>`

// Cobrança AUTOMÁTICA (cap. 2, refeita em 2026-09-18): ninguém clica. Lida a validade, a FS1 vê os
// documentos vencidos e a vencer e dispara a cobrança sozinha — 1 e-mail por fornecedor.
const COB_W = 760
const cobChip = (icon, t) => `<span style="display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:9999px;border:1px solid ${T.border};background:${T.bg};white-space:nowrap">${ico(icon, 12)}${t}</span>`
const cobRow = (tipo, prod, forn, venc, st, last = false) =>
	`<div style="display:flex;align-items:center;gap:14px;height:58px;padding:0 14px;${last ? '' : `border-bottom:1px solid ${T.border60};`}font-size:13.33px;letter-spacing:.025em">
		${ico('FilePdf', 22, 'fill', 'color:#d93025')}
		<span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><span style="font-weight:500">${tipo} · ${prod}</span><span style="font-size:11.1px;color:${T.mutedFg}">${forn} · ${venc}</span></span>
		${badge(st[0], st[1])}
		<span style="position:relative;width:150px;height:22px;flex-shrink:0"><span class="vf {{c.cobA}}" style="position:absolute;right:0;top:0;height:22px;display:inline-flex;align-items:center;gap:6px;color:${T.amber700};font-size:12px">${ico('CircleNotch', 14, 'bold', '', 'spin')}disparando…</span><span class="vf {{c.cobB}}" style="position:absolute;right:0;top:0;height:22px;display:inline-flex;align-items:center;gap:6px;color:${T.green700};font-size:12px;font-weight:500">${ico('Check', 14, 'bold')}e-mail enviado</span></span>
	</div>`
const cobrancaDialog = `<div class="vf {{c.cobOverlay}}" style="position:absolute;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px)"></div>
<div class="vp {{c.cob}}" style="position:absolute;left:${dlgLeft(COB_W)}px;top:290px;width:${COB_W}px;border:1px solid ${T.border};background:${T.card};border-radius:${R.xl};box-shadow:${DLG_SHADOW};padding:24px;display:flex;flex-direction:column;gap:16px">
	<div style="display:flex;flex-direction:column;gap:6px">
		<div style="display:flex;align-items:center;gap:10px;font-size:19.2px;font-weight:600;letter-spacing:.015em">${ico('PaperPlaneRight', 22, 'fill')}Cobrança automática <span class="ai-badge" style="display:inline-flex;align-items:center;gap:4px;border-radius:${R.md};padding:2px 8px;font-size:11.1px;line-height:1.5;letter-spacing:.03em;font-weight:500;white-space:nowrap">${ico('Sparkle', 11, 'fill', 'color:#4aa8ff')}<span class="ai-shimmer">FS1</span></span></div>
		<span style="font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}">Ficha técnica, certificados, COA: o que venceu ou falta é cobrado sozinho, no prazo que você programar — e só do fornecedor cadastrado como dono da documentação de cada produto.</span>
		<div style="display:flex;align-items:center;gap:8px;margin-top:4px;font-size:11.5px;color:${T.mutedFg};white-space:nowrap"><span style="font-family:${MONO};font-size:10.5px;letter-spacing:.1em;text-transform:uppercase">sua programação</span>${cobChip('Clock', 'todo dia às 08:00')}${cobChip('ArrowsClockwise', 'follow-up a cada 2 dias')}${cobChip('ShieldCheck', 'para depois de 3 sem resposta')}</div>
	</div>
	<div style="border:1px solid ${T.border};border-radius:${R.md};overflow:hidden">
		${cobRow('Halal', 'PRODUTO 2', 'EXPORTADOR 1', 'vence em 15/09/2026', ['warning', 'A vencer'])}
		${cobRow('Kosher', 'PRODUTO 1', 'EXPORTADOR 3', 'venceu em 30/06/2026', ['error', 'Vencido'], true)}
	</div>
	<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:${T.mutedFg}">${ico('Sparkle', 14, 'fill', 'color:#4aa8ff', 'ai-spark')}A resposta do fornecedor entra sozinha no drive, já com o nome padrão.</div>
	<div style="display:flex;align-items:center;justify-content:flex-end;height:22px;font-size:13.33px;letter-spacing:.025em"><span style="position:relative;width:460px;height:22px"><span class="vf {{c.cobF0}}" style="position:absolute;right:0;top:0;height:22px;display:inline-flex;align-items:center;gap:6px;color:${T.amber700}">${ico('CircleNotch', 14, 'bold', '', 'spin')}disparando a cobrança aos fornecedores…</span><span class="vf {{c.cobF1}}" style="position:absolute;right:0;top:0;height:22px;display:inline-flex;align-items:center;gap:6px;color:${T.green700};font-weight:500">${ico('Check', 14, 'bold')}2 e-mails enviados · automático, no prazo programado<span class="aiburst"></span></span></span></div>
</div>`

// Resposta do exportador (2026-09-21 — pedido: "fluxo de receber o doc do exportador e salvar na pasta do OneDrive de
// forma automática"). No produto é a esteira de e-mail (emails.py → classificacao_ia.py → publicacao.py): o anexo da
// resposta à cobrança é lido e classificado, PUBLICADO no drive na pasta …/PRODUTO/MARCA com o nome padrão, a pendência
// baixa sozinha e o exportador recebe o retorno na mesma thread. COMPLEMENTA a sincronização do drive (que lê o que já
// está nas pastas): mesma IA, mesmo nome padrão. Três passos, cada um com pendente → rodando → feito.
const rxStep = (k, icon, pend, a, b) =>
	`<div style="display:flex;align-items:flex-start;gap:12px;padding:11px 14px;${k ? `border-top:1px solid ${T.border60};` : ''}font-size:13.33px;letter-spacing:.025em;min-height:60px">
		<span style="position:relative;display:inline-block;width:20px;height:20px;flex-shrink:0;margin-top:1px"><span class="vf {{c.rx${k}p}}" style="position:absolute;inset:0;display:grid;place-items:center;color:${T.mutedFg}"><span style="width:8px;height:8px;border-radius:9999px;border:1.5px solid currentColor"></span></span><span class="vf {{c.rx${k}a}}" style="position:absolute;inset:0;display:grid;place-items:center;color:${T.amber700}">${ico('CircleNotch', 16, 'bold', '', 'spin')}</span><span class="vf {{c.rx${k}b}}" style="position:absolute;inset:0;display:grid;place-items:center;color:${T.green700}">${ico(icon, 18, 'fill')}</span></span>
		<span style="position:relative;flex:1;min-width:0;display:block;min-height:38px"><span class="vf {{c.rx${k}p}}" style="position:absolute;left:0;top:0;color:${T.mutedFg};white-space:nowrap">${pend}</span><span class="vf {{c.rx${k}a}}" style="position:absolute;left:0;top:0;display:inline-flex;align-items:center;gap:6px;white-space:nowrap">${ico('Sparkle', 13, 'fill', 'color:#4aa8ff', 'ai-spark')}<span class="ai-shimmer">${a}</span></span><span class="vf {{c.rx${k}b}}" style="position:absolute;left:0;top:0;display:flex;flex-direction:column;gap:3px;white-space:nowrap">${b}</span></span>
	</div>`
const recebidoDialog = `<div class="vp {{c.rx}}" style="position:absolute;left:${dlgLeft(COB_W)}px;top:236px;width:${COB_W}px;border:1px solid ${T.border};background:${T.card};border-radius:${R.xl};box-shadow:${DLG_SHADOW};padding:24px;display:flex;flex-direction:column;gap:16px">
	<div style="display:flex;flex-direction:column;gap:6px">
		<div style="display:flex;align-items:center;gap:10px;font-size:19.2px;font-weight:600;letter-spacing:.015em">${ico('EnvelopeOpen', 22, 'fill')}Documento recebido <span class="ai-badge" style="display:inline-flex;align-items:center;gap:4px;border-radius:${R.md};padding:2px 8px;font-size:11.1px;line-height:1.5;letter-spacing:.03em;font-weight:500;white-space:nowrap">${ico('Sparkle', 11, 'fill', 'color:#4aa8ff')}<span class="ai-shimmer">FS1</span></span><span style="margin-left:auto;font-family:${MONO};font-size:11.1px;font-weight:400;color:${T.mutedFg};white-space:nowrap">resposta do EXPORTADOR 1 · 2 dias depois</span></div>
		<span style="font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}">O exportador respondeu ao e-mail da cobrança com o certificado em anexo. Ninguém baixou, renomeou nem arquivou nada.</span>
	</div>
	<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid ${T.border};border-radius:${R.md};background:${T.bg}">${ico('FilePdf', 24, 'fill', 'color:#d93025')}<span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><span style="font-size:13.33px;font-weight:500">Halal_cert_2027_final.pdf</span><span style="font-size:11.1px;color:${T.mutedFg};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">anexo · Re: EXPORTADOR 1 + FARADAYS │ SOLICITAÇÃO DE RENOVAÇÃO DE DOCUMENTOS - PRODUTO 2 - MARCA A</span></span>${badge('neutral', 'PDF · 1,1 MB')}</div>
	<div style="border:1px solid ${T.border};border-radius:${R.md};overflow:hidden">
		${rxStep(0, 'Check', 'ler o anexo', 'lendo o anexo…', `<span style="font-weight:500">Halal · PRODUTO 2 · MARCA A</span><span style="font-size:11.1px;color:${T.mutedFg}">emitido em 16/09/2026 · válido até 15/09/2027</span>`)}
		${rxStep(1, 'FolderOpen', 'salvar na pasta do produto, no drive', 'salvando no drive…', `<span style="font-weight:500">salvo em Qualidade › Documentos › PRODUTO 2 › MARCA A</span><span style="font-family:${MONO};font-size:11.1px;color:${T.mutedFg}">Halal — PRODUTO 2 — MARCA A — VAL 15.09.2027.pdf</span>`)}
		${rxStep(2, 'CheckCircle', 'baixar a pendência e responder ao exportador', 'baixando a pendência…', `<span style="font-weight:500">Pendência baixada · retorno enviado na mesma conversa</span><span style="font-size:11.1px;color:${T.mutedFg}">“Halal RECEBIDO, válido até 15/09/2027 — não há mais pendências para o PRODUTO 2.”</span>`)}
	</div>
	<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:${T.mutedFg}">${ico('Sparkle', 14, 'fill', 'color:#4aa8ff', 'ai-spark')}O que chega por e-mail e o que já está nas pastas do drive passam pela mesma IA: ela lê, nomeia e organiza.</div>
</div>`

// Ida e volta da cobrança (2026-09-21, a pedido: "adicionar uma animação de enviar a cobrança e receber o
// documento", para deixar claro o recebimento automático). Duas pílulas voam sobre o véu, na mesma moldura
// do diálogo: o e-mail SAI para o exportador e, dois dias depois, o anexo VOLTA e vira o "Documento recebido".
const docPill = (hole, st, icon, cor, texto) =>
	`<span class="mfly ${hole}" style="position:absolute;left:0;top:0;transform:${st};display:inline-flex;align-items:center;gap:9px;padding:9px 15px;border-radius:9999px;background:${T.card};box-shadow:0 18px 40px -12px rgba(0,0,0,.45),0 0 0 1px rgba(0,0,0,.06);white-space:nowrap;font-size:12.5px;font-weight:500">${ico(icon, 17, 'fill', `color:${cor}`)}${texto}</span>`
const docFlies = `${docPill('{{c.docOut}}', '{{st.docOut}}', 'Envelope', T.brand, 'cobrança · EXPORTADOR 1')}
${docPill('{{c.docBack}}', '{{st.docBack}}', 'FilePdf', '#d93025', 'resposta · 2 dias depois')}`

// Marca da Microsoft (os quatro quadrados) — usada na linha de parceiros da abertura.
const msLogo = (s) =>
	`<svg viewBox="0 0 21 21" width="${s}" height="${s}" style="flex-shrink:0" aria-hidden="true"><rect x="1" y="1" width="9" height="9" fill="#f25022"></rect><rect x="11" y="1" width="9" height="9" fill="#7fba00"></rect><rect x="1" y="11" width="9" height="9" fill="#00a4ef"></rect><rect x="11" y="11" width="9" height="9" fill="#ffb900"></rect></svg>`

/* ---------------- página: BID ------------------------------------------- */
// A lista NÃO tem a CC-2026-012: ela nasce no diálogo "Nova cotação" durante a demo.
// tag = selo extra ao lado do status — "Local" na cotação nacional (só a exceção leva selo, como no produto)
const bidRow = (data, num, status, produtos, mais, resp, cls = '', tag = '') =>
	`<tr ${cls ? `class="${cls}"` : ''}>
		${td(mono(data))}${td(`<span style="display:inline-flex;align-items:center;gap:8px">${mono(num, 'font-weight:500')}${badge(status[0], status[1])}${tag}</span>`)}${td(`${produtos}${mais ? muted(` +${mais}`, 'margin-left:6px') : ''}`)}${td(mono(resp))}
	</tr>`
const bidPage = `<div class="vf {{c.pgBid}}" style="position:absolute;inset:0;display:flex;flex-direction:column;gap:32px;padding:24px">
	<div style="display:flex;justify-content:flex-end;gap:8px">
		${btn('Exportar Excel', { variant: 'outline', icon: 'Download' })}${btn('Caixa de e-mail', { variant: 'outline', icon: 'Envelope' })}${btn('Automação', { variant: 'outline', icon: 'Gear' })}${btn('Premissas', { variant: 'outline', icon: 'ListChecks' })}<span class="hb {{c.btnNova}}" style="display:inline-flex">${btn('Nova cotação', { icon: 'Plus' })}</span>
	</div>
	<div style="display:flex;flex-direction:column;gap:16px">
		<div style="display:flex;align-items:center;gap:12px">${search('Buscar por nº ou produto…')}${pill('Todos', true, 6)}${pill('Internacional', false, 5)}${pill('Local', false, 1)}<span style="width:1px;height:20px;background:${T.border}"></span>${pill('Abertas', false)}${pill('Fechadas', false)}</div>
		<table style="width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;text-align:left">
			<thead><tr>${th('Data', 'left', 150)}${th('Nº', 'left', 350)}${th('Produtos cotados')}${th('Respostas', 'left', 220)}</tr></thead>
			<tbody>
				${bidRow('21/08/2026', 'CC-2026-011', ['warning', 'respondida'], 'PRODUTO 2', 1, '3 de 5 envios')}
				${bidRow('14/08/2026', 'CC-2026-010', ['success', 'fechada'], 'PRODUTO 3', 0, '4 de 4 envios')}
				${bidRow('05/08/2026', 'CL-2026-003', ['success', 'fechada'], 'PRODUTO 4', 3, '5 de 6 envios', '', badge('info', 'Local'))}
				${bidRow('29/07/2026', 'CC-2026-008', ['success', 'fechada'], 'PRODUTO 5', 1, '3 de 3 envios')}
				${bidRow('22/07/2026', 'CC-2026-007', ['neutral', 'cancelada'], 'PRODUTO 6', 0, '2 de 4 envios')}
			</tbody>
		</table>
	</div>
</div>`

// Diálogo "Nova cotação" (720×520, centrado no conteúdo): a cesta de itens entra um a um; "Criar e abrir".
const NOVA_W = 720, NOVA_H = 500
const itemRow = (prod, marca, qtd, cls) =>
	`<div class="vp ${cls}" style="display:flex;align-items:center;gap:14px;height:52px;padding:0 14px;border-bottom:1px solid ${T.border60};font-size:13.33px;letter-spacing:.025em">
		${ico('Flask', 18, 'fill', `color:${T.primary}`)}<span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><span style="font-weight:500">${prod}</span><span style="font-size:11.1px;color:${T.mutedFg}">${marca}</span></span>${mono(qtd, 'font-weight:500')}<span style="display:inline-flex;color:${T.mutedFg}">${ico('X', 14)}</span>
	</div>`
const novaDialog = `<div class="vf {{c.novaOverlay}}" style="position:absolute;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px)"></div>
<div class="vp {{c.nova}}" style="position:absolute;left:${dlgLeft(NOVA_W)}px;top:${(900 - NOVA_H) / 2}px;width:${NOVA_W}px;height:${NOVA_H}px;border:1px solid ${T.border};background:${T.card};border-radius:${R.xl};box-shadow:${DLG_SHADOW};padding:24px;display:flex;flex-direction:column;gap:16px">
	<div style="display:flex;flex-direction:column;gap:6px">
		<div style="display:flex;align-items:center;gap:10px;font-size:19.2px;font-weight:600;letter-spacing:.015em">Nova cotação de compra ${badge('info', 'CC-2026-012')}</div>
	</div>
	<div style="display:grid;grid-template-columns:1.35fr 1fr;gap:8px">${segmented('Tipo da cotação', ['Internacional', 'Local'], 0)}${field('Retorno até', '12/09/2026')}</div>
	<span style="margin-top:-6px;font-size:11.1px;line-height:1.4;color:${T.mutedFg}">Importação: FOB/CFR em dólar, frete e origem. <b style="font-weight:500;color:${T.fg}">Local</b> pede preço cheio com ICMS, PIS/COFINS e IPI e compara pelo NET. Não muda depois de criada.</span>
	<div style="display:flex;align-items:center;gap:8px">${search('Adicionar produto…', 9999).replace('max-width:9999px;width:100%', 'flex:1')}${btn('Adicionar', { variant: 'outline', icon: 'Plus', size: 'sm' })}</div>
	<div style="border:1px solid ${T.border};border-radius:${R.md};overflow:hidden;flex:1;min-height:0">
		${itemRow('PRODUTO 1', 'MARCA A', '15.000 KG', '{{c.it1}}')}
		${itemRow('PRODUTO 2', 'MARCA B', '5.000 KG', '{{c.it2}}')}
		${itemRow('PRODUTO 3', 'qualquer marca', '3.000 KG', '{{c.it3}}')}
	</div>
	<div style="display:flex;align-items:center;gap:8px"><span style="font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}">3 itens · 4 exportadores do seu cadastro cotam estes produtos</span><span style="margin-left:auto;display:flex;gap:8px">${btn('Cancelar', { variant: 'outline' })}<span class="hb {{c.btnCriar}}" style="display:inline-flex">${btn('Criar e abrir', { icon: 'ArrowRight' })}</span></span></div>
</div>`

// Modal de detalhe (1152×810 centrado na área de conteúdo)
const MODAL_W = 1152, MODAL_L = dlgLeft(MODAL_W)
// Linha do exportador: nome + e-mail e WhatsApp completos (mocados). Começa desmarcada; quem marca é a
// FS1 (2026-09-18), as três de uma vez, com a linha acendendo no gradiente de IA antes de assentar
// (c.exr{k} = 'scan sel', c.xOff{k}/c.xOn{k} trocam a caixa; o EXPORTADOR 4 recebe 'skip' e apaga).
const expRow = (nome, email, fone, recorte, k, last = false) =>
	`<label class="exr {{c.exr${k}}}" style="display:flex;align-items:center;gap:12px;height:52px;padding:0 12px;font-size:13.33px;letter-spacing:.025em;border-bottom:${last ? 'none' : `1px solid ${T.border60}`}"><span style="position:relative;display:inline-block;width:16px;height:16px"><span class="vf {{c.xOff${k}}}" style="position:absolute;inset:0">${checkbox(false)}</span><span class="vf {{c.xOn${k}}}" style="position:absolute;inset:0">${checkbox(true)}</span></span><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px"><span style="font-weight:500">${nome}</span><span style="display:flex;align-items:center;gap:14px;font-size:11.1px;color:${T.mutedFg};white-space:nowrap"><span style="display:inline-flex;align-items:center;gap:5px">${ico('Envelope', 12)}${email}</span><span style="display:inline-flex;align-items:center;gap:5px">${ico('WhatsappLogo', 12)}${fone}</span></span></span>${recorte}</label>`
// Aba Disparar BID (2026-09-11, o mais simples possível): só a lista dos 4 exportadores mapeados,
// a frase dos canais e os botões. O modal fica baixo e centrado na tela (.dmodal.short) nesta aba
// e volta a 810px no corte para o comparativo. Ninguém clica nas linhas: a FS1 varre o mapeamento e marca
// 3 dos 4 sozinha (o EXPORTADOR 4, que só atende 1 de 3 itens, fica de fora e apaga).
const SELR = 'position:absolute;right:0;top:0;display:inline-flex;align-items:center;gap:6px;white-space:nowrap'
const dispatchBody = `<div class="mc {{c.disp}}" style="position:absolute;inset:0;display:flex;flex-direction:column;gap:12px">
	<div style="display:flex;align-items:center;justify-content:space-between;gap:16px">
		<span style="font-size:13.33px;letter-spacing:.025em;font-weight:500">Destinatários</span>
		<span style="position:relative;display:block;height:20px;min-width:340px;font-size:13.33px;letter-spacing:.025em;line-height:20px">
			<span class="vf {{c.selA}}" style="${SELR};color:${T.mutedFg}">4 exportadores do seu cadastro para estes produtos</span>
			<span class="vf {{c.selB}}" style="${SELR}">${ico('Sparkle', 14, 'fill', 'color:#4aa8ff', 'ai-spark')}<span class="ai-shimmer">FS1 cruzando o cadastro produto × exportador…</span></span>
			<span class="vf {{c.selC}}" style="${SELR}">${ico('Sparkle', 14, 'fill', 'color:#4aa8ff', 'ai-spark')}<span class="ai-shimmer">3 de 4 selecionados · só quem fornece estes itens</span></span>
		</span>
	</div>
	<div style="border:1px solid ${T.border};border-radius:${R.md};display:flex;flex-direction:column;overflow:hidden">
		${expRow('EXPORTADOR 1', 'sales@exportador1.com', '+86 532 8899 0101', badge('neutral', 'todos os itens'), 0)}
		${expRow('EXPORTADOR 2', 'export@exportador2.com', '+86 21 6470 2202', badge('neutral', '2 de 3 itens'), 1)}
		${expRow('EXPORTADOR 3', 'bid@exportador3.com', '+86 755 8301 3303', badge('neutral', 'todos os itens'), 2)}
		${expRow('EXPORTADOR 4', 'trade@exportador4.com', '+91 22 4005 4404', badge('neutral', '1 de 3 itens'), 3, true)}
	</div>
	<div style="display:flex;align-items:center;gap:6px;font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}">Vai só a quem está no seu cadastro para estes produtos — por ${ico('Envelope', 14)} e-mail e ${ico('WhatsappLogo', 14)} WhatsApp. Ninguém de fora recebe.</div>
	<div style="margin-top:auto;display:flex;justify-content:flex-end;gap:8px;padding-top:4px">${btn('Cancelar', { variant: 'outline' })}${btn('Disparar BID', { icon: 'PaperPlaneRight' })}</div>
</div>`

const cth = (label, align = 'center') =>
	`<th style="padding:8px;text-align:${align};font-size:11.1px;letter-spacing:.03em;text-transform:uppercase;font-weight:600;color:${T.mutedFg}">${label}</th>`
const ctd = (html, align = 'center', extra = '') => `<td style="padding:8px;text-align:${align};white-space:nowrap;font-size:13.33px;letter-spacing:.025em;line-height:1.5;${extra}">${html}</td>`
const preco = (v, un, inc) =>
	`<span style="display:inline-flex;flex-direction:column;align-items:center;gap:2px">${mono(`${v}<span style="color:${T.mutedFg}">/${un}</span>`)}<span style="font-size:10px;font-weight:500;letter-spacing:.05em;color:${T.mutedFg}">${inc}</span></span>`
// Assinatura visual da IA: pill com borda e texto no gradiente (mesma família do shimmer).
const aiBadge = (text) =>
	`<span class="ai-badge" style="display:inline-flex;align-items:center;gap:4px;border-radius:${R.md};padding:2px 8px;font-size:11.1px;line-height:1.5;letter-spacing:.03em;font-weight:500;white-space:nowrap">${ico('Sparkle', 11, 'fill', 'color:#4aa8ff')}<span class="ai-shimmer">${text}</span></span>`
// Selo da sugestão da IA no comparativo (2026-09-18): cada produto tem DOIS — a melhor CIF em AZUL
// (ponto e texto no gradiente de IA) e a melhor FOB em VERDE. Os quatro entram UM A UM (sug1..sug4),
// cada um no fim da piscada da sua linha, já com a câmera recuada.
const sugTag = (inco, hole) => {
	const fob = inco === 'FOB'
	return `<span class="vf ${hole}" style="display:inline-flex;align-items:center;gap:8px;font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase"><span class="pulse${fob ? ' pg' : ''}"></span>${fob ? `<span style="color:${T.green700}">melhor FOB · IA</span>` : '<span class="ai-shimmer">melhor CIF · IA</span>'}</span>`
}
const cmpRow = (nome, extra, cotado, prazo, custo, base, origem, hole = '', cb = false) =>
	`<tr class="crow ${hole}" style="border-bottom:1px solid ${T.border60};border-left:2px solid transparent">
		${ctd(`<span style="display:inline-flex;flex-direction:column;align-items:flex-start;gap:4px"><span style="font-weight:500">${nome}</span>${extra || ''}</span>`, 'left')}
		${ctd(cotado)}${ctd(mono(prazo))}${ctd(mono(custo, `color:${T.mutedFg}`))}${ctd(`<span class="cmpv">${mono(`${base}<span style="color:${T.mutedFg}">/KG</span>`, 'font-weight:500')}</span>`)}${ctd(origem[1].includes('IA') ? aiBadge(origem[1]) : badge(origem[0], origem[1]))}
		${ctd(cb ? `<span style="position:relative;display:inline-block;width:16px;height:16px"><span class="vf {{c.cb2Off}}" style="position:absolute;inset:0">${checkbox(false)}</span><span class="vf {{c.cb2On}}" style="position:absolute;inset:0">${checkbox(true)}</span></span>` : checkbox(false))}
		${ctd(`<span style="display:inline-flex;color:${T.mutedFg}">${ico('DotsThreeVertical', 16, 'bold')}</span>`)}
	</tr>`
const cmpBox = (titulo, marca, qtd, rows) =>
	`<div style="border:1px solid ${T.border};border-radius:${R.lg};overflow:hidden;background:${T.card}">
	<div style="display:flex;align-items:center;gap:12px;padding:8px 12px;border-bottom:1px solid ${T.border60};background:rgba(235,235,235,.3);font-size:13.33px;letter-spacing:.025em"><span style="font-weight:500">${titulo}${marca ? ` - ${marca}` : ''}</span><span style="margin-left:auto;font-family:${MONO};font-size:11.1px;color:${T.mutedFg}">${qtd}</span></div>
	<table style="width:100%;border-collapse:collapse;table-layout:fixed"><colgroup><col style="width:240px"><col style="width:150px"><col style="width:150px"><col style="width:120px"><col style="width:150px"><col style="width:160px"><col style="width:90px"><col></colgroup>
	<thead><tr style="border-bottom:1px solid ${T.border}">${cth('Exportador', 'left')}${cth('Preço cotado')}${cth('Prazo pagto')}${cth('Custo fin.')}${cth('Comparável')}${cth('Origem')}${cth('Vencedora')}<th></th></tr></thead>
	<tbody>${rows.join('')}</tbody></table></div>`
// Célula com dois estados empilhados (grid-area 1/1): "lendo" → "lido". hl/hd = holes de cada estado.
const stack = (a, b, hl, hd, burst = false) => `<span style="display:inline-grid;justify-items:center;align-items:center"><span class="vf ${hl}" style="grid-area:1/1">${a}</span><span class="vf ${hd}" style="grid-area:1/1;position:relative">${b}${burst ? '<span class="aiburst"></span>' : ''}</span></span>`
const lendoTag = (canal) => `<span style="display:inline-flex;align-items:center;gap:6px">${ico('Sparkle', 14, 'fill', 'color:#4aa8ff', 'ai-spark')}<span class="ai-shimmer" style="font-family:${MONO};font-variant-numeric:tabular-nums">lendo ${canal}…</span></span>`
// Linha "viva" do comparativo: chega "lendo <canal>…" e depois preenche. h = { row, lendo, lido, origem, sug?, cb? };
// sug = [incoterm em que esta linha é a melhor, hole do selo] — o incoterm escolhe a cor.
const liveRow = (nome, canal, cotado, prazo, custo, base, h) =>
	`<tr class="crow ${h.row}" style="border-bottom:1px solid ${T.border60};border-left:2px solid transparent">
		${ctd(`<span style="display:inline-flex;flex-direction:column;align-items:flex-start;gap:4px"><span style="font-weight:500">${nome}</span>${h.sug ? sugTag(h.sug[0], h.sug[1]) : ''}</span>`, 'left')}
		${ctd(stack(lendoTag(canal), cotado, h.lendo, h.lido, true))}
		${ctd(stack(muted('—'), mono(prazo), h.lendo, h.lido))}
		${ctd(stack(muted('—'), mono(custo, `color:${T.mutedFg}`), h.lendo, h.lido))}
		${ctd(stack(muted('—'), `<span class="cmpv">${mono(`${base}<span style="color:${T.mutedFg}">/KG</span>`, 'font-weight:500')}</span>`, h.lendo, h.lido))}
		${ctd(stack(badge('neutral', 'resposta recebida'), aiBadge(h.origem), h.lendo, h.lido))}
		${ctd(h.cb ? `<span style="position:relative;display:inline-block;width:16px;height:16px"><span class="vf {{c.cbOff}}" style="position:absolute;inset:0">${checkbox(false)}</span><span class="vf {{c.cbOn}}" style="position:absolute;inset:0">${checkbox(true)}</span></span>` : checkbox(false))}
		${ctd(`<span style="display:inline-flex;color:${T.mutedFg}">${ico('DotsThreeVertical', 16, 'bold')}</span>`)}
	</tr>`
const comparativoBody = `<div class="mc {{c.cmp}}" style="position:absolute;inset:0;display:flex;flex-direction:column;gap:12px">
	<div style="display:flex;flex-direction:column;gap:12px;flex:1;min-height:0">
		${cmpBox('PRODUTO 1', 'MARCA A', '15.000 KG', [
			liveRow('EXPORTADOR 1', 'e-mail', preco('4,85', 'KG', 'FOB'), 'T/T 90 days', '+ 0,00', '4,85', { row: '{{c.rowWin}}', lendo: '{{c.aLendo}}', lido: '{{c.aLido}}', origem: 'E-mail · IA', sug: ['FOB', '{{c.sug1}}'], cb: true }),
			liveRow('EXPORTADOR 2', CURTO ? 'e-mail' : 'WhatsApp', preco('5,02', 'KG', 'CIF'), 'T/T 30 days', '+ 0,02', '4,90', { row: '{{c.rowWa}}', lendo: '{{c.wLendo}}', lido: '{{c.wLido}}', origem: CURTO ? 'E-mail · IA' : 'WhatsApp · IA', sug: ['CIF', '{{c.sug2}}'] }),
			cmpRow('EXPORTADOR 3', null, preco('5,11', 'KG', 'FOB'), 'L/C at sight', '+ 0,04', '5,15', ['info', 'E-mail · IA'])
		])}
		${cmpBox('PRODUTO 2', 'MARCA B', '5.000 KG', [
			cmpRow('EXPORTADOR 1', sugTag('FOB', '{{c.sug3}}'), preco('38,90', 'KG', 'FOB'), 'T/T 90 days', '+ 0,00', '38,90', ['info', 'E-mail · IA'], '{{c.rowB2a}}'),
			cmpRow('EXPORTADOR 2', sugTag('CIF', '{{c.sug4}}'), preco('39,10', 'KG', 'CIF'), 'T/T 30 days', '+ 0,19', '38,81', ['info', CURTO ? 'E-mail · IA' : 'WhatsApp · IA'], '{{c.rowB2b}}', true)
		])}
	</div>
	<div style="display:flex;align-items:center;gap:8px;padding-top:4px"><span style="font-size:12px;color:${T.mutedFg}">Comparável = mesma régua (frete da premissa) + custo financeiro do prazo · 90 dias é a base · /KG × /MT nunca se misturam</span><span style="margin-left:auto;display:flex;gap:8px">${btn('Contra-ofertas', { variant: 'outline', icon: 'Envelope' })}<span class="vf {{c.btnFechar}}">${btn('Fechar cotação', { icon: 'CheckCircle' })}</span></span></div>
</div>`

const detailModal = `<div class="vf {{c.overlay}}" style="position:absolute;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px)"></div>
<div class="vp dmodal {{c.modal}}" style="position:absolute;left:${MODAL_L}px;width:${MODAL_W}px;border:1px solid ${T.border};background:${T.card};border-radius:${R.xl};box-shadow:${DLG_SHADOW};padding:24px;display:flex;flex-direction:column;gap:16px">
	<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding-right:24px">
		<div style="display:flex;flex-direction:column;gap:6px">
			<div style="display:flex;align-items:center;gap:8px;font-size:19.2px;font-weight:600;letter-spacing:.015em">${mono('CC-2026-012')}${badge('info', 'aberta')}</div>
			<span style="font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}">3 itens · aberta agora · 4 exportadores do cadastro</span>
		</div>
		<div style="display:flex;gap:8px">${pillSwap('Comparativo', '{{c.pillCmp}}')}${pillSwap('Disparar BID', '{{c.pillDisp}}')}</div>
	</div>
	<span style="position:absolute;top:16px;right:16px;opacity:.6;display:flex">${ico('X', 16)}</span>
	<div style="position:relative;flex:1;min-height:0">${dispatchBody}${comparativoBody}</div>
	${[0, 1, 2].map((k) => `<span class="env {{c.env}} e${k}" style="position:absolute;left:0;top:0;display:flex;color:${T.brand}">${ico('Envelope', 22, 'fill')}</span>`).join('')}
</div>`

// Diálogo "Cotação fechada" (cap. 1, fim): a OC vai ao vencedor e o feedback aos não escolhidos — os dois existem no produto.
const FCH_W = 800
const actRow = (icon, title, sub, hA, hB, textA, textB, last = false) =>
	`<div style="display:flex;align-items:center;gap:14px;padding:14px;${last ? '' : `border-bottom:1px solid ${T.border60};`}font-size:13.33px;letter-spacing:.025em">
		<span style="display:grid;place-items:center;width:40px;height:40px;border-radius:${R.md};background:${T.muted};color:${T.primary};flex-shrink:0">${ico(icon, 20, 'fill')}</span>
		<span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px"><span style="font-weight:500">${title}</span><span style="font-size:11.1px;color:${T.mutedFg}">${sub}</span></span>
		<span style="position:relative;width:190px;height:22px;flex-shrink:0"><span class="vf ${hA}" style="position:absolute;right:0;top:0;height:22px;display:inline-flex;align-items:center;gap:6px;color:${T.mutedFg};font-size:12px">${ico('CircleNotch', 14, 'bold', '', 'spin')}${textA}</span><span class="vf ${hB}" style="position:absolute;right:0;top:0;height:22px;display:inline-flex;align-items:center;gap:6px;color:${T.green700};font-size:12px;font-weight:500">${ico('Check', 14, 'bold')}${textB}<span class="aiburst"></span></span></span>
	</div>`
const fecharDialog = `<div class="vf {{c.fchOverlay}}" style="position:absolute;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px)"></div>
<div class="vp {{c.fch}}" style="position:absolute;left:${dlgLeft(FCH_W)}px;top:300px;width:${FCH_W}px;border:1px solid ${T.border};background:${T.card};border-radius:${R.xl};box-shadow:${DLG_SHADOW};padding:24px;display:flex;flex-direction:column;gap:16px">
	<div style="display:flex;flex-direction:column;gap:6px">
		<div style="display:flex;align-items:center;gap:10px;font-size:19.2px;font-weight:600;letter-spacing:.015em">${ico('CheckCircle', 22, 'fill', `color:${T.green600}`)}Cotação CC-2026-012 fechada</div>
		<span style="font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}">Vencedoras: EXPORTADOR 1 no PRODUTO 1 e EXPORTADOR 2 no PRODUTO 2 — uma ordem de compra para cada</span>
	</div>
	<div style="border:1px solid ${T.border};border-radius:${R.md};overflow:hidden">
		${actRow('FileText', 'Ordens de compra OC-2026-031 e OC-2026-032', 'Um PDF por fornecedor, só com os itens que ele venceu · COA vigente anexo · faturar para a filial SP', '{{c.ocA}}', '{{c.ocB}}', 'emitindo…', 'enviadas por e-mail')}
		${actRow('ChatsCircle', 'Feedback aos não escolhidos', 'Os exportadores que não venceram recebem o resultado do BID, item a item', '{{c.fbA}}', '{{c.fbB}}', 'enviando…', 'enviado (2)', true)}
	</div>
	<div style="display:flex;justify-content:flex-end">${btn('Concluir', { icon: 'Check' })}</div>
</div>`

/* ---------------- ordens de compra em PDF (cap. 1, depois de fechar) ------------- */
// Cena de 2026-09-18: fechada a cotação, as OCs saem em PDF — UMA POR FORNECEDOR, só com os itens
// que cada um venceu. Duas páginas lado a lado sobre um véu escuro; o carimbo "enviada" entra depois.
const OC_W = 520, OC_H = 640, OC_GAP = 56
const OC_L = (1920 - (OC_W * 2 + OC_GAP)) / 2
const ocLabel = (t) => `<span style="font-family:${MONO};font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:${T.mutedFg}">${t}</span>`
// Refeita em 2026-09-18 pela OC de produção (ordem-compra-dialog.tsx): UMA por fornecedor, em QUILO,
// com bill-to (faturar para), condições, COA anexo e o bloco "Observações do sistema".
const ocCell = (t, extra = '') => `<span style="font-family:${MONO};font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:${T.mutedFg};${extra}">${t}</span>`
const ocPage = (k, x, numero, forn, email, cc, it, cond, anexo, total, delay) =>
	`<div class="vp {{c.ocPg${k}}}" style="position:absolute;left:${x}px;top:${(1080 - OC_H) / 2}px;width:${OC_W}px;height:${OC_H}px;background:#ffffff;border-radius:8px;box-shadow:0 50px 110px -30px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.06);padding:32px 34px;display:flex;flex-direction:column;gap:14px;transition-delay:${delay}">
		<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px">
			<span style="display:flex;flex-direction:column;gap:8px"><span style="display:flex">${wordmark(140, T.fg)}</span><span style="font-size:10px;color:${T.mutedFg}">BID CC-2026-012 · emitida em 18/09/2026 · ${k} de 2</span></span>
			<span style="display:flex;flex-direction:column;align-items:flex-end;gap:3px">${ocLabel('Ordem de compra')}<span style="font-family:${MONO};font-size:16px;font-weight:700;letter-spacing:.02em">${numero}</span></span>
		</div>
		<div style="height:1px;background:${T.border}"></div>
		<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
			<div style="display:flex;flex-direction:column;gap:3px">${ocLabel('Fornecedor')}<span style="font-size:15px;font-weight:600">${forn}</span><span style="font-size:11px;color:${T.mutedFg}">${email}<br>cc: ${cc}</span></div>
			<div style="display:flex;flex-direction:column;gap:3px;padding:8px 10px;border:1px dashed ${T.border};border-radius:${R.md}">${ocLabel('Faturar para')}<span style="font-size:11.5px;line-height:1.45;font-weight:500">Faradays Ingredientes Ltda. · Filial SP<br><span style="font-weight:400;color:${T.mutedFg}">CNPJ 12.345.678/0001-90</span></span></div>
		</div>
		<table style="width:100%;border-collapse:collapse;table-layout:fixed"><colgroup><col><col style="width:96px"><col style="width:104px"><col style="width:104px"></colgroup>
			<thead><tr style="border-bottom:1px solid ${T.border}"><th style="text-align:left;padding:0 0 6px">${ocCell('Produto')}</th><th style="text-align:right;padding:0 0 6px">${ocCell('Qtd (KG)')}</th><th style="text-align:right;padding:0 0 6px">${ocCell('Preço /KG')}</th><th style="text-align:right;padding:0 0 6px">${ocCell('Total')}</th></tr></thead>
			<tbody><tr style="border-bottom:1px solid ${T.border60}">
				<td style="padding:9px 0"><span style="display:flex;flex-direction:column;gap:2px"><span style="font-size:13px;font-weight:600">${it.prod}</span><span style="font-size:10.5px;color:${T.mutedFg}">${it.marca}</span></span></td>
				<td style="padding:9px 0;text-align:right;font-family:${MONO};font-size:12px">${it.qtd}</td>
				<td style="padding:9px 0;text-align:right;white-space:nowrap"><span style="font-family:${MONO};font-size:12px;font-weight:600">${it.val}</span><br><span style="font-family:${MONO};font-size:9.5px;color:${T.mutedFg}">${it.inco}</span></td>
				<td style="padding:9px 0;text-align:right;font-family:${MONO};font-size:12px;font-weight:600">${it.tot}</td>
			</tr></tbody></table>
		<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
			<span style="display:flex;flex-direction:column;gap:2px">${ocLabel('Pagamento')}<span style="font-size:11.5px;font-weight:500">${cond.pag}</span></span>
			<span style="display:flex;flex-direction:column;gap:2px">${ocLabel('Embarque')}<span style="font-size:11.5px;font-weight:500">${cond.emb}</span></span>
			<span style="display:flex;flex-direction:column;gap:2px">${ocLabel('Destino')}<span style="font-size:11.5px;font-weight:500">${cond.ent}</span></span>
		</div>
		<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;border:1px solid ${T.border60};border-radius:${R.md};background:${T.bg}">${ico('FilePdf', 16, 'fill', 'color:#d93025')}<span style="font-size:11px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${anexo}</span><span style="margin-left:auto;font-size:10px;color:${T.mutedFg};white-space:nowrap">anexo</span></div>
		<div style="display:flex;flex-direction:column;gap:2px">${ocLabel('Observações do sistema')}<span style="font-size:10.5px;line-height:1.5;color:${T.mutedFg}">Quantidade e preço por KG conforme a resposta ao BID. A ordem substitui qualquer condição anterior. Documentos do produto (COA, ficha técnica) devem acompanhar o embarque.</span></div>
		<div style="margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:16px">
			<span style="font-size:10px;line-height:1.5;color:${T.mutedFg}">Enviada por e-mail a ${email}<br>PDF gravado na emissão · reenviável</span>
			<span style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">${ocLabel('Total')}<span style="font-family:${MONO};font-size:19px;font-weight:700">${total}</span></span>
		</div>
		<span class="vf {{c.ocSt${k}}}" style="position:absolute;right:30px;bottom:104px;transform:rotate(-7deg);display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border:2px solid ${T.green600};border-radius:8px;background:rgba(0,201,80,.08);color:${T.green700};font-family:${MONO};font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">${ico('PaperPlaneRight', 15, 'fill')}enviada</span>
	</div>`
// Desde 2026-09-21 a cena diz o que é (feedback: "não to vendo disparo de OC"): cabeçalho "DISPARO DA ORDEM DE
// COMPRA · automático" sobre o véu e, sob cada PDF, a linha do envio (para quem, cc, anexo) que entra com o carimbo.
const ocSend = (k, x, email) =>
	`<div class="vf {{c.ocSt${k}}}" style="position:absolute;left:${x}px;top:${(1080 + OC_H) / 2 + 22}px;width:${OC_W}px;display:flex;flex-direction:column;align-items:center;gap:4px;color:#ffffff;font-size:16px;letter-spacing:.01em;white-space:nowrap;text-align:center"><span style="display:inline-flex;align-items:center;gap:9px">${ico('PaperPlaneRight', 17, 'fill', 'color:#7ee2a8')}E-mail enviado a <b>${email}</b></span><span style="font-size:13px;opacity:.75">cc compras@faradays.io · PDF da OC anexo</span></div>`
const ocHead = `<div class="vf {{c.ocHead}}" style="position:absolute;left:0;right:0;top:66px;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;color:#ffffff">
	<span style="font-family:${MONO};font-size:14px;letter-spacing:.24em;text-transform:uppercase;color:#7cc4ff">Disparo da ordem de compra · automático</span>
	<p style="margin:0;font-family:${HEAD};font-size:42px;line-height:1.1;letter-spacing:-.02em;font-weight:600">Fechou a cotação? A OC já saiu, uma para cada fornecedor.</p>
</div>`
const ocPages = `<div class="vf {{c.ocVeil}}" style="position:absolute;inset:0;background:rgba(10,10,10,.58);backdrop-filter:blur(3px)"></div>
${ocHead}
${ocSend(1, OC_L, 'sales@exportador1.com')}
${ocSend(2, OC_L + OC_W + OC_GAP, 'export@exportador2.com')}
${ocPage(1, OC_L, 'OC-2026-031', 'EXPORTADOR 1', 'sales@exportador1.com', 'compras@faradays.io', { prod: 'PRODUTO 1', marca: 'MARCA A', qtd: '15.000', val: 'USD 4,85', inco: 'FOB Qingdao', tot: 'USD 72.750' }, { pag: 'T/T 90 dias', emb: 'até 30 dias', ent: 'Santos · BR' }, 'COA — PRODUTO 1 — MARCA A — lote 2408.pdf', 'USD 72.750', '0s')}
${ocPage(2, OC_L + OC_W + OC_GAP, 'OC-2026-032', 'EXPORTADOR 2', 'export@exportador2.com', 'compras@faradays.io', { prod: 'PRODUTO 2', marca: 'MARCA B', qtd: '5.000', val: 'USD 39,10', inco: 'CIF Santos', tot: 'USD 195.500' }, { pag: 'T/T 30 dias', emb: 'até 30 dias', ent: 'Santos · BR' }, 'COA — PRODUTO 2 — MARCA B — lote 2411.pdf', 'USD 195.500', '.14s')}`

/* ---------------- conversa do cap. 3 (texto compartilhado celular ↔ sistema) ---- */
// Uma fonte para os dois lados: o que o representante manda e o que a IA responde.
const MSG = {
	audio: 'Bom dia! Preciso cotar 2 toneladas do Produto 1 pro Cliente 1, em São Paulo, entrega CIF.',
	entendi: 'Entendi: <b>2 t de PRODUTO 1</b> · CLIENTE 1 · SP · CIF.',
	// A 3ª coluna liga o ALERTA da linha (2026-09-18): data de entrega e crédito saem em vermelho; a 4ª é a nota
	// curta sob o rótulo (2026-09-21: "fora do pedido mínimo" na data de entrega). Último cotado e último faturado
	// levam preço E data (feedback de 2026-09-21).
	quote: [['Preço de tabela', 'USD 4,85/kg'], ['Último cotado', 'USD 4,90/kg · 02/09'], ['Último faturado', 'USD 4,80/kg · 12/08'], ['Lead time', '15 dias'], ['Data de entrega', '20/10', true, 'fora do pedido mínimo'], ['Crédito disponível', 'R$ 38 mil', true]],
	// duas saídas, uma por alerta: o pedido mínimo (FOB ou 5 t) e o crédito (à vista ou mais crédito ao financeiro)
	pergunta: ['Mudo para FOB ou subo para 5 t?', 'Mude o pagamento para à vista ou peça mais crédito ao financeiro.'],
	confirma: 'Muda pra FOB e sobe pra 5 t — o crédito eu resolvo com o financeiro.',
	emitida: 'Cotação COT-V-0188 emitida — 5 t FOB, ICMS SP e câmbio do dia já calculados.',
	pdfCot: ['COT-V-0188 · CLIENTE 1 SP.pdf', '5.000 kg · PRODUTO 1 · 1 pág.'],
	pede: 'Me manda o COA do lote 2408 e a NF do último pedido?',
	segue: 'Segue o COA e a NF 12.345, faturada em 05/09 (R$ 96.000). O boleto vence em 05/10 — 2ª via junto.',
	pdfCoa: ['COA — PRODUTO 1 — lote 2408.pdf', 'PDF · 212 KB · SharePoint'],
	pdfNf: ['NF 12.345 + boleto (2ª via).pdf', 'faturada 05/09 · vence 05/10'],
	pedeFicha: 'E a ficha técnica do PRODUTO 1, tem aí?',
	segueFicha: 'Segue a ficha técnica vigente do PRODUTO 1 — MARCA A, revisão 4.',
	pdfFicha: ['Ficha técnica — PRODUTO 1 — MARCA A.pdf', 'PDF · 164 KB · rev. 4 · SharePoint'],
	// conversa limpa do resumo (2026-09-18; horário configurável, a copy não cita hora): resumo do dia + projeção, e o relatório sob pedido
	resumo: '<b>Resumo do dia · 18/09</b>',
	resumoRows: [['Faturado hoje', 'R$ 186 mil · 3 pedidos'], ['Mês até agora', 'R$ 1,42 mi · 68% da meta'], ['Projeção do mês', 'R$ 2,08 mi · meta R$ 2,0 mi ✓', true]],
	resumoNota: 'Enviado no horário que você definir. O gestor recebe o consolidado do time.',
	pedeRel: 'Manda o relatório de faturamento do mês?',
	segueRel: 'Segue: volume e faturamento de junho a setembro, com o PDF completo.',
	pdfRel: ['Relatório de faturamento — set/2026.pdf', 'PDF · 3 pág. · volume, faturamento e projeção'],
	// Rastreio de NF (2026-09-21, pedido do cliente). No produto a opção "Notas fiscais — NF, boletos e rastreio" do menu
	// do representante está marcada EM BREVE, e a transportadora é importada mas não exposta — mocado no vídeo, avisar.
	pedeNf: 'Onde está a NF 12.340 do Cliente 2?',
	segueNf: '<b>NF 12.340 · CLIENTE 2 · Curitiba</b>',
	nfRows: [['Faturada', '16/09 · R$ 64.200 · PD-0451'], ['Transportadora', 'Rápido Norte · CT-e 55.812'], ['Status', 'Em trânsito desde 17/09 · SP'], ['Previsão de entrega', '22/09 · rastreio RN-88213', true]],
	// BID pelo WhatsApp (2026-09-21): o GESTOR DE COMPRAS comanda a cotação de compra pelo chat — como no produto
	// (menu "BID de compra": bid_status, bid_criar, bid_disparar…; toda ação externa é prévia + "sim").
	bidQ: 'E o comparativo do CC-2026-012?',
	bidSt: '<b>CC-2026-012 · comparativo</b>',
	bidStRows: [['Melhores por produto', 'EXPORTADOR 1 · PRODUTO 1 · USD 4,85 FOB<br>EXPORTADOR 2 · PRODUTO 2 · USD 39,10 CIF'], ['Ordens de compra', 'OC-2026-031 e OC-2026-032 · enviadas por e-mail', true], ['Feedback aos não escolhidos', 'enviado (2)', true]],
	bidNew: 'Cria um BID de 10 t de PRODUTO 3 pros mesmos exportadores.',
	bidPrev: '<b>Prévia · BID CC-2026-013</b>',
	bidPrevRows: [['Item', 'PRODUTO 3 · MARCA B · 10.000 KG'], ['Destinatários', '3 do seu cadastro que cotam o PRODUTO 3 · EXPORTADOR 1, 2 e 3'], ['Canais', 'e-mail e WhatsApp · resposta até 25/09']],
	bidAsk: 'Disparo? Responda <b>sim</b> para confirmar.',
	bidYes: 'Sim',
	bidGo: 'BID CC-2026-013 disparado para EXPORTADOR 1, 2 e 3. Te aviso aqui quando as respostas chegarem.'
}
// Onda do áudio: 30 barras de altura fixa (determinística).
const WAVE_H = [3, 6, 10, 14, 9, 5, 12, 16, 11, 7, 4, 9, 15, 12, 8, 5, 10, 14, 9, 6, 3, 8, 12, 16, 10, 6, 4, 7, 5, 3]
const waveform = (color, h = 18) =>
	`<span style="display:inline-flex;align-items:center;gap:2px;height:${h}px">${WAVE_H.map((v) => `<span style="width:3px;height:${v}px;border-radius:2px;background:${color}"></span>`).join('')}</span>`
// Cartão de números da cotação (dentro do balão da IA). onBrand = balão azul do sistema.
const quoteCard = (onBrand) => {
	const line = onBrand ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.08)', lab = onBrand ? 'rgba(255,255,255,.75)' : '#6b6b6b', val = onBrand ? '#ffffff' : '#111111'
	const al = onBrand ? '#ffc9c9' : T.destructive
	const linhas = MSG.quote.map(([l, v, warn, nota], k) => `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 10px;${k ? `border-top:1px solid ${line};` : ''}font-size:12px;line-height:1.4"><span style="display:flex;flex-direction:column;color:${warn ? al : lab}">${l}${nota ? `<span style="font-size:10.5px;line-height:1.3;font-weight:600;opacity:.95">${nota}</span>` : ''}</span><span style="display:inline-flex;align-items:center;gap:5px;font-family:${MONO};font-weight:600;color:${warn ? al : val};font-variant-numeric:tabular-nums">${warn ? ico('Warning', 12, 'fill') : ''}${v}</span></div>`).join('')
	return `<div style="margin-top:6px;border-radius:8px;overflow:hidden;background:${onBrand ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.045)'}">${linhas}</div>
	<div style="margin-top:6px">${MSG.pergunta[0]}</div><div style="margin-top:3px">${MSG.pergunta[1]}</div>`
}

/* ---------------- página: WhatsApp (sistema) ----------------------------- */
const repRow = (nome, previa, hora, unread, active = false, badgeHtml = '') =>
	`<div style="display:flex;flex-direction:column;gap:6px;padding:16px;border-bottom:1px solid ${T.border60};background:${active ? 'rgba(0,101,224,.06)' : 'transparent'}">
		<div style="display:flex;align-items:center;gap:8px"><span style="font-size:13.33px;font-weight:500;letter-spacing:.025em">${nome}</span>${badgeHtml}<span style="margin-left:auto;font-family:${MONO};font-size:11.1px;color:${unread ? T.brand : 'rgba(138,138,138,.8)'}">${hora}</span></div>
		<div style="display:flex;align-items:center;gap:8px"><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}">${previa}</span>${unread ? `<span style="display:grid;place-items:center;height:20px;min-width:20px;padding:0 6px;border-radius:9999px;background:${T.brand};color:#fff;font-size:11px;font-weight:600">${unread}</span>` : ''}</div>
	</div>`
const bubble = (side, html, cls, opts = {}) => {
	const out = side === 'out'
	const base = `max-width:80%;border-radius:${R.lg};padding:8px 12px;font-size:13.33px;letter-spacing:.025em;line-height:1.5;box-shadow:0 1px 2px rgba(0,0,0,.05);background:${out ? T.brand : T.bg};color:${out ? '#ffffff' : T.fg}`
	const sub = out ? 'rgba(255,255,255,.7)' : T.mutedFg
	return `<div class="vp ${cls}" style="display:flex;justify-content:${out ? 'flex-end' : 'flex-start'}"><div style="${base}">${opts.ia ? `<span style="display:flex;align-items:center;gap:4px;font-family:${MONO};font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:${sub};margin-bottom:2px">${ico('Sparkle', 10, 'fill', '', 'ai-spark')}Agente IA · FS1</span>` : ''}${html}<span style="display:flex;justify-content:flex-end;align-items:center;gap:4px;margin-top:2px;font-family:${MONO};font-size:10px;color:${sub}">${opts.hora}${out ? ico('Checks', 12) : ''}</span></div></div>`
}
const fileCard = (nome, meta, extra = '', onBrand = false) =>
	`<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:${R.lg};border:1px solid ${onBrand ? 'rgba(255,255,255,.22)' : T.border};background:${onBrand ? 'rgba(255,255,255,.14)' : 'rgba(235,235,235,.6)'};${extra}">${ico('FilePdf', 28, 'fill', onBrand ? 'color:#ffffff' : 'color:#d93025')}<div style="min-width:0;display:flex;flex-direction:column"><span style="font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${onBrand ? '#ffffff' : T.fg}">${nome}</span><span style="font-family:${MONO};font-size:10px;color:${onBrand ? 'rgba(255,255,255,.7)' : T.mutedFg}">${meta}</span></div></div>`
// Áudio do representante como o sistema mostra: onda + transcrição da IA.
const audioSys = `<div style="display:flex;align-items:center;gap:8px">${ico('Play', 16, 'fill', `color:${T.mutedFg}`)}${waveform(T.mutedFg, 18)}<span style="font-family:${MONO};font-size:11px;color:${T.mutedFg}">0:07</span></div><div style="margin-top:6px;padding-top:6px;border-top:1px solid ${T.border60};font-size:12.5px;line-height:1.45"><span style="display:flex;align-items:center;gap:4px;font-family:${MONO};font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:${T.mutedFg};margin-bottom:2px">${ico('Sparkle', 10, 'fill', 'color:#4aa8ff', 'ai-spark')}Transcrição · IA</span>${MSG.audio}</div>`
const waPage = `<div class="pgx {{c.pgWa}}" style="position:absolute;inset:0;display:grid;grid-template-columns:2fr 3fr">
	<div style="display:flex;flex-direction:column;gap:16px;padding:20px;border-right:1px solid ${T.border};min-height:0">
		<div style="display:flex;align-items:center;gap:8px">${search('Buscar por nome ou número...', 9999).replace('max-width:9999px;width:100%', 'flex:1')}${btn('', { variant: 'outline', icon: 'Gear', extra: 'width:36px;padding:0' })}${btn('Novo', { variant: 'outline', icon: 'Plus' })}</div>
		<div style="display:flex;flex-direction:column;overflow:hidden;border-radius:${R.lg}">
			${repRow('Carlos Mendes', `${muted('Agente IA · FS1: ', 'opacity:.7')}Cotação COT-V-0188 emitida — PDF anexo`, 'agora', 0, true)}
			${repRow('Ana Souza', `${muted('Você: ', 'opacity:.7')}Tabela de setembro sai dia 01`, 'há 2 h', 0)}
			${repRow('João Pereira', 'Pedido PD-0453 faturado, obrigado!', 'há 5 h', 0, false, badge('primary', 'Gestor'))}
			${repRow('Marcos Lima', `${muted('Agente IA · FS1: ', 'opacity:.7')}NF 12.340 e boleto enviados`, 'ontem', 0)}
			${repRow('Renata Alves', 'Consegue cotar o Produto 4 pro Cliente 3?', 'ontem', 2)}
		</div>
	</div>
	<div style="display:flex;flex-direction:column;padding:20px;min-height:0">
		<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;padding-bottom:16px;margin-bottom:16px;border-bottom:1px solid ${T.border}">
			<div><p style="margin:0;font-size:16px;font-weight:600;letter-spacing:.02em">Carlos Mendes</p><p style="margin:0;font-family:${MONO};font-size:11.1px;color:${T.mutedFg}">+55 11 98765-4321 · Rep. Sudeste</p></div>
			<div style="display:flex;align-items:center;gap:14px"><span style="display:inline-flex;align-items:center;gap:9px;font-family:${MONO};font-size:11.1px;letter-spacing:.06em;text-transform:uppercase;color:${T.green700}"><span class="live-dot"></span>ao vivo</span>${btn('Cotações', { variant: 'outline', size: 'sm', icon: 'FileText' })}</div>
		</div>
		<div class="chat" style="flex:1;min-height:0;border-radius:${R.lg};background:rgba(235,235,235,.4);padding:16px;display:flex;flex-direction:column;gap:12px;--g:12px;overflow:hidden">
			<div style="align-self:center"><span style="display:inline-block;padding:4px 12px;border-radius:9999px;border:1px solid ${T.border};background:rgba(250,250,250,.9);font-size:11.1px;color:${T.mutedFg}">Hoje</span></div>
			${bubble('in', audioSys, '{{c.m1}}', { hora: '09:41' })}
			${bubble('out', `${MSG.entendi}${quoteCard(true)}`, '{{c.m2}}', { hora: '09:41', ia: true })}
			${bubble('in', MSG.confirma, '{{c.m3}}', { hora: '09:42' })}
			${bubble('out', `<span style="display:flex;align-items:center;gap:6px">${ico('CheckCircle', 16, 'fill', 'color:#ffffff')}${MSG.emitida}</span>${fileCard(MSG.pdfCot[0], MSG.pdfCot[1], 'margin-top:8px', true)}`, '{{c.m4}}', { hora: '09:42', ia: true })}
			${bubble('in', MSG.pede, '{{c.m5}}', { hora: '09:44' })}
			${bubble('out', `${MSG.segue}${fileCard(MSG.pdfCoa[0], MSG.pdfCoa[1], 'margin-top:8px', true)}${fileCard(MSG.pdfNf[0], MSG.pdfNf[1], 'margin-top:6px', true)}`, '{{c.m6}}', { hora: '09:44', ia: true })}
			${bubble('in', MSG.pedeFicha, '{{c.m7}}', { hora: '09:46' })}
			${bubble('out', `${MSG.segueFicha}${fileCard(MSG.pdfFicha[0], MSG.pdfFicha[1], 'margin-top:8px', true)}`, '{{c.m8}}', { hora: '09:46', ia: true })}
		</div>
		<div style="margin-top:16px;display:flex;align-items:flex-end;gap:2px;padding:6px;border:1px solid ${T.border};border-radius:${R.lg};background:${T.bg};box-shadow:0 1px 2px rgba(0,0,0,.05)">
			<span style="display:grid;place-items:center;width:36px;height:36px;border-radius:${R.md};color:${T.mutedFg}">${ico('Paperclip', 20)}</span>
			<span style="flex:1;display:flex;align-items:center;height:36px;padding:0 8px;font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}">Mensagem para o representante...</span>
			<span style="display:grid;place-items:center;width:36px;height:36px;border-radius:${R.md};color:${T.mutedFg}">${ico('Microphone', 20)}</span>
			<span style="display:grid;place-items:center;width:36px;height:36px;border-radius:${R.md};color:${T.mutedFg}">${ico('PaperPlaneRight', 20)}</span>
		</div>
	</div>
</div>`

/* ---------------- página: Visão Geral (mural de conversas ao vivo) ------- */
// Fecha o cap. 3: a tela inicial do produto — um card por representante com as últimas mensagens e um
// semáforo (verde ao vivo · lima cotou hoje · âmbar parado). Duas conversas da LINHA DE CIMA (Renata,
// João) ganham mensagens novas durante a cena (vg1..vg4) e o semáforo delas vira verde — tempo real;
// a faixa escura com a legenda sobe 3,5 s depois da página e cobre só a linha de baixo; enquanto ela está
// em cena nenhuma mensagem chega (João antes, Renata depois). O rótulo de tempo vira "agora" ao ficar ao vivo.
const VG_ST = { live: ['#00c950', 'ao vivo'], today: ['#9ae600', 'cotou hoje'], idle: ['#fe9a00', 'parado'] }
const vgDot = (st, cls = '', extra = '') =>
	`<span class="${cls}" style="display:inline-flex;align-items:center;gap:6px;font-family:${MONO};font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;color:${T.mutedFg};${extra}"><span style="width:8px;height:8px;border-radius:9999px;background:${VG_ST[st][0]}"></span>${VG_ST[st][1]}</span>`
const vgStatus = (hA, stA, hB, stB) =>
	`<span style="position:relative;display:inline-block;width:88px;height:14px">${vgDot(stA, `vf ${hA}`, 'position:absolute;right:0;top:0')}${vgDot(stB, `vf ${hB}`, 'position:absolute;right:0;top:0')}</span>`
const miniBubble = (side, text, cls = '') => {
	const out = side === 'out'
	return `<div class="vp ${cls}" style="display:flex;justify-content:${out ? 'flex-end' : 'flex-start'}"><span style="max-width:88%;padding:6px 10px;border-radius:${R.md};font-size:12.5px;line-height:1.4;letter-spacing:.02em;background:${out ? T.brand : T.bg};color:${out ? '#ffffff' : T.fg};box-shadow:0 1px 2px rgba(0,0,0,.05)">${out ? `<span style="display:block;font-family:${MONO};font-size:9px;letter-spacing:.1em;text-transform:uppercase;opacity:.75;margin-bottom:1px">Agente IA · FS1</span>` : ''}${text}</span></div>`
}
const vgTime = (hA, tA, hB, tB) =>
	`<span style="position:relative;display:inline-block;width:64px;height:13px;font-family:${MONO};font-size:10.5px;line-height:13px;color:${T.mutedFg}"><span class="vf ${hA}" style="position:absolute;right:0;top:0">${tA}</span><span class="vf ${hB}" style="position:absolute;right:0;top:0">${tB}</span></span>`
const vgCard = (ini, nome, regiao, statusHtml, hora, msgs) =>
	`<div style="display:flex;flex-direction:column;border:1px solid ${T.border};border-radius:${R.xl};background:${T.card};overflow:hidden;min-height:0">
	<div style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid ${T.border60}"><span style="display:grid;place-items:center;width:32px;height:32px;border-radius:9999px;background:${T.muted};font-size:12px;font-weight:600;flex-shrink:0">${ini}</span><span style="display:flex;flex-direction:column;min-width:0"><span style="font-size:13.33px;font-weight:500;letter-spacing:.02em;white-space:nowrap">${nome}</span><span style="font-size:11.1px;color:${T.mutedFg};white-space:nowrap">${regiao}</span></span><span style="margin-left:auto;display:flex;flex-direction:column;align-items:flex-end;gap:3px">${statusHtml}<span style="font-family:${MONO};font-size:10.5px;color:${T.mutedFg}">${hora}</span></span></div>
	<div class="chat" style="flex:1;min-height:0;padding:12px;display:flex;flex-direction:column;gap:8px;--g:8px;overflow:hidden;background:rgba(235,235,235,.35)">${msgs}</div>
</div>`
// Ranking dos representantes nos últimos 7 dias (2026-09-20), à esquerda das conversas: #, nome, valor
// cotado, volume, cotações e itens. Valores mocados e coerentes com os cards (Carlos lidera; Paulo, parado,
// fecha). A barra sob o nome foi testada e removida a pedido (2026-09-20): só a tabela.
const RANK = [
	['Carlos Mendes', 'Sudeste', 'R$ 486 mil', 486, '14 t', 6, 11],
	['Renata Alves', 'Sul', 'R$ 412 mil', 412, '12 t', 5, 9],
	['Marcos Lima', 'Centro-Oeste', 'R$ 338 mil', 338, '10 t', 4, 7],
	['Ana Souza', 'Sul', 'R$ 275 mil', 275, '8 t', 4, 6],
	['João Pereira', 'Nordeste', 'R$ 231 mil', 231, '7 t', 3, 5],
	['Paulo Reis', 'Norte', 'R$ 84 mil', 84, '2,5 t', 1, 2]
]
const rkTh = (t, align = 'right', w) => `<th style="padding:0 6px 8px;text-align:${align};font-family:${MONO};font-size:10px;letter-spacing:.08em;text-transform:uppercase;font-weight:500;color:${T.mutedFg};border-bottom:1px solid ${T.border};white-space:nowrap;${w ? `width:${w}px;` : ''}">${t}</th>`
const rkTd = (html, align = 'right', extra = '') => `<td style="padding:13px 6px;text-align:${align};border-bottom:1px solid ${T.border60};white-space:nowrap;font-size:12.5px;vertical-align:middle;${extra}">${html}</td>`
const rkRow = ([nome, reg, valor, v, vol, cot, itens], k) =>
	`<tr class="rk" style="animation-delay:${(0.35 + k * 0.09).toFixed(2)}s;${k === 0 ? `background:rgba(0,101,224,.05)` : ''}">
		${rkTd(`<span style="display:inline-grid;place-items:center;width:22px;height:22px;border-radius:9999px;font-family:${MONO};font-size:11px;font-weight:700;${k === 0 ? `background:${T.brand};color:#fff` : `background:${T.muted};color:${T.mutedFg}`}">${k + 1}</span>`, 'center')}
		${rkTd(`<span style="display:block;font-weight:600;overflow:hidden;text-overflow:ellipsis">${nome}</span>`, 'left')}
		${rkTd(mono(valor, 'font-weight:600'))}${rkTd(mono(vol))}${rkTd(mono(String(cot)))}${rkTd(mono(String(itens)))}
	</tr>`
const rankPanel = `<div style="display:flex;flex-direction:column;border:1px solid ${T.border};border-radius:${R.xl};background:${T.card};overflow:hidden;min-height:0">
	<div style="display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid ${T.border60}"><span style="display:grid;place-items:center;width:32px;height:32px;border-radius:${R.md};background:${T.muted};color:${T.fg}">${ico('Medal', 18, 'fill')}</span><span style="display:flex;flex-direction:column;gap:2px"><span style="font-size:14px;font-weight:600;letter-spacing:.01em">Ranking dos representantes</span><span style="font-family:${MONO};font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:${T.mutedFg}">últimos 7 dias · por valor cotado</span></span></div>
	<div style="padding:10px 10px 6px;overflow:hidden"><table style="width:100%;border-collapse:collapse;table-layout:fixed"><colgroup><col style="width:32px"><col><col style="width:88px"><col style="width:52px"><col style="width:42px"><col style="width:44px"></colgroup>
		<thead><tr>${rkTh('#', 'center')}${rkTh('Representante', 'left')}${rkTh('Cotado')}${rkTh('Volume')}${rkTh('Cot.')}${rkTh('Itens')}</tr></thead>
		<tbody>${RANK.map(rkRow).join('')}
		<tr class="rk" style="animation-delay:.95s">${rkTd('', 'center', 'border-bottom:none')}${rkTd(`<span style="font-family:${MONO};font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:${T.mutedFg}">Time · 7 dias</span>`, 'left', 'border-bottom:none')}${rkTd(mono('R$ 1,83 mi', 'font-weight:700'), 'right', 'border-bottom:none')}${rkTd(mono('53,5 t', 'font-weight:600'), 'right', 'border-bottom:none')}${rkTd(mono('23', 'font-weight:600'), 'right', 'border-bottom:none')}${rkTd(mono('40', 'font-weight:600'), 'right', 'border-bottom:none')}</tr>
		</tbody></table></div>
	<div style="margin-top:auto;display:flex;align-items:center;gap:6px;padding:10px 16px;border-top:1px solid ${T.border60};font-size:11.5px;color:${T.mutedFg}">${ico('Sparkle', 13, 'fill', 'color:#4aa8ff', 'ai-spark')}Cotações e itens contados pela FS1 direto das conversas.</div>
</div>`
const vgPage = `<div class="pgx {{c.pgVG}}" style="position:absolute;inset:0;display:flex;flex-direction:column;gap:20px;padding:24px">
	<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:16px">
		<div><p style="margin:0;font-size:19.2px;font-weight:600;letter-spacing:.015em">Visão Geral</p><p style="margin:4px 0 0;font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}">Conversas dos representantes · atualizado agora</p></div>
		<div style="display:flex;align-items:center;gap:18px">${vgDot('live')}${vgDot('today')}${vgDot('idle')}<span style="display:inline-flex;align-items:center;gap:9px;font-family:${MONO};font-size:11.1px;letter-spacing:.06em;text-transform:uppercase;color:${T.green700}"><span class="live-dot"></span>tempo real</span></div>
	</div>
	<div style="flex:1;min-height:0;display:grid;grid-template-columns:420px 1fr;gap:16px">
	${rankPanel}
	<div style="min-height:0;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);gap:16px">
		${vgCard('CM', 'Carlos Mendes', 'Rep. Sudeste', vgDot('live'), 'agora', miniBubble('in', MSG.pede) + miniBubble('out', 'Segue o COA e a NF 12.345 — o boleto vence em 05/10.'))}
		${vgCard('RA', 'Renata Alves', 'Rep. Sul', vgStatus('{{c.stR0}}', 'today', '{{c.stR1}}', 'live'), vgTime('{{c.tR0}}', 'ontem', '{{c.tR1}}', 'agora'), miniBubble('in', 'Consegue cotar o Produto 4 pro Cliente 3?') + miniBubble('out', 'Tabela USD 8,90/kg · último faturado USD 8,75/kg · lead time 12 dias. Quantos kg?') + miniBubble('in', 'Fechou 1 t. Manda a cotação!', '{{c.vgC}}') + miniBubble('out', 'Cotação COT-V-0189 emitida — PDF anexo.', '{{c.vgD}}'))}
		${vgCard('JP', 'João Pereira', 'Rep. Nordeste', vgStatus('{{c.stJ0}}', 'idle', '{{c.stJ1}}', 'live'), vgTime('{{c.tJ0}}', 'há 5 h', '{{c.tJ1}}', 'agora'), miniBubble('in', 'Pedido PD-0453 faturado, obrigado!') + miniBubble('out', 'De nada! NF 12.331 e boleto já estão com o cliente.') + miniBubble('in', 'Cliente 2 pediu 500 kg do Produto 3. Consegue cotar?', '{{c.vgA}}') + miniBubble('out', 'Claro: PRODUTO 3 · 500 kg · CLIENTE 2 · SP. Tabela USD 12,40/kg · lead time 10 dias. Confirmo?', '{{c.vgB}}'))}
		${vgCard('ML', 'Marcos Lima', 'Rep. Centro-Oeste', vgDot('live'), 'há 4 min', miniBubble('in', 'Me manda a NF do último pedido do Cliente 4?') + miniBubble('out', 'NF 12.340 e boleto (2ª via) enviados.'))}
		${vgCard('AS', 'Ana Souza', 'Rep. Sul', vgDot('today'), 'há 2 h', miniBubble('in', 'A tabela de setembro já saiu?') + miniBubble('out', 'Sai dia 01. Quer que eu te avise?') + miniBubble('in', 'Pode ser!'))}
		${vgCard('PR', 'Paulo Reis', 'Rep. Norte', vgDot('idle'), 'há 3 dias', miniBubble('in', 'Preciso do Halal do Produto 2.') + miniBubble('out', 'Segue o HALAL — PRODUTO 2 — MARCA A, válido até 15/09/2026.'))}
	</div>
	</div>
</div>`

/* ---------------- painel SharePoint (fora da janela) -------------------- */
// [nome original, nome padrão dado pela IA (null = já estava certo), meta]. As três primeiras chegam
// com nome "nada a ver": meta → sincronizando… → sincronizado → lido e renomeado pela IA, e o nome
// troca para [DOCUMENTO — PRODUTO/FORNECEDOR — MARCA — VAL dd.mm.aaaa] (padrão do produto real).
const SP_FILES = [
	['scan_0231.pdf', 'ISO 9001 — PRODUTO 1 — MARCA A — VAL 02.11.2027.pdf', 'PDF · 1,2 MB · hoje'],
	['WhatsApp Image 2026-08-12.pdf', 'LICENÇA FABRICAÇÃO — EXPORTADOR 2 — VAL 15.03.2028.pdf', 'PDF · 640 KB · hoje'],
	['Certificado (2) final.pdf', 'COA — PRODUTO 3 — MARCA B — lote 2408.pdf', 'PDF · 198 KB · ontem'],
	['ISO 9001 — PRODUTO 4 — MARCA C — VAL 02.11.2027.pdf', null, 'PDF · 880 KB · há 3 dias'],
	['FDA — EXPORTADOR 3 — VAL 20.01.2027.pdf', null, 'PDF · 310 KB · há 1 sem'],
	['MSDS — PRODUTO 5 — MARCA B.pdf', null, 'PDF · 452 KB · há 2 sem']
]
const ELL = 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis'
const spName = (k) => {
	const [old, novo] = SP_FILES[k]
	return novo
		? `<span style="position:relative;display:block;height:20px;line-height:20px"><span class="vf {{c.spN${k}}}" style="position:absolute;left:0;right:0;top:0;${ELL}">${old}</span><span class="vf {{c.spR${k}}}" style="position:absolute;left:0;right:0;top:0;${ELL};font-weight:500">${novo}</span></span>`
		: `<span style="${ELL}">${old}</span>`
}
const spMeta = (k) => {
	const meta = SP_FILES[k][2]
	const L = `position:absolute;left:0;top:0;display:flex;align-items:center;gap:5px;white-space:nowrap`
	return SP_FILES[k][1]
		? `<span style="position:relative;display:block;height:17px;font-size:11.1px;line-height:17px"><span class="vf {{c.spM${k}}}" style="${L};color:${T.mutedFg}">${meta}</span><span class="vf {{c.spS${k}}}" style="${L};color:${T.amber700}">${ico('CircleNotch', 12, 'bold', '', 'spin')}sincronizando…</span><span class="vf {{c.spD${k}}}" style="${L};color:${T.green700}">${ico('Check', 12, 'bold')}sincronizado · agora</span><span class="vf {{c.spI${k}}}" style="${L}">${ico('Sparkle', 12, 'fill', 'color:#4aa8ff', 'ai-spark')}<span class="ai-shimmer">lido e renomeado pela IA</span></span></span>`
		: `<span style="font-size:11.1px;color:${T.mutedFg}">${meta}</span>`
}
const spPanelRow = (k) =>
	`<div class="sprow {{c.sp${k}}}" style="display:flex;align-items:center;gap:12px;height:44px;margin:4px 0;padding:0 10px;border-radius:${R.md};font-size:13.33px;letter-spacing:.025em">${ico('FilePdf', 22, 'fill', 'color:#d93025')}<span style="flex:1;min-width:0;display:flex;flex-direction:column">${spName(k)}${spMeta(k)}</span></div>`
const spPanel = `<div class="sl {{c.sp}}" style="position:absolute;left:80px;top:200px;width:440px;height:600px;border:1px solid ${T.border};border-radius:${R.xl};background:${T.card};box-shadow:0 25px 50px -12px rgba(0,0,0,.25);display:flex;flex-direction:column;overflow:hidden">
	<div style="height:64px;display:flex;align-items:center;gap:12px;padding:0 16px;border-bottom:1px solid ${T.border60}">${sharepointSvg(28)}<div style="display:flex;flex-direction:column"><span style="font-size:13.33px;font-weight:500;letter-spacing:.025em">SharePoint</span><span style="font-family:${MONO};font-size:11.1px;color:${T.mutedFg};white-space:nowrap">Qualidade · Documentos</span></div><span style="margin-left:auto;position:relative;width:150px;height:21px;flex-shrink:0"><span class="vf {{c.spHdrS}}" style="position:absolute;right:0;top:0">${badge('warning', `${ico('CircleNotch', 12, 'bold', '', 'spin')} sincronizando 3`)}</span><span class="vf {{c.spHdrOk}}" style="position:absolute;right:0;top:0">${badge('success', `${ico('ArrowsClockwise', 12)} sincronizado`)}</span></span></div>
	<div style="height:40px;display:flex;align-items:center;gap:4px;padding:0 16px;font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg};border-bottom:1px solid ${T.border60}"><span>Documentos</span>${ico('CaretRight', 14)}<span style="color:${T.fg};font-weight:500">Novos</span><span style="margin-left:auto;font-family:${MONO};font-size:11.1px">6 arquivos</span></div>
	<div style="padding:4px 8px;display:flex;flex-direction:column">${SP_FILES.map((_, k) => spPanelRow(k)).join('')}</div>
	<div style="margin-top:auto;padding:12px 16px;border-top:1px solid ${T.border60};font-size:11.1px;color:${T.mutedFg};display:flex;align-items:center;gap:6px">${ico('CloudArrowUp', 14)}Sincronização automática — a IA lê tipo, produto, marca e validade e renomeia o arquivo no padrão.</div>
</div>`
// Cartões que "voam" do painel para a tabela (3, em pilha), já com o nome dado pela IA.
const dragCard = (nome, meta, k) =>
	`<div class="dcard d${k} {{c.card${k}}}" style="position:absolute;left:0;top:0;width:424px;transform:{{st.card${k}}};display:flex;align-items:center;gap:12px;height:44px;padding:0 10px;border-radius:${R.md};font-size:13.33px;letter-spacing:.025em;background:#dbe7f9;border:1px solid ${T.border}">${ico('FilePdf', 22, 'fill', 'color:#d93025')}<span style="flex:1;min-width:0;display:flex;flex-direction:column"><span style="${ELL};font-weight:500">${nome}</span><span style="font-size:11.1px;color:${T.mutedFg}">${meta}</span></span></div>`

/* ---------------- card-eco (anatomia da LP, sem toast) ------------------- */
const echoCard = (cls, icon, title, meta, label) =>
	`<div class="vp ${cls}" style="position:absolute;left:1484px;bottom:234px;width:340px">
	<div style="background:${T.card};border:1px solid ${T.border};border-radius:${R.xl};padding:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,.25)">
		<div style="display:flex;align-items:center;gap:12px">${icon}<div style="min-width:0;display:flex;flex-direction:column"><span style="font-size:15px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${title}</span><span style="font-family:${MONO};font-size:12px;color:${T.mutedFg};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${meta}</span></div></div>
		<div style="margin-top:14px;display:flex;flex-direction:column;gap:7px"><div style="height:7px;width:100%;border-radius:9999px;background:rgba(10,10,10,.1)"></div><div style="height:7px;width:80%;border-radius:9999px;background:rgba(10,10,10,.1)"></div><div style="height:7px;width:60%;border-radius:9999px;background:rgba(10,10,10,.1)"></div></div>
		<span style="display:block;margin-top:14px;font-family:${MONO};font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(10,10,10,.4)">${label}</span>
	</div>
</div>`

/* ---------------- cartelas: título só, e as escuras com a espiral ------- */
// Os três produtos, na ordem dos capítulos. A timeline das bolhas usa esta lista na
// abertura (todas acesas) e em cada cartela de capítulo (só a do capítulo acesa).
const FEATURES = ['Cotação de compra em um clique', 'Agente de documentos com IA', 'Cotação de venda direto no WhatsApp']
// Bolhas em linha, soltas (sem conectores, nem na transição). active: índice do capítulo aceso (ou 'all').
// base: segundo em que a 1ª bolha sobe; as seguintes `gap` s depois (0,15 em toda parte — o
// intervalo de 0,6 s na abertura foi testado e revertido em 2026-09-11); cada uma acende 0,5 s após subir.
const stepsRow = (active, base, gap = 0.15) =>
	`<div class="steps" style="display:flex;align-items:center;gap:36px">${FEATURES.map((t, k) => {
		const on = active === 'all' || k === active
		const d = base + k * gap
		const cls = on ? ' on' : ' off'
		return `<div class="qfb${cls}" style="animation-delay:${d.toFixed(2)}s;transition-delay:${(d + 0.5).toFixed(2)}s">${ico('Sparkle', 18, 'fill', 'position:relative', 'ai-spark')}<span style="position:relative">${t}</span></div>`
	}).join('')}</div>`
// Marcador de capítulo — BOLHA ESTACIONADA (selo, de volta em 2026-09-14 no lugar do anel com numeral):
// cópia da bolha acesa da cartela que, na saída dela, assume no mesmo lugar (DOCK_FROM, medido) e voa
// ao canto superior esquerdo (DOCK_TO), onde fica durante a demo. Some nos zooms que cobrem o canto
// (volta com fade quando a câmera recua) e sai quando a cartela seguinte entra.
const dockPill = (k) => `<div class="dock {{c.dock${k}}}" style="position:absolute;left:0;top:0;transform-origin:0 0;transform:{{st.dock${k}}}"><div class="qfb">${ico('Sparkle', 18, 'fill', 'position:relative', 'ai-spark')}<span style="position:relative">${FEATURES[k]}</span></div></div>`
const docks = [0, 1, 2].map(dockPill).join('')

// Palavra que acende do cinza para o gradiente de IA (duas camadas — ver .acende no CSS).
const acende = (t) => `<span class="acende"><span class="frio">${t}</span><span class="quente ai-shimmer" aria-hidden="true">${t}</span></span>`
// Título de capítulo — um só estilo para as três cartelas (o do BID): 80px, entrelinha 1,05,
// tracking -0,025em e TITLE_GAP px entre as linhas; a timeline fica 56px abaixo (36 + 20 no BID).
const TITLE_H1 = `margin:0;font-family:${HEAD};font-size:80px;line-height:1.05;letter-spacing:-.025em;font-weight:600;white-space:nowrap`
const TITLE_GAP = 36
// lines: string ou array (uma entrada por linha; cada linha é um bloco). opts.step: capítulo aceso na
// timeline sob o título (sem step, não há timeline). icons: { palavra: svg } — a palavra ganha o ícone
// à esquerda. As palavras sobem em cascata (0,07 s cada, contando pelas linhas).
const titleCard = (cls, lines, opts = {}) => {
	const icons = opts.icons ?? {}
	let n = 0
	const word = (w) => {
		const d = `animation-delay:${(n++ * 0.07).toFixed(2)}s`
		return icons[w]
			? `<span class="w" style="display:inline-flex;align-items:center;gap:22px;vertical-align:bottom;${d}"><span style="display:flex;transform:translateY(-4px)">${icons[w]}</span>${w}</span>`
			: `<span class="w" style="${d}">${w}</span>`
	}
	const html = [lines].flat().map((l) => `<span style="display:block">${l.split(' ').map(word).join(' ')}</span>`).join('')
	return `<div class="vf tc ${cls}" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:56px;text-align:center;padding:0 160px">
	<h1 style="${TITLE_H1};color:${T.fg};display:flex;flex-direction:column;gap:${TITLE_GAP}px">${html}</h1>
	${opts.step == null ? '' : stepsRow(opts.step, 0.55)}
</div>`
}

// Espiral de Fibonacci — mesma construção do fibonacci-spiral.tsx da LP
// (12 termos, traço 120px non-scaling, olho tapado, branco a 2,5%).
const spiralSvg = (() => {
	const DIRS = [[1, -1], [1, 1], [-1, 1], [-1, -1]]
	let a = 1, b = 1, x = 0, y = 1
	let d = `M ${x} ${y}`
	let minX = x, maxX = x, minY = y, maxY = y
	for (let i = 0; i < 12; i++) {
		const r = a
		const [ux, uy] = DIRS[i % 4]
		x += r * ux
		y += r * uy
		d += ` A ${r} ${r} 0 0 1 ${x} ${y}`
		minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y)
		;[a, b] = [b, a + b]
	}
	const vb = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
	return `<svg viewBox="${vb}" fill="none" preserveAspectRatio="xMidYMid meet" style="position:absolute;top:50%;left:50%;width:88%;transform:translate(-50%,-50%) scale(-1,-1);overflow:visible;color:#ffffff;opacity:.025;pointer-events:none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="120" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path><path d="M 1 1 h 0" stroke="currentColor" stroke-width="192" stroke-linecap="round" vector-effect="non-scaling-stroke"></path></svg>`
})()
const darkCard = (cls, inner) =>
	`<div class="vf tc ${cls}" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px">${inner}</div>`
// Dica de rotação na abertura (DESLIGADA nos CUES; descomente lá para voltar): anel de setas finas
// girando devagar e um celular que vai da vertical para a horizontal.
const HINT_INK = '#7a7a7a' // cinza da dica de rotação (setas e celular)
const RING = (() => {
	const arc = 'M 26 85.8 A 100 100 0 0 1 206.6 70 M 207.8 56.1 L 206.6 70 L 193.9 64.1'
	return `<svg viewBox="0 0 240 240" width="240" height="240" fill="none" stroke="${HINT_INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${arc}"></path><path d="${arc}" transform="rotate(180 120 120)"></path></svg>`
})()
const rotateHint = `<div class="w" style="position:relative;width:240px;height:240px;display:grid;place-items:center">
	<span class="rh-ring" style="position:absolute;inset:0;display:grid;place-items:center">${RING}</span>
	<span class="rh-phone" style="position:relative;width:64px;height:112px;border:4px solid ${HINT_INK};border-radius:14px;background:${STAGE}"><span style="position:absolute;left:50%;bottom:7px;width:18px;height:3px;margin-left:-9px;border-radius:2px;background:${HINT_INK}"></span></span>
</div>`
const hintCard = darkCard('{{c.hint}}', rotateHint)
// Cartela-pergunta (as três cartelas de capítulo, desde 2026-09-12): a câmera abre nas primeiras
// palavras bem grandes (foco medido no Chrome: centro das palavras + escala), o zoom out revela o
// resto da linha subindo, a linha 2 sobe e a timeline das bolhas entra com a bolha do capítulo acesa;
// a cartela sai recuando. Sem elementos flutuando ao fundo — só o layer do texto, .qtx.
// opts.size / opts.size2: corpo da linha 1 e da linha 2 (padrão 80px, o TITLE_H1). Um "|" no texto força a
// quebra de linha. Sem uso desde que o título do BID voltou a caber em duas linhas de 80px — fica para o caso
// de outra frase longa.
const qCard = (cls, holeTx, big, rest, line2, step, opts = {}) => {
	const h1 = (px) => TITLE_H1.replace('font-size:80px', `font-size:${px}px`)
	const bw = big.split(' ').map((w, k) => `<span class="w"${k ? ` style="animation-delay:${(k * 0.08).toFixed(2)}s"` : ''}>${w}</span>`).join(' ')
	let n = 0
	const rw = rest.split(' ').map((w) => { if (w === '|') return '<br>'; const o = `<span class="qw2"${n ? ` style="animation-delay:${(0.05 + n * 0.07).toFixed(2)}s"` : ''}>${w}</span>`; n++; return o }).join(' ')
	let m = 0
	const l2 = line2.split(' ').map((w) => { if (w === '|') return '<br>'; const o = `<span class="l2w" style="animation-delay:${(m * 0.04).toFixed(2)}s">${w}</span>`; m++; return o }).join(' ')
	const s1 = opts.size ?? 80, s2 = opts.size2 ?? s1
	return `<div class="vf q qb ${cls}" style="position:absolute;inset:0;overflow:hidden">
	<div class="qtx" style="position:absolute;inset:0;transform:{{st.${holeTx}}}">
		<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${TITLE_GAP}px;text-align:center;color:${T.fg}">
			<h1 class="q1" style="${h1(s1)}">${bw} ${rw}</h1>
			<h1 style="${h1(s2)}">${l2}</h1>
			<div style="margin-top:20px">${stepsRow(step, 0.3)}</div>
		</div>
	</div>
</div>`
}
// Título do BID (2026-09-14): "Do pedido à ordem de compra em um clique. / A IA interage. Você só aprova."
// O texto longo ("Dispare cotações nacionais e internacionais…") foi testado e tinha palavras demais — a demo já
// mostra o tipo (Internacional), os canais e a OC. Volta ao corpo padrão de 80px, uma linha por bloco.
const bidQCard = qCard('{{c.ch2}}', 'qbTx', 'Do pedido', 'à ordem de compra em um clique.', 'A IA interage. Você só aprova.', 0)
const docsQCard = qCard('{{c.ch1}}', 'dTx', 'Documentos', 'dos seus produtos vencendo?', 'Ainda precisa cobrar os fornecedores?', 1)
const waQCard = qCard('{{c.ch3}}', 'wTx', 'Seu time de vendas', 'inteiro', 'no WhatsApp', 2)
// Abertura em quatro tempos (2026-09-17, pedido do usuário: o FS1 colado no wordmark não agradou).
// 1) a MARCA sozinha — o wordmark Faradays no centro; 2) ele sobe e sai, e o PRODUTO assume o mesmo lugar:
// "FS1" grande em mono, com "por <wordmark>" embaixo (a empresa vira assinatura, não vizinha); 3) slogan e
// a timeline das três bolhas; 4) a linha de PARCEIROS no rodapé. As duas camadas do troca-troca ficam
// empilhadas em posição absoluta dentro de um bloco de altura fixa, para uma sair no lugar exato da outra.
// .opA tem um filho .opAin porque duas animações no mesmo elemento não funcionam aqui: a segunda, atrasada
// e com fill "both", já aplica o quadro 0% durante o atraso e atropela a entrada. Fora: entra no .opAin.
// Marca ao lado do nome. A da Microsoft é a oficial (os quatro quadrados, os mesmos do diálogo Conectar
// drive). A da Meta é o símbolo do infinito oficial (`metaSvg`, PNG embutido). Se vier um selo de parceiro
// (Microsoft Partner / Meta Business Partner), troca aqui.
const parceiro = (nome, marca) =>
	`<span style="display:inline-flex;align-items:center;gap:12px">${marca}<span style="font-family:${HEAD};font-size:28px;font-weight:600;letter-spacing:-.015em;color:${T.fg}">${nome}</span></span>`
const openCard = darkCard(
	'{{c.open}}',
	`<div class="opCol" style="display:flex;flex-direction:column;align-items:center;gap:34px">
		<div style="position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:240px">
			<div class="opA" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><span class="opAin" style="display:flex">${wordmark(680, T.fg)}</span></div>
			<div class="opB" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px">
				<span style="font-family:${MONO};font-size:170px;font-weight:700;letter-spacing:.06em;margin-right:-.06em;line-height:1;color:${T.fg}">FS1</span>
				<span style="display:flex;align-items:center;gap:16px;font-family:${HEAD};font-size:26px;letter-spacing:-.01em;color:${T.mutedFg}">por<span style="display:flex;transform:translateY(1px)">${wordmark(210, T.mutedFg)}</span></span>
			</div>
		</div>
		<div class="w" style="animation-delay:2.5s;font-family:${MONO};font-size:29px;font-weight:500;letter-spacing:.26em;padding-left:.26em;text-transform:uppercase;color:${T.mutedFg}">${acende('IA')} para indústrias que compram e vendem ${acende('muito bem')}</div>
		<div style="margin-top:14px">${stepsRow('all', 2.7)}</div>
		<div class="opP" style="margin-top:26px;display:flex;flex-direction:column;align-items:center;gap:16px">
			<span style="font-family:${MONO};font-size:13.33px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:rgba(138,138,138,.95)">Parceiros da</span>
			<span style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;column-gap:30px">
				<span style="justify-self:end">${parceiro('Microsoft', msLogo(28))}</span>
				<span style="width:1px;height:30px;background:rgba(10,10,10,.16)"></span>
				<span style="justify-self:start">${parceiro('Meta', metaSvg(38))}</span>
			</span>
		</div>
	</div>`
)
// Fechamento: só a bandeira do logo ganha o gradiente de IA. Na barra, a lupa fica à esquerda
// e URL + cursor formam um grupo centralizado no meio geométrico, durante e após a digitação.
// Embaixo, o botão "Get in touch" (2026-09-14) sobe com os outros elementos (3º .w, 0,14 s depois do logo).
const closeCard = darkCard(
	'{{c.close}}',
	`<div class="w" style="position:relative;display:flex">${wordmark(460, T.fg, 'flagGrad')}</div><div class="w" style="position:relative;display:flex;align-items:center;justify-content:center;width:560px;height:60px;border-radius:9999px;background:#ffffff;border:1px solid ${T.border};box-shadow:0 12px 32px -14px rgba(0,0,0,.2)"><span style="position:absolute;left:22px;top:50%;transform:translateY(-50%);display:flex">${ico('MagnifyingGlass', 22, 'bold', `color:${T.mutedFg}`)}</span><span style="display:inline-flex;align-items:center;gap:6px"><span class="url" style="font-family:${MONO};font-size:22px;letter-spacing:0;color:${T.fg}">www.faradays.io</span><span class="caret" style="width:2px;height:28px;background:${T.fg}"></span></span></div><div class="w" style="position:relative;display:inline-flex;align-items:center;gap:12px;height:56px;padding:0 28px 0 32px;border-radius:9999px;background:${T.fg};color:#ffffff;font-family:${HEAD};font-size:21px;font-weight:600;letter-spacing:-.01em;box-shadow:0 16px 36px -16px rgba(0,0,0,.5)">Get in touch${ico('ArrowRight', 20, 'bold')}</div>`
)

// Corte de 1 min no ritmo de um vídeo de apresentação SaaS (2026-09-30, referência que o usuário mandou):
// Problema → Solução → Demo → Recursos → CTA. Uma ideia por vez,
// poucas palavras na tela: TIPOGRAFIA CINÉTICA (cada palavra entra do desfoque para o foco; a segunda parte
// entre chaves que chegam pelos lados) no Problema e nas legendas que separam os recortes da demo. As
// legendas são opacas (chão da LP) e servem também de máscara: as cenas colapsadas trocam por baixo delas.
const KIN_H = `margin:0;font-family:${HEAD};line-height:1.05;letter-spacing:-.03em;font-weight:600;white-space:nowrap;color:${T.fg};display:flex;align-items:center;justify-content:center;gap:.26em`
// Palavra entre *asteriscos* sai em vermelho (o custo do problema).
const kinWords = (t, d0) =>
	t.split(' ').map((w, k) => {
		const red = /^\*.*\*[.,]?$/.test(w)
		const txt = red ? w.replace(/\*/g, '') : w
		return `<span class="kw" style="animation-delay:${(d0 + k * 0.07).toFixed(2)}s${red ? `;color:${T.destructive}` : ''}">${txt}</span>`
	}).join(' ')
// kin(buraco, texto, texto entre chaves, { size, bg, extra })
const kin = (hole, a, b, opts = {}) => {
	const na = a ? a.split(' ').length : 0
	const partA = a ? `<span>${kinWords(a, 0)}</span>` : ''
	const partB = b ? `<span class="brw"><span class="brc l">{</span><span>${kinWords(b, na * 0.07 + 0.12)}</span><span class="brc r">}</span></span>` : ''
	return `<div class="vf kin {{c.${hole}}}" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;${opts.bg ? `background:${STAGE};` : ''}">
	${opts.extra ?? ''}<h1 style="${KIN_H};position:relative;font-size:${opts.size ?? 104}px">${partA}${partB}</h1>
</div>`
}
// PROBLEMA em GSAP (2026-09-30): uma timeline PAUSADA (HOOK_TL no runtime) que o relógio do vídeo posiciona a cada
// quadro — segue o ?t=, a pausa e o loop, e grava igual toda vez. As camadas .hl não têm buraco {{c.}}: quem pinta
// é o GSAP. Roteiro (s desde o fim da cabeça em branco):
//   0,0  "Cotação de compra" — e o glow nasce de baixo e cresce para cima
//   1,4  "por e-mail" → 2,1 "e planilha" entra da direita para a esquerda e empurra a linha; os cartões
//        entram no sentido ANTI-HORÁRIO a partir das 2 h, cada um girando levemente no anti-horário
//   3,6  "Certificado vencido" · 4,9 "{ sem ninguém ver }" · 6,2 "Cada cotação lenta"
//   7,3  "é margem indo embora." como o "Money lit on fire" da referência: palavra a palavra, todas com a mesma
//        entrada; a cada palavra o texto pisca e a linha encolhe e corre para a esquerda, bem rápido (na última, zoom out)
// Os cartões ficam numa elipse, na ordem dos ângulos a partir das 2 h (30°), subindo no anti-horário.
const COLAGEM = [
	['FileXls', 'comparativo_v7_FINAL.xlsx', -3],
	['Paperclip', 'COA_anexo (3).pdf', 2],
	['Envelope', 'RE: RE: Cotação PRODUTO 1', -4],
	['WhatsappLogo', 'Qual o preço CIF?', 3],
	['FileXls', 'cotacao_fornecedores (2).xlsx', -2],
	['Envelope', 'Consegue mandar o preço até sexta?', 2],
	['Clock', 'Aguardando retorno…', -3],
	['Envelope', 'FW: FW: proforma', 4],
]
const COL_RX = 690, COL_RY = 330
const colagem = COLAGEM.map(([icon, t, r], k) => {
	const a = ((30 + k * 45) * Math.PI) / 180
	const x = Math.round(960 + COL_RX * Math.cos(a)), y = Math.round(540 - COL_RY * Math.sin(a))
	return `<span class="hchip" data-r="${r}" style="left:${x}px;top:${y}px">${ico(icon, 26, 'regular', `color:${icon === 'FileXls' ? T.green700 : icon === 'WhatsappLogo' ? '#25d366' : T.mutedFg}`)}<span>${t}</span></span>`
}).join('')
const hw = (t) => t.split(' ').map((w) => `<span class="hw">${w}</span>`).join(' ')
const hookLayers = `<div class="hook">
	<div class="hl" id="hk1"><h1 class="kh">${hw('Cotação de compra')}</h1></div>
	<div class="hl" id="hk2"><div class="hcol">${colagem}</div><h1 class="kh hline"><span class="pa">${hw('por e-mail')}</span><span class="pb">${hw('e planilha')}</span></h1></div>
	<div class="hl" id="hk3"><h1 class="kh">${hw('Certificado vencido')}</h1></div>
	<div class="hl" id="hk4"><h1 class="kh"><span class="hbr l">{</span>${hw('sem ninguém ver')}<span class="hbr r">}</span></h1></div>
	<div class="hl" id="hk5"><h1 class="kh">${hw('Cada cotação lenta')}</h1></div>
	<div class="hl" id="hk6"><h1 class="kh mline"><span class="mw">é</span><span class="mw" style="color:${T.destructive}">margem</span><span class="mw">indo</span><span class="mw">embora.</span></h1></div>
</div>`
// A timeline do Problema (roda no runtime, depois das fontes). Tempos em s desde o fim da cabeça em branco.
const HOOK_JS = `
function buildHook() {
	const q = (s) => document.querySelector(s), qa = (s, r = document) => [...r.querySelectorAll(s)];
	const tl = gsap.timeline({ paused: true });
	const IN = { opacity: 0, filter: 'blur(16px)', y: 18, scale: 1.06 }, ON = { opacity: 1, filter: 'blur(0px)', y: 0, scale: 1, duration: 0.6, ease: 'expo.out', stagger: 0.07 };
	const layer = (id, t0, t1) => { tl.set('#' + id, { opacity: 1 }, t0); tl.to('#' + id, { opacity: 0, filter: 'blur(10px)', duration: 0.3, ease: 'power2.in' }, t1 - 0.3); };
	const words = (sel, t) => tl.fromTo(sel, IN, ON, t);
	gsap.set('.hl', { opacity: 0 });
	// glow: SÓ o de baixo na 1ª frase — nasce na base, cresce para cima e apaga com ela (as frases 2 a 5 ficam sem glow)
	const grow = (sel, org, t, d = 1.2) => tl.fromTo(sel, { opacity: 0, scaleY: 0.1, transformOrigin: org }, { opacity: 1, scaleY: 1, duration: d, ease: 'power3.out' }, t);
	const fade = (sel, org, t, d = 0.5) => tl.to(sel, { opacity: 0, scaleY: 0.3, transformOrigin: org, duration: d, ease: 'power2.in' }, t);
	grow('.gh', '50% 100%', 0, 1.4); fade('.gh', '50% 100%', 1.2, 0.5);
	layer('hk1', 0, 1.4); words('#hk1 .hw', 0);
	// "por e-mail" centrado; "e planilha" chega da direita e a linha corre para a esquerda até recentrar
	layer('hk2', 1.4, 3.6); words('#hk2 .pa .hw', 1.4);
	const line = q('#hk2 .hline'), pb = q('#hk2 .pb');
	const shift = (pb.offsetWidth + parseFloat(getComputedStyle(line).columnGap || 0)) / 2;
	tl.set(line, { x: shift }, 0).set('#hk2 .pb .hw', { opacity: 0 }, 0);
	tl.to(line, { x: 0, duration: 0.55, ease: 'expo.out' }, 2.1);
	tl.fromTo('#hk2 .pb .hw', { opacity: 0, x: 160, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.55, ease: 'expo.out', stagger: 0.06 }, 2.1);
	// cartões: anti-horário a partir das 2 h, cada um girando levemente no anti-horário; o conjunto também gira
	qa('#hk2 .hchip').forEach((el, k) => {
		const r = Number(el.dataset.r);
		tl.fromTo(el, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.7, rotation: r + 16, filter: 'blur(10px)' }, { opacity: 1, scale: 1, rotation: r, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }, 1.5 + k * 0.1);
	});
	tl.fromTo('#hk2 .hcol', { rotation: 3 }, { rotation: -3, duration: 2.2, ease: 'none', transformOrigin: '50% 50%' }, 1.4);
	layer('hk3', 3.6, 4.9); words('#hk3 .hw', 3.6);
	// glow de cima: acende BEM GRANDE com "Certificado vencido" e diminui a cada troca de frase, até a troca na última
	tl.fromTo('.gt', { opacity: 0, scaleX: 1, scaleY: 0.1, transformOrigin: '50% 0%' }, { opacity: 1, scaleX: 1.35, scaleY: 1.9, duration: 1.1, ease: 'power3.out' }, 3.6);
	[[4.9, 1.2, 1.45], [6.2, 1.05, 1.05], [7.3, 0.95, 0.75]].forEach(([t, sx, sy]) => tl.to('.gt', { scaleX: sx, scaleY: sy, duration: 0.9, ease: 'power2.out' }, t));
	layer('hk4', 4.9, 6.2); words('#hk4 .hw', 5.0);
	tl.fromTo('#hk4 .hbr.l', { opacity: 0, x: -70 }, { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out' }, 4.9);
	tl.fromTo('#hk4 .hbr.r', { opacity: 0, x: 70 }, { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out' }, 4.9);
	layer('hk5', 6.2, 7.3); words('#hk5 .hw', 6.2);
	// "Money lit on fire": a linha é ancorada à esquerda no centro da tela; a cada palavra ela encolhe e corre
	// para a esquerda até recentrar (0,22 s), a palavra entra (a mesma entrada para todas) e o TEXTO pisca (flash de brilho).
	// Glow: o de cima vem aceso desde "Certificado vencido"; entre a 3ª e a 4ª palavra ele troca para o de baixo.
	// Na ÚLTIMA palavra ("embora.") todas piscam, a linha já aparece centralizada e dá o zoom out suave em torno do
	// centro (2026-09-30); o glow de baixo cresce junto, e a frase sai quando o zoom termina.
	layer('hk6', 7.3, 10.0);
	fade('.gt', '50% 0%', 8.4, 0.45);
	tl.fromTo('.gh', { opacity: 0, scaleY: 0.1, transformOrigin: '50% 100%' }, { opacity: 0.8, scaleY: 0.75, duration: 0.6, ease: 'power3.out' }, 8.45);
	tl.to('.gh', { opacity: 1, scaleY: 1.3, duration: 0.8, ease: 'power2.out' }, 8.7);
	fade('.gh', '50% 100%', 9.85, 0.6);
	const ml = q('#hk6 .mline'), mw = qa('#hk6 .mw'), S = [1.7, 1.35, 1.14], Z = 0.86; // Z = fim do zoom out da última palavra
	const right = (k) => mw[k].offsetLeft + mw[k].offsetWidth;
	tl.set(ml, { transformOrigin: '0% 50%', xPercent: 0, yPercent: -50, x: (-right(0) * S[0]) / 2, scale: S[0] }, 0).set(mw, { opacity: 0 }, 0);
	// entrada PADRÃO para as quatro palavras (2026-09-30: cada uma com um movimento diferente foi rejeitado)
	// origem na borda esquerda da palavra: ela cresce para a direita e não encosta na anterior durante a entrada
	const FX_IN = { opacity: 0, scale: 1.3, filter: 'blur(14px)', transformOrigin: '0% 55%' };
	const TW = [7.35, 7.8, 8.25, 8.7]; // 0,45 s entre as palavras; na 4ª o zoom out vai até 9,5 e a frase sai
	mw.forEach((w, k) => {
		const t = TW[k];
		// as palavras do meio recentralizam a linha com o corrido rápido de 0,22 s. Na ÚLTIMA não há corrido: no flash
		// (blink de todas as palavras) a linha já aparece centralizada, na escala em que estava, e dali só dá o zoom out
		// suave em torno do centro — com a origem à esquerda, x = −largura·escala/2 mantém o centro fixo (2026-09-30).
		const last = k === mw.length - 1;
		if (k && !last) tl.to(ml, { x: (-right(k) * S[k]) / 2, scale: S[k], duration: 0.22, ease: 'expo.out' }, t);
		if (last) {
			tl.set(ml, { x: (-right(k) * S[k - 1]) / 2, scale: S[k - 1] }, t);
			tl.to(ml, { x: (-right(k) * Z) / 2, scale: Z, duration: 0.9, ease: 'power2.out' }, t);
		}
		tl.fromTo(w, FX_IN, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.4, ease: 'expo.out' }, t);
		tl.fromTo(ml, { filter: 'brightness(2.6) drop-shadow(0 0 22px rgba(150,190,255,.95))' }, { filter: 'brightness(1) drop-shadow(0 0 0px rgba(150,190,255,0))', duration: 0.45, ease: 'power2.out' }, t + (k === mw.length - 1 ? 0 : 0.04)); // na última, o flash cai junto com o reposicionamento
	});
	return tl;
}
let HOOK_TL = null;
document.fonts.ready.then(() => {
	HOOK_TL = buildHook();
	(function hookTick() { const t = (elapsed() - __LEAD__) / 1000; HOOK_TL.time(Math.max(0, Math.min(HOOK_TL.duration(), t))); requestAnimationFrame(hookTick); })();
});
`
// Legendas entre os recortes (kc1..kc7, na ordem dos FRAGS_1MIN que têm legenda)
const KC = [
	['Um clique', 'dispara o BID'],
	['A IA compara', 'na mesma base'],
	['Ordem de compra', 'já enviada'],
	['Documentos', 'lidos pela IA'],
	['Vencendo?', 'A FS1 cobra'],
	['Vendas', 'no WhatsApp'],
	['Todo o time', 'ao vivo'],
]
// Sem chaves nas legendas (2026-09-30: repetidas em todas viravam ruído) — elas ficam só no Problema.
const kinCaps = KC.map(([a, b], k) => kin('kc' + (k + 1), a + ' ' + b, '', { bg: true, size: 96 })).join('')
// CTA: logo (bandeira em gradiente), o slogan sendo digitado e as duas saídas — Get in touch e a barra
// digitando o endereço. Sobe em cascata (.tc .w).
const ctaCard = darkCard(
	'cta {{c.close}}',
	`<div class="w" style="position:relative;display:flex">${wordmark(520, T.fg, 'flagGrad')}</div><p class="w" style="position:relative;margin:0 0 18px;font-family:${HEAD};font-size:40px;font-weight:500;letter-spacing:-.02em;color:${T.fg}"><span class="typ">Cote rápido. Compre melhor. Venda muito bem.</span></p><div class="w" style="position:relative;display:flex;align-items:center;gap:20px"><span style="display:inline-flex;align-items:center;gap:12px;height:64px;padding:0 30px 0 34px;border-radius:9999px;background:${T.fg};color:#000000;font-family:${HEAD};font-size:23px;font-weight:600;letter-spacing:-.01em;box-shadow:0 16px 36px -16px rgba(0,0,0,.5)">Get in touch${ico('ArrowRight', 22, 'bold')}</span><span style="position:relative;display:flex;align-items:center;justify-content:center;width:420px;height:64px;border-radius:9999px;background:#ffffff;border:1px solid ${T.border};box-shadow:0 12px 32px -14px rgba(0,0,0,.2)"><span style="position:absolute;left:22px;top:50%;transform:translateY(-50%);display:flex">${ico('MagnifyingGlass', 22, 'bold', `color:${T.mutedFg}`)}</span><span style="display:inline-flex;align-items:center;gap:6px"><span class="url" style="font-family:${MONO};font-size:22px;letter-spacing:0;color:${T.fg}">www.faradays.io</span><span class="caret" style="width:2px;height:28px;background:${T.fg}"></span></span></span></div>`
)

/* ---------------- instâncias externas: e-mail e WhatsApp do exportador, celular ---- */
// Vista dividida: o SISTEMA fica à esquerda, rotulado "FS1" (nome da ferramenta desde 2026-09-16); tudo que é do FORNECEDOR fica
// à direita, dentro de uma ZONA (painel de fundo levemente mais escuro, `zone`) com o rótulo "Fornecedor ·
// Exportador n" — dois mundos, sem traçar linha (2026-09-11; o tema escuro foi testado e descartado).
const OL = '#0f6cbd'
const mailRow = (from, subj, prev, hora, opts = {}) =>
	`<div class="${opts.cls ? 'vp ' + opts.cls : ''}" style="padding:10px 12px;border-bottom:1px solid #eeeeee;${opts.hot ? `background:#eaf3fc;border-left:3px solid ${OL};` : 'border-left:3px solid transparent;'}display:flex;flex-direction:column;gap:2px">
	<div style="display:flex;justify-content:space-between;gap:8px"><span style="font-size:12.5px;font-weight:${opts.hot ? 700 : 500}">${from}</span><span style="font-family:${MONO};font-size:10px;color:#7a7a7a">${hora}</span></div>
	<span style="font-size:12px;font-weight:${opts.hot ? 600 : 400};color:${opts.hot ? OL : '#333333'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${subj}</span>
	<span style="font-size:11px;color:#7a7a7a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${prev}</span>
</div>`
// As duas instâncias externas do cap. 1 dividem o mesmo lugar (1084,261 · 780×558), dentro da zona do fornecedor
// (painel 1048..1900; a janela do sistema encostada à esquerda, a 0,58, termina em x=992 — 56px de respiro).
const EXT_BOX = `position:absolute;left:1084px;top:261px;width:780px;height:558px;border-radius:12px;overflow:hidden;color:#0a0a0a;box-shadow:0 40px 100px -30px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.06);display:flex;flex-direction:column;font-family:${BODY};letter-spacing:.01em`
const zonePanel = `<div class="vf {{c.zone}}" style="position:absolute;left:1048px;top:88px;width:852px;height:762px;border-radius:20px;background:rgba(10,10,10,.045);box-shadow:inset 0 0 0 1px rgba(10,10,10,.08)"></div>`
const outlook = `<div class="sr {{c.outlook}}" style="${EXT_BOX};background:#ffffff">
	<div style="height:44px;flex-shrink:0;background:${OL};color:#fff;display:flex;align-items:center;gap:10px;padding:0 16px;font-size:13.33px">${ico('Envelope', 18, 'fill')}<span style="font-weight:600">Outlook</span><span style="opacity:.85">· EXPORTADOR 1</span><span style="padding:2px 8px;border-radius:9999px;background:rgba(255,255,255,.2);font-family:${MONO};font-size:10px;letter-spacing:.08em;text-transform:uppercase">fornecedor</span><span style="margin-left:auto;font-family:${MONO};font-size:11px;opacity:.85">Inbox</span></div>
	<div style="flex:1;min-height:0;display:flex">
		<div style="width:250px;flex-shrink:0;border-right:1px solid #e5e5e5;display:flex;flex-direction:column;overflow:hidden">
			<div style="padding:10px 12px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#7a7a7a;border-bottom:1px solid #eeeeee">Today</div>
			${mailRow('Faradays', 'BID CC-2026-012 — 3 items', 'Dear supplier, please find below our BID for FOB/CIF quotation…', '09:12', { hot: true, cls: '{{c.mailRow}}' })}
			${mailRow('COSCO Shipping', 'Booking confirmation — Qingdao/Santos', 'Your booking has been confirmed for vessel…', '08:40')}
			${mailRow('Customs broker', 'Documents for B/L draft', 'Please review the attached draft and confirm…', 'Yesterday')}
			${mailRow('Faradays', 'BID CC-2026-009 — closed', 'Thank you for your quotation. The BID was closed…', 'Yesterday')}
		</div>
		<div style="flex:1;min-width:0;display:flex;flex-direction:column">
			<div class="vf {{c.mailPane}}" style="flex:1;min-height:0;padding:18px 20px;display:flex;flex-direction:column;gap:10px;overflow:hidden">
				<span style="font-size:16px;font-weight:600;letter-spacing:0">BID CC-2026-012 — Faradays — 3 items</span>
				<div style="display:flex;align-items:center;gap:10px"><span style="display:grid;place-items:center;width:30px;height:30px;border-radius:9999px;background:${T.brand};color:#fff;font-size:12px;font-weight:600">F</span><div style="display:flex;flex-direction:column"><span style="font-size:12.5px;font-weight:600">Faradays</span><span style="font-size:11px;color:#7a7a7a">to: sales@exportador1.com · today 09:12</span></div></div>
				<div style="display:flex;flex-direction:column;gap:8px;font-size:12.5px;line-height:1.5;color:#222222">
					<span>Dear supplier, please find below our BID for FOB/CIF quotation.</span>
					<span style="font-family:${MONO};font-size:11.5px;color:#555555">PRODUTO 1 · 15000 KG (Container 1)<br>PRODUTO 2 · 5000 KG (Container 1)<br>PRODUTO 3 · 3000 KG (Container 2)</span>
					<span>Please reply in this thread with price, incoterm and payment terms.</span>
					<span style="display:flex;align-items:center;gap:6px;font-size:11px;color:#7a7a7a;border-top:1px solid #eeeeee;padding-top:8px">${ico('Robot', 13)}Automated message, read by AI — reply with price and commercial terms only.</span>
				</div>
			</div>
			<div class="vp {{c.reply}}" style="margin:0 16px 16px;flex-shrink:0;border:1px solid #e5e5e5;border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;color:#222222">
				<span style="font-size:11px;color:#7a7a7a">Reply · Faradays</span>
				<span class="vf tln {{c.t1}}">Dear Faradays team,</span>
				<span class="vf tln {{c.t2}}">PRODUTO 1 — <b>USD 4.85/KG FOB</b> Qingdao</span>
				<span class="vf tln {{c.t3}}">PRODUTO 2 — <b>USD 38.90/KG FOB</b> Qingdao</span>
				<span class="vf tln {{c.t4}}">Payment T/T 90 days · price validity 15 days</span>
				<div style="display:flex;justify-content:flex-end;margin-top:6px"><span style="display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 14px;border-radius:6px;background:${OL};color:#fff;font-size:12.5px;font-weight:600">${ico('PaperPlaneRight', 14, 'fill')}Send</span></div>
			</div>
		</div>
	</div>
</div>`
// envelope que sai do Send e voa para a janela do sistema
const mailFly = `<span class="mfly {{c.mailFly}}" style="position:absolute;left:0;top:0;transform:{{st.mailFly}};display:flex;color:${OL}">${ico('Envelope', 28, 'fill')}</span>`

const PH_SENT = '#d1f4d0', PH_RECV = '#ffffff'
// opts.dark = tema escuro do WhatsApp (instância do fornecedor); o celular do representante é claro.
const phBubble = (side, html, cls, hora, opts = {}) => {
	const sent = side === 'sent'
	const bg = opts.dark ? (sent ? '#005c4b' : '#202c33') : sent ? PH_SENT : PH_RECV
	const fg = opts.dark ? '#e9edef' : '#111111', sub = opts.dark ? '#8696a0' : '#6b6b6b', tick = opts.dark ? '#53bdeb' : '#3b8eff'
	return `<div class="vp ${cls}" style="display:flex;justify-content:${sent ? 'flex-end' : 'flex-start'}"><div style="position:relative;max-width:84%;border-radius:10px;padding:7px 10px;font-size:13px;line-height:1.4;background:${bg};color:${fg};box-shadow:0 1px 1px rgba(0,0,0,.08)">${opts.ia ? `<span style="display:flex;align-items:center;gap:4px;margin-bottom:3px;font-family:${MONO};font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap">${ico('Sparkle', 10, 'fill', 'color:#4aa8ff', 'ai-spark')}<span class="ai-shimmer">Agente IA · FS1</span></span>` : ''}${html}<span style="display:flex;justify-content:flex-end;align-items:center;gap:3px;margin-top:2px;font-size:10px;color:${sub}">${hora}${sent ? ico('Checks', 12, 'regular', `color:${tick}`) : ''}</span></div></div>`
}
const phFile = (nome, meta, extra = '') =>
	`<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;background:rgba(0,0,0,.05);${extra}">${ico('FilePdf', 24, 'fill', 'color:#d93025')}<div style="min-width:0;display:flex;flex-direction:column"><span style="font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${nome}</span><span style="font-size:10px;color:#6b6b6b">${meta}</span></div></div>`
const phTyping = (cls) =>
	`<div class="typing ${cls}" style="display:flex;justify-content:flex-start"><div style="display:flex;gap:4px;align-items:center;height:34px;padding:0 12px;border-radius:10px;background:${PH_RECV};box-shadow:0 1px 1px rgba(0,0,0,.08)"><span class="dot dk"></span><span class="dot dk"></span><span class="dot dk"></span></div></div>`
// Cartões do celular (2026-09-18): resumo do dia com projeção e relatório de faturamento (volume × faturamento), mocados.
const phCard = (rows, wrap = false) => `<div style="margin-top:6px;border-radius:8px;overflow:hidden;background:rgba(0,0,0,.045)">${rows.map(([l, v, ok], k) => `<div style="display:flex;flex-direction:column;gap:1px;padding:6px 10px;${k ? 'border-top:1px solid rgba(0,0,0,.08);' : ''}"><span style="font-size:10.5px;color:#6b6b6b">${l}</span><span style="font-family:${MONO};font-size:${wrap ? '11.5px' : '12.5px'};line-height:1.35;font-weight:600;color:${ok ? T.green700 : '#111111'};font-variant-numeric:tabular-nums;white-space:${wrap ? 'normal' : 'nowrap'}">${v}</span></div>`).join('')}</div>`
const miniBars = (titulo, serie, max, cor) =>
	`<div style="display:flex;flex-direction:column;gap:5px"><span style="display:block;min-height:24px;font-family:${MONO};font-size:9.5px;line-height:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b6b6b">${titulo}</span>${serie.map(([m, txt, v]) => `<div style="display:flex;align-items:center;gap:6px"><span style="width:22px;font-family:${MONO};font-size:9.5px;color:#6b6b6b">${m}</span><span style="flex:1;height:8px;border-radius:4px;background:rgba(0,0,0,.07);overflow:hidden"><span style="display:block;height:100%;width:${Math.round((v / max) * 100)}%;border-radius:4px;background:${cor}"></span></span><span style="width:30px;text-align:right;font-family:${MONO};font-size:10px;font-weight:600;font-variant-numeric:tabular-nums">${txt}</span></div>`).join('')}</div>`
const phRelatorio = `<div style="margin-top:6px;border-radius:8px;background:rgba(0,0,0,.045);padding:8px 10px;display:flex;flex-direction:column;gap:8px">
	<span style="font-family:${MONO};font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:#6b6b6b">Relatório de faturamento · jun–set/2026 · Carlos Mendes</span>
	<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${miniBars('Volume<br>(t)', [['jun', '31', 31], ['jul', '35', 35], ['ago', '38', 38], ['set', '42', 42]], 42, T.brand)}${miniBars('Faturamento<br>(R$ mi)', [['jun', '1,02', 1.02], ['jul', '1,18', 1.18], ['ago', '1,31', 1.31], ['set', '1,42', 1.42]], 1.42, T.green600)}</div>
</div>`
// Segunda conversa, LIMPA (pedido de 2026-09-18): no horário configurado a FS1 manda o resumo do dia com projeção — para o
// representante e, consolidado, para o gestor — e, se ele pedir, o relatório de volume e faturamento.
const chat2 = `		<div class="chat vf {{c.chatB}}" style="position:absolute;inset:0;padding:12px;display:flex;flex-direction:column;gap:8px;--g:8px;overflow:hidden">
			<div style="align-self:center"><span style="display:inline-block;padding:3px 10px;border-radius:9999px;background:#ffffff;font-size:10.5px;color:#6b6b6b;box-shadow:0 1px 1px rgba(0,0,0,.06)">Hoje</span></div>
			${phBubble('recv', `${MSG.resumo}${phCard(MSG.resumoRows)}<span style="display:block;margin-top:6px;font-size:11px;color:#6b6b6b">${MSG.resumoNota}</span>`, '{{c.rs1}}', '17:40', { ia: true })}
			${phBubble('sent', MSG.pedeRel, '{{c.rs2}}', '17:42')}
			${phTyping('{{c.rt}}')}
			${phBubble('recv', `${MSG.segueRel}${phRelatorio}${phFile(MSG.pdfRel[0], MSG.pdfRel[1], 'margin-top:6px')}`, '{{c.rs3}}', '17:42', { ia: true })}
		</div>`
// Terceira conversa (2026-09-21): o GESTOR DE COMPRAS comanda o BID pelo WhatsApp — pergunta o status, pede um BID novo,
// recebe a prévia e confirma com "sim". Vive no CAP. 1, entre a cena da OC e a Internacional × Local, com o celular sobre
// o véu escuro da OC (mesmo celular do cap. 3; c.phone/st.phone ganham as paradas botIn/botOut).
const chat3 = `		<div class="chat vf {{c.chatC}}" style="position:absolute;inset:0;padding:12px;display:flex;flex-direction:column;gap:8px;--g:8px;overflow:hidden">
			<div style="align-self:center"><span style="display:inline-block;padding:3px 10px;border-radius:9999px;background:#ffffff;font-size:10.5px;color:#6b6b6b;box-shadow:0 1px 1px rgba(0,0,0,.06)">Hoje · gestor de compras</span></div>
			${phBubble('sent', MSG.bidNew, '{{c.b1}}', '10:12')}
			${phTyping('{{c.bt1}}')}
			${phBubble('recv', `${MSG.bidPrev}${phCard(MSG.bidPrevRows, true)}<span style="display:block;margin-top:6px">${MSG.bidAsk}</span>`, '{{c.b2}}', '10:12', { ia: true })}
			${phBubble('sent', MSG.bidYes, '{{c.b3}}', '10:13')}
			${phTyping('{{c.bt2}}')}
			${phBubble('recv', `<span style="display:flex;align-items:flex-start;gap:6px">${ico('CheckCircle', 16, 'fill', `color:${T.green600};flex-shrink:0;margin-top:2px`)}<span>${MSG.bidGo}</span></span><span class="aiburst" style="right:4px;top:4px"></span>`, '{{c.b4}}', '10:13', { ia: true })}
			${phBubble('sent', MSG.bidQ, '{{c.b5}}', '10:14')}
			${phTyping('{{c.bt3}}')}
			${phBubble('recv', `${MSG.bidSt}${phCard(MSG.bidStRows, true)}`, '{{c.b6}}', '10:14', { ia: true })}
		</div>`
// Áudio enviado pelo representante: onda + duração + transcrição (a IA transcreve).
const phAudio = (cls, hora) =>
	`<div class="vp ${cls}" style="display:flex;justify-content:flex-end"><div style="position:relative;max-width:88%;border-radius:10px;padding:8px 10px 6px;background:${PH_SENT};color:#111111;box-shadow:0 1px 1px rgba(0,0,0,.08)">
		<div style="display:flex;align-items:center;gap:8px">${ico('Play', 16, 'fill', 'color:#54656f')}${waveform('#7b8a92', 20)}<span style="font-size:11px;color:#6b6b6b;font-variant-numeric:tabular-nums">0:07</span></div>
		<div style="margin-top:6px;padding-top:6px;border-top:1px solid rgba(0,0,0,.08);font-size:12.5px;line-height:1.4;color:#3b3b3b"><span style="display:flex;align-items:center;gap:4px;margin-bottom:2px;font-family:${MONO};font-size:9.5px;letter-spacing:.08em;text-transform:uppercase">${ico('Sparkle', 10, 'fill', 'color:#4aa8ff', 'ai-spark')}<span class="ai-shimmer">transcrição</span></span>${MSG.audio}</div>
		<span style="display:flex;justify-content:flex-end;align-items:center;gap:3px;margin-top:2px;font-size:10px;color:#6b6b6b">${hora}${ico('Checks', 12, 'regular', 'color:#3b8eff')}</span>
	</div></div>`

// WhatsApp do EXPORTADOR 2 (WhatsApp Business): recebe o BID e responde com preço — o segundo canal de resposta.
const waExp = `<div class="sr {{c.waExp}}" style="${EXT_BOX};background:#efeae2">
	<div style="height:56px;flex-shrink:0;background:#ffffff;border-bottom:1px solid #e5e5e5;display:flex;align-items:center;gap:12px;padding:0 16px">
		<span style="display:grid;place-items:center;width:36px;height:36px;border-radius:9999px;background:rgba(37,211,102,.15)">${waGreenSvg(20)}</span>
		<div style="display:flex;flex-direction:column"><span style="font-size:14px;font-weight:600">Faradays · Compras</span><span style="font-size:11px;color:#6b6b6b">+55 11 4002-8922 · BID CC-2026-012</span></div>
		<span style="padding:2px 8px;border-radius:9999px;background:rgba(37,211,102,.15);color:#0b7a3b;font-family:${MONO};font-size:10px;letter-spacing:.08em;text-transform:uppercase">exportador 2</span>
		<span style="margin-left:auto;font-family:${MONO};font-size:11px;color:#6b6b6b">WhatsApp Business</span>
	</div>
	<div class="chat" style="flex:1;min-height:0;padding:16px 20px;display:flex;flex-direction:column;gap:10px;--g:10px;overflow:hidden">
		<div style="align-self:center"><span style="display:inline-block;padding:3px 10px;border-radius:9999px;background:#ffffff;font-size:10.5px;color:#6b6b6b;box-shadow:0 1px 1px rgba(0,0,0,.06)">Today</span></div>
		${phBubble('recv', `<b>BID CC-2026-012 — Faradays — 3 items</b><br><span style="font-family:${MONO};font-size:11.5px;color:#555555">PRODUTO 1 · 15000 KG (Container 1)<br>PRODUTO 2 · 5000 KG (Container 1)<br>PRODUTO 3 · 3000 KG (Container 2)</span><br>Please reply here with price, incoterm and payment terms. Ref. <span style="font-family:${MONO}">BID-4F7A2C</span>`, '', '09:12')}
		${phBubble('sent', `PRODUTO 1 — <b>USD 5.02/KG CIF</b> Santos<br>Payment T/T 30 days · validity 10 days`, '{{c.waMsg}}', '09:31')}
	</div>
	<div style="flex-shrink:0;padding:10px 16px 14px;display:flex;align-items:center;gap:8px;background:#f0f2f5">
		<span style="flex:1;display:flex;align-items:center;height:40px;padding:0 14px;border-radius:9999px;background:#ffffff;font-size:13px;color:#8a8a8a">Type a message</span>
		<span style="display:grid;place-items:center;width:40px;height:40px;border-radius:9999px;background:#25d366;color:#fff">${ico('PaperPlaneRight', 18, 'fill')}</span>
	</div>
</div>`
// logo do WhatsApp que sai do botão de enviar e voa para a janela do sistema
const waFly = `<span class="mfly {{c.waFly}}" style="position:absolute;left:0;top:0;transform:{{st.waFly}};display:flex">${waGreenSvg(30)}</span>`

// Celular do representante (390×780). Posição de repouso = (1310,150); o transform st.phone o centraliza
// ampliado na fase A e o leva para a direita, a 1,2, na fase B (sistema ao lado). As mensagens ancoram
// embaixo (.chat) e as futuras não ocupam espaço — como no WhatsApp, a conversa "rola".
const phone = `<div class="ph {{c.phone}}" style="position:absolute;left:1310px;top:150px;width:390px;height:780px;transform:{{st.phone}};transform-origin:0 0;border-radius:44px;background:#0f0f0e;padding:12px;box-shadow:0 40px 100px -30px rgba(0,0,0,.4),0 0 0 1px rgba(0,0,0,.08)">
	<div style="position:relative;width:100%;height:100%;border-radius:34px;overflow:hidden;background:#f0f2f5;display:flex;flex-direction:column;font-family:${BODY};color:#111111">
		<div style="height:26px;flex-shrink:0;background:#ffffff"></div>
		<div style="height:60px;flex-shrink:0;background:#ffffff;border-bottom:1px solid #e5e5e5;display:flex;align-items:center;gap:10px;padding:0 14px">
			<span style="display:grid;place-items:center;width:36px;height:36px;border-radius:9999px;background:rgba(37,211,102,.15)">${waGreenSvg(20)}</span>
			<div style="display:flex;flex-direction:column;flex:1;min-width:0"><span style="font-size:14px;font-weight:600">Faradays</span><span style="position:relative;height:15px;font-size:11px;line-height:15px"><span class="vf q {{c.phOn}}" style="position:absolute;left:0;top:0;display:flex;align-items:center;gap:4px;color:#6b6b6b;white-space:nowrap">${ico('Sparkle', 10, 'fill', 'color:#4aa8ff', 'ai-spark')}<span class="ai-shimmer">Agente IA · FS1 · responde na hora</span></span><span class="vf q {{c.phTyp}}" style="position:absolute;left:0;top:0;white-space:nowrap"><span class="ai-shimmer">digitando…</span></span></span></div>
		</div>
		<div style="position:relative;flex:1;min-height:0">
		<div class="chat vf {{c.chatA}}" style="position:absolute;inset:0;padding:12px;display:flex;flex-direction:column;gap:8px;--g:8px;overflow:hidden">
			<div style="align-self:center"><span style="display:inline-block;padding:3px 10px;border-radius:9999px;background:#ffffff;font-size:10.5px;color:#6b6b6b;box-shadow:0 1px 1px rgba(0,0,0,.06)">Hoje</span></div>
			${phAudio('{{c.p1}}', '09:41')}
			${phTyping('{{c.pt1}}')}
			${phBubble('recv', `${MSG.entendi}${quoteCard(false)}`, '{{c.p2}}', '09:41', { ia: true })}
			${phBubble('sent', MSG.confirma, '{{c.p3}}', '09:42')}
			${phTyping('{{c.pt2}}')}
			${phBubble('recv', `${MSG.emitida}${phFile(MSG.pdfCot[0], MSG.pdfCot[1], 'margin-top:6px')}<span class="aiburst" style="right:4px;top:4px"></span>`, '{{c.p4}}', '09:42', { ia: true })}
			${phBubble('sent', MSG.pede, '{{c.p5}}', '09:44')}
			${phTyping('{{c.pt3}}')}
			${phBubble('recv', `${MSG.segue}${phFile(MSG.pdfCoa[0], MSG.pdfCoa[1], 'margin-top:6px')}${phFile(MSG.pdfNf[0], MSG.pdfNf[1], 'margin-top:6px')}`, '{{c.p6}}', '09:44', { ia: true })}
			${phBubble('sent', MSG.pedeFicha, '{{c.p7}}', '09:46')}
			${phTyping('{{c.pt4}}')}
			${phBubble('recv', `${MSG.segueFicha}${phFile(MSG.pdfFicha[0], MSG.pdfFicha[1], 'margin-top:6px')}`, '{{c.p8}}', '09:46', { ia: true })}
			${phBubble('sent', MSG.pedeNf, '{{c.p9}}', '09:48')}
			${phTyping('{{c.pt5}}')}
			${phBubble('recv', `${MSG.segueNf}${phCard(MSG.nfRows)}`, '{{c.p10}}', '09:48', { ia: true })}
		</div>
${chat2}
${chat3}
		</div>
		<div style="flex-shrink:0;padding:8px 10px 14px;display:flex;align-items:center;gap:8px">
			<span style="flex:1;display:flex;align-items:center;height:40px;padding:0 14px;border-radius:9999px;background:#ffffff;font-size:13px;color:#8a8a8a">Mensagem</span>
			<span style="display:grid;place-items:center;width:40px;height:40px;border-radius:9999px;background:#25d366;color:#fff">${ico('Microphone', 18, 'fill')}</span>
		</div>
		<div class="vf siri {{c.glow}}" style="position:absolute;inset:0;border-radius:34px;pointer-events:none;z-index:6">
			<span class="siri-ring r1"><span class="siri-spin"></span></span>
			<span class="siri-ring r2"><span class="siri-spin"></span></span>
		</div>
	</div>
</div>`

/* ---------------- legendas fora da câmera (caps. 1 e 3) ------------------ */
// Legenda solta: overline em mono (opcional — vazio omite) + texto grande.
const cap = (cls, over, text, place, size = 46) =>
	`<div class="cap ${cls}" style="position:absolute;${place};display:flex;flex-direction:column;gap:${size > 40 ? 18 : 12}px">
	${over ? `<span style="font-family:${MONO};font-size:15px;letter-spacing:.18em;text-transform:uppercase;color:${T.brand}">${over}</span>` : ''}
	<p style="margin:0;font-family:${HEAD};font-size:${size}px;line-height:1.12;letter-spacing:-.02em;font-weight:600;color:${T.fg}">${text}</p>
</div>`
// Cap. 3, fase A — timeline de legendas à esquerda do celular: cada passo entra (ponto + texto) e
// FICA; quando o seguinte entra, o anterior esmaece (.past) e um trilho fino liga os dois pontos.
// A pilha cresce para baixo a partir de y=330 e sai inteira quando o sistema entra (toSys).
const CAP_STEPS = [
	'A IA entende a solicitação por áudio, texto ou foto.',
	'Responde com preço de tabela, último cotado, último faturado, lead time e crédito — e marca em vermelho o que trava o pedido.',
	'Ajustou? A cotação sai na hora, com ICMS e câmbio do dia.',
	'Pediu COA, NF, boleto ou ficha técnica? A IA manda na hora.',
	'Rastreio de uma NF? Ela consulta e responde no mesmo chat.'
]
// Conversa limpa do resumo (2026-09-18): a timeline RESETA — a de cima sai inteira em chatB e esta começa do zero.
const CAP_STEPS2 = [
	'Resumo do dia e projeção, no horário que você escolher — para o representante e, consolidado, para o gestor.',
	'Relatório de volume e faturamento? No mesmo chat, com o PDF.'
]
const capStep = (text, k) => `<div class="cti {{c.cap${k + 1}}}"><span class="cti-dot"></span><p>${text}</p></div>`
const capTimeline = `<div class="ctl" style="position:absolute;left:110px;top:218px;width:540px;display:flex;flex-direction:column;gap:28px">${CAP_STEPS.map(capStep).join('')}</div>`
const capTimeline2 = `<div class="ctl" style="position:absolute;left:110px;top:400px;width:540px;display:flex;flex-direction:column;gap:28px">${CAP_STEPS2.map((t, k) => capStep(t, k + CAP_STEPS.length)).join('')}</div>`
// Cap. 1, BID pelo WhatsApp (2026-09-21): timeline própria à esquerda do celular, em BRANCO sobre o véu escuro da OC.
const CAP_STEPS3 = [
	'Gestor de compras? Crie um BID por aqui — a FS1 mostra a prévia e só dispara com o seu “sim”.',
	'Depois peça o comparativo: ela responde com as melhores por produto e as ordens de compra.'
]
const capsBot = `<div class="ctl dark" style="position:absolute;left:110px;top:300px;width:540px;display:flex;flex-direction:column;gap:28px">${CAP_STEPS3.map((t, k) => `<div class="cti {{c.bc${k + 1}}}"><span class="cti-dot"></span><p>${t}</p></div>`).join('')}</div>`
const EXT_CAP = 'left:1084px;top:118px;width:780px'
const caps = [
	capTimeline,
	capTimeline2,
	// cap. 1, vista dividida: quem é quem (e-mail, depois WhatsApp do exportador)
	cap('{{c.capE1}}', 'Fornecedor · Exportador 1', 'O exportador recebe o BID na caixa dele e responde ali mesmo.', EXT_CAP, 34),
	cap('{{c.capE2}}', 'Fornecedor · Exportador 2', 'Outro exportador responde pelo WhatsApp. A IA lê os dois.', EXT_CAP, 34),
	// rótulo do lado do sistema, acima da janela encostada à esquerda
	`<div class="cap {{c.capSys}}" style="position:absolute;left:64px;top:222px"><span style="font-family:${MONO};font-size:15px;letter-spacing:.18em;text-transform:uppercase;color:${T.brand}">FS1 · Compras</span></div>`
].join('')
// Véu do comparativo (depois do zoom out): a ação para, uma faixa com gradiente escuro SOBE pela parte de
// baixo da prancha com a legenda centralizada, espera, desce e a ação continua (pedido de 2026-09-12).
const veilBox = (hole, text) => `<div class="veil ${hole}"><div class="veil-t"><p style="margin:0;font-family:${HEAD};font-size:44px;line-height:1.15;letter-spacing:-.02em;font-weight:600;color:#ffffff;max-width:1640px">${text}</p></div></div>`
// Cena INTERNACIONAL × LOCAL (2026-09-20, 4ª apresentação — pedido: "comparação lado a lado, algo mais simples
// que possa ser entendido em uma visualização"). Dois recibos espelhados, um por mercado, com a MESMA
// estrutura em três blocos: O QUE ELE COTOU → O QUE A FS1 AJUSTA → A RÉGUA. Um número grande por linha; as
// linhas acendem em pares (esquerda e direita juntas), a régua fecha em azul. Sem tabela, sem troca de tela.
const mkLbl = (t) => `<span style="font-family:${MONO};font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${T.mutedFg}">${t}</span>`
const mkLine = (hole, l, sub, v, un, tone = '') =>
	`<div class="mks {{c.${hole}}}${tone ? ' ' + tone : ''}" style="display:flex;align-items:center;gap:16px;padding:14px 18px;border-radius:12px">
		<span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><span style="font-size:19px;font-weight:600;letter-spacing:-.01em">${l}</span>${sub ? `<span style="font-size:13.5px;color:${T.mutedFg}">${sub}</span>` : ''}</span>
		<span style="display:flex;align-items:baseline;gap:6px;white-space:nowrap"><span class="mkv" style="font-family:${MONO};font-size:30px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.01em">${v}</span><span style="font-family:${MONO};font-size:13px;color:${T.mutedFg}">${un}</span></span>
	</div>`
const mkSec = (hole, t) => `<div class="mks {{c.${hole}}}" style="padding:10px 18px 0">${mkLbl(t)}</div>`
const mkCard = (tone, mercado, sub, icon, linhas, cls) =>
	`<div class="mkc ${cls}" style="flex:1;display:flex;flex-direction:column;gap:4px;padding:22px 16px 18px;border-radius:18px;background:${T.card};box-shadow:0 30px 80px -30px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.06)">
		<div style="display:flex;align-items:center;gap:12px;padding:0 18px 10px"><span style="display:grid;place-items:center;width:40px;height:40px;border-radius:11px;background:${T.muted};color:${T.fg}">${ico(icon, 22, 'fill')}</span><span style="display:flex;flex-direction:column;gap:2px"><span style="display:flex;align-items:center;gap:8px;font-family:${HEAD};font-size:24px;font-weight:600;letter-spacing:-.015em">${mercado}${badge(tone, sub)}</span></span></div>
		${linhas}
	</div>`
const mkToggle = `<span class="mktg"><span class="knob"></span><span class="lbl a">Internacional</span><span class="lbl b">Local</span></span>`
const mkt = `<div class="mkt vf {{c.mkt}}" style="position:absolute;inset:0;background:${STAGE};display:flex;flex-direction:column;align-items:center;padding-top:84px">
	<div class="vf {{c.mkHead}}" style="display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center"><p style="margin:0;font-family:${HEAD};font-size:56px;line-height:1.05;letter-spacing:-.025em;font-weight:600;color:${T.fg}">Cotação local e internacional na mesma plataforma.</p><p style="margin:0;font-size:22px;color:${T.mutedFg}">A IA entende todo tipo de cotação e os custos/impostos envolvidos.</p><div style="display:flex;margin-top:14px">${mkToggle}</div></div>
	<div class="vf {{c.mkCards}}" style="display:flex;gap:28px;width:1560px;margin-top:38px">
		${mkCard('neutral', 'Internacional', 'exportador · USD/kg', 'Globe',
			mkSec('mk1', 'O que ele cotou') + mkLine('mk1', 'Preço FOB', 'como veio na resposta', '4,85', 'USD/kg') +
			mkSec('mk2', 'O que a FS1 ajusta') + mkLine('mk2', '+ frete da premissa', 'da origem até Santos → vira CIF', '+ 0,14', 'USD/kg') + mkLine('mk3', '+ prazo de pagamento', '90 dias é a base — sem custo financeiro', '+ 0,00', 'USD/kg') +
			mkSec('mkR', 'A régua') + mkLine('mkR', 'CIF com custo financeiro', 'é por este número que a IA compara', '4,99', 'USD/kg', 'regua'), 'i')}
		${mkCard('info', 'Local', 'fornecedor nacional · R$/kg', 'Factory',
			mkSec('mk1', 'O que ele cotou') + mkLine('mk1', 'Preço cheio', 'com os impostos dentro', '31,90', 'R$/kg') +
			mkSec('mk2', 'O que a FS1 desconta') + mkLine('mk2', '− ICMS 18%', 'crédito · SP', '− 5,74', 'R$/kg') + mkLine('mk3', '− PIS/COFINS 9,25%', 'crédito · o IPI fica fora', '− 2,42', 'R$/kg') +
			mkSec('mkR', 'A régua') + mkLine('mkR', 'NET por kg', 'é por este número que a IA compara', '23,74', 'R$/kg', 'regua'), 'l')}
	</div>
	<div class="vf {{c.mkFoot}}" style="display:flex;align-items:center;gap:10px;margin-top:30px">${ico('Sparkle', 22, 'fill', 'color:#4aa8ff', 'ai-spark')}<span style="font-size:23px;color:${T.fg}">Você escolhe o tipo de cotação e <span class="ai-shimmer" style="font-weight:600">a IA entende a lógica</span>.</span></div>
</div>`

// O véu de uma frase do comparativo, de volta ao seu lugar (2026-09-18): a tela Internacional × Local passou para DEPOIS de fechar a cotação.
const veil = veilBox('{{c.veil}}', 'A IA compara na mesma base e aponta, em cada produto, o melhor FOB, o melhor CIF e o melhor preço considerando o custo financeiro.')
// Visão Geral: a mesma faixa, depois das mensagens ao vivo
const veil2 = veilBox('{{c.veil2}}', 'Todas as conversas dos representantes, em tempo real.')

/* ---------------- CSS -------------------------------------------------- */
// Só no corte de 1 min: tipografia cinética, colagem, inclinação 3D dos recortes, barra de progresso e CTA.
const CSS_1MIN = `.tc .opP{visibility:hidden}
.q.qb,.dock{display:none !important}
@keyframes kIn{0%{opacity:0;filter:blur(16px);transform:translateY(16px) scale(1.06)}100%{opacity:1;filter:blur(0);transform:none}}
.vf.kin{transition:opacity .3s var(--ease),filter .3s var(--ease)}
.vf.kin.exit{filter:blur(10px)}
.kin .kw{display:inline-block;opacity:0}
.kin.show .kw,.kin.exit .kw{animation:kIn .6s var(--ease) both}
.brw{display:inline-flex;align-items:center;gap:.22em}
.brc{display:inline-block;font-weight:300;font-size:1.3em;line-height:1;color:${T.mutedFg};opacity:0;transform:translateY(-.06em)}
@keyframes brL{0%{opacity:0;transform:translate(-70px,-.06em)}100%{opacity:1;transform:translateY(-.06em)}}
@keyframes brR{0%{opacity:0;transform:translate(70px,-.06em)}100%{opacity:1;transform:translateY(-.06em)}}
.kin.show .brc.l,.kin.exit .brc.l{animation:brL .7s var(--ease) both}
.kin.show .brc.r,.kin.exit .brc.r{animation:brR .7s var(--ease) both}
.chip{position:absolute;display:inline-flex;align-items:center;gap:10px;padding:16px 24px;border-radius:14px;background:#ffffff;border:1px solid ${T.border};box-shadow:0 18px 40px -20px rgba(0,0,0,.28);font-size:24px;color:${T.fg};white-space:nowrap;opacity:0;transform:translate(-50%,-50%) rotate(var(--r))}
@keyframes chipIn{0%{opacity:0;filter:blur(10px);transform:translate(-50%,-50%) rotate(var(--r)) scale(.7)}100%{opacity:1;filter:blur(0);transform:translate(-50%,-50%) rotate(var(--r)) scale(1)}}
@keyframes chipDrift{0%{translate:0 0}100%{translate:0 -18px}}
.kin.show .chip,.kin.exit .chip{animation:chipIn .6s var(--ease) both,chipDrift 2.4s ease-in-out both}
.tilt{position:absolute;inset:0;transform-origin:50% 55%}
/* com a inclinação, o que espera fora do quadro (e-mail/WhatsApp do fornecedor, painel do drive) entraria pelas bordas */
.sr.pre,.sr.exit,.sl.pre,.sl.exit{visibility:hidden}
.tilt.ta{animation:tiltA 7s cubic-bezier(.2,.7,.2,1) both}
.tilt.tb{animation:tiltB 7s cubic-bezier(.2,.7,.2,1) both}
@keyframes tiltA{0%{transform:perspective(2600px) rotateX(14deg) rotateY(-12deg) scale(.84)}100%{transform:perspective(2600px) rotateX(4deg) rotateY(-3deg) scale(.94)}}
@keyframes tiltB{0%{transform:perspective(2600px) rotateX(12deg) rotateY(12deg) scale(.84)}100%{transform:perspective(2600px) rotateX(3deg) rotateY(3deg) scale(.94)}}
.typ{display:inline-block;clip-path:inset(0 100% 0 0)}
.tc.show .typ{animation:typ 1.5s steps(42,end) .7s forwards}
@keyframes typ{to{clip-path:inset(0 0 0 0)}}
.tc.cta.show .url{animation-delay:2.4s}
.kin h1{text-shadow:0 0 42px rgba(90,150,255,.35)}
.gfx{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;overflow:hidden}
.gb{position:absolute;left:0;top:0;transition:transform 2s var(--ease),opacity 2s var(--ease)}
.gb i{position:absolute;inset:0;border-radius:50%;filter:blur(50px)}
.ga{width:960px;height:600px}
.ga i{background:radial-gradient(closest-side,rgba(40,110,255,.9),rgba(29,106,229,.35) 55%,transparent);animation:gdA 9s ease-in-out infinite alternate}
.gbb{width:820px;height:820px}
.gbb i{background:radial-gradient(closest-side,rgba(56,189,248,.55),rgba(29,106,229,.2) 55%,transparent);animation:gdB 11s ease-in-out infinite alternate}
.gh,.gt{width:1900px;height:520px;left:10px;transition:none;opacity:0}
.gh{top:620px}.gt{top:-60px}
.gh i{border-radius:50% 50% 0 0/100% 100% 0 0;background:radial-gradient(ellipse 55% 70% at 50% 100%,rgba(40,110,255,1),rgba(29,106,229,.45) 50%,transparent 80%);filter:blur(34px);animation:gdH 6s ease-in-out infinite alternate}
.gt i{position:absolute;inset:0;border-radius:0 0 50% 50%/0 0 100% 100%;background:radial-gradient(ellipse 55% 70% at 50% 0%,rgba(40,110,255,1),rgba(29,106,229,.45) 50%,transparent 80%);filter:blur(34px);animation:gdH 6s ease-in-out infinite alternate}
@keyframes gdA{0%{transform:translate(0,0) scale(1)}100%{transform:translate(90px,40px) scale(1.12)}}
@keyframes gdB{0%{transform:translate(0,0) scale(1.05)}100%{transform:translate(-80px,-50px) scale(.92)}}
@keyframes gdH{0%{opacity:.75;transform:scaleX(.92)}100%{opacity:1;transform:scaleX(1.04)}}
.g0 .ga{transform:translate(480px,-360px);opacity:0}.g0 .gbb{transform:translate(1450px,560px);opacity:0}
.g1 .ga{transform:translate(-280px,-300px)}.g1 .gbb{transform:translate(1380px,520px)}
.g2 .ga{transform:translate(1240px,-340px)}.g2 .gbb{transform:translate(-380px,480px)}
.g3 .ga{transform:translate(-320px,620px)}.g3 .gbb{transform:translate(1460px,-360px)}
.g4 .ga{transform:translate(480px,-330px)}.g4 .gbb{transform:translate(-300px,560px)}
.hook{position:absolute;inset:0;pointer-events:none}
.hl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0}
.kh{${KIN_H};position:relative;font-size:104px;text-shadow:0 0 42px rgba(90,150,255,.35)}
.kh .hw,.kh .mw,.kh .hbr{display:inline-block}
.hbr{font-weight:300;font-size:1.3em;line-height:1;color:${T.mutedFg};transform:translateY(-.06em)}
.mline{position:absolute;left:50%;top:50%;display:block;margin:0}
.mline .mw{margin-right:.26em}
.hcol{position:absolute;inset:0}
.hchip{position:absolute;display:inline-flex;align-items:center;gap:10px;padding:16px 24px;border-radius:14px;background:#ffffff;border:1px solid ${T.border};box-shadow:0 18px 40px -20px rgba(0,0,0,.28);font-size:24px;color:${T.fg};white-space:nowrap;opacity:0}`
const css = `${CURTO ? CSS_1MIN : ""}
@font-face{font-family:Aspekta;src:url(data:font/woff2;base64,${ASPEKTA}) format('woff2');font-weight:100 900;font-display:swap}
:root{--ease:cubic-bezier(.625,.05,0,1)}
body{margin:0;background:${T.bg}}
a{color:${T.brand}}a:hover{color:${T.blue700}}
.stage *{box-sizing:border-box}
/* fade puro — cartelas, janela do app, badges */
.vf{transition:opacity .7s var(--ease)}
.vf.pre{opacity:0;transition:none;pointer-events:none}
.vf.show{opacity:1}
.vf.exit{opacity:0;pointer-events:none}
.vf.q{transition-duration:.25s}
.vf.tln{transition-duration:.3s}
/* pop — modais, cards-eco, balões */
.vp{transition:transform .5s var(--ease),opacity .4s var(--ease)}
.vp.pre{opacity:0;transform:scale(.96) translateY(8px);transition:none;pointer-events:none}
.vp.show{opacity:1;transform:none}
.vp.exit{opacity:0;transform:scale(.98);pointer-events:none}
/* slide lateral sem fade — painel do SharePoint */
.sl{transition:transform .85s var(--ease)}
.sl.pre{transform:translateX(-620px);transition:none}
.sl.show{transform:translateX(0)}
.sl.exit{transform:translateX(-620px)}
/* slide pela direita — e-mail do exportador e celular */
.sr{transition:transform .9s var(--ease)}
.sr.pre{transform:translateX(900px);transition:none}
.sr.show{transform:translateX(0)}
.sr.exit{transform:translateX(900px)}
/* celular do cap. 3: posição vem de st.phone; aqui só o fade */
.ph{transition:transform 1.1s var(--ease),opacity .6s var(--ease)}
.ph.pre{opacity:0;transition:none}
.ph.show{opacity:1}
.ph.exit{opacity:0}
/* legendas laterais */
.cap{opacity:0;transform:translateY(28px);transition:transform .8s var(--ease),opacity .6s var(--ease);pointer-events:none}
.cap.show{opacity:1;transform:none}
.cap.exit{opacity:0;transform:translateY(-20px)}
/* timeline de legendas do cap. 3: ponto de 14px (gradiente de IA no passo ativo; cinza nos
   anteriores) + texto 36px; o trilho de 2px nasce do ponto do passo anterior (.past) e desce até
   o ponto do seguinte (28px de gap + 14px até o centro da 1ª linha). Sai inteira no toSys. */
.cti{position:relative;display:grid;grid-template-columns:14px 1fr;column-gap:26px;align-items:start;opacity:0;transform:translateY(24px);transition:transform .8s var(--ease),opacity .6s var(--ease);pointer-events:none}
.cti.show,.cti.past{opacity:1;transform:none}
.cti.exit{opacity:0;transform:translateY(-16px)}
.cti p{margin:0;font-family:${HEAD};font-size:36px;line-height:1.15;letter-spacing:-.02em;font-weight:600;color:${T.fg};transition:color .6s var(--ease)}
.cti.past p{color:rgba(10,10,10,.38)}
.cti-dot{position:relative;width:14px;height:14px;margin-top:14px;border-radius:9999px;background:linear-gradient(135deg,#1d6ae5,#38bdf8,#7c8cf8);box-shadow:0 0 0 6px rgba(56,189,248,.16);transition:background .6s var(--ease),box-shadow .6s var(--ease)}
.cti.past .cti-dot{background:rgba(10,10,10,.26);box-shadow:none}
.cti::after{content:"";position:absolute;left:6px;top:34px;bottom:-36px;width:2px;background:rgba(10,10,10,.14);opacity:0;transform:scaleY(0);transform-origin:top;transition:transform .7s var(--ease),opacity .3s var(--ease)}
.cti.past::after{opacity:1;transform:scaleY(1)}
/* variante clara da timeline, sobre o véu escuro (BID pelo WhatsApp, cap. 1) */
.ctl.dark .cti p{color:#ffffff}
.ctl.dark .cti.past p{color:rgba(255,255,255,.45)}
.ctl.dark .cti.past .cti-dot{background:rgba(255,255,255,.3)}
.ctl.dark .cti::after{background:rgba(255,255,255,.22)}
/* câmera da prancha (cap. 1: zoom no SharePoint e corte seco de volta) */
.cam{transition:transform 1.15s var(--ease)}
.cam.snap{transition:none}
.mfly{opacity:0;transition:transform 1.1s var(--ease),opacity .4s var(--ease)}
.mfly.fly{opacity:1}.mfly.gone{opacity:0}
/* MATCH CUT seco: A acelera para a esquerda e, no meio do movimento, some;
   no mesmo instante B aparece já em movimento, desacelerando até o lugar. */
.mc{transition:transform .6s cubic-bezier(.16,.84,.44,1)}
.mc.pre{visibility:hidden;transform:translateX(280px);transition:none}
.mc.show{visibility:visible;transform:translateX(0)}
.mc.out{visibility:visible;transform:translateX(-320px);transition:transform .55s cubic-bezier(.7,0,.84,0)}
.mc.gone{visibility:hidden;transform:translateX(-320px);transition:none}
/* entrada dos textos das cartelas */
@keyframes rise{0%{opacity:0;transform:translateY(40px)}100%{opacity:1;transform:translateY(0)}}
.tc .w{display:inline-block;opacity:0}
/* abertura em quatro tempos: marca (.opA) → produto (.opB) → slogan e bolhas → parceiros (.opP) */
@keyframes opOut{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-32px)}}
@keyframes opIn{0%{opacity:0;transform:translateY(24px)}100%{opacity:1;transform:translateY(0)}}
.tc .opAin,.tc .opB,.tc .opP{opacity:0}
.tc.show .opAin{animation:rise .85s var(--ease) both}
.tc.show .opA{animation:opOut .55s var(--ease) 1.3s both}
.tc.show .opB{animation:opIn .6s var(--ease) 1.45s both}
.tc.show .opP{animation:opIn .55s var(--ease) 4.1s both}
@keyframes opSettle{0%{transform:translateY(158px)}100%{transform:translateY(0)}}
.tc.show .opCol{animation:opSettle .7s var(--ease) 2.35s both}
/* abertura: anel de setas gira devagar; celular vai para a horizontal e volta */
.tc.show .rh-ring{animation:spinslow 9s linear infinite}
@keyframes spinslow{to{transform:rotate(360deg)}}
.tc.show .rh-phone{animation:rhRot 2.2s var(--ease) .5s forwards}
/* cartela do BID: câmera própria no layer do texto (zoom out de "Peça cotações") */
.qtx{transform-origin:0 0;transition:transform 1.15s var(--ease);will-change:transform}
.q .w{display:inline-block;opacity:0}
.q.show .w{animation:rise .55s var(--ease) both}
.l2w{display:inline-block;opacity:0}
.q.l2 .l2w{animation:rise .55s var(--ease) both}
/* cartela-pergunta do BID (.qb): mesma coreografia, tudo mais rápido */
.q.qb .qtx{transition-duration:.9s}
.q.qb.exit{transition-duration:.5s}
.q.qb.exit .qtx{transition-duration:.6s}
.q.qb.show .w{animation-duration:.45s}
.q.qb.l2 .l2w{animation-duration:.45s}
.q .qw2{display:inline-block;opacity:0}
.q.bgin .qw2{animation:rise .45s var(--ease) .05s both}
/* bolhas dos produtos (timeline): entram apagadas (#262626) e acendem para o gradiente de IA.
   .off = capítulo que não é o atual (contorno, sem gradiente, sem pulso). As regras valem na
   cena do logo e nas cartelas de capítulo (.tc.show) e na cartela-pergunta do BID (.q.l2). */
.qfb{position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:10px;padding:13px 22px;border-radius:9999px;font-size:18px;font-weight:500;color:#ffffff;background:linear-gradient(100deg,#1d6ae5,#38bdf8,#7c8cf8,#38bdf8,#1d6ae5);background-size:220% 100%;box-shadow:0 12px 30px -12px rgba(0,0,0,.4);opacity:0}
.qfb::before{content:"";position:absolute;inset:0;background:#262626;transition:opacity .5s var(--ease);transition-delay:inherit}
.tc.show .qfb,.q.l2 .qfb{animation:rise .4s var(--ease) both,aiSweep 3.5s linear infinite}
.tc.show .qfb::before,.q.l2 .qfb::before{opacity:0}
.qfb.off{color:${T.mutedFg};background:none;box-shadow:inset 0 0 0 1px rgba(10,10,10,.16)}
.qfb.off::before{content:none}
.qfb.off .ai-spark{animation:none}
.tc.show .qfb.off,.q.l2 .qfb.off{animation:rise .4s var(--ease) both}
/* marcador de capítulo — anel com numeral (o arco é pintado pelo runtime; sem runtime fica vazio) */
/* bolha estacionada (selo do capítulo): aparece na hora no lugar da bolha da cartela e voa ao canto (só o
   transform transiciona); .hide = zoom cobrindo o canto; .re = volta depois do zoom, com fade; .exit =
   cartela seguinte entrando. Na saída da cartela a bolha acesa dela some na hora — a estacionada assume. */
.dock{opacity:0;pointer-events:none;will-change:transform}
.dock .qfb{opacity:1;animation:aiSweep 3.5s linear infinite}
.dock .qfb::before{content:none}
.dock.pre{transition:none}
.dock.on{opacity:1;transition:transform .9s var(--ease)}
.dock.on.re{transition:transform .9s var(--ease),opacity .5s var(--ease)}
.dock.hide{opacity:0;transition:opacity .2s var(--ease)}
.dock.exit{opacity:0;transition:opacity .5s var(--ease)}
/* o !important zera o transition-delay inline da bolha (0,8 s, herdado pelo ::before): sem ele o visibility só mudaria 0,8 s depois e as duas bolhas apareceriam juntas durante o voo */
.q.qb.exit .qfb.on{visibility:hidden;transition-delay:0s !important}
@keyframes rhRot{0%,30%{transform:rotate(0)}100%{transform:rotate(90deg)}}
/* fechamento: a URL é digitada (mono sem tracking → 15ch exatos, +2px de folga) com cursor piscando */
.url{display:inline-block;width:0;overflow:hidden;white-space:nowrap}
.tc.show .url{animation:typeUrl 1.05s steps(15,end) 1s forwards}
@keyframes typeUrl{to{width:calc(15ch + 2px)}}
.caret{display:inline-block;animation:blink .8s step-end infinite}
@keyframes blink{50%{opacity:0}}
.tc.show .w{animation:rise .85s var(--ease) both}
${Array.from({ length: 11 }, (_, i) => `.tc.show .w:nth-child(${i + 2}){animation-delay:${((i + 1) * 0.07).toFixed(2)}s}`).join('')}
.zoomer{transform-origin:0 0;transition:transform 1.15s var(--ease)}
.zoomer.snap{transition:none}
.nr.on{background:rgba(0,101,224,.1);color:${T.brand};font-weight:500}
.nr.on .ico-fill{display:flex !important}.nr.on .ico-reg{display:none !important}
.pl{transition:background .4s var(--ease),color .4s var(--ease)}
.pl.on{background:${T.brand};color:#fff}.pl.off{background:${T.muted};color:${T.mutedFg}}
.row.show{animation:flash 1.8s var(--ease)}
.row.ai,.crow.ai{background:linear-gradient(100deg,rgba(29,106,229,.10),rgba(56,189,248,.13),rgba(124,140,248,.10),rgba(29,106,229,.10));background-size:280% 100%;animation:aiSweep 2.2s linear infinite}
@keyframes flash{0%{background:rgba(0,101,224,.14)}100%{background:transparent}}
/* documentos em ATENÇÃO (2026-09-18, 3ª versão): antes da cobrança automática a câmera SOBE até as duas
   linhas (panWarn). Cada uma ganha um gradiente VISÍVEL na cor do status — âmbar (a vencer), vermelho
   (vencido) —, forte na borda esquerda e claro à direita, em tom CONSTANTE; por cima passa só um brilho
   estreito (warnSheen), que é o movimento das linhas lidas pela IA sem o sobe-e-desce de opacidade que
   a varredura aiSweep dava (rejeitado pelo usuário: "começar com a cor forte depois ficando menos opaco"). */
.row.warn{background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.25) 50%,rgba(255,255,255,0) 100%) no-repeat,linear-gradient(90deg,rgba(254,154,0,.12) 0%,rgba(254,154,0,.07) 45%,rgba(254,154,0,.03) 100%);background-size:34% 100%,100% 100%;animation:warnSheen 2.2s linear infinite}
.row.warn.red{background-image:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.25) 50%,rgba(255,255,255,0) 100%),linear-gradient(90deg,rgba(231,0,11,.10) 0%,rgba(231,0,11,.06) 45%,rgba(231,0,11,.025) 100%)}
@keyframes warnSheen{from{background-position:-40% 0,0 0}to{background-position:140% 0,0 0}}
/* documento novo entrou (2026-09-21): a linha em atenção pisca em verde e volta ao branco */
.row.ok{animation:okRow 1.8s var(--ease)}
@keyframes okRow{0%{background:rgba(0,201,80,.32)}100%{background:transparent}}
.hl{transition:background .3s var(--ease)}.hl.hover{background:rgba(235,235,235,.4)}
.crow{transition:background .6s var(--ease),box-shadow .6s var(--ease)}
/* resposta lida (2026-09-18, 3ª versão): a linha só PISCA na chegada e volta ao branco — sem fundo azul permanente */
.crow.got{animation:gotRow 1.4s var(--ease)}
@keyframes gotRow{0%{background:rgba(0,101,224,.3)}100%{background:transparent}}
.crow.win{background:rgba(0,201,80,.22);box-shadow:inset 3px 0 0 ${T.green600}}
.cmpv{transition:color .6s var(--ease)}
.crow.win .cmpv{color:${T.green700}}
/* O destaque das linhas recomendadas (4ª versão, 2026-09-18) reutiliza a varredura .crow.ai do "lendo…":
   as linhas recebem a classe ai em cascata e ficam varrendo até kVenc. Nenhum CSS próprio. */
.sprow{background:${T.card};transition:background .35s var(--ease),opacity .3s var(--ease)}
.sprow.sel{background:#dbe7f9}
.sprow.ok{background:rgba(0,166,62,.08)}
.spin{animation:spin 1s linear infinite;transform-origin:center}
@keyframes spin{to{transform:rotate(360deg)}}
.dcard{transform-origin:0 0;--d:0s;transition:transform .9s var(--ease) var(--d),opacity .3s var(--ease),box-shadow .3s var(--ease);opacity:0}
.dcard.d1{--d:.06s}.dcard.d2{--d:.12s}
.dcard.lift{opacity:1;box-shadow:0 25px 50px -12px rgba(0,0,0,.3);transition:opacity .25s var(--ease),box-shadow .3s var(--ease)}
.dcard.fly{opacity:1;box-shadow:0 25px 50px -12px rgba(0,0,0,.3)}
.dcard.gone{opacity:0;transition:opacity .3s var(--ease)}
.env{opacity:0;transition:transform 1s var(--ease),opacity .5s var(--ease)}
.env.fly{opacity:1}.env.gone{opacity:0;transition:opacity .4s var(--ease),transform 1s var(--ease)}
.env.e1{transition-delay:.12s}.env.e2{transition-delay:.24s}.env.e3{transition-delay:.36s}
.cur{position:absolute;left:0;top:0;width:0;height:0;transition:transform .85s var(--ease),opacity .3s var(--ease)}
.cur.hide{opacity:0}
.cur .ring{position:absolute;left:-14px;top:-14px;width:32px;height:32px;border-radius:9999px;border:2px solid rgba(10,10,10,.55);opacity:0;transform:scale(.4)}
.cur.kA .ring{animation:ringA .55s var(--ease)}.cur.kB .ring{animation:ringB .55s var(--ease)}
@keyframes ringA{0%{opacity:.9;transform:scale(.4)}100%{opacity:0;transform:scale(1.4)}}
@keyframes ringB{0%{opacity:.9;transform:scale(.4)}100%{opacity:0;transform:scale(1.4)}}
.typing{flex-shrink:0;overflow:hidden;transition:height .35s var(--ease),opacity .3s var(--ease),margin-top .35s var(--ease);height:36px}
.typing.pre{height:0;opacity:0;margin-top:-8px}
.typing.show{height:36px;opacity:1;margin-top:0}
.typing.exit{height:0;opacity:0;margin-top:-8px}
.dot{width:6px;height:6px;border-radius:9999px;background:rgba(255,255,255,.8);animation:bounce 1s infinite}
.dot:nth-child(2){animation-delay:.15s}.dot:nth-child(3){animation-delay:.3s}
.dot.dk{background:rgba(0,0,0,.35)}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
/* IA em ação: shimmer de gradiente no texto (estilo Gemini) */
.ai-shimmer{background:linear-gradient(90deg,#1d6ae5,#38bdf8,#7c8cf8,#38bdf8,#1d6ae5);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:aiSweep 1.8s linear infinite}
@keyframes aiSweep{from{background-position:0% 0}to{background-position:200% 0}}
/* "IA" e "muito bem" acendendo juntos: duas camadas empilhadas — a cinza some, a colorida entra.
   Cross-fade em vez de animar o gradiente porque background-clip:text não interpola
   entre uma cor sólida e um gradiente. O sweep é o mesmo aiSweep dos badges. */
.acende{position:relative;display:inline-block}
.acende>span{display:block}
.acende .frio{color:${T.mutedFg};transition:opacity .6s var(--ease)}
.acende .quente{position:absolute;inset:0;opacity:0;transition:opacity .6s var(--ease)}
.tc.show .acende .frio{opacity:0;transition-delay:3.6s}
.tc.show .acende .quente{opacity:1;transition-delay:3.6s}
.ai-spark{animation:aiPulse 1.5s ease-in-out infinite}
.ai-badge{background:linear-gradient(#ffffff,#ffffff) padding-box,linear-gradient(90deg,#1d6ae5,#38bdf8,#7c8cf8) border-box;border:1px solid transparent}
/* mini explosão de sparkles quando a IA conclui (valor preenchido, cotação emitida) */
.aiburst{position:absolute;right:-6px;top:-2px;width:5px;height:5px;border-radius:9999px;opacity:0;pointer-events:none}
.vf.show .aiburst,.vp.show .aiburst{animation:aiBurst .8s ease-out .1s both}
@keyframes aiBurst{0%{opacity:1;box-shadow:0 0 0 0 #1d6ae5,0 0 0 0 #38bdf8,0 0 0 0 #7c8cf8,0 0 0 0 #22d3ee,0 0 0 0 #4aa8ff,0 0 0 0 #8d9fff}100%{opacity:0;box-shadow:-24px -16px 0 1px #1d6ae5,22px -20px 0 0 #38bdf8,28px 9px 0 1px #7c8cf8,-26px 11px 0 0 #22d3ee,7px -28px 0 1px #4aa8ff,-5px 24px 0 0 #8d9fff}}
@keyframes aiPulse{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.22);opacity:1}}
/* glow de borda estilo Siri/Apple Intelligence: anel cônico girando + halo desfocado */
.vf.siri{transition-duration:.45s}
.siri-ring{position:absolute;inset:0;border-radius:34px;overflow:hidden;display:block;padding:3px;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude}
.siri-ring.r2{padding:11px;filter:blur(12px);opacity:.32}
.siri-spin{position:absolute;display:block;inset:-60%;background:conic-gradient(from 0deg,#8d9fff,#4aa8ff,#38bdf8,#22d3ee,#5b8cff,#7c8cf8,#2563eb,#8d9fff);animation:siriSpin 1.8s linear infinite}
@keyframes siriSpin{to{transform:rotate(360deg)}}
/* ponto piscante da sugestão da IA */
.pulse{position:relative;display:inline-block;width:8px;height:8px;border-radius:9999px;background:linear-gradient(135deg,#1d6ae5,#38bdf8,#7c8cf8)}
.pulse::after{content:"";position:absolute;inset:-4px;border-radius:9999px;border:2px solid #4aa8ff;animation:pulse 1.4s ease-out infinite}
/* variante verde do ponto: melhor preço FOB (o azul fica com a melhor CIF) */
.pulse.pg{background:linear-gradient(135deg,#00a63e,#4ade80)}
.pulse.pg::after{border-color:#00a63e}
@keyframes pulse{0%{opacity:.9;transform:scale(.6)}100%{opacity:0;transform:scale(1.6)}}
/* conversas: as mensagens ancoram embaixo (como no WhatsApp) e as futuras não ocupam espaço —
   ao entrar, a bolha abre (max-height) e empurra as anteriores para cima. --g = gap do container. */
.chat{justify-content:flex-end}
.chat .vp{max-height:520px;transition:max-height .45s var(--ease),margin-top .45s var(--ease),transform .5s var(--ease),opacity .4s var(--ease)}
.chat .vp.pre{max-height:0;margin-top:calc(-1 * var(--g,8px));opacity:0;transform:translateY(10px);transition:none}
/* botões que recebem o cursor: escurecem um pouco no hover */
.hb{transition:filter .3s var(--ease)}.hb.hover{filter:brightness(.9)}
/* véu do comparativo: faixa inferior com gradiente escuro que sobe (translateY) com a legenda centralizada, depois do zoom out */
.veil{position:absolute;left:0;right:0;bottom:0;height:540px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;text-align:center;padding:0 200px 140px;background:linear-gradient(to top,rgba(38,38,38,.93) 0%,rgba(38,38,38,.84) 40%,rgba(38,38,38,0) 100%);transform:translateY(100%);transition:transform .7s var(--ease);pointer-events:none}
/* cena Internacional × Local (2026-09-20): dois recibos espelhados; as linhas acendem em pares, a régua fecha em azul */
.mkt{transition:opacity .7s var(--ease)}
.mks{transition:opacity .38s var(--ease),transform .42s var(--ease),background .42s var(--ease)}
.mks.pre{opacity:0;transform:translateY(10px)}
.mks.show{opacity:1;transform:none}
.mks.regua.show{background:rgba(29,106,229,.08);box-shadow:inset 0 0 0 1px rgba(29,106,229,.22)}
.mks.regua .mkv{color:#0a0a0a;transition:color .5s var(--ease)}
.mks.regua.show .mkv{color:#0065e0}
.mktg{position:relative;display:inline-grid;grid-template-columns:1fr 1fr;padding:4px;border-radius:9999px;background:#ebebeb;border:1px solid #e5e5e5}
.mktg .knob{position:absolute;top:4px;bottom:4px;left:4px;width:calc(50% - 4px);border-radius:9999px;background:#ffffff;box-shadow:0 1px 3px rgba(0,0,0,.14)}
.mktg .lbl{position:relative;padding:10px 24px;text-align:center;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#8a8a8a}
/* o botão do produto vai e volta sozinho: é o "você escolhe". Desde 2026-09-21 ele fica no TOPO da cena e só
   começa a alternar quando o rodapé entra (.mkt.flip, cue mkFoot) — e o cartão do mercado escolhido ganha o anel
   azul enquanto o outro esmaece: o toggle COMANDA os dois recibos (mesmo ciclo de 5 s, começam juntos). */
.mkt.flip .mktg .knob{animation:knobIdle 5s var(--ease) infinite}
.mkt.flip .mktg .lbl.a{animation:lblA 5s var(--ease) infinite}.mkt.flip .mktg .lbl.b{animation:lblB 5s var(--ease) infinite}
.mkc{transition:opacity .5s var(--ease),box-shadow .5s var(--ease)}
.mkt.flip .mkc.i{animation:mkcA 5s var(--ease) infinite}.mkt.flip .mkc.l{animation:mkcB 5s var(--ease) infinite}
@keyframes mkcA{0%,30%{opacity:1;box-shadow:0 30px 80px -30px rgba(0,0,0,.25),0 0 0 2.5px #0065e0}38%,88%{opacity:.5;box-shadow:0 30px 80px -30px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.06)}100%{opacity:1;box-shadow:0 30px 80px -30px rgba(0,0,0,.25),0 0 0 2.5px #0065e0}}
@keyframes mkcB{0%,30%{opacity:.5;box-shadow:0 30px 80px -30px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.06)}38%,88%{opacity:1;box-shadow:0 30px 80px -30px rgba(0,0,0,.25),0 0 0 2.5px #0065e0}100%{opacity:.5;box-shadow:0 30px 80px -30px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.06)}}
@keyframes knobIdle{0%,30%{transform:translateX(0)}38%,88%{transform:translateX(100%)}100%{transform:translateX(0)}}
@keyframes lblA{0%,30%{color:#0a0a0a}38%,88%{color:#8a8a8a}100%{color:#0a0a0a}}
@keyframes lblB{0%,30%{color:#8a8a8a}38%,88%{color:#0a0a0a}100%{color:#8a8a8a}}
.mktg .lbl.a{color:#0a0a0a}.mktg.local .lbl.a{color:#8a8a8a}.mktg.local .lbl.b{color:#0a0a0a}
.veil.pre{transition:none}
.veil.show{transform:none}
.veil.exit{transform:translateY(100%)}
.veil-t{opacity:0;transform:translateY(22px);transition:opacity .5s var(--ease) .4s,transform .6s var(--ease) .4s}
.veil.show .veil-t{opacity:1;transform:none}
.veil.exit .veil-t{opacity:0;transition:opacity .3s var(--ease)}
/* cap. 3, fase B: a janela mostra só o painel da conversa — o cabeçalho do app sai do layout */
.hdr.off{display:none !important}
/* troca de página dentro da janela: fade com deslocamento (a que sai vai para a esquerda, a que entra vem da direita) */
.pgx{transition:opacity .7s var(--ease),transform .7s var(--ease)}
.pgx.pre{opacity:0;transform:translateX(56px);transition:none;pointer-events:none}
.pgx.show{opacity:1;transform:none}
.pgx.exit{opacity:0;transform:translateX(-56px);pointer-events:none}
/* ranking da Visão Geral (2026-09-20): linhas entram em cascata com a página */
.pgx .rk{opacity:0;transform:translateX(-10px)}
.pgx.show .rk{animation:rkIn .55s var(--ease) both}
@keyframes rkIn{to{opacity:1;transform:none}}
/* modal do BID: baixo na aba Disparar (só destinatários), inteiro no comparativo — a troca cai no corte seco */
.dmodal{top:45px;height:810px}.dmodal.short{top:230px;height:440px}
/* seleção automática (2026-09-18): a FS1 varre a lista — a linha acende no gradiente de IA, assenta
   selecionada e a que ficou de fora apaga. O ::before é o brilho; o conteúdo sobe para z-index 1. */
.exr{position:relative;transition:background .3s var(--ease),opacity .5s var(--ease)}
.exr.sel{background:rgba(235,235,235,.4)}
.exr.skip{opacity:.4}
.exr>*{position:relative;z-index:1}
.exr::before{content:"";position:absolute;inset:0;z-index:0;opacity:0;pointer-events:none;background:linear-gradient(90deg,rgba(29,106,229,.22),rgba(56,189,248,.16) 46%,rgba(124,140,248,0) 92%);box-shadow:inset 2px 0 0 #4aa8ff}
.exr.scan::before{animation:exrScan 1s var(--ease) both}
@keyframes exrScan{0%{opacity:0;transform:translateX(-18px)}20%{opacity:1;transform:none}64%{opacity:1;transform:none}100%{opacity:0;transform:none}}
/* indicador "ao vivo" do painel de conversas */
.live-dot{position:relative;display:inline-block;width:8px;height:8px;border-radius:9999px;background:#00c950}
.live-dot::after{content:"";position:absolute;inset:-4px;border-radius:9999px;border:2px solid #00c950;animation:pulse 1.4s ease-out infinite}
`

/* ---------------- stage ---------------------------------------------- */
// No 1 min os recortes da janela e do celular entram inclinados em 3D e assentam (.tilt, c.tilt).
// Glow do 1 min (como a referência): manchas de luz azul em modo screen por cima de tudo, que mudam de lugar a
// cada sessão (c.gfx = g0..g4) e derivam devagar; o horizonte aceso embaixo. (A moldura do palco saiu a pedido.)
const glowFx = `<div class="gfx {{c.gfx}}"><div class="gb ga"><i></i></div><div class="gb gbb"><i></i></div><div class="gb gh"><i></i></div><div class="gb gt"><i></i></div></div>`
const TILT_A = CURTO ? '<div class="tilt {{c.tilt}}">' : '', TILT_Z = CURTO ? '</div>' : ''
const stage = `<div class="stage" style="position:relative;width:1920px;height:1080px;overflow:hidden;background:${STAGE};color:${T.fg};font-family:${BODY};font-size:16px;line-height:1.5;letter-spacing:.02em">
	${docsQCard}
	${waQCard}

	${TILT_A}<div class="cam {{c.cam}}" style="position:absolute;inset:0;transform-origin:0 0;transform:{{st.cam}}">
	<div class="vf {{c.win}}" style="position:absolute;left:160px;top:90px;width:1600px;height:900px">
		<div class="zoomer {{c.zoomer}}" style="transform:{{st.zoom}};width:1600px;height:900px;border-radius:12px;overflow:hidden;background:${T.bg};box-shadow:0 40px 100px -30px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.06);display:flex">
			${sidebar}
			<main style="flex:1;min-width:0;display:flex;flex-direction:column">
				${header}
				<div style="position:relative;flex:1;min-height:0">
					${docsPage}
					${bidPage}
					${waPage}
					${vgPage}
				</div>
			</main>
			<div style="position:absolute;inset:0;pointer-events:none">
				${novaDialog}
				${detailModal}
				${fecharDialog}
				${cobrancaDialog}
				${recebidoDialog}
				${docFlies}
			</div>
		</div>
	</div>

	${spPanel}
	${zonePanel}
	${outlook}
	${waExp}
	${mailFly}
	${waFly}
	${SP_FILES.slice(0, 3).map((f, k) => dragCard(f[1], 'lido e renomeado pela IA', k)).join('')}
	<div class="cur {{c.cur}}" style="transform:{{st.cur}}"><span class="ring"></span>${ico('Cursor', 26, 'fill', `color:${T.fg};filter:drop-shadow(0 0 1.5px rgba(255,255,255,.95)) drop-shadow(0 2px 3px rgba(0,0,0,.4));position:absolute;left:-2px;top:-2px`)}</div>
	</div>${TILT_Z}

	${caps}
	${ocPages}
	${TILT_A}${phone}${TILT_Z}
	${capsBot}
	${veil}
	${mkt}
	${veil2}
	${docks}
	${hintCard}
	${bidQCard}
	${openCard}
	${CURTO ? hookLayers + kinCaps + ctaCard + glowFx : closeCard}
</div>`

/* ---------------- lógica (timeline) ------------------------------------ */
// Cabeça do vídeo: LEAD ms de tela em branco antes do conteúdo — o cue 'boot' (em 0) é o branco.
// Os tempos da tabela abaixo são relativos ao conteúdo; o offset entra no .map().
// A duração total (DURACAO) é derivada abaixo: o relógio acaba FECHO ms depois de waOut (o fechamento segura
// só esse tempo). Até 2026-09-12 era um valor fixo (2:00 → 2:10 → 2:15) com o fechamento segurando o resto.
const LEAD = 2000
// Corte de 1 minuto: RECORTES do roteiro de 3 min, [início, fim, pausa antes, legenda] em ms do 3 min. Cada recorte
// toca a 1×; o que fica entre dois recortes COLAPSA (os cues disparam juntos, no meio da pausa, por baixo da
// legenda opaca que cobre a troca). O primeiro recorte é a abertura (Solução), e a pausa dele é o Problema.
const HOOK_MS = 10000 // o Problema (timeline GSAP do runtime, HOOK_JS)
const FRAGS_1MIN = [
	[0, 4300, HOOK_MS, null],                 // Solução: Faradays → FS1 por Faradays → slogan (parceiros ocultos)
	[18900, 24700, 1700, 'kc1'],              // Demo: a FS1 marca 3 de 4 exportadores → Disparar BID → envelopes
	[39775, 45400, 1700, 'kc2'],              // comparativo "lendo e-mail…" → varredura da IA (o véu colapsa)
	[51300, 52400, 0, null],                  // a IA marca as vencedoras
	[56500, 59600, 1700, 'kc3'],              // as duas OCs em PDF, carimbo ENVIADA
	[91000, 96000, 1700, 'kc4'],              // Recursos: drive → a IA lê e renomeia
	[102600, 106900, 1700, 'kc5'],            // linhas em atenção → cobrança automática
	[122800, 128400, 1700, 'kc6'],            // áudio do representante → números e alertas
	[130200, 133800, 0, null],                // "muda pra FOB" → cotação emitida
	[162000, 165000, 1700, 'kc7'],            // Visão Geral ao vivo
	[174075, Infinity, 0, null],              // CTA
]
const FR = []
{ let acc = 0; for (const [a, b, h, k] of FRAGS_1MIN) { FR.push({ a, b, h, k, cap: acc, start: acc + h }); acc += h + (b - a) } }
// Cues que o corte curto não dispara nem colapsados: o resto da conversa do celular (COA/NF/boleto, ficha,
// rastreio, resumo do dia), que apareceria dentro do celular enquanto ele some.
const SKIP_1MIN = new Set(['ptyp3', 'p5', 'cap4', 'p6', 'p7', 'ptyp4', 'p8', 'p9', 'ptyp5', 'p10', 'cap5', 'chatB', 'rs1', 'cap6', 'rs2', 'rtyp', 'rs3', 'cap7'])
const mapa1min = (t) => {
	for (const f of FR) {
		if (t < f.a) return Math.round(f.cap + f.h / 2)
		if (t < f.b) return Math.round(f.start + t - f.a)
	}
}
const CUES = [
	// dica de girar o celular — desligada (descomente para voltar):
	// ['hint', 350], ['hintOut', 4900],
	// abertura — logo, slogan e timeline das bolhas (5,2 s)
	['boot', 0], ['open', 0], ['openOut', 6700],
	// cap. 1 — Cotação de compra (BID); cartela de 4,8 s a partir de openOut (o título de 2026-09-14 tem duas linhas). Demos esticadas em 1,25× (2026-09-11).
	// Nova cotação (cesta) → modal centrado: a FS1 identifica e marca 3 dos 4 exportadores sozinha → disparo → e-mail e WhatsApp do
	// exportador respondem (zona do fornecedor, com tempo para ler) → comparativo em zoom → IA sugere → zoom out → VÉU
	// (a ação para, um gradiente escuro sobe pela parte de baixo com a legenda, espera e desce) → a IA marca as vencedoras → fechar →
	// OC + feedback (com tempo para ler)
	['bZoom', 7100], ['bLine2', 7800], ['ch2Out', 11500],
	['cNova', 12750], ['kNova', 13500], ['it1', 14625], ['it2', 15125], ['it3', 15625], ['cCriar', 17875], ['kCriar', 18625],
	['aiSel', 19500], ['aSel', 20600], ['aiOk', 21650],
	['cDisp', 22550], ['kDisp', 23250], ['env', 24625], ['split', 25375], ['mailIn', 26250], ['capMail', 26625], ['mailOpen', 26750],
	['replyOpen', 27250], ['t1', 27625], ['t2', 27875], ['t3', 28125], ['t4', 28375], ['cSend', 28875], ['kSend', 30375], ['flyGone', 31750],
	['waIn', 32500], ['waMsg', 33900], ['cWaSend', 34150], ['waSend', 36400], ['waGone', 37650], ['unsplit', 38650],
	['cutA2', 39775], ['cut2', 40025], ['read2', 41650], ['readWa', 42275], ['zoomOut2', 42775], ['bk1', 43975], ['bk2', 44275], ['sug1', 44325], ['bk3', 44575], ['sug2', 44625], ['bk4', 44875], ['sug3', 44925], ['sug4', 45225], ['veilIn', 46075], ['veilOut', 50875], ['kVenc', 51575],
	['cFechar', 52675], ['kFechar', 53425], ['oc1', 54525], ['fb1', 55425], ['ocFire', 56625], ['ocS1', 58200], ['ocS2', 58600],
	// BID pelo WhatsApp — o gestor de compras (2026-09-21): status → cria → prévia → "sim" → disparado
	['ocOut', 60300], ['botIn', 60700], ['b1', 61300], ['btyp1', 62000], ['b2', 63000], ['b3', 66200], ['btyp2', 67000], ['b4', 68000], ['bc2', 69600], ['b5', 69800], ['btyp3', 70300], ['b6', 71200], ['botOut', 74300],
	 ['mktIn', 75000], ['mkA', 75600], ['mk1', 76300], ['mk2', 77000], ['mk3', 77600], ['mkR', 78500], ['mkFoot', 79900], ['mktOut', 85500], ['bidOut', 86100], ['rst1', 87225],
	// cap. 2 — Documentos (SharePoint); cartela de 3,8 s a partir de bidOut (mesma coreografia da do BID: dZoom/dLine2).
	// Arquivos com nome "nada a ver" sincronizam → a IA lê e renomeia → entram na tabela → cobrança dos vencidos
	['dZoom', 86500], ['dLine2', 87200], ['ch1Out', 89900],
	['spIn', 91025], ['zoomSp', 91337],
	['sync1', 92025], ['sync2', 92400], ['sync3', 92775], ['done1', 93400], ['done2', 93775], ['done3', 94150], ['ren1', 94900],
	['ren2', 95275], ['ren3', 95650], ['lift', 97025], ['drop', 97400], ['cutSp', 97837], ['r1', 97963], ['r2', 98150],
	['r3', 98337], ['spOut', 98900], ['zoomStatus', 99275], ['read', 100650], ['panWarn', 102200], ['warn', 103450], ['cobDet', 104650], ['sent', 106350],
	// resposta do exportador (2026-09-21): o anexo vira documento, é salvo no drive e a pendência baixa; a Halal vira Vigente
	['docOut', 107300], ['cobOut', 108600], ['docBack', 109000], ['rxIn', 110100], ['rxRead', 111400], ['rxSave', 112700], ['rxDone', 113900], ['rxOut', 116000], ['rxRow', 117200], ['docsOut', 119500], ['rst2', 120625],
	// cap. 3 — Cotação de venda (WhatsApp); cartela de 3,3 s a partir de docsOut (mesma coreografia: wZoom/wLine2).
	// Fase A: só o celular (áudio → IA responde com números → confirma → cotação → pede COA/NF/boleto → IA manda), com
	// pausa para ler cada mensagem. Fase B: só o sistema — tela inteira, zoom na conversa com a legenda à direita
	['wZoom', 119900], ['wLine2', 120600], ['rst2', 120625], ['ch3Out', 122800], ['phoneIn', 122925], ['p1', 123425], ['cap1', 123550],
	['ptyp1', 125225], ['p2', 126625], ['cap2', 126875], ['p3', 130425], ['ptyp2', 131325], ['p4', 132725], ['cap3', 132975],
	['p5', 136225], ['cap4', 136350], ['ptyp3', 137525], ['p6', 138925], ['p7', 141425], ['ptyp4', 142325], ['p8', 143725],
	['p9', 146225], ['ptyp5', 147025], ['p10', 148025], ['cap5', 148150], // rastreio da NF (2026-09-21)
	['chatB', 151025], ['rs1', 151775], ['cap6', 151900], ['rs2', 155775], ['rtyp', 156675], ['rs3', 158075], ['cap7', 158200], ['toSys', 162075],
	['vg1', 163575], ['vg2', 164775], ['veil2In', 165775], ['veil2Out', 170075], ['vg3', 170875], ['vg4', 172075],
	['waOut', 174075], ['rst3', 175200],
]
	.filter(([n]) => !(CURTO && SKIP_1MIN.has(n)))
	.map(([n, t]) => [n, n === 'boot' ? 0 : (CURTO ? mapa1min(t) : t) + LEAD])
	.sort((a, b) => a[1] - b[1])
// Corte de 1 min: as legendas (kcN entra no início da pausa, kcNx sai quando o recorte começa).
if (CURTO) {
	for (const f of FR) if (f.k) CUES.push([f.k, f.cap + LEAD], [f.k + 'x', f.start + LEAD])
	CUES.sort((a, b) => a[1] - b[1])
}
// Fechamento: o relógio acaba FECHO ms depois de waOut (pedido de 2026-09-12: 3 s); o loop recomeça 2,6 s depois.
const FECHO = CURTO ? 4500 : 3000 // no 1 min o CTA segura 4,5 s
CUES.push(['end', CUES.find(([n]) => n === 'waOut')[1] + FECHO])
const DURACAO = CUES[CUES.length - 1][1]
const RELOGIO = `${Math.floor(DURACAO / 60000)}:${String(Math.round((DURACAO % 60000) / 1000)).padStart(2, '0')}`

// no corte curto não há chatB: as legendas do celular saem com ele, no toSys
// 1 min: camadas cinéticas, legendas e inclinação dos recortes
const LOGIC_1MIN = `
		for (let k = 1; k <= 7; k++) c['kc' + k] = seq('pre', ['kc' + k, 'show'], ['kc' + k + 'x', 'exit']);
		c.gfx = seq('g0', ['open', 'g1'], ['kc1', 'g2'], ['kc2', 'g3'], ['kc3', 'g1'], ['kc4', 'g2'], ['kc5', 'g3'], ['kc6', 'g1'], ['kc7', 'g2'], ['waOut', 'g4']);
		c.tilt = seq('', ['kc1', 'ta'], ['kc2', 'tb'], ['kc4', 'ta'], ['kc5', 'tb'], ['kc6', 'ta'], ['kc7', 'tb']);
`
const CAP_FIM = CURTO ? ", ['toSys', 'exit']" : ''
const logic = `
const CUES = ${JSON.stringify(CUES)};
const I = {}; CUES.forEach((c, k) => { I[c[0]] = k; });
const START = { Abertura: 0, BID: I.openOut, SharePoint: I.bidOut, Conversas: I.docsOut };
// Janela do app na prancha (px) — a câmera é um transform na janela.
const WX = 160, WY = 90;
const focus = (cx, cy, s) => 'translate(' + (960 - WX - s * cx) + 'px,' + (540 - WY - s * cy) + 'px) scale(' + s + ')';
// Encosta a janela em (x,y) da prancha, na escala s — a vista dividida.
const place = (x, y, s) => 'translate(' + (x - WX) + 'px,' + (y - WY) + 'px) scale(' + s + ')';
const NOZOOM = 'translate(0px,0px) scale(1)';
const LEFT = [64, 261, 0.58];
// Ponto da janela → prancha, para a câmera (fx, fy, s) em foco ou (x, y, s) encostada.
const zpt = (cx, cy, f) => [960 + f[2] * (cx - f[0]), 540 + f[2] * (cy - f[1])];
const lpt = (cx, cy) => [LEFT[0] + LEFT[2] * cx, LEFT[1] + LEFT[2] * cy];
const ZP = [750, 330, 1.9];
// Focos das caixas de diálogo (coordenadas da janela): centro da área de conteúdo, escala alta para
// legibilidade (13,33px do app viram ~21px na prancha). O modal baixo do disparo (1152×440, centrado na
// tela) cabe a 1,55.
const F_DLG = [832, 450, 1.6];
const F_WARN = [728, 385, 1.5]; // COORDENADAS DA JANELA (focus() desconta WX/WY): as duas linhas em atenção — Halal y 333–385, Kosher 385–437 — de Tipo a Status
const F_DISP = [832, 450, 1.55];
// Cap. 3, fase B: a tela inteira aparece sem zoom; depois a câmera fecha no painel da conversa
// (x=678, y=56 na janela, 922 de largura) e o encosta à esquerda da prancha (64..1032, y 97..983) a
// 1,05, deixando a direita para a legenda. A troca para a Visão Geral volta a NOZOOM.
// Posições na prancha (px). Painel SharePoint em (80,200); linhas de 52px a partir de y=312.
const spRow = (k) => [88, 312 + 52 * k];
const tblRow = (k) => [248, 706 + 48 * k];          // linhas 8..10 da tabela de documentos (trilho de 64 + padding 24)
const tr = (x, y) => 'translate(' + x + 'px,' + y + 'px)';
const trs = (p, s) => 'translate(' + p[0] + 'px,' + p[1] + 'px) scale(' + s + ')';
// Câmera da prancha inteira (origem 0,0): centraliza (cx,cy) na escala s.
const CAM0 = 'translate(0px,0px) scale(1)';
const camFocus = (cx, cy, s) => 'translate(' + (960 - s * cx) + 'px,' + (540 - s * cy) + 'px) scale(' + s + ')';
// Cartelas: a câmera abre centrada nas primeiras palavras (centro em px da prancha, e escala) — medidos no Chrome.
const QB_FOCUS = [334, 426, 3];     // "Do pedido" (373px de largura → 1119px na prancha, o mesmo de "Documentos"; medido em 2026-09-14)
const D_FOCUS = [408, 426, 2.4];   // "Documentos" (465px de largura → 1116px na prancha)
const W_FOCUS = [835, 426, 2.2];   // "Seu time de vendas" (715px → 1573px)
// Bolha estacionada: canto superior esquerdo (acima da janela, que começa em y=90) e ponto de partida de
// cada capítulo = canto superior esquerdo da bolha acesa na cartela (px da prancha, medidos no Chrome).
const DOCK_TO = 'translate(64px,24px) scale(.8)';
const DOCK_FROM = [[377, 644], [770, 644], [1142, 645]]; // BID · Documentos · WhatsApp
// Celular (390×780 em 1310,150) centralizado na prancha, ampliado.
const PH_S = ${CURTO ? 1.12 : 1.28};
const phCenter = (dy) => trs([960 - 195 * PH_S - 1310, 540 - 390 * PH_S - 150 + dy], PH_S);

class Component extends DCLogic {
	constructor(props) {
		super(props);
		this.state = { step: 0 };
		this.timer = null; this.t0 = 0; this.total = CUES[CUES.length - 1][1];
		this.frozen = null; // ms decorridos quando pausado
	}
	stepFor(el) { let s = 0; for (let k = 0; k < CUES.length; k++) if (CUES[k][1] <= el) s = k; return s; }
	seek(ms) {
		if (this.frozen != null) this.frozen = ms; else this.t0 = performance.now() - ms;
		this.setState({ step: this.stepFor(ms) });
	}
	startAt(name) { this.seek(CUES[START[name] ?? 0][1]); }
	componentDidMount() {
		if (this.props.pausar) this.frozen = 0;
		this.startAt(this.props.inicio);
		this.timer = setInterval(() => {
			if (this.frozen != null) return;
			const el = performance.now() - this.t0;
			const s = this.stepFor(el);
			if (s !== this.state.step) this.setState({ step: s });
			if (el > this.total + 2600 && (this.props.loop ?? true)) this.startAt('Abertura');
		}, 40);
	}
	componentDidUpdate(prev) {
		if (prev.pausar !== this.props.pausar) {
			if (this.props.pausar) this.frozen = performance.now() - this.t0;
			else { this.t0 = performance.now() - (this.frozen ?? 0); this.frozen = null; }
		}
		if (prev.inicio !== this.props.inicio) this.startAt(this.props.inicio);
		if (prev.tempo !== this.props.tempo) this.seek(Math.max(0, Math.min(${DURACAO / 1000}, Number(this.props.tempo) || 0)) * 1000);
	}
	componentWillUnmount() { clearInterval(this.timer); }
	renderVals() {
		const i = this.state.step;
		// Estado = o do último cue já atingido na lista; antes do primeiro, o default.
		const seq = (def, ...pairs) => { let v = def; for (const [n, s] of pairs) if (i >= I[n]) v = s; return v; };
		const c = {}, st = {};
		// Cartelas (fade) e janela do app (fade)
		c.hint = seq('pre', ['hint', 'show'], ['hintOut', 'exit']);
		c.open = seq('pre', ['open', 'show'], ['openOut', 'exit']);
		c.ch2 = seq('pre', ['openOut', 'show'], ['bZoom', 'show bgin'], ['bLine2', 'show bgin l2'], ['ch2Out', 'show bgin l2 exit']);
		st.qbTx = seq(camFocus(QB_FOCUS[0], QB_FOCUS[1], QB_FOCUS[2]), ['bZoom', CAM0], ['ch2Out', camFocus(960, 540, 0.62)]);
		c.ch1 = seq('pre', ['bidOut', 'show'], ['dZoom', 'show bgin'], ['dLine2', 'show bgin l2'], ['ch1Out', 'show bgin l2 exit']);
		st.dTx = seq(camFocus(D_FOCUS[0], D_FOCUS[1], D_FOCUS[2]), ['dZoom', CAM0], ['ch1Out', camFocus(960, 540, 0.62)]);
		c.ch3 = seq('pre', ['docsOut', 'show'], ['wZoom', 'show bgin'], ['wLine2', 'show bgin l2'], ['ch3Out', 'show bgin l2 exit']);
		st.wTx = seq(camFocus(W_FOCUS[0], W_FOCUS[1], W_FOCUS[2]), ['wZoom', CAM0], ['ch3Out', camFocus(960, 540, 0.62)]);
		c.close = seq('pre', ['waOut', 'show']);${CURTO ? LOGIC_1MIN : ''}
		// Bolha estacionada de cada capítulo: voa na saída da cartela (de DOCK_FROM a DOCK_TO), some nos
		// zooms que cobrem o canto (volta com fade quando a câmera recua), sai quando a cartela seguinte entra.
		c.dock0 = seq('pre', ['ch2Out', 'on'], ['kNova', 'hide'], ['split', 'on re'], ['cut2', 'hide'], ['zoomOut2', 'on re'], ['kFechar', 'hide'], ['bidOut', 'exit']);
		c.dock1 = seq('pre', ['ch1Out', 'on'], ['zoomSp', 'hide'], ['cutSp', 'on re'], ['zoomStatus', 'hide'], ['docsOut', 'exit']);
		c.dock2 = seq('pre', ['ch3Out', 'on'], ['waOut', 'exit']);
		st.dock0 = seq(tr(...DOCK_FROM[0]), ['ch2Out', DOCK_TO]);
		st.dock1 = seq(tr(...DOCK_FROM[1]), ['ch1Out', DOCK_TO]);
		st.dock2 = seq(tr(...DOCK_FROM[2]), ['ch3Out', DOCK_TO]);
		c.win = seq('pre', ['ch2Out', 'show'], ['mkA', 'exit'], ['rst1', 'pre'], ['ch1Out', 'show'], ['docsOut', 'exit'], ['rst2', 'pre'], ['toSys', 'show'], ['waOut', 'exit']);
		// Páginas dentro da janela trocam enquanto ela está invisível.
		c.pgBid = seq('show', ['rst1', 'pre']);
		c.pgDocs = seq('pre', ['rst1', 'show'], ['rst2', 'pre']);
		// A tela do sistema na rota de conversa SAIU (2026-09-18): do celular vai-se direto à Visão Geral (toSys).
		c.pgWa = 'pre'; c.pgVG = seq('pre', ['toSys', 'show']);
		c.crBid = seq('show', ['rst1', 'pre']); c.crDocs = seq('pre', ['rst1', 'show'], ['rst2', 'pre']); c.crWa = 'pre'; c.crHome = seq('pre', ['toSys', 'show']);
		c.navBid = seq('on', ['rst1', '']); c.navDocs = seq('', ['rst1', 'on'], ['rst2', '']); c.navWa = ''; c.navHome = seq('', ['toSys', 'on']);
		c.hdr = ''; // cabeçalho sempre visível (a fase B mostra a tela inteira do sistema, sem zoom)
		// Cap. 1 — BID, o produto principal: Nova cotação (cesta) → modal Disparar → vista dividida
		// (e-mail responde, depois o WhatsApp de outro exportador) → CORTE para o comparativo em zoom →
		// IA sugere → Fechar cotação → OC ao vencedor + feedback aos outros.
		c.btnNova = seq('', ['cNova', 'hover'], ['kNova', '']);
		c.novaOverlay = seq('pre', ['kNova', 'show'], ['kCriar', 'exit']); c.nova = c.novaOverlay;
		c.it1 = seq('pre', ['it1', 'show']); c.it2 = seq('pre', ['it2', 'show']); c.it3 = seq('pre', ['it3', 'show']);
		c.btnCriar = seq('', ['cCriar', 'hover'], ['kCriar', '']);
		c.overlay = seq('pre', ['kCriar', 'show'], ['mkA', 'exit']); c.modal = seq('pre', ['kCriar', 'show short'], ['cut2', 'show'], ['mkA', 'exit']);
		c.pillDisp = seq('on', ['cut2', 'off']); c.pillCmp = seq('off', ['cut2', 'on']);
		c.disp = seq('show', ['cutA2', 'out'], ['cut2', 'gone']); c.cmp = seq('pre', ['cut2', 'show']);
		c.btnFechar = 'show';
		// seleção automática dos exportadores (2026-09-18): ninguém clica. A legenda do cabeçalho troca para
		// "FS1 analisando o mapeamento…", as três linhas que atendem acendem DE UMA VEZ (pedido de 2026-09-18:
		// as três ao mesmo tempo, não em cascata) e já marcam sozinhas, e no fim a legenda vira "3 de 4
		// selecionados pela FS1" e o EXPORTADOR 4 (1 de 3 itens) apaga.
		c.selA = seq('show', ['aiSel', 'exit']); c.selB = seq('pre', ['aiSel', 'show'], ['aiOk', 'exit']); c.selC = seq('pre', ['aiOk', 'show']);
		for (let k = 0; k < 3; k++) { c['exr' + k] = seq('', ['aSel', 'scan sel']); c['xOff' + k] = seq('show', ['aSel', 'exit']); c['xOn' + k] = seq('pre', ['aSel', 'show']); }
		c.exr3 = seq('', ['aiOk', 'skip']); c.xOff3 = 'show'; c.xOn3 = 'pre';
		c.env = seq('', ['kDisp', 'fly'], ['env', 'gone']);
		// e-mail do exportador: entra na vista dividida, recebe o BID, responde; sai quando o WhatsApp entra
		c.outlook = seq('pre', ['split', 'show'], ['waIn', 'exit']);
		c.mailRow = seq('pre', ['mailIn', 'show']); c.mailPane = seq('pre', ['mailOpen', 'show']);
		c.reply = seq('pre', ['replyOpen', 'show']);
		c.t1 = seq('pre', ['t1', 'show']); c.t2 = seq('pre', ['t2', 'show']); c.t3 = seq('pre', ['t3', 'show']); c.t4 = seq('pre', ['t4', 'show']);
		c.mailFly = seq('', ['kSend', 'fly'], ['flyGone', 'gone']);
		st.mailFly = seq(tr(1798, 758), ['kSend', tr(...lpt(800, 430))]);
		// WhatsApp do EXPORTADOR 2: entra no lugar do e-mail, a resposta aparece e voa para o sistema
		c.waExp = seq('pre', ['waIn', 'show'], ['unsplit', 'exit']);
		c.waMsg = seq('pre', ['waMsg', 'show']);
		c.waFly = seq('', ['waSend', 'fly'], ['waGone', 'gone']);
		st.waFly = seq(tr(1830, 786), ['waSend', tr(...lpt(800, 430))]);
		// comparativo: as duas linhas "vivas" chegam lendo (e-mail / WhatsApp) e depois preenchem
		c.aLendo = seq('show', ['read2', 'exit']); c.aLido = seq('pre', ['read2', 'show']);
		c.wLendo = seq('show', ['readWa', 'exit']); c.wLido = seq('pre', ['readWa', 'show']);
		// Com a câmera já recuada, as quatro linhas recomendadas recebem a MESMA varredura azul do "lendo…"
		// (.crow.ai), em cascata (uma a cada 0,3 s), e ficam varrendo até a IA marcar as vencedoras (kVenc,
		// sem cursor); o selo de cada linha entra logo depois de a varredura dela começar.
		for (let k = 1; k <= 4; k++) c['sug' + k] = seq('pre', ['sug' + k, 'show']);
		c.rowWin = seq('', ['cut2', 'ai'], ['read2', 'got'], ['bk1', 'ai'], ['kVenc', 'win']); c.cbOff = seq('show', ['kVenc', 'exit']); c.cbOn = seq('pre', ['kVenc', 'show']);
		c.rowWa = seq('', ['cut2', 'ai'], ['readWa', 'got'], ['bk2', 'ai'], ['kVenc', '']);
		c.rowB2a = seq('', ['bk3', 'ai'], ['kVenc', '']); c.rowB2b = seq('', ['bk4', 'ai'], ['kVenc', 'win']);
		c.cb2Off = seq('show', ['kVenc', 'exit']); c.cb2On = seq('pre', ['kVenc', 'show']);
		// fechamento da cotação: OC emitida ao vencedor, feedback aos não escolhidos
		c.fchOverlay = seq('pre', ['kFechar', 'show'], ['ocFire', 'exit']); c.fch = c.fchOverlay;
		// as duas OCs em PDF entram sobre um véu escuro e ganham o carimbo "enviada" uma depois da outra
		// (o véu fica até o fim da cena do BID pelo WhatsApp, que vem logo depois; as páginas e o cabeçalho saem em ocOut)
		c.ocVeil = seq('pre', ['ocFire', 'show'], ['botOut', 'exit']); c.ocHead = seq('pre', ['ocFire', 'show'], ['ocOut', 'exit']);
		c.ocPg1 = seq('pre', ['ocFire', 'show'], ['ocOut', 'exit']); c.ocPg2 = c.ocPg1;
		c.ocSt1 = seq('pre', ['ocS1', 'show'], ['ocOut', 'exit']); c.ocSt2 = seq('pre', ['ocS2', 'show'], ['ocOut', 'exit']);
		// BID pelo WhatsApp (2026-09-21): o celular do GESTOR DE COMPRAS entra sobre o véu escuro — status do BID, criação
		// de um novo com prévia e "sim" — e sai antes da cena Internacional × Local. É o mesmo celular do cap. 3.
		c.chatC = seq('show', ['botOut', 'exit']);
		for (let k = 1; k <= 6; k++) c['b' + k] = seq('pre', ['b' + k, 'show']);
		c.bt1 = seq('pre', ['btyp1', 'show'], ['b2', 'exit']); c.bt2 = seq('pre', ['btyp2', 'show'], ['b4', 'exit']); c.bt3 = seq('pre', ['btyp3', 'show'], ['b6', 'exit']);
		c.bc1 = seq('', ['botIn', 'show'], ['bc2', 'past'], ['botOut', 'exit']); c.bc2 = seq('', ['bc2', 'show'], ['botOut', 'exit']);
		c.ocA = seq('show', ['oc1', 'exit']); c.ocB = seq('pre', ['oc1', 'show']);
		c.fbA = seq('show', ['fb1', 'exit']); c.fbB = seq('pre', ['fb1', 'show']);
		// Cap. 2 — SharePoint: a câmera fecha no painel enquanto ele entra; os três arquivos novos (nome
		// "nada a ver") sincronizam sozinhos, a IA lê e RENOMEIA, e, com a pilha já voando, CORTA para a
		// vista inteira; a IA lê a validade na tabela; depois a cobrança dos vencidos.
		st.cam = seq(CAM0, ['zoomSp', camFocus(470, 500, 1.7)], ['cutSp', CAM0]);
		c.cam = seq('', ['cutSp', 'snap'], ['spOut', '']);
		c.sp = seq('pre', ['spIn', 'show'], ['spOut', 'exit']);
		c.spHdrS = seq('show', ['done3', 'exit']); c.spHdrOk = seq('pre', ['done3', 'show']);
		for (let k = 0; k < 3; k++) {
			const sy = 'sync' + (k + 1), dn = 'done' + (k + 1), rn = 'ren' + (k + 1), r = 'r' + (k + 1);
			c['sp' + k] = seq('', [sy, 'sel'], [dn, 'ok']);
			c['spM' + k] = seq('show', [sy, 'exit']); c['spS' + k] = seq('pre', [sy, 'show'], [dn, 'exit']); c['spD' + k] = seq('pre', [dn, 'show'], [rn, 'exit']); c['spI' + k] = seq('pre', [rn, 'show']);
			c['spN' + k] = seq('show', [rn, 'exit']); c['spR' + k] = seq('pre', [rn, 'show']);
			c['card' + k] = seq('', ['lift', 'lift'], ['drop', 'fly'], [r, 'gone']);
			st['card' + k] = seq(tr(...spRow(k)), ['drop', tr(...tblRow(k))]);
			c[r] = seq('pre', [r, 'show ai'], ['read', 'show']);
		}
		c.sp3 = ''; c.sp4 = ''; c.sp5 = '';
		c.lendo = seq('show', ['read', 'exit']); c.lido = seq('pre', ['read', 'show']);
		c.w1 = seq('', ['warn', 'warn'], ['rxRow', 'ok']); c.w2 = seq('', ['warn', 'warn red']); // Halal (a vencer → vigente em rxRow) e Kosher (vencido)
		c.cobOverlay = seq('pre', ['cobDet', 'show'], ['rxOut', 'exit']); c.cob = seq('pre', ['cobDet', 'show'], ['cobOut', 'exit']);
		// resposta do exportador (2026-09-21): o diálogo troca em cross-fade sob o mesmo véu; três passos (lê → salva no
		// drive → baixa a pendência); ao sair, a câmera volta às linhas em atenção e a Halal vira Vigente (15/09/2027)
		c.rx = seq('pre', ['rxIn', 'show'], ['rxOut', 'exit']);
		// a pílula do e-mail sai do rodapé do diálogo para a direita; a do anexo volta de lá e pousa no lugar do novo diálogo
		c.docOut = seq('', ['docOut', 'fly'], ['cobOut', 'gone']); st.docOut = seq(tr(900, 545), ['docOut', tr(1180, 380)]);
		c.docBack = seq('', ['docBack', 'fly'], ['rxIn', 'gone']); st.docBack = seq(tr(1180, 330), ['docBack', tr(560, 350)]);
		c.rx0p = 'pre'; c.rx0a = seq('show', ['rxRead', 'exit']); c.rx0b = seq('pre', ['rxRead', 'show']);
		c.rx1p = seq('show', ['rxRead', 'exit']); c.rx1a = seq('pre', ['rxRead', 'show'], ['rxSave', 'exit']); c.rx1b = seq('pre', ['rxSave', 'show']);
		c.rx2p = seq('show', ['rxSave', 'exit']); c.rx2a = seq('pre', ['rxSave', 'show'], ['rxDone', 'exit']); c.rx2b = seq('pre', ['rxDone', 'show']);
		c.rxV0 = seq('show', ['rxRow', 'exit']); c.rxV1 = seq('pre', ['rxRow', 'show']); c.rxS0 = c.rxV0; c.rxS1 = c.rxV1;
		c.cobA = seq('show', ['sent', 'exit']); c.cobB = seq('pre', ['sent', 'show']);
		c.cobF0 = seq('show', ['sent', 'exit']); c.cobF1 = seq('pre', ['sent', 'show']);
		// Cap. 3 — fase A: só o celular do representante, centralizado (áudio → "digitando…" → a IA
		// responde com os números → confirma → cotação emitida → pede COA/NF/boleto → a IA manda),
		// timeline de legendas à esquerda. Fase B (toSys): o celular some e a tela inteira do sistema
		// aparece; a câmera fecha na conversa (encostada à esquerda) e a legenda entra à direita (a
		// conversa está salva); fade com deslocamento para a Visão Geral, sem zoom, com o mural de
		// conversas atualizando ao vivo; no fim, a faixa escura com a legenda.
		// o celular sai em fade no toSys; o painel da conversa do sistema entra no mesmo lugar (cross-fade)
		c.phone = seq('pre', ['botIn', 'show'], ['botOut', 'exit'], ['phoneIn', 'show'], ['toSys', 'exit']);
		st.phone = seq(phCenter(70), ['botIn', phCenter(0)], ['mktIn', phCenter(70)], ['phoneIn', phCenter(0)]);
		c.p1 = seq('pre', ['p1', 'show']); c.p2 = seq('pre', ['p2', 'show']); c.p3 = seq('pre', ['p3', 'show']);
		c.p4 = seq('pre', ['p4', 'show']); c.p5 = seq('pre', ['p5', 'show']); c.p6 = seq('pre', ['p6', 'show']);
		c.p7 = seq('pre', ['p7', 'show']); c.p8 = seq('pre', ['p8', 'show']); c.p9 = seq('pre', ['p9', 'show']); c.p10 = seq('pre', ['p10', 'show']);
		// conversa limpa do resumo: a primeira sai em fade, a segunda entra no mesmo lugar
		c.chatA = seq('pre', ['phoneIn', 'show'], ['chatB', 'exit']); c.chatB = seq('pre', ['chatB', 'show']);
		c.rs1 = seq('pre', ['rs1', 'show']); c.rs2 = seq('pre', ['rs2', 'show']); c.rs3 = seq('pre', ['rs3', 'show']);
		c.rt = seq('pre', ['rtyp', 'show'], ['rs3', 'exit']);
		c.pt1 = seq('pre', ['ptyp1', 'show'], ['p2', 'exit']); c.pt2 = seq('pre', ['ptyp2', 'show'], ['p4', 'exit']); c.pt3 = seq('pre', ['ptyp3', 'show'], ['p6', 'exit']);
		c.pt4 = seq('pre', ['ptyp4', 'show'], ['p8', 'exit']); c.pt5 = seq('pre', ['ptyp5', 'show'], ['p10', 'exit']);
		// "digitando…" + glow: os três "digitando" do BID pelo WhatsApp (cap. 1) vêm antes dos do cap. 3
		const TYP = [['btyp1', 'b2'], ['btyp2', 'b4'], ['btyp3', 'b6'], ['ptyp1', 'p2'], ['ptyp2', 'p4'], ['ptyp3', 'p6'], ['ptyp4', 'p8'], ['ptyp5', 'p10'], ['rtyp', 'rs3']];
		c.phOn = seq('show', ...TYP.flatMap(([t, m]) => [[t, 'exit'], [m, 'show']]));
		c.glow = seq('pre', ...TYP.flatMap(([t, m]) => [[t, 'show'], [m, 'exit']]));
		c.phTyp = c.glow;
		// timeline de legendas: cada passo entra e fica (esmaece quando o seguinte entra); tudo sai no toSys
		c.cap1 = seq('', ['cap1', 'show'], ['cap2', 'past'], ['chatB', 'exit']${CAP_FIM}); c.cap2 = seq('', ['cap2', 'show'], ['cap3', 'past'], ['chatB', 'exit']${CAP_FIM});
		c.cap3 = seq('', ['cap3', 'show'], ['cap4', 'past'], ['chatB', 'exit']${CAP_FIM}); c.cap4 = seq('', ['cap4', 'show'], ['cap5', 'past'], ['chatB', 'exit']);
		c.cap5 = seq('', ['cap5', 'show'], ['chatB', 'exit']); // rastreio da NF (2026-09-21)
		// a timeline reseta com a conversa do resumo: dois passos novos, do zero (cap6/cap7 desde 2026-09-21)
		c.cap6 = seq('', ['cap6', 'show'], ['cap7', 'past'], ['toSys', 'exit']); c.cap7 = seq('', ['cap7', 'show'], ['toSys', 'exit']);
		c.veil2 = seq('pre', ['veil2In', 'show'], ['veil2Out', 'exit']);
		// Visão Geral: duas conversas recebem mensagens novas e o semáforo delas vira verde
		c.vgA = seq('pre', ['vg1', 'show']); c.vgB = seq('pre', ['vg2', 'show']); c.vgC = seq('pre', ['vg3', 'show']); c.vgD = seq('pre', ['vg4', 'show']);
		c.stJ0 = seq('show', ['vg1', 'exit']); c.stJ1 = seq('pre', ['vg1', 'show']); c.stR0 = seq('show', ['vg3', 'exit']); c.stR1 = seq('pre', ['vg3', 'show']);
		c.tJ0 = c.stJ0; c.tJ1 = c.stJ1; c.tR0 = c.stR0; c.tR1 = c.stR1;
		// as legendas esperam a câmera encostar a janela à esquerda (senão aparecem por cima da demo)
		c.capE1 = seq('', ['capMail', 'show'], ['waIn', 'exit']); c.capE2 = seq('', ['waIn', 'show'], ['unsplit', 'exit']);
		c.capSys = seq('', ['capMail', 'show'], ['unsplit', 'exit']); c.zone = seq('pre', ['split', 'show'], ['unsplit', 'exit']);
		c.veil = seq('pre', ['veilIn', 'show'], ['veilOut', 'exit']);
		// Internacional × Local (fecho do capítulo): dois recibos lado a lado; as linhas acendem em pares.
		// É a ÚLTIMA cena do BID: a janela e o modal já saíram por baixo dela (mkA), e ela esmaece sobre o chão.
		c.mkt = seq('pre', ['mktIn', 'show'], ['mkFoot', 'show flip'], ['mktOut', 'exit flip']); c.mkHead = seq('pre', ['mktIn', 'show']); c.mkCards = seq('pre', ['mkA', 'show']);
		c.mk1 = seq('pre', ['mk1', 'show']); c.mk2 = seq('pre', ['mk2', 'show']); c.mk3 = seq('pre', ['mk3', 'show']); c.mkR = seq('pre', ['mkR', 'show']);
		c.mkFoot = seq('pre', ['mkFoot', 'show']);
		// No sistema, a conversa inteira já está salva quando a janela aparece.
		for (const m of ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8']) c[m] = 'show';
		// Câmera da janela: zoom nos diálogos, vista dividida (janela encostada à esquerda), comparativo, painel da conversa
		st.zoom = seq(NOZOOM,
			['kNova', focus(...F_DLG)], ['kCriar', focus(...F_DISP)],
			['split', place(LEFT[0], LEFT[1], LEFT[2])], ['unsplit', NOZOOM],
			['cut2', focus(ZP[0], ZP[1], ZP[2])], ['zoomOut2', NOZOOM],
			['kFechar', focus(...F_DLG)], ['ocFire', NOZOOM],
			['zoomStatus', focus(900, 660, 2.1)], ['panWarn', focus(...F_WARN)],
			['cobDet', focus(...F_DLG)], ['rxOut', focus(...F_WARN)],
			['rst2', NOZOOM]);
		// O comparativo já entra em zoom: a câmera SALTA no instante do corte.
		c.zoomer = seq('', ['cut2', 'snap'], ['readWa', '']);
		// Cursor (coordenadas da prancha). Nos zooms segue a câmera (zpt). Na vista dividida não há cursor:
		// o fornecedor responde sozinho (e-mail e WhatsApp saem sem clique). No comparativo a câmera recua
		// (zoomOut2) antes de a IA marcar as vencedoras (kVenc, sem cursor); o cursor só volta em Fechar cotação.
		const CP = {
			idle: [900, 620],
			cNova: [1664, 188],
			cCriar: zpt(1092, 658, F_DLG),
			cDisp: zpt(1295, 628, F_DISP),
			cFechar: [1464, 903],
		};
		const cx = seq(null, ['cNova', 'cNova'], ['cCriar', 'cCriar'], ['cDisp', 'cDisp'],
			['cFechar', 'cFechar'], ['rst1', 'idle']);
		const p = cx ? CP[cx] : CP.idle;
		st.cur = tr(p[0], p[1]);
		const curOn = seq(false, ['cNova', true], ['kNova', false], ['cCriar', true], ['kCriar', false], ['cDisp', true], ['kDisp', false],
			['cFechar', true], ['kFechar', false],
			);
		const click = seq('', ['kNova', 'kA'], ['kCriar', 'kB'], ['kDisp', 'kB'], ['kFechar', 'kA']);
		c.cur = (curOn ? '' : 'hide') + ' ' + click;
		// Envelopes: do botão "Disparar BID" às linhas dos exportadores (coordenadas do modal).
		for (let k = 0; k < 3; k++) st['env' + k] = seq(tr(1040, 398), ['kDisp', tr(1090, 154 + 52 * k)]);
		return { c, st, replay: () => this.startAt('Abertura') };
	}
}
`

// Estilos por envelope (transform hole individual): substitui o marcador no HTML.
let html = stage
for (let k = 0; k < 3; k++) {
	html = html.replace(`<span class="env {{c.env}} e${k}" style="position:absolute;left:0;top:0;`, `<span class="env {{c.env}} e${k}" style="position:absolute;left:0;top:0;transform:{{st.env${k}}};`)
}

const doc = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500;600&amp;display=swap">
  <style>${css}</style>
</helmet>
${html}
</x-dc>
<script data-dc-script data-props='{"inicio":{"editor":"enum","options":["Abertura","BID","SharePoint","Conversas"],"default":"Abertura","section":"Reprodução"},"tempo":{"editor":"range","min":0,"max":${DURACAO / 1000},"step":0.5,"unit":"s","default":0,"section":"Reprodução"},"pausar":{"editor":"boolean","default":false,"section":"Reprodução"},"loop":{"editor":"boolean","default":true,"section":"Reprodução"},"$preview":{"width":1920,"height":1080}}'>${logic}</script>
</body>
</html>
`
if (!CURTO) fs.writeFileSync('Main.dc.html', doc)
if (!CURTO) fs.writeFileSync(
	'canvas.json',
	JSON.stringify(
		{
			artboards: [
				{ file: 'Main.dc.html', x: 0, y: 0, w: 1920, h: 1080, title: `Showcase · ${RELOGIO}`, is_interactive: true },
				{ file: 'Mascote.dc.html', x: 0, y: 1240, w: 1920, h: 900, title: 'Mascote' }
			],
			annotations: [
				{
					id: 'roteiro',
					x: 2000,
					y: 0,
					w: 380,
					text:
						'Roteiro (' + RELOGIO + ' no relógio · conteúdo até ~2:56, o fechamento segura 3 s · 2 s de tela em branco na cabeça · revisão 2026-09-11 a partir do feedback externo: nomes genéricos, trilho de ícones, câmera fechada nos diálogos, fluxos completos)\n\n0:00 Tela em branco — cabeça de 2 s para gravação (só o ground da LP com o film grain)\n0:02 Abertura (6,7 s) — a marca vem primeiro e o produto depois: o wordmark Faradays sobe sozinho no centro da tela, sai por cima e, no mesmo lugar, entra FS1 grande com "por Faradays" embaixo (a empresa vira assinatura); então a coluna assenta e sobem o slogan "IA para indústrias que compram e vendem muito bem" ("IA" e "muito bem" acendem juntos), a timeline das três bolhas e, por último, a linha PARCEIROS DA com as marcas e os nomes de Microsoft e Meta (os quatro quadrados e o símbolo do infinito, marcas oficiais), o filete no centro exato do quadro\n0:08 Do pedido à ordem de compra em um clique. / A IA interage. Você só aprova. — cartela de 4,8 s com zoom ("Do pedido" grande → zoom out revela as duas linhas); na saída, a bolha acesa da timeline voa para o canto superior esquerdo e fica lá como selo do capítulo durante a demo (some nos zooms que cobrem o canto; o mesmo nos outros dois capítulos); demo: lista com as abas Todos · Internacional · Local (a CL-2026-003 leva o selo Local) → Nova cotação (diálogo em zoom 1,6, com o toggle Internacional | Local do produto no topo: PRODUTO 1/2/3 entram na cesta → Criar e abrir) → modal enxuto e centrado na tela (1,55): a própria FS1 varre o mapeamento — a legenda vira "FS1 cruzando o cadastro produto × exportador…", as três linhas que atendem acendem juntas no gradiente e se marcam sozinhas, "3 de 4 selecionados · só quem fornece estes itens" e o EXPORTADOR 4 apaga (ninguém escolhe à mão: vai só a quem está no cadastro para estes produtos) — o cursor só entra para Disparar BID → envelopes → vista dividida: à esquerda o rótulo "FS1"; à direita a ZONA do fornecedor (painel de fundo + rótulo "Fornecedor · Exportador n"): o Outlook do EXPORTADOR 1 recebe e responde → sai; o WhatsApp Business do EXPORTADOR 2 entra e responde, com tempo para ler → as duas respostas voam → CORTE para o comparativo em zoom (lendo e-mail… / lendo WhatsApp…) → a câmera recua e só então as quatro linhas escolhidas recebem a MESMA varredura azul do "lendo…", em cascata (uma a cada 0,3 s), com o selo de cada uma entrando logo depois (a tabela mostra preço cotado · prazo · CUSTO FIN. do prazo · COMPARÁVEL, que é a régua da IA) → VÉU na parte de baixo: a ação para, um gradiente escuro sobe pelo rodapé com a legenda centralizada ("A IA compara na mesma base e aponta, em cada produto, o melhor FOB, o melhor CIF e o melhor preço considerando o custo financeiro."), espera e desce → a IA MARCA as vencedoras sozinha (sem cursor: as duas linhas inteiras ficam verdes, com o número comparável em verde, e as caixas marcam) → Fechar cotação → diálogo Cotação fechada: duas vencedoras (EXPORTADOR 1 no PRODUTO 1, EXPORTADOR 2 no PRODUTO 2), OC-2026-031 e OC-2026-032 emitidas + feedback aos não escolhidos (2) → CENA DAS ORDENS DE COMPRA: a tela escurece e os dois PDFs entram lado a lado — marca Faradays, número, fornecedor com cc, FATURAR PARA (filial e CNPJ), tabela em quilo (produto · qtd · preço/kg · total), pagamento/embarque/destino, COA anexo, "Observações do sistema" e total — sob o cabeçalho "DISPARO DA ORDEM DE COMPRA · AUTOMÁTICO / Fechou a cotação? A OC já saiu, uma para cada fornecedor.", e recebem o carimbo ENVIADA um depois do outro, com a linha do envio (para quem, cc, PDF anexo) embaixo de cada página → CENA DO BID PELO WHATSAPP (13,5 s, sobre o mesmo véu escuro): o celular do GESTOR DE COMPRAS entra com a timeline branca à esquerda — "Cria um BID de 10 t de PRODUTO 3 pros mesmos exportadores." → PRÉVIA (item, 3 do cadastro, canais, prazo) e "Disparo? Responda sim" → "Sim" → "BID CC-2026-013 disparado para EXPORTADOR 1, 2 e 3" → e só então "E o comparativo do CC-2026-012?" → a FS1 responde com as melhores por produto, as OCs enviadas e o feedback (a ordem foi invertida em 2026-09-22: cria o BID primeiro, o comparativo fecha a cena e emenda na tela Internacional × Local) → CENA Internacional × Local (10,5 s, fecho do capítulo, tela própria): "Cotação local e internacional na mesma plataforma." / "A IA entende todo tipo de cotação e os custos/impostos envolvidos.", o toggle Internacional | Local no topo e DOIS RECIBOS lado a lado com a mesma estrutura — O QUE ELE COTOU (Preço FOB 4,85 USD/kg ┃ Preço cheio 31,90 R$/kg) → O QUE A FS1 AJUSTA (+ frete da premissa 0,14 → CIF · + prazo 90 dias = base ┃ − ICMS 18% 5,74 · − PIS/COFINS 9,25% 2,42, IPI fora) → A RÉGUA em azul (CIF com custo financeiro 4,99 USD/kg ┃ NET 23,74 R$/kg); as linhas acendem em pares, esquerda e direita juntas; quando o rodapé entra ("Você escolhe o tipo de cotação e a IA entende a lógica."), o toggle passa a alternar sozinho e o recibo do mercado escolhido ganha o anel azul enquanto o outro esmaece. Bolha do capítulo estacionada no canto durante a demo (some nos zooms)\n1:28 Documentos dos seus produtos vencendo? / Ainda precisa cobrar os fornecedores? — cartela com a mesma coreografia da do BID ("Documentos" grande → zoom out revela a frase → linha 2 sobe); a câmera fecha no painel do drive já conectado; 3 arquivos com nome nada a ver (scan_0231.pdf…) sincronizam → a IA lê e RENOMEIA no padrão → pilha voa para a tabela, CORTE para a vista inteira → linhas lendo… → validade (zoom nos status) → a câmera SOBE até as duas linhas em atenção (Halal a vencer, Kosher vencido), que ganham um gradiente varrendo na cor do status (âmbar e vermelho, a mesma varredura das linhas lidas pela IA) → COBRANÇA AUTOMÁTICA: ninguém clica — lida a validade, a FS1 vê o vencido e o a vencer e dispara sozinha 1 e-mail por fornecedor, no prazo programado — e a pílula da cobrança VOA do diálogo para o exportador (chips: todo dia às 08:00 · follow-up a cada 2 dias · para depois de 3 sem resposta; disparando… → 2 e-mails enviados) → a pílula do ANEXO VOLTA de lá e vira a RESPOSTA DO EXPORTADOR (2 dias depois, diálogo "Documento recebido"): o anexo do e-mail é lido (Halal · PRODUTO 2 · MARCA A · válido até 15/09/2027), SALVO na pasta do produto no drive com o nome padrão e a pendência baixa sozinha, com retorno na mesma conversa; a câmera volta às linhas e a Halal vira Vigente\n2:01 Seu time de vendas inteiro no WhatsApp — cartela com a mesma coreografia ("Seu time de vendas" grande → zoom out → "no WhatsApp" sobe); fase A: só o celular, centralizado, com pausa para ler cada mensagem: o pedido chega como o representante quiser mandar — áudio, texto ou foto (aqui um áudio, com onda + transcrição) → digitando… (glow Siri) → IA responde com preço de tabela, último cotado e último faturado (com as datas), lead time, data de entrega e crédito, COM DOIS ALERTAS EM VERMELHO (a data de entrega "fora do pedido mínimo"; o crédito que não cobre) e as duas saídas ("Mudo para FOB ou subo para 5 t?" · "Mude o pagamento para à vista ou peça mais crédito ao financeiro.") → o representante muda para FOB, sobe para 5 t e resolve o crédito ele mesmo com o financeiro (a IA não pede crédito por ele) → cotação COT-V-0188 emitida (PDF); timeline de legendas à esquerda (5 passos que ficam). → pede COA + NF → IA manda COA, NF 12.345 e boleto → pede a FICHA TÉCNICA → IA manda a ficha na revisão vigente → pergunta ONDE ESTÁ A NF 12.340 → a IA responde com faturamento, transportadora, status e previsão de entrega (ainda no celular) → a conversa dá lugar a uma CONVERSA LIMPA: no horário configurado, a FS1 manda o RESUMO DO DIA com projeção (faturado hoje, mês até agora, projeção × meta; o gestor recebe o consolidado) → ele pede o RELATÓRIO DE FATURAMENTO → a FS1 responde com volume (t) e faturamento (R$ mi) de junho a setembro em barras, mais o PDF; a timeline de legendas RESETA com a conversa limpa e ganha 2 passos novos (resumo/projeção e relatório). Fase B: o celular some e a Visão Geral aparece direto (a tela da rota de conversa saiu): à esquerda o RANKING dos representantes nos últimos 7 dias (#, nome, valor cotado, volume, cotações, itens — Carlos Mendes em 1º, barra do valor sob cada nome) e, à direita, o mural com 6 representantes e semáforo (verde ao vivo · lima cotou hoje · âmbar parado); João Pereira recebe mensagens novas e vira verde (o rótulo de tempo vira "agora"), aos 3,5 s a faixa escura sobe com a legenda "Todas as conversas dos representantes, em tempo real." — nada chega enquanto ela está em cena —, desce, e Renata Alves recebe as dela\n2:56 Fechamento — logo com a bandeira em gradiente de IA + barra de busca digitando www.faradays.io centralizado + botão "Get in touch"; segura 3 s e o vídeo recomeça (loop)\n\nTransições: cartela ↔ demo em fade; match cut seco no disparo→comparativo e no drive→tabela.\n\nChips: Início pula ao capítulo; Tempo vai a um instante; Pausar congela; Loop repete.'
				}
			],
			launch: { view: 'focused', file: 'Main.dc.html' }
		},
		null,
		'\t'
	)
)
if (!CURTO) console.log('ok', (doc.length / 1024).toFixed(0) + ' KB')

/* ---------------- standalone (sem o editor): index.html ------------------ */
// Troca os holes por data-attrs e reaproveita a MESMA classe Component
// (timeline + renderVals) com um runtime mínimo que pinta class/transform.
const toStandalone = (h) =>
	h
		.replace(/class="([^"]*)"/g, (m, cls) => {
			const mm = cls.match(/\{\{c\.(\w+)\}\}/)
			if (!mm) return m
			const base = cls.replace(/\{\{c\.\w+\}\}/, '').replace(/\s+/g, ' ').trim()
			return `class="${base}" data-c="${mm[1]}" data-base="${base}"`
		})
		.replace(/style="([^"]*)"/g, (m, sty) => {
			const mm = sty.match(/transform:\{\{st\.(\w+)\}\};?/)
			if (!mm) return m
			return `style="${sty.replace(mm[0], '')}" data-st="${mm[1]}"`
		})

// Tema escuro do 1 min: as cores que não vêm dos tokens. A ordem importa (bordas claras antes de virar texto claro).
const ESCURO_1MIN = [
	['rgba(10,10,10,.58)', 'rgba(0,0,0,.62)'], ['rgba(10,10,10,', 'rgba(255,255,255,'],
	['rgba(0,0,0,.045)', 'rgba(255,255,255,.06)'], ['solid rgba(0,0,0,.08)', 'solid rgba(255,255,255,.1)'],
	['rgba(250,250,250,.8)', 'rgba(10,10,10,.8)'], [/rgba\(235,235,235,[.\d]+\)/g, 'rgba(255,255,255,.04)'],
	['linear-gradient(#ffffff,#ffffff) padding-box', 'linear-gradient(#171717,#171717) padding-box'],
	['#e5e5e5', '#2e2e2e'], ['#eeeeee', '#2a2a2a'], ['background:#ffffff', 'background:#171717'],
	['#efeae2', '#0b141a'], ['#f0f2f5', '#202c33'], ['#d1f4d0', '#005c4b'], ['#dbe7f9', '#1c2a44'],
	['color:#0a0a0a', 'color:#fafafa'], ['#111111', '#ededed'], ['#222222', '#e5e5e5'], ['#333333', '#d4d4d4'],
	['#3b3b3b', '#d4d4d4'], ['#555555', '#a1a1a1'], ['#6b6b6b', '#a1a1a1'], ['#7a7a7a', '#8a8a8a'],
]
const escurecer = (h) => (CURTO ? ESCURO_1MIN.reduce((a, [de, para]) => (de instanceof RegExp ? a.replace(de, para) : a.split(de).join(para)), h) : h)
const standaloneHtml = toStandalone(html)
if (/\{\{/.test(standaloneHtml)) throw new Error('hole sobrando no standalone: ' + standaloneHtml.match(/\{\{[^}]*\}\}/)[0])

const runtime = `
class DCLogic { constructor(props) { this.props = props } }
${logic}
const params = new URLSearchParams(location.search)
// Repete por padrão (vídeo demonstrativo); ?noloop para parar no fechamento.
const props = { inicio: params.get('inicio') || 'Abertura', loop: !params.has('noloop'), pausar: params.has('pause'), tempo: 0 }
const comp = new Component(props)
const elsC = [...document.querySelectorAll('[data-c]')], elsS = [...document.querySelectorAll('[data-st]')]
function paint() {
	const v = comp.renderVals()
	for (const el of elsC) el.className = (el.dataset.base + ' ' + (v.c[el.dataset.c] ?? '')).trim()
	for (const el of elsS) el.style.transform = v.st[el.dataset.st] ?? ''
}
comp.setState = function (s) { Object.assign(this.state, s); paint() }
document.querilySelectorAll = null
comp.componentDidMount()
if (params.has('t')) comp.seek(Math.max(0, Number(params.get('t')) || 0) * 1000)
paint()
// Ajusta a prancha 1920×1080 à janela.
const fitEl = document.querySelector('.fit')
function fit() {
	const vv = window.visualViewport, w = vv ? vv.width : innerWidth, h = vv ? vv.height : innerHeight
	const s = Math.min(w / 1920, h / 1080)
	fitEl.style.transform = 'translate(' + (w - 1920 * s) / 2 + 'px,' + (h - 1080 * s) / 2 + 'px) scale(' + s + ')'
}
addEventListener('resize', fit); addEventListener('orientationchange', fit)
if (window.visualViewport) visualViewport.addEventListener('resize', fit)
fit()
// Teclado: espaço pausa/retoma · ← → capítulo anterior/próximo · R reinicia · 1/2/3 pulam ao capítulo
const CH = ${CURTO ? "[['Problema', 0], ['Solução', CUES[I.open][1]], ['Demo', CUES[I.kc1][1]], ['Recursos', CUES[I.kc4][1]], ['CTA', CUES[I.waOut][1]]]" : "[['Abertura', 0], ['BID', CUES[I.openOut][1]], ['Documentos', CUES[I.bidOut][1]], ['Conversas', CUES[I.docsOut][1]], ['Fechamento', CUES[I.waOut][1]]]"}
function elapsed() { return comp.frozen != null ? comp.frozen : performance.now() - comp.t0 }
const hint = document.querySelector('.hint'); let hintTimer = null
function say(txt) { hint.textContent = txt; hint.classList.add('on'); clearTimeout(hintTimer); hintTimer = setTimeout(() => hint.classList.remove('on'), 1400) }
let togglePause = function () {
	if (comp.frozen != null) { comp.t0 = performance.now() - comp.frozen; comp.frozen = null }
	else comp.frozen = performance.now() - comp.t0
}
function jump(dir) {
	const el = elapsed()
	const target = dir > 0 ? CH.find((c) => c[1] > el + 300) : [...CH].reverse().find((c) => c[1] < el - 800)
	if (!target) return
	comp.seek(target[1]); say(target[0])
}
addEventListener('keydown', (e) => {
	if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePause() }
	else if (e.key === 'ArrowRight') { e.preventDefault(); jump(1) }
	else if (e.key === 'ArrowLeft') { e.preventDefault(); jump(-1) }
	else if (e.key === 'r' || e.key === 'R') { comp.startAt('Abertura'); say('Do início') }
	else if (e.key === '1') { comp.startAt('BID'); say('BID') }
	else if (e.key === '2') { comp.startAt('SharePoint'); say('Documentos') }
	else if (e.key === '3') { comp.startAt('Conversas'); say('Conversas') }
	else if (e.key === 'f' || e.key === 'F') toggleFS()
})
// Clique/toque na prancha pausa/retoma (fora do botão de replay e da timeline).
fitEl.addEventListener('click', (e) => { if (!e.target.closest('.tl')) togglePause() })
// Controles: timeline por capítulo embaixo + play/pause no centro. Aparecem ao passar o mouse
// (somem 2,2 s depois, se estiver rodando), ficam fixos enquanto pausado e por 1,4 s após um pulo.
const tl = document.querySelector('.tl'), track = tl.querySelector('.tl-track'), clock = tl.querySelector('.tl-clock'), shade = document.querySelector('.tl-shade'), pp = document.querySelector('.pp')
let ctlTimer = null
// Em tela cheia (modo apresentação/gravação) nenhum overlay aparece — nem ao mexer o
// mouse, nem pausado; o cursor também fica oculto. Para sair: Esc ou F.
function quiet() { return !!document.fullscreenElement }
function setControls(on) { on = on && !quiet(); tl.classList.toggle('on', on); shade.classList.toggle('on', on); pp.classList.toggle('on', on); fitEl.classList.toggle('nocur', !on) }
function showControls(temp) {
	setControls(true); clearTimeout(ctlTimer)
	if (temp) ctlTimer = setTimeout(() => { if (comp.frozen == null) setControls(false) }, 1100)
}
fitEl.addEventListener('mousemove', () => showControls(true))
fitEl.addEventListener('mouseleave', () => { if (comp.frozen == null) { clearTimeout(ctlTimer); setControls(false) } })
const segs = CH.map((c, k) => {
	const start = c[1], end = k + 1 < CH.length ? CH[k + 1][1] : comp.total
	const el = document.createElement('div'); el.className = 'seg'; el.style.flex = String(end - start)
	el.innerHTML = '<div class="fill"></div><span class="lb">' + c[0] + '</span>'
	el.addEventListener('click', (e) => { const r = el.getBoundingClientRect(); comp.seek(start + (end - start) * ((e.clientX - r.left) / r.width)); say(c[0]) })
	track.appendChild(el)
	return { el, start, end }
})
// Rótulo que não cabe no trecho (Abertura/Fechamento no celular) fica escondido.
function fitLabels() { for (const sg of segs) { const lb = sg.el.querySelector('.lb'); lb.style.visibility = ''; if (lb.offsetWidth > sg.el.offsetWidth - 6) lb.style.visibility = 'hidden' } }
addEventListener('resize', fitLabels); fitLabels()
// Anel de cada capítulo: o arco fecha da saída da cartela (chXOut) ao fim do capítulo.
const fmt = (ms) => { const t = Math.max(0, Math.round(ms / 1000)); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0') }
function updateTL() {
	const el = Math.min(elapsed(), comp.total)
	for (const sg of segs) {
		const f = el <= sg.start ? 0 : el >= sg.end ? 1 : (el - sg.start) / (sg.end - sg.start)
		sg.el.querySelector('.fill').style.width = (f * 100) + '%'
		sg.el.classList.toggle('active', el >= sg.start && el < sg.end)
	}
	clock.textContent = fmt(el) + ' / ' + fmt(comp.total)
	pp.classList.toggle('paused', comp.frozen != null)
	if (comp.frozen != null) setControls(true)
}
setInterval(updateTL, 100); updateTL()
const _seek = comp.seek.bind(comp); comp.seek = (ms) => { _seek(ms); updateTL(); showControls(true) }
const _toggle = togglePause
togglePause = function () {
	_toggle(); updateTL()
	pp.classList.remove('pop'); void pp.offsetWidth; pp.classList.add('pop')
	showControls(comp.frozen == null)
}
// Tela cheia (botão na timeline · tecla F). No celular tenta travar na horizontal.
const fsBtn = tl.querySelector('.tl-fs')
if (!document.fullscreenEnabled) fsBtn.style.display = 'none'
fsBtn.addEventListener('click', toggleFS)
async function toggleFS() {
	try {
		if (document.fullscreenElement) await document.exitFullscreen()
		else { await document.documentElement.requestFullscreen(); try { await screen.orientation.lock('landscape') } catch {} }
	} catch {}
}
// Ao entrar em tela cheia: pausa (a take começa no espaço/clique) e esconde os overlays.
document.addEventListener('fullscreenchange', () => {
	if (document.fullscreenElement) { if (comp.frozen == null) togglePause(); clearTimeout(ctlTimer); setControls(false) }
	else showControls(true)
})
// Celular na vertical: instrução para girar; o vídeo espera (e retoma sozinho ao girar).
const rot = document.querySelector('.rot'), portrait = matchMedia('(orientation: portrait) and (pointer: coarse) and (max-width: 1024px)')
let rotSkip = false, autoPaused = false
function checkRot() {
	const on = portrait.matches && !rotSkip
	rot.classList.toggle('on', on)
	if (on) { if (comp.frozen == null) { comp.frozen = performance.now() - comp.t0; autoPaused = true; updateTL() } }
	else if (autoPaused) { autoPaused = false; if (comp.frozen != null) { comp.t0 = performance.now() - comp.frozen; comp.frozen = null; updateTL(); showControls(true) } }
}
portrait.addEventListener('change', checkRot); checkRot()
rot.querySelector('.rot-skip').addEventListener('click', (e) => { e.stopPropagation(); rotSkip = true; checkRot() })
rot.addEventListener('click', () => { if (document.fullscreenEnabled) toggleFS() })
if (props.pausar) setControls(true); else setControls(false)
`.replace("document.querilySelectorAll = null\n", '')

const standalone = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="${STAGE}">
<title>Showcase Faradays${CURTO ? ' · 1 min' : ''}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">
<style>
html,body{margin:0;height:100%;overflow:hidden;background:${STAGE};touch-action:manipulation;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}
.fit{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;cursor:default}
.fit.nocur{cursor:none}
/* Film grain da LP: layer fixo 2× o viewport, saltando de posição (só transform → compositor). */
.grain{position:fixed;top:-50%;left:-50%;width:200vw;height:200vh;z-index:5;pointer-events:none;opacity:.12;background-image:${NOISE_URI};animation:grain-jump .5s steps(6) infinite;will-change:transform}
@keyframes grain-jump{0%,100%{transform:translate(0,0)}17%{transform:translate(-5%,-10%)}33%{transform:translate(3%,-15%)}50%{transform:translate(12%,9%)}67%{transform:translate(9%,4%)}83%{transform:translate(-1%,7%)}}
@media (prefers-reduced-motion: reduce){.grain{animation:none}}
.tl-shade{position:absolute;left:0;right:0;bottom:0;height:320px;background:linear-gradient(to top,${rgba(STAGE, 0.96)} 0%,${rgba(STAGE, 0.75)} 45%,${rgba(STAGE, 0)} 100%);opacity:0;transition:opacity .35s;pointer-events:none}
.tl-shade.on{opacity:1}
.tl{position:absolute;left:64px;right:64px;bottom:40px;display:flex;align-items:flex-start;gap:20px;opacity:0;transition:opacity .3s;pointer-events:none}
.tl.on{opacity:1;pointer-events:auto}
.tl-track{flex:1;display:flex;gap:6px;height:6px}
.seg{position:relative;height:6px;border-radius:3px;background:rgba(10,10,10,.12);cursor:pointer}
.seg.active{background:rgba(10,10,10,.22)}
.seg .fill{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:#0065e0;width:0}
.seg .lb{position:absolute;top:14px;left:0;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:rgba(10,10,10,.5);white-space:nowrap}
.seg.active .lb{color:#0a0a0a}
.tl-clock{flex-shrink:0;margin-top:-6px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:13px;letter-spacing:.06em;color:rgba(10,10,10,.65);font-variant-numeric:tabular-nums}
.tl-fs{flex-shrink:0;margin-top:-9px;display:flex;color:rgba(10,10,10,.65);cursor:pointer}
.tl-fs:hover{color:#0a0a0a}
.pp{position:absolute;left:50%;top:50%;width:112px;height:112px;margin:-56px 0 0 -56px;border-radius:9999px;background:rgba(0,0,0,.22);backdrop-filter:blur(5px);color:#f4f4f4;display:grid;place-items:center;opacity:0;transform:scale(.9);transition:opacity .3s,transform .3s var(--ease);pointer-events:none;cursor:pointer}
.pp.on{opacity:1;transform:none;pointer-events:auto}
.pp svg{display:none;width:44px;height:44px}
.pp.paused .i-play{display:block;margin-left:6px}
.pp:not(.paused) .i-pause{display:block}
.pp.pop{animation:pop .45s var(--ease)}
@keyframes pop{0%{transform:scale(.85)}60%{transform:scale(1.08)}100%{transform:scale(1)}}
.hint{position:absolute;left:64px;bottom:96px;padding:8px 14px;border-radius:9999px;background:rgba(10,10,10,.06);color:#0a0a0a;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:14px;letter-spacing:.08em;text-transform:uppercase;opacity:0;transition:opacity .3s;pointer-events:none}
.hint.on{opacity:1}
/* Celular: controles maiores (a prancha encolhe ~4×) */
@media (pointer: coarse) and (max-width: 1024px){
.tl{left:48px;right:48px;bottom:36px;gap:28px}
.tl-track{height:12px;gap:8px}.seg,.seg .fill{height:12px;border-radius:6px}
.seg .lb{top:22px;font-size:22px}
.tl-clock{font-size:24px;margin-top:-8px}
.tl-fs{margin-top:-14px}.tl-fs svg{width:40px;height:40px}
.pp{width:180px;height:180px;margin:-90px 0 0 -90px}.pp svg{width:76px;height:76px}
.hint{font-size:24px;padding:12px 22px;bottom:118px}
.tl-shade{height:420px}
}
/* Celular na vertical: instrução para girar (fora da prancha, em px da tela) */
.rot{position:fixed;inset:0;z-index:10;display:none;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:32px;background:${rgba(STAGE, 0.96)};color:#0a0a0a;text-align:center;font-family:Geist,'Helvetica Neue',system-ui,sans-serif}
.rot.on{display:flex}
.rot-phone{position:relative;width:46px;height:82px;margin-bottom:14px;border:3px solid #0a0a0a;border-radius:11px;animation:rot 2.6s var(--ease) infinite}
.rot-phone::after{content:"";position:absolute;left:50%;bottom:5px;width:14px;height:3px;margin-left:-7px;border-radius:2px;background:#0a0a0a}
@keyframes rot{0%,22%{transform:rotate(0)}50%,82%{transform:rotate(-90deg)}100%{transform:rotate(0)}}
.rot-t{margin:0;font-size:22px;font-weight:600;letter-spacing:-.01em}
.rot-s{margin:0;max-width:280px;font-size:14px;line-height:1.5;color:rgba(10,10,10,.65)}
.rot-skip{margin-top:18px;padding:10px 16px;border-radius:9999px;border:1px solid rgba(10,10,10,.2);background:transparent;color:#0a0a0a;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase}
${css}
html,body{background:${STAGE}}
</style>
</head>
<body>
<div class="fit">${standaloneHtml}<div class="tl-shade"></div><div class="tl"><div class="tl-track"></div><span class="tl-clock"></span><span class="tl-fs" title="Tela cheia (F)">${ico('CornersOut', 18, 'bold')}</span></div><div class="pp" title="Pausar / retomar">${ico('Play', 44, 'fill', '', 'i-play')}${ico('Pause', 44, 'fill', '', 'i-pause')}</div><div class="hint"></div></div>
<div class="grain" aria-hidden="true"></div>
<div class="rot"><div class="rot-phone"></div><p class="rot-t">Gire o celular</p><p class="rot-s">O vídeo é widescreen — na horizontal ele ocupa a tela toda.</p><button class="rot-skip" type="button">Assistir assim mesmo</button></div>
${CURTO ? `<script>${GSAP}</script>` : ''}<script>${runtime}${CURTO ? HOOK_JS.replace('__LEAD__', LEAD) : ''}</script>
</body>
</html>
`
fs.writeFileSync(CURTO ? 'index-1min.html' : 'index.html', escurecer(standalone))
console.log('ok standalone', CURTO ? '(1 min)' : '', RELOGIO, (standalone.length / 1024).toFixed(0) + ' KB')
