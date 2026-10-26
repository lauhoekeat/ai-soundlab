# Option 2 workbench implementation QA · 26 October 2026

final result: passed

## Selected reference and normalization

- Owner selected displayed option 2 from `docs/design/2026-10-26-organization/options.json`: `direction-2.png`, native 1487×1058.
- The corresponding live Echo Try state was captured in automated Chromium at exactly 1487×1058 CSS pixels with device scale 1, BM, hard wall selected, sound on, empty pupil observation, fonts and image decode complete. The capture uses the viewport rather than a stretched or scaled full-page image.
- `docs/qa/2026-10-26-option2/side-by-side.png` combines the native reference and viewport capture at their original sizes with a 32px heading strip. Both standalone inputs are `direction-2.png` and `docs/qa/2026-10-26-option2/desktop.png`. The combined image was opened and visually inspected at original detail. `docs/qa/2026-10-26-option2/mobile.png` captures the same state at 390px width, full page.
- Automated Chromium was used with the owner's explicit permission after the in-app browser capture tool failed to initialize. No installed browser software or new package was requested.

## Iteration and visual assessment

1. The old published 0.2.3 app was captured in eight audit states, documented in `docs/design/2026-10-26-organization/AUDIT.md`. Key P1 issues were simultaneous three-column tasks, distant error recovery, pupil Echo timing and premature material outcome, and long mobile scrolling.
2. First implementation established the selected narrow mission rail, large inquiry heading, four visible learning stages and two-column experiment/observation card. The Echo diagram uses actual transparent ImageGen speaker/wall/curtain assets; only the selected surface is visible. Palette, Baloo 2/Nunito Sans type hierarchy, white/navy/teal surfaces, material picture choices and prominent Run/Continue controls were compared to the reference.
3. Browser comparison found secondary Step/Reset buttons competing with Run. They were moved into a labelled optional control disclosure. Trial-state labels and a short slowed-audio note remain visible because the working simulation needs to report what was tested and how the example sound differs from natural timing.
4. Re-captured desktop and mobile after the change. The pupil view contains no numeric milliseconds, distance slider or teacher model text. The reference's incorrect M2/M3 rail order is corrected to the curriculum order M1–M4. The mock's enabled Continue appearance is implemented with inline validation and focus on missing input. Empty observation remains empty; no AI feedback or experiment result is fabricated. These are intentional functional differences, not visual defects.
5. At 390px the rail collapses into a labelled mission menu and the two columns stack. The 390px document width remains 390px; the Echo task is about 1,752px tall, compared with about 3,827px in the audited old mobile layout. The observation prompt remains directly after the experiment. At 768px teacher area and controls reflow without horizontal document overflow.

No P0/P1/P2 mismatch remains in the selected state's typography, layout, colors, image quality or copy. Fine visual differences include the exact shapes of generated cutouts, native browser form glyphs and the additional real trial indicators. These are P3 differences. No claim of pixel identity, WCAG certification or actual Year 4 pupil comprehension is made.

## Functional and safety checks

- `npm run check`: strict TypeScript, 87 tests, production build and frontend credential/endpoint bundle scan passed.
- Automated Chromium: all four mission step sequences validated and saved, reload restored 4/4 evidence, forward step gating showed a local invalid field, both M2 distance layouts and M3 materials required for completion, no pupil timing text, no page exceptions, and mobile mission menu worked.
- Teacher browser check at 768px: dedicated area, teacher-only Echo timing, mocked class-code endpoint response displayed a valid pupil code, EN language switch and teacher demonstration/return worked. The mocked response confirms UI wiring, not a new live Cloudflare authentication test; the secured backend was previously deployed and tested.
- Provided `Pencil-Tap.m4a`, `Pencil-Tap-2.m4a` and `Random-Unknown.m4a` each decoded in Chromium's Sound Detective file path, showed a local playback control and no browser error. No sound was automatically identified; no audio was uploaded.
- Audio capture unit tests and Echo Web Audio scheduling/abort tests passed. Browser UI unmounts the audio panel on step, mission or method changes. No new physical device or pupil trial was performed in this redesign.

## Evidence limits

The screenshots use synthetic empty/student testing states and contain no real pupil data or secrets. The desktop first fold fits the primary actions at 1487×1058; bottom whitespace extends beyond the viewport in the full-page capture. The owner previously reported physical teacher/phone checks and Science teacher review for the earlier release; those are not re-claimed for this redesign.
