import { Arena } from "../game/Arena";
import { Dragon, Orc, Skeleton } from "./Enemies";

import bgImg from "./pics/forestbg.jpg";

export class ArenaDragonsLair extends Arena {

    constructor() {
        super("Dragon's Lair", [new Dragon()], "#559944", bgImg);
    }

}