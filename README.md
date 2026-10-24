# AI SoundLab — Misi Detektif Bunyi

**Status: PLANNING ONLY · 24 October 2026 · Asia/Kuala_Lumpur**

A proposed Year 4 science experience in which pupils investigate a school's mysterious sounds, test explanations, and design a quieter learning space. The competition category is Bahan Interaktif PdP Berbantukan AI, Selangor 2026.

**No application, prototype, model training, installation, deployment or runtime tests have been performed.** This repository contains the reviewable plan. Repository setup and planning issue creation are authorized. Implementation requires the owner's explicit approval.

## Read in this order

1. [Executive plan](docs/01-product-plan.md): outcomes, four missions, scope and lesson.
2. [Evidence and assumptions](docs/02-evidence-assumptions.md): recovered context, sources, unresolved decisions.
3. [Product Design process](docs/design/00-process.md) and [per-feature briefs](docs/design/01-feature-briefs.md).
4. [Architecture](docs/03-architecture.md), [AI and data protocol](docs/04-ai-data-plan.md), [ADRs](docs/adr/README.md).
5. [POC gates](docs/05-poc-gates.md), [QA matrix](docs/06-testing-matrix.md), [curriculum and assessment](docs/07-curriculum-assessment.md).
6. [Schedule](docs/08-delivery-schedule.md), [competition presentation](docs/09-competition-demo.md).
7. [Scoped backlog](docs/10-backlog.md), [Codex handoff](docs/11-codex-handoff.md), [risks](docs/12-risk-register.md).

## Dates and decision boundary

| Milestone | Date | Meaning |
|---|---|---|
| Registration closes | 26 October 2026 | From supplied announcement; cutoff time and required uploads unverified |
| Internal registration target | 25 October 2026, 18:00 MYT | Owner submits and retains acknowledgement |
| Event | 12 November 2026 | Setia City Convention Centre, from supplied announcement |
| Artifact submission | Unknown | Must verify separately; do not assume event day |

Register without waiting for a finished product if the official form permits it. Never claim registration was submitted by this agent.

## Proposed implementation, after approval

Static browser application; React + TypeScript + Vite; Web Audio; TensorFlow.js transfer audio classifier; local progress; no accounts or cloud audio. These are proposed choices pending POC evidence. The AI task is sound classification, not a general chatbot. Simulations and rule-based teaching feedback will be identified honestly.

Acceptance numbers in this plan are **targets, not measured results**. All issue titles remain prefixed with their planning/approval phase. See [AGENTS.md](AGENTS.md) for the implementation lock.
