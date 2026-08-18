# Checkpointed Development Method

> Bundled from the Omakase project's `docs/checkpoint-method.md`. The `omakase-*` skill names in this document refer to the skills in this repository. Adapt the examples to your own project's boundaries, validation, and commit policy.

## Purpose

Omakase should be built with the same incremental discipline that produced the stable prototype.

The goal is not to design a perfect architecture in one pass. The goal is to reach a sequence of small, runnable, user-testable states and lock each one as a non-regressive baseline.

## Core rule

Every development slice must end in a state the user can launch and test.

If the user cannot run it, interact with it, and decide whether it is stable, the slice is too large or too abstract.

User testing proves the requested trajectory. It does not prove every crossed lifecycle, ordering, recovery, or authority invariant. Use proportionate automated evidence for those invariants.

Checkpointing is about **testable coherence**, not making every code diff as tiny as possible. A checkpoint may include several low-risk changes when they belong to one behavior family and can be validated together in one clear manual pass.

## Checkpoint loop

Use project skills for repeated operations:

- `omakase-session-orient` before choosing docs/source context and the lightest process route.
- `omakase-wayfinder` when a large destination is too unclear for a coherent plan.
- `omakase-cross-seam-plan` when a clear change spans several seams or checkpoints.
- `omakase-architecture-radar` when structural pressure exists but no refactor target is proven.
- `omakase-checkpoint-map` when roadmap/workstream routing changes.
- `omakase-checkpoint-closeout` when a checkpoint is accepted.
- `omakase-session-handoff` when work pauses before accepted closeout.

These routes are optional. Skip planning or survey steps when one runnable checkpoint is already clear. See [`planning-and-architecture-routing.md`](planning-and-architecture-routing.md) for entry and stop signals.

```txt
Orient through checkpoint map
  -> resolve decision fog or cross-seam planning only when needed
  -> define coherent testable state
  -> lock scope
  -> implement narrowly
  -> typecheck/build
  -> user launches/tests
  -> fix until stable
  -> commit                     (commit FIRST)
  -> update docs/devlog with the real commit SHA(s)
  -> promote checkpoint to baseline
```

### Commit-first-then-log (workflow contract)

Logging references the commit, not the other way around. Order is fixed:

1. User confirms the checkpoint works.
2. **Commit the checkpoint before writing the devlog.**
3. Capture the real `git` short SHA(s) from the commit(s) you just made.
4. Write/fill the devlog and set its `commit` / `commits:` fields to those real SHAs — never a hypothetical, pending, or invented tag. "I'll commit after" is not a tag; the tag is captured from the commit that exists.
5. Commit the devlog/traceability update as its own follow-up commit (or fold it into the next doc commit).
6. Only then move on to the next checkpoint.

Why the order is fixed: a devlog written before the commit either invents a SHA (drift) or records `commit: none`, then never gets updated. Committing first guarantees the log carries a live tag traceable in both directions (commit ↔ log). The devlog `commits:` array is the source of truth for which commits belong to a checkpoint; `commit:` is the session-closing SHA (the last commit, or the most representative).

If a commit genuinely cannot be made yet (e.g. waiting on a dependency, mid-debug), keep the devlog `status: planned | user-testing` and `commit: none` until the commit lands. Do **not** fill a placeholder SHA.

## What counts as a good checkpoint

A good checkpoint is:

- small enough to reason about,
- cohesive around one behavior family or architecture seam,
- runnable by the user,
- testable through normal app interaction,
- non-regressive against previous accepted checkpoints,
- coherent across the meaningful states and transitions that it changes,
- documented enough for the next session to continue without re-planning.

Prefer one coherent checkpoint over several microscopic checkpoints when:

- the changes share the same user-facing workflow,
- the same manual test pass validates all of them,
- failure can still be isolated or reverted quickly,
- no new architectural layer is being bundled in blindly.

Example: route all block-editor modal buttons through commands in one checkpoint, rather than separate checkpoints for Save, Cancel, and Close.

## What does not count

Avoid checkpoints that are only:

- abstract architecture diagrams,
- large internal rewrites with no visible behavior,
- unrelated or strongly coupled features that cannot be tested independently,
- “almost working” states that cannot be tested,
- changes that require trusting the code without launching the app.

## V2 checkpoint style

Because v2 is a migration toward a programmable editor core, architectural work must still be sliced into interactive checkpoints.

Example bad checkpoint:

```txt
Rewrite renderer into new architecture.
```

Example good checkpoints:

```txt
CP1: App launches from v2 tree with identical daily-note typing/save/reopen behavior.
CP2: Editor helper functions delegate to EditorPort with no visible behavior change.
CP3: CursorContext powers current-line detection for Enter/Sushi with no behavior change.
CP4: Image insertion uses DocumentOperation while producing identical markdown and save behavior.
CP5: Block editor save uses DocumentOperation while preserving table/math modal behavior.
```

## Coherent-testable-state heuristic

For any proposed task, ask:

1. What can the user do after this change that proves it works?
2. What exact previous behavior must still work?
3. Can this be validated in under 10 minutes?
4. Can we revert or isolate it if it fails?
5. Do the proposed changes belong to the same behavior family or architecture seam?
6. Would splitting smaller create more process overhead than safety?

Choose the smallest **coherent** slice, not the smallest imaginable diff. Split when risk, coupling, or validation complexity rises. Bundle when the behavior is naturally tested together.

## Closure for stateful checkpoints

Use this pass when a checkpoint changes async, durable, lifecycle, process, external, or derived state:

1. Name the authority and the important state or transition that changed.
2. State the invariant that must survive the transition.
3. Check whether work can stop halfway or become stale.
4. Define what re-entry observes.
5. Prefer a simpler structure when it can remove an incoherent state.
6. Record the observed evidence for the claimed behavior.

Do not enumerate every imaginable state. Focus on states that are plausible, consequential, and changed by the checkpoint. Distinguish exercised proof, reasoned but unexercised risk, and remaining manual proof in the existing validation or devlog fields.

## Regression baseline

Until v2 supersedes the prototype, each checkpoint should preserve the relevant current prototype behavior.

Core regression checks:

- launch app,
- opens today/last note,
- type freely,
- undo/redo,
- autosave,
- close/reopen continuity,
- note switch/create/rename/delete when in scope,
- image insertion when in scope,
- table/math block editing when in scope,
- `@sushi` invocation when in scope.

## Checkpoint status labels

Use these labels in devlogs:

- `planned` — scoped but not started
- `implemented` — code done, not user-tested
- `user-testing` — ready for user launch/test
- `stable` — user accepted; can become baseline
- `blocked` — cannot proceed without decision/fix
- `regressed` — previously stable behavior broke; restore before new work

## Commit rule

Commit only after a checkpoint is stable or after a clearly useful planning/docs checkpoint.

Default acceptance workflow (see also the **Commit-first-then-log** contract in the Checkpoint loop above — this restates it):

1. User confirms the checkpoint works.
2. **Commit the accepted checkpoint first**, with a relevant message.
3. Capture the real commit SHA(s) from the commit(s).
4. Update the devlog: mark the checkpoint `stable`, record user-tested results, and fill `commit` / `commits:` with the real SHAs from step 3.
5. Commit the traceability/devlog update.
6. Only then move on to the next checkpoint.

Commit message style:

```txt
chore(v2): add checkpointed migration plan
feat(core): add editor port scaffold
refactor(editor): route image insertion through document operation
```

## Devlog rule

Every session gets a devlog, but devlog size should be proportional to checkpoint risk.

Use a compact devlog for small/medium behavior-preserving checkpoints. It must capture:

- checkpoint ID/name,
- scope and files touched,
- behavior changed and intentionally unchanged,
- validation commands,
- manual test checklist and user results if available,
- commit traceability when committed,
- next action.

When the user accepts a checkpoint, do not wait for a separate instruction to commit unless they explicitly ask not to. **Commit first, then update traceability** (see the Commit-first-then-log contract above), and move on only after.

Use the expanded handoff sections only for risky, architectural, blocked, regressed, or multi-session checkpoints. Avoid 100+ line devlogs for tiny diffs unless the context is genuinely complex.

## Architectural migration guardrail

Do not introduce Lua, deeper AI, extension APIs, or plugin packaging until the document-operation core is stable enough to be scripted safely.

Required before Lua:

1. `EditorPort`
2. `CursorContext`
3. `DocumentOperation`
4. `EditorTransaction`
5. `CommandRegistry`
6. `KeymapRegistry`

Required before deeper AI edits:

1. document operation previews,
2. stale cursor-context detection,
3. undo grouping for generated edits,
4. active-note edits routed through document operations.
