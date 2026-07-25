---
id: AUD-0002
title: Architecture Discovery Methodology
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Audit Engine
tags: [audit-engine, architecture, discovery, evidence]
related: [00-bootstrap.md, 02-database-discovery.md, ../02-methodology/glossary.md, ../02-methodology/document-metadata-standard.md, ../07-roadmap/audit-engine-roadmap.md]
---

# Architecture Discovery Methodology

## 1. Executive Summary

Architecture Discovery is an evidence-led examination of a software repository and the artifacts available with it. It establishes how the system is composed, built, configured, deployed, operated, and connected to external systems. The result is a traceable architectural model, not a guess based on filenames, framework conventions, or a single configuration file.

This playbook is executable by an AI agent on any repository. It is intentionally technology-neutral: the agent discovers the technology and records the evidence before applying a classification. It does not modify source code, execute destructive commands, invent missing facts, or certify runtime behavior without runtime evidence. When access, evidence, or scope is inadequate, the correct output is an explicit unknown or escalation.

The methodology is designed to remain useful across a small library, a multi-service product, a monorepo, or a repository containing only one part of a larger system. It therefore separates three questions that are often incorrectly combined: what the repository declares, what the inspected artifacts demonstrate, and what the running system is known to do. A repository may define excellent intent while the current deployment differs; conversely, runtime records may reveal behavior that no longer appears in source. The report preserves those distinctions rather than choosing whichever source looks most convenient.

## 2. Purpose

Provide a repeatable method to produce an architecture inventory and health assessment that engineers, security reviewers, operators, and subsequent audit playbooks can rely upon. The method converts repository observations into bounded conclusions with clear confidence, provenance, and limitations.

## 3. Objectives

- Identify repository boundaries, application entry points, build systems, modules, layers, and runtime components.
- Detect technology, dependency, configuration, deployment, and integration evidence without assuming a stack.
- Classify the observed architecture and distinguish declared design from observed implementation.
- Surface architecture risks, smells, unknowns, and review questions early.
- Produce reusable evidence and a machine- and human-readable report for later audit phases.

## 4. Success Criteria

The audit succeeds when every architectural conclusion cites at least one evidence item; the report names all material unknowns; an independent reviewer can navigate from conclusion to repository location; and the output has enough scope, confidence, and version information to be reproduced against the same revision. Success does not require complete certainty: it requires honest, bounded conclusions and a documented route to resolve uncertainty.

## 5. Prerequisites

The agent needs read access to the repository tree and the revision being audited. It needs a working directory that does not alter the source tree, tools to enumerate files and search text, and permission to inspect non-secret build and deployment metadata. Optional but valuable inputs are CI logs, deployment manifests, runtime telemetry, dependency lockfiles, infrastructure repositories, and owner interviews. The agent must not expose credentials, personal data, proprietary payloads, or secret values in its report.

## 6. Inputs

Required inputs are the repository root, immutable revision identifier, audit request and scope, and an output location. Record branch name only as a convenience; commit or content digest is the reproducibility anchor. Optional inputs include architecture diagrams, build instructions, package registries, CI configuration, infrastructure-as-code, container metadata, environment-variable catalogues, API contracts, incident records, and runtime observations. Each input is logged with source, access date, and trust level.

## 7. Expected Outputs

The audit produces an architecture discovery report, repository map, technology inventory, build and entry-point inventory, module and layer map, dependency and integration register, configuration and deployment inventory, risk register, evidence ledger, health scorecard, confidence assessment, unresolved-question list, and verification checklist. Outputs identify the audited revision and never imply that unavailable artifacts were inspected.

## 8. Discovery Principles

1. **Evidence before interpretation.** Record observed paths, declarations, commands, logs, or runtime facts before assigning meaning.
2. **Least inference.** Prefer the narrowest conclusion supported by the evidence. Framework naming conventions are clues, not proof.
3. **Separation of fact and judgment.** Preserve raw observations separately from classifications, risks, and recommendations.
4. **Reproducibility.** Capture revision, paths, commands, timestamps, and tool limitations sufficient for another reviewer to repeat the audit.
5. **Safety and privacy.** Redact values of secrets and sensitive content; record a secret’s presence and control boundary, not its value.
6. **Proportional depth.** Explore code, metadata, and runtime evidence according to system impact, change rate, and uncertainty.
7. **Negative evidence is bounded.** “Not found” means not found in the searched scope using the recorded method; it never proves nonexistence.

8. **Traceability over volume.** Collect the smallest amount of evidence that allows a reviewer to verify a conclusion. A large inventory without links from claims to evidence is not an audit trail.
9. **Time awareness.** Prefer evidence from the audited revision and its contemporaneous automation or runtime records. Mark stale documents and undated diagrams as supporting context rather than authoritative confirmation.
10. **Controlled execution.** If the audit is authorized to run a build, test, or inspection command, capture the command, working directory, inputs, exit result, and relevant non-sensitive output. Execution proves only the behavior observed under those conditions.

## 9. Discovery Workflow

### Stage 1 — Repository Traversal

**Purpose.** Establish the physical audit boundary and a navigable map before evaluating individual files.

**Inputs.** Repository root, revision identifier, ignore rules, audit scope, and any linked repositories supplied by the requester.

**Actions.** Enumerate files and directories, including relevant hidden configuration. Identify repository roots, submodules, workspaces, generated-content markers, documentation, test suites, automation, infrastructure, and vendored code. Respect ignore rules while separately noting excluded material. Record inaccessible paths and symbolic links without following a link outside the authorized scope.

**Evidence Required.** Root listing, directory inventory, revision identifier, ignore configuration, and a list of excluded or inaccessible paths.

**Expected Deliverables.** Repository boundary statement, top-level map, candidate component list, and traversal log.

**Failure Conditions.** No stable revision can be identified; the root is unreadable; traversal omits known workspace roots; or generated and source material cannot be distinguished.

**Acceptance Criteria.** A reviewer can locate every top-level component, understand exclusions, and reproduce traversal against the recorded revision.

### Stage 2 — Technology Detection

**Purpose.** Identify languages, frameworks, package ecosystems, platforms, and tooling from explicit declarations.

**Inputs.** File inventory, manifests, lockfiles, build scripts, source extensions, container definitions, and CI configuration.

**Actions.** Inventory declared runtimes, compilers, package managers, frameworks, databases, and test tools. Give stronger weight to lockfiles, manifests, and executed CI definitions than to file extensions. Separate direct dependencies from transitive dependencies and separate installed tooling from active application technology.

**Evidence Required.** Paths and relevant declaration names or versions; do not copy secret registry credentials or full lockfile contents unnecessarily.

**Expected Deliverables.** Technology inventory with role, evidence, confidence, and observed version constraints.

**Failure Conditions.** Technology is asserted only from naming; incompatible manifests are silently merged; or version evidence is omitted.

**Acceptance Criteria.** Each detected technology has a source artifact and a stated role: build, test, runtime, data, deployment, or development support.

### Stage 3 — Build System Discovery

**Purpose.** Determine how source becomes testable, deployable artifacts and where that process is controlled.

**Inputs.** Manifests, task definitions, build files, CI workflows, container files, release scripts, and documentation.

**Actions.** Identify build entry commands, task graphs, generated artifacts, test gates, artifact publication, caching, versioning, and release triggers. Compare local scripts with CI definitions; report differences as observations. Detect multi-stage or multi-language builds and identify whether lockfiles or pinned toolchains support reproducibility.

**Evidence Required.** Build-definition paths, task names, CI job references, output directories, and pinned-version declarations.

**Expected Deliverables.** Build-system map, command inventory, artifact flow, and reproducibility assessment.

**Failure Conditions.** A documented command is treated as executed evidence; CI is ignored; generated outputs are mistaken for authoritative source.

**Acceptance Criteria.** The report identifies the build controller, inputs, outputs, test relationship, and unresolved execution assumptions.

### Stage 4 — Application Entry Points

**Purpose.** Find where executable behavior begins for services, clients, jobs, workers, scripts, and infrastructure automation.

**Inputs.** Build metadata, source manifests, runtime configuration, container commands, process definitions, and test harnesses.

**Actions.** Locate declared executables, handlers, main modules, command registrations, scheduler targets, server listeners, event consumers, and infrastructure apply points. Trace each entry point one level into initialization to identify configuration loading, dependency composition, and error-boundary setup. Label test-only and development-only entry points separately.

**Evidence Required.** Entry-point declaration, path, invocation context, and initialization trace.

**Expected Deliverables.** Entry-point inventory with type, trigger, owner module, and evidence links.

**Failure Conditions.** A class or module is called an entry point without an invocation path; interactive and production paths are conflated.

**Acceptance Criteria.** Every claimed deployable component has at least one observed entry point or is recorded as inferred or unknown.

### Stage 5 — Dependency Analysis

**Purpose.** Understand internal and external coupling, dependency direction, and material supply-chain exposure.

**Inputs.** Manifests, lockfiles, import graphs, service clients, plugins, generated dependency metadata, and CI caches.

**Actions.** Map direct dependencies by component, identify shared libraries, detect circular imports or prohibited directions, and distinguish compile-time, runtime, optional, and development dependencies. Identify unpinned or conflicting version constraints. Do not claim reachability of a dependency vulnerability; record only the architectural relationship unless separate security evidence exists.

**Evidence Required.** Dependency declarations, import or reference locations, lockfile evidence, and component ownership.

**Expected Deliverables.** Dependency register, coupling map, cycle findings, and supply-chain observations.

**Failure Conditions.** Transitive packages are reported as direct design choices; lockfile absence is reported as a vulnerability rather than a reproducibility risk.

**Acceptance Criteria.** Material dependencies have direction, role, source location, and confidence recorded.

### Stage 6 — Module Discovery

**Purpose.** Identify cohesive units of code and their responsibilities without equating folders with modules.

**Inputs.** Repository map, manifests, namespaces, import graph, build targets, and public interfaces.

**Actions.** Group code by independently buildable unit, package, deployable, library, or documented bounded responsibility. Inspect public APIs, exports, ownership metadata, and dependency direction. Record candidate modules where evidence is partial, and record monolithic areas rather than forcing artificial boundaries.

**Evidence Required.** Module declaration or package boundary, responsibility evidence, public interface, and dependencies.

**Expected Deliverables.** Module catalogue and responsibility map.

**Failure Conditions.** Folder names alone define modules; modules are split or merged solely to fit a preferred pattern.

**Acceptance Criteria.** Each module has a supported responsibility statement and links to its defining artifacts.

### Stage 7 — Layer Identification

**Purpose.** Identify separation between presentation, interface, application, domain, data, infrastructure, and cross-cutting concerns where the repository supports such a distinction.

**Inputs.** Module catalogue, entry points, imports, interfaces, persistence adapters, transport handlers, and configuration composition.

**Actions.** Examine dependency direction and responsibility to identify actual layers. Record layer violations when a higher-level concern reaches around a boundary or when business rules are embedded in transport, UI, or persistence code. If the architecture is intentionally non-layered, state the observed organizing principle instead.

**Evidence Required.** Import/reference paths, interface boundaries, responsibility evidence, and exception locations.

**Expected Deliverables.** Layer diagram in text or table, dependency-direction rules, and violation register.

**Failure Conditions.** Generic layers are imposed despite contrary evidence; conventions are confused with enforced boundaries.

**Acceptance Criteria.** The report explains both the dominant organization and exceptions with file-level evidence.

### Stage 8 — Architecture Classification

**Purpose.** Classify the system’s dominant architectural style while retaining mixed or transitional reality.

**Inputs.** Entry points, modules, layers, runtime components, build targets, deployment descriptors, and integration map.

**Actions.** Evaluate evidence for modular monolith, layered application, microservices, service-oriented system, event-driven system, serverless system, client-heavy application, plugin platform, pipeline, or hybrid architecture. State classification as observed, inferred, or unknown. Describe the evidence threshold and competing classifications where the evidence is mixed.

**Evidence Required.** Component boundaries, independent deployment or build evidence, communication paths, and ownership/deployment facts.

**Expected Deliverables.** Architecture classification statement, rationale, alternatives considered, and confidence.

**Failure Conditions.** A deployment label is inferred from directories; “microservices” is claimed from multiple packages without independent runtime evidence.

**Acceptance Criteria.** Classification is qualified, evidence-linked, and does not overstate certainty.

### Stage 9 — Runtime Components

**Purpose.** Identify the processes, workloads, data stores, queues, schedulers, and clients that make up the running system.

**Inputs.** Entry-point inventory, deployment descriptors, container definitions, infrastructure code, process managers, and observability configuration.

**Actions.** Catalogue long-running services, batch jobs, scheduled tasks, workers, databases, caches, queues, gateways, and clients. Record trigger, scaling clue, state ownership, communication mechanism, and lifecycle controls. Treat runtime topology as unknown when only source is available and deployment evidence is absent.

**Evidence Required.** Runtime declarations, deployment or orchestration manifests, and configuration bindings.

**Expected Deliverables.** Runtime component inventory and interaction map.

**Failure Conditions.** Runtime topology is invented from source imports; a library is reported as a deployed service.

**Acceptance Criteria.** Every runtime claim names the declaring artifact and whether it is verified, observed, inferred, or unknown.

### Stage 10 — External Integrations

**Purpose.** Identify boundaries where the system exchanges data or control with external systems.

**Inputs.** Dependency register, client code, API specifications, message schemas, configuration keys, webhooks, identity configuration, and infrastructure manifests.

**Actions.** Record integration name, direction, protocol, authentication boundary, data classification if known, failure handling, and owning component. Distinguish a configured capability from an observed active integration. Identify outbound side effects and inbound trust boundaries for later security review.

**Evidence Required.** Client or adapter location, endpoint/configuration declaration, contract reference, and error-handling evidence.

**Expected Deliverables.** Integration register and trust-boundary map.

**Failure Conditions.** A package dependency alone proves an active integration; endpoint values or credentials are copied into reports.

**Acceptance Criteria.** Material integrations have an evidence-linked boundary and explicit unknowns for unavailable contracts or runtime use.

### Stage 11 — Configuration Discovery

**Purpose.** Determine how behavior varies by environment and how configuration, secrets, feature flags, and defaults are controlled.

**Inputs.** Configuration files, environment-variable references, secret mounts, templates, deployment manifests, startup code, and feature-management metadata.

**Actions.** Inventory configuration sources and precedence, categorize keys by function, identify secret references without values, and trace material settings to consuming components. Detect hard-coded environment assumptions, ambiguous precedence, undocumented required configuration, and configuration that crosses component boundaries.

**Evidence Required.** Key names, source paths, precedence evidence, consumer references, and redacted secret-reference markers.

**Expected Deliverables.** Configuration inventory, precedence model, environment-drift risks, and secret-boundary observations.

**Failure Conditions.** Secret values are disclosed; example defaults are presented as production facts; undocumented values are guessed.

**Acceptance Criteria.** The report distinguishes declared defaults, environment overrides, secret references, and unknown production settings.

### Stage 12 — Deployment Discovery

**Purpose.** Establish how components are packaged, released, configured, and operated in target environments.

**Inputs.** CI/CD workflows, container definitions, orchestration manifests, infrastructure-as-code, release scripts, environment documentation, and runtime evidence.

**Actions.** Identify packaging units, image or artifact creation, deployment triggers, promotion gates, environments, orchestration targets, rollback mechanisms, and observability hooks. Separate deployment intent in documentation from active pipeline behavior. Note absent infrastructure repositories or unavailable platform configuration as scope limitations.

**Evidence Required.** Pipeline definitions, deployment manifests, infrastructure declarations, release references, and rollback evidence.

**Expected Deliverables.** Deployment topology, release-flow summary, environment inventory, and deployment risk register.

**Failure Conditions.** Repository-local metadata is treated as a complete production topology; deployment values are inferred from filenames.

**Acceptance Criteria.** Each deployment conclusion identifies source evidence and whether runtime confirmation exists.

### Stage 13 — Architecture Risks

**Purpose.** Convert supported observations into prioritized architectural risks without confusing risk with defect proof.

**Inputs.** All previous stage deliverables, risk tier, change history if supplied, operational evidence, and stated constraints.

**Actions.** Identify risks involving unclear ownership, circular dependencies, boundary bypass, single points of failure, undocumented configuration, unreproducible builds, unbounded integrations, missing deployment evidence, or unsafe coupling. State cause, impact, affected evidence, likelihood rationale, confidence, and suggested next verification. Rank by potential impact and evidence strength.

**Evidence Required.** At least one observation supporting the risk and a clear explanation of the reasoning from observation to risk.

**Expected Deliverables.** Architecture risk register with severity, confidence, owner candidate, and follow-up path.

**Failure Conditions.** Risk claims use generic best practices without repository evidence; severity is presented as certainty.

**Acceptance Criteria.** A reviewer can challenge or validate each risk from cited evidence and understands why it matters.

### Stage 14 — Evidence Collection

**Purpose.** Normalize, preserve, and quality-check evidence so conclusions remain auditable after the agent session ends.

**Inputs.** Observations, command outputs, paths, revision data, documents, interviews, logs, and runtime artifacts.

**Actions.** Assign every item an evidence ID, source type, repository location or external reference, observation timestamp, revision, collector, redaction state, and reliability class. Link evidence to findings and conclusions. Preserve excerpts only when necessary and safe; prefer path plus line range or immutable artifact reference.

**Evidence Required.** Complete evidence ledger and traceability links for every conclusion.

**Expected Deliverables.** Evidence ledger, provenance map, redaction record, and unresolved-evidence list.

**Failure Conditions.** Conclusions cite no evidence; evidence lacks revision or source; sensitive values are retained.

**Acceptance Criteria.** Each conclusion has evidence, each evidence item has provenance, and redaction does not destroy the ability to understand the claim.

### Stage 15 — Final Verification

**Purpose.** Confirm that the report is internally consistent, complete for scope, and safe to consume.

**Inputs.** All deliverables, evidence ledger, scoring worksheets, unresolved-question list, and required output schema.

**Actions.** Check that IDs are unique, links resolve, all stages have a result or explicit limitation, classifications agree with evidence, scores show calculations, and findings distinguish observation from inference. Re-run targeted searches for high-impact unknowns. Verify that no secrets or sensitive payloads remain and that a human reviewer can reproduce material claims.

**Evidence Required.** Completed verification checklist, report version, validation results, and sign-off or escalation record.

**Expected Deliverables.** Final architecture discovery package and an explicit statement of audit confidence and limitations.

**Failure Conditions.** Unresolved contradictions, broken evidence links, missing stages, unqualified claims, or sensitive-data exposure.

**Acceptance Criteria.** The package is traceable, internally coherent, complete for declared scope, and ready for human review or downstream playbooks.

## Architecture Smells

Treat a smell as a prompt for investigation, not proof of failure. Common smells include circular or bidirectional module dependencies; transport handlers that contain business rules; data access shared across unrelated components; shared mutable configuration; multiple competing entry points; undocumented background jobs; runtime behavior controlled by hidden environment state; infrastructure and application coupling without a contract; unbounded synchronous integration chains; orphan modules; copy-pasted integration adapters; and inconsistent build paths between local and CI environments. Report the observation, affected boundary, probable consequence, and evidence confidence.

## Examples

An observed `service` manifest, an independent deployment descriptor, and a client reference from another component support an **observed** service boundary. Several folders named `services` without deployment or invocation evidence support only an **inferred** organizational pattern. A missing infrastructure repository means the production topology is **unknown**, not “single-server.” A build manifest declaring a runtime is **verified** technology evidence; a source file using a familiar suffix is supporting observation, not proof of the active production runtime.

## Health Scoring

Score each dimension from 0 to 5 and retain the evidence and confidence for every score. A score is an assessment, not a substitute for the underlying findings.

| Score | Meaning |
| --- | --- |
| 5 | Clear, evidence-backed design; boundaries are consistently implemented and operable. |
| 4 | Sound design with minor, bounded inconsistencies and documented controls. |
| 3 | Adequate but material gaps, ambiguity, or manual dependence exist. |
| 2 | Significant boundary, operability, or maintainability risk is evidenced. |
| 1 | Pervasive architectural weakness or control failure is evidenced. |
| 0 | No reliable evidence exists, or the dimension is critically unfit for its stated use. |

Assess modularity, boundary integrity, dependency hygiene, build reproducibility, configuration clarity, deployment clarity, runtime operability, integration governance, documentation traceability, and security boundary clarity. The overall score is the arithmetic mean only when every dimension has confidence of Medium or High; otherwise report a score range and prominently list low-confidence dimensions. Never average away a critical risk: any dimension scored 0 or 1 requires an escalation.

## Confidence Scoring

Classify conclusions as High, Medium, or Low confidence. High confidence has direct, current, corroborated evidence such as a manifest plus invocation or runtime record. Medium confidence has direct but incomplete evidence or consistent evidence from one reliable source. Low confidence rests on indirect indicators, stale documentation, or an unresolved contradiction. Confidence measures evidence quality, not risk severity. A high-severity, low-confidence finding requires verification rather than dismissal.

## Evidence Standards

Every conclusion must reference observed evidence. Use these evidence states precisely:

| State | Meaning | Permitted language |
| --- | --- | --- |
| Verified | Directly confirmed by authoritative, reproducible evidence or successful authorized execution. | “Verified” |
| Observed | Present in inspected artifact or output, but operational effect is not independently confirmed. | “Observed” |
| Inferred | Reasoned from one or more observations; assumptions are stated. | “Inferred” |
| Unknown | Evidence is absent, inaccessible, conflicting, or out of scope. | “Unknown” |

Evidence must include ID, source, location, revision or timestamp, collector, and redaction status. A report may quote a minimal safe excerpt but should prefer immutable location references. Do not infer architecture without supporting evidence, and never promote an inferred conclusion to verified status merely because it is plausible.

When evidence conflicts, retain both items and describe the conflict rather than selecting an answer by preference. For example, a deployment guide may describe a single service while current orchestration manifests declare multiple workloads. The appropriate conclusion is that the repository contains conflicting deployment evidence, with separate reliability assessments for each source. Evidence can expire when configuration, code, ownership, or deployment changes; record the freshness limitation and request newer evidence when it affects a material conclusion.

## Reporting Format

Publish a concise executive report plus structured appendices. The executive report contains scope, revision, classification, key components, top risks, health and confidence summaries, and escalation decisions. Appendices contain the repository map, technology and build inventories, entry points, modules and layers, runtime and integration registers, configuration and deployment inventories, risk register, evidence ledger, unknowns, and verification checklist. Every finding uses: finding ID, statement, evidence IDs, state, confidence, impact, affected components, and recommended next action.

Use neutral language in the report. “The audit observed” describes a source fact; “the audit infers” describes a reasoned interpretation; “the audit could not determine” records an evidence limitation. Recommendations must be framed as actions a named owner can validate, such as obtaining the missing deployment manifest, documenting a configuration precedence rule, or separating an unbounded integration boundary. They must not claim that a refactor is required unless the evidence and decision owner support that conclusion.

## Common Mistakes

Common mistakes are treating documentation as runtime truth; assuming a framework convention proves a layer; scanning only application code and omitting automation or infrastructure; exposing secret values in evidence; conflating packages with deployed services; reporting absence without recording scope; treating a successful build file parse as a successful build; flattening uncertainty into a single architecture label; and providing recommendations without identifying the evidence-driven problem they address.

## Anti-patterns

Do not write a generic architecture description detached from paths and artifacts. Do not use a tool’s output as evidence without retaining the command, scope, and revision. Do not silently skip unreadable content. Do not manufacture diagrams that imply unverified runtime links. Do not score a dimension solely because it follows an industry pattern. Do not turn this playbook into an implementation task, modify the repository, or execute deployment actions.

## Escalation Rules

Escalate immediately when the audit encounters secrets, personal or regulated data, unauthorized access boundaries, evidence of active compromise, a likely high-impact production defect, or conflicting architecture evidence that could change a critical decision. Escalate to a human owner when runtime topology, deployment controls, or data classification cannot be determined from authorized sources and materially affects the assessment. Mark the related conclusion Unknown or Low confidence; do not block the entire report unless safe continuation is impossible.

## Human Review Checklist

- Confirm the audit scope, revision, exclusions, and access limitations.
- Review architecture classification, high-impact risks, scores, and low-confidence conclusions.
- Validate that ownership and deployment assertions match organizational knowledge.
- Confirm secret redaction and data-handling appropriateness.
- Decide whether escalations require security, operations, data, or product review.
- Accept, challenge, or request verification for each material finding.

## AI Verification Checklist

- Confirm all fifteen stages contain findings or an explicit Unknown with scope reason.
- Confirm every conclusion cites evidence and uses a valid evidence state.
- Confirm IDs, links, scores, calculations, and report revision are consistent.
- Confirm direct observations are not worded as runtime verification unless authorized runtime evidence exists.
- Confirm technology, component, and integration inventories distinguish declared, observed, inferred, and unknown facts.
- Confirm output contains no secret values, sensitive payloads, invented ownership, or repository-specific assumptions.

## Repository Health Impact

Architecture Discovery establishes the architectural portion of Repository Health. It measures whether the repository communicates reliable boundaries, reproducible build intent, controlled configuration, operable deployment intent, and traceable integration behavior. Its score is an input to broader repository health; it must be combined with database, frontend, backend, security, workflow, and runtime-verification playbooks before making a whole-repository fitness decision.

## Outputs Generated

1. Architecture Discovery Report.
2. Repository Boundary and Traversal Map.
3. Technology, Build, Entry-Point, Module, Layer, Runtime, Integration, Configuration, and Deployment Inventories.
4. Architecture Classification Statement and Component Interaction Map.
5. Architecture Risk and Smell Register.
6. Evidence Ledger and Provenance Map.
7. Health Scorecard, Confidence Assessment, Unknowns Register, and Escalation Record.
8. Human Review Checklist and AI Verification Checklist.

## Related Documents

- [Audit Engine Bootstrap](00-bootstrap.md)
- [Database Discovery](02-database-discovery.md)
- [Framework Glossary](../02-methodology/glossary.md)
- [Document Metadata Standard](../02-methodology/document-metadata-standard.md)
- [Audit Engine Product Specification](../07-roadmap/audit-engine-roadmap.md)
