# Active delivery plan · 25 October 2026

This folder supersedes the 24 October plan where they differ. Historical files remain as decision history, not active requirements. Owner request: current Codex chat, continuing Music App Proposal (6adde4c9-cb6c-83ec-9c61-f24455714fd2). The existing private repository is reused to preserve its history.

## Concise PRD

AI SoundLab helps Year 4 pupils explain sound using observations, experiments and reasons. Audience: supervised pupils aged about 10, Science teachers and competition judges. BM is the default; optional English follows the same learning sequence. No musical performance grading, accounts, ranking or pupil database.

Four missions: Discover Vibration; Sound Travels; Echo Challenge; AI Sound Detective. Each follows predict → investigate → observe → explain → receive feedback → revise. Badges acknowledge evidence and revision, never official PBD mastery. Teacher demonstration mode uses explicitly labelled examples; student class mode captures each device's own anonymous work. A class code is an API access control, not class synchronization.

Success: pupils connect sound with vibration, predict propagation in all directions, explain reflection using an everyday example, and justify a context-sensitive sound classification and mitigation. AI gives a short evidence-specific formative response and one next question; it cannot award official mastery or replace teacher judgement.

POC evidence led to [ADR-0006](ADR-0006-grounded-feedback.md): the AI now selects a curriculum fact/question and a verbatim learner excerpt through Structured Outputs. The interface explicitly labels AI-selected guidance. Live v4 fixtures matched all 12 expected concepts once; teacher and physical-device gates remain pending. Source publication for free Pages was explicitly approved in the current chat.

## Phases and milestones

| Phase | Deliverable | Exit |
|---|---|---|
| P0 planning | This PRD, UX, architecture, stories, source and risk register | Versioned documents and recorded authorization |
| P1 bounded POC | Serverless proxy; two text-feedback interactions (M1/M4); local waveform, RMS and recording diagnostic; IndexedDB/export; tests/CI | Gate evidence in POC-REPORT.md |
| P2 product | Selected visual direction, all four interactive missions, BM/EN, badges, teacher/student modes | P1 security, live AI, science and device gates pass first |
| P3 release | Pages link, teacher guide, privacy notice, rehearsed fallback and submission check | Deployment account/visibility resolved and release checks pass |

No invented completion dates. Initial targets: P1 one development iteration plus owner/device validation; P2 two iterations; P3 one validation iteration. Competition deadline, form, eligibility and school permissions take priority over this estimate. Do not assume the event date is the submission deadline.

## POC scope and continuation

The old three-class TensorFlow training experiment is superseded. No training or automatic environmental identification in this phase. P1 implements a diagnostic workspace, not the final pupil interface. M2/M3 stay as UX specifications until gates pass. Today's user explicitly authorizes POC, subsequent full product **after gates pass**, CI and Pages deployment. Existing privacy/visibility preferences remain: repo stays private unless the owner authorizes public visibility.

Read [UX](UX.md), [architecture](ARCHITECTURE.md), [stories/tests/gates](VALIDATION.md), [sources/science](SCIENCE.md), [risks](RISKS.md), and [setup](../../SETUP.md). Measured status belongs in [POC report](POC-REPORT.md), not in target tables.
