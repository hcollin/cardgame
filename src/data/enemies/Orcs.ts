import { Game } from "phaser";
import { ENEMYACTIONS, ENEMYACTIONTARGETS, Enemy, EnemyAction } from "../../game/Enemy";
import { DAMAGETYPE } from "../../models/Card";
import { EFFECTS } from "../../models/Effects";

import orcBerserker from "./pics/orcBerserker.jpeg";
import orcShaman from "./pics/orcShaman.jpeg";
import orcWarlord from "./pics/orcWarlord.jpeg";
import { ArenaState } from "../../models/ArenaState";
import { ENEMYDATA } from "../EnemyData";

abstract class OrcRace extends Enemy {
	protected groups: string[] = ["Orcs"];
}

export class OrcBerserker extends OrcRace {
	protected name: string = "Orc Berserker";
	protected maxHealth: number = 18;

	public readonly difficulty: number = ENEMYDATA["Orc Berserker"].difficultyNumber;

	protected experienceValue: number = ENEMYDATA["Orc Berserker"].experienceValue;

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

	public readonly difficulty: number = ENEMYDATA["Orc Shaman"].difficultyNumber;

	protected experienceValue: number = ENEMYDATA["Orc Shaman"].experienceValue;

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

	public readonly difficulty: number = ENEMYDATA["Orc Warlord"].difficultyNumber;

	protected experienceValue: number = ENEMYDATA["Orc Warlord"].experienceValue;

	public readonly image: string = orcWarlord;

	protected actions: EnemyAction[] = [
		{
			action: ENEMYACTIONS.ATTACK,
			target: ENEMYACTIONTARGETS.HERO,
			effect: EFFECTS.STUN,
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
	 * @param as
	 * @param act
	 * @returns
	 */
	protected special1(as: ArenaState, act: EnemyAction): ArenaState {
		// Get all allies
		const allies = as.arena.enemies.filter((e) => e instanceof OrcRace && e.id !== this.id);

		// Add the BOOSTED effect to all allies
		allies.forEach((e) => e.causeEffect(EFFECTS.BOOST, 2));

		return { ...as };
	}
}
