import { Arena } from "../game/Arena";


export enum WORLDLOCATIONTYPE {
    ARENA = "ARENA",
    SHOP = "SHOP",
}

export type LocationId = string;

export interface Location {

    id: LocationId;
    type: WORLDLOCATIONTYPE;
    arena: Arena[];
    nextLocations: LocationId[];
    startLocation: boolean;
}
