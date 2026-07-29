# Lessons

## Lesson — 2026-07-26

### Ownership disputes are resolved by a test, not by preference

Three milestones in a row, a new standard claimed content that an earlier one already held. The resolution each time was a stated test rather than a judgment call:

- Artifacts are things, exchanges are interactions. An obligation describing a well-formed artifact belongs to STD-0008; one describing a well-behaved participant belongs to STD-0011.
- A consumer failing closed protects its own conclusions and is participant behaviour. A validator failing closed is performing its function and is validator behaviour. Same rule, different actor, different owner.
- Where two standards address the same key, one owns the obligation and the other owns the representation. That rule, written into STD-0010 section 3, later settled the STD-0001 conflict without a new decision.

Fourteen identifiers were retired from STD-0008 across four versions. Retirement moved obligations to their owner; none was removed from the framework.

### A validator must not check what no requirement states

STD-0012 R-01 forbids evaluating a condition no requirement states. This bit twice, correctly both times. A check verifying that fragment addresses *resolve* was wrong, because R-35 states only that they must *match the form* — narrowing it removed two false failures. And registry agreement could not be enforced at all until STD-0001 was migrated, because its obligations carried no identifier. That gap was the single most valuable finding of the validator milestone.

Corollary that proved useful: report what cannot be enforced. Sixteen unbound obligations were listed rather than silently skipped, which is what made the STD-0001 gap visible.

### PowerShell 5.1 destroyed a file, twice nearly

Two distinct traps, both silent:

- `Get-Content -Raw` reads as ANSI. Writing back with `Set-Content -Encoding utf8` double-encodes every non-ASCII character and adds a BOM. It corrupted two files and violated the very requirement being written at the time. Fix: `[System.IO.File]::ReadAllText` and `WriteAllText` with `UTF8Encoding($false)`.
- A single-element array unrolls. `@( @("a","b") )` becomes a two-element string array, so `$pr[0]` is the character `a` rather than the string. A string-replace then substituted every `s` with `e` across an entire standard — 255 lines. Fix: type the collection explicitly, or use `System.Collections.Generic.List[string[]]`.

Both were caught by reading the file afterwards. Neither would have been caught by the diff summary alone.

### A glob converter must not rewrite its own output

Expanding `**` to `.*` and then expanding `*` to `[^/]*` rewrites the `.` `*` just produced. The validator found only 9 of 55 documents until the substitution used placeholders first. Symptom looked like a corpus problem; cause was one line of regex.

### Commit final states in roadmap order, not reconstructed history

STD-0008 was amended three times after its own milestone. Rebuilding its original state to preserve a tidy history would have invented a document that never shipped. Committing the current state in roadmap order, with the commit message naming what changed and why, reads honestly. The cost — intermediate commits that do not validate standalone — is worth stating up front rather than discovering during a bisect.

The one exception: where an intermediate state genuinely existed and differed, reconstruct it. STD-0001 at 1.1.0 was real, so milestone 8.1 committed it before 8.1.1 replaced it.

### Working files are not framework documents

`HANDOVER.md` and `tasks/*.md` are Markdown in the repository but are not framework corpus. They belong in the validator's exclude list alongside `tools/`, not in the registry with front matter. Adding them to the corpus would have failed validation on documents that are not governed by the standards at all.

## Lesson — 2026-07-26 (second session)

### The scope field settled an ownership question that had cost three milestones

Eleven requirements moved from STD-0008 to STD-0013, and choosing which required no judgment at all: they were exactly the requirements whose declared `scope` was `artifact-type` rather than `artifact`, `record`, `evidence`, `run`, `producer`, or `transformer`. Three earlier milestones resolved the same class of question by inventing a test each time. The metadata had been carrying the answer since ADR-0002; nobody had queried it.

Worth remembering as a general move: when a structured declaration already partitions the thing being argued about, query the partition before proposing a test.

### Duplication is removed by finding the rule, not by merging the documents

STD-0008 R-32 required all 93 artifact types to state their own completeness conditions, and those conditions were identical in all 93 cases. The fix was one section in STD-0013 stating them once, not a shared type. Meanwhile the ten `*.risks` and ten `*.health` types stayed separate despite looking near-identical, because per-type versioning and per-domain vocabularies are real variability.

The test that separated the two cases: does the difference between members change what a consumer must do? Completeness conditions did not. Dimension vocabularies did.

### An ADR's list of affected standards is a hypothesis

ADR-0005 named STD-0008 as the only affected standard. Implementation immediately hit a second: STD-0010 R-09 admitted only keys "defined by this standard", so `artifact_types` failed on all ten declaration documents. The validator found it within seconds of the first run.

Carried forward into ADR-0006 by listing STD-0010 in its affected-standards table on purpose, reasoning that an identity string is a new kind of metadata value and its admissibility under R-07 will need settling for the same reason.

### Backticks inside inline shell scripts silently delete content

Twice this session, JS strings containing Markdown code spans were passed through `bash -c`, and the shell command-substituted them. Eight code spans vanished from REF-0012 and a path from the validation report, leaving grammatical sentences with holes — `Ten domain-specific  types and ten  types`. No error, no exit code.

Both caught only by reading the file afterwards. This is the third distinct variant of shell-mangles-content in this project, after the PowerShell encoding and array-unroll traps. **Rule: multi-line prose edits go through Write or Edit, never through a script invoked from a shell.** Scripts are for structured, line-based edits on registry tables.

### The regex-over-whole-file registry edit failed again, and the line-based form worked

A `RegExp` with the `m` flag against CRLF content wrote a table row to line 1 of `DOCUMENT_INDEX.md`, destroying the front matter. The validator reported all 56 documents unregistered on the next run, which is exactly the behaviour that makes it worth having. Restored with `git checkout` and redone by splitting on newline, matching per line, and preserving each line's own terminator.

### Naming what is not activated is as valuable as the activation count

The artifact type declaration framework bound 26 new checks and activated zero previously dormant requirements. The honest statement is structural: STD-0007, STD-0008, and STD-0011 govern artifact *instances*, the framework ships types and never instances, and 114 requirements therefore stay dormant until a producer runs. Reporting only the +26 would have implied progress toward something that had not moved.

### The last blocker moved three times, and the third move changed its kind

CAP-0001's readiness gap was "nine methodologies missing", then "no artifact type definitions", now "instance identity". The first two were closed by writing documents. The third could not be, which is why it needed an ADR rather than another milestone of authoring. A blocker that keeps regenerating is a sign the real question has not been named yet.

## Lesson — 2026-07-26 (release)

### Verify the branch, not the memory of the branch

Every report for two sessions said the work sat on `feature/milestone-7-methodology-refactor`. It sat on `main`. That branch had been merged by PR #4 and the checkout to `main` happened afterwards; nothing re-checked it, and seven commits accumulated on `main` in violation of the repository's own rule. It surfaced only because the release script asked for a branch rename, which is a step that cannot succeed on `main`.

The repair was cheap because commits are movable: branch off the tip first, then reset the branch pointer back to `origin/main`, then publish through the PR. Nothing was lost, and all seven commits still reached `main` through the merge commit.

**Rule: `git branch --show-current` before the first commit of a session, not after the last.** A fact that is cheap to check and expensive to assume should never be carried in memory across a compaction.

### Splitting entangled commits needs the working tree to equal the commit tree

Four commits shared `docs/DOCUMENT_INDEX.md` and two shared the validation report. Staging alone was not enough: the validator reads the working tree, so an untracked file present but unregistered would have failed a commit that did not contain it.

The procedure that worked: back up every final file, generate each intermediate registry state programmatically from the final one by reverting the later commits' rows, move not-yet-committed new files out of the tree entirely, `git checkout HEAD --` the files belonging to later commits, validate, stage, commit, then restore forward. Each of the four trees validated standalone at exit 0, which is the property that makes a bisect meaningful.

Cost check afterwards: every file byte-identical to the approved state, verified by `cmp` against the backups rather than by inspection.

### A release entry is not a commit log

The changelog was written per release with four to six lines each, not per milestone. Ten milestones compress to three tags without losing anything a reader needs, because the commit history is already authoritative for detail. Reconstructing intermediate milestones into the changelog would have duplicated `git log` in a file that then has to be maintained.

### The stale sentence a release exposes is the one that was true when written

CAP-0001 read "This **is** the framework's last **open** architectural question." Accurate when written, contradictory the moment ADR-0006 was promoted to Accepted. Nothing detects that class of defect: the link resolves, the metadata agrees, the validator passes.

Found only by re-reading the documents that assert repository state — CAP-0001, the READMEs, the validation report — against the claim the release makes. Worth doing once per release, and only for documents that describe status rather than rules.

## Lesson — 2026-07-29 (AUD-0005 and the consolidation gate)

### A declared derivation set is unverifiable until something derives

Three of the ten declaration documents have now had incomplete `derives_from`
corrected, and every one was found by an implementation rather than by review or
by the validator. No requirement compares a declared derivation set against the
lineage a producer actually emits, because until a producer exercises the type
the comparison has no subject. Expect the same defect in every declaration
document that has not yet had a producer written against it.

### A record-scoped requirement enforced over artifact-level lineage is stricter than itself

STD-0007 R-26 caps a conclusion at the minimum among *its* load-bearing inputs
and R-28 fires on *an* Unknown load-bearing input. Both range over one
conclusion's own inputs. Artifact-level lineage can only express artifact to
artifact, so the validator substitutes the upstream artifact's aggregate — the
minimum over *all* its records, never higher than the minimum over the subset
used. R-26's effect stays conservative and true. R-28's does not: an early draft
had two Unknown records making a whole artifact Unknown, which would have
destroyed ten downstream findings that depended on none of them. Nineteen records
were lowered High→Medium to converge.

### Enforce a contract by projection, not by assertion

Consumption profiles are enforced by returning each consumed record restricted to
the fields its profile names. A field the profile does not grant is *absent*, so
an accidental dependency is a `TypeError` rather than a review finding. Asserting
the same property in a test would only catch it after it was written.

### Enforcing a duty is not the same as witnessing it

The producer discharged STD-0011 R-30 perfectly and left no trace of having done
so. A lineage reference carried identity, version, revision, digest and dependent
records, and nothing naming the profile evaluated against; nor was it derivable,
because one producer identity spanned three consumer roles. STD-0008 R-59 now
records it. Before adding a member, check whether an existing one already carries
the fact — STD-0010 R-27 looked like it did and does not, because it declares
what a consumer reads, never which profile a given consumption used.

### Placing an obligation on the wrong object breaks the corpus

Required-input mapping looked like an artifact-type property. Declaring it on the
type would have asserted of every producer what is true of one, and — because it
can make a conforming `Complete` instance non-conforming — would have forced a
MAJOR bump on four types, changing `type_version` in the envelope and breaking
byte-identity across all three committed runs. Locating it on the producer's
`produces` entry removes the consequence entirely. Ask which object the fact is
*about* before asking where it is convenient to put it.

### The infimum of the empty set is the top, not the bottom

STD-0007 R-29/R-30 define an aggregate as the minimum over the conclusions
aggregated. Applied literally to an empty set over a bounded lattice that yields
`Verified`/`High` — the maximally overstating answer, reached by correct
reasoning from the current text. Three producers independently chose the bottom.
A silence that a careful reader resolves the wrong way is worth a rule.

### Validate each commit at the state in which it lands, not in the working tree

`git worktree add --detach <hash>` into a temp directory, run the suite there,
remove it. The working tree contains later commits' files and will pass for the
wrong reason. Splitting `DOCUMENT_INDEX.md` across three commits needs the same
discipline: restore the HEAD version, apply only that commit's rows, commit, then
restore the final file forward.
