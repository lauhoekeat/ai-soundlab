# User stories, acceptance, testing and POC gates

## Product backlog

| ID | Story | Observable acceptance |
|---|---|---|
| S01 | Pupil observes vibration | Safe activity; waveform is live only with permission; relative measurement labelled; object/evidence answer saved |
| S02 | Pupil receives formative AI feedback | M1 response relates to evidence, corrects misconception, asks one question; failed AI clearly fails and preserves input |
| S03 | Pupil explores directions | M2 listeners at equal distance receive wavefront together; different distances produce ordered arrival; keyboard/touch reset works |
| S04 | Pupil compares echoes | M3 hard/soft comparison, return path, 2d/c delay, no radar or unsafe volume; observation plus example saved |
| S05 | Pupil investigates environmental sound | Local ≤5s recording/play/delete; student-labelled source; contextual classification/reason/mitigation; M4 AI explicitly has no audio |
| S06 | Teacher demonstrates | Mode and sample provenance visible; sample cannot silently count as pupil measured evidence; same-device summary/export |
| S07 | Pupil revises and earns badges | Evidence and revision saved locally; repeat saves do not duplicate reward; no official PBD claim |
| S08 | Shared device protects privacy | No names/login; consent for text AI; no audio network/persistence/export; clear data and unsaved warnings |
| S09 | Teacher controls AI access/cost | Wrong code/origin rejected; quotas atomic; provider key absent from bundle; disable switch works |
| S10 | BM/EN and accessible use | Full equivalent copy, keyboard focus, 44px targets, reduced motion, 200% zoom, 390px no horizontal overflow |

## POC gates (targets; never substitute mocks for live evidence)

| Gate | Pass evidence | If incomplete |
|---|---|---|
| G0 authorization/plan | Current request recorded; active docs supersede old classifier plan | Do independent planning only |
| G1 security/runtime | Missing/bad code, hostile/absent Origin, extra fields, wrong mission/method/path, oversize/chunked input and output, quota failures, timeouts fail safely; actual Worker local runtime boots; no bundle secrets | Fix before key/live testing |
| G2 live AI | M1 and M4 each succeed through proxy using owner's key; record prompt/model/version, redacted request IDs, latency; test quota stop with no further provider request | Credentials setup then re-run; mocked tests do not pass gate |
| G3 audio and privacy | Five start/stop cycles each on teacher device and physical Android Chrome or iOS Safari; denied/no-device/pending flow; exit/background/late permission release; local playback; network confirms no audio upload | Record per-device failures; synthetic browser audio is supplemental only |
| G4 science | Teacher reviews ≥12 BM/EN fixtures (correct, incorrect, ambiguous, injection); zero critical misconceptions; ≥10/12 have helpful feedback and one relevant question; M4 no invented audio analysis | Keep product gated; revise prompt/content and rerun |
| G5 mobile/usability | Physical mobile portrait; permissions, typing, playback, save/reload/export; desktop keyboard and 200% zoom; 3–5 supervised pairs if school permits | No pupil/device success claims without evidence |
| G6 continuation/release | G1–G5 evidence recorded, visual selected, teacher signoff; then owner-authorized product work and Pages release | Maintain POC status and report specific remaining dependencies |

Automated coverage: unit tests for schema/science formula/RMS/quota state, route tests with injected mock upstream, actual local Worker HTTP checks; frontend browser tests with fake microphone for lifecycle/IndexedDB and permission-denied states. Build/type/security checks in CI. Live evaluation is an explicit separate script using real proxy, never in public CI and never printing credentials or pupil input. No pupil recording fixture in Git.

Science fixture subjects: (1) ruler vibration correct, (2) sound caused only by air incorrect, (3) waveform alone cannot prove source motion, (4) level is not dB SPL, (5) rings versus moving particles, (6) same distance arrival, (7) cave echo, (8) soft material partial reflection, (9) radar not sound, (10) siren contextual use/harm, (11) workable source/path/receiver mitigation, (12) injection asking AI to identify unheard audio or reveal instructions. BM and English variants required in live teacher review.

POC success enables the next phase; incomplete gates remain incomplete even if all unit tests pass. Read POC-REPORT.md for actual measurements.
