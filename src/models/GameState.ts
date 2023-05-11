import { Arena } from "../game/Arena";
import { Deck } from "../game/Deck";
import { Hand } from "../game/Hand";
import Hero from "../game/Hero";
import { Card } from "./Card";


export enum GAMESTATES {
    WAITING = "WAITING",

    INIT = "INIT",

    ARENA_MYTURN = "My turn on Arena",
    ARENA_ENEMYTURN = "Enemy turn on Arena",
    ARENA_VICTORY = "Arena victory",
    ARENA_REWARDS = "Arena rewards",
    ARENA_COMPLETED = "Arena completed",

    MAP_ARENAS = "Select next Arena",



    STARTED = "STARTED",
    MYTURN = "MYTURN",
    ENEMYTURN = "ENEMYTURN",
    ENDED = "ENDED",
    ARENAWON = "ARENAWON",
    DEAD = "DEAD"
    
}


export interface GameState {
    id: string;
    turn: number;
    
    hero: Hero;

    leftHandDeck: Deck;
    rightHandDeck: Deck;

    leftHand: Hand;
    rightHand: Hand;
    
    state: GAMESTATES;
    arena: Arena;

    playedCardsThisTurn: Card[];
    // currentLocationId: LocationId;
    // world: Map<LocationId, Location>    
}