// Artifact persistence and the run-scoped resolution declaration.
//
// Framework-generic. This is deliberately the least clever module in the tree: a
// store is a place bytes go, and ADR-0006 keeps location out of identity precisely
// so that this file can be replaced by an object store or a registry without any
// artifact being renamed. Nothing here is a resolver contract, a service, or a
// framework object; STD-0010 R-45 makes a resolution declaration data, and this
// writes that data.

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { serializeForStorage } from './canonical.mjs';
import { identityOf } from './envelope.mjs';

export function writeArtifact(root, relativeLocator, artifact) {
  const target = join(root, relativeLocator);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, serializeForStorage(artifact), { encoding: 'utf8' });
  return relativeLocator;
}

export function readArtifact(root, relativeLocator) {
  return JSON.parse(readFileSync(join(root, relativeLocator), 'utf8'));
}

/**
 * STD-0010 R-45 and STD-0011 R-52. A resolution declaration is run-scoped, lists an
 * identity and a locator per entry, and lives outside every artifact envelope. An
 * identity the run consumes but cannot offer a locator for is recorded unresolvable
 * rather than omitted, so that a consumer meets a declared condition rather than
 * silence.
 */
export function buildResolutionDeclaration({ runId, entries, unresolvable = [] }) {
  return {
    run_id: runId,
    resolution: entries.map(({ identity, locator }) => ({ identity, locator })),
    unresolvable: unresolvable.map(({ identity, reason }) => ({ identity, reason })),
  };
}

export function writeResolutionDeclaration(root, relativePath, declaration) {
  const target = join(root, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(declaration, null, 2)}\n`, { encoding: 'utf8' });
  return relativePath;
}

export function readResolutionDeclaration(root, relativePath) {
  const target = join(root, relativePath);
  if (!existsSync(target)) return null;
  return JSON.parse(readFileSync(target, 'utf8'));
}

export function locatorFor(artifact, directory) {
  return `${directory}/${artifact.envelope.identity.artifact_type}.json`;
}

export { identityOf };
