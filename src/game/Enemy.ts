import { rnd } from "rndlib";
import { Damage } from "../models/Card";
import { GameState } from "../models/GameState";
import { getDamageRange } from "./ItemTools";

export enum ENEMYSTATUS {
	ALIVE = "alive",
	DEAD = "dead",
}

export interface EnemyStata {
	name: string;
	damage: number;
	health: number;
	status: ENEMYSTATUS;

	action: string;
}

export class Enemy {
	protected name: string = "No name";
	protected health: number;
	protected maxHealth: number = 100;
	protected attackValue: number = 5;

	private status: ENEMYSTATUS = ENEMYSTATUS.ALIVE;

	public image: string = "";

	constructor() {
		this.health = this.maxHealth;
	}

	public getName(): string {
		return this.name;
	}

	public getHealth(): number {
		return this.health;
	}

	public attack(): number {
		if (this.status === ENEMYSTATUS.DEAD) {
			return 0;
		}
		return this.attackValue;
	}

	public takeDamage(damage: Damage): void {
		const damageRange = getDamageRange(damage);

		this.health -= rnd(damageRange[0], damageRange[1]);
		if (this.health <= 0) {
			this.status = ENEMYSTATUS.DEAD;
		}
	}

	public resetEnemy(): void {
		this.health = this.maxHealth;
		this.status = ENEMYSTATUS.ALIVE;
	}

	public isDead(): boolean {
		return this.status === ENEMYSTATUS.DEAD;
	}

	/**
	 * Event hook that is triggered when the enemy dies
	 * @param gs GameState
	 * @returns
	 */
	public atDeath(gs: GameState): GameState {
		return gs;
	}

	/**
	 * Event hook that is triggeered at the end of enemy turn
	 * @param gs GameState
	 * @returns GameState
	 */
	public atEndOfEnemyTurn(gs: GameState): GameState {
		return gs;
	}

	/**
	 * Event hook that is triggered at the start of enemy turn
	 * @param gs GameState
	 * @returns GameState
	 */
	public atStartOfEnemyTurn(gs: GameState): GameState {
		return gs;
	}

	/**
	 * Event hook that is triggeed at the start player turn
	 * @param gs GameState
	 * @returns GameState
	 */
	public atStartOfPlayerTurn(gs: GameState): GameState {
		return gs;
	}

	/**
	 * Event hook that is triggered at the end of player turn
	 * @param gs GameState
	 * @returns GameState
	 */
	public atEndOfPlayerTurn(gs: GameState): GameState {
		return gs;
	}

	public getStats(): EnemyStata {
		return {
			name: this.name,
			damage: this.attackValue,
			health: this.health,
			status: this.status,
			action: "Attack!",
		};
	}
}
