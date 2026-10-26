import { rms } from '../../shared/contract';
export function validSoundFile(file:Pick<File,'size'|'name'|'type'>):boolean {
  return file.size>0 && file.size<=10*1024*1024 && (file.type.startsWith('audio/') || /\.(m4a|mp3|wav|ogg|webm|aac|mp4)$/i.test(file.name));
}
// Metadata is checked before decoding to bound decompressed audio memory.
export async function readSoundFile(file:File,url:string,signal:AbortSignal):Promise<{samples:Float32Array;rms:number}> {
  if(!validSoundFile(file)||signal.aborted)throw new Error('invalid_audio');
  const audio=new Audio();audio.preload='metadata';
  await new Promise<void>((resolve,reject)=>{
    const finish=(error?:Error)=>{clearTimeout(timer);signal.removeEventListener('abort',cancel);audio.onloadedmetadata=null;audio.onerror=null;audio.removeAttribute('src');audio.load();error?reject(error):resolve();};
    const cancel=()=>finish(new Error('aborted')),timer=setTimeout(()=>finish(new Error('timeout')),15000);
    signal.addEventListener('abort',cancel,{once:true});
    audio.onloadedmetadata=()=>finish(!Number.isFinite(audio.duration)||audio.duration<=0||audio.duration>60?new Error('duration'):undefined);
    audio.onerror=()=>finish(new Error('unsupported'));audio.src=url;
  });
  if(signal.aborted)throw new Error('aborted');
  const context=new AudioContext();
  const close=()=>{void context.close().catch(()=>{});};signal.addEventListener('abort',close,{once:true});
  try {
    const decoded=await context.decodeAudioData(await file.arrayBuffer());
    if(signal.aborted||decoded.duration>60)throw new Error('invalid_audio');
    const samples=decoded.getChannelData(0);
    const waveform=new Float32Array(640);
    for(let x=0;x<640;x++){let peak=0;for(let i=Math.floor(x*samples.length/640);i<Math.floor((x+1)*samples.length/640);i++)if(Math.abs(samples[i])>Math.abs(peak))peak=samples[i];waveform[x]=peak;}
    return {samples:waveform,rms:rms(samples)};
  } finally {signal.removeEventListener('abort',close);if(context.state!=='closed')await context.close();}
}
