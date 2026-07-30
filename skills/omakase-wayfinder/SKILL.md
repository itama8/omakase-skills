---
name: omakase-wayfinder
description: "Resolve a large Omakase effort whose route is still unclear. Use when the destination spans sessions, load-bearing decisions depend on one another, or the work is too foggy for a coherent feature plan. Produces decisions, not implementation checkpoints or code."
---

# Omakase Wayfinder

Find the route to a large destination before planning the build. Wayfinding resolves decisions. It does not implement features or track checkpoint delivery.

Use [`planning-and-architecture-routing.md`](../../references/planning-and-architecture-routing.md) for the shared routing rules.

## 1. Confirm that the route is foggy

Name the destination in one or two sentences. Then test whether the effort needs Wayfinder:

- Can the important questions be stated now?
- Could one planning session turn the goal into runnable checkpoints?
- Would one answer expose or invalidate several later decisions?

If the route is already clear, stop. Recommend `omakase-cross-seam-plan` or direct checkpoint work instead.

Done when the destination is clear and Wayfinder is the lightest sufficient route.

## 2. Start a decision map

Use `docs/plans/wayfinding/<effort>/map.md` unless the user selects another location. The map is an index. Keep each resolved decision in one decision file and link to it from the map.

```md
# <Effort> Decision Map

## Destination
<What must be clear when wayfinding ends.>

## Constraints
- <Accepted contract or fixed limit.>

## Decisions so far
- [<Decision name>](decisions/<file>.md): <one-line result>

## Frontier
- [<Decision name>](decisions/<file>.md): <precise question that can be worked now>

## Fog
- <In-scope concern that cannot yet be stated as a precise question.>

## Out of scope
- <Work beyond this destination.>
```

Create a decision file only when its question is precise. Keep vague concerns in `Fog`.

Done when the map separates resolved decisions, the current frontier, fog, and out-of-scope work.

## 3. Work the frontier

For each frontier question:

1. Check the repository and primary sources for facts before asking the user.
2. Separate factual findings from choices that need user judgment.
3. Ask one load-bearing decision question at a time.
4. Give a recommended answer and its trade-offs.
5. Record the answer in the decision file.
6. Update the map with a one-line result and a link.
7. Promote newly precise fog into decision files. Remove fog that the answer invalidates.

Prefer one coherent decision branch per session. Resolve more only when the decisions are small and independent.

Use this decision-file shape:

```md
# <Decision name>

- Status: open | resolved | out-of-scope
- Depends on: <decision links or none>

## Question
<One precise question.>

## Evidence
<Repository facts, primary-source findings, and constraints.>

## Resolution
<Chosen answer and important trade-offs.>

## Consequences
<What this makes possible, rules out, or leaves open.>
```

Done when the selected question has one recorded answer or an explicit blocker.

## 4. Stop at a clear route

Wayfinding is complete when:

- the destination is stable
- no load-bearing fog remains
- remaining choices can be made inside normal planning or implementation
- a planner can describe runnable checkpoints without reopening resolved decisions

Do not turn decision files into implementation tickets. Recommend `omakase-cross-seam-plan` to synthesize the route. Update the checkpoint map only when the effort becomes a durable workstream with a concrete next checkpoint.

## Output

```md
## Wayfinding state
- Destination:
- Decision worked:
- Resolution:
- Frontier:
- Remaining fog:
- Suggested next move: continue wayfinding / cross-seam plan / direct checkpoint / stop
- Reason:
```

A suggested next move is advice, not an automatic command. Reassess the current state before using another skill.
