# ADR-0006 · AI selects grounded curriculum feedback

25 October 2026. Supersedes free-form tutor prose in ADR-0005 where they differ.

Measured problem: prompt v1 guessed a horn mechanism; v2's 12-fixture smoke run produced a self-contradictory radar acknowledgement, excessive questions and inappropriate frequency detail. V3 added stricter instructions/output validation, but fixture 3 failed response validation. Preserve those failures in science-smoke-results-v2.json and science-smoke-results-v3.json. No teacher science pass is inferred.

Decision: prompt v4 uses OpenAI Structured Outputs to select one of 12 curriculum concepts and copy a verbatim ≤120-character excerpt from the learner's text. Server validates both fields and exact excerpt membership, then renders the authored bilingual fact and next question. The frontend explicitly labels this **AI-selected curriculum guidance**. It is a real model-backed semantic selection, not simulated AI, automatic sound recognition or a silent fallback. A provider failure/schema mismatch remains an error and supplies no AI result.

Benefits: bounded facts, no invented source mechanisms, explicit unheard-audio handling, one authored follow-up question, reduced open-generation scope. Limits: the AI can choose an irrelevant concept; content bank and selection relevance still require teacher review. Feedback is less freely personalized than prose generation. New concepts/wording must undergo curriculum review and fixtures. No official PBD grading or sound-label inference.

Transport remains fixed Responses endpoint/model, store:false, ≤400 output-token ceiling, short response/body caps and durable pre-reservation quotas. API schema: concept enum plus evidenceExcerpt, no additional properties. Public response includes generationMode, concept and promptVersion for provenance; local saved evidence retains them. Raw provider output is not exposed to pupils.

Sources: [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), retrieved 25 October 2026; curriculum source in SCIENCE.md. Correct structure does not imply semantic correctness, hence the frozen selection fixtures and human gate.
