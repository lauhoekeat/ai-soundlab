# Codex-ready handoff

Update 25 October 2026: the owner has now explicitly approved the bounded technical POC only. See docs/approvals.md and docs/evidence/poc-2026-10-25.md. Statements below about no POC approval describe the original 24 October handoff, not the updated approval state. Product implementation, visual selection and deployment remain unapproved.

## Current state

Planning delivered on 24 October 2026. Private repository: https://github.com/lauhoekeat/ai-soundlab. Authenticated connector and local GitHub CLI identity were verified as lauhoekeat. The connector exposed no repository-create tool in this session; an already-authenticated GitHub CLI created the repository. No additional sign-in or one-time setup was required. Planning documents and scoped issues are the deliverable; there is no application, trained model, tested UI, hosted site or measured performance.

Read AGENTS.md and docs/approvals.md first. No POC, visual direction, product development or deployment approval currently exists. Future dates, issue titles and the technical recommendations are not instructions to start coding.

## Owner review priorities

1. Registration now: inspect actual form and confirm the unknown artifact submission cutoff; target registration by 25 October 18:00 MYT.
2. Confirm Year 4, school stream, language, target device and available teacher time; BM/Windows assumptions are defaults.
3. Approve only the bounded POC if desired. Product approval occurs after measured gate review. Visual mockup selection must precede UI implementation.

## Copy-ready next Codex instruction — only send when approving POC

> Work in lauhoekeat/ai-soundlab. I explicitly approve the six-hour technical POC in docs/05-poc-gates.md only. Read AGENTS.md, record this approval with date/chat reference, and execute I03–I05 using adult-created object sounds on my confirmed device and a second device. Keep the product unbuilt. Produce actual independent test metrics, model/provenance and license notes, latency, offline/privacy evidence and a go/conditional/no-go report. Preserve failures and unknowns. Stop at the gate review and request my explicit product decision. Do not deploy.

This quoted text is a future prompt, not current authorization. Confirm hardware details with the owner if still unknown before collecting dependent evidence.

## Build instructions for a later approved product phase

Continue from the POC PR, do not restart from an unrelated generic template. Review measured results, update proposed ADRs and establish supported device/browser scope. Run Product Design visual exploration with three options and obtain selection before implementing F01–F09. The per-feature briefs define interaction intent, not approved artwork. Use licensed source assets or image generation as appropriate under the active skill.

Select exact dependency versions during approved work, then record lockfile and reproducible build instructions. Keep audio capture, inference, decision policy, mission rules and evidence storage separate. Commit small feature slices tied to stable backlog IDs and actual GitHub issues. Later establish CI for types/domain tests/build and attach real-device/manual evidence for audio, offline and teaching checks. Do not confuse mocked UI tests with model evaluation.

Preserve BM copy review, teacher curriculum signoff, explicit mode labels and report integrity. Any provider-backed AI change needs separate credentials workflow/approval and a revised ADR; no API credentials are required by the planned local model.

## Definition of ready

An implementation issue is ready only with phase approval, dependencies, selected visual target for affected UI, teacher-reviewed copy/learning criterion, observable acceptance and QA IDs. Missing data/hardware/consent blocks the dependent step, not all independent planning.

## Definition of done

Feature: acceptance passed, appropriate tests/evidence attached, matching-state visual comparison, teacher review where needed, docs/ADRs updated and PR linked. POC: gate report and owner decision, not a product. Release: QA checklist, supported devices/limits, exact build/model manifest, offline backup and actual owner release/deployment consent. Report failed/unrun checks accurately.

## One-time recreation only if this repository becomes unavailable

Repository creation is supported through the authenticated CLI used here, so the owner need not perform setup now. If recreating elsewhere: open GitHub's New Repository page, choose owner lauhoekeat, name ai-soundlab, select Private, enable Issues, and create an empty repository. Upload this complete planning folder including AGENTS.md and docs/; do not upload a nested .git folder. Recreate I01–I16 with titles/bodies from docs/10-backlog.md, update issue-index.md and verify file/issue visibility. If GitHub App access is restricted to selected repositories, add this repository in the app installation settings, then reopen it in Codex. Never create it under the other connected account.

## Unresolved facts to carry forward

Original assistant solution text unavailable; exact earlier mission design unknown. Registration form not retrievable in web tool; registration not submitted by this agent. Artifact deadline/rubric/team rules unverified. Current school DSKP edition, language, device and pilot permission unconfirmed. Every gate is NOT RUN; no visual direction is selected. These are explicit handoff facts, not omissions for the next agent to fill with guesses.
