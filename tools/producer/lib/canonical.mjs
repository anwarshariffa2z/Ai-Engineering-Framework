// Canonical serialization and content integrity.
//
// Framework-generic. Holds no knowledge of any artifact type or methodology.
//
// STD-0008 R-55 requires a content digest computed over the artifact's canonical
// serialization excluding the digest member itself. Neither STD-0008 nor STD-0010
// fixes what that canonical serialization is, so this module states the form this
// reference implementation uses and applies it identically on both sides of a
// verification. The form is recorded in tools/producer/README.md and reported as
// a standards ambiguity rather than treated as a framework decision.
//
// Canonical form: JSON, UTF-8, object members ordered lexicographically at every
// depth, arrays in document order, no insignificant whitespace, no trailing
// newline. The digest is computed over that byte sequence with the digest member
// removed, so it is independent of how the artifact is laid out on disk.

import { createHash } from 'node:crypto';

export const DIGEST_ALGORITHM = 'sha256';

function order(value) {
  if (Array.isArray(value)) return value.map(order);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = order(value[key]);
    return out;
  }
  return value;
}

// The canonical byte sequence of any framework object, digest included.
export function canonicalize(value) {
  return JSON.stringify(order(value));
}

// The digest input of an artifact: its canonical serialization with the digest
// member excluded, per STD-0008 R-55. The integrity group itself is retained so
// that adding a second integrity member later cannot silently change the input.
export function digestInput(artifact) {
  const copy = JSON.parse(JSON.stringify(artifact));
  if (copy.envelope?.integrity) delete copy.envelope.integrity.digest;
  return canonicalize(copy);
}

// A content digest in the representation STD-0010 R-42 requires: algorithm:value,
// the algorithm a lowercase token and the value its lowercase hexadecimal output.
export function computeDigest(artifact) {
  const hash = createHash(DIGEST_ALGORITHM).update(digestInput(artifact), 'utf8').digest('hex');
  return `${DIGEST_ALGORITHM}:${hash}`;
}

export function verifyDigest(artifact) {
  const recorded = artifact.envelope?.integrity?.digest ?? null;
  const computed = computeDigest(artifact);
  return { ok: recorded === computed, recorded, computed };
}

// On-disk form. Deliberately not the canonical form: an artifact is reviewed by
// humans, and the digest is defined over the canonical bytes rather than over
// whatever layout a store happens to use.
export function serializeForStorage(artifact) {
  return `${JSON.stringify(order(artifact), null, 2)}\n`;
}
