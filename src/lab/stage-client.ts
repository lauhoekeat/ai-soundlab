import {proxyUrl} from '../poc/client';
import {ClassroomError} from '../poc/errors';
import type {StageInput,StageResult} from '../../shared/stage-guidance';
export async function getStageGuidance(input:StageInput,signal:AbortSignal):Promise<StageResult>{
 const response=await fetch(`${proxyUrl()}/api/stage-guidance`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input),signal});
 const data:unknown=await response.json();
 if(!data||typeof data!=='object')throw new Error('invalid_response');const raw=data as Record<string,unknown>;
 if(!response.ok)throw new ClassroomError(String(raw.error));
 if(raw.source!=='openai'||raw.rubricVersion!=='sound-stage-v1'||![0,1,2].includes(Number(raw.score))||typeof raw.feedback!=='string'||raw.feedback.length>600||typeof raw.correctAnswer!=='string'||raw.correctAnswer.length>800||!Array.isArray(raw.met)||raw.met.length!==2||raw.met.some(value=>typeof value!=='boolean'))throw new Error('invalid_response');
 return raw as unknown as StageResult;
}
