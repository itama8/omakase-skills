# Devlog Template

> Bundled from the Omakase project's `.devlog/TEMPLATE.md`. The `status` labels match [`checkpoint-method.md`](checkpoint-method.md). The frontmatter is Omakase's full traceability rig: `commit_match_confidence`, `commit_match_notes`, `contracts_touched`, and `drift_status` exist to audit commit-to-log mapping. Trim them if your workflow does not need SHA-level audit. Fill in `<project-name>` and `<phase-name>`, then delete placeholder sections you do not use.

```
---
date: YYYY-MM-DD
session: NN
project: <project-name>
phase: <phase-name>
checkpoint: CPX-name # e.g. CP12-block-editor-commands
status: planned # planned | implemented | user-testing | stable | blocked | regressed
focus: short summary
worked_on: concise statement of what changed
contracts_touched: []
drift_status: none # none | detected | resolved
commit: none # none | made or short SHA
commits: [] # git short SHAs; empty if no commit yet
commit_match_confidence: 0.00
commit_match_notes: ""
session_outcome: open # open | closed
next_files: []
handoff_ready: false
---

# Devlog — YYYY-MM-DD (Session NN)

## Checkpoint
- Goal:
- Scope:
- Out of scope:

## Changes
- Files touched:
- Behavior changed:
- Behavior intentionally unchanged:
- Decisions:

## Validation
- [ ] `npm run typecheck`
- [ ] `npm run build`
- Manual checks:
  - [ ] app launches
  - [ ] checkpoint-specific behavior:
  - [ ] relevant regression checks:
- User result:

## Status / next
- Status: `planned | implemented | user-testing | stable | blocked | regressed`
- Known issues:
- Next action:
- Next files/functions:

## Commit traceability
- Candidate commits:
  - `<sha> <subject>`
- Selected commits:
  - `<sha>`
- Rationale:

---

## Expanded handoff sections (use only when needed)

Use these sections for risky, architectural, blocked, regressed, or multi-session checkpoints. For small behavior-preserving checkpoints, the compact sections above are enough.

### Evidence / screenshots
- **ID:** `SS-YYYY-MM-DD-SNN-001`
  - **Path:** `.devlog/screenshots/<filename>.png`
  - **Context:** what this proves/why it matters

### Detailed next-session implementation checklist
1. First file(s) to inspect/edit:
   - `path/to/file`
2. First function/module(s) to touch:
   - `functionOrModuleName`
3. Ordered execution steps:
   - Step A:
   - Step B:
   - Step C:
4. Validation commands:
   - `npm run typecheck`
   - `npm run build`
5. Interactive checks before handoff:
   - 

```
