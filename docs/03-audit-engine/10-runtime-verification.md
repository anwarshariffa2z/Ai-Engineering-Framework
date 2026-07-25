---
id: AUD-0011
title: Runtime Verification Methodology
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-26
review_cycle: Annual
category: Audit Engine
tags: [audit-engine, runtime, verification, methodology]
related: [07-feature-inventory.md, 08-operations-manual.md, 09-gap-analysis.md, ../02-methodology/glossary.md, ../09-capabilities/CAP-0001-repository-audit.md]
object_type: Methodology
layer: 1
depends_on: [../02-methodology/evidence-and-confidence.md, ../02-methodology/artifact-specification.md, ../02-methodology/metadata-specification.md, ../02-methodology/contract-specification.md, ../02-methodology/validation-specification.md, ../04-development/security-standard.md]
references: [07-feature-inventory.md, 08-operations-manual.md, 09-gap-analysis.md, ../09-capabilities/CAP-0001-repository-audit.md, ../02-methodology/glossary.md]
meta_model_version: 1.0.0
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

# Runtime Verification Methodology

## 1. Purpose and Scope

*This section is informative.*

Runtime Verification observes an executing system and records what it demonstrates. It is the only methodology in the audit engine that may promote a conclusion from `Observed` to `Verified`, and that privilege is the reason it exists.

Every other methodology reads declarations. A repository states what a system is built to do; only a running instance shows what it does. The gap between the two is where most expensive surprises live: the endpoint that returns a different shape than its schema, the feature flag that is on in production and off everywhere else, the backup that has never completed, the service that no longer starts.

The privilege is tightly bounded. A promotion applies to one conclusion, in one environment, at one time, under one set of conditions, and it decays. A verification performed against staging says nothing about production. A verification performed six months ago says less than it did. This methodology records the environment, the time, and the conditions with every promotion, because a promotion without them is not stronger evidence, only an older claim with a better label.

**This methodology consumes the framework standards and does not restate them.** Evidence states, confidence levels, scoring principles, completeness semantics, artifact structure, participant obligations, and validation behaviour are defined by the standards listed in section 3. Only verification-specific process is defined here.

## 2. Capability Declaration

*This section is normative.*

This methodology is a constituent of [CAP-0001 Repository Audit](../09-capabilities/CAP-0001-repository-audit.md), where it is **optional**. It is skipped when no runtime evidence is authorized, and its absence caps achievable run confidence rather than failing the run, per that document's section 9.

It consumes the artifacts of every preceding methodology and supplies promotions, divergences, and verification limits to gap analysis and to the capability's reporting surface.

**Executor type.** Human, agent, or either. Where the executor is an agent, the authorization boundary MUST enumerate the permitted operations rather than granting a general permission to interact with the system.

**Safety boundaries.** The executor MUST NOT act on production unless the authorization explicitly names production and the operation. It MUST NOT modify the subject or its data, execute destructive commands, submit or alter records, exercise a mutating operation without explicit written authorization for that operation, trigger a deployment, initiate a restore, or reproduce secret values, credentials, endpoints, or record content. Every executed operation is recorded with command, environment, principal, time, inputs, and non-sensitive result, before its result is used.

**Read-only by default.** Where an observation could be obtained by a read-only means or a mutating means, the read-only means is used. Where only a mutating means exists, the observation is not made and is recorded as unverifiable within the authorization.

## 3. Standards Consumed

*This section is normative.*

| Standard | What this methodology takes from it |
| --- | --- |
| [STD-0007](../02-methodology/evidence-and-confidence.md) | Evidence states and their meanings; **the promotion rules and their preconditions**; degradation and freshness; provenance and attributability; the confidence model; completeness semantics; conflicting evidence; scoring principles and the 0-to-5 scale |
| [STD-0008](../02-methodology/artifact-specification.md) | Artifact structure, envelope, **environment declaration and per-record environment attribution**, lineage, artifact type definition and versioning |
| [STD-0010](../02-methodology/metadata-specification.md) | Metadata representation for every declaration this methodology makes or its artifacts carry |
| [STD-0011](../02-methodology/contract-specification.md) | Producer obligations, preconditions, guaranteed outputs, failure conditions, cross-revision consumption, and their mapping to completeness states |
| [STD-0012](../02-methodology/validation-specification.md) | How conformance is evaluated, reported, and enforced; validation classes and outcomes |
| [STD-0006](../04-development/security-standard.md) | Secret handling during authorized interaction and the prohibition on disclosing credential values |

No definition here overrides a standard. Any apparent conflict is a defect in this document. In particular, the conditions under which a conclusion may be promoted are STD-0007's, and this methodology applies them rather than defining them.

## 4. Inputs

*This section is normative.*

**Required.** The artifact set produced by the run; the run identity; the subject revision each artifact declares; **a written authorization enumerating permitted environments, operations, principals, and time windows**; the deployed revision of the observed environment; output location; a named recipient for escalations.

**Optional.** Health check endpoints; read-only telemetry and metrics; log queries; trace samples; deployment records; feature-flag state from the observed environment; test environments provisioned for the audit; synthetic monitoring results; prior verification records for comparison.

Each input is logged with source, access date, environment, and trust level. Absence of an optional input lowers achievable confidence and does not lower a score, per [STD-0011](../02-methodology/contract-specification.md) R-22.

**Consumed artifact types.** Every artifact type produced by the run, and specifically `framework.gap.unknowns` for the unknowns marked resolvable by runtime evidence, `framework.feature.liveness` for source-capped liveness claims, `framework.operations.recovery` for undemonstrated restore claims, and `framework.backend.contracts` for specification-to-implementation divergences. The dependency is on these types, never on the methodologies that produced them.

## 5. Preconditions

*This section is normative.*

A written authorization naming the environments, operations, principals, and time windows permitted; an observable environment whose deployed revision is known; a means of observation that does not modify the subject; at least one upstream artifact containing a conclusion eligible for promotion; and a named recipient for escalations.

Where a precondition is unmet the methodology is not invoked and the affected artifact types are recorded unavailable, per [STD-0011](../02-methodology/contract-specification.md) R-16 and R-17.

**Where the deployed revision of the observed environment cannot be established, no promotion is performed.** A promotion attaches an observation to a conclusion drawn from a specific revision, and without knowing what is deployed there is nothing to attach it to. Observations may still be recorded, as environment-attributed observations with no promotion.

Where the deployed revision differs from the run's subject revision, observations are recorded under the cross-revision rules of [STD-0011](../02-methodology/contract-specification.md) R-44, with both revisions and the reason recorded, and promotions are permitted only where the conclusion's supporting code is unchanged between the two.

## 6. Artifact Types Produced

*This section is normative.*

Seven artifact types. Their structure conforms to [STD-0008](../02-methodology/artifact-specification.md); each type definition declares the sixteen sections that standard requires.

| Type | Content |
| --- | --- |
| `framework.runtime.environment` | The observed environment with deployed revision, configuration source, observation window, access principal, and its relationship to production |
| `framework.runtime.observations` | Observations with the operation performed, the conditions in force, the result, the time, and the upstream conclusion each bears on |
| `framework.runtime.promotions` | Conclusions promoted with the observation supporting each, the environment and time of promotion, the decay expectation, and the upstream record now carrying `Verified` |
| `framework.runtime.divergence` | Differences between declared and demonstrated behaviour, each naming the declaration record, the observation, and the environment |
| `framework.runtime.limits` | Conclusions that could not be verified, with the reason, the authorization or capability that would permit it, and the conclusions still capped as a result |
| `framework.runtime.risks` | Runtime risk register with cause, impact, evidence, likelihood rationale, confidence, and follow-up |
| `framework.runtime.health` | Health scores per dimension with evidence, confidence, and calculation, bounded by the environment observed |

Downstream consumers depend on these **types**, never on this methodology, per [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md).

## 7. Guaranteed Outputs

*This section is normative.*

This methodology guarantees, for each declared type: that an artifact of that type is emitted; that it conforms to the type at the declared version; that its completeness state is declared; that its provenance is recorded; and that **every observation and every promotion declares the environment and time it applies to**, per [STD-0008](../02-methodology/artifact-specification.md) R-17 and R-42.

It guarantees that no promotion is recorded without a named observation, a named environment, a named time, and a deployed revision.

It does not guarantee that the observed environment resembles production, that the observation window is representative, or that a promoted conclusion remains true after the window closes. `framework.runtime.limits` states what was not verified so that a reader does not read a partial verification as a complete one.

Where a stage cannot be performed, its artifact carries the completeness state that [STD-0011](../02-methodology/contract-specification.md) section 10 maps to the failure, with the disclosure that section requires.

## 8. Verification Principles

*This section is normative.*

These are verification-specific. General evidence discipline is STD-0007's and is not repeated.

1. **A promotion is scoped to an environment, a revision, and a time.** All three are recorded with every promotion. A promotion missing any of them is not a conforming record.
2. **Observation precedes interpretation, and the operation is recorded first.** The command, environment, principal, inputs, and conditions are recorded before the result is used, so that a surprising result cannot be quietly re-obtained under different conditions.
3. **Absence of a demonstration is not a refutation.** A behaviour not observed within the window is unverified, not absent. Only an observation that contradicts a declaration is a divergence.
4. **Read-only unless explicitly authorized otherwise.** Where the only route to an observation is a mutating operation, the observation is forgone and recorded as unverifiable.
5. **Verification decays.** Every promotion records an expectation of how long it holds and what would invalidate it, because a deployment invalidates it and nothing in the artifact set would otherwise say so.

## 9. Verification Workflow

*This section is normative.*

Nine stages. Each declares purpose, inputs, actions, required evidence, deliverables, failure conditions, and acceptance criteria. Every conclusion carries an evidence state and confidence per [STD-0007](../02-methodology/evidence-and-confidence.md).

### Stage 1 — Authorization Confirmation

**Purpose.** Establish exactly what may be done before anything is done.

**Inputs.** Written authorization, escalation contact, environment inventory from `framework.operations.environments`.

**Actions.** Record the permitted environments, operations, principals, and time windows. Record operations explicitly excluded. Confirm the escalation recipient is reachable within the window. Where the authorization is ambiguous about an operation, treat it as excluded and record it as such rather than seeking the broader reading.

**Evidence Required.** Authorization reference, permitted operation list, excluded operation list, window, principal.

**Deliverables.** Authorization record within `framework.runtime.environment`.

**Failure Conditions.** An operation performed outside the enumerated set; an ambiguity resolved permissively; a general authorization accepted in place of an enumerated one for an agent executor.

**Acceptance Criteria.** Every operation later performed appears in the permitted list recorded here.

### Stage 2 — Environment Characterization

**Purpose.** Establish what is being observed and how it relates to what was audited.

**Inputs.** Deployment records, health endpoints, version endpoints, configuration sources, `framework.operations.environments`, the run's subject revision.

**Actions.** Establish the deployed revision by a means that does not depend on the claim being verified. Record the configuration source, the observation window, the access principal, and the environment's declared relationship to production. Compare the deployed revision to the run's subject revision and record the difference. Where the deployed revision cannot be established, record it as unknown and disable promotion for the run.

**Evidence Required.** Deployed revision with the means that established it, configuration source, window, principal, production relationship.

**Deliverables.** `framework.runtime.environment`.

**Failure Conditions.** A revision taken from a deployment document rather than from the running system; an environment described as production-like without evidence; promotion performed with an unknown deployed revision.

**Acceptance Criteria.** The deployed revision is established from the running system or explicitly recorded as unknown, and the relationship to production is stated.

### Stage 3 — Verification Target Selection

**Purpose.** Decide what is worth observing, from the conclusions the audit left uncertain.

**Inputs.** `framework.gap.unknowns`, `framework.feature.liveness`, `framework.operations.recovery`, `framework.backend.contracts`, all domain risk registers.

**Actions.** Select targets from conclusions whose confidence is capped by the absence of runtime evidence, prioritizing those on which the most downstream conclusions depend. Record the selection rationale and, equally, the eligible conclusions not selected, so that the artifact set does not imply that unselected conclusions were checked and found wanting.

**Evidence Required.** Target list with source record addresses, selection rationale, the eligible-but-unselected list.

**Deliverables.** Target record within `framework.runtime.observations`.

**Failure Conditions.** Targets chosen for ease of observation without recording that basis; the unselected list omitted; targets invented rather than drawn from upstream conclusions.

**Acceptance Criteria.** Every target names an upstream conclusion, and eligible unselected conclusions are listed.

### Stage 4 — Observation

**Purpose.** Obtain evidence from the running system under recorded conditions.

**Inputs.** Target list, authorization record, read-only interfaces, telemetry, logs, traces, health endpoints.

**Actions.** For each target, perform the least invasive permitted operation. Record the operation, environment, principal, inputs, time, conditions in force, and non-sensitive result **before** interpreting it. Record load, concurrency, and configuration state where they bear on the result. Where a result is unexpected, record it and its conditions rather than repeating the operation until it agrees with the declaration.

**Evidence Required.** Operation record, conditions, timestamp, result, the target conclusion it bears on.

**Deliverables.** `framework.runtime.observations`.

**Failure Conditions.** An operation performed outside the authorization; a result recorded without its conditions; an observation repeated until convenient; record content or credentials captured in a result.

**Acceptance Criteria.** Each observation records its operation, conditions, time, and result, and every operation appears in the authorization record.

### Stage 5 — Promotion

**Purpose.** Apply the promotion rules to conclusions the observations support.

**Inputs.** Observations, upstream conclusions, the promotion rules of [STD-0007](../02-methodology/evidence-and-confidence.md).

**Actions.** For each conclusion supported by an observation, apply STD-0007's promotion preconditions and record the result. Record the observation, environment, deployed revision, time, and decay expectation with every promotion, together with the events that would invalidate it. Promote only the specific conclusion observed; do not generalize from one observed instance to a class. Record conclusions whose observation was insufficient for promotion, with the reason.

**Evidence Required.** The upstream conclusion address, the supporting observation, the preconditions satisfied, environment, revision, time, decay expectation.

**Deliverables.** `framework.runtime.promotions`.

**Failure Conditions.** Promotion of a class from one instance; promotion without a deployed revision; promotion across environments; a promotion recorded without a decay expectation; promotion by an executor other than this methodology.

**Acceptance Criteria.** Every promotion names an observation, an environment, a revision, a time, and a decay expectation, and no promotion generalizes beyond what was observed.

### Stage 6 — Divergence Detection

**Purpose.** Record where the running system contradicts the audited declaration.

**Inputs.** Observations, upstream declaration records, `framework.gap.divergence`.

**Actions.** Compare each observation against the declaration it bears on. Record contradictions with the declaration record, the observation, the environment, and the conditions. Distinguish a contradiction from an absence of demonstration, per principle 3. Where a divergence concerns configuration or flag state, record the environment prominently, because such divergences are frequently correct behaviour in a non-production environment.

**Evidence Required.** Declaration record address, contradicting observation, environment, conditions.

**Deliverables.** `framework.runtime.divergence`.

**Failure Conditions.** An unobserved behaviour reported as absent; a staging-only divergence reported without its environment; a divergence recorded without naming the declaration it contradicts.

**Acceptance Criteria.** Each divergence names a declaration record, an observation, and an environment, and no entry rests on absence of observation.

### Stage 7 — Limits and Residual Uncertainty

**Purpose.** Record what could not be verified, so that partial verification is not read as complete.

**Inputs.** Target list, unselected eligible conclusions, forgone observations, authorization exclusions, `framework.gap.unknowns`.

**Actions.** Record every conclusion that remains unverified, with the reason: not selected, not observable, not authorized, or observed inconclusively. Name the authorization or capability that would permit each. Record the conclusions still capped as a result, and return them to `framework.gap.unknowns` unresolved rather than silently dropping them.

**Evidence Required.** Conclusion address, reason class, the enabling authorization or capability, the conclusions still capped.

**Deliverables.** `framework.runtime.limits`.

**Failure Conditions.** Unverified conclusions omitted; a forgone mutating observation recorded as a negative finding; the still-capped list not returned to the unknown register.

**Acceptance Criteria.** Every eligible conclusion is either promoted, diverged, or recorded in the limits artifact with a reason.

### Stage 8 — Runtime Risks

**Purpose.** Convert supported observations into prioritized runtime risks without confusing risk with defect proof.

**Inputs.** Observations, divergences, limits, upstream risk registers, risk tier.

**Actions.** Identify risks involving declared behaviour the running system contradicts, configuration diverging across environments, components that did not respond within the window, features live in one environment and not another, and recovery mechanisms that could not be demonstrated. State cause, impact, affected evidence, likelihood rationale, confidence, and suggested next verification. Attribute every risk to its environment.

**Evidence Required.** At least one observation supporting the risk, its environment, and the reasoning from observation to risk.

**Deliverables.** `framework.runtime.risks`.

**Failure Conditions.** A risk stated without an environment; a staging observation presented as a production risk; severity presented as certainty.

**Acceptance Criteria.** A reviewer can challenge or validate each risk from cited evidence and knows which environment it concerns.

### Stage 9 — Consolidation and Final Verification

**Purpose.** Confirm the output is internally consistent, correctly scoped, and safe to consume.

**Inputs.** All produced artifacts, authorization record, unresolved-question list.

**Actions.** Record every evidence item with the attributes [STD-0008](../02-methodology/artifact-specification.md) R-15 requires and the provenance [STD-0007](../02-methodology/evidence-and-confidence.md) section 5 requires. Confirm every promotion carries an environment, a revision, a time, and a decay expectation. Confirm every executed operation appears in the authorization record. Confirm no promotion generalizes beyond its observation and no artifact presents an observation from one environment as evidence about another. Verify no secrets or record content were captured.

**Evidence Required.** Completed verification, artifact versions, authorization reconciliation, escalation record.

**Deliverables.** `framework.runtime.health`, completed and consistent artifact set.

**Failure Conditions.** An operation performed that the authorization does not contain; a promotion missing environment, revision, time, or decay; cross-environment evidence transfer; sensitive data captured.

**Acceptance Criteria.** Every promotion is fully scoped, every operation was authorized, and the artifact set states the environment within which its claims hold.

How this output is validated is defined by [STD-0012](../02-methodology/validation-specification.md); this methodology does not define validator behaviour.

## 10. Health Dimensions

*This section is normative.*

The scale, its meanings, the averaging guard, the escalation guard, and the partial-coverage rule are defined by [STD-0007](../02-methodology/evidence-and-confidence.md) section 13. This methodology declares only its dimensions.

Six dimensions: environment observability; verification coverage; declared-to-demonstrated agreement; configuration parity across observed environments; recovery demonstrability; observation reproducibility.

Every score in this artifact set is bounded by the environment observed and carries that environment in its record. A score obtained against a non-production environment is not a production score, and [CAP-0001](../09-capabilities/CAP-0001-repository-audit.md) section 11 governs how it is presented.

The lowest two levels of the scale for the purposes of the escalation guard are `0` and `1`.

## 11. Runtime Verification Smells

*This section is informative.*

Treat a smell as a prompt for investigation, not proof of failure. Common smells include promotions with no recorded environment; a verification performed against staging and reported without qualification; an observation repeated until it matched the declaration; a deployed revision taken from a release document; a promotion covering a class of endpoints after observing one; feature-flag state observed in one environment and applied to all; a recovery claim promoted from a backup listing rather than a restore; observations recorded without the load or configuration conditions in force; and a limits artifact that is empty after a partial verification.

## 12. Examples and Common Mistakes

*This section is informative.*

A deployed revision read from the running system, a read-only call to an endpoint, a response matching the schema the audit recorded, and all four attributes of environment, revision, time, and decay together support a promotion of that endpoint's contract conclusion to `Verified` in that environment. The same call against staging supports a promotion in staging and nothing about production, and reporting it without the environment is the error this methodology most needs to avoid.

A backup configuration observed in a console is not a demonstrated recovery capability. A completed restore, with its date, scope, and outcome, is. The distinction is recorded by [AUD-0009](08-operations-manual.md) and resolved, where authorization permits, here.

Common mistakes are promoting without an environment; promoting a class from an instance; establishing the deployed revision from documentation; repeating an observation until it agrees; reporting an unobserved behaviour as absent; performing a mutating operation to obtain a read-only fact; omitting the limits artifact; and presenting a non-production score as a system score.

Do not act on production without explicit written authorization naming production and the operation. Do not modify the subject or its data. Do not exercise a mutating operation to obtain an observation available another way. Do not promote a conclusion whose deployed revision is unknown.

## 13. Related Documents

*This section is informative.*

- [Feature Inventory](07-feature-inventory.md)
- [Operations Manual](08-operations-manual.md)
- [Gap Analysis](09-gap-analysis.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [Evidence and Confidence Standard](../02-methodology/evidence-and-confidence.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Metadata Specification Standard](../02-methodology/metadata-specification.md)
- [Contract Specification Standard](../02-methodology/contract-specification.md)
- [Validation Specification Standard](../02-methodology/validation-specification.md)
- [Security Standard](../04-development/security-standard.md)
- [Framework Glossary](../02-methodology/glossary.md)
