import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { echoDelay } from '../shared/contract';
import { echoDemoSeconds, ECHO_LEVELS, playEchoDemo } from '../src/lab/echo-audio';
describe('echo sound and model timing',()=>{
  const starts:number[]=[],volumes:number[]=[];
  const close=vi.fn(async()=>{}),resume=vi.fn(async()=>{});
  beforeEach(()=>{
    vi.useFakeTimers();starts.length=0;volumes.length=0;close.mockClear();resume.mockReset();resume.mockResolvedValue();
    class Context {
      currentTime=0;destination={};close=close;resume=resume;
      createOscillator=()=>({frequency:{value:0},connect:()=>{},start:(at:number)=>starts.push(at),stop:()=>{}});
      createGain=()=>({connect:()=>{},gain:{setValueAtTime:()=>{},linearRampToValueAtTime:(volume:number)=>volumes.push(volume),exponentialRampToValueAtTime:()=>{}}});
    }
    vi.stubGlobal('AudioContext',Context);
  });
  afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers();});
  it('keeps the real 2d/343 delay and uses a constant slower scale for both sound and animation',()=>{
    expect(echoDelay(5)*1000).toBeCloseTo(29.1545);expect(echoDemoSeconds(5)).toBeCloseTo(echoDelay(5)*30);
    expect(echoDemoSeconds(10)).toBeCloseTo(echoDemoSeconds(5)*2);
  });
  it('schedules the same return time for both materials with a weaker curtain return',async()=>{
    for(const surface of ['hard','soft'] as const){
      const operation=playEchoDemo(5,surface,0,new AbortController().signal);await Promise.resolve();
      const offset=surface==='hard'?0:2;
      expect(starts[offset]).toBeCloseTo(0.03);expect(starts[offset+1]).toBeCloseTo(0.03+echoDemoSeconds(5));
      expect(volumes[offset]).toBe(ECHO_LEVELS.original);expect(volumes[offset+1]).toBe(ECHO_LEVELS[surface]);
      await vi.advanceTimersByTimeAsync((echoDemoSeconds(5)+0.21)*1000);await operation;
    }
    expect(ECHO_LEVELS.soft).toBeLessThan(ECHO_LEVELS.hard);expect(close).toHaveBeenCalledTimes(2);
  });
  it('resumes only the remaining return and abort closes sound before the scheduled reflection',async()=>{
    const controller=new AbortController(),operation=playEchoDemo(40,'hard',0.5,controller.signal);await Promise.resolve();
    expect(starts).toHaveLength(1);expect(starts[0]).toBeCloseTo(0.03+echoDemoSeconds(40)*0.5);
    controller.abort();await operation;expect(close).toHaveBeenCalledOnce();expect(vi.getTimerCount()).toBe(0);
  });
  it('releases a context even if cancellation happens while audio startup is pending',async()=>{
    let ready!:()=>void;resume.mockImplementationOnce(()=>new Promise<void>(r=>{ready=r;}));
    const controller=new AbortController(),operation=playEchoDemo(5,'hard',0,controller.signal);controller.abort();
    expect(close).toHaveBeenCalledOnce();ready();await operation;expect(starts).toHaveLength(0);
  });
  it('cleans up and reports playback failure instead of pretending sound started',async()=>{
    resume.mockRejectedValueOnce(new Error('audio blocked'));
    await expect(playEchoDemo(5,'hard',0,new AbortController().signal)).rejects.toThrow('blocked');expect(close).toHaveBeenCalledOnce();
  });
});
