import './style.css';
import {Capture, decode} from './audio';
import {quality, PREPROCESSING} from './features';
import {Classifier} from './model';
import {LABELS, POLICY, summarize, type Label} from './policy';
import {sha256, testReadiness, validateDataset, type Dataset, type EventRecord} from './dataset';
import {readRecord, writeRecord} from './store';
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const classifier = new Classifier(), capture = new Capture();
let pcm: Float32Array | undefined, source: 'live' | 'file' | undefined, data: Dataset | undefined;
let lastResult: unknown, manifestHash: string | undefined;
let busy = false, request = 0;
const logs: string[] = [], evidence: unknown[] = [];
function log(message: string) {logs.push(message); $('log').textContent = logs.slice(-15).join('\n');}
function action(id: string, callback: () => Promise<void>) {
  $(id).addEventListener('click', async () => {
    if (busy) {log('Another operation is running; Stop / cancel remains available.'); return;}
    busy = true;
    try {await callback();} catch (error) {log(`${(error as Error).name}: ${(error as Error).message}`);} finally {busy = false;}
  });
}
function clearAudio() {request++; capture.stop(); pcm = undefined; source = undefined; $('capture-status').textContent = 'Stopped — microphone inactive.';}
$('stop').onclick = clearAudio;
document.addEventListener('visibilitychange', () => {if (document.hidden) clearAudio();});
window.addEventListener('pagehide', clearAudio);
action('load', async () => {await classifier.load(); $('model-status').textContent = `Base loaded (${classifier.loadedMs?.toFixed(0)} ms). Object head still requires training or restore. Base ${classifier.baseHash}`; log('Local base loaded; no object accuracy established.');});
action('restore', async () => {
  const meta = await readRecord<Parameters<Classifier['restoreHead']>[0]>('head');
  if (!meta) throw Error('No saved object head');
  await classifier.restoreHead(meta); $('model-status').textContent = 'Stored object head restored; empirical accuracy still requires gate evidence.';
});
action('capture', async () => {
  const id = ++request; pcm = undefined; source = undefined;
  $('capture-status').textContent = 'Permission pending / capturing for 3 seconds. Stop remains available.';
  try {
    const recording = await capture.record();
    if (id !== request) return;
    pcm = recording; source = 'live'; $('result').textContent = JSON.stringify({source, seconds: pcm.length / 44100, ...quality(pcm)}, null, 2);
  } finally {$('capture-status').textContent = 'Stopped — microphone inactive.';}
});
$<HTMLInputElement>('file').onchange = async () => {
  if (busy) return;
  clearAudio(); const id = request, file = $<HTMLInputElement>('file').files?.[0];
  if (!file) return;
  busy = true;
  try {const decoded = await decode(file); if (id !== request) return; pcm = decoded; source = 'file'; $('result').textContent = JSON.stringify({source, seconds: pcm.length / 44100, ...quality(pcm)}, null, 2);} catch (e) {log((e as Error).message);} finally {busy = false;}
};
action('classify', async () => {
  if (!pcm) throw Error('Capture or choose a local file first.');
  const id = request, result = await classifier.predict(pcm);
  if (id !== request) return;
  lastResult = {source, ...result}; $('result').textContent = JSON.stringify(lastResult, null, 2);
  evidence.push(lastResult);
});
$<HTMLInputElement>('manifest').onchange = async () => {
  if (busy) return;
  data = undefined; manifestHash = undefined;
  const file = $<HTMLInputElement>('manifest').files?.[0];
  if (!file) return;
  try {
    if (file.size > 2_000_000) throw Error('Manifest too large');
    const text = await file.text(); data = validateDataset(JSON.parse(text)); manifestHash = await sha256(new TextEncoder().encode(text));
    $('dataset-status').textContent = JSON.stringify({events: data.events.length, readiness: testReadiness(data)});
  } catch (error) {log((error as Error).message);}
};
async function eventPcm(event: EventRecord) {
  const files = Array.from($<HTMLInputElement>('dataset-files').files ?? []);
  const matches = files.filter(file => file.name === event.file);
  if (matches.length !== 1) throw Error(`Expected exactly one file for anonymous event ${event.id}`);
  const file = matches[0];
  if (file.size > 10_000_000 || await sha256(await file.arrayBuffer()) !== event.sha256) throw Error(`File integrity failed: ${event.id}`);
  return decode(file);
}
action('train', async () => {
  if (!data || !manifestHash) throw Error('Load manifest first');
  const decodedHashes = new Set<string>();
  // Check content duplication across splits without deriving test features.
  for (const event of data.events) {
    const audio = await eventPcm(event);
    const hash = await sha256(new Uint8Array(audio.buffer));
    if (decodedHashes.has(hash)) throw Error('Duplicate decoded audio: possible re-encoded train/test leakage');
    decodedHashes.add(hash);
  }
  const examples: {embedding: number[][]; label: Label}[] = [];
  for (const event of data.events.filter(e => e.split === 'train')) {
    examples.push({embedding: await classifier.embed(await eventPcm(event)), label: event.label as Label});
    log(`Training feature extracted: ${event.id}`);
  }
  await classifier.train(examples, manifestHash);
  await writeRecord('head', await classifier.saveHead());
  $('model-status').textContent = `Object head trained and stored locally: ${classifier.headHash}. Accuracy unmeasured until independent evaluation.`;
});
async function evaluate(split: 'development' | 'test') {
  if (!data || !manifestHash || manifestHash !== classifier.trainingManifestHash) throw Error('Train using this exact manifest first');
  const events = data.events.filter(e => e.split === split);
  if (!events.length) throw Error('No events in requested split');
  const used = new Set(await readRecord<string[]>('consumed-test-hashes') ?? []);
  if (split === 'test') {
    const readiness = testReadiness(data);
    if (!readiness.ready) throw Error(readiness.missing.join('; '));
    if (events.some(e => used.has(e.sha256))) throw Error('A locked test event was already consumed. Use fresh holdout after any changes.');
    // Consume BEFORE inference, including aborted/failed runs, to prevent retuning against a partial test.
    await writeRecord('consumed-test-hashes', [...used, ...events.map(e => e.sha256)]);
  }
  const trials = [];
  for (const event of events) {
    const result = await classifier.predict(await eventPcm(event));
    trials.push({id: event.id, expected: event.label, predicted: result.label, device: event.device, elapsedMs: result.elapsedMs, reason: result.reason});
  }
  const record = {kind: split, manifestHash, headHash: classifier.headHash, baseHash: classifier.baseHash, preprocessing: PREPROCESSING, policy: POLICY, trials, metrics: summarize(trials)};
  evidence.push(record); lastResult = record; $('result').textContent = JSON.stringify(record, null, 2); log(`${split} completed: ${events.length} independent events. Live-device gate remains separate.`);
}
action('development', async () => evaluate('development'));
action('test', async () => evaluate('test'));
function summary() {return {schema: 1, date: new Date().toISOString(), environment: {userAgent: navigator.userAgent, secureContext: isSecureContext}, preprocessing: PREPROCESSING, policy: POLICY, baseHash: classifier.baseHash, headHash: classifier.headHash, modelLoadMs: classifier.loadedMs, captureLifecycle: capture.lifecycle, evidence};}
action('save', async () => {
  $('save-status').textContent = 'Saving…';
  try {await writeRecord('probe', summary()); $('save-status').textContent = 'Saved numeric evidence locally; no raw audio.';}
  catch(error) {$('save-status').textContent = 'Save failed — evidence is not confirmed saved. Export numeric evidence if needed.';throw error;}
});
action('reload', async () => {$('result').textContent = JSON.stringify(await readRecord('probe') ?? {status: 'No saved evidence'}, null, 2); $('save-status').textContent = 'Read completed.';});
action('export', async () => {
  const blob = new Blob([JSON.stringify(summary(), null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = 'soundlab-poc-numeric-evidence.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
action('offline', async () => {
  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;
  const worker = registration.active ?? registration.waiting;
  if (!worker) throw Error('Worker not active yet; reload and try again.');
  const message = new MessageChannel();
  const outcome = new Promise<string>((resolve, reject) => {const timer = setTimeout(() => reject(Error('Cache preparation timeout')), 30000); message.port1.onmessage = event => {clearTimeout(timer); event.data.ok ? resolve(event.data.message) : reject(Error(event.data.message));};});
  worker.postMessage({type: 'PREPARE'}, [message.port2]);
  $('cache-status').textContent = await outcome;
});
