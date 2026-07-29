// AUD-0002 Architecture Discovery — the methodology-specific half of the reference
// producer.
//
// Everything in this file is AUD-0002-specific: which paths are examined, how a
// record is built for each declared output type, and the order the types are
// emitted in. Everything it uses to express those conclusions — identity,
// envelope, digest, lineage, resolution — is framework-generic and lives in the
// sibling modules. The conclusions themselves are judgements about a subject and
// live in architecture-subjects.mjs.
//
// It restates no framework semantics. Evidence states and confidence levels come
// from STD-0007 and appear here only as values chosen per observation; the
// aggregation, propagation, and envelope rules are applied by envelope.mjs.

import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { buildArtifact, lineageReference } from './envelope.mjs';
import { SUBJECTS } from './architecture-subjects.mjs';

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
  [/^prisma\//, { kind: 'infrastructure', layer: 'data' }],
  [/\.txt$|\.md$/, { kind: 'documentation', layer: null }],
];

function walk(root, dir, found, inaccessible) {
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    const rel = relative(root, full).split(sep).join('/');
    if (statSync(full).isDirectory()) {
      if (inaccessible.includes(rel)) { found.push({ path: `${rel}/`, directory: true, accessible: false }); continue; }
      walk(root, full, found, inaccessible);
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

const identifier = (prefix, index) => `${prefix}-${String(index + 1).padStart(4, '0')}`;

// A record whose evidence items are stated one by one by the subject profile.
function fromSpec(prefix, index, spec, run) {
  const id = identifier(prefix, index);
  return record(
    id,
    spec.fields,
    spec.evidence.map(([location, note], i) => evidence(`${id}-e${i + 1}`, location, run, note)),
    spec.extra ?? {},
  );
}

/**
 * Execute the methodology against a subject and return one artifact per declared
 * output type, in the order AUD-0002 section 6 lists them.
 */
export function runArchitectureDiscovery({ run, subjectRoot, declarations }) {
  const profile = SUBJECTS[run.subjectName];
  if (!profile) throw new Error(`no architecture subject profile is recorded for ${run.subjectName}`);
  const paths = walk(subjectRoot, subjectRoot, [], profile.inaccessibleDirectories);

  const artifacts = new Map();
  const emit = (type, spec) => {
    const declaration = declarations.get(type);
    if (!declaration) throw new Error(`AUD-0002 declares output ${type}, which is not declared in the corpus`);
    const artifact = buildArtifact({
      run,
      artifactType: type,
      typeVersion: declaration.type_version,
      declaredScope: spec.declaredScope ?? profile.declaredScope,
      exclusions: spec.exclusions ?? profile.exclusions,
      completeness: spec.completeness,
      completenessReason: spec.completenessReason,
      records: spec.records,
      lineage: spec.lineage,
      environment: run.environment,
    });
    artifacts.set(type, artifact);
    return artifact;
  };

  // A lineage specification names an upstream type and the records that depend on
  // it. The reference itself is built by the generic module, which is what binds
  // the digest STD-0008 R-56 requires.
  const lineage = (spec) => (spec ?? []).map(([type, dependents]) => lineageReference(artifacts.get(type), dependents));

  // --- scope ---------------------------------------------------------------
  emit('framework.architecture.scope', {
    completeness: 'Complete',
    records: paths.map((entry, index) => {
      const classification = CLASSIFY.find(([pattern]) => pattern.test(entry.path))?.[1] ?? { kind: 'source' };
      const id = identifier('scope', index);
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
  emit('framework.architecture.technology', {
    completeness: profile.technology.completeness,
    records: profile.technology.records.map((t, i) => {
      const id = identifier('technology', i);
      const { note, ...fields } = t;
      return record(id, { ...fields, evidence_state: 'Observed', confidence: 'High' },
        [evidence(`${id}-e1`, t.declaration_path, run, note)]);
    }),
  });

  // --- build ---------------------------------------------------------------
  emit('framework.architecture.build', {
    completeness: profile.build.completeness,
    records: profile.build.records.map((c, i) => {
      const id = identifier('build', i);
      const { state, confidence, ...fields } = c;
      return record(id, { ...fields, evidence_state: state, confidence },
        [evidence(`${id}-e1`, c.definition_path, run, 'command declared, not executed by this audit')]);
    }),
  });

  // --- entrypoints ---------------------------------------------------------
  emit('framework.architecture.entrypoints', {
    completeness: profile.entrypoints.completeness,
    records: profile.entrypoints.records.map((spec, i) => fromSpec('entrypoint', i, spec, run)),
  });

  // --- dependencies --------------------------------------------------------
  emit('framework.architecture.dependencies', {
    completeness: profile.dependencies.completeness,
    completenessReason: profile.dependencies.completenessReason,
    records: profile.dependencies.records.map((d, i) => {
      const id = identifier('dependency', i);
      return record(id, { ...d, evidence_state: 'Observed', confidence: 'High' },
        [evidence(`${id}-e1`, profile.dependencies.evidenceLocation, run, profile.dependencies.evidenceNote)]);
    }),
  });

  // --- modules -------------------------------------------------------------
  emit('framework.architecture.modules', {
    completeness: profile.modules.completeness,
    records: profile.modules.records.map((m, i) => {
      const id = identifier('module', i);
      const { boundary_note, ...fields } = m;
      return record(id, { ...fields, evidence_state: 'Observed', confidence: 'High' },
        [evidence(`${id}-e1`, `${m.module}/`, run, boundary_note ?? 'directory boundary with a single exported interface')]);
    }),
  });

  // --- layers --------------------------------------------------------------
  emit('framework.architecture.layers', {
    completeness: profile.layers.completeness,
    records: profile.layers.records.map((spec, i) => fromSpec('layer', i, spec, run)),
  });

  // --- classification ------------------------------------------------------
  // The first artifact in this run that derives from another. Its conclusion is
  // reasoned from the module and layer observations rather than read anywhere, so
  // it is Inferred and its assumptions are recorded, per STD-0007 R-06.
  emit('framework.architecture.classification', {
    completeness: profile.classification.completeness,
    lineage: lineage(profile.classification.lineage),
    records: profile.classification.records.map((spec, i) => fromSpec('classification', i, spec, run)),
  });

  // --- runtime -------------------------------------------------------------
  emit('framework.architecture.runtime', {
    completeness: profile.runtime.completeness,
    completenessReason: profile.runtime.completenessReason,
    records: profile.runtime.records.map((spec, i) => fromSpec('runtime', i, spec, run)),
  });

  // --- integrations --------------------------------------------------------
  // Where the subject exchanges nothing with an external system this is
  // NotApplicable rather than empty-Complete: a finding about the subject rather
  // than a hole in the audit. STD-0011 R-13 forbids a consumer lowering a score
  // for it.
  emit('framework.architecture.integrations', {
    completeness: profile.integrations.completeness,
    completenessReason: profile.integrations.completenessReason,
    records: profile.integrations.records.map((spec, i) => fromSpec('integration', i, spec, run)),
  });

  // --- configuration -------------------------------------------------------
  emit('framework.architecture.configuration', {
    completeness: profile.configuration.completeness,
    records: profile.configuration.records.map((c, i) => {
      const id = identifier('configuration', i);
      const { evidence_location, ...fields } = c;
      return record(id, { ...fields, evidence_state: 'Observed', confidence: 'High' },
        [evidence(`${id}-e1`, evidence_location ?? profile.configuration.evidenceLocation, run, c.is_secret_reference
          ? 'key is referenced indirectly; no value was read or recorded'
          : 'key and default declared in the configuration file')]);
    }),
  });

  // --- deployment ----------------------------------------------------------
  // Unavailable where definitions exist and were not read; NotApplicable where
  // the subject declares none. The two states are the distinction STD-0008
  // section 20 calls the most expensive to lose.
  emit('framework.architecture.deployment', {
    completeness: profile.deployment.completeness,
    completenessReason: profile.deployment.completenessReason,
    records: profile.deployment.records.map((spec, i) => fromSpec('deployment', i, spec, run)),
  });

  // --- risks ---------------------------------------------------------------
  // A risk derives from the observation that supports it, which is not always the
  // artifact whose subject matter it concerns. Recording an empty artifact as the
  // input would claim a derivation that did not occur and would make the
  // conclusion Unknown under STD-0007 R-28 — losing a finding the audit genuinely
  // established.
  emit('framework.architecture.risks', {
    completeness: profile.risks.completeness,
    lineage: lineage(profile.risks.lineage),
    records: profile.risks.records.map((spec, i) => fromSpec('risk', i, spec, run)),
  });

  // --- health --------------------------------------------------------------
  // A dimension whose load-bearing input is Unavailable, or for which the run
  // holds no supporting observation, is Unknown. STD-0007 R-28 makes those
  // conclusions Unknown and STD-0008 R-44 requires each to carry the scope reason
  // that bounds it. Nothing here averages: R-29 takes the minimum.
  emit('framework.architecture.health', {
    completeness: profile.health.completeness,
    lineage: lineage(profile.health.lineage),
    records: profile.health.records.map((h, i) => {
      const id = identifier('health', i);
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
