---
name: omakase-cross-seam-plan
description: "Plan a clear Omakase feature or architecture change that spans multiple behavior, process, authority, source, Sushi, or extension seams. Use before implementation when one runnable checkpoint cannot represent the whole route. Produces a coherent vertical checkpoint plan without writing production code."
---

# Omakase Cross-Seam Plan

Turn a clear destination into a coherent multi-checkpoint plan. Plan the whole route, then hand one runnable checkpoint to implementation.

Use [`planning-and-architecture-routing.md`](../../references/planning-and-architecture-routing.md) for the shared routing rules. Use [`MODULES-AND-SEAMS.md`](../omakase-refine/MODULES-AND-SEAMS.md) when the plan creates or changes a durable interface.

## 1. Confirm planning readiness

State the product destination and the observable result. Identify the decisions already fixed by the user, accepted checkpoints, or architecture docs.

Route elsewhere when needed:

- Use `omakase-wayfinder` when load-bearing decisions are still too unclear to form a plan.
- Use direct checkpoint work when one runnable checkpoint can deliver the whole change safely.
- Use `omakase-architecture-radar` when the concern is general codebase health and no target is known.

Done when the destination is clear and a multi-checkpoint plan is the lightest sufficient route.

## 2. Trace the current path

Use session orientation and the matching checkpoint-map row. Read only the relevant plans, architecture contracts, devlogs, callers, and validation entry points.

Trace each applicable path end to end:

- cursor, selection, line, block, or current source to user-visible result
- command or UI intent to domain behavior
- renderer, preload, main, worker, or external authority crossings
- durable mutation through document operations, Undo, and persistence
- source identity, provenance, cache, and projection lifecycle
- Sushi or extension consumption through bounded interfaces
- cancellation, stale results, teardown, retry, and restart behavior

Done when the plan can name current owners, accepted invariants, and real integration points without bulk-reading unrelated subsystems.

## 3. Run the seam horizon scan

For each applicable lens, record current behavior, the planned effect, and the decision or non-goal.

| Lens | Question |
|---|---|
| Cursor-first product path | How does this improve work at the cursor or current source? |
| AI-disabled value | Is the capability independently useful without Sushi? |
| Commands | What public behavior units exist or change? |
| Document operations | Does durable mutation preserve Undo and persistence authority? |
| Process authority | Which process owns policy, I/O, validation, and lifecycle? |
| Sushi | Can Sushi use the same semantic behavior without UI or private authority? |
| Extensions | What real extension pressure exists, and what remains private? |
| Sources and provenance | What is durable source truth versus transient projection? |
| Security and egress | What untrusted input or sensitive authority appears? |
| Lifecycle | What cancels, becomes stale, retries, restores, or tears down? |
| Module pressure | Which integration module absorbs the work, and does a behavior family earn extraction? |
| Validation | What highest useful interface proves each behavior? |

Skip lenses that do not apply. Do not add architecture to fill the table.

Classify each future consumer as one of:

- **Use now**: a real caller in this plan.
- **Compatibility seed**: preserve a semantic shape without adding an interface.
- **Deferred adapter**: the accepted interface is sufficient, but the adapter is later.
- **Not a consumer**: prevent accidental coupling.

Future Sushi or extension use can shape semantics. It does not, by itself, justify a public interface.

Done when adjacent concerns are either handled, deferred with a reason, or ruled out.

## 4. Choose durable interfaces proportionately

Prefer existing commands, document operations, capabilities, snapshots, source objects, and authority crossings.

When the plan introduces or materially changes a durable interface, sketch three different shapes:

1. minimum interface
2. dominant-caller interface
3. authority or real-variation interface

Compare interface burden, hidden complexity, correct-use defaults, lifecycle, errors, test surface, locality, and extension pressure. Recommend one shape or a deliberate hybrid.

Do not design a public extension interface from one hypothetical consumer. Record extension pressure instead.

Done when each new interface earns its burden and each rejected shape has a concrete reason.

## 5. Slice vertical checkpoints

Each checkpoint must produce one coherent, runnable state. It may cross UI, command, preload, main, storage, and tests when those layers form one behavior.

For each checkpoint, state:

- user-visible or externally observable result
- changed seams and owners
- preserved invariants
- explicit non-goals
- automated proof
- manual proof
- blockers

Use prefactoring only when it makes the next behavior safer and remains independently verifiable. Do not split work into horizontal layer tickets unless no vertical green state is possible.

Done when the first checkpoint can run by itself and later checkpoints do not hide required safety work.

## 6. Write and route the plan

Use the repository's existing plan location and format when one exists. Otherwise propose a path under `docs/plans/active/` before creating a durable plan.

A complete plan contains:

```md
# <Feature> Plan

## Goal
## Scope
## Current path and accepted invariants
## Seam horizon scan
## Interface decisions
## Checkpoint sequence
## Risks and open decisions
## Out of scope
## Read first
## Expected code entry points
## Done when
```

After the plan becomes durable, use `omakase-checkpoint-map` to create or update its workstream row. Select only the first runnable checkpoint for `omakase-implement`.

## Output

```md
## Planning result
- Destination:
- Plan:
- First runnable checkpoint:
- Main seams:
- Deferred pressure:
- Suggested next move: checkpoint-map update / implement / wayfinder / stop
- Reason:
```

A suggested next move is advice, not an automatic command. Skip any step whose entry condition is absent.
