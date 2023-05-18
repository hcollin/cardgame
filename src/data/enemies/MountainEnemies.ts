import { Enemy, EnemyAction, ENEMYACTIONS, ENEMYACTIONTARGETS } from "../../game/Enemy";
import { ArenaState } from "../../models/ArenaState";
import { ENEMYDATA } from "../EnemyData";

import imgFrostTroll from "./pics/frosttroll.png";
import imgWolf from "./pics/wolf.jpg";
import imgHare from "./pics/hillhare.png";

export class Wolf extends Enemy {
	protected name: string = "Wolf";
	protected maxHealth: number = 12;

	public readonly difficulty: number = ENEMYDATA["Wolf"].difficultyNumber;

	protected experienceValue: number = ENEMYDATA["Wolf"].experienceValue;

	public image: string = imgWolf;

	protected actions: EnemyAction[] = [
		{
			action: ENEMYACTIONS.ATTACK,
			target: ENEMYACTIONTARGETS.HERO,
			value: (as: ArenaState) => {
				// How many living wolves are in the arena?
				let livingWolves = as.arena.enemies.filter((enemy) => enemy.getName() === "Wolf" && !enemy.isDead()).length;
				return 5 * livingWolves;
			},
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

export class HillHare extends Enemy {
	protected name: string = "Hill Hare";
	protected maxHealth: number = 4;

	public readonly difficulty: number = ENEMYDATA["Hill Hare"].difficultyNumber;

	protected experienceValue: number = ENEMYDATA["Hill Hare"].experienceValue;

	public image: string = imgHare;

	protected actions: EnemyAction[] = [
		{
			action: ENEMYACTIONS.SPECIAL1,
			target: ENEMYACTIONTARGETS.SELF,
            description: "BREED!",
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
	];

    /**
     * Hillhare will multiple! Like Rabbits! :facepalm:
     * 
     * @param as 
     * @param act 
     * @returns 
     */
	protected actionSpecial1(as: ArenaState, act: EnemyAction) {
		const clonedRabbit = new HillHare();
		clonedRabbit.resetEnemy();
		as.arena.enemies.push(clonedRabbit);
		return { ...as };
	}

	constructor() {
		super();
	}
}

export class FrostTroll extends Enemy {
	protected name: string = "Frost Troll";
	protected maxHealth: number = 100;

	public readonly difficulty: number = ENEMYDATA["Frost Troll"].difficultyNumber;

	protected experienceValue: number = ENEMYDATA["Frost Troll"].experienceValue;

	public image: string = imgFrostTroll;

	protected actions: EnemyAction[] = [
		{
			action: ENEMYACTIONS.ATTACK,
			target: ENEMYACTIONTARGETS.HERO,
			value: 20,
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
