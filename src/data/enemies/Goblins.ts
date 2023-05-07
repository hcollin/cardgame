import { emitKeypressEvents } from "readline";
import { ENEMYACTIONS, ENEMYACTIONTARGETS, Enemy, EnemyAction } from "../../game/Enemy";

import goblinWarrior from "./pics/goblinWarrior.jpeg";
import goblinSorcerer from "./pics/goblinSorcerer.jpeg";
import goblinLord from "./pics/goblinLord.jpeg";

abstract class Goblin extends Enemy {
	protected groups: string[] = ["Goblinoid", "Forest"];
}

export class GoblinWarrior extends Goblin {
	protected name: string = "Goblin Warrior";
	protected maxHealth: number = 8;

	public readonly difficulty: number = 1;

	protected experienceValue: number = 15;

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

	public readonly difficulty: number = 1;

	protected experienceValue: number = 15;

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

	public readonly difficulty: number = 2;

	protected experienceValue: number = 25;

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
