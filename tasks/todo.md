# Todo

## Next action

- [ ] Push `feature/milestone-7-methodology-refactor` and open a PR to `main`, merging with a merge commit so the `v0.5.0-core-standards` tag stays anchored

## Milestone 9 — remaining discovery methodologies

- [ ] AUD-0004 Frontend Discovery — `03-frontend-discovery.md`
- [ ] AUD-0005 Backend Discovery — `04-backend-discovery.md`
- [ ] AUD-0006 Business Workflow Discovery — `05-business-workflow-discovery.md`
- [ ] AUD-0007 Security and Permissions — `06-security-permissions.md`
- [ ] AUD-0008 Feature Inventory — `07-feature-inventory.md`
- [ ] AUD-0009 Operations Manual — `08-operations-manual.md`
- [ ] AUD-0010 Gap Analysis — `09-gap-analysis.md`
- [ ] AUD-0011 Runtime Verification — `10-runtime-verification.md`
- [ ] AUD-0001 Audit Engine Bootstrap — `00-bootstrap.md`, still a structural placeholder

## Open exceptions

- [ ] EXC-0001 — decide whether to add `CAP` to the STD-0002 prefix table
- [ ] EXC-0008 — decide whether the `AUD-0000` start and the `STD-0009` gap are accepted or corrected
- [ ] Correct the stale note in STD-0010 section 18 stating four entries use a prohibited reference form

## Deferred from the architecture review

- [ ] Artifact type definitions — none exist; STD-0007, STD-0008, and STD-0011 have no bound checks until they do
- [ ] Cross-repository run addressing — DOC-0007 Q-01, blocks full execution of CAP-0001
- [ ] CI workflow running the validator on every pull request
- [ ] Generate the registry from front matter rather than maintaining it by hand
- [ ] Framework release process and changelog maintenance; CHANGELOG.md still reads `## Unreleased`
- [ ] Domain README files for the six numbered folders that lack one
- [ ] Name accountable individuals per domain, applying DOC-0003 to the framework itself

## Completed

- [x] Milestone 0 — land the frozen architecture design set
- [x] Milestone 1 — ADR-0002, ADR-0003, ADR-0004
- [x] Milestone 2 — STD-0008 Artifact Specification
- [x] Milestone 3 — STD-0010 Metadata Specification
- [x] Milestone 4 — STD-0007 Evidence and Confidence
- [x] Milestone 5 — STD-0011 Contract Specification
- [x] Milestone 6 — STD-0012 Validation, tagged `v0.5.0-core-standards`
- [x] Milestone 7 — AUD-0002 and AUD-0003 consume the core standards
- [x] Milestone 8 — reference validator
- [x] Milestone 8.0.1 — corpus defects cleared
- [x] Milestone 8.1 — STD-0001 and STD-0002 migrated into the requirement model
- [x] Milestone 8.1.1 — permitted form of a reference reconciled
