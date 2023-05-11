import { CharacterClass, ITEMSLOT } from "../models/HeroStats";
import { Buckler } from "./items/Buckler";
import { ShortSword } from "./items/ShortSword";

export const ClassWarrior: CharacterClass = {
	name: "Warrior",
	startingItems: [
		[ShortSword, ITEMSLOT.RIGHT_HAND],
		[Buckler, ITEMSLOT.LEFT_HAND],
	],
	levelStats: [
		{ health: 0, armor: 0, energy: 0, rHandSize: 0, lHandSize: 0, cape: false },
		{ health: 5, armor: 0, energy: 0, rHandSize: 0, lHandSize: 0, cape: false }, // 1 +5 health
		{ health: 8, armor: 1, energy: 0, rHandSize: 0, lHandSize: 0, cape: false }, // 2 +1 armor
		{ health: 10, armor: 1, energy: 1, rHandSize: 0, lHandSize: 0, cape: false }, // 3 +1 energy
		{ health: 20, armor: 1, energy: 1, rHandSize: 0, lHandSize: 0, cape: false }, // 4 +10 health
		{ health: 30, armor: 1, energy: 1, rHandSize: 0, lHandSize: 0, cape: true }, // 5 +15 health
		{ health: 35, armor: 1, energy: 1, rHandSize: 0, lHandSize: 0, cape: true }, // 6 Cape slot
		{ health: 40, armor: 3, energy: 1, rHandSize: 0, lHandSize: 0, cape: true }, // 7 +2 armor
		{ health: 45, armor: 3, energy: 2, rHandSize: 0, lHandSize: 0, cape: true }, // 8 +1 energy
		{ health: 50, armor: 3, energy: 2, rHandSize: 1, lHandSize: 1, cape: true }, // 9 +1 handisize
		{ health: 60, armor: 3, energy: 3, rHandSize: 1, lHandSize: 1, cape: true }, // 10 + 1 energy
	],
};

