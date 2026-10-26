> Current patch: 0.2.3 fixes guidance order and Echo sound. See [patch verification](INQUIRY-ORDER-ECHO-0.2.3.md). Earlier release evidence follows.

> Prior release: 0.2.2, clearer Year 4 BM/EN questions, activity steps and optional writing help. [Question revision and verification](YEAR4-QUESTIONS.md). [Merged PR #24](https://github.com/lauhoekeat/ai-soundlab/pull/24), deployed source 0c867ee, [successful Pages run 40252252766](https://github.com/lauhoekeat/ai-soundlab/actions/runs/40252252766). The 0.2.1/0.2.0 evidence below is historical.

> Prior patch: 0.2.1 adds protected teacher classroom-code generation, classroom copy fixes and local M4 audio import. See [patch QA](BUGFIX-QA-0.2.1.md) and [ADR-0007](ADR-0007-classroom-access.md). The 0.2.0 release evidence below is retained.

# Four-mission release report · 25 October 2026

Version 0.2.0. Concept 1 selected. POC development gates cleared by owner's reported physical audio checks and Science approval; exact device/browser versions and a pupil pilot were not supplied. Those limits are preserved, not converted into invented measurements.

## Implemented

- M1 vibration: prediction/reason, safe ruler activity, permission-gated five-second local waveform/recording, relative RMS/dBFS, quiet comparison, physical-observation alternative, explanation, live AI-selected curriculum guidance and revision/save.
- M2 all-direction travel: listener positions/distances, equal/different-distance comparison, ideal-model arrival times, keyboard/touch controls, animation/pause/step/reset and medium/wavefront explanation. Both comparisons required for evidence.
- M3 reflection: hard/soft comparison at a controlled distance, 2d/343 model delay, outgoing/return paths, quiet synthetic playback, pause/step/reset, everyday example. Changing distance resets required comparisons.
- M4 sound detective: local recording/playback/delete or direct observation, student source label/context, useful/harmful/both with reason, causal mitigation, text-only AI-selected feedback. No automatic audio recognition or hearing-safety claim.
- BM and English interface; same-device IndexedDB evidence; unique mission badges, teacher examples stored separately, revision updates, optional JSON export and mode-scoped deletion with confirmation. No accounts, pupil database or online class aggregation.

## Hosted backend

https://ai-soundlab-proxy.ai-soundlab.workers.dev , Cloudflare Worker version `b1dceeab-a25f-49bc-a034-1c3fa7873d81`. Server secrets uploaded from the ignored local file over Wrangler stdin; values were never printed or committed. GitHub stores only public `VITE_PROXY_URL`. Provider key remains backend-only. AI enabled after secret setup; fixed model/task/origin/schema/body/output allowlists, timeouts, atomic pre-reservation quotas and kill switch retained.

Two real hosted interactions passed: vibration 3732ms; detective 1384ms, prompt `sound-science-v4`. Eight hosted boundary checks passed: Pages-origin health 200, missing/unapproved Origin 403, missing class code 401, preflight 204, audio property/unknown mission 400, oversize request 413. These invalid requests do not call the provider. Re-run with `node scripts/hosted-security-gate.mjs` and the explicit paid live script when needed.

## Validation

- 71 automated tests pass: existing proxy/schema/quota/audio/bank coverage plus evidence completeness, dual comparisons, badge deduplication, language coverage, actual IndexedDB update/reopen and mode-scoped deletion.
- Strict TypeScript/build/bundle boundary checks pass. Dependency audit: zero reported vulnerabilities at the recorded check.
- Actual local workerd/Durable Object concurrent test: 50 requests, cap 7, exactly 7 accepted/43 rejected; a fresh stub still sees the cap.
- In-app browser: all four student investigations saved; repeated save retained one mission badge; equal/different distance and hard/soft tests exercised; synthetic echo playback executed without browser error. Four-mission JSON export inspected: all mission IDs, no audio blob or class code field.
- Teacher mode initially showed 0/4 independently of student 4/4; labelled teacher sample saved separately. Mode-scoped clear preserved other mode. Saved evidence restored after reload. Adult synthetic QA records cleared afterwards.
- Responsive checks at 390px mobile, 768×1024 tablet and 1448×1086 desktop targets; no document horizontal overflow. Internal mission navigation scrolls when needed. Final inspected console: no errors/warnings. Physical POC checks are owner-reported; no new final-device trial is invented.
- Selected reference and current screenshot inspected together at original detail; layout, fonts, palette, imagery, copy and responsive behavior reviewed. `design-qa.md` records fixes, intentional functional differences and remaining minor optical limitations. Source board companion frames became separate working views as specified before coding.

## Publication

[PR #19](https://github.com/lauhoekeat/ai-soundlab/pull/19) merged after both CI runs passed. Deployed source merge: `6f90ce5302da43f7f3d2d194f5f35f6f75f1cece`. [Pages deployment run 40209220698](https://github.com/lauhoekeat/ai-soundlab/actions/runs/40209220698) succeeded. Live product: https://lauhoekeat.github.io/ai-soundlab/ .

Public browser verification completed on 26 October 2026: teacher M1 in BM and M4 in English each returned actual hosted `sound-science-v4` guidance, rendered in the public app, and saved evidence successfully. These were synthetic adult examples. The inspected public console had no errors/warnings. The class-code input was cleared afterwards and the browser left in BM student M1 with 0/4 student evidence. Two labelled teacher QA examples remain in this browser's teacher evidence book. Published screenshot saved in the parent workspace outputs as `published-product.png`. The original planning and POC evidence remain versioned. The diagnostic is retained at `?diagnostic`. Confirm competition entrant eligibility, exact submission deadline, school policy and final target-device rehearsal before submission; registration was not performed by the agent.
