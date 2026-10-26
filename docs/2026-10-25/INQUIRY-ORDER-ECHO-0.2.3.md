# Inquiry order and echo sound - 0.2.3 - 26 October 2026

Owner report: guidance preceded the final answer, running Echo was silent, and equal material return times needed explanation. Issue #26.

## Changes

Vibration guidance now follows the explanation in DOM and visual order. This owner-requested correction supersedes the original concept's placement. Guidance requires the relevant written observation/explanation (plus M4 classification/proposal), class access and consent.

Echo sound starts with Run and a checked Simulation sound control. The source tone is unchanged between materials; the illustrative curtain return is softer. Sound closes on pause, reset, step, mute, distance/surface change, background and mission exit. Playback failures show a classroom message. The diagram and strength label reinforce the comparison.

## Science

The air model uses round-trip time = 2 x distance / 343 m/s. At 5 m both surfaces return after 29.1545 ms; 2 m gives 11.7 ms and 40 m gives 233.2 ms. Both paths remain in the same air. Surface choice changes illustrative reflection strength, not that path/time. Strength values are examples, not measured material coefficients.

Animation and demonstration sound share a constant 30x slower time scale, clearly labelled. At 5 m, the example return occurs after about 0.875 seconds while the numeric model time remains 29.2 ms. Greater distances take longer in both demonstrations. This does not claim that a separate real-room echo is audible at 5 m. The note about nearby reflections merging remains. Compare materials at equal distance.

## Validation

84 tests, strict types, build and frontend credential-boundary checks passed. New tests cover equal material return timing with different amplitudes, proportional distance scaling, resume, abort during startup and error cleanup. No backend, model prompt or access-control changes were needed.

Browser plugin not available. CUA initialization failed because kernel assets could not be written (missing path, OS error 3). The testing skill's Browser-absent route used already-bundled Playwright/Chromium; no new dependencies were installed. Restoring the Browser plugin/runtime would restore in-app test controls. Temporary scripts remain in ignored work/.

An actual Chromium Web Audio test used passive analyser branches. Both source and return signals were nonzero. At 5 m the oscillator start interval was 0.8746355685 seconds for both materials. Approximate RMS peaks: source 0.0734, wall return 0.0469, curtain return 0.0148. These are engineering signal values, not dB SPL or physical loudspeaker measurements. Native context closure was observed after completion, pause, mute and navigation. Muted Run created no new context. Unit tests separately verify startup cancellation. Physical speaker volume/perception was not tested.

UI checks passed for title/content, no framework overlay/errors, guidance after the final answer in DOM and desktop geometry, and the written-answer prerequisite. Both materials retained 29.2 ms at 5 m; distance controls produced 233.2 ms at 40 m and 11.7 ms at 2 m. Mobile 390x844 had equal client/scroll widths of 390px. Desktop target was 1448x1086. Screenshots and echo-browser-qa.json are in parent outputs/. Synthetic adult text only; no microphone, recordings or pupil data were used.

Publication evidence is recorded in the PR and Pages Actions run. Target: https://lauhoekeat.github.io/ai-soundlab/ . No new physical-device or pupil-trial approval is claimed.
