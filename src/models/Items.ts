import { CardData } from "./Card";
import { GameState } from "./GameState";
import { HeroStats, ITEMSLOT } from "./HeroStats";




export interface Item {
    id: string;
    name: string;
    description: string;
    itemSlots: ITEMSLOT[];
    cards: CardData[];
    onEquip?: (hero: HeroStats) => HeroStats;
    onUnequip?: (hero: HeroStats) => HeroStats;
    onEndOfTurn?: (gs: GameState) => GameState;
}


