import { Enemy } from "../game/Enemy";
import { Dragon } from "./Enemies";
import { FairyMage, FairyWarrior, ForestSprite, HorrorSpider } from "./enemies/ForestEnemies";

import { GoblinLord, GoblinSorcerer, GoblinWarrior } from "./enemies/Goblins";
import { FrostTroll, HillHare, Wolf } from "./enemies/MountainEnemies";
import { OrcWarlord } from "./enemies/Orcs";
import { OrcShaman } from "./enemies/Orcs";
import { OrcBerserker } from "./enemies/Orcs";


export interface EnemyData {
    name: string;
    difficultyNumber: number;
    experienceValue: number;
    enemyClass: typeof Enemy;
}


export const ENEMYDATA: { [key: string]: EnemyData } = {

    // Forest Enemies
    "Orc Berserker": {
        name: "Orc Berserker",
        difficultyNumber: 2,
        experienceValue: 25,
        enemyClass: OrcBerserker,
    },
    "Orc Shaman": {
        name: "Orc Shaman",
        difficultyNumber: 3,
        experienceValue: 35,
        enemyClass: OrcShaman,
    },
    "Orc Warlord": {
        name: "Orc Warlord",
        difficultyNumber: 5,
        experienceValue: 125,
        enemyClass: OrcWarlord,
    },
    "Goblin Warrior": {
        name: "Goblin Warrior",
        difficultyNumber: 1,
        experienceValue: 15,
        enemyClass: GoblinWarrior,
    },
    "Goblin Sorcerer": {
        name: "Goblin Sorcerer",
        difficultyNumber: 1,
        experienceValue: 15,
        enemyClass: GoblinSorcerer,
    },
    "Goblin Lord": {
        name: "Goblin Lord",
        difficultyNumber: 2,
        experienceValue: 25,
        enemyClass: GoblinLord,
    },


    "Fairy Warrior":{
        name: "Fairy Warrior",
        difficultyNumber: 2,
        experienceValue: 30,
        enemyClass: FairyWarrior
    },
    "Fairy Mage": {
        name: "Fairy Mage",
        difficultyNumber: 4,
        experienceValue: 75,
        enemyClass: FairyMage
    },

    "Horror Spider": {
        name: "Horror Spider",
        difficultyNumber: 3,
        experienceValue: 30,
        enemyClass: HorrorSpider
    },
    
    "Forest Sprite": {
        name: "Forest Sprite",
        difficultyNumber: 4,
        experienceValue: 40,
        enemyClass: ForestSprite
    },



    "Dragon": {
        name: "Dragon",
        difficultyNumber: 20,
        experienceValue: 1000,
        enemyClass: Dragon,
    },

    // Mountain Enemies
    "Hill Hare": {
        name: "Hill Hare",
        difficultyNumber: 1,
        experienceValue: 10,
        enemyClass: HillHare,
    },
    "Frost Troll": {
        name: "Frost Troll",
        difficultyNumber: 6,
        experienceValue: 200,
        enemyClass: FrostTroll,
    },
    "Wolf": {
        name: "Wolf",
        difficultyNumber: 2,
        experienceValue: 20,
        enemyClass: Wolf,
    },


    

};

export function enemyDataArray(): EnemyData[] {
    return Object.values(ENEMYDATA);
}