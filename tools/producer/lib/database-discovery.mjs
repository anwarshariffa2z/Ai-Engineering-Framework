// AUD-0003 Database Discovery — the methodology-specific half of the second
// reference producer, and the first producer in the framework that is also a
// consumer.
//
// It reaches its subject the same way AUD-0002 does, and it reaches the artifacts
// it depends on the only way STD-0011 permits: by logical identity, through the
// run's resolution declaration, verifying the digest of what comes back. No path
// to another producer's output is written anywhere in this file, and no function
// of another producer is called.
//
// Nothing here connects to a database. AUD-0003 section 2 forbids executing any
// statement, reading records, and reproducing a credential value; this producer
// opens no socket and its only inputs are files in the subject repository and
// artifacts resolved from the run.

import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { buildArtifact, lineageReference } from './envelope.mjs';
import { artifactIdentity } from './identity.mjs';
import { resolve as resolveIdentity, OUTCOME } from './resolver.mjs';
import { evaluateRequiredInputs, consumedTypes } from './required-inputs.mjs';
import { SUBJECTS } from './database-subjects.mjs';

// The artifact types this producer emits, in the order AUD-0003 section 6 lists
// them. STD-0010 R-48 requires every required_for entry below to name one of these.
export const PRODUCED_TYPES = [
  'framework.database.technology',
  'framework.database.connections',
  'framework.database.schema',
  'framework.database.entities',
  'framework.database.relationships',
  'framework.database.constraints',
  'framework.database.indexes',
  'framework.database.migration',
  'framework.database.security',
  'framework.database.performance',
  'framework.database.lifecycle',
  'framework.database.health',
  'framework.database.risks',
  'framework.database.recommendations',
];

// AUD-0003 section 4, written in the shape STD-0010 R-48 fixes. The dependency is
// on these types, never on the methodology that produced them, so they are named
// as types and addressed as identities. `requirement` states whether an output
// depends on the input at all, and `required_for` states which outputs do, per
// STD-0011 R-53. An optional input is used where present and degrades nothing
// where absent.
export const CONSUMES = [
  { type: 'framework.architecture.scope', requirement: 'optional' },
  { type: 'framework.architecture.technology', requirement: 'required', required_for: ['framework.database.technology'] },
  { type: 'framework.architecture.modules', requirement: 'required', required_for: ['framework.database.entities'] },
  { type: 'framework.architecture.integrations', requirement: 'optional' },
];

export const CONSUMED_TYPES = consumedTypes(CONSUMES);

// The major version of each consumed type this producer declares it understands.
// STD-0011 R-11 makes compatibility the consumer's duty to verify rather than the
// producer's to promise.
const UNDERSTOOD_MAJOR = 1;

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

const identifier = (prefix, index) => `${prefix}-${String(index + 1).padStart(4, '0')}`;

// A record built from a subject profile entry. An entry carrying `unknown` becomes
// an Unknown record: STD-0007 R-38 forbids it a confidence level, STD-0008 R-44
// requires the scope reason that bounds it, and no field asserts the conclusion the
// record declines to make.
function fromSpec(prefix, index, spec, run) {
  const id = identifier(prefix, index);
  const built = {
    record_id: id,
    fields: spec.unknown ? { ...spec.fields, evidence_state: 'Unknown' } : spec.fields,
    evidence: spec.evidence.map(([location, note], i) => evidence(`${id}-e${i + 1}`, location, run, note)),
    ...(spec.extra ?? {}),
  };
  if (spec.unknown) built.scope_reason = spec.unknown;
  return built;
}

function walk(root, dir, found) {
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    const rel = relative(root, full).split(sep).join('/');
    if (statSync(full).isDirectory()) walk(root, full, found);
    else found.push(rel);
  }
  return found;
}

/**
 * Resolve every consumed artifact type by identity and verify what comes back.
 *
 * STD-0011 R-40: the input is addressed by identity. R-11: its version is checked
 * for compatibility before it is read. R-12: nothing is substituted for it — an
 * artifact answering to a different subject revision or a different type is not
 * the artifact that was asked for. R-47: the digest is verified, which the
 * resolver does. R-14: whatever could not be obtained is declared.
 */
export function consumeArchitectureInputs({ root, run, declarations, resolution }) {
  const inputs = new Map();
  const degradation = [];

  for (const type of CONSUMED_TYPES) {
    const declaration = declarations.get(type);
    if (!declaration) throw new Error(`AUD-0003 consumes ${type}, which is not declared in the corpus`);
    const identity = artifactIdentity(run.runId, type, declaration.type_version);
    const outcome = resolveIdentity({ root, declaration: resolution, reference: identity, consumingRunId: run.runId });

    if (outcome.outcome !== OUTCOME.RESOLVED) {
      degradation.push({
        type,
        identity,
        outcome: outcome.outcome,
        reason: outcome.reason,
        // STD-0011 R-48. An input that could not be obtained is Unavailable, and
        // says nothing about the subject.
        completeness: 'Unavailable',
      });
      continue;
    }

    const envelope = outcome.artifact.envelope;
    const major = Number(String(envelope.type.type_version).split('.')[0]);
    if (major !== UNDERSTOOD_MAJOR) {
      degradation.push({ type, identity, outcome: 'incompatible', completeness: 'Unavailable', reason: `the resolved artifact declares type version ${envelope.type.type_version}; this consumer understands major version ${UNDERSTOOD_MAJOR}` });
      continue;
    }
    if (envelope.identity.artifact_type !== type || envelope.subject.subject_revision !== run.subjectRevision) {
      degradation.push({ type, identity, outcome: 'substituted', completeness: 'Unavailable', reason: 'the resolved artifact answers to a different type or subject revision than the identity requested' });
      continue;
    }

    inputs.set(type, { identity, artifact: outcome.artifact, digest: outcome.digest, completeness: envelope.completeness.state });
  }

  return { inputs, degradation };
}

/**
 * Execute the methodology against a subject and return one artifact per declared
 * output type, in the order AUD-0003 section 6 lists them.
 */
export function runDatabaseDiscovery({ run, subjectRoot, declarations, root, resolution }) {
  const profile = SUBJECTS[run.subjectName];
  if (!profile) throw new Error(`no database subject profile is recorded for ${run.subjectName}`);

  const { inputs, degradation } = consumeArchitectureInputs({ root, run, declarations, resolution });
  const consumption = [];

  // STD-0011 R-53 through the shared primitive: the outputs a missing required
  // input withdraws, and the outputs that carry on without it.
  const { degraded: gated } = evaluateRequiredInputs({
    consumes: CONSUMES,
    produces: PRODUCED_TYPES,
    available: [...inputs.keys()],
    unavailable: degradation,
  });

  // The consumed artifacts are used, not merely fetched. Each use below is a fact
  // this run takes from an upstream artifact rather than re-deriving from the
  // subject, which is what makes the dependency real.
  const scopeInput = inputs.get('framework.architecture.scope');
  const exclusions = scopeInput ? scopeInput.artifact.envelope.scope.exclusions : profile.exclusions;
  consumption.push({ type: 'framework.architecture.scope', used: 'the authorization boundary of this run is taken from the upstream scope artifact rather than re-declared', obtained: Boolean(scopeInput) });

  const technologyInput = inputs.get('framework.architecture.technology');
  const dataTechnologies = technologyInput
    ? technologyInput.artifact.body.records.filter((r) => r.fields.role === 'data').map((r) => r.fields.technology)
    : [];
  consumption.push({ type: 'framework.architecture.technology', used: `the run examines persistence because the upstream artifact records ${dataTechnologies.length} technologies in a data role`, obtained: Boolean(technologyInput), detail: dataTechnologies });

  const moduleInput = inputs.get('framework.architecture.modules');
  const declaredModules = moduleInput ? moduleInput.artifact.body.records.map((r) => r.fields.module) : [];
  consumption.push({ type: 'framework.architecture.modules', used: 'every owning_module recorded for an entity is checked against the modules the upstream artifact declares', obtained: Boolean(moduleInput), detail: declaredModules });

  const integrationInput = inputs.get('framework.architecture.integrations');
  const integrationProtocols = integrationInput ? integrationInput.artifact.body.records.map((r) => r.fields.protocol) : [];
  consumption.push({ type: 'framework.architecture.integrations', used: 'every engine recorded is checked against the outbound integrations the upstream artifact declares', obtained: Boolean(integrationInput), detail: integrationProtocols });

  const artifacts = new Map();
  const emit = (type, spec, prefix) => {
    const declaration = declarations.get(type);
    if (!declaration) throw new Error(`AUD-0003 declares output ${type}, which is not declared in the corpus`);

    // Fail closed. A declared input that could not be obtained makes the artifact
    // that needed it Unavailable, with the reason stated, rather than Complete
    // with fewer records. Which artifacts those are is decided by the shared
    // primitive from the declaration above, not here.
    const gate = gated.get(type);
    const degraded = gate
      ? { completeness: gate.completeness, completenessReason: gate.reason, records: [], lineage: undefined }
      : null;
    const effective = degraded ?? spec;

    const artifact = buildArtifact({
      run,
      artifactType: type,
      typeVersion: declaration.type_version,
      declaredScope: profile.declaredScope,
      exclusions,
      completeness: effective.completeness,
      completenessReason: effective.completenessReason,
      records: (effective.records ?? []).map((s, i) => fromSpec(prefix, i, s, run)),
      lineage: lineage(effective.lineage),
      environment: run.environment,
    });
    artifacts.set(type, artifact);
    return artifact;
  };

  // A lineage entry names an upstream artifact by type. The upstream may be one
  // this run produced or one it consumed; either way the reference carries the
  // identity and digest STD-0008 R-56 requires, and neither is a path.
  const lineage = (spec) => (spec ?? []).flatMap(([type, dependents]) => {
    const upstream = artifacts.get(type) ?? inputs.get(type)?.artifact;
    if (!upstream) return [];
    return [lineageReference(upstream, dependents)];
  });

  emit('framework.database.technology', profile.technology, 'technology');

  // The engines this run recorded, checked against what the architecture run
  // observed leaving the system. A store the architecture artifact does not know
  // about is a disagreement between two methodologies over one subject, and is
  // reported rather than resolved silently.
  const recordedEngines = (artifacts.get('framework.database.technology').body.records)
    .filter((r) => r.fields.engine_role !== 'unknown')
    .map((r) => r.fields.engine);
  const unmatchedEngines = integrationInput
    ? recordedEngines.filter((engine) => !integrationProtocols.includes(engine))
    : recordedEngines;
  consumption.push({ type: 'framework.architecture.integrations', used: 'cross-methodology agreement check', obtained: Boolean(integrationInput), unmatchedEngines });

  emit('framework.database.connections', profile.connections, 'connection');
  emit('framework.database.schema', profile.schema, 'schema');
  emit('framework.database.entities', profile.entities, 'entity');

  const entityArtifact = artifacts.get('framework.database.entities');
  const unmatchedModules = moduleInput
    ? entityArtifact.body.records
      .map((r) => r.fields.owning_module)
      .filter((m) => m && !declaredModules.includes(m))
    : [];
  consumption.push({ type: 'framework.architecture.modules', used: 'owning-module agreement check', obtained: Boolean(moduleInput), unmatchedModules });

  emit('framework.database.relationships', profile.relationships, 'relationship');
  emit('framework.database.constraints', profile.constraints, 'constraint');
  emit('framework.database.indexes', profile.indexes, 'index');
  emit('framework.database.migration', profile.migration, 'migration');
  emit('framework.database.security', profile.security, 'security');
  emit('framework.database.performance', profile.performance, 'performance');
  emit('framework.database.lifecycle', profile.lifecycle, 'lifecycle');
  emit('framework.database.health', profile.health, 'health');
  emit('framework.database.risks', profile.risks, 'risk');
  emit('framework.database.recommendations', profile.recommendations, 'recommendation');

  return { artifacts, consumption, degradation, subjectPaths: walk(subjectRoot, subjectRoot, []).length };
}
