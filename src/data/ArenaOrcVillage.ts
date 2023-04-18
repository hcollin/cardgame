import { Arena } from "../game/Arena";
import { Dragon, Orc, Skeleton } from "./Enemies";

import bgImg from "./pics/forestbg.jpg";

export class ArenaOrcVillage extends Arena {

    constructor() {
        super("Orc Village", [new Orc(), new Orc(), new Orc()], "#559944", bgImg);
    }

}