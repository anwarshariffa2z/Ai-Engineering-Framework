---
id: STD-0004
title: Evaluation Standard
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Development
tags: [evaluation, quality]
related: [reliability-standard.md, ../02-methodology/ai-system-lifecycle.md]
---

# Evaluation Standard

Evaluation provides decision-quality evidence that a system is suitable for a defined context. It is not a one-time benchmark score.

## Evaluation design

Before implementation, define the task, target users, expected behavior, unacceptable behavior, metric thresholds, baseline, sample-selection method, and reviewers. Build a representative evaluation set that includes routine, difficult, boundary, adversarial, and known failure cases. Keep test and development sets distinct when iterative tuning could otherwise overfit to the test set.

## Required dimensions

Every release MUST measure task success and reliability. It MUST also assess safety, security misuse resistance, and unsupported or misleading output when applicable. Assess fairness across materially affected groups when the system makes or supports decisions about people. Evaluate cost and latency against the intended service level.

## Evidence and release decision

Store the evaluation dataset version, configuration under test, methodology, raw or reproducible results, aggregate metrics, qualitative findings, limitations, and approver. A failing threshold requires a documented mitigation, constrained release, or rejection. Changes to a model, prompt, retrieval corpus, tool, policy, or workflow trigger proportional re-evaluation.

## Human review

Human raters require a written rubric, calibration examples, and a method for resolving disagreement. Automated judging may support scale, but its known error modes and validation against human judgment must be recorded before it is used as release evidence.
