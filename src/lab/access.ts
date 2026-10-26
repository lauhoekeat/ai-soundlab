import type { Language } from '../../shared/contract';
import { ClassroomError } from '../poc/errors';
export { ClassroomError } from '../poc/errors';
const notices: Record<string, [string,string]> = {
  quota_exceeded: ['Had semakan AI telah dicapai. Cuba lagi kemudian; jawapan kamu masih ada pada halaman ini.', 'The AI check limit has been reached. Try later; your answers remain on this page.'],
  ai_timeout: ['Semakan mengambil masa terlalu lama. Cuba lagi.', 'The check took too long. Try again.'],
};
export function classroomMessage(error:unknown, language:Language):string {
  const reason = error instanceof ClassroomError ? error.reason : '';
  const pair = notices[reason] ?? ['AI belum dapat dihubungi. Semak internet dan cuba lagi. Jawapan kamu masih ada pada halaman ini.', 'AI could not be reached. Check your connection and try again. Your answers remain on this page.'];
  return pair[language === 'bm' ? 0 : 1];
}
