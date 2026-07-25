---
id: ADR-0004
title: Depend on Artifact Types Rather Than on Producing Methodologies
version: 1.0.0
status: Accepted
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Event-driven
category: Architecture Decision Record
tags: [architecture, artifacts, interoperability, coupling, substitution]
related: [README.md, ADR-0002-requirements-as-metadata.md, ../01-foundation/framework-artifact-model.md, ../09-capabilities/CAP-0001-repository-audit.md]
---

# ADR-0004: Depend on Artifact Types Rather Than on Producing Methodologies

- Status: Accepted
- Date: 2026-07-25
- Owners: Framework Maintainers

## Context

The Repository Audit capability composes eleven methodologies in an order determined by which methodology's output another one needs. Security discovery needs the classification register that database discovery produces. Gap analysis needs everything before it.

If a consuming methodology depends on the methodology that produces its input, three consequences follow. No producer can be replaced without revising every consumer. Every producer change is a coordination event across the composition. And an organization that wants to substitute its own architecture review for the framework's must fork the entire downstream chain.

The alternative is that a consumer depends on the declared shape of the input, and remains indifferent to which methodology produced it. That is cheap to state and expensive to make true, because it raises questions a coupled design never has to answer: how a consumer locates an artifact whose producer it does not know, how it establishes that the artifact is one it can read, how it distinguishes an empty result from an absent producer, and how uncertainty in an input constrains the conclusions drawn from it.

Supporting analysis is in the [Framework Artifact Model](../01-foundation/framework-artifact-model.md), which designs the contract that answers those questions.

## Decision

A methodology depends on the artifact types it consumes. It does not depend on, reference as a dependency, or assume the identity of the methodology that produced them.

Artifact types are owned by the framework or by an extending namespace. They are not owned by the methodologies that produce them, because a methodology that owns its output type also owns its consumers, which is the coupling this decision removes.

## Consequences

Any methodology may be replaced by a conforming substitute that emits the same artifact types at compatible versions. Downstream methodologies require no change and need not be aware that a substitution occurred.

The composition can be validated before it is executed. Because producers declare the versions they emit and consumers declare what they read, an eleven-methodology audit that would fail at the ninth step because of an incompatibility fails at the first, before the work is spent.

Artifact types acquire an ownership obligation the framework does not currently satisfy. A type owned by nobody drifts in meaning, and meaning is the part of a contract that schema checking cannot protect.

The artifact interoperability contract becomes a prerequisite rather than an enhancement. Completeness states, version semantics, lineage, and the rules governing how evidence state and confidence propagate across a boundary are all required for this decision to be safe. In particular, without propagation rules a conclusion drawn from a low-confidence input can be recorded as high-confidence, and across eleven composing methodologies that is the default outcome rather than an unusual one.

Writing further methodologies before the contract exists would produce independently shaped outputs that cannot be composed. This decision therefore orders the artifact specification and contract standards ahead of the remaining discovery methodologies.

One question remains open and is recorded rather than resolved: the contract defines addressing within an audit run but not across repositories, so a consumer reaching an artifact produced elsewhere is undesigned. This blocks full execution of the Repository Audit capability more directly than the nine unwritten methodologies do.

## Alternatives Considered

**Direct dependency on producing methodologies.** Rejected. It prevents substitution, makes every producer change a coordination event, and grows coupling with the square of the composition size rather than linearly.

**A shared library of output shapes that methodologies import.** Rejected. Consumers would still be coupled to the library's version, so the coordination problem is relocated rather than removed, and a substitute producer would have to adopt the same library rather than merely satisfy the contract.

**Free-form outputs with consumers parsing what they find.** Rejected. It produces eleven mutually unintelligible formats and makes the distinction between an empty result and an absent producer undetectable, which is the interpretation failure most likely to yield a confident and wrong conclusion.

**Deferring the contract and writing the remaining methodologies first.** Rejected. Each methodology written without a contract fixes an output shape that later has to be renegotiated, so the cost of the contract rises with every methodology added before it.
