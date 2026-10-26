import { useEffect, useRef, useState } from 'react';
import type { Language, FeedbackResult } from '../../shared/contract';
import type { Investigation, MissionId } from './model';
import { text } from './copy';
import { getFeedback } from '../poc/client';
import { LightbulbIcon, SparkleIcon } from './Icons';
import { classroomMessage } from './access';
interface Props {mission:MissionId;language:Language;work:Investigation;code:string;setCode:(s:string)=>void;onFeedback:(f:FeedbackResult)=>void;}
export function Guidance({mission,language,work,code,setCode,onFeedback}:Props) {
  const t=text(language), [consent,setConsent]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
  const abort=useRef<AbortController|null>(null),mounted=useRef(true);
  const key=JSON.stringify([mission,language,code,work.observation,work.explanation,work.classification,work.mitigation]);
  useEffect(()=>{mounted.current=true;setBusy(false);setMessage('');return()=>{mounted.current=false;abort.current?.abort();};},[key]);
  const supported=mission==='vibration'||mission==='detective';
  const result=work.feedbackLanguage===language?work.feedback:null;
  async function ask() {
    if(!supported)return;
    if(!work.observation.trim()||!work.explanation.trim()||mission==='detective'&&(!work.classification||!work.mitigation.trim())){setMessage(mission==='detective'?t.aiNeed:t.aiNeedVibration);return;}
    const controller=new AbortController();abort.current=controller;setBusy(true);setMessage('');let timedOut=false;const timeout=setTimeout(()=>{timedOut=true;controller.abort();},25000);
    const classification=work.classification==='both'?t.both:work.classification==='useful'?t.useful:t.harmful;
    try {const feedback=await getFeedback({mission:mission as 'vibration'|'detective',language,observation:work.observation,explanation:mission==='detective'?`${classification}: ${work.explanation}`.slice(0,600):work.explanation,mitigation:work.mitigation},code,controller.signal);if(mounted.current&&!controller.signal.aborted)onFeedback(feedback);}
    catch(e){if(mounted.current&&abort.current===controller&&(!controller.signal.aborted||timedOut))setMessage(classroomMessage(e,language));}
    finally{clearTimeout(timeout);if(mounted.current&&abort.current===controller)setBusy(false);}
  }
  if(!supported)return null;
  return <section className="guidance"><h3><SparkleIcon/>{t.ai}</h3><div className="guidance-body">{result?<><div className="fact-title"><LightbulbIcon/><strong>{t.ai}</strong></div><p className="ai-result">{result.feedback}</p><p className="reflect">{t.reflect}</p></>:<p>{t.aiEmpty}</p>}</div>
    <p className="small">{t.aiIntro}</p><details className="ai-access"><summary>{t.aiCode} &amp; {language==='bm'?'persetujuan':'consent'}</summary><label>{t.aiCode}<input type="password" autoComplete="off" maxLength={128} value={code} onChange={e=>setCode(e.target.value)}/><small>{t.aiCodeHelp}</small></label><p className="small">{t.privacy}</p><label className="check"><input type="checkbox" checked={consent} onChange={e=>{setConsent(e.target.checked);if(!e.target.checked){abort.current?.abort();setBusy(false);}}}/>{t.consent}</label></details>
    <button className="button primary" disabled={busy||!consent||!code} onClick={()=>void ask()}><SparkleIcon/>{busy?t.aiBusy:t.aiAsk}</button>{message?<p role="status" className="form-message">{message}</p>:null}
  </section>;
}
