import { Arena } from "../game/Arena";
import { Dragon, Goblin, Orc, Skeleton } from "./Enemies";
import { BronzeBuckler } from "./items/BronzeBuckler";
import { Dagger } from "./items/Dagger";
import { HandAxe } from "./items/HandAxe";
import { LeatherBoots } from "./items/Boots";
import { LongSword } from "./items/LongSword";
import { IronMace } from "./items/IronMace";
import { MinorRingOfHealing } from "./items/RingOfHealing";
import { RingOfRegeneration } from "./items/RingOfRegeneration";
import { RoundShield } from "./items/RoundShield";

import bgImg from "./pics/forestbg.jpg";

export class ArenaGoblinAmbush extends Arena {

    protected rewardItems = [
        LongSword,
        HandAxe,
        IronMace,
        Dagger,
        BronzeBuckler,
        LeatherBoots,
        RoundShield,
    ];

    constructor() {
        
        super("Goblin Ambush", [new Goblin(), new Goblin(), new Goblin()], "#559944", bgImg);
        // super("Goblin Ambush", [new Goblin()], "#559944", bgImg);
    }

}