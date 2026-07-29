# Reference Producer — AUD-0002 Architecture Discovery

The first executable implementation of a framework methodology. It exists to prove
that the standards in force can produce, resolve, consume, integrity-check, and
validate real artifact instances — not to be a production audit tool.

```
node tools/producer/index.mjs          # execute the run, write artifacts and resolution
node tools/producer/consume.mjs        # resolve, verify, and interpret them as a consumer
node tools/producer/test/run-tests.mjs # the requirement-addressed test suite
node tools/validator/index.mjs         # validate the corpus, artifacts included
```

## What it does

One run of AUD-0002 against `fixtures/subject-repo`, emitting one artifact per
declared output type, with a run-scoped resolution declaration beside them in
`artifacts/run-0001/`.

The lifecycle it exercises, end to end: repository input → methodology execution →
artifact creation → identity derivation → canonical serialization → digest
computation → persistence → resolution declaration → resolution → digest
verification → consumer interpretation → validator evaluation.

## Decisions this implementation makes, and their standing

**The run discriminator is orchestrator input, not a derivation.** `RUN_CONTEXT.runDiscriminator`
in `index.mjs` is a fixture value supplied to the producer, exactly as STD-0011 R-51
contemplates. ADR-0006 deferred the rule by which a discriminator is derived from a
run's declared scope and authorization, and **nothing here closes that deferral**.
A reader who mistakes `run-0001` for a framework derivation algorithm has read it
wrong: it is a name the orchestrator chose, and the only obligation on it is
distinctness within a subject and revision.

**Canonical serialization.** STD-0008 R-55 requires a digest over "the artifact's
canonical serialization" and no standard fixes what that is. This implementation
uses: JSON, UTF-8, object members ordered lexicographically at every depth, arrays
in document order, no insignificant whitespace, no trailing newline, with the
`integrity.digest` member removed from the digest input. On-disk artifacts are
pretty-printed; the digest is defined over the canonical bytes, so layout cannot
change it. The validator applies the same form. This is a reference implementation
choice, recorded below as a standards ambiguity rather than presented as a
framework decision.

**Record shape.** A record carries its type-declared fields under `fields`, and its
framework metadata — `record_id`, `evidence`, `scope_reason`, `load_bearing`,
`load_bearing_inputs` — beside them. STD-0013 R-35 forbids an artifact carrying a
record field its type declares in neither list, and the framework's own record
members are not type-declared fields; separating them lets R-35 be applied
literally rather than with a list of exceptions.

**Unknown records.** A record marked `Unknown` carries a scope reason and no
confidence and no score. STD-0007 R-38 forbids assigning confidence to a conclusion
a record does not make, R-31 admits a score only as an assessment supported by
findings, and R-42 forbids an `Unavailable` input contributing to a score at all.

## What the fixture proves

| Contract | How the fixture exercises it |
| --- | --- |
| `Complete` | Nine artifacts examined their declared scope in full |
| `Partial` | `dependencies` (no lockfile in scope) and `runtime` (orchestration unreadable) |
| `NotApplicable` | `integrations` — the subject exchanges nothing with any external system |
| `Unavailable` | `deployment` — definitions exist under `restricted/` and authorization was refused |
| `Observed` / `Inferred` / `Unknown` | File-derived records, reasoned classification, and two health dimensions whose load-bearing input is unavailable |
| Lineage | `classification`, `risks`, and `health` derive from artifacts of the same run by immutable reference |
| Cross-run reference | `fixtures/upstream-reference.json` carries an envelope summary and no locator |
| Resolution failure | That identity is recorded unresolvable; the consumer records `Unavailable` and infers no absence |

`Verified` is deliberately not exercised. STD-0007 R-04 admits it only where a
conclusion is directly confirmed by authoritative evidence an independent party
could reproduce against the subject, and a static inspection that executes nothing
cannot honestly reach it. Manufacturing one for coverage would be the exact failure
STD-0011 R-05 names.

The distinction between `NotApplicable` and `Unavailable` is observable in the
output: one artifact says the subject has no external integrations, the other says
this audit did not look at the deployment. Both carry zero records.

## Component classification

| Component | Classification |
| --- | --- |
| `lib/canonical.mjs` | Framework-generic — serialization and digest |
| `lib/identity.mjs` | Framework-generic — identity composition and reference forms |
| `lib/envelope.mjs` | Framework-generic — the nine envelope groups and aggregation |
| `lib/declarations.mjs` | Framework-generic — declaration loading and conformance |
| `lib/store.mjs` | Framework-generic — persistence and resolution declaration |
| `lib/resolver.mjs` | Framework-generic — resolution, verification, consumer duties |
| `consume.mjs` | Framework-generic — reads any artifact of any type |
| `index.mjs` | Methodology-generic run scaffolding, with an AUD-0002 run context and one import of the methodology |
| `lib/architecture-discovery.mjs` | AUD-0002-specific — what to examine and what the evidence supports |
| `fixtures/subject-repo/` | AUD-0002-specific |

The scaffolding in `index.mjs` is not extracted into a generic run module. One
working producer is evidence; a second one is what would show which parts of it
were general. Extracting now would be designing for a producer that does not exist.

## Standards ambiguities found

Recorded rather than resolved. None blocks implementation, and none was worked
around by changing a standard.

1. **Canonical serialization of an artifact is undefined.** STD-0008 R-55 and
   STD-0010 R-42 assume one without stating it. Two conforming implementations can
   therefore compute different digests over the same artifact, which weakens the
   cross-party integrity guarantee ADR-0006 intends. A future STD-0010 requirement
   fixing the form would close it.
2. **The aggregate of an empty record set is undefined.** STD-0008 R-10 requires an
   aggregate evidence state and confidence unconditionally; STD-0007 R-29 and R-30
   define both as a minimum over load-bearing conclusions. An `Unavailable` or
   `NotApplicable` artifact has none. This implementation takes the bottom of each
   lattice — `Unknown` and `Low` — as the only reading that cannot overstate.
3. **Required fields versus Unknown records.** STD-0013 R-33 requires an artifact to
   carry every field its type lists as required, while STD-0007 R-38 and R-42 forbid
   the confidence and score those lists include on a record that reaches no
   conclusion. R-33 ranges over the artifact rather than each record, which is the
   reading applied here, but the two standards would read better if one said so.
4. **The record's own representation is unspecified.** STD-0010 section 11 states
   that record-level metadata lives in the body and defers its members to STD-0008,
   which names the members without fixing where they sit relative to type-declared
   fields. The `fields` separation above is this implementation's answer.

No architectural contradiction was found. No accepted decision needed reopening, no
object type was added, and no resolver contract, service, or interface was created.
