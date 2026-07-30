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

import { executeRun, executeComposedRun, executeThreeStageRun, RUN_CONTEXT, COMPOSED_RUN_CONTEXT, THREE_STAGE_RUN_CONTEXT } from '../index.mjs';
import { consume } from '../consume.mjs';
import { runDatabaseDiscovery, CONSUMED_TYPES } from '../lib/database-discovery.mjs';
import { runBackendDiscovery, CONSUMED_TYPES as BACKEND_INPUTS, PROFILE_CONSUMER, profileFor, projectThroughProfile } from '../lib/backend-discovery.mjs';
import { crossRunScenario } from '../cross-run.mjs';
import { buildInstanceChecks } from '../../validator/lib/instance-checks.mjs';

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

// ---- AUD-0005 Backend Discovery: the third producer -------------------------
//
// A multi-upstream consumer. What these assert that the previous two could not:
// that a producer can consume through a *declared profile* rather than by reading
// whatever an upstream artifact happens to carry, that a conclusion can be drawn
// three hops from its origin with every hop verifiable, and that four absence
// states can arise from four distinct causes in one run.

const threeStage = executeThreeStageRun({ root });
const threeStageAgain = executeThreeStageRun({ root });
const backendDeclared = [...declarations].filter(([, d]) => d.producer_kind === 'backend-discovery').map(([t]) => t);

test('STD-0011#R-23', 'every declared backend type is emitted, and no other', () => {
  assert(backendDeclared.length === 10, `${backendDeclared.length} backend types are declared`);
  const emitted = [...threeStage.backend.artifacts.keys()];
  for (const type of backendDeclared) assert(emitted.includes(type), `${type} is declared and was not emitted`);
  for (const type of emitted) {
    assert(backendDeclared.includes(type), `${type} was emitted and is declared by no backend declaration`);
    assert(declarations.has(type), `${type} is not declared in the corpus at all`);
  }
  assert(emitted.length === 10, `${emitted.length} backend artifacts emitted`);
});

test('STD-0011#R-23', 'one run emits every type of all three methodologies', () => {
  assert(threeStage.artifacts.size === 38, `${threeStage.artifacts.size} artifacts in the three-stage run`);
  const identities = [...threeStage.artifacts.values()].map(identityOf);
  assert(new Set(identities).size === identities.length, 'two artifacts of the run share one identity');
});

test('STD-0011#R-40', 'both upstream methodologies are reached by identity and by no other means', () => {
  assert(BACKEND_INPUTS.length === 8, `${BACKEND_INPUTS.length} consumed types`);
  const architecture = BACKEND_INPUTS.filter((t) => t.startsWith('framework.architecture.'));
  const database = BACKEND_INPUTS.filter((t) => t.startsWith('framework.database.'));
  assert(architecture.length === 6 && database.length === 2, 'the input set is not drawn from two methodologies');
  for (const item of threeStage.backend.traceability) {
    assert(isWellFormedIdentity(item.identity), `${item.upstream_type} was not addressed by an identity`);
  }
  const source = readFileSync(join(root, 'tools/producer/lib/backend-discovery.mjs'), 'utf8');
  assert(!/artifacts\/run-|\.\.\/\.\.\/artifacts/.test(source), 'the backend producer names an artifact path');
  assert(!/architecture-discovery|database-discovery/.test(source), 'the backend producer reaches into another methodology');
});

test('STD-0011#R-30', 'compatibility is evaluated against the declared profile where one exists', () => {
  const withProfile = threeStage.backend.traceability.filter((t) => t.profile);
  assert(withProfile.length === 7, `${withProfile.length} inputs were evaluated against a profile`);
  for (const item of withProfile) {
    assert(item.compatibility_basis.startsWith('profile:'), `${item.upstream_type} fell back to whole-type compatibility`);
    const declared = declarations.get(item.upstream_type);
    for (const field of item.profile) {
      const fields = [...(declared.required_fields ?? []), ...(declared.optional_fields ?? [])];
      assert(fields.includes(field), `the profile reads ${field}, which ${item.upstream_type} does not declare`);
    }
  }
  const withoutProfile = threeStage.backend.traceability.filter((t) => !t.profile);
  assert(withoutProfile.length === 1 && withoutProfile[0].upstream_type === 'framework.architecture.scope',
    'an input other than scope was consumed without a profile');
});

test('STD-0011#R-30', 'a field the profile does not name is not reachable', () => {
  // The enforcement, not a check of it: the consumer sees a projection, so an
  // undeclared field is absent rather than merely unread.
  const entities = declarations.get('framework.database.entities');
  const profile = profileFor(entities);
  const upstream = threeStage.database.artifacts.get('framework.database.entities');
  const projected = projectThroughProfile(upstream, profile);
  assert(projected.length === upstream.body.records.length, 'the projection lost a record');
  for (const record of projected) {
    for (const key of Object.keys(record.fields)) {
      assert(profile.reads.includes(key), `the projection exposes ${key}, which the profile does not name`);
    }
    assert(record.fields.classification === undefined, 'an undeclared field survived the projection');
    assert(record.fields.growth_class === undefined, 'an undeclared field survived the projection');
  }
  const carried = upstream.body.records.some((r) => r.fields.classification !== undefined);
  assert(carried, 'the upstream artifact does not carry the field this test proves is withheld');
});

test('STD-0008#R-56', 'a three-hop derivation resolves and verifies at every hop', () => {
  // architecture.modules -> database.entities -> backend.dataaccess
  const dataaccess = threeStage.backend.artifacts.get('framework.backend.dataaccess');
  const toEntities = dataaccess.envelope.lineage.derives_from
    .find((e) => e.identity.includes('framework.database.entities'));
  assert(toEntities, 'the access paths do not derive from the entity artifact');

  const entities = threeStage.database.artifacts.get('framework.database.entities');
  assert(toEntities.digest === entities.envelope.integrity.digest, 'hop two does not verify');
  assert(verifyDigest(entities).ok, 'the entity artifact does not verify against its own content');

  const toModules = entities.envelope.lineage.derives_from
    .find((e) => e.identity.includes('framework.architecture.modules'));
  assert(toModules, 'the entity artifact does not derive from the module artifact');
  const modules = threeStage.architecture.get('framework.architecture.modules');
  assert(toModules.digest === modules.envelope.integrity.digest, 'hop one does not verify');
  assert(verifyDigest(modules).ok, 'the module artifact does not verify against its own content');

  for (const entry of [toEntities, toModules]) {
    assert(isImmutableReference(entry), 'a hop of the chain is not an immutable reference');
    assert(entry.subject_revision === THREE_STAGE_RUN_CONTEXT.subjectRevision, 'a hop names another subject revision');
  }
});

test('STD-0008#R-20', 'the derivation graph across three methodologies is acyclic', () => {
  const edges = new Map();
  for (const [type, artifact] of threeStage.artifacts) {
    edges.set(type, (artifact.envelope.lineage?.derives_from ?? []).map((e) => e.identity.split('/').pop().split('@')[0]));
  }
  const state = {};
  const visit = (node) => {
    if (state[node] === 1) throw new Error(`the derivation graph cycles at ${node}`);
    if (state[node] === 2) return;
    state[node] = 1;
    for (const up of edges.get(node) ?? []) visit(up);
    state[node] = 2;
  };
  for (const node of edges.keys()) visit(node);
  const cross = [...edges].flatMap(([t, ups]) => ups.filter((u) => u.split('.')[1] !== t.split('.')[1]).map((u) => `${t} <- ${u}`));
  assert(cross.length >= 5, `${cross.length} cross-methodology edges`);
});

test('STD-0007#R-26', 'a conclusion three hops out is capped by what it derives from', () => {
  const measured = threeStage.backend.granularity;
  assert(measured.length === 2, `${measured.length} three-hop measurements taken`);
  for (const m of measured) {
    const order = ['Low', 'Medium', 'High'];
    assert(order.indexOf(m.cap_from_aggregate.confidence) <= order.indexOf(m.cap_from_used_records.confidence),
      'the aggregate cap is stronger than the cap the used records give, which cannot happen under a minimum');
  }
  // The headroom measurement is diagnostic and must not have leaked into output.
  const serialized = JSON.stringify([...threeStage.artifacts.values()]);
  assert(!serialized.includes('headroom') && !serialized.includes('cap_from_aggregate'),
    'a diagnostic measurement reached an artifact');
});

test('STD-0011#R-27', 'a withheld upstream degrades only what needed it', () => {
  const resolution = { runId: threeStage.run.runId, resolution: threeStage.declaration.resolution.filter((e) => !e.identity.includes('framework.database.entities')), unresolvable: [] };
  const degraded = runBackendDiscovery({ run: threeStage.run, declarations, root, resolution });
  const dataaccess = degraded.artifacts.get('framework.backend.dataaccess');
  assert(dataaccess.envelope.completeness.state === 'Unavailable', dataaccess.envelope.completeness.state);
  assert(dataaccess.envelope.completeness.reason.includes('framework.database.entities'), 'the degradation does not name the input');
  assert(dataaccess.body.records.length === 0, 'an Unavailable artifact carries records');
  const errors = degraded.artifacts.get('framework.backend.errors');
  assert(errors.envelope.completeness.state === 'Complete', 'an artifact that needed nothing was degraded too');
});

test('STD-0007#R-08', 'four absence states arise in one run from four distinct causes', () => {
  const backend = threeStage.backend.artifacts;
  const execution = backend.get('framework.backend.execution');
  assert(execution.envelope.completeness.state === 'NotApplicable', execution.envelope.completeness.state);
  assert(execution.body.records.length === 0, 'a NotApplicable artifact carries records');
  assert(/declares no queue|no asynchronous/.test(execution.envelope.completeness.reason), 'the reason is not a finding about the subject');

  const resilience = backend.get('framework.backend.resilience');
  assert(resilience.envelope.completeness.state === 'Partial', resilience.envelope.completeness.state);
  assert(resilience.body.records.length > 0, 'a Partial artifact carries no records');

  const unknowns = [...backend.values()].flatMap((a) => a.body.records).filter((r) => r.fields.evidence_state === 'Unknown');
  assert(unknowns.length >= 3, `${unknowns.length} Unknown records`);
  for (const record of unknowns) {
    assert(record.scope_reason, `${record.record_id} is Unknown and carries no scope reason`);
    assert(record.fields.confidence === undefined, `${record.record_id} is Unknown and carries a confidence`);
  }

  // Unavailable arises only from a withheld input, and never in the clean run.
  const states = [...backend.values()].map((a) => a.envelope.completeness.state);
  assert(!states.includes('Unavailable'), 'the clean run produced an Unavailable artifact');
  assert(new Set(states).size >= 3, 'the run does not distinguish completeness states');
});

test('STD-0007#R-45', 'an artifact with no record aggregates to the bottom of each lattice', () => {
  // Three producers reached this independently through the same generic
  // aggregation, and R-45 now states it. Retargeted from R-30, which governs the
  // minimum over a non-empty set and declines this case.
  const execution = threeStage.backend.artifacts.get('framework.backend.execution');
  assert(execution.envelope.assessment.evidence_state === 'Unknown', execution.envelope.assessment.evidence_state);
  assert(execution.envelope.assessment.confidence === 'Low', execution.envelope.assessment.confidence);
  assert(execution.envelope.assessment.distribution === undefined, 'an empty artifact reports a distribution');
});

test('STD-0007#R-04', 'the third producer manufactures no Verified evidence either', () => {
  for (const [type, artifact] of threeStage.artifacts) {
    for (const record of artifact.body.records) {
      assert(record.fields.evidence_state !== 'Verified', `${type} ${record.record_id} claims Verified`);
    }
    assert(artifact.envelope.assessment.evidence_state !== 'Verified', `${type} aggregates to Verified`);
  }
});

test('AUD-0005#12', 'the backend producer calls nothing and executes nothing', () => {
  const forbidden = ['node:net', 'node:http', 'node:https', 'node:dgram', 'node:child_process', 'node:worker_threads', 'express', '@prisma/client', 'undici'];
  for (const module of ['lib/backend-discovery.mjs', 'lib/backend-subjects.mjs']) {
    const text = readFileSync(join(root, 'tools/producer', module), 'utf8');
    for (const specifier of forbidden) assert(!text.includes(`from '${specifier}'`), `${module} imports ${specifier}`);
    assert(!/\bfetch\(|\bexec\(|\bspawn\(/.test(text), `${module} calls out of process`);
  }
});

test('STD-0008#R-11', 'no endpoint, credential, or secret value reaches a backend artifact', () => {
  const serialized = JSON.stringify([...threeStage.artifacts.values()]);
  for (const pattern of [/postgres:\/\//i, /https?:\/\/[a-z0-9.-]+\//i, /BEGIN [A-Z ]*PRIVATE KEY/, /"password"\s*:/i, /Bearer [A-Za-z0-9]/]) {
    assert(!pattern.test(serialized), `the run emitted material matching ${pattern}`);
  }
});

test('STD-0008#R-54', 'two three-stage runs are byte-identical', () => {
  for (const [type, artifact] of threeStage.artifacts) {
    const again = threeStageAgain.artifacts.get(type);
    assert(canonicalize(artifact) === canonicalize(again), `${type} differs between two runs`);
    assert(artifact.envelope.integrity.digest === again.envelope.integrity.digest, `${type} digest differs between two runs`);
  }
});

test('STD-0008#R-55', 'the earlier reference runs are untouched by the third producer', () => {
  for (const [directory, context] of [['artifacts/run-0001', RUN_CONTEXT], ['artifacts/run-0002', COMPOSED_RUN_CONTEXT]]) {
    for (const file of readdirSync(join(root, directory)).filter((f) => f.endsWith('.json') && f !== 'resolution.json')) {
      const artifact = JSON.parse(readFileSync(join(root, directory, file), 'utf8'));
      assert(verifyDigest(artifact).ok, `${directory}/${file} no longer verifies`);
      assert(artifact.envelope.subject.subject_ref === context.subjectRef, `${directory}/${file} names another subject`);
    }
  }
});

// ---- validator regression: the members a check may reach ---------------------
//
// These drive the validator's own checks against synthetic artifacts rather than
// against the reference runs, because the states under test are ones a conforming
// producer never emits. Each asserts that a check evaluates the requirement it is
// bound to and no more, per STD-0012 R-03.

function runCheck(address, artifact) {
  const collected = [];
  buildInstanceChecks({
    instances: { artifacts: [{ path: 'synthetic', artifact }], resolutions: [] },
    declarations: syntheticDeclarations,
    documents: [],
    define: (bound, fn) => { if (bound === address) collected.push(fn); },
  });
  assert(collected.length === 1, `${address} is not bound exactly once`);
  return collected[0]().flat();
}

const outcomes = (results) => results.map((r) => r.outcome);
const details = (results) => results.map((r) => r.detail ?? '').join(' | ');

const syntheticDeclarations = new Map([['framework.synthetic.probe', {
  type: 'framework.synthetic.probe',
  type_version: '1.0.0',
  required_fields: ['finding', 'evidence_state', 'confidence'],
  optional_fields: ['detail'],
}], ['framework.synthetic.upstream', {
  type: 'framework.synthetic.upstream',
  type_version: '1.0.0',
  required_fields: ['finding'],
  optional_fields: [],
  // The second profile reads a field this type no longer declares, which is the
  // state a consumer must reject and a validator must report.
  consumption_profiles: [
    { consumer: 'synthetic-consumer', reads: ['finding'] },
    { consumer: 'stale-consumer', reads: ['finding', 'withdrawn'] },
  ],
}]]);

const upstreamReference = (consumptionProfile) => ({
  identity: 'example/probe@rev-0001#run-9999/framework.synthetic.upstream@1.0.0',
  type_version: '1.0.0',
  subject_revision: 'rev-0001',
  digest: 'sha256:0',
  dependent_records: ['probe-0001'],
  ...(consumptionProfile ? { consumption_profile: consumptionProfile } : {}),
});

function probe({ scope, assessment, records, lineage }) {
  return {
    envelope: {
      ...(lineage ? { lineage: { derives_from: lineage } } : {}),
      identity: { run_id: 'example/probe@rev-0001#run-9999', artifact_type: 'framework.synthetic.probe' },
      type: { type_version: '1.0.0' },
      subject: { subject_ref: 'example/probe', subject_revision: 'rev-0001' },
      scope: scope ?? { declared_scope: 'the synthetic subject', exclusions: [] },
      completeness: { state: 'Complete' },
      provenance: {
        producer_id: 'synthetic', producer_version: '1.0.0', executor_class: 'automated',
        generated_at: '2026-07-29T00:00:00Z', authorization: 'test fixture', redaction_state: 'none',
      },
      integrity: { digest: 'sha256:0' },
      assessment: assessment ?? { evidence_state: 'Observed', confidence: 'High' },
    },
    body: { records: records ?? [] },
  };
}

test('STD-0007#R-45', 'an aggregate over no conclusion at the lattice top is rejected', () => {
  // The failure R-45 exists to prevent: the mathematical infimum over an empty
  // subset of a bounded lattice is its top, and adopting it reports the strongest
  // available claim for an examination that determined nothing.
  const results = runCheck('STD-0007#R-45', probe({
    assessment: { evidence_state: 'Verified', confidence: 'High' },
    records: [],
  }));
  assert(outcomes(results).every((o) => o === 'fail'), `R-45 accepted a top-of-lattice empty aggregate: ${details(results)}`);
});

test('STD-0007#R-45', 'an artifact whose every record is Unknown must still carry Low confidence', () => {
  // The second empty set, and not the same one. R-38 leaves an Unknown record
  // without a confidence, so the evidence set here is non-empty and the confidence
  // set is empty. A check testing only the record count would miss it.
  const records = [{ record_id: 'PRB-0001', fields: { finding: 'a', evidence_state: 'Unknown' }, scope_reason: 'out of scope' }];
  const accepted = runCheck('STD-0007#R-45', probe({ assessment: { evidence_state: 'Unknown', confidence: 'Low' }, records }));
  assert(outcomes(accepted).every((o) => o === 'pass'), `R-45 rejected a conforming all-Unknown aggregate: ${details(accepted)}`);
  const rejected = runCheck('STD-0007#R-45', probe({ assessment: { evidence_state: 'Unknown', confidence: 'High' }, records }));
  assert(outcomes(rejected).every((o) => o === 'fail'), `R-45 accepted High confidence over no confidence: ${details(rejected)}`);
});

test('STD-0007#R-45', 'a non-empty aggregate is left to R-29 and R-30', () => {
  // R-45 governs the empty case only. A wrong minimum over a populated set is a
  // R-29/R-30 failure, and R-45 reporting it too would be the validator binding one
  // requirement to another's subject.
  const results = runCheck('STD-0007#R-45', probe({
    assessment: { evidence_state: 'Verified', confidence: 'High' },
    records: [{ record_id: 'PRB-0001', fields: { finding: 'a', evidence_state: 'Inferred', confidence: 'Low' } }],
  }));
  assert(outcomes(results).every((o) => o === 'pass'), `R-45 reached a non-empty aggregate: ${details(results)}`);
});

test('STD-0008#R-43', 'a required member holding an empty collection is accepted', () => {
  // scope.exclusions is required by R-10. A run that excluded nothing declares an
  // empty list, and R-43 — which governs only a declared optional member — must
  // not reach it. This is the state that produced nineteen false failures.
  const results = runCheck('STD-0008#R-43', probe({
    scope: { declared_scope: 'the synthetic subject', exclusions: [] },
  }));
  assert(outcomes(results).every((o) => o === 'pass'), `required empty member failed R-43: ${details(results)}`);
});

test('STD-0008#R-43', 'a declared optional member left empty is reported', () => {
  const results = runCheck('STD-0008#R-43', probe({
    assessment: { evidence_state: 'Observed', confidence: 'High', distribution: {} },
  }));
  assert(outcomes(results).includes('fail'), 'an empty declared optional member was not reported');
  assert(details(results).includes('assessment.distribution'), `the wrong member was reported: ${details(results)}`);
});

test('STD-0012#R-03', 'the validator does not reinterpret a required member as optional', () => {
  // Every member R-10 requires must be exempt from R-43 for the same reason, not
  // only the one that surfaced the defect. Omitting a required member is R-10's
  // to report, and R-43 must stay silent about it either way.
  const absent = runCheck('STD-0008#R-43', probe({
    scope: { declared_scope: 'the synthetic subject' },
  }));
  assert(outcomes(absent).every((o) => o === 'pass'), `R-43 reported an absent required member: ${details(absent)}`);
  for (const [group, members] of [['completeness', ['state']], ['integrity', ['digest']]]) {
    for (const member of members) {
      const artifact = probe({});
      artifact.envelope[group][member] = '';
      const results = runCheck('STD-0008#R-43', artifact);
      assert(outcomes(results).every((o) => o === 'pass'), `R-43 reached required member ${group}.${member}`);
    }
  }
});

test('STD-0008#R-58', 'a record carries its type-declared values in fields', () => {
  const good = runCheck('STD-0008#R-58', probe({
    records: [{
      record_id: 'probe-0001',
      fields: { finding: 'a finding', evidence_state: 'Observed', confidence: 'High' },
      evidence: [{ evidence_id: 'probe-0001-e1' }],
      load_bearing: true,
    }],
  }));
  assert(outcomes(good).every((o) => o === 'pass'), `a conforming record failed R-58: ${details(good)}`);

  const beside = runCheck('STD-0008#R-58', probe({
    records: [{ record_id: 'probe-0001', finding: 'a finding', fields: { evidence_state: 'Observed' } }],
  }));
  assert(outcomes(beside).includes('fail'), 'a type-declared field sitting beside fields was not reported');

  const missing = runCheck('STD-0008#R-58', probe({ records: [{ record_id: 'probe-0001' }] }));
  assert(outcomes(missing).includes('fail'), 'a record with no fields member was not reported');
});

test('STD-0013#R-37', 'a record marked Unknown is exempt from required_fields and remains a record', () => {
  // R-33's only qualification. The record is present, counted, and addressable;
  // what R-37 licenses mechanically is that R-33 stops applying to it. Whether the
  // omission is honest is judgment and is deliberately not asserted here.
  const unknown = runCheck('STD-0008#R-02', probe({
    records: [{
      record_id: 'probe-0001',
      fields: { evidence_state: 'Unknown' },
      scope_reason: 'the determination could not be made from the evidence in scope',
    }],
  }));
  assert(outcomes(unknown).every((o) => o === 'pass'), `an Unknown record was held to required_fields: ${details(unknown)}`);

  const concluding = runCheck('STD-0008#R-02', probe({
    records: [{ record_id: 'probe-0001', fields: { evidence_state: 'Observed', confidence: 'High' } }],
  }));
  assert(outcomes(concluding).includes('fail'), 'a concluding record was exempted from required_fields');
});

// ---- consumption-profile traceability, STD-0008 R-59 and STD-0011 R-30 -------

const backendEdges = [...threeStage.backend.artifacts.values()]
  .flatMap((artifact) => (artifact.envelope.lineage?.derives_from ?? [])
    .map((entry) => ({ entry, type: entry.identity.split('/').pop().split('@')[0] })));

test('STD-0008#R-59', 'every derivation drawn through a profile records which profile', () => {
  const consumedTypes = new Set(threeStage.backend.inputs.keys());
  const drawn = backendEdges.filter(({ type }) => consumedTypes.has(type));
  assert(drawn.length, 'the backend half drew no derivation from a consumed input');
  for (const { entry, type } of drawn) {
    const profiled = Boolean(threeStage.backend.inputs.get(type).profile);
    const recorded = entry.consumption_profile;
    if (profiled) {
      assert(recorded === PROFILE_CONSUMER, `${type} was consumed through a profile and its lineage entry records ${recorded}`);
    } else {
      assert(recorded === undefined, `${type} was consumed whole and its lineage entry records profile ${recorded}`);
    }
  }
});

test('STD-0008#R-59', 'an input consumed for its envelope alone records no profile', () => {
  // framework.architecture.scope declares no profile for this consumer. Nothing
  // in the run may attach one to it, and no lineage entry anywhere in the corpus
  // may name a profile its consumed type does not declare.
  const unprofiled = [...threeStage.backend.inputs.entries()].filter(([, input]) => !input.profile);
  assert(unprofiled.length, 'no input in the run was consumed without a profile');
  for (const [type] of unprofiled) {
    const named = backendEdges.filter((e) => e.type === type && e.entry.consumption_profile !== undefined);
    assert(!named.length, `${type} declares no profile for this consumer and ${named.length} lineage entries name one`);
  }
});

test('STD-0008#R-59', 'a recorded profile resolves to a declaration of the consumed type', () => {
  const recorded = backendEdges.filter(({ entry }) => entry.consumption_profile !== undefined);
  assert(recorded.length, 'no lineage entry records a consumption profile');
  for (const { entry, type } of recorded) {
    const declaration = declarations.get(type);
    assert(declaration, `a lineage entry names a profile of ${type}, which no declaration defines`);
    const profiles = Array.isArray(declaration.consumption_profiles) ? declaration.consumption_profiles : [];
    const matched = profiles.filter((p) => p.consumer === entry.consumption_profile);
    assert(matched.length === 1, `${entry.consumption_profile} resolves to ${matched.length} profiles of ${type}`);
  }
});

test('STD-0008#R-59', 'a derivation from an artifact this run produced records no profile', () => {
  const produced = new Set(threeStage.backend.artifacts.keys());
  const internal = backendEdges.filter(({ type }) => produced.has(type));
  assert(internal.length, 'the backend half drew no derivation from its own output');
  for (const { entry, type } of internal) {
    assert(entry.consumption_profile === undefined, `an internal derivation from ${type} records profile ${entry.consumption_profile}`);
  }
});

test('STD-0013#R-23', 'a consumer names at most one profile of any one type', () => {
  for (const [type, declaration] of declarations) {
    const consumers = (Array.isArray(declaration.consumption_profiles) ? declaration.consumption_profiles : []).map((p) => p.consumer);
    assert(consumers.length === new Set(consumers).size, `${type} declares two consumption profiles for one consumer`);
  }
});

test('STD-0008#R-59', 'a lineage entry naming a profile the type does not declare is rejected', () => {
  const accepted = runCheck('STD-0008#R-59', probe({ lineage: [upstreamReference('synthetic-consumer')] }));
  assert(outcomes(accepted).every((o) => o === 'pass'), `a declared profile was rejected: ${details(accepted)}`);

  const invented = runCheck('STD-0008#R-59', probe({ lineage: [upstreamReference('consumer-that-declares-nothing')] }));
  assert(outcomes(invented).includes('fail'), 'a profile no declaration defines was accepted');

  const whole = runCheck('STD-0008#R-59', probe({ lineage: [upstreamReference(null)] }));
  assert(outcomes(whole).every((o) => o === 'pass'), `a whole-type read was reported as a defect: ${details(whole)}`);
});

test('STD-0011#R-30', 'compatibility is evaluated over the profile and not over the whole type', () => {
  // The upstream declares a required field the probe's profile does not read.
  // Evaluating the whole type would fail this consumption; evaluating the profile
  // must not, which is the substitution R-30 requires.
  const withinProfile = runCheck('STD-0011#R-30', probe({ lineage: [upstreamReference('synthetic-consumer')] }));
  assert(outcomes(withinProfile).every((o) => o === 'pass'), `a profile-compatible consumption failed: ${details(withinProfile)}`);

  const stale = runCheck('STD-0011#R-30', probe({ lineage: [upstreamReference('stale-consumer')] }));
  assert(outcomes(stale).includes('fail'), 'a profile reading a field the type no longer declares was accepted');
});

test('STD-0011#R-30', 'every profile the run recorded reads only fields its type still declares', () => {
  const recorded = backendEdges.filter(({ entry }) => entry.consumption_profile !== undefined);
  for (const { entry, type } of recorded) {
    const declaration = declarations.get(type);
    const declared = new Set([...(declaration.required_fields ?? []), ...(declaration.optional_fields ?? [])]);
    const profile = declaration.consumption_profiles.find((p) => p.consumer === entry.consumption_profile);
    const missing = profile.reads.filter((f) => !declared.has(f));
    assert(!missing.length, `the ${entry.consumption_profile} profile of ${type} reads undeclared ${missing.join(', ')}`);
  }
});

test('STD-0011#R-30', 'projection stays within the fields the recorded profile declares', () => {
  for (const [type, input] of threeStage.backend.inputs) {
    if (!input.profile) continue;
    const allowed = new Set(input.profile.reads);
    for (const record of input.records) {
      const leaked = Object.keys(record.fields).filter((f) => !allowed.has(f));
      assert(!leaked.length, `${type} exposed ${leaked.join(', ')} outside its profile`);
    }
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
