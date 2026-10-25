import type { FeedbackInput } from '../../shared/contract';
// Authored from the curriculum/science register. Teacher signoff remains a gate.
export const BANK = {
  vibration: {
    bm: ['Bunyi dihasilkan oleh getaran. Perhatikan objek yang bergerak ulang-alik semasa menghasilkan bunyi.', 'Apakah yang berlaku pada bunyi apabila getaran objek dihentikan?'],
    en: ['Sound is produced by vibration. Observe which object moves back and forth while making the sound.', 'What happens to the sound when the object stops vibrating?'],
  },
  evidence: {
    bm: ['Perubahan graf mikrofon sahaja tidak membuktikan objek tertentu bergetar. Gabungkan graf dengan pemerhatian langsung pada objek.', 'Apakah pemerhatian pada objek yang boleh menyokong penjelasan anda?'],
    en: ['A microphone waveform alone does not prove which object vibrated. Combine the graph with a direct observation of the object.', 'What observation of the object could support your explanation?'],
  },
  relative_level: {
    bm: ['RMS dan dBFS ialah ukuran relatif isyarat peranti. Ukuran ini bukan dB SPL dan tidak menentukan keselamatan pendengaran.', 'Bagaimanakah anda boleh membandingkan dua bunyi menggunakan peranti dan tetapan yang sama?'],
    en: ['RMS and dBFS describe the relative device signal. They are not calibrated dB SPL and cannot establish hearing safety.', 'How could you compare two sounds using the same device and settings?'],
  },
  directions: {
    bm: ['Dalam model sumber ringkas, bunyi bergerak ke semua arah melalui medium. Lingkaran dalam rajah mewakili muka gelombang, bukan zarah udara yang bergerak keluar bersama bunyi.', 'Di manakah pendengar boleh diletakkan untuk menguji ramalan bunyi bergerak ke semua arah?'],
    en: ['In a simple source model, sound travels in all directions through a medium. Diagram rings represent wavefronts, not air particles travelling outward with sound.', 'Where could you place listeners to test the prediction that sound travels in all directions?'],
  },
  equal_distance: {
    bm: ['Dalam model ideal dengan medium yang sama, bunyi tiba serentak pada pendengar yang sama jarak dari sumber. Pendengar pada jarak berbeza menerima bunyi pada masa berbeza.', 'Apakah ramalan anda jika seorang pendengar diletakkan lebih jauh dari sumber?'],
    en: ['In an ideal model with the same medium, sound reaches listeners at equal distances together. Different distances give different arrival times.', 'What would you predict if one listener were moved farther from the source?'],
  },
  reflection: {
    bm: ['Bunyi boleh dipantulkan oleh permukaan. Gema ialah bunyi pantulan yang dapat didengar semula secara berasingan apabila kelewatannya mencukupi.', 'Apakah contoh lain dalam kehidupan harian yang menunjukkan bunyi boleh dipantulkan?'],
    en: ['Sound can reflect from surfaces. An echo is reflected sound heard separately when there is enough delay.', 'What other everyday example shows that sound can be reflected?'],
  },
  absorption: {
    bm: ['Bahan lembut seperti langsir boleh menyerap sebahagian bunyi dan mengurangkan pantulan. Sebahagian bunyi masih boleh dipantulkan; kesannya bergantung pada bahan dan keadaan.', 'Bagaimanakah anda boleh membandingkan pantulan bunyi pada langsir dengan dinding keras?'],
    en: ['Soft materials such as curtains can absorb some sound and reduce reflections. Some sound can still reflect; the effect depends on the material and conditions.', 'How could you compare sound reflection from a curtain and a hard wall?'],
  },
  radar: {
    bm: ['Radar menggunakan gelombang elektromagnet, bukan bunyi. Gema dan sonar ialah contoh yang sesuai untuk mengkaji pantulan bunyi.', 'Bagaimanakah gema menunjukkan bahawa bunyi boleh dipantulkan?'],
    en: ['Radar uses electromagnetic waves, not sound. Echoes and sonar are suitable examples for studying sound reflection.', 'How does an echo show that sound can be reflected?'],
  },
  context: {
    bm: ['Bunyi boleh berfaedah atau memudaratkan mengikut konteks. Bunyi amaran mempunyai kegunaan, tetapi bunyi berulang atau berpanjangan boleh mengganggu pembelajaran.', 'Apakah perubahan yang boleh mengurangkan gangguan bunyi itu sambil mengekalkan kegunaannya?'],
    en: ['Whether a sound is useful or harmful depends on its context. A warning sound has a purpose, while repeated or prolonged sound can disrupt learning.', 'What change could reduce the disturbance while keeping the useful purpose of the sound?'],
  },
  mitigation: {
    bm: ['Cadangan mengurangkan pencemaran bunyi perlu dikaitkan dengan punca, laluan atau penerima bunyi. Terangkan bagaimana perubahan itu mengurangkan gangguan dan cara membandingkan kesannya.', 'Apakah bukti yang boleh anda kumpulkan untuk menilai keberkesanan cadangan anda?'],
    en: ['A noise-reduction proposal should address the source, the path or the listener. Explain how the change reduces disturbance and how you would compare its effect.', 'What evidence could you collect to evaluate whether your proposal works?'],
  },
  no_audio: {
    bm: ['AI tidak menerima atau mendengar audio anda. Label sumber ditentukan oleh murid; AI hanya menyemak teks penjelasan dan cadangan anda.', 'Apakah sumber yang anda perhatikan sendiri dan mengapa bunyi itu berfaedah atau mengganggu?'],
    en: ['The AI has not received or heard your audio. The student supplies the source label; AI only reviews the written explanation and proposal.', 'What source did you observe yourself, and why is the sound useful or disturbing?'],
  },
  needs_observation: {
    bm: ['Gunakan pemerhatian yang selamat sebagai bukti. Nyatakan perkara yang dilihat atau didengar, kemudian bezakan pemerhatian daripada penjelasan anda.', 'Apakah satu pemerhatian yang boleh anda catat untuk menyiasat bunyi ini?'],
    en: ['Use a safe observation as evidence. State what you saw or heard, then distinguish that observation from your explanation.', 'What is one observation you could record to investigate this sound?'],
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
