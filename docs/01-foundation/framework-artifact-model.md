---
id: DOC-0007
title: Framework Artifact Model
version: 1.1.0
status: Draft
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-26
review_cycle: Event-driven
category: Foundation
tags: [architecture, artifacts, interoperability, versioning, contracts]
related: [framework-core-architecture.md, framework-architecture.md, ../09-capabilities/CAP-0001-repository-audit.md, ../03-audit-engine/01-architecture-discovery.md, ../03-audit-engine/02-database-discovery.md, ../07-roadmap/framework-architecture-review.md, ../ADR/ADR-0006-artifact-instance-identity.md]
---

# Framework Artifact Model

## 1. Purpose and Scope

This document designs the contract that allows independently developed methodologies to exchange artifacts safely and to version those artifacts over time.

It answers one question: **how does a methodology consume an artifact it did not produce, from a producer it does not know, without breaking when either side evolves?**

This is an architectural design document. It is not a standard, not a schema, and not an implementation guide. It uses contract language — "must", "never" — because a contract is what it describes, but nothing here is normative until a standard adopts it.

**In scope.** Artifact identity, structure, typing, versioning, compatibility, addressing, resolution, lineage, state propagation, provenance, extension, conformance, and failure semantics.

**Explicitly out of scope.** The content of any artifact type; the methodologies that produce or consume them; storage format, serialization, and file layout; access control and transport; and the normative standard that will eventually make this binding. This document defines the envelope and the rules governing it, never the payload.

**Why this exists now.** The [Repository Audit Capability](../09-capabilities/CAP-0001-repository-audit.md) requires eleven methodologies to exchange artifacts in a declared order. That ordering is undeliverable without this contract, which makes artifact interoperability a harder blocker than the nine unwritten methodologies. Writing more methodologies without it produces eleven incompatible output formats.

## 2. The Interoperability Problem

The framework's core architecture establishes that a methodology depends on **artifact types**, never on the methodologies that produce them. That single rule is what makes methodologies substitutable, and it is also what creates every problem this document solves.

If a consumer depended on a producer, coordination would be trivial and substitution impossible. Because it depends only on a type, five questions arise that a coupled design never has to answer:

1. **Resolution.** How does a consumer find an artifact it needs, without knowing who produced it?
2. **Compatibility.** How does it know the artifact it found is one it can read?
3. **Interpretation.** How does it distinguish "the producer looked and found nothing" from "the producer never ran"? Both yield an empty record set and mean opposite things.
4. **Propagation.** How does a conclusion drawn from an upstream artifact inherit that artifact's uncertainty rather than laundering it into false confidence?
5. **Evolution.** How does either side change without breaking the other?

A contract that answers only the first two is a schema. Answering all five is what makes it an interoperability model.

## 3. Core Model: Envelope and Body

**Every artifact is an envelope containing a typed body.**

The envelope is universal, identical in shape across every artifact type, and carries everything needed to identify, locate, validate, trust, and interpret the artifact. The body is type-specific and opaque to everything except its consumers.

This separation is the model's foundational decision. It means generic machinery — resolvers, validators, ledgers, lineage checkers, staleness detectors, provenance verifiers — operates on any artifact without knowing its type. A new artifact type requires no change to any of that machinery.

```
ARTIFACT
├── ENVELOPE          universal, type-independent
│   ├── Identity      what this is, and which run it belongs to
│   ├── Type          what it claims to be, at what version
│   ├── Subject       what it describes, at what revision
│   ├── Scope         what was examined, and what was not
│   ├── Completeness  whether the body can be interpreted, and how
│   ├── Provenance    who produced it, how, when, under what authority
│   ├── Lineage       which artifacts it derives from
│   └── Assessment    aggregate evidence state and confidence
└── BODY              type-specific
    └── Records       each carrying evidence state, confidence, evidence refs
```

**The envelope is readable without understanding the body.** A consumer encountering an artifact of an unknown type can still determine what it describes, whether it is current, whether it is complete, who produced it, and whether it is trustworthy — and can therefore make a correct decision to skip it rather than a guess.

## 4. Artifact Type

An artifact type is the unit of contract. It is declared once, independently of any methodology, and referenced by producers and consumers alike.

A type declaration establishes:

- **Type identity** — stable, namespaced, never reused.
- **Semantic definition** — what the artifact asserts about a subject. This is the part that cannot be expressed as a schema and is the part that actually breaks when it drifts.
- **Record structure** — required and optional fields, their meaning and their vocabulary.
- **Required fields** — the minimum a conforming producer must emit.
- **Vocabulary policy per enumerated field** — closed or open (section 10.4).
- **Not-applicable conditions** — the circumstances under which a subject legitimately has no records of this type.
- **Scope semantics** — what a record's absence means, given the declared search scope.
- **Version** — semantic version of the type itself (section 9).

**A type is owned by the framework or by an extending namespace, never by a methodology.** A methodology that owns its output type owns its consumers, which reintroduces the coupling the model exists to prevent. Types are declared in a shared namespace precisely so that two producers can compete to satisfy one.

### 4.1 Type identity and namespacing

Type identities are namespaced so that framework types, organization types, and plugin types cannot collide. A namespaced identity also makes provenance legible: a consumer can see at a glance whether it is reading a framework type or a local extension.

Identity is permanent. A type that changes meaning takes a new identity; it does not take a new version (section 9.3).

## 5. Artifact Instance

An instance is one production of one type, against one subject, at one revision, by one producer, in one run.

Instance identity is a function of `(run, type)` — within a run, an artifact type appears at most once. This is deliberate: it makes resolution unambiguous and forbids the pattern where three partial artifacts of the same type must be merged by a consumer that has no basis for merging them. A producer that would emit several must instead emit one artifact whose scope declares the union.

## 6. Run and Artifact Set

A **run** is one execution of a capability or methodology against one subject at one revision. It is the grouping and addressing context for artifacts.

A run declares: run identity; subject reference; revision; capability or methodology invoked; declared scope; authorization boundary; executor; start and end time.

The set of artifacts sharing a run identity is the **artifact set**. It is the unit a consumer resolves against and the unit a report renders.

**Run is a grouping concept, not a new framework object type.** It is envelope metadata plus a resolution scope. The core architecture's eight types are unchanged; adding a ninth type to express what an identifier already expresses would be exactly the over-modelling that revision removed.

## 7. Addressing and Resolution

### 7.1 Address form

An artifact is addressed as `(run, type)`. A record within it is addressed as `(run, type, record)`. An evidence item is addressed as `(run, type, record, evidence)`.

Addresses are hierarchical, stable within a run, and independent of storage location. **A consumer never addresses an artifact by file path, and never by producer identity.** Both would defeat substitutability — one by coupling to layout, the other by coupling to authorship.

Evidence identity is unique within its artifact, which means an evidence item is globally addressable through composition without requiring a global evidence registry.

### 7.2 Resolution

Resolution is the operation "give me artifact of type T for run R". It has exactly four outcomes, and a consumer must handle all four:

| Outcome | Meaning | Consumer obligation |
| --- | --- | --- |
| Resolved, compatible | An instance exists at a version the consumer can read | Proceed |
| Resolved, incompatible | An instance exists at a version the consumer cannot read | Fail closed; declare the incompatibility (section 16) |
| Not present | No instance of this type exists in the run | Declare the input unavailable; degrade explicitly |
| Present, uninterpretable | The instance exists but its completeness state forbids interpretation | Treat per completeness semantics (section 8) |

Resolution never falls back to a different run, a different revision, or a different type. Silent substitution of a near-enough artifact is the failure mode this model most needs to prevent, because it produces conclusions that appear well-founded and are not.

### 7.3 Cross-revision consumption

An artifact is bound to a subject revision. Consuming an artifact produced against a different revision than the current run is **cross-revision consumption**, and it is permitted only when explicitly declared.

Declaration requires recording both revisions, the reason reuse was chosen, and a confidence consequence: any conclusion drawn from a cross-revision input is capped at Medium confidence and can never be Verified, because the input describes a subject state that is not the one under examination.

This exists so that incremental audits are possible without becoming quietly wrong. Reuse is a legitimate optimization; undeclared reuse is a correctness failure.

## 8. Completeness States

The single most important interpretive field in the envelope. An empty record set is meaningless without it.

| State | Meaning | Consumer obligation |
| --- | --- | --- |
| **Complete** | The producer examined the declared scope and emitted all records it found | Interpret normally. Absence of a record means not-found-within-scope |
| **Partial** | The producer examined less than the declared scope; the boundary is recorded | Interpret present records normally; treat the unexamined boundary as Unknown. Never infer absence |
| **NotApplicable** | The subject legitimately has no instances of this type, with a recorded reason | This is a valid, informative result. It must not lower a score and must not be reported as a gap |
| **Unavailable** | The producer did not run: unauthorized, unsupported, unavailable, or not attempted | Declare the input missing. Never interpret as absence of the thing |
| **Failed** | The producer ran and could not complete; the failure is recorded | Same as Unavailable, plus the failure is surfaced rather than absorbed |

**The distinction between NotApplicable and Unavailable is the one that most often gets lost, and losing it is expensive.** "This repository has no data stores" and "the database methodology did not run" both produce zero records. The first is a finding. The second is a hole. A model that cannot tell them apart will eventually report a clean bill of health for a domain nobody examined.

Completeness is declared at artifact level and may be refined per record group where a producer's coverage varies within one type.

## 9. Versioning Model

### 9.1 What is versioned

Three things version independently, and conflating them is a common failure:

- **The artifact type** — the contract. Consumers depend on this.
- **The producer** — a methodology. Consumers must never depend on this.
- **The instance** — a specific production. Not versioned; identified by run.

### 9.2 Type version semantics

Artifact types use semantic versioning with meanings defined against the consumer, not against the producer's convenience.

**MAJOR** — a change that can break a conforming consumer:
- removing a field, or making an optional field required
- changing a field's meaning, unit, or interpretation
- removing or narrowing a value from a closed vocabulary
- changing what absence of a record implies
- tightening or loosening the semantics of an existing state

**MINOR** — a change a conforming consumer can ignore:
- adding an optional field
- adding a value to an **open** vocabulary
- adding a new record group
- relaxing a producer-side constraint that no consumer relies on

**PATCH** — no interface change:
- clarifying documentation, correcting examples, fixing a description that misstated existing behavior

**The test for MAJOR is not "did the schema change" but "could a consumer that was correct yesterday be wrong today".** A field whose meaning silently shifts is a major change with no schema diff, and it is the change most likely to be mis-versioned.

### 9.3 Meaning changes take a new identity

A type whose semantic definition changes fundamentally — it now asserts something different about the subject — does not take a major version. It takes a **new type identity**, and the old type is deprecated with a successor reference.

Major versions express evolution of one contract. A different assertion is a different contract, and versioning it as the same one means a consumer resolving "type T" can receive an artifact that answers a different question than it asked.

### 9.4 Deprecation

A type is deprecated with a successor reference and a deprecation reason. Existing instances remain valid and readable indefinitely. New production is discouraged, then refused. Nothing is deleted, because artifacts are historical records of a subject at a revision and deleting them destroys the audit trail they exist to provide.

## 10. Compatibility Model

### 10.1 Declaration

A producer declares the exact type version it emits. A consumer declares the versions it can read, as a major version plus a minimum minor.

Compatibility holds when the major versions match and the producer's minor is at least the consumer's minimum. This is conventional and adequate for the whole-artifact case.

### 10.2 Consumption profiles

Whole-type compatibility is coarser than necessary and forces lockstep evolution where none is required. A consumer typically reads a small fraction of an artifact's fields.

A consumer may therefore declare a **consumption profile**: the specific fields and record groups it actually reads. Compatibility is then evaluated against the profile rather than the whole type.

The consequence is significant for independently developed methodologies: **a major change to a field no consumer reads breaks no consumer.** A type can evolve in one area while consumers depending on another area continue working unchanged. Without profiles, every major version forces every consumer to be revisited whether or not it is affected.

Profiles also produce a useful by-product: the union of all declared profiles is the type's actually-used surface, which tells maintainers which fields can be changed cheaply and which cannot.

### 10.3 Compatibility is checkable before execution

Because producers declare emitted versions and consumers declare profiles, a capability can verify the compatibility of its entire composition **before running anything**. An eleven-methodology audit that would fail at step nine because of a version mismatch should fail at step zero, before hours of work are spent.

### 10.4 Vocabulary policy

Enumerated fields are the classic source of silent breakage: adding a value is harmless to producers and can be fatal to a consumer that exhaustively matches. The model addresses this by requiring every enumerated field to declare itself closed or open.

**Closed vocabularies** are semantically critical and small. Adding a value is a MAJOR change, because every consumer's exhaustive handling must be revisited. Evidence state (Verified, Observed, Inferred, Unknown) and completeness state are closed. Their whole value is that every participant agrees on exactly these values and no others.

**Open vocabularies** are extensible by nature — technology families, risk categories, finding classes. Adding a value is a MINOR change, and in exchange **every consumer must declare its handling for unrecognized values**. A consumer that cannot state what it does with an unknown value is not conforming, and its silent failure would otherwise appear as a successful run.

Choosing per field, rather than adopting one policy for all enumerations, is what allows the model to be both stable where stability matters and extensible where it does not.

## 11. Derivation and Lineage

When a producer uses an upstream artifact, the resulting artifact records the derivation: the upstream address, its type and version, its revision, and which of the consumer's records depend on it.

Lineage serves three purposes that nothing else can:

**Invalidation.** Regenerating an upstream artifact makes every downstream artifact derived from it stale. Without recorded lineage, staleness is undetectable and a report can present a current finding beside a superseded one with no indication of the difference.

**Traceability.** A reviewer challenging a downstream conclusion can walk to the upstream evidence that supports it, across producer boundaries.

**Cycle prevention.** The derivation graph must be acyclic. Two methodologies that each consume the other's artifacts within one run form a cycle that no ordering can satisfy. Because lineage is explicit, this is detectable at composition time rather than at execution time.

Lineage is recorded per record where derivation is partial. A downstream artifact where three of forty records derive from upstream input should not present all forty as derived — that would over-propagate the constraints of section 12 and depress confidence in conclusions that were independently established.

## 12. State and Confidence Propagation

This section is the model's substantive contribution to correctness, and the part most easily omitted from a purely structural contract.

### 12.1 The laundering problem

A downstream methodology consumes an upstream artifact whose record is marked Inferred at Low confidence. It performs its own analysis, reaches a conclusion, and — absent a rule — records that conclusion as Observed at High confidence. Uncertainty has been laundered. The final report presents as well-founded a conclusion whose entire basis was a guess two artifacts upstream.

At eleven composing methodologies this is not a hypothetical; it is what happens by default.

### 12.2 Evidence state propagation

Evidence states form an ordered lattice: `Verified > Observed > Inferred > Unknown`.

**A derived conclusion's evidence state may not exceed the minimum state of the inputs it depends on**, unless the consumer contributes independent evidence of its own, in which case the conclusion is justified by that evidence and the derivation is recorded as corroborating rather than load-bearing.

A conclusion resting on an Observed input cannot be Verified. A conclusion resting on an Unknown input is itself Unknown — not merely uncertain, but undetermined, because it has no basis.

### 12.3 Confidence propagation

Confidence is capped by the minimum confidence of the load-bearing inputs. A consumer may lower confidence further on its own reasoning; it may never raise it above its weakest dependency.

### 12.4 Promotion

Only a methodology contributing genuinely new evidence may raise a state, and only for conclusions that new evidence supports. In the audit domain this is why runtime verification is the only methodology permitted to promote a conclusion to Verified: it is the only one observing the running system, and everything else is reading declarations.

Promotion must record what evidence justified it. An unexplained promotion is indistinguishable from laundering.

## 13. Provenance and Trust

Every artifact carries, in its envelope:

- **Producer identity and version** — recorded for traceability, never depended upon (section 4).
- **Executor class** — human, agent, tool, or hybrid. A consumer may weight differently; it must not refuse on this basis alone.
- **Generation time** and the **subject revision** examined.
- **Environments inspected**, if any. Mandatory for any observation not derived from the subject's source, because structure observed in one environment is not evidence about another.
- **Authorization boundary** in force during production.
- **Redaction state** — whether content was withheld, and of what class. A consumer must know that an artifact is redacted, and must not interpret redacted absence as absence.
- **Trust class** of each input the producer relied upon.

Provenance is what makes an artifact from an unknown producer usable at all. Without it, a consumer can read the artifact but cannot say what it is worth.

## 14. Extension Model

### 14.1 Namespaced fields

Organizations and plugins add fields under their own namespace. Two rules make this safe, and both are required:

**Must ignore.** A consumer encountering an unrecognized namespaced field must ignore it. Unknown extension fields never cause validation failure.

**Must preserve.** Any process that reads and re-emits an artifact must preserve unrecognized namespaced fields unchanged. A transformer that drops what it does not understand silently destroys another party's data, and the loss is discovered far downstream.

Together these allow an organization to enrich artifacts as they flow through framework machinery that knows nothing about the enrichment.

### 14.2 Extension boundaries

Extensions may add fields, add record groups, add values to open vocabularies, and add types. Extensions may not remove required fields, change the meaning of framework fields, add values to closed vocabularies, or weaken completeness or evidence semantics.

The asymmetry — extend freely, restrict never — is what keeps an extended artifact still readable by framework tooling, and keeps "conformant to the framework" separately answerable from "conformant to our extensions".

### 14.3 New types

A new artifact type requires no change to the envelope, the resolver, the validator, or any existing type. This is the payoff of section 3's separation, and it is the property that makes future methodology families additive rather than disruptive.

## 15. Conformance and Substitution

### 15.1 Conformance

A producer conforms to an artifact type when it emits the declared identity and a compatible version, emits all required fields, uses closed vocabularies correctly, declares completeness honestly, records provenance and lineage, and respects the propagation rules of section 12.

**Honest completeness is the conformance criterion most likely to be violated and hardest to detect.** A producer that examined half the scope and declares Complete is structurally valid and semantically corrupt. Every consumer downstream will treat absence as evidence.

### 15.2 Conformance fixtures

Each artifact type carries reference instances covering its normal case, its empty case, its not-applicable case, its partial case, and its boundary cases.

Fixtures serve both sides of the contract: a producer demonstrates conformance by emitting them, and a consumer demonstrates conformance by reading them correctly. They convert an abstract contract into something testable, and they are what makes independent development safe — two parties who have never communicated can each test against the same fixtures.

### 15.3 Substitution

A conforming substitute may replace any producer. Because consumers depend on types and profiles rather than producers, substitution requires no downstream change. A substitute producing a superset is compatible; one producing a subset of required fields is not, regardless of how good its analysis is.

## 16. Failure Semantics

Interoperability failures must be loud. The governing rule is **fail closed, never skip silently** — a consumer that quietly ignores what it cannot handle reports success on content it never processed.

| Condition | Required behavior |
| --- | --- |
| Unknown artifact type | Fail closed. Record the unknown type. Never guess from structure |
| Incompatible major version | Fail closed. Record both versions and the profile that could not be satisfied |
| Minor below consumer minimum | Fail closed. Record the shortfall |
| Required artifact not present | Declare the input unavailable, degrade explicitly, record the affected conclusions as Unknown |
| Completeness Partial | Interpret present records; never infer absence outside the examined boundary |
| Completeness Unavailable or Failed | Treat as missing input, never as absence of the thing |
| Unknown value in a closed vocabulary | Fail closed. The vocabulary is closed precisely so this cannot be tolerated |
| Unknown value in an open vocabulary | Apply the consumer's declared fallback. Undeclared fallback is non-conformance |
| Unknown namespaced field | Ignore and preserve |
| Lineage cycle detected | Fail closed at composition time, before execution |
| Cross-revision input, undeclared | Fail closed. Undeclared reuse is a correctness failure |
| Propagation rule would be violated | Fail closed. Emitting a conclusion stronger than its inputs is never permitted |
| Envelope unparseable | Fail closed. An artifact whose envelope cannot be read cannot be trusted at all |

## 17. Safety Constraints

Artifacts travel between systems, organizations, and tools. Constraints that are conventions inside one methodology become interoperability requirements once artifacts move.

**Artifacts never carry** secret values, credentials, connection strings, host endpoints, personal or regulated data, or subject record values. Structure may be described; content may not.

Redaction is declared, never silent: an artifact records that content was withheld and of what class, so a consumer distinguishes redacted absence from genuine absence. The distinction matters because the two support opposite conclusions.

These constraints are properties of the envelope and are checkable generically, without understanding any type — which is precisely why they belong here rather than in each methodology.

## 18. Worked Interoperability Scenarios

Each scenario shows the model resolving a case that would otherwise break independently developed methodologies.

**A producer adds an optional field.** Minor version increment. Consumers whose profiles exclude the field are unaffected. No coordination required.

**A producer removes a field that one of four consumers reads.** Major version increment. Profile evaluation identifies exactly the one affected consumer. Three continue unchanged; one is updated. Without profiles, all four would be revisited.

**An organization substitutes its own architecture methodology.** It emits the same types at compatible versions and satisfies the required fields. Every downstream methodology continues working, having never known the identity of the producer.

**A domain has no data stores.** The database producer emits an artifact with completeness NotApplicable and a recorded reason. Downstream consumers treat it as a valid finding. The composed health result does not penalize the subject, and no gap is reported.

**The database methodology is unauthorized.** No artifact is produced; resolution returns not-present. Consumers declare the input unavailable and mark dependent conclusions Unknown. The capability declares the domain unaudited and caps the composed result. Structurally identical inputs to the previous scenario, correctly producing the opposite outcome.

**A downstream methodology draws a conclusion from an Inferred, Low-confidence upstream record.** Propagation caps the conclusion at Inferred, Low. The final report shows a weak conclusion as weak, which is the entire point.

**An upstream artifact is regenerated after a downstream artifact consumed it.** Lineage marks the downstream artifact stale. The report either excludes it or labels it superseded; it never presents both as concurrently valid.

**Two methodologies each consume the other's output.** The lineage graph contains a cycle. Composition fails before execution, with both participants named.

**An organization adds a compliance field to every artifact.** Namespaced. Framework tooling ignores it and preserves it through every transformation. The organization's own consumers read it.

## 19. Open Questions

**Q-01 — Where do artifact instances live, and how are runs addressed across repositories? Resolved.** [ADR-0006](../ADR/ADR-0006-artifact-instance-identity.md) decides it: an instance is named by a logical identity, its location is resolved separately, and its integrity is verified by content digest. Carriage of that decision into STD-0008, STD-0010, STD-0011, and STD-0012 remains implementation work.

**Q-02 — Is the envelope serialization-independent in practice?** The design assumes it, but a concrete serialization may impose constraints the abstract model does not anticipate.

**Q-03 — Who arbitrates a type's semantic definition?** Section 4 makes types framework-owned rather than methodology-owned, which requires an owner for each type. The ownership model for types is undefined.

**Q-04 — How granular should consumption profiles be?** Field-level is maximally precise and maximally burdensome to declare. Record-group level is cheaper and coarser. The right granularity is likely per type rather than global.

**Q-05 — Should propagation rules be enforced mechanically or by producer discipline?** Mechanical enforcement requires the machinery to understand which records are load-bearing for which conclusions, which is close to understanding the body. Producer discipline is cheaper and weaker.

**Q-06 — How are conformance fixtures versioned relative to their type?** A fixture set that lags its type gives false assurance; one that leads it fails conforming producers.

**Q-07 — Does cross-revision consumption need finer granularity than a single confidence cap?** Reusing an architecture artifact across a documentation-only change is materially safer than reusing it across a refactor, and one flat rule treats them identically.

## 20. What This Document Does Not Decide

It defines no artifact type's content. It specifies no schema, serialization, or file format. It does not modify or supersede any existing framework document. It does not define storage, transport, or access control. It does not make any of its content normative — every element requires a Decision and a standard before it constrains a contributor. It does not describe any methodology, and no methodology's behavior may be inferred from it.

## 21. Related Documents

- [Framework Core Architecture](framework-core-architecture.md)
- [Framework Architecture](framework-architecture.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [Architecture Discovery](../03-audit-engine/01-architecture-discovery.md)
- [Database Discovery](../03-audit-engine/02-database-discovery.md)
- [Framework Architecture Review](../07-roadmap/framework-architecture-review.md)
- [Audit Engine Product Specification](../07-roadmap/audit-engine-roadmap.md)
