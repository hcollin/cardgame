import { ENEMYACTIONS, ENEMYACTIONTARGETS, Enemy, EnemyAction } from "../../game/Enemy";
import { DAMAGETYPE } from "../../models/Card";
import { ENEMYDATA } from "../EnemyData";
import { EFFECTS } from "../../models/Effects";

import imgFairyWarrior from "./pics/fairyWarrior.jpg";
import imgFairyMage from "./pics/fairyMage.jpg";
import imgHorrorSpider from "./pics//horrorSpider.jpg";
import imgForestSprite from "./pics/forestSprite.jpg";
import { rnd } from "rndlib";
import { ArenaState } from "../../models/ArenaState";



export class FairyWarrior extends Enemy {

    protected name: string = "Fairy Warrior";
    protected maxHealth: number = 12;

    public readonly difficulty: number = ENEMYDATA["Fairy Warrior"].difficultyNumber;
    protected experienceValue: number = ENEMYDATA["Fairy Warrior"].experienceValue;

    public image: string = imgFairyWarrior;

    protected actions: EnemyAction[] = [
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            damageType: DAMAGETYPE.SLASH,
            value: 6
        },
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            damageType: DAMAGETYPE.PIERCE,
            value: 6
        },
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            damageType: DAMAGETYPE.SLASH,
            value: 6
        },
        {
            action: ENEMYACTIONS.WAIT,
            target: ENEMYACTIONTARGETS.SELF,
        },
    ];

    constructor() {
        

        super();
        this.name = "Fairy Warrior";
        
    }
}

export class FairyMage extends Enemy {

    protected name: string = "Fairy Mage";
    protected maxHealth: number = 25;

    public readonly difficulty: number = ENEMYDATA["Fairy Mage"].difficultyNumber;
    protected experienceValue: number = ENEMYDATA["Fairy Mage"].experienceValue;

    public image: string = imgFairyMage;

    protected actions: EnemyAction[] = [
        {
            action: ENEMYACTIONS.BLOCK,
            target: ENEMYACTIONTARGETS.ENEMIES,
            value: 10
        },
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            damageType: DAMAGETYPE.MAGIC,
            value: 6
        },
        {
            action: ENEMYACTIONS.HEAL,
            target: ENEMYACTIONTARGETS.ENEMIES,
            value: 10,
            description: "Heal 10 all enemies"
        },
    ];

    constructor() {
        

        super();
        
    }
}

export class HorrorSpider extends Enemy {

    protected name: string = "Horror Spider";
    protected maxHealth: number = 22;

    public readonly difficulty: number = ENEMYDATA["Horror Spider"].difficultyNumber;
    protected experienceValue: number = ENEMYDATA["Horror Spider"].experienceValue;

    public image: string = imgHorrorSpider;


    protected actions: EnemyAction[] = [
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            damageType: DAMAGETYPE.CHAOS,
            value: 2,
            effect: EFFECTS.SLOW
        },
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            damageType: DAMAGETYPE.POISON,
            value: 3,

        },
        {
            action: ENEMYACTIONS.BLOCK,
            target: ENEMYACTIONTARGETS.SELF,
            value: 5
        },


    ];


    constructor() {
           super();
           this.maxHealth = rnd(20, 24);
    }
}

export class ForestSprite extends Enemy {

    protected name: string = "Forest Sprite";
    protected maxHealth: number = 35;

    public readonly difficulty: number = ENEMYDATA["Forest Sprite"].difficultyNumber;
    protected experienceValue: number = ENEMYDATA["Forest Sprite"].experienceValue;

    public image: string = imgForestSprite;

    protected actions: EnemyAction[] = [
        {
            action: ENEMYACTIONS.BLOCK,
            target: ENEMYACTIONTARGETS.SELF,
            value: 8
        },
        {
            action: ENEMYACTIONS.ATTACK,
            target: ENEMYACTIONTARGETS.HERO,
            value: (as: ArenaState): number => {
                return as.turn * 2;
            }
                
        },
    ];

    constructor() {
        super();
    }

}