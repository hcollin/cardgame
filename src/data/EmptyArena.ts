import { Arena } from "../game/Arena";
import { Dragon, Orc, Skeleton } from "./Enemies";

import bgImg from "./pics/forestbg.jpg";

export class EmptyArena extends Arena {

    constructor() {
        super("Empty Arena", [], "#559944", bgImg);
    }

}