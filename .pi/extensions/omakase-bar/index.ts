import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, parse, resolve } from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { DynamicBorder } from "@earendil-works/pi-coding-agent";
import { Container, Key, matchesKey, Text, truncateToWidth, visibleWidth, wrapTextWithAnsi } from "@earendil-works/pi-tui";
import {
	loadOpenWorkstreamRoadmaps,
	type RoadmapCheckpoint,
	type WorkstreamRoadmap,
} from "./model.ts";

const STATUS_ORDER = new Map([
	["active", 0],
	["next", 1],
	["user-testing", 2],
	["backlog", 3],
]);

interface StartSelection {
	roadmap: WorkstreamRoadmap;
	checkpoint?: RoadmapCheckpoint;
}

type DetailAction =
	| { kind: "back" }
	| { kind: "open"; path: string }
	| { kind: "start"; checkpoint?: RoadmapCheckpoint };

function findProjectRoot(cwd: string): string | undefined {
	let candidate = resolve(cwd);
	const filesystemRoot = parse(candidate).root;
	while (true) {
		if (existsSync(resolve(candidate, "docs/plans/checkpoint-map.md"))) return candidate;
		if (candidate === filesystemRoot) return undefined;
		candidate = dirname(candidate);
	}
}

function progressBar(progress: number, width = 12): string {
	const filled = Math.round((progress / 100) * width);
	return `[${"█".repeat(filled)}${"░".repeat(width - filled)}] ${String(progress).padStart(3)}%`;
}

function checkpointGlyph(status: RoadmapCheckpoint["status"]): string {
	switch (status) {
		case "accepted": return "✓";
		case "next": return "▶";
		case "planned": return "○";
	}
}

interface CardMenuItem {
	value: string;
	title: string;
	description: string;
	badge: string;
	disabledMessage?: string;
}

function padLine(text: string, width: number): string {
	return `${text}${" ".repeat(Math.max(0, width - visibleWidth(text)))}`;
}

function renderCard(
	item: CardMenuItem,
	width: number,
	selected: boolean,
	theme: ExtensionContext["ui"]["theme"],
): string[] {
	const cardWidth = Math.max(8, width);
	const innerWidth = Math.max(1, cardWidth - 4);
	const horizontal = selected ? "═" : "─";
	const topLeft = selected ? "╔" : "┌";
	const topRight = selected ? "╗" : "┐";
	const side = selected ? "║" : "│";
	const bottomLeft = selected ? "╚" : "└";
	const bottomRight = selected ? "╝" : "┘";
	const border = (text: string) => theme.fg(selected ? "accent" : "borderMuted", text);
	const title = (text: string) => theme.fg(selected ? "accent" : "text", selected ? theme.bold(text) : text);
	const description = (text: string) => theme.fg("muted", text);
	const badge = ` ${truncateToWidth(item.badge, Math.max(1, cardWidth - 4), "")} `;
	const topFill = Math.max(0, cardWidth - visibleWidth(badge) - 2);
	const lines = [border(`${topLeft}${badge}${horizontal.repeat(topFill)}${topRight}`)];

	for (const line of wrapTextWithAnsi(item.title, innerWidth)) {
		lines.push(`${border(`${side} `)}${title(padLine(line, innerWidth))}${border(` ${side}`)}`);
	}
	for (const line of wrapTextWithAnsi(item.description, innerWidth)) {
		lines.push(`${border(`${side} `)}${description(padLine(line, innerWidth))}${border(` ${side}`)}`);
	}
	lines.push(border(`${bottomLeft}${horizontal.repeat(cardWidth - 2)}${bottomRight}`));
	return lines;
}

async function showCardMenu(
	ctx: ExtensionContext,
	title: string,
	intro: string,
	items: CardMenuItem[],
	help: string,
): Promise<string | null> {
	return ctx.ui.custom<string | null>((tui, theme, _keybindings, done) => {
		let selectedIndex = 0;
		const cards = {
			render(width: number): string[] {
				const rendered = items.map((item, index) => renderCard(item, width, index === selectedIndex, theme));
				const rowBudget = Math.max(8, tui.terminal.rows - 11);
				let start = selectedIndex;
				let end = selectedIndex;
				let usedRows = rendered[selectedIndex]?.length ?? 0;

				while (true) {
					let changed = false;
					if (end + 1 < rendered.length && usedRows + rendered[end + 1].length <= rowBudget) {
						end += 1;
						usedRows += rendered[end].length;
						changed = true;
					}
					if (start > 0 && usedRows + rendered[start - 1].length <= rowBudget) {
						start -= 1;
						usedRows += rendered[start].length;
						changed = true;
					}
					if (!changed) break;
				}

				return [
					...rendered.slice(start, end + 1).flat(),
					theme.fg("dim", `(${selectedIndex + 1}/${items.length})`),
				];
			},
			invalidate() {},
			handleInput(data: string) {
				if (matchesKey(data, Key.up)) selectedIndex = Math.max(0, selectedIndex - 1);
				else if (matchesKey(data, Key.down)) selectedIndex = Math.min(items.length - 1, selectedIndex + 1);
				else if (matchesKey(data, Key.home)) selectedIndex = 0;
				else if (matchesKey(data, Key.end)) selectedIndex = items.length - 1;
				else if (matchesKey(data, Key.enter)) {
					const item = items[selectedIndex];
					if (item.disabledMessage) ctx.ui.notify(item.disabledMessage, "info");
					else done(item.value);
				} else if (matchesKey(data, Key.escape)) done(null);
				tui.requestRender();
			},
		};

		const container = new Container();
		container.addChild(new DynamicBorder((text: string) => theme.fg("accent", text)));
		container.addChild(new Text(theme.fg("accent", theme.bold(title)), 1, 0));
		container.addChild(new Text(theme.fg("dim", intro), 1, 0));
		container.addChild(cards);
		container.addChild(new Text(theme.fg("dim", help), 1, 0));
		container.addChild(new DynamicBorder((text: string) => theme.fg("accent", text)));
		return {
			render: (width: number) => container.render(width),
			invalidate: () => container.invalidate(),
			handleInput: (data: string) => cards.handleInput(data),
		};
	});
}

async function showWorkstreamList(
	ctx: ExtensionContext,
	roadmaps: WorkstreamRoadmap[],
	title: string,
): Promise<WorkstreamRoadmap | undefined> {
	const sorted = [...roadmaps].sort((left, right) => {
		const statusDifference = (STATUS_ORDER.get(left.workstream.status) ?? 99) - (STATUS_ORDER.get(right.workstream.status) ?? 99);
		return statusDifference || left.workstream.name.localeCompare(right.workstream.name);
	});
	const items: CardMenuItem[] = sorted.map((roadmap, index) => ({
		value: String(index),
		title: roadmap.workstream.name,
		description: `Next: ${roadmap.workstream.nextCheckpoint}`,
		badge: `${progressBar(roadmap.progress)}  ${roadmap.workstream.status}`,
	}));
	const selected = await showCardMenu(
		ctx,
		title,
		"Progress shows accepted roadmap checkpoints, not effort or time.",
		items,
		"↑↓ navigate · enter inspect · esc close",
	);
	if (selected === null) return undefined;
	return sorted[Number(selected)];
}

async function showRoadmapDetail(ctx: ExtensionContext, roadmap: WorkstreamRoadmap): Promise<DetailAction> {
	const items: CardMenuItem[] = [{
		value: "start-next",
		title: "Start the declared next work",
		description: roadmap.workstream.nextCheckpoint,
		badge: `▶ next  ${progressBar(roadmap.progress)}`,
	}];

	for (const [index, checkpoint] of roadmap.checkpoints.entries()) {
		items.push({
			value: checkpoint.status === "accepted" ? `accepted:${index}` : `start:${index}`,
			title: `${checkpointGlyph(checkpoint.status)} ${checkpoint.code}  ${checkpoint.title}`,
			description: checkpoint.document.displayPath,
			badge: checkpoint.status,
			disabledMessage: checkpoint.status === "accepted" ? "That checkpoint is already accepted." : undefined,
		});
	}
	for (const [index, document] of roadmap.documents.entries()) {
		items.push({
			value: `open:${index}`,
			title: document.displayPath,
			description: "Open this file in Neovim.",
			badge: "plan/doc",
		});
	}
	items.push({ value: "back", title: "Back", description: "Return to all open workstreams.", badge: "navigation" });

	const selected = await showCardMenu(
		ctx,
		roadmap.workstream.name,
		`${roadmap.workstream.status} · ${roadmap.workstream.nextCheckpoint}`,
		items,
		"↑↓ navigate · enter starts or opens · esc back",
	);
	if (selected === null || selected === "back") return { kind: "back" };
	if (selected === "start-next") return { kind: "start" };
	if (selected.startsWith("open:")) {
		const document = roadmap.documents[Number(selected.slice(5))];
		return { kind: "open", path: document.absolutePath };
	}
	const checkpoint = roadmap.checkpoints[Number(selected.slice(6))];
	return { kind: "start", checkpoint };
}

async function openInNeovim(ctx: ExtensionContext, path: string): Promise<void> {
	if (ctx.mode !== "tui") {
		ctx.ui.notify("Opening Neovim requires Pi's interactive TUI.", "error");
		return;
	}

	const result = await ctx.ui.custom<{ status: number | null; error?: string }>((tui, _theme, _keybindings, done) => {
		tui.stop();
		process.stdout.write("\x1b[2J\x1b[H");
		let status: number | null = null;
		let error: string | undefined;
		try {
			const child = spawnSync("nvim", [path], { stdio: "inherit", cwd: dirname(path), env: process.env });
			status = child.status;
			error = child.error?.message;
		} finally {
			tui.start();
			tui.requestRender(true);
		}
		done({ status, error });
		return { render: () => [], invalidate: () => {} };
	});

	if (result.error || result.status !== 0) {
		ctx.ui.notify(result.error ?? `Neovim exited with code ${String(result.status)}`, "error");
	}
}

function startPrompt(selection: StartSelection): string {
	const { roadmap, checkpoint } = selection;
	const target = checkpoint
		? `${checkpoint.code}: ${checkpoint.title}`
		: roadmap.workstream.nextCheckpoint;
	const documents = roadmap.documents.map((document) => `- ${document.displayPath}`).join("\n") || "- No resolvable Markdown path is listed.";

	return `Start work on the selected Omakase checkpoint.\n\nWorkstream: ${roadmap.workstream.name}\nMap status: ${roadmap.workstream.status}\nSelected checkpoint: ${target}\nDeclared next work: ${roadmap.workstream.nextCheckpoint}\n\nRead-first documents:\n${documents}\n\nCode entry:\n${roadmap.workstream.codeEntry}\n\nFirst use omakase-session-orient. Confirm this is one runnable checkpoint. Then use the lightest required planning or implementation skill. Do not absorb unrelated work.`;
}

async function runNavigator(
	pi: ExtensionAPI,
	ctx: ExtensionContext,
	title: string,
): Promise<void> {
	if (ctx.mode !== "tui") {
		ctx.ui.notify("Omakase Bar requires Pi's interactive TUI.", "error");
		return;
	}
	if (!ctx.isIdle()) {
		ctx.ui.notify("Wait for the current agent turn before opening Omakase Bar.", "warning");
		return;
	}

	const projectRoot = findProjectRoot(ctx.cwd);
	if (!projectRoot) {
		ctx.ui.notify("Could not find docs/plans/checkpoint-map.md from this working directory.", "error");
		return;
	}

	let roadmaps: WorkstreamRoadmap[];
	try {
		roadmaps = loadOpenWorkstreamRoadmaps(projectRoot);
	} catch (error) {
		ctx.ui.notify(`Could not load checkpoint map: ${error instanceof Error ? error.message : String(error)}`, "error");
		return;
	}
	if (roadmaps.length === 0) {
		ctx.ui.notify("The checkpoint map has no open workstreams.", "info");
		return;
	}

	while (true) {
		const roadmap = await showWorkstreamList(ctx, roadmaps, title);
		if (!roadmap) return;

		while (true) {
			const action = await showRoadmapDetail(ctx, roadmap);
			if (action.kind === "back") break;
			if (action.kind === "open") {
				await openInNeovim(ctx, action.path);
				continue;
			}

			const selection = { roadmap, checkpoint: action.checkpoint };
			pi.setSessionName(`${roadmap.workstream.name}: ${action.checkpoint?.code ?? "next"}`);
			pi.sendUserMessage(startPrompt(selection));
			return;
		}
	}
}

export default function omakaseBar(pi: ExtensionAPI) {
	pi.registerCommand("work-status", {
		description: "Browse open Omakase workstreams, roadmaps, progress, and plans",
		handler: async (_args, ctx) => runNavigator(pi, ctx, "Omakase work status"),
	});
}
