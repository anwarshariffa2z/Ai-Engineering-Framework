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
