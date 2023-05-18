import { arnd } from "rndlib";
import { LocationId, LocationData, LOCATIONSTATUS } from "../models/LocationModels";
import { generateRandomWorld } from "../utils/RandomWorldGenerator";


export interface worldOptions {
	depth: number;
	width: number;
	name: string;
	themes: string[];
	difficulty: [number, number];
}

export class World {
	public depth: number = 12;
	public width: number = 7;

	public locations: Map<LocationId, LocationData> = new Map<LocationId, LocationData>();
	public name: string = "";

	public activeLocationId: LocationId = "";

	public status: "COMPLETED" | "ACTIVE" | "LOCKED" = "LOCKED";

    public themes: string[] = [];
    
	constructor(opts: Partial<worldOptions>) {
        this.depth = opts.depth || 12;
        this.width = opts.width || 7;
        this.name = opts.name || this.createRandomName();
        this.themes = opts.themes || [];
        this.status = "LOCKED";
    }


    public getLocation(locId: LocationId): LocationData {
        const loc = this.locations.get(locId);
        if (!loc) { throw new Error(`World.ts:getLocation(): LocationData ID ${locId} not found`); }
        return loc;
    }

    public getLocationsArray(): LocationData[] {
        return Array.from(this.locations.values());
    }       

    public updateLocation(loc: LocationData) {
        this.locations.set(loc.id, loc);
    }

    /**
     * Create random Locations and arenas for this world based on the themes and difficulty
     * 
     * Old locations are cleared before generating new.
     */
    public createRandomLocations() {
        const locs = generateRandomWorld({
			depth: this.depth,
			width: this.width,
			theme: this.themes,

		});

        this.locations.clear();

        locs.forEach((l) => {
            this.locations.set(l.id, l);
        });

    }

	/**
	 * Reset all LocationData statuses
	 *
	 * This method allowes the game to calculate the current status of all locations in the world. Every LocationData
	 * is set to LOCKED at the first unless they are marked COMPLETD. Then all locations that are connected to
	 * completed locations are set to SELECTABLE unless they are deeper than or at the current depth or they are also
	 * marked COMPLETED. Finally the current LocationData is set to ACTIVE.
	 */
	public updateLocationStatuses() {
		const tlocs = new Map<LocationId, LocationData>();
		const nlocs = new Map<LocationId, LocationData>();

		let completedCount: number = 0;

		let currentDepth = 0;

		this.locations.forEach((l) => {
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

		const currentLoc = nlocs.get(this.activeLocationId);
		if (currentLoc && currentLoc.status !== LOCATIONSTATUS.COMPLETED) {
			currentLoc.status = LOCATIONSTATUS.ACTIVE;
			nlocs.set(currentLoc.id, currentLoc);
		}

		this.locations = nlocs;
	}


    /**
     * Activate this world and return a shallow copy of locations
     * 
     * @returns 
     */
    public activateWorld(): Map<LocationId, LocationData> {
        this.status = "ACTIVE";
        return new Map(this.locations);
    }

    public completeWorld() {
        this.status = "COMPLETED";

    }

    /**
     * Return next valid locations for the current LocationData
     * 
     * @returns LocationData[]
     */
	public getNextValidLocationsForCurrentLocation(): LocationData[] {
		const currentLocation = this.getActiveLocation();
		if (!currentLocation) {
			return [];
		}

		return currentLocation.nextLocations.reduce((acc: LocationData[], nextLocationId) => {
			const nextLocation = this.locations.get(nextLocationId);

			if (nextLocation && nextLocation.status === LOCATIONSTATUS.SELECTABLE) {
				acc.push(nextLocation);
			}
			return acc;
		}, []);
	}

	public getActiveLocation(): LocationData | null {
		if (this.activeLocationId === null) {
			return null;
		}
		return this.locations.get(this.activeLocationId) || null;
	}



    private createRandomName() {
        const part1: string[] = ["Ancient", "Holy", "Restless", "Wild", "Misty", "Dark", "Lost", "Forgotten", "Hidden", "Forbidden"];
        const part2: string[] = ["Forest", "Meadows", "Hills", "Ruins", "Valley", "Land", "Plains", "Woods", "Swamp"];

        return `${arnd(part1)} ${arnd(part2)}`;
    }
}
