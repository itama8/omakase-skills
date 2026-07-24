---
name: omakase-checkpoint-closeout
description: "Closeout an accepted Omakase checkpoint: validate, commit accepted scope first, then write devlog/checkpoint-map updates with real SHA(s). Use when the user says it works, accepts, or asks to commit/close."
---

# Omakase Checkpoint Closeout

Close an accepted checkpoint with real commit traceability: **commit first, then log**.

## Steps

1. **Confirm acceptance.** Proceed only when the user accepted the checkpoint or explicitly asked to commit/close it.
   - Done when acceptance is explicit; otherwise use `omakase-session-handoff`.
2. **Scope.** Run `git status --short` and separate accepted changes from unrelated working-tree changes.
   - Done when the commit path list is known; ask if unrelated changes would be included.
3. **Validate.** Run the appropriate checks; default is `npm run typecheck`, add build/targeted tests for risky changes.
   - Done when validation passes or closeout stops on failure.
4. **Pre-commit docs.** Update docs/checkpoint map that must be true before commit, but do not write hypothetical SHAs.
   - Done when docs describe the accepted state and contain no fake commit tags.
5. **Commit implementation/docs scope.** Commit only accepted paths.
   - Done when `git rev-parse HEAD` returns the implementation/docs commit SHA.
6. **Log.** Update the relevant devlog with real SHA(s), validation, user result, known issues, and next action.
   - Done when `commit:` / `commits:` contain existing SHA(s).
7. **Commit devlog.** Commit the traceability update separately unless instructed otherwise.
   - Done when the devlog commit SHA exists.
8. **Report closeout.**
   - Done when final output includes commits, validation, devlog path, map status, and next action.

## Safety

Never invent SHAs. Never mark unaccepted work accepted. Never commit unrelated changes without approval. Stop on failed validation.

## Output

```md
Checkpoint closed.

- Checkpoint: <name>
- Validation: <commands>
- Implementation commit: `<sha>`
- Devlog commit: `<sha>`
- Devlog: `<path>`
- Checkpoint map: <updated/not needed>
- Next: <next action>
```
