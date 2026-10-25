import { useEffect, useRef, useState } from 'react';
import { parseInput, type FeedbackInput, type FeedbackResult, type Mission } from '../../shared/contract';
import { startCapture, type Capture } from './audio';
import { clearEvidence, readEvidence, saveEvidence, type Evidence } from './storage';
import { getFeedback } from './client';

const empty = (mission: Mission): FeedbackInput => ({ mission, language: 'bm', observation: '', explanation: '', mitigation: '' });
export function Diagnostic() {
  const [input, setInput] = useState<FeedbackInput>(() => empty('vibration'));
  const [mode, setMode] = useState<'student' | 'teacher'>('student');
  const [code, setCode] = useState(''); const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('Sedia. Mikrofon belum diaktifkan.');
  const [recording, setRecording] = useState(false); const [pending, setPending] = useState(false);
  const [metrics, setMetrics] = useState({ rms: 0, dbfs: -96 });
  const [audio, setAudio] = useState(''); const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [records, setRecords] = useState<Evidence[]>([]); const [busy, setBusy] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null); const capture = useRef<Capture | null>(null);
  const audioAbort = useRef<AbortController | null>(null); const requestAbort = useRef<AbortController | null>(null);
  const audioUrl = useRef(''); const mounted = useRef(true); const recordingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const stop = () => { audioAbort.current?.abort(); capture.current?.stop(); capture.current = null; clearTimeout(recordingTimer.current); setRecording(false); setPending(false); };
  useEffect(() => {
    mounted.current = true;
    void readEvidence().then(setRecords).catch(e => setStatus(e.message));
    const hide = () => { if (document.hidden) { stop(); setStatus('Rakaman dihentikan apabila tab disembunyikan.'); } };
    const pagehide = () => stop();
    document.addEventListener('visibilitychange', hide); window.addEventListener('pagehide', pagehide);
    return () => { mounted.current = false; stop(); requestAbort.current?.abort(); URL.revokeObjectURL(audioUrl.current); document.removeEventListener('visibilitychange', hide); window.removeEventListener('pagehide', pagehide); };
  }, []);
  async function begin() {
    stop(); const controller = new AbortController(); audioAbort.current = controller;
    URL.revokeObjectURL(audioUrl.current); audioUrl.current = ''; setAudio('');
    setPending(true); setStatus('Benarkan mikrofon. Jangan rakam percakapan atau maklumat peribadi.');
    try {
      const active = await startCapture(measurement => {
        if (!mounted.current) return;
        setMetrics({ rms: measurement.rms, dbfs: measurement.dbfs });
        const ctx = canvas.current?.getContext('2d');
        if (!ctx || !canvas.current) return;
        const { width, height } = canvas.current;
        ctx.clearRect(0, 0, width, height); ctx.strokeStyle = '#006b68'; ctx.lineWidth = 2; ctx.beginPath();
        for (let x = 0; x < width; x++) { const y = height / 2 - measurement.samples[Math.floor(x / width * measurement.samples.length)] * height / 2; if (!x) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
        ctx.stroke();
      }, blob => {
        if (!mounted.current || audioAbort.current !== controller) return;
        URL.revokeObjectURL(audioUrl.current); audioUrl.current = URL.createObjectURL(blob); setAudio(audioUrl.current);
      }, controller.signal);
      if (controller.signal.aborted || !mounted.current) { active.stop(); return; }
      capture.current = active; setRecording(true); setPending(false); setStatus('Merakam secara setempat, maksimum 5 saat.');
      recordingTimer.current = setTimeout(() => { stop(); setStatus('Rakaman selesai. Audio kekal pada tab ini sahaja.'); }, 5000);
    } catch (e) { if (audioAbort.current === controller && mounted.current) { setPending(false); setStatus(e instanceof Error ? e.message : 'Mikrofon gagal.'); } }
  }
  function changeMission(mission: Mission) { stop(); requestAbort.current?.abort(); setBusy(false); setInput(empty(mission)); setFeedback(null); URL.revokeObjectURL(audioUrl.current); audioUrl.current = ''; setAudio(''); setMetrics({ rms: 0, dbfs: -96 }); setStatus('Misi ditukar. Tulis pemerhatian baharu.'); }
  function update(key: keyof FeedbackInput, value: string) { setInput(i => ({ ...i, [key]: value })); setFeedback(null); requestAbort.current?.abort(); setBusy(false); }
  async function ask() {
    if (!consent) { setStatus('Beri persetujuan untuk menghantar teks sahaja.'); return; }
    let checked: FeedbackInput;
    try { checked = parseInput(input); } catch { setStatus('Lengkapkan pemerhatian, penjelasan dan cadangan (Misi 4).'); return; }
    requestAbort.current?.abort(); const controller = new AbortController(); requestAbort.current = controller;
    setBusy(true); setFeedback(null); setStatus('Menunggu AI. Audio tidak dihantar.');
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const result = await getFeedback(checked, code, controller.signal);
      if (requestAbort.current === controller && !controller.signal.aborted) { setFeedback(result); setStatus('Maklum balas AI diterima. Semak bersama guru.'); }
    } catch (e) { if (requestAbort.current === controller) setStatus(controller.signal.aborted ? 'Permintaan dibatalkan atau tamat masa. Jawapan masih tersedia.' : e instanceof Error ? e.message : 'Rangkaian gagal.'); }
    finally { clearTimeout(timeout); if (requestAbort.current === controller) setBusy(false); }
  }
  async function save() {
    try {
      const checked = parseInput(input);
      const item: Evidence = { id: crypto.randomUUID(), savedAt: new Date().toISOString(), input: checked, feedback, source: mode === 'teacher' ? 'teacher-example' : 'student-observation' };
      await saveEvidence(item); setRecords(await readEvidence()); setStatus('Bukti teks disimpan pada peranti ini. Tiada audio disimpan.');
    } catch (e) { setStatus(e instanceof Error && e.message !== 'invalid_schema' ? e.message : 'Lengkapkan jawapan sebelum menyimpan.'); }
  }
  function exportData() {
    const blob = new Blob([JSON.stringify({ version: 1, evidence: records }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'soundlab-bukti.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <main>
    <header><h1>AI SoundLab</h1><p>POC diagnostik untuk guru · Belum produk murid lengkap</p></header>
    <p>Kenali Getaran (6.1.1) dan Detektif Bunyi AI (6.1.4–6.1.5). Misi 2 dan 3 belum dibina.</p>
    <fieldset><legend>Persediaan ujian</legend>
      <label>Mod<select value={mode} onChange={e => { changeMission(input.mission); setMode(e.target.value as typeof mode); }}><option value="student">Kelas murid · peranti ini sahaja</option><option value="teacher">Demonstrasi guru · contoh berlabel</option></select></label>
      <label>Misi<select value={input.mission} onChange={e => changeMission(e.target.value as Mission)}><option value="vibration">1 · Kenali Getaran</option><option value="detective">4 · Detektif Bunyi AI</option></select></label>
      <label>Bahasa maklum balas<select value={input.language} onChange={e => update('language', e.target.value)}><option value="bm">Bahasa Melayu</option><option value="en">English feedback</option></select></label>
      <p>Antara muka diagnostik BM. Terjemahan penuh ialah kerja fasa produk.</p>
    </fieldset>
    <section><h2>1. Perhatikan dan dengar</h2><p>{input.mission === 'vibration' ? 'Petik pembaris dengan perlahan. Bahagian manakah yang bergetar? Bandingkan dengan keadaan senyap pada peranti yang sama.' : 'Pilih bunyi yang selamat. Labelkan sumber sendiri. AI tidak mendengar atau mengenal pasti audio ini.'}</p>
      <button onClick={() => void begin()} disabled={recording || pending}>Benarkan &amp; rakam 5 saat</button>{' '}<button onClick={() => { stop(); setStatus('Rakaman dihentikan. Mikrofon dilepaskan.'); }} disabled={!recording && !pending}>Henti mikrofon</button>
      <figure><canvas ref={canvas} width="760" height="150" role="img" aria-label="Bentuk gelombang masa mikrofon, amplitud relatif"/><figcaption>Masa → · amplitud relatif ↕ · {recording ? 'Mikrofon aktif' : 'Mikrofon tidak aktif'}</figcaption></figure>
      <p>RMS relatif: {metrics.rms.toFixed(3)} · {metrics.dbfs.toFixed(1)} dBFS. Ini bukan dB SPL atau ukuran keselamatan pendengaran.</p>
      {audio ? <div><audio controls src={audio} aria-label="Rakaman setempat"/><button onClick={() => { URL.revokeObjectURL(audioUrl.current); audioUrl.current = ''; setAudio(''); }}>Padam audio</button></div> : <p>Jika mikrofon tidak tersedia, terangkan pemerhatian sendiri atau gunakan contoh guru yang berlabel.</p>}
    </section>
    <section><h2>2. Terangkan bukti</h2>
      {mode === 'teacher' ? <button onClick={() => { setInput(input.mission === 'vibration' ? { ...empty('vibration'), observation: 'Pembaris bergerak ulang-alik selepas dipetik.', explanation: 'Pembaris bergetar dan menghasilkan bunyi.' } : { ...empty('detective'), observation: 'Label contoh guru: hon kenderaan di luar kelas.', explanation: 'Hon memberi amaran tetapi bunyi berulang mengganggu tumpuan.', mitigation: 'Kurangkan penggunaan hon berhampiran sekolah.' }); setFeedback(null); }}>Isi contoh guru · bukan ukuran langsung</button> : null}
      <label>{input.mission === 'detective' ? 'Label sumber & konteks (anda tentukan)' : 'Apakah yang anda perhatikan?'}<textarea maxLength={600} value={input.observation} onChange={e => update('observation', e.target.value)}/></label>
      <label>{input.mission === 'detective' ? 'Berfaedah, memudaratkan atau kedua-duanya? Beri sebab.' : 'Apakah yang bergetar dan bagaimana bunyi terhasil?'}<textarea maxLength={600} value={input.explanation} onChange={e => update('explanation', e.target.value)}/></label>
      {input.mission === 'detective' ? <label>Cadangan mengurangkan pencemaran bunyi & sebab<textarea maxLength={400} value={input.mitigation} onChange={e => update('mitigation', e.target.value)}/></label> : null}
    </section>
    <section><h2>3. Uji maklum balas AI</h2><p>Jangan masukkan nama, sekolah atau maklumat peribadi. Teks dihantar kepada pelayan guru dan OpenAI. Audio tidak dihantar. Maklum balas mungkin salah; semak dengan guru.</p>
      <label>Kod kelas (bukan API key)<input type="password" value={code} maxLength={128} autoComplete="off" onChange={e => setCode(e.target.value)}/></label>
      <label className="check"><input type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); if (!e.target.checked) { requestAbort.current?.abort(); setBusy(false); } }}/>Saya bersetuju menghantar teks sahaja untuk maklum balas AI.</label>
      <button onClick={() => void ask()} disabled={busy || !consent || !code}>Dapatkan maklum balas AI</button>
      <p>AI memilih panduan daripada bank maklum balas kurikulum berdasarkan jawapan anda. Ayat sains disediakan oleh aplikasi; AI tidak mengenal pasti audio.</p>
      {feedback ? <blockquote><strong>Panduan dipilih AI · {feedback.promptVersion}</strong><p>{feedback.feedback}</p></blockquote> : null}
    </section>
    <p role="status" className="status">{status}</p>
    <section><h2>4. Bukti percubaan · {records.length} rekod</h2><p>Teks disimpan dalam IndexedDB peranti ini. Audio dan kod kelas tidak disimpan. Kosongkan sebelum kumpulan seterusnya.</p>
      <button onClick={() => void save()}>Simpan bukti teks</button>{' '}<button disabled={!records.length} onClick={exportData}>Eksport JSON</button>{' '}<button disabled={!records.length} onClick={() => void clearEvidence().then(() => { setRecords([]); setStatus('Rekod tempatan dipadam. Fail eksport perlu dipadam secara berasingan.'); }).catch(e => setStatus(e.message))}>Padam semua rekod</button>
      <ul>{records.map(r => <li key={r.id}>{r.input.mission} · {r.source === 'teacher-example' ? 'Contoh guru' : 'Pemerhatian murid'} · {r.input.observation} · {r.feedback ? 'Dengan AI' : 'Tanpa AI'}</li>)}</ul>
    </section>
  </main>;
}
