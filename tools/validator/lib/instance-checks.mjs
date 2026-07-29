// Checks whose subjects are artifact instances.
//
// Every check here binds to exactly one requirement that already existed, per
// STD-0012 R-01, and each was dormant only because the corpus contained no
// instance. None is type-specific: field names, vocabularies, and required fields
// are read from the type's declaration, and evidence, confidence, and completeness
// vocabularies are the closed ones the standards own.
//
// Requirements whose subjects are still absent are deliberately not bound here.
// A check written to raise an evaluated count would be the failure STD-0012 R-01
// exists to prevent.

import { createHash } from 'node:crypto';

const IDENTITY = /^([a-z][a-z0-9-]*)\/([a-z][a-z0-9-]*)@([a-z0-9][a-z0-9._-]*)#([a-z0-9][a-z0-9._-]*)\/([a-z][a-z0-9]*\.[a-z]+\.[a-z]+)@(\d+\.\d+\.\d+)$/;
const DIGEST = /^[a-z0-9]+:[0-9a-f]+$/;

const EVIDENCE_STATES = ['Verified', 'Observed', 'Inferred', 'Unknown'];
const CONFIDENCE = ['High', 'Medium', 'Low'];
const COMPLETENESS = ['Complete', 'Partial', 'NotApplicable', 'Unavailable', 'Failed'];
const EVIDENCE_ORDER = ['Unknown', 'Inferred', 'Observed', 'Verified'];
const CONFIDENCE_ORDER = ['Low', 'Medium', 'High'];

const ENVELOPE_GROUPS = ['identity', 'type', 'subject', 'scope', 'completeness', 'provenance', 'integrity', 'lineage', 'assessment'];
const GROUP_MEMBERS = {
  identity: ['run_id', 'artifact_type'],
  type: ['type_version'],
  subject: ['subject_ref', 'subject_revision'],
  scope: ['declared_scope', 'exclusions'],
  completeness: ['state', 'reason'],
  provenance: ['producer_id', 'producer_version', 'executor_class', 'generated_at', 'authorization', 'redaction_state', 'environment'],
  integrity: ['digest'],
  lineage: ['derives_from'],
  assessment: ['evidence_state', 'confidence', 'distribution'],
};
const REQUIRED_MEMBERS = {
  identity: ['run_id', 'artifact_type'],
  type: ['type_version'],
  subject: ['subject_ref', 'subject_revision'],
  scope: ['declared_scope', 'exclusions'],
  completeness: ['state'],
  provenance: ['producer_id', 'producer_version', 'executor_class', 'generated_at', 'authorization', 'redaction_state'],
  integrity: ['digest'],
  assessment: ['evidence_state', 'confidence'],
};
const EVIDENCE_MEMBERS = ['evidence_id', 'source', 'location', 'environment', 'revision', 'collector', 'redaction_state'];
const LINEAGE_MEMBERS = ['identity', 'type_version', 'subject_revision', 'digest', 'dependent_records'];

const fail = (subject, detail) => ({ outcome: 'fail', subject, detail });
const pass = (subject, detail) => ({ outcome: 'pass', subject, detail });

function order(value) {
  if (Array.isArray(value)) return value.map(order);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = order(value[key]);
    return out;
  }
  return value;
}

// The canonical serialization this repository's reference producer uses. No
// standard fixes one, which is recorded as an ambiguity in tools/producer/README.md;
// the validator applies the same form so that a digest is checked rather than
// assumed.
function recomputeDigest(artifact) {
  const copy = JSON.parse(JSON.stringify(artifact));
  if (copy.envelope?.integrity) delete copy.envelope.integrity.digest;
  const algorithm = (artifact.envelope?.integrity?.digest ?? 'sha256:').split(':')[0] || 'sha256';
  try {
    return `${algorithm}:${createHash(algorithm).update(JSON.stringify(order(copy)), 'utf8').digest('hex')}`;
  } catch {
    return null;
  }
}

const identityOf = (artifact) =>
  `${artifact.envelope.identity.run_id}/${artifact.envelope.identity.artifact_type}@${artifact.envelope.type.type_version}`;

const minimumBy = (values, lattice) => values.reduce(
  (lowest, value) => (lowest === null || lattice.indexOf(value) < lattice.indexOf(lowest) ? value : lowest),
  null,
);

export function buildInstanceChecks({ instances, declarations, documents, define }) {
  const { artifacts, resolutions } = instances;
  if (!artifacts.length) return 0;

  let bound = 0;
  const declare = (address, fn) => { define(address, fn); bound += 1; };
  const each = (fn) => () => artifacts.map(({ path, artifact }) => {
    const problems = fn(artifact, path);
    return problems.length ? fail(path, problems.join('; ')) : pass(path);
  });
  const byIdentity = new Map(artifacts.map(({ artifact }) => [identityOf(artifact), artifact]));
  const recordsOf = (artifact) => (Array.isArray(artifact.body?.records) ? artifact.body.records : []);
  const fieldsOf = (record) => record.fields ?? {};
  const loadBearing = (artifact) => recordsOf(artifact).filter((r) => r.load_bearing !== false);

  // ---- STD-0008: the artifact instance ------------------------------------

  declare('STD-0008#R-01', each((artifact) => {
    const problems = [];
    if (!artifact.envelope || typeof artifact.envelope !== 'object') problems.push('no envelope');
    if (!artifact.body || typeof artifact.body !== 'object') problems.push('no body');
    const extra = Object.keys(artifact).filter((k) => k !== 'envelope' && k !== 'body');
    if (extra.length) problems.push(`members beside the envelope and body: ${extra.join(', ')}`);
    return problems;
  }));

  declare('STD-0008#R-02', each((artifact) => {
    const type = artifact.envelope?.identity?.artifact_type;
    const declaration = declarations.get(type);
    if (!declaration) return [`declares type ${type}, which no declaration in the corpus defines`];
    const problems = [];
    if (declaration.type_version !== artifact.envelope.type.type_version) {
      problems.push(`declares version ${artifact.envelope.type.type_version} against the declared ${declaration.type_version}`);
    }
    const required = Array.isArray(declaration.required_fields) ? declaration.required_fields : [];
    const optional = Array.isArray(declaration.optional_fields) ? declaration.optional_fields : [];
    const declared = new Set([...required, ...optional]);
    for (const record of recordsOf(artifact)) {
      const fields = fieldsOf(record);
      const unknown = fields.evidence_state === 'Unknown';
      // STD-0013 R-33, with the exemption STD-0008 R-13, STD-0007 R-38 and R-42
      // create for a record that reaches no conclusion.
      if (!unknown) {
        for (const field of required) {
          if (fields[field] === undefined || fields[field] === '') problems.push(`${record.record_id}: required field ${field} absent`);
        }
      }
      // STD-0013 R-35.
      for (const key of Object.keys(fields)) {
        if (!declared.has(key) && !/^[a-z][a-z0-9]*\.[a-z][a-z0-9_]*$/.test(key)) {
          problems.push(`${record.record_id}: undeclared field ${key}`);
        }
      }
      // STD-0013 R-34.
      for (const vocabulary of Array.isArray(declaration.vocabularies) ? declaration.vocabularies : []) {
        if (!vocabulary || vocabulary.kind !== 'closed') continue;
        const value = fields[vocabulary.field];
        if (value !== undefined && !vocabulary.values.includes(value)) {
          problems.push(`${record.record_id}: ${vocabulary.field} "${value}" outside its closed vocabulary`);
        }
      }
    }
    return problems;
  }));

  declare('STD-0008#R-05', () => {
    const byRun = new Map();
    for (const { artifact } of artifacts) {
      const runId = artifact.envelope.identity.run_id;
      const type = artifact.envelope.identity.artifact_type;
      const key = `${runId}|${type}`;
      byRun.set(key, (byRun.get(key) ?? 0) + 1);
    }
    const repeated = [...byRun].filter(([, count]) => count > 1);
    return repeated.length
      ? repeated.map(([key, count]) => fail(key, `${count} artifacts of one type in one run`))
      : [pass('corpus', `${byRun.size} run and type pairs, each appearing once`)];
  });

  declare('STD-0008#R-06', each((artifact) => {
    const problems = [];
    if (!artifact.envelope?.identity?.run_id) problems.push('no run identity');
    if (!artifact.envelope?.identity?.artifact_type) problems.push('no type identity');
    const recordIds = recordsOf(artifact).map((r) => r.record_id);
    if (recordIds.some((id) => !id)) problems.push('a record carries no identity within its artifact');
    const duplicates = recordIds.filter((id, i) => recordIds.indexOf(id) !== i);
    if (duplicates.length) problems.push(`record identities repeat: ${[...new Set(duplicates)].join(', ')}`);
    const evidenceIds = recordsOf(artifact).flatMap((r) => (r.evidence ?? []).map((e) => e.evidence_id));
    const evidenceDuplicates = evidenceIds.filter((id, i) => evidenceIds.indexOf(id) !== i);
    if (evidenceDuplicates.length) problems.push(`evidence identities repeat within the artifact: ${[...new Set(evidenceDuplicates)].join(', ')}`);
    return problems;
  }));

  declare('STD-0008#R-10', each((artifact) => {
    const problems = [];
    for (const [group, members] of Object.entries(REQUIRED_MEMBERS)) {
      const value = artifact.envelope?.[group];
      if (!value || typeof value !== 'object') { problems.push(`envelope group ${group} absent`); continue; }
      for (const member of members) {
        if (value[member] === undefined || value[member] === null || value[member] === '') {
          problems.push(`${group}.${member} absent`);
        }
      }
    }
    // A completeness reason is required for every state other than Complete.
    if (artifact.envelope?.completeness?.state !== 'Complete' && !artifact.envelope?.completeness?.reason) {
      problems.push(`completeness ${artifact.envelope?.completeness?.state} carries no reason`);
    }
    return problems;
  }));

  declare('STD-0008#R-12', each((artifact) => recordsOf(artifact)
    .filter((r) => !EVIDENCE_STATES.includes(fieldsOf(r).evidence_state))
    .map((r) => `${r.record_id}: evidence state "${fieldsOf(r).evidence_state}" is outside the closed vocabulary`)));

  declare('STD-0008#R-13', each((artifact) => recordsOf(artifact).flatMap((r) => {
    const fields = fieldsOf(r);
    if (fields.evidence_state === 'Unknown') return [];
    const problems = [];
    if (!CONFIDENCE.includes(fields.confidence)) problems.push(`${r.record_id}: no confidence level and not marked Unknown`);
    if (!(r.evidence ?? []).length) problems.push(`${r.record_id}: no evidence reference and not marked Unknown`);
    return problems;
  })));

  declare('STD-0008#R-14', each((artifact) => {
    const problems = [];
    if (artifact.body?.evidence) problems.push('evidence is carried at artifact level rather than at record level');
    for (const record of recordsOf(artifact)) {
      for (const item of record.evidence ?? []) {
        if (!item.evidence_id) problems.push(`${record.record_id}: an evidence item carries no identity`);
      }
    }
    return problems;
  }));

  declare('STD-0008#R-15', each((artifact) => recordsOf(artifact).flatMap((r) => (r.evidence ?? []).flatMap((item) => {
    const missing = EVIDENCE_MEMBERS.filter((m) => item[m] === undefined || item[m] === '');
    return missing.length ? [`${r.record_id}/${item.evidence_id ?? '(unidentified)'}: ${missing.join(', ')} absent`] : [];
  }))));

  declare('STD-0008#R-19', each((artifact) => {
    const derived = recordsOf(artifact).filter((r) => Array.isArray(r.load_bearing_inputs) && r.load_bearing_inputs.length);
    const lineage = artifact.envelope?.lineage?.derives_from ?? [];
    if (!derived.length) return [];
    const problems = [];
    if (!lineage.length) return ['records derive from an upstream artifact and no lineage is recorded'];
    for (const entry of lineage) {
      const missing = LINEAGE_MEMBERS.filter((m) => entry[m] === undefined);
      if (missing.length) problems.push(`a lineage entry omits ${missing.join(', ')}`);
    }
    return problems;
  }));

  declare('STD-0008#R-20', () => {
    const edges = new Map();
    for (const { artifact } of artifacts) {
      edges.set(identityOf(artifact), (artifact.envelope.lineage?.derives_from ?? []).map((e) => e.identity));
    }
    const state = new Map();
    const cycles = [];
    const walk = (node, trail) => {
      if (state.get(node) === 'done') return;
      if (state.get(node) === 'open') { cycles.push([...trail, node].join(' -> ')); return; }
      state.set(node, 'open');
      for (const next of edges.get(node) ?? []) if (edges.has(next)) walk(next, [...trail, node]);
      state.set(node, 'done');
    };
    for (const node of edges.keys()) walk(node, []);
    return cycles.length
      ? [fail('corpus', `derivation cycles: ${cycles.join('; ')}`)]
      : [pass('corpus', `${edges.size} instances form an acyclic derivation graph`)];
  });

  declare('STD-0008#R-33', each((artifact) => (artifact.envelope?.provenance?.redaction_state
    ? [] : ['no redaction state is declared'])));

  declare('STD-0008#R-43', each((artifact) => {
    const problems = [];
    for (const [group, members] of Object.entries(GROUP_MEMBERS)) {
      const value = artifact.envelope?.[group] ?? {};
      for (const member of members) {
        if (!(member in value)) continue;
        const declared = value[member];
        const empty = declared === null || declared === ''
          || (Array.isArray(declared) && declared.length === 0)
          || (typeof declared === 'object' && !Array.isArray(declared) && Object.keys(declared).length === 0);
        if (empty) problems.push(`${group}.${member} is present and empty`);
      }
    }
    return problems;
  }));

  declare('STD-0008#R-44', each((artifact) => recordsOf(artifact)
    .filter((r) => fieldsOf(r).evidence_state === 'Unknown' && !r.scope_reason)
    .map((r) => `${r.record_id}: marked Unknown and carries no scope reason`)));

  declare('STD-0008#R-45', each((artifact) => {
    const state = artifact.envelope?.completeness?.state;
    return COMPLETENESS.includes(state) ? [] : [`completeness state "${state}" is outside the closed vocabulary`];
  }));

  declare('STD-0008#R-46', each((artifact) => {
    const lineage = artifact.envelope?.lineage?.derives_from ?? [];
    const recordIds = new Set(recordsOf(artifact).map((r) => r.record_id));
    const problems = [];
    for (const entry of lineage) {
      const dependents = Array.isArray(entry.dependent_records) ? entry.dependent_records : [];
      if (!dependents.length) { problems.push(`lineage on ${entry.identity} names no dependent record`); continue; }
      for (const id of dependents) {
        if (!recordIds.has(id)) problems.push(`lineage on ${entry.identity} names ${id}, which is not a record of this artifact`);
      }
    }
    return problems;
  }));

  declare('STD-0008#R-52', each((artifact) => {
    const identity = identityOf(artifact);
    const match = IDENTITY.exec(identity);
    if (!match) return [`identity "${identity}" is not composed of the six components R-52 requires`];
    return artifact.envelope.identity.artifact_type === match[5] && artifact.envelope.type.type_version === match[6]
      ? [] : ['the identity components disagree with the envelope type members'];
  }));

  declare('STD-0008#R-53', each((artifact) => {
    const runId = artifact.envelope?.identity?.run_id ?? '';
    return /^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*@[a-z0-9][a-z0-9._-]*#[a-z0-9][a-z0-9._-]*$/.test(runId)
      ? [] : [`run identity "${runId}" does not carry an authority, a name, a revision, and a discriminator`];
  }));

  declare('STD-0008#R-54', each((artifact) => {
    const identity = identityOf(artifact);
    const problems = [];
    // Derivable: the identity is exactly the composition of the components the
    // envelope already carries, so nothing was allocated to produce it.
    const recomposed = `${artifact.envelope.identity.run_id}/${artifact.envelope.identity.artifact_type}@${artifact.envelope.type.type_version}`;
    if (identity !== recomposed) problems.push('the identity is not derivable from the envelope components');
    if (/:\/\/|^[a-z]:\\|\.\.\//i.test(identity)) problems.push('the identity encodes a host or a path');
    return problems;
  }));

  declare('STD-0008#R-55', each((artifact) => {
    const recorded = artifact.envelope?.integrity?.digest;
    const recomputed = recomputeDigest(artifact);
    const problems = [];
    if (!recorded) return ['no content digest is declared'];
    if (recomputed === null) return [`digest algorithm "${String(recorded).split(':')[0]}" is not available`];
    if (recorded !== recomputed) problems.push(`the declared digest does not match a digest computed over the artifact excluding the digest member: declared ${recorded}, computed ${recomputed}`);
    if (recorded === identityOf(artifact)) problems.push('the digest is used as the identity');
    return problems;
  }));

  declare('STD-0008#R-56', each((artifact) => (artifact.envelope?.lineage?.derives_from ?? []).flatMap((entry) => {
    const problems = [];
    if (!IDENTITY.test(entry.identity ?? '')) problems.push(`lineage reference "${entry.identity}" leaves an identity component unbound`);
    if (!DIGEST.test(entry.digest ?? '')) problems.push(`lineage reference "${entry.identity}" carries no upstream digest`);
    return problems;
  })));

  // ---- STD-0010: representation -------------------------------------------

  declare('STD-0010#R-28', each((artifact) => {
    const groups = Object.keys(artifact.envelope ?? {});
    const missing = ENVELOPE_GROUPS.filter((g) => !groups.includes(g));
    const extra = groups.filter((g) => !ENVELOPE_GROUPS.includes(g));
    return [
      ...missing.map((g) => `envelope group ${g} absent`),
      ...extra.map((g) => `envelope carries an undeclared group ${g}`),
    ];
  }));

  declare('STD-0010#R-29', each((artifact) => {
    const problems = [];
    for (const [group, members] of Object.entries(GROUP_MEMBERS)) {
      for (const member of Object.keys(artifact.envelope?.[group] ?? {})) {
        if (!members.includes(member)) problems.push(`${group}.${member} is not a member STD-0008 requires`);
        if (!/^[a-z][a-z0-9_]*$/.test(member)) problems.push(`${group}.${member} is not lowercase with underscore separation`);
      }
    }
    return problems;
  }));

  declare('STD-0010#R-30', each((artifact) => (artifact.envelope?.lineage?.derives_from ?? []).flatMap((entry) => {
    const missing = LINEAGE_MEMBERS.filter((m) => entry[m] === undefined);
    return missing.length ? [`a derives_from entry omits ${missing.join(', ')}`] : [];
  })));

  declare('STD-0010#R-41', each((artifact) => {
    const problems = [];
    const identity = identityOf(artifact);
    if (!IDENTITY.test(identity)) problems.push(`identity "${identity}" is outside the canonical grammar`);
    for (const entry of artifact.envelope?.lineage?.derives_from ?? []) {
      if (!IDENTITY.test(entry.identity ?? '')) problems.push(`lineage identity "${entry.identity}" is outside the canonical grammar`);
    }
    return problems;
  }));

  declare('STD-0010#R-42', each((artifact) => {
    const problems = [];
    const digest = artifact.envelope?.integrity?.digest;
    if (!DIGEST.test(digest ?? '')) problems.push(`digest "${digest}" is not algorithm:value in lowercase hexadecimal`);
    for (const entry of artifact.envelope?.lineage?.derives_from ?? []) {
      if (!DIGEST.test(entry.digest ?? '')) problems.push(`lineage digest "${entry.digest}" is not algorithm:value in lowercase hexadecimal`);
    }
    return problems;
  }));

  declare('STD-0010#R-43', () => {
    const problems = [];
    for (const doc of documents) {
      for (const key of ['related', 'depends_on', 'references']) {
        for (const entry of Array.isArray(doc.meta?.[key]) ? doc.meta[key] : []) {
          if (typeof entry === 'string' && IDENTITY.test(entry)) problems.push(`${doc.path}: ${key} carries an artifact instance identity`);
        }
      }
    }
    return problems.length
      ? problems.map((p) => fail('corpus', p))
      : [pass('corpus', 'no document reference key carries an artifact instance identity')];
  });

  declare('STD-0010#R-45', () => {
    if (!resolutions.length) return [pass('corpus', 'no run declares a resolution')];
    return resolutions.map(({ path, declaration }) => {
      const problems = [];
      if (!declaration.run_id) problems.push('the declaration is not run-scoped');
      for (const entry of declaration.resolution) {
        if (!IDENTITY.test(entry.identity ?? '')) problems.push(`entry identity "${entry.identity}" is outside the canonical grammar`);
        if (typeof entry.locator !== 'string' || !entry.locator) problems.push(`entry ${entry.identity} carries no locator`);
      }
      for (const { artifact } of artifacts) {
        if (artifact.envelope.resolution || artifact.envelope.locator) problems.push('an artifact envelope carries resolution information');
      }
      return problems.length ? fail(path, problems.join('; ')) : pass(path, `${declaration.resolution.length} entries`);
    });
  });

  // ---- STD-0007: evidence, confidence, and propagation --------------------

  declare('STD-0007#R-02', each((artifact) => recordsOf(artifact)
    .filter((r) => !EVIDENCE_STATES.includes(fieldsOf(r).evidence_state))
    .map((r) => `${r.record_id}: carries no single evidence state`)));

  declare('STD-0007#R-07', each((artifact) => recordsOf(artifact)
    .filter((r) => fieldsOf(r).evidence_state === 'Unknown' && !r.scope_reason)
    .map((r) => `${r.record_id}: Unknown without the scope that bounds it`)));

  declare('STD-0007#R-08', each((artifact) => recordsOf(artifact).flatMap((r) => (r.evidence ?? []).flatMap((item) => {
    const missing = ['source', 'location', 'environment', 'revision', 'collector', 'redaction_state']
      .filter((m) => item[m] === undefined || item[m] === '');
    return missing.length ? [`${r.record_id}/${item.evidence_id}: not attributable, ${missing.join(', ')} absent`] : [];
  }))));

  declare('STD-0007#R-09', each((artifact) => recordsOf(artifact).flatMap((r) => (r.evidence ?? [])
    .filter((item) => !item.environment)
    .map((item) => `${r.record_id}/${item.evidence_id}: records no environment`))));

  declare('STD-0007#R-25', each((artifact) => {
    const problems = [];
    for (const record of recordsOf(artifact)) {
      const inputs = Array.isArray(record.load_bearing_inputs) ? record.load_bearing_inputs : [];
      if (!inputs.length) continue;
      const upstreamStates = [];
      for (const entry of artifact.envelope?.lineage?.derives_from ?? []) {
        if (!(entry.dependent_records ?? []).includes(record.record_id)) continue;
        const upstream = byIdentity.get(entry.identity);
        if (upstream) upstreamStates.push(upstream.envelope.assessment.evidence_state);
      }
      if (!upstreamStates.length) continue;
      const floor = minimumBy(upstreamStates, EVIDENCE_ORDER);
      const state = fieldsOf(record).evidence_state;
      if (EVIDENCE_ORDER.indexOf(state) > EVIDENCE_ORDER.indexOf(floor)) {
        problems.push(`${record.record_id}: ${state} exceeds the weakest load-bearing input ${floor}`);
      }
    }
    return problems;
  }));

  declare('STD-0007#R-26', each((artifact) => {
    const problems = [];
    for (const record of recordsOf(artifact)) {
      const fields = fieldsOf(record);
      if (!fields.confidence) continue;
      const upstreamConfidence = [];
      for (const entry of artifact.envelope?.lineage?.derives_from ?? []) {
        if (!(entry.dependent_records ?? []).includes(record.record_id)) continue;
        const upstream = byIdentity.get(entry.identity);
        if (upstream && upstream.envelope.assessment.evidence_state !== 'Unknown') {
          upstreamConfidence.push(upstream.envelope.assessment.confidence);
        }
      }
      if (!upstreamConfidence.length) continue;
      const floor = minimumBy(upstreamConfidence, CONFIDENCE_ORDER);
      if (CONFIDENCE_ORDER.indexOf(fields.confidence) > CONFIDENCE_ORDER.indexOf(floor)) {
        problems.push(`${record.record_id}: ${fields.confidence} exceeds the lowest load-bearing input ${floor}`);
      }
    }
    return problems;
  }));

  declare('STD-0007#R-28', each((artifact) => {
    const problems = [];
    for (const record of recordsOf(artifact)) {
      const unknownUpstream = (artifact.envelope?.lineage?.derives_from ?? []).some((entry) => {
        if (!(entry.dependent_records ?? []).includes(record.record_id)) return false;
        const upstream = byIdentity.get(entry.identity);
        return upstream && upstream.envelope.assessment.evidence_state === 'Unknown';
      });
      if (unknownUpstream && fieldsOf(record).evidence_state !== 'Unknown') {
        problems.push(`${record.record_id}: an Unknown load-bearing input does not make the conclusion Unknown`);
      }
    }
    return problems;
  }));

  declare('STD-0007#R-29', each((artifact) => {
    const records = loadBearing(artifact).filter((r) => fieldsOf(r).evidence_state !== 'Unknown');
    const declared = artifact.envelope.assessment.confidence;
    if (!records.length) return [];
    const expected = minimumBy(records.map((r) => fieldsOf(r).confidence).filter(Boolean), CONFIDENCE_ORDER);
    return declared === expected ? [] : [`aggregate confidence ${declared} is not the minimum ${expected} among load-bearing records`];
  }));

  declare('STD-0007#R-30', each((artifact) => {
    const records = loadBearing(artifact);
    const declared = artifact.envelope.assessment.evidence_state;
    if (!records.length) return [];
    const expected = minimumBy(records.map((r) => fieldsOf(r).evidence_state).filter(Boolean), EVIDENCE_ORDER);
    return declared === expected ? [] : [`aggregate evidence state ${declared} is not the minimum ${expected} among load-bearing records`];
  }));

  declare('STD-0007#R-32', each((artifact) => {
    const problems = [];
    for (const record of recordsOf(artifact)) {
      const fields = fieldsOf(record);
      if (fields.score === undefined) continue;
      if (!fields.calculation) problems.push(`${record.record_id}: a score without its calculation`);
      if (!fields.evidence_state) problems.push(`${record.record_id}: a score without an evidence state`);
      if (fields.evidence_state !== 'Unknown' && !fields.confidence) problems.push(`${record.record_id}: a score without a confidence level`);
    }
    return problems;
  }));

  declare('STD-0007#R-38', each((artifact) => recordsOf(artifact)
    .filter((r) => fieldsOf(r).evidence_state === 'Unknown' && fieldsOf(r).confidence !== undefined)
    .map((r) => `${r.record_id}: Unknown and assigned a confidence level`)));

  declare('STD-0007#R-42', each((artifact) => {
    const unavailableInputs = new Set();
    for (const entry of artifact.envelope?.lineage?.derives_from ?? []) {
      const upstream = byIdentity.get(entry.identity);
      if (upstream && ['Unavailable', 'Failed'].includes(upstream.envelope.completeness.state)) {
        for (const id of entry.dependent_records ?? []) unavailableInputs.add(id);
      }
    }
    return recordsOf(artifact)
      .filter((r) => unavailableInputs.has(r.record_id) && fieldsOf(r).score !== undefined)
      .map((r) => `${r.record_id}: an Unavailable input contributes to a score`);
  }));

  // "Where an aggregate is reported": an artifact carrying no load-bearing record
  // aggregates no conclusion, and its assessment members carry the bottom of each
  // lattice because STD-0008 R-10 requires them to be declared. Demanding a
  // distribution there would be the validator strengthening a requirement, which
  // STD-0012 R-03 forbids.
  declare('STD-0007#R-43', each((artifact) => (!loadBearing(artifact).length || artifact.envelope?.assessment?.distribution
    ? [] : ['an aggregate is reported without its distribution'])));

  // ---- STD-0011: participant obligations ----------------------------------

  declare('STD-0011#R-45', each((artifact) => {
    const identity = identityOf(artifact);
    return IDENTITY.test(identity) ? [] : [`the producer assigned an identity outside the composition STD-0008 R-52 requires: ${identity}`];
  }));

  declare('STD-0011#R-46', each((artifact) => {
    const digest = artifact.envelope?.integrity?.digest;
    if (!digest) return ['the producer emitted an artifact carrying no content digest'];
    const recomputed = recomputeDigest(artifact);
    return digest === recomputed ? [] : ['the declared digest was not computed over the artifact the producer emitted'];
  }));

  declare('STD-0011#R-51', () => {
    const bySubject = new Map();
    for (const { artifact } of artifacts) {
      const match = /^([a-z][a-z0-9-]*\/[a-z][a-z0-9-]*@[a-z0-9][a-z0-9._-]*)#([a-z0-9][a-z0-9._-]*)$/.exec(artifact.envelope.identity.run_id);
      if (!match) continue;
      if (!bySubject.has(match[1])) bySubject.set(match[1], new Set());
      bySubject.get(match[1]).add(match[2]);
    }
    const runs = new Set([...artifacts].map(({ artifact }) => artifact.envelope.identity.run_id));
    const collisions = [...bySubject].filter(([subject, discriminators]) => {
      const runsForSubject = [...runs].filter((r) => r.startsWith(`${subject}#`));
      return discriminators.size !== runsForSubject.length;
    });
    return collisions.length
      ? collisions.map(([subject]) => fail(subject, 'two runs over one subject at one revision share a discriminator'))
      : [pass('corpus', `${runs.size} runs, each carrying a discriminator distinct within its subject and revision`)];
  });

  declare('STD-0011#R-52', () => {
    if (!resolutions.length) return [fail('corpus', 'artifacts exist and no run declares a resolution for them')];
    return resolutions.map(({ path, declaration }) => {
      const declared = new Set(declaration.resolution.map((e) => e.identity));
      const recorded = new Set((declaration.unresolvable ?? []).map((e) => e.identity));
      const produced = artifacts
        .filter(({ artifact }) => artifact.envelope.identity.run_id === declaration.run_id)
        .map(({ artifact }) => identityOf(artifact));
      const consumed = artifacts
        .filter(({ artifact }) => artifact.envelope.identity.run_id === declaration.run_id)
        .flatMap(({ artifact }) => (artifact.envelope.lineage?.derives_from ?? []).map((e) => e.identity));
      const missing = [...new Set([...produced, ...consumed])].filter((id) => !declared.has(id) && !recorded.has(id));
      return missing.length
        ? fail(path, `identities produced or consumed by the run with neither a resolution nor an unresolvable record: ${missing.join(', ')}`)
        : pass(path, `${declared.size} resolved, ${recorded.size} recorded unresolvable`);
    });
  });

  // ---- STD-0012: validator behaviour on instances -------------------------

  declare('STD-0012#R-40', each((artifact) => (IDENTITY.test(identityOf(artifact))
    ? [] : [`identity "${identityOf(artifact)}" does not satisfy STD-0010 R-41`])));

  declare('STD-0012#R-41', each((artifact) => (DIGEST.test(artifact.envelope?.integrity?.digest ?? '')
    ? [] : [`digest "${artifact.envelope?.integrity?.digest}" does not satisfy STD-0010 R-42`])));

  declare('STD-0012#R-42', each((artifact) => (artifact.envelope?.lineage?.derives_from ?? [])
    .filter((entry) => !IDENTITY.test(entry.identity ?? '') || !DIGEST.test(entry.digest ?? ''))
    .map((entry) => `lineage entry "${entry.identity}" is a mutable reference`)));

  declare('STD-0012#R-43', each((artifact) => (artifact.envelope?.lineage?.derives_from ?? []).flatMap((entry) => {
    const upstream = byIdentity.get(entry.identity);
    if (!upstream) return [];
    return entry.digest === upstream.envelope.integrity.digest
      ? [] : [`the digest recorded for ${entry.identity} differs from the digest of the resolved artifact`];
  })));

  declare('STD-0012#R-44', () => {
    const results = [];
    for (const { path, declaration } of resolutions) {
      const resolvedIds = new Set(declaration.resolution.map((e) => e.identity));
      const unresolved = [];
      for (const { artifact } of artifacts) {
        if (artifact.envelope.identity.run_id !== declaration.run_id) continue;
        for (const entry of artifact.envelope.lineage?.derives_from ?? []) {
          if (!resolvedIds.has(entry.identity)) unresolved.push(`${identityOf(artifact)} requires ${entry.identity}`);
        }
      }
      results.push(unresolved.length
        ? fail(path, `identities the composition requires and cannot resolve: ${unresolved.join('; ')}`)
        : pass(path, 'every identity the composition requires resolves'));
    }
    return results.length ? results : [pass('corpus', 'no composition requires a resolution')];
  });

  declare('STD-0012#R-45', each((artifact) => (artifact.envelope?.lineage?.derives_from ?? []).flatMap((entry) => {
    const named = IDENTITY.exec(entry.identity ?? '');
    if (!named) return [];
    return named[3] === entry.subject_revision
      ? [] : [`lineage entry ${entry.identity} records subject revision ${entry.subject_revision}, which the identity does not name`];
  })));

  return bound;
}
