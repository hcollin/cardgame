import { arnd } from "rndlib";
import { ARENADIFFICULTY, Arena } from "../game/Arena";
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

const availableEnemies: { enemy: string; difficulty: number }[] = [
	{ enemy: "Goblin", difficulty: 1 },
	{ enemy: "Kobold", difficulty: 1 },
	{ enemy: "Orc", difficulty: 3 },
	{ enemy: "Ogre", difficulty: 4 },
	{ enemy: "Dragon", difficulty: 8 },
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
				case "Goblin":
					this.enemies.push(new Goblin());
					break;
				case "Kobold":
					this.enemies.push(new Kobold());
					break;
				case "Orc":
					this.enemies.push(new Orc());
					break;
				case "Ogre":
					this.enemies.push(new Ogre());
					break;
				case "Dragon":
					this.enemies.push(new Dragon());
					break;
				default:
					break;
			}
		}

		// super("Goblin Ambush", [new Goblin()], "#559944", bgImg);
	}
}
