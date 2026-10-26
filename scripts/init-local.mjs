import { randomBytes } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
// Exclusive creation: never overwrite an owner-configured env file. Print no values.
try {
  await writeFile('proxy/.env', `OPENAI_API_KEY=\nIP_HASH_SECRET=${randomBytes(32).toString('hex')}\nAI_ENABLED=false\nALLOWED_ORIGINS=http://127.0.0.1:5173\n`, { flag: 'wx' });
  console.log('Created ignored proxy/.env with local access controls. AI remains disabled; no provider key added.');
} catch (error) { if (error.code !== 'EEXIST') throw error; console.log('Existing proxy/.env preserved.'); }
