---
id: EX-0001
title: System Evidence Record Example
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Example
tags: [evidence, release, example]
related: [../02-methodology/delivery-evidence-checklist.md, ../06-governance/risk-management.md]
---

# Example: System Evidence Record

This worked example shows the level of evidence expected for a managed-risk internal knowledge assistant. Names and values are illustrative; the structure demonstrates decisions that a real system owner must make.

## System identity

| Field | Record |
| --- | --- |
| System | Support Knowledge Assistant |
| Intended users | Internal customer-support specialists |
| Purpose | Draft answers from approved support documentation; the specialist reviews before sending. |
| Non-goals | It does not issue refunds, alter customer records, or send messages autonomously. |
| Risk tier | 2 — Managed |
| Product owner | Head of Support Operations |
| Service owner | Customer Platform Engineering Lead |

## Data and workflow

The assistant retrieves articles from the approved support knowledge base. Customer account fields are excluded from prompts. Access is limited to authenticated support specialists and honors the knowledge-base permissions of the requesting user. The interface labels drafts as AI-assisted and requires a specialist to edit or approve them before external use.

## Evaluation evidence

The evaluation set contains 240 historical, de-identified support questions selected across product areas, languages, and common escalation types. Reviewers use a rubric for factual support, policy alignment, completeness, citation quality, and escalation correctness. Release criteria require no critical policy error, at least 95% grounded responses, and no statistically meaningful regression against the approved baseline. Known limitations include incomplete coverage for newly launched products; those cases route to an escalation message until documentation is added.

## Release and operation

The release record identifies the application revision, model identifier, prompt revision, retrieval-index revision, and policy revision. The service owner can disable generation while retaining search. Monitoring tracks latency, retrieval failure, citation coverage, specialist rejection rate, user reports, and estimated cost. A weekly sample of approved drafts is reviewed for quality drift. A policy error or suspected confidential-data exposure invokes the incident process.

## Residual-risk decision

The product owner accepts the residual risk that drafts may be incomplete or require correction because a trained specialist reviews every external response and the workflow prevents autonomous account actions. This acceptance is reviewed quarterly and immediately after a material model, corpus, or workflow change.
