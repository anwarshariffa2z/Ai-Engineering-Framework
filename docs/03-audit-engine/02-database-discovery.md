---
id: AUD-0003
title: Database Discovery Methodology
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Audit Engine
tags: [audit-engine, database, data, discovery, evidence]
related: [01-architecture-discovery.md, 03-frontend-discovery.md, ../02-methodology/glossary.md, ../04-development/data-governance-standard.md, ../07-roadmap/audit-engine-roadmap.md]
---

# Database Discovery Methodology

## 1. Executive Summary

Database Discovery is an evidence-led examination of how a system declares, stores, relates, protects, moves, and retires persistent data. It establishes which data stores exist, what structure they impose, which components hold write authority, how integrity and transactions are enforced, how sensitive data is classified and controlled, and whether the data can be recovered after loss. The result is a traceable data model and control assessment, not an inventory of filenames that resemble schemas.

This playbook is executable by an AI agent on any repository. It is intentionally technology-neutral and applies to relational databases, document stores, key-value stores, wide-column stores, graph databases, search indexes, object storage used as a system of record, embedded databases, and vector stores. The agent discovers the persistence technology and records the evidence before applying a classification. It does not modify data, run destructive or write statements, read production records, or certify durability without recovery evidence. When access, evidence, or scope is inadequate, the correct output is an explicit unknown or escalation.

Data audits fail in a characteristic way: the repository's declared schema is treated as the live schema. Migration files describe intent at the moment they were authored; the deployed database reflects the migrations that were actually applied, plus any manual change nobody recorded. This methodology therefore separates three questions throughout: what the repository declares, what the inspected artifacts demonstrate, and what the live data store is known to contain. Where the audit cannot observe the live store, it says so rather than promoting the declaration to fact.

A second failure is treating structure as governance. A well-normalized schema with foreign keys says nothing about whether personal data is classified, whether retention is enforced, whether credentials are scoped, or whether a restore has ever succeeded. Structure, protection, and recoverability are assessed as separate dimensions.

## 2. Purpose

Provide a repeatable method to produce a data inventory, integrity assessment, and data-control assessment that engineers, data stewards, security reviewers, operators, and subsequent audit playbooks can rely upon. The method converts persistence observations into bounded conclusions with clear confidence, provenance, and limitations, and it supplies the data facts that the [Data Governance Standard](../04-development/data-governance-standard.md) requires a system to hold.

## 3. Objectives

- Identify every declared data store, its role, ownership, and the components authorized to write to it.
- Recover the declared schema, data model, relationships, and integrity constraints from authoritative artifacts.
- Determine how schema change is controlled, ordered, reviewed, and reversed.
- Establish how application code reaches data, where query construction occurs, and where transaction boundaries are drawn.
- Identify sensitive, personal, and regulated data, its classification evidence, and the controls applied to it.
- Assess retention, deletion, lineage, replication, backup, and recovery evidence.
- Surface data risks, smells, unknowns, and review questions early, with evidence a reviewer can challenge.

## 4. Success Criteria

The audit succeeds when every data conclusion cites at least one evidence item; declared schema is never reported as live schema without runtime evidence; the report names all material unknowns, including unmeasurable ones such as production row volume or actual retention behavior; an independent reviewer can navigate from conclusion to repository location; and the output has enough scope, confidence, and version information to be reproduced against the same revision. Success does not require access to a live database. An audit conducted from source alone succeeds when it is explicit that its conclusions describe declared intent.

## 5. Prerequisites

The agent needs read access to the repository tree and the revision being audited. It needs a working directory that does not alter the source tree, tools to enumerate files and search text, and permission to inspect non-secret schema, migration, and configuration metadata. Optional but valuable inputs are read-only catalogue access to a non-production database, migration application history, backup and restore records, data-classification registers, retention policy, ORM-generated schema dumps, query logs, and data-steward interviews.

The agent MUST NOT execute write, schema-altering, or destructive statements; read production records; copy data values into evidence; or expose connection strings, credentials, or secret values. Where a live inspection is authorized, it is read-only, scoped to catalogue and metadata objects, and logged with the command, target environment, and time.

## 6. Inputs

Required inputs are the repository root, immutable revision identifier, audit request and scope, and an output location. Record branch name only as a convenience; commit or content digest is the reproducibility anchor. Optional inputs include schema definition files, migration directories and their application history, ORM or data-mapper model definitions, seed and fixture data, database configuration, connection and pooling settings, infrastructure-as-code declaring managed database services, backup policy, data-classification registers, data-flow or lineage documentation, incident records involving data, and read-only catalogue output. Each input is logged with source, access date, environment, and trust level.

## 7. Expected Outputs

The audit produces a database discovery report, data store inventory, schema inventory, migration and schema-evolution assessment, entity and relationship map, integrity and constraint register, data access layer map, query and index observations, transaction boundary register, data classification register, access control and credential boundary map, retention and lifecycle inventory, lineage and data movement map, durability and recovery assessment, data risk register, evidence ledger, health scorecard, confidence assessment, unresolved-question list, and verification checklist. Outputs identify the audited revision, name the environment each observation came from, and never imply that a live database was inspected when only source artifacts were available.

## 8. Discovery Principles

1. **Evidence before interpretation.** Record observed schema files, migration paths, model declarations, configuration keys, or catalogue output before assigning meaning.
2. **Declared is not deployed.** A schema file, migration, or model class is evidence of intent. Only catalogue output or runtime records are evidence of the live structure.
3. **Least inference.** Prefer the narrowest conclusion supported by the evidence. A column named `email` is a strong classification signal, not proof of what it stores.
4. **Separation of fact and judgment.** Preserve raw observations separately from classifications, risks, and recommendations.
5. **Reproducibility.** Capture revision, paths, environment, commands, timestamps, and tool limitations sufficient for another reviewer to repeat the audit.
6. **Never handle the data itself.** Inspect structure, not records. Record that a column exists and its apparent classification; never copy a value, sample rows, or reproduce a record in evidence.
7. **Negative evidence is bounded.** "No foreign keys found" means none found in the searched scope using the recorded method; it never proves that integrity is unenforced elsewhere, such as in application code or a database trigger.
8. **Traceability over volume.** A dump of every column in a large schema is not an audit trail. Collect the smallest structure inventory that lets a reviewer verify each conclusion.
9. **Time awareness.** Prefer evidence from the audited revision and its contemporaneous migration or catalogue records. Treat undated schema diagrams and stale data dictionaries as supporting context, not authoritative confirmation.
10. **Controlled execution.** If the audit is authorized to query a database, restrict it to read-only catalogue and metadata objects in a non-production environment, and capture the command, target, exit result, and non-sensitive output. Execution proves only the structure observed in that environment at that time.

## 9. Discovery Workflow

### Stage 1 — Data Store Inventory

**Purpose.** Establish which persistent stores the system declares, what role each plays, and which components are authorized to write to them.

**Inputs.** Repository map and technology inventory from [Architecture Discovery](01-architecture-discovery.md), dependency manifests, database drivers and clients, connection configuration, container and orchestration definitions, infrastructure-as-code, and deployment manifests.

**Actions.** Identify each declared store and its engine, version constraint, and hosting model where evidence exists. Distinguish a system of record from a derived store such as a cache, search index, read replica, analytics copy, or vector index. Identify the components that read from and write to each store, and record where multiple components share write authority. Separate stores used by the application from stores used only by tests, local development, or tooling. Record a driver dependency without a corresponding configuration or usage reference as a declared capability, not an active store.

**Evidence Required.** Driver or client declarations, connection configuration keys, infrastructure or orchestration declarations, and the code locations establishing read or write use.

**Expected Deliverables.** Data store inventory with engine, role, system-of-record designation, writing components, environment scope, evidence, and confidence.

**Failure Conditions.** A dependency is reported as a deployed database; caches and search indexes are reported as systems of record; test-only stores are merged into the production inventory; the number of distinct stores cannot be bounded.

**Acceptance Criteria.** Every store has a stated role, at least one declaring artifact, and an explicit statement of which components hold write authority or an Unknown with scope reason.

### Stage 2 — Schema Discovery

**Purpose.** Recover the declared structure of each store from its authoritative artifacts.

**Inputs.** Schema definition files, migration files, ORM or data-mapper model definitions, generated schema dumps, interface definition or serialization schemas, index declarations, and read-only catalogue output where authorized.

**Actions.** Identify the authoritative structural source for each store and state which source was used. Where several sources exist — hand-written schema files, migrations, and ORM models — reconcile them and report divergence as an observation rather than selecting the most convenient. Inventory tables, collections, views, materialized views, enumerated types, and stored routines. For schemaless stores, recover the effective structure from write-path code, validation rules, and serialization schemas, and record that the structure is application-enforced rather than store-enforced. Record generated, deprecated, and unused structures separately from active ones where evidence supports the distinction.

**Evidence Required.** Schema artifact paths, object names, defining declarations, and the reconciliation basis when sources disagree.

**Expected Deliverables.** Schema inventory per store, structural source statement, divergence register, and effective-structure notes for schemaless stores.

**Failure Conditions.** ORM models are reported as the database schema without stating the inference; a schemaless store is reported as having no structure; migrations are read as a schema without applying their ordering; divergence between sources is silently resolved.

**Acceptance Criteria.** Each store has a named structural source, a bounded object inventory, and an explicit statement of whether the structure is enforced by the store or by the application.

### Stage 3 — Migration and Schema Evolution

**Purpose.** Determine how structural change is authored, ordered, applied, reviewed, and reversed.

**Inputs.** Migration directories and tooling configuration, migration application history, CI and deployment pipelines, release scripts, runbooks, and change records.

**Actions.** Identify the migration mechanism and whether it is enforced or optional. Establish ordering, idempotency, and the presence and quality of down or rollback paths. Determine where migrations execute — pipeline stage, application startup, or manual operator action — and who holds the credential that runs them. Identify destructive operations such as column drops, type narrowing, and rewrites, and whether they are separated from application deploys. Detect migrations edited after application, gaps in numbering, and structures created outside the migration mechanism. Compare the declared schema to the migration sequence and report drift.

**Evidence Required.** Migration paths and identifiers, tooling configuration, execution locations in pipelines or startup code, rollback declarations, and application-history evidence where available.

**Expected Deliverables.** Migration mechanism assessment, ordering and reversibility findings, destructive-change register, drift observations, and execution-authority notes.

**Failure Conditions.** The presence of a migration directory is reported as controlled schema change; a rollback file's existence is reported as a tested rollback; manual schema changes are assumed absent because no evidence of them appears in the repository.

**Acceptance Criteria.** The report identifies how schema change reaches each environment, who or what applies it, whether reversal is declared, and which structural changes carry data-loss potential.

### Stage 4 — Data Model, Relationships, and Integrity

**Purpose.** Establish the entities the system stores, how they relate, and where integrity is actually enforced.

**Inputs.** Schema inventory, key and constraint declarations, ORM associations, join and lookup code, validation logic, database triggers and routines, and domain documentation.

**Actions.** Identify entities and their identity strategy, including natural, surrogate, composite, and externally assigned keys. Map relationships with cardinality and record where a relationship is declared with a foreign key, implied by an application-level association only, or represented by an untyped identifier column. Inventory integrity mechanisms: primary keys, unique constraints, foreign keys with their delete and update behavior, check constraints, not-null constraints, defaults, and database-level validation. Record where integrity is enforced solely in application code, in a single service, or not at all. Identify orphan-capable relationships, denormalization, polymorphic references, soft-delete columns, and multi-tenant discriminator columns, and describe the integrity consequence of each.

**Evidence Required.** Constraint declarations with paths, association declarations, referencing column names, validation code locations, and trigger or routine definitions.

**Expected Deliverables.** Entity and relationship map, identity strategy notes, integrity mechanism register, and an enforcement-location statement for each material relationship.

**Failure Conditions.** ORM associations are reported as database constraints; an identifier-suffixed column is asserted to be a foreign key without a declaration; cascade behavior is assumed; multi-tenant isolation is claimed without observing the enforcing predicate.

**Acceptance Criteria.** Each material relationship states its cardinality, its declaring artifact, and where its integrity is enforced, or is recorded as Unknown with a scope reason.

### Stage 5 — Data Access Layer Discovery

**Purpose.** Establish how application code reaches data and whether that path is consistent, bounded, and safe.

**Inputs.** ORM and query-builder usage, repository or data-access modules, raw query strings, stored routine invocations, connection acquisition code, and module boundaries from Architecture Discovery.

**Actions.** Identify the access mechanisms in use and whether one is dominant. Locate where queries are constructed and whether construction is centralized in a data-access boundary or dispersed across transport handlers, business logic, and background jobs. Distinguish parameterized queries from string-interpolated ones and record the location of any dynamic query construction that incorporates external input, without asserting exploitability. Identify connection acquisition, pooling configuration, and connection lifetime handling. Record direct store access that bypasses the primary access layer, including scripts, jobs, administrative tooling, and analytics readers.

**Evidence Required.** Access-layer module paths, query construction locations, parameterization evidence, connection configuration, and bypass locations.

**Expected Deliverables.** Data access layer map, query construction inventory, bypass register, and connection-handling observations.

**Failure Conditions.** ORM use is reported as proof of safe query construction; a single unparameterized query is reported as a confirmed injection vulnerability rather than an evidenced risk requiring security review; background and administrative access paths are omitted.

**Acceptance Criteria.** The report identifies the dominant access path, all evidenced bypasses, and the locations where queries incorporate external input, each with a path reference.

### Stage 6 — Query and Index Analysis

**Purpose.** Assess whether declared access patterns and declared indexes are consistent, without claiming production performance.

**Inputs.** Index declarations, schema inventory, query and filter code, sort and pagination logic, join patterns, reporting or analytics queries, and query logs where supplied.

**Actions.** Inventory declared indexes with their columns, ordering, uniqueness, and partial or filtered conditions. Identify the predicates, joins, sorts, and groupings that appear in code, and compare them to the declared indexes. Record filter columns with no supporting index and indexes with no observed query use as observations, not verdicts. Identify unbounded reads, missing pagination, queries inside loops, wide selections on large entities, and aggregation performed in application code over full-table reads. Record partitioning, sharding, and archival-table strategies where declared.

**Evidence Required.** Index declarations with paths, query or filter code locations, and any supplied execution evidence with its environment and date.

**Expected Deliverables.** Index inventory, access-pattern comparison, unbounded-read observations, and a performance-risk list separated from measured performance.

**Failure Conditions.** Index adequacy is judged without recording the query patterns compared; a query is called slow without execution evidence; source-derived observations are worded as production performance findings.

**Acceptance Criteria.** Every performance observation states whether it derives from declared structure, from code inspection, or from measured execution evidence, and names the environment when measured.

### Stage 7 — Transaction and Consistency Boundaries

**Purpose.** Establish where atomicity is claimed, where it actually holds, and where consistency is eventual or absent.

**Inputs.** Transaction management code, isolation configuration, unit-of-work or session handling, multi-store write paths, message publication code, retry logic, and idempotency mechanisms.

**Actions.** Identify how transactions are opened, committed, and rolled back, and whether management is explicit, framework-implicit, or absent. Record declared isolation levels and where they deviate from the store default. Identify operations that write to more than one store, or to a store and a message broker, within one logical action, and record the consistency mechanism used: distributed transaction, outbox, saga, compensating action, or none. Locate long-running transactions, transactions spanning external calls, nested or ambiguous transaction scopes, and write paths lacking idempotency where retries are possible. Record read-after-write expectations against replicas.

**Evidence Required.** Transaction boundary code locations, isolation declarations, multi-store write paths, and idempotency or deduplication evidence.

**Expected Deliverables.** Transaction boundary register, cross-store consistency findings, isolation observations, and an atomicity-gap list.

**Failure Conditions.** Framework-managed transactions are assumed present without evidence; multi-store writes are reported as atomic; eventual consistency is described as a defect without reference to the system's stated design.

**Acceptance Criteria.** Each multi-store or externally coupled write path states its consistency mechanism or is recorded as an evidenced atomicity gap.

### Stage 8 — Data Classification and Sensitivity

**Purpose.** Identify personal, confidential, regulated, and otherwise sensitive data, and the evidence that governs its handling.

**Inputs.** Schema inventory, column and field names, model annotations, validation rules, classification registers, privacy documentation, seed and fixture data, log statements, and the [Data Governance Standard](../04-development/data-governance-standard.md).

**Actions.** Identify fields that hold or plausibly hold identity, contact, authentication, financial, health, location, biometric, employment, or free-text data that may contain any of these. Record the classification signal used: an explicit register entry, a model annotation, an encryption or hashing declaration, or a naming and context inference. State the signal strength; a naming inference is not a classification decision. Identify secrets, tokens, and credentials stored as data and the protection declared for them. Locate sensitive fields reaching logs, analytics copies, exports, error payloads, fixtures, and evaluation datasets. Record free-text and document fields as unbounded classification risk when their content is not constrained.

**Evidence Required.** Field paths and names, annotation or register entries, protection declarations such as hashing or encryption, and the code locations where sensitive fields are read into other systems.

**Expected Deliverables.** Data classification register with signal type and strength, sensitive-field flow observations, protection-declaration inventory, and an unclassified-field list requiring steward review.

**Failure Conditions.** A classification is asserted from a column name alone without labelling it inferred; a field value is copied into evidence to justify a classification; the absence of a register is reported as the absence of sensitive data.

**Acceptance Criteria.** Every flagged field records its signal, signal strength, declared protection, and the owner who must confirm the classification. No evidence item contains a data value.

### Stage 9 — Access Control and Credential Boundaries

**Purpose.** Establish who and what can reach each store, with what authority, using which credential.

**Inputs.** Database user and role declarations, grant statements, connection configuration, secret references, network and firewall declarations in infrastructure-as-code, application authorization code, and row- or field-level security declarations.

**Actions.** Inventory declared database principals, their privileges, and the components that use them. Identify whether application, migration, administrative, analytics, and background workloads use distinct credentials or share one. Record privilege scope and any principal holding schema-altering or superuser-equivalent authority. Identify credential sourcing: secret manager reference, environment variable, mounted file, or a value committed to source. A credential value found in source control is an immediate escalation; record its location and that it requires rotation, never its value. Record network exposure declarations, encryption-in-transit settings, and store-level encryption-at-rest declarations. Identify row-level security, tenant predicates, and field-level access enforcement, and record where isolation depends solely on application code.

**Evidence Required.** Role and grant declarations, credential reference locations with redaction markers, network and encryption declarations, and isolation-enforcement code paths.

**Expected Deliverables.** Access control map, credential boundary inventory, privilege-separation findings, exposure observations, and an escalation record for any credential found in source.

**Failure Conditions.** A credential value, connection string, or host endpoint is reproduced in the report; shared credentials are not identified as such; encryption is claimed from a configuration key name without its declaration.

**Acceptance Criteria.** Each store states its principals, their privilege scope, the credential source for each, and whether workload separation exists. All credential references are redacted.

### Stage 10 — Data Lifecycle and Retention

**Purpose.** Establish how data is created, corrected, expired, deleted, and archived, and whether declared policy is enforced by a mechanism.

**Inputs.** Retention policy documentation, deletion and anonymization code, scheduled cleanup jobs, soft-delete columns, time-to-live declarations, archival routines, log retention configuration, and data-subject request handling.

**Actions.** For each material entity, identify its declared retention period and the mechanism that enforces it. Distinguish a documented policy from an implemented mechanism; a stated retention period with no scheduled job, time-to-live declaration, or storage lifecycle rule is a policy without enforcement. Identify soft-delete patterns and whether soft-deleted records are ever removed, excluded from queries, or excluded from exports and backups. Trace deletion completeness across derived stores, caches, search indexes, analytics copies, exports, and backups. Identify data-subject correction, deletion, and access request handling where applicable, and record whether it reaches every copy.

**Evidence Required.** Policy statements with source, enforcement mechanism declarations with paths, scheduled job definitions, and the query or filter evidence showing soft-deleted exclusion.

**Expected Deliverables.** Retention inventory with policy and mechanism columns, deletion-completeness findings, soft-delete assessment, and unenforced-policy register.

**Failure Conditions.** A documented retention period is reported as enforced retention; deletion is reported as complete without tracing derived copies; the absence of retention documentation is reported as unlimited retention rather than an unknown.

**Acceptance Criteria.** Each material entity records a retention statement, an enforcement mechanism or explicit absence, and the derived copies that a deletion must also reach.

### Stage 11 — Data Movement and Lineage

**Purpose.** Identify every path by which data leaves, enters, or is copied between stores, and whether provenance survives the journey.

**Inputs.** Import and export code, batch and streaming pipelines, replication and change-data-capture configuration, message publication carrying data payloads, synchronization jobs, reporting extracts, backup destinations, third-party integrations from Architecture Discovery, and seed data.

**Actions.** Map each movement path with source, destination, trigger, direction, transport, transformation, and owning component. Distinguish an internal copy from an external transfer and identify the trust boundary crossed. Record which classification classes travel each path and whether the destination applies equivalent protection. Identify transformations that derive or aggregate data and whether the derived record retains a link to its source version, as the Data Governance Standard requires. Record ingestion of external data, its validation, and its provenance. Identify paths that duplicate sensitive data into environments with weaker controls, including analytics, development, and test fixtures derived from production.

**Evidence Required.** Pipeline and job definitions, replication configuration, export and import code locations, destination declarations, and transformation code paths.

**Expected Deliverables.** Lineage map, data movement register with classification and trust-boundary columns, derived-data provenance findings, and a list of copies in weaker-control environments.

**Failure Conditions.** A copy is omitted because it is operational rather than architectural; an export destination is inferred from a job name; production-derived test data is not identified as a sensitive copy.

**Acceptance Criteria.** Every evidenced movement path names its source, destination, trigger, classification exposure, and the component accountable for it.

### Stage 12 — Durability, Backup, and Recovery

**Purpose.** Establish whether the data can be recovered, and distinguish a configured backup from a demonstrated restore.

**Inputs.** Backup configuration, managed-service durability settings in infrastructure-as-code, snapshot and point-in-time-recovery declarations, replication topology, restore scripts and runbooks, disaster-recovery documentation, retention settings for backups, and incident records involving data loss.

**Actions.** Identify each backup mechanism, its scope, frequency, destination, retention, and encryption declaration. Determine whether recovery objectives are stated and whether a restore procedure exists as an executable path or as prose. Record any evidence of a completed restore test, its date, and its scope; the absence of such evidence is an unknown with material consequence, not a pass. Identify stores with no evidenced backup, particularly derived stores holding data that cannot be regenerated from a system of record. Assess whether replication is being relied upon as a backup, and record that replication propagates deletion and corruption. Identify backup copies of sensitive data and whether their access control and retention match the source.

**Evidence Required.** Backup and snapshot declarations, retention and encryption settings, restore procedure locations, restore test records with dates, and replication topology declarations.

**Expected Deliverables.** Durability assessment per store, recovery capability statement, restore-evidence findings, unbackable or unrecoverable store list, and backup-control observations.

**Failure Conditions.** A managed service is assumed to be backed up; replication is reported as backup; a documented runbook is reported as a proven recovery capability; recovery objectives are inferred from infrastructure settings.

**Acceptance Criteria.** Each store states its backup mechanism or explicit absence, whether a restore has been evidenced, and the date and scope of the most recent evidence.

### Stage 13 — Database Risks

**Purpose.** Convert supported observations into prioritized data risks without confusing risk with defect proof.

**Inputs.** All previous stage deliverables, risk tier, change history if supplied, operational and incident evidence, and stated constraints.

**Actions.** Identify risks involving unenforced integrity, schema and migration drift, destructive migrations coupled to deploys, dispersed or dynamic query construction, shared or over-privileged credentials, unclassified sensitive fields, sensitive data in logs or derived copies, policy without retention enforcement, incomplete deletion across copies, non-atomic multi-store writes, unbounded reads on growing entities, single points of data loss, and unevidenced recovery. State cause, impact, affected evidence, likelihood rationale, confidence, and the next verification step. Rank by potential impact and evidence strength, weighting irreversibility: a risk to data that cannot be reconstructed outranks a comparable risk to regenerable data.

**Evidence Required.** At least one observation supporting the risk and a clear explanation of the reasoning from observation to risk.

**Expected Deliverables.** Data risk register with severity, confidence, owner candidate, reversibility note, and follow-up path.

**Failure Conditions.** Risk claims use generic normalization or indexing preferences without repository evidence; severity is presented as certainty; a query-construction observation is escalated to a confirmed vulnerability without security testing.

**Acceptance Criteria.** A reviewer can challenge or validate each risk from cited evidence, and each risk names the data it endangers and whether that data is recoverable.

### Stage 14 — Evidence Collection

**Purpose.** Normalize, preserve, and quality-check evidence so conclusions remain auditable after the agent session ends.

**Inputs.** Observations, catalogue output, paths, revision data, environment identifiers, documents, interviews, and operational records.

**Actions.** Assign every item an evidence ID, source type, repository location or external reference, environment, observation timestamp, revision, collector, redaction state, and reliability class. Environment is mandatory for any observation not derived from repository source, because a structure observed in one environment is not evidence about another. Link evidence to findings and conclusions. Prefer path plus line range or immutable artifact reference over excerpts. Confirm that no evidence item contains a data value, credential, connection string, or endpoint.

**Evidence Required.** Complete evidence ledger and traceability links for every conclusion.

**Expected Deliverables.** Evidence ledger, provenance map, redaction record, environment attribution record, and unresolved-evidence list.

**Failure Conditions.** Conclusions cite no evidence; evidence lacks revision, source, or environment; sensitive values or record contents are retained.

**Acceptance Criteria.** Each conclusion has evidence, each evidence item has provenance and environment attribution, and redaction does not destroy the ability to understand the claim.

### Stage 15 — Final Verification

**Purpose.** Confirm that the report is internally consistent, complete for scope, and safe to consume.

**Inputs.** All deliverables, evidence ledger, scoring worksheets, unresolved-question list, and required output schema.

**Actions.** Check that IDs are unique, links resolve, all stages have a result or explicit limitation, classifications agree with evidence, scores show calculations, and findings distinguish observation from inference. Confirm that no declared structure has been reported as live structure, and that every live-structure claim names its environment and observation date. Re-run targeted searches for high-impact unknowns, particularly unclassified sensitive fields and stores without evidenced recovery. Verify that no data values, credentials, connection strings, or endpoints remain, and that a human reviewer can reproduce material claims.

**Evidence Required.** Completed verification checklist, report version, validation results, and sign-off or escalation record.

**Expected Deliverables.** Final database discovery package and an explicit statement of audit confidence and limitations.

**Failure Conditions.** Unresolved contradictions, broken evidence links, missing stages, unqualified claims, declared structure presented as deployed, or sensitive-data exposure.

**Acceptance Criteria.** The package is traceable, internally coherent, complete for declared scope, free of data and credential values, and ready for human review or downstream playbooks.

## Data Smells

Treat a smell as a prompt for investigation, not proof of failure. Common smells include identifier columns that reference other entities without a declared constraint; integrity enforced only in one of several writing components; migrations edited after application; schema objects created outside the migration mechanism; a single credential shared by application, migration, and analytics workloads; free-text columns that accumulate unclassified personal data; soft-delete columns whose records are never removed; retention policy documented with no enforcing job; nullable columns that the application always populates; entities without a creation or modification timestamp; derived stores that cannot be rebuilt from a system of record; test fixtures derived from production data; caches holding sensitive fields with no expiry; multi-store writes with no compensating action; unbounded reads on entities that grow with usage; and a backup configuration with no restore evidence. Report the observation, affected data, probable consequence, and evidence confidence.

## Examples

A foreign key declared in a migration, present in catalogue output, and exercised by an observed delete-cascade path supports a **verified** integrity constraint. An ORM association with no corresponding constraint declaration supports only an **observed** application-level relationship, and the integrity conclusion is that referential integrity depends on application correctness. A column named `customer_id` with no declaration and no observed join supports an **inferred** relationship at low confidence. A managed database service with a snapshot setting declared in infrastructure-as-code is **observed** backup configuration; without a restore record, recovery capability is **unknown**, not "adequate." A documented ninety-day retention period with no scheduled deletion job is a policy statement, and the enforcement conclusion is **unknown** pending steward confirmation.

## Health Scoring

Score each dimension from 0 to 5 and retain the evidence and confidence for every score. A score is an assessment, not a substitute for the underlying findings.

| Score | Meaning |
| --- | --- |
| 5 | Clear, evidence-backed data design; structure, protection, and recovery are consistently implemented and operable. |
| 4 | Sound design with minor, bounded inconsistencies and documented controls. |
| 3 | Adequate but material gaps, ambiguity, or manual dependence exist. |
| 2 | Significant integrity, protection, or recoverability risk is evidenced. |
| 1 | Pervasive data-control weakness or control failure is evidenced. |
| 0 | No reliable evidence exists, or the dimension is critically unfit for its stated use. |

Assess schema clarity, integrity enforcement, migration discipline, access-layer consistency, query and index health, transaction correctness, classification coverage, access-control separation, retention and lifecycle control, and recoverability. The overall score is the arithmetic mean only when every dimension has confidence of Medium or High; otherwise report a score range and prominently list low-confidence dimensions. Never average away a critical risk: any dimension scored 0 or 1 requires an escalation. Recoverability and classification coverage are scored independently of structural quality; a well-modelled schema does not raise them.

## Confidence Scoring

Classify conclusions as High, Medium, or Low confidence. High confidence has direct, current, corroborated evidence such as a migration plus catalogue output from the relevant environment. Medium confidence has direct but incomplete evidence, such as a declared schema with no live confirmation. Low confidence rests on indirect indicators, naming conventions, stale data dictionaries, or an unresolved contradiction between sources. Confidence measures evidence quality, not risk severity. A high-severity, low-confidence finding — an unclassified column that may hold personal data, or a store with no evidenced recovery — requires verification rather than dismissal.

## Evidence Standards

Every conclusion must reference observed evidence. Use these evidence states precisely:

| State | Meaning | Permitted language |
| --- | --- | --- |
| Verified | Directly confirmed by authoritative, reproducible evidence such as catalogue output from a named environment or an authorized read-only inspection. | "Verified" |
| Observed | Present in an inspected artifact, but its deployed effect is not independently confirmed. | "Observed" |
| Inferred | Reasoned from one or more observations; assumptions are stated. | "Inferred" |
| Unknown | Evidence is absent, inaccessible, conflicting, or out of scope. | "Unknown" |

Evidence must include ID, source, location, environment, revision or timestamp, collector, and redaction status. Evidence MUST NOT contain record values, credentials, connection strings, host endpoints, or sample data. Structure may be quoted; content may not. Do not promote a declared structure to Verified merely because the declaration is well-formed.

When evidence conflicts, retain both items and describe the conflict rather than selecting an answer by preference. For example, a migration sequence may declare a unique constraint that a generated schema dump from a staging environment does not contain. The appropriate conclusion is that the repository contains conflicting schema evidence, with separate reliability assessments and an explicit statement that the production structure is undetermined. Evidence expires when schema, configuration, ownership, or infrastructure changes; record the freshness limitation and request newer evidence when it affects a material conclusion.

## Reporting Format

Publish a concise executive report plus structured appendices. The executive report contains scope, revision, environments inspected, store inventory summary, classification summary, top risks, health and confidence summaries, and escalation decisions. Appendices contain the schema inventory, migration assessment, entity and relationship map, integrity register, access-layer map, index and query observations, transaction register, classification register, access-control map, retention inventory, lineage map, durability assessment, risk register, evidence ledger, unknowns, and verification checklist. Every finding uses: finding ID, statement, evidence IDs, state, confidence, impact, affected data and components, and recommended next action.

Use neutral language in the report. "The audit observed" describes a source fact; "the audit infers" describes a reasoned interpretation; "the audit could not determine" records an evidence limitation. State the environment for every structural claim about a live store. Recommendations must be framed as actions a named owner can validate, such as classifying an identified column with the data steward, adding an enforcing job to an existing retention policy, separating the migration credential from the application credential, or performing and recording a restore test. They must not prescribe a schema redesign unless the evidence and the decision owner support that conclusion.

## Common Mistakes

Common mistakes are treating the declared schema as the deployed schema; treating ORM models as database constraints; assuming a column name proves its content; reporting a configured backup as a recovery capability; copying record values, connection strings, or credentials into evidence; omitting derived stores, caches, and search indexes from the inventory; reporting deletion as complete without tracing copies; conflating a documented retention policy with an enforced one; treating replication as backup; scanning application code while omitting migration, seed, and administrative paths; judging index adequacy without recording the query patterns compared; and reporting absence of a constraint without recording the searched scope.

## Anti-patterns

Do not write a generic data-modelling critique detached from paths and artifacts. Do not execute write, schema-altering, or destructive statements under any authorization. Do not read, sample, or reproduce records. Do not connect to a production database to satisfy an evidence gap; request the evidence from its owner instead. Do not use a tool's output as evidence without retaining the command, environment, scope, and revision. Do not manufacture entity diagrams implying constraints that no artifact declares. Do not score a dimension solely because the schema follows a normalization convention. Do not turn this playbook into an implementation task, modify the repository, or apply migrations.

## Escalation Rules

Escalate immediately when the audit encounters a credential, connection string, or key committed to source control; personal, regulated, or payment data in an unexpected store, log, fixture, or export; evidence of unauthorized access or data exfiltration; a system of record with no evidenced backup; a destructive migration scheduled without a reversal or data-preservation path; or sensitive data copied into an environment with weaker controls. Escalate to a human owner when data classification, retention enforcement, credential ownership, or recovery capability cannot be determined from authorized sources and materially affects the assessment. Mark the related conclusion Unknown or Low confidence; do not block the entire report unless safe continuation is impossible. A committed credential requires rotation advice in the escalation record and must never have its value reproduced.

## Human Review Checklist

- Confirm the audit scope, revision, environments inspected, exclusions, and access limitations.
- Confirm the data store inventory is complete, including derived stores and analytics copies.
- Review the classification register and confirm or correct every inferred classification.
- Confirm retention policies, their enforcement mechanisms, and deletion completeness across copies.
- Confirm credential ownership, privilege separation, and that any committed credential has been rotated.
- Confirm recovery capability and the date of the most recent successful restore.
- Validate that ownership and stewardship assertions match organizational knowledge.
- Decide whether escalations require security, privacy, data, or operations review.
- Accept, challenge, or request verification for each material finding.

## AI Verification Checklist

- Confirm all fifteen stages contain findings or an explicit Unknown with scope reason.
- Confirm every conclusion cites evidence and uses a valid evidence state.
- Confirm no declared structure is reported as deployed structure, and every live-structure claim names its environment and date.
- Confirm IDs, links, scores, calculations, and report revision are consistent.
- Confirm the evidence ledger contains no record values, credentials, connection strings, or endpoints.
- Confirm every flagged sensitive field records its signal strength and the owner who must confirm it.
- Confirm every store records a backup and recovery state, including explicit absence.
- Confirm inventories distinguish declared, observed, inferred, and unknown facts.

## Repository Health Impact

Database Discovery establishes the data portion of Repository Health. It measures whether the repository communicates a reliable data model, enforced integrity, controlled schema change, bounded and consistent data access, evidenced classification, separated credentials, enforced retention, traceable lineage, and demonstrated recoverability. Its score is an input to broader repository health; it must be combined with architecture, frontend, backend, security, workflow, and runtime-verification playbooks before making a whole-repository fitness decision. Its classification and lineage outputs are prerequisites for the security and permissions playbook, and its integrity and transaction findings are inputs to the business workflow playbook.

## Outputs Generated

1. Database Discovery Report.
2. Data Store Inventory and Schema Inventory.
3. Migration and Schema-Evolution Assessment.
4. Entity and Relationship Map with Integrity Register.
5. Data Access Layer Map, Index Inventory, and Transaction Boundary Register.
6. Data Classification Register and Access Control and Credential Boundary Map.
7. Retention and Lifecycle Inventory and Lineage Map.
8. Durability and Recovery Assessment.
9. Data Risk and Smell Register.
10. Evidence Ledger and Provenance Map.
11. Health Scorecard, Confidence Assessment, Unknowns Register, and Escalation Record.
12. Human Review Checklist and AI Verification Checklist.

## Related Documents

- [Architecture Discovery](01-architecture-discovery.md)
- [Frontend Discovery](03-frontend-discovery.md)
- [Framework Glossary](../02-methodology/glossary.md)
- [Data Governance Standard](../04-development/data-governance-standard.md)
- [Audit Engine Product Specification](../07-roadmap/audit-engine-roadmap.md)
