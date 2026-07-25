# HANDOVER

Last updated: 2026-07-26

## Current task

Milestone 10.1 is written and awaiting approval to commit. Nothing from Milestone 10 or 10.1 is committed.

**The working tree carries two complete, unapproved milestones at once.** They share `docs/DOCUMENT_INDEX.md`, so committing them separately requires temporarily removing the later milestone's registry rows, committing the earlier one, then restoring them. That procedure was used successfully for Milestone 9 and ADR-0005 earlier this session.

## Last completed step

Milestone 10.1 — ADR-0006 on artifact instance identity and addressing. Reported, not committed.

Committed this session:

| Commit | Content |
| --- | --- |
| `2a4e4ae` | Milestone 9 — AUD-0004 through AUD-0011, plus REF-0012 |
| `994abbc` | ADR-0005 with the principle addition |

Uncommitted on disk:

- **Milestone 10** — STD-0013, the STD-0008 and STD-0010 revisions, 93 declarations in ten documents, 26 validator checks
- **Milestone 10.1** — ADR-0006, CAP-0001 to 1.3.0, registry and ADR index rows

Validation at the current tree: 69 documents, 242 requirements, 68 bound checks, 4830 results, **0 failures**, exit 0.

## Next pending step

1. Obtain approval, then commit in two parts using the registry-split procedure above. Proposed messages are in the Milestone 10 and 10.1 reports; the branch is `feature/milestone-7-methodology-refactor`, which is now badly named for what it carries and should be replaced by a fresh branch off `main` before the PR.
2. The revision milestone ADR-0006 implies: carry the identity decision into STD-0008, STD-0010, STD-0011, and STD-0012. STD-0013 is deliberately unaffected. Add a cross-reference from DOC-0007 section 19, which still records Q-01 as open with no pointer to the decision.
3. AUD-0001 Bootstrap is still a structural placeholder and is the only methodology that does not exist.

## Files recently modified

Uncommitted:

- `docs/02-methodology/artifact-type-declaration-standard.md` — STD-0013, new, 496 lines
- `docs/10-artifact-types/` — ten declaration documents, 93 declarations, new
- `docs/ADR/ADR-0006-artifact-instance-identity.md` — new
- `docs/02-methodology/artifact-specification.md` — STD-0008 to 1.5.0, eleven requirements retired
- `docs/02-methodology/metadata-specification.md` — STD-0010 to 1.2.0, admits `artifact_types`
- `docs/09-capabilities/CAP-0001-repository-audit.md` — to 1.3.0
- `docs/07-roadmap/artifact-type-inventory.md` — REF-0012 to 1.1.0, every type now Declared
- `docs/validation-report.md` — REF-0010 to 1.5.0
- `docs/ADR/README.md`, `docs/DOCUMENT_INDEX.md`, `tools/README.md`
- `tools/validator/framework.config.json` — framework key set moved into configuration
- `tools/validator/lib/checks.mjs` — 26 STD-0013 checks
- `tools/validator/lib/yaml.mjs` — nested values inside list items

## Blockers and decisions pending

- **Approval to commit Milestone 10 and 10.1.** The only real blocker.
- **The run discriminator has no derivation rule.** ADR-0006 records it as the decision's weak joint: two runs over one subject and revision differing only in declared scope can collide, and nothing detects it. Deferred because the fields it would derive from have no canonical serialization.
- **A resolver is expected to exist and is unspecified.** Two conforming implementations may resolve one identity to different bytes; only the digest reveals it.
- **114 requirements are dormant and will stay dormant.** STD-0007, STD-0008, and STD-0011 govern artifact instances, and the framework ships types and never instances. They activate when a producer runs, not when more documents are written.
- **Ten of 22 unenforceable obligations are methodology safety boundaries.** A methodology may not carry requirements under STD-0010 R-16, so *do not modify the subject* and *do not reproduce credentials* cannot be bound to any check.
- Open exceptions unchanged: EXC-0001 (`CAP` prefix absent from the STD-0002 table), EXC-0008 (allocation gaps at `AUD-0000` and `STD-0009`), and the stale note in STD-0010 section 18.
