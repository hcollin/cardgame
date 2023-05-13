import { ENEMYACTIONS, ENEMYACTIONTARGETS, ENEMYSIZE, Enemy, EnemyAction } from "../game/Enemy";
import { DAMAGETYPE } from "../models/Card";
import { EFFECTS } from "../models/Effects";

import img from "./pics/orc.png";
import imtSkel from "./pics/skeleton.png";
import imgDrag from "./pics/dragon.png";
import imgGoblin from "./pics/goblin.png";
import imgKobold from "./pics/kobold.png";
import imgTroll from "./pics/troll.png";
import imgOgre from "./pics/ogre.png";


export class Orc extends Enemy {

    protected name: string = "Orc";
    protected maxHealth: number = 25; 

    public readonly difficulty: number = 3;

    protected vulnerableTo: DAMAGETYPE[] = [];
    protected resistantTo: DAMAGETYPE[] = [];

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

export class Ogre extends Enemy {

    protected name: string = "Ogre";
    protected maxHealth: number = 45; 

    public readonly difficulty: number = 4;

    protected vulnerableTo: DAMAGETYPE[] = [DAMAGETYPE.FIRE];
    protected resistantTo: DAMAGETYPE[] = [DAMAGETYPE.PIERCE];

    public image: string = imgOgre;

    protected experienceValue: number = 85;

    protected actions: EnemyAction[] = [
        {
            action: ENEMYACTIONS.BLOCK,
            target: ENEMYACTIONTARGETS.SELF,
            value: 5,

        },
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
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: 8,
        },
        {
            action: ENEMYACTIONS.HEAL,
            target: ENEMYACTIONTARGETS.SELF,
            value: 10,
        },
        
    ];


    constructor() {
        super();
    }

}



export class Kobold extends Enemy {

    protected name: string = "Kobold";
    protected maxHealth: number = 5; 
    
    public readonly difficulty: number = 1;

    protected experienceValue: number = 8;

    public image: string = imgKobold;

    protected actions: EnemyAction[] = [
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: 2,
        },
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: 2,
        },
        {
            action: ENEMYACTIONS.WAIT,
            target: ENEMYACTIONTARGETS.SELF,
            
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


export class Goblin extends Enemy {

    protected name: string = "Goblin";
    protected maxHealth: number = 8; 

    public readonly difficulty: number = 1;

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
    
        public readonly difficulty: number = 2;

        protected vulnerableTo = [DAMAGETYPE.BLUNT];

        protected experienceValue: number = 35;

        public image: string = imtSkel;

        protected actions: EnemyAction[] = [
            {
                action: ENEMYACTIONS.ATTACK,
                target: ENEMYACTIONTARGETS.HERO,
                value: 6,
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
    
    public readonly difficulty: number = 8;

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