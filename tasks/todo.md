# Todo

## Next action

- [ ] Commit Milestone 10 and Milestone 10.1 once approved, in two parts, splitting `docs/DOCUMENT_INDEX.md` between them

## Immediately after

- [ ] Create a fresh branch off `main`; `feature/milestone-7-methodology-refactor` no longer describes what it carries
- [ ] Open a PR and merge with a merge commit, never a squash, so `3883cf7` and its `v0.5.0-core-standards` tag stay reachable
- [ ] Consider a `v0.7.0` tag once the artifact type declaration framework is merged

## Milestone 11 — carry ADR-0006 into the standards

- [ ] STD-0008 — identity grammar behind R-06, content digest as an envelope member, the definition of an upstream address in R-19
- [ ] STD-0010 — admissibility of an artifact identity under the R-07 reference grammar, and its canonical serialization
- [ ] STD-0011 — immutable references in lineage, the duty on an unresolvable identity, staleness defined by digest change
- [ ] STD-0012 — validator behaviour on an unresolvable identity and on a mutable reference found in lineage
- [ ] DOC-0007 section 19 — cross-reference ADR-0006 where Q-01 is still recorded as open
- [ ] STD-0013 needs nothing; leaving it untouched is the check that the separation holds

## Open decisions from ADR-0006

- [ ] Derivation rule for the run discriminator, so two runs over one subject and revision cannot collide
- [ ] Whether the framework specifies a resolver contract, or leaves resolution wholly to adopters

## Remaining framework work

- [ ] AUD-0001 Audit Engine Bootstrap — `00-bootstrap.md`, still a structural placeholder
- [ ] CI workflow running the validator on every pull request
- [ ] Generate the registry from front matter rather than maintaining it by hand
- [ ] Framework release process and changelog; `CHANGELOG.md` still reads `## Unreleased`
- [ ] Domain README files for the numbered folders that lack one
- [ ] Name accountable individuals per domain, applying DOC-0003 to the framework itself

## Open exceptions

- [ ] EXC-0001 — decide whether to add `CAP` to the STD-0002 prefix table
- [ ] EXC-0008 — decide whether the `AUD-0000` start and the `STD-0009` gap are accepted or corrected
- [ ] Correct the stale note in STD-0010 section 18 stating four entries use a prohibited reference form

## Completed

- [x] Milestones 0 through 8.1.1 — architecture, seven core standards, methodology refactor, reference validator, legacy migration, standards reconciliation
- [x] Milestone 9 — AUD-0004 through AUD-0011, and REF-0012 recording all 93 artifact types
- [x] Milestone 9.1 — ADR-0005 on artifact type definition ownership
- [x] Milestone 10 — artifact type declaration framework, all four phases
- [x] Milestone 10.1 — ADR-0006 on artifact instance identity and addressing
