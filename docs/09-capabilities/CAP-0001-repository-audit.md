---
id: CAP-0001
title: Repository Audit Capability
version: 1.3.2
status: Draft
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-29
review_cycle: Annual
category: Capability
tags: [capability, audit, repository, contract, evidence]
related: [../01-foundation/framework-core-architecture.md, ../03-audit-engine/README.md, ../03-audit-engine/01-architecture-discovery.md, ../03-audit-engine/02-database-discovery.md, ../07-roadmap/audit-engine-roadmap.md, ../02-methodology/glossary.md]
---

# CAP-0001: Repository Audit

## 1. The Promise

**Repository Audit produces an evidence-backed, reproducible assessment of a software repository's engineering health at a specific revision, in which every conclusion is traceable to a recorded observation, every material uncertainty is named rather than resolved by assumption, and no part of the repository or its data is modified.**

That sentence is the contract. Everything else in this document either bounds it or makes it verifiable.

This document states what Repository Audit promises. It does not state how the promise is fulfilled; that belongs to the constituent methodologies, which this capability composes but does not describe.

## 2. What This Capability Does Not Promise

A contract is defined as much by its exclusions as by its commitments. Repository Audit explicitly does **not** promise any of the following, and a consumer who requires one of them requires a different capability.

| Not promised | Why, and what to use instead |
| --- | --- |
| That the software is correct | The audit examines declared structure and recorded evidence. It does not prove behavior. Correctness requires testing. |
| That the software is secure | The audit surfaces security-relevant structure, boundaries, and evidenced weaknesses. It is not a penetration test, a vulnerability scan, or a threat assessment, and it does not assert exploitability. |
| Compliance certification | The audit reports evidence against framework requirements. It does not certify conformance with any legal, regulatory, or contractual regime. |
| That production behaves as the repository declares | Unless runtime evidence is supplied and verified, every conclusion describes declared intent. The audit states which of the two it is describing, always. |
| Absence of a defect | Negative findings are bounded by the searched scope and recorded method. "Not found" never means "not present." |
| A decision | The audit informs a decision. It does not approve a release, accept a risk, authorize a remediation, or grade a team. |
| Performance measurement | Performance observations derive from declared structure and code inspection unless measured evidence is supplied, in which case it is attributed to an environment and date. |
| Code review | The audit assesses structure, boundaries, controls, and evidence. It does not review implementation quality line by line. |
| Completeness beyond declared scope | The audit covers the domains its constituent methodologies cover, at the revision and within the authorization it was given. Everything else is recorded as out of scope. |

**The audit never modifies the subject.** It does not write to the repository, execute destructive commands, apply migrations, alter data, or perform remediation. This is a boundary, not a default.

## 3. Purpose

Teams inherit, acquire, and outgrow repositories faster than they can understand them. The prevailing alternatives are a senior engineer reading code for two weeks and producing an opinion, or a tool producing metrics with no provenance. The first does not scale and is not reproducible; the second is reproducible and not trustworthy.

Repository Audit exists to make repository assessment **reproducible, traceable, and honest about its own limits**: reproducible because it is anchored to an immutable revision and a recorded method; traceable because every conclusion cites evidence a reviewer can navigate to and challenge; honest because it distinguishes what was verified from what was observed, inferred, or remains unknown, and refuses to collapse that distinction into a single reassuring number.

## 4. Scope

### 4.1 Subject

One software repository at one immutable revision, together with the artifacts supplied alongside it.

A repository containing part of a larger system is in scope; the audit reports the boundary it could establish and records the rest as unknown. Multiple repositories are audited as multiple runs, composed by the requester.

### 4.2 Domains

Eleven domains. Each is examined by one constituent methodology.

| Domain | Question it answers |
| --- | --- |
| Bootstrap | What is the audit boundary, revision, authorization, and evidence access? |
| Architecture | How is the system composed, built, configured, deployed, and connected? |
| Database | How is data declared, related, protected, moved, retained, and recovered? |
| Frontend | How is the user-facing surface structured, and what does it expose? |
| Backend | How are services, interfaces, and execution boundaries organized? |
| Business workflow | What business rules and processes does the system encode? |
| Security and permissions | Where are identity, authorization, secrets, and trust boundaries? |
| Feature inventory | What does the system actually do, and which parts are live? |
| Operations | How is the system run, observed, and recovered? |
| Gap analysis | Where do declared intent, implementation, and evidence disagree? |
| Runtime verification | What does the running system demonstrate? |

### 4.3 Boundaries of the run

In scope: the repository tree at the audited revision; its declared configuration, automation, infrastructure definitions, and documentation; artifacts explicitly supplied by the requester; and read-only, non-production metadata where authorization is granted.

Out of scope unless explicitly supplied and authorized: production systems, production data, records of any kind, credentials, external services, and any repository other than the subject.

## 5. Target Users

| User | What they get | What they must supply |
| --- | --- | --- |
| Engineering leader inheriting a codebase | A bounded map of what exists, what is uncertain, and what is risky | Repository access, revision, scope, and a named recipient for escalations |
| Technical due-diligence reviewer | Reproducible findings with provenance, and explicit unknowns rather than confident guesses | The same, plus any documentation the seller supplies |
| Platform or architecture team | A comparable assessment across repositories using one method | Consistent scope declarations per repository |
| Security reviewer | Structural inputs — trust boundaries, classification, credential separation — as a starting point, not a conclusion | Awareness that this is not a security test |
| Data steward | Classification candidates, retention evidence, and lineage requiring confirmation | Confirmation of inferred classifications |
| Service owner | Operability, recovery, and deployment evidence gaps | Access to operational records where they exist |
| AI agent executing the audit | A declared closure of methodologies, standards, and artifact types, with per-domain cost | Authorization boundaries and an output location |

The audit is designed to be executed by an AI agent, by a human, or by both. The executor type is declared per run; the promise does not change with the executor, but the evidence available to it might, and the report says so.

## 6. Inputs

### 6.1 Required

| Input | Why required |
| --- | --- |
| Repository root | The subject |
| Immutable revision identifier | The reproducibility anchor; a branch name is recorded only as a convenience |
| Audit request and declared scope | Establishes what was asked for, so out-of-scope material is recorded rather than silently omitted |
| Output location | Where artifacts and views are written; never inside the subject |
| Authorization boundary | What the executor may read, and explicitly what it may not |
| Named escalation recipient | Escalations are useless without a person to receive them |

### 6.2 Optional, each raising achievable confidence

Manifest declaring ownership and risk tier; CI and build logs; deployment and infrastructure manifests; read-only catalogue output from a non-production environment; runtime telemetry and incident records; data classification registers; dependency lockfiles; API contracts; architecture documentation; owner interviews; prior audit artifacts for the same subject.

Each optional input is logged with source, access date, environment, and trust level. **Absent optional inputs lower confidence; they do not lower the score.** A repository is not penalized for evidence the requester did not supply — the affected conclusions are marked Unknown and the confidence cap is stated.

## 7. Preconditions

The audit does not begin unless all of the following hold. Where one fails, section 12 states the response.

1. A stable, immutable revision can be identified.
2. Read access to the repository tree is available.
3. A working location outside the subject is available for outputs.
4. The authorization boundary is declared and unambiguous.
5. The declared scope is recorded and its exclusions are known.
6. A named recipient exists for escalations.
7. The executor meets the requirements declared by each constituent methodology, or the domains it cannot execute are declared unaudited before the run rather than after.

## 8. Required Standards

Repository Audit is governed by these framework standards. It conforms to them by reference; it does not restate them.

| Standard | What it governs in this capability |
| --- | --- |
| Data Governance Standard (STD-0003) | Classification vocabulary, retention terminology, and the handling constraints for anything the audit identifies as sensitive |
| Security Standard (STD-0006) | Secret handling, least-privilege access during the run, and the prohibition on disclosing credential values |
| Evaluation Standard (STD-0004) | The evidence-quality discipline applied to conclusions and the treatment of limitations |
| Reliability Standard (STD-0005) | The operability and recovery expectations against which operational findings are assessed |
| Document Metadata Standard (STD-0001) | The metadata every produced artifact and view carries |
| Framework Document ID Standard (STD-0002) | Identifier discipline for framework objects; audit output identifiers are governed separately by the producing methodology |
| Risk Management (DOC-0005) | Risk tier vocabulary and the proportionality of findings to impact |
| Ownership Model (DOC-0003) | The role vocabulary used when a finding is assigned an owner candidate |

Two shared models are required across every constituent methodology and must not be redefined by any of them: the four evidence states (Verified, Observed, Inferred, Unknown) and the 0-to-5 health scale with its averaging and escalation guards. These currently reside in the architecture and database methodologies; the framework architecture review recommends extracting them, and this capability depends on that extraction being consistent whatever form it takes.

## 9. Required Methodologies

Repository Audit composes eleven methodologies. It depends on each producing declared **artifact types**, never on the identity of the producer — a conforming substitute may replace any of them (section 14.1).

### 9.1 Composition and ordering

Ordering is determined by artifact dependency, not by preference. A methodology may begin when its input artifact types exist.

```
Bootstrap
   |
   v
Architecture ......................... (foundational; supplies repository map,
   |    |    |                          technology inventory, module boundaries,
   |    |    |                          integration register to all downstream)
   |    |    +--> Database
   |    |            |
   |    +--> Frontend|
   |    |            |
   |    +--> Backend |
   |          |      |
   |          v      v
   |       Business workflow
   |          |
   |          v
   |       Feature inventory
   |
   +--> Operations
              |
              v
        Security and permissions   (consumes Database classification and
              |                     credential boundary, Backend interfaces,
              |                     Architecture trust boundaries)
              v
        Gap analysis               (consumes all preceding artifacts)
              |
              v
        Runtime verification       (the only methodology that may promote a
                                    conclusion from Observed to Verified)
```

Parallelism is permitted wherever artifact dependencies allow it. Runtime verification is optional and is skipped when no runtime evidence is authorized; its absence caps achievable confidence rather than failing the run.

### 9.2 Readiness

This capability is **partially fulfillable at the current framework revision**, and declares it rather than implying otherwise.

| Domain | Methodology | State |
| --- | --- | --- |
| Architecture | AUD-0002 | Approved |
| Database | AUD-0003 | Approved |
| Bootstrap | AUD-0001 | Draft structure only |
| Frontend | AUD-0004 | Approved |
| Backend | AUD-0005 | Approved |
| Business workflow | AUD-0006 | Approved |
| Security and permissions | AUD-0007 | Approved |
| Feature inventory | AUD-0008 | Approved |
| Operations | AUD-0009 | Approved |
| Gap analysis | AUD-0010 | Approved |
| Runtime verification | AUD-0011 | Approved |

**Ten of eleven methodologies are approved, and every artifact type they declare is declared in the corpus.** How an artifact instance is identified and addressed is decided by [ADR-0006](../ADR/ADR-0006-artifact-instance-identity.md) and carried into the standards it names: a producer records an identity per [STD-0008](../02-methodology/artifact-specification.md) R-52, and a consumer resolves one under the duties of [STD-0011](../02-methodology/contract-specification.md) R-47 through R-52. What the capability still lacks is implementational rather than architectural: no producer exists to emit an instance of any declared type.

A run at this revision produces a valid but partial audit whose composed health is a bounded range (section 11.3). The capability is honest about this by design: a capability that claims readiness it does not have is worse than one that does not exist, because consumers act on the claim.

## 10. Outputs

### 10.1 Produced artifacts

Artifacts are structured, typed, machine-readable outputs. Each carries the audited revision, declared scope, environments inspected, producing methodology and version, per-row evidence state and confidence, and provenance for every claim. Artifact types are the contract between methodologies and are stable across substitutions.

| Artifact | Content | Producer |
| --- | --- | --- |
| Audit Scope Record | Revision, authorization boundary, declared scope, exclusions, executor, start and end | Bootstrap |
| Architecture Artifacts | Repository map, technology and build inventories, entry points, modules and layers, runtime and integration registers, configuration and deployment inventories | Architecture |
| Database Artifacts | The fourteen DB-NNN artifacts: technology, connections, schema, entities, relationships, constraints, indexes, migration, security, performance, lifecycle, health, risks, recommendations | Database |
| Frontend Artifacts | Surface inventory, routing, state, exposure findings | Frontend |
| Backend Artifacts | Service, interface, and execution-boundary inventories | Backend |
| Workflow Artifacts | Business rule and process inventories with enforcement locations | Business workflow |
| Security Artifacts | Identity, authorization, secret, and trust-boundary registers | Security and permissions |
| Feature Inventory Artifact | Feature register with liveness and ownership evidence | Feature inventory |
| Operations Artifacts | Observability, release, and recovery inventories | Operations |
| Gap Analysis Artifact | Divergences between declared intent, implementation, and evidence | Gap analysis |
| Runtime Verification Artifact | Conclusions promoted to Verified, with environment and date | Runtime verification |
| **Evidence Ledger** | Every evidence item with identity, source, location, environment, revision, collector, redaction state, reliability class | All, composed |
| **Repository Health Artifact** | Per-domain scores with evidence and confidence, and the composed result with its calculation | Capability |
| **Unknowns Register** | Every material unknown with its scope reason and the verification that would resolve it | All, composed |
| **Escalation Record** | Every escalation, its trigger, recipient, and time | All, composed |

The last four are composed by the capability rather than produced by any single methodology. They are the capability's own output and the reason it is more than a sequence of methodology runs.

### 10.2 Produced views

Views are generated presentations. They originate nothing; every claim traces to an artifact row and its evidence.

| View | Audience | Content |
| --- | --- | --- |
| Executive Report | Decision makers | Scope, revision, whether source-derived or environment-corroborated, domain coverage, top risks, health and confidence summary, escalations |
| Domain Reports | Domain specialists | One per audited domain, rendering that domain's artifacts |
| Health Scorecard | Engineering leadership | Per-domain scores with confidence, the composition calculation, and unaudited domains named |
| Risk Register | Owners and reviewers | Risks with cause, impact, affected components, evidence, likelihood rationale, confidence, reversibility, owner candidate |
| Remediation Recommendations | Delivery teams | Prioritized actions, each naming its evidence-driven problem, accountable owner, verification that would confirm the fix, and risk of deferral |
| Unknowns and Verification Plan | Requester | What could not be determined and what evidence would resolve it |

**Every view states, in its opening, whether the audit was source-derived or environment-corroborated.** That single fact bounds every conclusion beneath it, and burying it in an appendix would misrepresent the whole.

## 11. Confidence Model

### 11.1 Conclusion level

Every conclusion carries exactly one evidence state — Verified, Observed, Inferred, or Unknown — and one confidence level — High, Medium, or Low. Confidence measures evidence quality, not risk severity. A high-severity, low-confidence finding is escalated for verification, never dismissed for weak evidence.

### 11.2 Run level

The capability declares a run-level confidence derived from three factors, each stated separately rather than blended into an opaque figure:

**Domain coverage.** How many of the eleven domains produced artifacts, and which did not.

**Evidence corroboration.** Whether conclusions rest on a single source or on corroborating sources.

**Runtime confirmation.** Whether any conclusion was promoted to Verified by runtime evidence. **A source-only audit is capped at Medium run-level confidence regardless of how complete or internally consistent it is.** Declared structure is not deployed structure, and no amount of thorough reading changes that.

### 11.3 Composition of health

Domain scores compose into repository health under three rules inherited from the constituent methodologies and one added by this capability.

1. The composed score is an arithmetic mean **only** when every contributing domain has confidence of Medium or High. Otherwise a range is reported with low-confidence domains named prominently.
2. Any domain scored 0 or 1 forces an escalation regardless of the composed result. A critical weakness is never averaged away.
3. Scores show their calculation. A number without its derivation is not a result.
4. **Added by this capability:** when fewer than eleven domains are audited, the composed result is a bounded range with unaudited domains named, never a mean over the audited subset. A three-domain audit reporting "4.2 out of 5" would be a false claim about a repository, and this rule exists specifically to prevent partial runs from producing confident-looking totals.

## 12. Failure Modes

Each failure mode states the capability's committed response. This table is part of the contract: a consumer is entitled to rely on these behaviors.

| Failure | Committed response |
| --- | --- |
| No stable revision identifiable | **Refuse to start.** Reproducibility is not recoverable later. |
| Repository root unreadable | Refuse to start; report the access failure. |
| Authorization boundary ambiguous | Refuse to start; request clarification. Guessing an authorization boundary is not permitted. |
| Requested scope exceeds authorization | Proceed within authorization; declare the boundary and record the excluded material as out of scope. |
| A required methodology is unavailable | Declare the domain unaudited, continue with remaining domains, and cap the composed result per rule 11.3(4). |
| Executor lacks a methodology's declared requirements | Refuse that domain and declare it unaudited. **Never degrade silently into a weaker examination presented as the same thing.** |
| Domain not applicable to the subject | Record as not applicable with a reason. Not applicable is not a failure and does not lower a score. |
| Evidence conflicts between sources | Retain both, describe the conflict, mark the conclusion Unknown, and record separate reliability assessments. Never select by preference. |
| Secret, credential, or key found in source | **Escalate immediately** with location, type, and rotation advice. Never reproduce the value. Continue the run. |
| Personal or regulated data found in an unexpected location | Escalate immediately; continue. |
| Evidence of active compromise | Escalate immediately; pause the run pending instruction from the named recipient. |
| Production access offered or available | **Refuse.** Request the evidence from its owner instead. |
| A methodology would require a write or destructive action | Refuse the action; record the resulting conclusion as Unknown. |
| Optional evidence absent | Lower confidence, name the unknown, state the verification that would resolve it. Do not lower the score. |
| Executor context exhausted mid-run | Artifacts completed to that point remain independently valid. The run resumes per domain; partial domains are declared incomplete rather than reported as complete. |
| Output location unavailable or inside the subject | Refuse to start. The audit never writes into the subject. |

## 13. Success Criteria

A Repository Audit run has succeeded when all of the following hold. These are the terms against which the promise in section 1 is judged.

1. Every conclusion in every artifact cites at least one evidence item, and every evidence item carries provenance including its environment.
2. Every conclusion carries exactly one valid evidence state, and no declared structure is presented as deployed structure.
3. Every audited domain produced its declared artifacts, or recorded an explicit not-applicable with a reason.
4. Every unaudited domain is named, with the reason it was not audited.
5. All material unknowns are named, each with the verification that would resolve it.
6. The composed health result shows its calculation and complies with the four composition rules.
7. Every escalation reached its named recipient, with time and trigger recorded.
8. No output contains a secret value, credential, connection string, endpoint, or record value.
9. The subject is byte-identical to its state before the run.
10. An independent reviewer can navigate from any conclusion to its evidence and reproduce the material claims against the same revision.

**Success does not require certainty, completeness, or a good score.** An audit that finds severe problems, or that can determine little because evidence was unavailable, succeeds if it is honest, traceable, and bounded. The failure condition is a confident conclusion that evidence does not support.

## 14. Extension Points

Each extension point requires no change to this capability's contract, which is what makes it a contract rather than a description.

### 14.1 Methodology substitution

Any constituent methodology may be replaced by a conforming substitute that produces the same artifact types. Downstream methodologies depend on artifact types, never on producers. An organization with its own architecture-review method may substitute it and retain the rest of the capability unchanged.

### 14.2 Domain addition

An additional domain contributes a methodology and artifact types under its own namespace, declares where it sits in the ordering, and joins the composition. Machine learning systems, mobile surfaces, and infrastructure repositories are anticipated candidates.

### 14.3 Standards overlay

An organization may add standards and requirements that constrain the audit further — stricter classification rules, additional required artifact fields, additional escalation triggers. It may not weaken framework requirements or remove required artifact fields. The framework baseline stays separately checkable, so "conformant to the framework" and "conformant to our overlay" remain distinct questions.

### 14.4 Composition rule override

An organization may declare its own weighting across domains, provided the four composition rules in 11.3 are preserved. Weighting is a judgment about what matters locally; the guards against false confidence are not negotiable.

### 14.5 Evidence source extension

Additional evidence sources — an internal telemetry platform, a service catalogue, a compliance register — may be declared as optional inputs with a trust level. They raise achievable confidence without changing any methodology.

### 14.6 Executor and provider extension

New executor types and AI providers are supported through generated adapters. Where a methodology requires an executor capability a provider lacks, the executor refuses that domain and declares it unaudited rather than attempting a degraded run.

## 15. Agent Entry Contract

This section serves the traversal model of the framework core architecture. It is descriptive of this capability's shape, not prescriptive of agent behavior.

**Trigger phrasings.** "Audit this repository", "assess repository health", "review this codebase", "what is the state of this repo", "technical due diligence on this repository", "find the risks in this repository".

**Declared closure.** Eleven methodologies, eight standards, the artifact types in section 10.1, and the composition rules in section 11.3.

**Context cost.** The full closure substantially exceeds a single context window at any plausible size. Traversal is therefore **one methodology at a time**: an executing agent loads this capability, then one methodology, then the standards that methodology cites, produces that domain's artifacts, and releases the methodology before proceeding. Artifacts are the hand-off between domains precisely because they are far smaller than the methodologies that produced them.

This is a property of the design rather than a limitation of it. A capability whose closure fits in one context would be a capability too small to be worth composing.

**Preconditions to declare before starting.** Revision, authorization boundary, output location, escalation recipient, executor type, and the domains the executor can and cannot perform.

## 16. Contract Status and Known Gaps

This capability is Draft. Its gaps are disclosed rather than deferred, because a public contract that conceals its own preconditions is not a contract.

**The artifact instance identity decision is carried into the standards.** The ordering in section 9.1 requires that one methodology's artifacts be readable by another, which requires that an artifact instance have a name. [ADR-0006](../ADR/ADR-0006-artifact-instance-identity.md) decides that name — a logical identity composed of subject authority, subject name, subject revision, run discriminator, and type at version, with location resolved separately and a content digest supplying immutability — and STD-0008, STD-0010, STD-0011, and STD-0012 now state it. One question is deferred inside that decision rather than left open: how a run discriminator is derived. A producer invoked with a discriminator supplied by its orchestrator does not need the rule, and [STD-0011](../02-methodology/contract-specification.md) R-51 states the duty that stands in for it.

**No architectural question remains outstanding for this capability.** Every artifact type it composes is declared: ninety-three declarations under [STD-0013](../02-methodology/artifact-type-declaration-standard.md), one per type registered in the [Artifact Type Inventory](../07-roadmap/artifact-type-inventory.md). The specification of what this capability produces, and of how its outputs are named, resolved, and verified, is complete. What is outstanding is implementation.

**One of eleven methodologies does not exist.** [AUD-0001](../03-audit-engine/00-bootstrap.md) Bootstrap remains a structural placeholder, and the ordering in section 9.1 begins with it.

**Identifier note.** This document is registered, and the `Capability` category is admitted by [STD-0010](../02-methodology/metadata-specification.md) R-11. The `CAP` prefix remains absent from the prefix table of the [Framework Document ID Standard](../02-methodology/document-id-standard.md), which is recorded as an open exception in the [validation report](../validation-report.md) rather than left implicit. It is not a validation failure, because that standard's R-01 constrains identifier form rather than prefix membership.

## 17. Related Documents

- [Framework Core Architecture](../01-foundation/framework-core-architecture.md)
- [Audit Engine Documentation](../03-audit-engine/README.md)
- [Architecture Discovery](../03-audit-engine/01-architecture-discovery.md)
- [Database Discovery](../03-audit-engine/02-database-discovery.md)
- [Audit Engine Product Specification](../07-roadmap/audit-engine-roadmap.md)
- [Framework Architecture Review](../07-roadmap/framework-architecture-review.md)
- [Framework Glossary](../02-methodology/glossary.md)
