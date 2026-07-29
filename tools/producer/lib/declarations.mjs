// Artifact type declarations, read from the corpus.
//
// Framework-generic. A producer that hard-coded the shape of its own output would
// make STD-0013 decorative, so every field name, vocabulary, and fixture case used
// downstream is read from the declaration corpus rather than restated here.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { parseFrontMatter } from '../../validator/lib/yaml.mjs';

function walk(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, found);
    else if (entry.endsWith('.md')) found.push(full);
  }
  return found;
}

// Every declaration in the corpus, keyed by type identity. A producer asks for the
// types it declares it produces; it never invents one and never renames one.
export function loadDeclarations(corpusRoot) {
  const declarations = new Map();
  for (const file of walk(corpusRoot)) {
    const parsed = parseFrontMatter(readFileSync(file, 'utf8'));
    if (!parsed.ok || !Array.isArray(parsed.data.artifact_types)) continue;
    for (const entry of parsed.data.artifact_types) {
      if (entry && typeof entry === 'object' && entry.type) {
        declarations.set(entry.type, { ...entry, declaredIn: file });
      }
    }
  }
  return declarations;
}

export function requireDeclaration(declarations, type) {
  const declaration = declarations.get(type);
  if (!declaration) throw new Error(`artifact type ${type} is not declared in the corpus; a producer may not invent one`);
  return declaration;
}

export function vocabularyFor(declaration, field) {
  const entry = (Array.isArray(declaration.vocabularies) ? declaration.vocabularies : [])
    .find((v) => v && v.field === field);
  return entry ? { kind: entry.kind, values: entry.values } : null;
}

/**
 * A record conforms to its declaration when every required field is present
 * (STD-0013 R-33), every closed vocabulary is respected (R-34), and no undeclared
 * field is carried (R-35). The rules are the declaration's; this applies them.
 *
 * A record's *fields* are the type-declared ones and live under `fields`. A
 * record's framework metadata — its identity under STD-0008 R-06, its evidence
 * under R-14 and R-15, and the scope reason R-44 requires of an Unknown record —
 * is not a type-declared field and is held beside them, so that R-35 can be
 * applied literally rather than with a list of exceptions.
 *
 * One exemption is applied, to records marked `Unknown`. Such a record states that
 * a determination could not be made, so it carries no value that would assert the
 * conclusion it does not make: STD-0007 R-38 forbids a confidence level, R-31
 * admits a score only as an assessment supported by findings, and R-42 forbids an
 * `Unavailable` input contributing to a score at all. STD-0008 R-13 admits an
 * Unknown record in place of one carrying confidence and evidence, and R-44
 * requires it to carry the scope reason that bounds the unknown. A required field
 * is therefore not enforced against an Unknown record, and the scope reason is.
 */
export function checkRecordAgainstDeclaration(declaration, record) {
  const problems = [];
  const fields = record.fields ?? {};
  const unknown = fields.evidence_state === 'Unknown';
  const required = Array.isArray(declaration.required_fields) ? declaration.required_fields : [];

  if (unknown) {
    if (!record.scope_reason) problems.push('an Unknown record carries no scope reason, which STD-0008 R-44 requires');
    if (fields.confidence !== undefined) problems.push('an Unknown record carries a confidence level, which STD-0007 R-38 forbids');
  } else {
    for (const field of required) {
      if (fields[field] === undefined || fields[field] === null || fields[field] === '') {
        problems.push(`required field ${field} is absent`);
      }
    }
  }

  const declared = new Set([...required, ...(Array.isArray(declaration.optional_fields) ? declaration.optional_fields : [])]);
  for (const key of Object.keys(fields)) {
    if (!declared.has(key) && !/^[a-z][a-z0-9]*\.[a-z][a-z0-9_]*$/.test(key)) {
      problems.push(`field ${key} is declared by neither required_fields nor optional_fields`);
    }
  }

  for (const entry of Array.isArray(declaration.vocabularies) ? declaration.vocabularies : []) {
    if (!entry || entry.kind !== 'closed') continue;
    const value = fields[entry.field];
    if (value !== undefined && !entry.values.includes(value)) {
      problems.push(`${entry.field} value "${value}" is outside the closed vocabulary`);
    }
  }
  return problems;
}
