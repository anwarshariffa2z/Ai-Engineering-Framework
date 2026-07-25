---
id: REF-0018
title: Security Artifact Type Declarations
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-26
last_updated: 2026-07-26
review_cycle: Annual
category: Reference
tags: [artifacts, declarations, security]
related: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md, ../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/06-security-permissions.md]
object_type: Guide
depends_on: [../02-methodology/artifact-type-declaration-standard.md, ../02-methodology/artifact-specification.md]
references: [../07-roadmap/artifact-type-inventory.md, ../03-audit-engine/06-security-permissions.md]
meta_model_version: 1.0.0
normativity:
  "1": informative
  "2": informative
  "3": informative
artifact_types:
  - type: framework.security.identity
    type_version: 1.0.0
    lifecycle: active
    purpose: How the system decides who a caller is
    contract: Each mechanism names a verification location; no token or session value is recorded
    producer_kind: security-discovery
    subject_noun: authentication mechanism
    required_fields: [mechanism, provider, credential_type, verification_location, evidence_state, confidence]
    optional_fields: [session_lifetime, renewal_path, revocation_mechanism]
    evidence_bearing_fields: [verification_location]
    vocabularies:
      - field: credential_type
        kind: open
        values: [password, token, certificate, api-key, federated-assertion, session-cookie]
    derives_from: [framework.backend.interfaces]
    consumption_profiles:
      - consumer: feature-inventory
        reads: [mechanism, provider]
    fixtures:
      normal: One record per authentication mechanism found within the declared scope, each carrying verification_location and a confidence level.
      empty: The declared scope was examined in full and contained no authentication mechanism; completeness is Complete and the record set is empty.
      not_applicable: The system authenticates no caller
      partial: One provider configuration was out of scope; completeness is Partial and the unexamined boundary is recorded.
      boundary: An authentication library present as a dependency with no verification location is not a mechanism
  - type: framework.security.authorization
    type_version: 1.0.0
    lifecycle: active
    purpose: What the system permits an identified caller to do, and where it decides
    contract: Coverage is an enumerated operation list compared against the operation inventory
    producer_kind: security-discovery
    subject_noun: authorization decision point
    required_fields: [decision_point, subjects, resources, actions, covered_operations, uncovered_operations, evidence_state, confidence]
    optional_fields: [condition_evaluated, is_implicit, policy_source]
    evidence_bearing_fields: [decision_point]
    derives_from: [framework.backend.boundaries, framework.workflow.actors]
    consumption_profiles:
      - consumer: feature-inventory
        reads: [decision_point, covered_operations]
    fixtures:
      normal: One record per authorization decision point found within the declared scope, each carrying decision_point and a confidence level.
      empty: The declared scope was examined in full and contained no authorization decision point; completeness is Complete and the record set is empty.
      not_applicable: The system makes no authorization decision
      partial: Only externally exposed operations were compared; completeness is Partial and the unexamined boundary is recorded.
      boundary: Authorization performed by filtering results rather than by an explicit check records is_implicit true
  - type: framework.security.secrets
    type_version: 1.0.0
    lifecycle: active
    purpose: How secrets enter the system and whether any is present in the repository
    contract: A location and a class are recorded; a value never is, in whole or in part
    producer_kind: security-discovery
    subject_noun: secret reference
    required_fields: [secret_class, consuming_component, injection_mechanism, location, redaction_marker, evidence_state, confidence]
    optional_fields: [rotation_mechanism, is_committed, escalation_record]
    evidence_bearing_fields: [location]
    vocabularies:
      - field: injection_mechanism
        kind: open
        values: [environment, secret-store, mounted-file, build-time-inline, committed, unknown]
    derives_from: [framework.architecture.configuration, framework.database.connections, framework.frontend.exposure]
    fixtures:
      normal: One record per secret reference found within the declared scope, each carrying location and a confidence level.
      empty: The declared scope was examined in full and contained no secret reference; completeness is Complete and the record set is empty.
      not_applicable: The system consumes no secret
      partial: Committed history was out of scope; completeness is Partial and the unexamined boundary is recorded.
      boundary: A record with is_committed true carries an escalation_record; the artifact set is not delivered without it
  - type: framework.security.boundaries
    type_version: 1.0.0
    lifecycle: active
    purpose: Where the system stops trusting the party on the other side and what enforces the change
    contract: A boundary enforced by network placement is recorded as environmental and therefore unverifiable from the repository
    producer_kind: security-discovery
    subject_noun: trust boundary
    required_fields: [boundary, inner_party, outer_party, enforcement_class, evidence_state, confidence]
    optional_fields: [enforcing_location, transport_protection]
    evidence_bearing_fields: [boundary]
    vocabularies:
      - field: enforcement_class
        kind: closed
        values: [code-enforced, environmental, none]
      - field: transport_protection
        kind: closed
        values: [declared, absent, unknown]
    derives_from: [framework.architecture.integrations, framework.architecture.deployment, framework.backend.boundaries]
    fixtures:
      normal: One record per trust boundary found within the declared scope, each carrying boundary and a confidence level.
      empty: The declared scope was examined in full and contained no trust boundary; completeness is Complete and the record set is empty.
      not_applicable: The system has no boundary with any other party
      partial: Deployment topology was unavailable; completeness is Partial and the unexamined boundary is recorded.
      boundary: A boundary with enforcement_class none is recorded; it is not omitted for lack of a control
  - type: framework.security.dataprotection
    type_version: 1.0.0
    lifecycle: active
    purpose: What the system treats as sensitive and what protects it
    contract: Classifications use the data governance vocabulary; no record value appears
    producer_kind: security-discovery
    subject_noun: data class
    required_fields: [data_class, classification_source, encryption_at_rest, encryption_in_transit, evidence_state, confidence]
    optional_fields: [masking_sites, retention_reference, entities]
    evidence_bearing_fields: [classification_source]
    vocabularies:
      - field: encryption_at_rest
        kind: closed
        values: [declared, absent, unknown]
      - field: encryption_in_transit
        kind: closed
        values: [declared, absent, unknown]
    derives_from: [framework.database.security, framework.database.lifecycle]
    fixtures:
      normal: One record per data class found within the declared scope, each carrying classification_source and a confidence level.
      empty: The declared scope was examined in full and contained no data class; completeness is Complete and the record set is empty.
      not_applicable: The system handles no classifiable data
      partial: One store was not assessed; completeness is Partial and the unexamined boundary is recorded.
      boundary: Data treated as sensitive by code but absent from any classification register records classification_source absent
  - type: framework.security.supplychain
    type_version: 1.0.0
    lifecycle: active
    purpose: The third-party surface and how it is controlled
    contract: An advisory is evidence about a package; reachability from this system is recorded as determined or not
    producer_kind: security-discovery
    subject_noun: third-party component
    required_fields: [component, source_registry, pinning, reachability_determined, evidence_state, confidence]
    optional_fields: [advisory_references, advisory_source, advisory_date, install_scripts]
    evidence_bearing_fields: [component]
    vocabularies:
      - field: pinning
        kind: closed
        values: [pinned, ranged, floating, unknown]
    derives_from: [framework.architecture.dependencies]
    fixtures:
      normal: One record per third-party component found within the declared scope, each carrying component and a confidence level.
      empty: The declared scope was examined in full and contained no third-party component; completeness is Complete and the record set is empty.
      not_applicable: The system uses no third-party component
      partial: No advisory source was supplied; completeness is Partial and the unexamined boundary is recorded.
      boundary: Every record sets reachability_determined false unless separate evidence establishes it; no severity is restated
  - type: framework.security.auditlogging
    type_version: 1.0.0
    lifecycle: active
    purpose: Which security-relevant events leave a record
    contract: Unlogged events are enumerated against the security-relevant event set
    producer_kind: security-discovery
    subject_noun: security-relevant event
    required_fields: [event, is_logged, evidence_state, confidence]
    optional_fields: [emission_site, captured_fields, retention_reference, captures_sensitive_content]
    evidence_bearing_fields: [event]
    derives_from: [framework.security.identity, framework.security.authorization, framework.security.boundaries]
    consumption_profiles:
      - consumer: operations-discovery
        reads: [event, is_logged, retention_reference]
    fixtures:
      normal: One record per security-relevant event found within the declared scope, each carrying event and a confidence level.
      empty: The declared scope was examined in full and contained no security-relevant event; completeness is Complete and the record set is empty.
      not_applicable: The system performs no security-relevant action
      partial: Retention configuration was unavailable; completeness is Partial and the unexamined boundary is recorded.
      boundary: A record with captures_sensitive_content true is a finding in its own right and the content is never reproduced
  - type: framework.security.risks
    type_version: 1.0.0
    lifecycle: active
    purpose: Prioritized security-structure risks derived from the recorded observations
    contract: Every entry is a structural finding; no entry claims exploitability or restates an external severity score
    producer_kind: security-discovery
    subject_noun: security-structure risk
    required_fields: [risk, cause, impact, supporting_records, likelihood_rationale, evidence_state, confidence]
    optional_fields: [next_verification, reversibility]
    evidence_bearing_fields: [supporting_records]
    derives_from: [framework.security.authorization, framework.security.secrets, framework.security.boundaries, framework.security.dataprotection, framework.security.supplychain, framework.security.auditlogging]
    fixtures:
      normal: One record per security-structure risk found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no security-structure risk; completeness is Complete and the record set is empty.
      not_applicable: No observation in the artifact set supports a risk
      partial: Risk assessment covered part of the domain; completeness is Partial and the unexamined boundary is recorded.
      boundary: A vulnerability identifier, an external severity score, and an exploitability claim are each absent by construction
  - type: framework.security.health
    type_version: 1.0.0
    lifecycle: active
    purpose: Security health scores per dimension, with the calculation that produced each
    contract: Every score shows its calculation; the score measures structural clarity and coverage and is not a security rating
    producer_kind: security-discovery
    subject_noun: health dimension
    required_fields: [dimension, score, calculation, supporting_records, evidence_state, confidence]
    optional_fields: [bound_low, bound_high, escalation_flag]
    evidence_bearing_fields: [supporting_records]
    vocabularies:
      - field: dimension
        kind: closed
        values: [identity-mechanism-clarity, authorization-coverage, authorization-explicitness, secret-handling-posture, trust-boundary-enforcement, data-protection-evidence, supply-chain-control, audit-logging-coverage, documentation-traceability]
    derives_from: [framework.security.identity, framework.security.authorization, framework.security.secrets, framework.security.boundaries, framework.security.dataprotection, framework.security.supplychain, framework.security.auditlogging, framework.security.risks]
    fixtures:
      normal: One record per health dimension found within the declared scope, each carrying supporting_records and a confidence level.
      empty: The declared scope was examined in full and contained no health dimension; completeness is Complete and the record set is empty.
      not_applicable: No dimension is applicable to the subject
      partial: Some dimensions had no supporting evidence; completeness is Partial and the unexamined boundary is recorded.
      boundary: A dimension scored in the lowest two levels sets escalation_flag regardless of the aggregate
    notes: A score in this type measures structural clarity and coverage. It is not a security rating.
---
# Security Artifact Type Declarations

## 1. What This Document Is

*This section is informative.*

Declarations for the 9 artifact types produced by security discovery.

Every record in the front matter of this document is a **declaration**: structured data supplying the values that requirements in [STD-0013](../02-methodology/artifact-type-declaration-standard.md) range over. A declaration states no obligation and can therefore not be violated. Every rule that governs these types is stated once in that standard and is not repeated here.

This document carries no `requirements` key and no normative section, per [STD-0010](../02-methodology/metadata-specification.md) R-16 and [STD-0013](../02-methodology/artifact-type-declaration-standard.md) R-31.

## 2. Declared Types

*This section is informative.*

The table renders the front matter for a human reader. The front matter is authoritative.

| Type | Asserts | Subject counted |
| --- | --- | --- |
| `framework.security.identity` | How the system decides who a caller is | authentication mechanism |
| `framework.security.authorization` | What the system permits an identified caller to do, and where it decides | authorization decision point |
| `framework.security.secrets` | How secrets enter the system and whether any is present in the repository | secret reference |
| `framework.security.boundaries` | Where the system stops trusting the party on the other side and what enforces the change | trust boundary |
| `framework.security.dataprotection` | What the system treats as sensitive and what protects it | data class |
| `framework.security.supplychain` | The third-party surface and how it is controlled | third-party component |
| `framework.security.auditlogging` | Which security-relevant events leave a record | security-relevant event |
| `framework.security.risks` | Prioritized security-structure risks derived from the recorded observations | security-structure risk |
| `framework.security.health` | Security health scores per dimension, with the calculation that produced each | health dimension |

9 types. Each is registered in the [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md).

## 3. Related Documents

*This section is informative.*

- [Artifact Type Declaration Standard](../02-methodology/artifact-type-declaration-standard.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md)
