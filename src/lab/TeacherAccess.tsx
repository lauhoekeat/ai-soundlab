import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../shared/contract';
import { classroomMessage, createClassCode, ClassroomError } from './access';
import { text } from './copy';
export interface LessonAccess {code:string;expiresAt:number;}
export function TeacherAccess({language,lesson,onCreated}:{language:Language;lesson:LessonAccess|null;onCreated:(value:LessonAccess)=>void}) {
  const t=text(language),[credential,setCredential]=useState(''),[busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[copied,setCopied]=useState(false),[now,setNow]=useState(Date.now());
  const pending=useRef<AbortController|null>(null);
  const mounted=useRef(true);
  useEffect(()=>{mounted.current=true;const timer=setInterval(()=>setNow(Date.now()),1000);return()=>{mounted.current=false;clearInterval(timer);pending.current?.abort();};},[]);
  useEffect(()=>{setNotice('');setCopied(false);},[language]);
  const valid=Boolean(lesson&&lesson.expiresAt>now);
  async function generate(){
    const controller=new AbortController();pending.current=controller;setBusy(true);setNotice('');setCopied(false);
    const timeout=setTimeout(()=>controller.abort(),15000);
    try{const value=await createClassCode(credential,controller.signal);if(!controller.signal.aborted){onCreated(value);setCredential('');}}
    catch(error){if(mounted.current)setNotice(controller.signal.aborted?t.codeTimeout:error instanceof ClassroomError&&error.reason==='class_code_invalid'?t.setupInvalid:classroomMessage(error,language));}
    finally{clearTimeout(timeout);if(mounted.current&&pending.current===controller){pending.current=null;setBusy(false);}}
  }
  async function copy(){try{if(lesson){await navigator.clipboard.writeText(lesson.code);if(mounted.current)setCopied(true);}}catch{if(mounted.current)setNotice(t.copyManually);}}
  return <details className="teacher-access"><summary>{t.classSetup}</summary><div className="teacher-access-body"><h2>{t.classSetup}</h2><p>{t.setupHelp}</p><label>{t.teacherCode}<input type="password" autoComplete="off" maxLength={128} value={credential} onChange={e=>setCredential(e.target.value)}/></label><p className="small">{t.teacherCodeHelp}</p><button className="button primary" disabled={busy||!credential.trim()} onClick={()=>void generate()}>{busy?t.codeBusy:lesson?t.codeReplace:t.codeGenerate}</button><p className="small">{t.codeReplaceHelp}</p>{lesson?<div className="lesson-code"><label>{t.aiCode}<input aria-label={t.shareCode} readOnly value={valid?lesson.code:t.codeExpired}/></label>{valid?<><p>{t.validUntil} {new Date(lesson.expiresAt).toLocaleTimeString(language==='bm'?'ms-MY':'en-GB',{hour:'2-digit',minute:'2-digit'})}</p><button className="button secondary" onClick={()=>void copy()}>{copied?t.codeCopied:t.copyCode}</button></>:<p>{t.codeExpiredHelp}</p>}</div>:null}{notice?<p role="status">{notice}</p>:null}</div></details>;
}
