import {ASSESSMENT_IDS,type AssessmentInput,type AssessmentResult} from '../../shared/assessment';
import {proxyUrl} from '../poc/client';
import {ClassroomError} from '../poc/errors';

export async function markAssessment(input:AssessmentInput,signal:AbortSignal):Promise<AssessmentResult>{
 const response=await fetch(`${proxyUrl()}/api/assessment`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input),signal});
 const data:unknown=await response.json();
 if(!data||typeof data!=='object')throw new Error('invalid_response');
 const raw=data as Record<string,unknown>;
 if(!response.ok)throw new ClassroomError(String(raw.error));
 if(raw.source!=='openai'||raw.rubricVersion!=='sound-6.1-assessment-v1'||!Array.isArray(raw.marks)||raw.marks.length!==5||typeof raw.total!=='number'||!Number.isInteger(raw.total)||raw.total<0||raw.total>10)throw new Error('invalid_response');
 const marks=raw.marks as Record<string,unknown>[];
 if(marks.some((item,index)=>!item||item.id!==ASSESSMENT_IDS[index]||![0,1,2].includes(Number(item.score))||typeof item.feedback!=='string'||item.feedback.length>600||typeof item.correctAnswer!=='string'||item.correctAnswer.length>800||!Array.isArray(item.met)||item.met.length!==2||item.met.some(value=>typeof value!=='boolean')))throw new Error('invalid_response');
 if(marks.reduce((sum,item)=>sum+Number(item.score),0)!==raw.total)throw new Error('invalid_response');
 return raw as unknown as AssessmentResult;
}
