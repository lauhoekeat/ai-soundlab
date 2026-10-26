# AI SoundLab organization review - 26 October 2026

Status: audit complete; three visual directions generated; awaiting selection. No app source, live deployment or runtime behavior was changed in this design-review phase. Owner explicitly authorized automated Chromium capture after in-app browser initialization failed. Product Design saved-context preflight found no saved user-context file. Existing approved identity and current published code were the grounding sources.

Read AUDIT.md for eight captured flow steps, findings, accessibility risks and limits. The full report with exact current screenshots is in the task outputs/design-review-2026-10-26/review-with-screenshots.md. Audit screenshots are from this run, not reused earlier QA. No credentials, pupil data, recordings or paid AI calls were used.

## Visual option mapping

The mapping is the actual order of displayed Image Gen results in the current conversation, not the older selected concept 1. See options.json. Each image is independent and was shown exactly once by the Image Gen tool.

1. direction-1.png: horizontal guided investigation sequence.
2. direction-2.png: experiment workbench with mission rail.
3. direction-3.png: folding investigation notebook.

All preserve the current white/navy/teal/amber identity, rounded headings, BM-first/English support, four missions, privacy and evidence constraints. They explore organization, not a new brand. The Echo pupil activity omits numeric delay, model speed/formula, distance controls and long timing explanations; those belong in a separate teacher area. Pupils compare materials, record their evidence and then explain it. No AI panel is inserted into Echo.

## Required implementation behavior after selection

Preserve drafts when changing steps, missions or language. A child can revisit earlier answers. Keep next action and inline validation close to the current question. Do not show a stronger/weaker result before the trial. Do not fabricate saved evidence, microphone data or AI feedback. Keep optional writing help collapsed and never prefill pupil answers. Group M4 recording/file/direct-observation choices. Keep teacher setup/code authentication and all existing backend limits unchanged. Recording/playback must stop on exit and mode/step changes as appropriate.

Correct necessary illustrative mock details while specifying functional states: mission order remains M1 vibration, M2 travel, M3 echo, M4 detective (the workbench mock visually reorders two links); continuation must be disabled or validate until required trials/answer are complete, regardless of a mock's enabled appearance; the rendered experiment must show only the selected material, not a composite wall/curtain preview. These are functional science constraints, not permission to change the selected layout arbitrarily. Echo teaching audio still needs an understandable concise disclosure; model numerics remain teacher-only. Existing automatic feedback is not available in M2/M3.

## Selection gate

Product Design ideate requires: After generating options, stop for the user's selection before any build work begins. Do not interpret an earlier selection of concept 1 from 25 October as selection from this new set. Once the owner chooses a displayed option, acknowledge it and follow image-to-code with the exact selected file. Review responsive behavior, keyboard/focus, clear stage actions, field error recovery, audio cleanup and saved evidence before release. No accessibility or pupil-comprehension certification is claimed.
