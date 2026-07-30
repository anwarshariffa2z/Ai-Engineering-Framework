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
// The record members STD-0008 R-58 names. They belong to the framework, not to
// any type declaration, and everything a declaration supplies sits in `fields`.
const FRAMEWORK_RECORD_MEMBERS = ['record_id', 'evidence', 'scope_reason', 'load_bearing', 'load_bearing_inputs'];
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
      // STD-0013 R-33. The exemption for a record marked Unknown is licensed by
      // STD-0013 R-37, which is judgment-checkable and is not evaluated here:
      // whether an omitted field was omitted honestly cannot be seen in the
      // artifact. What R-37 licenses mechanically is only this — not applying
      // R-33 to such a record, which STD-0012 R-03 would otherwise forbid the
      // validator from deciding on its own authority.
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

  // R-43 governs optional members: "A producer that declares an optional member
  // MUST populate it or omit it." A member R-10 requires is not optional, and an
  // empty value is how a required member states that there is nothing to state —
  // a run that excluded nothing declares an empty exclusion list. Applying R-43
  // to a required member would be the validator strengthening the requirement,
  // which STD-0012 R-03 forbids.
  declare('STD-0008#R-43', each((artifact) => {
    const problems = [];
    for (const [group, members] of Object.entries(GROUP_MEMBERS)) {
      const value = artifact.envelope?.[group] ?? {};
      const required = REQUIRED_MEMBERS[group] ?? [];
      for (const member of members) {
        if (required.includes(member)) continue;
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

  // R-58 fixes the boundary between the framework record members, which are the
  // same for every type, and the type-declared field values, which sit in
  // `fields`. It is what lets the R-35 arm of the R-02 check above read only
  // `fields` without a standing exception list for the framework's own members.
  declare('STD-0008#R-58', each((artifact) => {
    const problems = [];
    for (const record of recordsOf(artifact)) {
      const id = record.record_id ?? '(no identity)';
      if (record.fields === undefined) {
        problems.push(`${id}: carries no fields member`);
      } else if (record.fields === null || typeof record.fields !== 'object' || Array.isArray(record.fields)) {
        problems.push(`${id}: the fields member is not a group of field values`);
      }
      for (const key of Object.keys(record)) {
        if (key !== 'fields' && !FRAMEWORK_RECORD_MEMBERS.includes(key)) {
          problems.push(`${id}: ${key} sits beside the framework record members and outside fields`);
        }
      }
    }
    return problems;
  }));

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

  // The profile a lineage entry names must be one the consumed type declares.
  // The consumed type is read off the entry's own identity, so the check knows
  // no methodology and no type name. R-59's other half — that a profile is
  // recorded wherever one was used — is not evaluated: an artifact that records
  // none is reporting a whole-type read, and nothing in it distinguishes that
  // from a profile ignored. STD-0008 section 20 states the bound.
  declare('STD-0008#R-59', each((artifact) => (artifact.envelope?.lineage?.derives_from ?? []).flatMap((entry) => {
    const named = entry.consumption_profile;
    if (named === undefined) return [];
    const upstreamType = (entry.identity ?? '').split('/').pop().split('@')[0];
    const declaration = declarations.get(upstreamType);
    if (!declaration) return [`lineage entry names consumption profile ${named} of ${upstreamType}, which no declaration defines`];
    const profiles = Array.isArray(declaration.consumption_profiles) ? declaration.consumption_profiles : [];
    return profiles.some((p) => p?.consumer === named)
      ? []
      : [`lineage entry names consumption profile ${named}, which ${upstreamType} does not declare`];
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
    const problems = missing.length ? [`a derives_from entry omits ${missing.join(', ')}`] : [];
    if (entry.consumption_profile !== undefined && (typeof entry.consumption_profile !== 'string' || !entry.consumption_profile)) {
      problems.push('a derives_from entry carries a consumption_profile that is not a profile name');
    }
    return problems;
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

  // STD-0010 R-46. That an artifact's canonical serialization is the scheme
  // RFC 8785 defines is demonstrated by canonicalizing it under that scheme and
  // reproducing the digest the producer recorded. A producer that used any other
  // ordering, escaping, or number format would not reproduce it.
  declare('STD-0010#R-46', each((artifact) => {
    const recorded = artifact.envelope?.integrity?.digest;
    const recomputed = recomputeDigest(artifact);
    if (!recorded || recomputed === null) return [];
    return recorded === recomputed
      ? [] : ['the artifact does not reproduce its digest under the canonical serialization of RFC 8785'];
  }));

  // STD-0010 R-47. Every member the artifact carries participates: the canonical
  // input, parsed back, is the artifact with only the digest member removed.
  declare('STD-0010#R-47', each((artifact) => {
    const expected = JSON.parse(JSON.stringify(artifact));
    if (expected.envelope?.integrity) delete expected.envelope.integrity.digest;
    const copy = JSON.parse(JSON.stringify(artifact));
    if (copy.envelope?.integrity) delete copy.envelope.integrity.digest;
    const roundTripped = JSON.parse(JSON.stringify(order(copy)));
    return JSON.stringify(order(expected)) === JSON.stringify(roundTripped)
      ? [] : ['a member the artifact carries does not participate in its canonical serialization'];
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

  // STD-0007 R-45 governs precisely the case R-29 and R-30 decline: an aggregate
  // over an empty set. The two sets are not the same set, so both are checked.
  // R-38 leaves an Unknown record without a confidence, so an artifact whose every
  // load-bearing record is Unknown aggregates a non-empty evidence set and an empty
  // confidence set.
  declare('STD-0007#R-45', each((artifact) => {
    const records = loadBearing(artifact);
    const scored = records.filter((r) => fieldsOf(r).evidence_state !== 'Unknown');
    const assessment = artifact.envelope?.assessment ?? {};
    const problems = [];
    if (!records.length && assessment.evidence_state !== 'Unknown') {
      problems.push(`aggregates no conclusion and declares evidence state ${assessment.evidence_state} rather than Unknown`);
    }
    if (!scored.length && assessment.confidence !== 'Low') {
      problems.push(`aggregates no confidence and declares ${assessment.confidence} rather than Low`);
    }
    return problems;
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

  // R-21. A producer MUST NOT consume an input it did not declare. This is the
  // check the contract representation was worth adding for: it compares an
  // authored declaration against what a producer actually emitted, so it reaches
  // a disagreement no amount of document-to-document validation would find.
  //
  // A lineage entry is a consumption that happened. Where the upstream type is
  // produced by a different kind than the artifact carrying the entry, the
  // consumption crossed a methodology boundary and the consuming methodology's
  // `consumes` must name it. A within-methodology derivation is not a
  // consumption and is not reached.
  const methodologyByKind = new Map();
  for (const doc of documents ?? []) {
    if (doc?.meta?.object_type !== 'Methodology') continue;
    const kinds = Array.isArray(doc.meta.producer_kinds) ? doc.meta.producer_kinds : [];
    for (const kind of kinds) methodologyByKind.set(kind, doc);
  }

  if (methodologyByKind.size) {
    declare('STD-0011#R-21', each((artifact) => {
      const type = artifact.envelope?.identity?.artifact_type;
      const kind = declarations.get(type)?.producer_kind;
      const methodology = methodologyByKind.get(kind);
      if (!methodology) return [];
      // STD-0010 R-50: an absent consumes key is an unestablished contract, not an
      // empty one. There is nothing here to compare an emitted derivation against,
      // and treating absence as "declares nothing" would fail every consumption a
      // methodology has not yet operationalized — which is the reading R-50 forbids.
      if (methodology.meta.consumes === undefined) return [];
      const declared = new Set((Array.isArray(methodology.meta.consumes) ? methodology.meta.consumes : []).map((e) => e?.type));
      const problems = [];
      for (const entry of artifact.envelope?.lineage?.derives_from ?? []) {
        const upstream = byIdentity.get(entry.identity);
        const upstreamType = upstream?.envelope?.identity?.artifact_type;
        if (!upstreamType) continue;
        const upstreamKind = declarations.get(upstreamType)?.producer_kind;
        if (!upstreamKind || upstreamKind === kind) continue;
        if (!declared.has(upstreamType)) {
          problems.push(`derives from ${upstreamType}, which ${methodology.meta.id} does not declare that it consumes`);
        }
      }
      return problems;
    }));
  }


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

  // ---- STD-0011: consumer duties -------------------------------------------
  //
  // These four were dormant while every artifact in the corpus was produced by a
  // methodology that consumed nothing. A producer that consumes made each of them
  // observable in what it emitted: a lineage entry is a consumption a consumer
  // performed and recorded, so the entry can be compared to the artifact it names.
  // The remaining consumer duties stay unbound because the conditions they govern —
  // a rejection, a stale pair presented together, a cross-revision reuse — do not
  // arise in this corpus, and a check written without a subject would be the
  // failure STD-0012 R-01 exists to prevent.

  // R-11. Compatibility is verified before consumption. The version recorded in
  // the reference is the version the consumer verified against; where it disagrees
  // with the artifact's own declared version, no verification took place.
  declare('STD-0011#R-11', each((artifact) => (artifact.envelope?.lineage?.derives_from ?? []).flatMap((entry) => {
    const upstream = byIdentity.get(entry.identity);
    if (!upstream) return [];
    return upstream.envelope.type.type_version === entry.type_version
      ? [] : [`the reference to ${entry.identity} records type version ${entry.type_version} against the artifact's declared ${upstream.envelope.type.type_version}`];
  })));

  // R-12. Nothing is substituted for the artifact that was named. An entry whose
  // identity resolves to a different type or a different subject revision is a
  // substitution, whatever the reason for it.
  declare('STD-0011#R-12', each((artifact) => (artifact.envelope?.lineage?.derives_from ?? []).flatMap((entry) => {
    const upstream = byIdentity.get(entry.identity);
    if (!upstream) return [];
    const named = IDENTITY.exec(entry.identity);
    const problems = [];
    if (named && upstream.envelope.identity.artifact_type !== named[5]) {
      problems.push(`${entry.identity} resolves to type ${upstream.envelope.identity.artifact_type}`);
    }
    if (upstream.envelope.subject.subject_revision !== entry.subject_revision) {
      problems.push(`${entry.identity} resolves to subject revision ${upstream.envelope.subject.subject_revision} against the referenced ${entry.subject_revision}`);
    }
    return problems;
  })));

  // R-14. Degradation is declared rather than absorbed. An artifact that reports
  // Unavailable is a consumer or producer stating that an input it needed did not
  // arrive, and it must say what did not arrive rather than emit an empty result.
  declare('STD-0011#R-14', each((artifact) => {
    if (artifact.envelope?.completeness?.state !== 'Unavailable') return [];
    const reason = artifact.envelope.completeness.reason ?? '';
    return reason.length > 0 && recordsOf(artifact).length === 0
      ? [] : ['an Unavailable artifact declares no degradation, or carries records while declaring its input unavailable'];
  }));

  // R-40. An artifact is addressed by identity. A reference carrying a path, a URL,
  // or a producer identity in place of an identity is the addressing this
  // requirement forbids, wherever it appears.
  declare('STD-0011#R-40', () => {
    const problems = [];
    for (const { path, artifact } of artifacts) {
      for (const entry of artifact.envelope?.lineage?.derives_from ?? []) {
        if (!IDENTITY.test(entry.identity ?? '')) problems.push(`${path}: lineage addresses ${entry.identity}, which is not an identity`);
        for (const key of Object.keys(entry)) {
          if (['locator', 'path', 'file', 'url', 'producer_id'].includes(key)) {
            problems.push(`${path}: a lineage entry carries ${key}, which addresses by location or producer rather than by identity`);
          }
        }
      }
    }
    return problems.length ? [fail('corpus', problems.join('; '))] : [pass('corpus', 'every artifact reference in the corpus is an identity')];
  });

  // R-23. A producer guarantees, for each type it declares, that an artifact of
  // that type is emitted, that it conforms at the declared version, that its
  // completeness is declared, and that its provenance is recorded.
  //
  // Dormant until a run executed more than one methodology: with one producer per
  // run there was nothing to distinguish "the types this producer declares" from
  // "the types this run emitted". A run composing three methodologies separates
  // them, and `producer_kind` on each declaration is the operand that makes the
  // guarantee evaluable without naming a methodology here.
  declare('STD-0011#R-23', () => {
    const runs = new Map();
    for (const { artifact } of artifacts) {
      const runId = artifact.envelope.identity.run_id;
      if (!runs.has(runId)) runs.set(runId, new Set());
      runs.get(runId).add(artifact.envelope.identity.artifact_type);
    }
    const kindOf = new Map();
    for (const [type, declaration] of declarations) {
      if (!declaration.producer_kind) continue;
      if (!kindOf.has(declaration.producer_kind)) kindOf.set(declaration.producer_kind, new Set());
      kindOf.get(declaration.producer_kind).add(type);
    }

    const results = [];
    for (const [runId, emitted] of runs) {
      // A producer kind participated in this run where the run emitted any type
      // that kind declares. Its guarantee then covers every type it declares.
      for (const [kind, declared] of kindOf) {
        const present = [...declared].filter((type) => emitted.has(type));
        if (!present.length) continue;
        const absent = [...declared].filter((type) => !emitted.has(type));
        if (absent.length) {
          results.push(fail(runId, `${kind} emitted ${present.length} of the ${declared.size} types it declares; ${absent.join(', ')} is guaranteed and absent`));
          continue;
        }
        const undeclaredState = [...declared].filter((type) => {
          const artifact = artifacts.find(({ artifact: a }) => a.envelope.identity.run_id === runId && a.envelope.identity.artifact_type === type)?.artifact;
          return !artifact?.envelope?.completeness?.state || !artifact?.envelope?.provenance?.producer_id;
        });
        results.push(undeclaredState.length
          ? fail(runId, `${kind}: ${undeclaredState.join(', ')} declares no completeness state or records no provenance`)
          : pass(runId, `${kind} emitted all ${declared.size} types it declares, each with a completeness state and recorded provenance`));
      }
    }
    return results.length ? results : [pass('corpus', 'no run emits a type any declaration attributes to a producer kind')];
  });

  // R-30. Compatibility is evaluated against the declared profile rather than
  // against the whole type. What an artifact witnesses is a consumption that
  // happened, so the check evaluates the consumption it can see: every field the
  // named profile reads must be a field the consumed type still declares. It
  // deliberately does not require the type's other fields to be satisfied —
  // demanding those would be evaluating the whole type, which is the behaviour
  // R-30 forbids. Its coverage is bounded to consumption a profile was recorded
  // for; STD-0008 section 20 states what remains unwitnessed.
  declare('STD-0011#R-30', () => {
    const results = [];
    for (const { path, artifact } of artifacts) {
      for (const entry of artifact.envelope?.lineage?.derives_from ?? []) {
        const named = entry.consumption_profile;
        if (named === undefined) continue;
        const upstreamType = (entry.identity ?? '').split('/').pop().split('@')[0];
        const declaration = declarations.get(upstreamType);
        const profile = (Array.isArray(declaration?.consumption_profiles) ? declaration.consumption_profiles : [])
          .find((p) => p?.consumer === named);
        if (!profile) continue; // R-59 owns an unresolvable profile reference.
        const declared = new Set([
          ...(Array.isArray(declaration.required_fields) ? declaration.required_fields : []),
          ...(Array.isArray(declaration.optional_fields) ? declaration.optional_fields : []),
        ]);
        const missing = (Array.isArray(profile.reads) ? profile.reads : []).filter((f) => !declared.has(f));
        results.push(missing.length
          ? fail(path, `consumed ${upstreamType} through the ${named} profile, which reads ${missing.join(', ')} that the type no longer declares`)
          : pass(path, `consumption of ${upstreamType} was compatible with the ${named} profile over ${profile.reads.length} fields`));
      }
    }
    return results.length ? results : [pass('corpus', 'no artifact records a consumption drawn through a declared profile')];
  });

  return bound;
}
