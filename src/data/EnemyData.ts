import { Enemy } from "../game/Enemy";
import { GoblinLord, GoblinSorcerer, GoblinWarrior } from "./enemies/Goblins";
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
};