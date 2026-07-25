---
id: STD-0005
title: Reliability Standard
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Development
tags: [reliability, operations]
related: [evaluation-standard.md, ../06-governance/incident-management.md]
---

# Reliability Standard

AI services MUST have explicit service objectives that cover availability, latency, quality, and cost where each is material. A single availability metric is insufficient when a system can respond quickly but produce unusable or unsafe results.

## Operational requirements

- Define timeouts, retries, idempotency behavior, rate limits, dependency fallbacks, and user-visible failure states.
- Provide a safe degradation mode for unavailable models, tools, or retrieval sources; do not silently substitute a materially different behavior.
- Version and retain release metadata so a production result can be associated with its configuration.
- Monitor request volume, error rates, latency, dependency failures, quality proxies, override rates, safety events, and unit cost.
- Test rollback and incident communication before a high-impact launch.

Alert thresholds must route to a named responder. If a quality or safety signal cannot be measured automatically, define a review cadence and a manual sampling method.
