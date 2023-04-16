import { Arena } from "../game/Arena";
import { Deck } from "../game/Deck";
import { Card } from "./Card";
import { HeroStats } from "./HeroStats";


export enum GAMESTATES {
    WAITING = "WAITING",
    STARTED = "STARTED",
    MYTURN = "MYTURN",
    ENEMYTURN = "ENEMYTURN",
    ENDED = "ENDED"
}


export interface GameState {
    id: string;
    turn: number;
    
    hero: HeroStats;

    leftHandDeck: Deck;
    rightHandDeck: Deck;

    leftHand: Card[];
    rightHand: Card[];
    
    state: GAMESTATES;
    
    arena: Arena;
    
}