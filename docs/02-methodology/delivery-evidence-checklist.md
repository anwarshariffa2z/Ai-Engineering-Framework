---
id: CHK-0001
title: Delivery Evidence Checklist
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Methodology
tags: [checklist, release, evidence]
related: [ai-system-lifecycle.md, ../06-governance/change-management.md]
---

# Delivery Evidence Checklist

Use this checklist as a release gate. “Not applicable” requires a written rationale from the accountable owner.

| Gate | Required evidence | Accountable role |
| --- | --- | --- |
| Problem framing | User outcome, baseline, success metric, non-goals, and impact assessment. | Product owner |
| Design | Workflow, architecture decision record where material, data classification, risk tier, and failure-mode analysis. | Technical lead |
| Build | Version identifiers for code, configuration, model, prompt, retrieval corpus, and policy; secrets managed outside source control. | Engineering lead |
| Evaluation | Dataset provenance, methodology, aggregate results, failing-case analysis, limitations, and acceptance decision. | Evaluation owner |
| Release | Rollback procedure, telemetry dashboard, on-call owner, user communication, and risk acceptance. | Release owner |
| Operation | Alert thresholds, review cadence, incident route, access review schedule, and change-management trigger. | Service owner |

A release cannot rely solely on a passing automated check. The accountable role confirms that evidence is representative of the release context and that residual risk is understood.
