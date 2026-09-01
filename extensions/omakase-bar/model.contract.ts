import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
	buildWorkstreamRoadmap,
	extractAssociatedDocuments,
	loadOpenWorkstreamRoadmaps,
	parseCheckpointHeadings,
	parseCheckpointMap,
} from "./model.ts";

const projectRoot = resolve(import.meta.dirname, "../../..");
const mapMarkdown = readFileSync(resolve(projectRoot, "docs/plans/checkpoint-map.md"), "utf8");
const workstreams = parseCheckpointMap(mapMarkdown);

assert.ok(workstreams.length >= 50);
assert.equal(workstreams.find((row) => row.name === "Sushi context compilation")?.status, "active");
assert.match(workstreams.find((row) => row.name === "Table buffers")?.nextCheckpoint ?? "", /TB2B/);

const openRoadmaps = loadOpenWorkstreamRoadmaps(projectRoot);
const expectedOpenCount = workstreams.filter((row) => ["active", "next", "user-testing", "backlog"].includes(row.status)).length;
assert.equal(openRoadmaps.length, expectedOpenCount);
assert.ok(openRoadmaps.every((roadmap) => ["active", "next", "user-testing", "backlog"].includes(roadmap.workstream.status)));

const sushiWorkstream = workstreams.find((row) => row.name === "Sushi context compilation");
assert.ok(sushiWorkstream);
const sushiRoadmap = buildWorkstreamRoadmap(sushiWorkstream, projectRoot);
assert.ok(sushiRoadmap.documents.some((document) => document.displayPath.endsWith("sushi-context-compilation-plan.md")));
assert.equal(sushiRoadmap.checkpoints.find((checkpoint) => checkpoint.code === "CC0")?.status, "accepted");
assert.equal(sushiRoadmap.checkpoints.find((checkpoint) => checkpoint.code === "CC1")?.status, "next");
assert.equal(sushiRoadmap.checkpoints.find((checkpoint) => checkpoint.code === "CC2")?.status, "planned");
assert.ok(sushiRoadmap.progress > 0 && sushiRoadmap.progress < 100);

const contextualDocuments = extractAssociatedDocuments({
	name: "Fixture",
	status: "active",
	currentState: "none",
	lastCheckpoint: "none",
	nextCheckpoint: "none",
	readFirst: "`docs/plans`: `checkpoint-map.md`",
	codeEntry: "none",
}, projectRoot);
assert.equal(contextualDocuments[0]?.absolutePath, resolve(projectRoot, "docs/plans/checkpoint-map.md"));

assert.deepEqual(
	parseCheckpointHeadings("## Goal\n### CP0: First proof\n### CP1 — Second proof\n### Notes"),
	[
		{ code: "CP0", title: "First proof" },
		{ code: "CP1", title: "Second proof" },
	],
);

console.log("Omakase Bar model contract passed");
