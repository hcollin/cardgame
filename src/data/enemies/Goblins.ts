import { emitKeypressEvents } from "readline";
import { ENEMYACTIONS, ENEMYACTIONTARGETS, Enemy, EnemyAction } from "../../game/Enemy";

import goblinWarrior from "./pics/goblinWarrior.jpeg";
import goblinSorcerer from "./pics/goblinSorcerer.jpeg";
import goblinLord from "./pics/goblinLord.jpeg";
import { ENEMYDATA } from "../EnemyData";

abstract class Goblin extends Enemy {
	protected groups: string[] = ["Goblinoid", "Forest"];
}

export class GoblinWarrior extends Goblin {
	protected name: string = "Goblin Warrior";
	protected maxHealth: number = 8;

	public readonly difficulty: number = ENEMYDATA["Goblin Warrior"].difficultyNumber;

	protected experienceValue: number = ENEMYDATA["Goblin Warrior"].experienceValue;

	public readonly image: string = goblinWarrior;

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

export class GoblinSorcerer extends Goblin {
	protected name: string = "Goblin Sorcerer";
	protected maxHealth: number = 7;

	public readonly difficulty: number = ENEMYDATA["Goblin Sorcerer"].difficultyNumber;

	protected experienceValue: number = ENEMYDATA["Goblin Sorcerer"].experienceValue;

	public readonly image: string = goblinSorcerer;

	protected actions: EnemyAction[] = [
		{
			action: ENEMYACTIONS.BLOCK,
			target: ENEMYACTIONTARGETS.SELF,
			value: 3,
		},
		{
			action: ENEMYACTIONS.ATTACK,
			target: ENEMYACTIONTARGETS.HERO,
			value: 5,
		},
	];

	constructor() {
		super();
	}
}

export class GoblinLord extends Goblin {
	protected name: string = "Goblin Lord";
	protected maxHealth: number = 16;

	public readonly difficulty: number = ENEMYDATA["Goblin Lord"].difficultyNumber;

	protected experienceValue: number = ENEMYDATA["Goblin Lord"].experienceValue;

	public readonly image: string = goblinLord;

	protected actions: EnemyAction[] = [
		{
			action: ENEMYACTIONS.BLOCK,
			target: ENEMYACTIONTARGETS.SELF,
			value: 5,
		},
		{
			action: ENEMYACTIONS.ATTACK,
			target: ENEMYACTIONTARGETS.HERO,
			value: 5,
		},
		{
			action: ENEMYACTIONS.HEAL,
			target: ENEMYACTIONTARGETS.SELF,
			value: 4,
		},
	];

	constructor() {
		super();
	}
}
