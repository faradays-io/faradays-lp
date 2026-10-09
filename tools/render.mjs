// Exporta o showcase para MP4 QUADRO A QUADRO, sem travadas (a gravação de tela trava quando o PC engasga).
// Rode: node render.mjs [index-1min.html] [--fps 60] [--partes 3] [--ate 12] [--saida ../showcase-1min.mp4]
//
// Como funciona: o Chrome sem janela não tem controle de quadro a quadro, então o relógio é o das ANIMAÇÕES da
// página (document.timeline). O CDP `Animation.setPlaybackRate` desacelera esse relógio (CSS, transições) e a página
// passa a ler o mesmo relógio em `performance.now` — a timeline dos cues e o GSAP do Problema andam juntos. A cada
// quadro: o relógio anda 1/fps em câmera lenta, CONGELA (rate 0), o quadro é fotografado e vai direto para o ffmpeg
// (sem PNG no disco). O resultado não depende da carga da máquina: se ela estiver ocupada, só demora mais.
// Velocidade: a captura é o gargalo (~450 ms por quadro desenhando os blurs no processador), então o Chrome usa a GPU
// (Vulkan: ~140 ms em JPEG) e o vídeo é dividido em PARTES renderizadas em paralelo, cada uma num Chrome: ela corre
// rápido (sem capturar) até 2,5 s antes do seu trecho, entra em quadro a quadro para as transições chegarem certas e só
// grava do seu primeiro quadro em diante; no fim as partes são emendadas sem recompressão.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const opt = (nome, padrao) => { const i = args.indexOf('--' + nome); return i >= 0 ? args[i + 1] : padrao }
const arquivo = path.resolve(args.find((a) => a.endsWith('.html')) ?? 'index-1min.html')
const FPS = Number(opt('fps', 60))
const RATE = Number(opt('rate', 0.12)) // velocidade da câmera lenta entre um quadro e outro
const saida = path.resolve(opt('saida', '../showcase-1min.mp4'))
const ate = opt('ate', null) // segundos (para testes); padrão: o vídeo inteiro
const PARTES = Number(opt('partes', 3))
const trecho = opt('trecho', null) // uso interno: "n0:n1" (quadros) de uma parte
const ID = Number(opt('id', 0))
fs.mkdirSync(path.resolve('.render'), { recursive: true })

// Coordenador: divide em partes, roda uma por processo e emenda.
if (!trecho) {
	const html = fs.readFileSync(arquivo, 'utf8')
	const cues = JSON.parse(html.match(/const CUES = (\[.*?\]);/)[1])
	const total = ate ? Number(ate) * 1000 : cues[cues.length - 1][1]
	const quadros = Math.ceil((total / 1000) * FPS)
	const cortes = Array.from({ length: PARTES + 1 }, (_, k) => Math.round((quadros * k) / PARTES))
	const inicio = Date.now()
	console.log(`${quadros} quadros a ${FPS} fps em ${PARTES} partes`)
	const partes = cortes.slice(0, -1).map((n0, k) => path.resolve(`.render/parte-${k}.mp4`))
	await Promise.all(partes.map((saidaK, k) => new Promise((ok, falha) => {
		const p = spawn(process.execPath, [process.argv[1], arquivo, '--fps', String(FPS), '--rate', String(RATE), '--trecho', `${cortes[k]}:${cortes[k + 1]}`, '--id', String(k), '--saida', saidaK], { stdio: ['ignore', 'pipe', 'inherit'] })
		p.stdout.on('data', (d) => process.stdout.write(`[parte ${k + 1}] ${d}`))
		p.on('close', (c) => (c === 0 ? ok() : falha(new Error('parte ' + k + ' saiu com ' + c))))
	})))
	const lista = path.resolve('.render/partes.txt')
	fs.writeFileSync(lista, partes.map((f) => `file '${f}'`).join('\n'))
	await new Promise((ok) => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', '-movflags', '+faststart', saida], { stdio: 'inherit' }).on('close', ok))
	for (const f of [...partes, lista]) fs.rmSync(f, { force: true })
	console.log('ok', saida, `em ${Math.round((Date.now() - inicio) / 1000)} s`)
	process.exit(0)
}
const [N0, N1] = trecho.split(':').map(Number)

const port = 9351 + ID
const perfil = path.resolve(`.render/perfil-render-${ID}`)
const chrome = spawn('google-chrome', ['--headless=new', `--remote-debugging-port=${port}`, '--window-size=1920,1080', '--hide-scrollbars', '--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=vulkan', '--enable-features=Vulkan', `--user-data-dir=${perfil}`, 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let list
for (let i = 0; i < 50; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (list.length) break } catch {} await sleep(200) }
const ws = new WebSocket(list.find((x) => x.type === 'page').webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const pend = {}
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result ?? m.error); delete pend[m.id] } }
const send = (method, params = {}) => new Promise((r) => { const k = ++id; pend[k] = r; ws.send(JSON.stringify({ id: k, method, params })) })
const ev = async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true })).result?.value

await send('Page.enable')
// performance.now passa a ser o relógio das animações (o mesmo que o setPlaybackRate controla)
await send('Page.addScriptToEvaluateOnNewDocument', { source: `{ const _pn = performance.now.bind(performance); performance.now = () => (document.timeline && document.timeline.currentTime != null ? document.timeline.currentTime : _pn()) }` })
await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: `file://${arquivo}?noloop&pause` })
for (let i = 0; i < 100; i++) { if (await ev('typeof HOOK_TL !== "undefined" && !!HOOK_TL')) break; await sleep(200) }
await ev(`document.fonts.ready.then(() => 1)`)
// sem os controles do player, sem cursor
await ev(`{ const s = document.createElement('style'); s.textContent = '.tl-shade,.tl,.pp,.hint,.rot{display:none !important} *{cursor:none !important}'; document.head.appendChild(s); 1 }`)
await send('Animation.enable')
await send('Animation.setPlaybackRate', { playbackRate: 0 })
await ev(`comp.frozen = null; comp.startAt('Abertura'); 1`)
// corre rápido (sem capturar) até 2,5 s antes do trecho; dali em diante, quadro a quadro
const AQUECE = 2500
const corrida = Math.max(0, (N0 * 1000) / FPS - AQUECE)
if (corrida > 0) {
	await send('Animation.setPlaybackRate', { playbackRate: 1.5 })
	while ((await ev('elapsed()')) < corrida - 200) await sleep(Math.min(500, (corrida - (await ev('elapsed()'))) / 1.5))
	await send('Animation.setPlaybackRate', { playbackRate: 0 })
}
const nAquece = Math.max(0, Math.floor(((await ev('elapsed()')) * FPS) / 1000) + 1)

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-r', String(FPS), saida], { stdio: ['pipe', 'inherit', 'inherit'] })
const escreve = (buf) => new Promise((r) => (ff.stdin.write(buf) ? r() : ff.stdin.once('drain', r)))

const inicio = Date.now()
let atraso = 0
const quadros = N1 - N0
for (let n = Math.min(nAquece, N0); n < N1; n++) {
	const alvo = (n * 1000) / FPS
	const agora = await ev('elapsed()')
	if (alvo > agora) {
		await send('Animation.setPlaybackRate', { playbackRate: RATE })
		await sleep((alvo - agora) / RATE)
		await send('Animation.setPlaybackRate', { playbackRate: 0 })
	}
	await sleep(45) // um tick da timeline (40 ms) e um rAF do GSAP com o relógio já congelado
	if (n < N0) continue // aquecimento: o relógio anda, mas o quadro não entra no vídeo
	atraso = Math.max(atraso, (await ev('elapsed()')) - alvo)
	const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 95, optimizeForSpeed: true })
	await escreve(Buffer.from(shot.data, 'base64'))
	const feitos = n - N0 + 1
	if (feitos % (FPS * 2) === 0 || n === N1 - 1) {
		const feito = feitos / quadros, gasto = (Date.now() - inicio) / 1000
		console.log(`${(alvo / 1000).toFixed(1)} s · ${(feito * 100).toFixed(0)}% · faltam ~${Math.round(gasto / feito - gasto)} s · maior atraso ${atraso.toFixed(1)} ms\n`)
	}
}
ff.stdin.end()
await new Promise((r) => ff.on('close', r))
console.log(`pronta (${quadros} quadros em ${Math.round((Date.now() - inicio) / 1000)} s)\n`)
chrome.kill()
process.exit(0)
