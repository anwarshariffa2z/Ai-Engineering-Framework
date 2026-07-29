# HANDOVER

Last updated: 2026-07-26

## Current task

None in progress. **Framework v1 is released.** The repository sits at a published, stable architectural baseline, and the next session begins a new phase rather than resuming an interrupted one.

## Last completed step

Publication of `v0.7.0-artifact-declarations`:

- Four release commits on `release/v0.7.0-artifact-declarations` — `df2609a`, `21f8a36`, `a88bd64`, `6e9c1df`
- PR #6 merged into `main` with a **merge commit**, `7da47ae`
- Annotated tag `v0.7.0-artifact-declarations` on the merge commit, pushed
- GitHub Release published: https://github.com/anwarshariffa2z/Ai-Engineering-Framework/releases/tag/v0.7.0-artifact-declarations

Validation at `main`: 70 documents, 70 registry rows, 8 standards, 242 requirements, 68 bound checks, 4,860 results, **0 failures**, 52 governed warnings, exit 0.

## Next pending step

**Milestone 11 — carry ADR-0006 into the standards.** It is the first workstream of Framework Operationalization (REF-0023 section 4) and the prerequisite for every producer workstream, because a producer cannot record a lineage reference the standards do not define.

Order, and what each needs:

1. **STD-0008** — the identity grammar behind R-06, the content digest as an envelope member, the definition of an upstream address in R-19
2. **STD-0010** — admissibility of an artifact identity under the R-07 reference grammar, and its canonical serialization
3. **STD-0011** — immutable references in lineage, the duty on an unresolvable identity, staleness defined by digest change
4. **STD-0012** — validator behaviour on an unresolvable identity and on a mutable reference found in lineage

STD-0013 needs nothing. Leaving it untouched is the standing check that the ADR-0005 separation holds; if the milestone finds itself editing STD-0013, the separation was wrong.

**Start on a feature branch off `main`.** See the blocker below.

## Files recently modified

Published in the release (see the four commits for the split):

- `docs/02-methodology/artifact-type-declaration-standard.md` — STD-0013, new
- `docs/10-artifact-types/` — ten documents, 93 declarations, new
- `docs/ADR/ADR-0006-artifact-instance-identity.md` — new, Accepted
- `docs/ADR/ADR-0005-artifact-types-as-declarations.md` — promoted to Accepted, 1.1.0
- `docs/07-roadmap/framework-operationalization-roadmap.md` — REF-0023, new
- `docs/02-methodology/artifact-specification.md`, `metadata-specification.md`
- `docs/01-foundation/framework-artifact-model.md` — Q-01 resolved
- `docs/09-capabilities/CAP-0001-repository-audit.md`, `docs/07-roadmap/artifact-type-inventory.md`
- `docs/DOCUMENT_INDEX.md`, `docs/validation-report.md`, `docs/ADR/README.md`, `docs/README.md`, `README.md`, `docs/03-audit-engine/README.md`, `CHANGELOG.md`
- `tools/validator/lib/checks.mjs`, `lib/yaml.mjs`, `framework.config.json`, `tools/README.md`

Uncommitted at the time of writing: `HANDOVER.md`, `tasks/todo.md`, `tasks/lessons.md`.

## Blockers / decisions pending

- **No blocker on the work.** Nothing waits on input.
- **Branch discipline broke this session and was repaired.** Seven commits were authored directly on local `main`, including two milestones from the previous session, against the repository's own rule. Caught during release verification. Repaired by branching `release/v0.7.0-artifact-declarations` off the tip and resetting local `main` to `origin/main` before publishing through a PR. **Check `git branch --show-current` before the first commit of the next session.**
- **Two sub-decisions inside ADR-0006 remain open by design**: a derivation rule for the run discriminator, and whether the framework specifies a resolver contract. Both are recorded in the ADR. Neither blocks Milestone 11, and both may be settled by it or deferred again.
- **174 of 242 requirements stay dormant** until a producer emits an instance. No document can change that, Milestone 11 included. Expect the evaluated count to stay near 68 through the entire carriage milestone.
- Open exceptions unchanged: EXC-0001 (`CAP` absent from the STD-0002 prefix table), EXC-0008 (allocation gaps at `AUD-0000` and `STD-0009`), stale note in STD-0010 section 18.
- AUD-0001 Bootstrap is still a structural placeholder and the CAP-0001 ordering begins with it.
