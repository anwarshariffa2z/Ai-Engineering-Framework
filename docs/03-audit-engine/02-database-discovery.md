---
id: AUD-0003
title: Database Discovery Methodology
version: 2.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Audit Engine
tags: [audit-engine, database, data, discovery, evidence, schema, security]
related: [01-architecture-discovery.md, 03-frontend-discovery.md, 04-backend-discovery.md, 06-security-permissions.md, ../02-methodology/glossary.md, ../04-development/data-governance-standard.md, ../07-roadmap/audit-engine-roadmap.md]
---

# Database Discovery Methodology

## 1. Executive Summary

Database Discovery is an evidence-led examination of how a system declares, stores, relates, protects, moves, and retires persistent data. It establishes which data stores exist, what structure they impose, which components hold write authority, how integrity and transactions are enforced, how sensitive data is classified and controlled, and whether the data can be recovered after loss. The result is a traceable data model and control assessment, not an inventory of files that resemble schemas.

This playbook is executable by an AI agent on any repository. It is repository-agnostic and technology-neutral: the agent discovers the persistence technology from declared evidence before applying any classification, and it never assumes a stack from a directory name. It applies to relational databases, document stores, key-value stores, wide-column stores, graph databases, search indexes, time-series stores, embedded databases, object storage used as a system of record, and vector stores. It applies equally to a repository with one embedded database file and to a repository declaring a dozen managed services across several engines.

The methodology does not modify data, execute write or schema-altering statements, read production records, or certify durability without recovery evidence. When access, evidence, or scope is inadequate, the correct output is an explicit Unknown or an escalation.

Data audits fail in three characteristic ways, and this methodology is structured to prevent each.

The first is treating the declared schema as the live schema. Migration files describe intent at the moment they were authored; the deployed database reflects the migrations actually applied, plus any manual change nobody recorded. Every stage therefore separates what the repository declares, what the inspected artifacts demonstrate, and what a named environment is known to contain.

The second is treating structure as governance. A well-normalized schema with complete foreign keys says nothing about whether personal data is classified, whether retention is enforced by a mechanism, whether credentials are scoped per workload, or whether a restore has ever succeeded. Structure, protection, and recoverability are assessed and scored as independent dimensions.

The third is treating an ORM model as a database constraint. An object-relational mapper declares application intent. Whether that intent reached the database depends on the migration mechanism, on whether the schema was ever synchronized, and on whether another writer bypasses the mapper entirely. The audit records the mapper declaration and the database declaration as separate evidence, and reports divergence rather than resolving it by preference.

## 2. Purpose

Provide a repeatable method to produce a data inventory, integrity assessment, and data-control assessment that engineers, data stewards, security reviewers, operators, and subsequent audit playbooks can rely upon. The method converts persistence observations into bounded conclusions with clear confidence, provenance, and limitations, and it supplies the data facts that the [Data Governance Standard](../04-development/data-governance-standard.md) requires a system to hold.

## 3. Objectives

- Identify every declared data store, its engine, role, ownership, and the components authorized to write to it.
- Recover the declared schema, entities, relationships, and integrity constraints from authoritative artifacts across relational and non-relational engines.
- Determine how schema change is authored, ordered, reviewed, applied, and reversed.
- Establish how application code reaches data, where queries are constructed, and where transaction boundaries are drawn.
- Identify sensitive, personal, and regulated data, its classification evidence, and the controls applied to it.
- Assess indexing, access patterns, retention, lineage, replication, backup, and recovery evidence.
- Produce the fourteen standardized artifacts defined in this playbook so that downstream playbooks and human reviewers consume a stable output shape.
- Surface data risks, smells, unknowns, and review questions early, with evidence a reviewer can challenge.

## 4. Success Criteria

The audit succeeds when every data conclusion cites at least one evidence item; declared structure is never reported as live structure without environment-attributed evidence; every artifact from DB-001 to DB-014 is produced or explicitly marked not applicable with a scope reason; the report names all material unknowns, including unmeasurable ones such as production row volume or actual retention behavior; an independent reviewer can navigate from any conclusion to a repository location; and the output carries enough scope, confidence, and version information to be reproduced against the same revision.

Success does not require access to a live database. An audit conducted from source alone succeeds when it is explicit that its conclusions describe declared intent, and when it says so in the executive summary rather than only in an appendix.

## 5. Prerequisites

The agent needs read access to the repository tree and the revision being audited, a working directory that does not alter the source tree, tools to enumerate files and search text, and permission to inspect non-secret schema, migration, and configuration metadata.

Optional but valuable inputs are read-only catalogue access to a non-production database, migration application history, backup and restore records, data-classification registers, retention policy, mapper-generated schema dumps, query logs, replication topology, and data-steward interviews.

The agent MUST NOT execute write, schema-altering, or destructive statements; read, sample, or reproduce records; connect to a production database to close an evidence gap; or expose connection strings, credentials, host endpoints, or secret values. Where a live inspection is authorized, it MUST be read-only, scoped to catalogue and metadata objects, directed at a non-production environment, and logged with the command, target environment, and time.

## 6. Inputs

Required inputs are the repository root, an immutable revision identifier, the audit request and scope, and an output location. Record branch name only as a convenience; a commit or content digest is the reproducibility anchor.

Optional inputs include schema definition files, migration directories and their application history, ORM and data-mapper model definitions, seed and fixture data, database and connection configuration, pooling settings, infrastructure-as-code declaring managed database services, backup policy, data-classification registers, lineage documentation, incident records involving data, and authorized read-only catalogue output. Each input is logged with source, access date, environment, and trust level.

## 7. Expected Outputs

The audit produces the fourteen standardized artifacts specified in section 14, a database discovery report that summarizes them, an evidence ledger, a confidence assessment, an unresolved-question list, and a completed verification checklist. Outputs identify the audited revision, name the environment each observation came from, and never imply that a live database was inspected when only source artifacts were available.

## 8. Discovery Principles

1. **Evidence before interpretation.** Record observed schema files, migration paths, model declarations, configuration keys, or catalogue output before assigning meaning.
2. **Declared is not deployed.** A schema file, migration, or model class is evidence of intent. Only catalogue output or runtime records are evidence of live structure, and only for the environment observed.
3. **Least inference.** Prefer the narrowest conclusion supported by the evidence. A column named `email` is a strong classification signal, not proof of what it stores.
4. **Separation of fact and judgment.** Preserve raw observations separately from classifications, risks, and recommendations.
5. **Reproducibility.** Capture revision, paths, environment, commands, timestamps, and tool limitations sufficient for another reviewer to repeat the audit.
6. **Never handle the data itself.** Inspect structure, not records. Record that a column exists and its apparent classification; never copy a value, sample rows, or reproduce a record in evidence. Structure may be quoted; content may not.
7. **Negative evidence is bounded.** "No foreign keys found" means none found in the searched scope using the recorded method. It never proves that integrity is unenforced elsewhere, such as in application code, a trigger, or a database not inspected.
8. **Traceability over volume.** A dump of every column in a large schema is not an audit trail. Collect the smallest structure inventory that lets a reviewer verify each conclusion.
9. **Time awareness.** Prefer evidence from the audited revision and its contemporaneous migration or catalogue records. Treat undated schema diagrams and stale data dictionaries as supporting context, not authoritative confirmation.
10. **Engine literacy without engine assumption.** Apply the correct semantics once an engine is evidenced, and never before. Constraint, transaction, and index semantics differ materially between engines; a conclusion correct for one is frequently wrong for another.
11. **Controlled execution.** If authorized to query a database, restrict the query to read-only catalogue and metadata objects in a non-production environment, and capture the command, target, exit result, and non-sensitive output. Execution proves only the structure observed in that environment at that time.

## 9. Supported Technology Coverage

The methodology is technology-neutral by design; the list below records engines and mappers for which detection guidance is provided, not a limit on scope. An engine absent from this list is discovered by the same evidence rules and recorded with its family classification.

### 9.1 Database engines

| Engine | Family | Primary declaration evidence |
| --- | --- | --- |
| PostgreSQL | Relational | Driver or client dependency, connection URL scheme, SQL migration dialect, catalogue references, managed-service declarations in infrastructure-as-code. |
| MySQL | Relational | Driver dependency, connection configuration, engine and charset clauses in schema definitions, container or managed-service declarations. |
| MariaDB | Relational | Driver or client dependency shared with MySQL; distinguish by explicit image, service, or version declaration rather than by driver alone. |
| SQL Server | Relational | Driver dependency, connection string keys, T-SQL dialect in migrations or procedures, schema-qualified object names. |
| SQLite | Relational, embedded | File-path connection target, embedded driver dependency, database file committed or generated, absence of a server declaration. |
| Oracle | Relational | Driver dependency, service-name or TNS-style connection declarations, PL/SQL dialect in procedures and packages, sequence usage. |
| MongoDB | Document | Driver or ODM dependency, connection URI scheme, collection and index declarations, aggregation pipeline usage. |
| DynamoDB | Key-value and wide-column | SDK client usage, table declarations in infrastructure-as-code, partition and sort key definitions, secondary index declarations, capacity or billing-mode settings. |
| Firestore | Document | SDK client usage, collection and document path construction, security-rule files, composite index declarations. |
| Redis | Key-value | Client dependency, connection configuration, key construction and expiry calls, data-structure command usage, persistence configuration. |
| Neo4j | Graph | Driver dependency, connection scheme, graph query language usage, node label and relationship type declarations, constraint declarations. |
| Cassandra | Wide-column | Driver dependency, keyspace and replication declarations, partition and clustering key definitions, consistency-level settings. |
| Supabase | Platform over relational | Platform client dependency, project configuration, generated types, row-level-security policy declarations. Record the platform and the underlying relational engine as distinct facts; platform features such as policy definitions and generated clients are additional evidence, not a different family. |

### 9.2 Object-relational mappers and data-access frameworks

A mapper is not a database. Record the mapper, the engine it targets, and whether the mapper is the authoritative schema source, a consumer of a separately authored schema, or one of several writers. Mapper detection never substitutes for engine detection.

| Mapper | Typical schema authority | Discovery focus |
| --- | --- | --- |
| Prisma | Mapper-authored schema with generated migrations | Schema definition file, generated migration directory, generated client usage, relation declarations, and whether migrations are applied or the schema is pushed directly. |
| Drizzle | Mapper-authored schema in application code | Table and column builders, generated migration artifacts, relation helpers, and whether migration generation is committed or produced on demand. |
| Sequelize | Model-authored with optional migrations | Model definitions, association declarations, migration and seeder directories, and whether schema synchronization is enabled in any environment. |
| TypeORM | Entity-authored with optional migrations | Entity decorators, relation decorators, migration directory, and whether automatic schema synchronization is enabled. |
| Entity Framework | Model-first or database-first with migrations | Context and entity declarations, migration classes and their model snapshot, fluent configuration, and whether the snapshot matches the entity model. |
| Hibernate | Entity-authored, frequently paired with an external migration tool | Entity and relation annotations, mapping configuration, schema-generation setting, and the external migration tool that actually owns the schema. |

Automatic schema synchronization is a material finding wherever it is evidenced. Record which environments enable it, because a mapper that synchronizes structure at startup makes migration history an incomplete record of schema change.

## 10. Database Family Guidance

Family determines which questions are meaningful. Apply the family section only after the engine is evidenced.

### 10.1 Relational databases

Structure is enforced by the store. Expect tables, columns with declared types and nullability, primary and unique keys, foreign keys with declared referential actions, check constraints, views, materialized views, sequences, enumerated types, triggers, stored procedures, and functions.

Discovery priorities are: the authoritative schema source; the completeness of declared constraints; whether referential actions are declared or defaulted; whether business rules live in triggers and procedures where application-only review would miss them; and whether the schema is partitioned. Transaction semantics are meaningful and isolation levels should be recorded. Normalization review applies fully. Absence of foreign keys in a relational store is a material integrity observation, not a stylistic one.

### 10.2 Document databases

Structure is usually application-enforced. Expect collections holding documents whose fields vary across records and over time.

Discovery priorities are: the effective schema recovered from write-path code, validation rules, serialization schemas, and any store-side schema validation; embedded versus referenced relationships and the duplication that embedding implies; array fields that grow without bound; the absence of cross-document atomicity unless a multi-document transaction mechanism is evidenced; and index declarations, which matter more than in relational stores because query planners have less structural information. Record schema drift risk explicitly: older documents may lack fields that newer code assumes, and no store-side constraint prevents this. Normalization review is replaced by an embedding-versus-referencing assessment and a duplication-consistency assessment.

### 10.3 Key-value stores

Structure lives entirely in the key namespace and the value encoding.

Discovery priorities are: key construction patterns and whether they are centralized or dispersed; the value encoding and its versioning strategy; expiry and eviction configuration; persistence configuration, which determines whether the store is durable or a cache; and whether any data in the store is a system of record rather than a regenerable derivative. Record every use of the store as a lock, queue, session store, rate limiter, or cache separately, because the loss consequence differs for each. A key-value store with no evidenced persistence configuration holding session or lock state is a material availability finding. Relationship, normalization, and constraint discovery are recorded as not applicable with a family reason.

### 10.4 Graph databases

Structure is expressed as node labels, relationship types, properties, and optional constraints.

Discovery priorities are: the node label and relationship type inventory; property keys per label and whether they are constrained; uniqueness and existence constraints, which are the primary integrity mechanism; index declarations supporting label and property lookups; traversal depth and unbounded traversal patterns in query code; and whether the graph is a system of record or a projection of a relational source. Referential integrity is largely structural, since relationships cannot dangle, but property-level integrity is typically application-enforced and should be assessed as such.

### 10.5 Time-series databases

Structure is organized around a time dimension, measurement identity, and tag or dimension cardinality. A time-series capability may be a dedicated engine or an extension of a relational store; record which, with evidence.

Discovery priorities are: measurement and series definitions; tag and dimension cardinality, which is the dominant scaling risk; retention and downsampling policy, which is frequently the only retention mechanism a system has; continuous aggregation or rollup declarations; write path and ingestion cadence; and whether the raw series is the system of record or a derivative of an event stream. Retention policy discovery is mandatory here rather than optional, because unbounded retention in a time-series store is a predictable capacity failure. Referential integrity and normalization are recorded as not applicable with a family reason.

## 11. Database Object Discovery Guidance

Discover each object type below where the evidenced engine supports it. Record the object, its declaring artifact, its purpose evidence, and its consumers. Record an object type as not applicable with a family reason where the engine does not support it, and as Unknown where the engine supports it but no evidence was available.

| Object | What to establish | Characteristic finding |
| --- | --- | --- |
| Tables | Name, columns, types, nullability, defaults, owning module, and whether the table is written by more than one component. | Tables with no evidenced writer or reader; tables written by components in unrelated modules. |
| Collections | Name, effective field set, validation rules if any, and the write paths that define structure. | Fields present in code but absent from older documents, with no backfill evidence. |
| Views | Definition, underlying objects, and consumers. | Views depending on objects a migration later altered, with no corresponding view update. |
| Materialized views | Definition, refresh mechanism, refresh cadence, and staleness tolerance. | A materialized view with no evidenced refresh mechanism, served as if current. |
| Stored procedures | Definition, invoking components, and the business rules encoded inside. | Business logic reachable only through the database, invisible to application-level review and untested by application tests. |
| Functions | Definition, determinism, and use in constraints, indexes, or defaults. | Functions used in index or constraint definitions whose change would silently invalidate them. |
| Triggers | Event, timing, target object, and effect, including writes to other tables. | Triggers performing audit or cascade behavior that application code duplicates or contradicts. |
| Constraints | Type, target columns, declared behavior, and enforcement location. | Constraints declared in a mapper but absent from the database, or disabled and never re-enabled. |
| Indexes | Columns, order, uniqueness, partial or filtered conditions, and covering intent. | Redundant indexes with identical leading columns; unique indexes serving as the only integrity mechanism. |
| Sequences | Owning column, increment, cycle behavior, and current allocation authority. | Sequences shared across tables; identity allocation split between sequence and application. |
| Enums | Declared values, storage representation, and the migration path for adding a value. | Enum values duplicated in application code with no synchronization mechanism. |
| Composite keys | Component columns, ordering, and dependent foreign keys. | Composite keys partially referenced by dependent tables; ordering assumptions in queries. |
| Foreign keys | Referenced object, referential actions on delete and update, and deferability. | Referential actions defaulted rather than declared; relationships modelled without any foreign key. |
| Check constraints | Predicate, purpose evidence, and whether application validation duplicates it. | Business rules enforced by a check constraint and separately, differently, in code. |
| Partitioning | Strategy, key, partition inventory, and the mechanism that creates new partitions. | Partition creation performed manually with no scheduled mechanism; partition key absent from common query predicates. |
| Replication | Topology, direction, lag tolerance, and which components read from replicas. | Read-after-write paths served by a replica; replication relied upon as a backup. |
| Caching | Cached entities, invalidation trigger, expiry, and authority of the cached copy. | Caches holding sensitive fields with no expiry; invalidation performed by only one of several writers. |
| Soft deletes | Marker column, query exclusion mechanism, and eventual hard-delete path. | Soft-deleted records excluded in application queries but included in exports, analytics copies, and backups. |
| Audit tables | Populating mechanism, coverage, immutability controls, and retention. | Audit coverage limited to one write path while others bypass it; audit tables mutable by the application credential. |
| History tables | Versioning strategy, current-record identification, and growth control. | History growth unbounded with no archival; ambiguous identification of the current version. |
| Event tables | Producer, consumer, ordering guarantee, delivery semantics, and pruning. | Event tables serving as an outbox with no consumer evidence; unbounded growth with no pruning mechanism. |

## 12. Discovery Workflow

### Stage 1 — Database Technology Detection

**Purpose.** Establish which persistence technologies the system declares, with what role, before any structural analysis begins.

**Inputs.** Repository map and technology inventory from [Architecture Discovery](01-architecture-discovery.md), dependency manifests and lockfiles, driver and client declarations, container and orchestration definitions, infrastructure-as-code, platform configuration, and test harness configuration.

**Actions.** Identify each declared engine and its family, version constraint, and hosting model where evidence exists. Distinguish an engine from a mapper and record both. Distinguish a system of record from a derived store such as a cache, search index, read replica, analytics copy, or vector index. Separate stores used by the application from stores used only by tests, local development, or tooling. Record a driver dependency with no corresponding configuration or usage reference as a declared capability, not an active store. Where a driver is shared by more than one engine, do not select an engine without a distinguishing declaration.

**Evidence Required.** Driver, client, or SDK declarations with paths; service, image, or managed-resource declarations; version constraints; and the code or configuration locations establishing use.

**Deliverables.** DB-001 Database Technology Inventory.

**Failure Conditions.** A dependency is reported as a deployed database; a mapper is reported as an engine; an engine is selected from an ambiguous driver without a distinguishing declaration; test-only stores are merged into the production inventory.

**Acceptance Criteria.** Every store records engine, family, role, hosting evidence, environment scope, and confidence. Every mapper records the engine it targets.

### Stage 2 — Connection Discovery

**Purpose.** Establish how each store is reached, by which components, using which credential and connection posture.

**Inputs.** Connection configuration files, environment variable references, secret references, connection factory and client construction code, pooling configuration, infrastructure network declarations, and platform client initialization.

**Actions.** Inventory every connection target by component and environment, recording the configuration key rather than its value. Identify the credential source for each: secret manager reference, environment variable, mounted file, platform-injected credential, or a value committed to source. A credential or connection string found in source control is an immediate escalation; record its location and that it requires rotation, never its value. Record pool sizing, acquisition timeout, idle and maximum lifetime, and retry behavior. Identify components that construct connections outside the shared connection module. Record transport encryption settings and any evidenced disabling of certificate verification. Distinguish primary from replica targets and record which components read from which.

**Evidence Required.** Configuration key names and paths, connection construction locations, pooling declarations, encryption settings, and redacted credential-reference markers.

**Deliverables.** DB-002 Connection Inventory.

**Failure Conditions.** A connection string, credential, host, or endpoint value is reproduced anywhere in the output; pooling is assumed from framework defaults without a declaration; replica targets are merged with primary targets.

**Acceptance Criteria.** Every store records its connection targets by environment, credential source, pooling posture, and encryption posture, with all values redacted and any committed credential escalated.

### Stage 3 — Schema Discovery

**Purpose.** Recover the declared structure of each store and identify which artifact is authoritative.

**Inputs.** Schema definition files, migration files, mapper model definitions, generated schema dumps and snapshots, serialization and validation schemas, security-rule files, infrastructure table declarations, and authorized catalogue output.

**Actions.** Identify the authoritative structural source for each store and state which source was used and why. Where several sources exist, reconcile them and report divergence as an observation rather than selecting the most convenient. Inventory the object types in section 11 that the evidenced engine supports. For stores whose structure is application-enforced, recover the effective structure from write-path code, validation rules, and serialization schemas, and record that enforcement is application-side. Record generated, deprecated, and superseded structures separately from active ones where evidence supports the distinction. Where automatic schema synchronization is evidenced, record that the deployed structure may derive from the mapper model rather than from migration history.

**Evidence Required.** Schema artifact paths, object names, defining declarations, the reconciliation basis when sources disagree, and the environment for any catalogue-derived structure.

**Deliverables.** DB-003 Schema Catalog.

**Failure Conditions.** Mapper models are reported as database schema without stating the inference; a schemaless store is reported as having no structure; migrations are read as a schema without applying their ordering; divergence between sources is silently resolved.

**Acceptance Criteria.** Each store records a named authoritative source, a bounded object inventory covering every supported object type, and an explicit statement of whether structure is enforced by the store or by the application.

### Stage 4 — Entity Discovery

**Purpose.** Identify the business entities the system persists and connect each to its storage representation and owning component.

**Inputs.** Schema catalog, mapper models, domain modules from Architecture Discovery, serialization schemas, API contracts, and domain documentation.

**Actions.** For each entity, identify its storage objects, identity strategy, owning module, lifecycle states, and the components that create, modify, and delete it. Record entities spanning several storage objects and storage objects serving several entities. Distinguish core business entities from join tables, lookup and reference tables, configuration tables, audit and history tables, event and outbox tables, and framework-managed tables such as migration history or session storage. Record the expected growth characteristic of each entity — bounded, user-proportional, or event-proportional — because growth class determines which findings in later stages are material. Identify entities with no evidenced writer or no evidenced reader.

**Evidence Required.** Storage object mapping, identity declarations, owning module paths, and the code locations establishing create, read, update, and delete access.

**Deliverables.** DB-004 Entity Catalog.

**Failure Conditions.** Storage objects are equated with business entities without evidence; framework-managed tables are reported as domain entities; growth class is asserted without a basis.

**Acceptance Criteria.** Each entity records its storage objects, identity strategy, owning component, access paths, growth class, and classification as domain, join, reference, operational, or framework-managed.

### Stage 5 — Relationship Discovery

**Purpose.** Establish how entities relate and where each relationship is declared.

**Inputs.** Entity catalog, foreign key declarations, mapper association declarations, join and lookup code, embedded document structures, graph relationship declarations, and denormalized reference columns.

**Actions.** Map each relationship with cardinality, direction, and optionality. Record the declaration level: enforced by a database constraint, declared in a mapper only, implied by an untyped identifier column, expressed by document embedding, or expressed by a graph relationship type. Identify self-referencing and hierarchical relationships and their depth handling. Identify polymorphic references, which typically cannot carry a foreign key, and record the integrity consequence. Identify many-to-many relationships and their join representation, including whether the join carries its own attributes. For document stores, record embedded relationships and the duplication they create, together with the update path that must keep copies consistent. For denormalized copies, record the source of truth and the synchronization mechanism.

**Evidence Required.** Constraint declarations, association declarations, join code locations, referencing column names, embedding structures, and synchronization code paths.

**Deliverables.** DB-005 Relationship Matrix.

**Failure Conditions.** Mapper associations are reported as database relationships without qualification; an identifier-suffixed column is asserted to be a relationship without a declaration; embedding is reported as a normalized relationship; cardinality is assumed from a name.

**Acceptance Criteria.** Every material relationship records cardinality, declaration level, enforcement location, and, where duplication exists, the synchronization mechanism or its explicit absence.

### Stage 6 — Constraint Discovery

**Purpose.** Establish which invariants are enforced, where enforcement occurs, and which invariants exist only as convention.

**Inputs.** Schema catalog, primary and unique key declarations, foreign key declarations with referential actions, check constraints, not-null and default declarations, database-side validation rules, triggers, mapper validation, and application validation code.

**Actions.** Inventory every declared constraint with its type, target, and behavior. For each foreign key, record the declared on-delete and on-update action, and record where the action is defaulted rather than declared, since defaults differ by engine. Record disabled, deferred, and not-validated constraints. Identify invariants enforced only in application code, only in one of several writing components, or only by a mapper that other writers bypass. Identify constraints enforced by unique indexes rather than declared constraints. For document and graph stores, record store-side validation and uniqueness or existence constraints where the engine provides them, and record application-side enforcement otherwise. Compare application validation to database constraints and record disagreements, including validation that is stricter in code than in the store.

**Evidence Required.** Constraint declarations with paths, referential action declarations, validation code locations, trigger definitions, and evidence of disabled or unvalidated state.

**Deliverables.** DB-006 Constraint Inventory.

**Failure Conditions.** Mapper validation is counted as a database constraint; referential actions are assumed; a unique index is reported as a unique constraint without noting the difference; disabled constraints are counted as enforced.

**Acceptance Criteria.** Each invariant records its enforcement location, its declared behavior, and whether enforcement is complete across all evidenced write paths.

### Stage 7 — Index Discovery

**Purpose.** Inventory declared indexes and establish their relationship to evidenced access patterns.

**Inputs.** Index declarations in schema, migrations, mapper models, and infrastructure declarations; secondary index definitions for key-value and wide-column stores; graph and document index declarations; and the query patterns discovered in Stage 10.

**Actions.** Inventory each index with its object, columns or fields, ordering, uniqueness, partial or filtered condition, and index type where declared. Identify primary, secondary, composite, covering, full-text, spatial, and vector indexes as the engine supports them. Record indexes created implicitly by primary key, unique, and foreign key declarations, noting that implicit foreign key indexing differs by engine. Identify redundant indexes whose leading columns duplicate another index, and indexes with no evidenced supporting query. Identify write-heavy objects carrying many indexes. For document and wide-column stores, record whether the declared partition, sort, and secondary index structure supports the evidenced query predicates, since these engines constrain query shape more strictly than relational engines. Record index creation strategy in migrations, specifically whether large-table index creation is declared as a blocking or concurrent operation.

**Evidence Required.** Index declarations with paths, implicit index sources, and the query locations compared against each index.

**Deliverables.** DB-007 Index Inventory.

**Failure Conditions.** Index adequacy is judged without recording the query patterns compared; implicit indexes are omitted; an index is called unused on the basis of source inspection alone without recording that limitation.

**Acceptance Criteria.** Each index records its declaration, its supported access pattern or explicit absence of one, and the basis of that comparison.

### Stage 8 — Migration Discovery

**Purpose.** Determine how structural change is authored, ordered, applied, reviewed, and reversed.

**Inputs.** Migration directories and tooling configuration, migration application history, model snapshots, CI and deployment pipelines, release scripts, runbooks, and change records.

**Actions.** Identify the migration mechanism and whether it is enforced or optional. Establish ordering and whether ordering is deterministic across parallel development. Establish idempotency and the presence and quality of reversal paths. Determine where migrations execute — pipeline stage, application startup, or manual operator action — and which credential runs them. Identify destructive operations such as column and table drops, type narrowing, non-nullable additions without defaults, and rewrites, and record whether they are separated from application deploys. Identify long-running operations that lock objects and whether a non-blocking strategy is declared. Detect migrations edited after application, gaps or collisions in ordering, and structures created outside the migration mechanism. Compare the declared schema and any model snapshot to the migration sequence and report drift. Where automatic schema synchronization is evidenced, record that migration history is an incomplete record of structural change.

**Evidence Required.** Migration paths and identifiers, tooling configuration, execution locations in pipelines or startup code, reversal declarations, snapshot comparisons, and application-history evidence where available.

**Deliverables.** DB-008 Migration Assessment.

**Failure Conditions.** The presence of a migration directory is reported as controlled schema change; a reversal file's existence is reported as a tested rollback; manual schema change is assumed absent because the repository contains no evidence of it.

**Acceptance Criteria.** The assessment identifies how schema change reaches each environment, which principal applies it, whether reversal is declared, which changes carry data-loss or locking potential, and whether declared schema and migration history agree.

### Stage 9 — ORM Discovery

**Purpose.** Establish the role each mapper plays, the fidelity between mapper model and database structure, and the behavior the mapper introduces at runtime.

**Inputs.** Mapper configuration and model definitions, generated clients and snapshots, association and cascade declarations, lifecycle hooks, connection and session configuration, and the schema catalog.

**Actions.** Identify each mapper, the stores it targets, and whether it is the authoritative schema source. Compare mapper model declarations to database declarations field by field for material entities, and record divergence in nullability, type, default, uniqueness, and relationship. Record cascade behavior declared in the mapper and compare it to referential actions declared in the database; contradictory cascade declarations are a material integrity finding. Identify lifecycle hooks, soft-delete plugins, multi-tenancy filters, and default query scopes, because each silently changes query and write semantics. Record lazy-loading configuration and the query-amplification pattern it can produce. Identify raw query escape hatches and the components using them. Record whether automatic schema synchronization is enabled in any environment, with the environment named.

**Evidence Required.** Mapper configuration paths, model declarations, cascade and hook declarations, synchronization settings, and raw query locations.

**Deliverables.** Contributions to DB-003, DB-005, DB-006, and DB-010; ORM fidelity findings recorded in DB-012.

**Failure Conditions.** The mapper model is treated as the database schema; cascade declarations are reported as database referential actions; default scopes are ignored when assessing whether deleted or tenant-scoped records are excluded from a query.

**Acceptance Criteria.** Each mapper records its authority, its evidenced divergences from database structure, and the runtime behaviors it introduces.

### Stage 10 — Query Discovery

**Purpose.** Establish how application code reaches data, where queries are constructed, and whether construction is consistent and bounded.

**Inputs.** Mapper and query-builder usage, repository and data-access modules, raw query strings, stored routine invocations, aggregation pipelines, graph traversals, key construction code, and module boundaries from Architecture Discovery.

**Actions.** Identify the access mechanisms in use and whether one is dominant. Locate query construction and record whether it is centralized in a data-access boundary or dispersed across transport handlers, business logic, and background jobs. Distinguish parameterized queries from string-interpolated ones and record every location where a query incorporates external input, without asserting exploitability; those locations are inputs to the security and permissions playbook. Identify unbounded reads, missing pagination, queries inside loops, wide selections on large entities, and aggregation performed in application code over full reads. Identify queries whose predicates have no supporting index from Stage 7. Record direct store access that bypasses the primary access layer, including scripts, scheduled jobs, administrative tooling, and analytics readers.

**Evidence Required.** Access-layer module paths, query construction locations, parameterization evidence, predicate and projection details, and bypass locations.

**Deliverables.** Contributions to DB-007, DB-009, and DB-010.

**Failure Conditions.** Mapper use is reported as proof of safe query construction; an interpolated query is reported as a confirmed vulnerability rather than an evidenced risk requiring security review; background and administrative access paths are omitted.

**Acceptance Criteria.** The output identifies the dominant access path, every evidenced bypass, every location incorporating external input, and every unbounded read on an entity whose growth class is user- or event-proportional.

### Stage 11 — Transaction Discovery

**Purpose.** Establish where atomicity is claimed, where it holds, and where consistency is eventual or absent.

**Inputs.** Transaction management code, isolation configuration, unit-of-work and session handling, multi-store write paths, message publication code, retry logic, idempotency mechanisms, and consistency-level settings for distributed stores.

**Actions.** Identify how transactions are opened, committed, and rolled back, and whether management is explicit, framework-implicit, or absent. Record declared isolation levels and every deviation from the engine default, applying the evidenced engine's semantics rather than a generic model. Identify operations writing to more than one store, or to a store and a message broker, within one logical action, and record the consistency mechanism: distributed transaction, transactional outbox, saga, compensating action, or none. Locate long-running transactions, transactions spanning external network calls, nested or ambiguous scopes, and write paths lacking idempotency where retries are possible. Record lock acquisition patterns and ordering where evidenced, since inconsistent ordering across paths is a deadlock risk. For distributed stores, record read and write consistency levels and whether the application's read-after-write expectations are compatible with them. Record read-after-write paths served by replicas.

**Evidence Required.** Transaction boundary code locations, isolation and consistency-level declarations, multi-store write paths, lock acquisition sites, and idempotency or deduplication evidence.

**Deliverables.** Contributions to DB-010, DB-012, and DB-013.

**Failure Conditions.** Framework-managed transactions are assumed present without evidence; multi-store writes are reported as atomic; document-store multi-document writes are assumed atomic without a transaction mechanism; eventual consistency is described as a defect without reference to the system's stated design.

**Acceptance Criteria.** Each multi-store or externally coupled write path records its consistency mechanism or is recorded as an evidenced atomicity gap, and every isolation or consistency conclusion names the engine semantics applied.

### Stage 12 — Performance Discovery

**Purpose.** Assess structural and access-pattern characteristics that determine performance and scale, without claiming measured production performance.

**Inputs.** Index inventory, query inventory, entity growth classes, partitioning and sharding declarations, replication topology, caching declarations, pooling configuration, and any supplied execution or monitoring evidence with its environment and date.

**Actions.** Compare evidenced query predicates, sorts, joins, and projections to declared indexes and record unsupported access patterns. Identify query amplification patterns, including per-row queries inside iteration and lazy-loaded associations resolved in loops. Identify unbounded result sets and missing pagination on user- or event-proportional entities. Identify wide reads on entities containing large columns or documents. Assess partitioning and sharding strategy against evidenced predicates, and record partition keys absent from common filters. Assess key cardinality for wide-column and time-series stores. Record caching layers, their invalidation triggers, and whether a cache is masking an unsupported access pattern. Record connection pool sizing against evidenced concurrency. Where execution evidence is supplied, record it with environment and date, and keep it separate from source-derived observations.

**Evidence Required.** Index and query comparisons with paths, growth classes, partitioning and cache declarations, pooling configuration, and any measured evidence with environment and date.

**Deliverables.** DB-010 Performance Assessment.

**Failure Conditions.** A query is called slow without execution evidence; source-derived observations are worded as production performance findings; an index is judged sufficient without recording the predicate compared; cache presence is treated as resolution of an unsupported access pattern.

**Acceptance Criteria.** Every performance observation states whether it derives from declared structure, from code inspection, or from measured execution evidence, and names the environment when measured.

### Stage 13 — Security Discovery

**Purpose.** Establish who and what can reach each store, with what authority, and how sensitive data is protected.

**Inputs.** Database principal and role declarations, grant statements, row- and field-level security policies, security-rule files, connection inventory, encryption declarations, network exposure declarations, application authorization code, audit table mechanisms, and the [Data Governance Standard](../04-development/data-governance-standard.md).

**Actions.** Inventory declared database principals, their privileges, and the components using them. Identify whether application, migration, administrative, analytics, and background workloads use distinct credentials or share one, and record any principal holding schema-altering or superuser-equivalent authority. Record encryption in transit and at rest as declared, and any evidenced disabling of verification. Identify row-level security policies, tenant predicates, and field-level access controls, and record where isolation depends solely on application code or on a mapper default scope that a raw query would bypass. Perform PII detection and secret detection as specified in sections 13.10 and 13.11. Identify sensitive fields reaching logs, exports, analytics copies, fixtures, and error payloads. Record audit and history mechanisms, their coverage across write paths, and whether the application credential can modify audit records. Any credential, connection string, or key found in source control is an immediate escalation with a rotation recommendation and no reproduction of the value.

**Evidence Required.** Role and grant declarations, policy declarations, encryption and network declarations, isolation enforcement paths, classification signals with strength, and redacted secret-reference locations.

**Deliverables.** DB-009 Security Assessment.

**Failure Conditions.** A credential, connection string, host, or record value is reproduced; shared credentials are not identified; encryption is claimed from a key name without its declaration; a classification is asserted from a column name without labelling it inferred; absence of a classification register is reported as absence of sensitive data.

**Acceptance Criteria.** Each store records its principals, privilege scope, credential source, isolation enforcement, and encryption posture; every flagged sensitive field records its signal, signal strength, declared protection, and the owner who must confirm it.

### Stage 14 — Data Lifecycle Discovery

**Purpose.** Establish how data is created, corrected, expired, deleted, archived, moved, and recovered.

**Inputs.** Retention policy documentation, deletion and anonymization code, scheduled cleanup jobs, time-to-live and expiry declarations, soft-delete mechanisms, archival routines, partition rotation, downsampling policy, import and export code, replication and change-data-capture configuration, backup configuration, restore procedures and records, and data-subject request handling.

**Actions.** For each material entity, identify its declared retention period and the mechanism enforcing it, and distinguish a documented policy from an implemented mechanism. A stated retention period with no scheduled job, expiry declaration, partition rotation, or storage lifecycle rule is policy without enforcement. Identify soft-delete patterns and whether soft-deleted records are ever hard-deleted, and whether exclusion is applied consistently across queries, exports, analytics copies, and backups. Map every path by which data moves between stores or leaves the system, recording source, destination, trigger, transport, transformation, classification exposure, and trust boundary crossed. Record whether derived data retains a link to its source version. Identify copies of sensitive data in environments with weaker controls, including analytics, development, and fixtures derived from production. Identify each backup mechanism, its scope, frequency, destination, retention, and encryption declaration, and record whether any restore has been evidenced, with date and scope. Record stores with no evidenced backup, particularly derived stores whose contents cannot be regenerated. Record where replication is relied upon as backup, noting that replication propagates deletion and corruption. Identify data-subject correction, deletion, and access handling and whether it reaches every copy.

**Evidence Required.** Policy statements with source, enforcement mechanism declarations with paths, scheduled job definitions, exclusion evidence, movement path declarations, backup and restore declarations, and restore records with dates.

**Deliverables.** DB-011 Data Lifecycle Report.

**Failure Conditions.** A documented retention period is reported as enforced retention; deletion is reported as complete without tracing derived copies; a managed service is assumed to be backed up; replication is reported as backup; a runbook is reported as a proven recovery capability; absence of retention documentation is reported as unlimited retention rather than an unknown.

**Acceptance Criteria.** Each material entity records a retention statement, an enforcement mechanism or explicit absence, and the copies a deletion must reach; each store records its backup mechanism or explicit absence and whether a restore has been evidenced, with date and scope.

### Stage 15 — Evidence Collection

**Purpose.** Normalize, preserve, and quality-check evidence so conclusions remain auditable after the agent session ends.

**Inputs.** Observations from all prior stages, catalogue output, paths, revision data, environment identifiers, documents, interviews, and operational records.

**Actions.** Assign every item an evidence ID, source type, repository location or external reference, environment, observation timestamp, revision, collector, redaction state, and reliability class. Environment attribution is mandatory for any observation not derived from repository source, because structure observed in one environment is not evidence about another. Link every evidence item to the findings and artifacts it supports, and every conclusion to its evidence. Prefer path plus line range or immutable artifact reference over excerpts. Confirm that no evidence item contains a record value, credential, connection string, host endpoint, or sample data.

**Evidence Required.** Complete evidence ledger and traceability links for every conclusion in every artifact.

**Deliverables.** Evidence ledger, provenance map, redaction record, environment attribution record, and unresolved-evidence list.

**Failure Conditions.** Conclusions cite no evidence; evidence lacks revision, source, or environment; sensitive values or record contents are retained; an artifact contains a claim with no ledger entry.

**Acceptance Criteria.** Each conclusion has evidence, each evidence item has provenance and environment attribution, and redaction does not destroy the ability to understand the claim.

### Stage 16 — Final Verification

**Purpose.** Confirm that the output is internally consistent, complete for scope, and safe to consume.

**Inputs.** All artifacts, evidence ledger, scoring worksheets, unresolved-question list, and the required output schema.

**Actions.** Confirm that all fourteen artifacts exist or are explicitly marked not applicable with a scope reason. Check that IDs are unique, links resolve, every stage has a result or an explicit limitation, classifications agree with evidence, scores show their calculation, and findings distinguish observation from inference. Confirm that no declared structure is reported as live structure, and that every live-structure claim names its environment and observation date. Confirm that family-inapplicable analyses are marked with a family reason rather than omitted. Re-run targeted searches for high-impact unknowns, specifically unclassified candidate-sensitive fields, stores without evidenced recovery, and credentials in source. Verify that no data values, credentials, connection strings, or endpoints remain anywhere in the output. Produce the health and confidence scores and the improvement recommendations.

**Evidence Required.** Completed verification checklist, report version, validation results, and sign-off or escalation record.

**Deliverables.** DB-012 Database Health Report, DB-013 Risk Register, DB-014 Improvement Recommendations, and the final database discovery package with an explicit statement of audit confidence and limitations.

**Failure Conditions.** Unresolved contradictions, broken evidence links, missing artifacts without a stated reason, unqualified claims, declared structure presented as deployed, or sensitive-data exposure.

**Acceptance Criteria.** The package is traceable, internally coherent, complete for declared scope, free of data and credential values, and ready for human review or downstream playbooks.

## 13. Cross-Cutting Analyses

These analyses draw on evidence from several stages and are reported within the artifacts named in each subsection. Each records evidence, confidence, and an evidence state.

### 13.1 Database smells

Treat a smell as a prompt for investigation, not proof of failure. Record the observation, affected object, probable consequence, and evidence confidence in DB-012.

Common smells include identifier columns referencing other entities with no declared constraint; integrity enforced in only one of several writing components; migrations edited after application; objects created outside the migration mechanism; automatic schema synchronization enabled in a deployed environment; a single credential shared by application, migration, and analytics workloads; free-text columns accumulating unclassified personal data; soft-delete columns whose records are never removed; retention documented with no enforcing mechanism; nullable columns the application always populates; entities with no creation or modification timestamp; derived stores that cannot be rebuilt from a system of record; fixtures derived from production data; caches holding sensitive fields with no expiry; multi-store writes with no compensating action; unbounded reads on user- or event-proportional entities; wide tables mixing unrelated concerns; columns storing serialized structures that queries then filter on; enumerated values duplicated in application code with no synchronization; partition creation performed manually; and a backup configuration with no restore evidence.

### 13.2 Normalization review

Applies to relational stores. Assess whether repeating groups, partial dependencies, and transitive dependencies are present, and record deliberate denormalization separately from accidental redundancy. Deliberate denormalization is identified by an evidenced synchronization mechanism or a documented performance rationale; without either, redundancy is accidental and carries a consistency risk. Record over-normalization only where evidenced query paths require joins that the schema makes unavoidable and costly. For document stores, replace this analysis with an embedding-versus-referencing assessment: record each embedded structure, whether it is bounded, whether it duplicates data owned elsewhere, and the update path maintaining consistency. Record as not applicable with a family reason for key-value and time-series stores. Report in DB-012.

### 13.3 Naming standards

Establish the dominant convention from evidence rather than from preference, covering object naming, pluralization, casing, key and constraint naming, index naming, and reserved-word usage. Report deviations against the dominant observed convention, and identify names that are actively misleading — a column whose name implies a type or relationship it does not have, or a table whose name no longer matches its evidenced content. Naming findings are low severity unless a name misleads. Report in DB-012.

### 13.4 Migration quality

Assess ordering determinism, reversibility, idempotency, separation of destructive changes from application deploys, locking strategy for large objects, data migrations bundled with structural migrations, environment parity, and whether every structural change reaches the database through the mechanism. Record whether reversal paths are declared, whether any reversal has been evidenced as tested, and whether a migration would lose data on reversal. Report in DB-008.

### 13.5 Referential integrity

Assess whether each evidenced relationship is enforced by the store, by the application, by both consistently, or by neither. Record contradictions between mapper cascade declarations and database referential actions. Record relationships that cannot carry a constraint, such as polymorphic and cross-store references, and the compensating mechanism for each. Report in DB-006 with relationship detail in DB-005.

### 13.6 Orphan detection

Identify structural conditions permitting orphaned records: relationships without constraints, nullable foreign keys with no application guard, delete paths that remove a parent without addressing children, cross-store references with no cleanup mechanism, and soft-deleted parents whose children remain visible. This is a structural analysis: the audit identifies where orphans can occur and specifies the verification query a data steward would run. It does not execute that query, and it does not report an orphan count without authorized read-only evidence. Report in DB-013 with the verification step in DB-014.

### 13.7 Duplicate data detection

Identify structural duplication rather than duplicate rows: the same fact stored in several objects or stores, denormalized copies with no synchronization mechanism, embedded copies of independently owned entities, caches and derived stores holding authoritative-looking data, and overlapping tables serving the same concept. For each, record the source of truth, the synchronization mechanism or its absence, and the divergence consequence. Record the absence of a uniqueness constraint where the entity's identity evidence implies one. Report in DB-012 and DB-013.

### 13.8 Dead tables

Identify storage objects with no evidenced reader, no evidenced writer, or neither, in the audited revision. State the search method and scope, and state that dynamic query construction, external consumers, analytics tools, and administrative access can reference an object without a source reference. A dead-table finding is a candidate for retirement subject to owner confirmation, never a deletion instruction. Record any candidate holding data subject to a retention obligation separately, since retirement there requires a governance decision. Report in DB-012 with the confirmation step in DB-014.

### 13.9 Unused columns

Identify columns with no evidenced reader or writer, columns written but never read, columns superseded by a later column, and columns whose declared type or nullability contradicts evidenced use. Apply the same scope caveats as dead-table detection. Columns holding sensitive data with no evidenced reader are a priority finding, since they carry classification and retention obligations with no offsetting use. Report in DB-012 and, where sensitive, DB-009.

### 13.10 PII detection

Identify fields holding or plausibly holding identity, contact, authentication, financial, health, location, biometric, employment, government-identifier, or free-text data that may contain any of these. For each, record the signal used and its strength: an explicit classification register entry or annotation is a strong signal; an encryption, hashing, or masking declaration is a strong signal; a naming and context inference is a weak signal requiring steward confirmation. Never inspect values to confirm a classification. Record free-text, document, attachment metadata, and unstructured payload fields as unbounded classification risk where content is not constrained. Trace each identified field into logs, exports, analytics copies, fixtures, caches, search indexes, and error payloads. Report in DB-009, with the unconfirmed list carried into DB-014 as steward actions.

### 13.11 Secret detection

Identify credentials, tokens, keys, and connection strings in schema defaults, seed and fixture data, migration files, configuration committed to source, and columns that store secrets as application data. For stored secrets, record the protection declared: encryption, hashing with a named algorithm class, external vault reference, or none. Record plaintext-secret storage as a priority finding. Any credential found in source control is an immediate escalation carrying a rotation recommendation. Under no circumstances is a secret value, partial value, or connection string reproduced in any artifact; record location, type, and redaction only. Report in DB-009 and the escalation record.

### 13.12 Retention policies

For each material entity and each store, record the declared retention period, its source, the enforcing mechanism, and the evidence that the mechanism runs. Distinguish policy, mechanism, and evidence of execution as three separate facts. Record entities with no retention statement as Unknown rather than unlimited. Record retention divergence between a primary store and its derived copies, backups, logs, and exports. For time-series and event stores, record downsampling, partition rotation, and pruning as the retention mechanism where they serve that role. Report in DB-011.

## 14. Framework Artifacts

The audit produces fourteen standardized artifacts. Artifact identifiers use the `DB-NNN` form and belong to the Audit Engine output namespace; they identify audit outputs, not framework documents, and are therefore outside the scope of the [Framework Document ID Standard](../02-methodology/document-id-standard.md), which governs `PREFIX-NNNN` identifiers for repository documents. An audit run MUST NOT register `DB-NNN` identifiers in the [Document Registry](../DOCUMENT_INDEX.md).

Every artifact carries the audited revision, scope statement, environments inspected, generation timestamp, and the evidence IDs supporting each row. Every row carries an evidence state and a confidence level. An artifact that does not apply to the evidenced technology is produced with an explicit not-applicable statement and a family reason; it is never silently omitted.

| Artifact | Content | Primary stages |
| --- | --- | --- |
| DB-001 Database Technology Inventory | Each store with engine, family, version constraint, hosting model, role, system-of-record designation, writing components, environment scope, and each mapper with its target engine and schema authority. | 1, 9 |
| DB-002 Connection Inventory | Connection targets by component and environment, credential source and redaction marker, pooling posture, encryption posture, primary and replica designation, and connections constructed outside the shared module. | 2 |
| DB-003 Schema Catalog | Per store: authoritative structural source, and the inventory of tables, collections, views, materialized views, procedures, functions, triggers, sequences, enums, and their equivalents in non-relational families, with enforcement location. | 3, 9 |
| DB-004 Entity Catalog | Business entities with storage objects, identity strategy, owning module, access paths, growth class, and classification as domain, join, reference, operational, or framework-managed. | 4 |
| DB-005 Relationship Matrix | Relationships with cardinality, direction, optionality, declaration level, enforcement location, and synchronization mechanism where duplication exists. | 5, 9 |
| DB-006 Constraint Inventory | Primary, unique, foreign key, check, not-null, and default declarations with referential actions; validation enforced in application or mapper; disabled and unvalidated constraints; and enforcement completeness across write paths. | 6, 9 |
| DB-007 Index Inventory | Declared and implicit indexes with columns, ordering, uniqueness, partial conditions, and type; supported access pattern or explicit absence; redundancy findings; and creation strategy for large objects. | 7, 10 |
| DB-008 Migration Assessment | Mechanism, ordering determinism, reversibility, idempotency, execution location and principal, destructive and locking operations, drift findings, and synchronization exposure. | 8 |
| DB-009 Security Assessment | Principals and privileges, workload credential separation, isolation enforcement, encryption posture, PII register with signal strength, stored-secret findings, audit mechanism coverage, and escalations. | 13, 10 |
| DB-010 Performance Assessment | Access-pattern to index comparison, amplification patterns, unbounded reads, partitioning and cardinality assessment, caching and invalidation, pooling posture, and any measured evidence with environment and date. | 12, 10, 11 |
| DB-011 Data Lifecycle Report | Retention policy, mechanism, and execution evidence per entity; soft-delete and hard-delete paths; lineage and movement register with classification exposure; backup mechanisms; restore evidence with date and scope; and unrecoverable stores. | 14 |
| DB-012 Database Health Report | Scores for each dimension in section 16 with evidence, confidence, and calculation; smells; normalization or embedding assessment; naming findings; duplication findings; dead tables; unused columns; and ORM fidelity findings. | 16, 13 |
| DB-013 Risk Register | Risks with cause, impact, affected data and components, evidence IDs, likelihood rationale, confidence, reversibility note, owner candidate, and next verification step. | 16, 13 |
| DB-014 Improvement Recommendations | Prioritized actions, each naming the evidence-driven problem, the accountable owner, the verification that would confirm the fix, and the risk of deferral. Recommendations requiring a governance decision are marked as such. | 16 |

## 15. Evidence Standards

Every conclusion must reference observed evidence and carry exactly one evidence state.

| State | Meaning | Permitted language |
| --- | --- | --- |
| Verified | Directly confirmed by authoritative, reproducible evidence such as catalogue output from a named environment or an authorized read-only inspection. | "Verified" |
| Observed | Present in an inspected artifact, but its deployed effect is not independently confirmed. | "Observed" |
| Inferred | Reasoned from one or more observations; assumptions are stated. | "Inferred" |
| Unknown | Evidence is absent, inaccessible, conflicting, or out of scope. | "Unknown" |

Evidence must include ID, source, location, environment, revision or timestamp, collector, and redaction status. Evidence MUST NOT contain record values, credentials, connection strings, host endpoints, or sample data. Structure may be quoted; content may not.

Do not promote a declared structure to Verified merely because the declaration is well-formed or the mapper is strict. Do not record a conclusion as Unknown when the evidence exists but was not sought; Unknown records a bounded limitation, not an unexamined area.

When evidence conflicts, retain both items and describe the conflict rather than selecting an answer by preference. A migration sequence may declare a unique constraint that a staging-environment schema dump does not contain; the correct conclusion is that the repository contains conflicting schema evidence, with separate reliability assessments and an explicit statement that the production structure is undetermined. Evidence expires when schema, configuration, ownership, or infrastructure changes; record the freshness limitation and request newer evidence when it affects a material conclusion.

## 16. Health Scoring Model

Score each dimension from 0 to 5, retaining evidence and confidence for every score. A score is an assessment, not a substitute for the underlying findings.

| Score | Meaning |
| --- | --- |
| 5 | Clear, evidence-backed data design; structure, protection, and recovery are consistently implemented and operable. |
| 4 | Sound design with minor, bounded inconsistencies and documented controls. |
| 3 | Adequate but material gaps, ambiguity, or manual dependence exist. |
| 2 | Significant integrity, protection, or recoverability risk is evidenced. |
| 1 | Pervasive data-control weakness or control failure is evidenced. |
| 0 | No reliable evidence exists, or the dimension is critically unfit for its stated use. |

Score these twelve dimensions: schema clarity, entity and relationship modelling, integrity enforcement, migration discipline, index and access-pattern fit, transaction correctness, query construction consistency, classification coverage, access-control separation, retention and lifecycle control, recoverability, and documentation traceability.

The overall score is the arithmetic mean only when every dimension has confidence of Medium or High; otherwise report a score range and prominently list low-confidence dimensions. Never average away a critical risk: any dimension scored 0 or 1 requires an escalation regardless of the mean.

Recoverability, classification coverage, and access-control separation are scored independently of structural quality. A well-modelled schema does not raise them, and this separation is deliberate: structural elegance is the dimension teams most often optimize and the one least correlated with data loss or disclosure.

## 17. Confidence Scoring Model

Classify every conclusion as High, Medium, or Low confidence.

High confidence has direct, current, corroborated evidence — for example a migration declaration confirmed by catalogue output from the relevant environment, or a constraint confirmed by both schema declaration and an observed enforcement path. Medium confidence has direct but incomplete evidence, such as a declared schema with no live confirmation, or a single reliable source with no corroboration. Low confidence rests on indirect indicators, naming conventions, stale data dictionaries, or an unresolved contradiction between sources.

Confidence measures evidence quality, not risk severity. A high-severity, low-confidence finding — an unclassified column that may hold personal data, or a system of record with no evidenced recovery — requires verification rather than dismissal, and must appear in DB-014 as a verification action rather than being downgraded.

Record the confidence of each artifact as a whole alongside its row-level confidences, because an artifact assembled entirely from Medium-confidence rows supports weaker conclusions than its individual rows suggest.

## 18. Reporting Format

Publish a concise executive report plus the fourteen artifacts as structured appendices.

The executive report contains scope, revision, environments inspected, whether any live database was inspected, store inventory summary, classification summary, top risks, health and confidence summaries, and escalation decisions. It states in its opening whether the audit is source-derived or environment-corroborated, because that single fact bounds every conclusion that follows.

Every finding uses: finding ID, statement, evidence IDs, evidence state, confidence, impact, affected data and components, and recommended next action.

Use neutral language. "The audit observed" describes a source fact; "the audit infers" describes a reasoned interpretation; "the audit could not determine" records an evidence limitation. State the environment for every structural claim about a live store.

Recommendations must be framed as actions a named owner can validate: classifying an identified column with the data steward, adding an enforcing job to an existing retention policy, separating the migration credential from the application credential, declaring an absent referential action, or performing and recording a restore test. They must not prescribe a schema redesign, a normalization change, or a technology migration unless the evidence and the decision owner support that conclusion.

## 19. Examples

A foreign key declared in a migration, present in catalogue output from a named environment, and exercised by an observed delete path supports a **Verified** integrity constraint.

A mapper association with no corresponding constraint declaration supports only an **Observed** application-level relationship; the integrity conclusion is that referential integrity depends on application correctness across every write path, including those that bypass the mapper.

A column named `customer_id` with no declaration and no observed join supports an **Inferred** relationship at Low confidence, carried into DB-014 as a confirmation action.

A managed database service with a snapshot setting declared in infrastructure-as-code is **Observed** backup configuration; with no restore record, recovery capability is **Unknown**, not adequate.

A documented ninety-day retention period with no scheduled deletion job, expiry declaration, or partition rotation is a policy statement; the enforcement conclusion is **Unknown** pending steward confirmation, and the entity is recorded as retaining data beyond its declared period unless a mechanism is produced.

A mapper entity declaring a cascading delete while the database declares no referential action is conflicting evidence: the cascade applies only to deletions performed through the mapper, and the correct conclusion is that deletion behavior differs by write path.

## 20. Common Mistakes

Treating the declared schema as the deployed schema. Treating mapper models as database constraints. Assuming a column name proves its content. Applying one engine's constraint, isolation, or index semantics to another. Reporting a configured backup as a recovery capability. Treating replication as backup. Copying record values, connection strings, or credentials into evidence. Omitting derived stores, caches, and search indexes from the inventory. Reporting deletion as complete without tracing copies. Conflating a documented retention policy with an enforced one. Scanning application code while omitting migration, seed, trigger, procedure, and administrative paths. Judging index adequacy without recording the query patterns compared. Reporting absence of a constraint without recording the searched scope. Omitting a family-inapplicable analysis instead of marking it not applicable with a reason.

## 21. Anti-patterns

Do not write a generic data-modelling critique detached from paths and artifacts. Do not execute write, schema-altering, or destructive statements under any authorization. Do not read, sample, or reproduce records. Do not connect to a production database to close an evidence gap; request the evidence from its owner. Do not use a tool's output as evidence without retaining the command, environment, scope, and revision. Do not manufacture entity diagrams implying constraints that no artifact declares. Do not score a dimension because the schema follows a normalization convention. Do not report orphan or duplicate counts without authorized read-only evidence. Do not recommend dropping an object on the strength of a dead-table finding alone. Do not turn this playbook into an implementation task, modify the repository, or apply migrations.

## 22. Escalation Rules

Escalate immediately when the audit encounters a credential, connection string, or key committed to source control; secrets stored as plaintext application data; personal, regulated, or payment data in an unexpected store, log, fixture, or export; evidence of unauthorized access or data exfiltration; a system of record with no evidenced backup; a destructive migration scheduled with no reversal or data-preservation path; sensitive data copied into an environment with weaker controls; or automatic schema synchronization enabled against a deployed environment.

Escalate to a human owner when data classification, retention enforcement, credential ownership, isolation enforcement, or recovery capability cannot be determined from authorized sources and materially affects the assessment.

Mark the related conclusion Unknown or Low confidence; do not block the entire report unless safe continuation is impossible. A committed credential requires a rotation recommendation in the escalation record and must never have its value, or any portion of it, reproduced.

## 23. Human Review Checklist

- Confirm the audit scope, revision, environments inspected, exclusions, and access limitations.
- Confirm whether the audit was source-derived or environment-corroborated, and accept the resulting bound on its conclusions.
- Confirm the store inventory is complete, including derived stores, caches, search indexes, and analytics copies.
- Review the PII register and confirm or correct every inferred classification.
- Confirm that any credential or secret found in source has been rotated.
- Confirm retention policies, their enforcement mechanisms, and deletion completeness across every copy.
- Confirm credential ownership and workload privilege separation.
- Confirm recovery capability and the date and scope of the most recent successful restore.
- Confirm dead-table and unused-column candidates against external consumers before any retirement decision.
- Validate that ownership and stewardship assertions match organizational knowledge.
- Decide whether escalations require security, privacy, data, or operations review.
- Accept, challenge, or request verification for each material finding.

## 24. AI Verification Checklist

- Confirm all sixteen stages contain findings or an explicit Unknown with a scope reason.
- Confirm all fourteen artifacts exist or carry an explicit not-applicable statement with a family reason.
- Confirm every conclusion cites evidence and uses exactly one valid evidence state.
- Confirm no declared structure is reported as deployed structure, and every live-structure claim names its environment and date.
- Confirm engine-specific semantics were applied only after the engine was evidenced.
- Confirm every mapper claim distinguishes mapper declaration from database declaration.
- Confirm the evidence ledger contains no record values, credentials, connection strings, or endpoints.
- Confirm every flagged sensitive field records its signal strength and the owner who must confirm it.
- Confirm every store records a backup and recovery state, including explicit absence.
- Confirm every entity records a retention statement and an enforcement mechanism or explicit absence.
- Confirm scores show their calculation and that no dimension scored 0 or 1 lacks an escalation.
- Confirm IDs, links, artifact cross-references, and report revision are internally consistent.
- Confirm no `DB-NNN` artifact identifier has been registered in the framework Document Registry.

## 25. Repository Health Impact

Database Discovery establishes the data portion of Repository Health. It measures whether the repository communicates a reliable data model, enforced integrity, controlled schema change, bounded and consistent data access, evidenced classification, separated credentials, enforced retention, traceable lineage, and demonstrated recoverability.

Its score is an input to broader repository health and must be combined with the architecture, frontend, backend, security, workflow, and runtime-verification playbooks before a whole-repository fitness decision is made.

It consumes the repository map, technology inventory, module boundaries, and integration register from [Architecture Discovery](01-architecture-discovery.md). It supplies the classification register, credential boundary map, and isolation-enforcement findings to [Security and Permissions](06-security-permissions.md); the entity catalog and constraint inventory to [Backend Discovery](04-backend-discovery.md); and the integrity, transaction, and lifecycle findings to the business workflow playbook. Its unresolved live-structure questions are the primary input to runtime verification, which is the only playbook that can promote a declared structure to Verified.

## 26. Framework Evolution

This playbook is the second methodology derived from the structure established by [Architecture Discovery](01-architecture-discovery.md), and it extends that structure in four ways that later playbooks should adopt where their domain warrants.

First, technology-family guidance: where a domain spans engines with materially different semantics, the playbook states family-specific questions and requires the family to be evidenced before those questions are applied.

Second, standardized output artifacts: a fixed, identified artifact set makes audit output comparable across repositories and across time, and gives downstream playbooks a stable contract to consume.

Third, cross-cutting analyses separated from workflow stages: analyses drawing on several stages are specified once and mapped to the artifacts that report them, rather than being duplicated across stages.

Fourth, an explicit artifact-identifier namespace held separate from the framework document namespace, so that audit outputs never contend for framework document IDs.

Changes to this playbook follow [Change Management](../06-governance/change-management.md). A change to the artifact set, to an artifact's required content, or to the evidence states is a material change requiring a version increment and a registry update, because downstream playbooks and any future Audit Engine rule set depend on that contract.

## 27. Version Compatibility

This document is version 2.0.0 and supersedes version 1.0.0, which defined fifteen stages and no standardized artifacts. The major increment reflects a changed output contract: consumers written against version 1.0.0 stage names or output shape require updating.

Stage coverage from version 1.0.0 is fully retained. Its combined stages were separated to match the sixteen-stage structure defined here; no discovery activity was removed.

This playbook depends on the [Document Metadata Standard](../02-methodology/document-metadata-standard.md) and the [Framework Document ID Standard](../02-methodology/document-id-standard.md) at version 1.0.0, and on the [Data Governance Standard](../04-development/data-governance-standard.md) at version 1.0.0 for classification and retention terminology. It aligns with [Architecture Discovery](01-architecture-discovery.md) version 1.0.0 for evidence states, confidence levels, and the 0-to-5 health scale; those three models are shared across Audit Engine playbooks and MUST NOT be redefined locally by a future playbook.

Audit output records the playbook version used, so that a finding can be interpreted against the contract in force when it was produced.

## 28. Future Improvements

The following are candidate improvements, recorded for maintainer consideration. None is a commitment, and none is required for this playbook to be used.

- A machine-readable artifact schema for DB-001 through DB-014, enabling deterministic checking by a future Audit Engine and comparison of results across runs.
- Engine-specific evidence appendices covering catalogue objects and default referential and isolation behavior per engine, so that engine semantics are applied from a maintained reference rather than from agent knowledge.
- A shared evidence-ledger schema common to all Audit Engine playbooks, removing per-playbook ledger definitions.
- Calibration examples showing a completed artifact set for a small relational repository and a small document-store repository, following the pattern of the [System Evidence Record Example](../08-examples/system-evidence-record.md).
- A defined interchange point with runtime verification, specifying how a declared structure is promoted from Observed to Verified and what evidence that promotion requires.
- Guidance for repositories declaring no persistence, so that a not-applicable audit result is produced consistently rather than improvised.

## 29. Related Documents

- [Architecture Discovery](01-architecture-discovery.md)
- [Frontend Discovery](03-frontend-discovery.md)
- [Backend Discovery](04-backend-discovery.md)
- [Security and Permissions](06-security-permissions.md)
- [Framework Glossary](../02-methodology/glossary.md)
- [Document Metadata Standard](../02-methodology/document-metadata-standard.md)
- [Framework Document ID Standard](../02-methodology/document-id-standard.md)
- [Data Governance Standard](../04-development/data-governance-standard.md)
- [Change Management](../06-governance/change-management.md)
- [Audit Engine Product Specification](../07-roadmap/audit-engine-roadmap.md)
