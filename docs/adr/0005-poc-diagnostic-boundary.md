# ADR 0005 — POC diagnostic and preprocessing boundary

Date: 25 October 2026. Status: accepted for bounded POC only, not a product approval.

Context: no student UI or visual direction is approved, and no adult dataset has been supplied yet. Need observable capture, model and storage mechanisms without constructing the four-mission product.

Decision: vanilla TypeScript/Vite developer diagnostic, TensorFlow.js 4.22.0 pretrained `18w` base embedding plus a newly trained four-class head. No React shell or mission screens. Base model gives a 2000-element `dense_1` embedding; it is not an object classifier. Head training is possible only with explicitly imported adult event data. Generated waveform/artificial-vector fixture exists only for labelled software tests.

Shared file/live pipeline: PCM mono/resample 44.1kHz → Blackman 1024-point FFT → 43×232 dB spectrum → per-window normalization → frozen base embedding → learned softmax head → candidate score/margin/stability and signal checks. Three spaced windows cover a repeated 3-second action. This is not bit-equivalent to original AnalyserNode smoothing; transfer utility is an empirical open question. A stronger matching frontend can supersede this candidate if adult tests fail, through a versioned change and fresh holdout.

Consequences: local feasibility and lifecycle can be tested now; no sound-accuracy gate can pass without adult recordings and real two-device trials. Synthetic inference/timing is never substituted for the real dataset. Downloaded base weights remain ignored pending separate weight-redistribution license review; npm source licenses alone do not establish weight rights. Revisit packaging/licenses before any distribution.
