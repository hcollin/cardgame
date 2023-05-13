import { ITEMSLOT, LevelMods } from "../models/HeroStats";

import { Item } from "../models/Items";
import { arnd } from "rndlib";

import Hero from "./Hero";

export function equipItemRight(hero: Hero, item: Item): Hero {
	// hero.activeItemRight = item;
	equipItem(hero, item, ITEMSLOT.RIGHT_HAND);
	return hero;
}

export function equipItemLeft(hero: Hero, item: Item): Hero {
	// hero.activeItemLeft = item;
	equipItem(hero, item, ITEMSLOT.LEFT_HAND);
	return hero;
}

export function equipItem(hero: Hero, item: Item, slot: ITEMSLOT): Hero {
	hero.equipItem(item, slot);
	return hero;
}

export function unequipItem(hero: Hero, slot: ITEMSLOT): Hero {
	hero.unequipItem(slot);
	return hero;
}


const LEVELEXPERIENCEREQUIREMENTS: number[] = [0, 0, 40, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

/**
 * Level up hero if they have enough experience
 *
 * TODO: implement
 *
 * Level 1: 0
 * Level 2: 100  	+1 default armor
 * Level 3: 300		+1 base energy
 * Level 4: 600	    +1 hand size on right hand
 * Level 5: 1000    +1 hand size on left hand
 * Level 6: 1500    open up Cape inventory slot
 * Level 7: 2100    +2 default armor
 * Level 8: 2800    +1 base energy
 * Level 9: 3600    +1 hand size to both hands
 * Level 10: 4500   +1 base energy
 *
 * @param hero
 * @returns
 */
// export function checkForLevelUp(hero: HeroStats): HeroStats {
// 	if (hero.experience >= LEVELEXPERIENCEREQUIREMENTS[hero.level + 1]) {
// 		hero.level += 1;
// 		console.log(`Level up to ${hero.level}`);
// 	}

// 	return { ...hero };
// }

export function expForNextLevel(hero: Hero): number {
	return LEVELEXPERIENCEREQUIREMENTS[hero.getLevel() + 1];
}

/**
 * Return the level based modifiers for a given level
 *
 *
 * @param level
 */
export function getLevelMods(level: number): LevelMods {
	const mods: LevelMods = {
		health: 40,
		block: 0,
		energy: 4,
		rHandSize: 3,
		lHandSize: 3,
		cape: false,
	};

	if (level >= 2) {
		mods.health += 5;
		mods.block += 1;
	}
	if (level >= 3) {
		mods.health += 5;
		mods.energy += 1;
	}
	if (level >= 4) {
		mods.health += 5;
		mods.rHandSize += 1;
	}
	if (level >= 5) {
		mods.health += 5;
		mods.lHandSize += 1;
	}
	if (level >= 6) {
		mods.health += 10;
		mods.cape = true;
	}
	if (level >= 7) {
		mods.health += 10;
		mods.block += 2;
	}
	if (level >= 8) {
		mods.health += 10;
		mods.energy += 1;
	}
	if (level >= 9) {
		mods.health += 10;
		mods.rHandSize += 1;
		mods.lHandSize += 1;
	}
	if (level >= 10) {
		mods.health += 20;
		mods.energy += 1;
	}

	return mods;
}

export function nameGenerator(): string {
	const firstNames: string[] = [
		"Gorath",
		"Lirien",
		"Thorn",
		"Raziel",
		"Sarathiel",
		"Zarek",
		"Kael",
		"Xandria",
		"Drakon",
		"Tyrion",
		"Elandriel",
		"Auron",
		"Aeloria",
		"Kethryes",
		"Galadriel",
		"Zephyr",
		"Varian",
		"Leif",
		"Niamh",
		"Cassius",
	];

	const lastNames: string[] = [
		"Ironfist",
		"Shadowblade",
		"Grimheart",
		"Stormcaller",
		"Bloodmoon",
		"Blacksteel",
		"Fireborn",
		"Swiftblade",
		"Frosthammer",
		"Stormbringer",
		"Silvermist",
		"Darkblade",
		"Sunfire",
		"Shadowstalker",
		"Moonblade",
		"Thunderstrike",
		"Bloodfury",
		"Ironbark",
		"Stormchaser",
		"Nightshade",
	];

	return `${arnd(firstNames)} ${arnd(lastNames)}`;
}
