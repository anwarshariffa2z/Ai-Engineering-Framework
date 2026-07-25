# Todo

## Next action

- [ ] Create a feature branch off `main` before the first commit of the next session — seven commits landed directly on `main` this session

## Milestone 11 — carry ADR-0006 into the standards

First workstream of Framework Operationalization. Prerequisite for every producer workstream.

- [ ] STD-0008 — identity grammar behind R-06, content digest as an envelope member, the definition of an upstream address in R-19
- [ ] STD-0010 — admissibility of an artifact identity under the R-07 reference grammar, and its canonical serialization
- [ ] STD-0011 — immutable references in lineage, the duty on an unresolvable identity, staleness defined by digest change
- [ ] STD-0012 — validator behaviour on an unresolvable identity and on a mutable reference found in lineage
- [ ] STD-0013 needs nothing; leaving it untouched is the check that the separation holds

## Open decisions from ADR-0006

- [ ] Derivation rule for the run discriminator, so two runs over one subject and revision cannot collide
- [ ] Whether the framework specifies a resolver contract, or leaves resolution wholly to adopters

## Framework Operationalization — later workstreams

Recorded in REF-0023 section 4. Ordered by dependency.

- [ ] Reference Producers — an executable implementation of at least one methodology emitting conforming instances
- [ ] Reference Artifact Corpus — published instances covering the boundary and failure cases the fixtures describe
- [ ] Validator Expansion — activate the 174 instance-scoped requirements against that corpus
- [ ] CI/CD Integration — validation on every pull request, release process gated on it
- [ ] IDE Integrations, AI Agent Runtime, Example Repositories, Interoperability Testing

## Remaining framework work

- [ ] AUD-0001 Audit Engine Bootstrap — `00-bootstrap.md`, still a structural placeholder
- [ ] Generate the registry from front matter rather than maintaining it by hand
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
- [x] Framework v1 integration — ADR-0005 and ADR-0006 promoted to Accepted, Q-01 resolved, READMEs and registry reconciled, CHANGELOG release history, REF-0023 operationalization roadmap
- [x] Release v0.7.0-artifact-declarations — four commits, PR #6 merged with a merge commit `7da47ae`, tag pushed, GitHub Release published
