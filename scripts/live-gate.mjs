// Explicit live test, never run in CI. Read secrets silently from the ignored server env.
import { readFile } from 'node:fs/promises';
const env = Object.fromEntries((await readFile('proxy/.env', 'utf8')).split(/\r?\n/).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).trim()]; }));
if (!env.OPENAI_API_KEY || env.AI_ENABLED !== 'true' || !env.CLASS_CODE) throw new Error('Configure the ignored server env and enable AI before live gating. No values displayed.');
const url = process.env.POC_PROXY_URL || 'http://127.0.0.1:8787';
const cases = [
  { mission: 'vibration', language: 'bm', observation: 'Pembaris bergerak ulang-alik selepas dipetik.', explanation: 'Bunyi terhasil oleh getaran pembaris.', mitigation: '' },
  { mission: 'detective', language: 'bm', observation: 'Label murid: hon kenderaan di luar kelas.', explanation: 'Hon memberi amaran tetapi hon berulang mengganggu tumpuan.', mitigation: 'Kurangkan penggunaan hon berhampiran sekolah.' },
];
for (const input of cases) {
  const start = performance.now();
  const response = await fetch(`${url}/api/feedback`, { method: 'POST', headers: { Origin: 'http://127.0.0.1:5173', 'Content-Type': 'application/json', 'X-Class-Code': env.CLASS_CODE }, body: JSON.stringify(input), signal: AbortSignal.timeout(25000) });
  const data = await response.json();
  if (!response.ok || data.source !== 'openai' || !data.feedback) throw new Error(`${input.mission}: live interaction failed (HTTP ${response.status}); inspect server configuration privately.`);
  console.log(JSON.stringify({ mission: input.mission, source: data.source, promptVersion: data.promptVersion, latencyMs: Math.round(performance.now() - start), feedback: data.feedback }));
}
console.log('Transport success only. Teacher must assess science/helpfulness using VALIDATION.md; do not auto-pass the science gate.');
