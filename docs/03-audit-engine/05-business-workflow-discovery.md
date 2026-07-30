---
id: AUD-0006
title: Business Workflow Discovery Methodology
version: 1.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-30
review_cycle: Annual
category: Audit Engine
tags: [audit-engine, workflow, business-rules, discovery, methodology]
related: [03-frontend-discovery.md, 04-backend-discovery.md, 06-security-permissions.md, 07-feature-inventory.md, ../02-methodology/glossary.md, ../09-capabilities/CAP-0001-repository-audit.md]
object_type: Methodology
layer: 1
depends_on: [../02-methodology/evidence-and-confidence.md, ../02-methodology/artifact-specification.md, ../02-methodology/metadata-specification.md, ../02-methodology/contract-specification.md, ../02-methodology/validation-specification.md]
references: [03-frontend-discovery.md, 04-backend-discovery.md, 06-security-permissions.md, 07-feature-inventory.md, ../09-capabilities/CAP-0001-repository-audit.md, ../02-methodology/glossary.md]
meta_model_version: 1.0.0
producer_kinds: [workflow-discovery]
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

# Business Workflow Discovery Methodology

## 1. Purpose and Scope

*This section is informative.*

Business Workflow Discovery is an evidence-led reconstruction of what the system does in business terms: which processes it carries out, which rules constrain them, which states an entity moves through, who or what initiates each transition, and where each rule is actually enforced.

The methodology recovers process from implementation. It does not accept a documented process as the implemented one, and it does not infer a process from a directory named after a business domain. A process is established from an executable path that a trigger can reach.

Its most consequential output is the enforcement location of each rule. A rule enforced in a client, a rule enforced in a service, and a rule enforced by a database constraint have different failure modes, and a system that enforces the same rule in three places with three different thresholds behaves differently depending on which path a request takes. Recording where a rule lives is therefore part of recording the rule.

**This methodology consumes the framework standards and does not restate them.** Evidence states, confidence levels, scoring principles, completeness semantics, artifact structure, participant obligations, and validation behaviour are defined by the standards listed in section 3. Only workflow-specific process is defined here.

## 2. Capability Declaration

*This section is normative.*

This methodology is a constituent of [CAP-0001 Repository Audit](../09-capabilities/CAP-0001-repository-audit.md), where it consumes frontend, backend, and database artifacts and supplies process, rule, and enforcement evidence to feature inventory, security and permissions, and gap analysis.

**Executor type.** Human, agent, or either.

**Safety boundaries.** The executor MUST NOT modify the subject, execute destructive commands, initiate a business process against a live system, or reproduce secret values, credentials, endpoints, or record content. Business rules are recorded as rules; the data they operate on is not reproduced. Where the audit is authorized to execute a test suite to observe a process, it records the command, inputs, exit result, and non-sensitive output; execution proves only the behaviour observed under those conditions.

## 3. Standards Consumed

*This section is normative.*

| Standard | What this methodology takes from it |
| --- | --- |
| [STD-0007](../02-methodology/evidence-and-confidence.md) | Evidence states and their meanings; provenance and attributability; evidence quality and freshness; the confidence model; completeness semantics; promotion and degradation; uncertainty propagation; conflicting evidence; scoring principles and the 0-to-5 scale |
| [STD-0008](../02-methodology/artifact-specification.md) | Artifact structure, envelope, record and evidence attachment points, artifact type definition and versioning |
| [STD-0010](../02-methodology/metadata-specification.md) | Metadata representation for every declaration this methodology makes or its artifacts carry |
| [STD-0011](../02-methodology/contract-specification.md) | Producer obligations, preconditions, guaranteed outputs, failure conditions, and their mapping to completeness states |
| [STD-0012](../02-methodology/validation-specification.md) | How conformance is evaluated, reported, and enforced; validation classes and outcomes |

No definition here overrides a standard. Any apparent conflict is a defect in this document.

## 4. Inputs

*This section is normative.*

**Required.** Repository root; immutable revision identifier; audit request and declared scope; output location outside the subject; authorization boundary.

**Optional.** Requirements documentation; process diagrams; acceptance tests and behaviour specifications; state machine definitions; workflow engine configuration; rule engine declarations; validation code; notification and escalation configuration; domain glossaries; owner interviews; support or incident records describing intended behaviour.

Each input is logged with source, access date, and trust level. Absence of an optional input lowers achievable confidence and does not lower a score, per [STD-0011](../02-methodology/contract-specification.md) R-22.

**Consumed artifact types.** `framework.architecture.modules`, `framework.frontend.routing`, `framework.frontend.dataflow`, `framework.backend.interfaces`, `framework.backend.execution`, `framework.backend.contracts`, `framework.database.entities`, `framework.database.constraints`, `framework.database.relationships`. The dependency is on these types, never on the methodologies that produced them.

## 5. Preconditions

*This section is normative.*

Read access to the repository tree at a stable revision; a working location outside the subject; tools to enumerate files and search text; availability of at least one upstream interface or routing artifact from which entry points can be reached; a declared authorization boundary; and a named recipient for escalations.

Where a precondition is unmet the methodology is not invoked and the affected artifact types are recorded unavailable, per [STD-0011](../02-methodology/contract-specification.md) R-16 and R-17.

Where no upstream interface or routing artifact is available, process reconstruction cannot begin from a trigger, and every produced artifact is limited to completeness `Partial` with the missing input recorded as the reason.

## 6. Artifact Types Produced

*This section is normative.*

Eight artifact types. Their structure conforms to [STD-0008](../02-methodology/artifact-specification.md); each type definition declares the sixteen sections that standard requires.

| Type | Content |
| --- | --- |
| `framework.workflow.processes` | Business processes with trigger, actor, ordered steps, participating components, terminal outcomes, and compensating paths |
| `framework.workflow.rules` | Business rules with the condition expressed, the entity constrained, the declaring location, the source of authority, and duplicate-declaration findings |
| `framework.workflow.enforcement` | The enforcement location of each rule with layer, bypass paths, and divergence findings where a rule is enforced differently in different layers |
| `framework.workflow.states` | Entity lifecycles with states, permitted transitions, the component that performs each transition, and unreachable or terminal-state findings |
| `framework.workflow.decisions` | Decision points with inputs, branches, the component that decides, and the observable consequence of each branch |
| `framework.workflow.actors` | Human and system actors with the processes each initiates, the authority evidence for that initiation, and the components acting on their behalf |
| `framework.workflow.risks` | Workflow risk register with cause, impact, evidence, likelihood rationale, confidence, and follow-up |
| `framework.workflow.health` | Health scores per dimension with evidence, confidence, and calculation |

Downstream methodologies depend on these **types**, never on this methodology, per [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md).

## 7. Guaranteed Outputs

*This section is normative.*

This methodology guarantees, for each declared type: that an artifact of that type is emitted; that it conforms to the type at the declared version; that its completeness state is declared; and that its provenance is recorded. It guarantees no finding and no property of the subject, per [STD-0011](../02-methodology/contract-specification.md) R-23 and R-24.

It does not guarantee that the reconstructed processes are the processes the business intends. It guarantees only that each reconstructed process traces to an executable path.

Where a stage cannot be performed, its artifact carries the completeness state that [STD-0011](../02-methodology/contract-specification.md) section 10 maps to the failure, with the disclosure that section requires.

## 8. Discovery Principles

*This section is normative.*

These are workflow-specific. General evidence discipline is STD-0007's and is not repeated.

1. **A process starts at a trigger.** Reconstruction begins from an interface, route, schedule, or event that something outside the process can reach. A sequence of functions with no reachable trigger is not a process.
2. **A rule is located, not just stated.** Every recorded rule names the artifact and line that expresses it. A rule with no location is a requirement, and it is recorded as such.
3. **The same rule in two layers is two rules until proven identical.** Where a constraint appears in a client, a service, and a store, each is recorded with its own condition, and agreement is a finding rather than an assumption.
4. **Documentation is a claim about intent.** A specification, ticket, or diagram is evidence of what was intended. Only code and tests are evidence of what happens.
5. **Absence of a rule is reportable only within a declared scope.** Stating that no rule constrains an entity requires having examined the layers where such a rule would live, and recording which those were.

## 9. Discovery Workflow

*This section is normative.*

Ten stages. Each declares purpose, inputs, actions, required evidence, deliverables, failure conditions, and acceptance criteria. Every conclusion carries an evidence state and confidence per [STD-0007](../02-methodology/evidence-and-confidence.md).

### Stage 1 — Trigger Inventory

**Purpose.** Establish every way a business process can begin.

**Inputs.** `framework.backend.interfaces`, `framework.backend.execution`, `framework.frontend.routing`, scheduler declarations, event subscriptions, manual administrative entry points.

**Actions.** Inventory triggers with kind, address form, initiating actor class, and the component that receives them. Separate user-initiated, system-initiated, scheduled, and event-initiated triggers. Record triggers reachable only by an operator or administrator distinctly, because their process paths are often undocumented.

**Evidence Required.** Trigger declaration location, receiving component, actor class evidence.

**Deliverables.** Trigger inventory feeding `framework.workflow.processes`.

**Failure Conditions.** Triggers taken only from user-facing routes; administrative or scheduled entry points omitted; an event subscription counted without a handler.

**Acceptance Criteria.** Every trigger names a declaration location and a receiving component, and the four trigger kinds are separately represented or explicitly absent.

### Stage 2 — Process Reconstruction

**Purpose.** Trace each trigger to the ordered work it performs and the outcomes it can reach.

**Inputs.** Trigger inventory, handler implementations, service calls, `framework.backend.execution`, `framework.frontend.dataflow`.

**Actions.** Trace each trigger through its call path, recording ordered steps, participating components, branch points, asynchronous handoffs, and terminal outcomes. Record where a process crosses a service boundary or a queue, because those are the points at which partial completion becomes observable. Record compensating or rollback paths, and record their absence where a multi-step process has none.

**Evidence Required.** Call path locations, handoff sites, terminal outcome locations, compensation path where present.

**Deliverables.** `framework.workflow.processes`.

**Failure Conditions.** A process assembled from function names; a branch omitted because it is an error path; an asynchronous handoff treated as an inline step; a process claimed with no terminal outcome.

**Acceptance Criteria.** Each process names its trigger, its ordered steps with locations, and at least one terminal outcome, and asynchronous boundaries are marked.

### Stage 3 — Rule Extraction

**Purpose.** Extract the constraints the system applies, expressed as conditions rather than as code.

**Inputs.** Validation code, guard clauses, rule engine declarations, `framework.backend.contracts`, `framework.database.constraints`, configuration-driven thresholds.

**Actions.** Record each rule as the condition it expresses, the entity or operation it constrains, the location that declares it, and the source of authority where one is documented. Record thresholds sourced from configuration with the key rather than the value where the value is environment-specific. Record rules expressed as data in a rule engine or table separately from rules expressed in code.

**Evidence Required.** Declaring location, the condition expressed, the constrained entity, authority reference where documented.

**Deliverables.** `framework.workflow.rules`.

**Failure Conditions.** A type declaration reported as a business rule; a rule stated without a location; a configured threshold reported as a fixed rule; rule content reproduced from records rather than from declarations.

**Acceptance Criteria.** Each rule records a condition, a constrained entity, and a declaring location.

### Stage 4 — Enforcement Mapping

**Purpose.** Establish where each rule is enforced and what bypasses it.

**Inputs.** Rule inventory, `framework.frontend.components`, `framework.backend.boundaries`, `framework.database.constraints`, alternate write paths from `framework.backend.dataaccess`.

**Actions.** For each rule, record every layer that enforces it and the condition each layer applies. Where two layers apply different conditions, record the divergence as a finding with both locations. Identify write paths that reach the entity without passing the enforcing layer, including administrative tools, migrations, and background jobs. Record rules enforced only in a client as client-only, per [AUD-0004](03-frontend-discovery.md) principle 3.

**Evidence Required.** Enforcement location per layer, the condition applied at each, bypass path locations.

**Deliverables.** `framework.workflow.enforcement`.

**Failure Conditions.** Enforcement assumed from the presence of a validation library; a divergence resolved by preferring the service layer; bypass paths omitted because they are administrative.

**Acceptance Criteria.** Each rule records at least one enforcement location or an explicit unenforced finding, and every divergence names both conditions.

### Stage 5 — State and Lifecycle Discovery

**Purpose.** Establish the states an entity occupies and the transitions between them.

**Inputs.** State field declarations, enumerations, state machine configuration, transition code, `framework.database.entities`, status-dependent queries.

**Actions.** Record each lifecycle with its states, permitted transitions, and the component that performs each transition. Identify states with no inbound transition and states with no outbound transition, recording terminal states as intentional where evidence supports it and as unreachable-exit findings where it does not. Identify transitions performed by direct field assignment outside the declared mechanism.

**Evidence Required.** State declaration, transition site, guard condition, the component performing the transition.

**Deliverables.** `framework.workflow.states`.

**Failure Conditions.** States enumerated from a database column's distinct values rather than from declarations; a transition inferred from a method name; direct assignments omitted.

**Acceptance Criteria.** Each lifecycle names its declaring artifact, its states, and a transition site for every permitted transition.

### Stage 6 — Decision Point Discovery

**Purpose.** Identify the points where the system chooses between materially different outcomes.

**Inputs.** Process traces, branch sites, rule inventory, feature-flag declarations, configuration-driven behaviour.

**Actions.** Record each decision point with its inputs, its branches, the component that decides, and the observable consequence of each branch. Distinguish decisions driven by business data from decisions driven by configuration or feature flags. Record decisions whose branches are indistinguishable to a consumer, because they are candidates for dead logic.

**Evidence Required.** Branch site, deciding inputs, consequence location per branch.

**Deliverables.** `framework.workflow.decisions`.

**Failure Conditions.** Every conditional reported as a decision point; a feature-flagged branch reported as active without flag-state evidence; consequences described without a location.

**Acceptance Criteria.** Each decision point names its location, its inputs, and a consequence for each branch.

### Stage 7 — Actor Discovery

**Purpose.** Identify who and what initiates the reconstructed processes.

**Inputs.** Trigger inventory, role and permission references, service accounts, scheduled job owners, `framework.backend.boundaries`.

**Actions.** Record human and system actors with the processes each initiates and the evidence that establishes their authority to do so. Record actors that act on behalf of another party and the delegation mechanism. Where authority cannot be established from the repository, record the actor with authority `Unknown` rather than assuming an open or closed default. Authorization correctness is [AUD-0007](06-security-permissions.md)'s output, not this methodology's.

**Evidence Required.** Actor reference, initiating trigger, authority declaration where present, delegation mechanism where present.

**Deliverables.** `framework.workflow.actors`.

**Failure Conditions.** A role name treated as an authority grant; a service account omitted because it is not a person; an authorization conclusion issued here.

**Acceptance Criteria.** Each actor names at least one process it initiates and records its authority evidence or an explicit unknown.

### Stage 8 — Workflow Risks

**Purpose.** Convert supported observations into prioritized workflow risks without confusing risk with defect proof.

**Inputs.** All previous stage deliverables, risk tier, incident records, stated constraints.

**Actions.** Identify risks involving rules enforced in one layer only, divergent conditions across layers, bypass paths reaching an entity, multi-step processes without compensation, unreachable states, decisions with indistinguishable branches, and processes whose asynchronous boundary can leave an entity partially updated. State cause, impact, affected evidence, likelihood rationale, confidence, and suggested next verification.

**Evidence Required.** At least one observation supporting the risk and the reasoning from observation to risk.

**Deliverables.** `framework.workflow.risks`.

**Failure Conditions.** Risk claims using generic best practices without repository evidence; severity presented as certainty; a business judgment issued in place of a structural finding.

**Acceptance Criteria.** A reviewer can challenge or validate each risk from cited evidence and understands why it matters.

### Stage 9 — Evidence Consolidation

**Purpose.** Normalize and quality-check evidence so conclusions remain auditable after the session ends.

**Inputs.** Observations, paths, revision data, documentation references, test output.

**Actions.** Record every evidence item with the attributes [STD-0008](../02-methodology/artifact-specification.md) R-15 requires and the provenance [STD-0007](../02-methodology/evidence-and-confidence.md) section 5 requires. Where a conclusion derives from an upstream artifact, record lineage per record, per [STD-0008](../02-methodology/artifact-specification.md) R-46. Where documentation and code disagree, record both and apply the conflicting-evidence rules of [STD-0007](../02-methodology/evidence-and-confidence.md).

**Evidence Required.** Complete evidence attachment for every record, per STD-0008 R-14.

**Deliverables.** Evidence records within every produced artifact.

**Failure Conditions.** Conclusions citing no evidence; documentation and code conflated; blanket lineage recorded where derivation is partial; record content reproduced as rule evidence.

**Acceptance Criteria.** Each conclusion has evidence, each evidence item has provenance, and every documentation-versus-code conflict is recorded rather than resolved.

### Stage 10 — Final Verification

**Purpose.** Confirm the output is internally consistent, complete for scope, and safe to consume.

**Inputs.** All artifacts, scoring worksheets, unresolved-question list.

**Actions.** Confirm every stage produced an artifact or an explicit completeness state with a reason. Confirm that every process names a trigger present in the trigger inventory, every rule appears in the enforcement map, and every state transition names a performing component. Confirm scores show their calculation. Verify no record content remains.

**Evidence Required.** Completed verification, artifact versions, escalation record.

**Deliverables.** `framework.workflow.health`, completed and consistent artifact set.

**Failure Conditions.** Unresolved contradictions, broken evidence links, rules absent from the enforcement map, or record content exposure.

**Acceptance Criteria.** The artifact set is traceable, internally coherent, complete for declared scope, and ready for human review or downstream methodologies.

How this output is validated is defined by [STD-0012](../02-methodology/validation-specification.md); this methodology does not define validator behaviour.

## 10. Health Dimensions

*This section is normative.*

The scale, its meanings, the averaging guard, the escalation guard, and the partial-coverage rule are defined by [STD-0007](../02-methodology/evidence-and-confidence.md) section 13. This methodology declares only its dimensions.

Eight dimensions: process traceability; rule locatability; enforcement consistency; bypass control; lifecycle integrity; decision clarity; actor authority clarity; documentation-to-implementation agreement.

The lowest two levels of the scale for the purposes of the escalation guard are `0` and `1`.

## 11. Workflow Smells

*This section is informative.*

Treat a smell as a prompt for investigation, not proof of failure. Common smells include a rule expressed with three different thresholds in three layers; a status field written by direct assignment in several unrelated components; a multi-step process whose second step can fail with no compensation; an administrative script that writes an entity without passing any validation; a state that no transition reaches; a decision branch whose two outcomes are indistinguishable to any consumer; a documented process with no matching trigger; a rule declared in configuration and treated as fixed; a workflow whose only ordering guarantee is the sequence of calls in one function; and business logic that exists only in a test.

## 12. Examples and Common Mistakes

*This section is informative.*

A route registration, a handler tracing through three named services, a database constraint expressing the same limit as the service check, and a test asserting the rejection message together support an observed process with a consistently enforced rule. A directory named for a business domain, containing functions no trigger reaches, supports nothing. A rule enforced at the client and absent from the service is not a rule about the system; it is a rule about one path to the system, and recording it as the former is the error this methodology exists to prevent.

Common mistakes are reconstructing a process from documentation; treating every conditional as a decision point; recording a rule without a location; resolving a cross-layer divergence by preferring one layer; enumerating states from stored data; omitting administrative and migration write paths; issuing an authorization verdict; and reproducing record content as evidence of a rule.

Do not initiate a business process against a live system. Do not modify the subject. Do not resolve a documentation-versus-code conflict by choosing a side.

## 13. Related Documents

*This section is informative.*

- [Frontend Discovery](03-frontend-discovery.md)
- [Backend Discovery](04-backend-discovery.md)
- [Security and Permissions](06-security-permissions.md)
- [Feature Inventory](07-feature-inventory.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [Evidence and Confidence Standard](../02-methodology/evidence-and-confidence.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Metadata Specification Standard](../02-methodology/metadata-specification.md)
- [Contract Specification Standard](../02-methodology/contract-specification.md)
- [Validation Specification Standard](../02-methodology/validation-specification.md)
- [Framework Glossary](../02-methodology/glossary.md)
