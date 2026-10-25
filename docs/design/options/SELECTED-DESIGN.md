# Selected pupil interface · Concept 1

Selected by owner response “1”, 25 October 2026, current Codex chat. Exact target [concept-1.png](concept-1.png), native size 1448×1086; generated result `exec-1649a781-a109-447a-b1c1-af4b3a1e3b54.png`. The earlier draft with fictional class percentages is excluded. Image inspected directly at original detail. This specification preceded implementation. Current result: implemented and published; see ../../../design-qa.md and ../../2026-10-25/RELEASE-REPORT.md for verification and limits.

## Interpretation of the board

The top region is the primary M1 workspace. The lower strip specifies companion M2/M3/M4 workspaces and the teacher evidence view; it is not a requirement to stack five simultaneous active experiments on one pupil page. Mission navigation selects one main workspace. Teacher summary is a separate mode/view using the same component system and only the current device's records.

## Visual system

Lock true white page background. Ink navy headings and text; rich teal actions; pale blue observation/AI framing; amber explanation/evidence accents. Approximate sampled tokens to confirm against the image during implementation: text #102a50, primary #008e98, primary-dark #006b73, divider #e1e9f0, observation surface #edf7fc, AI surface #dff2fd, question surface #fff6df. Do not shift white to cream. Use 8px spacing rhythm, 16–24px inner spacing, modest 6–10px corners and light dividers. Avoid added marketing panels, gradients or class metrics.

Rounded humanist sans; body 18px, captions 14–16px, mission title about 42px and inquiry heading about 36px at desktop. Control font is explicit. Font choice and license remain implementation decisions, with matching shape/weight verified against reference. Icons are consistent outline waveform, wavefront/source, reflection, magnifier, open book, microphone, stop, export and evidence star. Use a matching licensed icon family, not emoji or arbitrary replacements. Logo lockup and ruler scene require faithful reusable assets.

## Desktop composition

At approximately 1440px: slim full-width navigation, brand left, mission tabs central, teacher/language controls right. Main investigation has three columns, approximately 45% illustration/context, 28% prediction/observation and 25% explanation/AI (remaining space is gutters). Use small shared panels only where the reference frames a task. Primary buttons span their task region; no card-within-card redesign.

Visible primary labels: AI SoundLab; Kenali Getaran; Bunyi Bergerak; Cabaran Gema; Detektif Bunyi AI; Buku Bukti; Mod guru; BM / EN. M1: “Apakah yang menghasilkan bunyi?”, “Petik pembaris perlahan-lahan. Perhatikan apa yang bergetar.”, “Ramalan”, “Pemerhatian”, “Penjelasan”, “Benarkan mikrofon”, “Isyarat relatif”, “Mikrofon belum aktif”, “Apakah yang bergetar?”, “Simpan bukti”, “Panduan dipilih AI”. Preserve hierarchy and framing; review BM/English equivalents with teacher.

## Responsive specification

- Tablet 768–1024px: brand/teacher/language on one row; mission tabs on a separately scrollable or wrapped navigation row. Main becomes context plus investigation in two columns. Preserve logical prediction → observation → explanation → AI order.
- Mobile 390px: single column, 18px readable body, 44px minimum controls. Mission tabs may scroll within their own labelled navigation, with keyboard focus visible. Page itself must not overflow horizontally. Show context/instruction, prediction, observation controls, explanation, AI, save/evidence. Stop remains in the recording region and reachable. Keep microphone permission/status text adjacent to the action.
- At 200% zoom, wrap/stack instead of clipping. Motion reduced preference uses static wavefront steps and pause controls. No essential meaning relies solely on audio, animation or color.

## Feature surfaces and actual states

M1: ruler scene supports a physical safe activity. Prediction is recorded before running the investigation. Inactive microphone graph is flat, with no live measurement claim. Active waveform and relative levels come only from capture. Denied/pending/no-device states preserve answers. Five-second maximum; stop on exit/background. Initial AI panel is an empty invitation, not prefilled feedback. Only an actual validated provider result may be labelled AI-selected. A labelled teacher example is distinct from measured evidence.

M2: top-down source/listeners, all-direction wavefronts, keyboard/touch position controls and distance values. Rings show a simplified 2D view of wavefronts in a medium, not travelling particles. Compare equal and unequal arrival distances. Static step/pause/reset supported. Do not turn companion art into a screenshot masquerading as a simulation.

M3: hard-wall/soft-curtain comparison, outgoing/return paths, distance slider and explicit simulation label. Approximate air delay 2d/343 seconds; animation time scaling is disclosed. Some sound may reflect from soft material. A short delay need not be heard as a separate echo. Low-volume playback only by user gesture.

M4: local five-second audio playback/delete, student-labelled source/context, useful/harmful/both with reason, practical mitigation with reason, explicit text consent and AI-selected guidance. Always disclose that AI has not heard audio. The image's illustrative six-second playback is not the functional duration requirement: real duration comes from the actual capped capture. No raw audio in persistence/export.

Teacher view: four mission rows, each derived from current-device evidence. “Belum disimpan” for empty rows; a completed state only after valid local save. Export JSON and clear controls. No class totals, cloud aggregation, pupil names, hearing-safety judgments or official PBD grades. Repeated saves cannot multiply evidence badge progress beyond the four distinct missions.

## Assets and implementation inventory

1. Main ruler/desk illustration in selected art direction, separate asset with suitable wide framing. No screenshot UI text baked into this asset.
2. Brand waveform mark/lockup, faithful asset or matching licensed icon plus code-native name.
3. M2 supporting listener illustration assets if retained; meaningful wavefronts/source positions remain code-native and interactive.
4. M3 wall/curtain material art only if needed; distance/path/delay controls remain code-native.
5. Shared UI icons from one licensed family; no generated raster button text.

Generate matching standalone raster assets and readable per-feature/mobile reference details before product coding, after remaining POC gates permit the phase. Preserve prompts/provenance and consuming paths. No asset generation, code changes or visual QA pass is claimed by this document.

## Acceptance and remaining gate evidence

Compare built screens with source at the same viewport/state. Inspect layout, typography, colors, spacing, image framing and icon treatment; check actual interactive mission flow, local-save badge behavior and AI provenance. Save a fidelity ledger and screenshots, fix material mismatches. Physical teacher/mobile audio/privacy and teacher curriculum/age review remain unresolved in POC-REPORT.md. Concept selection completes only the visual decision, not those validation steps.
