import { Arena } from "../game/Arena";
import { Deck } from "../game/Deck";
import { Card } from "./Card";


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
    myHealth: number;
    myMaxHealth: number;
    aps: number;
    maxAps: number;


    leftHandDeck: Deck;
    rightHandDeck: Deck;

    leftHand: Card[];
    rightHand: Card[];
    
    state: GAMESTATES;
    
    arena: Arena;
    
}