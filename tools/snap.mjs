import { spawn } from 'node:child_process';
import fs from 'node:fs';
const file = process.argv[2]; const times = process.argv.slice(3).map(Number);
const port = 9333;
const chrome = spawn('google-chrome', ['--headless=new','--disable-gpu','--no-sandbox','--hide-scrollbars',`--remote-debugging-port=${port}`,'--window-size=2100,1240','about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function json(u){ const r = await fetch(u); return r.json(); }
try {
  let targets; for (let k=0;k<50;k++){ try { targets = await json(`http://127.0.0.1:${port}/json`); break; } catch { await sleep(200); } }
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 0; const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } };
  const send = (method, params={}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 2100, height: 1240, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'file://' + file });
  const t0 = Date.now();
  for (const t of times) {
    const wait = t0 + t - Date.now(); if (wait > 0) await sleep(wait);
    const r = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`shot-${t}.png`, Buffer.from(r.data, 'base64'));
    console.log('shot', t);
  }
} finally { chrome.kill(); }
