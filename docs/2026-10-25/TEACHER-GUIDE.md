# AI SoundLab · teacher guide

Open https://lauhoekeat.github.io/ai-soundlab/ . BM is the default; switch to EN for the full English interface. Use a current mobile/desktop browser on HTTPS. The app has no pupil accounts. Each device keeps its own anonymous evidence; there is no class-wide online aggregation.

## Before the lesson

Prepare a ruler with a safe free overhang and a supervised gentle plucking activity. Keep device volume low for optional synthetic echo playback; no shouting or headphone requirement. Confirm school recording/privacy permission. Record objects, not conversations or identifiable pupils. Explain that relative microphone levels are not calibrated dB SPL or hearing-safety measurements.

Use **Mod guru / Teacher mode** to show labelled examples. Teacher examples and student evidence are stored separately. The mode switch alone does not grant access to code generation.

### Create a classroom code

1. In Teacher mode, expand **Urus kod kelas / Manage class code**.
2. Enter your private **Kod persediaan guru / Teacher setup code**. For this installation it is the existing `CLASS_CODE` in the ignored local `proxy/.env`. This is not the OpenAI API key. Never share this setup code with pupils.
3. Choose **Jana kod kelas / Generate class code**. The server verifies the setup code and creates a ten-character code valid for two hours. The private setup field clears after success.
4. Use **Salin kod / Copy code**, and share only that temporary code with your intended class. It is automatically ready for AI guidance in the teacher's current tab too.
5. Pupils enter it under **Kod kelas & persetujuan / Class code & consent** and tick text-only consent. Spaces, hyphens and lowercase typing are accepted for these ten-character codes.

A replacement invalidates the previous classroom code immediately. Re-enter the private setup code to replace it; at most ten codes can be issued per hour. All classroom codes share the existing AI usage budget. A pupil code cannot create codes. Nothing is stored in browser storage, exported evidence or URLs. Reloading clears the teacher's displayed code; a code already shared remains valid until expiry or replacement. School staff without the setup code should obtain it privately from their administrator, not paste secrets in chat.


The hosted server is https://ai-soundlab-proxy.ai-soundlab.workers.dev . The app only needs this public URL. The owner’s computer and ChatGPT do not need to remain open for the hosted app to work. Server API credentials are in Cloudflare secrets, not the app or GitHub.

## Suggested teaching sequence

1. **Kenali Getaran / Discover Vibration (6.1.1).** Record a prediction and reason. Gently pluck the ruler and observe the vibrating part. Allow local microphone capture if appropriate; compare a quiet baseline and object sound on the same device/settings. Each recording stops after at most five seconds. Without a microphone, expand the physical-observation option and record actual observations. Explain how vibration relates to sound. Request optional AI-selected guidance, revise and save.
2. **Bunyi Bergerak / Sound Travels (6.1.2).** Predict whether listeners in every direction receive sound. Run the ideal model with equal distances, then change one listener distance and run again. Use the arrow keys on a selected range control or touch it. Compare arrival times; distant listeners receive the wavefront later. Both comparisons are needed for a mission evidence badge. Rings are wavefronts in a simplified 2D view of a 3D model, not particles travelling outwards.
3. **Cabaran Gema / Echo Challenge (6.1.3).** Predict, then run both hard-wall and soft-curtain experiments at the same distance. Changing distance resets the comparison. Observe outgoing/reflected paths and approximate round-trip delay. Optional playback is a quiet synthetic example, not a measurement of the room. Soft material absorbs some sound and can still reflect some. Give an everyday reflection example such as a cave echo or sonar. Radar is not a sound example.
4. **Detektif Bunyi AI / AI Sound Detective (6.1.4–6.1.5).** Record a safe local sound, choose an existing sound file with **Pilih fail bunyi / Choose sound file**, or make a supervised direct observation. Imported files are decoded and played only on the device (maximum 10 MB, 60 seconds); they are not uploaded or automatically identified. File import is available only in Mission 4, so an unrelated recording cannot substitute for the ruler investigation. The pupil supplies the source label and context, classifies its effect as useful/harmful/both, gives a reason, and proposes noise mitigation with a causal explanation. AI receives text only and does not identify the recording. Ask for guidance, revise and save.

Each mission follows prediction → investigation → observation → explanation → revision. Save creates/updates one evidence record per mission per mode; repeat clicks do not increase progress. The four evidence badges recognise investigation effort. They are not official PBD grades or mastery levels.

## AI and failure handling

AI uses the written answer to choose a versioned curriculum hint/question and a verbatim learner excerpt. The science wording comes from the reviewed bilingual bank. It can select an unhelpful concept, so the teacher remains the reviewer. No automatic environmental sound recognition, calibrated probabilities, diagnoses or formal marking are provided.

Explicit text-only consent and class code are required. If the code is wrong, quota is reached, network fails or AI times out, the pupil's answer remains available. Do not call a teacher example an AI response. The server allows only two feedback tasks and a fixed model; daily/monthly caps and per-minute limits apply. A busy classroom may need staggered feedback requests; do not raise usage limits without considering cost.

## Evidence, export and cleanup

Open **Buku Bukti / Evidence Book** to review the current device. Export JSON for optional teacher review. Audio and class code are excluded. Saved entries survive reload; unsaved edits receive a leaving-page warning. If storage fails, export the drafts before leaving; a blank saved timestamp denotes an unsaved draft in that emergency export.

After a group finishes, export if required and clear that mode's evidence with the confirmation control. Other mode's evidence is preserved. Exported files must be deleted separately. Raw audio stays in memory and is released on delete/reload/mission exit; microphone tracks stop on background/exit and capture limit. A PWA/offline restart guarantee is not provided. Already-loaded local activities can continue without AI; initial site load and AI need network access.

## Competition and validation limits

Owner reported the teacher device and a physical phone passed POC audio checks, and Science review was approved. Exact devices/browser versions and a pupil pilot were not supplied. Recheck the final deployed interface on intended devices before the event. Confirm organizer eligibility for a music teacher entering a Science resource and the exact submission deadline; neither registration nor eligibility confirmation was performed by this agent. The BM mapping uses the inspected KPM-authored 2018 DSKP, with school applicability approved via owner-reported review.

## Clearer pupil questions (0.2.2)

Each mission now has two action steps, specific observation prompts and optional writing starters in BM/EN. Ask pupils to answer from their own investigation; the blanks are writing help, not extra required answers. Starters never fill the answer automatically. In M1, compare the moving ruler with the ruler after its movement stops. In M2, compare equal distances and one farther listener. In M3, keep distance fixed while comparing wall and curtain. In M4, identify who is helped/disturbed before suggesting one change. AI follow-up wording is simplified in feedback v5. See YEAR4-QUESTIONS.md for the changes and verification limits.

## Echo sound and guidance order (0.2.3)

Guidance follows the final explanation and requires the relevant written answers. For Echo, leave Simulation sound checked and press Run simulation, starting with low device volume. The curtain return is softer. Mute allows a silent visual investigation; pause/reset, distance or surface changes, background and mission exit stop playback.

Same-distance reflections through the same air have the same model return time for both surfaces. Materials change reflection strength in this model. Animation and example sound are slowed 30 times, clearly labelled. At 5 m the model value is 29.2 ms, illustrated with a return after about 0.875 seconds. This is not a demonstration of a distinct real-room echo at 5 m. Keep distance fixed when comparing materials.
