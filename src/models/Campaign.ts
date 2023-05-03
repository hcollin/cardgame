import Hero from "../game/Hero";

import { LocationId, Location } from "./World";


export interface CampaignOptions {
	healAfterArena: number;	// 0 - 1 percentage of max health, default is 0.
	fullHealOnLevelUp: boolean;	// default is false.
	endlessLoop: boolean;	// default is false.
	mapDepth: number;
	mapWidth: number;
}

export interface Campaign {
	id: string;
	hero: Hero;
	world: Map<LocationId, Location>;
	currentLocationId: LocationId;
	options: CampaignOptions;
}
