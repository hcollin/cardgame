import { v4 } from "uuid";
import { createHero } from "./HeroTools";
import { LocationId, Location } from "../models/World";
import { Campaign } from "../models/Campaign";
import { GAMESTATES, GameState } from "../models/GameState";
import { Deck } from "./Deck";
import { selectItems } from "./GameService";



export function createCampaign(): Campaign {
    return {
        id: v4(),
        hero: createHero(),
        world: new Map<LocationId, Location>(),
        currentLocationId: ""
    };

}

export function selectNextLocationForCampaign(campaign: Campaign): Location {
    if (campaign.world.size === 0) { throw new Error("World not initialized"); }
    if (campaign.currentLocationId === "") {
        const locs = Array.from(campaign.world.values());
        const loc = locs.find(l => l.startLocation);
        if (!loc) { throw new Error("No start location found"); }
        return loc;
    }

    const cloc = campaign.world.get(campaign.currentLocationId);
    if (!cloc) { throw new Error("Current location not found"); }
    const nloc = campaign.world.get(cloc.nextLocations[0]);
    if (!nloc) { throw new Error("Next location not found"); }
    return nloc;
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
        world: campaign.world,
        currentLocationId: campaign.currentLocationId,
        hero: campaign.hero
    }

    if (campaign.hero.activeItemLeft === null || campaign.hero.activeItemRight === null) { throw new Error("Hero has no active items"); }

    gameState = selectItems(gameState, campaign.hero.activeItemLeft, campaign.hero.activeItemRight);
    gameState.rightHandDeck.shuffleDeck();
    gameState.leftHandDeck.shuffleDeck();

    gameState.rightHand = gameState.rightHandDeck.drawCards(3);
    gameState.leftHand = gameState.leftHandDeck.drawCards(3);

    gameState.arena.resetArena();
    gameState.turn = 1;

    return gameState;
}