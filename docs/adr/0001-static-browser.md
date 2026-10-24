# ADR 0001 — Static browser application

Date: 24 October 2026. Status: PROPOSED; validate G1/G3/G4.

Context: short delivery window, shared school devices, uncertain venue network and no requirement for accounts.

Decision: React/TypeScript/Vite static web application, Web Audio, local evidence store and teacher review of the current device. Deployment target is intentionally unselected until release consent. No API key or backend required.

Alternatives: native app adds packaging/device friction; full-stack LMS adds auth/hosting/data scope; no-code slides are fast but do not establish reproducible live audio inference. A thin diagnostic harness is suitable only for the bounded POC.

Consequences: quick static delivery and offline potential, but no automatic class synchronization. Browser/device support and caching must be measured. Revisit if actual target hardware fails or cross-device teacher aggregation becomes a funded requirement.
