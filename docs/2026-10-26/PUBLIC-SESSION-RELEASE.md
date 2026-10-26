# Public session release · 26 October 2026

## Owner decision

The owner asked for AI guidance in Predict, Try and Explain in every challenge, plus a fixed five-question assessment and 10-point mastery report. They explicitly removed Save, Evidence Book, teacher mode, class-code generation and teacher examples because the app will be public. This supersedes the older class-code and persistence plans. Answers and AI results live only in React memory. Every AI call requires a text-only consent checkbox.

## Pupil flow

1. Mission 1: predict ruler sound, pluck a real ruler, compare quiet versus ruler microphone recordings or use the physical observation path, explain vibration. The microphone measures sound signal only.
2. Mission 2: drag four listeners to different distances around a bell; run equal-distance and changed-distance trials. A short bell tone plays. The model clock advances beside the animation.
3. Mission 3: compare hard wall and soft curtain reflections. Sample sound always plays. Optional own recording is replayed locally with a delayed, scaled digital copy. Distance can be increased to make the return easier to hear. The material changes reflected strength, while equal distance gives the same travel time.
4. Mission 4: record or choose a sound, label its source yourself when known, judge a useful or harmful effect and propose a safe noise-reduction action. AI does not receive audio or classify sounds.
5. Assessment: five fixed written questions, two criteria each. The server totals ten points from model-supplied criterion booleans, then shows missed ideas, fixed reference answers, strengths and areas for improvement. Threshold labels are practice descriptions only, not validated PBD levels.

The five criteria cover vibration, directions/distance, reflection/absorption, useful/harmful effects and mitigation. New criteria and reference answers are in `shared/assessment.ts` and `shared/stage-guidance.ts`. A Science teacher should review this new rubric against the school's DSKP edition before formal classroom use. Earlier approval covered the previous feedback bank, not this revision.

## Architecture and privacy

Static Vite frontend on Pages calls Cloudflare Worker `/api/stage-guidance` and `/api/assessment`. A Worker secret holds the OpenAI key; no key is in source or GitHub. Request schemas allow only fixed language, mission/stage and bounded answer text. The Worker derives criteria/reference answers from its own code, asks `gpt-4.1-mini` for strict JSON booleans with `store:false`, validates the response and calculates scores itself. It never accepts a user-supplied rubric. No raw audio, images, names, login or saved answer storage is implemented. Pupils must avoid entering personal information in text.

Exact Origin allowlist and CORS restrict ordinary browser calls. They are not authentication: a non-browser client can spoof Origin. An atomic Durable Object reserves quota before paid calls, globally and by daily HMAC-hashed IP: 12/minute, 20/IP/minute, 200/day, 2,000/month. Input is capped at 8 KiB, upstream output at 32 KiB, model output tokens at 120/300, and timeout at 20 seconds. Usage remains a bounded public expense and limits can be tightened or `AI_ENABLED=false` set server-side. Quota counts requests even if the model fails. Cloudflare can see network metadata and OpenAI receives submitted text; neither should be described as fully private.

## Validation and release gates

Automated: TypeScript, unit/proxy tests, build/credential scan, Miniflare route and 50-way atomic quota test, Playwright desktop/mobile mission and assessment flow, listener pointer/keyboard drag, fake microphone capture and echo playback. Two live synthetic adult-answer requests must pass the hosted new endpoints after deployment; hosted boundary tests must reject invalid requests. Physical phone audio, new Science-teacher review, pupil pilot, competition eligibility for a music teacher and organizer upload details remain owner/organizer checks. Do not report these as newly observed by automation.

No automatic environmental sound identification is promised. The synthetic echo is a simplified teaching model and does not measure real-room acoustics. The microphone waveform and RMS are relative device signals, not calibrated sound pressure or proof that the pictured ruler vibrated.

## Published release evidence · 26 October 2026

- PR [#30](https://github.com/lauhoekeat/ai-soundlab/pull/30) merged at `af97d6c`; CI passed. [Pages workflow](https://github.com/lauhoekeat/ai-soundlab/actions/runs/40350956435) built and deployed that commit successfully.
- Cloudflare Worker version `23e8255e-1c2a-42b8-b8c6-588efdf82293` was deployed. Hosted boundary checks passed: allowed health, absent/unlisted Origin rejection, retired routes 404, preflight, extra property rejection, mission allowlist and body cap. Two live hosted synthetic requests returned 2/2 stage and 10/10 assessment; latency about 2.4 and 1.9 seconds. The retired hosted `CLASS_CODE` secret was removed.
- Local `npm run check` passed 49 tests, typecheck, build and credential scan. `npm run test:runtime` passed route checks and 50 concurrent quota reservations with seven accepted against a seven-request limit. Local live Worker also returned 2/2 and 10/10 with synthetic answers.
- Playwright passed the four-mission session flow, stage guidance, assessment report, 390px mobile width, listener keyboard and pointer movement (2.0 to 4.0m), local Echo recording/replay, and quiet/ruler microphone comparison. The same full flow passed on the published Pages URL using mocked AI replies; a separate published browser call received real AI stage feedback, 2/2, with zero page errors.
- Browser automation used fake microphone input and cannot certify physical sound quality, permission behavior or classroom device compatibility. The owner previously reported both devices passed the old version; this revision needs a fresh physical-device check. The new rubric still needs Science-teacher review, and pupil-pilot/competition eligibility remain unverified.
