---
id: AUD-0008
title: Feature Inventory Methodology
version: 1.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-30
review_cycle: Annual
category: Audit Engine
tags: [audit-engine, feature-inventory, discovery, methodology]
related: [03-frontend-discovery.md, 05-business-workflow-discovery.md, 06-security-permissions.md, 08-operations-manual.md, ../02-methodology/glossary.md, ../09-capabilities/CAP-0001-repository-audit.md]
object_type: Methodology
layer: 1
depends_on: [../02-methodology/evidence-and-confidence.md, ../02-methodology/artifact-specification.md, ../02-methodology/metadata-specification.md, ../02-methodology/contract-specification.md, ../02-methodology/validation-specification.md]
references: [03-frontend-discovery.md, 05-business-workflow-discovery.md, 06-security-permissions.md, 08-operations-manual.md, ../09-capabilities/CAP-0001-repository-audit.md, ../02-methodology/glossary.md]
meta_model_version: 1.0.0
producer_kinds: [feature-inventory, feature-discovery]
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

# Feature Inventory Methodology

## 1. Purpose and Scope

*This section is informative.*

Feature Inventory establishes what the system does, expressed as capabilities a user or an operator would recognize, and how much of that is live.

It is the methodology that answers the question a requester usually asks first and that the structural methodologies answer only indirectly. Architecture describes modules, backend describes operations, and workflow describes processes; none of them says whether a capability is finished, reachable, owned, or abandoned.

Its distinguishing concern is **liveness**. A feature present in code, gated behind a flag that is off in every environment, referenced by no route, and last modified two years ago is not the same as a feature exercised on every request, and an inventory that lists both identically is misleading in the direction that costs the most. Liveness is therefore recorded per feature with the evidence that establishes it, and the absence of runtime evidence caps how strongly it can be claimed.

**This methodology consumes the framework standards and does not restate them.** Evidence states, confidence levels, scoring principles, completeness semantics, artifact structure, participant obligations, and validation behaviour are defined by the standards listed in section 3. Only inventory-specific process is defined here.

## 2. Capability Declaration

*This section is normative.*

This methodology is a constituent of [CAP-0001 Repository Audit](../09-capabilities/CAP-0001-repository-audit.md), where it consumes frontend, workflow, backend, and security artifacts and supplies the feature register to operations, gap analysis, and runtime verification.

**Executor type.** Human, agent, or either.

**Safety boundaries.** The executor MUST NOT modify the subject, execute destructive commands, exercise a feature against a live system, toggle a feature flag, or reproduce secret values, credentials, endpoints, or record content. Where the audit is authorized to run a test suite to establish that a feature is exercised, it records the command, inputs, exit result, and non-sensitive output; execution proves only the behaviour observed under those conditions.

## 3. Standards Consumed

*This section is normative.*

| Standard | What this methodology takes from it |
| --- | --- |
| [STD-0007](../02-methodology/evidence-and-confidence.md) | Evidence states and their meanings; provenance and attributability; evidence quality and freshness; the confidence model; completeness semantics; promotion and degradation; uncertainty propagation; scoring principles and the 0-to-5 scale |
| [STD-0008](../02-methodology/artifact-specification.md) | Artifact structure, envelope, record and evidence attachment points, artifact type definition and versioning |
| [STD-0010](../02-methodology/metadata-specification.md) | Metadata representation for every declaration this methodology makes or its artifacts carry |
| [STD-0011](../02-methodology/contract-specification.md) | Producer obligations, preconditions, guaranteed outputs, failure conditions, and their mapping to completeness states |
| [STD-0012](../02-methodology/validation-specification.md) | How conformance is evaluated, reported, and enforced; validation classes and outcomes |

No definition here overrides a standard. Any apparent conflict is a defect in this document.

## 4. Inputs

*This section is normative.*

**Required.** Repository root; immutable revision identifier; audit request and declared scope; output location outside the subject; authorization boundary.

**Optional.** Product documentation; release notes; feature-flag definitions and their per-environment state; test suites and coverage output; ownership metadata; change history; issue and roadmap references; user-facing help content; analytics or usage evidence from an authorized source; deprecation notices.

Each input is logged with source, access date, environment, and trust level. Absence of an optional input lowers achievable confidence and does not lower a score, per [STD-0011](../02-methodology/contract-specification.md) R-22.

**Consumed artifact types.** `framework.architecture.modules`, `framework.frontend.routing`, `framework.frontend.surface`, `framework.backend.interfaces`, `framework.workflow.processes`, `framework.workflow.states`, `framework.security.authorization`. The dependency is on these types, never on the methodologies that produced them.

## 5. Preconditions

*This section is normative.*

Read access to the repository tree at a stable revision; a working location outside the subject; tools to enumerate files and search text; availability of at least one upstream process, routing, or interface artifact from which features can be assembled; a declared authorization boundary; and a named recipient for escalations.

Where a precondition is unmet the methodology is not invoked and the affected artifact types are recorded unavailable, per [STD-0011](../02-methodology/contract-specification.md) R-16 and R-17.

This methodology is derivative. Where no upstream artifact is available, it produces no independent inventory, and every produced artifact records completeness `Unavailable` with the missing input named.

## 6. Artifact Types Produced

*This section is normative.*

Seven artifact types. Their structure conforms to [STD-0008](../02-methodology/artifact-specification.md); each type definition declares the sixteen sections that standard requires.

| Type | Content |
| --- | --- |
| `framework.feature.register` | Features with a capability statement in user-recognizable terms, implementing components, entry surfaces, and the upstream records assembled into each |
| `framework.feature.liveness` | Liveness state per feature with the evidence establishing it, the environment it applies to, and the ceiling that source-only evidence imposes |
| `framework.feature.flags` | Feature flags with default state, per-environment state where evidenced, the features each gates, the components reading each, and permanently-enabled findings |
| `framework.feature.ownership` | Owning role or team per feature with the artifact that establishes ownership, and unowned-feature findings |
| `framework.feature.coverage` | Test and documentation coverage per feature with the evidence for each, and the distinction between a test that exists and a test that exercises the feature |
| `framework.feature.risks` | Feature risk register with cause, impact, evidence, likelihood rationale, confidence, and follow-up |
| `framework.feature.health` | Health scores per dimension with evidence, confidence, and calculation |

Downstream methodologies depend on these **types**, never on this methodology, per [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md).

## 7. Guaranteed Outputs

*This section is normative.*

This methodology guarantees, for each declared type: that an artifact of that type is emitted; that it conforms to the type at the declared version; that its completeness state is declared; and that its provenance is recorded. It guarantees no finding and no property of the subject, per [STD-0011](../02-methodology/contract-specification.md) R-23 and R-24.

It does not guarantee that the register is exhaustive. A feature with no route, no interface, no process, and no documentation is not discoverable by this methodology, and the register records the evidence classes it searched so that a reader knows what an absence means.

Where a stage cannot be performed, its artifact carries the completeness state that [STD-0011](../02-methodology/contract-specification.md) section 10 maps to the failure, with the disclosure that section requires.

## 8. Discovery Principles

*This section is normative.*

These are inventory-specific. General evidence discipline is STD-0007's and is not repeated.

1. **A feature is stated in the requester's language.** A capability statement names what a user or operator can do. A module name, a service name, or a table name is not a feature.
2. **Every feature is assembled from upstream records.** A feature entry names the routes, interfaces, processes, or components it was assembled from. A feature with no upstream record is not evidence-led and is not recorded.
3. **Liveness is capped by evidence class.** Source evidence supports `Inferred` liveness at most. Test evidence supports `Observed`. Only runtime or usage evidence supports `Verified`, and only for the environment observed.
4. **A flag state is per environment.** A default in code is not the state in production. Where per-environment state is unavailable, the flag's effective state is `Unknown` and every feature it gates inherits that ceiling.
5. **Existence of a test is not coverage of a feature.** Coverage requires evidence that the test exercises the feature's path, not that a file with a matching name exists.

## 9. Discovery Workflow

*This section is normative.*

Nine stages. Each declares purpose, inputs, actions, required evidence, deliverables, failure conditions, and acceptance criteria. Every conclusion carries an evidence state and confidence per [STD-0007](../02-methodology/evidence-and-confidence.md).

### Stage 1 — Candidate Assembly

**Purpose.** Assemble candidate features from upstream artifacts before naming any of them.

**Inputs.** `framework.workflow.processes`, `framework.frontend.routing`, `framework.backend.interfaces`, `framework.architecture.modules`.

**Actions.** Group upstream records that serve one user-recognizable outcome into a candidate. Record the records assembled into each candidate. Keep candidates that draw on a single record, and record them as narrow rather than discarding them. Record upstream records that no candidate absorbed, because they are either infrastructure or an unrecognized feature.

**Evidence Required.** Upstream record references per candidate, the grouping rationale, the unabsorbed-record list.

**Deliverables.** Candidate set feeding `framework.feature.register`.

**Failure Conditions.** Candidates assembled from directory names; upstream records silently dropped; one candidate per module produced mechanically.

**Acceptance Criteria.** Every candidate names its upstream records, and every upstream record is either absorbed or listed as unabsorbed.

### Stage 2 — Feature Statement

**Purpose.** Express each candidate as a capability a requester would recognize.

**Inputs.** Candidate set, product documentation, help content, release notes, domain glossary.

**Actions.** Write a capability statement naming the actor, the action, and the outcome. Where documentation names the same capability, record the documentation reference and any divergence between the documented capability and the assembled one. Where no documentation exists, record the statement as derived from implementation and mark it accordingly.

**Evidence Required.** Capability statement, upstream record references, documentation reference where present, divergence record where found.

**Deliverables.** `framework.feature.register`.

**Failure Conditions.** A statement restating a module name; a documented capability adopted without checking the implementation; divergence resolved by preferring documentation.

**Acceptance Criteria.** Each feature names an actor, an action, and an outcome, and records whether its statement was derived from documentation, from implementation, or from both.

### Stage 3 — Entry Surface Mapping

**Purpose.** Establish how each feature is reached.

**Inputs.** `framework.frontend.routing`, `framework.frontend.surface`, `framework.backend.interfaces`, scheduled and event triggers from `framework.workflow.processes`.

**Actions.** Record the entry surfaces for each feature, including user-facing routes, programmatic interfaces, scheduled triggers, and administrative entry points. Record features with no entry surface as unreachable candidates. Record features reachable only through an administrative path separately, because their audience differs.

**Evidence Required.** Entry surface reference per feature, reachability evidence from the upstream artifact.

**Deliverables.** Entry surface records within `framework.feature.register`.

**Failure Conditions.** Only user-facing surfaces considered; an unreachable feature reported as removed; an administrative entry point merged with a user-facing one.

**Acceptance Criteria.** Each feature names at least one entry surface or carries an explicit unreachable finding.

### Stage 4 — Flag Discovery

**Purpose.** Establish which features are gated and what the gate's state is.

**Inputs.** Feature-flag definitions, flag evaluation sites, per-environment configuration, deployment configuration, `framework.architecture.configuration`.

**Actions.** Record each flag with its default, its per-environment state where evidenced, the components that read it, and the features it gates. Record flags whose state is unavailable as `Unknown` rather than assuming the default applies. Identify flags enabled in every evidenced environment for an extended period, and flags with no reader.

**Evidence Required.** Flag declaration, evaluation site, per-environment configuration reference where present, gated feature reference.

**Deliverables.** `framework.feature.flags`.

**Failure Conditions.** A code default reported as the production state; a flag with no reader reported as active; flag state inferred from a name.

**Acceptance Criteria.** Each flag names its declaration, at least one evaluation site, and either an evidenced per-environment state or an explicit unknown.

### Stage 5 — Liveness Determination

**Purpose.** Establish, per feature, how strongly the claim that it is live can be made.

**Inputs.** Feature register, flag states, test evidence, change history, usage evidence where authorized, `framework.frontend.routing` reachability findings.

**Actions.** Assign a liveness state per feature with the evidence class that supports it, applying the ceilings in principle 3. Where a feature is gated by a flag whose state is unknown, cap its liveness accordingly. Record the environment each liveness claim applies to. Record features whose only evidence is presence in source as candidates for confirmation by [AUD-0011](10-runtime-verification.md) rather than as dormant.

**Evidence Required.** Evidence class, evidence location, environment, the ceiling applied and why.

**Deliverables.** `framework.feature.liveness`.

**Failure Conditions.** Liveness promoted above the evidence class; a source-only claim presented without its ceiling; an environment omitted from a liveness claim; absence of usage evidence reported as disuse.

**Acceptance Criteria.** Each liveness record names its evidence class, its environment, and the ceiling that class imposes.

### Stage 6 — Ownership Discovery

**Purpose.** Establish who is accountable for each feature.

**Inputs.** Ownership metadata, code-owner declarations, module ownership from `framework.architecture.modules`, documentation, change history authorship.

**Actions.** Record the owning role or team per feature with the artifact that establishes it. Prefer a declared owner over an inferred one, and record authorship-derived ownership as inferred. Record features with no owner explicitly, and record features whose owning artifact names an individual rather than a role as a durability finding.

**Evidence Required.** Ownership declaration location, the role or team named, the derivation method where inferred.

**Deliverables.** `framework.feature.ownership`.

**Failure Conditions.** Recent authorship reported as ownership; an unowned feature assigned to the nearest module's owner; an individual recorded where the artifact names a role.

**Acceptance Criteria.** Each feature records an owner with its establishing artifact or an explicit unowned finding.

### Stage 7 — Coverage Assessment

**Purpose.** Establish what evidence exists that each feature works and is documented.

**Inputs.** Test suites, coverage output where supplied, documentation, help content, `framework.workflow.processes`.

**Actions.** Record per feature the tests that exercise its path and the documentation that describes it. Establish that a test exercises the feature by tracing it to a component or process the feature names, not by matching a filename. Record features with tests that do not reach the feature's path as untested despite appearances. Record documentation that describes behaviour the implementation does not exhibit as a divergence.

**Evidence Required.** Test location and the path it reaches, documentation reference, coverage measurement with the command that produced it where used.

**Deliverables.** `framework.feature.coverage`.

**Failure Conditions.** A filename match reported as coverage; a coverage percentage restated without its measurement command; documentation counted without checking that it describes the current behaviour.

**Acceptance Criteria.** Each coverage record names a test location and the feature path it reaches, or records the absence explicitly.

### Stage 8 — Feature Risks

**Purpose.** Convert supported observations into prioritized feature risks without confusing risk with defect proof.

**Inputs.** All previous stage deliverables, risk tier, change history, stated constraints.

**Actions.** Identify risks involving unreachable features, features gated by flags of unknown state, unowned features, features with no exercising test, documentation diverging from implementation, permanently-enabled flags that have become dead branches, and features whose liveness cannot be established. State cause, impact, affected evidence, likelihood rationale, confidence, and suggested next verification.

**Evidence Required.** At least one observation supporting the risk and the reasoning from observation to risk.

**Deliverables.** `framework.feature.risks`.

**Failure Conditions.** Risk claims using generic best practices without repository evidence; severity presented as certainty; a product judgment issued in place of a structural finding.

**Acceptance Criteria.** A reviewer can challenge or validate each risk from cited evidence and understands why it matters.

### Stage 9 — Consolidation and Final Verification

**Purpose.** Normalize evidence and confirm the register is internally consistent, complete for scope, and safe to consume.

**Inputs.** All artifacts, scoring worksheets, unresolved-question list.

**Actions.** Record every evidence item with the attributes [STD-0008](../02-methodology/artifact-specification.md) R-15 requires and the provenance [STD-0007](../02-methodology/evidence-and-confidence.md) section 5 requires. Record lineage per record, per [STD-0008](../02-methodology/artifact-specification.md) R-46, because most records here derive from upstream artifacts. Confirm every feature names its upstream records, every liveness claim names its ceiling, and every unabsorbed upstream record is listed. Confirm the register states which evidence classes were searched, so that absence is interpretable.

**Evidence Required.** Complete evidence attachment for every record, per STD-0008 R-14, and per-record lineage.

**Deliverables.** `framework.feature.health`, completed and consistent artifact set.

**Failure Conditions.** Blanket lineage recorded where derivation is partial; a feature without upstream records; a liveness claim without a ceiling; the searched-evidence-class list omitted.

**Acceptance Criteria.** The artifact set is traceable, internally coherent, complete for declared scope, and states the boundary within which an absence is meaningful.

How this output is validated is defined by [STD-0012](../02-methodology/validation-specification.md); this methodology does not define validator behaviour.

## 10. Health Dimensions

*This section is normative.*

The scale, its meanings, the averaging guard, the escalation guard, and the partial-coverage rule are defined by [STD-0007](../02-methodology/evidence-and-confidence.md) section 13. This methodology declares only its dimensions.

Seven dimensions: register completeness; feature reachability; liveness evidence strength; flag hygiene; ownership clarity; test coverage evidence; documentation agreement.

The lowest two levels of the scale for the purposes of the escalation guard are `0` and `1`.

## 11. Feature Inventory Smells

*This section is informative.*

Treat a smell as a prompt for investigation, not proof of failure. Common smells include a feature list that mirrors the module list; flags enabled everywhere for years with both branches still present; a capability described in release notes with no entry surface; features owned by an individual who no longer appears in the change history; tests named for a feature that exercise none of its components; two features whose capability statements differ only in wording; a feature reachable only by an administrative path and documented as generally available; and a register in which every feature is `Verified` from a source-only audit.

## 12. Examples and Common Mistakes

*This section is informative.*

A reachable route, a process traced from it, an interface it calls, a test exercising that interface, and a help page describing the outcome together support an observed live feature with documented coverage. The same feature, with its flag's production state unavailable, is capped at unknown liveness regardless of how complete the rest of the evidence is, and recording it as live is the error this methodology most needs to avoid.

Common mistakes are naming features after modules; assembling a register without citing upstream records; treating a code-level flag default as the production state; claiming `Verified` liveness from a source-only audit; counting a test by filename; assigning ownership from recent commits; reporting an unreachable feature as removed; and omitting the list of evidence classes searched, which makes every absence uninterpretable.

Do not exercise a feature against a live system. Do not toggle a flag. Do not modify the subject. Do not promote a liveness claim above the evidence class that supports it.

## 13. Related Documents

*This section is informative.*

- [Frontend Discovery](03-frontend-discovery.md)
- [Business Workflow Discovery](05-business-workflow-discovery.md)
- [Security and Permissions](06-security-permissions.md)
- [Operations Manual](08-operations-manual.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [Evidence and Confidence Standard](../02-methodology/evidence-and-confidence.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Metadata Specification Standard](../02-methodology/metadata-specification.md)
- [Contract Specification Standard](../02-methodology/contract-specification.md)
- [Validation Specification Standard](../02-methodology/validation-specification.md)
- [Framework Glossary](../02-methodology/glossary.md)
