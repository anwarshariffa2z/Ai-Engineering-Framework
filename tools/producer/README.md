# Reference Producers — AUD-0002 Architecture, AUD-0003 Database, AUD-0005 Backend

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

**Canonical serialization.** STD-0010 R-46 makes it the JSON Canonicalization
Scheme of RFC 8785, and R-47 requires every member the artifact carries to
participate in it. This implementation produces that form with the platform's own
JSON writer plus a recursive member sort — ECMAScript `JSON.stringify` already
gives UTF-8 without a BOM, no insignificant whitespace, RFC 8259 shortest-form
escaping, and the number format RFC 8785 defines by reference to ECMAScript; the
default string comparison sorts by UTF-16 code unit, which is the order RFC 8785
requires. No third-party canonicalizer is used. On-disk artifacts are
pretty-printed; the digest is defined over the canonical bytes, so layout cannot
change it. The validator applies the same form and checks it.

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

| Component | Classification | Second producer's effect |
| --- | --- | --- |
| `lib/canonical.mjs` | Framework-generic — serialization and digest | Reused unchanged |
| `lib/identity.mjs` | Framework-generic — identity composition and reference forms | Reused unchanged |
| `lib/envelope.mjs` | Framework-generic — the nine envelope groups and aggregation | One comment added; behaviour unchanged |
| `lib/declarations.mjs` | Framework-generic — declaration loading and conformance | Reused unchanged |
| `lib/store.mjs` | Framework-generic — persistence and resolution declaration | Reused unchanged |
| `lib/resolver.mjs` | Framework-generic — resolution, verification, consumer duties | Reused unchanged |
| `consume.mjs` | Framework-generic — reads any artifact of any type | Made tolerant of a run declaring no unresolvable identity |
| `index.mjs` | Methodology-generic run scaffolding | Gained a composed run and shared gate and write helpers |
| `cross-run.mjs` | Framework-generic — the cross-run reference scenario | New |
| `lib/architecture-discovery.mjs` | AUD-0002-specific — how the methodology shapes a record | Subject judgements moved out; logic unchanged |
| `lib/database-discovery.mjs` | AUD-0003-specific — the same, plus the consumption of upstream types | New |
| `lib/backend-discovery.mjs` | AUD-0005-specific — the same, plus consumption through declared profiles | New |
| `lib/*-subjects.mjs` | Subject-specific — the judgements each methodology reached about each subject | Three files, three subjects |
| `fixtures/subject-repo{,-db,-backend}/` | Subject-specific | One new |

### What the second producer showed

Six of the seven generic modules were reused without modification, which is the
result the first producer predicted but could not demonstrate. The two that moved
did so for reasons a second producer was needed to see.

The first is the subject split. A conclusion such as *"src/domain holds the ordering
rules"* is a judgement about a subject, not a rule of a methodology, and no producer
can derive it. In one producer that distinction is invisible, because the subject and
the methodology arrive together. With two subjects it is unavoidable, so the
judgements now live in `*-subjects.mjs` and the discovery modules hold only the
methodology. Both producers converged on the same split independently, which is the
first evidence that it is structural rather than incidental.

The second is `index.mjs`. Its gate and write steps are now shared by both runs and
are genuinely identical, but the two run functions are not: a composed run must write
and declare its first methodology's output before its second can resolve it, and a
single-methodology run has no such ordering. **A generic producer runtime should not
be extracted yet.** What is shared is thirty lines of gate-and-write; what differs is
the sequencing, and sequencing is the part a third producer would test. Two producers
show the duplication is real. They do not yet show the two orchestrations mean the
same thing.

## What the third producer showed

AUD-0005 Backend Discovery is the first producer that consumes from two methodologies. One run executes architecture, then database, then backend over `fixtures/subject-repo-backend`, emitting thirty-eight artifacts with forty-four lineage edges, seven of which cross a methodology boundary.

**Consumption through a declared profile, enforced rather than asserted.** Seven of the eight types this producer consumes declare a `backend-discovery` consumption profile. STD-0011 R-30 requires compatibility to be evaluated against the profile rather than against the whole type, and this producer goes further: `projectThroughProfile` returns each consumed record restricted to the fields its profile names, so a field the profile does not grant is *absent* rather than merely unread. An accidental dependency on an undeclared field is a `TypeError`, not a review finding. Enforcing it, however, is not the same as showing it: the projection happens inside the producer and left no trace in what the producer wrote. STD-0008 R-59 now obliges a lineage reference to record the profile a derivation was drawn through, and five of this run's lineage edges carry one. The other two profiled consumptions are unwitnessed, because a profile is recorded on a derivation and those two types are consumed without any backend type deriving from them — the profile-and-derivation asymmetry below, showing up a second time as a limit on what can be audited. The eighth type, `framework.architecture.scope`, declares no profile and is consumed for its envelope alone; that asymmetry is recorded below rather than papered over.

**Ordering is now derived, not written.** `executeThreeStageRun` orders its stages by what each methodology declares it consumes: architecture consumes nothing, database consumes architecture types, backend consumes both. Each stage is written and declared before the next resolves anything. The duplication between it and `executeComposedRun` is left in place deliberately — see the extraction verdict below.

**A three-hop conclusion.** `framework.backend.dataaccess` names entities this run never observed: it read them from `framework.database.entities`, which derived them from `framework.architecture.modules`. Every hop resolves and its digest verifies.

### The lineage granularity question, measured

The producer computes two numbers for each edge it produces: the cap the upstream artifact's *aggregate* imposes under STD-0007 R-26, and the strongest load-bearing record in that same artifact. Where they differ, a conclusion drawn only from the strong records is nonetheless held to the weak ones.

Two of twenty edges lose headroom in the committed output. That number understates what happened during implementation, and the implementation account is the more useful evidence: **nineteen records across six artifacts had to be lowered from `High` to `Medium` before the run validated**, none because its own evidence weakened. One `Medium` record in `framework.backend.services` — a service whose deployment unit is inferred from a start script, there being no deployment manifest — propagated a `Medium` ceiling through `interfaces`, `contracts`, `boundaries`, `risks`, and `health`, five hops out. The two numbers converge afterwards precisely because everything was lowered to meet the floor.

Two further observations, both concrete:

- **The standard is record-scoped and the model is artifact-scoped.** STD-0007 R-26 caps a conclusion at "the minimum confidence among *its* load-bearing inputs" and R-28 makes a conclusion with "an `Unknown` load-bearing input" Unknown. Both range over a conclusion's own inputs. Artifact-level lineage cannot express those, so the validator substitutes the upstream artifact's aggregate — which is the minimum over *all* its records and therefore never higher than the minimum over the subset actually used. The substitution is strictly stricter than the requirement.
- **R-28 is the sharp edge, not R-26.** A lowered confidence is conservative and still true. An `Unknown` forced onto a conclusion the audit genuinely reached is *false*: it asserts that no determination could be made when one was. An early draft of this producer recorded two operations as Unknown because their handler pairing is resolved at run time; that made the whole `interfaces` artifact aggregate to Unknown, which under R-28 would have made every conclusion in `contracts`, `errors`, and `boundaries` Unknown too — ten findings destroyed by two records that none of them depended on. The records were corrected because the operations *are* observable (the handler module is named in the import; only the export is selected by name), so the situation did not arise in the committed output. It remains one honest record away.

Recorded, not resolved. Closing it means a record-to-record reference, which is a new identity form and a change to ADR-0006, and one milestone's evidence is not a mandate to reopen an accepted decision.

### Generic producer runtime: still not yet, and now for a stated reason

Three producers now occupy the three positions the question needs — non-consuming, single-upstream consuming, multi-upstream consuming. Against the five conditions set for extraction:

| Condition | Holds? |
| --- | --- |
| The same gate-and-write lifecycle | **Yes.** `gate` and `writeAll` are shared verbatim by all three |
| The same input-resolution semantics where inputs exist | **Yes.** Both consumers resolve by identity against the run declaration and verify the digest through the same `resolver.mjs` |
| The same failure-propagation semantics | **No.** AUD-0002 has no input and cannot fail closed at all; AUD-0003 maps a missing input to `Unavailable` on two output types; AUD-0005 maps it on two of ten and must also handle a profile that no longer matches its type, a condition the second producer has no analogue for |
| Ordering derivable from declared dependencies | **Yes**, and now demonstrated over three stages rather than argued over two |
| No methodology-specific condition hidden inside the abstraction | **No.** `REQUIRED_INPUTS` differs per methodology and is not derivable from any declaration: nothing in a type declaration states which of a producer's outputs cannot be produced without which input |

Three of five hold. **Do not extract.** The two that fail are the same one seen from two sides: the framework can say what a producer consumes but not what each of its outputs *requires*, so any shared runtime would carry a per-methodology table and the abstraction would hide exactly the thing that differs. The extraction proposal that follows from this is to make required-input mapping declarable first, and to revisit extraction after that — not to extract around it.

## Standards ambiguities found

1. **Canonical serialization of an artifact was undefined. Closed.** STD-0008 R-55
   required a digest over a canonical serialization that no standard fixed, so two
   conforming producers could digest one artifact differently and the integrity leg
   of ADR-0006 rested on their happening to agree. STD-0010 R-46 now adopts RFC 8785
   and R-47 requires every member to participate. This implementation's output
   already satisfied both: no artifact changed and no digest moved.

2. **The aggregate of an empty record set is undefined. Three independent readings
   now agree; still deferred.** AUD-0003 produces one `NotApplicable` artifact with no
   records and AUD-0005 produces another, for a different reason: the subject declares
   no asynchronous, scheduled, or event-driven work at all, so `framework.backend.execution`
   counts nothing. All three producers reach the bottom of each lattice, `Unknown` and
   `Low`, as the only value that cannot overstate, and all three reach it through the
   same generic aggregation rather than by agreement. Three independent implementations
   converging is the strongest evidence available short of a standards decision, and it
   is still not the same as the standard stating it. This is the recommendation to take
   to the decision gate.

3. **Required fields versus Unknown records. Closed by STD-0013 R-37.** AUD-0003
   produces eight Unknown records across `lifecycle` and `health` — every lifecycle
   record in the run is Unknown — and each carries the fields its evidence supports
   while omitting the conclusion-bearing ones. A second producer showed the pattern
   is a normal outcome rather than an edge case: in a domain whose deployed state is
   unobservable, Unknown is what an honest record usually says. It also showed the
   ambiguity was not academic. The validator had been exempting Unknown records from
   STD-0013 R-33 on its own authority, which STD-0012 R-03 forbids, because the only
   alternatives a producer had were to invent a value or to suppress the record.
   **R-37** now states the third option and is the only qualification R-33 receives:
   carry the record, carry what the evidence supports, omit the rest, and bound the
   omission with the scope reason STD-0008 R-44 already required. It is
   judgment-checkable and deliberately unbound — an artifact that omitted a field
   honestly and one that fabricated a value are equally well-formed, so a check
   would assume the requirement rather than evaluate it.

4. **The record's own representation is unspecified. Closed by STD-0008 R-58.** The
   `fields` separation was carried into AUD-0003 unchanged and needed no adjustment
   for a domain with entirely different field families, including records whose
   natural shape is an absence. Convergence across two independent methodologies is
   what made it safe to standardize, and the same latent defect appeared here as in
   ambiguity 3: the validator's R-35 arm already read only `fields`, silently
   exempting the framework's own record members from a prohibition that on its face
   reached them. **R-58** fixes the boundary — `record_id`, `evidence`,
   `scope_reason`, `load_bearing`, and `load_bearing_inputs` are the framework's and
   are the same for every type; everything a declaration supplies sits in `fields`.
   It standardizes where a type's fields sit and says nothing about what they are:
   neither methodology's field family appears in the standard.

### A fifth, found by the second producer

5. **Lineage granularity is asymmetric. Deferred.** STD-0008 R-46 requires a lineage
   entry to name the downstream records that depend on it, and nothing names the
   *upstream* records they depend on. Propagation under STD-0007 R-26 and R-28 is
   therefore computed against an upstream artifact's aggregate rather than against
   the records actually used, so a single `Low` record anywhere in an upstream
   artifact caps every conclusion drawn from any part of it. That is conservative
   and never overstates, which is why this implementation accepts it, and it is why
   several AUD-0003 conclusions carry lower confidence than their own evidence
   supports. Closing it would mean a record-to-record reference, which is a new
   identity form and a change to ADR-0006, and one consumer is not enough evidence
   to justify either. Revisit when a second consuming producer exists.

## Declaration corrections, and why they keep appearing

Three type declarations recorded a `derives_from` set narrower than the lineage the
runs actually produced: `framework.database.risks` drew on `schema` and `entities`,
`framework.architecture.classification` declared no derivation at all while drawing
on `modules` and `layers`, and `framework.architecture.risks` listed five of the
seven types it used. In every case the instance lineage was right and the
declaration was incomplete, so the declarations were corrected. No entry was
removed, the graph over all ninety-three types remains acyclic, and **no
`type_version` moved**: a `derives_from` entry supplies an operand to STD-0013 R-21
and R-22, which range over the corpus graph, and to no requirement that ranges over
an instance, so no artifact's conformance changed and every AUD-0002 digest is what
it was. Nothing in STD-0013 classifies a change to `derives_from` the way R-15
classifies a vocabulary change; that gap is recorded, not closed by inference.

The third producer found the same defect a third time. `framework.backend.interfaces`
and `framework.backend.resilience` declared no derivation while every record of each
named an upstream artifact, and `framework.backend.health` scored a dimension from an
artifact its declaration did not list. Three of the ten declaration documents have now
been corrected, and in every case the correction was found by an implementation and by
nothing else. The pattern is worth naming: **a declared derivation set is unverifiable
until something derives.** No requirement compares `derives_from` against the lineage a
producer actually emits, because until this milestone there was no corpus in which the
comparison had a subject. There is now.

A separate asymmetry appeared alongside it, and is reported rather than corrected. Four
of the eight types AUD-0005 consumes — `architecture.scope`, `architecture.technology`,
`architecture.modules`, `architecture.integrations` — are consumed, and three of them
declare a `backend-discovery` consumption profile, yet no backend type declares
`derives_from` any of them. `consumption_profiles` and `derives_from` are two
independent statements about the same relationship and nothing requires them to agree.
Whether they should is a standards question this milestone does not answer.

No architectural contradiction was found. No accepted decision needed reopening, no
object type was added, and no resolver contract, service, or interface was created.
