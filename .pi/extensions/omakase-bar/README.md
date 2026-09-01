# Omakase Bar

This project-local Pi extension reads `docs/plans/checkpoint-map.md`. It does not keep a second workstream database.

The extension is development tooling for Pi. It is not part of the Omakase application. It does not load into Electron or ship in Omakase builds.

## Command

`/work-status` shows each open workstream and its roadmap. It can also select a workstream or checkpoint and start it in the current Pi session.

The command shows workstreams with these map states:

- `active`
- `next`
- `user-testing`
- `backlog`

Each menu item uses a bordered card. The card wraps the full name and description to the terminal width.

Select a workstream to see its declared next work, roadmap checkpoints, and linked Markdown files. Select a linked file to open it in Neovim.

Selecting work starts an agent turn. The extension names the session and sends the selected map row as the task context. The task tells the agent to run `omakase-session-orient` first.

## Progress bars

A progress bar shows the ratio of accepted checkpoints in the parsed roadmap. The selected next checkpoint counts as 35 percent of one checkpoint.

The bar does not estimate effort or time. If the linked plans contain no checkpoint headings, the extension uses a map-state fallback.

## Roadmap parsing

The extension gets associated documents from backtick-wrapped Markdown paths in the map's `Read first` cell. It reads checkpoint headings such as:

```md
### CC0: Frozen environment manifest
### CC1: Profile Plan, Materialize, and Act
```

The extension marks headings before the declared next checkpoint as accepted. It marks the declared checkpoint as next. Later headings remain planned.

## Checks

Run these commands from the project root:

```bash
node --experimental-strip-types .pi/extensions/omakase-bar/model.contract.ts
npx tsc -p .pi/extensions/omakase-bar/tsconfig.json
```

Run `/reload` after an extension change. Then test `/work-status` in Pi's TUI.
