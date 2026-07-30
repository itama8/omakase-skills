# Planning and Architecture Routing

## Purpose

Use the lightest process that fits the current uncertainty. These routes are defaults, not a required pipeline.

## Routing states

| Current state | Use | Stop when |
|---|---|---|
| The destination is large and the route is unclear | `omakase-wayfinder` | The load-bearing decisions are resolved and runnable checkpoints can be planned |
| The destination is clear but spans several seams or checkpoints | `omakase-cross-seam-plan` | A durable plan and its first runnable checkpoint exist |
| The codebase feels structurally expensive, but no target is proven | `omakase-architecture-radar` | Ranked candidates or a no-action result exist |
| One runnable checkpoint is pinned | `omakase-implement` | The behavior and its proof are ready for user testing or review |
| One diff, checkpoint, or extraction needs review | `omakase-refine` | The scoped result is ready or its blockers are clear |
| One feature or source slice may contain local hacks or drift | `slop-catcher` | The scoped findings and smallest next action are clear |

## Common routes

```txt
Foggy destination
  -> wayfinder
  -> cross-seam plan
  -> checkpoint map
  -> implement
  -> refine when warranted
  -> closeout

Unproven architecture concern
  -> architecture radar
  -> refine for one bounded extraction
     OR cross-seam plan for a broad or cross-authority change
  -> implement
```

Reassess after each step. Skip a step when its entry condition is absent. Return to Wayfinder when planning exposes a load-bearing decision that the current session cannot settle safely.

## Ownership rules

- Wayfinder records decisions before a build plan exists. It does not track implementation.
- Cross-seam planning defines the route and vertical checkpoints. It does not write production code.
- The checkpoint map records durable workstream state and the next checkpoint. It does not store decision detail.
- Architecture Radar finds candidates. It does not edit code or design a selected interface.
- Implementation owns one selected checkpoint.
- Refinement owns one existing diff, checkpoint, or extraction target.
- Slop Catcher owns local implementation drift. Repeated findings can become Radar evidence.

## Handoff rule

A skill can recommend a next route, but a recommendation is not an automatic command. State the routing signal, confirm that the next skill is still the lightest sufficient process, and preserve user control before durable planning or code edits.

## Extension pressure

Treat Sushi and extensions as possible consumers during cross-seam planning. Classify each consumer as use now, compatibility seed, deferred adapter, or not a consumer.

Future use can shape semantic names and ownership. It does not justify a public interface by itself. Split out an extension-specific process only after real profile extensions produce a repeated host or capability workflow.
