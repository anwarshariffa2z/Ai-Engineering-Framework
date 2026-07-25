---
id: REF-0015
title: Frontend Artifact Type Declarations
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-26
review_cycle: Annual
category: Reference
tags: [artifacts, declarations, frontend]
related: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md, ../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/03-frontend-discovery.md]
object_type: Guide
depends_on: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md]
references: [../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/03-frontend-discovery.md]
meta_model_version: 1.0.0
normativity:
  "1": informative
  "2": informative
  "3": informative
artifact_types:
  - type: framework.frontend.surface
    type_version: 1.0.0
    lifecycle: active
    purpose: The distinct clients the repository builds and what each targets
    contract: Each client names its build unit; a shared library is never recorded as a client
    producer_kind: frontend-discovery
    subject_noun: client application
    required_fields: [client, platform, build_unit, evidence_state, confidence]
    optional_fields: [owning_module, support_matrix, delivery_target]
    evidence_bearing_fields: [build_unit]
    vocabularies:
      - field: platform
        kind: open
        values: [browser, mobile, desktop, terminal, embedded]
    derives_from: [framework.architecture.entrypoints]
    consumption_profiles:
      - consumer: feature-inventory
        reads: [client, platform]
    fixtures:
      normal: One record per client application found within the declared scope, each carrying build_unit and a confidence level.
      empty: The declared scope was examined in full and contained no client application; completeness is Complete and the record set is empty.
      not_applicable: The subject declares no user-facing client
      partial: One workspace was excluded; completeness is Partial and the unexamined boundary is recorded.
      boundary: A component workshop or demonstration surface is recorded with delivery_target absent and is not counted as delivered
  - type: framework.frontend.routing
    type_version: 1.0.0
    lifecycle: active
    purpose: The addressable surface of each client and how a user reaches it
    contract: A route with no inbound navigation reference is recorded as unreferenced, never as removed
    producer_kind: frontend-discovery
    subject_noun: route
    required_fields: [route, client, declaration_path, reachability, evidence_state, confidence]
    optional_fields: [parameters, guard, entry_component, navigation_references]
    evidence_bearing_fields: [declaration_path]
    vocabularies:
      - field: reachability
        kind: closed
        values: [referenced, unreferenced, constructed, unknown]
    consumption_profiles:
      - consumer: workflow-discovery
        reads: [route, entry_component, guard]
      - consumer: feature-inventory
        reads: [route, client, reachability]
    fixtures:
      normal: One record per route found within the declared scope, each carrying declaration_path and a confidence level.
      empty: The declared scope was examined in full and contained no route; completeness is Complete and the record set is empty.
      not_applicable: The client exposes no addressable route
      partial: Dynamically constructed routes were not enumerated; completeness is Partial and the unexamined boundary is recorded.
      boundary: A route constructed at runtime records reachability constructed and the construction site rather than a guessed path
  - type: framework.frontend.components
    type_version: 1.0.0
    lifecycle: active
    purpose: The units the client renders and what each is responsible for
    contract: Reuse is a measured import count, not a location
    producer_kind: frontend-discovery
    subject_noun: component
    required_fields: [component, declaration_path, responsibility, import_count, evidence_state, confidence]
    optional_fields: [public_props, design_system_member, render_role]
    evidence_bearing_fields: [declaration_path]
    vocabularies:
      - field: render_role
        kind: open
        values: [presentational, container, layout, unknown]
    consumption_profiles:
      - consumer: workflow-discovery
        reads: [component, responsibility]
    fixtures:
      normal: One record per component found within the declared scope, each carrying declaration_path and a confidence level.
      empty: The declared scope was examined in full and contained no component; completeness is Complete and the record set is empty.
      not_applicable: The client renders nothing; it is a headless bundle
      partial: One package was excluded from the catalogue; completeness is Partial and the unexamined boundary is recorded.
      boundary: A component with import_count zero is recorded as unreferenced rather than omitted
  - type: framework.frontend.state
    type_version: 1.0.0
    lifecycle: active
    purpose: Where client state lives, who owns it, and how it is kept consistent
    contract: Persisted state is recorded by medium; no stored value is read
    producer_kind: frontend-discovery
    subject_noun: state container
    required_fields: [container, scope, declaration_path, evidence_state, confidence]
    optional_fields: [owner, persistence_medium, readers, writers, synchronization]
    evidence_bearing_fields: [declaration_path]
    vocabularies:
      - field: scope
        kind: open
        values: [global, feature, route, component, session]
      - field: persistence_medium
        kind: open
        values: [memory, local-storage, session-storage, cookie, indexed-db, none]
    fixtures:
      normal: One record per state container found within the declared scope, each carrying declaration_path and a confidence level.
      empty: The declared scope was examined in full and contained no state container; completeness is Complete and the record set is empty.
      not_applicable: The client holds no state beyond render-local values
      partial: Only the primary client was analysed; completeness is Partial and the unexamined boundary is recorded.
      boundary: A container with writers and no declared owner records owner absent, which is the finding
  - type: framework.frontend.dataflow
    type_version: 1.0.0
    lifecycle: active
    purpose: How the client obtains and submits data, and what it does when that fails
    contract: Endpoint values are never recorded; the configuration key or contract reference is
    producer_kind: frontend-discovery
    subject_noun: service call site
    required_fields: [call_site, target_interface, trigger, evidence_state, confidence]
    optional_fields: [caching, retry, error_handling, optimistic_update]
    evidence_bearing_fields: [call_site]
    vocabularies:
      - field: trigger
        kind: open
        values: [render, user-action, interval, subscription, navigation]
    derives_from: [framework.architecture.integrations]
    consumption_profiles:
      - consumer: workflow-discovery
        reads: [call_site, target_interface, trigger]
    fixtures:
      normal: One record per service call site found within the declared scope, each carrying call_site and a confidence level.
      empty: The declared scope was examined in full and contained no service call site; completeness is Complete and the record set is empty.
      not_applicable: The client makes no service call
      partial: Generated clients were not expanded; completeness is Partial and the unexamined boundary is recorded.
      boundary: A call site with no handler records error_handling absent rather than inheriting a framework default
  - type: framework.frontend.assets
    type_version: 1.0.0
    lifecycle: active
    purpose: What is shipped to the user and how it is divided
    contract: Every size claim names the build that produced it and the conditions it ran under
    producer_kind: frontend-discovery
    subject_noun: bundle unit
    required_fields: [unit, origin, evidence_state, confidence]
    optional_fields: [size_bytes, measuring_command, split_boundary, third_party_scripts, committed_output]
    evidence_bearing_fields: [origin]
    vocabularies:
      - field: origin
        kind: closed
        values: [built, committed, third-party, unknown]
    fixtures:
      normal: One record per bundle unit found within the declared scope, each carrying origin and a confidence level.
      empty: The declared scope was examined in full and contained no bundle unit; completeness is Complete and the record set is empty.
      not_applicable: The client is served from source with no build step
      partial: The build was not run, so sizes are absent; completeness is Partial and the unexamined boundary is recorded.
      boundary: A size claim without measuring_command is not recorded; configuration is never presented as measurement
  - type: framework.frontend.accessibility
    type_version: 1.0.0
    lifecycle: active
    purpose: Accessibility observations against a named standard, with their evidence class
    contract: Automated and inspected findings are attributed separately and never merged
    producer_kind: frontend-discovery
    subject_noun: accessibility observation
    required_fields: [observation, standard, location, method, evidence_state, confidence]
    optional_fields: [tool, tool_version, scope_examined]
    evidence_bearing_fields: [location]
    vocabularies:
      - field: method
        kind: closed
        values: [automated, inspected]
    fixtures:
      normal: One record per accessibility observation found within the declared scope, each carrying location and a confidence level.
      empty: The declared scope was examined in full and contained no accessibility observation; completeness is Complete and the record set is empty.
      not_applicable: The client renders no user interface to assess
      partial: Only one client was assessed; completeness is Partial and the unexamined boundary is recorded.
      boundary: A conformance level is never recorded; only observations against a named standard are
  - type: framework.frontend.exposure
    type_version: 1.0.0
    lifecycle: active
    purpose: What an inspector of the shipped client can learn from it
    contract: A location and a class are recorded; a value never is
    producer_kind: frontend-discovery
    subject_noun: exposed item
    required_fields: [item_class, location, established_from, redaction_marker, evidence_state, confidence]
    optional_fields: [inlining_mechanism, gating]
    evidence_bearing_fields: [location]
    vocabularies:
      - field: item_class
        kind: open
        values: [configuration-value, internal-endpoint, identifier, business-logic, admin-surface]
      - field: established_from
        kind: closed
        values: [source, build-output]
      - field: gating
        kind: closed
        values: [client-only, server-enforced, unknown]
    consumption_profiles:
      - consumer: security-discovery
        reads: [item_class, location, gating, established_from]
    fixtures:
      normal: One record per exposed item found within the declared scope, each carrying location and a confidence level.
      empty: The declared scope was examined in full and contained no exposed item; completeness is Complete and the record set is empty.
      not_applicable: No build output or source discloses anything beyond the rendered interface
      partial: Build output was unavailable, so only source was examined; completeness is Partial and the unexamined boundary is recorded.
      boundary: An admin surface with gating client-only is recorded as an observed client behaviour and an unknown authorization posture
  - type: framework.frontend.risks
    type_version: 1.0.0
    lifecycle: active
    purpose: Prioritized frontend risks derived from the recorded observations
    contract: Every risk names at least one supporting observation and the reasoning from it
    producer_kind: frontend-discovery
    subject_noun: frontend risk
    required_fields: [risk, cause, impact, supporting_records, likelihood_rationale, evidence_state, confidence]
    optional_fields: [next_verification, reversibility]
    evidence_bearing_fields: [supporting_records]
    derives_from: [framework.frontend.routing, framework.frontend.state, framework.frontend.exposure, framework.frontend.dataflow]
    fixtures:
      normal: One record per frontend risk found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no frontend risk; completeness is Complete and the record set is empty.
      not_applicable: No observation in the artifact set supports a risk
      partial: Risk assessment covered part of the domain; completeness is Partial and the unexamined boundary is recorded.
      boundary: A generic best practice with no repository observation is not recorded as a risk
  - type: framework.frontend.health
    type_version: 1.0.0
    lifecycle: active
    purpose: Frontend health scores per dimension, with the calculation that produced each
    contract: Every score shows its calculation and the records that fed it; a partial score is reported as a bounded range
    producer_kind: frontend-discovery
    subject_noun: health dimension
    required_fields: [dimension, score, calculation, supporting_records, evidence_state, confidence]
    optional_fields: [bound_low, bound_high, escalation_flag]
    evidence_bearing_fields: [supporting_records]
    vocabularies:
      - field: dimension
        kind: closed
        values: [surface-clarity, routing-integrity, component-cohesion, state-ownership-clarity, data-flow-discipline, asset-discipline, accessibility-evidence, client-exposure-control, documentation-traceability]
    derives_from: [framework.frontend.routing, framework.frontend.components, framework.frontend.state, framework.frontend.dataflow, framework.frontend.assets, framework.frontend.accessibility, framework.frontend.exposure, framework.frontend.risks]
    fixtures:
      normal: One record per health dimension found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no health dimension; completeness is Complete and the record set is empty.
      not_applicable: No dimension is applicable to the subject
      partial: Some dimensions had no supporting evidence; completeness is Partial and the unexamined boundary is recorded.
      boundary: A dimension scored in the lowest two levels sets escalation_flag regardless of the aggregate
---
# Frontend Artifact Type Declarations

## 1. What This Document Is

*This section is informative.*

Declarations for the 10 artifact types produced by frontend discovery.

Every record in the front matter of this document is a **declaration**: structured data supplying the values that requirements in [STD-0013](../02-methodology/artifact-type-declaration-standard.md) range over. A declaration states no obligation and can therefore not be violated. Every rule that governs these types is stated once in that standard and is not repeated here.

This document carries no `requirements` key and no normative section, per [STD-0010](../02-methodology/metadata-specification.md) R-16 and [STD-0013](../02-methodology/artifact-type-declaration-standard.md) R-31.

## 2. Declared Types

*This section is informative.*

The table renders the front matter for a human reader. The front matter is authoritative.

| Type | Asserts | Subject counted |
| --- | --- | --- |
| `framework.frontend.surface` | The distinct clients the repository builds and what each targets | client application |
| `framework.frontend.routing` | The addressable surface of each client and how a user reaches it | route |
| `framework.frontend.components` | The units the client renders and what each is responsible for | component |
| `framework.frontend.state` | Where client state lives, who owns it, and how it is kept consistent | state container |
| `framework.frontend.dataflow` | How the client obtains and submits data, and what it does when that fails | service call site |
| `framework.frontend.assets` | What is shipped to the user and how it is divided | bundle unit |
| `framework.frontend.accessibility` | Accessibility observations against a named standard, with their evidence class | accessibility observation |
| `framework.frontend.exposure` | What an inspector of the shipped client can learn from it | exposed item |
| `framework.frontend.risks` | Prioritized frontend risks derived from the recorded observations | frontend risk |
| `framework.frontend.health` | Frontend health scores per dimension, with the calculation that produced each | health dimension |

10 types. Each is registered in the [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md).

## 3. Related Documents

*This section is informative.*

- [Artifact Type Declaration Standard](../02-methodology/artifact-type-declaration-standard.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md)
