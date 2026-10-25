# Measured POC report · 25 October 2026

Technical POC implemented. Product continuation remains gated by human/device review. All evidence uses synthetic adult text; no pupil recordings/data collected.

**Current decision: GO for product development**, 25 October 2026. Owner reported both teacher device and physical phone passed the requested audio checks, and Science-teacher review was approved. These resolve the development gate; final hosted integration and release regression remain open. This report distinguishes owner-reported evidence from checks observed by the agent.

| Gate | Status | Evidence |
|---|---|---|
| G0 plan/authorization | PASS | Current user request recorded in docs/approvals.md; active plan and source mapping committed |
| G1 secure runtime | AUTOMATED PASS | 63 tests, strict types/build/bundle checks, zero npm audit findings; actual local workerd boots; 50 concurrent durable reservations under cap 7 → exactly 7 accepted/43 rejected, fresh stub retains cap |
| G2 two live AI interactions | LOCAL PASS | Owner configured existing ignored server key. Both M1/M4 real OpenAI calls succeeded. Current v4: 12/12 synthetic BM/EN fixtures HTTP 200, including both learning paths; 0.915–2.093 seconds in this small run |
| G3 audio/devices/privacy | DEVELOPMENT PASS; TRACE FOLLOW-UP | Seven synthetic lifecycle tests pass. Owner reports teacher device and physical phone passed five cycles, playback and leave-page stop. No audio accepted by proxy schema. Device models/versions, denied flow on physical devices and separate network trace remain release follow-up |
| G4 science | APPROVED BY OWNER-REPORTED TEACHER REVIEW | Exact BM source checked; v4 matched 12 concepts. Owner answered Science review “Reviewed and approved”; no broad accuracy claim or pupil outcome claim |
| G5 mobile/usability | DEVELOPMENT PASS; PUPIL PILOT NOT RUN | Narrow browser software checks plus owner-reported physical-phone pass. No pupil trial or exact device-version evidence supplied |
| G6 continuation/release | GO FOR PRODUCT; RELEASE PENDING | Concept 1 selected and development gates cleared by owner reports; hosted proxy/final product regression still required before competition-ready claim |

Do not infer GO from mocks/builds. No environmental sound classification accuracy claim. No pupil data collected. Cloudflare login absent at initial check; GitHub authenticated as lauhoekeat; existing private repository reused, not recreated. Pages not configured at initial check.

## Model evidence and failures preserved

- v1 initial connection: M1 3636ms; M4 1792ms. M4 inferred an unsupported horn mechanism; not accepted as science pass.
- [v2 12-case responses](science-smoke-results-v2.json): radar contradiction and excessive questions. This is failure evidence, not current product output.
- [v3 partial responses](science-smoke-results-v3.json): stricter free prose/output check failed fixture 3 (HTTP 502); no silent retry/fallback.
- [v4 current responses](science-smoke-results-v4.json): 12/12 HTTP 200 and expected concept matches by engineering review. Exact frozen fixtures are synthetic, small, and observed once; not a general accuracy estimate. Model `gpt-4.1-mini-2025-04-14`, prompt `sound-science-v4`, Structured Outputs. AI chooses bank feedback and exact learner excerpt, transparently labelled in UI; see ADR-0006.

Expected v4 concept sequence: vibration, vibration, evidence, relative_level, directions, equal_distance, reflection, absorption, radar, context, mitigation, no_audio. Observed sequence matches. All excerpts matched input substrings by server validation. All science text comes from the versioned bilingual bank; every bank entry has one authored follow-up question. Teacher review remains independent.

## Next gate actions

1. Teacher checks the bank, the 12 results, age/language suitability and current school DSKP edition.
2. Owner tests five microphone start/stop cycles on teacher device and physical mobile, denied permission, playback, exit/background release and no audio network upload. Public diagnostic can establish microphone feasibility while hosted AI is pending.
3. DONE: owner selected concept 1 (corrected notebook image) on 25 October. Selection and detailed implementation specification are recorded in docs/design/options/. Pupil interface implementation still follows the remaining measured gates.
4. Hosted backend requires Cloudflare authentication/setup or an explicitly chosen alternative preserving strict quotas. GitHub Pages hosts only the frontend. See ARCHITECTURE-PLAIN.md and SETUP.md. Owner authorized source-public/Pages publication; no Sites service was created.

No new product permission is needed once the active measured gates pass: owner already authorized conditional continuation. Do not request duplicate phase approval based on historical documents.

## Repository and deployment evidence

- Public source authorized by owner, verified PUBLIC; provider-key history scan passed before visibility change. Local server env remains ignored and untracked.
- [PR #18](https://github.com/lauhoekeat/ai-soundlab/pull/18) contains planning/POC commits and was merged after both CI runs passed. Merge SHA `0c5c85b2bd4be270ac5f404de08520ffb3a2b7b9`.
- [Pages workflow](https://github.com/lauhoekeat/ai-soundlab/actions/runs/40201362546) completed successfully on 25 October 2026. Published diagnostic: https://lauhoekeat.github.io/ai-soundlab/ . Browser opened it and confirmed correct title, BM diagnostic sections and AI-selected-guidance disclosure.
- Public diagnostic is not competition-ready: no hosted proxy URL configured, so production AI requests fail locally with an explicit setup message rather than contacting the visitor's loopback or exposing a key. Local microphone/storage can be tested on HTTPS independently. Product M2/M3, full BM/EN and badges remain gated.
