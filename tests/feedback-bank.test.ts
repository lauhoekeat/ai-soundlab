import { describe, expect, it } from 'vitest';
import { BANK, CONCEPTS, renderSelection } from '../proxy/src/feedback-bank';
import type { FeedbackInput } from '../shared/contract';
const input: FeedbackInput = { mission: 'vibration', language: 'bm', observation: 'Pembaris bergerak.', explanation: 'Pembaris bergetar.', mitigation: '' };
describe('AI-selected curriculum feedback', () => {
  it.each(CONCEPTS)('%s has bounded bilingual facts and one next question', concept => {
    for (const language of ['bm', 'en'] as const) {
      const [fact, question] = BANK[concept][language];
      expect(fact.length + question.length).toBeLessThan(1000);
      expect(fact).not.toContain('?'); expect(question.match(/\?/g)).toHaveLength(1);
      const result = renderSelection(JSON.stringify({ concept, evidenceExcerpt: 'Pembaris' }), { ...input, language });
      expect(result.feedback).toContain(fact); expect(result.concept).toBe(concept);
    }
  });
  it('rejects invented evidence, unknown concepts and additional generated prose', () => {
    for (const selection of [{ concept: 'vibration', evidenceExcerpt: 'unheard object' }, { concept: 'unknown', evidenceExcerpt: 'Pembaris' }, { concept: 'vibration', evidenceExcerpt: 'Pembaris', prose: 'made-up science' }]) expect(() => renderSelection(JSON.stringify(selection), input)).toThrow();
  });
  it('radar and audio limits cannot be altered by generated prose', () => {
    expect(BANK.radar.bm[0]).toContain('bukan bunyi'); expect(BANK.radar.en[0]).toContain('not sound');
    expect(BANK.no_audio.en[0]).toContain('has not received or heard');
  });
});
