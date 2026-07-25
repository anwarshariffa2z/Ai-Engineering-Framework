---
id: STD-0012
title: Validation Specification Standard
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Methodology
tags: [validation, conformance, enforcement, reporting, standard]
related: [artifact-specification.md, metadata-specification.md, evidence-and-confidence.md, contract-specification.md, ../01-foundation/framework-core-architecture.md, ../01-foundation/framework-artifact-model.md, ../ADR/ADR-0002-requirements-as-metadata.md, ../ADR/ADR-0003-normative-informative-separation.md, ../ADR/ADR-0004-depend-on-artifact-types.md]
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
  "20": informative
requirements:
  - id: R-01
    level: MUST
    check: mechanical
    severity: blocking
    scope: validator
  - id: R-02
    level: MUST
    check: mechanical
    severity: blocking
    scope: validator
  - id: R-03
    level: MUST
    check: mechanical
    severity: blocking
    scope: validator
  - id: R-04
    level: MUST
    check: mechanical
    severity: blocking
    scope: validator
  - id: R-05
    level: MUST
    check: mechanical
    severity: blocking
    scope: validator
  - id: R-06
    level: MUST
    check: mechanical
    severity: blocking
    scope: validator
  - id: R-07
    level: MUST
    check: mechanical
    severity: blocking
    scope: validator
  - id: R-08
    level: MUST
    check: mechanical
    severity: blocking
    scope: lifecycle
  - id: R-09
    level: MUST
    check: mechanical
    severity: blocking
    scope: lifecycle
  - id: R-10
    level: MUST
    check: mechanical
    severity: blocking
    scope: lifecycle
  - id: R-11
    level: MUST
    check: mechanical
    severity: blocking
    scope: lifecycle
  - id: R-12
    level: MUST
    check: mechanical
    severity: blocking
    scope: classification
  - id: R-13
    level: MUST
    check: mechanical
    severity: blocking
    scope: classification
  - id: R-14
    level: MUST
    check: mechanical
    severity: blocking
    scope: classification
  - id: R-15
    level: MUST
    check: mechanical
    severity: blocking
    scope: structural
  - id: R-16
    level: MUST
    check: mechanical
    severity: blocking
    scope: semantic
  - id: R-17
    level: MUST
    check: mechanical
    severity: blocking
    scope: judgment
  - id: R-18
    level: MUST
    check: mechanical
    severity: blocking
    scope: judgment
  - id: R-19
    level: MUST
    check: mechanical
    severity: blocking
    scope: unenforceable
  - id: R-20
    level: MUST
    check: mechanical
    severity: blocking
    scope: conformance
  - id: R-21
    level: MUST
    check: mechanical
    severity: blocking
    scope: conformance
  - id: R-22
    level: MUST
    check: mechanical
    severity: blocking
    scope: conformance
  - id: R-23
    level: MUST
    check: mechanical
    severity: blocking
    scope: severity
  - id: R-24
    level: MUST
    check: mechanical
    severity: blocking
    scope: severity
  - id: R-25
    level: MUST
    check: mechanical
    severity: blocking
    scope: outcome
  - id: R-26
    level: MUST
    check: mechanical
    severity: blocking
    scope: outcome
  - id: R-27
    level: MUST
    check: mechanical
    severity: blocking
    scope: outcome
  - id: R-28
    level: MUST
    check: mechanical
    severity: blocking
    scope: outcome
  - id: R-29
    level: MUST
    check: mechanical
    severity: blocking
    scope: exception
  - id: R-30
    level: MUST
    check: mechanical
    severity: blocking
    scope: exception
  - id: R-31
    level: MUST
    check: mechanical
    severity: blocking
    scope: exception
  - id: R-32
    level: MUST
    check: mechanical
    severity: blocking
    scope: reporting
  - id: R-33
    level: MUST
    check: mechanical
    severity: blocking
    scope: reporting
  - id: R-34
    level: MUST
    check: mechanical
    severity: blocking
    scope: reporting
  - id: R-35
    level: MUST
    check: mechanical
    severity: blocking
    scope: output
  - id: R-36
    level: MUST
    check: mechanical
    severity: blocking
    scope: output
  - id: R-37
    level: MUST
    check: mechanical
    severity: blocking
    scope: output
  - id: R-38
    level: MUST
    check: mechanical
    severity: blocking
    scope: outcome
  - id: R-39
    level: MUST
    check: mechanical
    severity: blocking
    scope: conformance
---

# Validation Specification Standard

**Implements**

- [ADR-0002](../ADR/ADR-0002-requirements-as-metadata.md) — checks bind to requirement identities
- [ADR-0003](../ADR/ADR-0003-normative-informative-separation.md) — only normative sections are enforceable
- [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md) — validation across producer boundaries

**Unblocks**

- Validator and registry generator
- Architecture Discovery refactor
- Database Discovery refactor
- The remaining discovery methodologies

## 1. Purpose and Scope

*This section is informative.*

This standard defines how conformance is evaluated and enforced. It owns validator behavior.

Four neighbouring standards hold adjacent responsibilities and this one does not encroach on them. [STD-0008](artifact-specification.md) defines what an artifact is. [STD-0010](metadata-specification.md) defines how metadata is represented. [STD-0007](evidence-and-confidence.md) defines what evidence and confidence mean. [STD-0011](contract-specification.md) defines what producers, consumers, and orchestrators must do. This standard defines how any of that is checked.

**In scope.** The validation model; validator responsibilities; the validation lifecycle; validation classes; machine-verifiable, human-review, and unenforceable checks; conformance evaluation; severity levels; pass, warn, and fail semantics; exception handling; validation reporting; and validator outputs.

**Out of scope.** Artifact structure, metadata representation, evidence semantics, and participant obligations, each owned by the standard named above. This standard states no requirement about what a conforming artifact contains, only about how a validator establishes whether it conforms.

**The distinction that governs this standard.** A consumer that fails closed on an unreadable artifact is protecting its own conclusions; that is participant behaviour and belongs to STD-0011. A validator that fails closed on the same artifact is performing its function; that is validator behaviour and belongs here. The rule is identical, the actor is not, and conflating them would put enforcement in the hands of every participant rather than in a checkable place.

## 2. Terminology and Conventions

*This section is normative.*

`MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` carry their conventional meanings as stated in [Documentation Navigation](../README.md).

**Validator** — a process whose function is to establish whether a subject conforms to a stated requirement set.

**Check** — one evaluation bound to exactly one requirement identity.

**Subject of validation** — the object being checked: a document, an artifact, a type definition, a producer, a consumer, or a composition.

**Outcome** — the result of a check: `pass`, `warn`, `fail`, or `not-evaluated`.

**Coverage** — the proportion of a requirement set that a validator evaluated, and which requirements it did not.

**Exception** — a recorded, approved, scoped, and expiring allowance for a known non-conformance.

Requirements are identified as `R-nn` and declared in front matter per ADR-0002. A requirement is addressable as `STD-0012#R-01`.

## 3. The Validation Model

*This section is normative.*

**R-01.** Every check MUST bind to exactly one requirement identity. A validator MUST NOT evaluate a condition that no requirement states.

R-01 is the foundation of the model and the reason ADR-0002 placed requirements in metadata. A check without a requirement identity is a private opinion held by a tool, and nothing reconciles it against the standards. A requirement without a check is unenforced but visible. The first is dangerous; the second is merely incomplete.

**R-02.** A validator MUST derive its requirement set from the declared requirements of the standards in force, and MUST record the standard versions it evaluated against.

**R-03.** A validator MUST NOT strengthen, weaken, or reinterpret a requirement. Where a requirement is ambiguous, the validator MUST record the ambiguity rather than resolve it.

A validator is an instrument, not an authority. It reports what the standards say, at the versions recorded, about the subject examined.

**A validator is itself a producer.** It emits a validation artifact and is bound by STD-0011 accordingly: it declares its preconditions, its inputs, its guarantees, and its failure behaviour, and it declares completeness honestly.

## 4. Validator Responsibilities

*This section is normative.*

**R-04.** A validator MUST reject a subject that violates any blocking requirement in force.

**R-05.** A validator MUST NOT skip a subject it cannot interpret. An uninterpretable subject MUST produce a `fail` outcome, never an absent one.

**R-06.** A validator MUST declare its coverage: which requirements it evaluated, which it did not, and why.

R-06 is what prevents the most damaging validator failure, which is silence mistaken for approval. A validator evaluating twelve of forty requirements and reporting no failures has not established conformance, and a report that does not say so is misleading even though every statement in it is true.

**R-07.** A validator MUST be reproducible. The same subject, requirement set, and standard versions MUST produce the same outcomes.

## 5. Validation Lifecycle

*This section is normative.*

**R-08.** Validation MUST proceed in ordered phases, and a phase MUST NOT begin until the preceding phase has completed without a blocking failure that prevents interpretation.

| Phase | Purpose | Failure effect |
| --- | --- | --- |
| Acquire | Locate the subject and the requirement set | Cannot proceed |
| Parse | Read the subject's metadata or envelope | Cannot proceed; `fail` |
| Structural | Evaluate form against declared schema | May proceed to record further failures |
| Semantic | Evaluate meaning, relationships, and cross-references | May proceed |
| Judgment routing | Route judgment-required checks to human review | Always proceeds |
| Report | Emit outcomes, coverage, and exceptions | Terminal |

**R-09.** Where a subject's metadata or envelope cannot be parsed, the validator MUST emit `fail` and MUST NOT evaluate any further check against that subject.

R-09 receives the rejection duty migrated from STD-0008. An unparseable envelope means every subsequent check would be evaluating a guess.

**R-10.** Composition-level checks MUST be evaluated before execution of the composition begins.

**R-11.** Where a composition contains a lineage cycle, the validator MUST detect it at composition time and MUST emit `fail` before execution begins, naming every participant in the cycle.

R-10 and R-11 receive the detection-timing duty migrated from STD-0008. The acyclicity property itself remains defined by STD-0008; this standard states only when and by whom it is detected.

## 6. Validation Classes

*This section is normative.*

**R-12.** Every check MUST be classified as structural, semantic, or judgment-required.

| Class | Establishes | Automatable |
| --- | --- | --- |
| Structural | The subject has the required form | Fully |
| Semantic | The subject's declarations are mutually consistent and correctly related | Fully, where the relation is declared |
| Judgment-required | The subject's declarations correspond to reality | Not by inspection |

**R-13.** A check's class MUST be derived from the `check` field of the requirement it binds to, per [STD-0010](metadata-specification.md) section 8. A validator MUST NOT reclassify a requirement.

**R-14.** A judgment-required check MUST NOT be reported as `pass` on the basis of automated evaluation alone.

R-14 is the guard against the most seductive validator failure: reporting that a producer declared completeness honestly because the completeness field was well formed. The field's form is structural; its truth is judgment.

## 7. Machine-Verifiable Checks

*This section is normative.*

**R-15.** A validator MUST mechanically evaluate every requirement whose declaration marks it `mechanical`.

Checks that are fully machine-verifiable include: presence and grammar of required metadata; identifier uniqueness, stability, and non-reuse; registry and front-matter agreement; link and reference resolution; normativity map totality; declared-versus-stated requirement correspondence; vocabulary membership for closed vocabularies; version grammar and ordering; layer and dependency direction; lineage acyclicity; envelope member presence; evidence-reference resolution; record-level state and confidence presence; propagation arithmetic against declared load-bearing inputs; profile-based compatibility evaluation; and the presence of a scope reason on every `Unknown`.

Propagation arithmetic deserves particular note. Whether a derived conclusion exceeds the minimum state of its declared load-bearing inputs is fully checkable, because both the derivation and the classification are declared. What is not checkable is whether the classification is honest, which section 9 addresses.

## 8. Human-Review Checks

*This section is normative.*

**R-16.** A validator MUST route every judgment-required check to human review, and MUST record the reviewer, the decision, and the date.

**R-17.** A judgment-required check awaiting review MUST carry the outcome `not-evaluated`. It MUST NOT carry `pass`.

**R-18.** A validator MUST NOT close a judgment-required check without a recorded human decision.

Checks requiring human review include: whether a declared scope corresponds to what was examined; whether a completeness state is honestly declared; whether an evidence state overstates its support; whether a load-bearing input was correctly distinguished from a corroborating one; whether an artifact type's semantic definition changed in a way requiring a new identity; whether a change was correctly classified as major; and whether an artifact discloses regulated content through described structure.

## 9. Obligations That Cannot Be Enforced

*This section is normative.*

**R-19.** Where a requirement cannot be enforced by any means available to the validator, the validator MUST record it as unenforceable rather than omitting it from coverage.

Three obligations are unenforceable in principle, not merely unimplemented:

**Honesty of scope.** No inspection of an artifact reveals whether its producer examined the scope it declared. A false `Complete` is structurally indistinguishable from a true one.

**Honesty of load-bearing classification.** Propagation depends on a producer correctly distinguishing load-bearing from corroborating inputs. Misclassification defeats propagation entirely and leaves no trace.

**Quality of analysis.** A shallow conforming producer and a thorough one satisfy identical contracts. This is stated by STD-0011 section 13 and is a property of contracts, not a gap in validation.

Recording these as unenforceable is itself the control. A framework that lists what it cannot check is honest about its own limits; one that omits them implies a completeness it does not have.

## 10. Conformance Evaluation

*This section is normative.*

**R-20.** Conformance MUST be evaluated against the conformance fixtures declared by the artifact type, per [STD-0008](artifact-specification.md) section 16.

**R-21.** A producer demonstrates conformance by emitting every fixture case. A consumer demonstrates conformance by reading every fixture case correctly. A validator MUST record which fixture cases were demonstrated and which were not.

R-20 and R-21 receive the fixture-demonstration duty migrated from STD-0011. The obligation to declare conformance remains a participant obligation and stays with STD-0011; the procedure by which the demonstration is evaluated is validator behaviour and belongs here.

**R-22.** Conformance MUST be evaluated and reported per artifact type. A validator MUST NOT report an aggregate conformance claim across types.

## 11. Severity Levels

*This section is normative.*

**R-23.** A check's severity MUST be derived from the `severity` field of the requirement it binds to. A validator MUST NOT assign a severity of its own.

| Severity | Meaning | Effect on the subject |
| --- | --- | --- |
| `blocking` | The subject does not conform | Rejected |
| `advisory` | The subject conforms but a recommended practice is unmet | Accepted with a recorded warning |

**R-24.** A validator MUST NOT downgrade a blocking severity, and MUST NOT upgrade an advisory severity, except through a recorded exception per section 13.

Severity is a property of the requirement, decided when the requirement was written. A validator that adjusts severity at evaluation time makes the requirement set unknowable from the standards alone.

## 12. Pass, Warn, and Fail Semantics

*This section is normative.*

**R-25.** Each check MUST produce exactly one outcome.

| Outcome | Meaning |
| --- | --- |
| `pass` | The check was evaluated and the requirement is satisfied |
| `warn` | An advisory requirement is unmet, or a blocking requirement is unmet under an active exception |
| `fail` | A blocking requirement is unmet |
| `not-evaluated` | The check was not evaluated; a reason is recorded |

**R-26.** `pass` MUST NOT be emitted for a check that was not evaluated. Absence of evaluation MUST be `not-evaluated`.

**R-27.** A validator MUST emit `fail` on: an unknown artifact type; an incompatible type version; an unparseable envelope or front matter; an unknown value in a closed vocabulary; an undeclared cross-revision input; a lineage cycle; or a violated propagation rule.

R-27 receives the fail-closed enumeration migrated from STD-0008. The governing principle is that a validator which ignores what it cannot handle reports success on content it never examined.

**R-28.** A validator MUST NOT emit `fail` for an unrecognized namespaced extension field. Unrecognized namespaced extensions MUST be ignored for the purpose of outcome determination and MUST be preserved in the validator's output.

R-28 receives the extension-tolerance rule migrated from STD-0008. Extension tolerance and fail-closed behaviour are complementary rather than contradictory: the validator fails on what it should understand and cannot, and tolerates what it was never meant to understand.

**R-38.** A subject's outcome is `fail` where any check failed, `warn` where none failed and any warned, and `pass` only where every applicable check was evaluated and passed. A subject with `not-evaluated` checks MUST NOT be reported as `pass` without its coverage stated alongside.

## 13. Exception Handling

*This section is normative.*

**R-29.** An exception MUST record the requirement identity it excepts, the subject it applies to, the rationale, the approver, and an expiry date.

**R-30.** An exception MUST convert a `fail` to a `warn`. It MUST NOT convert a `fail` to a `pass`, and it MUST NOT suppress the check.

**R-31.** An expired exception MUST have no effect. A validator MUST evaluate the underlying requirement as though no exception existed and MUST report the expiry.

An exception is a decision to proceed with a known non-conformance, taken by a named person, for a stated reason, until a stated date. It is not a way to make a problem disappear from a report, which is why R-30 forbids the outcome that would achieve that.

## 14. Validation Reporting

*This section is normative.*

**R-32.** A validation report MUST state the subject, the standard versions evaluated against, the validator identity and version, the evaluation time, and the requirement set evaluated.

**R-33.** A validation report MUST state coverage: the requirements evaluated, those not evaluated with reasons, those routed to human review, and those recorded unenforceable.

**R-34.** A validation report MUST NOT assert conformance beyond the requirements it evaluated.

R-34 is the reporting counterpart of R-06. A report claiming that a subject conforms, when it evaluated a subset, asserts something it did not establish. The permitted claim is that the subject conforms to the requirements evaluated, which the report names.

Every reported outcome carries: the check identity, the requirement identity it binds to, the class, the severity, the outcome, the located subject element, and any exception in force.

## 15. Validator Outputs

*This section is normative.*

**R-35.** A validator MUST emit its results as an artifact conforming to [STD-0008](artifact-specification.md), carrying an envelope, a declared completeness state, and recorded provenance.

**R-36.** A validation artifact MUST declare completeness honestly. A validator that evaluated part of its declared requirement set MUST declare `Partial` and record the boundary.

**R-37.** A validator MUST NOT emit a report that is not derived from a validation artifact.

The separation follows the framework's own model: the artifact holds the structured result and the report renders it. A report generated independently of an artifact has no evidence trail, which is the property that makes validation results reviewable rather than merely believable.

Validator outputs comprise: the validation artifact; a rendered report view; a coverage statement; a human-review queue for judgment-required checks; and an exception register recording every exception applied and its expiry.

## 16. Conformance

*This section is normative.*

A validator conforms when it satisfies R-01 through R-07, evaluates in the order required by R-08 through R-11, classifies per R-12 through R-14, evaluates mechanical requirements per R-15, routes judgment requirements per R-16 through R-18, records unenforceable obligations per R-19, evaluates conformance per R-20 through R-22, derives severity per R-23 and R-24, emits outcomes per R-25 through R-28, handles exceptions per R-29 through R-31, reports per R-32 through R-34, and emits outputs per R-35 through R-37.

**R-39.** A validator that cannot satisfy a requirement of this standard MUST declare the shortfall in its coverage statement rather than omitting the requirement from its requirement set.

## 17. Migrated Requirements

*This section is informative.*

Six obligations were relocated into this standard from STD-0008 and STD-0011, following a standards ownership review. The identifiers retired at their origin are not reused.

| Origin | Content | Now |
| --- | --- | --- |
| STD-0008 R-38 | Validator rejection and no-skip duty | R-04, R-05 |
| STD-0008 R-09, rejection clause | Unparseable envelope must be rejected | R-09 |
| STD-0008 R-20, detection clause | Lineage cycle detected at composition time, failing before execution | R-10, R-11 |
| STD-0008 §16 ¶2 | Fail-closed conditions | R-27 |
| STD-0008 §16 ¶3 | Unrecognized namespaced extension must not cause failure | R-28 |
| STD-0011 R-36, demonstration clause | Demonstration against conformance fixtures | R-20, R-21 |

STD-0008 R-09 and R-20 were narrowed rather than retired, retaining their non-validator clauses. STD-0011 R-36 was narrowed to the declaration obligation.

## 18. Examples

*This section is informative.*

A document's front matter fails to parse. The validator emits `fail` under R-09 and evaluates nothing further against it. Reporting eleven additional failures against a document it could not read would describe the validator's confusion rather than the document's state.

A registry row disagrees with a document's front matter. Structural check, mechanical, blocking. `fail` under R-04.

A producer declares `Complete` having examined two thirds of its scope. Structural checks pass; the honesty of the declaration is judgment-required, routed under R-16, and reported `not-evaluated` until a reviewer decides.

An organization adds a namespaced compliance field. The validator ignores it for outcome purposes under R-28 and preserves it in output.

A standard requires a practice the repository has not yet adopted. An exception is recorded with an approver and expiry. The check reports `warn` under R-30, and the underlying failure remains visible.

A validator evaluates thirty of forty-four requirements. The subject shows no failures. The report states `pass` for the thirty evaluated and records fourteen as not evaluated with reasons. It does not report that the subject conforms.

## 19. Informative Notes

*This section is informative.*

The requirement that every check bind to a requirement identity (R-01) is the property that keeps checks and standards from drifting apart. It became possible only because ADR-0002 placed requirements in metadata with stable identities. Under the rejected alternative, a validator would have carried its own interpretation of prose, and nothing would have reconciled the two.

Section 9 is unusual for a standard in that it enumerates what the framework cannot enforce. This is deliberate. The three unenforceable obligations are the ones on which every downstream conclusion rests, and a reader who does not know they are unenforced will over-trust the results. Naming them converts a hidden weakness into a stated limitation, which is the same discipline STD-0007 applies to evidence.

The consumer and validator fail-closed rules — STD-0011 R-27 and this standard's R-27 — state the same rule for different actors and are deliberately not merged. A consumer fails closed to protect its own conclusions; a validator fails closed because checking is its function. Merging them would make every participant an authority on conformance.

## 20. Related Documents

*This section is informative.*

- [Artifact Specification Standard](artifact-specification.md)
- [Metadata Specification Standard](metadata-specification.md)
- [Evidence and Confidence Standard](evidence-and-confidence.md)
- [Contract Specification Standard](contract-specification.md)
- [Framework Core Architecture](../01-foundation/framework-core-architecture.md)
- [Framework Artifact Model](../01-foundation/framework-artifact-model.md)
