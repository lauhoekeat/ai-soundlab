import { dbfs, rms } from '../../shared/contract';
export interface Measurement { rms: number; dbfs: number; samples: Float32Array; }
export interface Capture { stop: () => void; }
export async function startCapture(onFrame: (m: Measurement) => void, onAudio: (blob: Blob) => void, signal: AbortSignal): Promise<Capture> {
  if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) throw new Error('Mikrofon/Web Audio tidak disokong. Gunakan Chrome/Safari terkini pada HTTPS atau localhost.');
  // Permission can remain pending indefinitely; late streams are always released.
  const permission = navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
  let timer: ReturnType<typeof setTimeout>;
  let abortListener: () => void;
  const cancellation = new Promise<never>((_, reject) => {
    abortListener = () => reject(new Error('Rakaman dibatalkan.'));
    signal.addEventListener('abort', abortListener, { once: true });
    timer = setTimeout(() => reject(new Error('Kebenaran mikrofon belum diberi. Cuba semula.')), 15000);
  });
  let stream: MediaStream;
  try {
    if (signal.aborted) throw new Error('Rakaman dibatalkan.');
    stream = await Promise.race([permission, cancellation]);
  } catch (error) {
    void permission.then(s => s.getTracks().forEach(t => t.stop())).catch(() => {});
    throw error;
  } finally { clearTimeout(timer!); signal.removeEventListener('abort', abortListener!); }
  if (signal.aborted) { stream.getTracks().forEach(t => t.stop()); throw new Error('Rakaman dibatalkan.'); }
  let context: AudioContext | undefined;
  let recorder: MediaRecorder | undefined;
  let frame = 0, stopped = false;
  let safetyTimer: ReturnType<typeof setTimeout>;
  const parts: Blob[] = [];
  const stop = () => {
    if (stopped) return;
    stopped = true; clearTimeout(safetyTimer); cancelAnimationFrame(frame);
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    stream.getTracks().forEach(t => t.stop());
    if (context) void context.close().catch(() => {});
    signal.removeEventListener('abort', stop);
  };
  try {
    context = new AudioContext(); await context.resume();
    if (signal.aborted) { stop(); throw new Error('Rakaman dibatalkan.'); }
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser(); analyser.fftSize = 2048; source.connect(analyser);
    const values = new Float32Array(analyser.fftSize);
    const update = () => {
      if (stopped) return;
      analyser.getFloatTimeDomainData(values);
      const level = rms(values);
      onFrame({ rms: level, dbfs: dbfs(level), samples: values });
      frame = requestAnimationFrame(update);
    };
    if (typeof MediaRecorder !== 'undefined') {
      const mime = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus'].find(t => MediaRecorder.isTypeSupported(t));
      recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      recorder.ondataavailable = event => { if (event.data.size && parts.reduce((n, b) => n + b.size, 0) + event.data.size <= 2_000_000) parts.push(event.data); };
      recorder.onstop = () => { if (parts.length) onAudio(new Blob(parts, { type: recorder!.mimeType })); };
      recorder.start(250);
    }
    signal.addEventListener('abort', stop, { once: true });
    safetyTimer = setTimeout(() => { stop(); }, 5000);
    update(); return { stop };
  } catch (error) { stop(); throw error; }
}
