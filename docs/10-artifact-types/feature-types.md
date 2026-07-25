---
id: REF-0019
title: Feature Artifact Type Declarations
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-26
review_cycle: Annual
category: Reference
tags: [artifacts, declarations, feature]
related: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md, ../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/07-feature-inventory.md]
object_type: Guide
depends_on: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md]
references: [../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/07-feature-inventory.md]
meta_model_version: 1.0.0
normativity:
  "1": informative
  "2": informative
  "3": informative
artifact_types:
  - type: framework.feature.register
    type_version: 1.0.0
    lifecycle: active
    purpose: What the system does, expressed as capabilities a user or operator would recognize
    contract: Every feature names the upstream records it was assembled from
    producer_kind: feature-inventory
    subject_noun: feature
    required_fields: [feature, capability_statement, upstream_records, statement_source, evidence_state, confidence]
    optional_fields: [entry_surfaces, implementing_components, documentation_reference]
    evidence_bearing_fields: [upstream_records]
    vocabularies:
      - field: statement_source
        kind: closed
        values: [documentation, implementation, both]
    derives_from: [framework.workflow.processes, framework.frontend.routing, framework.backend.interfaces, framework.architecture.modules]
    consumption_profiles:
      - consumer: operations-discovery
        reads: [feature, capability_statement]
      - consumer: runtime-verification
        reads: [feature, entry_surfaces]
    fixtures:
      normal: One record per feature found within the declared scope, each carrying upstream_records and a confidence level.
      empty: The declared scope was examined in full and contained no feature; completeness is Complete and the record set is empty.
      not_applicable: No upstream artifact supplies a capability the register could express
      partial: One domain produced no upstream artifact; completeness is Partial and the unexamined boundary is recorded.
      boundary: A candidate with no entry surface is recorded as unreachable rather than dropped from the register
  - type: framework.feature.liveness
    type_version: 1.0.0
    lifecycle: active
    purpose: How strongly the claim that a feature is live can be made
    contract: Liveness is capped by evidence class and is scoped to a named environment
    producer_kind: feature-inventory
    subject_noun: liveness claim
    required_fields: [feature, liveness, evidence_class, environment, ceiling_applied, evidence_state, confidence]
    optional_fields: [gating_flag, last_change_evidence]
    evidence_bearing_fields: [evidence_class]
    vocabularies:
      - field: liveness
        kind: closed
        values: [live, dormant, unknown]
      - field: evidence_class
        kind: closed
        values: [source, test, runtime, usage]
    derives_from: [framework.feature.register, framework.feature.flags]
    consumption_profiles:
      - consumer: runtime-verification
        reads: [feature, liveness, evidence_class, environment]
    fixtures:
      normal: One record per liveness claim found within the declared scope, each carrying evidence_class and a confidence level.
      empty: The declared scope was examined in full and contained no liveness claim; completeness is Complete and the record set is empty.
      not_applicable: The register is empty, so no liveness claim exists
      partial: Usage evidence was unavailable; completeness is Partial and the unexamined boundary is recorded.
      boundary: A feature gated by a flag of unknown state is capped at liveness unknown regardless of other evidence
  - type: framework.feature.flags
    type_version: 1.0.0
    lifecycle: active
    purpose: Which features are gated and what the gate state is per environment
    contract: A code default is never recorded as the production state
    producer_kind: feature-inventory
    subject_noun: feature flag
    required_fields: [flag, declaration_path, default_state, evaluation_sites, evidence_state, confidence]
    optional_fields: [environment_states, gated_features, is_permanently_enabled]
    evidence_bearing_fields: [declaration_path]
    derives_from: [framework.architecture.configuration]
    consumption_profiles:
      - consumer: runtime-verification
        reads: [flag, environment_states, gated_features]
    fixtures:
      normal: One record per feature flag found within the declared scope, each carrying declaration_path and a confidence level.
      empty: The declared scope was examined in full and contained no feature flag; completeness is Complete and the record set is empty.
      not_applicable: The system declares no feature flag
      partial: Per-environment state was unavailable; completeness is Partial and the unexamined boundary is recorded.
      boundary: A flag with no evaluation site is recorded as unread rather than as active
  - type: framework.feature.ownership
    type_version: 1.0.0
    lifecycle: active
    purpose: Who is accountable for each feature
    contract: Declared ownership and authorship-derived ownership are distinguished
    producer_kind: feature-inventory
    subject_noun: ownership assignment
    required_fields: [feature, owner, establishing_artifact, derivation, evidence_state, confidence]
    optional_fields: [is_individual]
    evidence_bearing_fields: [establishing_artifact]
    vocabularies:
      - field: derivation
        kind: closed
        values: [declared, inferred-from-authorship, absent]
    derives_from: [framework.feature.register, framework.architecture.modules]
    fixtures:
      normal: One record per ownership assignment found within the declared scope, each carrying establishing_artifact and a confidence level.
      empty: The declared scope was examined in full and contained no ownership assignment; completeness is Complete and the record set is empty.
      not_applicable: The register is empty
      partial: Ownership metadata covered one workspace; completeness is Partial and the unexamined boundary is recorded.
      boundary: A feature with derivation absent is an unowned feature and is listed
  - type: framework.feature.coverage
    type_version: 1.0.0
    lifecycle: active
    purpose: What evidence exists that each feature works and is documented
    contract: A test counts only where it reaches a component or process the feature names
    producer_kind: feature-inventory
    subject_noun: coverage record
    required_fields: [feature, test_locations, reached_path, documentation_reference, evidence_state, confidence]
    optional_fields: [measurement_command, documentation_divergence]
    evidence_bearing_fields: [test_locations]
    derives_from: [framework.feature.register]
    fixtures:
      normal: One record per coverage record found within the declared scope, each carrying test_locations and a confidence level.
      empty: The declared scope was examined in full and contained no coverage record; completeness is Complete and the record set is empty.
      not_applicable: The register is empty
      partial: Coverage output was unavailable for one workspace; completeness is Partial and the unexamined boundary is recorded.
      boundary: A test matching a feature by filename but reaching none of its components records reached_path absent
  - type: framework.feature.risks
    type_version: 1.0.0
    lifecycle: active
    purpose: Prioritized feature risks derived from the recorded observations
    contract: Every risk names at least one supporting observation and the reasoning from it
    producer_kind: feature-discovery
    subject_noun: feature risk
    required_fields: [risk, cause, impact, supporting_records, likelihood_rationale, evidence_state, confidence]
    optional_fields: [next_verification, reversibility]
    evidence_bearing_fields: [supporting_records]
    derives_from: [framework.feature.register, framework.feature.liveness, framework.feature.flags, framework.feature.ownership, framework.feature.coverage]
    fixtures:
      normal: One record per feature risk found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no feature risk; completeness is Complete and the record set is empty.
      not_applicable: No observation in the artifact set supports a risk
      partial: Risk assessment covered part of the domain; completeness is Partial and the unexamined boundary is recorded.
      boundary: A generic best practice with no repository observation is not recorded as a risk
  - type: framework.feature.health
    type_version: 1.0.0
    lifecycle: active
    purpose: Feature health scores per dimension, with the calculation that produced each
    contract: Every score shows its calculation and the records that fed it; a partial score is reported as a bounded range
    producer_kind: feature-discovery
    subject_noun: health dimension
    required_fields: [dimension, score, calculation, supporting_records, evidence_state, confidence]
    optional_fields: [bound_low, bound_high, escalation_flag]
    evidence_bearing_fields: [supporting_records]
    vocabularies:
      - field: dimension
        kind: closed
        values: [register-completeness, feature-reachability, liveness-evidence-strength, flag-hygiene, ownership-clarity, test-coverage-evidence, documentation-agreement]
    derives_from: [framework.feature.register, framework.feature.liveness, framework.feature.flags, framework.feature.ownership, framework.feature.coverage, framework.feature.risks]
    fixtures:
      normal: One record per health dimension found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no health dimension; completeness is Complete and the record set is empty.
      not_applicable: No dimension is applicable to the subject
      partial: Some dimensions had no supporting evidence; completeness is Partial and the unexamined boundary is recorded.
      boundary: A dimension scored in the lowest two levels sets escalation_flag regardless of the aggregate
---
# Feature Artifact Type Declarations

## 1. What This Document Is

*This section is informative.*

Declarations for the 7 artifact types produced by feature discovery.

Every record in the front matter of this document is a **declaration**: structured data supplying the values that requirements in [STD-0013](../02-methodology/artifact-type-declaration-standard.md) range over. A declaration states no obligation and can therefore not be violated. Every rule that governs these types is stated once in that standard and is not repeated here.

This document carries no `requirements` key and no normative section, per [STD-0010](../02-methodology/metadata-specification.md) R-16 and [STD-0013](../02-methodology/artifact-type-declaration-standard.md) R-31.

## 2. Declared Types

*This section is informative.*

The table renders the front matter for a human reader. The front matter is authoritative.

| Type | Asserts | Subject counted |
| --- | --- | --- |
| `framework.feature.register` | What the system does, expressed as capabilities a user or operator would recognize | feature |
| `framework.feature.liveness` | How strongly the claim that a feature is live can be made | liveness claim |
| `framework.feature.flags` | Which features are gated and what the gate state is per environment | feature flag |
| `framework.feature.ownership` | Who is accountable for each feature | ownership assignment |
| `framework.feature.coverage` | What evidence exists that each feature works and is documented | coverage record |
| `framework.feature.risks` | Prioritized feature risks derived from the recorded observations | feature risk |
| `framework.feature.health` | Feature health scores per dimension, with the calculation that produced each | health dimension |

7 types. Each is registered in the [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md).

## 3. Related Documents

*This section is informative.*

- [Artifact Type Declaration Standard](../02-methodology/artifact-type-declaration-standard.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md)
