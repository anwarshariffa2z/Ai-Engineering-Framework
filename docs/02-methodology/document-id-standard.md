---
id: STD-0002
title: Framework Document ID Standard
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Methodology
tags: [documentation, identifiers, governance]
related: [document-metadata-standard.md, ../DOCUMENT_INDEX.md]
---

# Framework Document ID Standard

Every framework document has one stable, unique ID in the form `PREFIX-NNNN`. IDs do not change when a file moves or its title changes. Retired IDs are never reused.

## Prefixes

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

## Numbering and uniqueness

Numbers use four zero-padded digits and are allocated sequentially within a prefix, beginning at `0001`. An ADR uses the same rule but is rendered as `ADR-0001`. The [Document Registry](../DOCUMENT_INDEX.md) is the allocation authority. An ID appears once in front matter and once in the registry; aliases, duplicate IDs, and recycled IDs are prohibited.

## Cross-references

Use the document title as the Markdown link text and include the stable ID on first reference when precision matters: `[Document Metadata Standard (STD-0001)](document-metadata-standard.md)`. Links MUST resolve to a repository document. The target document’s front matter `related` list SHOULD include materially coupled documents.
