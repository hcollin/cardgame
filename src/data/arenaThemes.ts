import { arnd } from "rndlib";
import { Enemy } from "../game/Enemy";
import { Item } from "../models/Items";
import { Dragon } from "./Enemies";
import { LeatherArmor } from "./items/LeatherArmor";
import { LeatherBoots } from "./items/LeatherBoots";
import { LongSword } from "./items/LongSword";
import { Mace } from "./items/Mace";
import { RingOfHealing } from "./items/RingOfHealing";
import { Shield } from "./items/Shield";

import forestBg from "./pics/forestbg.jpg";



export interface ArenaTheme {
    id: string;
    types: string[];
    name: () => string;
    enemies: string[];
    bgImage: string;
    rewardCount: number;
    rewardItems: Item[];
    bosses: string[];

}


export const ARENATHEMES: { [key: string]: ArenaTheme } = {
    "FOREST": {
        id: "FOREST",
        types: ["Forest", "Orcs", "Easy"],
        name: () => {
            const adjectives = ["Dark", "Old", "Thick", "Misty", "Ancient", "Enchanted"];
            const nouns = ["Forest", "Woods", "Jungle", "Grove", "Thicket" ,"Woodland" ];

            return `${arnd(adjectives)} ${arnd(nouns)}`;

        },
        enemies: ["Orc Shaman", "Orc Berserker", "Orc Warlord", "Goblin Warrior", "Goblin Sorcerer", "Goblin Lord"],
        bgImage: forestBg,
        rewardCount: 3,
        rewardItems: [Mace, LongSword, Shield, LeatherBoots, LeatherArmor, RingOfHealing],
        bosses: ["Dragon"],
    },
}

