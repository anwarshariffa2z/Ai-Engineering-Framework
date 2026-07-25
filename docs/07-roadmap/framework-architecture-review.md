---
id: REF-0011
title: Framework Architecture Review
version: 1.0.0
status: Draft
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Event-driven
category: Roadmap
tags: [architecture, review, standards, maintainability, automation]
related: [audit-engine-roadmap.md, ../DOCUMENT_INDEX.md, ../validation-report.md, ../02-methodology/document-id-standard.md, ../02-methodology/document-metadata-standard.md, ../03-audit-engine/01-architecture-discovery.md, ../03-audit-engine/02-database-discovery.md]
---

# Framework Architecture Review

## 1. Executive Summary

This review examines the AI Engineering Framework repository as an engineering product rather than as a body of documentation. It applies the evidence discipline the repository itself defines in [Architecture Discovery](../03-audit-engine/01-architecture-discovery.md): every finding cites an observation, states an evidence state, and separates fact from judgment.

**Scope.** Repository revision at the tip of `feature/framework-aud-003-database-discovery` work, comprising 43 Markdown documents, 43 registry rows, 204 internal links, and six commits. All sixteen evaluation areas requested were assessed. No existing document was modified during this review.

**Overall architecture score: 56 / 100.** The score is the unweighted mean of sixteen dimension scores on the framework's own 0-to-5 scale, published with its calculation in section 12.

That number requires interpretation, because it measures something narrower than quality. The written content of this repository is strong: the standards are specific, the normative language is disciplined, the audit playbooks are genuinely executable, and the evidence model is better than most production audit tooling. If this review scored prose quality, the result would be high.

It scores the framework as an engineering product, and by that measure the repository has a single structural problem from which most findings descend: **the framework governs AI systems rigorously and governs itself informally.** It requires named individual owners; its own documents are owned by an unnamed collective. It requires evidence with provenance; its own validation report asserts eight passing checks with no recorded method, tool, or timestamp. It requires versioned, reproducible release evidence; it has no tags, a stale changelog, and no defined release process. It warns that manual controls drift; every invariant it depends on is manually enforced.

The second structural problem is **three overlapping taxonomies** — identifier prefix, front-matter category, and numbered folder — that classify the same 43 documents along three axes which already disagree. `REF` documents appear in four different folders. `docs/02-methodology/` holds both Methodology and Reference categories. `docs/05-reference/` contains one README while the reference material it names lives elsewhere.

The third is **duplication of the shared audit models**. Evidence states, confidence levels, and the 0-to-5 health scale are now restated verbatim in two playbooks. Nine playbooks remain. Left alone, this becomes eleven copies requiring synchronized edits, and the framework's most valuable abstraction will be its least maintainable asset.

None of these is a crisis, and none requires rewriting existing content. All three are cheap to fix now and expensive to fix after nine more playbooks exist. The recommendation of this review is that six specific items, totalling an estimated four to six maintainer-days, are completed before the next playbook is written.

## 2. Method

Findings were produced by direct inspection of every tracked file at the audited revision, supported by measurement over the repository tree. Each finding records an evidence state using the framework's own vocabulary:

| State | Meaning in this review |
| --- | --- |
| Verified | Confirmed by direct measurement over the repository tree, reproducible by re-running the stated method. |
| Observed | Present in an inspected document, but its downstream effect is not independently confirmed. |
| Inferred | Reasoned from observations; assumptions stated. |
| Unknown | Evidence absent or out of scope. |

Judgments about maintenance cost at future scale are Inferred by construction; they extrapolate from the observed rate of change across six commits and are labelled accordingly. No finding claims a defect that measurement did not demonstrate.

## 3. Findings

### 3.1 Repository structure

**F-01 — The numbered domain hierarchy is sound and consistently applied.** *Verified.* Eight numbered domains plus a dedicated ADR location. Every document resides in a domain; no orphan directories exist. The separation of foundation, methodology, standards, and governance is coherent and matches how the material is actually referenced.

**F-02 — `docs/05-reference/` is structurally empty while reference material lives elsewhere.** *Verified.* The folder contains one README (REF-0008) whose body directs readers to the glossary in `docs/02-methodology/` and the registry in `docs/`. Meanwhile `REF`-prefixed documents appear in `docs/02-methodology/`, `docs/05-reference/`, `docs/ADR/`, and `docs/`. The domain exists as a promise rather than a location.

**F-03 — Six of nine documentation folders have no README.** *Verified.* `docs/01-foundation`, `docs/02-methodology`, `docs/04-development`, `docs/06-governance`, `docs/07-roadmap`, and `docs/08-examples` contain no index document. `docs/03-audit-engine`, `docs/05-reference`, and `docs/ADR` do. Navigation is therefore inconsistent: a reader entering one folder finds orientation, and entering another finds an undifferentiated file list.

### 3.2 Documentation hierarchy

**F-04 — Three taxonomies classify the same documents along disagreeing axes.** *Verified.* Identifier prefix, front-matter `category`, and folder location are independent classifications. Measured overlap:

| Prefix | Folders in which it appears |
| --- | --- |
| REF | `02-methodology`, `05-reference`, `ADR`, `docs` |
| DOC | `01-foundation`, `02-methodology`, `06-governance` |
| STD | `02-methodology`, `04-development` |
| AUD | `03-audit-engine`, `07-roadmap` |
| TMP | `ADR` (and, unlisted by folder scan, `.github`) |

`docs/02-methodology/` holds documents categorized both Methodology and Reference. `docs/ADR/` holds three categories: Architecture Decision Record, Reference, and Template. A reader cannot predict a document's location from its ID, nor its category from its location.

**F-05 — Governance documents carry three different prefixes.** *Verified.* `docs/06-governance/` contains DOC-0005 (Risk Management), CMD-0001 (Change Management), and PLB-0001 (Incident Management). The ID standard defines CMD as "Command or operational procedure" and PLB as "Playbook"; change management is neither a command nor an operational procedure in the sense the standard describes. The prefix was selected by document title rather than by document type.

### 3.3 Metadata standards

**F-06 — The eleven-key schema is complete, well-specified, and universally applied.** *Verified.* All 43 documents carry all eleven keys in the specified order. This is the framework's strongest engineering asset and the reason machine validation is possible at all.

**F-07 — `related` permits two path resolution bases, making it unreliable to parse.** *Verified.* STD-0001 permits "repository-relative or document-relative references". Measured: 86 document-relative entries and 4 repository-relative entries. The repository-relative entries appear in root-level documents where the two bases coincide, so no link is currently broken — but a machine consumer cannot resolve `related` without knowing which convention a given document used, and the coincidence that makes it work today does not hold for a repository-relative reference written inside `docs/`.

**F-08 — Front-matter `title` collides with GitHub's reserved issue-template key.** *Observed.* `.github/ISSUE_TEMPLATE/bug_report.md` and `practice_proposal.md` merge framework front matter with GitHub's issue-template front matter in a single YAML block containing `id`, `title`, `version`, `name`, `about`, and `labels`. In GitHub's issue-template schema, `title` sets the pre-filled issue title. A contributor opening a defect report will find the issue title pre-filled with "Framework Defect Report Template".

**F-09 — The pull request template will render its front matter into every PR body.** *Observed.* GitHub does not strip YAML front matter from `pull_request_template.md`; it inserts the file verbatim. Any PR opened through the GitHub UI will therefore contain eleven lines of raw YAML above the intended template. Pull requests opened by tooling that supplies its own body are unaffected, which is why this has not yet surfaced.

**F-10 — The repository violates its own `.editorconfig`.** *Verified.* `.editorconfig` sets `max_line_length = 100` for Markdown. Measured: 33 of 43 documents contain lines exceeding 100 characters, totalling 602 such lines. The prose style is one-paragraph-per-line, which is a deliberate and defensible choice for prose diffs; the setting contradicting it is the error, not the prose.

**F-11 — No `.gitattributes` exists.** *Verified.* `.editorconfig` declares `end_of_line = lf`; the repository has no line-ending normalization, and every commit on a Windows checkout emits LF-to-CRLF warnings for every file touched.

### 3.4 Identifier system

**F-12 — IDs are unique, stable, and correctly allocated.** *Verified.* 43 IDs, no duplicates, no recycling, sequential within prefix. The standard's core promise holds.

**F-13 — The prefix taxonomy has no allocation rule and no arbiter for ambiguous cases.** *Inferred from F-05.* Ten prefixes are defined by short glosses. Nothing specifies what to do when a document is plausibly two types — a checklist that is also a methodology, a roadmap item that is also an Audit Engine document. AUD-0012 resolves this by taking an AUD prefix with a Roadmap category; CHK-0001 resolves it by taking a CHK prefix with a Methodology category. Both are reasonable; they are not the same rule.

**F-14 — The audit-artifact namespace is defined inside a playbook rather than in the ID standard.** *Observed.* AUD-0003 defines fourteen `DB-NNN` audit output artifacts and states that they are outside STD-0002's scope and must not be registered. That rule is correct, but it lives in the document that needed it. Frontend Discovery will require `FE-NNN`, backend `BE-NNN`, and each playbook will restate — or quietly vary — the same rule.

### 3.5 Document registry

**F-15 — The registry is the framework's central invariant and its principal scaling bottleneck.** *Verified.* Every content commit in repository history has modified `DOCUMENT_INDEX.md`: 4 of 6 commits, the other two being the initial commit and a merge. As a single-file, 43-row table with an eight-column layout, it is edited by every document addition, every status change, and every version bump.

**F-16 — Registry version churn is structural, not incidental.** *Verified.* REF-0009 has advanced 1.0.0 to 1.0.3 across three content changes, and REF-0010 has tracked it identically. Because a document's version appears in both its front matter and the registry, and the registry is itself a versioned document, every substantive edit to any document produces a minimum of three version changes across three files. At 43 documents this is tolerable. At the eleven-playbook target it guarantees merge conflicts on any parallel contribution.

**F-17 — Adding a document is not an atomic operation.** *Verified by construction.* Creating a conformant document requires editing the new file, `DOCUMENT_INDEX.md`, `validation-report.md`, and — where a parent index exists — the domain README. This review is itself the demonstration: it was created under an instruction not to modify existing documents, and is therefore, at the moment of writing, an unregistered document that the framework's own rules classify as incomplete. Section 9 records the required registry entry so the gap is disclosed rather than hidden.

### 3.6 Cross-reference model

**F-18 — Link integrity is currently perfect.** *Verified.* 204 internal links and `related` entries, all resolving. No orphan registry rows, no unregistered documents.

**F-19 — Reciprocity is recommended but unenforced.** *Observed.* STD-0002 states that a target's `related` list SHOULD include materially coupled documents. Nothing checks it. Reciprocal references currently exist because they were added deliberately, not because anything requires them.

**F-20 — There is no supersession mechanism for documents.** *Observed.* STD-0001 permits `status: Superseded`, and the ADR process defines supersession for decisions. No document defines how a superseded document declares its successor, whether a superseded document retains its ID, or how a reader is routed forward. The status value exists with no process behind it.

### 3.7 Versioning strategy

**F-21 — Semantic versioning is mandated without semantics.** *Observed.* STD-0001 requires semantic versioning and requires a version increment on substantive change. It does not define what constitutes major, minor, or patch for a document. In practice, AUD-0003 was raised to 2.0.0 on the judgment that its output contract changed, and REF-0009 has taken patch increments for row edits. Both are defensible; neither is derived from a stated rule.

**F-22 — Document versions and repository releases are unconnected.** *Verified.* `CHANGELOG.md` contains only an `## Unreleased` section listing the foundation, and mentions neither approved audit playbook. No tags exist. A consumer cannot determine which document versions constitute a coherent framework release.

### 3.8 Validation process

**F-23 — Validation is asserted, not evidenced.** *Verified.* `validation-report.md` presents a table of checks with Pass results. It records no method, no tool, no command, no timestamp beyond the document's `last_updated`, and no scope statement beyond a sentence. The framework's own [Architecture Discovery](../03-audit-engine/01-architecture-discovery.md) methodology requires that every conclusion cite evidence with provenance, and explicitly names "treating a successful build file parse as a successful build" as a common mistake. The validation report is the framework applying to itself precisely the standard it warns against.

**F-24 — There is no automation of any kind.** *Verified.* No CI workflow, no validation script, no pre-commit configuration, no linting. `.github/` contains only issue and PR templates. Every invariant — front-matter completeness, ID uniqueness, registry agreement, link resolution — is enforced by human attention.

**F-25 — A registry drift defect reached the repository and survived two commits.** *Verified.* REF-0010's front-matter title read "Documentation Validation Report" while its registry row read "Validation Report", violating STD-0001's requirement that the two agree. It was introduced in the foundation commit, survived the AUD-0002 commit, and was corrected only when an ad-hoc script was written. During that period the validation report asserted that "Document IDs are unique and match the registry" passed. This is the failure mode F-23 and F-24 predict, already realized once, at 43 documents and two contributors.

### 3.9 Artifact generation model

**F-26 — The `DB-NNN` artifact set is a genuine architectural advance.** *Observed.* Fourteen identified artifacts give downstream playbooks and any future Audit Engine rule set a stable output contract rather than free-form prose. It is the first structure in the repository designed to be consumed by a machine.

**F-27 — The artifact model exists in one playbook and is specified nowhere reusable.** *Observed.* AUD-0002 produces eight numbered outputs with no identifiers; AUD-0003 produces fourteen identified artifacts with a required content column, an evidence-state requirement, and a not-applicable rule. Two playbooks, two output models. Nothing specifies which is correct for the third.

**F-28 — No artifact schema exists.** *Observed.* Artifacts are described in prose tables. A future Audit Engine that consumes them deterministically — the stated purpose in AUD-0012 — will require a machine-readable schema that does not yet exist, and retrofitting one across eleven playbooks is materially harder than defining it now.

### 3.10 Naming conventions

**F-29 — File and heading conventions are consistent.** *Verified.* Kebab-case filenames, numeric prefixes ordering audit phases, sentence-case titles. No collisions within directories.

**F-30 — Typographic conventions diverge between the two playbooks.** *Verified.* AUD-0002 uses typographic quotation marks in its evidence-state table; AUD-0003 uses straight quotes. Both are internally consistent; the repository has no stated convention. This is cosmetic in isolation and matters only because it demonstrates that a third playbook has no source of truth to copy.

**F-31 — The term "playbook" carries two incompatible meanings.** *Verified.* The glossary defines Playbook as "a repeatable, role-oriented procedure for responding to a known operational or governance situation" — the sense in which PLB-0001 Incident Management uses it. The audit documents use "playbook" 36 times to mean a discovery methodology, which the glossary separately names "Audit Phase" (used once). The framework's own vocabulary document is contradicted by its most substantial content.

**F-32 — The term "artifact" is overloaded.** *Verified.* The glossary defines Framework Artifact as "a maintained document, record, rule, template, checklist, or evidence item governed by this framework". AUD-0003 uses "artifact" for audit outputs. "Artifact" appears 63 times across the documentation carrying at least three senses: framework document, audit output, and build output. No disambiguation exists.

### 3.11 Evidence model

**F-33 — The four-state evidence model is the framework's best abstraction.** *Observed.* Verified, Observed, Inferred, and Unknown, with permitted language per state and an explicit prohibition on promoting inferred conclusions, is precise, teachable, and directly executable by an agent. It is the component most worth protecting from drift.

**F-34 — It is defined inside a playbook and copied into the next one.** *Verified.* The state table, the confidence definitions, and the 0-to-5 health scale appear in full in both AUD-0002 and AUD-0003. The two documents share 19 identical section headings. AUD-0003 forbids future playbooks from redefining these models locally — a rule that holds the line but does not remove the existing duplication, and which is itself stated in a playbook rather than a standard.

### 3.12 Scoring model

**F-35 — The health scale is well-designed and correctly guarded.** *Observed.* A 0-to-5 scale with explicit meanings, a prohibition on averaging when confidence is low, and a rule that any dimension scored 0 or 1 forces escalation regardless of the mean. The guard against averaging away a critical risk is a genuinely sophisticated control.

**F-36 — Scoring dimensions vary between playbooks with no governing rule.** *Observed.* AUD-0002 defines ten dimensions; AUD-0003 defines twelve, and adds a rule that three of them are scored independently of structural quality. The additions are justified in context. Nothing states whether dimension sets are per-playbook by design, nor how a whole-repository health score composes from playbooks with differing dimension counts — which AUD-0002 and AUD-0003 both assert will happen.

### 3.13 Navigation

**F-37 — The registry does not scale as a navigation surface.** *Inferred.* A flat 43-row table sorted by ID prefix is serviceable now. It is the only complete index, `docs/README.md` is fifteen lines, and six domains have no local index (F-03). At the projected size — eleven playbooks plus supporting standards — a single flat table becomes a poor entry point for every reader who does not already know the ID they want.

**F-38 — There is no role-based or task-based entry path.** *Observed.* The README offers a four-step "start here" sequence; beyond it, a reader arriving with a task ("I need to release a model change", "I need to classify data") has no index organized by that question. All navigation is by document identity.

### 3.14 Git workflow

**F-39 — Commit and branch hygiene is good.** *Verified.* Conventional-commit subjects with scopes, focused commits, feature branches, pull requests with completed template sections. Six commits, no noise.

**F-40 — No branching, review, or merge policy is documented.** *Observed.* CONTRIBUTING.md specifies commit message style and PR content, but not branch naming, base branch, merge strategy, review requirements, or who may approve. Current practice is consistent because one person has produced all commits.

**F-41 — No branch protection or required checks.** *Observed.* PR #1 was merged without review or status checks, which is unavoidable in a single-maintainer repository but means the PR gate provides documentation rather than enforcement.

### 3.15 Release workflow

**F-42 — There is no release process.** *Verified.* No tags, no release documentation, no definition of what a framework release contains, and a changelog with a single `## Unreleased` section that omits both approved playbooks. The repository has produced two substantial approved standards and has no way to reference the state of the framework at the moment either was approved.

**F-43 — Change Management governs AI systems but not the framework.** *Observed.* CMD-0001 defines material change, impact assessment, and approval for the AI systems the framework governs. Nothing defines the equivalent for the framework's own documents: what makes a framework change material, who approves a standard revision, or how adopters are notified that a standard they depend on has changed.

### 3.16 Future extensibility

**F-44 — The metadata and ID foundations extend cleanly.** *Observed.* Adding a domain, a prefix, or a document requires no redesign. The conventions were chosen with growth in mind and they hold.

**F-45 — The playbook layer does not yet extend cleanly.** *Inferred from F-27, F-34, F-36.* The next playbook author has two divergent precedents, no template, no shared standard to reference for evidence and scoring, and no rule for output artifacts. The most likely outcome is a third variant, after which reconciliation cost rises with each addition.

**F-46 — The Audit Engine's acceptance criteria are unmet and unscheduled.** *Observed.* AUD-0012 requires maintainer approval of a manifest contract, rule authoring model, findings taxonomy, evidence-access design, threat model, test fixtures, and adoption plan before implementation may begin. None exists. This is correct per ADR-0001 and is recorded here only so that the gap between "two playbooks written" and "Audit Engine implementable" is not mistaken for a small one.

## 4. Strengths

1. **The metadata schema.** Eleven keys, universally applied, machine-readable, and the precondition for every automation opportunity in this review. Most documentation repositories never achieve this.
2. **The evidence model.** Four states with permitted language and an explicit anti-promotion rule. Precise enough for an agent to execute and for a reviewer to challenge.
3. **Normative discipline.** MUST, SHOULD, and MAY are used in their conventional senses and are not diluted. Requirements are testable.
4. **Honest scope boundaries.** ADR-0001 defers implementation deliberately and says so; AUD-0012 states non-goals plainly; the Audit Engine stubs are disclosed rather than disguised. The framework does not overstate its completeness.
5. **The health-scoring guards.** Refusing to average across low-confidence dimensions, and forcing escalation on any 0 or 1, prevents the single most common failure of scoring systems.
6. **Risk proportionality.** The three-tier model with minimum controls per tier is practical and avoids the ceremony that makes governance frameworks unusable.
7. **Playbook executability.** AUD-0002 and AUD-0003 specify failure conditions and acceptance criteria per stage. They can be handed to an agent and run, which is rare for methodology documents.
8. **Link and registry integrity.** 204 links, 43 registry rows, zero defects at the audited revision.

## 5. Weaknesses

1. **The framework does not apply its own standards to itself.** Unnamed owners (against DOC-0003), evidence-free validation (against AUD-0002), no change control for its own standards (against CMD-0001), no release evidence (against CHK-0001). This is the root of which most other weaknesses are branches.
2. **Zero automation.** Every invariant is manually enforced, and one has already drifted undetected (F-25).
3. **Three overlapping taxonomies** with no rule for resolving disagreement (F-04, F-05, F-13).
4. **Verbatim duplication of the shared audit models** across playbooks, growing linearly with playbook count (F-34).
5. **Registry as single-file bottleneck**, touched by every content change (F-15, F-16).
6. **Terminology contradicts the glossary** on two central terms, "playbook" and "artifact" (F-31, F-32).
7. **No release or supersession process** (F-20, F-42).
8. **Navigation does not scale** and is inconsistent across domains (F-03, F-37).
9. **Version semantics undefined**, leaving increments to per-author judgment (F-21).
10. **GitHub template defects** that will surface for the first external contributor (F-08, F-09).

## 6. Risks

| ID | Risk | Cause | Impact | Likelihood | Confidence |
| --- | --- | --- | --- | --- | --- |
| R-01 | Silent standards drift | No automated validation; manual enforcement only (F-23, F-24) | Registry, front matter, and links diverge without detection; the validation report continues asserting Pass | High — already realized once (F-25) | High |
| R-02 | Shared-model divergence | Evidence and scoring duplicated per playbook (F-34) | Eleven copies drift; cross-playbook health composition becomes impossible; the framework's best abstraction degrades | High if unaddressed before the third playbook | High |
| R-03 | Registry merge conflicts | Single file edited by every change (F-15, F-16) | Parallel contribution becomes painful; contributors batch changes or skip registry updates | Medium now, High with more than one active contributor | Medium |
| R-04 | Playbook divergence | No template, two divergent precedents (F-27, F-45) | Each new playbook re-invents structure; reconciliation cost grows with each addition | High | High |
| R-05 | Taxonomy incoherence | Prefix, category, and folder disagree (F-04) | Contributors cannot place new documents predictably; ID allocation becomes arbitrary | Medium | High |
| R-06 | External contributor friction | Broken issue and PR templates (F-08, F-09) | First outside contribution meets a malformed template; the repository looks unmaintained | Medium | Medium |
| R-07 | Release ambiguity | No tags, stale changelog, no release definition (F-42) | Adopters cannot pin to a framework version; "we follow the framework" becomes unverifiable | Medium | High |
| R-08 | Bus factor | Single author, unnamed collective ownership (F-40, and DOC-0003 non-application) | Loss of the sole contributor leaves undocumented conventions and no named successor | High | High |
| R-09 | Audit Engine expectation gap | Two playbooks exist; seven acceptance criteria do not (F-46) | Implementation is assumed closer than it is; scope pressure to build before contracts are agreed | Medium | Medium |
| R-10 | Scale-driven navigation failure | Flat registry, six domains without indexes (F-03, F-37) | Readers cannot find governing guidance; standards are re-invented rather than reused | Medium at current size, High at target size | Medium |

## 7. Recommended Improvements

Recommendations are grouped by the problem they solve. Effort estimates are maintainer-days for one experienced contributor and assume no review latency.

### 7.1 Extract reusable standards

**I-01 — Create an Audit Evidence and Scoring Standard.** Extract the four evidence states, the three confidence levels, the 0-to-5 health scale, and the averaging and escalation guards from AUD-0002 and AUD-0003 into a single normative standard. Playbooks reference it and define only their domain-specific dimensions. *Effort: 1.0 day.* *Resolves R-02, F-34, F-36.*

**I-02 — Create a Discovery Playbook Template.** Codify the structure both playbooks share — 19 identical section headings, the seven per-stage subsections, the artifact table, the two checklists — as a template with normative guidance on what varies by domain. *Effort: 0.5 day.* *Resolves R-04, F-27, F-45.*

**I-03 — Define the audit artifact namespace in the ID standard.** Add a clause to STD-0002 delegating `DOMAIN-NNN` output identifiers to the owning playbook, stating that they are not framework document IDs and must not be registered. Remove the equivalent rule from AUD-0003 by reference. *Effort: 0.25 day.* *Resolves F-14.*

**I-04 — Define an artifact schema convention.** Specify the required fields every audit artifact carries — revision, scope, environments, evidence IDs, evidence state, confidence — so that a future Audit Engine consumes a stable shape. *Effort: 1.0 day.* *Resolves F-28.*

### 7.2 Automate the invariants

**I-05 — Commit the validation script.** The ad-hoc script written during this work already checks front-matter completeness, ID uniqueness, registry agreement on title, version, and status, link resolution, and registry orphans. Commit it under `tools/`, with its method documented. *Effort: 0.5 day.* *Resolves R-01, F-24.*

**I-06 — Add a CI workflow running validation on every pull request.** *Effort: 0.5 day.* *Resolves R-01, F-41.*

**I-07 — Regenerate `validation-report.md` from the validator.** Convert it from an assertion into an artifact carrying method, tool version, revision, timestamp, and results. This is the framework meeting its own evidence standard. *Effort: 0.5 day.* *Resolves F-23.*

**I-08 — Generate the registry from front matter.** Once front matter is authoritative — which STD-0001 already declares it to be — the registry becomes a derived artifact rather than a hand-maintained one, eliminating both the drift class of F-25 and the conflict surface of F-15. *Effort: 1.0 day.* *Resolves R-03, F-15, F-16, F-25.*

### 7.3 Resolve taxonomy and terminology

**I-09 — Publish a taxonomy rule.** State the relationship between prefix, category, and folder: which is authoritative, which is derived, and how to classify a document that plausibly fits two. Correct or explicitly grandfather the existing exceptions (F-05). *Effort: 0.5 day.* *Resolves R-05, F-04, F-13.*

**I-10 — Reconcile the glossary with usage.** Either adopt "playbook" for discovery methodologies and redefine the glossary entry, or rename the audit documents to "audit phases" per the existing entry. Disambiguate "artifact" into framework artifact and audit artifact. *Effort: 0.5 day.* *Resolves F-31, F-32.*

**I-11 — Resolve `docs/05-reference/`.** Either move `REF`-categorized reference material into it or retire the domain and fold its README into `docs/README.md`. *Effort: 0.5 day.* *Resolves F-02.*

### 7.4 Define lifecycle processes

**I-12 — Define document version semantics.** State what constitutes major, minor, and patch for a framework document, with the output-contract test AUD-0003 applied implicitly. *Effort: 0.25 day.* *Resolves F-21.*

**I-13 — Define the framework release process.** What a release contains, how it is tagged, how the changelog is maintained, and how adopters are notified of a material standard change. Include framework self-governance under CMD-0001 or an equivalent. *Effort: 1.0 day.* *Resolves R-07, F-42, F-43.*

**I-14 — Define document supersession.** How a superseded document declares its successor, retains its ID, and routes readers forward. *Effort: 0.25 day.* *Resolves F-20.*

**I-15 — Name accountable individuals.** Apply DOC-0003 to the framework itself: name a maintainer per domain, even where one person holds several roles. *Effort: 0.25 day.* *Resolves R-08.*

### 7.5 Repair and polish

**I-16 — Fix the GitHub templates.** Separate framework front matter from GitHub's template keys, or drop framework front matter from `.github/` files and register them by path. Verify rendering by opening a draft issue and PR through the UI. *Effort: 0.5 day.* *Resolves R-06, F-08, F-09.*

**I-17 — Add `.gitattributes` and correct `.editorconfig`.** Normalize line endings; remove or raise `max_line_length` for Markdown to match the deliberate one-paragraph-per-line style. *Effort: 0.1 day.* *Resolves F-10, F-11.*

**I-18 — Add domain README files.** One short index per numbered domain, consistent with the three that already exist. *Effort: 0.5 day.* *Resolves F-03, F-37.*

**I-19 — Add a task-based navigation index.** Organize entry points by reader question rather than document identity. *Effort: 0.5 day.* *Resolves F-38.*

**I-20 — Document the git workflow.** Branch naming, base branch, merge strategy, and review expectations in CONTRIBUTING.md. *Effort: 0.25 day.* *Resolves F-40.*

## 8. Proposed New Standards

| Proposed | Content | Replaces or extracts from | Priority |
| --- | --- | --- | --- |
| STD-0007 Audit Evidence and Scoring Standard | Evidence states, confidence levels, health scale, averaging and escalation guards, cross-playbook composition rule | Duplicated sections of AUD-0002 and AUD-0003 | Before next playbook |
| TMP-0005 Discovery Playbook Template | Canonical playbook structure, per-stage subsections, artifact table shape, checklists | Shared structure of AUD-0002 and AUD-0003 | Before next playbook |
| STD-0008 Audit Artifact Standard | Required artifact fields, identifier namespace rule, not-applicable rule, machine-readable schema convention | AUD-0003 section 14, generalized | Before next playbook |
| STD-0009 Framework Taxonomy Standard | Authoritative relationship between prefix, category, and folder; allocation rule for ambiguous documents | New; resolves F-04, F-05, F-13 | Before next playbook |
| STD-0010 Document Lifecycle Standard | Version semantics, supersession, deprecation, review-cycle ownership | Extends STD-0001 | Soon |
| CMD-0002 Framework Release Management | Release definition, tagging, changelog maintenance, adopter notification, framework self-governance | New; complements CMD-0001 | Soon |

Two additions to existing standards are proposed rather than new documents: the `DOMAIN-NNN` namespace clause in STD-0002 (I-03), and the single-resolution-base rule for `related` in STD-0001 (F-07).

## 9. Registry Entry Required for This Document

This review was produced under an instruction not to modify existing framework documents. It is therefore currently non-conformant with STD-0001, which requires front matter and registry entry to agree, and with STD-0002, which makes the registry the allocation authority for the ID claimed here.

The gap is disclosed rather than concealed. The following row must be added to `docs/DOCUMENT_INDEX.md` before this document can be considered complete, and `REF-0011` must be treated as provisionally allocated until it is:

| ID | Title | Category | Status | Owner | Location | Version | Last Updated |
| --- | --- | --- | --- | --- | --- | --- | --- |
| REF-0011 | Framework Architecture Review | Roadmap | Draft | Framework Maintainers | `07-roadmap/framework-architecture-review.md` | 1.0.0 | 2026-07-25 |

`REF-0009` and `REF-0010` require version increments in the same change. That this document cannot be completed without editing three others is F-17 demonstrated rather than described.

## 10. Breaking Changes

Most recommendations are additive. Four introduce breaking changes, all of them contained.

**B-01 — Extracting evidence and scoring into STD-0007 changes AUD-0002 and AUD-0003.** Both playbooks lose their local model sections and gain a normative reference. Consumers reading those sections in place will not find them. Both playbooks take a minor version increment; no discovery activity changes. *Blast radius: two documents.*

**B-02 — Generating the registry from front matter changes its editing model.** The registry becomes derived; hand edits are overwritten. Any contributor workflow that edits the registry directly must change to editing front matter. *Blast radius: contributor process; the registry's rendered content is unchanged if generation is faithful.*

**B-03 — Renaming "playbook" or "audit phase" changes terminology across the corpus.** Whichever direction I-10 takes, one term changes in up to 36 places plus the glossary. Purely textual, but it touches both large playbooks and should precede the third rather than follow it. *Blast radius: glossary plus two playbooks.*

**B-04 — A taxonomy rule may reassign existing prefixes.** If I-09 concludes that CMD-0001 and PLB-0001 are misprefixed, correcting them would violate STD-0002's prohibition on ID reuse and renumbering. The recommended resolution is to grandfather existing allocations explicitly and apply the rule prospectively; a retroactive correction should be rejected unless maintainers accept the ID-stability cost. *Blast radius: two documents, or none if grandfathered.*

No breaking change affects an external adopter, because the framework has no released version and no downstream consumers. This is the cheapest moment in the repository's life to make all four.

## 11. Migration Plan

Four phases. Each ends in a state where the repository is internally consistent and validation passes, so the sequence can be paused at any phase boundary.

**Phase 1 — Instrument, before anything is refactored.** I-05, I-06, I-07, I-17. Commit the validator, wire CI, regenerate the validation report from it, normalize line endings. Nothing else changes. The purpose is to establish that every subsequent phase is verified by a machine rather than by attention. *Estimated 1.6 days. Exit criterion: CI runs validation on every PR and the validation report is generated output.*

**Phase 2 — Extract the reusable standards.** I-01, I-02, I-03, I-04, and the B-01 updates to both playbooks. Create STD-0007, TMP-0005, STD-0008; amend STD-0002. Both playbooks are edited once, together, so the models exist in one place before a third playbook is written. *Estimated 3.0 days. Exit criterion: no evidence-state or health-scale table appears in more than one document, and validation passes.*

**Phase 3 — Resolve taxonomy, terminology, and lifecycle.** I-09, I-10, I-11, I-12, I-14, I-15, and B-03 and B-04 decisions. Publish STD-0009 and STD-0010; reconcile the glossary; resolve `docs/05-reference/`; name owners. *Estimated 2.5 days. Exit criterion: every document's prefix, category, and folder are explicable from a published rule, and no term contradicts the glossary.*

**Phase 4 — Release, navigation, and contributor surface.** I-08, I-13, I-16, I-18, I-19, I-20. Generate the registry, define release management, fix GitHub templates, add domain indexes and task-based navigation, document the git workflow. Tag the result. *Estimated 4.0 days. Exit criterion: the framework has a tagged release whose contents are defined by a published process.*

Total estimated effort: approximately 11 maintainer-days. Phases 1 and 2, totalling 4.6 days, are the portion this review recommends completing before the next playbook.

## 12. Architecture Score

Each of the sixteen requested evaluation areas is scored on the framework's own 0-to-5 scale. Every dimension carries Medium or High confidence, so the arithmetic mean is permitted under the framework's own averaging rule.

| # | Dimension | Score | Confidence | Basis |
| --- | --- | --- | --- | --- |
| 1 | Repository structure | 4 | High | Coherent numbered domains; one empty domain, six missing indexes (F-01 to F-03) |
| 2 | Documentation hierarchy | 4 | High | Clear and applied; category and folder disagree in two places (F-04) |
| 3 | Metadata standards | 4 | High | Complete and universal; dual path bases and GitHub key collision (F-06 to F-09) |
| 4 | Identifier system | 3 | High | Unique and stable; no allocation rule, prefix leakage across folders (F-12 to F-14) |
| 5 | Document registry | 2 | High | Correct today; single-file bottleneck edited by every commit (F-15 to F-17) |
| 6 | Cross-reference model | 3 | High | Perfect integrity; reciprocity unenforced, no supersession (F-18 to F-20) |
| 7 | Versioning strategy | 2 | High | Semver mandated without semantics; unconnected to releases (F-21, F-22) |
| 8 | Validation process | 1 | High | Asserted not evidenced; zero automation; one drift defect already realized (F-23 to F-25) |
| 9 | Artifact generation model | 3 | Medium | Strong new model in one playbook; not generalized, no schema (F-26 to F-28) |
| 10 | Naming conventions | 3 | High | Consistent files and headings; glossary contradicted on two central terms (F-29 to F-32) |
| 11 | Evidence model | 4 | High | Best abstraction in the repository; duplicated across playbooks (F-33, F-34) |
| 12 | Scoring model | 3 | High | Well-guarded scale; dimension sets vary with no composition rule (F-35, F-36) |
| 13 | Navigation | 2 | Medium | One flat index, six domains without one, no task-based path (F-37, F-38) |
| 14 | Git workflow | 3 | High | Good hygiene; no documented policy, no enforcement (F-39 to F-41) |
| 15 | Release workflow | 1 | High | No tags, no process, changelog omits both playbooks (F-42, F-43) |
| 16 | Future extensibility | 3 | Medium | Foundations extend cleanly; playbook layer does not yet (F-44 to F-46) |

**Calculation.** Sum 45, of a possible 80. Mean 2.8125 of 5. **Score: 56 / 100.**

No dimension scores 0. Two dimensions score 1 — validation process and release workflow — and under the framework's own rule, any dimension scored 0 or 1 requires escalation regardless of the mean. Both are escalated in section 13 as gating items.

The score measures engineering-product maturity, not content quality. Dimensions 3, 11, and 12 — where the intellectual work lives — average 3.67. Dimensions 8 and 15 — where the operational work lives — average 1.0. That gap is the review's central finding expressed numerically.

## 13. Prioritized Action List

Priority 1 items are recommended before the next discovery playbook is written. The reasoning is uniform: each is cheap now and its cost grows with every playbook added.

| Rank | Action | Item | Effort | Rationale | Before AUD-003? |
| --- | --- | --- | --- | --- | --- |
| 1 | Extract the Audit Evidence and Scoring Standard | I-01 | 1.0 d | Prevents a third verbatim copy of the framework's best abstraction; cost grows linearly with playbook count | Yes |
| 2 | Commit the validation script | I-05 | 0.5 d | Ends manual enforcement of every invariant; one drift defect already reached the repository undetected | Yes |
| 3 | Add CI running validation on every PR | I-06 | 0.5 d | Makes the validator binding rather than advisory | Yes |
| 4 | Create the Discovery Playbook Template | I-02 | 0.5 d | The next author currently has two divergent precedents and no canonical structure | Yes |
| 5 | Define the audit artifact namespace in STD-0002 | I-03 | 0.25 d | `FE-NNN` will be needed immediately; the rule belongs in the ID standard, not in one playbook | Yes |
| 6 | Regenerate the validation report from the validator | I-07 | 0.5 d | The framework's own evidence standard applied to its own compliance claim; escalated dimension | Yes |
| 7 | Publish the taxonomy rule | I-09 | 0.5 d | Every new document currently requires a judgment call with no stated basis | Recommended |
| 8 | Reconcile glossary terminology | I-10 | 0.5 d | Cheaper across two playbooks than across three; purely textual | Recommended |
| 9 | Define the framework release process and tag | I-13 | 1.0 d | Escalated dimension; adopters cannot pin a version, changelog omits both playbooks | Recommended |
| 10 | Define the artifact schema convention | I-04 | 1.0 d | Required by AUD-0012's deterministic-consumption goal; retrofitting across eleven playbooks is far costlier | Recommended |
| 11 | Add `.gitattributes`, correct `.editorconfig` | I-17 | 0.1 d | Trivial; removes warning noise from every commit | Optional |
| 12 | Fix the GitHub issue and PR templates | I-16 | 0.5 d | Surfaces on first external contribution | Optional |
| 13 | Generate the registry from front matter | I-08 | 1.0 d | Removes the largest merge-conflict surface; sequence after CI exists | Optional |
| 14 | Define document version semantics | I-12 | 0.25 d | Removes per-author judgment from every version increment | Optional |
| 15 | Add domain README files | I-18 | 0.5 d | Navigation consistency across all nine domains | Optional |
| 16 | Name accountable individuals per domain | I-15 | 0.25 d | Applies DOC-0003 to the framework itself; addresses bus factor | Optional |
| 17 | Define document supersession | I-14 | 0.25 d | `status: Superseded` currently exists with no process | Optional |
| 18 | Add task-based navigation index | I-19 | 0.5 d | Value rises with corpus size | Optional |
| 19 | Document the git workflow | I-20 | 0.25 d | Current consistency depends on a single contributor | Optional |
| 20 | Resolve `docs/05-reference/` | I-11 | 0.5 d | Structural tidiness; low urgency | Optional |

Priority 1 total: **3.25 maintainer-days** across six items. That is the recommended gate before the next playbook.

## 14. Related Documents

- [Audit Engine Product Specification](audit-engine-roadmap.md)
- [Framework Document Registry](../DOCUMENT_INDEX.md)
- [Documentation Validation Report](../validation-report.md)
- [Document Metadata Standard](../02-methodology/document-metadata-standard.md)
- [Framework Document ID Standard](../02-methodology/document-id-standard.md)
- [Architecture Discovery](../03-audit-engine/01-architecture-discovery.md)
- [Database Discovery](../03-audit-engine/02-database-discovery.md)
- [Change Management](../06-governance/change-management.md)
- [Ownership Model](../01-foundation/ownership-model.md)
