export type Mission = 'vibration' | 'detective';
export type Language = 'bm' | 'en';
export interface FeedbackInput { mission: Mission; language: Language; observation: string; explanation: string; mitigation: string; }
export interface FeedbackResult { feedback: string; source: 'openai'; promptVersion: string; generationMode: 'ai-selected-curriculum-feedback'; concept: string; }
export const MAX_BODY_BYTES = 8192;
export const PROMPT_VERSION = 'sound-science-v5';
export function parseInput(value: unknown): FeedbackInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('invalid_schema');
  const v = value as Record<string, unknown>;
  const fields = ['mission', 'language', 'observation', 'explanation', 'mitigation'];
  if (Object.keys(v).length !== fields.length || Object.keys(v).some(k => !fields.includes(k))) throw new Error('invalid_schema');
  if (!['vibration', 'detective'].includes(String(v.mission)) || !['bm', 'en'].includes(String(v.language))) throw new Error('invalid_schema');
  for (const [key, min, max] of [['observation', 1, 600], ['explanation', 1, 600], ['mitigation', v.mission === 'detective' ? 1 : 0, 400]] as const) {
    if (typeof v[key] !== 'string') throw new Error('invalid_schema');
    const s = (v[key] as string).trim();
    if (s.length < min || s.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(s)) throw new Error('invalid_schema');
  }
  return { mission: v.mission as Mission, language: v.language as Language, observation: (v.observation as string).trim(), explanation: (v.explanation as string).trim(), mitigation: (v.mitigation as string).trim() };
}
export function rms(samples: Float32Array): number {
  if (!samples.length) return 0;
  let sum = 0;
  for (const sample of samples) sum += sample * sample;
  return Math.sqrt(sum / samples.length);
}
export function dbfs(level: number): number { return Math.max(-96, 20 * Math.log10(Math.max(level, 0.00001))); }
export function echoDelay(distanceMetres: number): number { return 2 * Math.max(0, distanceMetres) / 343; }
