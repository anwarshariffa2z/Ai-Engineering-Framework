---
id: REF-0021
title: Gap Analysis Artifact Type Declarations
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-26
review_cycle: Annual
category: Reference
tags: [artifacts, declarations, gap]
related: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md, ../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/09-gap-analysis.md]
object_type: Guide
depends_on: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md]
references: [../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/09-gap-analysis.md]
meta_model_version: 1.0.0
normativity:
  "1": informative
  "2": informative
  "3": informative
artifact_types:
  - type: framework.gap.coverage
    type_version: 1.0.0
    lifecycle: active
    purpose: What the run examined, what it did not, and the completeness each returned
    contract: A partial run-level result is expressed as a bounded range, never as a mean over the audited subset
    producer_kind: gap-analysis
    subject_noun: audited domain
    required_fields: [domain, was_attempted, completeness_returned, declared_scope, evidence_state, confidence]
    optional_fields: [exclusions, absence_reason, artifact_address]
    evidence_bearing_fields: [artifact_address]
    vocabularies:
      - field: completeness_returned
        kind: closed
        values: [Complete, Partial, NotApplicable, Unavailable, Failed, not-attempted]
    consumption_profiles:
      - consumer: runtime-verification
        reads: [domain, completeness_returned]
    fixtures:
      normal: One record per audited domain found within the declared scope, each carrying artifact_address and a confidence level.
      empty: The declared scope was examined in full and contained no audited domain; completeness is Complete and the record set is empty.
      not_applicable: No domain was in scope for the run
      partial: Some domains produced no artifact to assess; completeness is Partial and the unexamined boundary is recorded.
      boundary: A domain returning NotApplicable is a valid finding and is not counted against coverage
  - type: framework.gap.divergence
    type_version: 1.0.0
    lifecycle: active
    purpose: Where declared intent, implementation, and evidence disagree
    contract: Every divergence names at least two records from at least two artifacts
    producer_kind: gap-analysis
    subject_noun: divergence
    required_fields: [divergence, classification, left_record, right_record, reasoning, evidence_state, confidence]
    optional_fields: [source_artifacts]
    evidence_bearing_fields: [left_record]
    vocabularies:
      - field: classification
        kind: closed
        values: [intent-vs-implementation, implementation-vs-evidence, intent-vs-evidence]
    fixtures:
      normal: One record per divergence found within the declared scope, each carrying left_record and a confidence level.
      empty: The declared scope was examined in full and contained no divergence; completeness is Complete and the record set is empty.
      not_applicable: Declared intent, implementation, and evidence agree wherever all three were available
      partial: Intent documentation was unavailable for one domain; completeness is Partial and the unexamined boundary is recorded.
      boundary: A divergence falling inside a Partial artifact unexamined boundary is not recorded
  - type: framework.gap.contradictions
    type_version: 1.0.0
    lifecycle: active
    purpose: Conclusions from different domains that cannot both hold
    contract: A contradiction the evidence does not settle is recorded unresolved and caps every dependent conclusion
    producer_kind: gap-analysis
    subject_noun: contradiction
    required_fields: [contradiction, left_conclusion, right_conclusion, resolution, evidence_state, confidence]
    optional_fields: [capped_conclusions, resolution_basis]
    evidence_bearing_fields: [left_conclusion]
    vocabularies:
      - field: resolution
        kind: closed
        values: [evidence-based, unresolved]
    fixtures:
      normal: One record per contradiction found within the declared scope, each carrying left_conclusion and a confidence level.
      empty: The declared scope was examined in full and contained no contradiction; completeness is Complete and the record set is empty.
      not_applicable: No two domains reached conclusions about the same subject
      partial: Only overlapping domains were compared; completeness is Partial and the unexamined boundary is recorded.
      boundary: A contradiction resolved by preferring the more recent or more detailed artifact is not evidence-based and is recorded unresolved
  - type: framework.gap.unknowns
    type_version: 1.0.0
    lifecycle: active
    purpose: What the run could not determine, and what would resolve it
    contract: Every unknown names its bounding scope and the conclusions its presence caps
    producer_kind: gap-analysis
    subject_noun: unknown
    required_fields: [unknown, reason, bounding_scope, resolving_evidence_class, capped_conclusions, evidence_state, confidence]
    optional_fields: [shared_cause, runtime_resolvable]
    evidence_bearing_fields: [bounding_scope]
    vocabularies:
      - field: resolving_evidence_class
        kind: closed
        values: [source, test, runtime, usage, authorization, documentation]
    consumption_profiles:
      - consumer: runtime-verification
        reads: [unknown, resolving_evidence_class, capped_conclusions, runtime_resolvable]
    fixtures:
      normal: One record per unknown found within the declared scope, each carrying bounding_scope and a confidence level.
      empty: The declared scope was examined in full and contained no unknown; completeness is Complete and the record set is empty.
      not_applicable: Every determination in scope was made
      partial: Unknowns were aggregated from available artifacts only; completeness is Partial and the unexamined boundary is recorded.
      boundary: An unknown is never recorded as a negative finding about the subject
  - type: framework.gap.remediation
    type_version: 1.0.0
    lifecycle: active
    purpose: Prioritized actions addressing the recorded divergences, contradictions, and unknowns
    contract: Every action names a source finding and a verification that would confirm resolution
    producer_kind: gap-analysis
    subject_noun: remediation action
    required_fields: [action, source_finding, gap_class, verification, evidence_state, confidence]
    optional_fields: [owner, deferral_risk, priority]
    evidence_bearing_fields: [source_finding]
    vocabularies:
      - field: gap_class
        kind: closed
        values: [system-gap, audit-gap]
    fixtures:
      normal: One record per remediation action found within the declared scope, each carrying source_finding and a confidence level.
      empty: The declared scope was examined in full and contained no remediation action; completeness is Complete and the record set is empty.
      not_applicable: No finding warrants an action
      partial: Actions cover the domains that produced artifacts; completeness is Partial and the unexamined boundary is recorded.
      boundary: System gaps and audit gaps are separated by gap_class and are never presented in one undifferentiated list
  - type: framework.gap.health
    type_version: 1.0.0
    lifecycle: active
    purpose: Run-level health synthesis with per-domain contributions and the bounds partial coverage imposes
    contract: The synthesis shows its calculation, its coverage bound, and its confidence ceiling
    producer_kind: gap-discovery
    subject_noun: health dimension
    required_fields: [dimension, score, calculation, supporting_records, evidence_state, confidence]
    optional_fields: [bound_low, bound_high, escalation_flag]
    evidence_bearing_fields: [supporting_records]
    vocabularies:
      - field: dimension
        kind: closed
        values: [coverage-completeness, evidence-strength, internal-consistency, unknown-containment, ownership-attribution, remediation-actionability]
    derives_from: [framework.gap.coverage, framework.gap.divergence, framework.gap.contradictions, framework.gap.unknowns, framework.gap.remediation]
    fixtures:
      normal: One record per health dimension found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no health dimension; completeness is Complete and the record set is empty.
      not_applicable: No dimension is applicable to the subject
      partial: Some dimensions had no supporting evidence; completeness is Partial and the unexamined boundary is recorded.
      boundary: A dimension scored in the lowest two levels sets escalation_flag regardless of the aggregate
    notes: This score measures the quality of the audit, not the subject. Presentation is governed by CAP-0001 section 11.
---
# Gap Analysis Artifact Type Declarations

## 1. What This Document Is

*This section is informative.*

Declarations for the 6 artifact types produced by gap discovery.

Every record in the front matter of this document is a **declaration**: structured data supplying the values that requirements in [STD-0013](../02-methodology/artifact-type-declaration-standard.md) range over. A declaration states no obligation and can therefore not be violated. Every rule that governs these types is stated once in that standard and is not repeated here.

This document carries no `requirements` key and no normative section, per [STD-0010](../02-methodology/metadata-specification.md) R-16 and [STD-0013](../02-methodology/artifact-type-declaration-standard.md) R-31.

## 2. Declared Types

*This section is informative.*

The table renders the front matter for a human reader. The front matter is authoritative.

| Type | Asserts | Subject counted |
| --- | --- | --- |
| `framework.gap.coverage` | What the run examined, what it did not, and the completeness each returned | audited domain |
| `framework.gap.divergence` | Where declared intent, implementation, and evidence disagree | divergence |
| `framework.gap.contradictions` | Conclusions from different domains that cannot both hold | contradiction |
| `framework.gap.unknowns` | What the run could not determine, and what would resolve it | unknown |
| `framework.gap.remediation` | Prioritized actions addressing the recorded divergences, contradictions, and unknowns | remediation action |
| `framework.gap.health` | Run-level health synthesis with per-domain contributions and the bounds partial coverage imposes | health dimension |

6 types. Each is registered in the [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md).

## 3. Related Documents

*This section is informative.*

- [Artifact Type Declaration Standard](../02-methodology/artifact-type-declaration-standard.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md)
