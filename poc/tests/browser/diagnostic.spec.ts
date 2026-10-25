import {test, expect, chromium} from '@playwright/test';
import {mkdtemp} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
test('page, honest untrained state, storage recovery and narrow layout', async ({page}) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await expect(page).toHaveTitle('AI SoundLab — technical POC');
  await expect(page.getByRole('heading', {level:1})).toBeVisible();
  await page.getByRole('button', {name:'Run trained object classifier'}).click();
  await expect(page.locator('#log')).toContainText('Capture or choose');
  await page.getByRole('button', {name:'Save numeric probe evidence'}).click();
  await expect(page.locator('#save-status')).toContainText('Saved numeric');
  await page.reload(); await page.getByRole('button', {name:'Reload evidence'}).click();
  await expect(page.locator('#result')).toContainText('schema');
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path: process.env.POC_SCREENSHOT_DIR ? process.env.POC_SCREENSHOT_DIR+'/desktop.png' : 'test-results/desktop.png',fullPage:false});
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>scrollTo(0,0));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path: process.env.POC_SCREENSHOT_DIR ? process.env.POC_SCREENSHOT_DIR+'/narrow.png' : 'test-results/narrow.png',fullPage:false});
  expect(errors).toEqual([]);
});
test('storage error never leaves a stale saved indicator', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Save numeric probe evidence'}).click();
  await expect(page.locator('#save-status')).toContainText('Saved numeric');
  await page.evaluate(()=>{indexedDB.open=()=>{throw new DOMException('Injected quota/storage failure','QuotaExceededError');};});
  await page.getByRole('button',{name:'Save numeric probe evidence'}).click();
  await expect(page.locator('#save-status')).toContainText('Save failed');
});
test('generated WAV decoding enters the real shared model pipeline without an upload', async ({page}) => {
  const requests:{url:string;method:string}[]=[];page.on('request',r=>requests.push({url:r.url(),method:r.method()}));
  await page.goto('/tests/fixture.html');await page.waitForFunction(()=>!!(window as any).fixture);
  const result=await page.evaluate(async()=>{
    const {Classifier,generated,decode}=(window as any).fixture,source=generated();
    const bytes=new ArrayBuffer(44+source.length*4),view=new DataView(bytes);
    const ascii=(offset:number,text:string)=>[...text].forEach((char,i)=>view.setUint8(offset+i,char.charCodeAt(0)));
    ascii(0,'RIFF');view.setUint32(4,bytes.byteLength-8,true);ascii(8,'WAVE');ascii(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,3,true);view.setUint16(22,1,true);view.setUint32(24,44100,true);view.setUint32(28,44100*4,true);view.setUint16(32,4,true);view.setUint16(34,32,true);ascii(36,'data');view.setUint32(40,source.length*4,true);
    source.forEach((value:number,i:number)=>view.setFloat32(44+i*4,value,true));
    const decoded=await decode(new File([bytes],'synthetic-software-only.wav',{type:'audio/wav'}));
    const c=new Classifier();await c.load();const direct=await c.embed(source),fromFile=await c.embed(decoded);
    return {samples:decoded.length,maxEmbeddingDifference:Math.max(...direct.flat().map((value:number,i:number)=>Math.abs(value-fromFile.flat()[i])))};
  });
  expect(result.samples).toBe(3*44100);expect(result.maxEmbeddingDifference).toBeLessThan(.001);
  expect(requests.every(r=>r.method==='GET'&&r.url.startsWith('http://127.0.0.1:4173/'))).toBe(true);
  await test.info().attach('synthetic-wav-pipeline',{body:JSON.stringify({warning:'Generated float WAV only, not adult data',...result,requests},null,2),contentType:'application/json'});
});
test('five synthetic-microphone capture cycles release tracks', async ({page}) => {
  await page.goto('/tests/fixture.html'); await page.waitForFunction(() => !!(window as any).fixture);
  const result = await page.evaluate(async () => {
    const {Capture} = (window as any).fixture;
    const tracks: MediaStreamTrack[] = [];
    const adapter = new Capture({getUserMedia: async (options: MediaStreamConstraints) => {const stream = await navigator.mediaDevices.getUserMedia(options); tracks.push(...stream.getTracks()); return stream;}});
    const lengths = [];
    for (let i=0;i<5;i++) lengths.push((await adapter.record()).length);
    return {lengths, ended: tracks.every(t=>t.readyState==='ended'),state:adapter.state};
  });
  expect(result.ended).toBe(true); expect(result.state).toBe('stopped');
  expect(result.lengths.every(n => n >= 44100*2.8 && n<=44100*3.2)).toBe(true);
  await test.info().attach('synthetic-capture-cycles',{body:JSON.stringify(result,null,2),contentType:'application/json'});
});
test('pending permission cancels and late granted tracks are released', async ({page}) => {
  await page.goto('/tests/fixture.html'); await page.waitForFunction(() => !!(window as any).fixture);
  const result = await page.evaluate(async () => {
    const {Capture} = (window as any).fixture;
    let grant!: (value: any)=>void, stops=0;
    const adapter = new Capture({getUserMedia:()=>new Promise(resolve=>{grant=resolve;})});
    const recording = adapter.record().catch((e:Error)=>e.name);
    while (!grant) await new Promise(resolve=>setTimeout(resolve,10));
    const start=performance.now(); adapter.stop(); const status=await recording;
    grant({getTracks:()=>[{stop:()=>stops++}]}); await new Promise(resolve=>setTimeout(resolve,20));
    return {status,stops,elapsed:performance.now()-start};
  });
  expect(result.status).toBe('AbortError'); expect(result.stops).toBeGreaterThan(0); expect(result.elapsed).toBeLessThan(1000);
  await test.info().attach('injected-permission-cancellation',{body:JSON.stringify(result,null,2),contentType:'application/json'});
});
test('denied, missing and busy-device adapters recover without reload', async ({page}) => {
  await page.goto('/tests/fixture.html'); await page.waitForFunction(() => !!(window as any).fixture);
  const names = await page.evaluate(async () => {
    const {Capture}=(window as any).fixture, results=[];
    for (const name of ['NotAllowedError','NotFoundError','NotReadableError']) {
      const adapter=new Capture({getUserMedia:async()=>{throw new DOMException('Injected hardware error',name);}});
      results.push({name:await adapter.record().catch((e:Error)=>e.name),state:adapter.state});
    }
    return results;
  });
  expect(names.map(n=>n.name)).toEqual(['NotAllowedError','NotFoundError','NotReadableError']);
  expect(names.every(n=>n.state==='stopped')).toBe(true);
});
test('real pretrained embedding and synthetic head train/store/restore plumbing', async ({page}) => {
  const requests: {url:string;method:string}[]=[];
  page.on('request', r=>requests.push({url:r.url(),method:r.method()}));
  await page.goto('/tests/fixture.html'); await page.waitForFunction(() => !!(window as any).fixture);
  const result=await page.evaluate(async()=>{
    const {Classifier,generated,writeRecord}=(window as any).fixture, classifier=new Classifier();
    await classifier.load(); const embedding=await classifier.embed(generated());
    const labels=['clap','pencil-tap','paper-rustle','background'];
    // Synthetic vectors only: test fitting/serialization; never a sound dataset.
    const examples=labels.flatMap((label,index)=>[0,1].map(n=>({label,embedding:[Array.from({length:2000},(_,i)=>i%4===index?1+n*.01:0)]})));
    await classifier.train(examples,'synthetic-software-test-not-adult-data');
    const metadata=await classifier.saveHead(); await writeRecord('head',metadata);
    const restored=new Classifier(); await restored.load(); await restored.restoreHead(metadata);
    const prediction=await restored.predict(generated());
    const warm=[];
    for(let i=0;i<20;i++) warm.push((await restored.predict(generated())).elapsedMs);
    const sorted=[...warm].sort((a,b)=>a-b);
    return {embedding:embedding.map((x:number[])=>x.length),finite:embedding.every((x:number[])=>x.every(Number.isFinite)),baseLoadMs:classifier.loadedMs,prediction,metadata,warmMs:warm,p95:sorted[Math.ceil(.95*sorted.length)-1]};
  });
  expect(result.embedding).toEqual([2000,2000,2000]); expect(result.finite).toBe(true);
  expect(result.prediction.mode).toBe('actual-local-inference'); expect(result.metadata.headHash).toHaveLength(64);
  expect(requests.every(r=>r.method==='GET' && r.url.startsWith('http://127.0.0.1:4173/'))).toBe(true);
  await test.info().attach('synthetic-pipeline-results',{body:JSON.stringify({warning:'Synthetic software plumbing only; no object accuracy evidence',...result,requests},null,2),contentType:'application/json'});
});
test('offline prepared shell/base survives a new page with network unavailable', async ({page,context}) => {
  await page.goto('/'); await page.getByRole('button',{name:'Prepare offline shell + base assets'}).click();
  await expect(page.locator('#cache-status')).toContainText('Prepared', {timeout:30000});
  const state=await context.storageState({indexedDB:true});
  // Same browser context preserves service-worker caches across pages; this test
  // proves navigation offline, not an OS/browser process restart.
  await context.setOffline(true); await page.close();
  const offline=await context.newPage(); await offline.goto('/');
  await offline.getByRole('button',{name:'Load local base model'}).click();
  await expect(offline.locator('#model-status')).toContainText('Base loaded', {timeout:30000});
  await expect(offline.locator('#log')).not.toContainText('Error:');
  expect(state).toBeTruthy();
});
test('full browser restart offline restores synthetic head and runs real inference', async () => {
  // Short profile path: the workspace + test slug exceeds legacy Windows
  // service-worker disk-cache path limits in persistent Chromium profiles.
  const profile = await mkdtemp(join(tmpdir(), 'soundlab-poc-'));
  const launch = () => chromium.launchPersistentContext(profile, {headless:true, viewport:{width:1366,height:768}});
  let context = await launch();
  try {
    let page=await context.newPage(); await page.goto('http://127.0.0.1:4173/');
    await page.waitForFunction(()=>document.querySelector('#load') && typeof document.querySelector<HTMLElement>('#stop')?.onclick === 'function');
    await page.getByRole('button',{name:'Prepare offline shell + base assets'}).click();
    try {await expect(page.locator('#cache-status')).toContainText('Prepared',{timeout:30000});}
    catch(error) {console.log('Persistent-context cache preparation:',await page.locator('body').innerText());throw error;}
    await page.goto('http://127.0.0.1:4173/tests/fixture.html'); await page.waitForFunction(()=>!!(window as any).fixture);
    await page.evaluate(async()=>{
      const {Classifier,writeRecord}=(window as any).fixture,c=new Classifier(); await c.load();
      const examples=['clap','pencil-tap','paper-rustle','background'].flatMap((label,index)=>[0,1].map(n=>({label,embedding:[Array.from({length:2000},(_,i)=>i%4===index?1+n*.01:0)]})));
      await c.train(examples,'synthetic-software-test-not-adult-data'); await writeRecord('head',await c.saveHead());
    });
    await context.close(); context=await launch(); await context.setOffline(true);
    page=await context.newPage(); const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
    await page.goto('http://127.0.0.1:4173/tests/fixture.html'); await page.waitForFunction(()=>!!(window as any).fixture);
    const result=await page.evaluate(async()=>{
      const {Classifier,generated,readRecord}=(window as any).fixture,c=new Classifier();await c.load();await c.restoreHead(await readRecord('head'));
      return c.predict(generated());
    });
    expect(result.mode).toBe('actual-local-inference');expect(result.headHash).toHaveLength(64);
    expect(requests.every(url=>url.startsWith('http://127.0.0.1:4173/'))).toBe(true);
    await test.info().attach('restart-offline-synthetic-inference',{body:JSON.stringify({warning:'Synthetic QA head/signal; not adult object recognition',result,requests},null,2),contentType:'application/json'});
  } finally {await context.close();}
});
