---
name: omakase-implement
description: "Implement any Omakase feature, bug fix, behavioral change, refactor, or test-backed code change. Use before the first code edit to scale engineering rigor to risk: keep routine changes light, trace behavioral changes, and fully design changes crossing editor mutation, Undo, persistence, authority, security, or durable interfaces."
---

# Omakase Implement

**Protect contracts; explore solutions.**

Scale rigor to the boundary crossed by the change. Safety and stable interfaces are constraints. Removal, reuse, native capabilities, locality, and small diffs are heuristics—not quotas.

The named checkpoint is the scope. Otherwise use the current task and its matching checkpoint-map row. Never absorb unrelated working-tree changes, and never commit; accepted closeout owns commits.

## 1. Route by risk

Classify by the highest boundary crossed:

- **Routine** — local copy or presentation, docs, a straightforward test, or an isolated correction with no durable state or interface impact.
- **Behavioral** — user-visible behavior, commands, editor interaction, focus/selection, lifecycle, shared feature logic, or a bug with sibling callers.
- **Structural/high-risk** — document mutation, Undo/history, persistence, preload/IPC/main authority, security, public commands/interfaces, dependencies, migrations, or module/seam extraction.
- **Experimental** — explicitly isolated prototype or research-lab work that is not production architecture.

When uncertain, move up one level. State the route and the concrete trigger before editing; this is a classification, not an architecture essay.

Done when the route follows the boundary crossed rather than the apparent size of the diff.

## 2. Pin the change

If several load-bearing decisions prevent one checkpoint from being pinned, stop before coding. Recommend `omakase-cross-seam-plan`, or `omakase-wayfinder` when the decisions are still too unclear to plan. Do not disguise unresolved planning as implementation.

For every route, identify:

- behavior being added, fixed, or preserved;
- code actually responsible;
- narrowest useful automated or manual proof;
- unrelated paths that remain untouched.

For behavioral and structural work, also state explicit non-goals and accepted invariants crossed. Inspect `git status`, the matching checkpoint-map row, and only its needed plan/devlog and code entry points.

Done when the intended outcome and proof can be stated without prescribing the implementation.

## 3. Understand before choosing

Trace only as far as the route requires:

- **Routine:** inspect the immediate path and its existing convention.
- **Behavioral:** trace the relevant path, real callers, sibling behavior, cleanup/error paths, and tests that claim the behavior.
- **Structural/high-risk:** trace the complete interface, lifecycle, authority, mutation, failure, and validation path end to end.
- **Experimental:** identify the production boundary the experiment must not cross and how the experiment can be deleted.

For a bug, treat the report as a symptom. Find the shared root cause before patching a named caller; do not duplicate guards across sibling paths when one owning fix exists.

Done when the proposed edit sits at the behavior's owner rather than merely where the symptom appears.

## 4. Choose proportionately

Consider, in order:

1. remove behavior or code the checkpoint does not need;
2. reuse an existing Omakase command, operation, capability, controller, projection, security rule, or established local pattern;
3. use TypeScript/Node, Electron, Chromium/CSS, or CodeMirror 6 directly when it preserves the contract more clearly;
4. keep one-checkpoint glue local rather than creating a public abstraction;
5. introduce new structure when it hides real policy, volatile mechanics, repeated complexity, or an authority crossing.

This is a preference order, not a command to stop thinking. Prefer the simplest solution that preserves the contract and leaves the design clearer. A larger or novel design is valid when its added interface burden is justified and it improves correct-use defaults, leverage, or locality.

For consequential behavioral choices, compare genuinely different approaches before selecting one. For structural/high-risk work, read [`MODULES-AND-SEAMS.md`](../omakase-refine/MODULES-AND-SEAMS.md) and apply its module-earning and design-it-twice gates before the first structural edit. Routine work does not pay this cost.

Done when the chosen shape is justified by present behavior and boundaries, not hypothetical flexibility or raw line count.

## 5. Build in green steps

- Run the narrow baseline before behavioral or structural edits when practical.
- Make one coherent behavior slice at a time.
- Keep accepted behavior green after each slice.
- Test observable outcomes through the surviving interface; do not mirror private implementation structure.
- Run `npm run typecheck` for TypeScript changes, plus the narrowest relevant contract. Add broader tests, an Electron probe, or manual validation according to the boundary crossed.
- If the baseline is red, distinguish pre-existing failure from new failure before continuing.

Experimental work may take bounded shortcuts and duplicate locally for learning, but it must stay outside production mutation/authority paths. Promotion into production is a separate checkpoint using the appropriate route.

Done when the requested behavior works at the highest useful seam and every crossed invariant has proportionate proof.

## 6. Inspect the result

Before reporting completion, verify:

- the diff still matches the pinned behavior and non-goals;
- no unrelated worktree changes were overwritten or absorbed;
- no speculative interface, dependency, command, configuration, or planning prose entered;
- necessary complexity remains where it protects policy or an invariant;
- automation and remaining manual proof are reported honestly.

Do not perform cleanup merely to make the diff smaller. Do not manufacture a module to make the design look intentional.

Done when the result is coherent, bounded, and ready for user testing or accepted-checkpoint closeout.

## Output

Keep implementation routing compact:

```md
## Implementation route
- Risk: <routine / behavioral / structural-high-risk / experimental> — <trigger>
- Contract: <behavior and key invariant>
- Approach: <chosen shape and consequential alternative, if any>
- Proof: <checks/manual validation>
```
