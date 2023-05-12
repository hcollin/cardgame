import { arnds } from "rndlib";
import { Buckler } from "../data/items/Buckler";
import { HandAxe } from "../data/items/HandAxe";
import { LeatherArmor } from "../data/items/LeatherArmor";
import { LongSword } from "../data/items/LongSword";
import { Mace } from "../data/items/Mace";
import { RingOfHealing } from "../data/items/RingOfHealing";
import { RingOfRegeneration } from "../data/items/RingOfRegeneration";
import { Shield } from "../data/items/Shield";
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
import { ENEMYDATA, EnemyData } from "../data/EnemyData";
import { ARENADIFFICULTY, getDifficultyLevel, getEnemyLevelsInDifficulty } from "../data/Difficulties";


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

	protected rewardItems: Item[] = [
		Dagger,
		ShortSword,
		LongSword,
		Katana,

		Mace,

		HandAxe,

		Buckler,
		Shield,

		LeatherArmor,

		LeatherBoots,

		RingOfHealing,
		RingOfRegeneration,

		CloakOfSwiftness,

		MinorWandOfFire,
	];

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
	public getRewardOptions(): Item[] {
		if (this.rewardItems.length <= this.rewardCount) return this.rewardItems;
		return arnds(this.rewardItems, this.rewardCount, true);
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

	/**
	 * Generate a random arena based on the difficulty and theme
	 * @param difficulty
	 * @param themeName
	 */
	public static generate(difficulty: ARENADIFFICULTY, themeName: string): Arena {
		const theme = ARENATHEMES[themeName];

		const eLevels = getEnemyLevelsInDifficulty(difficulty);
		const getMaxLevel = getDifficultyLevel(difficulty);

		// const validEnemiesData = Array.from(ENEMYDATA.v).filter((ed: EnemyData) => {
		// 	if(ed.difficultyNumber > eLevels[1]) return false;
		// 	if(ed.difficultyNumber < eLevels[0]) return false;
		// 	if(!theme.enemies.includes(ed.name)) return false;
		// 	return true;
		// });

		return new Arena(theme.name(), [], "", theme.bgImage);
	}
}



function getEnemyByName(ename: string): Enemy {

	const eData = ENEMYDATA[ename];
	if (!eData) throw new Error("Invalid enemy name");

	return new eData.enemyClass();
}

// function getEnemyLevelLimits(dif: ARENADIFFICULTY): [number, number] {
	
// }


