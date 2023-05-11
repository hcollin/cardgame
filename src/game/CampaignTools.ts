import { v4 } from "uuid";
import { LocationId, Location, LOCATIONSTATUS } from "../models/World";
import { Campaign } from "../models/Campaign";
import { GAMESTATES, GameState } from "../models/GameState";
import { Deck } from "./Deck";
import { createDecks } from "./GameService";
import { buildNodeLocations, createWorld } from "./WorldTools";
import { LOCATIONS } from "../data/Locations";
import { Arena } from "./Arena";
import Hero from "./Hero";
import { RaceHuman } from "../data/Races";
import { ClassWarrior } from "../data/Classes";
import { generateRandomWorld } from "../utils/RandomWorldGenerator";
import { Hand } from "./Hand";

/**
 * This is used to initialize the state
 * @returns
 */
export function createEmptyCampaign(): Campaign {
	return {
		id: "EMPTY",
		hero: new Hero(RaceHuman, ClassWarrior),
		world: new Map<LocationId, Location>(),
		currentLocationId: "",
		options: {
			healAfterArena: 0,
			fullHealOnLevelUp: false,
			endlessLoop: false,
			mapDepth: 15,
			mapWidth: 7,
		},
	};
}

export function createCampaign(): Campaign {
	const campaign: Campaign = {
		id: v4(),
		hero: new Hero(RaceHuman, ClassWarrior),
		world: new Map<LocationId, Location>(),
		currentLocationId: "",
		options: {
			healAfterArena: 0,
			fullHealOnLevelUp: false,
			endlessLoop: false,
			mapDepth: 12,
			mapWidth: 7,
		},
	};

	// campaign.world = createWorld([...LOCATIONS], campaign);
	const myWorld = generateRandomWorld({
		depth: campaign.options.mapDepth,
		width: campaign.options.mapWidth,
	});
	
	campaign.world = createWorld(myWorld, campaign);

	// buildNodeLocations(campaign);
    
	return campaign;
}

// export function selectActiveLocationFromCampaign(campaign: Campaign): Location {
//     if (campaign.world.size === 0) { throw new Error("World not initialized"); }
//     if (campaign.currentLocationId === "") {
//         const locs = Array.from(campaign.world.values());
//         const loc = locs.find(l => l.status === LOCATIONSTATUS.ACTIVE);
//         if (!loc) { throw new Error("No active location found"); }
//         return loc;
//     }

//     const cloc = campaign.world.get(campaign.currentLocationId);
//     if (!cloc) { throw new Error("Current location not found"); }
//     const nloc = campaign.world.get(cloc.nextLocations[0]);
//     if (!nloc) { throw new Error("Next location not found"); }
//     return nloc;
// }

// export function activateNextLocationForCampaign(campaign: Campaign): Campaign {
//     if (campaign.world.size === 0) { throw new Error("World not initialized"); }

//     const locs = Array.from(campaign.world.values());
//     const loc = locs.find(l => l.status === LOCATIONSTATUS.ACTIVE);

//     if(!loc) { throw new Error("No active location found"); }
//     if(loc.nextLocations.length === 0) { throw new Error("No next locations found"); }

//     const nextLocId = campaign.world.get(loc.nextLocations[0]);
//     if(!nextLocId) { throw new Error("Next location not found"); }

//     return {...campaign, currentLocationId: nextLocId.id};
// }

export function markCurrentLocationCompleted(campaign: Campaign): Campaign {
	if (campaign.world.size === 0) {
		throw new Error("World not initialized");
	}

	const loc = campaign.world.get(campaign.currentLocationId);
	if (!loc) {
		throw new Error(`Current location ${campaign.currentLocationId} not found`);
	}
	loc.status = LOCATIONSTATUS.COMPLETED;
	loc.flags.push("completed");
	campaign.world.set(loc.id, loc);

	if (campaign.options.healAfterArena > 0) {
		const healAmount = Math.round(campaign.hero.getMaxHealth() * campaign.options.healAfterArena);
		campaign.hero.healHero(healAmount);
	}

	campaign.currentLocationId = "";
	return { ...campaign };
}

export function setActiveLocationForCampaign(campaign: Campaign, locationId: LocationId): Campaign {
	const nc = { ...campaign };
	const loc = nc.world.get(locationId);
	if (!loc) {
		throw new Error("Location not found");
	}
	loc.status = LOCATIONSTATUS.ACTIVE;
	nc.world.set(loc.id, loc);
	nc.currentLocationId = loc.id;
	return { ...nc };
}

export function createGameFromCampaign(campaign: Campaign): GameState {
	const location = campaign.world.get(campaign.currentLocationId);
	if (!location) {
		throw new Error(`Location ${campaign.id} not found from campaign world.`);
	}

	let gameState: GameState = {
		id: v4(),
		turn: 0,
		leftHandDeck: new Deck([]),
		rightHandDeck: new Deck([]),
		leftHand: new Hand("LEFT"),
		rightHand: new Hand("RIGHT"),
		state: GAMESTATES.MYTURN,
		arena: location.arena[0],
		// world: campaign.world,
		// currentLocationId: campaign.currentLocationId,
		hero: campaign.hero,
		playedCardsThisTurn: [],
	};

	// if (campaign.hero.activeItemLeft === null || campaign.hero.activeItemRight === null) { throw new Error("Hero has no active items"); }

	gameState = createDecks(gameState);

	gameState.rightHandDeck.shuffleDeck();
	gameState.leftHandDeck.shuffleDeck();

	gameState.rightHand.drawNewHand(gameState);

	gameState.rightHand.drawNewHand(gameState);
	gameState.leftHand.drawNewHand(gameState);
	
	gameState.arena.resetArena();
	gameState.hero.arenaReset(campaign.options);
	gameState.turn = 1;

	// gameState.hero.aps = gameState.hero.maxAps;

	return gameState;
}

export function createGameForArena(arena: Arena, campaign: Campaign): GameState {
	const hero = campaign.hero;
	let gameState: GameState = {
		id: v4(),
		turn: 0,
		leftHandDeck: new Deck([]),
		rightHandDeck: new Deck([]),
		leftHand: new Hand("LEFT"),
		rightHand: new Hand("RIGHT"),
		state: GAMESTATES.MYTURN,
		arena: arena,
		hero: hero,
		playedCardsThisTurn: [],
	};

	// if (hero.activeItemLeft === null || hero.activeItemRight === null) { throw new Error("Hero has no active items"); }

	gameState = createDecks(gameState);
	gameState.rightHandDeck.shuffleDeck();
	gameState.leftHandDeck.shuffleDeck();

	gameState.rightHand.drawNewHand(gameState);
	gameState.leftHand.drawNewHand(gameState);

	gameState.arena.resetArena();
	gameState.turn = 1;

	gameState.hero.arenaReset(campaign.options);
	// gameState.hero = resetHero(gameState.hero, false);

	return gameState;
}

