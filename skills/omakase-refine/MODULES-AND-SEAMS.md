# Modules and seams

Load this reference only when a refinement finding would create, remove, deepen, or relocate a module or seam.

## Vocabulary

Use these terms precisely:

- **Module** — code with one interface and an implementation. It may be a function, class, file, package, or cross-process feature slice.
- **Interface** — everything callers must know: types plus invariants, ordering, errors, lifecycle, configuration, authority, and performance expectations.
- **Depth** — leverage delivered through the interface. A deep module hides substantial useful complexity behind a small interface; a shallow module makes callers learn nearly as much as its implementation contains.
- **Seam** — a place where behavior can vary without editing the caller. A module's interface lives at a seam.
- **Adapter** — an implementation selected at a seam.
- **Leverage** — one interface pays back across callers and tests.
- **Locality** — behavior, bugs, knowledge, and verification concentrate in one place.

Omakase also has **authority boundaries**: renderer/preload/main, editor/persistence, local/remote, trusted/untrusted. Use “boundary” for security or process authority and “seam” for substitutability or interface placement.

## Earn the module

A proposed module must pass all applicable checks:

1. **Callers** — Name today's callers. One caller can justify a module when it hides volatile mechanics or owns policy, but not merely because the code is long.
2. **Interface burden** — List everything a caller must know. Count lifecycle and failure rules, not just methods.
3. **Hidden complexity** — Name what moves behind the interface.
4. **Deletion test** — Imagine deleting the module. If complexity disappears, it was likely pass-through indirection. If the same complexity spills into several callers, the module is earning locality.
5. **Variation test** — One adapter usually means a hypothetical seam. Require actual variation, a production/test substitution, or a real authority crossing before adding a port.
6. **Test surface** — Callers and tests should exercise the same interface. Wanting to test private internals is evidence that the shape may be wrong.

Do not measure depth by implementation lines. Padding is not depth; caller leverage is.

## Omakase seam rules

- A **command** is the interface for public user-invokable behavior. Keymaps, palette actions, UI, and future callers should not duplicate it.
- A **document operation** is the interface for durable editor mutation. Transaction, Undo, and persistence policy belong behind that route.
- A **capability** is justified by multiple real callers or brokered authority, not by generic reuse aspirations.
- **Preload IPC** is an authority boundary and typed adapter, not a reason to mirror domain logic in renderer and main.
- A renderer feature module should hide one coherent UI behavior family while leaving DOM/CM6 integration at the narrowest practical edge.
- Feature-local transient projections may keep internal seams private. Do not expose them just to unit-test helpers.
- Stable command IDs, operation variants, and IPC payloads are interface contracts; changing them requires checkpoint intent and migration consideration.

## Classify dependencies before deepening

- **In-process** — pure or in-memory dependencies. Merge shallow pieces freely and test through the resulting interface.
- **Local-substitutable** — filesystem, SQLite, or similar dependencies with realistic local stand-ins. Keep the stand-in behind an internal seam when callers do not need to choose it.
- **Owned authority crossing** — Electron renderer/preload/main or an owned worker/runtime. Use a narrow typed interface at the crossing; keep transport as an adapter and policy in the authority that owns it.
- **External** — network providers, websites, model APIs, OS integration. Isolate volatility and security policy behind the smallest useful port; test with a controlled adapter only when substitution is real.

## Design it twice

Before introducing or materially changing a durable interface, sketch at least three meaningfully different shapes:

1. **Minimum interface** — one to three entry points; maximize leverage per entry point.
2. **Common-caller interface** — make the dominant Omakase path hard to misuse.
3. **Authority/variation interface** — optimize seam placement around the real process, security, or adapter constraint.

For each sketch state:

- interface, including lifecycle and errors;
- one realistic caller;
- complexity hidden by the implementation;
- dependency/adapter strategy;
- validation through the interface;
- where leverage or locality is weak.

Compare the shapes by depth, locality, correct-use defaults, misuse risk, and seam placement. Recommend one or a deliberate hybrid. Alternatives are a thinking tool, not permission to add flexibility from all three.

## Deepen by replacement

When a deeper module wins:

1. Establish behavior proof at the highest existing seam.
2. Introduce the chosen interface without broadening behavior.
3. Move policy and complexity behind it in green steps.
4. Switch real callers.
5. Delete pass-through wrappers, duplicate state, obsolete adapters, and tests of private structure.
6. Keep tests at the surviving interface and verify they tolerate internal reorganization.

Do not layer a new architecture over the old one and call it refinement.

## Reasons to keep code local

Do not extract when the only evidence is:

- a large file or long function;
- one caller and no hidden policy;
- a test wanting access to a private helper;
- a future plugin, runtime, or caller not in the checkpoint;
- checkpoint-local glue likely to change after user testing;
- cosmetic symmetry with another subsystem.

In those cases, lean local code has better locality than a shallow module.
