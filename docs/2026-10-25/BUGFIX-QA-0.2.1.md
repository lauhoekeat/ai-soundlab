# Classroom bug-fix QA - 0.2.1 - 26 October 2026

Issue: https://github.com/lauhoekeat/ai-soundlab/issues/21

## Report and repairs

The owner reported missing teacher classroom-code generation and internal wording in the classroom UI. Reproduced: Teacher mode offered only a pupil code input; no generation control existed. The AI result exposed its prompt version; audio metrics used RMS/dBFS and the download button exposed JSON terminology.

- Added protected Teacher mode > Manage class code. Existing private setup code verifies teacher access; generation produces a ten-character, two-hour pupil code with copy/expiry/replacement controls. Pupil credentials cannot mint codes. The private setup input clears on success/exit. See ADR-0007 for caps, hashed access storage, replacement/rotation and fail-closed behavior.
- Classroom BM/EN screens now say AI guidance, use plain graph explanations, friendly localized errors and Download evidence book. Technical prompt versions remain in engineering/export metadata, not rendered classroom results. Useful/harmful classifications sent for feedback use the selected classroom language.
- Mission 4 supports device-only audio files (10 MB, 60 seconds). Mission 1 deliberately has no import control: unrelated recordings are not ruler-vibration evidence. No automatic source identification or audio upload.
- Audio replacement/deletion resets the waveform. Playback explicitly pauses on replacement, deletion, background and activity exit. File selection can recover from invalid audio and can select a file again. Consent revocation/input changes cancel in-flight guidance without showing a stale connection error. Teacher requests cancel on exit.

## Observed validation

79 automated tests passed; strict types, production build and frontend provider-credential boundary passed. Real workerd/Durable Object checks passed: original 50-way paid quota reservation accepted exactly 7 under cap 7; concurrent classroom issuance accepted exactly 10 of 30 under cap 10. Fresh-stub persistence, replacement and teacher-key rotation passed. Mocked clock covers two-hour expiry. New tests cover teacher authentication, pupil mint rejection, hashed storage, guessing/issuance caps, storage failure, preflight, malformed JSON, streamed body caps, safe bilingual errors and code normalization.

Local browser target: http://127.0.0.1:5173/ai-soundlab/ using CUA in-app browser and documented Playwright locators. Browser plugin/skill not available; existing CUA browser used, no CLI browser fallback. Teacher flow: wrong setup code rejected with teacher-specific guidance > real setup verified > temporary code created > copy control succeeded > the generated code unlocked actual M1 and M4 feedback. Lowercase/hyphen pupil typing also returned real English guidance. No secret values captured in this report.

Three owner-provided M4A clips decoded and played locally (HTML media readyState 4, paused false, no media error): 8.320, 4.096604 and 3.157417 seconds. File identity was not inferred as science evidence. Invalid bytes, a file over 10 MB, and a valid 61-second WAV were rejected in English with no playback control; a valid M4A then recovered. No clips were committed. Audio payloads are not accepted by proxy schema; no independent packet trace is claimed.

M2 equal/different-distance trials and M3 hard/soft trials completed through actual controls. Evidence saved after required comparisons. Three student entries restored after reload, independently of two teacher examples. A downloaded JSON contained three entries with no classroom code or audio blob. Adult synthetic QA entries remain in the local browser; no pupil data was collected.

Responsive: desktop default and a 390x844 mobile target; mobile document client and scroll widths were both 375px with a 15px scrollbar. No document overflow. Teacher setup, Mission 4, file controls, AI guidance and notebook were inspected. Screenshots are parent-workspace outputs (teacher-fixed.png, teacher-mobile-fixed.png, bugfix-mobile.png), not committed audio or repository artifacts. A stale Vite websocket connection error was retained from before the local server restart; production console verification is recorded with publication below. No new physical-device microphone trial or pupil pilot is claimed.

Hosted proxy a4cc6988-143d-46e1-bec8-ba9f6ac979af deployed with backward-compatible feedback. Eight actual hosted boundary checks passed, including no/unlisted Origin, missing code, preflight, audio property, mission allowlist and body cap. No paid provider request from those invalid checks.

## Publication

Source PR and Pages release follow passing CI. Live product remains https://lauhoekeat.github.io/ai-soundlab/ . Publication is not competition registration, organizer eligibility approval, or a pupil-learning outcome claim.
