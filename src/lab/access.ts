import type { Language } from '../../shared/contract';
import { proxyUrl } from '../poc/client';

import { ClassroomError } from '../poc/errors';
export { ClassroomError } from '../poc/errors';
const notices: Record<string, [string,string]> = {
  class_code_invalid: ['Kod tidak sah atau telah tamat. Minta kod terkini daripada guru.', 'This code is invalid or has expired. Ask your teacher for the latest code.'],
  quota_exceeded: ['Panduan hari ini sangat sibuk. Tunggu sebentar atau teruskan bersama guru.', 'Guidance is busy. Wait a little or continue with your teacher.'],
  code_limit: ['Terlalu banyak kod baharu. Gunakan kod terakhir atau cuba pada jam berikutnya.', 'Too many new codes. Use the last code or try again next hour.'],
  ai_timeout: ['Panduan mengambil masa terlalu lama. Cuba lagi; jawapan anda masih ada.', 'Guidance took too long. Try again; your answers are still here.'],
};
export function classroomMessage(error:unknown, language:Language):string {
  const reason = error instanceof ClassroomError ? error.reason : '';
  const pair = notices[reason] ?? ['Panduan belum dapat dihubungi. Semak internet dan cuba lagi. Jawapan anda masih ada.', 'Guidance could not be reached. Check your connection and try again. Your answers are still here.'];
  return pair[language === 'bm' ? 0 : 1];
}
export async function createClassCode(teacherCode:string, signal:AbortSignal):Promise<{code:string;expiresAt:number}> {
  const response = await fetch(`${proxyUrl()}/api/class-code`, {method:'POST',headers:{'Content-Type':'application/json','X-Class-Code':teacherCode.trim()},body:'{}',signal});
  const data = await response.json() as {code?:unknown;expiresAt?:unknown;error?:string};
  if (!response.ok) throw new ClassroomError(data.error ?? 'unavailable');
  if (typeof data.code !== 'string' || !/^[A-HJ-NP-Z2-9]{10}$/.test(data.code) || typeof data.expiresAt !== 'number' || !Number.isFinite(data.expiresAt)) throw new ClassroomError('unavailable');
  return {code:data.code,expiresAt:data.expiresAt};
}
