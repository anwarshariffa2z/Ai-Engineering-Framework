---
id: STD-0001
title: Document Metadata Standard
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Methodology
tags: [documentation, metadata, governance]
related: [document-id-standard.md, ../DOCUMENT_INDEX.md]
---

# Document Metadata Standard

Every Markdown document in this repository, except `LICENSE`, MUST begin with YAML front matter using the schema below. Metadata is machine-readable governance data and is authoritative for the document registry.

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

`id` is a unique framework document ID. `title` is the reader-facing name. `version` uses semantic versioning. `status` is Draft, Approved, Deprecated, or Superseded. `owner` names the accountable role or team. `created` and `last_updated` use ISO 8601 dates. `review_cycle` states a concrete cadence or `Event-driven`. `category` matches the repository classification. `tags` is a YAML list of searchable terms. `related` is a YAML list of repository-relative or document-relative references.

Front matter MUST be the first content in a file, contain all schema keys, and agree with the canonical entry in [the document registry](../DOCUMENT_INDEX.md). Update `version` and `last_updated` whenever a substantive change is approved.
