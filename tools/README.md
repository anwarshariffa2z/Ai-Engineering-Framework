# Framework Tools

Executable implementations of the framework standards. Nothing here is a framework document: these are tools, and they carry no identifier and no registry entry.

## Reference Validator

The reference validator is the executable implementation of STD-0012. It establishes whether the repository conforms to the requirements the standards declare.

```
node tools/validator/index.mjs [repository-root]
```

It exits non-zero when any blocking requirement fails, so it can gate a pipeline directly.

### What it knows

Nothing about any individual document. The validator reads:

- the corpus, by walking the configured roots;
- the requirement set, from the `requirements` declarations of every document that carries them, which STD-0010 R-16 permits only for standards;
- the normativity of each section, from each document's `normativity` map;
- the controlled vocabularies, from configuration that mirrors the vocabularies the standards declare closed;
- the registry, from the document carrying the configured registry identifier.

The only document-specific value in the entire tool is that registry identifier, in `validator/framework.config.json`. Everything else is derived from metadata.

### How checks bind

Every check binds to exactly one requirement address of the form `STANDARD#R-nn`, per STD-0012 R-01. A check bound to an address no standard declares is itself a failure, reported under `STD-0012#R-01`.

A requirement with no bound check is never assumed to pass. It is reported `not-evaluated` with the reason it was not evaluated, per STD-0012 R-06 and R-26.

### Outcomes

`pass`, `warn`, `fail`, and `not-evaluated`, per STD-0012 R-25. The subject outcome is `fail` if any check failed, `warn` if any warned, and `pass` only when every applicable check was evaluated and passed.

Judgment-classified requirements are routed to human review and reported `not-evaluated`. The validator does not attempt to decide them, and does not report them as passing.

### Outputs

Written to `validation/`, which is not tracked. Each carries generator provenance per STD-0010 R-31 and R-32.

| File | Content |
| --- | --- |
| `validation-artifact.json` | The structured result: an envelope and one record per check |
| `validation-report.md` | Outcome, coverage, failures, warnings, unenforceable obligations |
| `registry-report.md` | Registry agreement, absent documents, orphaned rows, disagreements |
| `traceability-report.md` | Requirements per standard, with the count bound to a check |
| `requirement-report.md` | Every requirement with its level, class, severity, scope, and outcome |

The report views are generated from the artifact, per STD-0012 R-37. They are never hand-edited.

### Limits

The validator cannot enforce an obligation that carries no requirement identifier. STD-0001 and STD-0002 predate ADR-0002 and declare no requirements, so the obligations they state — including registry agreement on version and status — are reported as unenforceable rather than checked. The registry report shows those disagreements for information, and marks them as unbound.
