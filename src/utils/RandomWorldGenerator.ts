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

	// let difIndex = diffs.indexOf(options.startingDifficulty);

	// const finalDifIndex = difIndex + (Math.round(options.depth / options.curve));
	// console.log("FINALDIFINDEX", diffs[finalDifIndex]);

	// let prevLoc: Location | null = null;

	// //TODO: All paths will lead to a single final location, so I need to build this logic backwards starting from the final location

	// const finalLocation = randomLocation(diffs[finalDifIndex], false);
	// finalLocation.name = "BOSS";
	// // Then I need to build build the paths as a tree, where each node has a link to the previous node and no node is missing a link to the previous node (except the first node)

	// locs.push(finalLocation);

	// function addNode(locs: Location[], cnode: Location, currentDepth: number, opts: worldGeneratorOptions): Location[] {

	// 	const difficulty = diffs[diffs.indexOf(options.startingDifficulty) + (Math.floor((opts.depth - currentDepth - 1) / opts.curve))];
	// 	const newNode = randomLocation(difficulty, false);

	// 	newNode.nextLocations.push(cnode.id);
	// 	if(currentDepth === opts.depth - 2) {
	// 		newNode.flags.push("first");
	// 	}
	// 	locs.push(newNode);

	// 	if (currentDepth < opts.depth - 2) {
	// 		const childCount = rnd(1, opts.spread);
	// 		let childLocs: Location[] = [...locs];
	// 		for (let i = 0; i < childCount; i++) {
	// 			childLocs = childLocs.concat(addNode(locs, newNode, currentDepth + 1, opts));
	// 		}
	// 		// const cloc = addNode(locs, newNode, currentDepth + 1, opts);
	// 		return childLocs;
	// 	}

	// 	return locs;
	// }

	// const flocs = addNode([finalLocation], finalLocation, 0, options);
	// console.log("FLOCS", flocs);
	// return flocs;

	// // Generate a starting locations with a random arenas
	// for (let i = 0; i < options.starts; i++) {
	// 	const diff = diffs[difIndex];
	// 	const loc = randomLocation(diff, i === 0);
	// 	loc.flags.push("first");
	// 	loc.name = `Loc ${i}`;
	// 	locs.push(loc);
	// }

	// let previousDepthNodes: Location[] = locs;
	// // Generate the rest of the locations where the amount of locations in each depth is between 1 and spread and location must have a link to one or more locations in the previous depth
	// for (let i = 1; i <= options.depth; i++) {
	// 	const nodesInDepth = rnd(1, options.spread);
	// 	const depthNodes: Location[] = [];
	// 	for (let j = 0; j < nodesInDepth; j++) {
	// 		const diff = diffs[difIndex];
	// 		const loc = randomLocation(diff, false);
	// 		loc.name = `Loc ${i}-${j}`;
	// 		const prevLoc = previousDepthNodes[rnd(0, previousDepthNodes.length - 1)];
	// 		locs.push(loc);
	// 		prevLoc.nextLocations.push(loc.id);
	// 		depthNodes.push(loc);

	// 	}
	// 	if (i % options.curve === 0 && difIndex < diffs.length - 1) {
	// 		difIndex++;
	// 	}
	// 	previousDepthNodes = depthNodes;
	// }

	// return locs;
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

					// const currentEdge = [j, i, k, i + 1] as [number, number, number, number];
					// edges.push(currentEdge);
					// const hasIntersection = edges.some((edge) => linesIntersect(edge, currentEdge));

					// console.log("CROSSING", hasIntersection, currentEdge, edges);
					// if (!hasIntersection) {
						// nextRowNodes.push(nextNode.id);
						// edges.push(currentEdge);
					// }
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

// Function to check if two lines intersect
function linesIntersect(line1: [number, number, number, number], line2: [number, number, number, number]): boolean {
	const [x1, y1, x2, y2] = line1;
	const [x3, y3, x4, y4] = line2;

	const det = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
	if (det === 0) return false; // Parallel lines

	const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / det;
	const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / det;

	return t >= 0 && t <= 1 && u >= 0 && u <= 1;
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

	if(first) {
		loc.flags.push("first");
	}

	return loc;
}

function randomArena(diff: ARENADIFFICULTY): Arena {
	return new ArenaForestEncounter(diff);
}

