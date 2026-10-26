import { useId } from 'react';
import type { Language } from '../../shared/contract';
import { MISSION_COPY, text } from './copy';
import type { Investigation, MissionId } from './model';
export function StageTitle({number,title}:{number:number;title:string}) {
  return <h3 className={`stage-title stage-${number}`}><span>{number}</span>{title}</h3>;
}
function QuestionField({language,label,hints,starter,value,onChange,rows=3,maxLength=600}:{language:Language;label:string;hints:string[];starter:string;value:string;onChange:(value:string)=>void;rows?:number;maxLength?:number}) {
  const id=useId();
  return <div className="question-field"><label htmlFor={id}>{label}</label>
    <ul id={`${id}-help`} className="question-hints">{hints.map(hint=><li key={hint}>{hint}</li>)}</ul>
    <textarea id={id} aria-describedby={`${id}-help ${id}-starter`} rows={rows} maxLength={maxLength} placeholder={starter} value={value} onChange={e=>onChange(e.target.value)}/>
    <p id={`${id}-starter`} className="answer-starter"><strong>{text(language).starterLead}</strong> {starter}</p>
  </div>;
}
export function Prediction({mission,language,work,update}:{mission:MissionId;language:Language;work:Investigation;update:(p:Partial<Investigation>)=>void}) {
  const t=text(language),q=MISSION_COPY[language][mission];
  return <section className="prediction-panel"><StageTitle number={1} title={t.prediction}/><fieldset><legend>{q.predict}</legend><div className="radio-row">{[['yes',t.yes],['no',t.no],['unsure',t.unsure]].map(([value,label])=><label key={value}><input type="radio" name={`prediction-${mission}`} checked={work.prediction===value} onChange={()=>update({prediction:value})}/>{label}</label>)}</div></fieldset>
    <QuestionField language={language} label={t.reason} hints={[q.reasonHelp]} starter={t.predictionPlaceholder} value={work.predictionReason} maxLength={400} rows={2} onChange={value=>update({predictionReason:value})}/>
  </section>;
}
export function InvestigationSteps({mission,language}:{mission:MissionId;language:Language}) {
  const t=text(language);
  return <div className="investigation-steps"><h4>{t.stepsTitle}</h4><ol>{MISSION_COPY[language][mission].steps.map(step=><li key={step}>{step}</li>)}</ol></div>;
}
export function ObservationField({mission,language,work,update}:{mission:MissionId;language:Language;work:Investigation;update:(p:Partial<Investigation>)=>void}) {
  const q=MISSION_COPY[language][mission];
  return <QuestionField language={language} label={q.observe} hints={q.observeHints} starter={q.observeStarter} value={work.observation} onChange={value=>update({observation:value})}/>;
}
export function ExplanationFields({mission,language,work,update}:{mission:MissionId;language:Language;work:Investigation;update:(p:Partial<Investigation>)=>void}) {
  const t=text(language),q=MISSION_COPY[language][mission],help=useId();
  return <section className="explanation-panel"><StageTitle number={3} title={t.explanation}/>
    {mission==='detective'?<fieldset className="classification" aria-describedby={help}><legend>{t.classify}</legend><p id={help} className="classification-help">{t.classifyHelp}</p>{[['useful',t.useful],['harmful',t.harmful],['both',t.both]].map(([value,label])=><label key={value}><input type="radio" name="classification" checked={work.classification===value} onChange={()=>update({classification:value})}/>{label}</label>)}</fieldset>:null}
    <QuestionField language={language} label={q.explain} hints={q.explainHints} starter={q.explainStarter} value={work.explanation} maxLength={mission==='detective'?570:600} rows={4} onChange={value=>update({explanation:value})}/>
    {mission==='detective'?<QuestionField language={language} label={t.mitigation} hints={[t.mitigationHelp]} starter={t.mitigationStarter} value={work.mitigation} maxLength={400} onChange={value=>update({mitigation:value})}/>:null}
  </section>;
}
