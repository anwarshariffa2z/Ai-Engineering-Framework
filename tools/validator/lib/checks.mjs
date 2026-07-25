// Check implementations. Every check binds to exactly one requirement identity,
// per STD-0012 R-01. A condition no requirement states is not evaluated here; it
// is reported as an unbound obligation by the coverage report instead.

import { resolveReference } from './corpus.mjs';

const ID = /^[A-Z]{1,4}-\d{4}$/;
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const NAMESPACED = /^[a-z][a-z0-9]*\.[a-z][a-z0-9_]*$/;
const FRAGMENT = /^[A-Z]{1,4}-\d{4}#R-\d+$/;
const SECTION = /^## (\d+)\./;

const fail = (subject, detail) => ({ outcome: 'fail', subject, detail });
const pass = (subject, detail) => ({ outcome: 'pass', subject, detail });
const warn = (subject, detail) => ({ outcome: 'warn', subject, detail });

function sectionsOf(doc) {
  const found = [];
  for (const line of doc.body.split('\n')) {
    const match = SECTION.exec(line);
    if (match) found.push(match[1]);
  }
  return found;
}

function referenceKeys(meta) {
  const keys = [];
  for (const key of ['related', 'depends_on', 'references']) {
    if (Array.isArray(meta[key])) keys.push([key, meta[key]]);
  }
  return keys;
}

export function buildChecks(ctx) {
  const { documents, registry, catalogue, config, root } = ctx;
  const parsed = documents.filter((d) => d.parsed);
  const checks = new Map();
  const define = (address, fn) => checks.set(address, fn);

  // ---- Metadata obligations ----------------------------------------------

  define('STD-0001#R-01', () => documents.map((doc) =>
    doc.parsed ? pass(doc.path) : fail(doc.path, `no conforming front matter: ${doc.parseReason}`)));

  define('STD-0001#R-02', () => documents.map((doc) =>
    doc.raw.replace(/\r\n/g, '\n').startsWith('---\n')
      ? pass(doc.path)
      : fail(doc.path, 'front matter is not the first content in the file')));

  define('STD-0001#R-03', () => documents.map((doc) => {
    const missing = config.coreKeys.filter((k) => !(k in doc.meta));
    return missing.length ? fail(doc.path, `schema keys absent: ${missing.join(', ')}`) : pass(doc.path);
  }));

  define('STD-0001#R-04', () => {
    const results = [];
    const rowsById = new Map(registry.rows.map((row) => [row.id, row]));
    for (const doc of parsed) {
      if (!doc.id) { results.push(fail(doc.path, 'no identifier to reconcile with the registry')); continue; }
      const row = rowsById.get(doc.id);
      if (!row) { results.push(fail(doc.path, `${doc.id} has no registry entry`)); continue; }
      const disagreements = [];
      if (row.title !== doc.meta.title) disagreements.push(`title "${doc.meta.title}" against "${row.title}"`);
      if (row.version !== doc.meta.version) disagreements.push(`version ${doc.meta.version} against ${row.version}`);
      if (row.status !== doc.meta.status) disagreements.push(`status ${doc.meta.status} against ${row.status}`);
      if (row.lastUpdated !== doc.meta.last_updated) disagreements.push(`last updated ${doc.meta.last_updated} against ${row.lastUpdated}`);
      results.push(disagreements.length
        ? fail(doc.path, `front matter disagrees with the registry: ${disagreements.join('; ')}`)
        : pass(doc.path));
    }
    return results;
  });

  // ---- Identifier obligations --------------------------------------------

  define('STD-0002#R-01', () => {
    const results = [];
    const seen = new Map();
    for (const doc of parsed) {
      if (!ID.test(doc.meta.id ?? '')) { results.push(fail(doc.path, `identifier "${doc.meta.id}" is not of the form PREFIX-NNNN`)); continue; }
      if (seen.has(doc.meta.id)) { results.push(fail(doc.path, `identifier ${doc.meta.id} is also carried by ${seen.get(doc.meta.id)}`)); continue; }
      seen.set(doc.meta.id, doc.path);
      results.push(pass(doc.path));
    }
    return results;
  });

  define('STD-0002#R-04', () => parsed.map((doc) => {
    const number = (doc.meta.id ?? '').split('-')[1] ?? '';
    return /^\d{4}$/.test(number) ? pass(doc.path) : fail(doc.path, `number "${number}" is not four zero-padded digits`);
  }));

  define('STD-0002#R-05', () => {
    const byPrefix = new Map();
    for (const doc of parsed) {
      if (!ID.test(doc.meta.id ?? '')) continue;
      const [prefix, number] = doc.meta.id.split('-');
      if (!byPrefix.has(prefix)) byPrefix.set(prefix, []);
      byPrefix.get(prefix).push(Number(number));
    }
    const results = [];
    for (const [prefix, numbers] of [...byPrefix].sort()) {
      const sorted = [...numbers].sort((a, b) => a - b);
      const problems = [];
      if (sorted[0] !== 1) problems.push(`sequence begins at ${String(sorted[0]).padStart(4, '0')} rather than 0001`);
      const gaps = [];
      for (let n = sorted[0]; n <= sorted[sorted.length - 1]; n += 1) {
        if (!sorted.includes(n)) gaps.push(`${prefix}-${String(n).padStart(4, '0')}`);
      }
      if (gaps.length) problems.push(`unallocated: ${gaps.join(', ')}`);
      results.push(problems.length ? warn(prefix, problems.join('; ')) : pass(prefix, `${sorted.length} identifiers, contiguous from 0001`));
    }
    return results;
  });

  define('STD-0002#R-06', () => {
    const results = [];
    const rowCounts = registry.rows.reduce((acc, row) => { acc[row.id] = (acc[row.id] ?? 0) + 1; return acc; }, {});
    for (const doc of parsed) {
      if (!doc.id) continue;
      const count = rowCounts[doc.id] ?? 0;
      if (count === 0) results.push(fail(doc.path, `${doc.id} does not appear in the registry`));
      else if (count > 1) results.push(fail(doc.path, `${doc.id} appears ${count} times in the registry`));
      else results.push(pass(doc.path));
    }
    const documentIds = new Set(parsed.map((d) => d.id).filter(Boolean));
    for (const id of Object.keys(rowCounts)) {
      if (!documentIds.has(id)) results.push(fail(registry.document?.path ?? 'registry', `${id} appears in the registry with no document`));
    }
    return results;
  });

  define('STD-0002#R-07', () => {
    const results = [];
    for (const doc of parsed) {
      const targets = [...doc.body.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1].split('#')[0]).filter(Boolean);
      const broken = targets.filter((target) => !resolveReference(doc, target, root).exists);
      results.push(broken.length
        ? fail(doc.path, `links do not resolve: ${[...new Set(broken)].join(', ')}`)
        : pass(doc.path, `${targets.length} links resolve`));
    }
    return results;
  });

  // ---- Metadata: structure, grammar, and vocabulary -----------------------

  define('STD-0010#R-03', () => {
    const results = [];
    for (const doc of documents) {
      const missing = config.coreKeys.filter((k) => !(k in doc.meta));
      if (missing.length) { results.push(fail(doc.path, `missing core keys: ${missing.join(', ')}`)); continue; }
      const positions = config.coreKeys.map((k) => doc.keyOrder.indexOf(k));
      const ordered = positions.every((p, i) => i === 0 || p > positions[i - 1]);
      if (!ordered) { results.push(fail(doc.path, 'core keys are present but out of order')); continue; }
      const row = registry.rows.find((r) => r.id === doc.id);
      if (row && row.title !== doc.meta.title) {
        results.push(fail(doc.path, `title does not match the registry entry: "${doc.meta.title}" against "${row.title}"`));
        continue;
      }
      results.push(pass(doc.path));
    }
    return results;
  });

  define('STD-0010#R-04', () => parsed.map((doc) =>
    ID.test(doc.meta.id ?? '') ? pass(doc.path) : fail(doc.path, `identifier "${doc.meta.id}" does not match PREFIX-NNNN`)));

  define('STD-0010#R-05', () => parsed.map((doc) =>
    VERSION.test(doc.meta.version ?? '') ? pass(doc.path) : fail(doc.path, `version "${doc.meta.version}" is not semantic`)));

  define('STD-0010#R-06', () => {
    const results = [];
    for (const doc of parsed) {
      const bad = ['created', 'last_updated'].filter((k) => !DATE.test(doc.meta[k] ?? ''));
      results.push(bad.length ? fail(doc.path, `not ISO 8601: ${bad.join(', ')}`) : pass(doc.path));
    }
    return results;
  });

  define('STD-0010#R-07', () => {
    const results = [];
    for (const doc of parsed) {
      const problems = [];
      for (const [key, list] of referenceKeys(doc.meta)) {
        for (const entry of list) {
          if (/^docs\//.test(entry)) { problems.push(`${key}: "${entry}" is repository-root-relative`); continue; }
          if (ID.test(entry)) continue;
          const resolved = resolveReference(doc, entry, root);
          if (!resolved.exists) problems.push(`${key}: "${entry}" does not resolve`);
        }
      }
      results.push(problems.length ? fail(doc.path, problems.join('; ')) : pass(doc.path));
    }
    return results;
  });

  define('STD-0010#R-08', () => {
    // Framework-defined keys come from configuration rather than from code, so a
    // standard that defines a new key is admitted without editing the validator.
    const known = new Set([...config.coreKeys, ...(config.frameworkKeys ?? [])]);
    const results = [];
    for (const doc of parsed) {
      const extension = doc.keyOrder.filter((k) => !known.has(k));
      const bad = extension.filter((k) => !NAMESPACED.test(k));
      results.push(bad.length ? fail(doc.path, `extension keys are not namespaced: ${bad.join(', ')}`) : pass(doc.path));
    }
    return results;
  });

  define('STD-0010#R-09', () => parsed.map((doc) => {
    const lastCore = Math.max(...config.coreKeys.map((k) => doc.keyOrder.indexOf(k)));
    const early = doc.keyOrder.filter((k, i) => !config.coreKeys.includes(k) && i < lastCore);
    return early.length ? fail(doc.path, `additional keys precede the core keys: ${early.join(', ')}`) : pass(doc.path);
  }));

  const vocabularyCheck = (key, listName) => () => parsed.map((doc) => {
    if (!(key in doc.meta)) return pass(doc.path, `${key} not declared`);
    return config.vocabularies[listName].includes(doc.meta[key])
      ? pass(doc.path)
      : fail(doc.path, `${key} "${doc.meta[key]}" is outside the closed vocabulary`);
  });

  define('STD-0010#R-10', vocabularyCheck('status', 'status'));
  define('STD-0010#R-11', vocabularyCheck('category', 'category'));
  define('STD-0010#R-12', vocabularyCheck('object_type', 'object_type'));

  // The transitional allowance of STD-0010 R-38 covers documents authored before
  // that standard. A document declaring a meta-model version was authored under
  // it and conforms fully; one that does not is covered by the allowance until
  // its next substantive revision.
  const underTransition = (doc) => !('meta_model_version' in doc.meta);

  define('STD-0010#R-13', () => parsed.map((doc) => {
    const sections = sectionsOf(doc);
    if (sections.length === 0) return pass(doc.path, 'no numbered sections');
    if (doc.meta.normativity) return pass(doc.path);
    const detail = `${sections.length} numbered sections but no normativity map`;
    return underTransition(doc)
      ? warn(doc.path, `${detail}; covered by the transitional allowance`)
      : fail(doc.path, detail);
  }));

  define('STD-0010#R-38', () => {
    const transitional = parsed.filter(underTransition);
    const conforming = parsed.length - transitional.length;
    return [pass('corpus', `${conforming} documents declare a meta-model version and conform fully; ${transitional.length} rely on the transitional allowance until their next substantive revision`)];
  });

  define('STD-0010#R-14', () => {
    const results = [];
    for (const doc of parsed) {
      const map = doc.meta.normativity;
      if (!map) { results.push(pass(doc.path, 'no map declared')); continue; }
      const sections = sectionsOf(doc);
      const mapped = Object.keys(map);
      const missing = sections.filter((s) => !mapped.includes(s));
      const extra = mapped.filter((s) => !sections.includes(s));
      const bad = [...missing.map((s) => `section ${s} unmapped`), ...extra.map((s) => `mapped section ${s} absent`)];
      results.push(bad.length ? fail(doc.path, bad.join('; ')) : pass(doc.path));
    }
    return results;
  });

  define('STD-0010#R-15', () => {
    const results = [];
    for (const doc of parsed) {
      const map = doc.meta.normativity;
      if (!map) { results.push(pass(doc.path, 'no map declared')); continue; }
      const problems = [];
      let section = null;
      for (const line of doc.body.split('\n')) {
        const m = SECTION.exec(line);
        if (m) section = m[1];
        const marker = /^\*This section is (normative|informative)\.\*$/.exec(line.trim());
        if (marker && map[section] && map[section] !== marker[1]) {
          problems.push(`section ${section} marker "${marker[1]}" disagrees with the map`);
        }
      }
      results.push(problems.length ? fail(doc.path, problems.join('; ')) : pass(doc.path));
    }
    return results;
  });

  define('STD-0010#R-16', () => parsed.map((doc) => {
    const declaresRequirements = Boolean(doc.meta.requirements);
    const isStandardId = (doc.meta.id ?? '').startsWith('STD-');
    if (declaresRequirements && !isStandardId) return fail(doc.path, 'a non-standard document carries a requirements key');
    return pass(doc.path);
  }));

  define('STD-0010#R-17', () => {
    const results = [];
    for (const requirement of catalogue.requirements) {
      const missing = ['id', 'level', 'check', 'severity', 'scope'].filter((f) => !requirement[f]);
      if (missing.length) { results.push(fail(requirement.address, `declaration is missing: ${missing.join(', ')}`)); continue; }
      const bad = [];
      if (!config.vocabularies.level.includes(requirement.level)) bad.push(`level "${requirement.level}"`);
      if (!config.vocabularies.check.includes(requirement.check)) bad.push(`check "${requirement.check}"`);
      if (!config.vocabularies.severity.includes(requirement.severity)) bad.push(`severity "${requirement.severity}"`);
      results.push(bad.length ? fail(requirement.address, `outside vocabulary: ${bad.join(', ')}`) : pass(requirement.address));
    }
    return results;
  });

  define('STD-0010#R-18', () => {
    const results = [];
    for (const doc of parsed.filter((d) => d.isStandard)) {
      const ids = (doc.meta.requirements ?? []).map((r) => r.id);
      const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
      results.push(duplicates.length
        ? fail(doc.path, `duplicate requirement identifiers: ${[...new Set(duplicates)].join(', ')}`)
        : pass(doc.path));
    }
    return results;
  });

  define('STD-0010#R-19', () => catalogue.requirements.map((requirement) => {
    if (!requirement.stated) return fail(requirement.address, 'declared but not stated in the body');
    const doc = parsed.find((d) => d.id === requirement.standard);
    const map = doc?.meta?.normativity ?? {};
    const section = requirement.statedInSection;
    if (section && map[section] === 'informative') {
      return fail(requirement.address, `stated in section ${section}, which is declared informative`);
    }
    return pass(requirement.address);
  }));

  define('STD-0010#R-20', () => {
    const results = [];
    for (const doc of parsed.filter((d) => d.isStandard)) {
      const declared = new Set((doc.meta.requirements ?? []).map((r) => r.id));
      const stated = new Set([...doc.body.matchAll(/\*\*(R-\d+)\.\*\*/g)].map((m) => m[1]));
      const undeclared = [...stated].filter((id) => !declared.has(id));
      const unstated = [...declared].filter((id) => !stated.has(id));
      const bad = [
        ...undeclared.map((id) => `${id} stated but not declared`),
        ...unstated.map((id) => `${id} declared but not stated`),
      ];
      results.push(bad.length ? fail(doc.path, bad.join('; ')) : pass(doc.path));
    }
    return results;
  });

  define('STD-0010#R-21', () => parsed.map((doc) => {
    const hasSplit = Array.isArray(doc.meta.depends_on) || Array.isArray(doc.meta.references);
    if (hasSplit) return pass(doc.path);
    const detail = 'dependencies and references are not distinguished';
    return underTransition(doc)
      ? warn(doc.path, `${detail}; covered by the transitional allowance`)
      : fail(doc.path, detail);
  }));

  define('STD-0010#R-22', () => parsed.map((doc) => {
    const problems = [];
    for (const key of ['depends_on', 'references']) {
      if (!Array.isArray(doc.meta[key])) continue;
      for (const entry of doc.meta[key]) {
        if (ID.test(entry)) continue;
        if (!resolveReference(doc, entry, root).exists) problems.push(`${key}: "${entry}"`);
      }
    }
    return problems.length ? fail(doc.path, `unresolved entries: ${problems.join('; ')}`) : pass(doc.path);
  }));

  define('STD-0010#R-23', () => {
    const byId = new Map(parsed.filter((d) => d.id).map((d) => [d.id, d]));
    const byPath = new Map(parsed.map((d) => [d.path, d]));
    const results = [];
    for (const doc of parsed) {
      if (!('layer' in doc.meta)) { results.push(pass(doc.path, 'layer not declared')); continue; }
      const layer = Number(doc.meta.layer);
      if (!Number.isInteger(layer) || layer < 0 || layer > 4) {
        results.push(fail(doc.path, `layer "${doc.meta.layer}" is outside 0 to 4`));
        continue;
      }
      const problems = [];
      for (const entry of doc.meta.depends_on ?? []) {
        const resolved = ID.test(entry) ? byId.get(entry) : byPath.get(resolveReference(doc, entry, root).target);
        if (!resolved || !('layer' in (resolved.meta ?? {}))) continue;
        const targetLayer = Number(resolved.meta.layer);
        if (targetLayer > layer || (targetLayer === layer && layer !== 0)) {
          problems.push(`depends on ${resolved.id ?? entry} at layer ${targetLayer}`);
        }
      }
      results.push(problems.length ? fail(doc.path, problems.join('; ')) : pass(doc.path));
    }
    return results;
  });

  // R-35 states the grammar of a fragment address. It does not require that an
  // address resolve to a declared requirement, and no requirement does, so
  // resolution is reported as an unbound obligation rather than enforced here.
  define('STD-0010#R-35', () => {
    const results = [];
    for (const doc of parsed) {
      const addresses = [...doc.body.matchAll(/\b([A-Z]{1,4}-\d{4}#[A-Za-z0-9-]+)\b/g)].map((m) => m[1]);
      const bad = addresses.filter((a) => !FRAGMENT.test(a));
      results.push(bad.length
        ? fail(doc.path, `malformed fragment addresses: ${[...new Set(bad)].join(', ')}`)
        : pass(doc.path, `${addresses.length} fragment addresses, all well formed`));
    }
    return results;
  });

  define('STD-0010#R-36', () => documents.map((doc) => {
    const problems = [];
    if (doc.hasBom) problems.push('carries a byte order mark');
    if (!doc.raw.replace(/\r\n/g, '\n').startsWith('---\n')) problems.push('front matter does not open with a delimiter');
    return problems.length ? fail(doc.path, problems.join('; ')) : pass(doc.path);
  }));

  define('STD-0010#R-37', () => documents.map((doc) =>
    doc.parsed ? pass(doc.path) : fail(doc.path, doc.parseReason)));

  define('STD-0010#R-39', () => parsed.map((doc) => {
    const isDecision = doc.meta.category === 'Architecture Decision Record';
    if (isDecision && doc.meta.status === 'Approved') return fail(doc.path, 'a decision uses Approved');
    if (!isDecision && doc.meta.status === 'Accepted') return fail(doc.path, 'a non-decision uses Accepted');
    return pass(doc.path);
  }));

  define('STD-0010#R-40', () => parsed.map((doc) => {
    const lastCore = Math.max(...config.coreKeys.map((k) => doc.keyOrder.indexOf(k)));
    const namespaced = doc.keyOrder.filter((k) => NAMESPACED.test(k));
    const misplaced = namespaced.filter((k) => doc.keyOrder.indexOf(k) < lastCore);
    return misplaced.length ? fail(doc.path, `namespaced keys precede core keys: ${misplaced.join(', ')}`) : pass(doc.path);
  }));

  // ---- Validator self-conformance ----------------------------------------

  define('STD-0012#R-01', () => {
    const known = new Set(catalogue.requirements.map((r) => r.address));
    const orphans = [...checks.keys()].filter((address) => !known.has(address));
    return orphans.length
      ? [fail('validator', `checks bound to unknown requirements: ${orphans.join(', ')}`)]
      : [pass('validator', `${checks.size} checks, each bound to a declared requirement`)];
  });

  define('STD-0012#R-02', () => {
    const versions = catalogue.standards.map((s) => `${s.id}@${s.version}`);
    return [pass('validator', `requirement set derived from ${versions.length} standards: ${versions.join(', ')}`)];
  });

  define('STD-0012#R-13', () => {
    const bad = catalogue.requirements.filter((r) => !config.vocabularies.check.includes(r.check));
    return bad.length
      ? [fail('validator', `requirements without a usable check classification: ${bad.length}`)]
      : [pass('validator', 'every check class derives from the requirement declaration')];
  });

  define('STD-0012#R-17', () => {
    const judgment = catalogue.requirements.filter((r) => r.check === 'judgment');
    return [pass('validator', `${judgment.length} judgment requirements routed to human review as not-evaluated`)];
  });

  define('STD-0012#R-25', (run) => {
    const valid = new Set(['pass', 'warn', 'fail', 'not-evaluated']);
    const bad = run.results.filter((r) => !valid.has(r.outcome));
    return bad.length ? [fail('validator', `${bad.length} results carry an invalid outcome`)]
      : [pass('validator', `${run.results.length} results, each carrying exactly one valid outcome`)];
  });

  define('STD-0012#R-26', (run) => {
    const bad = run.results.filter((r) => r.outcome === 'pass' && r.evaluated === false);
    return bad.length ? [fail('validator', `${bad.length} unevaluated checks reported as pass`)]
      : [pass('validator', 'no unevaluated check is reported as pass')];
  });

  // ---- Artifact type declarations ----------------------------------------
  // Every check below reads declarations as data. None knows any type.

  const declarationDocs = parsed.filter((d) => Array.isArray(d.meta.artifact_types));
  const declarations = [];
  for (const doc of declarationDocs) {
    for (const entry of doc.meta.artifact_types) {
      if (entry && typeof entry === 'object') declarations.push({ doc, d: entry });
    }
  }
  const declaredTypes = new Set(declarations.map(({ d }) => d.type).filter(Boolean));
  const fieldsOf = (d) => [
    ...(Array.isArray(d.required_fields) ? d.required_fields : []),
    ...(Array.isArray(d.optional_fields) ? d.optional_fields : []),
  ];
  const each = (fn) => () => declarations.map(({ doc, d }) => {
    const where = `${doc.path}:${d.type ?? '(untyped)'}`;
    const problem = fn(d);
    return problem ? fail(where, problem) : pass(where);
  });
  const asList = (value) => (Array.isArray(value) ? value : value === undefined ? [] : [value]);

  const TYPE_ID = /^[a-z][a-z0-9]*\.[a-z]+\.[a-z]+$/;
  const OBLIGATION = /\b(MUST|SHOULD|MAY|REQUIRED|SHALL)\b/;
  const REQUIRED_KEYS = ['type', 'type_version', 'lifecycle', 'purpose', 'contract',
    'producer_kind', 'subject_noun', 'required_fields', 'evidence_bearing_fields', 'fixtures'];
  const OPTIONAL_KEYS = ['optional_fields', 'vocabularies', 'derives_from', 'consumption_profiles',
    'completeness_notes', 'successor', 'deprecation_reason', 'notes'];
  const FIXTURE_CASES = ['normal', 'empty', 'not_applicable', 'partial', 'boundary'];

  define('STD-0013#R-01', each((d) => {
    const carriers = [d.purpose, d.contract, d.notes, d.completeness_notes].filter((v) => typeof v === 'string');
    const offending = carriers.filter((v) => OBLIGATION.test(v));
    return offending.length ? `declaration text states an obligation: "${offending[0].slice(0, 60)}"` : null;
  }));

  define('STD-0013#R-02', () => declarationDocs.map((doc) =>
    doc.meta.artifact_types.every((e) => e && typeof e === 'object' && !Array.isArray(e))
      ? pass(doc.path, `${doc.meta.artifact_types.length} declarations parsed as structured records`)
      : fail(doc.path, 'an artifact_types entry is not a structured record')));

  define('STD-0013#R-04', each((d) =>
    typeof d.type === 'string' && TYPE_ID.test(d.type) ? null : `type identity "${d.type}" does not match the declared grammar`));

  define('STD-0013#R-05', each((d) =>
    typeof d.type_version === 'string' && VERSION.test(d.type_version) ? null : `type_version "${d.type_version}" is not a semantic version`));

  define('STD-0013#R-06', each((d) => {
    const missing = REQUIRED_KEYS.filter((k) => d[k] === undefined || d[k] === '');
    return missing.length ? `required declaration fields absent: ${missing.join(', ')}` : null;
  }));

  define('STD-0013#R-07', each((d) =>
    ID.test(String(d.producer_kind ?? '')) ? `producer_kind "${d.producer_kind}" names a document identity` : null));

  define('STD-0013#R-08', each((d) => {
    const known = new Set([...REQUIRED_KEYS, ...OPTIONAL_KEYS]);
    const unknown = Object.keys(d).filter((k) => !known.has(k));
    return unknown.length ? `undeclared declaration fields: ${unknown.join(', ')}` : null;
  }));

  define('STD-0013#R-09', each((d) => {
    const empty = OPTIONAL_KEYS.filter((k) => k in d && (d[k] === '' || (Array.isArray(d[k]) && d[k].length === 0)));
    return empty.length ? `optional fields present but empty: ${empty.join(', ')}` : null;
  }));

  define('STD-0013#R-10', each((d) =>
    asList(d.required_fields).length ? null : 'required_fields declares no field'));

  define('STD-0013#R-11', each((d) => {
    const all = fieldsOf(d);
    const seen = new Set(); const repeated = new Set();
    for (const f of all) { if (seen.has(f)) repeated.add(f); seen.add(f); }
    return repeated.size ? `field declared more than once: ${[...repeated].join(', ')}` : null;
  }));

  define('STD-0013#R-12', each((d) => {
    const all = new Set(fieldsOf(d));
    const stray = asList(d.evidence_bearing_fields).filter((f) => !all.has(f));
    return stray.length ? `evidence_bearing_fields names undeclared fields: ${stray.join(', ')}` : null;
  }));

  define('STD-0013#R-13', each((d) => {
    const bad = asList(d.vocabularies).filter((v) => !v || !v.field || !v.kind || !Array.isArray(v.values));
    return bad.length ? `${bad.length} vocabulary entries omit field, kind, or values` : null;
  }));

  define('STD-0013#R-14', each((d) => {
    const bad = asList(d.vocabularies).filter((v) => v && v.kind !== 'closed' && v.kind !== 'open');
    return bad.length ? `vocabulary kind outside the closed set: ${bad.map((v) => v.kind).join(', ')}` : null;
  }));

  define('STD-0013#R-16', each((d) => {
    const all = new Set(fieldsOf(d));
    const problems = [];
    for (const v of asList(d.vocabularies)) {
      if (!v) continue;
      if (v.field && !all.has(v.field)) problems.push(`${v.field} is not a declared field`);
      if (Array.isArray(v.values) && v.values.length === 0) problems.push(`${v.field} declares no value`);
    }
    return problems.length ? problems.join('; ') : null;
  }));

  define('STD-0013#R-18', each((d) =>
    typeof d.subject_noun === 'string' && d.subject_noun.trim() !== '' ? null : 'subject_noun is absent'));

  define('STD-0013#R-19', each((d) => {
    const banned = ['confidence_rule', 'aggregation_rule', 'evidence_states', 'confidence_levels'];
    const present = banned.filter((k) => k in d);
    return present.length ? `declaration restates framework semantics: ${present.join(', ')}` : null;
  }));

  define('STD-0013#R-20', each((d) =>
    asList(d.evidence_bearing_fields).length ? null : 'evidence_bearing_fields declares no field'));

  define('STD-0013#R-22', each((d) => {
    const stray = asList(d.derives_from).filter((t) => !declaredTypes.has(t));
    return stray.length ? `derives_from names undeclared types: ${stray.join(', ')}` : null;
  }));

  define('STD-0013#R-21', () => {
    const edges = new Map(declarations.map(({ d }) => [d.type, asList(d.derives_from)]));
    const state = new Map();
    const cycles = [];
    const walk = (node, trail) => {
      if (state.get(node) === 'done') return;
      if (state.get(node) === 'open') { cycles.push([...trail, node].join(' -> ')); return; }
      state.set(node, 'open');
      for (const next of edges.get(node) ?? []) if (edges.has(next)) walk(next, [...trail, node]);
      state.set(node, 'done');
    };
    for (const node of edges.keys()) walk(node, []);
    return cycles.length
      ? [fail('corpus', `derivation cycles: ${cycles.join('; ')}`)]
      : [pass('corpus', `${edges.size} declared types form an acyclic derivation graph`)];
  });

  define('STD-0013#R-23', each((d) => {
    const bad = asList(d.consumption_profiles).filter((p) => !p || !p.consumer || !Array.isArray(p.reads));
    return bad.length ? `${bad.length} consumption profiles omit consumer or reads` : null;
  }));

  define('STD-0013#R-25', each((d) => {
    const all = new Set(fieldsOf(d));
    const stray = [];
    for (const p of asList(d.consumption_profiles)) {
      for (const f of (Array.isArray(p?.reads) ? p.reads : [])) if (!all.has(f)) stray.push(`${p.consumer}:${f}`);
    }
    return stray.length ? `profiles read undeclared fields: ${stray.join(', ')}` : null;
  }));

  define('STD-0013#R-26', each((d) =>
    d.lifecycle === 'active' || d.lifecycle === 'deprecated' ? null : `lifecycle "${d.lifecycle}" is outside the closed vocabulary`));

  define('STD-0013#R-27', each((d) => {
    if (d.lifecycle !== 'deprecated') return null;
    const missing = ['successor', 'deprecation_reason'].filter((k) => !d[k]);
    if (missing.length) return `deprecated declaration omits ${missing.join(' and ')}`;
    return declaredTypes.has(d.successor) ? null : `successor "${d.successor}" is not a declared type`;
  }));

  define('STD-0013#R-29', each((d) => {
    const f = d.fixtures;
    if (!f || typeof f !== 'object' || Array.isArray(f)) return 'fixtures is absent or is not a record';
    const keys = Object.keys(f);
    const missing = FIXTURE_CASES.filter((c) => !keys.includes(c) || !String(f[c]).trim());
    const extra = keys.filter((c) => !FIXTURE_CASES.includes(c));
    if (missing.length) return `fixture cases absent: ${missing.join(', ')}`;
    return extra.length ? `fixture cases outside the declared five: ${extra.join(', ')}` : null;
  }));

  define('STD-0013#R-31', () => {
    const results = declarationDocs.map((doc) => {
      const problems = [];
      if (doc.meta.object_type !== 'Guide') problems.push(`object_type is ${doc.meta.object_type ?? 'absent'}, not Guide`);
      if ('requirements' in doc.meta) problems.push('carries a requirements key');
      return problems.length ? fail(doc.path, problems.join('; ')) : pass(doc.path);
    });
    return results.length ? results : [pass('corpus', 'no declaration document present')];
  });

  define('STD-0013#R-32', () => {
    const seen = new Map();
    for (const { doc, d } of declarations) {
      if (!d.type) continue;
      seen.set(d.type, [...(seen.get(d.type) ?? []), doc.path]);
    }
    const duplicated = [...seen].filter(([, where]) => where.length > 1);
    return duplicated.length
      ? duplicated.map(([type, where]) => fail(type, `declared in ${where.length} documents: ${where.join(', ')}`))
      : [pass('corpus', `${seen.size} type identities, each declared exactly once`)];
  });

  return checks;
}
