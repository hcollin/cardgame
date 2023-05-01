import { Arena } from "../game/Arena";
import { Campaign } from "./Campaign";


export enum WORLDLOCATIONTYPE {
    START = "START",
    END = "END",
    ARENA = "ARENA",
    SHOP = "SHOP",
}

export type LocationId = string;

export enum LOCATIONSTATUS {
    LOCKED = "LOCKED",
    ACTIVE = "ACTIVE",
    SELECTABLE = "SELECTABLE", 
    PASSEDBY = "PASSEDBY",
    CHOOSINGPATH = "CHOOSINGPATH",
    COMPLETED = "COMPLETED",
}


export type LOCATIONFLAG = "first"|"final"|"completed";

export interface Location {

    id: LocationId;
    status: LOCATIONSTATUS;
    type: WORLDLOCATIONTYPE;
    arena: Arena[];
    nextLocations: LocationId[];
    flags: LOCATIONFLAG[];
    icon: string;
    init: (campaign: Campaign) => void;
}


export interface MapLocation extends Location { 
    depth: number;
    trak: number;

}
