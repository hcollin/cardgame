import Hero from "../game/Hero";

import { LocationId, Location } from "./World";

export interface Campaign {
	id: string;
	hero: Hero;
	world: Map<LocationId, Location>;
	currentLocationId: LocationId;
}
