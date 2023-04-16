import { Arena } from "../game/Arena";
import { Orc, Skeleton } from "./Enemies";


export class TestArena extends Arena {

    constructor() {
        super("Test Arena", [new Orc(), new Skeleton()], "#559944");
    }

}