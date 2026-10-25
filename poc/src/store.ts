const DB = 'soundlab-poc-v1';
export async function openStore(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('records');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}
// Only callers' constructed numeric/anonymous summaries are accepted; never PCM.
export async function writeRecord(key: string, value: unknown) {
  const db = await openStore();
  try {await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('records', 'readwrite');
    tx.objectStore('records').put(value, key);
    tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
  });} finally {db.close();}
}
export async function readRecord<T>(key: string): Promise<T | undefined> {
  const db = await openStore();
  try {return await new Promise<T>((resolve, reject) => {
    const request = db.transaction('records').objectStore('records').get(key);
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });} finally {db.close();}
}
