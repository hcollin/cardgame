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



export function updateLocations(mlocs: Map<LocationId, Location>, currentId: LocationId): Map<LocationId, Location> {


    // const nlocs: Map<LocationId, Location> = new Map<LocationId, Location>();

    // Location rules
    // All are locked by default (in the beginning)
    // If a location is completed, it's children are selectable (unless they are already completed or passed)
    // If a location is in the same or lower depth than the currently active location it is passed
    // If the location is currently selected it is active (DONE)
    // Only one location can be active at a time 
    // if all locations are locked, make locations with flag "first" selectable (DONE)

    const currentLocation = mlocs.get(currentId);

    const mlocArr = Array.from(mlocs.values());

    const allLocked = mlocArr.every(l => l.status === LOCATIONSTATUS.LOCKED);

    // Get an array of locationIds that are completed
    const completedLocations = mlocArr.filter(l => l.status === LOCATIONSTATUS.COMPLETED).map(l => l.id);

    function getLocParent(loc: Location): Location[]|null {
        const parents = mlocArr.filter(l => l.nextLocations.includes(loc.id));
        if(parents.length <= 0) return null;
        return parents;
    }

    function myParentIsCompleted(loc: Location): boolean {
        const parents = getLocParent(loc);
        if(!parents) return false;
        return parents.filter(p => completedLocations.includes(p.id)).length > 0;
    }


    const tempLocs: Location[] = [];

    mlocs.forEach(l => {

        // SELECTABLE & ACTIVE
        if(l.status === LOCATIONSTATUS.SELECTABLE && currentId === l.id) {
            l.status = LOCATIONSTATUS.ACTIVE;
        }

        if(l.status === LOCATIONSTATUS.ACTIVE && currentId !== l.id) {
            l.status = LOCATIONSTATUS.SELECTABLE;
        }

        // Locked locations with completed parents are selectable
        if(l.status === LOCATIONSTATUS.LOCKED && myParentIsCompleted(l)) {
            l.status = LOCATIONSTATUS.SELECTABLE;
        }

        

        // if(l.status === LOCATIONSTATUS.SELECTABLE ) {
        //     // Find all locations that have this location as a next location and their status is COMPLETED
        //     const nextLocs = Array.from(mlocs.values()).filter(nl => nl.nextLocations.includes(l.id) && nl.status === LOCATIONSTATUS.COMPLETED);
        //     if(nextLocs.length <= 0) {  
        //         l.status = LOCATIONSTATUS.PASSEDBY;
        //     } 
        // }

        // if (l.status === LOCATIONSTATUS.LOCKED) {
        //     if (l.flags.includes("first")) {
        //         if (l.id === currentId) {
        //             l.status = LOCATIONSTATUS.ACTIVE;
        //         } else {
        //             l.status = LOCATIONSTATUS.SELECTABLE;
        //         }
        //     } else {
        //         l.nextLocations.forEach(nl => {
        //             const nloc = mlocs.get(nl);
        //             if (!nloc) { throw new Error("Next location not found"); }
        //             if (nloc.status === LOCATIONSTATUS.COMPLETED) {
        //                 l.status = LOCATIONSTATUS.SELECTABLE;
        //             }
        //         });
        //     }
        // }

        // if(l.flags.includes("first") && !allLocked && l.status === LOCATIONSTATUS.SELECTABLE) {
        //     l.status = LOCATIONSTATUS.LOCKED;
        // }

        if(allLocked && l.flags.includes("first")) {
            l.status = LOCATIONSTATUS.SELECTABLE;
        }

        
            
        

        
        // nlocs.set(l.id, l);
        tempLocs.push(l);
    });

    // Go through passed locations
    return tempLocs.reduce((nlocs, loc, ind, locs) => {

        // Get statuses of all child locations
        const childStatusesNotLocked = loc.nextLocations.map(nl => {
            const nloc = locs.find(l => l.id === nl);
            if(!nloc) { throw new Error("Next location not found"); }
            return nloc.status;
        }).filter(s => s !== LOCATIONSTATUS.LOCKED);

        console.log("child statuses", childStatusesNotLocked);
        // if(childStatusesNotLocked.length > 0) {
        //     loc.status = LOCATIONSTATUS.PASSEDBY;
        // }
        

        nlocs.set(loc.id, {...loc});

        return nlocs;
    }, new Map<LocationId, Location>())


    // return nlocs;
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


    campaign.world = updateLocations(campaign.world, campaign.currentLocationId);

    const startingLocs: Location[] = Array.from(campaign.world.values()).filter(l => l.flags.includes("first"));

    function travelLocations(camp: Campaign, locId: LocationId, mplocs: MapLocation[], depth: number, trak: number): MapLocation[] {

        if (depth > 10) return mplocs;

        const loc = camp.world.get(locId);
        if (!loc) return mplocs;

        const mploc: MapLocation = {
            ...loc,
            depth: depth,
            trak: trak,
        };
        const locExists = mplocs.find(l => l.id === mploc.id);
        if (locExists) {
            if (locExists.depth < mploc.depth) {
                locExists.depth = mploc.depth;
            } else {
                return mplocs;
            }
        } else {
            mplocs.push(mploc);
        }


        if (loc.flags.includes("final")) return mplocs;

        if (loc.nextLocations.length > 0) {
            const nid = loc.nextLocations[0];

            if (!nid) return mplocs;
            return travelLocations(camp, nid, mplocs, depth + 1, trak);

        }

        return mplocs;
    }

    const locs = startingLocs.reduce((mplocs, loc, trak) => {

        return travelLocations(campaign, loc.id, mplocs, 0, trak);

    }, [] as MapLocation[]);

    return locs.sort((a, b) => a.depth - b.depth);
}

export function convertMapLocationToLocation(mloc: MapLocation): Location {

    const loc: Location = {
        id: mloc.id,
        arena: mloc.arena,
        type: mloc.type,
        status: LOCATIONSTATUS.ACTIVE,
        nextLocations: mloc.nextLocations,
        flags: mloc.flags,
        icon: mloc.icon,
    };

    return { ...loc }

}