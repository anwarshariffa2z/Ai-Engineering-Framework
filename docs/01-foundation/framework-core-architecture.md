---
id: DOC-0006
title: Framework Core Architecture
version: 2.0.0
status: Draft
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Event-driven
category: Foundation
tags: [architecture, object-model, platform, extensibility, automation, capability]
related: [framework-architecture.md, ownership-model.md, ../02-methodology/document-metadata-standard.md, ../02-methodology/document-id-standard.md, ../02-methodology/glossary.md, ../07-roadmap/framework-architecture-review.md, ../ADR/ADR-0001-framework-foundation.md]
---

# Framework Core Architecture

## 1. Purpose and Revision Note

This document designs the core architecture of the AI Engineering Framework as a software platform: the objects it is built from, how they relate and depend on one another, how they are layered, how the platform extends, how AI agents consume it, and how automation binds to it.

It is an architectural design document — not a specification, not an implementation guide, not a standard. Nothing here imposes an obligation until a standard adopts it.

**This is revision 2.0.0, produced by peer review of revision 1.0.0.** The revision reverses three significant decisions from the previous proposal and consolidates the object model from sixteen types to eight. The prior version is superseded in full; where this document contradicts it, this document is correct. Section 3 records every accepted, rejected, and modified decision with its rationale, so that the reasoning is auditable rather than merely asserted.

The revision was governed by one test applied to every element of the previous design: **does this earn its complexity?** Several things that were architecturally tidy did not.

## 2. Design Objectives, in Priority Order

The previous revision optimized for completeness of the model. This one optimizes for use. When two objectives conflict, the higher one wins.

1. **Simplicity.** A contributor must be able to hold the model in their head. A model requiring a reference table to use is a failed model.
2. **AI efficiency.** The primary consumer has a bounded context window and no memory. Traversal cost is a first-class design constraint, not a downstream concern.
3. **Automation readiness.** Every normative statement must be mechanically checkable or explicitly marked as judgment-only.
4. **Extensibility.** The five known extension directions must require no new object type.
5. **Long-term maintainability.** Fewer types, fewer homes per concept, fewer synchronized edits.

Theoretical elegance is not on the list. The previous nine-layer model was elegant and harder to use than a five-layer model that expresses the same constraints.

## 3. Decision Register

### 3.1 Accepted from revision 1.0.0

| Decision | Rationale for retention |
| --- | --- |
| Authored / generated / instance separation | The single most load-bearing idea in the previous revision. Every scaling failure in the current repository descends from conflating them. Unchanged. |
| Nothing authored may depend on anything generated | Makes regeneration safe. Without it, authority leaks into output and generation becomes destructive. Unchanged. |
| Nothing depends on a Decision Record | Immutable history must not constrain the present. Unchanged. |
| Methodologies depend on Artifact **types**, never on producing Methodologies | The decision that makes playbooks substitutable. Retained and promoted to a principle. |
| Acyclicity enforced by layer index, not reviewer vigilance | Structural enforcement beats process enforcement. Retained with fewer layers. |
| Identity is the address; paths are incidental | Required for reorganization without breaking consumers. Unchanged. |
| Metadata is the machine interface | Strengthened. It now carries the requirement declarations that the Rule object previously carried. |
| Provider neutrality with generated adapters | Adding an AI provider must add a generator, not a document. Unchanged. |

### 3.2 Rejected from revision 1.0.0

| Rejected | Why it was proposed | Why it is rejected |
| --- | --- | --- |
| **Rule as an object type** | To give validators something executable to bind to | The previous revision itself stated that a Rule "has no independent authority; it cannot require something its Standard does not." An object that owns nothing and inherits everything is not an object — it is a field. See section 5. |
| **Principle as an object type** | To hold terminal justifications | A Principle is a Standard with no dependencies. That property is visible from its dependency list; it does not need a type. Merged into Standard. |
| **Concept as an object type** | To make vocabulary authoritative | Correct problem, wrong granularity. One object per term produces hundreds of near-empty objects. A vocabulary Standard achieves authority at a fraction of the cost. Merged into Standard. |
| **Policy as an object type** | To separate repository governance from AI-system guidance | The separation is real but is an audience distinction, not a structural one. Expressed as metadata on a Standard. Merged. |
| **Example as an object type** | To hold worked demonstrations | Subsumed by the normative/informative split (section 6). An Example is an informative object. Merged into Guide. |
| **Template as an object type** | To hold canonical structure | A template is a scaffold derived from a type's declared shape. Generating it guarantees conformance; authoring it invites drift from the schema it is supposed to embody. Becomes a generated View. |
| **Evidence as a top-level type** | To make provenance first-class | Evidence is never produced, owned, versioned, or consumed independently of the Artifact containing it. It is the record structure of an Artifact, and modelling it separately added an object without adding a boundary. Merged into Artifact. |
| **Index, Report, Checklist as three types** | To name three familiar outputs | All three are generated projections over other objects. Their differences — what they project and for whom — are metadata, not type. Merged into View. |
| **Nine-layer model** | To order objects by dependency depth precisely | Correct constraints, excessive granularity. Five layers express the same acyclicity with materially lower cognitive cost. See section 8. |
| **Process as a type distinct from Methodology** | Processes respond to situations; methodologies examine subjects | Both are executable procedures with stages, roles, gates, required evidence, and declared outputs. The difference is what they are *for* — which is now expressed by Capability. Merged into Methodology. |

### 3.3 Modified from revision 1.0.0

| Modified | Change | Rationale |
| --- | --- | --- |
| Requirement checkability | From a Rule object to structured requirement declarations inside a Standard's metadata | Same automation capability, one fewer type, and drift becomes structurally impossible because requirement and Standard share a file and a version. |
| Capability | From a generated index to a **first-class authored object** | Composition must be authored. No single Methodology can declare that eleven Methodologies compose into "Repository Audit". This is the largest addition in the revision. |
| Normative / informative | From an implicit property of object type to an **explicit, universal, section-level declaration** | Becomes the primary lever for AI context economy and the binding surface for validators. Promoted to a principle. |
| AI traversal | From three tiers with a capability index to **Capability-first traversal** | The entry point is now an authored object that declares its own dependency closure, so an agent performs no exploratory reading. |
| `related` metadata | Split into `depends_on` and `references` | The previous revision assumed the distinction; this one requires it. Dependency is checkable; reference is not. |
| Automation position | Unchanged as an actor rather than a layer, but stated earlier and more strongly | It was buried in the previous revision and readers took the example layering literally. |

## 4. The Object Model

Eight types, in three families. Every type has one responsibility that no other type has. If a candidate type's responsibility can be expressed as metadata on an existing type, it is metadata.

### 4.1 Authored objects

Written by people, versioned deliberately, reviewed, registered.

---

**STANDARD** — *the only source of normative authority*

Every requirement in the framework lives in a Standard. Nothing else may require anything.

- **Purpose.** State what MUST, SHOULD, and MAY be true for a bounded subject area.
- **Absorbs.** Principle (a Standard with no dependencies), vocabulary (a Standard whose requirements define terms), Policy (a Standard whose audience is contributors rather than AI systems).
- **Responsibilities.** Express each requirement as an individually addressable, structured declaration. Declare each requirement's checkability. Cite the Standards it depends on. Never embed a procedure or a scaffold.
- **Ownership.** A named domain owner.
- **Lifecycle.** Draft → Approved → Deprecated → Superseded. Material change requires a Decision.
- **Key metadata.** Subject area; audience; requirement declarations, each with identity, normative level, checkability, severity, and scope; `depends_on`; context cost.
- **Depends on.** Standards only.
- **Consumed by.** Methodology, Capability, Guide, validators, agents.
- **Produced by.** Maintainers.

---

**METHODOLOGY** — *the only executable procedure*

- **Purpose.** Define an ordered, evidence-led procedure that examines a subject and produces typed Artifacts.
- **Absorbs.** Audit Playbook, Process, Command. An incident response and a database audit have the same shape: stages, roles, gates, required evidence, declared outputs, failure conditions, acceptance criteria.
- **Responsibilities.** Declare stages. Declare the Artifact types it produces and consumes. Conform to Standards by reference, never by restatement. Declare its safety boundaries as structured metadata a harness can enforce, not as prose an agent must remember. Declare its executor type: human, agent, or either.
- **Ownership.** A named domain owner.
- **Lifecycle.** Draft → Approved → Deprecated → Superseded. A change to the produced-Artifact set is breaking.
- **Key metadata.** Artifact types produced and consumed; Standards referenced; executor type; safety boundaries; applicability and not-applicable conditions; estimated context cost.
- **Depends on.** Standard; Artifact *types* it consumes — never the Methodology that produces them.
- **Consumed by.** Capability, agents, downstream Methodologies.
- **Produced by.** Maintainers, scaffolded from a generated View.

---

**CAPABILITY** — *the framework's public API*

The addition that most changes the architecture.

- **Purpose.** Declare a named outcome the framework can deliver, and bind together everything required to deliver it.
- **Why it must be authored, not generated.** "Repository Audit" composes eleven Methodologies with a composition rule for their health scores and an ordering constraint on their Artifact dependencies. No Methodology can declare that composition, because no Methodology knows it is part of one. Composition is intent, and intent is authored.
- **Responsibilities.** State the outcome in the requester's language. Declare its dependency closure — every Methodology, Standard, and Artifact type needed. Declare preconditions, executor requirements, and composition rules across constituent Methodologies. Serve as the agent entry point.
- **Ownership.** A named capability owner.
- **Lifecycle.** Draft → Approved → Deprecated → Superseded.
- **Key metadata.** Outcome statement; trigger phrasing an agent can match; constituent Methodologies with ordering; Standards governing the outcome; Artifact types produced; preconditions; executor requirements; total context cost of its closure.
- **Depends on.** Methodology, Standard.
- **Consumed by.** Agents (as the primary entry point), humans selecting work, generated navigation.
- **Produced by.** Maintainers.

Examples in the current corpus: Repository Audit, Architecture Review, Documentation Validation, Release Management, Risk Assessment. Section 10 develops the model.

---

**GUIDE** — *informative content with no authority*

- **Purpose.** Explain, illustrate, or demonstrate. Never require.
- **Absorbs.** Example, tutorial, rationale, onboarding material.
- **Responsibilities.** Contain no normative statement. Cite the Standards it explains. Declare the Standard versions it reflects, so staleness is detectable.
- **Lifecycle.** Draft → Approved → Deprecated. Deprecated automatically when a cited Standard changes materially — a stale example is worse than none, because it is copied.
- **Depends on.** Standard, Methodology, Capability.
- **Depended on by.** Nothing, ever.

---

**DECISION** — *immutable history*

- **Purpose.** Preserve a decision, its context, alternatives, and consequences.
- **Responsibilities.** Record why, not only what. Name what it supersedes. Never be rewritten after acceptance.
- **Lifecycle.** Proposed → Accepted → Superseded. Never edited, never deleted.
- **Depends on.** Nothing. **Depended on by.** Nothing. This double asymmetry is what lets history grow without constraining the present or being constrained by it.

### 4.2 Instance objects

Produced by applying the framework to a subject. Owned by the adopting organization. **The framework ships their types and schemas and stores none of their instances.**

---

**MANIFEST** — *the declared subject*

- **Purpose.** Declare what is being examined: identity, owners by role, risk tier, revision, evidence locations.
- **Depends on.** Standard (for its required shape). Depended on by nothing framework-owned.
- **Produced by.** Adopting teams.

---

**ARTIFACT** — *typed output with embedded evidence*

- **Purpose.** Hold the structured output of a Methodology run against a Manifest.
- **Absorbs.** Evidence, as its record structure. Every Artifact row carries its own provenance: source, location, environment, revision, collector, redaction state, evidence state, and confidence.
- **Why Evidence is not separate.** It is never produced, versioned, owned, or consumed independently of its Artifact. Separating it added an object without adding a boundary.
- **Critical property.** Artifact **types** are the contract between Methodologies. A type change is breaking. A conforming Artifact may be produced by any Methodology, which is what makes Methodologies substitutable.
- **Depends on.** Methodology, Manifest, Artifact types it derives from.

### 4.3 Generated objects

Produced by automation from authored inputs. Never hand-edited. Reproducible.

---

**VIEW** — *every projection*

- **Purpose.** Present a projection over other objects for a declared audience and purpose.
- **Absorbs.** Index, Registry, Report, Checklist, Template scaffold, navigation, provider adapter, published documentation.
- **Why one type.** All are the same operation: read objects, filter, project, render. Their differences are entirely metadata — what is projected, for whom, in what format. Three or six types would each need identical provenance, regeneration, and non-authority rules.
- **Responsibilities.** Be complete for its declared scope. Be reproducible. Carry provenance: generator identity and version, source revision, generation time. **Never be the authority for any fact it presents.**
- **Lifecycle.** Regenerated on source change. Never hand-edited. Not independently versioned.
- **Depends on.** Whatever it projects. **Depended on by.** Nothing authored.

### 4.4 What each type uniquely owns

The test for justified type count. If two rows could share a sentence, one type is unnecessary.

| Type | Sole responsibility |
| --- | --- |
| Standard | Normative authority |
| Methodology | Executable procedure |
| Capability | Composition of procedures into a named outcome |
| Guide | Explanation without authority |
| Decision | Immutable historical record |
| Manifest | Declaration of the examined subject |
| Artifact | Typed output carrying its own evidence |
| View | Generated projection with no authority |

Eight, from sixteen. No capability was lost; five types became metadata, three merged into one, and one was added.

## 5. Requirement Checkability: Rule Object versus Metadata

The design brief asked for a comparison of two options and a recommendation.

**Option A — Standard → Rule → Validator.** Each requirement becomes a separate addressable object deriving authority from its Standard. Validators bind to Rule identities.

**Option B — Standard → Metadata → Validator.** Each requirement becomes a structured, individually addressable declaration inside the Standard's metadata. Validators bind to requirement identities of the form `STD-0001#R-03`.

### 5.1 Comparison

| Dimension | Option A (Rule object) | Option B (metadata) |
| --- | --- | --- |
| Automation capability | Full | Full — identical information, different location |
| Individual addressability | By object identity | By fragment identity; equivalent in practice |
| Drift risk between requirement and Standard | Real; two objects, two versions, two files | **Structurally impossible**; same file, same version |
| Authoring cost | New object per requirement, each needing metadata, registration, lifecycle | A block in the Standard being written anyway |
| Object count at current corpus | Est. 150–300 Rule objects | Zero new objects |
| Registry and review load | Every requirement is a registered document | None |
| Agent cost to load one requirement | One object, but discovery requires an index | One fragment from a Standard the agent likely needs anyway |
| Third-party requirement addition | Add a Rule referencing someone else's Standard | Add a Standard in your own namespace |
| Composition into checklists | Via generated View over Rules | Via generated View over Standard metadata |

### 5.2 Recommendation: Option B

**The deciding argument is internal to the previous proposal.** Revision 1.0.0 specified that a Rule "has no independent authority; it cannot require something its Standard does not," that its ownership is "inherited from the Standard," and that its lifecycle is "bound to its Standard's lifecycle." A thing with no independent authority, no independent ownership, and no independent lifecycle is not an object. It is a field that has been given a file.

Three supporting arguments:

**Drift.** The Rule object exists to prevent standards and checks from diverging. But separating a requirement from its Standard *creates* the divergence risk it was meant to solve: two files, two versions, two edits. Option B makes divergence structurally impossible, because the requirement and its authorizing text share a file and a version number. The abstraction was solving a problem it introduced.

**Third-party extension.** The one capability Option A appears to offer — adding requirements without touching Standards — is a capability the framework should not want. A requirement without an authorizing Standard has no authority. The correct extension model is that an organization adds its own Standard in its own namespace, which Option B supports and which keeps authority traceable.

**Agent economy.** Under Option A, answering "does this comply?" means resolving an index, loading N Rule objects, and loading the Standard for context. Under Option B it means loading one Standard and reading its normative sections. Option B is cheaper in exactly the case that matters most.

**Consequence.** The layer previously named "Executable Surface" disappears. Section 8's layer count falls by one for this reason, and by three more for merges.

**What Option B requires to work.** Requirement declarations must be structured, not prose; individually addressable; carry normative level, severity, scope, and checkability; and declare judgment-only status explicitly rather than by omission. These are metadata-model obligations, recorded in section 12.

## 6. Normative and Informative Separation

The brief asked whether every document should distinguish required from explanatory content, and whether this should be a universal principle.

**Recommendation: yes, universally, at section granularity.**

This is the highest-leverage decision in the revision, because it serves four objectives simultaneously.

**It is the primary lever for AI context economy.** An agent answering a compliance question needs normative content only. In the current corpus, AUD-0003 runs to roughly 11,800 words, of which the binding requirements are a minority; an agent must currently load all of it to find them. With section-level normativity declared in metadata, the agent loads the normative subset. This is a several-fold reduction in context cost on the framework's most common operation, achieved without rewriting a word of content.

**It gives validators a precise binding surface.** A validator that binds to normative sections cannot accidentally enforce an example, and a reviewer can see exactly what is being enforced.

**It resolves a real ambiguity in the current corpus.** The two audit playbooks mix requirements, rationale, examples, and anti-patterns in continuous prose. A reader cannot reliably tell whether "prefer the narrowest conclusion supported by the evidence" is binding. Neither can an agent.

**It eliminates a type distinction.** Type declares *authority*: a Standard may contain informative sections, clearly marked; a Guide may contain none that are normative. Section declares *normativity*. Two orthogonal properties, correctly separated, replacing what would otherwise be several document types.

**Adopted as principle P-04** in section 9.

## 7. The Relationship Model

Read `A --verb--> B` as "A relates to B in this way". Dependency edges are marked `[D]`; the rest are references.

```
Standard      --[D] depends on-->        Standard          (vocabulary and foundational standards depend on nothing)
Standard      --declares-->              Requirement       (structured metadata, not an object)
Standard      --explained by-->          Guide

Methodology   --[D] conforms to-->       Standard
Methodology   --[D] consumes-->          Artifact TYPE     (never the producing Methodology)
Methodology   --produces-->              Artifact TYPE
Methodology   --consumes-->              Manifest

Capability    --[D] composes-->          Methodology
Capability    --[D] governed by-->       Standard
Capability    --declares-->              Artifact TYPE set
Capability    --entry point for-->       Agent

Manifest      --[D] shaped by-->         Standard
Manifest      --describes-->             Subject           (external to the framework)

Artifact      --[D] produced by-->       Methodology
Artifact      --[D] describes-->         Manifest subject
Artifact      --contains-->              Evidence records
Artifact      --checked against-->       Requirement

View          --[D] projects-->          any authored object, Artifact
Guide         --[D] explains-->          Standard, Methodology, Capability
Decision      --records decision about-->any object

Automation    --reads-->                 Requirements, metadata, authored objects
Automation    --writes-->                View
Agent         --enters at-->             Capability
```

**The worked example from the brief, resolved.** An Audit Playbook that "produces Artifacts and references Standards, Validation Reports, Templates, Checklists, and Commands" becomes:

```
Capability   composes    Methodology
Methodology  conforms to Standard          (by reference, never restatement)
Methodology  produces    Artifact          (typed; the contract)
View         renders     Artifact          -> "validation report"
View         projects    Requirements      -> "checklist"
View         projects    type schema       -> "template"
Methodology  absorbs     Command / Process
```

Four of the six things the playbook appeared to relate to are the same object type — View — and none of them is produced by the playbook. This is the model doing useful work: it collapses four relationships into one and removes three false ownership claims.

**Three permanent asymmetries.** Nothing depends on a Decision. Nothing depends on a Guide. Nothing authored depends on a View. Each prevents a distinct coupling failure; together they are why history, illustration, and generation can all change freely.

## 8. The Layer Model

Revision 1.0.0 used nine layers. Understandability outranks precision here: the same acyclicity is expressible in five, and five can be recalled without a reference table.

```
L0  NORMATIVE       Standard
        |               all authority; vocabulary and principles are Standards with no dependencies
        v
L1  PROCEDURE       Methodology
        |               executable; conforms to L0 by reference
        v
L2  CAPABILITY      Capability
        |               composes L1; the agent entry point
        v
L3  INSTANCE        Manifest, Artifact
        |               owned by the adopter; the framework ships types, never instances
        v
L4  PROJECTION      View
                        entirely generated; never authored, never depended upon

Outside the stack:
    Decision        immutable history; depends on nothing, depended on by nothing
    Guide           informative; depends on L0-L2, depended on by nothing
    Automation      an ACTOR, not a layer
```

**The invariant.** An object may depend only on strictly lower layers. Same-layer dependency is permitted only within L0, where it is required — a Standard depending on a vocabulary Standard — and where the subgraph is checked for acyclicity mechanically.

**Automation is not a layer.** This bears repeating because the previous revision's readers took an example layering literally. A validator reads Requirements at L0 and writes a View at L4; it does not sit between L3 and L4. Automation and agents operate *across* the stack. Any model that places automation inside the stack forces every generated object to be produced by the layer beneath it, which is false.

**Why five and not four.** Merging Capability into Procedure was considered and rejected: Capability depends on Methodology, so merging them creates same-layer dependency in the busiest part of the model, precisely where mechanical acyclicity checking is most valuable.

**Why five and not nine.** The four removed layers were Vocabulary, Executable Surface, Forms, and Observations. Vocabulary is a Standard. Executable Surface is metadata (section 5). Forms are generated Views. Observations merged into Instance when Evidence merged into Artifact. Every constraint the nine layers expressed is still expressed.

## 9. Framework Principles

Twelve principles. The previous fifteen contained overlap; each below states one constraint and the failure it prevents.

**P-01 — One home per concept.** Every concept, requirement, and model lives in exactly one object; everything else references it. Verbatim duplication is a defect regardless of convenience. *Prevents: n copies requiring synchronized edits.*

**P-02 — Metadata is the interface.** Anything a consumer needs in order to decide whether to read an object lives in metadata. *Prevents: agents reading objects to discover irrelevance.*

**P-03 — Identity is the address.** Objects are addressed by stable identity; paths are incidental. *Prevents: every consumer breaking when a file moves.*

**P-04 — Normativity is declared, never inferred.** Every section is explicitly normative or informative. *Prevents: readers and agents guessing what binds.*

**P-05 — Every requirement declares its checkability.** A requirement is machine-checkable or explicitly judgment-only. Silence is prohibited. *Prevents: requirements that quietly escape enforcement.*

**P-06 — Authority lives only in Standards.** No other object may require anything. *Prevents: requirements accumulating in playbooks and templates where nothing tracks them.*

**P-07 — Authored and generated are strictly separated.** Nothing generated is hand-edited; nothing authored is machine-rewritten. Each object declares which it is. *Prevents: derived output silently becoming a source of truth.*

**P-08 — Dependencies point downward; the graph is acyclic.** Enforced by layer index. *Prevents: coupling that makes objects unreplaceable.*

**P-09 — Depend on types, never on producers.** Where one object consumes another's output, it depends on the declared type. *Prevents: every downstream object breaking when one producer changes; enables substitution.*

**P-10 — No assertion without method.** Any claim about the framework's own state carries the method that produced it. *Prevents: reports asserting checks nobody ran.*

**P-11 — Extend freely, restrict never.** Extensions may add Standards, requirements, Methodologies, and Artifact fields; they may not weaken framework requirements or remove required fields. *Prevents: an adopter's framework ceasing to be the framework.*

**P-12 — Context economy is a design constraint.** An agent should complete a typical task from a Capability plus one Methodology plus one Standard. Objects declare their context cost. *Prevents: a framework too expensive to consult.*

Three principles from the previous revision were dropped: *Vocabulary precedes normativity* (subsumed by P-06 and P-08, since vocabulary is a Standard with no dependencies), *Explicit unknowns* (a requirement of the audit methodologies, not of the architecture), and *Self-application* (a governance commitment belonging in a Standard, not an architectural constraint). *Proportional ceremony* was dropped as a principle and retained as a design objective — it constrains judgment, not structure.

## 10. The Capability Model

The brief asked whether Capability should be first-class or a conceptual grouping. **First-class**, and it is the most significant addition in this revision.

### 10.1 Why authored rather than derived

A generated capability index can only report what Methodologies already declare about themselves. It cannot express:

- That eleven Methodologies compose into one outcome, and in what order.
- How their individual health scores compose into a single assessment — a rule no constituent Methodology can state.
- Which combinations are valid, and which preconditions gate the whole.
- What the outcome is called in the language of the person requesting it.

Composition is intent. Intent is authored. A derived index is downstream of Capability, not a substitute for it — the navigation surface remains a generated View, projecting Capabilities.

### 10.2 What a Capability declares

Outcome statement in requester language; trigger phrasings an agent can match against a request; constituent Methodologies with ordering and optionality; Standards governing the outcome; Artifact types produced; preconditions and executor requirements; composition rules across constituents; and the total context cost of its dependency closure.

That last item is what makes Capability the correct agent entry point: an agent can determine the cost of a task before committing to it.

### 10.3 Capabilities in the current corpus

| Capability | Composes | Status today |
| --- | --- | --- |
| Repository Audit | Eleven discovery Methodologies with ordering and health composition | Two of eleven Methodologies exist |
| Architecture Review | One Methodology over the framework itself | Exists as a document, not a Methodology |
| Documentation Validation | One Methodology binding to metadata Standards | Exists as an ad-hoc script |
| Release Management | Change, evaluation, and release gate Methodologies | Standards exist; no Methodology |
| Risk Assessment | Tier selection and control-selection Methodology | Standard exists; no Methodology |

The table is diagnostic. Every capability the framework claims to offer is under-served relative to its Standards, and the gap was invisible before capabilities were named. That is the model earning its place immediately.

### 10.4 Relationship to types

Capability adds no mechanism. It is an authored object at L2 depending on L1 and L0. Adding a capability adds one object and no type — which is the extensibility property section 11 requires.

## 11. Extensibility

The brief asked whether five evolution directions are supportable without architectural change. Each is assessed against the eight-type model.

| Direction | Supported? | Mechanism | New type needed |
| --- | --- | --- | --- |
| Plugins | Yes | A namespaced bundle of Standards, Methodologies, Capabilities, and generators, declaring the meta-model version it targets. Nothing in the core may depend on a plugin (P-08 across the boundary), so removal cannot orphan a core object. | None |
| Organization-specific extensions | Yes | Namespaced overlay adding Standards and requirements, additional Artifact fields, and organization Capabilities. P-11 keeps the framework baseline separately checkable, so "are we framework-conformant" and "are we conformant to our overlay" remain distinct questions. | None |
| Generated documentation | Yes | Views. The published site, registry, navigation, checklists, and reports are all one type. | None |
| Multiple AI providers | Yes | Provider surfaces are generated adapter Views. Adding a provider adds a generator. Provider capabilities that cannot be adapted are declared as executor requirements on a Methodology, so an agent lacking one refuses rather than degrading silently. | None |
| Future methodology families | Yes | A new domain contributes Standards, Methodologies, and a Capability under its namespace. Cross-family composition works because Methodologies depend on Artifact types, not producers (P-09). | None |

**The architecture is closed under all five.** That is the strongest available evidence that the type count is right: eight types absorb every known extension direction without addition. A model requiring a new type for any of these would be under-abstracted.

**Deprecation.** A type or object is deprecated with a successor and a migration note. Instances remain readable; new instances are refused. Nothing is deleted.

**Compatibility.** Each object declares the meta-model version it targets. Automation declares which versions it understands and **fails closed** on an unknown version. Unknown types are surfaced as errors, never skipped — silent skipping is how a validator reports success on content it never examined.

## 12. Metadata Model

Metadata is the interface (P-02) and now carries requirement declarations (section 5). Conceptually it has four groups. This describes shape, not schema; a Standard will specify it.

**Identity and lifecycle.** Stable identity; type; version; status; owner; meta-model version.

**Dependency.** `depends_on` — objects this cannot be correct without, checked mechanically against the layer invariant. `references` — convenience links that may break without invalidating anything. Splitting these is a modification of the previous revision and is required for P-08 to be enforceable.

**Consumption.** Layer index; normativity map over sections; estimated context cost; capability membership; executor type and safety boundaries for Methodologies; artifact types produced and consumed.

**Requirements (Standards only).** Per requirement: identity addressable as a fragment; normative level; checkability; severity; scope; satisfying-evidence description. This block replaces the Rule object.

**Provenance (generated objects only).** Generator identity and version; source revision; generation timestamp; scope and completeness statement.

The framework's existing eleven-key front matter covers identity and lifecycle and part of dependency. The consumption, requirement, and provenance groups are new, and represent the concrete gap between the current repository and this architecture.

## 13. AI Traversal Model

The target from the brief: an agent should rarely read more than one Methodology, one Standard, and one template to complete a task.

### 13.1 The traversal

```
1. Entry View        (always loaded; small)
     Lists Capabilities with trigger phrasings and context costs.
     The agent matches the request to a Capability. No object bodies read.

2. Capability        (one object)
     Declares its dependency closure: which Methodology, which Standards,
     which Artifact types, which preconditions. The agent now knows
     exactly what to read and what the task will cost.

3. Methodology       (one object, or its relevant stages)
     The procedure to execute.

4. Standard          (normative sections only, by fragment)
     Only the requirements the Methodology cites.

5. Scaffold View     (generated; small)
     The Artifact shape to produce.
```

**Typical cost: one small View, one Capability, one Methodology, the normative subset of one Standard, one small scaffold.** This meets the target, and the two objects added relative to the brief's ideal — the entry View and the Capability — are both small and both eliminate exploratory reading, which is where an agent's context is actually wasted.

### 13.2 The four techniques

**Relevance from metadata alone (P-02).** An agent never opens an object to learn whether it is relevant. This single rule prevents the dominant failure mode, in which an agent reads three large documents to discover it needed the fourth.

**Normative-only loading (P-04).** Section-level normativity lets an agent load the binding subset. On the current corpus's largest document this is a several-fold reduction.

**Fragment addressing (section 5).** Requirements are addressable individually, so an agent loads one requirement rather than a whole Standard when the Capability names it.

**Declared closure (section 10).** The Capability declares everything needed. The agent plans once and reads deterministically.

### 13.3 Determinism across providers

Claude, Codex, Cursor, Gemini CLI, and successors must reach the same conclusion. This requires that traversal be a property of the framework rather than of the agent: identity-based addressing (P-03), one home per concept (P-01), an entry View every agent reads identically, and no provider-specific content in any object.

Provider-specific configuration surfaces — repository instruction files, rules files, tool manifests — are generated adapter Views. The framework authors none of them.

### 13.4 The write path

Agents produce Artifacts and Views. Agents do not author Standards, Capabilities, or Decisions. An agent proposing a normative change produces a Decision proposal for human acceptance. The normative core stays human-owned; the instance and projection layers can be fully automated.

## 14. Automation Model

Four roles, each binding to the object model differently. Automation is an actor, not a layer.

**Validators** read requirement declarations from Standards, evaluate them, and emit an Artifact rendered as a View. A validator contains no requirements of its own; every check traces to an addressable requirement in a Standard. This is what keeps checks and standards from diverging, and Option B makes it structural rather than aspirational.

**Generators** read authored objects and produce Views: registry, navigation, checklists, scaffolds, adapters, published documentation. Idempotent and reproducible — same inputs at same revision produce identical output. Every View carries provenance (P-10).

**Scaffolders** read type schemas and produce conformant skeletons with required metadata pre-populated. This enforces P-01 and P-05 at authoring time rather than at review time, which is the only point where enforcement is cheap.

**Agents** traverse per section 13 and execute Methodologies.

**Failure semantics.** Fail closed. An unparseable object, unknown type, unresolvable identity, or unknown meta-model version is an error, never a skip.

**Success measure.** The ratio of authored to generated objects should fall over time. Today it is approximately 45:0.

## 15. Open Questions

Reduced from eight to six. Two of the previous questions were resolved by this revision: whether Rules are extracted or authored is moot under Option B, and layer-index assignment for extensions is simplified by having five layers with clear semantics — though it is not fully closed, and is folded into Q-05.

**Q-01 — What is the granularity of a Standard?** P-12 wants Standards narrow enough that one answers a question. Current Standards are already reasonably narrow, but the audit Methodologies are not, and splitting them conflicts with their readability for a human reading one end to end. Undecided, and it determines whether the section 13 cost target is achievable on real content.

**Q-02 — Where do Artifact instances live?** The framework ships types and stores no instances. How instances are addressed across repositories, and how a downstream Methodology reaches an upstream Artifact, is undesigned. This blocks the Repository Audit capability, which requires eleven Methodologies to exchange Artifacts.

**Q-03 — What is the migration path for the existing corpus?** Forty-five documents exist under the current model. Whether they are reclassified in place, migrated per domain, or grandfathered determines whether this architecture is adoptable incrementally or only at a version boundary.

**Q-04 — What is the versioning unit for a release?** Objects version independently. Whether a release pins every object, pins only L0, or uses compatibility ranges is undecided.

**Q-05 — How are extension namespaces and layer indices governed?** P-11 states extend-freely-restrict-never, but nothing yet prevents an extension from declaring a layer index that permits a dependency the core would reject.

**Q-06 — Is requirement severity fixed or organization-overridable?** A framework-blocking requirement may reasonably be advisory for one adopter. Overridable is flexible; fixed is enforceable. This interacts with P-11.

## 16. What This Document Does Not Decide

It does not create, modify, or supersede any existing framework document. It does not define metadata schemas, file formats, or naming rules. It does not specify validator behavior or CI configuration. It does not prescribe a migration. It does not make any of its content normative. Every element requires a Decision and one or more Standards before it constrains a contributor.

## 17. Related Documents

- [Framework Architecture](framework-architecture.md)
- [Ownership Model](ownership-model.md)
- [Framework Architecture Review](../07-roadmap/framework-architecture-review.md)
- [Document Metadata Standard](../02-methodology/document-metadata-standard.md)
- [Framework Document ID Standard](../02-methodology/document-id-standard.md)
- [Framework Glossary](../02-methodology/glossary.md)
- [ADR-0001: Establish a Documentation-First Framework](../ADR/ADR-0001-framework-foundation.md)
- [Audit Engine Product Specification](../07-roadmap/audit-engine-roadmap.md)
