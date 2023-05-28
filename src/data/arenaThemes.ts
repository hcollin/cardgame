import { arnd } from "rndlib";
import { Enemy } from "../game/Enemy";
import { Item } from "../models/Items";
import { Dragon } from "./Enemies";

import { LeatherBoots } from "./items/Boots";
import { LongSword } from "./items/LongSword";
import { IronMace } from "./items/IronMace";
import { MinorRingOfHealing } from "./items/RingOfHealing";
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
	worldName: () => string;
	enemies: string[];
	bgImage: string[];
	rewardCount: number;
	rewardItems: Item[];
	icon: string;
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
		worldName: () => {
			return arnd(["The dark forest", "Mystical woods", "The enchanted forest", "The old forest", "The ancient forest", "The misty forest", "The thick forest", "The dark woods", "The mystical woods", "The enchanted woods", "The old woods", "The ancient woods", "The misty woods", "The thick woods"]);
		},
		enemies: ["Orc Shaman", "Orc Berserker", "Orc Warlord", "Goblin Warrior", "Goblin Sorcerer", "Goblin Lord", "Fairy Warrior", "Fairy Mage", "Horror Spider", "Forest Sprite"],
		bgImage: [forestBg],
		icon: "forest",
		rewardCount: 3,
		rewardItems: [...basicWeapons, ...basicArmors, ...minorPotions],
		bosses: ["Dragon"],
	},
	MOUNTAIN: {
		id: "MOUNTAIN",
		types: ["Mountain", "Orcs", "Medium"],
		name: () => {
			const adjectives = ["High", "Steep", "Snowy", "Rocky", "Misty", "Enchanted", "Wild", "Frosty"];
			const nouns = ["Mountain", "Hill", "Peak", "Cliff", "Ridge", "Slope", "Trail"];

			return `${arnd(adjectives)} ${arnd(nouns)}`;
		},
		worldName: () => {
			return arnd(["The high mountains", "The steep mountains", "The snowy mountains", "The rocky mountains", "The misty mountains", "The enchanted mountains", "The wild mountains", "The frosty mountains", "The high hills", "The steep hills", "The snowy hills", "The rocky hills", "The misty hills", "The enchanted hills", "The wild hills", "The frosty hills"]);
		},
		enemies: ["Orc Berserker", "Frost Troll", "Wolf", "Hill Hare"],
		bgImage: [mountainBg],
		icon: "mountain",
		rewardCount: 3,
		rewardItems: [...basicWeapons, ...basicArmors, ...minorPotions, ...defaultWeapons, ...minorMagicItems, ...defaultPotions],
		bosses: ["Frost Giant"],
	}
};
