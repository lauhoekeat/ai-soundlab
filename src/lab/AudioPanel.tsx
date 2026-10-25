import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../shared/contract';
import { startCapture, type Capture } from '../poc/audio';
import { text } from './copy';
import { MicrophoneIcon, StopIcon, TrashIcon, InfoIcon } from './Icons';
interface Props {language:Language; ready:boolean; baseline?:boolean; onComplete:(rms:number,kind:string)=>void;}
export function AudioPanel({language,ready,baseline=false,onComplete}:Props) {
  const t=text(language); const [active,setActive]=useState(false),[pending,setPending]=useState(false),[url,setUrl]=useState(''),[error,setError]=useState(''),[level,setLevel]=useState({rms:0,dbfs:-96});
  const canvas=useRef<HTMLCanvasElement>(null), capture=useRef<Capture|null>(null), controller=useRef<AbortController|null>(null), timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined), blobUrl=useRef(''), mounted=useRef(true), peak=useRef(0), begun=useRef(false), kind=useRef('sound'), frameTime=useRef(0), callback=useRef(onComplete);
  callback.current=onComplete;
  function stop(report=true) {controller.current?.abort();capture.current?.stop();capture.current=null;clearTimeout(timer.current);if(report&&begun.current)callback.current(peak.current,kind.current);begun.current=false;if(mounted.current){setActive(false);setPending(false);}}
  useEffect(()=>{mounted.current=true; const hide=()=>{if(document.hidden)stop();}; const leave=()=>stop();document.addEventListener('visibilitychange',hide);window.addEventListener('pagehide',leave);const ctx=canvas.current?.getContext('2d');if(ctx){ctx.strokeStyle='#a4b5c9';ctx.beginPath();ctx.moveTo(0,65);ctx.lineTo(640,65);ctx.stroke();}return()=>{mounted.current=false;stop(false);URL.revokeObjectURL(blobUrl.current);document.removeEventListener('visibilitychange',hide);window.removeEventListener('pagehide',leave);};},[]);
  async function begin(role:string) {
    stop(false);const abort=new AbortController();controller.current=abort;peak.current=0;kind.current=role;setError('');setPending(true);URL.revokeObjectURL(blobUrl.current);blobUrl.current='';setUrl('');
    try {const result=await startCapture(m=>{if(!mounted.current||controller.current!==abort)return;peak.current=Math.max(peak.current,m.rms);if(performance.now()-frameTime.current>160){setLevel({rms:m.rms,dbfs:m.dbfs});frameTime.current=performance.now();}const c=canvas.current,ctx=c?.getContext('2d');if(!c||!ctx)return;ctx.clearRect(0,0,c.width,c.height);ctx.strokeStyle='#008e98';ctx.lineWidth=2;ctx.beginPath();for(let x=0;x<c.width;x++){const y=c.height/2-m.samples[Math.floor(x/c.width*m.samples.length)]*c.height/2;if(!x)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();},blob=>{if(!mounted.current||controller.current!==abort)return;URL.revokeObjectURL(blobUrl.current);blobUrl.current=URL.createObjectURL(blob);setUrl(blobUrl.current);},abort.signal);
      if(abort.signal.aborted||!mounted.current){result.stop();return;}capture.current=result;begun.current=true;setPending(false);setActive(true);timer.current=setTimeout(()=>stop(),5000);
    }catch{if(mounted.current&&controller.current===abort){setPending(false);setError(t.audioDenied);}}
  }
  return <div className="audio-panel"><div className="audio-actions"><button className="button primary" disabled={!ready||active||pending} onClick={()=>void begin('sound')}><MicrophoneIcon/>{baseline&&url?t.sound:t.record}</button>{active||pending?<button className="button stop" onClick={()=>stop()}><StopIcon/>{t.stop}</button>:null}</div><div className="signal-heading"><strong>{t.relative}</strong><span role="status">{pending?t.waiting:active?t.recording:url?t.last:t.idle}</span></div>
    <canvas ref={canvas} width={640} height={130} role="img" aria-label={t.waveAlt}/><small className="axis">{t.timeAxis}</small>
    {baseline?<button className="text-button" disabled={!ready||active||pending} onClick={()=>void begin('quiet')}>{t.quiet}</button>:null}
    {url?<div className="audio-playback"><audio src={url} controls aria-label={t.localAudio}/><button className="icon-button" aria-label={t.deleteAudio} onClick={()=>{URL.revokeObjectURL(blobUrl.current);blobUrl.current='';setUrl('');}}><TrashIcon/></button></div>:null}
    <details className="measurement"><summary>RMS {level.rms.toFixed(3)} · {level.dbfs.toFixed(1)} dBFS</summary><p>{t.notSPL}</p></details>
    <p className="small info-line"><InfoIcon/>{error||t.privacy.split('. ')[1]||t.localAudio}</p>
  </div>;
}
