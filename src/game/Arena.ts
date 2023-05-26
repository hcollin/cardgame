import { arnd, arnds, chance, rnd } from "rndlib";
import { BronzeBuckler } from "../data/items/BronzeBuckler";
import { HandAxe } from "../data/items/HandAxe";

import { LongSword } from "../data/items/LongSword";
import { IronMace } from "../data/items/IronMace";
import { RingOfHealing } from "../data/items/RingOfHealing";
import { RingOfRegeneration } from "../data/items/RingOfRegeneration";
import { RoundShield } from "../data/items/RoundShield";
import { Item } from "../models/Items";
import { Enemy } from "./Enemy";
import { ShortSword } from "../data/items/ShortSword";
import { Dagger } from "../data/items/Dagger";
import { LeatherBoots } from "../data/items/LeatherBoots";
import { CloakOfSwiftness } from "../data/items/CloakOfSwiftness";
import { MinorWandOfFire } from "../data/items/MinorWandOfFire";
import { Katana } from "../data/items/Katana";
import { Cloneable } from "../utils/Clonable";
import { ARENATHEMES } from "../data/arenaThemes";
import { ENEMYDATA, EnemyData, enemyDataArray } from "../data/EnemyData";
import { ARENADIFFICULTY, getDifficultyLevel, getEnemyLevelsInDifficulty } from "../data/Difficulties";
import { Gambeson, LeatherArmor, StuddedLeatherArmor } from "../data/items/LightArmor";
import { allItems } from "../data/items/itemLists";
import { ExperienceReward, GoldReward, HealReward, ItemReward, REWARDTYPE, Reward } from "../models/Rewards";
import { v4 } from "uuid";

export class Arena extends Cloneable {
	public name: string = "Arena";
	public enemies: Enemy[];
	public background: string;
	public bgImage: string | null = null;

	public readonly DIFFICULTYLIMIT: Map<ARENADIFFICULTY, number> = new Map([
		[ARENADIFFICULTY.VERYEASY, 3],
		[ARENADIFFICULTY.EASY, 5],
		[ARENADIFFICULTY.MEDIUM, 8],
		[ARENADIFFICULTY.HARD, 12],
		[ARENADIFFICULTY.VERYHARD, 16],
		[ARENADIFFICULTY.EXTREME, 20],
		[ARENADIFFICULTY.INSANE, 25],
	]);

	private difficulty: ARENADIFFICULTY = ARENADIFFICULTY.VERYEASY;
	private difficultyValue: number = -1;

	protected rewardItems: Item[] = [...allItems];

	protected rewardCount: number = 3;

	constructor(name: string, enemies: Enemy[], background: string, bgImage?: string) {
		super();
		this.name = name;
		this.enemies = enemies;
		this.background = background;
		this.bgImage = bgImage || null;
	}

	public resetArena(): void {
		this.enemies.forEach((enemy) => {
			enemy.resetEnemy();
		});
	}

	public getRewardOptions(): Reward[] {
		const rewards: Reward[] = [];
		return rewardGenerator(this.rewardItems, 3, this.difficulty);
		// if (this.rewardItems.length <= this.rewardCount) return this.rewardItems;
		// return arnds(this.rewardItems, this.rewardCount, true);
	}

	public getGoldReward(): number {
		return this.getDifficultyValue() * 10;
	}

	public getDifficulty(): ARENADIFFICULTY {
		if (this.difficultyValue > -1) {
			return this.difficulty;
		}

		const difValue = this.enemies.reduce((a, b) => a + b.difficulty, 0);

		this.difficultyValue = difValue;
		// return the ARENADIIFFICULTY enum value that is the closest to the difValue
		let closest = ARENADIFFICULTY.VERYEASY;
		let closestValue = this.DIFFICULTYLIMIT.get(ARENADIFFICULTY.VERYEASY) || 0;
		for (const [key, value] of this.DIFFICULTYLIMIT.entries()) {
			if (Math.abs(value - difValue) < Math.abs(closestValue - difValue)) {
				closest = key;
				closestValue = value;
			}
		}
		this.difficulty = closest;
		return closest;
	}

	public getDifficultyValue(): number {
		this.getDifficulty();
		return this.difficultyValue;
	}

	public setRewards(items: Item[], count: number): void {
		this.rewardItems = items;
		this.rewardCount = count;
	}

	/**
	 * Generate a random arena based on the difficulty and theme
	 * @param difficulty
	 * @param themeName
	 */
	public static generate(difficulty: ARENADIFFICULTY, themeName: string): Arena {
		const theme = ARENATHEMES[themeName];

		const eLevels = getEnemyLevelsInDifficulty(difficulty);
		const getMaxLevel = getDifficultyLevel(difficulty);

		const validEnemiesData = enemyDataArray().filter((ed: EnemyData) => {
			if (ed.difficultyNumber > eLevels[1]) return false;
			if (ed.difficultyNumber < eLevels[0]) return false;
			if (!theme.enemies.includes(ed.name)) return false;
			return true;
		});

		const enemies: Enemy[] = [];
		let totalDifficulty = 0;
		while (totalDifficulty < getMaxLevel) {
			const e = arnd(validEnemiesData);
			try {
				if (e.difficultyNumber + totalDifficulty > getMaxLevel) continue;
				enemies.push(new e.enemyClass());
				totalDifficulty += e.difficultyNumber;
			} catch (err) {
				console.warn("Could not generate enemy!");
				console.warn(err);
				console.log(e);
			}
		}

		const arena = new Arena(theme.name(), enemies, "", arnd(theme.bgImage));

		arena.setRewards(theme.rewardItems, theme.rewardCount);
		return arena;
	}

	/**
	 * Generate boss arena for the world
	 * @param difficulty
	 * @param themeName
	 * @returns
	 */
	public static generateBoss(difficulty: ARENADIFFICULTY, themeName: string): Arena {
		const theme = ARENATHEMES[themeName];

		// const eLevels = getEnemyLevelsInDifficulty(difficulty);
		// const getMaxLevel = getDifficultyLevel(difficulty);

		const validEnemiesData = enemyDataArray().filter((ed: EnemyData) => {
			return theme.bosses.includes(ed.name);
		});

		const enemies: Enemy[] = [];
		// let totalDifficulty = 0;
		// while (totalDifficulty < getMaxLevel) {
		// 	const e = arnd(validEnemiesData);
		// 	if (e.difficultyNumber + totalDifficulty > getMaxLevel) continue;
		// 	enemies.push(new e.enemyClass());
		// 	totalDifficulty += e.difficultyNumber;
		// }

		theme.bosses.forEach((b) => {
			const e = validEnemiesData.find((ed) => ed.name === b);
			if (!e) throw new Error("Invalid boss name");
			enemies.push(new e.enemyClass());
		});

		const arena = new Arena(theme.name(), enemies, "", arnd(theme.bgImage));

		arena.setRewards(theme.rewardItems, theme.rewardCount);
		return arena;
	}
}

function getEnemyByName(ename: string): Enemy {
	const eData = ENEMYDATA[ename];
	if (!eData) throw new Error("Invalid enemy name");

	return new eData.enemyClass();
}

// function getEnemyLevelLimits(dif: ARENADIFFICULTY): [number, number] {

// }

export function rewardGenerator(items: Item[], count: number, difficulty: ARENADIFFICULTY): Reward[] {
	const rewards: Reward[] = [];

	const diffValue = getDifficultyLevel(difficulty);
	// rewards.push(createItemReward(items));

	while (rewards.length < count) {
		const typeCounts: Map<REWARDTYPE, number> = rewards.reduce((counts: Map<REWARDTYPE, number>, reward) => {
			const val = counts.get(reward.type) || 0;
			counts.set(reward.type, val + 1);
			return counts;
		}, new Map<REWARDTYPE, number>());

		const itemChance = 80 - (typeCounts.get("ITEM") || 0) * 40;
		const potionChance = 40 - (typeCounts.get("POTION") || 0) * 40;
		const healthChance = 20 - (typeCounts.get("HEAL") || 0) * 20;
		const experienceChance = 10 - (typeCounts.get("EXPERIENCE") || 0) * 10;
		const goldChance = 30 - (typeCounts.get("GOLD") || 0) * 30;

		const maxChances = itemChance + potionChance + healthChance + experienceChance + goldChance;

		let num = rnd(1, maxChances);

		// console.log(`${num}/${maxChances}`, itemChance, potionChance, healthChance, experienceChance, goldChance);

		if (num <= itemChance) {
			rewards.push(createItemReward(items));
			continue;
		}
		num -= itemChance;

		if (num <= potionChance) {
			rewards.push(createPotionReward(items));
			continue;
		}
		num -= potionChance;

		if (num <= healthChance) {
			rewards.push(createHealReward(Math.max(10, diffValue)));
			continue;
		}
		num -= healthChance;

		if (num <= goldChance) {
			rewards.push(createGoldReward(diffValue * 10));
			continue;
		}
		num -= goldChance;

		if (num <= experienceChance) {
			rewards.push(createExperienceReward(diffValue * 5));
			continue;
		}
		num -= experienceChance;

		// rewards.push(createItemReward(items));
	}

	return rewards;
}

function createItemReward(items: Item[]): ItemReward {
	return {
		id: v4(),
		type: "ITEM",
		item: arnd(items.filter((i) => !i.groups.includes("Potion"))),
	};
}

function createPotionReward(items: Item[]): ItemReward {
	return {
		id: v4(),
		type: "POTION",
		item: arnd(items.filter((i) => i.groups.includes("Potion"))),
	};
}

function createHealReward(baseAmount: number): HealReward {
	return {
		id: v4(),
		type: "HEAL",
		heal: baseAmount,
	};
}

function createGoldReward(baseAmount: number): GoldReward {
	return {
		id: v4(),
		type: "GOLD",
		gold: baseAmount,
	};
}

function createExperienceReward(baseAmount: number): ExperienceReward {
	return {
		id: v4(),
		type: "EXPERIENCE",
		experience: baseAmount,
	};
}
