import { v4 } from "uuid";
import { Arena, ARENADIFFICULTY } from "../game/Arena";
import { Location, LOCATIONSTATUS, WORLDLOCATIONTYPE } from "../models/World";
import { ArenaForestEncounter } from "../data/ArenaForestEncounter";

interface worldGeneratorOptions {
	depth: number;
	startingDifficulty: ARENADIFFICULTY;
	curve: number;
}

export function generateRandomWorld(): Location[] {
	const options: worldGeneratorOptions = {
		depth: 8,
		startingDifficulty: ARENADIFFICULTY.VERYEASY,
		curve: 2,
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

	let prevLoc: Location | null = null;
	for (let i = 1; i <= options.depth; i++) {
		const diff = diffs[difIndex];
		console.log(i, difIndex, diff);
		const loc = randomLocation(diff, i === 0);
		locs.push(loc);
		if (prevLoc) {
			prevLoc.nextLocations.push(loc.id);
		} else {
			loc.flags.push("first");
		}
		prevLoc = loc;
		if (i % options.curve === 0 && difIndex < diffs.length - 1) {
			difIndex++;
            
		}
	}

	return locs;
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
