---
id: REF-0014
title: Database Artifact Type Declarations
version: 1.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-29
review_cycle: Annual
category: Reference
tags: [artifacts, declarations, database]
related: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md, ../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/02-database-discovery.md]
object_type: Guide
depends_on: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md]
references: [../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/02-database-discovery.md]
meta_model_version: 1.0.0
normativity:
  "1": informative
  "2": informative
  "3": informative
artifact_types:
  - type: framework.database.technology
    type_version: 1.0.0
    lifecycle: active
    purpose: The storage engines and mappers in use, with schema authority
    contract: Each engine names a declaring artifact and its system-of-record designation
    producer_kind: database-discovery
    subject_noun: data engine
    required_fields: [engine, engine_role, declaration_path, evidence_state, confidence]
    optional_fields: [family, version_constraint, hosting, schema_authority]
    evidence_bearing_fields: [declaration_path]
    vocabularies:
      - field: engine_role
        kind: closed
        values: [system-of-record, derived-store, cache, search-index, queue, unknown]
    derives_from: [framework.architecture.technology]
    fixtures:
      normal: One record per data engine found within the declared scope, each carrying declaration_path and a confidence level.
      empty: The declared scope was examined in full and contained no data engine; completeness is Complete and the record set is empty.
      not_applicable: The subject declares no data store
      partial: One workspace was excluded; completeness is Partial and the unexamined boundary is recorded.
      boundary: An in-memory store used only by tests is recorded with engine_role unknown and an audience note
  - type: framework.database.connections
    type_version: 1.0.0
    lifecycle: active
    purpose: Which component connects to which store, in which environment, using which credential source
    contract: Credential sources are recorded by reference and never by value
    producer_kind: database-discovery
    subject_noun: connection target
    required_fields: [component, engine, environment, credential_source, evidence_state, confidence]
    optional_fields: [pooling, encryption_in_transit, replica_role]
    evidence_bearing_fields: [credential_source]
    vocabularies:
      - field: replica_role
        kind: closed
        values: [primary, replica, unknown]
      - field: credential_source
        kind: open
        values: [environment, secret-store, file, inline, unknown]
    derives_from: [framework.database.technology]
    consumption_profiles:
      - consumer: backend-discovery
        reads: [component, engine, environment]
      - consumer: security-discovery
        reads: [credential_source, encryption_in_transit, environment]
    fixtures:
      normal: One record per connection target found within the declared scope, each carrying credential_source and a confidence level.
      empty: The declared scope was examined in full and contained no connection target; completeness is Complete and the record set is empty.
      not_applicable: No component connects to a data store
      partial: Production connection configuration was out of scope; completeness is Partial and the unexamined boundary is recorded.
      boundary: A credential_source of inline is recorded as a finding and escalated; the value is never captured
  - type: framework.database.schema
    type_version: 1.0.0
    lifecycle: active
    purpose: The authoritative structural source per store and the object types it defines
    contract: The artifact authoritative for structure is named per store; no structure is inferred from data
    producer_kind: database-discovery
    subject_noun: schema object
    required_fields: [object, object_type, store, authority_path, evidence_state, confidence]
    optional_fields: [enforcement_location]
    evidence_bearing_fields: [authority_path]
    vocabularies:
      - field: object_type
        kind: open
        values: [table, view, collection, index, type, sequence, function]
      - field: enforcement_location
        kind: closed
        values: [store, mapper, application, none]
    derives_from: [framework.database.technology]
    fixtures:
      normal: One record per schema object found within the declared scope, each carrying authority_path and a confidence level.
      empty: The declared scope was examined in full and contained no schema object; completeness is Complete and the record set is empty.
      not_applicable: The stores in use are schemaless and declare no structure
      partial: One store had no accessible definition; completeness is Partial and the unexamined boundary is recorded.
      boundary: A structure enforced only by an application mapper is recorded with enforcement_location mapper, not store
  - type: framework.database.entities
    type_version: 1.0.0
    lifecycle: active
    purpose: The business entities the system persists and where each lives
    contract: Each entity names a storage object and an identity strategy
    producer_kind: database-discovery
    subject_noun: business entity
    required_fields: [entity, storage_objects, identity_strategy, owning_module, evidence_state, confidence]
    optional_fields: [growth_class, classification, access_paths]
    evidence_bearing_fields: [storage_objects]
    vocabularies:
      - field: identity_strategy
        kind: closed
        values: [natural-key, surrogate-key, composite-key, unknown]
      - field: growth_class
        kind: open
        values: [reference, transactional, append-only, ephemeral]
    derives_from: [framework.database.schema, framework.architecture.modules]
    consumption_profiles:
      - consumer: backend-discovery
        reads: [entity, storage_objects, owning_module]
      - consumer: workflow-discovery
        reads: [entity, identity_strategy]
    fixtures:
      normal: One record per business entity found within the declared scope, each carrying storage_objects and a confidence level.
      empty: The declared scope was examined in full and contained no business entity; completeness is Complete and the record set is empty.
      not_applicable: The system persists no business entity
      partial: Entities in one store were not mapped; completeness is Partial and the unexamined boundary is recorded.
      boundary: An entity spanning two storage objects records both, and its owning_module is the module that writes it
  - type: framework.database.relationships
    type_version: 1.0.0
    lifecycle: active
    purpose: How entities relate, and where the relationship is enforced
    contract: Declaration level and enforcement location are recorded separately
    producer_kind: database-discovery
    subject_noun: entity relationship
    required_fields: [from_entity, to_entity, cardinality, enforcement_location, evidence_state, confidence]
    optional_fields: [optionality, declaration_level, synchronization]
    evidence_bearing_fields: [from_entity]
    vocabularies:
      - field: cardinality
        kind: closed
        values: [one-to-one, one-to-many, many-to-many, unknown]
      - field: enforcement_location
        kind: closed
        values: [store, mapper, application, none]
    derives_from: [framework.database.entities]
    consumption_profiles:
      - consumer: workflow-discovery
        reads: [from_entity, to_entity, cardinality, enforcement_location]
    fixtures:
      normal: One record per entity relationship found within the declared scope, each carrying from_entity and a confidence level.
      empty: The declared scope was examined in full and contained no entity relationship; completeness is Complete and the record set is empty.
      not_applicable: No relationship exists between the recorded entities
      partial: Cross-store relationships were not traced; completeness is Partial and the unexamined boundary is recorded.
      boundary: A relationship implied by naming alone is recorded with evidence state Inferred and enforcement_location none
  - type: framework.database.constraints
    type_version: 1.0.0
    lifecycle: active
    purpose: The structural constraints declared over stored data and where each is enforced
    contract: A disabled constraint is recorded as disabled, not as absent
    producer_kind: database-discovery
    subject_noun: declared constraint
    required_fields: [constraint, constraint_kind, target, enforcement_location, evidence_state, confidence]
    optional_fields: [referential_action, is_enabled]
    evidence_bearing_fields: [target]
    vocabularies:
      - field: constraint_kind
        kind: closed
        values: [primary-key, foreign-key, unique, check, not-null, default]
      - field: enforcement_location
        kind: closed
        values: [store, mapper, application, none]
    derives_from: [framework.database.schema]
    consumption_profiles:
      - consumer: workflow-discovery
        reads: [constraint, constraint_kind, target, enforcement_location]
    fixtures:
      normal: One record per declared constraint found within the declared scope, each carrying target and a confidence level.
      empty: The declared scope was examined in full and contained no declared constraint; completeness is Complete and the record set is empty.
      not_applicable: No constraint is declared over any stored object
      partial: Application-level validation was not traced; completeness is Partial and the unexamined boundary is recorded.
      boundary: A constraint declared and then disabled is recorded once with is_enabled false
  - type: framework.database.indexes
    type_version: 1.0.0
    lifecycle: active
    purpose: Declared and implicit indexes and the access pattern each supports
    contract: An index with no identified access pattern records that absence explicitly
    producer_kind: database-discovery
    subject_noun: index
    required_fields: [index, target, declaration, evidence_state, confidence]
    optional_fields: [supported_access_pattern, redundancy_finding, creation_strategy]
    evidence_bearing_fields: [target]
    vocabularies:
      - field: declaration
        kind: closed
        values: [explicit, implicit, unknown]
    derives_from: [framework.database.schema]
    fixtures:
      normal: One record per index found within the declared scope, each carrying target and a confidence level.
      empty: The declared scope was examined in full and contained no index; completeness is Complete and the record set is empty.
      not_applicable: The stores in use do not support indexes
      partial: Only one store was analysed; completeness is Partial and the unexamined boundary is recorded.
      boundary: An index whose columns are a prefix of another index is recorded with a redundancy_finding rather than removed from the set
  - type: framework.database.migration
    type_version: 1.0.0
    lifecycle: active
    purpose: How schema change is applied, ordered, and reversed
    contract: Reversibility is recorded from the migration content, not from the mechanism default
    producer_kind: database-discovery
    subject_noun: migration
    required_fields: [migration, mechanism, ordering, reversibility, evidence_state, confidence]
    optional_fields: [execution_principal, destructive_operations, locking_operations]
    evidence_bearing_fields: [migration]
    vocabularies:
      - field: ordering
        kind: closed
        values: [deterministic, non-deterministic, unknown]
      - field: reversibility
        kind: closed
        values: [reversible, irreversible, unknown]
    fixtures:
      normal: One record per migration found within the declared scope, each carrying migration and a confidence level.
      empty: The declared scope was examined in full and contained no migration; completeness is Complete and the record set is empty.
      not_applicable: Schema change is not managed by a migration mechanism
      partial: History before a squash point was unavailable; completeness is Partial and the unexamined boundary is recorded.
      boundary: A migration containing a destructive statement is recorded as irreversible even where the mechanism supports rollback
  - type: framework.database.security
    type_version: 1.0.0
    lifecycle: active
    purpose: Principals, privileges, and the data-protection posture of each store
    contract: Privileges are recorded by grant, and no credential value appears
    producer_kind: database-discovery
    subject_noun: store principal
    required_fields: [principal, store, privileges, evidence_state, confidence]
    optional_fields: [workload_separation, encryption_at_rest, classification_register]
    evidence_bearing_fields: [store]
    vocabularies:
      - field: encryption_at_rest
        kind: closed
        values: [declared, absent, unknown]
    derives_from: [framework.database.connections]
    consumption_profiles:
      - consumer: security-discovery
        reads: [principal, store, privileges, encryption_at_rest]
    fixtures:
      normal: One record per store principal found within the declared scope, each carrying store and a confidence level.
      empty: The declared scope was examined in full and contained no store principal; completeness is Complete and the record set is empty.
      not_applicable: No store declares principals or privileges in scope
      partial: Only one store had accessible grants; completeness is Partial and the unexamined boundary is recorded.
      boundary: A single principal used by every workload is recorded with workload_separation false rather than as several principals
  - type: framework.database.performance
    type_version: 1.0.0
    lifecycle: active
    purpose: The relationship between declared access patterns and the indexes supporting them
    contract: No latency or throughput claim is made without measured evidence
    producer_kind: database-discovery
    subject_noun: access pattern
    required_fields: [access_pattern, entity, supporting_index, evidence_state, confidence]
    optional_fields: [amplification_finding, is_unbounded, caching]
    evidence_bearing_fields: [access_pattern]
    derives_from: [framework.database.indexes, framework.database.entities]
    fixtures:
      normal: One record per access pattern found within the declared scope, each carrying access_pattern and a confidence level.
      empty: The declared scope was examined in full and contained no access pattern; completeness is Complete and the record set is empty.
      not_applicable: No access pattern could be identified in scope
      partial: Only read paths were analysed; completeness is Partial and the unexamined boundary is recorded.
      boundary: An access pattern with no supporting index records supporting_index as absent rather than omitting the row
  - type: framework.database.lifecycle
    type_version: 1.0.0
    lifecycle: active
    purpose: Retention, deletion, backup, and restore evidence per entity
    contract: Backup existence and restore demonstration are recorded as separate facts
    producer_kind: database-discovery
    subject_noun: retention rule
    required_fields: [entity, retention_policy, deletion_path, evidence_state, confidence]
    optional_fields: [backup_mechanism, restore_evidence, lineage_register]
    evidence_bearing_fields: [entity]
    vocabularies:
      - field: deletion_path
        kind: open
        values: [hard-delete, soft-delete, archival, none, unknown]
    derives_from: [framework.database.entities]
    consumption_profiles:
      - consumer: operations-discovery
        reads: [entity, backup_mechanism, restore_evidence]
    fixtures:
      normal: One record per retention rule found within the declared scope, each carrying entity and a confidence level.
      empty: The declared scope was examined in full and contained no retention rule; completeness is Complete and the record set is empty.
      not_applicable: No entity is subject to retention in scope
      partial: Backup configuration lives outside the audited repository; completeness is Partial and the unexamined boundary is recorded.
      boundary: A backup mechanism with no restore_evidence records restore_evidence as absent; the two are never merged
  - type: framework.database.health
    type_version: 1.0.0
    lifecycle: active
    purpose: Database health scores per dimension, with the calculation that produced each
    contract: Every score shows its calculation and the records that fed it
    producer_kind: database-discovery
    subject_noun: health dimension
    required_fields: [dimension, score, calculation, supporting_records, evidence_state, confidence]
    optional_fields: [bound_low, bound_high, escalation_flag]
    evidence_bearing_fields: [supporting_records]
    derives_from: [framework.database.schema, framework.database.constraints, framework.database.indexes, framework.database.security, framework.database.lifecycle, framework.database.migration]
    fixtures:
      normal: One record per health dimension found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no health dimension; completeness is Complete and the record set is empty.
      not_applicable: No dimension is applicable to the subject
      partial: Three dimensions had no supporting evidence; completeness is Partial and the unexamined boundary is recorded.
      boundary: A dimension scored in the lowest two levels sets escalation_flag regardless of the aggregate
  - type: framework.database.risks
    type_version: 1.0.0
    lifecycle: active
    purpose: Prioritized data risks derived from the recorded observations
    contract: Every risk names at least one supporting observation and the reasoning from it
    producer_kind: database-discovery
    subject_noun: database risk
    required_fields: [risk, cause, impact, affected_entities, supporting_records, likelihood_rationale, evidence_state, confidence]
    optional_fields: [reversibility, owner_candidate]
    evidence_bearing_fields: [supporting_records]
    derives_from: [framework.database.schema, framework.database.constraints, framework.database.entities, framework.database.security, framework.database.lifecycle, framework.database.performance]
    fixtures:
      normal: One record per database risk found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no database risk; completeness is Complete and the record set is empty.
      not_applicable: No observation in the artifact set supports a risk
      partial: Risk assessment covered structural findings only; completeness is Partial and the unexamined boundary is recorded.
      boundary: A generic best practice with no repository observation is not recorded as a risk
  - type: framework.database.recommendations
    type_version: 1.0.0
    lifecycle: active
    purpose: Prioritized actions, each addressing an evidence-driven problem
    contract: Every action names a source finding and the verification that would confirm resolution
    producer_kind: database-discovery
    subject_noun: recommended action
    required_fields: [action, source_records, problem, verification, evidence_state, confidence]
    optional_fields: [owner_candidate, deferral_risk, priority]
    evidence_bearing_fields: [source_records]
    derives_from: [framework.database.risks, framework.database.health]
    fixtures:
      normal: One record per recommended action found within the declared scope, each carrying source_records and a confidence level.
      empty: The declared scope was examined in full and contained no recommended action; completeness is Complete and the record set is empty.
      not_applicable: No finding warrants an action
      partial: Recommendations cover structural findings only; completeness is Partial and the unexamined boundary is recorded.
      boundary: An action with no source finding is not recorded
---
# Database Artifact Type Declarations

## 1. What This Document Is

*This section is informative.*

Declarations for the fourteen artifact types produced by database discovery.

Every record in the front matter of this document is a **declaration**: structured data supplying the values that requirements in [STD-0013](../02-methodology/artifact-type-declaration-standard.md) range over. A declaration states no obligation and can therefore not be violated. Every rule that governs these types is stated once in that standard and is not repeated here.

This document carries no `requirements` key and no normative section, per [STD-0010](../02-methodology/metadata-specification.md) R-16 and [STD-0013](../02-methodology/artifact-type-declaration-standard.md) R-31.

## 2. Declared Types

*This section is informative.*

The table renders the front matter for a human reader. The front matter is authoritative.

| Type | Asserts | Subject counted |
| --- | --- | --- |
| `framework.database.technology` | The storage engines and mappers in use, with schema authority | data engine |
| `framework.database.connections` | Which component connects to which store, in which environment, using which credential source | connection target |
| `framework.database.schema` | The authoritative structural source per store and the object types it defines | schema object |
| `framework.database.entities` | The business entities the system persists and where each lives | business entity |
| `framework.database.relationships` | How entities relate, and where the relationship is enforced | entity relationship |
| `framework.database.constraints` | The structural constraints declared over stored data and where each is enforced | declared constraint |
| `framework.database.indexes` | Declared and implicit indexes and the access pattern each supports | index |
| `framework.database.migration` | How schema change is applied, ordered, and reversed | migration |
| `framework.database.security` | Principals, privileges, and the data-protection posture of each store | store principal |
| `framework.database.performance` | The relationship between declared access patterns and the indexes supporting them | access pattern |
| `framework.database.lifecycle` | Retention, deletion, backup, and restore evidence per entity | retention rule |
| `framework.database.health` | Database health scores per dimension, with the calculation that produced each | health dimension |
| `framework.database.risks` | Prioritized data risks derived from the recorded observations | database risk |
| `framework.database.recommendations` | Prioritized actions, each addressing an evidence-driven problem | recommended action |

14 types. Each is registered in the [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md).

## 3. Related Documents

*This section is informative.*

- [Artifact Type Declaration Standard](../02-methodology/artifact-type-declaration-standard.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md)
