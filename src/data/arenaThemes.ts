import { arnd } from "rndlib";
import { Enemy } from "../game/Enemy";
import { Item } from "../models/Items";
import { Dragon } from "./Enemies";

import { LeatherBoots } from "./items/LeatherBoots";
import { LongSword } from "./items/LongSword";
import { Mace } from "./items/CrudeMace";
import { RingOfHealing } from "./items/RingOfHealing";
import { Shield } from "./items/Shield";


import { Buckler } from "./items/Buckler";
import { ShortSword } from "./items/ShortSword";
import { LeatherArmor, StuddedLeatherArmor } from "./items/LightArmor";


import forestBg from "./pics/forestbg.jpg";
import mountainBg from  "./pics/mountainbg.jpg";
import { ScaleMail } from "./items/MediumArmor";
import { RingOfRegeneration } from "./items/RingOfRegeneration";
import { LeatherCap } from "./items/LeatherCap";

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
		rewardItems: [Mace, LongSword, Shield, Buckler, ShortSword, LeatherBoots, LeatherArmor, RingOfHealing],
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
		rewardItems: [Mace, LongSword, Shield, Buckler, ShortSword, LeatherBoots, LeatherArmor, StuddedLeatherArmor, ScaleMail, RingOfHealing, RingOfRegeneration, LeatherCap],
		bosses: ["Dragon"],
	}
};
