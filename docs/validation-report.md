---
id: REF-0010
title: Documentation Validation Report
version: 1.10.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-29
review_cycle: Event-driven
category: Reference
tags: [validation, documentation, quality]
related: [DOCUMENT_INDEX.md, 02-methodology/document-metadata-standard.md]
---

# Documentation Validation Report

## Scope

Validation covered all Markdown documents in the repository except `LICENSE`, including repository policies and GitHub templates.

## Results

| Check | Result |
| --- | --- |
| Required numbered documentation hierarchy exists | Pass |
| Markdown links resolve to local targets | Pass |
| Every Markdown document begins with complete YAML front matter | Pass |
| Document IDs are unique and match the registry | Pass |
| Markdown filenames are unique within their directories and no duplicate document paths exist | Pass |
| Every Markdown document is represented in the Document Registry | Pass |
| Architecture Discovery methodology is complete, evidence-led, and registered as AUD-0002 | Pass |
| Database Discovery methodology is complete, evidence-led, and registered as AUD-0003 | Pass |
| Database Discovery defines all sixteen discovery stages, each with purpose, inputs, actions, evidence, deliverables, failure conditions, and acceptance criteria | Pass |
| Database Discovery defines all fourteen DB-NNN audit artifacts | Pass |
| Database Discovery reuses the evidence states, confidence levels, and health scale established by AUD-0002 without local redefinition | Pass |
| DB-NNN audit artifact identifiers are held outside the framework document namespace and absent from the registry | Pass |
| Frontend, Backend, Business Workflow, Security and Permissions, Feature Inventory, Operations, Gap Analysis, and Runtime Verification are complete, evidence-led, and registered as AUD-0004 through AUD-0011 | Pass |
| Each new methodology consumes the core standards and redefines no evidence, confidence, completeness, or scoring concept | Pass |
| Each new methodology declares its produced artifact types as namespaced type identities and carries no `requirements` key | Pass |
| Every artifact type named by a methodology appears in the Artifact Type Inventory | Pass |
| AUD-0001 Bootstrap retains Draft structural status | Pass |
| The Artifact Type Declaration Standard declares section normativity and structured requirements in its metadata | Pass |
| Every requirement in the Artifact Type Declaration Standard declares a normative level, checkability, severity, and scope | Pass |
| No informative section of the Artifact Type Declaration Standard states a requirement | Pass |
| Every requirement the Artifact Specification Standard scoped to an artifact type is retired and restated by the Artifact Type Declaration Standard, or explicitly withdrawn | Pass |
| No artifact type declaration states an obligation, and no declaration document carries a requirements key | Pass |
| Every declared type identity matches the declared grammar and appears exactly once in the corpus | Pass |
| Every declaration carries the ten required declaration fields and five conformance fixture cases | Pass |
| Every evidence-bearing field, vocabulary field, and consumption-profile field names a field the type declares | Pass |
| Every derives_from entry names a declared type, and the derivation graph is acyclic | Pass |
| Every artifact type in the Artifact Type Inventory is declared exactly once, and no type is declared that the inventory does not list | Pass |
| The validator holds no knowledge of any artifact type; framework metadata keys are read from configuration | Pass |
| The frozen architecture design set is registered and its links resolve | Pass |
| Architecture design documents assert no normative requirements | Pass |
| Each Architecture Decision Record decides exactly one question and follows the record template | Pass |
| Architecture Decision Records reference supporting design documents rather than restating them | Pass |
| The artifact instance identity record decides naming, resolution, and integrity separately and modifies no standard | Pass |
| The Framework Artifact Model records its open addressing question as resolved by that record and carried into the standards | Pass |
| The artifact instance identity decision is carried into the four standards it names, and into no others | Pass |
| Identity, resolution, and integrity are stated as three separate obligations and are not collapsed into one field or one responsibility | Pass |
| No requirement identifier was reused, and none was retired, in carrying that decision | Pass |
| The carriage introduces no object type, no layer, no resolver contract, and no derivation rule for the run discriminator | Pass |
| The deferred run discriminator derivation is recorded as an implementation question in the artifact standard rather than decided | Pass |
| The Artifact Specification Standard declares section normativity and structured requirements in its metadata | Pass |
| Every requirement in the Artifact Specification Standard declares a normative level, checkability, severity, and scope | Pass |
| No informative section of the Artifact Specification Standard states a requirement | Pass |
| The Artifact Specification Standard implements the accepted decisions without redefining them | Pass |
| The Metadata Specification Standard declares section normativity and structured requirements in its metadata | Pass |
| Every requirement in the Metadata Specification Standard declares a normative level, checkability, severity, and scope | Pass |
| No informative section of the Metadata Specification Standard states a requirement | Pass |
| The Metadata Specification Standard formalizes representation without redefining artifact, evidence, or validation semantics | Pass |
| The Evidence and Confidence Standard declares section normativity and structured requirements in its metadata | Pass |
| Every requirement in the Evidence and Confidence Standard declares a normative level, checkability, severity, and scope | Pass |
| No informative section of the Evidence and Confidence Standard states a requirement | Pass |
| The Evidence and Confidence Standard defines meaning without defining metadata, artifacts, or validator behaviour | Pass |
| Completeness meaning is defined in exactly one standard and referenced, not restated, by the Artifact Specification Standard | Pass |
| No framework document carries a byte order mark | Pass |
| The Contract Specification Standard declares section normativity and structured requirements in its metadata | Pass |
| Every requirement in the Contract Specification Standard declares a normative level, checkability, severity, and scope | Pass |
| No informative section of the Contract Specification Standard states a requirement | Pass |
| The Contract Specification Standard defines obligations without defining artifact structure, metadata representation, evidence semantics, or validator behaviour | Pass |
| Participant obligations are defined in exactly one standard and referenced, not restated, by the Artifact Specification Standard | Pass |
| Requirement identifiers retired from the Artifact Specification Standard are not reused | Pass |
| The Validation Specification Standard declares section normativity and structured requirements in its metadata | Pass |
| Every requirement in the Validation Specification Standard declares a normative level, checkability, severity, and scope | Pass |
| No informative section of the Validation Specification Standard states a requirement | Pass |
| The Validation Specification Standard defines validator behaviour without redefining artifact structure, metadata representation, evidence semantics, or participant obligations | Pass |
| No validator behaviour is stated outside the Validation Specification Standard | Pass |
| Every load-bearing normative obligation in the five core standards carries a requirement identifier | Pass |
| Every requirement identifier is stated in the body and declared in metadata, in both directions, across all five core standards | Pass |
| Architecture Discovery and Database Discovery consume the core standards and restate none of them | Pass |
| No methodology carries a requirements key, per the metadata standard | Pass |
| Every methodology declares its capability, inputs, outputs, preconditions, and produced artifact types | Pass |
| Every methodology declares object type, layer, and the dependency and reference split | Pass |
| Evidence states, confidence levels, and the health scale are defined in exactly one standard and referenced by both methodologies | Pass |
| Methodologies declare only their own health dimensions, not the scale or its guards | Pass |
| Participant and semantic obligations are held by the standards that own them, with none remaining in the artifact standard | Pass |
| The AUD-0002 reference producer emits conforming instances of every artifact type that methodology declares, and of no other | Pass |
| The AUD-0003 reference producer emits conforming instances of every artifact type that methodology declares, and of no other | Pass |
| One run composing both methodologies emits twenty-eight instances with no identity collision | Pass |
| The database methodology reaches every architecture artifact it consumes by identity through the run resolution declaration, and by no path | Pass |
| Both cross-methodology lineage edges the type declarations require are present, immutable, and verify against the artifacts they name | Pass |
| A required input withheld from the consuming producer degrades the artifact that needed it to Unavailable, naming the input | Pass |
| No artifact in either run records Verified evidence, and no producer connects to a data store | Pass |
| Every artifact instance verifies against its own content digest under the canonical serialization of RFC 8785 | Pass |
| Every lineage entry is an immutable reference carrying a bound identity and an upstream digest | Pass |
| Every identity the reference run produces or consumes carries a resolution or is recorded unresolvable | Pass |
| Completeness states Complete, Partial, NotApplicable, and Unavailable are each reached by at least one instance | Pass |
| No record marked Unknown carries a confidence level or a score, and each carries the scope reason that bounds it | Pass |
| No artifact instance identity appears in a document reference key | Pass |

## Requirement Traceability

Eight standards declare the enforceable surface of the framework. Every identifier below is addressable as `STANDARD#R-nn` and is the binding point for a validator check, per STD-0012 R-01.

| Standard | Requirements | Mechanical | Judgment | Bound | Retired |
| --- | --- | --- | --- | --- | --- |
| STD-0001 Document Metadata | 5 | 4 | 1 | 4 | — |
| STD-0002 Framework Document ID | 8 | 5 | 3 | 5 | — |
| STD-0007 Evidence and Confidence | 44 | 20 | 24 | 13 | — |
| STD-0008 Artifact Specification | 33 | 32 | 1 | 22 | 25 |
| STD-0010 Metadata Specification | 47 | 47 | 0 | 36 | — |
| STD-0011 Contract Specification | 52 | 45 | 7 | 8 | — |
| STD-0012 Validation Specification | 45 | 45 | 0 | 12 | — |
| STD-0013 Artifact Type Declaration | 37 | 29 | 8 | 26 | — |
| **Total** | **271** | **227** | **44** | **126** | **25** |

STD-0007, STD-0008, and STD-0011 carried no bound checks for as long as their subjects — artifact instances, producers, consumers, and conclusions — were absent from the corpus. The AUD-0002 reference producer supplied the first of those subjects: fourteen conforming instances of the fourteen artifact types that methodology declares, with a run-scoped resolution declaration beside them. Fifty-three checks bound as a result, taking the total from sixty-eight to one hundred and twenty-one, and every one of them binds to a requirement that already existed. None was written to raise a count.

The AUD-0003 reference producer supplied the second such subject, and with it a subject the corpus had never held: a producer that is also a consumer. Fourteen further conforming instances were emitted into a run composing both methodologies, and four consumer duties bound as a result — STD-0011 R-11, R-12, R-14, and R-40 — taking bound checks from one hundred and twenty-one to one hundred and twenty-five. Each binds to a requirement that already existed, and each has a real subject: a lineage entry is a consumption that was performed and recorded, so the entry can be compared against the artifact it names.

Reconciling the second producer's findings against the standards added two requirements and one bound check. [STD-0008](02-methodology/artifact-specification.md) R-58 fixes the boundary between the framework's own record members and the field values a type declaration supplies; it is mechanical, it binds, and it is what allows the STD-0013 R-35 check to read a record's declared fields without a standing exception list for the framework's members. [STD-0013](02-methodology/artifact-type-declaration-standard.md) R-37 states the one qualification R-33 receives, for a record whose evidence state is `Unknown`. It is judgment-checkable and deliberately unbound: whether a field was omitted honestly or a value fabricated to satisfy a list cannot be seen in an artifact, and a check that treated every omission as licensed would assume R-37 rather than evaluate it. Both requirements were already being relied on before they were stated — the validator was applying one and exempting under the other on its own authority, which [STD-0012](02-methodology/validation-specification.md) R-03 forbids. Stating them removed that, and neither changed an artifact or moved a digest.

Three artifact type declarations were corrected in the same pass. `framework.database.risks` and `framework.architecture.classification` each recorded lineage in the runs to upstream types their declarations did not list, and `framework.architecture.risks` listed five of the seven it drew on. The instance lineage was right in every case and the declarations were incomplete, so the declarations were corrected to match the derivation that actually occurred: `derives_from` entries were added, none was removed, the graph over all ninety-three types remains acyclic under STD-0013 R-21, and every entry names a declared type under its R-22. No `type_version` moved. A `derives_from` entry supplies an operand to R-21 and R-22, which range over the corpus graph, and to no requirement that ranges over an instance — not R-33, R-34, or R-35 — so no artifact's conformance and no consumer's compatibility determination changed, and every AUD-0002 digest is byte-for-byte what it was. That no requirement in STD-0013 classifies a change to `derives_from`, where its R-15 classifies a vocabulary change and its R-24 a consumption-profile change, is recorded here as a gap rather than closed by inference.

What remains not-evaluated is not evenly distributed and the reasons differ. Forty-three requirements are judgment-classified and routed to human review. Forty-two range over producers, consumers, and orchestrators that are not registered as corpus objects, which no artifact can supply. Twenty-nine are validator self-conformance. The remainder state conditions that do not arise in either reference run — no environment-derived observation, no transformer, no rejection event, no cross-revision reuse — and each reports that rather than repeating a reason that has expired. In particular STD-0011 R-27, R-43, and R-44 remain unbound because a rejection, a stale pair presented as concurrently valid, and a cross-revision consumption are conditions neither run produces.

Twenty-five requirements were added in carrying [ADR-0006](ADR/ADR-0006-artifact-instance-identity.md) into the standards: six to STD-0008, five to STD-0010, eight to STD-0011, and six to STD-0012. All twenty-five are mechanical and blocking, and all twenty-five are dormant for the same reason as the requirements around them: their subjects are artifact instances, references, runs, and resolutions, none of which exist in the corpus. Bound checks are therefore unchanged at sixty-eight, and not-evaluated rises from 174 to 199. No identifier was reused and none was retired; R-06, R-10, R-19, R-28, R-29, and R-30 kept their identities because each remained true, and R-10, R-28, R-29, and R-30 were widened in place to admit the integrity group and the upstream digest.

The artifact type declaration milestone therefore activated no previously dormant requirement. It added a standard whose subject — the declaration — is present in the corpus, and twenty-six of its requirements bound immediately. The dormant requirements describe instances, and declaring a type does not produce one.

Judgment-classified requirements are not exempt from enforcement. STD-0012 sections 8 and 9 govern them: those that a human can decide are routed to review, and those that cannot be decided by inspection at all are recorded as unenforceable rather than omitted.

## Retired Requirement Registry

Retired identifiers are permanently withdrawn and are never reused, per STD-0010 R-18. Their subject matter is recorded here so that a reader encountering a historical reference can locate its successor.

| Standard | Identifier | Retired at | Relocated to | Reason |
| --- | --- | --- | --- | --- |
| STD-0008 | R-24 | 1.2.0 | STD-0011 R-09 | Participant obligation |
| STD-0008 | R-25 | 1.2.0 | STD-0011 R-10 | Participant obligation |
| STD-0008 | R-27 | 1.2.0 | STD-0011 R-27 | Participant obligation |
| STD-0008 | R-29 | 1.2.0 | STD-0011 R-06 | Participant obligation |
| STD-0008 | R-30 | 1.2.0 | STD-0011 R-11 | Participant obligation |
| STD-0008 | R-31 | 1.2.0 | STD-0011 R-12 | Participant obligation |
| STD-0008 | R-38 | 1.3.0 | STD-0012 R-04, R-05 | Validator behaviour |
| STD-0008 | R-07 | 1.4.0 | STD-0011 R-40 | Consumer obligation |
| STD-0008 | R-16 | 1.4.0 | STD-0007 sections 6 and 8; STD-0011 R-41 | Semantics and producer obligation |
| STD-0008 | R-28 | 1.4.0 | STD-0011 R-23 | Producer obligation, duplicated |
| STD-0008 | R-34 | 1.4.0 | STD-0011 R-05 | Producer obligation, duplicated |
| STD-0008 | R-35 | 1.4.0 | STD-0011 R-13 | Consumer obligation, duplicated |
| STD-0008 | R-47 | 1.4.0 | STD-0011 R-43 | Consumer obligation |
| STD-0008 | R-48 | 1.4.0 | STD-0011 R-44 | Consumer obligation |
| STD-0008 | R-03, R-04 | 1.5.0 | STD-0013 R-03, R-04 | Artifact type declaration |
| STD-0008 | R-21 | 1.5.0 | STD-0013 R-05 | Artifact type declaration |
| STD-0008 | R-22 | 1.5.0 | STD-0013 R-15, R-24 | Split by what changed |
| STD-0008 | R-23 | 1.5.0 | STD-0013 R-03 | Artifact type declaration |
| STD-0008 | R-26 | 1.5.0 | STD-0013 R-13, R-14 | Artifact type declaration |
| STD-0008 | R-32 | 1.5.0 | STD-0013 section 9 | Stated once rather than per type |
| STD-0008 | R-36 | 1.5.0 | STD-0013 R-27 | Artifact type declaration |
| STD-0008 | R-37 | 1.5.0 | STD-0013 sections 5 and 6 | Sections became declaration fields |
| STD-0008 | R-49 | 1.5.0 | Withdrawn | A data record has no sections to mark |
| STD-0008 | R-50 | 1.5.0 | STD-0013 R-29, R-30 | Artifact type declaration |

Four requirements were narrowed rather than retired, their relocating clauses moving while their remaining clauses stayed: STD-0008 R-09, R-20, and R-33, and STD-0011 R-36.

Fourteen identifiers are retired from STD-0008. Every retirement moved an obligation to the standard that owns it; none removed an obligation from the framework. The artifact standard now holds only artifact properties.

## Known Exceptions

Exceptions are disclosed with a resolution point rather than being reported as passing. Closed exceptions are retained so that the record of what was outstanding, and when it was resolved, is not lost.

| Exception | Detail | Resolution |
| --- | --- | --- |
| EXC-0001 | Partly closed. The `Capability` category is now admitted by the Metadata Specification Standard. The `CAP` prefix remains unauthorized by the Framework Document ID Standard, which the Metadata Specification Standard does not govern. | Revision of the identifier standard. |
| EXC-0002 | Closed. The Metadata Specification Standard admits `Accepted` for Decision objects, recording in the schema what the architecture already specifies and what every Decision Record already uses. | Closed at the metadata standard milestone. |
| EXC-0003 | Closed. The Metadata Specification Standard permits additional keys after the eleven core keys, so `normativity` and `requirements` are conforming rather than tolerated. | Closed at the metadata standard milestone. |
| EXC-0004 | Closed. `STD-0007` is allocated to the Evidence and Confidence Standard and the `STD` sequence is contiguous from 0001 to 0008. | Closed at the evidence standard milestone. |
| EXC-0005 | Closed. The four repository-root-relative `related` entries in the README, contributing guide, and security policy now use object identities, which the Metadata Specification Standard permits and which carry no positional ambiguity. Found independently by the reference validator. | Closed at the validator baseline milestone. |
| EXC-0006 | Closed. The Audit Engine Product Specification declared `status: Planned`, which is outside the closed status vocabulary. It now declares `Draft`. Found by the reference validator. | Closed at the validator baseline milestone. |
| EXC-0007 | Closed. Both standards now declare requirements. Registry agreement is bound to STD-0001 R-04 and enforced across title, version, status, and last-updated date; identifier form, uniqueness, allocation, registry appearance, and link resolution are bound to STD-0002. | Closed at the legacy standards migration. |
| EXC-0008 | Identifier allocation is not contiguous. The `AUD` sequence begins at `0000` rather than `0001`, and `STD-0009` was reserved and never allocated. Both are reported as warnings under STD-0002 R-05, which carries advisory severity because a gap can arise from an unused reservation as well as from a mistake. | Maintainer judgment; no document is defective. |
| EXC-0009 | Closed. The Metadata Specification Standard is authoritative on the permitted form of a reference, per its own section 3: the Document Metadata Standard governs the obligation and the Metadata Specification Standard governs the representation. The field description in the Document Metadata Standard no longer enumerates permitted forms and defers to R-07. No requirement changed and no identifier moved. | Closed at the standards reconciliation. |

## Notes

The repository is ready to scale through the ID, metadata, registry, and numbered-domain conventions. Architecture Discovery is the reference methodology for future audit playbooks, and Database Discovery is the first playbook derived from it; Audit Engine implementation remains explicitly out of scope.

Database Discovery introduces two conventions that later playbooks are expected to follow where their domain warrants: technology-family guidance applied only after the family is evidenced, and a fixed set of identified audit artifacts giving downstream playbooks a stable output contract. Its `DB-NNN` artifact identifiers name audit outputs rather than framework documents and are therefore governed by the playbook, not by the Framework Document ID Standard.

One Audit Engine document remains a Draft structural placeholder: AUD-0001 Bootstrap.

Ten methodologies are approved and every artifact type they declare is now declared in the corpus, once each, under [STD-0013](02-methodology/artifact-type-declaration-standard.md). Ninety-three declarations sit in ten documents under `docs/10-artifact-types/`. What remains missing before a run can occur is a producer implementation and a place for instances to live; neither is a framework document.

The canonical serialization of an artifact is defined by [STD-0010](02-methodology/metadata-specification.md) R-46, which adopts the JSON Canonicalization Scheme of RFC 8785 by reference rather than defining a framework-specific scheme. Before that revision, STD-0008 R-55 required a digest over a canonical serialization no standard fixed, so two conforming producers could digest one artifact differently and the integrity leg of ADR-0006 rested on their happening to agree. The reference producer's existing output already satisfied RFC 8785, so no artifact changed and no digest moved.

How an artifact instance is named is decided by [ADR-0006](ADR/ADR-0006-artifact-instance-identity.md) and carried into the standards it names: STD-0008 at 1.6.0, STD-0010 at 1.3.0, STD-0011 at 1.3.0, and STD-0012 at 1.1.0. The obligations that previously had no subject now have one. STD-0011 R-40 can be discharged because an identity grammar exists; STD-0008 R-19 has a defined upstream address; and R-43 staleness is a digest comparison rather than a claim. STD-0013 is untouched, which is the check that the separation [ADR-0005](ADR/ADR-0005-artifact-types-as-declarations.md) established holds.

Two questions remain deferred inside that decision rather than open before it. A derivation rule for the run discriminator is not required by any standard, because an orchestrator supplies the discriminator and STD-0011 R-51 obliges it to keep discriminators distinct; STD-0008 section 20 records the residual risk, which is an orchestrator issuing one discriminator for two runs. A resolver contract is likewise not required: a resolution is declared as run-scoped data under STD-0010 R-45, and STD-0011 R-52 places the duty to declare it on the orchestrator, so no resolver abstraction, service, or object type enters the framework.

Ten of the twenty-two obligations reported as unenforceable are the safety boundaries declared by the audit methodologies. A methodology may not carry a `requirements` key under [STD-0010](02-methodology/metadata-specification.md) R-16, so a normative obligation it states cannot be bound to a check. These are the framework's most consequential prohibitions — do not modify the subject, do not read production records, do not reproduce credentials — and no validator can enforce any of them.

The framework architecture design set — the core architecture, the artifact model, the repository audit capability, and the architecture review — is registered as Draft. These documents describe structure and assert no requirements; nothing in them constrains a contributor until a decision record accepts them and a standard makes their content normative.
