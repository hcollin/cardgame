import { EFFECTS } from "./Effects";
import { Item } from "./Items";

export enum ITEMSLOT {
	RIGHT_HAND = "RIGHT_HAND",
	LEFT_HAND = "LEFT_HAND",
	HEAD = "HEAD",
	BODY = "BODY",
	LEGS = "LEGS",
	FEET = "FEET",
	RIGHT_FINGER = "RIGHT_FINGER",
	LEFT_FINGER = "LEFT_FINGER",
	CAPE = "CAPE",
}

// export interface HeroStats {
// 	name: string;

// 	health: number;
// 	maxHealth: number;

// 	aps: number;
// 	maxAps: number;

//     // Base armor comes from level, race etc. An armor that cannot be taken away.
//     baseArmor: number;

//     // Effect armor is armor that is provided by effects and equipment. It can be taken away, but not by damage.
//     effectArmor: number;

//     // Armor is the current armor value that is used to block damage. Armor value is resetted at the beginning of the pleayers turn (baseArmor + effectArmor).
// 	armor: number;

// 	effects: Map<EFFECTS, number>;

// 	score: number;

// 	inventory: Item[];

// 	activeItems: Map<ITEMSLOT, Item>;

// 	experience: number;
// 	level: number;

// 	// activeItemRight: Item | null;
// 	// activeItemLeft: Item | null;
// }

export interface LevelMods {
	health: number;
	armor: number;
	energy: number;
	rHandSize: number;
	lHandSize: number;
	cape: boolean;
}


export interface CharacterRace {
    name: string;
    baseArmor: number;
    baseHealth: number;
    baseEnergy: number;
    baseHandSize: number;
}

export interface CharacterClass {
    name: string;
    startingItems: [Item, ITEMSLOT|null][];
    levelStats: LevelMods[];

}