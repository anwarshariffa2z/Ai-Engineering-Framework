---
id: REF-0010
title: Documentation Validation Report
version: 1.1.0
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

## Requirement Traceability

The five core standards declare the enforceable surface of the framework. Every identifier below is addressable as `STANDARD#R-nn` and is the binding point for a validator check, per STD-0012 R-01.

| Standard | Requirements | Mechanical | Judgment | Retired |
| --- | --- | --- | --- | --- |
| STD-0007 Evidence and Confidence | 44 | 20 | 24 | — |
| STD-0008 Artifact Specification | 44 | 40 | 4 | 7 |
| STD-0010 Metadata Specification | 40 | 40 | 0 | — |
| STD-0011 Contract Specification | 39 | 33 | 6 | — |
| STD-0012 Validation Specification | 39 | 39 | 0 | — |
| **Total** | **206** | **172** | **34** | **7** |

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

Three requirements were narrowed rather than retired, their validator clauses relocating while their remaining clauses stayed: STD-0008 R-09 and R-20, and STD-0011 R-36.

## Known Exceptions

Exceptions are disclosed with a resolution point rather than being reported as passing. Closed exceptions are retained so that the record of what was outstanding, and when it was resolved, is not lost.

| Exception | Detail | Resolution |
| --- | --- | --- |
| EXC-0001 | Partly closed. The `Capability` category is now admitted by the Metadata Specification Standard. The `CAP` prefix remains unauthorized by the Framework Document ID Standard, which the Metadata Specification Standard does not govern. | Revision of the identifier standard. |
| EXC-0002 | Closed. The Metadata Specification Standard admits `Accepted` for Decision objects, recording in the schema what the architecture already specifies and what every Decision Record already uses. | Closed at the metadata standard milestone. |
| EXC-0003 | Closed. The Metadata Specification Standard permits additional keys after the eleven core keys, so `normativity` and `requirements` are conforming rather than tolerated. | Closed at the metadata standard milestone. |
| EXC-0004 | Closed. `STD-0007` is allocated to the Evidence and Confidence Standard and the `STD` sequence is contiguous from 0001 to 0008. | Closed at the evidence standard milestone. |
| EXC-0005 | Four `related` entries use the repository-root-relative form that the Metadata Specification Standard prohibits. They resolve correctly only because the documents carrying them sit at the repository root, where the two forms coincide. The transitional allowance does not cover this requirement. | Corrected as each affected document is next revised. |

## Notes

The repository is ready to scale through the ID, metadata, registry, and numbered-domain conventions. Architecture Discovery is the reference methodology for future audit playbooks, and Database Discovery is the first playbook derived from it; Audit Engine implementation remains explicitly out of scope.

Database Discovery introduces two conventions that later playbooks are expected to follow where their domain warrants: technology-family guidance applied only after the family is evidenced, and a fixed set of identified audit artifacts giving downstream playbooks a stable output contract. Its `DB-NNN` artifact identifiers name audit outputs rather than framework documents and are therefore governed by the playbook, not by the Framework Document ID Standard.

Nine Audit Engine documents remain Draft structural placeholders: AUD-0001 and AUD-0004 through AUD-0011.

The framework architecture design set — the core architecture, the artifact model, the repository audit capability, and the architecture review — is registered as Draft. These documents describe structure and assert no requirements; nothing in them constrains a contributor until a decision record accepts them and a standard makes their content normative.
