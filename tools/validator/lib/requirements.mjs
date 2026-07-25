// Requirement catalogue. The enforceable surface of the framework is read from
// the standards themselves: a document that declares requirements is a standard,
// and each declaration carries the level, checkability, severity, and scope that
// govern how a validator treats it. Nothing here is hard-coded.

const STATED = /\*\*(R-\d+)\.\*\*/g;
const SECTION = /^## (\d+)\./;

export function buildCatalogue(documents) {
  const requirements = [];
  const standards = [];

  for (const doc of documents) {
    if (!doc.isStandard) continue;
    const declarations = Array.isArray(doc.meta.requirements) ? doc.meta.requirements : [];
    const normativity = typeof doc.meta.normativity === 'object' && doc.meta.normativity !== null
      ? doc.meta.normativity
      : {};

    const stated = statedRequirements(doc.body);
    standards.push({
      id: doc.id,
      title: doc.meta.title,
      version: doc.meta.version,
      path: doc.path,
      declaredCount: declarations.length,
      statedCount: stated.size,
      normativity,
    });

    for (const declaration of declarations) {
      requirements.push({
        address: `${doc.id}#${declaration.id}`,
        standard: doc.id,
        standardPath: doc.path,
        id: declaration.id,
        level: declaration.level,
        check: declaration.check,
        severity: declaration.severity,
        scope: declaration.scope,
        statedInSection: stated.get(declaration.id) ?? null,
        stated: stated.has(declaration.id),
      });
    }
  }

  requirements.sort((a, b) => a.address.localeCompare(b.address));
  return { requirements, standards };
}

export function statedRequirements(body) {
  const found = new Map();
  let section = null;
  for (const line of body.split('\n')) {
    const sectionMatch = SECTION.exec(line);
    if (sectionMatch) section = sectionMatch[1];
    STATED.lastIndex = 0;
    let match;
    while ((match = STATED.exec(line)) !== null) {
      if (!found.has(match[1])) found.set(match[1], section);
    }
  }
  return found;
}

// Obligations expressed in a normative section without a requirement identifier
// cannot be bound to a check. A validator must not evaluate a condition no
// requirement states, so these are reported rather than enforced.
export function unboundObligations(documents) {
  const unbound = [];
  const keyword = /(?<![A-Za-z])MUST(?![A-Za-z])/;

  for (const doc of documents) {
    if (!doc.parsed) continue;
    const normativity = typeof doc.meta.normativity === 'object' && doc.meta.normativity !== null
      ? doc.meta.normativity
      : null;
    let section = null;
    let lineNumber = 0;

    for (const line of doc.body.split('\n')) {
      lineNumber += 1;
      const sectionMatch = SECTION.exec(line);
      if (sectionMatch) section = sectionMatch[1];
      if (!keyword.test(line)) continue;
      if (/^\*\*R-\d+\.\*\*/.test(line.trim())) continue;
      if (/^\|/.test(line.trim())) continue;
      if (/`MUST`/.test(line)) continue;

      const isNormative = normativity ? normativity[section] === 'normative' : null;
      if (normativity && !isNormative) continue;

      unbound.push({
        document: doc.id ?? doc.path,
        path: doc.path,
        section,
        line: lineNumber,
        declaresRequirements: doc.isStandard,
        excerpt: line.trim().slice(0, 140),
      });
    }
  }
  return unbound;
}
