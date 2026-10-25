import FFT from 'fft.js';
export const RATE = 44100, FFT_SIZE = 1024, FRAMES = 43, BINS = 232;
export const PREPROCESSING = 'blackman-dB-no-smoothing-radix2-43x232-v1';
export function resample(input: Float32Array, sourceRate: number): Float32Array {
  if (!(sourceRate >= 8000 && sourceRate <= 192000) || !input.length || input.some(v => !Number.isFinite(v))) throw Error('Invalid PCM');
  const length = Math.floor(input.length * RATE / sourceRate);
  const output = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const p = i * sourceRate / RATE, low = Math.floor(p), fraction = p - low;
    output[i] = input[low] * (1 - fraction) + input[Math.min(low + 1, input.length - 1)] * fraction;
  }
  return output;
}
export function quality(pcm: Float32Array) {
  if (!pcm.length || pcm.some(v => !Number.isFinite(v))) throw Error('Invalid PCM');
  let power = 0, clipped = 0;
  for (const sample of pcm) {power += sample * sample; if (Math.abs(sample) >= .99) clipped++;}
  return {rms: Math.sqrt(power / pcm.length), clipping: clipped / pcm.length};
}
// A single deterministic path for file and microphone PCM. This is deliberately
// versioned: not bit-equivalent to the pretrained browser AnalyserNode smoothing.
export function spectrograms(pcm: Float32Array): Float32Array[] {
  if (pcm.length < RATE * 2.8 || pcm.length > RATE * 3.2) throw Error('Use a 3-second recording (2.8–3.2 seconds accepted).');
  quality(pcm);
  const fft = new FFT(FFT_SIZE), complex = fft.createComplexArray();
  return [0, .9, 1.8].map(seconds => {
    const result = new Float32Array(FRAMES * BINS);
    for (let frame = 0; frame < FRAMES; frame++) {
      const offset = Math.round(seconds * RATE) + frame * FFT_SIZE;
      const window = Float32Array.from({length: FFT_SIZE}, (_, i) => (pcm[offset + i] ?? 0) * (.42 - .5 * Math.cos(2 * Math.PI * i / FFT_SIZE) + .08 * Math.cos(4 * Math.PI * i / FFT_SIZE)));
      fft.realTransform(complex, window);
      for (let bin = 0; bin < BINS; bin++) result[frame * BINS + bin] = 20 * Math.log10(Math.max(1e-8, Math.hypot(complex[2 * bin], complex[2 * bin + 1]) / FFT_SIZE));
    }
    const mean = result.reduce((sum, value) => sum + value, 0) / result.length;
    const sd = Math.sqrt(result.reduce((sum, value) => sum + (value - mean) ** 2, 0) / result.length) || 1;
    return result.map(value => (value - mean) / sd);
  });
}
