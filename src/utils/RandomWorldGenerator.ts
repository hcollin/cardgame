import { v4 } from "uuid";
import { Arena, ARENADIFFICULTY } from "../game/Arena";
import { Location, LOCATIONSTATUS, WORLDLOCATIONTYPE } from "../models/World";
import { ArenaForestEncounter } from "../data/ArenaForestEncounter";
import { rnd } from "rndlib";

interface worldGeneratorOptions {
	depth: number;
	startingDifficulty: ARENADIFFICULTY;
	curve: number;
	spread: number;
	starts: number;
}

export function generateRandomWorld(): Location[] {
	const options: worldGeneratorOptions = {
		depth: 5,
		startingDifficulty: ARENADIFFICULTY.VERYEASY,
		curve: 2,
		spread: 2,
		starts: 1,
	};

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

	let difIndex = diffs.indexOf(options.startingDifficulty);

	const finalDifIndex = difIndex + (Math.round(options.depth / options.curve));
	console.log("FINALDIFINDEX", diffs[finalDifIndex]);

	let prevLoc: Location | null = null;

	//TODO: All paths will lead to a single final location, so I need to build this logic backwards starting from the final location

	const finalLocation = randomLocation(diffs[finalDifIndex], false);
	finalLocation.name = "BOSS";
	// Then I need to build build the paths as a tree, where each node has a link to the previous node and no node is missing a link to the previous node (except the first node)

	locs.push(finalLocation);

	function addNode(locs: Location[], cnode: Location, currentDepth: number, opts: worldGeneratorOptions): Location[] {
		
		const difficulty = diffs[diffs.indexOf(options.startingDifficulty) + (Math.floor((opts.depth - currentDepth - 1) / opts.curve))];
		const newNode = randomLocation(difficulty, false);

		newNode.nextLocations.push(cnode.id);
		if(currentDepth === opts.depth - 2) {
			newNode.flags.push("first");
		}
		locs.push(newNode);
		
		

		if (currentDepth < opts.depth - 2) {
			const childCount = rnd(1, opts.spread);
			let childLocs: Location[] = [...locs];
			for (let i = 0; i < childCount; i++) {
				childLocs = childLocs.concat(addNode(locs, newNode, currentDepth + 1, opts));
			}
			// const cloc = addNode(locs, newNode, currentDepth + 1, opts);
			return childLocs;
		}

		return locs;
	}

	const flocs = addNode([finalLocation], finalLocation, 0, options);
	console.log("FLOCS", flocs);
	return flocs;



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

	return loc;
}

function randomArena(diff: ARENADIFFICULTY): Arena {
	return new ArenaForestEncounter(diff);
}
