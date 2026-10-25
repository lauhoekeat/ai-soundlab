// Downloads only model artifacts, never recordings. Files remain ignored locally.
import {mkdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const directory = fileURLToPath(new URL('../public/models/base/', import.meta.url));
const origin = 'https://storage.googleapis.com/tfjs-models/tfjs/speech-commands/v0.4/browser_fft/18w/';
const expected = {
  'model.json': 'be053f904fe26d1fab2be824d943e936d9f04c9ea3d238d3c58fa2a6225b1ef7',
  'group1-shard1of2': '79b7ef9d7577b333ee39b0d6e8dfebdb03be559a645bc389307ef84da414a30b',
  'group1-shard2of2': '129b9a7d501f81e62710d494efcba67ed98b3f3032dd28d7fe20cbc8cd5bee1f',
  'metadata.json': '06f92997a0f6b3e5f11d70251222350f1e0f6717280f7edd151d4001482665ac',
};
await mkdir(directory, {recursive: true});
const model = await fetch(origin + 'model.json');
if (!model.ok) throw Error(`Model HTTP ${model.status}`);
const modelBytes = Buffer.from(await model.arrayBuffer());
const config = JSON.parse(modelBytes.toString());
const files = new Map([['model.json', modelBytes]]);
for (const path of [...config.weightsManifest.flatMap(group => group.paths), 'metadata.json']) {
  if (!/^[a-zA-Z0-9_.-]+$/.test(path)) throw Error('Unsafe model asset path');
  const response = await fetch(origin + path);
  if (!response.ok) throw Error(`${path}: HTTP ${response.status}`);
  files.set(path, Buffer.from(await response.arrayBuffer()));
}
const artifacts = [];
for (const [path, bytes] of files) {
  if (createHash('sha256').update(bytes).digest('hex') !== expected[path]) throw Error(`Official artifact changed: ${path}; review before updating pins.`);
  await writeFile(directory + '/' + path, bytes);
  artifacts.push({path: '/models/base/' + path, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex')});
}
const manifest = {source: origin, retrievedAt: new Date().toISOString(), licenseStatus: 'Base-weight redistribution terms require owner review; local diagnostic use only; not committed.', artifacts};
await writeFile(directory + '/manifest.json', JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest, null, 2));
