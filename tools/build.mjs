// Gera Main.dc.html (o showcase animado) a partir de peças do app real:
// tokens do globals.css, ícones Phosphor (icons.json), fonte Aspekta (b64),
// SVG do SharePoint da LP. Rode: node build.mjs
import fs from 'node:fs'

const ICONS = JSON.parse(fs.readFileSync('icons.json', 'utf8'))
const ASPEKTA = fs.readFileSync('aspekta.b64', 'utf8').trim()

/* ---------------- tokens (resolvidos do globals.css, tema claro) -------- */
const T = {
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
const STAGE = '#333333' // fundo da prancha (cinza)
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
const waGreenSvg = (size) =>
	`<svg viewBox="0 0 720 720" width="${size}" height="${size}" style="flex-shrink:0" aria-hidden="true"><path fill="#25d366" d="M360,0C161.18,0,0,161.18,0,360c0,65.41,17.45,126.75,47.94,179.61L0,720l187.02-44.21c51.34,28.18,110.28,44.21,172.98,44.21,198.82,0,360-161.18,360-360S558.82,0,360,0ZM360,655.52c-60.17,0-116.13-17.98-162.82-48.87l-110.49,28.14,30.99-105.61c-33.53-47.93-53.2-106.26-53.2-169.19,0-163.21,132.31-295.52,295.52-295.52s295.52,132.31,295.52,295.52-132.31,295.52-295.52,295.52Z"></path><path fill="#25d366" d="M444.35,407.52l87.1,41.06c4,1.88,6.56,5.94,6.2,10.34-.94,11.46-5.54,34.43-26.13,55.02-58.12,58.12-162.49-7.64-166.74-10.18-25.67-13.79-50.06-32.24-73.19-55.36-23.12-23.12-41.58-47.52-55.37-73.19-2.55-4.24-68.31-108.61-10.18-166.74,20.59-20.59,43.56-25.19,55.02-26.13,4.41-.36,8.46,2.2,10.34,6.2l41.07,87.1c1.94,4.12,1.09,9.02-2.13,12.24l-30.61,30.61c-6.62,6.62-8.56,16.93-4,25.11,11.17,20.03,26.19,39.32,43.59,57.07,17.75,17.4,37.04,32.43,57.07,43.59,8.18,4.56,18.48,2.62,25.11-4l30.61-30.61c3.22-3.22,8.12-4.08,12.24-2.13Z"></path></svg>`

// Wordmark Faradays — cópia do faradays-logo.tsx (currentColor).
const wordmark = (width, color = T.fg) => {
	const h = (width * 124) / 715.5
	return `<svg viewBox="0 0 715.50 124.00" width="${width}" height="${h.toFixed(1)}" fill="${color}" aria-hidden="true"><path d="M138.995 34.5807V1.14441e-05L39.7128 0H0V6.17513L46.1661 6.17512C46.1661 6.17512 47.2762 6.16503 47.9036 6.42212C48.5374 6.68183 49.1446 7.41015 49.1446 7.41015L74.9579 33.0986C74.9579 33.0986 75.9317 34.0297 76.6954 34.3336C77.4154 34.6202 78.4328 34.5806 78.4328 34.5806L138.995 34.5807Z" transform="translate(6.000 12.098)"></path><path d="M0.00195312 24.5825V59.165H84.3448C84.3448 59.165 85.6114 59.3702 86.3305 59.6591C87.0898 59.964 87.8064 60.6471 87.8064 60.6471L112.404 85.3475C112.404 85.3475 112.996 86.0952 113.634 86.3355C114.178 86.5403 115.123 86.5825 115.123 86.5825H139.002V52.9899H77.8912C77.8912 52.9899 76.7812 53 76.1537 52.7429C75.5199 52.4832 74.9127 51.7549 74.9127 51.7549L49.0984 26.0665C49.0984 26.0665 48.1246 25.1354 47.3609 24.8314C46.6409 24.5448 45.6234 24.5844 45.6234 24.5844L0.00195312 24.5825Z" transform="translate(6.000 12.098)"></path><path d="M168.002 108.32H152.002V69.5L168.002 69.408V57.12H152.002V20H214.21V32.8H168.002V57.12H203.842V69.408H168.002V108.32Z" transform="translate(6.000 -8.320)"></path><path d="M22.016 90.912C15.1893 90.912 9.81334 89.2054 5.888 85.792C1.96267 82.2934 0 77.5147 0 71.456C0 65.312 2.09067 60.4907 6.272 56.992C10.5387 53.4934 16.6827 51.36 24.704 50.592L43.648 48.672V58.784L29.312 60.192C24.6187 60.6187 21.2053 61.5574 19.072 63.008C17.024 64.4587 16 66.592 16 69.408V70.432C16 73.1627 17.1093 75.296 19.328 76.832C21.5467 78.368 24.6613 79.136 28.672 79.136C38.656 79.136 43.648 74.9974 43.648 66.72V57.12V55.328V46.368C43.648 41.4187 42.5813 37.8347 40.448 35.616C38.4 33.312 35.1147 32.16 30.592 32.16C27.6053 32.16 25.1733 32.5867 23.296 33.44C21.4187 34.2934 20.0533 35.3174 19.2 36.512C18.3467 37.7067 17.92 38.8587 17.92 39.968V40.352H2.048C5.20534 26.784 14.848 20 30.976 20C40.192 20 47.1893 22.2187 51.968 26.656C56.7467 31.008 59.136 37.4507 59.136 45.984V89.632H44.928V78.496H42.752C41.0453 82.5067 38.4853 85.5787 35.072 87.712C31.744 89.8454 27.392 90.912 22.016 90.912Z" transform="translate(230.500 9.000)"></path><path d="M0 89.12V20.768H14.208V32.672H16.3841C18.1761 28.4907 20.608 25.3333 23.68 23.2C26.8373 21.0667 30.848 20 35.712 20H46.848V32.928H29.184C24.4906 32.928 21.0346 34.1653 18.816 36.64C16.5973 39.1147 15.488 43.1253 15.488 48.672V89.12H0Z" transform="translate(300.000 9.000)"></path><path d="M22.016 90.912C15.1893 90.912 9.81334 89.2054 5.888 85.792C1.96267 82.2934 0 77.5147 0 71.456C0 65.312 2.09067 60.4907 6.272 56.992C10.5387 53.4934 16.6827 51.36 24.704 50.592L43.648 48.672V58.784L29.312 60.192C24.6187 60.6187 21.2053 61.5574 19.072 63.008C17.024 64.4587 16 66.592 16 69.408V70.432C16 73.1627 17.1093 75.296 19.328 76.832C21.5467 78.368 24.6613 79.136 28.672 79.136C38.656 79.136 43.648 74.9974 43.648 66.72V57.12V55.328V46.368C43.648 41.4187 42.5813 37.8347 40.448 35.616C38.4 33.312 35.1147 32.16 30.592 32.16C27.6053 32.16 25.1733 32.5867 23.296 33.44C21.4187 34.2934 20.0533 35.3174 19.2 36.512C18.3467 37.7067 17.92 38.8587 17.92 39.968V40.352H2.048C5.20534 26.784 14.848 20 30.976 20C40.192 20 47.1893 22.2187 51.968 26.656C56.7467 31.008 59.136 37.4507 59.136 45.984V89.632H44.928V78.496H42.752C41.0453 82.5067 38.4853 85.5787 35.072 87.712C31.744 89.8454 27.392 90.912 22.016 90.912Z" transform="translate(357.000 9.000)"></path><path d="M27.136 93.696C21.6747 93.696 16.896 92.288 12.8 89.472C8.704 86.5707 5.54667 82.4747 3.328 77.184C1.10934 71.8933 0 65.5787 0 58.24C0 47.1467 2.432 38.4853 7.296 32.256C12.16 25.9413 18.7733 22.784 27.136 22.784C32.0853 22.784 36.2667 23.8507 39.68 25.984C43.0933 28.1173 45.6107 31.1893 47.232 35.2H49.536C49.3653 31.7867 49.2373 28.9707 49.152 26.752C49.0667 24.448 49.024 22.3147 49.024 20.352V0H64.64V92.416H50.432V80.256H48.256C46.3787 84.4373 43.648 87.7227 40.064 90.112C36.5653 92.5013 32.256 93.696 27.136 93.696ZM32.768 81.536C38.3147 81.536 42.4107 79.9573 45.056 76.8C47.7013 73.5573 49.024 68.5227 49.024 61.696V54.784C49.024 47.9573 47.7013 42.9653 45.056 39.808C42.4107 36.5653 38.3147 34.944 32.768 34.944C27.136 34.944 22.9973 36.5653 20.352 39.808C17.7067 42.9653 16.384 47.9573 16.384 54.784V61.696C16.384 68.5227 17.7067 73.5573 20.352 76.8C22.9973 79.9573 27.136 81.536 32.768 81.536Z" transform="translate(426.500 6.000)"></path><path d="M22.016 90.912C15.1893 90.912 9.81334 89.2054 5.888 85.792C1.96267 82.2934 0 77.5147 0 71.456C0 65.312 2.09067 60.4907 6.272 56.992C10.5387 53.4934 16.6827 51.36 24.704 50.592L43.648 48.672V58.784L29.312 60.192C24.6187 60.6187 21.2053 61.5574 19.072 63.008C17.024 64.4587 16 66.592 16 69.408V70.432C16 73.1627 17.1093 75.296 19.328 76.832C21.5467 78.368 24.6613 79.136 28.672 79.136C38.656 79.136 43.648 74.9974 43.648 66.72V57.12V55.328V46.368C43.648 41.4187 42.5813 37.8347 40.448 35.616C38.4 33.312 35.1147 32.16 30.592 32.16C27.6053 32.16 25.1733 32.5867 23.296 33.44C21.4187 34.2934 20.0533 35.3174 19.2 36.512C18.3467 37.7067 17.92 38.8587 17.92 39.968V40.352H2.048C5.20534 26.784 14.848 20 30.976 20C40.192 20 47.1893 22.2187 51.968 26.656C56.7467 31.008 59.136 37.4507 59.136 45.984V89.632H44.928V78.496H42.752C41.0453 82.5067 38.4853 85.5787 35.072 87.712C31.744 89.8454 27.392 90.912 22.016 90.912Z" transform="translate(501.500 9.000)"></path><path d="M16.512 90.3441L27.136 65.1281L27.648 70.1201L0 1H15.872L33.28 47.5921H35.584L53.12 1H68.352L32.384 90.3441H16.512Z" transform="translate(571.000 28.000)"></path><path d="M30.08 90.912C21.376 90.912 14.592 89.2907 9.728 86.048C4.864 82.8054 1.62133 77.6427 0 70.56H15.616V70.944C15.616 72.0534 16.0427 73.248 16.896 74.528C17.7494 75.7227 19.2 76.7894 21.248 77.728C23.3814 78.6667 26.3254 79.136 30.08 79.136C34.6027 79.136 38.1014 78.4534 40.5761 77.088C43.1361 75.6374 44.4161 73.504 44.4161 70.688C44.4161 68.64 43.6481 67.0614 42.112 65.952C40.6614 64.8427 38.144 63.904 34.56 63.136L19.84 60.192C13.0134 58.7414 8.02133 56.5654 4.864 53.664C1.70666 50.6774 0.128 46.624 0.128 41.504C0.128 34.592 2.688 29.3013 7.808 25.632C12.928 21.8773 20.224 20 29.696 20C38.3147 20 45.0134 21.6213 49.792 24.864C54.6561 28.1067 57.8987 33.2694 59.5201 40.352H43.776V39.968C43.776 38.8587 43.3494 37.7067 42.496 36.512C41.728 35.232 40.32 34.1227 38.272 33.184C36.224 32.2454 33.3654 31.776 29.696 31.776C25.2587 31.776 21.8027 32.5014 19.328 33.952C16.9387 35.3174 15.744 37.408 15.744 40.224C15.744 42.272 16.4694 43.8507 17.92 44.96C19.456 46.0694 21.9734 47.008 25.472 47.776L40.192 50.72C47.0187 52.0854 52.0107 54.2614 55.168 57.248C58.4107 60.1494 60.0321 64.2027 60.0321 69.408C60.0321 76.2347 57.4294 81.5254 52.224 85.28C47.104 89.0347 39.7227 90.912 30.08 90.912Z" transform="translate(649.500 9.000)"></path></svg>`
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

/* ---------------- sidebar --------------------------------------------- */
const navRow = (icon, label, cls) => {
	const base = `display:flex;align-items:center;gap:10px;height:32px;padding:0 8px;border-radius:${R.sm};font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}`
	if (cls) {
		return `<li class="nr ${cls}" style="${base}"><span class="ico-reg" style="display:flex;opacity:.8">${ico(icon, 16)}</span><span class="ico-fill" style="display:none">${ico(icon, 16, 'fill')}</span><span style="white-space:nowrap">${label}</span></li>`
	}
	return `<li style="${base}"><span style="display:flex;opacity:.8">${ico(icon, 16)}</span><span style="white-space:nowrap">${label}</span></li>`
}
const navGroup = (icon, label, items, open = true) =>
	`<div style="margin-top:12px"><div style="display:flex;align-items:center;gap:10px;height:32px;padding:0 8px;border-radius:${R.sm};font-size:13.33px;font-weight:500;letter-spacing:.025em;color:${T.mutedFg}"><span style="display:flex;opacity:.8">${ico(icon, 16, 'fill')}</span><span style="white-space:nowrap">${label}</span><span style="margin-left:auto;display:flex;${open ? '' : 'transform:rotate(-90deg)'}">${ico('CaretDown', 14, 'bold')}</span></div>${open ? `<ul style="list-style:none;margin:0;padding:0 0 0 10px;display:flex;flex-direction:column;gap:2px">${items.join('')}</ul>` : ''}</div>`

const sidebar = `<aside style="width:288px;flex-shrink:0;height:100%;background:${T.sidebar};border-right:1px solid ${T.border};display:flex;flex-direction:column;overflow:hidden">
	<div style="height:56px;flex-shrink:0;display:flex;align-items:center;padding:0 16px;border-bottom:1px solid ${T.border60}">
		<div style="display:flex;align-items:center;padding:4px 8px">${wordmark(104)}</div>
		<span style="margin-left:auto;display:grid;place-items:center;width:28px;height:28px;color:${T.mutedFg}">${ico('SidebarSimple', 16, 'fill')}</span>
	</div>
	<div style="padding:8px 16px 0;display:flex;flex-direction:column">
		${navGroup('House', 'Início', [navRow('Pulse', 'Visão Geral')])}
		${navGroup('WhatsappLogo', 'WhatsApp', [navRow('ChatsCircle', 'Conversas', '{{c.navWa}}'), navRow('FlowArrow', 'Workflows'), navRow('Robot', 'Agentes de IA')])}
		${navGroup('Package', 'Compras', [navRow('ClipboardText', 'BID (Cotação de Compra)', '{{c.navBid}}')])}
		${navGroup('TrendUp', 'Vendas', [navRow('FileText', 'Cotação de Venda'), navRow('Table', 'Tabela de Preços')])}
		${navGroup('ShieldCheck', 'Qualidade', [navRow('Files', 'Documentos', '{{c.navDocs}}'), navRow('ListChecks', 'Tipos de Documento')])}
		${navGroup('Database', 'Cadastros', [navRow('Flask', 'Produtos'), navRow('Handshake', 'Exportadores'), navRow('Users', 'Clientes'), navRow('Factory', 'Fabricantes'), navRow('FileXls', 'Modelo de Cotação')])}
		${navGroup('HardDrives', 'Sistema', [], false)}
	</div>
</aside>`

/* ---------------- header + breadcrumb ---------------------------------- */
const crumb = (root, leaf, cls) =>
	`<span class="vf ${cls}" style="position:absolute;inset:0;display:flex;align-items:center;gap:8px;font-family:${MONO};font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg};white-space:nowrap"><span>${root}</span><span style="opacity:.4">/</span><span style="color:${T.fg};font-weight:500">${leaf}</span></span>`
const header = `<header style="height:56px;flex-shrink:0;display:flex;align-items:center;gap:16px;padding:0 24px;border-bottom:1px solid ${T.border60};background:rgba(250,250,250,.8)">
	<div style="position:relative;flex:1;height:100%">
		${crumb('Qualidade', 'Documentos', '{{c.crDocs}}')}
		${crumb('Compras', 'BID (Cotação de Compra)', '{{c.crBid}}')}
		${crumb('WhatsApp', 'Conversas', '{{c.crWa}}')}
	</div>
	<div style="display:flex;align-items:center;gap:8px;padding:6px 8px 6px 6px;border-radius:${R.lg}">
		<span style="display:grid;place-items:center;width:24px;height:24px;border-radius:${R.md};background:${T.muted};color:${T.mutedFg};font-size:11.1px;font-weight:500">G</span>
		<span style="font-size:13.33px;font-weight:500;letter-spacing:.025em">Gestor</span>
		<span style="display:flex;color:${T.mutedFg}">${ico('CaretDown', 14, 'bold')}</span>
	</div>
</header>`

/* ---------------- página: Documentos ------------------------------------ */
const DOC_COLS = [200, 300, 160, 130, 140, 150]
const docRow = (tipo, produto, marca, mand, validade, status, opts = {}) => {
	const st = { vigente: ['success', 'Vigente'], a_vencer: ['warning', 'A vencer'], vencido: ['error', 'Vencido'], na: ['neutral', 'N/A'] }[status]
	const cls = opts.cls ? `class="row vf ${opts.cls}"` : ''
	const val = opts.lendo
		? `<span style="position:relative;display:inline-block;min-width:96px;height:20px"><span class="vf {{c.lendo}}" style="position:absolute;left:0;top:0;display:inline-flex;align-items:center;gap:6px;color:${T.amber700}">${ico('Sparkle', 14, 'fill')}${mono('lendo…')}</span><span class="vf {{c.lido}}" style="position:absolute;left:0;top:0">${mono(validade)}</span></span>`
		: mono(validade)
	const badgeHtml = opts.lendo
		? `<span style="position:relative;display:inline-block;min-width:80px;height:21px"><span class="vf {{c.lendo}}" style="position:absolute;left:0;top:0">${badge('warning', 'SEM DATA')}</span><span class="vf {{c.lido}}" style="position:absolute;left:0;top:0">${badge(st[0], st[1])}</span></span>`
		: badge(st[0], st[1])
	return `<tr ${cls}>
		${td(tipo)}${td(`<span style="font-weight:500">${produto}</span>`)}${td(marca)}${td(mand ? badge('success', 'Sim') : badge('neutral', 'Não'))}${td(val)}${td(badgeHtml)}${td(`<span style="display:inline-flex;align-items:center;gap:6px;color:${T.mutedFg}">${ico('FilePdf', 16)}${mono('PDF')}</span>`)}
	</tr>`
}
const docsTable = `<table style="width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;text-align:left">
	<thead><tr>${th('Tipo de documento', 'left', DOC_COLS[0])}${th('Produto / Fornecedor', 'left', DOC_COLS[1])}${th('Marca', 'left', DOC_COLS[2])}${th('Mandatório', 'left', DOC_COLS[3])}${th('Validade', 'left', DOC_COLS[4])}${th('Status', 'left', DOC_COLS[5])}${th('Arquivo')}</tr></thead>
	<tbody>
		${docRow('COA', 'CREATINA 200 MESH', 'Creapure', true, '12/03/2027', 'vigente')}
		${docRow('Halal', 'ÁCIDO ASCÓRBICO', 'LUWEI', true, '15/09/2026', 'a_vencer')}
		${docRow('Kosher', 'CREATINA 200 MESH', 'Creapure', true, '30/06/2026', 'vencido')}
		${docRow('ISO 9001', 'SUCRALOSE', 'ANHUI JINHE', false, '02/11/2027', 'vigente')}
		${docRow('FDA', 'ACESSULFAME K', 'VITASWEET', true, '20/01/2027', 'vigente')}
		${docRow('MSDS', 'STPP', 'CHENGXIN', false, '—', 'na')}
		${docRow('Certificado de Origem', 'INOSITOL', 'TJCY', true, '08/05/2027', 'vigente')}
		${docRow('GMP', 'SUCRALOSE', 'ANHUI JINHE', true, '14/02/2028', 'vigente', { cls: '{{c.r1}}', lendo: true })}
		${docRow('Halal', 'ÁLCOOL CETOESTEARÍLICO 30/70', 'P&amp;G', true, '30/09/2027', 'vigente', { cls: '{{c.r2}}', lendo: true })}
		${docRow('COA', 'ACESSULFAME K', 'VITASWEET', true, '05/08/2027', 'vigente', { cls: '{{c.r3}}', lendo: true })}
	</tbody>
</table>`

const treeFolder = (label, count, depth, open = true) =>
	`<div style="display:flex;align-items:center;gap:8px;height:36px;padding:0 8px 0 ${8 + depth * 24}px;border-radius:${R.md};font-size:13.33px;letter-spacing:.025em"><span style="display:flex;color:${T.mutedFg};${open ? '' : 'transform:rotate(-90deg)'}">${ico('CaretDown', 14, 'bold')}</span>${ico(open ? 'FolderOpen' : 'Folder', 18, 'fill', `color:${T.primary}`)}<span style="font-weight:500">${label}</span>${muted(mono(count), 'font-size:11.1px')}</div>`
const treeDoc = (label, depth, status) =>
	`<div style="display:flex;align-items:center;gap:8px;height:36px;padding:0 8px 0 ${8 + depth * 24 + 22}px;font-size:13.33px;letter-spacing:.025em"><span style="display:flex;color:${T.mutedFg}">${ico('File', 16)}</span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${label}</span>${status ? badge(status[0], status[1]) : ''}</div>`
const docsTree = `<div style="display:flex;flex-direction:column;gap:8px">
	<div style="display:flex;justify-content:flex-end;gap:8px">${btn('Expandir tudo', { variant: 'ghost', size: 'sm' })}${btn('Recolher tudo', { variant: 'ghost', size: 'sm' })}</div>
	<div style="border:1px solid ${T.border};border-radius:${R.xl};padding:8px;background:${T.card}">
		${treeFolder('Faradays Qualidade', '124 documentos', 0)}
		${treeFolder('Certificados', '46', 1)}
		${treeFolder('COA', '18', 2)}
		${treeDoc('COA CREATINA 200 MESH — lote 2408.pdf', 3, ['success', 'Vigente'])}
		${treeDoc('COA ACESSULFAME K — lote 2407.pdf', 3, ['success', 'Vigente'])}
		${treeDoc('COA SUCRALOSE — lote 2406.pdf', 3, ['success', 'Vigente'])}
		${treeFolder('Halal', '9', 2)}
		${treeDoc('HALAL ÁCIDO ASCÓRBICO — LUWEI — VAL 15.09.2026.pdf', 3, ['warning', 'A vencer'])}
		${treeDoc('HALAL ÁLCOOL CETOESTEARÍLICO 30-70 — VAL 30.09.2027.pdf', 3, ['success', 'Vigente'])}
		${treeFolder('Kosher', '7', 2, false)}
		${treeFolder('ISO', '12', 2, false)}
		${treeFolder('Regulatório', '31', 1)}
		${treeFolder('FDA', '11', 2, false)}
		${treeFolder('GMP', '8', 2, false)}
		${treeFolder('MSDS', '12', 2, false)}
		${treeFolder('Laudos', '47', 1, false)}
	</div>
</div>`

const docsPage = `<div class="vf {{c.pgDocs}}" style="position:absolute;inset:0;display:flex;flex-direction:column;gap:32px;padding:24px">
	<div style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap">
		${btn('Tipos de Documento', { variant: 'outline', icon: 'Files' })}${btn('Renomeação automática', { variant: 'outline', icon: 'Sparkle' })}${btn('Procurar no drive', { variant: 'outline', icon: 'FolderOpen' })}${btn('Configurar drive', { variant: 'outline', icon: 'Gear' })}${btn('Cobrança', { variant: 'outline', icon: 'Envelope' })}${btn('Novo Documento', { icon: 'Plus' })}
	</div>
	<div style="display:flex;flex-direction:column;gap:16px;flex:1;min-height:0">
		<div style="display:flex;align-items:center;gap:8px">
			${pillSwap('Documentos', '{{c.pillDocs}}')}${pill('Pendências', false)}${pill('Por exportador', false)}${pillSwap('Pastas', '{{c.pillPastas}}')}
		</div>
		<div style="position:relative;flex:1;min-height:0">
			<div class="mc {{c.docsTable}}" style="position:absolute;inset:0;display:flex;flex-direction:column;gap:16px">
				<div style="display:flex;align-items:center;gap:12px">${search('Buscar por produto, tipo ou marca…')}${btn('Status: todos', { variant: 'outline', icon: 'Funnel' })}</div>
				${docsTable}
			</div>
			<div class="mc {{c.docsTree}}" style="position:absolute;inset:0">${docsTree}</div>
		</div>
	</div>
</div>`

/* ---------------- página: BID ------------------------------------------- */
const bidRow = (data, num, status, produtos, mais, resp, cls = '') =>
	`<tr ${cls ? `class="${cls}"` : ''}>
		${td(mono(data))}${td(`<span style="display:inline-flex;align-items:center;gap:8px">${mono(num, 'font-weight:500')}${badge(status[0], status[1])}</span>`)}${td(`${produtos}${mais ? muted(` +${mais}`, 'margin-left:6px') : ''}`)}${td(mono(resp))}
	</tr>`
const bidPage = `<div class="vf {{c.pgBid}}" style="position:absolute;inset:0;display:flex;flex-direction:column;gap:32px;padding:24px">
	<div style="display:flex;justify-content:flex-end;gap:8px">
		${btn('Exportar Excel', { variant: 'outline', icon: 'Download' })}${btn('Caixa de e-mail', { variant: 'outline', icon: 'Envelope' })}${btn('Automação', { variant: 'outline', icon: 'Gear' })}${btn('Premissas', { variant: 'outline', icon: 'ListChecks' })}${btn('Nova cotação', { icon: 'Plus' })}
	</div>
	<div style="display:flex;flex-direction:column;gap:16px">
		<div style="display:flex;align-items:center;gap:12px">${search('Buscar por nº ou produto…')}${pill('Todas', true)}${pill('Abertas', false)}${pill('Fechadas', false)}</div>
		<table style="width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;text-align:left">
			<thead><tr>${th('Data', 'left', 160)}${th('Nº', 'left', 300)}${th('Produtos cotados')}${th('Respostas', 'left', 220)}</tr></thead>
			<tbody>
				${bidRow('28/08/2026', 'CC-2026-012', ['info', 'aberta'], 'CREATINA 200 MESH', 2, 'nenhum envio', 'hl {{c.rowBid}}')}
				${bidRow('21/08/2026', 'CC-2026-011', ['warning', 'respondida'], 'SUCRALOSE', 1, '3 de 5 envios')}
				${bidRow('14/08/2026', 'CC-2026-010', ['success', 'fechada'], 'ÁCIDO ASCÓRBICO', 0, '4 de 4 envios')}
				${bidRow('05/08/2026', 'CC-2026-009', ['success', 'fechada'], 'INOSITOL', 3, '5 de 6 envios')}
				${bidRow('29/07/2026', 'CC-2026-008', ['success', 'fechada'], 'ACESSULFAME K', 1, '3 de 3 envios')}
				${bidRow('22/07/2026', 'CC-2026-007', ['neutral', 'cancelada'], 'STPP', 0, '2 de 4 envios')}
			</tbody>
		</table>
	</div>
</div>`

// Modal de detalhe (1152×810 centrado na janela 1600×900)
const expRow = (nome, contato, recorte, checked, last = false) =>
	`<label style="display:flex;align-items:center;gap:12px;height:40px;padding:0 12px;font-size:13.33px;letter-spacing:.025em;border-bottom:${last ? 'none' : `1px solid ${T.border60}`};background:${checked ? 'rgba(235,235,235,.4)' : 'transparent'}">${checkbox(checked)}<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${nome} ${muted(`(${contato})`)}</span>${recorte}</label>`
const dispatchBody = `<div class="mc {{c.disp}}" style="position:absolute;inset:0;display:flex;flex-direction:column;gap:12px">
	<div style="display:flex;align-items:center;justify-content:space-between;gap:16px">
		<span style="font-size:13.33px;letter-spacing:.025em;font-weight:500">Destinatários</span>
		<span style="display:inline-flex;align-items:center;gap:8px;font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}"><span style="width:32px;height:18px;border-radius:9999px;background:${T.muted};position:relative;display:inline-block"><span style="position:absolute;left:2px;top:2px;width:14px;height:14px;border-radius:9999px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.15)"></span></span>Disparar para todos</span>
	</div>
	<div style="display:flex;align-items:center;gap:8px">${pill('Todos', true, 10)}${pill('No mapeamento', false, 4)}${pill('Fora do mapeamento', false, 6)}</div>
	<div style="border:1px solid ${T.border};border-radius:${R.md};display:flex;flex-direction:column;overflow:hidden">
		${expRow('ANHUI JINHE FOOD', 'sales@… · +86 …', badge('neutral', 'todos os itens'), true)}
		${expRow('VITASWEET CO.', 'export@… · +86 …', badge('neutral', '2 de 3 itens'), true)}
		${expRow('ENSIGN INDUSTRY', 'bid@…', badge('neutral', 'todos os itens'), true)}
		${expRow('CHENGXIN CHEMICAL', 'trade@… · +86 …', badge('neutral', '1 de 3 itens'), true, true)}
	</div>
	<div style="display:flex;align-items:center;gap:8px">${btn('Selecionar todos', { variant: 'ghost', size: 'sm' })}${btn('Limpar', { variant: 'ghost', size: 'sm' })}<span style="margin-left:auto;font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}">4 selecionados · e-mail e WhatsApp</span></div>
	<div style="border-top:1px solid ${T.border};padding-top:12px;display:flex;flex-direction:column;gap:8px">
		<div style="display:flex;align-items:center;gap:12px"><span style="font-size:13.33px;letter-spacing:.025em;font-weight:500">Mensagem</span><span style="display:flex;gap:2px;padding:2px;border-radius:${R.md};background:${T.muted}"><span style="padding:2px 10px;border-radius:${R.sm};background:#fff;font-family:${MONO};font-size:11.1px;font-weight:500;box-shadow:0 1px 2px rgba(0,0,0,.06)">EN</span><span style="padding:2px 10px;font-family:${MONO};font-size:11.1px;font-weight:500;color:${T.mutedFg}">PT</span></span></div>
		<div style="border:1px solid ${T.border};border-radius:${R.md};background:rgba(235,235,235,.3);font-size:13.33px;letter-spacing:.025em;line-height:1.5">
			<div style="padding:8px 12px;border-bottom:1px solid ${T.border60}">${muted('Assunto:')} BID CC-2026-012 — Faradays — 3 items</div>
			<div style="padding:12px;display:flex;flex-direction:column;gap:6px;color:${T.fg}"><span>Dear supplier, please find below our BID for FOB/CFR quotation.</span><span style="font-family:${MONO};font-size:12px;color:${T.mutedFg}">CREATINE 200 MESH · 15000 KG (Container 1)<br>SUCRALOSE · 5000 KG (Container 1)<br>ACESULFAME K · 3000 KG (Container 2)</span><span>Please reply in this thread with price, incoterm and payment terms.</span></div>
			<div style="padding:8px 12px;border-top:1px solid ${T.border60};display:flex;align-items:center;gap:6px;color:${T.mutedFg};font-size:12px">${ico('Robot', 14)}Automated message, read by AI — reply with price and commercial terms only.</div>
		</div>
	</div>
	<div style="margin-top:auto;display:flex;justify-content:flex-end;gap:8px;padding-top:4px">${btn('Cancelar', { variant: 'outline' })}<span class="vf {{c.btnDisp}}">${btn('Disparar BID (4)', { icon: 'PaperPlaneRight' })}</span></div>
</div>`

const cth = (label, align = 'center') =>
	`<th style="padding:8px;text-align:${align};font-size:11.1px;letter-spacing:.03em;text-transform:uppercase;font-weight:600;color:${T.mutedFg}">${label}</th>`
const ctd = (html, align = 'center', extra = '') => `<td style="padding:8px;text-align:${align};white-space:nowrap;font-size:13.33px;letter-spacing:.025em;line-height:1.5;${extra}">${html}</td>`
const preco = (v, un, inc) =>
	`<span style="display:inline-flex;flex-direction:column;align-items:center;gap:2px">${mono(`${v}<span style="color:${T.mutedFg}">/${un}</span>`)}<span style="font-size:10px;font-weight:500;letter-spacing:.05em;color:${T.mutedFg}">${inc}</span></span>`
const cmpRow = (nome, extra, cotado, base, prazo, origem, opts = {}) => {
	const rowCls = opts.cls ? `class="crow ${opts.cls}"` : ''
	const bg = opts.draft ? 'background:rgba(254,154,0,.05);' : ''
	return `<tr ${rowCls} style="border-bottom:1px solid ${T.border60};border-left:2px solid transparent;${bg}">
		${ctd(`<span style="display:inline-flex;flex-direction:column;align-items:flex-start;gap:4px"><span style="font-weight:500">${nome}</span>${extra || ''}</span>`, 'left')}
		${ctd(cotado)}${ctd(mono(`${base}<span style="color:${T.mutedFg}">/KG</span>`, 'font-weight:500'))}${ctd(mono(prazo))}${ctd(badge(origem[0], origem[1]))}
		${ctd(opts.cls ? `<span style="position:relative;display:inline-block;width:16px;height:16px"><span class="vf {{c.cbOff}}" style="position:absolute;inset:0">${checkbox(false)}</span><span class="vf {{c.cbOn}}" style="position:absolute;inset:0">${checkbox(true)}</span></span>` : checkbox(false))}
		${ctd(opts.draft ? btn('Confirmar', { variant: 'outline', size: 'xs' }) : `<span style="display:inline-flex;color:${T.mutedFg}">${ico('DotsThreeVertical', 16, 'bold')}</span>`)}
	</tr>`
}
const cmpBox = (titulo, marca, cas, qtd, rows) =>
	`<div style="border:1px solid ${T.border};border-radius:${R.lg};overflow:hidden;background:${T.card}">
	<div style="display:flex;align-items:center;gap:12px;padding:8px 12px;border-bottom:1px solid ${T.border60};background:rgba(235,235,235,.3);font-size:13.33px;letter-spacing:.025em"><span style="font-weight:500">${titulo}${marca ? ` - ${marca}` : ''}</span>${cas ? mono(`CAS ${cas}`, `font-size:11.1px;color:${T.mutedFg}`) : ''}<span style="margin-left:auto">${mono(qtd, `font-size:11.1px;color:${T.mutedFg}`)}</span></div>
	<table style="width:100%;border-collapse:collapse;table-layout:fixed"><colgroup><col style="width:260px"><col style="width:170px"><col style="width:150px"><col style="width:160px"><col style="width:170px"><col style="width:100px"><col></colgroup>
	<thead><tr style="border-bottom:1px solid ${T.border}">${cth('Exportador', 'left')}${cth('Preço cotado')}${cth('Base FOB')}${cth('Prazo pagto')}${cth('Origem')}${cth('Vencedora')}<th></th></tr></thead>
	<tbody>${rows.join('')}</tbody></table></div>`
// Célula com dois estados empilhados (grid-area 1/1): "lendo" → "lido".
const stack = (a, b) => `<span style="display:inline-grid;justify-items:center;align-items:center"><span class="vf {{c.aLendo}}" style="grid-area:1/1">${a}</span><span class="vf {{c.aLido}}" style="grid-area:1/1">${b}</span></span>`
const lendoTag = `<span style="display:inline-flex;align-items:center;gap:6px;color:${T.amber700}">${ico('Sparkle', 14, 'fill')}${mono('lendo e-mail…')}</span>`
const anhuiRow = () =>
	`<tr class="crow {{c.rowWin}}" style="border-bottom:1px solid ${T.border60};border-left:2px solid transparent">
		${ctd(`<span style="display:inline-flex;flex-direction:column;align-items:flex-start;gap:4px"><span style="font-weight:500">ANHUI JINHE FOOD</span><span class="vf {{c.sug}}" style="display:inline-flex;align-items:center;gap:8px;font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${T.green700}"><span class="pulse"></span>sugerida pela IA</span></span>`, 'left')}
		${ctd(stack(lendoTag, preco('4,85', 'KG', 'FOB')))}
		${ctd(stack(muted('—'), mono(`4,85<span style="color:${T.mutedFg}">/KG</span>`, 'font-weight:500')))}
		${ctd(stack(muted('—'), mono('T/T 90 days')))}
		${ctd(stack(badge('neutral', 'resposta recebida'), badge('info', 'E-mail · IA')))}
		${ctd(`<span style="position:relative;display:inline-block;width:16px;height:16px"><span class="vf {{c.cbOff}}" style="position:absolute;inset:0">${checkbox(false)}</span><span class="vf {{c.cbOn}}" style="position:absolute;inset:0">${checkbox(true)}</span></span>`)}
		${ctd(`<span style="display:inline-flex;color:${T.mutedFg}">${ico('DotsThreeVertical', 16, 'bold')}</span>`)}
	</tr>`
const comparativoBody = `<div class="mc {{c.cmp}}" style="position:absolute;inset:0;display:flex;flex-direction:column;gap:12px">
	<div style="display:flex;flex-direction:column;gap:12px;flex:1;min-height:0">
		${cmpBox('CREATINA 200 MESH', 'CREAPURE', '57-00-1', '15.000 KG', [
			anhuiRow(),
			cmpRow('VITASWEET CO.', badge('neutral', 'marca cotada: HANSONG'), preco('5,02', 'KG', 'CFR'), '4,88', 'T/T 30 days', ['info', 'Planilha · IA']),
			cmpRow('ENSIGN INDUSTRY', null, preco('5,11', 'KG', 'FOB'), '5,11', 'L/C at sight', ['info', 'E-mail · IA']),
			cmpRow('CHENGXIN CHEMICAL', badge('warning', 'rascunho da IA'), preco('5,20', 'KG', 'FOB'), '5,20', '30% adiantado', ['info', 'E-mail · IA'], { draft: true })
		])}
		${cmpBox('SUCRALOSE', 'ANHUI JINHE', '56038-13-2', '5.000 KG', [
			cmpRow('ANHUI JINHE FOOD', null, preco('38,40', 'KG', 'FOB'), '38,40', 'T/T 90 days', ['info', 'E-mail · IA']),
			cmpRow('VITASWEET CO.', null, preco('39,10', 'KG', 'CFR'), '38,62', 'T/T 30 days', ['info', 'Planilha · IA'])
		])}
	</div>
	<div style="display:flex;align-items:center;gap:8px;padding-top:4px"><span style="font-size:12px;color:${T.mutedFg}">Base FOB normalizada a 90 dias · unidade é base de comparação (/KG × /MT nunca se misturam)</span><span style="margin-left:auto;display:flex;gap:8px">${btn('Contra-ofertas', { variant: 'outline', icon: 'Envelope' })}<span class="vf {{c.btnFechar}}">${btn('Fechar cotação', { icon: 'CheckCircle' })}</span></span></div>
</div>`

const detailModal = `<div class="vf {{c.overlay}}" style="position:absolute;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px)"></div>
<div class="vp {{c.modal}}" style="position:absolute;left:224px;top:45px;width:1152px;height:810px;border:1px solid ${T.border};background:${T.card};border-radius:${R.xl};box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);padding:24px;display:flex;flex-direction:column;gap:16px">
	<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding-right:24px">
		<div style="display:flex;flex-direction:column;gap:6px">
			<div style="display:flex;align-items:center;gap:8px;font-size:19.2px;font-weight:600;letter-spacing:.015em">${mono('CC-2026-012')}${badge('info', 'aberta')}</div>
			<span style="font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}">3 itens · aberta em 28/08/2026 · 4 exportadores no mapeamento</span>
		</div>
		<div style="display:flex;gap:8px">${pillSwap('Comparativo', '{{c.pillCmp}}')}${pillSwap('Disparar BID', '{{c.pillDisp}}')}</div>
	</div>
	<span style="position:absolute;top:16px;right:16px;opacity:.6;display:flex">${ico('X', 16)}</span>
	<div style="position:relative;flex:1;min-height:0">${dispatchBody}${comparativoBody}</div>
	${[0, 1, 2, 3].map((k) => `<span class="env {{c.env}} e${k}" style="position:absolute;left:0;top:0;display:flex;color:${T.brand}">${ico('Envelope', 22, 'fill')}</span>`).join('')}
</div>`

/* ---------------- página: WhatsApp -------------------------------------- */
const repRow = (nome, previa, hora, unread, active = false, badgeHtml = '') =>
	`<div style="display:flex;flex-direction:column;gap:6px;padding:16px;border-bottom:1px solid ${T.border60};background:${active ? 'rgba(0,101,224,.06)' : 'transparent'}">
		<div style="display:flex;align-items:center;gap:8px"><span style="font-size:13.33px;font-weight:500;letter-spacing:.025em">${nome}</span>${badgeHtml}<span style="margin-left:auto;font-family:${MONO};font-size:11.1px;color:${unread ? T.brand : 'rgba(138,138,138,.8)'}">${hora}</span></div>
		<div style="display:flex;align-items:center;gap:8px"><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}">${previa}</span>${unread ? `<span style="display:grid;place-items:center;height:20px;min-width:20px;padding:0 6px;border-radius:9999px;background:${T.brand};color:#fff;font-size:11px;font-weight:600">${unread}</span>` : ''}</div>
	</div>`
const bubble = (side, html, cls, opts = {}) => {
	const out = side === 'out'
	const base = `max-width:80%;border-radius:${R.lg};padding:8px 12px;font-size:13.33px;letter-spacing:.025em;line-height:1.5;box-shadow:0 1px 2px rgba(0,0,0,.05);background:${out ? T.brand : T.bg};color:${out ? '#ffffff' : T.fg}`
	const sub = out ? 'rgba(255,255,255,.7)' : T.mutedFg
	return `<div class="vp ${cls}" style="display:flex;justify-content:${out ? 'flex-end' : 'flex-start'}"><div style="${base}">${opts.ia ? `<span style="display:flex;align-items:center;gap:4px;font-family:${MONO};font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:${sub};margin-bottom:2px">${ico('Sparkle', 10, 'fill')}Agente IA</span>` : ''}${html}<span style="display:flex;justify-content:flex-end;align-items:center;gap:4px;margin-top:2px;font-family:${MONO};font-size:10px;color:${sub}">${opts.hora}${out ? ico('Checks', 12) : ''}</span></div></div>`
}
const fileCard = (nome, meta, extra = '', onBrand = false) =>
	`<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:${R.lg};border:1px solid ${onBrand ? 'rgba(255,255,255,.22)' : T.border};background:${onBrand ? 'rgba(255,255,255,.14)' : 'rgba(235,235,235,.6)'};${extra}">${ico('FilePdf', 28, 'fill', onBrand ? 'color:#ffffff' : 'color:#d93025')}<div style="min-width:0;display:flex;flex-direction:column"><span style="font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${onBrand ? '#ffffff' : T.fg}">${nome}</span><span style="font-family:${MONO};font-size:10px;color:${onBrand ? 'rgba(255,255,255,.7)' : T.mutedFg}">${meta}</span></div></div>`
const waPage = `<div class="vf {{c.pgWa}}" style="position:absolute;inset:0;display:grid;grid-template-columns:2fr 3fr">
	<div style="display:flex;flex-direction:column;gap:16px;padding:20px;border-right:1px solid ${T.border};min-height:0">
		<div style="display:flex;align-items:center;gap:8px">${search('Buscar por nome ou número...', 9999).replace('max-width:9999px;width:100%', 'flex:1')}${btn('', { variant: 'outline', icon: 'Gear', extra: 'width:36px;padding:0' })}${btn('Novo', { variant: 'outline', icon: 'Plus' })}</div>
		<div style="display:flex;flex-direction:column;overflow:hidden;border-radius:${R.lg}">
			${repRow('Carlos Mendes', `${muted('Agente IA: ', 'opacity:.7')}Cotação COT-V-0188 emitida — PDF anexo`, '09:45', 0, true)}
			${repRow('Ana Souza', `${muted('Você: ', 'opacity:.7')}Tabela de setembro sai dia 01`, 'há 2 h', 0)}
			${repRow('João Pereira', 'Pedido PD-0453 faturado, obrigado!', 'há 5 h', 0, false, badge('primary', 'Gestor'))}
			${repRow('Marcos Lima', `${muted('Você: ', 'opacity:.7')}Cotação COT-V-0186 emitida — PDF anexo`, 'ontem', 0)}
			${repRow('Renata Alves', 'Consegue cotar inositol pra Ambev?', 'ontem', 2)}
		</div>
	</div>
	<div style="display:flex;flex-direction:column;padding:20px;min-height:0">
		<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;padding-bottom:16px;margin-bottom:16px;border-bottom:1px solid ${T.border}">
			<div><p style="margin:0;font-size:16px;font-weight:600;letter-spacing:.02em">Carlos Mendes</p><p style="margin:0;font-family:${MONO};font-size:11.1px;color:${T.mutedFg}">+5511987654321 · Rep. Sudeste</p></div>
			${btn('Cotações', { variant: 'outline', size: 'sm', icon: 'FileText' })}
		</div>
		<div style="flex:1;min-height:0;border-radius:${R.lg};background:rgba(235,235,235,.4);padding:16px;display:flex;flex-direction:column;gap:12px;overflow:hidden">
			<div style="align-self:center"><span style="display:inline-block;padding:4px 12px;border-radius:9999px;border:1px solid ${T.border};background:rgba(250,250,250,.9);font-size:11.1px;color:${T.mutedFg}">Hoje</span></div>
			${bubble('in', 'Bom dia! A Nestlé pediu o COA da creatina 200 mesh, lote 2408. Consegue me mandar?', '{{c.m1}}', { hora: '09:41' })}
			${bubble('out', `Segue o COA da creatina 200 mesh, lote 2408:${fileCard('COA CREATINA 200 MESH — lote 2408.pdf', 'PDF · 212 KB · SharePoint', 'margin-top:8px', true)}`, '{{c.m2}}', { hora: '09:42', ia: true })}
			${bubble('in', 'Valeu! E quanto tá a creatina hoje pra 2 ton, entrega SP?', '{{c.m3}}', { hora: '09:44' })}
			${bubble('out', 'Encontrei <strong>2 marcas</strong> de creatina na tabela vigente: Creapure® e Hansong. Qual delas?', '{{c.m4}}', { hora: '09:44', ia: true })}
			${bubble('in', 'Creapure', '{{c.m5}}', { hora: '09:45' })}
			${bubble('out', `<span style="display:flex;align-items:center;gap:6px">${ico('CheckCircle', 16, 'fill', 'color:#ffffff')}Cotação COT-V-0188 emitida — ICMS SP e câmbio do dia já calculados.</span>${fileCard('COT-V-0188 · Nestlé SP.pdf', '2.000 kg · Creapure® · 1 pág.', 'margin-top:8px', true)}`, '{{c.m6}}', { hora: '09:45', ia: true })}
		</div>
		<div style="margin-top:16px;display:flex;align-items:flex-end;gap:2px;padding:6px;border:1px solid ${T.border};border-radius:${R.lg};background:${T.bg};box-shadow:0 1px 2px rgba(0,0,0,.05)">
			<span style="display:grid;place-items:center;width:36px;height:36px;border-radius:${R.md};color:${T.mutedFg}">${ico('Paperclip', 20)}</span>
			<span style="flex:1;display:flex;align-items:center;height:36px;padding:0 8px;font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg}">Mensagem para o representante...</span>
			<span style="display:grid;place-items:center;width:36px;height:36px;border-radius:${R.md};color:${T.mutedFg}">${ico('Microphone', 20)}</span>
			<span style="display:grid;place-items:center;width:36px;height:36px;border-radius:${R.md};color:${T.mutedFg}">${ico('PaperPlaneRight', 20)}</span>
		</div>
	</div>
</div>`

/* ---------------- painel SharePoint (fora da janela) -------------------- */
// Linha com checkbox: o roteiro SELECIONA os três arquivos antes de arrastar.
const spPanelRow = (nome, meta, k) =>
	`<div class="sprow {{c.sp${k}}}" style="display:flex;align-items:center;gap:12px;height:44px;margin:4px 0;padding:0 10px;border-radius:${R.md};font-size:13.33px;letter-spacing:.025em">${ico('FilePdf', 22, 'fill', 'color:#d93025')}<span style="flex:1;min-width:0;display:flex;flex-direction:column"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${nome}</span><span style="font-size:11.1px;color:${T.mutedFg}">${meta}</span></span></div>`
const SP_FILES = [
	['GMP SUCRALOSE — ANHUI JINHE.pdf', 'PDF · 1,2 MB · hoje'],
	['HALAL ÁLCOOL CETOESTEARÍLICO 30-70.pdf', 'PDF · 640 KB · hoje'],
	['COA ACESSULFAME K — lote 2408.pdf', 'PDF · 198 KB · ontem'],
	['ISO 9001 VITASWEET — 2026.pdf', 'PDF · 880 KB · há 3 dias'],
	['FDA REGISTRATION — ENSIGN.pdf', 'PDF · 310 KB · há 1 sem'],
	['MSDS INOSITOL — TJCY.pdf', 'PDF · 452 KB · há 2 sem']
]
const spPanel = `<div class="sl {{c.sp}}" style="position:absolute;left:80px;top:200px;width:440px;height:600px;border:1px solid ${T.border};border-radius:${R.xl};background:${T.card};box-shadow:0 25px 50px -12px rgba(0,0,0,.25);display:flex;flex-direction:column;overflow:hidden">
	<div style="height:64px;display:flex;align-items:center;gap:12px;padding:0 16px;border-bottom:1px solid ${T.border60}">${sharepointSvg(28)}<div style="display:flex;flex-direction:column"><span style="font-size:13.33px;font-weight:500;letter-spacing:.025em">SharePoint</span><span style="font-family:${MONO};font-size:11.1px;color:${T.mutedFg}">Faradays Qualidade · Documentos</span></div><span style="margin-left:auto">${badge('success', `${ico('ArrowsClockwise', 12)} sincronizado`)}</span></div>
	<div style="height:40px;display:flex;align-items:center;gap:4px;padding:0 16px;font-size:13.33px;letter-spacing:.025em;color:${T.mutedFg};border-bottom:1px solid ${T.border60}"><span>Documentos</span>${ico('CaretRight', 14)}<span style="color:${T.fg};font-weight:500">Novos</span><span style="margin-left:auto;font-family:${MONO};font-size:11.1px">6 arquivos</span></div>
	<div style="padding:4px 8px;display:flex;flex-direction:column">${SP_FILES.map(([n, m], k) => spPanelRow(n, m, k)).join('')}</div>
	<div style="margin-top:auto;padding:12px 16px;border-top:1px solid ${T.border60};font-size:11.1px;color:${T.mutedFg};display:flex;align-items:center;gap:6px">${ico('CloudArrowUp', 14)}Selecione e arraste para o sistema — a IA lê tipo, produto e validade.</div>
</div>`
// Cartões que "voam" do painel para a tabela (3, em pilha).
const dragCard = (nome, meta, k) =>
	`<div class="dcard d${k} {{c.card${k}}}" style="position:absolute;left:0;top:0;width:424px;transform:{{st.card${k}}};display:flex;align-items:center;gap:12px;height:44px;padding:0 10px;border-radius:${R.md};font-size:13.33px;letter-spacing:.025em;background:#dbe7f9;border:1px solid ${T.border}">${ico('FilePdf', 22, 'fill', 'color:#d93025')}<span style="flex:1;min-width:0;display:flex;flex-direction:column"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${nome}</span><span style="font-size:11.1px;color:${T.mutedFg}">${meta}</span></span></div>`

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
// icons: { palavra: svg } — a palavra ganha o ícone à esquerda (mesma linha, sobe junto).
const titleCard = (cls, title, icons = {}) =>
	`<div class="vf tc ${cls}" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 160px">
	<h1 style="margin:0;font-family:${HEAD};font-size:104px;line-height:.95;letter-spacing:-.03em;font-weight:600;color:#f4f4f4;max-width:1400px">${title
		.split(' ')
		.map((w) => (icons[w] ? `<span class="w" style="display:inline-flex;align-items:center;gap:22px;vertical-align:bottom"><span style="display:flex;transform:translateY(-4px)">${icons[w]}</span>${w}</span>` : `<span class="w">${w}</span>`))
		.join(' ')}</h1>
</div>`

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
const openCard = darkCard('{{c.open}}', `<div class="w" style="position:relative;display:flex">${wordmark(460, '#f4f4f4')}</div>`)
const closeCard = darkCard(
	'{{c.close}}',
	`<div class="w" style="position:relative;display:flex">${wordmark(460, '#f4f4f4')}</div><span class="vf {{c.replay}}" onClick="{{ replay }}" style="position:relative;cursor:pointer">${btn('Reproduzir de novo', { variant: 'outline', icon: 'ArrowsClockwise', extra: 'background:transparent;border-color:rgba(255,255,255,.18);color:#f4f4f4;box-shadow:none' })}</span>`
)


/* ---------------- instâncias externas: e-mail do exportador e celular ---- */
const OL = '#0f6cbd'
const mailRow = (from, subj, prev, hora, opts = {}) =>
	`<div class="${opts.cls ? 'vp ' + opts.cls : ''}" style="padding:10px 12px;border-bottom:1px solid #eeeeee;${opts.hot ? `background:#eaf3fc;border-left:3px solid ${OL};` : 'border-left:3px solid transparent;'}display:flex;flex-direction:column;gap:2px">
	<div style="display:flex;justify-content:space-between;gap:8px"><span style="font-size:12.5px;font-weight:${opts.hot ? 700 : 500}">${from}</span><span style="font-family:${MONO};font-size:10px;color:#7a7a7a">${hora}</span></div>
	<span style="font-size:12px;font-weight:${opts.hot ? 600 : 400};color:${opts.hot ? OL : '#333333'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${subj}</span>
	<span style="font-size:11px;color:#7a7a7a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${prev}</span>
</div>`
const outlook = `<div class="sr {{c.outlook}}" style="position:absolute;left:1076px;top:261px;width:780px;height:558px;border-radius:12px;overflow:hidden;background:#ffffff;color:#0a0a0a;box-shadow:0 50px 120px -30px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.08);display:flex;flex-direction:column;font-family:${BODY};letter-spacing:.01em">
	<div style="height:44px;flex-shrink:0;background:${OL};color:#fff;display:flex;align-items:center;gap:10px;padding:0 16px;font-size:13.33px">${ico('Envelope', 18, 'fill')}<span style="font-weight:600">Outlook</span><span style="opacity:.85">· ANHUI JINHE FOOD</span><span style="margin-left:auto;font-family:${MONO};font-size:11px;opacity:.85">Inbox</span></div>
	<div style="flex:1;min-height:0;display:flex">
		<div style="width:250px;flex-shrink:0;border-right:1px solid #e5e5e5;display:flex;flex-direction:column;overflow:hidden">
			<div style="padding:10px 12px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#7a7a7a;border-bottom:1px solid #eeeeee">Today</div>
			${mailRow('Faradays', 'BID CC-2026-012 — 3 items', 'Dear supplier, please find below our BID for FOB/CFR quotation…', '09:12', { hot: true, cls: '{{c.mailRow}}' })}
			${mailRow('COSCO Shipping', 'Booking confirmation — Qingdao/Santos', 'Your booking has been confirmed for vessel…', '08:40')}
			${mailRow('Customs broker', 'Documents for B/L draft', 'Please review the attached draft and confirm…', 'Yesterday')}
			${mailRow('Faradays', 'BID CC-2026-009 — closed', 'Thank you for your quotation. The BID was closed…', 'Yesterday')}
		</div>
		<div style="flex:1;min-width:0;display:flex;flex-direction:column">
			<div class="vf {{c.mailPane}}" style="flex:1;min-height:0;padding:18px 20px;display:flex;flex-direction:column;gap:10px;overflow:hidden">
				<span style="font-size:16px;font-weight:600;letter-spacing:0">BID CC-2026-012 — Faradays — 3 items</span>
				<div style="display:flex;align-items:center;gap:10px"><span style="display:grid;place-items:center;width:30px;height:30px;border-radius:9999px;background:${T.brand};color:#fff;font-size:12px;font-weight:600">F</span><div style="display:flex;flex-direction:column"><span style="font-size:12.5px;font-weight:600">Faradays</span><span style="font-size:11px;color:#7a7a7a">to: sales@… · today 09:12</span></div></div>
				<div style="display:flex;flex-direction:column;gap:8px;font-size:12.5px;line-height:1.5;color:#222222">
					<span>Dear supplier, please find below our BID for FOB/CFR quotation.</span>
					<span style="font-family:${MONO};font-size:11.5px;color:#555555">CREATINE 200 MESH · 15000 KG (Container 1)<br>SUCRALOSE · 5000 KG (Container 1)<br>ACESULFAME K · 3000 KG (Container 2)</span>
					<span>Please reply in this thread with price, incoterm and payment terms.</span>
					<span style="display:flex;align-items:center;gap:6px;font-size:11px;color:#7a7a7a;border-top:1px solid #eeeeee;padding-top:8px">${ico('Robot', 13)}Automated message, read by AI — reply with price and commercial terms only.</span>
				</div>
			</div>
			<div class="vp {{c.reply}}" style="margin:0 16px 16px;flex-shrink:0;border:1px solid #e5e5e5;border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:5px;font-size:12.5px;line-height:1.5;color:#222222">
				<span style="font-size:11px;color:#7a7a7a">Reply · Faradays</span>
				<span class="vf {{c.t1}}">Dear Faradays team,</span>
				<span class="vf {{c.t2}}">CREATINE 200 MESH — <b>USD 4.85/KG FOB</b> Qingdao</span>
				<span class="vf {{c.t3}}">SUCRALOSE — <b>USD 38.40/KG FOB</b> Qingdao</span>
				<span class="vf {{c.t4}}">Payment T/T 90 days · price validity 15 days</span>
				<div style="display:flex;justify-content:flex-end;margin-top:6px"><span style="display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 14px;border-radius:6px;background:${OL};color:#fff;font-size:12.5px;font-weight:600">${ico('PaperPlaneRight', 14, 'fill')}Send</span></div>
			</div>
		</div>
	</div>
</div>`
// envelope que sai do Send e voa para a janela do sistema
const mailFly = `<span class="mfly {{c.mailFly}}" style="position:absolute;left:0;top:0;transform:{{st.mailFly}};display:flex;color:${OL}">${ico('Envelope', 28, 'fill')}</span>`

const PH_SENT = '#d1f4d0', PH_RECV = '#ffffff'
const phBubble = (side, html, cls, hora, opts = {}) =>
	`<div class="vp ${cls}" style="display:flex;justify-content:${side === 'sent' ? 'flex-end' : 'flex-start'}"><div style="max-width:84%;border-radius:10px;padding:7px 10px;font-size:13px;line-height:1.4;background:${side === 'sent' ? PH_SENT : PH_RECV};color:#111111;box-shadow:0 1px 1px rgba(0,0,0,.08)">${opts.ia ? `<span style="display:flex;align-items:center;gap:4px;margin-bottom:3px;font-family:${MONO};font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:${T.brand};white-space:nowrap">${ico('Sparkle', 10, 'fill')}Agente IA · resposta automática</span>` : ''}${html}<span style="display:flex;justify-content:flex-end;align-items:center;gap:3px;margin-top:2px;font-size:10px;color:#6b6b6b">${hora}${side === 'sent' ? ico('Checks', 12, 'regular', 'color:#3b8eff') : ''}</span></div></div>`
const phFile = (nome, meta, extra = '') =>
	`<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;background:rgba(0,0,0,.05);${extra}">${ico('FilePdf', 24, 'fill', 'color:#d93025')}<div style="min-width:0;display:flex;flex-direction:column"><span style="font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${nome}</span><span style="font-size:10px;color:#6b6b6b">${meta}</span></div></div>`
const phTyping = (cls) =>
	`<div class="typing ${cls}" style="display:flex;justify-content:flex-start"><div style="display:flex;gap:4px;align-items:center;height:34px;padding:0 12px;border-radius:10px;background:${PH_RECV};box-shadow:0 1px 1px rgba(0,0,0,.08)"><span class="dot dk"></span><span class="dot dk"></span><span class="dot dk"></span></div></div>`
// Posição de repouso = a da vista dividida (1310,150); o transform st.phone
// o centraliza ampliado no começo do capítulo e o leva para lá no fim.
const phone = `<div class="ph {{c.phone}}" style="position:absolute;left:1310px;top:150px;width:390px;height:780px;transform:{{st.phone}};transform-origin:0 0;border-radius:44px;background:#0f0f0e;padding:12px;box-shadow:0 50px 120px -30px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.12)">
	<div style="width:100%;height:100%;border-radius:34px;overflow:hidden;background:#f0f2f5;display:flex;flex-direction:column;font-family:${BODY};color:#111111">
		<div style="height:26px;flex-shrink:0;background:#ffffff"></div>
		<div style="height:60px;flex-shrink:0;background:#ffffff;border-bottom:1px solid #e5e5e5;display:flex;align-items:center;gap:10px;padding:0 14px">
			<span style="display:grid;place-items:center;width:36px;height:36px;border-radius:9999px;background:rgba(37,211,102,.15)">${waGreenSvg(20)}</span>
			<div style="display:flex;flex-direction:column;flex:1;min-width:0"><span style="font-size:14px;font-weight:600">Faradays</span><span style="position:relative;height:15px;font-size:11px;line-height:15px"><span class="vf q {{c.phOn}}" style="position:absolute;left:0;top:0;display:flex;align-items:center;gap:4px;color:#6b6b6b;white-space:nowrap">${ico('Sparkle', 10, 'fill', `color:${T.brand}`)}Agente IA · responde na hora</span><span class="vf q {{c.phTyp}}" style="position:absolute;left:0;top:0;color:#128c7e;white-space:nowrap">digitando…</span></span></div>
		</div>
		<div style="flex:1;min-height:0;padding:12px;display:flex;flex-direction:column;gap:8px;overflow:hidden">
			<div style="align-self:center"><span style="display:inline-block;padding:3px 10px;border-radius:9999px;background:#ffffff;font-size:10.5px;color:#6b6b6b;box-shadow:0 1px 1px rgba(0,0,0,.06)">Hoje</span></div>
			${phBubble('sent', 'Bom dia! A Nestlé pediu o COA da creatina 200 mesh, lote 2408. Consegue me mandar?', '{{c.p1}}', '09:41')}
			${phTyping('{{c.pt1}}')}
			${phBubble('recv', `Segue o COA do lote 2408:${phFile('COA CREATINA 200 MESH — lote 2408.pdf', 'PDF · 212 KB', 'margin-top:6px')}`, '{{c.p2}}', '09:42', { ia: true })}
			${phBubble('sent', 'Valeu! E quanto tá a creatina hoje pra 2 ton, entrega SP?', '{{c.p3}}', '09:44')}
			${phTyping('{{c.pt2}}')}
			${phBubble('recv', 'Encontrei <b>2 marcas</b> de creatina na tabela vigente: Creapure® e Hansong. Qual delas?', '{{c.p4}}', '09:44', { ia: true })}
			${phBubble('sent', 'Creapure', '{{c.p5}}', '09:45')}
			${phTyping('{{c.pt3}}')}
			${phBubble('recv', `Cotação COT-V-0188 emitida — ICMS SP e câmbio do dia já calculados.${phFile('COT-V-0188 · Nestlé SP.pdf', '2.000 kg · Creapure® · 1 pág.', 'margin-top:6px')}`, '{{c.p6}}', '09:45', { ia: true })}
		</div>
		<div style="flex-shrink:0;padding:8px 10px 14px;display:flex;align-items:center;gap:8px">
			<span style="flex:1;display:flex;align-items:center;height:40px;padding:0 14px;border-radius:9999px;background:#ffffff;font-size:13px;color:#8a8a8a">Mensagem</span>
			<span style="display:grid;place-items:center;width:40px;height:40px;border-radius:9999px;background:#25d366;color:#fff">${ico('Microphone', 18, 'fill')}</span>
		</div>
	</div>
</div>`

/* ---------------- legendas laterais do cap. 3 (fora da câmera) ---------- */
const cap = (cls, over, text, place) =>
	`<div class="cap ${cls}" style="position:absolute;${place};display:flex;flex-direction:column;gap:18px">
	<span style="font-family:${MONO};font-size:15px;letter-spacing:.18em;text-transform:uppercase;color:#8ab4ff">${over}</span>
	<p style="margin:0;font-family:${HEAD};font-size:46px;line-height:1.12;letter-spacing:-.02em;font-weight:600;color:#f4f4f4">${text}</p>
</div>`
const CAP_SIDE = 'left:110px;top:0;bottom:0;width:540px;justify-content:center'
const caps = [
	cap('{{c.cap1}}', 'WhatsApp do representante', 'O representante pergunta pelo WhatsApp, como sempre.', CAP_SIDE),
	cap('{{c.cap2}}', 'Agente IA · resposta automática', 'A IA responde na hora — ninguém do seu time precisou digitar.', CAP_SIDE),
	cap('{{c.cap3}}', 'Agente IA · resposta automática', 'Tira a dúvida da marca…', CAP_SIDE),
	cap('{{c.cap4}}', 'Agente IA · cotação emitida', '…e emite a cotação, com ICMS e câmbio do dia.', CAP_SIDE),
	cap('{{c.cap5}}', 'Sistema Faradays', 'E toda a conversa fica registrada no sistema.', 'left:64px;top:862px;width:900px')
].join('')

/* ---------------- CSS -------------------------------------------------- */
const css = `
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
.tc.show .w{animation:rise .85s var(--ease) both}
.tc.show .w:nth-child(2){animation-delay:.08s}.tc.show .w:nth-child(3){animation-delay:.16s}.tc.show .w:nth-child(4){animation-delay:.24s}.tc.show .w:nth-child(5){animation-delay:.32s}
.zoomer{transform-origin:0 0;transition:transform 1.15s var(--ease)}
.zoomer.snap{transition:none}
.nr.on{background:rgba(0,101,224,.1);color:${T.brand};font-weight:500}
.nr.on .ico-fill{display:flex !important}.nr.on .ico-reg{display:none !important}
.pl{transition:background .4s var(--ease),color .4s var(--ease)}
.pl.on{background:${T.brand};color:#fff}.pl.off{background:${T.muted};color:${T.mutedFg}}
.row.show{animation:flash 1.8s var(--ease)}
@keyframes flash{0%{background:rgba(0,101,224,.14)}100%{background:transparent}}
.hl{transition:background .3s var(--ease)}.hl.hover{background:rgba(235,235,235,.4)}
.crow{transition:background .6s var(--ease)}.crow.win{background:rgba(0,201,80,.15)}
.sprow{background:${T.card};transition:background .35s var(--ease),opacity .3s var(--ease)}
.sprow.sel{background:#dbe7f9}
.sprow.taken{opacity:.35}
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
.typing{overflow:hidden;transition:height .35s var(--ease),opacity .3s var(--ease),margin-top .35s var(--ease);height:36px}
.typing.pre{height:0;opacity:0;margin-top:-12px}
.typing.show{height:36px;opacity:1;margin-top:0}
.typing.exit{height:0;opacity:0;margin-top:-12px}
.dot{width:6px;height:6px;border-radius:9999px;background:rgba(255,255,255,.8);animation:bounce 1s infinite}
.dot:nth-child(2){animation-delay:.15s}.dot:nth-child(3){animation-delay:.3s}
.dot.dk{background:rgba(0,0,0,.35)}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
/* ponto piscante da sugestão da IA */
.pulse{position:relative;display:inline-block;width:8px;height:8px;border-radius:9999px;background:${T.brand}}
.pulse::after{content:"";position:absolute;inset:-4px;border-radius:9999px;border:2px solid ${T.brand};animation:pulse 1.4s ease-out infinite}
@keyframes pulse{0%{opacity:.9;transform:scale(.6)}100%{opacity:0;transform:scale(1.6)}}
`

/* ---------------- stage ---------------------------------------------- */
const stage = `<div class="stage" style="position:relative;width:1920px;height:1080px;overflow:hidden;background:${STAGE};color:${T.fg};font-family:${BODY};font-size:16px;line-height:1.5;letter-spacing:.02em">
	${titleCard('{{c.ch1}}', 'Documentos direto do SharePoint', { SharePoint: sharepointSvg(92) })}
	${titleCard('{{c.ch2}}', 'BID em um disparo')}
	${titleCard('{{c.ch3}}', 'Conversas com IA')}

	<div class="cam {{c.cam}}" style="position:absolute;inset:0;transform-origin:0 0;transform:{{st.cam}}">
	<div class="vf {{c.win}}" style="position:absolute;left:160px;top:90px;width:1600px;height:900px">
		<div class="zoomer {{c.zoomer}}" style="transform:{{st.zoom}};width:1600px;height:900px;border-radius:12px;overflow:hidden;background:${T.bg};box-shadow:0 50px 120px -30px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.08);display:flex">
			${sidebar}
			<main style="flex:1;min-width:0;display:flex;flex-direction:column">
				${header}
				<div style="position:relative;flex:1;min-height:0">
					${docsPage}
					${bidPage}
					${waPage}
				</div>
			</main>
			<div style="position:absolute;inset:0;pointer-events:none">
				${detailModal}
			</div>
		</div>
	</div>

	${spPanel}
	${outlook}
	${mailFly}
	${phone}
	${SP_FILES.slice(0, 3).map(([n, m], k) => dragCard(n, m, k)).join('')}
	<div class="cur {{c.cur}}" style="transform:{{st.cur}}"><span class="ring"></span>${ico('Cursor', 26, 'fill', `color:${T.fg};filter:drop-shadow(0 0 1.5px rgba(255,255,255,.95)) drop-shadow(0 2px 3px rgba(0,0,0,.4));position:absolute;left:-2px;top:-2px`)}</div>
	</div>

	${caps}
	${openCard}
	${closeCard}
</div>`

/* ---------------- lógica (timeline) ------------------------------------ */
const CUES = [
	['boot', 0], ['open', 350], ['openOut', 3300], ['ch1Out', 6400],
	['spIn', 7300], ['zoomSp', 7550], ['c1', 8200], ['k1', 8600], ['c2', 8900], ['k2', 9300], ['c3', 9600], ['k3', 10000],
	['grab', 10500], ['drop', 11300], ['cutSp', 11650], ['r1', 11750], ['r2', 11900], ['r3', 12050],
	['spOut', 12500], ['zoomStatus', 12800], ['read', 13900], ['zoomOut1', 15600],
	['cPastas', 16400], ['cutA1', 17000], ['cut1', 17200],
	['docsOut', 19800], ['rst1', 20700], ['ch2Out', 22800],
	['cRow', 24000], ['kRow', 24600], ['cDisp', 26000], ['kDisp', 26600], ['env', 27700],
	['split', 28300], ['mailIn', 29500], ['replyOpen', 31200], ['t1', 31800], ['t2', 32500], ['t3', 33200], ['t4', 33900],
	['cSend', 34700], ['kSend', 35300], ['flyGone', 36400], ['unsplit', 36600],
	['cutA2', 37700], ['cut2', 37900], ['read2', 39200],
	['sug', 40200], ['cVenc', 41500], ['kVenc', 42100], ['zoomOut2', 43500],
	['cFechar', 44400], ['kFechar', 45000],
	['bidOut', 47200], ['rst2', 48100], ['ch3Out', 50100],
	['phoneIn', 50700], ['p1', 51900], ['cap1', 52000],
	['ptyp1', 53000], ['p2', 54300], ['cap2', 54500],
	['p3', 56600], ['ptyp2', 57500], ['p4', 58900], ['cap3', 59000],
	['p5', 60300], ['ptyp3', 61100], ['p6', 62700], ['cap4', 62800],
	['toSys', 65200], ['cap5', 65700],
	['zoomConv', 67600], ['zoomOut3', 70300], ['waOut', 71800], ['rst3', 72700], ['end', 74400]
].sort((a, b) => a[1] - b[1])

const logic = `
const CUES = ${JSON.stringify(CUES)};
const I = {}; CUES.forEach((c, k) => { I[c[0]] = k; });
const START = { Abertura: 0, SharePoint: I.openOut, BID: I.docsOut, Conversas: I.bidOut };
// Janela do app na prancha (px) — a câmera é um transform na janela.
const WX = 160, WY = 90;
const focus = (cx, cy, s) => 'translate(' + (960 - WX - s * cx) + 'px,' + (540 - WY - s * cy) + 'px) scale(' + s + ')';
// Encosta a janela em (x,y) da prancha, na escala s — a vista dividida.
const place = (x, y, s) => 'translate(' + (x - WX) + 'px,' + (y - WY) + 'px) scale(' + s + ')';
const NOZOOM = 'translate(0px,0px) scale(1)';
const LEFT = [64, 261, 0.62];
// Ponto da janela → prancha, para a câmera (fx, fy, s) em foco ou (x, y, s) encostada.
const zpt = (cx, cy, f) => [960 + f[2] * (cx - f[0]), 540 + f[2] * (cy - f[1])];
const lpt = (cx, cy) => [LEFT[0] + LEFT[2] * cx, LEFT[1] + LEFT[2] * cy];
const ZP = [700, 330, 1.9];
// Posições na prancha (px). Painel SharePoint em (80,200); linhas de 52px a partir de y=312.
const spRow = (k) => [88, 312 + 52 * k];
const tblRow = (k) => [472, 706 + 48 * k];          // linhas 7..9 da tabela de documentos
const tr = (x, y) => 'translate(' + x + 'px,' + y + 'px)';
const trs = (p, s) => 'translate(' + p[0] + 'px,' + p[1] + 'px) scale(' + s + ')';
// Câmera da prancha inteira (origem 0,0): centraliza (cx,cy) na escala s.
const CAM0 = 'translate(0px,0px) scale(1)';
const camFocus = (cx, cy, s) => 'translate(' + (960 - s * cx) + 'px,' + (540 - s * cy) + 'px) scale(' + s + ')';
// Celular (390×780 em 1310,150) centralizado na prancha, ampliado.
const PH_S = 1.28;
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
			if (el > this.total + 2600 && (this.props.loop ?? false)) this.startAt('Abertura');
		}, 40);
	}
	componentDidUpdate(prev) {
		if (prev.pausar !== this.props.pausar) {
			if (this.props.pausar) this.frozen = performance.now() - this.t0;
			else { this.t0 = performance.now() - (this.frozen ?? 0); this.frozen = null; }
		}
		if (prev.inicio !== this.props.inicio) this.startAt(this.props.inicio);
		if (prev.tempo !== this.props.tempo) this.seek(Math.max(0, Math.min(75, Number(this.props.tempo) || 0)) * 1000);
	}
	componentWillUnmount() { clearInterval(this.timer); }
	renderVals() {
		const i = this.state.step;
		// Estado = o do último cue já atingido na lista; antes do primeiro, o default.
		const seq = (def, ...pairs) => { let v = def; for (const [n, s] of pairs) if (i >= I[n]) v = s; return v; };
		const c = {}, st = {};
		// Cartelas (fade) e janela do app (fade)
		c.open = seq('pre', ['open', 'show'], ['openOut', 'exit']);
		c.ch1 = seq('pre', ['openOut', 'show'], ['ch1Out', 'exit']);
		c.ch2 = seq('pre', ['docsOut', 'show'], ['ch2Out', 'exit']);
		c.ch3 = seq('pre', ['bidOut', 'show'], ['ch3Out', 'exit']);
		c.close = seq('pre', ['waOut', 'show']);
		c.replay = (this.props.loop ?? false) ? 'pre' : seq('pre', ['end', 'show']);
		c.win = seq('pre', ['ch1Out', 'show'], ['docsOut', 'exit'], ['rst1', 'pre'], ['ch2Out', 'show'], ['bidOut', 'exit'], ['rst2', 'pre'], ['toSys', 'show'], ['waOut', 'exit']);
		// Páginas dentro da janela trocam enquanto ela está invisível.
		c.pgDocs = seq('show', ['rst1', 'pre']);
		c.pgBid = seq('pre', ['rst1', 'show'], ['rst2', 'pre']);
		c.pgWa = seq('pre', ['rst2', 'show']);
		c.crDocs = seq('show', ['rst1', 'pre']); c.crBid = seq('pre', ['rst1', 'show'], ['rst2', 'pre']); c.crWa = seq('pre', ['rst2', 'show']);
		c.navDocs = seq('on', ['rst1', '']); c.navBid = seq('', ['rst1', 'on'], ['rst2', '']); c.navWa = seq('', ['rst2', 'on']);
		// Cap. 1 — SharePoint: a câmera fecha no painel enquanto ele entra, os três
		// arquivos são selecionados em zoom e, com a pilha já voando, CORTA para a vista inteira.
		st.cam = seq(CAM0, ['zoomSp', camFocus(470, 500, 1.7)], ['cutSp', CAM0]);
		c.cam = seq('', ['cutSp', 'snap'], ['spOut', '']);
		c.sp = seq('pre', ['spIn', 'show'], ['spOut', 'exit']);
		for (let k = 0; k < 3; k++) {
			const kk = 'k' + (k + 1), r = 'r' + (k + 1);
			c['sp' + k] = seq('', [kk, 'sel'], ['drop', 'sel taken']);
			c['card' + k] = seq('', ['grab', 'lift'], ['drop', 'fly'], [r, 'gone']);
			st['card' + k] = seq(tr(...spRow(k)), ['drop', tr(...tblRow(k))]);
			c[r] = seq('pre', [r, 'show']);
		}
		c.sp3 = ''; c.sp4 = ''; c.sp5 = '';
		c.lendo = seq('show', ['read', 'exit']); c.lido = seq('pre', ['read', 'show']);
		c.pillDocs = seq('on', ['cut1', 'off']); c.pillPastas = seq('off', ['cut1', 'on']);
		c.docsTable = seq('show', ['cutA1', 'out'], ['cut1', 'gone']); c.docsTree = seq('pre', ['cut1', 'show']);
		// Cap. 2 — BID
		c.rowBid = seq('', ['cRow', 'hover'], ['kRow', '']);
		c.overlay = seq('pre', ['kRow', 'show'], ['bidOut', 'exit']); c.modal = seq('pre', ['kRow', 'show'], ['bidOut', 'exit']);
		c.pillDisp = seq('on', ['cut2', 'off']); c.pillCmp = seq('off', ['cut2', 'on']);
		c.disp = seq('show', ['cutA2', 'out'], ['cut2', 'gone']); c.cmp = seq('pre', ['cut2', 'show']);
		c.btnDisp = 'show'; c.btnFechar = 'show';
		c.env = seq('', ['kDisp', 'fly'], ['env', 'gone']);
		// e-mail do exportador: entra na vista dividida, recebe o BID, responde
		c.outlook = seq('pre', ['split', 'show'], ['unsplit', 'exit']);
		c.mailRow = seq('pre', ['mailIn', 'show']); c.mailPane = seq('pre', ['mailIn', 'show']);
		c.reply = seq('pre', ['replyOpen', 'show']);
		c.t1 = seq('pre', ['t1', 'show']); c.t2 = seq('pre', ['t2', 'show']); c.t3 = seq('pre', ['t3', 'show']); c.t4 = seq('pre', ['t4', 'show']);
		c.mailFly = seq('', ['kSend', 'fly'], ['flyGone', 'gone']);
		st.mailFly = seq(tr(1770, 758), ['kSend', tr(...lpt(800, 430))]);
		// comparativo: a linha da ANHUI chega lendo o e-mail e depois preenche
		c.aLendo = seq('show', ['read2', 'exit']); c.aLido = seq('pre', ['read2', 'show']);
		c.sug = seq('pre', ['sug', 'show']);
		c.rowWin = seq('', ['kVenc', 'win']); c.cbOff = seq('show', ['kVenc', 'exit']); c.cbOn = seq('pre', ['kVenc', 'show']);
		// Cap. 3 — só o celular do representante, centralizado: a IA responde sozinha
		// (rótulo nos balões, "digitando…", legendas laterais); no fim o celular vai
		// para a direita, o sistema entra ao lado e a câmera fecha na conversa.
		c.phone = seq('pre', ['phoneIn', 'show'], ['zoomConv', 'exit']);
		st.phone = seq(phCenter(70), ['phoneIn', phCenter(0)], ['toSys', trs([0, 0], 1)], ['zoomConv', trs([900, 0], 1)]);
		c.p1 = seq('pre', ['p1', 'show']); c.p2 = seq('pre', ['p2', 'show']); c.p3 = seq('pre', ['p3', 'show']);
		c.p4 = seq('pre', ['p4', 'show']); c.p5 = seq('pre', ['p5', 'show']); c.p6 = seq('pre', ['p6', 'show']);
		c.pt1 = seq('pre', ['ptyp1', 'show'], ['p2', 'exit']); c.pt2 = seq('pre', ['ptyp2', 'show'], ['p4', 'exit']); c.pt3 = seq('pre', ['ptyp3', 'show'], ['p6', 'exit']);
		c.phOn = seq('show', ['ptyp1', 'exit'], ['p2', 'show'], ['ptyp2', 'exit'], ['p4', 'show'], ['ptyp3', 'exit'], ['p6', 'show']);
		c.phTyp = seq('pre', ['ptyp1', 'show'], ['p2', 'exit'], ['ptyp2', 'show'], ['p4', 'exit'], ['ptyp3', 'show'], ['p6', 'exit']);
		c.cap1 = seq('', ['cap1', 'show'], ['cap2', 'exit']); c.cap2 = seq('', ['cap2', 'show'], ['cap3', 'exit']);
		c.cap3 = seq('', ['cap3', 'show'], ['cap4', 'exit']); c.cap4 = seq('', ['cap4', 'show'], ['toSys', 'exit']);
		c.cap5 = seq('', ['cap5', 'show'], ['zoomConv', 'exit']);
		// No sistema a conversa já está inteira quando a janela aparece.
		for (const m of ['m1', 'm2', 'm3', 'm4', 'm5', 'm6']) c[m] = 'show';
		// Câmera: zoom, vista dividida (janela encostada à esquerda) e volta
		st.zoom = seq(NOZOOM,
			['zoomStatus', focus(1100, 620, 2.1)], ['zoomOut1', NOZOOM],
			['rst1', NOZOOM],
			['split', place(LEFT[0], LEFT[1], LEFT[2])], ['unsplit', NOZOOM],
			['cut2', focus(ZP[0], ZP[1], ZP[2])], ['zoomOut2', NOZOOM],
			['rst2', place(LEFT[0], LEFT[1], LEFT[2])],
			['zoomConv', focus(944, 442, 1920 / 1312)], ['zoomOut3', NOZOOM]);
		// O comparativo já entra em zoom: a câmera SALTA no instante do corte.
		c.zoomer = seq('', ['cut2', 'snap'], ['sug', '']);
		// Cursor (coordenadas da prancha). Na vista dividida e no zoom, segue a câmera.
		const CP = {
			idle: [900, 620],
			c1: [300, 334], c2: [300, 386], c3: [300, 438], drop: [700, 776],
			cPastas: [892, 254],
			cRow: [852, 346],
			cDisp: [1422, 903],
			cSend: [1790, 775],
			sug: zpt(560, 480, ZP), cVenc: zpt(400, 240, ZP),
			cFechar: [1432, 903]
		};
		const cx = seq(null, ['spIn', 'idle'], ['c1', 'c1'], ['c2', 'c2'], ['c3', 'c3'], ['grab', 'c3'], ['drop', 'drop'],
			['cPastas', 'cPastas'], ['rst1', 'idle'], ['cRow', 'cRow'], ['cDisp', 'cDisp'], ['split', 'cSend'], ['sug', 'sug'], ['cVenc', 'cVenc'], ['zoomOut2', 'cFechar'],
			['rst2', 'idle']);
		const p = cx ? CP[cx] : CP.idle;
		st.cur = tr(p[0], p[1]);
		const curOn = seq(false, ['spIn', true], ['spOut', false], ['zoomOut1', true], ['cut1', false],
			['cRow', true], ['kDisp', false], ['cSend', true], ['kSend', false], ['sug', true], ['kVenc', false], ['zoomOut2', true], ['kFechar', false]);
		const click = seq('', ['k1', 'kA'], ['k2', 'kB'], ['k3', 'kA'], ['grab', 'kB'], ['cut1', 'kA'], ['kRow', 'kB'], ['kDisp', 'kA'], ['kSend', 'kB'], ['kVenc', 'kA'], ['kFechar', 'kB']);
		c.cur = (curOn ? '' : 'hide') + ' ' + click;
		// Envelopes: do botão "Disparar BID" às linhas dos exportadores (coordenadas do modal).
		for (let k = 0; k < 4; k++) st['env' + k] = seq(tr(1040, 760), ['kDisp', tr(1090, 180 + 40 * k)]);
		return { c, st, replay: () => this.startAt('Abertura') };
	}
}
`

// Estilos por envelope (transform hole individual): substitui o marcador no HTML.
let html = stage
for (let k = 0; k < 4; k++) {
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
<script data-dc-script data-props='{"inicio":{"editor":"enum","options":["Abertura","SharePoint","BID","Conversas"],"default":"Abertura","section":"Reprodução"},"tempo":{"editor":"range","min":0,"max":75,"step":0.5,"unit":"s","default":0,"section":"Reprodução"},"pausar":{"editor":"boolean","default":false,"section":"Reprodução"},"loop":{"editor":"boolean","default":false,"section":"Reprodução"},"$preview":{"width":1920,"height":1080}}'>${logic}</script>
</body>
</html>
`
fs.writeFileSync('Main.dc.html', doc)
fs.writeFileSync(
	'canvas.json',
	JSON.stringify(
		{
			artboards: [
				{ file: 'Main.dc.html', x: 0, y: 0, w: 1920, h: 1080, title: 'Showcase · 60s', is_interactive: true },
				{ file: 'Mascote.dc.html', x: 0, y: 1240, w: 1920, h: 900, title: 'Mascote' }
			],
			annotations: [
				{
					id: 'roteiro',
					x: 2000,
					y: 0,
					w: 380,
					text:
						'Roteiro (75s)\n\n0:00 Abertura — logo Faradays sobre fundo escuro\n0:06 Documentos direto do SharePoint — a câmera fecha no painel do drive enquanto ele entra; 3 arquivos selecionados em zoom; com a pilha já voando, corte seco para a vista inteira; IA lê validade (zoom nos status), corte seco para a aba Pastas\n0:23 BID em um disparo — lista → modal → Disparar BID (4) → envelopes → vista dividida: a caixa de e-mail do exportador recebe o BID e responde com preço → o e-mail voa de volta → corte seco para o Comparativo JÁ EM ZOOM, com a linha da ANHUI chegando “lendo e-mail…” → IA sugere (ponto piscante) → clique na linha → Fechar cotação\n0:50 Conversas com IA — só o celular do representante, centralizado: ele pede o COA → "digitando…" → a IA responde sozinha (rótulo Agente IA nos balões; legendas laterais) → pergunta a marca → emite a cotação; no fim o celular vai para a direita, o sistema entra ao lado com a conversa inteira e a câmera fecha nela\n1:12 Fechamento — logo\n\nTransições: cartela ↔ demo em fade; match cut seco (sem fade, corta no meio do movimento) só em tabela→Pastas e disparo→comparativo.\n\nChips: Início pula ao capítulo; Tempo vai a um instante; Pausar congela; Loop repete.'
				}
			],
			launch: { view: 'focused', file: 'Main.dc.html' }
		},
		null,
		'\t'
	)
)
console.log('ok', (doc.length / 1024).toFixed(0) + ' KB')

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
		.replace(/onClick="\{\{ replay \}\}"/g, 'data-replay="1"')

const standaloneHtml = toStandalone(html)
if (/\{\{/.test(standaloneHtml)) throw new Error('hole sobrando no standalone: ' + standaloneHtml.match(/\{\{[^}]*\}\}/)[0])

const runtime = `
class DCLogic { constructor(props) { this.props = props } }
${logic}
const params = new URLSearchParams(location.search)
const props = { inicio: params.get('inicio') || 'Abertura', loop: params.has('loop'), pausar: params.has('pause'), tempo: 0 }
const comp = new Component(props)
const elsC = [...document.querySelectorAll('[data-c]')], elsS = [...document.querySelectorAll('[data-st]')]
function paint() {
	const v = comp.renderVals()
	for (const el of elsC) el.className = (el.dataset.base + ' ' + (v.c[el.dataset.c] ?? '')).trim()
	for (const el of elsS) el.style.transform = v.st[el.dataset.st] ?? ''
}
comp.setState = function (s) { Object.assign(this.state, s); paint() }
document.querilySelectorAll = null
for (const el of document.querySelectorAll('[data-replay]')) el.addEventListener('click', () => comp.startAt('Abertura'))
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
const CH = [['Abertura', 0], ['Documentos', CUES[I.openOut][1]], ['BID', CUES[I.docsOut][1]], ['Conversas', CUES[I.bidOut][1]], ['Fechamento', CUES[I.waOut][1]]]
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
	else if (e.key === '1') { comp.startAt('SharePoint'); say('Documentos') }
	else if (e.key === '2') { comp.startAt('BID'); say('BID') }
	else if (e.key === '3') { comp.startAt('Conversas'); say('Conversas') }
	else if (e.key === 'f' || e.key === 'F') toggleFS()
})
// Clique/toque na prancha pausa/retoma (fora do botão de replay e da timeline).
fitEl.addEventListener('click', (e) => { if (!e.target.closest('[data-replay]') && !e.target.closest('.tl')) togglePause() })
// Controles: timeline por capítulo embaixo + play/pause no centro. Aparecem ao passar o mouse
// (somem 2,2 s depois, se estiver rodando), ficam fixos enquanto pausado e por 1,4 s após um pulo.
const tl = document.querySelector('.tl'), track = tl.querySelector('.tl-track'), clock = tl.querySelector('.tl-clock'), shade = document.querySelector('.tl-shade'), pp = document.querySelector('.pp')
let ctlTimer = null
function setControls(on) { tl.classList.toggle('on', on); shade.classList.toggle('on', on); pp.classList.toggle('on', on); fitEl.classList.toggle('nocur', !on) }
function showControls(temp) {
	setControls(true); clearTimeout(ctlTimer)
	if (temp) ctlTimer = setTimeout(() => { if (comp.frozen == null) setControls(false) }, 2200)
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
<title>Showcase Faradays</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">
<style>
html,body{margin:0;height:100%;overflow:hidden;background:${STAGE};touch-action:manipulation;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}
.fit{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;cursor:default}
.fit.nocur{cursor:none}
.tl-shade{position:absolute;left:0;right:0;bottom:0;height:320px;background:linear-gradient(to top,${rgba(STAGE, 0.96)} 0%,${rgba(STAGE, 0.75)} 45%,${rgba(STAGE, 0)} 100%);opacity:0;transition:opacity .35s;pointer-events:none}
.tl-shade.on{opacity:1}
.tl{position:absolute;left:64px;right:64px;bottom:40px;display:flex;align-items:flex-start;gap:20px;opacity:0;transition:opacity .3s;pointer-events:none}
.tl.on{opacity:1;pointer-events:auto}
.tl-track{flex:1;display:flex;gap:6px;height:6px}
.seg{position:relative;height:6px;border-radius:3px;background:rgba(255,255,255,.16);cursor:pointer}
.seg.active{background:rgba(255,255,255,.34)}
.seg .fill{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:#0065e0;width:0}
.seg .lb{position:absolute;top:14px;left:0;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.55);white-space:nowrap}
.seg.active .lb{color:#f4f4f4}
.tl-clock{flex-shrink:0;margin-top:-6px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:13px;letter-spacing:.06em;color:rgba(255,255,255,.7);font-variant-numeric:tabular-nums}
.tl-fs{flex-shrink:0;margin-top:-9px;display:flex;color:rgba(255,255,255,.7);cursor:pointer}
.tl-fs:hover{color:#f4f4f4}
.pp{position:absolute;left:50%;top:50%;width:112px;height:112px;margin:-56px 0 0 -56px;border-radius:9999px;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);color:#f4f4f4;display:grid;place-items:center;opacity:0;transform:scale(.9);transition:opacity .3s,transform .3s var(--ease);pointer-events:none;cursor:pointer}
.pp.on{opacity:1;transform:none;pointer-events:auto}
.pp svg{display:none;width:44px;height:44px}
.pp.paused .i-play{display:block;margin-left:6px}
.pp:not(.paused) .i-pause{display:block}
.pp.pop{animation:pop .45s var(--ease)}
@keyframes pop{0%{transform:scale(.85)}60%{transform:scale(1.08)}100%{transform:scale(1)}}
.hint{position:absolute;left:64px;bottom:96px;padding:8px 14px;border-radius:9999px;background:rgba(255,255,255,.08);color:#f4f4f4;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:14px;letter-spacing:.08em;text-transform:uppercase;opacity:0;transition:opacity .3s;pointer-events:none}
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
.rot{position:fixed;inset:0;z-index:10;display:none;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:32px;background:${rgba(STAGE, 0.96)};color:#f4f4f4;text-align:center;font-family:Geist,'Helvetica Neue',system-ui,sans-serif}
.rot.on{display:flex}
.rot-phone{position:relative;width:46px;height:82px;margin-bottom:14px;border:3px solid #f4f4f4;border-radius:11px;animation:rot 2.6s var(--ease) infinite}
.rot-phone::after{content:"";position:absolute;left:50%;bottom:5px;width:14px;height:3px;margin-left:-7px;border-radius:2px;background:#f4f4f4}
@keyframes rot{0%,22%{transform:rotate(0)}50%,82%{transform:rotate(-90deg)}100%{transform:rotate(0)}}
.rot-t{margin:0;font-size:22px;font-weight:600;letter-spacing:-.01em}
.rot-s{margin:0;max-width:280px;font-size:14px;line-height:1.5;color:rgba(244,244,244,.7)}
.rot-skip{margin-top:18px;padding:10px 16px;border-radius:9999px;border:1px solid rgba(255,255,255,.22);background:transparent;color:#f4f4f4;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase}
${css}
html,body{background:${STAGE}}
</style>
</head>
<body>
<div class="fit">${standaloneHtml}<div class="tl-shade"></div><div class="tl"><div class="tl-track"></div><span class="tl-clock"></span><span class="tl-fs" title="Tela cheia (F)">${ico('CornersOut', 18, 'bold')}</span></div><div class="pp" title="Pausar / retomar">${ico('Play', 44, 'fill', '', 'i-play')}${ico('Pause', 44, 'fill', '', 'i-pause')}</div><div class="hint"></div></div>
<div class="rot"><div class="rot-phone"></div><p class="rot-t">Gire o celular</p><p class="rot-s">O vídeo é widescreen — na horizontal ele ocupa a tela toda.</p><button class="rot-skip" type="button">Assistir assim mesmo</button></div>
<script>${runtime}</script>
</body>
</html>
`
fs.writeFileSync('index.html', standalone)
console.log('ok standalone', (standalone.length / 1024).toFixed(0) + ' KB')
