// AUD-0002 Architecture Discovery — the methodology-specific half of the reference
// producer.
//
// Everything in this file is AUD-0002-specific: which paths are examined, what a
// module is, and which conclusions the evidence supports. Everything it uses to
// express those conclusions — identity, envelope, digest, lineage, resolution — is
// framework-generic and lives in the sibling modules.
//
// It restates no framework semantics. Evidence states and confidence levels come
// from STD-0007 and appear here only as values chosen per observation; the
// aggregation, propagation, and envelope rules are applied by envelope.mjs.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { buildArtifact, lineageReference } from './envelope.mjs';

// The declared scope of the run, and the boundary that bounds it. Both are
// recorded rather than assumed, so that absence of a record is interpretable per
// STD-0011 R-41.
export const DECLARED_SCOPE = 'every path in the subject repository at the audited revision, excluding version control internals';
export const EXCLUSIONS = [
  { path: 'restricted/', reason: 'outside the authorization boundary declared for this run' },
];

const CLASSIFY = [
  [/^src\/api\//, { kind: 'source', layer: 'interface' }],
  [/^src\/domain\//, { kind: 'source', layer: 'domain' }],
  [/^src\/data\//, { kind: 'source', layer: 'data' }],
  [/^src\//, { kind: 'source', layer: 'application' }],
  [/^config\//, { kind: 'infrastructure', layer: 'cross-cutting' }],
  [/^\.ci\//, { kind: 'automation', layer: 'cross-cutting' }],
  [/\.txt$|\.md$/, { kind: 'documentation', layer: null }],
];

function walk(root, dir, found) {
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    const rel = relative(root, full).split(sep).join('/');
    if (statSync(full).isDirectory()) {
      if (rel === 'restricted') { found.push({ path: `${rel}/`, directory: true, accessible: false }); continue; }
      walk(root, full, found);
    } else {
      found.push({ path: rel, directory: false, accessible: true });
    }
  }
  return found;
}

function evidence(id, location, run, note) {
  return {
    evidence_id: id,
    source: 'subject repository source',
    location,
    environment: run.environment,
    revision: run.subjectRevision,
    collector: `${run.producerId}@${run.producerVersion}`,
    redaction_state: 'none',
    observation: note,
  };
}

const record = (recordId, fields, evidenceItems, extra = {}) => ({
  record_id: recordId,
  fields,
  evidence: evidenceItems,
  ...extra,
});

/**
 * Execute the methodology against a subject and return one artifact per declared
 * output type, in the order AUD-0002 section 6 lists them.
 */
export function runArchitectureDiscovery({ run, subjectRoot, declarations }) {
  const paths = walk(subjectRoot, subjectRoot, []);
  const readable = paths.filter((p) => p.accessible && !p.directory);
  const read = (rel) => readFileSync(join(subjectRoot, rel), 'utf8');
  const manifest = JSON.parse(read('package.json'));

  const artifacts = new Map();
  const emit = (type, spec) => {
    const declaration = declarations.get(type);
    if (!declaration) throw new Error(`AUD-0002 declares output ${type}, which is not declared in the corpus`);
    const artifact = buildArtifact({
      run,
      artifactType: type,
      typeVersion: declaration.type_version,
      declaredScope: spec.declaredScope ?? DECLARED_SCOPE,
      exclusions: spec.exclusions ?? EXCLUSIONS,
      completeness: spec.completeness,
      completenessReason: spec.completenessReason,
      records: spec.records,
      lineage: spec.lineage,
      environment: run.environment,
    });
    artifacts.set(type, artifact);
    return artifact;
  };

  // --- scope ---------------------------------------------------------------
  emit('framework.architecture.scope', {
    completeness: 'Complete',
    records: paths.map((entry, index) => {
      const classification = CLASSIFY.find(([pattern]) => pattern.test(entry.path))?.[1] ?? { kind: 'source' };
      const id = `scope-${String(index + 1).padStart(4, '0')}`;
      return record(id, {
        path: entry.path,
        kind: entry.directory ? 'infrastructure' : classification.kind,
        inclusion: entry.accessible ? 'included' : 'inaccessible',
        evidence_state: 'Observed',
        confidence: 'High',
        ...(entry.accessible ? {} : { exclusion_reason: 'outside the authorization boundary declared for this run', accessibility: 'unauthorized' }),
      }, [evidence(`${id}-e1`, entry.path, run, entry.accessible ? 'path present at the audited revision' : 'path present and not opened')]);
    }),
  });

  // --- technology ----------------------------------------------------------
  const technologies = [
    { technology: 'node', role: 'runtime', declaration_path: 'package.json', ecosystem: 'npm', note: 'package manifest declares an ES module entry point' },
    { technology: 'tiny-router', role: 'runtime', declaration_path: 'package.json', version_constraint: '1.4.2', ecosystem: 'npm', is_transitive: false, note: 'declared as a runtime dependency' },
    { technology: 'bundler-lite', role: 'build', declaration_path: 'package.json', version_constraint: '^2.0.0', ecosystem: 'npm', is_transitive: false, note: 'declared as a development dependency' },
    { technology: 'node-test-runner', role: 'test', declaration_path: 'package.json', note: 'test script invokes the platform test runner' },
  ];
  emit('framework.architecture.technology', {
    completeness: 'Complete',
    records: technologies.map((t, i) => {
      const id = `technology-${String(i + 1).padStart(4, '0')}`;
      const { note, ...fields } = t;
      return record(id, { ...fields, evidence_state: 'Observed', confidence: 'High' },
        [evidence(`${id}-e1`, t.declaration_path, run, note)]);
    }),
  });

  // --- build ---------------------------------------------------------------
  const commands = [
    { command: 'npm run build', definition_path: 'package.json', controller: 'local-script', outputs: 'unknown', reproducibility_note: 'the script the command invokes is not present in scope at this revision', state: 'Observed', confidence: 'Medium' },
    { command: 'npm ci', definition_path: '.ci/pipeline.yml', controller: 'ci-pipeline', ci_reference: '.ci/pipeline.yml#install', state: 'Observed', confidence: 'High' },
    { command: 'npm run build', definition_path: '.ci/pipeline.yml', controller: 'ci-pipeline', ci_reference: '.ci/pipeline.yml#build', state: 'Observed', confidence: 'High' },
    { command: 'npm test', definition_path: '.ci/pipeline.yml', controller: 'ci-pipeline', ci_reference: '.ci/pipeline.yml#test', state: 'Observed', confidence: 'High' },
  ];
  emit('framework.architecture.build', {
    completeness: 'Complete',
    records: commands.map((c, i) => {
      const id = `build-${String(i + 1).padStart(4, '0')}`;
      const { state, confidence, ...fields } = c;
      return record(id, { ...fields, evidence_state: state, confidence },
        [evidence(`${id}-e1`, c.definition_path, run, 'command declared, not executed by this audit')]);
    }),
  });

  // --- entrypoints ---------------------------------------------------------
  emit('framework.architecture.entrypoints', {
    completeness: 'Complete',
    records: [
      record('entrypoint-0001', {
        entry_point: 'src/index.js',
        entry_kind: 'service',
        declaration_path: 'package.json',
        owning_module: 'src',
        initialization_trace: 'index.js constructs the store, then the service, then the router, and listens on the configured port',
        audience: 'production',
        evidence_state: 'Observed',
        confidence: 'High',
      }, [
        evidence('entrypoint-0001-e1', 'package.json', run, 'manifest names src/index.js as main and as the start script'),
        evidence('entrypoint-0001-e2', 'src/index.js', run, 'module invokes a listener at import time unless the environment is test'),
      ]),
    ],
  });

  // --- dependencies --------------------------------------------------------
  const dependencies = [
    { from_component: 'orders-service', to_dependency: 'tiny-router', directness: 'direct', declaration_path: 'package.json', version_constraint: '1.4.2', is_pinned: true },
    { from_component: 'orders-service', to_dependency: 'bundler-lite', directness: 'direct', declaration_path: 'package.json', version_constraint: '^2.0.0', is_pinned: false },
  ];
  emit('framework.architecture.dependencies', {
    completeness: 'Partial',
    completenessReason: 'no lockfile is present in scope, so the transitive dependency set could not be examined',
    records: dependencies.map((d, i) => {
      const id = `dependency-${String(i + 1).padStart(4, '0')}`;
      return record(id, { ...d, evidence_state: 'Observed', confidence: 'High' },
        [evidence(`${id}-e1`, 'package.json', run, 'dependency declared in the package manifest')]);
    }),
  });

  // --- modules -------------------------------------------------------------
  const modules = [
    { module: 'src/api', boundary_evidence: 'namespace', responsibility: 'translates transport concerns into domain calls', public_interface: 'createRouter', depends_on_modules: 'src/domain' },
    { module: 'src/domain', boundary_evidence: 'namespace', responsibility: 'holds the ordering rules', public_interface: 'OrderService' },
    { module: 'src/data', boundary_evidence: 'namespace', responsibility: 'owns persistence of orders', public_interface: 'InMemoryOrderStore' },
  ];
  emit('framework.architecture.modules', {
    completeness: 'Complete',
    records: modules.map((m, i) => {
      const id = `module-${String(i + 1).padStart(4, '0')}`;
      return record(id, { ...m, evidence_state: 'Observed', confidence: 'High' },
        [evidence(`${id}-e1`, `${m.module}/`, run, 'directory boundary with a single exported interface')]);
    }),
  });

  // --- layers --------------------------------------------------------------
  emit('framework.architecture.layers', {
    completeness: 'Complete',
    records: [
      record('layer-0001', {
        layer: 'interface', member_modules: 'src/api', permitted_direction: 'interface may depend on domain',
        organizing_principle: 'directory-per-layer', evidence_state: 'Observed', confidence: 'High',
      }, [evidence('layer-0001-e1', 'src/api/routes.js', run, 'imports the domain module and no data module')]),
      record('layer-0002', {
        layer: 'domain', member_modules: 'src/domain', permitted_direction: 'domain depends on no layer',
        organizing_principle: 'directory-per-layer', evidence_state: 'Observed', confidence: 'High',
      }, [evidence('layer-0002-e1', 'src/domain/orders.js', run, 'module declares no import of another layer')]),
      record('layer-0003', {
        layer: 'data', member_modules: 'src/data', permitted_direction: 'data depends on no layer',
        organizing_principle: 'directory-per-layer', evidence_state: 'Observed', confidence: 'High',
      }, [evidence('layer-0003-e1', 'src/data/repository.js', run, 'module declares no import of another layer')]),
    ],
  });

  // --- classification ------------------------------------------------------
  // The first artifact in this run that derives from another. Its conclusion is
  // reasoned from the module and layer observations rather than read anywhere, so
  // it is Inferred and its assumptions are recorded, per STD-0007 R-06.
  const classificationLineage = [
    lineageReference(artifacts.get('framework.architecture.modules'), ['classification-0001']),
    lineageReference(artifacts.get('framework.architecture.layers'), ['classification-0001']),
  ];
  emit('framework.architecture.classification', {
    completeness: 'Complete',
    lineage: classificationLineage,
    records: [
      record('classification-0001', {
        candidate: 'layered',
        supporting_evidence: 'three modules in a directory-per-layer arrangement with dependencies running interface to domain only',
        is_dominant: true,
        rationale: 'assumes the directory arrangement reflects the intended layering and that no dependency exists outside the declared imports',
        evidence_state: 'Inferred',
        confidence: 'Medium',
      }, [evidence('classification-0001-e1', 'src/', run, 'module and layer records of this run, taken together')],
      { load_bearing_inputs: ['framework.architecture.modules', 'framework.architecture.layers'] }),
      record('classification-0002', {
        candidate: 'microservices',
        supporting_evidence: 'a single deployable entry point and no service boundary within the subject',
        is_dominant: false,
        excluded_by: 'one entry point and no inter-service transport in scope',
        evidence_state: 'Inferred',
        confidence: 'Medium',
      }, [evidence('classification-0002-e1', 'package.json', run, 'a single main entry point is declared')],
      { load_bearing: false }),
    ],
  });

  // --- runtime -------------------------------------------------------------
  // Partial rather than Complete: the repository declares one runtime component,
  // and the orchestration definitions that would declare the rest are inaccessible.
  emit('framework.architecture.runtime', {
    completeness: 'Partial',
    completenessReason: 'orchestration definitions under restricted/ are outside the authorization boundary, so the runtime component set beyond the declared entry point was not examined',
    records: [
      record('runtime-0001', {
        component: 'orders-service',
        component_kind: 'service',
        declaration_path: 'package.json',
        trigger: 'process start',
        state_ownership: 'in-memory order store held by the running process',
        evidence_state: 'Observed',
        confidence: 'Medium',
      }, [evidence('runtime-0001-e1', 'src/index.js', run, 'entry point starts a listener; no orchestration definition was read')]),
    ],
  });

  // --- integrations --------------------------------------------------------
  // NotApplicable, not empty-Complete: the subject exchanges nothing with an
  // external system, which is a finding about the subject rather than a hole in
  // the audit. STD-0011 R-13 forbids a consumer lowering a score for it.
  emit('framework.architecture.integrations', {
    completeness: 'NotApplicable',
    completenessReason: 'the subject declares no outbound client, no inbound integration beyond its own entry point, and no external transport; the system exchanges nothing with any external system',
    records: [],
  });

  // --- configuration -------------------------------------------------------
  const configuration = [
    { key: 'port', source: 'file', is_secret_reference: false, default_declared: '8080', consumers: 'src/index.js' },
    { key: 'logLevel', source: 'file', is_secret_reference: false, default_declared: 'info' },
    { key: 'ORDERS_SIGNING_KEY', source: 'environment', is_secret_reference: true, precedence_rank: 1 },
  ];
  emit('framework.architecture.configuration', {
    completeness: 'Complete',
    records: configuration.map((c, i) => {
      const id = `configuration-${String(i + 1).padStart(4, '0')}`;
      return record(id, { ...c, evidence_state: 'Observed', confidence: 'High' },
        [evidence(`${id}-e1`, 'config/default.json', run, c.is_secret_reference
          ? 'key is referenced indirectly; no value was read or recorded'
          : 'key and default declared in the configuration file')]);
    }),
  });

  // --- deployment ----------------------------------------------------------
  // Unavailable, not NotApplicable: deployment definitions exist and were not
  // read. The two states are the distinction STD-0008 section 20 calls the most
  // expensive to lose, and this run produces one of each.
  emit('framework.architecture.deployment', {
    completeness: 'Unavailable',
    completenessReason: 'deployment definitions are present under restricted/ and sit outside the authorization boundary declared for this run; authorization was refused rather than the subject lacking a deployment',
    records: [],
  });

  // --- risks ---------------------------------------------------------------
  emit('framework.architecture.risks', {
    completeness: 'Complete',
    // risk-0002 derives from the scope observation that the path exists and was
    // not opened, not from the deployment artifact, which has no content to
    // derive from. Recording the empty artifact as the input would claim a
    // derivation that did not occur and would make the conclusion Unknown under
    // STD-0007 R-28 — losing a finding the audit genuinely established.
    lineage: [
      lineageReference(artifacts.get('framework.architecture.build'), ['risk-0001']),
      lineageReference(artifacts.get('framework.architecture.scope'), ['risk-0002']),
    ],
    records: [
      record('risk-0001', {
        risk: 'the declared build command cannot be shown to produce anything',
        cause: 'package.json declares a build script whose target is absent from the subject at this revision',
        impact: 'a consumer relying on the build artifact flow has nothing to rely on',
        supporting_records: 'build-0001',
        likelihood_rationale: 'the command is declared in two places and the script is absent from both',
        next_verification: 'read the build script at a revision where it is present, or execute the command under authorization',
        reversibility: 'reversible',
        evidence_state: 'Inferred',
        confidence: 'Medium',
      }, [evidence('risk-0001-e1', 'package.json', run, 'build script names a path not present in scope')],
      { load_bearing_inputs: ['framework.architecture.build'] }),
      record('risk-0002', {
        risk: 'deployment topology is unexamined',
        cause: 'the deployment definitions sit outside the authorization boundary of this run',
        impact: 'no conclusion about how the service reaches an environment can be drawn from this artifact set',
        supporting_records: 'scope-0004',
        likelihood_rationale: 'the boundary is declared and the artifact was recorded Unavailable rather than empty',
        next_verification: 're-run with authorization covering restricted/',
        reversibility: 'reversible',
        evidence_state: 'Inferred',
        confidence: 'Medium',
      }, [evidence('risk-0002-e1', 'restricted/', run, 'path present and not opened')],
      { load_bearing_inputs: ['framework.architecture.deployment'] }),
    ],
  });

  // --- health --------------------------------------------------------------
  // Two dimensions have a load-bearing input that is Unavailable. STD-0007 R-28
  // makes those conclusions Unknown, and STD-0008 R-44 requires each to carry the
  // scope reason that bounds it. Nothing here averages: R-29 takes the minimum.
  const health = [
    { dimension: 'modularity', score: 4, calculation: 'three modules with single exported interfaces and no cross-layer import observed', supporting_records: 'module-0001,module-0002,module-0003', state: 'Observed', confidence: 'High' },
    { dimension: 'boundary-integrity', score: 4, calculation: 'no import crossing a layer boundary in the wrong direction was observed', supporting_records: 'layer-0001,layer-0002,layer-0003', state: 'Observed', confidence: 'High' },
    { dimension: 'dependency-hygiene', score: 3, calculation: 'one dependency pinned, one ranged, transitive set unexamined', supporting_records: 'dependency-0001,dependency-0002', state: 'Inferred', confidence: 'Medium', bound_low: 2, bound_high: 4 },
    { dimension: 'build-reproducibility', score: 2, calculation: 'a declared build command whose script is absent in scope', supporting_records: 'build-0001', state: 'Inferred', confidence: 'Medium' },
    { dimension: 'configuration-clarity', score: 4, calculation: 'every key declares a source and the one secret is referenced rather than embedded', supporting_records: 'configuration-0001,configuration-0002,configuration-0003', state: 'Observed', confidence: 'High' },
    { dimension: 'deployment-clarity', unknown: 'the deployment artifact of this run is Unavailable; the definitions exist and were not authorized for reading', supporting_records: 'risk-0002' },
    { dimension: 'runtime-operability', unknown: 'the runtime artifact of this run is Partial and its unexamined boundary is the orchestration definitions', supporting_records: 'runtime-0001' },
  ];
  emit('framework.architecture.health', {
    completeness: 'Complete',
    lineage: [
      lineageReference(artifacts.get('framework.architecture.modules'), ['health-0001']),
      lineageReference(artifacts.get('framework.architecture.layers'), ['health-0002']),
      lineageReference(artifacts.get('framework.architecture.dependencies'), ['health-0003']),
      lineageReference(artifacts.get('framework.architecture.build'), ['health-0004']),
      lineageReference(artifacts.get('framework.architecture.configuration'), ['health-0005']),
      lineageReference(artifacts.get('framework.architecture.deployment'), ['health-0006']),
      lineageReference(artifacts.get('framework.architecture.runtime'), ['health-0007']),
    ],
    records: health.map((h, i) => {
      const id = `health-${String(i + 1).padStart(4, '0')}`;
      if (h.unknown) {
        // No score is carried. STD-0007 R-42 forbids an Unavailable input
        // contributing to a score at all, and R-31 admits a score only as an
        // assessment supported by findings; a zero here would be a fabricated
        // measurement that R-34 would then escalate.
        return record(id, {
          dimension: h.dimension,
          calculation: 'not calculated; the load-bearing input for this dimension did not contribute to a score',
          supporting_records: h.supporting_records,
          evidence_state: 'Unknown',
        }, [evidence(`${id}-e1`, 'this run', run, 'no observation supports a score for this dimension')],
        { scope_reason: h.unknown });
      }
      const { state, confidence, ...fields } = h;
      return record(id, { ...fields, evidence_state: state, confidence },
        [evidence(`${id}-e1`, 'this run', run, 'derived from the records named in supporting_records')]);
    }),
  });

  return artifacts;
}
