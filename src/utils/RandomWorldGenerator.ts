import { v4 } from "uuid";
import { Arena, ARENADIFFICULTY } from "../game/Arena";
import { Location, LocationId, LOCATIONSTATUS, WORLDLOCATIONTYPE } from "../models/World";
import { ArenaForestEncounter } from "../data/ArenaForestEncounter";
import { arnd, rnd } from "rndlib";
import { EmptyArena } from "../data/EmptyArena";
import { Campaign } from "../models/Campaign";
import { ArenaDragonsLair } from "../data/ArenaDragonsLair";

interface worldGeneratorOptions {
	depth: number;
	width: number;
	startingDifficulty: ARENADIFFICULTY;
	curve: number;
	spread: number;
	starts: number;
}

export function generateRandomWorld(opts: Partial<worldGeneratorOptions>): Location[] {
	const options: worldGeneratorOptions = Object.assign(
		{
			depth: 10,
			width: 9,
			startingDifficulty: ARENADIFFICULTY.VERYEASY,
			curve: 2,
			spread: 3,
			starts: 1,
		},
		opts,
	);

	const locs: Location[] = [];

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

	const locsMap: (Location | null)[][] = [];


	// A function regexp that checks a email validity


	const sDiffIndex = diffs.findIndex((d) => d === options.startingDifficulty);

	for (let d = 0; d < options.depth; d++) {
		let pos = rnd(0, 2);

		const dLocs: (Location | null)[] = new Array(options.width).fill(null);

		const difInd = sDiffIndex + Math.round(d / (options.depth / options.curve));

		const dif = difInd < diffs.length - 1 ? diffs[difInd] : diffs[diffs.length - 1];

		while (pos < options.width) {
			const nloc = randomLocation(dif, d === 0);
			nloc.name = `Loc ${d}-${pos}`;
			nloc.loc = {
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
	locsMap[options.depth][Math.floor(options.width / 2)] = {
		id: v4(),
		name: `BOSS`,
		status: LOCATIONSTATUS.LOCKED,
		type: WORLDLOCATIONTYPE.ARENA,
		arena: [new ArenaDragonsLair()],
		nextLocations: [],
		flags: [],
		icon: "forest",
		loc: {
			x: Math.floor(options.width / 2),
			y: options.depth,
			dx: rnd(0, 100) / 100,
			dy: rnd(0, 100) / 100,
		},
		init: function (c: Campaign) {
			this.arena = [new EmptyArena()];
		},
	};

	// Then create connections to these locations from the previous depth

	// console.log(locsMap);
	calculateEdgeConnections(locsMap);

	// Populate the locations with arenas

	return locsMap.flatMap((l) => l.filter((l) => l !== null)) as Location[];

}

function calculateEdgeConnections(locs: (Location | null)[][]): void {
	const rows = locs.length;
	const cols = locs[0].length;

	const edges: Array<[number, number, number, number]> = [];

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

			currentNode.nextLocations = nextRowNodes;
		}
	}
}

export function randomLocation(difficulty: ARENADIFFICULTY, first: boolean): Location {
	const arena = randomArena(difficulty);

	const loc: Location = {
		id: v4(),
		status: LOCATIONSTATUS.LOCKED,
		type: WORLDLOCATIONTYPE.ARENA,
		arena: [Arena.clone(arena)],
		nextLocations: [],
		flags: [],
		icon: "forest",
		init: function (campaign) {
			this.arena = [Arena.clone(arena)];
		},
	};

	if (first) {
		loc.flags.push("first");
	}

	return loc;
}

function randomArena(diff: ARENADIFFICULTY): Arena {
	return new ArenaForestEncounter(diff);
}

