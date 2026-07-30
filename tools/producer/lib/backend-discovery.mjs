// AUD-0005 Backend Discovery — the methodology-specific half of the third
// reference producer, and the first that consumes from two methodologies.
//
// What is new here, and the reason this producer exists:
//
//   1. It consumes through *declared consumption profiles*. STD-0011 R-30 requires
//      compatibility to be evaluated against a profile rather than against the
//      whole type where a consumer declares one. This module does not merely check
//      that: it projects each consumed artifact down to the fields its profile
//      declares, so a field the profile does not name is not present to be read.
//      An accidental dependency on an undeclared field is a TypeError, not a
//      review finding.
//
//   2. It draws conclusions three hops from their origin. A dataaccess record
//      names an entity this run never observed; it read it from the database
//      artifact, which derived it from the architecture module artifact. The cost
//      of the framework's artifact-level lineage is measured here rather than
//      argued about, by `measureGranularity` below.
//
// Nothing here calls a live endpoint, enqueues a message, contacts a store, or
// executes the subject. AUD-0005 section 12 forbids each of those by name, and the
// only inputs this module has are files in the subject repository and artifacts
// resolved from the run.

import { buildArtifact, lineageReference } from './envelope.mjs';
import { artifactIdentity } from './identity.mjs';
import { resolve as resolveIdentity, OUTCOME } from './resolver.mjs';
import { evaluateRequiredInputs, consumedTypes } from './required-inputs.mjs';
import { SUBJECTS } from './backend-subjects.mjs';

// The artifact types this producer emits, in the order AUD-0005 section 6 lists
// them. STD-0010 R-48 requires every required_for entry below to name one of these.
export const PRODUCED_TYPES = [
  'framework.backend.services',
  'framework.backend.interfaces',
  'framework.backend.contracts',
  'framework.backend.execution',
  'framework.backend.dataaccess',
  'framework.backend.resilience',
  'framework.backend.errors',
  'framework.backend.boundaries',
  'framework.backend.risks',
  'framework.backend.health',
];

// AUD-0005 section 4, written in the shape STD-0010 R-48 fixes. Eight types across
// two methodologies. The dependency is on these types, never on the methodology
// that produced them. `required_for` states which outputs cannot be produced
// without each required input, per STD-0011 R-53.
export const CONSUMES = [
  { type: 'framework.architecture.scope', requirement: 'optional' },
  { type: 'framework.architecture.technology', requirement: 'optional' },
  { type: 'framework.architecture.entrypoints', requirement: 'required', required_for: ['framework.backend.services'] },
  { type: 'framework.architecture.modules', requirement: 'optional' },
  { type: 'framework.architecture.runtime', requirement: 'required', required_for: ['framework.backend.services'] },
  { type: 'framework.architecture.integrations', requirement: 'optional' },
  { type: 'framework.database.entities', requirement: 'required', required_for: ['framework.backend.dataaccess'] },
  { type: 'framework.database.connections', requirement: 'required', required_for: ['framework.backend.dataaccess'] },
];

export const CONSUMED_TYPES = consumedTypes(CONSUMES);

// The name this consumer answers to in a declared consumption profile. A profile
// is addressed to a consumer kind, not to a producer.
export const PROFILE_CONSUMER = 'backend-discovery';

const UNDERSTOOD_MAJOR = 1;

// STD-0011 R-27. An output that cannot be produced without an input it did not
// obtain is Unavailable, naming the input, rather than Complete with fewer records.
const CONFIDENCE_ORDER = ['Low', 'Medium', 'High'];
const EVIDENCE_ORDER = ['Unknown', 'Inferred', 'Observed', 'Verified'];

const lowest = (values, order, bottom) => values.reduce(
  (low, v) => (order.includes(v) && (low === null || order.indexOf(v) < order.indexOf(low)) ? v : low),
  null,
) ?? bottom;

/**
 * The consumption profile a type declares for this consumer, or null.
 *
 * STD-0013 R-23 requires every profile to carry `consumer` and `reads`; R-25
 * requires every entry in `reads` to be a declared field of the type. Both are
 * already validated against the corpus, so this reads the declaration as data.
 */
export function profileFor(declaration) {
  const profiles = Array.isArray(declaration?.consumption_profiles) ? declaration.consumption_profiles : [];
  const entry = profiles.find((p) => p && p.consumer === PROFILE_CONSUMER);
  if (!entry) return null;
  const reads = Array.isArray(entry.reads) ? entry.reads : String(entry.reads ?? '').split(',').map((f) => f.trim()).filter(Boolean);
  return { consumer: entry.consumer, reads };
}

/**
 * Project an artifact's records onto the fields its profile declares.
 *
 * This is the enforcement, not a check of it. What comes back carries the profile
 * fields and nothing else, so a consumer that reached for an undeclared field
 * would find `undefined` rather than a value it was never promised. STD-0011 R-30
 * makes the profile the unit of compatibility; making it the unit of access is how
 * this producer keeps that honest.
 */
export function projectThroughProfile(artifact, profile) {
  return artifact.body.records.map((record) => {
    const visible = {};
    for (const field of profile.reads) {
      if (record.fields?.[field] !== undefined) visible[field] = record.fields[field];
    }
    return {
      record_id: record.record_id,
      fields: visible,
      // Evidence state and confidence are framework properties of a record rather
      // than fields a profile grants, and propagation under STD-0007 R-26 needs
      // them. They are carried, and the type's own fields are not.
      evidence_state: record.fields?.evidence_state,
      confidence: record.fields?.confidence,
      load_bearing: record.load_bearing !== false,
    };
  });
}

/**
 * Resolve every consumed type by identity, verify it, and where the type declares
 * a profile for this consumer, evaluate compatibility against that profile and
 * project through it.
 *
 * STD-0011 R-40 addressing, R-11 and R-30 compatibility, R-12 substitution, R-47
 * digest verification, R-48 unresolvable, R-14 declared degradation.
 */
export function consumeInputs({ root, run, declarations, resolution }) {
  const inputs = new Map();
  const degradation = [];
  const traceability = [];

  for (const type of CONSUMED_TYPES) {
    const declaration = declarations.get(type);
    if (!declaration) throw new Error(`AUD-0005 consumes ${type}, which is not declared in the corpus`);
    const identity = artifactIdentity(run.runId, type, declaration.type_version);
    const outcome = resolveIdentity({ root, declaration: resolution, reference: identity, consumingRunId: run.runId });

    if (outcome.outcome !== OUTCOME.RESOLVED) {
      degradation.push({ type, identity, outcome: outcome.outcome, reason: outcome.reason, completeness: 'Unavailable' });
      continue;
    }

    const envelope = outcome.artifact.envelope;
    const profile = profileFor(declaration);

    // R-11 in the whole-type form, which applies whether or not a profile exists:
    // a major version this consumer does not understand is not consumed.
    const major = Number(String(envelope.type.type_version).split('.')[0]);
    if (major !== UNDERSTOOD_MAJOR) {
      degradation.push({ type, identity, outcome: 'incompatible', completeness: 'Unavailable', reason: `the resolved artifact declares type version ${envelope.type.type_version}; this consumer understands major version ${UNDERSTOOD_MAJOR}` });
      continue;
    }
    if (envelope.identity.artifact_type !== type || envelope.subject.subject_revision !== run.subjectRevision) {
      degradation.push({ type, identity, outcome: 'substituted', completeness: 'Unavailable', reason: 'the resolved artifact answers to a different type or subject revision than the identity requested' });
      continue;
    }

    // R-30. Where a profile exists, compatibility is evaluated against it: every
    // field the profile names must be a field this artifact's type declares. A
    // profile naming a field the type no longer declares is the narrowing R-32
    // classifies as breaking, and it is detectable here without reading a record.
    let compatibility = 'whole-type: the type declares no profile for this consumer, and the major version is understood';
    if (profile) {
      const declared = new Set([
        ...(Array.isArray(declaration.required_fields) ? declaration.required_fields : []),
        ...(Array.isArray(declaration.optional_fields) ? declaration.optional_fields : []),
      ]);
      const missing = profile.reads.filter((field) => !declared.has(field));
      if (missing.length) {
        degradation.push({ type, identity, outcome: 'profile-incompatible', completeness: 'Unavailable', reason: `the profile declared for ${PROFILE_CONSUMER} reads ${missing.join(', ')}, which the type no longer declares` });
        continue;
      }
      compatibility = `profile: evaluated against the ${PROFILE_CONSUMER} profile over ${profile.reads.join(', ')}`;
    }

    traceability.push({
      consumer: PROFILE_CONSUMER,
      upstream_type: type,
      identity,
      type_version: envelope.type.type_version,
      profile: profile ? profile.reads : null,
      compatibility_basis: compatibility,
    });

    inputs.set(type, {
      identity,
      artifact: outcome.artifact,
      digest: outcome.digest,
      completeness: envelope.completeness.state,
      assessment: envelope.assessment,
      profile,
      // Records are visible only through the profile where one exists. Where none
      // does, the artifact is consumed for its envelope and its records are not
      // read at all — which is itself recorded, rather than becoming a quiet
      // whole-type read.
      records: profile ? projectThroughProfile(outcome.artifact, profile) : null,
    });
  }

  return { inputs, degradation, traceability };
}

/**
 * The cost of artifact-level lineage, measured rather than argued.
 *
 * STD-0007 R-26 caps a conclusion at the lowest of its load-bearing inputs, and
 * STD-0008 R-46 names the downstream records a lineage entry affects but not the
 * upstream records they depend on. The cap therefore comes from the upstream
 * artifact's aggregate. This computes both that cap and the cap the records
 * genuinely used would give, so the difference is a number rather than an opinion.
 *
 * It is diagnostic. Nothing it returns enters an artifact, and no record-to-record
 * reference is introduced anywhere: ADR-0006 is untouched.
 */
export function measureGranularity(input, usedRecordIds) {
  const all = (input.records ?? []).filter((r) => r.load_bearing);
  const used = all.filter((r) => usedRecordIds.includes(r.record_id));
  const capOf = (records) => ({
    evidence_state: lowest(records.map((r) => r.evidence_state), EVIDENCE_ORDER, 'Unknown'),
    confidence: lowest(records.filter((r) => r.evidence_state !== 'Unknown').map((r) => r.confidence), CONFIDENCE_ORDER, 'Low'),
  });
  const aggregate = { evidence_state: input.assessment.evidence_state, confidence: input.assessment.confidence };
  const fromUsed = used.length ? capOf(used) : aggregate;
  return {
    upstream_type: input.artifact.envelope.identity.artifact_type,
    records_in_artifact: all.length,
    records_used: used.length,
    cap_from_aggregate: aggregate,
    cap_from_used_records: fromUsed,
    differs: aggregate.evidence_state !== fromUsed.evidence_state || aggregate.confidence !== fromUsed.confidence,
  };
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

const identifier = (prefix, index) => `${prefix}-${String(index + 1).padStart(4, '0')}`;

function fromSpec(prefix, index, spec, run) {
  const id = identifier(prefix, index);
  const built = {
    record_id: id,
    fields: spec.unknown ? { ...spec.fields, evidence_state: 'Unknown' } : spec.fields,
    evidence: (spec.evidence ?? []).map(([location, note], i) => evidence(`${id}-e${i + 1}`, location, run, note)),
    ...(spec.extra ?? {}),
  };
  if (spec.unknown) built.scope_reason = spec.unknown;
  return built;
}

/**
 * Execute the methodology against a subject and return one artifact per declared
 * output type, in the order AUD-0005 section 6 lists them.
 */
export function runBackendDiscovery({ run, declarations, root, resolution }) {
  const profile = SUBJECTS[run.subjectName];
  if (!profile) throw new Error(`no backend subject profile is recorded for ${run.subjectName}`);

  const { inputs, degradation, traceability } = consumeInputs({ root, run, declarations, resolution });
  const consumption = [];

  // STD-0011 R-53 through the shared primitive: the outputs a missing required
  // input withdraws, and the outputs that carry on without it.
  const { degraded: gated } = evaluateRequiredInputs({
    consumes: CONSUMES,
    produces: PRODUCED_TYPES,
    available: [...inputs.keys()],
    unavailable: degradation,
  });

  // Each use below is a fact this run takes from an upstream artifact rather than
  // re-deriving from the subject. The scope artifact declares no profile for this
  // consumer, so it is consumed for its envelope and its records are not read.
  const scopeInput = inputs.get('framework.architecture.scope');
  const exclusions = scopeInput ? scopeInput.artifact.envelope.scope.exclusions : profile.exclusions;
  consumption.push({ type: 'framework.architecture.scope', obtained: Boolean(scopeInput), through: 'identity only; the type declares no profile for this consumer', used: 'the authorization boundary of this run is taken from the upstream scope envelope rather than re-declared' });

  const entrypointInput = inputs.get('framework.architecture.entrypoints');
  const declaredEntrypoints = entrypointInput ? entrypointInput.records.map((r) => r.fields.entry_point) : [];
  consumption.push({ type: 'framework.architecture.entrypoints', obtained: Boolean(entrypointInput), through: 'profile', used: `each service is required to name an entry point, and the ${declaredEntrypoints.length} the upstream artifact declares are the only ones admissible` });

  const runtimeInput = inputs.get('framework.architecture.runtime');
  const declaredComponents = runtimeInput ? runtimeInput.records.map((r) => r.fields.component) : [];
  consumption.push({ type: 'framework.architecture.runtime', obtained: Boolean(runtimeInput), through: 'profile', used: 'the deployment unit of each service is checked against the components the upstream artifact declares' });

  const moduleInput = inputs.get('framework.architecture.modules');
  const declaredModules = moduleInput ? moduleInput.records.map((r) => r.fields.module) : [];
  consumption.push({ type: 'framework.architecture.modules', obtained: Boolean(moduleInput), through: 'profile', used: 'the owning module of each service is checked against the modules the upstream artifact declares' });

  const technologyInput = inputs.get('framework.architecture.technology');
  const runtimeTechnologies = technologyInput ? technologyInput.records.filter((r) => r.fields.role === 'runtime').map((r) => r.fields.technology) : [];
  consumption.push({ type: 'framework.architecture.technology', obtained: Boolean(technologyInput), through: 'profile', used: `the run examines an HTTP surface because the upstream artifact records ${runtimeTechnologies.length} technologies in a runtime role` });

  const integrationInput = inputs.get('framework.architecture.integrations');
  const outboundIntegrations = integrationInput ? integrationInput.records.filter((r) => r.fields.direction === 'outbound').map((r) => r.fields.integration) : [];
  consumption.push({ type: 'framework.architecture.integrations', obtained: Boolean(integrationInput), through: 'profile', used: 'every dependency a resilience policy names is checked against the outbound integrations the upstream artifact declares' });

  const entityInput = inputs.get('framework.database.entities');
  const declaredEntities = entityInput ? entityInput.records.map((r) => r.fields.entity) : [];
  consumption.push({ type: 'framework.database.entities', obtained: Boolean(entityInput), through: 'profile', used: 'every entity an access path names is taken from the upstream artifact rather than re-derived from the schema' });

  const connectionInput = inputs.get('framework.database.connections');
  const declaredConnections = connectionInput ? connectionInput.records.map((r) => r.fields.component) : [];
  consumption.push({ type: 'framework.database.connections', obtained: Boolean(connectionInput), through: 'profile', used: 'the component each access path belongs to is checked against the components the upstream artifact records as connecting to a store' });

  const artifacts = new Map();

  // A lineage entry names an upstream artifact by type. The upstream may be one
  // this run produced or one it consumed; either way the reference carries the
  // identity, version, revision, and digest STD-0008 R-56 requires.
  //
  // Where the upstream is an input this run consumed through a declared profile,
  // the entry records which profile, per STD-0008 R-59. An artifact this run
  // produced is not consumed at all, and an input whose type declares no profile
  // for this consumer was read whole; neither records one.
  const lineage = (spec) => (spec ?? []).flatMap(([type, dependents]) => {
    const produced = artifacts.get(type);
    const upstream = produced ?? inputs.get(type)?.artifact;
    if (!upstream) return [];
    const consumptionProfile = produced ? null : (inputs.get(type)?.profile?.consumer ?? null);
    return [lineageReference(upstream, dependents, { consumptionProfile })];
  });

  const emit = (type, spec, prefix) => {
    const declaration = declarations.get(type);
    if (!declaration) throw new Error(`AUD-0005 declares output ${type}, which is not declared in the corpus`);

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

  emit('framework.backend.services', profile.services, 'service');

  // Cross-methodology agreement. A service naming an entry point or an owning
  // module the architecture run did not record is a disagreement between two
  // methodologies over one subject, reported rather than resolved silently.
  const serviceRecords = artifacts.get('framework.backend.services').body.records;
  const unmatchedModules = moduleInput
    ? serviceRecords.map((r) => r.fields.owning_module).filter((m) => m && !declaredModules.includes(m) && m !== 'src')
    : [];
  const unmatchedComponents = runtimeInput
    ? serviceRecords.map((r) => r.fields.service).filter((s) => !declaredComponents.includes(s))
    : [];
  consumption.push({ type: 'framework.architecture.runtime', obtained: Boolean(runtimeInput), through: 'profile', used: 'service-to-component agreement check', unmatchedComponents });
  consumption.push({ type: 'framework.architecture.modules', obtained: Boolean(moduleInput), through: 'profile', used: 'owning-module agreement check', unmatchedModules });

  emit('framework.backend.interfaces', profile.interfaces, 'interface');
  emit('framework.backend.contracts', profile.contracts, 'contract');
  emit('framework.backend.execution', profile.execution, 'execution');
  emit('framework.backend.dataaccess', profile.dataaccess, 'dataaccess');

  // The entities every access path names, checked against the upstream artifact,
  // and the three-hop measurement taken over exactly the records that fed them.
  const accessRecords = artifacts.get('framework.backend.dataaccess').body.records;
  const namedEntities = [...new Set(accessRecords.flatMap((r) => String(r.fields.entity ?? '').split(',').map((e) => e.trim())).filter(Boolean))];
  const unmatchedEntities = entityInput ? namedEntities.filter((e) => !declaredEntities.includes(e)) : [];
  consumption.push({ type: 'framework.database.entities', obtained: Boolean(entityInput), through: 'profile', used: 'entity agreement check', unmatchedEntities });

  const granularity = [];
  if (entityInput) {
    const usedIds = entityInput.records.filter((r) => namedEntities.includes(r.fields.entity)).map((r) => r.record_id);
    granularity.push({ downstream: 'framework.backend.dataaccess', ...measureGranularity(entityInput, usedIds) });
  }
  if (connectionInput) {
    const usedIds = connectionInput.records.filter((r) => declaredConnections.includes(r.fields.component)).map((r) => r.record_id);
    granularity.push({ downstream: 'framework.backend.dataaccess', ...measureGranularity(connectionInput, usedIds) });
  }

  emit('framework.backend.resilience', profile.resilience, 'resilience');

  const resilienceRecords = artifacts.get('framework.backend.resilience').body.records;
  const unmatchedDependencies = integrationInput
    ? [...new Set(resilienceRecords.map((r) => r.fields.dependency))].filter((d) => !outboundIntegrations.includes(d))
    : [];
  consumption.push({ type: 'framework.architecture.integrations', obtained: Boolean(integrationInput), through: 'profile', used: 'dependency agreement check', unmatchedDependencies });

  emit('framework.backend.errors', profile.errors, 'error');
  emit('framework.backend.boundaries', profile.boundaries, 'boundary');
  emit('framework.backend.risks', profile.risks, 'backendrisk');

  // Health carries the same Unknown shape the other two methodologies use: a
  // dimension with no supporting observation carries no score, per STD-0007 R-38
  // and R-31, and the reason STD-0008 R-44 requires.
  emit('framework.backend.health', {
    completeness: profile.health.completeness,
    lineage: profile.health.lineage,
    records: profile.health.records.map((h) => {
      if (h.unknown) {
        return {
          unknown: h.unknown,
          fields: { dimension: h.dimension, calculation: 'not calculated; the artifact this dimension would score is NotApplicable for this subject', supporting_records: h.supporting_records },
          evidence: [['this run', 'no observation supports a score for this dimension']],
        };
      }
      const { state, confidence, ...fields } = h;
      return { fields: { ...fields, evidence_state: state, confidence }, evidence: [['this run', 'derived from the records named in supporting_records']] };
    }),
  }, 'backendhealth');

  // The same measurement over every lineage edge this half produced, taken
  // generically rather than per conclusion.
  //
  // A cap comes from an upstream artifact's *aggregate*, which STD-0007 R-29 puts
  // at the minimum over its load-bearing records. Where that aggregate sits below
  // the strongest record in the same artifact, every downstream conclusion on the
  // edge is capped below what its own strongest possible input supports —
  // including conclusions that depend on none of the weak records. The headroom
  // between the two is what artifact-level lineage costs, and it is derivable
  // without any record-to-record reference.
  const headroom = [];
  for (const [type, artifact] of artifacts) {
    for (const entry of artifact.envelope.lineage?.derives_from ?? []) {
      const upstreamType = entry.identity.split('/').pop().split('@')[0];
      const upstream = artifacts.get(upstreamType) ?? inputs.get(upstreamType)?.artifact;
      if (!upstream) continue;
      const bearing = upstream.body.records.filter((r) => r.load_bearing !== false && r.fields?.evidence_state !== 'Unknown');
      if (!bearing.length) continue;
      const aggregate = upstream.envelope.assessment.confidence;
      const strongest = bearing.map((r) => r.fields.confidence).reduce(
        (high, c) => (CONFIDENCE_ORDER.indexOf(c) > CONFIDENCE_ORDER.indexOf(high) ? c : high),
        'Low',
      );
      headroom.push({
        edge: `${type} <- ${upstreamType}`,
        dependents: entry.dependent_records.length,
        aggregate_cap: aggregate,
        strongest_upstream_record: strongest,
        // Where these differ, a conclusion drawn only from the strongest upstream
        // records is nonetheless held to the aggregate.
        headroom_lost: aggregate !== strongest,
      });
    }
  }

  return { artifacts, inputs, consumption, degradation, traceability, granularity, headroom };
}
