import type { FeedbackInput } from '../../shared/contract';
// Authored from the curriculum/science register. Teacher signoff remains a gate.
export const BANK = {
  vibration: {
    bm: ['Bunyi dihasilkan oleh getaran. Bergetar bermaksud bergerak ulang-alik dengan cepat.', 'Apabila kamu menghentikan pergerakan pembaris, apakah yang berlaku pada bunyinya?'],
    en: ['Sound is produced by vibration. Vibrating means moving back and forth quickly.', 'What happens to the sound when you stop the ruler moving?'],
  },
  evidence: {
    bm: ['Graf mikrofon menunjukkan perubahan isyarat bunyi. Kamu juga perlu melihat objek itu sendiri untuk mengetahui apa yang bergerak.', 'Bagaimanakah objek itu bergerak ketika kamu mendengar bunyi?'],
    en: ['The microphone graph shows changes in the sound signal. Also watch the object itself to find out what moves.', 'How did the object move while you heard the sound?'],
  },
  relative_level: {
    bm: ['Graf bergantung pada bunyi dan cara rakaman dibuat. Gunakan peranti, tetapan dan jarak yang sama untuk membandingkan bunyi. Graf ini tidak menentukan sama ada bunyi selamat untuk telinga.', 'Mengapakah kamu perlu mengekalkan jarak mikrofon yang sama apabila membandingkan dua bunyi?'],
    en: ['The graph depends on the sound and how it is recorded. Use the same device, settings and distance to compare sounds. This graph cannot tell you whether a sound is safe for your ears.', 'Why should you keep the microphone at the same distance when comparing two sounds?'],
  },
  directions: {
    bm: ['Dalam model ini, bunyi bergerak ke semua arah melalui udara. Lingkaran menunjukkan sejauh mana bunyi telah sampai, bukan udara yang bergerak keluar.', 'Jika seorang pendengar berada di belakang sumber bunyi, adakah dia juga akan menerima bunyi?'],
    en: ['In this model, sound travels in every direction through air. The rings show how far the sound has reached, not air moving outward.', 'Will a listener behind the sound source also receive the sound?'],
  },
  equal_distance: {
    bm: ['Dalam model ini, bunyi tiba serentak pada pendengar yang sama jarak dari sumber. Bunyi mengambil masa lebih lama untuk sampai kepada pendengar yang lebih jauh.', 'Jika kamu menjauhkan seorang pendengar, adakah dia menerima bunyi lebih awal atau lebih lewat?'],
    en: ['In this model, sound reaches listeners at equal distances together. It takes longer to reach a listener farther away.', 'If you move one listener farther away, will they receive the sound earlier or later?'],
  },
  reflection: {
    bm: ['Bunyi boleh terkena permukaan dan kembali. Gema ialah bunyi pantulan yang didengar semula secara berasingan selepas bunyi asal.', 'Di manakah kamu mungkin mendengar suara seseorang kembali sebagai gema?'],
    en: ['Sound can hit a surface and return. An echo is reflected sound heard separately after the original sound.', 'Where might you hear someone’s voice return as an echo?'],
  },
  absorption: {
    bm: ['Langsir lembut boleh menyerap sebahagian bunyi. Sebahagian bunyi masih dipantulkan, tetapi pantulannya boleh menjadi lebih lemah.', 'Dalam simulasi pada jarak yang sama, adakah pantulan langsir lebih kuat atau lebih lemah daripada pantulan dinding?'],
    en: ['A soft curtain can absorb some sound. Some sound still reflects, but the reflection can be weaker.', 'At the same distance in the simulation, is the curtain’s reflection stronger or weaker than the wall’s?'],
  },
  radar: {
    bm: ['Radar menggunakan gelombang elektromagnet, bukan bunyi. Sonar menggunakan pantulan bunyi. Gema juga ialah contoh pantulan bunyi.', 'Apabila suara didengar semula sebagai gema, dari manakah bunyi itu kembali?'],
    en: ['Radar uses electromagnetic waves, not sound. Sonar uses reflected sound. An echo is also an example of reflected sound.', 'When a voice is heard again as an echo, where has the sound returned from?'],
  },
  context: {
    bm: ['Bunyi yang sama boleh membantu atau mengganggu mengikut keadaan. Contohnya, bunyi amaran membantu kita, tetapi bunyi yang berulang boleh mengganggu tumpuan.', 'Apakah satu perubahan supaya bunyi ini kurang mengganggu tetapi masih dapat membantu orang?'],
    en: ['The same sound can help or disturb people in different situations. A warning sound can help us, but repeated sound can disturb concentration.', 'What is one change that would make this sound less disturbing while keeping its useful purpose?'],
  },
  mitigation: {
    bm: ['Kamu boleh mengurangkan bunyi pada sumbernya, menghalang sebahagian bunyi atau menjauhkan orang daripada bunyi. Pilih cara yang selamat dan terangkan sebabnya.', 'Selepas mencuba cadangan kamu, apakah yang boleh kamu dengar untuk mengetahui sama ada gangguan sudah berkurang?'],
    en: ['You could reduce sound at its source, block some sound or move people farther away. Choose a safe idea and explain why it helps.', 'After trying your idea, what could you listen for to find out whether the disturbance has reduced?'],
  },
  no_audio: {
    bm: ['AI tidak mendengar rakaman kamu. Ceritakan apa yang kamu sendiri dengar atau lihat. Jika sumber bunyi belum diketahui, kamu boleh menulis “belum pasti”.', 'Apakah yang kamu sendiri dengar atau lihat tentang bunyi pilihan kamu?'],
    en: ['The AI has not received or heard your recording. Describe what you heard or saw yourself. If the source is unknown, you can write “not sure yet”.', 'What did you hear or see yourself about your chosen sound?'],
  },
  needs_observation: {
    bm: ['Mulakan dengan apa yang kamu lihat atau dengar semasa aktiviti. Selepas itu, terangkan sebab perkara itu berlaku.', 'Apakah satu perkara yang kamu lihat atau dengar semasa aktiviti tadi?'],
    en: ['Start with what you saw or heard during the activity. Then explain why you think it happened.', 'What is one thing you saw or heard during the activity?'],
  },
} as const;
export type Concept = keyof typeof BANK;
export const CONCEPTS = Object.keys(BANK) as Concept[];
export function renderSelection(raw: string, input: FeedbackInput): { feedback: string; concept: Concept } {
  const result = JSON.parse(raw) as { concept?: unknown; evidenceExcerpt?: unknown };
  if (!result || typeof result !== 'object' || Object.keys(result).length !== 2 || !CONCEPTS.includes(result.concept as Concept) || typeof result.evidenceExcerpt !== 'string') throw new Error('invalid_selection');
  const excerpt = result.evidenceExcerpt;
  if (!excerpt.trim() || excerpt.length > 120 || ![input.observation, input.explanation, input.mitigation].some(s => s.includes(excerpt))) throw new Error('invalid_evidence');
  const concept = result.concept as Concept;
  const [fact, question] = BANK[concept][input.language];
  return { concept, feedback: `${input.language === 'bm' ? 'Petikan jawapan anda' : 'Excerpt from your answer'}: “${excerpt}”\n\n${fact}\n\n${question}` };
}
