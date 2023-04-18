import { Arena } from "../game/Arena";
import { Deck } from "../game/Deck";
import { Card } from "./Card";
import { HeroStats } from "./HeroStats";
import { Location, LocationId } from "./World";


export enum GAMESTATES {
    WAITING = "WAITING",

    INIT = "INIT",

    ARENA_MYTURN = "My turn on Arena",
    ARENA_ENEMYTURN = "Enemy turn on Arena",
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
    
    hero: HeroStats;

    leftHandDeck: Deck;
    rightHandDeck: Deck;

    leftHand: Card[];
    rightHand: Card[];
    
    state: GAMESTATES;
    
    arena: Arena;
    currentLocationId: LocationId;
    world: Map<LocationId, Location>    
}