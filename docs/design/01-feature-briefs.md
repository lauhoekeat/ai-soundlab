# Feature-specific UX/UI briefs

All layouts below are prose specifications. They are distinct interaction briefs, not one generic card layout. Navigation shell: title, mission progress, persistent notebook link, current input mode, help and mute. Pupil path: welcome → audio check → case map → M1 → M2 → M3 → M4 → case report. Teacher can select any mission; presenter shortcuts do not fabricate pupil progress.

## F01 Welcome and device check — guided setup

**Job:** start safely and understand the mission in under two minutes. **Layout:** large illustrated case invitation beside a three-step checklist, not a dashboard. Primary “Mula siasatan”; “Panduan guru” secondary. Anonymous pair code is optional. No pupil name field.

**Sequence:** select sound/live or example mode → press “Uji bunyi” to unlock playback → explain mic purpose → explicit “Benarkan mikrofon” action → brief ambient check → ready. Do not prompt microphone permission on page load. Indicator states: belum aktif, sedang mendengar, dihentikan, mod contoh. “Hentikan mikrofon” remains visible during capture.

**Errors:** permission denied explains browser setting and offers examples immediately; no device offers example mode; busy device suggests closing another recording app; excessive background noise suggests turn-taking, not louder sounds. A pending permission dialog must not trap navigation. **Evidence:** only setup result and mode, no ambient recording. **Acceptance:** a first-time pair reaches M1 in ≤120s; denial path completes without reloading.

## F02 Case map — investigation navigation

**Job:** choose and resume an evidence file. **Layout:** accessible vertical route with four station panels and a compact progress list; decorative school map optional. Show next mission and collected evidence, never a maze. On phones use one station per row.

**States:** not started, in progress, evidence saved, needs explanation. Selecting completed mission opens review without overwriting evidence. Offer resume/new investigation; reset has confirmation because it clears local work. **Acceptance:** pair returns to last mission after refresh; teacher jump leaves a clearly labelled demonstration banner.

## F03 M1 Jejak Getaran — capture and evidence instrument

**Job:** compare a prediction with an AI hypothesis and identify the physical cause. **Layout:** left prediction choices with object labels; central listening instrument with relative envelope; right evidence strip containing pupil prediction, AI suggestion and observed vibration. Bottom explanation composer. On narrow screens the strip follows the instrument.

**Sequence:** choose prediction → “Dengar 3 saat” → stop playback before capture → show processing → stable AI suggestion or “AI belum pasti” → teacher/pupil safe vibration observation → explain → save. Allowed sound objects: gentle hand clap, pencil tap on desk, paper rustle. Avoid bangs, shouting, ear proximity and shared blowing instruments.

Show “Cadangan AI: tepukan” with qualitative confidence; teacher detail may expose model score with “not calibrated probability”. The envelope is labelled “paras relatif”, never dB SPL. It shows received signal variation; it does not visually prove the source is vibrating. Physical evidence can be a safe plucked ruler with adult supervision or a reviewed close-up video. Labels distinguish measured signal from illustration.

**Uncertain/wrong:** “Cuba sekali lagi atau gunakan sampel”; never automatically mark pupil wrong because AI disagrees. Pupil can record “AI tersilap” and justify. Background/multiple sounds request a single sound; retry is not penalized. Sample inference is clearly indicated. **Acceptance:** uncertainty path preserves prediction and allows learning completion; a wrong model output never awards or removes science marks.

## F04 M2 Peta Perjalanan Bunyi — spatial inquiry map

**Job:** reason about all-direction propagation. **Layout:** a 2D courtyard with a fixed source at centre, listener markers in several directions and a prediction sidebar. Accessible listener-position buttons duplicate dragging. This is a spatial workspace, not an audio-classification card.

**Sequence:** predict listeners → place at least three in different directions → “Uji ramalan” → optional outward pulse animation with synchronized static direction labels → compare → explanation. Keep distance constant for the initial comparison; distance extension is optional and qualitative. Caption “Simulasi pembelajaran, bukan ukuran sebenar.”

**Feedback:** if only one direction selected, ask who stands behind the source. Do not teach that sound travels only along animated lines or needs a visual line of sight. No mic-based location detection, exact distance levels or room-acoustics claims. **States:** placement incomplete, ready, running/paused, compared, explanation needed. **Acceptance:** keyboard user completes all placements and gets the same evidence; reduced-motion mode retains meaning.

## F05 M3 Rahsia Gema — A/B comparison bench

**Job:** distinguish a returning sound from a source repeating it. **Layout:** side-by-side A/B sound strips, an event timeline, a virtual surface selector and evidence comparison table. Stack A then B on phone; keep labels near replay controls.

**Sequence:** predict which sample includes a returning sound → replay matched direct/delayed-repeat examples → change one surface condition → compare → choose an echo example → explain. Label the delayed-repeat sample as an illustrative simulation. Do not attempt live classroom echo detection. Initial comparisons hold source/sample/volume constant.

**Feedback:** explain difference between reflection and a second source; no unsupported claim that soft material eliminates all reflection. Optional slower timeline is visual only, not a false change in measured speed. Hearing-access path uses described event timelines and equivalent reasoning. **Acceptance:** pupil cites delayed return and a plausible reflection setting; no overlapping sample playback; replay retains earlier observations.

## F06 M4 Selamatkan Zon Tenang — contextual planning board

**Job:** propose a quieter learning area without disabling useful warnings. **Layout:** school scene with selectable sound hotspots on the left, intervention tray centre and before/after reasoning board right. For keyboard use a numbered hotspot list and select/apply buttons. No generic “good/bad sound” sorting grid alone.

**Sequence:** inspect three scene cards → mark useful/disturbing/depends with reason → choose two interventions with an illustrative three-token budget → compare consequences → create plan. A bell is useful for a warning yet can disturb a lesson; reward context and explanation. Options include moving the reading zone, limiting simultaneous activities, maintaining equipment and soft furnishings. Unsafe options such as disabling alarms must trigger reviewed feedback and cannot count as the final plan.

Before/after displays predicted qualitative effects, not measured decibel reduction or verified soundproofing. Rule-based responses say “Petunjuk guru”, never “AI telah mengukur”. **States:** budget exceeded, explanation missing, competing tradeoff, revised plan, ready to report. **Acceptance:** two justified actions fit budget and preserve a warning function; undo does not erase previous reasoning.

## F07 Evidence notebook and report — reflection document

**Job:** turn interactions into a defensible explanation. **Layout:** timeline of evidence slips with prediction/observation/explanation/revision headings; final page is a readable case report, not a certificate-only result screen. Fields allow short BM text or teacher-entered note for an oral explanation; no audio recording required.

Auto-save after completed actions; show last saved status and storage failure. Review/edit never silently changes original prediction. Printable report contains anonymous code, four evidence summaries, hints used, AI mode/model version, pupil corrections and one limitation of AI. Export is a deliberate user action and previews content first. No names or raw audio. **Acceptance:** refresh/resume, clear/reset and print layout tested; export does not imply a central teacher database.

## F08 Teacher review — evidence table

**Job:** inspect local pair work, decide next teaching move and prepare a lesson. **Layout:** calm, denser table with mission, target code, evidence status, misconception, hints/revisions and teacher note. Detail drawer opens original work. Distinct from the illustrated learner workspaces.

MVP is the current device's sessions only; no live class synchronization. Teacher may read a printed/exported report from another device manually. A “teacher mode” switch is convenience, not authenticated security; sensitive records must not be stored. Filters for needs discussion/completed. No automatic official TP grade. **Acceptance:** teacher finds incomplete reasoning within 30s and can explain why a game badge is not a PBD result.

## F09 Presenter mode and recovery — demonstration controls

**Job:** demonstrate three representative moments and recover quickly at the event. **Layout:** compact presenter control panel with jump-to-mission, input source, cache readiness, playback mute and reset-demo controls. Pupil-facing view carries a mode badge. Preloaded fictional evidence is labelled “Data demonstrasi”.

Live capture, sample inference and recording-only playback are separate choices with separate labels. Offline readiness shows which required assets are cached; no false “ready” just because a service worker exists. Live failure offers sample in ≤10s. **Acceptance:** ten-minute offline rehearsal and three full demo runs; no stale cache/model mismatch; presenter jumps do not create assessment records.

## State and copy checklist across every feature

Each selected visual must specify empty/loading/ready/active/success/error/uncertain states where applicable, focus order, cancellation, small viewport, 200% zoom and reduced motion. Use friendly prompts: “Apakah buktinya?”, “AI mungkin tersilap”, “Semak semula ramalan”. Error text gives a recoverable action. Teacher reviews all language; product copy never exposes library names or implementation jargon unless in an optional technical evidence panel.
