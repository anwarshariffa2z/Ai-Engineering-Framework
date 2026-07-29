// Canonical serialization and content integrity.
//
// Framework-generic. Holds no knowledge of any artifact type or methodology.
//
// STD-0010 R-46 makes the canonical serialization of an artifact the JSON
// Canonicalization Scheme of RFC 8785, and R-47 requires every member the artifact
// carries to participate in it. STD-0008 R-55 requires the content digest to be
// computed over that serialization with the digest member excluded.
//
// This implementation produces JCS output using the platform's own JSON writer:
// ECMAScript `JSON.stringify` emits UTF-8 without a byte order mark, no
// insignificant whitespace, RFC 8259 shortest-form escaping, and the number format
// RFC 8785 section 3.2.2.3 requires, because that section is defined by reference
// to ECMAScript. The one thing it does not do is order object members, so this
// module sorts them recursively; the default string comparison is over UTF-16 code
// units, which is the order RFC 8785 section 3.2.3 specifies. No third-party
// canonicalizer is required, and none is used.
//
// The digest is computed over the canonical bytes rather than over the file, so it
// is independent of how an artifact is laid out on disk.

import { createHash } from 'node:crypto';

export const DIGEST_ALGORITHM = 'sha256';

function order(value) {
  if (Array.isArray(value)) return value.map(order);
  if (value && typeof value === 'object') {
    const out = {};
    // Array ordering is preserved as written; member ordering is by UTF-16 code
    // unit, which is what the default comparison gives.
    for (const key of Object.keys(value).sort()) out[key] = order(value[key]);
    return out;
  }
  if (typeof value === 'number' && !Number.isFinite(value)) {
    // RFC 8785 admits no serialization for these, and JSON.stringify would write
    // null, silently changing what the digest covers.
    throw new Error('a non-finite number has no canonical serialization under RFC 8785');
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
