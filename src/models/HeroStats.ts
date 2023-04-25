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

export interface HeroStats {
    name: string;

    health: number;
    maxHealth: number;

    aps: number;
    maxAps: number;

    armor: number;
    defaultArmor: number;

    effects: Map<EFFECTS, number>;

    score: number;

    inventory: Item[];

    activeItems: Map<ITEMSLOT, Item>;

    // activeItemRight: Item | null;
    // activeItemLeft: Item | null;

    

}