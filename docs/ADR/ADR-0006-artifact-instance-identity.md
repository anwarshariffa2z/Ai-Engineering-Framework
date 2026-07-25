---
id: ADR-0006
title: Identify Artifact Instances by Logical Identity and Resolve Location Separately
version: 1.0.0
status: Accepted
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-26
review_cycle: Event-driven
category: Architecture Decision Record
tags: [architecture, artifacts, identity, addressing, lineage]
related: [README.md, ADR-0004-depend-on-artifact-types.md, ADR-0005-artifact-types-as-declarations.md, ../02-methodology/artifact-specification.md, ../02-methodology/contract-specification.md, ../01-foundation/framework-artifact-model.md, ../09-capabilities/CAP-0001-repository-audit.md]
depends_on: [../02-methodology/artifact-specification.md, ../02-methodology/contract-specification.md, ../02-methodology/metadata-specification.md]
references: [README.md, ADR-0004-depend-on-artifact-types.md, ADR-0005-artifact-types-as-declarations.md, ../01-foundation/framework-artifact-model.md, ../09-capabilities/CAP-0001-repository-audit.md]
---

# ADR-0006: Identify Artifact Instances by Logical Identity and Resolve Location Separately

- Status: Accepted
- Date: 2026-07-26
- Owners: Framework Maintainers

## Problem Statement

The framework defines methodologies, standards, artifact type declarations, and validators. It does not define what an artifact instance *is called*.

[STD-0008](../02-methodology/artifact-specification.md) R-06 already decides part of this: an instance is addressable as the pair of its run identity and its type identity. But nothing states what a run identity is composed of, whether it means anything outside the repository that produced it, or how a consumer turns an identity into bytes it can read.

The consequences are concrete rather than theoretical. [STD-0011](../02-methodology/contract-specification.md) R-40 obliges a consumer to address artifacts by identity rather than by path — an obligation no consumer can currently discharge, because no identity grammar exists. [STD-0008](../02-methodology/artifact-specification.md) R-19 obliges lineage to record an upstream address, with no definition of what an address is. R-20 requires the derivation graph to be acyclic across a composition that [CAP-0001](../09-capabilities/CAP-0001-repository-audit.md) intends to span repositories, over a graph whose edges cannot yet be written down. [STD-0011](../02-methodology/contract-specification.md) R-43 forbids presenting stale and current artifacts as concurrently valid, without any means of determining that an upstream artifact was regenerated.

This is the question [Framework Artifact Model](../01-foundation/framework-artifact-model.md) section 19 recorded as open, and it is the last architectural question the framework has left. Every other blocker on executing CAP-0001 has been closed by a document; this one cannot be, because it is a design decision rather than a missing specification.

Two properties make now the right moment. **No artifact instance exists**, so nothing has to be migrated. And the framework has just established, in [ADR-0005](ADR-0005-artifact-types-as-declarations.md), the principle that decides where things belong: standards own normative behavior, declarations own variability.

## Recommended Decision

An artifact instance is named by a **logical identity** that contains no hosting information. Where a copy of it can be fetched is a **resolution**, declared per run, and is never part of the identity.

**Canonical identity.** The identity of an artifact instance is the composition already required by STD-0008 R-06, with the run component given a grammar:

```
<subject-authority>/<subject-name>@<subject-revision>#<run-discriminator>/<type-identity>@<type-version>
```

The subject authority is a namespace reserved by an organization, in the sense [STD-0010](../02-methodology/metadata-specification.md) R-08 already defines, and is not a host, a URL, or a repository location. The subject revision is the immutable revision every methodology already requires as input. The run discriminator distinguishes two runs over the same subject at the same revision, which differ legitimately by declared scope, authorization, or executor. The type identity and version are the declaration's, per [STD-0013](../02-methodology/artifact-type-declaration-standard.md).

Identity is therefore **derivable rather than issued**. Nothing has to allocate it, no registry has to exist for it to be written, and two parties who know the subject, the revision, the run, and the type compute the same identity without coordinating.

**Instances are not versioned.** STD-0008 already states this and this record does not disturb it. Re-running a methodology produces a new run and therefore a new identity — not a new version of the same artifact. The three things casually called "version" are separated: the *subject revision* is what was examined, the *type version* is which contract was satisfied, and the instance has neither.

**Immutable and mutable references.** A reference that binds every component of the identity, together with a content digest of the artifact's serialization, is **immutable**: it denotes one byte sequence permanently. A reference that leaves the run discriminator or the subject revision unbound — "the most recent run of this subject, this type" — is **mutable**, and resolves differently over time.

Both are legitimate, and one rule governs them: **lineage records immutable references only.** A mutable reference in lineage would let an upstream input silently re-point after a downstream conclusion was drawn from it, which makes STD-0008 R-19 lineage and STD-0011 R-43 staleness detection into decoration. A digest change is the definition of upstream regeneration, and it is what makes staleness mechanically detectable rather than a matter of trust.

**Provenance crossing a boundary.** A reference that leaves the run that produced it carries a summary of the referenced artifact's envelope: its identity, type version, subject revision, completeness state, redaction state, and aggregate evidence state and confidence. A consumer can then decide whether to use the artifact **without fetching it**, and can correctly decide to reject it when it cannot.

This is deliberately the same property STD-0008 R-08 gives the envelope with respect to the type definition. Generic machinery must be able to act on an artifact it cannot fully read, and the reason is identical in both cases: a consumer that must fetch and parse before it can decide whether it is allowed to fetch has no way to fail closed.

**Cross-repository lineage.** No additional mechanism. A lineage edge is identity to identity, and an identity already carries a subject authority, name, and revision, so an edge that leaves the repository is indistinguishable in form from one that does not. Where a referenced identity cannot be resolved, the composition **fails closed**: the input is recorded `Unavailable` and every dependent record is capped, exactly as [STD-0011](../02-methodology/contract-specification.md) already requires for a missing input. Unresolvable is never read as absent.

### The principles this establishes

**Identity is logical. Location is resolvable. Integrity is verifiable.**

Each sentence assigns one concern to one mechanism, and the value of the decision lies in their being three sentences rather than one. A framework that answers all three with a single mechanism has to weaken whichever property the mechanism serves worst, and every rejected alternative below is an instance of exactly that compromise.

### The Artifact Identity Triad

The framework separates naming, locating, and verifying an artifact instance into three concepts that are defined independently and composed at use.

**Logical Identity.** The stable logical name of an artifact instance, expressed in the canonical grammar above. It is derived from the subject, its revision, the run, and the type, and it contains no hosting information. It is computable before the artifact exists, which is what allows a consumer to request an artifact rather than merely to recognize one it already holds. Two parties compute the same identity without coordinating, and re-execution over the same inputs reproduces it exactly.

**Resolution.** The mapping from a logical identity to physical storage. It is declared per run, is deployment-specific, and is never part of the identity. Moving artifacts between a filesystem, an object store, and a registry changes resolution and renames nothing. Resolution can fail, and its failure is a recoverable condition with a defined duty attached, not a malformed reference.

**Integrity.** Immutable verification by content digest. A digest is a fingerprint over an artifact's serialization: it answers whether two byte sequences are the same artifact, and it cannot exist until the artifact does. It is what makes a lineage reference immutable and upstream regeneration mechanically detectable, and it is the only mechanism that reveals two resolvers disagreeing about one identity.

The separation is deliberate. Identity is stable, resolution is deployment-specific, and integrity is verifiable — three properties with three different lifetimes, three different owners, and three different failure modes. Collapsing any pair of them transfers one concern's volatility onto the other: a name built from a location changes whenever the artifact moves, and a name built from a digest cannot be written down until the work it names is finished. Held apart, each is free to change on its own schedule without invalidating the other two.

## Architectural Rationale

The decision separates three things the alternatives conflate: a **name**, a **location**, and a **fingerprint**. Each answers a different question, and each fails at the other two.

A name says which artifact is meant, and must be computable before the artifact exists so that a consumer can ask for it. A location says where a copy currently sits, and must be free to change without renaming anything. A fingerprint says whether two byte sequences are the same artifact, and cannot be known until the artifact exists. The framework needs all three; the error every rejected alternative makes is using one of them for a job it cannot do.

The decision also inherits ADR-0005's principle rather than inventing a new one. The identity **grammar** is normative behavior and belongs in a standard; the **resolver configuration** for a particular run is variability and belongs in data. Nothing about where an organization stores artifacts enters the normative core, which is what keeps the framework deployable against a filesystem, an object store, an artifact registry, or a service without any of them being blessed.

The object model is untouched, and specifically it does not need a ninth type. A run is already defined by STD-0008 as "a grouping and addressing context, not a framework object type", and this record gives that context a grammar rather than promoting it. A resolver is automation, and the core architecture already establishes that automation is an actor rather than a layer — the same reasoning that keeps the validator out of the stack keeps the resolver out of it.

## Consequences

Identity becomes writable, so the obligations that already depend on it become dischargeable. STD-0011 R-40, STD-0008 R-19, and STD-0008 R-20 stop being requirements no participant can satisfy.

Staleness becomes mechanical. An upstream digest that differs from the one recorded in lineage is regeneration, and the downstream artifact is stale by inspection rather than by claim.

Reproducibility survives re-execution. Because identity is derived from subject, revision, run, and type rather than issued at production time, re-running a methodology over the same inputs produces the same identity — which an opaque identifier would not.

Cross-repository composition becomes expressible without any shared infrastructure. Two organizations exchange artifacts by exchanging identities and envelope summaries; whether either can resolve the other's identities is a deployment question and does not affect whether the reference is well formed.

**The run discriminator is the decision's weak joint**, and it is recorded rather than argued away. Two runs over the same subject and revision that differ only in declared scope must not collide, and nothing in this record guarantees that an orchestrator chooses discriminators that make them distinct. A careless orchestrator can produce two artifacts with one identity, and no rule here detects it. Making the discriminator a function of the run's declared scope and authorization was considered and deferred, because it would bind identity to fields whose canonical serialization is not yet specified.

A resolver is now a thing the framework expects to exist without specifying. That is intentional and it is a cost: two conforming implementations may resolve the same identity to different bytes, and only the digest reveals it.

Nothing is implemented by this record. The identity grammar, the digest, the immutable-lineage rule, and the resolution-failure duty are all standard revisions, and this record authorizes none of them.

## Affected Standards

No standard is modified by this record. The following are named so that the revision milestone has a scope rather than a discovery process.

| Standard | What it needs |
| --- | --- |
| STD-0008 Artifact Specification | The identity grammar behind R-06; the content digest as an envelope member; the definition of an upstream address in R-19 |
| STD-0011 Contract Specification | The immutable-reference-in-lineage rule; the duty on a consumer facing an unresolvable identity; staleness in R-43 defined by digest change |
| STD-0010 Metadata Specification | Whether an artifact identity is admissible in the reference grammar of R-07, and the canonical serialization of the identity string |
| STD-0012 Validation Specification | Validator behavior on an unresolvable identity and on a mutable reference found in lineage |
| STD-0013 Artifact Type Declaration | **Nothing.** Declarations describe types; identity is a property of instances |

That STD-0013 is untouched is a check on the decision rather than a convenience. If naming instances had required changing how types are declared, the separation ADR-0005 established would have been wrong.

**One lesson is carried forward explicitly.** ADR-0005 named one affected standard and implementation found a second: STD-0010 had to admit `artifact_types` as a framework key. STD-0010 appears in the table above for the same reason — an identity string is a new kind of value in metadata, and its admissibility under R-07 must be settled before the first artifact is written, not after.

## Migration Strategy

**None is required.** No artifact instance exists in any repository, so there is nothing to rename, re-address, or re-link.

This is the last revision at which that is true. Every rejected alternative below becomes materially more expensive once instances exist, and the path-based alternative becomes effectively irreversible, because a corpus of artifacts referring to one another by path cannot be re-identified without rewriting all of them at once.

## Alternatives Considered

**Repository-relative path addressing.** Artifacts are named by their path relative to the audited repository or the run's output directory. Rejected. It is directly prohibited by [STD-0011](../02-methodology/contract-specification.md) R-40, which requires addressing by identity rather than by path, and the prohibition is well founded: a path makes location into identity, so moving a file breaks every downstream reference and copying one creates a second artifact with a different name and identical content. It cannot express a reference to another repository at all. Its only merit is that it requires nothing, and that merit expires the first time an artifact is moved.

**Globally unique opaque identifiers.** Each artifact receives a generated identifier at production time. Rejected as the primary identity. Uniqueness is guaranteed without coordination, which is real, but three properties fail. An opaque identifier cannot be computed before the artifact exists, so a consumer cannot request the artifact it needs — it can only recognize one it already holds. Re-running a methodology over an identical subject at an identical revision yields a different identifier for an artifact asserting exactly the same thing, which destroys reproducibility, the property CAP-0001 exists to provide. And resolution requires a registry to map identifiers to anything, which makes a service a precondition for reading a reference.

**URI-based addressing with an authority component.** Artifacts are named by a URI whose authority segment identifies the hosting party. Rejected in that form, and partly accepted in another. The structure is right and the recommendation borrows it: a hierarchical, human-readable, extensible name with an authority-like leading segment. What is rejected is the authority segment denoting a *host*, because that puts location inside identity and reintroduces the path problem with better syntax — an artifact served from a different host would have a different name despite being the same artifact. The recommendation keeps the shape and replaces the host with a reserved organizational namespace, which STD-0010 R-08 already defines.

**Content-addressed identity.** The identity of an artifact is a cryptographic digest of its serialization. Rejected as identity, and accepted as the immutable reference. As identity it fails on the same property as opaque identifiers and one worse: the digest cannot be known until the artifact exists, so no consumer can express what it wants, and any change to an envelope field that carries no assertion — a generation timestamp, for instance — produces a different identity for an artifact making identical claims. As a *fingerprint* it is exactly right, and it is what makes lineage immutable and staleness detectable. This alternative was not so much rejected as reassigned to the job it can do.

**A central artifact registry service.** A framework-owned service allocates identities and resolves them to locations. Rejected. It solves cross-repository resolution completely and introduces a runtime dependency, an availability requirement, and a governance question the framework has deliberately avoided since [ADR-0001](ADR-0001-framework-foundation.md) established it as documentation-first. It would also make identity depend on a service being reachable at the moment an artifact is produced. It remains permissible as one implementation of a resolver, which is the correct status for it: available to adopters who want it, required of nobody.

**Hybrid identity and location model.** Logical identity for naming, content digest for immutability, resolver configuration for location. **Accepted.** It is the only alternative that assigns each of the three jobs to a mechanism that can perform it, and the only one that leaves the object model, the layer model, and the type declarations untouched.
