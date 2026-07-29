#!/usr/bin/env node
// Reference producer test suite.
//
// Each case names the requirement whose behaviour it exercises, so that a failing
// test points at a standard rather than at an opinion held by this file. Cases run
// against the artifacts the producer emits, not against hand-written fixtures, so
// that a producer change cannot pass by leaving the tests behind.

import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { canonicalize, computeDigest, verifyDigest, digestInput } from '../lib/canonical.mjs';
import { runIdentity, artifactIdentity, isWellFormedIdentity, isImmutableReference, parseIdentity } from '../lib/identity.mjs';
import { loadDeclarations, checkRecordAgainstDeclaration } from '../lib/declarations.mjs';
import { identityOf } from '../lib/envelope.mjs';
import { readResolutionDeclaration } from '../lib/store.mjs';
import { resolve as resolveIdentity, OUTCOME, isStale } from '../lib/resolver.mjs';
import { readFileSync, readdirSync } from 'node:fs';

import { executeRun, executeComposedRun, RUN_CONTEXT, COMPOSED_RUN_CONTEXT } from '../index.mjs';
import { consume } from '../consume.mjs';
import { runDatabaseDiscovery, CONSUMED_TYPES } from '../lib/database-discovery.mjs';
import { crossRunScenario } from '../cross-run.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(join(here, '..', '..', '..'));

const results = [];
function test(requirement, name, fn) {
  try {
    fn();
    results.push({ ok: true, requirement, name });
  } catch (error) {
    results.push({ ok: false, requirement, name, error: error.message });
  }
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const first = executeRun({ root });
const second = executeRun({ root });
const declarations = loadDeclarations(join(root, 'docs'));
const declaration = readResolutionDeclaration(root, 'artifacts/run-0001/resolution.json');
const scope = first.artifacts.get('framework.architecture.scope');
const health = first.artifacts.get('framework.architecture.health');

// ---- identity --------------------------------------------------------------

test('STD-0008#R-52', 'an identity is the composition of its six components', () => {
  const identity = artifactIdentity(runIdentity(RUN_CONTEXT), 'framework.architecture.scope', '1.0.0');
  assert(identity === 'example/orders-service@rev-0001#run-0001/framework.architecture.scope@1.0.0', identity);
  const parsed = parseIdentity(identity);
  assert(parsed.subjectAuthority === 'example' && parsed.runDiscriminator === 'run-0001', 'components do not round-trip');
});

test('STD-0008#R-54', 'identity is derived, not issued: two runs over the same inputs agree', () => {
  const a = identityOf(first.artifacts.get('framework.architecture.modules'));
  const b = identityOf(second.artifacts.get('framework.architecture.modules'));
  assert(a === b, `${a} !== ${b}`);
});

test('STD-0008#R-54', 'identity encodes no location', () => {
  for (const [, artifact] of first.artifacts) {
    const identity = identityOf(artifact);
    assert(!/:\/\/|\\|\.\.\//.test(identity), `identity carries a locator: ${identity}`);
  }
});

test('STD-0010#R-41', 'a malformed identity is rejected by the canonical grammar', () => {
  assert(isWellFormedIdentity('example/orders-service@rev-0001#run-0001/framework.architecture.scope@1.0.0'), 'well-formed identity rejected');
  for (const bad of [
    'example/orders-service@rev-0001/framework.architecture.scope@1.0.0',
    'example/orders-service@rev-0001#run-0001/framework.architecture.scope',
    'Example/orders-service@rev-0001#run-0001/framework.architecture.scope@1.0.0',
    '/var/artifacts/scope.json',
  ]) {
    assert(!isWellFormedIdentity(bad), `malformed identity accepted: ${bad}`);
  }
});

test('STD-0011#R-51', 'a second run over the same subject and revision takes a distinct identity', () => {
  const other = artifactIdentity(runIdentity({ ...RUN_CONTEXT, runDiscriminator: 'run-0002' }), 'framework.architecture.scope', '1.0.0');
  assert(other !== identityOf(scope), 'two runs over one subject produced one identity');
});

// ---- serialization and integrity -------------------------------------------

test('STD-0008#R-55', 'canonical serialization is stable under member reordering', () => {
  const a = canonicalize({ b: 1, a: { d: 2, c: [3, 4] } });
  const b = canonicalize({ a: { c: [3, 4], d: 2 }, b: 1 });
  assert(a === b, `${a} !== ${b}`);
});

test('STD-0010#R-46', 'canonical output conforms to RFC 8785 member ordering', () => {
  // Section 3.2.3: members are ordered by the UTF-16 code units of their names.
  const canonical = canonicalize({ '\u20ac': 1, '\n': 2, a: 3, 1: 4, '\u0080': 5 });
  assert(canonical === '{"1":4,"\\n":2,"a":3,"\u0080":5,"\u20ac":1}', canonical);
});

test('STD-0010#R-46', 'canonical output conforms to RFC 8785 number serialization', () => {
  // Section 3.2.2.3 defines number output by reference to ECMAScript.
  const vectors = [[0, '0'], [-0, '0'], [1e30, '1e+30'], [0.000001, '0.000001'], [1e-7, '1e-7'], [5e-324, '5e-324'], [9007199254740992, '9007199254740992'], [1.1, '1.1']];
  for (const [value, expected] of vectors) {
    assert(canonicalize(value) === expected, `${value} serialized as ${canonicalize(value)}, expected ${expected}`);
  }
});

test('STD-0010#R-46', 'canonical output escapes as RFC 8785 requires and passes Unicode through', () => {
  assert(canonicalize({ k: 'a\u00e9\u20ac"\\\t\u0001' }) === '{"k":"a\u00e9\u20ac\\"\\\\\\t\\u0001"}', canonicalize({ k: 'a\u00e9\u20ac"\\\t\u0001' }));
});

test('STD-0010#R-46', 'a value RFC 8785 cannot serialize is refused rather than written as null', () => {
  let threw = false;
  try { canonicalize({ k: Number.POSITIVE_INFINITY }); } catch { threw = true; }
  assert(threw, 'a non-finite number was canonicalized');
});

test('STD-0010#R-47', 'every member participates, including an unrecognized namespaced field', () => {
  const extended = JSON.parse(JSON.stringify(scope));
  extended.body.records[0].fields['acme.review_state'] = 'pending';
  const input = digestInput(extended);
  assert(input.includes('acme.review_state'), 'an extension field was dropped from the digest input');
  assert(computeDigest(extended) !== scope.envelope.integrity.digest, 'adding a member left the digest unchanged');
});

test('STD-0008#R-55', 'the digest excludes the digest member from its own input', () => {
  const input = digestInput(scope);
  assert(!input.includes(scope.envelope.integrity.digest), 'the digest appears in its own input');
  assert(input.includes('"integrity":{}'), 'the integrity group was removed rather than emptied');
});

test('STD-0008#R-55', 'the digest is deterministic across runs', () => {
  for (const [type, artifact] of first.artifacts) {
    const other = second.artifacts.get(type);
    assert(artifact.envelope.integrity.digest === other.envelope.integrity.digest, `${type} digests differ across runs`);
  }
});

test('STD-0011#R-47', 'a valid artifact verifies against its own digest', () => {
  for (const [type, artifact] of first.artifacts) {
    assert(verifyDigest(artifact).ok, `${type} does not verify`);
  }
});

test('STD-0011#R-47', 'tampered content is detected', () => {
  const tampered = JSON.parse(JSON.stringify(scope));
  tampered.body.records[0].fields.inclusion = 'excluded';
  const verification = verifyDigest(tampered);
  assert(!verification.ok, 'a tampered artifact verified');
  assert(verification.computed !== verification.recorded, 'the recomputed digest did not move');
});

test('STD-0012#R-41', 'a malformed digest is not a digest', () => {
  const bad = JSON.parse(JSON.stringify(scope));
  bad.envelope.integrity.digest = 'SHA256:NOTHEX';
  assert(!/^[a-z0-9]+:[0-9a-f]+$/.test(bad.envelope.integrity.digest), 'a malformed digest passed the representation of STD-0010 R-42');
  assert(!verifyDigest(bad).ok, 'a malformed digest verified');
});

test('STD-0011#R-49', 'regeneration is detected as a digest difference, not a claim', () => {
  const regenerated = JSON.parse(JSON.stringify(scope));
  regenerated.body.records.pop();
  regenerated.envelope.integrity.digest = computeDigest(regenerated);
  const lineageEntry = health.envelope.lineage.derives_from[0];
  assert(isStale({ ...lineageEntry, digest: scope.envelope.integrity.digest }, regenerated), 'regeneration was not detected');
});

// ---- declaration conformance ------------------------------------------------

test('STD-0013#R-33', 'every emitted record conforms to its type declaration', () => {
  for (const [type, artifact] of first.artifacts) {
    const typeDeclaration = declarations.get(type);
    assert(typeDeclaration, `${type} is not declared in the corpus`);
    for (const record of artifact.body.records) {
      const problems = checkRecordAgainstDeclaration(typeDeclaration, record);
      assert(problems.length === 0, `${type} ${record.record_id}: ${problems.join('; ')}`);
    }
  }
});

test('STD-0008#R-02', 'every artifact declares the exact version its type declares', () => {
  for (const [type, artifact] of first.artifacts) {
    assert(artifact.envelope.type.type_version === declarations.get(type).type_version, `${type} version disagrees with its declaration`);
  }
});

test('STD-0013#R-34', 'a value outside a closed vocabulary is rejected', () => {
  const typeDeclaration = declarations.get('framework.architecture.scope');
  const problems = checkRecordAgainstDeclaration(typeDeclaration, {
    record_id: 'x', fields: { path: 'a', kind: 'source', inclusion: 'maybe', evidence_state: 'Observed', confidence: 'High' }, evidence: [{}],
  });
  assert(problems.some((p) => p.includes('closed vocabulary')), 'an unknown closed-vocabulary value was accepted');
});

test('STD-0008#R-39', 'an unrecognized namespaced extension field is tolerated', () => {
  const typeDeclaration = declarations.get('framework.architecture.scope');
  const problems = checkRecordAgainstDeclaration(typeDeclaration, {
    record_id: 'x',
    fields: { path: 'a', kind: 'source', inclusion: 'included', evidence_state: 'Observed', confidence: 'High', 'acme.review_state': 'pending' },
    evidence: [{}],
  });
  assert(problems.length === 0, `a namespaced extension was rejected: ${problems.join('; ')}`);
});

test('STD-0007#R-38', 'an Unknown record carries a scope reason and no confidence', () => {
  const unknown = health.body.records.filter((r) => r.fields.evidence_state === 'Unknown');
  assert(unknown.length > 0, 'the fixture exercises no Unknown record');
  for (const record of unknown) {
    assert(record.scope_reason, `${record.record_id} carries no scope reason`);
    assert(record.fields.confidence === undefined, `${record.record_id} carries a confidence level`);
    assert(record.fields.score === undefined, `${record.record_id} carries a score`);
  }
});

// ---- completeness -----------------------------------------------------------

test('STD-0008#R-45', 'the run exercises Complete, Partial, NotApplicable, and Unavailable', () => {
  const states = new Set([...first.artifacts.values()].map((a) => a.envelope.completeness.state));
  for (const state of ['Complete', 'Partial', 'NotApplicable', 'Unavailable']) {
    assert(states.has(state), `no artifact declares ${state}`);
  }
});

test('STD-0008#R-10', 'every state other than Complete carries a reason', () => {
  for (const [type, artifact] of first.artifacts) {
    const { state, reason } = artifact.envelope.completeness;
    if (state === 'Complete') assert(reason === undefined, `${type} is Complete and carries a reason`);
    else assert(reason, `${type} is ${state} and carries no reason`);
  }
});

test('STD-0011#R-13', 'Unavailable and NotApplicable are interpreted differently by a consumer', () => {
  const report = consume({ root, runDirectory: 'artifacts/run-0001' });
  const unavailable = report.resolved.find((r) => r.completeness === 'Unavailable');
  const notApplicable = report.resolved.find((r) => r.completeness === 'NotApplicable');
  assert(unavailable && notApplicable, 'the run does not exercise both states');
  assert(unavailable.interpretation !== notApplicable.interpretation, 'a consumer read a hole in the audit as a finding about the subject');
  assert(/must not lower a score/.test(notApplicable.interpretation), 'NotApplicable was not treated as a finding');
});

// ---- lineage ----------------------------------------------------------------

test('STD-0008#R-56', 'every lineage entry is an immutable reference', () => {
  let entries = 0;
  for (const [type, artifact] of first.artifacts) {
    for (const entry of artifact.envelope.lineage.derives_from ?? []) {
      entries += 1;
      assert(isImmutableReference(entry), `${type} carries a mutable lineage reference to ${entry.identity}`);
    }
  }
  assert(entries > 0, 'the run records no lineage at all');
});

test('STD-0008#R-46', 'lineage names the records that depend on it rather than the whole artifact', () => {
  for (const [type, artifact] of first.artifacts) {
    const recordIds = new Set(artifact.body.records.map((r) => r.record_id));
    for (const entry of artifact.envelope.lineage.derives_from ?? []) {
      assert(entry.dependent_records?.length, `${type} records blanket derivation from ${entry.identity}`);
      for (const id of entry.dependent_records) assert(recordIds.has(id), `${type} names a dependent record it does not carry: ${id}`);
    }
  }
});

test('STD-0008#R-19', 'an artifact with no upstream input carries no lineage member', () => {
  assert(scope.envelope.lineage.derives_from === undefined, 'lineage was manufactured for an artifact with no upstream');
});

// ---- resolution -------------------------------------------------------------

test('STD-0011#R-52', 'every produced identity resolves', () => {
  for (const [type, artifact] of first.artifacts) {
    const outcome = resolveIdentity({ root, declaration, reference: identityOf(artifact), consumingRunId: declaration.run_id });
    assert(outcome.outcome === OUTCOME.RESOLVED, `${type} did not resolve: ${outcome.reason}`);
  }
});

test('STD-0011#R-48', 'an unresolvable identity is Unavailable and is not read as absence', () => {
  const report = consume({ root, runDirectory: 'artifacts/run-0001' });
  assert(report.crossRun.outcome === OUTCOME.UNRESOLVABLE, `expected unresolvable, got ${report.crossRun.outcome}`);
  assert(report.crossRun.completeness === 'Unavailable', 'an unresolvable identity was not recorded Unavailable');
  assert(/not evidence that/.test(report.crossRun.absence_interpretation), 'unresolvable was read as absence');
});

test('STD-0011#R-50', 'a cross-run reference without an envelope summary is rejected', () => {
  const outcome = resolveIdentity({
    root,
    declaration,
    reference: { identity: 'other/payments-service@rev-0007#run-0001/framework.architecture.scope@1.0.0', digest: 'sha256:abc' },
    consumingRunId: declaration.run_id,
  });
  assert(outcome.outcome === OUTCOME.REJECTED, `expected rejection, got ${outcome.outcome}`);
});

test('STD-0011#R-47', 'a digest that disagrees with the reference stops consumption', () => {
  const outcome = resolveIdentity({
    root,
    declaration,
    reference: { identity: identityOf(scope), digest: 'sha256:0000000000000000000000000000000000000000000000000000000000000000' },
    consumingRunId: declaration.run_id,
  });
  assert(outcome.outcome === OUTCOME.DIGEST_MISMATCH, `expected a digest mismatch, got ${outcome.outcome}`);
  assert(outcome.completeness === 'Unavailable', 'a mismatched artifact was not treated as a missing input');
});

test('STD-0010#R-45', 'the resolution declaration is run-scoped data outside every envelope', () => {
  assert(declaration.run_id === first.run.runId, 'the declaration is not scoped to the run');
  for (const entry of declaration.resolution) {
    assert(isWellFormedIdentity(entry.identity) && typeof entry.locator === 'string', 'an entry omits an identity or a locator');
  }
  for (const [, artifact] of first.artifacts) {
    assert(!artifact.envelope.resolution && !artifact.envelope.locator, 'an envelope carries resolution information');
  }
});

// ---- AUD-0003: the second producer, and the first consuming one -------------

const composed = executeComposedRun({ root });
const composedAgain = executeComposedRun({ root });
const databaseTypes = [...composed.database.artifacts.keys()];
const composedResolution = readResolutionDeclaration(root, 'artifacts/run-0002/resolution.json');
const scenario = crossRunScenario({ root });

test('STD-0011#R-23', 'every declared database artifact type is emitted', () => {
  assert(databaseTypes.length === 14, `${databaseTypes.length} database artifacts emitted`);
  for (const type of databaseTypes) assert(declarations.has(type), `${type} is not declared in the corpus`);
});

test('STD-0013#R-31', 'no undeclared artifact type is emitted', () => {
  for (const [type] of composed.artifacts) {
    assert(declarations.has(type), `${type} is emitted and not declared`);
    assert(type.startsWith('framework.architecture.') || type.startsWith('framework.database.'), `${type} belongs to no methodology in this run`);
  }
  assert(composed.artifacts.size === 28, `${composed.artifacts.size} artifacts in a run composing two methodologies`);
});

test('STD-0011#R-40', 'the database half consumes the architecture half by identity', () => {
  for (const item of composed.database.consumption) assert(item.obtained, `${item.type} was not obtained`);
  for (const type of CONSUMED_TYPES) {
    const identity = artifactIdentity(composed.run.runId, type, declarations.get(type).type_version);
    assert(composedResolution.resolution.some((e) => e.identity === identity), `${type} is not resolvable by identity`);
  }
});

test('STD-0011#R-40', 'no artifact reference anywhere in the run is a path', () => {
  for (const [, artifact] of composed.artifacts) {
    for (const entry of artifact.envelope.lineage.derives_from ?? []) {
      assert(isWellFormedIdentity(entry.identity), `${entry.identity} is not an identity`);
      assert(!('locator' in entry) && !('path' in entry), 'a lineage entry carries a location');
    }
  }
});

test('STD-0008#R-56', 'cross-methodology lineage resolves and verifies', () => {
  const edges = [];
  for (const [type, artifact] of composed.artifacts) {
    for (const entry of artifact.envelope.lineage.derives_from ?? []) {
      const upstream = entry.identity.split('/').pop().split('@')[0];
      if (type.split('.')[1] !== upstream.split('.')[1]) edges.push([type, upstream, entry]);
    }
  }
  assert(edges.length === 2, `${edges.length} cross-methodology edges`);
  for (const [, , entry] of edges) {
    const outcome = resolveIdentity({ root, declaration: composedResolution, reference: entry, consumingRunId: composed.run.runId });
    assert(outcome.outcome === OUTCOME.RESOLVED, `a cross-methodology edge did not resolve: ${outcome.reason}`);
    assert(outcome.digest === entry.digest, 'a cross-methodology edge resolved to different content than it bound');
  }
});

test('STD-0011#R-47', 'a tampered upstream artifact fails verification', () => {
  const upstream = JSON.parse(JSON.stringify(composed.artifacts.get('framework.architecture.modules')));
  upstream.body.records[0].fields.responsibility = 'something the audit never observed';
  assert(!verifyDigest(upstream).ok, 'a tampered artifact verified against its own digest');
});

test('STD-0011#R-27', 'a missing required input degrades the artifact that needed it', () => {
  const withoutModules = {
    ...composedResolution,
    resolution: composedResolution.resolution.filter((e) => !e.identity.includes('framework.architecture.modules')),
  };
  const degraded = runDatabaseDiscovery({
    run: { ...COMPOSED_RUN_CONTEXT, runId: composed.run.runId },
    subjectRoot: join(root, COMPOSED_RUN_CONTEXT.subjectRef),
    declarations,
    root,
    resolution: withoutModules,
  });
  const entities = degraded.artifacts.get('framework.database.entities');
  assert(entities.envelope.completeness.state === 'Unavailable', `entities reported ${entities.envelope.completeness.state}`);
  assert(entities.envelope.completeness.reason.includes('framework.architecture.modules'), 'the degradation does not name the input');
  assert(entities.body.records.length === 0, 'an artifact that lost its input still carries records');
});

test('STD-0011#R-49', 'a regenerated upstream makes a bound reference stale', () => {
  assert(scenario.regenerated.outcome === OUTCOME.DIGEST_MISMATCH, `${scenario.regenerated.outcome}`);
  assert(scenario.staleByComparison, 'the digest comparison did not report staleness');
  assert(scenario.current.outcome === OUTCOME.RESOLVED, 'the current reference did not resolve');
});

test('STD-0011#R-50', 'a cross-run reference without a summary is refused', () => {
  assert(scenario.noSummary.outcome === OUTCOME.REJECTED, `${scenario.noSummary.outcome}`);
  assert(scenario.unresolvable.completeness === 'Unavailable', 'an unresolvable cross-run identity was not Unavailable');
  assert(scenario.unresolvable.absence_interpretation.startsWith('none'), 'absence was interpreted as a finding');
});

test('STD-0011#R-13', 'NotApplicable and Unavailable are different statements', () => {
  const migration = composed.artifacts.get('framework.database.migration');
  const deployment = first.artifacts.get('framework.architecture.deployment');
  assert(migration.envelope.completeness.state === 'NotApplicable', migration.envelope.completeness.state);
  assert(deployment.envelope.completeness.state === 'Unavailable', deployment.envelope.completeness.state);
  assert(migration.body.records.length === 0 && deployment.body.records.length === 0, 'one of the two carries records');
  assert(migration.envelope.completeness.reason.includes('finding about the subject'), 'NotApplicable does not say what it means');
  const report = consume({ root, runDirectory: 'artifacts/run-0002' });
  const interpretations = new Set(report.resolved.map((r) => r.interpretation));
  assert(interpretations.size > 1, 'a consumer read every completeness state the same way');
});

test('STD-0007#R-38', 'Unknown evidence is a bounded unknown, never an absence', () => {
  const lifecycle = composed.artifacts.get('framework.database.lifecycle');
  const unknowns = lifecycle.body.records.filter((r) => r.fields.evidence_state === 'Unknown');
  assert(unknowns.length === 4, `${unknowns.length} Unknown records`);
  for (const record of unknowns) {
    assert(record.scope_reason && record.scope_reason.length > 20, 'an Unknown record carries no scope reason');
    assert(record.fields.confidence === undefined, 'an Unknown record carries a confidence level');
    assert(record.fields.score === undefined, 'an Unknown record carries a score');
  }
});

test('STD-0007#R-04', 'no Verified evidence is manufactured', () => {
  for (const [type, artifact] of composed.artifacts) {
    for (const record of artifact.body.records) {
      assert(record.fields.evidence_state !== 'Verified', `${type} ${record.record_id} claims Verified with no authorized verification source`);
    }
    assert(artifact.envelope.assessment.evidence_state !== 'Verified', `${type} aggregates to Verified`);
  }
});

test('STD-0008#R-11', 'no secret, credential, endpoint, or record value is emitted', () => {
  const forbidden = [/postgres(ql)?:\/\//i, /redis:\/\//i, /password/i, /PRIVATE KEY/];
  for (const file of readdirSync(join(root, 'artifacts/run-0002'))) {
    const text = readFileSync(join(root, 'artifacts/run-0002', file), 'utf8');
    for (const pattern of forbidden) {
      assert(!pattern.test(text), `${file} matches ${pattern}`);
    }
  }
});

test('AUD-0003#2', 'the producer opens no connection of any kind', () => {
  const modules = ['lib/database-discovery.mjs', 'lib/database-subjects.mjs', 'index.mjs', 'cross-run.mjs', 'consume.mjs'];
  const forbidden = ['node:net', 'node:http', 'node:https', 'node:dgram', 'node:child_process', '@prisma/client', 'ioredis', 'pg'];
  for (const module of modules) {
    const text = readFileSync(join(root, 'tools/producer', module), 'utf8');
    for (const specifier of forbidden) {
      assert(!text.includes(`from '${specifier}'`), `${module} imports ${specifier}`);
    }
  }
});

test('STD-0008#R-54', 'consecutive composed runs are byte-identical', () => {
  for (const [type, artifact] of composed.artifacts) {
    const again = composedAgain.artifacts.get(type);
    assert(canonicalize(artifact) === canonicalize(again), `${type} differs between two runs`);
    assert(artifact.envelope.integrity.digest === again.envelope.integrity.digest, `${type} digest differs between two runs`);
  }
});

test('STD-0010#R-46', 'every emitted artifact satisfies the canonical serialization', () => {
  for (const [type, artifact] of composed.artifacts) {
    const serialized = canonicalize(artifact);
    assert(serialized === canonicalize(JSON.parse(serialized)), `${type} is not stable under a canonical round trip`);
    assert(computeDigest(artifact) === artifact.envelope.integrity.digest, `${type} carries a digest it does not compute to`);
  }
});

// ---- report -----------------------------------------------------------------

const failed = results.filter((r) => !r.ok);
for (const result of results) {
  console.log(`${result.ok ? 'pass' : 'FAIL'}  ${result.requirement.padEnd(14)} ${result.name}`);
  if (!result.ok) console.log(`        ${result.error}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
