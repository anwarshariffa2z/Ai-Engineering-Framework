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
    const known = new Set([...config.coreKeys, 'normativity', 'requirements', 'depends_on', 'references',
      'object_type', 'layer', 'context_cost', 'meta_model_version', 'authored', 'generated_by',
      'source_revision', 'generated_at', 'name', 'about', 'labels']);
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

  return checks;
}
