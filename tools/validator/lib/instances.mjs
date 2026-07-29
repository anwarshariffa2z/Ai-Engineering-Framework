// Artifact instance loading.
//
// The validator learns which artifact instances exist the same way it learns which
// documents exist: by reading the repository. It holds no knowledge of any artifact
// type, and every rule applied to an instance is read either from the standards or
// from the type's declaration.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep, posix } from 'node:path';

function toPosix(value) {
  return value.split(sep).join(posix.sep);
}

function walk(dir, root, found) {
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, root, found);
    else if (entry.endsWith('.json')) found.push({ absolute: full, path: toPosix(relative(root, full)) });
  }
  return found;
}

/**
 * Load every artifact instance and every run-scoped resolution declaration under
 * the configured artifact root. A file carrying an envelope is an artifact; a file
 * carrying a run identity and a resolution list is a resolution declaration;
 * anything else is neither and is reported rather than guessed at.
 */
export function loadInstances(root, config) {
  const artifactRoot = config.artifactRoot ? join(root, config.artifactRoot) : null;
  const artifacts = [];
  const resolutions = [];
  const unreadable = [];
  if (!artifactRoot || !existsSync(artifactRoot)) return { artifacts, resolutions, unreadable };

  for (const file of walk(artifactRoot, root, [])) {
    let parsed;
    try {
      parsed = JSON.parse(readFileSync(file.absolute, 'utf8'));
    } catch (error) {
      unreadable.push({ path: file.path, reason: error.message });
      continue;
    }
    if (parsed && typeof parsed === 'object' && parsed.envelope) {
      artifacts.push({ path: file.path, artifact: parsed });
    } else if (parsed && typeof parsed === 'object' && parsed.run_id && Array.isArray(parsed.resolution)) {
      resolutions.push({ path: file.path, declaration: parsed });
    }
  }
  return { artifacts, resolutions, unreadable };
}

// Declarations are read from the corpus rather than from a table here, so that a
// type added to the corpus is validated without the validator being edited.
export function declarationIndex(documents) {
  const declarations = new Map();
  for (const doc of documents) {
    if (!Array.isArray(doc.meta?.artifact_types)) continue;
    for (const entry of doc.meta.artifact_types) {
      if (entry && typeof entry === 'object' && entry.type) declarations.set(entry.type, entry);
    }
  }
  return declarations;
}
