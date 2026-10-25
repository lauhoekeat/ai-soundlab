import {describe, expect, it} from 'vitest';
import {decide, summarize} from '../src/policy';
const good = [.92, .03, .03, .02];
describe('uncertainty policy', () => {
  it('accepts stable strong target scores', () => expect(decide([good, good, good], .2, 0).label).toBe('clap'));
  it('rejects silence even with high scores', () => expect(decide([good, good, good], 0, 0).reason).toBe('silence'));
  it('rejects clipping', () => expect(decide([good, good, good], .5, .06).reason).toBe('clipping'));
  it('rejects unstable windows', () => expect(decide([good, [.01,.95,.02,.02], good], .2, 0).reason).toBe('unstable'));
  it('rejects background and insufficient windows', () => {
    expect(decide([[.01,.01,.01,.97], good, good], .2, 0).reason).toBe('background');
    expect(decide([good], .2, 0).reason).toBe('insufficient-windows');
  });
  it('rejects low margin', () => expect(decide([[.5,.45,.03,.02], good, good], .2, 0).label).toBe('unknown'));
  it('rejects corrupt scores', () => expect(() => decide([[NaN,0,0,0],good,good],.2,0)).toThrow());
});
describe('honest metrics', () => {
  it('counts rejected targets as accuracy failures and unknown false accepts', () => {
    const result = summarize([{expected:'clap',predicted:'clap'},{expected:'clap',predicted:'unknown'},{expected:'unknown',predicted:'clap'},{expected:'background',predicted:'unknown'}]);
    expect(result.targetAccuracy).toBe(.5); expect(result.negativeFalseAcceptance).toBe(.5); expect(result.acceptedPrecision).toBe(.5); expect(result.coverage).toBe(.5);
  });
  it('returns null for missing denominators rather than zero/perfect', () => expect(summarize([]).targetAccuracy).toBe(null));
});
