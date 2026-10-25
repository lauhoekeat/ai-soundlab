import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { startCapture } from '../src/poc/audio';
describe('microphone lifetime (synthetic API tests, not device proof)', () => {
  const stopTrack = vi.fn(); const closeContext = vi.fn(async () => {});
  const stream = { getTracks: () => [{ stop: stopTrack }] } as unknown as MediaStream;
  const getUserMedia = vi.fn(async () => stream);
  beforeEach(() => {
    vi.useFakeTimers(); vi.clearAllMocks(); getUserMedia.mockImplementation(async () => stream);
    class Context {
      resume = async () => {}; close = closeContext;
      createMediaStreamSource = () => ({ connect: () => {} });
      createAnalyser = () => ({ fftSize: 2048, getFloatTimeDomainData: (a: Float32Array) => a.fill(0.5) });
    }
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } });
    vi.stubGlobal('window', { AudioContext: Context }); vi.stubGlobal('AudioContext', Context);
    vi.stubGlobal('MediaRecorder', undefined);
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1)); vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
  it('five start/stop cycles release every track/context and report relative data', async () => {
    const frame = vi.fn();
    for (let i = 0; i < 5; i++) { const capture = await startCapture(frame, vi.fn(), new AbortController().signal); capture.stop(); capture.stop(); }
    expect(stopTrack).toHaveBeenCalledTimes(5); expect(closeContext).toHaveBeenCalledTimes(5); expect(frame.mock.calls[0][0].rms).toBe(0.5);
  });
  it('automatically releases capture after five seconds', async () => { await startCapture(vi.fn(), vi.fn(), new AbortController().signal); await vi.advanceTimersByTimeAsync(5001); expect(stopTrack).toHaveBeenCalledOnce(); });
  it('abort stops active capture and cancels animation', async () => { const controller = new AbortController(); await startCapture(vi.fn(), vi.fn(), controller.signal); controller.abort(); expect(stopTrack).toHaveBeenCalledOnce(); expect(cancelAnimationFrame).toHaveBeenCalled(); });
  it('late permission after abort releases the stream without starting audio', async () => {
    let resolve!: (s: MediaStream) => void;
    getUserMedia.mockImplementationOnce(() => new Promise<MediaStream>(r => { resolve = r; }));
    const controller = new AbortController(); const result = startCapture(vi.fn(), vi.fn(), controller.signal);
    const rejection = expect(result).rejects.toThrow('dibatalkan'); controller.abort(); await rejection;
    resolve(stream); await Promise.resolve(); expect(stopTrack).toHaveBeenCalledOnce(); expect(closeContext).not.toHaveBeenCalled();
  });
  it('pending permission times out and stops a late stream', async () => {
    let resolve!: (s: MediaStream) => void;
    getUserMedia.mockImplementationOnce(() => new Promise<MediaStream>(r => { resolve = r; }));
    const result = startCapture(vi.fn(), vi.fn(), new AbortController().signal);
    const rejection = expect(result).rejects.toThrow('belum diberi'); await vi.advanceTimersByTimeAsync(15001); await rejection;
    resolve(stream); await Promise.resolve(); expect(stopTrack).toHaveBeenCalledOnce();
  });
  it('denied permission creates no context', async () => { getUserMedia.mockRejectedValueOnce(new DOMException('Permission denied', 'NotAllowedError')); await expect(startCapture(vi.fn(), vi.fn(), new AbortController().signal)).rejects.toThrow('Permission denied'); expect(closeContext).not.toHaveBeenCalled(); });
  it('recorder negotiates supported MIME and returns a local blob only', async () => {
    let instance: Recorder;
    class Recorder {
      static isTypeSupported = (type: string) => type === 'audio/mp4';
      state = 'inactive'; mimeType = 'audio/mp4'; ondataavailable?: (event: { data: Blob }) => void; onstop?: () => void;
      constructor(_stream: MediaStream, options: { mimeType: string }) { expect(options.mimeType).toBe('audio/mp4'); instance = this; }
      start() { this.state = 'recording'; }
      stop() { this.state = 'inactive'; this.ondataavailable?.({ data: new Blob(['test'], { type: this.mimeType }) }); this.onstop?.(); }
    }
    vi.stubGlobal('MediaRecorder', Recorder); const audio = vi.fn();
    const capture = await startCapture(vi.fn(), audio, new AbortController().signal); capture.stop();
    expect(instance!.state).toBe('inactive'); expect(audio).toHaveBeenCalledOnce(); expect((audio.mock.calls[0][0] as Blob).type).toBe('audio/mp4');
  });
});
