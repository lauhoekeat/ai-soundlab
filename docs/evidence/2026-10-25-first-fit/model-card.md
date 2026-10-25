# Model card — first exploratory object head

Status: locally trained POC; independent validation NOT RUN; no deployment or redistribution.

Purpose: propose clap, pencil tap or paper rustle and reject non-target noise. Not speech recognition, identity recognition, calibrated sound-level measurement, science grading or a validated classroom classifier.

Base: official TensorFlow speech-commands v0.4 browser_fft 18w, real dense_1 2000-element embeddings. Base source artifact hashes are in the earlier base manifest. Frontend: `blackman-dB-no-smoothing-radix2-43x232-v1`, shared file/live PCM path; not bit-equivalent to upstream AnalyserNode smoothing. Frozen base, learned four-class softmax head.

Data: 8 owner-supplied parent files, 2 per class, transformed to documented 3-second excerpts. 24 correlated temporal windows; not 24 independent events. New noise sources are mixed fan/feet/talking and shower; no confirmed clean silence/fan-only source. Exact contributor/device/room/session for second batch unconfirmed. Owner supplied files in adult-only POC context; no pupil recordings requested. No transcription or identity inference. All 8 records train-only; no independent validation/test. Original mixed Unknown is one excluded-from-fitting development probe in the same general condition, not a locked holdout.

Training: Adam 0.001, seed 20261025, 25 epochs, batch size 16, shuffle false; no reported hyperparameter search or policy retune. Candidate thresholds unchanged: score 0.80, top-two margin 0.20, three stable windows, RMS/clipping checks. Scores are not calibrated probabilities.

Head SHA-256 (canonical numeric weight serialization): `3a04a3458fa0522bb3e3806206d67f7d5e352db2797ce112f1e532992b5eb624`. Exact base/head/manifest metadata is in first-fit.json. Model weights remain in a local isolated browser profile, not Git. Source WAV/M4A copies also remain outside Git.

Observed fit: all 6 target training recordings replayed to their fitted class; both noise training recordings rejected; the first 3 seconds of original Unknown rejected. These are fit diagnostics, not accuracy. Independent confusion/coverage/false-acceptance matrix is absent. Full browser restart offline restored the actual head and inferred the reused training clap. Warm repeated clap compute p95 113.9 ms over 20 runs in headless Chromium 145.0.7632.6 on Windows; excludes capture/decode/rendering and is not a real two-device timing gate.

Limitations: very small same-condition corpus, uncertain per-file metadata, one environmental example per noise type, padding/crop, correlated stability windows, no held-out device/room/contributor, no live classroom noise or physical microphone/user-browser verification, no teacher/pupil validation. Unknown example rejection does not establish arbitrary speech/noise robustness. More data may change all results.

Rights: user supplied recordings for local POC; no permission to redistribute them is assumed. TF.js/FFT source licenses are recorded in initial report. Separate pretrained-weight redistribution rights remain unresolved; no binary distribution occurs here. Product development and deployment remain unapproved.
