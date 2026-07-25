---
id: STD-0011
title: Contract Specification Standard
version: 1.2.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Methodology
tags: [contracts, producers, consumers, compatibility, obligations, standard]
related: [artifact-specification.md, metadata-specification.md, evidence-and-confidence.md, validation-specification.md, ../01-foundation/framework-core-architecture.md, ../01-foundation/framework-artifact-model.md, ../ADR/ADR-0002-requirements-as-metadata.md, ../ADR/ADR-0003-normative-informative-separation.md, ../ADR/ADR-0004-depend-on-artifact-types.md, ../09-capabilities/CAP-0001-repository-audit.md]
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
  "15": informative
  "16": informative
  "17": informative
requirements:
  - id: R-01
    level: MUST
    check: mechanical
    severity: blocking
    scope: contract
  - id: R-02
    level: MUST
    check: mechanical
    severity: blocking
    scope: contract
  - id: R-03
    level: MUST
    check: mechanical
    severity: blocking
    scope: producer
  - id: R-04
    level: MUST
    check: mechanical
    severity: blocking
    scope: producer
  - id: R-05
    level: MUST
    check: judgment
    severity: blocking
    scope: producer
  - id: R-06
    level: MUST
    check: mechanical
    severity: blocking
    scope: producer
  - id: R-07
    level: MUST
    check: mechanical
    severity: blocking
    scope: producer
  - id: R-08
    level: MUST
    check: mechanical
    severity: blocking
    scope: producer
  - id: R-09
    level: MUST
    check: mechanical
    severity: blocking
    scope: consumer
  - id: R-10
    level: SHOULD
    check: mechanical
    severity: advisory
    scope: consumer
  - id: R-11
    level: MUST
    check: mechanical
    severity: blocking
    scope: consumer
  - id: R-12
    level: MUST
    check: mechanical
    severity: blocking
    scope: consumer
  - id: R-13
    level: MUST
    check: judgment
    severity: blocking
    scope: consumer
  - id: R-14
    level: MUST
    check: mechanical
    severity: blocking
    scope: consumer
  - id: R-15
    level: MUST
    check: mechanical
    severity: blocking
    scope: precondition
  - id: R-16
    level: MUST
    check: mechanical
    severity: blocking
    scope: precondition
  - id: R-17
    level: MUST
    check: mechanical
    severity: blocking
    scope: precondition
  - id: R-18
    level: MUST
    check: mechanical
    severity: blocking
    scope: postcondition
  - id: R-19
    level: MUST
    check: judgment
    severity: blocking
    scope: postcondition
  - id: R-20
    level: MUST
    check: mechanical
    severity: blocking
    scope: input
  - id: R-21
    level: MUST
    check: mechanical
    severity: blocking
    scope: input
  - id: R-22
    level: MUST
    check: judgment
    severity: blocking
    scope: input
  - id: R-23
    level: MUST
    check: mechanical
    severity: blocking
    scope: output
  - id: R-24
    level: MUST
    check: judgment
    severity: blocking
    scope: output
  - id: R-25
    level: MUST
    check: mechanical
    severity: blocking
    scope: failure
  - id: R-26
    level: MUST
    check: mechanical
    severity: blocking
    scope: failure
  - id: R-27
    level: MUST
    check: mechanical
    severity: blocking
    scope: failure
  - id: R-28
    level: MUST
    check: mechanical
    severity: blocking
    scope: compatibility
  - id: R-29
    level: MUST
    check: mechanical
    severity: blocking
    scope: compatibility
  - id: R-30
    level: MUST
    check: mechanical
    severity: blocking
    scope: compatibility
  - id: R-31
    level: MUST
    check: mechanical
    severity: blocking
    scope: evolution
  - id: R-32
    level: MUST
    check: mechanical
    severity: blocking
    scope: evolution
  - id: R-33
    level: MUST
    check: mechanical
    severity: blocking
    scope: evolution
  - id: R-34
    level: MUST
    check: judgment
    severity: blocking
    scope: substitution
  - id: R-35
    level: MUST
    check: mechanical
    severity: blocking
    scope: conformance
  - id: R-36
    level: MUST
    check: mechanical
    severity: blocking
    scope: conformance
  - id: R-37
    level: MUST
    check: mechanical
    severity: blocking
    scope: producer
  - id: R-38
    level: MUST
    check: mechanical
    severity: blocking
    scope: orchestrator
  - id: R-39
    level: MUST
    check: mechanical
    severity: blocking
    scope: evolution
  - id: R-40
    level: MUST
    check: mechanical
    severity: blocking
    scope: consumer
  - id: R-41
    level: MUST
    check: judgment
    severity: blocking
    scope: producer
  - id: R-42
    level: MUST
    check: mechanical
    severity: blocking
    scope: consumer
  - id: R-43
    level: MUST
    check: mechanical
    severity: blocking
    scope: consumer
  - id: R-44
    level: MUST
    check: mechanical
    severity: blocking
    scope: consumer
---

# Contract Specification Standard

**Implements**

- [ADR-0002](../ADR/ADR-0002-requirements-as-metadata.md) — requirements declared in metadata
- [ADR-0003](../ADR/ADR-0003-normative-informative-separation.md) — section-level normativity
- [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md) — the type as the contract between parties

**Unblocks**

- STD-0012 Validation
- Architecture Discovery refactor
- Database Discovery refactor
- The remaining discovery methodologies
- CAP-0001 composition and preflight verification

## 1. Purpose and Scope

*This section is informative.*

This standard defines the obligations between producers and consumers of framework artifacts.

Three neighbouring standards hold adjacent responsibilities. [STD-0008](artifact-specification.md) defines what an artifact is and must carry. [STD-0010](metadata-specification.md) defines how declarations are written. [STD-0007](evidence-and-confidence.md) defines what evidence and confidence mean. This standard defines what the parties owe each other.

**The dividing test.** An obligation that describes a well-formed *artifact* belongs to STD-0008. An obligation that describes a well-behaved *participant* belongs here. A producer emitting a required field is artifact well-formedness; a producer honouring a deprecation notice before withdrawing a guarantee is participant behaviour. Section 16 records that this boundary was drawn during implementation and what moved.

**In scope.** The contract model; producer and consumer obligations; preconditions and postconditions; required inputs and guaranteed outputs; failure conditions; compatibility obligations; contract evolution and deprecation; substitution and equivalence; and conformance rules.

**Out of scope.** Artifact structure, envelope membership, and type versioning semantics, which belong to STD-0008. Metadata representation, which belongs to STD-0010. Evidence and confidence meaning, which belongs to STD-0007. Validator behavior and reporting, which belong to STD-0012.

## 2. Terminology and Conventions

*This section is normative.*

`MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` carry their conventional meanings as stated in [Documentation Navigation](../README.md).

**Contract** — the obligations attaching to an artifact type, binding every producer and every consumer of that type.

**Producer** — a methodology, process, or tool that emits an artifact.

**Consumer** — an object or process that reads an artifact it did not produce.

**Orchestrator** — the capability or process that composes producers and consumers into a run.

**Precondition** — a condition that MUST hold before a producer may be invoked.

**Postcondition** — a condition that MUST hold after a producer completes.

**Guarantee** — an assurance a producer offers about its output, on which a consumer is entitled to rely.

Requirements are identified as `R-nn` and declared in front matter per ADR-0002. A requirement is addressable as `STD-0011#R-01`.

## 3. The Contract Model

*This section is normative.*

**R-01.** A contract attaches to an artifact type. It MUST NOT attach to a producer, a consumer, or a pair of them.

This follows directly from ADR-0004 and is the property from which everything else in this standard derives. Parties never negotiate. A producer satisfies the type's contract; a consumer relies on the type's contract; neither knows the other.

**R-02.** Every artifact type MUST have exactly one contract, declared with the type. A type without a declared contract MUST NOT be produced or consumed.

A contract comprises: the preconditions a producer requires, the inputs it consumes, the outputs it guarantees, the failure behaviour it commits to, and the compatibility commitments it holds. Sections 6 through 12 state the obligations attaching to each.

**Contracts bind asymmetrically.** A producer owes its obligations to every consumer, present and future, including consumers it will never know about. A consumer owes its obligations to the integrity of its own conclusions and to anything downstream of them. Neither party can release the other, because neither is in a position to speak for the parties it cannot see.

## 4. Producer Obligations

*This section is normative.*

**R-03.** A producer MUST declare the artifact types it produces and, for each, the exact type version it emits.

**R-04.** A producer MUST declare its preconditions, its required and optional inputs, its executor requirements, and its failure behaviour, before it is invoked.

**R-05.** A producer MUST NOT emit an artifact that overstates what it examined or determined.

R-05 is the central producer obligation and is judgment-checkable. It covers declaring `Complete` on a partial examination, recording a conclusion above the state its evidence supports, and presenting an inference as an observation. No structural check detects any of these, and each corrupts every consumer downstream.

**R-06.** A producer MUST NOT require that a consumer know its identity. A producer MUST NOT emit an artifact whose correct interpretation depends on knowing which producer emitted it.

**R-07.** A producer MUST fail visibly. Where it cannot satisfy its contract it MUST emit the failure per section 10, and MUST NOT emit an artifact that appears successful.

**R-08.** A producer MUST NOT weaken or withdraw a guarantee except through the evolution process in section 12.

**R-41.** A producer MUST declare a scope adequate for a consumer to determine what absence of a record means. It MUST NOT emit an artifact whose scope declaration leaves absence uninterpretable.

R-41 was relocated from STD-0008 at version 1.2.0. What absence means is defined by [STD-0007](evidence-and-confidence.md); the obligation to declare a scope that makes it determinable is the producer's.

A producer is not obliged to find anything. It is obliged to look within its declared scope, to report honestly what it found and did not find, and to be clear about which is which.

## 5. Consumer Obligations

*This section is normative.*

**R-09.** A consumer MUST declare the artifact types it consumes and, for each, the major version and minimum minor version it can read.

**R-10.** A consumer SHOULD declare a consumption profile identifying the fields and record groups it reads.

**R-11.** A consumer MUST verify compatibility before consuming an artifact, per section 11.

**R-12.** A consumer MUST NOT substitute an artifact from a different run, a different subject revision, or a different type for one it cannot find or cannot read.

**R-13.** A consumer MUST honour the completeness semantics defined by [STD-0007](evidence-and-confidence.md) section 8 and the propagation rules defined by its sections 11 and 12.

R-13 is the consumer obligation with the widest reach. A consumer that reads a `Partial` artifact as though it were `Complete`, or that records a conclusion stronger than the input it derived it from, produces output that is structurally valid and substantively false.

**R-14.** A consumer MUST declare its own degradation when a required input is unavailable. It MUST NOT proceed silently on a missing input.

**R-40.** A consumer MUST address an artifact by its run and type identity. It MUST NOT address an artifact by file path or by producer identity.

**R-42.** A consumer MUST NOT interpret redacted absence as absence.

**R-43.** A consumer MUST NOT present a stale artifact and a current artifact as concurrently valid.

**R-44.** A consumer consuming an artifact produced against a different subject revision MUST declare both revisions and the reason for reuse, MUST cap any conclusion drawn from that input at `Medium` confidence, and MUST NOT record such a conclusion as `Verified`.

R-40 through R-44 were relocated from STD-0008 at version 1.2.0. They are consumer obligations rather than properties of an artifact, and their subject matter is unchanged.

A consumer is entitled to rely on a producer's guarantees. It is not entitled to assume anything a producer did not guarantee, and the difference between the two is stated in the contract rather than inferred from the output.

## 6. Preconditions

*This section is normative.*

**R-15.** A producer MUST declare its preconditions as part of its contract. An undeclared precondition MUST NOT be relied upon.

**R-16.** The orchestrator MUST verify a producer's preconditions before invoking it.

**R-17.** Where a precondition is unmet, the producer MUST NOT be invoked, and the orchestrator MUST record the unmet precondition and the affected artifact type as unavailable per section 10.

Preconditions are the contract's entry gate. Typical preconditions are access to the subject at a stated revision, an authorization boundary, availability of a required input artifact, and an executor meeting the producer's declared requirements.

**R-37.** A producer that discovers mid-execution that a precondition it declared does not in fact hold MUST treat the situation as a failure under section 10 rather than continuing on a weaker basis.

## 7. Postconditions

*This section is normative.*

**R-18.** On successful completion a producer MUST have emitted exactly one artifact of each type it declared, each carrying a declared completeness state, recorded provenance, and recorded lineage where it derived from an input.

**R-19.** A postcondition MUST be a statement about the artifact, never about the subject.

R-19 draws a line that is easy to lose. "An artifact of type T exists, is well formed, and declares its completeness" is a postcondition. "The subject has no security defects" is not a postcondition and cannot be one, because the producer cannot guarantee facts about a subject it merely examined.

A producer that examined its declared scope and found nothing has satisfied its postconditions completely. Finding nothing is a result, not a failure.

## 8. Required Inputs

*This section is normative.*

**R-20.** A producer MUST declare each input as required or optional. A required input is one without which the producer cannot satisfy its postconditions.

**R-21.** A producer MUST NOT consume an input it did not declare.

**R-22.** Absence of an optional input MUST lower confidence per [STD-0007](evidence-and-confidence.md) and MUST NOT lower a score.

R-22 protects subjects from being penalized for evidence a requester chose not to supply. An audit conducted without deployment manifests reaches weaker conclusions about deployment; the subject is not thereby worse.

Where a required input is an artifact of another type, the dependency is on the **type**, never on a producer, per R-01.

## 9. Guaranteed Outputs

*This section is normative.*

**R-23.** A producer MUST guarantee, for each declared type: that an artifact of that type is emitted, that it conforms to the type at the declared version, that its completeness is declared, and that its provenance is recorded.

**R-24.** A producer MUST NOT guarantee findings, coverage beyond its declared scope, or any property of the subject.

The distinction in R-24 is what makes guarantees meaningful. A contract that promised findings would be unfulfillable against a subject that has none, and a producer under such a contract would be incentivized to manufacture them.

What a consumer may rely upon is therefore: the artifact exists; it is of the declared type and version; its completeness state is honest; its records carry evidence states and confidence conforming to STD-0007; and its provenance permits an independent reviewer to evaluate it. Nothing about what it contains.

## 10. Failure Conditions

*This section is normative.*

**R-25.** A producer MUST map every failure to a declared completeness state and MUST record the failure reason.

| Failure | Completeness | Disclosure required |
| --- | --- | --- |
| Precondition unmet | `Unavailable` | The unmet precondition |
| Authorization refused | `Unavailable` | The boundary that refused |
| Required input missing | `Unavailable` | The absent input type |
| Required input incompatible | `Unavailable` | Both versions and the unsatisfied profile |
| Executor requirement unmet | `Unavailable` | The requirement not met |
| Scope partially examined | `Partial` | The examined boundary |
| Execution failed mid-run | `Failed` | The point and nature of failure |
| Subject admits no instances | `NotApplicable` | The reason |

**R-26.** A producer MUST NOT degrade silently. Where it cannot perform its declared examination it MUST report reduced coverage rather than performing a weaker examination presented as the declared one.

**R-27.** A consumer MUST fail closed on an unknown type, an incompatible version, an unparseable envelope, an unknown value in a closed vocabulary, an undeclared cross-revision input, or a lineage cycle.

R-26 is the obligation most likely to be violated under pressure. A producer lacking authorization for part of its scope faces a choice between reporting reduced coverage and quietly examining what it can. The second produces an artifact that looks complete and is not, and no consumer can detect the difference.

`NotApplicable` is listed in the failure table for completeness of mapping. It is not a failure, and section 8 of STD-0007 governs its meaning.

## 11. Compatibility Obligations

*This section is normative.*

Version semantics — what constitutes a major, minor, or patch change — are defined by [STD-0008](artifact-specification.md) section 12 and are not restated here. This section states the obligations arising from them.

**R-28.** A producer MUST NOT emit an artifact at a version incompatible with its declaration.

**R-29.** A producer MUST NOT introduce a breaking change within a major version.

**R-30.** Where a consumer declares a consumption profile, compatibility MUST be evaluated against the profile rather than against the whole type.

The consequence of R-30 is that a major change to a field no consumer reads breaks no consumer. Profiles are what allow a type to evolve in one area while consumers depending on another continue unchanged.

**R-38.** Where an orchestrator composes several producers and consumers, it MUST verify compatibility across the whole composition before execution begins. A composition that would fail at its ninth step because of a version mismatch fails at its first.

## 12. Contract Evolution

*This section is normative.*

**R-31.** Adding a guarantee, adding an optional input, or widening accepted inputs is additive and MUST NOT require a major version.

**R-32.** Removing a guarantee, strengthening a precondition, adding a required input, narrowing accepted inputs, or changing declared failure behaviour is breaking and MUST take a major version.

R-32 includes changing failure behaviour deliberately. A producer that previously emitted `Partial` on restricted access and now emits `Failed` has changed what its consumers must handle, even though nothing about its successful output changed.

**R-33.** A guarantee MUST NOT be withdrawn without a deprecation period during which both the old and the new behaviour are declared and the successor is identified.

Deprecation proceeds in three stages: the guarantee is announced as deprecated with a successor; new consumers are refused it; and finally it is withdrawn at a major version. Instances produced under the old contract remain valid and readable indefinitely, because they are historical records of a subject at a revision.

**R-39.** A producer MUST NOT evolve a contract it does not own.

A contract may be evolved only by the owner of its artifact type. An organization extending a framework type does so by declaring its own type, not by altering one it consumes.

## 13. Substitution and Equivalence

*This section is normative.*

**R-34.** A producer is substitutable for another where it produces the same artifact types at compatible versions, requires no stronger preconditions, consumes no additional required inputs, offers guarantees no weaker, and declares the same failure behaviour.

Substitution is what ADR-0004 exists to enable, and R-34 states its price precisely. A substitute offering *more* is compatible; a substitute requiring more, or guaranteeing less, is not — irrespective of how much better its analysis is.

**Quality is not part of the contract.** A conforming producer that examines a subject shallowly and an exemplary producer that examines it deeply satisfy the same contract, and either may be substituted for the other. This is uncomfortable and it is correct: quality is not mechanically comparable, and a contract that claimed to compare it would be asserting something it cannot check. Consumers select producers on quality; contracts govern interchange.

## 14. Conformance Rules

*This section is normative.*

**R-35.** Conformance is established per artifact type, not per producer. A producer conforming for one type makes no claim about another.

**R-36.** A party MUST declare its conformance.

The procedure by which conformance is demonstrated against a type's fixtures is validator behaviour and is stated by [STD-0012](validation-specification.md) section 10.

A producer conforms when it satisfies R-03 through R-08, its preconditions satisfy R-15, its postconditions satisfy R-18 and R-19, its inputs satisfy R-20 and R-21, its guarantees satisfy R-23 and R-24, its failure behaviour satisfies R-25 and R-26, and its compatibility satisfies R-28 and R-29.

A consumer conforms when it satisfies R-09 through R-14, R-27, and R-30.

An orchestrator conforms when it satisfies R-16, R-17, and the preflight obligation in section 11.

Declaration without demonstration is not conformance. Demonstration without declaration leaves a consumer unable to discover what it may rely upon. [STD-0012](validation-specification.md) defines how conformance is checked and reported; this standard defines only what conformance is.

## 15. Examples

*This section is informative.*

A producer declares that it requires read access to a subject at a stated revision. The orchestrator cannot supply it. The producer is not invoked, the artifact type is recorded `Unavailable` with the unmet precondition named, and consumers of that type declare their own degradation.

A producer is authorized for two thirds of its declared scope. It emits `Partial` with the examined boundary recorded, rather than examining what it can and declaring `Complete`.

A producer adds an optional input that raises confidence when supplied. Additive under R-31; no consumer is affected and no version is broken.

A producer changes from emitting `Partial` to emitting `Failed` when access is restricted. Breaking under R-32, because every consumer's handling changes, even though successful output is unchanged.

An organization substitutes its own architecture producer. It emits the same types at compatible versions, requires no stronger preconditions, and guarantees no less. Every downstream consumer continues unchanged and none can detect the substitution.

A producer examines its full declared scope and finds nothing. Its postconditions are satisfied completely; the artifact is `Complete` with no records; and the absence is interpretable because the scope is declared.

## 16. Informative Notes

*This section is informative.*

**On the boundary with the artifact standard.** Obligations attaching to producers and consumers were initially placed in STD-0008 alongside artifact structure. Implementing this standard required drawing the line stated in section 1: artifacts are things, exchanges are interactions, and the obligations of a well-behaved participant are not properties of a well-formed artifact. Six requirements moved from STD-0008 to this standard as a result, and STD-0008 records their retirement so that their identifiers are not reused. The move was made rather than duplicating the obligations across two standards, which would have violated one-home-per-concept and created precisely the drift these standards exist to prevent.

**On what contracts deliberately cannot do.** A contract cannot ensure a producer is honest, competent, or thorough. R-05 and R-26 state the obligations, and both are judgment-checkable because no structural check reaches them. What a contract does is make dishonesty *visible when looked for*: a declared scope can be compared against what was examined, a declared completeness against a recorded boundary, a conclusion against the inputs it derives from. The contract converts a question of trust into a question of evidence, which is the most a specification can do.

**On asymmetry.** A producer's obligations run to consumers it will never meet, which is why no consumer can waive them. This is the property that makes an ecosystem of independently developed methodologies possible, and it is also why contract evolution is deliberately expensive: a change agreed between two parties who know each other still breaks every party who does not.

## 17. Related Documents

*This section is informative.*

- [Artifact Specification Standard](artifact-specification.md)
- [Metadata Specification Standard](metadata-specification.md)
- [Evidence and Confidence Standard](evidence-and-confidence.md)
- [Framework Artifact Model](../01-foundation/framework-artifact-model.md)
- [Framework Core Architecture](../01-foundation/framework-core-architecture.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [ADR-0004: Depend on Artifact Types](../ADR/ADR-0004-depend-on-artifact-types.md)
