import {resample} from './features';
export class Capture {
  private generation = 0;
  private stream?: MediaStream;
  private context?: AudioContext;
  private timer?: ReturnType<typeof setTimeout>;
  private reject?: (reason: Error) => void;
  public state = 'idle';
  public lifecycle: {event: string; at: number}[] = [];
  constructor(private media: Pick<MediaDevices, 'getUserMedia'> = navigator.mediaDevices) {}
  private mark(event: string) {this.state = event; this.lifecycle.push({event, at: performance.now()});}
  stop() {
    this.generation++;
    clearTimeout(this.timer);
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = undefined;
    void this.context?.close().catch(() => {});
    this.context = undefined;
    this.reject?.(new DOMException('Capture cancelled', 'AbortError'));
    this.reject = undefined;
    this.mark('stopped');
  }
  async record(): Promise<Float32Array> {
    if (!['idle', 'stopped', 'error'].includes(this.state)) throw Error('Capture already active');
    const id = ++this.generation;
    this.mark('permission-pending');
    // Context construction/resume stays inside the explicit user action.
    const context = new AudioContext({sampleRate: 44100});
    this.context = context;
    try {
      await context.resume();
      if (id !== this.generation) throw new DOMException('Cancelled', 'AbortError');
      const cancelled = new Promise<never>((_, reject) => {this.reject = reject;});
      const permission = this.media.getUserMedia({audio: {channelCount: 1, echoCancellation: false, noiseSuppression: false, autoGainControl: false}, video: false});
      // Cancelling a browser prompt cannot dismiss the prompt itself. Release any
      // late grant, while returning control immediately to the diagnostic page.
      void permission.then(stream => {if (id !== this.generation) stream.getTracks().forEach(track => track.stop());}, () => {});
      const stream = await Promise.race([permission, cancelled]);
      if (id !== this.generation) {stream.getTracks().forEach(track => track.stop()); throw new DOMException('Late permission result cancelled', 'AbortError');}
      this.stream = stream;
      await Promise.race([context.audioWorklet.addModule('/pcm-worklet.js'), cancelled]);
      if (id !== this.generation) throw new DOMException('Cancelled', 'AbortError');
      const source = context.createMediaStreamSource(stream);
      const node = new AudioWorkletNode(context, 'pcm-capture');
      const muted = context.createGain(); muted.gain.value = 0;
      source.connect(node); node.connect(muted); muted.connect(context.destination);
      this.mark('capturing');
      const pcm = await new Promise<Float32Array>((resolve, reject) => {
        const chunks: Float32Array[] = [];
        this.reject = reject;
        node.port.onmessage = event => {if (id === this.generation) chunks.push(event.data);};
        this.timer = setTimeout(() => {
          this.reject = undefined;
          const total = chunks.reduce((n, chunk) => n + chunk.length, 0);
          const result = new Float32Array(total); let offset = 0;
          for (const chunk of chunks) {result.set(chunk, offset); offset += chunk.length;}
          resolve(result);
        }, 3000);
      });
      if (id !== this.generation) throw new DOMException('Cancelled', 'AbortError');
      return resample(pcm, context.sampleRate);
    } catch (error) {
      if (id === this.generation) this.mark('error');
      throw error;
    } finally {
      if (id === this.generation) this.stop();
      else if (context.state !== 'closed') void context.close().catch(() => {});
    }
  }
}
export async function decode(file: File): Promise<Float32Array> {
  if (file.size > 10_000_000) throw Error('File exceeds 10 MB');
  const context = new AudioContext({sampleRate: 44100});
  try {
    const buffer = await context.decodeAudioData(await file.arrayBuffer());
    const mono = new Float32Array(buffer.length);
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const samples = buffer.getChannelData(channel);
      for (let i = 0; i < mono.length; i++) mono[i] += samples[i] / buffer.numberOfChannels;
    }
    return resample(mono, buffer.sampleRate);
  } finally {await context.close();}
}
