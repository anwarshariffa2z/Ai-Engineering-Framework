---
id: REF-0012
title: Artifact Type Inventory
version: 1.1.0
status: Approved
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

Every artifact type referenced by an audit-engine methodology.

**This document declares no artifact type and carries no normative force.** It is a register of what the methodologies reference, assembled so that the declarations required by [STD-0013](../02-methodology/artifact-type-declaration-standard.md) could be written against a known scope rather than discovered one methodology at a time. The declarations themselves are in the ten documents under `docs/10-artifact-types/`; this register points at them and duplicates none of their content.

An entry here is a claim about what a methodology references, not a design for the type. Purpose statements are one line and deliberately shallow; the declaration fields STD-0013 requires are held in the declarations, not here.

## 2. How to Read the Register

*This section is informative.*

| Column | Meaning |
| --- | --- |
| Type | The namespaced type identity the producing methodology declares |
| Producer | The methodology that emits it. Recorded for traceability only — consumers depend on the type, never on this methodology, per [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md) |
| Consumers | Methodologies that name this type in their consumed set |
| Purpose | What the artifact asserts about a subject |
| Status | `Declared` where a conforming declaration exists in the corpus; `Reused` where an existing type covers the need |

**[AUD-0010](../03-audit-engine/09-gap-analysis.md) consumes every type produced by a run** and is therefore omitted from the Consumers column throughout; listing it 93 times would carry no information. Where a type has no other consumer, the column reads `Gap analysis only`.

A type with no consumer other than gap analysis is not redundant. It is a terminal output of the audit, and several are the audit's most valuable results.

## 3. Summary

*This section is informative.*

| Domain | Producer | Types | Status |
| --- | --- | --- | --- |
| Architecture | AUD-0002 | 14 | Declared |
| Database | AUD-0003 | 14 | Declared |
| Frontend | AUD-0004 | 10 | Declared |
| Backend | AUD-0005 | 10 | Declared |
| Workflow | AUD-0006 | 8 | Declared |
| Security | AUD-0007 | 9 | Declared |
| Feature | AUD-0008 | 7 | Declared |
| Operations | AUD-0009 | 8 | Declared |
| Gap | AUD-0010 | 6 | Declared |
| Runtime | AUD-0011 | 7 | Declared |

**93 artifact types are referenced, and every one is now declared** under [STD-0013](../02-methodology/artifact-type-declaration-standard.md), in the ten documents under `docs/10-artifact-types/`. Each declaration carries the ten required declaration fields and the five conformance fixture cases, and each type identity appears exactly once in the corpus.

This document remains the register of what the methodologies reference. It is no longer a backlog.

## 4. Architecture Types

*This section is informative.*

Producer: [AUD-0002](../03-audit-engine/01-architecture-discovery.md).

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.architecture.scope` | AUD-0003, AUD-0004 | The examined repository boundary and what was excluded from it | Declared |
| `framework.architecture.technology` | AUD-0003, AUD-0004, AUD-0005 | Declared runtimes, ecosystems, frameworks, and tooling with role and version evidence | Declared |
| `framework.architecture.build` | AUD-0009 | How source becomes a deployable artifact and where that process is controlled | Declared |
| `framework.architecture.entrypoints` | AUD-0004, AUD-0005, AUD-0006 | Where executable behaviour begins, with initialization trace | Declared |
| `framework.architecture.dependencies` | AUD-0007 | Internal and external coupling with direction and supply-chain surface | Declared |
| `framework.architecture.modules` | AUD-0003, AUD-0004, AUD-0005, AUD-0006, AUD-0008 | Cohesive units with responsibility evidence and public interfaces | Declared |
| `framework.architecture.layers` | Gap analysis only | Layer map with dependency-direction rules and violations | Declared |
| `framework.architecture.classification` | Gap analysis only | Architectural style with rationale and competing classifications | Declared |
| `framework.architecture.runtime` | AUD-0005, AUD-0009 | Processes, workloads, stores, and queues comprising the running system | Declared |
| `framework.architecture.integrations` | AUD-0003, AUD-0004, AUD-0005, AUD-0007 | Boundaries where the system exchanges data or control externally | Declared |
| `framework.architecture.configuration` | AUD-0004, AUD-0007, AUD-0009 | Configuration sources, precedence, and secret boundaries | Declared |
| `framework.architecture.deployment` | AUD-0007, AUD-0009 | Packaging, release flow, and environment inventory | Declared |
| `framework.architecture.risks` | Gap analysis only | Architecture risk register | Declared |
| `framework.architecture.health` | Gap analysis only | Architecture health scores with evidence and calculation | Declared |

## 5. Database Types

*This section is informative.*

Producer: [AUD-0003](../03-audit-engine/02-database-discovery.md).

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.database.technology` | Gap analysis only | Engines and mappers with role and schema authority | Declared |
| `framework.database.connections` | AUD-0005, AUD-0007 | Connection targets by component and environment with credential source | Declared |
| `framework.database.schema` | Gap analysis only | Authoritative structural source per store and supported object types | Declared |
| `framework.database.entities` | AUD-0005, AUD-0006 | Business entities with storage objects, identity strategy, and access paths | Declared |
| `framework.database.relationships` | AUD-0006 | Relationships with cardinality, enforcement location, and synchronization | Declared |
| `framework.database.constraints` | AUD-0006 | Declared constraints with referential actions and enforcement location | Declared |
| `framework.database.indexes` | Gap analysis only | Indexes with supported access pattern or explicit absence | Declared |
| `framework.database.migration` | Gap analysis only | Migration mechanism, ordering, reversibility, and drift findings | Declared |
| `framework.database.security` | AUD-0007 | Principals, privileges, isolation enforcement, and classification register | Declared |
| `framework.database.performance` | Gap analysis only | Access-pattern to index comparison and amplification findings | Declared |
| `framework.database.lifecycle` | AUD-0009 | Retention, deletion paths, lineage, backup, and restore evidence | Declared |
| `framework.database.health` | Gap analysis only | Database health scores with evidence and calculation | Declared |
| `framework.database.risks` | Gap analysis only | Database risk register | Declared |
| `framework.database.recommendations` | Gap analysis only | Prioritized actions with owner and confirming verification | Declared |

## 6. Frontend Types

*This section is informative.*

Producer: [AUD-0004](../03-audit-engine/03-frontend-discovery.md).

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.frontend.surface` | AUD-0008 | Client applications with platform, build unit, and support matrix | Declared |
| `framework.frontend.routing` | AUD-0006, AUD-0008 | Addressable routes with guards and reachability evidence | Declared |
| `framework.frontend.components` | AUD-0006 | Component catalogue with responsibility and measured reuse | Declared |
| `framework.frontend.state` | Gap analysis only | Client state containers with ownership and persistence | Declared |
| `framework.frontend.dataflow` | AUD-0006 | Client-to-service call sites with target interface and error handling | Declared |
| `framework.frontend.assets` | Gap analysis only | Bundle inventory with size evidence and build-output findings | Declared |
| `framework.frontend.accessibility` | Gap analysis only | Accessibility observations with standard and evidence class | Declared |
| `framework.frontend.exposure` | AUD-0007 | What the shipped client discloses, by location and class, never by value | Declared |
| `framework.frontend.risks` | Gap analysis only | Frontend risk register | Declared |
| `framework.frontend.health` | Gap analysis only | Frontend health scores with evidence and calculation | Declared |

**Reuse decisions.** Frontend declares no technology type; it consumes `framework.architecture.technology`. It declares no configuration type; it consumes `framework.architecture.configuration` and records only what the client discloses.

## 7. Backend Types

*This section is informative.*

Producer: [AUD-0005](../03-audit-engine/04-backend-discovery.md).

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.backend.services` | AUD-0009 | Server-side units with deployment unit, execution model, and state ownership | Declared |
| `framework.backend.interfaces` | AUD-0006, AUD-0007, AUD-0008 | Exposed operations with handler, authentication requirement, and caller evidence | Declared |
| `framework.backend.contracts` | AUD-0006, AUD-0011 | Request and response shapes with validation location and divergence findings | Declared |
| `framework.backend.execution` | AUD-0006 | Synchronous, asynchronous, and scheduled paths with ordering and idempotency | Declared |
| `framework.backend.dataaccess` | AUD-0006 | Service-to-store access with transaction boundary and shared-store findings | Declared |
| `framework.backend.resilience` | AUD-0009 | Timeout, retry, circuit-breaking, and degradation behaviour with override findings | Declared |
| `framework.backend.errors` | Gap analysis only | Error taxonomy, propagation, and swallowed-error findings | Declared |
| `framework.backend.boundaries` | AUD-0006, AUD-0007 | Trust boundaries with the enforcing component and uncovered operations | Declared |
| `framework.backend.risks` | Gap analysis only | Backend risk register | Declared |
| `framework.backend.health` | Gap analysis only | Backend health scores with evidence and calculation | Declared |

**Reuse decisions.** Backend declares no entity type; it consumes `framework.database.entities`. It declares no runtime topology type; it consumes `framework.architecture.runtime`.

## 8. Workflow Types

*This section is informative.*

Producer: [AUD-0006](../03-audit-engine/05-business-workflow-discovery.md).

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.workflow.processes` | AUD-0008 | Business processes with trigger, ordered steps, and terminal outcomes | Declared |
| `framework.workflow.rules` | Gap analysis only | Business rules as conditions, with declaring location and authority | Declared |
| `framework.workflow.enforcement` | AUD-0007 | Where each rule is enforced, with bypass paths and cross-layer divergence | Declared |
| `framework.workflow.states` | AUD-0008 | Entity lifecycles with permitted transitions and performing components | Declared |
| `framework.workflow.decisions` | Gap analysis only | Decision points with inputs, branches, and observable consequences | Declared |
| `framework.workflow.actors` | AUD-0007 | Human and system actors with the processes each initiates | Declared |
| `framework.workflow.risks` | Gap analysis only | Workflow risk register | Declared |
| `framework.workflow.health` | Gap analysis only | Workflow health scores with evidence and calculation | Declared |

**Reuse decisions.** Workflow declares no entity, relationship, or constraint type; it consumes the database types. `framework.workflow.rules` records business conditions, which `framework.database.constraints` does not — the two describe the same enforcement from different directions and are not merged.

## 9. Security, Feature, Operations, Gap, and Runtime Types

*This section is informative.*

### 9.1 Security — producer [AUD-0007](../03-audit-engine/06-security-permissions.md)

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.security.identity` | AUD-0008 | Authentication mechanisms with verification location and lifetime | Declared |
| `framework.security.authorization` | AUD-0008 | Permission model with decision points and enumerated coverage | Declared |
| `framework.security.secrets` | Gap analysis only | Secret classes by location and management mechanism, never by value | Declared |
| `framework.security.boundaries` | Gap analysis only | Trust boundaries with enforcing control and transport protection | Declared |
| `framework.security.dataprotection` | Gap analysis only | Data classification with encryption, masking, and retention linkage | Declared |
| `framework.security.supplychain` | Gap analysis only | Third-party components with pinning posture and advisory references | Declared |
| `framework.security.auditlogging` | AUD-0009 | Security-relevant events recorded, and those not | Declared |
| `framework.security.risks` | Gap analysis only | Structural security risk register, framed as findings not vulnerabilities | Declared |
| `framework.security.health` | Gap analysis only | Security-structure health scores; not a security rating | Declared |

### 9.2 Feature — producer [AUD-0008](../03-audit-engine/07-feature-inventory.md)

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.feature.register` | AUD-0009, AUD-0011 | Features as capability statements with implementing components | Declared |
| `framework.feature.liveness` | AUD-0011 | Liveness per feature with evidence class, environment, and ceiling | Declared |
| `framework.feature.flags` | AUD-0011 | Flags with per-environment state and the features each gates | Declared |
| `framework.feature.ownership` | Gap analysis only | Owning role per feature with the establishing artifact | Declared |
| `framework.feature.coverage` | Gap analysis only | Test and documentation coverage per feature | Declared |
| `framework.feature.risks` | Gap analysis only | Feature risk register | Declared |
| `framework.feature.health` | Gap analysis only | Feature health scores with evidence and calculation | Declared |

### 9.3 Operations — producer [AUD-0009](../03-audit-engine/08-operations-manual.md)

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.operations.environments` | AUD-0011 | Environments with provisioning, configuration source, and parity findings | Declared |
| `framework.operations.release` | Gap analysis only | Release path with gates, rollout, and rollback exercise evidence | Declared |
| `framework.operations.observability` | Gap analysis only | Metrics, logs, traces, alerts, and unobserved components | Declared |
| `framework.operations.recovery` | AUD-0011 | Backup mechanisms recorded separately from restore evidence | Declared |
| `framework.operations.runbooks` | Gap analysis only | Procedures with scenario, currency evidence, and uncovered scenarios | Declared |
| `framework.operations.capacity` | Gap analysis only | Limits and scaling rules with supporting load evidence | Declared |
| `framework.operations.risks` | Gap analysis only | Operations risk register | Declared |
| `framework.operations.health` | Gap analysis only | Operations health scores with evidence and calculation | Declared |

### 9.4 Gap — producer [AUD-0010](../03-audit-engine/09-gap-analysis.md)

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.gap.coverage` | AUD-0011, capability reporting | What was audited, what was not, and the completeness of each | Declared |
| `framework.gap.divergence` | Capability reporting | Disagreements between intent, implementation, and evidence | Declared |
| `framework.gap.contradictions` | Capability reporting | Cross-domain conclusions that cannot both hold | Declared |
| `framework.gap.unknowns` | AUD-0011 | What the run could not determine, and what would resolve it | Declared |
| `framework.gap.remediation` | Capability reporting | Prioritized actions with source finding and confirming verification | Declared |
| `framework.gap.health` | Capability reporting | Run-level synthesis with coverage bound and confidence ceiling | Declared |

### 9.5 Runtime — producer [AUD-0011](../03-audit-engine/10-runtime-verification.md)

| Type | Consumers | Purpose | Status |
| --- | --- | --- | --- |
| `framework.runtime.environment` | Capability reporting | The observed environment, deployed revision, and window | Declared |
| `framework.runtime.observations` | Capability reporting | Observations with operation, conditions, time, and result | Declared |
| `framework.runtime.promotions` | Capability reporting | Conclusions promoted to Verified, scoped by environment, revision, and time | Declared |
| `framework.runtime.divergence` | Capability reporting | Where the running system contradicts the audited declaration | Declared |
| `framework.runtime.limits` | Capability reporting | What could not be verified and what would permit it | Declared |
| `framework.runtime.risks` | Capability reporting | Runtime risk register, attributed per environment | Declared |
| `framework.runtime.health` | Capability reporting | Runtime health scores bounded by the environment observed | Declared |

## 10. Observations Carried Into the Declarations

*This section is informative.*

**Every type is new.** No methodology reuses a type another methodology produces as its own output. The reuse that did occur is on the consumption side and is recorded per domain above: frontend, backend, and workflow each declined to declare a type that an upstream domain already owns.

**The recurring shapes were kept separate, not merged.** Ten domain-specific `*.risks` types and ten `*.health` types account for twenty of the ninety-three, and their structure is close to identical. They remain separate because [STD-0013](../02-methodology/artifact-type-declaration-standard.md) R-05 versions each type independently, and because their dimension vocabularies differ per domain in a way a shared type would have to erase. What they genuinely share is stated once in the standard rather than once per declaration, which is where the duplication was actually removed.

**Nineteen types have no consumer other than gap analysis.** Their consumption profiles are therefore known from exactly one consumer, which makes their compatibility surface easy to state now and easy to get wrong when a second consumer appears.

**The heaviest consumption load falls on four types.** `framework.architecture.modules` has five declared consumers, `framework.architecture.integrations` has four, `framework.backend.interfaces` has four, and `framework.architecture.technology` has three. These carry the most compatibility risk under STD-0013 R-24.

**Two types carry redaction obligations that shaped their fields.** `framework.security.secrets` and `framework.frontend.exposure` each declare a location, a class, and a redaction marker, and declare no field capable of holding a value. The prohibition is structural rather than advisory.

## 11. Related Documents

*This section is informative.*

- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Framework Artifact Model](../01-foundation/framework-artifact-model.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [Architecture Discovery](../03-audit-engine/01-architecture-discovery.md)
- [Database Discovery](../03-audit-engine/02-database-discovery.md)
