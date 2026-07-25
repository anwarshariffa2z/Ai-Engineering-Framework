# HANDOVER

Last updated: 2026-07-26

## Current task

Milestone 9 — write the eight remaining discovery methodologies, AUD-0004 through AUD-0011 (files `03-frontend-discovery.md` through `10-runtime-verification.md`). Not started.

Before starting, the branch `feature/milestone-7-methodology-refactor` should be pushed and a PR opened. It carries five unpushed commits and milestone 9 is a large body of work to stack on top of an unpushed branch.

## Last completed step

Milestone 8.1.1 — standards reconciliation. Committed `6bcca16`. Four milestones were committed in order this session:

| Commit | Milestone |
| --- | --- |
| `abad90b` | 7 — AUD-0002 and AUD-0003 refactored to consume the core standards |
| `a8b7b2f` | 8 — reference validator |
| `32a98ad` | 8.0.1 — corpus defects cleared |
| `d9720c7` | 8.1 — STD-0001 and STD-0002 migrated into the requirement model |
| `6bcca16` | 8.1.1 — permitted form of a reference reconciled |

Validation at tip: 55 documents, 217 requirements, 42 bound checks, 0 failures, exit 0.

## Next pending step

1. Push `feature/milestone-7-methodology-refactor` and open a PR to `main`. **Merge with a merge commit, never squash** — a squash would orphan `3883cf7`, which carries the `v0.5.0-core-standards` tag.
2. Begin milestone 9. Use the refactored AUD-0002 and AUD-0003 as the structural template: capability declaration, standards consumed, inputs, preconditions, artifact types produced, guaranteed outputs, then domain-specific workflow only.
3. Each new methodology must carry `object_type: Methodology`, `layer: 1`, `depends_on`, `references`, `meta_model_version`, and a `normativity` map. It must **not** carry a `requirements` key — STD-0010 R-16 permits that only for standards.

## Files recently modified

Committed this session:

- `docs/03-audit-engine/01-architecture-discovery.md` — AUD-0002 to 2.0.0
- `docs/03-audit-engine/02-database-discovery.md` — AUD-0003 to 3.0.0
- `docs/02-methodology/artifact-specification.md` — STD-0008 to 1.4.0, seven requirements retired
- `docs/02-methodology/contract-specification.md` — STD-0011 to 1.2.0, five requirements added
- `docs/02-methodology/document-metadata-standard.md` — STD-0001 to 1.1.1, five requirements
- `docs/02-methodology/document-id-standard.md` — STD-0002 to 1.1.0, eight requirements
- `docs/07-roadmap/audit-engine-roadmap.md` — status Planned to Draft
- `README.md`, `CONTRIBUTING.md`, `SECURITY.md` — reference entries now object identities
- `docs/DOCUMENT_INDEX.md`, `docs/validation-report.md` — registry and exceptions
- `tools/` — reference validator, new
- `.gitignore` — ignores `validation/`

## Blockers and decisions pending

None blocking. Open items for decision:

- **EXC-0001** — the `CAP` prefix is used by CAP-0001 but absent from STD-0002's prefix table. Not a validation failure, because STD-0002 R-01 checks identifier form rather than prefix membership.
- **EXC-0008** — identifier allocation is not contiguous. The `AUD` sequence begins at `0000`, and `STD-0009` was reserved and never allocated. Reported as advisory warnings; a maintainer judgment, not a document defect.
- **Stale note in STD-0010 section 18** — it states that four entries use a prohibited reference form. Those were corrected in milestone 8.0.1, so the count is now zero. A one-line correction, deliberately deferred to keep milestone scope tight.
- **60 warnings remain**, all permitted by the transitional allowance of STD-0010 R-38: 53 documents have not split `related` into `depends_on` and `references`, 5 lack a normativity map, and 2 are the allocation gaps above.
- **Artifact type definitions do not exist.** Both methodologies name their artifact types and defer structure to STD-0008 section 15, but no conforming type definition has been written. STD-0007, STD-0008, and STD-0011 therefore have zero bound validator checks, because artifacts, producers, and consumers are absent from the corpus.
