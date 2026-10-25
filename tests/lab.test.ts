import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { arrivalMs, badgeCount, blank, complete, entryId, sameDistances, type Entry, type Investigation } from '../src/lab/model';
import { readEntries, writeEntry, deleteMode } from '../src/lab/notebook-store';
import { TEXT, MISSION_COPY } from '../src/lab/copy';
const work:Investigation={...blank(),prediction:'yes',predictionReason:'I will test it.',observation:'The ruler vibrated.',explanation:'Vibration produces sound.',observed:true};
describe('investigation evidence',()=>{
  it('requires prediction, reason, activity, observation and explanation',()=>{expect(complete('vibration',work)).toBe(true);for(const patch of [{prediction:''},{predictionReason:' '},{observed:false},{observation:' '},{explanation:' '}])expect(complete('vibration',{...work,...patch})).toBe(false);});
  it('requires both distance layouts and both surfaces for simulation evidence',()=>{expect(complete('travel',work)).toBe(false);expect(complete('travel',{...work,experiment:{equalTest:1,differentTest:1}})).toBe(true);expect(complete('echo',{...work,experiment:{hardTest:1}})).toBe(false);expect(complete('echo',{...work,experiment:{hardTest:1,softTest:1}})).toBe(true);});
  it('requires contextual classification and mitigation, with no automatic audio label',()=>{expect(complete('detective',work)).toBe(false);expect(complete('detective',{...work,classification:'both',mitigation:'Reduce unnecessary horns.'})).toBe(true);expect(blank().classification).toBe('');});
  it('counts unique valid mission evidence separately for teacher/student',()=>{const entry:Entry={id:entryId('student','vibration'),mission:'vibration',mode:'student',language:'en',savedAt:'2026-10-25T00:00:00Z',work};expect(badgeCount([entry,entry,{...entry,mode:'teacher'},{...entry,mission:'echo'}],'student')).toBe(1);});
  it('models equal/unequal travel and round-trip comparisons consistently',()=>{expect(sameDistances([2,2,2,2])).toBe(true);expect(sameDistances([2,2,3,2])).toBe(false);expect(arrivalMs(4)).toBeCloseTo(2*arrivalMs(2));});
  it('has full equivalent UI keys and all four mission descriptions in BM/EN',()=>{expect(Object.keys(TEXT.bm).sort()).toEqual(Object.keys(TEXT.en).sort());for(const lang of ['bm','en'] as const){expect(Object.keys(MISSION_COPY[lang])).toHaveLength(4);for(const value of Object.values(TEXT[lang]))expect(value.trim()).not.toBe('');}});
});
describe('IndexedDB product notebook',()=>{
  beforeEach(()=>vi.stubGlobal('indexedDB',new IDBFactory()));afterEach(()=>vi.unstubAllGlobals());
  const entry:Entry={id:entryId('student','vibration'),mission:'vibration',mode:'student',language:'en',savedAt:'2026-10-25T00:00:00Z',work};
  it('persists a saved entry across new connections and updates in place',async()=>{await writeEntry(entry);expect((await readEntries())[0].work.explanation).toBe(work.explanation);await writeEntry({...entry,work:{...work,explanation:'Revised evidence.'}});const stored=await readEntries();expect(stored).toHaveLength(1);expect(stored[0].work.explanation).toBe('Revised evidence.');});
  it('clears only the selected mode and never stores recording blobs or access code',async()=>{await writeEntry(entry);await writeEntry({...entry,id:entryId('teacher','vibration'),mode:'teacher'});await deleteMode('student');const stored=await readEntries();expect(stored).toHaveLength(1);expect(stored[0].mode).toBe('teacher');const json=JSON.stringify(stored);expect(json).not.toContain('CLASS_CODE');expect(json).not.toContain('audio');expect(json).not.toContain('blob:');});
});
