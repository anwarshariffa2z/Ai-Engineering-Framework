---
id: REF-0023
title: Framework Operationalization Roadmap
version: 1.2.1
status: Draft
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-29
review_cycle: Event-driven
category: Roadmap
tags: [roadmap, operationalization, adoption, tooling]
related: [artifact-type-inventory.md, ../09-capabilities/CAP-0001-repository-audit.md, ../ADR/ADR-0006-artifact-instance-identity.md, ../02-methodology/artifact-type-declaration-standard.md]
object_type: Guide
layer: 0
depends_on: [../02-methodology/metadata-specification.md]
references: [artifact-type-inventory.md, ../09-capabilities/CAP-0001-repository-audit.md, ../ADR/ADR-0006-artifact-instance-identity.md, ../ADR/ADR-0005-artifact-types-as-declarations.md, ../02-methodology/artifact-type-declaration-standard.md, ../validation-report.md]
meta_model_version: 1.0.0
normativity:
  "1": informative
  "2": informative
  "3": informative
  "4": informative
  "5": informative
  "6": informative
  "7": informative
---

# Framework Operationalization Roadmap

## 1. Purpose

*This section is informative.*

Record the transition from framework construction to framework operationalization, and name the workstreams that follow it.

**This document plans work; it authorizes none of it and constrains no contributor.** It states no requirement, defines no artifact type, and changes no architecture. Each workstream below becomes real when it is scoped and, where it revises a standard, when a decision record supports it.

## 2. The Construction Phase Is Closed

*This section is informative.*

The construction phase produced the framework's normative surface and ended at `v0.7.0-artifact-declarations`. Its backlog is archived rather than carried forward: every item in it is either delivered or restated as a workstream in section 4.

What construction delivered:

| Outcome | Where it lives |
| --- | --- |
| Frozen object model — eight object types across five layers | Framework Core Architecture |
| Frozen layer model and the three permanent asymmetries | Framework Core Architecture |
| Complete standards suite — eight standards, 242 requirements at the close of construction and 267 after ADR-0006 carriage | `docs/02-methodology/` |
| Complete methodology suite — ten approved methodologies | `docs/03-audit-engine/` |
| Artifact declaration framework — one standard, ninety-three declarations | [STD-0013](../02-methodology/artifact-type-declaration-standard.md), `docs/10-artifact-types/` |
| Generic reference validator — sixty-eight bound checks, no type-specific logic | `tools/validator/` |
| Complete architectural traceability — six decision records, retired-requirement registry, exception register | `docs/ADR/`, [validation report](../validation-report.md) |
| Artifact instance identity architecture | [ADR-0006](../ADR/ADR-0006-artifact-instance-identity.md) |

No architectural question remains open. The two sub-decisions [ADR-0006](../ADR/ADR-0006-artifact-instance-identity.md) defers — a derivation rule for the run discriminator, and whether the framework specifies a resolver contract — are refinements inside an accepted decision, and both are recorded there.

Carriage of that decision into the standards found neither refinement necessary. The discriminator is supplied to a producer by its orchestrator, which [STD-0011](../02-methodology/contract-specification.md) R-51 obliges to keep distinct; a derivation rule remains a deferred implementation question rather than a precondition, and [STD-0008](../02-methodology/artifact-specification.md) section 20 records it as one. Resolution is declared as run-scoped data under [STD-0010](../02-methodology/metadata-specification.md) R-45 and [STD-0011](../02-methodology/contract-specification.md) R-52, so no resolver contract, abstraction, or object type was introduced.

## 3. What Operationalization Means

*This section is informative.*

Construction asked whether the framework is coherent. Operationalization asks whether it survives contact with a real repository.

The distinction is practical. For as long as the framework shipped artifact *types* and no artifact *instance*, 199 of its 267 requirements were reported not-evaluated rather than passing: their subjects — instances, producers, consumers, and conclusions — did not exist in the corpus. Producing the first conforming instances is what moved them from dormant to enforced, and no further document could have done it. One methodology now has a reference producer, and 148 requirements remain dormant for the same reason: the subjects they range over are consumers, orchestrators, compositions, and conclusions that the corpus still does not contain.

Nothing in this phase redesigns the architecture. Where a workstream needs normative support it revises an existing standard under an accepted decision, which is authoring rather than architecture.

## 4. Workstreams

*This section is informative.*

Ordered by dependency, not by priority. The first four are prerequisites for the rest.

| Workstream | Outcome |
| --- | --- |
| Carry ADR-0006 into STD-0008 | **Delivered at 1.6.0.** R-52 through R-54 give R-06 its composition, R-55 makes the content digest an envelope member, and R-56 defines the upstream address of R-19 as an immutable reference |
| Carry ADR-0006 into STD-0010 | **Delivered at 1.3.0.** R-41 serializes an identity, R-42 a digest, R-43 settles admissibility against R-07, and R-44 and R-45 represent the envelope summary and a run's resolution declaration |
| Carry ADR-0006 into STD-0011 | **Delivered at 1.3.0.** R-45 and R-46 place identity and digest production on the producer, R-47 through R-50 place verification, unresolvable-input, staleness, and cross-run duties on the consumer, and R-51 and R-52 place discriminator distinctness and resolution declaration on the orchestrator |
| Carry ADR-0006 into STD-0012 | **Delivered at 1.1.0.** R-40 through R-45 state validator behavior on an invalid identity, an invalid digest, a mutable lineage reference, a digest mismatch, an unresolvable identity, and a lineage entry disagreeing with the revision it names |
| Reference Producers | **Partially delivered.** AUD-0002 Architecture Discovery has an executable reference producer emitting conforming instances of all fourteen types it declares, with a consumer, a run-scoped resolution declaration, and a requirement-addressed test suite under `tools/producer/`. The workstream completes when the remaining methodologies have one |
| Reference Artifact Corpus | A published set of conforming instances, including the boundary and failure cases each declaration's fixtures describe |
| Validator Expansion | Activation of the instance-scoped requirements in STD-0007, STD-0008, and STD-0011 against that corpus |
| CI/CD Integration | Validation on every pull request, and a release process that gates on it |
| IDE Integrations | Authoring support for declarations, requirement metadata, and registry agreement |
| AI Agent Runtime | Execution of a capability by an agent, one methodology at a time, within the context budget CAP-0001 section 15 describes |
| Example Repositories | Subjects of known shape against which a producer's output can be judged correct rather than merely conforming |
| Interoperability Testing | Two independent implementations of one methodology, checked for artifact interchangeability |

[STD-0013](../02-methodology/artifact-type-declaration-standard.md) needs nothing from the first four workstreams. That it does not is the check that the separation [ADR-0005](../ADR/ADR-0005-artifact-types-as-declarations.md) established holds: declarations describe types, and identity is a property of instances.

## 5. Sequencing Constraint

*This section is informative.*

The four carriage workstreams are delivered, and they preceded the producer workstreams because a producer cannot record a lineage reference the standards do not define. A reference producer can now derive an identity, digest its output, and record lineage without inventing an identity model, and a consumer can identify, resolve, and integrity-check that output using framework-defined contracts alone. The corpus precedes validator expansion, because a check without a subject is a check that cannot run. Everything after that is parallelizable.

The AUD-0002 vertical slice moved fifty-three requirements from dormant to evaluated: bound checks rose from sixty-eight to one hundred and twenty-one, and not-evaluated fell from 199 to 148. Nothing was activated by writing a check; each of the fifty-three binds to a requirement that already existed and became evaluable only because an instance now exists to evaluate it. The next step is expansion to [AUD-0003](../03-audit-engine/02-database-discovery.md) Database Discovery, whose producer consumes AUD-0002's artifacts and is therefore the first test of lineage across two methodologies rather than within one.

## 6. Known Remaining Work Outside the Workstreams

*This section is informative.*

- [AUD-0001](../03-audit-engine/00-bootstrap.md) Bootstrap remains a structural placeholder, and the CAP-0001 ordering begins with it.
- The registry is maintained by hand and could be generated from front matter.
- Several numbered domains have no README.
- Open exceptions EXC-0001 and EXC-0008 await maintainer judgment; both are advisory and neither reports a defective document.
- Fifty of the fifty-two validator warnings are transitional allowances covering documents authored before the metadata standard required a normativity map and a dependency-reference split.

## 7. Related Documents

*This section is informative.*

- [Repository Audit Capability](../09-capabilities/CAP-0001-repository-audit.md)
- [Artifact Type Inventory](artifact-type-inventory.md)
- [Framework Architecture Review](framework-architecture-review.md)
- [Documentation Validation Report](../validation-report.md)
- [ADR-0005](../ADR/ADR-0005-artifact-types-as-declarations.md)
- [ADR-0006](../ADR/ADR-0006-artifact-instance-identity.md)
