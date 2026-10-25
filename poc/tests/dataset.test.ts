import {expect, it} from 'vitest';
import {validateDataset, testReadiness} from '../src/dataset';
const first = {id:'e1',file:'e1.wav',label:'clap',split:'train',session:'s1',contributor:'a1',device:'d1',room:'r1',sha256:'a'.repeat(64)};
const manifest = (events = [first]) => ({version:1,source:'adult-object',attestation:'Adults only; object sounds; no pupil recordings; permission to use locally.',events});
it('requires exact adult-only attestation', () => expect(() => validateDataset({...manifest(),source:'synthetic'})).toThrow());
it('rejects duplicate events/hashes', () => expect(() => validateDataset(manifest([first, {...first,id:'e2',file:'e2.wav'}]))).toThrow('Duplicate'));
it('rejects split leakage by session', () => expect(() => validateDataset(manifest([first,{...first,id:'e2',file:'e2.wav',sha256:'b'.repeat(64),split:'test'}]))).toThrow('session'));
it('does not call a small dataset gate-ready', () => expect(testReadiness(validateDataset(manifest())).ready).toBe(false));
it('rejects non-anonymous codes and path traversal', () => {
  expect(() => validateDataset(manifest([{...first,contributor:'Real Person'}]))).toThrow();
  expect(() => validateDataset(manifest([{...first,file:'../x.wav'}]))).toThrow();
});
