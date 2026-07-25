---
id: STD-0007
title: Evidence and Confidence Standard
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Methodology
tags: [evidence, confidence, uncertainty, scoring, semantics, standard]
related: [artifact-specification.md, metadata-specification.md, glossary.md, ../01-foundation/framework-core-architecture.md, ../01-foundation/framework-artifact-model.md, ../03-audit-engine/01-architecture-discovery.md, ../09-capabilities/CAP-0001-repository-audit.md]
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
  "16": informative
  "17": informative
  "18": informative
requirements:
  - id: R-01
    level: MUST
    check: judgment
    severity: blocking
    scope: conclusion
  - id: R-02
    level: MUST
    check: mechanical
    severity: blocking
    scope: conclusion
  - id: R-03
    level: MUST
    check: judgment
    severity: blocking
    scope: evidence
  - id: R-04
    level: MUST
    check: judgment
    severity: blocking
    scope: state
  - id: R-05
    level: MUST
    check: judgment
    severity: blocking
    scope: state
  - id: R-06
    level: MUST
    check: judgment
    severity: blocking
    scope: state
  - id: R-07
    level: MUST
    check: mechanical
    severity: blocking
    scope: state
  - id: R-08
    level: MUST
    check: mechanical
    severity: blocking
    scope: evidence
  - id: R-09
    level: MUST
    check: mechanical
    severity: blocking
    scope: evidence
  - id: R-10
    level: MUST
    check: judgment
    severity: blocking
    scope: evidence
  - id: R-11
    level: MUST
    check: judgment
    severity: blocking
    scope: evidence
  - id: R-12
    level: MUST
    check: judgment
    severity: blocking
    scope: evidence
  - id: R-13
    level: MUST
    check: judgment
    severity: blocking
    scope: confidence
  - id: R-14
    level: MUST
    check: judgment
    severity: blocking
    scope: confidence
  - id: R-15
    level: MUST
    check: judgment
    severity: blocking
    scope: confidence
  - id: R-16
    level: MUST
    check: judgment
    severity: blocking
    scope: completeness
  - id: R-17
    level: MUST
    check: judgment
    severity: blocking
    scope: completeness
  - id: R-18
    level: MUST
    check: judgment
    severity: blocking
    scope: completeness
  - id: R-19
    level: MUST
    check: judgment
    severity: blocking
    scope: promotion
  - id: R-20
    level: MUST
    check: mechanical
    severity: blocking
    scope: promotion
  - id: R-21
    level: MUST
    check: judgment
    severity: blocking
    scope: promotion
  - id: R-22
    level: MUST
    check: judgment
    severity: blocking
    scope: degradation
  - id: R-23
    level: MUST
    check: judgment
    severity: blocking
    scope: degradation
  - id: R-24
    level: MUST
    check: mechanical
    severity: blocking
    scope: degradation
  - id: R-25
    level: MUST
    check: mechanical
    severity: blocking
    scope: propagation
  - id: R-26
    level: MUST
    check: mechanical
    severity: blocking
    scope: propagation
  - id: R-27
    level: MUST
    check: judgment
    severity: blocking
    scope: propagation
  - id: R-28
    level: MUST
    check: mechanical
    severity: blocking
    scope: propagation
  - id: R-29
    level: MUST
    check: mechanical
    severity: blocking
    scope: composition
  - id: R-30
    level: MUST
    check: mechanical
    severity: blocking
    scope: composition
  - id: R-31
    level: MUST
    check: judgment
    severity: blocking
    scope: scoring
  - id: R-32
    level: MUST
    check: mechanical
    severity: blocking
    scope: scoring
  - id: R-33
    level: MUST
    check: mechanical
    severity: blocking
    scope: scoring
  - id: R-34
    level: MUST
    check: mechanical
    severity: blocking
    scope: scoring
  - id: R-35
    level: MUST
    check: mechanical
    severity: blocking
    scope: scoring
  - id: R-36
    level: MUST
    check: judgment
    severity: blocking
    scope: conflict
  - id: R-37
    level: MUST
    check: judgment
    severity: blocking
    scope: conflict
---

# Evidence and Confidence Standard

**Implements**

- [ADR-0002](../ADR/ADR-0002-requirements-as-metadata.md) — requirements declared in metadata
- [ADR-0003](../ADR/ADR-0003-normative-informative-separation.md) — section-level normativity
- [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md) — propagation across producer boundaries
- [Framework Artifact Model](../01-foundation/framework-artifact-model.md) sections 8, 10, 12 — completeness, state and confidence propagation
- [Framework Core Architecture](../01-foundation/framework-core-architecture.md) section 4.15 — evidence as the record structure of an artifact

**Unblocks**

- STD-0011 Contracts
- STD-0012 Validation
- Architecture Discovery refactor
- Database Discovery refactor
- The remaining discovery methodologies
- CAP-0001 composition rules

## 1. Purpose and Scope

*This section is informative.*

This standard defines what evidence means. It is the semantic foundation the rest of the framework reasons with.

Three neighbouring standards hold adjacent responsibilities and this one does not encroach on them. [STD-0008](artifact-specification.md) defines where evidence attaches. [STD-0010](metadata-specification.md) defines how evidence is represented. STD-0012 defines how evidence is validated. This standard defines only what it means.

**In scope.** The definition and role of evidence; the four evidence states and their meanings; provenance and attributability; evidence quality, reliability, corroboration, and freshness; the confidence model; completeness semantics; promotion and degradation; uncertainty propagation across derivation; confidence composition; scoring principles; and the treatment of conflicting evidence.

**Out of scope.** Metadata keys and encodings; artifact structure and envelope membership; validator behavior and reporting; the content of any methodology; and any specific scoring dimension set, which each methodology declares for its own domain.

**Why meaning needs a standard.** A framework in which eleven independently developed methodologies compose has a specific failure mode: each is individually careful, and the composition is nonetheless wrong, because a conclusion drawn from a weak input is recorded as though it were strong. No amount of structural rigour prevents that. It is prevented only by rules about what the words mean and what may be inferred from what.

## 2. Terminology and Conventions

*This section is normative.*

`MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` carry their conventional meanings as stated in [Documentation Navigation](../README.md).

**Evidence** — a recorded observation with sufficient provenance for an independent party to locate it and judge it.

**Conclusion** — an assertion about a subject, carried by a record.

**Evidence state** — the epistemic status of a conclusion, drawn from the closed set in section 4.

**Confidence** — the assessed quality of the evidence supporting a conclusion, drawn from the closed set in section 7.

**Load-bearing input** — an input without which a conclusion would not be reached, or would be reached differently.

**Corroborating input** — an input consistent with a conclusion that is independently supported without it.

**Independent evidence** — evidence collected by the asserting party, from a source not derived from any input it already relies upon.

Requirements are identified as `R-nn` and declared in front matter per ADR-0002. A requirement is addressable as `STD-0007#R-01`.

Many requirements in this standard are marked `judgment`. This reflects their nature: whether a conclusion overstates its evidence is not mechanically decidable. Marking them `judgment` records that honestly rather than implying an enforcement that does not exist. STD-0012 determines how judgment requirements are handled.

## 3. Evidence and Its Role

*This section is normative.*

**R-01.** Every conclusion MUST be supported by evidence, or MUST be recorded as `Unknown` with the scope reason that bounds it.

**R-02.** A conclusion MUST carry exactly one evidence state.

**R-03.** Evidence MUST record an observation, not an interpretation. Where an interpretation is recorded, it is a conclusion and is subject to R-01.

The separation of observation from interpretation is the discipline on which everything else rests. An evidence item stating "the configuration is insecure" is not evidence; it is a conclusion wearing evidence's clothing, and it cannot be independently challenged because there is nothing to re-examine.

**R-11.** Evidence MUST describe structure and MUST NOT reproduce content. A recorded observation MUST NOT contain a secret value, a credential, an endpoint, or a subject record value.

Evidence is not proof, and this standard does not treat it as such. Evidence is what allows a reviewer to reach the same conclusion, or to reach a different one and say why.

## 4. Evidence States

*This section is normative.*

The evidence state vocabulary is closed and comprises exactly four values, ordered as a lattice.

```
Verified  >  Observed  >  Inferred  >  Unknown
```

**R-04.** A conclusion is `Verified` only where it is directly confirmed by authoritative evidence that an independent party could reproduce against the same subject state.

Verification requires that the confirming observation be of the thing itself, not of a declaration about the thing. A declaration, however authoritative its author, supports `Observed`.

**R-05.** A conclusion is `Observed` where it is present in an inspected artifact but its operational effect is not independently confirmed.

`Observed` is the correct state for the great majority of conclusions drawn from source material. A configuration file declaring a setting is evidence that the declaration exists; it is not evidence that the setting is in force.

**R-06.** A conclusion is `Inferred` where it is reasoned from one or more observations. The assumptions relied upon MUST be stated.

An inference whose assumptions are not stated cannot be challenged, and an unchallengeable conclusion is not an audit finding.

**R-07.** A conclusion is `Unknown` where evidence is absent, inaccessible, conflicting, or out of scope. An `Unknown` conclusion MUST record which of those applies and the scope that bounds it.

`Unknown` is a determination, not a failure. It asserts that the question was asked and not answered, which is materially different from the question not having been asked — a distinction section 8 carries into completeness.

**Unknown is not low confidence.** Confidence describes the quality of evidence supporting a conclusion. `Unknown` records that there is no conclusion. A record marked `Unknown` MUST NOT be assigned a confidence level for the conclusion it does not make.

## 5. Evidence Provenance

*This section is normative.*

**R-08.** Every evidence item MUST be attributable. It MUST record its source, its location, the environment in which it was observed, the revision or time of observation, its collector, and its redaction state.

**R-09.** An observation not derived from the subject's source MUST record the environment in which it was made.

Structure observed in one environment is not evidence about another. This is the single most common provenance failure, and it is silent: an observation from a staging environment is indistinguishable from a production observation once the environment is dropped.

**R-10.** Evidence lacking attributable provenance MUST NOT support a conclusion above `Inferred`.

Unattributed material may inform reasoning. It may not confirm it. This rule is what prevents an undated diagram or a remembered conversation from carrying the same weight as an inspected artifact.

**Redaction.** Where evidence is redacted such that a reviewer cannot evaluate it, the conclusion it supports MUST be degraded per section 10. Redaction protects content; it does not preserve evidentiary weight.

## 6. Evidence Quality

*This section is normative.*

**R-12.** Evidence MUST be assigned a reliability class reflecting its distance from the thing it describes.

| Class | Meaning |
| --- | --- |
| `authoritative` | The evidence is the thing itself, or an authoritative record of it, observed directly |
| `derived` | The evidence is produced from the thing by a recorded process |
| `reported` | The evidence is an account of the thing by a party, without independent observation |
| `undated` | The evidence has no reliable time or revision attribution |

**Corroboration.** Two evidence items corroborate a conclusion only where they are independent. Two readings of the same artifact, two derivations from the same source, or one account repeated by two parties are a single item observed twice, and MUST NOT be treated as corroboration.

Corroboration raises confidence. It does not raise evidence state, which is governed by section 9.

**Freshness.** Evidence describes a subject at a moment. It expires when the subject changes in a way that could alter the conclusion. Expired evidence MUST NOT be silently retained; it is either refreshed or the conclusion is degraded per section 10.

**Negative evidence.** Absence of an observation within a searched scope is evidence that it was not found there, using the recorded method. It is never evidence that the thing does not exist. A conclusion of absence MUST record the scope searched and the method used, or it is not a conclusion at all.

## 7. Confidence Model

*This section is normative.*

The confidence vocabulary is closed and comprises `High`, `Medium`, `Low`.

**R-13.** Confidence MUST be assigned according to the quality of the evidence supporting a conclusion.

| Level | Basis |
| --- | --- |
| `High` | Direct, current, corroborated evidence from independent sources |
| `Medium` | Direct but incomplete evidence, or consistent evidence from a single reliable source |
| `Low` | Indirect indicators, stale or undated evidence, or an unresolved contradiction |

**R-14.** Confidence MUST NOT be assigned on the basis of the severity, importance, or desirability of the conclusion.

**Confidence is not severity.** A finding may be severe and weakly evidenced. Conflating the two produces the framework's most damaging failure: a serious finding dismissed because its evidence was thin, when the correct response is to obtain better evidence.

**R-15.** A conclusion that is both high in consequence and `Low` in confidence MUST be recorded as requiring verification. It MUST NOT be discarded, and it MUST NOT be reported at a confidence its evidence does not support.

Confidence and evidence state are orthogonal and both are required. A conclusion may be `Observed` at `High` confidence — a declaration seen clearly in a current artifact — or `Observed` at `Low` confidence, where the artifact is undated and its authority uncertain.

## 8. Completeness Semantics

*This section is normative.*

Completeness describes an examination, where evidence state describes a conclusion. The two answer different questions: what did the examiner determine, and how much did the examiner look at.

**R-16.** An examination MUST declare its completeness. The vocabulary is closed and its members mean:

| State | Meaning |
| --- | --- |
| `Complete` | The declared scope was examined and every conclusion reached within it was recorded |
| `Partial` | Less than the declared scope was examined; the examined boundary is recorded |
| `NotApplicable` | The subject does not admit conclusions of this kind, for a recorded reason |
| `Unavailable` | The examination was not performed |
| `Failed` | The examination was attempted and could not be completed |

**R-17.** Absence of a conclusion within a `Complete` examination means the examiner looked within the declared scope and found nothing. It MUST NOT be read as absence within any wider scope.

**R-18.** `NotApplicable` and `Unavailable` MUST NOT be treated as equivalent, and neither MUST be treated as `Complete` with no conclusions.

The distinction is the practical heart of this section. `NotApplicable` is a determination about the subject: it has no data stores, no user interface, no external integrations. `Unavailable` is a statement about the examination: it did not happen. Both yield an empty result. The first is knowledge; the second is a hole. A framework that loses the distinction will eventually report an untroubled result for a domain nobody examined, and will do so with structurally valid output.

`NotApplicable` MUST NOT lower a score and MUST NOT be reported as a gap. `Unavailable` and `Failed` MUST NOT contribute to a score at all, and MUST be reported as reduced coverage per section 13.

STD-0008 states the obligations a producer and consumer carry with respect to these states. This section states what they mean.

## 9. Promotion Rules

*This section is normative.*

Promotion is raising a conclusion's evidence state or confidence.

**R-19.** A conclusion MUST NOT be promoted by reasoning alone. Promotion requires independent evidence collected by the promoting party.

Re-examining the same evidence more carefully produces a better-argued conclusion at the same state. This is the rule that prevents diligence from being mistaken for verification.

**R-20.** A promotion MUST record the independent evidence that justifies it.

An unrecorded promotion is indistinguishable from an unsupported assertion, and a reviewer has no way to tell them apart.

**R-21.** Promotion to `Verified` requires evidence of the thing itself, observed by the promoting party in a named environment. A conclusion MUST NOT be promoted to `Verified` on the basis of a declaration, however authoritative.

This is why, in the audit domain, only a methodology that observes a running system can promote a conclusion to `Verified`. Every methodology that reads declarations is bounded at `Observed`, no matter how thorough it is.

Corroboration may raise confidence without raising evidence state. Two independent sources agreeing on a declaration make the declaration more certainly a declaration; they do not make it a fact about the running system.

## 10. Degradation Rules

*This section is normative.*

Degradation is lowering a conclusion's evidence state or confidence in response to a change in its support.

**R-22.** A conclusion MUST be degraded where its supporting evidence expires, is withdrawn, is superseded, or is found to describe a different subject state than the one under examination.

**R-23.** A conclusion whose supporting evidence is redacted such that a reviewer cannot evaluate it MUST be degraded to at most `Inferred`.

**R-24.** Where a load-bearing input is withdrawn or invalidated, every conclusion derived from it MUST be degraded to `Unknown` unless independently supported.

Degradation is not a penalty and MUST NOT be resisted. A conclusion that was correctly `Verified` last month and whose subject has since changed is not wrong; it is stale, and reporting it at its former state is what makes it wrong.

**Asymmetry.** Degradation is automatic and promotion is not. Losing support degrades a conclusion without anyone deciding to; regaining support requires new evidence and an explicit act. This asymmetry is deliberate: the cost of an unnoticed degradation is a false assurance, and the cost of an unnoticed promotion opportunity is merely a conservative report.

## 11. Uncertainty Propagation

*This section is normative.*

This section governs conclusions drawn across a derivation boundary, including a boundary between independently developed producers.

**R-25.** A derived conclusion's evidence state MUST NOT exceed the minimum state among its load-bearing inputs.

**R-26.** A derived conclusion's confidence MUST NOT exceed the minimum confidence among its load-bearing inputs.

**R-27.** A conclusion MUST distinguish its load-bearing inputs from its corroborating inputs. Only load-bearing inputs constrain state and confidence.

The distinction matters in both directions. Treating a corroborating input as load-bearing depresses conclusions that were independently supported; treating a load-bearing input as corroborating is the laundering this section exists to prevent.

**R-28.** A conclusion with an `Unknown` load-bearing input MUST itself be `Unknown`.

An `Unknown` input does not make a conclusion uncertain. It removes the conclusion's basis. There is a difference between "we think this is probably true" and "we have no idea, and reasoned from that."

**Breaking the cap.** A consumer may exceed these caps only by contributing independent evidence of its own, at which point the conclusion rests on that evidence and the derivation becomes corroborating. This is promotion, and section 9 applies in full.

**Why this is stated as a rule rather than left to care.** In a composition of many producers, each individually careful, the default outcome is that uncertainty is lost at every boundary. Nobody decides to overstate; each party simply reasons from what it received and records its own confidence in its own reasoning. The result is a report whose final conclusions are far stronger than anything that supports them.

## 12. Confidence Composition

*This section is normative.*

**R-29.** Where conclusions are aggregated, the aggregate confidence MUST be the minimum confidence among the load-bearing conclusions aggregated. It MUST NOT be a mean.

**R-30.** An aggregate's evidence state MUST be the minimum state among the conclusions aggregated.

A set of `Medium` conclusions does not compose to a `High` one. Aggregation adds breadth, not certainty. The intuition that many moderate observations combine into a strong result holds only for independent measurements of the same quantity, which is not what an aggregation of distinct conclusions is.

Where an aggregate is reported, the distribution MUST be available and not only the minimum: an aggregate of forty `High` conclusions and one `Low` is reported as `Low` under R-29, and a reader is entitled to see that this is what happened.

## 13. Scoring Principles

*This section is normative.*

This section states what a score means and the guards that apply to every scale in the framework. It does not define any dimension set; each methodology declares its own.

**R-31.** A score MUST be an assessment supported by findings, and MUST NOT be presented as a measurement.

**R-32.** Every score MUST show its calculation and MUST retain the evidence and confidence of each contributing dimension.

**R-33.** An aggregate score MUST be reported as an arithmetic mean only where every contributing dimension carries `Medium` or `High` confidence. Otherwise a range MUST be reported and the low-confidence dimensions MUST be named.

**R-34.** Any dimension scored at the lowest two levels of its scale MUST trigger an escalation regardless of the aggregate.

A critical weakness MUST NOT be averaged away. This is the guard that distinguishes a scoring system from a reassurance mechanism.

**R-35.** Where an aggregate covers fewer than all declared dimensions, it MUST be reported as a bounded range with the absent dimensions named. It MUST NOT be reported as a mean over the dimensions present.

R-35 prevents the partial-coverage failure: three domains examined out of eleven, averaged, and reported as a confident overall figure. The absent domains are not neutral, and treating them as though they were is a false claim about the subject.

**The framework's scale.** Where a methodology uses the framework's common scale, `0` means no reliable evidence exists or the dimension is critically unfit, `1` means pervasive evidenced weakness, `2` significant evidenced risk, `3` adequate with material gaps, `4` sound with bounded inconsistencies, and `5` clear and evidence-backed. A methodology MAY define a different scale, and MUST state its meanings and its lowest two levels for the purposes of R-34.

A score never substitutes for the findings beneath it. A reader who acts on a score without reading its findings has been given a number, not an assessment.

## 14. Conflicting Evidence

*This section is normative.*

**R-36.** Where evidence conflicts, both items MUST be retained and the conflict MUST be described. An item MUST NOT be selected over another by preference, recency alone, or convenience.

**R-37.** A conclusion resting on conflicting evidence MUST be recorded as `Unknown`, with separate reliability assessments for each conflicting item.

A conflict is itself a finding, and frequently a more valuable one than either item would have been alone. Two sources disagreeing about a subject's structure indicates that something has diverged, and the divergence is usually the thing worth knowing.

Resolution requires new independent evidence, at which point section 9 governs.

## 15. Conformance

*This section is normative.*

A conclusion conforms when it satisfies R-01, R-02, R-04 through R-07, R-13, R-14, and R-15.

An evidence item conforms when it satisfies R-03, R-08, R-09, R-11, and R-12.

A derived conclusion additionally conforms when it satisfies R-25 through R-28.

An aggregate conforms when it satisfies R-29 and R-30.

A score conforms when it satisfies R-31 through R-35.

A producer conforms when its promotions satisfy R-19 through R-21, its degradations satisfy R-22 through R-24, and its treatment of conflict satisfies R-36 and R-37.

## 16. Examples

*This section is informative.*

A dependency manifest declares a runtime version. The conclusion "the project declares this runtime" is `Observed` at `High` confidence. The conclusion "the project runs on this runtime" is `Inferred`, because no observation of the running system supports it.

The same runtime is confirmed by an execution log from a named environment at a recorded time. The conclusion is now `Verified` for that environment, and the promotion records the log as its justification.

A downstream methodology consumes a classification record marked `Inferred` at `Low` confidence and reasons carefully from it. Its conclusion is capped at `Inferred`, `Low`. Careful reasoning improved the argument, not the evidence.

An architecture artifact is regenerated after a refactor. A downstream conclusion derived from the earlier artifact is degraded, because its load-bearing input now describes a different subject state.

A deployment guide describes one service while orchestration manifests declare three. Neither is selected. The conclusion is `Unknown`, both items are retained with separate reliability assessments, and the conflict is reported as a finding.

An audit examines three of eleven domains. Each scores 4. The aggregate is reported as a range with eight domains named absent, not as 4.

## 17. Informative Notes

*This section is informative.*

The rules in sections 11 and 12 are the reason this standard exists as a separate document rather than as a section of the artifact specification. Structure can be validated mechanically; meaning cannot, and a composition of many careful producers still degrades into overconfidence unless the rules about inference are written down and agreed.

A large proportion of this standard's requirements are marked `judgment`. That is an honest description rather than a weakness in the standard. Whether a conclusion overstates its evidence is not decidable by inspection of its structure. What structure can do is make the overstatement visible: a promotion without recorded justification, a derived conclusion stronger than its inputs, an aggregate mean over low-confidence dimensions. Those are mechanically detectable, and the requirements that carry them are marked accordingly.

The asymmetry in section 10 — automatic degradation, deliberate promotion — is the single most useful property in this standard for an automated system. It means that neglect produces conservative output. A framework in which neglect produces confident output is one that fails quietly.

## 18. Related Documents

*This section is informative.*

- [Artifact Specification Standard](artifact-specification.md)
- [Metadata Specification Standard](metadata-specification.md)
- [Framework Glossary](glossary.md)
- [Framework Artifact Model](../01-foundation/framework-artifact-model.md)
- [Framework Core Architecture](../01-foundation/framework-core-architecture.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [ADR-0004: Depend on Artifact Types](../ADR/ADR-0004-depend-on-artifact-types.md)
