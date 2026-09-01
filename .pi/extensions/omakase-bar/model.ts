import { existsSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, resolve } from "node:path";

export const OPEN_WORKSTREAM_STATUSES = ["active", "next", "user-testing", "backlog"] as const;

export type OpenWorkstreamStatus = (typeof OPEN_WORKSTREAM_STATUSES)[number];
export type RoadmapCheckpointStatus = "accepted" | "next" | "planned";

export interface Workstream {
	name: string;
	status: string;
	currentState: string;
	lastCheckpoint: string;
	nextCheckpoint: string;
	readFirst: string;
	codeEntry: string;
}

export interface AssociatedDocument {
	displayPath: string;
	absolutePath: string;
}

export interface RoadmapCheckpoint {
	code: string;
	title: string;
	status: RoadmapCheckpointStatus;
	document: AssociatedDocument;
}

export interface WorkstreamRoadmap {
	workstream: Workstream;
	documents: AssociatedDocument[];
	checkpoints: RoadmapCheckpoint[];
	progress: number;
}

function splitTableRow(line: string): string[] {
	const cells: string[] = [];
	let cell = "";
	let escaped = false;

	for (const character of line.slice(1, -1)) {
		if (escaped) {
			cell += character;
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			cell += character;
			continue;
		}
		if (character === "|") {
			cells.push(cell.trim());
			cell = "";
			continue;
		}
		cell += character;
	}
	cells.push(cell.trim());
	return cells;
}

export function parseCheckpointMap(markdown: string): Workstream[] {
	const workstreams: Workstream[] = [];
	let inWorkstreamTable = false;

	for (const line of markdown.split(/\r?\n/)) {
		if (line.startsWith("| Workstream | Status |")) {
			inWorkstreamTable = true;
			continue;
		}
		if (!inWorkstreamTable) continue;
		if (!line.startsWith("|")) break;
		if (/^\|[\s|-]+\|$/.test(line)) continue;

		const cells = splitTableRow(line);
		if (cells.length !== 7) continue;
		workstreams.push({
			name: cells[0],
			status: cells[1],
			currentState: cells[2],
			lastCheckpoint: cells[3],
			nextCheckpoint: cells[4],
			readFirst: cells[5],
			codeEntry: cells[6],
		});
	}

	return workstreams;
}

export function isOpenWorkstream(workstream: Workstream): workstream is Workstream & { status: OpenWorkstreamStatus } {
	return OPEN_WORKSTREAM_STATUSES.includes(workstream.status as OpenWorkstreamStatus);
}

function resolveDocumentPath(projectRoot: string, path: string): string {
	if (path.startsWith("~/")) return resolve(homedir(), path.slice(2));
	if (isAbsolute(path)) return path;
	return resolve(projectRoot, path);
}

export function extractAssociatedDocuments(workstream: Workstream, projectRoot: string): AssociatedDocument[] {
	const documents: AssociatedDocument[] = [];
	const seen = new Set<string>();
	let contextualDirectory: { displayPath: string; absolutePath: string } | undefined;

	for (const match of workstream.readFirst.matchAll(/`([^`]+)`/g)) {
		const token = match[1];
		if (!token.endsWith(".md")) {
			const directory = resolveDocumentPath(projectRoot, token);
			if (existsSync(directory) && statSync(directory).isDirectory()) {
				contextualDirectory = { displayPath: token, absolutePath: directory };
			}
			continue;
		}

		let displayPath = token;
		let absolutePath = resolveDocumentPath(projectRoot, token);
		if (!existsSync(absolutePath) && contextualDirectory) {
			displayPath = `${contextualDirectory.displayPath}/${token}`;
			absolutePath = resolve(contextualDirectory.absolutePath, token);
		}
		if (seen.has(absolutePath) || !existsSync(absolutePath)) continue;
		seen.add(absolutePath);
		documents.push({ displayPath, absolutePath });
	}
	return documents;
}

interface ParsedCheckpointHeading {
	code: string;
	title: string;
}

export function parseCheckpointHeadings(markdown: string): ParsedCheckpointHeading[] {
	const checkpoints: ParsedCheckpointHeading[] = [];
	const seen = new Set<string>();
	let inFence = false;

	for (const line of markdown.split(/\r?\n/)) {
		if (/^\s*```/.test(line)) {
			inFence = !inFence;
			continue;
		}
		if (inFence) continue;
		const heading = line.match(/^#{2,4}\s+(?:Checkpoint\s+)?([A-Z][A-Z0-9-]*\d[A-Z0-9-]*)\s*(?::|—|–|-)\s*(.+?)\s*$/);
		if (!heading || seen.has(heading[1])) continue;
		seen.add(heading[1]);
		checkpoints.push({ code: heading[1], title: heading[2].replaceAll("**", "").trim() });
	}
	return checkpoints;
}

function checkpointCodeFromNext(nextCheckpoint: string): string | undefined {
	return nextCheckpoint.match(/\b([A-Z][A-Z0-9-]*\d[A-Z0-9-]*)\b/)?.[1];
}

function acceptedCodesFromMap(workstream: Workstream, knownCodes: string[]): Set<string> {
	const accepted = new Set<string>();
	const known = new Set(knownCodes);
	const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
	const evidence = `${workstream.currentState}. ${workstream.lastCheckpoint}`;

	for (const sentence of evidence.split(/[.!?]/)) {
		if (!/\b(?:accepted|landed|completed)\b/i.test(sentence)) continue;
		const mentionedCodes = sentence.match(/\b[A-Z][A-Z0-9-]*\d[A-Z0-9-]*\b/g) ?? [];
		for (const code of mentionedCodes) {
			if (known.has(code)) accepted.add(code);
		}
		for (const range of sentence.matchAll(/\b([A-Z][A-Z0-9-]*\d[A-Z0-9-]*)\s+through\s+([A-Z][A-Z0-9-]*\d[A-Z0-9-]*)\b/gi)) {
			const [, start, end] = range;
			for (const code of knownCodes) {
				if (collator.compare(code, start) >= 0 && collator.compare(code, end) <= 0) accepted.add(code);
			}
		}
	}
	return accepted;
}

function progressFor(workstream: Workstream, checkpoints: RoadmapCheckpoint[]): number {
	if (checkpoints.length > 0) {
		const accepted = checkpoints.filter((checkpoint) => checkpoint.status === "accepted").length;
		const next = checkpoints.some((checkpoint) => checkpoint.status === "next") ? 0.35 : 0;
		return Math.max(3, Math.min(97, Math.round(((accepted + next) / checkpoints.length) * 100)));
	}

	switch (workstream.status) {
		case "user-testing": return 90;
		case "active": return 50;
		case "next": return 15;
		case "backlog": return 5;
		case "landed-watch":
		case "stable":
		case "historical": return 100;
		default: return 0;
	}
}

export function buildWorkstreamRoadmap(workstream: Workstream, projectRoot: string): WorkstreamRoadmap {
	const documents = extractAssociatedDocuments(workstream, projectRoot);
	const declaredNextCode = checkpointCodeFromNext(workstream.nextCheckpoint);
	const checkpoints: RoadmapCheckpoint[] = [];
	const seen = new Set<string>();

	for (const document of documents) {
		const headings = parseCheckpointHeadings(readFileSync(document.absolutePath, "utf8"));

		for (const heading of headings) {
			if (seen.has(heading.code)) continue;
			seen.add(heading.code);

			const status: RoadmapCheckpointStatus = heading.code === declaredNextCode ? "next" : "planned";
			checkpoints.push({ ...heading, status, document });
		}
	}

	const acceptedCodes = acceptedCodesFromMap(workstream, checkpoints.map((checkpoint) => checkpoint.code));
	for (const checkpoint of checkpoints) {
		if (checkpoint.status !== "next" && acceptedCodes.has(checkpoint.code)) checkpoint.status = "accepted";
	}

	return {
		workstream,
		documents,
		checkpoints,
		progress: progressFor(workstream, checkpoints),
	};
}

export function loadOpenWorkstreamRoadmaps(projectRoot: string): WorkstreamRoadmap[] {
	const mapPath = resolve(projectRoot, "docs/plans/checkpoint-map.md");
	const workstreams = parseCheckpointMap(readFileSync(mapPath, "utf8"));
	return workstreams.filter(isOpenWorkstream).map((workstream) => buildWorkstreamRoadmap(workstream, projectRoot));
}
