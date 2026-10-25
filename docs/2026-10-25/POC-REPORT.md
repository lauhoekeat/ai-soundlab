# Measured POC report · 25 October 2026

Technical POC implemented. Product continuation remains gated by human/device review. All evidence uses synthetic adult text; no pupil recordings/data collected.

| Gate | Status | Evidence |
|---|---|---|
| G0 plan/authorization | PASS | Current user request recorded in docs/approvals.md; active plan and source mapping committed |
| G1 secure runtime | AUTOMATED PASS | 63 tests, strict types/build/bundle checks, zero npm audit findings; actual local workerd boots; 50 concurrent durable reservations under cap 7 → exactly 7 accepted/43 rejected, fresh stub retains cap |
| G2 two live AI interactions | LOCAL PASS | Owner configured existing ignored server key. Both M1/M4 real OpenAI calls succeeded. Current v4: 12/12 synthetic BM/EN fixtures HTTP 200, including both learning paths; 0.915–2.093 seconds in this small run |
| G3 audio/devices/privacy | PARTIAL | Seven synthetic API lifecycle tests pass (five cycles, auto-stop, active abort, denied/pending/late permission, MIME/blob); no audio field accepted by proxy. Actual teacher/mobile browser recording and network trace pending |
| G4 science | ENGINEERING REVIEW PASS; TEACHER PENDING | Exact BM source checked; initial unconstrained prose failed science expectations; v4 AI-selected bank chose expected concept for all 12 fixtures, including radar/dBFS/unheard audio injection. Bank/relevance requires teacher signoff; no broad accuracy claim |
| G5 mobile/usability | PARTIAL | In-app narrow browser confirms teacher example/save/reload, M4 fields, preserved answers on AI unavailable; no physical mobile or pupil trial performed |
| G6 continuation/release | NOT PASSED | Product gated; visual selection and hosted proxy/Pages setup pending |

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
3. Select one of three pupil-interface concepts before UI implementation.
4. Hosted backend requires Cloudflare authentication/setup or an explicitly chosen alternative preserving strict quotas. GitHub Pages hosts only the frontend. See ARCHITECTURE-PLAIN.md and SETUP.md. Owner authorized source-public/Pages publication; no Sites service was created.

No new product permission is needed once the active measured gates pass: owner already authorized conditional continuation. Do not request duplicate phase approval based on historical documents.
