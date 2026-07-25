---
id: DOC-0004
title: AI System Lifecycle
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Methodology
tags: [lifecycle, delivery]
related: [delivery-evidence-checklist.md, ../06-governance/risk-management.md]
---

# AI System Lifecycle

The lifecycle is outcome-driven and iterative. A team may revisit an earlier stage when evidence invalidates an assumption, but it must retain the evidence that justified each release decision.

## 1. Frame

Define the user problem, intended users, non-goals, harm hypotheses, success metric, baseline, and accountable product owner. A system must not advance because a model demo appears compelling; it advances when the proposed intervention is measurable and proportionate to the problem.

## 2. Design

Describe the workflow, user control, data classes, model capabilities, failure modes, integrations, and human escalation. Select the risk tier under [risk management](../06-governance/risk-management.md) and record architecture decisions with material trade-offs.

## 3. Build

Implement the system with versioned configuration and access controls. Keep model/provider settings, prompts, retrieval sources, tool permissions, and policy rules independently identifiable so a release can be reconstructed and rolled back.

## 4. Evaluate

Evaluate representative cases before release. The evaluation must cover task success, safety, reliability, fairness where relevant, and adversarial or malformed inputs. Compare results to an accepted baseline and record limitations.

## 5. Release

Approve a release only when the owner accepts residual risk, operations can observe it, and rollback is feasible. Start with a bounded exposure when uncertainty is material. The release owner records the version, decision, evaluator, and evidence location.

## 6. Operate

Monitor leading and lagging indicators, including quality drift, safety events, latency, cost, user feedback, and human-override rates. Investigate threshold breaches under the [incident process](../06-governance/incident-management.md).

## 7. Improve or retire

Re-evaluate changes to data, prompts, models, workflows, or policy. Retire a system when its value no longer justifies its risk or operating cost, and preserve only evidence required by policy.
