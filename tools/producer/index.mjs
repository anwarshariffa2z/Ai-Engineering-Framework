#!/usr/bin/env node
// Reference producer for AUD-0002 Architecture Discovery.
//
// One run: a subject at a revision, a discriminator supplied by the orchestrator,
// one artifact per declared output type, a digest over each, and a run-scoped
// resolution declaration mapping identity to locator.
//
// The run context below is orchestrator input, not framework derivation. In
// particular RUN_DISCRIMINATOR is a fixture value supplied to the producer, in
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

export function executeRun({ root: runRoot, context = RUN_CONTEXT, outputDirectory = 'artifacts/run-0001' }) {
  const declarations = loadDeclarations(join(runRoot, 'docs'));
  const run = { ...context, runId: runIdentity(context) };

  const artifacts = runArchitectureDiscovery({
    run,
    subjectRoot: join(runRoot, context.subjectRef),
    declarations,
  });

  // STD-0013 R-33 through R-35, applied by the producer to its own output before
  // it is written. A producer that emitted a non-conforming artifact and left the
  // discovery to a validator would be failing STD-0011 R-23 rather than delegating.
  const conformance = [];
  for (const [type, artifact] of artifacts) {
    const declaration = requireDeclaration(declarations, type);
    for (const record of artifact.body.records) {
      for (const problem of checkRecordAgainstDeclaration(declaration, record)) {
        conformance.push(`${type} ${record.record_id}: ${problem}`);
      }
    }
    const verification = verifyDigest(artifact);
    if (!verification.ok) conformance.push(`${type}: digest does not verify against its own content`);
  }
  if (conformance.length) {
    throw new Error(`the producer emitted non-conforming records:\n  ${conformance.join('\n  ')}`);
  }

  const entries = [];
  for (const [, artifact] of artifacts) {
    const locator = locatorFor(artifact, outputDirectory);
    writeArtifact(runRoot, locator, artifact);
    entries.push({ identity: identityOf(artifact), locator });
  }

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

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('index.mjs')) {
  const result = executeRun({ root });
  const lines = [];
  lines.push(`run ${result.run.runId}`);
  lines.push(`artifacts ${result.artifacts.size}`);
  for (const [type, artifact] of result.artifacts) {
    lines.push(`  ${artifact.envelope.completeness.state.padEnd(14)} ${String(artifact.body.records.length).padStart(2)} records  ${type}  ${artifact.envelope.integrity.digest.slice(0, 20)}…`);
  }
  lines.push(`resolution entries ${result.declaration.resolution.length}  unresolvable ${result.declaration.unresolvable.length}`);
  lines.push(`written to ${result.outputDirectory}/`);
  const text = lines.join('\n');
  console.log(text);
  writeFileSync(join(root, result.outputDirectory, 'run-summary.txt'), `${text}\n`, 'utf8');
}
