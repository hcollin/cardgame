import { Arena } from "../game/Arena";
import { Dragon, Goblin, Orc, Skeleton } from "./Enemies";

import bgImg from "./pics/forestbg.jpg";

export class ArenaGoblinLair extends Arena {

    constructor() {
        
        super("Goblin Lair", [new Goblin(), new Goblin(), new Orc(), new Goblin(), new Goblin()], "#559944", bgImg);
    }

}