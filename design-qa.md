# Concept 1 implementation QA · 25 October 2026

final result: passed

Scope: fidelity to the selected visual system and main workspace composition, with functional-state extensions explicitly specified in docs/design/options/SELECTED-DESIGN.md. This is a working four-mission app, not a raster reproduction of the multi-screen concept board. No claim of pixel-identical board reproduction or pupil usability research.

## Evidence and normalization

- Source visual truth: `docs/design/options/concept-1.png`, 1448×1086, corrected notebook concept selected by owner.
- Implementation: `docs/qa/desktop.png`, 1433×1086 first-fold crop of browser full-page capture (1433×1277); explicit IAB viewport override 1448×1086 CSS px. Its vertical scrollbar consumes 15px. The reference's outer right 15px was cropped for equal pixel-scale comparison, with no image stretching.
- Same-input side-by-side comparison: `docs/qa/reference-comparison.png`, inspected directly using view_image original detail. Original source and current browser screenshot were also opened. The regular IAB viewport capture was soft when scaled in the narrow host panel; full-page capture supplied sharp browser pixels for the final comparison.
- Mobile: `docs/qa/mobile.png`, full-page 390px-target capture. Tablet check: 768×1024 override; document client/scroll widths both 753px (15px scrollbar), no page overflow. Mobile client/scroll widths both 390px after full-page capture.
- Initial M1 state: empty prediction/explanation, inactive flat microphone signal, empty AI invitation, 0/4 saved evidence. Concept's populated AI guidance and 1/4 indicator are deliberately not fabricated in the initial app.
- Additional functional evidence: `docs/qa/notebook.png`, four synthetic adult mission entries; `outputs/product-echo-desktop.png` in parent workspace shows the tested echo surface. No real pupil data, audio or secrets in screenshots.
- IAB/CUA browser used; no Playwright CLI fallback. DOM-backed controls, font inspection, console logs and actual saving/export tests were used alongside screenshots. No browser console errors/warnings were reported in the final inspected run.

## Required fidelity surfaces

| Surface | Comparison and result |
|---|---|
| Fonts/typography | Baloo 2 rounded display headings and Nunito Sans body self-hosted; verified computed families. Navy bold hierarchy, distinct heading/body scales and explicit controls. Source's exact unknown font is approximated by this licensed family pairing; wider readable labels may wrap where the concept used condensed text |
| Spacing/layout | Three main desktop columns preserve context/illustration → prediction/observation → explanation/AI. Slim mission navigation and pale section bands retained. Mobile reorders into prediction/observation/explanation/AI with full-width controls. Real observation, consent and comparison controls extend vertical height; companion board frames map to separate working mission views and navigation, as specified before implementation |
| Colors/tokens | True white retained, ink navy, teal primary, pale blue/teal activity regions, yellow fact/evidence accents. No added gradient or photo tint. Button and panel states remain consistent |
| Image quality/assets | Standalone ImageGen ruler illustration matches light wood/white semi-realistic style. Anchoring hand intentionally added for a scientifically clear free-overhang activity. No screenshot text baked into UI. No stock placeholder; Phosphor outline icons form one consistent library |
| Copy/content | Required mission names, inquiry heading, instruction, prediction/observation/explanation, microphone, save and AI-selected labels preserved. Necessary consent, privacy, baseline, fallback and observation fields are explicit product requirements. AI is never populated before a real response. No class aggregates, invented measurements or sound-recognition claim |
| Responsive/accessibility | 390px, 768px and 1448px targets checked. Local navigation may scroll internally; document has no horizontal overflow. Measured visible buttons at tablet check had no targets below 43px in either dimension. BM/EN controls now meet 44px. Labels, visible focus, keyboard ranges, alternative physical observation, static step and reduced-motion behavior included |

## Iteration history / material fixes

1. Initial diagnostic/dev CSS was blocked by Vite-incompatible CSP; fixed during POC by dev-only policy removal, production exact-origin connect policy retained.
2. First product capture revealed extra visible mission pretitle/progress ornamentation absent in the corrected selected concept. Removed from visual surface; accessible mission metadata retained.
3. Microphone action was below the signal; moved above the signal to match selected action hierarchy. Optional physical fallback was grouped in an accessible disclosure to reduce initial density.
4. Initial language touch buttons were narrower than 44px. Added minimum widths; tablet measurement found no undersized visible buttons. Mobile header wraps instead of clipping.
5. Teacher-mode toggle changed its label to the opposite mode, creating ambiguity. Kept stable teacher-mode label with pressed state and highlighted background.
6. Initial IAB first-fold capture was soft; used full-page browser capture and a content-preserving first-fold crop for sharp comparison. No artificial enhancement of evidence images.
7. Added runtime reduced-motion handling for canvas simulation in addition to CSS, and synchronized teacher-example simulation state with its saved/example inputs.

Post-fix images listed above are the latest evidence. No actionable P0/P1/P2 visual mismatch remains within the specified functional interpretation. The icon/font shapes are a faithful library approximation, not the original unknown font/icon files. These minor optical differences are P3 follow-up only.

## Primary interaction proof

Student M1: prediction/reason → actual-observation alternative → observation/explanation → save → repeated save keeps one badge. M2: equal distances run → keyboard changes listener distance from 2 to 2.5m → different distances run → observed model arrival changes 5.8 to 7.3ms → save. M3: hard wall + soft curtain at 5m → 29.2ms model delay → synthetic playback path executes → everyday example/explanation → save. M4: pupil-labelled context → both useful/harmful + reason + mitigation → save. Notebook reports 4/4 from four unique missions. Exported JSON contains all four mission IDs, no audio blob or class code. Teacher mode initially has 0/4, then its labelled example saves separately; clearing one mode preserves the other. Reload restored saved records. Synthetic test records were cleared after QA.

Security/logic: 71 automated tests, strict types/build/bundle checks and 50-way actual workerd quota reservation gate pass. Hosted proxy boundary checks and two hosted AI interactions pass. Public browser-to-proxy integration is verified after Pages deployment in RELEASE-REPORT.md; this visual QA does not substitute for that release check.

## Remaining verification limits

The owner reported physical POC device checks and Science approval. Exact physical device/browser versions and separate packet traces were not supplied. These browser viewport checks cover the final frontend; no new physical-device or pupil-study outcome is claimed. Organizer eligibility, final submission rules and classroom permission remain teacher actions.

## Public release confirmation · 26 October 2026

Pages deployment 40209220698 succeeded for merge 6f90ce5. Both public-browser AI interactions rendered live v4 guidance (M1 BM, M4 EN), saved evidence, and produced no inspected console errors/warnings. Final screenshot: parent outputs/published-product.png, captured from the live app in fresh BM student M1 state. Browser viewport override reset after capture.
