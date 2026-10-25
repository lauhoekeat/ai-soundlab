import type { FeedbackInput, FeedbackResult } from '../../shared/contract';
export interface Evidence { id: string; savedAt: string; input: FeedbackInput; feedback: FeedbackResult | null; source: 'student-observation' | 'teacher-example'; }
const NAME = 'ai-soundlab-trial-v1';
async function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('evidence', { keyPath: 'id' });
    request.onerror = () => reject(new Error('Storan tidak tersedia. Eksport sebelum keluar.'));
    request.onblocked = () => reject(new Error('Tutup tab AI SoundLab lain dan cuba semula.'));
    request.onsuccess = () => resolve(request.result);
  });
}
async function transaction<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const tx = database.transaction('evidence', mode);
    const request = operation(tx.objectStore('evidence'));
    tx.oncomplete = () => { database.close(); resolve(request.result); };
    tx.onerror = tx.onabort = () => { database.close(); reject(new Error('Simpanan gagal. Eksport sebelum keluar.')); };
  });
}
export async function saveEvidence(item: Evidence) { await transaction('readwrite', store => store.put(item)); }
export async function readEvidence(): Promise<Evidence[]> { return transaction('readonly', store => store.getAll()); }
export async function clearEvidence() { await transaction('readwrite', store => store.clear()); }
