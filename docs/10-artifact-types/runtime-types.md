---
id: REF-0022
title: Runtime Verification Artifact Type Declarations
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-26
review_cycle: Annual
category: Reference
tags: [artifacts, declarations, runtime]
related: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md, ../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/10-runtime-verification.md]
object_type: Guide
depends_on: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md]
references: [../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/10-runtime-verification.md]
meta_model_version: 1.0.0
normativity:
  "1": informative
  "2": informative
  "3": informative
artifact_types:
  - type: framework.runtime.environment
    type_version: 1.0.0
    lifecycle: active
    purpose: What was observed, at which deployed revision, within which window
    contract: The deployed revision is established from the running system or recorded as unknown
    producer_kind: runtime-verification
    subject_noun: observed environment
    required_fields: [environment, deployed_revision, revision_source, observation_window, access_principal, evidence_state, confidence]
    optional_fields: [configuration_source, production_relationship]
    evidence_bearing_fields: [revision_source]
    vocabularies:
      - field: revision_source
        kind: closed
        values: [running-system, deployment-record, unknown]
      - field: production_relationship
        kind: closed
        values: [is-production, production-like, non-production, unknown]
    derives_from: [framework.operations.environments]
    fixtures:
      normal: One record per observed environment found within the declared scope, each carrying revision_source and a confidence level.
      empty: The declared scope was examined in full and contained no observed environment; completeness is Complete and the record set is empty.
      not_applicable: No environment was authorized for observation
      partial: Only one environment was reachable within the window; completeness is Partial and the unexamined boundary is recorded.
      boundary: A deployed_revision with revision_source unknown disables promotion for the run
  - type: framework.runtime.observations
    type_version: 1.0.0
    lifecycle: active
    purpose: What the running system demonstrated, under recorded conditions
    contract: The operation and its conditions are recorded before the result is used
    producer_kind: runtime-verification
    subject_noun: observation
    required_fields: [observation, operation, environment, conditions, result, observed_at, target_conclusion, evidence_state, confidence]
    optional_fields: [load_state, principal]
    evidence_bearing_fields: [operation]
    derives_from: [framework.runtime.environment]
    fixtures:
      normal: One record per observation found within the declared scope, each carrying operation and a confidence level.
      empty: The declared scope was examined in full and contained no observation; completeness is Complete and the record set is empty.
      not_applicable: No target was observable within the authorization
      partial: Some targets were not reached within the window; completeness is Partial and the unexamined boundary is recorded.
      boundary: An operation absent from the authorization record is not performed and no observation exists for it
  - type: framework.runtime.promotions
    type_version: 1.0.0
    lifecycle: active
    purpose: Conclusions promoted to Verified, scoped by environment, revision, and time
    contract: Every promotion names an observation, an environment, a deployed revision, a time, and a decay expectation
    producer_kind: runtime-verification
    subject_noun: promoted conclusion
    required_fields: [promoted_conclusion, supporting_observation, environment, deployed_revision, promoted_at, decay_expectation, evidence_state, confidence]
    optional_fields: [invalidating_events, preconditions_satisfied]
    evidence_bearing_fields: [supporting_observation]
    derives_from: [framework.runtime.observations, framework.runtime.environment]
    fixtures:
      normal: One record per promoted conclusion found within the declared scope, each carrying supporting_observation and a confidence level.
      empty: The declared scope was examined in full and contained no promoted conclusion; completeness is Complete and the record set is empty.
      not_applicable: No observation satisfied the promotion preconditions
      partial: Promotion was disabled because the deployed revision was unknown; completeness is Partial and the unexamined boundary is recorded.
      boundary: A promotion never generalizes from one observed instance to a class
  - type: framework.runtime.divergence
    type_version: 1.0.0
    lifecycle: active
    purpose: Where the running system contradicts the audited declaration
    contract: A contradiction is required; an absence of demonstration is never recorded here
    producer_kind: runtime-verification
    subject_noun: runtime divergence
    required_fields: [divergence, declaration_record, contradicting_observation, environment, evidence_state, confidence]
    optional_fields: [conditions, is_environment_specific]
    evidence_bearing_fields: [contradicting_observation]
    derives_from: [framework.runtime.observations]
    fixtures:
      normal: One record per runtime divergence found within the declared scope, each carrying contradicting_observation and a confidence level.
      empty: The declared scope was examined in full and contained no runtime divergence; completeness is Complete and the record set is empty.
      not_applicable: Every observation agreed with the declaration it bore on
      partial: Only selected declarations were compared; completeness is Partial and the unexamined boundary is recorded.
      boundary: A configuration divergence records the environment prominently, because it is often correct behaviour outside production
  - type: framework.runtime.limits
    type_version: 1.0.0
    lifecycle: active
    purpose: What could not be verified, and what would permit it
    contract: Every eligible conclusion is promoted, diverged, or recorded here with a reason
    producer_kind: runtime-verification
    subject_noun: unverified conclusion
    required_fields: [conclusion, reason, enabling_requirement, still_capped, evidence_state, confidence]
    optional_fields: [returned_to_unknowns]
    evidence_bearing_fields: [conclusion]
    vocabularies:
      - field: reason
        kind: closed
        values: [not-selected, not-observable, not-authorized, observed-inconclusive]
    derives_from: [framework.gap.unknowns, framework.runtime.observations]
    fixtures:
      normal: One record per unverified conclusion found within the declared scope, each carrying conclusion and a confidence level.
      empty: The declared scope was examined in full and contained no unverified conclusion; completeness is Complete and the record set is empty.
      not_applicable: Every eligible conclusion was verified
      partial: The eligible set was drawn from available artifacts only; completeness is Partial and the unexamined boundary is recorded.
      boundary: A forgone mutating observation records reason not-authorized and is never a negative finding
  - type: framework.runtime.risks
    type_version: 1.0.0
    lifecycle: active
    purpose: Prioritized runtime risks derived from the recorded observations
    contract: Every risk names its environment; an observation in one environment is never presented as a risk in another
    producer_kind: runtime-discovery
    subject_noun: runtime risk
    required_fields: [risk, cause, impact, supporting_records, likelihood_rationale, evidence_state, confidence]
    optional_fields: [next_verification, reversibility]
    evidence_bearing_fields: [supporting_records]
    derives_from: [framework.runtime.divergence, framework.runtime.observations, framework.runtime.limits]
    fixtures:
      normal: One record per runtime risk found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no runtime risk; completeness is Complete and the record set is empty.
      not_applicable: No observation in the artifact set supports a risk
      partial: Risk assessment covered part of the domain; completeness is Partial and the unexamined boundary is recorded.
      boundary: A generic best practice with no repository observation is not recorded as a risk
  - type: framework.runtime.health
    type_version: 1.0.0
    lifecycle: active
    purpose: Runtime health scores per dimension, with the calculation that produced each
    contract: Every score names the environment it was obtained in; a non-production score is not a system score
    producer_kind: runtime-discovery
    subject_noun: health dimension
    required_fields: [dimension, score, calculation, supporting_records, evidence_state, confidence]
    optional_fields: [bound_low, bound_high, escalation_flag]
    evidence_bearing_fields: [supporting_records]
    vocabularies:
      - field: dimension
        kind: closed
        values: [environment-observability, verification-coverage, declared-to-demonstrated-agreement, configuration-parity, recovery-demonstrability, observation-reproducibility]
    derives_from: [framework.runtime.observations, framework.runtime.promotions, framework.runtime.divergence, framework.runtime.limits, framework.runtime.risks]
    fixtures:
      normal: One record per health dimension found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no health dimension; completeness is Complete and the record set is empty.
      not_applicable: No dimension is applicable to the subject
      partial: Some dimensions had no supporting evidence; completeness is Partial and the unexamined boundary is recorded.
      boundary: A dimension scored in the lowest two levels sets escalation_flag regardless of the aggregate
    notes: Every score is bounded by the environment observed. A score obtained against a non-production environment is not a production score.
---
# Runtime Verification Artifact Type Declarations

## 1. What This Document Is

*This section is informative.*

Declarations for the 7 artifact types produced by runtime discovery.

Every record in the front matter of this document is a **declaration**: structured data supplying the values that requirements in [STD-0013](../02-methodology/artifact-type-declaration-standard.md) range over. A declaration states no obligation and can therefore not be violated. Every rule that governs these types is stated once in that standard and is not repeated here.

This document carries no `requirements` key and no normative section, per [STD-0010](../02-methodology/metadata-specification.md) R-16 and [STD-0013](../02-methodology/artifact-type-declaration-standard.md) R-31.

## 2. Declared Types

*This section is informative.*

The table renders the front matter for a human reader. The front matter is authoritative.

| Type | Asserts | Subject counted |
| --- | --- | --- |
| `framework.runtime.environment` | What was observed, at which deployed revision, within which window | observed environment |
| `framework.runtime.observations` | What the running system demonstrated, under recorded conditions | observation |
| `framework.runtime.promotions` | Conclusions promoted to Verified, scoped by environment, revision, and time | promoted conclusion |
| `framework.runtime.divergence` | Where the running system contradicts the audited declaration | runtime divergence |
| `framework.runtime.limits` | What could not be verified, and what would permit it | unverified conclusion |
| `framework.runtime.risks` | Prioritized runtime risks derived from the recorded observations | runtime risk |
| `framework.runtime.health` | Runtime health scores per dimension, with the calculation that produced each | health dimension |

7 types. Each is registered in the [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md).

## 3. Related Documents

*This section is informative.*

- [Artifact Type Declaration Standard](../02-methodology/artifact-type-declaration-standard.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md)
