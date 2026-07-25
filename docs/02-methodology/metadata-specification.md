---
id: STD-0010
title: Metadata Specification Standard
version: 1.2.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-26
review_cycle: Annual
category: Methodology
tags: [metadata, schema, representation, front-matter, standard]
related: [document-metadata-standard.md, document-id-standard.md, artifact-specification.md, validation-specification.md, ../01-foundation/framework-core-architecture.md, ../01-foundation/framework-artifact-model.md, ../ADR/ADR-0002-requirements-as-metadata.md, ../ADR/ADR-0003-normative-informative-separation.md, ../ADR/ADR-0004-depend-on-artifact-types.md]
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
    level: MUST
    check: mechanical
    severity: blocking
    scope: document
  - id: R-02
    level: MUST
    check: mechanical
    severity: blocking
    scope: document
  - id: R-03
    level: MUST
    check: mechanical
    severity: blocking
    scope: document
  - id: R-04
    level: MUST
    check: mechanical
    severity: blocking
    scope: value
  - id: R-05
    level: MUST
    check: mechanical
    severity: blocking
    scope: value
  - id: R-06
    level: MUST
    check: mechanical
    severity: blocking
    scope: value
  - id: R-07
    level: MUST
    check: mechanical
    severity: blocking
    scope: value
  - id: R-08
    level: MUST
    check: mechanical
    severity: blocking
    scope: value
  - id: R-09
    level: MUST
    check: mechanical
    severity: blocking
    scope: document
  - id: R-10
    level: MUST
    check: mechanical
    severity: blocking
    scope: vocabulary
  - id: R-11
    level: MUST
    check: mechanical
    severity: blocking
    scope: vocabulary
  - id: R-12
    level: MUST
    check: mechanical
    severity: blocking
    scope: vocabulary
  - id: R-13
    level: MUST
    check: mechanical
    severity: blocking
    scope: normativity
  - id: R-14
    level: MUST
    check: mechanical
    severity: blocking
    scope: normativity
  - id: R-15
    level: MUST
    check: mechanical
    severity: blocking
    scope: normativity
  - id: R-16
    level: MUST
    check: mechanical
    severity: blocking
    scope: requirement
  - id: R-17
    level: MUST
    check: mechanical
    severity: blocking
    scope: requirement
  - id: R-18
    level: MUST
    check: mechanical
    severity: blocking
    scope: requirement
  - id: R-19
    level: MUST
    check: mechanical
    severity: blocking
    scope: requirement
  - id: R-20
    level: MUST
    check: mechanical
    severity: blocking
    scope: requirement
  - id: R-21
    level: MUST
    check: mechanical
    severity: blocking
    scope: dependency
  - id: R-22
    level: MUST
    check: mechanical
    severity: blocking
    scope: dependency
  - id: R-23
    level: MUST
    check: mechanical
    severity: blocking
    scope: dependency
  - id: R-24
    level: SHOULD
    check: mechanical
    severity: advisory
    scope: dependency
  - id: R-25
    level: MUST
    check: mechanical
    severity: blocking
    scope: compatibility
  - id: R-26
    level: MUST
    check: mechanical
    severity: blocking
    scope: compatibility
  - id: R-27
    level: MUST
    check: mechanical
    severity: blocking
    scope: compatibility
  - id: R-28
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-29
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-30
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-31
    level: MUST
    check: mechanical
    severity: blocking
    scope: generated
  - id: R-32
    level: MUST
    check: mechanical
    severity: blocking
    scope: generated
  - id: R-33
    level: MUST
    check: mechanical
    severity: blocking
    scope: extension
  - id: R-34
    level: MUST
    check: mechanical
    severity: blocking
    scope: extension
  - id: R-35
    level: MUST
    check: mechanical
    severity: blocking
    scope: encoding
  - id: R-36
    level: MUST
    check: mechanical
    severity: blocking
    scope: encoding
  - id: R-37
    level: MUST
    check: mechanical
    severity: blocking
    scope: document
  - id: R-38
    level: MUST
    check: mechanical
    severity: blocking
    scope: migration
  - id: R-39
    level: MUST
    check: mechanical
    severity: blocking
    scope: vocabulary
  - id: R-40
    level: MUST
    check: mechanical
    severity: blocking
    scope: encoding
---

# Metadata Specification Standard

**Implements**

- [ADR-0002](../ADR/ADR-0002-requirements-as-metadata.md) — requirement declaration representation
- [ADR-0003](../ADR/ADR-0003-normative-informative-separation.md) — normativity declaration representation
- [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md) — dependency and compatibility representation
- [STD-0008](artifact-specification.md) — the canonical representation it defers to this standard

**Unblocks**

- STD-0007 Evidence and Confidence
- STD-0011 Contracts
- STD-0012 Validation
- Architecture Discovery refactor
- Database Discovery refactor
- Validator and registry generator

## 1. Purpose and Scope

*This section is informative.*

This standard defines the canonical representation of framework metadata. Where another standard states that something must be declared in metadata, this standard states how that declaration is written and how it is recognized.

**It formalizes representation only.** It does not define what an artifact is, what evidence means, or how validation behaves. Those belong to STD-0008, STD-0007, and STD-0012 respectively. Where this standard names a vocabulary owned elsewhere, it specifies the encoding and defers the meaning, and it says so at each point.

**In scope.** Value grammars; document front matter schema; controlled vocabularies for metadata-owned fields; normativity declaration schema; requirement declaration schema; dependency metadata; compatibility metadata; artifact metadata representation; provenance metadata for generated objects; extension and namespacing rules; encoding and ordering; and migration of existing documents.

**Out of scope.** Artifact semantics, evidence semantics, validator behavior, identifier allocation policy, serialization of artifact bodies, and storage or transport.

## 2. Terminology and Conventions

*This section is normative.*

`MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` carry their conventional meanings as stated in [Documentation Navigation](../README.md).

**Metadata** — machine-readable declarations attached to a framework object, distinct from its prose body.

**Front matter** — the metadata block at the head of a Markdown document.

**Key** — a named metadata field.

**Grammar** — the permitted textual form of a value.

**Controlled vocabulary** — an enumerated set of permitted values for a key. A vocabulary is *closed* when adding a value is a breaking change, and *open* when it is not, per STD-0008 section 13.

**Owned elsewhere** — a vocabulary or field whose meaning is defined by another standard. This standard specifies only its representation.

Requirements are identified as `R-nn`, declared in front matter with level, checkability, severity, and scope, per ADR-0002. A requirement is addressable as a fragment of this document, in the form `STD-0010#R-01`.

## 3. Relationship to the Document Metadata Standard

*This section is normative.*

[STD-0001](document-metadata-standard.md) states the obligation to carry metadata, the requirement that front matter agree with the registry, and the rule that version and last-updated change on substantive revision. Those are policy statements and remain in force.

This standard defines the schema those metadata conform to.

**R-01.** Where STD-0001 and this standard both address a key, STD-0001 governs the obligation and this standard governs the representation. A conflict between the two is a defect to be resolved by revision, not by preference.

**R-02.** This standard does not supersede STD-0001. STD-0001 is neither deprecated nor superseded by this document.

The division is deliberate but narrow, and section 18 records the risk that it will not hold indefinitely.

## 4. Common Value Grammars

*This section is normative.*

**R-04.** An **object identity** MUST match the form `PREFIX-NNNN`, where `PREFIX` is one to four uppercase Latin letters and `NNNN` is exactly four decimal digits. Permitted prefixes are governed by [STD-0002](document-id-standard.md), not by this standard.

**R-05.** A **version** MUST match the form `MAJOR.MINOR.PATCH`, each part a non-negative decimal integer without leading zeros.

**R-06.** A **date** MUST be an ISO 8601 calendar date in the form `YYYY-MM-DD`.

**R-07.** A **reference** MUST be either an object identity or a document-relative path resolving to a file within the repository. A reference MUST NOT be repository-root-relative.

R-07 removes an ambiguity that currently exists: `related` entries appear in both document-relative and repository-root-relative form, and a consumer cannot resolve them without knowing which convention an author used. Document-relative is canonical.

**R-08.** A **namespaced name** MUST match the form `namespace.name`, where `namespace` is a lowercase identifier reserved by an organization or plugin and `name` is a lowercase identifier. The namespace `framework` is reserved.

**R-35.** A **fragment address** MUST match the form `IDENTITY#FRAGMENT`, where `FRAGMENT` is the identity of a declaration within the referenced object.

## 5. Document Front Matter Schema

*This section is normative.*

**R-03.** Every framework document MUST carry front matter containing the eleven core keys named by STD-0001, in the order given below.

| Key | Type | Required | Grammar |
| --- | --- | --- | --- |
| `id` | identity | yes | R-04 |
| `title` | string | yes | non-empty, matches the registry entry |
| `version` | version | yes | R-05 |
| `status` | enum | yes | section 6.1 |
| `owner` | string | yes | non-empty |
| `created` | date | yes | R-06 |
| `last_updated` | date | yes | R-06 |
| `review_cycle` | string | yes | a cadence, or `Event-driven` |
| `category` | enum | yes | section 6.2 |
| `tags` | list of string | yes | lowercase, hyphen-separated |
| `related` | list of reference | yes | R-07 |

**R-09.** A document MAY carry additional keys defined by this standard, defined by another framework standard, or namespaced per R-08. Additional keys MUST follow the eleven core keys. An unrecognized namespaced key MUST NOT cause validation failure.

The additional keys this standard defines are `normativity` (section 7), `requirements` (section 8), `depends_on` and `references` (section 9), `compatibility` (section 10), `object_type`, `layer`, `context_cost`, and `meta_model_version`.

One further key is defined by another framework standard: `artifact_types`, by [STD-0013](artifact-type-declaration-standard.md) R-31. A framework key is not an extension key and is not namespaced; R-33 governs extension keys, which are introduced by organizations and plugins rather than by the framework.

R-09 resolves the open question of whether documents carrying declarations required by ADR-0002 and ADR-0003 remain conformant. They do: STD-0001 requires that the core keys be present and does not prohibit others.

## 6. Controlled Vocabularies

*This section is normative.*

### 6.1 Status

**R-10.** The `status` vocabulary is closed and comprises: `Draft`, `Approved`, `Accepted`, `Deprecated`, `Superseded`.

`Accepted` applies to Decision objects only, whose lifecycle is `Proposed → Accepted → Superseded` per [Framework Core Architecture](../01-foundation/framework-core-architecture.md) section 4.8.

**R-39.** A Decision MUST NOT use `Approved`, and a non-Decision object MUST NOT use `Accepted`.

Admitting `Accepted` records in the schema what the architecture already specifies and what every existing Decision Record already uses.

### 6.2 Category

**R-11.** The `category` vocabulary is closed and comprises: `Foundation`, `Methodology`, `Development`, `Governance`, `Reference`, `Roadmap`, `Example`, `Template`, `Capability`, `Audit Engine`, `Architecture Decision Record`.

`Capability` is admitted because [Framework Core Architecture](../01-foundation/framework-core-architecture.md) section 4.3 makes Capability a first-class object type. This closes the metadata half of the open exception recorded in the validation report; the identifier half is governed by STD-0002 and is not addressed here.

### 6.3 Object type

**R-12.** Where an object declares `object_type`, the value MUST be one of the eight types named in [Framework Core Architecture](../01-foundation/framework-core-architecture.md) section 4: `Standard`, `Methodology`, `Capability`, `Guide`, `Decision`, `Manifest`, `Artifact`, `View`. The vocabulary is closed.

`object_type` is optional for documents authored before this standard and required for objects created under it.

### 6.4 Vocabularies owned elsewhere

The following vocabularies appear in metadata and are **owned by other standards**. This standard specifies their encoding as lowercase or exact-case tokens as shown, and defers their meaning:

| Vocabulary | Values | Owner |
| --- | --- | --- |
| Evidence state | `Verified`, `Observed`, `Inferred`, `Unknown` | STD-0007 |
| Confidence | `High`, `Medium`, `Low` | STD-0007 |
| Completeness | `Complete`, `Partial`, `NotApplicable`, `Unavailable`, `Failed` | STD-0008 |
| Executor class | `human`, `agent`, `tool`, `hybrid` | STD-0008 |

## 7. Normativity Declaration Schema

*This section is normative.*

**R-13.** A document that contains numbered top-level sections MUST carry a `normativity` key mapping every such section number to either `normative` or `informative`.

**R-14.** The map MUST be total over the document's numbered sections: every numbered section MUST appear exactly once, and every mapped number MUST correspond to a section that exists.

**R-15.** The `normativity` map is authoritative. Any visible marker in the document body renders the map and MUST agree with it. A body marker MUST NOT be treated as a declaration.

The canonical form is a mapping of quoted section numbers to vocabulary values:

```
normativity:
  "1": informative
  "2": normative
```

Section numbers are quoted because they are identifiers, not integers, and a document may use compound numbering.

## 8. Requirement Declaration Schema

*This section is normative.*

**R-16.** A Standard MUST declare each of its requirements in a `requirements` list. A document that is not a Standard MUST NOT carry a `requirements` key.

**R-17.** Each declaration MUST carry `id`, `level`, `check`, `severity`, and `scope`.

| Field | Grammar | Vocabulary |
| --- | --- | --- |
| `id` | `R-nn`, two or more digits, unique within the document | — |
| `level` | enum, closed | `MUST`, `MUST_NOT`, `SHOULD`, `SHOULD_NOT`, `MAY` |
| `check` | enum, closed | `mechanical`, `judgment` |
| `severity` | enum, closed | `blocking`, `advisory` |
| `scope` | string | open vocabulary; the subject the requirement constrains |

**R-18.** A requirement identity MUST be unique within its document, MUST be stable across versions, and MUST NOT be reused after retirement.

**R-19.** Every declared requirement MUST be stated in a section declared `normative`. A requirement MUST NOT be stated in a section declared `informative`.

**R-20.** Every requirement stated in the body MUST have a corresponding declaration, and every declaration MUST have a corresponding statement in the body.

R-19 and R-20 together make the declaration set and the prose mutually verifiable: a requirement cannot be declared without being stated, stated without being declared, or hidden in explanatory text.

The `check` field records whether a requirement is mechanically evaluable. A requirement marked `judgment` is not thereby exempt from enforcement; STD-0012 determines how such requirements are handled, and this standard takes no position.

## 9. Dependency Metadata

*This section is normative.*

**R-21.** An object MUST distinguish dependencies from references. `depends_on` lists objects without which this object cannot be correct, complete, or evaluable. `references` lists convenience links that may break without invalidating the object.

**R-22.** Every entry in `depends_on` and `references` MUST be a reference per R-07.

**R-23.** Where an object declares `layer`, the value MUST be an integer from 0 to 4 corresponding to the layers in [Framework Core Architecture](../01-foundation/framework-core-architecture.md) section 8. An entry in `depends_on` MUST resolve to an object whose layer is strictly lower, except within layer 0 where same-layer dependency is permitted.

**R-24.** An object SHOULD list in `references` any materially coupled object that is not a dependency.

The existing `related` key does not distinguish the two, which makes the acyclicity invariant of the architecture unenforceable. Section 16 states how existing documents migrate.

## 10. Compatibility Metadata

*This section is normative.*

This section specifies how the compatibility declarations required by STD-0008 sections 12 and 13 are written. It does not define compatibility rules, which STD-0008 owns.

**R-25.** A producer MUST declare `produces`, a list in which each entry carries an artifact type identity and the exact type version emitted.

**R-26.** A consumer MUST declare `consumes`, a list in which each entry carries an artifact type identity, a major version, and a minimum minor version.

**R-27.** Where a consumer declares a consumption profile, it MUST appear as a `profile` member of the corresponding `consumes` entry, listing the field and record-group names read.

Vocabulary policy for an enumerated field, required by STD-0008, is declared in an artifact type definition as `vocabulary: closed` or `vocabulary: open`, and a consumer of an open vocabulary declares `on_unknown` naming its fallback.

`meta_model_version` declares the metadata model version an object targets, and is a version per R-05.

## 11. Artifact Metadata Schema

*This section is normative.*

This section specifies how the artifact envelope required by STD-0008 section 6 is represented. It does not define envelope semantics, which STD-0008 owns.

**R-28.** An artifact envelope MUST be represented as a mapping with the eight groups named by STD-0008 section 5: `identity`, `type`, `subject`, `scope`, `completeness`, `provenance`, `lineage`, `assessment`.

**R-29.** Envelope member names MUST be lowercase with underscore separation, and MUST correspond one-to-one with the members STD-0008 requires.

| Group | Members |
| --- | --- |
| `identity` | `run_id`, `artifact_type` |
| `type` | `type_version` |
| `subject` | `subject_ref`, `subject_revision` |
| `scope` | `declared_scope`, `exclusions` |
| `completeness` | `state`, `reason` |
| `provenance` | `producer_id`, `producer_version`, `executor_class`, `generated_at`, `authorization`, `redaction_state`, `environment` |
| `lineage` | `derives_from` |
| `assessment` | `evidence_state`, `confidence` |

**R-30.** Each entry in `derives_from` MUST carry the upstream run identity, artifact type identity, type version, subject revision, and the identities of the records that depend on it.

Record-level and evidence-level metadata are represented within the artifact body. Their required members are stated by STD-0008 sections 8 and 9; their meaning is owned by STD-0007.

## 12. Provenance and Validation Metadata

*This section is normative.*

This section specifies how provenance is represented on generated objects and what metadata a validator reads. It does not define validator behavior, which STD-0012 owns.

**R-31.** A generated object MUST carry `generated_by` with the generator identity and version, `source_revision`, and `generated_at` per R-06.

**R-32.** A generated object MUST carry `authored: false`. An authored object MUST carry `authored: true` or omit the key, which is equivalent.

R-32 makes the authored-generated separation of the architecture mechanically detectable, so that a hand edit to a generated object can be identified rather than assumed absent.

The metadata a validator consumes is the `requirements` list (section 8), the `normativity` map (section 7), `depends_on` and `layer` (section 9), and the compatibility declarations (section 10). No additional validation-specific metadata is defined here; a validator that needs more is describing behavior, which belongs to STD-0012.

## 13. Extension and Namespacing

*This section is normative.*

**R-33.** An extension key MUST be namespaced per R-08. An extension MUST NOT introduce an unnamespaced key, redefine a key defined by this standard, or add a value to a closed vocabulary.

**R-34.** A process that reads and re-emits metadata MUST preserve unrecognized namespaced keys unchanged.

Extensions may add keys, add values to open vocabularies, and add entries to lists whose vocabulary is open. The asymmetry is that they extend and never restrict.

## 14. Encoding and Ordering

*This section is normative.*

**R-36.** Front matter MUST be YAML, MUST be delimited by `---` on its own line at the start and end, MUST be the first content in the file, and MUST be encoded UTF-8 without a byte order mark.

**R-40.** Keys MUST appear in the order given in section 5, followed by additional keys, followed by namespaced keys. List values MUST use either inline bracket form or block form consistently within a single key. Scalar values requiring quotation MUST use double quotes.

**R-37.** A document's metadata MUST parse as well-formed YAML. A document whose front matter does not parse MUST be rejected rather than partially interpreted.

## 15. Conformance

*This section is normative.*

A document conforms when it satisfies R-03, R-09, R-13, R-14, R-36, and R-37, and its values satisfy the grammars in section 4 and the vocabularies in section 6.

A Standard additionally conforms when it satisfies R-16 through R-20.

An artifact conforms when its envelope satisfies R-28 through R-30.

A generated object additionally conforms when it satisfies R-31 and R-32.

An extension conforms when it satisfies R-33 and R-34.

## 16. Migration of Existing Documents

*This section is normative.*

Fifty-one documents exist that predate this standard. They carry the eleven core keys and carry neither normativity maps nor requirement declarations nor split dependency metadata.

**R-38.** A document authored before the approval of this standard is conforming under a transitional allowance until its next substantive revision, at which point it MUST be brought into conformance.

The transitional allowance covers the absence of `normativity`, `requirements`, `depends_on`, `references`, `object_type`, and `layer`. It does not cover any other non-conformance, and it does not apply to documents created after approval.

`related` remains valid during the transition and is superseded by `depends_on` and `references` as each document is revised. A document MAY carry `related` alongside the split keys during migration; where both are present, the split keys are authoritative.

Two documents are scheduled for conformance in the refactoring milestone: Architecture Discovery and Database Discovery. Remaining documents migrate through ordinary maintenance.

## 17. Examples

*This section is informative.*

A minimal conforming Standard front matter carries the eleven core keys, a `normativity` map covering its numbered sections, and a `requirements` list with one entry per stated requirement. The front matter of this document and of [STD-0008](artifact-specification.md) are working instances.

A generated registry carries `authored: false`, `generated_by` naming the generator and its version, `source_revision` identifying the revision the sources were read at, and `generated_at`. A reader encountering it can determine that hand edits will be overwritten.

A consumer declaring `consumes` with a profile reads only the fields it lists. A producer that removes a field absent from every declared profile breaks no consumer, and the union of profiles identifies which fields are load-bearing.

## 18. Informative Notes

*This section is informative.*

The division of responsibility in section 3 is narrow and deliberate: STD-0001 holds the obligation and the governance rule, this standard holds the schema. The division is defensible today because STD-0001 is short and states little about representation. It will become harder to hold as this standard grows, and a future revision may reasonably fold STD-0001 into it. That decision is not taken here, because merging or superseding a standard is a change to the corpus rather than to representation, and the framework has no supersession process defined for documents.

R-07 makes document-relative references canonical and prohibits repository-root-relative ones. Four existing entries use the prohibited form. They resolve correctly today only because the documents containing them sit at the repository root, where the two forms coincide. The transitional allowance in section 16 does not cover R-07, so those four entries are non-conforming from approval; they are corrected during migration of the documents that carry them.

The `authored` flag in R-32 exists because the architecture's authored-generated separation is otherwise a convention rather than a checkable property. A generated object that is hand-edited is the failure mode the separation exists to prevent, and without a declared flag no tool can detect it.

## 19. Related Documents

*This section is informative.*

- [Document Metadata Standard](document-metadata-standard.md)
- [Framework Document ID Standard](document-id-standard.md)
- [Artifact Specification Standard](artifact-specification.md)
- [Framework Core Architecture](../01-foundation/framework-core-architecture.md)
- [Framework Artifact Model](../01-foundation/framework-artifact-model.md)
- [ADR-0002: Express Requirements as Standard Metadata](../ADR/ADR-0002-requirements-as-metadata.md)
- [ADR-0003: Declare Normativity at Section Granularity](../ADR/ADR-0003-normative-informative-separation.md)
- [ADR-0004: Depend on Artifact Types](../ADR/ADR-0004-depend-on-artifact-types.md)
