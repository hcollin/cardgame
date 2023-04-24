import { EFFECTS } from "./Effects";
import { Item } from "./Items";


export interface HeroStats {
    health: number;
    maxHealth: number;

    aps: number;
    maxAps: number;

    armor: number;
    defaultArmor: number;

    effects: Map<EFFECTS, number>;

    score: number;

    inventory: Item[];

    activeItemRight: Item | null;
    activeItemLeft: Item | null;

}