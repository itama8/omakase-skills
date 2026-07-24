# Contributing

Thanks for helping make these skills more useful outside their original project.

## Before opening a pull request

- Keep one skill in one directory with a `SKILL.md` entry point.
- Give the skill a clear trigger in its frontmatter description.
- Prefer concrete steps, stop conditions, and an output shape over general guidance.
- Mark project-specific assumptions clearly and provide an adaptation path where practical.
- Do not include credentials, private URLs, customer data, local file paths, or copied internal history.
- Preserve the distinction between an accepted checkpoint and unaccepted work; traceability must use real commit IDs only.

## Writing style

Skills should help an agent make a safe next decision. State the intended scope, proof required, and cases where the skill should stop or ask for clarification. Avoid prescribing a tool or architecture unless it is essential to the workflow.

If you add a supporting reference, link to it from the skill using a relative path and explain when it should be read.

## Pull requests

Describe the workflow problem, the intended trigger, and how you exercised the change. Small, focused pull requests are easiest to review.
