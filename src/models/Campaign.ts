import { HeroStats } from "./HeroStats";
import { LocationId, Location } from "./World";


export interface Campaign {
    id: string;
    hero: HeroStats;
    world: Map<LocationId, Location>;
    currentLocationId: LocationId;
}