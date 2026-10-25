import {expect, it} from 'vitest';
import {selectExcerpt} from '../src/excerpt';
import {RATE} from '../src/features';
it('pads a short recording explicitly without inventing source events', () => {
  const source = new Float32Array(122236).fill(.2), result = selectExcerpt(source);
  expect(result.pcm.length).toBe(3 * RATE);
  expect(result.selection.paddedSeconds).toBeCloseTo(.2282086);
  expect(result.pcm[122236]).toBe(0);
  expect(result.selection.independentSourceEventsAdded).toBe(0);
  expect(source.length).toBe(122236);
});
it('uses an explicit crop start and records both omitted ranges', () => {
  const source = Float32Array.from({length: 8 * RATE}, (_, i) => i / RATE);
  const result = selectExcerpt(source, 2);
  expect(result.pcm[0]).toBe(2);
  expect(result.selection).toMatchObject({startSeconds:2,usedSeconds:3,omittedBeforeSeconds:2,omittedAfterSeconds:3,paddedSeconds:0});
});
it('rejects empty, invalid, negative, nonfinite and past-end selections', () => {
  expect(() => selectExcerpt(new Float32Array())).toThrow();
  expect(() => selectExcerpt(new Float32Array([NaN]))).toThrow();
  for (const start of [-1, NaN, Infinity, 4]) expect(() => selectExcerpt(new Float32Array(3*RATE), start)).toThrow();
});
