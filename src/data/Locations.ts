
import { WORLDLOCATIONTYPE, Location, LOCATIONSTATUS } from "../models/World";
import { ArenaDragonsLair } from "./ArenaDragonsLair";
import { ArenaForestEncounter } from "./ArenaForestEncounter";
import { ArenaGoblinAmbush } from "./ArenaGoblinAmbush";
import { ArenaGoblinLair } from "./ArenaGoblinLair";
import { ArenaOrcVillage } from "./ArenaOrcVillage";
import { ArenaSkeleDungeon } from "./ArenaSkeleDungeon";
import { ArenaTrollCave } from "./ArenaTrollCave";
import { ARENADIFFICULTY } from "./Difficulties";
import { EmptyArena } from "./EmptyArena";


export const LOCATIONS: Location[] = [
    {
        id: "EasyForest",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new EmptyArena()],
        nextLocations: ["MediumForest"],
        flags: ["first"],
        icon: "forest",
        init: function(c) {
            this.arena = [new ArenaForestEncounter(ARENADIFFICULTY.VERYEASY)];
        }
    },

    {
        id: "MediumForest",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new EmptyArena()],
        nextLocations: ["HardForest"],
        flags: [],
        icon: "forest",
        init: function(c) {
            this.arena = [new ArenaForestEncounter(ARENADIFFICULTY.EASY)];
        }
    },

    {
        id: "HardForest",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new EmptyArena()],
        nextLocations: ["SkeletonDungeon"],
        flags: [],
        icon: "forest",
        init: function(c) {
            this.arena = [new ArenaForestEncounter(ARENADIFFICULTY.MEDIUM)];
        }
    },
    
    {
        id: "GoblinRaid",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaGoblinAmbush()],
        nextLocations: ["GoblinCamp"],
        flags: ["first"],
        icon: "forest",
        init: function(c) {
            this.arena = [new ArenaGoblinAmbush()];
        }
    },
    {
        id: "GoblinCamp",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaGoblinLair()],
        nextLocations: ["SkeletonDungeon"],
        flags: [],
        icon: "camp",
        init: function(c) {
            this.arena = [new ArenaGoblinLair()];
        }
    },
    
    {
        id: "SkeletonDungeon",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaSkeleDungeon()],
        nextLocations: ["TrollCave"],
        flags: [],
        icon: "dungeon",
        init: function(c) {
            this.arena = [new ArenaSkeleDungeon()];
        }
    },
    {
        id: "DragonsLair",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaDragonsLair()],
        nextLocations: [],
        flags: ["final"],
        icon: "mountain",
        init: function(c) {
            this.arena = [new ArenaDragonsLair()];
        }
    },
    {
        id: "TrollCave",
        status: LOCATIONSTATUS.LOCKED,
        type: WORLDLOCATIONTYPE.ARENA,
        arena: [new ArenaTrollCave()],
        nextLocations: [],
        flags: ["final"],
        icon: "dungeon",
        init: function(c) {
            this.arena = [new ArenaTrollCave()];
        }
    }
    
];