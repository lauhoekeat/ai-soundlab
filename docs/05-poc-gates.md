# POC and decision gates

Original gate definitions from the planning baseline follow. POC approval was granted on 25 October; see [approval](approvals.md) and [current measured checkpoint](evidence/first-fit-2026-10-25.md). Software/initial-fit evidence does not pass real-device or independent accuracy gates. POC is capped at six focused hours; one two-hour recovery pass requires owner agreement if the cap is exhausted. A technical POC may use a minimal diagnostic harness after approval; a student-facing UI prototype additionally requires selected Product Design visuals. No full product scaffolding before POC review.

## POC scope and deliverables

Prove capture and stop/release behavior, three-class local inference with uncertainty, file-based sample inference, model bundling/offline loading and anonymous evidence save/reload on the actual teacher laptop plus a second device. Use adult sounds only. Do not build all four mission screens. Keep the same audio and preprocessing path for live and sample input or document measured differences.

Deliver a short POC report, frozen model/policy manifest, confusion matrix, trial log, timings, offline/network evidence, device/browser record and a ≤90s unedited capture showing success and failure handling. A result slide or mock screenshot alone is insufficient.

## Gate table

| Gate | Target evidence | Go | Conditional / no-go response |
|---|---|---|---|
| G0 Authorization and source checks | Approval ledger; actual device; rule/DSKP questions logged | Explicit owner POC approval and defined target device | Missing approval: stay planning; rules unknown: flag without claiming eligibility |
| G1 Capture feasibility | Five consecutive start/stop cycles on teacher laptop and second device; denied/no-device/pending cases | No stuck recording; stop/exit releases tracks within 1s; recovery works | Diagnose browser constraints; sample path does not count as live capture pass |
| G2 AI utility | Locked test ≥120 trials and live trials as data plan specifies | Locked target accuracy ≥85%, each class ≥75%; negative false acceptance ≤10%; live target accuracy ≥80% on each device and live negative false acceptance ≤10% | One bounded retune/class substitution, then fresh holdout. If still failed, no-go for claimed live AI product |
| G3 Responsiveness | Timed real-device runs | Warm post-capture display p95 ≤1.5s; capture 3s; initial model ready ≤15s on measured connection; visible progress | Reduce model/input cost; record timing definition and connection. Do not hide warm-only timings as cold start |
| G4 Offline and data boundary | Full asset cache; network disabled; restart; all sample paths; network inspection | Model/sample inference works offline, no audio leaves browser, versions match, no raw audio in exports | Fix asset/preprocessing dependencies. Recording-only replay is not offline inference |
| G5 Educational feasibility | Teacher review plus five supervised pairs if permitted | Four of five pairs complete M1 with ≤1 prompt; four of five distinguish AI suggestion from observation; teacher approves vibration explanation | Revise flow/copy; if pupils unavailable, record adult-only review and defer pupil claim |
| G6 Decision | Report + actual scope recommendation | Owner explicitly approves product phase after reviewing evidence | Conditional path names failed gates and reduced claim; no automatic continuation |

For p95 use at least 20 warm runs per device and report the measurement rule. Gate thresholds are engineering targets, not competition rules or general scientific benchmarks. The pilot sample is formative, not research validation.

## Branch decisions

GO: all technical gates pass and teacher signs content; present product approval request with measured evidence and schedule. Usability pilot pending may allow a conditional owner-approved build, but no public usability claim until checked.

CONDITIONAL: live model fails only in noisy rooms but sample-file inference genuinely works. Propose supervised single-station capture or sample-first AI mode with prominent labels; teacher verifies competition suitability. Owner approves revised scope before product work. Do not quietly redefine G2 to pass prerecorded examples.

NO-GO: no reproducible model, privacy/offline boundary fails, or repeated low utility. Stop classifier expansion; deliver a factual report and propose a different AI approach only through a new ADR/approval. A deterministic sound activity remains a possible teaching aid but must not be sold as a successful AI POC.

## Planned POC timebox

0–1h capture/device probe; 1–3h adult dataset and transfer-learning spike; 3–4.5h frozen tests/live trials; 4.5–5.5h offline/performance/storage checks; 5.5–6h report and decision. If data collection cannot meet independent test floors within six hours, classify evidence as incomplete and ask for bounded extension; do not lower thresholds retrospectively.
