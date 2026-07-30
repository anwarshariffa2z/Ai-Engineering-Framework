---
id: AUD-0010
title: Gap Analysis Methodology
version: 1.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-30
review_cycle: Annual
category: Audit Engine
tags: [audit-engine, gap-analysis, synthesis, methodology]
related: [05-business-workflow-discovery.md, 07-feature-inventory.md, 08-operations-manual.md, 10-runtime-verification.md, ../02-methodology/glossary.md, ../09-capabilities/CAP-0001-repository-audit.md]
object_type: Methodology
layer: 1
depends_on: [../02-methodology/evidence-and-confidence.md, ../02-methodology/artifact-specification.md, ../02-methodology/metadata-specification.md, ../02-methodology/contract-specification.md, ../02-methodology/validation-specification.md]
references: [05-business-workflow-discovery.md, 07-feature-inventory.md, 08-operations-manual.md, 10-runtime-verification.md, ../09-capabilities/CAP-0001-repository-audit.md, ../02-methodology/glossary.md]
meta_model_version: 1.0.0
producer_kinds: [gap-analysis, gap-discovery]
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
  "11": informative
  "12": informative
  "13": informative
---

# Gap Analysis Methodology

## 1. Purpose and Scope

*This section is informative.*

Gap Analysis is the synthesis step of a repository audit. It consumes every preceding artifact and reports where declared intent, implementation, and evidence disagree, what the audit could not determine, and where two methodologies reached conclusions that cannot both be right.

It produces no new observations about the subject. Every record it emits derives from an upstream artifact, and it is the methodology in which [STD-0008](../02-methodology/artifact-specification.md) R-46 and the uncertainty propagation rules of [STD-0007](../02-methodology/evidence-and-confidence.md) do the most work: a synthesis whose confidence exceeds that of its weakest load-bearing input is not a synthesis, it is an invention.

Its second output matters as much as its first. **An audit's unknowns are a finding.** A run that examined nine domains and could not determine authorization coverage in any of them has produced a specific, actionable result, and reporting only what was found would misrepresent it. The unknown register is therefore a first-class artifact rather than an appendix.

**This methodology consumes the framework standards and does not restate them.** Evidence states, confidence levels, scoring principles, completeness semantics, artifact structure, participant obligations, and validation behaviour are defined by the standards listed in section 3. Only synthesis-specific process is defined here.

## 2. Capability Declaration

*This section is normative.*

This methodology is a constituent of [CAP-0001 Repository Audit](../09-capabilities/CAP-0001-repository-audit.md), where it consumes the artifacts of every preceding methodology and supplies the divergence, unknown, and remediation registers to the capability's reporting surface and to runtime verification.

**Executor type.** Human, agent, or either.

**Safety boundaries.** The executor MUST NOT examine the subject directly, modify the subject, execute commands against it, or reproduce secret values, credentials, endpoints, or record content carried in upstream artifacts. This methodology reads artifacts, not repositories. Where an upstream artifact is redacted, the redaction is preserved and never reconstructed.

## 3. Standards Consumed

*This section is normative.*

| Standard | What this methodology takes from it |
| --- | --- |
| [STD-0007](../02-methodology/evidence-and-confidence.md) | Evidence states and their meanings; the confidence model; completeness semantics; conflicting evidence resolution; **uncertainty propagation and the cap on derived conclusions**; promotion and degradation; scoring principles and the 0-to-5 scale |
| [STD-0008](../02-methodology/artifact-specification.md) | Artifact structure, envelope, lineage requirements, per-record derivation, artifact type definition and versioning |
| [STD-0010](../02-methodology/metadata-specification.md) | Metadata representation for every declaration this methodology makes or its artifacts carry |
| [STD-0011](../02-methodology/contract-specification.md) | Consumer obligations, the interpretation of each completeness state, cross-revision consumption, staleness, and the prohibition on inferring absence from a partial input |
| [STD-0012](../02-methodology/validation-specification.md) | How conformance is evaluated, reported, and enforced; validation classes and outcomes |

No definition here overrides a standard. Any apparent conflict is a defect in this document.

## 4. Inputs

*This section is normative.*

**Required.** The artifact set produced by the run; the run identity; the subject revision each artifact declares; the audit request and declared scope; output location; authorization boundary.

**Optional.** Requirements documentation; architecture decision records belonging to the subject; service level objectives; compliance obligations; prior audit artifact sets for comparison; owner statements of intent.

Each input is logged with source, access date, and trust level. Absence of an optional input lowers achievable confidence and does not lower a score, per [STD-0011](../02-methodology/contract-specification.md) R-22.

**Consumed artifact types.** Every artifact type produced by the run, including but not limited to `framework.architecture.*`, `framework.database.*`, `framework.frontend.*`, `framework.backend.*`, `framework.workflow.*`, `framework.security.*`, and `framework.operations.*`. The dependency is on these types, never on the methodologies that produced them, and an absent type is recorded as an absent input rather than as an absent finding.

## 5. Preconditions

*This section is normative.*

At least one upstream artifact is available; every consumed artifact declares a completeness state, a subject revision, and a provenance record; the run identity is known; and a named recipient for escalations exists.

Where a consumed artifact declares a subject revision differing from the run's, it is consumed only under the cross-revision rules of [STD-0011](../02-methodology/contract-specification.md) R-44, with both revisions and the reason recorded and the resulting confidence capped.

Where a consumed artifact's envelope cannot be parsed, it is not consumed, and the affected analysis records the input as unavailable. Gap Analysis fails closed.

Where no upstream artifact is available, this methodology is not invoked.

## 6. Artifact Types Produced

*This section is normative.*

Six artifact types. Their structure conforms to [STD-0008](../02-methodology/artifact-specification.md); each type definition declares the sixteen sections that standard requires.

| Type | Content |
| --- | --- |
| `framework.gap.coverage` | Which domains were audited, the completeness state each returned, the scope each declared, and the domains not attempted, with the reason for each |
| `framework.gap.divergence` | Disagreements between declared intent, implementation, and evidence, each naming the two or more records that disagree and the artifacts they came from |
| `framework.gap.contradictions` | Conclusions from different domains that cannot both hold, with the resolution applied or an explicit record that none was possible |
| `framework.gap.unknowns` | Determinations the run could not make, the reason for each, the evidence that would resolve it, and the conclusions whose confidence is capped by it |
| `framework.gap.remediation` | Prioritized actions naming the evidence-driven problem, the accountable owner where known, the verification that would confirm resolution, and the risk of deferral |
| `framework.gap.health` | Run-level health synthesis with per-domain contributions, the aggregation applied, and the bounds imposed by partial coverage |

Downstream consumers depend on these **types**, never on this methodology, per [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md).

## 7. Guaranteed Outputs

*This section is normative.*

This methodology guarantees, for each declared type: that an artifact of that type is emitted; that it conforms to the type at the declared version; that its completeness state is declared; that its provenance is recorded; and that **every record names the upstream records it derives from**, per [STD-0008](../02-methodology/artifact-specification.md) R-19 and R-46.

It guarantees that no conclusion it emits carries an evidence state or confidence exceeding the weakest load-bearing input that supports it.

It does not guarantee that the gaps it reports are all the gaps that exist. Its coverage is bounded by the artifact set it received, and `framework.gap.coverage` states that bound explicitly so that a reader knows what its silence means.

Where a stage cannot be performed, its artifact carries the completeness state that [STD-0011](../02-methodology/contract-specification.md) section 10 maps to the failure, with the disclosure that section requires.

## 8. Analysis Principles

*This section is normative.*

These are synthesis-specific. General evidence discipline is STD-0007's and is not repeated.

1. **Every record is derived.** No record in this artifact set originates here. Each names its upstream records, and a record that cannot name one is not emitted.
2. **Confidence flows downhill only.** A synthesized conclusion is capped by the minimum state and confidence of its load-bearing inputs. Promotion requires independent evidence, which this methodology does not gather.
3. **Absence in a partial input is not absence in the subject.** Where a consumed artifact declares `Partial`, its unexamined boundary is Unknown, and no gap is reported from within it.
4. **`NotApplicable` is a finding, not a gap.** A domain that correctly reports no data stores has not left a hole, and it does not lower a score.
5. **A contradiction is reported before it is resolved.** Where two domains disagree and the evidence does not settle it, both are recorded and the contradiction stands. Choosing the more convenient conclusion is the failure mode this principle exists to prevent.

## 9. Analysis Workflow

*This section is normative.*

Eight stages. Each declares purpose, inputs, actions, required evidence, deliverables, failure conditions, and acceptance criteria. Every conclusion carries an evidence state and confidence per [STD-0007](../02-methodology/evidence-and-confidence.md).

### Stage 1 — Artifact Set Intake

**Purpose.** Establish what was received before analysing any of it.

**Inputs.** The run's artifact set, run identity, declared scope.

**Actions.** Enumerate received artifacts by type, recording completeness state, declared scope, exclusions, subject revision, and provenance for each. Identify types the capability expects that are absent. Verify that every consumed envelope parses, and reject those that do not. Record artifacts whose subject revision differs from the run's, and apply the cross-revision rules before any of their records are used.

**Evidence Required.** Artifact address per type, completeness state, subject revision, parse result.

**Deliverables.** `framework.gap.coverage`.

**Failure Conditions.** An unparseable envelope consumed; an absent type recorded as an empty finding; a revision mismatch consumed without the cross-revision record; expected types not enumerated.

**Acceptance Criteria.** Every expected type is either present with its completeness state recorded or listed as absent with a reason, and every consumed artifact parsed.

### Stage 2 — Coverage Assessment

**Purpose.** Establish what the run examined and, more importantly, what it did not.

**Inputs.** Intake record, declared scope per artifact, exclusions per artifact, the capability's expected domain set.

**Actions.** For each domain, record the scope examined, the exclusions declared, and the completeness state returned. Aggregate to a run-level coverage statement expressing what fraction of the intended scope was examined. Where coverage is partial, express the run-level result as a bounded range per [CAP-0001](../09-capabilities/CAP-0001-repository-audit.md) section 11, never as a mean over the audited subset.

**Evidence Required.** Per-domain scope and exclusion records, the completeness state of each, the aggregation applied.

**Deliverables.** `framework.gap.coverage`.

**Failure Conditions.** A mean computed over audited domains and presented as a run result; exclusions omitted from the coverage statement; `NotApplicable` counted as missing coverage.

**Acceptance Criteria.** The coverage statement names every domain, its scope, and its completeness state, and any partial result is expressed as a bounded range.

### Stage 3 — Divergence Detection

**Purpose.** Identify where declared intent, implementation, and evidence disagree.

**Inputs.** All consumed artifacts, requirements documentation, subject decision records, owner statements of intent.

**Actions.** Compare documented intent against implementation records and against evidence records. Record each divergence naming the specific records on each side and the artifacts they came from. Classify each as intent-versus-implementation, implementation-versus-evidence, or intent-versus-evidence, because the three imply different responses. Do not record a divergence where one side falls inside an unexamined boundary.

**Evidence Required.** The record on each side with its artifact address, the classification, and the reasoning connecting them.

**Deliverables.** `framework.gap.divergence`.

**Failure Conditions.** A divergence recorded against a `Partial` artifact's unexamined boundary; a divergence stated without naming both sides; documentation preferred over implementation without evidence.

**Acceptance Criteria.** Each divergence names at least two records from at least two artifacts and states its classification.

### Stage 4 — Contradiction Detection

**Purpose.** Identify conclusions from different domains that cannot both hold.

**Inputs.** All consumed artifacts, with attention to overlapping subject matter across domains.

**Actions.** Compare conclusions about the same subject reached by different domains. Where two cannot both be true, record the contradiction with both conclusions, their evidence states, and their confidence levels. Apply the conflicting-evidence rules of [STD-0007](../02-methodology/evidence-and-confidence.md) where they settle it. **Where they do not, record the contradiction unresolved** and cap every conclusion depending on either side.

**Evidence Required.** Both conclusions with their artifact addresses, evidence states, confidence levels, and the resolution applied or the reason none was possible.

**Deliverables.** `framework.gap.contradictions`.

**Failure Conditions.** A contradiction resolved by preferring the more recent, more detailed, or more convenient artifact without an evidence basis; a contradiction silently dropped; dependent conclusions left uncapped.

**Acceptance Criteria.** Each contradiction names both conclusions and records either an evidence-based resolution or an explicit statement that none was possible.

### Stage 5 — Unknown Register

**Purpose.** Record what the run could not determine, as a finding in its own right.

**Inputs.** Records marked Unknown across all artifacts, `Partial` boundaries, `Unavailable` and `Failed` completeness states, capped confidences.

**Actions.** Aggregate every Unknown into a register with its reason, the scope that bounds it, the evidence that would resolve it, and the conclusions whose confidence it caps. Group unknowns that share a cause, because one missing input often produces many. Identify unknowns that runtime evidence could resolve and mark them for [AUD-0011](10-runtime-verification.md).

**Evidence Required.** Source record address, the bounding scope, the resolving evidence class, the dependent conclusions.

**Deliverables.** `framework.gap.unknowns`.

**Failure Conditions.** Unknowns summarized as a count rather than enumerated; an unknown recorded without its bounding scope; dependent conclusions not linked; an unknown reported as a negative finding about the subject.

**Acceptance Criteria.** Each unknown names its bounding scope, the evidence that would resolve it, and every conclusion it caps.

### Stage 6 — Remediation Synthesis

**Purpose.** Convert divergences, contradictions, and unknowns into prioritized actions.

**Inputs.** Divergence register, contradiction register, unknown register, risk registers from every domain, ownership records, risk tier.

**Actions.** For each action, name the evidence-driven problem it addresses, the accountable owner where ownership evidence exists, the verification that would confirm resolution, and the risk of deferral. Prioritize by impact and evidence strength, not by ease. Separate actions that resolve a gap in the system from actions that resolve a gap in the audit, because the two have different audiences.

**Evidence Required.** The source finding address, the owner record where present, the proposed verification, the deferral risk statement.

**Deliverables.** `framework.gap.remediation`.

**Failure Conditions.** A recommendation with no source finding; a generic best-practice action; an owner assigned without an ownership record; audit gaps and system gaps presented in one undifferentiated list.

**Acceptance Criteria.** Each action names its source finding and a verification that would confirm resolution, and audit gaps are separated from system gaps.

### Stage 7 — Run Health Synthesis

**Purpose.** Produce a run-level health statement whose bounds are honest.

**Inputs.** Per-domain health artifacts, coverage statement, unknown register, contradiction register.

**Actions.** Aggregate per-domain scores using the aggregation the capability declares, recording the contribution of each domain and the calculation. Apply the partial-coverage rule: where coverage is incomplete, report a bounded range rather than a point value. Apply the escalation guard where any dimension sits in the lowest two levels. Record the confidence ceiling that the weakest load-bearing input imposes on the run-level statement.

**Evidence Required.** Per-domain score with its artifact address, the aggregation formula, the coverage bound, the applied guards.

**Deliverables.** `framework.gap.health`.

**Failure Conditions.** A point score reported from partial coverage; the escalation guard not applied; the aggregation not shown; the confidence ceiling omitted.

**Acceptance Criteria.** The run-level statement shows its calculation, its coverage bound, and its confidence ceiling.

### Stage 8 — Consolidation and Final Verification

**Purpose.** Confirm the synthesis is internally consistent, derivation-complete, and safe to consume.

**Inputs.** All produced artifacts, the consumed artifact set, unresolved-question list.

**Actions.** Confirm every record names its upstream derivation per [STD-0008](../02-methodology/artifact-specification.md) R-46, and that no blanket derivation was recorded where derivation is partial. Confirm no conclusion exceeds the state or confidence of its weakest load-bearing input. Confirm the derivation graph is acyclic. Confirm no redaction from an upstream artifact was reconstructed. Confirm every unknown is enumerated and every contradiction is present.

**Evidence Required.** Completed verification, artifact versions, derivation check result, propagation check result.

**Deliverables.** Completed and consistent artifact set.

**Failure Conditions.** A record with no derivation; a conclusion exceeding its inputs; a cycle in the derivation graph; a reconstructed redaction; an unknown dropped during consolidation.

**Acceptance Criteria.** Every record derives from a named upstream record, no conclusion exceeds its inputs, and the artifact set is ready for the capability's reporting surface.

How this output is validated is defined by [STD-0012](../02-methodology/validation-specification.md); this methodology does not define validator behaviour.

## 10. Health Dimensions

*This section is normative.*

The scale, its meanings, the averaging guard, the escalation guard, and the partial-coverage rule are defined by [STD-0007](../02-methodology/evidence-and-confidence.md) section 13. This methodology declares only its dimensions.

Its dimensions describe the audit rather than the subject: coverage completeness; evidence strength; internal consistency; unknown containment; ownership attribution; remediation actionability.

A score in this artifact set measures the quality of the audit. It is not a score for the subject, and [CAP-0001](../09-capabilities/CAP-0001-repository-audit.md) section 11 governs how the two are presented so they cannot be confused.

The lowest two levels of the scale for the purposes of the escalation guard are `0` and `1`.

## 11. Synthesis Smells

*This section is informative.*

Treat a smell as a prompt for investigation, not proof of failure. Common smells include a run-level score higher than every domain that fed it; a remediation list that would be identical for any repository; unknowns reported as a count; a contradiction resolved in favour of the more detailed artifact; a divergence found inside a `Partial` artifact's unexamined boundary; `NotApplicable` counted against coverage; a recommendation with no source finding; a synthesis whose confidence is High while three of its inputs are Inferred; and a coverage statement that omits the domains that were never attempted.

## 12. Examples and Common Mistakes

*This section is informative.*

A documented requirement that a rule be enforced server-side, a workflow record locating that rule only in a client, and a backend boundary record showing no corresponding check together support an observed intent-versus-implementation divergence with three named records. The same conclusion drawn from the workflow record alone is an assertion.

Where the database domain reports a store as the system of record and the backend domain reports two services writing it independently, both conclusions are recorded, the contradiction is registered, and any conclusion about data ownership is capped until evidence settles it. Choosing one because it makes a cleaner report is the specific failure this methodology exists to prevent.

Common mistakes are averaging domain scores over the domains that ran; reporting a gap inside an unexamined boundary; summarizing unknowns; resolving contradictions by preference; recording blanket derivation across an artifact; promoting a synthesized conclusion above its inputs; assigning owners without ownership evidence; and issuing recommendations that name no finding.

Do not examine the subject. Do not gather new evidence. Do not reconstruct a redaction. Do not resolve a contradiction the evidence does not settle.

## 13. Related Documents

*This section is informative.*

- [Business Workflow Discovery](05-business-workflow-discovery.md)
- [Feature Inventory](07-feature-inventory.md)
- [Operations Manual](08-operations-manual.md)
- [Runtime Verification](10-runtime-verification.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [Evidence and Confidence Standard](../02-methodology/evidence-and-confidence.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Metadata Specification Standard](../02-methodology/metadata-specification.md)
- [Contract Specification Standard](../02-methodology/contract-specification.md)
- [Validation Specification Standard](../02-methodology/validation-specification.md)
- [Framework Glossary](../02-methodology/glossary.md)
