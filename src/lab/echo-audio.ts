import { echoDelay } from '../../shared/contract';
// Echo surfaces share the same air path. Keep at least half a second between pulses so young learners can hear two sounds.
export function echoDemoSeconds(distance:number):number { return Math.max(0.55,echoDelay(distance)); }
export const ECHO_LEVELS={original:0.12,hard:0.08,soft:0.025} as const;
export async function playEchoDemo(distance:number,surface:'hard'|'soft',progress:number,signal:AbortSignal):Promise<void> {
  if(signal.aborted)return;
  const context=new AudioContext();
  let timer:ReturnType<typeof setTimeout>|undefined,closed=false,finish!:()=>void;
  const ended=new Promise<void>(resolve=>{finish=resolve;});
  const stop=()=>{if(closed)return;closed=true;clearTimeout(timer);signal.removeEventListener('abort',stop);void context.close().catch(()=>{});finish();};
  signal.addEventListener('abort',stop,{once:true});
  try {
    await context.resume();if(signal.aborted||closed){stop();return;}
    const pulse=(at:number,volume:number)=>{
      const oscillator=context.createOscillator(),gain=context.createGain();oscillator.frequency.value=660;
      oscillator.connect(gain);gain.connect(context.destination);
      gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+0.005);gain.gain.exponentialRampToValueAtTime(0.0001,at+0.11);
      oscillator.start(at);oscillator.stop(at+0.12);
    };
    const p=progress>=1?0:Math.max(0,progress),at=context.currentTime+0.03,remaining=echoDemoSeconds(distance)*(1-p);
    if(p===0)pulse(at,ECHO_LEVELS.original);
    pulse(at+remaining,ECHO_LEVELS[surface]);
    timer=setTimeout(stop,(remaining+0.2)*1000);
    await ended;
  } catch(error) {stop();if(!signal.aborted)throw error;}
}
export async function playEchoRecording(blob:Blob,distance:number,surface:'hard'|'soft',signal:AbortSignal):Promise<void>{
 if(signal.aborted)return;const context=new AudioContext();let closed=false,timer:ReturnType<typeof setTimeout>|undefined,finish!:()=>void;
 const ended=new Promise<void>(resolve=>{finish=resolve;});const stop=()=>{if(closed)return;closed=true;clearTimeout(timer);signal.removeEventListener('abort',stop);void context.close().catch(()=>{});finish();};signal.addEventListener('abort',stop,{once:true});
 try{await context.resume();const buffer=await context.decodeAudioData(await blob.arrayBuffer());if(signal.aborted){stop();return;}
  const start=context.currentTime+.03;
  // The second playback is staged after the recorded phrase so it can be heard distinctly; the chosen distance supplies additional travel delay.
  const returnAt=start+buffer.duration+echoDemoSeconds(distance);
  for(const [at,volume] of [[start,.65],[returnAt,surface==='hard'?.43:.15]] as const){const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;gain.gain.value=volume;source.connect(gain);gain.connect(context.destination);source.start(at);}
  timer=setTimeout(stop,(buffer.duration*2+echoDemoSeconds(distance)+.3)*1000);await ended;
 }catch(error){stop();if(!signal.aborted)throw error;}
}
