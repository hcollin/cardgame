
import { Enemy } from "../game/Enemy";
import { GameState } from "./GameState";


export enum DAMAGETYPE {
    SLASH = "SLASH",
    PIERCE = "PIERCE",
    BLUNT = "BLUNT",
    FIRE = "FIRE",
    ICE = "ICE",
    LIGHTNING = "LIGHTNING",
    POISON = "POISON",
    HOLY = "HOLY"
}

export interface Card extends CardData{
    id: string;
    hand: "RIGHT"|"LEFT";
}


export interface OldCardData {
    name: string;
    damage: number;
    damageType: DAMAGETYPE[];
    weaponType: string;
    handed: number;
    description: string;
}

export interface Damage {
    amount: number;
    type: DAMAGETYPE;
    variation: number;
}

export interface CardData {
    name: string;
    item?: string;
    count?: number;
    
    description: string;
    
    damage: Damage[];   
    
    apCost: number;
    reach: number;

    onHit: (gs: GameState) => GameState;
    onMiss: (gs: GameState) => GameState;
    onUse: (gs: GameState) => GameState;
}

