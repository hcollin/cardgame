import { rnd } from "rndlib";
import { DAMAGEFLAGS, DAMAGETYPE, Damage } from "../models/Card";

import { getDamageRange } from "./ItemTools";
import { EFFECTS } from "../models/Effects";
import { v4 } from "uuid";
import { Cloneable } from "../utils/Clonable";
import { effStore } from "../utils/usePlayerEffect";
import { ArenaState } from "../models/ArenaState";

export enum ENEMYSTATUS {
	ALIVE = "alive",
	DEAD = "dead",
}

export interface EnemyStats {
	name: string;
	size: ENEMYSIZE;

	health: number;
	block: number;
	status: ENEMYSTATUS;
	effects: Map<EFFECTS, number>;
	action: string;
	groups: string[];
}

export enum ENEMYACTIONS {
	ATTACK = "ATTACK",
	BLOCK = "BLOCK",
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
	ENEMIES = "ENEMIES",
}

export interface EnemyAction {
	action: ENEMYACTIONS;
	target: ENEMYACTIONTARGETS;
	damageType?: DAMAGETYPE;
	effect?: EFFECTS;
	value?: number | ((as: ArenaState) => number);
	description?: string;
}

export enum ENEMYSIZE {
	SMALL = "SMALL",
	MEDIUM = "MEDIUM",
	LARGE = "LARGE",
	HUGE = "HUGE",
}
export class Enemy extends Cloneable {
	public id: string = "";

	protected name: string = "No name";

	protected groups: string[] = [];

	protected health: number;
	protected maxHealth: number = 100;

	public readonly difficulty: number = 1;

	protected size: ENEMYSIZE = ENEMYSIZE.MEDIUM;

	protected block: number = 0;
	protected armor: number = 0;

	protected vulnerableTo: DAMAGETYPE[] = [];
	protected resistantTo: DAMAGETYPE[] = [];

	protected effectImmunities: EFFECTS[] = [];

	protected effects: Map<EFFECTS, number> = new Map();

	private status: ENEMYSTATUS = ENEMYSTATUS.ALIVE;

	protected experienceValue: number = 0;

	public image: string = "";

	// This is array contains the latest damage taken by the enemy, so that in can be shown on the screen
	public damageTaken: { type: DAMAGETYPE; amount: number }[] = [];

	protected actions: EnemyAction[] = [];
	protected nextAction: number = 0;

	constructor() {
		super();
		this.id = v4();
		this.health = this.maxHealth;
	}

	public getName(): string {
		return this.name;
	}

	public getHealth(): number {
		return this.health;
	}

	public getArmor(): number {
		return this.armor;
	}

	public getGroups(): string[] {
		return this.groups;
	}

	public getExperienceValue(): number {
		return this.experienceValue;
	}

	public beforeDamage() {
		this.damageTaken = [];
	}

	public takeDamage(damage: Damage, as: ArenaState): void {
		const damageRange = this.getDamagePotential(damage);

		const flags = damage.flags || [];

		let damageTaken = rnd(damageRange[0], damageRange[1]);

		if (!flags.includes(DAMAGEFLAGS.ARMORPIERCING)) {
			if (damageTaken < this.block) {
				this.block -= damageTaken;
				damageTaken = 0;
			} else {
				damageTaken -= this.block;
				this.block = 0;
			}
		}

		this.health -= damageTaken;
		if (flags.includes(DAMAGEFLAGS.VAMPIRIC)) {
			const healAmount = Math.round(damageTaken / 2);
			as.hero.healHero(healAmount);
			effStore.addEffect("heal", `Drained ${healAmount} health,`);
		}

		this.damageTaken.push({ type: damage.type, amount: damageTaken });

		if (this.health <= 0) {
			this.status = ENEMYSTATUS.DEAD;
		}
	}

	public healMe(amount: number): void {
		this.health += amount || 0;
		if (this.health > this.maxHealth) {
			this.health = this.maxHealth;
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

		if (this.effectIsActive(EFFECTS.STUN)) {
			dmg = Math.round(dmg * 1.25);
		}

		const damageRange = getDamageRange({ ...damage, amount: dmg });

		return damageRange;
	}

	public isVulnerableTo(type: DAMAGETYPE): boolean {
		return this.vulnerableTo.includes(type);
	}

	public isResistantTo(type: DAMAGETYPE): boolean {
		return this.resistantTo.includes(type);
	}

	public causeEffect(effect: EFFECTS, amount?: number) {
		if (this.effectImmunities.includes(effect)) {
			return;
		}
		const am = amount || 1;

		if (this.effects.has(effect)) {
			this.effects.set(effect, this.effects.get(effect)! + am);
		} else {
			this.effects.set(effect, am);
		}

		// If the enemy has both burning and frozen effects, only leave the one with most turns left and substract the other from it
		if (this.effects.has(EFFECTS.BURN) && this.effects.has(EFFECTS.FROZEN)) {
			const burningTurns = this.effects.get(EFFECTS.BURN)!;
			const frozenTurns = this.effects.get(EFFECTS.FROZEN)!;
			if (burningTurns > frozenTurns) {
				this.effects.set(EFFECTS.BURN, burningTurns - frozenTurns);
				this.effects.delete(EFFECTS.FROZEN);
			} else {
				if (frozenTurns > burningTurns) {
					this.effects.set(EFFECTS.FROZEN, frozenTurns - burningTurns);
					this.effects.delete(EFFECTS.BURN);
				} else {
					this.effects.delete(EFFECTS.BURN);
					this.effects.delete(EFFECTS.FROZEN);
				}
			}
		}
	}

	public resolveAction(as: ArenaState): ArenaState {
		if (this.isDead()) {
			return as;
		}

		const act = this.actions[this.nextAction];

		switch (act.action) {
			case ENEMYACTIONS.ATTACK:
				return this.actionAttack(as, act);
			case ENEMYACTIONS.BLOCK:
				return this.actionBlock(as, act);
			case ENEMYACTIONS.HEAL:
				return this.actionHeal(as, act);
			case ENEMYACTIONS.ESCAPE:
				break;
			case ENEMYACTIONS.WAIT:
				return { ...as };
			case ENEMYACTIONS.SPECIAL1:
				return this.actionSpecial1(as, act);
			case ENEMYACTIONS.SPECIAL2:
				return this.actionSpecial2(as, act);
			case ENEMYACTIONS.SPECIAL3:
				return this.actionSpecial3(as, act);
			default:
				break;
		}

		return { ...as };
	}

	protected actionAttack(as: ArenaState, act: EnemyAction): ArenaState {
		if (!this.isAbletoAct()) {
			return as;
		}
		let damage = parseActValue(act, as);

		if (this.effectIsActive(EFFECTS.BOOST)) {
			damage = Math.round(damage * 1.5);
		}

		as.hero.takeDamage(damage, act);
		return { ...as };
	}

	protected actionHeal(as: ArenaState, act: EnemyAction): ArenaState {
		if (!this.isAbletoAct()) {
			return as;
		}

		if (act.target === ENEMYACTIONTARGETS.SELF) {
			this.healMe(parseActValue(act, as));
		}
		if (act.target === ENEMYACTIONTARGETS.OTHERS || act.target === ENEMYACTIONTARGETS.ENEMIES) {
			as.arena.enemies.forEach((enemy) => {
				if (!(act.target === ENEMYACTIONTARGETS.OTHERS && enemy.id === this.id)) {
					enemy.healMe(parseActValue(act, as));
				}
			});
		}

		return { ...as };
	}

	protected actionBlock(as: ArenaState, act: EnemyAction): ArenaState {
		if (!this.isAbletoAct()) {
			return as;
		}
		this.block += parseActValue(act, as);
		return { ...as };
	}

	protected actionSpecial1(as: ArenaState, act: EnemyAction): ArenaState {
		return { ...as };
	}

	protected actionSpecial2(as: ArenaState, act: EnemyAction): ArenaState {
		return { ...as };
	}

	protected actionSpecial3(as: ArenaState, act: EnemyAction): ArenaState {
		return { ...as };
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
	 * @param as arenaState
	 * @returns
	 */
	public atDeath(as: ArenaState): ArenaState {
		return as;
	}

	/**
	 * Event hook that is triggeered at the end of enemy turn
	 * @param as arenaState
	 * @returns arenaState
	 */
	public atEndOfEnemyTurn(as: ArenaState): ArenaState {
		return as;
	}

	/**
	 * Event hook that is triggered at the start of enemy turn
	 * @param as arenaState
	 * @returns arenaState
	 */
	public atStartOfEnemyTurn(as: ArenaState): ArenaState {
		return as;
	}

	/**
	 * Event hook that is triggeed at the start player turn
	 * @param as arenaState
	 * @returns arenaState
	 */
	public atStartOfPlayerTurn(as: ArenaState): ArenaState {
		return as;
	}

	/**
	 * Event hook that is triggered at the end of player turn
	 * @param as arenaState
	 * @returns arenaState
	 */
	public atEndOfPlayerTurn(as: ArenaState): ArenaState {
		this.block = 0;
		return as;
	}

	public cleanUpEndOfPlayerTurn(as: ArenaState): ArenaState {
		this.damageTaken = [];

		return as;
	}

	public cleanUpEndOfEnemyTurn(as: ArenaState): ArenaState {
		if (this.effects.has(EFFECTS.POISON)) {
			this.takeDamage({ amount: 1, type: DAMAGETYPE.POISON, variation: 0 }, as);
		}

		if (this.effects.has(EFFECTS.BURN)) {
			this.takeDamage({ amount: 2, type: DAMAGETYPE.FIRE, variation: 1 }, as);
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

		return { ...as };
	}

	public getStats(as: ArenaState): EnemyStats {
		const act = this.actions[this.nextAction];

		return {
			name: this.name,
			size: this.size,
			health: this.health,
			block: this.block,
			status: this.status,
			action: this.nextActionString(as),
			effects: this.effects,
			groups: this.groups,
		};
	}

	protected isAbletoAct(): boolean {
		if (this.status === ENEMYSTATUS.DEAD) return false;
		if (this.effects.has(EFFECTS.STUN)) return false;
		if (this.effects.has(EFFECTS.FROZEN)) return false;
		return true;
	}

	protected nextActionString(as: ArenaState): string {
		if (!this.actions[this.nextAction]) return "";
		const act = this.actions[this.nextAction];

		if (act.description) return act.description;

		const strs: string[] = [];
		if(act.damageType) {
			strs.push(act.damageType);

		} else {
			strs.push(act.action);
		}
		

		if (act.value) {
			strs.push(parseActValue(act, as).toString());
		}
		return strs.join(" ");
	}
}

export function parseActValue(act: EnemyAction, as: ArenaState): number {
	if (!act.value) return 0;
	if (typeof act.value === "number") return act.value;
	if (typeof act.value === "function") return act.value(as);
	return 0;
}
