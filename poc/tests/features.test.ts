import {expect, it} from 'vitest';
import {spectrograms, resample, quality, RATE} from '../src/features';
it('extracts finite normalized shared-path windows, including silence', () => {
  const windows = spectrograms(new Float32Array(3 * RATE));
  expect(windows).toHaveLength(3); expect(windows.every(w => w.length === 43*232 && w.every(Number.isFinite))).toBe(true);
});
it('deterministically processes identical PCM independent of source mode', () => {
  const pcm = Float32Array.from({length: 3*RATE}, (_,i) => .2*Math.sin(2*Math.PI*440*i/RATE));
  expect(spectrograms(pcm)).toEqual(spectrograms(pcm.slice()));
  expect(quality(pcm).rms).toBeCloseTo(.1414,3);
});
it('resamples 48k capture and rejects invalid/short PCM', () => {
  expect(resample(new Float32Array(3*48000),48000).length).toBe(3*RATE);
  expect(() => spectrograms(new Float32Array(100))).toThrow();
  expect(() => quality(new Float32Array([NaN]))).toThrow();
});
