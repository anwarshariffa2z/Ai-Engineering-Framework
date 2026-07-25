---
id: REF-0020
title: Operations Artifact Type Declarations
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-26
review_cycle: Annual
category: Reference
tags: [artifacts, declarations, operations]
related: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md, ../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/08-operations-manual.md]
object_type: Guide
depends_on: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md]
references: [../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/08-operations-manual.md]
meta_model_version: 1.0.0
normativity:
  "1": informative
  "2": informative
  "3": informative
artifact_types:
  - type: framework.operations.environments
    type_version: 1.0.0
    lifecycle: active
    purpose: Which environments exist and how each is produced
    contract: An environment referenced but not defined in scope is listed, not omitted
    producer_kind: operations-discovery
    subject_noun: environment
    required_fields: [environment, purpose_of_environment, provisioning, configuration_source, evidence_state, confidence]
    optional_fields: [promotion_position, parity_findings, is_defined_in_scope]
    evidence_bearing_fields: [configuration_source]
    vocabularies:
      - field: provisioning
        kind: open
        values: [infrastructure-as-code, manual, managed-platform, unknown]
    derives_from: [framework.architecture.deployment, framework.architecture.configuration]
    consumption_profiles:
      - consumer: runtime-verification
        reads: [environment, configuration_source, promotion_position]
    fixtures:
      normal: One record per environment found within the declared scope, each carrying configuration_source and a confidence level.
      empty: The declared scope was examined in full and contained no environment; completeness is Complete and the record set is empty.
      not_applicable: The subject declares no environment
      partial: The infrastructure repository was out of scope; completeness is Partial and the unexamined boundary is recorded.
      boundary: A configuration key present in one environment and absent in another is recorded as a parity finding
  - type: framework.operations.release
    type_version: 1.0.0
    lifecycle: active
    purpose: How a change reaches an environment and how it is withdrawn
    contract: Rollback definition and rollback exercise evidence are recorded separately
    producer_kind: operations-discovery
    subject_noun: release gate
    required_fields: [gate, pipeline_path, enforcement, evidence_state, confidence]
    optional_fields: [approval, rollout_strategy, rollback_mechanism, rollback_exercise_evidence, manual_steps]
    evidence_bearing_fields: [pipeline_path]
    vocabularies:
      - field: enforcement
        kind: closed
        values: [pipeline-enforced, convention, unknown]
    derives_from: [framework.architecture.build, framework.architecture.deployment]
    fixtures:
      normal: One record per release gate found within the declared scope, each carrying pipeline_path and a confidence level.
      empty: The declared scope was examined in full and contained no release gate; completeness is Complete and the record set is empty.
      not_applicable: No release path is declared in scope
      partial: Deployment steps run outside the audited repository; completeness is Partial and the unexamined boundary is recorded.
      boundary: A rollback_mechanism with no rollback_exercise_evidence records that absence; the two are never merged
  - type: framework.operations.observability
    type_version: 1.0.0
    lifecycle: active
    purpose: What is watched, and which components are not
    contract: Coverage is enumerated against the component inventory, never asserted from a library
    producer_kind: operations-discovery
    subject_noun: observed component
    required_fields: [component, signal_kinds, is_observed, evidence_state, confidence]
    optional_fields: [alert_conditions, destinations, captures_sensitive_content]
    evidence_bearing_fields: [component]
    vocabularies:
      - field: signal_kinds
        kind: open
        values: [metric, log, trace, alert, none]
    derives_from: [framework.architecture.runtime, framework.backend.services, framework.security.auditlogging]
    fixtures:
      normal: One record per observed component found within the declared scope, each carrying component and a confidence level.
      empty: The declared scope was examined in full and contained no observed component; completeness is Complete and the record set is empty.
      not_applicable: No component runs, so nothing can be observed
      partial: Alert configuration lives outside the audited repository; completeness is Partial and the unexamined boundary is recorded.
      boundary: A component with signal_kinds none is an unobserved component and is listed individually
  - type: framework.operations.recovery
    type_version: 1.0.0
    lifecycle: active
    purpose: What could be restored and what evidence supports that claim
    contract: Backup existence and restore demonstration are separate fields and are never merged
    producer_kind: operations-discovery
    subject_noun: backup mechanism
    required_fields: [mechanism, scope_covered, schedule, restore_evidence, evidence_state, confidence]
    optional_fields: [destination_class, retention, recovery_point_objective, recovery_time_objective, objective_supported]
    evidence_bearing_fields: [scope_covered]
    derives_from: [framework.database.lifecycle]
    consumption_profiles:
      - consumer: runtime-verification
        reads: [mechanism, scope_covered, restore_evidence]
    fixtures:
      normal: One record per backup mechanism found within the declared scope, each carrying scope_covered and a confidence level.
      empty: The declared scope was examined in full and contained no backup mechanism; completeness is Complete and the record set is empty.
      not_applicable: The system holds no state to recover
      partial: Managed-service backup configuration was not readable; completeness is Partial and the unexamined boundary is recorded.
      boundary: A mechanism with restore_evidence absent leaves recovery posture unknown, not good
  - type: framework.operations.runbooks
    type_version: 1.0.0
    lifecycle: active
    purpose: What a responder has to work with, and which scenarios have nothing
    contract: Every procedure records last-modified evidence
    producer_kind: operations-discovery
    subject_noun: operational procedure
    required_fields: [procedure, scenario, location, last_modified_evidence, evidence_state, confidence]
    optional_fields: [is_stale, stale_reason]
    evidence_bearing_fields: [location]
    derives_from: [framework.operations.observability]
    fixtures:
      normal: One record per operational procedure found within the declared scope, each carrying location and a confidence level.
      empty: The declared scope was examined in full and contained no operational procedure; completeness is Complete and the record set is empty.
      not_applicable: No operational scenario exists for the subject
      partial: Runbooks live outside the audited repository; completeness is Partial and the unexamined boundary is recorded.
      boundary: An alert with no corresponding procedure is enumerated in the uncovered set rather than summarized
  - type: framework.operations.capacity
    type_version: 1.0.0
    lifecycle: active
    purpose: What bounds resource use and what evidence supports the chosen values
    contract: A platform default is never recorded as a configured limit
    producer_kind: operations-discovery
    subject_noun: resource bound
    required_fields: [bound, component, declaration_site, evidence_state, confidence]
    optional_fields: [limit_value, scaling_rule, trigger_metric, trigger_metric_emitted, load_evidence]
    evidence_bearing_fields: [declaration_site]
    vocabularies:
      - field: bound
        kind: open
        values: [cpu, memory, connections, rate-limit, replica-count, quota]
    derives_from: [framework.backend.resilience, framework.operations.observability]
    fixtures:
      normal: One record per resource bound found within the declared scope, each carrying declaration_site and a confidence level.
      empty: The declared scope was examined in full and contained no resource bound; completeness is Complete and the record set is empty.
      not_applicable: No component declares a resource bound
      partial: Platform-level quotas were out of scope; completeness is Partial and the unexamined boundary is recorded.
      boundary: A scaling rule whose trigger_metric_emitted is false cannot fire, and that is the finding
  - type: framework.operations.risks
    type_version: 1.0.0
    lifecycle: active
    purpose: Prioritized operations risks derived from the recorded observations
    contract: Every risk names at least one supporting observation and the reasoning from it
    producer_kind: operations-discovery
    subject_noun: operations risk
    required_fields: [risk, cause, impact, supporting_records, likelihood_rationale, evidence_state, confidence]
    optional_fields: [next_verification, reversibility]
    evidence_bearing_fields: [supporting_records]
    derives_from: [framework.operations.observability, framework.operations.recovery, framework.operations.release, framework.operations.runbooks, framework.operations.environments, framework.operations.capacity]
    fixtures:
      normal: One record per operations risk found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no operations risk; completeness is Complete and the record set is empty.
      not_applicable: No observation in the artifact set supports a risk
      partial: Risk assessment covered part of the domain; completeness is Partial and the unexamined boundary is recorded.
      boundary: A generic best practice with no repository observation is not recorded as a risk
  - type: framework.operations.health
    type_version: 1.0.0
    lifecycle: active
    purpose: Operations health scores per dimension, with the calculation that produced each
    contract: Every score shows its calculation and the records that fed it; a partial score is reported as a bounded range
    producer_kind: operations-discovery
    subject_noun: health dimension
    required_fields: [dimension, score, calculation, supporting_records, evidence_state, confidence]
    optional_fields: [bound_low, bound_high, escalation_flag]
    evidence_bearing_fields: [supporting_records]
    vocabularies:
      - field: dimension
        kind: closed
        values: [environment-clarity, environment-parity, release-automation, rollback-readiness, observability-coverage, recovery-evidence, operational-documentation-currency, capacity-control]
    derives_from: [framework.operations.environments, framework.operations.release, framework.operations.observability, framework.operations.recovery, framework.operations.runbooks, framework.operations.capacity, framework.operations.risks]
    fixtures:
      normal: One record per health dimension found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no health dimension; completeness is Complete and the record set is empty.
      not_applicable: No dimension is applicable to the subject
      partial: Some dimensions had no supporting evidence; completeness is Partial and the unexamined boundary is recorded.
      boundary: A dimension scored in the lowest two levels sets escalation_flag regardless of the aggregate
---
# Operations Artifact Type Declarations

## 1. What This Document Is

*This section is informative.*

Declarations for the 8 artifact types produced by operations discovery.

Every record in the front matter of this document is a **declaration**: structured data supplying the values that requirements in [STD-0013](../02-methodology/artifact-type-declaration-standard.md) range over. A declaration states no obligation and can therefore not be violated. Every rule that governs these types is stated once in that standard and is not repeated here.

This document carries no `requirements` key and no normative section, per [STD-0010](../02-methodology/metadata-specification.md) R-16 and [STD-0013](../02-methodology/artifact-type-declaration-standard.md) R-31.

## 2. Declared Types

*This section is informative.*

The table renders the front matter for a human reader. The front matter is authoritative.

| Type | Asserts | Subject counted |
| --- | --- | --- |
| `framework.operations.environments` | Which environments exist and how each is produced | environment |
| `framework.operations.release` | How a change reaches an environment and how it is withdrawn | release gate |
| `framework.operations.observability` | What is watched, and which components are not | observed component |
| `framework.operations.recovery` | What could be restored and what evidence supports that claim | backup mechanism |
| `framework.operations.runbooks` | What a responder has to work with, and which scenarios have nothing | operational procedure |
| `framework.operations.capacity` | What bounds resource use and what evidence supports the chosen values | resource bound |
| `framework.operations.risks` | Prioritized operations risks derived from the recorded observations | operations risk |
| `framework.operations.health` | Operations health scores per dimension, with the calculation that produced each | health dimension |

8 types. Each is registered in the [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md).

## 3. Related Documents

*This section is informative.*

- [Artifact Type Declaration Standard](../02-methodology/artifact-type-declaration-standard.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md)
