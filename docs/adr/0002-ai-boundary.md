# ADR 0002 — Local classifier and transparent uncertainty

Date: 24 October 2026. Status: PROPOSED; validate G2 and licenses.

Context: the product must demonstrate meaningful AI with a fast, reliable teaching flow and no pupil voice dependency.

Decision: transfer-learning candidate using TensorFlow.js for three adult-trained object sounds, background class and rejection policy. Only M1 claims model inference. M2/M3 simulations and M4 teaching rules remain explicitly deterministic. No generative tutor, speech transcription or automatic science grading.

Alternatives: cloud multimodal service adds network, credentials, latency and audio-data handling; amplitude thresholds alone are not AI; broad environmental classifiers may save training time but create model-size/class-fit risks. Compare a licensed alternative only if bounded POC fails and owner approves an ADR change.

Consequences: dataset/provenance and unknown rejection are mandatory; general classroom/environment recognition is not promised. Pupil disagreement with the AI is supported. Model failure triggers conditional/no-go review, not disguised simulation.
