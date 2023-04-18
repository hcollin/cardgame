import { Arena } from "../game/Arena";
import { Dragon, Orc, Skeleton } from "./Enemies";

import bgImg from "./pics/forestbg.jpg";

export class TestArena extends Arena {

    constructor() {
        super("Test Arena", [new Dragon()], "#559944", bgImg);
    }

}