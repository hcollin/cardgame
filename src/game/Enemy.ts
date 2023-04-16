import { rnd } from "rndlib";
import { DAMAGETYPE, Damage } from "../models/Card";
import { GameState } from "../models/GameState";
import { getDamageRange } from "./ItemTools";
import { EFFECTS } from "../models/Effects";

export enum ENEMYSTATUS {
	ALIVE = "alive",
	DEAD = "dead",
}

export interface EnemyStata {
	name: string;
	damage: number;
	health: number;
	status: ENEMYSTATUS;
	effects: Map<EFFECTS, number>;
	action: string;
}

export class Enemy {
	protected name: string = "No name";
	protected health: number;
	protected maxHealth: number = 100;
	protected attackValue: number = 5;

	protected armor: number = 0;

	protected vulnerableTo: DAMAGETYPE[] = [];
	protected resistantTo: DAMAGETYPE[] = [];

	protected effects: Map<EFFECTS, number> = new Map();

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
		if (!this.isAbletoAct()) {
			return 0;
		}
		return this.attackValue;
	}

	public takeDamage(damage: Damage): void {
		const damageRange = getDamageRange(damage);

		if (this.vulnerableTo.includes(damage.type)) {
			damageRange[0] = Math.round(damageRange[0] * 1.5);
			damageRange[1] = Math.round(damageRange[1] * 1.5);
		}

		if (this.resistantTo.includes(damage.type)) {
			damageRange[0] = Math.round(damageRange[0] * 0.5);
			damageRange[1] = Math.round(damageRange[1] * 0.5);
		}

		const damageTaken = rnd(damageRange[0], damageRange[1]);

		this.health -= damageTaken;

		if (this.health <= 0) {
			this.status = ENEMYSTATUS.DEAD;
		}
	}

	public causeEffect(effect: EFFECTS) {
		if (this.effects.has(effect)) {
			this.effects.set(effect, this.effects.get(effect)! + 1);
		} else {
			this.effects.set(effect, 1);
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

	public cleanUpEndOfEnemyTurn(gs: GameState): GameState {
		if (this.effects.has(EFFECTS.POISONED)) {
			this.takeDamage({ amount: 1, type: DAMAGETYPE.POISON, variation: 0 });
		}

		// Remove 1 from each effect
		this.effects.forEach((value, key) => {
			if (value === 1) {
				this.effects.delete(key);
			} else {
				this.effects.set(key, value - 1);
			}
		});

		return {...gs};
	}

	public getStats(): EnemyStata {
		return {
			name: this.name,
			damage: this.attackValue,
			health: this.health,
			status: this.status,
			action: "Attack!",
			effects: this.effects,
		};
	}

	protected isAbletoAct(): boolean {
		if (this.status === ENEMYSTATUS.DEAD) return false;
		if (this.effects.has(EFFECTS.STUNNED)) return false;
		if (this.effects.has(EFFECTS.FROZEN)) return false;
		return true;
	}
}
