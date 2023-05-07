import { Game } from "phaser";
import { ENEMYACTIONS, ENEMYACTIONTARGETS, Enemy, EnemyAction } from "../../game/Enemy";
import { DAMAGETYPE } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";

import orcBerserker from "./pics/orcBerserker.jpeg";
import orcShaman from "./pics/orcShaman.jpeg";
import orcWarlord from "./pics/orcWarlord.jpeg";
import { GameState } from "../../models/GameState";

abstract class OrcRace extends Enemy {
	protected groups: string[] = ["Orcs"];
}

export class OrcBerserker extends OrcRace {
	protected name: string = "Orc Berserker";
	protected maxHealth: number = 18;

	public readonly difficulty: number = 2;

	protected experienceValue: number = 25;

	public readonly image: string = orcBerserker;

	protected actions: EnemyAction[] = [
		{
			action: ENEMYACTIONS.ATTACK,
			target: ENEMYACTIONTARGETS.HERO,
			value: 5,
		},
		{
			action: ENEMYACTIONS.ATTACK,
			target: ENEMYACTIONTARGETS.HERO,
			value: 5,
		},
		{
			action: ENEMYACTIONS.WAIT,
			target: ENEMYACTIONTARGETS.SELF,
		},
		{
			action: ENEMYACTIONS.ATTACK,
			target: ENEMYACTIONTARGETS.HERO,
			value: 12,
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

export class OrcShaman extends OrcRace {
	protected name: string = "Orc Shaman";
	protected maxHealth: number = 21;

	public readonly difficulty: number = 3;

	protected experienceValue: number = 35;

	public readonly image: string = orcShaman;

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
			target: ENEMYACTIONTARGETS.OTHERS,
			value: 5,
		},
		{
			action: ENEMYACTIONS.ATTACK,
			target: ENEMYACTIONTARGETS.HERO,
			damageType: DAMAGETYPE.FIRE,
			value: 3,
		},
	];

	constructor() {
		super();
	}
}

export class OrcWarlord extends OrcRace {
	protected name: string = "Orc Warlord";
	protected maxHealth: number = 45;

	public readonly difficulty: number = 5;

	protected experienceValue: number = 125;

	public readonly image: string = orcWarlord;

	protected actions: EnemyAction[] = [
		{
			action: ENEMYACTIONS.ATTACK,
			target: ENEMYACTIONTARGETS.HERO,
			effect: EFFECTS.STUNNED,
			value: 10,
		},
		{
			action: ENEMYACTIONS.BLOCK,
			target: ENEMYACTIONTARGETS.SELF,
			value: 8,
		},
		{
			action: ENEMYACTIONS.ATTACK,
			target: ENEMYACTIONTARGETS.HERO,
			value: 5,
		},
		{
			action: ENEMYACTIONS.SPECIAL1,
			target: ENEMYACTIONTARGETS.OTHERS,
			value: 1,
		},
	];

	constructor() {
		super();
	}

	/**
	 * Orc Warlord's special ability gives all allies a BOOSTED Effect, that increases their damage output by 25%
	 * @param gs
	 * @param act
	 * @returns
	 */
	protected special1(gs: GameState, act: EnemyAction): GameState {
		// Get all allies
		const allies = gs.arena.enemies.filter((e) => e instanceof OrcRace && e.id !== this.id);

		// Add the BOOSTED effect to all allies
		allies.forEach((e) => e.causeEffect(EFFECTS.BOOSTED, 2));

		return { ...gs };
	}
}
