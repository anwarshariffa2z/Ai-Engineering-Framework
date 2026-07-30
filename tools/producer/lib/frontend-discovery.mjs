// AUD-0004 Frontend Discovery — the methodology-specific half of the fourth
// reference producer, and the first built against a Methodology consumption
// contract that existed before it did.
//
// The contract below is a copy of no constant. It mirrors what AUD-0004 declares
// in its own metadata under STD-0010 R-48 and R-49, and a conformance test
// compares the two independently rather than deriving one from the other.
//
// Nothing here launches a browser, runs a bundler, executes the client, opens a
// socket, or authenticates. AUD-0004 section 2 forbids each by name. The only
// inputs are files in the subject repository and artifacts resolved from the run,
// and `framework.frontend.exposure` records what is reachable in the delivered
// client by classification and location, never by value.

import { buildArtifact, lineageReference } from './envelope.mjs';
import { artifactIdentity } from './identity.mjs';
import { resolve as resolveIdentity, OUTCOME } from './resolver.mjs';
import { evaluateRequiredInputs, consumedTypes } from './required-inputs.mjs';
import { profileFor, projectThroughProfile, profileFieldsDeclared } from './profiles.mjs';
import { SUBJECTS } from './frontend-subjects.mjs';

// The artifact types this producer emits, in the order AUD-0004 section 6 lists
// them. STD-0010 R-48 requires every required_for entry below to name one.
export const PRODUCED_TYPES = [
  'framework.frontend.surface',
  'framework.frontend.routing',
  'framework.frontend.components',
  'framework.frontend.state',
  'framework.frontend.dataflow',
  'framework.frontend.assets',
  'framework.frontend.accessibility',
  'framework.frontend.exposure',
  'framework.frontend.risks',
  'framework.frontend.health',
];

// AUD-0004 section 4 names six consumed types; section 9 states which stages
// take which of them. Only two stages name an upstream artifact as an input:
// stage 1 produces `surface` from the entry declarations, and stage 5 produces
// `dataflow` from the declared integrations. Those two are required and nothing
// else is. `scope` bounds the search rather than supplying a conclusion, and
// `technology`, `modules`, and `configuration` inform cross-checks that lower
// confidence when absent and withdraw nothing, per STD-0011 R-22.
//
// Requiredness is read from the stage definitions and never from `derives_from`,
// which the Milestone 6.1 gate established states a different relation.
export const CONSUMES = [
  { type: 'framework.architecture.scope', requirement: 'optional', profile: 'frontend-discovery' },
  { type: 'framework.architecture.technology', requirement: 'optional' },
  { type: 'framework.architecture.entrypoints', requirement: 'required', required_for: ['framework.frontend.surface'], profile: 'frontend-discovery' },
  { type: 'framework.architecture.modules', requirement: 'optional' },
  { type: 'framework.architecture.configuration', requirement: 'optional', profile: 'frontend-discovery' },
  { type: 'framework.architecture.integrations', requirement: 'required', required_for: ['framework.frontend.dataflow'], profile: 'frontend-discovery' },
];

export const CONSUMED_TYPES = consumedTypes(CONSUMES);

// The name this consumer answers to in a declared consumption profile.
export const PROFILE_CONSUMER = 'frontend-discovery';

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

// A record built from a subject profile entry. An entry carrying `unknown`
// becomes an Unknown record: STD-0007 R-38 forbids it a confidence level,
// STD-0008 R-44 requires the scope reason that bounds it, and no field asserts
// the conclusion the record declines to make.
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

/**
 * Resolve every consumed type by identity, verify it, and where the type
 * declares a profile for this consumer, evaluate compatibility against that
 * profile and project through it.
 *
 * STD-0011 R-40 addressing, R-11 and R-30 compatibility, R-12 substitution,
 * R-47 digest verification, R-48 unresolvable, R-14 declared degradation.
 */
export function consumeInputs({ root, run, declarations, resolution }) {
  const inputs = new Map();
  const degradation = [];

  for (const type of CONSUMED_TYPES) {
    const declaration = declarations.get(type);
    if (!declaration) throw new Error(`AUD-0004 consumes ${type}, which is not declared in the corpus`);
    const identity = artifactIdentity(run.runId, type, declaration.type_version);
    const outcome = resolveIdentity({ root, declaration: resolution, reference: identity, consumingRunId: run.runId });

    if (outcome.outcome !== OUTCOME.RESOLVED) {
      degradation.push({ type, identity, outcome: outcome.outcome, reason: outcome.reason, completeness: 'Unavailable' });
      continue;
    }

    const envelope = outcome.artifact.envelope;
    const profile = profileFor(declaration, PROFILE_CONSUMER);

    const major = Number(String(envelope.type.type_version).split('.')[0]);
    if (major !== UNDERSTOOD_MAJOR) {
      degradation.push({ type, identity, outcome: 'incompatible', completeness: 'Unavailable', reason: `the resolved artifact declares type version ${envelope.type.type_version}; this consumer understands major version ${UNDERSTOOD_MAJOR}` });
      continue;
    }
    if (envelope.identity.artifact_type !== type || envelope.subject.subject_revision !== run.subjectRevision) {
      degradation.push({ type, identity, outcome: 'substituted', completeness: 'Unavailable', reason: 'the resolved artifact answers to a different type or subject revision than the identity requested' });
      continue;
    }

    if (profile) {
      const missing = profileFieldsDeclared(declaration, profile);
      if (missing.length) {
        degradation.push({ type, identity, outcome: 'profile-incompatible', completeness: 'Unavailable', reason: `the profile declared for ${PROFILE_CONSUMER} reads ${missing.join(', ')}, which the type no longer declares` });
        continue;
      }
    }

    inputs.set(type, {
      identity,
      artifact: outcome.artifact,
      digest: outcome.digest,
      completeness: envelope.completeness.state,
      profile,
      // A profiled input is read only through its projection. A field the
      // profile does not grant is absent rather than merely unread.
      records: profile ? projectThroughProfile(outcome.artifact, profile) : outcome.artifact.body.records,
    });
  }

  return { inputs, degradation };
}

/**
 * Execute the methodology against a subject and return one artifact per declared
 * output type, in the order AUD-0004 section 6 lists them.
 */
export function runFrontendDiscovery({ run, declarations, root, resolution }) {
  const profile = SUBJECTS[run.subjectName];
  if (!profile) throw new Error(`no frontend subject profile is recorded for ${run.subjectName}`);

  const { inputs, degradation } = consumeInputs({ root, run, declarations, resolution });
  const consumption = [];

  // STD-0011 R-53 through the shared primitive: the outputs a missing required
  // input withdraws, and the outputs that carry on without it.
  const { degraded: gated } = evaluateRequiredInputs({
    consumes: CONSUMES,
    produces: PRODUCED_TYPES,
    available: [...inputs.keys()],
    unavailable: degradation,
  });

  // Each use below is a fact this run takes from an upstream artifact rather
  // than re-deriving from the subject.
  const scopeInput = inputs.get('framework.architecture.scope');
  const exclusions = scopeInput
    ? (scopeInput.artifact.envelope.scope.exclusions ?? profile.exclusions)
    : profile.exclusions;
  consumption.push({ type: 'framework.architecture.scope', obtained: Boolean(scopeInput), through: 'profile', used: 'the authorization boundary of this run is taken from the upstream scope envelope rather than re-declared' });

  const entrypointInput = inputs.get('framework.architecture.entrypoints');
  const declaredEntryPoints = entrypointInput ? entrypointInput.records.map((r) => r.fields.entry_point) : [];
  consumption.push({ type: 'framework.architecture.entrypoints', obtained: Boolean(entrypointInput), through: 'profile', used: `the client surface is identified from the ${declaredEntryPoints.length} entry declarations the upstream artifact records, rather than from the directory layout` });

  const integrationInput = inputs.get('framework.architecture.integrations');
  const outbound = integrationInput ? integrationInput.records.filter((r) => r.fields.direction === 'outbound').map((r) => r.fields.integration) : [];
  consumption.push({ type: 'framework.architecture.integrations', obtained: Boolean(integrationInput), through: 'profile', used: 'every call site names a target interface taken from the outbound integrations the upstream artifact declares' });

  const technologyInput = inputs.get('framework.architecture.technology');
  consumption.push({ type: 'framework.architecture.technology', obtained: Boolean(technologyInput), through: 'identity only; the type declares no profile for this consumer', used: 'the client platform is cross-checked against the technologies the upstream artifact records' });

  const moduleInput = inputs.get('framework.architecture.modules');
  const declaredModules = moduleInput ? moduleInput.artifact.body.records.map((r) => r.fields.module) : [];
  consumption.push({ type: 'framework.architecture.modules', obtained: Boolean(moduleInput), through: 'identity only; the type declares no profile for this consumer', used: 'the owning module recorded for the client surface is checked against the modules the upstream artifact declares' });

  const configurationInput = inputs.get('framework.architecture.configuration');
  const declaredKeys = configurationInput ? configurationInput.records.map((r) => r.fields.key) : [];
  consumption.push({ type: 'framework.architecture.configuration', obtained: Boolean(configurationInput), through: 'profile', used: `every exposure classification is checked against the ${declaredKeys.length} configuration keys the upstream artifact records` });

  const artifacts = new Map();

  // A lineage entry names an upstream artifact by type. The upstream may be one
  // this run produced or one it consumed; either way the reference carries the
  // identity, version, revision, and digest STD-0008 R-56 requires, and never a
  // path. Where the upstream was consumed through a declared profile, the entry
  // records which profile, per STD-0008 R-59.
  const lineage = (spec) => (spec ?? []).flatMap(([type, dependents]) => {
    const produced = artifacts.get(type);
    const upstream = produced ?? inputs.get(type)?.artifact;
    if (!upstream) return [];
    const consumptionProfile = produced ? null : (inputs.get(type)?.profile?.consumer ?? null);
    return [lineageReference(upstream, dependents, { consumptionProfile })];
  });

  const emit = (type, spec, prefix) => {
    const declaration = declarations.get(type);
    if (!declaration) throw new Error(`AUD-0004 declares output ${type}, which is not declared in the corpus`);

    // Which outputs a missing required input withdraws is decided by the shared
    // primitive from the declaration above, and not restated here.
    const gate = gated.get(type);
    const effective = gate
      ? { completeness: gate.completeness, completenessReason: gate.reason, records: [], lineage: undefined }
      : spec;

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

  emit('framework.frontend.surface', profile.surface, 'surface');

  // Cross-methodology agreement. A client naming an owning module the
  // architecture run did not record is a disagreement between two methodologies
  // over one subject, reported rather than resolved silently.
  const surfaceRecords = artifacts.get('framework.frontend.surface').body.records;
  const unmatchedModules = moduleInput
    ? surfaceRecords.map((r) => r.fields.owning_module).filter((m) => m && !declaredModules.includes(m))
    : [];
  consumption.push({ type: 'framework.architecture.modules', used: 'owning-module agreement check', obtained: Boolean(moduleInput), unmatchedModules });

  emit('framework.frontend.routing', profile.routing, 'routing');
  emit('framework.frontend.components', profile.components, 'components');
  emit('framework.frontend.state', profile.state, 'state');
  emit('framework.frontend.dataflow', profile.dataflow, 'dataflow');

  // A call site naming a target the architecture run did not record leaving the
  // system is the same class of disagreement.
  const unmatchedTargets = integrationInput
    ? artifacts.get('framework.frontend.dataflow').body.records
      .map((r) => r.fields.target_interface)
      .filter((t) => t && !outbound.some((o) => String(t).includes(String(o))))
    : [];
  consumption.push({ type: 'framework.architecture.integrations', used: 'target-interface agreement check', obtained: Boolean(integrationInput), unmatchedTargets });

  emit('framework.frontend.assets', profile.assets, 'assets');
  emit('framework.frontend.accessibility', profile.accessibility, 'accessibility');
  emit('framework.frontend.exposure', profile.exposure, 'exposure');
  emit('framework.frontend.risks', profile.risks, 'risk');
  emit('framework.frontend.health', profile.health, 'health');

  return { artifacts, consumption, degradation, inputs };
}
