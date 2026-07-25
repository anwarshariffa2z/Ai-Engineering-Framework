---
id: STD-0003
title: Data Governance Standard
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Development
tags: [data, governance, privacy]
related: [evaluation-standard.md, security-standard.md]
---

# Data Governance Standard

## Requirements

1. A system MUST inventory each data source, its owner, purpose, classification, permitted use, retention period, and access path.
2. A system MUST use the minimum data necessary for the declared purpose and MUST not repurpose data without approval.
3. Personal, confidential, regulated, or customer-restricted data MUST have access controls appropriate to its classification and MUST not be placed in prompts, logs, or evaluation datasets without an approved basis.
4. Training, evaluation, and retrieval data MUST retain provenance sufficient to identify source, collection method, license or authorization, transformation, and version.
5. Systems MUST define correction, deletion, and access-request handling where applicable to the data subject or contract.

## Quality and lineage

Data stewards define validity, completeness, freshness, and bias-relevant checks for material datasets. Retrieval sources require an update owner and a mechanism to remove obsolete or unauthorized content. Derived data must link to the source version and transformation that produced it.

## Logging

Operational logs are not a default data lake. Record structured events needed for reliability, security, and auditability; redact or tokenize sensitive fields; restrict access; and expire logs according to the documented retention rule.
