---
name: omakase-refine
description: "Review or refine an active Omakase checkpoint. Use when the user asks for code review, cleanup, simplification, module extraction, seam design, or a pre-acceptance refinement pass. Combines lean implementation with deep-module design while protecting Omakase's editor, authority, and checkpoint contracts."
---

# Omakase Refine

Review an existing checkpoint for whether it stayed **lean and deep** after implementation: no more code or interface than the behavior needs, with necessary complexity concentrated behind interfaces that earn their keep. New implementation should use `omakase-implement` so these decisions happen before the first edit.

This is not code golf and not a generic architecture audit. A smaller diff is worse if it weakens the checkpoint contract. A larger or novel design is not a defect when its interface burden is justified; a new module is worse only when it moves code behind a second name without adding leverage or locality.

## Modes

Infer the mode from the request:

- **Review** — inspect and report; default when the user says review, assess, or look over.
- **Refine** — inspect, edit, and validate; use when the user says refine, clean up, simplify, fix, or apply.

The current working-tree diff is the default scope. A named file, feature, commit range, or checkpoint overrides it. Never absorb unrelated worktree changes.

## Process

### 1. Pin the checkpoint

Inspect `git status`, the scoped diff, and the matching row in `docs/plans/checkpoint-map.md`. Read only that row's current plan/devlog and code entry points.

State:

- user-visible behavior being added or preserved;
- explicit non-goals;
- accepted invariants that the change crosses;
- the narrowest existing automated and manual validation seams.

Done when every reviewed path is in scope and the contract can be stated without implementation detail.

### 2. Trace the real behavior

Follow each changed behavior end to end. Depending on the feature, this may include:

`DOM/keymap → command → feature module → preload/IPC → main authority`

or

`caller → capability → document operation → transaction → history/persistence`.

Read callers, sibling paths, cleanup/error paths, and the tests that claim the behavior. Do not judge an isolated helper before seeing how it is used.

Done when every changed behavior, interface, authority crossing, and ownership handoff is accounted for.

### 3. Run the contract pass

Review independently of code shape:

- Does the diff implement the checkpoint rather than a nearby interpretation?
- Is requested behavior missing, partial, or incorrect?
- Did scope creep enter from later checkpoints?
- Are note safety, Undo, cursor/selection, typing responsiveness, cleanup, cancellation, focus, accessibility, security, or error recovery weakened?
- Do docs and tests assert the durable behavior, or merely mirror current implementation text?

Contract failures outrank simplification. Do not polish code that is implementing the wrong thing.

### 4. Run the lean pass

Apply this ladder in order:

1. **Remove** behavior or code outside the checkpoint, speculative flexibility, duplication, dead state, and explanatory sediment.
2. **Reuse** an existing Omakase command, operation, capability, store, controller, projection, security rule, or naming convention.
3. **Go native** with TypeScript/Node, Electron, Chromium/CSS, or CodeMirror 6 when it preserves the contract more reliably.
4. **Collapse** pass-through wrappers, parallel state, repeated error handling, and configuration with one value.
5. **Localize** one-checkpoint glue rather than promoting it into a public abstraction.
6. **Keep** complexity that owns policy, hides volatile mechanics, or protects an invariant.

Prefer deletion over addition and the smallest coherent behavior change over the fewest raw lines.

### 5. Run the depth pass

For each module or interface the diff creates or materially changes, ask:

- How much must a caller know, including ordering, invariants, errors, and lifecycle?
- What useful complexity does the implementation hide?
- Does deleting the module remove complexity, or scatter it back across callers?
- Does the seam represent real variation or authority, or only an imagined future?
- Do behavior and tests cross the same interface?
- Does the shape increase **leverage** for callers and **locality** for future fixes?

If a finding would create, remove, deepen, or relocate a module or seam, read [`docs/process/lean-deep-engineering.md`](../../../docs/process/lean-deep-engineering.md) before recommending or applying it. Do not redesign a durable public interface from the first plausible idea.

Done when every structural recommendation explains why the module earns more depth or why an abstraction does not earn existence.

### 6. Report before editing

Every finding must cite concrete code and a reachable consequence. Omit taste, line-count complaints, and speculative future benefits.

Format:

`<severity> · <contract|lean|depth> · <path>:<function/line> — <evidence> — <smallest safe refinement> — <proof>`

Use `Blocker`, `High`, `Medium`, or `Low`. Keep the contract, lean, and depth findings in separate sections so one lens cannot hide another.

In **Review** mode, stop after the report.

### 7. Refine in green steps

In **Refine** mode:

1. Run the narrow baseline check before editing when practical.
2. Fix contract/safety findings first.
3. Apply independent lean reductions next.
4. Apply module/seam changes only after their interface shape and test seam are justified.
5. Keep each refactor behavior-preserving and rerun the narrow check after each coherent step.
6. Do not rewrite unrelated code, rename public command IDs, or broaden the checkpoint as cleanup.

If the baseline is red, distinguish pre-existing failure from your changes before continuing.

### 8. Prove at the highest useful seam

Prefer an existing behavior contract through the module interface. Tests should survive internal refactoring and verify known outcomes, not recompute the implementation or assert private call structure. Use source-shape checks only when the contract is genuinely structural and cannot be exercised more directly.

Run the narrowest relevant contract, then `npm run typecheck`. Add build, `npm test`, an Electron probe, or a manual pass according to the crossed boundary. Report anything automation cannot prove.

## Omakase guardrails

- Priority remains note integrity → typing responsiveness → Undo trust → stable editor/document interfaces → process authority → extensibility → AI depth.
- Renderer has no Node/filesystem authority; main validates durable effects; preload exposes narrow typed capabilities rather than generic dispatch or Electron objects.
- Durable editor mutations cross document operations and transaction semantics. Direct CM6 work is acceptable for editor-owned transient projection, not hidden persistence.
- Public behavior is command-addressable. Private presentation details do not need commands.
- A shared capability needs multiple real callers or a brokered authority reason. Future callers alone do not justify it.
- Sushi, scripts, and extensions consume bounded interfaces and never become mutation authority.
- CSS owns local presentation; TypeScript owns behavior and state.
- `renderer.ts` and `main.ts` are integration modules. Their size alone is not a defect; extract only a coherent behavior family with a stronger interface and validation seam.
- Durable architecture belongs in current docs. Do not add planning prose to make weak code look intentional.

## Output

```md
# Omakase refinement: <scope>

## Verdict
<ready / refine first / unsafe>

## Contract
<findings or "No contract drift found.">

## Lean
<safe reductions or "No worthwhile reduction found.">

## Depth
<module/seam findings or "No structural change justified.">

## Preserve
<necessary complexity and invariants that should remain>

## Refinement sequence
<ordered edits, or "None.">

## Validation
<checks run and remaining manual proof>
```

If the checkpoint is already lean and deep, say so. Do not manufacture a refactor to justify the skill.
