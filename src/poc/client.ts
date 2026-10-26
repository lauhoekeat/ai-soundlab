import { ClassroomError } from './errors';
import type { FeedbackInput, FeedbackResult } from '../../shared/contract';
export function proxyUrl(): string {
  if (import.meta.env.PROD && !import.meta.env.VITE_PROXY_URL) throw new Error('Pelayan AI awan belum disediakan. Guru masih boleh menguji rakaman dan bukti setempat.');
  const value = import.meta.env.VITE_PROXY_URL || 'http://127.0.0.1:8787';
  const url = new URL(value);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && url.hostname === '127.0.0.1')) throw new Error('Proxy mesti menggunakan HTTPS.');
  return url.origin;
}
export async function getFeedback(input: FeedbackInput, code: string, signal: AbortSignal): Promise<FeedbackResult> {
  const response = await fetch(`${proxyUrl()}/api/feedback`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Class-Code': code.trim().replace(/[ -]/g, '').toUpperCase().length === 10 ? code.trim().replace(/[ -]/g, '').toUpperCase() : code.trim() }, body: JSON.stringify(input), signal });
  const raw: unknown = await response.json();
  if (!raw || typeof raw !== 'object') throw new Error('Respons tidak sah.');
  const data = raw as Record<string, unknown>;
  if (!response.ok) throw new ClassroomError(String(data.error));
  if (data.source !== 'openai' || data.generationMode !== 'ai-selected-curriculum-feedback' || typeof data.feedback !== 'string' || data.feedback.length > 1600) throw new Error('Respons tidak sah.');
  return data as unknown as FeedbackResult;
}
