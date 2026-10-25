# Cost, privacy, security and delivery risks

| Risk | Control | Residual / owner action |
|---|---|---|
| Music-teacher eligibility uncertain | Preserve exact rule summary; ask organizer | Owner confirms; no automatic eligibility assertion |
| Wrong DSKP edition | Source exact BM text; no invented 6.1.6 | Science teacher confirms school edition |
| Hallucinated feedback | Bounded prompts, reviewed facts, teacher rubric and fixtures | Teacher reviews; AI not formal marking |
| Environmental classification overclaim | No audio sent; student label explicit | Future audio model requires separate documented validation |
| Key theft | Worker-only ignored `.env`, hosted secret, no GitHub/provider key in Vite | Owner adds dedicated restricted key after runtime ready |
| Proxy abuse | Class invite, exact Origin, atomic quotas, request/output caps, kill switch | Code leak/origin spoof possible; rotate codes; monitor project |
| Unexpected spend | 200/day, 2000/month maximum reserved attempts; ≤400 output tokens; no retries | Dedicated project; check current price. Monthly bound = requests × (bounded input tokens × input price + 400 × output price), plus hosting. No free AI claim |
| Shared NAT quota | Class + keyed-IP limits | Tune only after measured lesson load; global caps unchanged |
| Cloud provider unavailable | Local Worker runtime and reproducible setup | Cloudflare login required for hosted proxy; no account created silently |
| Private repo Pages entitlement | Retain private repo | Owner chooses eligible plan or explicitly allows public source before free Pages |
| Child privacy | Supervision, text consent, no names/audio uploads/logs, local clear/export | School permission and policy review before pupil pilot; provider retention not zero by implication |
| Microphone/browser differences | Capability detection, timeout, stop tracks, sample fallback | Physical Android/iOS verification required |
| Relative measurement misunderstood | RMS/dBFS label, same-device comparison only | Teacher review; no safety thresholds |
| Local storage loss/exposure | IndexedDB errors surfaced, export, clear | Device sharing/deletion procedure; exported files remain |
| AI offline | Preserve answer and explicit unavailable state | Teacher hint distinct from live AI; do not claim offline AI |
| Submission dependency | Working HTTPS link and rehearsal checklist | Confirm exact cutoff/form; no slides per user's brief |

Initial rollout is teacher-supervised. No collection of real pupil recordings for development. No third-party analytics, advertising or remote font dependency. New assets need provenance/license entries. Production dependencies and hosting terms must be rechecked before release.
