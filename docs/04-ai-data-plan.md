# AI mechanism, data and honest claims

## What is AI here?

An adult-prepared transfer-learning sound classifier proposes one of three short non-speech classes: gentle clap, pencil tap and paper rustle. Add an explicit background/noise class and reject other/ambiguous sounds through a validated policy. The model may be wrong; pupils compare its suggestion with their prediction and physical evidence. Pitch, loudness measurement, propagation animation, echo delay and educational hints are deterministic processing or simulation, not additional AI.

Proposed mechanism: browser audio → sample-rate/FFT input required by the selected model → pretrained representation → trained classification head → score vector → fixed confidence/margin/stability checks → suggestion or “AI belum pasti”. Validate package support, preprocessing, class duration and inference cadence during POC. Do not treat an English speech-command model as an existing general environmental sound classifier. Training on our objects is required.

## Training and evaluation design (only after approval)

Use adult-created object sounds, not children's voices. Target four adult contributors, three devices and two rooms; record provenance by anonymous contributor/session/device/environment only. No names or speech. Plan approximately 60 independent source events per target class plus 120 background/unknown events. This is a POC starting budget, not a statistical sufficiency claim. An event, not an overlapping audio window, is the unit of separation.

Allocate whole recording sessions to train/development/locked test around 60/20/20. Maintain at least 20 locked test events per target class, recording more if the split cannot meet that floor. Add 60 locked unknown/background events including silence, fan, distant conversation not retained, mixed sounds and a sound outside known classes. For private speech-like test noise use licensed synthetic/nonidentifiable material; never store bystanders' speech. Ensure test contains a held-out contributor, device and room; report separately if constraints prevent this combination. The minimum locked test is 120 trials (3×20 targets + 60 negatives), with extra live venue-like trials below. Raw event splits and contributor separation must be auditable without uploading recordings.

Train/development may use repetition/augmentation; test events must be independent and never enter fitting, threshold selection or demonstration rehearsals. Split first, then window. Write an anonymous manifest with event ID, split, class, device/room/session IDs, clip duration, consent/license provenance and hash. Keep raw training data outside Git in an owner-controlled local folder; no committed pupil/voice recordings. Repository contains only model-approved artifacts, aggregate metrics and reproducibility notes, after license review.

Tune rejection threshold, top-two margin and stable-window count on development data only. Initial candidates might be score ≥0.80, margin ≥0.20 and three consistent windows, but these are hypotheses, not shipping constants. Silence/clipping check also needed: a high class score alone does not validate an input. Freeze policy/version before locked testing. If retuning follows a failure, create a new independent holdout and mark previous test as development evidence.

## Metrics

Report accepted correct target trials / all target trials as target accuracy, with unknown/rejected targets counted as failures. Report each class's correct rate; also report coverage and accepted-only precision so abstention cannot hide poor utility. Confusion matrix includes unknown. Negative false acceptance = negatives wrongly accepted as target / all negatives. List event counts and uncertainty; a small sample does not prove general performance. Report thresholds, room, device, browser, model hash and class balance.

Measure end-to-end prediction time from capture finish to displayed result (including stabilization) separately from capture duration and initial model load. Planned live trial: three target classes × ten new attempts on each of two devices = 60 attempts total in classroom-like noise; add 20 unknown/mixed attempts per device. No overlap with demonstrations. Failures and fallback usage are evidence, not deleted outliers.

## AI learning value and provenance

The assessment asks “What did the AI suggest?”, “What did you observe?” and “When should we distrust the result?”. Comparing a wrong suggestion with evidence is a valuable supported path. Never say the AI understands sound physics or grades scientific reasoning. The teacher's reviewed explanation rules are transparent.

Future model card must record purpose, classes, data collection, exclusions, split strategy, evaluation counts, per-device results, known failures, thresholds, model/base-model versions, hashes, all applicable licenses and intended limitations. All model-card fields remain unmeasured until POC. Student training is optional future work and cannot delay the core product.
