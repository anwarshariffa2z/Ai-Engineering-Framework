---
id: AUD-0007
title: Security and Permissions Discovery Methodology
version: 1.1.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-30
review_cycle: Annual
category: Audit Engine
tags: [audit-engine, security, permissions, discovery, methodology]
related: [01-architecture-discovery.md, 02-database-discovery.md, 04-backend-discovery.md, 05-business-workflow-discovery.md, 07-feature-inventory.md, ../02-methodology/glossary.md, ../09-capabilities/CAP-0001-repository-audit.md]
object_type: Methodology
layer: 1
depends_on: [../02-methodology/evidence-and-confidence.md, ../02-methodology/artifact-specification.md, ../02-methodology/metadata-specification.md, ../02-methodology/contract-specification.md, ../02-methodology/validation-specification.md, ../04-development/security-standard.md, ../04-development/data-governance-standard.md]
references: [01-architecture-discovery.md, 02-database-discovery.md, 04-backend-discovery.md, 05-business-workflow-discovery.md, 07-feature-inventory.md, ../09-capabilities/CAP-0001-repository-audit.md, ../02-methodology/glossary.md]
meta_model_version: 1.0.0
producer_kinds: [security-discovery]
normativity:
  "1": informative
  "2": normative
  "3": normative
  "4": normative
  "5": normative
  "6": normative
  "7": normative
  "8": normative
  "9": normative
  "10": normative
  "11": informative
  "12": informative
  "13": informative
---

# Security and Permissions Discovery Methodology

## 1. Purpose and Scope

*This section is informative.*

Security and Permissions Discovery is an evidence-led examination of the identity, authorization, secret-handling, and trust-boundary structure a repository defines. It establishes who the system believes a caller is, what it permits that caller to do, where those decisions are made, and what it protects.

**This methodology is not a security test.** It performs no scanning, no exploitation, and no attack. It produces a structural map of security-relevant mechanisms and the gaps between them, which is a starting point for a security review and not a substitute for one. [CAP-0001](../09-capabilities/CAP-0001-repository-audit.md) section 5 states this limitation as part of the capability's public contract, and this methodology restates it here because the distinction is the one most often lost when its output is read.

The distinction it preserves throughout is between a mechanism that exists, a mechanism that is applied, and a mechanism that is effective. A framework's authorization library present in a manifest is the first. A decorator on a handler is the second. Whether the check admits the right callers is the third, and this methodology does not establish it.

**This methodology consumes the framework standards and does not restate them.** Evidence states, confidence levels, scoring principles, completeness semantics, artifact structure, participant obligations, and validation behaviour are defined by the standards listed in section 3. Only security-discovery-specific process is defined here.

## 2. Capability Declaration

*This section is normative.*

This methodology is a constituent of [CAP-0001 Repository Audit](../09-capabilities/CAP-0001-repository-audit.md), where it consumes architecture, database, backend, and workflow artifacts and supplies identity, authorization, and trust-boundary evidence to feature inventory, operations, and gap analysis.

**Executor type.** Human, agent, or either.

**Safety boundaries.** The executor MUST NOT modify the subject, execute destructive commands, attempt authentication, attempt to bypass a control, scan a live host, read production records, or reproduce any secret value, credential, token, key, endpoint, or record content. A secret that is discovered is recorded by location and class only, and its discovery is escalated to the named recipient before the artifact set is delivered. Where the audit is authorized to run a static analysis tool, it records the tool, version, configuration, and scope; the tool's output is evidence about the tool's findings, not a verdict about the system.

## 3. Standards Consumed

*This section is normative.*

| Standard | What this methodology takes from it |
| --- | --- |
| [STD-0007](../02-methodology/evidence-and-confidence.md) | Evidence states and their meanings; provenance and attributability; evidence quality and freshness; the confidence model; completeness semantics; promotion and degradation; uncertainty propagation; scoring principles and the 0-to-5 scale |
| [STD-0008](../02-methodology/artifact-specification.md) | Artifact structure, envelope, record and evidence attachment points, redaction state, artifact type definition and versioning |
| [STD-0010](../02-methodology/metadata-specification.md) | Metadata representation for every declaration this methodology makes or its artifacts carry |
| [STD-0011](../02-methodology/contract-specification.md) | Producer obligations, preconditions, guaranteed outputs, failure conditions, and their mapping to completeness states |
| [STD-0012](../02-methodology/validation-specification.md) | How conformance is evaluated, reported, and enforced; validation classes and outcomes |
| [STD-0006](../04-development/security-standard.md) | Secret handling, least-privilege terminology, and the prohibition on disclosing credential values |
| [STD-0003](../04-development/data-governance-standard.md) | Classification vocabulary, retention terminology, and logging expectations |

No definition here overrides a standard. Any apparent conflict is a defect in this document.

## 4. Inputs

*This section is normative.*

**Required.** Repository root; immutable revision identifier; audit request and declared scope; output location outside the subject; authorization boundary; a named recipient for secret-exposure escalation.

**Optional.** Identity provider configuration; session and token configuration; role and permission definitions; policy files; middleware registration; secret-management configuration; encryption configuration; certificate and key references; dependency advisories; audit-logging configuration; data-classification registers; threat models; prior security assessments; static analysis output.

Each input is logged with source, access date, environment, and trust level. Absence of an optional input lowers achievable confidence and does not lower a score, per [STD-0011](../02-methodology/contract-specification.md) R-22.

**Consumed artifact types.** `framework.architecture.integrations`, `framework.architecture.configuration`, `framework.architecture.deployment`, `framework.database.security`, `framework.database.connections`, `framework.backend.interfaces`, `framework.backend.boundaries`, `framework.frontend.exposure`, `framework.workflow.enforcement`, `framework.workflow.actors`. The dependency is on these types, never on the methodologies that produced them.

## 5. Preconditions

*This section is normative.*

Read access to the repository tree at a stable revision; a working location outside the subject; tools to enumerate files and search text; permission to inspect non-secret identity, policy, and configuration metadata; a declared authorization boundary; and a named recipient for escalations who can be reached before delivery.

Where a precondition is unmet the methodology is not invoked and the affected artifact types are recorded unavailable, per [STD-0011](../02-methodology/contract-specification.md) R-16 and R-17.

Where no escalation recipient is named, the methodology is not invoked. A discovered credential requires a route to a human before the run continues, and an audit that cannot escalate must not begin.

## 6. Artifact Types Produced

*This section is normative.*

Nine artifact types. Their structure conforms to [STD-0008](../02-methodology/artifact-specification.md); each type definition declares the sixteen sections that standard requires.

| Type | Content |
| --- | --- |
| `framework.security.identity` | Authentication mechanisms with provider, credential type, session or token lifetime, renewal path, and the components that establish identity |
| `framework.security.authorization` | Permission model with subjects, resources, actions, the decision point for each, and the operations covered and not covered by each decision point |
| `framework.security.secrets` | Secret classes by location and management mechanism, recorded with redaction markers and never with values, including committed-secret findings and their escalation record |
| `framework.security.boundaries` | Trust boundaries with the parties on each side, the control enforcing each, the transport protection in force, and unenforced-boundary findings |
| `framework.security.dataprotection` | Classification of stored and transmitted data with encryption posture, masking, retention linkage, and the evidence establishing each |
| `framework.security.supplychain` | Third-party components with source, pinning posture, update mechanism, advisory references, and the distinction between a declared advisory and a demonstrated reachability |
| `framework.security.auditlogging` | Security-relevant events recorded, the component that records each, retention linkage, and unlogged-event findings |
| `framework.security.risks` | Security-structure risk register with cause, impact, evidence, likelihood rationale, confidence, and follow-up, framed as structural findings rather than as vulnerabilities |
| `framework.security.health` | Health scores per dimension with evidence, confidence, and calculation |

Downstream methodologies depend on these **types**, never on this methodology, per [ADR-0004](../ADR/ADR-0004-depend-on-artifact-types.md).

## 7. Guaranteed Outputs

*This section is normative.*

This methodology guarantees, for each declared type: that an artifact of that type is emitted; that it conforms to the type at the declared version; that its completeness state is declared; and that its provenance is recorded. It guarantees no finding and no property of the subject, per [STD-0011](../02-methodology/contract-specification.md) R-23 and R-24.

**It explicitly does not guarantee that the system is secure, that no vulnerability exists, or that a control it records is effective.** An artifact set from this methodology that records every mechanism as present is consistent with a system that is exploitable, and consumers are entitled to rely only on the structural claims stated in each artifact.

Where a stage cannot be performed, its artifact carries the completeness state that [STD-0011](../02-methodology/contract-specification.md) section 10 maps to the failure, with the disclosure that section requires.

## 8. Discovery Principles

*This section is normative.*

These are security-discovery-specific. General evidence discipline is STD-0007's and is not repeated.

1. **Present, applied, and effective are three findings.** A dependency is presence. A registration on an operation is application. Effectiveness is out of scope, and a record that does not say which of the three it establishes is not a conforming record.
2. **Coverage is enumerated, not asserted.** A control's coverage is the list of operations it applies to, compared against the list of operations that exist. A middleware registration is not coverage until that comparison is made.
3. **A discovered secret is an incident, not a finding.** It is recorded by location and class, escalated to the named recipient before delivery, and never reproduced. Rotation is the owner's decision and is recommended, not performed.
4. **An advisory is not a vulnerability in this system.** A dependency advisory is evidence about a package. Reachability from this system's code is a separate question, and this methodology records the advisory and the absence of a reachability determination.
5. **The strongest evidence is the check that runs.** Policy documents, role names, and configuration keys describe intent. The decision point that evaluates a condition at a location is what the system does.

## 9. Discovery Workflow

*This section is normative.*

Ten stages. Each declares purpose, inputs, actions, required evidence, deliverables, failure conditions, and acceptance criteria. Every conclusion carries an evidence state and confidence per [STD-0007](../02-methodology/evidence-and-confidence.md).

### Stage 1 — Identity Discovery

**Purpose.** Establish how the system decides who a caller is.

**Inputs.** Identity provider configuration, authentication middleware, session and token handling, credential verification code, `framework.backend.interfaces`.

**Actions.** Record each authentication mechanism with its provider, credential type, verification location, session or token lifetime, renewal path, and revocation mechanism. Identify operations reachable without authentication and record them as unauthenticated rather than as public unless a declaration establishes intent. Record multiple concurrent mechanisms separately, because their guarantees differ.

**Evidence Required.** Provider configuration path, verification code location, lifetime and renewal declarations, revocation mechanism where present.

**Deliverables.** `framework.security.identity`.

**Failure Conditions.** An authentication library dependency reported as an authentication mechanism; token lifetimes taken from a library default without configuration evidence; a token or session value reproduced.

**Acceptance Criteria.** Each mechanism names a verification location, and every interface records an authentication requirement or an explicit unauthenticated finding.

### Stage 2 — Authorization Discovery

**Purpose.** Establish what the system permits an identified caller to do, and where it decides.

**Inputs.** Role and permission definitions, policy files, authorization checks, tenancy filters, `framework.backend.boundaries`, `framework.workflow.actors`.

**Actions.** Record the permission model as subjects, resources, actions, and the decision point for each. For every decision point, enumerate the operations it covers and compare against the operation inventory, recording uncovered operations explicitly. Identify authorization performed by data filtering rather than by an explicit check, and record it as implicit. Identify checks whose condition depends on client-supplied values.

**Evidence Required.** Policy or role declaration, decision point location, the condition evaluated, the covered operation list, the uncovered operation list.

**Deliverables.** `framework.security.authorization`.

**Failure Conditions.** Coverage asserted from a middleware registration without enumeration; a role name treated as a permission definition; an effectiveness judgment issued; a permission model described with no decision point.

**Acceptance Criteria.** Each decision point names its location and its enumerated coverage, and uncovered operations are listed rather than summarized.

### Stage 3 — Secret Handling Discovery

**Purpose.** Establish how secrets enter the system and whether any are present in the repository.

**Inputs.** Secret-management configuration, environment-variable references, key and certificate references, `framework.architecture.configuration`, `framework.database.connections`, `framework.frontend.exposure`, committed history where authorized and in scope.

**Actions.** Record each secret class by consuming component, injection mechanism, storage location class, and rotation mechanism where declared. Identify secrets present in the repository, in build output, or in client bundles. **Record location and class only.** Escalate every such finding to the named recipient before delivery, record the escalation, and recommend rotation without performing it.

**Evidence Required.** Reference location, injection mechanism, redaction marker, escalation record for every committed-secret finding.

**Deliverables.** `framework.security.secrets`.

**Failure Conditions.** Any secret value reproduced, in whole or in part; a committed secret recorded without escalation; a placeholder in an example file reported as a live credential without evidence; rotation performed by the audit.

**Acceptance Criteria.** No artifact contains a credential value, every committed-secret finding carries an escalation record, and each secret class names an injection mechanism.

### Stage 4 — Trust Boundary Discovery

**Purpose.** Establish where the system stops trusting the party on the other side and what enforces the change.

**Inputs.** `framework.architecture.integrations`, `framework.architecture.deployment`, network and transport configuration, internal-versus-external routing, service-to-service authentication, `framework.backend.boundaries`.

**Actions.** Record each boundary with the parties on either side, the control enforcing it, and the transport protection in force. Distinguish boundaries enforced by code from boundaries enforced by network placement, and record the latter as environmental and therefore unverifiable from the repository. Identify boundaries with no enforcing control.

**Evidence Required.** Boundary declaration, enforcing control location, transport configuration, deployment evidence where the boundary is environmental.

**Deliverables.** `framework.security.boundaries`.

**Failure Conditions.** A network-placement assumption reported as a code control; transport protection assumed from a scheme in a documentation example; an integration counted as a boundary without a direction.

**Acceptance Criteria.** Each boundary names its parties, its enforcement class, and either an enforcing location or an explicit absence finding.

### Stage 5 — Data Protection Discovery

**Purpose.** Establish what the system classifies as sensitive and what protects it.

**Inputs.** `framework.database.security`, classification registers, encryption configuration, masking and redaction code, retention configuration, transport settings.

**Actions.** Record each data class with its classification source, the encryption posture at rest and in transit, masking applied in logs and responses, and the retention linkage. Identify data handled as sensitive by code but absent from any classification register, and the reverse. Use the classification vocabulary of [STD-0003](../04-development/data-governance-standard.md); do not invent a parallel one.

**Evidence Required.** Classification declaration, encryption configuration location, masking site, retention reference.

**Deliverables.** `framework.security.dataprotection`.

**Failure Conditions.** Encryption at rest asserted from a managed-service default without evidence; a classification invented outside STD-0003's vocabulary; record values reproduced as evidence of a class.

**Acceptance Criteria.** Each data class names its classification source and its protection evidence, or records the absence explicitly.

### Stage 6 — Supply Chain Discovery

**Purpose.** Establish the third-party surface and how it is controlled.

**Inputs.** `framework.architecture.dependencies`, lockfiles, registry configuration, update automation, advisory sources where supplied, build-time script declarations.

**Actions.** Record third-party components with source registry, pinning posture, update mechanism, and integrity verification where present. Record advisories supplied as inputs against the components they name. **Record explicitly that reachability was not determined**, unless separate evidence establishes it. Identify dependencies installed from non-registry sources and build-time scripts that execute during installation.

**Evidence Required.** Manifest and lockfile locations, registry configuration, advisory reference with its source and date, install-script declaration.

**Deliverables.** `framework.security.supplychain`.

**Failure Conditions.** An advisory reported as a vulnerability in this system; a severity restated as this system's severity; an unpinned dependency reported as compromised.

**Acceptance Criteria.** Each advisory record names its source, its date, and the absence or presence of a reachability determination.

### Stage 7 — Audit Logging Discovery

**Purpose.** Establish which security-relevant events leave a record.

**Inputs.** Logging configuration, audit event emission sites, authentication and authorization failure paths, administrative action handlers, retention configuration.

**Actions.** Record which events are logged, the component that records each, the fields captured, and the retention linkage. Compare against the security-relevant events implied by the identity, authorization, and boundary artifacts, recording unlogged events explicitly. Identify logs that capture credential or record content, which is a finding in its own right.

**Evidence Required.** Emission site, event identity, captured-field declaration, retention reference.

**Deliverables.** `framework.security.auditlogging`.

**Failure Conditions.** Application logging reported as audit logging without an event taxonomy; retention assumed from a platform default; log content reproduced.

**Acceptance Criteria.** Each recorded event names its emission site, and the unlogged-event list is enumerated against the security-relevant event set.

### Stage 8 — Security Structure Risks

**Purpose.** Convert supported observations into prioritized structural risks without issuing a security verdict.

**Inputs.** All previous stage deliverables, risk tier, classification register, stated constraints.

**Actions.** Identify risks involving uncovered operations, implicit authorization, client-only enforcement, boundaries with no code control, secrets in the repository, unpinned dependencies with install scripts, sensitive data with no classification, and security events with no record. State cause, impact, affected evidence, likelihood rationale, confidence, and suggested next verification. **Frame every entry as a structural finding.** Do not assign a vulnerability identifier, a severity from an external scoring system, or an exploitability claim.

**Evidence Required.** At least one observation supporting the risk and the reasoning from observation to risk.

**Deliverables.** `framework.security.risks`.

**Failure Conditions.** A vulnerability claimed; an external severity score restated as this system's; exploitability asserted; a generic checklist item recorded without repository evidence.

**Acceptance Criteria.** Each entry is a structural finding traceable to cited evidence, and no entry claims exploitability.

### Stage 9 — Evidence Consolidation

**Purpose.** Normalize and quality-check evidence so conclusions remain auditable after the session ends, without retaining anything sensitive.

**Inputs.** Observations, paths, revision data, tool output, escalation records.

**Actions.** Record every evidence item with the attributes [STD-0008](../02-methodology/artifact-specification.md) R-15 requires and the provenance [STD-0007](../02-methodology/evidence-and-confidence.md) section 5 requires. Declare the artifact's redaction state per [STD-0008](../02-methodology/artifact-specification.md) R-33, and record the class of every withheld item so that a consumer does not read redaction as absence. Record lineage per record where a conclusion derives from an upstream artifact.

**Evidence Required.** Complete evidence attachment for every record, per STD-0008 R-14, and a declared redaction state.

**Deliverables.** Evidence records within every produced artifact.

**Failure Conditions.** Any credential, token, key, endpoint, or record value retained; redaction applied without recording the class withheld; blanket lineage recorded where derivation is partial.

**Acceptance Criteria.** Every artifact declares a redaction state, no artifact contains a sensitive value, and each withheld item records its class.

### Stage 10 — Final Verification

**Purpose.** Confirm the output is internally consistent, complete for scope, and safe to deliver.

**Inputs.** All artifacts, scoring worksheets, escalation records, unresolved-question list.

**Actions.** Confirm every stage produced an artifact or an explicit completeness state with a reason. Confirm every authorization decision point carries an enumerated coverage list, every committed-secret finding carries an escalation record, and every advisory carries a reachability statement. Re-scan the artifact set for credential patterns before delivery. Confirm no artifact asserts that the system is secure.

**Evidence Required.** Completed verification, artifact versions, escalation record, credential-scan result.

**Deliverables.** `framework.security.health`, completed and consistent artifact set.

**Failure Conditions.** A sensitive value present at delivery; an escalation missing; a security verdict present; coverage summarized rather than enumerated.

**Acceptance Criteria.** The artifact set is traceable, internally coherent, complete for declared scope, free of sensitive values, and explicit that it is not a security assessment.

How this output is validated is defined by [STD-0012](../02-methodology/validation-specification.md); this methodology does not define validator behaviour.

## 10. Health Dimensions

*This section is normative.*

The scale, its meanings, the averaging guard, the escalation guard, and the partial-coverage rule are defined by [STD-0007](../02-methodology/evidence-and-confidence.md) section 13. This methodology declares only its dimensions.

Nine dimensions: identity mechanism clarity; authorization coverage; authorization explicitness; secret-handling posture; trust boundary enforcement; data protection evidence; supply chain control; audit logging coverage; documentation traceability.

A score in this artifact set is a measure of structural clarity and coverage. It is not a security rating, and [CAP-0001](../09-capabilities/CAP-0001-repository-audit.md) section 5 governs how it may be presented.

The lowest two levels of the scale for the purposes of the escalation guard are `0` and `1`.

## 11. Security Structure Smells

*This section is informative.*

Treat a smell as a prompt for investigation, not proof of failure. Common smells include authorization enforced by filtering query results rather than by a check; a permission model documented in a wiki and nowhere in code; middleware registered globally with per-route exemptions nobody enumerated; a role whose name implies restriction and whose policy grants everything; secrets injected through environment variables with no rotation mechanism; a boundary whose only control is that the service is not publicly routed; sensitive fields absent from the classification register; authentication failures logged and authorization failures not; dependencies pinned in one manifest and floating in another; and a token lifetime longer than the session it protects.

## 12. Examples and Common Mistakes

*This section is informative.*

A policy declaration, a decision point evaluating it, an enumerated list of the operations that decision point covers, and a matching list of operations that exist together support an observed authorization model with measured coverage. A middleware registration alone supports only the claim that a mechanism is applied somewhere. A credential found in a committed configuration file is recorded as a location and a class, escalated the same session, and never quoted.

Common mistakes are reporting an authorization library as an authorization model; asserting coverage without enumeration; treating a dependency advisory as a vulnerability in this system; restating an external severity score; reproducing part of a secret to demonstrate its class; reporting the absence of a scanner as the absence of a problem; issuing an exploitability claim; and presenting a health score from this methodology as a security rating.

Do not attempt authentication. Do not attempt to bypass a control. Do not scan a live host. Do not rotate a credential. Do not deliver an artifact set containing a secret value.

## 13. Related Documents

*This section is informative.*

- [Architecture Discovery](01-architecture-discovery.md)
- [Database Discovery](02-database-discovery.md)
- [Backend Discovery](04-backend-discovery.md)
- [Business Workflow Discovery](05-business-workflow-discovery.md)
- [Feature Inventory](07-feature-inventory.md)
- [CAP-0001: Repository Audit](../09-capabilities/CAP-0001-repository-audit.md)
- [Evidence and Confidence Standard](../02-methodology/evidence-and-confidence.md)
- [Artifact Specification Standard](../02-methodology/artifact-specification.md)
- [Metadata Specification Standard](../02-methodology/metadata-specification.md)
- [Contract Specification Standard](../02-methodology/contract-specification.md)
- [Validation Specification Standard](../02-methodology/validation-specification.md)
- [Security Standard](../04-development/security-standard.md)
- [Data Governance Standard](../04-development/data-governance-standard.md)
- [Framework Glossary](../02-methodology/glossary.md)
