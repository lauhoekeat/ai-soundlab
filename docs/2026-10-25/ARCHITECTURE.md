> 0.2.1 refinement: see [ADR-0007](ADR-0007-classroom-access.md). Durable infrastructure now also holds one hashed temporary classroom credential and issuance/access-attempt counters. The private setup credential remains server-side except when the teacher explicitly enters it in the protected setup form; pupils receive only temporary codes. No pupil database was added.

# Architecture and decision record

**Current refinement:** [ADR-0006](ADR-0006-grounded-feedback.md) replaces free-form model prose with explicitly labelled AI selection of a curriculum fact/question and a verified learner excerpt. Schema is validated server-side; failures never fall back to a pretend AI answer. Owner has now authorized public GitHub source for Pages. Cloudflare hosted setup is complete and both public-app AI paths passed; see [plain-language architecture](ARCHITECTURE-PLAIN.md).

## ADR-0005: secured pedagogical feedback replaces local classification

Accepted by owner request, 25 October 2026. React/TypeScript/Vite frontend is static, suitable for GitHub Pages under `/ai-soundlab/`. Web Audio obtains waveform and relative RMS locally; MediaRecorder capability is detected and its actual supported MIME is used. Audio blobs never cross the network or persist. IndexedDB holds anonymous learning evidence only. No pupil accounts, cloud pupil database or class aggregation.

Frontend → exact HTTPS proxy origin `/api/feedback` → strict request validation → class-code authentication → durable atomic quota reservation → fixed OpenAI Responses endpoint → validated short response → frontend. Browser has no provider SDK, provider key, model selector, system-prompt field, arbitrary endpoint or tools.

Cloudflare Workers + one Durable Object quota coordinator is the selected serverless runtime. Durable Object storage holds **only infrastructure counters**, not learner records, audio or answers. This small persistent infrastructure exception is necessary to enforce global usage caps across isolates/restarts; in-memory or eventually consistent counters cannot provide a strict cap. No separate application database is provisioned. Hosting plan/free allowances must be checked in the owner's account before deployment.

## Request contract

POST JSON only; exact paths `/api/feedback` and `/api/health`; no arbitrary forwarding. Missions allowlisted to `vibration` and `detective`. Language `bm`/`en`. Fields `observation` (1–600 chars), `explanation` (1–600), `mitigation` (0–400, required for detective). Unknown properties rejected. Total streamed UTF-8 body ≤8192 bytes even without Content-Length; input strings cannot contain controls except whitespace. Class code in `X-Class-Code`, kept in tab memory, never URL/local storage/export. Request code compared via fixed-length SHA-256 digests. No identity field or raw audio accepted.

Exact Origin allowlist; reject null, absent and unlisted origins; preflight only permits approved method/headers. CORS is browser protection, not authentication: a leaked class code can be used by scripts that spoof Origin. Rotate per lesson; global caps bound the residual risk. No public secret embedded in bundle. Health never discloses credentials or account errors. Disable AI globally with `AI_ENABLED=false`.

## Quotas and cost controls

One Durable Object, serialized transaction before every provider request: 12 requests/minute per class, 20/minute per keyed IP hash, 200/day and 2000/month globally. Failed attempts after reservation count; no retries/refunds. IP hash uses server secret HMAC and UTC day; no raw IP retained. One rolling active minute/day/month record bounds storage growth. UTC boundaries are implementation quota windows, shown explicitly in errors/setup. NAT may make IP quota shared across a school.

Model fixed server-side to `gpt-4.1-mini-2025-04-14`; text only, `store:false`, output ≤400 tokens, no tools/history. Input is bounded by validation; prompt version is code-reviewed. 20s upstream timeout, no automatic retry; response streamed cap 32KB, short text ≤1600 chars. Input/output moderation and deployment safety review should be evaluated before unsupervised rollout; POC is supervised and topic-scoped. Output is text-rendered (never HTML), checked for refusal/empty/malformed content; no scores or automatic badge awards from AI.

Daily/monthly request limits plus fixed input/output ceilings bound exposure, but currency cost depends on current pricing. OpenAI project budget alerts may not be hard spend stops. Use a dedicated restricted project/key, minimum limits, monthly dashboard review, rotate compromised codes, and server kill switch. Hosting errors fail closed; no upstream request if auth/validation/quota storage fails.

## Deployment and CI

GitHub Actions: clean install, types, domain/security tests, build, bundle-secret check, Worker dry run. Pages workflow is manual with production environment and only public `VITE_PROXY_URL` variable; no OpenAI secret in GitHub at all. Worker deployment is separate, via authenticated Cloudflare CLI and Workers secrets. The owner authorized public source for free Pages and completed Cloudflare login. The repository is public, Pages is deployed, and server-only secrets are held by the Worker. See RELEASE-REPORT.md for deployment evidence.

## Threat review

Prompt injection: learner input is untrusted user data, bounded and topic-scoped; no tools, secrets, context history or external content; adversarial science fixtures remain a gate. This reduces impact, not a proof against all injection. Abuse: invite code, durable quotas, upstream ceiling and kill switch. Privacy: no analytics, names, audio upload or answer logs; `store:false` does not promise zero provider retention. Browser storage/export needs shared-device cleanup. Offline: deterministic activities can work after assets load; AI explicitly requires internet. No full offline-first guarantee/PWA until tested.
