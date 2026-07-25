---
id: REF-0023
title: Framework Operationalization Roadmap
version: 1.0.0
status: Draft
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-26
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
| Complete standards suite — eight standards, 242 requirements | `docs/02-methodology/` |
| Complete methodology suite — ten approved methodologies | `docs/03-audit-engine/` |
| Artifact declaration framework — one standard, ninety-three declarations | [STD-0013](../02-methodology/artifact-type-declaration-standard.md), `docs/10-artifact-types/` |
| Generic reference validator — sixty-eight bound checks, no type-specific logic | `tools/validator/` |
| Complete architectural traceability — six decision records, retired-requirement registry, exception register | `docs/ADR/`, [validation report](../validation-report.md) |
| Artifact instance identity architecture | [ADR-0006](../ADR/ADR-0006-artifact-instance-identity.md) |

No architectural question remains open. The two sub-decisions [ADR-0006](../ADR/ADR-0006-artifact-instance-identity.md) defers — a derivation rule for the run discriminator, and whether the framework specifies a resolver contract — are refinements inside an accepted decision, and both are recorded there.

## 3. What Operationalization Means

*This section is informative.*

Construction asked whether the framework is coherent. Operationalization asks whether it survives contact with a real repository.

The distinction is practical. The framework ships artifact *types* and has never produced an artifact *instance*, which is why 174 of its 242 requirements are reported not-evaluated rather than passing: their subjects — instances, producers, consumers, and conclusions — do not exist in the corpus. Producing the first conforming instance is what moves those requirements from dormant to enforced, and no further document can do it.

Nothing in this phase redesigns the architecture. Where a workstream needs normative support it revises an existing standard under an accepted decision, which is authoring rather than architecture.

## 4. Workstreams

*This section is informative.*

Ordered by dependency, not by priority. The first four are prerequisites for the rest.

| Workstream | Outcome |
| --- | --- |
| Carry ADR-0006 into STD-0008 | The identity grammar behind R-06, the content digest as an envelope member, and the definition of an upstream address in R-19 |
| Carry ADR-0006 into STD-0010 | Admissibility of an artifact identity under the R-07 reference grammar, and the canonical serialization of an identity string |
| Carry ADR-0006 into STD-0011 | Immutable references in lineage, the duty on a consumer facing an unresolvable identity, and staleness defined by digest change |
| Carry ADR-0006 into STD-0012 | Validator behavior on an unresolvable identity and on a mutable reference found in lineage |
| Reference Producers | An executable implementation of at least one methodology, emitting conforming instances of its declared types |
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

The four carriage workstreams precede the producer workstreams, because a producer cannot record a lineage reference the standards do not define. The corpus precedes validator expansion, because a check without a subject is a check that cannot run. Everything after that is parallelizable.

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
