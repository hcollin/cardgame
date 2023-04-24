import { HeroStats } from "../models/HeroStats";

import { LongSword } from "../data/items/LongSword";
import { Shield } from "../data/items/Shield";
import { Mace } from "../data/items/Mace";
import { Item } from "../models/Items";
import { arnd } from "rndlib";

export function createHero(): HeroStats {
	let hero: HeroStats = {
		name: nameGenerator(),
		health: 50,
		maxHealth: 50,

		aps: 4,
		maxAps: 4,

		armor: 0,
		defaultArmor: 0,

		effects: new Map(),

		score: 0,

		inventory: [],
		activeItemRight: null,
		activeItemLeft: null,
	};

	hero.inventory.push(LongSword);
	hero.inventory.push(Shield);
	hero.inventory.push(Mace);

	hero = equipItemRight(hero, LongSword);
	hero = equipItemLeft(hero, Shield);

	return hero;
}

export function resetHero(hero: HeroStats, heal=true): HeroStats {
	hero.health = heal ? hero.maxHealth : hero.health;
	hero.armor = hero.defaultArmor;
	hero.effects.clear();
	hero.aps = hero.maxAps;
	return { ...hero };
}

export function cleanUpHeroAtTheEndOfTurn(hero: HeroStats): HeroStats {
	return { ...hero };
}

export function equipItemRight(hero: HeroStats, item: Item): HeroStats {
	hero.activeItemRight = item;
	return { ...hero };
}

export function equipItemLeft(hero: HeroStats, item: Item): HeroStats {
	hero.activeItemLeft = item;
	return { ...hero };
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
