# HANDOVER

Last updated: 2026-07-26

## Session summary

**Framework v1 was integrated, committed, and published.** The repository moved from a working tree holding two uncommitted milestones to a tagged, released architectural baseline.

**Integration.** ADR-0006 gained two architectural principles and the Artifact Identity Triad. DOC-0007's Q-01 — the framework's last recorded open question — was marked Resolved with a cross-reference rather than a restatement. ADR-0005 and ADR-0006 were promoted to Accepted. `CHANGELOG.md` gained a real release history, and REF-0023 opened the Framework Operationalization roadmap, archiving the construction backlog into it.

**Consistency repair.** A pass over every document that asserts repository state found four stale claims that no validator can catch: the root README described `03-audit-engine` as a draft structure with no methodology and omitted four folders from its map; `docs/README` listed eight of ten domains; the audit engine index named two approved methodologies where ten exist; and the registry's own front matter had sat at 1.4.1 through three milestones of row additions. CAP-0001 still read *"this **is** the framework's last **open** architectural question"*, true when written and contradictory the moment ADR-0006 was accepted.

**Release.** Four commits, each validating standalone at exit 0, then PR #6 merged into `main` with a merge commit, an annotated tag, and a GitHub Release.

- `df2609a` — artifact type declaration framework
- `21f8a36` — ADR-0006, ADR statuses, CAP-0001
- `a88bd64` — documentation integration
- `6e9c1df` — release notes and the operationalization roadmap
- `7da47ae` — merge commit on `main`
- `v0.7.0-artifact-declarations` — annotated tag, pushed
- https://github.com/anwarshariffa2z/Ai-Engineering-Framework/releases/tag/v0.7.0-artifact-declarations

Validation at `main`: 70 documents, 70 registry rows, 8 standards, 242 requirements, 68 bound checks, 4,860 results, **0 failures**, 52 governed warnings, exit 0.

## Decisions made, and why

**Commits were split four ways rather than committed as one release.** Each tree validates independently, which is the only property that makes a bisect through this history meaningful. The cost was real — the registry is touched by all four commits and the validation report by two, so each intermediate state had to be generated and validated before staging.

**`main` was reset rather than pushed directly.** Seven commits had accumulated on `main`, so the requested rename was impossible and a direct push would have skipped the PR entirely. Branching off the tip first made the reset safe: every commit was already reachable from `release/v0.7.0-artifact-declarations` before the `main` pointer moved, and all seven reached `main` through the merge commit.

**Merge commit, never squash.** A squash would have collapsed seven milestones and orphaned `3883cf7` with its `v0.5.0-core-standards` tag.

**ADR statuses were promoted before tagging.** ADR-0005 was fully implemented while still reading Draft, and a release whose two newest decisions read Draft misrepresents its own governance state. Raised as a decision for the owner rather than changed silently, then applied on instruction.

**The changelog was written per release, not per milestone.** Ten milestones compress to three tags without losing anything, because `git log` is already authoritative for detail. Reconstructing intermediate milestones would have duplicated the history into a file that then needs maintaining.

## Incomplete tasks and next steps

1. **Branch off `main` before the first commit of the next session.** See blockers.
2. **Milestone 11 — carry ADR-0006 into the standards**, in order: STD-0008 (identity grammar behind R-06, content digest as an envelope member, the definition of an upstream address in R-19), STD-0010 (admissibility under the R-07 reference grammar, canonical serialization), STD-0011 (immutable lineage references, the unresolvable-identity duty, staleness by digest change), STD-0012 (validator behaviour on both). STD-0013 needs nothing, and leaving it untouched is the check that the ADR-0005 separation holds.
3. Two sub-decisions ADR-0006 deferred: a derivation rule for the run discriminator, and whether the framework specifies a resolver contract.
4. Later operationalization workstreams, in REF-0023 section 4: reference producers, reference artifact corpus, validator expansion, CI/CD, integrations.
5. AUD-0001 Bootstrap is still the only methodology that does not exist.

## Pitfalls encountered

**The branch was wrong for two sessions and nothing detected it.** Every report named `feature/milestone-7-methodology-refactor`; the work was on `main`. That branch had been merged by PR #4 and the checkout to `main` happened afterwards. It surfaced only because a release step asked for a branch rename, which cannot succeed on `main`. **A fact that is cheap to check and expensive to assume should never be carried in memory across a compaction — run `git branch --show-current` before the first commit of a session, not after the last.**

**Splitting commits requires the working tree to equal the commit tree.** The validator reads the working tree, so a new file present but not yet registered fails a commit that does not contain it. Files belonging to later commits had to be moved out of the tree entirely, not merely left unstaged.

**`git checkout` between branches failed on an uncommitted file.** `HANDOVER.md` differed across branches and blocked the checkout to `main` mid-release. Stashed, checked out, popped — but it interrupted a publication sequence, which is the wrong moment to discover it.

**A stale sentence is invisible to every check.** CAP-0001's contradiction resolved links, agreed with metadata, and passed validation. Only re-reading the documents that describe status against the claim the release makes will find that class of defect. Worth doing once per release.

## Blockers and issues to be aware of

- **No blocker on the work.** Nothing waits on input.
- **Local `main` is one commit ahead of `origin/main`** — the pre-compact state save `e753748`, made by the save-and-compact routine, which commits unconditionally and put it on `main` again. Push it or move it before starting Milestone 11 on a branch.
- **174 of 242 requirements stay dormant** until a producer emits an instance. Milestone 11 will not change that; expect the evaluated count to stay near 68 throughout the carriage work.
- **The run discriminator has no derivation rule.** Two runs over one subject and revision differing only in declared scope can collide, and nothing detects it. Recorded in ADR-0006 as the decision's weak joint.
- **A resolver is expected to exist and is unspecified.** Two conforming implementations may resolve one identity to different bytes; only the digest reveals it.
- **Ten of 22 unenforceable obligations are methodology safety boundaries** — a methodology may not carry requirements under STD-0010 R-16, so *do not modify the subject* and *do not reproduce credentials* cannot bind to any check.
- Open exceptions unchanged: EXC-0001 (`CAP` absent from the STD-0002 prefix table), EXC-0008 (allocation gaps at `AUD-0000` and `STD-0009`), stale note in STD-0010 section 18.

## Files changed

Published in the release, split across `df2609a`, `21f8a36`, `a88bd64`, `6e9c1df`:

- `docs/02-methodology/artifact-type-declaration-standard.md` — STD-0013, new
- `docs/10-artifact-types/` — ten documents, 93 declarations, new
- `docs/ADR/ADR-0006-artifact-instance-identity.md` — new, Accepted, with the Artifact Identity Triad
- `docs/ADR/ADR-0005-artifact-types-as-declarations.md` — Accepted, 1.1.0
- `docs/07-roadmap/framework-operationalization-roadmap.md` — REF-0023, new
- `docs/02-methodology/artifact-specification.md` — STD-0008 to 1.5.0; `metadata-specification.md` — STD-0010 to 1.2.0
- `docs/01-foundation/framework-artifact-model.md` — Q-01 resolved, 1.1.0
- `docs/09-capabilities/CAP-0001-repository-audit.md` — 1.3.1
- `docs/07-roadmap/artifact-type-inventory.md`, `docs/validation-report.md`, `docs/DOCUMENT_INDEX.md`, `docs/ADR/README.md`, `docs/README.md`, `docs/03-audit-engine/README.md`, `README.md`, `CHANGELOG.md`
- `tools/validator/lib/checks.mjs`, `lib/yaml.mjs`, `framework.config.json`, `tools/README.md`

Committed separately in `e753748`: `HANDOVER.md`, `tasks/todo.md`, `tasks/lessons.md`.

Modified after that commit and currently uncommitted: `HANDOVER.md`.
