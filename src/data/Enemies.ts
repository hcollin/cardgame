import { Enemy } from "../game/Enemy";
import { DAMAGETYPE } from "../models/Card";

import img from "./pics/orc.png";
import imtSkel from "./pics/skeleton.png";


export class Orc extends Enemy {

    protected name: string = "Orc";
    protected maxHealth: number = 25; 
    protected attackValue: number = 5;

    public image: string = img;


    constructor() {
        super();
    }

}

export class Skeleton extends Enemy {
    
        protected name: string = "Skeleton";
        protected maxHealth: number = 15; 
        protected attackValue: number = 6;
    
        protected vulnerableTo = [DAMAGETYPE.BLUNT];

        public image: string = imtSkel;

        constructor() {
            super();
        }   
}