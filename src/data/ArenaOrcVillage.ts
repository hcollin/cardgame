import { Arena } from "../game/Arena";
import { Dragon, Goblin, Orc, Skeleton } from "./Enemies";

import bgImg from "./pics/forestbg.jpg";

export class ArenaOrcVillage extends Arena {

    constructor() {
        super("Orc Village", [new Orc(), new Orc()], "#559944", bgImg);
        // super("Orc Village", [new Goblin()], "#559944", bgImg);
    }

}