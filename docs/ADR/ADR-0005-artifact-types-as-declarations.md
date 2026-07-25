---
id: ADR-0005
title: Declare Artifact Types as Structured Data Governed by One Standard
version: 1.1.0
status: Accepted
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-26
review_cycle: Event-driven
category: Architecture Decision Record
tags: [architecture, artifacts, requirements, validation]
related: [README.md, ADR-0002-requirements-as-metadata.md, ADR-0004-depend-on-artifact-types.md, ../02-methodology/artifact-specification.md, ../02-methodology/metadata-specification.md, ../02-methodology/validation-specification.md, ../01-foundation/framework-core-architecture.md, ../07-roadmap/artifact-type-inventory.md]
depends_on: [../02-methodology/artifact-specification.md, ../02-methodology/metadata-specification.md, ../02-methodology/validation-specification.md]
references: [README.md, ADR-0002-requirements-as-metadata.md, ADR-0004-depend-on-artifact-types.md, ../01-foundation/framework-core-architecture.md, ../07-roadmap/artifact-type-inventory.md]
---

# ADR-0005: Declare Artifact Types as Structured Data Governed by One Standard

- Status: Accepted
- Date: 2026-07-26
- Owners: Framework Maintainers

## Context

Ten audit methodologies are approved and none is executable, because every one declares artifact types that do not exist. Ninety-three types are registered in the [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md) and none has been defined. Writing them exposed a contradiction the framework cannot resolve from within its current rules.

Four rules are individually correct and jointly unsatisfiable:

- [STD-0008](../02-methodology/artifact-specification.md) R-37 requires every artifact type definition to declare sixteen sections, one of which is **Validation Rules** — "the mechanical checks a conforming instance satisfies".
- STD-0008 R-49 requires each of those sections to be marked normative or informative.
- [STD-0010](../02-methodology/metadata-specification.md) R-16 permits only a Standard to carry a `requirements` key, and R-19 forbids stating a requirement in an informative section.
- [STD-0012](../02-methodology/validation-specification.md) R-01 forbids a validator from evaluating a condition that no requirement states.

A type's validation rules are normative: they say what a conforming instance must carry. Under R-19 they cannot sit in an informative section, and under R-16 they cannot be declared as requirements unless the document holding them is a Standard. If a type definition is not a Standard, its validation rules are prose no validator may act on — which is precisely the defect Milestone 8.1 closed for STD-0001 and STD-0002, reintroduced ninety-three times.

The [Framework Core Architecture](../01-foundation/framework-core-architecture.md) does not settle it. Its eight object types place `Artifact` at layer 3 as an instance — the output of a run against a subject. A type *definition* is none of those things: it is authored, versioned, human-owned, and lives in the framework repository rather than being produced by one. The object model has no slot for it.

The architecture is frozen and no ninth object type may be added, so the question is which existing arrangement absorbs artifact type definitions with the least damage.

One further fact bears on the decision: **STD-0008 section 15 has no implementations.** No artifact type definition has ever been written against it, so nothing in the corpus conforms to it and nothing breaks if it changes.

## Decision

Artifact types are declared as **structured data governed by one Standard**, not as one normative document per type.

A new standard owns every requirement that applies to artifact types and their instances. It states, once, the obligations that would otherwise be restated ninety-three times: that an instance carries every field its declared type requires; that a value in a closed vocabulary is drawn from that type's declared set; that a completeness state is assigned under the conditions the type declares; that a declaration carries identity, version, fields, vocabularies, completeness conditions, lineage constraints, and consumption profiles.

Each artifact type is a **type declaration**: a structured, individually addressable record carrying that data, versioned independently of the document that holds it, addressable as `framework.domain.name@version`.

Validators bind to the governing standard's requirements and read each declaration as data. A check is written once per obligation rather than once per type, and adding a type adds data rather than a normative document.

Authority is unchanged. Requirements remain the exclusive property of Standards, exactly as [ADR-0002](ADR-0002-requirements-as-metadata.md) established. No new object type is introduced, no layer changes, and no methodology gains the ability to state a requirement.

### The principle this establishes

**Standards own normative behavior; declarations own variability.**

This is the architectural pattern the decision rests on, and it generalizes beyond artifact types.

A rule that holds for every member of a family is normative behavior and belongs to a Standard, stated once. What differs between members of that family is variability and belongs to a declaration, stated once per member. The obligation *"an instance carries every field its type requires"* never changes and is a requirement. *Which* fields `framework.database.entities` requires changes as the domain is understood better, and is data.

Applying the split answers the question this record opened with. Artifact type declarations are not Standards because they contain no normative behavior — they contain only the values a Standard's requirements range over. A declaration cannot be violated; a requirement can. That is the test, and it is the reason declarations need neither requirement identities nor the authority that carries them.

The framework already works this way in two places without having named it. STD-0010 declares the closed vocabularies for `status` and `category` as data inside a Standard, and its requirements range over those values rather than restating them per value. [ADR-0002](ADR-0002-requirements-as-metadata.md) made the same move for requirements themselves, choosing structured declarations bound to an authorizing standard over one object per rule. This record names the pattern so that the next family the framework encounters is resolved by applying it rather than by rediscovering it.

The practical consequence for review is a question a maintainer can now ask of any proposed document: *does it state something that could be violated?* If yes, it is a Standard or belongs inside one. If it only supplies values, it is a declaration, and putting it in a Standard would bind slow-moving authority to fast-moving data.

## Consequences

The object model is untouched. Eight types, five layers, and the prohibition on any non-Standard carrying requirements all stand.

Adding an artifact type becomes a data change reviewed against one standard, rather than the authoring of a normative document. Ninety-three types cost one standard and ninety-three declarations instead of ninety-three standards and roughly fifteen hundred authored sections.

The validator gains generic checks that apply to every type, present and future. Under the rejected per-type-standard alternative, each new type would require its own checks or would rely on a validator inferring obligations that no requirement states, which STD-0012 R-01 forbids.

**STD-0008 section 15 must be revised.** R-37's sixteen sections were written for a prose document and become the required fields of a declaration; R-49, which marks sections normative or informative, does not apply to a data record and must be narrowed to documents. R-50's conformance fixtures remain required and attach to the declaration. This revision is the decision's real cost, and it is small only because nothing implements the section yet.

Several of R-37's sixteen concerns turn out to belong to the governing standard rather than to each type: evidence attachment points, confidence aggregation, and the general form of completeness conditions are identical across all ninety-three types. Stating them once is a consequence of the decision rather than a compromise within it.

`Guide` becomes the object type that carries machine-readable declarations, which stretches its stated role as explanation without authority. The authority remains with the governing standard and the declaration is the data that standard's requirements point at — the same relationship STD-0010 already has with the closed vocabularies it declares. This is the decision's weakest joint and is recorded as such rather than argued away.

Nothing in this record is implemented. The governing standard, the STD-0008 revision, and the ninety-three declarations are separate work.

## Alternatives Considered

**One Standard per artifact type.** Rejected, and it was the closest call. It preserves every existing standard's text exactly — STD-0008 section 15 would need no revision, because a Standard may hold sixteen normative sections and declare requirements without strain. It fails on scale and on category error. Ninety-three new Standards would put the framework's own governing documents in the same namespace, the same review cycle, and the same authority class as the field list for `framework.database.indexes`, and would defeat the traversal goal of one methodology, one standard, one template that the core architecture set. Standards change rarely and are reviewed by maintainers; artifact types change whenever a producer learns something new about its domain. Binding the two to one lifecycle makes the slower one govern the faster.

**One Standard per domain, holding that domain's types.** Rejected on a mechanical ground rather than a judgment: STD-0008 R-21 requires each artifact type to carry its own semantic version, and R-23 requires a type whose assertion changes to take a new identity rather than a major version. A document has one version. Ten types sharing one document cannot version independently, so any change to one type would force a version change readers must interpret as applying to the other nine. The grouping that makes the count manageable is the grouping the versioning rules forbid.

**A ninth object type for artifact type definitions.** Rejected twice over. The architecture is frozen against new object types, and the core architecture's own test in section 4.4 — that no two types may share a sentence describing their sole responsibility — would fail, because the new type's responsibility is normative authority over a bounded subject, which is exactly what Standard already owns. It also repeats the reasoning [ADR-0002](ADR-0002-requirements-as-metadata.md) used to reject the Rule object: an object whose authority derives entirely from elsewhere is a field that has been given a file.

**Artifact type definitions as `Artifact` objects with prose validation rules.** Rejected. It is the only alternative requiring no change anywhere, and it works by making every type's validation rules unenforceable. The framework spent Milestone 8.1 converting exactly this arrangement into bound requirements for STD-0001 and STD-0002, after a registry defect survived two commits while a report asserted the check passed. Reintroducing it at ninety-three times the scale, in the layer the framework exists to make trustworthy, inverts that work.

**Leave the contradiction unresolved and define no artifact types.** Rejected as the status quo. It leaves ten approved methodologies permanently unexecutable and CAP-0001 permanently unfulfillable, and it makes the framework's most-referenced concept the one thing it has never specified.
