---
id: REF-0013
title: Architecture Artifact Type Declarations
version: 1.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-29
review_cycle: Annual
category: Reference
tags: [artifacts, declarations, architecture]
related: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md, ../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/01-architecture-discovery.md]
object_type: Guide
depends_on: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md]
references: [../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/01-architecture-discovery.md]
meta_model_version: 1.0.0
normativity:
  "1": informative
  "2": informative
  "3": informative
artifact_types:
  - type: framework.architecture.scope
    type_version: 1.0.0
    lifecycle: active
    purpose: The repository boundary that was examined and what was excluded from it
    contract: Every path counted as in scope is listed, and every exclusion carries a reason
    producer_kind: architecture-discovery
    subject_noun: traversed path
    required_fields: [path, kind, inclusion, evidence_state, confidence]
    optional_fields: [exclusion_reason, accessibility]
    evidence_bearing_fields: [path]
    vocabularies:
      - field: kind
        kind: open
        values: [source, test, generated, vendored, infrastructure, documentation, automation]
      - field: inclusion
        kind: closed
        values: [included, excluded, inaccessible]
    consumption_profiles:
      - consumer: database-discovery
        reads: [path, inclusion]
      - consumer: frontend-discovery
        reads: [path, kind, inclusion]
    fixtures:
      normal: One record per traversed path found within the declared scope, each carrying path and a confidence level.
      empty: The declared scope was examined in full and contained no traversed path; completeness is Complete and the record set is empty.
      not_applicable: The subject is an empty repository at the audited revision; no path exists to traverse
      partial: Traversal stopped at an unreadable subtree; completeness is Partial and the unexamined boundary is recorded.
      boundary: A symbolic link pointing outside the authorized scope is recorded as inaccessible and is not followed
  - type: framework.architecture.technology
    type_version: 1.0.0
    lifecycle: active
    purpose: The runtimes, ecosystems, frameworks, and tooling the repository declares
    contract: Every technology names a declaring artifact and a role; nothing is asserted from a file extension alone
    producer_kind: architecture-discovery
    subject_noun: declared technology
    required_fields: [technology, role, declaration_path, evidence_state, confidence]
    optional_fields: [version_constraint, ecosystem, is_transitive]
    evidence_bearing_fields: [declaration_path]
    vocabularies:
      - field: role
        kind: closed
        values: [build, test, runtime, data, deployment, development-support]
    consumption_profiles:
      - consumer: database-discovery
        reads: [technology, role, version_constraint]
      - consumer: backend-discovery
        reads: [technology, role]
    fixtures:
      normal: One record per declared technology found within the declared scope, each carrying declaration_path and a confidence level.
      empty: The declared scope was examined in full and contained no declared technology; completeness is Complete and the record set is empty.
      not_applicable: The repository declares no manifest, lockfile, or build definition from which a technology could be read
      partial: One workspace manifest was unreadable; completeness is Partial and the unexamined boundary is recorded.
      boundary: A tool present only in a development container is recorded with role development-support, not runtime
  - type: framework.architecture.build
    type_version: 1.0.0
    lifecycle: active
    purpose: How source becomes a deployable artifact and where that process is controlled
    contract: Each command names its defining artifact; a documented command is never recorded as executed
    producer_kind: architecture-discovery
    subject_noun: build command
    required_fields: [command, definition_path, controller, evidence_state, confidence]
    optional_fields: [outputs, ci_reference, reproducibility_note]
    evidence_bearing_fields: [definition_path]
    vocabularies:
      - field: controller
        kind: open
        values: [local-script, ci-pipeline, container, task-runner, unknown]
    consumption_profiles:
      - consumer: operations-discovery
        reads: [command, controller, ci_reference]
    fixtures:
      normal: One record per build command found within the declared scope, each carrying definition_path and a confidence level.
      empty: The declared scope was examined in full and contained no build command; completeness is Complete and the record set is empty.
      not_applicable: The repository declares no build step; sources are consumed directly
      partial: CI definitions were out of scope; completeness is Partial and the unexamined boundary is recorded.
      boundary: A local script and a CI job defining the same step with different flags are recorded as two commands with a divergence note
  - type: framework.architecture.entrypoints
    type_version: 1.0.0
    lifecycle: active
    purpose: Where executable behaviour begins, with its invocation context
    contract: Each entry point carries an invocation path; a module is never called an entry point without one
    producer_kind: architecture-discovery
    subject_noun: entry point
    required_fields: [entry_point, entry_kind, declaration_path, evidence_state, confidence]
    optional_fields: [owning_module, initialization_trace, audience]
    evidence_bearing_fields: [declaration_path]
    vocabularies:
      - field: entry_kind
        kind: open
        values: [service, client, job, worker, script, function, infrastructure-apply]
      - field: audience
        kind: closed
        values: [production, development, test]
    consumption_profiles:
      - consumer: backend-discovery
        reads: [entry_point, entry_kind, owning_module]
      - consumer: frontend-discovery
        reads: [entry_point, entry_kind]
    fixtures:
      normal: One record per entry point found within the declared scope, each carrying declaration_path and a confidence level.
      empty: The declared scope was examined in full and contained no entry point; completeness is Complete and the record set is empty.
      not_applicable: The repository is a library with no executable entry point
      partial: Only the primary workspace was traced; completeness is Partial and the unexamined boundary is recorded.
      boundary: A test harness entry point is recorded with audience test and is not counted as a deployable component
  - type: framework.architecture.dependencies
    type_version: 1.0.0
    lifecycle: active
    purpose: Internal and external coupling with direction and supply-chain surface
    contract: Direct and transitive dependencies are distinguished; no reachability claim is made
    producer_kind: architecture-discovery
    subject_noun: dependency edge
    required_fields: [from_component, to_dependency, directness, declaration_path, evidence_state, confidence]
    optional_fields: [version_constraint, is_pinned, cycle_id]
    evidence_bearing_fields: [declaration_path]
    vocabularies:
      - field: directness
        kind: closed
        values: [direct, transitive]
    consumption_profiles:
      - consumer: security-discovery
        reads: [to_dependency, directness, is_pinned, version_constraint]
    fixtures:
      normal: One record per dependency edge found within the declared scope, each carrying declaration_path and a confidence level.
      empty: The declared scope was examined in full and contained no dependency edge; completeness is Complete and the record set is empty.
      not_applicable: The repository declares no dependencies
      partial: No lockfile was available, so transitive edges are absent; completeness is Partial and the unexamined boundary is recorded.
      boundary: A dependency declared in two manifests with conflicting constraints is recorded twice, once per declaring path
  - type: framework.architecture.modules
    type_version: 1.0.0
    lifecycle: active
    purpose: Cohesive units of code with responsibility evidence and public interfaces
    contract: Each module names a boundary artifact; a folder is not a module
    producer_kind: architecture-discovery
    subject_noun: module
    required_fields: [module, boundary_evidence, responsibility, evidence_state, confidence]
    optional_fields: [public_interface, owner, depends_on_modules]
    evidence_bearing_fields: [boundary_evidence]
    vocabularies:
      - field: boundary_evidence
        kind: open
        values: [package-manifest, build-target, namespace, documented-boundary, deployable]
    consumption_profiles:
      - consumer: backend-discovery
        reads: [module, responsibility, public_interface]
      - consumer: workflow-discovery
        reads: [module, responsibility]
      - consumer: feature-inventory
        reads: [module, responsibility, owner]
    fixtures:
      normal: One record per module found within the declared scope, each carrying boundary_evidence and a confidence level.
      empty: The declared scope was examined in full and contained no module; completeness is Complete and the record set is empty.
      not_applicable: The repository has no internal structure above the file level
      partial: Vendored code was excluded from module analysis; completeness is Partial and the unexamined boundary is recorded.
      boundary: A monolithic area with no discernible boundary is recorded as one module with responsibility Unknown rather than split artificially
  - type: framework.architecture.layers
    type_version: 1.0.0
    lifecycle: active
    purpose: The layer map, its dependency-direction rules, and the violations of them
    contract: Each layer names its member modules; each violation names both endpoints
    producer_kind: architecture-discovery
    subject_noun: layer
    required_fields: [layer, member_modules, evidence_state, confidence]
    optional_fields: [permitted_direction, violations, organizing_principle]
    evidence_bearing_fields: [member_modules]
    vocabularies:
      - field: layer
        kind: open
        values: [presentation, interface, application, domain, data, infrastructure, cross-cutting]
    fixtures:
      normal: One record per layer found within the declared scope, each carrying member_modules and a confidence level.
      empty: The declared scope was examined in full and contained no layer; completeness is Complete and the record set is empty.
      not_applicable: The architecture is not layered and an alternative organizing principle is recorded instead
      partial: Layer analysis covered the primary workspace only; completeness is Partial and the unexamined boundary is recorded.
      boundary: A convention that is documented but not enforced is recorded as a permitted direction with evidence state Inferred
  - type: framework.architecture.classification
    type_version: 1.0.0
    lifecycle: active
    purpose: The architectural style the evidence supports, with the alternatives it does not exclude
    contract: Every candidate carries its supporting evidence and a confidence level; a single label is never asserted alone
    producer_kind: architecture-discovery
    subject_noun: classification candidate
    required_fields: [candidate, supporting_evidence, is_dominant, evidence_state, confidence]
    optional_fields: [excluded_by, rationale]
    evidence_bearing_fields: [supporting_evidence]
    vocabularies:
      - field: candidate
        kind: open
        values: [modular-monolith, layered, microservices, service-oriented, event-driven, serverless, client-heavy, plugin-platform, pipeline, hybrid]
    derives_from: [framework.architecture.modules, framework.architecture.layers]
    fixtures:
      normal: One record per classification candidate found within the declared scope, each carrying supporting_evidence and a confidence level.
      empty: The declared scope was examined in full and contained no classification candidate; completeness is Complete and the record set is empty.
      not_applicable: The subject is not an application and no architectural style applies
      partial: Deployment evidence was unavailable, so distribution style could not be assessed; completeness is Partial and the unexamined boundary is recorded.
      boundary: Two candidates supported by equal evidence are both recorded, neither marked dominant
  - type: framework.architecture.runtime
    type_version: 1.0.0
    lifecycle: active
    purpose: The processes, workloads, stores, and queues comprising the running system
    contract: Every component names a declaring artifact; topology is never inferred from source imports
    producer_kind: architecture-discovery
    subject_noun: runtime component
    required_fields: [component, component_kind, declaration_path, evidence_state, confidence]
    optional_fields: [trigger, state_ownership, scaling_clue]
    evidence_bearing_fields: [declaration_path]
    vocabularies:
      - field: component_kind
        kind: open
        values: [service, worker, scheduled-job, database, cache, queue, gateway, client]
    consumption_profiles:
      - consumer: backend-discovery
        reads: [component, component_kind, state_ownership]
      - consumer: operations-discovery
        reads: [component, component_kind]
    fixtures:
      normal: One record per runtime component found within the declared scope, each carrying declaration_path and a confidence level.
      empty: The declared scope was examined in full and contained no runtime component; completeness is Complete and the record set is empty.
      not_applicable: No deployment or orchestration artifact exists in scope, so no runtime component is declared by the repository
      partial: Only one environment manifest was in scope; completeness is Partial and the unexamined boundary is recorded.
      boundary: A library packaged alongside services is not recorded as a runtime component
  - type: framework.architecture.integrations
    type_version: 1.0.0
    lifecycle: active
    purpose: Boundaries where the system exchanges data or control with something outside it
    contract: A configured capability and an observed active integration are distinguished; no endpoint value is recorded
    producer_kind: architecture-discovery
    subject_noun: external integration
    required_fields: [integration, direction, adapter_path, evidence_state, confidence]
    optional_fields: [protocol, auth_boundary, contract_reference, activity]
    evidence_bearing_fields: [adapter_path]
    vocabularies:
      - field: direction
        kind: closed
        values: [inbound, outbound, bidirectional]
      - field: activity
        kind: closed
        values: [configured, observed-active, unknown]
    consumption_profiles:
      - consumer: security-discovery
        reads: [integration, direction, auth_boundary]
      - consumer: backend-discovery
        reads: [integration, direction, contract_reference]
      - consumer: frontend-discovery
        reads: [integration, direction]
    fixtures:
      normal: One record per external integration found within the declared scope, each carrying adapter_path and a confidence level.
      empty: The declared scope was examined in full and contained no external integration; completeness is Complete and the record set is empty.
      not_applicable: The system exchanges nothing with any external system
      partial: Contracts for two integrations were unavailable; completeness is Partial and the unexamined boundary is recorded.
      boundary: A client library present as a dependency with no call site is recorded with activity configured, not observed-active
  - type: framework.architecture.configuration
    type_version: 1.0.0
    lifecycle: active
    purpose: Configuration sources, their precedence, and where the secret boundary falls
    contract: Secret references are recorded by name and location and never by value
    producer_kind: architecture-discovery
    subject_noun: configuration key
    required_fields: [key, source, is_secret_reference, evidence_state, confidence]
    optional_fields: [precedence_rank, consumers, default_declared]
    evidence_bearing_fields: [source]
    vocabularies:
      - field: source
        kind: open
        values: [file, environment, secret-store, orchestrator, build-time-inline, code-default]
    consumption_profiles:
      - consumer: security-discovery
        reads: [key, source, is_secret_reference]
      - consumer: frontend-discovery
        reads: [key, source]
      - consumer: operations-discovery
        reads: [key, source, precedence_rank]
    fixtures:
      normal: One record per configuration key found within the declared scope, each carrying source and a confidence level.
      empty: The declared scope was examined in full and contained no configuration key; completeness is Complete and the record set is empty.
      not_applicable: The system reads no configuration
      partial: Production configuration was out of scope; completeness is Partial and the unexamined boundary is recorded.
      boundary: A key whose precedence cannot be determined is recorded with precedence_rank omitted and evidence state Unknown
  - type: framework.architecture.deployment
    type_version: 1.0.0
    lifecycle: active
    purpose: How components are packaged, released, and placed in target environments
    contract: Repository-local metadata is never presented as a complete production topology
    producer_kind: architecture-discovery
    subject_noun: deployment unit
    required_fields: [unit, packaging, target_environment, declaration_path, evidence_state, confidence]
    optional_fields: [promotion_gate, rollback_mechanism, observability_hook]
    evidence_bearing_fields: [declaration_path]
    vocabularies:
      - field: packaging
        kind: open
        values: [container-image, archive, package, function-bundle, static-site, unknown]
    consumption_profiles:
      - consumer: operations-discovery
        reads: [unit, target_environment, rollback_mechanism]
      - consumer: security-discovery
        reads: [unit, target_environment]
    fixtures:
      normal: One record per deployment unit found within the declared scope, each carrying declaration_path and a confidence level.
      empty: The declared scope was examined in full and contained no deployment unit; completeness is Complete and the record set is empty.
      not_applicable: The repository declares no deployment; the subject is consumed as source
      partial: The infrastructure repository was not in scope; completeness is Partial and the unexamined boundary is recorded.
      boundary: An environment named in a pipeline but defined nowhere in scope is recorded with the definition absent rather than omitted
  - type: framework.architecture.risks
    type_version: 1.0.0
    lifecycle: active
    purpose: Prioritized architectural risks derived from the recorded observations
    contract: Every risk names at least one supporting observation and the reasoning from it
    producer_kind: architecture-discovery
    subject_noun: architecture risk
    required_fields: [risk, cause, impact, supporting_records, likelihood_rationale, evidence_state, confidence]
    optional_fields: [next_verification, reversibility]
    evidence_bearing_fields: [supporting_records]
    derives_from: [framework.architecture.scope, framework.architecture.modules, framework.architecture.dependencies, framework.architecture.layers, framework.architecture.configuration, framework.architecture.build, framework.architecture.deployment]
    fixtures:
      normal: One record per architecture risk found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no architecture risk; completeness is Complete and the record set is empty.
      not_applicable: No observation in the artifact set supports a risk
      partial: Risk assessment covered structural domains only; completeness is Partial and the unexamined boundary is recorded.
      boundary: A generic best practice with no repository observation is not recorded as a risk
  - type: framework.architecture.health
    type_version: 1.0.0
    lifecycle: active
    purpose: Architecture health scores per dimension, with the calculation that produced each
    contract: Every score shows its calculation and the records that fed it; a partial score is reported as a bounded range
    producer_kind: architecture-discovery
    subject_noun: health dimension
    required_fields: [dimension, score, calculation, supporting_records, evidence_state, confidence]
    optional_fields: [bound_low, bound_high, escalation_flag]
    evidence_bearing_fields: [supporting_records]
    vocabularies:
      - field: dimension
        kind: closed
        values: [modularity, boundary-integrity, dependency-hygiene, build-reproducibility, configuration-clarity, deployment-clarity, runtime-operability, integration-governance, documentation-traceability, security-boundary-clarity]
    derives_from: [framework.architecture.modules, framework.architecture.layers, framework.architecture.dependencies, framework.architecture.build, framework.architecture.configuration, framework.architecture.deployment, framework.architecture.runtime, framework.architecture.integrations, framework.architecture.risks]
    fixtures:
      normal: One record per health dimension found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no health dimension; completeness is Complete and the record set is empty.
      not_applicable: No dimension is applicable to the subject
      partial: Four of ten dimensions had no supporting evidence; completeness is Partial and the unexamined boundary is recorded.
      boundary: A dimension scored in the lowest two levels sets escalation_flag regardless of the aggregate
---
# Architecture Artifact Type Declarations

## 1. What This Document Is

*This section is informative.*

Declarations for the fourteen artifact types produced by architecture discovery.

Every record in the front matter of this document is a **declaration**: structured data supplying the values that requirements in [STD-0013](../02-methodology/artifact-type-declaration-standard.md) range over. A declaration states no obligation and can therefore not be violated. Every rule that governs these types is stated once in that standard and is not repeated here.

This document carries no `requirements` key and no normative section, per [STD-0010](../02-methodology/metadata-specification.md) R-16 and [STD-0013](../02-methodology/artifact-type-declaration-standard.md) R-31.

## 2. Declared Types

*This section is informative.*

The table renders the front matter for a human reader. The front matter is authoritative.

| Type | Asserts | Subject counted |
| --- | --- | --- |
| `framework.architecture.scope` | The repository boundary that was examined and what was excluded from it | traversed path |
| `framework.architecture.technology` | The runtimes, ecosystems, frameworks, and tooling the repository declares | declared technology |
| `framework.architecture.build` | How source becomes a deployable artifact and where that process is controlled | build command |
| `framework.architecture.entrypoints` | Where executable behaviour begins, with its invocation context | entry point |
| `framework.architecture.dependencies` | Internal and external coupling with direction and supply-chain surface | dependency edge |
| `framework.architecture.modules` | Cohesive units of code with responsibility evidence and public interfaces | module |
| `framework.architecture.layers` | The layer map, its dependency-direction rules, and the violations of them | layer |
| `framework.architecture.classification` | The architectural style the evidence supports, with the alternatives it does not exclude | classification candidate |
| `framework.architecture.runtime` | The processes, workloads, stores, and queues comprising the running system | runtime component |
| `framework.architecture.integrations` | Boundaries where the system exchanges data or control with something outside it | external integration |
| `framework.architecture.configuration` | Configuration sources, their precedence, and where the secret boundary falls | configuration key |
| `framework.architecture.deployment` | How components are packaged, released, and placed in target environments | deployment unit |
| `framework.architecture.risks` | Prioritized architectural risks derived from the recorded observations | architecture risk |
| `framework.architecture.health` | Architecture health scores per dimension, with the calculation that produced each | health dimension |

14 types. Each is registered in the [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md).

## 3. Related Documents

*This section is informative.*

- [Artifact Type Declaration Standard](../02-methodology/artifact-type-declaration-standard.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md)
