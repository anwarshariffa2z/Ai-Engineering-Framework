---
id: REF-0010
title: Documentation Validation Report
version: 1.3.1
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
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
| Remaining Audit Engine documents retain Draft structural status | Pass |
| The frozen architecture design set is registered and its links resolve | Pass |
| Architecture design documents assert no normative requirements | Pass |
| Each Architecture Decision Record decides exactly one question and follows the record template | Pass |
| Architecture Decision Records reference supporting design documents rather than restating them | Pass |
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

## Requirement Traceability

Seven standards declare the enforceable surface of the framework. Every identifier below is addressable as `STANDARD#R-nn` and is the binding point for a validator check, per STD-0012 R-01.

| Standard | Requirements | Mechanical | Judgment | Bound | Retired |
| --- | --- | --- | --- | --- | --- |
| STD-0001 Document Metadata | 5 | 4 | 1 | 4 | — |
| STD-0002 Framework Document ID | 8 | 5 | 3 | 5 | — |
| STD-0007 Evidence and Confidence | 44 | 20 | 24 | 0 | — |
| STD-0008 Artifact Specification | 37 | 35 | 2 | 0 | 14 |
| STD-0010 Metadata Specification | 40 | 40 | 0 | 27 | — |
| STD-0011 Contract Specification | 44 | 37 | 7 | 0 | — |
| STD-0012 Validation Specification | 39 | 39 | 0 | 6 | — |
| **Total** | **217** | **180** | **37** | **42** | **14** |

STD-0007, STD-0008, and STD-0011 carry no bound checks because their subjects — artifacts, producers, consumers, and conclusions — do not yet exist in the corpus. Each of their mechanical requirements is reported `not-evaluated` with that reason rather than assumed to pass.

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

Nine Audit Engine documents remain Draft structural placeholders: AUD-0001 and AUD-0004 through AUD-0011.

The framework architecture design set — the core architecture, the artifact model, the repository audit capability, and the architecture review — is registered as Draft. These documents describe structure and assert no requirements; nothing in them constrains a contributor until a decision record accepts them and a standard makes their content normative.
