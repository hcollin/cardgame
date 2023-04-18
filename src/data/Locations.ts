import { WORLDLOCATIONTYPE, Location } from "../models/World";
import { ArenaDragonsLair } from "./ArenaDragonsLair";
import { ArenaOrcVillage } from "./ArenaOrcVillage";
import { ArenaSkeleDungeon } from "./ArenaSkeleDungeon";

export const LOCATIONS: Location[] = [
    {
        id: "OrcVillage",
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaOrcVillage()],
        nextLocations: ["SkeletonDungeon"],
        startLocation: true
    },
    {
        id: "SkeletonDungeon",
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaSkeleDungeon()],
        nextLocations: ["DragonsLair"],
        startLocation: false
    },
    {
        id: "DragonsLair",
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaDragonsLair()],
        nextLocations: ["OrcVillage"],
        startLocation: false
    }
];