import { Arena } from "../game/Arena";
import { FrostTroll } from "./enemies/MountainEnemies";

import bgImg from "./pics/forestbg.jpg";

export class ArenaTrollCave extends Arena {

    constructor() {
        super("Troll Cave", [new FrostTroll()], "#559944", bgImg);
        // super("Orc Village", [new Goblin()], "#559944", bgImg);
    }

}