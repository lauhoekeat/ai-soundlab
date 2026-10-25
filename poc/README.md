# Bounded technical POC

Owner approved this diagnostic scope on 25 October 2026. This is not the pupil-facing application; do not build missions or deploy from this branch. See [approval](../docs/approvals.md), [gate definitions](../docs/05-poc-gates.md), [initial report](../docs/evidence/poc-2026-10-25.md) and [latest actual first fit](../docs/evidence/first-fit-2026-10-25.md).

## Local setup

Use Node 24 (tested 24.14.0) and npm. From this `poc/` directory:

```powershell
npm ci
npm run assets
npm run build
npm run preview -- --port 4173 --strictPort
```

Open http://127.0.0.1:4173 on this computer. `assets` downloads the official pretrained base model and creates a local SHA-256 manifest. Downloaded weights are ignored by Git; they are not a trained clap/tap/rustle head. Initial download needs a connection. Do not run this app by double-clicking HTML or opening a LAN HTTP address for mic use. No API key or cloud inference required.

Developer iteration: `npm run dev`. Offline preparation deliberately refuses a dev-source page. Stop the local server with Ctrl+C when finished. Keep this a loopback diagnostic; no hosting action is authorized.

## Probe workflow

1. Load base model; it should report ready without inventing object predictions.
2. Capture 3 seconds explicitly or select a local 3-second WAV. Repeat the same gentle action across the interval. Stop/cancel remains available. Nothing captures on page load. Physical device/noise tests require an adult at the Windows computer.
3. Import the adult dataset manifest and all listed WAV files. All audio processing is in memory; no raw audio storage/export. Do not provide real names or voices.
4. Train from **train** events only, then evaluate **development** events. Candidate thresholds are frozen in `src/policy.ts`; no tuner is exposed.
5. Locked test requires the planned event floors and held-out contributor/device/room. It consumes hashes before inference and refuses repeats. This is a local workflow guard, not tamper-proof research infrastructure. Changing model/policy after a locked test requires a fresh independent test set; clearing browser storage does not make an old holdout new.
6. Save/export numeric evidence. The user chooses export explicitly. Scores are not calibrated probabilities. Generic microphone RMS is not dB SPL. Storage errors are displayed, not treated as saved.

Training stores only the learned head weights and anonymous model metadata in IndexedDB. Reload the base and restore the head after restart. Live capture and WAV decoding both feed the same resampling, deterministic spectrum, embedding, head and rejection code. The live microphone may still apply device/OS processing; this must be measured separately.

## Adult dataset format

WAV filenames must be simple anonymous codes, e.g. `e001.wav`. Each source event must be independent; never split overlapping windows across train/development/test. Three-second mono/stereo WAVs are accepted; decoding downmixes and resamples to 44.1kHz; accepted duration 2.8–3.2 seconds. Keep raw files in an owner-controlled folder outside Git. See [data plan](../docs/04-ai-data-plan.md) for minimums, contributor/device/room split and privacy.

Example manifest structure (replace placeholders; this is not a recorded dataset):

```json
{
  "version": 1,
  "source": "adult-object",
  "attestation": "Adults only; object sounds; no pupil recordings; permission to use locally.",
  "events": [
    {"id":"e001","file":"e001.wav","label":"clap","split":"train","session":"s01","contributor":"a01","device":"d01","room":"r01","sha256":"REPLACE_WITH_FILE_SHA256"}
  ]
}
```

Allowed labels: `clap`, `pencil-tap`, `paper-rustle`, `background`, `unknown`. Unknown is development/test only; background is the fourth trained class. Manifest requires exact adult-use attestation, unique event/file/content hashes, pseudonymous codes and whole-session split assignment. Training additionally checks duplicate decoded PCM across all splits to catch exact re-encodings. Near-duplicates and dishonest metadata require human review.

For convenience, create `events.json` with this structure but omit `sha256`; put it beside the files. Then run the helper, supplying that path:

```powershell
node scripts/prepare-dataset.mjs "C:\path\to\adult-samples\events.json"
```

It writes `dataset-manifest.json` beside the descriptor and leaves the recordings unchanged. Only attest to material you actually have permission to use. Select the generated manifest and its WAV files in the diagnostic page.

Minimum 2 training events/class is only a software pipeline floor. It is **not** sufficient for accuracy claims. Locked test gate needs ≥20 independent events/target and ≥60 negatives; live gate needs 10 attempts/target/device plus 20 negatives/device on two devices. Read the complete plan before collecting the final dataset.

## Offline workflow

On the production preview, click Prepare offline shell + base assets. The worker hashes all base artifacts and caches the build dependency graph; a complete cache pointer is committed only after preparation succeeds. The status deliberately does not claim a validated classifier. Train/save a head separately; imported audio is never cached. Restart browser, disable network, load base, restore head and select a local WAV to verify actual inference. Adult source files and the exploratory head are local only, not bundled in Git.

The separate `/tests/fixture.html` page explicitly exposes software-test helpers. It is labelled synthetic and uses generated waveforms/artificial feature vectors only. It is included solely in this POC, not a future product. Its metrics must never enter the adult recording confusion matrix or competition performance claims.

## Tests

```powershell
npm test
npx playwright install chromium
npm run build
npm run test:browser
npm audit
```

Browser tests use Chromium headless with synthetic media and injected errors. They verify plumbing, not physical microphones. Browser plugin was not available in this session; regular Playwright is the recorded fallback under the frontend testing skill. Test screenshots and browser profiles are ignored locally; sanitized numeric results are copied to `docs/evidence/` for review.

Known design limitation: `blackman-dB-no-smoothing-radix2-43x232-v1` is not bit-equivalent to pretrained AnalyserNode smoothing. Three temporal windows are correlated and cover repeated actions; they are not independent trials. The transfer candidate may fail single-transient or noise tests. Any preprocessing change reopens model validation. No real object model/accuracy is provided until adult data is trained and independently evaluated.

## M4A probe update — 25 October

The file probe now accepts WAV or M4A supported by the browser decoder. It shows original decoded duration and lets the user choose an explicit three-second excerpt start. Short endings are zero-padded; crop/padding quantities are displayed and stored as numeric evidence. Raw files remain unchanged. M4A decoding was measured on the supplied files in Windows headless Chromium; do not assume every browser/codec combination works.

This is **probe intake only**. The training manifest still requires independent, explicitly prepared three-second WAV events; an excerpt does not become a new independent source or automatically enter train/test. Four initial files (one per class/unknown) do not meet the training/evaluation protocol. See the [adult intake report](../docs/evidence/adult-intake-2026-10-25.md).

If the same freshly rebuilt preview is already running locally, set `$env:POC_REUSE_SERVER='1'` before `npm run test:browser`; otherwise tests start their own server. This reuse is opt-in and should not be used against stale/unrelated pages. Normal test mode still refuses an occupied port.

## First actual head — 25 October

Nine owner-supplied M4As are now ingested. Eight were used for an exploratory train-only head: two sources per target and two different non-target noise sources (mixed fan/feet/talking and shower). Original Unknown stayed outside fitting as a diagnostic negative. No independent accuracy gate passed. The actual head restored and inferred offline after a browser process restart. See [first-fit report and model card](../docs/evidence/first-fit-2026-10-25.md) for source transformations, settings, hashes, fit-only results and next tests.

The trained head currently lives in the isolated local measurement browser profile; it is not automatically loaded in the owner's open in-app tab. To reproduce in that tab, import the local prepared manifest/WAV files and use the existing Train control. Raw data, voice audio and learned binaries are not published in this repository. The synthetic-fixture and real-recording measurement results remain explicitly separate.
