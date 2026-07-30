#!/usr/bin/env node
// Reference validator for the AI Engineering Framework.
// The executable implementation of STD-0012.
//
// It holds no knowledge of any individual document. The corpus, the requirement
// set, the vocabularies, and the normativity of every section are read from the
// repository. Every check binds to a declared requirement identity.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

import { loadCorpus, loadRegistry } from './lib/corpus.mjs';
import { loadInstances } from './lib/instances.mjs';
import { buildCatalogue, unboundObligations } from './lib/requirements.mjs';
import { buildChecks } from './lib/checks.mjs';
import { validationArtifact, validationReport, registryReport, traceabilityReport, requirementReport, generator } from './lib/reports.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(here, 'framework.config.json'), 'utf8'));
const root = resolve(process.argv[2] ?? join(here, '..', '..'));

function revisionOf(dir) {
  try {
    return execSync('git rev-parse HEAD', { cwd: dir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'unknown';
  }
}

const documents = loadCorpus(root, config);
const registry = loadRegistry(documents, config.registryDocumentId);
const catalogue = buildCatalogue(documents);
const unbound = unboundObligations(documents);

const run = {
  runId: `validate-${Date.now().toString(36)}`,
  subject: root,
  revision: revisionOf(root),
  generatedAt: new Date().toISOString(),
  config,
  documents,
  registry,
  catalogue,
  unbound,
  hasInstances: loadInstances(root, config).artifacts.length > 0,
  // A methodology declaring producer_kinds is a producer contract the corpus holds,
  // which changes why a contract requirement that stays unbound is unbound.
  hasContracts: documents.some((d) => d.parsed && d.meta?.object_type === 'Methodology' && d.meta?.producer_kinds !== undefined),
  results: [],
};

const checks = buildChecks({ documents, registry, catalogue, config, root });
run.boundAddresses = new Set(checks.keys());

const byAddress = new Map(catalogue.requirements.map((r) => [r.address, r]));

// Phase order per STD-0012 R-08. A document whose front matter cannot be parsed
// is failed and excluded from later phases rather than guessed at.
for (const [address, fn] of checks) {
  const requirement = byAddress.get(address);
  let findings;
  try {
    findings = fn(run) ?? [];
  } catch (error) {
    findings = [{ outcome: 'fail', subject: 'validator', detail: `check raised: ${error.message}` }];
  }
  for (const finding of findings) {
    run.results.push({
      checkId: `${address}:${run.results.length + 1}`,
      requirement: address,
      standard: requirement?.standard ?? 'unknown',
      class: requirement?.check === 'judgment' ? 'judgment-required' : 'structural',
      severity: requirement?.severity ?? 'blocking',
      evaluated: true,
      ...finding,
    });
  }
}

// Requirements with no bound check are recorded, never assumed to pass.
run.notEvaluatedReason = (requirement) => {
  if (requirement.check === 'judgment') return 'judgment-required; routed to human review';
  const scope = requirement.scope ?? '';
  if (['artifact', 'record', 'evidence', 'artifact-type', 'lineage', 'composition', 'run'].includes(scope)) {
    // Once instances exist, "no subject" stops being true. What remains true of an
    // unbound instance-scoped requirement is that the condition it states does not
    // arise in the corpus, and STD-0012 R-33 requires the reason to say so rather
    // than repeat a reason that has expired.
    return run.hasInstances
      ? 'artifact instances exist; no check is bound because the condition this requirement states does not arise in them'
      : 'no artifact instance or type definition exists in the corpus';
  }
  // Requirements whose subject now exists and which are still unbound for a reason
  // of their own. STD-0012 R-33 requires the reason to be the current one, and
  // "nothing declares a contract" expired when Methodologies began declaring one.
  const STATED = {
    'STD-0011#R-28': 'the version a producer emits is determined by the artifact type declaration, so a check here would restate the comparison STD-0008 R-02 already makes rather than inspect an independent declaration',
    'STD-0011#R-10': 'a declared consumption profile is already evaluated against the offering type by STD-0010 R-27; a second advisory check would add coverage and no evidence',
    'STD-0011#R-20': 'the representation of required and optional is checked by STD-0010 R-48; whether the classification matches producer behaviour is not visible in the corpus and is covered by producer conformance tests',
  };
  if (STATED[requirement.address]) return STATED[requirement.address];
  if (['producer', 'consumer', 'orchestrator', 'contract', 'compatibility', 'evolution', 'substitution', 'precondition', 'postcondition', 'input', 'output', 'failure'].includes(scope)) {
    return run.hasContracts
      ? 'a methodology declares its producer and consumer contract; no check is bound because the condition this requirement states is not observable in what the corpus contains'
      : 'no producer, consumer, or run is registered in the corpus';
  }
  if (['conclusion', 'state', 'confidence', 'completeness', 'promotion', 'degradation', 'propagation', 'scoring', 'conflict'].includes(scope)) {
    return 'no conclusion-bearing artifact exists in the corpus';
  }
  if (['validator', 'lifecycle', 'classification', 'structural', 'semantic', 'unenforceable', 'outcome', 'exception', 'reporting', 'conformance'].includes(scope)) {
    return 'validator self-conformance not yet expressed as a check';
  }
  return 'no check implemented';
};

for (const requirement of catalogue.requirements) {
  if (run.boundAddresses.has(requirement.address)) continue;
  run.results.push({
    checkId: `${requirement.address}:0`,
    requirement: requirement.address,
    standard: requirement.standard,
    class: requirement.check === 'judgment' ? 'judgment-required' : 'structural',
    severity: requirement.severity,
    evaluated: false,
    outcome: 'not-evaluated',
    subject: 'corpus',
    detail: run.notEvaluatedReason(requirement),
  });
}

run.tally = run.results.reduce((acc, r) => { acc[r.outcome] = (acc[r.outcome] ?? 0) + 1; return acc; }, {});
const evaluatedAddresses = new Set(run.results.filter((r) => r.evaluated).map((r) => r.requirement));
run.coverage = {
  total: catalogue.requirements.length,
  evaluated: evaluatedAddresses.size,
  judgment: catalogue.requirements.filter((r) => r.check === 'judgment').length,
  notEvaluated: catalogue.requirements.length - evaluatedAddresses.size,
};

// Subject outcome per STD-0012 R-38.
run.outcome = run.results.some((r) => r.outcome === 'fail') ? 'fail'
  : run.results.some((r) => r.outcome === 'warn') ? 'warn'
  : 'pass';

const outputDir = join(root, config.outputDirectory);
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

const outputs = {
  'validation-artifact.json': JSON.stringify(validationArtifact(run), null, 2),
  'validation-report.md': validationReport(run),
  'registry-report.md': registryReport(run),
  'traceability-report.md': traceabilityReport(run),
  'requirement-report.md': requirementReport(run),
};
for (const [name, content] of Object.entries(outputs)) {
  writeFileSync(join(outputDir, name), content, { encoding: 'utf8' });
}

const failures = run.results.filter((r) => r.outcome === 'fail');
console.log(`${generator.name} ${generator.version}`);
console.log(`revision ${run.revision}`);
console.log(`documents ${documents.length}  registry rows ${registry.rows.length}  standards ${catalogue.standards.length}`);
console.log(`requirements ${run.coverage.total}  evaluated ${run.coverage.evaluated}  judgment ${run.coverage.judgment}  not evaluated ${run.coverage.notEvaluated}`);
console.log(`checks bound ${run.boundAddresses.size}  results ${run.results.length}`);
console.log(`outcomes ${Object.entries(run.tally).map(([k, v]) => `${k}=${v}`).join('  ')}`);
console.log(`unenforceable obligations ${unbound.length}`);
console.log(`subject outcome ${run.outcome.toUpperCase()}`);
if (failures.length) {
  console.log('');
  for (const f of failures.slice(0, 25)) console.log(`  FAIL ${f.requirement}  ${f.subject}  ${f.detail ?? ''}`);
  if (failures.length > 25) console.log(`  … ${failures.length - 25} further failures`);
}
console.log('');
console.log(`reports written to ${config.outputDirectory}/`);

process.exit(failures.length ? 1 : 0);
