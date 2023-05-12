import { arnd } from "rndlib";
import { Arena } from "../game/Arena";
import { Dragon, Goblin, Kobold, Ogre, Orc, Skeleton } from "./Enemies";
import { Buckler } from "./items/Buckler";
import { Dagger } from "./items/Dagger";
import { HandAxe } from "./items/HandAxe";
import { LeatherBoots } from "./items/LeatherBoots";
import { LongSword } from "./items/LongSword";
import { Mace } from "./items/Mace";
import { RingOfHealing } from "./items/RingOfHealing";
import { RingOfRegeneration } from "./items/RingOfRegeneration";
import { Shield } from "./items/Shield";

import bgImg from "./pics/forestbg.jpg";
import { MinorWandOfFire } from "./items/MinorWandOfFire";
import { Katana } from "./items/Katana";
import { GoblinLord, GoblinSorcerer, GoblinWarrior } from "./enemies/Goblins";
import { OrcBerserker, OrcShaman, OrcWarlord } from "./enemies/Orcs";
import { ARENADIFFICULTY } from "./Difficulties";

const availableEnemies: { enemy: string; difficulty: number }[] = [
	{ enemy: "Goblin Warrior", difficulty: 1 },
	{ enemy: "Goblin Sorcerer", difficulty: 1 },
	{ enemy: "Goblin Lord", difficulty: 2 },
	{ enemy: "Orc Berserker", difficulty: 2 },
	{ enemy: "Orc Shaman", difficulty: 3 },
	{ enemy: "Orc Warlord", difficulty: 5 },
	// { enemy: "Kobold", difficulty: 1 },
	// { enemy: "Orc", difficulty: 3 },
	// { enemy: "Ogre", difficulty: 4 },
	// { enemy: "Dragon", difficulty: 8 },
];

export class ArenaForestEncounter extends Arena {
	protected rewardItems = [LongSword, HandAxe, Mace, Dagger, Buckler, LeatherBoots, Shield, RingOfHealing, MinorWandOfFire, Katana];

	constructor(difficulty: ARENADIFFICULTY) {
		super(`${difficulty} Forest Encounter`, [], "#559944", bgImg);

		let diff = this.DIFFICULTYLIMIT.get(difficulty) || 0;

		while (diff > 0) {
			const elist = availableEnemies.filter((e) => e.difficulty <= diff);

			const en = arnd(elist);

			diff -= en.difficulty;

			switch (en.enemy) {
				case "Goblin Warrior":
					this.enemies.push(new GoblinWarrior());
					break;
				case "Goblin Sorcerer":
					this.enemies.push(new GoblinSorcerer());
					break;
				case "Goblin Lord":
					this.enemies.push(new GoblinLord());
					break;
				case "Orc Berserker":
					this.enemies.push(new OrcBerserker());
					break;
				case "Orc Shaman":
					this.enemies.push(new OrcShaman());
					break;
				case "Orc Warlord":
					this.enemies.push(new OrcWarlord());
					break;
				// case "Ogre":
				// 	this.enemies.push(new Ogre());
				// 	break;
				// case "Dragon":
				// 	this.enemies.push(new Dragon());
				// 	break;
				default:
					break;
			}
		}

		// super("Goblin Ambush", [new Goblin()], "#559944", bgImg);
	}
}
