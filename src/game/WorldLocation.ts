import { v4 } from "uuid";
import { LOCATIONFLAG, LOCATIONSTATUS, LocationId, WORLDLOCATIONTYPE } from "../models/LocationModels";
import { Arena } from "./Arena";
import { EmptyArena } from "../data/EmptyArena";
import { ArenaTheme } from "../data/arenaThemes";
import { ARENATHEMES } from "../data/arenaThemes";
import { ARENADIFFICULTY } from "../data/Difficulties";
import Observable from "../utils/observable/Observable";
import { Village } from "./Village";
import { arnd } from "rndlib";

export default class WorldLocation extends Observable {
	public readonly id: LocationId = "";
	public name: string = "";
	public status: LOCATIONSTATUS = LOCATIONSTATUS.LOCKED;
	public type: WORLDLOCATIONTYPE = WORLDLOCATIONTYPE.ARENA;
	public nextLocationIds: LocationId[] = [];
	public flags: LOCATIONFLAG[] = [];
	public worldPos: { x: number; y: number; dx: number; dy: number } = { x: 0, y: 0, dx: 0, dy: 0 };

	public icon: string = "";

	constructor() {
		super();
		this.id = v4();
	}

	public setCompleted() {
		this.status = LOCATIONSTATUS.COMPLETED;
        this.flags.push("completed");
		// this.notifyObservers(this);
		this.notify();
	}

	public setSelectable() {
		this.status = LOCATIONSTATUS.SELECTABLE;
		// this.notifyObservers(this);
		this.notify();
	}

	public setLocked() {
		this.status = LOCATIONSTATUS.LOCKED;
		// this.notifyObservers(this);
		this.notify();
	}
}

export class ArenaWorldLocation extends WorldLocation {
	public type: WORLDLOCATIONTYPE = WORLDLOCATIONTYPE.ARENA;

	public arena: Arena = new EmptyArena();
	public theme: ArenaTheme = ARENATHEMES["FOREST"];
	public difficulty: ARENADIFFICULTY = ARENADIFFICULTY.VERYEASY;

	constructor(themeId: string, difficulty: ARENADIFFICULTY) {
		super();
		this.icon = "camp";
		this.difficulty = difficulty;
		this.setTheme(themeId);
		this.createArena();
	}

	/**
	 * Set a new theme for this WorldArenaLocation
	 * @param themeId
	 */
	public setTheme(themeId: string) {
		const t = ARENATHEMES[themeId];
		if (t) {
			this.theme = t;
			this.icon = this.theme.icon;
		}
	}

	/**
	 * Create a new Arena into this location
	 */
	public createArena() {
		const arena = Arena.generate(this.difficulty, this.theme.id);
		if (arena) {
			this.arena = arena;
			this.name = this.arena.name;
		}
	}

	public createBossArena() {
		const arena = Arena.generateBoss(this.difficulty, this.theme.id);
		if (arena) {
			this.arena = arena;
			this.name = this.arena.name;
		}
	}
}

export class VillageWorldLocation extends WorldLocation {
	public type: WORLDLOCATIONTYPE = WORLDLOCATIONTYPE.VILLAGE;

	public village: Village = new Village({});

	constructor() {
		super();
		this.icon = "tent";
		this.randomName();
	}

	private randomName() {
		let villageNameFirstParts: string[] = [
			"ever",
			"frost",
			"whisper",
			"mirth",
			"stone",
			"moon",
			"star",
			"dusk",
			"dawn",
			"storm",
			"glimmer",
			"shimmer",
			"crystal",
			"iron",
			"raven's ",
			"sage",
			"bracken",
			"mist",
			"glow",
			"aurora",
			"shadow",
			"thunder",
			"ember",
			"dragon's ",
			"lantern",
			"golden",
			"harmony",
			"ebon",
			"willow",
			"meadow",
			"twilight",
			"lunar",
			"phoenix ",
			"opal",
			"silver",
			"halcyon",
			"verdant",
			"sunset",
			"zephyr's ",
		];

		let villageNameSecondParts: string[] = [
			"bloom",
			"fern",
			"wind",
			"wood",
			"mire",
			"hollow",
			"shroud",
			"thorn",
			"forge",
			"haven",
			"deep",
			"stone",
			"brooke",
			"vale",
			" roost",
			"brush",
			"fell",
			"mire",
			"bridge",
			"veil",
			"meadow",
			"top",
			"hearth",
			" rest",
			"light",
			"field",
			" grove",
			"peak",
			"shore",
			"lark",
			" glade",
			" creek",
			" landing",
			"hollow",
			"mist",
			" hill",
			"vale",
			" spire",
			" reach",
		];

		const name = `${arnd(villageNameFirstParts)}${arnd(villageNameSecondParts)}`
			.trim()
			.replace("  ", " ")
			.split(" ")
			.reduce((name, word) => {
				return (name + " " + capitalizeFistLetter(word)).trim();
			}, "");

		this.name = name;
	}
}

function capitalizeFistLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
