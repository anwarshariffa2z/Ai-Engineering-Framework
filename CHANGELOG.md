---
id: REF-0004
title: Changelog
version: 1.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-26
review_cycle: Event-driven
category: Reference
tags: [changelog, releases]
related: [README.md]
---

# Changelog

All notable framework changes are recorded in this file. Each entry summarizes a release rather than enumerating the milestones within it; the commit history is authoritative for detail.

## v0.7.0-artifact-declarations — 2026-07-26

Artifact Declaration Framework. The framework can now describe its own outputs, and the last open architectural question is decided.

### Added

- **STD-0013 Artifact Type Declaration Standard.** Thirty-six requirements governing declaration semantics, required fields, vocabularies, completeness conditions, lineage constraints, consumption profiles, conformance fixtures, and instance conformance.
- **Ninety-three artifact type declarations** across ten documents under `docs/10-artifact-types/`, one for each type registered in the Artifact Type Inventory. Declarations are data: none states an obligation.
- **ADR-0005.** Artifact types are declared as structured data governed by one standard, establishing the principle that standards own normative behavior and declarations own variability.
- **ADR-0006.** Artifact instances are named by a logical identity, located by separate resolution, and verified by content digest. Completes the artifact identity architecture.

### Changed

- **STD-0008 Artifact Specification.** Eleven artifact-type-scoped requirements retired to STD-0013 and one withdrawn; the standard now holds instance properties only.
- **STD-0010 Metadata Specification.** Admits keys defined by another framework standard, which makes `artifact_types` conforming rather than tolerated.
- **Reference validator.** Twenty-six generic checks bound to STD-0013, driven entirely from declaration data, and the framework metadata key set moved from code into configuration. No check names an artifact type.

## v0.6.0-reference-validator — 2026-07-26

Reference Validator. The repository became self-validating.

### Added

- Executable reference validator implementing STD-0012, exiting non-zero on any blocking failure.
- STD-0012 Validation Specification and the requirement traceability surface it binds to.
- Eight discovery and verification methodologies, AUD-0004 through AUD-0011, and the Artifact Type Inventory recording every artifact type they reference.

### Changed

- Legacy standards migrated to structured requirement metadata, closing the class of obligation that no validator could evaluate.

## v0.5.0-core-standards — 2026-07-25

Core Standards. The normative surface of the framework was frozen.

### Added

- Core standards for document metadata, identifiers, evidence and confidence, artifacts, metadata representation, and participant contracts.
- Requirements expressed as structured metadata and addressable per identifier, per ADR-0002.
- The frozen object and layer models: eight object types across five layers.

## Earlier — 2026-07-25

### Added

- Documentation-first framework foundation covering architecture, lifecycle, ownership, governance, data, evaluation, reliability, and security.
- Contribution, conduct, and security reporting policies.
- Audit Engine product specification with no implementation.
