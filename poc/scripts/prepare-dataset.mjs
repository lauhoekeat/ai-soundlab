import {readFile, writeFile} from 'node:fs/promises';
import {resolve, dirname, join} from 'node:path';
import {createHash} from 'node:crypto';
const file = process.argv[2];
if (!file) throw Error('Supply an existing anonymous adult events.json descriptor path.');
const descriptor = resolve(file), directory = dirname(descriptor);
const data = JSON.parse(await readFile(descriptor, 'utf8'));
if (data.source !== 'adult-object' || data.attestation !== 'Adults only; object sounds; no pupil recordings; permission to use locally.' || !Array.isArray(data.events)) throw Error('Adult permission attestation and events are required; never attest for unknown recordings.');
for (const event of data.events) {
  if (!/^[a-zA-Z0-9_-]+\.wav$/i.test(event.file)) throw Error('Only simple anonymous WAV filenames allowed');
  const bytes = await readFile(join(directory,event.file));
  if (bytes.length > 10_000_000) throw Error('WAV exceeds 10 MB');
  event.sha256 = createHash('sha256').update(bytes).digest('hex');
}
const output = join(directory, 'dataset-manifest.json');
if (output === descriptor) throw Error('Input must not be the output manifest');
await writeFile(output, JSON.stringify(data,null,2), {flag: 'wx'});
console.log('Created anonymous manifest beside recordings. Browser validation still checks split integrity.');
