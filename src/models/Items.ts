import Hero from "../game/Hero";
import { CardData } from "./Card";
import { GameState } from "./GameState";
import { ITEMSLOT } from "./HeroStats";




export interface Item {
    id: string;
    name: string;
    description: string;
    itemSlots: ITEMSLOT[];
    cards: CardData[];
    onEquip?: (hero: Hero) => void;
    onUnequip?: (hero: Hero) => void;
    onEndOfTurn?: (gs: GameState) => GameState;
}


