---
name: omakase-ui-probe
description: "Diagnose Omakase UI bugs whose failure lives in runtime state a screenshot cannot reach — use when one direction breaks while its symmetric works, a caret/selection/card/scroll lands against stale or off-viewport geometry, or a held key or compositor repeat leaks characters that should be owned. Build a probe that drives Electron over Chrome DevTools, reads structured editor state, falsifies with controlled variants, and promotes the proved invariant to a persisted contract. Not for aesthetic review or bugs a Node contract already owns."
---

# Omakase UI Probe

The failure lives in **runtime state a screenshot cannot show** and a Node unit test cannot model. Reach for a **probe**, not a screenshot loop.

A probe drives the real Electron app and reads structured editor state — `selection`, `scrollTop`, line and caret rectangles, widget counts, `visibleRanges` — instead of interpreting pixels. The bug is invisible to vision precisely because it lives off-viewport (block widgets corrupting CodeMirror's vertical coordinates), in ordering races (a stale `scrollTop` restore clobbering CM6's cursor reveal), or in compositor event shapes (Wayland `repeat=false`) a unit test can't represent. A screenshot returns a wrong but static picture; a probe returns the state that *is* the failure and turns a fuzzy symptom ("the cursor jumps") into a pinned reading (`scrollTop: 601.25 → 786.88 → 601.25`).

Probe, then **promote**. A probe is one-time diagnosis; a promoted contract is a forever guard at ~zero tokens per future run. The expensive thing is composing the probe; the cheap thing is perpetuating its finding. The loop ends on the contract, not on the CDP run.

## When to probe — and when not

Probe when the failure has any of these signatures:

- **Asymmetry** — one direction breaks, the symmetric one works (Up jumps, Down doesn't).
- **Stale or off-viewport geometry** — a caret, selection, card, or scroll lands at, reverts to, or refocuses against an old position after a toggle, delete, layout, focus, or composition change. Caret height matching an image instead of text is this class.
- **Held-key leakage** — a physical hold or compositor repeat inserts characters that should be owned by a chord.

**Do not probe** for pure parser/format bugs (the `markdown-*`, `editor-history`, `document-operation`, `command-registry` contracts already own these), aesthetic or theme judgement (a human screenshot is the right tool there, and the agent's taste is not the product judge), or any state already expressible as a pure function a Node contract asserts. Spinning up an isolated Electron profile for what a 20-line unit test would catch is the inverted token problem.

## The loop

### 1. Reproduce with a probe

Build the app. Launch an **isolated** Electron instance against a **temporary** `--user-data-dir` and a **copied** affected note/vault so the real profile and real notes are never touched and the bug reproduces deterministically:

`electron dist/main.js --remote-debugging-port=<port> --user-data-dir=<tmp>`, then `GET http://localhost:<port>/json` for `webSocketDebuggerUrl`.

The probe drives input (`Input.dispatchKeyEvent`, `Input.dispatchMouseEvent`) and reads state (`Runtime.evaluate` against CM6 `view.state`, `selection`, `scrollTop`, `getBoundingClientRect`, computed styles, widget counts). `scripts/browser-cp0-electron-probe.mjs` is a worked in-process Electron probe to copy structure from; in-process `ELECTRON_RUN_AS_NODE=1 electron scripts/…` is the persisted style when the contract must exercise CM6 directly without a live window.

Done when the probe reproduces the failure and emits at least one structured reading that distinguishes the broken state from the working state.

### 2. Pin the symptom

Convert the fuzzy user report into a measured reading the probe can assert: a `scrollTop` value, a caret or line-box height, a selection `from..to`, a widget count. Pin the clean path's reading too, so the break is a delta, not a vibe.

Done when the broken and working readings are each a single number or short tuple written down.

### 3. Falsify with controlled variants

Hold the probe fixed and vary one factor at a time: remove the suspect assets, change a widget's `block` geometry, split the synthetic case from the exact real note, reverse the navigation direction. The diagnosis is the variant that flips the pinned reading.

Done when at least one variant contradicts the leading hypothesis and changes it. A probe that only confirms the first guess has not debugged — it has rationalized.

### 4. Promote to a contract

Every invariant the probe pinned — a movement path, a geometry delta, a stable `scrollTop`, an exact selection range, a document-operation outcome — becomes a persisted `test:*` contract, written in pure Node or `ELECTRON_RUN_AS_NODE=1 electron` where it must exercise CM6 directly, and added under `test:core-contracts` (or the relevant `test:<area>`) in `package.json`. `scripts/w-chord-key-ownership-contract.mjs` is the model: a compositor key-repeat quirk first proved by CDP + real `wtype` input, then encoded as a 55-line contract that guards it forever at no CDP cost.

Done when every pinned invariant is either persisted as a contract or explicitly recorded with why promotion is not warranted. The implementation commit changes `src/`; the promoted contract lands under `scripts/` beside it.

### 5. Keep the probe one-time

A probe script is one-time diagnosis. If it stays in `/tmp` after promotion — as the `2026-07-15` cursor-geometry harness `omakase-cdp-*.cjs` did — the next regression re-pays full composition cost. Persist a probe to `scripts/<name>-probe.mjs` under a `probe:<name>` script (see `probe:browser-cp0`, `probe:web-search`) only if the same diagnosis will recur; otherwise let it die with the promoted contract as its permanent residue.

Done when no probe lives in `/tmp` after promotion, and every recurring probe class has a `probe:*` entry in `package.json`.

## What not to do

- Do not run a screenshot-and-guess loop. Pixels return a wrong, static picture of precisely the off-viewport or ordering failures a probe makes visible.
- Do not stop at diagnosis. An invariant proved once and not promoted is the most expensive bug to re-debug.
- Do not probe what a Node contract already covers. `test:core-contracts` is cheaper than a CDP session for every regression it already owns.
- Do not touch the real profile or real notes. Isolated `--user-data-dir`, copied affected state, nothing else.
- Do not ship the probe. The accepted commit changes `src/`; the probe and promoted contract live under `scripts/` and `/tmp`.

## Output

```md
## Omakase UI probe: <symptom>

- Reproduced reading: <probe path + structured reading>
- Pinned invariant: <broken vs working reading>
- Falsifying variant: <what changed the hypothesis>
- Promoted contract: <test:* script + package.json entry> or <why not promoted>
- Probe residue: <probe:* script, or /tmp and deleted>
- Validated: <contract run + git diff --check>
```