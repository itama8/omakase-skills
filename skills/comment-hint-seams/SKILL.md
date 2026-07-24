---
name: comment-hint-seams
description: "Annotate seams in an active Omakase code change. Use when the user asks for seam comments, future-agent hints, core-vs-feature markings, extraction hints, or inline architecture notes."
---

# Comment Hint Seams

Annotate only high-value implementation seams in changed code. A seam comment is a short hint about ownership, invariant, or future extraction; it is not a TODO, essay, or restatement of syntax.

## Steps

1. **Scope the diff.** Use the current git diff by default. If there is no diff, ask for a file/function/feature target.
   - Done when every candidate file is either changed or explicitly requested.
2. **Pick sparse seams.** Choose the top 3–8 places where a future editor might make the wrong move: safety boundary, feature/module seam, public API path, extension/Sushi boundary, or accepted fragile tradeoff.
   - Done when each candidate has a concrete reason tied to code.
3. **Choose comment or skip.** Inline only comments that will help at the edit site. Put broader context in docs/devlog instead.
   - Done when no comment merely narrates code or repeats a plan.
4. **Write non-authoritative hints.** Use language like `Implementation seam`, `Future extraction candidate`, `Core safety boundary`, `Checkpoint-local glue`, or `Preserve this invariant`. Use stronger language only for data safety/note integrity.
   - Done when each comment is 1–4 lines and sits immediately above the seam.
5. **Validate if source changed.** Run `npm run typecheck`; add build only when the touched area warrants it.
   - Done when validation passes or failures are reported.
6. **Summarize.**
   - Done when output lists files, seam types, and validation.

## Seam types

- **Core safety boundary** — note integrity, persistence, undo/redo, cursor/selection, stale-source guards, document-operation discipline.
- **Feature extraction seam** — renderer-local widget/controller/parser likely to become a module.
- **Public API seam** — commands, document operations, transaction runner, preview/apply paths.
- **Extension/Sushi seam** — future scripts/AI should call a public path, not DOM/CM6/private state.
- **Accepted fragile glue** — local coupling intentionally kept to land a checkpoint.

## Dry run

If the user asks to suggest comments, do not edit. Return proposed locations, reasons, and comment text.

## Output

```md
Added seam comments:
- `path` — <seam type/reason>

Validation:
- <commands/results>
```

Do not update devlogs unless requested or the comment pass is part of a larger checkpoint.
