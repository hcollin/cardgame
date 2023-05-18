import { Campaign } from "../models/Campaign";

import { LOCATIONSTATUS, LocationData, LocationId} from "../models/World";
import { World } from "./World";


// export function createLocationsMap(world: World, campaign: Campaign): Map<LocationId, Location> {
// 	return locs.reduce((world, loc) => {
// 		const nloc = createLocation(loc);

// 		nloc.init(campaign);
// 		world.set(nloc.id, nloc);
// 		return world;
// 	}, new Map<LocationId, Location>());
// }

// function createLocation(loc: Location): Location {
// 	const nloc: Location = {
// 		id: loc.id,
// 		status: LOCATIONSTATUS.LOCKED,
// 		type: loc.type,
// 		arena: [...loc.arena],
// 		nextLocations: [...loc.nextLocations],
// 		flags: [...loc.flags],
// 		icon: loc.icon,
// 		init: loc.init,
// 	};
// 	if (loc.name) {
// 		nloc.name = loc.name;
// 	}
// 	if (loc.loc) {
// 		nloc.loc = { ...loc.loc };
// 	}
// 	return nloc;
// }

export function updateLocations(mlocs: Map<LocationId, LocationData>, currentId: LocationId): Map<LocationId, LocationData> {
	const tlocs = new Map<LocationId, LocationData>();
	const nlocs = new Map<LocationId, LocationData>();

	let completedCount: number = 0;

	let currentDepth = 0;

	mlocs.forEach((l) => {
		if (l.flags.includes("completed")) {
			l.status = LOCATIONSTATUS.COMPLETED;
			completedCount++;
			if (l.loc && l.loc.y > currentDepth) {
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
