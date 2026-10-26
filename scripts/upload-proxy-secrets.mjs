import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
// Transport local values directly to Wrangler stdin. Never print secret values.
const local = Object.fromEntries((await readFile('proxy/.env','utf8')).split(/\r?\n/).filter(l=>l&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1).trim().replace(/^(['"])(.*)\1$/,'$2')];}));
const names=['OPENAI_API_KEY','IP_HASH_SECRET'];
if(names.some(name=>!local[name]))throw new Error('Required local server secret is missing. No values displayed.');
const values=Object.fromEntries(names.map(name=>[name,local[name]]));
const result=spawnSync(process.execPath,[resolve('node_modules/wrangler/bin/wrangler.js'),'secret','bulk','--config','proxy/wrangler.jsonc'],{input:JSON.stringify(values),encoding:'utf8',env:{...process.env,WRANGLER_SEND_METRICS:'false'},maxBuffer:1_000_000});
let output=`${result.stdout||''}${result.stderr||''}`;
for(const value of Object.values(values))output=output.split(value).join('[redacted]');
process.stdout.write(output);
if(result.error||result.status!==0)throw new Error('Hosted secret upload failed; see redacted diagnostic above.');
console.log('Uploaded two server-side secrets. No provider secret was written to GitHub or frontend configuration.');
