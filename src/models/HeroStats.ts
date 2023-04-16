import { EFFECTS } from "./Effects";


export interface HeroStats {
    health: number;
    maxHealth: number;

    aps: number;
    maxAps: number;

    armor: number;
    defaultArmor: number;

    effects: Map<EFFECTS, number>;

    score: number;

}