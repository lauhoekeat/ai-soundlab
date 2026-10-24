# Product Design plan

This is a prose design brief, not a visual prototype or approved visual reference. Product Design index, user-context and get-context guidance were read. Saved-context preflight found no saved product design context. No image generation, browser prototype or UI implementation has occurred.

## Brief playback

Design a teacher-led browser learning application for Year 4 pupils investigating sound. Optimize for completing an evidence-based investigation on shared school laptops and explaining it clearly to competition judges. BM-first, no login, local audio, visible uncertainty, touch and keyboard support. Distinct workspaces serve different cognitive tasks; shared navigation supplies continuity.

## Process and artifacts

1. Frame: review classroom constraints, supplied event announcement and DSKP; mark assumptions. Output: product/evidence documents.
2. Define: map learner/teacher/presenter journeys and measurable task outcomes. Output: per-feature briefs and assessment mapping.
3. Explore, after planning review: use Product Design ideation to produce exactly three coherent visual directions. Each direction must show M1 capture workspace, M2 spatial map, M3 comparison bench and M4 planning board, plus a teacher summary inset. Owner selects one before UI implementation. Generating static mockups may be separately authorized; no runnable prototype is implied.
4. Specify selected direction: desktop 1366×768, tablet 1024×768, narrow 390px states; initial, active, success, uncertain and error states; reviewed BM text and asset provenance. No Figma file or generated mock is claimed to exist now.
5. Validate with teacher and 3–5 pupils if permitted: can they find the next action, explain what AI did and recover without adult rescue? Record observations, not invented research findings.
6. Build only in the explicitly approved phase; compare implementation against selected mockups at matching size/state; attach paired images and note any intentional deviations. Pass UX gates before release.

## Proposed visual language for exploration

Friendly science notebook with generous white/cream space, dark navy text, teal actions and amber uncertainty. Proposed tokens, subject to selected visuals: background #F7F8FA, text #172B4D, action #006B68, warning #8A4B00, error #B42318. Validate contrast rather than assuming compliance. Sans-serif body around 18px, large section headings, 8px spacing rhythm, 12px card corners, recognisable library icons with text. A small BIP illustration may support instructions; it must never cover evidence or primary controls.

No leaderboard, countdown pressure, streak loss or random reward mechanics. Evidence badges acknowledge investigation steps, not pupil ranking. One primary action per task stage; repeat/play/stop always visible. Motion must be optional, with static alternatives.

## Shared acceptance

44×44px proposed minimum touch controls; visible focus and logical tab order; keyboard alternatives to dragging; no essential information solely in color/audio/motion. Target WCAG 2.2 AA, verified during implementation. Audio descriptions/transcripts and visual sound envelopes support access; the teacher may accept an equivalent non-listening explanation. Captions describe samples and are clearly marked if they reveal an answer.

At narrow width, stack prediction → workspace → evidence; keep Stop and Next reachable without covering content. At 200% zoom, no loss of controls. Announce recording status and results in accessible status text; avoid repeated live-region announcements every model frame. BM sentence instructions should normally fit two short lines; review with an actual teacher.
