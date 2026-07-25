---
id: AUD-0004
title: Frontend Discovery Methodology
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-26
review_cycle: Annual
category: Audit Engine
tags: [audit-engine, frontend, discovery, methodology]
related: [01-architecture-discovery.md, 04-backend-discovery.md, 05-business-workflow-discovery.md, ../02-methodology/glossary.md, ../09-capabilities/CAP-0001-repository-audit.md]
object_type: Methodology
layer: 1
depends_on: [../02-methodology/evidence-and-confidence.md, ../02-methodology/artifact-specification.md, ../02-methodology/metadata-specification.md, ../02-methodology/contract-specification.md, ../02-methodology/validation-specification.md, ../04-development/security-standard.md]
references: [01-architecture-discovery.md, 04-backend-discovery.md, 05-business-workflow-discovery.md, ../09-capabilities/CAP-0001-repository-audit.md, ../02-methodology/glossary.md]
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

# Frontend Discovery Methodology

## 1. Purpose and Scope

*This section is informative.*

Frontend Discovery is an evidence-led examination of the user-facing surfaces a repository defines: what clients exist, how a user reaches each part of them, what those parts render, where their data comes from, and what the shipped client exposes to anyone who inspects it.

The methodology is technology-neutral. It applies to browser applications, mobile clients, desktop applications, terminal interfaces, and embedded views, and it discovers the client technology before applying any classification to it.

It separates three questions that source reading alone cannot separate: what the client declares, what the built bundle contains, and what a user of the deployed client can reach. A route defined in source may be unreachable behind a feature flag; a view removed from navigation may remain addressable by URL; a value stripped from source may survive in a committed build output. The distinction is preserved rather than resolved by convenience.

**This methodology consumes the framework standards and does not restate them.** Evidence states, confidence levels, scoring principles, completeness semantics, artifact structure, participant obligations, and validation behaviour are defined by the standards listed in section 3. Only frontend-specific process is defined here.

## 2. Capability Declaration

*This section is normative.*

This methodology is a constituent of [CAP-0001 Repository Audit](../09-capabilities/CAP-0001-repository-audit.md), where it consumes architecture artifacts and supplies surface, routing, and exposure evidence to business-workflow discovery, feature inventory, security and permissions, and gap analysis.

**Executor type.** Human, agent, or either.

**Safety boundaries.** The executor MUST NOT modify the subject, execute destructive commands, submit data through a client to a live system, authenticate as a real user, or reproduce secret values, credentials, endpoints, or record content. Where the audit is authorized to build the client or run it locally, it records the command, working directory, inputs, exit result, and non-sensitive output; execution proves only the behaviour observed under those conditions.

## 3. Standards Consumed

*This section is normative.*

| Standard | What this methodology takes from it |
| --- | --- |
| [STD-0007](../02-methodology/evidence-and-confidence.md) | Evidence states and their meanings; provenance and attributability; evidence quality and freshness; the confidence model; completeness semantics; promotion and degradation; uncertainty propagation; scoring principles and the 0-to-5 scale |
| [STD-0008](../02-methodology/artifact-specification.md) | Artifact structure, envelope, record and evidence attachment points, artifact type definition and versioning |
| [STD-0010](../02-methodology/metadata-specification.md) | Metadata representation for every declaration this methodology makes or its artifacts carry |
| [STD-0011](../02-methodology/contract-specification.md) | Producer obligations, preconditions, guaranteed outputs, failure conditions, and their mapping to completeness states |
| [STD-0012](../02-methodology/validation-specification.md) | How conformance is evaluated, reported, and enforced; validation classes and outcomes |
| [STD-0006](../04-development/security-standard.md) | Secret-handling terminology and the prohibition on disclosing credential values found in client code or build output |

No definition here overrides a standard. Any apparent conflict is a defect in this document.

## 4. Inputs

*This section is normative.*

**Required.** Repository root; immutable revision identifier; audit request and declared scope; output location outside the subject; authorization boundary.

**Optional.** Client build configuration; route definitions; component libraries and design-system packages; state-management configuration; API client definitions; internationalization catalogues; accessibility test output; committed build output; content-security-policy declarations; analytics configuration; feature-flag definitions; design documentation; browser or device support matrices; authorized screenshots of a non-production environment.

Each input is logged with source, access date, environment, and trust level. Absence of an optional input lowers achievable confidence and does not lower a score, per [STD-0011](../02-methodology/contract-specification.md) R-22.

**Consumed artifact types.** `framework.architecture.scope`, `framework.architecture.technology`, `framework.architecture.entrypoints`, `framework.architecture.modules`, `framework.architecture.configuration`, `framework.architecture.integrations`. The dependency is on these types, never on the methodology that produced them.

## 5. Preconditions

*This section is normative.*

Read access to the repository tree at a stable revision; a working location outside the subject; tools to enumerate files and search text; permission to inspect non-secret client build and configuration metadata; a declared authorization boundary; and a named recipient for escalations.

Where a precondition is unmet the methodology is not invoked and the affected artifact types are recorded unavailable, per [STD-0011](../02-methodology/contract-specification.md) R-16 and R-17.

Where the subject declares no user-facing client, the methodology emits its artifact types with completeness `NotApplicable` and a recorded reason. It does not emit an empty `Complete` set, and the result does not lower a score.

## 6. Artifact Types Produced

*This section is normative.*

Ten artifact types. Their structure conforms to [STD-0008](../02-methodology/artifact-specification.md); each type definition declares the sixteen sections that standard requires.

| Type | Content |
| --- | --- |
| `framework.frontend.surface` | Client applications with platform, target environment, build unit, owning module, and declared support matrix |
| `framework.frontend.routing` | Route inventory with path, parameters, guard, entry component, reachability evidence, and unreferenced-route findings |
| `framework.frontend.components` | Component catalogue with responsibility evidence, public props or inputs, measured import count, and design-system membership |
| `framework.frontend.state` | State containers with scope, ownership, persistence, synchronization mechanism, and cross-boundary sharing findings |
| `framework.frontend.dataflow` | Client-to-service call sites with target interface, trigger, caching, error handling, and optimistic-update behaviour |
| `framework.frontend.assets` | Bundle inventory with size evidence, code-splitting boundaries, static asset origins, and committed build-output findings |
| `framework.frontend.accessibility` | Accessibility observations with the standard referenced, evidence location, and the distinction between automated and inspected findings |
| `framework.frontend.exposure` | Values, endpoints, identifiers, and logic reachable in the shipped client, recorded with redaction markers and never with values |
| `framework.frontend.risks` | Frontend risk register with cause, impact, evidence, likelihood rationale, confidence, and follow-up |
| `framework.frontend.health` | Health scores per dimension with evidence, confidence, and calculation |

Downstream methodologies depend on these **types**, never on this methodology, per [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md).

## 7. Guaranteed Outputs

*This section is normative.*

This methodology guarantees, for each declared type: that an artifact of that type is emitted; that it conforms to the type at the declared version; that its completeness state is declared; and that its provenance is recorded. It guarantees no finding and no property of the subject, per [STD-0011](../02-methodology/contract-specification.md) R-23 and R-24.

Where a stage cannot be performed, its artifact carries the completeness state that [STD-0011](../02-methodology/contract-specification.md) section 10 maps to the failure, with the disclosure that section requires.

## 8. Discovery Principles

*This section is normative.*

These are frontend-specific. General evidence discipline is STD-0007's and is not repeated.

1. **Reachability is evidence, not inference.** A defined route is evidence that a route exists. Only a navigation reference, a link, a redirect, or an observed load is evidence that a user reaches it.
2. **The bundle is the artifact the user receives.** Where build output is available, it outranks source for questions about what the client exposes. Source is evidence of intent.
3. **A guard in the client is not an authorization control.** Client-side checks are recorded as user-experience behaviour. Whether authorization is enforced is established by backend and security discovery, not here.
4. **Component reuse is measured, not assumed.** A shared directory is a location. Reuse is an import count with paths.
5. **Declared support is not tested support.** A browser or device matrix is a declaration until test or runtime evidence confirms it.

## 9. Discovery Workflow

*This section is normative.*

Eleven stages. Each declares purpose, inputs, actions, required evidence, deliverables, failure conditions, and acceptance criteria. Every conclusion carries an evidence state and confidence per [STD-0007](../02-methodology/evidence-and-confidence.md).

### Stage 1 — Surface Identification

**Purpose.** Establish which distinct clients exist and what each targets, before examining any of them.

**Inputs.** `framework.architecture.scope`, `framework.architecture.entrypoints`, build manifests, platform project files, package definitions.

**Actions.** Identify each independently built or independently delivered client. Record its platform, target environment, build unit, owning module, and declared support matrix. Separate a client from a shared library it consumes, and separate a demonstration or component-workshop surface from a delivered one.

**Evidence Required.** Build manifest path, entry declaration, platform target declaration, delivery evidence.

**Deliverables.** `framework.frontend.surface`.

**Failure Conditions.** A component library reported as a client; a demonstration surface counted as delivered; multiple clients merged because they share a repository.

**Acceptance Criteria.** Each identified client names its build unit and its delivery target, and shared libraries are distinguished from clients.

### Stage 2 — Route and Navigation Discovery

**Purpose.** Establish the addressable surface of each client and how a user reaches each part of it.

**Inputs.** Route definitions, router configuration, navigation components, redirect rules, deep-link declarations, server-side rendering configuration.

**Actions.** Inventory routes with path, parameters, guard, entry component, and lazy-loading boundary. Trace each route to at least one navigation reference. Record routes with no inbound reference as addressable but unreferenced. Record dynamically constructed routes separately, recording the construction site rather than guessing the resulting paths.

**Evidence Required.** Route declaration path, navigation reference path, guard declaration, redirect rule.

**Deliverables.** `framework.frontend.routing`.

**Failure Conditions.** Routes enumerated from directory structure alone in a router that requires explicit registration; an unreferenced route reported as removed; constructed paths invented.

**Acceptance Criteria.** Each route records its declaring artifact and either a navigation reference or an explicit unreferenced finding.

### Stage 3 — Component Discovery

**Purpose.** Identify the units the client renders and what each is responsible for, without equating files with components.

**Inputs.** Component sources, export declarations, design-system packages, style modules, story or fixture files.

**Actions.** Catalogue components by declaration, recording responsibility evidence, public props or inputs, and import count. Identify design-system membership and distinguish it from local reimplementation of the same visual element. Record components with no importer as unreferenced. Record the boundary between presentational and data-fetching components where the repository supports the distinction.

**Evidence Required.** Component declaration path, export declaration, importer paths, prop or input declaration.

**Deliverables.** `framework.frontend.components`.

**Failure Conditions.** File count reported as component count; a naming convention treated as proof of a presentational boundary; duplication reported as reuse.

**Acceptance Criteria.** Each catalogued component has a supported responsibility statement, a public interface, and a measured import count.

### Stage 4 — State Discovery

**Purpose.** Determine where client state lives, who owns it, and how it is kept consistent.

**Inputs.** State-management configuration, store definitions, context providers, local storage and cookie references, cache configuration, subscription setup.

**Actions.** Identify state containers with scope, owner, persistence mechanism, and lifetime. Record which components read and which write each container. Identify persisted state and its storage medium without reading stored values. Record state duplicated across containers, and state synchronized by manual copying, as findings rather than as defects.

**Evidence Required.** Store or provider declaration path, reader and writer paths, persistence-call location, cache configuration.

**Deliverables.** `framework.frontend.state`.

**Failure Conditions.** A library dependency reported as a state architecture without store evidence; persisted record values copied into the artifact; a server-side cache confused with client state.

**Acceptance Criteria.** Each state container records its scope, its owner, and at least one reader or writer with a path.

### Stage 5 — Data Flow Discovery

**Purpose.** Establish how the client obtains and submits data, and what it does when that fails.

**Inputs.** API client definitions, generated clients, request call sites, query configuration, socket or stream setup, `framework.architecture.integrations`.

**Actions.** Record each call site with target interface, trigger, request shape reference, caching policy, retry behaviour, and error handling. Distinguish a generated client bound to a contract from an ad-hoc request constructed inline. Record optimistic updates and the reconciliation path. Do not record endpoint values; record the configuration key or contract reference that supplies them.

**Evidence Required.** Call-site path, target interface reference, error-handling location, caching declaration.

**Deliverables.** `framework.frontend.dataflow`.

**Failure Conditions.** Endpoint values or tokens copied into the artifact; a client library dependency treated as proof of an active call; error handling assumed from framework defaults without a handler.

**Acceptance Criteria.** Each material call site names its target interface and either its error handling or an explicit absence finding.

### Stage 6 — Asset and Build Output Discovery

**Purpose.** Establish what is shipped to the user and how it is divided.

**Inputs.** Bundler configuration, build output where available, static asset directories, content-delivery configuration, source-map declarations.

**Actions.** Record bundle units, code-splitting boundaries, and size evidence where the build was run or output is committed. Identify static asset origins and third-party scripts loaded at runtime. Record committed build output as a finding, because it changes what the repository discloses. Record source-map publication as an observation about disclosure rather than as a defect.

**Evidence Required.** Bundler configuration path, output path, size measurement with the command that produced it, third-party script declaration.

**Deliverables.** `framework.frontend.assets`.

**Failure Conditions.** Bundle sizes asserted without a build; configuration presented as measurement; a development build reported as the shipped artifact.

**Acceptance Criteria.** Every size or content claim about the bundle names the build that produced it and the conditions under which it ran.

### Stage 7 — Accessibility Observation

**Purpose.** Record supported accessibility observations without claiming a conformance verdict the audit did not establish.

**Inputs.** Component markup, semantic element usage, label and role declarations, keyboard handlers, focus management, automated accessibility test output where supplied.

**Actions.** Record observations against a named standard, identifying the standard and version referenced. Separate findings produced by an automated tool from findings produced by inspection, recording tool identity, version, and scope for the former. Record the absence of accessibility testing as a scope limitation rather than as a failure.

**Evidence Required.** Markup or handler path, standard reference, tool identity and version where automated.

**Deliverables.** `framework.frontend.accessibility`.

**Failure Conditions.** A conformance level claimed from partial automated output; the absence of a tool reported as the absence of accessibility; manual and automated findings merged without attribution.

**Acceptance Criteria.** Each observation names its standard, its evidence location, and whether it was automated or inspected.

### Stage 8 — Client Exposure Analysis

**Purpose.** Establish what an inspector of the shipped client can learn, which is a property of the client rather than of the server.

**Inputs.** Build output, embedded configuration, environment-variable inlining, client-side guards, identifiers surviving minification, source maps.

**Actions.** Identify configuration values inlined into the client, internal endpoints and identifiers reachable in the bundle, business logic implemented client-side, and administrative surfaces gated only by client checks. Record each with a redaction marker and a location. Never record the value.

**Evidence Required.** Location within source or build output, inlining mechanism, redaction marker, gating evidence where a surface is client-gated.

**Deliverables.** `framework.frontend.exposure`.

**Failure Conditions.** A secret value reproduced in the artifact; a client-side guard reported as an authorization control; exposure asserted from source when build output was available and not examined.

**Acceptance Criteria.** Each exposure finding records a location and a class, discloses no value, and states whether it was established from source or from build output.

### Stage 9 — Frontend Risks

**Purpose.** Convert supported observations into prioritized frontend risks without confusing risk with defect proof.

**Inputs.** All previous stage deliverables, risk tier, operational evidence, stated constraints.

**Actions.** Identify risks involving unreferenced but addressable routes, client-only enforcement of business rules, inlined configuration, unbounded bundle growth, duplicated state with manual synchronization, ad-hoc requests bypassing a contract, and untested support claims. State cause, impact, affected evidence, likelihood rationale, confidence, and suggested next verification. Rank by potential impact and evidence strength.

**Evidence Required.** At least one observation supporting the risk and the reasoning from observation to risk.

**Deliverables.** `framework.frontend.risks`.

**Failure Conditions.** Risk claims using generic best practices without repository evidence; severity presented as certainty; a security verdict issued in place of a structural finding.

**Acceptance Criteria.** A reviewer can challenge or validate each risk from cited evidence and understands why it matters.

### Stage 10 — Evidence Consolidation

**Purpose.** Normalize and quality-check evidence so conclusions remain auditable after the session ends.

**Inputs.** Observations, command outputs, paths, revision data, build output references, tool reports.

**Actions.** Record every evidence item with the attributes [STD-0008](../02-methodology/artifact-specification.md) R-15 requires and the provenance [STD-0007](../02-methodology/evidence-and-confidence.md) section 5 requires. Link evidence to the records it supports. Where an observation came from build output rather than source, attribute the environment per record, per [STD-0008](../02-methodology/artifact-specification.md) R-42.

**Evidence Required.** Complete evidence attachment for every record, per STD-0008 R-14.

**Deliverables.** Evidence records within every produced artifact.

**Failure Conditions.** Conclusions citing no evidence; evidence lacking revision, source, or environment; sensitive values retained; source-derived and build-derived observations attributed identically.

**Acceptance Criteria.** Each conclusion has evidence, each evidence item has provenance, and redaction does not destroy the ability to understand the claim.

### Stage 11 — Final Verification

**Purpose.** Confirm the output is internally consistent, complete for scope, and safe to consume.

**Inputs.** All artifacts, scoring worksheets, unresolved-question list.

**Actions.** Confirm every stage produced an artifact or an explicit completeness state with a reason. Confirm the routing, component, and data-flow artifacts agree with one another, and that no route references a component absent from the catalogue. Confirm scores show their calculation. Verify no secrets or record values remain.

**Evidence Required.** Completed verification, artifact versions, escalation record.

**Deliverables.** `framework.frontend.health`, completed and consistent artifact set.

**Failure Conditions.** Unresolved contradictions, broken evidence links, missing artifacts without a declared completeness state, or sensitive-data exposure.

**Acceptance Criteria.** The artifact set is traceable, internally coherent, complete for declared scope, and ready for human review or downstream methodologies.

How this output is validated is defined by [STD-0012](../02-methodology/validation-specification.md); this methodology does not define validator behaviour.

## 10. Health Dimensions

*This section is normative.*

The scale, its meanings, the averaging guard, the escalation guard, and the partial-coverage rule are defined by [STD-0007](../02-methodology/evidence-and-confidence.md) section 13. This methodology declares only its dimensions.

Nine dimensions: surface clarity; routing integrity; component cohesion; state ownership clarity; data-flow discipline; asset discipline; accessibility evidence; client exposure control; documentation traceability.

The lowest two levels of the scale for the purposes of the escalation guard are `0` and `1`.

## 11. Frontend Smells

*This section is informative.*

Treat a smell as a prompt for investigation, not proof of failure. Common smells include routes reachable only by typed address; business rules implemented in components and nowhere else; a state container written by many components and owned by none; request construction repeated inline instead of through a client; a design system imported alongside local reimplementations of the same element; configuration inlined at build time and treated as private; build output committed to the repository; a support matrix with no corresponding test target; components whose props grow to accommodate unrelated callers; and error handling that renders a generic message and discards the cause.

## 12. Examples and Common Mistakes

*This section is informative.*

A route declaration, a navigation link from a rendered menu, and a guard referencing a session check together support an observed reachable route. A file in a routes directory, in a router that requires explicit registration, supports only an inferred route. A component in a shared directory with one importer is not reuse; it is a component that happens to live in a shared directory. An administrative view whose only gate is a client-side role check is an observed client behaviour and an unknown authorization posture, and it is recorded as both.

Common mistakes are counting files as components; reporting bundle sizes from configuration; treating a client-side guard as an access control; enumerating routes from directory names under a router that does not use them; reproducing an inlined key in an exposure finding; reporting the absence of accessibility tooling as an accessibility failure; merging automated and inspected findings; and describing a client architecture without naming a single build unit.

Do not submit data through a client to any live system. Do not authenticate as a real user. Do not modify the subject. Do not present a development build as the shipped artifact.

## 13. Related Documents

*This section is informative.*

- [Architecture Discovery](01-architecture-discovery.md)
- [Backend Discovery](04-backend-discovery.md)
- [Business Workflow Discovery](05-business-workflow-discovery.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [Evidence and Confidence Standard](../02-methodology/evidence-and-confidence.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Metadata Specification Standard](../02-methodology/metadata-specification.md)
- [Contract Specification Standard](../02-methodology/contract-specification.md)
- [Validation Specification Standard](../02-methodology/validation-specification.md)
- [Security Standard](../04-development/security-standard.md)
- [Framework Glossary](../02-methodology/glossary.md)
