# Omakase Skills

A public collection of project-level agent skills for running deliberate, traceable software checkpoints. They were developed for [Omakase](https://github.com/itama8/omakase-v2), an Electron editor, and are published here as Markdown playbooks you can adapt to your own project.

The collection focuses on the work around implementation—not just writing code: orienting a session, protecting an accepted scope, reviewing architecture, preserving useful inline context, and leaving an honest handoff.

## Skills at a glance

| Skill | What it does | Use it when |
| --- | --- | --- |
| [`comment-hint-seams`](skills/comment-hint-seams/SKILL.md) | Adds sparse, high-value comments at ownership, safety, API, and extraction seams. | You want future maintainers or agents to understand a non-obvious boundary without filling code with narration. |
| [`omakase-checkpoint-closeout`](skills/omakase-checkpoint-closeout/SKILL.md) | Closes an accepted checkpoint with validation, scoped commits, and SHA-backed traceability. | A change works and has been explicitly accepted. |
| [`omakase-checkpoint-map`](skills/omakase-checkpoint-map/SKILL.md) | Maintains a compact workstream ledger that routes future work to the right docs and code. | A durable workstream, its state, or its next action changes. |
| [`omakase-refine`](skills/omakase-refine/SKILL.md) | Reviews or improves a checkpoint through contract, simplicity, and module-depth lenses. | You need a pre-acceptance review, cleanup, simplification, or justified extraction. |
| [`omakase-session-handoff`](skills/omakase-session-handoff/SKILL.md) | Records a truthful continuation point for work that is not ready for accepted closeout. | A session ends while work is planned, blocked, exploratory, uncommitted, or awaiting user testing. |
| [`omakase-session-orient`](skills/omakase-session-orient/SKILL.md) | Routes a new task through a checkpoint map before loading broad project context. | You are starting a session or the relevant workstream is unclear. |
| [`slop-catcher`](skills/slop-catcher/SKILL.md) | Performs a tightly scoped review for fragile glue, unclear ownership, and core-vs-extension drift. | You suspect hacks, architecture drift, or a feature boundary is getting blurry. |

`omakase-refine` includes [`MODULES-AND-SEAMS.md`](skills/omakase-refine/MODULES-AND-SEAMS.md), a reference for deciding whether code should stay local or earn a deeper interface.

## Install

Clone this repository, then copy the skills you want into your project's skill directory:

```bash
git clone https://github.com/itama8/omakase-skills.git
mkdir -p /path/to/your-project/.pi/skills
cp -R omakase-skills/skills/<skill-name> /path/to/your-project/.pi/skills/
```

Keep the directory and `SKILL.md` filename intact. Install only the skills that match your workflow; the suite is intentionally composable.

## Adapt these to your project

These are templates, not a process you must adopt wholesale. Before using one, replace the Omakase-specific assumptions with your project's equivalents:

- **Project name and architecture.** Replace `Omakase` and its renderer/preload/main, CodeMirror, document-operation, and Sushi terminology with your own system boundaries.
- **Documentation locations.** Several workflow skills refer to `docs/plans/checkpoint-map.md`, `docs/plans/plan-index.md`, and `.devlog/`. Point them to your roadmap, issue tracker, ADRs, changelog, or remove those steps.
- **Validation commands.** Replace `npm run typecheck`, build commands, and manual checks with the narrowest meaningful checks in your stack.
- **Commit policy.** `omakase-checkpoint-closeout` assumes accepted work is committed before its devlog is written. Change the order or remove the commit steps if your team uses PR-only or squash workflows.
- **Risk priorities.** The editor-centric guardrails in `omakase-refine` and `slop-catcher` should become your own non-negotiables: data integrity, security, migrations, latency, accessibility, availability, or another domain-specific contract.

A good adaptation keeps the skill's decision points and proof requirements while removing names, tools, and invariants that do not apply. Start with a copy in your project, use it on real work, and tighten it based on the failures it catches.

## Suggested workflow

1. Start with **session orient** to find the active workstream and smallest relevant context.
2. Implement a small, testable checkpoint.
3. Run **refine** or **slop catcher** before acceptance; use **comment hint seams** only for the few boundaries that need durable local context.
4. If accepted, use **checkpoint closeout**. Otherwise, create a **session handoff**.
5. Update the **checkpoint map** whenever the durable routing state changes.

## Contributing

Improvements and project-neutral variants are welcome. Please keep skills:

- explicit about when they apply and when they should stop;
- scoped to observable evidence rather than vague advice;
- honest about validation and commit state; and
- small enough to be adapted rather than treated as a framework.

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution notes.

## License

[MIT](LICENSE)
