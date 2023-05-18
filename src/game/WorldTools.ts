import { rnd } from "rndlib";
import { ArenaOrcVillage } from "../data/ArenaOrcVillage";
import { Campaign } from "../models/Campaign";

import { LOCATIONSTATUS, Location, LocationId, MapLocation, NodeLocation, WORLDLOCATIONTYPE } from "../models/World";
import { LocNode, LocNodeLink, calculateForces } from "../utils/forceCalc";

export function createWorld(locs: Location[], campaign: Campaign): Map<LocationId, Location> {
	return locs.reduce((world, loc) => {
		const nloc = createLocation(loc);

		nloc.init(campaign);
		world.set(nloc.id, nloc);
		return world;
	}, new Map<LocationId, Location>());
}

function createLocation(loc: Location): Location {
	const nloc: Location = {
		id: loc.id,
		status: LOCATIONSTATUS.LOCKED,
		type: loc.type,
		arena: [...loc.arena],
		nextLocations: [...loc.nextLocations],
		flags: [...loc.flags],
		icon: loc.icon,
		init: loc.init,
	};
	if (loc.name) {
		nloc.name = loc.name;
	}
	if(loc.loc) {
		nloc.loc = {...loc.loc};
	}
	return nloc;
}

export function updateLocations(mlocs: Map<LocationId, Location>, currentId: LocationId): Map<LocationId, Location> {
	const tlocs = new Map<LocationId, Location>();
	const nlocs = new Map<LocationId, Location>();

	let completedCount: number = 0;

	let currentDepth = 0;

	mlocs.forEach((l) => {
		if (l.flags.includes("completed")) {
			l.status = LOCATIONSTATUS.COMPLETED;
			completedCount++;
			if(l.loc && l.loc.y > currentDepth) {
				currentDepth = l.loc.y;
			}
		} else {
			l.status = LOCATIONSTATUS.LOCKED;
		}
		tlocs.set(l.id, l);
	});

	tlocs.forEach((l) => {
		if (l.status === LOCATIONSTATUS.COMPLETED) {
			l.nextLocations.forEach((nl) => {
				const nloc = tlocs.get(nl);
				const nlocy = nloc?.loc?.y || 0;
				if (nloc && nlocy > currentDepth && nloc.status !== LOCATIONSTATUS.COMPLETED) {
					nloc.status = LOCATIONSTATUS.SELECTABLE;
					nlocs.set(nloc.id, nloc);
				}
			});
		}
		if (completedCount === 0 && l.flags.includes("first")) {
			l.status = LOCATIONSTATUS.SELECTABLE;
		}
		nlocs.set(l.id, l);
	});

	const currentLoc = nlocs.get(currentId);
	if (currentLoc && currentLoc.status !== LOCATIONSTATUS.COMPLETED) {
		currentLoc.status = LOCATIONSTATUS.ACTIVE;
		nlocs.set(currentLoc.id, currentLoc);
	}

	return nlocs;
}

// export function selectNextLocation(as: arenaState): Location {
//     if(as.world.size === 0) { throw new Error("World not initialized"); }
//     if(as.currentLocationId === "") {
//         const locs = Array.from(as.world.values());
//         const loc = locs.find(l => l.status === LOCATIONSTATUS.ACTIVE);
//         if(!loc) { throw new Error("No start location found"); }
//         return loc;
//     }

//     const cloc = as.world.get(as.currentLocationId);
//     if(!cloc) { throw new Error("Current location not found"); }
//     const nloc = as.world.get(cloc.nextLocations[0]);
//     if(!nloc) { throw new Error("Next location not found"); }
//     return nloc;
// }

export function buildMapLocations(campaign: Campaign): MapLocation[] {
	campaign.world = updateLocations(campaign.world, campaign.currentLocationId);

	const startingLocs: Location[] = Array.from(campaign.world.values()).filter((l) => l.flags.includes("first"));

	function travelLocations(camp: Campaign, locId: LocationId, mplocs: MapLocation[], depth: number, trak: number): MapLocation[] {
		if (depth > 10) return mplocs;
		
		const loc = camp.world.get(locId);
		if (!loc) return mplocs;
		const mploc: MapLocation = {
			...loc,
			depth: depth,
			trak: trak,
		};
		const locExists = mplocs.find((l) => l.id === mploc.id);
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

	console.log("\nLocations", campaign.world.size, Array.from(campaign.world.values()).map((l) => l.name).join(", "))
	const locs = startingLocs.reduce((mplocs, loc, trak) => {
		return travelLocations(campaign, loc.id, mplocs, 0, trak);
	}, [] as MapLocation[]);

	return locs.sort((a, b) => a.depth - b.depth);
}

export function buildNodeLocations(campaign: Campaign): NodeLocation[] {
	const lnodes: LocNode[] = Array.from(campaign.world.values()).map((loc, ind) => {
		let x = rnd(-150, 150);
		let y = rnd(-150, 150);
		if(loc.flags.includes("first")) {
			x = 0;
			y = 0;
		}
		return {
			id: loc.id,
			x: x,
			y: y,
			vx: 0,
			vy: 0,
		};
	});

	const links = Array.from(
		Array.from(campaign.world.values()).reduce((links, loc) => {
			// Add ext next location as a link to the current location
			loc.nextLocations.forEach((nl) => {
				const link: LocNodeLink = {
					source: loc.id,
					target: nl,
				};
				links.add(link);
			});

			return links;
		}, new Set<LocNodeLink>()),
	);

	calculateForces(lnodes, links, 100);

	const nodeLocations: NodeLocation[] = lnodes.map((ln) => {
		const loc = campaign.world.get(ln.id);
		if (!loc) throw new Error("Location not found");
		const nloc: NodeLocation = {
			...loc,
			x: ln.x,
			y: ln.y,
		};
		console.log(nloc.name, nloc.x, nloc.y);
		return nloc;
	});

	return nodeLocations;
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
		init: mloc.init,
	};

	return { ...loc };
}
