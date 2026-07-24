---
name: omakase-session-handoff
description: "Handoff an Omakase session that is planned, user-testing, blocked, exploratory, or uncommitted. Use at session end when accepted closeout is not appropriate."
---

# Omakase Session Handoff

Leave a truthful continuation trace without closing an unaccepted checkpoint.

## Steps

1. **Classify state.** Inspect `git status --short` and choose `planned`, `user-testing`, `blocked`, `stable` uncommitted, or `closed` no-op.
   - Done when the status does not imply false acceptance.
2. **Choose devlog path.** Use `.devlog/YYYY-MM-DD.md` or next `.devlog/YYYY-MM-DD-sNN.md`.
   - Done when the path is unique or the intended existing log is selected.
3. **Write the handoff.** Include goal/scope, files touched, changes, validation, user result if any, known issues, next action, and commit traceability.
   - Done when the next agent can resume without guessing.
4. **Keep traceability honest.** If no commit exists, set `commit: none`, `commits: []`, and `commit_match_confidence: 0.00`.
   - Done when no placeholder SHA remains.
5. **Update map if routing changed.** Use `omakase-checkpoint-map` only when current state, next action, or docs/code entry changed.
   - Done when the map is either updated or explicitly unnecessary.
6. **Report handoff.**
   - Done when output names the devlog, status, validation, commit state, and next action.

## Frontmatter minimum

```yaml
---
date: YYYY-MM-DD
session: NN
project: omakase-v2
phase: <area>
checkpoint: <name>
status: planned | user-testing | blocked | stable | closed
focus: <one line>
worked_on: <one line>
contracts_touched:
  - <paths>
drift_status: none | contained | needs-follow-up
commit: none
commits: []
commit_match_confidence: 0.00
commit_match_notes: "No commit yet; session handoff only."
session_outcome: pending | blocked | closed
next_files:
  - <paths>
handoff_ready: true
---
```

## Safety

Do not invent SHAs, mark unaccepted work accepted, or hide failed validation.

## Output

```md
Session handoff written.

- Devlog: `<path>`
- Status: <status>
- Validation: <commands/results>
- Commit: none / <sha>
- Next action: <next>
```
