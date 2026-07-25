---
id: ADR-0002
title: Express Requirements as Standard Metadata Rather Than as Rule Objects
version: 1.0.0
status: Accepted
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Event-driven
category: Architecture Decision Record
tags: [architecture, requirements, automation, validation]
related: [README.md, ADR-0001-framework-foundation.md, ../01-foundation/framework-core-architecture.md]
---

# ADR-0002: Express Requirements as Standard Metadata Rather Than as Rule Objects

- Status: Accepted
- Date: 2026-07-25
- Owners: Framework Maintainers

## Context

The framework's requirements are written in prose. A validator cannot execute prose, so any automation must reimplement each requirement in code. Nothing then binds the implementation to the requirement it claims to enforce, and the two diverge without anything detecting it.

This is not hypothetical. A registry conformance defect was introduced, survived two commits, and was found only when an ad-hoc script was written — while the validation report continued to assert that the relevant check passed.

Two designs were considered for closing this gap. The first introduced a Rule object: one framework object per requirement, deriving authority from its parent standard, with validators binding to rule identities. The second expressed each requirement as a structured, individually addressable declaration inside its standard's metadata, with validators binding to fragment identities of the form `STD-0001#R-03`.

Supporting analysis is in the [Framework Core Architecture](../01-foundation/framework-core-architecture.md), which compares both options in detail.

## Decision

Requirements are expressed as structured declarations within a standard's metadata. The framework does not define a Rule object type.

Each declaration carries its own identity, addressable as a fragment of its standard; its normative level; its severity; its evaluation scope; and its checkability. A requirement that cannot be evaluated mechanically declares itself judgment-only rather than escaping enforcement by silence.

Authority remains with standards. No other object may state a requirement.

## Consequences

Validators bind to requirement identities rather than to reimplemented logic, so a check that no longer corresponds to a requirement is detectable rather than invisible.

A requirement and the text that authorizes it share one file and one version. Divergence between them is not merely discouraged but structurally impossible, which was the outcome the Rule object was intended to achieve.

The framework avoids adding an estimated one hundred and fifty to three hundred registered objects, each carrying metadata, lifecycle, and review burden, at current corpus size.

An organization adding requirements must add a standard in its own namespace rather than attaching rules to a framework standard it does not own. This is a deliberate restriction: a requirement without an authorizing standard has no traceable authority.

The artifact specification and metadata standards must define the shape of a requirement declaration before any validator can be built. This decision therefore blocks the validation milestone until those standards exist.

Existing standards state requirements only in prose and will require retrofitting before they are mechanically checkable. That work is scoped to the standards and refactoring milestones and is not addressed here.

## Alternatives Considered

**Rule as a first-class object type.** Rejected. The design that proposed it also specified that a rule has no independent authority, no independent ownership, and no independent lifecycle — each inherited entirely from its standard. An object with none of those properties is a field that has been given a file. Worse, separating a requirement from its authorizing text creates the divergence risk the object existed to prevent: two files, two versions, two edits that must stay synchronized.

**Prose requirements with hand-written validators.** Rejected as the status quo. It is the arrangement that allowed a conformance defect to persist undetected while a report asserted the opposite, and it provides no mechanism by which a reviewer can confirm that the checks and the standards still agree.

**A separate machine-readable rule file per standard.** Rejected. It reintroduces the two-file synchronization problem in a less visible form, since a rule file and its standard would be edited independently and reviewed separately.
