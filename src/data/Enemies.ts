import { ENEMYACTIONS, ENEMYACTIONTARGETS, ENEMYSIZE, Enemy, EnemyAction } from "../game/Enemy";
import { DAMAGETYPE } from "../models/Card";
import { EFFECTS } from "../models/Effects";

import img from "./pics/orc.png";
import imtSkel from "./pics/skeleton.png";
import imgDrag from "./pics/dragon.png";
import imgGoblin from "./pics/goblin.png";
import imgTroll from "./pics/troll.png";

export class Orc extends Enemy {

    protected name: string = "Orc";
    protected maxHealth: number = 25; 
    protected attackValue: number = 5;

    protected vulnerableTo: DAMAGETYPE[] = [DAMAGETYPE.SLASH];
    protected resistantTo: DAMAGETYPE[] = [DAMAGETYPE.BLUNT];

    public image: string = img;

    protected experienceValue: number = 50;

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

export class FrostTroll extends Enemy {

    protected name: string = "Frost Troll";
    protected maxHealth: number = 100; 
    protected attackValue: number = 5;

    protected experienceValue: number = 200;

    public image: string = imgTroll;

    protected actions: EnemyAction[] = [
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: 10,
        },
        {
            action: ENEMYACTIONS.WAIT,
            target: ENEMYACTIONTARGETS.SELF,
        },
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: 10,
        },
        {
            action: ENEMYACTIONS.HEAL,
            target: ENEMYACTIONTARGETS.SELF,
            value: 20,
        },
    ];


    constructor() {
        super();
    }

}

export class Goblin extends Enemy {

    protected name: string = "Goblin";
    protected maxHealth: number = 8; 
    protected attackValue: number = 3;

    protected experienceValue: number = 15;

    public image: string = imgGoblin;

    protected actions: EnemyAction[] = [
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: 3,
        },
        {
            action: ENEMYACTIONS.WAIT,
            target: ENEMYACTIONTARGETS.SELF,
            
        },
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: 3,
        },
        {
            action: ENEMYACTIONS.WAIT,
            target: ENEMYACTIONTARGETS.SELF,
            
        },
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: 6,
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

        protected experienceValue: number = 35;

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

export class Dragon extends Enemy {
    protected name: string = "Dragon";
    protected maxHealth: number = 250; 
    protected attackValue: number = 5;

    protected size: ENEMYSIZE = ENEMYSIZE.LARGE;

    protected resistantTo = [DAMAGETYPE.FIRE];
    protected vulnerableTo = [DAMAGETYPE.ICE];

    protected effectImmunities = [EFFECTS.BURNING, EFFECTS.STUNNED];

    protected experienceValue: number = 500;

    public image: string = imgDrag;

    protected actions: EnemyAction[] = [
        {
            action: ENEMYACTIONS.WAIT,
            target: ENEMYACTIONTARGETS.SELF,
        },
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: 8,
        },
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: 16,
        },
        {
            action: ENEMYACTIONS.WAIT,
            target: ENEMYACTIONTARGETS.SELF,
        },
        {
            action: ENEMYACTIONS.HEAL,
            target: ENEMYACTIONTARGETS.SELF,
            value: 5,
        },
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: 8,
        }
    ];


    constructor() {
        super();
    }
}