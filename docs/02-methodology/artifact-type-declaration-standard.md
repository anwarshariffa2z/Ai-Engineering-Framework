---
id: STD-0013
title: Artifact Type Declaration Standard
version: 1.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-29
review_cycle: Annual
category: Methodology
tags: [artifacts, declarations, types, validation]
related: [artifact-specification.md, metadata-specification.md, evidence-and-confidence.md, contract-specification.md, validation-specification.md, ../ADR/ADR-0005-artifact-types-as-declarations.md, ../07-roadmap/artifact-type-inventory.md]
depends_on: [artifact-specification.md, metadata-specification.md, evidence-and-confidence.md, contract-specification.md]
references: [validation-specification.md, ../ADR/ADR-0005-artifact-types-as-declarations.md, ../07-roadmap/artifact-type-inventory.md]
object_type: Standard
layer: 0
meta_model_version: 1.0.0
normativity:
  "1": informative
  "2": normative
  "3": normative
  "4": normative
  "5": normative
  "6": normative
  "7": normative
  "8": normative
  "9": normative
  "10": normative
  "11": normative
  "12": normative
  "13": normative
  "14": normative
  "15": normative
  "16": normative
  "17": informative
  "18": informative
  "19": informative
requirements:
  - id: R-01
    level: MUST_NOT
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-02
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-03
    level: MUST_NOT
    check: judgment
    severity: blocking
    scope: declaration
  - id: R-04
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-05
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-06
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-07
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-08
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-09
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-10
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-11
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-12
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-13
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-14
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-15
    level: MUST
    check: judgment
    severity: blocking
    scope: declaration
  - id: R-16
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-17
    level: MUST_NOT
    check: judgment
    severity: blocking
    scope: declaration
  - id: R-18
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-19
    level: MUST_NOT
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-20
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-21
    level: MUST
    check: mechanical
    severity: blocking
    scope: corpus
  - id: R-22
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-23
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-24
    level: MUST
    check: judgment
    severity: blocking
    scope: declaration
  - id: R-25
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-26
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-27
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-28
    level: MUST_NOT
    check: judgment
    severity: blocking
    scope: declaration
  - id: R-29
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-30
    level: MUST
    check: judgment
    severity: blocking
    scope: declaration
  - id: R-31
    level: MUST
    check: mechanical
    severity: blocking
    scope: declaration
  - id: R-32
    level: MUST
    check: mechanical
    severity: blocking
    scope: corpus
  - id: R-33
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-34
    level: MUST_NOT
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-35
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-36
    level: MUST
    check: judgment
    severity: blocking
    scope: artifact
  - id: R-37
    level: MUST
    check: judgment
    severity: blocking
    scope: record
---

# Artifact Type Declaration Standard

## 1. Purpose and Scope

*This section is informative.*

This standard owns every normative obligation that applies to artifact type declarations and to an instance's conformance with the type it claims. It is the standard [ADR-0005](../ADR/ADR-0005-artifact-types-as-declarations.md) requires.

The decision it implements rests on one principle: **standards own normative behavior; declarations own variability.** A rule that holds for every artifact type is stated here, once. What differs between types is data, stated once per type in a declaration. A declaration cannot be violated; a requirement can. That is the test that decides where anything belongs.

Consequently this standard states the obligation *"an instance carries every field its type declares required"* and never states which fields any type requires. Ninety-three artifact types are registered in the [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md); none of them appears in this document, and none of them repeats anything in it.

[STD-0008](artifact-specification.md) owns the artifact instance — its envelope, body, records, evidence, and lineage. This standard owns the type declaration and the conformance relation between an instance and its declared type. Where both address a subject, STD-0008 governs the instance and this standard governs the declaration.

## 2. Terminology and Conventions

*This section is normative.*

**Declaration** — a structured record that supplies the values a requirement in this standard ranges over, for one artifact type. A declaration states no obligation.

**Type identity** — the stable, namespaced name of an artifact type.

**Declared field** — a field name appearing in a declaration's `required_fields` or `optional_fields`.

**Subject noun** — what a type counts, used to make its completeness states interpretable.

`MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` carry their conventional meanings as stated in [Documentation Navigation](../README.md). Requirements in this standard are identified as `R-nn`, are declared in its front matter with their normative level, checkability, severity, and scope, and are addressable as fragments of this document, per [ADR-0002](../ADR/ADR-0002-requirements-as-metadata.md).

## 3. What a Declaration Is

*This section is normative.*

**R-01.** A declaration MUST NOT state a requirement, an obligation, or a prohibition.

A declaration supplies values. Where a declaration appears to constrain behaviour, the constraint is stated by a requirement in this standard and the declaration merely supplies its operand. The prohibition on a non-Standard carrying a `requirements` key is [STD-0010](metadata-specification.md) R-16 and is not restated here.

**R-02.** A declaration MUST be expressed as a structured record, not as prose.

Prose cannot be evaluated, and a validator that infers an obligation from prose evaluates a condition no requirement states, which [STD-0012](validation-specification.md) R-01 forbids.

## 4. Type Identity and Version

*This section is normative.*

**R-04.** A declaration MUST carry a `type` matching the grammar `framework.<domain>.<name>`, where `<domain>` and `<name>` are lowercase and contain only letters.

An extending organization uses its own root segment in place of `framework`.

**R-03.** A type identity MUST NOT be reused for a different assertion.

R-03 is judgment-checkable. Whether a new declaration asserts something different about a subject is a claim about meaning, and no inspection of the corpus at one revision reveals what an identity once denoted.

**R-05.** A declaration MUST carry a `type_version` in the form `MAJOR.MINOR.PATCH`.

**R-32.** A type identity MUST appear in exactly one declaration across the corpus.

A type declared twice has two contracts, and a consumer resolving it has no basis on which to choose.

An artifact type is addressed as `type@type_version` — for example `framework.database.entities@1.0.0`. The instance obligation to declare the exact type version it satisfies is [STD-0008](artifact-specification.md) R-10.

## 5. Required Declaration Fields

*This section is normative.*

**R-06.** Every declaration MUST carry all of the following.

| Field | Content |
| --- | --- |
| `type` | Type identity, per section 4 |
| `type_version` | Semantic version of this declaration |
| `lifecycle` | `active` or `deprecated`, per section 13 |
| `purpose` | What an instance of this type asserts about a subject |
| `contract` | What a consumer may rely upon, stated as a commitment |
| `producer_kind` | The kind of producer expected |
| `subject_noun` | What this type counts, per section 9 |
| `required_fields` | Record fields every instance carries |
| `evidence_bearing_fields` | Declared fields that carry or reference evidence |
| `fixtures` | Conformance fixtures, per section 14 |

**R-07.** `producer_kind` MUST name a kind of producer and MUST NOT name a methodology identity.

Naming a methodology would recreate the coupling [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md) removed, in the one place where it is hardest to see.

## 6. Optional Declaration Fields

*This section is normative.*

**R-08.** A declaration MAY carry `optional_fields`, `vocabularies`, `derives_from`, `consumption_profiles`, `completeness_notes`, `successor`, `deprecation_reason`, and `notes`. Where carried, each MUST carry the meaning stated by this standard.

**R-09.** A declared optional field MUST be populated or omitted.

An optional field present but empty is not equivalent to an absent one, mirroring [STD-0008](artifact-specification.md) R-43 for declarations rather than instances.

## 7. Instance Field Declarations

*This section is normative.*

**R-10.** `required_fields` MUST contain at least one entry.

**R-11.** A field name MUST NOT appear in both `required_fields` and `optional_fields`, and MUST NOT appear twice in either.

**R-12.** Every entry in `evidence_bearing_fields` MUST be a declared field.

## 8. Vocabulary Declarations

*This section is normative.*

**R-13.** Every entry in `vocabularies` MUST carry `field`, `kind`, and `values`.

**R-14.** `kind` MUST be `closed` or `open`. The vocabulary of kinds is closed.

**R-15.** A change adding a value to a closed vocabulary MUST be classified as a major change to the type version, and a change adding a value to an open vocabulary MUST be classified as minor.

R-15 is judgment-checkable because it constrains a change rather than a state, and the corpus at one revision does not record what a previous version contained.

**R-16.** Every `vocabularies` entry's `field` MUST be a declared field, and its `values` MUST contain at least one entry.

The obligation on an instance to draw a value from a declared closed vocabulary is R-34.

## 9. Completeness Conditions

*This section is normative.*

The meaning of each completeness state is defined by [STD-0007](evidence-and-confidence.md) section 8. This section states, once, the conditions under which each applies to any artifact type, which [STD-0008](artifact-specification.md) previously required every type to restate.

| State | Condition |
| --- | --- |
| `Complete` | The declared scope was examined in full and every instance of the subject noun found within it is recorded |
| `Partial` | The declared scope was examined in part; the unexamined boundary is recorded and is Unknown |
| `NotApplicable` | The subject contains no instance of the subject noun, established rather than assumed |
| `Unavailable` | A required input was absent, so the examination did not occur |
| `Failed` | The examination was attempted and did not complete |

**R-18.** A declaration MUST carry a `subject_noun` naming what the type counts.

Without it, `NotApplicable` and `Complete` are indistinguishable to a consumer: both yield an empty record set, and only the subject noun says whether that means the subject has none of the thing or the audit found none.

**R-17.** A declaration's `completeness_notes` MUST NOT contradict the conditions in this section.

R-17 is judgment-checkable. Notes narrow or illustrate a condition for one type; whether a narrowing has become a contradiction is a reading of meaning.

## 10. Evidence and Confidence Expectations

*This section is normative.*

Evidence semantics are [STD-0007](evidence-and-confidence.md)'s and attachment points are [STD-0008](artifact-specification.md) section 9's. Neither is restated here. This section states only what a declaration supplies.

**R-20.** `evidence_bearing_fields` MUST contain at least one entry.

A type no field of which carries or references evidence asserts nothing an auditor can trace, and no such type is conforming.

**R-19.** A declaration MUST NOT declare a confidence rule, an aggregation rule, or an evidence state vocabulary.

All three are framework-wide behaviour owned by STD-0007. A type that varied them would produce artifacts a generic consumer could not interpret, which is the property [STD-0008](artifact-specification.md) R-08 exists to protect.

## 11. Lineage Expectations

*This section is normative.*

**R-22.** Every entry in `derives_from` MUST be a type identity declared in the corpus.

**R-21.** The graph formed by `derives_from` across all declarations MUST be acyclic.

The per-instance lineage obligations, and the requirement that derivation be recorded per record where it is partial, are [STD-0008](artifact-specification.md) R-19 and R-46.

## 12. Compatibility and Consumption Profiles

*This section is normative.*

**R-23.** Every entry in `consumption_profiles` MUST carry `consumer` and `reads`.

**R-25.** Every entry in a profile's `reads` MUST be a declared field of the type.

A profile naming a field the type does not declare cannot be evaluated for compatibility, which defeats the purpose of declaring it.

**R-24.** A change that removes or narrows a field named in any declared consumption profile MUST be classified as a major change to the type version.

R-24 is judgment-checkable for the reason R-15 is: it constrains a change, and one revision of the corpus does not show what changed.

The obligations arising from compatibility for producers and consumers are [STD-0011](contract-specification.md) section 11's.

## 13. Lifecycle and Deprecation

*This section is normative.*

**R-26.** `lifecycle` MUST be `active` or `deprecated`. The vocabulary is closed.

**R-27.** A declaration whose `lifecycle` is `deprecated` MUST carry `successor` and `deprecation_reason`, and `successor` MUST be a type identity declared in the corpus.

**R-28.** A declaration MUST NOT be deleted.

Instances of a deprecated type remain valid and readable, and a consumer holding one must still be able to resolve its declaration. R-28 is judgment-checkable because deletion is an event and no state of the corpus records it.

## 14. Conformance Fixtures

*This section is normative.*

**R-29.** A declaration MUST carry `fixtures` covering exactly the five cases `normal`, `empty`, `not_applicable`, `partial`, and `boundary`.

**R-30.** Each fixture MUST state the expectation for that case in terms of the type's own declared fields and subject noun.

R-30 is judgment-checkable. A fixture that restates the general meaning of a completeness state rather than what this type looks like in that state is structurally present and substantively empty, and only reading it reveals which it is.

The procedure by which a producer or consumer demonstrates conformance against fixtures is validator behaviour and is stated by [STD-0012](validation-specification.md) section 10.

## 15. Declaration Carriage

*This section is normative.*

**R-31.** A declaration MUST appear as an entry in an `artifact_types` list in the front matter of a document whose `object_type` is `Guide`.

A declaration is data, not authority. Carrying it in a Guide keeps authority with this standard, and keeps the declaration out of the dependency graph: nothing depends on a Guide, and nothing needs to, because a consumer depends on a type identity rather than on the document that happens to carry it.

A document carrying declarations states no requirement and therefore carries no `requirements` key, per [STD-0010](metadata-specification.md) R-16.

## 16. Instance Conformance to a Declaration

*This section is normative.*

These are the requirements that range over declarations. They are the reason the declarations exist, and they are stated once for all ninety-three types.

**R-33.** An artifact MUST carry every field its declared type lists in `required_fields`.

**R-34.** A value of a field for which the declared type declares a closed vocabulary MUST be drawn from that vocabulary's `values`.

**R-35.** An artifact MUST NOT carry a record field that its declared type declares in neither `required_fields` nor `optional_fields`, except a namespaced extension field permitted by [STD-0008](artifact-specification.md) section 17.

**R-36.** An artifact's completeness state MUST be assigned under the condition this standard's section 9 states for it.

R-36 is judgment-checkable. A producer that examined half its declared scope and declared `Complete` is structurally valid and semantically wrong, and no inspection of the artifact reveals it.

**R-37.** A record whose evidence state is `Unknown` MUST NOT carry a value for a field in `required_fields` that its evidence does not support, and MUST omit that field rather than populate it.

R-37 qualifies R-33 and is the only qualification R-33 receives. A record marked `Unknown` reaches no conclusion — [STD-0008](artifact-specification.md) R-13 admits it on exactly that basis, and [STD-0007](evidence-and-confidence.md) R-38 forbids it a confidence. A type's `required_fields` list is written for a record that concludes, and most of what it names is the conclusion: an entity's deletion path, a dimension's calculated score. Requiring such a record to carry every one of them would leave a producer two options, both of which the framework forbids elsewhere — invent a value, which [STD-0011](contract-specification.md) R-05 forbids as a dishonest declaration, or suppress the record, which destroys the finding that the determination could not be made. R-37 states the third: carry the record, carry the fields the evidence does support, omit the rest, and bound the omission with the scope reason [STD-0008](artifact-specification.md) R-44 requires.

R-37 is judgment-checkable. Whether the evidence a record carries supports a value it also carries is a claim about meaning, and an artifact that omits a field and an artifact that fabricated one are equally well-formed. A validator that treats every field a record omits as licensed by R-37 has not evaluated R-37; it has assumed it. What a validator may do mechanically is stop applying R-33 to a record marked `Unknown`, which is what R-37 licenses and what [STD-0012](validation-specification.md) R-03 would otherwise forbid it from doing on its own authority.

`Unknown` is an evidence state and nothing more. It is not an absence, it is not a completeness state, and a record carrying it is a record: [STD-0008](artifact-specification.md) section 8 states this and this standard does not restate it. What each evidence state means remains [STD-0007](evidence-and-confidence.md)'s and is not affected by this requirement.

The obligation on an artifact to declare the type it claims and to conform to it is [STD-0008](artifact-specification.md) R-02; this section defines what that conformance consists of.

## 17. Validation Expectations

*This section is informative.*

Every requirement in this standard is bound by requirement identity, and a validator evaluates it by reading declarations as data rather than by holding knowledge of any type. Adding a type therefore adds no check.

The requirements in section 16 are evaluable only where artifact instances are present. In a corpus containing declarations and no instances they are reported `not-evaluated` with that reason, per [STD-0012](validation-specification.md), rather than assumed to pass.

Validator behaviour is not stated by this standard. Rejection duties, fail-closed conditions, coverage, severity, outcomes, exceptions, and reporting are owned by [STD-0012](validation-specification.md).

## 18. Relationship to the Artifact Specification

*This section is informative.*

Eleven requirements moved here from [STD-0008](artifact-specification.md), where they were the only requirements scoped to `artifact-type` rather than to an artifact, record, evidence item, or run. Their identifiers are retired there and are not reused, per [STD-0010](metadata-specification.md) R-18.

| Retired from STD-0008 | Now stated here as |
| --- | --- |
| R-03 | R-04, as a grammar rather than an ownership claim |
| R-04 | R-04 and R-03 |
| R-21 | R-05 |
| R-22 | R-15 and R-24, split by what changed |
| R-23 | R-03 |
| R-26 | R-13 and R-14 |
| R-32 | Section 9, stated once rather than per type |
| R-36 | R-27 |
| R-37 | Section 5 and section 6, as declaration fields |
| R-49 | Withdrawn; a data record has no sections to mark |
| R-50 | R-29 and R-30 |

The sixteen sections R-37 required of a prose type definition survive as declaration fields, except where the concern proved identical across every type. Evidence attachment, confidence aggregation, and the general form of the completeness conditions were identical in all ninety-three cases and are stated here once, which is the outcome the decision predicted.

## 19. Related Documents

*This section is informative.*

- [ADR-0005: Declare Artifact Types as Structured Data](../ADR/ADR-0005-artifact-types-as-declarations.md)
- [Artifact Specification Standard](artifact-specification.md)
- [Metadata Specification Standard](metadata-specification.md)
- [Evidence and Confidence Standard](evidence-and-confidence.md)
- [Contract Specification Standard](contract-specification.md)
- [Validation Specification Standard](validation-specification.md)
- [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md)
