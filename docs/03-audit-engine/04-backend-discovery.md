---
id: AUD-0005
title: Backend Discovery Methodology
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-26
review_cycle: Annual
category: Audit Engine
tags: [audit-engine, backend, services, discovery, methodology]
related: [01-architecture-discovery.md, 02-database-discovery.md, 03-frontend-discovery.md, 05-business-workflow-discovery.md, ../02-methodology/glossary.md, ../09-capabilities/CAP-0001-repository-audit.md]
object_type: Methodology
layer: 1
depends_on: [../02-methodology/evidence-and-confidence.md, ../02-methodology/artifact-specification.md, ../02-methodology/metadata-specification.md, ../02-methodology/contract-specification.md, ../02-methodology/validation-specification.md, ../04-development/reliability-standard.md]
references: [01-architecture-discovery.md, 02-database-discovery.md, 03-frontend-discovery.md, 05-business-workflow-discovery.md, ../09-capabilities/CAP-0001-repository-audit.md, ../02-methodology/glossary.md]
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

# Backend Discovery Methodology

## 1. Purpose and Scope

*This section is informative.*

Backend Discovery is an evidence-led examination of the server-side surface a repository defines: which services exist, what interfaces they expose, what contracts those interfaces promise, how work is executed and scheduled, how failure is handled, and where the trust boundary between caller and implementation is drawn.

The methodology is technology-neutral. It applies to request-response services, message consumers, scheduled jobs, serverless functions, and long-running workers, and it discovers the execution model before applying any classification to it.

It separates the interface a service declares from the behaviour its implementation demonstrates. A route registered in a framework may have no handler body; a documented contract may not match the schema the code validates; a retry policy declared in configuration may be overridden at the call site. The distinction is preserved rather than resolved by convenience.

**This methodology consumes the framework standards and does not restate them.** Evidence states, confidence levels, scoring principles, completeness semantics, artifact structure, participant obligations, and validation behaviour are defined by the standards listed in section 3. Only backend-specific process is defined here.

## 2. Capability Declaration

*This section is normative.*

This methodology is a constituent of [CAP-0001 Repository Audit](../09-capabilities/CAP-0001-repository-audit.md), where it consumes architecture and database artifacts and supplies interface, execution, and boundary evidence to business-workflow discovery, feature inventory, security and permissions, operations, and gap analysis.

**Executor type.** Human, agent, or either.

**Safety boundaries.** The executor MUST NOT modify the subject, execute destructive commands, call a live service endpoint, enqueue a message to a live broker, or reproduce secret values, credentials, endpoints, or record content. Where the audit is authorized to run a service locally or execute its test suite, it records the command, working directory, inputs, exit result, and non-sensitive output; execution proves only the behaviour observed under those conditions.

## 3. Standards Consumed

*This section is normative.*

| Standard | What this methodology takes from it |
| --- | --- |
| [STD-0007](../02-methodology/evidence-and-confidence.md) | Evidence states and their meanings; provenance and attributability; evidence quality and freshness; the confidence model; completeness semantics; promotion and degradation; uncertainty propagation; scoring principles and the 0-to-5 scale |
| [STD-0008](../02-methodology/artifact-specification.md) | Artifact structure, envelope, record and evidence attachment points, artifact type definition and versioning |
| [STD-0010](../02-methodology/metadata-specification.md) | Metadata representation for every declaration this methodology makes or its artifacts carry |
| [STD-0011](../02-methodology/contract-specification.md) | Producer obligations, preconditions, guaranteed outputs, failure conditions, and their mapping to completeness states |
| [STD-0012](../02-methodology/validation-specification.md) | How conformance is evaluated, reported, and enforced; validation classes and outcomes |
| [STD-0005](../04-development/reliability-standard.md) | Terminology for timeout, retry, idempotency, degradation, and failure-handling posture |

No definition here overrides a standard. Any apparent conflict is a defect in this document.

## 4. Inputs

*This section is normative.*

**Required.** Repository root; immutable revision identifier; audit request and declared scope; output location outside the subject; authorization boundary.

**Optional.** Interface specifications; generated server stubs; message and event schemas; routing and middleware configuration; scheduler and queue definitions; transaction and connection configuration; retry and timeout policy; test suites exercising interfaces; service documentation; client libraries published for consumers; incident records; authorized read-only runtime observations from a non-production environment.

Each input is logged with source, access date, environment, and trust level. Absence of an optional input lowers achievable confidence and does not lower a score, per [STD-0011](../02-methodology/contract-specification.md) R-22.

**Consumed artifact types.** `framework.architecture.scope`, `framework.architecture.technology`, `framework.architecture.entrypoints`, `framework.architecture.modules`, `framework.architecture.runtime`, `framework.architecture.integrations`, `framework.database.entities`, `framework.database.connections`. The dependency is on these types, never on the methodology that produced them.

## 5. Preconditions

*This section is normative.*

Read access to the repository tree at a stable revision; a working location outside the subject; tools to enumerate files and search text; permission to inspect non-secret service, routing, and scheduling metadata; a declared authorization boundary; and a named recipient for escalations.

Where a precondition is unmet the methodology is not invoked and the affected artifact types are recorded unavailable, per [STD-0011](../02-methodology/contract-specification.md) R-16 and R-17.

Where the subject declares no server-side component, the methodology emits its artifact types with completeness `NotApplicable` and a recorded reason.

## 6. Artifact Types Produced

*This section is normative.*

Ten artifact types. Their structure conforms to [STD-0008](../02-methodology/artifact-specification.md); each type definition declares the sixteen sections that standard requires.

| Type | Content |
| --- | --- |
| `framework.backend.services` | Service inventory with deployment unit, owning module, execution model, state ownership, and lifecycle controls |
| `framework.backend.interfaces` | Exposed operations with protocol, address form, method, handler location, authentication requirement, and caller evidence |
| `framework.backend.contracts` | Request and response shapes, schema authority, validation location, versioning strategy, and specification-to-implementation divergence findings |
| `framework.backend.execution` | Synchronous, asynchronous, scheduled, and event-driven execution paths with trigger, concurrency controls, ordering guarantees, and idempotency evidence |
| `framework.backend.dataaccess` | Access paths from service to store with owning entity, transaction boundary, isolation declaration, and shared-store findings |
| `framework.backend.resilience` | Timeout, retry, backoff, circuit-breaking, rate-limiting, and degradation behaviour with declaration site and override findings |
| `framework.backend.errors` | Error taxonomy, propagation paths, client-visible failure shapes, and swallowed-error findings |
| `framework.backend.boundaries` | Trust boundaries with the component that enforces each, the check performed, and unenforced-boundary findings |
| `framework.backend.risks` | Backend risk register with cause, impact, evidence, likelihood rationale, confidence, and follow-up |
| `framework.backend.health` | Health scores per dimension with evidence, confidence, and calculation |

Downstream methodologies depend on these **types**, never on this methodology, per [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md).

## 7. Guaranteed Outputs

*This section is normative.*

This methodology guarantees, for each declared type: that an artifact of that type is emitted; that it conforms to the type at the declared version; that its completeness state is declared; and that its provenance is recorded. It guarantees no finding and no property of the subject, per [STD-0011](../02-methodology/contract-specification.md) R-23 and R-24.

Where a stage cannot be performed, its artifact carries the completeness state that [STD-0011](../02-methodology/contract-specification.md) section 10 maps to the failure, with the disclosure that section requires.

## 8. Discovery Principles

*This section is normative.*

These are backend-specific. General evidence discipline is STD-0007's and is not repeated.

1. **A registered route is not an implemented operation.** Registration is evidence that an address exists. A handler body, a test, or an observed call is evidence that it does something.
2. **The validating code is the contract.** Where a specification and an implementation disagree, both are recorded, and the divergence is the finding. Neither is silently preferred.
3. **Declared policy is not applied policy.** A timeout, retry, or isolation level declared in configuration is evidence of intent. Only a call site or an observed execution shows what applied.
4. **Enforcement has a location.** An authorization or validation claim names the component and the line that performs the check, or it is recorded as unknown.
5. **Asynchronous work is work.** A queue consumer, a scheduled job, and a request handler are all execution paths and are inventoried on equal terms.

## 9. Discovery Workflow

*This section is normative.*

Eleven stages. Each declares purpose, inputs, actions, required evidence, deliverables, failure conditions, and acceptance criteria. Every conclusion carries an evidence state and confidence per [STD-0007](../02-methodology/evidence-and-confidence.md).

### Stage 1 — Service Identification

**Purpose.** Establish which server-side units exist as independently deployed or independently triggered components.

**Inputs.** `framework.architecture.entrypoints`, `framework.architecture.runtime`, build manifests, container definitions, process declarations, function definitions.

**Actions.** Identify each service, worker, job, and function with its deployment unit, owning module, execution model, and state ownership. Separate a service from a library it links. Record services that share a deployment unit and services that share a process.

**Evidence Required.** Deployment or process declaration, entry-point reference, owning module reference.

**Deliverables.** `framework.backend.services`.

**Failure Conditions.** A shared library reported as a service; several deployables merged because they share a codebase; a service claimed with no entry point.

**Acceptance Criteria.** Each service names its deployment unit and at least one entry point, and libraries are distinguished from services.

### Stage 2 — Interface Discovery

**Purpose.** Establish the operations each service exposes and who is expected to call them.

**Inputs.** Routing tables, controller and handler declarations, protocol definitions, message subscriptions, function triggers, published client libraries.

**Actions.** Inventory operations with protocol, address form, method or subject, handler location, and declared authentication requirement. Record internal and external exposure separately where the repository distinguishes them. Trace each operation to a caller where a caller exists in scope, recording operations with no in-scope caller as exposed but unreferenced. Do not record endpoint values or host names.

**Evidence Required.** Registration site, handler location, authentication declaration, caller reference where present.

**Deliverables.** `framework.backend.interfaces`.

**Failure Conditions.** Operations enumerated from a specification that the code does not register; endpoint values disclosed; an unreferenced operation reported as removed.

**Acceptance Criteria.** Each operation names its registration site and its handler, and states whether an in-scope caller was found.

### Stage 3 — Contract Discovery

**Purpose.** Establish what each operation promises about its inputs and outputs, and where that promise is enforced.

**Inputs.** Interface specifications, schema declarations, validation code, serialization configuration, generated types, versioning declarations.

**Actions.** Record request and response shapes with the artifact that is authoritative for each, the location where validation runs, and the versioning strategy. Compare a published specification against the validating code and record divergences as findings with both locations. Record operations with no validation as unvalidated rather than as permissive.

**Evidence Required.** Schema or specification path, validation code location, version declaration, divergence locations where found.

**Deliverables.** `framework.backend.contracts`.

**Failure Conditions.** A specification treated as the implemented contract without checking the code; a framework's default coercion reported as validation; divergence resolved by preferring one side.

**Acceptance Criteria.** Each contract names its authoritative artifact and its validation location, or records the absence of validation explicitly.

### Stage 4 — Execution Model Discovery

**Purpose.** Establish how work is triggered, ordered, and bounded across synchronous and asynchronous paths.

**Inputs.** Queue and topic definitions, consumer registrations, scheduler declarations, background task setup, concurrency configuration, lock usage.

**Actions.** Record each execution path with trigger, concurrency limit, ordering guarantee, delivery semantics, and idempotency evidence. Identify work started synchronously within a request and work deferred to a background path. Record scheduled work with its cadence declaration and the component that owns it. Record the absence of an idempotency mechanism on an at-least-once path as a finding.

**Evidence Required.** Trigger declaration, consumer or scheduler registration, concurrency or ordering configuration, idempotency key or deduplication site.

**Deliverables.** `framework.backend.execution`.

**Failure Conditions.** Delivery semantics assumed from a broker's default without configuration evidence; a scheduled job inferred from a function name; fire-and-forget work reported as guaranteed.

**Acceptance Criteria.** Each execution path names its trigger and states its delivery and ordering properties with evidence or as unknown.

### Stage 5 — Data Access Discovery

**Purpose.** Establish how services reach persistent state and where transaction boundaries fall.

**Inputs.** `framework.database.entities`, `framework.database.connections`, repository and query code, transaction management configuration, connection acquisition sites.

**Actions.** Map each service to the entities it reads and writes, recording the access path, the transaction boundary, and the declared isolation level. Identify entities written by more than one service. Identify transactions spanning an external call. Record cross-service direct store access as a finding, distinct from access through an interface.

**Evidence Required.** Query or repository location, transaction demarcation site, connection reference, entity reference from the database artifacts.

**Deliverables.** `framework.backend.dataaccess`.

**Failure Conditions.** Ownership inferred from naming; an ORM configuration reported as an applied isolation level without a demarcation site; record values copied into the artifact.

**Acceptance Criteria.** Each access record names a code location and an entity, and every write records its transaction boundary or an explicit unknown.

### Stage 6 — Resilience Discovery

**Purpose.** Establish what the system does when a dependency is slow, unavailable, or failing.

**Inputs.** Client configuration, timeout and retry declarations, circuit-breaker setup, rate limiting, bulkhead or pool configuration, fallback code paths.

**Actions.** Record timeout, retry, backoff, circuit-breaking, rate-limiting, and degradation behaviour per dependency, naming the declaration site. Identify call sites that override a global policy and record the override. Identify unbounded retries and retries without backoff. Record dependencies with no declared timeout as unbounded rather than as defaulted, unless a framework default is evidenced.

**Evidence Required.** Policy declaration site, override site, fallback path location, dependency reference.

**Deliverables.** `framework.backend.resilience`.

**Failure Conditions.** A library's documented default reported as the applied policy without evidence in the repository; a retry reported as safe without idempotency evidence; a fallback claimed from a catch block that rethrows.

**Acceptance Criteria.** Each dependency records its timeout and retry posture with a declaration site or an explicit unknown.

### Stage 7 — Error Handling Discovery

**Purpose.** Establish how failures propagate and what a caller learns when one occurs.

**Inputs.** Error type declarations, exception handlers, middleware, response mapping, logging call sites, client-visible error shapes.

**Actions.** Record the error taxonomy, the mapping from internal failure to client-visible shape, and the propagation path. Identify handlers that catch broadly and discard the cause. Identify failures reported to a client as success. Identify error paths that disclose internal detail, recording the location and class without reproducing content.

**Evidence Required.** Handler location, mapping site, client-visible shape declaration, logging site.

**Deliverables.** `framework.backend.errors`.

**Failure Conditions.** A logging call treated as error handling; a swallowed error reported as a deliberate degradation without evidence; internal messages reproduced in the artifact.

**Acceptance Criteria.** Each client-visible failure shape traces to at least one internal failure source, and swallowed-error findings name a location.

### Stage 8 — Boundary Discovery

**Purpose.** Establish where the system stops trusting its caller and which component performs the check.

**Inputs.** Authentication middleware, authorization checks, input validation sites, tenancy filters, internal-versus-external routing configuration, `framework.architecture.integrations`.

**Actions.** For each interface, identify the component that authenticates the caller, the component that authorizes the operation, and the component that validates input. Record operations where any of the three is absent. Record boundaries enforced only by network placement as environmental rather than as code-enforced. This methodology records the enforcement structure; it issues no security verdict, which is [AUD-0007](06-security-permissions.md)'s output.

**Evidence Required.** Check location, the condition evaluated, the operations covered, and the operations not covered.

**Deliverables.** `framework.backend.boundaries`.

**Failure Conditions.** Middleware registration treated as proof that every operation is covered; a security conclusion issued here; a check assumed from a framework convention.

**Acceptance Criteria.** Each interface records an enforcement location for authentication, authorization, and validation, or an explicit absence finding for each.

### Stage 9 — Backend Risks

**Purpose.** Convert supported observations into prioritized backend risks without confusing risk with defect proof.

**Inputs.** All previous stage deliverables, risk tier, operational evidence, stated constraints.

**Actions.** Identify risks involving unvalidated operations, contracts diverging from specifications, unbounded retries, transactions spanning external calls, entities written by multiple services, uncovered boundaries, swallowed errors, and at-least-once delivery without idempotency. State cause, impact, affected evidence, likelihood rationale, confidence, and suggested next verification. Rank by potential impact and evidence strength.

**Evidence Required.** At least one observation supporting the risk and the reasoning from observation to risk.

**Deliverables.** `framework.backend.risks`.

**Failure Conditions.** Risk claims using generic best practices without repository evidence; severity presented as certainty; a security verdict issued in place of a structural finding.

**Acceptance Criteria.** A reviewer can challenge or validate each risk from cited evidence and understands why it matters.

### Stage 10 — Evidence Consolidation

**Purpose.** Normalize and quality-check evidence so conclusions remain auditable after the session ends.

**Inputs.** Observations, command outputs, paths, revision data, specification references, test output.

**Actions.** Record every evidence item with the attributes [STD-0008](../02-methodology/artifact-specification.md) R-15 requires and the provenance [STD-0007](../02-methodology/evidence-and-confidence.md) section 5 requires. Link evidence to the records it supports. Where a conclusion derives from a database or architecture artifact, record the lineage per record, per [STD-0008](../02-methodology/artifact-specification.md) R-46.

**Evidence Required.** Complete evidence attachment for every record, per STD-0008 R-14.

**Deliverables.** Evidence records within every produced artifact.

**Failure Conditions.** Conclusions citing no evidence; evidence lacking revision, source, or environment; blanket lineage recorded where derivation is partial; sensitive values retained.

**Acceptance Criteria.** Each conclusion has evidence, each evidence item has provenance, and derived records name their upstream input.

### Stage 11 — Final Verification

**Purpose.** Confirm the output is internally consistent, complete for scope, and safe to consume.

**Inputs.** All artifacts, scoring worksheets, unresolved-question list.

**Actions.** Confirm every stage produced an artifact or an explicit completeness state with a reason. Confirm that every interface has a service, every contract has an interface, and every boundary finding names an interface. Confirm scores show their calculation. Verify no secrets, endpoints, or record values remain.

**Evidence Required.** Completed verification, artifact versions, escalation record.

**Deliverables.** `framework.backend.health`, completed and consistent artifact set.

**Failure Conditions.** Unresolved contradictions, broken evidence links, missing artifacts without a declared completeness state, or sensitive-data exposure.

**Acceptance Criteria.** The artifact set is traceable, internally coherent, complete for declared scope, and ready for human review or downstream methodologies.

How this output is validated is defined by [STD-0012](../02-methodology/validation-specification.md); this methodology does not define validator behaviour.

## 10. Health Dimensions

*This section is normative.*

The scale, its meanings, the averaging guard, the escalation guard, and the partial-coverage rule are defined by [STD-0007](../02-methodology/evidence-and-confidence.md) section 13. This methodology declares only its dimensions.

Ten dimensions: service boundary clarity; interface discipline; contract integrity; execution model clarity; data access ownership; transaction discipline; resilience posture; error handling quality; boundary enforcement coverage; documentation traceability.

The lowest two levels of the scale for the purposes of the escalation guard are `0` and `1`.

## 11. Backend Smells

*This section is informative.*

Treat a smell as a prompt for investigation, not proof of failure. Common smells include an operation registered with no handler body; a published specification that no code validates against; several services writing the same table; a transaction held open across a network call; retries without backoff or idempotency; a catch block that logs and returns success; authorization performed in one handler and omitted in a sibling; a scheduled job with no owner; configuration-declared timeouts overridden at every call site; internal and external operations sharing one address space with no distinction; and a queue consumer whose failure path silently drops the message.

## 12. Examples and Common Mistakes

*This section is informative.*

A route registration, a handler with a body, a schema the handler validates against, and a test exercising both together support an observed implemented operation with an enforced contract. A path listed in an interface specification with no matching registration supports only a documented intention, and the divergence is the finding. A timeout declared in a shared client configuration is evidence of intent; a call site constructing its own client without one is evidence that the intent does not apply there, and both are recorded.

Common mistakes are enumerating operations from a specification rather than from registration; treating middleware registration as universal coverage; reporting a framework default as an applied policy; assuming a queue is ordered because the broker supports ordering; calling a live endpoint to confirm behaviour; issuing a security verdict from structural evidence; reproducing endpoints or credentials; and describing a service architecture without naming a single deployment unit.

Do not call a live service endpoint. Do not enqueue a message to a live broker. Do not modify the subject. Do not resolve a specification-to-code divergence by choosing a side.

## 13. Related Documents

*This section is informative.*

- [Architecture Discovery](01-architecture-discovery.md)
- [Database Discovery](02-database-discovery.md)
- [Frontend Discovery](03-frontend-discovery.md)
- [Business Workflow Discovery](05-business-workflow-discovery.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [Evidence and Confidence Standard](../02-methodology/evidence-and-confidence.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Metadata Specification Standard](../02-methodology/metadata-specification.md)
- [Contract Specification Standard](../02-methodology/contract-specification.md)
- [Validation Specification Standard](../02-methodology/validation-specification.md)
- [Reliability Standard](../04-development/reliability-standard.md)
- [Framework Glossary](../02-methodology/glossary.md)
