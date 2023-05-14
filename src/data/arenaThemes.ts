import { arnd } from "rndlib";
import { Enemy } from "../game/Enemy";
import { Item } from "../models/Items";
import { Dragon } from "./Enemies";

import { LeatherBoots } from "./items/LeatherBoots";
import { LongSword } from "./items/LongSword";
import { IronMace } from "./items/IronMace";
import { RingOfHealing } from "./items/RingOfHealing";
import { RoundShield } from "./items/RoundShield";


import { BronzeBuckler } from "./items/BronzeBuckler";
import { ShortSword } from "./items/ShortSword";
import { Gambeson, LeatherArmor, StuddedLeatherArmor } from "./items/LightArmor";


import forestBg from "./pics/forestbg.jpg";
import mountainBg from  "./pics/mountainbg.jpg";
import { ScaleMail } from "./items/MediumArmor";
import { RingOfRegeneration } from "./items/RingOfRegeneration";
import { LeatherCap } from "./items/LeatherCap";
import { MinorEnergyPotion, MinorHealingPotion } from "./items/Potions";
import { Dagger } from "./items/Dagger";
import { HandAxe } from "./items/HandAxe";
import { basicArmors, basicWeapons, defaultPotions, defaultWeapons, minorMagicItems, minorPotions, standardArmors } from "./items/itemLists";

export interface ArenaTheme {
	id: string;
	types: string[];
	name: () => string;
	enemies: string[];
	bgImage: string[];
	rewardCount: number;
	rewardItems: Item[];
	bosses: string[];
}

export const ARENATHEMES: { [key: string]: ArenaTheme } = {
	FOREST: {
		id: "FOREST",
		types: ["Forest", "Orcs", "Easy"],
		name: () => {
			const adjectives = ["Dark", "Old", "Thick", "Misty", "Ancient", "Enchanted"];
			const nouns = ["Forest", "Woods", "Jungle", "Grove", "Thicket", "Woodland"];

			return `${arnd(adjectives)} ${arnd(nouns)}`;
		},
		enemies: ["Orc Shaman", "Orc Berserker", "Orc Warlord", "Goblin Warrior", "Goblin Sorcerer", "Goblin Lord"],
		bgImage: [forestBg],
		rewardCount: 3,
		rewardItems: [...basicWeapons, ...basicArmors, ...minorPotions],
		bosses: ["Dragon"],
	},
	MOUNTAIN: {
		id: "MOUNTAIN",
		types: ["Mountain", "Orcs", "Easy"],
		name: () => {
			const adjectives = ["High", "Steep", "Snowy", "Rocky", "Misty", "Enchanted", "Wild", "Frosty"];
			const nouns = ["Mountain", "Hill", "Peak", "Cliff", "Ridge", "Slope", "Trail"];

			return `${arnd(adjectives)} ${arnd(nouns)}`;
		},
		enemies: ["Orc Berserker", "Frost Troll", "Wolf", "Hill Hare"],
		bgImage: [mountainBg],
		rewardCount: 3,
		rewardItems: [...basicWeapons, ...basicArmors, ...minorPotions, ...defaultWeapons, ...minorMagicItems, ...defaultPotions],
		bosses: ["Dragon"],
	}
};
