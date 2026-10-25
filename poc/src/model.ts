import * as tf from '@tensorflow/tfjs';
import {BINS, FRAMES, PREPROCESSING, quality, spectrograms} from './features';
import {LABELS, POLICY, decide} from './policy';
import {sha256} from './dataset';
type ModelManifest = {artifacts: {path: string; sha256: string; bytes: number}[]};
export class Classifier {
  private base?: tf.LayersModel;
  private embedding?: tf.LayersModel;
  private head?: tf.Sequential;
  baseHash?: string;
  headHash?: string;
  loadedMs?: number;
  trainingManifestHash?: string;
  async load() {
    if (this.embedding) return;
    const start = performance.now();
    await tf.setBackend('webgl').catch(() => false);
    if (!tf.getBackend()) await tf.setBackend('cpu');
    await tf.ready();
    const response = await fetch('/models/base/manifest.json');
    if (!response.ok) throw Error('Local model missing: run npm run assets, then restart/build.');
    const manifest = await response.json() as ModelManifest;
    // Hash every artifact before use; model loading can only request same-origin paths.
    for (const artifact of manifest.artifacts) {
      if (!artifact.path.startsWith('/models/base/') || artifact.path.includes('..')) throw Error('Invalid asset manifest');
      const file = await fetch(artifact.path);
      if (!file.ok) throw Error('Missing model dependency');
      const bytes = await file.arrayBuffer();
      if (bytes.byteLength !== artifact.bytes || await sha256(bytes) !== artifact.sha256) throw Error('Model integrity mismatch');
    }
    this.base = await tf.loadLayersModel('/models/base/model.json');
    this.embedding = tf.model({inputs: this.base.inputs, outputs: this.base.getLayer('dense_1').output as tf.SymbolicTensor});
    const shape = this.base.inputs[0].shape;
    if (shape[1] !== FRAMES || shape[2] !== BINS || shape[3] !== 1) throw Error('Unexpected model input');
    this.baseHash = await sha256(new TextEncoder().encode(JSON.stringify(manifest.artifacts)));
    this.loadedMs = performance.now() - start;
  }
  async embed(pcm: Float32Array): Promise<number[][]> {
    if (!this.embedding) throw Error('Load base model first');
    const spectra = spectrograms(pcm);
    const result: number[][] = [];
    for (const spectrum of spectra) {
      const tensor = tf.tensor4d(spectrum, [1, FRAMES, BINS, 1]);
      const embedding = this.embedding.predict(tensor) as tf.Tensor;
      try {result.push(Array.from(await embedding.data()));} finally {tensor.dispose(); embedding.dispose();}
    }
    return result;
  }
  async train(examples: {embedding: number[][]; label: typeof LABELS[number]}[], manifestHash: string) {
    if (!this.embedding) throw Error('Load base model first');
    if (LABELS.some(label => examples.filter(e => e.label === label).length < 2)) throw Error('Need at least two independent training events per class for a pipeline run; not enough to pass accuracy gate.');
    this.head?.dispose(); this.head = undefined; this.headHash = undefined;
    const vectors = examples.flatMap(e => e.embedding);
    const labels = examples.flatMap(e => e.embedding.map(() => LABELS.indexOf(e.label)));
    const head = tf.sequential();
    head.add(tf.layers.dense({inputShape: [2000], units: 4, activation: 'softmax', kernelInitializer: tf.initializers.glorotUniform({seed: 20261025})}));
    head.compile({optimizer: tf.train.adam(.001), loss: 'categoricalCrossentropy'});
    const xs = tf.tensor2d(vectors), indexes = tf.tensor1d(labels, 'int32'), ys = tf.oneHot(indexes, 4);
    try {
      await head.fit(xs, ys, {epochs: 25, batchSize: Math.min(16, vectors.length), shuffle: false, verbose: 0, callbacks: {onEpochEnd: async () => {await tf.nextFrame();}}});
      const weights = head.getWeights();
      this.headHash = await sha256(new TextEncoder().encode(JSON.stringify(await Promise.all(weights.map(async w => Array.from(await w.data()))))));
      this.head = head; this.trainingManifestHash = manifestHash;
    } catch (error) {head.dispose(); throw error;}
    finally {xs.dispose(); indexes.dispose(); ys.dispose();}
  }
  async predict(pcm: Float32Array) {
    if (!this.head || !this.headHash) throw Error('No object classifier is trained. Base speech model cannot label these objects.');
    const start = performance.now(), signal = quality(pcm), embedding = await this.embed(pcm);
    const xs = tf.tensor2d(embedding), output = this.head.predict(xs) as tf.Tensor;
    let scores: number[][];
    try {scores = await output.array() as number[][];} finally {xs.dispose(); output.dispose();}
    return {mode: 'actual-local-inference', ...decide(scores, signal.rms, signal.clipping), scores, quality: signal, elapsedMs: performance.now() - start, baseHash: this.baseHash, headHash: this.headHash, preprocessing: PREPROCESSING, policy: POLICY.version};
  }
  async saveHead() {
    if (!this.head || !this.headHash) throw Error('No trained head');
    await this.head.save('indexeddb://soundlab-poc-head');
    return {headHash: this.headHash, baseHash: this.baseHash, manifestHash: this.trainingManifestHash, preprocessing: PREPROCESSING};
  }
  async restoreHead(meta: {headHash: string; baseHash: string; manifestHash: string; preprocessing: string}) {
    if (meta.baseHash !== this.baseHash || meta.preprocessing !== PREPROCESSING) throw Error('Stored head/base/preprocessing mismatch');
    const loaded = await tf.loadLayersModel('indexeddb://soundlab-poc-head');
    if (loaded.inputs[0].shape[1] !== 2000 || loaded.outputs[0].shape[1] !== 4) {loaded.dispose(); throw Error('Stored head shape mismatch');}
    const actualHash = await sha256(new TextEncoder().encode(JSON.stringify(await Promise.all(loaded.getWeights().map(async w => Array.from(await w.data()))))));
    if (actualHash !== meta.headHash) {loaded.dispose(); throw Error('Stored head hash mismatch');}
    this.head?.dispose(); this.head = loaded as tf.Sequential; this.headHash = actualHash; this.trainingManifestHash = meta.manifestHash;
  }
}
