---
id: REF-0016
title: Backend Artifact Type Declarations
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-26
review_cycle: Annual
category: Reference
tags: [artifacts, declarations, backend]
related: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md, ../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/04-backend-discovery.md]
object_type: Guide
depends_on: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md]
references: [../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/04-backend-discovery.md]
meta_model_version: 1.0.0
normativity:
  "1": informative
  "2": informative
  "3": informative
artifact_types:
  - type: framework.backend.services
    type_version: 1.0.0
    lifecycle: active
    purpose: The independently deployed or independently triggered server-side units
    contract: Each service names a deployment unit and an entry point; a library never appears
    producer_kind: backend-discovery
    subject_noun: server-side unit
    required_fields: [service, deployment_unit, execution_model, evidence_state, confidence]
    optional_fields: [owning_module, state_ownership, lifecycle_controls]
    evidence_bearing_fields: [deployment_unit]
    vocabularies:
      - field: execution_model
        kind: open
        values: [request-response, worker, scheduled, function, stream-consumer]
    derives_from: [framework.architecture.runtime, framework.architecture.entrypoints]
    consumption_profiles:
      - consumer: operations-discovery
        reads: [service, deployment_unit, execution_model]
    fixtures:
      normal: One record per server-side unit found within the declared scope, each carrying deployment_unit and a confidence level.
      empty: The declared scope was examined in full and contained no server-side unit; completeness is Complete and the record set is empty.
      not_applicable: The subject declares no server-side component
      partial: One workspace was excluded; completeness is Partial and the unexamined boundary is recorded.
      boundary: Two services sharing one process are recorded separately, each naming the shared deployment unit
  - type: framework.backend.interfaces
    type_version: 1.0.0
    lifecycle: active
    purpose: The operations each service exposes and who is expected to call them
    contract: Operations are enumerated from registration, never from a specification alone
    producer_kind: backend-discovery
    subject_noun: exposed operation
    required_fields: [operation, service, protocol, registration_path, handler_path, evidence_state, confidence]
    optional_fields: [auth_requirement, exposure, caller_references]
    evidence_bearing_fields: [registration_path]
    vocabularies:
      - field: protocol
        kind: open
        values: [http, grpc, graphql, message, function-trigger]
      - field: exposure
        kind: closed
        values: [internal, external, unknown]
      - field: auth_requirement
        kind: closed
        values: [required, absent, unknown]
    consumption_profiles:
      - consumer: workflow-discovery
        reads: [operation, service, handler_path]
      - consumer: security-discovery
        reads: [operation, auth_requirement, exposure]
      - consumer: feature-inventory
        reads: [operation, service]
      - consumer: runtime-verification
        reads: [operation, protocol]
    fixtures:
      normal: One record per exposed operation found within the declared scope, each carrying registration_path and a confidence level.
      empty: The declared scope was examined in full and contained no exposed operation; completeness is Complete and the record set is empty.
      not_applicable: No service exposes an operation
      partial: One protocol family was not traced; completeness is Partial and the unexamined boundary is recorded.
      boundary: A registration with no handler body is recorded with handler_path absent, which is the finding
  - type: framework.backend.contracts
    type_version: 1.0.0
    lifecycle: active
    purpose: What each operation promises about its inputs and outputs, and where that is enforced
    contract: Specification and validating code are both recorded; a divergence is never resolved by preference
    producer_kind: backend-discovery
    subject_noun: operation contract
    required_fields: [operation, schema_authority, validation_location, evidence_state, confidence]
    optional_fields: [versioning_strategy, divergence, request_shape, response_shape]
    evidence_bearing_fields: [schema_authority]
    vocabularies:
      - field: schema_authority
        kind: open
        values: [specification, code, generated-type, none]
    derives_from: [framework.backend.interfaces]
    consumption_profiles:
      - consumer: workflow-discovery
        reads: [operation, validation_location]
      - consumer: runtime-verification
        reads: [operation, response_shape, schema_authority]
    fixtures:
      normal: One record per operation contract found within the declared scope, each carrying schema_authority and a confidence level.
      empty: The declared scope was examined in full and contained no operation contract; completeness is Complete and the record set is empty.
      not_applicable: No operation declares a contract
      partial: Only externally exposed operations were analysed; completeness is Partial and the unexamined boundary is recorded.
      boundary: An operation with schema_authority none is recorded as unvalidated rather than as permissive
  - type: framework.backend.execution
    type_version: 1.0.0
    lifecycle: active
    purpose: How work is triggered, ordered, and bounded across synchronous and asynchronous paths
    contract: Delivery and ordering properties are recorded from configuration, never from a broker default
    producer_kind: backend-discovery
    subject_noun: execution path
    required_fields: [path, trigger, delivery, ordering, evidence_state, confidence]
    optional_fields: [concurrency_limit, idempotency_evidence, owning_service]
    evidence_bearing_fields: [trigger]
    vocabularies:
      - field: delivery
        kind: closed
        values: [at-most-once, at-least-once, exactly-once, unknown]
      - field: ordering
        kind: closed
        values: [ordered, unordered, unknown]
    consumption_profiles:
      - consumer: workflow-discovery
        reads: [path, trigger, delivery]
    fixtures:
      normal: One record per execution path found within the declared scope, each carrying trigger and a confidence level.
      empty: The declared scope was examined in full and contained no execution path; completeness is Complete and the record set is empty.
      not_applicable: All work is performed inline within a request and no separate execution path exists
      partial: Scheduled work was out of scope; completeness is Partial and the unexamined boundary is recorded.
      boundary: An at-least-once path with no idempotency_evidence records that absence, which is the finding
  - type: framework.backend.dataaccess
    type_version: 1.0.0
    lifecycle: active
    purpose: How services reach persistent state and where transaction boundaries fall
    contract: Every write records a transaction boundary or an explicit unknown
    producer_kind: backend-discovery
    subject_noun: access path
    required_fields: [service, entity, operation_kind, access_location, evidence_state, confidence]
    optional_fields: [transaction_boundary, isolation_declaration, is_shared_write]
    evidence_bearing_fields: [access_location]
    vocabularies:
      - field: operation_kind
        kind: closed
        values: [read, write, read-write]
    derives_from: [framework.database.entities, framework.database.connections]
    consumption_profiles:
      - consumer: workflow-discovery
        reads: [service, entity, operation_kind]
    fixtures:
      normal: One record per access path found within the declared scope, each carrying access_location and a confidence level.
      empty: The declared scope was examined in full and contained no access path; completeness is Complete and the record set is empty.
      not_applicable: No service reaches persistent state
      partial: One store was not traced; completeness is Partial and the unexamined boundary is recorded.
      boundary: A transaction spanning an external call is recorded with the external call site named
  - type: framework.backend.resilience
    type_version: 1.0.0
    lifecycle: active
    purpose: What the system does when a dependency is slow, unavailable, or failing
    contract: A declared policy and an applied policy are distinguished by declaration site
    producer_kind: backend-discovery
    subject_noun: dependency policy
    required_fields: [dependency, policy_kind, declaration_site, evidence_state, confidence]
    optional_fields: [timeout, retry_count, backoff, override_sites, fallback_path]
    evidence_bearing_fields: [declaration_site]
    vocabularies:
      - field: policy_kind
        kind: open
        values: [timeout, retry, circuit-breaker, rate-limit, bulkhead, fallback]
    consumption_profiles:
      - consumer: operations-discovery
        reads: [dependency, policy_kind, timeout]
    fixtures:
      normal: One record per dependency policy found within the declared scope, each carrying declaration_site and a confidence level.
      empty: The declared scope was examined in full and contained no dependency policy; completeness is Complete and the record set is empty.
      not_applicable: The system has no external dependency
      partial: Only outbound HTTP clients were analysed; completeness is Partial and the unexamined boundary is recorded.
      boundary: A dependency with no declared timeout is recorded as unbounded rather than as defaulted
  - type: framework.backend.errors
    type_version: 1.0.0
    lifecycle: active
    purpose: How failures propagate and what a caller learns when one occurs
    contract: Internal messages are never reproduced; locations and classes are
    producer_kind: backend-discovery
    subject_noun: failure path
    required_fields: [failure, handler_location, client_visible_shape, evidence_state, confidence]
    optional_fields: [internal_source, is_swallowed, discloses_internal_detail]
    evidence_bearing_fields: [handler_location]
    fixtures:
      normal: One record per failure path found within the declared scope, each carrying handler_location and a confidence level.
      empty: The declared scope was examined in full and contained no failure path; completeness is Complete and the record set is empty.
      not_applicable: The system declares no error handling and every failure propagates unmodified
      partial: Only the primary service was traced; completeness is Partial and the unexamined boundary is recorded.
      boundary: A handler that logs and returns success records is_swallowed true; a logging call alone is not error handling
  - type: framework.backend.boundaries
    type_version: 1.0.0
    lifecycle: active
    purpose: Where the system stops trusting its caller and which component performs the check
    contract: Coverage is enumerated against the operation inventory, never asserted from a registration
    producer_kind: backend-discovery
    subject_noun: enforcement point
    required_fields: [operation, check_kind, enforcement_location, evidence_state, confidence]
    optional_fields: [condition_evaluated, is_environmental]
    evidence_bearing_fields: [enforcement_location]
    vocabularies:
      - field: check_kind
        kind: closed
        values: [authentication, authorization, input-validation]
    derives_from: [framework.backend.interfaces]
    consumption_profiles:
      - consumer: security-discovery
        reads: [operation, check_kind, enforcement_location, is_environmental]
      - consumer: workflow-discovery
        reads: [operation, check_kind, enforcement_location]
    fixtures:
      normal: One record per enforcement point found within the declared scope, each carrying enforcement_location and a confidence level.
      empty: The declared scope was examined in full and contained no enforcement point; completeness is Complete and the record set is empty.
      not_applicable: No operation is exposed, so no boundary exists
      partial: Only externally exposed operations were checked; completeness is Partial and the unexamined boundary is recorded.
      boundary: An operation with no record for a check_kind is an uncovered operation and is listed, not summarized
  - type: framework.backend.risks
    type_version: 1.0.0
    lifecycle: active
    purpose: Prioritized backend risks derived from the recorded observations
    contract: Every risk names at least one supporting observation and the reasoning from it
    producer_kind: backend-discovery
    subject_noun: backend risk
    required_fields: [risk, cause, impact, supporting_records, likelihood_rationale, evidence_state, confidence]
    optional_fields: [next_verification, reversibility]
    evidence_bearing_fields: [supporting_records]
    derives_from: [framework.backend.contracts, framework.backend.execution, framework.backend.dataaccess, framework.backend.resilience, framework.backend.errors, framework.backend.boundaries]
    fixtures:
      normal: One record per backend risk found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no backend risk; completeness is Complete and the record set is empty.
      not_applicable: No observation in the artifact set supports a risk
      partial: Risk assessment covered part of the domain; completeness is Partial and the unexamined boundary is recorded.
      boundary: A generic best practice with no repository observation is not recorded as a risk
  - type: framework.backend.health
    type_version: 1.0.0
    lifecycle: active
    purpose: Backend health scores per dimension, with the calculation that produced each
    contract: Every score shows its calculation and the records that fed it; a partial score is reported as a bounded range
    producer_kind: backend-discovery
    subject_noun: health dimension
    required_fields: [dimension, score, calculation, supporting_records, evidence_state, confidence]
    optional_fields: [bound_low, bound_high, escalation_flag]
    evidence_bearing_fields: [supporting_records]
    vocabularies:
      - field: dimension
        kind: closed
        values: [service-boundary-clarity, interface-discipline, contract-integrity, execution-model-clarity, data-access-ownership, transaction-discipline, resilience-posture, error-handling-quality, boundary-enforcement-coverage, documentation-traceability]
    derives_from: [framework.backend.interfaces, framework.backend.contracts, framework.backend.execution, framework.backend.dataaccess, framework.backend.resilience, framework.backend.errors, framework.backend.boundaries, framework.backend.risks]
    fixtures:
      normal: One record per health dimension found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no health dimension; completeness is Complete and the record set is empty.
      not_applicable: No dimension is applicable to the subject
      partial: Some dimensions had no supporting evidence; completeness is Partial and the unexamined boundary is recorded.
      boundary: A dimension scored in the lowest two levels sets escalation_flag regardless of the aggregate
---
# Backend Artifact Type Declarations

## 1. What This Document Is

*This section is informative.*

Declarations for the 10 artifact types produced by backend discovery.

Every record in the front matter of this document is a **declaration**: structured data supplying the values that requirements in [STD-0013](../02-methodology/artifact-type-declaration-standard.md) range over. A declaration states no obligation and can therefore not be violated. Every rule that governs these types is stated once in that standard and is not repeated here.

This document carries no `requirements` key and no normative section, per [STD-0010](../02-methodology/metadata-specification.md) R-16 and [STD-0013](../02-methodology/artifact-type-declaration-standard.md) R-31.

## 2. Declared Types

*This section is informative.*

The table renders the front matter for a human reader. The front matter is authoritative.

| Type | Asserts | Subject counted |
| --- | --- | --- |
| `framework.backend.services` | The independently deployed or independently triggered server-side units | server-side unit |
| `framework.backend.interfaces` | The operations each service exposes and who is expected to call them | exposed operation |
| `framework.backend.contracts` | What each operation promises about its inputs and outputs, and where that is enforced | operation contract |
| `framework.backend.execution` | How work is triggered, ordered, and bounded across synchronous and asynchronous paths | execution path |
| `framework.backend.dataaccess` | How services reach persistent state and where transaction boundaries fall | access path |
| `framework.backend.resilience` | What the system does when a dependency is slow, unavailable, or failing | dependency policy |
| `framework.backend.errors` | How failures propagate and what a caller learns when one occurs | failure path |
| `framework.backend.boundaries` | Where the system stops trusting its caller and which component performs the check | enforcement point |
| `framework.backend.risks` | Prioritized backend risks derived from the recorded observations | backend risk |
| `framework.backend.health` | Backend health scores per dimension, with the calculation that produced each | health dimension |

10 types. Each is registered in the [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md).

## 3. Related Documents

*This section is informative.*

- [Artifact Type Declaration Standard](../02-methodology/artifact-type-declaration-standard.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md)
