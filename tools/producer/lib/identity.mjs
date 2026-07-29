// Artifact instance identity.
//
// Framework-generic. Implements STD-0008 R-52 through R-54 and the canonical
// serialization of STD-0010 R-41. It holds no artifact type, no methodology, and
// no storage knowledge: an identity here never contains a locator, and nothing in
// this module reads or writes a file.

const TOKEN = /^[a-z0-9][a-z0-9._-]*$/;
const LOWER = /^[a-z][a-z0-9-]*$/;
const TYPE_ID = /^[a-z][a-z0-9]*\.[a-z]+\.[a-z]+$/;
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export const IDENTITY_PATTERN =
  /^([a-z][a-z0-9-]*)\/([a-z][a-z0-9-]*)@([a-z0-9][a-z0-9._-]*)#([a-z0-9][a-z0-9._-]*)\/([a-z][a-z0-9]*\.[a-z]+\.[a-z]+)@(\d+\.\d+\.\d+)$/;

// STD-0008 R-53. A run identity is the subject authority, subject name, subject
// revision, and the run discriminator. The discriminator is supplied by the
// orchestrator per STD-0011 R-51; nothing here derives one, and ADR-0006's
// deferral of a derivation rule is deliberately not closed by this code.
export function runIdentity({ subjectAuthority, subjectName, subjectRevision, runDiscriminator }) {
  const problems = [];
  if (!LOWER.test(subjectAuthority ?? '')) problems.push(`subject authority "${subjectAuthority}"`);
  if (!LOWER.test(subjectName ?? '')) problems.push(`subject name "${subjectName}"`);
  if (!TOKEN.test(subjectRevision ?? '')) problems.push(`subject revision "${subjectRevision}"`);
  if (!TOKEN.test(runDiscriminator ?? '')) problems.push(`run discriminator "${runDiscriminator}"`);
  if (problems.length) throw new Error(`run identity components outside the grammar of STD-0010 R-41: ${problems.join(', ')}`);
  return `${subjectAuthority}/${subjectName}@${subjectRevision}#${runDiscriminator}`;
}

// STD-0008 R-52. The instance identity is the run identity composed with the type
// identity at its version. It is derivable before the artifact exists, which is
// what lets a consumer request an artifact rather than only recognize one.
export function artifactIdentity(run, artifactType, typeVersion) {
  if (!TYPE_ID.test(artifactType ?? '')) throw new Error(`artifact type "${artifactType}" is outside the STD-0013 R-04 grammar`);
  if (!VERSION.test(typeVersion ?? '')) throw new Error(`type version "${typeVersion}" is not a semantic version`);
  const runId = typeof run === 'string' ? run : runIdentity(run);
  return `${runId}/${artifactType}@${typeVersion}`;
}

export function isWellFormedIdentity(value) {
  return typeof value === 'string' && IDENTITY_PATTERN.test(value);
}

export function parseIdentity(value) {
  const match = IDENTITY_PATTERN.exec(value ?? '');
  if (!match) return null;
  return {
    subjectAuthority: match[1],
    subjectName: match[2],
    subjectRevision: match[3],
    runDiscriminator: match[4],
    artifactType: match[5],
    typeVersion: match[6],
    runId: `${match[1]}/${match[2]}@${match[3]}#${match[4]}`,
  };
}

// STD-0008 R-56. A lineage reference is immutable only where every identity
// component is bound and the upstream digest is present. A reference that leaves
// the revision or the discriminator unbound is mutable and is not admissible in
// lineage.
export function isImmutableReference(reference) {
  return Boolean(
    reference
    && isWellFormedIdentity(reference.identity)
    && typeof reference.digest === 'string'
    && /^[a-z0-9]+:[0-9a-f]+$/.test(reference.digest),
  );
}
