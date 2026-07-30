# Omakase Skills

A public collection of project-level agent skills for running deliberate, traceable software checkpoints. They were developed for [Omakase](https://github.com/itama8/omakase-v2), an Electron editor, and are published here as Markdown playbooks you can adapt to your own project.

The collection covers the work before, during, and after implementation. It helps agents resolve uncertain decisions, plan changes across architecture seams, survey codebase health, protect accepted scope, review changes, and leave an honest handoff.

## Skills at a glance

| Skill | What it does | Use it when |
| --- | --- | --- |
| [`comment-hint-seams`](skills/comment-hint-seams/SKILL.md) | Adds sparse, high-value comments at ownership, safety, API, and extraction seams. | You want future maintainers or agents to understand a non-obvious boundary without filling code with narration. |
| [`omakase-architecture-radar`](skills/omakase-architecture-radar/SKILL.md) | Surveys active development hotspots and ranks behavior-driven architecture candidates without editing code. | The codebase feels structurally expensive, but no refactor target is proven. |
| [`omakase-checkpoint-closeout`](skills/omakase-checkpoint-closeout/SKILL.md) | Closes an accepted checkpoint with validation, scoped commits, and SHA-backed traceability. | A change works and has been explicitly accepted. |
| [`omakase-checkpoint-map`](skills/omakase-checkpoint-map/SKILL.md) | Maintains a compact workstream ledger that routes future work to the right docs and code. | A durable workstream, its state, or its next action changes. |
| [`omakase-cross-seam-plan`](skills/omakase-cross-seam-plan/SKILL.md) | Turns a clear destination into a coherent sequence of vertical checkpoints across behavior and authority seams. | A feature or architecture change is clear but too broad for one runnable checkpoint. |
| [`omakase-implement`](skills/omakase-implement/SKILL.md) | Routes implementation work by risk before the first edit, then pins contracts, ownership, and proportionate proof. | You are about to implement a feature, fix, behavior change, refactor, or test-backed code change. |
| [`omakase-refine`](skills/omakase-refine/SKILL.md) | Reviews or improves a checkpoint through contract, simplicity, and module-depth lenses. | You need a pre-acceptance review, cleanup, simplification, or justified extraction. |
| [`omakase-session-handoff`](skills/omakase-session-handoff/SKILL.md) | Records a truthful continuation point for work that is not ready for accepted closeout. | A session ends while work is planned, blocked, exploratory, uncommitted, or awaiting user testing. |
| [`omakase-session-orient`](skills/omakase-session-orient/SKILL.md) | Routes a new task through a checkpoint map before loading broad project context. | You are starting a session or the relevant workstream is unclear. |
| [`omakase-ui-probe`](skills/omakase-ui-probe/SKILL.md) | Diagnoses runtime-only Electron UI failures with a CDP probe, then promotes the proved invariant into a durable contract. | A screenshot cannot expose the failure: geometry, ordering, focus/scroll, directional asymmetry, or compositor key-repeat behavior. |
| [`omakase-wayfinder`](skills/omakase-wayfinder/SKILL.md) | Resolves a large effort as a map of decisions until the route becomes clear enough to plan. | The destination spans sessions or its load-bearing decisions depend on one another. |
| [`slop-catcher`](skills/slop-catcher/SKILL.md) | Performs a tightly scoped review for fragile glue, unclear ownership, and core-vs-extension drift. | You suspect hacks, architecture drift, or a feature boundary is getting blurry. |
| [`writing-great-skills`](skills/writing-great-skills/SKILL.md) | A reference for creating and editing predictable, lean agent skills. | You are turning one of these examples into a project-specific skill or authoring a new one. |

The planning skills share [`planning-and-architecture-routing.md`](references/planning-and-architecture-routing.md), which defines their soft entry, stop, and handoff signals. `omakase-refine` includes [`MODULES-AND-SEAMS.md`](skills/omakase-refine/MODULES-AND-SEAMS.md), a reference for deciding whether code should stay local or earn a deeper interface. `writing-great-skills` includes a disclosed [`GLOSSARY.md`](skills/writing-great-skills/GLOSSARY.md) for its vocabulary and design principles.

## Project synchronization

The Omakase project’s [`.pi/skills`](https://github.com/itama8/omakase-v2/tree/master/.pi/skills) directory is the source catalog for the project-level skills above. This repository mirrors that catalog for review and reuse. The public copy redirects shared process links to the bundled references in this repository. Other project-relative paths and named scripts remain as concrete Omakase examples. Adapt them to your own documentation, validation, and runtime before use.

## Use this repository as a skill workshop

Clone this repository beside your own project. It is a reference and set of examples—not a package to install wholesale into an agent's skill directory.

```bash
git clone https://github.com/itama8/omakase-skills.git
```

Then point your coding agent at both the clone and your project, and ask it to craft skills for the way your team actually works. Start with a prompt like:

> Read `omakase-skills/skills/writing-great-skills/SKILL.md` and its `GLOSSARY.md`. Inspect this project’s architecture, documentation, validation commands, and delivery workflow. Use the relevant skills in `omakase-skills/skills/` as examples, then create a small, project-specific agent skill for **[the workflow/problem]**. Keep only requirements that apply here; give every step an observable completion criterion and document the trigger, scope, validation, and stop conditions.

The agent should produce a new skill in the location and format your own agent environment uses. Keep this clone unchanged as the source material, so you can compare, revisit, and refine its examples over time.

## Adapt these to your project

These are templates, not a process you must adopt wholesale. Before using one, replace the Omakase-specific assumptions with your project's equivalents:

- **Project name and architecture.** Replace `Omakase` and its renderer/preload/main, CodeMirror, document-operation, and Sushi terminology with your own system boundaries.
- **Documentation locations.** Several workflow skills refer to `docs/plans/checkpoint-map.md`, `docs/plans/plan-index.md`, and `.devlog/`. Point them to your roadmap, issue tracker, ADRs, changelog, or remove those steps.
- **Validation commands.** Replace `npm run typecheck`, build commands, and manual checks with the narrowest meaningful checks in your stack.
- **Commit policy.** `omakase-checkpoint-closeout` assumes accepted work is committed before its devlog is written. Change the order or remove the commit steps if your team uses PR-only or squash workflows.
- **Risk priorities.** The editor-centric guardrails in `omakase-refine` and `slop-catcher` should become your own non-negotiables: data integrity, security, migrations, latency, accessibility, availability, or another domain-specific contract.

Use `writing-great-skills` as the authoring standard during this work: it helps the agent choose a useful trigger, keep steps and reference at the right level, add checkable completion criteria, and remove duplicated or no-op instructions. A good adaptation keeps the original skill's decision points and proof requirements while removing names, tools, and invariants that do not apply. Exercise the resulting project-specific skill on real work, then tighten it based on the failures it catches.

## Suggested workflow

Use the lightest route that fits the current uncertainty. Skip any step whose entry condition is absent.

1. Start with **session orient** to find the active workstream and smallest relevant context.
2. Use **wayfinder** when the route is too unclear to plan. Use **cross-seam plan** when the destination is clear but spans several checkpoints.
3. Use **architecture radar** as a separate health check when structural pressure exists without a proven target.
4. Implement one small, testable checkpoint.
5. Run **refine** or **slop catcher** before acceptance. Use **comment hint seams** only for boundaries that need durable local context.
6. If accepted, use **checkpoint closeout**. Otherwise, create a **session handoff**.
7. Update the **checkpoint map** whenever durable routing state changes.

## Contributing

Improvements and project-neutral variants are welcome. Please keep skills:

- explicit about when they apply and when they should stop;
- scoped to observable evidence rather than vague advice;
- honest about validation and commit state; and
- small enough to be adapted rather than treated as a framework.

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution notes.

## License

[MIT](LICENSE)
