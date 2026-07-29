// Resolution and consumption.
//
// Framework-generic. Implements the consumer duties of STD-0011 R-47 through R-50
// against a run-scoped resolution declaration. It is a function over data, not a
// resolver service, interface, or framework object: ADR-0006 keeps resolution out
// of the object model, and this module exists to show that the duties are
// dischargeable without one.

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { verifyDigest } from './canonical.mjs';
import { isWellFormedIdentity, parseIdentity } from './identity.mjs';
import { readArtifact } from './store.mjs';

export const OUTCOME = {
  RESOLVED: 'resolved',
  UNRESOLVABLE: 'unresolvable',
  DIGEST_MISMATCH: 'digest-mismatch',
  REJECTED: 'rejected',
};

/**
 * Resolve one identity against a run's resolution declaration and verify what comes
 * back.
 *
 * STD-0011 R-50: a reference naming another run is evaluated against its envelope
 * summary before resolution is attempted, and is rejected where the summary is
 * absent.
 * STD-0011 R-48: an identity that cannot be resolved yields Unavailable. It is
 * never read as absence of the artifact or of the thing the artifact describes.
 * STD-0011 R-47: a resolved artifact whose digest differs from the digest recorded
 * in the reference followed is not consumed.
 */
export function resolve({ root, declaration, reference, consumingRunId }) {
  const identity = typeof reference === 'string' ? reference : reference.identity;

  if (!isWellFormedIdentity(identity)) {
    return { outcome: OUTCOME.REJECTED, identity, reason: 'identity is outside the grammar of STD-0010 R-41' };
  }

  const parsed = parseIdentity(identity);
  const crossRun = parsed.runId !== consumingRunId;
  if (crossRun && typeof reference === 'object' && !reference.summary) {
    return {
      outcome: OUTCOME.REJECTED,
      identity,
      reason: 'a reference naming another run carries no envelope summary; rejected under STD-0011 R-50',
    };
  }

  const entry = (declaration?.resolution ?? []).find((e) => e.identity === identity);
  if (!entry || !entry.locator || !existsSync(join(root, entry.locator))) {
    const recorded = (declaration?.unresolvable ?? []).find((e) => e.identity === identity);
    return {
      outcome: OUTCOME.UNRESOLVABLE,
      identity,
      // STD-0011 R-48, and the completeness mapping of R-25. Unavailable is a
      // statement about the input, never about the subject.
      completeness: 'Unavailable',
      absence_interpretation: 'none — an unresolvable identity is not evidence that the artifact or its subject matter does not exist',
      reason: recorded?.reason ?? 'the run declared no resolution for this identity',
      summary: typeof reference === 'object' ? reference.summary ?? null : null,
    };
  }

  const artifact = readArtifact(root, entry.locator);
  const recordedDigest = typeof reference === 'object' ? reference.digest : artifact.envelope?.integrity?.digest;
  const verification = verifyDigest(artifact);

  if (!verification.ok) {
    return {
      outcome: OUTCOME.DIGEST_MISMATCH,
      identity,
      completeness: 'Unavailable',
      reason: `the resolved artifact does not match its own digest: recorded ${verification.recorded}, computed ${verification.computed}`,
    };
  }
  if (recordedDigest && recordedDigest !== verification.computed) {
    return {
      outcome: OUTCOME.DIGEST_MISMATCH,
      identity,
      completeness: 'Unavailable',
      // STD-0011 R-49: a digest differing from the one recorded in lineage is
      // regeneration of the upstream artifact, which makes the dependent stale.
      reason: `the resolved artifact differs from the reference followed: reference ${recordedDigest}, resolved ${verification.computed}`,
      regenerated: true,
    };
  }

  return { outcome: OUTCOME.RESOLVED, identity, locator: entry.locator, artifact, digest: verification.computed };
}

// STD-0011 R-49 in isolation: staleness is a digest comparison, not a claim.
export function isStale(lineageEntry, currentArtifact) {
  return lineageEntry.digest !== currentArtifact.envelope.integrity.digest;
}
