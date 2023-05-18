import Hero from "../game/Hero";
import { World } from "../game/World";

import { LocationId, Location } from "./World";


export interface CampaignOptions {
	healAfterArena: number;	// 0 - 1 percentage of max health, default is 0.
	fullHealOnLevelUp: boolean;	// default is false.
	endlessLoop: boolean;	// default is false.
	mapDepth: number;
	mapWidth: number;
	worldThemes: string[];
}

export interface Campaign {
	id: string;
	hero: Hero;
	worlds: World[];
	world: Map<LocationId, Location>;
	worldName: string;
	currentLocationId: LocationId;
	options: CampaignOptions;
}
