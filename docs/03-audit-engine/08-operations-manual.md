---
id: AUD-0009
title: Operations Discovery Methodology
version: 1.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-30
review_cycle: Annual
category: Audit Engine
tags: [audit-engine, operations, observability, discovery, methodology]
related: [01-architecture-discovery.md, 04-backend-discovery.md, 07-feature-inventory.md, 09-gap-analysis.md, ../02-methodology/glossary.md, ../09-capabilities/CAP-0001-repository-audit.md]
object_type: Methodology
layer: 1
depends_on: [../02-methodology/evidence-and-confidence.md, ../02-methodology/artifact-specification.md, ../02-methodology/metadata-specification.md, ../02-methodology/contract-specification.md, ../02-methodology/validation-specification.md, ../04-development/reliability-standard.md]
references: [01-architecture-discovery.md, 04-backend-discovery.md, 07-feature-inventory.md, 09-gap-analysis.md, ../09-capabilities/CAP-0001-repository-audit.md, ../02-methodology/glossary.md]
meta_model_version: 1.0.0
producer_kinds: [operations-discovery]
normativity:
  "1": informative
  "2": normative
  "3": normative
  "4": normative
  "5": normative
  "6": normative
  "7": normative
  "8": normative
  "9": normative
  "10": normative
  "11": informative
  "12": informative
  "13": informative
---

# Operations Discovery Methodology

## 1. Purpose and Scope

*This section is informative.*

Operations Discovery is an evidence-led examination of how a system is run: which environments exist, how a change reaches them, what is observed while it runs, what happens when it fails, and what a responder has to work with at three in the morning.

The methodology examines the repository's operational surface. It records what the repository declares about operations and marks clearly where that declaration ends. A repository can show a deployment pipeline, an alert definition, and a runbook; it cannot show whether the alert fires, whether the runbook is current, or whether anyone is on call. Those are unknowns, and recording them as unknowns rather than omitting them is the point.

Its most consequential output is **recoverability**: whether a backup mechanism exists is a weak claim, and whether a restore has been demonstrated is a strong one. Most repositories evidence the first and not the second, and the two are recorded separately so that the difference is visible.

**This methodology consumes the framework standards and does not restate them.** Evidence states, confidence levels, scoring principles, completeness semantics, artifact structure, participant obligations, and validation behaviour are defined by the standards listed in section 3. Only operations-specific process is defined here.

## 2. Capability Declaration

*This section is normative.*

This methodology is a constituent of [CAP-0001 Repository Audit](../09-capabilities/CAP-0001-repository-audit.md), where it consumes architecture, backend, and feature artifacts and supplies environment, release, observability, and recovery evidence to gap analysis and runtime verification.

**Executor type.** Human, agent, or either.

**Safety boundaries.** The executor MUST NOT modify the subject, execute destructive commands, trigger a deployment, silence or acknowledge an alert, initiate a restore, access a production console, or reproduce secret values, credentials, endpoints, or record content. Where the audit is authorized to inspect a pipeline definition or read a dashboard configuration, it records the source, access date, and environment; a configuration read is evidence about the configuration, not about the running system.

## 3. Standards Consumed

*This section is normative.*

| Standard | What this methodology takes from it |
| --- | --- |
| [STD-0007](../02-methodology/evidence-and-confidence.md) | Evidence states and their meanings; provenance and attributability; evidence quality and freshness; the confidence model; completeness semantics; promotion and degradation; uncertainty propagation; scoring principles and the 0-to-5 scale |
| [STD-0008](../02-methodology/artifact-specification.md) | Artifact structure, envelope, record and evidence attachment points, environment attribution, artifact type definition and versioning |
| [STD-0010](../02-methodology/metadata-specification.md) | Metadata representation for every declaration this methodology makes or its artifacts carry |
| [STD-0011](../02-methodology/contract-specification.md) | Producer obligations, preconditions, guaranteed outputs, failure conditions, and their mapping to completeness states |
| [STD-0012](../02-methodology/validation-specification.md) | How conformance is evaluated, reported, and enforced; validation classes and outcomes |
| [STD-0005](../04-development/reliability-standard.md) | Terminology for availability objectives, degradation, recovery, and incident response |

No definition here overrides a standard. Any apparent conflict is a defect in this document.

## 4. Inputs

*This section is normative.*

**Required.** Repository root; immutable revision identifier; audit request and declared scope; output location outside the subject; authorization boundary.

**Optional.** Pipeline definitions; environment configuration; infrastructure-as-code; container and orchestration manifests; monitoring and alerting configuration; dashboard definitions; log configuration; tracing setup; backup and retention configuration; restore records; runbooks; on-call and escalation documentation; incident records and postmortems; capacity and scaling configuration; availability objectives; change-management records.

Each input is logged with source, access date, environment, and trust level. Absence of an optional input lowers achievable confidence and does not lower a score, per [STD-0011](../02-methodology/contract-specification.md) R-22.

**Consumed artifact types.** `framework.architecture.deployment`, `framework.architecture.runtime`, `framework.architecture.configuration`, `framework.architecture.build`, `framework.backend.services`, `framework.backend.resilience`, `framework.database.lifecycle`, `framework.feature.register`. The dependency is on these types, never on the methodologies that produced them.

## 5. Preconditions

*This section is normative.*

Read access to the repository tree at a stable revision; a working location outside the subject; tools to enumerate files and search text; permission to inspect non-secret pipeline, infrastructure, and monitoring metadata; a declared authorization boundary; and a named recipient for escalations.

Where a precondition is unmet the methodology is not invoked and the affected artifact types are recorded unavailable, per [STD-0011](../02-methodology/contract-specification.md) R-16 and R-17.

Where operational configuration lives outside the audited repository and that repository is not in scope, the affected artifacts record completeness `Partial` with the out-of-scope location named. They do not record the absence of a mechanism.

## 6. Artifact Types Produced

*This section is normative.*

Eight artifact types. Their structure conforms to [STD-0008](../02-methodology/artifact-specification.md); each type definition declares the sixteen sections that standard requires.

| Type | Content |
| --- | --- |
| `framework.operations.environments` | Environments with purpose, provisioning mechanism, configuration source, promotion position, and parity findings between them |
| `framework.operations.release` | Release path with trigger, gates, approval points, rollout strategy, rollback mechanism, and the evidence that each has been exercised |
| `framework.operations.observability` | Metrics, logs, traces, and alerts with the component that emits or defines each, the condition alerted on, the destination, and unobserved-component findings |
| `framework.operations.recovery` | Backup mechanisms with scope, schedule, and destination class, recorded separately from restore evidence, with recovery objectives where declared |
| `framework.operations.runbooks` | Operational procedures with the scenario each addresses, its last-modified evidence, and the alerts or failures with no corresponding procedure |
| `framework.operations.capacity` | Scaling configuration, resource limits, quotas, and the load evidence supporting or absent from each |
| `framework.operations.risks` | Operations risk register with cause, impact, evidence, likelihood rationale, confidence, and follow-up |
| `framework.operations.health` | Health scores per dimension with evidence, confidence, and calculation |

Downstream methodologies depend on these **types**, never on this methodology, per [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md).

## 7. Guaranteed Outputs

*This section is normative.*

This methodology guarantees, for each declared type: that an artifact of that type is emitted; that it conforms to the type at the declared version; that its completeness state is declared; and that its provenance is recorded. It guarantees no finding and no property of the subject, per [STD-0011](../02-methodology/contract-specification.md) R-23 and R-24.

It does not guarantee that a declared mechanism operates. Every claim in this artifact set concerns what the repository declares, and each record states the environment it applies to.

Where a stage cannot be performed, its artifact carries the completeness state that [STD-0011](../02-methodology/contract-specification.md) section 10 maps to the failure, with the disclosure that section requires.

## 8. Discovery Principles

*This section is normative.*

These are operations-specific. General evidence discipline is STD-0007's and is not repeated.

1. **A definition is not an execution.** A pipeline, an alert, a backup schedule, and a runbook are declarations. Evidence that each ran is separate, and where it is absent the record says so.
2. **Backup and restore are two findings.** Backup existence is recorded independently of restore demonstration. A system with backups and no restore evidence has an unknown recovery posture, not a good one.
3. **Every operational record names an environment.** A mechanism configured for one environment is evidence about that environment only, per [STD-0008](../02-methodology/artifact-specification.md) R-42.
4. **Coverage of observation is enumerated against components.** An alerting configuration is assessed by comparing what it watches against the component inventory, not by counting alerts.
5. **A runbook is dated.** A procedure's usefulness depends on whether it matches the current system, so last-modified evidence is recorded with every procedure.

## 9. Discovery Workflow

*This section is normative.*

Nine stages. Each declares purpose, inputs, actions, required evidence, deliverables, failure conditions, and acceptance criteria. Every conclusion carries an evidence state and confidence per [STD-0007](../02-methodology/evidence-and-confidence.md).

### Stage 1 — Environment Discovery

**Purpose.** Establish which environments exist and how each is produced.

**Inputs.** `framework.architecture.deployment`, infrastructure-as-code, environment configuration, pipeline environment declarations.

**Actions.** Record each environment with its purpose, provisioning mechanism, configuration source, and position in the promotion path. Compare configuration across environments and record parity findings, particularly configuration keys present in one environment and absent in another. Record environments referenced by a pipeline but not defined in scope.

**Evidence Required.** Environment declaration location, provisioning mechanism reference, configuration source reference.

**Deliverables.** `framework.operations.environments`.

**Failure Conditions.** Environments enumerated from naming conventions in configuration keys; a referenced environment omitted because its definition is out of scope; parity assumed from a shared template.

**Acceptance Criteria.** Each environment names a declaration location and a configuration source, and referenced-but-undefined environments are listed.

### Stage 2 — Release Path Discovery

**Purpose.** Establish how a change reaches an environment and how it is withdrawn.

**Inputs.** `framework.architecture.build`, pipeline definitions, approval configuration, deployment manifests, rollout strategy declarations, release history where available.

**Actions.** Record the release path with trigger, gates, approvals, rollout strategy, and rollback mechanism. Record whether each gate is enforced by the pipeline or by convention. Record evidence that a rollback has been exercised separately from evidence that a rollback mechanism is defined. Identify manual deployment steps and the point at which automation ends.

**Evidence Required.** Pipeline definition location, gate declaration, rollback mechanism declaration, exercise evidence where present.

**Deliverables.** `framework.operations.release`.

**Failure Conditions.** A documented process reported as the pipeline's behaviour; a rollback mechanism reported as proven; a manual step omitted because it is undocumented; approval enforcement assumed from a configuration key.

**Acceptance Criteria.** The release path names every gate with its enforcement mechanism, and rollback records definition and exercise evidence separately.

### Stage 3 — Observability Discovery

**Purpose.** Establish what is watched and what is not.

**Inputs.** Monitoring configuration, metric emission sites, log configuration, tracing setup, alert definitions, dashboard definitions, `framework.backend.services`, `framework.architecture.runtime`.

**Actions.** Record metrics, logs, traces, and alerts with the component that emits or defines each, the condition alerted on, and the destination. Enumerate the component inventory and record components with no metric, no log destination, and no alert. Record alerts with no defined recipient. Record log configuration that captures record content or credentials as a finding.

**Evidence Required.** Emission or definition location, alert condition, destination configuration, the unobserved-component list.

**Deliverables.** `framework.operations.observability`.

**Failure Conditions.** Coverage asserted from the presence of a monitoring library; an alert counted without a condition; a dashboard treated as an alert; log content reproduced.

**Acceptance Criteria.** Each alert names its condition and destination, and unobserved components are enumerated against the component inventory.

### Stage 4 — Recovery Discovery

**Purpose.** Establish what could be restored and what evidence supports that claim.

**Inputs.** `framework.database.lifecycle`, backup configuration, snapshot schedules, retention policy, restore records, recovery objective declarations, disaster-recovery documentation.

**Actions.** Record backup mechanisms with scope, schedule, destination class, and retention. **Record restore evidence separately**, including any documented restore exercise with its date and outcome. Record declared recovery point and recovery time objectives, and record whether any evidence supports them. Identify stores and stateful components with no backup mechanism in scope.

**Evidence Required.** Backup configuration location, schedule declaration, restore record with date where present, objective declaration where present.

**Deliverables.** `framework.operations.recovery`.

**Failure Conditions.** A backup schedule reported as a recovery capability; a managed-service default assumed without evidence; a declared objective reported as met; restore evidence merged into the backup record.

**Acceptance Criteria.** Every backup record carries a separate restore-evidence field, populated or explicitly empty, and every recovery objective records whether evidence supports it.

### Stage 5 — Runbook Discovery

**Purpose.** Establish what a responder has to work with.

**Inputs.** Runbooks, operational documentation, incident records, postmortems, on-call documentation, alert definitions.

**Actions.** Record each procedure with the scenario it addresses, its location, and its last-modified evidence. Compare procedures against the alert inventory and the failure conditions recorded by upstream artifacts, listing alerts and known failure modes with no corresponding procedure. Record procedures referencing components, commands, or environments that no longer appear in the repository as stale.

**Evidence Required.** Procedure location, scenario reference, last-modified evidence, the uncovered-scenario list.

**Deliverables.** `framework.operations.runbooks`.

**Failure Conditions.** Documentation counted without checking that it addresses an operational scenario; a stale procedure counted as coverage; on-call arrangements asserted from a document listing names.

**Acceptance Criteria.** Each procedure names its scenario and its last-modified evidence, and uncovered alerts are enumerated.

### Stage 6 — Capacity and Scaling Discovery

**Purpose.** Establish what bounds the system's resource use and what evidence supports those bounds.

**Inputs.** Resource limit declarations, autoscaling configuration, quota and rate-limit settings, connection pool sizing, `framework.backend.resilience`, load test results where supplied.

**Actions.** Record resource limits, scaling rules, and quotas with their declaration sites. Record whether any load evidence supports a chosen value. Identify components with no declared limit. Identify scaling rules whose trigger metric is not among the metrics recorded by the observability artifact, because such a rule cannot fire.

**Evidence Required.** Limit or rule declaration location, trigger metric reference, load evidence where present.

**Deliverables.** `framework.operations.capacity`.

**Failure Conditions.** A platform default reported as a configured limit; a scaling rule reported as effective without confirming its trigger metric exists; capacity headroom asserted without load evidence.

**Acceptance Criteria.** Each limit or rule names a declaration site, and each scaling rule records whether its trigger metric is emitted.

### Stage 7 — Operations Risks

**Purpose.** Convert supported observations into prioritized operational risks without confusing risk with defect proof.

**Inputs.** All previous stage deliverables, risk tier, incident records, stated constraints.

**Actions.** Identify risks involving unobserved components, alerts without recipients, backups without restore evidence, recovery objectives without supporting evidence, manual release steps, unexercised rollback mechanisms, stale or missing runbooks, environment parity gaps, and scaling rules that cannot fire. State cause, impact, affected evidence, likelihood rationale, confidence, and suggested next verification.

**Evidence Required.** At least one observation supporting the risk and the reasoning from observation to risk.

**Deliverables.** `framework.operations.risks`.

**Failure Conditions.** Risk claims using generic best practices without repository evidence; severity presented as certainty; an availability judgment issued from configuration alone.

**Acceptance Criteria.** A reviewer can challenge or validate each risk from cited evidence and understands why it matters.

### Stage 8 — Evidence Consolidation

**Purpose.** Normalize and quality-check evidence so conclusions remain auditable after the session ends.

**Inputs.** Observations, paths, revision data, configuration references, incident records.

**Actions.** Record every evidence item with the attributes [STD-0008](../02-methodology/artifact-specification.md) R-15 requires and the provenance [STD-0007](../02-methodology/evidence-and-confidence.md) section 5 requires. Attribute the environment per record, per [STD-0008](../02-methodology/artifact-specification.md) R-42, because operational evidence is environment-specific by nature. Record lineage per record where a conclusion derives from an upstream artifact.

**Evidence Required.** Complete evidence attachment for every record, per STD-0008 R-14, with per-record environment attribution.

**Deliverables.** Evidence records within every produced artifact.

**Failure Conditions.** Conclusions citing no evidence; environment attribution recorded only in the envelope; log or record content retained; blanket lineage where derivation is partial.

**Acceptance Criteria.** Each conclusion has evidence, each evidence item has provenance, and every record names the environment it applies to.

### Stage 9 — Final Verification

**Purpose.** Confirm the output is internally consistent, complete for scope, and safe to consume.

**Inputs.** All artifacts, scoring worksheets, unresolved-question list.

**Actions.** Confirm every stage produced an artifact or an explicit completeness state with a reason. Confirm every backup record carries a restore-evidence field, every alert names a condition and destination, and every unobserved-component list was enumerated rather than summarized. Confirm scores show their calculation. Verify no secrets or log content remain.

**Evidence Required.** Completed verification, artifact versions, escalation record.

**Deliverables.** `framework.operations.health`, completed and consistent artifact set.

**Failure Conditions.** Unresolved contradictions, broken evidence links, restore evidence merged with backup records, or sensitive-data exposure.

**Acceptance Criteria.** The artifact set is traceable, internally coherent, complete for declared scope, and explicit that its claims concern declared rather than demonstrated behaviour.

How this output is validated is defined by [STD-0012](../02-methodology/validation-specification.md); this methodology does not define validator behaviour.

## 10. Health Dimensions

*This section is normative.*

The scale, its meanings, the averaging guard, the escalation guard, and the partial-coverage rule are defined by [STD-0007](../02-methodology/evidence-and-confidence.md) section 13. This methodology declares only its dimensions.

Eight dimensions: environment clarity; environment parity; release automation; rollback readiness; observability coverage; recovery evidence; operational documentation currency; capacity control.

The lowest two levels of the scale for the purposes of the escalation guard are `0` and `1`.

## 11. Operations Smells

*This section is informative.*

Treat a smell as a prompt for investigation, not proof of failure. Common smells include a backup schedule with no restore record; an alert whose destination is a channel nobody names; a rollback documented and never exercised; a production environment provisioned by a process no repository describes; configuration keys present in staging and absent in production; a runbook referencing a service that was renamed; an autoscaling rule keyed to a metric no component emits; a pipeline whose final step is a manual instruction in a comment; recovery objectives stated in a document and contradicted by the backup schedule; and log configuration that captures request bodies.

## 12. Examples and Common Mistakes

*This section is informative.*

A backup schedule, a retention setting, a documented restore exercise with a date and outcome, and a recovery objective the exercise met together support an observed recovery capability. The same schedule with no restore record supports only the claim that backups are configured, and the recovery posture is unknown. Reporting the second as the first is the single most common and most expensive error in this domain.

Common mistakes are counting alerts instead of enumerating unobserved components; treating a monitoring library dependency as observability; reporting a managed-service default as a configured backup; presenting a documented release process as the pipeline's behaviour; omitting manual steps; counting stale runbooks as coverage; asserting capacity headroom without load evidence; and recording environment-specific findings without naming the environment.

Do not trigger a deployment. Do not silence or acknowledge an alert. Do not initiate a restore. Do not access a production console. Do not modify the subject.

## 13. Related Documents

*This section is informative.*

- [Architecture Discovery](01-architecture-discovery.md)
- [Backend Discovery](04-backend-discovery.md)
- [Feature Inventory](07-feature-inventory.md)
- [Gap Analysis](09-gap-analysis.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [Evidence and Confidence Standard](../02-methodology/evidence-and-confidence.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Metadata Specification Standard](../02-methodology/metadata-specification.md)
- [Contract Specification Standard](../02-methodology/contract-specification.md)
- [Validation Specification Standard](../02-methodology/validation-specification.md)
- [Reliability Standard](../04-development/reliability-standard.md)
- [Framework Glossary](../02-methodology/glossary.md)
