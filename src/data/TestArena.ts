import { Arena } from "../game/Arena";
import { Orc, Skeleton } from "./Enemies";

import bgImg from "./pics/forestbg.jpg";

export class TestArena extends Arena {

    constructor() {
        super("Test Arena", [new Orc(), new Skeleton()], "#559944", bgImg);
    }

}