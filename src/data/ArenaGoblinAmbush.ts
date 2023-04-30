import { Arena } from "../game/Arena";
import { Dragon, Goblin, Orc, Skeleton } from "./Enemies";
import { HandAxe } from "./items/HandAxe";
import { LongSword } from "./items/LongSword";
import { Mace } from "./items/Mace";
import { RingOfHealing } from "./items/RingOfHealing";
import { RingOfRegeneration } from "./items/RingOfRegeneration";
import { Shield } from "./items/Shield";

import bgImg from "./pics/forestbg.jpg";

export class ArenaGoblinAmbush extends Arena {

    protected rewardItems = [
        LongSword,
        HandAxe,
        RingOfRegeneration,
        RingOfHealing,
        
    ];

    constructor() {
        
        // super("Goblin Ambush", [new Goblin(), new Goblin(), new Goblin()], "#559944", bgImg);
        super("Goblin Ambush", [new Goblin()], "#559944", bgImg);
    }

}