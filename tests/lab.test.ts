import {describe,expect,it} from 'vitest';
import {arrivalMs,blank,complete,sameDistances,type Investigation} from '../src/lab/model';
import {stepIssues} from '../src/lab/flow';
import {TEXT,MISSION_COPY} from '../src/lab/copy';
import {FLOW_TEXT} from '../src/lab/flow';
const work:Investigation={...blank(),prediction:'yes',predictionReason:'Saya akan mencuba.',observation:'Saya mendengar bunyi.',explanation:'Getaran menghasilkan bunyi.',observed:true};
describe('session learning gates',()=>{
 it('requires observation, explanation and experiment before a challenge can finish',()=>{expect(complete('vibration',work)).toBe(true);for(const patch of [{prediction:''},{predictionReason:' '},{observed:false},{observation:' '},{explanation:' '}])expect(complete('vibration',{...work,...patch})).toBe(false);});
 it('requires both travel layouts and both Echo materials',()=>{expect(complete('travel',work)).toBe(false);expect(complete('travel',{...work,experiment:{equalTest:1,differentTest:1}})).toBe(true);expect(complete('echo',{...work,experiment:{hardTest:1}})).toBe(false);expect(complete('echo',{...work,experiment:{hardTest:1,softTest:1}})).toBe(true);});
 it('requires Sound Detective classification and mitigation',()=>{expect(complete('detective',work)).toBe(false);expect(complete('detective',{...work,classification:'both',mitigation:'Tutup tingkap supaya bunyi berkurang.'})).toBe(true);});
 it('returns field-specific errors for the active section',()=>{expect(stepIssues('vibration',blank(),0)).toEqual(['prediction','predictionReason']);expect(stepIssues('vibration',{...work,observed:false},1)).toEqual(['activity']);expect(stepIssues('detective',{...work,classification:'',mitigation:''},2)).toEqual(['classification','mitigation']);});
 it('models equal and farther travel consistently',()=>{expect(sameDistances([2,2,2,2])).toBe(true);expect(sameDistances([2,2,4,2])).toBe(false);expect(arrivalMs(4)).toBeCloseTo(2*arrivalMs(2));});
 it('has equivalent BM/EN labels and four mission descriptions',()=>{expect(Object.keys(TEXT.bm).sort()).toEqual(Object.keys(TEXT.en).sort());expect(Object.keys(FLOW_TEXT.bm).sort()).toEqual(Object.keys(FLOW_TEXT.en).sort());for(const language of ['bm','en'] as const){expect(Object.keys(MISSION_COPY[language])).toHaveLength(4);expect(FLOW_TEXT[language].stageNames.slice(0,3)).toHaveLength(3);}});
});
