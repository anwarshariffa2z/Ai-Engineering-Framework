---
id: REF-0012
title: Artifact Type Inventory
version: 1.0.0
status: Draft
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-26
review_cycle: Event-driven
category: Reference
tags: [artifacts, inventory, backlog, audit-engine]
related: [../02-methodology/artifact-specification.md, ../01-foundation/framework-artifact-model.md, ../09-capabilities/CAP-0001-repository-audit.md, ../03-audit-engine/01-architecture-discovery.md]
object_type: Guide
layer: 0
depends_on: [../02-methodology/artifact-specification.md, ../02-methodology/metadata-specification.md]
references: [../01-foundation/framework-artifact-model.md, ../09-capabilities/CAP-0001-repository-audit.md, ../03-audit-engine/01-architecture-discovery.md, ../03-audit-engine/02-database-discovery.md]
meta_model_version: 1.0.0
normativity:
  "1": informative
  "2": informative
  "3": informative
  "4": informative
  "5": informative
  "6": informative
  "7": informative
  "8": informative
  "9": informative
  "10": informative
  "11": informative
---

# Artifact Type Inventory

## 1. Purpose

*This section is informative.*

Every artifact type referenced by an audit-engine methodology, recorded before any of them is defined.

**This document defines no artifact type and carries no normative force.** It is a register of what the methodologies declare, assembled so that the type definitions required by [STD-0008](../02-methodology/artifact-specification.md) section 15 can be written against a known scope rather than discovered one methodology at a time. It becomes the implementation backlog for the artifact type definition milestone.

An entry here is a claim about what a methodology declares, not a design for the type. Purpose statements are one line and deliberately shallow; the sixteen sections STD-0008 requires are out of scope for this register.

## 2. How to Read the Register

*This section is informative.*

| Column | Meaning |
| --- | --- |
| Type | The namespaced type identity the producing methodology declares |
| Producer | The methodology that emits it. Recorded for traceability only — consumers depend on the type, never on this methodology, per [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md) |
| Consumers | Methodologies that name this type in their consumed set |
| Purpose | What the artifact asserts about a subject |
| Status | `New` where a type definition must be written; `Reused` where an existing type covers the need |

**[AUD-0010](../03-audit-engine/09-gap-analysis.md) consumes every type produced by a run** and is therefore omitted from the Consumers column throughout; listing it 93 times would carry no information. Where a type has no other consumer, the column reads `Gap analysis only`.

A type with no consumer other than gap analysis is not redundant. It is a terminal output of the audit, and several are the audit's most valuable results.

## 3. Summary

*This section is informative.*

| Domain | Producer | Types | Status |
| --- | --- | --- | --- |
| Architecture | AUD-0002 | 14 | Declared; definitions not written |
| Database | AUD-0003 | 14 | Declared; definitions not written |
| Frontend | AUD-0004 | 10 | Declared; definitions not written |
| Backend | AUD-0005 | 10 | Declared; definitions not written |
| Workflow | AUD-0006 | 8 | Declared; definitions not written |
| Security | AUD-0007 | 9 | Declared; definitions not written |
| Feature | AUD-0008 | 7 | Declared; definitions not written |
| Operations | AUD-0009 | 8 | Declared; definitions not written |
| Gap | AUD-0010 | 6 | Declared; definitions not written |
| Runtime | AUD-0011 | 7 | Declared; definitions not written |

**93 artifact types are referenced. None has a type definition.** Every one requires the sixteen sections of STD-0008 R-37 and the five conformance fixture classes of its R-50.

## 4. Architecture Types

*This section is informative.*

Producer: [AUD-0002](../03-audit-engine/01-architecture-discovery.md).

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.architecture.scope` | AUD-0003, AUD-0004 | The examined repository boundary and what was excluded from it | New |
| `framework.architecture.technology` | AUD-0003, AUD-0004, AUD-0005 | Declared runtimes, ecosystems, frameworks, and tooling with role and version evidence | New |
| `framework.architecture.build` | AUD-0009 | How source becomes a deployable artifact and where that process is controlled | New |
| `framework.architecture.entrypoints` | AUD-0004, AUD-0005, AUD-0006 | Where executable behaviour begins, with initialization trace | New |
| `framework.architecture.dependencies` | AUD-0007 | Internal and external coupling with direction and supply-chain surface | New |
| `framework.architecture.modules` | AUD-0003, AUD-0004, AUD-0005, AUD-0006, AUD-0008 | Cohesive units with responsibility evidence and public interfaces | New |
| `framework.architecture.layers` | Gap analysis only | Layer map with dependency-direction rules and violations | New |
| `framework.architecture.classification` | Gap analysis only | Architectural style with rationale and competing classifications | New |
| `framework.architecture.runtime` | AUD-0005, AUD-0009 | Processes, workloads, stores, and queues comprising the running system | New |
| `framework.architecture.integrations` | AUD-0003, AUD-0004, AUD-0005, AUD-0007 | Boundaries where the system exchanges data or control externally | New |
| `framework.architecture.configuration` | AUD-0004, AUD-0007, AUD-0009 | Configuration sources, precedence, and secret boundaries | New |
| `framework.architecture.deployment` | AUD-0007, AUD-0009 | Packaging, release flow, and environment inventory | New |
| `framework.architecture.risks` | Gap analysis only | Architecture risk register | New |
| `framework.architecture.health` | Gap analysis only | Architecture health scores with evidence and calculation | New |

## 5. Database Types

*This section is informative.*

Producer: [AUD-0003](../03-audit-engine/02-database-discovery.md).

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.database.technology` | Gap analysis only | Engines and mappers with role and schema authority | New |
| `framework.database.connections` | AUD-0005, AUD-0007 | Connection targets by component and environment with credential source | New |
| `framework.database.schema` | Gap analysis only | Authoritative structural source per store and supported object types | New |
| `framework.database.entities` | AUD-0005, AUD-0006 | Business entities with storage objects, identity strategy, and access paths | New |
| `framework.database.relationships` | AUD-0006 | Relationships with cardinality, enforcement location, and synchronization | New |
| `framework.database.constraints` | AUD-0006 | Declared constraints with referential actions and enforcement location | New |
| `framework.database.indexes` | Gap analysis only | Indexes with supported access pattern or explicit absence | New |
| `framework.database.migration` | Gap analysis only | Migration mechanism, ordering, reversibility, and drift findings | New |
| `framework.database.security` | AUD-0007 | Principals, privileges, isolation enforcement, and classification register | New |
| `framework.database.performance` | Gap analysis only | Access-pattern to index comparison and amplification findings | New |
| `framework.database.lifecycle` | AUD-0009 | Retention, deletion paths, lineage, backup, and restore evidence | New |
| `framework.database.health` | Gap analysis only | Database health scores with evidence and calculation | New |
| `framework.database.risks` | Gap analysis only | Database risk register | New |
| `framework.database.recommendations` | Gap analysis only | Prioritized actions with owner and confirming verification | New |

## 6. Frontend Types

*This section is informative.*

Producer: [AUD-0004](../03-audit-engine/03-frontend-discovery.md).

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.frontend.surface` | AUD-0008 | Client applications with platform, build unit, and support matrix | New |
| `framework.frontend.routing` | AUD-0006, AUD-0008 | Addressable routes with guards and reachability evidence | New |
| `framework.frontend.components` | AUD-0006 | Component catalogue with responsibility and measured reuse | New |
| `framework.frontend.state` | Gap analysis only | Client state containers with ownership and persistence | New |
| `framework.frontend.dataflow` | AUD-0006 | Client-to-service call sites with target interface and error handling | New |
| `framework.frontend.assets` | Gap analysis only | Bundle inventory with size evidence and build-output findings | New |
| `framework.frontend.accessibility` | Gap analysis only | Accessibility observations with standard and evidence class | New |
| `framework.frontend.exposure` | AUD-0007 | What the shipped client discloses, by location and class, never by value | New |
| `framework.frontend.risks` | Gap analysis only | Frontend risk register | New |
| `framework.frontend.health` | Gap analysis only | Frontend health scores with evidence and calculation | New |

**Reuse decisions.** Frontend declares no technology type; it consumes `framework.architecture.technology`. It declares no configuration type; it consumes `framework.architecture.configuration` and records only what the client discloses.

## 7. Backend Types

*This section is informative.*

Producer: [AUD-0005](../03-audit-engine/04-backend-discovery.md).

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.backend.services` | AUD-0009 | Server-side units with deployment unit, execution model, and state ownership | New |
| `framework.backend.interfaces` | AUD-0006, AUD-0007, AUD-0008 | Exposed operations with handler, authentication requirement, and caller evidence | New |
| `framework.backend.contracts` | AUD-0006, AUD-0011 | Request and response shapes with validation location and divergence findings | New |
| `framework.backend.execution` | AUD-0006 | Synchronous, asynchronous, and scheduled paths with ordering and idempotency | New |
| `framework.backend.dataaccess` | AUD-0006 | Service-to-store access with transaction boundary and shared-store findings | New |
| `framework.backend.resilience` | AUD-0009 | Timeout, retry, circuit-breaking, and degradation behaviour with override findings | New |
| `framework.backend.errors` | Gap analysis only | Error taxonomy, propagation, and swallowed-error findings | New |
| `framework.backend.boundaries` | AUD-0006, AUD-0007 | Trust boundaries with the enforcing component and uncovered operations | New |
| `framework.backend.risks` | Gap analysis only | Backend risk register | New |
| `framework.backend.health` | Gap analysis only | Backend health scores with evidence and calculation | New |

**Reuse decisions.** Backend declares no entity type; it consumes `framework.database.entities`. It declares no runtime topology type; it consumes `framework.architecture.runtime`.

## 8. Workflow Types

*This section is informative.*

Producer: [AUD-0006](../03-audit-engine/05-business-workflow-discovery.md).

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.workflow.processes` | AUD-0008 | Business processes with trigger, ordered steps, and terminal outcomes | New |
| `framework.workflow.rules` | Gap analysis only | Business rules as conditions, with declaring location and authority | New |
| `framework.workflow.enforcement` | AUD-0007 | Where each rule is enforced, with bypass paths and cross-layer divergence | New |
| `framework.workflow.states` | AUD-0008 | Entity lifecycles with permitted transitions and performing components | New |
| `framework.workflow.decisions` | Gap analysis only | Decision points with inputs, branches, and observable consequences | New |
| `framework.workflow.actors` | AUD-0007 | Human and system actors with the processes each initiates | New |
| `framework.workflow.risks` | Gap analysis only | Workflow risk register | New |
| `framework.workflow.health` | Gap analysis only | Workflow health scores with evidence and calculation | New |

**Reuse decisions.** Workflow declares no entity, relationship, or constraint type; it consumes the database types. `framework.workflow.rules` records business conditions, which `framework.database.constraints` does not — the two describe the same enforcement from different directions and are not merged.

## 9. Security, Feature, Operations, Gap, and Runtime Types

*This section is informative.*

### 9.1 Security — producer [AUD-0007](../03-audit-engine/06-security-permissions.md)

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.security.identity` | AUD-0008 | Authentication mechanisms with verification location and lifetime | New |
| `framework.security.authorization` | AUD-0008 | Permission model with decision points and enumerated coverage | New |
| `framework.security.secrets` | Gap analysis only | Secret classes by location and management mechanism, never by value | New |
| `framework.security.boundaries` | Gap analysis only | Trust boundaries with enforcing control and transport protection | New |
| `framework.security.dataprotection` | Gap analysis only | Data classification with encryption, masking, and retention linkage | New |
| `framework.security.supplychain` | Gap analysis only | Third-party components with pinning posture and advisory references | New |
| `framework.security.auditlogging` | AUD-0009 | Security-relevant events recorded, and those not | New |
| `framework.security.risks` | Gap analysis only | Structural security risk register, framed as findings not vulnerabilities | New |
| `framework.security.health` | Gap analysis only | Security-structure health scores; not a security rating | New |

### 9.2 Feature — producer [AUD-0008](../03-audit-engine/07-feature-inventory.md)

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.feature.register` | AUD-0009, AUD-0011 | Features as capability statements with implementing components | New |
| `framework.feature.liveness` | AUD-0011 | Liveness per feature with evidence class, environment, and ceiling | New |
| `framework.feature.flags` | AUD-0011 | Flags with per-environment state and the features each gates | New |
| `framework.feature.ownership` | Gap analysis only | Owning role per feature with the establishing artifact | New |
| `framework.feature.coverage` | Gap analysis only | Test and documentation coverage per feature | New |
| `framework.feature.risks` | Gap analysis only | Feature risk register | New |
| `framework.feature.health` | Gap analysis only | Feature health scores with evidence and calculation | New |

### 9.3 Operations — producer [AUD-0009](../03-audit-engine/08-operations-manual.md)

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.operations.environments` | AUD-0011 | Environments with provisioning, configuration source, and parity findings | New |
| `framework.operations.release` | Gap analysis only | Release path with gates, rollout, and rollback exercise evidence | New |
| `framework.operations.observability` | Gap analysis only | Metrics, logs, traces, alerts, and unobserved components | New |
| `framework.operations.recovery` | AUD-0011 | Backup mechanisms recorded separately from restore evidence | New |
| `framework.operations.runbooks` | Gap analysis only | Procedures with scenario, currency evidence, and uncovered scenarios | New |
| `framework.operations.capacity` | Gap analysis only | Limits and scaling rules with supporting load evidence | New |
| `framework.operations.risks` | Gap analysis only | Operations risk register | New |
| `framework.operations.health` | Gap analysis only | Operations health scores with evidence and calculation | New |

### 9.4 Gap — producer [AUD-0010](../03-audit-engine/09-gap-analysis.md)

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.gap.coverage` | AUD-0011, capability reporting | What was audited, what was not, and the completeness of each | New |
| `framework.gap.divergence` | Capability reporting | Disagreements between intent, implementation, and evidence | New |
| `framework.gap.contradictions` | Capability reporting | Cross-domain conclusions that cannot both hold | New |
| `framework.gap.unknowns` | AUD-0011 | What the run could not determine, and what would resolve it | New |
| `framework.gap.remediation` | Capability reporting | Prioritized actions with source finding and confirming verification | New |
| `framework.gap.health` | Capability reporting | Run-level synthesis with coverage bound and confidence ceiling | New |

### 9.5 Runtime — producer [AUD-0011](../03-audit-engine/10-runtime-verification.md)

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.runtime.environment` | Capability reporting | The observed environment, deployed revision, and window | New |
| `framework.runtime.observations` | Capability reporting | Observations with operation, conditions, time, and result | New |
| `framework.runtime.promotions` | Capability reporting | Conclusions promoted to Verified, scoped by environment, revision, and time | New |
| `framework.runtime.divergence` | Capability reporting | Where the running system contradicts the audited declaration | New |
| `framework.runtime.limits` | Capability reporting | What could not be verified and what would permit it | New |
| `framework.runtime.risks` | Capability reporting | Runtime risk register, attributed per environment | New |
| `framework.runtime.health` | Capability reporting | Runtime health scores bounded by the environment observed | New |

## 10. Observations for the Definition Milestone

*This section is informative.*

**Every type is new.** No methodology reuses a type another methodology produces as its own output. The reuse that did occur is on the consumption side and is recorded per domain above: frontend, backend, and workflow each declined to define a type that an upstream domain already owns.

**Four naming patterns recur across domains** — `*.risks`, `*.health`, `*.scope`, and `*.recommendations`. Their structure appears identical across producers. Whether they should be one shared type parameterized by domain, or one type per domain, is the first question the definition milestone must answer, and it materially changes the type count. Ten domain-specific `*.risks` types and ten `*.health` types account for twenty of the ninety-three.

**Nineteen types have no consumer other than gap analysis.** That is expected for terminal outputs, but it also means their consumption profiles are known from exactly one consumer, which makes their compatibility surface easy to state and easy to get wrong later when a second consumer appears.

**The heaviest consumption load falls on four types.** `framework.architecture.modules` has five declared consumers, `framework.architecture.integrations` and `framework.architecture.technology` have four and three, and `framework.backend.interfaces` has three. These carry the most compatibility risk and are the natural first definitions.

**Two types carry redaction obligations that shape their structure**: `framework.security.secrets` and `framework.frontend.exposure` must be structurally incapable of holding a value, and their definitions decide whether that is enforceable mechanically or only by review.

## 11. Related Documents

*This section is informative.*

- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Framework Artifact Model](../01-foundation/framework-artifact-model.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [Architecture Discovery](../03-audit-engine/01-architecture-discovery.md)
- [Database Discovery](../03-audit-engine/02-database-discovery.md)
