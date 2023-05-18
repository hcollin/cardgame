import { Arena } from "../game/Arena";
import { Campaign } from "./Campaign";


export enum WORLDLOCATIONTYPE {
    START = "START",
    END = "END",
    ARENA = "ARENA",
    VILLAGE = "VILLAGE",
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

export interface LocationData {

    id: LocationId;
    name?: string;
    status: LOCATIONSTATUS;
    type: WORLDLOCATIONTYPE;
    arena: Arena[];
    nextLocations: LocationId[];
    flags: LOCATIONFLAG[];
    icon: string;
    loc?: {
        x: number;
        y: number;
        dx: number;
        dy: number;
    },
    init: (campaign: Campaign) => void;
}

