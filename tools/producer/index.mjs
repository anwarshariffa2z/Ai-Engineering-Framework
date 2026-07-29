#!/usr/bin/env node
// Reference producers.
//
// One run: a subject at a revision, a discriminator supplied by the orchestrator,
// one artifact per declared output type of every methodology the run executes, a
// digest over each, and a run-scoped resolution declaration mapping identity to
// locator.
//
// Two runs are defined here. The first executes AUD-0002 alone over a subject with
// no persistence. The second composes AUD-0002 and AUD-0003 over a subject with
// persistence, in that order, because AUD-0003 consumes architecture artifact
// types — and consumes them by identity through the resolution declaration the
// first half of the run wrote, never by path and never by calling the producer
// that made them.
//
// The run context below is orchestrator input, not framework derivation. In
// particular the run discriminator is a fixture value supplied to the producer, in
// accordance with STD-0011 R-51. ADR-0006 deferred the rule by which a
// discriminator is derived from a run's declared scope and authorization, and
// nothing here closes that deferral: a producer that needed to derive one would be
// implementing a decision the framework has not taken.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadDeclarations, requireDeclaration, checkRecordAgainstDeclaration } from './lib/declarations.mjs';
import { runIdentity } from './lib/identity.mjs';
import { identityOf } from './lib/envelope.mjs';
import { buildResolutionDeclaration, writeArtifact, writeResolutionDeclaration, locatorFor } from './lib/store.mjs';
import { runArchitectureDiscovery } from './lib/architecture-discovery.mjs';
import { runDatabaseDiscovery } from './lib/database-discovery.mjs';
import { verifyDigest } from './lib/canonical.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(process.argv[2] ?? join(here, '..', '..'));

export const RUN_CONTEXT = {
  subjectAuthority: 'example',
  subjectName: 'orders-service',
  subjectRevision: 'rev-0001',
  // Orchestrator input. Not derived. See the note above.
  runDiscriminator: 'run-0001',
  subjectRef: 'fixtures/subject-repo',
  producerId: 'reference-architecture-discovery',
  producerVersion: '1.0.0',
  executorClass: 'tool',
  generatedAt: '2026-07-29T00:00:00Z',
  authorization: 'read-only inspection of the subject at the audited revision, excluding restricted/',
  redactionState: 'none',
  environment: 'static inspection of subject source; no execution environment was entered',
};

export const COMPOSED_RUN_CONTEXT = {
  subjectAuthority: 'example',
  subjectName: 'orders-db',
  subjectRevision: 'rev-0001',
  runDiscriminator: 'run-0002',
  subjectRef: 'fixtures/subject-repo-db',
  producerId: 'reference-repository-audit',
  producerVersion: '1.0.0',
  executorClass: 'tool',
  generatedAt: '2026-07-29T00:00:00Z',
  authorization: 'read-only inspection of the subject at the audited revision. No database connection of any kind was authorized, attempted, or made',
  redactionState: 'none',
  environment: 'static inspection of subject source; no execution environment was entered and no data store was contacted',
};

// STD-0013 R-33 through R-35, applied by the producer to its own output before it
// is written. A producer that emitted a non-conforming artifact and left the
// discovery to a validator would be failing STD-0011 R-23 rather than delegating.
function gate(artifacts, declarations) {
  const problems = [];
  for (const [type, artifact] of artifacts) {
    const declaration = requireDeclaration(declarations, type);
    for (const record of artifact.body.records) {
      for (const problem of checkRecordAgainstDeclaration(declaration, record)) {
        problems.push(`${type} ${record.record_id}: ${problem}`);
      }
    }
    if (!verifyDigest(artifact).ok) problems.push(`${type}: digest does not verify against its own content`);
  }
  if (problems.length) {
    throw new Error(`the producer emitted non-conforming records:\n  ${problems.join('\n  ')}`);
  }
}

function writeAll(runRoot, artifacts, outputDirectory) {
  const entries = [];
  for (const [, artifact] of artifacts) {
    const locator = locatorFor(artifact, outputDirectory);
    writeArtifact(runRoot, locator, artifact);
    entries.push({ identity: identityOf(artifact), locator });
  }
  return entries;
}

export function executeRun({ root: runRoot, context = RUN_CONTEXT, outputDirectory = 'artifacts/run-0001' }) {
  const declarations = loadDeclarations(join(runRoot, 'docs'));
  const run = { ...context, runId: runIdentity(context) };

  const artifacts = runArchitectureDiscovery({ run, subjectRoot: join(runRoot, context.subjectRef), declarations });
  gate(artifacts, declarations);
  const entries = writeAll(runRoot, artifacts, outputDirectory);

  // STD-0011 R-52. Every identity this run produces carries a resolution. The one
  // identity it consumes and cannot offer a locator for is recorded unresolvable
  // rather than omitted, so that a consumer meets a declared condition.
  const upstream = JSON.parse(readFileSync(join(runRoot, 'fixtures/upstream-reference.json'), 'utf8'));
  const declaration = buildResolutionDeclaration({
    runId: run.runId,
    entries,
    unresolvable: [{
      identity: upstream.identity,
      reason: 'the artifact was produced by another party in another run and no locator is available to this deployment',
    }],
  });
  writeResolutionDeclaration(runRoot, `${outputDirectory}/resolution.json`, declaration);

  return { run, artifacts, declaration, outputDirectory };
}

/**
 * One run executing two methodologies over one subject.
 *
 * The architecture half is written and declared before the database half begins,
 * because the database half resolves its inputs from the run's resolution
 * declaration. That ordering is the whole point of the exercise: the second
 * methodology reaches the first one's output through the framework's resolution
 * mechanism rather than through a shared variable.
 */
export function executeComposedRun({ root: runRoot, context = COMPOSED_RUN_CONTEXT, outputDirectory = 'artifacts/run-0002' }) {
  const declarations = loadDeclarations(join(runRoot, 'docs'));
  const run = { ...context, runId: runIdentity(context) };
  const subjectRoot = join(runRoot, context.subjectRef);

  const architecture = runArchitectureDiscovery({ run, subjectRoot, declarations });
  gate(architecture, declarations);
  const entries = writeAll(runRoot, architecture, outputDirectory);
  writeResolutionDeclaration(runRoot, `${outputDirectory}/resolution.json`,
    buildResolutionDeclaration({ runId: run.runId, entries }));

  const resolution = buildResolutionDeclaration({ runId: run.runId, entries });
  const database = runDatabaseDiscovery({ run, subjectRoot, declarations, root: runRoot, resolution });
  gate(database.artifacts, declarations);
  entries.push(...writeAll(runRoot, database.artifacts, outputDirectory));

  const declaration = buildResolutionDeclaration({ runId: run.runId, entries });
  writeResolutionDeclaration(runRoot, `${outputDirectory}/resolution.json`, declaration);

  const artifacts = new Map([...architecture, ...database.artifacts]);
  return { run, artifacts, architecture, database, declaration, outputDirectory };
}

function summarize(result) {
  const lines = [];
  lines.push(`run ${result.run.runId}`);
  lines.push(`artifacts ${result.artifacts.size}`);
  for (const [type, artifact] of result.artifacts) {
    lines.push(`  ${artifact.envelope.completeness.state.padEnd(14)} ${String(artifact.body.records.length).padStart(2)} records  ${type}  ${artifact.envelope.integrity.digest.slice(0, 20)}…`);
  }
  lines.push(`resolution entries ${result.declaration.resolution.length}  unresolvable ${result.declaration.unresolvable.length}`);
  lines.push(`written to ${result.outputDirectory}/`);
  return lines.join('\n');
}

if (process.argv[1]?.endsWith('index.mjs')) {
  const architectureOnly = executeRun({ root });
  const composed = executeComposedRun({ root });

  for (const result of [architectureOnly, composed]) {
    const text = summarize(result);
    console.log(text);
    writeFileSync(join(root, result.outputDirectory, 'run-summary.txt'), `${text}\n`, 'utf8');
  }

  console.log('consumed by the database half of the composed run:');
  for (const item of composed.database.consumption) {
    console.log(`  ${item.obtained ? 'obtained  ' : 'degraded  '}${item.type}  ${item.used}`);
  }
}
