# Guided learning flow · option 2

The selected workbench is implemented as four stages per mission: Predict → Try → Explain → Save (Ramalan → Cuba → Terangkan → Simpan). The pupil sees one stage at a time. On desktop, Try places the experiment next to the observation. On a narrow screen, the observation follows the experiment in reading order. The mission rail becomes a labelled menu.

## Step behavior

| Stage | Learner action | Continue requires |
|---|---|---|
| Predict | Answer the inquiry and give a reason | Choice and written reason |
| Try | Carry out the physical/audio or simulation activity, then record an observation | Completed activity and written observation; M2 tests both distance layouts, M3 tests both surfaces |
| Explain | Explain using the observation; M4 also judges useful/harmful and proposes mitigation | Explanation; M4 classification and proposal |
| Save | Review own words and store evidence | Existing complete evidence contract |

Moving forward by stage button follows the same gates. Missing answers appear beside their control and focus moves to the first missing field. Moving backward, changing mission/language, and opening the teacher area keep the current in-memory drafts. The existing IndexedDB key (`mode:mission`), schema and export structure are unchanged. Unsaved drafts still warn before leaving the browser page. Only completed saved evidence earns a badge. Teacher example records remain in the separate teacher mode.

The optional writing help is collapsed and never inserted into a pupil answer. Guidance for M1/M4 follows the pupil's written explanation. It remains genuine secured text feedback through the existing proxy and requires a class code/consent. Audio and microphone signals stay on device and in memory. The M4 file/microphone/no-microphone choice reveals only the selected control; microphone capture ends when the component is left.

Echo shows one surface at a time, both trial states, blue outward and amber return paths, and an optional local teaching sound. Both materials use the same air-travel delay at the same distance; the audible return level differs. The child task has no numeric return time, formula, distance slider or pre-revealed stronger/weaker answer. Those details appear in teacher-only disclosures. The simulated audio and animation are slowed equally; the note says so without making the number a child task.

Teacher Space contains authenticated pupil class-code creation, mission demonstration, science guidance and the Echo model note. Entering teacher mode is a demonstration choice, not credential authorization; the proxy continues to require the private setup code to mint a class code. No backend, quota or origin setting changed in this redesign.

## Verification and known limits

See repository root `design-qa.md` and `docs/qa/2026-10-26-option2/`. Automated browser tests covered all four flows, evidence persistence, three supplied local `.m4a` files, teacher UI wiring, BM/EN and responsive widths. The browser class-code response was mocked for UI testing; live hosted-proxy security was already validated in the prior release. Physical device and child-comprehension checks for this redesigned interface remain teacher tasks. Exact organizer eligibility remains unresolved as described in the existing competition notes.
