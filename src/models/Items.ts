import Hero from "../game/Hero";
import { CardData } from "./Card";
import { GameState } from "./GameState";
import { ITEMSLOT } from "./HeroStats";



export enum ITEMRARITY{
    COMMON = "COMMON",
    UNCOMMON = "UNCOMMON",
    RARE = "RARE",
    EPIC = "EPIC"
}

export interface Item {
    id: string;
    name: string;
    rulesText?: string;
    description: string;
    itemSlots: ITEMSLOT[];
    cards: CardData[];
    rarity: ITEMRARITY;
    onEquip?: (hero: Hero) => void;
    onUnequip?: (hero: Hero) => void;
    onEndOfTurn?: (gs: GameState) => GameState;
}


