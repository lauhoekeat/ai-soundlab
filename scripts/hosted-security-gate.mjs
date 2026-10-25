import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const url=process.env.POC_PROXY_URL||'https://ai-soundlab-proxy.ai-soundlab.workers.dev';
const local=Object.fromEntries((await readFile('proxy/.env','utf8')).split(/\r?\n/).filter(l=>l&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1).trim().replace(/^(['"])(.*)\1$/,'$2')];}));
const origin='https://lauhoekeat.github.io';
const input={mission:'vibration',language:'bm',observation:'Contoh ujian dewasa.',explanation:'Getaran menghasilkan bunyi.',mitigation:''};
async function check(name,path,expected,options){const r=await fetch(url+path,{...options,signal:AbortSignal.timeout(15000)});assert.equal(r.status,expected,name);console.log(`PASS ${name}: HTTP ${r.status}`);return r;}
const health=await check('allowed Pages health','/api/health',200,{headers:{Origin:origin}});assert.equal((await health.json()).aiEnabled,true);
await check('absent Origin','/api/health',403,{});
await check('unlisted Origin','/api/health',403,{headers:{Origin:'https://example.invalid'}});
await check('missing class code','/api/feedback',401,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(input)});
await check('preflight','/api/feedback',204,{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type,x-class-code'}});
for(const [name,body,expected] of [['unknown audio property',{...input,audio:'not-accepted'},400],['mission allowlist',{...input,mission:'arbitrary'},400],['body cap','x'.repeat(9000),413]])await check(name,'/api/feedback',expected,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','X-Class-Code':local.CLASS_CODE},body:typeof body==='string'?body:JSON.stringify(body)});
console.log('Hosted boundary checks passed. No provider request made by these invalid requests; no secret values printed.');
