---
id: PLB-0001
title: Incident Management
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Governance
tags: [incidents, response]
related: [change-management.md, ../04-development/reliability-standard.md]
---

# Incident Management

An AI incident is an actual or suspected event in which the system causes or materially risks harm, unsafe output, security or privacy failure, significant quality degradation, unauthorized action, or breach of a release control.

## Response

1. **Stabilize:** protect people and data; disable affected capabilities, restrict exposure, or switch to a safe fallback.
2. **Assess:** assign an incident lead; determine scope, severity, affected versions, data exposure, and whether notification duties apply.
3. **Communicate:** notify internal stakeholders and users through approved channels with facts, impact, and immediate guidance. Do not speculate.
4. **Recover:** remediate, validate the fix against the failure mode, and obtain release approval before restoring service.
5. **Learn:** complete a blameless review covering timeline, contributing conditions, detection gaps, corrective actions, owners, and due dates.

High-impact incidents require preservation of relevant configuration, evidence, and decision records. A corrective action is complete only when its effectiveness has been checked.
