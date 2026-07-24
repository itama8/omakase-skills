---
name: omakase-session-orient
description: "Orient an Omakase session through checkpoint-map routing. Use at task/session start, when workstream context is unclear, or before implementation to avoid bulk-reading docs."
---

# Omakase Session Orient

Orient the session through the checkpoint map before reading deeper docs or code.

## Steps

1. **Start tight.** Do not reread `AGENTS.md` unless asked. Read `AGENTS-README.md` only if the docs spine is not already known.
   - Done when no broad docs have been loaded.
2. **Route.** Read `docs/plans/checkpoint-map.md` and match the task to one row by workstream, state, next checkpoint, docs, or code entry.
   - Done when there is one matched row or an explicit unmatched decision.
3. **Load only row context.** For a matched row, read only its `Read first` docs/devlogs and inspect only needed code entry points.
   - Done when the checkpoint can be stated without opening unrelated plans.
4. **Handle misses.** If no row fits, check `docs/plans/plan-index.md`, `docs/features/feature-surface-index.md`, and recent devlog headings. If the task is durable, invoke `omakase-checkpoint-map`; otherwise treat it as a one-off under the nearest row or devlog only.
   - Done when the map action is `none`, `update row`, or `create row`.
5. **Report orientation before coding.**
   - Done when the summary below is complete.

## Durable row test

Create/propose a row only for a durable product surface, architecture seam, multi-checkpoint plan, or recurring reliability/process area. Do not create rows for one-off bugs, copy tweaks, or implementation details under an existing row.

## Output

```md
## Session orientation

- Workstream: <row or proposed row>
- Status: <status>
- Checkpoint goal: <small runnable state>
- Read first: <docs/devlogs>
- Code entry: <files/functions>
- Validation: <commands/manual checks>
- Checkpoint-map action: <none/update row/create row>
```
