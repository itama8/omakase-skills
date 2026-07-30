---
name: omakase-architecture-radar
description: "Survey Omakase development hotspots for compounding architecture friction and behavior-driven extraction candidates. Use for periodic codebase health checks when no specific refactor target is proven. Reports ranked candidates without editing code or designing detailed interfaces."
---

# Omakase Architecture Radar

Find structural pressure before it becomes expensive. Radar surveys active code and ranks possible architecture checkpoints. It does not edit code, split files by size, or design a selected interface.

Use [`planning-and-architecture-routing.md`](../../references/planning-and-architecture-routing.md) for the shared routing rules. Use [`MODULES-AND-SEAMS.md`](../omakase-refine/MODULES-AND-SEAMS.md) for module and seam vocabulary.

## 1. Set the survey horizon

Use the area or concern named by the user. If none is named, inspect a bounded recent history and find recurring source hotspots. Start with the last 50 to 100 commits. Widen only when that sample has no useful signal.

Use file size only as a navigation clue. A large integration module is not a defect by itself.

Do not use Radar when:

- the user already named one extraction target
- the current diff is the review scope
- one feature needs a local slop review
- the real task is to plan a known product change

Route those cases to `omakase-refine`, `slop-catcher`, or `omakase-cross-seam-plan`.

Done when the survey has a bounded area, history range, and reason.

## 2. Gather structural evidence

For each hotspot, inspect only enough code, tests, plans, and recent changes to map:

- coherent behavior families
- callers and ownership handoffs
- renderer, preload, main, worker, filesystem, database, and network authority
- repeated policy or state
- lifecycle and error handling
- commands, document operations, capabilities, snapshots, and source objects
- tests and the interfaces they exercise
- repeated regression or change friction

Look for consequences such as:

- one behavior requires edits across unrelated regions on every change
- policy is duplicated across callers
- integration modules own domain behavior that has become stable
- tests reach private helpers because no useful behavior interface exists
- extension or Sushi code imports internals
- process transport and domain policy are mixed
- shallow modules add names without hiding complexity

Done when each suspected issue has a reachable consequence and concrete file or function evidence.

## 3. Apply extraction gates

A candidate qualifies only when most applicable gates pass:

1. **Behavior family**: one product or authority concern names the candidate.
2. **Stability**: accepted behavior exists to preserve.
3. **Ownership**: policy or volatile mechanics can move behind one owner.
4. **Interface depth**: callers can learn less than the implementation contains.
5. **Deletion test**: deleting the candidate would scatter complexity back into callers.
6. **Validation**: the same behavior can be proved before and after extraction.
7. **Integration shell**: the survey can state what correctly remains in `renderer.ts` or `main.ts`.
8. **Change pressure**: evidence suggests the area will continue to change.

Reject candidates based only on line count, naming preference, cosmetic symmetry, or a hypothetical future plugin.

Done when every reported candidate passes the gates or carries a clear speculative label.

## 4. Rank candidates

Use these strengths:

- **Strong**: current friction is concrete, behavior is stable, and a validation seam exists.
- **Worth exploring**: the pressure is real, but ownership or interface shape needs investigation.
- **Speculative**: evidence is incomplete. Record it only when the uncertainty itself is useful.

Rank by future risk reduction, locality, authority clarity, and proof quality. Do not rank by expected line-count reduction.

Done when one top candidate has the strongest evidence, or the report says that no extraction is justified.

## 5. Report and stop

Write no repository file unless the user asks to preserve the survey. By default, report in the conversation. A preserved survey belongs in a temporary or planning location, not an architecture contract.

Use this shape:

```md
# Architecture Radar: <scope>

## Horizon
- History range:
- Hotspots:
- Constraints read:

## Candidates
### <Candidate>
- Strength:
- Files and behavior family:
- Evidence and reachable consequence:
- Current callers and owners:
- Complexity that could move behind one owner:
- What remains in the integration module:
- Existing validation seam:
- Smallest useful investigation or checkpoint:

## Rejected signals
- <Large or busy area that did not earn extraction.>

## Top recommendation
<Candidate, no action, and reason.>

## Suggested next move
- Route: refine / cross-seam plan / slop-catcher / defer
- Reason:
```

Use `omakase-refine` for a bounded behavior-preserving extraction. Use `omakase-cross-seam-plan` when the candidate spans behavior families or authority boundaries. A recommendation is not approval to edit.
