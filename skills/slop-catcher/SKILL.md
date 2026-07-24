---
name: slop-catcher
description: "Catch slop in an Omakase feature, checkpoint, or source slice. Use when the user asks if an implementation is clean, mentions hacks/fragility/architecture drift, or wants a core-vs-extension review."
---

# Slop Catcher

Catch implementation slop: local hacks, fragile workarounds, unclear ownership, and drift away from Omakase's stable-core/extensible-feature model.

This is a review skill. Do not rewrite code unless the user asks for remediation.

## Steps

1. **Scope tightly.** Infer the target from the prompt; ask one question only if file/feature/checkpoint scope is ambiguous.
   - Done when the review target and depth (`quick`, `normal`, `deep`) are known.
2. **Orient minimally.** Use `omakase-session-orient` or the checkpoint-map row when helpful. Read only target docs/devlogs/source files.
   - Done when the expected contract is known without bulk-loading plans.
3. **Map ownership.** Identify which parts are core primitives/API, commands/keymaps, UI/feature code, extension/tutorial code, and Sushi/AI path.
   - Done when boundary violations can be named against that map.
4. **Inspect for slop.** Look for direct internal mutation, duplicated hidden rules, timing/global-state coupling, brittle parsing, undo/persistence/cursor inconsistency, ad-hoc special cases, or comments like `HACK`, `temporary`, `for now`.
   - Done when findings have file/function evidence or are discarded.
5. **Rank severity.** Use Blocker/High/Medium/Low/Observation and state why.
   - Done when each finding has impact and trigger condition.
6. **Recommend a checkpoint.** Suggest the smallest coherent fix, doc action, or accepted-debt note.
   - Done when the next action is testable or explicitly deferred.

## Severity

- **Blocker** — threatens note safety, undo/redo trust, or core integrity.
- **High** — architectural drift or hard coupling likely to compound.
- **Medium** — contained fragility/duplication worth scheduling.
- **Low** — readability or local polish.
- **Observation** — useful signal, not necessarily wrong.

## Output

```md
# Slop Catcher Summary: <target>

## Verdict
<Clean / Mostly clean / Sloppy but contained / Architecture drift / Unsafe>

## Findings
1. <severity> — <finding> — <why it matters> — `<file/function>`

## Core vs extension assessment
<short boundary assessment>

## Recommended next actions
1. <smallest coherent action>

## Deferred / acceptable debt
- <if any>
```

Do not update devlogs unless the review becomes part of an accepted checkpoint.
