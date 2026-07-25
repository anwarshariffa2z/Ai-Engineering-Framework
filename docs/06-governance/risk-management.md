---
id: DOC-0005
title: Risk Management
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Governance
tags: [risk, controls]
related: [change-management.md, ../02-methodology/ai-system-lifecycle.md]
---

# Risk Management

Risk is assessed from impact, autonomy, data sensitivity, scale, reversibility, and uncertainty. The purpose is to select controls that are strong enough for the consequence without turning routine work into ceremony.

| Tier | Typical characteristics | Minimum controls |
| --- | --- | --- |
| 1 — Limited | Informational assistance, public or low-sensitivity data, reversible outcomes. | Named owner, basic evaluation, logging, user feedback route. |
| 2 — Managed | Internal decisions or customer-facing output with material quality or privacy consequences. | Formal evaluation, data review, monitoring, rollback, documented risk acceptance. |
| 3 — High impact | Actions affecting rights, finances, health, safety, employment, legal position, or sensitive data; or meaningful autonomy. | Independent risk review, human approval or oversight, threat model, expanded evaluation, incident playbook, periodic review. |

The product owner proposes a tier during design. The technical lead and risk reviewer challenge the assessment when it understates likely harm. A tier can increase after new evidence, a material integration, scale expansion, or incident.

Risk acceptance records the use case, tier, residual risks, controls, decision maker, expiry or review date, and conditions that invalidate the decision.
