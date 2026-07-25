---
id: STD-0001
title: Document Metadata Standard
version: 1.1.1
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-26
review_cycle: Annual
category: Methodology
tags: [documentation, metadata, governance]
related: [document-id-standard.md, metadata-specification.md, ../DOCUMENT_INDEX.md]
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
    check: mechanical
    severity: blocking
    scope: document
  - id: R-03
    level: MUST
    check: mechanical
    severity: blocking
    scope: document
  - id: R-04
    level: MUST
    check: mechanical
    severity: blocking
    scope: document
  - id: R-05
    level: MUST
    check: judgment
    severity: blocking
    scope: document
---

# Document Metadata Standard

## 1. Purpose and Scope

*This section is informative.*

This standard states the obligation to carry document metadata and the rule that metadata agrees with the document registry. Metadata is machine-readable governance data and is authoritative for the registry.

The canonical representation of every declaration named here — value grammars, key ordering, controlled vocabularies, and encoding — is defined by [STD-0010](metadata-specification.md). Where both standards address a key, this standard governs the obligation and STD-0010 governs its representation.

The obligations below were stated in prose before requirement identities existed. They now carry identifiers so that a validator can bind to them. Their meaning is unchanged.

## 2. Front Matter Requirement

*This section is normative.*

**R-01.** Every Markdown document in this repository, except `LICENSE`, MUST begin with YAML front matter using the schema in section 3.

**R-02.** Front matter MUST be the first content in a file.

## 3. Schema

*This section is normative.*

**R-03.** Front matter MUST contain all schema keys.

```yaml
---
id:
title:
version:
status:
owner:
created:
last_updated:
review_cycle:
category:
tags:
related:
---
```

## 4. Field Definitions

*This section is normative.*

`id` is a unique framework document ID. `title` is the reader-facing name. `version` uses semantic versioning. `status` is Draft, Approved, Deprecated, or Superseded. `owner` names the accountable role or team. `created` and `last_updated` use ISO 8601 dates. `review_cycle` states a concrete cadence or `Event-driven`. `category` matches the repository classification. `tags` is a YAML list of searchable terms. `related` is a YAML list of references.

The permitted form of each value is defined by [STD-0010](metadata-specification.md) section 4 — including the permitted form of a reference, which its R-07 defines — and the permitted values of `status` and `category` by its section 6. Where this standard and STD-0010 both address a key, this standard governs the obligation and STD-0010 governs its representation.

## 5. Agreement and Maintenance

*This section is normative.*

**R-04.** Front matter MUST agree with the canonical entry in [the document registry](../DOCUMENT_INDEX.md).

**R-05.** `version` and `last_updated` MUST be updated whenever a substantive change is approved.

R-05 is judgment-checkable. Whether a change is substantive is a decision for the accountable owner, and no inspection of a document reveals whether an unrecorded change was material.
