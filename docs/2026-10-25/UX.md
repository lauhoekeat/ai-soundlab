# Feature-specific UX and design brief

POC refinement: AI semantically selects a curriculum hint/question and a verbatim learner excerpt, rather than generating unconstrained science prose. Label this AI-selected guidance; see ADR-0006. Both provider failure and invalid selection stay explicit. Teacher must review bank accuracy and selection relevance.

## Shared shell and accessibility

BM-first, optional complete English copy. Large readable sans serif (18px body), 44px minimum controls, visible focus, keyboard alternatives, no color-only states. Responsive 390px, 768px and desktop; 200% zoom; reduced motion. No countdown, streak loss, leaderboard or encouragement to make loud sounds. Navigation names the mission and investigation step. Completed badges require saved learner evidence, not repeated clicks. AI response is visibly distinct from observation, simulation and teacher example.

Before class: choose teacher demonstration or student class; explain local-only audio and text sent to AI; enter access code only if enabling AI. No names or school identifiers. Student progress stays on the shared device: offer export and clear before changing groups. Teacher mode is a demonstration, not an administrative permission or dashboard of other devices.

## M1 · Discover Vibration / Kenali Getaran

Goal: infer vibration from a safe physical activity, not from a waveform alone (6.1.1).
Flow: predict what vibrates when a ruler is gently plucked → observe ruler → explicitly permit microphone → start local waveform → compare quiet/plucked levels on the same device → stop and release microphone → describe the vibrating object and evidence → request AI science feedback → revise → save evidence badge.

Workspace: time waveform with labelled axes; relative RMS/dBFS explanation; observation and explanation fields; clear Stop control; AI panel containing feedback and next question. Permission denied/no device/pending → explain retry or choose clearly labelled demonstration signal. No synthetic signal may be labelled microphone evidence. Stop on mission exit/background; permission timeout stops late-arriving streams. No dB SPL or hearing-safety inference. No FFT pitch promise for noisy audio.

## M2 · Sound Travels / Bunyi Bergerak

Goal: predict propagation in all directions (6.1.2).
Flow: predict which listeners hear a central bell → place/move four listeners by keyboard or touch → run a top-down expanding wavefront model → compare arrival ordering for equal/unequal distance → explain → revise.

Diagram labels source, listeners, distance, model time. Equal distance means equal arrival in the ideal model; do not claim all real listeners hear simultaneously at different distances. Rings are wavefronts in a simplified 2D view of 3D propagation, not air particles travelling with sound. Model requires a medium; no vacuum propagation. Allow pause/reset and static steps for reduced motion. This simulation is deterministic, not AI and not a microphone measurement.

## M3 · Echo Challenge / Cabaran Gema

Goal: explain reflection using an everyday phenomenon (6.1.3).
Flow: predict hard wall versus soft curtain → set distance and surface → send a low-volume synthetic pulse using explicit Play → compare outgoing/returning paths, model delay and return strength → record observations → explain a cave echo or sonar → save.

Use t=2d/343 seconds for an ideal air model, clearly described as an approximation. A nearby reflected sound need not be heard as a distinct echo. Soft material absorbs more in this simplified comparison; avoid binary claims that it never reflects. No radar example: radar uses electromagnetic waves. Keep actual playback distinct from the time-scaled animation. No unsafe shouting or headphone requirement.

## M4 · AI Sound Detective / Detektif Bunyi AI

Goal: justify useful/harmful sound in context (6.1.4), propose and explain a mitigation (6.1.5).
Flow: choose a safe adult-approved sound → consent to local recording up to 5s → listen locally/delete → student labels source, context, benefit/harm/both and reason → proposes a practical change → explicit text-only AI submission → feedback and next question → revise → save badge.

Workspace: local audio playback; prominent 'student-labelled, AI has not heard this audio'; contextual classification choices; reasoning/mitigation fields. Fallback without microphone: student describes or teacher supplies an explicitly labelled example, using the same reasoning flow. AI does not identify sources, measure hazard or diagnose hearing. Sirens can be useful while prolonged loud exposure can be harmful; labels are contextual rather than fixed object classes. Do not record conversations, other pupils or identifying information. Raw audio stays in memory and is excluded from IndexedDB and export.

## Notebook, modes and failure states

IndexedDB stores anonymous text answers, feedback provenance, mission ID and time; teacher can review on the same device and export JSON. Clear removes app records; exported files require separate deletion. Private browsing/quota/storage failures must show unsaved status. AI offline/quota/auth/timeout errors stay explicit and preserve answers; curated teaching hints may be offered under a 'teacher hint, not AI' label. No automatic resubmission or silent model retries.

## Visual exploration requirement

Three concept directions must be shown and selected by owner before pupil-facing implementation. Each set should carry the M1 investigation workspace, M2 spatial map, M3 comparison bench, M4 reasoning board, and teacher-summary treatment. Concepts are images, not working features. POC diagnostics may remain plain technical controls. Desktop 1440×1024 and narrow 390px behavior must be specified once selected.
