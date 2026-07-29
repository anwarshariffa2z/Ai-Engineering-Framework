#!/usr/bin/env node
// The cross-run scenario.
//
// Composition within one run is the normal path, and the composed run is where
// AUD-0002 and AUD-0003 meet. This scenario is the abnormal path: a consumer in
// one run holding a reference to an artifact produced by another, which is where
// STD-0008 R-57 and STD-0011 R-49 and R-50 become load-bearing.
//
// The deterministic change is the producer version. A run by a producer at
// 1.0.1 over the same subject at the same revision emits an artifact with the
// same logical identity and different content, because provenance is part of the
// artifact and is not part of its identity. That is precisely the condition the
// integrity member exists for: identity alone cannot tell a consumer whether the
// thing it bound to is the thing it would now resolve.
//
// Nothing here invents a resolver. It builds the same run-scoped resolution
// declaration the producers build and calls the same function over it.

import { dirname, join, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadDeclarations } from './lib/declarations.mjs';
import { runIdentity, artifactIdentity } from './lib/identity.mjs';
import { lineageReference, envelopeSummary } from './lib/envelope.mjs';
import { buildResolutionDeclaration } from './lib/store.mjs';
import { runArchitectureDiscovery } from './lib/architecture-discovery.mjs';
import { resolve as resolveIdentity, OUTCOME, isStale } from './lib/resolver.mjs';
import { executeComposedRun, COMPOSED_RUN_CONTEXT } from './index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolvePath(process.argv[2] ?? join(here, '..', '..'));

const CONSUMED_TYPE = 'framework.architecture.technology';

export function crossRunScenario({ root: runRoot }) {
  const declarations = loadDeclarations(join(runRoot, 'docs'));

  // The producing run, on disk.
  const produced = executeComposedRun({ root: runRoot });
  const current = produced.artifacts.get(CONSUMED_TYPE);
  const identity = artifactIdentity(produced.run.runId, CONSUMED_TYPE, current.envelope.type.type_version);

  // A later run of the same subject at the same revision by a producer at a
  // different version. Same identity, different content.
  const variantContext = { ...COMPOSED_RUN_CONTEXT, producerVersion: '1.0.1' };
  const variantRun = { ...variantContext, runId: runIdentity(variantContext) };
  const variant = runArchitectureDiscovery({
    run: variantRun,
    subjectRoot: join(runRoot, variantContext.subjectRef),
    declarations,
  }).get(CONSUMED_TYPE);

  // The consuming run is a different run over the same subject.
  const consumingContext = { ...COMPOSED_RUN_CONTEXT, runDiscriminator: 'run-0003' };
  const consumingRunId = runIdentity(consumingContext);

  // The consuming run can offer a locator for the other run's artifact. A
  // locator is deployment data under ADR-0006, so a run may hold one for an
  // artifact it did not produce; the identity is unchanged by that fact.
  const declaration = buildResolutionDeclaration({
    runId: consumingRunId,
    entries: [{ identity, locator: `${produced.outputDirectory}/${CONSUMED_TYPE}.json` }],
  });

  const withSummary = lineageReference(current, ['entity-0001'], { crossRun: true });
  const withoutSummary = { ...withSummary };
  delete withoutSummary.summary;
  const stale = { ...lineageReference(variant, ['entity-0001'], { crossRun: true }), summary: envelopeSummary(variant) };

  const run = (reference, over = declaration) => resolveIdentity({ root: runRoot, declaration: over, reference, consumingRunId });

  return {
    identity,
    currentDigest: current.envelope.integrity.digest,
    variantDigest: variant.envelope.integrity.digest,
    // STD-0011 R-50: a reference leaving its producing run is evaluated against
    // its envelope summary, and is refused where the summary is absent.
    noSummary: run(withoutSummary),
    // The reference the consumer bound to is the artifact it now resolves.
    current: run(withSummary),
    // STD-0011 R-49: the upstream was regenerated. The identity still resolves
    // and the content is not the content that was bound, so consumption stops
    // rather than silently taking the newer artifact.
    regenerated: run(stale),
    staleByComparison: isStale(stale, current),
    // STD-0011 R-48: a run with no locator for the identity yields Unavailable,
    // which is a statement about the input and never about the subject.
    unresolvable: run(withSummary, buildResolutionDeclaration({
      runId: consumingRunId,
      entries: [],
      unresolvable: [{ identity, reason: 'this deployment holds no location for an artifact produced by another run' }],
    })),
  };
}

if (process.argv[1]?.endsWith('cross-run.mjs')) {
  const scenario = crossRunScenario({ root });
  console.log(`identity        ${scenario.identity}`);
  console.log(`bound digest    ${scenario.variantDigest}`);
  console.log(`current digest  ${scenario.currentDigest}`);
  console.log(`no summary      ${scenario.noSummary.outcome}: ${scenario.noSummary.reason}`);
  console.log(`current         ${scenario.current.outcome}`);
  console.log(`regenerated     ${scenario.regenerated.outcome}: ${scenario.regenerated.reason}`);
  console.log(`stale           ${scenario.staleByComparison}`);
  console.log(`unresolvable    ${scenario.unresolvable.outcome} -> ${scenario.unresolvable.completeness}`);
  console.log(`                absence means: ${scenario.unresolvable.absence_interpretation}`);
  if (scenario.current.outcome !== OUTCOME.RESOLVED) process.exitCode = 1;
}
