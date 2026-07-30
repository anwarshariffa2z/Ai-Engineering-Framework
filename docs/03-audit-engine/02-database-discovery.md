---
id: AUD-0003
title: Database Discovery Methodology
version: 3.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-30
review_cycle: Annual
category: Audit Engine
tags: [audit-engine, database, data, discovery, methodology]
related: [01-architecture-discovery.md, 03-frontend-discovery.md, 04-backend-discovery.md, 06-security-permissions.md, ../02-methodology/glossary.md, ../09-capabilities/CAP-0001-repository-audit.md]
object_type: Methodology
layer: 1
depends_on: [../02-methodology/evidence-and-confidence.md, ../02-methodology/artifact-specification.md, ../02-methodology/metadata-specification.md, ../02-methodology/contract-specification.md, ../02-methodology/validation-specification.md, ../04-development/data-governance-standard.md]
references: [01-architecture-discovery.md, 03-frontend-discovery.md, 04-backend-discovery.md, 06-security-permissions.md, ../09-capabilities/CAP-0001-repository-audit.md, ../02-methodology/glossary.md]
meta_model_version: 1.0.0
producer_kinds: [database-discovery]
consumes:
  - type: framework.architecture.scope
    major: 1
    minimum_minor: 0
    requirement: optional
  - type: framework.architecture.technology
    major: 1
    minimum_minor: 0
    requirement: required
    required_for: [framework.database.technology]
  - type: framework.architecture.modules
    major: 1
    minimum_minor: 0
    requirement: required
    required_for: [framework.database.entities]
  - type: framework.architecture.integrations
    major: 1
    minimum_minor: 0
    requirement: optional
normativity:
  "1": informative
  "2": normative
  "3": normative
  "4": normative
  "5": normative
  "6": normative
  "7": normative
  "8": normative
  "9": normative
  "10": normative
  "11": normative
  "12": normative
  "13": normative
  "14": informative
  "15": informative
  "16": informative
---

# Database Discovery Methodology

## 1. Purpose and Scope

*This section is informative.*

Database Discovery is an evidence-led examination of how a system declares, stores, relates, protects, moves, and retires persistent data. It establishes which data stores exist, what structure they impose, which components hold write authority, how integrity and transactions are enforced, how sensitive data is classified and controlled, and whether the data can be recovered after loss.

The methodology is repository-agnostic and technology-neutral. It applies to relational databases, document stores, key-value stores, wide-column stores, graph databases, search indexes, time-series stores, embedded databases, object storage used as a system of record, and vector stores. The engine is discovered from evidence before any classification is applied.

Data audits fail in three characteristic ways, and the workflow is structured to prevent each: treating a declared schema as the live schema; treating structure as governance; and treating an object-relational mapper's declaration as a database constraint.

**This methodology consumes the framework standards and does not restate them.** Evidence states, confidence, scoring, completeness semantics, artifact structure, participant obligations, and validation behaviour are defined by the standards in section 3. Only database-specific process is defined here.

## 2. Capability Declaration

*This section is normative.*

This methodology is a constituent of [CAP-0001 Repository Audit](../09-capabilities/CAP-0001-repository-audit.md). It consumes architecture artifacts and supplies classification, credential-boundary, and isolation findings to security discovery, and entity and constraint findings to backend and workflow discovery.

**Executor type.** Human, agent, or either.

**Safety boundaries.** The executor MUST NOT execute write, schema-altering, or destructive statements; read, sample, or reproduce records; connect to a production database to close an evidence gap; or expose connection strings, credentials, host endpoints, or secret values. Where live inspection is authorized it is read-only, scoped to catalogue and metadata objects, directed at a non-production environment, and logged with command, target environment, and time.

## 3. Standards Consumed

*This section is normative.*

| Standard | What this methodology takes from it |
| --- | --- |
| [STD-0007](../02-methodology/evidence-and-confidence.md) | Evidence states, provenance, evidence quality, confidence model, completeness semantics, promotion and degradation, propagation, scoring principles and scale, conflicting evidence |
| [STD-0008](../02-methodology/artifact-specification.md) | Artifact structure, envelope, record and evidence attachment, artifact type definition and versioning |
| [STD-0010](../02-methodology/metadata-specification.md) | Metadata representation for every declaration made here or carried by its artifacts |
| [STD-0011](../02-methodology/contract-specification.md) | Producer obligations, preconditions, guaranteed outputs, failure mapping, cross-revision consumption |
| [STD-0012](../02-methodology/validation-specification.md) | Conformance evaluation, validation classes, outcomes, reporting |
| [STD-0003](../04-development/data-governance-standard.md) | Classification vocabulary, retention terminology, lineage and logging expectations |

No definition here overrides a standard. Any apparent conflict is a defect in this document.

## 4. Inputs

*This section is normative.*

**Required.** Repository root; immutable revision identifier; audit request and declared scope; output location outside the subject; authorization boundary.

**Optional.** Schema definition files; migration directories and application history; mapper model definitions; seed and fixture data; database and connection configuration; pooling settings; infrastructure-as-code declaring managed database services; backup policy; data-classification registers; lineage documentation; incident records; authorized read-only catalogue output from a non-production environment.

Each input is logged with source, access date, environment, and trust level. Absence of an optional input lowers achievable confidence and does not lower a score, per [STD-0011](../02-methodology/contract-specification.md) R-22.

**Consumed artifact types.** `framework.architecture.scope`, `framework.architecture.technology`, `framework.architecture.modules`, `framework.architecture.integrations`. The dependency is on these types, never on the methodology that produced them.

## 5. Preconditions

*This section is normative.*

Read access to the repository tree at a stable revision; a working location outside the subject; tools to enumerate files and search text; permission to inspect non-secret schema, migration, and configuration metadata; a declared authorization boundary; and a named recipient for escalations.

Where a precondition is unmet the methodology is not invoked and the affected artifact types are recorded unavailable, per [STD-0011](../02-methodology/contract-specification.md) R-16 and R-17.

## 6. Artifact Types Produced

*This section is normative.*

Fourteen artifact types. Their structure conforms to [STD-0008](../02-methodology/artifact-specification.md), and each type definition declares the sixteen sections that standard requires.

| Type | Content |
| --- | --- |
| `framework.database.technology` | Engines with family, version constraint, hosting, role, system-of-record designation, writing components; mappers with target engine and schema authority |
| `framework.database.connections` | Connection targets by component and environment, credential source with redaction marker, pooling and encryption posture, primary and replica designation |
| `framework.database.schema` | Authoritative structural source per store and the inventory of supported object types with enforcement location |
| `framework.database.entities` | Business entities with storage objects, identity strategy, owning module, access paths, growth class, classification |
| `framework.database.relationships` | Relationships with cardinality, direction, optionality, declaration level, enforcement location, synchronization mechanism |
| `framework.database.constraints` | Key, foreign key, check, not-null, and default declarations with referential actions; application and mapper validation; disabled constraints |
| `framework.database.indexes` | Declared and implicit indexes with supported access pattern or explicit absence, redundancy findings, creation strategy |
| `framework.database.migration` | Mechanism, ordering determinism, reversibility, execution location and principal, destructive and locking operations, drift findings |
| `framework.database.security` | Principals and privileges, workload credential separation, isolation enforcement, encryption posture, classification register, stored-secret findings |
| `framework.database.performance` | Access-pattern to index comparison, amplification patterns, unbounded reads, partitioning and cardinality, caching, pooling |
| `framework.database.lifecycle` | Retention policy, mechanism, and execution evidence per entity; deletion paths; lineage register; backup mechanisms; restore evidence |
| `framework.database.health` | Scores per dimension with evidence, confidence, and calculation; smells; normalization or embedding assessment; naming findings |
| `framework.database.risks` | Risks with cause, impact, affected data, evidence, likelihood rationale, confidence, reversibility, owner candidate |
| `framework.database.recommendations` | Prioritized actions naming the evidence-driven problem, accountable owner, confirming verification, and risk of deferral |

## 7. Guaranteed Outputs

*This section is normative.*

This methodology guarantees, for each declared type: that an artifact of that type is emitted; that it conforms to the type at the declared version; that its completeness state is declared; and that its provenance is recorded. It guarantees no finding and no property of the subject, per [STD-0011](../02-methodology/contract-specification.md) R-23 and R-24.

Where a domain is not applicable to the subject — a repository declaring no persistence, or a family for which an analysis is meaningless — the artifact carries `NotApplicable` with a recorded reason. Its meaning is [STD-0007](../02-methodology/evidence-and-confidence.md) section 8's.

## 8. Discovery Principles

*This section is normative.*

Database-specific only. General evidence discipline is STD-0007's.

1. **Declared is not deployed.** A schema file, migration, or model class is evidence of intent. Only catalogue output or runtime records are evidence of live structure, and only for the environment observed.
2. **Never handle the data itself.** Inspect structure, not records. Structure may be quoted; content may not.
3. **Engine literacy without engine assumption.** Apply engine semantics only once the engine is evidenced. Constraint, transaction, and index semantics differ materially between engines.
4. **Least inference.** A column named `email` is a strong classification signal, not proof of what it stores.
5. **Proportional depth.** Explore according to system impact, data sensitivity, and uncertainty.
6. **Controlled execution.** Authorized queries are read-only, scoped to catalogue objects, in a non-production environment, and prove only what was observed there.

## 9. Technology and Family Guidance

*This section is normative.*

Family determines which questions are meaningful and is applied only after the engine is evidenced. An engine absent from this guidance is discovered by the same evidence rules and recorded with its family classification.

### 9.1 Engines

| Engine | Family | Primary declaration evidence |
| --- | --- | --- |
| PostgreSQL | Relational | Driver dependency, connection URL scheme, SQL dialect in migrations, catalogue references, managed-service declarations |
| MySQL | Relational | Driver dependency, connection configuration, engine and charset clauses, container or managed-service declarations |
| MariaDB | Relational | Driver shared with MySQL; distinguish by explicit image, service, or version declaration rather than driver alone |
| SQL Server | Relational | Driver dependency, connection string keys, T-SQL dialect, schema-qualified object names |
| SQLite | Relational, embedded | File-path connection target, embedded driver, database file committed or generated, absence of a server declaration |
| Oracle | Relational | Driver dependency, service-name or TNS-style connection, PL/SQL dialect, sequence usage |
| MongoDB | Document | Driver or ODM dependency, connection URI scheme, collection and index declarations, aggregation pipelines |
| DynamoDB | Key-value and wide-column | SDK usage, table declarations in infrastructure-as-code, partition and sort keys, secondary indexes, capacity settings |
| Firestore | Document | SDK usage, collection and document path construction, security-rule files, composite index declarations |
| Redis | Key-value | Client dependency, connection configuration, key construction and expiry calls, data-structure commands, persistence configuration |
| Neo4j | Graph | Driver dependency, connection scheme, graph query language, node label and relationship type declarations, constraints |
| Cassandra | Wide-column | Driver dependency, keyspace and replication declarations, partition and clustering keys, consistency levels |
| Supabase | Platform over relational | Platform client dependency, project configuration, generated types, row-level-security policies. Record platform and underlying engine as distinct facts |

### 9.2 Mappers

A mapper is not a database. Record the mapper, the engine it targets, and whether it is the authoritative schema source, a consumer of a separately authored schema, or one of several writers. Mapper detection never substitutes for engine detection.

| Mapper | Typical schema authority | Discovery focus |
| --- | --- | --- |
| Prisma | Mapper-authored with generated migrations | Schema file, generated migration directory, client usage, relations, and whether migrations are applied or the schema is pushed |
| Drizzle | Mapper-authored in application code | Table and column builders, generated migration artifacts, relation helpers, whether migration generation is committed |
| Sequelize | Model-authored with optional migrations | Model definitions, associations, migration and seeder directories, whether synchronization is enabled |
| TypeORM | Entity-authored with optional migrations | Entity and relation decorators, migration directory, whether automatic synchronization is enabled |
| Entity Framework | Model-first or database-first with migrations | Context and entity declarations, migration classes and model snapshot, fluent configuration, snapshot agreement |
| Hibernate | Entity-authored, usually with an external migration tool | Entity and relation annotations, mapping configuration, schema-generation setting, the external tool owning the schema |

Automatic schema synchronization is a material finding wherever evidenced. Record which environments enable it: a mapper that synchronizes structure at startup makes migration history an incomplete record of schema change.

### 9.3 Families

**Relational.** Structure is store-enforced. Discovery priorities: authoritative schema source; constraint completeness; declared versus defaulted referential actions; business rules in triggers and procedures; partitioning. Transaction semantics and isolation levels are meaningful. Normalization review applies. Absent foreign keys are a material integrity observation, not a stylistic one.

**Document.** Structure is usually application-enforced. Priorities: effective schema from write-path code, validation rules, and serialization schemas; embedded versus referenced relationships and the duplication embedding implies; unbounded array growth; absence of cross-document atomicity unless a transaction mechanism is evidenced; index declarations. Record schema drift risk explicitly. Normalization review is replaced by an embedding-versus-referencing and duplication-consistency assessment.

**Key-value.** Structure lives in the key namespace and value encoding. Priorities: key construction patterns and whether centralized; value encoding and versioning; expiry and eviction; persistence configuration determining whether the store is durable or a cache; whether any data is a system of record. Record each use as lock, queue, session store, rate limiter, or cache separately. Relationship, normalization, and constraint discovery are recorded not applicable with a family reason.

**Graph.** Priorities: node label and relationship type inventory; property keys per label and their constraints; uniqueness and existence constraints as the primary integrity mechanism; index declarations; traversal depth and unbounded traversal; whether the graph is a system of record or a projection. Referential integrity is largely structural; property-level integrity is application-enforced.

**Time-series.** A time-series capability may be a dedicated engine or an extension of a relational store; record which. Priorities: measurement and series definitions; tag and dimension cardinality as the dominant scaling risk; retention and downsampling policy, frequently the only retention mechanism present; continuous aggregation; ingestion cadence. Retention discovery is mandatory here rather than optional. Referential integrity and normalization are recorded not applicable.

## 10. Object Discovery Guidance

*This section is normative.*

Discover each object type where the evidenced engine supports it. Record the object, its declaring artifact, its purpose evidence, and its consumers. Record not applicable with a family reason where the engine does not support it, and Unknown where it does but no evidence was available.

| Object | What to establish | Characteristic finding |
| --- | --- | --- |
| Tables | Columns, types, nullability, defaults, owning module, multiple writers | Tables with no evidenced writer or reader |
| Collections | Effective field set, validation rules, write paths defining structure | Fields in code absent from older documents with no backfill |
| Views | Definition, underlying objects, consumers | Views depending on objects a migration later altered |
| Materialized views | Definition, refresh mechanism and cadence, staleness tolerance | No evidenced refresh mechanism, served as current |
| Stored procedures | Definition, invoking components, encoded business rules | Logic reachable only through the database, invisible to application review |
| Functions | Definition, determinism, use in constraints, indexes, defaults | Functions whose change silently invalidates an index or constraint |
| Triggers | Event, timing, target, effects including writes elsewhere | Audit or cascade behaviour that application code duplicates or contradicts |
| Constraints | Type, target, declared behaviour, enforcement location | Declared in a mapper but absent from the database; disabled and never re-enabled |
| Indexes | Columns, order, uniqueness, partial conditions, covering intent | Redundant leading columns; unique indexes as the only integrity mechanism |
| Sequences | Owning column, increment, cycle, allocation authority | Sequences shared across tables; allocation split with the application |
| Enums | Declared values, storage representation, migration path for additions | Values duplicated in application code with no synchronization |
| Composite keys | Component columns, ordering, dependent foreign keys | Partial references; ordering assumptions in queries |
| Foreign keys | Referenced object, on-delete and on-update actions, deferability | Actions defaulted rather than declared; relationships with no key at all |
| Check constraints | Predicate, purpose evidence, duplicate application validation | Rules enforced both in a constraint and differently in code |
| Partitioning | Strategy, key, partition inventory, creation mechanism | Manual partition creation; partition key absent from common predicates |
| Replication | Topology, direction, lag tolerance, replica readers | Read-after-write served by a replica; replication relied upon as backup |
| Caching | Cached entities, invalidation trigger, expiry, authority | Sensitive fields with no expiry; invalidation by only one of several writers |
| Soft deletes | Marker column, query exclusion, eventual hard-delete path | Excluded in queries but present in exports, analytics, and backups |
| Audit tables | Populating mechanism, coverage, immutability, retention | Coverage limited to one write path; audit rows mutable by the application credential |
| History tables | Versioning strategy, current-record identification, growth control | Unbounded growth with no archival; ambiguous current version |
| Event tables | Producer, consumer, ordering, delivery semantics, pruning | Outbox with no consumer evidence; unbounded growth with no pruning |

## 11. Discovery Workflow

*This section is normative.*

Sixteen stages. Each declares purpose, inputs, actions, required evidence, deliverables, failure conditions, and acceptance criteria. Every conclusion carries an evidence state and confidence per [STD-0007](../02-methodology/evidence-and-confidence.md).

### Stage 1 — Database Technology Detection

**Purpose.** Establish which persistence technologies the system declares, with what role, before structural analysis begins.

**Inputs.** Architecture technology and scope artifacts, dependency manifests and lockfiles, driver and client declarations, container and orchestration definitions, infrastructure-as-code, platform configuration, test harness configuration.

**Actions.** Identify each declared engine, family, version constraint, and hosting model. Distinguish engine from mapper and record both. Distinguish a system of record from a derived store such as a cache, search index, read replica, analytics copy, or vector index. Separate application stores from test-only and tooling stores. Record a driver dependency with no configuration or usage reference as a declared capability, not an active store. Where a driver is shared by several engines, do not select one without a distinguishing declaration.

**Evidence Required.** Driver, client, or SDK declarations with paths; service, image, or managed-resource declarations; version constraints; code or configuration establishing use.

**Deliverables.** `framework.database.technology`.

**Failure Conditions.** A dependency reported as a deployed database; a mapper reported as an engine; an engine selected from an ambiguous driver; test-only stores merged into the production inventory.

**Acceptance Criteria.** Every store records engine, family, role, hosting evidence, environment scope, and confidence. Every mapper records its target engine.

### Stage 2 — Connection Discovery

**Purpose.** Establish how each store is reached, by which components, using which credential and connection posture.

**Inputs.** Connection configuration, environment variable and secret references, connection factory and client construction code, pooling configuration, infrastructure network declarations.

**Actions.** Inventory connection targets by component and environment, recording the configuration key rather than its value. Identify the credential source for each. A credential or connection string in source control is an immediate escalation: record location and rotation requirement, never the value. Record pool sizing, acquisition timeout, idle and maximum lifetime, retry behaviour. Identify connections constructed outside the shared module. Record transport encryption and any evidenced disabling of certificate verification. Distinguish primary from replica targets and which components read from which.

**Evidence Required.** Configuration key names and paths, connection construction locations, pooling and encryption declarations, redacted credential markers.

**Deliverables.** `framework.database.connections`.

**Failure Conditions.** A connection string, credential, host, or endpoint value reproduced anywhere; pooling assumed from framework defaults; replica targets merged with primary.

**Acceptance Criteria.** Every store records connection targets by environment, credential source, pooling and encryption posture, all values redacted, with any committed credential escalated.

### Stage 3 — Schema Discovery

**Purpose.** Recover the declared structure of each store and identify which artifact is authoritative.

**Inputs.** Schema definition files, migrations, mapper models, generated dumps and snapshots, serialization and validation schemas, security-rule files, infrastructure table declarations, authorized catalogue output.

**Actions.** Identify the authoritative structural source per store and state which was used and why. Where several exist, reconcile and report divergence rather than selecting the convenient one. Inventory the object types in section 10 that the evidenced engine supports. For application-enforced stores, recover the effective structure from write-path code, validation rules, and serialization schemas, and record that enforcement is application-side. Record generated, deprecated, and superseded structures separately. Where automatic synchronization is evidenced, record that deployed structure may derive from the mapper rather than migration history.

**Evidence Required.** Schema artifact paths, object names, defining declarations, reconciliation basis, environment for catalogue-derived structure.

**Deliverables.** `framework.database.schema`.

**Failure Conditions.** Mapper models reported as database schema without stating the inference; a schemaless store reported as having no structure; migrations read without applying ordering; divergence silently resolved.

**Acceptance Criteria.** Each store records a named authoritative source, a bounded object inventory, and whether structure is store-enforced or application-enforced.

### Stage 4 — Entity Discovery

**Purpose.** Identify the business entities persisted and connect each to its storage representation and owning component.

**Inputs.** Schema artifact, mapper models, domain modules from architecture discovery, serialization schemas, API contracts, domain documentation.

**Actions.** For each entity identify storage objects, identity strategy, owning module, lifecycle states, and the components that create, modify, and delete it. Record entities spanning several objects and objects serving several entities. Distinguish core business entities from join tables, reference tables, configuration tables, audit and history tables, event and outbox tables, and framework-managed tables. Record the expected growth characteristic — bounded, user-proportional, or event-proportional — because growth class determines which later findings are material. Identify entities with no evidenced writer or reader.

**Evidence Required.** Storage object mapping, identity declarations, owning module paths, code locations establishing access.

**Deliverables.** `framework.database.entities`.

**Failure Conditions.** Storage objects equated with entities without evidence; framework-managed tables reported as domain entities; growth class asserted without basis.

**Acceptance Criteria.** Each entity records storage objects, identity strategy, owning component, access paths, growth class, and classification.

### Stage 5 — Relationship Discovery

**Purpose.** Establish how entities relate and where each relationship is declared.

**Inputs.** Entity artifact, foreign key declarations, mapper associations, join and lookup code, embedded document structures, graph relationship declarations, denormalized reference columns.

**Actions.** Map each relationship with cardinality, direction, and optionality. Record the declaration level: store-enforced constraint, mapper-only declaration, untyped identifier column, document embedding, or graph relationship type. Identify self-referencing and hierarchical relationships and their depth handling. Identify polymorphic references, which typically cannot carry a foreign key, and record the integrity consequence. Identify many-to-many relationships and whether the join carries attributes. For document stores record embedded relationships and the duplication they create with the update path maintaining consistency. For denormalized copies record the source of truth and synchronization mechanism.

**Evidence Required.** Constraint and association declarations, join code locations, referencing column names, embedding structures, synchronization code paths.

**Deliverables.** `framework.database.relationships`.

**Failure Conditions.** Mapper associations reported as database relationships without qualification; an identifier-suffixed column asserted to be a relationship; embedding reported as a normalized relationship; cardinality assumed from a name.

**Acceptance Criteria.** Every material relationship records cardinality, declaration level, enforcement location, and where duplication exists the synchronization mechanism or its explicit absence.

### Stage 6 — Constraint Discovery

**Purpose.** Establish which invariants are enforced, where, and which exist only as convention.

**Inputs.** Schema artifact, key declarations, foreign keys with referential actions, check constraints, not-null and default declarations, store-side validation, triggers, mapper validation, application validation.

**Actions.** Inventory every declared constraint with type, target, and behaviour. For each foreign key record declared on-delete and on-update actions and where the action is defaulted rather than declared, since defaults differ by engine. Record disabled, deferred, and not-validated constraints. Identify invariants enforced only in application code, in one of several writing components, or by a mapper other writers bypass. Identify constraints enforced by unique indexes rather than declared constraints. For document and graph stores record store-side validation and uniqueness or existence constraints where provided. Compare application validation to database constraints and record disagreements, including validation stricter in code than in the store.

**Evidence Required.** Constraint declarations with paths, referential action declarations, validation code locations, trigger definitions, evidence of disabled or unvalidated state.

**Deliverables.** `framework.database.constraints`.

**Failure Conditions.** Mapper validation counted as a database constraint; referential actions assumed; a unique index reported as a unique constraint without noting the difference; disabled constraints counted as enforced.

**Acceptance Criteria.** Each invariant records enforcement location, declared behaviour, and whether enforcement is complete across all evidenced write paths.

### Stage 7 — Index Discovery

**Purpose.** Inventory declared indexes and establish their relationship to evidenced access patterns.

**Inputs.** Index declarations in schema, migrations, mapper models, and infrastructure; secondary index definitions for key-value and wide-column stores; graph and document index declarations; query patterns from Stage 10.

**Actions.** Inventory each index with object, columns or fields, ordering, uniqueness, partial condition, and type. Identify primary, secondary, composite, covering, full-text, spatial, and vector indexes as the engine supports. Record indexes created implicitly by key declarations, noting that implicit foreign key indexing differs by engine. Identify redundant indexes duplicating another's leading columns, and indexes with no evidenced supporting query. Identify write-heavy objects carrying many indexes. For document and wide-column stores record whether declared partition, sort, and secondary index structure supports the evidenced predicates. Record index creation strategy in migrations, specifically whether large-table creation is blocking or concurrent.

**Evidence Required.** Index declarations with paths, implicit index sources, query locations compared against each index.

**Deliverables.** `framework.database.indexes`.

**Failure Conditions.** Index adequacy judged without recording the query patterns compared; implicit indexes omitted; an index called unused from source inspection alone without recording that limitation.

**Acceptance Criteria.** Each index records its declaration, its supported access pattern or explicit absence, and the basis of that comparison.

### Stage 8 — Migration Discovery

**Purpose.** Determine how structural change is authored, ordered, applied, reviewed, and reversed.

**Inputs.** Migration directories and tooling configuration, application history, model snapshots, CI and deployment pipelines, release scripts, runbooks, change records.

**Actions.** Identify the mechanism and whether it is enforced or optional. Establish ordering determinism across parallel development, idempotency, and the presence and quality of reversal paths. Determine where migrations execute — pipeline stage, application startup, or manual operator action — and which credential runs them. Identify destructive operations such as column and table drops, type narrowing, non-nullable additions without defaults, and rewrites, and whether they are separated from application deploys. Identify long-running operations that lock objects and whether a non-blocking strategy is declared. Detect migrations edited after application, ordering gaps or collisions, and structures created outside the mechanism. Compare declared schema and any model snapshot to the migration sequence and report drift.

**Evidence Required.** Migration paths and identifiers, tooling configuration, execution locations, reversal declarations, snapshot comparisons, application-history evidence.

**Deliverables.** `framework.database.migration`.

**Failure Conditions.** The presence of a migration directory reported as controlled schema change; a reversal file's existence reported as a tested rollback; manual schema change assumed absent because the repository contains no evidence of it.

**Acceptance Criteria.** The assessment identifies how schema change reaches each environment, which principal applies it, whether reversal is declared, which changes carry data-loss or locking potential, and whether declared schema and migration history agree.

### Stage 9 — Mapper Discovery

**Purpose.** Establish each mapper's role, its fidelity to database structure, and the behaviour it introduces at runtime.

**Inputs.** Mapper configuration and models, generated clients and snapshots, association and cascade declarations, lifecycle hooks, connection and session configuration, schema artifact.

**Actions.** Identify each mapper, its target stores, and whether it is the authoritative schema source. Compare mapper declarations to database declarations field by field for material entities, recording divergence in nullability, type, default, uniqueness, and relationship. Record cascade behaviour declared in the mapper and compare it to referential actions declared in the database; contradictory cascades are a material integrity finding. Identify lifecycle hooks, soft-delete plugins, multi-tenancy filters, and default query scopes, each of which silently changes query and write semantics. Record lazy-loading configuration and the query amplification it can produce. Identify raw query escape hatches and their users. Record whether automatic schema synchronization is enabled in any environment, with the environment named.

**Evidence Required.** Mapper configuration paths, model declarations, cascade and hook declarations, synchronization settings, raw query locations.

**Deliverables.** Contributions to `framework.database.schema`, `framework.database.relationships`, `framework.database.constraints`, and `framework.database.health`.

**Failure Conditions.** The mapper model treated as the database schema; cascade declarations reported as database referential actions; default scopes ignored when assessing whether deleted or tenant-scoped records are excluded.

**Acceptance Criteria.** Each mapper records its authority, its evidenced divergences, and the runtime behaviours it introduces.

### Stage 10 — Query Discovery

**Purpose.** Establish how application code reaches data and whether construction is consistent and bounded.

**Inputs.** Mapper and query-builder usage, repository and data-access modules, raw query strings, stored routine invocations, aggregation pipelines, graph traversals, key construction code, module boundaries from architecture discovery.

**Actions.** Identify the access mechanisms in use and whether one is dominant. Locate query construction and record whether it is centralized in a data-access boundary or dispersed across transport handlers, business logic, and background jobs. Distinguish parameterized from string-interpolated queries and record every location incorporating external input, without asserting exploitability; those locations are inputs to security discovery. Identify unbounded reads, missing pagination, queries inside loops, wide selections on large entities, and aggregation performed in application code over full reads. Identify queries whose predicates have no supporting index. Record direct store access bypassing the primary access layer, including scripts, scheduled jobs, administrative tooling, and analytics readers.

**Evidence Required.** Access-layer module paths, query construction locations, parameterization evidence, predicate and projection details, bypass locations.

**Deliverables.** Contributions to `framework.database.indexes`, `framework.database.security`, and `framework.database.performance`.

**Failure Conditions.** Mapper use reported as proof of safe query construction; an interpolated query reported as a confirmed vulnerability rather than an evidenced risk; background and administrative paths omitted.

**Acceptance Criteria.** The dominant access path, every evidenced bypass, every location incorporating external input, and every unbounded read on a growing entity are identified.

### Stage 11 — Transaction Discovery

**Purpose.** Establish where atomicity is claimed, where it holds, and where consistency is eventual or absent.

**Inputs.** Transaction management code, isolation configuration, unit-of-work and session handling, multi-store write paths, message publication code, retry logic, idempotency mechanisms, consistency-level settings.

**Actions.** Identify how transactions are opened, committed, and rolled back, and whether management is explicit, framework-implicit, or absent. Record declared isolation levels and deviations from the engine default, applying the evidenced engine's semantics rather than a generic model. Identify operations writing to more than one store, or to a store and a message broker, within one logical action, and record the consistency mechanism: distributed transaction, transactional outbox, saga, compensating action, or none. Locate long-running transactions, transactions spanning external calls, nested or ambiguous scopes, and write paths lacking idempotency where retries are possible. Record lock acquisition patterns and ordering, since inconsistent ordering across paths is a deadlock risk. For distributed stores record read and write consistency levels and whether read-after-write expectations are compatible. Record read-after-write paths served by replicas.

**Evidence Required.** Transaction boundary locations, isolation and consistency-level declarations, multi-store write paths, lock acquisition sites, idempotency evidence.

**Deliverables.** Contributions to `framework.database.performance`, `framework.database.health`, and `framework.database.risks`.

**Failure Conditions.** Framework-managed transactions assumed present without evidence; multi-store writes reported as atomic; document-store multi-document writes assumed atomic without a transaction mechanism; eventual consistency described as a defect without reference to the system's stated design.

**Acceptance Criteria.** Each multi-store or externally coupled write path records its consistency mechanism or an evidenced atomicity gap, and every isolation conclusion names the engine semantics applied.

### Stage 12 — Performance Discovery

**Purpose.** Assess structural and access-pattern characteristics determining performance and scale, without claiming measured production performance.

**Inputs.** Index inventory, query inventory, entity growth classes, partitioning and sharding declarations, replication topology, caching declarations, pooling configuration, supplied execution or monitoring evidence with environment and date.

**Actions.** Compare evidenced predicates, sorts, joins, and projections to declared indexes and record unsupported access patterns. Identify query amplification, including per-row queries inside iteration and lazy-loaded associations resolved in loops. Identify unbounded result sets and missing pagination on growing entities. Identify wide reads on entities containing large columns or documents. Assess partitioning and sharding against evidenced predicates and record partition keys absent from common filters. Assess key cardinality for wide-column and time-series stores. Record caching layers, invalidation triggers, and whether a cache masks an unsupported access pattern. Record pool sizing against evidenced concurrency. Where execution evidence is supplied, record it with environment and date and keep it separate from source-derived observations.

**Evidence Required.** Index and query comparisons with paths, growth classes, partitioning and cache declarations, pooling configuration, measured evidence with environment and date.

**Deliverables.** `framework.database.performance`.

**Failure Conditions.** A query called slow without execution evidence; source-derived observations worded as production findings; an index judged sufficient without recording the predicate compared; cache presence treated as resolution of an unsupported access pattern.

**Acceptance Criteria.** Every performance observation states whether it derives from declared structure, code inspection, or measured execution evidence, and names the environment when measured.

### Stage 13 — Security Discovery

**Purpose.** Establish who and what can reach each store, with what authority, and how sensitive data is protected.

**Inputs.** Principal and role declarations, grant statements, row- and field-level security policies, security-rule files, connection artifact, encryption declarations, network exposure declarations, application authorization code, audit mechanisms, [STD-0003](../04-development/data-governance-standard.md).

**Actions.** Inventory declared principals, privileges, and using components. Identify whether application, migration, administrative, analytics, and background workloads use distinct credentials, and record any principal holding schema-altering or superuser-equivalent authority. Record encryption in transit and at rest as declared, and any evidenced disabling of verification. Identify row-level security, tenant predicates, and field-level controls, and where isolation depends solely on application code or a mapper default scope a raw query would bypass. Identify fields holding or plausibly holding identity, contact, authentication, financial, health, location, biometric, employment, government-identifier, or free-text data, recording the classification signal and its strength: a register entry or annotation is strong; an encryption or hashing declaration is strong; a naming inference is weak and requires steward confirmation. Never inspect values to confirm a classification. Record free-text, document, attachment metadata, and unstructured payload fields as unbounded classification risk. Trace identified fields into logs, exports, analytics copies, fixtures, caches, search indexes, and error payloads. Identify credentials, tokens, keys, and connection strings in schema defaults, seed and fixture data, migrations, and committed configuration, and columns storing secrets as application data, recording the declared protection. Record audit and history mechanisms, their coverage across write paths, and whether the application credential can modify audit records.

**Evidence Required.** Role and grant declarations, policy declarations, encryption and network declarations, isolation enforcement paths, classification signals with strength, redacted secret-reference locations.

**Deliverables.** `framework.database.security`.

**Failure Conditions.** A credential, connection string, host, or record value reproduced; shared credentials not identified; encryption claimed from a key name; a classification asserted from a column name without labelling it inferred; absence of a register reported as absence of sensitive data.

**Acceptance Criteria.** Each store records principals, privilege scope, credential source, isolation enforcement, and encryption posture. Every flagged field records signal, signal strength, declared protection, and the owner who must confirm it.

### Stage 14 — Data Lifecycle Discovery

**Purpose.** Establish how data is created, corrected, expired, deleted, archived, moved, and recovered.

**Inputs.** Retention policy documentation, deletion and anonymization code, scheduled cleanup jobs, time-to-live and expiry declarations, soft-delete mechanisms, archival routines, partition rotation, downsampling policy, import and export code, replication and change-data-capture configuration, backup configuration, restore procedures and records, data-subject request handling.

**Actions.** For each material entity identify the declared retention period and the mechanism enforcing it, distinguishing a documented policy from an implemented mechanism. A stated period with no scheduled job, expiry declaration, partition rotation, or storage lifecycle rule is policy without enforcement. Identify soft-delete patterns, whether soft-deleted records are ever hard-deleted, and whether exclusion is applied consistently across queries, exports, analytics copies, and backups. Map every path by which data moves between stores or leaves the system, recording source, destination, trigger, transport, transformation, classification exposure, and trust boundary crossed. Record whether derived data retains a link to its source version. Identify copies of sensitive data in environments with weaker controls, including analytics, development, and fixtures derived from production. Identify each backup mechanism, its scope, frequency, destination, retention, and encryption declaration, and whether any restore has been evidenced, with date and scope. Record stores with no evidenced backup, particularly derived stores whose contents cannot be regenerated. Record where replication is relied upon as backup, noting that replication propagates deletion and corruption. Identify data-subject correction, deletion, and access handling and whether it reaches every copy.

**Evidence Required.** Policy statements with source, enforcement mechanism declarations with paths, scheduled job definitions, exclusion evidence, movement path declarations, backup and restore declarations, restore records with dates.

**Deliverables.** `framework.database.lifecycle`.

**Failure Conditions.** A documented retention period reported as enforced; deletion reported as complete without tracing derived copies; a managed service assumed to be backed up; replication reported as backup; a runbook reported as a proven recovery capability; absence of retention documentation reported as unlimited retention rather than an unknown.

**Acceptance Criteria.** Each material entity records a retention statement, an enforcement mechanism or explicit absence, and the copies a deletion must reach. Each store records its backup mechanism or explicit absence and whether a restore has been evidenced, with date and scope.

### Stage 15 — Risk Consolidation

**Purpose.** Convert supported observations into prioritized data risks without confusing risk with defect proof.

**Inputs.** All previous deliverables, risk tier, change history if supplied, operational and incident evidence, stated constraints.

**Actions.** Identify risks involving unenforced integrity, schema and migration drift, destructive migrations coupled to deploys, dispersed or dynamic query construction, shared or over-privileged credentials, unclassified sensitive fields, sensitive data in logs or derived copies, policy without retention enforcement, incomplete deletion across copies, non-atomic multi-store writes, unbounded reads on growing entities, single points of data loss, and unevidenced recovery. State cause, impact, affected evidence, likelihood rationale, confidence, and the next verification step. Rank by potential impact and evidence strength, weighting irreversibility: a risk to data that cannot be reconstructed outranks a comparable risk to regenerable data.

**Evidence Required.** At least one observation supporting the risk and the reasoning from observation to risk.

**Deliverables.** `framework.database.risks`, `framework.database.recommendations`.

**Failure Conditions.** Risk claims using generic normalization or indexing preferences without repository evidence; severity presented as certainty; a query-construction observation escalated to a confirmed vulnerability without security testing.

**Acceptance Criteria.** A reviewer can challenge or validate each risk from cited evidence, and each risk names the data it endangers and whether that data is recoverable.

### Stage 16 — Final Verification

**Purpose.** Confirm the output is internally consistent, complete for scope, and safe to consume.

**Inputs.** All artifacts, scoring worksheets, unresolved-question list.

**Actions.** Confirm all fourteen artifact types exist or carry an explicit completeness state with a reason. Confirm no declared structure is reported as live structure, and every live-structure claim names its environment and observation date. Confirm family-inapplicable analyses are marked not applicable with a family reason rather than omitted. Re-run targeted searches for high-impact unknowns: unclassified candidate-sensitive fields, stores without evidenced recovery, and credentials in source. Verify no data values, credentials, connection strings, or endpoints remain anywhere in the output. Produce health scores and recommendations.

**Evidence Required.** Completed verification, artifact versions, escalation record.

**Deliverables.** `framework.database.health`, completed and consistent artifact set.

**Failure Conditions.** Unresolved contradictions, broken evidence links, missing artifacts without a declared completeness state, declared structure presented as deployed, or sensitive-data exposure.

**Acceptance Criteria.** The artifact set is traceable, internally coherent, complete for declared scope, free of data and credential values, and ready for human review or downstream methodologies.

How this output is validated is defined by [STD-0012](../02-methodology/validation-specification.md).

## 12. Cross-Cutting Analyses

*This section is normative.*

These draw on evidence from several stages and are reported in the artifacts named.

**Database smells.** Identifier columns referencing entities with no declared constraint; integrity enforced in one of several writers; migrations edited after application; objects created outside the migration mechanism; automatic synchronization enabled in a deployed environment; a single credential shared across workloads; free-text columns accumulating unclassified personal data; soft-delete columns never removed; retention documented with no enforcing mechanism; nullable columns the application always populates; entities with no creation or modification timestamp; derived stores that cannot be rebuilt; fixtures derived from production; caches holding sensitive fields with no expiry; multi-store writes with no compensating action; unbounded reads on growing entities; wide tables mixing unrelated concerns; columns storing serialized structures that queries then filter on; enumerated values duplicated in code; manual partition creation; and backup configuration with no restore evidence. Reported in `framework.database.health`.

**Normalization review.** Relational stores only. Assess repeating groups, partial dependencies, and transitive dependencies, recording deliberate denormalization separately from accidental redundancy. Deliberate denormalization is identified by an evidenced synchronization mechanism or a documented performance rationale; without either, redundancy is accidental and carries a consistency risk. For document stores, replace with an embedding-versus-referencing assessment recording each embedded structure, whether bounded, whether it duplicates data owned elsewhere, and the update path maintaining consistency. Not applicable for key-value and time-series stores.

**Naming standards.** Establish the dominant convention from evidence rather than preference. Report deviations against the observed convention and identify actively misleading names — a column whose name implies a type or relationship it does not have, or a table whose name no longer matches its content. Low severity unless a name misleads.

**Migration quality.** Assess ordering determinism, reversibility, idempotency, separation of destructive changes from deploys, locking strategy, data migrations bundled with structural ones, environment parity, and whether every structural change reaches the database through the mechanism. Reported in `framework.database.migration`.

**Referential integrity.** Assess whether each relationship is enforced by the store, the application, both consistently, or neither. Record contradictions between mapper cascades and database referential actions. Record relationships that cannot carry a constraint and the compensating mechanism for each.

**Orphan detection.** Identify structural conditions permitting orphaned records: relationships without constraints, nullable foreign keys with no application guard, delete paths removing a parent without addressing children, cross-store references with no cleanup, and soft-deleted parents whose children remain visible. This is a structural analysis: identify where orphans can occur and specify the verification query a steward would run. Do not execute it, and do not report an orphan count without authorized read-only evidence.

**Duplicate data detection.** Identify structural duplication rather than duplicate rows: the same fact in several objects or stores, denormalized copies with no synchronization, embedded copies of independently owned entities, caches and derived stores holding authoritative-looking data, and overlapping tables serving one concept. Record the source of truth, the synchronization mechanism or its absence, and the divergence consequence.

**Dead tables.** Identify storage objects with no evidenced reader, no evidenced writer, or neither, at the audited revision. State search method and scope, and state that dynamic query construction, external consumers, analytics tools, and administrative access can reference an object without a source reference. A dead-table finding is a candidate for retirement subject to owner confirmation, never a deletion instruction. Record separately any candidate holding data subject to a retention obligation.

**Unused columns.** Identify columns with no evidenced reader or writer, columns written but never read, columns superseded by a later column, and columns whose declared type or nullability contradicts evidenced use. Same scope caveats as dead-table detection. Columns holding sensitive data with no evidenced reader are a priority finding, carrying classification and retention obligations with no offsetting use.

**Retention policies.** For each material entity and store, record the declared period, its source, the enforcing mechanism, and evidence that the mechanism runs. Policy, mechanism, and evidence of execution are three separate facts. Entities with no retention statement are Unknown, not unlimited. Record divergence between a primary store and its derived copies, backups, logs, and exports. For time-series and event stores, downsampling, partition rotation, and pruning serve as the retention mechanism.

## 13. Health Dimensions

*This section is normative.*

The scale, its meanings, the averaging guard, the escalation guard, and the partial-coverage rule are defined by [STD-0007](../02-methodology/evidence-and-confidence.md) section 13. This methodology declares only its dimensions.

Twelve dimensions: schema clarity; entity and relationship modelling; integrity enforcement; migration discipline; index and access-pattern fit; transaction correctness; query construction consistency; classification coverage; access-control separation; retention and lifecycle control; recoverability; documentation traceability.

The lowest two levels of the scale for the purposes of the escalation guard are `0` and `1`.

Recoverability, classification coverage, and access-control separation are scored independently of structural quality. A well-modelled schema does not raise them, and the separation is deliberate: structural elegance is the dimension teams most often optimize and the one least correlated with data loss or disclosure.

## 14. Escalation and Human Review

*This section is informative.*

Escalate immediately on: a credential, connection string, or key committed to source; secrets stored as plaintext application data; personal, regulated, or payment data in an unexpected store, log, fixture, or export; evidence of unauthorized access or exfiltration; a system of record with no evidenced backup; a destructive migration with no reversal or preservation path; sensitive data copied into an environment with weaker controls; or automatic schema synchronization enabled against a deployed environment. A committed credential requires a rotation recommendation and never reproduces the value.

Human review confirms: audit scope, revision, environments, exclusions, and access limitations; whether the audit was source-derived or environment-corroborated; completeness of the store inventory including derived stores and caches; every inferred classification; rotation of any credential found in source; retention policies, mechanisms, and deletion completeness across copies; credential ownership and workload separation; recovery capability and the date and scope of the most recent restore; dead-table and unused-column candidates against external consumers; and whether escalations require security, privacy, data, or operations review.

## 15. Examples and Common Mistakes

*This section is informative.*

A foreign key declared in a migration, present in catalogue output from a named environment, and exercised by an observed delete path supports a Verified constraint. A mapper association with no corresponding constraint supports only an Observed application-level relationship, and the integrity conclusion is that referential integrity depends on application correctness across every write path. A column named `customer_id` with no declaration and no observed join supports an Inferred relationship at Low confidence. A managed service with a snapshot setting declared in infrastructure-as-code is Observed backup configuration; with no restore record, recovery capability is Unknown, not adequate. A documented ninety-day retention period with no enforcing mechanism is a policy statement, and the enforcement conclusion is Unknown pending steward confirmation. A mapper entity declaring a cascading delete while the database declares no referential action is conflicting evidence: the cascade applies only to deletions through the mapper.

Common mistakes are treating the declared schema as the deployed schema; treating mapper models as database constraints; assuming a column name proves its content; applying one engine's semantics to another; reporting configured backup as recovery capability; treating replication as backup; copying record values, connection strings, or credentials into evidence; omitting derived stores from the inventory; reporting deletion as complete without tracing copies; conflating documented retention with enforced retention; omitting migration, seed, trigger, procedure, and administrative paths; judging index adequacy without recording the query patterns compared; reporting absence without recording scope; and omitting a family-inapplicable analysis instead of marking it not applicable with a reason.

Do not execute write, schema-altering, or destructive statements under any authorization. Do not read, sample, or reproduce records. Do not connect to a production database to close an evidence gap. Do not manufacture entity diagrams implying constraints no artifact declares. Do not report orphan or duplicate counts without authorized read-only evidence. Do not recommend dropping an object on a dead-table finding alone.

## 16. Related Documents

*This section is informative.*

- [Architecture Discovery](01-architecture-discovery.md)
- [Frontend Discovery](03-frontend-discovery.md)
- [Backend Discovery](04-backend-discovery.md)
- [Security and Permissions](06-security-permissions.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [Evidence and Confidence Standard](../02-methodology/evidence-and-confidence.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Metadata Specification Standard](../02-methodology/metadata-specification.md)
- [Contract Specification Standard](../02-methodology/contract-specification.md)
- [Validation Specification Standard](../02-methodology/validation-specification.md)
- [Data Governance Standard](../04-development/data-governance-standard.md)
- [Framework Glossary](../02-methodology/glossary.md)
