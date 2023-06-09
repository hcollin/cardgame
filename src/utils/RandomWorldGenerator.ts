import { v4 } from "uuid";
import { Arena } from "../game/Arena";
import { LocationData, LocationId, LOCATIONSTATUS, WORLDLOCATIONTYPE } from "../models/LocationModels";

import { arnd, rnd } from "rndlib";
import { EmptyArena } from "../data/EmptyArena";
import { Campaign } from "../models/Campaign";
import { ArenaDragonsLair } from "../data/ArenaDragonsLair";
import { ARENADIFFICULTY } from "../data/Difficulties";
import WorldLocation, { ArenaWorldLocation, VillageWorldLocation } from "../game/WorldLocation";

interface worldGeneratorOptions {
	depth: number;
	width: number;
	startingDifficulty: ARENADIFFICULTY;
	curve: number;
	spread: number;
	starts: number;
	villages: number;
	theme: string[];
}

export function generateRandomWorld(opts: Partial<worldGeneratorOptions>): WorldLocation[] {
	const options: worldGeneratorOptions = Object.assign(
		{
			depth: 10,
			width: 9,
			startingDifficulty: ARENADIFFICULTY.VERYEASY,
			curve: 2,
			spread: 3,
			starts: 1,
			villages: 5,
			theme: ["FOREST", "MOUNTAIN"],
		},
		opts,
	);

	const diffs: ARENADIFFICULTY[] = [
		ARENADIFFICULTY.VERYEASY,
		ARENADIFFICULTY.EASY,
		ARENADIFFICULTY.MEDIUM,
		ARENADIFFICULTY.HARD,
		ARENADIFFICULTY.VERYHARD,
		ARENADIFFICULTY.EXTREME,
		ARENADIFFICULTY.INSANE,
	];

	// For each depth, generate a random amount of locations where the distance between each location is between 2 and spread

	const locsMap: (WorldLocation | null)[][] = [];

	// A function regexp that checks a email validity

	const sDiffIndex = diffs.findIndex((d) => d === options.startingDifficulty);

	for (let d = 0; d < options.depth; d++) {
		let pos = rnd(0, 2);

		const dLocs: (WorldLocation | null)[] = new Array(options.width).fill(null);

		const difInd = sDiffIndex + Math.round(d / (options.depth / options.curve));

		const dif = difInd < diffs.length - 1 ? diffs[difInd] : diffs[diffs.length - 1];

		while (pos < options.width) {
			const nloc = randomArenaLocation(dif, d === 0, options.theme, false);
			// nloc.name = `Loc ${d}-${pos}`;
			nloc.worldPos = {
				x: pos,
				y: d,
				dx: rnd(0, 100) / 100,
				dy: rnd(0, 100) / 100,
			};

			dLocs[pos] = nloc;

			pos += rnd(2, options.spread);
		}

		locsMap[d] = [...dLocs];
	}

	// Then create a final location with a boss arena

	// console.log(locsMap.length, locsMap[options.depth]);

	locsMap[options.depth] = new Array(options.width).fill(null);

	const bossLoc = new ArenaWorldLocation(arnd(options.theme), ARENADIFFICULTY.MEDIUM);

	bossLoc.worldPos.x = Math.floor(options.width / 2);
	bossLoc.worldPos.y = options.depth;
	bossLoc.worldPos.dx = rnd(0, 100) / 100;
	bossLoc.worldPos.dy = rnd(0, 100) / 100;
	bossLoc.flags.push("final");

	bossLoc.createBossArena();

	locsMap[options.depth][Math.floor(options.width / 2)] = bossLoc;

	// console.log("\nVillages!");
	// // Set Village locations at random

	const minVillages = Math.round((options.depth - 2) / 3);
	const maxVillages = Math.round((options.depth - 2) / 2);
	const villageCount = rnd(minVillages, maxVillages);
	// console.log("Village count:", minVillages, maxVillages, villageCount);

	for (let i = 0; i < villageCount; i++) {
		const l = randomVillage(locsMap, i, villageCount);
	}

	// Then create connections to these locations from the previous depth
	calculateEdgeConnections(locsMap);

	// Populate the locations with arenas

	return locsMap.flatMap((l) => l.filter((l) => l !== null)) as WorldLocation[];
}

function calculateEdgeConnections(locs: (WorldLocation | null)[][]): void {
	const rows = locs.length;
	const cols = locs[0].length;

	// const edges: Array<[number, number, number, number]> = [];

	for (let i = 0; i < rows - 1; i++) {
		for (let j = 0; j < cols; j++) {
			const currentNode = locs[i][j];
			if (!currentNode) continue;

			const nextRowNodes: Array<LocationId> = [];
			// const routeCount = arnd([1, 1, 1, 2, 2, 3]);

			for (let k = Math.max(j - 2, 0); k <= Math.min(j + 2, cols - 1); k++) {
				// for (let k = 1; k <= routeCount; k++) {
				const nextNode = locs[i + 1][k];
				if (nextNode) {
					nextRowNodes.push(nextNode.id);
				}
			}

			// Ensure at least one connection
			if (nextRowNodes.length === 0) {
				const nextNonNullNodeIndex = locs[i + 1].findIndex((node) => node !== null);
				if (nextNonNullNodeIndex !== -1) {
					nextRowNodes.push(locs[i + 1][nextNonNullNodeIndex]!.id);
				}
			}

			currentNode.nextLocationIds = nextRowNodes;
		}
	}
}

export function randomArenaLocation(difficulty: ARENADIFFICULTY, first: boolean, themes: string[], boss: boolean): WorldLocation {
	const theme = arnd(themes);

	const worldLoc = new ArenaWorldLocation(theme, difficulty);

	boss ? worldLoc.createBossArena() : worldLoc.createArena();

	// const arena = randomArena(difficulty, theme);

	// const loc: LocationData = {
	// 	id: v4(),
	// 	status: LOCATIONSTATUS.LOCKED,
	// 	type: WORLDLOCATIONTYPE.ARENA,
	// 	arena: [Arena.clone(arena)],
	// 	nextLocations: [],
	// 	flags: [],
	// 	icon: theme.toLowerCase(),
	// 	init: function (campaign) {
	// 		this.arena = [Arena.clone(arena)];
	// 	},
	// };

	if (first) {
		worldLoc.flags.push("first");
	}

	return worldLoc;
}

export function randomVillage(locsMap: (WorldLocation | null)[][], vind: number, vmax: number): VillageWorldLocation {
	const vloc = new VillageWorldLocation();

	let isValidLocation = false;

	const varea = Math.max(1, Math.round((locsMap.length -2) / vmax));

	const minD = Math.max(1, varea * vind);
	const maxD = Math.min(varea * vind + varea, locsMap.length - 2);

	// console.log(`${vind}/${vmax} ${minD}-${maxD} ${locsMap.length} ${varea * vind + varea}`);

	let looper = 0;
	while (isValidLocation === false) {
		// const rDept = rnd(Math.min(minD, maxD), Math.max(minD, maxD));
		const rDept = rnd(minD, maxD);
		const rCol = rnd(0, locsMap[rDept].length - 1);

		if (locsMap[rDept][rCol] === null) continue;

		// if previous depth has a village, skip
		if (locsMap[rDept - 1].some((l) => l !== null && l.type === WORLDLOCATIONTYPE.VILLAGE)) continue;

		// If current depth already has a village, skip
		if (locsMap[rDept].some((l) => l !== null && l.type === WORLDLOCATIONTYPE.VILLAGE)) continue;

		// If target location is already a village, skip
		if (locsMap[rDept][rCol]!.type === WORLDLOCATIONTYPE.VILLAGE) continue;

		if (locsMap[rDept][rCol] !== null) {
			isValidLocation = true;
			// console.log(rDept, rCol, vloc);

			vloc.worldPos = {
				x: rCol,
				y: rDept,
				dx: rnd(0, 100) / 100,
				dy: rnd(0, 100) / 100,
			};

			locsMap[rDept][rCol] = vloc;
		}

		looper++;
		if (looper > 10) {
			throw new Error("Village location generation failed");
		}
	}

	return vloc;
}

function randomArena(diff: ARENADIFFICULTY, theme: string): Arena {
	return Arena.generate(diff, theme);

	// return new ArenaForestEncounter(diff);
}

