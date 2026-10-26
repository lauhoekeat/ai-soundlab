# Clearer Year 4 questions - 0.2.2 - 26 October 2026

Owner request: the questions were unclear for Standard 4 pupils. Issue #23.

## Editorial decisions

Keep the four DSKP learning goals, prediction/investigation/observation/explanation cycle and existing answer data. Use short concrete questions tied to the object, diagram or chosen sound. Give two numbered activity steps. Separate the main question from supporting prompts. Provide optional sentence starters with blanks; do not put them into the learner's answer. Explain vocabulary such as vibrating, useful and harmful. BM remains first; English has equivalent support. Do not claim an automatic reading-level score or proven pupil understanding.

| Mission | Earlier broad prompt | New focus |
|---|---|---|
| Vibration | What did you observe? | Watch the ruler after plucking, then describe what happens to the sound when its movement stops. Link movement and sound. |
| Travel | Explain direction and distance effects | Watch all four listeners, compare equal distances with one farther listener, then explain the direction of travel. |
| Echo | Explain reflection differences and an everyday example | Compare wall and curtain at the same distance, identify the stronger reflection, explain why and name a place with an echo. |
| Detective | Source label/context; mitigation proposal | Describe the chosen sound and place, say who is helped or disturbed, then suggest one change and explain how it helps. Unknown sources may remain unknown. |

The M4 prediction uses a school-bell example as optional thinking help; the investigation then asks about the pupil's own chosen sound. Terminology remains linked to the curriculum. Echo wording preserves separate hearing after the original sound, and soft material absorbs only some sound. No automatic sound-source identification was introduced.

## Implementation

Mission-specific copy is centralized in src/lab/questions.ts. Accessible labelled text fields associate their supporting prompts and optional writing starters through aria-describedby. Starters stay outside the value; language/mission switching preserves drafts. Removed duplicate simulation instructions now covered by the numbered steps. AI form validation messages are mission-specific rather than referring M1 pupils to Mission 4.

The authored bilingual AI feedback bank is revised for the same age group. Technical wording is replaced with concrete observations and one short follow-up question. Fixed model, concept allowlist, excerpt validation, credentials, quotas and audio privacy remain unchanged. Feedback version is sound-science-v5 so earlier v4 results are preserved as historical evidence. This is an editorial revision, not a claim of new teacher signoff or a pupil learning-outcome study.

## Verification

- 79 automated tests, strict TypeScript, production build and frontend credential-boundary check passed. All 12 bilingual feedback concepts still render bounded science text with exactly one follow-up question.
- All four mission screens checked in BM and English through the in-app browser: specific question, action steps and writing help visible, no framework overlay. Empty answers remained empty; no scaffold was inserted as an answer. An edited answer survived language and mission switching. Textarea description references were checked against actual DOM IDs.
- Responsive targets 1448x1086 desktop (1433px client/scroll width) and 390x844 mobile (375px client/scroll width); no document overflow. Default narrow in-app panel was also inspected. Temporary viewport overrides reset after capture.
- Both real hosted feedback paths returned v5: M1 2226ms, M4 1559ms in this small transport check. Worker version 3ca0a88d-0757-4f82-89aa-200620614967. No claim of general model accuracy or independent science signoff from these two calls.
- Screenshots saved to the parent workspace outputs as year4-questions-desktop.png and year4-questions-mobile.png. Browser plugin was not listed; existing CUA in-app browser controls were used without a CLI fallback. Production publication/check evidence is recorded in the linked PR and Actions run.

Pupil comprehension and the revised wording have not been trialled with a Year 4 class. Earlier teacher/device approval remains historical; no new physical-device or pupil-trial pass is invented.
