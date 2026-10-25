export const LABELS = ['clap', 'pencil-tap', 'paper-rustle', 'background'] as const;
export type Label = typeof LABELS[number];
export type Prediction = Label | 'unknown';
export const POLICY = Object.freeze({version: 'candidate-1-not-validated', minimumScore: 0.8, minimumMargin: 0.2, stableWindows: 3, silenceRms: 0.001, clippingFraction: 0.05});
export function decide(windows: number[][], rms: number, clipping: number): {label: Prediction; reason: string} {
  if (!Number.isFinite(rms) || !Number.isFinite(clipping)) throw Error('Invalid signal quality');
  if (rms < POLICY.silenceRms) return {label: 'unknown', reason: 'silence'};
  if (clipping > POLICY.clippingFraction) return {label: 'unknown', reason: 'clipping'};
  if (windows.length < POLICY.stableWindows) return {label: 'unknown', reason: 'insufficient-windows'};
  let previous = -1;
  for (const scores of windows.slice(-POLICY.stableWindows)) {
    if (scores.length !== LABELS.length || scores.some(v => !Number.isFinite(v) || v < 0 || v > 1)) throw Error('Invalid model scores');
    const order = scores.map((score, index) => ({score, index})).sort((a, b) => b.score - a.score);
    const best = order[0];
    if (best.index === 3) return {label: 'unknown', reason: 'background'};
    if (best.score < POLICY.minimumScore || best.score - order[1].score < POLICY.minimumMargin) return {label: 'unknown', reason: 'low-score-or-margin'};
    if (previous >= 0 && previous !== best.index) return {label: 'unknown', reason: 'unstable'};
    previous = best.index;
  }
  return {label: LABELS[previous], reason: 'accepted'};
}
export function summarize(trials: {expected: Label | 'unknown'; predicted: Prediction}[]) {
  const targets = trials.filter(t => !['unknown', 'background'].includes(t.expected));
  const negatives = trials.filter(t => ['unknown', 'background'].includes(t.expected));
  const accepted = trials.filter(t => !['unknown', 'background'].includes(t.predicted));
  const rate = (n: number, d: number) => d ? n / d : null;
  const correct = targets.filter(t => t.expected === t.predicted).length;
  const matrix: Record<string, Record<string, number>> = {};
  for (const t of trials) { matrix[t.expected] ??= {}; matrix[t.expected][t.predicted] = (matrix[t.expected][t.predicted] ?? 0) + 1; }
  return {n: trials.length, targetAccuracy: rate(correct, targets.length), coverage: rate(accepted.length, trials.length), acceptedPrecision: rate(correct, accepted.length), negativeFalseAcceptance: rate(negatives.filter(t => !['unknown', 'background'].includes(t.predicted)).length, negatives.length), perClass: Object.fromEntries(LABELS.slice(0, 3).map(label => {const group = targets.filter(t => t.expected === label); return [label, {n: group.length, correctRate: rate(group.filter(t => t.predicted === label).length, group.length)}];})), matrix};
}
