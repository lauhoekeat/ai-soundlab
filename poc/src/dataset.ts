import {LABELS, type Label} from './policy';
export type EventRecord = {id: string; file: string; label: Label | 'unknown'; split: 'train' | 'development' | 'test'; session: string; contributor: string; device: string; room: string; sha256: string};
export type Dataset = {version: 1; source: 'adult-object'; attestation: string; events: EventRecord[]};
export const pseudonym = /^[a-zA-Z0-9_-]{1,48}$/;
export function validateDataset(value: unknown): Dataset {
  if (!value || typeof value !== 'object') throw Error('Manifest must be an object');
  const data = value as Dataset;
  if (data.version !== 1 || data.source !== 'adult-object' || data.attestation !== 'Adults only; object sounds; no pupil recordings; permission to use locally.') throw Error('Adult-only local-use attestation required');
  if (!Array.isArray(data.events) || !data.events.length || data.events.length > 2000) throw Error('Manifest needs 1–2000 independent events');
  const ids = new Set<string>(), files = new Set<string>(), hashes = new Set<string>(), sessions = new Map<string, string>();
  for (const event of data.events) {
    if (!event || typeof event !== 'object' || !['train', 'development', 'test'].includes(event.split)) throw Error('Invalid split');
    if (![...LABELS, 'unknown'].includes(event.label)) throw Error('Invalid class');
    for (const key of ['id', 'session', 'contributor', 'device', 'room'] as const) if (!pseudonym.test(event[key])) throw Error(`Use anonymous ${key} codes only`);
    if (!/^[a-zA-Z0-9_-]+\.wav$/i.test(event.file) || !/^[a-f0-9]{64}$/.test(event.sha256)) throw Error('Use simple WAV filenames and SHA-256 hashes');
    if (ids.has(event.id) || files.has(event.file) || hashes.has(event.sha256)) throw Error('Duplicate event/file/hash: possible leakage');
    if (sessions.has(event.session) && sessions.get(event.session) !== event.split) throw Error('Recording session crosses splits');
    if (event.split === 'train' && event.label === 'unknown') throw Error('Unknown examples are negative evaluation only; use background for the trained fourth class');
    sessions.set(event.session, event.split); ids.add(event.id); files.add(event.file); hashes.add(event.sha256);
  }
  return data;
}
export function testReadiness(data: Dataset) {
  const train = data.events.filter(e => e.split !== 'test'), test = data.events.filter(e => e.split === 'test');
  const missing: string[] = [];
  for (const label of LABELS.slice(0, 3)) if (test.filter(e => e.label === label).length < 20) missing.push(`Need 20 independent test events for ${label}`);
  if (test.filter(e => ['background', 'unknown'].includes(e.label)).length < 60) missing.push('Need 60 locked test negatives');
  for (const field of ['contributor', 'device', 'room'] as const) {
    const seen = new Set(train.map(e => e[field]));
    if (!test.some(e => !seen.has(e[field]))) missing.push(`No held-out ${field}`);
  }
  return {ready: missing.length === 0, missing};
}
export async function sha256(bytes: ArrayBuffer | Uint8Array) {
  const copy = new Uint8Array(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
  const digest = await crypto.subtle.digest('SHA-256', copy);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}
