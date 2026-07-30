// AUD-0002 subject profiles.
//
// The conclusions Architecture Discovery reaches about one subject. This file is
// data, not logic: the methodology that shapes it into artifacts is
// architecture-discovery.mjs, and the framework rules that shape those artifacts
// are the sibling generic modules.
//
// It exists because a second subject made a property of the first reference
// producer explicit: a conclusion such as "src/domain holds the ordering rules"
// is a judgement about a subject, not a rule of the methodology, and cannot be
// derived by the producer that records it. Separating the two keeps the
// methodology honest — the same code reaches both subjects — and keeps the
// judgements where a reviewer can challenge them.

export const SUBJECTS = {
  // The third subject. An HTTP API service: the same methodology, a subject whose
  // shape is neither of the first two.
  'orders-api': {
    declaredScope: 'every path in the subject repository at the audited revision, excluding version control internals',
    exclusions: [],
    inaccessibleDirectories: [],
    technology: {
      completeness: 'Complete',
      records: [
        { technology: 'node', role: 'runtime', declaration_path: 'package.json', ecosystem: 'npm', note: 'package manifest declares an ES module entry point' },
        { technology: 'express', role: 'runtime', declaration_path: 'package.json', version_constraint: '4.19.2', ecosystem: 'npm', is_transitive: false, note: 'declared as a runtime dependency and imported by the entry point' },
        { technology: '@prisma/client', role: 'data', declaration_path: 'package.json', version_constraint: '5.14.0', ecosystem: 'npm', is_transitive: false, note: 'declared as a runtime dependency and imported by the data module' },
        { technology: 'postgresql', role: 'data', declaration_path: 'prisma/schema.prisma', note: 'the mapper datasource names postgresql as its provider' },
        { technology: 'zod', role: 'runtime', declaration_path: 'package.json', version_constraint: '3.23.8', ecosystem: 'npm', is_transitive: false, note: 'declared as a runtime dependency and imported by the request schemas' },
        { technology: 'prisma', role: 'development-support', declaration_path: 'package.json', version_constraint: '5.14.0', ecosystem: 'npm', is_transitive: false, note: 'declared as a development dependency' },
        { technology: 'node-test-runner', role: 'test', declaration_path: 'package.json', note: 'test script invokes the platform test runner' },
      ],
    },
    build: {
      completeness: 'Complete',
      records: [
        { command: 'npm run build', definition_path: 'package.json', controller: 'local-script', outputs: 'unknown', reproducibility_note: 'the script the command invokes is not present in scope at this revision', state: 'Observed', confidence: 'Medium' },
        { command: 'npm ci', definition_path: '.ci/pipeline.yml', controller: 'ci-pipeline', ci_reference: '.ci/pipeline.yml#install', state: 'Observed', confidence: 'High' },
        { command: 'npm test', definition_path: '.ci/pipeline.yml', controller: 'ci-pipeline', ci_reference: '.ci/pipeline.yml#test', state: 'Observed', confidence: 'High' },
        { command: 'npm start', definition_path: '.ci/pipeline.yml', controller: 'ci-pipeline', ci_reference: '.ci/pipeline.yml#release', state: 'Observed', confidence: 'High' },
      ],
    },
    entrypoints: {
      completeness: 'Complete',
      records: [
        {
          fields: {
            entry_point: 'src/index.js',
            entry_kind: 'service',
            declaration_path: 'package.json',
            owning_module: 'src',
            initialization_trace: 'index.js builds the application, registers the body parser, then authentication, then tenant scoping, then the order routes, then the admin routes where a configuration flag permits, then the error handler, and listens on the configured port',
            audience: 'production',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [
            ['package.json', 'manifest names src/index.js as main and as the start script'],
            ['src/index.js', 'module registers middleware and routes and calls listen at import time'],
          ],
        },
      ],
    },
    dependencies: {
      completeness: 'Partial',
      completenessReason: 'no lockfile is present in scope, so the transitive dependency set could not be examined',
      evidenceLocation: 'package.json',
      evidenceNote: 'dependency declared in the package manifest',
      records: [
        { from_component: 'orders-api', to_dependency: 'express', directness: 'direct', declaration_path: 'package.json', version_constraint: '4.19.2', is_pinned: true },
        { from_component: 'orders-api', to_dependency: '@prisma/client', directness: 'direct', declaration_path: 'package.json', version_constraint: '5.14.0', is_pinned: true },
        { from_component: 'orders-api', to_dependency: 'zod', directness: 'direct', declaration_path: 'package.json', version_constraint: '3.23.8', is_pinned: true },
        { from_component: 'orders-api', to_dependency: 'prisma', directness: 'direct', declaration_path: 'package.json', version_constraint: '5.14.0', is_pinned: true },
      ],
    },
    modules: {
      completeness: 'Complete',
      records: [
        { module: 'src/routes', boundary_evidence: 'namespace', responsibility: 'registers each exposed operation against the application', public_interface: 'registerOrderRoutes, registerAdminRoutes', depends_on_modules: 'src/handlers' },
        { module: 'src/handlers', boundary_evidence: 'namespace', responsibility: 'serves a registered operation and sequences the work it requires', public_interface: 'listOrders, placeOrder, cancelOrder, reindex, purge', depends_on_modules: 'src/data' },
        { module: 'src/middleware', boundary_evidence: 'namespace', responsibility: 'performs the checks a request passes before a handler runs', public_interface: 'authenticate, requireTenantScope, validate' },
        { module: 'src/data', boundary_evidence: 'namespace', responsibility: 'owns every path that reaches a data store', public_interface: 'OrderRepository' },
        { module: 'src/clients', boundary_evidence: 'namespace', responsibility: 'owns every path that leaves the process for another service', public_interface: 'charge, notify' },
        { module: 'src/errors', boundary_evidence: 'namespace', responsibility: 'maps a failure onto the shape a caller sees', public_interface: 'errorHandler' },
      ],
    },
    layers: {
      completeness: 'Complete',
      records: [
        {
          fields: { layer: 'interface', member_modules: 'src/routes, src/middleware, src/errors', organizing_principle: 'directory-per-responsibility', permitted_direction: 'interface may depend on application', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['src/routes/orders.js', 'the module imports handlers and registers them; it holds no rule of its own']],
        },
        {
          fields: { layer: 'application', member_modules: 'src/handlers', organizing_principle: 'directory-per-responsibility', permitted_direction: 'application may depend on data and on outbound clients', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['src/handlers/orders.js', 'each handler sequences a repository call and an outbound call']],
        },
        {
          fields: { layer: 'data', member_modules: 'src/data, src/clients', organizing_principle: 'directory-per-responsibility', permitted_direction: 'data depends on no layer within the subject', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['src/data/order-repository.js', 'every mapper call in scope is made from this module']],
        },
      ],
    },
    classification: {
      completeness: 'Complete',
      lineage: [['framework.architecture.modules', ['classification-0001', 'classification-0002']], ['framework.architecture.layers', ['classification-0001']]],
      records: [
        {
          fields: { candidate: 'layered', is_dominant: true, supporting_evidence: 'six modules in a directory-per-responsibility arrangement, with every store access confined to the data module and every registration confined to the routes module', rationale: 'assumes the directory arrangement reflects the intended layering and that no dependency exists outside the declared imports', evidence_state: 'Inferred', confidence: 'Medium' },
          evidence: [['src/', 'directory arrangement and the import graph the modules declare']],
        },
        {
          fields: { candidate: 'microservices', is_dominant: false, supporting_evidence: 'a single deployable entry point and no service boundary within the subject', excluded_by: 'one entry point and no inter-service transport in scope', evidence_state: 'Inferred', confidence: 'Medium' },
          evidence: [['package.json', 'one start script and one main entry']],
        },
      ],
    },
    runtime: {
      completeness: 'Complete',
      records: [
        {
          fields: { component: 'orders-api', component_kind: 'service', trigger: 'process start', declaration_path: 'package.json', state_ownership: 'none held in process; the mapper client is constructed per module and every durable value is held in the external store', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/index.js', 'the entry point constructs one application and listens; no second process is declared in scope']],
        },
      ],
    },
    integrations: {
      completeness: 'Complete',
      records: [
        {
          fields: { integration: 'primary relational store', direction: 'outbound', protocol: 'postgresql', adapter_path: 'src/data/order-repository.js', activity: 'configured', auth_boundary: 'credential referenced by environment variable', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['prisma/schema.prisma', 'the datasource names a provider and takes its url from the environment']],
        },
        {
          fields: { integration: 'payment service', direction: 'outbound', protocol: 'https', adapter_path: 'src/clients/payments.js', activity: 'configured', auth_boundary: 'base address referenced by environment variable', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['src/clients/payments.js', 'the module issues a request to a configured base address on the order placement path']],
        },
        {
          fields: { integration: 'notification service', direction: 'outbound', protocol: 'https', adapter_path: 'src/clients/notifications.js', activity: 'configured', auth_boundary: 'base address referenced by environment variable', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['src/clients/notifications.js', 'the module issues a request to a configured base address on the order placement path']],
        },
      ],
    },
    configuration: {
      completeness: 'Complete',
      evidenceLocation: 'config/default.json',
      records: [
        { key: 'port', source: 'environment', is_secret_reference: false, consumers: 'src/index.js', evidence_location: 'config/default.json' },
        { key: 'adminRoutesEnabled', source: 'environment', is_secret_reference: false, consumers: 'src/index.js', evidence_location: 'config/default.json' },
        { key: 'requireTenantScope', source: 'environment', is_secret_reference: false, consumers: 'src/middleware/authorize.js', evidence_location: 'config/default.json' },
        { key: 'DATABASE_URL', source: 'environment', is_secret_reference: true, precedence_rank: 1, consumers: 'prisma/schema.prisma', evidence_location: 'config/database.json' },
        { key: 'PAYMENTS_BASE_URL', source: 'environment', is_secret_reference: true, precedence_rank: 2, consumers: 'src/clients/payments.js', evidence_location: 'config/clients.json' },
        { key: 'NOTIFICATIONS_BASE_URL', source: 'environment', is_secret_reference: true, precedence_rank: 3, consumers: 'src/clients/notifications.js', evidence_location: 'config/clients.json' },
      ],
    },
    deployment: {
      completeness: 'NotApplicable',
      completenessReason: 'the subject declares no deployment target, environment definition, or orchestration manifest within the audited scope. This is a finding about the subject, not an input this run was unable to obtain',
      records: [],
    },
    risks: {
      completeness: 'Complete',
      lineage: [['framework.architecture.dependencies', ['risk-0001']], ['framework.architecture.modules', ['risk-0002']]],
      records: [
        {
          fields: { risk: 'the transitive dependency set is unverifiable at this revision', cause: 'no lockfile is present in scope, so the manifest constraints are the only declaration of what is installed', impact: 'a build at this revision cannot be shown to install the same tree as any other build of it', supporting_records: 'dependency-0001,dependency-0002,dependency-0003,dependency-0004', likelihood_rationale: 'the condition holds for every install performed from this revision', reversibility: 'reversible', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['package.json', 'four direct dependencies declared and no lockfile beside the manifest']],
        },
        {
          fields: { risk: 'the exposed surface is decided by configuration rather than by the code', cause: 'one group of routes is registered only where a configuration flag holds a particular value at process start', impact: 'the set of operations a deployment exposes cannot be determined from the repository alone', supporting_records: 'module-0001', likelihood_rationale: 'the flag is read once at startup on every deployment', reversibility: 'reversible', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['src/index.js', 'a route group is registered inside a conditional over a configuration value']],
        },
      ],
    },
    health: {
      completeness: 'Complete',
      lineage: [['framework.architecture.modules', ['health-0001']], ['framework.architecture.layers', ['health-0002']], ['framework.architecture.dependencies', ['health-0003']], ['framework.architecture.deployment', ['health-0004']]],
      records: [
        { dimension: 'modularity', score: 4, calculation: 'six modules, each with one declared responsibility and one exported interface, and no import crossing a declared boundary in scope', supporting_records: 'module-0001,module-0002,module-0003,module-0004,module-0005,module-0006', state: 'Observed', confidence: 'High' },
        { dimension: 'boundary-integrity', score: 4, calculation: 'three layers with no observed dependency against the permitted direction', supporting_records: 'layer-0001,layer-0002,layer-0003', state: 'Observed', confidence: 'Medium' },
        { dimension: 'dependency-hygiene', score: 2, calculation: 'every direct dependency is pinned, and the transitive set could not be examined', supporting_records: 'dependency-0001,dependency-0002,dependency-0003,dependency-0004', state: 'Observed', confidence: 'Medium' },
        { dimension: 'deployment-clarity', unknown: 'the subject declares no deployment definition in scope, so no observation supports a score. STD-0011 R-13 forbids a NotApplicable input lowering a score, so none is recorded for this dimension', supporting_records: 'none' },
      ],
    },
  },
  'orders-service': {
    declaredScope: 'every path in the subject repository at the audited revision, excluding version control internals',
    exclusions: [
      { path: 'restricted/', reason: 'outside the authorization boundary declared for this run' },
    ],
    inaccessibleDirectories: ['restricted'],
    technology: {
      completeness: 'Complete',
      records: [
        { technology: 'node', role: 'runtime', declaration_path: 'package.json', ecosystem: 'npm', note: 'package manifest declares an ES module entry point' },
        { technology: 'tiny-router', role: 'runtime', declaration_path: 'package.json', version_constraint: '1.4.2', ecosystem: 'npm', is_transitive: false, note: 'declared as a runtime dependency' },
        { technology: 'bundler-lite', role: 'build', declaration_path: 'package.json', version_constraint: '^2.0.0', ecosystem: 'npm', is_transitive: false, note: 'declared as a development dependency' },
        { technology: 'node-test-runner', role: 'test', declaration_path: 'package.json', note: 'test script invokes the platform test runner' },
      ],
    },
    build: {
      completeness: 'Complete',
      records: [
        { command: 'npm run build', definition_path: 'package.json', controller: 'local-script', outputs: 'unknown', reproducibility_note: 'the script the command invokes is not present in scope at this revision', state: 'Observed', confidence: 'Medium' },
        { command: 'npm ci', definition_path: '.ci/pipeline.yml', controller: 'ci-pipeline', ci_reference: '.ci/pipeline.yml#install', state: 'Observed', confidence: 'High' },
        { command: 'npm run build', definition_path: '.ci/pipeline.yml', controller: 'ci-pipeline', ci_reference: '.ci/pipeline.yml#build', state: 'Observed', confidence: 'High' },
        { command: 'npm test', definition_path: '.ci/pipeline.yml', controller: 'ci-pipeline', ci_reference: '.ci/pipeline.yml#test', state: 'Observed', confidence: 'High' },
      ],
    },
    entrypoints: {
      completeness: 'Complete',
      records: [
        {
          fields: {
            entry_point: 'src/index.js',
            entry_kind: 'service',
            declaration_path: 'package.json',
            owning_module: 'src',
            initialization_trace: 'index.js constructs the store, then the service, then the router, and listens on the configured port',
            audience: 'production',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [
            ['package.json', 'manifest names src/index.js as main and as the start script'],
            ['src/index.js', 'module invokes a listener at import time unless the environment is test'],
          ],
        },
      ],
    },
    dependencies: {
      completeness: 'Partial',
      completenessReason: 'no lockfile is present in scope, so the transitive dependency set could not be examined',
      evidenceLocation: 'package.json',
      evidenceNote: 'dependency declared in the package manifest',
      records: [
        { from_component: 'orders-service', to_dependency: 'tiny-router', directness: 'direct', declaration_path: 'package.json', version_constraint: '1.4.2', is_pinned: true },
        { from_component: 'orders-service', to_dependency: 'bundler-lite', directness: 'direct', declaration_path: 'package.json', version_constraint: '^2.0.0', is_pinned: false },
      ],
    },
    modules: {
      completeness: 'Complete',
      records: [
        { module: 'src/api', boundary_evidence: 'namespace', responsibility: 'translates transport concerns into domain calls', public_interface: 'createRouter', depends_on_modules: 'src/domain' },
        { module: 'src/domain', boundary_evidence: 'namespace', responsibility: 'holds the ordering rules', public_interface: 'OrderService' },
        { module: 'src/data', boundary_evidence: 'namespace', responsibility: 'owns persistence of orders', public_interface: 'InMemoryOrderStore' },
      ],
    },
    layers: {
      completeness: 'Complete',
      records: [
        { fields: { layer: 'interface', member_modules: 'src/api', permitted_direction: 'interface may depend on domain', organizing_principle: 'directory-per-layer', evidence_state: 'Observed', confidence: 'High' }, evidence: [['src/api/routes.js', 'imports the domain module and no data module']] },
        { fields: { layer: 'domain', member_modules: 'src/domain', permitted_direction: 'domain depends on no layer', organizing_principle: 'directory-per-layer', evidence_state: 'Observed', confidence: 'High' }, evidence: [['src/domain/orders.js', 'module declares no import of another layer']] },
        { fields: { layer: 'data', member_modules: 'src/data', permitted_direction: 'data depends on no layer', organizing_principle: 'directory-per-layer', evidence_state: 'Observed', confidence: 'High' }, evidence: [['src/data/repository.js', 'module declares no import of another layer']] },
      ],
    },
    classification: {
      completeness: 'Complete',
      lineage: [
        ['framework.architecture.modules', ['classification-0001']],
        ['framework.architecture.layers', ['classification-0001']],
      ],
      records: [
        {
          fields: { candidate: 'layered', supporting_evidence: 'three modules in a directory-per-layer arrangement with dependencies running interface to domain only', is_dominant: true, rationale: 'assumes the directory arrangement reflects the intended layering and that no dependency exists outside the declared imports', evidence_state: 'Inferred', confidence: 'Medium' },
          evidence: [['src/', 'module and layer records of this run, taken together']],
          extra: { load_bearing_inputs: ['framework.architecture.modules', 'framework.architecture.layers'] },
        },
        {
          fields: { candidate: 'microservices', supporting_evidence: 'a single deployable entry point and no service boundary within the subject', is_dominant: false, excluded_by: 'one entry point and no inter-service transport in scope', evidence_state: 'Inferred', confidence: 'Medium' },
          evidence: [['package.json', 'a single main entry point is declared']],
          extra: { load_bearing: false },
        },
      ],
    },
    runtime: {
      completeness: 'Partial',
      completenessReason: 'orchestration definitions under restricted/ are outside the authorization boundary, so the runtime component set beyond the declared entry point was not examined',
      records: [
        {
          fields: { component: 'orders-service', component_kind: 'service', declaration_path: 'package.json', trigger: 'process start', state_ownership: 'in-memory order store held by the running process', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/index.js', 'entry point starts a listener; no orchestration definition was read']],
        },
      ],
    },
    integrations: {
      completeness: 'NotApplicable',
      completenessReason: 'the subject declares no outbound client, no inbound integration beyond its own entry point, and no external transport; the system exchanges nothing with any external system',
      records: [],
    },
    configuration: {
      completeness: 'Complete',
      evidenceLocation: 'config/default.json',
      records: [
        { key: 'port', source: 'file', is_secret_reference: false, default_declared: '8080', consumers: 'src/index.js' },
        { key: 'logLevel', source: 'file', is_secret_reference: false, default_declared: 'info' },
        { key: 'ORDERS_SIGNING_KEY', source: 'environment', is_secret_reference: true, precedence_rank: 1 },
      ],
    },
    deployment: {
      completeness: 'Unavailable',
      completenessReason: 'deployment definitions are present under restricted/ and sit outside the authorization boundary declared for this run; authorization was refused rather than the subject lacking a deployment',
      records: [],
    },
    risks: {
      completeness: 'Complete',
      lineage: [
        ['framework.architecture.build', ['risk-0001']],
        ['framework.architecture.scope', ['risk-0002']],
      ],
      records: [
        {
          fields: { risk: 'the declared build command cannot be shown to produce anything', cause: 'package.json declares a build script whose target is absent from the subject at this revision', impact: 'a consumer relying on the build artifact flow has nothing to rely on', supporting_records: 'build-0001', likelihood_rationale: 'the command is declared in two places and the script is absent from both', next_verification: 'read the build script at a revision where it is present, or execute the command under authorization', reversibility: 'reversible', evidence_state: 'Inferred', confidence: 'Medium' },
          evidence: [['package.json', 'build script names a path not present in scope']],
          extra: { load_bearing_inputs: ['framework.architecture.build'] },
        },
        {
          fields: { risk: 'deployment topology is unexamined', cause: 'the deployment definitions sit outside the authorization boundary of this run', impact: 'no conclusion about how the service reaches an environment can be drawn from this artifact set', supporting_records: 'scope-0004', likelihood_rationale: 'the boundary is declared and the artifact was recorded Unavailable rather than empty', next_verification: 're-run with authorization covering restricted/', reversibility: 'reversible', evidence_state: 'Inferred', confidence: 'Medium' },
          evidence: [['restricted/', 'path present and not opened']],
          extra: { load_bearing_inputs: ['framework.architecture.deployment'] },
        },
      ],
    },
    health: {
      completeness: 'Complete',
      lineage: [
        ['framework.architecture.modules', ['health-0001']],
        ['framework.architecture.layers', ['health-0002']],
        ['framework.architecture.dependencies', ['health-0003']],
        ['framework.architecture.build', ['health-0004']],
        ['framework.architecture.configuration', ['health-0005']],
        ['framework.architecture.deployment', ['health-0006']],
        ['framework.architecture.runtime', ['health-0007']],
      ],
      records: [
        { dimension: 'modularity', score: 4, calculation: 'three modules with single exported interfaces and no cross-layer import observed', supporting_records: 'module-0001,module-0002,module-0003', state: 'Observed', confidence: 'High' },
        { dimension: 'boundary-integrity', score: 4, calculation: 'no import crossing a layer boundary in the wrong direction was observed', supporting_records: 'layer-0001,layer-0002,layer-0003', state: 'Observed', confidence: 'High' },
        { dimension: 'dependency-hygiene', score: 3, calculation: 'one dependency pinned, one ranged, transitive set unexamined', supporting_records: 'dependency-0001,dependency-0002', state: 'Inferred', confidence: 'Medium', bound_low: 2, bound_high: 4 },
        { dimension: 'build-reproducibility', score: 2, calculation: 'a declared build command whose script is absent in scope', supporting_records: 'build-0001', state: 'Inferred', confidence: 'Medium' },
        { dimension: 'configuration-clarity', score: 4, calculation: 'every key declares a source and the one secret is referenced rather than embedded', supporting_records: 'configuration-0001,configuration-0002,configuration-0003', state: 'Observed', confidence: 'High' },
        { dimension: 'deployment-clarity', unknown: 'the deployment artifact of this run is Unavailable; the definitions exist and were not authorized for reading', supporting_records: 'risk-0002' },
        { dimension: 'runtime-operability', unknown: 'the runtime artifact of this run is Partial and its unexamined boundary is the orchestration definitions', supporting_records: 'runtime-0001' },
      ],
    },
  },

  'orders-db': {
    declaredScope: 'every path in the subject repository at the audited revision, excluding version control internals',
    exclusions: [],
    inaccessibleDirectories: [],
    technology: {
      completeness: 'Complete',
      records: [
        { technology: 'node', role: 'runtime', declaration_path: 'package.json', ecosystem: 'npm', note: 'package manifest declares an ES module entry point' },
        { technology: '@prisma/client', role: 'data', declaration_path: 'package.json', version_constraint: '5.9.1', ecosystem: 'npm', is_transitive: false, note: 'declared as a runtime dependency and constructed in the data module' },
        { technology: 'ioredis', role: 'data', declaration_path: 'package.json', version_constraint: '^5.3.0', ecosystem: 'npm', is_transitive: false, note: 'declared as a runtime dependency and constructed in the data module' },
        { technology: 'prisma', role: 'development-support', declaration_path: 'package.json', version_constraint: '^5.9.0', ecosystem: 'npm', is_transitive: false, note: 'declared as a development dependency and invoked by the start script' },
        { technology: 'node-test-runner', role: 'test', declaration_path: 'package.json', note: 'test script invokes the platform test runner' },
      ],
    },
    build: {
      completeness: 'Complete',
      records: [
        { command: 'npm ci', definition_path: '.ci/pipeline.yml', controller: 'ci-pipeline', ci_reference: '.ci/pipeline.yml#install', state: 'Observed', confidence: 'High' },
        { command: 'npx prisma generate', definition_path: '.ci/pipeline.yml', controller: 'ci-pipeline', ci_reference: '.ci/pipeline.yml#generate', outputs: 'a generated client, not present in scope at this revision', state: 'Observed', confidence: 'High' },
        { command: 'npm test', definition_path: '.ci/pipeline.yml', controller: 'ci-pipeline', ci_reference: '.ci/pipeline.yml#test', state: 'Observed', confidence: 'High' },
        { command: 'npm start', definition_path: '.ci/pipeline.yml', controller: 'ci-pipeline', ci_reference: '.ci/pipeline.yml#release', reproducibility_note: 'the start script applies schema before starting the process, so the release stage changes the database', state: 'Observed', confidence: 'High' },
      ],
    },
    entrypoints: {
      completeness: 'Complete',
      records: [
        {
          fields: {
            entry_point: 'src/index.js',
            entry_kind: 'service',
            declaration_path: 'package.json',
            owning_module: 'src',
            initialization_trace: 'index.js constructs the repository, the audit log, the service, and the router, and listens on the configured port',
            audience: 'production',
            evidence_state: 'Observed',
            confidence: 'High',
          },
          evidence: [
            ['package.json', 'manifest names src/index.js as main and the start script runs it after a schema push'],
            ['src/index.js', 'module invokes a listener at import time unless the environment is test'],
          ],
        },
      ],
    },
    dependencies: {
      completeness: 'Partial',
      completenessReason: 'no lockfile is present in scope, so the transitive dependency set could not be examined',
      evidenceLocation: 'package.json',
      evidenceNote: 'dependency declared in the package manifest',
      records: [
        { from_component: 'orders-db', to_dependency: '@prisma/client', directness: 'direct', declaration_path: 'package.json', version_constraint: '5.9.1', is_pinned: true },
        { from_component: 'orders-db', to_dependency: 'ioredis', directness: 'direct', declaration_path: 'package.json', version_constraint: '^5.3.0', is_pinned: false },
        { from_component: 'orders-db', to_dependency: 'prisma', directness: 'direct', declaration_path: 'package.json', version_constraint: '^5.9.0', is_pinned: false },
      ],
    },
    modules: {
      completeness: 'Complete',
      records: [
        { module: 'src/api', boundary_evidence: 'namespace', responsibility: 'translates transport concerns into domain calls', public_interface: 'createRouter', depends_on_modules: 'src/domain' },
        { module: 'src/domain', boundary_evidence: 'namespace', responsibility: 'holds the ordering rules and sequences the writes an order requires', public_interface: 'OrderService' },
        { module: 'src/data', boundary_evidence: 'namespace', responsibility: 'owns every path that reaches a data store', public_interface: 'OrderRepository, AuditLog' },
      ],
    },
    layers: {
      completeness: 'Complete',
      records: [
        { fields: { layer: 'interface', member_modules: 'src/api', permitted_direction: 'interface may depend on domain', organizing_principle: 'directory-per-layer', evidence_state: 'Observed', confidence: 'High' }, evidence: [['src/api/routes.js', 'imports nothing outside its own module and receives the service as an argument']] },
        { fields: { layer: 'domain', member_modules: 'src/domain', permitted_direction: 'domain depends on no layer', organizing_principle: 'directory-per-layer', evidence_state: 'Observed', confidence: 'High' }, evidence: [['src/domain/orders.js', 'module declares no import of another layer and receives its collaborators as arguments']] },
        { fields: { layer: 'data', member_modules: 'src/data', permitted_direction: 'data depends on no layer', organizing_principle: 'directory-per-layer', evidence_state: 'Observed', confidence: 'High' }, evidence: [['src/data/order-repository.js', 'module imports the database client and no other layer']] },
      ],
    },
    classification: {
      completeness: 'Complete',
      lineage: [
        ['framework.architecture.modules', ['classification-0001']],
        ['framework.architecture.layers', ['classification-0001']],
      ],
      records: [
        {
          fields: { candidate: 'layered', supporting_evidence: 'three modules in a directory-per-layer arrangement with every store access confined to the data module', is_dominant: true, rationale: 'assumes the directory arrangement reflects the intended layering and that no dependency exists outside the declared imports', evidence_state: 'Inferred', confidence: 'Medium' },
          evidence: [['src/', 'module and layer records of this run, taken together']],
          extra: { load_bearing_inputs: ['framework.architecture.modules', 'framework.architecture.layers'] },
        },
        {
          fields: { candidate: 'microservices', supporting_evidence: 'a single deployable entry point and no service boundary within the subject', is_dominant: false, excluded_by: 'one entry point and no inter-service transport in scope', evidence_state: 'Inferred', confidence: 'Medium' },
          evidence: [['package.json', 'a single main entry point is declared']],
          extra: { load_bearing: false },
        },
      ],
    },
    runtime: {
      completeness: 'Complete',
      records: [
        {
          fields: { component: 'orders-db', component_kind: 'service', declaration_path: 'package.json', trigger: 'process start', state_ownership: 'none held in process; every durable value is held in an external store', evidence_state: 'Observed', confidence: 'Medium' },
          evidence: [['src/index.js', 'entry point starts a listener and constructs no in-process store']],
        },
      ],
    },
    integrations: {
      completeness: 'Complete',
      records: [
        {
          fields: { integration: 'primary relational store', direction: 'outbound', adapter_path: 'src/data/order-repository.js', protocol: 'postgresql', auth_boundary: 'credential referenced by environment variable', activity: 'configured', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['src/data/order-repository.js', 'a database client is constructed at module load'], ['config/database.json', 'a connection target is declared by reference']],
        },
        {
          fields: { integration: 'cache store', direction: 'outbound', adapter_path: 'src/data/order-repository.js', protocol: 'redis', auth_boundary: 'credential referenced by environment variable', activity: 'configured', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['src/data/order-repository.js', 'a cache client is constructed at module load from the declared configuration']],
        },
      ],
    },
    configuration: {
      completeness: 'Complete',
      evidenceLocation: 'config/database.json',
      records: [
        { key: 'port', source: 'file', is_secret_reference: false, default_declared: '8080', consumers: 'src/index.js' },
        { key: 'logLevel', source: 'file', is_secret_reference: false, default_declared: 'info' },
        { key: 'DATABASE_URL', source: 'environment', is_secret_reference: true, precedence_rank: 1, consumers: 'prisma/schema.prisma' },
        { key: 'DATABASE_REPLICA_URL', source: 'environment', is_secret_reference: true, precedence_rank: 2 },
        { key: 'REDIS_URL', source: 'environment', is_secret_reference: true, precedence_rank: 3, consumers: 'src/data/order-repository.js' },
      ],
    },
    deployment: {
      completeness: 'NotApplicable',
      completenessReason: 'the subject declares no packaging, no target environment, and no deployment definition of any kind; the release stage of its pipeline runs the start script directly. Nothing was withheld from this run',
      records: [],
    },
    risks: {
      completeness: 'Complete',
      lineage: [
        ['framework.architecture.build', ['risk-0001']],
        ['framework.architecture.configuration', ['risk-0002']],
      ],
      records: [
        {
          fields: { risk: 'the release stage applies schema change to a database', cause: 'the start script runs a schema push before starting the process, and the pipeline release stage runs the start script', impact: 'a deploy and a schema change cannot be separated, and a rollback of the process does not roll back the schema', supporting_records: 'build-0004', likelihood_rationale: 'the coupling is declared in both the manifest and the pipeline', next_verification: 'confirm with the owning team which environments the release stage targets', reversibility: 'irreversible', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['.ci/pipeline.yml', 'the release stage invokes the start script'], ['package.json', 'the start script applies schema before starting the process']],
          extra: { load_bearing_inputs: ['framework.architecture.build'] },
        },
        {
          fields: { risk: 'transport verification is disabled for the primary store', cause: 'the database configuration declares that certificate verification is not required', impact: 'a connection to the primary store can be established with an unverified peer', supporting_records: 'configuration-0003', likelihood_rationale: 'the setting is declared in the configuration the data module loads', next_verification: 'confirm the setting for each deployed environment', reversibility: 'reversible', evidence_state: 'Observed', confidence: 'High' },
          evidence: [['config/database.json', 'the declared connection posture disables peer verification']],
          extra: { load_bearing_inputs: ['framework.architecture.configuration'] },
        },
      ],
    },
    health: {
      completeness: 'Complete',
      lineage: [
        ['framework.architecture.modules', ['health-0001']],
        ['framework.architecture.layers', ['health-0002']],
        ['framework.architecture.dependencies', ['health-0003']],
        ['framework.architecture.build', ['health-0004']],
        ['framework.architecture.configuration', ['health-0005']],
        ['framework.architecture.integrations', ['health-0006']],
        ['framework.architecture.runtime', ['health-0007']],
      ],
      records: [
        { dimension: 'modularity', score: 4, calculation: 'three modules with declared interfaces and every store access confined to one of them', supporting_records: 'module-0001,module-0002,module-0003', state: 'Observed', confidence: 'High' },
        { dimension: 'boundary-integrity', score: 4, calculation: 'no import crossing a layer boundary in the wrong direction was observed', supporting_records: 'layer-0001,layer-0002,layer-0003', state: 'Observed', confidence: 'High' },
        { dimension: 'dependency-hygiene', score: 3, calculation: 'one dependency pinned, two ranged, transitive set unexamined', supporting_records: 'dependency-0001,dependency-0002,dependency-0003', state: 'Inferred', confidence: 'Medium', bound_low: 2, bound_high: 4 },
        { dimension: 'build-reproducibility', score: 2, calculation: 'the release stage of the pipeline changes a database as a side effect of starting the process', supporting_records: 'build-0004', state: 'Observed', confidence: 'High' },
        { dimension: 'configuration-clarity', score: 3, calculation: 'every key declares a source and every secret is referenced rather than embedded, and one declared connection posture disables peer verification', supporting_records: 'configuration-0003,configuration-0004,configuration-0005', state: 'Observed', confidence: 'High' },
        { dimension: 'integration-governance', score: 2, calculation: 'two outbound stores are configured, neither declares a contract reference, and one is reached with verification disabled', supporting_records: 'integration-0001,integration-0002', state: 'Observed', confidence: 'Medium' },
        { dimension: 'deployment-clarity', unknown: 'the subject declares no deployment definition, so no observation in this run supports or refuses a score for this dimension', supporting_records: 'build-0004' },
      ],
    },
  },
};
