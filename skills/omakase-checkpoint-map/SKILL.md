---
name: omakase-checkpoint-map
description: "Map Omakase durable workstreams in docs/plans/checkpoint-map.md. Use when current state, next action, docs/code routing, active/backlog status, or a new durable workstream changes."
---

# Omakase Checkpoint Map

Maintain `docs/plans/checkpoint-map.md` as the compact routing ledger. It is not a devlog; it tells the next agent where a task sits and what to read first.

## Steps

1. **Classify.** Decide whether the task updates an existing durable workstream or creates one.
   - Done when every changed behavior/plan is assigned to one existing row or one new row.
2. **Apply the durable row test.** Create a row only for a product surface, architecture seam, multi-checkpoint plan, or recurring reliability/security/process area.
   - Done when one-off bugs/copy tweaks are excluded from row creation.
3. **Edit the map.** Update only affected row(s): status, current state, last checkpoint, next checkpoint, read-first docs, and code entry.
   - Done when a future agent can start from the row without reading unrelated docs.
4. **Sync indexes if classification changed.** Update `docs/plans/plan-index.md` for active/backlog/historical movement; update feature/current-app docs only when user-visible state changed.
   - Done when the map and indexes no longer disagree.
5. **Record routing change.** Mention map changes in the devlog or closeout summary.
   - Done when traceability names the row(s) touched.

## Status values

- `active` — planned or in implementation.
- `next` — likely near-term, not started.
- `user-testing` — implemented, awaiting acceptance.
- `landed-watch` — landed, monitor/polish/backlog remains.
- `stable` — accepted baseline, no immediate follow-up.
- `backlog` — preserved future idea.
- `historical` — provenance only.

## Row format

```md
| Workstream | Status | Current state | Last checkpoint | Next checkpoint | Read first | Code entry |
```

Keep cells short; link out for detail.

## Output

```md
Checkpoint map updated:
- Row: <workstream>
- Status: <old> -> <new>
- Next checkpoint: <summary>
- Routing changed: <docs/code changes>
```
