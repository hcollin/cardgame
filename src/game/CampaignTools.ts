import { v4 } from "uuid";
import { createHero, resetHero } from "./HeroTools";
import { LocationId, Location, LOCATIONSTATUS } from "../models/World";
import { Campaign } from "../models/Campaign";
import { GAMESTATES, GameState } from "../models/GameState";
import { Deck } from "./Deck";
import { createDecks } from "./GameService";
import { createWorld } from "./WorldTools";
import { LOCATIONS } from "../data/Locations";
import { HeroStats } from "../models/HeroStats";
import { Arena } from "./Arena";



export function createCampaign(): Campaign {
    
    const campaign: Campaign = {
        id: v4(),
        hero: createHero(),
        world: createWorld(LOCATIONS),
        currentLocationId: ""
    }

    return campaign;

}

export function selectActiveLocationFromCampaign(campaign: Campaign): Location {
    if (campaign.world.size === 0) { throw new Error("World not initialized"); }
    if (campaign.currentLocationId === "") {
        const locs = Array.from(campaign.world.values());
        const loc = locs.find(l => l.status === LOCATIONSTATUS.ACTIVE);
        if (!loc) { throw new Error("No active location found"); }
        return loc;
    }

    const cloc = campaign.world.get(campaign.currentLocationId);
    if (!cloc) { throw new Error("Current location not found"); }
    const nloc = campaign.world.get(cloc.nextLocations[0]);
    if (!nloc) { throw new Error("Next location not found"); }
    return nloc;
}

export function activateNextLocationForCampaign(campaign: Campaign): Campaign {
    if (campaign.world.size === 0) { throw new Error("World not initialized"); }
    
    const locs = Array.from(campaign.world.values());
    const loc = locs.find(l => l.status === LOCATIONSTATUS.ACTIVE);

    if(!loc) { throw new Error("No active location found"); }
    if(loc.nextLocations.length === 0) { throw new Error("No next locations found"); }

    const nextLocId = campaign.world.get(loc.nextLocations[0]);
    if(!nextLocId) { throw new Error("Next location not found"); }

    return {...campaign, currentLocationId: nextLocId.id};
}

export function markCurrentLocationCompleted(campaign: Campaign): Campaign { 
    if (campaign.world.size === 0) { throw new Error("World not initialized"); }
    

    const loc = campaign.world.get(campaign.currentLocationId);
    if(!loc) { throw new Error(`Current location ${campaign.currentLocationId} not found`); }
    loc.status = LOCATIONSTATUS.COMPLETED;
    campaign.world.set(loc.id, loc);
    return {...campaign};
}

export function setActiveLocationForCampaign(campaign: Campaign, locationId: LocationId): Campaign {

    const nc = {...campaign};
    const loc = nc.world.get(locationId);
    if(!loc) { throw new Error("Location not found"); }
    loc.status = LOCATIONSTATUS.ACTIVE;
    nc.world.set(loc.id, loc);
    nc.currentLocationId = loc.id;
    return {...nc};
    
}


export function createGameFromCampaign(campaign: Campaign): GameState {

    const location = campaign.world.get(campaign.currentLocationId);
    if (!location) { throw new Error(`Location ${campaign.id} not found from campaign world.`); }

    let gameState: GameState = {
        id: v4(),
        turn: 0,
        leftHandDeck: new Deck([]),
        rightHandDeck: new Deck([]),
        leftHand: [],
        rightHand: [],
        state: GAMESTATES.MYTURN,
        arena: location.arena[0],
        // world: campaign.world,
        // currentLocationId: campaign.currentLocationId,
        hero: campaign.hero
    }

    // if (campaign.hero.activeItemLeft === null || campaign.hero.activeItemRight === null) { throw new Error("Hero has no active items"); }

    gameState = createDecks(gameState);

    gameState.rightHandDeck.shuffleDeck();
    gameState.leftHandDeck.shuffleDeck();

    gameState.rightHand = gameState.rightHandDeck.drawCards(3);
    gameState.leftHand = gameState.leftHandDeck.drawCards(3);

    gameState.arena.resetArena();
    gameState.turn = 1;

    gameState.hero.aps = gameState.hero.maxAps;

    return gameState;
}

export function createGameForArena(arena: Arena, hero: HeroStats): GameState {
    let gameState: GameState = {
        id: v4(),
        turn: 0,
        leftHandDeck: new Deck([]),
        rightHandDeck: new Deck([]),
        leftHand: [],
        rightHand: [],
        state: GAMESTATES.MYTURN,
        arena: arena,
        hero: {...hero}
    }

    // if (hero.activeItemLeft === null || hero.activeItemRight === null) { throw new Error("Hero has no active items"); }

    gameState = createDecks(gameState);
    gameState.rightHandDeck.shuffleDeck();
    gameState.leftHandDeck.shuffleDeck();

    gameState.rightHand = gameState.rightHandDeck.drawCards(3);
    gameState.leftHand = gameState.leftHandDeck.drawCards(3);

    gameState.arena.resetArena();
    gameState.turn = 1;

    gameState.hero = resetHero(gameState.hero, false);

    return gameState;

}