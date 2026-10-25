# AI SoundLab · teacher guide

Open https://lauhoekeat.github.io/ai-soundlab/ . BM is the default; switch to EN for the full English interface. Use a current mobile/desktop browser on HTTPS. The app has no pupil accounts. Each device keeps its own anonymous evidence; there is no class-wide online aggregation.

## Before the lesson

Prepare a ruler with a safe free overhang and a supervised gentle plucking activity. Keep device volume low for optional synthetic echo playback; no shouting or headphone requirement. Confirm school recording/privacy permission. Record objects, not conversations or identifiable pupils. Explain that relative microphone levels are not calibrated dB SPL or hearing-safety measurements.

Use **Mod guru / Teacher mode** to show labelled examples. Teacher examples and student evidence are stored separately. Teacher mode is a demonstration switch, not an authenticated administrator role. Click the same toggle to return to student mode. For AI, privately obtain `CLASS_CODE` from the ignored local `proxy/.env`; this is the classroom access code, **not the OpenAI API key**. Share it only with the intended lesson group, never in a public repository or URL. Pupils enter it under the AI panel's code/consent disclosure. It remains in tab memory.

The hosted server is https://ai-soundlab-proxy.ai-soundlab.workers.dev . The app only needs this public URL. The owner’s computer and ChatGPT do not need to remain open for the hosted app to work. Server API credentials are in Cloudflare secrets, not the app or GitHub.

## Suggested teaching sequence

1. **Kenali Getaran / Discover Vibration (6.1.1).** Record a prediction and reason. Gently pluck the ruler and observe the vibrating part. Allow local microphone capture if appropriate; compare a quiet baseline and object sound on the same device/settings. Each recording stops after at most five seconds. Without a microphone, expand the physical-observation option and record actual observations. Explain how vibration relates to sound. Request optional AI-selected guidance, revise and save.
2. **Bunyi Bergerak / Sound Travels (6.1.2).** Predict whether listeners in every direction receive sound. Run the ideal model with equal distances, then change one listener distance and run again. Use the arrow keys on a selected range control or touch it. Compare arrival times; distant listeners receive the wavefront later. Both comparisons are needed for a mission evidence badge. Rings are wavefronts in a simplified 2D view of a 3D model, not particles travelling outwards.
3. **Cabaran Gema / Echo Challenge (6.1.3).** Predict, then run both hard-wall and soft-curtain experiments at the same distance. Changing distance resets the comparison. Observe outgoing/reflected paths and approximate round-trip delay. Optional playback is a quiet synthetic example, not a measurement of the room. Soft material absorbs some sound and can still reflect some. Give an everyday reflection example such as a cave echo or sonar. Radar is not a sound example.
4. **Detektif Bunyi AI / AI Sound Detective (6.1.4–6.1.5).** Record a safe local sound or make a supervised direct observation. The pupil supplies the source label and context, classifies its effect as useful/harmful/both, gives a reason, and proposes noise mitigation with a causal explanation. AI receives text only and does not identify the recording. Ask for guidance, revise and save.

Each mission follows prediction → investigation → observation → explanation → revision. Save creates/updates one evidence record per mission per mode; repeat clicks do not increase progress. The four evidence badges recognise investigation effort. They are not official PBD grades or mastery levels.

## AI and failure handling

AI uses the written answer to choose a versioned curriculum hint/question and a verbatim learner excerpt. The science wording comes from the reviewed bilingual bank. It can select an unhelpful concept, so the teacher remains the reviewer. No automatic environmental sound recognition, calibrated probabilities, diagnoses or formal marking are provided.

Explicit text-only consent and class code are required. If the code is wrong, quota is reached, network fails or AI times out, the pupil's answer remains available. Do not call a teacher example an AI response. The server allows only two feedback tasks and a fixed model; daily/monthly caps and per-minute limits apply. A busy classroom may need staggered feedback requests; do not raise usage limits without considering cost.

## Evidence, export and cleanup

Open **Buku Bukti / Evidence Book** to review the current device. Export JSON for optional teacher review. Audio and class code are excluded. Saved entries survive reload; unsaved edits receive a leaving-page warning. If storage fails, export the drafts before leaving; a blank saved timestamp denotes an unsaved draft in that emergency export.

After a group finishes, export if required and clear that mode's evidence with the confirmation control. Other mode's evidence is preserved. Exported files must be deleted separately. Raw audio stays in memory and is released on delete/reload/mission exit; microphone tracks stop on background/exit and capture limit. A PWA/offline restart guarantee is not provided. Already-loaded local activities can continue without AI; initial site load and AI need network access.

## Competition and validation limits

Owner reported the teacher device and a physical phone passed POC audio checks, and Science review was approved. Exact devices/browser versions and a pupil pilot were not supplied. Recheck the final deployed interface on intended devices before the event. Confirm organizer eligibility for a music teacher entering a Science resource and the exact submission deadline; neither registration nor eligibility confirmation was performed by this agent. The BM mapping uses the inspected KPM-authored 2018 DSKP, with school applicability approved via owner-reported review.
