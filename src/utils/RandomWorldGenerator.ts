import { v4 } from "uuid";
import { Arena } from "../game/Arena";
import { LocationData, LocationId, LOCATIONSTATUS, WORLDLOCATIONTYPE } from "../models/World";
import { ArenaForestEncounter } from "../data/ArenaForestEncounter";
import { arnd, rnd } from "rndlib";
import { EmptyArena } from "../data/EmptyArena";
import { Campaign } from "../models/Campaign";
import { ArenaDragonsLair } from "../data/ArenaDragonsLair";
import { ARENADIFFICULTY } from "../data/Difficulties";

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

export function generateRandomWorld(opts: Partial<worldGeneratorOptions>): LocationData[] {
	const options: worldGeneratorOptions = Object.assign(
		{
			depth: 10,
			width: 9,
			startingDifficulty: ARENADIFFICULTY.VERYEASY,
			curve: 2,
			spread: 3,
			starts: 1,
			villages: 4,
			theme: ["FOREST", "MOUNTAIN"],
		},
		opts,
	);

	const locs: LocationData[] = [];

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

	const locsMap: (LocationData | null)[][] = [];


	// A function regexp that checks a email validity


	const sDiffIndex = diffs.findIndex((d) => d === options.startingDifficulty);

	for (let d = 0; d < options.depth; d++) {
		let pos = rnd(0, 2);

		const dLocs: (LocationData | null)[] = new Array(options.width).fill(null);

		const difInd = sDiffIndex + Math.round(d / (options.depth / options.curve));

		const dif = difInd < diffs.length - 1 ? diffs[difInd] : diffs[diffs.length - 1];

		while (pos < options.width) {
			const nloc = randomLocation(dif, d === 0, options.theme);
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
			this.arena = [new ArenaDragonsLair()];
		},
	};


	// console.log("\nVillages!");
	// // Set Village locations at random
	// for(let i = 0; i < options.villages; i++) {
	// 	const l = randomVillage(locsMap);
		
	// }



	// Then create connections to these locations from the previous depth
	calculateEdgeConnections(locsMap);


	


	// Populate the locations with arenas

	return locsMap.flatMap((l) => l.filter((l) => l !== null)) as LocationData[];

}

function calculateEdgeConnections(locs: (LocationData | null)[][]): void {
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

export function randomLocation(difficulty: ARENADIFFICULTY, first: boolean, themes: string[]): LocationData {
	
	const theme = arnd(themes);
	
	const arena = randomArena(difficulty, theme);

	const loc: LocationData = {
		id: v4(),
		status: LOCATIONSTATUS.LOCKED,
		type: WORLDLOCATIONTYPE.ARENA,
		arena: [Arena.clone(arena)],
		nextLocations: [],
		flags: [],
		icon: theme.toLowerCase(),
		init: function (campaign) {
			this.arena = [Arena.clone(arena)];
		},
	};

	if (first) {
		loc.flags.push("first");
	}

	return loc;
}

export function randomVillage(locsMap: (LocationData | null)[][] ): LocationData {

	const vloc: LocationData = {
		id: v4(),
		status: LOCATIONSTATUS.LOCKED,
		type: WORLDLOCATIONTYPE.VILLAGE,
		arena: [new EmptyArena()],
		nextLocations: [],
		flags: [],
		icon: "tent",
		init: function (campaign) {
			this.arena = [new EmptyArena()];
		}
	};

	let isValidLocation = false;

	while(isValidLocation === false) {
		const rDept = rnd(2, locsMap.length - 2);
		const rCol = rnd(0, locsMap[rDept].length - 1);

		if(locsMap[rDept][rCol] === null) continue;

		// If current depth already has a village, skip
		if(locsMap[rDept].some(l => l !== null && l.type === WORLDLOCATIONTYPE.VILLAGE)) continue;
		
		// If target location is already a village, skip
		if(locsMap[rDept][rCol]!.type === WORLDLOCATIONTYPE.VILLAGE) continue;


		if(locsMap[rDept][rCol] !== null) {
			isValidLocation = true;
			console.log(rDept, rCol, vloc);

			vloc.loc = {
				x: rCol,
				y: rDept,
				dx: rnd(0, 100) / 100,
				dy: rnd(0, 100) / 100,
			};

			locsMap[rDept][rCol] = vloc;
		}
	}
	
	
	
	

	return vloc;
}

function randomArena(diff: ARENADIFFICULTY, theme: string): Arena {
	return Arena.generate(diff, theme);	

	// return new ArenaForestEncounter(diff);
}

