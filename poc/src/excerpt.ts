import {RATE} from './features';

// File intake only: explicit, recorded selection; never creates new source events.
export function selectExcerpt(source: Float32Array, startSeconds = 0) {
  if (!source.length || source.some(sample => !Number.isFinite(sample))) throw Error('Invalid source PCM');
  if (!Number.isFinite(startSeconds) || startSeconds < 0) throw Error('Excerpt start must be a nonnegative number');
  const startSample = Math.round(startSeconds * RATE);
  if (startSample >= source.length) throw Error('Excerpt starts beyond the end of this recording');
  const targetSamples = 3 * RATE;
  const used = Math.min(targetSamples, source.length - startSample);
  const pcm = new Float32Array(targetSamples);
  pcm.set(source.subarray(startSample, startSample + used));
  return {
    pcm,
    selection: {
      kind: 'file-excerpt' as const,
      sourceSeconds: source.length / RATE,
      startSeconds: startSample / RATE,
      usedSeconds: used / RATE,
      paddedSeconds: (targetSamples - used) / RATE,
      omittedBeforeSeconds: startSample / RATE,
      omittedAfterSeconds: Math.max(0, source.length - startSample - used) / RATE,
      outputSeconds: 3,
      independentSourceEventsAdded: 0,
    },
  };
}
