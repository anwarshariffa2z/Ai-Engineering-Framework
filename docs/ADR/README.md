---
id: REF-0002
title: Architecture Decision Records
version: 1.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Reference
tags: [architecture, decisions, adr]
related: [ADR-template.md, ADR-0001-framework-foundation.md, ADR-0002-requirements-as-metadata.md, ADR-0003-normative-informative-separation.md, ADR-0004-depend-on-artifact-types.md]
---

# Architecture Decision Records

Architecture Decision Records preserve decisions that materially affect architecture, security, privacy, evaluation, cost, supplier dependence, or operations. Create a new ADR to supersede a decision; never rewrite an accepted record to erase history.

Use [the ADR template](ADR-template.md) and allocate IDs under the [Document ID Standard](../02-methodology/document-id-standard.md).

Each record decides one thing. Where a decision is supported by a design document, the record references it rather than restating it, so that the reasoning and the design remain separately maintainable.

| Record | Decision |
| --- | --- |
| [ADR-0001](ADR-0001-framework-foundation.md) | Establish a documentation-first framework |
| [ADR-0002](ADR-0002-requirements-as-metadata.md) | Express requirements as standard metadata rather than as rule objects |
| [ADR-0003](ADR-0003-normative-informative-separation.md) | Declare normativity at section granularity in every document |
| [ADR-0004](ADR-0004-depend-on-artifact-types.md) | Depend on artifact types rather than on producing methodologies |
