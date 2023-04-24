import { Arena } from "../game/Arena";


export enum WORLDLOCATIONTYPE {
    ARENA = "ARENA",
    SHOP = "SHOP",
}

export type LocationId = string;

export enum LOCATIONSTATUS {
    LOCKED = "LOCKED",
    ACTIVE = "ACTIVE",
    CHOOSINGPATH = "CHOOSINGPATH",
    COMPLETED = "COMPLETED",
}

export interface Location {

    id: LocationId;
    status: LOCATIONSTATUS;
    type: WORLDLOCATIONTYPE;
    arena: Arena[];
    nextLocations: LocationId[];
}
