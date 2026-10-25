import type { FeedbackResult, Language } from '../../shared/contract';
export const MISSIONS = ['vibration', 'travel', 'echo', 'detective'] as const;
export type MissionId = typeof MISSIONS[number];
export type Mode = 'student' | 'teacher';
export interface Investigation {
  prediction: string; predictionReason: string; observation: string; explanation: string;
  mitigation: string; classification: string; observed: boolean;
  source: 'own-observation' | 'teacher-example';
  experiment: Record<string, string | number | number[]>;
  feedback: FeedbackResult | null;
  feedbackLanguage?: Language;
}
export interface Entry { id: string; mission: MissionId; mode: Mode; language: Language; savedAt: string; work: Investigation; }
export function blank(): Investigation { return { prediction: '', predictionReason: '', observation: '', explanation: '', mitigation: '', classification: '', observed: false, source: 'own-observation', experiment: {}, feedback: null }; }
export function entryId(mode: Mode, mission: MissionId) { return `${mode}:${mission}`; }
export function complete(mission: MissionId, work: Investigation): boolean {
  const comparison = mission==='travel' ? work.experiment.equalTest===1 && work.experiment.differentTest===1 : mission==='echo' ? work.experiment.hardTest===1 && work.experiment.softTest===1 : true;
  return Boolean(work.prediction && work.predictionReason.trim() && work.observed && work.observation.trim() && work.explanation.trim() && comparison && (mission !== 'detective' || work.classification && work.mitigation.trim()));
}
export function badgeCount(entries: Entry[], mode: Mode): number { return new Set(entries.filter(e => e.mode === mode && complete(e.mission, e.work)).map(e => e.mission)).size; }
export function arrivalMs(distance: number): number { return distance / 343 * 1000; }
export function sameDistances(distances: number[]): boolean { return distances.every(d => Math.abs(d - distances[0]) < 0.001); }
