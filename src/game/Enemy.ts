import { rnd } from "rndlib";
import { DAMAGETYPE, Damage } from "../models/Card";
import { GameState } from "../models/GameState";
import { getDamageRange } from "./ItemTools";
import { EFFECTS } from "../models/Effects";
import { v4 } from "uuid";

export enum ENEMYSTATUS {
	ALIVE = "alive",
	DEAD = "dead",
}

export interface EnemyStats {
	name: string;
	size: ENEMYSIZE;
	damage: number;
	health: number;
	status: ENEMYSTATUS;
	effects: Map<EFFECTS, number>;
	action: string;
}

export enum ENEMYACTIONS {
	ATTACK = "ATTACK",
	DEFEND = "DEFEND",
	WAIT = "WAIT",
	HEAL = "HEAL",
	ESCAPE = "ESCAPE",
	SPECIAL1 = "SPECIAL1",
	SPECIAL2 = "SPECIAL2",
	SPECIAL3 = "SPECIAL3",
}

export enum ENEMYACTIONTARGETS {
	SELF = "SELF",
	HERO = "HERO",
	WORLD = "WORLD",
	OTHERS = "OTHERS",
}

export interface EnemyAction {
	action: ENEMYACTIONS;
	target: ENEMYACTIONTARGETS;
	value?: number;
	description?: string;
}

export enum ENEMYSIZE {
	SMALL = "SMALL",
	MEDIUM = "MEDIUM",
	LARGE = "LARGE",
	HUGE = "HUGE"
}
export class Enemy {
	public id: string = "";

	protected name: string = "No name";
	protected health: number;
	protected maxHealth: number = 100;
	protected attackValue: number = 5;

	protected size: ENEMYSIZE = ENEMYSIZE.MEDIUM; 

	protected armor: number = 0;

	protected vulnerableTo: DAMAGETYPE[] = [];
	protected resistantTo: DAMAGETYPE[] = [];

	protected effectImmunities: EFFECTS[] = [];

	protected effects: Map<EFFECTS, number> = new Map();

	private status: ENEMYSTATUS = ENEMYSTATUS.ALIVE;

	public image: string = "";

	// This is array contains the latest damage taken by the enemy, so that in can be shown on the screen
	public damageTaken: {type: DAMAGETYPE, amount: number}[] = [];

	protected actions: EnemyAction[] = [];
	protected nextAction: number = 0;

	

	constructor() {
		this.id = v4();
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

	public beforeDamage() {
		this.damageTaken = [];
	}

	public takeDamage(damage: Damage): void {
		const damageRange = this.getDamagePotential(damage);

		const damageTaken = rnd(damageRange[0], damageRange[1]);

		this.health -= damageTaken;

		this.damageTaken.push({type: damage.type, amount: damageTaken});

		if (this.health <= 0) {
			this.status = ENEMYSTATUS.DEAD;
		}
	}

	public getDamagePotential(damage: Damage): [number, number] {
		let dmg: number = damage.amount;
		if (this.vulnerableTo.includes(damage.type)) {
			dmg = Math.round(damage.amount * 1.5);
		}

		if (this.resistantTo.includes(damage.type)) {
			dmg = Math.round(damage.amount * 0.5);
		}

		if (this.effectIsActive(EFFECTS.STUNNED)) {
			dmg = Math.round(dmg * 1.25);
		}

		const damageRange = getDamageRange({...damage, amount: dmg});

		return damageRange;
	}

	public isVulnerableTo(type: DAMAGETYPE): boolean {
		return this.vulnerableTo.includes(type);
	}

	public isResistantTo(type: DAMAGETYPE): boolean {
		return this.resistantTo.includes(type);
	}

	public causeEffect(effect: EFFECTS) {
		if(this.effectImmunities.includes(effect)) { return; }
		if (this.effects.has(effect)) {
			this.effects.set(effect, this.effects.get(effect)! + 1);
		} else {
			this.effects.set(effect, 1);
		}

		// If the enemy has both burning and frozen effects, only leave the one with most turns left and substract the other from it
		if (this.effects.has(EFFECTS.BURNING) && this.effects.has(EFFECTS.FROZEN)) {
			const burningTurns = this.effects.get(EFFECTS.BURNING)!;
			const frozenTurns = this.effects.get(EFFECTS.FROZEN)!;
			if (burningTurns > frozenTurns) {
				this.effects.set(EFFECTS.BURNING, burningTurns - frozenTurns);
				this.effects.delete(EFFECTS.FROZEN);
			} else {
				if (frozenTurns > burningTurns) {
					this.effects.set(EFFECTS.FROZEN, frozenTurns - burningTurns);
					this.effects.delete(EFFECTS.BURNING);
				} else {
					this.effects.delete(EFFECTS.BURNING);
					this.effects.delete(EFFECTS.FROZEN);
				}
			}
		}
	}

	public resolveAction(gs: GameState): GameState {
		if (this.isDead()) {
			return gs;
		}

		const act = this.actions[this.nextAction];

		switch (act.action) {
			case ENEMYACTIONS.ATTACK:
				return this.actionAttack(gs, act);
			case ENEMYACTIONS.DEFEND:
				return this.actionDefend(gs, act);
			case ENEMYACTIONS.HEAL:
				return this.actionHeal(gs, act);
			case ENEMYACTIONS.ESCAPE:
				break;
			case ENEMYACTIONS.WAIT:
				return { ...gs };
			case ENEMYACTIONS.SPECIAL1:
				break;
			case ENEMYACTIONS.SPECIAL2:
				break;
			case ENEMYACTIONS.SPECIAL3:
				break;
			default:
				break;
		}

		return { ...gs };
	}

	protected actionAttack(gs: GameState, act: EnemyAction): GameState {
		if (!this.isAbletoAct()) {
			return gs;
		}
		let damage = act.value || this.attackValue;

		if (damage <= gs.hero.armor) {
			gs.hero.armor -= damage;
			damage = 0;
		}
		if (damage > gs.hero.armor) {
			damage -= gs.hero.armor;
			gs.hero.armor = 0;
		}

		gs.hero.health -= damage;
		return { ...gs };
	}

	protected actionHeal(gs: GameState, act: EnemyAction): GameState {
		this.health += act.value || 0;
		if (this.health > this.maxHealth) {
			this.health = this.maxHealth;
		}

		return { ...gs };
	}

	protected actionDefend(gs: GameState, act: EnemyAction): GameState {
		this.armor += act.value || 0;
		return { ...gs };
	}

	public resetEnemy(): void {
		this.health = this.maxHealth;
		this.status = ENEMYSTATUS.ALIVE;
	}

	public isDead(): boolean {
		return this.status === ENEMYSTATUS.DEAD;
	}

	public effectIsActive(effect: EFFECTS): number {
		const val = this.effects.get(effect);
		if (!val) {
			return 0;
		}
		return val;
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

	public cleanUpEndOfPlayerTurn(gs: GameState): GameState {
		this.damageTaken = [];
		
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

		this.nextAction++;
		if (this.nextAction >= this.actions.length) this.nextAction = 0;

		return { ...gs };
	}

	public getStats(): EnemyStats {
		const act = this.actions[this.nextAction];

		return {
			name: this.name,
			size: this.size,
			damage: this.attackValue,
			health: this.health,
			status: this.status,
			action: this.nextActionString(),
			effects: this.effects,
		};
	}

	protected isAbletoAct(): boolean {
		if (this.status === ENEMYSTATUS.DEAD) return false;
		if (this.effects.has(EFFECTS.STUNNED)) return false;
		if (this.effects.has(EFFECTS.FROZEN)) return false;
		return true;
	}

	protected nextActionString(): string {
		if (!this.actions[this.nextAction]) return "";
		const act = this.actions[this.nextAction];

		const strs: string[] = [];
		strs.push(act.action);
		// strs.push(act.target.toLowerCase());
		if (act.value) {
			// strs.push("for")
			strs.push(act.value.toString());
		}
		return strs.join(" ");
	}
}
