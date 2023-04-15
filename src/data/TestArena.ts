import { Arena } from "../game/Arena";
import { Orc } from "./Enemies";


export class TestArena extends Arena {

    constructor() {
        super("Test Arena", [new Orc(), new Orc()], "#559944");
    }

}