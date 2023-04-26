import { Arena } from "../game/Arena";
import { Dragon, Goblin, Orc, Skeleton } from "./Enemies";

import bgImg from "./pics/forestbg.jpg";

export class ArenaGoblinAmbush extends Arena {

    constructor() {
        
        super("Goblin Ambush", [new Goblin(), new Goblin(), new Goblin()], "#559944", bgImg);
    }

}