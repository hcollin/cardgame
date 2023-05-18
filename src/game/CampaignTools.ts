import { v4 } from "uuid";
import { LocationId, LocationData, LOCATIONSTATUS } from "../models/LocationModels";
import { Campaign, CampaignOptions } from "../models/Campaign";

import { Deck } from "./Deck";
import { createDecks } from "./ArenaService";

import { Arena } from "./Arena";
import Hero from "./Hero";
import { RaceHuman } from "../data/Races";
import { ClassWarrior } from "../data/Classes";

import { Hand } from "./Hand";
import { ArenaState, ARENASTATES } from "../models/ArenaState";

import { World } from "./World";

/**
 * This is used to initialize the state
 * @returns
 */
export function createEmptyCampaign(): Campaign {
	return {
		id: "EMPTY",
		hero: new Hero(RaceHuman, ClassWarrior),
		worlds: [],
		// world: new Map<LocationId, Location>(),
		// worldName: "",
		currentLocationId: "",

		options: {
			healAfterArena: 0,
			fullHealOnLevelUp: false,
			endlessLoop: false,
			mapDepth: 15,
			mapWidth: 7,
			worldThemes: ["FOREST", "MOUNTAIN"],
		},
	};
}

export function createCampaign(): Campaign {
	const opts: CampaignOptions = {
		healAfterArena: 0,
		fullHealOnLevelUp: false,
		endlessLoop: false,
		mapDepth: 12,
		mapWidth: 7,
		worldThemes: ["FOREST", "MOUNTAIN"],
	};

	const campaign: Campaign = {
		id: v4(),
		hero: new Hero(RaceHuman, ClassWarrior, opts),
		worlds: [],
		// worldName: "",
		// world: new Map<LocationId, Location>(),
		currentLocationId: "",

		options: opts,
	};

	// campaign.world = createWorld([...LOCATIONS], campaign);

	for (let i = 0; i < campaign.options.worldThemes.length; i++) {
		const w = new World({
			depth: campaign.options.mapDepth,
			width: campaign.options.mapWidth,
			themes: [campaign.options.worldThemes[i]],
		});

		w.createRandomLocations();

		campaign.worlds.push(w);
	}

	campaign.worlds[0].activateWorld();
	console.log("created campaign:", campaign);
	return campaign;
}

export function markCurrentLocationCompleted(campaign: Campaign, endOfWorld: boolean): Campaign {
	const world = getActiveWorld(campaign);
	if (!world) {
		throw new Error("Active world not found");
	}

	const loc = world.getLocation(campaign.currentLocationId);

	if (!loc) {
		throw new Error(`Current location ${campaign.currentLocationId} not found`);
	}
	loc.status = LOCATIONSTATUS.COMPLETED;
	loc.flags.push("completed");

	world.updateLocation(loc);

	if (campaign.options.healAfterArena > 0) {
		const healAmount = Math.round(campaign.hero.getMaxHealth() * campaign.options.healAfterArena);
		campaign.hero.healHero(healAmount);
	}

	campaign.currentLocationId = "";
	if (endOfWorld) {
		return moveToNextWorld(campaign);
	}

	return { ...campaign };
}

export function moveToNextWorld(campaign: Campaign): Campaign {
	// if (campaign.world.size === 0) {
	// 	throw new Error("World not initialized");
	// }

	const activeWorldIndex = campaign.worlds.findIndex((w) => w.status === "ACTIVE");
	if (activeWorldIndex === -1) {
		throw new Error("No active world found");
	}

	const currentWorld = campaign.worlds[activeWorldIndex];
	currentWorld.completeWorld();

	const nextWorld = campaign.worlds[activeWorldIndex + 1];
	if (!nextWorld) {
		console.log(campaign);
		console.log("All worlds completed!");
		return { ...campaign };
		// throw new Error("Next world not found!");
	}

	// campaign.world = createLocationsMap(nextWorld, campaign);
	nextWorld.activateWorld();
	// campaign.worldName = nextWorld.name;
	// campaign.worldName = ARENATHEMES[campaign.options.worldThemes[campaign.currentWorldIndex]].worldName();

	return { ...campaign };
}

export function setActiveLocationForCampaign(campaign: Campaign, locationId: LocationId): Campaign {
	const nc = { ...campaign };
	const actWorld = getActiveWorld(nc);
	if (!actWorld) {
		throw new Error("Active world not found");
	}
	const loc = actWorld.getLocation(locationId);
	if (!loc) {
		throw new Error("Location not found");
	}
	loc.status = LOCATIONSTATUS.ACTIVE;
	actWorld.updateLocation(loc);
	// nc.world.set(loc.id, loc);
	nc.currentLocationId = loc.id;
	return { ...nc };
}

export function createGameFromCampaign(campaign: Campaign): ArenaState {
	// const location = campaign.world.get(campaign.currentLocationId);
	const location = getActiveLocation(campaign);

	if (!location) {
		throw new Error(`Location ${campaign.id} not found from campaign world.`);
	}

	let arenaState: ArenaState = {
		id: v4(),
		turn: 0,
		leftHandDeck: new Deck([]),
		rightHandDeck: new Deck([]),
		leftHand: new Hand("LEFT"),
		rightHand: new Hand("RIGHT"),
		state: ARENASTATES.MYTURN,
		arena: location.arena[0],
		hero: campaign.hero,
		playedCardsThisTurn: [],
	};

	// if (campaign.hero.activeItemLeft === null || campaign.hero.activeItemRight === null) { throw new Error("Hero has no active items"); }

	arenaState = createDecks(arenaState);

	arenaState.rightHandDeck.shuffleDeck();
	arenaState.leftHandDeck.shuffleDeck();

	arenaState.rightHand.drawNewHand(arenaState);

	arenaState.rightHand.drawNewHand(arenaState);
	arenaState.leftHand.drawNewHand(arenaState);

	arenaState.arena.resetArena();
	arenaState.hero.arenaReset(campaign.options);
	arenaState.turn = 1;

	// arenaState.hero.aps = arenaState.hero.maxAps;

	return arenaState;
}

export function createGameForArena(arena: Arena, campaign: Campaign): ArenaState {
	const hero = campaign.hero;
	let arenaState: ArenaState = {
		id: v4(),
		turn: 0,
		leftHandDeck: new Deck([]),
		rightHandDeck: new Deck([]),
		leftHand: new Hand("LEFT"),
		rightHand: new Hand("RIGHT"),
		state: ARENASTATES.MYTURN,
		arena: arena,
		hero: hero,
		playedCardsThisTurn: [],
	};

	// if (hero.activeItemLeft === null || hero.activeItemRight === null) { throw new Error("Hero has no active items"); }

	arenaState = createDecks(arenaState);
	arenaState.rightHandDeck.shuffleDeck();
	arenaState.leftHandDeck.shuffleDeck();

	arenaState.rightHand.drawNewHand(arenaState);
	arenaState.leftHand.drawNewHand(arenaState);

	arenaState.arena.resetArena();
	arenaState.turn = 1;

	arenaState.hero.arenaReset(campaign.options);
	// arenaState.hero = resetHero(arenaState.hero, false);

	return arenaState;
}

export function getActiveWorld(campaign: Campaign): World | null {
	const activeWorld = campaign.worlds.find((w) => w.status === "ACTIVE");
	if (!activeWorld) {
		return null;
	}
	return activeWorld;
}

export function getActiveLocation(campaign: Campaign): LocationData | null {
	const actWorld = getActiveWorld(campaign);
	if (!actWorld || campaign.currentLocationId === "") {
		return null;
	}

	const loc = actWorld.getLocation(campaign.currentLocationId);
	if (!loc) {
		return null;
	}

	return loc;
}

export function activateLocation(campaign: Campaign, locId: LocationId): Campaign {
	campaign.currentLocationId = locId;
	const world = getActiveWorld(campaign);
	if (!world) {
		throw new Error("Active world not found");
	}
	world.activeLocationId = locId;
	return { ...campaign };
}
