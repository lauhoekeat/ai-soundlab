import { echoDelay } from '../../shared/contract';
// A constant 30x time scale keeps short returns audible and preserves distance comparisons.
export const ECHO_TIME_SCALE=30;
export function echoDemoSeconds(distance:number):number { return echoDelay(distance)*ECHO_TIME_SCALE; }
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
