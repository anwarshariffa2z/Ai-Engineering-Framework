// The universal artifact envelope.
//
// Framework-generic. Assembles the nine groups STD-0008 section 5 names, using the
// member names STD-0010 R-29 fixes, and computes the two aggregate members of
// STD-0008 R-10 by the propagation rules STD-0007 R-29 and R-30 state. It defines
// no evidence semantics of its own: the vocabularies below are the closed ones the
// standards already own, restated nowhere and imported as ordering only.

import { computeDigest } from './canonical.mjs';
import { artifactIdentity } from './identity.mjs';

// Lattice order, weakest first. STD-0007 section 4 for evidence state, section 7
// for confidence. Order is representation, not meaning.
const EVIDENCE_ORDER = ['Unknown', 'Inferred', 'Observed', 'Verified'];
const CONFIDENCE_ORDER = ['Low', 'Medium', 'High'];
const COMPLETENESS = ['Complete', 'Partial', 'NotApplicable', 'Unavailable', 'Failed'];

// STD-0007 R-30: an aggregate's evidence state is the minimum among the conclusions
// aggregated. Over an artifact with no load-bearing record the minimum is the
// bottom of the lattice, which is the weakest claim available and therefore the
// only one that cannot overstate. The same rule gives the confidence aggregate its
// value under R-29. This reading is recorded in README.md as an ambiguity, because
// neither standard states what the aggregate of an empty record set is.
function minimum(values, order, bottom) {
  let lowest = null;
  for (const value of values) {
    if (!order.includes(value)) continue;
    if (lowest === null || order.indexOf(value) < order.indexOf(lowest)) lowest = value;
  }
  return lowest ?? bottom;
}

// A record's evidence state and confidence are type-declared fields and are read
// from `fields`; whether the record is load-bearing is record metadata, per the
// distinction STD-0007 section 2 draws between a load-bearing and a corroborating
// input.
export function aggregate(records) {
  const loadBearing = records.filter((r) => r.load_bearing !== false);
  const stateOf = (r) => r.fields?.evidence_state;
  const confidenceOf = (r) => r.fields?.confidence;
  return {
    evidence_state: minimum(loadBearing.map(stateOf), EVIDENCE_ORDER, 'Unknown'),
    confidence: minimum(loadBearing.filter((r) => stateOf(r) !== 'Unknown').map(confidenceOf), CONFIDENCE_ORDER, 'Low'),
    // STD-0007 R-43: the distribution is available, not only the minimum.
    distribution: distributionOf(loadBearing),
  };
}

function distributionOf(records) {
  const counts = {};
  for (const record of records) {
    const state = record.fields?.evidence_state;
    const key = state === 'Unknown' ? 'Unknown' : `${state}/${record.fields?.confidence}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

/**
 * Build one artifact. The caller supplies the run context, the type, the records,
 * and the completeness determination its methodology reached; nothing about the
 * artifact's shape is decided here by its type.
 */
export function buildArtifact({ run, artifactType, typeVersion, declaredScope, exclusions, completeness, completenessReason, records, lineage, environment }) {
  if (!COMPLETENESS.includes(completeness)) {
    throw new Error(`completeness "${completeness}" is outside the closed vocabulary of STD-0008 R-45`);
  }
  const assessment = aggregate(records);

  const envelope = {
    identity: {
      run_id: run.runId,
      artifact_type: artifactType,
    },
    type: {
      type_version: typeVersion,
    },
    subject: {
      subject_ref: run.subjectRef,
      subject_revision: run.subjectRevision,
    },
    scope: {
      declared_scope: declaredScope,
      // Required by STD-0008 R-10, so it is present even where nothing was
      // excluded. An empty list is how a run states that it excluded nothing;
      // R-43 governs optional members and does not reach a required one.
      exclusions,
    },
    completeness: {
      state: completeness,
    },
    provenance: {
      producer_id: run.producerId,
      producer_version: run.producerVersion,
      executor_class: run.executorClass,
      generated_at: run.generatedAt,
      authorization: run.authorization,
      redaction_state: run.redactionState,
      environment,
    },
    // STD-0008 R-55. Populated after the artifact is otherwise complete, because a
    // digest cannot exist until the thing it fingerprints does.
    integrity: {},
    lineage: {},
    assessment: {
      evidence_state: assessment.evidence_state,
      confidence: assessment.confidence,
    },
  };

  // STD-0007 R-43 requires the distribution where an aggregate is reported over
  // conclusions. An artifact with no load-bearing record aggregates nothing, and
  // STD-0008 R-43 forbids carrying the member present and empty.
  if (Object.keys(assessment.distribution).length) {
    envelope.assessment.distribution = assessment.distribution;
  }

  // STD-0008 R-10: a completeness reason is required for every state other than
  // Complete. R-43: an optional member is populated or omitted, never present and
  // empty, so the reason is absent rather than null on a Complete artifact.
  if (completeness !== 'Complete') {
    if (!completenessReason) throw new Error(`completeness ${completeness} requires a reason under STD-0008 R-10`);
    envelope.completeness.reason = completenessReason;
  }

  // STD-0008 R-18: lineage is required where any record derives from an upstream
  // artifact and optional where none does. The group is present under STD-0010
  // R-28; its member is omitted rather than emitted empty.
  if (Array.isArray(lineage) && lineage.length) {
    envelope.lineage.derives_from = lineage;
  }

  const artifact = { envelope, body: { records } };
  artifact.envelope.integrity.digest = computeDigest(artifact);
  return artifact;
}

export function identityOf(artifact) {
  return artifactIdentity(
    artifact.envelope.identity.run_id,
    artifact.envelope.identity.artifact_type,
    artifact.envelope.type.type_version,
  );
}

// STD-0008 R-57. A reference that leaves its producing run carries a summary of the
// referenced artifact's envelope, so that a consumer can decide without fetching.
export function envelopeSummary(artifact) {
  return {
    identity: identityOf(artifact),
    type_version: artifact.envelope.type.type_version,
    subject_revision: artifact.envelope.subject.subject_revision,
    completeness_state: artifact.envelope.completeness.state,
    redaction_state: artifact.envelope.provenance.redaction_state,
    evidence_state: artifact.envelope.assessment.evidence_state,
    confidence: artifact.envelope.assessment.confidence,
  };
}

// STD-0008 R-56, with the members STD-0010 R-30 requires of a lineage entry. The
// envelope summary is attached only where the reference leaves its producing run,
// which is the condition R-57 states; a within-run entry carries exactly the
// members R-30 names and nothing further.
export function lineageReference(artifact, dependentRecords, { crossRun = false } = {}) {
  const reference = {
    identity: identityOf(artifact),
    type_version: artifact.envelope.type.type_version,
    subject_revision: artifact.envelope.subject.subject_revision,
    digest: artifact.envelope.integrity.digest,
    dependent_records: dependentRecords,
  };
  if (crossRun) reference.summary = envelopeSummary(artifact);
  return reference;
}
