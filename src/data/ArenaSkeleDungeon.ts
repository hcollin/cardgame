import { Arena } from "../game/Arena";
import { Dragon, Orc, Skeleton } from "./Enemies";

import bgImg from "./pics/forestbg.jpg";

export class ArenaSkeleDungeon extends Arena {

    constructor() {
        super("Skeleton Dungeon", [new Skeleton(), new Skeleton(), new Skeleton()], "#559944", bgImg);
    }

}