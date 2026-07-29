// AUD-0003 subject profiles.
//
// The conclusions Database Discovery reaches about one subject, in the same shape
// architecture-subjects.mjs uses. Nothing here is executed against a database:
// every conclusion is drawn from a declaration in the subject repository, and the
// evidence note on each record names the declaration it was drawn from.
//
// AUD-0003 section 8 principle 1 governs the wording throughout: a schema file or
// model class is evidence of intent, never of live structure. Where a conclusion
// concerns what the store enforces rather than what the repository declares, the
// record is Inferred and says so.

export const SUBJECTS = {
  // The third subject, examined by the same methodology. Persistence here is a
  // dependency of an HTTP service rather than the subject's whole reason to exist,
  // which is what makes it a useful second reading of the same rules.
  'orders-api': {
    declaredScope: 'every path in the subject repository at the audited revision that declares, configures, or reaches persistent state',
    exclusions: [],
    technology: {
      completeness: 'Complete',
      lineage: [['framework.architecture.technology', ['technology-0001', 'technology-0002']]],
      records: [
        {
          fields: { engine: 'postgresql', engine_role: 'system-of-record', declaration_path: 'prisma/schema.prisma', family: 'relational', schema_authority: 'prisma/schema.prisma', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['prisma/schema.prisma', 'the datasource block names the provider and the schema declares every model in scope']],
        },
        {
          fields: { engine: '@prisma/client', engine_role: 'unknown', declaration_path: 'package.json', version_constraint: '5.14.0', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['package.json', 'a mapper is declared as a runtime dependency; it is not itself a store and no role in the closed vocabulary describes it']],
        },
      ],
    },
    connections: {
      completeness: 'Complete',
      records: [
        {
          fields: { component: 'orders-api', engine: 'postgresql', environment: 'undeclared', credential_source: 'environment', pooling: 'maximum 20 connections, idle timeout 30000ms', encryption_in_transit: 'declared with peer verification required', replica_role: 'primary', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['config/database.json', 'the connection is configured by an indirect reference to an environment key; no value was read or recorded']],
        },
      ],
    },
    schema: {
      completeness: 'Complete',
      records: [
        { fields: { object: 'Customer', object_type: 'table', store: 'postgresql', authority_path: 'prisma/schema.prisma', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'a model is declared; whether the store carries it was not observed']] },
        { fields: { object: 'Order', object_type: 'table', store: 'postgresql', authority_path: 'prisma/schema.prisma', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'a model is declared; whether the store carries it was not observed']] },
        { fields: { object: 'OrderItem', object_type: 'table', store: 'postgresql', authority_path: 'prisma/schema.prisma', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'a model is declared with a composite identifier']] },
        { fields: { object: 'Order status', object_type: 'type', store: 'postgresql', authority_path: 'prisma/schema.prisma', enforcement_location: 'none', evidence_state: 'Observed', confidence: 'High' }, evidence: [['prisma/schema.prisma', 'the field is declared as free text; no enumeration constrains it in the schema and no check is declared']] },
      ],
    },
    entities: {
      completeness: 'Complete',
      lineage: [['framework.database.schema', ['entity-0001', 'entity-0002', 'entity-0003']], ['framework.architecture.modules', ['entity-0001', 'entity-0002', 'entity-0003']]],
      records: [
        {
          fields: { entity: 'Customer', storage_objects: 'Customer', identity_strategy: 'surrogate-key', owning_module: 'src/data', growth_class: 'transactional', classification: 'candidate personal data: an email and a full name. The signal is the field naming and is therefore weak; a steward must confirm it', access_paths: 'src/data/order-repository.js', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'the entity is reached only through the repository in the data module']],
        },
        {
          fields: { entity: 'Order', storage_objects: 'Order', identity_strategy: 'surrogate-key', owning_module: 'src/data', growth_class: 'transactional', access_paths: 'src/data/order-repository.js', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'five methods on one repository reach the entity, and no other module in scope does']],
        },
        {
          fields: { entity: 'OrderItem', storage_objects: 'OrderItem', identity_strategy: 'composite-key', owning_module: 'src/data', growth_class: 'transactional', access_paths: 'src/data/order-repository.js', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'the entity is written in a bulk create beside the order it belongs to']],
        },
      ],
    },
    relationships: {
      completeness: 'Complete',
      lineage: [['framework.database.entities', ['relationship-0001', 'relationship-0002']]],
      records: [
        { fields: { from_entity: 'Customer', to_entity: 'Order', cardinality: 'one-to-many', enforcement_location: 'store', optionality: 'required', declaration_level: 'mapper-authored schema with a declared cascade', synchronization: 'deletion of a customer is declared to cascade to their orders', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'a relation with a declared referential action']] },
        { fields: { from_entity: 'Order', to_entity: 'OrderItem', cardinality: 'one-to-many', enforcement_location: 'store', optionality: 'required', declaration_level: 'mapper-authored schema with a declared cascade', synchronization: 'deletion of an order is declared to cascade to its items', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'a relation with a declared referential action']] },
      ],
    },
    constraints: {
      completeness: 'Complete',
      lineage: [['framework.database.schema', ['constraint-0001', 'constraint-0002', 'constraint-0003', 'constraint-0004', 'constraint-0005']]],
      records: [
        { fields: { constraint: 'Customer identifier', constraint_kind: 'primary-key', target: 'Customer.id', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'an identifier attribute is declared on the model']] },
        { fields: { constraint: 'Customer email uniqueness', constraint_kind: 'unique', target: 'Customer.email', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'a uniqueness attribute is declared on the field']] },
        { fields: { constraint: 'Order identifier', constraint_kind: 'primary-key', target: 'Order.id', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'an identifier attribute is declared on the model']] },
        { fields: { constraint: 'OrderItem composite identifier', constraint_kind: 'primary-key', target: 'OrderItem.orderId, OrderItem.sku', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'a composite identifier attribute is declared on the model']] },
        { fields: { constraint: 'Order status vocabulary', constraint_kind: 'check', target: 'Order.status', enforcement_location: 'none', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'the field is free text and no declaration constrains its values anywhere in scope']] },
      ],
    },
    indexes: {
      completeness: 'Complete',
      lineage: [['framework.database.schema', ['index-0001', 'index-0002', 'index-0003']]],
      records: [
        { fields: { index: 'Customer identifier', target: 'Customer.id', declaration: 'implicit', supported_access_pattern: 'lookup of a customer by identifier', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'implied by the declared identifier']] },
        { fields: { index: 'Order customer and placement time', target: 'Order.customerId, Order.placedAt', declaration: 'explicit', supported_access_pattern: 'listing a customer\u2019s orders in placement order', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'a composite index is declared on the model']] },
        { fields: { index: 'Order status', target: 'Order.status', declaration: 'unknown', supported_access_pattern: 'absent: a maintenance path filters on the field and no index is declared over it', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['src/data/order-repository.js', 'a delete filters on status and on placement time; only the second is indexed']] },
      ],
    },
    migration: {
      completeness: 'Complete',
      records: [
        { fields: { migration: 'mapper-managed schema change', mechanism: 'the mapper toolchain declared as a development dependency', ordering: 'unknown', reversibility: 'unknown', evidence_state: 'Inferred', confidence: 'Low' }, evidence: [['package.json', 'the mapper toolchain is declared as a development dependency, which is the only evidence in scope that a migration mechanism exists. No migration file is present at this revision, so neither ordering nor reversibility could be established']] },
      ],
    },
    security: {
      completeness: 'Partial',
      completenessReason: 'privilege grants, role definitions, and at-rest configuration live in the store rather than the repository, and this run contacted no store',
      records: [
        { fields: { store: 'postgresql', principal: 'the application credential referenced by DATABASE_URL', privileges: 'unknown: no grant is declared in scope', encryption_at_rest: 'unknown', workload_separation: false, evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['config/database.json', 'one credential reference serves every path in scope, and transport verification is declared required']] },
      ],
    },
    performance: {
      completeness: 'Complete',
      lineage: [['framework.database.entities', ['performance-0001', 'performance-0002', 'performance-0003']]],
      records: [
        { fields: { access_pattern: 'list a customer\u2019s orders with their items', entity: 'Order', supporting_index: 'Order.customerId, Order.placedAt', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['src/data/order-repository.js', 'the read filters on the customer and includes the related items in one call']] },
        { fields: { access_pattern: 'create an order and then its items', entity: 'OrderItem', is_unbounded: false, supporting_index: 'absent: the write is a bulk insert and needs none', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['src/data/order-repository.js', 'two writes are issued in sequence with no transaction around them']] },
        { fields: { access_pattern: 'update every order', entity: 'Order', is_unbounded: true, supporting_index: 'absent: the write is unfiltered', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['src/data/order-repository.js', 'a maintenance path issues an update with no filter']] },
      ],
    },
    lifecycle: {
      completeness: 'Partial',
      completenessReason: 'retention periods, archival, and backup configuration are declared outside the audited repository and none was supplied to this run',
      lineage: [['framework.database.entities', ['lifecycle-0001', 'lifecycle-0002', 'lifecycle-0003']]],
      records: [
        { unknown: 'no retention period, archival rule, or backup declaration for this entity exists in scope, and none was supplied to this run', fields: { entity: 'Customer', deletion_path: 'cascade from the customer record; no independent deletion path is declared' }, evidence: [['prisma/schema.prisma', 'a cascade is declared; no retention rule is declared anywhere in scope']] },
        { unknown: 'no retention period, archival rule, or backup declaration for this entity exists in scope, and none was supplied to this run', fields: { entity: 'Order', deletion_path: 'a maintenance path deletes cancelled orders older than a supplied instant' }, evidence: [['src/data/order-repository.js', 'a delete is declared; the instant it compares against is supplied by the caller and no policy governs it in scope']] },
        { unknown: 'no retention period, archival rule, or backup declaration for this entity exists in scope, and none was supplied to this run', fields: { entity: 'OrderItem', deletion_path: 'cascade from the order record' }, evidence: [['prisma/schema.prisma', 'a cascade is declared; no retention rule is declared anywhere in scope']] },
      ],
    },
    health: {
      completeness: 'Complete',
      lineage: [['framework.database.constraints', ['health-0001']], ['framework.database.indexes', ['health-0002']], ['framework.database.performance', ['health-0003']], ['framework.database.lifecycle', ['health-0004']]],
      records: [
        { fields: { dimension: 'constraint coverage', score: 3, calculation: 'four of five recorded constraints are enforced by the store; the status vocabulary is enforced nowhere', supporting_records: 'constraint-0001,constraint-0002,constraint-0003,constraint-0004,constraint-0005', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['this run', 'derived from the records named in supporting_records']] },
        { fields: { dimension: 'index alignment', score: 3, calculation: 'the read path on the order listing is supported by a declared index; one maintenance filter is not', supporting_records: 'index-0001,index-0002,index-0003', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['this run', 'derived from the records named in supporting_records']] },
        { fields: { dimension: 'write path integrity', score: 1, calculation: 'the order creation path issues two dependent writes with no transaction around them, so a partial order is reachable', supporting_records: 'performance-0002', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['this run', 'derived from the records named in supporting_records']] },
        { unknown: 'every lifecycle record of this run is itself Unknown, so no observation supports a score. STD-0007 R-28 makes a conclusion drawn from an Unknown input Unknown', fields: { dimension: 'retention and lifecycle control', calculation: 'not calculated; every lifecycle record of this run is itself Unknown', supporting_records: 'lifecycle-0001,lifecycle-0002,lifecycle-0003' }, evidence: [['prisma/schema.prisma', 'no retention declaration exists in scope']] },
      ],
    },
    risks: {
      completeness: 'Complete',
      lineage: [['framework.database.performance', ['risk-0001', 'risk-0003']], ['framework.database.constraints', ['risk-0002']]],
      records: [
        {
          fields: { risk: 'an order and its items are written without a transaction', cause: 'the creation path issues the order write and the item write as two independent calls', impact: 'a failure between the two leaves an order with no items, and nothing in scope repairs it', affected_entities: 'Order, OrderItem', supporting_records: 'performance-0002', likelihood_rationale: 'the sequence runs on every order placement', reversibility: 'reversible', owner_candidate: 'the team that owns the data module', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'two awaited writes with no surrounding transaction']],
        },
        {
          fields: { risk: 'the order status vocabulary is enforced nowhere', cause: 'the field is declared as free text and no check, enumeration, or application guard constrains it in scope', impact: 'a value outside the intended set can be written and will be read back as valid', affected_entities: 'Order', supporting_records: 'constraint-0005', likelihood_rationale: 'two paths in scope write the field with literals and neither is checked', reversibility: 'reversible', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['prisma/schema.prisma', 'the field is free text and no constraint is declared over it']],
        },
        {
          fields: { risk: 'a maintenance path updates every order unfiltered', cause: 'the reindex path issues an update with no filter', impact: 'the whole table is rewritten, and any concurrent read observes the rewrite', affected_entities: 'Order', supporting_records: 'performance-0003', likelihood_rationale: 'the path is reachable whenever the admin surface is registered', reversibility: 'irreversible', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'an update with no where clause']],
        },
      ],
    },
    recommendations: {
      completeness: 'Complete',
      lineage: [['framework.database.risks', ['recommendation-0001', 'recommendation-0002', 'recommendation-0003']]],
      records: [
        { fields: { action: 'wrap the order creation writes in one transaction', source_records: 'risk-0001', problem: 'a failure between two dependent writes leaves an order with no items', verification: 'a test that fails the item write and observes no order remaining', priority: 'high', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['src/data/order-repository.js', 'the two writes are already adjacent in one method']] },
        { fields: { action: 'constrain the order status vocabulary in the schema', source_records: 'risk-0002', problem: 'a value outside the intended set can be written and read back as valid', verification: 'a write of an unintended value is rejected by the store', priority: 'medium', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'the field is declared as free text']] },
        { fields: { action: 'bound the maintenance update', source_records: 'risk-0003', problem: 'an unfiltered update rewrites every row', verification: 'the path rejects an invocation with no bound', priority: 'medium', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['src/data/order-repository.js', 'the update carries no filter']] },
      ],
    },
  },
  'orders-db': {
    declaredScope: 'every persistence declaration in the subject repository at the audited revision: the mapper schema, the database and cache configuration, and every source path that constructs or issues a store operation. No database was connected to and no statement was executed',
    exclusions: [],

    technology: {
      completeness: 'Complete',
      // The cross-methodology edge the type declaration requires: what this run
      // knows about persistence begins with what the architecture run observed
      // leaving the system.
      lineage: [['framework.architecture.technology', ['technology-0001', 'technology-0002', 'technology-0003'], { crossMethodology: true }]],
      records: [
        {
          fields: { engine: 'postgresql', family: 'relational', engine_role: 'system-of-record', declaration_path: 'prisma/schema.prisma', schema_authority: 'prisma/schema.prisma', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['prisma/schema.prisma', 'the datasource block declares the postgresql provider'], ['package.json', 'the mapper client is declared as a runtime dependency']],
        },
        {
          fields: { engine: 'redis', family: 'key-value', engine_role: 'cache', declaration_path: 'package.json', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['package.json', 'a redis client is declared as a runtime dependency'], ['src/data/order-repository.js', 'the client is constructed from the declared cache configuration and used to store and read a serialized customer']],
        },
        {
          fields: { engine: 'prisma', engine_role: 'unknown', declaration_path: 'package.json', schema_authority: 'prisma/schema.prisma', version_constraint: '5.9.1', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['prisma/schema.prisma', 'the mapper schema is the only structural declaration in scope, so the mapper is the authoritative schema source'], ['package.json', 'the mapper is declared as a runtime dependency and its tooling as a development dependency']],
          note: 'A mapper is not an engine. It is recorded here because the type carries mapper schema authority, and engine_role is unknown because no role in the closed vocabulary describes a mapper.',
        },
      ],
    },

    connections: {
      completeness: 'Complete',
      lineage: [['framework.database.technology', ['connection-0001', 'connection-0002', 'connection-0003']]],
      records: [
        {
          fields: { component: 'orders-db', engine: 'postgresql', environment: 'undeclared', credential_source: 'environment', pooling: 'maximum 10 connections, idle timeout 30000ms', encryption_in_transit: 'declared with peer verification disabled', replica_role: 'primary', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['config/database.json', 'a connection target is declared by environment reference, with pool sizing and a transport setting that does not require peer verification. No value was read']],
        },
        {
          fields: { component: 'orders-db', engine: 'postgresql', environment: 'undeclared', credential_source: 'environment', replica_role: 'replica', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['config/database.json', 'a replica target is declared by environment reference; no source path in scope reads from it']],
        },
        {
          fields: { component: 'orders-db', engine: 'redis', environment: 'undeclared', credential_source: 'environment', replica_role: 'unknown', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['src/data/order-repository.js', 'the cache client is constructed from the declared cache url'], ['config/database.json', 'the cache url is declared by environment reference']],
        },
      ],
    },

    schema: {
      completeness: 'Complete',
      lineage: [['framework.database.technology', ['schema-0001', 'schema-0002', 'schema-0003', 'schema-0004', 'schema-0005']]],
      records: [
        { fields: { object: 'Customer', object_type: 'table', store: 'postgresql', authority_path: 'prisma/schema.prisma', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'a model is declared with an identifier, a unique field, and a relation; the model is a declaration of intent and the deployed structure was not observed']] },
        { fields: { object: 'Order', object_type: 'table', store: 'postgresql', authority_path: 'prisma/schema.prisma', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'a model is declared with an identifier, a relation to Customer, and a declared index']] },
        { fields: { object: 'OrderItem', object_type: 'table', store: 'postgresql', authority_path: 'prisma/schema.prisma', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'a model is declared with a composite identifier and a cascading relation to Order']] },
        { fields: { object: 'AuditEvent', object_type: 'table', store: 'postgresql', authority_path: 'prisma/schema.prisma', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'a model is declared with an identifier and a free-text payload field']] },
        {
          fields: { object: 'schema synchronization', object_type: 'mechanism', store: 'postgresql', authority_path: 'package.json', enforcement_location: 'mapper', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['package.json', 'the start script pushes the mapper schema with data loss accepted before the process starts'], ['.ci/pipeline.yml', 'the release stage invokes the start script']],
          note: 'AUD-0003 Stage 3 requires that evidenced automatic synchronization be recorded, because deployed structure then derives from the mapper rather than from a change history.',
        },
        {
          fields: { object: 'cache key namespace', object_type: 'mechanism', store: 'redis', authority_path: 'src/data/order-repository.js', enforcement_location: 'application', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['src/data/order-repository.js', 'keys are constructed in one module with a customer prefix; the store declares no structure of its own']],
        },
      ],
    },

    entities: {
      completeness: 'Complete',
      lineage: [
        ['framework.database.schema', ['entity-0001', 'entity-0002', 'entity-0003', 'entity-0004']],
        ['framework.architecture.modules', ['entity-0001', 'entity-0002', 'entity-0003', 'entity-0004'], { crossMethodology: true }],
      ],
      records: [
        {
          fields: { entity: 'Customer', storage_objects: 'Customer', identity_strategy: 'surrogate-key', owning_module: 'src/data', growth_class: 'transactional', classification: 'candidate personal data: an email and a full name. The signal is the field naming and is therefore weak; a steward must confirm it', access_paths: 'src/data/order-repository.js', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['prisma/schema.prisma', 'the model declares a generated identifier, a unique email, and a name'], ['src/data/order-repository.js', 'the only path that reads or writes the model']],
        },
        {
          fields: { entity: 'Order', storage_objects: 'Order', identity_strategy: 'surrogate-key', owning_module: 'src/data', growth_class: 'transactional', access_paths: 'src/data/order-repository.js', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['prisma/schema.prisma', 'the model declares a generated identifier, a customer reference, and a status'], ['src/data/order-repository.js', 'four paths read or write the model']],
        },
        {
          fields: { entity: 'OrderItem', storage_objects: 'OrderItem', identity_strategy: 'composite-key', owning_module: 'src/data', growth_class: 'transactional', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['prisma/schema.prisma', 'the model declares a composite identifier over the order reference and a line number']],
          note: 'No path in scope reads or writes this model. It is recorded as an entity with no evidenced access path rather than omitted, per AUD-0003 Stage 4.',
        },
        {
          fields: { entity: 'AuditEvent', storage_objects: 'AuditEvent', identity_strategy: 'surrogate-key', owning_module: 'src/data', growth_class: 'append-only', classification: 'the payload field is free text and carries unbounded classification risk; its content was not inspected', access_paths: 'src/data/audit-log.js', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['prisma/schema.prisma', 'the model declares an actor, an action, and a free-text payload'], ['src/data/audit-log.js', 'the only path that writes the model, and no path reads it']],
        },
      ],
    },

    relationships: {
      completeness: 'Complete',
      lineage: [['framework.database.entities', ['relationship-0001', 'relationship-0002']]],
      records: [
        {
          fields: { from_entity: 'Customer', to_entity: 'Order', cardinality: 'one-to-many', enforcement_location: 'store', optionality: 'required', declaration_level: 'mapper-authored schema with a declared reference', evidence_state: 'Inferred', confidence: 'Medium' },
          evidence: [['prisma/schema.prisma', 'the relation is declared in the mapper schema over a non-nullable reference field; whether the store holds the constraint was not observed']],
        },
        {
          fields: { from_entity: 'Order', to_entity: 'OrderItem', cardinality: 'one-to-many', enforcement_location: 'store', optionality: 'required', declaration_level: 'mapper-authored schema with a declared cascade', synchronization: 'deletion of an order is declared to cascade to its items', evidence_state: 'Inferred', confidence: 'Medium' },
          evidence: [['prisma/schema.prisma', 'the relation declares a cascading delete; whether the store holds the action was not observed']],
        },
      ],
    },

    constraints: {
      completeness: 'Complete',
      lineage: [['framework.database.schema', ['constraint-0001', 'constraint-0002', 'constraint-0003', 'constraint-0004', 'constraint-0005', 'constraint-0006', 'constraint-0007']]],
      records: [
        { fields: { constraint: 'Customer identifier', constraint_kind: 'primary-key', target: 'Customer.id', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'the field is declared as the model identifier']] },
        { fields: { constraint: 'Customer email uniqueness', constraint_kind: 'unique', target: 'Customer.email', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'the field carries a uniqueness declaration']] },
        { fields: { constraint: 'Order identifier', constraint_kind: 'primary-key', target: 'Order.id', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'the field is declared as the model identifier']] },
        {
          fields: { constraint: 'Order to Customer reference', constraint_kind: 'foreign-key', target: 'Order.customerId', enforcement_location: 'store', referential_action: 'not declared; the engine default would apply', evidence_state: 'Inferred', confidence: 'Medium' },
          evidence: [['prisma/schema.prisma', 'the relation declares no delete or update action, so the action is defaulted rather than declared']],
        },
        { fields: { constraint: 'OrderItem composite identifier', constraint_kind: 'primary-key', target: 'OrderItem.orderId,OrderItem.lineNo', enforcement_location: 'store', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'the model declares a composite identifier']] },
        { fields: { constraint: 'OrderItem to Order reference', constraint_kind: 'foreign-key', target: 'OrderItem.orderId', enforcement_location: 'store', referential_action: 'cascade on delete', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'the relation declares a cascading delete']] },
        {
          fields: { constraint: 'Order status vocabulary', constraint_kind: 'check', target: 'Order.status', enforcement_location: 'none', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['prisma/schema.prisma', 'the field is declared as free text with no check declaration'], ['src/domain/orders.js', 'no path in scope validates the value before it is written']],
          note: 'The absence is the finding. AUD-0003 Stage 6 requires an invariant enforced nowhere to be recorded rather than omitted.',
        },
      ],
    },

    indexes: {
      completeness: 'Complete',
      lineage: [['framework.database.schema', ['index-0001', 'index-0002', 'index-0003', 'index-0004', 'index-0005']]],
      records: [
        { fields: { index: 'Customer identifier', target: 'Customer.id', declaration: 'implicit', supported_access_pattern: 'lookup of a customer by identifier', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'an index implied by the identifier declaration; implicit indexing differs by engine and was not observed in a catalogue']] },
        { fields: { index: 'Customer email uniqueness', target: 'Customer.email', declaration: 'implicit', supported_access_pattern: 'absent: no path in scope filters on the field', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'an index implied by the uniqueness declaration']] },
        { fields: { index: 'Order identifier', target: 'Order.id', declaration: 'implicit', supported_access_pattern: 'lookup of an order by identifier, including the raw statement path', evidence_state: 'Inferred', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'an index implied by the identifier declaration']] },
        { fields: { index: 'Order customer reference', target: 'Order.customerId', declaration: 'explicit', supported_access_pattern: 'absent: no path in scope filters orders by customer', redundancy_finding: 'none; the index is declared and unused at this revision by any path in scope', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'the model declares the index explicitly'], ['src/data/order-repository.js', 'no query in scope filters on the field']] },
        {
          fields: { index: 'AuditEvent identifier', target: 'AuditEvent.id', declaration: 'implicit', supported_access_pattern: 'absent: no path in scope reads the entity at all', evidence_state: 'Inferred', confidence: 'Medium' },
          evidence: [['prisma/schema.prisma', 'an index implied by the identifier declaration']],
        },
      ],
      note: 'An index called unused here is unused by the paths in scope. AUD-0003 Stage 7 requires that limitation to be recorded rather than left implied.',
    },

    migration: {
      completeness: 'NotApplicable',
      completenessReason: 'schema change in this subject is not managed by a migration mechanism: no migration directory, tooling configuration, ordering, or history exists at the audited revision, and the schema is pushed from the mapper instead. This is a finding about the subject, not an input this run was unable to obtain; the mechanism that does apply schema change is recorded in framework.database.schema',
      records: [],
    },

    security: {
      completeness: 'Partial',
      completenessReason: 'declared principals, grants, and privilege scope live in the store catalogue. No authorized read-only catalogue output was supplied to this run and the repository declares none, so only the credential usage evidenced in the repository was examined',
      lineage: [['framework.database.connections', ['security-0001', 'security-0002']]],
      records: [
        {
          fields: { principal: 'the application credential referenced by DATABASE_URL', store: 'postgresql', privileges: 'includes structural modification: the same reference is used by the running process and by the schema push the start script performs', workload_separation: false, encryption_at_rest: 'unknown', evidence_state: 'Inferred', confidence: 'Medium' },
          evidence: [['prisma/schema.prisma', 'the datasource resolves its credential from one environment reference'], ['package.json', 'the start script applies schema and then starts the process, with no second credential declared']],
          note: 'The privilege set was not read. The conclusion is that one reference serves both workloads, which is an inference from the declarations rather than an observation of a grant.',
        },
        {
          fields: { principal: 'the cache credential referenced by REDIS_URL', store: 'redis', privileges: 'unknown', encryption_at_rest: 'unknown', evidence_state: 'Inferred', confidence: 'Low' },
          evidence: [['config/database.json', 'the cache url is declared by environment reference and no privilege declaration accompanies it']],
        },
      ],
    },

    performance: {
      completeness: 'Complete',
      lineage: [
        ['framework.database.indexes', ['performance-0001', 'performance-0002', 'performance-0003']],
        ['framework.database.entities', ['performance-0001', 'performance-0002', 'performance-0003', 'performance-0004', 'performance-0005']],
      ],
      records: [
        {
          fields: { access_pattern: 'list every order', entity: 'Order', supporting_index: 'absent: the read is unfiltered', is_unbounded: true, evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'the read declares no limit, offset, or filter over an entity whose growth is transactional']],
        },
        {
          fields: { access_pattern: 'filter orders by status', entity: 'Order', supporting_index: 'absent: no index is declared over the field', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'the predicate names a field carrying no index declaration'], ['prisma/schema.prisma', 'the only declared index over the model covers the customer reference']],
        },
        {
          fields: { access_pattern: 'resolve the customer of each listed order', entity: 'Customer', supporting_index: 'the identifier index', amplification_finding: 'one lookup is issued per order inside a loop over the unbounded order list', caching: 'the result is written to the cache with no expiry declared', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/domain/orders.js', 'the lookup is issued inside a loop over the list result'], ['src/data/order-repository.js', 'the cache write declares no expiry']],
        },
        {
          fields: { access_pattern: 'look up an order by identifier through a raw statement', entity: 'Order', supporting_index: 'the identifier index', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'an external value is interpolated into a statement string rather than parameterized. The location is recorded as an input to security discovery; no exploitability is asserted here']],
        },
        {
          fields: { access_pattern: 'place an order and record an audit event', entity: 'Order', supporting_index: 'the identifier index', amplification_finding: 'two writes to two objects are issued as separate statements with no enclosing transaction', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/domain/orders.js', 'the order write and the audit write are sequential awaits with no transaction boundary between them']],
        },
      ],
      note: 'Every record here derives from source inspection. No execution, plan, or monitoring evidence was supplied, so no record claims measured performance.',
    },

    lifecycle: {
      completeness: 'Partial',
      completenessReason: 'backup configuration, restore records, and any storage lifecycle rule live outside the audited repository. Retention could be examined only as far as the repository declares it',
      lineage: [['framework.database.entities', ['lifecycle-0001', 'lifecycle-0002', 'lifecycle-0003', 'lifecycle-0004']]],
      records: [
        { unknown: 'the repository declares no retention period, scheduled job, expiry, or deletion path for this entity. Absence of a statement is an unknown retention position, not unlimited retention', fields: { entity: 'Customer', deletion_path: 'unknown' }, evidence: [['prisma/schema.prisma', 'the model declares no soft-delete marker, expiry, or timestamp supporting expiry']] },
        { unknown: 'the repository declares no retention period, scheduled job, expiry, or deletion path for this entity', fields: { entity: 'Order', deletion_path: 'unknown' }, evidence: [['src/data/order-repository.js', 'no path in scope deletes the entity']] },
        { unknown: 'the repository declares no retention period for this entity, and its lifetime is bound to its parent by a declared cascade that was not observed in the store', fields: { entity: 'OrderItem', deletion_path: 'unknown' }, evidence: [['prisma/schema.prisma', 'deletion is declared to cascade from the parent']] },
        { unknown: 'the entity is append-only, no path in scope deletes or prunes it, and the repository declares no retention period. Growth is therefore unbounded and the position is unknown rather than unlimited', fields: { entity: 'AuditEvent', deletion_path: 'none' }, evidence: [['src/data/audit-log.js', 'the only path in scope writes the entity and none reads, prunes, or archives it']] },
      ],
    },

    health: {
      completeness: 'Complete',
      lineage: [
        ['framework.database.schema', ['health-0001']],
        ['framework.database.constraints', ['health-0003']],
        ['framework.database.indexes', ['health-0005']],
        ['framework.database.security', ['health-0009']],
        ['framework.database.lifecycle', ['health-0010']],
      ],
      records: [
        { fields: { dimension: 'schema clarity', score: 4, calculation: 'one authoritative structural source, four models, and a consistent naming convention across them', supporting_records: 'schema-0001,schema-0002,schema-0003,schema-0004', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['prisma/schema.prisma', 'derived from the schema records of this run']] },
        { fields: { dimension: 'entity and relationship modelling', score: 4, calculation: 'four entities, each with a declared identity strategy, and two declared relationships with stated cardinality', supporting_records: 'entity-0001,entity-0002,entity-0003,entity-0004', evidence_state: 'Observed', confidence: 'High' }, evidence: [['prisma/schema.prisma', 'derived from the entity and relationship records of this run']] },
        { fields: { dimension: 'integrity enforcement', score: 2, calculation: 'six of seven invariants are declared in the mapper schema and inferred to reach the store, one referential action is defaulted rather than declared, and one invariant is enforced nowhere', supporting_records: 'constraint-0004,constraint-0007', evidence_state: 'Inferred', confidence: 'Medium', bound_low: 1, bound_high: 3 }, evidence: [['prisma/schema.prisma', 'derived from the constraint records of this run']] },
        { unknown: 'schema change in this subject is not managed by a migration mechanism, and the migration artifact of this run is NotApplicable. STD-0011 R-13 forbids a NotApplicable input lowering a score, so no score is recorded for this dimension; the coupling of schema change to process start is carried as a risk instead', fields: { dimension: 'migration discipline', calculation: 'not calculated; the input for this dimension is a finding about the subject, which must not lower a score', supporting_records: 'schema-0005' }, evidence: [['package.json', 'the mechanism that applies schema change is recorded in the schema artifact of this run']] },
        { fields: { dimension: 'index and access-pattern fit', score: 2, calculation: 'two of five evidenced access patterns have no supporting index, and the one explicitly declared index supports no path in scope', supporting_records: 'index-0004,performance-0001,performance-0002', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['src/data/order-repository.js', 'derived from the index and performance records of this run']] },
        { fields: { dimension: 'transaction correctness', score: 1, calculation: 'the one multi-object write path in scope issues its writes as separate statements with no transaction boundary, and no transaction management appears anywhere in scope', supporting_records: 'performance-0005', evidence_state: 'Observed', confidence: 'High', escalation_flag: true }, evidence: [['src/domain/orders.js', 'derived from the performance records of this run']] },
        { fields: { dimension: 'query construction consistency', score: 2, calculation: 'every access is confined to one module, and one of six paths interpolates an external value into a statement string rather than parameterizing it', supporting_records: 'performance-0004', evidence_state: 'Observed', confidence: 'High' }, evidence: [['src/data/order-repository.js', 'derived from the performance records of this run']] },
        { fields: { dimension: 'classification coverage', score: 1, calculation: 'no classification register exists; two entities carry candidate personal or unbounded free-text data identified only by field naming, which is a weak signal', supporting_records: 'entity-0001,entity-0004', evidence_state: 'Observed', confidence: 'High', escalation_flag: true }, evidence: [['prisma/schema.prisma', 'derived from the entity records of this run']] },
        { fields: { dimension: 'access-control separation', score: 2, calculation: 'one credential reference serves both the application workload and the schema push, and no second principal is declared', supporting_records: 'security-0001', evidence_state: 'Inferred', confidence: 'Low', bound_low: 1, bound_high: 3 }, evidence: [['package.json', 'derived from the security records of this run']] },
        { unknown: 'no entity in scope carries a retention period, an enforcing mechanism, or a deletion path, so there is no observation from which a score could be calculated', fields: { dimension: 'retention and lifecycle control', calculation: 'not calculated; every lifecycle record of this run is itself Unknown', supporting_records: 'lifecycle-0001,lifecycle-0002,lifecycle-0003,lifecycle-0004' }, evidence: [['prisma/schema.prisma', 'no retention declaration exists in scope']] },
        { unknown: 'backup configuration and restore records live outside the audited repository and none was supplied to this run. Recovery capability is unknown, which is not the same as absent', fields: { dimension: 'recoverability', calculation: 'not calculated; no backup or restore evidence was available to this run', supporting_records: 'lifecycle-0004' }, evidence: [['config/database.json', 'the repository declares no backup mechanism']] },
        { fields: { dimension: 'documentation traceability', score: 2, calculation: 'the repository documents the persistence approach in prose but declares no data classification, retention, or recovery documentation', supporting_records: 'schema-0005', evidence_state: 'Observed', confidence: 'Medium' }, evidence: [['README.txt', 'the only prose documentation in scope']] },
      ],
    },

    risks: {
      completeness: 'Complete',
      lineage: [
        ['framework.database.schema', ['risk-0001']],
        ['framework.database.constraints', ['risk-0002']],
        ['framework.database.security', ['risk-0003']],
        ['framework.database.performance', ['risk-0004', 'risk-0005', 'risk-0006']],
        ['framework.database.entities', ['risk-0007']],
      ],
      records: [
        {
          fields: { risk: 'starting the process changes the database schema and accepts data loss', cause: 'the start script pushes the mapper schema with data loss accepted, and the pipeline release stage invokes the start script', impact: 'a schema change cannot be reviewed, ordered, or reversed independently of a deploy, and a structural change that drops a column would be applied without a preserving step', affected_entities: 'Customer, Order, OrderItem, AuditEvent', supporting_records: 'schema-0005', likelihood_rationale: 'the coupling is declared in both the manifest and the pipeline, and applies on every release', reversibility: 'irreversible', owner_candidate: 'the team that owns the release pipeline', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['package.json', 'the start script applies schema with data loss accepted before starting the process']],
        },
        {
          fields: { risk: 'order status admits any value', cause: 'the status field is declared as free text with no check constraint and no validation in any path in scope', impact: 'an unexpected status value can be written and no store or application rule would reject it', affected_entities: 'Order', supporting_records: 'constraint-0007', likelihood_rationale: 'the write path passes the request through to the store without validating the field', reversibility: 'reversible', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['prisma/schema.prisma', 'the field carries no check declaration'], ['src/domain/orders.js', 'the write path performs no validation']],
        },
        {
          fields: { risk: 'one credential serves the application and structural change', cause: 'the same environment reference resolves the credential for the running process and for the schema push', impact: 'the credential the application runs under is sufficient to alter structure, so a compromise of the application reaches the schema', affected_entities: 'Customer, Order, OrderItem, AuditEvent', supporting_records: 'security-0001', likelihood_rationale: 'no second principal or reference is declared anywhere in scope', reversibility: 'reversible', owner_candidate: 'the team that owns the database credentials', evidence_state: 'Inferred', confidence: 'Low' },
          evidence: [['prisma/schema.prisma', 'one datasource reference is declared'], ['package.json', 'the same process applies schema and serves requests']],
        },
        {
          fields: { risk: 'an unbounded read grows with the order table', cause: 'the list path reads every order with no limit and the domain then issues one customer lookup per row', impact: 'response time and memory grow with the entity, and the amplification multiplies the effect', affected_entities: 'Order, Customer', supporting_records: 'performance-0001,performance-0003', likelihood_rationale: 'the entity growth class is transactional, so the set grows with use', reversibility: 'reversible', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'the read declares no limit'], ['src/domain/orders.js', 'the lookup is issued inside the loop']],
        },
        {
          fields: { risk: 'an external value is interpolated into a statement', cause: 'one repository path builds a statement string by interpolation rather than passing a parameter', impact: 'the statement is constructed from a value the caller supplies, which is the condition under which injection becomes possible', affected_entities: 'Order', supporting_records: 'performance-0004', likelihood_rationale: 'the path is reachable from the repository interface, and the value is not validated in any path in scope', reversibility: 'reversible', owner_candidate: 'the team that owns the data module', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'the value is interpolated into the statement string']],
          note: 'Recorded as an evidenced risk, not a confirmed vulnerability. AUD-0003 Stage 10 forbids the escalation without security testing.',
        },
        {
          fields: { risk: 'candidate personal data is cached with no expiry', cause: 'the customer record, which carries an email and a name, is serialized into the cache and the write declares no expiry', impact: 'a copy of candidate personal data persists in a second store with weaker declared controls and no evidenced deletion path', affected_entities: 'Customer', supporting_records: 'performance-0003', likelihood_rationale: 'the cache write is on the path taken for every listed order', reversibility: 'reversible', owner_candidate: 'the team that owns the data module', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'the cache write declares no expiry']],
        },
        {
          fields: { risk: 'an append-only entity has no retention position and no reader', cause: 'audit events are written by one path, read by none, pruned by none, and no retention period is declared', impact: 'the entity grows without bound while holding free-text payloads of unknown classification', affected_entities: 'AuditEvent', supporting_records: 'entity-0004', likelihood_rationale: 'the write is on the order placement path and no counterbalancing path exists', reversibility: 'reversible', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/audit-log.js', 'the only path that touches the entity writes to it']],
        },
      ],
    },

    recommendations: {
      completeness: 'Complete',
      lineage: [
        ['framework.database.risks', ['recommendation-0001', 'recommendation-0002', 'recommendation-0003', 'recommendation-0004', 'recommendation-0005', 'recommendation-0006']],
      ],
      records: [
        {
          fields: { action: 'separate schema change from process start and adopt an ordered, reversible mechanism', source_records: 'risk-0001', problem: 'the release stage applies schema with data loss accepted as a side effect of starting the process', verification: 'a release that changes no schema leaves the structure unchanged, and a structural change is applied by a reviewed step with a recorded order', owner_candidate: 'the team that owns the release pipeline', deferral_risk: 'a column removal reaches a deployed environment with no preserving step and no reversal', priority: 1, evidence_state: 'Observed', confidence: 'Low' },
          evidence: [['package.json', 'the start script couples the two']],
        },
        {
          fields: { action: 'parameterize the raw lookup path', source_records: 'risk-0005', problem: 'an external value is interpolated into a statement string', verification: 'the path passes the value as a parameter and a security review confirms no interpolated statement remains', owner_candidate: 'the team that owns the data module', deferral_risk: 'the condition under which injection is possible remains open', priority: 1, evidence_state: 'Observed', confidence: 'Low' },
          evidence: [['src/data/order-repository.js', 'the interpolation site']],
        },
        {
          fields: { action: 'issue a distinct credential for structural change', source_records: 'risk-0003', problem: 'one credential reference serves the application workload and the schema push', verification: 'the application credential can no longer alter structure, confirmed against the store grants', owner_candidate: 'the team that owns the database credentials', deferral_risk: 'a compromise of the application reaches the schema', priority: 2, evidence_state: 'Inferred', confidence: 'Low' },
          evidence: [['prisma/schema.prisma', 'one datasource reference']],
        },
        {
          fields: { action: 'bound the order list and resolve customers in one read', source_records: 'risk-0004', problem: 'an unfiltered read is followed by one lookup per row', verification: 'the list path declares a limit and the customer is resolved by a single read for the page', owner_candidate: 'the team that owns the data module', deferral_risk: 'response time and memory grow with the entity', priority: 2, evidence_state: 'Observed', confidence: 'Low' },
          evidence: [['src/domain/orders.js', 'the loop']],
        },
        {
          fields: { action: 'declare an expiry on the cached customer and classify the fields it holds', source_records: 'risk-0006', problem: 'candidate personal data is copied into a second store with no expiry and no classification register', verification: 'the cache write declares an expiry and a steward has confirmed the classification of the fields', owner_candidate: 'the data steward', deferral_risk: 'a copy of personal data persists in a store nobody has classified', priority: 2, evidence_state: 'Observed', confidence: 'Low' },
          evidence: [['src/data/order-repository.js', 'the cache write']],
        },
        {
          fields: { action: 'state a retention position for every entity, beginning with the audit event', source_records: 'risk-0007', problem: 'no entity carries a retention period, an enforcing mechanism, or a deletion path', verification: 'each entity has a stated period with a scheduled mechanism, and the mechanism has been observed to run', owner_candidate: 'the data steward', deferral_risk: 'an append-only entity holding free text grows without bound and without a stated obligation', priority: 3, evidence_state: 'Observed', confidence: 'Low' },
          evidence: [['src/data/audit-log.js', 'the write path with no counterpart']],
        },
      ],
    },
  },
};
