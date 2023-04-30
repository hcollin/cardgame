import { HeroStats, ITEMSLOT, LevelMods } from "../models/HeroStats";

import { LongSword } from "../data/items/LongSword";
import { Shield } from "../data/items/Shield";
import { Mace } from "../data/items/Mace";
import { Item } from "../models/Items";
import { arnd } from "rndlib";
import { ShortSword } from "../data/items/ShortSword";
import { HandAxe } from "../data/items/HandAxe";
import { Buckler } from "../data/items/Buckler";
import { Dagger } from "../data/items/Dagger";
import { LeatherArmor } from "../data/items/LeatherArmor";
import { GameState } from "../models/GameState";
import { RingOfHealing } from "../data/items/RingOfHealing";
import { RingOfRegeneration } from "../data/items/RingOfRegeneration";
import { CloakOfSwiftness } from "../data/items/CloakOfSwiftness";

export function createHero(): HeroStats {
	let hero: HeroStats = {
		name: nameGenerator(),
		health: 50,
		maxHealth: 50,

		aps: 4,
		maxAps: 4,

		baseArmor: 0,
		effectArmor: 0,
		armor: 0,
		

		effects: new Map(),

		score: 0,
		experience: 0,
		level: 1,

		inventory: [],

		activeItems: new Map<ITEMSLOT, Item>(),
		// activeItemRight: null,
		// activeItemLeft: null,
	};

	hero.inventory.push(LongSword);
	hero.inventory.push(ShortSword);
	hero.inventory.push(HandAxe);
	hero.inventory.push(Mace);

	hero.inventory.push(Shield);
	hero.inventory.push(Buckler);
	hero.inventory.push(Dagger);

	hero.inventory.push(LeatherArmor);

	hero.inventory.push(RingOfHealing);
	hero.inventory.push(RingOfRegeneration);

	// hero.inventory.push(CloakOfSwiftness);

	hero = equipItemRight(hero, LongSword);
	hero = equipItemLeft(hero, Shield);

	hero = equipItem(hero, LeatherArmor, ITEMSLOT.BODY);
	hero = equipItem(hero, RingOfHealing, ITEMSLOT.LEFT_FINGER);
	hero = equipItem(hero, RingOfRegeneration, ITEMSLOT.RIGHT_FINGER);
	// hero = equipItem(hero, CloakOfSwiftness, ITEMSLOT.CAPE);

	return hero;
}

export function resetHero(hero: HeroStats, heal = true): HeroStats {
	const nHero = checkForLevelUp(hero);
	const lMods = getLevelMods(nHero.level);
	console.log("Reset Hero", lMods);

	nHero.health = heal ? hero.maxHealth + lMods.health : hero.health;
	nHero.armor = getBaseArmorValue(nHero);
	nHero.effects.clear();
	nHero.maxAps = lMods.energy;
	nHero.aps = hero.maxAps;
	return { ...nHero };
}

export function cleanUpHeroAtTheEndOfTurn(hero: HeroStats): HeroStats {
	return { ...hero };
}

export function equipItemRight(hero: HeroStats, item: Item): HeroStats {
	// hero.activeItemRight = item;
	equipItem(hero, item, ITEMSLOT.RIGHT_HAND);
	return { ...hero };
}

export function equipItemLeft(hero: HeroStats, item: Item): HeroStats {
	// hero.activeItemLeft = item;
	equipItem(hero, item, ITEMSLOT.LEFT_HAND);
	return { ...hero };
}

export function equipItem(hero: HeroStats, item: Item, slot: ITEMSLOT): HeroStats {
	if (hero.inventory.find((i) => i.name === item.name) === undefined) {
		throw new Error("Hero does not have this item in inventory");
	}
	hero.activeItems.set(slot, item);

	if (item.onEquip) {
		return { ...item.onEquip(hero) };
	}
	return { ...hero };
}

export function unequipItem(hero: HeroStats, slot: ITEMSLOT): HeroStats {
	const item = hero.activeItems.get(slot);
	if (!item) return hero;

	hero.activeItems.delete(slot);

	if (item.onUnequip) {
		return { ...item.onUnequip(hero) };
	}
	return { ...hero };
}

export function getBaseArmorValue(hero: HeroStats): number {
	const lMod = getLevelMods(hero.level);
	return hero.baseArmor + lMod.armor + hero.effectArmor;
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
export function checkForLevelUp(hero: HeroStats): HeroStats {
	if (hero.experience >= LEVELEXPERIENCEREQUIREMENTS[hero.level + 1]) {
		hero.level += 1;
		console.log(`Level up to ${hero.level}`);
	}

	return { ...hero };
}

export function expForNextLevel(hero: HeroStats): number {
	return LEVELEXPERIENCEREQUIREMENTS[hero.level + 1];
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
		armor: 0,
		energy: 4,
		rHandSize: 3,
		lHandSize: 3,
		cape: false,
	};

	if (level >= 2) {
		mods.health += 5;
		mods.armor += 1;
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
		mods.armor += 2;
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

function nameGenerator(): string {
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
