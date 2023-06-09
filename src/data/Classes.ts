import { createItemId } from "../game/ItemTools";
import { CharacterClass, ITEMSLOT } from "../models/HeroStats";
import { BronzeBuckler } from "./items/BronzeBuckler";
import { BronzeSpear } from "./items/BronzeSpear";
import { Claymore } from "./items/Claymore";
import { Dagger } from "./items/Dagger";
import { ScaleMail } from "./items/MediumArmor";
import { GreaterEnergyPotion, GreaterHealingPotion, HealingPotion, MinorEnergyPotion, MinorHealingPotion, PotionOfInsight } from "./items/Potions";
import { ShortSword } from "./items/ShortSword";

export const LEVELEXPERIENCEREQUIREMENTS: number[] = [0, 0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

export const ClassWarrior: CharacterClass = {
	name: "Warrior",
	bonus: {
		BLOCK: 1,
	},
	startingItems: [
		[BronzeSpear, ITEMSLOT.RIGHT_HAND],
		[BronzeBuckler, ITEMSLOT.LEFT_HAND],
		// [Claymore, null]
		// [createItemId(MinorHealingPotion), null],
		// [createItemId(MinorHealingPotion), null],
		// [createItemId(MinorHealingPotion), null],
		// [createItemId(PotionOfInsight), null],
		// [createItemId(GreaterEnergyPotion), null],
	],
	levelStats: [
		{},
		{"HEALTH": 5},  		// level 1
		{"HEALTH": 5, "BLOCK": 1},			// level 2
		{"HEALTH": 5, "ENERGY": 1}, 		// level 3
		{"HEALTH": 10},			// level 4
		{"HEALTH": 10, "BLOCK": 1},			// level 5
		{"HEALTH": 15},			// level 6
		{"HEALTH": 10, "ENERGY": 1},			// level 7
		{"HEALTH": 5, "LEFT_HAND_SIZE": 1, "RIGHT_HAND_SIZE": 1},			// level 8
		{"HEALTH": 10, "BLOCK": 2},			// level 9
		{"HEALTH": 10, "ENERGY": 1},			// level 10
		
	]
	// levelStats: [
	// 	{ health: 0, block: 0, energy: 0, rHandSize: 0, lHandSize: 0, cape: false },
	// 	{ health: 5, block: 0, energy: 0, rHandSize: 0, lHandSize: 0, cape: false }, // 1 +5 health
	// 	{ health: 8, block: 1, energy: 0, rHandSize: 0, lHandSize: 0, cape: false }, // 2 +1 armor
	// 	{ health: 10, block: 1, energy: 1, rHandSize: 0, lHandSize: 0, cape: false }, // 3 +1 energy
	// 	{ health: 20, block: 1, energy: 1, rHandSize: 0, lHandSize: 0, cape: false }, // 4 +10 health
	// 	{ health: 30, block: 1, energy: 1, rHandSize: 0, lHandSize: 0, cape: true }, // 5 +15 health
	// 	{ health: 35, block: 1, energy: 1, rHandSize: 0, lHandSize: 0, cape: true }, // 6 Cape slot
	// 	{ health: 40, block: 3, energy: 1, rHandSize: 0, lHandSize: 0, cape: true }, // 7 +2 armor
	// 	{ health: 45, block: 3, energy: 2, rHandSize: 0, lHandSize: 0, cape: true }, // 8 +1 energy
	// 	{ health: 50, block: 3, energy: 2, rHandSize: 1, lHandSize: 1, cape: true }, // 9 +1 handisize
	// 	{ health: 60, block: 3, energy: 3, rHandSize: 1, lHandSize: 1, cape: true }, // 10 + 1 energy
	// ],
};


// export const ClassRogue: CharacterClass = {
// 	name: "Rogue",
// 	bonus: {
// 		DODGE: 10
// 	},
// 	startingItems: [
// 		[ShortSword, ITEMSLOT.RIGHT_HAND],
// 		[Dagger, ITEMSLOT.LEFT_HAND],
// 	],
// 	levelStats: [
// 		{ health: 0, block: 0, energy: 0, rHandSize: 0, lHandSize: 0, cape: true },
// 		{ health: 1, block: 0, energy: 0, rHandSize: 0, lHandSize: 0, cape: true }, // 1 +5 health
// 		{ health: 2, block: 0, energy: 1, rHandSize: 1, lHandSize: 0, cape: true }, // 2 +1 armor
// 		{ health: 4, block: 0, energy: 1, rHandSize: 1, lHandSize: 1, cape: true }, // 3 +1 energy
// 		{ health: 8, block: 0, energy: 1, rHandSize: 1, lHandSize: 1, cape: true }, // 4 +10 health
// 		{ health: 12, block: 1, energy: 1, rHandSize: 2, lHandSize: 1, cape: true }, // 5 +15 health
// 		{ health: 16, block: 1, energy: 2, rHandSize: 2, lHandSize: 2, cape: true }, // 6 Cape slot
// 		{ health: 20, block: 1, energy: 2, rHandSize: 2, lHandSize: 2, cape: true }, // 7 +2 armor
// 		{ health: 24, block: 1, energy: 2, rHandSize: 3, lHandSize: 2, cape: true }, // 8 +1 energy
// 		{ health: 28, block: 2, energy: 3, rHandSize: 3, lHandSize: 3, cape: true }, // 9 +1 handisize
// 		{ health: 32, block: 2, energy: 3, rHandSize: 3, lHandSize: 3, cape: true }, // 10 + 1 energy
// 	]

// }