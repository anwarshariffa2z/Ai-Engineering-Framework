---
id: AUD-0002
title: Architecture Discovery Methodology
version: 2.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-30
review_cycle: Annual
category: Audit Engine
tags: [audit-engine, architecture, discovery, methodology]
related: [00-bootstrap.md, 02-database-discovery.md, ../02-methodology/glossary.md, ../09-capabilities/CAP-0001-repository-audit.md]
object_type: Methodology
layer: 1
depends_on: [../02-methodology/evidence-and-confidence.md, ../02-methodology/artifact-specification.md, ../02-methodology/metadata-specification.md, ../02-methodology/contract-specification.md, ../02-methodology/validation-specification.md]
references: [00-bootstrap.md, 02-database-discovery.md, ../09-capabilities/CAP-0001-repository-audit.md, ../02-methodology/glossary.md]
meta_model_version: 1.0.0
producer_kinds: [architecture-discovery]
consumes: []
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

# Architecture Discovery Methodology

## 1. Purpose and Scope

*This section is informative.*

Architecture Discovery is an evidence-led examination of a software repository establishing how the system is composed, built, configured, deployed, operated, and connected to external systems. The result is a traceable architectural model, not a guess based on filenames, framework conventions, or a single configuration file.

The methodology is technology-neutral and executable by an AI agent or a human. It discovers the technology and records the evidence before applying any classification.

It separates three questions that are often incorrectly combined: what the repository declares, what the inspected artifacts demonstrate, and what the running system is known to do. A repository may define excellent intent while the current deployment differs; runtime records may reveal behaviour that no longer appears in source. The distinction is preserved rather than resolved by convenience.

**This methodology consumes the framework standards and does not restate them.** Evidence states, confidence levels, scoring principles, completeness semantics, artifact structure, participant obligations, and validation behaviour are defined by the standards listed in section 3. Only architecture-specific process is defined here.

## 2. Capability Declaration

*This section is normative.*

This methodology is a constituent of [CAP-0001 Repository Audit](../09-capabilities/CAP-0001-repository-audit.md), where it occupies the foundational position: its artifacts are consumed by database, frontend, backend, security, operations, and gap-analysis discovery.

**Executor type.** Human, agent, or either.

**Safety boundaries.** The executor MUST NOT modify the subject, execute destructive commands, read production records, or reproduce secret values, credentials, endpoints, or record content. Where the audit is authorized to run a build, test, or inspection command, it records the command, working directory, inputs, exit result, and non-sensitive output; execution proves only the behaviour observed under those conditions.

## 3. Standards Consumed

*This section is normative.*

| Standard | What this methodology takes from it |
| --- | --- |
| [STD-0007](../02-methodology/evidence-and-confidence.md) | Evidence states and their meanings; provenance and attributability; evidence quality, corroboration, and freshness; the confidence model; completeness semantics; promotion and degradation; uncertainty propagation; scoring principles and the 0-to-5 scale |
| [STD-0008](../02-methodology/artifact-specification.md) | Artifact structure, envelope, record and evidence attachment points, artifact type definition and versioning |
| [STD-0010](../02-methodology/metadata-specification.md) | Metadata representation for every declaration this methodology makes or its artifacts carry |
| [STD-0011](../02-methodology/contract-specification.md) | Producer obligations, preconditions, guaranteed outputs, failure conditions, and their mapping to completeness states |
| [STD-0012](../02-methodology/validation-specification.md) | How conformance is evaluated, reported, and enforced; validation classes and outcomes |

Where this methodology names an evidence state, a confidence level, or a completeness state, the meaning is STD-0007's. Where it declares an artifact, the structure is STD-0008's. No definition in this document overrides a standard, and any apparent conflict is a defect in this document.

## 4. Inputs

*This section is normative.*

**Required.** Repository root; immutable revision identifier; audit request and declared scope; output location outside the subject; authorization boundary.

**Optional.** Architecture diagrams; build instructions; package registries; CI configuration; infrastructure-as-code; container metadata; environment-variable catalogues; API contracts; incident records; runtime observations; dependency lockfiles; owner interviews.

Each input is logged with source, access date, and trust level. Absence of an optional input lowers achievable confidence and does not lower a score, per [STD-0011](../02-methodology/contract-specification.md) R-22.

## 5. Preconditions

*This section is normative.*

Read access to the repository tree at a stable revision; a working location outside the subject; tools to enumerate files and search text; permission to inspect non-secret build and deployment metadata; a declared authorization boundary; and a named recipient for escalations.

Where a precondition is unmet the methodology is not invoked, and the orchestrator records the affected artifact types as unavailable, per [STD-0011](../02-methodology/contract-specification.md) R-16 and R-17.

## 6. Artifact Types Produced

*This section is normative.*

This methodology produces the following artifact types. Their structure conforms to [STD-0008](../02-methodology/artifact-specification.md); each type definition declares the sixteen sections that standard requires.

| Type | Content |
| --- | --- |
| `framework.architecture.scope` | Repository boundary, revision, traversal log, exclusions, inaccessible paths |
| `framework.architecture.technology` | Declared runtimes, package ecosystems, frameworks, databases, and tooling with role and version evidence |
| `framework.architecture.build` | Build controller, command inventory, artifact flow, CI relationship, reproducibility observations |
| `framework.architecture.entrypoints` | Entry points with type, trigger, owning module, and initialization trace |
| `framework.architecture.dependencies` | Dependency register, coupling map, cycle findings, supply-chain observations |
| `framework.architecture.modules` | Module catalogue with responsibility evidence and public interfaces |
| `framework.architecture.layers` | Layer map, dependency-direction rules, violation register |
| `framework.architecture.classification` | Architecture classification with rationale, alternatives considered, and confidence |
| `framework.architecture.runtime` | Runtime component inventory and interaction map |
| `framework.architecture.integrations` | Integration register and trust-boundary map |
| `framework.architecture.configuration` | Configuration inventory, precedence model, secret-boundary observations |
| `framework.architecture.deployment` | Deployment topology, release flow, environment inventory |
| `framework.architecture.risks` | Architecture risk register with cause, impact, evidence, and follow-up |
| `framework.architecture.health` | Health scores per dimension with evidence, confidence, and calculation |

Downstream methodologies depend on these **types**, never on this methodology, per [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md).

## 7. Guaranteed Outputs

*This section is normative.*

This methodology guarantees, for each declared type: that an artifact of that type is emitted; that it conforms to the type at the declared version; that its completeness state is declared; and that its provenance is recorded. It guarantees no finding and no property of the subject, per [STD-0011](../02-methodology/contract-specification.md) R-23 and R-24.

Where a stage cannot be performed, its artifact carries the completeness state that [STD-0011](../02-methodology/contract-specification.md) section 10 maps to the failure, with the disclosure that section requires.

## 8. Discovery Principles

*This section is normative.*

These are architecture-specific. General evidence discipline is STD-0007's and is not repeated.

1. **Evidence before interpretation.** Record observed paths, declarations, commands, logs, or runtime facts before assigning meaning.
2. **Least inference.** Prefer the narrowest conclusion the evidence supports. Framework naming conventions are clues, not proof.
3. **Proportional depth.** Explore code, metadata, and runtime evidence according to system impact, change rate, and uncertainty.
4. **Controlled execution.** Authorized execution proves only the behaviour observed under the recorded conditions.
5. **Declared is not deployed.** A repository declaration is evidence of intent. Only runtime records are evidence of deployed behaviour, and only for the environment observed.

## 9. Discovery Workflow

*This section is normative.*

Fifteen stages. Each declares purpose, inputs, actions, required evidence, deliverables, failure conditions, and acceptance criteria. Every conclusion carries an evidence state and confidence per [STD-0007](../02-methodology/evidence-and-confidence.md).

### Stage 1 — Repository Traversal

**Purpose.** Establish the physical audit boundary and a navigable map before evaluating individual files.

**Inputs.** Repository root, revision identifier, ignore rules, audit scope, linked repositories supplied by the requester.

**Actions.** Enumerate files and directories including relevant hidden configuration. Identify repository roots, submodules, workspaces, generated-content markers, documentation, test suites, automation, infrastructure, and vendored code. Respect ignore rules while separately noting excluded material. Record inaccessible paths and symbolic links without following a link outside the authorized scope.

**Evidence Required.** Root listing, directory inventory, revision identifier, ignore configuration, list of excluded or inaccessible paths.

**Deliverables.** `framework.architecture.scope`.

**Failure Conditions.** No stable revision identifiable; root unreadable; traversal omits known workspace roots; generated and source material indistinguishable.

**Acceptance Criteria.** A reviewer can locate every top-level component, understand exclusions, and reproduce traversal against the recorded revision.

### Stage 2 — Technology Detection

**Purpose.** Identify languages, frameworks, package ecosystems, platforms, and tooling from explicit declarations.

**Inputs.** File inventory, manifests, lockfiles, build scripts, source extensions, container definitions, CI configuration.

**Actions.** Inventory declared runtimes, compilers, package managers, frameworks, databases, and test tools. Weight lockfiles, manifests, and executed CI definitions above file extensions. Separate direct from transitive dependencies, and installed tooling from active application technology.

**Evidence Required.** Paths and relevant declaration names or versions, without copying registry credentials or full lockfile contents.

**Deliverables.** `framework.architecture.technology`.

**Failure Conditions.** Technology asserted from naming alone; incompatible manifests silently merged; version evidence omitted.

**Acceptance Criteria.** Each detected technology has a source artifact and a stated role: build, test, runtime, data, deployment, or development support.

### Stage 3 — Build System Discovery

**Purpose.** Determine how source becomes testable, deployable artifacts and where that process is controlled.

**Inputs.** Manifests, task definitions, build files, CI workflows, container files, release scripts, documentation.

**Actions.** Identify build entry commands, task graphs, generated artifacts, test gates, artifact publication, caching, versioning, and release triggers. Compare local scripts with CI definitions and report differences as observations. Detect multi-stage or multi-language builds and whether lockfiles or pinned toolchains support reproducibility.

**Evidence Required.** Build-definition paths, task names, CI job references, output directories, pinned-version declarations.

**Deliverables.** `framework.architecture.build`.

**Failure Conditions.** A documented command treated as executed evidence; CI ignored; generated outputs mistaken for authoritative source.

**Acceptance Criteria.** The build controller, inputs, outputs, test relationship, and unresolved execution assumptions are identified.

### Stage 4 — Application Entry Points

**Purpose.** Find where executable behaviour begins for services, clients, jobs, workers, scripts, and infrastructure automation.

**Inputs.** Build metadata, source manifests, runtime configuration, container commands, process definitions, test harnesses.

**Actions.** Locate declared executables, handlers, main modules, command registrations, scheduler targets, server listeners, event consumers, and infrastructure apply points. Trace each entry point one level into initialization to identify configuration loading, dependency composition, and error-boundary setup. Label test-only and development-only entry points separately.

**Evidence Required.** Entry-point declaration, path, invocation context, initialization trace.

**Deliverables.** `framework.architecture.entrypoints`.

**Failure Conditions.** A class or module called an entry point without an invocation path; interactive and production paths conflated.

**Acceptance Criteria.** Every claimed deployable component has at least one observed entry point or is recorded as inferred or unknown.

### Stage 5 — Dependency Analysis

**Purpose.** Understand internal and external coupling, dependency direction, and material supply-chain exposure.

**Inputs.** Manifests, lockfiles, import graphs, service clients, plugins, generated dependency metadata, CI caches.

**Actions.** Map direct dependencies by component, identify shared libraries, detect circular imports or prohibited directions, and distinguish compile-time, runtime, optional, and development dependencies. Identify unpinned or conflicting version constraints. Record only the architectural relationship; do not claim reachability of a dependency vulnerability without separate security evidence.

**Evidence Required.** Dependency declarations, import or reference locations, lockfile evidence, component ownership.

**Deliverables.** `framework.architecture.dependencies`.

**Failure Conditions.** Transitive packages reported as direct design choices; lockfile absence reported as a vulnerability rather than a reproducibility risk.

**Acceptance Criteria.** Material dependencies record direction, role, source location, and confidence.

### Stage 6 — Module Discovery

**Purpose.** Identify cohesive units of code and their responsibilities without equating folders with modules.

**Inputs.** Repository map, manifests, namespaces, import graph, build targets, public interfaces.

**Actions.** Group code by independently buildable unit, package, deployable, library, or documented bounded responsibility. Inspect public APIs, exports, ownership metadata, and dependency direction. Record candidate modules where evidence is partial, and record monolithic areas rather than forcing artificial boundaries.

**Evidence Required.** Module declaration or package boundary, responsibility evidence, public interface, dependencies.

**Deliverables.** `framework.architecture.modules`.

**Failure Conditions.** Folder names alone define modules; modules split or merged to fit a preferred pattern.

**Acceptance Criteria.** Each module has a supported responsibility statement and links to its defining artifacts.

### Stage 7 — Layer Identification

**Purpose.** Identify separation between presentation, interface, application, domain, data, infrastructure, and cross-cutting concerns where the repository supports such a distinction.

**Inputs.** Module catalogue, entry points, imports, interfaces, persistence adapters, transport handlers, configuration composition.

**Actions.** Examine dependency direction and responsibility to identify actual layers. Record layer violations where a higher-level concern reaches around a boundary or business rules are embedded in transport, UI, or persistence code. Where the architecture is intentionally non-layered, state the observed organizing principle instead.

**Evidence Required.** Import and reference paths, interface boundaries, responsibility evidence, exception locations.

**Deliverables.** `framework.architecture.layers`.

**Failure Conditions.** Generic layers imposed despite contrary evidence; conventions confused with enforced boundaries.

**Acceptance Criteria.** The dominant organization and its exceptions are explained with file-level evidence.

### Stage 8 — Architecture Classification

**Purpose.** Classify the dominant architectural style while retaining mixed or transitional reality.

**Inputs.** Entry points, modules, layers, runtime components, build targets, deployment descriptors, integration map.

**Actions.** Evaluate evidence for modular monolith, layered application, microservices, service-oriented system, event-driven system, serverless system, client-heavy application, plugin platform, pipeline, or hybrid architecture. Describe the evidence threshold and competing classifications where evidence is mixed.

**Evidence Required.** Component boundaries, independent deployment or build evidence, communication paths, ownership and deployment facts.

**Deliverables.** `framework.architecture.classification`.

**Failure Conditions.** A deployment label inferred from directories; microservices claimed from multiple packages without independent runtime evidence.

**Acceptance Criteria.** Classification is qualified, evidence-linked, and does not overstate certainty.

### Stage 9 — Runtime Components

**Purpose.** Identify the processes, workloads, data stores, queues, schedulers, and clients that make up the running system.

**Inputs.** Entry-point inventory, deployment descriptors, container definitions, infrastructure code, process managers, observability configuration.

**Actions.** Catalogue long-running services, batch jobs, scheduled tasks, workers, databases, caches, queues, gateways, and clients. Record trigger, scaling clue, state ownership, communication mechanism, and lifecycle controls. Treat runtime topology as unknown when only source is available and deployment evidence is absent.

**Evidence Required.** Runtime declarations, deployment or orchestration manifests, configuration bindings.

**Deliverables.** `framework.architecture.runtime`.

**Failure Conditions.** Runtime topology invented from source imports; a library reported as a deployed service.

**Acceptance Criteria.** Every runtime claim names its declaring artifact and its evidence state.

### Stage 10 — External Integrations

**Purpose.** Identify boundaries where the system exchanges data or control with external systems.

**Inputs.** Dependency register, client code, API specifications, message schemas, configuration keys, webhooks, identity configuration, infrastructure manifests.

**Actions.** Record integration name, direction, protocol, authentication boundary, data classification if known, failure handling, and owning component. Distinguish a configured capability from an observed active integration. Identify outbound side effects and inbound trust boundaries for later security review.

**Evidence Required.** Client or adapter location, endpoint or configuration declaration, contract reference, error-handling evidence.

**Deliverables.** `framework.architecture.integrations`.

**Failure Conditions.** A package dependency alone treated as proof of an active integration; endpoint values or credentials copied into reports.

**Acceptance Criteria.** Material integrations record an evidence-linked boundary and explicit unknowns for unavailable contracts or runtime use.

### Stage 11 — Configuration Discovery

**Purpose.** Determine how behaviour varies by environment and how configuration, secrets, feature flags, and defaults are controlled.

**Inputs.** Configuration files, environment-variable references, secret mounts, templates, deployment manifests, startup code, feature-management metadata.

**Actions.** Inventory configuration sources and precedence, categorize keys by function, identify secret references without values, and trace material settings to consuming components. Detect hard-coded environment assumptions, ambiguous precedence, undocumented required configuration, and configuration crossing component boundaries.

**Evidence Required.** Key names, source paths, precedence evidence, consumer references, redacted secret-reference markers.

**Deliverables.** `framework.architecture.configuration`.

**Failure Conditions.** Secret values disclosed; example defaults presented as production facts; undocumented values guessed.

**Acceptance Criteria.** Declared defaults, environment overrides, secret references, and unknown production settings are distinguished.

### Stage 12 — Deployment Discovery

**Purpose.** Establish how components are packaged, released, configured, and operated in target environments.

**Inputs.** CI/CD workflows, container definitions, orchestration manifests, infrastructure-as-code, release scripts, environment documentation, runtime evidence.

**Actions.** Identify packaging units, image or artifact creation, deployment triggers, promotion gates, environments, orchestration targets, rollback mechanisms, and observability hooks. Separate deployment intent in documentation from active pipeline behaviour. Note absent infrastructure repositories or unavailable platform configuration as scope limitations.

**Evidence Required.** Pipeline definitions, deployment manifests, infrastructure declarations, release references, rollback evidence.

**Deliverables.** `framework.architecture.deployment`.

**Failure Conditions.** Repository-local metadata treated as a complete production topology; deployment values inferred from filenames.

**Acceptance Criteria.** Each deployment conclusion identifies source evidence and whether runtime confirmation exists.

### Stage 13 — Architecture Risks

**Purpose.** Convert supported observations into prioritized architectural risks without confusing risk with defect proof.

**Inputs.** All previous stage deliverables, risk tier, change history if supplied, operational evidence, stated constraints.

**Actions.** Identify risks involving unclear ownership, circular dependencies, boundary bypass, single points of failure, undocumented configuration, unreproducible builds, unbounded integrations, missing deployment evidence, or unsafe coupling. State cause, impact, affected evidence, likelihood rationale, confidence, and suggested next verification. Rank by potential impact and evidence strength.

**Evidence Required.** At least one observation supporting the risk and the reasoning from observation to risk.

**Deliverables.** `framework.architecture.risks`.

**Failure Conditions.** Risk claims using generic best practices without repository evidence; severity presented as certainty.

**Acceptance Criteria.** A reviewer can challenge or validate each risk from cited evidence and understands why it matters.

### Stage 14 — Evidence Consolidation

**Purpose.** Normalize and quality-check evidence so conclusions remain auditable after the session ends.

**Inputs.** Observations, command outputs, paths, revision data, documents, interviews, logs, runtime artifacts.

**Actions.** Record every evidence item with the attributes [STD-0008](../02-methodology/artifact-specification.md) R-15 requires and the provenance [STD-0007](../02-methodology/evidence-and-confidence.md) section 5 requires. Link evidence to the records it supports. Prefer path plus line range or immutable artifact reference over excerpts.

**Evidence Required.** Complete evidence attachment for every record, per STD-0008 R-14.

**Deliverables.** Evidence records within every produced artifact.

**Failure Conditions.** Conclusions citing no evidence; evidence lacking revision, source, or environment; sensitive values retained.

**Acceptance Criteria.** Each conclusion has evidence, each evidence item has provenance, and redaction does not destroy the ability to understand the claim.

### Stage 15 — Final Verification

**Purpose.** Confirm the output is internally consistent, complete for scope, and safe to consume.

**Inputs.** All artifacts, scoring worksheets, unresolved-question list.

**Actions.** Confirm every stage produced an artifact or an explicit completeness state with a reason. Confirm classifications agree with evidence, scores show their calculation, and findings distinguish observation from inference. Re-run targeted searches for high-impact unknowns. Verify no secrets or sensitive payloads remain.

**Evidence Required.** Completed verification, artifact versions, escalation record.

**Deliverables.** `framework.architecture.health`, completed and consistent artifact set.

**Failure Conditions.** Unresolved contradictions, broken evidence links, missing artifacts without a declared completeness state, unqualified claims, or sensitive-data exposure.

**Acceptance Criteria.** The artifact set is traceable, internally coherent, complete for declared scope, and ready for human review or downstream methodologies.

How this output is validated is defined by [STD-0012](../02-methodology/validation-specification.md); this methodology does not define validator behaviour.

## 10. Health Dimensions

*This section is normative.*

The scale, its meanings, the averaging guard, the escalation guard, and the partial-coverage rule are defined by [STD-0007](../02-methodology/evidence-and-confidence.md) section 13. This methodology declares only its dimensions.

Ten dimensions: modularity; boundary integrity; dependency hygiene; build reproducibility; configuration clarity; deployment clarity; runtime operability; integration governance; documentation traceability; security boundary clarity.

The lowest two levels of the scale for the purposes of the escalation guard are `0` and `1`.

## 11. Architecture Smells

*This section is informative.*

Treat a smell as a prompt for investigation, not proof of failure. Common smells include circular or bidirectional module dependencies; transport handlers containing business rules; data access shared across unrelated components; shared mutable configuration; multiple competing entry points; undocumented background jobs; runtime behaviour controlled by hidden environment state; infrastructure and application coupling without a contract; unbounded synchronous integration chains; orphan modules; copy-pasted integration adapters; and inconsistent build paths between local and CI environments.

## 12. Examples and Common Mistakes

*This section is informative.*

An observed service manifest, an independent deployment descriptor, and a client reference from another component support an observed service boundary. Several folders named `services` without deployment or invocation evidence support only an inferred organizational pattern. A missing infrastructure repository means the production topology is unknown, not single-server. A build manifest declaring a runtime is verified technology evidence; a source file with a familiar suffix is supporting observation, not proof of the active production runtime.

Common mistakes are treating documentation as runtime truth; assuming a framework convention proves a layer; scanning only application code and omitting automation or infrastructure; exposing secret values in evidence; conflating packages with deployed services; reporting absence without recording scope; treating a successful build file parse as a successful build; flattening uncertainty into a single architecture label; and providing recommendations without identifying the evidence-driven problem they address.

Do not write a generic architecture description detached from paths and artifacts. Do not use a tool's output as evidence without retaining the command, scope, and revision. Do not silently skip unreadable content. Do not manufacture diagrams implying unverified runtime links. Do not modify the repository or execute deployment actions.

## 13. Related Documents

*This section is informative.*

- [Audit Engine Bootstrap](00-bootstrap.md)
- [Database Discovery](02-database-discovery.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [Evidence and Confidence Standard](../02-methodology/evidence-and-confidence.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Metadata Specification Standard](../02-methodology/metadata-specification.md)
- [Contract Specification Standard](../02-methodology/contract-specification.md)
- [Validation Specification Standard](../02-methodology/validation-specification.md)
- [Framework Glossary](../02-methodology/glossary.md)
