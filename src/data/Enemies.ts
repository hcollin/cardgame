import { ENEMYACTIONS, ENEMYACTIONTARGETS, Enemy, EnemyAction } from "../game/Enemy";
import { DAMAGETYPE } from "../models/Card";

import img from "./pics/orc.png";
import imtSkel from "./pics/skeleton.png";


export class Orc extends Enemy {

    protected name: string = "Orc";
    protected maxHealth: number = 25; 
    protected attackValue: number = 5;

    public image: string = img;

    protected actions: EnemyAction[] = [
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: 5,
        },
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: 5,
        },
        {
            action: ENEMYACTIONS.WAIT,
            target: ENEMYACTIONTARGETS.SELF,
        },
    ];


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

        protected actions: EnemyAction[] = [
            {
                action: ENEMYACTIONS.ATTACK,
                target: ENEMYACTIONTARGETS.HERO,
                value: 8,
            },
            {
                action: ENEMYACTIONS.WAIT,
                target: ENEMYACTIONTARGETS.SELF,
            },
            {
                action: ENEMYACTIONS.HEAL,
                target: ENEMYACTIONTARGETS.SELF,
                value: 3,
            }
        ];

        constructor() {
            super();
        }   
}