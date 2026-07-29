#!/usr/bin/env node
// Reference consumer.
//
// Framework-generic: it reads artifacts it did not produce, of types it is not
// required to understand, using only the envelope, the resolution declaration, and
// the digest. It discharges the consumer duties of STD-0011 R-47 through R-50 and
// records its own degradation under R-14 rather than proceeding silently.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readResolutionDeclaration } from './lib/store.mjs';
import { resolve as resolveIdentity, OUTCOME } from './lib/resolver.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(process.argv[2] ?? join(here, '..', '..'));
const runDirectory = process.argv[3] ?? 'artifacts/run-0001';

export function consume({ root: runRoot, runDirectory: directory }) {
  const declaration = readResolutionDeclaration(runRoot, `${directory}/resolution.json`);
  // A run that declares no unresolvable identity has no cross-run reference to
  // evaluate. The fixture reference belongs to the run that declares it, not to
  // this consumer, which is why it is looked for in the declaration first.
  const upstreamPath = join(runRoot, 'fixtures/upstream-reference.json');
  const upstream = declaration.unresolvable.length && existsSync(upstreamPath)
    ? JSON.parse(readFileSync(upstreamPath, 'utf8'))
    : null;
  const consumingRunId = declaration.run_id;
  const report = { resolved: [], degraded: [], lineage: [] };

  // Every identity the run declares a resolution for.
  for (const entry of declaration.resolution) {
    const outcome = resolveIdentity({ root: runRoot, declaration, reference: entry.identity, consumingRunId });
    if (outcome.outcome !== OUTCOME.RESOLVED) {
      report.degraded.push({ identity: entry.identity, outcome: outcome.outcome, reason: outcome.reason });
      continue;
    }
    const envelope = outcome.artifact.envelope;
    report.resolved.push({
      identity: outcome.identity,
      completeness: envelope.completeness.state,
      evidence_state: envelope.assessment.evidence_state,
      records: outcome.artifact.body.records.length,
      // STD-0011 R-13 and the consumer obligation table of STD-0008 section 10.
      // NotApplicable is a finding about the subject; Unavailable is a hole in the
      // audit. A consumer that read both as "no records" would report a clean
      // result for a domain nobody examined.
      interpretation: interpret(envelope.completeness.state),
    });

    // Lineage is followed by identity and verified by digest, never by path.
    for (const upstreamEntry of envelope.lineage.derives_from ?? []) {
      const followed = resolveIdentity({ root: runRoot, declaration, reference: upstreamEntry, consumingRunId });
      report.lineage.push({
        from: outcome.identity,
        to: upstreamEntry.identity,
        outcome: followed.outcome,
        // STD-0011 R-49: staleness is a digest comparison against the reference
        // followed, not a claim made by either party.
        stale: followed.outcome === OUTCOME.DIGEST_MISMATCH,
      });
    }
  }

  // A reference that leaves its producing run, carrying a summary and no locator.
  if (!upstream) return report;
  const cross = resolveIdentity({ root: runRoot, declaration, reference: upstream, consumingRunId });
  report.crossRun = {
    identity: cross.identity,
    outcome: cross.outcome,
    completeness: cross.completeness ?? null,
    absence_interpretation: cross.absence_interpretation ?? null,
    reason: cross.reason,
    summary_evaluated: Boolean(cross.summary),
  };

  return report;
}

function interpret(state) {
  switch (state) {
    case 'Complete': return 'absence of a record means not found within the declared scope';
    case 'Partial': return 'the unexamined boundary is Unknown; absence must not be read as absence';
    case 'NotApplicable': return 'a valid finding about the subject; must not lower a score and must not be reported as a gap';
    case 'Unavailable': return 'a missing input; must not be interpreted as absence of the thing';
    case 'Failed': return 'a missing input; the failure must be surfaced';
    default: return 'unknown completeness state; fail closed';
  }
}

if (process.argv[1]?.endsWith('consume.mjs')) {
  const report = consume({ root, runDirectory });
  console.log(`resolved ${report.resolved.length} artifacts`);
  for (const item of report.resolved) {
    console.log(`  ${item.completeness.padEnd(14)} ${item.identity.split('/').pop()}  ${item.interpretation}`);
  }
  console.log(`lineage edges followed ${report.lineage.length}, stale ${report.lineage.filter((l) => l.stale).length}`);
  if (report.crossRun) {
    console.log(`cross-run reference ${report.crossRun.outcome}: ${report.crossRun.reason}`);
    console.log(`  recorded completeness ${report.crossRun.completeness}`);
    console.log(`  absence interpretation: ${report.crossRun.absence_interpretation}`);
  }
  if (report.degraded.length) {
    console.log(`degraded inputs ${report.degraded.length}`);
    for (const item of report.degraded) console.log(`  ${item.outcome} ${item.identity}`);
  }
}
