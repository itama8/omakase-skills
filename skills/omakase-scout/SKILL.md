---
name: omakase-scout
description: "Delegate read-only exploration to a Pi scout so file and doc reads stay out of the main context. Use before a trace that would take more than about three reads: where is X handled, who calls Y, what do these plan docs say about Z, how does a reference repo do W. Not for edits, design decisions, or commits."
---

# Omakase Scout

A scout is a Pi child on the Pi default model. It reads, searches, and returns a short list of `file:line` leads. Its reading never enters your context. The scout cannot see this conversation, so the task must stand alone.

Scouts exist because most tool output in this repo is exploration: `sed`, `cat`, and `rg` over `src/table/*`, `src/renderer.ts`, and plan docs. A scout turns that into a few lines.

## When to use

- A code path or caller trace across files you have not read this session.
- "What does the checkpoint-map row, plan doc, and devlog say about X" when only the conclusion is needed.
- Reading a reference repo or the Pi package source for one answer.
- Drift check: compare a finished change against its plan doc and report only mismatches.

## When not to use

- Document mutation, Undo/history, persistence, IPC/main authority, security, or any seam where you must hold the trace yourself. Read it directly.
- Anything that edits files, runs checks, commits, or writes devlogs.
- A question one `rg` and one narrow `read` already answers.
- Design or tradeoff judgment. A scout reports facts; you decide.

## Write the task

Always include the read-only rule and the reply contract. Copy this and fill the angle brackets:

```text
READ-ONLY scouting task. Do not edit, write, or run anything that changes files or git state. Do not read AGENTS.md.

Repo: <absolute path> (Electron + TypeScript app).

Question: <one specific question>

Where to look first: <paths or terms, optional>

Method: locate with grep/find, then read only the narrow line ranges you need. Never read src/renderer.ts or src/styles.css whole.

Reply format (hard limit: <12> lines):
- Each finding is one line: `path:line - what it does`.
- Mark anything you did not verify by reading as "unverified".
- Do not paste code or file contents. No preamble, no closing summary.
```

One question per scout. Run several in parallel for independent questions.

## Run it

### Path A: T3 `delegate_task` (preferred inside a T3 thread)

Call `delegate_task` (in Codex code mode, `tools.mcp__t3_code__delegate_task`) with:

- `task`: the text above.
- `target`: `{"providerInstanceId": "pi", "model": "default"}`.
- `role`: `research`.
- `mode`: `wait` when the next step needs the answer. Otherwise `async`, then end the turn; completion wakes the thread.
- `title`: short, e.g. `Scout: <topic>`.
- `clientRequestId`: unique per scout, stable across retries.

Pi offers no read-only runtime mode, and the narrower modes make the child wait for approval. Leave `runtimeMode` unset. The read-only rule lives in the task text only.

If `pi` is missing from `orchestrator_capabilities`, or the child errors, use Path B.

### Path B: `pi` CLI (any session, enforced read-only)

```bash
timeout 300 pi -p --no-session --no-skills --no-extensions --no-context-files \
  --thinking low --tools read,grep,find,ls \
  "<task text>" </dev/null
```

- The tool allowlist has no `bash`, `edit`, or `write`, so the scout cannot mutate the tree.
- `</dev/null` and `timeout` are required. Without them a failed call can hang silently.
- The stderr line `No models match pattern "opencode-go/deepseek-v4-flash"` is a stale `enabledModels` entry and is harmless.
- A `403` about a subscription means the default model's provider needs attention. `pi auth check` only confirms a credential exists. Tell the user instead of retrying.
- Run it as a normal foreground command. Do not pipe it through `head` or `tail`.

## Use the answer

- Treat every line as a lead. Open the cited lines yourself before you edit or assert anything based on them.
- Treat lines marked unverified as questions, not facts.
- A vague or wrong answer is usually a vague question. Narrow it and rerun once. If the second run fails, read the code directly.
- Do not paste the scout's reply into docs, devlogs, or commit messages as evidence. Evidence is what you verified.
