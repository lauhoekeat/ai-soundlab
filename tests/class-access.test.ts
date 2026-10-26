import { afterEach, describe, expect, it, vi } from 'vitest';
import { handle, QuotaCoordinator, type Env } from '../proxy/src/index';
import { validSoundFile } from '../src/lab/audio-file';
import { classroomMessage, ClassroomError } from '../src/lab/access';
import { getFeedback } from '../src/poc/client';

const teacher='test-teacher-setup-code-not-real', origin='http://127.0.0.1:5173';
function setup(){
  const values=new Map<string,unknown>();
  const storage={get:async(key:string)=>values.get(key),put:async(key:string,value:unknown)=>{values.set(key,value);}};
  const state={storage:{...storage,transaction:async(fn:(tx:typeof storage)=>Promise<unknown>)=>fn(storage)}} as unknown as DurableObjectState;
  const coordinator=new QuotaCoordinator(state);
  const env:Env={CLASS_CODE:teacher,OPENAI_API_KEY:'test-only',IP_HASH_SECRET:'test-only-not-secret-32-characters',AI_ENABLED:'true',ALLOWED_ORIGINS:origin,CLASS_PER_MINUTE:'12',IP_PER_MINUTE:'20',DAILY_LIMIT:'200',MONTHLY_LIMIT:'2000',QUOTA:{idFromName:()=>'',get:()=>({fetch:(url:string,init:RequestInit)=>coordinator.fetch(new Request(url,init))})} as unknown as DurableObjectNamespace};
  const request=(path:string,code:string,body:unknown={})=>new Request(`https://test${path}`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','X-Class-Code':code},body:JSON.stringify(body)});
  return {env,request,values};
}
afterEach(()=>{vi.useRealTimers();vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('protected classroom access',()=>{
  it('requires teacher credential and exact empty request, with no provider call',async()=>{
    const {env,request}=setup(),provider=vi.fn();
    expect((await handle(request('/api/class-code','wrong'),env,provider)).status).toBe(401);
    expect((await handle(request('/api/class-code',teacher,{audio:'no'}),env,provider)).status).toBe(400);
    const r=await handle(request('/api/class-code',teacher),env,provider),data=await r.json() as {code:string;expiresAt:number};
    expect(r.status).toBe(200);expect(data.code).toMatch(/^[A-HJ-NP-Z2-9]{10}$/);expect(data.expiresAt-Date.now()).toBeGreaterThan(7190000);expect(r.headers.get('Cache-Control')).toBe('no-store');expect(provider).not.toHaveBeenCalled();
  });
  it('uses classroom code for feedback, prevents pupil code issuance, rejects old/replaced/expired codes and rotated teacher',async()=>{
    const {env,request,values}=setup();
    const first=await (await handle(request('/api/class-code',teacher),env)).json() as {code:string};
    const input={mission:'vibration',language:'en',observation:'A ruler vibrates.',explanation:'Vibration makes sound.',mitigation:''};
    const provider=vi.fn(async()=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({concept:'vibration',evidenceExcerpt:'ruler'})}]}]})));
    expect((await handle(request('/api/feedback',first.code,input),env,provider)).status).toBe(200);
    expect((await handle(request('/api/class-code',first.code),env,provider)).status).toBe(401);
    const stored=JSON.stringify([...values.values()]);expect(stored).not.toContain(first.code);expect(stored).not.toContain(teacher);
    const second=await (await handle(request('/api/class-code',teacher),env)).json() as {code:string};
    expect((await handle(request('/api/feedback',first.code,input),env,provider)).status).toBe(401);
    expect((await handle(request('/api/feedback',second.code,input),{...env,CLASS_CODE:teacher+'rotated'},provider)).status).toBe(401);
    vi.spyOn(Date,'now').mockReturnValue(Date.now()+7200001);
    expect((await handle(request('/api/feedback',second.code,input),env,provider)).status).toBe(401);vi.restoreAllMocks();expect(provider).toHaveBeenCalledOnce();
  });
  it('limits issuance to ten per hour and throttles guessing independently of paid calls',async()=>{
    const {env,request}=setup();for(let i=0;i<10;i++)expect((await handle(request('/api/class-code',teacher),env)).status).toBe(200);
    expect((await handle(request('/api/class-code',teacher),env)).status).toBe(429);
    for(let i=0;i<20;i++)expect((await handle(request('/api/feedback','AAAAAAAAAA'),env)).status).toBe(401);
    expect((await handle(request('/api/feedback','AAAAAAAAAA'),env)).status).toBe(429);
  });
  it('fails closed when classroom credential storage fails',async()=>{
    const {env,request}=setup();env.QUOTA={idFromName:()=>'',get:()=>({fetch:async()=>{throw new Error('storage failed');}})} as unknown as DurableObjectNamespace;
    expect((await handle(request('/api/class-code',teacher),env)).status).toBe(503);
    expect((await handle(request('/api/feedback','AAAAAAAAAA'),env)).status).toBe(503);
  });
  it('validates issuance preflight, malformed JSON and streamed body size before issuance',async()=>{
    const {env,request}=setup();
    const preflight=new Request('https://test/api/class-code',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type,x-class-code'}});
    expect((await handle(preflight,env)).status).toBe(204);
    const malformed=request('/api/class-code',teacher);const headers=malformed.headers;
    expect((await handle(new Request(malformed.url,{method:'POST',headers,body:'{' }),env)).status).toBe(400);
    expect((await handle(request('/api/class-code',teacher,'x'.repeat(200)),env)).status).toBe(413);
  });
});
describe('classroom copy and local sound input',()=>{
  it('keeps raw internal errors out of BM/EN and gives actionable invalid-code feedback',()=>{
    expect(classroomMessage(new Error('secret SQL schema stack trace'),'bm')).not.toContain('SQL');
    expect(classroomMessage(new ClassroomError('class_code_invalid'),'en')).toContain('expired');
    expect(classroomMessage(new ClassroomError('class_code_invalid'),'bm')).toContain('tamat');
  });
  it('accepts supplied M4A sizes locally and rejects empty/oversize/non-audio',()=>{
    for(const size of [213823,106227,82317])expect(validSoundFile({size,name:'test.m4a',type:''})).toBe(true);
    for(const size of [0,11*1024*1024])expect(validSoundFile({size,name:'test.m4a',type:'audio/mp4'})).toBe(false);
    expect(validSoundFile({size:100,name:'test.exe',type:''})).toBe(false);
  });
  it('accepts a pupil typing a spaced, lowercase classroom code without changing teacher credentials',async()=>{
    const input={mission:'vibration' as const,language:'en' as const,observation:'Ruler moves.',explanation:'It vibrates.',mitigation:''};
    const fake=vi.fn(async()=>new Response(JSON.stringify({feedback:'A hint.',source:'openai',generationMode:'ai-selected-curriculum-feedback'})));vi.stubGlobal('fetch',fake);
    await getFeedback(input,' abcd2-34567 ',new AbortController().signal);
    expect((fake.mock.calls[0] as unknown as [string,RequestInit])[1].headers).toMatchObject({'X-Class-Code':'ABCD234567'});
    await getFeedback(input,teacher,new AbortController().signal);
    expect((fake.mock.calls[1] as unknown as [string,RequestInit])[1].headers).toMatchObject({'X-Class-Code':teacher});
  });
});
