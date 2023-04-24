import { WORLDLOCATIONTYPE, Location, LOCATIONSTATUS } from "../models/World";
import { ArenaDragonsLair } from "./ArenaDragonsLair";
import { ArenaOrcVillage } from "./ArenaOrcVillage";
import { ArenaSkeleDungeon } from "./ArenaSkeleDungeon";

export const LOCATIONS: Location[] = [
    {
        id: "OrcVillage",
        status: LOCATIONSTATUS.ACTIVE,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaOrcVillage()],
        nextLocations: ["SkeletonDungeon"],
    },
    {
        id: "SkeletonDungeon",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaSkeleDungeon()],
        nextLocations: ["DragonsLair"],
    },
    {
        id: "DragonsLair",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaDragonsLair()],
        nextLocations: ["OrcVillage"],
    }
];