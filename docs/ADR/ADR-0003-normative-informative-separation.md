---
id: ADR-0003
title: Declare Normativity at Section Granularity in Every Document
version: 1.0.0
status: Accepted
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Event-driven
category: Architecture Decision Record
tags: [architecture, normativity, documentation, ai-consumption]
related: [README.md, ADR-0002-requirements-as-metadata.md, ../01-foundation/framework-core-architecture.md]
---

# ADR-0003: Declare Normativity at Section Granularity in Every Document

- Status: Accepted
- Date: 2026-07-25
- Owners: Framework Maintainers

## Context

Framework documents mix binding requirements with rationale, examples, anti-patterns, and explanation in continuous prose. A reader cannot always tell which is which. Neither can an agent, and neither can a validator.

The consequence is measurable. The database discovery methodology runs to roughly eleven thousand eight hundred words, of which the binding requirements are a minority. An agent answering a conformance question must currently load the whole document to locate them, and a validator has no precise surface to bind to.

The framework's primary consumer is an agent with a bounded context window and no memory between sessions. Under those conditions, the inability to load only the binding subset of a document is not an inconvenience; it determines whether the framework is affordable to consult at all.

Supporting analysis is in the [Framework Core Architecture](../01-foundation/framework-core-architecture.md).

## Decision

Every framework document declares, in its metadata, which of its sections are normative and which are informative.

Two properties are separated and remain independent. An object's **type** declares its authority: a standard may assert requirements, a guide may not. A **section** declares its normativity: a standard may contain informative sections, clearly marked, and a guide may contain none that are normative.

Normativity is declared, never inferred from wording, position, or convention.

## Consequences

An agent can load the normative subset of a document rather than its entirety. On the framework's largest current document this is a several-fold reduction in context cost, achieved without rewriting any content.

Validators bind only to normative sections, so a check cannot accidentally enforce an example or an anti-pattern, and a reviewer can see precisely what is being enforced.

The ambiguity in the existing methodologies is resolved. A statement such as "prefer the narrowest conclusion supported by the evidence" is either binding or explanatory, and the document says which.

The metadata standard must carry a normativity map before this decision has effect. Every existing document requires a retrofit, which is scoped to the refactoring milestone for the two audit methodologies and to ordinary maintenance for the remainder.

A document type distinction that would otherwise have been necessary is avoided. Because normativity is a section property, explanatory material does not require its own object type merely to keep it separate from requirements.

Authors take on a new obligation. Marking a section normative is a decision with enforcement consequences, and marking one informative removes it from enforcement. Neither is a formatting choice.

## Alternatives Considered

**Type-level normativity only, with no section granularity.** Rejected. The existing methodologies demonstrate why: they contain both requirements and extensive explanation, and splitting each into two documents would separate a requirement from the reasoning that makes it comprehensible.

**Convention-based markers in prose, such as a normative-language keyword.** Rejected. Conventions are not machine-readable without heuristics, heuristics are wrong at the margins, and the margins are exactly where a validator's correctness matters.

**No separation, relying on reader judgment.** Rejected as the status quo. It fails the agent consumer entirely, and it leaves validators binding to whatever their author interpreted as binding.

**Separate normative and informative documents throughout.** Rejected. It doubles the document count, splits related material across files, and makes the informative half progressively easier to leave stale.
