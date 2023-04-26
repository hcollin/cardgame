import { WORLDLOCATIONTYPE, Location, LOCATIONSTATUS } from "../models/World";
import { ArenaDragonsLair } from "./ArenaDragonsLair";
import { ArenaGoblinAmbush } from "./ArenaGoblinAmbush";
import { ArenaGoblinLair } from "./ArenaGoblinLair";
import { ArenaOrcVillage } from "./ArenaOrcVillage";
import { ArenaSkeleDungeon } from "./ArenaSkeleDungeon";
import { ArenaTrollCave } from "./ArenaTrollCave";


export const LOCATIONS: Location[] = [
    {
        id: "OrcVillage",
        status: LOCATIONSTATUS.ACTIVE,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaOrcVillage()],
        nextLocations: ["SkeletonDungeon"],
        flags: ["first"],
        icon: "camp"
    },
    {
        id: "GoblinRaid",
        status: LOCATIONSTATUS.ACTIVE,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaGoblinAmbush()],
        nextLocations: ["GoblinCamp"],
        flags: ["first"],
        icon: "forest"
    },
    {
        id: "GoblinCamp",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaGoblinLair()],
        nextLocations: ["SkeletonDungeon"],
        flags: [],
        icon: "camp"
    },
    
    {
        id: "SkeletonDungeon",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaSkeleDungeon()],
        nextLocations: ["TrollCave"],
        flags: [],
        icon: "dungeon"
    },
    {
        id: "DragonsLair",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaDragonsLair()],
        nextLocations: [],
        flags: ["final"],
        icon: "mountain"
    },
    {
        id: "TrollCave",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaTrollCave()],
        nextLocations: [],
        flags: ["final"],
        icon: "dungeon"
    }
    
];