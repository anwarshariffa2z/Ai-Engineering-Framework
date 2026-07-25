---
id: STD-0002
title: Framework Document ID Standard
version: 1.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-26
review_cycle: Annual
category: Methodology
tags: [documentation, identifiers, governance]
related: [document-metadata-standard.md, metadata-specification.md, ../DOCUMENT_INDEX.md]
normativity:
  "1": informative
  "2": normative
  "3": normative
  "4": normative
  "5": normative
requirements:
  - id: R-01
    level: MUST
    check: mechanical
    severity: blocking
    scope: document
  - id: R-02
    level: MUST
    check: judgment
    severity: blocking
    scope: identifier
  - id: R-03
    level: MUST
    check: judgment
    severity: blocking
    scope: identifier
  - id: R-04
    level: MUST
    check: mechanical
    severity: blocking
    scope: identifier
  - id: R-05
    level: MUST
    check: mechanical
    severity: advisory
    scope: identifier
  - id: R-06
    level: MUST
    check: mechanical
    severity: blocking
    scope: identifier
  - id: R-07
    level: MUST
    check: mechanical
    severity: blocking
    scope: document
  - id: R-08
    level: SHOULD
    check: judgment
    severity: advisory
    scope: document
---

# Framework Document ID Standard

## 1. Purpose and Scope

*This section is informative.*

This standard states how framework documents are identified: the form an identifier takes, its stability, how numbers are allocated, and how documents refer to one another.

The canonical grammar of an identifier is defined by [STD-0010](metadata-specification.md) R-04. This standard governs allocation and stability; that standard governs representation.

The obligations below were stated in prose before requirement identities existed. They now carry identifiers so that a validator can bind to them. Their meaning is unchanged.

## 2. Identifier Form and Stability

*This section is normative.*

**R-01.** Every framework document MUST have one stable, unique identifier in the form `PREFIX-NNNN`.

**R-02.** An identifier MUST NOT change when a file moves or its title changes.

**R-03.** A retired identifier MUST NOT be reused.

R-02 and R-03 are judgment-checkable. Both are claims about a document's history rather than about its present state, and no inspection of the repository at one revision reveals whether an identifier once denoted something else.

## 3. Prefixes

*This section is normative.*

| Prefix | Use |
| --- | --- |
| DOC | General framework document |
| AUD | Audit Engine document |
| CMD | Command or operational procedure |
| PLB | Playbook |
| CHK | Checklist |
| TMP | Template |
| REF | Reference material |
| EX | Worked example |
| STD | Normative standard |
| ADR | Architecture Decision Record |

## 4. Numbering and Uniqueness

*This section is normative.*

**R-04.** Numbers MUST use four zero-padded digits.

**R-05.** Numbers MUST be allocated sequentially within a prefix, beginning at `0001`.

An ADR uses the same rule but is rendered as `ADR-0001`. The [Document Registry](../DOCUMENT_INDEX.md) is the allocation authority.

**R-06.** An identifier MUST appear once in front matter and once in the registry. Aliases, duplicate identifiers, and recycled identifiers are prohibited.

R-05 carries advisory severity. It describes an allocation practice rather than a property of a document, and a gap in a sequence can arise from a reservation that was never taken up as well as from a mistake. A gap is reported for a maintainer to judge rather than treated as a defect in the document that follows it.

## 5. Cross-references

*This section is normative.*

Use the document title as the Markdown link text and include the stable identifier on first reference when precision matters: `[Document Metadata Standard (STD-0001)](document-metadata-standard.md)`.

**R-07.** Links MUST resolve to a repository document.

**R-08.** The target document's front matter `related` list SHOULD include materially coupled documents.

R-08 is judgment-checkable. Whether two documents are materially coupled is a matter for their owners, and no mechanical test distinguishes a coupling that matters from one that does not.
