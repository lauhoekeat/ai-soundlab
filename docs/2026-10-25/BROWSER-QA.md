# Diagnostic QA · 25 October 2026

Surface is a plain POC diagnostic, not a selected pupil visual design. In-app browser used through CUA; no Playwright CLI fallback. URL http://127.0.0.1:5173/ai-soundlab/. Current app panel viewport was about 304×600; screenshots inspected. Physical mobile, full desktop viewport, 200% zoom and final visual fidelity are **not** claimed.

| Check | Result/evidence |
|---|---|
| Page identity / nonblank | Correct POC title, header and diagnostic sections in AX/screenshot |
| Readable narrow surface | Text wraps, controls stack and evidence list remains usable in current narrow panel |
| Teacher path | Teacher mode → labelled ruler example → save → 1 record |
| Persistence | Reload → ruler example still listed as teacher example |
| M4 path | Select detective → source/context, classification reason, mitigation fields appear |
| AI unavailable | With AI disabled and synthetic invalid code, consent/submit → explicit disabled message; learner text retained |
| M4 storage | Save adult synthetic response → 2 records, no fake AI result attached |
| Production styling boundary | Initial dev screenshot revealed CSP blocking Vite injected CSS; fixed by dev-only CSP removal. Production build retains exact-origin connect CSP |
| Export / clear | Controls enable from saved evidence; actual downloaded-file comparison/clear UI not yet measured |
| Microphone | Synthetic API lifecycle tests pass; physical browser permission/recording test still required |
| Console | No visible framework error overlay; full console instrumentation not obtained |

Recorded screenshot: parent workspace outputs/poc-diagnostic-evidence.png, contains only synthetic adult data. No key, class access code or pupil data. The open diagnostic tab is retained for owner testing. Do not confuse this with pupil usability research or final design verification.

Production verification: GitHub Pages deployment run 40201362546 succeeded; opened https://lauhoekeat.github.io/ai-soundlab/ in a new in-app tab. Correct page title, styled BM sections and v4 AI-selection disclosure confirmed. Screenshot saved to parent workspace outputs/published-diagnostic.png. No hosted AI endpoint configured; only local proxy AI has been verified. Public microphone physical-device checks requested from owner, not assumed passed.
