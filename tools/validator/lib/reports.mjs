// Report generation. The validation artifact holds the structured result; the
// report views render it. Every view carries generator provenance, per STD-0010
// R-31 and R-32, and asserts conformance only for what was evaluated, per
// STD-0012 R-34.

const GENERATOR = 'framework-reference-validator';
const GENERATOR_VERSION = '1.0.0';

function header(title, run) {
  return [
    `# ${title}`,
    '',
    '```',
    `generated_by     : ${GENERATOR} ${GENERATOR_VERSION}`,
    `source_revision  : ${run.revision}`,
    `generated_at     : ${run.generatedAt}`,
    `authored         : false`,
    '```',
    '',
  ].join('\n');
}

export function validationArtifact(run) {
  return {
    envelope: {
      identity: { run_id: run.runId, artifact_type: 'framework.validation.result' },
      type: { type_version: '1.0.0' },
      subject: { subject_ref: run.subject, subject_revision: run.revision },
      scope: {
        declared_scope: 'every Markdown document in the corpus, against every declared requirement',
        exclusions: run.config.exclude,
      },
      completeness: {
        state: run.coverage.notEvaluated > 0 ? 'Partial' : 'Complete',
        reason: run.coverage.notEvaluated > 0
          ? `${run.coverage.notEvaluated} requirements were not evaluated; see the coverage statement`
          : null,
      },
      provenance: {
        producer_id: GENERATOR,
        producer_version: GENERATOR_VERSION,
        executor_class: 'tool',
        generated_at: run.generatedAt,
        authorization: 'read-only repository access',
        redaction_state: 'none',
        environment: 'local repository working tree',
      },
      lineage: { derives_from: [] },
      assessment: { evidence_state: 'Observed', confidence: 'High' },
    },
    records: run.results.map((result) => ({
      check_id: result.checkId,
      requirement: result.requirement,
      standard: result.standard,
      class: result.class,
      severity: result.severity,
      outcome: result.outcome,
      subject: result.subject,
      detail: result.detail ?? null,
      evidence_state: 'Observed',
      confidence: 'High',
    })),
  };
}

export function validationReport(run) {
  const lines = [header('Validation Report', run)];
  lines.push('## Outcome', '');
  lines.push(`Subject outcome: **${run.outcome}**`, '');
  lines.push('| Outcome | Checks |', '| --- | --- |');
  for (const [key, value] of Object.entries(run.tally)) lines.push(`| \`${key}\` | ${value} |`);
  lines.push('');

  lines.push('## Coverage', '');
  lines.push(`Requirements declared: ${run.coverage.total}`);
  lines.push(`Evaluated mechanically: ${run.coverage.evaluated}`);
  lines.push(`Routed to human review: ${run.coverage.judgment}`);
  lines.push(`Not evaluated: ${run.coverage.notEvaluated}`);
  lines.push('');
  lines.push('This report asserts conformance only to the requirements it evaluated.', '');

  const failures = run.results.filter((r) => r.outcome === 'fail');
  lines.push('## Failures', '');
  if (failures.length === 0) lines.push('None.', '');
  else {
    lines.push('| Requirement | Subject | Detail |', '| --- | --- | --- |');
    for (const f of failures) lines.push(`| ${f.requirement} | ${f.subject} | ${f.detail ?? ''} |`);
    lines.push('');
  }

  const warnings = run.results.filter((r) => r.outcome === 'warn');
  lines.push('## Warnings', '');
  if (warnings.length === 0) lines.push('None.', '');
  else {
    lines.push('| Requirement | Subject | Detail |', '| --- | --- | --- |');
    for (const w of warnings.slice(0, 40)) lines.push(`| ${w.requirement} | ${w.subject} | ${w.detail ?? ''} |`);
    if (warnings.length > 40) lines.push(`| … | … | ${warnings.length - 40} further warnings omitted |`);
    lines.push('');
  }

  lines.push('## Unenforceable Obligations', '');
  lines.push('Obligations stated in a normative section without a requirement identifier cannot be bound to a check. A validator must not evaluate a condition no requirement states, so these are reported rather than enforced.', '');
  if (run.unbound.length === 0) lines.push('None.', '');
  else {
    lines.push('| Document | Section | Excerpt |', '| --- | --- | --- |');
    for (const u of run.unbound) lines.push(`| ${u.document} | ${u.section ?? '—'} | ${u.excerpt.replace(/\|/g, '\\|')} |`);
    lines.push('');
  }
  return lines.join('\n');
}

export function registryReport(run) {
  const lines = [header('Registry Report', run)];
  lines.push(`Registry document: ${run.registry.document ? run.registry.document.path : 'not located'}`);
  lines.push(`Rows: ${run.registry.rows.length}`);
  lines.push(`Documents in corpus: ${run.documents.length}`, '');

  const ids = new Set(run.documents.map((d) => d.id).filter(Boolean));
  const rowIds = new Set(run.registry.rows.map((r) => r.id));
  const unregistered = [...ids].filter((id) => !rowIds.has(id));
  const orphaned = [...rowIds].filter((id) => !ids.has(id));

  lines.push('## Agreement', '');
  lines.push('| Condition | Count |', '| --- | --- |');
  lines.push(`| Documents absent from the registry | ${unregistered.length} |`);
  lines.push(`| Registry rows without a document | ${orphaned.length} |`);
  const mismatches = [];
  for (const row of run.registry.rows) {
    const doc = run.documents.find((d) => d.id === row.id);
    if (!doc) continue;
    if (doc.meta.version !== row.version) mismatches.push(`${row.id}: version ${doc.meta.version} against ${row.version}`);
    if (doc.meta.status !== row.status) mismatches.push(`${row.id}: status ${doc.meta.status} against ${row.status}`);
  }
  lines.push(`| Version or status disagreements | ${mismatches.length} |`, '');

  if (unregistered.length) lines.push('### Absent from the registry', '', ...unregistered.map((i) => `- ${i}`), '');
  if (orphaned.length) lines.push('### Rows without a document', '', ...orphaned.map((i) => `- ${i}`), '');
  if (mismatches.length) lines.push('### Disagreements', '', ...mismatches.map((m) => `- ${m}`), '');

  lines.push('> Version and status agreement is stated by STD-0001 without a requirement identifier, so it is reported here but is not a bound check. See the unenforceable obligations in the validation report.', '');
  return lines.join('\n');
}

export function traceabilityReport(run) {
  const lines = [header('Traceability Report', run)];
  lines.push('| Standard | Version | Requirements | Mechanical | Judgment | Bound to a check |', '| --- | --- | --- | --- | --- | --- |');
  for (const standard of run.catalogue.standards) {
    const own = run.catalogue.requirements.filter((r) => r.standard === standard.id);
    const mechanical = own.filter((r) => r.check === 'mechanical').length;
    const judgment = own.filter((r) => r.check === 'judgment').length;
    const bound = own.filter((r) => run.boundAddresses.has(r.address)).length;
    lines.push(`| ${standard.id} | ${standard.version} | ${own.length} | ${mechanical} | ${judgment} | ${bound} |`);
  }
  const all = run.catalogue.requirements;
  lines.push(`| **Total** | | **${all.length}** | **${all.filter((r) => r.check === 'mechanical').length}** | **${all.filter((r) => r.check === 'judgment').length}** | **${run.boundAddresses.size}** |`, '');

  lines.push('## Mechanical requirements without a check', '');
  const unboundMechanical = all.filter((r) => r.check === 'mechanical' && !run.boundAddresses.has(r.address));
  if (unboundMechanical.length === 0) lines.push('None.', '');
  else {
    lines.push('| Requirement | Scope | Reason not evaluated |', '| --- | --- | --- |');
    for (const r of unboundMechanical) lines.push(`| ${r.address} | ${r.scope} | ${run.notEvaluatedReason(r)} |`);
    lines.push('');
  }
  return lines.join('\n');
}

export function requirementReport(run) {
  const lines = [header('Requirement Report', run)];
  lines.push('| Requirement | Level | Class | Severity | Scope | Outcome |', '| --- | --- | --- | --- | --- | --- |');
  for (const requirement of run.catalogue.requirements) {
    const results = run.results.filter((r) => r.requirement === requirement.address);
    let outcome = 'not-evaluated';
    if (results.some((r) => r.outcome === 'fail')) outcome = 'fail';
    else if (results.some((r) => r.outcome === 'warn')) outcome = 'warn';
    else if (results.some((r) => r.outcome === 'pass')) outcome = 'pass';
    lines.push(`| ${requirement.address} | ${requirement.level} | ${requirement.check} | ${requirement.severity} | ${requirement.scope} | \`${outcome}\` |`);
  }
  lines.push('');
  return lines.join('\n');
}

export const generator = { name: GENERATOR, version: GENERATOR_VERSION };
