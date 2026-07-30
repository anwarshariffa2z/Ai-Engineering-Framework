// AUD-0005 subject profiles.
//
// The conclusions Backend Discovery reaches about one subject. Data, not logic:
// the methodology that shapes it into artifacts is backend-discovery.mjs, and the
// framework rules that shape those artifacts are the sibling generic modules.
//
// Two things in here are worth a reader's attention because they are what a third
// producer was needed to show. The first is that four absence states arise from
// four different causes and none of them shares a code path: `execution` is
// NotApplicable because the subject genuinely has no asynchronous work, several
// records are Unknown because a determination could not be made from the source,
// `resilience` is Partial because part of its evidence lives outside the
// repository, and Unavailable arises only where an input this run needed did not
// arrive. The second is that the three-hop conclusions in `dataaccess` are drawn
// from upstream artifacts this run consumed rather than from the subject alone,
// and their confidence is capped accordingly.

export const SUBJECTS = {
  'orders-api': {
    declaredScope: 'every path in the subject repository at the audited revision that registers, serves, guards, or bounds a server-side operation',
    exclusions: [],

    // Stage 1. A service is a unit that is independently deployed or independently
    // triggered. One entry point, one deployable, no worker and no scheduler.
    services: {
      completeness: 'Complete',
      lineage: [
        ['framework.architecture.entrypoints', ['service-0001']],
        ['framework.architecture.runtime', ['service-0001']],
      ],
      records: [
        {
          fields: {
            service: 'orders-api',
            deployment_unit: 'the single process the package manifest starts',
            execution_model: 'request-response',
            owning_module: 'src',
            state_ownership: 'none held in process; every durable value is held in the external store',
            evidence_state: 'Observed',
            confidence: 'Medium',
          },
          evidence: [
            ['package.json', 'one start script naming one entry point, and no second process declared in scope'],
            ['src/index.js', 'the entry point builds one application and listens'],
          ],
        },
      ],
    },

    // Stage 2. A registered route is not an implemented operation. Every record
    // below names the site that registers it and the handler that serves it, or
    // records that the pairing could not be established.
    interfaces: {
      completeness: 'Complete',
      lineage: [['framework.backend.services', ['interface-0001', 'interface-0002', 'interface-0003', 'interface-0004', 'interface-0005']]],
      records: [
        {
          fields: { operation: 'list orders', service: 'orders-api', protocol: 'http', registration_path: 'src/routes/orders.js', handler_path: 'src/handlers/orders.js', auth_requirement: 'required', exposure: 'external', caller_references: 'none in scope', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/routes/orders.js', 'a registration names a method, a path, and an imported handler']],
        },
        {
          fields: { operation: 'place order', service: 'orders-api', protocol: 'http', registration_path: 'src/routes/orders.js', handler_path: 'src/handlers/orders.js', auth_requirement: 'required', exposure: 'external', caller_references: 'none in scope', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/routes/orders.js', 'a registration names a method, a path, a validator, and an imported handler']],
        },
        {
          fields: { operation: 'cancel order', service: 'orders-api', protocol: 'http', registration_path: 'src/routes/orders.js', handler_path: 'src/handlers/orders.js', auth_requirement: 'required', exposure: 'external', caller_references: 'none in scope', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/routes/orders.js', 'a registration names a method, a path, and an imported handler']],
        },
        {
          // The registration site and the handler module are both observed. Which
          // export within that module serves which path is selected at run time by
          // a name lookup, which is recorded as the reason the confidence is not
          // High rather than as a determination that could not be made.
          fields: { operation: 'admin reindex', service: 'orders-api', protocol: 'http', registration_path: 'src/routes/admin.js', handler_path: 'src/handlers/index.js', auth_requirement: 'required', exposure: 'internal', caller_references: 'none in scope', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/routes/admin.js', 'a loop registers each table entry against a handler selected by name from a namespace import; the module is named in the import and the export is selected at run time']],
        },
        {
          fields: { operation: 'admin purge', service: 'orders-api', protocol: 'http', registration_path: 'src/routes/admin.js', handler_path: 'src/handlers/index.js', auth_requirement: 'required', exposure: 'internal', caller_references: 'none in scope', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/routes/admin.js', 'a loop registers each table entry against a handler selected by name from a namespace import; the module is named in the import and the export is selected at run time']],
        },
      ],
    },

    // Stage 3. The validating code is the contract. Where a specification and an
    // implementation disagree both are recorded and neither is preferred.
    contracts: {
      completeness: 'Complete',
      lineage: [['framework.backend.interfaces', ['contract-0001', 'contract-0002', 'contract-0003', 'contract-0004']]],
      records: [
        {
          fields: { operation: 'place order', schema_authority: 'code', validation_location: 'src/middleware/validate.js applying src/handlers/schemas.js', request_shape: 'an object carrying a customer identifier and a list of items', response_shape: 'an object carrying the created identifier', divergence: 'the published specification requires a currency field that the validating schema does not declare. Both are recorded; neither is preferred', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [
            ['src/handlers/schemas.js', 'the schema declares two properties and no currency'],
            ['spec/openapi.yaml', 'the published operation lists currency among its required properties'],
          ],
        },
        {
          fields: { operation: 'list orders', schema_authority: 'none', validation_location: 'absent: no validator is registered for this operation', response_shape: 'a list of orders with their items', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/routes/orders.js', 'the registration names a handler and no validator']],
        },
        {
          fields: { operation: 'cancel order', schema_authority: 'none', validation_location: 'absent: no validator is registered for this operation', response_shape: 'an empty body', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/routes/orders.js', 'the registration names a handler and no validator']],
        },
        {
          fields: { operation: 'daily report', schema_authority: 'specification', validation_location: 'absent: no registration for this operation exists in scope', divergence: 'the operation is published in the specification and registered nowhere in the source. It is a documented intention, not a removed operation', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['spec/openapi.yaml', 'an operation is published with no corresponding registration anywhere in scope']],
        },
      ],
    },

    // Stage 4. Asynchronous work is work — and this subject has none. Not a hole
    // in the audit: the declared scope was examined in full and the subject
    // declares no queue, no consumer, no scheduler, and no deferred path.
    execution: {
      completeness: 'NotApplicable',
      completenessReason: 'every execution path in scope is the synchronous request path of a registered operation. The subject declares no queue, topic, consumer, scheduler, or background task, so there is no execution path of the kind this type counts. This is a finding about the subject, not an input this run was unable to obtain',
      records: [],
    },

    // Stage 5. The three-hop conclusions. Each derives from an entity this run did
    // not observe itself: it read them from the database artifact, which in turn
    // derived them from the architecture module artifact.
    dataaccess: {
      completeness: 'Complete',
      lineage: [
        ['framework.database.entities', ['dataaccess-0001', 'dataaccess-0002', 'dataaccess-0003', 'dataaccess-0004', 'dataaccess-0005']],
        ['framework.database.connections', ['dataaccess-0001', 'dataaccess-0002', 'dataaccess-0003', 'dataaccess-0004', 'dataaccess-0005']],
      ],
      records: [
        {
          fields: { service: 'orders-api', entity: 'Order', operation_kind: 'read', access_location: 'src/data/order-repository.js', transaction_boundary: 'none: a single read', is_shared_write: false, evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'the listing method issues one filtered read including the related items']],
        },
        {
          // The finding of the run. Two dependent writes, no transaction. The
          // entity names are taken from the upstream database artifact rather than
          // re-derived, which is what caps this conclusion at Medium.
          fields: { service: 'orders-api', entity: 'Order, OrderItem', operation_kind: 'write', access_location: 'src/data/order-repository.js', transaction_boundary: 'absent: two dependent writes are issued as independent calls', is_shared_write: false, evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'an order write and an item write are awaited in sequence with no surrounding transaction']],
        },
        {
          fields: { service: 'orders-api', entity: 'Order', operation_kind: 'write', access_location: 'src/data/order-repository.js', transaction_boundary: 'declared: the status change is issued inside an explicit transaction', isolation_declaration: 'none declared; the store default applies', is_shared_write: false, evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'the status change is wrapped in an explicit transaction call']],
        },
        {
          fields: { service: 'orders-api', entity: 'Order', operation_kind: 'write', access_location: 'src/data/order-repository.js', transaction_boundary: 'none: a single unfiltered update', is_shared_write: false, evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'a maintenance path issues an update with no filter']],
        },
        {
          fields: { service: 'orders-api', entity: 'Order', operation_kind: 'write', access_location: 'src/data/order-repository.js', transaction_boundary: 'none: a single filtered delete', is_shared_write: false, evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'a maintenance path deletes on a status and an instant supplied by the caller']],
        },
      ],
    },

    // Stage 6. Declared policy is not applied policy. What is declared is recorded
    // as declared; what applies at a call site is recorded separately.
    resilience: {
      completeness: 'Partial',
      completenessReason: 'circuit-breaking, rate-limiting, and pool-level bulkheading are configured outside the audited repository and none of that configuration was supplied to this run. What is recorded is what the repository declares',
      lineage: [['framework.architecture.integrations', ['resilience-0001', 'resilience-0002']]],
      records: [
        {
          fields: { dependency: 'payment service', policy_kind: 'timeout', declaration_site: 'config/clients.json', timeout: '2000ms', override_sites: 'none in scope: the single call site takes the declared value', evidence_state: 'Observed', confidence: 'High' },
          evidence: [
            ['config/clients.json', 'a timeout is declared for the dependency'],
            ['src/clients/payments.js', 'the call site reads the declared timeout rather than constructing its own'],
          ],
        },
        {
          fields: { dependency: 'payment service', policy_kind: 'retry', declaration_site: 'config/clients.json', retry_count: 3, backoff: 'absent: no backoff is declared beside the retry count', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['config/clients.json', 'a retry count is declared with no backoff and no idempotency guard beside it']],
        },
        {
          fields: { dependency: 'notification service', policy_kind: 'timeout', declaration_site: 'absent: no timeout is declared for this dependency anywhere in scope', fallback_path: 'absent: a failure propagates to the caller', evidence_state: 'Observed', confidence: 'High' },
          evidence: [
            ['config/clients.json', 'the dependency is configured with a base address and no policy'],
            ['src/clients/notifications.js', 'the call site issues the request with no timeout signal'],
          ],
        },
      ],
    },

    // Stage 7. What a caller learns when a failure occurs.
    errors: {
      completeness: 'Complete',
      records: [
        {
          fields: { failure: 'a uniqueness violation raised by the store', handler_location: 'src/errors/handler.js', client_visible_shape: 'a conflict status with a single error word', internal_source: 'the mapper error code for a unique constraint violation', is_swallowed: false, discloses_internal_detail: false, evidence_state: 'Observed', confidence: 'High' },
          evidence: [['src/errors/handler.js', 'one branch maps a mapper error code onto a conflict response']],
        },
        {
          // The finding. Every failure other than one is reported as success.
          fields: { failure: 'every failure other than a uniqueness violation', handler_location: 'src/errors/handler.js', client_visible_shape: 'a success status carrying an affirmative body', internal_source: 'any error reaching the handler', is_swallowed: true, discloses_internal_detail: false, evidence_state: 'Observed', confidence: 'High' },
          evidence: [['src/errors/handler.js', 'the fallback branch logs the error and responds with a success status']],
        },
      ],
    },

    // Stage 8. Enforcement has a location, or it is recorded as unknown.
    boundaries: {
      completeness: 'Complete',
      lineage: [['framework.backend.interfaces', ['boundary-0001', 'boundary-0002', 'boundary-0003', 'boundary-0004']]],
      records: [
        {
          fields: { operation: 'every registered operation', check_kind: 'authentication', enforcement_location: 'src/middleware/authenticate.js', condition_evaluated: 'presence of an authorization header, from which a principal is decoded', is_environmental: false, evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/index.js', 'the middleware is registered before every route registration, so it precedes each of them']],
        },
        {
          // Whether the check runs at all is decided by a value read at startup.
          // The check exists; whether it enforces anything is the unknown.
          unknown: 'whether this check enforces anything depends on a configuration value read at process start, which is supplied by the environment and is not present in the repository. The check is registered and its condition is visible; what it does in any deployment is not determinable from the source',
          fields: { operation: 'every registered operation', check_kind: 'authorization', enforcement_location: 'src/middleware/authorize.js', condition_evaluated: 'presence of a tenant on the decoded principal, evaluated only where a configuration flag holds a particular value', is_environmental: true },
          evidence: [['src/middleware/authorize.js', 'the middleware returns without evaluating its condition unless a configuration value matches']],
        },
        {
          fields: { operation: 'place order', check_kind: 'input-validation', enforcement_location: 'src/middleware/validate.js', condition_evaluated: 'the request body against the declared schema', is_environmental: false, evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/routes/orders.js', 'the validator is named in the registration for this operation and for no other']],
        },
        {
          fields: { operation: 'cancel order', check_kind: 'input-validation', enforcement_location: 'absent: no validator is named in the registration and no check is performed in the handler', is_environmental: false, evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/routes/orders.js', 'a sibling operation names a validator and this one does not']],
        },
      ],
    },

    risks: {
      completeness: 'Complete',
      lineage: [
        ['framework.backend.errors', ['backendrisk-0001']],
        ['framework.backend.dataaccess', ['backendrisk-0002']],
        ['framework.backend.resilience', ['backendrisk-0003']],
        ['framework.backend.boundaries', ['backendrisk-0004']],
        ['framework.backend.contracts', ['backendrisk-0005']],
      ],
      records: [
        {
          fields: { risk: 'every failure but one is reported to the caller as success', cause: 'the terminal error handler logs the error and responds with a success status on every branch except a uniqueness violation', impact: 'a caller cannot distinguish a completed request from a failed one, and no retry or compensation is possible on the caller side', supporting_records: 'error-0002', likelihood_rationale: 'the handler is registered last and therefore terminal for every registered operation', reversibility: 'reversible', next_verification: 'a request forced to fail returns a non-success status', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['src/errors/handler.js', 'the fallback branch responds with a success status']],
        },
        {
          fields: { risk: 'an order and its items are written without a transaction', cause: 'the creation path issues two dependent writes as independent calls', impact: 'a failure between them leaves an order with no items, and the error handler above reports that failure as success', supporting_records: 'dataaccess-0002', likelihood_rationale: 'the sequence runs on every order placement', reversibility: 'reversible', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/data/order-repository.js', 'two awaited writes with no surrounding transaction']],
        },
        {
          fields: { risk: 'a request can be held open by a dependency with no timeout', cause: 'one outbound dependency is called on the order placement path with no timeout, no retry, and no fallback declared anywhere in scope', impact: 'a slow dependency holds the request open for as long as it is slow, and the request path has no bound of its own', supporting_records: 'resilience-0003', likelihood_rationale: 'the call is on the placement path and runs on every order', reversibility: 'reversible', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/clients/notifications.js', 'the request carries no timeout signal']],
        },
        {
          // The only load-bearing input is a boundary record that reached no
          // determination, so under STD-0007 R-28 this reaches none either. The
          // registration is recorded; whether it enforces anything is not.
          unknown: 'the only load-bearing input for this risk is the tenant scoping boundary record, which itself reached no determination because the check is conditioned on a value supplied by the environment. STD-0007 R-28 makes a conclusion drawn from an Unknown input Unknown: this run establishes that the check is conditional and establishes nothing about whether it enforces',
          fields: { risk: 'whether authorization is enforced cannot be established from the repository', cause: 'the tenant scoping check returns without evaluating its condition unless a configuration flag holds a particular value at process start', impact: 'unknown: a deployment with the flag set enforces tenant scoping and one without it does not, and which holds is not determinable here', supporting_records: 'boundary-0002', next_verification: 'the deployed configuration of each environment is read and recorded' },
          evidence: [['src/middleware/authorize.js', 'the condition is guarded by a configuration comparison']],
        },
        {
          fields: { risk: 'the published contract and the enforced contract disagree', cause: 'the specification requires a field the validating schema does not declare, and publishes an operation that is registered nowhere', impact: 'a caller written against the specification can send a request the service rejects, or call an address that does not exist', supporting_records: 'contract-0001,contract-0004', likelihood_rationale: 'the specification is the artifact a caller is given', reversibility: 'reversible', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['spec/openapi.yaml', 'one operation requires an undeclared field and one operation has no registration']],
        },
      ],
    },

    health: {
      completeness: 'Complete',
      lineage: [
        ['framework.backend.services', ['backendhealth-0001']],
        ['framework.backend.interfaces', ['backendhealth-0002']],
        ['framework.backend.contracts', ['backendhealth-0003']],
        ['framework.backend.dataaccess', ['backendhealth-0004', 'backendhealth-0005']],
        ['framework.backend.resilience', ['backendhealth-0006']],
        ['framework.backend.errors', ['backendhealth-0007']],
        ['framework.backend.boundaries', ['backendhealth-0008']],
        ['framework.backend.execution', ['backendhealth-0009']],
      ],
      records: [
        { dimension: 'service-boundary-clarity', score: 4, calculation: 'one service with one deployment unit and one entry point, and no library reported as a service', supporting_records: 'service-0001', state: 'Observed', confidence: 'Medium' },
        { dimension: 'interface-discipline', score: 2, calculation: 'three of five operations name both a registration and a handler; two name a registration whose handler could not be established', supporting_records: 'interface-0001,interface-0002,interface-0003,interface-0004,interface-0005', state: 'Observed', confidence: 'Medium' },
        { dimension: 'contract-integrity', score: 1, calculation: 'one of four operations is validated, one published operation has no registration, and the one validated operation diverges from its published shape', supporting_records: 'contract-0001,contract-0002,contract-0003,contract-0004', state: 'Observed', confidence: 'Medium', escalation_flag: true },
        { dimension: 'data-access-ownership', score: 4, calculation: 'every access path in scope is issued from one module, and no shared write was observed', supporting_records: 'dataaccess-0001,dataaccess-0002,dataaccess-0003,dataaccess-0004,dataaccess-0005', state: 'Observed', confidence: 'Medium' },
        { dimension: 'transaction-discipline', score: 1, calculation: 'one of five access paths declares a transaction, and the one path with two dependent writes declares none', supporting_records: 'dataaccess-0002,dataaccess-0003', state: 'Observed', confidence: 'Medium', escalation_flag: true },
        { dimension: 'resilience-posture', score: 2, calculation: 'one of two outbound dependencies declares a timeout; the retry declared beside it carries no backoff, and the second dependency declares no policy at all', supporting_records: 'resilience-0001,resilience-0002,resilience-0003', state: 'Observed', confidence: 'Medium' },
        { dimension: 'error-handling-quality', score: 0, calculation: 'the terminal handler maps one failure and reports every other as success', supporting_records: 'error-0001,error-0002', state: 'Observed', confidence: 'High', escalation_flag: true },
        {
          dimension: 'boundary-enforcement-coverage',
          unknown: 'one of the four boundary records this dimension scores reached no determination, because whether the authorization check enforces anything depends on a value supplied by the environment. STD-0007 R-28 makes a score drawn from an Unknown input Unknown, and R-31 admits a score only as an assessment supported by findings',
          supporting_records: 'boundary-0001,boundary-0002,boundary-0003,boundary-0004',
        },
        {
          // The execution family is NotApplicable for this subject. STD-0011 R-13
          // forbids a NotApplicable input lowering a score, so no score is recorded
          // rather than a zero that R-34 would then escalate.
          dimension: 'execution-model-clarity',
          unknown: 'the subject declares no asynchronous, scheduled, or event-driven execution path, so the artifact this dimension would score is NotApplicable. STD-0011 R-13 forbids a NotApplicable input lowering a score, so none is recorded for this dimension',
          supporting_records: 'none',
        },
      ],
    },
  },
};
