# Todo

## Next action

- [ ] Await approval of the post-AUD-0005 standards consolidation gate report, then create five commits: empty-set aggregation (STD-0007 R-45), required-input contract (STD-0011 R-53 / STD-0010 R-25), document version classification (STD-0001 R-06, R-07), validator binding for R-45, and the gate documentation

## Standards consolidation gate — analysed, awaiting approval

Branch `feature/reference-producer-backend` at `09cfbba`. Analysis complete, nothing edited.

- [ ] STD-0007 R-45 — the aggregate of an empty conclusion set is lattice-bottom. Six subjects in the corpus; binds
- [ ] STD-0011 R-53 + STD-0010 R-25 — a producer declares which consumed types each output requires. Dormant: no object in the corpus declares `produces` or `consumes`
- [ ] STD-0001 R-06, R-07 — document version classification by whether a conforming subject can cease to conform. Judgment; needs two revisions to check, so dormant
- [ ] Bind STD-0007#R-45; add two tests (empty aggregate, all-Unknown aggregate)
- [ ] Update REF-0010, REF-0023, DOCUMENT_INDEX

## Deferred, with evidence

- [ ] Record-level lineage identity — 19 records lowered High→Medium by artifact-level aggregation; representation still yields a correct conservative conclusion. Do not reopen ADR-0006
- [ ] `derives_from` versioning — three occurrences, still no demonstrated compatibility consequence
- [ ] Generic producer runtime extraction — reassess only once producers publish declarations carrying `requires`
- [ ] Run discriminator derivation rule (ADR-0006)
- [ ] Whether the framework specifies a resolver contract

## Reference producers — remaining

- [ ] AUD-0004 Frontend Discovery — fourth producer. **Backend Discovery is AUD-0005; do not confuse the two**
- [ ] AUD-0007 Security Discovery — first broad cross-cutting consumer
- [ ] Remaining methodologies in information-gain order
- [ ] Reference Artifact Corpus, Validator Expansion, CI/CD Integration

## Remaining framework work

- [ ] AUD-0001 Audit Engine Bootstrap — `00-bootstrap.md` still a structural placeholder
- [ ] Generate the registry from front matter rather than maintaining it by hand
- [ ] Domain README files for the numbered folders that lack one
- [ ] Name accountable individuals per domain
- [ ] EXC-0001 — whether `CAP` joins the STD-0002 prefix table
- [ ] EXC-0008 — whether the `AUD-0000` start and the `STD-0009` gap are accepted or corrected
- [ ] Stale note in STD-0010 section 18 on four prohibited reference forms

## Completed

- [x] Milestones 0 through 10.1 — architecture, standards, methodologies, validator, ADR-0005, ADR-0006
- [x] Framework v1 integration and release `v0.7.0-artifact-declarations`
- [x] Operationalization workstreams 1–4 — ADR-0006 carried into STD-0008/0010/0011/0012
- [x] AUD-0002 Architecture Discovery reference producer, and canonical serialization standards
- [x] AUD-0003 Database Discovery reference producer — first consuming producer; PR #9 merged, tag `v0.8.0-reference-producers`
- [x] AUD-0005 Backend Discovery reference producer — first multi-upstream consumer, six commits `9422ee2`..`09cfbba`
- [x] STD-0008 R-59 / STD-0010 R-30 / STD-0013 R-23 — consumption-profile traceability, making STD-0011 R-30 auditable
