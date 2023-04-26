import { ArenaOrcVillage } from "../data/ArenaOrcVillage";
import { Campaign } from "../models/Campaign";
import { GAMESTATES, GameState } from "../models/GameState";
import { LOCATIONSTATUS, Location, LocationId, MapLocation, WORLDLOCATIONTYPE } from "../models/World";


export function createWorld(locs: Location[]): Map<LocationId, Location> {
    return locs.reduce((world, loc) => {
        world.set(loc.id, loc);
        return world;
    }, new Map<LocationId, Location>());
}



// export function selectNextLocation(gs: GameState): Location {
//     if(gs.world.size === 0) { throw new Error("World not initialized"); } 
//     if(gs.currentLocationId === "") { 
//         const locs = Array.from(gs.world.values());
//         const loc = locs.find(l => l.status === LOCATIONSTATUS.ACTIVE); 
//         if(!loc) { throw new Error("No start location found"); }
//         return loc;
//     }
    
//     const cloc = gs.world.get(gs.currentLocationId);
//     if(!cloc) { throw new Error("Current location not found"); }
//     const nloc = gs.world.get(cloc.nextLocations[0]);
//     if(!nloc) { throw new Error("Next location not found"); }
//     return nloc;
// }



export function buildMapLocations(campaign: Campaign): MapLocation[] {
    
    
    const startingLocs: Location[] = Array.from(campaign.world.values()).filter(l => l.flags.includes("first"));
    
    function travelLocations(camp: Campaign, locId: LocationId, mplocs: MapLocation[], depth: number, trak: number): MapLocation[] {

        if(depth > 10) return mplocs;

        const loc = camp.world.get(locId);
        if(!loc) return mplocs;

        const mploc: MapLocation = {
            ...loc,
            depth: depth,
            trak: trak,
        };
        const locExists = mplocs.find(l => l.id === mploc.id);
        if(locExists) {
            if(locExists.depth < mploc.depth) {
                locExists.depth = mploc.depth;                
            } else {
                return mplocs;
            }
        } else {
            mplocs.push(mploc);
        }
        

        if(loc.flags.includes("final")) return mplocs;

        if(loc.nextLocations.length > 0) {
            const nid = loc.nextLocations[0];
            
            if(!nid) return mplocs;
            return travelLocations(camp, nid, mplocs, depth + 1, trak);
            

            // let newLocs: MapLocation[] = [];
            // loc.nextLocations.forEach((nl, i) => {
            //     const nloc = camp.world.get(nl);
            //     if(!nloc) { throw new Error("Next location not found"); }
                
            //     // const nlocs = travelLocations(camp, nloc, mplocs, depth + 1, trak);
            //     // newLocs = newLocs.concat(nlocs);
            // });
            // return newLocs;
         }

        return mplocs;
    }

    const locs = startingLocs.reduce((mplocs, loc, trak) => { 
        
        return travelLocations(campaign, loc.id, mplocs, 0, trak);
        
    }, [] as MapLocation[]);

    return locs.sort((a, b) => a.depth - b.depth);

    // startingLocs.forEach((loc, trak) => {
        
    //     travelLocations(campaign, loc, mapLocations, 0, trak);
    // });

    // return [];
}
