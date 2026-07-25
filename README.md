---
id: DOC-0001
title: AI Engineering Framework
version: 1.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-26
review_cycle: Annual
category: Foundation
tags: [framework, overview]
related: [REF-0009, DOC-0002]
---

# AI Engineering Framework

The AI Engineering Framework is a practical operating system for designing, building, evaluating, deploying, and governing AI-enabled products. It turns high-level principles into repeatable engineering practices that teams can adopt across the product lifecycle.

## What this repository provides

- A shared lifecycle for AI systems, from problem framing through retirement.
- Decision records and architecture guidance for systems that include models, prompts, retrieval, tools, and human review.
- Standards for data, evaluation, reliability, security, privacy, and operational ownership.
- Governance processes that preserve delivery speed while making risk, evidence, and approvals explicit.

This is a framework repository, not a reference application. It defines the contracts and operating practices that implementation repositories should follow.

## Start here

1. Read the [framework architecture](docs/01-foundation/framework-architecture.md).
2. Apply the [AI system lifecycle](docs/02-methodology/ai-system-lifecycle.md) to a product initiative.
3. Use the [delivery evidence checklist](docs/02-methodology/delivery-evidence-checklist.md) at each release gate.
4. Use the [Document Registry](docs/DOCUMENT_INDEX.md) to locate governing standards and guidance.

## Repository map

| Path | Purpose |
| --- | --- |
| `docs/01-foundation/` | Core principles, architecture, and accountability. |
| `docs/02-methodology/` | Lifecycle, documentation, and delivery methods. |
| `docs/03-audit-engine/` | Audit Engine methodologies. |
| `docs/04-development/` | Data, evaluation, reliability, and security standards. |
| `docs/05-reference/` | Reference material intended to scale with the framework. |
| `docs/06-governance/` | Risk, change, and incident governance. |
| `docs/07-roadmap/` | Planned framework capabilities. |
| `docs/08-examples/` | Complete, reusable adoption examples. |
| `docs/09-capabilities/` | Capabilities that compose methodologies into an outcome. |
| `docs/10-artifact-types/` | Artifact type declarations governing methodology outputs. |
| `docs/ADR/` | Architecture Decision Records. |
| `tools/` | The reference validator and its configuration. |
| `.github/` | Contribution and automation configuration. |

## Principles

1. **Solve a verified user problem.** A model capability is not a product objective.
2. **Treat evaluation as an engineering asset.** Release confidence comes from representative evidence, not anecdotal demos.
3. **Design for bounded behavior.** Systems must fail safely, communicate uncertainty, and preserve human control where consequences warrant it.
4. **Make risk proportional.** Controls increase with impact, autonomy, data sensitivity, and irreversibility.
5. **Operate what you ship.** Every production system has named owners, telemetry, rollback paths, and retirement criteria.

## Status

The framework foundation is documented and ready for adoption. The Audit Engine is specified here as methodologies, standards, and artifact type declarations, and is validated by the reference validator in `tools/`. Producers that execute those methodologies belong to adopting repositories rather than to this one.

## License

Distributed under the [MIT License](LICENSE).
