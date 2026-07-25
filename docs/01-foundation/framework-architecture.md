---
id: DOC-0002
title: Framework Architecture
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Foundation
tags: [architecture, boundaries]
related: [ownership-model.md, ../ADR/README.md]
---

# Framework Architecture

An AI product is a socio-technical system: user experience, business rules, data, model behavior, human decisions, and operations jointly determine its outcome. The framework uses layered boundaries so each concern can change and be assessed independently.

## Logical layers

| Layer | Responsibility | Required boundary |
| --- | --- | --- |
| Experience | Collect intent, display results, communicate uncertainty, and obtain consent. | Never expose credentials, raw hidden instructions, or unreviewed sensitive output. |
| Orchestration | Select workflows, enforce policy, manage state, and route exceptions. | Treat all model output and external content as untrusted input. |
| Intelligence | Invoke models, prompts, retrieval, ranking, and deterministic validators. | Version prompts, models, retrieval configuration, and evaluation datasets. |
| Knowledge and data | Store approved sources, records, datasets, and provenance. | Enforce classification, retention, access control, and traceability. |
| Operations | Observe behavior, control release, manage incidents, and preserve evidence. | Separate telemetry needed for reliability from unnecessary personal data. |

## Control flow

Every consequential action follows this sequence: receive an authenticated request; classify context and risk; assemble only authorized context; generate or compute a candidate result; validate it against deterministic and policy controls; request human approval when required; execute or present the result; then emit minimal operational evidence.

## Architecture decisions

Use Architecture Decision Records (ADRs) for choices that materially affect security, privacy, evaluation, cost, vendor dependence, or operational behavior. ADRs are immutable historical decisions; a new ADR supersedes a prior one when the decision changes.

See [ADR-0001](../ADR/ADR-0001-framework-foundation.md) for the initial repository decision.
