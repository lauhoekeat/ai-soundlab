# ADR 0003 — Offline assets and minimal capture

Date: 24 October 2026. Status: PROPOSED; validate G1/G4.

Context: microphones can capture incidental speech and event internet may be unreliable.

Decision: explicit short capture, processing in memory, no raw-audio persistence/upload, release tracks on stop/exit/background. Cache versioned model, dependencies and content locally; offer anonymous structured evidence export. Privacy statement must accurately distinguish audio handling from static-host request metadata.

Alternatives: persistent raw recordings ease debugging but add unnecessary data risk; always-online CDN loading is simpler but unsuitable for the proposed offline demo; file-double-click distribution is not a supported mic deployment path.

Consequences: reproducibility uses adult fixtures and manifests, not pupil recordings. Offline readiness must check all assets and survive restart. First visit requires preparation/connection. Licenses may constrain redistribution of pretrained assets; review before shipping.
