import type { Entry, Mode } from './model';
const DB = 'ai-soundlab-notebook-v1';
async function open(): Promise<IDBDatabase> {
  return new Promise((resolve,reject) => { const r=indexedDB.open(DB,1); r.onupgradeneeded=()=>r.result.createObjectStore('entries',{keyPath:'id'}); r.onerror=()=>reject(new Error('storage')); r.onblocked=()=>reject(new Error('storage')); r.onsuccess=()=>resolve(r.result); });
}
async function run<T>(mode:IDBTransactionMode, work:(store:IDBObjectStore)=>IDBRequest<T>):Promise<T> {
  const db=await open(); return new Promise((resolve,reject)=>{const tx=db.transaction('entries',mode); const r=work(tx.objectStore('entries')); tx.oncomplete=()=>{db.close();resolve(r.result);}; tx.onabort=tx.onerror=()=>{db.close();reject(new Error('storage'));};});
}
export async function readEntries():Promise<Entry[]> {return run('readonly',s=>s.getAll());}
export async function writeEntry(entry:Entry) {await run('readwrite',s=>s.put(entry));}
export async function deleteMode(mode:Mode) {const db=await open(); return new Promise<void>((resolve,reject)=>{const tx=db.transaction('entries','readwrite');const store=tx.objectStore('entries'); const cursor=store.openCursor();cursor.onsuccess=()=>{const c=cursor.result;if(c){if((c.value as Entry).mode===mode)c.delete();c.continue();}};tx.oncomplete=()=>{db.close();resolve();};tx.onabort=tx.onerror=()=>{db.close();reject(new Error('storage'));};});}
export function exportEntries(entries:Entry[]) { const data={version:1,exportedAt:new Date().toISOString(),evidence:entries}; const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})); const a=document.createElement('a');a.href=url;a.download='ai-soundlab-bukti.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }
