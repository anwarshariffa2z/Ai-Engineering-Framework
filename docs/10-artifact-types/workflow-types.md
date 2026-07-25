---
id: REF-0017
title: Business Workflow Artifact Type Declarations
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-26
review_cycle: Annual
category: Reference
tags: [artifacts, declarations, workflow]
related: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md, ../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/05-business-workflow-discovery.md]
object_type: Guide
depends_on: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md]
references: [../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/05-business-workflow-discovery.md]
meta_model_version: 1.0.0
normativity:
  "1": informative
  "2": informative
  "3": informative
artifact_types:
  - type: framework.workflow.processes
    type_version: 1.0.0
    lifecycle: active
    purpose: The business processes the system carries out, traced from a reachable trigger
    contract: Every process names a trigger and at least one terminal outcome
    producer_kind: workflow-discovery
    subject_noun: business process
    required_fields: [process, trigger, trigger_kind, steps, terminal_outcomes, evidence_state, confidence]
    optional_fields: [participating_components, async_boundaries, compensation_path]
    evidence_bearing_fields: [steps]
    vocabularies:
      - field: trigger_kind
        kind: closed
        values: [user-initiated, system-initiated, scheduled, event-initiated]
    derives_from: [framework.backend.interfaces, framework.frontend.routing, framework.backend.execution]
    consumption_profiles:
      - consumer: feature-inventory
        reads: [process, trigger, terminal_outcomes]
      - consumer: runtime-verification
        reads: [process, trigger]
    fixtures:
      normal: One record per business process found within the declared scope, each carrying steps and a confidence level.
      empty: The declared scope was examined in full and contained no business process; completeness is Complete and the record set is empty.
      not_applicable: The system encodes no business process; it is infrastructure only
      partial: Administrative triggers were out of scope; completeness is Partial and the unexamined boundary is recorded.
      boundary: A multi-step process with no compensation_path records that absence, which is the finding
  - type: framework.workflow.rules
    type_version: 1.0.0
    lifecycle: active
    purpose: The constraints the system applies, expressed as conditions rather than as code
    contract: Every rule names the artifact and location that expresses it
    producer_kind: workflow-discovery
    subject_noun: business rule
    required_fields: [rule, condition, constrained_entity, declaring_location, evidence_state, confidence]
    optional_fields: [authority_reference, expression_form, threshold_source]
    evidence_bearing_fields: [declaring_location]
    vocabularies:
      - field: expression_form
        kind: closed
        values: [code, configuration, rule-table, store-constraint]
    derives_from: [framework.backend.contracts, framework.database.constraints]
    fixtures:
      normal: One record per business rule found within the declared scope, each carrying declaring_location and a confidence level.
      empty: The declared scope was examined in full and contained no business rule; completeness is Complete and the record set is empty.
      not_applicable: The system applies no business constraint
      partial: Rule-table content was unavailable; completeness is Partial and the unexamined boundary is recorded.
      boundary: A type declaration is not a business rule and is not recorded as one
  - type: framework.workflow.enforcement
    type_version: 1.0.0
    lifecycle: active
    purpose: Where each rule is enforced, and what reaches the entity without passing it
    contract: A rule enforced differently in two layers records both conditions and never resolves them
    producer_kind: workflow-discovery
    subject_noun: enforcement site
    required_fields: [rule, layer, condition_applied, location, evidence_state, confidence]
    optional_fields: [bypass_paths, divergence_note]
    evidence_bearing_fields: [location]
    vocabularies:
      - field: layer
        kind: closed
        values: [client, service, store, mapper, none]
    derives_from: [framework.workflow.rules, framework.backend.boundaries, framework.database.constraints]
    consumption_profiles:
      - consumer: security-discovery
        reads: [rule, layer, bypass_paths]
    fixtures:
      normal: One record per enforcement site found within the declared scope, each carrying location and a confidence level.
      empty: The declared scope was examined in full and contained no enforcement site; completeness is Complete and the record set is empty.
      not_applicable: No rule exists to enforce
      partial: Administrative write paths were not traced; completeness is Partial and the unexamined boundary is recorded.
      boundary: A rule with layer client and no other record is client-only, which is a finding about one path to the system
  - type: framework.workflow.states
    type_version: 1.0.0
    lifecycle: active
    purpose: The states an entity occupies and the transitions between them
    contract: Each transition names the component that performs it
    producer_kind: workflow-discovery
    subject_noun: entity lifecycle
    required_fields: [entity, states, transitions, declaration_path, evidence_state, confidence]
    optional_fields: [guard_conditions, terminal_states, direct_assignment_sites]
    evidence_bearing_fields: [declaration_path]
    derives_from: [framework.database.entities]
    consumption_profiles:
      - consumer: feature-inventory
        reads: [entity, states]
    fixtures:
      normal: One record per entity lifecycle found within the declared scope, each carrying declaration_path and a confidence level.
      empty: The declared scope was examined in full and contained no entity lifecycle; completeness is Complete and the record set is empty.
      not_applicable: No entity has a lifecycle
      partial: Only one entity family was traced; completeness is Partial and the unexamined boundary is recorded.
      boundary: A state with no inbound transition is recorded as unreachable rather than removed from the state set
  - type: framework.workflow.decisions
    type_version: 1.0.0
    lifecycle: active
    purpose: The points where the system chooses between materially different outcomes
    contract: Every branch records an observable consequence with a location
    producer_kind: workflow-discovery
    subject_noun: decision point
    required_fields: [decision, location, inputs, branches, evidence_state, confidence]
    optional_fields: [driver, deciding_component]
    evidence_bearing_fields: [location]
    vocabularies:
      - field: driver
        kind: closed
        values: [business-data, configuration, feature-flag, unknown]
    fixtures:
      normal: One record per decision point found within the declared scope, each carrying location and a confidence level.
      empty: The declared scope was examined in full and contained no decision point; completeness is Complete and the record set is empty.
      not_applicable: The system encodes no branching decision of business significance
      partial: Feature-flagged branches were not resolved; completeness is Partial and the unexamined boundary is recorded.
      boundary: A decision whose branches are indistinguishable to any consumer is recorded as a candidate for dead logic
  - type: framework.workflow.actors
    type_version: 1.0.0
    lifecycle: active
    purpose: Who and what initiates the reconstructed processes
    contract: Authority is recorded from evidence or as Unknown; it is never assumed
    producer_kind: workflow-discovery
    subject_noun: actor
    required_fields: [actor, actor_kind, initiates, authority_evidence, evidence_state, confidence]
    optional_fields: [delegation_mechanism, acting_component]
    evidence_bearing_fields: [authority_evidence]
    vocabularies:
      - field: actor_kind
        kind: closed
        values: [human, system, service-account, unknown]
    derives_from: [framework.workflow.processes]
    consumption_profiles:
      - consumer: security-discovery
        reads: [actor, actor_kind, authority_evidence]
    fixtures:
      normal: One record per actor found within the declared scope, each carrying authority_evidence and a confidence level.
      empty: The declared scope was examined in full and contained no actor; completeness is Complete and the record set is empty.
      not_applicable: No process has an identifiable initiator in scope
      partial: Service accounts were out of scope; completeness is Partial and the unexamined boundary is recorded.
      boundary: An actor whose authority cannot be established records authority_evidence absent, not an assumed default
  - type: framework.workflow.risks
    type_version: 1.0.0
    lifecycle: active
    purpose: Prioritized workflow risks derived from the recorded observations
    contract: Every risk names at least one supporting observation and the reasoning from it
    producer_kind: workflow-discovery
    subject_noun: workflow risk
    required_fields: [risk, cause, impact, supporting_records, likelihood_rationale, evidence_state, confidence]
    optional_fields: [next_verification, reversibility]
    evidence_bearing_fields: [supporting_records]
    derives_from: [framework.workflow.enforcement, framework.workflow.states, framework.workflow.processes, framework.workflow.decisions]
    fixtures:
      normal: One record per workflow risk found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no workflow risk; completeness is Complete and the record set is empty.
      not_applicable: No observation in the artifact set supports a risk
      partial: Risk assessment covered part of the domain; completeness is Partial and the unexamined boundary is recorded.
      boundary: A generic best practice with no repository observation is not recorded as a risk
  - type: framework.workflow.health
    type_version: 1.0.0
    lifecycle: active
    purpose: Workflow health scores per dimension, with the calculation that produced each
    contract: Every score shows its calculation and the records that fed it; a partial score is reported as a bounded range
    producer_kind: workflow-discovery
    subject_noun: health dimension
    required_fields: [dimension, score, calculation, supporting_records, evidence_state, confidence]
    optional_fields: [bound_low, bound_high, escalation_flag]
    evidence_bearing_fields: [supporting_records]
    vocabularies:
      - field: dimension
        kind: closed
        values: [process-traceability, rule-locatability, enforcement-consistency, bypass-control, lifecycle-integrity, decision-clarity, actor-authority-clarity, documentation-to-implementation-agreement]
    derives_from: [framework.workflow.processes, framework.workflow.rules, framework.workflow.enforcement, framework.workflow.states, framework.workflow.decisions, framework.workflow.actors, framework.workflow.risks]
    fixtures:
      normal: One record per health dimension found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no health dimension; completeness is Complete and the record set is empty.
      not_applicable: No dimension is applicable to the subject
      partial: Some dimensions had no supporting evidence; completeness is Partial and the unexamined boundary is recorded.
      boundary: A dimension scored in the lowest two levels sets escalation_flag regardless of the aggregate
---
# Business Workflow Artifact Type Declarations

## 1. What This Document Is

*This section is informative.*

Declarations for the 8 artifact types produced by workflow discovery.

Every record in the front matter of this document is a **declaration**: structured data supplying the values that requirements in [STD-0013](../02-methodology/artifact-type-declaration-standard.md) range over. A declaration states no obligation and can therefore not be violated. Every rule that governs these types is stated once in that standard and is not repeated here.

This document carries no `requirements` key and no normative section, per [STD-0010](../02-methodology/metadata-specification.md) R-16 and [STD-0013](../02-methodology/artifact-type-declaration-standard.md) R-31.

## 2. Declared Types

*This section is informative.*

The table renders the front matter for a human reader. The front matter is authoritative.

| Type | Asserts | Subject counted |
| --- | --- | --- |
| `framework.workflow.processes` | The business processes the system carries out, traced from a reachable trigger | business process |
| `framework.workflow.rules` | The constraints the system applies, expressed as conditions rather than as code | business rule |
| `framework.workflow.enforcement` | Where each rule is enforced, and what reaches the entity without passing it | enforcement site |
| `framework.workflow.states` | The states an entity occupies and the transitions between them | entity lifecycle |
| `framework.workflow.decisions` | The points where the system chooses between materially different outcomes | decision point |
| `framework.workflow.actors` | Who and what initiates the reconstructed processes | actor |
| `framework.workflow.risks` | Prioritized workflow risks derived from the recorded observations | workflow risk |
| `framework.workflow.health` | Workflow health scores per dimension, with the calculation that produced each | health dimension |

8 types. Each is registered in the [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md).

## 3. Related Documents

*This section is informative.*

- [Artifact Type Declaration Standard](../02-methodology/artifact-type-declaration-standard.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md)
