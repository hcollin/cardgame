import { Enemy } from "../game/Enemy";

import img from "./pics/orc.png";


export class Orc extends Enemy {

    protected name: string = "Orc";
    protected maxHealth: number = 25; 
    protected attackValue: number = 5;

    public image: string = img;


    constructor() {
        super();
    }

}