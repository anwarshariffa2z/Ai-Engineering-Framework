---
id: STD-0008
title: Artifact Specification Standard
version: 1.6.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-29
review_cycle: Annual
category: Methodology
tags: [artifacts, interoperability, versioning, contracts, standard]
related: [document-metadata-standard.md, document-id-standard.md, evidence-and-confidence.md, contract-specification.md, validation-specification.md, ../01-foundation/framework-core-architecture.md, ../01-foundation/framework-artifact-model.md, ../ADR/ADR-0002-requirements-as-metadata.md, ../ADR/ADR-0003-normative-informative-separation.md, ../ADR/ADR-0004-depend-on-artifact-types.md, ../ADR/ADR-0006-artifact-instance-identity.md, artifact-type-declaration-standard.md]
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
  "17": normative
  "18": normative
  "19": informative
  "20": informative
  "21": informative
requirements:
  - id: R-01
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-02
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-05
    level: MUST
    check: mechanical
    severity: blocking
    scope: run
  - id: R-06
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-08
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-09
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-10
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-11
    level: MUST
    check: judgment
    severity: blocking
    scope: artifact
  - id: R-12
    level: MUST
    check: mechanical
    severity: blocking
    scope: record
  - id: R-13
    level: MUST
    check: mechanical
    severity: blocking
    scope: record
  - id: R-14
    level: MUST
    check: mechanical
    severity: blocking
    scope: evidence
  - id: R-15
    level: MUST
    check: mechanical
    severity: blocking
    scope: evidence
  - id: R-17
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-18
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-19
    level: MUST
    check: mechanical
    severity: blocking
    scope: lineage
  - id: R-20
    level: MUST
    check: mechanical
    severity: blocking
    scope: composition
  - id: R-33
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-39
    level: MUST
    check: mechanical
    severity: blocking
    scope: transformer
  - id: R-40
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-41
    level: MUST
    check: mechanical
    severity: blocking
    scope: producer
  - id: R-42
    level: MUST
    check: mechanical
    severity: blocking
    scope: record
  - id: R-43
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-44
    level: MUST
    check: mechanical
    severity: blocking
    scope: record
  - id: R-45
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-46
    level: MUST
    check: mechanical
    severity: blocking
    scope: lineage
  - id: R-51
    level: MUST
    check: mechanical
    severity: blocking
    scope: extension
  - id: R-52
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-53
    level: MUST
    check: mechanical
    severity: blocking
    scope: run
  - id: R-54
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-55
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
  - id: R-56
    level: MUST
    check: mechanical
    severity: blocking
    scope: lineage
  - id: R-57
    level: MUST
    check: mechanical
    severity: blocking
    scope: artifact
---

# Artifact Specification Standard

**Implements**

- [ADR-0002](../ADR/ADR-0002-requirements-as-metadata.md) — requirements as standard metadata
- [ADR-0003](../ADR/ADR-0003-normative-informative-separation.md) — section-level normativity
- [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md) — depend on artifact types, not producers
- [ADR-0006](../ADR/ADR-0006-artifact-instance-identity.md) — logical identity, resolvable location, verifiable integrity

**Unblocks**

- STD-0010 Metadata
- STD-0007 Evidence and Confidence
- STD-0011 Contracts
- STD-0012 Validation
- Architecture Discovery refactor
- Database Discovery refactor
- The remaining discovery methodologies

## 1. Purpose and Scope

*This section is informative.*

This standard makes the [Framework Artifact Model](../01-foundation/framework-artifact-model.md) binding. It states what a framework artifact is and what every artifact must carry. How artifact types are declared and versioned is stated by [STD-0013](artifact-type-declaration-standard.md), per [ADR-0005](../ADR/ADR-0005-artifact-types-as-declarations.md).

It implements decisions already taken. It does not revisit them. Where a reader wants the reasoning behind a rule here, it is in the design documents referenced above, and this standard deliberately does not restate it.

**In scope.** Artifact identity, envelope, required and optional metadata, completeness declaration, evidence and confidence attachment points, content integrity, reference form, lineage, and artifact well-formedness.

**Out of scope.** The content of any specific artifact type; the methodologies that produce or consume artifacts; serialization format and file layout; the resolution of an identity to physical storage, which is deployment-specific data per [ADR-0006](../ADR/ADR-0006-artifact-instance-identity.md) and whose participant obligations are [STD-0011](contract-specification.md)'s; storage, transport, and access control; the canonical syntax for metadata, which [STD-0010](metadata-specification.md) defines; the meaning of evidence, confidence, and completeness, which [STD-0007](evidence-and-confidence.md) defines; and the obligations of producers and consumers, which [STD-0011](contract-specification.md) defines; and the declaration, versioning, and conformance of artifact types, which [STD-0013](artifact-type-declaration-standard.md) defines.

**On metadata representation.** Where this standard requires that something be declared in metadata, the canonical representation is defined by [STD-0010](metadata-specification.md).

## 2. Terminology and Conventions

*This section is normative.*

`MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` carry their conventional meanings as stated in [Documentation Navigation](../README.md).

**Artifact** — a structured output produced by executing a methodology or process against a subject.

**Artifact type** — the declared contract describing what an artifact of that kind asserts and what shape it takes. Its declaration is governed by [STD-0013](artifact-type-declaration-standard.md).

**Artifact instance** — one production of one artifact type, in one run.

**Envelope** — the universal, type-independent portion of an artifact.

**Body** — the type-specific portion of an artifact, composed of records.

**Record** — one assertion within a body, carrying its own evidence state, confidence, and evidence references.

**Run** — one execution of a capability or methodology against one subject at one revision. A run is a grouping and addressing context, not a framework object type.

**Producer** — the methodology, process, or tool that emits an artifact.

**Consumer** — any object or process that reads an artifact it did not produce.

**Requirements in this standard** are identified as `R-nn` and are declared in its front matter with their normative level, checkability, severity, and scope, per ADR-0002. A requirement's identity is stable and is addressable as a fragment of this document.

## 3. What Constitutes a Framework Artifact

*This section is normative.*

**R-01.** An artifact MUST consist of exactly one envelope and exactly one body.

**R-02.** An artifact MUST declare the artifact type it claims to be, and MUST conform to that type's declaration. What conformance consists of is stated by [STD-0013](artifact-type-declaration-standard.md) section 16.

**R-40.** An output that does not carry an envelope is not a framework artifact and MUST NOT be consumed as one, regardless of how well structured its content is. This applies equally to human-authored analysis, tool output, and material supplied by a requester: such material is an *input* to a producer and may be recorded as evidence, but it does not become an artifact until a conforming producer emits one.

The ownership, identity, and namespacing of an artifact type are stated by [STD-0013](artifact-type-declaration-standard.md) section 4.

**R-11.** An artifact MUST NOT contain secret values, credentials, connection strings, host endpoints, personal or regulated data, or subject record values. Structure may be described; content MUST NOT be reproduced.

R-11 is marked judgment-checkable because a mechanical check can detect known credential patterns but cannot determine whether a described structure discloses regulated content. Mechanical detection is required by STD-0012 as a partial control; it does not discharge the producer's obligation.

## 4. Artifact Type versus Artifact Instance

*This section is normative.*

An artifact type is declared, not defined in prose. Its identity, version, fields, vocabularies, completeness conditions, lineage, compatibility profiles, lifecycle, and conformance fixtures are all stated by [STD-0013](artifact-type-declaration-standard.md), per [ADR-0005](../ADR/ADR-0005-artifact-types-as-declarations.md). This standard defines the artifact instance and says nothing about the shape of any type.

**R-05.** Within a run, an artifact type MUST appear at most once.

**R-41.** A producer that would otherwise emit several artifacts of one type MUST instead emit one artifact whose declared scope covers their union. Consumers have no basis on which to merge partial artifacts of the same type, and a specification that permits them requires every consumer to invent a merge rule.

**R-06.** An artifact instance MUST be addressable as the pair of its run identity and its type identity. A record MUST be addressable within its artifact, and an evidence item MUST be addressable within its record.

The obligation on a consumer to address artifacts by identity rather than by path or producer is stated by [STD-0011](contract-specification.md) R-40.

**R-52.** An artifact instance identity MUST be composed of a subject authority, a subject name, a subject revision, a run discriminator, a type identity, and a type version, of which the first four compose the run identity and the last two compose the type identity that R-06 requires.

**R-53.** A run identity MUST comprise a subject authority, a subject name, a subject revision, and a run discriminator that distinguishes runs over the same subject at the same revision which differ in declared scope, authorization, or executor.

**R-54.** An artifact instance identity MUST be derivable from the components of R-52 alone, MUST NOT be allocated by a registry or a service, MUST NOT encode a host, a locator, a filesystem path, or a repository location, and MUST be reproduced exactly by a re-execution presenting the same components.

The subject authority is a namespace reserved by an organization, in the sense [STD-0010](metadata-specification.md) R-08 defines. The type identity and type version are the declaration's, per [STD-0013](artifact-type-declaration-standard.md). The canonical serialization of an identity is stated by [STD-0010](metadata-specification.md) R-41.

Identity is therefore derived rather than issued. Two parties that know the subject, the revision, the run, and the type compute the same identity without coordinating, and nothing has to allocate one before an artifact can be requested. Where a copy of an artifact can be fetched is a resolution, declared per run, and renames nothing when it changes. The obligation to declare a resolution and the duty on a consumer facing an unresolvable identity are stated by [STD-0011](contract-specification.md) R-52 and R-48.

Instances are not independently versioned. Their type is versioned; their identity is their run and type. Re-running a methodology produces a new run and therefore a new identity, not a new version of an existing artifact.

The obligation on an orchestrator to assign discriminators that do not collide is stated by [STD-0011](contract-specification.md) R-51. The rule by which a discriminator is derived from a run's declared scope and authorization is deliberately not stated here; section 20 records why.

## 5. The Universal Artifact Envelope

*This section is normative.*

**R-08.** The envelope MUST be interpretable without reference to the artifact's type definition.

This is the property that allows generic machinery — resolvers, validators, lineage checkers, staleness detection — to process artifacts of types it does not know. Under R-08 a consumer encountering an unknown type can still determine what the artifact describes, whether it is current, whether it is complete, and who produced it, and can therefore make a correct decision to reject it rather than a guess.

The envelope comprises nine groups: identity, type, subject, scope, completeness, provenance, integrity, lineage, and assessment. Sections 6 and 7 state which members of each group are required and which are optional. Integrity is a group of its own because a digest is neither a name nor a location: it is computed after the artifact exists, it changes whenever the bytes change, and collapsing it into identity would make an artifact unrequestable before it is produced.

**R-09.** A consumer MUST NOT infer an artifact's type, subject, or completeness from its body.

The duty to reject an artifact whose envelope cannot be parsed is validator behaviour and is stated by [STD-0012](validation-specification.md) R-09.

## 6. Required Envelope Metadata

*This section is normative.*

**R-10.** Every artifact MUST declare all of the following.

| Group | Member | Meaning |
| --- | --- | --- |
| Identity | Run identity | The run this artifact belongs to |
| Identity | Artifact type identity | The type this artifact claims to be |
| Type | Type version | The version of the type definition satisfied |
| Subject | Subject reference | What this artifact describes |
| Subject | Subject revision | The immutable revision examined |
| Scope | Declared scope | What was examined |
| Scope | Exclusions | What was not examined, and why |
| Completeness | Completeness state | One of the five values in section 10 |
| Completeness | Completeness reason | Required for every state other than Complete |
| Provenance | Producer identity | Recorded for traceability, never for dependency |
| Provenance | Producer version | The version of the producing methodology or tool |
| Provenance | Executor class | Human, agent, tool, or hybrid |
| Provenance | Generation time | When the artifact was produced |
| Provenance | Authorization boundary | The authorization in force during production |
| Provenance | Redaction state | Whether content was withheld, and of what class |
| Integrity | Content digest | A digest over this artifact's serialization, per R-55 |
| Assessment | Aggregate evidence state | The weakest state among load-bearing records |
| Assessment | Aggregate confidence | The lowest confidence among load-bearing records |

**R-55.** A content digest MUST be computed over the artifact's canonical serialization excluding the digest member itself, and MUST NOT be used as, or substituted for, the artifact's identity.

The exclusion is what makes the member computable at all: a digest taken over a serialization containing itself has no fixed point. The representation of a digest is stated by [STD-0010](metadata-specification.md) R-42. What a digest is for — deciding whether two byte sequences are the same artifact, and detecting that an upstream artifact was regenerated — is participant behaviour and is stated by [STD-0011](contract-specification.md) R-47 and R-49.

**R-17.** Where an artifact records any observation not derived from the subject's source, it MUST declare the environment in which that observation was made.

**R-42.** An artifact that mixes source-derived and environment-derived observations MUST attribute the environment per record, not only in the envelope.

Structure observed in one environment is not evidence about another.

**R-33.** An artifact MUST declare its redaction state.

The obligation on a consumer not to read redacted absence as absence is stated by [STD-0011](contract-specification.md) R-42.

## 7. Optional Envelope Metadata

*This section is normative.*

**R-18.** An artifact MAY declare the following. Where declared, each MUST carry the meaning stated here.

| Member | Meaning |
| --- | --- |
| Lineage | Upstream artifacts consumed, per section 11. Required when any record derives from an upstream artifact; optional only when none does |
| Environments inspected | The set of environments examined, where more than one |
| Input trust classes | The trust class assigned to each input relied upon |
| Run start and end | Execution window, for reproducibility |
| Estimated cost | Context or execution cost, for capability planning |
| Namespaced extension fields | Organization or plugin fields, per section 17 |

**R-43.** A producer that declares an optional member MUST populate it or omit it.

An optional member that is present but empty is not equivalent to an absent member.

## 8. Artifact Body Requirements

*This section is normative.*

**R-12.** Every record in a body MUST carry exactly one evidence state, drawn from the closed vocabulary in section 9.

**R-13.** Every record MUST carry a confidence level and at least one evidence reference, or MUST be marked Unknown.

**R-44.** A record marked Unknown MUST carry the scope reason that bounds the unknown.

A record marked Unknown asserts that a determination could not be made. A record with no evidence and no Unknown marking is not a conforming record, because it asserts something the artifact cannot support.

What absence of a record means is defined by [STD-0007](evidence-and-confidence.md) sections 6 and 8. The obligation on a producer to declare a scope adequate for absence to be interpretable is stated by [STD-0011](contract-specification.md) R-41.

## 9. Evidence and Confidence Attachment Points

*This section is normative.*

This section states where evidence and confidence attach. **STD-0007 defines the evidence model itself**, including the semantics of each state, the confidence levels, and the propagation rules. This standard does not define them and is not to be read as doing so.

**R-14.** Evidence attaches at record level. An artifact MUST NOT carry evidence that is not referenced by a record.

**R-15.** Every evidence item MUST carry an identity unique within its artifact, a source, a location, an environment, a revision or timestamp, a collector, and a redaction state.

Evidence identity being unique within its artifact makes an evidence item globally addressable by composition with its run, type, and record, without requiring a global evidence registry.

The evidence state vocabulary is **closed**: `Verified`, `Observed`, `Inferred`, `Unknown`. The confidence vocabulary is **closed**: `High`, `Medium`, `Low`. Adding a value to either is a major change to every artifact type that uses them, per section 12.

Confidence attaches at record level and is aggregated at envelope level per R-10. Aggregation takes the minimum over load-bearing records; it is not an average.

## 10. Completeness Requirements

*This section is normative.*

**The meaning of each completeness state is defined by [STD-0007](evidence-and-confidence.md) section 8** and is not restated here. This section states the obligations a producer and consumer carry with respect to those states. The conditions under which each state applies to an artifact type are stated once by [STD-0013](artifact-type-declaration-standard.md) section 9, and the obligation on a producer to assign a state under those conditions is its R-36.

**R-45.** An artifact MUST declare exactly one completeness state. The completeness vocabulary is **closed** and comprises `Complete`, `Partial`, `NotApplicable`, `Unavailable`, and `Failed`.

A consumer carries the following obligations:

| State | Consumer obligation |
| --- | --- |
| `Complete` | Interpret normally; absence means not-found-within-scope |
| `Partial` | Interpret present records; treat the unexamined boundary as Unknown; MUST NOT infer absence |
| `NotApplicable` | Treat as a valid finding; MUST NOT lower a score; MUST NOT report as a gap |
| `Unavailable` | Treat as missing input; MUST NOT interpret as absence of the thing |
| `Failed` | Treat as missing input; the failure MUST be surfaced |

The obligation on a producer to declare completeness honestly is stated by [STD-0011](contract-specification.md) R-05, and the obligation on a consumer to distinguish the states is stated by its R-13.

## 11. Lineage Requirements

*This section is normative.*

**R-19.** Where any record derives from an upstream artifact, the artifact MUST record the upstream address, its type and version, its subject revision, and which records depend on it.

**R-56.** The upstream address R-19 requires MUST be an immutable reference: an artifact instance identity with every component of R-52 bound, together with the content digest of the artifact it names.

A reference that leaves the run discriminator or the subject revision unbound — "the most recent run of this subject, this type" — is mutable and resolves differently over time. Both forms are legitimate, and lineage admits only the first. A mutable reference in lineage would allow an upstream input to re-point after a downstream conclusion had been drawn from it, which would leave R-19 lineage and [STD-0011](contract-specification.md) R-43 staleness detection without a subject.

**R-57.** A reference that leaves the run which produced it MUST carry a summary of the referenced artifact's envelope, comprising its identity, type version, subject revision, completeness state, redaction state, aggregate evidence state, and aggregate confidence.

R-57 gives a reference the property R-08 gives an envelope. A consumer can decide whether it is entitled to use an artifact without fetching it, and can therefore reject one it cannot fetch rather than guessing. A lineage edge is identity to identity, and an identity already carries a subject authority, so an edge leaving the repository is indistinguishable in form from one that does not; no further mechanism is required for cross-repository lineage.

**R-20.** The derivation graph across a composition MUST be acyclic.

The detection of a cycle, its timing, and the resulting failure are validator behaviour and are stated by [STD-0012](validation-specification.md) R-10 and R-11.

**R-46.** Lineage MUST be recorded per record where derivation is partial. An artifact in which some records derive from upstream input and others were independently established MUST NOT record blanket derivation, because doing so over-propagates the constraints of STD-0007 and understates conclusions that were independently supported.

Regenerating an upstream artifact renders every downstream artifact deriving from it stale. The obligation on a consumer not to present stale and current artifacts as concurrently valid is stated by [STD-0011](contract-specification.md) R-43.

## 12. Versioning Rules

*This section is normative.*

Artifact type versioning is stated by [STD-0013](artifact-type-declaration-standard.md): the version a declaration carries by its R-05, the classification of a change by its R-15 and R-24, the requirement that a different assertion take a new identity by its R-03, and deprecation by its R-27 and R-28.

The obligation on a producer to declare the exact type version it emits is [STD-0011](contract-specification.md) R-23, and the obligation on an artifact to record it is R-10 of this standard.

This standard states nothing further about type versioning. An instance is not independently versioned; its type is versioned, and its identity is its run and type, per R-06.

## 13. Compatibility Requirements

*This section is normative.*

**The obligations arising from compatibility are defined by [STD-0011](contract-specification.md) section 11** and are not restated here. The properties of a type that make compatibility determinable — closed and open vocabulary declarations, and declared consumption profiles — are stated by [STD-0013](artifact-type-declaration-standard.md) sections 8 and 12.

**Cross-revision consumption.** Consuming an artifact produced against a different subject revision than the current run is permitted only where declared.

The obligations arising from cross-revision consumption — declaring both revisions and the reason for reuse, and the confidence cap on any conclusion drawn from such an input — are stated by [STD-0011](contract-specification.md) R-44.

## 14. Producer Output Requirements

*This section is normative.*

A well-formed artifact carries the declared type identity at a compatible version, every field the type requires, correct use of closed vocabularies, a declared completeness state, and recorded provenance and lineage. Those properties are stated by the requirements in sections 3 through 12 of this standard.

**The obligation on a producer to emit such an artifact is stated by [STD-0011](contract-specification.md) R-23**, together with every other behavioural obligation of producers and consumers. This standard defines the artifact; the contract standard defines what a participant must do about it.

**Retired requirements.** The following identifiers are retired permanently and are not reused, per [STD-0010](metadata-specification.md) R-18.

| Identifier | Retired at | Relocated to | Reason |
| --- | --- | --- | --- |
| R-24, R-25, R-27, R-29, R-30, R-31 | 1.2.0 | STD-0011 | Participant obligations |
| R-38 | 1.3.0 | STD-0012 R-04, R-05 | Validator behaviour |
| R-07 | 1.4.0 | STD-0011 R-40 | Consumer obligation |
| R-16 | 1.4.0 | STD-0007 sections 6 and 8; STD-0011 R-41 | Semantics and producer obligation |
| R-28 | 1.4.0 | STD-0011 R-23 | Producer obligation, duplicated |
| R-34 | 1.4.0 | STD-0011 R-05 | Producer obligation, duplicated |
| R-35 | 1.4.0 | STD-0011 R-13 | Consumer obligation, duplicated |
| R-47 | 1.4.0 | STD-0011 R-43 | Consumer obligation |
| R-48 | 1.4.0 | STD-0011 R-44 | Consumer obligation |
| R-03, R-04, R-21, R-22, R-23, R-26, R-32, R-36, R-37, R-50 | 1.5.0 | STD-0013 | Artifact type declaration, per ADR-0005 |
| R-49 | 1.5.0 | Withdrawn | A data record has no sections to mark normative or informative |

R-09 and R-20 were narrowed rather than retired at 1.3.0, their validator clauses relocating to STD-0012 while their consumer and object clauses remain here. R-33 was narrowed at 1.4.0, its consumer clause relocating to STD-0011 R-42 while its declaration clause remains.

Twenty-five identifiers are now retired from this standard. Every retirement before 1.5.0 moved an obligation to the standard that owns it. The eleven retired at 1.5.0 were the only requirements this standard scoped to `artifact-type` rather than to an artifact, record, evidence item, run, producer, or transformer; STD-0013 restates ten of them and the eleventh, R-49, is withdrawn rather than moved because it constrained a prose document that no longer exists. STD-0013 section 18 maps each one.

What remains here is the artifact instance and nothing else.

## 15. Artifact Type Declarations

*This section is normative.*

An artifact type is declared as structured data governed by [STD-0013](artifact-type-declaration-standard.md), per [ADR-0005](../ADR/ADR-0005-artifact-types-as-declarations.md). Its required and optional declaration fields are that standard's sections 5 and 6, its carriage is its R-31, and the conformance relation between an instance and its declared type is its section 16.

This standard states no property of any artifact type. The obligation on an artifact to declare the type it claims and to conform to it is R-02, and everything that obligation resolves against is STD-0013's.

## 16. Validation Requirements

*This section is normative.*

Conformance fixtures are a property of a type declaration and are required by [STD-0013](artifact-type-declaration-standard.md) R-29 and R-30. The procedure by which a producer or consumer demonstrates conformance against them is validator behaviour and is stated by [STD-0012](validation-specification.md) section 10.

**Validator behaviour is not stated by this standard.** Rejection duties, fail-closed conditions, extension tolerance, coverage, severity, outcomes, exceptions, and reporting are all owned by [STD-0012](validation-specification.md).

## 17. Conformance Requirements

*This section is normative.*

An artifact conforms when it satisfies R-01, R-02, R-06, R-08 through R-15, R-17 through R-19, R-33, R-40, R-42 through R-46, and R-52 through R-57.

Producer and consumer conformance is not defined by this standard. Both are defined by [STD-0011](contract-specification.md) section 14, which owns participant obligations.

An artifact type declaration conforms when it satisfies the requirements of [STD-0013](artifact-type-declaration-standard.md) section 5 through section 15. This standard states no conformance criterion for a type.

How conformance is evaluated and enforced is defined by [STD-0012](validation-specification.md).

**Extension.** Organizations and plugins MAY add namespaced fields, record groups, values to open vocabularies, and artifact types.

**R-51.** An extension MUST NOT remove required fields, change the meaning of framework fields, add values to closed vocabularies, or weaken completeness or evidence semantics.

**R-39.** A process that reads and re-emits an artifact MUST preserve unrecognized namespaced fields unchanged.

A transformer that discards fields it does not understand silently destroys another party's data, and the loss surfaces far downstream of its cause.

## 18. Section Normativity Declaration

*This section is normative.*

**This section applies to every framework document.** It does not apply to an artifact type declaration, which is a data record with no sections, and which [STD-0013](artifact-type-declaration-standard.md) governs.

Per ADR-0003, every framework document declares the normativity of each of its sections in metadata. The declaration is authoritative; the italic marker beneath each heading in this document renders that declaration for a human reader and is not a second mechanism.

The prohibition on stating a requirement in an informative section is [STD-0010](metadata-specification.md) R-19. Any obligation appearing in one has no force.

The conceptual model for this declaration is in [Framework Core Architecture](../01-foundation/framework-core-architecture.md) section 12. **STD-0010 defines the canonical representation.** The front matter of this document demonstrates the intended shape.

## 19. Examples

*This section is informative.*

**A field is added.** A producer adds an optional field to an artifact type. Minor increment under [STD-0013](artifact-type-declaration-standard.md) R-15. Consumers whose declared profiles exclude the field are unaffected under [STD-0011](contract-specification.md) R-25. No coordination occurs.

**A field is removed.** A producer removes a field that one of four consumers reads. Major increment under [STD-0013](artifact-type-declaration-standard.md) R-24. Profile evaluation identifies the single affected consumer; three continue unchanged. Without profiles, all four would be revisited.

**A subject has no data stores.** The producer emits an artifact with completeness `NotApplicable` and a recorded reason. Under [STD-0011](contract-specification.md) R-13 consumers treat it as a valid finding, and it does not lower a score.

**A producer is unauthorized.** No artifact is emitted; resolution finds nothing. Consumers declare the input unavailable and mark dependent records Unknown. Structurally similar to the previous example, and correctly producing the opposite outcome.

**A producer is substituted.** An organization replaces the architecture producer with its own, emitting the same types at compatible versions. Under [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md) no downstream consumer changes, and none can detect the substitution.

**Two producers consume each other.** The lineage graph contains a cycle. Under R-20 composition fails before execution, naming both participants.

## 20. Informative Notes

*This section is informative.*

The requirement that the envelope be interpretable without the type definition (R-08) is what makes new artifact types additive. Resolvers, validators, staleness detection, and lineage checking are written once and never revised as types are added. A specification that placed subject or completeness inside the typed body would require every piece of generic machinery to understand every type.

The distinction between `NotApplicable` and `Unavailable` (R-35) is the interpretive rule most often lost in practice and the most expensive to lose. Both yield an empty record set. The first is a finding about the subject; the second is a hole in the audit. A framework that cannot distinguish them will eventually report a clean result for a domain nobody examined.

Honest completeness declaration is the conformance requirement most likely to be violated undetectably. A producer that examined half its declared scope and declared `Complete` is structurally valid and semantically corrupt, and no mechanical check can catch it. Conformance fixtures reduce the risk; they do not remove it.

Where artifacts are stored, and how a consumer reaches an artifact produced in another repository, was recorded as open in [Framework Artifact Model](../01-foundation/framework-artifact-model.md) section 19 and is decided by [ADR-0006](../ADR/ADR-0006-artifact-instance-identity.md): identity is logical, location is resolvable, and integrity is verifiable. This standard states the first and the third as properties of an instance, in R-52 through R-57. It states nothing about the second, because a resolution is deployment-specific data rather than a property of an artifact, and an identity that encoded one would be renamed every time the artifact moved.

**The run discriminator is a deferred implementation question, not an open architectural one.** [ADR-0006](../ADR/ADR-0006-artifact-instance-identity.md) considered making the discriminator a function of a run's declared scope and authorization, and deferred it because it would bind identity to fields whose canonical serialization is unspecified. R-53 states what a discriminator does, and [STD-0011](contract-specification.md) R-51 obliges an orchestrator to assign distinct ones; neither states how one is derived. A producer invoked with a discriminator supplied by its orchestrator needs no derivation rule, so nothing in the framework is blocked on it. What remains uncovered is a careless orchestrator issuing one discriminator for two runs, which R-51 forbids and no inspection of a single artifact detects.

## 21. Related Documents

*This section is informative.*

- [Framework Artifact Model](../01-foundation/framework-artifact-model.md)
- [Framework Core Architecture](../01-foundation/framework-core-architecture.md)
- [ADR-0002: Express Requirements as Standard Metadata](../ADR/ADR-0002-requirements-as-metadata.md)
- [ADR-0003: Declare Normativity at Section Granularity](../ADR/ADR-0003-normative-informative-separation.md)
- [ADR-0004: Depend on Artifact Types](../ADR/ADR-0004-depend-on-artifact-types.md)
- [Document Metadata Standard](document-metadata-standard.md)
- [Framework Document ID Standard](document-id-standard.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
