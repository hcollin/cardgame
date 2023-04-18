import { ArenaOrcVillage } from "../data/ArenaOrcVillage";
import { GAMESTATES, GameState } from "../models/GameState";
import { Location, LocationId, WORLDLOCATIONTYPE } from "../models/World";


export function createWorld(locs: Location[]): Map<LocationId, Location> {
    return locs.reduce((world, loc) => {
        world.set(loc.id, loc);
        return world;
    }, new Map<LocationId, Location>());
}

export function selectNextLocation(gs: GameState): Location {
    if(gs.world.size === 0) { throw new Error("World not initialized"); } 
    if(gs.currentLocationId === "") { 
        const locs = Array.from(gs.world.values());
        const loc = locs.find(l => l.startLocation); 
        if(!loc) { throw new Error("No start location found"); }
        return loc;
    }
    
    const cloc = gs.world.get(gs.currentLocationId);
    if(!cloc) { throw new Error("Current location not found"); }
    const nloc = gs.world.get(cloc.nextLocations[0]);
    if(!nloc) { throw new Error("Next location not found"); }
    return nloc;
}

